import React, { useState } from 'react';
import { Layers, ShieldCheck, Zap, Eye, RotateCw, Sparkles, Building, CheckCircle2, Box } from 'lucide-react';
import { toPersianDigits } from '../../utils/formatters';

interface Property3DViewerProps {
  propertyTitle: string;
  propertyCode: string;
  verifiedStatus?: string;
  area: number;
  rooms: number;
  year: number;
}

export const Property3DViewer: React.FC<Property3DViewerProps> = ({
  propertyTitle,
  propertyCode,
  verifiedStatus = 'verified',
  area,
  rooms,
  year,
}) => {
  const [activeLayer, setActiveLayer] = useState<'architecture' | 'structure' | 'legal'>('architecture');
  const [rotateX, setRotateX] = useState<number>(20);
  const [rotateY, setRotateY] = useState<number>(-25);
  const [isExploded, setIsExploded] = useState<boolean>(false);

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
    <div className="relative glass-card rounded-3xl p-5 border border-white/30 dark:border-slate-700/50 shadow-glass-3d overflow-hidden space-y-4">
      {/* Background Glows for Glass refraction */}
      <div className="absolute -top-12 -left-12 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Bar */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/20 dark:border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
              <Box className="w-3 h-3" />
              <span>نمای تعاملی ۳ بعدی هوشمند (3D Layer Inspector)</span>
            </span>
            <span className="font-mono text-[10px] bg-slate-900/80 text-white px-2 py-0.5 rounded-md backdrop-blur-md">
              {propertyCode}
            </span>
          </div>
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mt-1">
            بررسی چندلایه‌ای ساختار و اصالت ثبتی ملک
          </h3>
        </div>

        {/* 3D Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExploded(!isExploded)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm ${
              isExploded
                ? 'bg-amber-500 text-slate-950 shadow-amber-500/30 scale-105'
                : 'bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 border border-white/30 dark:border-slate-700'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{isExploded ? 'نمای یکپارچه' : 'تفکیک لایه‌ای ۳ بعدی'}</span>
          </button>

          <button
            onClick={() => {
              setRotateX(20);
              setRotateY(-25);
            }}
            className="p-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-white/30 dark:border-slate-700 hover:text-amber-500 transition-colors"
            title="بازنشانی زاویه دید"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Layer Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar relative z-10">
        <button
          onClick={() => setActiveLayer('architecture')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
            activeLayer === 'architecture'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white/60 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-white/90'
          }`}
        >
          <Building className="w-3.5 h-3.5 text-amber-400" />
          <span>لایه معماری و پلان</span>
        </button>

        <button
          onClick={() => setActiveLayer('structure')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
            activeLayer === 'structure'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white/60 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-white/90'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-blue-400" />
          <span>لایه سازه و مصالح مصرفی</span>
        </button>

        <button
          onClick={() => setActiveLayer('legal')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
            activeLayer === 'legal'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white/60 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-white/90'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>لایه اسناد حقوقی و ثبت</span>
        </button>
      </div>

      {/* 3D Interactive Stage Canvas */}
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative h-64 sm:h-72 w-full rounded-2xl bg-gradient-to-b from-slate-950/90 via-slate-900/95 to-slate-950/90 border border-slate-800 overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
        style={{ perspective: '1200px' }}
      >
        {/* Ambient Grid Floor */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(rgba(245, 158, 11, 0.4) 1px, transparent 1px), radial-gradient(rgba(16, 185, 129, 0.3) 1px, transparent 1px)',
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
            width: '240px',
            height: '240px',
          }}
        >
          {/* Layer 1: Base Foundation (Legal / Title Deed Base) */}
          <div
            className={`absolute inset-0 rounded-2xl transition-all duration-500 border flex flex-col justify-between p-4 ${
              activeLayer === 'legal'
                ? 'bg-emerald-500/25 border-emerald-400/80 shadow-[0_0_30px_rgba(16,185,129,0.4)]'
                : 'bg-emerald-950/40 border-emerald-600/40'
            }`}
            style={{
              transform: isExploded ? 'translateZ(-70px)' : 'translateZ(-20px)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <div className="flex items-center justify-between text-emerald-400">
              <span className="text-[10px] font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                لایه ۱: استعلام ثبتی شش‌دانگ
              </span>
              <span className="text-[9px] bg-emerald-500/30 px-1.5 py-0.5 rounded font-mono font-bold">۱۰۰٪ معتبر</span>
            </div>
            
            <div className="text-[10px] text-emerald-200/80 space-y-1">
              <p>• عدم بازداشتی و رهن بانکی</p>
              <p>• تأیید کاداستر رسمی</p>
            </div>
          </div>

          {/* Layer 2: Structural & MEP Layer */}
          <div
            className={`absolute inset-0 rounded-2xl transition-all duration-500 border flex flex-col justify-between p-4 ${
              activeLayer === 'structure'
                ? 'bg-blue-500/25 border-blue-400/80 shadow-[0_0_30px_rgba(59,130,246,0.4)]'
                : 'bg-slate-900/60 border-blue-500/30'
            }`}
            style={{
              transform: isExploded ? 'translateZ(0px)' : 'translateZ(0px)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <div className="flex items-center justify-between text-blue-400">
              <span className="text-[10px] font-bold flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" />
                لایه ۲: سازه، بتن و اسکلت
              </span>
              <span className="text-[9px] bg-blue-500/30 px-1.5 py-0.5 rounded font-mono font-bold">آیین‌نامه ۲۸۰۰</span>
            </div>

            <div className="grid grid-cols-2 gap-1 text-[9px] text-blue-200/80">
              <div className="bg-blue-950/60 p-1 rounded">میلگرد اصفهان A3</div>
              <div className="bg-blue-950/60 p-1 rounded">بتن C30 استاندارد</div>
            </div>
          </div>

          {/* Layer 3: Architectural & Interior Finish Layer */}
          <div
            className={`absolute inset-0 rounded-2xl transition-all duration-500 border flex flex-col justify-between p-4 ${
              activeLayer === 'architecture'
                ? 'bg-amber-500/25 border-amber-400/80 shadow-[0_0_30px_rgba(245,158,11,0.4)]'
                : 'bg-amber-950/30 border-amber-500/30'
            }`}
            style={{
              transform: isExploded ? 'translateZ(70px)' : 'translateZ(20px)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <div className="flex items-center justify-between text-amber-400">
              <span className="text-[10px] font-bold flex items-center gap-1">
                <Building className="w-3.5 h-3.5" />
                لایه ۳: معماری، متراژ و پلان
              </span>
              <span className="text-[9px] bg-amber-500/30 px-1.5 py-0.5 rounded font-mono font-bold">
                {toPersianDigits(area)} م‌م
              </span>
            </div>

            {/* Simulated 3D Room Grid */}
            <div className="grid grid-cols-2 gap-1.5">
              <div className="h-10 bg-amber-400/20 rounded-lg border border-amber-400/40 flex items-center justify-center text-[9px] text-amber-200 font-bold">
                پذیرایی غرق نور
              </div>
              <div className="h-10 bg-amber-400/10 rounded-lg border border-amber-400/20 flex items-center justify-center text-[9px] text-amber-200">
                {toPersianDigits(rooms)} خواب مستر
              </div>
            </div>
          </div>

          {/* Floating 3D Inspection Pins */}
          <div
            className="absolute top-2 right-2 px-2 py-1 bg-amber-500 text-slate-950 text-[9px] font-black rounded-lg shadow-lg"
            style={{ transform: isExploded ? 'translateZ(90px)' : 'translateZ(35px)' }}
          >
            نشان اصالت آکان
          </div>
        </div>

        {/* Hover Hint Overlay */}
        <div className="absolute bottom-3 left-3 text-[10px] text-slate-400 flex items-center gap-1.5 bg-slate-950/80 px-2.5 py-1 rounded-xl border border-slate-800 backdrop-blur-md">
          <Eye className="w-3 h-3 text-amber-400" />
          <span>ماوس یا لمس را برای چرخش زاویه ۳ بعدی حرکت دهید</span>
        </div>
      </div>

      {/* Dynamic Layer Info Card */}
      <div className="bg-white/80 dark:bg-slate-900/80 p-3.5 rounded-2xl border border-white/40 dark:border-slate-800 text-xs flex items-center justify-between gap-3">
        {activeLayer === 'architecture' && (
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
            <span>پلان تفکیکی با متراژ {toPersianDigits(area)} متر، سال ساخت {toPersianDigits(year)} و نورگیر مستقیم جنوبی.</span>
          </div>
        )}
        {activeLayer === 'structure' && (
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
            <span>استحکام سازه منطبق بر آیین‌نامه ۲۸۰۰ با اسکلت بتن آرمه و عایق‌های صوتی دوجداره.</span>
          </div>
        )}
        {activeLayer === 'legal' && (
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>سند رسمی تک‌برگ با استعلام الکترونیک شناسه یکتا ثبتی و عدم وجود هرگونه منع قانونی.</span>
          </div>
        )}
      </div>

    </div>
  );
};
