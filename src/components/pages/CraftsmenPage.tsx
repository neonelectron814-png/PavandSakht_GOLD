import React, { useState } from 'react';
import { 
  Mountain, 
  Truck, 
  Pickaxe, 
  CheckCircle2, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  HardHat, 
  Search
} from 'lucide-react';
import { maskPhoneNumber } from '../../utils/formatters';

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
    image: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&q=80&w=700',
    tags: ['بیل مکانیکی', 'پیکور سنگین', 'گودبرداری'],
  },
  {
    id: 'mach-2',
    category: 'machinery',
    title: 'اجاره تاورکرین پتن ۱۲ و ۱۶ تن فرانسوی (Tower Crane)',
    subtitle: 'مونتاژ، دمونتاژ، اپراتوری، بیمه کامل و اخذ سرتیفیکیت استاندارد فنی ادواری',
    location: 'تهران، کرج و شمال کشور',
    phone: '09128889900',
    capacityOrSpec: 'طول فلش ۶۰ متر - تناژ نوک فلش ۲.۵ تن',
    pricing: 'اجاره ماهانه با تیم نگهداری مقیم',
    rating: 5.0,
    verified: true,
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?auto=format&fit=crop&q=80&w=700',
    tags: ['تاورکرین پتن', 'جرثقیل برجی', 'دارای سرتیفیکیت'],
  },
  {
    id: 'civ-1',
    category: 'civil_contractors',
    title: 'شرکت راه‌سازی و زیرساخت آسفالت آریا بتن',
    subtitle: 'پیمانکاری آسفالت، خاک‌ریزی، تسطیح، زیرسازی شهرک‌های صنعتی و معابر شهری با فینیشر',
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
      {/* Header Banner Card (Full Framed 3D Gold Box) */}
      <div className="bg-white p-5 sm:p-6 rounded-[28px] border-2 border-[#dfc282] space-y-3 relative overflow-hidden shadow-[0_4px_16px_rgba(180,130,40,0.1)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 btn-3d-gold text-[#2c1b04] px-3.5 py-1 rounded-xl text-xs font-black mb-2 shadow-2xs">
              <Mountain className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>پیوند عمران، معادن و ماشین‌آلات سنگین</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-950">
              شبکه جامع معادن، ماشین‌آلات راه و معدن و پیمانکاران اجرایی
            </h1>
            <p className="text-[15px] text-slate-700 font-bold mt-1 max-w-2xl leading-relaxed">
              ارتباط مستقیم با معدن‌داران سنگ و شن و ماسه، ماشین‌آلات سنگین (بیل مکانیکی، لودر، تاورکرین)، پیمانکاران راه‌سازی و استادکاران دارای رتبه‌بندی رسمی.
            </p>
          </div>

          <div className="bg-[#fffcf7] p-3.5 rounded-2xl border-2 border-[#dfc282] text-xs space-y-1 shrink-0 text-center shadow-2xs">
            <span className="text-xs text-slate-600 font-bold block">هسته اصلی تولید:</span>
            <span className="font-black text-amber-950 text-[15px] flex items-center justify-center gap-1">
              <ShieldCheck className="w-4.5 h-4.5 text-emerald-700" />
              تأییدیه پروانه بهره‌برداری
            </span>
          </div>
        </div>
      </div>

      {/* 4 Pillars Navigation Bar (Compact 3D Gold Buttons, 15px Font) */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        <button
          onClick={() => setActiveCategory('all')}
          className={`h-9 px-4 rounded-xl text-[15px] font-black shrink-0 transition-all cursor-pointer flex items-center justify-center active:scale-95 ${
            activeCategory === 'all'
              ? 'btn-3d-gold text-[#2c1b04] shadow-2xs'
              : 'bg-white hover:bg-amber-50/60 text-slate-800 border-2 border-[#dfc282]'
          }`}
        >
          تمام بخش‌های عمران و معدن
        </button>

        <button
          onClick={() => setActiveCategory('mines')}
          className={`h-9 px-4 rounded-xl text-[15px] font-black shrink-0 transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 ${
            activeCategory === 'mines'
              ? 'btn-3d-gold text-[#2c1b04] shadow-2xs'
              : 'bg-white hover:bg-amber-50/60 text-slate-800 border-2 border-[#dfc282]'
          }`}
        >
          <Pickaxe className="w-4 h-4 text-amber-800" />
          <span>معادن سنگ و مصالح</span>
        </button>

        <button
          onClick={() => setActiveCategory('machinery')}
          className={`h-9 px-4 rounded-xl text-[15px] font-black shrink-0 transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 ${
            activeCategory === 'machinery'
              ? 'btn-3d-gold text-[#2c1b04] shadow-2xs'
              : 'bg-white hover:bg-amber-50/60 text-slate-800 border-2 border-[#dfc282]'
          }`}
        >
          <Truck className="w-4 h-4 text-amber-800" />
          <span>ماشین‌آلات سنگین و تاورکرین</span>
        </button>

        <button
          onClick={() => setActiveCategory('civil_contractors')}
          className={`h-9 px-4 rounded-xl text-[15px] font-black shrink-0 transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 ${
            activeCategory === 'civil_contractors'
              ? 'btn-3d-gold text-[#2c1b04] shadow-2xs'
              : 'bg-white hover:bg-amber-50/60 text-slate-800 border-2 border-[#dfc282]'
          }`}
        >
          <HardHat className="w-4 h-4 text-amber-800" />
          <span>پیمانکاران خاک‌برداری و نیلینگ</span>
        </button>

        <button
          onClick={() => setActiveCategory('craftsmen')}
          className={`h-9 px-4 rounded-xl text-[15px] font-black shrink-0 transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 ${
            activeCategory === 'craftsmen'
              ? 'btn-3d-gold text-[#2c1b04] shadow-2xs'
              : 'bg-white hover:bg-amber-50/60 text-slate-800 border-2 border-[#dfc282]'
          }`}
        >
          <HardHat className="w-4 h-4 text-amber-800" />
          <span>استادکاران و اکیپ اجرایی</span>
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-[28px] p-5 border-2 border-[#dfc282] shadow-[0_4px_16px_rgba(180,130,40,0.1)] space-y-4 flex flex-col justify-between hover:shadow-xl transition-all"
          >
            <div className="space-y-3">
              {/* Image & Category Tag */}
              <div className="relative h-44 rounded-2xl overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <span className="absolute top-2.5 right-2.5 bg-slate-900/90 text-white text-xs font-black px-2.5 py-1 rounded-xl backdrop-blur-md">
                  {item.category === 'mines' && 'معدن‌دار رسمی'}
                  {item.category === 'machinery' && 'ماشین‌آلات عمرانی'}
                  {item.category === 'civil_contractors' && 'پیمانکار زیرساخت'}
                  {item.category === 'craftsmen' && 'استادکار مجرب'}
                </span>
                <span className="absolute bottom-2.5 left-2.5 btn-3d-gold text-[#2c1b04] font-black text-xs px-2.5 py-1 rounded-xl shadow-md flex items-center gap-1">
                  <span>★ {item.rating}</span>
                </span>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-black text-base text-slate-950">{item.title}</h3>
                  {item.verified && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                </div>
                <p className="text-[13px] text-slate-700 font-bold mt-1 leading-relaxed">
                  {item.subtitle}
                </p>
              </div>

              {/* Specs & Pricing */}
              <div className="p-3.5 bg-[#faf8f4] rounded-2xl border-2 border-[#e6dfd3] space-y-1.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 font-bold text-xs">موقعیت و لوکیشن:</span>
                  <span className="font-bold text-slate-950 flex items-center gap-1 text-[13px]">
                    <MapPin className="w-4 h-4 text-amber-800" />
                    {item.location}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 font-bold text-xs">مشخصات / ظرفیت:</span>
                  <span className="font-bold text-slate-950 text-[13px]">{item.capacityOrSpec}</span>
                </div>
                <div className="flex justify-between items-center border-t border-[#ede6d8] pt-1.5">
                  <span className="text-slate-600 font-bold text-xs">نرخ / شرایط همکاری:</span>
                  <span className="font-black text-emerald-900 text-[15px]">{item.pricing}</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {item.tags.map((tag, idx) => (
                  <span key={idx} className="text-xs bg-amber-50 text-amber-950 font-black px-2.5 py-1 rounded-lg border border-amber-200">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Direct Contact Button (Compact, 15px Font Size) */}
            <div className="pt-2">
              <a
                href={`tel:${item.phone}`}
                className="w-full h-10 btn-3d-gold text-[#2c1b04] text-[15px] font-black rounded-xl flex items-center justify-center gap-2 shadow-2xs active:scale-95 transition-transform"
              >
                <Phone className="w-4 h-4 stroke-[2.5]" />
                <span>تماس مستقیم با تأمین‌کننده ({maskPhoneNumber(item.phone)})</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
