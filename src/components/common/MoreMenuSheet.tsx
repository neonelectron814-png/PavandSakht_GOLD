import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Sparkles, 
  Search,
  ChevronLeft
} from 'lucide-react';
import { UserRole } from '../../types';
import { 
  GoldenVilla3D,
  GoldenHandshake3D,
  GoldenMaterials3D,
  GoldenIndustrial3D,
  GoldenScrapMetal3D,
  GoldenGavel3D,
  GoldenExcavator3D,
  GoldenDocumentSearch3D,
  GoldenEngineer3D,
  GoldenInstallment3D,
  GoldenAiMatch3D,
  Golden3DStudio,
  GoldenBarter3D,
  GoldenDealRoom3D,
  GoldenAudio3D,
  GoldenShieldSecurity3D,
  GoldenUserDashboard3D,
} from './Golden3DIcons';

interface MoreMenuSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: string) => void;
  onOpenLiveFeed: () => void;
  activeRole: UserRole;
  activeTab: string;
  unreadNotificationsCount: number;
}

export const MoreMenuSheet: React.FC<MoreMenuSheetProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  onOpenLiveFeed,
  activeTab,
}) => {
  const [filterCategory, setFilterCategory] = useState<'all' | 'specialized' | 'tools'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const allCategories = useMemo(() => [
    {
      id: 'market',
      category: 'specialized',
      title: 'املاک و مستغلات',
      subtitle: 'رهن، اجاره و فروش فایل‌های ملکی',
      IconComponent: GoldenVilla3D,
      badge: 'رهن و فروش',
    },
    {
      id: 'partnership',
      category: 'specialized',
      title: 'مشارکت در ساخت',
      subtitle: 'اتصال مالکین به سازندگان رتبه‌دار',
      IconComponent: GoldenHandshake3D,
      badge: 'ویژه مالکین',
    },
    {
      id: 'materials',
      category: 'specialized',
      title: 'مصالح و متریال ساختمانی',
      subtitle: 'کاشی، سیمان، میلگرد، لوله و درب',
      IconComponent: GoldenMaterials3D,
      badge: 'قیمت بورس',
    },
    {
      id: 'scrap_materials',
      category: 'specialized',
      title: 'ضایعات و بازیافت ساختمانی',
      subtitle: 'آهن قراضه، میلگرد، ضایعات تخریب و فلزات',
      IconComponent: GoldenScrapMetal3D,
      badge: 'شکار ضایعات',
      actionTab: 'materials',
    },
    {
      id: 'industrial',
      category: 'specialized',
      title: 'کارخانجات و شهرک‌های صنعتی',
      subtitle: 'تأمین مستقیم عمده از تولیدکنندگان دسته اول',
      IconComponent: GoldenIndustrial3D,
      badge: 'مستقیم کارخانه',
    },
    {
      id: 'craftsmen',
      category: 'specialized',
      title: 'پیوند عمران و معادن سنگین',
      subtitle: 'ماشین‌آلات سنگین، معادن و راه‌سازی',
      IconComponent: GoldenExcavator3D,
      badge: 'تجهیزات سنگین',
    },
    {
      id: 'rate_cutter',
      category: 'specialized',
      title: 'فرصت‌های طلایی و نرخ‌شکن',
      subtitle: 'فروش زیر قیمت کارشناسی و مزایدات',
      IconComponent: GoldenGavel3D,
      badge: 'زیر قیمت',
    },
    {
      id: 'price_data',
      category: 'tools',
      title: 'استعلام قیمت و متراژ',
      subtitle: 'شاخص رسمی آهن، میلگرد، سیمان و مسکن',
      IconComponent: GoldenDocumentSearch3D,
      badge: 'داده زنده',
    },
    {
      id: 'contractors',
      category: 'specialized',
      title: 'پیمانکاران و مجریان ساخت',
      subtitle: 'استادکاران، گچ‌کار، سنگ‌کار و مهندسین',
      IconComponent: GoldenEngineer3D,
      badge: 'دارای رتبه',
      actionTab: 'craftsmen',
    },
    {
      id: 'installments',
      category: 'specialized',
      title: 'فروش اقساطی ملک و تجهیزات',
      subtitle: 'برنامه‌های منعطف اقساطی متریال و ماشین‌آلات',
      IconComponent: GoldenInstallment3D,
      badge: 'اقساط ویژه',
    },
    {
      id: 'customer_requests',
      category: 'tools',
      title: 'درخواست‌های مشتری و تطبیق هوشمند',
      subtitle: 'ثبت نیازمندی و دریافت آنی استعلام از تأمین‌کنندگان',
      IconComponent: GoldenAiMatch3D,
      badge: 'هوشمند',
    },
    {
      id: 'building_3d',
      category: 'tools',
      title: 'استودیو ۳بعدی و هوش مصنوعی',
      subtitle: 'شبیه‌سازی ۳بعدی ساختمان، متریال و متره',
      IconComponent: Golden3DStudio,
      badge: '3D Studio',
    },
    {
      id: 'deal_room',
      category: 'tools',
      title: 'اتاق معامله امن (Deal Room)',
      subtitle: 'استعلام ثنا، اصالت سند و ارزیابی محرمانه',
      IconComponent: GoldenDealRoom3D,
      badge: 'محرمانه',
    },
    {
      id: 'barter',
      category: 'specialized',
      title: 'اتاق تهاتر هوشمند',
      subtitle: 'تهاتر ملک با ملک، متریال، خودرو یا مصالح',
      IconComponent: GoldenBarter3D,
      badge: 'تهاتر رسمی',
    },
    {
      id: 'audio_analysis',
      category: 'tools',
      title: 'استعلام صوتی و تحلیل هوشمند',
      subtitle: 'جستجو و تطبیق نیازمندی ملکی با فرمان صوتی',
      IconComponent: GoldenAudio3D,
      badge: 'صوتی AI',
    },
    {
      id: 'admin_panel',
      category: 'tools',
      title: 'پنل نظارت و امنیت ضد تقلب',
      subtitle: 'سامانه غربالگری و تایید اصالت آگهی‌ها',
      IconComponent: GoldenShieldSecurity3D,
      badge: 'امنیت سامانه',
    },
    {
      id: 'role_dashboard',
      category: 'tools',
      title: 'داشبورد کاربری من',
      subtitle: 'مدیریت فایل‌ها، استعلام‌ها و پیام‌ها',
      IconComponent: GoldenUserDashboard3D,
      badge: 'میز کار',
    },
  ], []);

  const displayedCategories = useMemo(() => {
    return allCategories.filter(item => {
      const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
      const matchesSearch = !searchQuery.trim() || 
        item.title.includes(searchQuery.trim()) || 
        item.subtitle.includes(searchQuery.trim());
      return matchesCategory && matchesSearch;
    });
  }, [allCategories, filterCategory, searchQuery]);

  const handleItemClick = (item: typeof allCategories[0]) => {
    onClose();
    const target = item.actionTab || item.id;
    if (target === 'live_feed_action') {
      onOpenLiveFeed();
    } else {
      onNavigateTab(target);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 pointer-events-auto" dir="rtl">
          {/* Backdrop Dimmer */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={onClose}
          />

          {/* Clean, Centered Luxury Modal Card - Perfectly visible, never off-screen */}
          <motion.div
            key="modal-card"
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 15 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-lg max-h-[88vh] bg-[#fbf9f4] border-2 border-[#dfc282] rounded-[30px] shadow-[0_25px_60px_rgba(150,105,30,0.32)] flex flex-col text-slate-900 overflow-hidden z-10"
            onClick={(e) => e.stopPropagation()}
            style={{ willChange: 'transform, opacity' }}
          >
            {/* Header: Clean, balanced, with ONLY ONE 'X' close button */}
            <div className="px-5 py-3.5 flex items-center justify-between border-b border-[#e8dfcf] bg-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl btn-3d-gold flex items-center justify-center text-[#2c1b04] shadow-2xs">
                  <Sparkles className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="font-black text-slate-950 text-base sm:text-lg leading-tight">
                    دسته‌بندی‌های پیوندساخت
                  </h3>
                  <p className="text-xs text-amber-900/80 font-bold mt-0.5">
                    دسترسی سریع به بازارها با آیکون‌های ۳بعدی طلایی
                  </p>
                </div>
              </div>

              {/* ONLY ONE Close Button: Minimalist, elegant 'X' */}
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-600 border border-slate-200 hover:border-red-200 flex items-center justify-center cursor-pointer shadow-2xs active:scale-90 transition-all"
                aria-label="بستن"
                title="بستن پنجره"
              >
                <X className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>

            {/* Quick Search & Filter Chips */}
            <div className="p-3 sm:px-4 border-b border-[#ede5d6] bg-[#faf6ee] space-y-2.5 shrink-0">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="جستجوی سریع میان دسته‌بندی‌ها و خدمات..."
                  className="w-full bg-white border border-[#dfc282] focus:border-[#b88a31] rounded-xl py-2 pl-9 pr-9 text-xs sm:text-sm font-bold text-slate-950 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20 shadow-2xs transition-all"
                />
                <Search className="w-4 h-4 text-[#9a7228] absolute right-3 top-2.5" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute left-3 top-2.5 text-slate-400 hover:text-slate-700"
                  >
                    <X className="w-4 h-4 stroke-[2.5]" />
                  </button>
                )}
              </div>

              {/* Category Filter Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-0.5" style={{ scrollbarWidth: 'none' }}>
                <button
                  onClick={() => setFilterCategory('all')}
                  className={`h-8 px-3.5 rounded-xl text-xs sm:text-[13px] font-black whitespace-nowrap cursor-pointer transition-all ${
                    filterCategory === 'all'
                      ? 'btn-3d-gold text-[#2c1b04] shadow-2xs'
                      : 'bg-white text-slate-700 border border-[#ded5c5] hover:bg-amber-50/70'
                  }`}
                >
                  همه بخش‌ها ({allCategories.length})
                </button>
                <button
                  onClick={() => setFilterCategory('specialized')}
                  className={`h-8 px-3.5 rounded-xl text-xs sm:text-[13px] font-black whitespace-nowrap cursor-pointer transition-all ${
                    filterCategory === 'specialized'
                      ? 'btn-3d-gold text-[#2c1b04] shadow-2xs'
                      : 'bg-white text-slate-700 border border-[#ded5c5] hover:bg-amber-50/70'
                  }`}
                >
                  بخش‌های تخصصی
                </button>
                <button
                  onClick={() => setFilterCategory('tools')}
                  className={`h-8 px-3.5 rounded-xl text-xs sm:text-[13px] font-black whitespace-nowrap cursor-pointer transition-all ${
                    filterCategory === 'tools'
                      ? 'btn-3d-gold text-[#2c1b04] shadow-2xs'
                      : 'bg-white text-slate-700 border border-[#ded5c5] hover:bg-amber-50/70'
                  }`}
                >
                  ابزارها و هوش مصنوعی
                </button>
              </div>
            </div>

            {/* List of Category Cards with 3D Golden WebP Icons */}
            <div 
              className="p-3 sm:p-4 space-y-2.5 overflow-y-auto max-h-[60vh] overscroll-contain" 
              style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'thin' }}
            >
              {displayedCategories.map((item) => {
                const IconComponent = item.IconComponent;
                const isItemActive = activeTab === item.id || (item.actionTab && activeTab === item.actionTab);

                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    className={`w-full p-2.5 sm:p-3 rounded-2xl border-2 text-right transition-all flex items-center justify-between gap-3 cursor-pointer group active:scale-[0.99] select-none ${
                      isItemActive
                        ? 'bg-amber-50/90 border-[#cfa453] shadow-[0_4px_14px_rgba(180,130,40,0.12)] ring-1 ring-[#cfa453]'
                        : 'bg-white border-[#ebdcc4] hover:border-[#caa758] hover:bg-[#fffdf9] hover:shadow-[0_4px_14px_rgba(180,130,40,0.08)]'
                    }`}
                  >
                    {/* Right: 3D Golden WebP Icon in rounded badge */}
                    <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-amber-50/50 border border-amber-200/50 flex items-center justify-center shrink-0 p-1 transform group-hover:scale-108 transition-transform">
                      <IconComponent className="w-full h-full" />
                    </div>

                    {/* Middle: Full Title and Subtitle - Never cut off */}
                    <div className="flex-1 min-w-0 pr-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[14px] sm:text-[14.5px] font-black text-slate-950 group-hover:text-amber-950 transition-colors">
                          {item.title}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-[#6a4c1c] mt-0.5 line-clamp-1">
                        {item.subtitle}
                      </p>
                    </div>

                    {/* Left: Badge and Subtle Chevron */}
                    <div className="flex items-center gap-1.5 shrink-0 self-center pl-1">
                      <span className="text-[10.5px] font-bold px-2 py-0.5 rounded-lg bg-amber-100/80 text-amber-950 border border-amber-300/80 whitespace-nowrap">
                        {item.badge}
                      </span>
                      <ChevronLeft className="w-4 h-4 text-amber-700/60 group-hover:text-amber-900 group-hover:-translate-x-0.5 transition-all" />
                    </div>
                  </button>
                );
              })}

              {displayedCategories.length === 0 && (
                <div className="py-8 text-center text-slate-500 font-bold text-sm">
                  موردی با این عنوان یافت نشد.
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
