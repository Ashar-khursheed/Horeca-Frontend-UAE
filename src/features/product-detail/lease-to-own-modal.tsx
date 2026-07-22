"use client";

import { Modal } from "@/components/modal";
import { Phone } from "lucide-react";
import { useEffect, useState } from "react";
import LeaseToOwnForm from "./lease-to-own-form";

interface LeaseToOwnModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LeaseToOwnModal({
  isOpen,
  onClose,
}: LeaseToOwnModalProps) {
  const [step, setStep] = useState<"form" | "success">("form");

  useEffect(() => {
    if (isOpen) setStep("form");
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        step === "form"
          ? "See your offer"
          : "Thanks. One quick call and you're set."
      }
      showFooter={false}
      width="max-w-xl"
    >
      {step === "form" ? (
        <div className="px-1 pb-2">
          <p className="text-sm text-gray-500 mb-4">
            Quick details. Then call to finish.
          </p>
          <LeaseToOwnForm onSuccess={() => setStep("success")} />
        </div>
      ) : (
        <div className="px-1 pb-4 text-center">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#f0f9f4] border border-[#c3e6d4] flex items-center justify-center text-[#186737] text-xl font-bold">
            ✓
          </div>
          <p className="text-sm text-gray-600 mb-5 leading-relaxed">
            Our team is available now. Call and get your rate today, no waiting
            for a callback.
          </p>
          <a
            href="tel:+18664467322"
            className="flex items-center justify-center gap-2 w-full min-h-14 px-4 rounded-[7px] bg-[#186737] hover:bg-[#145c30] text-white font-extrabold text-base transition-colors shadow-[0_8px_20px_rgba(24,103,55,0.28)]"
          >
            <Phone size={18} />
            Call now: (866) 446-7322
          </a>
          <p className="mt-3 text-sm font-semibold text-[#166534]">
            Or we&apos;ll call you back soon.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="mt-4 text-xs font-semibold text-gray-400 underline underline-offset-2 hover:text-gray-600"
          >
            Got it
          </button>
        </div>
      )}
    </Modal>
  );
}
