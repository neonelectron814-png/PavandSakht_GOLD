import React, { useState } from 'react';
import { HardHat, Star, Phone, CheckCircle2, MapPin, Briefcase, Sparkles } from 'lucide-react';
import { mockCraftsmen } from '../../data/mockData';
import { formatTomanShort, toPersianDigits } from '../../utils/formatters';

export const CraftsmenPage: React.FC = () => {
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');

  const filteredCraftsmen = mockCraftsmen.filter((c) => {
    if (selectedSpecialty === 'all') return true;
    return c.specialty.includes(selectedSpecialty);
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Banner */}
      <div className="glass-card text-white p-6 sm:p-7 rounded-3xl border border-amber-500/30 space-y-3 relative overflow-hidden shadow-glass-3d">
        <div className="absolute top-0 -left-10 w-80 h-80 ambient-glow-amber rounded-full pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 glass-amber text-amber-300 border border-amber-400/40 px-3.5 py-1 rounded-full text-xs font-black mb-2 shadow-sm">
            <HardHat className="w-3.5 h-3.5" />
            <span>بانک اطلاعات استادکاران اعتبارسنجی‌شده</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white">خدمات استادکاران و پیمانکاران اجرایی</h1>
          <p className="text-xs text-slate-300 font-light mt-1 max-w-xl">
            دسترسی مستقیم به برترین استادکاران سفت‌کاری، برق‌کاری، آرماتوربندی و فینیشینگ همراه با نرخ روزانه و نمونه کارهای واقعی.
          </p>
        </div>
      </div>

      {/* Specialty Filter Bar */}
      <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
        <button
          onClick={() => setSelectedSpecialty('all')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold shrink-0 transition-all card-3d-tilt ${
            selectedSpecialty === 'all' ? 'glass-panel-dark text-white border border-white/30 shadow-glass-3d' : 'glass-card text-slate-300 hover:text-white border border-white/10'
          }`}
        >
          همه تخصص‌ها
        </button>
        {['آرماتوربندی', 'برق‌کاری', 'کاشی‌کاری', 'بنایی', 'لوله‌کشی'].map((spec) => (
          <button
            key={spec}
            onClick={() => setSelectedSpecialty(spec)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold shrink-0 transition-all card-3d-tilt ${
              selectedSpecialty === spec ? 'glass-amber text-amber-300 font-black border border-amber-400/50 shadow-glass-3d' : 'glass-card text-slate-300 hover:text-white border border-white/10'
            }`}
          >
            {spec}
          </button>
        ))}
      </div>

      {/* Craftsmen Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCraftsmen.map((c) => (
          <div key={c.id} className="glass-card p-5 sm:p-6 rounded-3xl border border-white/15 shadow-glass-3d space-y-4 flex flex-col justify-between card-3d-tilt">
            <div className="space-y-3.5">
              <div className="flex items-center gap-3.5">
                <img
                  src={c.avatar}
                  alt={c.name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-400/70 shrink-0 shadow-md"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-extrabold text-sm text-white">{c.name}</h3>
                    {c.verifiedBadge && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                  </div>
                  <span className="text-[11px] text-amber-300 font-bold glass-amber px-2.5 py-0.5 rounded-lg mt-1 inline-block border border-amber-400/30">
                    {c.specialty}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed line-clamp-2 font-light">{c.bio}</p>

              <div className="grid grid-cols-2 gap-2 glass-panel-dark p-3 rounded-2xl text-xs text-slate-300 border border-white/10">
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">دستمزد روزانه:</span>
                  <span className="font-black text-white">{formatTomanShort(c.dailyRate)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">پروژه‌های انجام‌شده:</span>
                  <span className="font-black text-amber-400">{toPersianDigits(c.projectsDone)} پروژه</span>
                </div>
              </div>

              {/* Portfolio thumbnail images */}
              {c.portfolioImages.length > 0 && (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {c.portfolioImages.map((img, idx) => (
                    <img key={idx} src={img} alt="نمونه کار" className="w-full h-20 object-cover rounded-2xl border border-white/15 shadow-sm" />
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => alert(`شماره تماس استادکار: ${c.phone}\nآماده اعزام جهت بازدید و قیمت‌گذاری پروژه.`)}
              className="w-full mt-2 glass-amber hover:brightness-110 text-amber-300 font-black py-3 rounded-2xl text-xs flex items-center justify-center gap-2 transition-all border border-amber-400/40 active:scale-95 cursor-pointer shadow-sm"
            >
              <Phone className="w-4 h-4 text-amber-400" />
              <span>تماس و هماهنگی مجری</span>
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};
