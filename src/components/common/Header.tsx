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
  HardHat
} from 'lucide-react';
import { UserRole, User as UserType } from '../../types';
import { PayvandLogo3D } from './Golden3DIcons';

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
}) => {
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const navScrollRef = useRef<HTMLDivElement>(null);

  const activeRoleConfig = roleConfigs.find(r => r.id === activeRole) || roleConfigs[0];
  const ActiveRoleIcon = activeRoleConfig.icon;

  const handleScroll = (direction: 'left' | 'right') => {
    if (navScrollRef.current) {
      const scrollAmount = direction === 'left' ? -220 : 220;
      navScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-xl border-b border-[#ede8de] shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition-all" dir="rtl">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-2.5">
        
        {/* =========================================================================
            TOP ROW: Logo, Home, Role, Notifications
            ========================================================================= */}
        <div className="flex items-center justify-between gap-2">
          
          {/* Brand Logo & Home Trigger */}
          <div className="flex items-center gap-2">
            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigateTab('home')}
              className="flex items-center gap-2 cursor-pointer group select-none shrink-0"
              title="بازگشت به خانه"
            >
              <PayvandLogo3D className="w-8 h-8" />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-sm sm:text-base text-slate-950">
                    پیوندساخت
                  </span>
                  <span className="bg-amber-100 text-amber-900 text-[9px] px-2 py-0.5 rounded-full font-bold hidden sm:inline-flex items-center gap-1 border border-amber-300">
                    <ShieldCheck className="w-2.5 h-2.5 text-amber-700" />
                    اتصالِ هوشمندانه
                  </span>
                </div>
                <p className="text-[10px] sm:text-[10.5px] text-slate-700 font-bold truncate max-w-[130px] sm:max-w-none">
                  آغاز هر ساخت‌وساز، یک پیوند است
                </p>
              </div>
            </motion.button>

            {/* Back to Home Button */}
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => onNavigateTab('home')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-[#9a7224] text-xs font-bold border border-amber-200/80 transition-colors cursor-pointer mr-2"
            >
              <Home className="w-3.5 h-3.5" />
              <span>صفحه اصلی</span>
            </motion.button>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 text-xs font-semibold text-slate-600">
            <button 
              onClick={() => onNavigateTab('market')} 
              className="px-3 py-1.5 rounded-xl hover:bg-slate-100 hover:text-slate-900 transition-all cursor-pointer"
            >
              بازار املاک
            </button>
            <button 
              onClick={() => onNavigateTab('partnership')} 
              className="px-3 py-1.5 rounded-xl hover:bg-slate-100 hover:text-slate-900 transition-all cursor-pointer"
            >
              مشارکت در ساخت
            </button>
            <button 
              onClick={() => onNavigateTab('materials')} 
              className="px-3 py-1.5 rounded-xl hover:bg-slate-100 hover:text-slate-900 transition-all cursor-pointer"
            >
              متریال و مصالح
            </button>
            <button 
              onClick={() => onNavigateTab('deal_room')} 
              className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-900 hover:bg-amber-100 transition-all flex items-center gap-1.5 font-bold border border-amber-200 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-amber-700" />
              اتاق معامله
            </button>
            
            {onOpenMoreMenu && (
              <button 
                onClick={onOpenMoreMenu}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all flex items-center gap-1.5 font-bold cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#caa758]" />
                <span>همه بخش‌ها</span>
              </button>
            )}
          </nav>

          {/* Right Action Icons & Role Pill */}
          <div className="flex items-center gap-1.5 shrink-0">
            
            {/* Live Feed Trigger */}
            {onOpenLiveFeed && (
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onOpenLiveFeed}
                className="relative p-1.5 sm:p-2 text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-xl transition-all border border-amber-200 flex items-center gap-1 cursor-pointer"
                title="پالس زنده بازار"
              >
                <Radio className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 ${isLiveActive ? 'animate-pulse' : ''}`} />
                <span className="hidden sm:inline text-[11px] font-bold text-amber-800">زنده</span>
              </motion.button>
            )}

            {/* Notification Bell */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onOpenNotifications}
              className="relative p-1.5 sm:p-2 text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all border border-slate-200 cursor-pointer"
              aria-label="اعلان‌ها"
            >
              <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full ring-2 ring-white" />
              )}
            </motion.button>

            {/* Role Switcher Pill */}
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => setIsRoleDropdownOpen(true)}
              className="bg-amber-50 hover:bg-amber-100 text-amber-900 text-[11px] sm:text-xs px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-all border border-amber-200 cursor-pointer"
              title="تغییر نقش کاربری"
            >
              <ActiveRoleIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-700 shrink-0" />
              <span className="font-bold text-[10px] sm:text-xs truncate max-w-[80px]">
                {activeRoleConfig.shortTitle}
              </span>
              <ChevronDown className={`w-3 h-3 text-amber-700 transition-transform shrink-0 ${isRoleDropdownOpen ? 'rotate-180' : ''}`} />
            </motion.button>

          </div>

        </div>

        {/* =========================================================================
            SEARCH ROW
            ========================================================================= */}
        <div className="mt-2 sm:mt-2.5 flex items-center gap-2">
          <div className="relative flex-1 group">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none group-focus-within:text-amber-600 transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجوی کد فایل (PYS-9021)، شهر، رهن، یا متریال..."
              className="w-full bg-[#faf9f6] border border-[#d8d0c0] text-slate-950 placeholder-slate-500 font-medium text-xs rounded-2xl pl-8 pr-10 py-2 sm:py-2.5 focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-0.5 rounded-full bg-slate-200"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Filter Button */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={onOpenFilterSheet}
            className="bg-amber-600 hover:bg-amber-700 text-white text-xs px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl flex items-center gap-1.5 font-bold transition-all shrink-0 shadow-sm cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>فیلترها</span>
          </motion.button>
        </div>

        {/* =========================================================================
            BOTTOM ROW: Category Chips Carousel
            ========================================================================= */}
        <div className="relative mt-2 flex items-center group/nav">
          <button
            onClick={() => handleScroll('right')}
            className="hidden md:flex absolute right-0 z-10 w-6 h-9 items-center justify-center bg-white/90 text-slate-600 hover:text-amber-700 rounded-r-xl border border-slate-200 shadow-sm backdrop-blur-md opacity-0 group-hover/nav:opacity-100 transition-opacity"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <div 
            ref={navScrollRef}
            className="w-full flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth pb-1 pt-0.5 px-0.5"
          >
            {quickServices.map((service) => {
              const Icon = service.icon;
              return (
                <button
                  key={service.id}
                  onClick={() => onNavigateTab(service.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-amber-50/90 border border-[#ded5c5] hover:border-amber-400 transition-all shrink-0 cursor-pointer shadow-xs select-none text-slate-900 font-extrabold hover:text-amber-950"
                >
                  <Icon className="w-3.5 h-3.5 text-[#a87d32]" />
                  <span className="text-[11px] font-black whitespace-nowrap">
                    {service.title}
                  </span>
                  {service.badge && (
                    <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-black ${service.badgeBg}`}>
                      {service.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {onOpenMoreMenu && (
              <button
                onClick={onOpenMoreMenu}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 transition-all shrink-0 cursor-pointer shadow-xs select-none font-bold text-[11px]"
              >
                <Sparkles className="w-3 h-3 text-amber-600" />
                <span>همه خدمات</span>
              </button>
            )}
          </div>

          <button
            onClick={() => handleScroll('left')}
            className="hidden md:flex absolute left-0 z-10 w-6 h-9 items-center justify-center bg-white/90 text-slate-600 hover:text-amber-700 rounded-l-xl border border-slate-200 shadow-sm backdrop-blur-md opacity-0 group-hover/nav:opacity-100 transition-opacity"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

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
                  className="bg-white rounded-[28px] w-full max-w-[360px] sm:max-w-md max-h-[82vh] flex flex-col shadow-2xl border-2 border-[#dfc282] overflow-hidden"
                >
                  <div className="p-3.5 sm:p-4 border-b border-[#ede6d8] flex items-center justify-between bg-[#fffdfa] shrink-0">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-900 shadow-xs">
                        <UserCheck className="w-4 h-4 text-amber-800" />
                      </div>
                      <div>
                        <h3 className="font-black text-slate-950 text-xs sm:text-sm">انتخاب نقش کاربری فعال</h3>
                        <p className="text-[10px] text-slate-600 font-bold">سامانه هوشمند پیوندساخت</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsRoleDropdownOpen(false)}
                      className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
                      aria-label="بستن"
                    >
                      <X className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  </div>

                  <div className="p-3 space-y-2 overflow-y-auto no-scrollbar flex-1">
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
                          className={`w-full p-2.5 sm:p-3 rounded-2xl border text-right transition-all flex items-start gap-2.5 cursor-pointer ${
                            isCurrent
                              ? 'bg-amber-100/90 border-amber-500 text-amber-950 shadow-xs ring-1 ring-amber-400'
                              : 'bg-white border-[#ded5c5] hover:bg-slate-50 text-slate-900'
                          }`}
                        >
                          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 border border-amber-300 flex items-center justify-center shrink-0 mt-0.5">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-black text-slate-950">{role.title}</span>
                              {isCurrent && <Check className="w-4 h-4 text-amber-700 stroke-[3]" />}
                            </div>
                            <p className="text-[10.5px] font-semibold text-slate-700 mt-0.5 leading-snug">{role.desc}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="p-3 border-t border-[#ede6d8] bg-[#fbf9f4] flex items-center justify-between shrink-0">
                    <span className="text-[10.5px] font-bold text-slate-600">
                      محیط آزمایشی پیوندساخت
                    </span>
                    <button
                      onClick={() => setIsRoleDropdownOpen(false)}
                      className="px-4 py-1.5 btn-3d-gold text-xs font-black rounded-xl shadow-xs cursor-pointer"
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
    </header>
  );
};
