"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { makeApiRequest } from "@/apis/axios-instance";
import { apiUrls } from "@/apis/api-endpoint";
import { Modal } from "@/components/ui/modal";
import { Send } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

type QAItem = {
  id: number;
  question: string;
  answer: string;
};

type QASectionProps = {
  items: QAItem[];
  productId: number;
};

export const QASection = ({ items, productId }: QASectionProps) => {
  const customer = useSelector((s: RootState) => s.profile.customer);

  const [questionText, setQuestionText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modal state (for guest users)
  const [modalOpen, setModalOpen] = useState(false);
  const [modalQuestion, setModalQuestion] = useState("");
  const [modalEmail, setModalEmail] = useState("");
  const [modalError, setModalError] = useState<string | null>(null);
  const [modalSubmitting, setModalSubmitting] = useState(false);
  const [modalSuccess, setModalSuccess] = useState(false);

  const leftItems = items.slice(0, Math.ceil(items.length / 2));
  const rightItems = items.slice(Math.ceil(items.length / 2));

  const callApi = async (email: string, question: string) => {
    await makeApiRequest(apiUrls.PRODUCT_QUESTION, {
      method: "POST",
      data: {
        email,
        type: "product",
        product_id: productId,
        question,
      },
    });
  };

  const handleSubmit = async () => {
    const trimmed = questionText.trim();
    if (!trimmed) return;

    if (!customer) {
      // Guest → open modal with prefilled question
      setModalQuestion(trimmed);
      setModalEmail("");
      setModalError(null);
      setModalSuccess(false);
      setModalOpen(true);
      return;
    }

    // Logged in → direct API call
    let email = "";
    try {
      const raw = localStorage.getItem("user");
      if (raw) email = (JSON.parse(raw) as { email: string }).email ?? "";
    } catch {}

    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      await callApi(email, trimmed);
      setQuestionText("");
      setSuccess(true);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Failed to submit question. Please try again.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleModalSubmit = async () => {
    const trimmedQ = modalQuestion.trim();
    const trimmedE = modalEmail.trim();
    if (!trimmedQ || !trimmedE) {
      setModalError("Please fill in all fields.");
      return;
    }

    setModalSubmitting(true);
    setModalError(null);

    try {
      await callApi(trimmedE, trimmedQ);
      setModalSuccess(true);
      setQuestionText("");
      setTimeout(() => {
        setModalOpen(false);
        setModalSuccess(false);
      }, 1500);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Failed to submit question. Please try again.";
      setModalError(msg);
    } finally {
      setModalSubmitting(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
        {/* Q&A Accordion — 2 columns, 50/50 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-0 items-start">
          <Accordion type="single" collapsible className="w-full">
            {leftItems.map((qa) => (
              <AccordionItem key={qa.id} value={`qa-${qa.id}`}>
                <AccordionTrigger className="text-sm font-medium text-gray-800 px-2">
                  {qa.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-gray-600 leading-relaxed px-2">
                  <div dangerouslySetInnerHTML={{ __html: qa.answer }} />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <Accordion type="single" collapsible className="w-full">
            {rightItems.map((qa) => (
              <AccordionItem key={qa.id} value={`qa-${qa.id}`}>
                <AccordionTrigger className="text-sm font-medium text-gray-800 px-2">
                  {qa.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-gray-600 leading-relaxed px-2">
                  <div dangerouslySetInnerHTML={{ __html: qa.answer }} />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Ask a Question */}
        <div className="lg:border-l lg:border-gray-100 lg:pl-8 hidden">
          <p className="text-sm font-bold text-gray-800 mb-1">
            Write your question about the product...
          </p>
          <p className="text-xs text-gray-500 mb-3">
            Our team will get back to you with an expert answer.
          </p>
          <textarea
            value={questionText}
            onChange={(e) => {
              setQuestionText(e.target.value);
              setSuccess(false);
              setError(null);
            }}
            placeholder="e.g. Does this refrigerator work in a walk-in environment?"
            rows={5}
            className="w-full border border-gray-200 rounded-[7px] px-4 py-3 text-sm text-gray-700 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-[#186737]/20 focus:border-[#186737] transition-all"
          />
          {success && (
            <p className="mt-2 text-xs text-[#186737] font-medium">
              Your question has been submitted successfully!
            </p>
          )}
          {error && (
            <p className="mt-2 text-xs text-red-500">{error}</p>
          )}
          <button
            onClick={handleSubmit}
            disabled={!questionText.trim() || submitting}
            className="mt-3 w-full bg-[#186737] hover:bg-[#145c30] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold py-2.5 rounded-[7px] transition-colors flex items-center justify-center gap-2"
          >
            {submitting ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send size={14} strokeWidth={2} />
            )}
            {submitting ? "Submitting..." : "Get An Answer"}
          </button>
        </div>
      </div>

      {/* Guest Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Submit Your Questions About Product"
        width="max-w-lg"
        showFooter={false}
      >
        <div className="space-y-4 p-2">
          <div>
            <label className="block text-sm text-gray-700 mb-1.5">
              Enter Your Questions
            </label>
            <textarea
              value={modalQuestion}
              onChange={(e) => setModalQuestion(e.target.value)}
              placeholder="Write your question here"
              rows={4}
              className="w-full border border-gray-200 rounded-[7px] px-4 py-3 text-sm text-gray-700 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-[#186737]/20 focus:border-[#186737] transition-all"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1.5">
              Enter Your Email Address
            </label>
            <input
              type="email"
              value={modalEmail}
              onChange={(e) => setModalEmail(e.target.value)}
              placeholder="Enter Your Email Address"
              className="w-full border border-gray-200 rounded-[7px] px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#186737]/20 focus:border-[#186737] transition-all"
            />
          </div>

          {modalError && (
            <p className="text-xs text-red-500">{modalError}</p>
          )}
          {modalSuccess && (
            <p className="text-xs text-[#186737] font-medium">
              Your question has been submitted successfully!
            </p>
          )}

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
            <button
              onClick={() => setModalOpen(false)}
              className="px-5 py-2 rounded-[7px] border border-gray-200 text-sm text-gray-600 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleModalSubmit}
              disabled={!modalQuestion.trim() || !modalEmail.trim() || modalSubmitting}
              className="px-5 py-2 rounded-[7px] bg-[#186737] hover:bg-[#145c30] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold transition-colors flex items-center gap-2"
            >
              {modalSubmitting && (
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              {modalSubmitting ? "Submitting..." : "Submit Questions"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};
