import React from 'react';
import { Handshake, Building2, ShieldCheck, CheckCircle2, MapPin, FileCheck, ArrowLeft, Sparkles } from 'lucide-react';
import { mockPartnerships } from '../../data/mockData';
import { toPersianDigits } from '../../utils/formatters';

interface PartnershipPageProps {
  onOpenPartnershipModal: () => void;
}

export const PartnershipPage: React.FC<PartnershipPageProps> = ({ onOpenPartnershipModal }) => {
  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Banner */}
      <div className="glass-card text-white p-6 sm:p-7 rounded-3xl border border-purple-500/30 space-y-3 relative overflow-hidden shadow-glass-3d">
        <div className="absolute top-0 -left-10 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 glass-purple text-purple-200 border border-purple-400/40 px-3.5 py-1 rounded-full text-xs font-black mb-2 shadow-sm">
              <Handshake className="w-3.5 h-3.5" />
              <span>پلتفرم تخصصی مشارکت در ساخت</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">مشارکت در ساخت زمین و پروژه‌های ساختمانی</h1>
            <p className="text-xs text-slate-300 font-light mt-1 max-w-xl">
              اتصال مستقیم مالکین زمین به سازندگان رتبه ۱ کشوری با تعیین نسبت‌های منصفانه (۵۰-۵۰، ۶۰-۴۰) و ضمانت‌های حقوقی و بلاعوض.
            </p>
          </div>

          <button
            onClick={onOpenPartnershipModal}
            className="btn-3d-amber text-slate-950 text-xs font-black px-5 py-3 rounded-2xl shadow-lg transition-all shrink-0 cursor-pointer border border-amber-300/50"
          >
            + ثبت زمین جهت مشارکت
          </button>
        </div>
      </div>

      {/* Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {mockPartnerships.map((item) => (
          <div key={item.id} className="glass-card p-5 sm:p-6 rounded-3xl border border-white/15 shadow-glass-3d space-y-4 flex flex-col justify-between card-3d-tilt">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] glass-purple text-purple-200 font-black px-3 py-1 rounded-full border border-purple-400/40">
                  پروژه مشارکت زمین
                </span>
                <span className="text-xs glass-emerald text-emerald-200 font-bold px-2.5 py-1 rounded-xl border border-emerald-400/40 flex items-center gap-1 shadow-sm">
                  <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>دستور نقشه دارد</span>
                </span>
              </div>

              <h3 className="font-extrabold text-sm text-white">{item.title}</h3>
              
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>موقعیت: {item.location}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 glass-panel-dark p-3.5 rounded-2xl text-xs border border-white/10">
              <div>
                <span className="text-[10px] text-slate-400 block">متراژ زمین:</span>
                <span className="font-black text-white text-sm">{toPersianDigits(item.landArea)} متر مربع</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">نسبت پیشنهادی (مالک - سازنده):</span>
                <span className="font-black text-amber-400 text-sm font-mono">{toPersianDigits(item.proposedRatio)}٪</span>
              </div>
            </div>

            <div className="glass-panel-dark border border-white/10 p-3 rounded-2xl text-xs space-y-1">
              <span className="font-bold text-[10px] text-slate-400 block">شرایط و نیازمندی‌های سازنده:</span>
              <p className="text-slate-200 leading-relaxed text-[11px] font-light">{item.builderRequirements}</p>
            </div>

            <button
              onClick={() => alert(`درخواست رزومه و رزرو جلسه مشارکت برای "${item.title}" ثبت شد.`)}
              className="w-full glass-amber hover:brightness-110 text-amber-300 font-black py-3 rounded-2xl text-xs flex items-center justify-center gap-2 transition-all border border-amber-400/40 active:scale-95 cursor-pointer shadow-sm"
            >
              <Handshake className="w-4 h-4 text-amber-400" />
              <span>ارسال پیشنهاد رزومه و ورود به اتاق جلسه</span>
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};
