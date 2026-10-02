import React, { useState, useRef } from 'react';
import { 
  Mountain, 
  Truck, 
  Pickaxe, 
  CheckCircle2, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  HardHat, 
  Search,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { maskPhoneNumber } from '../../utils/formatters';

interface MiningAndCivilItem {
  id: string;
  category: 'mines' | 'machinery' | 'civil_contractors' | 'craftsmen';
  title: string;
  subtitle: string;
  location: string;
  phone: string;
  capacityOrSpec: string;
  pricing: string;
  rating: number;
  verified: boolean;
  image: string;
  tags: string[];
}

const mockCivilData: MiningAndCivilItem[] = [];

export const CraftsmenPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'mines' | 'machinery' | 'civil_contractors' | 'craftsmen'>('all');
  const [searchFilter, setSearchFilter] = useState('');
  const tabsScrollRef = useRef<HTMLDivElement>(null);

  const handleScrollTabs = (direction: 'left' | 'right') => {
    if (tabsScrollRef.current) {
      const scrollAmount = direction === 'left' ? -240 : 240;
      tabsScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleTabsWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (tabsScrollRef.current) {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        tabsScrollRef.current.scrollBy({
          left: -e.deltaY * 1.5,
          behavior: 'auto'
        });
      }
    }
  };

  const filteredItems = mockCivilData.filter((item) => {
    if (activeCategory !== 'all' && item.category !== activeCategory) return false;
    if (searchFilter.trim() && !item.title.includes(searchFilter) && !item.subtitle.includes(searchFilter) && !item.location.includes(searchFilter)) return false;
    return true;
  });

  return (
    <div className="space-y-6 pb-20 text-[#111827]" dir="rtl">
      {/* Header Banner Card (Full Framed 3D Gold Box) */}
      <div className="bg-white p-5 sm:p-6 rounded-[28px] border-2 border-[#dfc282] space-y-3 relative overflow-hidden shadow-[0_4px_16px_rgba(180,130,40,0.1)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 btn-3d-gold text-[#2c1b04] px-3.5 py-1 rounded-xl text-xs font-black mb-2 shadow-2xs">
              <Mountain className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>پیوند عمران، معادن و ماشین‌آلات سنگین</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-950">
              شبکه جامع معادن، ماشین‌آلات راه و معدن و پیمانکاران اجرایی
            </h1>
            <p className="text-[15px] text-slate-700 font-bold mt-1 max-w-2xl leading-relaxed">
              ارتباط مستقیم با معدن‌داران سنگ و شن و ماسه، ماشین‌آلات سنگین (بیل مکانیکی، لودر، تاورکرین)، پیمانکاران راه‌سازی و استادکاران دارای رتبه‌بندی رسمی.
            </p>
          </div>

          <div className="bg-[#fffcf7] p-3.5 rounded-2xl border-2 border-[#dfc282] text-xs space-y-1 shrink-0 text-center shadow-2xs">
            <span className="text-xs text-slate-600 font-bold block">هسته اصلی تولید:</span>
            <span className="font-black text-amber-950 text-[15px] flex items-center justify-center gap-1">
              <ShieldCheck className="w-4.5 h-4.5 text-emerald-700" />
              تأییدیه پروانه بهره‌برداری
            </span>
          </div>
        </div>
      </div>

      {/* 4 Pillars Navigation Bar (Compact 3D Gold Buttons with Scroll Navigation & Wheel Support) */}
      <div className="relative flex items-center gap-2">
        {/* Scroll Right Button */}
        <button
          type="button"
          onClick={() => handleScrollTabs('right')}
          className="w-8 h-8 rounded-xl btn-3d-gold text-[#2c1b04] flex items-center justify-center shrink-0 shadow-2xs hover:scale-105 active:scale-95 transition-all cursor-pointer z-10"
          title="مشاهده بخش‌های قبلی"
          aria-label="بخش‌های قبلی"
        >
          <ChevronRight className="w-4 h-4 stroke-[3]" />
        </button>

        <div 
          ref={tabsScrollRef}
          onWheel={handleTabsWheel}
          className="flex-1 flex gap-2 overflow-x-auto py-1 px-0.5 scroll-smooth touch-pan-x select-none"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#dfc282 #faf8f4'
          }}
        >
          <button
            onClick={() => setActiveCategory('all')}
            className={`h-9 px-4 rounded-xl text-[15px] font-black shrink-0 transition-all cursor-pointer flex items-center justify-center active:scale-95 ${
              activeCategory === 'all'
                ? 'btn-3d-gold text-[#2c1b04] shadow-2xs'
                : 'bg-white hover:bg-amber-50/60 text-slate-800 border-2 border-[#dfc282]'
            }`}
          >
            تمام بخش‌های عمران و معدن
          </button>

          <button
            onClick={() => setActiveCategory('mines')}
            className={`h-9 px-4 rounded-xl text-[15px] font-black shrink-0 transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 ${
              activeCategory === 'mines'
                ? 'btn-3d-gold text-[#2c1b04] shadow-2xs'
                : 'bg-white hover:bg-amber-50/60 text-slate-800 border-2 border-[#dfc282]'
            }`}
          >
            <Pickaxe className="w-4 h-4 text-amber-800" />
            <span>معادن سنگ و مصالح</span>
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
            <span>ماشین‌آلات سنگین و تاورکرین</span>
          </button>

          <button
            onClick={() => setActiveCategory('civil_contractors')}
            className={`h-9 px-4 rounded-xl text-[15px] font-black shrink-0 transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 ${
              activeCategory === 'civil_contractors'
                ? 'btn-3d-gold text-[#2c1b04] shadow-2xs'
                : 'bg-white hover:bg-amber-50/60 text-slate-800 border-2 border-[#dfc282]'
            }`}
          >
            <HardHat className="w-4 h-4 text-amber-800" />
            <span>پیمانکاران خاک‌برداری و نیلینگ</span>
          </button>

          <button
            onClick={() => setActiveCategory('craftsmen')}
            className={`h-9 px-4 rounded-xl text-[15px] font-black shrink-0 transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 ${
              activeCategory === 'craftsmen'
                ? 'btn-3d-gold text-[#2c1b04] shadow-2xs'
                : 'bg-white hover:bg-amber-50/60 text-slate-800 border-2 border-[#dfc282]'
            }`}
          >
            <HardHat className="w-4 h-4 text-amber-800" />
            <span>استادکاران و اکیپ اجرایی</span>
          </button>
        </div>

        {/* Scroll Left Button */}
        <button
          type="button"
          onClick={() => handleScrollTabs('left')}
          className="w-8 h-8 rounded-xl btn-3d-gold text-[#2c1b04] flex items-center justify-center shrink-0 shadow-2xs hover:scale-105 active:scale-95 transition-all cursor-pointer z-10"
          title="مشاهده سایر بخش‌ها"
          aria-label="سایر بخش‌ها"
        >
          <ChevronLeft className="w-4 h-4 stroke-[3]" />
        </button>
      </div>

      {/* Cards Grid */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-[28px] p-10 text-center space-y-3 border-2 border-[#dfc282] shadow-[0_4px_16px_rgba(180,130,40,0.1)]">
          <p className="text-slate-950 text-base font-black">هیچ موردی در این بخش ثبت نشده است.</p>
          <p className="text-[14px] text-slate-600 font-bold">معدن‌داران، صاحبان ماشین‌آلات سنگین و پیمانکاران محترم می‌توانند خدمات و تجهیزات خود را ثبت نمایند.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-[28px] p-5 border-2 border-[#dfc282] shadow-[0_4px_16px_rgba(180,130,40,0.1)] space-y-4 flex flex-col justify-between hover:shadow-xl transition-all"
            >
              <div className="space-y-3">
                {/* Image & Category Tag */}
                <div className="relative h-44 rounded-2xl overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <span className="absolute top-2.5 right-2.5 bg-slate-900/90 text-white text-xs font-black px-2.5 py-1 rounded-xl backdrop-blur-md">
                    {item.category === 'mines' && 'معدن‌دار رسمی'}
                    {item.category === 'machinery' && 'ماشین‌آلات عمرانی'}
                    {item.category === 'civil_contractors' && 'پیمانکار زیرساخت'}
                    {item.category === 'craftsmen' && 'استادکار مجرب'}
                  </span>
                  <span className="absolute bottom-2.5 left-2.5 btn-3d-gold text-[#2c1b04] font-black text-xs px-2.5 py-1 rounded-xl shadow-md flex items-center gap-1">
                    <span>★ {item.rating}</span>
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-black text-base text-slate-950">{item.title}</h3>
                    {item.verified && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                  </div>
                  <p className="text-[13px] text-slate-700 font-bold mt-1 leading-relaxed">
                    {item.subtitle}
                  </p>
                </div>

                {/* Specs & Pricing */}
                <div className="p-3.5 bg-[#faf8f4] rounded-2xl border-2 border-[#e6dfd3] space-y-1.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 font-bold text-xs">موقعیت و لوکیشن:</span>
                    <span className="font-bold text-slate-950 flex items-center gap-1 text-[13px]">
                      <MapPin className="w-4 h-4 text-amber-800" />
                      {item.location}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 font-bold text-xs">مشخصات / ظرفیت:</span>
                    <span className="font-bold text-slate-950 text-[13px]">{item.capacityOrSpec}</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-[#ede6d8] pt-1.5">
                    <span className="text-slate-600 font-bold text-xs">نرخ / شرایط همکاری:</span>
                    <span className="font-black text-emerald-900 text-[15px]">{item.pricing}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {item.tags.map((tag, idx) => (
                    <span key={idx} className="text-xs bg-amber-50 text-amber-950 font-black px-2.5 py-1 rounded-lg border border-amber-200">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Direct Contact Button (Compact, 15px Font Size) */}
              <div className="pt-2">
                <a
                  href={`tel:${item.phone}`}
                  className="w-full h-10 btn-3d-gold text-[#2c1b04] text-[15px] font-black rounded-xl flex items-center justify-center gap-2 shadow-2xs active:scale-95 transition-transform"
                >
                  <Phone className="w-4 h-4 stroke-[2.5]" />
                  <span>تماس مستقیم با تأمین‌کننده ({maskPhoneNumber(item.phone)})</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
