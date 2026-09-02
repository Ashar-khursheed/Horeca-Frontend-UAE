"use client";

import type { Stripe } from "@stripe/stripe-js";
import { Banknote, CreditCard, Globe, Lock, Wallet } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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

export interface CheckoutPaymentProps {
  onHandleReady?: (handle: CheckoutPaymentHandle) => void;
  /** UAE: CCAvenue, Touras, Stripe, COD. Outside UAE: Stripe only. */
  isUae?: boolean;
  /** Order total — COD is blocked at AED 3,000 and above. */
  orderTotal?: number;
}

const COD_MAX_AED = 3000;

export default function CheckoutPayment({
  onHandleReady,
  isUae = process.env.NEXT_PUBLIC_REGION === "UAE",
  orderTotal = 0,
}: CheckoutPaymentProps) {
  const [selected, setSelected] = useState<PaymentMethod>(
    isUae ? "ccavenue" : "stripe",
  );
  const stripeCardRef = useRef<StripeCardHandle>(null);
  const codBlocked = isUae && orderTotal >= COD_MAX_AED;

  useEffect(() => {
    if (!isUae && selected !== "stripe") {
      setSelected("stripe");
    }
  }, [isUae, selected]);

  useEffect(() => {
    if (codBlocked && selected === "cod") {
      setSelected("ccavenue");
    }
  }, [codBlocked, selected]);

  const handleRef = useRef<CheckoutPaymentHandle>({
    selectedMethod: isUae ? "ccavenue" : "stripe",
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
        {isUae && (
          <>
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
              id="pm-touras"
              title="ADCB Touras"
              subtitle="Pay securely with ADCB Touras — Visa, Mastercard, Amex & more"
              icon={<Globe size={20} />}
              selected={selected === "touras"}
              onSelect={() => setSelected("touras")}
              badge={
                <div className="hidden md:flex shrink-0 items-center gap-1.5 self-center">
                  <CardBadge label="VISA" bg="bg-[#1a1f71]" color="text-white" />
                  <CardBadge label="MC" bg="bg-[#eb001b]" color="text-white" />
                  <CardBadge label="AMEX" bg="bg-[#007bc1]" color="text-white" />
                </div>
              }
            >
              <p className="mt-2 text-xs text-gray-500">
                You will be redirected to ADCB Touras to complete your payment
                securely. Your order is created only after payment succeeds.
              </p>
            </PaymentOption>
          </>
        )}

        <PaymentOption
          id="pm-stripe"
          title="Pay Online"
          subtitle="Pay securely by card on this page — Visa, Mastercard, Amex & more"
          icon={<Wallet size={20} />}
          selected={selected === "stripe"}
          onSelect={() => setSelected("stripe")}
          isLast={!isUae}
        >
          <StripeCardForm ref={stripeCardRef} />
        </PaymentOption>

        {isUae && (
          <PaymentOption
            id="pm-cod"
            title="Cash On Delivery"
            subtitle={
              codBlocked
                ? "Not available for orders of AED 3,000 or more"
                : "Pay in cash when your order is delivered"
            }
            icon={<Banknote size={20} />}
            selected={selected === "cod"}
            disabled={codBlocked}
            onSelect={() => {
              if (!codBlocked) setSelected("cod");
            }}
            isLast
          >
            <p className="mt-2 text-xs text-gray-500">
              No card is charged now. Please keep the exact amount ready for the
              delivery agent.
            </p>
          </PaymentOption>
        )}
        {codBlocked && (
          <p className="pb-4 text-xs text-red-500">
            Cash on Delivery is not available because your order is AED 3,000 or
            more. Please pay by card.
          </p>
        )}
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

export function CheckoutPaymentSkeleton({
  isUae = process.env.NEXT_PUBLIC_REGION === "UAE",
}: {
  isUae?: boolean;
}) {
  const rows = isUae ? 4 : 1;
  return (
    <div className="mt-5 rounded-[7px] border-2 border-[#E2E8F0] overflow-hidden">
      <div className="flex items-center justify-between bg-[#E2E8F0] px-6 py-3">
        <div className="h-5 w-40 rounded bg-gray-300/80 animate-pulse" />
      </div>
      <div className="px-6">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className={`flex items-start gap-3 py-4 animate-pulse ${
              i < rows - 1 ? "border-b-2 border-[#E2E8F0]" : ""
            }`}
          >
            <div className="mt-0.5 h-4 w-4 shrink-0 rounded-full bg-gray-200" />
            <div className="h-9 w-9 shrink-0 rounded-full bg-gray-200" />
            <div className="min-w-0 flex-1 space-y-2 pt-0.5">
              <div className="h-4 w-44 max-w-full rounded bg-gray-200" />
              <div className="h-3 w-64 max-w-full rounded bg-gray-100" />
            </div>
            <div className="hidden md:flex shrink-0 items-center gap-1.5 self-center">
              <div className="h-5 w-10 rounded bg-gray-200" />
              <div className="h-5 w-8 rounded bg-gray-200" />
              <div className="h-5 w-12 rounded bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 bg-[#F8FAFC] px-6 py-3">
        <div className="h-3 w-3 rounded bg-gray-200 animate-pulse" />
        <div className="h-3 w-56 max-w-full rounded bg-gray-200 animate-pulse" />
      </div>
    </div>
  );
}
