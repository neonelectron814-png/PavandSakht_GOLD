import React from 'react';
import { Percent, ShieldCheck, MapPin, Lock, AlertTriangle, ArrowLeft, Sparkles, Flame } from 'lucide-react';
import { Property } from '../../types';
import { formatTomanShort, getVerificationBadgeColor, getVerificationBadgeText, toPersianDigits } from '../../utils/formatters';

interface RateCutterPageProps {
  properties: Property[];
  onSelectProperty: (p: Property) => void;
  onEnterDealRoom: (code: string) => void;
}

export const RateCutterPage: React.FC<RateCutterPageProps> = ({
  properties,
  onSelectProperty,
  onEnterDealRoom,
}) => {
  const rateCutters = properties.filter((p) => p.isRateCutter);

  return (
    <div className="space-y-6 pb-12 text-[#1c1d22]">
      
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#ded5c5] space-y-3 relative overflow-hidden shadow-xs">
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-900 border border-rose-200 px-3.5 py-1 rounded-full text-xs font-black mb-2 shadow-xs">
              <Flame className="w-4 h-4 text-rose-600 animate-bounce" />
              <span>فروش فوری فایل‌های زیر قیمت کارشناسی</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">بخش نرخ‌شکن (Rate Cutter)</h1>
            <p className="text-xs text-slate-600 font-medium mt-1 max-w-xl">
              املاکی که به دلیل نیاز فوری مالک به نقدشوندگی، با درصد تخفیف مشخص و علت شفاف تحت نظارت کارشناسان پیوندساخت عرضه شده‌اند.
            </p>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {rateCutters.map((property) => {
          return (
            <div
              key={property.id}
              className="bg-white rounded-3xl border border-[#ded5c5] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              {/* Image & Discount Tag */}
              <div className="relative h-50 bg-slate-100 group overflow-hidden">
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-slate-900 text-[10px] px-2.5 py-1 rounded-xl font-mono font-bold border border-slate-200">
                  {property.code}
                </span>

                <div className="absolute top-3 left-3 bg-rose-600 text-white text-xs font-black px-3.5 py-1.5 rounded-2xl shadow-md border border-rose-500 flex items-center gap-1.5 animate-pulse">
                  <Percent className="w-3.5 h-3.5" />
                  <span>%{toPersianDigits(property.discountPercent || 10)} زیر قیمت</span>
                </div>
              </div>

              {/* Body */}
              <div className="p-4.5 space-y-3.5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 mb-1.5 font-bold">
                    <MapPin className="w-3.5 h-3.5 text-amber-600" />
                    <span>{property.city} | {property.district}</span>
                  </div>

                  <h3 className="font-black text-sm text-slate-900 line-clamp-2 leading-snug">
                    {property.title}
                  </h3>
                </div>

                {/* Reason for discount */}
                {property.discountReason && (
                  <div className="bg-rose-50/80 border border-rose-200 p-3 rounded-2xl text-xs text-rose-900 flex items-start gap-2 shadow-xs">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-[10px] block text-rose-800">علت فروش زیر قیمت:</span>
                      <p className="text-[11px] font-medium leading-relaxed">{property.discountReason}</p>
                    </div>
                  </div>
                )}

                {/* Prices */}
                <div className="pt-2 flex items-center justify-between border-t border-[#eee7db] text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 block font-bold">قیمت کارشناسی:</span>
                    <span className="text-sm font-black text-slate-900">{formatTomanShort(property.price)}</span>
                  </div>
                  <div className="text-left">
                    <span className="text-[10px] text-slate-500 block font-bold">قیمت متری:</span>
                    <span className="text-xs font-black text-rose-600">{formatTomanShort(property.pricePerMeter)}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex gap-2">
                  <button
                    onClick={() => onSelectProperty(property)}
                    className="flex-1 bg-[#faf8f4] hover:bg-slate-100 text-slate-800 font-bold py-2.5 rounded-xl text-xs transition-colors border border-[#ded5c5] cursor-pointer"
                  >
                    شناسنامه ملک
                  </button>

                  <button
                    onClick={() => onEnterDealRoom(property.code)}
                    className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-black py-2.5 rounded-xl text-xs transition-transform hover:scale-102 flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>ورود به معامله</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
