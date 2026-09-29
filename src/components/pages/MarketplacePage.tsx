import React, { useState, useRef } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  MapPin, 
  Lock, 
  Percent, 
  RefreshCw, 
  Handshake, 
  KeyRound, 
  Home, 
  ChevronLeft, 
  ChevronRight, 
  Calculator 
} from 'lucide-react';
import { Property } from '../../types';
import { formatTomanShort, toPersianDigits } from '../../utils/formatters';

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
      
      {/* Header Banner Card (Full Framed 3D Gold Box) */}
      <div className="bg-white p-5 sm:p-6 rounded-[28px] border-2 border-[#dfc282] space-y-2 shadow-[0_4px_16px_rgba(180,130,40,0.1)] relative overflow-hidden">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl btn-3d-gold text-[#2c1b04] flex items-center justify-center font-black shadow-2xs shrink-0">
            <Building2 className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-950">بازار فایل‌های اعتبارسنجی‌شده پیوند ساخت</h1>
            <p className="text-[15px] text-slate-700 font-bold mt-0.5 leading-relaxed">
              فهرست املاک مسکونی، تجاری و رهن و اجاره سالم دارای استعلام ثبتی، کارشناسی قیمت و تضمین حقوقی معامله
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs Bar with Horizontal Scroll Navigation (Compact 3D Gold Buttons, 15px Font) */}
      <div className="relative flex items-center group/tabs">
        {/* Right Scroll Arrow */}
        <button
          onClick={() => handleScrollTabs('right')}
          className="hidden md:flex absolute right-0 z-10 w-8 h-9 items-center justify-center btn-3d-gold text-[#2c1b04] rounded-r-xl shadow-md opacity-0 group-hover/tabs:opacity-100 transition-opacity cursor-pointer"
          title="پیمایش به راست"
          aria-label="پیمایش راست"
        >
          <ChevronRight className="w-4 h-4 stroke-[2.5]" />
        </button>

        <div 
          ref={tabsScrollRef}
          className="w-full flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth touch-pan-x pb-1 px-0.5"
        >
          <button
            onClick={() => setActiveTab('all')}
            className={`h-9 px-4 rounded-xl text-[15px] font-black shrink-0 transition-all cursor-pointer flex items-center justify-center active:scale-95 ${
              activeTab === 'all'
                ? 'btn-3d-gold text-[#2c1b04] shadow-2xs'
                : 'bg-white hover:bg-amber-50/60 text-slate-800 border-2 border-[#dfc282] shadow-2xs'
            }`}
          >
            همه فایل‌ها ({toPersianDigits(properties.length)})
          </button>

          <button
            onClick={() => setActiveTab('rent')}
            className={`h-9 px-4 rounded-xl text-[15px] font-black shrink-0 flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 ${
              activeTab === 'rent'
                ? 'btn-3d-gold text-[#2c1b04] shadow-2xs'
                : 'bg-white hover:bg-amber-50/60 text-slate-800 border-2 border-[#dfc282] shadow-2xs'
            }`}
          >
            <KeyRound className="w-4 h-4 text-emerald-700" />
            <span>رهن و اجاره ({toPersianDigits(properties.filter(p => p.dealType === 'rent').length)})</span>
          </button>

          <button
            onClick={() => setActiveTab('sale')}
            className={`h-9 px-4 rounded-xl text-[15px] font-black shrink-0 flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 ${
              activeTab === 'sale'
                ? 'btn-3d-gold text-[#2c1b04] shadow-2xs'
                : 'bg-white hover:bg-amber-50/60 text-slate-800 border-2 border-[#dfc282] shadow-2xs'
            }`}
          >
            <Home className="w-4 h-4 text-amber-700" />
            <span>فروش قطعی ({toPersianDigits(properties.filter(p => p.dealType === 'sale').length)})</span>
          </button>

          <button
            onClick={() => setActiveTab('rate_cutter')}
            className={`h-9 px-4 rounded-xl text-[15px] font-black shrink-0 flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 ${
              activeTab === 'rate_cutter'
                ? 'btn-3d-gold text-[#2c1b04] shadow-2xs'
                : 'bg-white hover:bg-amber-50/60 text-slate-800 border-2 border-[#dfc282] shadow-2xs'
            }`}
          >
            <Percent className="w-4 h-4 text-rose-700" />
            <span>فروش فوری / نرخ‌شکن ({toPersianDigits(properties.filter(p => p.isRateCutter).length)})</span>
          </button>

          <button
            onClick={() => setActiveTab('barter')}
            className={`h-9 px-4 rounded-xl text-[15px] font-black shrink-0 flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 ${
              activeTab === 'barter'
                ? 'btn-3d-gold text-[#2c1b04] shadow-2xs'
                : 'bg-white hover:bg-amber-50/60 text-slate-800 border-2 border-[#dfc282] shadow-2xs'
            }`}
          >
            <RefreshCw className="w-4 h-4 text-blue-700" />
            <span>تهاتر ملک و مصالح ({toPersianDigits(properties.filter(p => p.dealType === 'barter').length)})</span>
          </button>

          <button
            onClick={() => setActiveTab('partnership')}
            className={`h-9 px-4 rounded-xl text-[15px] font-black shrink-0 flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 ${
              activeTab === 'partnership'
                ? 'btn-3d-gold text-[#2c1b04] shadow-2xs'
                : 'bg-white hover:bg-amber-50/60 text-slate-800 border-2 border-[#dfc282] shadow-2xs'
            }`}
          >
            <Handshake className="w-4 h-4 text-purple-700" />
            <span>مشارکت در ساخت ({toPersianDigits(properties.filter(p => p.dealType === 'partnership').length)})</span>
          </button>
        </div>

        {/* Left Scroll Arrow */}
        <button
          onClick={() => handleScrollTabs('left')}
          className="hidden md:flex absolute left-0 z-10 w-8 h-9 items-center justify-center btn-3d-gold text-[#2c1b04] rounded-l-xl shadow-md opacity-0 group-hover/tabs:opacity-100 transition-opacity cursor-pointer"
          title="پیمایش به چپ"
          aria-label="پیمایش چپ"
        >
          <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>

      {/* Interactive Mortgage-to-Rent Converter Tool for Rentals */}
      {activeTab === 'rent' && (
        <div className="bg-white border-2 border-[#dfc282] rounded-[28px] p-5 shadow-[0_4px_16px_rgba(180,130,40,0.1)] space-y-3.5">
          <div className="flex items-center justify-between border-b border-[#ede6d8] pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl btn-3d-gold flex items-center justify-center text-[#2c1b04] shadow-2xs">
                <Calculator className="w-4.5 h-4.5 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-950">ابزار تعاملی تبدیل ودیعه و اجاره‌بها (رهن به اجاره)</h3>
                <p className="text-[13px] text-slate-600 font-bold">محاسبه بر مبنای نرخ مصوب ۳٪ عرف بازار مسکن (هر ۱۰۰ میلیون ودیعه = ۳ میلیون اجاره ماهانه)</p>
              </div>
            </div>
            <span className="text-xs btn-3d-gold text-[#2c1b04] px-3 py-1 rounded-xl font-black shadow-2xs">
              محاسبه‌گر رسمی
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
            <div className="p-3.5 bg-[#faf8f4] rounded-2xl border-2 border-[#e6dfd3]">
              <span className="text-xs text-slate-600 font-bold block mb-1">رهن کامل فرضی:</span>
              <span className="text-[15px] font-black text-amber-950">۱,۲۰۰,۰۰۰,۰۰۰ تومان</span>
              <span className="text-[11px] text-slate-500 block mt-0.5">بدون پرداخت اجاره ماهانه</span>
            </div>
            <div className="p-3.5 bg-[#faf8f4] rounded-2xl border-2 border-[#e6dfd3]">
              <span className="text-xs text-slate-600 font-bold block mb-1">تبدیل به ۵۰۰ م ودیعه:</span>
              <span className="text-[15px] font-black text-emerald-950">۲۱,۰۰۰,۰۰۰ تومان</span>
              <span className="text-[11px] text-slate-500 block mt-0.5">اجاره ماهانه پیشنهادی طرفین</span>
            </div>
            <div className="p-3.5 bg-[#faf8f4] rounded-2xl border-2 border-[#e6dfd3]">
              <span className="text-xs text-slate-600 font-bold block mb-1">تبدیل به ۸۰۰ م ودیعه:</span>
              <span className="text-[15px] font-black text-blue-950">۱۲,۰۰۰,۰۰۰ تومان</span>
              <span className="text-[11px] text-slate-500 block mt-0.5">اجاره ماهانه پیشنهادی طرفین</span>
            </div>
          </div>
        </div>
      )}

      {/* Property Cards Grid */}
      {filteredProperties.length === 0 ? (
        <div className="bg-white rounded-[28px] p-10 text-center space-y-3 border-2 border-[#dfc282] shadow-[0_4px_16px_rgba(180,130,40,0.1)]">
          <p className="text-slate-950 text-base font-black">هیچ فایلی با این مشخصات یافت نشد.</p>
          <p className="text-[15px] text-slate-600 font-bold">عبارت جستجو یا فیلترها را تغییر دهید.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProperties.map((property) => {
            const isRental = property.dealType === 'rent';

            return (
              <div
                key={property.id}
                className="bg-white rounded-[28px] border-2 border-[#dfc282] overflow-hidden shadow-[0_4px_16px_rgba(180,130,40,0.1)] hover:shadow-xl transition-all flex flex-col justify-between group"
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
                  
                  <span className="absolute top-3 right-3 bg-slate-950/85 text-white text-xs px-2.5 py-1 rounded-xl font-mono font-bold backdrop-blur-md">
                    {property.code}
                  </span>

                  <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
                    <div className="bg-emerald-700 text-white text-xs px-2.5 py-1 rounded-xl font-black flex items-center gap-1 shadow-sm">
                      <ShieldCheck className="w-4 h-4 text-white" />
                      <span>تأیید اصالت ثبتی</span>
                    </div>
                    {isRental && (
                      <span className="bg-emerald-900 text-white text-xs px-2.5 py-0.5 rounded-lg font-black shadow-xs">
                        رهن و اجاره
                      </span>
                    )}
                  </div>

                  {property.isRateCutter && property.discountPercent && (
                    <span className="absolute bottom-3 right-3 bg-rose-600 text-white text-xs px-3 py-1 rounded-xl font-black shadow-lg">
                      %{toPersianDigits(property.discountPercent)} تخفیف ویژه
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="p-4.5 space-y-3.5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-600 font-bold mb-1.5">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-amber-800" />
                        <span className="text-slate-800">{property.city} | {property.district}</span>
                      </div>
                      <span className="bg-[#faf8f4] text-slate-900 px-2 py-0.5 rounded-lg text-xs font-black border border-[#e4ddd0]">
                        {property.documentType}
                      </span>
                    </div>

                    <h3 className="font-black text-base text-slate-950 line-clamp-2 leading-snug">
                      {property.title}
                    </h3>
                  </div>

                  {/* Specs */}
                  <div className="grid grid-cols-3 gap-2 bg-[#faf8f4] rounded-2xl p-2.5 text-center text-slate-900 font-bold border border-[#e4ddd0]">
                    <div>
                      <span className="block text-[11px] text-slate-600 font-semibold">متراژ</span>
                      <span className="text-slate-950 font-black text-[15px]">{toPersianDigits(property.area)} م‌م</span>
                    </div>
                    <div>
                      <span className="block text-[11px] text-slate-600 font-semibold">اتاق</span>
                      <span className="text-slate-950 font-black text-[15px]">{toPersianDigits(property.rooms)} خواب</span>
                    </div>
                    <div>
                      <span className="block text-[11px] text-slate-600 font-semibold">سال ساخت</span>
                      <span className="text-slate-950 font-black text-[15px]">{toPersianDigits(property.year)}</span>
                    </div>
                  </div>

                  {/* Price Row (Adapted for Rentals vs Sale) */}
                  <div className="pt-2 flex items-center justify-between border-t border-[#ede6d8]">
                    {isRental && property.rentalDetails ? (
                      <>
                        <div>
                          <span className="text-[11px] text-slate-600 font-bold block">ودیعه (رهن)</span>
                          <span className="text-[15px] font-black text-emerald-950 font-mono">{formatTomanShort(property.rentalDetails.depositPrice)}</span>
                        </div>
                        <div className="text-left">
                          <span className="text-[11px] text-slate-600 font-bold block">اجاره ماهیانه</span>
                          <span className="text-[15px] font-black text-amber-950 font-mono">{formatTomanShort(property.rentalDetails.monthlyRent)}</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <span className="text-[11px] text-slate-600 font-bold block">قیمت کارشناسی</span>
                          <span className="text-[15px] font-black text-amber-950 font-mono">{formatTomanShort(property.price)}</span>
                        </div>
                        <div className="text-left">
                          <span className="text-[11px] text-slate-600 font-bold block">متری</span>
                          <span className="text-[15px] font-black text-slate-900 font-mono">{formatTomanShort(property.pricePerMeter)}</span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Actions (Compact Buttons, 15px Font Size) */}
                  <div className="pt-2 flex items-center gap-2">
                    <button
                      onClick={() => onSelectProperty(property)}
                      className="flex-1 h-9 bg-white hover:bg-amber-50/60 text-slate-950 text-[15px] font-black rounded-xl transition-all text-center border-2 border-[#dfc282] shadow-2xs active:scale-95 cursor-pointer"
                    >
                      مشاهده جزییات
                    </button>
                    <button
                      onClick={() => onEnterDealRoom(property.code)}
                      className="flex-1 h-9 btn-3d-gold text-[#2c1b04] text-[15px] font-black rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-2xs active:scale-95 cursor-pointer"
                    >
                      <Lock className="w-4 h-4 stroke-[2.5]" />
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
