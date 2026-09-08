"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export type QuoteProcessStep = "idle" | "details" | "quote" | "email" | "done";

const STEPS: { key: QuoteProcessStep; label: string; subLabel: string }[] = [
  { key: "details", label: "Saving your details", subLabel: "Securing your contact information..." },
  { key: "quote", label: "Creating quotation", subLabel: "Building your custom quote..." },
  { key: "email", label: "Sending quotation email", subLabel: "Emailing a copy to you..." },
];

const ORDER: QuoteProcessStep[] = ["details", "quote", "email", "done"];

function stepIndex(step: QuoteProcessStep) {
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
    <div className="w-8 h-8 rounded-full border-2 border-gray-200 bg-gray-50 shrink-0" />
  );
}

export default function QuoteProcessingModal({
  step,
  success,
  onGoHome,
}: {
  step: QuoteProcessStep;
  success: boolean;
  onGoHome: () => void;
}) {
  const isOpen = step !== "idle" || success;
  const currentIdx = stepIndex(step);
  const isDone = step === "done";
  const [secs, setSecs] = useState(5);

  useEffect(() => {
    if (!success) return;
    setSecs(5);
    const t = setInterval(() => {
      setSecs((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => clearInterval(t);
  }, [success]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
        >
          <motion.div
            key={success ? "success" : "progress"}
            initial={{ scale: 0.85, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 30 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-7"
          >
            {success ? (
              <div className="text-center">
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
                <h2 className="text-lg font-bold text-[#186737]">Quotation Successful</h2>
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                  Your customized quotation has been generated and emailed to you.
                  A PDF copy is downloading now. Our team will follow up shortly.
                </p>
                <p className="text-xs text-gray-400 mt-4">
                  Redirecting to homepage in {secs} second{secs === 1 ? "" : "s"}…
                </p>
                <button
                  type="button"
                  onClick={onGoHome}
                  className="mt-4 w-full py-2.5 rounded-[7px] bg-[#186737] hover:bg-[#145c30] text-white text-sm font-semibold transition-colors"
                >
                  Go to Homepage
                </button>
              </div>
            ) : (
              <>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-[#186737]/10 flex items-center justify-center mx-auto mb-3">
                    <svg className="w-8 h-8 text-[#186737] animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">
                    {isDone ? "Almost done!" : "Generating Quotation"}
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">
                    Please wait, do not close or refresh.
                  </p>
                </div>

                <div className="space-y-3">
                  {STEPS.map((s, i) => {
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
                          <p
                            className={`text-sm font-semibold leading-tight ${
                              status === "done"
                                ? "text-[#186737]"
                                : status === "active"
                                  ? "text-gray-900"
                                  : "text-gray-300"
                            }`}
                          >
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

                <div className="mt-5 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-[#186737] rounded-full"
                    initial={{ width: "0%" }}
                    animate={{
                      width: `${isDone ? 100 : Math.max(8, (currentIdx / (ORDER.length - 1)) * 100)}%`,
                    }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  />
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
