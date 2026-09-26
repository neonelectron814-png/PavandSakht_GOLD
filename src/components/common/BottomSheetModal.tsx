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
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200" dir="rtl">
      {/* Backdrop overlay click */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Sheet panel with frosted light glass */}
      <div 
        className={`relative w-full max-w-2xl bg-white rounded-t-[32px] shadow-2xl border-t border-[#ede8de] ${maxHeight} flex flex-col z-10 animate-in slide-in-from-bottom duration-300 pb-safe text-slate-800`}
      >
        {/* Android drag handle indicator */}
        <div className="w-full flex justify-center py-2.5 cursor-pointer" onClick={onClose}>
          <div className="w-12 h-1.5 bg-slate-300 rounded-full" />
        </div>

        {/* Sheet Header */}
        <div className="flex items-center justify-between px-6 pb-3.5 border-b border-slate-100">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">{title}</h3>
            {subtitle && <p className="text-xs text-slate-500 font-normal mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sheet Content Body */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-6 py-4">
          {children}
        </div>
      </div>
    </div>
  );
};
