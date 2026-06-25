"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export interface FaqItem {
  question: string;
  answer: string;
}

export default function FaqSection({ faqs }: { faqs: FaqItem[] }) {
  if (!faqs.length) return null;

  const left  = faqs.filter((_, i) => i % 2 === 0);
  const right = faqs.filter((_, i) => i % 2 !== 0);

  return (
    <section className="py-14 bg-gray-50">
      <div className="global-container mx-auto px-4">
        <div className="text-center mb-10">
          <span className="inline-block text-green-700 text-xs font-bold uppercase tracking-widest mb-2">
            Got Questions?
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-black">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-black md:text-[16px] text-sm max-w-xl mx-auto">
            Everything you need to know about our products and services.
          </p>
        </div>

        <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
          <Accordion type="single" collapsible>
            {left.map((faq, i) => (
              <AccordionItem key={i * 2} value={`faq-left-${i}`}>
                <AccordionTrigger className="text-sm font-semibold text-black">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>
                  <div
                    className="text-sm text-gray-700 leading-relaxed [&_p]:mb-2 [&_a]:text-blue-600 [&_a]:underline [&_a]:hover:text-blue-800"
                    dangerouslySetInnerHTML={{ __html: faq.answer }}
                  />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <Accordion type="single" collapsible>
            {right.map((faq, i) => (
              <AccordionItem key={i * 2 + 1} value={`faq-right-${i}`}>
                <AccordionTrigger className="text-sm font-semibold text-black">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>
                  <div
                    className="text-sm text-gray-700 leading-relaxed [&_p]:mb-2 [&_a]:text-blue-600 [&_a]:underline [&_a]:hover:text-blue-800"
                    dangerouslySetInnerHTML={{ __html: faq.answer }}
                  />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
