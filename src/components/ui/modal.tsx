import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
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
  onConfirm 
}: ModalProps) => {
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      document.body.style.overflow = 'hidden';
    } else {
      setIsAnimating(false);
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen && !isAnimating) return null;

  return ReactDOM.createPortal(
    <div 
      className={`fixed inset-0  bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 transition-all duration-300 ${
        zIndex === true ? 'z-[9999]' : 'z-50'
      } ${isAnimating ? 'animate-fadeIn' : 'opacity-0'}`}
    >
      <div 
        className={`bg-white rounded-[7px] shadow-2xl ${width} w-full max-h-[90vh] overflow-hidden ${
          isAnimating ? 'animate-slideUp' : 'opacity-0 translate-y-5'
        }`}
        onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200">
          <h2 className="md:text-2xl text-base font-bold text-black">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-black hover:text-black transition-colors duration-200"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-3 overflow-y-auto max-h-[calc(90vh-140px)]">
          {children}
        </div>

        {/* Footer */}
        {showFooter && (
          <div className="flex gap-3 p-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-[7px] font-medium hover:bg-gray-300 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onConfirm?.();
                onClose();
              }}
              className="flex-1 bg-[#186737] text-white px-4 py-2 rounded-[7px] font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              {footerBtnText ?? 'Confirm'}
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
        .animate-slideUp { animation: slideUp 0.3s ease-out; }
      `}</style>
    </div>,
    document.body
  );
};