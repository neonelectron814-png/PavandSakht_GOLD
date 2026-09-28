import React, { useState } from 'react';
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
  Smartphone
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
}) => {
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

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
    { id: 'deal_room', label: 'اتاق معامله امن', icon: Lock },
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
      
      {/* Top Banner Ticker (Desktop) */}
      {tickerItems.length > 0 && (
        <div className="bg-[#fbf9f4] text-slate-700 py-1.5 px-6 border-b border-[#ebdcc7] text-xs flex items-center justify-between overflow-hidden shadow-xs">
          <div className="flex items-center gap-2 shrink-0">
            <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-0.5 rounded-full text-[10.5px] font-black">
              <Radio className="w-3 h-3 text-amber-600 animate-pulse" />
              <span>نبض زنده بازار</span>
            </span>
          </div>

          <div className="flex items-center gap-6 overflow-x-auto no-scrollbar mx-4 text-[11px] font-bold text-slate-800">
            {tickerItems.slice(0, 4).map((item, idx) => (
              <span key={item.id || idx} className="flex items-center gap-1.5 shrink-0">
                <span className="text-amber-800 font-extrabold">{item.name}:</span>
                <span className="text-slate-900 font-black">{item.price?.toLocaleString('fa-IR')} ت ({item.unit})</span>
                <span className={`text-[10px] font-black ${item.changePercent >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                  {item.changePercent >= 0 ? `+${item.changePercent}` : item.changePercent}٪
                </span>
                {idx < 3 && <span className="text-slate-300 mr-3">|</span>}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3 shrink-0 text-[11px]">
            {onToggleDevicePreview && (
              <button
                type="button"
                onClick={onToggleDevicePreview}
                className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white hover:bg-amber-50 text-slate-800 border border-[#ded5c5] text-[11px] font-bold transition-colors cursor-pointer shadow-2xs"
                title="تغییر نمای نمایشگر"
              >
                {isDevicePreview ? <Smartphone className="w-3.5 h-3.5 text-amber-600" /> : <Monitor className="w-3.5 h-3.5 text-amber-600" />}
                <span>{isDevicePreview ? 'نمای موبایل' : 'نمای وب دسکتاپ'}</span>
              </button>
            )}
            <span className="text-amber-900 font-black hidden xl:inline">اتصالِ هوشمندانه زنجیره ارزش مسکن</span>
          </div>
        </div>
      )}

      {/* Main Desktop Header */}
      <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between gap-6">
        
        {/* Brand Logo */}
        <div 
          className="flex items-center gap-3 shrink-0 cursor-pointer group" 
          onClick={() => onNavigateTab('home')}
        >
          <PayvandLogoV3 className="w-10 h-10 group-hover:scale-105 transition-transform" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-slate-900 tracking-tight">
                پیوندساخت
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
                سامانه ملی
              </span>
            </div>
            <p className="text-[11px] text-amber-900 font-black">
              اتصالِ هوشمندانه
            </p>
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
            className="px-3 py-1.5 rounded-xl bg-white border border-[#e8e2d7] hover:bg-amber-50/60 text-xs font-bold text-slate-700 flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-amber-600" />
            <span className="max-w-[100px] truncate">{selectedCity === 'انتخاب استان / شهر' ? 'تهران' : selectedCity}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
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
            className="w-9 h-9 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white flex items-center justify-center transition-transform hover:scale-105 shrink-0 cursor-pointer shadow-sm"
            title="جستجو"
          >
            <Search className="w-4 h-4" />
          </button>
        </form>

        {/* Right Actions: Role Selector, Notifications, Deal Room, New Ad */}
        <div className="flex items-center gap-3 shrink-0">
          
          {/* Role Switcher Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${currentRoleConfig.color}`}
            >
              <CurrentRoleIcon className="w-3.5 h-3.5" />
              <span className="max-w-[120px] truncate">{currentRoleConfig.title}</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${isRoleDropdownOpen ? 'rotate-180' : ''}`} />
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
            className="relative w-10 h-10 rounded-xl bg-slate-100 hover:bg-amber-50 text-slate-700 hover:text-amber-800 border border-slate-200 hover:border-amber-300 flex items-center justify-center transition-colors cursor-pointer"
            title="اعلانات و پیام‌ها"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white rounded-full text-[10px] font-black flex items-center justify-center ring-2 ring-white animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Deal Room Shortcut */}
          <button
            type="button"
            onClick={() => onNavigateTab('deal_room')}
            className={`px-3.5 py-2 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'deal_room' 
                ? 'bg-amber-600 text-white border-amber-700 shadow-md' 
                : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-200'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-amber-700" />
            <span className="hidden xl:inline">اتاق معامله محرمانه</span>
            <span className="xl:hidden">اتاق معامله</span>
          </button>

          {/* Register Ad Button */}
          <button
            type="button"
            onClick={onOpenRegisterModal}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#b88c42] to-[#8d6520] hover:from-[#a67c35] hover:to-[#7a5518] text-white text-xs font-black flex items-center gap-2 shadow-md transition-all hover:scale-102 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>ثبت آگهی</span>
          </button>
        </div>
      </div>

      {/* Desktop Main Navigation Tabs Bar */}
      <nav className="bg-[#f7f4ed] border-t border-[#ede5d6] px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onNavigateTab(tab.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-xs border border-[#decbb0] font-black scale-102'
                    : tab.highlight
                    ? 'text-amber-900 bg-amber-100/70 hover:bg-amber-200/80 font-black border border-amber-300/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-600' : tab.highlight ? 'text-amber-700' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.highlight && !isActive && (
                  <span className="text-[9px] bg-amber-500 text-white px-1.5 py-0.2 rounded-full font-black">
                    ویژه
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
};
