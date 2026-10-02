import React, { useState, useRef } from 'react';
import { BottomSheetModal } from '../common/BottomSheetModal';
import { Property } from '../../types';
import { 
  Building2, 
  ShieldCheck, 
  Send, 
  Package, 
  Car, 
  RefreshCw, 
  Handshake, 
  CheckCircle2,
  DollarSign,
  Upload,
  Image as ImageIcon,
  Loader2
} from 'lucide-react';
import { formatTomanShort, toPersianDigits } from '../../utils/formatters';
import { supabaseService } from '../../services/supabaseService';

interface SubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'property' | 'material_quote' | 'barter' | 'partnership';
  onSubmitProperty?: (newProp: Partial<Property>) => void;
}

export const SubmitModal: React.FC<SubmitModalProps> = ({
  isOpen,
  onClose,
  type,
  onSubmitProperty,
}) => {
  // Common state
  const [phoneNumber, setPhoneNumber] = useState('09121234567');
  const [city, setCity] = useState('تهران');
  const [district, setDistrict] = useState('');
  const [description, setDescription] = useState('');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. Strictly Cash Real Estate State
  const [propTitle, setPropTitle] = useState('');
  const [propCategory, setPropCategory] = useState<'apartment' | 'villa' | 'land' | 'commercial'>('apartment');
  const [propPriceCash, setPropPriceCash] = useState('25000000000');
  const [propArea, setPropArea] = useState('140');
  const [propRooms, setPropRooms] = useState('3');

  // 2. Strictly Barter State (تفکیک دقیق گزینه‌های تهاتر: با ملک، با متریال، با خودرو، ترکیبی)
  const [barterCategory, setBarterCategory] = useState<'property' | 'materials' | 'vehicle' | 'custom'>('property');
  const [sourceAssetTitle, setSourceAssetTitle] = useState('');
  const [sourceEstimatedValue, setSourceEstimatedValue] = useState('20000000000');
  const [targetRequirementTitle, setTargetRequirementTitle] = useState('');
  const [targetEstimatedValue, setTargetEstimatedValue] = useState('20000000000');
  const [diffSettlementType, setDiffSettlementType] = useState<'cash_diff' | 'equal_value' | 'negotiable'>('cash_diff');

  // 3. Strictly Partnership State
  const [partnershipRole, setPartnershipRole] = useState<'owner' | 'builder'>('owner');
  const [landArea, setLandArea] = useState('500');
  const [proposedRatio, setProposedRatio] = useState('60 - 40');
  const [gratuitousAmount, setGratuitousAmount] = useState('5000000000');

  // 4. Strictly Materials State
  const [materialType, setMaterialType] = useState('فولاد و میلگرد');
  const [materialQuantity, setMaterialQuantity] = useState('۱۰۰ تن');

  const [isSuccess, setIsSuccess] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingImage(true);
      const url = await supabaseService.uploadPropertyImage(file);
      setUploadedImages((prev) => [...prev, url]);
    } catch (err) {
      console.error('Image upload failed:', err);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (type === 'property' && onSubmitProperty) {
      onSubmitProperty({
        title: propTitle || 'ملک مسکونی نقدی اعتبارسنجی‌شده',
        city,
        district: district || 'سعادت‌آباد',
        price: Number(propPriceCash),
        pricePerMeter: Math.round(Number(propPriceCash) / (Number(propArea) || 1)),
        area: Number(propArea),
        rooms: Number(propRooms),
        dealType: 'sale',
        propertyType: propCategory,
        verifiedStatus: 'pending',
        images: uploadedImages.length > 0 ? uploadedImages : ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800'],
        features: ['سند تک‌برگ شش‌دانگ', 'آماده انتقال قطعی نقدی', 'استعلام ثبتی پاک'],
        description: description || 'فروش فوری نقدی با تسویه رسمی در دفترخانه.',
        ownerName: 'کاربر جاری پیوندساخت',
        ownerPhone: phoneNumber,
        documentType: 'سند تک‌برگ شش‌دانگ',
        createdAt: 'امروز',
        rating: 5,
        viewsCount: 1,
      });
    }

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1800);
  };

  const getHeaderInfo = () => {
    switch (type) {
      case 'property':
        return {
          title: 'ثبت فروش نقدی ملک (بدون واسطه)',
          subtitle: 'فایلینگ اختصاصی معاملات نقدی • استعلام آنی سند و قیمت بورس',
          icon: DollarSign
        };
      case 'barter':
        return {
          title: 'ثبت آگهی تهاتر و معاوضه تخصصی',
          subtitle: 'تهاتر مستقیم با ملک، مصالح کارخانه‌ای یا خودرو بدون واسطه',
          icon: RefreshCw
        };
      case 'partnership':
        return {
          title: 'ثبت درخواست مشارکت در ساخت',
          subtitle: 'اتصال مستقیم مالکین پلاک‌های کلنگی به سازندگان ذی‌صلاح رتبه‌دار',
          icon: Handshake
        };
      case 'material_quote':
        return {
          title: 'استعلام قیمت مستقیم مصالح از کارخانه',
          subtitle: 'خرید دست‌اول متریال، کاشی، سیمان و فولاد به نرخ بورس',
          icon: Package
        };
      default:
        return {
          title: 'ثبت فایل در سامانه',
          subtitle: 'نظارت رسمی و اعتبارسنجی کارشناسی پیوند ساخت',
          icon: Building2
        };
    }
  };

  const headerInfo = getHeaderInfo();
  const HeaderIcon = headerInfo.icon;

  return (
    <BottomSheetModal
      isOpen={isOpen}
      onClose={onClose}
      title={headerInfo.title}
      subtitle={headerInfo.subtitle}
    >
      {isSuccess ? (
        <div className="py-8 text-center space-y-3" dir="rtl">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
          </div>
          <h3 className="text-base font-black text-slate-950">فایل شما با موفقیت ثبت شد</h3>
          <p className="text-xs text-slate-600 font-bold leading-relaxed max-w-sm mx-auto">
            پرونده شما در بخش اختصاصی سامانه قرار گرفت و پس از صحت‌سنجی اولیه به کارتابل خریداران و متقاضیان ارسال می‌گردد.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-xs py-1" dir="rtl">
          
          {/* =========================================================================
              ۱. بخش ثبت فایل نقدی ملک (کاملاً مجزا از تهاتر و مشارکت)
              ========================================================================= */}
          {type === 'property' && (
            <div className="space-y-3.5">
              {/* Badge indicating pure cash sale */}
              <div className="bg-amber-50/90 border border-amber-300 p-2.5 rounded-xl flex items-center gap-2 text-amber-900">
                <DollarSign className="w-4 h-4 shrink-0 text-amber-800" />
                <span className="font-black text-xs">
                  این بخش منحصراً مخصوص معاملات نقدی (فروش و رهن) می‌باشد.
                </span>
              </div>

              <div>
                <label className="block text-slate-950 font-black text-xs mb-1">
                  عنوان فایل ملکی (نقدی):
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثلاً: آپارتمان ۱۶۰ متری نوساز کلیدنخورده"
                  value={propTitle}
                  onChange={(e) => setPropTitle(e.target.value)}
                  className="w-full bg-white border-2 border-[#dfc282] focus:border-[#caa758] rounded-xl px-3.5 py-2.5 text-slate-900 text-xs font-bold placeholder-slate-400 focus:outline-none shadow-2xs transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-slate-950 font-black text-xs mb-1">نوع ملک:</label>
                  <select
                    value={propCategory}
                    onChange={(e) => setPropCategory(e.target.value as any)}
                    className="w-full bg-white border-2 border-[#dfc282] focus:border-[#caa758] rounded-xl px-3 py-2 text-slate-900 font-black text-xs focus:outline-none shadow-2xs"
                  >
                    <option value="apartment">آپارتمان مسکونی</option>
                    <option value="villa">ویلا و باغ‌ویلا</option>
                    <option value="commercial">تجاری و اداری</option>
                    <option value="land">زمین و کلنگی</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-950 font-black text-xs mb-1">شهر / استان:</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-white border-2 border-[#dfc282] focus:border-[#caa758] rounded-xl px-3 py-2 text-slate-900 font-bold text-xs focus:outline-none shadow-2xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-slate-950 font-black text-xs mb-1">محله / منطقه:</label>
                  <input
                    type="text"
                    placeholder="سعادت‌آباد"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full bg-white border-2 border-[#dfc282] focus:border-[#caa758] rounded-xl px-2.5 py-2 text-slate-900 font-bold text-xs focus:outline-none shadow-2xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-950 font-black text-xs mb-1">متراژ (متر):</label>
                  <input
                    type="number"
                    value={propArea}
                    onChange={(e) => setPropArea(e.target.value)}
                    className="w-full bg-white border-2 border-[#dfc282] focus:border-[#caa758] rounded-xl px-2.5 py-2 text-slate-900 font-mono font-bold text-xs focus:outline-none shadow-2xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-950 font-black text-xs mb-1">تعداد اتاق:</label>
                  <input
                    type="number"
                    value={propRooms}
                    onChange={(e) => setPropRooms(e.target.value)}
                    className="w-full bg-white border-2 border-[#dfc282] focus:border-[#caa758] rounded-xl px-2.5 py-2 text-slate-900 font-mono font-bold text-xs focus:outline-none shadow-2xs"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-950 font-black text-xs">قیمت کل نقدی پیشنهادی (تومان):</label>
                  <span className="text-[11px] font-black text-amber-900">
                    {formatTomanShort(Number(propPriceCash) || 0)} تومان
                  </span>
                </div>
                <input
                  type="number"
                  step={100000000}
                  value={propPriceCash}
                  onChange={(e) => setPropPriceCash(e.target.value)}
                  className="w-full bg-white border-2 border-[#dfc282] focus:border-[#caa758] rounded-xl px-3.5 py-2.5 text-slate-900 font-mono font-black text-xs focus:outline-none shadow-2xs"
                />
              </div>

              {/* Supabase Property Image Upload */}
              <div>
                <label className="block text-slate-950 font-black text-xs mb-1">تصاویر ملک (ذخیره در فضای ابری Supabase):</label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingImage}
                    className="flex items-center gap-1.5 px-3 py-2 bg-amber-50 hover:bg-amber-100 border border-[#dfc282] rounded-xl text-amber-950 font-bold text-xs cursor-pointer active:scale-95 transition-all"
                  >
                    {isUploadingImage ? (
                      <Loader2 className="w-4 h-4 animate-spin text-amber-800" />
                    ) : (
                      <Upload className="w-4 h-4 text-amber-800" />
                    )}
                    <span>{isUploadingImage ? 'در حال آپلود...' : 'انتخاب و آپلود عکس'}</span>
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  {uploadedImages.length > 0 && (
                    <span className="text-[11px] text-emerald-700 font-bold">
                      {toPersianDigits(uploadedImages.length)} تصویر با موفقیت در Supabase بارگذاری شد
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              ۲. بخش ثبت آگهی تهاتر (تفکیک به: با ملک | با متریال | با خودرو | ترکیبی)
              ========================================================================= */}
          {type === 'barter' && (
            <div className="space-y-3.5">
              {/* انتخاب دقیق شاخه تهاتر مطابق صوت کاربر */}
              <div>
                <label className="block text-slate-950 font-black text-xs mb-1.5">
                  طرف مقابل یا نوع تهاتر مورد نظر شما چیست؟
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setBarterCategory('property')}
                    className={`py-2 px-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95 ${
                      barterCategory === 'property'
                        ? 'btn-3d-gold text-[#2c1b04] shadow-xs'
                        : 'bg-white border-2 border-[#dfc282] text-slate-800 hover:bg-amber-50/50'
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>تهاتر با ملک</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBarterCategory('materials')}
                    className={`py-2 px-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95 ${
                      barterCategory === 'materials'
                        ? 'btn-3d-gold text-[#2c1b04] shadow-xs'
                        : 'bg-white border-2 border-[#dfc282] text-slate-800 hover:bg-amber-50/50'
                    }`}
                  >
                    <Package className="w-3.5 h-3.5" />
                    <span>تهاتر با متریال</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBarterCategory('vehicle')}
                    className={`py-2 px-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95 ${
                      barterCategory === 'vehicle'
                        ? 'btn-3d-gold text-[#2c1b04] shadow-xs'
                        : 'bg-white border-2 border-[#dfc282] text-slate-800 hover:bg-amber-50/50'
                    }`}
                  >
                    <Car className="w-3.5 h-3.5" />
                    <span>تهاتر با خودرو</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBarterCategory('custom')}
                    className={`py-2 px-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95 ${
                      barterCategory === 'custom'
                        ? 'btn-3d-gold text-[#2c1b04] shadow-xs'
                        : 'bg-white border-2 border-[#dfc282] text-slate-800 hover:bg-amber-50/50'
                    }`}
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>تهاتر ترکیبی</span>
                  </button>
                </div>
              </div>

              {/* طرف اول: دارایی شما برای ارائه */}
              <div className="bg-[#fcfaf7] border border-[#e8dfd0] p-3 rounded-2xl space-y-2.5">
                <span className="text-[11px] font-black text-amber-900 block border-b border-[#eee5d8] pb-1">
                  ۱. دارایی ارائه شده توسط شما (مبدأ معاوضه):
                </span>
                <div>
                  <label className="block text-slate-900 font-bold text-[11px] mb-1">
                    عنوان و شرح دارایی شما:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={
                      barterCategory === 'materials'
                        ? 'مثلاً: ۵۰۰ تن میلگرد A3 نیشابور یا پالت سرامیک پرسلان'
                        : barterCategory === 'vehicle'
                        ? 'مثلاً: یک واحد آپارتمان ۱۲۰ متری یا بیل مکانیکی کوماتسو'
                        : 'مثلاً: ویلای ۵۰۰ متری نوشهر یا آپارتمان نوساز در تهران'
                    }
                    value={sourceAssetTitle}
                    onChange={(e) => setSourceAssetTitle(e.target.value)}
                    className="w-full bg-white border border-[#dfc282] rounded-xl px-3 py-2 text-slate-900 text-xs font-bold focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-900 font-bold text-[11px] mb-1">
                      ارزش تقریبی (تومان):
                    </label>
                    <input
                      type="number"
                      step={500000000}
                      value={sourceEstimatedValue}
                      onChange={(e) => setSourceEstimatedValue(e.target.value)}
                      className="w-full bg-white border border-[#dfc282] rounded-xl px-2.5 py-1.5 text-slate-900 font-mono font-black text-xs focus:outline-none"
                    />
                    <span className="text-[10px] text-amber-800 font-black mt-0.5 block">
                      {formatTomanShort(Number(sourceEstimatedValue) || 0)} ت
                    </span>
                  </div>

                  <div>
                    <label className="block text-slate-900 font-bold text-[11px] mb-1">
                      شهر / استان دارایی:
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-white border border-[#dfc282] rounded-xl px-2.5 py-1.5 text-slate-900 font-bold text-xs focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* طرف دوم: دارایی درخواستی در قبال آن */}
              <div className="bg-[#fcfaf7] border border-[#e8dfd0] p-3 rounded-2xl space-y-2.5">
                <span className="text-[11px] font-black text-emerald-900 block border-b border-[#eee5d8] pb-1">
                  ۲. چه دارایی در قبال آن می‌خواهید؟ (مقصد معاوضه):
                </span>
                <div>
                  <label className="block text-slate-900 font-bold text-[11px] mb-1">
                    مشخصات مورد نظر شما:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={
                      barterCategory === 'materials'
                        ? 'مثلاً: میلگرد، سیمان، کاشی، لوله یا تیرآهن کارخانه'
                        : barterCategory === 'vehicle'
                        ? 'مثلاً: تویوتا لندکروز، بنز، لودر یا بیل مکانیکی'
                        : 'مثلاً: آپارتمان نوساز در منطقه ۱ یا ۲ تهران سنددار'
                    }
                    value={targetRequirementTitle}
                    onChange={(e) => setTargetRequirementTitle(e.target.value)}
                    className="w-full bg-white border border-[#dfc282] rounded-xl px-3 py-2 text-slate-900 text-xs font-bold focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-900 font-bold text-[11px] mb-1">
                      برآورد ارزش مدنظر:
                    </label>
                    <input
                      type="number"
                      step={500000000}
                      value={targetEstimatedValue}
                      onChange={(e) => setTargetEstimatedValue(e.target.value)}
                      className="w-full bg-white border border-[#dfc282] rounded-xl px-2.5 py-1.5 text-slate-900 font-mono font-black text-xs focus:outline-none"
                    />
                    <span className="text-[10px] text-emerald-800 font-black mt-0.5 block">
                      {formatTomanShort(Number(targetEstimatedValue) || 0)} ت
                    </span>
                  </div>

                  <div>
                    <label className="block text-slate-900 font-bold text-[11px] mb-1">
                      وضعیت مابه‌التفاوت:
                    </label>
                    <select
                      value={diffSettlementType}
                      onChange={(e) => setDiffSettlementType(e.target.value as any)}
                      className="w-full bg-white border border-[#dfc282] rounded-xl px-2 py-1.5 text-slate-900 font-bold text-xs focus:outline-none"
                    >
                      <option value="cash_diff">پرداخت / دریافت نقدی مابه‌التفاوت</option>
                      <option value="equal_value">معاوضه سر‌به‌سر (هم‌ارزش)</option>
                      <option value="negotiable">قابل توافق و شناور</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              ۳. بخش مشارکت در ساخت (کاملاً مجزا)
              ========================================================================= */}
          {type === 'partnership' && (
            <div className="space-y-3.5">
              <div className="bg-amber-50 border border-amber-300 p-2.5 rounded-xl flex items-center gap-2 text-amber-900">
                <Handshake className="w-4 h-4 shrink-0 text-amber-800" />
                <span className="font-black text-xs">
                  این بخش منحصراً مخصوص پروژه‌های مشارکت در ساخت می‌باشد.
                </span>
              </div>

              <div>
                <label className="block text-slate-950 font-black text-xs mb-1">نقش متقاضی:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPartnershipRole('owner')}
                    className={`py-2 px-3 rounded-xl text-xs font-black cursor-pointer transition-all ${
                      partnershipRole === 'owner'
                        ? 'btn-3d-gold text-[#2c1b04] shadow-xs'
                        : 'bg-white border-2 border-[#dfc282] text-slate-800'
                    }`}
                  >
                    مالک زمین / پلاک کلنگی
                  </button>
                  <button
                    type="button"
                    onClick={() => setPartnershipRole('builder')}
                    className={`py-2 px-3 rounded-xl text-xs font-black cursor-pointer transition-all ${
                      partnershipRole === 'builder'
                        ? 'btn-3d-gold text-[#2c1b04] shadow-xs'
                        : 'bg-white border-2 border-[#dfc282] text-slate-800'
                    }`}
                  >
                    سازنده / سرمایه‌گذار
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-slate-950 font-black text-xs mb-1">متراژ زمین (متر):</label>
                  <input
                    type="number"
                    value={landArea}
                    onChange={(e) => setLandArea(e.target.value)}
                    className="w-full bg-white border-2 border-[#dfc282] focus:border-[#caa758] rounded-xl px-3 py-2 text-slate-900 font-mono font-bold text-xs focus:outline-none shadow-2xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-950 font-black text-xs mb-1">نسبت پیشنهادی (مالک-سازنده):</label>
                  <input
                    type="text"
                    value={proposedRatio}
                    onChange={(e) => setProposedRatio(e.target.value)}
                    placeholder="مثلاً: ۶۰ به ۴۰"
                    className="w-full bg-white border-2 border-[#dfc282] focus:border-[#caa758] rounded-xl px-3 py-2 text-slate-900 font-bold text-xs focus:outline-none shadow-2xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-950 font-black text-xs mb-1">
                  مبلغ بلاعوض پیشنهادی (تومان):
                </label>
                <input
                  type="number"
                  step={500000000}
                  value={gratuitousAmount}
                  onChange={(e) => setGratuitousAmount(e.target.value)}
                  className="w-full bg-white border-2 border-[#dfc282] focus:border-[#caa758] rounded-xl px-3.5 py-2 text-slate-900 font-mono font-black text-xs focus:outline-none shadow-2xs"
                />
              </div>
            </div>
          )}

          {/* =========================================================================
              ۴. بخش مصالح و متریال (کاملاً مجزا)
              ========================================================================= */}
          {type === 'material_quote' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-slate-950 font-black text-xs mb-1">نوع متریال مورد نیاز:</label>
                  <select
                    value={materialType}
                    onChange={(e) => setMaterialType(e.target.value)}
                    className="w-full bg-white border-2 border-[#dfc282] focus:border-[#caa758] rounded-xl px-3 py-2 text-slate-900 font-black text-xs focus:outline-none shadow-2xs"
                  >
                    <option value="فولاد و میلگرد">فولاد، میلگرد و تیرآهن</option>
                    <option value="سیمان و بتن">سیمان پاکتی و بتن آماده</option>
                    <option value="کاشی و سرامیک">کاشی و سرامیک پرسلان</option>
                    <option value="لوله و تأسیسات">لوله و تأسیسات ساختمانی</option>
                    <option value="سنگ ساختمانی">سنگ نما و کف</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-950 font-black text-xs mb-1">حجم / متراژ تخمینی:</label>
                  <input
                    type="text"
                    value={materialQuantity}
                    onChange={(e) => setMaterialQuantity(e.target.value)}
                    placeholder="مثلاً: ۲۰۰ تن یا ۴۰۰۰ متر"
                    className="w-full bg-white border-2 border-[#dfc282] focus:border-[#caa758] rounded-xl px-3 py-2 text-slate-900 font-bold text-xs focus:outline-none shadow-2xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* توضیحات تکمیلی و شماره تماس متقاضی */}
          <div className="space-y-2.5 pt-1">
            <div>
              <label className="block text-slate-950 font-black text-xs mb-1">
                توضیحات تکمیلی پرونده:
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="توضیحات ویژه، سند، شرایط تحویل یا هر نکته کلیدی دیگر..."
                className="w-full bg-white border-2 border-[#dfc282] focus:border-[#caa758] rounded-xl p-2.5 text-slate-900 placeholder-slate-400 focus:outline-none text-xs font-bold shadow-2xs transition-all"
              />
            </div>

            <div>
              <label className="block text-slate-950 font-black text-xs mb-1">
                شماره تماس مالک / متقاضی جهت هماهنگی:
              </label>
              <input
                type="tel"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full bg-white border-2 border-[#dfc282] focus:border-[#caa758] rounded-xl px-3.5 py-2.5 text-slate-900 font-mono font-black text-xs focus:outline-none shadow-2xs text-left"
                dir="ltr"
              />
            </div>
          </div>

          {/* دکمه ارسال نهایی */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 btn-3d-gold text-[#2c1b04] font-black text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-98 transition-transform"
            >
              <Send className="w-4 h-4 stroke-[2.8]" />
              <span>ثبت مستقیم فایل در بخش مربوطه</span>
            </button>
          </div>

        </form>
      )}
    </BottomSheetModal>
  );
};
