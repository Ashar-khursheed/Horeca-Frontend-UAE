import type { Stripe } from "@stripe/stripe-js";
import { apiUrls } from "@/apis/api-endpoint";
import { makeApiRequest } from "@/apis/axios-instance";
import type {
  StripeBillingDetails,
  StripeCardSummary,
  StripeChargeResult,
} from "./types";

interface StripeIntentResponse {
  success?: boolean;
  requires_action?: boolean;
  client_secret?: string;
  payment_intent_id?: string;
  error?: string;
  message?: string;
}

function unwrapStripeIntent(
  res: StripeIntentResponse & { data?: StripeIntentResponse },
): StripeIntentResponse {
  if (res?.client_secret) return res;
  if (res?.data?.client_secret) return { ...res, ...res.data };
  return res ?? {};
}

async function verifyPaymentIntent(
  stripe: Stripe,
  clientSecret: string,
): Promise<{ id: string; status: string }> {
  const { paymentIntent, error } =
    await stripe.retrievePaymentIntent(clientSecret);
  if (error) throw new Error(error.message);
  if (!paymentIntent) throw new Error("Could not verify the Stripe payment.");
  return { id: paymentIntent.id, status: paymentIntent.status };
}

async function confirmIfNeeded(
  stripe: Stripe,
  clientSecret: string,
  status: string,
): Promise<string> {
  if (status === "succeeded")
    return (await verifyPaymentIntent(stripe, clientSecret)).id;

  if (status === "requires_action" || status === "requires_confirmation") {
    const { error, paymentIntent } =
      await stripe.confirmCardPayment(clientSecret);
    if (error) throw new Error(error.message);
    if (paymentIntent?.status !== "succeeded") {
      throw new Error(
        `Payment was not completed. Status: ${paymentIntent?.status ?? "unknown"}`,
      );
    }
    return paymentIntent.id;
  }

  throw new Error(`Payment was not completed. Status: ${status}`);
}

export async function chargeStripe(params: {
  stripe: Stripe;
  paymentMethodId: string;
  amount: number;
  currency: string;
  country: string;
  customer: StripeBillingDetails;
  card: StripeCardSummary;
}): Promise<StripeChargeResult> {
  const res = await makeApiRequest<StripeIntentResponse>(
    apiUrls.STRIPE_CREATE_PAYMENT_INTENT,
    {
      method: "POST",
      data: {
        payment_method_id: params.paymentMethodId,
        amount: Number(params.amount).toFixed(2),
        country: params.country,
        currency: params.currency,
        customer_info: {
          name: params.customer.name,
          email: params.customer.email,
          phone: params.customer.phone,
        },
      },
    },
  );

  const payload = unwrapStripeIntent(
    res as StripeIntentResponse & { data?: StripeIntentResponse },
  );

  if (payload.success === false) {
    throw new Error(
      payload.error ||
        payload.message ||
        "Stripe payment failed. Please try again.",
    );
  }

  if (payload.success && payload.payment_intent_id && !payload.client_secret) {
    return {
      paymentIntentId: payload.payment_intent_id,
      clientSecret: "",
      card: params.card,
    };
  }

  if (!payload.client_secret) {
    throw new Error(
      payload.error ||
        payload.message ||
        res?.error ||
        res?.message ||
        "Stripe payment failed. Please try again.",
    );
  }

  let status = "requires_confirmation";
  if (payload.requires_action) {
    status = "requires_action";
  } else {
    const verified = await verifyPaymentIntent(
      params.stripe,
      payload.client_secret,
    );
    status = verified.status;
  }

  const paymentIntentId = await confirmIfNeeded(
    params.stripe,
    payload.client_secret,
    status,
  );

  return {
    paymentIntentId: paymentIntentId || payload.payment_intent_id || "",
    clientSecret: payload.client_secret,
    card: params.card,
  };
}
