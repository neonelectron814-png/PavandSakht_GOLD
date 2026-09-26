import React from 'react';
import { 
  Lock, 
  ShieldCheck, 
  Percent, 
  RefreshCw, 
  Handshake, 
  Package, 
  TrendingUp, 
  HardHat, 
  ArrowLeft, 
  Building2, 
  CheckCircle2, 
  Sparkles, 
  Award, 
  Users, 
  MapPin, 
  ChevronLeft,
  Box,
  Layers,
  Flame,
  Radio,
  Clock,
  Zap,
  Mountain,
  KeyRound
} from 'lucide-react';
import { Property, UserRole, User, PriceIndex, LiveActivityEvent } from '../../types';
import { formatTomanShort, getVerificationBadgeColor, getVerificationBadgeText, toPersianDigits } from '../../utils/formatters';
import { Property3DViewer } from '../common/Property3DViewer';

interface HomeDashboardProps {
  currentUser: User;
  activeRole: UserRole;
  properties: Property[];
  priceIndices: PriceIndex[];
  onNavigateTab: (tab: string) => void;
  onSelectProperty: (property: Property) => void;
  onEnterDealRoom: (propertyCode: string) => void;
  liveEvents?: LiveActivityEvent[];
  onOpenLiveFeed?: () => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  currentUser,
  activeRole,
  properties,
  priceIndices,
  onNavigateTab,
  onSelectProperty,
  onEnterDealRoom,
  liveEvents = [],
  onOpenLiveFeed,
}) => {
  const verifiedProperties = properties.filter((p) => p.verifiedStatus === 'verified');
  const rateCutterProperties = properties.filter((p) => p.isRateCutter);
  const featuredProperty = verifiedProperties[0] || properties[0];

  return (
    <div className="space-y-7 pb-10">
      
      {/* Hero Welcome & Role Context Banner with 3D Ambient Lighting */}
      <div className="relative glass-card rounded-3xl p-6 sm:p-8 shadow-glass-3d border border-white/20 overflow-hidden">
        {/* Dynamic Glass Refraction Background Glows */}
        <div className="absolute top-0 -left-10 w-96 h-96 ambient-glow-amber rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 -right-10 w-80 h-80 ambient-glow-emerald rounded-full pointer-events-none translate-x-1/3 translate-y-1/3" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 ambient-glow-blue rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 glass-amber px-3.5 py-1 rounded-full text-xs text-amber-300 font-bold border border-amber-400/40 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>پورتفولیو پیشرفته ساخت‌وساز، زنجیره معادن و معاملات امن املاک</span>
            </div>
            
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight leading-snug drop-shadow-md">
              به اکوسیستم <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-emerald-400">پیــوند سـاخت</span> خوش آمدید، {currentUser.name}
            </h1>
            
            {/* Primary Brand Slogan Banner */}
            <div className="glass-panel-dark border-r-4 border-r-amber-400 border border-white/10 p-3 rounded-2xl">
              <p className="text-xs sm:text-sm font-black text-amber-300">
                «پیوند ساخت؛ اتصال هوشمندانه از سینه کار معدن تا کلید نهایی ملک»
              </p>
              <p className="text-[11px] sm:text-xs text-slate-300 mt-1 leading-relaxed font-light">
                پلتفرم یکپارچه ارزیابی ۳ بعدی اسناد، بازار رهن و اجاره اعتبارسنجی‌شده، تأمین مستقیم کوپ و مصالح معدنی، و اتاق معامله محرمانه با نظارت کارگزاری‌های امین.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigateTab('deal_room')}
                className="btn-3d-amber text-slate-950 font-black text-xs sm:text-sm px-5 py-3 rounded-2xl flex items-center gap-2 border border-amber-300/50 cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>ورود به اتاق معامله محرمانه</span>
              </button>

              <button
                onClick={() => onNavigateTab('market')}
                className="glass-card hover:bg-white/15 text-white font-bold text-xs sm:text-sm px-4.5 py-3 rounded-2xl border border-white/20 flex items-center gap-2 transition-all active:scale-95 shadow-sm"
              >
                <Building2 className="w-4 h-4 text-emerald-400" />
                <span>املاک خرید و اجاره</span>
              </button>

              <button
                onClick={() => onNavigateTab('materials')}
                className="glass-emerald hover:brightness-110 text-emerald-300 font-bold text-xs sm:text-sm px-4.5 py-3 rounded-2xl border border-emerald-400/40 flex items-center gap-2 transition-all active:scale-95 shadow-sm"
              >
                <Package className="w-4 h-4 text-emerald-400" />
                <span>معادن و سنگ خام</span>
              </button>
            </div>
          </div>

          {/* User Credit Score 3D Glass Cube Box */}
          <div className="glass-panel-dark border border-white/20 rounded-3xl p-5 flex flex-col items-center text-center shrink-0 min-w-[210px] shadow-glass-3d card-3d-tilt">
            <div className="relative w-14 h-14 rounded-2xl glass-amber text-amber-400 border border-amber-400/50 flex items-center justify-center font-black text-2xl mb-2 shadow-[0_0_20px_rgba(245,158,11,0.4)]">
              {toPersianDigits(currentUser.creditScore)}
            </div>
            <p className="text-xs text-slate-300 font-medium">امتیاز اعتباری حساب کاربری</p>
            <span className="text-xs font-black text-amber-400 mt-0.5">{currentUser.badgeTitle}</span>
            <div className="mt-2.5 w-full bg-slate-950/80 h-2 rounded-full overflow-hidden p-0.5 border border-white/10">
              <div className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full rounded-full shadow-[0_0_8px_rgba(245,158,11,0.8)]" style={{ width: `${currentUser.creditScore}%` }} />
            </div>
            <span className="text-[10px] text-slate-400 mt-1">تأییدیه هویت شش‌گانه فعال</span>
          </div>
        </div>
      </div>

      {/* Primary Feature 3D Tilt Cards Grid */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>خدمات اصلی اکوسیستم پیوند ساخت</span>
          </h2>
          <span className="text-xs text-slate-400 font-medium">کارت‌های ۳ بعدی با دسترسی آنی</span>
        </div>

        <div className="flex sm:grid sm:grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4.5 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0 scroll-smooth snap-x snap-mandatory no-scrollbar touch-pan-x">
          
          {/* Card 1: Deal Room */}
          <div
            onClick={() => onNavigateTab('deal_room')}
            className="group glass-card hover:border-amber-400/60 p-4.5 rounded-3xl shadow-glass-3d card-3d-tilt cursor-pointer flex flex-col justify-between min-w-[230px] sm:min-w-0 snap-start flex-1 shrink-0 active:scale-95 transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-11 h-11 rounded-2xl glass-amber text-amber-400 flex items-center justify-center border border-amber-400/40 shadow-sm group-hover:scale-110 transition-transform">
                <Lock className="w-5 h-5" />
              </div>
              <span className="glass-amber text-amber-300 text-[10px] px-2 py-0.5 rounded-full font-bold border border-amber-400/40">
                محرمانه
              </span>
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white group-hover:text-amber-400 transition-colors">
                اتاق معامله
              </h3>
              <p className="text-[11px] text-slate-300 mt-1.5 line-clamp-2 leading-relaxed">
                استعلام مدارک، ارزیابی قیمت و ارجاع به املاک امین
              </p>
            </div>
            <div className="mt-3.5 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] text-amber-400 font-bold">
              <span>ورود به اتاق</span>
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Rate Cutter */}
          <div
            onClick={() => onNavigateTab('rate_cutter')}
            className="group glass-card hover:border-rose-400/60 p-4.5 rounded-3xl shadow-glass-3d card-3d-tilt cursor-pointer flex flex-col justify-between min-w-[230px] sm:min-w-0 snap-start flex-1 shrink-0 active:scale-95 transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-11 h-11 rounded-2xl glass-rose text-rose-400 flex items-center justify-center border border-rose-400/40 shadow-sm group-hover:scale-110 transition-transform">
                <Percent className="w-5 h-5" />
              </div>
              <span className="glass-rose text-rose-300 text-[10px] px-2 py-0.5 rounded-full font-bold border border-rose-400/40">
                فروش فوری
              </span>
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white group-hover:text-rose-400 transition-colors">
                نرخ‌شکن
              </h3>
              <p className="text-[11px] text-slate-300 mt-1.5 line-clamp-2 leading-relaxed">
                فایل‌های زیر قیمت کارشناسی با دلیل تخفیف شفاف
              </p>
            </div>
            <div className="mt-3.5 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] text-rose-400 font-bold">
              <span>مشاهده تخفیف‌ها</span>
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Barter */}
          <div
            onClick={() => onNavigateTab('barter')}
            className="group glass-card hover:border-blue-400/60 p-4.5 rounded-3xl shadow-glass-3d card-3d-tilt cursor-pointer flex flex-col justify-between min-w-[230px] sm:min-w-0 snap-start flex-1 shrink-0 active:scale-95 transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-11 h-11 rounded-2xl glass-blue text-blue-400 flex items-center justify-center border border-blue-400/40 shadow-sm group-hover:scale-110 transition-transform">
                <RefreshCw className="w-5 h-5" />
              </div>
              <span className="glass-blue text-blue-300 text-[10px] px-2 py-0.5 rounded-full font-bold border border-blue-400/40">
                تطبیق هوشمند
              </span>
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white group-hover:text-blue-400 transition-colors">
                تهاتر تخصصی
              </h3>
              <p className="text-[11px] text-slate-300 mt-1.5 line-clamp-2 leading-relaxed">
                تهاتر ملک↔ملک و ملک↔مصالح ساختمانی
              </p>
            </div>
            <div className="mt-3.5 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] text-blue-400 font-bold">
              <span>ثبت یا جستجو</span>
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: Materials Market */}
          <div
            onClick={() => onNavigateTab('materials')}
            className="group glass-card hover:border-emerald-400/60 p-4.5 rounded-3xl shadow-glass-3d card-3d-tilt cursor-pointer flex flex-col justify-between min-w-[230px] sm:min-w-0 snap-start flex-1 shrink-0 active:scale-95 transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-11 h-11 rounded-2xl glass-emerald text-emerald-400 flex items-center justify-center border border-emerald-400/40 shadow-sm group-hover:scale-110 transition-transform">
                <Package className="w-5 h-5" />
              </div>
              <span className="glass-emerald text-emerald-300 text-[10px] px-2 py-0.5 rounded-full font-bold border border-emerald-400/40">
                مستقیم کارخانه
              </span>
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white group-hover:text-emerald-400 transition-colors">
                بازار مصالح
              </h3>
              <p className="text-[11px] text-slate-300 mt-1.5 line-clamp-2 leading-relaxed">
                سیمان، میلگرد، کاشی و سنگ با فیلتر شعاع مکانی
              </p>
            </div>
            <div className="mt-3.5 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] text-emerald-400 font-bold">
              <span>استعلام قیمت</span>
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            </div>
          </div>

        </div>
      </div>

      {/* Featured 3D Property Interactive Showcase Component */}
      {featuredProperty && (
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
              <Box className="w-4 h-4 text-amber-400" />
              <span>ویترین بازرسی ۳ بعدی ملک برگزیده</span>
            </h2>
            <button
              onClick={() => onSelectProperty(featuredProperty)}
              className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              <span>مشاهده پرونده کامل</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          <Property3DViewer
            propertyTitle={featuredProperty.title}
            propertyCode={featuredProperty.code}
            verifiedStatus={featuredProperty.verifiedStatus}
            area={featuredProperty.area}
            rooms={featuredProperty.rooms}
            year={featuredProperty.year}
          />
        </div>
      )}

      {/* Secondary Tools 3D Glass Grid: Partnership, Price Center, Craftsmen */}
      <div className="flex sm:grid sm:grid-cols-3 gap-3.5 sm:gap-4.5 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0 scroll-smooth snap-x snap-mandatory no-scrollbar touch-pan-x">
        
        {/* Partnership */}
        <div 
          onClick={() => onNavigateTab('partnership')}
          className="glass-card p-5 rounded-3xl border border-white/15 hover:border-purple-400/50 flex items-center justify-between cursor-pointer card-3d-tilt shadow-glass-3d min-w-[260px] sm:min-w-0 snap-start flex-1 shrink-0 active:scale-95 transition-all"
        >
          <div className="space-y-1.5">
            <span className="glass-purple text-purple-300 px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-purple-400/30">
              پروژه‌های زمین
            </span>
            <h4 className="font-extrabold text-sm text-white">مشارکت در ساخت</h4>
            <p className="text-xs text-slate-400">اتصال مالکین زمین به سازندگان رتبه ۱</p>
          </div>
          <div className="w-12 h-12 rounded-2xl glass-purple text-purple-400 flex items-center justify-center shrink-0 border border-purple-400/40 shadow-sm">
            <Handshake className="w-6 h-6" />
          </div>
        </div>

        {/* Price Data Center */}
        <div 
          onClick={() => onNavigateTab('price_data')}
          className="glass-card p-5 rounded-3xl border border-white/15 hover:border-emerald-400/50 flex items-center justify-between cursor-pointer card-3d-tilt shadow-glass-3d min-w-[260px] sm:min-w-0 snap-start flex-1 shrink-0 active:scale-95 transition-all"
        >
          <div className="space-y-1.5">
            <span className="glass-emerald text-emerald-300 px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-emerald-400/30">
              به‌روزرسانی روزانه
            </span>
            <h4 className="font-extrabold text-sm text-white">دیتاسنتر قیمت مسکن</h4>
            <p className="text-xs text-slate-400">روند قیمت منطقه‌ای و تخمین هوشمند</p>
          </div>
          <div className="w-12 h-12 rounded-2xl glass-emerald text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-400/40 shadow-sm">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Craftsmen */}
        <div 
          onClick={() => onNavigateTab('craftsmen')}
          className="glass-card p-5 rounded-3xl border border-white/15 hover:border-amber-400/50 flex items-center justify-between cursor-pointer card-3d-tilt shadow-glass-3d min-w-[260px] sm:min-w-0 snap-start flex-1 shrink-0 active:scale-95 transition-all"
        >
          <div className="space-y-1.5">
            <span className="glass-amber text-amber-300 px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-amber-400/30">
              استادکاران معتبر
            </span>
            <h4 className="font-extrabold text-sm text-white">خدمات استادکاران</h4>
            <p className="text-xs text-slate-400">بنا، برق‌کار و کاشی‌کار با امتیاز</p>
          </div>
          <div className="w-12 h-12 rounded-2xl glass-amber text-amber-400 flex items-center justify-center shrink-0 border border-amber-400/40 shadow-sm">
            <HardHat className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Featured Verified Properties List Section with Glass Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>فایل‌های سالم و اعتبارسنجی‌شده (جدیدترین‌ها)</span>
            </h2>
            <p className="text-xs text-slate-400">تمامی فایل‌ها توسط کارشناسان حقوقی و ثبتی پیوند ساخت بررسی شده‌اند</p>
          </div>

          <button
            onClick={() => onNavigateTab('market')}
            className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
          >
            <span>مشاهده همه</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {verifiedProperties.slice(0, 3).map((property) => {
            return (
              <div
                key={property.id}
                className="glass-card rounded-3xl border border-white/15 overflow-hidden shadow-glass-3d card-3d-tilt flex flex-col justify-between group"
              >
                {/* Image Header with 3D Badges */}
                <div className="relative h-50 bg-slate-900 overflow-hidden">
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Frosted Code Tag */}
                  <span className="absolute top-3 right-3 glass-panel-dark text-white text-[10px] px-2.5 py-1 rounded-xl font-mono font-bold border border-white/20">
                    {property.code}
                  </span>

                  {/* Verification Seal Badge */}
                  <div className="absolute top-3 left-3 glass-emerald text-emerald-300 border border-emerald-400/40 text-[10px] px-2.5 py-1 rounded-xl font-bold flex items-center gap-1 shadow-sm">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>تأیید اصالت ثبتی</span>
                  </div>

                  {/* Discount Badge if Rate Cutter */}
                  {property.isRateCutter && property.discountPercent && (
                    <span className="absolute bottom-3 right-3 glass-rose text-white text-[11px] px-3 py-1 rounded-xl font-black shadow-lg border border-rose-400/50">
                      %{toPersianDigits(property.discountPercent)} زیر قیمت بازار
                    </span>
                  )}
                </div>

                {/* Body Details with Glass Dividers */}
                <div className="p-4.5 space-y-3.5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center text-[11px] text-slate-400 gap-1 mb-1.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      <span>{property.city} | {property.district}</span>
                    </div>

                    <h3 className="font-extrabold text-sm text-white line-clamp-2 leading-snug">
                      {property.title}
                    </h3>
                  </div>

                  {/* Key specs Grid */}
                  <div className="grid grid-cols-3 gap-2 glass-panel-dark rounded-2xl p-2.5 text-center text-xs text-slate-300 font-medium border border-white/10">
                    <div>
                      <span className="block text-[10px] text-slate-400">متراژ</span>
                      <span className="text-white font-black">{toPersianDigits(property.area)} م‌م</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-400">اتاق</span>
                      <span className="text-white font-black">{toPersianDigits(property.rooms)} خواب</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-400">سال ساخت</span>
                      <span className="text-white font-black">{toPersianDigits(property.year)}</span>
                    </div>
                  </div>

                  {/* Price Row */}
                  <div className="pt-2 flex items-center justify-between border-t border-white/10">
                    <div>
                      <span className="text-[10px] text-slate-400 block">قیمت کل کارشناسی</span>
                      <span className="text-sm font-black text-amber-400">{formatTomanShort(property.price)}</span>
                    </div>
                    <div className="text-left">
                      <span className="text-[10px] text-slate-400 block">قیمت هر متر</span>
                      <span className="text-xs font-bold text-slate-300">{formatTomanShort(property.pricePerMeter)}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 flex items-center gap-2">
                    <button
                      onClick={() => onSelectProperty(property)}
                      className="flex-1 glass-card hover:bg-white/20 text-white text-xs font-bold py-2.5 rounded-xl transition-all text-center border border-white/20 active:scale-95"
                    >
                      جزئیات ملک
                    </button>
                    <button
                      onClick={() => onEnterDealRoom(property.code)}
                      className="flex-1 glass-amber hover:brightness-110 text-amber-300 text-xs font-black py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm border border-amber-400/40 active:scale-95"
                    >
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                      <span>اتاق معامله</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Live Stream Hub Section */}
      <div className="glass-card rounded-3xl p-6 border border-emerald-500/30 shadow-glass-3d space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl glass-emerald text-emerald-300 border border-emerald-400/40 flex items-center justify-center font-black shadow-sm">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-white">پالس زنده شبکه پیوند ساخت (Real-Time Live Feed)</h3>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">پایش لحظه‌ای استعلام اسناد، بارگیری معادن و پیش‌نویس‌های اتاق معامله</p>
            </div>
          </div>

          {onOpenLiveFeed && (
            <button
              onClick={onOpenLiveFeed}
              className="glass-panel-dark hover:bg-white/15 text-amber-300 text-xs font-bold px-4 py-2 rounded-xl border border-amber-400/40 flex items-center gap-1.5 w-fit active:scale-95 shadow-sm"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>مشاهده و تعامل با تابلوی زنده</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Streaming Live Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 relative z-10">
          {liveEvents.slice(0, 3).map((ev) => {
            const isMine = ev.type === 'mine';
            const isDeal = ev.type === 'deal';
            const isRent = ev.type === 'rent';
            const isVerification = ev.type === 'verification';

            return (
              <div
                key={ev.id}
                onClick={onOpenLiveFeed}
                className="glass-panel-dark hover:bg-white/10 p-3.5 rounded-2xl border border-white/10 transition-all cursor-pointer hover:border-amber-400/40 space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-md border ${
                    isMine ? 'glass-amber text-amber-300 border-amber-400/40' :
                    isDeal ? 'glass-blue text-blue-300 border-blue-400/40' :
                    isRent ? 'bg-purple-500/20 text-purple-300 border-purple-500/40' :
                    isVerification ? 'glass-emerald text-emerald-300 border-emerald-400/40' :
                    'glass-card text-slate-300 border-white/10'
                  }`}>
                    {ev.badge}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-400" />
                    {ev.timestamp}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-white line-clamp-1 group-hover:text-amber-300 transition-colors">
                  {ev.title}
                </h4>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed font-light">
                  {ev.description}
                </p>

                <div className="pt-1.5 flex items-center justify-between text-[10px] border-t border-white/5 text-slate-400">
                  <span>عامل: <strong className="text-slate-300">{ev.actor}</strong></span>
                  <span className="text-emerald-400 font-bold group-hover:underline">مشاهده ←</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Regional Price Center Preview Banner with Frosted Glass */}
      <div className="glass-card rounded-3xl p-6 border border-white/20 shadow-glass-3d space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <h3 className="font-extrabold text-base text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <span>آخرین شاخص قیمت مسکن (مرداد ۱۴۰۳)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">میانگین قیمت هر متر مربع بر اساس معاملات واقعی اعتبارسنجی‌شده</p>
          </div>

          <button
            onClick={() => onNavigateTab('price_data')}
            className="glass-emerald hover:brightness-110 text-emerald-300 text-xs font-bold px-4 py-2 rounded-xl border border-emerald-400/40 flex items-center gap-1.5 w-fit active:scale-95 shadow-sm"
          >
            <span>مشاهده نمودار جامع و تخمین هوشمند</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {priceIndices.map((idx) => (
            <div key={idx.id} className="glass-panel-dark p-4 rounded-2xl border border-white/10 space-y-2 card-3d-tilt">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{idx.city} - {idx.district}</span>
                <span className="text-[10px] glass-emerald text-emerald-300 px-2 py-0.5 rounded-full font-mono font-bold border border-emerald-400/30">
                  +{toPersianDigits(idx.change30dPercent)}٪ ۳۰روز
                </span>
              </div>
              <p className="text-[11px] text-slate-400">{idx.propertyType}</p>
              <div className="pt-1 flex items-center justify-between border-t border-white/5">
                <span className="text-[10px] text-slate-400">میانگین متری:</span>
                <span className="text-xs font-black text-amber-400">{formatTomanShort(idx.avgPricePerMeter)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
