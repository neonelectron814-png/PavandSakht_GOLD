import React, { useState } from 'react';
import { 
  CreditCard, 
  Calculator, 
  CheckCircle2, 
  Building2, 
  Package, 
  Truck, 
  Home, 
  Lock, 
  ArrowLeft, 
  Sparkles, 
  Percent, 
  Calendar, 
  ShieldCheck, 
  FileCheck2,
  Clock
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
  cashPercent: number; // e.g. 30%
  months: number; // e.g. 12, 24, 36
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
    guaranteeType: 'سند مالکیت دستگاه در رهن شرکتی',
    supplierName: 'پیوند ماشین‌آلات راه و معدن',
    city: 'تهران - چهاردانگه',
    image: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&q=80&w=700',
    badge: 'ماشین‌آلات سنگین',
    features: ['۴۰٪ پیش‌پرداخت نقدی', 'اقساط ۳۶ ماهه ویژه پیمانکاران', 'بیمه بدنه کامل شرکتی'],
  },
  {
    id: 'inst-5',
    category: 'home_appliances',
    title: 'پکیج کامل لوازم خانگی و فرش نو برای ساکنین',
    code: 'PYS-INST-105',
    totalPrice: 380000000,
    cashPercent: 20,
    months: 18,
    monthlyInstallment: 19500000,
    guaranteeType: 'چک صیادی یا کسر از حقوق',
    supplierName: 'هایپرمارکت لوازم منزل پیوند',
    city: 'سراسری',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=700',
    badge: 'تجهیز خانه جدید',
    features: ['۲۰٪ پیش‌پرداخت', 'اقساط ۱۸ ماهه بدون ضامن', 'شامل یخچال، ساید، فرش و تلویزیون'],
  },
];

export const InstallmentPage: React.FC<InstallmentPageProps> = ({ onEnterDealRoom }) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'property' | 'material' | 'machinery' | 'home_appliances'>('all');
  
  // Interactive Calculator State
  const [calcTotal, setCalcTotal] = useState<number>(1000000000);
  const [calcCashPercent, setCalcCashPercent] = useState<number>(30);
  const [calcMonths, setCalcMonths] = useState<number>(12);

  const calcDownPayment = Math.round(calcTotal * (calcCashPercent / 100));
  const calcRemaining = calcTotal - calcDownPayment;
  // Standard monthly formula (remaining + 2% per month / months)
  const calcMonthly = Math.round((calcRemaining * (1 + 0.02 * calcMonths)) / calcMonths);

  const filteredOffers = mockInstallmentOffers.filter((o) => {
    if (activeCategory === 'all') return true;
    return o.category === activeCategory;
  });

  return (
    <div className="space-y-6 pb-20 text-[#111827]" dir="rtl">
      
      {/* Header Banner */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#ded5c5] space-y-3 relative overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-950 border border-amber-300 px-3.5 py-1 rounded-full text-xs font-black mb-2 shadow-xs">
              <CreditCard className="w-3.5 h-3.5 text-amber-700" />
              <span>فروش اقساطی تخصصی پیوندساخت</span>
            </div>
            <h1 className="text-lg sm:text-xl font-black text-slate-950">
              سامانه جامع خرید و فروش اقساطی ملک، متریال و ماشین‌آلات
            </h1>
            <p className="text-xs text-slate-700 font-semibold mt-1 max-w-2xl leading-relaxed">
              تسهیل خرید با فرمول‌های منعطف (۳۰٪ نقدی و الباقی طی اقساط ۱۲ تا ۳۶ ماهه)، همراه با اعتبارسنجی خریدار و انتقال مستقیم به اتاق معامله امن جهت ثبت قرارداد رسمی.
            </p>
          </div>

          <div className="bg-[#fffcf7] p-3.5 rounded-2xl border border-amber-200 text-xs space-y-1 shrink-0 text-center">
            <span className="text-[10px] text-slate-600 font-bold block">تضمین سلامت قرارداد:</span>
            <span className="font-black text-amber-900 text-xs flex items-center justify-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              چک صیادی و سفته الکترونیک
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Installment Calculator */}
      <div className="bg-[#fbf9f4] p-5 sm:p-6 rounded-3xl border-2 border-amber-200/90 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[#ebd8bb] pb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-900">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-black text-slate-950">محاسبه‌گر هوشمند اقساط و پیش‌پرداخت</h3>
              <p className="text-[10.5px] text-slate-600 font-medium">فرمول استاندارد بازار با تعیین درصد نقدی و تعداد اقساط</p>
            </div>
          </div>
          <span className="text-[10.5px] bg-amber-100 text-amber-950 font-black px-3 py-1 rounded-xl border border-amber-300">
            شبیه‌ساز مالی
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Price Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 block">مبلغ کل کالا یا ملک (تومان):</label>
            <input
              type="number"
              step="50000000"
              value={calcTotal}
              onChange={(e) => setCalcTotal(Number(e.target.value) || 0)}
              className="w-full bg-white border border-[#ded5c5] rounded-xl px-3.5 py-2.5 text-xs font-black text-slate-950 focus:outline-none focus:border-amber-600"
            />
            <span className="text-[10px] text-amber-900 font-bold block">{formatToman(calcTotal)}</span>
          </div>

          {/* Cash Percent Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold text-slate-800">
              <span>درصد پیش‌پرداخت نقد:</span>
              <span className="text-amber-900 font-black">{toPersianDigits(calcCashPercent)}٪</span>
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
            <span className="text-[10px] text-slate-600 font-semibold block">
              نقد اولیه: {formatTomanShort(calcDownPayment)}
            </span>
          </div>

          {/* Months Count */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 block">مدت اقساط (تعداد ماه‌ها):</label>
            <select
              value={calcMonths}
              onChange={(e) => setCalcMonths(Number(e.target.value))}
              className="w-full bg-white border border-[#ded5c5] rounded-xl px-3.5 py-2.5 text-xs font-black text-slate-950 focus:outline-none focus:border-amber-600 cursor-pointer"
            >
              <option value="6">۶ ماهه</option>
              <option value="12">۱۲ ماهه (۱ سال)</option>
              <option value="18">۱۸ ماهه (۱.۵ سال)</option>
              <option value="24">۲۴ ماهه (۲ سال)</option>
              <option value="36">۳۶ ماهه (۳ سال)</option>
            </select>
            <span className="text-[10px] text-emerald-900 font-bold block">
              مبلغ هر قسط: {formatTomanShort(calcMonthly)} / ماه
            </span>
          </div>
        </div>

        {/* Summary Result Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3 bg-white rounded-2xl border border-[#ded5c5]">
            <span className="text-[10px] text-slate-500 font-bold block">پیش‌پرداخت نقدی اولیه:</span>
            <span className="text-sm font-black text-amber-950">{formatTomanShort(calcDownPayment)}</span>
          </div>
          <div className="p-3 bg-white rounded-2xl border border-[#ded5c5]">
            <span className="text-[10px] text-slate-500 font-bold block">اقساط ماهانه ({toPersianDigits(calcMonths)} قسط):</span>
            <span className="text-sm font-black text-emerald-900">{formatTomanShort(calcMonthly)}</span>
          </div>
          <div className="p-3 bg-white rounded-2xl border border-[#ded5c5]">
            <span className="text-[10px] text-slate-500 font-bold block">فرآیند عقد قرارداد:</span>
            <span className="text-xs font-black text-slate-900 flex items-center gap-1 mt-0.5">
              <Lock className="w-3.5 h-3.5 text-amber-700" />
              انتقال مستقیم به اتاق معامله
            </span>
          </div>
        </div>
      </div>

      {/* Categories Tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black shrink-0 transition-all cursor-pointer ${
            activeCategory === 'all'
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-sm'
              : 'bg-white hover:bg-slate-50 text-slate-800 border border-[#ded5c5]'
          }`}
        >
          همه کالاهای اقساطی
        </button>

        <button
          onClick={() => setActiveCategory('property')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
            activeCategory === 'property'
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-sm'
              : 'bg-white hover:bg-slate-50 text-slate-800 border border-[#ded5c5]'
          }`}
        >
          <Building2 className="w-3.5 h-3.5 text-amber-600" />
          <span>املاک اقساطی</span>
        </button>

        <button
          onClick={() => setActiveCategory('material')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
            activeCategory === 'material'
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-sm'
              : 'bg-white hover:bg-slate-50 text-slate-800 border border-[#ded5c5]'
          }`}
        >
          <Package className="w-3.5 h-3.5 text-amber-600" />
          <span>مصالح و متریال اقساطی</span>
        </button>

        <button
          onClick={() => setActiveCategory('machinery')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
            activeCategory === 'machinery'
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-sm'
              : 'bg-white hover:bg-slate-50 text-slate-800 border border-[#ded5c5]'
          }`}
        >
          <Truck className="w-3.5 h-3.5 text-amber-600" />
          <span>ماشین‌آلات و تجهیزات</span>
        </button>

        <button
          onClick={() => setActiveCategory('home_appliances')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
            activeCategory === 'home_appliances'
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-sm'
              : 'bg-white hover:bg-slate-50 text-slate-800 border border-[#ded5c5]'
          }`}
        >
          <Home className="w-3.5 h-3.5 text-amber-600" />
          <span>لوازم خانگی و فرش</span>
        </button>
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredOffers.map((offer) => (
          <div
            key={offer.id}
            className="bg-white rounded-3xl p-5 border border-[#ded5c5] shadow-[0_2px_12px_rgba(0,0,0,0.04)] space-y-4 flex flex-col justify-between"
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
                <span className="absolute top-2.5 right-2.5 bg-slate-900/90 text-white text-[10px] font-black px-2.5 py-1 rounded-xl backdrop-blur-md">
                  {offer.badge}
                </span>
                <span className="absolute bottom-2.5 left-2.5 bg-amber-500 text-slate-950 font-black text-[10px] px-2.5 py-1 rounded-xl shadow-md">
                  {offer.months} قسط ماهانه
                </span>
              </div>

              <div>
                <h3 className="font-black text-sm text-slate-950">{offer.title}</h3>
                <p className="text-[11px] text-slate-600 font-semibold mt-0.5">{offer.supplierName} • {offer.city}</p>
              </div>

              {/* Price Details */}
              <div className="p-3 bg-[#fbf9f4] rounded-2xl border border-[#ded5c5] space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 font-bold">قیمت تمام‌شده:</span>
                  <span className="font-black text-slate-950">{formatTomanShort(offer.totalPrice)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 font-bold">پیش‌پرداخت نقد ({toPersianDigits(offer.cashPercent)}٪):</span>
                  <span className="font-black text-amber-900">
                    {formatTomanShort(Math.round(offer.totalPrice * (offer.cashPercent / 100)))}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 font-bold">قسط ماهانه:</span>
                  <span className="font-black text-emerald-900">{formatTomanShort(offer.monthlyInstallment)} / ماه</span>
                </div>
                <div className="flex justify-between items-center text-[10.5px] border-t border-[#ede6d8] pt-1.5">
                  <span className="text-slate-500 font-medium">نوع ضمانت:</span>
                  <span className="font-bold text-slate-800">{offer.guaranteeType}</span>
                </div>
              </div>

              {/* Bullet Features */}
              <div className="flex flex-wrap gap-1.5">
                {offer.features.map((f, i) => (
                  <span key={i} className="text-[10px] bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-lg">
                    ✓ {f}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={() => onEnterDealRoom(offer.code)}
                className="flex-1 bg-amber-600 hover:bg-amber-700 text-white text-xs font-black py-3 rounded-2xl flex items-center justify-center gap-1.5 shadow-md transition-colors cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>انتقال به اتاق معامله امن جهت عقد قرارداد</span>
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
