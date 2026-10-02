import React from 'react';
import { Handshake, MapPin, FileCheck, PlusCircle } from 'lucide-react';
import { mockPartnerships } from '../../data/mockData';
import { toPersianDigits } from '../../utils/formatters';

interface PartnershipPageProps {
  onOpenPartnershipModal: () => void;
}

export const PartnershipPage: React.FC<PartnershipPageProps> = ({ onOpenPartnershipModal }) => {
  return (
    <div className="space-y-6 pb-12 text-[#1c1d22]">
      {/* Header Banner Card (Full Framed 3D Gold Box) */}
      <div className="bg-white p-5 sm:p-6 rounded-[28px] border-2 border-[#dfc282] space-y-3 relative overflow-hidden shadow-[0_4px_16px_rgba(180,130,40,0.1)]">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 btn-3d-gold text-[#2c1b04] px-3.5 py-1 rounded-xl text-xs font-black mb-2 shadow-2xs">
              <Handshake className="w-4 h-4 stroke-[2.5]" />
              <span>پلتفرم تخصصی مشارکت در ساخت</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-950">
              مشارکت در ساخت زمین و پروژه‌های ساختمانی
            </h1>
            <p className="text-[15px] text-slate-700 font-bold mt-1 max-w-xl leading-relaxed">
              اتصال مستقیم مالکین زمین به سازندگان رتبه ۱ کشوری با تعیین نسبت‌های منصفانه (۵۰-۵۰، ۶۰-۴۰) و ضمانت‌های حقوقی و بلاعوض.
            </p>
          </div>

          <button
            onClick={onOpenPartnershipModal}
            className="h-10 px-4.5 btn-3d-gold text-[#2c1b04] text-[15px] font-black rounded-xl shadow-2xs transition-all active:scale-95 shrink-0 cursor-pointer flex items-center gap-2"
          >
            <PlusCircle className="w-4.5 h-4.5 stroke-[2.5]" />
            <span>ثبت زمین جهت مشارکت</span>
          </button>
        </div>
      </div>

      {/* Cards List */}
      {mockPartnerships.length === 0 ? (
        <div className="bg-white rounded-[28px] p-10 text-center space-y-3 border-2 border-[#dfc282] shadow-[0_4px_16px_rgba(180,130,40,0.1)]">
          <p className="text-slate-950 text-base font-black">هنوز پروژه مشارکتی در این بخش ثبت نشده است.</p>
          <p className="text-[14px] text-slate-600 font-bold">مالکین و سازندگان محترم می‌توانند از طریق دکمه فوق نسبت به ثبت اولین پروژه اقدام نمایند.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {mockPartnerships.map((item) => (
            <div
              key={item.id}
              className="bg-white p-5 sm:p-6 rounded-[28px] border-2 border-[#dfc282] shadow-[0_4px_16px_rgba(180,130,40,0.1)] space-y-4 flex flex-col justify-between hover:shadow-xl transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs bg-amber-50 text-amber-950 font-black px-3 py-1 rounded-full border border-amber-300">
                    پروژه مشارکت زمین
                  </span>
                  <span className="text-xs bg-emerald-50 text-emerald-950 font-bold px-2.5 py-1 rounded-xl border border-emerald-300 flex items-center gap-1 shadow-2xs">
                    <FileCheck className="w-4 h-4 text-emerald-700" />
                    <span>دستور نقشه دارد</span>
                  </span>
                </div>

                <h3 className="font-black text-base sm:text-lg text-slate-950">{item.title}</h3>
                
                <div className="flex items-center gap-1.5 text-xs text-slate-600 font-bold">
                  <MapPin className="w-4 h-4 text-amber-800" />
                  <span>موقعیت: {item.location}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-[#faf8f4] p-3.5 rounded-2xl text-xs border-2 border-[#e6dfd3]">
                <div>
                  <span className="text-xs text-slate-600 block font-bold">متراژ زمین:</span>
                  <span className="font-black text-slate-950 text-[15px]">{toPersianDigits(item.landArea)} متر مربع</span>
                </div>
                <div>
                  <span className="text-xs text-slate-600 block font-bold">نسبت پیشنهادی:</span>
                  <span className="font-black text-amber-950 text-[15px] font-mono">{toPersianDigits(item.proposedRatio)}٪</span>
                </div>
              </div>

              <div className="bg-[#faf8f4] border-2 border-[#e6dfd3] p-3.5 rounded-2xl text-xs space-y-1">
                <span className="font-bold text-xs text-slate-600 block">شرایط و نیازمندی‌های سازنده:</span>
                <p className="text-slate-900 leading-relaxed text-xs sm:text-[13px] font-bold">{item.builderRequirements}</p>
              </div>

              <div className="pt-2">
                <button
                  onClick={onOpenPartnershipModal}
                  className="w-full h-10 btn-3d-gold text-[#2c1b04] font-black text-[15px] rounded-xl flex items-center justify-center gap-2 shadow-2xs active:scale-95 transition-transform cursor-pointer"
                >
                  <span>ارسال رزومه و درخواست شراکت</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
