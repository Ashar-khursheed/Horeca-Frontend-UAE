import { PhoneCall } from 'lucide-react'

const CTA = () => {
  return (
    <div>
      {/* Need Help */}
      <div className="relative bg-white rounded-[7px] border border-gray-100 shadow-sm p-5 overflow-hidden">
        {/* Decorative dot grid — bottom right */}
        <div className="absolute bottom-3 right-3 grid grid-cols-4 gap-[5px] opacity-[0.12] pointer-events-none select-none">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="w-1 h-1 rounded-full bg-[#186737]" />
          ))}
        </div>
        {/* Sparkle top-left */}
        <span className="absolute top-3 left-[72px] text-[#186737] text-base leading-none select-none">✦</span>

        {/* Header row */}
        <div className="flex items-center gap-3.5 mb-4">
          {/* Headset icon circle */}
          <div className="w-[52px] h-[52px] rounded-full bg-[#edf7f1] border border-[#c8e6d3] flex items-center justify-center shrink-0">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#186737" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 18v-6a9 9 0 0 1 18 0v6"/>
              <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z"/>
              <path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-[14.5px] font-bold text-gray-900 leading-snug">
              Need Help{" "}
              <span className="text-[#186737]">Placing Order?</span>
            </p>
            <p className="text-[11.5px] text-gray-500 mt-0.5 leading-snug">
              Our Customer Success Team is here to help you with every step.
            </p>
          </div>
        </div>

        {/* Call button */}
        <a
          href="tel:+18664467322"
          className="group flex items-center justify-center w-full h-11 rounded-xl bg-[#186737] hover:bg-[#145c30] active:bg-[#0f4525] transition-all duration-200 overflow-hidden  shadow-md shadow-[#186737]/20 gap-2.5 px-4"
        >
          {/* Phone icon box */}
          <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
            <PhoneCall size={14} className="text-white" />
          </div>

          {/* Divider */}
          <div className="w-px h-5 bg-white/25 shrink-0" />

          {/* Text */}
          <div className="flex items-center gap-2">
            <span className="text-[12.5px] font-bold text-white">Call Now</span>
            <span className="text-[12px] font-semibold text-white/80">800-467-322</span>
          </div>

          {/* Arrow circle */}
          {/* <div className="w-6 h-6 rounded-full bg-white/20 group-hover:bg-white/30 transition-colors flex items-center justify-center shrink-0">
            <ArrowRight size={12} className="text-white" />
          </div> */}
        </a>

        {/* Badges */}
        {/* <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[10.5px] text-gray-500">
            <ShieldCheck size={12} className="text-[#186737]" />
            <span>Secure & Safe</span>
          </div>
          <div className="w-px h-3.5 bg-gray-200" />
          <div className="flex items-center gap-1.5 text-[10.5px] text-gray-500">
            <Clock size={12} className="text-[#186737]" />
            <span>Quick Response</span>
          </div>
          <div className="w-px h-3.5 bg-gray-200" />
          <div className="flex items-center gap-1.5 text-[10.5px] text-gray-500">
            <Users size={12} className="text-[#186737]" />
            <span>Expert Support</span>
          </div>
        </div> */}
      </div>
    </div>
  )
}

export default CTA
