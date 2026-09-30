import React, { useState } from 'react';
import { 
  FileSearch, 
  Send, 
  CheckCircle2, 
  Clock, 
  Building2, 
  Package, 
  MapPin, 
  Sparkles, 
  Lock, 
  Search, 
  ArrowLeft, 
  Filter, 
  TrendingDown, 
  Factory, 
  Mountain, 
  Bot,
  UserCheck
} from 'lucide-react';
import { formatToman, formatTomanShort, toPersianDigits } from '../../utils/formatters';

interface CustomerRequestsPageProps {
  onEnterDealRoom: (code: string) => void;
}

interface CustomerRequestItem {
  id: string;
  category: 'stone' | 'tile' | 'rebar' | 'cement' | 'rental' | 'machinery' | 'scrap';
  title: string;
  requesterName: string;
  requesterRole: string;
  city: string;
  volumeNeeded: string;
  estimatedBudget: number;
  specs: string;
  status: 'matching' | 'quotes_ready' | 'negotiation';
  date: string;
  code: string;
  matchedSuppliers: {
    id: string;
    supplierName: string;
    type: 'mine' | 'factory' | 'agency' | 'distributor';
    offeredPrice: number;
    unitPrice: string;
    location: string;
    rating: number;
    verified: boolean;
  }[];
}

const initialRequests: CustomerRequestItem[] = [
  {
    id: 'req-1',
    category: 'stone',
    title: 'نیاز فوری به ۱,۰۰۰ متر سنگ تراورتن عباس‌آباد سوپر',
    requesterName: 'مهندس حسینی (پروژه برج سپیدار)',
    requesterRole: 'سازنده انبوه‌ساز',
    city: 'تهران - منطقه ۱',
    volumeNeeded: '۱,۰۰۰ متر مربع',
    estimatedBudget: 1800000000,
    specs: 'قد و پای بلند، کرم روشن یکدست، رزین اپوکسی، تحویل پای کارگاه فرمانیه',
    status: 'quotes_ready',
    date: 'امروز - ۱۰:۴۵',
    code: 'PYS-REQ-401',
    matchedSuppliers: [
      {
        id: 'sup-1',
        supplierName: 'معدن سنگ عباس‌آباد محلات (سینه کار مستقیم)',
        type: 'mine',
        offeredPrice: 1650000000,
        unitPrice: '۱,۶۵۰,۰۰۰ تومان / متر',
        location: 'محلات، استان مرکزی',
        rating: 4.9,
        verified: true,
      },
      {
        id: 'sup-2',
        supplierName: 'صنایع سنگ پارس اسلب رضوان‌شهر',
        type: 'factory',
        offeredPrice: 1720000000,
        unitPrice: '۱,۷۲۰,۰۰۰ تومان / متر',
        location: 'شهرک صنعتی شمس‌آباد',
        rating: 4.8,
        verified: true,
      },
      {
        id: 'sup-3',
        supplierName: 'بازرگانی سنگ ستاره پایتخت',
        type: 'distributor',
        offeredPrice: 1790000000,
        unitPrice: '۱,۷۹۰,۰۰۰ تومان / متر',
        location: 'بازار سنگ فدک تهران',
        rating: 4.7,
        verified: true,
      },
    ],
  },
  {
    id: 'req-2',
    category: 'tile',
    title: 'درخواست ۲,۰۰۰ متر کاشی و سرامیک پرسلان ۶۰×۶۰ و ۸۰×۸۰',
    requesterName: 'دکتر صابری (مجتمع تجاری نگین)',
    requesterRole: 'پیمانکار عمومی',
    city: 'اصفهان',
    volumeNeeded: '۲,۰۰۰ متر مربع',
    estimatedBudget: 950000000,
    specs: 'کالیبره مات ضد لغزش، خاک سفید پرسلان نانو، جذب آب زیر ۰.۵ درصد',
    status: 'quotes_ready',
    date: 'امروز - ۰۹:۱۵',
    code: 'PYS-REQ-402',
    matchedSuppliers: [
      {
        id: 'sup-4',
        supplierName: 'کارخانه کاشی و سرامیک پرسپولیس یزد',
        type: 'factory',
        offeredPrice: 880000000,
        unitPrice: '۴۴۰,۰۰۰ تومان / متر',
        location: 'یزد - درب کارخانه',
        rating: 4.9,
        verified: true,
      },
      {
        id: 'sup-5',
        supplierName: 'تأمین مصالح ساختمانی اسپادانا',
        type: 'distributor',
        offeredPrice: 910000000,
        unitPrice: '۴۵۵,۰۰۰ تومان / متر',
        location: 'اصفهان - شهرک صنعتی جی',
        rating: 4.8,
        verified: true,
      },
    ],
  },
  {
    id: 'req-3',
    category: 'rental',
    title: 'رهن و اجاره آپارتمان ۱۶۰ متری در منطقه ۲ (۱۰ میلیارد پیش + ۲۰ م اجاره)',
    requesterName: 'آقای شریفی',
    requesterRole: 'متقاضی مسکن',
    city: 'تهران - سعادت‌آباد / شهرک غرب',
    volumeNeeded: '۱۶۰ متر، ۳ خواب',
    estimatedBudget: 10000000000,
    specs: '۳ خواب مستر، ۲ پارکینگ سندی، نورگیر مستقیم جنوب، نزدیک به مترو میدان کتاب',
    status: 'quotes_ready',
    date: 'دیروز - ۱۸:۳۰',
    code: 'PYS-REQ-403',
    matchedSuppliers: [
      {
        id: 'sup-6',
        supplierName: 'دفتر املاک امین صراف‌ها (کد ۱۸۴)',
        type: 'agency',
        offeredPrice: 10000000000,
        unitPrice: '۱۰ میلیارد پیش + ۱۹.۵ م اجاره',
        location: 'سعادت‌آباد، علامه شمالی',
        rating: 5.0,
        verified: true,
      },
      {
        id: 'sup-7',
        supplierName: 'کارگزاری رسمی مسکن شهرک غرب (کد ۲۰۹)',
        type: 'agency',
        offeredPrice: 10200000000,
        unitPrice: '۹.۵ میلیارد پیش + ۲۲ م اجاره',
        location: 'شهرک غرب، فاز ۱',
        rating: 4.9,
        verified: true,
      },
    ],
  },
  {
    id: 'req-4',
    category: 'rebar',
    title: 'تأمین ۵۰ تن میلگرد سایز ۱۴ و ۱۶ اصفهان A3',
    requesterName: 'مهندس کاظمی (اسکلت بتنی پردیس)',
    requesterRole: 'مجری سازه',
    city: 'کرج',
    volumeNeeded: '۵۰ تن',
    estimatedBudget: 1600000000,
    specs: 'استاندارد ذوب‌آهن اصفهان، برگه آنالیز متالورژی آزمایشگاهی رسمی',
    status: 'quotes_ready',
    date: 'دیروز - ۱۴:۱۰',
    code: 'PYS-REQ-404',
    matchedSuppliers: [
      {
        id: 'sup-8',
        supplierName: 'انبار مرکزی آهن و فولاد غرب کشور',
        type: 'distributor',
        offeredPrice: 1540000000,
        unitPrice: '۳۰,۸۰۰ تومان / کیلوگرم',
        location: 'تهران، بازار آهن شادآباد',
        rating: 4.9,
        verified: true,
      },
    ],
  },
  {
    id: 'req-scrap-1',
    category: 'scrap',
    title: 'فروش ۳۰ تن ضایعات آهن، میلگرد و تیرآهن تخریب اسکلت فلزی',
    requesterName: 'شرکت مهندسی پایاسازه البرز',
    requesterRole: 'پیمانکار تخریب و نوسازی',
    city: 'تهران - شهرک غرب',
    volumeNeeded: '۳۰ تن آهن‌آلات ذوبی',
    estimatedBudget: 975000000,
    specs: 'تیرآهن ۱۸ تا ۲۴، میلگرد کلاف و شاخه با باسکول دیجیتال رسمی و تسویه نقدی',
    status: 'quotes_ready',
    date: 'امروز - ۱۱:۳۰',
    code: 'PYS-REQ-407',
    matchedSuppliers: [
      {
        id: 'sup-scrap-1',
        supplierName: 'کارخانه فولاد و بازیافت قراضه آریا',
        type: 'factory',
        offeredPrice: 990000000,
        unitPrice: '۳۳,۰۰۰ تومان / کیلوگرم',
        location: 'شهرک صنعتی شورآباد',
        rating: 4.9,
        verified: true,
      },
      {
        id: 'sup-scrap-2',
        supplierName: 'مرکز بازیافت و ضایعات فلزات پارس',
        type: 'distributor',
        offeredPrice: 975000000,
        unitPrice: '۳۲,۵۰۰ تومان / کیلوگرم',
        location: 'بازار آهن شادآباد',
        rating: 4.8,
        verified: true,
      },
    ],
  },
];

export const CustomerRequestsPage: React.FC<CustomerRequestsPageProps> = ({ onEnterDealRoom }) => {
  const [requests, setRequests] = useState<CustomerRequestItem[]>(initialRequests);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [expandedReqId, setExpandedReqId] = useState<string>(initialRequests[0].id);

  // New Request Form States
  const [showNewModal, setShowNewModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'stone' | 'tile' | 'rebar' | 'cement' | 'rental' | 'machinery' | 'scrap'>('stone');
  const [newVolume, setNewVolume] = useState('');
  const [newSpecs, setNewSpecs] = useState('');
  const [newBudget, setNewBudget] = useState('');
  const [newCity, setNewCity] = useState('تهران');
  const [formSuccess, setFormSuccess] = useState(false);

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newReq: CustomerRequestItem = {
      id: `req-${Date.now()}`,
      category: newCategory,
      title: newTitle,
      requesterName: 'کاربر پیوندساخت (شما)',
      requesterRole: 'متقاضی هوشمند',
      city: newCity,
      volumeNeeded: newVolume || 'طبق سفارش',
      estimatedBudget: Number(newBudget) || 1000000000,
      specs: newSpecs || 'مشخصات استاندارد مورد نیاز',
      status: 'quotes_ready',
      date: 'هم‌اکنون',
      code: `PYS-REQ-${Math.floor(100 + Math.random() * 900)}`,
      matchedSuppliers: [
        {
          id: `match-1`,
          supplierName: 'پایانه تأمین مستقیم کارخانجات و معادن پیوندساخت',
          type: 'factory',
          offeredPrice: Math.round((Number(newBudget) || 1000000000) * 0.95),
          unitPrice: 'بهترین نرخ مستقیم کشف‌شده',
          location: newCity,
          rating: 4.9,
          verified: true,
        },
      ],
    };

    setRequests([newReq, ...requests]);
    setExpandedReqId(newReq.id);
    setFormSuccess(true);
    setTimeout(() => {
      setFormSuccess(false);
      setShowNewModal(false);
      setNewTitle('');
      setNewVolume('');
      setNewSpecs('');
      setNewBudget('');
    }, 1500);
  };

  const filteredRequests = requests.filter((r) => {
    if (activeCategory === 'all') return true;
    return r.category === activeCategory;
  });

  return (
    <div className="space-y-6 pb-20 text-[#111827]" dir="rtl">
      
      {/* Header Banner */}
      <div className="bg-white p-5 sm:p-6 rounded-[28px] border-2 border-[#dfc282] space-y-3 relative overflow-hidden shadow-[0_4px_16px_rgba(180,130,40,0.1)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 btn-3d-gold text-[#2c1b04] px-3.5 py-1 rounded-xl text-xs font-black mb-2 shadow-2xs">
              <Bot className="w-3.5 h-3.5 text-amber-900 stroke-[2.5]" />
              <span>موتور جستجو و تطبیق هوشمند درخواست‌ها</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-950">
              تابلوی روزانه درخواست‌های مشتریان و استعلام قیمت آنی
            </h1>
            <p className="text-[15px] text-slate-700 font-bold mt-1 max-w-2xl leading-relaxed">
              ثبت تقاضای متریال، سنگ، کاشی، میلگرد یا رهن مسکن و تطبیق آنی با پایگاه ۵۰+ معدن‌دار، کارخانجات و املاکی‌های معتبر منطقه با امکان انتقال مستقیم به اتاق معامله امن.
            </p>
          </div>

          <button
            onClick={() => setShowNewModal(true)}
            className="h-10 px-4.5 btn-3d-gold text-[#2c1b04] text-[15px] font-black rounded-xl shadow-2xs transition-all active:scale-95 shrink-0 cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-900" />
            <span>+ ثبت درخواست جدید</span>
          </button>
        </div>
      </div>

      {/* Categories Filter Bar */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        <button
          onClick={() => setActiveCategory('all')}
          className={`h-9 px-4 rounded-xl text-[15px] font-black shrink-0 transition-all cursor-pointer flex items-center justify-center active:scale-95 ${
            activeCategory === 'all'
              ? 'btn-3d-gold text-[#2c1b04] shadow-2xs'
              : 'bg-white hover:bg-amber-50/60 text-slate-800 border-2 border-[#dfc282] shadow-2xs'
          }`}
        >
          همه درخواست‌های روز
        </button>

        <button
          onClick={() => setActiveCategory('stone')}
          className={`h-9 px-4 rounded-xl text-[15px] font-black shrink-0 transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 ${
            activeCategory === 'stone'
              ? 'btn-3d-gold text-[#2c1b04] shadow-2xs'
              : 'bg-white hover:bg-amber-50/60 text-slate-800 border-2 border-[#dfc282] shadow-2xs'
          }`}
        >
          <Mountain className="w-4 h-4 text-amber-800" />
          <span>سنگ و کوپ معدن</span>
        </button>

        <button
          onClick={() => setActiveCategory('tile')}
          className={`h-9 px-4 rounded-xl text-[15px] font-black shrink-0 transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 ${
            activeCategory === 'tile'
              ? 'btn-3d-gold text-[#2c1b04] shadow-2xs'
              : 'bg-white hover:bg-amber-50/60 text-slate-800 border-2 border-[#dfc282] shadow-2xs'
          }`}
        >
          <Package className="w-4 h-4 text-amber-800" />
          <span>کاشی و سرامیک</span>
        </button>

        <button
          onClick={() => setActiveCategory('rebar')}
          className={`h-9 px-4 rounded-xl text-[15px] font-black shrink-0 transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 ${
            activeCategory === 'rebar'
              ? 'btn-3d-gold text-[#2c1b04] shadow-2xs'
              : 'bg-white hover:bg-amber-50/60 text-slate-800 border-2 border-[#dfc282] shadow-2xs'
          }`}
        >
          <Factory className="w-4 h-4 text-amber-800" />
          <span>میلگرد و آهن‌آلات</span>
        </button>

        <button
          onClick={() => setActiveCategory('rental')}
          className={`h-9 px-4 rounded-xl text-[15px] font-black shrink-0 transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 ${
            activeCategory === 'rental'
              ? 'btn-3d-gold text-[#2c1b04] shadow-2xs'
              : 'bg-white hover:bg-amber-50/60 text-slate-800 border-2 border-[#dfc282] shadow-2xs'
          }`}
        >
          <Building2 className="w-4 h-4 text-amber-800" />
          <span>تقاضای رهن و اجاره</span>
        </button>

        <button
          onClick={() => setActiveCategory('scrap')}
          className={`h-9 px-4 rounded-xl text-[15px] font-black shrink-0 transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 ${
            activeCategory === 'scrap'
              ? 'btn-3d-gold text-[#2c1b04] shadow-2xs'
              : 'bg-white hover:bg-amber-50/60 text-slate-800 border-2 border-[#dfc282] shadow-2xs'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-800" />
          <span>ضایعات و بازیافت ساختمانی</span>
        </button>
      </div>

      {/* Requests Feed Grid */}
      <div className="space-y-4">
        {filteredRequests.map((req) => {
          const isExpanded = expandedReqId === req.id;
          return (
            <div
              key={req.id}
              className={`bg-white rounded-[28px] p-5 sm:p-6 border-2 transition-all shadow-[0_4px_16px_rgba(180,130,40,0.1)] ${
                isExpanded ? 'border-[#caa758] ring-2 ring-amber-400/30' : 'border-[#dfc282] hover:border-[#caa758]'
              }`}
            >
              {/* Header summary of the request */}
              <div 
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer"
                onClick={() => setExpandedReqId(isExpanded ? '' : req.id)}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="text-xs bg-amber-50 text-amber-950 font-black px-3 py-1 rounded-xl border border-amber-300">
                      {req.volumeNeeded}
                    </span>
                    <span className="text-xs bg-[#faf8f4] text-slate-800 font-bold px-2.5 py-1 rounded-xl border border-[#e6dfd3]">
                      {req.city}
                    </span>
                    <span className="text-xs text-slate-500 font-bold font-mono">
                      {req.date}
                    </span>
                  </div>
                  <h3 className="font-black text-base sm:text-lg text-slate-950">{req.title}</h3>
                  <p className="text-[13px] text-slate-700 font-bold mt-1">
                    درخواست‌کننده: {req.requesterName} • {req.requesterRole}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                  <div className="text-left">
                    <span className="text-xs text-slate-500 block font-bold">پیش‌بینی بودجه:</span>
                    <span className="text-[15px] font-black text-emerald-950 font-mono">{formatTomanShort(req.estimatedBudget)} تومان</span>
                  </div>
                  <span className={`h-8.5 px-3 rounded-xl text-xs font-black flex items-center justify-center shadow-2xs ${
                    isExpanded ? 'btn-3d-gold text-[#2c1b04]' : 'bg-[#faf8f4] text-slate-800 border-2 border-[#dfc282]'
                  }`}>
                    {req.matchedSuppliers.length} استعلام آماده
                  </span>
                </div>
              </div>

              {/* Expanded Match Results & Quotation Comparisons */}
              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-[#ede6d8] space-y-4">
                  {/* Detailed Specs */}
                  <div className="p-3.5 bg-[#faf8f4] rounded-2xl border-2 border-[#dfc282] text-xs space-y-1">
                    <span className="font-black text-slate-950 block text-[13px]">مشخصات فنی و شرایط تحویل:</span>
                    <p className="text-slate-800 font-bold text-xs sm:text-[13px] leading-relaxed">{req.specs}</p>
                  </div>

                  {/* Matched Suppliers List */}
                  <div className="space-y-2.5">
                    <span className="text-[15px] font-black text-slate-950 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-700" />
                      استعلام‌های آنی متصل‌شده از پایگاه داده تأمین‌کنندگان:
                    </span>

                    {req.matchedSuppliers.map((sup) => (
                      <div
                        key={sup.id}
                        className="p-4 rounded-2xl bg-white border-2 border-[#dfc282] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span className="font-black text-[15px] text-slate-950">{sup.supplierName}</span>
                            {sup.verified && <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-700 font-bold">
                            <span>{sup.type === 'mine' ? 'سینه کار معدن' : sup.type === 'factory' ? 'درب کارخانه' : 'دفتر رسمی'}</span>
                            <span>• {sup.location}</span>
                            <span className="text-amber-800 font-black">★ {sup.rating}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-3">
                          <div className="text-left">
                            <span className="text-[15px] font-black text-emerald-950 block font-mono">{formatTomanShort(sup.offeredPrice)} تومان</span>
                            <span className="text-xs text-slate-600 font-bold">{sup.unitPrice}</span>
                          </div>

                          <button
                            onClick={() => onEnterDealRoom(req.code)}
                            className="h-9 px-4 btn-3d-gold text-[#2c1b04] font-black text-xs sm:text-[13px] rounded-xl shadow-2xs transition-transform active:scale-95 flex items-center gap-1.5 cursor-pointer shrink-0"
                          >
                            <Lock className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>انتقال به اتاق معامله</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* New Request Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm" dir="rtl">
          <div className="bg-[#fbf9f4] rounded-[32px] p-5 sm:p-6 w-full max-w-lg border-2 border-[#dfc282] shadow-[0_20px_60px_rgba(160,118,48,0.25)] space-y-4 max-h-[90vh] overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between border-b border-[#ede6d8] pb-3">
              <h3 className="font-black text-base text-slate-950 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-700" />
                <span>ثبت درخواست جدید و تطبیق هوشمند</span>
              </h3>
              <button
                onClick={() => setShowNewModal(false)}
                className="w-8 h-8 rounded-xl btn-3d-gold text-[#2c1b04] flex items-center justify-center font-black text-sm cursor-pointer active:scale-95 shadow-2xs"
              >
                ✕
              </button>
            </div>

            {formSuccess ? (
              <div className="p-6 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="font-black text-base text-emerald-950">درخواست شما با موفقیت ثبت شد</h4>
                <p className="text-[13px] text-slate-700 font-bold">موتور هوشمند در حال تطبیق با تأمین‌کنندگان و معادن می‌باشد.</p>
              </div>
            ) : (
              <form onSubmit={handleCreateRequest} className="space-y-3.5 text-xs">
                <div>
                  <label className="font-black text-[15px] text-slate-950 block mb-1">عنوان درخواست:</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: ۱۰۰۰ متر سنگ تراورتن عباس‌آباد یا رهن آپارتمان..."
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-white border-2 border-[#dfc282] focus:border-[#caa758] rounded-xl px-3.5 py-2.5 font-bold text-slate-950 text-[15px] focus:outline-none shadow-2xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="font-black text-xs text-slate-950 block mb-1">دسته‌بندی تقاضا:</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      className="w-full bg-white border-2 border-[#dfc282] focus:border-[#caa758] rounded-xl px-3 py-2.5 font-bold text-slate-950 text-xs focus:outline-none cursor-pointer shadow-2xs"
                    >
                      <option value="stone">سنگ و کوپ معدنی</option>
                      <option value="tile">کاشی و سرامیک</option>
                      <option value="rebar">میلگرد و فولاد</option>
                      <option value="cement">سیمان و گچ</option>
                      <option value="rental">رهن و اجاره مسکن</option>
                      <option value="machinery">ماشین‌آلات عمرانی</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-black text-xs text-slate-950 block mb-1">متراژ / حجم مورد نیاز:</label>
                    <input
                      type="text"
                      placeholder="مثال: ۱۲۰۰ متر یا ۴۰ تن"
                      value={newVolume}
                      onChange={(e) => setNewVolume(e.target.value)}
                      className="w-full bg-white border-2 border-[#dfc282] focus:border-[#caa758] rounded-xl px-3 py-2.5 font-bold text-slate-950 text-xs focus:outline-none shadow-2xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="font-black text-xs text-slate-950 block mb-1">شهر مقصد تحویل:</label>
                    <input
                      type="text"
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      className="w-full bg-white border-2 border-[#dfc282] focus:border-[#caa758] rounded-xl px-3 py-2.5 font-bold text-slate-950 text-xs focus:outline-none shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="font-black text-xs text-slate-950 block mb-1">سقف بودجه تقریبی (تومان):</label>
                    <input
                      type="number"
                      placeholder="مثال: ۱۵۰۰۰۰۰۰۰۰"
                      value={newBudget}
                      onChange={(e) => setNewBudget(e.target.value)}
                      className="w-full bg-white border-2 border-[#dfc282] focus:border-[#caa758] rounded-xl px-3 py-2.5 font-bold text-slate-950 text-xs focus:outline-none shadow-2xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-black text-xs text-slate-950 block mb-1">مشخصات ابعاد و ویژگی‌های فنی:</label>
                  <textarea
                    rows={2}
                    placeholder="ابعاد، درجه کیفیت، شرایط تخلیه و تحویل پای کارگاه..."
                    value={newSpecs}
                    onChange={(e) => setNewSpecs(e.target.value)}
                    className="w-full bg-white border-2 border-[#dfc282] focus:border-[#caa758] rounded-xl px-3.5 py-2 font-bold text-slate-950 text-xs focus:outline-none shadow-2xs"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full h-10 btn-3d-gold text-[#2c1b04] font-black text-[15px] rounded-xl shadow-2xs transition-all active:scale-95 cursor-pointer mt-2"
                >
                  ثبت درخواست و شروع تطبیق خودکار
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
