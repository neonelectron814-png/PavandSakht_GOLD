import React, { useState, useRef } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  MapPin, 
  Lock, 
  Percent, 
  RefreshCw, 
  Handshake, 
  SlidersHorizontal,
  Search,
  Filter,
  Sparkles,
  KeyRound,
  Home,
  ChevronLeft,
  ChevronRight,
  Calculator
} from 'lucide-react';
import { Property, DealType } from '../../types';
import { formatTomanShort, getVerificationBadgeColor, getVerificationBadgeText, toPersianDigits } from '../../utils/formatters';

interface MarketplacePageProps {
  properties: Property[];
  onSelectProperty: (property: Property) => void;
  onEnterDealRoom: (propertyCode: string) => void;
  searchQuery: string;
  onOpenFilterSheet: () => void;
}

export const MarketplacePage: React.FC<MarketplacePageProps> = ({
  properties,
  onSelectProperty,
  onEnterDealRoom,
  searchQuery,
  onOpenFilterSheet,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'rent' | 'sale' | 'rate_cutter' | 'barter' | 'partnership'>('all');
  const tabsScrollRef = useRef<HTMLDivElement>(null);

  const handleScrollTabs = (direction: 'left' | 'right') => {
    if (tabsScrollRef.current) {
      const amount = direction === 'left' ? -220 : 220;
      tabsScrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  const filteredProperties = properties.filter((p) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchCode = p.code.toLowerCase().includes(q);
      const matchCity = p.city.toLowerCase().includes(q);
      const matchDistrict = p.district.toLowerCase().includes(q);
      if (!matchTitle && !matchCode && !matchCity && !matchDistrict) return false;
    }

    if (activeTab === 'rent') return p.dealType === 'rent';
    if (activeTab === 'rate_cutter') return p.isRateCutter;
    if (activeTab === 'barter') return p.dealType === 'barter';
    if (activeTab === 'partnership') return p.dealType === 'partnership';
    if (activeTab === 'sale') return p.dealType === 'sale';

    return true;
  });

  return (
    <div className="space-y-6 pb-16" dir="rtl">
      
      {/* Header Banner */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#ded5c5] space-y-2 shadow-[0_2px_12px_rgba(0,0,0,0.04)] relative overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-black shadow-xs shrink-0">
            <Building2 className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-black text-slate-950">بازار فایل‌های اعتبارسنجی‌شده پیوند ساخت</h1>
            <p className="text-xs text-slate-700 font-semibold mt-0.5 leading-relaxed">
              فهرست املاک مسکونی، تجاری و رهن و اجاره سالم دارای استعلام ثبتی، کارشناسی قیمت و تضمین حقوقی معامله
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs Bar with Horizontal Scroll Navigation */}
      <div className="relative flex items-center group/tabs">
        {/* Right Scroll Arrow for Desktop (RTL) */}
        <button
          onClick={() => handleScrollTabs('right')}
          className="hidden md:flex absolute right-0 z-10 w-7 h-9 items-center justify-center bg-white text-slate-700 hover:text-amber-800 rounded-r-2xl border border-[#ded5c5] shadow-md opacity-0 group-hover/tabs:opacity-100 transition-opacity cursor-pointer"
          title="پیمایش به راست"
          aria-label="پیمایش راست"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        <div 
          ref={tabsScrollRef}
          className="w-full flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth touch-pan-x pb-1 px-0.5 cursor-grab active:cursor-grabbing"
        >
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black shrink-0 transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-slate-950 text-white shadow-md'
                : 'bg-white hover:bg-slate-50 text-slate-800 border border-[#ded5c5]'
            }`}
          >
            همه فایل‌ها ({toPersianDigits(properties.length)})
          </button>

          <button
            onClick={() => setActiveTab('rent')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black shrink-0 flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'rent'
                ? 'bg-emerald-700 text-white shadow-md'
                : 'bg-white hover:bg-emerald-50/50 text-emerald-950 border border-[#ded5c5]'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5 text-emerald-600" />
            <span>رهن و اجاره ({toPersianDigits(properties.filter(p => p.dealType === 'rent').length)})</span>
          </button>

          <button
            onClick={() => setActiveTab('sale')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black shrink-0 flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'sale'
                ? 'bg-amber-700 text-white shadow-md'
                : 'bg-white hover:bg-amber-50/50 text-amber-950 border border-[#ded5c5]'
            }`}
          >
            <Home className="w-3.5 h-3.5 text-amber-600" />
            <span>فروش قطعی ({toPersianDigits(properties.filter(p => p.dealType === 'sale').length)})</span>
          </button>

          <button
            onClick={() => setActiveTab('rate_cutter')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black shrink-0 flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'rate_cutter'
                ? 'bg-rose-700 text-white shadow-md'
                : 'bg-white hover:bg-rose-50/50 text-rose-950 border border-[#ded5c5]'
            }`}
          >
            <Percent className="w-3.5 h-3.5 text-rose-600" />
            <span>فروش فوری / نرخ‌شکن ({toPersianDigits(properties.filter(p => p.isRateCutter).length)})</span>
          </button>

          <button
            onClick={() => setActiveTab('barter')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black shrink-0 flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'barter'
                ? 'bg-blue-700 text-white shadow-md'
                : 'bg-white hover:bg-blue-50/50 text-blue-950 border border-[#ded5c5]'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
            <span>تهاتر ملک و مصالح ({toPersianDigits(properties.filter(p => p.dealType === 'barter').length)})</span>
          </button>

          <button
            onClick={() => setActiveTab('partnership')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black shrink-0 flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'partnership'
                ? 'bg-purple-700 text-white shadow-md'
                : 'bg-white hover:bg-purple-50/50 text-purple-950 border border-[#ded5c5]'
            }`}
          >
            <Handshake className="w-3.5 h-3.5 text-purple-600" />
            <span>مشارکت در ساخت ({toPersianDigits(properties.filter(p => p.dealType === 'partnership').length)})</span>
          </button>
        </div>

        {/* Left Scroll Arrow for Desktop (RTL) */}
        <button
          onClick={() => handleScrollTabs('left')}
          className="hidden md:flex absolute left-0 z-10 w-7 h-9 items-center justify-center bg-white text-slate-700 hover:text-amber-800 rounded-l-2xl border border-[#ded5c5] shadow-md opacity-0 group-hover/tabs:opacity-100 transition-opacity cursor-pointer"
          title="پیمایش به چپ"
          aria-label="پیمایش چپ"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Interactive Mortgage-to-Rent Converter Tool for Rentals */}
      {activeTab === 'rent' && (
        <div className="bg-[#fffdf7] border-2 border-amber-300 rounded-3xl p-4 sm:p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-amber-200/80 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-900">
                <Calculator className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-black text-slate-950">ابزار تعاملی تبدیل ودیعه و اجاره‌بها (رهن به اجاره)</h3>
                <p className="text-[10px] text-slate-600 font-semibold">محاسبه بر مبنای نرخ مصوب ۳٪ عرف بازار مسکن (هر ۱۰۰ میلیون ودیعه = ۳ میلیون اجاره ماهانه)</p>
              </div>
            </div>
            <span className="text-[10px] bg-emerald-100 text-emerald-900 border border-emerald-300 px-2.5 py-0.5 rounded-full font-black">
              محاسبه‌گر رسمی
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-white rounded-2xl border border-[#ded5c5]">
              <span className="text-[10px] text-slate-600 font-bold block mb-1">رهن کامل فرضی:</span>
              <span className="text-sm font-black text-amber-950">۱,۲۰۰,۰۰۰,۰۰۰ تومان</span>
              <span className="text-[9.5px] text-slate-500 block mt-0.5">بدون پرداخت اجاره ماهانه</span>
            </div>
            <div className="p-3 bg-white rounded-2xl border border-[#ded5c5]">
              <span className="text-[10px] text-slate-600 font-bold block mb-1">تبدیل به ۵۰۰ م ودیعه:</span>
              <span className="text-sm font-black text-emerald-900">۲۱,۰۰۰,۰۰۰ تومان</span>
              <span className="text-[9.5px] text-slate-500 block mt-0.5">اجاره ماهانه پیشنهادی طرفین</span>
            </div>
            <div className="p-3 bg-white rounded-2xl border border-[#ded5c5]">
              <span className="text-[10px] text-slate-600 font-bold block mb-1">تبدیل به ۸۰۰ م ودیعه:</span>
              <span className="text-sm font-black text-blue-900">۱۲,۰۰۰,۰۰۰ تومان</span>
              <span className="text-[9.5px] text-slate-500 block mt-0.5">اجاره ماهانه پیشنهادی طرفین</span>
            </div>
          </div>
        </div>
      )}
      {filteredProperties.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center space-y-3 border border-[#ded5c5] shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
          <p className="text-slate-900 text-sm font-black">هیچ فایلی با این مشخصات یافت نشد.</p>
          <p className="text-xs text-slate-600 font-semibold">عبارت جستجو یا فیلترها را تغییر دهید.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProperties.map((property) => {
            const isRental = property.dealType === 'rent';

            return (
              <div
                key={property.id}
                className="bg-white rounded-3xl border border-[#ded5c5] overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-md transition-all flex flex-col justify-between group"
              >
                {/* Image & Badges */}
                <div className="relative h-48 bg-slate-100 group overflow-hidden">
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  <span className="absolute top-3 right-3 bg-slate-950/80 text-white text-[10.5px] px-2.5 py-1 rounded-xl font-mono font-bold backdrop-blur-md">
                    {property.code}
                  </span>

                  <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
                    <div className="bg-emerald-600 text-white text-[10px] px-2.5 py-1 rounded-xl font-black flex items-center gap-1 shadow-sm">
                      <ShieldCheck className="w-3.5 h-3.5 text-white" />
                      <span>تأیید اصالت ثبتی</span>
                    </div>
                    {isRental && (
                      <span className="bg-emerald-800 text-white text-[10px] px-2.5 py-0.5 rounded-lg font-black shadow-xs">
                        رهن و اجاره
                      </span>
                    )}
                  </div>

                  {property.isRateCutter && property.discountPercent && (
                    <span className="absolute bottom-3 right-3 bg-rose-600 text-white text-[11px] px-3 py-1 rounded-xl font-black shadow-lg">
                      %{toPersianDigits(property.discountPercent)} تخفیف ویژه
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="p-4.5 space-y-3.5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-slate-600 font-bold mb-1.5">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-amber-700" />
                        <span>{property.city} | {property.district}</span>
                      </div>
                      <span className="bg-[#faf8f4] text-slate-800 px-2 py-0.5 rounded-lg text-[10.5px] font-black border border-[#e4ddd0]">
                        {property.documentType}
                      </span>
                    </div>

                    <h3 className="font-black text-sm text-slate-950 line-clamp-2 leading-snug">
                      {property.title}
                    </h3>
                  </div>

                  {/* Specs */}
                  <div className="grid grid-cols-3 gap-2 bg-[#faf8f4] rounded-2xl p-2.5 text-center text-xs text-slate-800 font-bold border border-[#e4ddd0]">
                    <div>
                      <span className="block text-[10px] text-slate-600 font-semibold">متراژ</span>
                      <span className="text-slate-950 font-black">{toPersianDigits(property.area)} م‌م</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-600 font-semibold">اتاق</span>
                      <span className="text-slate-950 font-black">{toPersianDigits(property.rooms)} خواب</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-600 font-semibold">سال ساخت</span>
                      <span className="text-slate-950 font-black">{toPersianDigits(property.year)}</span>
                    </div>
                  </div>

                  {/* Price Row (Adapted for Rentals vs Sale) */}
                  <div className="pt-2 flex items-center justify-between border-t border-[#ede6d8]">
                    {isRental && property.rentalDetails ? (
                      <>
                        <div>
                          <span className="text-[10px] text-slate-600 font-bold block">ودیعه (رهن)</span>
                          <span className="text-sm font-black text-emerald-950">{formatTomanShort(property.rentalDetails.depositPrice)}</span>
                        </div>
                        <div className="text-left">
                          <span className="text-[10px] text-slate-600 font-bold block">اجاره ماهیانه</span>
                          <span className="text-xs font-black text-amber-900">{formatTomanShort(property.rentalDetails.monthlyRent)}</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <span className="text-[10px] text-slate-600 font-bold block">قیمت کارشناسی</span>
                          <span className="text-sm font-black text-amber-950">{formatTomanShort(property.price)}</span>
                        </div>
                        <div className="text-left">
                          <span className="text-[10px] text-slate-600 font-bold block">متری</span>
                          <span className="text-xs font-black text-slate-800">{formatTomanShort(property.pricePerMeter)}</span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex items-center gap-2">
                    <button
                      onClick={() => onSelectProperty(property)}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-950 text-xs font-black py-2.5 rounded-xl transition-all text-center border border-slate-300 cursor-pointer"
                    >
                      مشاهده جزییات
                    </button>
                    <button
                      onClick={() => onEnterDealRoom(property.code)}
                      className="flex-1 bg-[#a37936] hover:bg-[#8f6628] text-white text-xs font-black py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Lock className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>ورود به معامله</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
