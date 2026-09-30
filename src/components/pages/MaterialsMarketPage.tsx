import React, { useState, useRef } from 'react';
import { Package, Factory, Store, MapPin, ShieldCheck, Send, Mountain, PlusCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { MaterialProduct, MaterialCategory } from '../../types';
import { mockMaterials } from '../../data/mockData';
import { formatToman, toPersianDigits } from '../../utils/formatters';

interface MaterialsMarketPageProps {
  onOpenMaterialQuoteModal: (product?: MaterialProduct) => void;
}

const categoriesList: MaterialCategory[] = [
  'سنگ و کانی معدنی',
  'پوکه و سیلیس',
  'سیمان',
  'گچ',
  'کاشی و سرامیک',
  'میلگرد و آهن‌آلات',
  'سنگ ساختمان',
  'در و پنجره',
  'آلومینیوم و شیشه',
  'تجهیزات برق',
  'لوله و اتصالات',
  'ضایعات و بازیافت ساختمانی',
];

export const MaterialsMarketPage: React.FC<MaterialsMarketPageProps> = ({ onOpenMaterialQuoteModal }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [supplierType, setSupplierType] = useState<'all' | 'mine' | 'factory' | 'local'>('all');
  const [maxDistance, setMaxDistance] = useState<number>(300);
  const categoriesScrollRef = useRef<HTMLDivElement>(null);

  const handleScrollCategories = (direction: 'left' | 'right') => {
    if (categoriesScrollRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      categoriesScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleCategoriesWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (categoriesScrollRef.current) {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        categoriesScrollRef.current.scrollBy({
          left: -e.deltaY * 1.5,
          behavior: 'auto'
        });
      }
    }
  };

  const filteredMaterials = mockMaterials.filter((m) => {
    if (selectedCategory !== 'all' && m.category !== selectedCategory) return false;
    if (supplierType !== 'all' && m.supplierType !== supplierType) return false;
    if (m.distanceKm > maxDistance) return false;
    return true;
  });

  return (
    <div className="space-y-6 pb-12 text-[#1c1d22]">
      {/* Header Banner Card (Full Framed 3D Gold Box) */}
      <div className="bg-white p-5 sm:p-6 rounded-[28px] border-2 border-[#dfc282] space-y-3 relative overflow-hidden shadow-[0_4px_16px_rgba(180,130,40,0.1)]">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 btn-3d-gold text-[#2c1b04] px-3 py-1 rounded-lg text-xs font-black mb-2 shadow-2xs">
              <Package className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>بازار رسمی متریال و مصالح ساختمانی پیوندساخت</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-950">
              تأمین مستقیم متریال ساختمانی از کارخانجات و معادن رسمی
            </h1>
            <p className="text-[15px] text-slate-700 font-bold mt-1 max-w-2xl leading-relaxed">
              خرید و استعلام بی‌واسطه کاشی و سرامیک، سنگ ساختمانی، میلگرد و فولاد، سیمان، گچ، لوله و اتصالات، شیشه و درب و پنجره با قیمت مصوب.
            </p>
          </div>

          <button
            onClick={() => onOpenMaterialQuoteModal()}
            className="h-10 px-4.5 btn-3d-gold text-[#2c1b04] text-[15px] font-black rounded-xl shadow-2xs transition-all active:scale-95 shrink-0 cursor-pointer flex items-center gap-2"
          >
            <PlusCircle className="w-4.5 h-4.5 stroke-[2.5]" />
            <span>استعلام قیمت عمومی پای‌کار</span>
          </button>
        </div>
      </div>

      {/* Supplier Type Toggle & Radius Filter Card */}
      <div className="bg-white p-5 rounded-[28px] border-2 border-[#dfc282] shadow-[0_4px_16px_rgba(180,130,40,0.1)] space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-[#eee7db] pb-3.5">
          {/* Supplier Type Toggle (Compact 3D Gold Buttons, 15px Font) */}
          <div className="flex flex-wrap items-center gap-1.5 bg-[#faf8f4] p-1.5 rounded-2xl w-full sm:w-auto border-2 border-[#dfc282]">
            <button
              onClick={() => setSupplierType('all')}
              className={`h-8.5 px-3.5 rounded-xl text-[15px] font-black transition-all cursor-pointer ${
                supplierType === 'all'
                  ? 'btn-3d-gold text-[#2c1b04] shadow-2xs'
                  : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              همه تامین‌کنندگان
            </button>

            <button
              onClick={() => setSupplierType('mine')}
              className={`h-8.5 px-3.5 rounded-xl text-[15px] font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                supplierType === 'mine'
                  ? 'btn-3d-gold text-[#2c1b04] shadow-2xs'
                  : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              <Mountain className="w-4 h-4 text-amber-800" />
              <span>معدن‌دار / سینه کار</span>
            </button>

            <button
              onClick={() => setSupplierType('factory')}
              className={`h-8.5 px-3.5 rounded-xl text-[15px] font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                supplierType === 'factory'
                  ? 'btn-3d-gold text-[#2c1b04] shadow-2xs'
                  : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              <Factory className="w-4 h-4 text-amber-800" />
              <span>کارخانه تولیدی</span>
            </button>

            <button
              onClick={() => setSupplierType('local')}
              className={`h-8.5 px-3.5 rounded-xl text-[15px] font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                supplierType === 'local'
                  ? 'btn-3d-gold text-[#2c1b04] shadow-2xs'
                  : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              <Store className="w-4 h-4 text-amber-800" />
              <span>فروشگاه محلی</span>
            </button>
          </div>

          {/* Distance Slider */}
          <div className="flex items-center gap-3 w-full sm:w-72 bg-[#faf8f4] px-4 py-2 rounded-xl border-2 border-[#dfc282]">
            <span className="text-[13px] font-black text-slate-800 whitespace-nowrap">شعاع ارسال:</span>
            <input
              type="range"
              min={20}
              max={1000}
              step={20}
              value={maxDistance}
              onChange={(e) => setMaxDistance(Number(e.target.value))}
              className="flex-1 accent-amber-600 cursor-pointer"
            />
            <span className="text-[15px] font-black text-amber-950 font-mono w-20 text-left">
              {toPersianDigits(maxDistance)} کیلومتر
            </span>
          </div>
        </div>

        {/* Categories Carousel (Compact 3D Gold Buttons with Scroll Navigation & Wheel Support) */}
        <div className="relative flex items-center gap-2 pt-1">
          {/* Scroll Right (Previous in RTL) Button */}
          <button
            type="button"
            onClick={() => handleScrollCategories('right')}
            className="w-8 h-8 rounded-xl btn-3d-gold text-[#2c1b04] flex items-center justify-center shrink-0 shadow-2xs hover:scale-105 active:scale-95 transition-all cursor-pointer z-10"
            title="مشاهده دسته‌های قبلی"
            aria-label="دسته‌های قبلی"
          >
            <ChevronRight className="w-4 h-4 stroke-[3]" />
          </button>

          {/* Scrollable Container */}
          <div 
            ref={categoriesScrollRef}
            onWheel={handleCategoriesWheel}
            className="flex-1 flex gap-2 overflow-x-auto py-1 px-0.5 scroll-smooth touch-pan-x select-none"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#dfc282 #faf8f4'
            }}
          >
            <button
              onClick={() => setSelectedCategory('all')}
              className={`h-8.5 px-3.5 rounded-xl text-[15px] font-black shrink-0 transition-all cursor-pointer flex items-center justify-center active:scale-95 ${
                selectedCategory === 'all'
                  ? 'btn-3d-gold text-[#2c1b04] shadow-2xs'
                  : 'bg-white text-slate-800 hover:bg-amber-50/60 border-2 border-[#dfc282]'
              }`}
            >
              همه دسته‌ها
            </button>

            {categoriesList.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`h-8.5 px-3.5 rounded-xl text-[15px] font-black shrink-0 transition-all cursor-pointer flex items-center justify-center active:scale-95 ${
                  selectedCategory === cat
                    ? 'btn-3d-gold text-[#2c1b04] shadow-2xs'
                    : 'bg-white text-slate-800 hover:bg-amber-50/60 border-2 border-[#dfc282]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Scroll Left (Next in RTL) Button */}
          <button
            type="button"
            onClick={() => handleScrollCategories('left')}
            className="w-8 h-8 rounded-xl btn-3d-gold text-[#2c1b04] flex items-center justify-center shrink-0 shadow-2xs hover:scale-105 active:scale-95 transition-all cursor-pointer z-10"
            title="مشاهده سایر دسته‌ها"
            aria-label="سایر دسته‌ها"
          >
            <ChevronLeft className="w-4 h-4 stroke-[3]" />
          </button>
        </div>
      </div>

      {/* Material Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredMaterials.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-[28px] border-2 border-[#dfc282] overflow-hidden shadow-[0_4px_16px_rgba(180,130,40,0.1)] hover:shadow-xl transition-all flex flex-col justify-between group"
          >
            {/* Image & Badges */}
            <div className="relative h-48 bg-slate-100 overflow-hidden">
              <img
                src={item.images[0] || 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=700'}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              <div className="absolute top-3 right-3 flex flex-col gap-1">
                <span className="bg-white/95 backdrop-blur-sm text-slate-950 text-xs px-2.5 py-1 rounded-xl font-bold border border-slate-300">
                  {item.category}
                </span>
                {item.verifiedStatus === 'verified' && (
                  <span className="bg-emerald-700 text-white text-xs px-2.5 py-0.5 rounded-xl font-bold flex items-center gap-1 shadow-sm">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>تأییدشده رسمی</span>
                  </span>
                )}
              </div>

              <div className="absolute top-3 left-3 btn-3d-gold text-[#2c1b04] text-xs font-black px-2.5 py-1 rounded-xl shadow-2xs">
                فاصله: {toPersianDigits(item.distanceKm)} کیلومتر
              </div>
            </div>

            {/* Content */}
            <div className="p-4.5 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-black text-base text-slate-950 line-clamp-2 leading-snug">
                  {item.title}
                </h3>

                <div className="flex items-center gap-1.5 text-[15px] text-slate-800 mt-2 font-black">
                  {item.supplierType === 'mine' ? (
                    <Mountain className="w-4 h-4 text-amber-800 shrink-0" />
                  ) : item.supplierType === 'factory' ? (
                    <Factory className="w-4 h-4 text-amber-800 shrink-0" />
                  ) : (
                    <Store className="w-4 h-4 text-amber-800 shrink-0" />
                  )}
                  <span className="truncate">{item.supplierName}</span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-1 font-semibold">
                  <MapPin className="w-3.5 h-3.5 text-amber-800 shrink-0" />
                  <span>{item.location}</span>
                  <span className="text-slate-300">|</span>
                  <span>حداقل سفارش: {toPersianDigits(item.minOrder)} {item.unit}</span>
                </div>
              </div>

              {/* Price & Actions */}
              <div className="pt-3 border-t border-[#eee7db] flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-600 block font-bold">قیمت واحد ({item.unit}):</span>
                  <span className="text-base font-black text-amber-950 font-mono">
                    {formatToman(item.price)} تومان
                  </span>
                </div>

                <button
                  onClick={() => onOpenMaterialQuoteModal(item)}
                  className="h-9 px-3.5 btn-3d-gold text-[#2c1b04] font-black text-[15px] rounded-xl flex items-center gap-1.5 transition-all shadow-2xs active:scale-95 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-[#2c1b04]" />
                  <span>استعلام پیش‌فاکتور</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
