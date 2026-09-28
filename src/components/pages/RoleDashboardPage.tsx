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
    <div className="space-y-6 pb-12 text-[#1c1d22]">
      
      {/* Role Profile Summary Card */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#ded5c5] space-y-4 shadow-xs relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#eee7db] pb-4">
          <div className="flex items-center gap-3.5">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-500 shrink-0 shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black text-slate-900">{currentUser.name}</h1>
                {currentUser.verified && <ShieldCheck className="w-4 h-4 text-emerald-600" />}
              </div>
              <p className="text-xs text-slate-500 font-bold mt-0.5">{currentUser.companyName || currentUser.location}</p>
            </div>
          </div>

          <div className="bg-[#faf8f4] p-3.5 rounded-2xl border border-[#ded5c5] text-xs flex items-center gap-3.5 shadow-2xs">
            <div>
              <span className="text-[10px] text-slate-500 block font-bold">اعتبار اکوسیستم:</span>
              <span className="font-black text-amber-900 text-sm">{currentUser.badgeTitle}</span>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-900 font-black text-lg flex items-center justify-center border border-amber-300 shadow-inner">
              {toPersianDigits(currentUser.creditScore)}
            </div>
          </div>
        </div>

        {/* Action quick buttons */}
        <div className="flex flex-wrap items-center gap-2.5 pt-1">
          <button
            onClick={onOpenRegisterProperty}
            className="bg-gradient-to-r from-[#b88c42] to-[#8d6520] hover:from-[#a67c35] hover:to-[#7a5518] text-white font-black text-xs px-5 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>ثبت فایل جدید</span>
          </button>

          <button
            onClick={() => onNavigateTab('deal_room')}
            className="bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold px-4.5 py-2.5 rounded-xl border border-amber-300 flex items-center gap-2 transition-all cursor-pointer shadow-2xs"
          >
            <Lock className="w-4 h-4 text-amber-700" />
            <span>اتاق‌های معامله در جریان</span>
          </button>
        </div>
      </div>

      {/* Role Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4.5 rounded-3xl border border-[#ded5c5] text-xs space-y-1 shadow-xs">
          <span className="text-[10px] text-slate-500 font-bold">فایل‌های ثبت‌شده:</span>
          <p className="text-lg font-black text-slate-900">{toPersianDigits(userProperties.length)} فایل</p>
        </div>

        <div className="bg-white p-4.5 rounded-3xl border border-[#ded5c5] text-xs space-y-1 shadow-xs">
          <span className="text-[10px] text-slate-500 font-bold">تأییدشده و سالم:</span>
          <p className="text-lg font-black text-emerald-700">
            {toPersianDigits(userProperties.filter((p) => p.verifiedStatus === 'verified').length)} فایل
          </p>
        </div>

        <div className="bg-white p-4.5 rounded-3xl border border-[#ded5c5] text-xs space-y-1 shadow-xs">
          <span className="text-[10px] text-slate-500 font-bold">در انتظار کارشناسی:</span>
          <p className="text-lg font-black text-amber-700">
            {toPersianDigits(userProperties.filter((p) => p.verifiedStatus === 'pending').length)} فایل
          </p>
        </div>

        <div className="bg-white p-4.5 rounded-3xl border border-[#ded5c5] text-xs space-y-1 shadow-xs">
          <span className="text-[10px] text-slate-500 font-bold">معاملات موفق:</span>
          <p className="text-lg font-black text-slate-900">{toPersianDigits(3)} قرارداد</p>
        </div>
      </div>

      {/* Properties List */}
      <div className="space-y-4">
        <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-amber-600" />
          <span>مدیریت فایل‌های ملکی من</span>
        </h2>

        {userProperties.length === 0 ? (
          <div className="bg-white p-8 rounded-3xl border border-[#ded5c5] text-center space-y-3">
            <Building2 className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-xs text-slate-500 font-bold">هنوز فایلی توسط شما ثبت نشده است.</p>
            <button
              onClick={onOpenRegisterProperty}
              className="bg-amber-500 hover:bg-amber-600 text-white font-black text-xs px-5 py-2.5 rounded-xl cursor-pointer shadow-sm transition-all"
            >
              + ثبت اولین فایل
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {userProperties.map((p) => (
              <div key={p.id} className="bg-white p-4.5 rounded-2xl border border-[#ded5c5] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] bg-[#faf8f4] text-slate-800 font-mono font-bold px-2 py-0.5 rounded-md border border-[#ded5c5]">
                      {p.code}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      p.verifiedStatus === 'verified'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                        : 'bg-amber-50 text-amber-900 border border-amber-300'
                    }`}>
                      {p.verifiedStatus === 'verified' ? 'تأییدشده' : 'در حال ارزیابی'}
                    </span>
                  </div>
                  <h4 className="font-black text-xs text-slate-900">{p.title}</h4>
                </div>

                <div className="text-left">
                  <span className="text-xs font-black text-slate-900">{formatTomanShort(p.price)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
