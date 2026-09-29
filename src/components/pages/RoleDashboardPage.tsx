import React from 'react';
import { UserRole, User, Property } from '../../types';
import { 
  Building2, 
  ShieldCheck, 
  Award, 
  Lock, 
  TrendingUp, 
  Plus, 
  Package, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { formatTomanShort, toPersianDigits } from '../../utils/formatters';

interface RoleDashboardPageProps {
  currentUser: User;
  activeRole: UserRole;
  properties: Property[];
  onOpenRegisterProperty: () => void;
  onOpenMaterialQuote: () => void;
  onNavigateTab: (tab: string) => void;
}

export const RoleDashboardPage: React.FC<RoleDashboardPageProps> = ({
  currentUser,
  activeRole,
  properties,
  onOpenRegisterProperty,
  onOpenMaterialQuote,
  onNavigateTab,
}) => {
  const userProperties = properties.filter((p) => p.ownerId === currentUser.id || activeRole === 'agent');

  return (
    <div className="space-y-6 pb-12 text-[#1c1d22]" dir="rtl">
      
      {/* Role Profile Summary Card (Full Framed 3D Gold Box) */}
      <div className="bg-white p-5 sm:p-6 rounded-[28px] border-2 border-[#dfc282] space-y-4 shadow-[0_4px_16px_rgba(180,130,40,0.1)] relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#eee7db] pb-4">
          <div className="flex items-center gap-3.5">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-[#dfc282] shrink-0 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-950">{currentUser.name}</h1>
                {currentUser.verified && (
                  <span className="bg-emerald-50 text-emerald-950 text-xs px-2.5 py-0.5 rounded-full border border-emerald-300 font-black flex items-center gap-1 shadow-2xs">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                    <span>احراز هویت شده</span>
                  </span>
                )}
              </div>
              <p className="text-[13px] text-slate-700 font-bold mt-1">{currentUser.companyName || currentUser.location}</p>
            </div>
          </div>

          <div className="bg-[#faf8f4] p-3.5 rounded-2xl border-2 border-[#dfc282] text-xs flex items-center gap-3.5 shadow-2xs">
            <div>
              <span className="text-xs text-slate-600 block font-bold">اعتبار اکوسیستم:</span>
              <span className="font-black text-amber-950 text-[15px]">{currentUser.badgeTitle}</span>
            </div>
            <div className="w-12 h-12 rounded-2xl btn-3d-gold text-[#2c1b04] font-black text-xl flex items-center justify-center shadow-2xs">
              {toPersianDigits(currentUser.creditScore)}
            </div>
          </div>
        </div>

        {/* Action quick buttons (Compact 3D Gold Buttons, 15px Font) */}
        <div className="flex flex-wrap items-center gap-2.5 pt-1">
          <button
            onClick={onOpenRegisterProperty}
            className="h-10 px-4.5 btn-3d-gold text-[#2c1b04] text-[15px] font-black rounded-xl shadow-2xs transition-all active:scale-95 cursor-pointer flex items-center gap-2"
          >
            <Plus className="w-4.5 h-4.5 stroke-[2.5]" />
            <span>ثبت فایل جدید</span>
          </button>

          <button
            onClick={() => onNavigateTab('deal_room')}
            className="h-10 px-4.5 bg-white hover:bg-amber-50 text-slate-900 border-2 border-[#dfc282] text-[15px] font-black rounded-xl flex items-center gap-2 transition-all cursor-pointer active:scale-95 shadow-2xs"
          >
            <Lock className="w-4 h-4 text-amber-800" />
            <span>اتاق‌های معامله در جریان</span>
          </button>
        </div>
      </div>

      {/* Role Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4.5 rounded-[24px] border-2 border-[#dfc282] space-y-1 shadow-[0_4px_16px_rgba(180,130,40,0.08)]">
          <span className="text-xs text-slate-600 font-bold">فایل‌های ثبت‌شده:</span>
          <p className="text-xl font-black text-slate-950">{toPersianDigits(userProperties.length)} فایل</p>
        </div>

        <div className="bg-white p-4.5 rounded-[24px] border-2 border-[#dfc282] space-y-1 shadow-[0_4px_16px_rgba(180,130,40,0.08)]">
          <span className="text-xs text-slate-600 font-bold">تأییدشده و سالم:</span>
          <p className="text-xl font-black text-emerald-800">
            {toPersianDigits(userProperties.filter((p) => p.verifiedStatus === 'verified').length)} فایل
          </p>
        </div>

        <div className="bg-white p-4.5 rounded-[24px] border-2 border-[#dfc282] space-y-1 shadow-[0_4px_16px_rgba(180,130,40,0.08)]">
          <span className="text-xs text-slate-600 font-bold">در انتظار کارشناسی:</span>
          <p className="text-xl font-black text-amber-900">
            {toPersianDigits(userProperties.filter((p) => p.verifiedStatus === 'pending').length)} فایل
          </p>
        </div>

        <div className="bg-white p-4.5 rounded-[24px] border-2 border-[#dfc282] space-y-1 shadow-[0_4px_16px_rgba(180,130,40,0.08)]">
          <span className="text-xs text-slate-600 font-bold">معاملات موفق:</span>
          <p className="text-xl font-black text-slate-950">{toPersianDigits(3)} قرارداد</p>
        </div>
      </div>

      {/* Properties List */}
      <div className="space-y-4">
        <h2 className="text-base font-black text-slate-950 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-amber-700" />
          <span>مدیریت فایل‌های ملکی من</span>
        </h2>

        {userProperties.length === 0 ? (
          <div className="bg-white p-8 rounded-[28px] border-2 border-[#dfc282] text-center space-y-3 shadow-[0_4px_16px_rgba(180,130,40,0.08)]">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
            <p className="text-[15px] text-slate-600 font-bold">هنوز فایلی توسط شما ثبت نشده است.</p>
            <button
              onClick={onOpenRegisterProperty}
              className="h-10 px-5 btn-3d-gold text-[#2c1b04] font-black text-[15px] rounded-xl cursor-pointer shadow-2xs transition-all active:scale-95"
            >
              + ثبت اولین فایل
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {userProperties.map((p) => (
              <div key={p.id} className="bg-white p-4.5 rounded-2xl border-2 border-[#dfc282] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#caa758] transition-all">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs bg-[#faf8f4] text-slate-900 font-mono font-bold px-2.5 py-0.5 rounded-lg border border-[#e6dfd3]">
                      {p.code}
                    </span>
                    <span className={`text-xs font-black px-2.5 py-0.5 rounded-lg ${
                      p.verifiedStatus === 'verified'
                        ? 'bg-emerald-50 text-emerald-950 border border-emerald-300'
                        : 'bg-amber-50 text-amber-950 border border-amber-300'
                    }`}>
                      {p.verifiedStatus === 'verified' ? 'تأیید اصالت ثبتی' : 'در حال ارزیابی'}
                    </span>
                  </div>
                  <h4 className="font-black text-[15px] text-slate-950">{p.title}</h4>
                </div>

                <div className="text-left">
                  <span className="text-[15px] font-black text-amber-950 font-mono">{formatTomanShort(p.price)} تومان</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
