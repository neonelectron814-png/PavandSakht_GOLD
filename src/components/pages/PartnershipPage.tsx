import React from 'react';
import { Handshake, Building2, ShieldCheck, CheckCircle2, MapPin, FileCheck, ArrowLeft, Sparkles } from 'lucide-react';
import { mockPartnerships } from '../../data/mockData';
import { toPersianDigits } from '../../utils/formatters';

interface PartnershipPageProps {
  onOpenPartnershipModal: () => void;
}

export const PartnershipPage: React.FC<PartnershipPageProps> = ({ onOpenPartnershipModal }) => {
  return (
    <div className="space-y-6 pb-12 text-[#1c1d22]">
      
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#ded5c5] space-y-3 relative overflow-hidden shadow-xs">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-purple-50 text-purple-900 border border-purple-200 px-3.5 py-1 rounded-full text-xs font-black mb-2 shadow-xs">
              <Handshake className="w-3.5 h-3.5 text-purple-600" />
              <span>پلتفرم تخصصی مشارکت در ساخت</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">مشارکت در ساخت زمین و پروژه‌های ساختمانی</h1>
            <p className="text-xs text-slate-600 font-medium mt-1 max-w-xl">
              اتصال مستقیم مالکین زمین به سازندگان رتبه ۱ کشوری با تعیین نسبت‌های منصفانه (۵۰-۵۰، ۶۰-۴۰) و ضمانت‌های حقوقی و بلاعوض.
            </p>
          </div>

          <button
            onClick={onOpenPartnershipModal}
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-black px-5 py-3 rounded-2xl shadow-md transition-all shrink-0 cursor-pointer"
          >
            + ثبت زمین جهت مشارکت
          </button>
        </div>
      </div>

      {/* Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {mockPartnerships.map((item) => (
          <div key={item.id} className="bg-white p-5 sm:p-6 rounded-3xl border border-[#ded5c5] shadow-xs space-y-4 flex flex-col justify-between hover:shadow-md transition-all">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] bg-purple-50 text-purple-900 font-black px-3 py-1 rounded-full border border-purple-200">
                  پروژه مشارکت زمین
                </span>
                <span className="text-xs bg-emerald-50 text-emerald-800 font-bold px-2.5 py-1 rounded-xl border border-emerald-300 flex items-center gap-1 shadow-2xs">
                  <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>دستور نقشه دارد</span>
                </span>
              </div>

              <h3 className="font-black text-sm text-slate-900">{item.title}</h3>
              
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold">
                <MapPin className="w-3.5 h-3.5 text-amber-600" />
                <span>موقعیت: {item.location}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-[#faf8f4] p-3.5 rounded-2xl text-xs border border-[#ded5c5]">
              <div>
                <span className="text-[10px] text-slate-500 block font-bold">متراژ زمین:</span>
                <span className="font-black text-slate-900 text-sm">{toPersianDigits(item.landArea)} متر مربع</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block font-bold">نسبت پیشنهادی (مالک - سازنده):</span>
                <span className="font-black text-amber-900 text-sm font-mono">{toPersianDigits(item.proposedRatio)}٪</span>
              </div>
            </div>

            <div className="bg-[#faf8f4] border border-[#ded5c5] p-3 rounded-2xl text-xs space-y-1">
              <span className="font-bold text-[10px] text-slate-500 block">شرایط و نیازمندی‌های سازنده:</span>
              <p className="text-slate-800 leading-relaxed text-[11px] font-medium">{item.builderRequirements}</p>
            </div>

            <button
              onClick={() => alert(`درخواست رزومه و رزرو جلسه مشارکت برای "${item.title}" ثبت شد.`)}
              className="w-full bg-amber-50 hover:bg-amber-100 text-amber-900 font-black py-3 rounded-2xl text-xs flex items-center justify-center gap-2 transition-all border border-amber-300 cursor-pointer shadow-2xs"
            >
              <Handshake className="w-4 h-4 text-amber-700" />
              <span>ارسال پیشنهاد رزومه و ورود به اتاق جلسه</span>
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};
