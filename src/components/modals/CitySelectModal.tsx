import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, MapPin, Check, Compass, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';

interface CitySelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCity: string;
  onSelectCity: (city: string) => void;
}

interface ProvinceData {
  province: string;
  cities: string[];
}

export const IRAN_ALL_PROVINCES: ProvinceData[] = [
  {
    province: 'تهران',
    cities: [
      'همه مناطق تهران',
      'منطقه ۱ (تجریش، نیاوران، زعفرانیه، الهیه)',
      'منطقه ۲ (سعادت‌آباد، شهرک غرب، گیشا)',
      'منطقه ۳ (پاسداران، جردن، ونک، میرداماد)',
      'منطقه ۴ (تهرانپارس، شمس‌آباد)',
      'منطقه ۵ (پونک، صادقیه، جنت‌آباد)',
      'منطقه ۲۲ (دریاچه چیتگر، شهرک گلستان)',
      'لواسانات و فشم',
      'دماوند، رودهن و بومهن',
      'پردیس',
      'شهریار و اندیشه',
      'اسلامشهر',
      'ورامین و پاکدشت',
      'رباط‌کریم و پرند',
    ],
  },
  {
    province: 'البرز',
    cities: [
      'همه شهرهای البرز',
      'کرج (عظیمیه، گوهردشت)',
      'کرج (مهرشهر و جهانشهر)',
      'فردیس',
      'کردان و کوهسار',
      'ساوجبلاغ و هشتگرد',
      'نظرآباد',
      'چهارباغ',
      'اشتهارد (شهرک صنعتی)',
      'طالقان',
    ],
  },
  {
    province: 'اصفهان',
    cities: [
      'همه شهرهای اصفهان',
      'اصفهان (چهارباغ، جلفا، مرداویج)',
      'اصفهان (سپاهان‌شهر و بهارستان)',
      'کاشان',
      'شاهین‌شهر',
      'نجف‌آباد',
      'خمینی‌شهر',
      'شهرضا',
      'مبارکه و لنجان',
      'فلاورجان',
      'نطنز و گلپایگان',
    ],
  },
  {
    province: 'فارس',
    cities: [
      'همه شهرهای فارس',
      'شیراز (قصرالدشت، ارم، معالی‌آباد)',
      'شیراز (ستارخان و عفیف‌آباد)',
      'شهر جدید صدرا',
      'مرودشت',
      'جهرم',
      'فسا',
      'کازرون',
      'لارستان',
      'آباده',
      'سپیدان و شش‌پیر',
      'داراب و فیروزآباد',
    ],
  },
  {
    province: 'خراسان رضوی',
    cities: [
      'همه شهرهای خراسان رضوی',
      'مشهد (احمدآباد، سجاد، هاشمیه)',
      'مشهد (بلوار وکیل‌آباد، پیروزی)',
      'طرقبه و شاندیز',
      'نیشابور',
      'سبزوار',
      'تربت حیدریه',
      'تربت جام',
      'قوچان',
      'کاشمر',
      'گناباد',
      'چناران و گلبهار',
    ],
  },
  {
    province: 'آذربایجان شرقی',
    cities: [
      'همه شهرهای آذربایجان شرقی',
      'تبریز (ولیعصر، رشدیه، ائل‌گلی)',
      'تبریز (آبرسان و فردوس)',
      'شهر جدید سهند',
      'مراغه',
      'مرند',
      'میانه',
      'اهر',
      'بناب',
      'جلفا و منطقه آزاد ارس',
      'سراب و شبستر',
    ],
  },
  {
    province: 'مازندران',
    cities: [
      'همه شهرهای مازندران',
      'ساری',
      'بابل',
      'آمل',
      'قائم‌شهر',
      'متل قو (سلمان‌شهر)',
      'نوشهر و رویان',
      'چالوس',
      'محمودآباد و سرخرود',
      'رامسر',
      'تنکابن (شهسوار)',
      'بابلسر',
      'کلاردشت',
      'نور و چمستان',
      'بهشهر',
    ],
  },
  {
    province: 'گیلان',
    cities: [
      'همه شهرهای گیلان',
      'رشت (گلسار، منظریه)',
      'بندرانزلی و منطقه آزاد',
      'لاهیجان',
      'لنگرود',
      'تالش و آستارا',
      'رودسر و چابکسر',
      'صومعه‌سرا و فومن',
      'ماسال و شاندرمن',
      'رودبار و منجیل',
    ],
  },
  {
    province: 'خوزستان',
    cities: [
      'همه شهرهای خوزستان',
      'اهواز (کیانپارس، زیتون، امانیه)',
      'دزفول',
      'آبادان و خرمشهر (اروند)',
      'بندر ماهشهر و بندرامام',
      'بهبهان',
      'شوشتر و شوش',
      'مسجدسلیمان',
      'ایذه و باغملک',
      'رامهرمز',
    ],
  },
  {
    province: 'هرمزگان',
    cities: [
      'همه شهرهای هرمزگان',
      'کیش (جزیره زیبای کیش)',
      'قشم و درگهان',
      'بندرعباس',
      'بندر لنگه',
      'میناب',
      'جاسک',
      'پارسیان',
    ],
  },
  {
    province: 'آذربایجان غربی',
    cities: ['همه شهرهای آذربایجان غربی', 'ارومیه', 'خوی', 'بوکان', 'مهاباد', 'میاندوآب', 'ماکو (منطقه آزاد)', 'سلماس', 'نقده'],
  },
  {
    province: 'کرمان',
    cities: ['همه شهرهای کرمان', 'کرمان', 'سیرجان', 'رفسنجان', 'جیرفت', 'بم', 'زرند', 'بافت'],
  },
  {
    province: 'یزد',
    cities: ['همه شهرهای یزد', 'یزد (صفائیه، بافت تاریخی)', 'میبد', 'اردکان', 'مهریز', 'بافق', 'تفت'],
  },
  {
    province: 'مرکزی',
    cities: ['همه شهرهای استان مرکزی', 'اراک', 'ساوه', 'محلات (پایتخت سنگ و گل)', 'دلیجان', 'خمین', 'زرندیه'],
  },
  {
    province: 'قزوین',
    cities: ['همه شهرهای قزوین', 'قزوین', 'البرز (شهر صنعتی)', 'تاکستان', 'بوئین‌زهرا', 'آبیک', 'الموت'],
  },
  {
    province: 'قم',
    cities: ['همه مناطق قم', 'قم (سالاریه، صفائیه)', 'قم (پردیسان)', 'سلفچگان', 'جعفریه'],
  },
  {
    province: 'همدان',
    cities: ['همه شهرهای همدان', 'همدان (استادان، سعیدیه)', 'ملایر', 'نهاوند', 'تویسرکان', 'اسدآباد', 'کبودرآهنگ'],
  },
  {
    province: 'کرمانشاه',
    cities: ['همه شهرهای کرمانشاه', 'کرمانشاه', 'اسلام‌آباد غرب', 'کنگاور', 'سنقر', 'جوانرود', 'پاوه', 'سرپل ذهاب'],
  },
  {
    province: 'لرستان',
    cities: ['همه شهرهای لرستان', 'خرم‌آباد', 'بروجرد', 'دورود', 'الیگودرز', 'کوهدشت', 'ازنا', 'الشتر'],
  },
  {
    province: 'کردستان',
    cities: ['همه شهرهای کردستان', 'سنندج', 'سقز', 'مریوان', 'بانه', 'قروه', 'کامیاران', 'بیجار'],
  },
  {
    province: 'سمنان',
    cities: ['همه شهرهای سمنان', 'سمنان', 'شاهرود', 'دامغان', 'گرمسار', 'مهدی‌شهر (سنگسر)'],
  },
  {
    province: 'گلستان',
    cities: ['همه شهرهای گلستان', 'گرگان', 'گنبد کاووس', 'علی‌آباد کتول', 'بندر ترکمن', 'آزادشهر', 'کردکوی', 'مینودشت'],
  },
  {
    province: 'زنجان',
    cities: ['همه شهرهای زنجان', 'زنجان', 'ابهر', 'خرمدره', 'قیدار (خدابنده)', 'طارم', 'سلطانیه'],
  },
  {
    province: 'بوشهر',
    cities: ['همه شهرهای بوشهر', 'بوشهر', 'عسلویه و کنگان', 'برازجان (دشتستان)', 'گناوه', 'دیلم', 'جم', 'خورموج'],
  },
  {
    province: 'سیستان و بلوچستان',
    cities: ['همه شهرهای سیستان و بلوچستان', 'زاهدان', 'چابهار (منطقه آزاد)', 'زابل', 'ایرانشهر', 'سراوان', 'خاش', 'کنارک'],
  },
  {
    province: 'اردبیل',
    cities: ['همه شهرهای اردبیل', 'اردبیل', 'سرعین', 'پارس‌آباد (مغان)', 'مشگین‌شهر', 'خلخال', 'گرمی', 'نمین'],
  },
  {
    province: 'چهارمحال و بختیاری',
    cities: ['همه شهرهای چهارمحال و بختیاری', 'شهرکرد', 'بروجن', 'لردگان', 'فارسان', 'سامان', 'کوهرنگ'],
  },
  {
    province: 'خراسان جنوبی',
    cities: ['همه شهرهای خراسان جنوبی', 'بیرجند', 'قائنات', 'فردوس', 'طبس', 'نهبندان', 'بشرویه'],
  },
  {
    province: 'خراسان شمالی',
    cities: ['همه شهرهای خراسان شمالی', 'بجنورد', 'شیروان', 'اسفراین', 'آشخانه (مانه و سملقان)', 'فاروج'],
  },
  {
    province: 'ایلام',
    cities: ['همه شهرهای ایلام', 'ایلام', 'دهلران', 'ایوان', 'مهران (مرز بین‌المللی)', 'آبدانان', 'دره‌شهر'],
  },
  {
    province: 'کهگیلویه و بویراحمد',
    cities: ['همه شهرهای کهگیلویه و بویراحمد', 'یاسوج', 'دوگنبدان (گچساران)', 'دهدشت', 'سی‌سخت (دنا)', 'چرام'],
  },
];

export const CitySelectModal: React.FC<CitySelectModalProps> = ({
  isOpen,
  onClose,
  selectedCity,
  onSelectCity,
}) => {
  const [search, setSearch] = useState('');
  const [activeProvinceFilter, setActiveProvinceFilter] = useState<string>('all');

  const quickCitiesRef = useRef<HTMLDivElement>(null);
  const provincesRef = useRef<HTMLDivElement>(null);

  const scrollContainer = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    if (ref.current) {
      const scrollAmount = direction === 'left' ? -220 : 220;
      ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const filteredProvinces = useMemo(() => {
    const q = search.trim();

    return IRAN_ALL_PROVINCES.map((group) => {
      // If province filter is active and not 'all', filter out other provinces
      if (activeProvinceFilter !== 'all' && group.province !== activeProvinceFilter) {
        return null;
      }

      // If no search query, return the group as-is
      if (!q) {
        return group;
      }

      // If province matches search query, keep all its cities
      if (group.province.includes(q)) {
        return group;
      }

      // Filter cities matching search query
      const matchedCities = group.cities.filter((c) => c.includes(q));
      if (matchedCities.length > 0) {
        return {
          ...group,
          cities: matchedCities,
        };
      }

      return null;
    }).filter((g): g is ProvinceData => g !== null);
  }, [search, activeProvinceFilter]);

  if (!isOpen) return null;

  const quickCities = ['تهران', 'مشهد', 'اصفهان', 'شیراز', 'تبریز', 'کرج', 'ساری', 'کیش'];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/65 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 40 }}
          className="bg-[#faf8f4] rounded-t-[36px] sm:rounded-[32px] w-full max-w-3xl max-h-[92vh] flex flex-col shadow-[0_20px_60px_rgba(160,118,48,0.28)] overflow-hidden border-2 border-[#dfc282]"
          dir="rtl"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#e8dfcf] flex items-center justify-between bg-white/90 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl btn-3d-gold flex items-center justify-center text-[#2c1b04] shadow-2xs shrink-0">
                <MapPin className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-950">
                  انتخاب استان و شهر (۳۱ استان سراسر کشور)
                </h3>
                <p className="text-xs sm:text-[13px] font-bold text-slate-600 mt-0.5">
                  پوشش سراسری فایل‌های ملکی، مصالح و پروژه‌های عمرانی
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-600 border border-slate-200 hover:border-red-200 flex items-center justify-center cursor-pointer shadow-2xs active:scale-90 transition-all"
              aria-label="بستن"
              title="بستن پنجره"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>

          {/* Search box & Quick Chips */}
          <div className="p-4 sm:p-5 border-b border-[#ede6d8] bg-[#faf8f4] space-y-3.5 shrink-0">
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="جستجوی نام هر یک از ۳۱ استان، شهر یا منطقه..."
                className="w-full bg-white border-2 border-[#dfc282] focus:border-[#caa758] rounded-2xl py-3 pl-10 pr-11 text-sm sm:text-[15px] font-black text-slate-950 placeholder-slate-400 focus:outline-none shadow-2xs transition-all"
              />
              <Search className="w-5 h-5 text-[#9a7228] absolute right-3.5 top-3.5" />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute left-3.5 top-3.5 text-slate-400 hover:text-slate-700 p-1"
                >
                  <X className="w-4 h-4 stroke-[3]" />
                </button>
              )}
            </div>

            {/* Quick Cities Row with Left/Right Scroll Arrows & Mouse Wheel Horizontal Support */}
            <div className="relative flex items-center gap-1.5">
              <span className="text-xs sm:text-[13px] font-black text-slate-800 shrink-0 ml-1">
                دسترسی سریع:
              </span>

              {/* Scroll Right Arrow */}
              <button
                type="button"
                onClick={() => scrollContainer(quickCitiesRef, 'right')}
                className="w-7 h-8 rounded-lg btn-3d-gold text-[#2c1b04] flex items-center justify-center shrink-0 shadow-2xs cursor-pointer active:scale-95 transition-transform"
                title="اسکرول به راست"
              >
                <ChevronRight className="w-4 h-4 stroke-[3]" />
              </button>

              <div
                ref={quickCitiesRef}
                onWheel={(e) => {
                  if (quickCitiesRef.current) {
                    quickCitiesRef.current.scrollLeft += e.deltaY;
                  }
                }}
                className="flex-1 flex items-center gap-2 overflow-x-auto pb-1 select-none scroll-smooth scrollbar-thin"
                style={{ scrollbarWidth: 'thin' }}
              >
                <button
                  onClick={() => {
                    onSelectCity('همه شهرهای ایران');
                    onClose();
                  }}
                  className={`h-9 px-3.5 rounded-xl text-[14.5px] font-black shrink-0 transition-all cursor-pointer flex items-center justify-center active:scale-95 ${
                    selectedCity === 'همه شهرهای ایران'
                      ? 'btn-3d-gold text-[#2c1b04] shadow-2xs'
                      : 'bg-white hover:bg-amber-50 text-slate-900 border-2 border-[#dfc282] shadow-2xs'
                  }`}
                >
                  کل کشور
                </button>
                {quickCities.map((qCity) => (
                  <button
                    key={qCity}
                    onClick={() => {
                      onSelectCity(qCity);
                      onClose();
                    }}
                    className={`h-9 px-3.5 rounded-xl text-[14.5px] font-black shrink-0 transition-all cursor-pointer flex items-center justify-center active:scale-95 ${
                      selectedCity === qCity
                        ? 'btn-3d-gold text-[#2c1b04] shadow-2xs'
                        : 'bg-white hover:bg-amber-50 text-slate-900 border-2 border-[#dfc282] shadow-2xs'
                    }`}
                  >
                    {qCity}
                  </button>
                ))}
              </div>

              {/* Scroll Left Arrow */}
              <button
                type="button"
                onClick={() => scrollContainer(quickCitiesRef, 'left')}
                className="w-7 h-8 rounded-lg btn-3d-gold text-[#2c1b04] flex items-center justify-center shrink-0 shadow-2xs cursor-pointer active:scale-95 transition-transform"
                title="اسکرول به چپ"
              >
                <ChevronLeft className="w-4 h-4 stroke-[3]" />
              </button>
            </div>

            {/* 31 Province Filter Chips with Left/Right Scroll Arrows & Mouse Wheel Horizontal Support */}
            <div className="relative flex items-center gap-1.5 pt-1">
              {/* Scroll Right Arrow */}
              <button
                type="button"
                onClick={() => scrollContainer(provincesRef, 'right')}
                className="w-7 h-8 rounded-lg btn-3d-gold text-[#2c1b04] flex items-center justify-center shrink-0 shadow-2xs cursor-pointer active:scale-95 transition-transform"
                title="اسکرول به راست"
              >
                <ChevronRight className="w-4 h-4 stroke-[3]" />
              </button>

              <div
                ref={provincesRef}
                onWheel={(e) => {
                  if (provincesRef.current) {
                    provincesRef.current.scrollLeft += e.deltaY;
                  }
                }}
                className="flex-1 flex items-center gap-1.5 overflow-x-auto pb-1 select-none scroll-smooth scrollbar-thin"
                style={{ scrollbarWidth: 'thin' }}
              >
                <button
                  onClick={() => setActiveProvinceFilter('all')}
                  className={`h-8.5 px-3 rounded-xl text-[13.5px] font-black shrink-0 transition-all cursor-pointer flex items-center justify-center ${
                    activeProvinceFilter === 'all'
                      ? 'btn-3d-gold text-[#2c1b04] shadow-2xs'
                      : 'bg-white text-slate-700 border-2 border-[#dfc282] hover:bg-amber-50/60'
                  }`}
                >
                  تمام استان‌ها ({IRAN_ALL_PROVINCES.length})
                </button>
                {IRAN_ALL_PROVINCES.map((p) => (
                  <button
                    key={p.province}
                    onClick={() => setActiveProvinceFilter(p.province === activeProvinceFilter ? 'all' : p.province)}
                    className={`h-8.5 px-3.5 rounded-xl text-[13.5px] font-black shrink-0 transition-all cursor-pointer flex items-center justify-center ${
                      activeProvinceFilter === p.province
                        ? 'btn-3d-gold text-[#2c1b04] shadow-2xs'
                        : 'bg-white text-slate-700 border-2 border-[#dfc282] hover:bg-amber-50/60'
                    }`}
                  >
                    {p.province}
                  </button>
                ))}
              </div>

              {/* Scroll Left Arrow */}
              <button
                type="button"
                onClick={() => scrollContainer(provincesRef, 'left')}
                className="w-7 h-8 rounded-lg btn-3d-gold text-[#2c1b04] flex items-center justify-center shrink-0 shadow-2xs cursor-pointer active:scale-95 transition-transform"
                title="اسکرول به چپ"
              >
                <ChevronLeft className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          </div>

          {/* Cities List with 31 Provinces (Smooth Vertical Scroll) */}
          <div 
            className="p-4 sm:p-5 space-y-5 flex-1 min-h-0 overflow-y-auto custom-gold-scrollbar overscroll-contain touch-pan-y scroll-smooth"
          >
            {/* Quick Option: All Iran */}
            <button
              onClick={() => {
                onSelectCity('همه شهرهای ایران');
                onClose();
              }}
              className={`w-full p-4 rounded-2xl flex items-center justify-between text-right border-2 transition-all cursor-pointer ${
                selectedCity === 'همه شهرهای ایران'
                  ? 'btn-3d-gold text-[#2c1b04] shadow-md border-amber-500'
                  : 'bg-white border-[#dfc282] hover:bg-amber-50/50 text-slate-950 font-black shadow-2xs'
              }`}
            >
              <div className="flex items-center gap-3">
                <Compass className="w-5 h-5 text-amber-800 stroke-[2.5]" />
                <span className="text-sm sm:text-[15px] font-black">
                  سراسر کشور (همه استان‌ها و شهرهای ایران)
                </span>
              </div>
              {selectedCity === 'همه شهرهای ایران' && (
                <Check className="w-5 h-5 text-[#2c1b04] stroke-[3]" />
              )}
            </button>

            {filteredProvinces.length === 0 ? (
              <div className="p-8 text-center text-slate-600 font-bold text-sm space-y-2">
                <p className="font-black text-slate-800 text-base">موردی با این نام یافت نشد.</p>
                <p className="text-slate-500">نام شهر یا استان دیگری را در کادر بالا جستجو نمایید.</p>
              </div>
            ) : (
              filteredProvinces.map((group) => (
                <div key={group.province} className="space-y-2.5 bg-white p-4 rounded-2xl border-2 border-[#dfc282] shadow-2xs">
                  <div className="text-sm font-black text-amber-950 px-1 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-600 inline-block"></span>
                      <span>استان {group.province}</span>
                    </div>
                    <span className="text-xs font-bold text-slate-500 bg-[#faf8f4] px-2.5 py-0.5 rounded-lg border border-[#ede5d6]">
                      {group.cities.length} شهر / محدوده
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1.5">
                    {group.cities.map((city) => {
                      const isSelected = selectedCity === city;
                      return (
                        <button
                          key={city}
                          onClick={() => {
                            onSelectCity(city);
                            onClose();
                          }}
                          className={`p-3 rounded-xl text-[14.5px] text-right border-2 transition-all flex items-center justify-between cursor-pointer active:scale-98 ${
                            isSelected
                              ? 'btn-3d-gold text-[#2c1b04] font-black shadow-xs border-[#b88a31]'
                              : 'bg-[#faf9f6] border-[#e2dcd0] hover:border-[#caa758] hover:bg-white text-slate-950 font-bold shadow-2xs'
                          }`}
                        >
                          <span className="line-clamp-1 leading-snug">{city}</span>
                          {isSelected && (
                            <Check className="w-4.5 h-4.5 text-[#2c1b04] stroke-[3] shrink-0 mr-1.5" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Action Bar */}
          <div className="p-4 sm:p-5 border-t border-[#ede6d8] bg-white/95 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold text-slate-600">شهر و محدوده فعال:</span>
              <span className="text-xs sm:text-sm font-black text-amber-950 bg-amber-100/90 px-3 py-1 rounded-xl border border-amber-300">
                {selectedCity}
              </span>
            </div>

            <button
              onClick={onClose}
              className="w-full sm:w-auto h-10.5 px-7 btn-3d-gold text-[#2c1b04] text-[15px] font-black rounded-xl shadow-2xs cursor-pointer active:scale-95 transition-transform flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4.5 h-4.5 stroke-[2.5]" />
              <span>تأیید و انتخاب شهر</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
