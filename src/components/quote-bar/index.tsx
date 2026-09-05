"use client";

import { useQuoteList } from "@/utils/quoteStorage";
import { ChevronRight, FileText } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const HIDDEN_PREFIXES = [
  "/create-quotation",
  "/checkout",
  "/payment",
  "/login",
  "/register",
  "/cart",
  "/dashboard",
  "/partner",
];

export function QuoteBar() {
  const list = useQuoteList();
  const pathname = usePathname();

  const hidden = HIDDEN_PREFIXES.some((p) => pathname?.startsWith(p));
  const visible = !hidden && list.length > 0;

  useEffect(() => {
    if (!visible) return;
    const prev = document.body.style.paddingBottom;
    const mq = window.matchMedia("(min-width: 768px)");
    const apply = () => {
      document.body.style.paddingBottom = mq.matches ? "80px" : prev;
    };
    apply();
    mq.addEventListener("change", apply);
    return () => {
      mq.removeEventListener("change", apply);
      document.body.style.paddingBottom = prev;
    };
  }, [visible]);

  if (!visible) return null;

  const preview = list.slice(0, 3);
  const extra = list.length - preview.length;

  return (
    <aside className="fixed bottom-4 left-1/2 z-[45] hidden w-[600px] max-w-[92vw] -translate-x-1/2 md:block">
      <div className="relative rounded-[7px] shadow-[0_18px_50px_rgba(0,0,0,0.32)] transition-transform duration-300 hover:-translate-y-0.5">
        <div className="relative overflow-hidden rounded-[7px] p-[2px]">
          {/* <div
            className="absolute left-1/2 top-1/2 h-[240%] w-[240%] -translate-x-1/2 -translate-y-1/2 animate-[ringSpin_2.4s_linear_infinite]"
            style={{
              background:
                "conic-gradient(from 0deg, #186737, #3dd68c, #186737, #22c55e, #145c30, #186737)",
            }}
          /> */}
          <div className="relative z-10 flex items-center justify-between gap-3 rounded-[5px] border-2 border-[#186737] bg-white px-4 py-3">
          <div className="flex shrink-0 -space-x-2">
            {preview.map((p) => (
              <div
                key={p.id}
                className="h-11 w-11 overflow-hidden rounded-full border-2 border-[#186737] bg-white shadow-sm transition-transform duration-200 hover:z-10 hover:scale-110"
              >
                {p.image ? (
                  <img
                    src={p.image}
                    alt=""
                    className="h-full w-full object-contain p-0.5"
                  />
                ) : (
                  <div className="h-full w-full bg-emerald-50" />
                )}
              </div>
            ))}
            {extra > 0 && (
              <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#186737] bg-[#186737] text-[11px] font-bold text-white">
                +{extra}
              </div>
            )}
          </div>

          <Link
            href="/create-quotation"
            className="group inline-flex shrink-0 items-center gap-1 rounded-[7px] bg-[#186737] px-4 py-3 text-md font-bold text-white transition-colors hover:bg-[#145c30]"
          >
            <FileText size={13} strokeWidth={2.4} />
            Complete Your Quote
            <ChevronRight
              size={13}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
