import React, { useState } from 'react';
import { Plus, Building2, Package, RefreshCw, Handshake, X, Sparkles } from 'lucide-react';

interface FABProps {
  onOpenRegisterProperty: () => void;
  onOpenMaterialQuote: () => void;
  onOpenBarterOffer: () => void;
  onOpenPartnership: () => void;
}

export const FAB: React.FC<FABProps> = ({
  onOpenRegisterProperty,
  onOpenMaterialQuote,
  onOpenBarterOffer,
  onOpenPartnership,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-22 left-4 md:bottom-8 md:left-8 z-40 flex flex-col items-start gap-2">
      {/* Expanded Quick Action Items with Glassmorphism */}
      {isOpen && (
        <div className="flex flex-col items-start gap-2.5 animate-in fade-in slide-in-from-bottom-4 duration-200">
          
          <button
            onClick={() => {
              setIsOpen(false);
              onOpenRegisterProperty();
            }}
            className="bg-white hover:bg-amber-50 text-slate-950 text-xs py-2.5 px-4 rounded-2xl shadow-md border-2 border-amber-400 flex items-center gap-2 font-black transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Building2 className="w-4 h-4 text-amber-700" />
            <span>ثبت فایل ملک جدید</span>
          </button>

          <button
            onClick={() => {
              setIsOpen(false);
              onOpenMaterialQuote();
            }}
            className="bg-white hover:bg-emerald-50 text-slate-950 text-xs py-2.5 px-4 rounded-2xl shadow-md border-2 border-emerald-400 flex items-center gap-2 font-black transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Package className="w-4 h-4 text-emerald-700" />
            <span>درخواست قیمت مصالح</span>
          </button>

          <button
            onClick={() => {
              setIsOpen(false);
              onOpenBarterOffer();
            }}
            className="bg-white hover:bg-blue-50 text-slate-950 text-xs py-2.5 px-4 rounded-2xl shadow-md border-2 border-blue-400 flex items-center gap-2 font-black transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4 text-blue-700" />
            <span>ثبت پیشنهاد تهاتر</span>
          </button>

          <button
            onClick={() => {
              setIsOpen(false);
              onOpenPartnership();
            }}
            className="bg-white hover:bg-purple-50 text-slate-950 text-xs py-2.5 px-4 rounded-2xl shadow-md border-2 border-purple-400 flex items-center gap-2 font-black transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Handshake className="w-4 h-4 text-purple-700" />
            <span>ثبت پروژه مشارکت</span>
          </button>

        </div>
      )}

      {/* Main Floating Trigger Button with 3D tactile feel */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-2xl btn-3d-gold flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-xl"
        aria-label="افزودن اقدام جدید"
      >
        {isOpen ? (
          <X className="w-7 h-7 stroke-[3] text-[#221503]" />
        ) : (
          <Plus className="w-7 h-7 stroke-[3] text-[#221503]" />
        )}
      </button>
    </div>
  );
};
