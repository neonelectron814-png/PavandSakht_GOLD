import React from 'react';
import { Percent, MapPin, Lock, AlertTriangle, Flame } from 'lucide-react';
import { Property } from '../../types';
import { formatTomanShort, toPersianDigits } from '../../utils/formatters';

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
      {/* Header Banner Card (Full Framed 3D Gold Box) */}
      <div className="bg-white p-5 sm:p-6 rounded-[28px] border-2 border-[#dfc282] space-y-3 relative overflow-hidden shadow-[0_4px_16px_rgba(180,130,40,0.1)]">
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 btn-3d-gold text-[#2c1b04] px-3.5 py-1 rounded-xl text-xs font-black mb-2 shadow-2xs">
              <Flame className="w-4 h-4 text-rose-700 animate-bounce" />
              <span>فروش فوری فایل‌های زیر قیمت کارشناسی</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-950">بخش نرخ‌شکن (Rate Cutter)</h1>
            <p className="text-[15px] text-slate-700 font-bold mt-1 max-w-xl leading-relaxed">
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
              className="bg-white rounded-[28px] border-2 border-[#dfc282] overflow-hidden shadow-[0_4px_16px_rgba(180,130,40,0.1)] hover:shadow-xl transition-all flex flex-col justify-between group"
            >
              {/* Image & Discount Tag */}
              <div className="relative h-50 bg-slate-100 group overflow-hidden">
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                <span className="absolute top-3 right-3 bg-slate-950/85 text-white text-xs px-2.5 py-1 rounded-xl font-mono font-bold backdrop-blur-md">
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
                  <div className="flex items-center gap-1 text-xs text-slate-600 mb-1.5 font-bold">
                    <MapPin className="w-3.5 h-3.5 text-amber-800" />
                    <span>{property.city} | {property.district}</span>
                  </div>

                  <h3 className="font-black text-base text-slate-950 line-clamp-2 leading-snug">
                    {property.title}
                  </h3>
                </div>

                {/* Reason for discount */}
                {property.discountReason && (
                  <div className="bg-rose-50/90 border border-rose-200 p-3 rounded-2xl text-xs text-rose-950 flex items-start gap-2 shadow-xs">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-xs block text-rose-900">علت فروش زیر قیمت:</span>
                      <p className="text-[13px] font-bold leading-relaxed">{property.discountReason}</p>
                    </div>
                  </div>
                )}

                {/* Prices */}
                <div className="pt-2 flex items-center justify-between border-t border-[#eee7db] text-xs">
                  <div>
                    <span className="text-xs text-slate-500 line-through block font-mono">
                      {formatTomanShort(property.price * 1.12)}
                    </span>
                    <span className="text-base font-black text-rose-800 font-mono">
                      {formatTomanShort(property.price)} تومان
                    </span>
                  </div>
                  <div className="text-left">
                    <span className="text-xs text-slate-500 block">قیمت متری:</span>
                    <span className="text-sm font-black text-slate-900 font-mono">
                      {formatTomanShort(property.pricePerMeter)}
                    </span>
                  </div>
                </div>

                {/* Action Buttons (Compact, 15px Font Size) */}
                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => onSelectProperty(property)}
                    className="flex-1 h-9 bg-white hover:bg-amber-50/60 text-slate-950 text-[15px] font-black rounded-xl transition-all text-center border-2 border-[#dfc282] shadow-2xs active:scale-95 cursor-pointer"
                  >
                    مشاهده پرونده
                  </button>
                  <button
                    onClick={() => onEnterDealRoom(property.code)}
                    className="flex-1 h-9 btn-3d-gold text-[#2c1b04] text-[15px] font-black rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-2xs active:scale-95 cursor-pointer"
                  >
                    <Lock className="w-4 h-4 stroke-[2.5]" />
                    <span>ورود به اتاق معامله</span>
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
