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
import { SvgGoldDefs, PayvandLogoV3 } from '../common/Golden3DIcons';
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
    // ROW 1 (From Right to Left in RTL)
    {
      id: 'industrial',
      title: 'کارخانجات و',
      subtitle: 'شهرک‌های صنعتی',
      image: factoryIconImg,
      action: () => {
        onNavigateTab('materials');
      },
    },
    {
      id: 'materials_mines',
      title: 'معادن سنگ، سیمان',
      subtitle: 'و مصالح ساختمانی',
      image: materialsIconImg,
      action: () => onNavigateTab('materials'),
    },
    {
      id: 'participation',
      title: 'مشارکت در ساخت',
      subtitle: 'و تهاتر ملکی',
      image: handshakeIconImg,
      action: () => onNavigateTab('partnership'),
    },
    {
      id: 'real_estate',
      title: 'املاک مسکونی',
      subtitle: 'و تجاری سالم',
      image: villaIconImg,
      action: () => onNavigateTab('market'),
    },

    // ROW 2 (From Right to Left in RTL)
    {
      id: 'inquiry',
      title: 'استعلام قیمت',
      subtitle: 'و متراژ',
      image: documentIconImg,
      action: () => onNavigateTab('price_data'),
    },
    {
      id: 'auctions_deals',
      title: 'فرصت‌های طلایی',
      subtitle: 'و مزایده و...',
      image: gavelIconImg,
      action: () => onNavigateTab('rate_cutter'),
    },
    {
      id: 'machinery',
      title: 'ماشین‌آلات و',
      subtitle: 'تجهیزات',
      image: excavatorIconImg,
      action: () => onNavigateTab('craftsmen'),
    },
    {
      id: 'contractors',
      title: 'پیمانکاران و',
      subtitle: 'مجریان ساخت',
      image: engineerIconImg,
      action: () => onNavigateTab('craftsmen'),
    },
  ];

  return (
    <div className="w-full flex flex-col bg-[#f6f4ef] text-[#111827] select-none font-['Vazirmatn',sans-serif] relative overflow-hidden pb-24" dir="rtl">
      {/* Hidden SVG Gradient Definitions */}
      <SvgGoldDefs />

      {/* =========================================================================
          TOP HEADER: 3D GOLD LOCATION PILL, BRAND LOGO & 3D GOLD NOTIFICATION BELL
          ========================================================================= */}
      <header className="w-full pt-4 px-4 pb-2 flex items-center justify-between gap-2 z-10">
        
        {/* Right side in RTL: 3D Gold Location Button */}
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={onOpenCityModal}
          className="btn-3d-gold rounded-2xl px-3.5 py-1.5 flex flex-col items-start cursor-pointer transition-all shrink-0 max-w-[155px]"
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

        {/* Center: Brand Logo Emblem & Title */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigateTab('home')}>
          <div className="text-left">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none">
              پیوندساخت
            </h1>
            <p className="text-[10px] sm:text-[10.5px] text-slate-700 font-black tracking-tight mt-1">
              آغاز هر ساخت‌وساز، یک پیوند است
            </p>
          </div>
          <PayvandLogoV3 className="w-8 h-8 sm:w-9 sm:h-9 shrink-0" />
        </div>

        {/* Left side in RTL: 3D Gold Notification Bell Button */}
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={onOpenNotifications}
          className="w-10 h-10 rounded-2xl btn-3d-gold flex items-center justify-center relative cursor-pointer shrink-0"
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
          HERO BANNER: SPONSORSHIP & ADVERTISING BANNER / GIF SHOWCASE
          ========================================================================= */}
      <div className="w-full px-4 mt-3.5 z-10">
        <div className="relative rounded-[26px] overflow-hidden bg-gradient-to-r from-[#171d24] via-[#1c222b] to-[#12161b] text-white shadow-[0_8px_26px_rgba(0,0,0,0.18)] min-h-[175px] sm:min-h-[190px] flex items-center border-2 border-[#d4a749]">
          
          {/* Background Sponsored Media (Image / GIF) */}
          <div className="absolute top-0 left-0 w-1/2 h-full overflow-hidden pointer-events-none">
            <img
              src={currentAd.mediaUrl}
              alt={currentAd.brandName}
              className="w-full h-full object-cover object-center opacity-95 transition-opacity duration-700"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
            {/* Smooth Gradient Blend to Dark Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#1c222b]/60 to-[#171d24]" />
          </div>

          {/* Left / Text Side */}
          <div className="relative z-10 p-4 sm:p-5 max-w-[64%] sm:max-w-[60%] flex flex-col justify-between h-full space-y-2">
            
            {/* Top Badge: Sponsor Indicator */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="inline-flex items-center gap-1 text-[9.5px] bg-[#d4a749]/25 text-[#fce7b0] border border-[#d4a749]/50 px-2.5 py-0.5 rounded-full font-black backdrop-blur-xs">
                <Sparkles className="w-3 h-3 text-[#fce7b0] animate-pulse" />
                <span>جایگاه ویژه اسپانسرینگ (GIF / بنر)</span>
              </span>
              {currentAd.isGif && (
                <span className="text-[9px] bg-rose-600/80 text-white font-black px-1.5 py-0.2 rounded-md">
                  GIF پویا
                </span>
              )}
            </div>

            <div>
              <h2 className="text-sm sm:text-base font-black tracking-tight leading-snug text-white">
                {currentAd.slogan}
              </h2>
              <p className="text-[10px] sm:text-[10.5px] text-slate-300 font-semibold mt-1 leading-relaxed line-clamp-2">
                {currentAd.subText}
              </p>
            </div>

            {/* 3D Gold Action Buttons on Banner */}
            <div className="pt-1 flex flex-wrap items-center gap-2">
              {/* Primary 3D Gold: Order / Place Ad Button */}
              <button
                onClick={() => setIsAdModalOpen(true)}
                className="btn-3d-gold px-3.5 py-1.5 rounded-xl text-[11px] font-black flex items-center gap-1.5 shadow-md cursor-pointer"
                title="سفارش بنر یا گیف در این جایگاه"
              >
                <Megaphone className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>سفارش و درج بنر شما 👈</span>
              </button>

              {/* Secondary Button: Visit Sponsor Destination */}
              <button
                onClick={() => {
                  if (currentAd.targetUrl.startsWith('http')) {
                    window.open(currentAd.targetUrl, '_blank');
                  } else {
                    onNavigateTab('market');
                  }
                }}
                className="btn-3d-gold-dark px-3 py-1.5 rounded-xl text-[10px] font-black flex items-center gap-1 cursor-pointer"
                title="مشاهده اطلاعات اسپانسر"
              >
                <span>مشاهده برند</span>
                <ChevronLeft className="w-3 h-3" />
              </button>
            </div>

            {/* Carousel Dots & Info */}
            <div className="flex items-center justify-between pt-0.5 text-[9.5px] text-slate-400 font-semibold">
              <span className="flex items-center gap-1 text-[#fce7b0] font-black">
                <Clock className="w-3 h-3 text-[#d4a749]" />
                تعرفه: ۱ ساعت ۱ م.ت / ماهانه
              </span>

              <div className="flex items-center gap-1">
                {[0, 1, 2, 3].map((dot) => (
                  <button
                    key={dot}
                    onClick={() => {
                      setActiveSlide(dot);
                      const preset = PRESET_SPONSOR_MEDIA[dot % PRESET_SPONSOR_MEDIA.length];
                      setCurrentAd({
                        id: 'ad-' + dot,
                        brandName: preset.title,
                        slogan: preset.slogan,
                        subText: preset.subText,
                        mediaUrl: preset.url,
                        isGif: preset.isGif,
                        targetUrl: 'https://payvand-sakht.ir/sponsor',
                        durationLabel: '۱ ساعت ویژه',
                        durationHours: 1,
                        pricePaid: 1000000,
                      });
                    }}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      activeSlide === dot ? 'w-4 bg-[#caa758]' : 'w-1.5 bg-white/40'
                    }`}
                    aria-label={`اسلاید ${dot + 1}`}
                  />
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* =========================================================================
          THE 8 CATEGORIES GRID WITH 3D GOLD DEPTH
          ========================================================================= */}
      <main className="w-full px-4 mt-3.5 z-10">
        <div className="grid grid-cols-4 gap-2.5 sm:gap-3" dir="rtl">
          {categories.map((cat) => (
            <motion.button
              key={cat.id}
              whileTap={{ scale: 0.93, y: 1 }}
              whileHover={{ y: -3 }}
              onClick={cat.action}
              className="bg-white rounded-[22px] p-2.5 sm:p-3 border-2 border-[#e6dfd3] hover:border-[#caa758] shadow-[0_4px_0_#d5c8b2,0_8px_16px_rgba(0,0,0,0.04)] hover:shadow-[0_6px_0_#b88a31,0_12px_22px_rgba(180,130,40,0.18)] transition-all flex flex-col items-center justify-between text-center min-h-[124px] sm:min-h-[130px] cursor-pointer group select-none relative overflow-hidden"
            >
              {/* Golden 3D Accent corner line */}
              <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-transparent via-[#e6be68] to-transparent opacity-80" />

              {/* 3D Realistic Golden Icon Photo */}
              <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl overflow-hidden flex items-center justify-center transform group-hover:scale-108 transition-transform">
                <img
                  src={cat.image}
                  alt={cat.title}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain filter drop-shadow-[0_3px_5px_rgba(160,118,48,0.25)]"
                />
              </div>

              {/* 2-line Label: SOLID BLACK, BOLD, NEVER BLURRED */}
              <div className="mt-1.5 w-full">
                <span className="block text-[11px] sm:text-[11.5px] font-black text-slate-950 leading-tight tracking-tight">
                  {cat.title}
                </span>
                <span className="block text-[10.5px] sm:text-[11px] font-black text-slate-950 leading-tight tracking-tight mt-0.5">
                  {cat.subtitle}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </main>

      {/* =========================================================================
          ADVERTISING & SPONSORSHIP MODAL WITH SHAPARAK GATEWAY
          ========================================================================= */}
      <AdOrderModal
        isOpen={isAdModalOpen}
        onClose={() => setIsAdModalOpen(false)}
        onAdActivated={handleAdActivated}
      />

    </div>
  );
};
