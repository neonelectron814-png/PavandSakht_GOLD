import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  MapPin, 
  Lock, 
  CheckCircle2, 
  ArrowRight, 
  Share2, 
  Phone, 
  Calendar, 
  FileText,
  UserCheck,
  Sparkles,
  Box,
  ChevronRight
} from 'lucide-react';
import { Property } from '../../types';
import { formatToman, formatTomanShort, getVerificationBadgeColor, getVerificationBadgeText, maskPhoneNumber, toPersianDigits } from '../../utils/formatters';
import { Property3DViewer } from '../common/Property3DViewer';

interface PropertyDetailPageProps {
  property: Property;
  onBack: () => void;
  onEnterDealRoom: (code: string) => void;
  onNavigateTab?: (tab: string) => void;
}

export const PropertyDetailPage: React.FC<PropertyDetailPageProps> = ({
  property,
  onBack,
  onEnterDealRoom,
  onNavigateTab,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [show3DInspector, setShow3DInspector] = useState(true);

  if (!property) {
    return (
      <div className="p-8 text-center bg-white rounded-3xl border-2 border-[#dfc282] max-w-lg mx-auto my-12 space-y-4">
        <p className="font-bold text-slate-700">اطلاعات این ملک در دسترس نیست یا پرونده حذف شده است.</p>
        <button onClick={onBack} className="btn-3d-gold px-6 py-2 rounded-xl font-black cursor-pointer">
          بازگشت به فهرست املاک
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16 max-w-5xl mx-auto text-[#1c1d22]" dir="rtl">
      
      {/* Top Back Navigation Bar - Responsive & Optimized for Mobile */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 bg-white p-3 sm:p-4 rounded-2xl border-2 border-[#dfc282] shadow-2xs">
        <button
          onClick={onBack}
          className="h-9 px-3 sm:px-4 rounded-xl btn-3d-gold text-[#2c1b04] text-xs sm:text-[14px] font-black flex items-center gap-1.5 shadow-2xs active:scale-95 cursor-pointer shrink-0"
        >
          <ChevronRight className="w-4 h-4 stroke-[2.5]" />
          <span>بازگشت<span className="hidden sm:inline"> به فهرست املاک</span></span>
        </button>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShow3DInspector(!show3DInspector)}
            className="h-9 px-3 rounded-xl bg-white hover:bg-amber-50 text-slate-900 border-2 border-[#dfc282] text-xs sm:text-[13.5px] font-black flex items-center gap-1.5 shadow-2xs active:scale-95 cursor-pointer shrink-0"
          >
            <Box className="w-4 h-4 text-amber-800" />
            <span>{show3DInspector ? 'پنهان‌سازی ۳بعدی' : 'نمایش مدل ۳بعدی'}</span>
          </button>

          <div className="bg-[#faf8f4] text-slate-950 px-3 py-1.5 rounded-xl border-2 border-[#dfc282] shadow-2xs flex items-center gap-1 text-xs font-black shrink-0">
            <span className="text-slate-600 font-bold">کد پرونده:</span>
            <span dir="ltr" className="font-mono font-black text-amber-950 tracking-wider">
              {property.code}
            </span>
          </div>
        </div>
      </div>

      {/* Main Gallery Card with 3D Gold Frame */}
      <div className="bg-white rounded-[28px] border-2 border-[#dfc282] overflow-hidden shadow-[0_4px_16px_rgba(180,130,40,0.1)] space-y-3 p-4">
        {/* Active Selected Main Image */}
        <div className="relative h-72 sm:h-96 bg-slate-950 rounded-2xl overflow-hidden group">
          <img
            src={property.images[selectedImageIndex] || property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Verification Badge Seal */}
          <div className="absolute top-4 right-4 bg-emerald-700 text-white text-xs px-3.5 py-1.5 rounded-xl font-black flex items-center gap-1.5 shadow-lg border border-emerald-600">
            <ShieldCheck className="w-4 h-4 text-white" />
            <span>تأیید اصالت ثبتی و حقوقی</span>
          </div>

          <span className="absolute bottom-4 left-4 bg-black/70 text-white text-xs px-3 py-1 rounded-xl font-mono backdrop-blur-xs">
            تصویر {toPersianDigits(selectedImageIndex + 1)} از {toPersianDigits(property.images.length)}
          </span>
        </div>

        {/* Image Thumbnails Slider */}
        {property.images.length > 1 && (
          <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-1">
            {property.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImageIndex(idx)}
                className={`relative w-22 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                  selectedImageIndex === idx ? 'border-[#caa758] scale-105 shadow-md ring-2 ring-amber-300/40' : 'border-[#e6dfd3] opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt="تصویر ملک" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 3D Property Layers Inspector (Interactive Component) */}
      {show3DInspector && (
        <Property3DViewer
          propertyTitle={property.title}
          propertyCode={property.code}
          verifiedStatus={property.verifiedStatus}
          area={property.area}
          rooms={property.rooms}
          year={property.year}
          onOpenStudio={() => {
            if (onNavigateTab) {
              onNavigateTab('building_3d');
            }
          }}
        />
      )}

      {/* Title & Basic Specs Card */}
      <div className="bg-white p-5 sm:p-6 rounded-[28px] border-2 border-[#dfc282] space-y-4 shadow-[0_4px_16px_rgba(180,130,40,0.1)]">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-600 font-bold mb-1.5">
            <MapPin className="w-4 h-4 text-amber-800" />
            <span>{property.city} | {property.district}</span>
            <span className="text-slate-400">•</span>
            <span className="bg-[#faf8f4] px-2.5 py-0.5 rounded-lg font-black border border-[#e4ddd0] text-slate-900">{property.documentType}</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-slate-950 leading-snug">{property.title}</h1>
        </div>

        {/* Price Box with Gold Glow */}
        <div className={`p-4.5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs border-2 ${
          property.dealType === 'rent' ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950' : 'bg-amber-50/80 border-[#caa758] text-amber-950'
        }`}>
          {property.dealType === 'rent' && property.rentalDetails ? (
            <>
              <div>
                <span className="text-xs text-emerald-800 block font-bold">مبلغ ودیعه (رهن کارشناسی):</span>
                <span className="text-xl sm:text-2xl font-black text-emerald-950 font-mono">{formatToman(property.rentalDetails.depositPrice)} تومان</span>
              </div>
              <div className="sm:text-left">
                <span className="text-xs text-amber-800 block font-bold">اجاره‌بهای ماهیانه:</span>
                <span className="text-lg sm:text-xl font-black text-amber-950 font-mono">{formatToman(property.rentalDetails.monthlyRent)} تومان</span>
              </div>
            </>
          ) : (
            <>
              <div>
                <span className="text-xs text-amber-800 block font-bold">قیمت کل کارشناسی‌شده:</span>
                <span className="text-xl sm:text-2xl font-black text-amber-950 font-mono">{formatToman(property.price)} تومان</span>
              </div>
              <div className="sm:text-left">
                <span className="text-xs text-slate-600 block font-bold">قیمت هر متر مربع:</span>
                <span className="text-base font-black text-slate-900 font-mono">{formatToman(property.pricePerMeter)} تومان</span>
              </div>
            </>
          )}
        </div>

        {/* Key Attributes 3D Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#faf8f4] p-4 rounded-2xl text-xs text-slate-800 font-medium border-2 border-[#e6dfd3]">
          <div>
            <span className="text-xs text-slate-600 font-bold block mb-1">متراژ زیربنا:</span>
            <span className="text-[15px] font-black text-slate-950">{toPersianDigits(property.area)} متر مربع</span>
          </div>
          <div>
            <span className="text-xs text-slate-600 font-bold block mb-1">تعداد اتاق:</span>
            <span className="text-[15px] font-black text-slate-950">{toPersianDigits(property.rooms)} خواب</span>
          </div>
          <div>
            <span className="text-xs text-slate-600 font-bold block mb-1">سال ساخت:</span>
            <span className="text-[15px] font-black text-slate-950">{toPersianDigits(property.year)}</span>
          </div>
          <div>
            <span className="text-xs text-slate-600 font-bold block mb-1">طبقه:</span>
            <span className="text-[15px] font-black text-slate-950">طبقه {toPersianDigits(property.floor || 1)} از {toPersianDigits(property.totalFloors || 1)}</span>
          </div>
        </div>
      </div>

      {/* Verification Notes by Legal Expert */}
      {property.verificationNotes && (
        <div className="bg-emerald-50/90 border-2 border-emerald-300 p-5 rounded-[28px] space-y-2 text-emerald-950 text-xs shadow-[0_4px_16px_rgba(16,185,129,0.08)]">
          <div className="flex items-center gap-2 font-black text-emerald-900 border-b border-emerald-300/60 pb-2 text-sm">
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
            <span>گزارش رسمی اعتبارسنجی اسناد (ثبت شده توسط: {property.verifiedBy || 'کارشناس رسمی پیوند ساخت'})</span>
          </div>
          <p className="leading-relaxed text-emerald-900 font-bold text-xs sm:text-[13px]">{property.verificationNotes}</p>
        </div>
      )}

      {/* Features List & Description */}
      <div className="bg-white p-5 sm:p-6 rounded-[28px] border-2 border-[#dfc282] space-y-4 shadow-[0_4px_16px_rgba(180,130,40,0.1)]">
        <h3 className="font-black text-base text-slate-950 border-b border-[#ede6d8] pb-2">امکانات و ویژگی‌ها</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {property.features.map((feat, idx) => (
            <div key={idx} className="flex items-center gap-2 text-[13px] font-bold text-slate-900 bg-[#faf8f4] p-2.5 rounded-xl border border-[#e4ddd0]">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
              <span>{feat}</span>
            </div>
          ))}
        </div>

        <h3 className="font-black text-base text-slate-950 border-b border-[#ede6d8] pb-2 pt-2">توضیحات تکمیلی</h3>
        <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed font-bold">{property.description}</p>
      </div>

      {/* Bottom Action Footer with 3D Gold Button */}
      <div className="bg-white text-slate-950 p-5 rounded-[28px] border-2 border-[#dfc282] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0_4px_16px_rgba(180,130,40,0.1)]">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold">
            <UserCheck className="w-4 h-4 text-amber-800" />
            <span>مالک: {property.ownerName}</span>
            <span className="text-slate-400">•</span>
            <span className="font-mono font-bold text-slate-700">{maskPhoneNumber(property.ownerPhone)}</span>
          </div>
          <p className="text-xs text-slate-600 font-bold">
            جهت حفظ محرمانگی و امنیت مالی، ارتباط مستقیم و معامله از طریق «اتاق معامله امن» انجام می‌شود.
          </p>
        </div>

        <button
          onClick={() => onEnterDealRoom(property.code)}
          className="w-full sm:w-auto h-10 px-4 sm:px-5 btn-3d-gold text-[#2c1b04] font-black text-xs sm:text-[14.5px] rounded-xl shadow-2xs flex items-center justify-center gap-2 cursor-pointer shrink-0 active:scale-95 transition-transform"
        >
          <Lock className="w-4 h-4 stroke-[2.5]" />
          <span>ورود به اتاق معامله</span>
        </button>
      </div>

    </div>
  );
};
