import React, { useState } from 'react';
import { RefreshCw, Building2, Package, Calculator, CheckCircle2, ArrowLeft, Send, Sparkles } from 'lucide-react';
import { BarterOffer } from '../../types';
import { mockBarterOffers } from '../../data/mockData';
import { formatToman, formatTomanShort, toPersianDigits } from '../../utils/formatters';

interface BarterPageProps {
  onOpenBarterOfferModal: () => void;
}

export const BarterPage: React.FC<BarterPageProps> = ({ onOpenBarterOfferModal }) => {
  const [activeType, setActiveType] = useState<'all' | 'property_to_property' | 'property_to_materials'>('all');
  
  // Barter Calculator States
  const [sourceVal, setSourceVal] = useState<number>(30000000000);
  const [targetVal, setTargetVal] = useState<number>(25000000000);

  const diffVal = Math.abs(sourceVal - targetVal);
  const payer = sourceVal > targetVal ? 'طرف دوم (دریافت‌کننده ملک)' : 'طرف اول (ارائه‌دهنده ملک)';

  const filteredOffers = mockBarterOffers.filter((o) => {
    if (activeType === 'all') return true;
    return o.type === activeType;
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Banner with Glassmorphism */}
      <div className="glass-card text-white p-6 sm:p-7 rounded-3xl border border-blue-500/30 space-y-3 relative overflow-hidden shadow-glass-3d">
        <div className="absolute top-0 -left-10 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 glass-blue text-blue-200 border border-blue-400/40 px-3.5 py-1 rounded-full text-xs font-black mb-2 shadow-sm">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
              <span>پلتفرم تطبیق هوشمند تهاتر</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">سامانه تهاتر تخصصی ملک و مصالح</h1>
            <p className="text-xs text-slate-300 font-light mt-1 max-w-xl">
              تهاتر مستقیم «ملک با ملک» و «ملک با مصالح ساختمانی کارخانه». بدون واسطه با محاسبه‌گر دقیق ارزش و تطبیق هوشمند.
            </p>
          </div>

          <button
            onClick={onOpenBarterOfferModal}
            className="btn-3d-amber text-slate-950 text-xs font-black px-5 py-3 rounded-2xl shadow-lg transition-all shrink-0 cursor-pointer border border-amber-300/50"
          >
            + ثبت پیشنهاد تهاتر جدید
          </button>
        </div>
      </div>

      {/* Interactive Barter Calculator 3D Glass Card */}
      <div className="glass-card p-5 sm:p-6 rounded-3xl border border-white/15 space-y-4 shadow-glass-3d">
        <h2 className="text-sm font-extrabold text-white flex items-center gap-2 border-b border-white/10 pb-3">
          <Calculator className="w-4 h-4 text-blue-400" />
          <span>محاسبه‌گر مابه‌التفاوت و تطبیق تهاتر</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-300 font-bold mb-1.5">ارزش ملک / دارایی اول (تومان):</label>
            <input
              type="number"
              step={1000000000}
              value={sourceVal}
              onChange={(e) => setSourceVal(Number(e.target.value))}
              className="w-full bg-slate-950/80 border border-white/15 rounded-xl px-3.5 py-2.5 font-mono font-bold text-white focus:outline-none focus:border-blue-400"
            />
            <span className="text-[10px] text-blue-300 mt-1 block font-bold">{formatTomanShort(sourceVal)}</span>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1.5">ارزش ملک / مصالح دوم (تومان):</label>
            <input
              type="number"
              step={1000000000}
              value={targetVal}
              onChange={(e) => setTargetVal(Number(e.target.value))}
              className="w-full bg-slate-950/80 border border-white/15 rounded-xl px-3.5 py-2.5 font-mono font-bold text-white focus:outline-none focus:border-blue-400"
            />
            <span className="text-[10px] text-blue-300 mt-1 block font-bold">{formatTomanShort(targetVal)}</span>
          </div>
        </div>

        <div className="p-4 glass-blue border border-blue-400/40 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-blue-100 shadow-inner">
          <div>
            <span className="text-[10px] text-blue-300 block font-medium">مابه‌التفاوت نقد قابل پرداخت:</span>
            <span className="font-black text-base text-white">{formatTomanShort(diffVal)}</span>
          </div>
          <div className="text-left">
            <span className="text-[10px] text-blue-300 block font-medium">پرداخت‌کننده مابه‌التفاوت:</span>
            <span className="font-bold text-blue-200">{payer}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
        <button
          onClick={() => setActiveType('all')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all card-3d-tilt ${
            activeType === 'all' ? 'glass-panel-dark text-white border border-white/25 shadow-glass-3d' : 'glass-card text-slate-300 hover:text-white border border-white/10'
          }`}
        >
          همه پیشنهادها
        </button>

        <button
          onClick={() => setActiveType('property_to_materials')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all card-3d-tilt ${
            activeType === 'property_to_materials' ? 'glass-emerald text-white border border-emerald-400/50 shadow-glass-3d' : 'glass-card text-emerald-300 hover:text-emerald-200 border border-white/10'
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          <span>ملک با مصالح</span>
        </button>

        <button
          onClick={() => setActiveType('property_to_property')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all card-3d-tilt ${
            activeType === 'property_to_property' ? 'glass-blue text-white border border-blue-400/50 shadow-glass-3d' : 'glass-card text-blue-300 hover:text-blue-200 border border-white/10'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>ملک با ملک</span>
        </button>
      </div>

      {/* Offer Cards */}
      <div className="space-y-4">
        {filteredOffers.map((offer) => (
          <div key={offer.id} className="glass-card p-5 sm:p-6 rounded-3xl border border-white/15 shadow-glass-3d space-y-4 card-3d-tilt">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] glass-blue text-blue-200 font-black px-3 py-1 rounded-full mb-1.5 inline-block border border-blue-400/40">
                  {offer.type === 'property_to_materials' ? 'تهاتر ملک↔مصالح' : 'تهاتر ملک↔ملک'}
                </span>
                <h3 className="font-extrabold text-sm text-white">{offer.title}</h3>
              </div>

              <span className="text-xs font-black text-emerald-300 glass-emerald border border-emerald-400/40 px-3.5 py-1.5 rounded-xl w-fit shadow-sm">
                درصد تطبیق: %{toPersianDigits(offer.matchScorePercent)}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 glass-panel-dark rounded-2xl space-y-1 border border-white/10">
                <span className="text-[10px] text-slate-400 block font-medium">مبدأ (ارائه):</span>
                <p className="font-extrabold text-white">{offer.sourceTitle}</p>
                <p className="text-amber-400 font-black font-mono">ارزش: {formatTomanShort(offer.sourceValue)}</p>
              </div>

              <div className="p-3.5 glass-panel-dark rounded-2xl space-y-1 border border-white/10">
                <span className="text-[10px] text-slate-400 block font-medium">مقصد (درخواست):</span>
                <p className="font-extrabold text-white">{offer.targetRequirement}</p>
                <p className="text-emerald-400 font-black font-mono">برآورد: {formatTomanShort(offer.targetEstimatedValue)}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-slate-400">ثبت‌کننده: {offer.ownerName}</span>
              <button
                onClick={() => alert(`درخواست مذاکره تهاتر برای "${offer.title}" ثبت گردید.`)}
                className="glass-amber hover:brightness-110 text-amber-300 font-black px-4.5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-all border border-amber-400/40 active:scale-95 cursor-pointer shadow-sm"
              >
                <span>مذاکره و ورود به اتاق تهاتر</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
