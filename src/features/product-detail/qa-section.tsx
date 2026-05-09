"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Send } from "lucide-react";
import { useState } from "react";

type QAItem = {
  id: number;
  question: string;
  answer: string;
};

type QASectionProps = {
  items: QAItem[];
};

export const QASection = ({ items }: QASectionProps) => {
  const [questionText, setQuestionText] = useState("");

  const leftItems = items.slice(0, Math.ceil(items.length / 2));
  const rightItems = items.slice(Math.ceil(items.length / 2));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
      {/* Q&A Accordion — 2 columns, 50/50 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-0 items-start">
        {/* Left column */}
        <Accordion type="single" collapsible className="w-full">
          {leftItems.map((qa) => (
            <AccordionItem key={qa.id} value={`qa-${qa.id}`}>
              <AccordionTrigger className="text-sm font-medium text-gray-800 px-2">
                {qa.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-gray-600 leading-relaxed px-2">
                {qa.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Right column */}
        <Accordion type="single" collapsible className="w-full">
          {rightItems.map((qa) => (
            <AccordionItem key={qa.id} value={`qa-${qa.id}`}>
              <AccordionTrigger className="text-sm font-medium text-gray-800 px-2">
                {qa.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-gray-600 leading-relaxed px-2">
                {qa.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* Ask a Question */}
      <div className="lg:border-l lg:border-gray-100 lg:pl-8">
        <p className="text-sm font-bold text-gray-800 mb-1">
          Write your question about the product...
        </p>
        <p className="text-xs text-gray-500 mb-3">
          Our team will get back to you with an expert answer.
        </p>
        <textarea
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          placeholder="e.g. Does this refrigerator work in a walk-in environment?"
          rows={5}
          className="w-full border border-gray-200 rounded-[7px] px-4 py-3 text-sm text-gray-700 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-[#186737]/20 focus:border-[#186737] transition-all"
        />
        <button
          disabled={!questionText.trim()}
          className="mt-3 w-full bg-[#186737] hover:bg-[#145c30] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold py-2.5 rounded-[7px] transition-colors flex items-center justify-center gap-2"
        >
          <Send size={14} strokeWidth={2} />
          Get An Answer
        </button>
      </div>
    </div>
  );
};
