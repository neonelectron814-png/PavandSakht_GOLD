import React, { useState } from 'react';
import { RefreshCw, Building2, Package, Calculator, CheckCircle2, ArrowLeft, Send, Sparkles, Car, Layers } from 'lucide-react';
import { BarterOffer } from '../../types';
import { mockBarterOffers } from '../../data/mockData';
import { formatTomanShort, toPersianDigits } from '../../utils/formatters';

interface BarterPageProps {
  onOpenBarterOfferModal: () => void;
  onEnterDealRoom?: (code: string) => void;
}

export const BarterPage: React.FC<BarterPageProps> = ({ onOpenBarterOfferModal, onEnterDealRoom }) => {
  const [activeType, setActiveType] = useState<'all' | 'property_to_property' | 'property_to_materials' | 'property_to_vehicle' | 'custom_trade'>('all');
  
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
    <div className="space-y-6 pb-12 text-[#1c1d22]">
      
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#ded5c5] space-y-3 relative overflow-hidden shadow-xs">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-900 border border-amber-300 px-3.5 py-1 rounded-full text-xs font-black mb-2 shadow-xs">
              <RefreshCw className="w-3.5 h-3.5 text-amber-600 animate-spin" style={{ animationDuration: '6s' }} />
              <span>پلتفرم تطبیق هوشمند تهاتر</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">سامانه تهاتر تخصصی ملک و مصالح</h1>
            <p className="text-xs text-slate-600 font-medium mt-1 max-w-xl">
              تهاتر مستقیم «ملک با ملک» و «ملک با مصالح ساختمانی کارخانه» بدون واسطه با محاسبه‌گر دقیق ارزش و تطبیق هوشمند.
            </p>
          </div>

          <button
            onClick={onOpenBarterOfferModal}
            className="bg-gradient-to-r from-[#b88c42] to-[#8d6520] hover:from-[#a67c35] hover:to-[#7a5518] text-white text-xs font-black px-5 py-3 rounded-2xl shadow-md transition-all shrink-0 cursor-pointer"
          >
            + ثبت پیشنهاد تهاتر جدید
          </button>
        </div>
      </div>

      {/* Interactive Barter Calculator Card */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#ded5c5] space-y-4 shadow-xs">
        <h2 className="text-sm font-black text-slate-900 flex items-center gap-2 border-b border-[#eee7db] pb-3">
          <Calculator className="w-4 h-4 text-amber-600" />
          <span>محاسبه‌گر مابه‌التفاوت و تطبیق تهاتر</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-700 font-bold mb-1.5">ارزش ملک / دارایی اول (تومان):</label>
            <input
              type="number"
              step={1000000000}
              value={sourceVal}
              onChange={(e) => setSourceVal(Number(e.target.value))}
              className="w-full bg-white border border-[#ded5c5] rounded-xl px-3.5 py-2.5 font-mono font-bold text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
            />
            <span className="text-[10px] text-amber-700 mt-1 block font-bold">{formatTomanShort(sourceVal)}</span>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1.5">ارزش ملک / مصالح دوم (تومان):</label>
            <input
              type="number"
              step={1000000000}
              value={targetVal}
              onChange={(e) => setTargetVal(Number(e.target.value))}
              className="w-full bg-white border border-[#ded5c5] rounded-xl px-3.5 py-2.5 font-mono font-bold text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
            />
            <span className="text-[10px] text-amber-700 mt-1 block font-bold">{formatTomanShort(targetVal)}</span>
          </div>
        </div>

        <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-xs">
          <div>
            <span className="text-[10px] text-slate-600 block font-bold">مابه‌التفاوت نقد قابل پرداخت:</span>
            <span className="font-black text-base text-amber-900">{formatTomanShort(diffVal)}</span>
          </div>
          <div className="text-left">
            <span className="text-[10px] text-slate-600 block font-bold">پرداخت‌کننده مابه‌التفاوت:</span>
            <span className="font-bold text-slate-900">{payer}</span>
          </div>
        </div>
      </div>

      {/* Tabs: Barter Trade Exchange Modules */}
      <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
        <button
          onClick={() => setActiveType('all')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
            activeType === 'all' 
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-sm font-black' 
              : 'bg-white text-slate-700 hover:text-slate-950 border border-[#ded5c5]'
          }`}
        >
          همه پیشنهادها
        </button>

        <button
          onClick={() => setActiveType('property_to_property')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeType === 'property_to_property' 
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-sm font-black' 
              : 'bg-white text-slate-700 hover:text-slate-950 border border-[#ded5c5]'
          }`}
        >
          <Building2 className="w-3.5 h-3.5 text-amber-600" />
          <span>ملک با ملک</span>
        </button>

        <button
          onClick={() => setActiveType('property_to_materials')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeType === 'property_to_materials' 
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-sm font-black' 
              : 'bg-white text-slate-700 hover:text-slate-950 border border-[#ded5c5]'
          }`}
        >
          <Package className="w-3.5 h-3.5 text-amber-600" />
          <span>ملک با متریال</span>
        </button>

        <button
          onClick={() => setActiveType('property_to_vehicle')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeType === 'property_to_vehicle' 
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-sm font-black' 
              : 'bg-white text-slate-700 hover:text-slate-950 border border-[#ded5c5]'
          }`}
        >
          <Car className="w-3.5 h-3.5 text-amber-600" />
          <span>ملک با خودرو / ماشین‌آلات</span>
        </button>

        <button
          onClick={() => setActiveType('custom_trade')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeType === 'custom_trade' 
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-sm font-black' 
              : 'bg-white text-slate-700 hover:text-slate-950 border border-[#ded5c5]'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-amber-600" />
          <span>سایر تهاترها</span>
        </button>
      </div>

      {/* Offer Cards */}
      <div className="space-y-4">
        {filteredOffers.map((offer) => (
          <div key={offer.id} className="bg-white p-5 sm:p-6 rounded-3xl border border-[#ded5c5] shadow-xs space-y-4 hover:shadow-md transition-all">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#eee7db] pb-3">
              <div>
                <span className="text-[10px] bg-amber-50 text-amber-900 font-black px-3 py-1 rounded-full mb-1.5 inline-block border border-amber-200">
                  {offer.type === 'property_to_materials' && 'تهاتر ملک↔مصالح'}
                  {offer.type === 'property_to_property' && 'تهاتر ملک↔ملک'}
                  {offer.type === 'property_to_vehicle' && 'تهاتر ملک↔خودرو/ماشین‌آلات'}
                  {offer.type === 'custom_trade' && 'تهاتر سفارشی'}
                </span>
                <h3 className="font-black text-sm text-slate-900">{offer.title}</h3>
              </div>

              <span className="text-xs font-black text-emerald-800 bg-emerald-50 border border-emerald-300 px-3.5 py-1.5 rounded-xl w-fit shadow-xs">
                درصد تطبیق: %{toPersianDigits(offer.matchScorePercent)}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-[#faf8f4] rounded-2xl space-y-1 border border-[#e8dfd2]">
                <span className="text-[10px] text-slate-500 block font-bold">مبدأ (ارائه):</span>
                <p className="font-black text-slate-900">{offer.sourceTitle}</p>
                <p className="text-amber-700 font-black font-mono">ارزش: {formatTomanShort(offer.sourceValue)}</p>
              </div>

              <div className="p-3.5 bg-[#faf8f4] rounded-2xl space-y-1 border border-[#e8dfd2]">
                <span className="text-[10px] text-slate-500 block font-bold">مقصد (درخواست):</span>
                <p className="font-black text-slate-900">{offer.targetRequirement}</p>
                <p className="text-emerald-700 font-black font-mono">برآورد: {formatTomanShort(offer.targetEstimatedValue)}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 flex-wrap gap-2">
              <span className="text-xs text-slate-500 font-bold">ثبت‌کننده: {offer.ownerName}</span>
              <button
                onClick={() => {
                  if (onEnterDealRoom) {
                    onEnterDealRoom(offer.id);
                  }
                }}
                className="bg-amber-50 hover:bg-amber-100 text-amber-900 font-black px-4.5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-all border border-amber-300 cursor-pointer shadow-xs"
              >
                <span>انتقال به اتاق معامله امن جهت عقد قرارداد</span>
                <ArrowLeft className="w-3.5 h-3.5 text-amber-700" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
