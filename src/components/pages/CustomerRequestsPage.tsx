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
  category: 'stone' | 'tile' | 'rebar' | 'cement' | 'rental' | 'machinery';
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
];

export const CustomerRequestsPage: React.FC<CustomerRequestsPageProps> = ({ onEnterDealRoom }) => {
  const [requests, setRequests] = useState<CustomerRequestItem[]>(initialRequests);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [expandedReqId, setExpandedReqId] = useState<string>(initialRequests[0].id);

  // New Request Form States
  const [showNewModal, setShowNewModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'stone' | 'tile' | 'rebar' | 'cement' | 'rental' | 'machinery'>('stone');
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
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#ded5c5] space-y-3 relative overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-950 border border-amber-300 px-3.5 py-1 rounded-full text-xs font-black mb-2 shadow-xs">
              <Bot className="w-3.5 h-3.5 text-amber-700" />
              <span>موتور جستجو و تطبیق هوشمند درخواست‌ها</span>
            </div>
            <h1 className="text-lg sm:text-xl font-black text-slate-950">
              تابلوی روزانه درخواست‌های مشتریان و استعلام قیمت آنی
            </h1>
            <p className="text-xs text-slate-700 font-semibold mt-1 max-w-2xl leading-relaxed">
              ثبت تقاضای متریال، سنگ، کاشی، میلگرد یا رهن مسکن و تطبیق آنی با پایگاه ۵۰+ معدن‌دار، کارخانجات و املاکی‌های معتبر منطقه با امکان انتقال مستقیم به اتاق معامله امن.
            </p>
          </div>

          <button
            onClick={() => setShowNewModal(true)}
            className="bg-amber-600 hover:bg-amber-700 text-white font-black text-xs px-5 py-3 rounded-2xl shadow-md transition-all shrink-0 cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>+ ثبت درخواست جدید</span>
          </button>
        </div>
      </div>

      {/* Categories Filter Bar */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black shrink-0 transition-all cursor-pointer ${
            activeCategory === 'all'
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-sm'
              : 'bg-white hover:bg-slate-50 text-slate-800 border border-[#ded5c5]'
          }`}
        >
          همه درخواست‌های روز
        </button>

        <button
          onClick={() => setActiveCategory('stone')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
            activeCategory === 'stone'
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-sm'
              : 'bg-white hover:bg-slate-50 text-slate-800 border border-[#ded5c5]'
          }`}
        >
          <Mountain className="w-3.5 h-3.5 text-amber-600" />
          <span>سنگ و کوپ معدن</span>
        </button>

        <button
          onClick={() => setActiveCategory('tile')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
            activeCategory === 'tile'
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-sm'
              : 'bg-white hover:bg-slate-50 text-slate-800 border border-[#ded5c5]'
          }`}
        >
          <Package className="w-3.5 h-3.5 text-amber-600" />
          <span>کاشی و سرامیک</span>
        </button>

        <button
          onClick={() => setActiveCategory('rebar')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
            activeCategory === 'rebar'
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-sm'
              : 'bg-white hover:bg-slate-50 text-slate-800 border border-[#ded5c5]'
          }`}
        >
          <Factory className="w-3.5 h-3.5 text-amber-600" />
          <span>میلگرد و آهن‌آلات</span>
        </button>

        <button
          onClick={() => setActiveCategory('rental')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
            activeCategory === 'rental'
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-sm'
              : 'bg-white hover:bg-slate-50 text-slate-800 border border-[#ded5c5]'
          }`}
        >
          <Building2 className="w-3.5 h-3.5 text-amber-600" />
          <span>تقاضای رهن و اجاره</span>
        </button>
      </div>

      {/* Requests Feed Grid */}
      <div className="space-y-4">
        {filteredRequests.map((req) => {
          const isExpanded = expandedReqId === req.id;
          return (
            <div
              key={req.id}
              className={`bg-white rounded-3xl p-5 border transition-all ${
                isExpanded ? 'border-amber-400 shadow-md ring-2 ring-amber-300/30' : 'border-[#ded5c5] shadow-xs hover:border-[#caa758]'
              }`}
            >
              {/* Header summary of the request */}
              <div 
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer"
                onClick={() => setExpandedReqId(isExpanded ? '' : req.id)}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="text-[10px] bg-amber-100 text-amber-950 font-black px-2.5 py-0.5 rounded-lg border border-amber-300">
                      {req.volumeNeeded}
                    </span>
                    <span className="text-[10px] bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-lg">
                      {req.city}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {req.date}
                    </span>
                  </div>
                  <h3 className="font-black text-sm text-slate-950">{req.title}</h3>
                  <p className="text-[11px] text-slate-600 font-semibold mt-1">
                    درخواست‌کننده: {req.requesterName} • {req.requesterRole}
                  </p>
                </div>

                <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-auto">
                  <div className="text-left">
                    <span className="text-[10px] text-slate-500 block font-bold">پیش‌بینی بودجه:</span>
                    <span className="text-sm font-black text-emerald-900">{formatTomanShort(req.estimatedBudget)}</span>
                  </div>
                  <span className={`text-xs px-3 py-1.5 rounded-xl font-black ${
                    isExpanded ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-800'
                  }`}>
                    {req.matchedSuppliers.length} استعلام آماده
                  </span>
                </div>
              </div>

              {/* Expanded Match Results & Quotation Comparisons */}
              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-[#ede6d8] space-y-4">
                  {/* Detailed Specs */}
                  <div className="p-3 bg-[#fbf9f4] rounded-2xl border border-[#ded5c5] text-xs space-y-1">
                    <span className="font-black text-slate-900 block">مشخصات فنی و شرایط تحویل:</span>
                    <p className="text-slate-700 font-medium leading-relaxed">{req.specs}</p>
                  </div>

                  {/* Matched Suppliers List */}
                  <div className="space-y-2.5">
                    <span className="text-xs font-black text-slate-950 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      استعلام‌های آنی متصل‌شده از پایگاه داده تأمین‌کنندگان:
                    </span>

                    {req.matchedSuppliers.map((sup) => (
                      <div
                        key={sup.id}
                        className="p-3.5 rounded-2xl bg-white border-2 border-emerald-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span className="font-black text-xs text-slate-950">{sup.supplierName}</span>
                            {sup.verified && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                          </div>
                          <div className="flex items-center gap-2 text-[10.5px] text-slate-600 font-semibold">
                            <span>{sup.type === 'mine' ? 'سینه کار معدن' : sup.type === 'factory' ? 'درب کارخانه' : 'دفتر رسمی'}</span>
                            <span>• {sup.location}</span>
                            <span className="text-amber-700 font-bold">★ {sup.rating}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-3">
                          <div className="text-left">
                            <span className="text-xs font-black text-emerald-950 block">{formatTomanShort(sup.offeredPrice)}</span>
                            <span className="text-[10px] text-slate-500 font-bold">{sup.unitPrice}</span>
                          </div>

                          <button
                            onClick={() => onEnterDealRoom(req.code)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-4 py-2.5 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                          >
                            <Lock className="w-3.5 h-3.5" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-5 sm:p-6 w-full max-w-lg border border-[#ded5c5] shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between border-b border-[#ede6d8] pb-3">
              <h3 className="font-black text-sm text-slate-950 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>ثبت درخواست جدید و تطبیق هوشمند</span>
              </h3>
              <button
                onClick={() => setShowNewModal(false)}
                className="text-slate-400 hover:text-slate-800 text-sm font-black p-1"
              >
                ✕
              </button>
            </div>

            {formSuccess ? (
              <div className="p-6 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="font-black text-sm text-emerald-950">درخواست شما با موفقیت ثبت شد</h4>
                <p className="text-xs text-slate-600">موتور هوشمند در حال تطبیق با تأمین‌کنندگان و معادن می‌باشد.</p>
              </div>
            ) : (
              <form onSubmit={handleCreateRequest} className="space-y-3.5 text-xs">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">عنوان درخواست:</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: ۱۰۰۰ متر سنگ تراورتن عباس‌آباد یا رهن آپارتمان..."
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-[#fbf9f4] border border-[#ded5c5] rounded-xl px-3.5 py-2.5 font-bold text-slate-950 focus:outline-none focus:border-amber-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="font-bold text-slate-800 block mb-1">دسته‌بندی تقاضا:</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      className="w-full bg-[#fbf9f4] border border-[#ded5c5] rounded-xl px-3 py-2.5 font-bold text-slate-950 focus:outline-none focus:border-amber-600 cursor-pointer"
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
                    <label className="font-bold text-slate-800 block mb-1">متراژ / حجم مورد نیاز:</label>
                    <input
                      type="text"
                      placeholder="مثال: ۱۲۰۰ متر یا ۴۰ تن"
                      value={newVolume}
                      onChange={(e) => setNewVolume(e.target.value)}
                      className="w-full bg-[#fbf9f4] border border-[#ded5c5] rounded-xl px-3 py-2.5 font-bold text-slate-950 focus:outline-none focus:border-amber-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="font-bold text-slate-800 block mb-1">شهر مقصد تحویل:</label>
                    <input
                      type="text"
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      className="w-full bg-[#fbf9f4] border border-[#ded5c5] rounded-xl px-3 py-2.5 font-bold text-slate-950 focus:outline-none focus:border-amber-600"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-800 block mb-1">سقف بودجه تقریبی (تومان):</label>
                    <input
                      type="number"
                      placeholder="مثال: ۱۵۰۰۰۰۰۰۰۰"
                      value={newBudget}
                      onChange={(e) => setNewBudget(e.target.value)}
                      className="w-full bg-[#fbf9f4] border border-[#ded5c5] rounded-xl px-3 py-2.5 font-bold text-slate-950 focus:outline-none focus:border-amber-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">مشخصات ابعاد و ویژگی‌های فنی:</label>
                  <textarea
                    rows={2}
                    placeholder="ابعاد، درجه کیفیت، شرایط تخلیه و تحویل پای کارگاه..."
                    value={newSpecs}
                    onChange={(e) => setNewSpecs(e.target.value)}
                    className="w-full bg-[#fbf9f4] border border-[#ded5c5] rounded-xl px-3.5 py-2 font-bold text-slate-950 focus:outline-none focus:border-amber-600"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white font-black py-3 rounded-2xl shadow-md transition-colors cursor-pointer mt-2"
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
