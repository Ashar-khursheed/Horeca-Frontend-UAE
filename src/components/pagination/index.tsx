"use client";

import { useState } from "react";

// ─── Utility ──────────────────────────────────────────────────────────────────
function getPageRange(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  if (current <= 4) return [1, 2, 3, 4, 5, "...", total];
  if (current >= total - 3)
    return [1, "...", total - 4, total - 3, total - 2, total - 1, total];

  return [1, "...", current - 1, current, current + 1, "...", total];
}

// ─── Icons ────────────────────────────────────────────────────────────────────
const ChevronLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const ChevronsLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="11 17 6 12 11 7" />
    <polyline points="18 17 13 12 18 7" />
  </svg>
);

const ChevronsRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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

  const pages = getPageRange(current, totalPages);

  return (
    <div className="flex flex-col items-center gap-4 select-none font-sans">
      {/* Page info badge */}
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

      {/* Controls row */}
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
          {pages.map((page, i) =>
            page === "..." ? (
              <Ellipsis key={`ellipsis-${i}`} />
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

      {/* Progress bar */}
      <div className="w-48 h-[3px] rounded-full bg-[#186737]/10 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#186737] to-[#22a855] transition-all duration-500 ease-out"
          style={{ width: `${(current / totalPages) * 100}%` }}
        />
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────
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
      {/* {isActive && (
        <span className="absolute inset-0 rounded-[7px] ring-2 ring-[#186737]/30 animate-ping opacity-60 pointer-events-none" />
      )} */}
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