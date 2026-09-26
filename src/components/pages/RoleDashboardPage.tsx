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
    <div className="space-y-6 pb-12">
      
      {/* Role Profile Summary Card with Glassmorphism */}
      <div className="glass-card text-white p-6 sm:p-7 rounded-3xl border border-white/20 space-y-4 shadow-glass-3d relative overflow-hidden">
        <div className="absolute top-0 -left-10 w-80 h-80 ambient-glow-amber rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3.5">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-400/80 shrink-0 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black text-white">{currentUser.name}</h1>
                {currentUser.verified && <ShieldCheck className="w-4 h-4 text-emerald-400" />}
              </div>
              <p className="text-xs text-slate-300 font-light mt-0.5">{currentUser.companyName || currentUser.location}</p>
            </div>
          </div>

          <div className="glass-panel-dark p-3.5 rounded-2xl border border-white/15 text-xs flex items-center gap-3.5 shadow-sm">
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">اعتبار اکوسیستم:</span>
              <span className="font-extrabold text-amber-400 text-sm">{currentUser.badgeTitle}</span>
            </div>
            <div className="w-11 h-11 rounded-2xl glass-amber text-amber-300 font-black text-lg flex items-center justify-center border border-amber-400/40 shadow-inner">
              {toPersianDigits(currentUser.creditScore)}
            </div>
          </div>
        </div>

        {/* Action quick buttons */}
        <div className="flex flex-wrap items-center gap-2.5 pt-1">
          <button
            onClick={onOpenRegisterProperty}
            className="btn-3d-amber text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer border border-amber-300/50"
          >
            <Plus className="w-4 h-4" />
            <span>ثبت فایل جدید</span>
          </button>

          <button
            onClick={() => onNavigateTab('deal_room')}
            className="glass-card hover:bg-white/20 text-white text-xs font-bold px-4.5 py-2.5 rounded-xl border border-white/20 flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
          >
            <Lock className="w-4 h-4 text-amber-400" />
            <span>اتاق‌های معامله در جریان</span>
          </button>
        </div>
      </div>

      {/* Role Metrics Grid with 3D Tilt */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card p-4.5 rounded-3xl border border-white/15 text-xs space-y-1 shadow-glass-3d card-3d-tilt">
          <span className="text-[10px] text-slate-400 font-medium">فایل‌های ثبت‌شده:</span>
          <p className="text-lg font-black text-white">{toPersianDigits(userProperties.length)} فایل</p>
        </div>

        <div className="glass-card p-4.5 rounded-3xl border border-white/15 text-xs space-y-1 shadow-glass-3d card-3d-tilt">
          <span className="text-[10px] text-slate-400 font-medium">تأییدشده و سالم:</span>
          <p className="text-lg font-black text-emerald-400">
            {toPersianDigits(userProperties.filter(p => p.verifiedStatus === 'verified').length)} فایل
          </p>
        </div>

        <div className="glass-card p-4.5 rounded-3xl border border-white/15 text-xs space-y-1 shadow-glass-3d card-3d-tilt">
          <span className="text-[10px] text-slate-400 font-medium">در حال اعتبارسنجی:</span>
          <p className="text-lg font-black text-amber-400">
            {toPersianDigits(userProperties.filter(p => p.verifiedStatus === 'pending').length)} فایل
          </p>
        </div>

        <div className="glass-card p-4.5 rounded-3xl border border-white/15 text-xs space-y-1 shadow-glass-3d card-3d-tilt">
          <span className="text-[10px] text-slate-400 font-medium">بازدید کلی:</span>
          <p className="text-lg font-black text-white">{toPersianDigits(1240)} مرتبه</p>
        </div>
      </div>

      {/* My Active Listings List */}
      <div className="glass-card p-5 sm:p-6 rounded-3xl border border-white/15 shadow-glass-3d space-y-3.5">
        <h2 className="font-extrabold text-sm text-white border-b border-white/10 pb-3">
          مدیریت فایل‌ها و محصولات ثبت‌شده شما
        </h2>

        {userProperties.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center font-light">هنوز هیچ فایلی توسط شما ثبت نشده است.</p>
        ) : (
          <div className="space-y-3">
            {userProperties.map((p) => (
              <div key={p.id} className="p-3.5 glass-panel-dark rounded-2xl border border-white/10 flex items-center justify-between gap-3 text-xs card-3d-tilt">
                <div className="flex items-center gap-3">
                  <img src={p.images[0]} alt={p.title} className="w-12 h-12 rounded-xl object-cover shrink-0 border border-white/10" />
                  <div>
                    <span className="font-mono text-[10px] text-slate-400">{p.code}</span>
                    <h3 className="font-extrabold text-white line-clamp-1">{p.title}</h3>
                    <span className="text-amber-400 font-black">{formatTomanShort(p.price)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border ${
                    p.verifiedStatus === 'verified' ? 'glass-emerald text-emerald-300 border-emerald-400/40' : 'glass-amber text-amber-300 border-amber-400/40'
                  }`}>
                    {p.verifiedStatus === 'verified' ? 'اعتبارسنجی شد' : 'در حال بررسی'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
