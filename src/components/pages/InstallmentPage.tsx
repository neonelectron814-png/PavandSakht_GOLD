import React, { useState } from 'react';
import { 
  CreditCard, 
  Calculator, 
  Building2, 
  Package, 
  Truck, 
  Home, 
  Lock, 
  ShieldCheck
} from 'lucide-react';
import { formatToman, formatTomanShort, toPersianDigits } from '../../utils/formatters';

interface InstallmentPageProps {
  onEnterDealRoom: (code: string) => void;
  onOpenConsultation?: () => void;
}

interface InstallmentOffer {
  id: string;
  category: 'property' | 'material' | 'machinery' | 'home_appliances';
  title: string;
  code: string;
  totalPrice: number;
  cashPercent: number;
  months: number;
  monthlyInstallment: number;
  guaranteeType: string;
  supplierName: string;
  city: string;
  image: string;
  badge: string;
  features: string[];
}

const mockInstallmentOffers: InstallmentOffer[] = [
  {
    id: 'inst-1',
    category: 'property',
    title: 'آپارتمان ۱۴۰ متری نوساز کلید نخورده',
    code: 'PYS-INST-101',
    totalPrice: 12000000000,
    cashPercent: 35,
    months: 24,
    monthlyInstallment: 360000000,
    guaranteeType: 'رهن سند رسمی تا تسویه کامل',
    supplierName: 'شرکت ساختمانی سازه‌گستر پردیس',
    city: 'تهران - منطقه ۲',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=700',
    badge: 'طرح اقساطی انبوه‌ساز',
    features: ['۳۵٪ پیش‌پرداخت نقد', 'اقساط ۲۴ ماهه بدون ضامن', 'تحویل فوری کلید'],
  },
  {
    id: 'inst-2',
    category: 'material',
    title: 'تأمین سبد میلگرد و تیرآهن اصفهان (۴۰ تن)',
    code: 'PYS-INST-102',
    totalPrice: 1800000000,
    cashPercent: 30,
    months: 12,
    monthlyInstallment: 115000000,
    guaranteeType: 'چک صیادی بنفش + سفته الکترونیک',
    supplierName: 'آهن و فولاد آریا پایتخت',
    city: 'اصفهان / تحویل سراسری',
    image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=700',
    badge: 'متریال پای‌کار',
    features: ['۳۰٪ پیش‌پرداخت', '۱۲ فقره چک صیادی ماهانه', 'ارسال مستقیم از کارخانه'],
  },
  {
    id: 'inst-3',
    category: 'material',
    title: 'کاشی و سرامیک پرسلان کالیبره ۱۲۰۰ متر مربع',
    code: 'PYS-INST-103',
    totalPrice: 720000000,
    cashPercent: 25,
    months: 10,
    monthlyInstallment: 58000000,
    guaranteeType: 'چک صیادی معتبر بانکی',
    supplierName: 'صنایع سرامیک صبا یزد',
    city: 'یزد / ارسال سراسری',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=700',
    badge: 'خرید مستقیم کارخانه',
    features: ['۲۵٪ نقد', 'اقساط ۱۰ ماهه با کارمزد بانکی', 'تضمین کیفیت گرید A'],
  },
  {
    id: 'inst-4',
    category: 'machinery',
    title: 'بیل مکانیکی کوماتسو PC220 خط ۷ صفر',
    code: 'PYS-INST-104',
    totalPrice: 8500000000,
    cashPercent: 40,
    months: 36,
    monthlyInstallment: 175000000,
    guaranteeType: 'اسناد مالکیت ماشین‌آلات + چک تضمین',
    supplierName: 'ماشین‌آلات سنگین هپکو پارت',
    city: 'اراک / تحویل در محل کارگاه',
    image: 'https://images.unsplash.com/photo-1579829366248-204fe8413f31?auto=format&fit=crop&q=80&w=700',
    badge: 'ماشین‌آلات عمرانی',
    features: ['۴۰٪ نقد اولیه', 'اقساط ۳۶ ماهه بدون واسطه', 'گارانتی ۱ ساله موتور'],
  },
  {
    id: 'inst-5',
    category: 'home_appliances',
    title: 'پکیج کامل لوازم خانگی و تاسیسات توکار مسکونی',
    code: 'PYS-INST-105',
    totalPrice: 420000000,
    cashPercent: 20,
    months: 18,
    monthlyInstallment: 24500000,
    guaranteeType: 'سفته الکترونیک بدون ضامن معتبر',
    supplierName: 'تاسیسات و لوازم خانگی اروند',
    city: 'تهران / ارسال و نصب رایگان',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=700',
    badge: 'تجهیز کامل واحد',
    features: ['۲۰٪ پیش‌پرداخت ویژه انبوه‌ساز', 'اقساط ۱۸ ماهه', 'نصب رایگان'],
  },
];

export const InstallmentPage: React.FC<InstallmentPageProps> = ({ onEnterDealRoom }) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'property' | 'material' | 'machinery' | 'home_appliances'>('all');

  const [calcTotal, setCalcTotal] = useState<number>(1000000000);
  const [calcCashPercent, setCalcCashPercent] = useState<number>(30);
  const [calcMonths, setCalcMonths] = useState<number>(12);

  const calcDownPayment = Math.round(calcTotal * (calcCashPercent / 100));
  const calcRemaining = calcTotal - calcDownPayment;
  const calcMonthly = Math.round((calcRemaining * (1 + 0.02 * calcMonths)) / calcMonths);

  const filteredOffers = mockInstallmentOffers.filter((o) => {
    if (activeCategory === 'all') return true;
    return o.category === activeCategory;
  });

  return (
    <div className="space-y-6 pb-20 text-[#111827]" dir="rtl">
      {/* Header Banner Card (Full Framed 3D Gold Box) */}
      <div className="bg-white p-5 sm:p-6 rounded-[28px] border-2 border-[#dfc282] space-y-3 relative overflow-hidden shadow-[0_4px_16px_rgba(180,130,40,0.1)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 btn-3d-gold text-[#2c1b04] px-3.5 py-1 rounded-xl text-xs font-black mb-2 shadow-2xs">
              <CreditCard className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>فروش اقساطی تخصصی پیوندساخت</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-950">
              سامانه جامع خرید و فروش اقساطی ملک، متریال و ماشین‌آلات
            </h1>
            <p className="text-[15px] text-slate-700 font-bold mt-1 max-w-2xl leading-relaxed">
              تسهیل خرید با فرمول‌های منعطف (۳۰٪ نقدی و الباقی طی اقساط ۱۲ تا ۳۶ ماهه)، همراه با اعتبارسنجی خریدار و انتقال مستقیم به اتاق معامله امن جهت ثبت قرارداد رسمی.
            </p>
          </div>

          <div className="bg-[#fffcf7] p-3.5 rounded-2xl border-2 border-[#dfc282] text-xs space-y-1 shrink-0 text-center shadow-2xs">
            <span className="text-xs text-slate-600 font-bold block">تضمین سلامت قرارداد:</span>
            <span className="font-black text-amber-950 text-[15px] flex items-center justify-center gap-1">
              <ShieldCheck className="w-4.5 h-4.5 text-emerald-700" />
              چک صیادی و سفته الکترونیک
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Installment Calculator Card */}
      <div className="bg-white p-5 sm:p-6 rounded-[28px] border-2 border-[#dfc282] shadow-[0_4px_16px_rgba(180,130,40,0.1)] space-y-4">
        <div className="flex items-center justify-between border-b border-[#eee7db] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl btn-3d-gold flex items-center justify-center text-[#2c1b04] shadow-2xs">
              <Calculator className="w-4.5 h-4.5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-950">محاسبه‌گر هوشمند اقساط و پیش‌پرداخت</h3>
              <p className="text-xs text-slate-600 font-bold">فرمول استاندارد بازار با تعیین درصد نقدی و تعداد اقساط</p>
            </div>
          </div>
          <span className="btn-3d-gold text-[#2c1b04] text-xs font-black px-3 py-1 rounded-xl shadow-2xs">
            شبیه‌ساز مالی
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Price Input */}
          <div className="space-y-1.5">
            <label className="text-[15px] font-black text-slate-950 block">مبلغ کل کالا یا ملک (تومان):</label>
            <input
              type="number"
              step="50000000"
              value={calcTotal}
              onChange={(e) => setCalcTotal(Number(e.target.value) || 0)}
              className="w-full bg-white border-2 border-[#dfc282] focus:border-[#caa758] rounded-xl px-3.5 py-2 font-mono text-[15px] font-black text-slate-950 shadow-2xs focus:outline-none transition-all"
            />
            <span className="text-[13px] text-amber-900 font-black block">{formatToman(calcTotal)} تومان</span>
          </div>

          {/* Cash Percent Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[15px] font-black text-slate-950">
              <span>درصد پیش‌پرداخت نقد:</span>
              <span className="text-amber-950 font-black">{toPersianDigits(calcCashPercent)}٪</span>
            </div>
            <input
              type="range"
              min="20"
              max="60"
              step="5"
              value={calcCashPercent}
              onChange={(e) => setCalcCashPercent(Number(e.target.value))}
              className="w-full accent-amber-600 cursor-pointer"
            />
            <span className="text-xs text-slate-700 font-bold block">
              نقد اولیه: {formatTomanShort(calcDownPayment)} تومان
            </span>
          </div>

          {/* Months Count */}
          <div className="space-y-1.5">
            <label className="text-[15px] font-black text-slate-950 block">مدت اقساط (تعداد ماه‌ها):</label>
            <select
              value={calcMonths}
              onChange={(e) => setCalcMonths(Number(e.target.value))}
              className="w-full bg-white border-2 border-[#dfc282] focus:border-[#caa758] rounded-xl px-3.5 py-2 text-[15px] font-black text-slate-950 shadow-2xs focus:outline-none cursor-pointer"
            >
              <option value="6">۶ ماهه</option>
              <option value="12">۱۲ ماهه (۱ سال)</option>
              <option value="18">۱۸ ماهه (۱.۵ سال)</option>
              <option value="24">۲۴ ماهه (۲ سال)</option>
              <option value="36">۳۶ ماهه (۳ سال)</option>
            </select>
            <span className="text-xs text-emerald-900 font-black block">
              مبلغ هر قسط: {formatTomanShort(calcMonthly)} / ماه
            </span>
          </div>
        </div>

        {/* Summary Result Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3.5 bg-[#faf8f4] rounded-2xl border-2 border-[#e6dfd3]">
            <span className="text-xs text-slate-600 font-bold block">پیش‌پرداخت نقدی اولیه:</span>
            <span className="text-base font-black text-amber-950 font-mono">{formatTomanShort(calcDownPayment)} تومان</span>
          </div>
          <div className="p-3.5 bg-[#faf8f4] rounded-2xl border-2 border-[#e6dfd3]">
            <span className="text-xs text-slate-600 font-bold block">اقساط ماهانه ({toPersianDigits(calcMonths)} قسط):</span>
            <span className="text-base font-black text-emerald-900 font-mono">{formatTomanShort(calcMonthly)} تومان</span>
          </div>
          <div className="p-3.5 bg-[#faf8f4] rounded-2xl border-2 border-[#e6dfd3]">
            <span className="text-xs text-slate-600 font-bold block">فرآیند عقد قرارداد:</span>
            <span className="text-[15px] font-black text-slate-950 flex items-center gap-1.5 mt-0.5">
              <Lock className="w-4 h-4 text-amber-800" />
              انتقال مستقیم به اتاق معامله
            </span>
          </div>
        </div>
      </div>

      {/* Categories Tabs (Compact 3D Gold Buttons, 15px Font) */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        <button
          onClick={() => setActiveCategory('all')}
          className={`h-9 px-4 rounded-xl text-[15px] font-black shrink-0 transition-all cursor-pointer flex items-center justify-center active:scale-95 ${
            activeCategory === 'all'
              ? 'btn-3d-gold text-[#2c1b04] shadow-2xs'
              : 'bg-white hover:bg-amber-50/60 text-slate-800 border-2 border-[#dfc282]'
          }`}
        >
          همه کالاهای اقساطی
        </button>

        <button
          onClick={() => setActiveCategory('property')}
          className={`h-9 px-4 rounded-xl text-[15px] font-black shrink-0 transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 ${
            activeCategory === 'property'
              ? 'btn-3d-gold text-[#2c1b04] shadow-2xs'
              : 'bg-white hover:bg-amber-50/60 text-slate-800 border-2 border-[#dfc282]'
          }`}
        >
          <Building2 className="w-4 h-4 text-amber-800" />
          <span>املاک اقساطی</span>
        </button>

        <button
          onClick={() => setActiveCategory('material')}
          className={`h-9 px-4 rounded-xl text-[15px] font-black shrink-0 transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 ${
            activeCategory === 'material'
              ? 'btn-3d-gold text-[#2c1b04] shadow-2xs'
              : 'bg-white hover:bg-amber-50/60 text-slate-800 border-2 border-[#dfc282]'
          }`}
        >
          <Package className="w-4 h-4 text-amber-800" />
          <span>مصالح و متریال اقساطی</span>
        </button>

        <button
          onClick={() => setActiveCategory('machinery')}
          className={`h-9 px-4 rounded-xl text-[15px] font-black shrink-0 transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 ${
            activeCategory === 'machinery'
              ? 'btn-3d-gold text-[#2c1b04] shadow-2xs'
              : 'bg-white hover:bg-amber-50/60 text-slate-800 border-2 border-[#dfc282]'
          }`}
        >
          <Truck className="w-4 h-4 text-amber-800" />
          <span>ماشین‌آلات و تجهیزات</span>
        </button>

        <button
          onClick={() => setActiveCategory('home_appliances')}
          className={`h-9 px-4 rounded-xl text-[15px] font-black shrink-0 transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 ${
            activeCategory === 'home_appliances'
              ? 'btn-3d-gold text-[#2c1b04] shadow-2xs'
              : 'bg-white hover:bg-amber-50/60 text-slate-800 border-2 border-[#dfc282]'
          }`}
        >
          <Home className="w-4 h-4 text-amber-800" />
          <span>لوازم خانگی و فرش</span>
        </button>
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredOffers.map((offer) => (
          <div
            key={offer.id}
            className="bg-white rounded-[28px] p-5 border-2 border-[#dfc282] shadow-[0_4px_16px_rgba(180,130,40,0.1)] space-y-4 flex flex-col justify-between hover:shadow-xl transition-all"
          >
            <div className="space-y-3">
              {/* Image & Badge */}
              <div className="relative h-44 rounded-2xl overflow-hidden">
                <img
                  src={offer.image}
                  alt={offer.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <span className="absolute top-2.5 right-2.5 bg-slate-900/90 text-white text-xs font-black px-2.5 py-1 rounded-xl backdrop-blur-md">
                  {offer.badge}
                </span>
                <span className="absolute bottom-2.5 left-2.5 btn-3d-gold text-[#2c1b04] font-black text-xs px-2.5 py-1 rounded-xl shadow-md">
                  {offer.months} قسط ماهانه
                </span>
              </div>

              <div>
                <h3 className="font-black text-base text-slate-950">{offer.title}</h3>
                <p className="text-xs text-slate-600 font-bold mt-0.5">{offer.supplierName} • {offer.city}</p>
              </div>

              {/* Price Details */}
              <div className="p-3.5 bg-[#faf8f4] rounded-2xl border-2 border-[#e6dfd3] space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 font-bold">قیمت تمام‌شده:</span>
                  <span className="font-black text-[15px] text-slate-950 font-mono">{formatTomanShort(offer.totalPrice)} تومان</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 font-bold">پیش‌پرداخت نقد ({toPersianDigits(offer.cashPercent)}٪):</span>
                  <span className="font-black text-[15px] text-amber-950 font-mono">
                    {formatTomanShort(Math.round(offer.totalPrice * (offer.cashPercent / 100)))} تومان
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 font-bold">قسط ماهانه:</span>
                  <span className="font-black text-[15px] text-emerald-900 font-mono">{formatTomanShort(offer.monthlyInstallment)} / ماه</span>
                </div>
                <div className="flex justify-between items-center text-xs border-t border-[#ede6d8] pt-1.5">
                  <span className="text-slate-600 font-bold">نوع ضمانت:</span>
                  <span className="font-black text-slate-900">{offer.guaranteeType}</span>
                </div>
              </div>

              {/* Bullet Features */}
              <div className="flex flex-wrap gap-1.5">
                {offer.features.map((f, i) => (
                  <span key={i} className="text-xs bg-amber-50 text-amber-950 font-black px-2.5 py-1 rounded-lg border border-amber-200">
                    ✓ {f}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Button (Compact, 15px Font Size) */}
            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={() => onEnterDealRoom(offer.code)}
                className="w-full h-10 btn-3d-gold text-[#2c1b04] text-[15px] font-black rounded-xl flex items-center justify-center gap-2 shadow-2xs active:scale-95 transition-transform cursor-pointer"
              >
                <Lock className="w-4 h-4 stroke-[2.5]" />
                <span>انتقال به اتاق معامله امن جهت عقد قرارداد</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
