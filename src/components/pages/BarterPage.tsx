import React, { useState } from 'react';
import { RefreshCw, Building2, Package, Calculator, ArrowLeft, Car, Layers, PlusCircle } from 'lucide-react';
import { mockBarterOffers } from '../../data/mockData';
import { formatTomanShort, toPersianDigits } from '../../utils/formatters';

interface BarterPageProps {
  onOpenBarterOfferModal: () => void;
  onEnterDealRoom?: (code: string) => void;
}

export const BarterPage: React.FC<BarterPageProps> = ({ onOpenBarterOfferModal, onEnterDealRoom }) => {
  const [activeType, setActiveType] = useState<
    'all' | 'property_to_property' | 'property_to_materials' | 'property_to_vehicle' | 'custom_trade'
  >('all');

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
      {/* Header Banner Card (Full Framed 3D Gold Box) */}
      <div className="bg-white p-5 sm:p-6 rounded-[28px] border-2 border-[#dfc282] space-y-3 relative overflow-hidden shadow-[0_4px_16px_rgba(180,130,40,0.1)]">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 btn-3d-gold text-[#2c1b04] px-3 py-1 rounded-lg text-xs font-black mb-2 shadow-2xs">
              <RefreshCw className="w-3.5 h-3.5 stroke-[2.5] text-amber-900 animate-spin" style={{ animationDuration: '6s' }} />
              <span>پلتفرم تطبیق هوشمند تهاتر</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-950">
              سامانه تهاتر تخصصی ملک و مصالح
            </h1>
            <p className="text-[15px] text-slate-700 font-bold mt-1 max-w-2xl leading-relaxed">
              تهاتر مستقیم «ملک با ملک» و «ملک با مصالح ساختمانی کارخانه» بدون واسطه با محاسبه‌گر دقیق ارزش و تطبیق هوشمند.
            </p>
          </div>

          <button
            onClick={onOpenBarterOfferModal}
            className="h-10 px-4.5 btn-3d-gold text-[#2c1b04] text-[15px] font-black rounded-xl shadow-2xs transition-all active:scale-95 shrink-0 cursor-pointer flex items-center gap-2"
          >
            <PlusCircle className="w-4.5 h-4.5 stroke-[2.5]" />
            <span>ثبت پیشنهاد تهاتر جدید</span>
          </button>
        </div>
      </div>

      {/* Interactive Barter Calculator Card */}
      <div className="bg-white p-5 sm:p-6 rounded-[28px] border-2 border-[#dfc282] space-y-4 shadow-[0_4px_16px_rgba(180,130,40,0.1)]">
        <h2 className="text-base sm:text-lg font-black text-slate-950 flex items-center gap-2 border-b border-[#eee7db] pb-3">
          <Calculator className="w-5 h-5 text-amber-700" />
          <span>محاسبه‌گر مابه‌التفاوت و تطبیق تهاتر</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-950 font-black text-[15px] mb-2">
              ارزش ملک / دارایی اول (تومان):
            </label>
            <input
              type="number"
              step={1000000000}
              value={sourceVal}
              onChange={(e) => setSourceVal(Number(e.target.value))}
              className="w-full bg-white border-2 border-[#dfc282] focus:border-[#caa758] rounded-xl px-3.5 py-2.5 font-mono text-[15px] font-black text-slate-950 shadow-2xs focus:outline-none transition-all"
            />
            <span className="text-[15px] text-amber-900 mt-1.5 block font-black">
              {formatTomanShort(sourceVal)} تومان
            </span>
          </div>

          <div>
            <label className="block text-slate-950 font-black text-[15px] mb-2">
              ارزش ملک / مصالح دوم (تومان):
            </label>
            <input
              type="number"
              step={1000000000}
              value={targetVal}
              onChange={(e) => setTargetVal(Number(e.target.value))}
              className="w-full bg-white border-2 border-[#dfc282] focus:border-[#caa758] rounded-xl px-3.5 py-2.5 font-mono text-[15px] font-black text-slate-950 shadow-2xs focus:outline-none transition-all"
            />
            <span className="text-[15px] text-amber-900 mt-1.5 block font-black">
              {formatTomanShort(targetVal)} تومان
            </span>
          </div>
        </div>

        <div className="p-4 bg-amber-50/90 border-2 border-[#caa758] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
          <div>
            <span className="text-xs text-slate-600 block font-bold">مابه‌التفاوت نقد قابل پرداخت:</span>
            <span className="font-black text-lg sm:text-xl text-amber-950 font-mono">
              {formatTomanShort(diffVal)} تومان
            </span>
          </div>
          <div className="text-left">
            <span className="text-xs text-slate-600 block font-bold">پرداخت‌کننده مابه‌التفاوت:</span>
            <span className="font-black text-[15px] text-slate-950">{payer}</span>
          </div>
        </div>
      </div>

      {/* Tabs: Barter Trade Exchange Modules (Compact 3D Gold Buttons, 15px Font Size) */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        <button
          onClick={() => setActiveType('all')}
          className={`h-9 px-4 rounded-xl text-[15px] font-black shrink-0 transition-all cursor-pointer flex items-center justify-center active:scale-95 ${
            activeType === 'all'
              ? 'btn-3d-gold text-[#2c1b04] shadow-2xs'
              : 'bg-white text-slate-800 hover:bg-amber-50/60 border-2 border-[#dfc282] shadow-2xs'
          }`}
        >
          همه پیشنهادها
        </button>

        <button
          onClick={() => setActiveType('property_to_property')}
          className={`h-9 px-4 rounded-xl text-[15px] font-black flex items-center gap-1.5 shrink-0 transition-all cursor-pointer active:scale-95 ${
            activeType === 'property_to_property'
              ? 'btn-3d-gold text-[#2c1b04] shadow-2xs'
              : 'bg-white text-slate-800 hover:bg-amber-50/60 border-2 border-[#dfc282] shadow-2xs'
          }`}
        >
          <Building2 className="w-4 h-4 text-amber-700" />
          <span>ملک با ملک</span>
        </button>

        <button
          onClick={() => setActiveType('property_to_materials')}
          className={`h-9 px-4 rounded-xl text-[15px] font-black flex items-center gap-1.5 shrink-0 transition-all cursor-pointer active:scale-95 ${
            activeType === 'property_to_materials'
              ? 'btn-3d-gold text-[#2c1b04] shadow-2xs'
              : 'bg-white text-slate-800 hover:bg-amber-50/60 border-2 border-[#dfc282] shadow-2xs'
          }`}
        >
          <Package className="w-4 h-4 text-amber-700" />
          <span>ملک با متریال</span>
        </button>

        <button
          onClick={() => setActiveType('property_to_vehicle')}
          className={`h-9 px-4 rounded-xl text-[15px] font-black flex items-center gap-1.5 shrink-0 transition-all cursor-pointer active:scale-95 ${
            activeType === 'property_to_vehicle'
              ? 'btn-3d-gold text-[#2c1b04] shadow-2xs'
              : 'bg-white text-slate-800 hover:bg-amber-50/60 border-2 border-[#dfc282] shadow-2xs'
          }`}
        >
          <Car className="w-4 h-4 text-amber-700" />
          <span>ملک با خودرو / ماشین‌آلات</span>
        </button>

        <button
          onClick={() => setActiveType('custom_trade')}
          className={`h-9 px-4 rounded-xl text-[15px] font-black flex items-center gap-1.5 shrink-0 transition-all cursor-pointer active:scale-95 ${
            activeType === 'custom_trade'
              ? 'btn-3d-gold text-[#2c1b04] shadow-2xs'
              : 'bg-white text-slate-800 hover:bg-amber-50/60 border-2 border-[#dfc282] shadow-2xs'
          }`}
        >
          <Layers className="w-4 h-4 text-amber-700" />
          <span>سایر تهاترها</span>
        </button>
      </div>

      {/* Offer Cards (Framed Gold Cards with 15px Font Size) */}
      <div className="space-y-4">
        {filteredOffers.map((offer) => (
          <div
            key={offer.id}
            className="bg-white p-5 sm:p-6 rounded-[28px] border-2 border-[#dfc282] shadow-[0_4px_16px_rgba(180,130,40,0.1)] space-y-4 hover:shadow-md transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#eee7db] pb-3">
              <div>
                <span className="text-[13px] bg-amber-50 text-amber-950 font-black px-3 py-1 rounded-full mb-1.5 inline-block border border-amber-300">
                  {offer.type === 'property_to_materials' && 'تهاتر ملک ↔ مصالح'}
                  {offer.type === 'property_to_property' && 'تهاتر ملک ↔ ملک'}
                  {offer.type === 'property_to_vehicle' && 'تهاتر ملک ↔ خودرو / ماشین‌آلات'}
                  {offer.type === 'custom_trade' && 'تهاتر سفارشی'}
                </span>
                <h3 className="font-black text-base sm:text-lg text-slate-950">{offer.title}</h3>
              </div>

              <span className="text-[15px] font-black text-emerald-900 bg-emerald-50 border-2 border-emerald-300 px-3.5 py-1.5 rounded-xl w-fit shadow-xs">
                درصد تطبیق: %{toPersianDigits(offer.matchScorePercent)}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3.5 bg-[#faf8f4] rounded-2xl space-y-1.5 border border-[#e8dfd2]">
                <span className="text-xs text-slate-500 block font-bold">مبدأ (ارائه):</span>
                <p className="font-black text-[15px] text-slate-950">{offer.sourceTitle}</p>
                <p className="text-amber-900 font-black font-mono text-[15px]">
                  ارزش: {formatTomanShort(offer.sourceValue)} تومان
                </p>
              </div>

              <div className="p-3.5 bg-[#faf8f4] rounded-2xl space-y-1.5 border border-[#e8dfd2]">
                <span className="text-xs text-slate-500 block font-bold">مقصد (درخواست):</span>
                <p className="font-black text-[15px] text-slate-950">{offer.targetRequirement}</p>
                <p className="text-emerald-800 font-black font-mono text-[15px]">
                  برآورد: {formatTomanShort(offer.targetEstimatedValue)} تومان
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 flex-wrap gap-3">
              <span className="text-[15px] text-slate-700 font-bold">ثبت‌کننده: {offer.ownerName}</span>
              <button
                onClick={() => {
                  if (onEnterDealRoom) {
                    onEnterDealRoom(offer.id);
                  }
                }}
                className="h-9 px-4.5 btn-3d-gold text-[#2c1b04] font-black text-[15px] rounded-xl flex items-center gap-2 transition-all active:scale-95 cursor-pointer shadow-2xs"
              >
                <span>انتقال به اتاق معامله امن جهت عقد قرارداد</span>
                <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
