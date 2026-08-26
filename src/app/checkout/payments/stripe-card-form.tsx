"use client";

import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import { forwardRef, useImperativeHandle, useState } from "react";
import {
  getStripePublishableKey,
  type StripeBillingDetails,
  type StripePaymentMethodResult,
} from "./types";

export interface StripeCardHandle {
  createPaymentMethod: (
    billing: StripeBillingDetails,
  ) => Promise<StripePaymentMethodResult>;
  getStripe: () => Stripe | null;
}

const cardElementOptions = {
  hidePostalCode: false,
  style: {
    base: {
      fontSize: "16px",
      color: "#212121",
      fontFamily: "inherit",
      "::placeholder": { color: "#9ca3af" },
    },
    invalid: { color: "#dc2626" },
  },
};

const StripeCardInner = forwardRef<StripeCardHandle>(
  function StripeCardInner(_props, ref) {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState("");

    useImperativeHandle(
      ref,
      () => ({
        getStripe: () => stripe,
        async createPaymentMethod(billing) {
          if (!stripe || !elements) {
            throw new Error(
              "Card form is still loading. Please wait a moment.",
            );
          }

          const card = elements.getElement(CardElement);
          if (!card) {
            throw new Error("Card form is not ready. Please try again.");
          }

          setError("");
          const { error: pmError, paymentMethod } =
            await stripe.createPaymentMethod({
              type: "card",
              card,
              billing_details: {
                name: billing.name,
                email: billing.email,
                phone: billing.phone,
                address: billing.address,
              },
            });

          if (pmError || !paymentMethod) {
            const message =
              pmError?.message ?? "Please check your card details.";
            setError(message);
            throw new Error(message);
          }

          return {
            paymentMethodId: paymentMethod.id,
            card: {
              brand: paymentMethod.card?.brand,
              last4: paymentMethod.card?.last4,
              exp_month: paymentMethod.card?.exp_month,
              exp_year: paymentMethod.card?.exp_year,
            },
          };
        },
      }),
      [stripe, elements],
    );

    return (
      <div className="mt-3 space-y-2">
        <div className="rounded-md border border-gray-200 bg-white px-3 py-3">
          <CardElement
            options={cardElementOptions}
            onChange={(event) => setError(event.error?.message ?? "")}
          />
        </div>
        {error ? <p className="text-[11px] text-red-500">{error}</p> : null}
        {getStripePublishableKey().startsWith("pk_test_") ? (
          <p className="text-[11px] text-gray-400">
            Test card: 4242 4242 4242 4242 · any future expiry · any CVC
          </p>
        ) : null}
      </div>
    );
  },
);

let stripePromise: ReturnType<typeof loadStripe> | null = null;

function getStripePromise() {
  const key = getStripePublishableKey();
  if (!key) return null;
  if (!stripePromise) stripePromise = loadStripe(key);
  return stripePromise;
}

export const StripeCardForm = forwardRef<StripeCardHandle>(
  function StripeCardForm(_props, ref) {
    const publishableKey = getStripePublishableKey();
    const stripePromise = getStripePromise();

    if (!publishableKey || !stripePromise) {
      return (
        <p className="mt-3 text-sm text-red-500">
          Stripe is not configured. Add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY and
          restart the app.
        </p>
      );
    }

    return (
      <Elements stripe={stripePromise}>
        <StripeCardInner ref={ref} />
      </Elements>
    );
  },
);

StripeCardInner.displayName = "StripeCardInner";
StripeCardForm.displayName = "StripeCardForm";
