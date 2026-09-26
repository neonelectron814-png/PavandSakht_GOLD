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
    <div className="space-y-6 pb-12">
      
      {/* Header Banner */}
      <div className="glass-card text-white p-6 sm:p-7 rounded-3xl border border-emerald-500/30 space-y-3 relative overflow-hidden shadow-glass-3d">
        <div className="absolute top-0 -left-10 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 -right-10 w-64 h-64 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 glass-emerald text-emerald-200 border border-emerald-400/40 px-3.5 py-1 rounded-full text-xs font-black mb-2 shadow-sm">
              <Mountain className="w-3.5 h-3.5 text-amber-400" />
              <span>پایانه معادن، مصالح ساختمانی و مواد اولیه پیوند ساخت</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">تأمین مستقیم از سینه کار معدن و کارخانه</h1>
            <p className="text-xs text-slate-300 font-light mt-1 max-w-2xl leading-relaxed">
              اتصال بی‌واسطه به معادن سنگ کوپ، پوکه معدنی، سیلیس، کارخانجات سیمان و مقاطع فولادی با محاسبه کرایه حمل و شعاع تحویل پای کارگاه.
            </p>
          </div>

          <button
            onClick={() => onOpenMaterialQuoteModal()}
            className="btn-3d-emerald text-white text-xs font-black px-5 py-3 rounded-2xl shadow-lg transition-all shrink-0 cursor-pointer border border-emerald-300/40"
          >
            + استعلام قیمت عمومی پای‌کار
          </button>
        </div>
      </div>

      {/* Supplier Type Toggle & Radius Filter */}
      <div className="glass-card p-5 rounded-3xl border border-white/15 shadow-glass-3d space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-white/10 pb-3.5">
          
          {/* Supplier Type Toggle */}
          <div className="flex flex-wrap items-center gap-1.5 glass-panel-dark p-1.5 rounded-2xl w-full sm:w-auto border border-white/10">
            <button
              onClick={() => setSupplierType('all')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                supplierType === 'all' ? 'glass-panel-dark text-white border border-white/30 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              همه تامین‌کنندگان
            </button>

            <button
              onClick={() => setSupplierType('mine')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                supplierType === 'mine' ? 'glass-amber text-amber-300 border border-amber-400/50 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Mountain className="w-3.5 h-3.5 text-amber-400" />
              <span>معدن‌دار / سینه کار</span>
            </button>

            <button
              onClick={() => setSupplierType('factory')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                supplierType === 'factory' ? 'glass-emerald text-emerald-200 border border-emerald-400/40 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Factory className="w-3.5 h-3.5" />
              <span>کارخانه تولیدی</span>
            </button>

            <button
              onClick={() => setSupplierType('local')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                supplierType === 'local' ? 'glass-blue text-blue-200 border border-blue-400/40 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>فروشنده محلی</span>
            </button>
          </div>

          {/* Distance Radius Range Slider */}
          <div className="flex items-center gap-3 w-full sm:w-auto text-xs">
            <span className="text-slate-300 font-bold shrink-0">شعاع تحویل پروژه:</span>
            <input
              type="range"
              min={10}
              max={600}
              step={20}
              value={maxDistance}
              onChange={(e) => setMaxDistance(Number(e.target.value))}
              className="w-32 accent-amber-400 cursor-pointer"
            />
            <span className="font-black text-amber-400 font-mono w-20">{toPersianDigits(maxDistance)} کیلومتر</span>
          </div>

        </div>

        {/* Categories Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth touch-pan-x pt-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
              selectedCategory === 'all' ? 'glass-panel-dark text-white border border-white/30' : 'glass-card text-slate-300 hover:text-white border border-white/10'
            }`}
          >
            همه دسته‌ها
          </button>
          {categoriesList.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                selectedCategory === cat ? 'glass-emerald text-emerald-200 border border-emerald-400/40' : 'glass-card text-slate-300 hover:text-white border border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Material Product Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredMaterials.map((product) => (
          <div
            key={product.id}
            className="glass-card rounded-3xl border border-white/15 overflow-hidden shadow-glass-3d card-3d-tilt flex flex-col justify-between group"
          >
            {/* Image */}
            <div className="relative h-48 bg-slate-950 overflow-hidden group">
              <img
                src={product.images[0]}
                alt={product.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              <span className="absolute top-3 right-3 glass-panel-dark text-white text-[10px] px-2.5 py-1 rounded-xl font-mono font-bold border border-white/20">
                {product.code}
              </span>

              <span className={`absolute top-3 left-3 text-[10px] px-3 py-1 rounded-xl font-black shadow-md border ${
                product.supplierType === 'mine'
                  ? 'glass-amber text-amber-200 border-amber-400/50'
                  : product.supplierType === 'factory' 
                    ? 'glass-emerald text-emerald-200 border-emerald-400/40' 
                    : 'glass-blue text-blue-200 border-blue-400/40'
              }`}>
                {product.supplierType === 'mine' ? 'سینه کار معدن' : product.supplierType === 'factory' ? 'تولیدکننده کارخانه' : 'فروشنده محلی'}
              </span>
            </div>

            {/* Info */}
            <div className="p-4.5 space-y-3.5 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
                  <span className="font-bold text-emerald-300">{product.supplierName}</span>
                  <div className="flex items-center gap-1 text-slate-400 font-mono">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span>فاصله: {toPersianDigits(product.distanceKm)} ک‌م</span>
                  </div>
                </div>

                <h3 className="font-extrabold text-sm text-white line-clamp-2 leading-snug">{product.title}</h3>
              </div>

              {/* Mine details pill if available */}
              {product.mineDetails && (
                <div className="glass-panel-dark border border-amber-400/30 p-2.5 rounded-2xl text-[11px] text-amber-200 space-y-1">
                  <div className="flex items-center justify-between font-bold">
                    <span className="flex items-center gap-1">
                      <Mountain className="w-3.5 h-3.5 text-amber-400" />
                      {product.mineDetails.mineName || product.mineDetails.quarryName || 'معدن و سینه کار'}
                    </span>
                    {product.mineDetails.grade && (
                      <span className="text-[10px] glass-amber px-2 py-0.5 rounded text-amber-300 font-mono">
                        عیار/گرید: {product.mineDetails.grade}
                      </span>
                    )}
                    {product.mineDetails.assayPurityPercent && (
                      <span className="text-[10px] glass-emerald px-2 py-0.5 rounded text-emerald-300 font-mono">
                        خلوص: {toPersianDigits(product.mineDetails.assayPurityPercent)}٪
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-300 font-light">
                    ظرفیت استخراج: {toPersianDigits(product.mineDetails.monthlyCapacityTons || product.mineDetails.monthlyExtractionTons || 0)} تن ماهیانه
                    {product.mineDetails.licenseNumber ? ` | پروانه: ${product.mineDetails.licenseNumber}` : ''}
                  </p>
                </div>
              )}

              {/* Spec sheet */}
              {product.specSheet && (
                <div className="glass-panel-dark border border-white/10 p-2.5 rounded-2xl text-[11px] text-slate-300 flex items-start gap-2">
                  <FileText className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span className="line-clamp-2">{product.specSheet}</span>
                </div>
              )}

              {/* Price & Unit */}
              <div className="pt-2 flex items-center justify-between border-t border-white/10 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">قیمت واحد ({product.unit}):</span>
                  <span className="text-sm font-black text-amber-400">{formatTomanShort(product.price)}</span>
                </div>
                <div className="text-left">
                  <span className="text-[10px] text-slate-400 block">حداقل سفارش:</span>
                  <span className="text-xs font-black text-white font-mono">{toPersianDigits(product.minOrder)} {product.unit}</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onOpenMaterialQuoteModal(product)}
                className="w-full btn-3d-emerald text-white font-black py-3 rounded-2xl text-xs flex items-center justify-center gap-2 cursor-pointer border border-emerald-300/40"
              >
                <Send className="w-3.5 h-3.5" />
                <span>درخواست پیش‌فاکتور و استعلام قیمت</span>
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
