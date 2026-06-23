"use client";

import { AnimatePresence, motion } from "framer-motion";

export type OrderStep =
  | "idle"
  | "card"
  | "profile"
  | "address"
  | "payment"
  | "order"
  | "done";

const STEPS: { key: OrderStep; label: string; subLabel: string }[] = [
  { key: "card",    label: "Validating card",        subLabel: "Checking your card details..." },
  { key: "profile", label: "Saving information",     subLabel: "Updating your profile..." },
  { key: "address", label: "Confirming address",     subLabel: "Saving your delivery address..." },
  { key: "payment", label: "Processing payment",     subLabel: "Securely charging your card..." },
  { key: "order",   label: "Placing your order",     subLabel: "Finalising your order..." },
  { key: "done",    label: "Order placed!",          subLabel: "Redirecting to confirmation..." },
];

const ORDER: OrderStep[] = ["card", "profile", "address", "payment", "order", "done"];

function stepIndex(step: OrderStep) {
  return ORDER.indexOf(step);
}

function StepIcon({ status }: { status: "pending" | "active" | "done" }) {
  if (status === "done") {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="w-8 h-8 rounded-full bg-[#186737] flex items-center justify-center shrink-0"
      >
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      </motion.div>
    );
  }
  if (status === "active") {
    return (
      <div className="w-8 h-8 rounded-full border-2 border-[#186737] flex items-center justify-center shrink-0">
        <svg className="w-4 h-4 text-[#186737] animate-spin" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }
  return (
    <div className="w-8 h-8 rounded-full border-2 border-gray-200 bg-gray-50 flex items-center justify-center shrink-0" />
  );
}

export default function OrderProcessingModal({ step }: { step: OrderStep }) {
  const isOpen = step !== "idle";
  const currentIdx = stepIndex(step);
  const isDone = step === "done";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
        >
          <motion.div
            key="card"
            initial={{ scale: 0.85, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 30 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-7"
          >
            {/* Header */}
            <div className="text-center mb-6">
              {isDone ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className="w-16 h-16 rounded-full bg-[#186737]/10 flex items-center justify-center mx-auto mb-3"
                >
                  <svg className="w-8 h-8 text-[#186737]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-[#186737]/10 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8 text-[#186737] animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                </div>
              )}
              <h2 className="text-lg font-bold text-gray-900">
                {isDone ? "Order Placed!" : "Processing Order"}
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                {isDone ? "You will be redirected shortly..." : "Please wait, do not close or refresh."}
              </p>
            </div>

            {/* Steps */}
            <div className="space-y-3">
              {STEPS.filter((s) => s.key !== "done").map((s, i) => {
                const idx = stepIndex(s.key);
                const status =
                  idx < currentIdx ? "done" : idx === currentIdx ? "active" : "pending";
                return (
                  <motion.div
                    key={s.key}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-center gap-3"
                  >
                    <StepIcon status={status} />
                    <div className="min-w-0">
                      <p className={`text-sm font-semibold leading-tight ${
                        status === "done" ? "text-[#186737]" :
                        status === "active" ? "text-gray-900" : "text-gray-300"
                      }`}>
                        {s.label}
                      </p>
                      {status === "active" && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-[11px] text-gray-400 mt-0.5"
                        >
                          {s.subLabel}
                        </motion.p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Progress bar */}
            <div className="mt-5 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[#186737] rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: `${isDone ? 100 : (currentIdx / (ORDER.length - 1)) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
