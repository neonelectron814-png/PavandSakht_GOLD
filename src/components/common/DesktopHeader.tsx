import React, { useState, useRef, useEffect } from 'react';
import { 
  Building2, 
  MapPin, 
  ChevronDown, 
  Search, 
  Lock, 
  Sparkles, 
  PlusCircle, 
  Bell, 
  UserCheck, 
  ShieldCheck, 
  KeyRound, 
  Layers, 
  LineChart, 
  Flame, 
  HardHat, 
  Handshake, 
  Radio, 
  Package, 
  Compass, 
  Boxes, 
  Tag, 
  Repeat, 
  CreditCard, 
  Bot, 
  Mic, 
  Home,
  Monitor,
  Smartphone,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { User, UserRole, LiveTickerItem } from '../../types';
import { PayvandLogoV3 } from './Golden3DIcons';

interface DesktopHeaderProps {
  currentUser: User;
  activeRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeTab: string;
  onNavigateTab: (tab: string) => void;
  unreadCount: number;
  onOpenNotifications: () => void;
  selectedCity: string;
  onOpenCityModal: () => void;
  onOpenRegisterModal: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  tickerItems?: LiveTickerItem[];
  isDevicePreview?: boolean;
  onToggleDevicePreview?: () => void;
  onLogout?: () => void;
}

const roleConfigs = [
  { id: 'buyer' as UserRole, title: 'خریدار / سرمایه‌گذار', icon: UserCheck, color: 'text-amber-700 bg-amber-50 border-amber-200' },
  { id: 'seller' as UserRole, title: 'مالک / فروشنده', icon: Building2, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  { id: 'tenant' as UserRole, title: 'مستأجر / متقاضی', icon: KeyRound, color: 'text-teal-700 bg-teal-50 border-teal-200' },
  { id: 'agent' as UserRole, title: 'مشاور املاک امین', icon: ShieldCheck, color: 'text-blue-700 bg-blue-50 border-blue-200' },
  { id: 'contractor' as UserRole, title: 'پیمانکار / مجری', icon: HardHat, color: 'text-purple-700 bg-purple-50 border-purple-200' },
  { id: 'supplier' as UserRole, title: 'تأمین‌کننده مصالح', icon: Package, color: 'text-rose-700 bg-rose-50 border-rose-200' },
  { id: 'investor' as UserRole, title: 'مشارکت‌کننده سرمایه', icon: Handshake, color: 'text-indigo-700 bg-indigo-50 border-indigo-200' },
];

export const DesktopHeader: React.FC<DesktopHeaderProps> = ({
  currentUser,
  activeRole,
  onRoleChange,
  activeTab,
  onNavigateTab,
  unreadCount,
  onOpenNotifications,
  selectedCity,
  onOpenCityModal,
  onOpenRegisterModal,
  searchQuery,
  setSearchQuery,
  tickerItems = [],
  isDevicePreview,
  onToggleDevicePreview,
  onLogout,
}) => {
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const navScrollRef = useRef<HTMLDivElement>(null);

  const handleScrollNav = (direction: 'left' | 'right') => {
    if (navScrollRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      navScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleNavWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (navScrollRef.current && Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      navScrollRef.current.scrollBy({
        left: -e.deltaY * 1.3,
        behavior: 'auto'
      });
    }
  };

  // Auto-scroll the active tab into view whenever activeTab changes
  useEffect(() => {
    if (navScrollRef.current) {
      const activeEl = navScrollRef.current.querySelector<HTMLButtonElement>(`[data-tab-id="${activeTab}"]`);
      if (activeEl) {
        activeEl.scrollIntoView({
          behavior: 'smooth',
          inline: 'nearest',
          block: 'nearest'
        });
      }
    }
  }, [activeTab]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearch) {
      setSearchQuery(localSearch);
    }
    if (activeTab !== 'market' && activeTab !== 'materials') {
      onNavigateTab('market');
    }
  };

  const navTabs = [
    { id: 'home', label: 'صفحه اصلی', icon: Home },
    { id: 'market', label: 'بازار املاک', icon: Building2 },
    { id: 'materials', label: 'مصالح و متریال', icon: Boxes },
    { id: 'building_3d', label: 'طراحی ۳بعدی و هوش مصنوعی', icon: Bot, highlight: true },
    { id: 'deal_room', label: 'اتاق معامله', icon: Lock },
    { id: 'rate_cutter', label: 'شکارچی قیمت', icon: Tag },
    { id: 'barter', label: 'تهاتر و معاوضه', icon: Repeat },
    { id: 'installments', label: 'فروش اقساطی', icon: CreditCard },
    { id: 'partnership', label: 'مشارکت در ساخت', icon: Handshake },
    { id: 'craftsmen', label: 'پیمانکاران و ماشین‌آلات', icon: HardHat },
    { id: 'price_data', label: 'دیتاسنتر قیمت', icon: LineChart },
    { id: 'customer_requests', label: 'تقاضای مشتریان', icon: Sparkles },
    { id: 'audio_analysis', label: 'تحلیل صوت', icon: Mic },
    { id: 'role_dashboard', label: 'داشبورد کاربری', icon: Layers },
  ];

  const currentRoleConfig = roleConfigs.find(r => r.id === activeRole) || roleConfigs[0];
  const CurrentRoleIcon = currentRoleConfig.icon;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#ece6d9] shadow-xs select-none">
      
      {/* Main Desktop Header */}
      <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between gap-6">
        
        {/* Brand Logo (Prominent Size Matching Mobile First Page) */}
        <div 
          className="flex items-center gap-3.5 shrink-0 cursor-pointer group" 
          onClick={() => onNavigateTab('home')}
          title="پیوندساخت - صفحه اصلی"
        >
          <div className="w-16 h-16 lg:w-[68px] lg:h-[68px] shrink-0 flex items-center justify-center">
            <PayvandLogoV3 className="w-16 h-16 lg:w-[68px] lg:h-[68px] object-contain group-hover:scale-105 transition-transform" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl lg:text-[26px] font-black text-amber-500 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 bg-clip-text text-transparent tracking-tight">
                پیوندساخت
              </span>
            </div>
          </div>
        </div>

        {/* Global Search Bar */}
        <form 
          onSubmit={handleSearchSubmit} 
          className="flex-1 max-w-xl flex items-center bg-[#faf9f6] border border-[#e5ded2] rounded-2xl p-1.5 focus-within:border-[#caa758] focus-within:ring-2 focus-within:ring-[#caa758]/20 transition-all shadow-inner"
        >
          <button
            type="button"
            onClick={onOpenCityModal}
            className="h-8 px-3 rounded-xl btn-3d-gold text-[#2c1b04] text-[15px] font-black flex items-center gap-1.5 shrink-0 shadow-2xs transition-colors cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-amber-800" />
            <span className="max-w-[100px] truncate">{selectedCity === 'انتخاب استان / شهر' ? 'تهران' : selectedCity}</span>
            <ChevronDown className="w-3 h-3 text-slate-500" />
          </button>

          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="جستجو در املاک، متریال، قیمت و خدمات ساختمانی..."
            className="flex-1 bg-transparent px-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
          />

          <button
            type="submit"
            className="w-8 h-8 rounded-xl btn-3d-gold text-[#2c1b04] flex items-center justify-center transition-transform active:scale-95 shrink-0 cursor-pointer shadow-2xs"
            title="جستجو"
          >
            <Search className="w-4 h-4 stroke-[2.8]" />
          </button>
        </form>

        {/* Right Actions: Role Selector, Notifications, Deal Room, New Ad */}
        <div className="flex items-center gap-2.5 shrink-0">
          
          {/* Role Switcher Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className="h-8.5 px-3 rounded-xl bg-white border-2 border-[#dfc282] text-amber-950 text-[15px] font-black flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <CurrentRoleIcon className="w-3.5 h-3.5 text-[#a87d32]" />
              <span className="max-w-[120px] truncate">{currentRoleConfig.title}</span>
              <ChevronDown className={`w-3 h-3 text-slate-500 transition-transform ${isRoleDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isRoleDropdownOpen && (
              <div 
                className="absolute left-0 mt-2 w-56 bg-white border border-[#e2dacb] rounded-2xl shadow-xl py-2 z-50 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-3 py-1.5 text-[10.5px] font-bold text-slate-400 border-b border-slate-100 mb-1">
                  تغییر نقش کاربری جاری:
                </div>
                {roleConfigs.map((role) => {
                  const RoleIcon = role.icon;
                  const isSelected = role.id === activeRole;
                  return (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => {
                        onRoleChange(role.id);
                        setIsRoleDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-right text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                        isSelected ? 'bg-amber-50 text-amber-900 font-black' : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <RoleIcon className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-600' : 'text-slate-400'}`} />
                        <span>{role.title}</span>
                      </div>
                      {isSelected && <span className="w-2 h-2 rounded-full bg-amber-500" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Notifications Button */}
          <button
            type="button"
            onClick={onOpenNotifications}
            className="relative w-8.5 h-8.5 rounded-xl btn-3d-gold text-[#2c1b04] flex items-center justify-center shadow-2xs cursor-pointer active:scale-95"
            title="اعلانات و پیام‌ها"
          >
            <Bell className="w-4 h-4 stroke-[2.5]" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-rose-600 text-white rounded-full text-[10px] font-black flex items-center justify-center ring-2 ring-white animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Logout Button */}
          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="w-8.5 h-8.5 rounded-xl btn-3d-gold text-[#782020] flex items-center justify-center shadow-2xs cursor-pointer active:scale-95"
              title="خروج از حساب کاربری و ورود مجدد"
              aria-label="خروج"
            >
              <LogOut className="w-4 h-4 stroke-[2.5]" />
            </button>
          )}

          {/* Deal Room Shortcut */}
          <button
            type="button"
            onClick={() => onNavigateTab('deal_room')}
            className={`h-8.5 px-3 rounded-xl text-[15px] font-black flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 ${
              activeTab === 'deal_room' 
                ? 'btn-3d-gold text-[#2c1b04] shadow-xs' 
                : 'bg-white hover:bg-amber-50 text-slate-800 border-2 border-[#dfc282]'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-amber-800" />
            <span>اتاق معامله</span>
          </button>

          {/* Register Ad Button */}
          <button
            type="button"
            onClick={onOpenRegisterModal}
            className="h-8.5 px-3.5 rounded-xl btn-3d-gold text-[#2c1b04] text-[15px] font-black flex items-center gap-1.5 shadow-2xs transition-all active:scale-95 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 stroke-[2.5]" />
            <span>ثبت آگهی</span>
          </button>
        </div>
      </div>

      {/* Desktop Main Navigation Tabs Bar with Smooth Touch/Wheel & Arrow Scrolling */}
      <nav className="relative bg-[#f7f4ed] border-t border-[#ede5d6] px-2 sm:px-6 group/nav select-none">
        <div className="max-w-7xl mx-auto relative flex items-center">
          
          {/* Scroll Right Arrow Button */}
          <button
            type="button"
            onClick={() => handleScrollNav('right')}
            className="absolute right-0 z-20 w-8 h-8.5 rounded-r-xl btn-3d-gold text-[#2c1b04] flex items-center justify-center shadow-md cursor-pointer transition-all active:scale-90 hover:brightness-105 shrink-0"
            title="پیمایش به راست"
            aria-label="پیمایش راست"
          >
            <ChevronRight className="w-4 h-4 stroke-[2.5]" />
          </button>

          {/* Navigation Items Horizontal Container */}
          <div
            ref={navScrollRef}
            onWheel={handleNavWheel}
            className="w-full flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1.5 px-8 sm:px-9 scroll-smooth touch-pan-x overscroll-x-contain"
          >
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  data-tab-id={tab.id}
                  type="button"
                  onClick={() => onNavigateTab(tab.id)}
                  className={`h-8.5 px-3.5 rounded-xl text-[15px] font-black flex items-center gap-1.5 shrink-0 transition-all cursor-pointer active:scale-95 ${
                    isActive
                      ? 'btn-3d-gold text-[#2c1b04] shadow-2xs'
                      : 'text-slate-800 hover:text-amber-950 hover:bg-white/80 border-2 border-transparent hover:border-[#dfc282]'
                  }`}
                >
                  <Icon className={`w-4 h-4 stroke-[2.2] ${isActive ? 'text-[#2c1b04]' : 'text-slate-600'}`} />
                  <span>{tab.label}</span>
                  {tab.highlight && !isActive && (
                    <span className="text-[10px] btn-3d-gold text-[#2c1b04] px-1.5 py-0.2 rounded-md font-black shadow-2xs">
                      ویژه
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Scroll Left Arrow Button */}
          <button
            type="button"
            onClick={() => handleScrollNav('left')}
            className="absolute left-0 z-20 w-8 h-8.5 rounded-l-xl btn-3d-gold text-[#2c1b04] flex items-center justify-center shadow-md cursor-pointer transition-all active:scale-90 hover:brightness-105 shrink-0"
            title="پیمایش به چپ"
            aria-label="پیمایش چپ"
          >
            <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
          </button>

        </div>
      </nav>
    </header>
  );
};
