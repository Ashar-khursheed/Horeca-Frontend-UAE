"use client";

import type { Stripe } from "@stripe/stripe-js";
import { Banknote, CreditCard, Lock, Wallet } from "lucide-react";
import { useRef, useState } from "react";
import {
  StripeCardForm,
  type StripeCardHandle,
} from "./payments/stripe-card-form";
import type {
  PaymentMethod,
  StripeBillingDetails,
  StripePaymentMethodResult,
} from "./payments/types";

export type { PaymentMethod };

export interface CheckoutPaymentHandle {
  selectedMethod: PaymentMethod;
  createStripePaymentMethod: (
    billing: StripeBillingDetails,
  ) => Promise<StripePaymentMethodResult>;
  getStripe: () => Stripe | null;
}

interface Props {
  onHandleReady?: (handle: CheckoutPaymentHandle) => void;
}

export default function CheckoutPayment({ onHandleReady }: Props) {
  const [selected, setSelected] = useState<PaymentMethod>("ccavenue");
  const stripeCardRef = useRef<StripeCardHandle>(null);

  const handleRef = useRef<CheckoutPaymentHandle>({
    selectedMethod: "ccavenue",
    async createStripePaymentMethod() {
      throw new Error("Stripe is not selected.");
    },
    getStripe: () => null,
  });

  handleRef.current.selectedMethod = selected;
  handleRef.current.getStripe = () =>
    stripeCardRef.current?.getStripe() ?? null;
  handleRef.current.createStripePaymentMethod = async (billing) => {
    if (selected !== "stripe") {
      throw new Error("Please select Stripe to pay by card.");
    }
    if (!stripeCardRef.current) {
      throw new Error("Card form is still loading. Please wait a moment.");
    }
    return stripeCardRef.current.createPaymentMethod(billing);
  };

  const didNotify = useRef(false);
  if (!didNotify.current && onHandleReady) {
    didNotify.current = true;
    Promise.resolve().then(() => onHandleReady(handleRef.current));
  }

  return (
    <div className="mt-5 rounded-[7px] border-2 border-[#E2E8F0] overflow-hidden">
      <div className="flex items-center justify-between bg-[#E2E8F0] px-6 py-3">
        <h2 className="text-lg font-semibold text-[#424242]">Payment Method</h2>
      </div>

      <div className="px-6">
        <PaymentOption
          id="pm-ccavenue"
          title="Credit / Debit Card"
          subtitle="Pay securely with CCAvenue — Visa, Mastercard, Amex & more"
          icon={<CreditCard size={20} />}
          selected={selected === "ccavenue"}
          onSelect={() => setSelected("ccavenue")}
          badge={
            <div className="hidden md:flex shrink-0 items-center gap-1.5 self-center">
              <CardBadge label="VISA" bg="bg-[#1a1f71]" color="text-white" />
              <CardBadge label="MC" bg="bg-[#eb001b]" color="text-white" />
              <CardBadge label="AMEX" bg="bg-[#007bc1]" color="text-white" />
            </div>
          }
        >
          <p className="mt-2 text-xs text-gray-500">
            You will be redirected to CCAvenue to complete your payment
            securely. Your order is created only after payment succeeds.
          </p>
        </PaymentOption>

        <PaymentOption
          id="pm-stripe"
          title="Pay With Stripe"
          subtitle="Pay by card on this page — Visa, Mastercard, Amex & more"
          icon={<Wallet size={20} />}
          selected={selected === "stripe"}
          onSelect={() => setSelected("stripe")}
        >
          <StripeCardForm ref={stripeCardRef} />
        </PaymentOption>

        <PaymentOption
          id="pm-cod"
          title="Cash On Delivery"
          subtitle="Pay in cash when your order is delivered"
          icon={<Banknote size={20} />}
          selected={selected === "cod"}
          onSelect={() => setSelected("cod")}
          isLast
        >
          <p className="mt-2 text-xs text-gray-500">
            No card is charged now. Please keep the exact amount ready for the
            delivery agent.
          </p>
        </PaymentOption>
      </div>

      <div className="flex items-center gap-2 bg-[#F8FAFC] px-6 py-3 text-xs text-gray-500">
        <Lock size={12} className="text-[#186737]" />
        Your payment is encrypted and processed securely.
      </div>
    </div>
  );
}

function PaymentOption({
  id,
  title,
  subtitle,
  icon,
  selected,
  disabled = false,
  isLast = false,
  onSelect,
  badge,
  children,
}: {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  selected: boolean;
  disabled?: boolean;
  isLast?: boolean;
  onSelect?: () => void;
  badge?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={`flex items-start gap-3 py-4 transition-colors rounded-[7px] px-3 -mx-3 ${
        isLast ? "" : "border-b-2 border-[#E2E8F0]"
      } ${
        disabled
          ? "cursor-not-allowed opacity-60"
          : selected
            ? "bg-[#F0F9F4]"
            : "hover:bg-gray-50"
      }`}
    >
      <input
        id={id}
        type="radio"
        name="paymentMethod"
        checked={selected}
        disabled={disabled}
        onChange={onSelect}
        className="mt-0.5 h-4 w-4 shrink-0 accent-[#186737] disabled:cursor-not-allowed cursor-pointer"
      />
      <button
        type="button"
        disabled={disabled}
        onClick={onSelect}
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
          selected ? "bg-[#186737] text-white" : "bg-gray-100 text-gray-500"
        }`}
        aria-hidden
      >
        {icon}
      </button>
      <div className="flex-1 min-w-0">
        <button
          type="button"
          disabled={disabled}
          onClick={onSelect}
          className="flex w-full items-start justify-between gap-2 text-left"
        >
          <span>
            <span className="block text-base font-semibold text-[#212121]">
              {title}
            </span>
            <span className="mt-0.5 block text-sm text-gray-500">
              {subtitle}
            </span>
          </span>
          {badge}
        </button>
        {selected && children ? <div className="mt-1">{children}</div> : null}
      </div>
    </div>
  );
}

function CardBadge({
  label,
  bg,
  color,
}: {
  label: string;
  bg: string;
  color: string;
}) {
  return (
    <span
      className={`${bg} ${color} rounded px-1.5 py-0.5 text-[10px] font-bold tracking-wide`}
    >
      {label}
    </span>
  );
}
