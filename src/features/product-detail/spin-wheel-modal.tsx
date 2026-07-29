"use client";

import { useEffect, useRef, useState } from "react";
import { X, Sparkles, Copy, Check, PartyPopper, Timer } from "lucide-react";

interface Segment {
  label: string;
  value: number;
  weight: number;
}

const SEGMENTS: Segment[] = [
  { label: "5% OFF", value: 5, weight: 24 },
  { label: "10% OFF", value: 10, weight: 22 },
  { label: "FREE SHIP", value: 0, weight: 12 },
  { label: "15% OFF", value: 15, weight: 16 },
  { label: "10% OFF", value: 10, weight: 14 },
  { label: "20% OFF", value: 20, weight: 8 },
  { label: "5% OFF", value: 5, weight: 20 },
  { label: "25% OFF", value: 25, weight: 4 },
];

const SEGMENT_ANGLE = 360 / SEGMENTS.length;
// Distance of each label from the wheel's rim (the wheel face is a 248px circle)
const LABEL_INSET = 12;

// Horeca brand palette (pulled from the logo mark: red cloche, amber base, green wordmark)
const GREEN = "#186737";
const RED = "#ff3b0a";
const AMBER = "#f5a623";
const INK = "#1f2937";

const SEGMENT_COLORS = [GREEN, RED, AMBER];
const SEGMENT_TEXT = [
  "#ffffff", // on green
  "#ffffff", // on red
  INK, // on amber
];

const CONFETTI_COLORS = [GREEN, RED, AMBER, "#22c55e", "#facc15"];

const OFFER_DURATION_SECONDS = 5 * 60;

const formatCountdown = (totalSeconds: number) => {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

const pickWeightedIndex = (items: Segment[]) => {
  const total = items.reduce((sum, item) => sum + item.weight, 0);
  let roll = Math.random() * total;
  for (let i = 0; i < items.length; i++) {
    roll -= items[i].weight;
    if (roll <= 0) return i;
  }
  return items.length - 1;
};

const codeFor = (segment: Segment) =>
  segment.value === 0 ? "FREESHIP" : `SPIN${segment.value}`;

const wheelBackground = `conic-gradient(${SEGMENTS.map((_, i) => {
  const color = SEGMENT_COLORS[i % SEGMENT_COLORS.length];
  return `${color} ${i * SEGMENT_ANGLE}deg ${(i + 1) * SEGMENT_ANGLE}deg`;
}).join(", ")})`;

const SpinWheelModal = () => {
  const [visible, setVisible] = useState(false);
  const [entered, setEntered] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [spun, setSpun] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winner, setWinner] = useState<Segment | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [copied, setCopied] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(OFFER_DURATION_SECONDS);
  const spinTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const confettiTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const showTimer = setTimeout(() => {
      setVisible(true);
      requestAnimationFrame(() => setEntered(true));
    }, 2000);

    return () => clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    if (!visible || spun) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [visible, spun]);

  const expired = secondsLeft <= 0 && !spun;

  useEffect(() => {
    return () => {
      if (spinTimeoutRef.current) clearTimeout(spinTimeoutRef.current);
      if (confettiTimeoutRef.current) clearTimeout(confettiTimeoutRef.current);
    };
  }, []);

  const handleClose = () => {
    setEntered(false);
    setTimeout(() => setVisible(false), 200);
  };

  const handleSpin = () => {
    if (spinning || spun || expired) return;
    setSpinning(true);

    const index = pickWeightedIndex(SEGMENTS);
    const center = index * SEGMENT_ANGLE + SEGMENT_ANGLE / 2;
    const fullSpins = 6;
    const target = fullSpins * 360 + (360 - center);
    setRotation(target);

    spinTimeoutRef.current = setTimeout(() => {
      setSpinning(false);
      setSpun(true);
      setWinner(SEGMENTS[index]);
      setShowConfetti(true);
      confettiTimeoutRef.current = setTimeout(() => setShowConfetti(false), 3000);
    }, 4200);
  };

  const handleCopy = () => {
    if (!winner) return;
    navigator.clipboard?.writeText(codeFor(winner)).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 transition-opacity duration-200 ${
        entered ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleClose}
    >
      {/* Brand-gradient frame (green / amber / red — straight off the logo) */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-sm rounded-2xl bg-gradient-to-br from-[#186737] via-[#f5a623] to-[#ff3b0a] p-[2px] shadow-[0_25px_60px_-15px_rgba(24,103,55,0.45)] transition-all duration-300 ${
          entered ? "scale-100 opacity-100" : "scale-90 opacity-0"
        }`}
      >
        <div className="relative overflow-hidden rounded-[14px] bg-white p-6 pt-5 text-center">
          {/* Close */}
          <button
            onClick={handleClose}
            aria-label="Close"
            className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-400 transition hover:bg-gray-200 hover:text-gray-600"
          >
            <X size={16} />
          </button>

          {!spun && (
            <>
              <div className="mb-2 flex items-center justify-center gap-1.5 rounded-full bg-[#ff3b0a]/10 px-3 py-1 mx-auto w-fit">
                <Sparkles size={13} className="text-[#f5a623]" />
                <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#ff3b0a]">
                  Exclusive Offer
                </span>
                <Sparkles size={13} className="text-[#f5a623]" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                Spin &amp; Win an Instant Discount
              </h3>
              <div
                className={`mb-4 flex items-center justify-center gap-1.5 rounded-full px-3 py-1 mx-auto w-fit text-[12px] font-bold tabular-nums ${
                  expired
                    ? "bg-gray-100 text-gray-400"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                <Timer size={13} className={expired ? "text-gray-400" : "text-[#ff3b0a]"} />
                {expired ? "Offer expired" : `Offer ends in ${formatCountdown(secondsLeft)}`}
              </div>
            </>
          )}

          {/* Wheel */}
          <div className="relative mx-auto mb-5 h-[260px] w-[260px]">
            {/* Soft rotating brand aura behind the wheel */}
            <div className="wheel-aura absolute -inset-2 rounded-full" />

            {/* Pointer */}
            <div className="absolute left-1/2 top-[-6px] z-10 -translate-x-1/2">
              <div
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: "10px solid transparent",
                  borderRight: "10px solid transparent",
                  borderTop: `18px solid ${RED}`,
                  filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.35))",
                }}
              />
            </div>

            {/* Wheel face */}
            <div
              className="absolute inset-[6px] rounded-full border-[3px] border-white shadow-[0_0_0_3px_rgba(24,103,55,0.15),inset_0_0_20px_rgba(0,0,0,0.15)]"
              style={{
                background: wheelBackground,
                transform: `rotate(${rotation}deg)`,
                transition: spinning
                  ? "transform 4.2s cubic-bezier(0.12, 0.67, 0.1, 1)"
                  : "none",
              }}
            >
              {SEGMENTS.map((seg, i) => {
                const mid = i * SEGMENT_ANGLE + SEGMENT_ANGLE / 2;
                const color = SEGMENT_TEXT[i % SEGMENT_TEXT.length];
                return (
                  <div
                    key={i}
                    className="absolute inset-0 flex justify-center"
                    style={{ transform: `rotate(${mid}deg)` }}
                  >
                    <span
                      className="whitespace-nowrap text-[12px] font-bold tracking-wide"
                      style={{ color, marginTop: LABEL_INSET }}
                    >
                      {seg.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Hub / spin button */}
            <button
              onClick={handleSpin}
              disabled={spinning || spun || expired}
              className={`spin-hub absolute left-1/2 top-1/2 z-10 flex h-[74px] w-[74px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border-[3px] border-white text-[13px] font-extrabold uppercase tracking-wide transition-transform ${
                expired ? "text-gray-400" : "text-[#186737]"
              } ${
                spinning || spun || expired ? "cursor-default" : "cursor-pointer hover:scale-105 active:scale-95"
              }`}
              style={{
                background: expired
                  ? "radial-gradient(circle at 35% 30%, #ffffff, #f3f4f6 55%, #e5e7eb 100%)"
                  : "radial-gradient(circle at 35% 30%, #ffffff, #eafaf1 55%, #d7f0e0 100%)",
                boxShadow: "0 4px 14px rgba(0,0,0,0.2), inset 0 1px 2px rgba(255,255,255,0.8)",
              }}
            >
              {spinning ? (
                <span className="animate-spin text-lg">◐</span>
              ) : expired ? (
                <span className="leading-none text-[11px]">Expired</span>
              ) : (
                <>
                  <span className="leading-none">Spin</span>
                  <span className="leading-none">Now</span>
                </>
              )}
            </button>
          </div>

          {!spun && (
            <p className="text-xs text-gray-400">
              One free spin per visit &middot; Good luck!
            </p>
          )}

          {spun && winner && (
            <div className="animate-result-in">
              <div className="mb-2 flex items-center justify-center gap-2 text-[#186737]">
                <PartyPopper size={20} />
                <span className="text-sm font-bold uppercase tracking-[0.15em]">
                  You Won
                </span>
                <PartyPopper size={20} />
              </div>
              <p className="mb-4 text-2xl font-extrabold text-gray-900">
                {winner.label}
              </p>
              <button
                onClick={handleCopy}
                className="mx-auto mb-4 flex items-center gap-2 rounded-[7px] border border-dashed border-[#186737]/40 bg-[#186737]/5 px-4 py-2 text-sm font-bold tracking-widest text-[#186737] transition hover:bg-[#186737]/10"
              >
                {copied ? <Check size={15} /> : <Copy size={15} />}
                {codeFor(winner)}
              </button>
              <button
                onClick={handleClose}
                className="w-full rounded-[7px] bg-[#186737] py-2.5 text-sm font-bold text-white transition hover:bg-[#145c30]"
              >
                Continue Shopping
              </button>
            </div>
          )}

          {/* Confetti */}
          {showConfetti && (
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              {Array.from({ length: 44 }).map((_, i) => {
                const left = Math.random() * 100;
                const delay = Math.random() * 0.4;
                const duration = 2 + Math.random() * 1.2;
                const color = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
                const size = 5 + Math.random() * 5;
                const rotate = Math.random() * 360;
                return (
                  <span
                    key={i}
                    className="confetti-piece"
                    style={{
                      left: `${left}%`,
                      width: size,
                      height: size * 0.4,
                      background: color,
                      animationDelay: `${delay}s`,
                      animationDuration: `${duration}s`,
                      transform: `rotate(${rotate}deg)`,
                    }}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes confettiFall {
          0% {
            transform: translateY(-20px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(360px) rotate(540deg);
            opacity: 0;
          }
        }
        .confetti-piece {
          position: absolute;
          top: -20px;
          border-radius: 1px;
          animation-name: confettiFall;
          animation-timing-function: ease-in;
          animation-fill-mode: forwards;
        }

        @keyframes resultIn {
          from {
            opacity: 0;
            transform: translateY(8px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-result-in {
          animation: resultIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes auraSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .wheel-aura {
          background: conic-gradient(from 0deg, ${GREEN}, ${AMBER}, ${RED}, ${GREEN});
          filter: blur(10px);
          opacity: 0.35;
          animation: auraSpin 6s linear infinite;
        }

        @keyframes hubPulse {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.06); }
        }
        .spin-hub:not(:disabled) {
          animation: hubPulse 1.8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default SpinWheelModal;
