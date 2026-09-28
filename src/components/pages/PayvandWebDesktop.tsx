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
  Clock
} from 'lucide-react';
import { Property, User, UserRole, PriceIndex, LiveTickerItem } from '../../types';
import { formatTomanShort, toPersianDigits } from '../../utils/formatters';
import { SvgGoldDefs, PayvandLogoV3, GoldenInstallment3D, GoldenAiMatch3D, Golden3DStudio, GoldenBarter3D } from '../common/Golden3DIcons';
import { AdOrderModal, SponsoredAd, PRESET_SPONSOR_MEDIA } from '../modals/AdOrderModal';

import factoryIconImg from '../../assets/images/gold_factory_icon_1790348345530.jpg';
import materialsIconImg from '../../assets/images/gold_materials_icon_1790348354545.jpg';
import handshakeIconImg from '../../assets/images/gold_handshake_icon_1790348362919.jpg';
import villaIconImg from '../../assets/images/gold_villa_icon_1790348371720.jpg';
import documentIconImg from '../../assets/images/gold_document_icon_1790348381782.jpg';
import gavelIconImg from '../../assets/images/gold_gavel_icon_1790348390844.jpg';
import excavatorIconImg from '../../assets/images/gold_excavator_icon_1790348400260.jpg';
import engineerIconImg from '../../assets/images/gold_engineer_icon_1790348408949.jpg';

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

  const services = [
    {
      id: 'building_3d',
      title: 'استودیو ۳بعدی و هوش مصنوعی',
      subtitle: 'مدل‌سازی WebGL، برآورد متره، محاسبه مالی و استعلام کارخانه',
      isComponent: true,
      component: Golden3DStudio,
      badge: 'هوش مصنوعی سه‌بعدی',
      highlight: true,
      onClick: () => onNavigateTab('building_3d'),
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
    {
      id: 'industrial',
      title: 'کارخانجات و شهرک‌های صنعتی',
      subtitle: 'خرید و واگذاری کارخانجات، سوله و انبار صنعتی',
      image: factoryIconImg,
      badge: 'شهرک‌های صنعتی',
      onClick: () => {
        setSearchQuery('شهرک صنعتی');
        onNavigateTab('market');
      },
    },
    {
      id: 'materials',
      title: 'مصالح و متریال ساختمانی',
      subtitle: 'خرید مستقیم آهن‌آلات، سیمان، کاشی و تجهیزات',
      image: materialsIconImg,
      badge: 'قیمت بورس و کارخانه',
      onClick: () => onNavigateTab('materials'),
    },
    {
      id: 'partnership',
      title: 'مشارکت در ساخت',
      subtitle: 'اتصال مالکین زمین به سازندگان رتبه‌دار و معتبر',
      image: handshakeIconImg,
      badge: 'سرمایه‌گذاری',
      onClick: () => onNavigateTab('partnership'),
    },
    {
      id: 'market',
      title: 'بازار املاک و مستغلات',
      subtitle: 'معاملات خرید، فروش و رهن فایل‌های اعتبارسنجی‌شده',
      image: villaIconImg,
      badge: 'فایلینگ سراسری',
      highlight: true,
      onClick: () => onNavigateTab('market'),
    },
    {
      id: 'price_estimate',
      title: 'استعلام قیمت و متراژ',
      subtitle: 'دیتاسنتر رسمی قیمت مسکن و محاسبه‌گر متراژ',
      image: documentIconImg,
      badge: 'داده زنده',
      onClick: () => onNavigateTab('price_data'),
    },
    {
      id: 'auctions_deals',
      title: 'فرصت‌های طلایی و مزایده',
      subtitle: 'فایل‌های زیر قیمت کارشناسی و مزایدات معتبر',
      image: gavelIconImg,
      badge: 'اکازیون روز',
      onClick: () => onNavigateTab('rate_cutter'),
    },
    {
      id: 'machinery',
      title: 'ماشین‌آلات و تجهیزات',
      subtitle: 'تأمین و اجاره تاورکرین، بیل مکانیکی و لودر',
      image: excavatorIconImg,
      badge: 'تجهیزات سنگین',
      onClick: () => onNavigateTab('craftsmen'),
    },
    {
      id: 'contractors',
      title: 'پیمانکاران و مجریان ساخت',
      subtitle: 'فهرست مهندسان نظام مهندسی و اکیپ‌های مجرب',
      image: engineerIconImg,
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
            
            {/* Brand Logo & Title */}
            <div className="flex items-center gap-3 shrink-0 cursor-pointer" onClick={() => onNavigateTab('home')}>
              <PayvandLogoV3 className="w-10 h-10" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black text-slate-900">
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

            {/* Desktop Search Input with City Selector */}
            <form onSubmit={handleHeroSearch} className="flex-1 max-w-xl flex items-center bg-[#faf9f6] border border-[#e5ded2] rounded-2xl p-1.5 focus-within:border-[#caa758] focus-within:ring-2 focus-within:ring-[#caa758]/20 transition-all shadow-inner">
              <button
                type="button"
                onClick={onOpenCityModal}
                className="px-3 py-1.5 rounded-xl bg-white border border-[#e8e2d7] hover:bg-amber-50/60 text-xs font-bold text-slate-700 flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-amber-600" />
                <span className="max-w-[90px] truncate">{selectedCity === 'انتخاب استان / شهر' ? 'تهران' : selectedCity}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="جستجو در آگهی‌ها، محصولات، خدمات و ..."
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

            {/* Desktop Quick Actions */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => onNavigateTab('deal_room')}
                className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-amber-700" />
                <span>اتاق معامله محرمانه</span>
              </button>

              <button
                onClick={onOpenRegisterModal}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#b88c42] to-[#8d6520] hover:from-[#a67c35] hover:to-[#7a5518] text-white text-xs font-black flex items-center gap-2 shadow-md transition-all hover:scale-102 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>ثبت آگهی جدید</span>
              </button>
            </div>
          </div>
        </header>
      )}

      {/* =========================================================================
          THE 8 MAIN CATEGORIES (4 Columns on Desktop)
          ========================================================================= */}
      <section className="py-8 px-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900">دسته‌بندی‌های ۱۰‌گانه پیوندساخت</h2>
            <p className="text-xs text-slate-500 mt-0.5">اکوسیستم جامع و اعتبارسنجی‌شده صنعت مسکن، ساختمان و متریال</p>
          </div>
          <span className="text-xs font-bold text-amber-900 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
            ۱۰ دسته‌بندی تخصصی فعال
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {services.map((service) => {
            const IconComponent = (service as any).isComponent ? (service as any).component : null;
            return (
              <motion.button
                key={service.id}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                onClick={service.onClick}
                className={`bg-white rounded-3xl p-5 border text-right transition-all flex flex-col justify-between min-h-[190px] shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_25px_rgba(180,130,40,0.12)] cursor-pointer group select-none ${
                  service.highlight
                    ? 'border-2 border-[#caa758] ring-2 ring-[#caa758]/20'
                    : 'border-[#eee6d9] hover:border-[#dfb76c]'
                }`}
              >
                <div className="w-full flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 group-hover:bg-amber-100 group-hover:text-amber-900 transition-colors">
                    {service.badge}
                  </span>
                  {service.highlight && <Award className="w-4 h-4 text-amber-600" />}
                </div>

                <div className="my-2 flex justify-center transform group-hover:scale-108 transition-transform">
                  {IconComponent ? (
                    <IconComponent className="w-16 h-16" />
                  ) : (
                    <img
                      src={service.image}
                      alt={service.title}
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 object-contain filter drop-shadow-[0_4px_8px_rgba(160,118,48,0.22)]"
                    />
                  )}
                </div>

                <div>
                  <h3 className="font-black text-sm text-slate-900 group-hover:text-[#9a7224] transition-colors leading-snug">
                    {service.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                    {service.subtitle}
                  </p>
                </div>
              </motion.button>
            );
          })}
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
        onAdActivated={(newAd) => setCurrentAd(newAd)}
      />
    </div>
  );
};
