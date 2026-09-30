import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Building2, 
  MapPin, 
  ChevronDown, 
  Search, 
  Lock, 
  Sparkles, 
  PlusCircle, 
  Award,
  ChevronLeft,
  Megaphone,
  Clock,
  Layers,
  ExternalLink
} from 'lucide-react';
import { Property, User, UserRole, PriceIndex, LiveTickerItem } from '../../types';
import { formatTomanShort, toPersianDigits } from '../../utils/formatters';
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
  GoldenBarter3D,
  GoldenDealRoom3D
} from '../common/Golden3DIcons';
import { AdOrderModal, SponsoredAd, DEFAULT_AD, normalizeTargetUrl } from '../modals/AdOrderModal';
import { AnimatedTypewriterTopic } from '../common/AnimatedTypewriterTopic';
import { useAdQueue } from '../../hooks/useAdQueue';

interface PayvandWebDesktopProps {
  currentUser: User;
  activeRole: UserRole;
  properties: Property[];
  priceIndices: PriceIndex[];
  tickerItems: LiveTickerItem[];
  selectedCity: string;
  onOpenCityModal: () => void;
  onNavigateTab: (tab: string) => void;
  onSelectProperty: (property: Property) => void;
  onEnterDealRoom: (propertyCode: string) => void;
  onOpenRegisterModal: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  hideHeader?: boolean;
}

export const PayvandWebDesktop: React.FC<PayvandWebDesktopProps> = ({
  currentUser,
  activeRole,
  properties,
  priceIndices,
  tickerItems,
  selectedCity,
  onOpenCityModal,
  onNavigateTab,
  onSelectProperty,
  onEnterDealRoom,
  onOpenRegisterModal,
  searchQuery,
  setSearchQuery,
  hideHeader = false,
}) => {
  const [localSearch, setLocalSearch] = useState('');
  const [activeSlide, setActiveSlide] = useState(0);
  const [isAdModalOpen, setIsAdModalOpen] = useState(false);
  const [adScope, setAdScope] = useState<'national' | 'provincial'>('national');
  const { activeAd: currentAd, queueCount, formattedRemainingTime } = useAdQueue();

  const services = [
    {
      id: 'market',
      title: 'بازار املاک و مستغلات',
      subtitle: 'معاملات خرید، فروش و رهن فایل‌های اعتبارسنجی‌شده',
      isComponent: true,
      component: GoldenVilla3D,
      badge: 'فایلینگ سراسری',
      highlight: true,
      onClick: () => onNavigateTab('market'),
    },
    {
      id: 'partnership',
      title: 'مشارکت در ساخت',
      subtitle: 'اتصال مالکین زمین به سازندگان رتبه‌دار و معتبر',
      isComponent: true,
      component: GoldenHandshake3D,
      badge: 'سرمایه‌گذاری',
      onClick: () => onNavigateTab('partnership'),
    },
    {
      id: 'materials',
      title: 'مصالح و متریال ساختمانی',
      subtitle: 'خرید مستقیم آهن‌آلات، سیمان، کاشی و تجهیزات',
      isComponent: true,
      component: GoldenMaterials3D,
      badge: 'قیمت بورس و کارخانه',
      onClick: () => onNavigateTab('materials'),
    },
    {
      id: 'scrap_metals',
      title: 'ضایعات و بازیافت ساختمانی',
      subtitle: 'خرید و فروش آهن قراضه، میلگرد، تخریب و فلزات',
      isComponent: true,
      component: GoldenScrapMetal3D,
      badge: 'شکار ضایعات',
      onClick: () => onNavigateTab('materials'),
    },
    {
      id: 'industrial',
      title: 'کارخانجات و شهرک‌های صنعتی',
      subtitle: 'خرید و واگذاری کارخانجات، سوله و انبار صنعتی',
      isComponent: true,
      component: GoldenIndustrial3D,
      badge: 'شهرک‌های صنعتی',
      onClick: () => {
        setSearchQuery('شهرک صنعتی');
        onNavigateTab('market');
      },
    },
    {
      id: 'auctions_deals',
      title: 'فرصت‌های طلایی و مزایده',
      subtitle: 'فایل‌های زیر قیمت کارشناسی و مزایدات معتبر',
      isComponent: true,
      component: GoldenGavel3D,
      badge: 'اکازیون روز',
      onClick: () => onNavigateTab('rate_cutter'),
    },
    {
      id: 'machinery',
      title: 'پیوند عمران و ماشین‌آلات',
      subtitle: 'تأمین و اجاره تاورکرین، بیل مکانیکی و لودر',
      isComponent: true,
      component: GoldenExcavator3D,
      badge: 'تجهیزات سنگین',
      onClick: () => onNavigateTab('craftsmen'),
    },
    {
      id: 'price_estimate',
      title: 'استعلام قیمت و متراژ',
      subtitle: 'دیتاسنتر رسمی قیمت مسکن و محاسبه‌گر متراژ',
      isComponent: true,
      component: GoldenDocumentSearch3D,
      badge: 'داده زنده',
      onClick: () => onNavigateTab('price_data'),
    },
    {
      id: 'contractors',
      title: 'پیمانکاران و مجریان ساخت',
      subtitle: 'فهرست مهندسان نظام مهندسی و اکیپ‌های مجرب',
      isComponent: true,
      component: GoldenEngineer3D,
      badge: 'مجریان ذیصلاح',
      onClick: () => onNavigateTab('craftsmen'),
    },
    {
      id: 'installments',
      title: 'فروش اقساطی ملک و تجهیزات',
      subtitle: 'طرح‌های پرداخت منعطف برای پروژه و متریال',
      isComponent: true,
      component: GoldenInstallment3D,
      badge: 'طرح اقساطی',
      onClick: () => onNavigateTab('installments'),
    },
    {
      id: 'ai_matching',
      title: 'درخواست‌های مشتری و تطبیق هوشمند',
      subtitle: 'ثبت نیاز متریال و ملک با دریافت استعلام آنی',
      isComponent: true,
      component: GoldenAiMatch3D,
      badge: 'استعلام آنی',
      onClick: () => onNavigateTab('customer_requests'),
    },
    {
      id: 'building_3d',
      title: 'استودیو ۳بعدی و هوش مصنوعی',
      subtitle: 'مدل‌سازی WebGL، برآورد متره و محاسبه ساختاری',
      isComponent: true,
      component: Golden3DStudio,
      badge: 'هوش مصنوعی سه‌بعدی',
      highlight: true,
      onClick: () => onNavigateTab('building_3d'),
    },
    {
      id: 'deal_room',
      title: 'اتاق معامله امن (Deal Room)',
      subtitle: 'میز مذاکره محرمانه، استعلام سند و داوری حقوقی',
      isComponent: true,
      component: GoldenDealRoom3D,
      badge: 'امنیت حقوقی',
      onClick: () => onNavigateTab('deal_room'),
    },
    {
      id: 'barter',
      title: 'تهاتر و معاوضه تخصصی',
      subtitle: 'مبادله ملک با متریال، خودرو یا واحدهای آماده',
      isComponent: true,
      component: GoldenBarter3D,
      badge: 'تهاتر بدون واسطه',
      onClick: () => onNavigateTab('barter'),
    },
  ];

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearch) {
      setSearchQuery(localSearch);
    }
    onNavigateTab('market');
  };

  return (
    <div className="w-full bg-[#faf8f4] text-slate-800 font-['Vazirmatn',sans-serif]" dir="rtl">
      <SvgGoldDefs />

      {/* =========================================================================
          TOP DESKTOP HEADER BAR (Wide Web Layout)
          ========================================================================= */}
      {!hideHeader && (
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#ece6d9] shadow-xs">
          <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-6">
            
            {/* Brand Logo & Title (Prominent Size Matching Mobile) */}
            <div className="flex items-center gap-3.5 shrink-0 cursor-pointer" onClick={() => onNavigateTab('home')}>
              <div className="w-16 h-16 shrink-0 flex items-center justify-center">
                <PayvandLogoV3 className="w-16 h-16 object-contain" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black text-slate-900">
                    پیوندساخت
                  </span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
                    سامانه ملی
                  </span>
                </div>
                <p className="text-[13px] text-amber-900 font-black">
                  اتصالِ هوشمندانه
                </p>
              </div>
            </div>

            {/* Desktop Search Input with City Selector */}
            <form onSubmit={handleHeroSearch} className="flex-1 max-w-xl flex items-center bg-[#faf9f6] border-2 border-[#dfc282] rounded-2xl p-1.5 focus-within:border-[#caa758] focus-within:ring-2 focus-within:ring-[#caa758]/20 transition-all shadow-inner">
              <button
                type="button"
                onClick={onOpenCityModal}
                className="h-8 px-3 rounded-xl btn-3d-gold text-[#2c1b04] text-[15px] font-black flex items-center gap-1.5 shrink-0 shadow-2xs transition-colors cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-amber-800" />
                <span className="max-w-[90px] truncate">{selectedCity === 'انتخاب استان / شهر' ? 'تهران' : selectedCity}</span>
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>

              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="جستجو در آگهی‌ها، محصولات، خدمات و ..."
                className="flex-1 bg-transparent px-3 text-[15px] font-bold text-slate-900 placeholder-slate-400 focus:outline-none"
              />

              <button
                type="submit"
                className="w-8 h-8 rounded-xl btn-3d-gold text-[#2c1b04] flex items-center justify-center transition-transform active:scale-95 shrink-0 cursor-pointer shadow-2xs"
                title="جستجو"
              >
                <Search className="w-4 h-4 stroke-[2.8]" />
              </button>
            </form>

            {/* Desktop Quick Actions */}
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                onClick={() => onNavigateTab('deal_room')}
                className="h-8.5 px-3.5 rounded-xl bg-white hover:bg-amber-50 text-slate-900 border-2 border-[#dfc282] text-[15px] font-black flex items-center gap-2 transition-colors cursor-pointer active:scale-95 shadow-2xs"
              >
                <Lock className="w-3.5 h-3.5 text-amber-700" />
                <span>اتاق معامله محرمانه</span>
              </button>

              <button
                onClick={onOpenRegisterModal}
                className="h-8.5 px-4 rounded-xl btn-3d-gold text-[#2c1b04] text-[15px] font-black flex items-center gap-2 shadow-2xs transition-all active:scale-95 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 stroke-[2.5]" />
                <span>ثبت آگهی جدید</span>
              </button>
            </div>
          </div>
        </header>
      )}

      {/* =========================================================================
          DESKTOP TOP HERO ROW: LIVE MARKET PULSE & FULL-WIDTH VIP SPONSOR BILLBOARD
          ========================================================================= */}
      <section className="pt-6 px-6 max-w-7xl mx-auto space-y-4">
        
        {/* Live Market Pulse Bar */}
        <div 
          onClick={() => onNavigateTab('market')}
          className="bg-white rounded-[24px] border-2 border-[#dfc282] px-5 py-3 flex items-center justify-between shadow-[0_4px_16px_rgba(180,130,40,0.08)] cursor-pointer hover:border-[#b88a31] transition-all group select-none"
        >
          <div className="flex items-center gap-3 min-w-0">
            <span className="relative flex h-3 w-3 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-600" />
            </span>
            <span className="text-[15px] font-black text-slate-950">
              پالس زنده بازار مسکن و مصالح: <span className="text-emerald-800 font-extrabold">۲۴ معامله، قرارداد و استعلام رسمی در جریان</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-black text-amber-900 group-hover:text-amber-950 shrink-0">
            <span>مشاهده تابلوی معاملات زنده</span>
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          </div>
        </div>

        {/* FULL-WIDTH EXPANSIVE VIP SPONSOR BILLBOARD BANNER - PURE VIDEO, GIF & PHOTO */}
        <div className="w-full relative rounded-[32px] overflow-hidden border-2 border-[#dfc282] shadow-[0_8px_30px_rgba(180,130,40,0.18)] bg-black text-white">
          
          {/* Full-Bleed Media Display - ONLY Video, GIF, or Photo */}
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
            className="relative w-full h-72 sm:h-80 md:h-96 lg:h-[420px] overflow-hidden cursor-pointer group bg-black"
          >
            {currentAd.mediaUrl.endsWith('.mp4') || currentAd.mediaUrl.includes('video') ? (
              <video
                src={currentAd.mediaUrl}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
              />
            ) : (
              <img
                src={currentAd.mediaUrl}
                alt="تبلیغ رسانه‌ای"
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
              />
            )}

            {/* Animated Typewriter Topic Badge on Banner (Right Side) */}
            <div className="absolute bottom-4 right-4 z-20">
              <AnimatedTypewriterTopic topic={currentAd.topic} />
            </div>

            {/* Destination URL Action / Hint Pill at bottom-left */}
            {currentAd.targetUrl && currentAd.targetUrl !== '#' && (
              <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 bg-black/85 backdrop-blur-md text-amber-300 border border-[#dfc282] text-xs font-black px-4 py-2 rounded-2xl shadow-xl group-hover:bg-gradient-to-r group-hover:from-amber-400 group-hover:to-amber-500 group-hover:text-slate-950 transition-all cursor-pointer">
                <ExternalLink className="w-4 h-4 stroke-[2.5]" />
                <span>کلیک برای ورود به صفحه تبلیغ‌دهنده</span>
              </div>
            )}

            {/* Action Bar: Button & Live Queue / Remaining Timer */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2.5">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsAdModalOpen(true);
                }}
                className="btn-3d-gold text-[#2c1b04] text-xs sm:text-[13px] font-black px-4.5 py-2 rounded-xl shadow-lg flex items-center gap-1.5 active:scale-95 transition-transform cursor-pointer"
              >
                <Megaphone className="w-4 h-4 stroke-[2.5]" />
                <span>برای ثبت تبلیغ</span>
              </button>

              {/* Live Remaining Time Badge */}
              <div className="bg-black/80 backdrop-blur-md text-amber-300 border border-amber-400/35 text-xs font-black px-3.5 py-2 rounded-xl shadow-lg flex items-center gap-1.5 select-none">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>باقیمانده: {formattedRemainingTime}</span>
              </div>

              {/* Queue Counter Badge if any queued ads */}
              {queueCount > 0 && (
                <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-xs font-black px-3 py-2 rounded-xl shadow-lg flex items-center gap-1.5 select-none">
                  <Layers className="w-3.5 h-3.5 text-slate-950" />
                  <span>{toPersianDigits(queueCount)} در صف نوبت</span>
                </div>
              )}
            </div>
          </div>

        </div>

      </section>

      {/* =========================================================================
          THE 10 MAIN CATEGORIES (5 Columns on Desktop)
          ========================================================================= */}
      <section className="py-8 px-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-slate-950">دسته‌بندی‌های تخصصی پیوندساخت</h2>
            <p className="text-[15px] text-slate-700 font-bold mt-1">اکوسیستم جامع و اعتبارسنجی‌شده صنعت مسکن، ساختمان، متریال و ضایعات</p>
          </div>
          <span className="text-[15px] font-black text-amber-950 btn-3d-gold px-4 py-1.5 rounded-xl shadow-2xs">
            {services.length} دسته‌بندی تخصصی فعال
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {services.map((service) => {
            const IconComponent = (service as any).isComponent ? (service as any).component : null;
            return (
              <motion.button
                key={service.id}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                onClick={service.onClick}
                className="bg-white rounded-[28px] p-5 border-2 border-[#dfc282] text-right transition-all flex flex-col justify-between min-h-[220px] shadow-[0_4px_16px_rgba(180,130,40,0.1)] hover:border-[#b88a31] hover:shadow-[0_12px_30px_rgba(180,130,40,0.18)] cursor-pointer group select-none relative overflow-hidden"
              >
                {/* Top Badge */}
                <div className="w-full flex items-center justify-between">
                  <span className="text-xs font-black px-3 py-1 rounded-xl btn-3d-gold text-[#2c1b04] shadow-2xs group-hover:scale-102 transition-transform">
                    {service.badge}
                  </span>
                  {service.highlight && <Award className="w-4 h-4 text-amber-600" />}
                </div>

                {/* Prominent Large 3D Gold Icon */}
                <div className="my-3 flex justify-center transform group-hover:scale-110 transition-transform">
                  {IconComponent && (
                    <div className="w-20 h-20 sm:w-22 sm:h-22 flex items-center justify-center">
                      <IconComponent className="w-full h-full object-contain filter drop-shadow-[0_6px_14px_rgba(160,118,48,0.28)]" />
                    </div>
                  )}
                </div>

                {/* Typography: 15px and Crisp Black */}
                <div>
                  <h3 className="font-black text-[15px] text-slate-950 group-hover:text-[#9a7224] transition-colors leading-snug">
                    {service.title}
                  </h3>
                  <p className="text-[13px] text-slate-600 font-bold mt-1 line-clamp-1">
                    {service.subtitle}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          FEATURED VERIFIED DEALS (املاک و متریال برگزیده)
          ========================================================================= */}
      <section className="pb-12 px-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-950">فایل‌های اکازیون و اعتبارسنجی‌شده روز</h2>
            <p className="text-[15px] text-slate-700 font-bold mt-0.5">املاک سالم با تضمین حقوقی، سند رسمی و نظارت کارشناسان امین</p>
          </div>
          <button
            onClick={() => onNavigateTab('market')}
            className="h-8.5 px-4 rounded-xl btn-3d-gold text-[#2c1b04] text-[15px] font-black flex items-center gap-1.5 shadow-2xs active:scale-95 cursor-pointer"
          >
            <span>مشاهده همه فایل‌ها</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {properties.slice(0, 3).map((property) => (
            <div
              key={property.id}
              className="bg-white rounded-[28px] border-2 border-[#dfc282] overflow-hidden shadow-[0_4px_16px_rgba(180,130,40,0.1)] hover:shadow-xl transition-all flex flex-col justify-between group"
            >
              <div className="relative h-48 bg-slate-100 group overflow-hidden">
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 right-3 bg-slate-950/85 text-white text-xs px-2.5 py-1 rounded-xl font-mono font-bold backdrop-blur-md">
                  {property.code}
                </span>
                <span className="absolute top-3 left-3 bg-emerald-700 text-white text-xs px-2.5 py-1 rounded-xl font-black shadow-sm">
                  تأیید اصالت ثبتی
                </span>
              </div>

              <div className="p-4.5 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-xs text-slate-600 font-bold mb-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-800" />
                    <span>{property.city} | {property.district}</span>
                  </div>
                  <h3 className="font-black text-[15px] text-slate-950 line-clamp-2 leading-snug">
                    {property.title}
                  </h3>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-[#ede6d8]">
                  <div>
                    <span className="text-xs text-slate-600 font-bold block">قیمت کارشناسی:</span>
                    <span className="text-[15px] font-black text-amber-950 font-mono">{formatTomanShort(property.price)} تومان</span>
                  </div>
                  <div className="text-left">
                    <span className="text-xs text-slate-600 font-bold block">متراژ:</span>
                    <span className="text-[15px] font-black text-slate-900">{toPersianDigits(property.area)} م‌م</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => onSelectProperty(property)}
                    className="flex-1 h-9 bg-white hover:bg-amber-50/60 text-slate-950 text-[15px] font-black rounded-xl transition-all text-center border-2 border-[#dfc282] shadow-2xs active:scale-95 cursor-pointer"
                  >
                    جزییات فایل
                  </button>
                  <button
                    onClick={() => onEnterDealRoom(property.code)}
                    className="flex-1 h-9 btn-3d-gold text-[#2c1b04] text-[15px] font-black rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-2xs active:scale-95 cursor-pointer"
                  >
                    <Lock className="w-4 h-4 stroke-[2.5]" />
                    <span>ورود به معامله</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          FOOTER
          ========================================================================= */}
      <footer className="bg-white border-t border-[#ede6d8] pt-10 pb-6 px-6 text-slate-600 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <PayvandLogoV3 className="w-7 h-7" />
            <span className="text-base font-black text-slate-900">پیوندساخت</span>
            <span className="text-slate-400">|</span>
            <span className="text-[11px] text-amber-900 font-black">اتصالِ هوشمندانه</span>
          </div>
          <span className="text-slate-400 text-[11px]">
            © تمامی حقوق برای سوپر اپلیکیشن پیوند ساخت محفوظ است.
          </span>
        </div>
      </footer>

      {/* Ad Booking & Ordering Modal */}
      <AdOrderModal
        isOpen={isAdModalOpen}
        onClose={() => setIsAdModalOpen(false)}
        onAdActivated={(_newAd) => {
          // Handled automatically by useAdQueue
        }}
      />
    </div>
  );
};
