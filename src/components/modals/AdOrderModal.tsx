import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Sparkles, 
  Upload, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  CreditCard, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  Eye, 
  ExternalLink,
  ChevronLeft,
  Building2,
  Lock,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { formatToman, toPersianDigits } from '../../utils/formatters';

export interface SponsoredAd {
  id: string;
  brandName: string;
  slogan: string;
  subText: string;
  mediaUrl: string;
  isGif: boolean;
  targetUrl: string;
  durationLabel: string;
  durationHours: number;
  pricePaid: number;
}

interface AdOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdActivated: (ad: SponsoredAd) => void;
}

export const PRESET_SPONSOR_MEDIA = [
  {
    id: 'gif-steel',
    title: 'فولاد و اسکلت فلزی جهان‌آرا',
    slogan: 'تولید و تأمین مستقیم تیرآهن و میلگرد پای‌کار',
    subText: 'دارای استاندارد ملی و گواهی کنترل کیفیت ذوب',
    url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=900',
    isGif: true,
    gifTag: 'GIF پویا و متحرک',
  },
  {
    id: 'gif-luxury-villa',
    title: 'هلدینگ ساختمانی عمارت مدرن',
    slogan: 'طراحی، نظارت و اجرای ویلاهای هوشمند فوق‌لوکس',
    subText: 'با ضمانت ۵ ساله و تیم مهندسی نظام مهندسی',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=900',
    isGif: true,
    gifTag: 'GIF لوکس معماری',
  },
  {
    id: 'gif-marble',
    title: 'صنایع سنگ معدن و اسلب آرتا',
    slogan: 'فروش بی‌واسطه اسلب بوک‌مچ و تایل دهبید و عباس‌آباد',
    subText: 'ارسال مستقیم از سینه کار به تمام نقاط کشور',
    url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=900',
    isGif: false,
    gifTag: 'بنر باکیفیت 4K',
  },
  {
    id: 'gif-concrete',
    title: 'بتن‌آماده و تراک‌میکسر پایتخت',
    slogan: 'توزیع بتن استاندارد عیار ۳۵۰ تا ۵۰۰ با پمپ دکل',
    subText: 'آزمایشگاه مقاومت فشاری سر صحنه پروژه',
    url: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?auto=format&fit=crop&q=80&w=900',
    isGif: true,
    gifTag: 'GIF متحرک بتن',
  },
];

export const AD_PLANS = [
  {
    id: '1_hour',
    title: '۱ ساعت ویژه (پربازدیدترین ساعات)',
    badge: 'تست فوری و پرمخاطب',
    durationHours: 1,
    durationLabel: '۱ ساعت',
    price: 1000000, // 1 million Tomans as requested
    desc: 'نمایش بی‌واسطه در صدر اپلیکیشن در اوج ترافیک روز',
  },
  {
    id: '24_hours',
    title: '۲۴ ساعت (یک شبانه‌روز کامل)',
    badge: 'محبوب‌ترین',
    durationHours: 24,
    durationLabel: '۲۴ ساعت',
    price: 10000000, // 10 million Tomans
    desc: 'پوشش تمام شیفت‌های کاری معماران و سازندگان',
  },
  {
    id: '7_days',
    title: '۷ روز طلایی (یک هفته مستمر)',
    badge: 'تخفیف ویژه دوره‌ای',
    durationHours: 168,
    durationLabel: '۷ روز',
    price: 50000000, // 50 million Tomans
    desc: 'ثبت برند در ذهن بیش از ۱۰۰ هزار فعال صنعت مسکن',
  },
  {
    id: '30_days',
    title: 'ماهانه (۳۰ روزه VIP اسپانسر رسمی)',
    badge: 'بصرفه‌ترین و بالاترین بازدهی',
    durationHours: 720,
    durationLabel: 'ماهانه (۳۰ روز)',
    price: 150000000, // 150 million Tomans as requested
    desc: 'نمایش اختصاصی ماهانه + اولویت در نتایج جستجو و پیامک اطلاع‌رسانی',
  },
];

export const AdOrderModal: React.FC<AdOrderModalProps> = ({
  isOpen,
  onClose,
  onAdActivated,
}) => {
  const [step, setStep] = useState<'form' | 'gateway' | 'success'>('form');
  
  // Form fields
  const [brandName, setBrandName] = useState('شرکت سازه‌گستر نوین');
  const [slogan, setSlogan] = useState('تأمین مستقیم متریال و اجرای پروژه‌های ساختمانی');
  const [subText, setSubText] = useState('مشاوره رایگان، ارسال پای کارگاه با ضمانت اصالت');
  const [selectedMedia, setSelectedMedia] = useState(PRESET_SPONSOR_MEDIA[0]);
  const [customMediaUrl, setCustomMediaUrl] = useState('');
  const [isGif, setIsGif] = useState(true);
  const [targetUrl, setTargetUrl] = useState('https://payvand-sakht.ir/sponsor/09121234567');
  const [selectedPlanId, setSelectedPlanId] = useState('1_hour');
  
  // Payment Gateway simulation states
  const [selectedBank, setSelectedBank] = useState<'mellat' | 'melli' | 'saman'>('mellat');
  const [cardNumber, setCardNumber] = useState('۶۰۳۷ - ۹۹۱۸ - **** - ****');
  const [cvv2, setCvv2] = useState('***');
  const [dynamicOtp, setDynamicOtp] = useState('');
  const [otpTimer, setOtpTimer] = useState(120);
  const [isPaying, setIsPaying] = useState(false);
  const [trackingCode, setTrackingCode] = useState('');

  const currentPlan = AD_PLANS.find((p) => p.id === selectedPlanId) || AD_PLANS[0];

  useEffect(() => {
    let interval: any;
    if (step === 'gateway' && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, otpTimer]);

  if (!isOpen) return null;

  const activeMediaUrl = customMediaUrl.trim() || selectedMedia.url;

  const handleProceedToGateway = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandName.trim() || !slogan.trim()) return;
    setStep('gateway');
    setOtpTimer(120);
    setDynamicOtp('۷۸۴۲۹۱');
  };

  const handleExecutePayment = () => {
    setIsPaying(true);
    setTimeout(() => {
      setIsPaying(false);
      const randomTrack = 'TRK-' + Math.floor(10000000 + Math.random() * 90000000);
      setTrackingCode(randomTrack);
      setStep('success');

      // Activate ad in parent app
      onAdActivated({
        id: 'ad-' + Date.now(),
        brandName,
        slogan,
        subText,
        mediaUrl: activeMediaUrl,
        isGif,
        targetUrl,
        durationLabel: currentPlan.durationLabel,
        durationHours: currentPlan.durationHours,
        pricePaid: currentPlan.price,
      });
    }, 1800);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="bg-white rounded-t-[32px] sm:rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-[#ded5c5]"
          dir="rtl"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#ede6d8] flex items-center justify-between bg-[#fffdfa]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-b from-[#fef0c7] to-[#d4a749] border border-[#caa758] flex items-center justify-center text-amber-950 shadow-sm">
                <Sparkles className="w-5 h-5 text-amber-900" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-950">
                  {step === 'form' && 'سفارش و درج بنر یا گیف (GIF) تبلیغاتی'}
                  {step === 'gateway' && 'درگاه امن پرداخت شاپرک (شبیه‌ساز پرداخت)'}
                  {step === 'success' && 'پرداخت موفق و فعال‌سازی آنی تبلیغ'}
                </h3>
                <p className="text-xs font-semibold text-slate-600 mt-0.5">
                  {step === 'form' && 'جایگاه ویژه صدر اپلیکیشن پیوندساخت با بیشترین نرخ کلیک'}
                  {step === 'gateway' && 'اتصال مستقیم به شبکه بانکی با تضمین رمزنگاری E2EE'}
                  {step === 'success' && 'تبلیغ و بنر شما هم‌اکنون در بالای صفحه اصلی فعال گردید'}
                </p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4.5 h-4.5 stroke-[2.5]" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="overflow-y-auto no-scrollbar p-4 sm:p-6 space-y-5 flex-1">
            
            {/* STEP 1: FORM & MEDIA SELECTION */}
            {step === 'form' && (
              <form onSubmit={handleProceedToGateway} className="space-y-5">
                
                {/* 1. Live Banner Preview */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-950 flex items-center gap-1.5">
                      <Eye className="w-4 h-4 text-amber-700" />
                      پیش‌نمایش زنده بنر شما در اپلیکیشن:
                    </span>
                    <span className="text-[10px] bg-amber-100 text-amber-950 font-black px-2.5 py-0.5 rounded-full border border-amber-300">
                      {isGif ? 'فرمت GIF متحرک' : 'فرمت بنر ثابت'}
                    </span>
                  </div>

                  {/* Banner Simulator Card */}
                  <div className="relative rounded-[24px] overflow-hidden bg-gradient-to-r from-[#171d24] via-[#1c222b] to-[#12161b] text-white shadow-md min-h-[140px] flex items-center border border-amber-400/40 p-3.5">
                    {/* Background media */}
                    <div className="absolute top-0 left-0 w-1/2 h-full overflow-hidden pointer-events-none">
                      <img
                        src={activeMediaUrl}
                        alt="پیش‌نمایش بنر"
                        className="w-full h-full object-cover object-center opacity-90"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#1c222b]/60 to-[#171d24]" />
                    </div>

                    <div className="relative z-10 max-w-[62%] space-y-1">
                      <span className="inline-block text-[9px] bg-amber-500/30 text-amber-300 border border-amber-400/40 px-2 py-0.5 rounded-md font-black">
                        اسپانسر ویژه: {brandName || 'نام برند شما'}
                      </span>
                      <h4 className="text-sm font-black text-white line-clamp-2 leading-tight">
                        {slogan || 'شعار یا عنوان آگهی شما'}
                      </h4>
                      <p className="text-[10px] text-slate-300 line-clamp-1">
                        {subText || 'توضیحات تکمیلی محصول یا خدمات'}
                      </p>
                      <div className="pt-1">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full btn-3d-gold text-[10px] font-black">
                          <span>مشاهده و تماس</span>
                          <ChevronLeft className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Choose Banner / GIF */}
                <div className="space-y-2.5 bg-[#fbf9f4] p-4 rounded-2xl border border-[#ede6d8]">
                  <span className="text-xs font-black text-slate-950 block">
                    انتخاب گیف (GIF) یا بنر آماده یا آپلود دلخواه:
                  </span>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {PRESET_SPONSOR_MEDIA.map((item) => {
                      const isSelected = selectedMedia.id === item.id && !customMediaUrl;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            setSelectedMedia(item);
                            setCustomMediaUrl('');
                            setIsGif(item.isGif);
                            setBrandName(item.title);
                            setSlogan(item.slogan);
                            setSubText(item.subText);
                          }}
                          className={`p-2 rounded-xl border text-right transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                            isSelected
                              ? 'border-amber-600 bg-amber-50 ring-2 ring-amber-400/40 shadow-xs'
                              : 'border-[#ded5c5] bg-white hover:bg-slate-50'
                          }`}
                        >
                          <div className="h-16 rounded-lg overflow-hidden bg-slate-100 mb-1.5 relative">
                            <img
                              src={item.url}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                            <span className="absolute bottom-1 right-1 text-[8.5px] bg-black/75 text-amber-300 px-1.5 py-0.5 rounded font-black backdrop-blur-xs">
                              {item.gifTag}
                            </span>
                          </div>
                          <span className="text-[10.5px] font-black text-slate-900 line-clamp-1">{item.title}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom URL or upload link */}
                  <div className="pt-1">
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      یا آدرس اینترنتی گیف/بنر اختصاصی خودتان را وارد نمایید (اختیاری):
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={customMediaUrl}
                        onChange={(e) => setCustomMediaUrl(e.target.value)}
                        placeholder="https://example.com/my-banner.gif"
                        className="flex-1 bg-white border border-[#ded5c5] rounded-xl px-3 py-2 text-xs font-mono text-left focus:outline-none focus:border-amber-600"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const testGifs = [
                            'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?auto=format&fit=crop&q=80&w=900',
                            'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=900',
                            'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=900',
                          ];
                          const picked = testGifs[Math.floor(Math.random() * testGifs.length)];
                          setCustomMediaUrl(picked);
                          setIsGif(true);
                        }}
                        className="px-3 py-2 bg-white border border-[#ded5c5] rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-100 cursor-pointer shrink-0"
                      >
                        تست گیف تصادفی
                      </button>
                    </div>
                  </div>
                </div>

                {/* 3. Customer Info */}
                <div className="space-y-3 bg-[#fffdfa] p-4 rounded-2xl border border-[#ede6d8]">
                  <span className="text-xs font-black text-slate-950 block">
                    اطلاعات کسب‌وکار و پیوند مقصد:
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-black text-slate-800 block mb-1">
                        نام برند یا کسب‌وکار:
                      </label>
                      <input
                        type="text"
                        required
                        value={brandName}
                        onChange={(e) => setBrandName(e.target.value)}
                        placeholder="مثال: شرکت بتن‌آماده البرز"
                        className="w-full bg-white border border-[#ded5c5] rounded-xl px-3 py-2 text-xs font-bold text-slate-950 focus:outline-none focus:border-amber-600"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-black text-slate-800 block mb-1">
                        شعار یا تیتر اصلی بنر:
                      </label>
                      <input
                        type="text"
                        required
                        value={slogan}
                        onChange={(e) => setSlogan(e.target.value)}
                        placeholder="مثال: تخفیف ۱۰ درصدی میلگرد و بتن عیار ۴۰۰"
                        className="w-full bg-white border border-[#ded5c5] rounded-xl px-3 py-2 text-xs font-bold text-slate-950 focus:outline-none focus:border-amber-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-black text-slate-800 block mb-1">
                      لینک سایت، صفحه اینستاگرام یا شماره تماس مقصد کلیک:
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={targetUrl}
                        onChange={(e) => setTargetUrl(e.target.value)}
                        placeholder="https://yourwebsite.ir یا شماره تماس 0912..."
                        className="w-full bg-white border border-[#ded5c5] rounded-xl px-3 py-2 text-xs font-mono text-left focus:outline-none focus:border-amber-600 pl-9"
                      />
                      <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    </div>
                  </div>
                </div>

                {/* 4. Choose Duration Plan & Price */}
                <div className="space-y-2.5">
                  <span className="text-xs font-black text-slate-950 block">
                    انتخاب دوره و تعرفه نمایش بنر:
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {AD_PLANS.map((plan) => {
                      const isSelected = selectedPlanId === plan.id;
                      return (
                        <div
                          key={plan.id}
                          onClick={() => setSelectedPlanId(plan.id)}
                          className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                            isSelected
                              ? 'bg-amber-50/90 border-amber-500 shadow-md ring-2 ring-amber-400/40'
                              : 'bg-white border-[#ded5c5] hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-black text-slate-950">{plan.title}</span>
                            <span className="text-[9px] bg-amber-200 text-amber-950 px-2 py-0.5 rounded-full font-black">
                              {plan.badge}
                            </span>
                          </div>

                          <p className="text-[10px] text-slate-600 font-medium mb-2 leading-relaxed">
                            {plan.desc}
                          </p>

                          <div className="pt-2 border-t border-[#ede6d8] flex items-center justify-between">
                            <span className="text-[10px] font-bold text-slate-500">مبلغ تعرفه:</span>
                            <span className="text-sm font-black text-amber-950">
                              {formatToman(plan.price)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Submit 3D Gold Action Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-2xl btn-3d-gold flex items-center justify-center gap-2 text-sm"
                  >
                    <CreditCard className="w-5 h-5 stroke-[2.5]" />
                    <span>تأیید اطلاعات و هدایت به درگاه پرداخت ({formatToman(currentPlan.price)})</span>
                  </button>
                </div>

              </form>
            )}

            {/* STEP 2: SHAPARAK PAYMENT GATEWAY SIMULATION */}
            {step === 'gateway' && (
              <div className="space-y-4" dir="rtl">
                
                {/* Gateway Header Banner */}
                <div className="bg-[#1f2937] text-white p-4 rounded-2xl flex items-center justify-between border border-slate-700 shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black">شبکه الکترونیکی پرداخت کارت (شاپرک)</h4>
                      <p className="text-[10px] text-slate-300 font-mono">درگاه امن بانکی معتبر و دارای گواهی SSL ۲۵۶ بیتی</p>
                    </div>
                  </div>
                  <div className="text-left">
                    <span className="text-[10px] text-slate-400 block">پذیرنده:</span>
                    <span className="text-xs font-bold text-amber-400">سوپر اپلیکیشن پیوندساخت</span>
                  </div>
                </div>

                {/* Bank Selectors */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedBank('mellat')}
                    className={`p-2.5 rounded-xl border text-center text-xs font-bold cursor-pointer transition-all ${
                      selectedBank === 'mellat' ? 'border-rose-600 bg-rose-50 text-rose-950 font-black' : 'border-slate-200 bg-white text-slate-700'
                    }`}
                  >
                    به‌پرداخت ملت
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedBank('melli')}
                    className={`p-2.5 rounded-xl border text-center text-xs font-bold cursor-pointer transition-all ${
                      selectedBank === 'melli' ? 'border-blue-600 bg-blue-50 text-blue-950 font-black' : 'border-slate-200 bg-white text-slate-700'
                    }`}
                  >
                    سداد بانک ملی
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedBank('saman')}
                    className={`p-2.5 rounded-xl border text-center text-xs font-bold cursor-pointer transition-all ${
                      selectedBank === 'saman' ? 'border-sky-600 bg-sky-50 text-sky-950 font-black' : 'border-slate-200 bg-white text-slate-700'
                    }`}
                  >
                    سامان کیش
                  </button>
                </div>

                {/* Amount Box */}
                <div className="bg-[#faf8f4] p-3.5 rounded-2xl border border-[#ded5c5] flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-600">مبلغ قابل پرداخت:</span>
                  <div className="text-left">
                    <span className="font-black text-amber-950 text-base">{formatToman(currentPlan.price)}</span>
                    <span className="text-[10px] text-slate-500 block font-mono">معادل {toPersianDigits((currentPlan.price * 10).toLocaleString())} ریال</span>
                  </div>
                </div>

                {/* Gateway Inputs */}
                <div className="space-y-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs text-xs">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      شماره کارت ۱۶ رقمی شتاب:
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-[#f8f9fa] border border-slate-300 rounded-xl px-3 py-2.5 font-mono text-center text-slate-900 font-bold focus:outline-none focus:border-amber-600"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        کد امنیتی CVV2:
                      </label>
                      <input
                        type="password"
                        value={cvv2}
                        onChange={(e) => setCvv2(e.target.value)}
                        className="w-full bg-[#f8f9fa] border border-slate-300 rounded-xl px-3 py-2.5 font-mono text-center text-slate-900 font-bold focus:outline-none focus:border-amber-600"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        تاریخ انقضا:
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          defaultValue="۰۸"
                          className="w-1/2 bg-[#f8f9fa] border border-slate-300 rounded-xl px-2 py-2.5 font-mono text-center text-slate-900 font-bold"
                          placeholder="ماه"
                        />
                        <input
                          type="text"
                          defaultValue="۰۶"
                          className="w-1/2 bg-[#f8f9fa] border border-slate-300 rounded-xl px-2 py-2.5 font-mono text-center text-slate-900 font-bold"
                          placeholder="سال"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold text-slate-700">
                        رمز دوم پویا:
                      </label>
                      <span className="text-[10px] text-amber-800 font-bold">
                        زمان اعتبار: {toPersianDigits(otpTimer)} ثانیه
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={dynamicOtp}
                        onChange={(e) => setDynamicOtp(e.target.value)}
                        placeholder="کد ۶ رقمی پیامک‌شده"
                        className="flex-1 bg-[#f8f9fa] border border-slate-300 rounded-xl px-3 py-2.5 font-mono text-center text-slate-900 font-bold tracking-widest focus:outline-none focus:border-amber-600"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setOtpTimer(120);
                          setDynamicOtp('۹۴۰۲۱۵');
                        }}
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 cursor-pointer"
                      >
                        دریافت مجدد
                      </button>
                    </div>
                  </div>
                </div>

                {/* Gateway Action Buttons */}
                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep('form')}
                    className="w-1/3 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-xs cursor-pointer border border-slate-300"
                  >
                    انصراف و بازگشت
                  </button>

                  <button
                    type="button"
                    onClick={handleExecutePayment}
                    disabled={isPaying}
                    className="flex-1 py-3.5 rounded-2xl btn-3d-gold flex items-center justify-center gap-2 text-xs font-black shadow-lg"
                  >
                    {isPaying ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-amber-950" />
                        <span>در حال تایید و ثبت تراکنش...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                        <span>تأیید و پرداخت نهایی ({formatToman(currentPlan.price)})</span>
                      </>
                    )}
                  </button>
                </div>

              </div>
            )}

            {/* STEP 3: SUCCESS CONFIRMATION */}
            {step === 'success' && (
              <div className="space-y-4 text-center py-2" dir="rtl">
                <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center border-2 border-emerald-400 shadow-md">
                  <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
                </div>

                <div className="space-y-1">
                  <h4 className="text-base font-black text-slate-950">
                    پرداخت با موفقیت انجام شد و بنر شما فعال گردید!
                  </h4>
                  <p className="text-xs font-semibold text-slate-600">
                    تبلیغ برند «{brandName}» برای مدت {currentPlan.durationLabel} در صدر اپلیکیشن پیوندساخت به نمایش درآمد.
                  </p>
                </div>

                {/* Receipt Card */}
                <div className="bg-[#faf8f4] p-4 rounded-2xl border border-[#ded5c5] text-xs space-y-2 text-right">
                  <div className="flex justify-between py-1 border-b border-[#ede6d8]">
                    <span className="text-slate-600 font-bold">شماره پیگیری تراکنش:</span>
                    <span className="font-mono font-black text-slate-950">{trackingCode}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#ede6d8]">
                    <span className="text-slate-600 font-bold">مبلغ پرداخت‌شده:</span>
                    <span className="font-black text-amber-950">{formatToman(currentPlan.price)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#ede6d8]">
                    <span className="text-slate-600 font-bold">دوره نمایش انتخابی:</span>
                    <span className="font-bold text-slate-950">{currentPlan.title}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-600 font-bold">وضعیت انتشار:</span>
                    <span className="font-black text-emerald-800 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping inline-block" />
                      فعال در صفحه اصلی (Live)
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-3.5 rounded-2xl btn-3d-gold text-xs font-black shadow-lg"
                >
                  مشاهده بنر فعال در صفحه اصلی
                </button>
              </div>
            )}

          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
