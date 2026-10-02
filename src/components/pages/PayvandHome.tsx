import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  MapPin, 
  ChevronDown, 
  Search, 
  Bell, 
  ChevronLeft,
  Sparkles,
  ExternalLink,
  PlusCircle,
  Megaphone,
  CheckCircle2,
  Clock,
  Layers,
  LogOut
} from 'lucide-react';
import { 
  SvgGoldDefs, 
  PayvandLogoV3, 
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
  GoldenBarter3D
} from '../common/Golden3DIcons';
import { AdOrderModal, SponsoredAd, DEFAULT_AD, normalizeTargetUrl } from '../modals/AdOrderModal';
import { AnimatedTypewriterTopic } from '../common/AnimatedTypewriterTopic';
import { useAdQueue } from '../../hooks/useAdQueue';
import { toPersianDigits } from '../../utils/formatters';

interface PayvandHomeProps {
  onNavigateTab: (tab: string) => void;
  onOpenFilterSheet?: () => void;
  onOpenCityModal: () => void;
  onOpenNotifications: () => void;
  unreadNotificationsCount?: number;
  selectedCity: string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onLogout?: () => void;
  onOpenLiveFeed?: () => void;
}

export const PayvandHome: React.FC<PayvandHomeProps> = ({
  onNavigateTab,
  onOpenFilterSheet,
  onOpenCityModal,
  onOpenNotifications,
  unreadNotificationsCount = 0,
  selectedCity,
  searchQuery,
  setSearchQuery,
  onLogout,
  onOpenLiveFeed,
}) => {
  const [internalSearch, setInternalSearch] = useState(searchQuery);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isAdModalOpen, setIsAdModalOpen] = useState(false);
  const [adScope, setAdScope] = useState<'national' | 'provincial'>('national');
  const { activeAd: currentAd, queueCount, formattedRemainingTime } = useAdQueue();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (internalSearch.trim()) {
      setSearchQuery(internalSearch);
    }
    onNavigateTab('market');
  };

  const handleAdActivated = (_newAd: SponsoredAd) => {
    // Automatically handled by useAdQueue & real-time event dispatcher
  };

  const categories = useMemo(() => [
    // 1. املاک و مستغلات (Real Estate Market)
    {
      id: 'real_estate',
      title: 'املاک و مستغلات',
      subtitle: 'رهن، اجاره و فروش',
      isComponent: true,
      component: GoldenVilla3D,
      badge: 'رهن و فروش',
      action: () => onNavigateTab('market'),
    },
    // 2. مشارکت در ساخت (Construction Partnership)
    {
      id: 'participation',
      title: 'مشارکت در ساخت',
      subtitle: 'مالکین و سازندگان',
      isComponent: true,
      component: GoldenHandshake3D,
      badge: 'سازندگان رتبه‌دار',
      action: () => onNavigateTab('partnership'),
    },
    // 3. مصالح و متریال ساختمانی (Construction Materials)
    {
      id: 'materials_mines',
      title: 'مصالح و متریال',
      subtitle: 'کاشی، فولاد، سیمان و...',
      isComponent: true,
      component: GoldenMaterials3D,
      badge: 'قیمت بورس',
      action: () => onNavigateTab('materials'),
    },
    // 2. ضایعات و بازیافت ساختمانی (Construction Scrap & Metal Waste)
    {
      id: 'scrap_metals',
      title: 'ضایعات و بازیافت',
      subtitle: 'آهن قراضه، میلگرد و تخریب',
      isComponent: true,
      component: GoldenScrapMetal3D,
      badge: 'شکار ضایعات',
      action: () => onNavigateTab('materials'),
    },
    // 5. کارخانجات و شهرک‌های صنعتی (Manufacturers & Industrial Hubs)
    {
      id: 'industrial',
      title: 'کارخانجات و شهرک‌ها',
      subtitle: 'خرید مستقیم تولیدکننده',
      isComponent: true,
      component: GoldenIndustrial3D,
      badge: 'تولید دست اول',
      action: () => onNavigateTab('materials'),
    },
    // 6. فرصت‌های طلایی و نرخ‌شکن (Distressed Deals & Bargains)
    {
      id: 'auctions_deals',
      title: 'فرصت‌های طلایی',
      subtitle: 'مزایدات و نرخ‌شکن',
      isComponent: true,
      component: GoldenGavel3D,
      badge: 'زیر قیمت',
      action: () => onNavigateTab('rate_cutter'),
    },
    // 7. پیوند عمران (Civil & Mining Heavy Machinery)
    {
      id: 'machinery',
      title: 'پیوند عمران و معادن',
      subtitle: 'ماشین‌آلات سنگین و معدن',
      isComponent: true,
      component: GoldenExcavator3D,
      badge: 'تجهیزات راه و معدن',
      action: () => onNavigateTab('craftsmen'),
    },
    // 8. استعلام قیمت و متراژ (Price & Specification Inquiry)
    {
      id: 'inquiry',
      title: 'استعلام قیمت و متراژ',
      subtitle: 'شاخص آهن، سیمان و ملک',
      isComponent: true,
      component: GoldenDocumentSearch3D,
      badge: 'داده زنده',
      action: () => onNavigateTab('price_data'),
    },
    // 9. پیمانکاران و مجریان ساخت (Contractors & Craftsmen)
    {
      id: 'contractors',
      title: 'پیمانکاران و مجریان',
      subtitle: 'استادکاران و مهندسین',
      isComponent: true,
      component: GoldenEngineer3D,
      badge: 'مجریان ذیصلاح',
      action: () => onNavigateTab('craftsmen'),
    },
    // 10. فروش اقساطی (Instalment Sales)
    {
      id: 'installments',
      title: 'فروش اقساطی',
      subtitle: 'ملک، متریال و تجهیزات',
      isComponent: true,
      component: GoldenInstallment3D,
      badge: 'شرایطی و منعطف',
      action: () => onNavigateTab('installments'),
    },
    // 11. درخواست‌های مشتری و تطبیق هوشمند (Customer Requests & AI Matching)
    {
      id: 'ai_matching',
      title: 'درخواست‌های مشتری',
      subtitle: 'تطبیق هوشمند نیازها',
      isComponent: true,
      component: GoldenAiMatch3D,
      badge: 'استعلام آنی',
      action: () => onNavigateTab('customer_requests'),
    },
    // 12. تهاتر (Barter & Trade)
    {
      id: 'barter',
      title: 'تهاتر و مبادله',
      subtitle: 'ملک، خودرو و متریال',
      isComponent: true,
      component: GoldenBarter3D,
      badge: 'تهاتر تخصصی',
      action: () => onNavigateTab('barter'),
    },
  ], [onNavigateTab]);

  return (
    <div className="w-full flex flex-col bg-[#f6f4ef] text-[#111827] select-none font-['Vazirmatn',sans-serif] relative pb-6 sm:pb-7" dir="rtl">
      {/* Hidden SVG Gradient Definitions */}
      <SvgGoldDefs />

      {/* =========================================================================
          TOP HEADER: BRAND LOGO ON RIGHT (RTL), TITLE, AND ACTIONS ON LEFT
          ========================================================================= */}
      <header className="w-full pt-1.5 px-3.5 pb-0 relative flex items-center justify-between z-10">
        
        {/* Right side in RTL: Prominent Solo Brand Logo */}
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={() => onNavigateTab('home')}
          className="flex items-center cursor-pointer p-0 select-none z-20 group"
          title="پیوندساخت - صفحه اصلی"
        >
          <div className="w-12 h-12 sm:w-13 sm:h-13 shrink-0 flex items-center justify-center">
            <PayvandLogoV3 className="w-12 h-12 sm:w-13 sm:h-13 object-contain" />
          </div>
        </motion.button>

        {/* Left side in RTL: 3D Gold Logout Button & Notification Bell Button */}
        <div className="flex items-center gap-1.5 z-20">
          {onLogout && (
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={onLogout}
              className="w-8.5 h-8.5 rounded-xl btn-3d-gold flex items-center justify-center relative cursor-pointer shrink-0 shadow-2xs"
              aria-label="خروج از حساب"
              title="خروج و رفتن به صفحه ورود/ثبت‌نام"
            >
              <LogOut className="w-4 h-4 stroke-[2.5] text-[#782020] hover:text-[#9e1c1c] transition-colors" />
            </motion.button>
          )}

          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={onOpenNotifications}
            className="w-8.5 h-8.5 rounded-xl btn-3d-gold flex items-center justify-center relative cursor-pointer shrink-0 shadow-2xs"
            aria-label="اعلان‌ها"
            title="اعلانات و پیام‌ها"
          >
            <Bell className="w-4 h-4 stroke-[2.5] text-[#2c1b04]" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-600 ring-2 ring-white animate-pulse" />
            )}
          </motion.button>
        </div>
      </header>

      {/* =========================================================================
          SEARCH & CITY ROW (Search on Right in RTL, City selector on Left in RTL)
          ========================================================================= */}
      <div className="w-full px-3 mt-1 z-10 flex items-center gap-2" dir="rtl">
        {/* Main Search Bar (Right side in RTL) */}
        <form
          onSubmit={handleSearchSubmit}
          className="flex-1 h-10 bg-white rounded-xl border-2 border-[#dfc282] shadow-2xs flex items-center px-1.5 focus-within:border-[#caa758] transition-all min-w-0"
        >
          {/* 3D Gold Search Button - Smaller, Compact */}
          <button
            type="submit"
            className="btn-3d-gold w-7 h-7 rounded-lg flex items-center justify-center shrink-0 shadow-2xs cursor-pointer active:scale-95 transition-transform"
            title="جستجو"
            aria-label="جستجو"
          >
            <Search className="w-3.5 h-3.5 text-[#2c1b04] stroke-[2.8]" />
          </button>

          <input
            type="text"
            value={internalSearch}
            onChange={(e) => setInternalSearch(e.target.value)}
            placeholder="جستجو در املاک، متریال، تهاتر و..."
            className="flex-1 h-full bg-transparent px-2.5 text-sm font-bold text-slate-950 placeholder-slate-400 focus:outline-none text-right min-w-0"
            dir="rtl"
          />
        </form>

        {/* 3D Gold City / Province Selector Pill (Compact Button, Bigger Text) */}
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={onOpenCityModal}
          className="btn-3d-gold h-10 rounded-xl px-2.5 flex items-center justify-between gap-1.5 cursor-pointer transition-all shrink-0 max-w-[140px] sm:max-w-[160px] shadow-2xs"
          title="انتخاب استان و شهر"
        >
          <div className="flex items-center gap-1 min-w-0">
            <MapPin className="w-3.5 h-3.5 text-[#4b330e] shrink-0" />
            <span className="text-xs sm:text-[12.5px] font-black text-[#221503] truncate">
              {selectedCity === 'انتخاب استان / شهر' ? 'انتخاب شهر' : selectedCity}
            </span>
          </div>
          <ChevronDown className="w-3 h-3 text-[#5e3e09] shrink-0" />
        </motion.button>
      </div>

      {/* =========================================================================
          VIP SPONSORED ADVERTISING BANNER (بنر عریض ویژه تبلیغاتی / اسپانسری و رزرو بنر)
          ========================================================================= */}
      <div className="w-full px-2 sm:px-3 mt-2 z-10 max-w-2xl mx-auto">
        <div className="w-full relative rounded-[26px] sm:rounded-[32px] overflow-hidden border-2 border-[#dfc282] shadow-[0_10px_35px_rgba(180,130,40,0.25)] bg-black text-white">
          {/* Full-Bleed Grand Display Screen - Max Width & Height */}
          <div 
            onClick={() => {
              if (currentAd.targetUrl && currentAd.targetUrl !== '#') {
                const finalUrl = normalizeTargetUrl(currentAd.targetUrl);
                if (finalUrl.startsWith('tel:')) {
                  window.location.href = finalUrl;
                } else {
                  window.open(finalUrl, '_blank', 'noopener,noreferrer');
                }
              } else {
                setIsAdModalOpen(true);
              }
            }}
            className="relative w-full h-64 sm:h-80 md:h-96 overflow-hidden cursor-pointer group bg-black"
          >
            {currentAd.mediaUrl.endsWith('.mp4') || currentAd.mediaUrl.includes('video') ? (
              <video
                src={currentAd.mediaUrl}
                poster="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1200"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
              >
                <source src={currentAd.mediaUrl} type="video/mp4" />
                <source src="/videos/sample-ad.mp4" type="video/mp4" />
              </video>
            ) : (
              <img
                src={currentAd.mediaUrl}
                alt="تبلیغ رسانه‌ای"
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
              />
            )}

            {/* Subtle Gradient overlay for top and bottom controls */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60 pointer-events-none" />

            {/* Animated Typewriter Topic on Mobile Banner (Right Side) */}
            <div className="absolute bottom-3 right-3 z-20 scale-90 sm:scale-100 origin-bottom-right">
              <AnimatedTypewriterTopic topic={currentAd.topic} />
            </div>

            {/* Destination URL Action / Hint Pill at bottom-left */}
            {currentAd.targetUrl && currentAd.targetUrl !== '#' && (
              <div className="absolute bottom-3 left-3 z-20 flex items-center gap-1.5 bg-black/85 backdrop-blur-md text-amber-300 border border-[#dfc282] text-xs font-black px-3 py-1.5 rounded-xl shadow-lg">
                <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>مشاهده وب‌سایت</span>
              </div>
            )}

            {/* Action Bar: Button & Live Queue / Remaining Timer */}
            <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsAdModalOpen(true);
                }}
                className="btn-3d-gold text-[#2c1b04] text-xs font-black px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-1.5 active:scale-95 transition-transform cursor-pointer"
              >
                <Megaphone className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>ثبت تبلیغ در مانیتور</span>
              </button>

              {/* Live Remaining Time Badge */}
              <div className="bg-black/80 backdrop-blur-md text-amber-300 border border-amber-400/35 text-[11px] font-black px-2.5 py-1.5 rounded-xl shadow-lg flex items-center gap-1 select-none">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>باقیمانده: {formattedRemainingTime}</span>
              </div>

              {/* Queue Counter Badge if any queued ads */}
              {queueCount > 0 && (
                <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-[10px] font-black px-2 py-1.5 rounded-xl shadow-lg flex items-center gap-1 select-none">
                  <Layers className="w-3 h-3 text-slate-950" />
                  <span>{toPersianDigits(queueCount)} در صف</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Categories Grid - Exactly 2 Columns Side-by-Side */}
      <main className="w-full px-2 sm:px-3 mt-2 z-10 max-w-2xl mx-auto">
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3" dir="rtl">
          {categories.map((cat) => {
            const IconComponent = cat.isComponent ? cat.component : null;
            return (
              <motion.button
                key={cat.id}
                whileTap={{ scale: 0.94, y: 1 }}
                whileHover={{ y: -3 }}
                onClick={cat.action}
                className="bg-gradient-to-b from-white via-white to-[#fdfaf3] rounded-[24px] px-2.5 py-3 border-2 border-[#e2cca4] hover:border-[#b88a31] shadow-[0_4px_12px_rgba(180,130,40,0.08)] hover:shadow-[0_8px_20px_rgba(180,130,40,0.18)] transition-all flex flex-col items-center justify-between text-center h-[142px] sm:h-[148px] cursor-pointer group select-none relative overflow-hidden"
              >
                {/* Golden 3D Accent top line */}
                <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-transparent via-[#d8a846] to-transparent opacity-90" />

                {/* 3D Realistic Golden Icon - Prominent, Shiny & Centered */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center transform group-hover:scale-110 transition-transform shrink-0 mt-1">
                  {IconComponent && (
                    <IconComponent className="w-full h-full" />
                  )}
                </div>

                {/* 2-line Label: Bigger, Crisp Vazir Persian Typography */}
                <div className="mt-1 w-full px-1 flex flex-col items-center justify-center pb-0.5">
                  <span className="block text-[14px] sm:text-[14.5px] font-black text-slate-950 leading-tight tracking-tight whitespace-nowrap">
                    {cat.title}
                  </span>
                  {cat.subtitle ? (
                    <span className="block text-[11px] sm:text-[11.5px] font-bold text-[#72521c] leading-tight tracking-tight mt-1 whitespace-nowrap">
                      {cat.subtitle}
                    </span>
                  ) : null}
                </div>
              </motion.button>
            );
          })}
        </div>
      </main>

      {/* Modal */}
      <AdOrderModal
        isOpen={isAdModalOpen}
        onClose={() => setIsAdModalOpen(false)}
        onAdActivated={handleAdActivated}
      />

    </div>
  );
};
