import React, { useState } from 'react';
import { Layers, ShieldCheck, Zap, Eye, RotateCw, Sparkles, Building, CheckCircle2, Box, Compass, FileText, Palette } from 'lucide-react';
import { toPersianDigits } from '../../utils/formatters';

interface Property3DViewerProps {
  propertyTitle: string;
  propertyCode: string;
  verifiedStatus?: string;
  area: number;
  rooms: number;
  year: number;
  onOpenStudio?: () => void;
}

export const Property3DViewer: React.FC<Property3DViewerProps> = ({
  propertyTitle,
  propertyCode,
  verifiedStatus = 'verified',
  area,
  rooms,
  year,
  onOpenStudio,
}) => {
  const [activeLayer, setActiveLayer] = useState<'architecture' | 'structure' | 'materials' | 'blueprint' | 'legal'>('materials');
  const [activeMaterial, setActiveMaterial] = useState<'travertine' | 'porcelain' | 'timber' | 'glass_facade'>('travertine');
  const [rotateX, setRotateX] = useState<number>(20);
  const [rotateY, setRotateY] = useState<number>(-25);
  const [isExploded, setIsExploded] = useState<boolean>(true);

  const materialsData = {
    travertine: {
      name: 'سنگ نمای تراورتن عباس‌آباد سوپر',
      color: 'from-amber-200 via-amber-100 to-amber-300',
      border: 'border-amber-400',
      tag: 'عایق حرارتی و صوتی، ضد شوره با رزین اپوکسی',
      density: '۲.۶ گرم/سانتی‌متر مکعب',
      grade: 'درجه یک صادراتی'
    },
    porcelain: {
      name: 'سرامیک پرسلان اسلب کالیبره ۱۲۰×۲۴۰',
      color: 'from-stone-300 via-slate-100 to-stone-400',
      border: 'border-stone-400',
      tag: 'جذب آب زیر ۰.۵٪، مقاوم در برابر سایش کلاس ۵',
      density: 'پرس هیدرولیک نانو',
      grade: 'پرسلان پولیش خورده'
    },
    timber: {
      name: 'ترمووود فنلاندی D-Pine نما و تراس',
      color: 'from-amber-700 via-orange-800 to-amber-900',
      border: 'border-amber-600',
      tag: 'فرآوری حرارتی ۲۱۵ درجه، ضد رطوبت و موریانه',
      density: '۴۵۰ کیلوگرم/متر مکعب',
      grade: 'گواهی PEFC اروپا'
    },
    glass_facade: {
      name: 'شیشه کرتین‌وال دوجداره لمینت Low-E',
      color: 'from-sky-300 via-cyan-100 to-blue-400',
      border: 'border-cyan-400',
      tag: 'گاز آرگون، کنترل اشعه UV، ضریب U=1.3',
      density: 'ضخامت ۶+۱۲+۶ میلیمتر',
      grade: 'سکوریت نشکن صنعتی'
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setRotateY(Math.max(-45, Math.min(45, (x / (rect.width / 2)) * 35)));
    setRotateX(Math.max(-10, Math.min(40, -(y / (rect.height / 2)) * 30 + 15)));
  };

  const handleMouseLeave = () => {
    setRotateX(20);
    setRotateY(-25);
  };

  return (
    <div className="relative bg-[#fffdfa] rounded-3xl p-4 sm:p-5 border-2 border-[#e3dacf] shadow-[0_6px_24px_rgba(0,0,0,0.06)] overflow-hidden space-y-4">
      {/* Background Glows for Glass refraction */}
      <div className="absolute -top-12 -left-12 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Bar */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#ebd7b8] pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-900 border border-amber-500/40 px-2.5 py-0.5 rounded-full text-[10px] font-black">
              <Box className="w-3 h-3 text-amber-700" />
              <span>مدل تعاملی ۳ بعدی ساختمان بر اساس متریال و نقشه مهندسی</span>
            </span>
            <span className="font-mono text-[10px] bg-slate-900 text-amber-300 px-2.5 py-0.5 rounded-md font-bold">
              {propertyCode}
            </span>
          </div>
          <h3 className="font-black text-sm text-slate-950 mt-1">
            بررسی هم‌زمان نقشه ساختمانی (پلان) + لایه متریال‌های مصرفی از فونداسیون تا نازک‌کاری
          </h3>
        </div>

        {/* 3D Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {onOpenStudio && (
            <button
              onClick={onOpenStudio}
              className="px-3 py-1.5 rounded-xl text-xs font-black bg-slate-900 hover:bg-slate-800 text-amber-300 transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>استودیو هوش مصنوعی ۳ بعدی 👈</span>
            </button>
          )}

          <button
            onClick={() => setIsExploded(!isExploded)}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shadow-sm cursor-pointer ${
              isExploded
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-amber-500/30 scale-105'
                : 'bg-white text-slate-800 border border-[#ded5c5]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{isExploded ? 'لایه‌های منفصل ۳ بعدی' : 'نمای یکپارچه سازه'}</span>
          </button>

          <button
            onClick={() => {
              setRotateX(20);
              setRotateY(-25);
            }}
            className="p-1.5 rounded-xl bg-white text-slate-700 border border-[#ded5c5] hover:text-amber-600 transition-colors cursor-pointer"
            title="بازنشانی زاویه دید"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Layer Tabs: Architecture, Materials, Blueprint, Structure, Legal */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar relative z-10 pb-1">
        <button
          onClick={() => setActiveLayer('materials')}
          className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shrink-0 border ${
            activeLayer === 'materials'
              ? 'bg-amber-600 text-white border-amber-600 shadow-md'
              : 'bg-white text-slate-800 border-[#ded5c5] hover:bg-amber-50'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>لایه متریال و مصالح نما</span>
        </button>

        <button
          onClick={() => setActiveLayer('blueprint')}
          className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shrink-0 border ${
            activeLayer === 'blueprint'
              ? 'bg-blue-600 text-white border-blue-600 shadow-md'
              : 'bg-white text-slate-800 border-[#ded5c5] hover:bg-blue-50'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>نقشه اتوکد و پلان معماری</span>
        </button>

        <button
          onClick={() => setActiveLayer('structure')}
          className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shrink-0 border ${
            activeLayer === 'structure'
              ? 'bg-slate-900 text-white border-slate-900 shadow-md'
              : 'bg-white text-slate-800 border-[#ded5c5] hover:bg-slate-100'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>اسکلت بتن و فولاد</span>
        </button>

        <button
          onClick={() => setActiveLayer('architecture')}
          className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shrink-0 border ${
            activeLayer === 'architecture'
              ? 'bg-amber-800 text-white border-amber-800 shadow-md'
              : 'bg-white text-slate-800 border-[#ded5c5] hover:bg-amber-50'
          }`}
        >
          <Building className="w-3.5 h-3.5" />
          <span>فضاسازی و پارتیشن‌بندی</span>
        </button>

        <button
          onClick={() => setActiveLayer('legal')}
          className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shrink-0 border ${
            activeLayer === 'legal'
              ? 'bg-emerald-700 text-white border-emerald-700 shadow-md'
              : 'bg-white text-slate-800 border-[#ded5c5] hover:bg-emerald-50'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>شناسه سند تک‌برگ</span>
        </button>
      </div>

      {/* Material Selector Sub-bar when Materials or Architecture is selected */}
      {(activeLayer === 'materials' || activeLayer === 'architecture') && (
        <div className="bg-[#fbf7ed] border border-[#ebd8bb] rounded-2xl p-2.5 flex flex-wrap items-center justify-between gap-2">
          <span className="text-[11px] font-black text-amber-950 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            انتخاب متریال تست زنده روی مدل ساختمان:
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setActiveMaterial('travertine')}
              className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-all ${
                activeMaterial === 'travertine'
                  ? 'bg-amber-200 text-amber-950 border-amber-500 shadow-sm font-black'
                  : 'bg-white text-slate-700 border-slate-300'
              }`}
            >
              سنگ تراورتن
            </button>
            <button
              onClick={() => setActiveMaterial('porcelain')}
              className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-all ${
                activeMaterial === 'porcelain'
                  ? 'bg-stone-300 text-slate-950 border-stone-500 shadow-sm font-black'
                  : 'bg-white text-slate-700 border-slate-300'
              }`}
            >
              سرامیک پرسلان اسلب
            </button>
            <button
              onClick={() => setActiveMaterial('timber')}
              className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-all ${
                activeMaterial === 'timber'
                  ? 'bg-amber-800 text-amber-100 border-amber-900 shadow-sm font-black'
                  : 'bg-white text-slate-700 border-slate-300'
              }`}
            >
              ترمووود فنلاندی
            </button>
            <button
              onClick={() => setActiveMaterial('glass_facade')}
              className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-all ${
                activeMaterial === 'glass_facade'
                  ? 'bg-sky-200 text-sky-950 border-sky-500 shadow-sm font-black'
                  : 'bg-white text-slate-700 border-slate-300'
              }`}
            >
              کرتین‌وال شیشه‌ای Low-E
            </button>
          </div>
        </div>
      )}

      {/* 3D Interactive Stage Canvas */}
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative h-68 sm:h-76 w-full rounded-2xl bg-gradient-to-b from-[#faf8f5] via-[#f5efe4] to-[#fbf9f6] border-2 border-[#e6dcce] overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing select-none shadow-inner"
        style={{ perspective: '1200px' }}
      >
        {/* Ambient Grid Floor */}
        <div 
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(rgba(184, 140, 66, 0.4) 1px, transparent 1px), radial-gradient(rgba(16, 185, 129, 0.25) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            backgroundPosition: '0 0, 12px 12px',
          }}
        />

        {/* 3D Isometric Hologram Root */}
        <div
          className="relative transition-transform duration-150 ease-out"
          style={{
            transformStyle: 'preserve-3d',
            transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
            width: '260px',
            height: '260px',
          }}
        >
          {/* Layer 1: Base Foundation (Legal / Title Deed Base) */}
          <div
            className={`absolute inset-0 rounded-2xl transition-all duration-500 border-2 flex flex-col justify-between p-3.5 ${
              activeLayer === 'legal'
                ? 'bg-emerald-50/90 border-emerald-500 shadow-[0_0_25px_rgba(16,185,129,0.3)] text-emerald-950'
                : 'bg-emerald-50/50 border-emerald-400/40 text-emerald-900'
            }`}
            style={{
              transform: isExploded ? 'translateZ(-85px)' : 'translateZ(-25px)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <div className="flex items-center justify-between text-emerald-900">
              <span className="text-[10px] font-black flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                لایه ۱: استعلام سند رسمی و اصالت کاداستر
              </span>
              <span className="text-[9px] bg-emerald-600 text-white px-1.5 py-0.5 rounded font-mono font-bold">۱۰۰٪ معتبر</span>
            </div>
            
            <div className="text-[9.5px] text-emerald-950 font-bold space-y-1">
              <p>• شناسه یکتا ثبتی ملک: ۶۸۲-۹۱-۳۴-۸۸</p>
              <p>• تأیید عدم بازداشتی و فاقد معارض حقوقی</p>
            </div>
          </div>

          {/* Layer 2: Structural & MEP Layer */}
          <div
            className={`absolute inset-0 rounded-2xl transition-all duration-500 border-2 flex flex-col justify-between p-3.5 ${
              activeLayer === 'structure'
                ? 'bg-blue-50/90 border-blue-500 shadow-[0_0_25px_rgba(59,130,246,0.3)] text-blue-950'
                : 'bg-slate-50/70 border-blue-400/40 text-slate-800'
            }`}
            style={{
              transform: isExploded ? 'translateZ(-30px)' : 'translateZ(-8px)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <div className="flex items-center justify-between text-blue-900">
              <span className="text-[10px] font-black flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-blue-600" />
                لایه ۲: سازه بتن آرمه و اسکلت فلزی
              </span>
              <span className="text-[9px] bg-blue-600 text-white px-1.5 py-0.5 rounded font-mono font-bold">آیین‌نامه ۲۸۰۰</span>
            </div>

            <div className="grid grid-cols-2 gap-1 text-[9px] text-blue-950 font-bold">
              <div className="bg-blue-100/70 p-1.5 rounded border border-blue-300">میلگرد A3 ذوب‌آهن</div>
              <div className="bg-blue-100/70 p-1.5 rounded border border-blue-300">بتن عیار ۴۰۰ استاندارد</div>
            </div>
          </div>

          {/* Layer 3: Blueprint Architectural Plan Overlay */}
          <div
            className={`absolute inset-0 rounded-2xl transition-all duration-500 border-2 flex flex-col justify-between p-3.5 ${
              activeLayer === 'blueprint'
                ? 'bg-cyan-50/90 border-cyan-500 shadow-[0_0_25px_rgba(6,182,212,0.3)] text-cyan-950'
                : 'bg-white/70 border-cyan-400/40 text-slate-800'
            }`}
            style={{
              transform: isExploded ? 'translateZ(25px)' : 'translateZ(10px)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <div className="flex items-center justify-between text-cyan-900">
              <span className="text-[10px] font-black flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 text-cyan-600" />
                لایه ۳: نقشه اتوکد معماری و پلان مصوب
              </span>
              <span className="text-[9px] bg-cyan-600 text-white px-1.5 py-0.5 rounded font-mono font-bold">مقیاس ۱:۱۰۰</span>
            </div>

            {/* Blueprint Grid Lines Graphic */}
            <div className="h-16 border border-dashed border-cyan-500/50 rounded-lg p-1.5 grid grid-cols-3 gap-1 text-[8px] text-cyan-950 font-black text-center items-center">
              <div className="border border-cyan-300 p-1 rounded bg-cyan-100/80">نشیمن ۴۲م²</div>
              <div className="border border-cyan-300 p-1 rounded bg-cyan-100/80">آشپزخانه ۱۸م²</div>
              <div className="border border-cyan-300 p-1 rounded bg-cyan-100/80">مستر ۲۴م²</div>
            </div>
          </div>

          {/* Layer 4: Material & Finishing Layer */}
          <div
            className={`absolute inset-0 rounded-2xl transition-all duration-500 border-2 flex flex-col justify-between p-3.5 ${
              activeLayer === 'materials'
                ? 'bg-amber-50/95 border-amber-500 shadow-[0_0_25px_rgba(245,158,11,0.3)] text-amber-950'
                : 'bg-white/80 border-amber-400/40 text-slate-800'
            }`}
            style={{
              transform: isExploded ? 'translateZ(85px)' : 'translateZ(28px)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <div className="flex items-center justify-between text-amber-950">
              <span className="text-[10px] font-black flex items-center gap-1">
                <Palette className="w-3.5 h-3.5 text-amber-600" />
                لایه ۴: متریال نما ({materialsData[activeMaterial].name.split(' ')[0]})
              </span>
              <span className="text-[9px] bg-amber-600 text-white px-2 py-0.5 rounded font-bold">
                {materialsData[activeMaterial].grade}
              </span>
            </div>

            {/* Simulated Dynamic Material Swatch Card */}
            <div className="p-2 rounded-xl bg-white border border-amber-300 shadow-2xs space-y-1">
              <div className="flex items-center gap-2">
                <div className={`w-5 h-5 rounded-md bg-gradient-to-tr ${materialsData[activeMaterial].color} border ${materialsData[activeMaterial].border}`} />
                <span className="text-[9.5px] font-black text-amber-950">
                  {materialsData[activeMaterial].name}
                </span>
              </div>
              <p className="text-[8.5px] text-slate-700 font-bold">
                {materialsData[activeMaterial].tag}
              </p>
            </div>
          </div>

          {/* Floating 3D Inspection Badge */}
          <div
            className="absolute top-2 right-2 px-2.5 py-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[9px] font-black rounded-lg shadow-md border border-amber-400"
            style={{ transform: isExploded ? 'translateZ(105px)' : 'translateZ(40px)' }}
          >
            نشان اصالت سازه و متریال پیوندساخت
          </div>
        </div>

        {/* Hover Hint Overlay */}
        <div className="absolute bottom-3 left-3 text-[10px] text-slate-800 font-bold flex items-center gap-1.5 bg-white/90 px-3 py-1 rounded-xl border border-[#ded5c5] shadow-xs backdrop-blur-md">
          <Eye className="w-3.5 h-3.5 text-amber-600" />
          <span>جهت چرخش سه‌بعدی ماوس یا انگشت را حرکت دهید</span>
        </div>
      </div>

      {/* Dynamic Layer Info Card Based on Selected Material & Blueprint */}
      <div className="bg-[#fbf9f4] p-3.5 rounded-2xl border border-[#ded5c5] text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {activeLayer === 'materials' && (
          <div className="flex items-start gap-2.5 text-slate-800">
            <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-black text-slate-950 block">
                مشخصات متریال فعال: {materialsData[activeMaterial].name}
              </span>
              <span className="text-[11px] text-slate-600 block mt-0.5">
                {materialsData[activeMaterial].tag} • دانسیته: {materialsData[activeMaterial].density} • ثبت در فاکتورهای رسمی پروژه
              </span>
            </div>
          </div>
        )}
        {activeLayer === 'blueprint' && (
          <div className="flex items-start gap-2.5 text-slate-800">
            <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-black text-slate-950 block">نقشه معماری و مشخصات ابعاد پلان تفکیکی</span>
              <span className="text-[11px] text-slate-600 block mt-0.5">
                مساحت مفید {toPersianDigits(area)} متر مربع، پلان کاملاً تفکیکی با سالن پرده‌خور، آشپزخانه مشرف به بالکن و {toPersianDigits(rooms)} خواب با نور مستقیم جنوب.
              </span>
            </div>
          </div>
        )}
        {activeLayer === 'structure' && (
          <div className="flex items-start gap-2.5 text-slate-800">
            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-black text-slate-950 block">آنالیز استحکام سازه و فونداسیون مهندسی</span>
              <span className="text-[11px] text-slate-600 block mt-0.5">
                اسکلت بتن مسلح با نظارت نظام مهندسی، سقف وافل ضد زلزله بر مبنای استاندارد ۲۸۰۰ و عایق‌های دوجداره حرارتی/برودتی.
              </span>
            </div>
          </div>
        )}
        {activeLayer === 'architecture' && (
          <div className="flex items-start gap-2.5 text-slate-800">
            <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-black text-slate-950 block">پارتیشن‌بندی و چیدمان فضایی</span>
              <span className="text-[11px] text-slate-600 block mt-0.5">
                تفکیک دقیق عرصه عمومی و خصوصی، لاندری روم، کلوزت روم و بالکن تجهیز شده با باربیکیو.
              </span>
            </div>
          </div>
        )}
        {activeLayer === 'legal' && (
          <div className="flex items-start gap-2.5 text-slate-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-black text-slate-950 block">اصالت سند رسمی و شناسه تصدیق ثبتی</span>
              <span className="text-[11px] text-slate-600 block mt-0.5">
                استعلام برخط سامانه ثبت اسناد و املاک کشور، بدون هرگونه بدهی شهرداری، بازداشتی یا معارض ملکی.
              </span>
            </div>
          </div>
        )}

        <div className="shrink-0 flex items-center gap-1.5 self-end sm:self-auto">
          <span className="text-[10px] bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-1 rounded-lg font-black">
            تأییدیه مهندسی پیوند
          </span>
        </div>
      </div>
    </div>
  );
};

