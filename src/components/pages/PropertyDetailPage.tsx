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
  Box
} from 'lucide-react';
import { Property } from '../../types';
import { formatToman, formatTomanShort, getVerificationBadgeColor, getVerificationBadgeText, maskPhoneNumber, toPersianDigits } from '../../utils/formatters';
import { Property3DViewer } from '../common/Property3DViewer';

interface PropertyDetailPageProps {
  property: Property;
  onBack: () => void;
  onEnterDealRoom: (code: string) => void;
}

export const PropertyDetailPage: React.FC<PropertyDetailPageProps> = ({
  property,
  onBack,
  onEnterDealRoom,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [show3DInspector, setShow3DInspector] = useState(true);

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      
      {/* Top Back Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="glass-card hover:bg-white/20 border border-white/20 text-white font-bold px-4 py-2.5 rounded-2xl text-xs flex items-center gap-2 transition-all shadow-glass-3d active:scale-95 cursor-pointer"
        >
          <ArrowRight className="w-4 h-4" />
          <span>بازگشت به فهرست</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShow3DInspector(!show3DInspector)}
            className="glass-amber text-amber-300 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 border border-amber-400/40"
          >
            <Box className="w-3.5 h-3.5" />
            <span>{show3DInspector ? 'پنهان‌سازی ۳ بعدی' : 'نمایش بازرس ۳ بعدی'}</span>
          </button>

          <span className="font-mono text-xs font-bold glass-panel-dark text-white px-3.5 py-2 rounded-2xl border border-white/15">
            کد فایل: {property.code}
          </span>
        </div>
      </div>

      {/* Main Gallery with Glass Border */}
      <div className="glass-card rounded-3xl border border-white/20 overflow-hidden shadow-glass-3d space-y-3 p-3.5">
        {/* Active Selected Main Image */}
        <div className="relative h-72 sm:h-96 bg-slate-950 rounded-2xl overflow-hidden group">
          <img
            src={property.images[selectedImageIndex] || property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Verification Badge Seal */}
          <div className="absolute top-4 right-4 glass-emerald text-emerald-300 border border-emerald-400/50 text-xs px-3.5 py-1.5 rounded-2xl font-black flex items-center gap-1.5 shadow-lg">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>تأیید اصالت ثبتی و حقوقی</span>
          </div>
        </div>

        {/* Image Thumbnails Slider */}
        {property.images.length > 1 && (
          <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-1">
            {property.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImageIndex(idx)}
                className={`relative w-22 h-16 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                  selectedImageIndex === idx ? 'border-amber-400 scale-105 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
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
        />
      )}

      {/* Title & Basic Specs */}
      <div className="glass-card p-6 sm:p-7 rounded-3xl border border-white/15 space-y-4 shadow-glass-3d">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1.5">
            <MapPin className="w-4 h-4 text-amber-400" />
            <span>{property.city} | {property.district}</span>
            <span className="text-slate-500">•</span>
            <span className="glass-panel-dark px-2.5 py-0.5 rounded-lg font-medium border border-white/10 text-slate-300">{property.documentType}</span>
          </div>

          <h1 className="text-lg sm:text-xl font-black text-white leading-snug">{property.title}</h1>
        </div>

        {/* Price Box with Glass Amber / Emerald Glow */}
        <div className={`p-4.5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm border ${
          property.dealType === 'rent' ? 'glass-emerald border-emerald-400/40 text-emerald-100' : 'glass-amber border-amber-400/40 text-amber-100'
        }`}>
          {property.dealType === 'rent' && property.rentalDetails ? (
            <>
              <div>
                <span className="text-xs text-emerald-300 block font-medium">مبلغ ودیعه (رهن کارشناسی):</span>
                <span className="text-xl sm:text-2xl font-black text-white">{formatToman(property.rentalDetails.depositPrice)}</span>
              </div>
              <div className="sm:text-left">
                <span className="text-xs text-emerald-300 block font-medium">اجاره بهای ماهیانه:</span>
                <span className="text-lg sm:text-xl font-black text-amber-300">{formatToman(property.rentalDetails.monthlyRent)}</span>
              </div>
            </>
          ) : (
            <>
              <div>
                <span className="text-xs text-amber-300 block font-medium">قیمت کل کارشناسی شده:</span>
                <span className="text-xl sm:text-2xl font-black text-white">{formatToman(property.price)}</span>
              </div>
              <div className="sm:text-left">
                <span className="text-xs text-amber-300 block font-medium">قیمت هر متر مربع:</span>
                <span className="text-sm font-bold text-amber-200">{formatToman(property.pricePerMeter)}</span>
              </div>
            </>
          )}
        </div>

        {/* Key Attributes 3D Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 glass-panel-dark p-4 rounded-2xl text-xs text-slate-300 font-medium border border-white/10">
          <div>
            <span className="text-[10px] text-slate-400 block">متراژ زیربنا:</span>
            <span className="text-sm font-black text-white">{toPersianDigits(property.area)} متر مربع</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">تعداد اتاق:</span>
            <span className="text-sm font-black text-white">{toPersianDigits(property.rooms)} خواب</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">سال ساخت:</span>
            <span className="text-sm font-black text-white">{toPersianDigits(property.year)}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">طبقه:</span>
            <span className="text-sm font-black text-white">طبقه {toPersianDigits(property.floor || 1)} از {toPersianDigits(property.totalFloors || 1)}</span>
          </div>
        </div>
      </div>

      {/* Verification Notes by Legal Expert */}
      {property.verificationNotes && (
        <div className="glass-emerald border border-emerald-400/40 p-5 rounded-3xl space-y-2 text-emerald-100 text-xs shadow-glass-3d">
          <div className="flex items-center gap-2 font-black text-emerald-300 border-b border-emerald-400/30 pb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>گزارش رسمی اعتبارسنجی اسناد (ثبت شده توسط: {property.verifiedBy || 'کارشناس رسمی پیوند ساخت'})</span>
          </div>
          <p className="leading-relaxed text-emerald-100/90">{property.verificationNotes}</p>
        </div>
      )}

      {/* Features List & Description */}
      <div className="glass-card p-6 rounded-3xl border border-white/15 space-y-4 shadow-glass-3d">
        <h3 className="font-extrabold text-sm text-white border-b border-white/10 pb-2">امکانات و ویژگی‌ها</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {property.features.map((feat, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs text-slate-200 glass-panel-dark p-2.5 rounded-xl border border-white/10">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{feat}</span>
            </div>
          ))}
        </div>

        <h3 className="font-extrabold text-sm text-white border-b border-white/10 pb-2 pt-2">توضیحات تکمیلی</h3>
        <p className="text-xs text-slate-300 leading-relaxed font-light">{property.description}</p>
      </div>

      {/* Bottom Action Footer with 3D Button */}
      <div className="glass-panel-dark text-white p-5 rounded-3xl border border-white/20 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-glass-3d">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs">
            <UserCheck className="w-4 h-4 text-amber-400" />
            <span>مالک: {property.ownerName}</span>
            <span className="text-slate-500">•</span>
            <span className="font-mono text-slate-300">{maskPhoneNumber(property.ownerPhone)}</span>
          </div>
          <p className="text-[11px] text-slate-400 font-light">
            جهت حفظ محرمانگی و امنیت مالی، ارتباط مستقیم و معامله از طریق «اتاق معامله» انجام می‌شود.
          </p>
        </div>

        <button
          onClick={() => onEnterDealRoom(property.code)}
          className="w-full sm:w-auto btn-3d-amber text-slate-950 font-black text-xs px-6 py-3.5 rounded-2xl shadow-lg flex items-center justify-center gap-2 cursor-pointer shrink-0 border border-amber-300/50"
        >
          <Lock className="w-4 h-4" />
          <span>ورود به اتاق معامله محرمانه</span>
        </button>
      </div>

    </div>
  );
};
