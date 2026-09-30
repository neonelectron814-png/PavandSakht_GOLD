import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Sparkles, 
  Upload, 
  Image as ImageIcon, 
  Film,
  Video,
  Link as LinkIcon, 
  CreditCard, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  Eye, 
  ChevronLeft,
  Lock,
  Phone,
  Tag,
  AlertCircle,
  FileCheck,
  RefreshCw,
  Layers,
  Calendar
} from 'lucide-react';
import { formatToman, toPersianDigits } from '../../utils/formatters';
import { AnimatedTypewriterTopic } from '../common/AnimatedTypewriterTopic';
import { useAdQueue, EnqueueResult } from '../../hooks/useAdQueue';

export const HOURLY_RATE_TOMAN = 125000; // 125,000 Tomans per hour
export const MAX_FILE_SIZE_BYTES = 1024 * 1024 * 1024; // 1 Gigabyte (1 GB)

export const DEFAULT_AD: SponsoredAd = {
  id: 'ad-default',
  mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  mediaType: 'video',
  phoneNumber: '09121234567',
  topic: 'پروژه‌های عمرانی و ساختمانی',
  isGif: false,
  targetUrl: 'https://payvand-sakht.ir/sponsor',
  durationLabel: '۱ ساعت',
  durationHours: 1,
  pricePaid: 125000,
};

export const PRESET_SPONSOR_MEDIA = [
  {
    id: 'default-video',
    title: 'تیزر ویدیویی ساختمانی',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    mediaType: 'video' as const,
  }
];

export interface SponsoredAd {
  id: string;
  mediaUrl: string;
  mediaType: 'video' | 'gif' | 'image';
  phoneNumber: string;
  topic: string;
  targetUrl: string;
  durationHours: number;
  durationLabel: string;
  pricePaid: number;
  createdAt?: number;
  expiresAt?: number;
  status?: 'active' | 'queued';
  fileName?: string;
  fileSizeMb?: string;
  isGif?: boolean;
  brandName?: string;
  slogan?: string;
  subText?: string;
}

interface AdOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdActivated: (ad: SponsoredAd) => void;
}

const PRESET_TOPICS = [
  'مصالح و آهن‌آلات ساختمانی',
  'املاک، ویلا و مستغلات لوکس',
  'طراحی معماری، نما و دکوراسیون',
  'تجهیزات، ماشین‌آلات و پیمانکاری',
  'سازه، بتن آماده و اسکلت فلزی',
  'شیرآلات، تأسیسات و برق ساختمان',
  'سایر حوزه‌های تخصصی مسکن'
];

export const AdOrderModal: React.FC<AdOrderModalProps> = ({
  isOpen,
  onClose,
  onAdActivated,
}) => {
  const [step, setStep] = useState<'form' | 'gateway' | 'success'>('form');
  
  // Form State
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedFormat, setSelectedFormat] = useState<'video' | 'gif' | 'image'>('video');
  const [selectedTopic, setSelectedTopic] = useState(PRESET_TOPICS[0]);
  const [customTopic, setCustomTopic] = useState('');
  const [durationHours, setDurationHours] = useState<number>(1);
  const [targetUrl, setTargetUrl] = useState('');
  
  // Upload & Media State (Max 1GB)
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreviewUrl, setMediaPreviewUrl] = useState<string>(
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
  );
  const [uploadError, setUploadError] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Alternative direct URL
  const [directMediaUrl, setDirectMediaUrl] = useState('');

  // Payment Gateway simulation states
  const [cardNumber, setCardNumber] = useState('۶۰۳۷ - ۹۹۱۸ - **** - ****');
  const [cvv2, setCvv2] = useState('***');
  const [dynamicOtp, setDynamicOtp] = useState('');
  const [otpTimer, setOtpTimer] = useState(120);
  const [isPaying, setIsPaying] = useState(false);
  const [trackingCode, setTrackingCode] = useState('');
  const [registeredAd, setRegisteredAd] = useState<SponsoredAd | null>(null);

  // Queue state and methods
  const { activeAd, queueCount, formattedRemainingTime, enqueueAd } = useAdQueue();
  const [enqueueResult, setEnqueueResult] = useState<EnqueueResult | null>(null);

  // Price Calculation: Hours * 125,000 Tomans
  const totalPrice = Math.max(1, durationHours) * HOURLY_RATE_TOMAN;

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

  // File Upload Handler with 1 GB Limit validation
  const handleFileSelection = (file: File) => {
    setUploadError('');

    if (file.size > MAX_FILE_SIZE_BYTES) {
      const sizeGb = (file.size / (1024 * 1024 * 1024)).toFixed(2);
      setUploadError(`حجم فایل انتخابی (${sizeGb} گیگابایت) بیشتر از سقف مجاز ۱ گیگابایت است.`);
      return;
    }

    setMediaFile(file);
    const objectUrl = URL.createObjectURL(file);
    setMediaPreviewUrl(objectUrl);
    setDirectMediaUrl('');

    // Auto-detect format from file type
    if (file.type.startsWith('video/')) {
      setSelectedFormat('video');
    } else if (file.type.includes('gif') || file.name.toLowerCase().endsWith('.gif')) {
      setSelectedFormat('gif');
    } else {
      setSelectedFormat('image');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleProceedToGateway = (e: React.FormEvent) => {
    e.preventDefault();

    if (!phoneNumber || phoneNumber.length < 10) {
      setUploadError('لطفاً شماره موبایل معتبر (جهت پیگیری تبلیغ) را وارد نمایید.');
      return;
    }

    const effectiveUrl = directMediaUrl.trim() || mediaPreviewUrl;
    if (!effectiveUrl) {
      setUploadError('لطفاً فایل رسانه تبلیغ (عکس، گیف یا ویدیو) را آپلود یا آدرس آن را وارد نمایید.');
      return;
    }

    setUploadError('');
    setStep('gateway');
    setOtpTimer(120);
  };

  const handlePay = () => {
    setIsPaying(true);
    setTimeout(() => {
      setIsPaying(false);
      const randomTrack = Math.floor(100000000 + Math.random() * 900000000).toString();
      setTrackingCode(randomTrack);
      setStep('success');

      const effectiveMedia = directMediaUrl.trim() || mediaPreviewUrl;

      // Add to automated Queue or start immediately if open
      const result = enqueueAd({
        mediaUrl: effectiveMedia,
        mediaType: selectedFormat,
        phoneNumber,
        topic: customTopic.trim() || selectedTopic,
        targetUrl: targetUrl.trim() || '#',
        durationHours,
        durationLabel: `${durationHours} ساعت`,
        pricePaid: totalPrice,
        isGif: selectedFormat === 'gif',
        fileName: mediaFile ? mediaFile.name : undefined,
        fileSizeMb: mediaFile ? (mediaFile.size / (1024 * 1024)).toFixed(1) : undefined,
      });

      setEnqueueResult(result);
      setRegisteredAd(result.ad);
      onAdActivated(result.ad);
    }, 1500);
  };

  const activeMediaUrl = directMediaUrl.trim() || mediaPreviewUrl;
  const isVideo = selectedFormat === 'video' || activeMediaUrl.endsWith('.mp4') || activeMediaUrl.includes('video');

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 pointer-events-auto" dir="rtl">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/65 backdrop-blur-xs"
          onClick={onClose}
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.18 }}
          className="bg-white rounded-[32px] w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border-2 border-[#dfc282] z-10 text-slate-800"
        >
          {/* Header - ONLY ONE clean X button */}
          <div className="p-4 sm:p-5 border-b border-[#ede6d8] flex items-center justify-between bg-[#fffdfa] shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl btn-3d-gold flex items-center justify-center text-[#2c1b04] shadow-xs">
                <Sparkles className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-950">
                  {step === 'form' && 'ثبت تبلیغ ساعتی (عکس، گیف یا ویدیو)'}
                  {step === 'gateway' && 'درگاه امن پرداخت شاپرک'}
                  {step === 'success' && 'پرداخت موفق و فعال‌سازی تبلیغ در صف نمایش'}
                </h3>
                <p className="text-xs font-bold text-amber-900/80 mt-0.5">
                  {step === 'form' && 'تعرفه ساعتی ۱۲۵ هزار تومان • سقف حجم آپلود فایل تا ۱ گیگابایت'}
                  {step === 'gateway' && 'پرداخت مستقیم شتابی و اعمال آنی تبلیغ'}
                  {step === 'success' && 'تبلیغ شما ثبت و هم‌اکنون در بالای صفحه به نمایش درآمد'}
                </p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-600 border border-slate-200 hover:border-red-200 flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-90"
              aria-label="بستن"
              title="بستن"
            >
              <X className="w-4.5 h-4.5 stroke-[2.5]" />
            </button>
          </div>

          {/* Modal Body with smooth scrolling */}
          <div className="overflow-y-auto p-4 sm:p-6 space-y-5 flex-1" style={{ scrollbarWidth: 'thin' }}>
            
            {/* =========================================================================
                STEP 1: REGISTRATION FORM
                ========================================================================= */}
            {step === 'form' && (
              <form onSubmit={handleProceedToGateway} className="space-y-5">
                
                {/* Error Banner */}
                {uploadError && (
                  <div className="bg-red-50 border border-red-300 text-red-800 p-3 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                    <span>{uploadError}</span>
                  </div>
                )}

                {/* Real-time Ad Queue Status Banner */}
                <div className="bg-amber-50/90 border-2 border-amber-300 rounded-2xl p-4 text-xs text-amber-950 space-y-1.5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-amber-950 flex items-center gap-1.5 text-xs sm:text-[13px]">
                      <Clock className="w-4 h-4 text-amber-700" />
                      <span>سیستم هوشمند صف‌بندی خودکار تبلیغات ساعتی</span>
                    </span>
                    <span className="bg-amber-200 text-amber-950 px-2.5 py-0.5 rounded-full text-[11px] font-black border border-amber-400/50">
                      {queueCount === 0 ? 'صف خالی (آماده نمایش آنی)' : `${toPersianDigits(queueCount)} تبلیغ در نوبت صف`}
                    </span>
                  </div>

                  <p className="text-[11.5px] text-amber-900/90 leading-relaxed font-bold">
                    {queueCount === 0 ? (
                      <>
                        در حال حاضر تبلیغ با موضوع <span className="font-black text-amber-950">«{activeAd.topic}»</span> در حال نمایش است (زمان باقیمانده: <span className="font-mono text-amber-950">{formattedRemainingTime}</span>). تبلیغ جدید شما در <span className="font-black underline">نوبت اول صف</span> قرار می‌گیرد و پس از پایان تبلیغ جاری، به طور <span className="font-black text-emerald-800">۱۰۰٪ اتوماتیک</span> پخش خواهد شد.
                      </>
                    ) : (
                      <>
                        در حال حاضر <span className="font-black text-amber-950">{toPersianDigits(queueCount)} تبلیغ</span> در صف رزرو هستند. تبلیغ شما در <span className="font-black underline">نوبت شماره {toPersianDigits(queueCount + 1)}</span> ثبت می‌شود و بلافاصله پس از اتمام تبلیغات قبلی به طور خودکار به نمایش درمی‌آید.
                      </>
                    )}
                  </p>
                </div>

                {/* 1. Phone Number Field */}
                <div className="bg-[#fffdfa] p-3.5 sm:p-4 rounded-2xl border-2 border-[#dfc282]/70 space-y-1.5 shadow-2xs">
                  <label className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-amber-700" />
                    <span>شماره موبایل ثبت‌کننده تبلیغ (الزامی جهت پیگیری):</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="مثال: ۰۹۱۲۳۴۵۶۷۸۹"
                    className="w-full bg-white border border-[#ded5c5] rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-950 focus:outline-none focus:border-amber-600 text-left font-mono"
                    dir="ltr"
                  />
                </div>

                {/* 2. Media Type Selection: Photo, GIF, Video */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-950 block">
                    نوع فایل تبلیغاتی شما:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedFormat('video')}
                      className={`py-3 px-2 rounded-2xl border-2 flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        selectedFormat === 'video'
                          ? 'border-amber-600 bg-amber-50/90 text-amber-950 font-black shadow-xs ring-1 ring-amber-400'
                          : 'border-[#ded5c5] bg-white text-slate-700 hover:bg-slate-50 font-bold'
                      }`}
                    >
                      <Video className="w-5 h-5 text-amber-700" />
                      <span className="text-xs">🎥 ویدیو (MP4/MOV)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedFormat('gif')}
                      className={`py-3 px-2 rounded-2xl border-2 flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        selectedFormat === 'gif'
                          ? 'border-amber-600 bg-amber-50/90 text-amber-950 font-black shadow-xs ring-1 ring-amber-400'
                          : 'border-[#ded5c5] bg-white text-slate-700 hover:bg-slate-50 font-bold'
                      }`}
                    >
                      <Film className="w-5 h-5 text-amber-700" />
                      <span className="text-xs">🎞️ گیف متحرک (GIF)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedFormat('image')}
                      className={`py-3 px-2 rounded-2xl border-2 flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        selectedFormat === 'image'
                          ? 'border-amber-600 bg-amber-50/90 text-amber-950 font-black shadow-xs ring-1 ring-amber-400'
                          : 'border-[#ded5c5] bg-white text-slate-700 hover:bg-slate-50 font-bold'
                      }`}
                    >
                      <ImageIcon className="w-5 h-5 text-amber-700" />
                      <span className="text-xs">📷 عکس باکیفیت (HD)</span>
                    </button>
                  </div>
                </div>

                {/* 3. Real File Upload Box (Max 1GB) */}
                <div className="space-y-2 bg-[#fbf9f4] p-4 rounded-2xl border-2 border-[#dfc282]/80">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-950 flex items-center gap-1.5">
                      <Upload className="w-4 h-4 text-amber-700" />
                      آپلود فایل (عکس، گیف یا ویدیو):
                    </span>
                    <span className="text-[11px] bg-amber-200/90 text-amber-950 px-2.5 py-0.5 rounded-full font-black border border-amber-400/50">
                      حداکثر سقف مجاز: ۱ گیگابایت (1 GB)
                    </span>
                  </div>

                  {/* Drag and drop / Click upload container */}
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                      isDragging
                        ? 'border-amber-600 bg-amber-100/60 scale-[1.01]'
                        : 'border-[#dfc282] bg-white hover:bg-amber-50/50'
                    }`}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="video/mp4,video/webm,video/quicktime,image/jpeg,image/png,image/gif,image/webp"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleFileSelection(e.target.files[0]);
                        }
                      }}
                    />

                    <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-900 shadow-2xs">
                      {selectedFormat === 'video' ? (
                        <Video className="w-6 h-6" />
                      ) : selectedFormat === 'gif' ? (
                        <Film className="w-6 h-6" />
                      ) : (
                        <ImageIcon className="w-6 h-6" />
                      )}
                    </div>

                    {mediaFile ? (
                      <div className="space-y-1">
                        <div className="flex items-center justify-center gap-1.5 text-xs font-black text-emerald-800">
                          <FileCheck className="w-4 h-4 text-emerald-600" />
                          <span>فایل آماده ثبت: {mediaFile.name}</span>
                        </div>
                        <span className="text-[11px] text-slate-500 font-mono block">
                          حجم: {(mediaFile.size / (1024 * 1024)).toFixed(1)} مگابایت (از سقف ۱ گیگابایت)
                        </span>
                        <span className="text-[11px] text-amber-700 underline font-bold cursor-pointer">
                          کلیک برای تعویض فایل
                        </span>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <span className="text-xs font-black text-slate-900 block">
                          کلیک کنید یا فایل خود را به اینجا بکشید
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium block">
                          پشتیبانی از فرمت‌های MP4, MOV, GIF, PNG, JPG (تا ۱۰۰۰ مگابایت / ۱ گیگابایت)
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Or Direct URL Input */}
                  <div className="pt-1.5">
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      یا آدرس مستقیم اینترنتی فایل را وارد کنید (اختیاری):
                    </label>
                    <input
                      type="url"
                      value={directMediaUrl}
                      onChange={(e) => {
                        setDirectMediaUrl(e.target.value);
                        setMediaFile(null);
                      }}
                      placeholder="https://example.com/ad-teaser.mp4 یا ad.gif"
                      className="w-full bg-white border border-[#ded5c5] rounded-xl px-3 py-2 text-xs font-mono text-left focus:outline-none focus:border-amber-600"
                    />
                  </div>
                </div>

                {/* 4. Live Visual Simulator (ZERO TEXT) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-950 flex items-center gap-1.5">
                      <Eye className="w-4 h-4 text-amber-700" />
                      پیش‌نمایش زنده بنر رسانه‌ای در اپلیکیشن (کاملاً خالص و بدون متن):
                    </span>
                    <span className="text-[10.5px] bg-amber-100 text-amber-950 font-black px-2.5 py-0.5 rounded-full border border-amber-300">
                      {isVideo ? '🎥 ویدیو با پخش خودکار' : selectedFormat === 'gif' ? '🎞️ گیف متحرک' : '📷 تصویر ثابت'}
                    </span>
                  </div>

                  {/* Simulator Screen */}
                  <div className="relative rounded-[24px] overflow-hidden bg-black shadow-md h-48 sm:h-56 flex items-center justify-center border-2 border-amber-400/50">
                    {isVideo ? (
                      <video
                        src={activeMediaUrl}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={activeMediaUrl}
                        alt="پیش‌نمایش بنر"
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                    
                    {/* Animated Typewriter Topic on Simulator */}
                    <div className="absolute bottom-2.5 right-2.5 z-20 scale-85 sm:scale-90 origin-bottom-right">
                      <AnimatedTypewriterTopic topic={customTopic.trim() || selectedTopic} />
                    </div>

                    {/* Only the official single button shown in the simulator */}
                    <div className="absolute top-2.5 left-2.5">
                      <span className="btn-3d-gold text-[#2c1b04] text-[10.5px] font-black px-2.5 py-1 rounded-lg shadow-xs flex items-center gap-1">
                        <span>برای ثبت تبلیغ</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* 5. Ad Subject / Topic Selection */}
                <div className="space-y-2 bg-[#fffdfa] p-4 rounded-2xl border border-[#ede6d8]">
                  <label className="text-xs font-black text-slate-950 flex items-center gap-1.5">
                    <Tag className="w-4 h-4 text-amber-700" />
                    <span>موضوع تبلیغات شما:</span>
                  </label>

                  <select
                    value={selectedTopic}
                    onChange={(e) => setSelectedTopic(e.target.value)}
                    className="w-full bg-white border border-[#ded5c5] rounded-xl px-3 py-2 text-xs font-black text-slate-900 focus:outline-none focus:border-amber-600"
                  >
                    {PRESET_TOPICS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>

                  <input
                    type="text"
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                    placeholder="یا موضوع اختصاصی خودتان را بنویسید (اختیاری)"
                    className="w-full bg-white border border-[#ded5c5] rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-600"
                  />
                </div>

                {/* 6. Click Target Link (Optional) */}
                <div className="space-y-1.5 bg-[#fffdfa] p-4 rounded-2xl border border-[#ede6d8]">
                  <label className="text-[11px] font-black text-slate-800 block">
                    لینک یا شماره تماس جهت کلیک بازدیدکنندگان روی تبلیغ (اختیاری):
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={targetUrl}
                      onChange={(e) => setTargetUrl(e.target.value)}
                      placeholder="https://yourwebsite.ir یا شماره تماس ۰۹۱۲..."
                      className="w-full bg-white border border-[#ded5c5] rounded-xl px-3 py-2 text-xs font-mono text-left focus:outline-none focus:border-amber-600 pl-9"
                    />
                    <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  </div>
                </div>

                {/* 7. Hourly Duration & Price (۱۲۵,۰۰۰ تومان ساعتی) */}
                <div className="space-y-3 bg-[#fbf9f4] p-4 rounded-2xl border-2 border-[#dfc282]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-950 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-amber-700" />
                      انتخاب مدت زمان نمایش (تعرفه ساعتی):
                    </span>
                    <span className="text-[11px] font-black text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                      ساعتی ۱۲۵,۰۰۰ تومان
                    </span>
                  </div>

                  {/* Quick Hour Badges */}
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {[1, 2, 6, 12, 24, 48].map((h) => {
                      const isSelected = durationHours === h;
                      return (
                        <button
                          key={h}
                          type="button"
                          onClick={() => setDurationHours(h)}
                          className={`py-2 px-1 rounded-xl text-xs font-black cursor-pointer transition-all border ${
                            isSelected
                              ? 'btn-3d-gold text-[#2c1b04] shadow-xs'
                              : 'bg-white border-[#ded5c5] text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          {h === 24 ? '۲۴ س (۱ روز)' : h === 48 ? '۴۸ س (۲ روز)' : `${h} ساعت`}
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom Hours Input */}
                  <div className="pt-2 flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-700 shrink-0">یا تعداد ساعت دلخواه:</span>
                    <input
                      type="number"
                      min={1}
                      max={720}
                      value={durationHours}
                      onChange={(e) => setDurationHours(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-28 bg-white border border-[#ded5c5] rounded-xl px-3 py-1.5 text-xs font-black text-center text-slate-950 focus:outline-none focus:border-amber-600"
                    />
                    <span className="text-xs font-black text-slate-600">ساعت</span>
                  </div>

                  {/* Calculated Price Summary */}
                  <div className="pt-3 border-t border-[#ede6d8] flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-600 font-bold block">
                        محاسبه هزینه ({durationHours} ساعت × ۱۲۵,۰۰۰ تومان):
                      </span>
                    </div>
                    <div className="text-left">
                      <span className="text-base sm:text-lg font-black text-amber-950">
                        {formatToman(totalPrice)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Submit to Payment Gateway */}
                <div className="pt-2 flex items-center justify-between border-t border-[#ede6d8]">
                  <div>
                    <span className="text-xs text-slate-500 font-bold block">مبلغ نهایی قابل پرداخت:</span>
                    <span className="text-base sm:text-lg font-black text-slate-950">
                      {formatToman(totalPrice)}
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="h-11 px-6 rounded-xl btn-3d-gold text-[#2c1b04] text-xs sm:text-sm font-black flex items-center gap-2 cursor-pointer shadow-md active:scale-95 transition-transform"
                  >
                    <CreditCard className="w-4 h-4 stroke-[2.5]" />
                    <span>ثبت و پرداخت هزینه ({durationHours} ساعت)</span>
                  </button>
                </div>

              </form>
            )}

            {/* =========================================================================
                STEP 2: SIMULATED PAYMENT GATEWAY
                ========================================================================= */}
            {step === 'gateway' && (
              <div className="space-y-4 max-w-lg mx-auto py-2">
                <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-700 block">پذیرنده: سوپراپلیکیشن پیوندساخت</span>
                    <span className="font-bold text-slate-600 mt-0.5 block">
                      مدت رزرو: {durationHours} ساعت • موضوع: {customTopic || selectedTopic}
                    </span>
                    <span className="font-black text-amber-950 mt-1 block text-sm">
                      مبلغ تراکنش: {formatToman(totalPrice)}
                    </span>
                  </div>
                  <div className="w-12 h-12 bg-white rounded-xl border border-amber-300 flex items-center justify-center p-1">
                    <ShieldCheck className="w-7 h-7 text-emerald-600" />
                  </div>
                </div>

                <div className="bg-white p-4.5 rounded-2xl border border-slate-200 space-y-3 shadow-xs">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">شماره کارت بانکی عضو شتاب:</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm font-mono text-center tracking-widest font-black"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">کد CVV2:</label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cvv2}
                        onChange={(e) => setCvv2(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm font-mono text-center font-black"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">رمز پویا (یکبار مصرف):</label>
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="۱۲۳۴۵۶"
                        value={dynamicOtp}
                        onChange={(e) => setDynamicOtp(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm font-mono text-center font-black"
                      />
                    </div>
                  </div>

                  <div className="text-center text-[11px] text-slate-500 font-bold pt-1">
                    زمان باقیمانده تا انقضای رمز: {otpTimer} ثانیه
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep('form')}
                    className="flex-1 py-3 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 cursor-pointer"
                  >
                    انصراف و بازگشت
                  </button>
                  <button
                    type="button"
                    onClick={handlePay}
                    disabled={isPaying}
                    className="flex-1 py-3 rounded-xl btn-3d-gold text-[#2c1b04] text-xs font-black shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isPaying ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>در حال تایید پرداخت...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>پرداخت نهایی و اعمال تبلیغ</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* =========================================================================
                STEP 3: SUCCESS & QUEUE ACTIVATION
                ========================================================================= */}
            {step === 'success' && registeredAd && (
              <div className="py-6 text-center space-y-4 max-w-md mx-auto">
                <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-400 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
                </div>

                <h3 className="text-lg font-black text-slate-950">
                  {enqueueResult?.isQueued
                    ? `تبلیغ شما در صف نوبت نمایش (نوبت شماره ${toPersianDigits(enqueueResult.queuePosition)}) ثبت شد!`
                    : 'تبلیغ شما با موفقیت پرداخت و فعال گردید!'}
                </h3>
                
                <p className="text-xs text-slate-600 font-bold leading-relaxed">
                  {enqueueResult?.isQueued ? (
                    <>
                      با توجه به در حال پخش بودن تبلیغ دیگر، رسانه شما در صف هوشمند قرار گرفت و پس از اتمام تبلیغ جاری، به مدت{' '}
                      <span className="text-amber-900 font-black">{registeredAd.durationHours} ساعت</span>{' '}
                      به طور <span className="text-emerald-800 font-black">کاملاً اتوماتیک</span> روی بنر اصلی به نمایش درخواهد آمد.
                    </>
                  ) : (
                    <>
                      فایل رسانه‌ای شما به مدت <span className="text-amber-900 font-black">{registeredAd.durationHours} ساعت</span> در جایگاه صدر اپلیکیشن پیوندساخت فعال گردید و هم‌اکنون برای تمامی کاربران نمایش داده می‌شود.
                    </>
                  )}
                </p>

                {/* Ad Details Summary Card */}
                <div className="bg-[#fbf9f4] p-4 rounded-2xl border border-[#ede6d8] text-right space-y-2 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-[#ede6d8]">
                    <span className="text-slate-500 font-bold">شماره پیگیری پرداخت:</span>
                    <span className="font-mono font-black text-slate-950">{trackingCode}</span>
                  </div>
                  {enqueueResult?.isQueued && (
                    <div className="flex items-center justify-between bg-amber-100/70 p-2 rounded-xl text-amber-950 font-black">
                      <span>موقعیت در صف نوبت:</span>
                      <span>نوبت شماره {toPersianDigits(enqueueResult.queuePosition)}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-bold">شماره تماس تبلیغ‌دهنده:</span>
                    <span className="font-mono font-black text-slate-950">{registeredAd.phoneNumber}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-bold">موضوع تبلیغ:</span>
                    <span className="font-black text-slate-900">{registeredAd.topic}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-bold">مدت اعتبار نمایش:</span>
                    <span className="font-black text-amber-900">{registeredAd.durationHours} ساعت</span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-[#ede6d8]">
                    <span className="text-slate-500 font-bold">مبلغ پرداختی:</span>
                    <span className="font-black text-emerald-800">{formatToman(registeredAd.pricePaid)}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-3 rounded-xl btn-3d-gold text-[#2c1b04] text-xs font-black shadow-md cursor-pointer"
                >
                  مشاهده بنر و وضعیت صف در صفحه اصلی
                </button>
              </div>
            )}

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
