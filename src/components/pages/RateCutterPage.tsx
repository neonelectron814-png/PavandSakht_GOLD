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
    <div className="space-y-6 pb-12">
      
      {/* Header Banner with 3D Glass Accent */}
      <div className="glass-card text-white p-6 sm:p-7 rounded-3xl border border-rose-500/30 space-y-3 relative overflow-hidden shadow-glass-3d">
        <div className="absolute top-0 -left-10 w-80 h-80 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 glass-rose text-rose-200 border border-rose-400/40 px-3.5 py-1 rounded-full text-xs font-black mb-2 shadow-sm">
              <Flame className="w-4 h-4 text-rose-400 animate-bounce" />
              <span>فروش فوری فایل‌های زیر قیمت کارشناسی</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">بخش نرخ‌شکن (Rate Cutter)</h1>
            <p className="text-xs text-slate-300 font-light mt-1 max-w-xl">
              املاکی که به دلیل نیاز فوری مالک به نقدشوندگی، با درصد تخفیف مشخص و علت شفاف تحت نظارت آکان عرضه شده‌اند.
            </p>
          </div>
        </div>
      </div>

      {/* 3D Glass Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {rateCutters.map((property) => {
          return (
            <div
              key={property.id}
              className="glass-card rounded-3xl border border-rose-500/30 overflow-hidden shadow-glass-3d card-3d-tilt flex flex-col justify-between group"
            >
              {/* Image & Discount Tag */}
              <div className="relative h-50 bg-slate-900 group overflow-hidden">
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                <span className="absolute top-3 right-3 glass-panel-dark text-white text-[10px] px-2.5 py-1 rounded-xl font-mono font-bold border border-white/20">
                  {property.code}
                </span>

                <div className="absolute top-3 left-3 glass-rose text-white text-xs font-black px-3.5 py-1.5 rounded-2xl shadow-lg border border-rose-400/50 flex items-center gap-1.5 animate-pulse">
                  <Percent className="w-3.5 h-3.5" />
                  <span>%{toPersianDigits(property.discountPercent || 10)} زیر قیمت</span>
                </div>
              </div>

              {/* Body */}
              <div className="p-4.5 space-y-3.5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" />
                    <span>{property.city} | {property.district}</span>
                  </div>

                  <h3 className="font-extrabold text-sm text-white line-clamp-2 leading-snug">
                    {property.title}
                  </h3>
                </div>

                {/* Reason for discount */}
                {property.discountReason && (
                  <div className="glass-rose border border-rose-400/40 p-3 rounded-2xl text-xs text-rose-100 flex items-start gap-2 shadow-inner">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-[10px] block text-rose-300">علت فروش زیر قیمت:</span>
                      <p className="text-[11px] font-medium leading-relaxed">{property.discountReason}</p>
                    </div>
                  </div>
                )}

                {/* Prices */}
                <div className="pt-2 flex items-center justify-between border-t border-white/10 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">قیمت کارشناسی:</span>
                    <span className="text-sm font-black text-white">{formatTomanShort(property.price)}</span>
                  </div>
                  <div className="text-left">
                    <span className="text-[10px] text-slate-400 block">قیمت متری:</span>
                    <span className="text-xs font-black text-rose-400">{formatTomanShort(property.pricePerMeter)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => onSelectProperty(property)}
                    className="flex-1 glass-card hover:bg-white/20 text-white text-xs font-bold py-2.5 rounded-xl text-center transition-all border border-white/20 active:scale-95 cursor-pointer"
                  >
                    جزئیات ملک
                  </button>
                  <button
                    onClick={() => onEnterDealRoom(property.code)}
                    className="flex-1 glass-rose hover:brightness-110 text-white text-xs font-black py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md border border-rose-400/50 active:scale-95 cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5" />
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
