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
    <div className="space-y-6 pb-12">
      
      {/* Header Banner */}
      <div className="glass-card text-white p-6 sm:p-7 rounded-3xl border border-rose-500/30 space-y-3 relative overflow-hidden shadow-glass-3d">
        <div className="absolute top-0 -left-10 w-80 h-80 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 glass-rose text-rose-200 border border-rose-400/40 px-3.5 py-1 rounded-full text-xs font-black mb-2 shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>پنل ارشد مدیریت و نظارت ثبتی پیوند ساخت</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">مدیریت اعتبارسنجی اسناد، کاربران و کمیسیون</h1>
            <p className="text-xs text-slate-300 font-light mt-1 max-w-xl">
              بررسی کارشناسی سند، استعلام ثبت، مدیریت گزارش‌های تخلف و تنظیمات حقوقی پلتفرم.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Summary 3D Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card p-4.5 rounded-3xl border border-white/15 text-xs space-y-1 shadow-glass-3d card-3d-tilt">
          <span className="text-[10px] text-slate-400 font-medium">فایل‌های نیازمند تأیید:</span>
          <p className="text-xl font-black text-amber-400">{toPersianDigits(pendingProperties.length)} فایل</p>
        </div>

        <div className="glass-card p-4.5 rounded-3xl border border-white/15 text-xs space-y-1 shadow-glass-3d card-3d-tilt">
          <span className="text-[10px] text-slate-400 font-medium">فایل‌های فعال سالم:</span>
          <p className="text-xl font-black text-emerald-400">{toPersianDigits(verifiedProperties.length)} فایل</p>
        </div>

        <div className="glass-card p-4.5 rounded-3xl border border-white/15 text-xs space-y-1 shadow-glass-3d card-3d-tilt">
          <span className="text-[10px] text-slate-400 font-medium">گزارش تخلف فعال:</span>
          <p className="text-xl font-black text-rose-400">{toPersianDigits(1)} مورد</p>
        </div>

        <div className="glass-card p-4.5 rounded-3xl border border-white/15 text-xs space-y-1 shadow-glass-3d card-3d-tilt">
          <span className="text-[10px] text-slate-400 font-medium">نرخ کمیسیون مصوب:</span>
          <p className="text-xl font-black text-white font-mono">{toPersianDigits(commissionRate)}٪ درصد</p>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all card-3d-tilt ${
            activeTab === 'pending' ? 'glass-amber text-amber-300 border border-amber-400/50 shadow-glass-3d' : 'glass-card text-slate-300 hover:text-white border border-white/10'
          }`}
        >
          در انتظار اعتبارسنجی ({toPersianDigits(pendingProperties.length)})
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all card-3d-tilt ${
            activeTab === 'reports' ? 'glass-rose text-white border border-rose-400/50 shadow-glass-3d' : 'glass-card text-rose-300 hover:text-rose-200 border border-white/10'
          }`}
        >
          گزارش‌های تخلف و فایل فیک
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all card-3d-tilt ${
            activeTab === 'settings' ? 'glass-panel-dark text-white border border-white/30 shadow-glass-3d' : 'glass-card text-slate-300 hover:text-white border border-white/10'
          }`}
        >
          تنظیمات کمیسیون و نرخ‌گذاری
        </button>
      </div>

      {/* Tab Content: Pending Validation */}
      {activeTab === 'pending' && (
        <div className="space-y-4">
          {pendingProperties.length === 0 ? (
            <div className="glass-card rounded-3xl p-10 text-center text-slate-300 text-xs border border-white/15 shadow-glass-3d">
              هیچ فایلی در صف انتظار اعتبارسنجی وجود ندارد. تمامی اسناد استعلام شده‌اند.
            </div>
          ) : (
            pendingProperties.map((p) => (
              <div key={p.id} className="glass-card p-5 sm:p-6 rounded-3xl border border-amber-400/40 shadow-glass-3d space-y-3.5 card-3d-tilt">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] glass-amber text-amber-300 font-bold px-3 py-1 rounded-full border border-amber-400/30">
                      نیازمند استعلام سند
                    </span>
                    <h3 className="font-extrabold text-sm text-white mt-1.5">{p.title} ({p.code})</h3>
                  </div>

                  <span className="font-mono text-xs font-black text-amber-400">{formatTomanShort(p.price)}</span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-light">{p.description}</p>

                <div className="flex items-center gap-2.5 pt-2 border-t border-white/10">
                  <button
                    onClick={() => onVerifyProperty(p.id)}
                    className="flex-1 btn-3d-emerald text-white font-black py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer border border-emerald-300/40"
                  >
                    <Check className="w-4 h-4" />
                    <span>تأیید استعلام و اعطای نشان سلامت</span>
                  </button>

                  <button
                    onClick={() => onRejectProperty(p.id)}
                    className="flex-1 glass-rose hover:brightness-110 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all border border-rose-400/40 active:scale-95 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                    <span>رد فایل (عدم تطبیق سند)</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab Content: Reports */}
      {activeTab === 'reports' && (
        <div className="glass-card p-5 sm:p-6 rounded-3xl border border-white/15 shadow-glass-3d space-y-3.5">
          <h3 className="font-extrabold text-sm text-white border-b border-white/10 pb-2.5">گزارشات تخلف کاربران</h3>
          
          <div className="p-4 glass-rose border border-rose-400/40 rounded-2xl space-y-2 text-xs text-rose-100 shadow-inner">
            <div className="flex justify-between items-center">
              <span className="font-extrabold text-white">گزارش قیمت نامتعارف رو فایل AKN-3301</span>
              <span className="text-[10px] glass-card text-white px-2.5 py-0.5 rounded-lg border border-white/20">بررسی اول</span>
            </div>
            <p className="text-[11px] leading-relaxed">گزارش‌دهنده ادعا کرده قیمت اعلامی با نرخ منطقه ۱۲٪ تفاوت دارد. بررسی کارشناس انجام شد و تایید گردید ملک دارای تخفیف نرخ‌شکن بابت مهاجرت است.</p>
            <div className="flex gap-2 pt-1.5">
              <button 
                onClick={() => alert('گزارش مختومه شد.')}
                className="btn-3d-amber text-slate-950 font-black px-4 py-1.5 rounded-xl text-xs cursor-pointer border border-amber-300/40"
              >
                تأیید و بستن پرونده
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: Commission Settings */}
      {activeTab === 'settings' && (
        <div className="glass-card p-5 sm:p-6 rounded-3xl border border-white/15 shadow-glass-3d space-y-4">
          <h3 className="font-extrabold text-sm text-white border-b border-white/10 pb-2.5">
            تنظیمات نرخ کمیسیون و کارمزد پلتفرم
          </h3>

          <div className="max-w-md space-y-3.5 text-xs">
            <div>
              <label className="block text-slate-300 font-bold mb-1.5">درصد کمیسیون کارشناسی اتاق معامله (%):</label>
              <input
                type="number"
                step="0.1"
                value={commissionRate}
                onChange={(e) => setCommissionRate(Number(e.target.value))}
                className="w-full bg-slate-950/80 border border-white/15 rounded-xl px-3.5 py-2.5 font-mono font-bold text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <button
              onClick={() => alert('تنظیمات نرخ کمیسیون با موفقیت به‌روزرسانی شد.')}
              className="btn-3d-amber text-slate-950 font-black px-6 py-3 rounded-xl text-xs cursor-pointer border border-amber-300/50"
            >
              ذخیره تغییرات کمیسیون
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
