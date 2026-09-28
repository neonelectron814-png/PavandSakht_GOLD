import React, { useState } from 'react';
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
  Clock
} from 'lucide-react';
import { SvgGoldDefs, PayvandLogoV3, GoldenInstallment3D, GoldenAiMatch3D } from '../common/Golden3DIcons';
import { AdOrderModal, SponsoredAd, PRESET_SPONSOR_MEDIA } from '../modals/AdOrderModal';

import factoryIconImg from '../../assets/images/gold_factory_icon_1790348345530.jpg';
import materialsIconImg from '../../assets/images/gold_materials_icon_1790348354545.jpg';
import handshakeIconImg from '../../assets/images/gold_handshake_icon_1790348362919.jpg';
import villaIconImg from '../../assets/images/gold_villa_icon_1790348371720.jpg';
import documentIconImg from '../../assets/images/gold_document_icon_1790348381782.jpg';
import gavelIconImg from '../../assets/images/gold_gavel_icon_1790348390844.jpg';
import excavatorIconImg from '../../assets/images/gold_excavator_icon_1790348400260.jpg';
import engineerIconImg from '../../assets/images/gold_engineer_icon_1790348408949.jpg';

interface PayvandHomeProps {
  onNavigateTab: (tab: string) => void;
  onOpenFilterSheet?: () => void;
  onOpenCityModal: () => void;
  onOpenNotifications: () => void;
  unreadNotificationsCount?: number;
  selectedCity: string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
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
}) => {
  const [internalSearch, setInternalSearch] = useState(searchQuery);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isAdModalOpen, setIsAdModalOpen] = useState(false);
  const [adScope, setAdScope] = useState<'national' | 'provincial'>('national');

  // Active Sponsored Ad state
  const [currentAd, setCurrentAd] = useState<SponsoredAd>({
    id: 'ad-default',
    brandName: PRESET_SPONSOR_MEDIA[0].title,
    slogan: PRESET_SPONSOR_MEDIA[0].slogan,
    subText: PRESET_SPONSOR_MEDIA[0].subText,
    mediaUrl: PRESET_SPONSOR_MEDIA[0].url,
    isGif: true,
    targetUrl: 'https://payvand-sakht.ir/sponsor',
    durationLabel: '۱ ساعت ویژه (پربازدید)',
    durationHours: 1,
    pricePaid: 1000000,
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (internalSearch.trim()) {
      setSearchQuery(internalSearch);
    }
    onNavigateTab('market');
  };

  const handleAdActivated = (newAd: SponsoredAd) => {
    setCurrentAd(newAd);
  };

  const categories = [
    // 1. املاک و مستغلات (Real Estate Market)
    {
      id: 'real_estate',
      title: 'املاک و مستغلات',
      subtitle: 'رهن، اجاره و فروش',
      image: villaIconImg,
      badge: 'رهن و فروش',
      action: () => onNavigateTab('market'),
    },
    // 2. مشارکت در ساخت (Construction Partnership)
    {
      id: 'participation',
      title: 'مشارکت در ساخت',
      subtitle: 'مالکین و سازندگان',
      image: handshakeIconImg,
      badge: 'سازندگان رتبه‌دار',
      action: () => onNavigateTab('partnership'),
    },
    // 3. مصالح و متریال ساختمانی (Construction Materials)
    {
      id: 'materials_mines',
      title: 'مصالح و متریال',
      subtitle: 'کاشی، فولاد، سیمان و...',
      image: materialsIconImg,
      badge: 'قیمت بورس',
      action: () => onNavigateTab('materials'),
    },
    // 4. کارخانجات و شهرک‌های صنعتی (Manufacturers & Industrial Hubs)
    {
      id: 'industrial',
      title: 'کارخانجات و شهرک‌ها',
      subtitle: 'خرید مستقیم تولیدکننده',
      image: factoryIconImg,
      badge: 'تولید دست اول',
      action: () => onNavigateTab('materials'),
    },
    // 5. فرصت‌های طلایی و نرخ‌شکن (Distressed Deals & Bargains)
    {
      id: 'auctions_deals',
      title: 'فرصت‌های طلایی',
      subtitle: 'مزایدات و نرخ‌شکن',
      image: gavelIconImg,
      badge: 'زیر قیمت',
      action: () => onNavigateTab('rate_cutter'),
    },
    // 6. پیوند عمران (Civil & Mining Heavy Machinery)
    {
      id: 'machinery',
      title: 'پیوند عمران و معادن',
      subtitle: 'ماشین‌آلات سنگین و معدن',
      image: excavatorIconImg,
      badge: 'تجهیزات راه و معدن',
      action: () => onNavigateTab('craftsmen'),
    },
    // 7. استعلام قیمت و متراژ (Price & Specification Inquiry)
    {
      id: 'inquiry',
      title: 'استعلام قیمت و متراژ',
      subtitle: 'شاخص آهن، سیمان و ملک',
      image: documentIconImg,
      badge: 'داده زنده',
      action: () => onNavigateTab('price_data'),
    },
    // 8. پیمانکاران و مجریان ساخت (Contractors & Craftsmen)
    {
      id: 'contractors',
      title: 'پیمانکاران و مجریان',
      subtitle: 'استادکاران و مهندسین',
      image: engineerIconImg,
      badge: 'مجریان ذیصلاح',
      action: () => onNavigateTab('craftsmen'),
    },
    // 9. فروش اقساطی (Instalment Sales)
    {
      id: 'installments',
      title: 'فروش اقساطی',
      subtitle: 'ملک، متریال و تجهیزات',
      isComponent: true,
      component: GoldenInstallment3D,
      badge: 'شرایطی و منعطف',
      action: () => onNavigateTab('installments'),
    },
    // 10. درخواست‌های مشتری و تطبیق هوشمند (Customer Requests & AI Matching)
    {
      id: 'ai_matching',
      title: 'درخواست‌های مشتری',
      subtitle: 'تطبیق هوشمند نیازها',
      isComponent: true,
      component: GoldenAiMatch3D,
      badge: 'استعلام آنی',
      action: () => onNavigateTab('customer_requests'),
    },
  ];

  return (
    <div className="w-full flex flex-col bg-[#f6f4ef] text-[#111827] select-none font-['Vazirmatn',sans-serif] relative overflow-hidden pb-4" dir="rtl">
      {/* Hidden SVG Gradient Definitions */}
      <SvgGoldDefs />

      {/* =========================================================================
          TOP HEADER: 3D GOLD LOCATION PILL, BRAND LOGO & 3D GOLD NOTIFICATION BELL
          ========================================================================= */}
      <header className="w-full pt-4 px-4 pb-2 relative flex items-center justify-between z-10">
        
        {/* Right side in RTL: 3D Gold Location Button */}
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={onOpenCityModal}
          className="btn-3d-gold rounded-2xl px-3.5 py-1.5 flex flex-col items-start cursor-pointer transition-all shrink-0 max-w-[155px] z-20"
        >
          <div className="flex items-center justify-between w-full gap-1">
            <div className="flex items-center gap-1 min-w-0">
              <span className="text-xs font-black text-[#221503] truncate max-w-[100px]">
                {selectedCity === 'انتخاب استان / شهر' ? 'تهران' : selectedCity}
              </span>
              <MapPin className="w-3.5 h-3.5 text-[#5e3e09] shrink-0" />
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#5e3e09] shrink-0" />
          </div>
          <span className="text-[9.5px] text-[#4b330e] font-extrabold mt-0.5 truncate">
            انتخاب استان ، شهر
          </span>
        </motion.button>

        {/* Center: Brand Logo Emblem - Exactly Centered in Viewport */}
        <div className="absolute inset-x-0 top-0 bottom-0 flex items-center justify-center pointer-events-none">
          <motion.button 
            whileTap={{ scale: 0.93 }}
            className="flex items-center justify-center cursor-pointer p-1.5 pointer-events-auto" 
            onClick={() => onNavigateTab('home')}
            title="پیوندساخت"
          >
            <PayvandLogoV3 className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 filter drop-shadow-[0_3px_10px_rgba(180,130,40,0.3)]" />
          </motion.button>
        </div>

        {/* Left side in RTL: 3D Gold Notification Bell Button */}
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={onOpenNotifications}
          className="w-10 h-10 rounded-2xl btn-3d-gold flex items-center justify-center relative cursor-pointer shrink-0 z-20"
          aria-label="اعلان‌ها"
        >
          <Bell className="w-5 h-5 stroke-[2.5] text-[#2c1b04]" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-rose-600 ring-2 ring-white animate-pulse" />
          )}
        </motion.button>
      </header>

      {/* =========================================================================
          SEARCH BAR WITH 3D GOLD ACTION BUTTON
          ========================================================================= */}
      <div className="w-full px-4 mt-2 z-10">
        <form
          onSubmit={handleSearchSubmit}
          className="w-full bg-white rounded-2xl border-2 border-[#dfc282] shadow-[0_4px_12px_rgba(0,0,0,0.03)] flex items-center px-2 py-1.5 focus-within:border-[#caa758] transition-all"
        >
          <input
            type="text"
            value={internalSearch}
            onChange={(e) => setInternalSearch(e.target.value)}
            placeholder="... جستجو در آگهی‌ها، محصولات، خدمات و متریال"
            className="flex-1 bg-transparent px-3 text-xs font-bold text-slate-950 placeholder-slate-400 focus:outline-none text-right"
            dir="rtl"
          />

          {/* 3D Gold Search Button */}
          <button
            type="submit"
            className="btn-3d-gold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer"
            title="جستجو"
          >
            <Search className="w-3.5 h-3.5 text-[#2c1b04] stroke-[2.8]" />
            <span className="text-[11px] font-black text-[#2c1b04]">جستجو</span>
          </button>
        </form>
      </div>

      {/* =========================================================================
          VIP SPONSORED ADVERTISING BANNER (بنر ویژه تبلیغاتی / اسپانسری و رزرو بنر)
          ========================================================================= */}
      <div className="w-full px-3.5 sm:px-4 mt-2.5 z-10 max-w-lg mx-auto">
        <div className="relative rounded-2xl overflow-hidden border-2 border-[#ebd39e] shadow-[0_4px_16px_rgba(180,130,40,0.15)] bg-gradient-to-l from-[#1e1507] via-[#2f220c] to-[#120d04] text-white">
          {/* Top Banner Tag & Reservation Button */}
          <div className="flex items-center justify-between px-3 py-1.5 bg-black/40 border-b border-amber-500/20 backdrop-blur-xs">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
              </span>
              <span className="text-[10px] font-black text-amber-300">اسپانسر ویژه صنعت ساختمان</span>
              {currentAd.isGif && (
                <span className="bg-amber-500/20 text-amber-300 border border-amber-400/40 text-[8.5px] px-1.5 py-0.5 rounded-md font-bold">
                  GIF پویا
                </span>
              )}
            </div>

            <motion.button
              whileTap={{ scale: 0.93 }}
              onClick={() => setIsAdModalOpen(true)}
              className="btn-3d-gold text-[9.5px] font-black px-2.5 py-1 rounded-lg flex items-center gap-1 text-[#221503] cursor-pointer shadow-xs"
            >
              <Megaphone className="w-3 h-3 text-[#221503]" />
              <span>رزرو بنر تبلیغاتی</span>
            </motion.button>
          </div>

          {/* Banner Media & Details Area */}
          <div 
            onClick={() => setIsAdModalOpen(true)}
            className="p-3 flex items-center gap-3 cursor-pointer group hover:bg-white/5 transition-colors"
          >
            {/* Banner Thumbnail Image / GIF */}
            <div className="relative w-20 h-16 sm:w-22 sm:h-18 rounded-xl overflow-hidden shrink-0 border border-amber-400/40 shadow-inner">
              <img
                src={currentAd.mediaUrl}
                alt={currentAd.brandName}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-1 right-1">
                <span className="bg-amber-500 text-slate-950 text-[8px] font-black px-1 rounded-xs">
                  VIP
                </span>
              </div>
            </div>

            {/* Banner Text Content */}
            <div className="flex-1 min-w-0">
              <h3 className="text-xs sm:text-[13px] font-black text-amber-200 truncate group-hover:text-amber-100 transition-colors">
                {currentAd.brandName}
              </h3>
              <p className="text-[10px] sm:text-[10.5px] font-bold text-slate-300 mt-0.5 line-clamp-1">
                {currentAd.slogan}
              </p>
              <div className="flex items-center gap-2 mt-1.5 text-[9px] text-amber-400/90 font-medium">
                <span className="flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5" />
                  {currentAd.durationLabel}
                </span>
                <span>•</span>
                <span className="text-slate-400 underline flex items-center gap-0.5">
                  کلیک برای مشاهده و تعرفه‌ها
                  <ChevronLeft className="w-2.5 h-2.5" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Categories Grid - Enhanced Spacing & Typographic Contrast */}
      <main className="w-full px-3.5 sm:px-4 mt-2 z-10 max-w-lg mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3" dir="rtl">
          {categories.map((cat) => {
            const IconComponent = cat.isComponent ? cat.component : null;
            return (
              <motion.button
                key={cat.id}
                whileTap={{ scale: 0.94, y: 1 }}
                whileHover={{ y: -2 }}
                onClick={cat.action}
                className="bg-white rounded-[22px] px-2 py-3 border-2 border-[#e6dfd3] hover:border-[#caa758] shadow-[0_3px_0_#d5c8b2,0_6px_14px_rgba(0,0,0,0.03)] hover:shadow-[0_5px_0_#b88a31,0_10px_20px_rgba(180,130,40,0.15)] transition-all flex flex-col items-center justify-center text-center h-[138px] sm:h-[142px] cursor-pointer group select-none relative overflow-hidden"
              >
                {/* Golden 3D Accent corner line */}
                <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-transparent via-[#e6be68] to-transparent opacity-80" />

                {/* 3D Realistic Golden Icon */}
                <div className="w-14 h-14 sm:w-15 sm:h-15 rounded-2xl flex items-center justify-center transform group-hover:scale-106 transition-transform shrink-0">
                  {IconComponent ? (
                    <IconComponent className="w-full h-full" />
                  ) : (
                    <img
                      src={cat.image}
                      alt={cat.title}
                      loading="eager"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain filter drop-shadow-[0_4px_6px_rgba(160,118,48,0.22)]"
                    />
                  )}
                </div>

                {/* 2-line Label: Crisp Persian Typography with Clear Hierarchy */}
                <div className="mt-1.5 w-full px-0.5 flex flex-col items-center justify-center">
                  <span className="block text-[12px] sm:text-[12.5px] font-black text-slate-950 leading-tight tracking-tight whitespace-nowrap">
                    {cat.title}
                  </span>
                  <span className="block text-[10px] sm:text-[10.5px] font-bold text-[#644b1c] leading-tight tracking-tight mt-0.5 whitespace-nowrap">
                    {cat.subtitle}
                  </span>
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
