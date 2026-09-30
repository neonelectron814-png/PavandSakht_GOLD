import React, { useState } from 'react';
import { 
  BuildingWebGLCanvas, 
  BuildingConfig 
} from '../3d/BuildingWebGLCanvas';
import { 
  Layers, 
  ShieldCheck, 
  Zap, 
  Sparkles, 
  Building2, 
  CheckCircle2, 
  Box, 
  Compass, 
  Palette, 
  Sun, 
  Moon, 
  Sunset, 
  RotateCw,
  Eye,
  SlidersHorizontal,
  FileCheck
} from 'lucide-react';
import { toPersianDigits, formatTomanShort } from '../../utils/formatters';

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
  // Infer sensible building configuration based on property properties
  const isVilla = propertyTitle.includes('ویلا') || propertyTitle.includes('باغ');
  const isTower = propertyTitle.includes('برج') || propertyTitle.includes('پنت');
  const initialFloors = isTower ? 8 : isVilla ? 3 : Math.min(6, Math.max(2, Math.ceil(rooms / 1.5)));

  const [buildingConfig, setBuildingConfig] = useState<BuildingConfig>({
    buildingType: isTower ? 'tower' : isVilla ? 'villa' : 'residential',
    floorsCount: initialFloors,
    floorArea: area || 180,
    facadeMaterial: 'travertine',
    structureType: 'concrete_ductile',
    lightingMode: 'day',
    isExploded: false,
    isWireframe: false,
    showFoundation: true,
    showRoofGarden: true,
  });

  const handleConfigChange = (newConfig: Partial<BuildingConfig>) => {
    setBuildingConfig((prev) => ({ ...prev, ...newConfig }));
  };

  const facadeMaterials: {
    id: BuildingConfig['facadeMaterial'];
    label: string;
    desc: string;
    color: string;
  }[] = [
    { id: 'travertine', label: 'تراورتن عباس‌آباد', desc: 'سنگ سوپر صادراتی با عایق حرارتی', color: 'from-amber-200 to-amber-300' },
    { id: 'brick_wood', label: 'آجر نسوز + ترمووود', desc: 'تلفیق مدرن چوب فنلاندی و آجر انگلیسی', color: 'from-orange-800 to-amber-900' },
    { id: 'curtain_wall', label: 'کرتین‌وال شیشه‌ای Low-E', desc: 'شیشه دوجداره سکوریت گاز آرگون', color: 'from-sky-300 to-blue-500' },
    { id: 'classic_stone', label: 'سنگ کلاسیک رومی', desc: 'مرمر سفید با ابزار و کتیبه‌های مهندسی', color: 'from-slate-100 to-amber-100' },
    { id: 'exposed_concrete', label: 'بتن اکسپوز مدرن', desc: 'معماری مینیمال با مقاومت کششی بالا', color: 'from-slate-300 to-slate-500' },
  ];

  return (
    <div className="bg-white rounded-[28px] p-5 sm:p-6 border-2 border-[#dfc282] shadow-[0_4px_16px_rgba(180,130,40,0.1)] space-y-5 overflow-hidden relative">
      
      {/* Top Header & Live Mode Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#eee7db] pb-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="inline-flex items-center gap-1.5 btn-3d-gold text-[#2c1b04] px-3 py-1 rounded-xl text-xs font-black shadow-2xs">
              <Box className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>مدل تعاملی سه‌بعدی (Three.js WebGL)</span>
            </span>
            <span className="font-mono text-xs font-black bg-slate-950 text-amber-300 px-3 py-1 rounded-xl shadow-xs">
              کد: {propertyCode}
            </span>
            <span className="bg-emerald-700 text-white text-xs px-2.5 py-1 rounded-xl font-black flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-white" />
              <span>مطابق با پروانه ثبتی</span>
            </span>
          </div>

          <h3 className="font-black text-base sm:text-lg text-slate-950">
            نمای هوشمند سه‌بعدی، لایه‌بندی سازه و متریال اختصاصی ملک
          </h3>
          <p className="text-xs sm:text-[13px] text-slate-600 font-bold mt-0.5">
            با حرکت ماوس یا لمس صفحه مدل را ۳۶۰ درجه بچرخانید، نورپردازی را تغییر دهید یا سازه را منفصل (Exploded) نمایید.
          </p>
        </div>

        {/* Studio Link Button */}
        {onOpenStudio && (
          <button
            onClick={onOpenStudio}
            className="h-10 px-4 rounded-xl btn-3d-gold text-[#2c1b04] font-black text-xs sm:text-[13.5px] flex items-center justify-center gap-2 shadow-2xs active:scale-95 transition-transform cursor-pointer shrink-0"
          >
            <Sparkles className="w-4 h-4 text-[#2c1b04] stroke-[2.5]" />
            <span>ورود به استودیو کامل طراحی سه‌بعدی</span>
          </button>
        )}
      </div>

      {/* Interactive Controls Bar Above 3D Model */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#faf8f4] p-3 rounded-2xl border-2 border-[#dfc282]">
        
        {/* Lighting Mode Selector */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-slate-700 font-black ml-1 hidden sm:inline">نورپردازی:</span>
          <button
            onClick={() => handleConfigChange({ lightingMode: 'day' })}
            className={`h-8 px-2.5 rounded-xl text-xs font-black flex items-center gap-1 transition-all cursor-pointer ${
              buildingConfig.lightingMode === 'day'
                ? 'btn-3d-gold text-[#2c1b04] shadow-2xs'
                : 'bg-white text-slate-700 hover:bg-amber-50 border border-[#dfc282]'
            }`}
          >
            <Sun className="w-3.5 h-3.5 text-amber-600" />
            <span>روز</span>
          </button>
          <button
            onClick={() => handleConfigChange({ lightingMode: 'sunset' })}
            className={`h-8 px-2.5 rounded-xl text-xs font-black flex items-center gap-1 transition-all cursor-pointer ${
              buildingConfig.lightingMode === 'sunset'
                ? 'btn-3d-gold text-[#2c1b04] shadow-2xs'
                : 'bg-white text-slate-700 hover:bg-amber-50 border border-[#dfc282]'
            }`}
          >
            <Sunset className="w-3.5 h-3.5 text-orange-600" />
            <span>غروب</span>
          </button>
          <button
            onClick={() => handleConfigChange({ lightingMode: 'night' })}
            className={`h-8 px-2.5 rounded-xl text-xs font-black flex items-center gap-1 transition-all cursor-pointer ${
              buildingConfig.lightingMode === 'night'
                ? 'btn-3d-gold text-[#2c1b04] shadow-2xs'
                : 'bg-white text-slate-700 hover:bg-amber-50 border border-[#dfc282]'
            }`}
          >
            <Moon className="w-3.5 h-3.5 text-indigo-600" />
            <span>شب</span>
          </button>
        </div>

        {/* View Mode Switches: Exploded, Wireframe */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleConfigChange({ isExploded: !buildingConfig.isExploded })}
            className={`h-8 px-3 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
              buildingConfig.isExploded
                ? 'btn-3d-gold text-[#2c1b04] shadow-2xs'
                : 'bg-white text-slate-800 hover:bg-amber-50 border border-[#dfc282]'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-amber-800" />
            <span>{buildingConfig.isExploded ? 'دید انفجاری فعال' : 'دید انفجاری لایه‌ها'}</span>
          </button>

          <button
            onClick={() => handleConfigChange({ isWireframe: !buildingConfig.isWireframe })}
            className={`h-8 px-3 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
              buildingConfig.isWireframe
                ? 'btn-3d-gold text-[#2c1b04] shadow-2xs'
                : 'bg-white text-slate-800 hover:bg-amber-50 border border-[#dfc282]'
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-amber-800" />
            <span>{buildingConfig.isWireframe ? 'حالت اسکلت فلزی' : 'اسکلت و نقشه مهندسی'}</span>
          </button>
        </div>
      </div>

      {/* 3D WebGL Canvas Main Viewer Container */}
      <div className="h-[420px] sm:h-[480px] w-full rounded-2xl overflow-hidden border-2 border-[#dfc282] shadow-inner relative bg-slate-950">
        <BuildingWebGLCanvas 
          config={buildingConfig} 
          onConfigChange={handleConfigChange} 
        />
      </div>

      {/* Real-time Material Swap Carousel */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs sm:text-[13px] font-black text-slate-900 flex items-center gap-1.5">
            <Palette className="w-4 h-4 text-amber-800" />
            <span>تغییر بلادرنگ متریال و بافت نمای ساختمان:</span>
          </span>
          <span className="text-[11px] text-slate-500 font-bold">
            رندر آنی با هوش مصنوعی و شیدر فیزیکی
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {facadeMaterials.map((mat) => {
            const isSelected = buildingConfig.facadeMaterial === mat.id;
            return (
              <button
                key={mat.id}
                onClick={() => handleConfigChange({ facadeMaterial: mat.id })}
                className={`p-2.5 rounded-2xl text-right transition-all border-2 cursor-pointer flex flex-col justify-between gap-1.5 ${
                  isSelected
                    ? 'btn-3d-gold text-[#2c1b04] border-[#caa758] shadow-md scale-[1.02]'
                    : 'bg-[#faf8f4] hover:bg-amber-50/60 text-slate-800 border-[#dfc282]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black">{mat.label}</span>
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#2c1b04]" />}
                </div>
                <p className={`text-[10px] leading-tight ${isSelected ? 'text-amber-950 font-bold' : 'text-slate-500'}`}>
                  {mat.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Engineering & Material Specs Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        <div className="p-3.5 bg-[#faf8f4] rounded-2xl border-2 border-[#dfc282] space-y-1">
          <span className="text-[11px] text-slate-600 font-bold block">زیربنا و تعداد طبقات:</span>
          <span className="text-sm font-black text-slate-950">
            {toPersianDigits(buildingConfig.floorsCount)} طبقه • {toPersianDigits(buildingConfig.floorArea)} مترمربع
          </span>
        </div>

        <div className="p-3.5 bg-[#faf8f4] rounded-2xl border-2 border-[#dfc282] space-y-1">
          <span className="text-[11px] text-slate-600 font-bold block">نوع سازه و فونداسیون:</span>
          <span className="text-sm font-black text-emerald-950 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-emerald-700" />
            <span>بتن آرمه داکتیل مقاوم در برابر زلزله</span>
          </span>
        </div>

        <div className="p-3.5 bg-[#faf8f4] rounded-2xl border-2 border-[#dfc282] space-y-1">
          <span className="text-[11px] text-slate-600 font-bold block">عایق‌بندی و استاندارد مصرف:</span>
          <span className="text-sm font-black text-amber-950 flex items-center gap-1">
            <FileCheck className="w-3.5 h-3.5 text-amber-700" />
            <span>رعایت کامل مبحث ۱۹ مقررات ملی ساختمان</span>
          </span>
        </div>
      </div>

    </div>
  );
};
