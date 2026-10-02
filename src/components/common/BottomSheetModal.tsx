import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface BottomSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxHeight?: string;
}

export const BottomSheetModal: React.FC<BottomSheetModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxHeight = 'max-h-[85vh]',
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-black/45 backdrop-blur-sm animate-in fade-in duration-200" dir="rtl">
      {/* Backdrop overlay click */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Complete Framed Card (یک کادر کامل با بردر یکپارچه طلایی) */}
      <div 
        className={`relative w-full max-w-lg bg-[#fbf9f4] rounded-[32px] shadow-[0_20px_60px_rgba(160,118,48,0.25)] border-2 border-[#dfc282] ${maxHeight} flex flex-col z-10 animate-in slide-in-from-bottom duration-300 overflow-hidden text-slate-800`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sheet Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#ebdcc7] bg-white/75 shrink-0">
          <div>
            <h3 className="font-black text-slate-950 text-base">{title}</h3>
            {subtitle && <p className="text-xs text-slate-600 font-bold mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="w-8.5 h-8.5 rounded-full bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-600 border border-slate-200 hover:border-red-200 flex items-center justify-center cursor-pointer shadow-2xs active:scale-90 transition-all"
            aria-label="بستن"
          >
            <X className="w-4.5 h-4.5 stroke-[2.5]" />
          </button>
        </div>

        {/* Sheet Content Body with smooth custom gold scrollbar */}
        <div className="flex-1 min-h-0 overflow-y-auto custom-gold-scrollbar px-5 py-4 overscroll-contain touch-pan-y">
          {children}
        </div>
      </div>
    </div>
  );
};
