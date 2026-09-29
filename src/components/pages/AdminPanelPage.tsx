import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Check, 
  X, 
  AlertOctagon, 
  Settings, 
  Users, 
  Building2, 
  FileText, 
  DollarSign,
  Search,
  Sparkles
} from 'lucide-react';
import { Property } from '../../types';
import { formatTomanShort, toPersianDigits } from '../../utils/formatters';

interface AdminPanelPageProps {
  properties: Property[];
  onVerifyProperty: (id: string) => void;
  onRejectProperty: (id: string) => void;
}

export const AdminPanelPage: React.FC<AdminPanelPageProps> = ({
  properties,
  onVerifyProperty,
  onRejectProperty,
}) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'verified' | 'reports' | 'settings'>('pending');
  const [commissionRate, setCommissionRate] = useState<number>(0.5);

  const pendingProperties = properties.filter((p) => p.verifiedStatus === 'pending');
  const verifiedProperties = properties.filter((p) => p.verifiedStatus === 'verified');

  return (
    <div className="space-y-6 pb-12 text-[#1c1d22]" dir="rtl">
      
      {/* Header Banner (Full Framed 3D Gold Box) */}
      <div className="bg-white p-5 sm:p-6 rounded-[28px] border-2 border-[#dfc282] space-y-3 relative overflow-hidden shadow-[0_4px_16px_rgba(180,130,40,0.1)]">
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 btn-3d-gold text-[#2c1b04] px-3.5 py-1 rounded-xl text-xs font-black mb-2 shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-emerald-800 stroke-[2.5]" />
              <span>پنل ارشد مدیریت و نظارت ثبتی پیوندساخت</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-950">مدیریت اعتبارسنجی اسناد، کاربران و کمیسیون</h1>
            <p className="text-[15px] text-slate-700 font-bold mt-1 max-w-xl leading-relaxed">
              بررسی کارشناسی سند، استعلام ثبت، مدیریت گزارش‌های تخلف و تنظیمات حقوقی پلتفرم.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4.5 rounded-[24px] border-2 border-[#dfc282] space-y-1 shadow-[0_4px_16px_rgba(180,130,40,0.08)]">
          <span className="text-xs text-slate-600 font-bold">فایل‌های نیازمند تأیید:</span>
          <p className="text-xl font-black text-amber-900">{toPersianDigits(pendingProperties.length)} فایل</p>
        </div>

        <div className="bg-white p-4.5 rounded-[24px] border-2 border-[#dfc282] space-y-1 shadow-[0_4px_16px_rgba(180,130,40,0.08)]">
          <span className="text-xs text-slate-600 font-bold">فایل‌های فعال سالم:</span>
          <p className="text-xl font-black text-emerald-800">{toPersianDigits(verifiedProperties.length)} فایل</p>
        </div>

        <div className="bg-white p-4.5 rounded-[24px] border-2 border-[#dfc282] space-y-1 shadow-[0_4px_16px_rgba(180,130,40,0.08)]">
          <span className="text-xs text-slate-600 font-bold">گزارش تخلف فعال:</span>
          <p className="text-xl font-black text-rose-700">{toPersianDigits(1)} مورد</p>
        </div>

        <div className="bg-white p-4.5 rounded-[24px] border-2 border-[#dfc282] space-y-1 shadow-[0_4px_16px_rgba(180,130,40,0.08)]">
          <span className="text-xs text-slate-600 font-bold">نرخ کمیسیون مصوب:</span>
          <p className="text-xl font-black text-slate-950 font-mono">{toPersianDigits(commissionRate)}٪ درصد</p>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
        <button
          onClick={() => setActiveTab('pending')}
          className={`h-9 px-4 rounded-xl text-[15px] font-black shrink-0 transition-all cursor-pointer flex items-center justify-center active:scale-95 ${
            activeTab === 'pending'
              ? 'btn-3d-gold text-[#2c1b04] shadow-2xs'
              : 'bg-white text-slate-800 hover:bg-amber-50/60 border-2 border-[#dfc282] shadow-2xs'
          }`}
        >
          در انتظار اعتبارسنجی ({toPersianDigits(pendingProperties.length)})
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`h-9 px-4 rounded-xl text-[15px] font-black shrink-0 transition-all cursor-pointer flex items-center justify-center active:scale-95 ${
            activeTab === 'reports'
              ? 'btn-3d-gold text-[#2c1b04] shadow-2xs'
              : 'bg-white text-slate-800 hover:bg-amber-50/60 border-2 border-[#dfc282] shadow-2xs'
          }`}
        >
          گزارش‌های تخلف و فایل فیک
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`h-9 px-4 rounded-xl text-[15px] font-black shrink-0 transition-all cursor-pointer flex items-center justify-center active:scale-95 ${
            activeTab === 'settings'
              ? 'btn-3d-gold text-[#2c1b04] shadow-2xs'
              : 'bg-white text-slate-800 hover:bg-amber-50/60 border-2 border-[#dfc282] shadow-2xs'
          }`}
        >
          تنظیمات نرخ و قوانین حقوقی
        </button>
      </div>

      {/* Content based on Tab */}
      {activeTab === 'pending' && (
        <div className="space-y-4">
          {pendingProperties.length === 0 ? (
            <div className="bg-white p-8 rounded-[28px] border-2 border-[#dfc282] text-center text-[15px] text-slate-600 font-bold shadow-[0_4px_16px_rgba(180,130,40,0.08)]">
              هیچ فایلی در انتظار اعتبارسنجی وجود ندارد.
            </div>
          ) : (
            pendingProperties.map((p) => (
              <div key={p.id} className="bg-white p-5 sm:p-6 rounded-[28px] border-2 border-[#dfc282] shadow-[0_4px_16px_rgba(180,130,40,0.1)] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#eee7db] pb-3">
                  <div>
                    <span className="text-xs bg-[#faf8f4] text-slate-900 font-mono font-bold px-2.5 py-0.5 rounded-lg border border-[#e6dfd3]">
                      {p.code}
                    </span>
                    <h3 className="font-black text-base text-slate-950 mt-1">{p.title}</h3>
                  </div>
                  <span className="text-[15px] font-black text-amber-950 font-mono">{formatTomanShort(p.price)} تومان</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-[#faf8f4] p-3.5 rounded-2xl border-2 border-[#e6dfd3]">
                  <div>
                    <span className="text-slate-600 block font-bold text-xs">مالک:</span>
                    <span className="font-black text-slate-950 text-[15px]">{p.ownerName}</span>
                  </div>
                  <div>
                    <span className="text-slate-600 block font-bold text-xs">نوع سند:</span>
                    <span className="font-black text-slate-950 text-[15px]">{p.documentType || 'سند تک‌برگ'}</span>
                  </div>
                  <div>
                    <span className="text-slate-600 block font-bold text-xs">موقعیت:</span>
                    <span className="font-black text-slate-950 text-[15px]">{p.city} - {p.district}</span>
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-1">
                  <button
                    onClick={() => onRejectProperty(p.id)}
                    className="h-9 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 font-black text-[15px] flex items-center gap-1.5 transition-colors border-2 border-rose-300 cursor-pointer shadow-2xs active:scale-95"
                  >
                    <X className="w-4 h-4 stroke-[2.5]" />
                    <span>رد و اخطار نقص مدرک</span>
                  </button>

                  <button
                    onClick={() => onVerifyProperty(p.id)}
                    className="h-9 px-4.5 btn-3d-gold text-[#2c1b04] font-black text-[15px] rounded-xl flex items-center gap-1.5 transition-transform shadow-2xs cursor-pointer active:scale-95"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>تأیید و الصاق نشان اعتبارسنجی</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="bg-white p-6 rounded-[28px] border-2 border-[#dfc282] shadow-[0_4px_16px_rgba(180,130,40,0.1)] space-y-4">
          <h3 className="text-base font-black text-slate-950 border-b border-[#eee7db] pb-3">تنظیمات حقوقی و کمیسیون</h3>
          <div className="max-w-md space-y-3 text-xs">
            <label className="block text-slate-800 font-black text-[15px]">درصد کمیسیون مصوب سامانه:</label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                step="0.1"
                value={commissionRate}
                onChange={(e) => setCommissionRate(Number(e.target.value))}
                className="w-32 bg-white border-2 border-[#dfc282] focus:border-[#caa758] rounded-xl px-3.5 py-2 font-black text-slate-950 text-[15px] focus:outline-none shadow-2xs"
              />
              <span className="font-black text-[15px] text-slate-700">درصد (قانونی)</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
