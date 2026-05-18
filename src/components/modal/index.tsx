"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import ReactDOM from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  width?: string;
  footerBtnText?: string;
  zIndex?: boolean;
  showFooter?: boolean;
  onConfirm?: () => void;
}

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  width = "max-w-3xl",
  footerBtnText,
  zIndex,
  showFooter = false,
  onConfirm,
}: ModalProps) => {
  // rendered: controls whether the portal is in the DOM
  // visible: controls transition classes (enter/exit)
  const [rendered, setRendered] = useState(isOpen);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setRendered(true);
      const t = setTimeout(() => setVisible(true), 10); // tiny delay lets enter transition play
      document.body.style.overflow = "hidden";
      return () => clearTimeout(t);
    } else {
      setVisible(false);
      const t = setTimeout(() => {
        setRendered(false);
        document.body.style.overflow = "";
      }, 200); // match transition duration
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  // cleanup on unmount
  useEffect(() => () => { document.body.style.overflow = ""; }, []);

  // ESC key
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!rendered) return null;

  return ReactDOM.createPortal(
    <div
      className={`fixed inset-0 flex items-center justify-center p-4 transition-opacity duration-200 ${
        zIndex ? "z-9999" : "z-50"
      } ${visible ? "opacity-100" : "opacity-0"}`}
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className={`relative bg-white rounded-[7px] shadow-[0_20px_60px_rgba(0,0,0,0.18)] ${width} w-full max-h-[90vh] overflow-hidden transition-all duration-200 ${
          visible
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-4 scale-95"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          {title && (
            <h2 className="text-base md:text-lg font-bold text-gray-900">
              {title}
            </h2>
          )}
          <button
            onClick={onClose}
            className="ml-auto w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {children}
        </div>

        {/* Footer */}
        {showFooter && (
          <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 px-4 py-2.5 rounded-[7px] text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => { onConfirm?.(); onClose(); }}
              className="flex-1 bg-[#186737] text-white px-4 py-2.5 rounded-[7px] text-sm font-medium hover:bg-[#145c2e] transition-colors"
            >
              {footerBtnText || "Confirm"}
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};
