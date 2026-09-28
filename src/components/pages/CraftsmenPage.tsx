import React, { useState } from 'react';
import { 
  HardHat, 
  Mountain, 
  Truck, 
  Pickaxe, 
  CheckCircle2, 
  Phone, 
  MapPin, 
  Briefcase, 
  Sparkles, 
  ShieldCheck, 
  Filter, 
  Calendar,
  Layers,
  Award
} from 'lucide-react';
import { formatToman, formatTomanShort, toPersianDigits, maskPhoneNumber } from '../../utils/formatters';

interface MiningAndCivilItem {
  id: string;
  category: 'mines' | 'machinery' | 'civil_contractors' | 'craftsmen';
  title: string;
  subtitle: string;
  location: string;
  phone: string;
  capacityOrSpec: string;
  pricing: string;
  rating: number;
  verified: boolean;
  image: string;
  tags: string[];
}

const mockCivilData: MiningAndCivilItem[] = [
  // 1. Mines
  {
    id: 'mine-1',
    category: 'mines',
    title: 'معدن سنگ تراورتن حاجی‌آباد و عباس‌آباد',
    subtitle: 'استخراج مستقیم سنگ کوپ ممتاز، کرم و شکلاتی با پروانه بهره‌برداری رسمی',
    location: 'محلات، استان مرکزی',
    phone: '09121112233',
    capacityOrSpec: 'ظرفیت استخراج: ۱۲۰,۰۰۰ تن سالانه',
    pricing: 'فروش کوپ از ۳,۸۰۰,۰۰۰ تومان هر تن',
    rating: 4.9,
    verified: true,
    image: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&q=80&w=700',
    tags: ['سنگ کوپ', 'تراورتن سوپر', 'پروانه وزارت صمت'],
  },
  {
    id: 'mine-2',
    category: 'mines',
    title: 'معدن شن و ماسه کوهی و ماسه شسته شهریار',
    subtitle: 'تأمین مستقیم دانه‌بندی ۰۶ و ماسه دوبار شور شکسته استاندارد برای بچینگ',
    location: 'تهران - شهریار',
    phone: '09123334455',
    capacityOrSpec: 'تولید روزانه: ۲,۵۰۰ تن پای سینه کار',
    pricing: 'هر تن ۱۶۵,۰۰۰ تومان پای لودر',
    rating: 4.8,
    verified: true,
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=700',
    tags: ['ماسه شسته', 'شن نخودی و بادامی', 'تحویل فوری پای‌کار'],
  },
  {
    id: 'mine-3',
    category: 'mines',
    title: 'معدن پوکه معدنی قروه سنندج (سبک‌دانه)',
    subtitle: 'پوکه فندقی، عدسی و بادامی با وزن مخصوص زیر ۵۰۰ کیلوگرم بر متر مکعب',
    location: 'کردستان - قروه',
    phone: '09187778899',
    capacityOrSpec: 'ارسال با کمپرسی و تریلی ده چرخ',
    pricing: 'هر متر مکعب ۳۱۰,۰۰۰ تومان',
    rating: 4.9,
    verified: true,
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=700',
    tags: ['پوکه سبک', 'عایق صوتی و حرارتی', 'شیب‌بندی بام'],
  },

  // 2. Heavy Machinery
  {
    id: 'mach-1',
    category: 'machinery',
    title: 'ناوگان بیل مکانیکی کوماتسو PC220 و زنجیری هیوندای ۲۱۰',
    subtitle: 'آماده خاک‌برداری گودهای عمیق، تخریب، کانال‌کنی و پیکور با اپراتور مجرب',
    location: 'تهران و حومه (آماده اعزام سراسری)',
    phone: '09125556677',
    capacityOrSpec: 'باکت ۱.۲ متر مکعب + چکش هیدرولیکی',
    pricing: 'اجاره ماهانه یا متری توافقی',
    rating: 4.9,
    verified: true,
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?auto=format&fit=crop&q=80&w=700',
    tags: ['بیل مکانیکی', 'پیکور سنگین', 'گودبرداری عمیق'],
  },
  {
    id: 'mach-2',
    category: 'machinery',
    title: 'تاورکرین ۱۰ تن پتان فرانسوی با خودنصب',
    subtitle: 'ارتفاع خودایستا تا ۶۵ متر، با دفترچه بازرسی فنی معتبر و بیمه مسئولیت',
    location: 'تهران - منطقه ۱ و ۲',
    phone: '09128889900',
    capacityOrSpec: 'طول فلش ۶۰ متر، نوک فلش ۲.۵ تن',
    pricing: 'اجاره ماهیانه ۱۸۰,۰۰۰,۰۰۰ تومان',
    rating: 5.0,
    verified: true,
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=700',
    tags: ['جرثقیل برجی', 'استاندارد ایمنی', 'مونتاژ و دمونتاژ'],
  },
  {
    id: 'mach-3',
    category: 'machinery',
    title: 'لودر کاترپیلار ۹۶۶ و ۹۸۸ جهت بارگیری و معدن',
    subtitle: 'مخصوص بارگیری شن و ماسه، باطله‌برداری معادن و تسطیح محوطه کارگاهی',
    location: 'اصفهان و یزد',
    phone: '09132223344',
    capacityOrSpec: 'موتور اورهال، آماده شیفت کاری سنگین',
    pricing: 'شیفتی یا ماهانه بر اساس قرارداد',
    rating: 4.8,
    verified: true,
    image: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&q=80&w=700',
    tags: ['لودر سنگین', 'باطله‌برداری', 'بارگیری معدن'],
  },

  // 3. Civil Contractors
  {
    id: 'civ-1',
    category: 'civil_contractors',
    title: 'شرکت راه‌سازی و آسفالت‌کاری پیشگامان عمران',
    subtitle: 'اجرای آسفالت مکانیزه با فینیشر، زیرسازی، جدول‌گذاری بتنی و محوطه‌سازی کارخانجات',
    location: 'تهران، البرز و قزوین',
    phone: '02188990011',
    capacityOrSpec: 'تولید و پخش آسفالت توپکا و بیندر',
    pricing: 'محاسبه بر اساس متر مربع و ضخامت',
    rating: 4.9,
    verified: true,
    image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&q=80&w=700',
    tags: ['راه‌سازی', 'پخش آسفالت', 'جدول‌گذاری مکانیزه'],
  },
  {
    id: 'civ-2',
    category: 'civil_contractors',
    title: 'پیمانکاری پایدارسازی گود و نیلینگ شایان',
    subtitle: 'اجرای تخصصی سازه نگهبان خرپایی، نیلینگ، انکراژ و شمع بتنی درجا با تاییدیه نظام مهندسی',
    location: 'تهران - تمام مناطق',
    phone: '09126667788',
    capacityOrSpec: 'تا عمق ۳۲ متر با سنسور مانیتورینگ نشست',
    pricing: 'استعلام قیمت بر اساس نقشه ژئوتکنیک',
    rating: 4.9,
    verified: true,
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?auto=format&fit=crop&q=80&w=700',
    tags: ['نیلینگ', 'سازه نگهبان', 'تاییدیه نظام مهندسی'],
  },

  // 4. Craftsmen
  {
    id: 'crf-1',
    category: 'craftsmen',
    title: 'استاد علی رضایی - اکیپ آرماتوربندی و قالب‌بندی بتنی',
    subtitle: 'اجرای فونداسیون، سقف وافل، یوبوت و تیرچه بلوک با ۲۰ سال سابقه و اکیپ ۱۵ نفره',
    location: 'تهران و پردیس',
    phone: '09124445566',
    capacityOrSpec: 'توان اجرای ۳,۰۰۰ متر سقف در ماه',
    pricing: 'دستمزد متری و کیلویی طبق تعرفه اتحادیه',
    rating: 4.9,
    verified: true,
    image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=700',
    tags: ['آرماتوربندی', 'سقف وافل', 'قالب‌بندی فلزی'],
  },
  {
    id: 'crf-2',
    category: 'craftsmen',
    title: 'مهندس بهرام نیازی - مجری تأسیسات مکانیکی و برق هوشمند',
    subtitle: 'لوله‌کشی پنج‌لایه نیوپایپ، گرمایش از کف، موتورخانه مرکزی و هوشمندسازی BMS ساختمان',
    location: 'تهران - منطقه ۱ و ۳',
    phone: '09127778811',
    capacityOrSpec: 'دارای پروانه پایه یک نظام مهندسی',
    pricing: 'قرارداد اجرایی صفر تا صد',
    rating: 5.0,
    verified: true,
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=700',
    tags: ['برق هوشمند', 'گرمایش از کف', 'تأسیسات ساختمان'],
  },
];

export const CraftsmenPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'mines' | 'machinery' | 'civil_contractors' | 'craftsmen'>('all');
  const [searchFilter, setSearchFilter] = useState('');

  const filteredItems = mockCivilData.filter((item) => {
    if (activeCategory !== 'all' && item.category !== activeCategory) return false;
    if (searchFilter.trim() && !item.title.includes(searchFilter) && !item.subtitle.includes(searchFilter) && !item.location.includes(searchFilter)) return false;
    return true;
  });

  return (
    <div className="space-y-6 pb-20 text-[#111827]" dir="rtl">
      
      {/* Header Banner */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#ded5c5] space-y-3 relative overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-950 border border-amber-300 px-3.5 py-1 rounded-full text-xs font-black mb-2 shadow-xs">
              <Mountain className="w-3.5 h-3.5 text-amber-700" />
              <span>پیوند عمران، معادن و ماشین‌آلات سنگین</span>
            </div>
            <h1 className="text-lg sm:text-xl font-black text-slate-950">
              شبکه جامع معادن، ماشین‌آلات راه و معدن و پیمانکاران اجرایی
            </h1>
            <p className="text-xs text-slate-700 font-semibold mt-1 max-w-2xl leading-relaxed">
              ارتباط مستقیم با معدن‌داران سنگ و شن و ماسه، ماشین‌آلات سنگین (بیل مکانیکی، لودر، تاورکرین)، پیمانکاران راه‌سازی و استادکاران دارای رتبه‌بندی رسمی.
            </p>
          </div>

          <div className="bg-[#fffcf7] p-3.5 rounded-2xl border border-amber-200 text-xs space-y-1 shrink-0 text-center">
            <span className="text-[10px] text-slate-600 font-bold block">هسته اصلی تولید:</span>
            <span className="font-black text-amber-950 text-xs flex items-center justify-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              تأییدیه پروانه بهره‌برداری
            </span>
          </div>
        </div>
      </div>

      {/* 4 Pillars Navigation Bar */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black shrink-0 transition-all cursor-pointer ${
            activeCategory === 'all'
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-sm'
              : 'bg-white hover:bg-slate-50 text-slate-800 border border-[#ded5c5]'
          }`}
        >
          تمام بخش‌های عمران و معدن
        </button>

        <button
          onClick={() => setActiveCategory('mines')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
            activeCategory === 'mines'
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-sm'
              : 'bg-white hover:bg-slate-50 text-slate-800 border border-[#ded5c5]'
          }`}
        >
          <Mountain className="w-3.5 h-3.5" />
          <span>معدن‌دارها و استخراج</span>
        </button>

        <button
          onClick={() => setActiveCategory('machinery')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
            activeCategory === 'machinery'
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-sm'
              : 'bg-white hover:bg-slate-50 text-slate-800 border border-[#ded5c5]'
          }`}
        >
          <Truck className="w-3.5 h-3.5" />
          <span>بیل مکانیکی و ماشین‌آلات</span>
        </button>

        <button
          onClick={() => setActiveCategory('civil_contractors')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
            activeCategory === 'civil_contractors'
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-sm'
              : 'bg-white hover:bg-slate-50 text-slate-800 border border-[#ded5c5]'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>راه‌سازی، گود و جدول‌کشی</span>
        </button>

        <button
          onClick={() => setActiveCategory('craftsmen')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
            activeCategory === 'craftsmen'
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-sm'
              : 'bg-white hover:bg-slate-50 text-slate-800 border border-[#ded5c5]'
          }`}
        >
          <HardHat className="w-3.5 h-3.5" />
          <span>استادکاران و مهندسان مجری</span>
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl p-5 border border-[#ded5c5] shadow-[0_2px_12px_rgba(0,0,0,0.04)] space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              {/* Image & Badges */}
              <div className="relative h-44 rounded-2xl overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <span className="absolute top-2.5 right-2.5 bg-slate-900/90 text-white text-[10px] font-black px-2.5 py-1 rounded-xl backdrop-blur-md">
                  {item.category === 'mines' && 'معدن‌دار رسمی'}
                  {item.category === 'machinery' && 'ماشین‌آلات عمرانی'}
                  {item.category === 'civil_contractors' && 'پیمانکار زیرساخت'}
                  {item.category === 'craftsmen' && 'استادکار مجرب'}
                </span>
                <span className="absolute bottom-2.5 left-2.5 bg-amber-500 text-slate-950 font-black text-[10px] px-2.5 py-1 rounded-xl shadow-md flex items-center gap-1">
                  <span>★ {item.rating}</span>
                </span>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-black text-sm text-slate-950">{item.title}</h3>
                  {item.verified && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                </div>
                <p className="text-[11px] text-slate-600 font-semibold mt-1 leading-relaxed">
                  {item.subtitle}
                </p>
              </div>

              {/* Specs & Pricing */}
              <div className="p-3 bg-[#fbf9f4] rounded-2xl border border-[#ded5c5] space-y-1.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 font-bold">موقعیت و لوکیشن:</span>
                  <span className="font-bold text-slate-900 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-700" />
                    {item.location}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 font-bold">مشخصات / ظرفیت:</span>
                  <span className="font-bold text-slate-900">{item.capacityOrSpec}</span>
                </div>
                <div className="flex justify-between items-center border-t border-[#ede6d8] pt-1.5">
                  <span className="text-slate-600 font-bold">نرخ / شرایط همکاری:</span>
                  <span className="font-black text-emerald-900">{item.pricing}</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {item.tags.map((tag, idx) => (
                  <span key={idx} className="text-[10px] bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-lg">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Direct Contact Button */}
            <div className="pt-2">
              <a
                href={`tel:${item.phone}`}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-black py-3 rounded-2xl flex items-center justify-center gap-2 shadow-md transition-colors"
              >
                <Phone className="w-4 h-4 text-amber-400" />
                <span>تماس مستقیم با تأمین‌کننده ({maskPhoneNumber(item.phone)})</span>
              </a>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
