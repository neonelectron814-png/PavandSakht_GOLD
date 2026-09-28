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
    <div className="space-y-6 pb-12 text-[#1c1d22]">
      
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#ded5c5] space-y-3 relative overflow-hidden shadow-xs">
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-900 border border-rose-200 px-3.5 py-1 rounded-full text-xs font-black mb-2 shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />
              <span>پنل ارشد مدیریت و نظارت ثبتی پیوندساخت</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">مدیریت اعتبارسنجی اسناد، کاربران و کمیسیون</h1>
            <p className="text-xs text-slate-600 font-medium mt-1 max-w-xl">
              بررسی کارشناسی سند، استعلام ثبت، مدیریت گزارش‌های تخلف و تنظیمات حقوقی پلتفرم.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4.5 rounded-3xl border border-[#ded5c5] text-xs space-y-1 shadow-xs">
          <span className="text-[10px] text-slate-500 font-bold">فایل‌های نیازمند تأیید:</span>
          <p className="text-xl font-black text-amber-700">{toPersianDigits(pendingProperties.length)} فایل</p>
        </div>

        <div className="bg-white p-4.5 rounded-3xl border border-[#ded5c5] text-xs space-y-1 shadow-xs">
          <span className="text-[10px] text-slate-500 font-bold">فایل‌های فعال سالم:</span>
          <p className="text-xl font-black text-emerald-700">{toPersianDigits(verifiedProperties.length)} فایل</p>
        </div>

        <div className="bg-white p-4.5 rounded-3xl border border-[#ded5c5] text-xs space-y-1 shadow-xs">
          <span className="text-[10px] text-slate-500 font-bold">گزارش تخلف فعال:</span>
          <p className="text-xl font-black text-rose-600">{toPersianDigits(1)} مورد</p>
        </div>

        <div className="bg-white p-4.5 rounded-3xl border border-[#ded5c5] text-xs space-y-1 shadow-xs">
          <span className="text-[10px] text-slate-500 font-bold">نرخ کمیسیون مصوب:</span>
          <p className="text-xl font-black text-slate-900 font-mono">{toPersianDigits(commissionRate)}٪ درصد</p>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'pending'
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-xs font-black'
              : 'bg-white text-slate-700 hover:text-slate-950 border border-[#ded5c5]'
          }`}
        >
          در انتظار اعتبارسنجی ({toPersianDigits(pendingProperties.length)})
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'reports'
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-xs font-black'
              : 'bg-white text-slate-700 hover:text-slate-950 border border-[#ded5c5]'
          }`}
        >
          گزارش‌های تخلف و فایل فیک
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'settings'
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-xs font-black'
              : 'bg-white text-slate-700 hover:text-slate-950 border border-[#ded5c5]'
          }`}
        >
          تنظیمات نرخ و قوانین حقوقی
        </button>
      </div>

      {/* Content based on Tab */}
      {activeTab === 'pending' && (
        <div className="space-y-4">
          {pendingProperties.length === 0 ? (
            <div className="bg-white p-8 rounded-3xl border border-[#ded5c5] text-center text-xs text-slate-500 font-bold">
              هیچ فایلی در انتظار اعتبارسنجی وجود ندارد.
            </div>
          ) : (
            pendingProperties.map((p) => (
              <div key={p.id} className="bg-white p-5 rounded-3xl border border-[#ded5c5] shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#eee7db] pb-3">
                  <div>
                    <span className="text-[10px] bg-amber-50 text-amber-900 font-mono font-bold px-2.5 py-0.5 rounded-md border border-amber-300">
                      {p.code}
                    </span>
                    <h3 className="font-black text-sm text-slate-900 mt-1">{p.title}</h3>
                  </div>
                  <span className="text-sm font-black text-slate-900">{formatTomanShort(p.price)}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-[#faf8f4] p-3.5 rounded-2xl border border-[#ded5c5]">
                  <div>
                    <span className="text-slate-500 block font-bold">مالک:</span>
                    <span className="font-black text-slate-900">{p.ownerName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block font-bold">نوع سند:</span>
                    <span className="font-black text-slate-900">{p.documentType || 'سند تک‌برگ'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block font-bold">موقعیت:</span>
                    <span className="font-black text-slate-900">{p.city} - {p.district}</span>
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-1">
                  <button
                    onClick={() => onRejectProperty(p.id)}
                    className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors border border-rose-300 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                    <span>رد و اخطار نقص مدرک</span>
                  </button>

                  <button
                    onClick={() => onVerifyProperty(p.id)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>تأیید و الصاق نشان اعتبارسنجی</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="bg-white p-6 rounded-3xl border border-[#ded5c5] shadow-xs space-y-4">
          <h3 className="text-sm font-black text-slate-900 border-b border-[#eee7db] pb-3">تنظیمات حقوقی و کمیسیون</h3>
          <div className="max-w-md space-y-3 text-xs">
            <label className="block text-slate-700 font-bold">درصد کمیسیون مصوب سامانه:</label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                step="0.1"
                value={commissionRate}
                onChange={(e) => setCommissionRate(Number(e.target.value))}
                className="w-32 bg-white border border-[#ded5c5] rounded-xl px-3.5 py-2.5 font-bold text-slate-900 focus:outline-none focus:border-amber-500"
              />
              <span className="font-bold text-slate-600">درصد (قانونی)</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
