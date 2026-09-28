import React, { useState } from 'react';
import { Package, Factory, Store, MapPin, ShieldCheck, FileText, Send, SlidersHorizontal, Sparkles, Mountain, Pickaxe } from 'lucide-react';
import { MaterialProduct, MaterialCategory } from '../../types';
import { mockMaterials } from '../../data/mockData';
import { formatToman, formatTomanShort, toPersianDigits } from '../../utils/formatters';

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
];

export const MaterialsMarketPage: React.FC<MaterialsMarketPageProps> = ({ onOpenMaterialQuoteModal }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [supplierType, setSupplierType] = useState<'all' | 'mine' | 'factory' | 'local'>('all');
  const [maxDistance, setMaxDistance] = useState<number>(300);

  const filteredMaterials = mockMaterials.filter((m) => {
    if (selectedCategory !== 'all' && m.category !== selectedCategory) return false;
    if (supplierType !== 'all' && m.supplierType !== supplierType) return false;
    if (m.distanceKm > maxDistance) return false;
    return true;
  });

  return (
    <div className="space-y-6 pb-12 text-[#1c1d22]">
      
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#ded5c5] space-y-3 relative overflow-hidden shadow-xs">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-900 border border-amber-300 px-3.5 py-1 rounded-full text-xs font-black mb-2 shadow-xs">
              <Package className="w-3.5 h-3.5 text-amber-600" />
              <span>بازار رسمی متریال و مصالح ساختمانی پیوندساخت</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">تأمین مستقیم متریال ساختمانی از کارخانجات و معادن رسمی</h1>
            <p className="text-xs text-slate-600 font-medium mt-1 max-w-2xl leading-relaxed">
              خرید و استعلام بی‌واسطه کاشی و سرامیک، سنگ ساختمانی، میلگرد و فولاد، سیمان، گچ، لوله و اتصالات، شیشه و درب و پنجره با قیمت مصوب.
            </p>
          </div>

          <button
            onClick={() => onOpenMaterialQuoteModal()}
            className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white text-xs font-black px-5 py-3 rounded-2xl shadow-md transition-all shrink-0 cursor-pointer"
          >
            + استعلام قیمت عمومی پای‌کار
          </button>
        </div>
      </div>

      {/* Supplier Type Toggle & Radius Filter */}
      <div className="bg-white p-5 rounded-3xl border border-[#ded5c5] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-[#eee7db] pb-3.5">
          
          {/* Supplier Type Toggle */}
          <div className="flex flex-wrap items-center gap-1.5 bg-[#faf8f4] p-1.5 rounded-2xl w-full sm:w-auto border border-[#ded5c5]">
            <button
              onClick={() => setSupplierType('all')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                supplierType === 'all' ? 'bg-amber-500 text-white shadow-xs font-black' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              همه تامین‌کنندگان
            </button>

            <button
              onClick={() => setSupplierType('mine')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                supplierType === 'mine' ? 'bg-amber-500 text-white shadow-xs font-black' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Mountain className="w-3.5 h-3.5 text-amber-600" />
              <span>معدن‌دار / سینه کار</span>
            </button>

            <button
              onClick={() => setSupplierType('factory')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                supplierType === 'factory' ? 'bg-amber-500 text-white shadow-xs font-black' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Factory className="w-3.5 h-3.5 text-amber-600" />
              <span>کارخانه تولیدی</span>
            </button>

            <button
              onClick={() => setSupplierType('local')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                supplierType === 'local' ? 'bg-amber-500 text-white shadow-xs font-black' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Store className="w-3.5 h-3.5 text-amber-600" />
              <span>فروشگاه محلی</span>
            </button>
          </div>

          {/* Distance Slider */}
          <div className="flex items-center gap-3 w-full sm:w-72 bg-[#faf8f4] px-4 py-2.5 rounded-2xl border border-[#ded5c5]">
            <span className="text-[11px] font-bold text-slate-700 whitespace-nowrap">شعاع ارسال:</span>
            <input
              type="range"
              min={20}
              max={1000}
              step={20}
              value={maxDistance}
              onChange={(e) => setMaxDistance(Number(e.target.value))}
              className="flex-1 accent-amber-500 cursor-pointer"
            />
            <span className="text-xs font-black text-amber-900 font-mono w-16 text-left">
              {toPersianDigits(maxDistance)} کیلومتر
            </span>
          </div>
        </div>

        {/* Categories Carousel */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-xs font-black'
                : 'bg-[#faf8f4] text-slate-700 hover:text-slate-950 border border-[#ded5c5]'
            }`}
          >
            همه دسته‌ها
          </button>

          {categoriesList.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-xs font-black'
                  : 'bg-[#faf8f4] text-slate-700 hover:text-slate-950 border border-[#ded5c5]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Material Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredMaterials.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl border border-[#ded5c5] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
          >
            {/* Image & Badges */}
            <div className="relative h-48 bg-slate-100 overflow-hidden">
              <img
                src={item.images[0] || 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=700'}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              <div className="absolute top-3 right-3 flex flex-col gap-1">
                <span className="bg-white/90 backdrop-blur-sm text-slate-900 text-[10px] px-2.5 py-1 rounded-xl font-mono font-bold border border-slate-200">
                  {item.category}
                </span>
                {item.verifiedStatus === 'verified' && (
                  <span className="bg-emerald-600 text-white text-[10px] px-2 py-0.5 rounded-xl font-bold flex items-center gap-1 shadow-sm">
                    <ShieldCheck className="w-3 h-3" />
                    <span>تأییدشده رسمی</span>
                  </span>
                )}
              </div>

              <div className="absolute top-3 left-3 bg-amber-500 text-slate-950 text-[10px] font-black px-2.5 py-1 rounded-xl border border-amber-400">
                فاصله: {toPersianDigits(item.distanceKm)} کیلومتر
              </div>
            </div>

            {/* Content */}
            <div className="p-4.5 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-black text-sm text-slate-900 line-clamp-2 leading-snug">
                  {item.title}
                </h3>

                <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-2 font-bold">
                  {item.supplierType === 'mine' ? (
                    <Mountain className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  ) : item.supplierType === 'factory' ? (
                    <Factory className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  ) : (
                    <Store className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  )}
                  <span className="truncate">{item.supplierName}</span>
                </div>

                <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1 font-semibold">
                  <MapPin className="w-3 h-3 text-amber-600 shrink-0" />
                  <span>{item.location}</span>
                  <span className="text-slate-300">|</span>
                  <span>حداقل سفارش: {toPersianDigits(item.minOrder)} {item.unit}</span>
                </div>
              </div>

              {/* Price & Actions */}
              <div className="pt-3 border-t border-[#eee7db] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 block font-bold">قیمت واحد ({item.unit}):</span>
                  <span className="text-sm font-black text-slate-900 font-mono">
                    {formatToman(item.price)}
                  </span>
                </div>

                <button
                  onClick={() => onOpenMaterialQuoteModal(item)}
                  className="bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-black px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                >
                  <Send className="w-3 h-3 text-amber-700" />
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
