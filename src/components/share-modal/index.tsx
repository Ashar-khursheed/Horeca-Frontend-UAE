"use client";

import { useState } from "react";
import { Facebook, Twitter, Linkedin } from "lucide-react";
import { FaReddit, FaWhatsapp, FaTelegram } from "react-icons/fa";
import { Modal } from "@/components/ui/modal";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title: string;
}

export const ShareModal = ({ isOpen, onClose, url, title }: ShareModalProps) => {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    reddit: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
  };

  const openShare = (platform: keyof typeof shareLinks) => {
    window.open(shareLinks[platform], "_blank", "width=600,height=400");
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback for older browsers
      const el = document.createElement("textarea");
      el.value = url;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const buttons = [
    {
      platform: "facebook" as const,
      icon: <Facebook size={22} />,
      bg: "bg-blue-600 hover:bg-blue-700",
      title: "Facebook",
    },
    {
      platform: "twitter" as const,
      icon: <Twitter size={22} />,
      bg: "bg-sky-500 hover:bg-sky-600",
      title: "Twitter",
    },
    {
      platform: "telegram" as const,
      icon: <FaTelegram size={22} />,
      bg: "bg-blue-500 hover:bg-blue-600",
      title: "Telegram",
    },
    {
      platform: "linkedin" as const,
      icon: <Linkedin size={22} />,
      bg: "bg-blue-700 hover:bg-blue-800",
      title: "LinkedIn",
    },
    {
      platform: "whatsapp" as const,
      icon: <FaWhatsapp size={22} />,
      bg: "bg-green-500 hover:bg-green-600",
      title: "WhatsApp",
    },
    {
      platform: "reddit" as const,
      icon: <FaReddit size={22} />,
      bg: "bg-orange-600 hover:bg-orange-700",
      title: "Reddit",
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Share on social Media" width="max-w-lg">
      <div className="space-y-6">
        {/* Share icons */}
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-4">Share this link via</p>
          <div className="flex flex-wrap gap-3 justify-center">
            {buttons.map(({ platform, icon, bg, title: t }) => (
              <button
                key={platform}
                onClick={() => openShare(platform)}
                title={t}
                className={`w-14 h-14 rounded-full ${bg} flex items-center justify-center text-white transition-all duration-200 hover:scale-110 shadow-md active:scale-95`}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        {/* Copy link */}
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-3">Or copy link</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={url}
              readOnly
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 truncate"
            />
            <button
              onClick={copyLink}
              className={`px-5 py-2.5 rounded-lg font-semibold text-sm text-white transition-all duration-200 min-w-[80px] ${
                copied ? "bg-emerald-500" : "bg-[#186737] hover:bg-[#145c2e]"
              }`}
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
