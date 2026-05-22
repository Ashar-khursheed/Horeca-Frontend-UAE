import { useEffect, useState } from "react";

const TICKER = [
  "⚡ Fast Delivery",
  "🥇 No.1 Product Supplier",
  "✅ Premium Quality",
  "🚚 Delivered to Your Door",
];

function TickerBadge() {
  const [idx, setIdx]   = useState(0);
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setShow(false); // fade-out start

      setTimeout(() => {
        setIdx((i) => (i + 1) % TICKER.length);
        setShow(true); // fade-in start
      }, 1500); // ← fade-out poora hone ka wait (= transition duration)

    }, 2500); // har 5s pe next text

    return () => clearInterval(timer);
  }, []);

  return (
    <span
      className="block text-[11px] font-semibold text-[#186737] mt-1.5 mb-1 h-[20px]"
      style={{
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0px)" : "translateY(10px)",
        transition: "opacity 1.5s ease, transform 1.2s ease", // ← yahan slow karo
      }}
    >
      {TICKER[idx]}
    </span>
  );
}

export default TickerBadge;