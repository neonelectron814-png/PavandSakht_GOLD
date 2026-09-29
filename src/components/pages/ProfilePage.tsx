import React from 'react';
import { User, UserRole } from '../../types';
import { 
  ShieldCheck, 
  ChevronLeft, 
  UserCheck,
  Smartphone,
  Download
} from 'lucide-react';
import { toPersianDigits } from '../../utils/formatters';

interface ProfilePageProps {
  currentUser: User;
  activeRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onNavigateTab: (tab: string) => void;
  onLogout?: () => void;
}

const roleTitles: Record<UserRole, string> = {
  buyer: 'خریدار / سرمایه‌گذار',
  seller: 'مالک / فروشنده',
  tenant: 'مستأجر / رهن و اجاره',
  agent: 'مشاور املاک امین',
  builder: 'سازنده / مجری',
  mine_owner: 'معدن‌دار / تأمین سنگ و کانی',
  factory: 'کارخانه مصالح',
  materials_seller: 'فروشنده محلی',
  craftsman: 'استادکار / پیمانکار',
  admin: 'مدیریت ارشد (ادمین)',
};

export const ProfilePage: React.FC<ProfilePageProps> = ({
  currentUser,
  activeRole,
  onRoleChange,
  onNavigateTab,
  onLogout,
}) => {
  return (
    <div className="space-y-5 pb-16 max-w-3xl mx-auto" dir="rtl">
      
      {/* Profile Header Card */}
      <div className="bg-white p-5 sm:p-6 rounded-[28px] border-2 border-[#dfc282] space-y-4 shadow-[0_4px_16px_rgba(180,130,40,0.12)] relative overflow-hidden">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-[#dfc282] shrink-0 shadow-md"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-black text-slate-950">{currentUser.name}</h1>
              {currentUser.verified && (
                <span className="bg-emerald-50 text-emerald-950 text-[10px] px-2.5 py-0.5 rounded-full border border-emerald-300 font-black flex items-center gap-1 shadow-2xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>احراز هویت شده</span>
                </span>
              )}
            </div>
            <p className="text-xs text-amber-900 font-black font-mono dir-ltr text-right">{currentUser.phone}</p>
            <p className="text-xs text-slate-800 font-bold leading-relaxed">{currentUser.bio}</p>
          </div>
        </div>

        <div className="pt-3 border-t border-[#ede6d8] flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-600 block text-[11px] font-bold">امتیاز اعتباری معاملات:</span>
            <span className="font-black text-amber-900 text-base">{toPersianDigits(currentUser.creditScore)} از ۱۰،۰۰۰</span>
          </div>
          <span className="btn-3d-gold text-[#2c1b04] px-3.5 py-1.5 rounded-xl font-black text-xs shadow-2xs">
            {currentUser.badgeTitle}
          </span>
        </div>
      </div>

      {/* Role Switcher Section with 3D Gold Cards */}
      <div className="bg-white p-5 sm:p-6 rounded-[28px] border-2 border-[#dfc282] shadow-[0_4px_16px_rgba(180,130,40,0.1)] space-y-3.5 relative overflow-hidden">
        <h2 className="font-black text-sm sm:text-base text-slate-950 flex items-center gap-2 border-b border-[#ede6d8] pb-3">
          <UserCheck className="w-4.5 h-4.5 text-amber-700" />
          <span>تغییر نقش کاربری فعال (محیط تست دمو)</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
          {(Object.keys(roleTitles) as UserRole[]).map((r) => {
            const isActive = activeRole === r;
            return (
              <button
                key={r}
                onClick={() => onRoleChange(r)}
                className={`p-3 rounded-2xl font-black transition-all text-center cursor-pointer ${
                  isActive
                    ? 'btn-3d-gold text-[#2c1b04] border-2 border-[#b88a31] shadow-md scale-102'
                    : 'bg-white hover:bg-amber-50/50 text-slate-900 border-2 border-[#e6dfd3] hover:border-[#caa758] shadow-[0_2px_0_#d5c8b2]'
                }`}
              >
                {roleTitles[r]}
              </button>
            );
          })}
        </div>
      </div>

      {/* PWA Mobile App Download Prompt with High-Contrast Visual */}
      <div className="bg-[#fffdf7] p-5 rounded-[28px] border-2 border-[#dfc282] shadow-[0_4px_16px_rgba(180,130,40,0.08)] flex items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4.5 h-4.5 text-amber-700" />
            <h3 className="font-black text-sm text-slate-950">نصب اپلیکیشن وب پیوندساخت (PWA)</h3>
          </div>
          <p className="text-xs font-bold text-slate-700">دسترسی فوق‌العاده سریع، آفلاین و بدون واسطه با رابط اندرویدی</p>
        </div>

        <button
          onClick={() => {
            window.dispatchEvent(new CustomEvent('show-install-prompt'));
          }}
          className="btn-3d-gold text-[#2c1b04] font-black px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs active:scale-95 transition-transform"
        >
          <Download className="w-4 h-4 stroke-[2.8]" />
          <span>نصب برنامه</span>
        </button>
      </div>

      {/* Navigation Quick Links */}
      <div className="bg-white rounded-[28px] border-2 border-[#dfc282] divide-y divide-[#ede6d8] shadow-[0_4px_16px_rgba(180,130,40,0.08)] overflow-hidden text-xs">
        <button
          onClick={() => onNavigateTab('role_dashboard')}
          className="w-full p-4 flex items-center justify-between hover:bg-amber-50/50 transition-colors text-slate-950 font-black cursor-pointer text-right"
        >
          <span>داشبورد اختصاصی نقش ({roleTitles[activeRole]})</span>
          <ChevronLeft className="w-4.5 h-4.5 text-slate-500" />
        </button>

        <button
          onClick={() => onNavigateTab('deal_room')}
          className="w-full p-4 flex items-center justify-between hover:bg-amber-50/50 transition-colors text-slate-950 font-black cursor-pointer text-right"
        >
          <span>اتاق معامله‌های محرمانه من</span>
          <ChevronLeft className="w-4.5 h-4.5 text-slate-500" />
        </button>

        <button
          onClick={() => onNavigateTab('price_data')}
          className="w-full p-4 flex items-center justify-between hover:bg-amber-50/50 transition-colors text-slate-950 font-black cursor-pointer text-right"
        >
          <span>استعلام قیمت‌های منطقه‌ای و دیتاسنتر مسکن</span>
          <ChevronLeft className="w-4.5 h-4.5 text-slate-500" />
        </button>

        {onLogout && (
          <button
            onClick={onLogout}
            className="w-full p-4 flex items-center justify-between hover:bg-rose-50/50 transition-colors text-rose-700 font-black cursor-pointer text-right"
          >
            <span>خروج از حساب کاربری</span>
            <ChevronLeft className="w-4.5 h-4.5 text-rose-400" />
          </button>
        )}
      </div>

    </div>
  );
};
