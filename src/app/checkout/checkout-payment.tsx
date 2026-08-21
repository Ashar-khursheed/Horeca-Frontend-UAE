"use client";

import { useRef, useState } from "react";
import { Banknote, CreditCard, Lock, Wallet } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type PaymentMethod = "ccavenue" | "stripe" | "cod";

export interface CheckoutPaymentHandle {
  /** Which payment method the customer has selected. */
  selectedMethod: PaymentMethod;
}

interface Props {
  /** Expose internal handle to parent page */
  onHandleReady?: (handle: CheckoutPaymentHandle) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CheckoutPayment({ onHandleReady }: Props) {
  const [selected, setSelected] = useState<PaymentMethod>("ccavenue");

  // ── Expose handle to parent via callback ────────────────────────────────────
  const handleRef = useRef<CheckoutPaymentHandle>({
    selectedMethod: "ccavenue",
  });
  handleRef.current.selectedMethod = selected;

  const didNotify = useRef(false);
  if (!didNotify.current && onHandleReady) {
    didNotify.current = true;
    Promise.resolve().then(() => onHandleReady(handleRef.current));
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="mt-5 rounded-[7px] border-2 border-[#E2E8F0] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between bg-[#E2E8F0] px-6 py-3">
        <h2 className="text-lg font-semibold text-[#424242]">
          Payment Method
        </h2>
      </div>

      <div className="px-6">
        <PaymentOption
          id="pm-ccavenue"
          title="Credit / Debit Card"
          subtitle="Pay securely with CCAvenue — Visa, Mastercard, Amex & more"
          icon={<CreditCard size={20} />}
          selected={selected === "ccavenue"}
          onSelect={() => setSelected("ccavenue")}
        >
          <div className="flex shrink-0 items-center gap-1.5 self-center md:block hidden">
            <CardBadge label="VISA" bg="bg-[#1a1f71]" color="text-white" />
            <CardBadge label="MC" bg="bg-[#eb001b]" color="text-white" />
            <CardBadge label="AMEX" bg="bg-[#007bc1]" color="text-white" />
          </div>
        </PaymentOption>

        <PaymentOption
          id="pm-stripe"
          title="Pay With Stripe"
          subtitle="Coming soon"
          icon={<Wallet size={20} />}
          selected={false}
          disabled
        />

        <PaymentOption
          id="pm-cod"
          title="Cash On Delivery"
          subtitle="Coming soon"
          icon={<Banknote size={20} />}
          selected={false}
          disabled
          isLast
        />
      </div>

      {/* Security note */}
      <div className="flex items-center gap-2 bg-[#F8FAFC] px-6 py-3 text-xs text-gray-500">
        <Lock size={12} className="text-[#186737]" />
        Your payment is encrypted and processed securely.
      </div>
    </div>
  );
}

// ─── Small helpers ────────────────────────────────────────────────────────────

function PaymentOption({
  id,
  title,
  subtitle,
  icon,
  selected,
  disabled = false,
  isLast = false,
  onSelect,
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
  children?: React.ReactNode;
}) {
  return (
    <label
      htmlFor={id}
      className={`flex items-start gap-3 py-4 transition-colors rounded-[7px] px-3 -mx-3 ${
        isLast ? "" : "border-b-2 border-[#E2E8F0]"
      } ${
        disabled
          ? "cursor-not-allowed opacity-60"
          : selected
            ? "cursor-pointer bg-[#F0F9F4]"
            : "cursor-pointer hover:bg-gray-50"
      }`}
    >
      <input
        id={id}
        type="radio"
        name="paymentMethod"
        checked={selected}
        disabled={disabled}
        onChange={onSelect}
        className="mt-0.5 h-4 w-4 shrink-0 accent-[#186737] disabled:cursor-not-allowed"
      />
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
          selected ? "bg-[#186737] text-white" : "bg-gray-100 text-gray-500"
        }`}
      >
        {icon}
      </span>
      <span className="flex-1 min-w-0">
        <span className="flex items-center gap-2">
          <span className="block text-base font-semibold text-[#212121]">
            {title}
          </span>
          {disabled && (
            <span className="rounded-full bg-gray-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-gray-500">
              Coming Soon
            </span>
          )}
        </span>
        <span className="mt-0.5 block text-sm text-gray-500">{subtitle}</span>
      </span>
      {children}
    </label>
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
