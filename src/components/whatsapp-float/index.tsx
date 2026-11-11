const WHATSAPP_URL =
  "https://api.whatsapp.com/send/?phone=971555915143&text=Hello%20HorecaStore&type=phone_number&app_absent=0";

export default function WhatsAppFloat() {
  return (
    <div className="fixed bottom-[4.75rem] right-3 z-40 flex flex-col items-end gap-2 lg:bottom-6 lg:right-6">
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="wa-chat-pop max-w-[210px] rounded-2xl rounded-br-md bg-white px-3 py-2 text-[12px] font-semibold leading-snug text-gray-800 shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
      >
        Chat with us on WhatsApp
      </a>
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="relative flex h-11 w-11 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_20px_rgba(37,211,102,0.45)] transition-transform hover:scale-105 lg:h-12 lg:w-12"
      >
        <span className="wa-ring absolute inset-0 rounded-full bg-[#25D366]" />
        <svg viewBox="0 0 24 24" className="relative h-6 w-6" fill="currentColor" aria-hidden="true">
          <path d="M20.5 3.5A11 11 0 0 0 2.1 16.8L1 23l6.3-1.1A11 11 0 0 0 12 23a11 11 0 0 0 8.5-19.5zM12 21a9 9 0 0 1-4.6-1.3l-.3-.2-3.7.7.7-3.6-.2-.3A9 9 0 1 1 12 21zm5-6.8c-.3-.1-1.6-.8-1.8-.9s-.4-.1-.6.1-.7.9-.8 1-.3.2-.6.1a7.4 7.4 0 0 1-2.2-1.4 8.2 8.2 0 0 1-1.5-1.9c-.2-.3 0-.4.1-.6l.4-.4.2-.4a.5.5 0 0 0 0-.5c-.1-.1-.6-1.4-.8-1.9s-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 2.8 2.8 0 0 0-.9 2.1 4.8 4.8 0 0 0 1 2.5 11 11 0 0 0 4.4 3.9 3.5 3.5 0 0 0 1.6.4 2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .2-1.2c-.1-.2-.3-.2-.6-.3z" />
        </svg>
      </a>
      <style>{`
        .wa-chat-pop {
          animation: wa-rise 0.45s ease 0.8s both;
        }
        .wa-ring {
          animation: wa-pulse 1.8s ease-out infinite;
        }
        @keyframes wa-rise {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes wa-pulse {
          0% { transform: scale(1); opacity: 0.55; }
          70% { transform: scale(1.45); opacity: 0; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
