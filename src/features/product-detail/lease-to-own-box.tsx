"use client";

import { Check } from "lucide-react";
import { useState } from "react";
import LeaseToOwnModal from "./lease-to-own-modal";

const TRUST_POINTS = [
  "Low weekly payments, up to 100% tax deductible",
  "Change, or return the equipment at any time",
  "Startups welcome",
] as const;

const fmtMoney = (n: number) =>
  Number(n).toLocaleString("en-US", {
    maximumFractionDigits: 0,
  });

/** Estimated weekly payment: round(price / 1000) * 13 */
export function estimatedWeeklyLeasePayment(price: number): number {
  return Math.round(price / 1000) * 13;
}

export function isLeaseToOwnEligible(
  price: number,
  quoteAvailable?: boolean | null,
): boolean {
  if (quoteAvailable) return false;
  if (!Number.isFinite(price) || price < 1000) return false;
  return true;
}

type LeaseToOwnBoxProps = {
  price: number;
  currency?: string;
  quoteAvailable?: boolean | null;
};

export default function LeaseToOwnBox({
  price,
  currency = "$",
  quoteAvailable,
}: LeaseToOwnBoxProps) {
  const [modalOpen, setModalOpen] = useState(false);

  if (!isLeaseToOwnEligible(price, quoteAvailable)) return null;

  const weekly = estimatedWeeklyLeasePayment(price);
  const day = (weekly / 7).toFixed(2);

  return (
    <>
      <div className="mt-3 border border-[#c3e6d4] rounded-[7px] bg-gradient-to-b from-white to-[#f0f9f4] p-3.5">
        <div className="inline-flex items-center gap-1.5 text-[10px] font-extrabold tracking-[0.08em] uppercase text-[#186737] mb-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#186737]" />
          Lease to Own
          <span className="ml-1 font-semibold normal-case tracking-normal text-[10px] text-[#64748b] bg-white border border-[#c3e6d4] rounded-full px-1.5 py-0.5">
            Estimated
          </span>
        </div>

        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-extrabold text-[#14532d] leading-snug">
              Just {currency}
              {fmtMoney(weekly)}/week instead of {currency}
              {fmtMoney(price)} today
            </p>
            <p className="text-[12.5px] text-[#3f6212] mt-1.5 leading-snug">
              Keep your cash in your business
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-[26px] font-extrabold text-[#186737] leading-none tracking-tight">
              {currency}
              {fmtMoney(weekly)}
            </p>
            <p className="text-xs font-semibold text-gray-500 mt-0.5">
              per week
            </p>
            <p className="text-xs font-semibold text-gray-500 mt-1">
              <span className="font-extrabold text-[#145c30]">
                {currency}
                {day}
              </span>{" "}
              / day
            </p>
          </div>
        </div>

        <ul className="mt-3 space-y-1.5" aria-label="Lease to Own highlights">
          {TRUST_POINTS.map((line) => (
            <li
              key={line}
              className="flex items-start gap-2 text-[12.5px] font-semibold text-[#14532d] leading-snug"
            >
              <Check
                size={14}
                strokeWidth={2.5}
                className="text-[#186737] shrink-0 mt-0.5"
                aria-hidden
              />
              <span>{line}</span>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="mt-3 w-full h-11 rounded-[7px] text-sm font-bold text-white bg-[#186737] hover:bg-[#145c30] transition-colors"
        >
          Apply now
        </button>

        <p className="mt-2.5 text-[11px] text-gray-400 leading-snug">
          Estimate only. Final rate confirmed after approval.
        </p>
      </div>

      <LeaseToOwnModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
