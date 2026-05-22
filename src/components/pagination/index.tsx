"use client";

import { useState } from "react";

// ─── Utility ──────────────────────────────────────────────────────────────────
function getPageRange(current: number, total: number, compact = false): (number | "...")[] {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);

  if (compact) {
    if (current <= 2) return [1, 2, 3, "...", total];
    if (current >= total - 1) return [1, "...", total - 2, total - 1, total];
    return [1, "...", current, "...", total];
  }

  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, "...", total];
  if (current >= total - 3)
    return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
  return [1, "...", current - 1, current, current + 1, "...", total];
}

// ─── Icons ────────────────────────────────────────────────────────────────────
const ChevronLeft = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ChevronRight = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const ChevronsLeft = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="11 17 6 12 11 7" />
    <polyline points="18 17 13 12 18 7" />
  </svg>
);

const ChevronsRight = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="13 17 18 12 13 7" />
    <polyline points="6 17 11 12 6 7" />
  </svg>
);

// ─── Types ────────────────────────────────────────────────────────────────────
interface PaginationProps {
  totalPages: number;
  initialPage?: number;
  onPageChange?: (page: number) => void;
  showFirstLast?: boolean;
  showPageInfo?: boolean;
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Pagination({
  totalPages = 12,
  initialPage = 1,
  onPageChange,
  showFirstLast = true,
  showPageInfo = true,
}: PaginationProps) {
  const [current, setCurrent] = useState(initialPage);
  const [animatingPage, setAnimatingPage] = useState<number | null>(null);

  const goTo = (page: number) => {
    if (page < 1 || page > totalPages || page === current) return;
    setAnimatingPage(page);
    setTimeout(() => {
      setCurrent(page);
      setAnimatingPage(null);
      onPageChange?.(page);
    }, 150);
  };

  const desktopPages = getPageRange(current, totalPages, false);
  const tabletPages  = getPageRange(current, totalPages, true);

  const progressPct = (current / totalPages) * 100;

  return (
    <div className="flex flex-col items-center gap-3 select-none font-sans py-4">

      {/* ── MOBILE (< sm) ────────────────────────────────────────────────── */}
      <div className="flex sm:hidden items-center gap-3">

        {/* Prev */}
        <button
          onClick={() => goTo(current - 1)}
          disabled={current === 1}
          className={`flex items-center gap-1 px-3 h-9 rounded-[7px] text-sm font-semibold border transition-all ${
            current === 1
              ? "border-gray-100 text-gray-300 cursor-not-allowed bg-white"
              : "border-gray-200 text-gray-500 bg-white hover:border-[#186737]/40 hover:text-[#186737] hover:bg-[#186737]/5 active:scale-95"
          }`}
        >
          <ChevronLeft />
          Prev
        </button>

        {/* Page indicator */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs font-bold text-gray-700 whitespace-nowrap">
            {current} <span className="text-gray-300 font-normal">/</span> {totalPages}
          </span>
          <div className="w-16 h-1 rounded-full bg-[#186737]/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-[#186737] transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Next */}
        <button
          onClick={() => goTo(current + 1)}
          disabled={current === totalPages}
          className={`flex items-center gap-1 px-3 h-9 rounded-[7px] text-sm font-semibold border transition-all ${
            current === totalPages
              ? "border-gray-100 text-gray-300 cursor-not-allowed bg-white"
              : "border-gray-200 text-gray-500 bg-white hover:border-[#186737]/40 hover:text-[#186737] hover:bg-[#186737]/5 active:scale-95"
          }`}
        >
          Next
          <ChevronRight />
        </button>
      </div>

      {/* Page dots (mobile) — quick jump to nearby pages */}
      {totalPages > 1 && (
        <div className="flex sm:hidden items-center justify-center gap-1.5">
          {tabletPages.map((page, i) =>
            page === "..." ? (
              <span key={`m-ellipsis-${i}`} className="text-gray-300 text-xs leading-none px-0.5">
                ···
              </span>
            ) : (
              <button
                key={page}
                onClick={() => goTo(page as number)}
                className={`w-7 h-7 rounded-[6px] text-[12px] font-semibold transition-all ${
                  page === current
                    ? "bg-[#186737] text-white shadow-sm shadow-[#186737]/30 scale-110"
                    : "bg-white border border-gray-100 text-gray-400 hover:border-[#186737]/30 hover:text-[#186737]"
                }`}
              >
                {page}
              </button>
            )
          )}
        </div>
      )}

      {/* ── TABLET (sm → lg) ─────────────────────────────────────────────── */}
      <div className="hidden sm:flex lg:hidden flex-col items-center gap-2.5">
        {showPageInfo && (
          <div className="text-[11px] font-semibold tracking-widest uppercase text-[#186737]/60">
            <span
              className="inline-block transition-all duration-300"
              style={{ opacity: animatingPage !== null ? 0.4 : 1 }}
            >
              Page {current}
            </span>
            <span className="text-[#186737]/30 mx-1.5">·</span>
            <span>{totalPages} Pages</span>
          </div>
        )}
        <div className="flex items-center gap-1">
          {showFirstLast && (
            <NavButton onClick={() => goTo(1)} disabled={current === 1} title="First page">
              <ChevronsLeft />
            </NavButton>
          )}
          <NavButton onClick={() => goTo(current - 1)} disabled={current === 1} title="Previous page">
            <ChevronLeft />
          </NavButton>

          <div className="flex items-center gap-1 mx-1">
            {tabletPages.map((page, i) =>
              page === "..." ? (
                <Ellipsis key={`t-ellipsis-${i}`} />
              ) : (
                <PageButton
                  key={page}
                  page={page as number}
                  isActive={page === current}
                  isAnimating={page === animatingPage}
                  onClick={() => goTo(page as number)}
                />
              )
            )}
          </div>

          <NavButton onClick={() => goTo(current + 1)} disabled={current === totalPages} title="Next page">
            <ChevronRight />
          </NavButton>
          {showFirstLast && (
            <NavButton onClick={() => goTo(totalPages)} disabled={current === totalPages} title="Last page">
              <ChevronsRight />
            </NavButton>
          )}
        </div>
        <ProgressBar pct={progressPct} />
      </div>

      {/* ── DESKTOP (lg+) ────────────────────────────────────────────────── */}
      <div className="hidden lg:flex flex-col items-center gap-3">
        {showPageInfo && (
          <div className="flex items-center gap-1.5 text-[11px] font-semibold tracking-widest uppercase text-[#186737]/60">
            <span
              className="inline-block transition-all duration-300"
              style={{
                opacity: animatingPage !== null ? 0.4 : 1,
                transform: animatingPage !== null ? "translateY(-2px)" : "translateY(0)",
              }}
            >
              Page {current}
            </span>
            <span className="text-[#186737]/30">·</span>
            <span>{totalPages} Pages</span>
          </div>
        )}

        <div className="flex items-center gap-1">
          {showFirstLast && (
            <NavButton onClick={() => goTo(1)} disabled={current === 1} title="First page">
              <ChevronsLeft />
            </NavButton>
          )}
          <NavButton onClick={() => goTo(current - 1)} disabled={current === 1} title="Previous page">
            <ChevronLeft />
          </NavButton>

          <div className="flex items-center gap-1 mx-1">
            {desktopPages.map((page, i) =>
              page === "..." ? (
                <Ellipsis key={`d-ellipsis-${i}`} />
              ) : (
                <PageButton
                  key={page}
                  page={page as number}
                  isActive={page === current}
                  isAnimating={page === animatingPage}
                  onClick={() => goTo(page as number)}
                />
              )
            )}
          </div>

          <NavButton onClick={() => goTo(current + 1)} disabled={current === totalPages} title="Next page">
            <ChevronRight />
          </NavButton>
          {showFirstLast && (
            <NavButton onClick={() => goTo(totalPages)} disabled={current === totalPages} title="Last page">
              <ChevronsRight />
            </NavButton>
          )}
        </div>
        <ProgressBar pct={progressPct} wide />
      </div>

    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ProgressBar({ pct, wide }: { pct: number; wide?: boolean }) {
  return (
    <div className={`${wide ? "w-48" : "w-32"} h-0.75 rounded-full bg-[#186737]/10 overflow-hidden`}>
      <div
        className="h-full rounded-full bg-linear-to-r from-[#186737] to-[#22a855] transition-all duration-500 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function PageButton({
  page,
  isActive,
  isAnimating,
  onClick,
}: {
  page: number;
  isActive: boolean;
  isAnimating: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      title={`Go to page ${page}`}
      className={`
        relative w-9 h-9 text-[13px] font-semibold rounded-[7px]
        transition-all duration-200 ease-out
        focus:outline-none focus-visible:ring-2 focus-visible:ring-[#186737]/50
        ${
          isActive
            ? "bg-[#186737] text-white shadow-lg shadow-[#186737]/30 scale-110 z-10"
            : isAnimating
            ? "bg-[#186737]/15 text-[#186737] scale-105"
            : "bg-white text-gray-500 border border-gray-100 hover:border-[#186737]/40 hover:text-[#186737] hover:bg-[#186737]/5 hover:scale-105 shadow-sm"
        }
      `}
    >
      {page}
    </button>
  );
}

function NavButton({
  onClick,
  disabled,
  title,
  children,
}: {
  onClick: () => void;
  disabled: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`
        w-9 h-9 flex items-center justify-center rounded-[7px]
        border transition-all duration-200 ease-out
        focus:outline-none focus-visible:ring-2 focus-visible:ring-[#186737]/50
        ${
          disabled
            ? "border-gray-100 text-gray-300 cursor-not-allowed bg-white shadow-sm"
            : "border-gray-100 text-gray-400 bg-white shadow-sm hover:border-[#186737]/40 hover:text-[#186737] hover:bg-[#186737]/5 hover:scale-105 active:scale-95"
        }
      `}
    >
      {children}
    </button>
  );
}

function Ellipsis() {
  return (
    <span className="w-9 h-9 flex items-end justify-center pb-2 text-gray-300 text-lg tracking-tighter pointer-events-none">
      ···
    </span>
  );
}
