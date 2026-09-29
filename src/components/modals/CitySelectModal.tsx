import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, MapPin, Check, Compass, ChevronDown, ChevronUp } from 'lucide-react';

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
      'ایذه و باغملک',
      'شوشتر و شوش',
      'مسجدسلیمان',
      'رامهرمز و امیدیه',
    ],
  },
  {
    province: 'آذربایجان غربی',
    cities: [
      'همه شهرهای آذربایجان غربی',
      'ارومیه',
      'خوی',
      'بوکان',
      'مهاباد',
      'میاندوآب',
      'سلماس',
      'نقده',
      'پیرانشهر و سردشت',
      'ماکو و منطقه آزاد',
    ],
  },
  {
    province: 'کرمان',
    cities: [
      'همه شهرهای کرمان',
      'کرمان',
      'سیرجان',
      'رفسنجان',
      'جیرفت',
      'بم',
      'زرند',
      'کهنوج',
      'شهربابک',
      'بافت و بردسیر',
    ],
  },
  {
    province: 'هرمزگان و جزایر',
    cities: [
      'همه مناطق هرمزگان',
      'بندرعباس',
      'جزیره کیش',
      'جزیره قشم',
      'میناب',
      'بندرلنگه',
      'کنگ',
      'جاسک',
      'حاجی‌آباد',
      'پارسیان',
    ],
  },
  {
    province: 'یزد',
    cities: [
      'همه شهرهای یزد',
      'یزد (صفاییه، بلوار جمهوری)',
      'میبد',
      'اردکان',
      'مهریز',
      'بافق',
      'ابرکوه',
      'تفت',
    ],
  },
  {
    province: 'قم',
    cities: [
      'همه مناطق قم',
      'قم (سالاریه، باجک، زنبیل‌آباد)',
      'قم (پردیسان)',
      'کهک',
      'سلفچگان (منطقه ویژه)',
      'جعفریه',
    ],
  },
  {
    province: 'کرمانشاه',
    cities: [
      'همه شهرهای کرمانشاه',
      'کرمانشاه (نوبهار، فردوسی، ۲۲ بهمن)',
      'اسلام‌آباد غرب',
      'کنگاور',
      'سنقر',
      'جوانرود',
      'هرسین',
      'سرپل ذهاب',
      'پاوه و روانسر',
    ],
  },
  {
    province: 'همدان',
    cities: [
      'همه شهرهای همدان',
      'همدان (سعیدیه، اعتمادیه، استادان)',
      'ملایر',
      'نهاوند',
      'تویسرکان',
      'اسدآباد',
      'بهار و لالجین',
      'کبودرآهنگ',
    ],
  },
  {
    province: 'قزوین',
    cities: [
      'همه شهرهای قزوین',
      'قزوین (ملاصدرا، خیام، دانشگاه)',
      'الوند و شهر صنعتی البرز',
      'تاکستان',
      'بوئین‌زهرا',
      'آبیک',
      'محمدیه (زیباشهر)',
    ],
  },
  {
    province: 'زنجان',
    cities: [
      'همه شهرهای زنجان',
      'زنجان (کارمندان، انصاریه، اعتمادیه)',
      'ابهر',
      'خرمدره',
      'قیدار',
      'طارم',
      'ماهنشان',
    ],
  },
  {
    province: 'سمنان',
    cities: [
      'همه شهرهای سمنان',
      'سمنان',
      'شاهرود',
      'دامغان',
      'گرمسار و ایوانکی',
      'مهدی‌شهر و شهمیرزاد',
    ],
  },
  {
    province: 'مرکزی',
    cities: [
      'همه شهرهای استان مرکزی',
      'اراک',
      'ساوه (شهر صنعتی کاوه)',
      'خمین',
      'محلات (قطب سنگ و گل)',
      'دلیجان',
      'شازند',
      'تفرش و آشتیان',
    ],
  },
  {
    province: 'بوشهر',
    cities: [
      'همه شهرهای بوشهر',
      'بوشهر',
      'برازجان',
      'عسلویه و پارس جنوبی',
      'کنگان',
      'گناوه',
      'خورموج',
      'دیلم و جم',
    ],
  },
  {
    province: 'گلستان',
    cities: [
      'همه شهرهای گلستان',
      'گرگان (ناهارخوران، عدالت)',
      'گنبد کاووس',
      'علی‌آباد کتول',
      'بندر ترکمن',
      'آق‌قلا',
      'کلاله و مینوشت',
      'کردکوی و آزادشهر',
    ],
  },
  {
    province: 'لرستان',
    cities: [
      'همه شهرهای لرستان',
      'خرم‌آباد',
      'بروجرد',
      'دورود',
      'کوهدشت',
      'الیگودرز',
      'نورآباد',
      'پلدختر و ازنا',
    ],
  },
  {
    province: 'کردستان',
    cities: [
      'همه شهرهای کردستان',
      'سنندج (مبارک‌آباد، آبیدر)',
      'سقز',
      'مریوان و زریوار',
      'بانه',
      'قروه',
      'بیجار',
      'کامیاران و دیواندره',
    ],
  },
  {
    province: 'اردبیل',
    cities: [
      'همه شهرهای اردبیل',
      'اردبیل',
      'سرعین',
      'پارس‌آباد مغان',
      'مشگین‌شهر',
      'خلخال',
      'گرمی و بیله‌سوار',
    ],
  },
  {
    province: 'سیستان و بلوچستان',
    cities: [
      'همه شهرهای سیستان و بلوچستان',
      'زاهدان',
      'منطقه آزاد چابهار',
      'زابل',
      'ایرانشهر',
      'سراوان',
      'خاش',
      'نیک‌شهر و کنارک',
    ],
  },
  {
    province: 'چهارمحال و بختیاری',
    cities: [
      'همه شهرهای چهارمحال و بختیاری',
      'شهرکرد',
      'بروجن',
      'لردگان',
      'فرخشهر',
      'فارسان',
      'سامان',
    ],
  },
  {
    province: 'کهگیلویه و بویراحمد',
    cities: [
      'همه شهرهای کهگیلویه و بویراحمد',
      'یاسوج',
      'دوگنبدان (گچساران)',
      'دهدشت',
      'سی‌سخت',
      'چرام و لنده',
    ],
  },
  {
    province: 'ایلام',
    cities: [
      'همه شهرهای ایلام',
      'ایلام',
      'ایوان',
      'دهلران',
      'آبدانان',
      'چرداول',
      'مهران',
      'دره‌شهر',
    ],
  },
  {
    province: 'خراسان جنوبی',
    cities: [
      'همه شهرهای خراسان جنوبی',
      'بیرجند',
      'قائن',
      'طبس',
      'فردوس',
      'نهبندان',
      'سرایان و بشرویه',
    ],
  },
  {
    province: 'خراسان شمالی',
    cities: [
      'همه شهرهای خراسان شمالی',
      'بجنورد',
      'شیروان',
      'اسفراین',
      'جاجرم و گرمه',
      'مانه و سملقان',
    ],
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

  const filteredProvinces = useMemo(() => {
    const q = search.trim().toLowerCase();
    return IRAN_ALL_PROVINCES.map((group) => {
      if (activeProvinceFilter !== 'all' && group.province !== activeProvinceFilter) {
        return null;
      }

      if (!q) {
        return group;
      }

      const matchProvince = group.province.toLowerCase().includes(q);
      const matchedCities = group.cities.filter((c) =>
        c.toLowerCase().includes(q)
      );

      if (matchProvince) {
        return group;
      }

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
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="bg-[#fbf9f4] rounded-t-[36px] sm:rounded-[32px] w-full max-w-2xl max-h-[90vh] flex flex-col shadow-[0_20px_60px_rgba(160,118,48,0.25)] overflow-hidden border-2 border-[#dfc282]"
          dir="rtl"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#e8dfcf] flex items-center justify-between bg-white/70 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl btn-3d-gold flex items-center justify-center text-[#2c1b04] shadow-2xs shrink-0">
                <MapPin className="w-4.5 h-4.5 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black text-slate-950">انتخاب استان و شهر (۳۱ استان ایران)</h3>
                <p className="text-xs font-bold text-slate-600 mt-0.5">پوشش سراسری فایل‌های ملکی، مصالح و پروژه‌های عمرانی</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl btn-3d-gold text-[#2c1b04] flex items-center justify-center cursor-pointer shadow-2xs active:scale-95 transition-transform"
              aria-label="بستن"
            >
              <X className="w-4 h-4 stroke-[3]" />
            </button>
          </div>

          {/* Search box & Quick Chips */}
          <div className="p-3.5 sm:p-4 border-b border-[#ede6d8] bg-[#fbf9f4] space-y-3">
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="جستجوی نام هر یک از ۳۱ استان، شهر یا منطقه..."
                className="w-full bg-white border-2 border-[#dfc282] focus:border-[#caa758] rounded-xl py-2.5 pl-10 pr-10 text-xs sm:text-sm font-black text-slate-950 placeholder-slate-400 focus:outline-none shadow-2xs transition-all"
              />
              <Search className="w-4.5 h-4.5 text-[#a87d32] absolute right-3.5 top-3" />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute left-3.5 top-3 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick Cities Pill Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5 text-xs">
              <span className="text-[11px] font-black text-slate-700 shrink-0 ml-1">دسترسی سریع:</span>
              <button
                onClick={() => {
                  onSelectCity('همه شهرهای ایران');
                  onClose();
                }}
                className={`px-3 py-1.5 rounded-xl font-black shrink-0 transition-colors cursor-pointer ${
                  selectedCity === 'همه شهرهای ایران'
                    ? 'btn-3d-gold text-[#2c1b04] shadow-xs'
                    : 'bg-white hover:bg-amber-50 text-slate-900 border border-[#dfc282]'
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
                  className={`px-3 py-1.5 rounded-xl font-black shrink-0 transition-colors cursor-pointer ${
                    selectedCity === qCity
                      ? 'btn-3d-gold text-[#2c1b04] shadow-xs'
                      : 'bg-white hover:bg-amber-50 text-slate-900 border border-[#dfc282]'
                  }`}
                >
                  {qCity}
                </button>
              ))}
            </div>

            {/* 31 Province Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 text-[11px]">
              <button
                onClick={() => setActiveProvinceFilter('all')}
                className={`px-2.5 py-1 rounded-lg font-black shrink-0 transition-colors cursor-pointer ${
                  activeProvinceFilter === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                تمام استان‌ها ({IRAN_ALL_PROVINCES.length})
              </button>
              {IRAN_ALL_PROVINCES.map((p) => (
                <button
                  key={p.province}
                  onClick={() => setActiveProvinceFilter(p.province === activeProvinceFilter ? 'all' : p.province)}
                  className={`px-2.5 py-1 rounded-lg font-bold shrink-0 transition-colors cursor-pointer ${
                    activeProvinceFilter === p.province
                      ? 'bg-amber-600 text-white'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {p.province}
                </button>
              ))}
            </div>
          </div>

          {/* Cities List with 31 Provinces */}
          <div className="overflow-y-auto no-scrollbar p-4 space-y-5 flex-1 max-h-[58vh]">
            {/* Quick Option: All Iran */}
            <button
              onClick={() => {
                onSelectCity('همه شهرهای ایران');
                onClose();
              }}
              className={`w-full p-3.5 rounded-2xl flex items-center justify-between text-right border transition-all cursor-pointer ${
                selectedCity === 'همه شهرهای ایران'
                  ? 'bg-amber-100 border-amber-500 text-amber-950 font-black shadow-sm'
                  : 'bg-[#faf8f4] border-[#e2dcd0] hover:bg-white text-slate-900 font-bold'
              }`}
            >
              <div className="flex items-center gap-3">
                <Compass className="w-5 h-5 text-amber-700" />
                <span className="text-sm font-black">سراسر کشور (همه استان‌ها و شهرهای ایران)</span>
              </div>
              {selectedCity === 'همه شهرهای ایران' && <Check className="w-5 h-5 text-amber-700 stroke-[3]" />}
            </button>

            {filteredProvinces.length === 0 ? (
              <div className="p-8 text-center text-slate-600 font-bold text-xs space-y-1">
                <p>موردی با این نام یافت نشد.</p>
                <p className="text-slate-400">نام شهر یا استان دیگری را جستجو کنید.</p>
              </div>
            ) : (
              filteredProvinces.map((group) => (
                <div key={group.province} className="space-y-2 bg-[#fffdfa] p-3 rounded-2xl border border-[#ede6d8]">
                  <div className="text-xs font-black text-amber-950 px-1 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-600 inline-block"></span>
                      <span>استان {group.province}</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-500">
                      {group.cities.length} شهر / محدوده
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                    {group.cities.map((city) => {
                      const isSelected = selectedCity === city;
                      return (
                        <button
                          key={city}
                          onClick={() => {
                            onSelectCity(city);
                            onClose();
                          }}
                          className={`p-2.5 rounded-xl text-xs text-right border transition-all flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? 'bg-amber-100 border-amber-500 text-amber-950 font-black shadow-xs'
                              : 'bg-white border-[#ded5c5] hover:bg-amber-50/50 hover:border-amber-400 text-slate-900 font-bold'
                          }`}
                        >
                          <span className="truncate">{city}</span>
                          {isSelected && <Check className="w-4 h-4 text-amber-700 stroke-[3] shrink-0 mr-1" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Action */}
          <div className="p-4 border-t border-[#ede6d8] bg-[#fbf9f4] flex items-center justify-between">
            <span className="text-xs font-black text-slate-800">
              شهر فعال: <span className="text-amber-800 font-black">{selectedCity}</span>
            </span>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-[#a37936] hover:bg-[#8f6628] text-white text-xs font-black rounded-xl shadow-md cursor-pointer transition-all"
            >
              تأیید و بازگشت
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
