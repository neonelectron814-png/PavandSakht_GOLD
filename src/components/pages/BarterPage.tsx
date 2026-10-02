import React, { useState } from 'react';
import { 
  RefreshCw, 
  Building2, 
  Package, 
  Calculator, 
  ArrowLeft, 
  Car, 
  PlusCircle, 
  CheckCircle2, 
  X,
  Phone,
  ShieldCheck,
  Calendar,
  Layers
} from 'lucide-react';
import { mockBarterOffers } from '../../data/mockData';
import { BarterOffer } from '../../types';
import { formatTomanShort, toPersianDigits } from '../../utils/formatters';

interface BarterPageProps {
  onOpenBarterOfferModal: () => void;
  onEnterDealRoom?: (code: string) => void;
}

export const BarterPage: React.FC<BarterPageProps> = ({ onOpenBarterOfferModal, onEnterDealRoom }) => {
  // تفکیک ۴ شاخه اصلی تهاتر: همه، ملک، متریال، خودرو
  const [activeType, setActiveType] = useState<
    'all' | 'property_to_property' | 'property_to_materials' | 'property_to_vehicle'
  >('all');

  // Single focused file view modal
  const [selectedOffer, setSelectedOffer] = useState<BarterOffer | null>(null);

  // Barter Calculator States
  const [sourceVal, setSourceVal] = useState<number>(28000000000);
  const [targetVal, setTargetVal] = useState<number>(25000000000);

  const diffVal = Math.abs(sourceVal - targetVal);
  const payer = sourceVal > targetVal ? 'طرف دوم (دریافت‌کننده ملک)' : 'طرف اول (ارائه‌دهنده ملک)';

  const filteredOffers = mockBarterOffers.filter((o) => {
    if (activeType === 'all') return true;
    return o.type === activeType;
  });

  return (
    <div className="space-y-5 pb-14 text-[#1c1d22]" dir="rtl">
      
      {/* هدر بخش تهاتر با دکمه ثبت مستقیم */}
      <div className="bg-white p-4 sm:p-6 rounded-[28px] border-2 border-[#dfc282] space-y-3 relative overflow-hidden shadow-[0_4px_16px_rgba(180,130,40,0.1)]">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 btn-3d-gold text-[#2c1b04] px-3 py-1 rounded-lg text-xs font-black mb-1.5 shadow-2xs">
              <RefreshCw className="w-3.5 h-3.5 stroke-[2.5] text-amber-900 animate-spin" style={{ animationDuration: '6s' }} />
              <span>مرکز اختصاصی تهاتر و معاوضه</span>
            </div>
            <h1 className="text-lg sm:text-2xl font-black text-slate-950">
              سامانه تهاتر تخصصی ملک، متریال و خودرو
            </h1>
            <p className="text-xs sm:text-sm text-slate-700 font-bold mt-1 max-w-2xl leading-relaxed">
              تفکیک کامل فایل‌های معاوضه مستقیم «ملک با ملک»، «ملک با متریال ساختمانی» و «ملک با خودرو و ماشین‌آلات».
            </p>
          </div>

          <button
            onClick={onOpenBarterOfferModal}
            className="h-10 px-4 btn-3d-gold text-[#2c1b04] text-xs sm:text-sm font-black rounded-xl shadow-2xs transition-all active:scale-95 shrink-0 cursor-pointer flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-4 h-4 stroke-[2.5]" />
            <span>ثبت آگهی جدید در تهاتر</span>
          </button>
        </div>
      </div>

      {/* محاسبه‌گر هوشمند مابه‌التفاوت */}
      <div className="bg-white p-4 sm:p-5 rounded-[24px] border-2 border-[#dfc282] space-y-3 shadow-2xs">
        <h2 className="text-sm sm:text-base font-black text-slate-950 flex items-center gap-2 border-b border-[#eee7db] pb-2.5">
          <Calculator className="w-4.5 h-4.5 text-amber-700" />
          <span>محاسبه‌گر ارزش و تسویه مابه‌التفاوت تهاتر</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-950 font-black text-xs mb-1">
              ارزش دارایی اول (طرف اول - تومان):
            </label>
            <input
              type="number"
              step={1000000000}
              value={sourceVal}
              onChange={(e) => setSourceVal(Number(e.target.value))}
              className="w-full bg-white border-2 border-[#dfc282] focus:border-[#caa758] rounded-xl px-3 py-2 font-mono text-xs font-black text-slate-950 shadow-2xs focus:outline-none"
            />
            <span className="text-xs text-amber-900 mt-1 block font-black">
              {formatTomanShort(sourceVal)} تومان
            </span>
          </div>

          <div>
            <label className="block text-slate-950 font-black text-xs mb-1">
              ارزش دارایی دوم (طرف دوم - تومان):
            </label>
            <input
              type="number"
              step={1000000000}
              value={targetVal}
              onChange={(e) => setTargetVal(Number(e.target.value))}
              className="w-full bg-white border-2 border-[#dfc282] focus:border-[#caa758] rounded-xl px-3 py-2 font-mono text-xs font-black text-slate-950 shadow-2xs focus:outline-none"
            />
            <span className="text-xs text-amber-900 mt-1 block font-black">
              {formatTomanShort(targetVal)} تومان
            </span>
          </div>
        </div>

        <div className="p-3 bg-amber-50/90 border border-[#caa758] rounded-xl flex items-center justify-between flex-wrap gap-2 text-xs">
          <div>
            <span className="text-slate-600 block font-bold text-[11px]">مابه‌التفاوت نقدی تسویه:</span>
            <span className="font-black text-base text-amber-950 font-mono">
              {formatTomanShort(diffVal)} تومان
            </span>
          </div>
          <div className="text-left">
            <span className="text-slate-600 block font-bold text-[11px]">پرداخت‌کننده مابه‌التفاوت:</span>
            <span className="font-black text-xs text-slate-950">{payer}</span>
          </div>
        </div>
      </div>

      {/* تفکیک دقیق فایل‌ها به ۴ شاخه مورد نظر کاربر در صوت */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        <button
          onClick={() => setActiveType('all')}
          className={`h-9 px-4 rounded-xl text-xs sm:text-sm font-black shrink-0 transition-all cursor-pointer flex items-center justify-center active:scale-95 ${
            activeType === 'all'
              ? 'btn-3d-gold text-[#2c1b04] shadow-2xs'
              : 'bg-white text-slate-800 hover:bg-amber-50/60 border-2 border-[#dfc282] shadow-2xs'
          }`}
        >
          همه تهاترها ({toPersianDigits(mockBarterOffers.length)})
        </button>

        <button
          onClick={() => setActiveType('property_to_property')}
          className={`h-9 px-3.5 rounded-xl text-xs sm:text-sm font-black flex items-center gap-1.5 shrink-0 transition-all cursor-pointer active:scale-95 ${
            activeType === 'property_to_property'
              ? 'btn-3d-gold text-[#2c1b04] shadow-2xs'
              : 'bg-white text-slate-800 hover:bg-amber-50/60 border-2 border-[#dfc282] shadow-2xs'
          }`}
        >
          <Building2 className="w-3.5 h-3.5 text-amber-800" />
          <span>تهاتر با ملک</span>
        </button>

        <button
          onClick={() => setActiveType('property_to_materials')}
          className={`h-9 px-3.5 rounded-xl text-xs sm:text-sm font-black flex items-center gap-1.5 shrink-0 transition-all cursor-pointer active:scale-95 ${
            activeType === 'property_to_materials'
              ? 'btn-3d-gold text-[#2c1b04] shadow-2xs'
              : 'bg-white text-slate-800 hover:bg-amber-50/60 border-2 border-[#dfc282] shadow-2xs'
          }`}
        >
          <Package className="w-3.5 h-3.5 text-amber-800" />
          <span>تهاتر با متریال</span>
        </button>

        <button
          onClick={() => setActiveType('property_to_vehicle')}
          className={`h-9 px-3.5 rounded-xl text-xs sm:text-sm font-black flex items-center gap-1.5 shrink-0 transition-all cursor-pointer active:scale-95 ${
            activeType === 'property_to_vehicle'
              ? 'btn-3d-gold text-[#2c1b04] shadow-2xs'
              : 'bg-white text-slate-800 hover:bg-amber-50/60 border-2 border-[#dfc282] shadow-2xs'
          }`}
        >
          <Car className="w-3.5 h-3.5 text-amber-800" />
          <span>تهاتر با خودرو و ماشین‌آلات</span>
        </button>
      </div>

      {/* فهرست فایل‌های تهاتر */}
      <div className="space-y-3.5">
        {filteredOffers.map((offer) => (
          <div
            key={offer.id}
            onClick={() => setSelectedOffer(offer)}
            className="bg-white p-4 sm:p-5 rounded-[24px] border-2 border-[#dfc282] shadow-2xs space-y-3 hover:shadow-md transition-all cursor-pointer"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#eee7db] pb-2.5">
              <div>
                <span className="text-[11px] bg-amber-100/80 text-amber-950 font-black px-2.5 py-0.5 rounded-lg mb-1 inline-block border border-amber-300">
                  {offer.type === 'property_to_materials' && 'تهاتر با متریال ساختمانی'}
                  {offer.type === 'property_to_property' && 'تهاتر با ملک مسکونی / تجاری'}
                  {offer.type === 'property_to_vehicle' && 'تهاتر با خودرو و ماشین‌آلات'}
                  {offer.type === 'custom_trade' && 'تهاتر ترکیبی'}
                </span>
                <h3 className="font-black text-sm sm:text-base text-slate-950">{offer.title}</h3>
              </div>

              <span className="text-xs font-black text-emerald-900 bg-emerald-50 border border-emerald-300 px-2.5 py-1 rounded-xl w-fit">
                تطبیق هوشمند: %{toPersianDigits(offer.matchScorePercent)}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div className="p-2.5 bg-[#faf8f4] rounded-xl space-y-1 border border-[#e8dfd2]">
                <span className="text-[10.5px] text-slate-500 block font-bold">مبدأ معاوضه (دارایی شما):</span>
                <p className="font-black text-xs text-slate-950">{offer.sourceTitle}</p>
                <p className="text-amber-900 font-black font-mono text-xs">
                  ارزش: {formatTomanShort(offer.sourceValue)} تومان
                </p>
              </div>

              <div className="p-2.5 bg-[#faf8f4] rounded-xl space-y-1 border border-[#e8dfd2]">
                <span className="text-[10.5px] text-slate-500 block font-bold">مقصد معاوضه (درخواست):</span>
                <p className="font-black text-xs text-slate-950">{offer.targetRequirement}</p>
                <p className="text-emerald-800 font-black font-mono text-xs">
                  برآورد: {formatTomanShort(offer.targetEstimatedValue)} تومان
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 flex-wrap gap-2 text-xs">
              <span className="text-slate-600 font-bold">ثبت‌کننده: {offer.ownerName}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedOffer(offer);
                }}
                className="h-8 px-3 btn-3d-gold text-[#2c1b04] font-black text-xs rounded-xl flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-2xs"
              >
                <span>مشاهده پرونده کامل</span>
                <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* مدال تکی و خلوت نمایش فایل تهاتر (بدون هیچ حاشیه یا شلوغی اضافه مطابق صوت ۲ و ۳) */}
      {selectedOffer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div 
            className="bg-white rounded-[28px] border-2 border-[#dfc282] max-w-lg w-full p-4 sm:p-6 space-y-4 shadow-2xl relative"
            dir="rtl"
          >
            {/* بستن */}
            <div className="flex items-center justify-between border-b border-[#eee7db] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl btn-3d-gold flex items-center justify-center">
                  <RefreshCw className="w-4 h-4 text-amber-950" />
                </div>
                <div>
                  <h3 className="font-black text-sm sm:text-base text-slate-950">پرونده رسمی تهاتر</h3>
                  <span className="text-[11px] text-slate-500 font-bold">کد: PYS-{selectedOffer.id.toUpperCase()}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedOffer(null)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer transition-all"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* محتوای متمرکز بدون حاشیه */}
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-amber-50/80 border border-amber-300 rounded-2xl">
                <span className="text-[11px] text-amber-800 font-black block mb-1">عنوان کامل آگهی:</span>
                <p className="font-black text-sm text-slate-950 leading-relaxed">{selectedOffer.title}</p>
              </div>

              <div className="space-y-2">
                <div className="p-3 bg-[#faf8f4] border border-[#e8dfd2] rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-500 block font-bold">دارایی مبدأ (پیشنهادی):</span>
                    <span className="font-black text-xs text-slate-900">{selectedOffer.sourceTitle}</span>
                  </div>
                  <span className="font-black font-mono text-amber-900 text-xs">
                    {formatTomanShort(selectedOffer.sourceValue)} ت
                  </span>
                </div>

                <div className="p-3 bg-[#faf8f4] border border-[#e8dfd2] rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-500 block font-bold">دارایی مقصد (درخواستی):</span>
                    <span className="font-black text-xs text-slate-900">{selectedOffer.targetRequirement}</span>
                  </div>
                  <span className="font-black font-mono text-emerald-800 text-xs">
                    {formatTomanShort(selectedOffer.targetEstimatedValue)} ت
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11.5px] pt-1">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block">ثبت‌کننده:</span>
                  <span className="font-black text-slate-900">{selectedOffer.ownerName}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block">شهر / منطقه مبدأ:</span>
                  <span className="font-black text-slate-900">{selectedOffer.sourceCity}</span>
                </div>
              </div>
            </div>

            {/* دکمه ورود مستقیم به اتاق قرارداد */}
            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={() => {
                  if (onEnterDealRoom) {
                    onEnterDealRoom(selectedOffer.id);
                  }
                  setSelectedOffer(null);
                }}
                className="flex-1 py-2.5 btn-3d-gold text-[#2c1b04] font-black text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-98"
              >
                <span>ورود به اتاق معامله و عقد قرارداد امن</span>
                <ArrowLeft className="w-4 h-4 stroke-[2.8]" />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
