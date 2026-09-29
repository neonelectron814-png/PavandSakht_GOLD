import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  ShieldCheck, 
  Search, 
  SlidersHorizontal, 
  Radio, 
  Bell, 
  ChevronDown, 
  Handshake, 
  RefreshCw, 
  Layers, 
  LineChart, 
  TrendingUp,
  UserCheck, 
  Shield, 
  Sparkles,
  Lock,
  Flame,
  Hammer,
  KeyRound,
  Compass,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Home,
  Package,
  HardHat,
  LogOut
} from 'lucide-react';
import { UserRole, User as UserType } from '../../types';
import { PayvandLogoV3 } from './Golden3DIcons';

interface HeaderProps {
  activeRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  currentUser: UserType;
  onOpenNotifications: () => void;
  unreadCount: number;
  onNavigateTab: (tab: string) => void;
  onOpenFilterSheet: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenLiveFeed?: () => void;
  isLiveActive?: boolean;
  onOpenMoreMenu?: () => void;
  onLogout?: () => void;
}

interface RoleConfig {
  id: UserRole;
  title: string;
  shortTitle: string;
  desc: string;
  badge: string;
  icon: React.ElementType;
  gradient: string;
  badgeBg: string;
}

const roleConfigs: RoleConfig[] = [
  {
    id: 'buyer',
    title: 'خریدار / سرمایه‌گذار',
    shortTitle: 'خریدار',
    desc: 'جستجو، پیشنهاد قیمت هوشمند و خرید ملک، کوپ سنگ یا مصالح ساختمانی',
    badge: 'سرمایه‌گذاری',
    icon: UserCheck,
    gradient: 'from-amber-500 to-amber-600',
    badgeBg: 'bg-amber-100 text-amber-800 border-amber-300',
  },
  {
    id: 'seller',
    title: 'مالک / فروشنده',
    shortTitle: 'فروشنده',
    desc: 'ثبت و واگذاری فایل‌های ملکی و صنعتی با تایید کارگزاری رسمی امین',
    badge: 'فروش قطعی',
    icon: Building2,
    gradient: 'from-emerald-500 to-teal-600',
    badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  },
  {
    id: 'tenant',
    title: 'مستأجر / رهن و اجاره',
    shortTitle: 'مستأجر',
    desc: 'استعلام قراردادهای اجاره، ودیعه و فایل‌های رهن معتبر با کد پیگیری',
    badge: 'رهن و اجاره',
    icon: KeyRound,
    gradient: 'from-teal-500 to-cyan-600',
    badgeBg: 'bg-teal-100 text-teal-800 border-teal-300',
  },
  {
    id: 'agent',
    title: 'مشاور املاک امین',
    shortTitle: 'کارگزار امین',
    desc: 'واسطه‌گری امن، نظارت بر قرارداد، مدیریت فایل‌ها و کارمزد قانونی',
    badge: 'کارگزاری امین',
    icon: ShieldCheck,
    gradient: 'from-blue-500 to-indigo-600',
    badgeBg: 'bg-blue-100 text-blue-800 border-blue-300',
  },
  {
    id: 'builder',
    title: 'سازنده / مجری طرح',
    shortTitle: 'سازنده و مجری',
    desc: 'مشارکت در ساخت، ارزیابی طرح توجیهی، تامین مصالح و تهاتر پروژه',
    badge: 'مشارکت ساخت',
    icon: HardHat,
    gradient: 'from-amber-600 to-orange-600',
    badgeBg: 'bg-amber-100 text-amber-800 border-amber-300',
  },
  {
    id: 'craftsman',
    title: 'تأمین‌کننده و استادکار',
    shortTitle: 'مجری و مصالح',
    desc: 'عرضه متریال و عقد قرارداد دستمزدی یا پیمانکاری مصالح',
    badge: 'تامین و اجرا',
    icon: Hammer,
    gradient: 'from-purple-500 to-pink-600',
    badgeBg: 'bg-purple-100 text-purple-800 border-purple-300',
  },
];

const quickServices = [
  { id: 'market', title: 'املاک و مستغلات', icon: Building2, badge: 'رهن و فروش', badgeBg: 'bg-amber-100 text-amber-800' },
  { id: 'partnership', title: 'مشارکت در ساخت', icon: Handshake, badge: 'سازندگان رتبه‌دار', badgeBg: 'bg-emerald-100 text-emerald-800' },
  { id: 'materials', title: 'مصالح و متریال', icon: Package, badge: 'قیمت بورس', badgeBg: 'bg-blue-100 text-blue-800' },
  { id: 'craftsmen', title: 'پیوند عمران و معادن', icon: Hammer, badge: 'ماشین‌آلات و معدن', badgeBg: 'bg-purple-100 text-purple-800' },
  { id: 'rate_cutter', title: 'فرصت‌های طلایی و نرخ‌شکن', icon: Flame, badge: 'زیر قیمت', badgeBg: 'bg-rose-100 text-rose-800' },
  { id: 'deal_room', title: 'اتاق معامله امن', icon: Lock, badge: 'محرمانه', badgeBg: 'bg-amber-100 text-amber-800' },
  { id: 'barter', title: 'اتاق تهاتر', icon: RefreshCw, badge: 'ملک با متریال', badgeBg: 'bg-indigo-100 text-indigo-800' },
  { id: 'price_data', title: 'استعلام قیمت و متراژ', icon: TrendingUp, badge: 'داده زنده', badgeBg: 'bg-emerald-100 text-emerald-800' },
];

export const Header: React.FC<HeaderProps> = ({
  activeRole,
  onRoleChange,
  currentUser,
  onOpenNotifications,
  unreadCount,
  onNavigateTab,
  onOpenFilterSheet,
  searchQuery,
  setSearchQuery,
  onOpenLiveFeed,
  isLiveActive = true,
  onOpenMoreMenu,
  onLogout,
}) => {
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const activeRoleConfig = roleConfigs.find(r => r.id === activeRole) || roleConfigs[0];
  const ActiveRoleIcon = activeRoleConfig.icon;

  return (
    <>
      <header className="sticky top-0 z-30 bg-[#f6f4ef]/95 backdrop-blur-xl border-b border-[#e2d8c3] shadow-xs transition-all pt-3 px-4 pb-2.5" dir="rtl">
      {/* Top Row: Prominent Logo on Right, Role & Actions on Left */}
      <div className="w-full flex items-center justify-between gap-2 min-h-[58px]">
        {/* Right side in RTL: Prominent Solo Brand Logo (Matching Home Page Exactly) */}
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={() => onNavigateTab('home')}
          className="flex items-center cursor-pointer p-0.5 select-none z-20 shrink-0 group"
          title="پیوندساخت - صفحه اصلی"
        >
          <div className="w-16 h-16 sm:w-[72px] sm:h-[72px] shrink-0 flex items-center justify-center">
            <PayvandLogoV3 className="w-16 h-16 sm:w-[72px] sm:h-[72px] object-contain" />
          </div>
        </motion.button>

        {/* Left side in RTL: 3D Gold Action Buttons & Role Switcher */}
        <div className="flex items-center gap-1.5 z-20 shrink-0">
          {/* Role Switcher Pill */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setIsRoleDropdownOpen(true)}
            className="h-8.5 bg-white border-2 border-[#dfc282] text-amber-950 text-xs sm:text-[12.5px] px-2.5 rounded-xl flex items-center gap-1 shadow-2xs cursor-pointer font-black"
            title="تغییر نقش کاربری"
          >
            <ActiveRoleIcon className="w-3.5 h-3.5 text-[#a87d32] shrink-0" />
            <span className="truncate max-w-[70px]">{activeRoleConfig.shortTitle}</span>
            <ChevronDown className={`w-3 h-3 text-slate-500 transition-transform ${isRoleDropdownOpen ? 'rotate-180' : ''}`} />
          </motion.button>

          {/* Logout Button */}
          {onLogout && (
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={onLogout}
              className="w-8.5 h-8.5 rounded-xl btn-3d-gold flex items-center justify-center cursor-pointer shrink-0 shadow-2xs"
              title="خروج از حساب"
            >
              <LogOut className="w-4 h-4 stroke-[2.5] text-[#782020] hover:text-[#9e1c1c] transition-colors" />
            </motion.button>
          )}

          {/* Notifications Bell */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={onOpenNotifications}
            className="w-8.5 h-8.5 rounded-xl btn-3d-gold flex items-center justify-center relative cursor-pointer shrink-0 shadow-2xs"
            aria-label="اعلان‌ها"
            title="اعلانات و پیام‌ها"
          >
            <Bell className="w-4 h-4 stroke-[2.5] text-[#2c1b04]" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-rose-600 rounded-full ring-2 ring-white animate-pulse" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Search & Filter Row in 3D Gold Styling */}
      <div className="w-full mt-2 flex items-center gap-2">
        <form
          onSubmit={(e) => { e.preventDefault(); onNavigateTab('market'); }}
          className="flex-1 h-9.5 bg-white rounded-xl border-2 border-[#dfc282] shadow-2xs flex items-center px-1.5 focus-within:border-[#caa758] transition-all min-w-0"
        >
          <button
            type="submit"
            className="btn-3d-gold w-7 h-7 rounded-lg flex items-center justify-center shrink-0 shadow-2xs cursor-pointer active:scale-95 transition-transform"
            title="جستجو"
          >
            <Search className="w-3.5 h-3.5 text-[#2c1b04] stroke-[2.8]" />
          </button>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجوی کد فایل (PYS-9021)، متریال..."
            className="flex-1 h-full bg-transparent px-2 text-sm font-bold text-slate-950 placeholder-slate-400 focus:outline-none text-right min-w-0"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-slate-400 hover:text-slate-700 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </form>

        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={onOpenFilterSheet}
          className="h-9.5 px-3 btn-3d-gold text-xs font-black rounded-xl flex items-center gap-1 shrink-0 cursor-pointer shadow-2xs text-[#221503]"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#221503]" />
          <span>فیلترها</span>
        </motion.button>
      </div>
    </header>

      {/* =========================================================================
          ROLE SELECTION MODAL (Rendered into body via Portal so it never clips or overflows)
          ========================================================================= */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {isRoleDropdownOpen && (
              <div 
                onClick={() => setIsRoleDropdownOpen(false)}
                className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs"
                dir="rtl"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.93, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.93, y: 15 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-[#fbf9f4] rounded-[32px] w-full max-w-[360px] sm:max-w-md max-h-[82vh] flex flex-col shadow-[0_20px_60px_rgba(160,118,48,0.25)] border-2 border-[#dfc282] overflow-hidden"
                >
                  <div className="p-3.5 sm:p-4 border-b border-[#e8dfcf] flex items-center justify-between bg-white/70 shrink-0">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl btn-3d-gold flex items-center justify-center text-[#2c1b04] shadow-2xs">
                        <UserCheck className="w-4.5 h-4.5 stroke-[2.5]" />
                      </div>
                      <div>
                        <h3 className="font-black text-slate-950 text-xs sm:text-sm">انتخاب نقش کاربری فعال</h3>
                        <p className="text-[11px] text-slate-600 font-bold mt-0.5">سامانه هوشمند پیوندساخت</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsRoleDropdownOpen(false)}
                      className="w-8 h-8 rounded-xl btn-3d-gold text-[#2c1b04] flex items-center justify-center cursor-pointer shadow-2xs active:scale-95 transition-transform"
                      aria-label="بستن"
                    >
                      <X className="w-4 h-4 stroke-[3]" />
                    </button>
                  </div>

                  <div className="p-3.5 space-y-2.5 overflow-y-auto no-scrollbar flex-1">
                    {roleConfigs.map((role) => {
                      const Icon = role.icon;
                      const isCurrent = role.id === activeRole;
                      return (
                        <button
                          key={role.id}
                          onClick={() => {
                            onRoleChange(role.id);
                            setIsRoleDropdownOpen(false);
                          }}
                          className={`w-full p-3 rounded-[20px] border-2 text-right transition-all flex items-start gap-3 cursor-pointer ${
                            isCurrent
                              ? 'bg-amber-50/90 border-[#caa758] text-amber-950 shadow-[0_4px_0_#b88a31] scale-[1.01]'
                              : 'bg-white border-[#e6dfd3] hover:border-[#caa758] hover:bg-amber-50/30 text-slate-900 shadow-[0_3px_0_#d5c8b2]'
                          }`}
                        >
                          <div className="w-9 h-9 rounded-xl btn-3d-gold flex items-center justify-center shrink-0 mt-0.5 shadow-2xs text-[#2c1b04]">
                            <Icon className="w-4.5 h-4.5 stroke-[2.2]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-xs sm:text-[13px] font-black text-slate-950">{role.title}</span>
                              {isCurrent && (
                                <div className="w-5 h-5 rounded-full btn-3d-gold flex items-center justify-center shadow-xs shrink-0">
                                  <Check className="w-3.5 h-3.5 text-[#2c1b04] stroke-[3]" />
                                </div>
                              )}
                            </div>
                            <p className="text-[11px] font-bold text-[#644b1c] mt-0.5 leading-snug">{role.desc}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="p-3.5 border-t border-[#e2d8c3] bg-[#f5ede0] flex items-center justify-between shrink-0 gap-3">
                    <span className="text-[11px] font-black text-slate-700">
                      محیط آزمایشی پیوندساخت
                    </span>
                    <button
                      onClick={() => setIsRoleDropdownOpen(false)}
                      className="px-5 py-2 btn-3d-gold text-xs font-black rounded-xl shadow-xs cursor-pointer text-[#2c1b04] active:scale-95 transition-transform"
                    >
                      بستن
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
};
