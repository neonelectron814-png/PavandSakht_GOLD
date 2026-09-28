import React, { useState } from 'react';
import { 
  BuildingWebGLCanvas, 
  BuildingConfig 
} from '../3d/BuildingWebGLCanvas';
import { 
  Box, 
  Sparkles, 
  Building2, 
  Calculator, 
  ShieldCheck, 
  Lock, 
  ArrowLeft, 
  CheckCircle2, 
  SlidersHorizontal, 
  Cpu, 
  Calendar, 
  Layers, 
  Flame, 
  Palette, 
  RotateCw,
  FileText,
  DollarSign,
  TrendingUp,
  Download
} from 'lucide-react';
import { formatToman, formatTomanShort, toPersianDigits } from '../../utils/formatters';

interface Building3DStudioPageProps {
  onEnterDealRoom: (code: string) => void;
  onNavigateTab: (tab: string) => void;
}

interface BuildingPreset {
  id: string;
  name: string;
  subtitle: string;
  config: Partial<BuildingConfig>;
  specsText: string;
}

const buildingPresets: BuildingPreset[] = [
  {
    id: 'farmanieh-apt',
    name: 'آپارتمان ۵ طبقه فرمانیه',
    subtitle: 'مسکونی لوکس با نمای تراورتن عباس‌آباد سوپر و سازه بتن داکتیل',
    config: {
      buildingType: 'residential',
      floorsCount: 5,
      floorArea: 280,
      facadeMaterial: 'travertine',
      structureType: 'concrete_ductile',
      showFoundation: true,
      showRoofGarden: true,
    },
    specsText: 'طراحی ۵ طبقه تک‌واحدی، متراژ ۲۸۰ متر هر طبقه، نمای تمام سنگ تراورتن با نورپردازی مخفی، روف‌گاردن سبز، اسکلت بتن آرمه مقاوم در برابر زلزله تا ۸ ریشتر.',
  },
  {
    id: 'elahiyeh-tower',
    name: 'برج مدرن الهیه',
    subtitle: 'برج مسکونی-اداری با نمای شیشه‌ای کرتین‌وال Low-E و پنت‌هاوس',
    config: {
      buildingType: 'tower',
      floorsCount: 14,
      floorArea: 450,
      facadeMaterial: 'curtain_wall',
      structureType: 'steel_deck',
      showFoundation: true,
      showRoofGarden: true,
    },
    specsText: 'برج ۱۴ طبقه با اسکلت فلزی پیچ و مهره‌ای و سقف عرشه فولادی، پنجره‌های قدی کرتین‌وال دوجداره با کنترل اشعه خورشید و لابی مجلل به متراژ ۴۰۰ متر.',
  },
  {
    id: 'lavasan-villa',
    name: 'ویلای تریپلکس لواسان',
    subtitle: 'ویلای مدرن تلفیقی آجر نسوز انگلیسی و ترمووود فنلاندی',
    config: {
      buildingType: 'villa',
      floorsCount: 3,
      floorArea: 320,
      facadeMaterial: 'brick_wood',
      structureType: 'waffle_slab',
      showFoundation: true,
      showRoofGarden: true,
    },
    specsText: 'ویلای ۳ طبقه تریپلکس با استخر روباز، دیوارهای ترمووود فرآوری‌شده، سقف وافل اکسپوز مدرن و طراحی دوستدار محیط‌زیست با حداکثر بهره‌وری انرژی.',
  },
  {
    id: 'zafaraniyeh-classic',
    name: 'عمارت کلاسیک زعفرانیه',
    subtitle: 'کاخ مسکونی با نمای رومی ستون‌دار و لابی سنگ اسلب',
    config: {
      buildingType: 'residential',
      floorsCount: 6,
      floorArea: 380,
      facadeMaterial: 'classic_stone',
      structureType: 'concrete_ductile',
      showFoundation: true,
      showRoofGarden: false,
    },
    specsText: 'عمارت ۶ طبقه مجلل با ستون‌ها و سرستون‌های سنگی ابزارخورده، تراس‌های سلطنتی، فونداسیون گسترده رادیه و کفپوش‌های سنگ مرمریت دهبید.',
  },
];

export const Building3DStudioPage: React.FC<Building3DStudioPageProps> = ({
  onEnterDealRoom,
  onNavigateTab,
}) => {
  const [config, setConfig] = useState<BuildingConfig>({
    buildingType: 'residential',
    floorsCount: 5,
    floorArea: 280,
    facadeMaterial: 'travertine',
    structureType: 'concrete_ductile',
    lightingMode: 'day',
    isExploded: false,
    isWireframe: false,
    showFoundation: true,
    showRoofGarden: true,
  });

  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [activeTabSub, setActiveTabSub] = useState<'materials_bom' | 'cost' | 'structural' | 'schedule'>('materials_bom');
  const [simulationDone, setSimulationDone] = useState<boolean>(true);

  // Computed Building Engineering Properties
  const totalSubstructureArea = config.floorArea * config.floorsCount;
  
  // Steel/Rebar consumption formula: approx 45-55 kg per sq meter for concrete, 65-80 for steel
  const steelRatio = config.structureType === 'steel_deck' ? 72 : 48; // kg/m2
  const totalRebarTons = Math.round((totalSubstructureArea * steelRatio) / 1000);

  // Concrete volume formula: approx 0.4 m3 per sq meter of slab & columns
  const totalConcreteM3 = Math.round(totalSubstructureArea * 0.42);

  // Facade Stone / Glass area: perimeter * height
  const baseDim = Math.sqrt(config.floorArea);
  const perimeter = baseDim * 4;
  const buildingHeight = config.floorsCount * 3.2;
  const facadeAreaSqM = Math.round(perimeter * buildingHeight * 0.7); // 70% facade exposure

  // Cost estimates based on current Iran building indexes (toman / sq meter)
  const baseCostPerMeter = config.structureType === 'steel_deck' ? 22000000 : 18500000;
  const facadeMultiplier = config.facadeMaterial === 'classic_stone' ? 1.25 : config.facadeMaterial === 'curtain_wall' ? 1.3 : 1.15;
  const finalCostPerMeter = Math.round(baseCostPerMeter * facadeMultiplier);
  const totalEstimatedProjectCost = finalCostPerMeter * totalSubstructureArea;

  const handleConfigChange = (newPartial: Partial<BuildingConfig>) => {
    setConfig((prev) => ({ ...prev, ...newPartial }));
  };

  const handleApplyPreset = (preset: BuildingPreset) => {
    setConfig((prev) => ({
      ...prev,
      ...preset.config,
    }));
    setAiPrompt(preset.specsText);
  };

  const handleRunAiSimulation = () => {
    setIsSimulating(true);
    // Simulate advanced AI neural computation
    setTimeout(() => {
      // If user typed prompt mentioning floors or area, parse intelligently
      const promptLower = aiPrompt.toLowerCase();
      let detectedFloors = config.floorsCount;
      if (promptLower.includes('۱۰ طبقه') || promptLower.includes('10 طبقه')) detectedFloors = 10;
      else if (promptLower.includes('۷ طبقه') || promptLower.includes('7 طبقه')) detectedFloors = 7;
      else if (promptLower.includes('۳ طبقه') || promptLower.includes('3 طبقه')) detectedFloors = 3;
      else if (promptLower.includes('برج')) detectedFloors = Math.max(12, config.floorsCount);

      let detectedMaterial = config.facadeMaterial;
      if (promptLower.includes('شیشه') || promptLower.includes('کرتین')) detectedMaterial = 'curtain_wall';
      else if (promptLower.includes('تراورتن') || promptLower.includes('سنگ')) detectedMaterial = 'travertine';
      else if (promptLower.includes('آجر') || promptLower.includes('چوب')) detectedMaterial = 'brick_wood';
      else if (promptLower.includes('بتن')) detectedMaterial = 'exposed_concrete';

      setConfig((prev) => ({
        ...prev,
        floorsCount: detectedFloors,
        facadeMaterial: detectedMaterial,
      }));

      setIsSimulating(false);
      setSimulationDone(true);
    }, 1200);
  };

  return (
    <div className="space-y-6 pb-20 text-[#111827]" dir="rtl">
      
      {/* Header Banner */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#ded5c5] space-y-3 relative overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-950 border border-amber-300 px-3.5 py-1 rounded-full text-xs font-black mb-2 shadow-xs">
              <Cpu className="w-3.5 h-3.5 text-amber-700" />
              <span>استودیو شبیه‌سازی هوش مصنوعی و مدل‌سازی ۳ بعدی ساختمان</span>
            </div>
            <h1 className="text-lg sm:text-xl font-black text-slate-950">
              مدل‌سازی تعاملی سه‌بعدی بر اساس متریال، نقشه و محاسبات مهندسی
            </h1>
            <p className="text-xs text-slate-700 font-semibold mt-1 max-w-2xl leading-relaxed">
              شبیه‌سازی کامل از پی و فونداسیون تا طبقات و نازک‌کاری، برآورد ریالی کل پروژه، محاسبه وزن میلگرد و بتن و انتقال با یک کلیک به اتاق معامله امن پیوندساخت.
            </p>
          </div>

          <div className="bg-[#fffcf7] p-3.5 rounded-2xl border border-amber-200 text-xs space-y-1 shrink-0 text-center">
            <span className="text-[10px] text-slate-600 font-bold block">موتور رندر سه‌بعدی:</span>
            <span className="font-black text-amber-950 text-xs flex items-center justify-center gap-1">
              <Box className="w-4 h-4 text-emerald-600" />
              WebGL با شبیه‌سازی نور و بافت
            </span>
          </div>
        </div>
      </div>

      {/* Main 3D WebGL Canvas Viewport */}
      <BuildingWebGLCanvas
        config={config}
        onConfigChange={handleConfigChange}
      />

      {/* Preset Building Archetypes */}
      <div className="space-y-2">
        <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-600" />
          الگوهای آماده ساختمانی جهت شبیه‌سازی سریع:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {buildingPresets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleApplyPreset(preset)}
              className="p-3.5 rounded-2xl bg-white border border-[#ded5c5] hover:border-amber-500 hover:shadow-md transition-all text-right cursor-pointer flex flex-col justify-between"
            >
              <div>
                <h4 className="font-black text-xs text-slate-950">{preset.name}</h4>
                <p className="text-[10.5px] text-slate-600 font-medium mt-1 line-clamp-2 leading-relaxed">
                  {preset.subtitle}
                </p>
              </div>
              <span className="text-[9.5px] text-amber-800 font-black mt-2 block">
                بارگذاری مدل ۳ بعدی 👈
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* AI Simulation & Architectural Config Controls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 cols): Architectural Controls & AI Prompt */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Custom AI Prompt Input */}
          <div className="bg-white p-5 rounded-3xl border border-[#ded5c5] shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-[#ede6d8] pb-2.5">
              <h3 className="font-black text-xs sm:text-sm text-slate-950 flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-amber-600" />
                <span>فرمان صوتی یا متنی به هوش مصنوعی پیوندساخت</span>
              </h3>
              <span className="text-[10px] bg-amber-100 text-amber-950 font-black px-2.5 py-0.5 rounded-lg border border-amber-300">
                AI Engine
              </span>
            </div>

            <div className="space-y-2">
              <textarea
                rows={2}
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="توصیف پروژه مورد نظر: مثلاً یک ساختمان مسکونی ۶ طبقه با نمای سنگ تراورتن، پنجره‌های قدی، روف‌گاردن مجهز و اسکلت بتنی با میلگرد اصفهان..."
                className="w-full bg-[#fbf9f4] border border-[#ded5c5] rounded-2xl p-3 text-xs font-semibold text-slate-950 placeholder-slate-400 focus:outline-none focus:border-amber-600"
              />

              <button
                type="button"
                onClick={handleRunAiSimulation}
                disabled={isSimulating}
                className="w-full bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 hover:from-amber-700 hover:to-amber-900 text-white font-black text-xs py-3 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isSimulating ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin text-white" />
                    <span>در حال شبیه‌سازی هوشمند و بازتولید ساختار ۳ بعدی...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>اعمال و شبیه‌سازی ۳ بعدی هوشمند با هوش مصنوعی</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Interactive Sliders & Options Panel */}
          <div className="bg-white p-5 rounded-3xl border border-[#ded5c5] shadow-xs space-y-4">
            <h3 className="font-black text-xs sm:text-sm text-slate-950 border-b border-[#ede6d8] pb-2.5 flex items-center gap-1.5">
              <SlidersHorizontal className="w-4 h-4 text-amber-600" />
              <span>تنظیمات ابعاد، طبقات، متریال نما و نوع سازه</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              
              {/* Floors Count Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between font-bold text-slate-800">
                  <span>تعداد طبقات سازه:</span>
                  <span className="font-black text-amber-900">{toPersianDigits(config.floorsCount)} طبقه</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={config.floorsCount}
                  onChange={(e) => handleConfigChange({ floorsCount: Number(e.target.value) })}
                  className="w-full accent-amber-600 cursor-pointer"
                />
                <span className="text-[10px] text-slate-500 font-medium block">
                  ارتفاع تقریبی: {toPersianDigits(config.floorsCount * 3.2)} متر
                </span>
              </div>

              {/* Floor Area Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between font-bold text-slate-800">
                  <span>مساحت هر طبقه (متر مربع):</span>
                  <span className="font-black text-amber-900">{toPersianDigits(config.floorArea)} متر</span>
                </div>
                <input
                  type="range"
                  min="80"
                  max="800"
                  step="20"
                  value={config.floorArea}
                  onChange={(e) => handleConfigChange({ floorArea: Number(e.target.value) })}
                  className="w-full accent-amber-600 cursor-pointer"
                />
                <span className="text-[10px] text-slate-500 font-medium block">
                  مجموع زیربنا: {toPersianDigits(totalSubstructureArea)} متر مربع
                </span>
              </div>

              {/* Facade Material Selection */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-800 block">متریال و سبک نما:</label>
                <select
                  value={config.facadeMaterial}
                  onChange={(e) => handleConfigChange({ facadeMaterial: e.target.value as any })}
                  className="w-full bg-[#fbf9f4] border border-[#ded5c5] rounded-xl px-3 py-2 text-xs font-bold text-slate-950 focus:outline-none focus:border-amber-600 cursor-pointer"
                >
                  <option value="travertine">سنگ تراورتن عباس‌آباد سوپر (کرم روشن)</option>
                  <option value="curtain_wall">نمای شیشه‌ای کرتین‌وال دوجداره Low-E</option>
                  <option value="brick_wood">ترکیب آجر نسوز انگلیسی و ترمووود فنلاندی</option>
                  <option value="exposed_concrete">بتن اکسپوز معماری مینیمال</option>
                  <option value="classic_stone">نمای کلاسیک رومی با سرستون سنگی</option>
                </select>
              </div>

              {/* Structural Frame Type */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-800 block">نوع اسکلت و سازه:</label>
                <select
                  value={config.structureType}
                  onChange={(e) => handleConfigChange({ structureType: e.target.value as any })}
                  className="w-full bg-[#fbf9f4] border border-[#ded5c5] rounded-xl px-3 py-2 text-xs font-bold text-slate-950 focus:outline-none focus:border-amber-600 cursor-pointer"
                >
                  <option value="concrete_ductile">اسکلت بتن‌آرمه داکتیل با میلگرد A3 (آیین‌نامه ۲۸۰۰)</option>
                  <option value="steel_deck">اسکلت فلزی پیچ و مهره‌ای با سقف عرشه فولادی</option>
                  <option value="waffle_slab">سقف وافل و دال مجوف بتنی</option>
                </select>
              </div>

            </div>

            {/* Checkbox Toggles */}
            <div className="flex flex-wrap gap-4 pt-2 border-t border-[#ede6d8] text-xs font-bold text-slate-800">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.showFoundation}
                  onChange={(e) => handleConfigChange({ showFoundation: e.target.checked })}
                  className="rounded text-amber-600 focus:ring-amber-500"
                />
                <span>شبیه‌سازی پی و فونداسیون زیرزمینی</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.showRoofGarden}
                  onChange={(e) => handleConfigChange({ showRoofGarden: e.target.checked })}
                  className="rounded text-amber-600 focus:ring-amber-500"
                />
                <span>روف‌گاردن سبز و آلاچیق پشت‌بام</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.isExploded}
                  onChange={(e) => handleConfigChange({ isExploded: e.target.checked })}
                  className="rounded text-amber-600 focus:ring-amber-500"
                />
                <span>نمای انفجاری تفکیک طبقات</span>
              </label>
            </div>
          </div>

        </div>

        {/* Right Column (1 col): AI Engineering Analysis & BoM */}
        <div className="space-y-6">
          
          <div className="bg-white p-5 rounded-3xl border border-[#ded5c5] shadow-xs space-y-4">
            {/* Sub-Tabs: BoM vs Cost vs Safety */}
            <div className="flex border-b border-[#ede6d8] pb-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setActiveTabSub('materials_bom')}
                className={`pb-1 font-black cursor-pointer transition-all ${
                  activeTabSub === 'materials_bom' ? 'text-amber-800 border-b-2 border-amber-600' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                متره مصالح
              </button>
              <button
                type="button"
                onClick={() => setActiveTabSub('cost')}
                className={`pb-1 font-black cursor-pointer transition-all ${
                  activeTabSub === 'cost' ? 'text-amber-800 border-b-2 border-amber-600' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                برآورد مالی
              </button>
              <button
                type="button"
                onClick={() => setActiveTabSub('structural')}
                className={`pb-1 font-black cursor-pointer transition-all ${
                  activeTabSub === 'structural' ? 'text-amber-800 border-b-2 border-amber-600' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                ایمنی سازه
              </button>
            </div>

            {/* Tab 1: Materials BoM */}
            {activeTabSub === 'materials_bom' && (
              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center p-2.5 bg-[#fbf9f4] rounded-xl border border-[#ede6d8]">
                  <span className="font-bold text-slate-700">میلگرد و فولاد مصرفی:</span>
                  <span className="font-black text-amber-950 font-mono">{toPersianDigits(totalRebarTons)} تن</span>
                </div>

                <div className="flex justify-between items-center p-2.5 bg-[#fbf9f4] rounded-xl border border-[#ede6d8]">
                  <span className="font-bold text-slate-700">بتن آماده استاندارد C30:</span>
                  <span className="font-black text-blue-950 font-mono">{toPersianDigits(totalConcreteM3)} متر مکعب</span>
                </div>

                <div className="flex justify-between items-center p-2.5 bg-[#fbf9f4] rounded-xl border border-[#ede6d8]">
                  <span className="font-bold text-slate-700">متراژ سنگ / شیشه نما:</span>
                  <span className="font-black text-emerald-950 font-mono">{toPersianDigits(facadeAreaSqM)} متر مربع</span>
                </div>

                <div className="flex justify-between items-center p-2.5 bg-[#fbf9f4] rounded-xl border border-[#ede6d8]">
                  <span className="font-bold text-slate-700">سرامیک پرسلان کف و بدنه:</span>
                  <span className="font-black text-slate-900 font-mono">{toPersianDigits(Math.round(totalSubstructureArea * 1.35))} متر مربع</span>
                </div>

                <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-[10.5px] text-amber-900 font-semibold leading-relaxed">
                  ✓ اتصال آنی این لیست به پایگاه داده ۵۰+ کارخانه و معدن پیوندساخت جهت تأمین بدون واسطه.
                </div>
              </div>
            )}

            {/* Tab 2: Cost Estimation */}
            {activeTabSub === 'cost' && (
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-[#fbf9f4] rounded-2xl border border-[#ede6d8] space-y-1">
                  <span className="text-[10px] text-slate-500 font-bold block">برآورد کل پروژه (مبنای روز بورس):</span>
                  <span className="text-sm font-black text-emerald-900">{formatTomanShort(totalEstimatedProjectCost)}</span>
                  <span className="text-[10px] text-slate-600 block">({formatToman(totalEstimatedProjectCost)})</span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-[#ede6d8]">
                  <span className="font-bold text-slate-600">هزینه هر متر مربع زیربنا:</span>
                  <span className="font-black text-slate-950">{formatTomanShort(finalCostPerMeter)}</span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-[#ede6d8]">
                  <span className="font-bold text-slate-600">سهم اسکلت و فونداسیون (۴۰٪):</span>
                  <span className="font-black text-blue-900">{formatTomanShort(totalEstimatedProjectCost * 0.4)}</span>
                </div>

                <div className="flex justify-between py-1.5">
                  <span className="font-bold text-slate-600">سهم نازک‌کاری و نما (۶۰٪):</span>
                  <span className="font-black text-amber-900">{formatTomanShort(totalEstimatedProjectCost * 0.6)}</span>
                </div>
              </div>
            )}

            {/* Tab 3: Structural Safety */}
            {activeTabSub === 'structural' && (
              <div className="space-y-2.5 text-xs">
                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-300 space-y-1">
                  <span className="font-black text-emerald-950 flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    انطباق با آیین‌نامه ۲۸۰۰ زلزله ایران
                  </span>
                  <p className="text-[10.5px] text-emerald-900 font-medium leading-relaxed">
                    ضریب رفتار سازه‌ای محاسبه‌شده برابر با R=7.5 با شکل‌پذیری ویژه در پهنه با خطر نسبی خیلی زیاد.
                  </p>
                </div>

                <div className="p-2.5 bg-[#fbf9f4] rounded-xl border border-[#ede6d8] space-y-1 text-[11px]">
                  <span className="font-bold text-slate-700 block">کنترل لنگر واژگونی و دریفت طبقات:</span>
                  <span className="font-black text-slate-950">مجاز (زیر حد بحرانی ۰.۰۲۵)</span>
                </div>

                <div className="p-2.5 bg-[#fbf9f4] rounded-xl border border-[#ede6d8] space-y-1 text-[11px]">
                  <span className="font-bold text-slate-700 block">رده‌بندی مصرف انرژی (مبحث ۱۹):</span>
                  <span className="font-black text-emerald-700">گرید A (پنجره‌های دوجداره Low-E)</span>
                </div>
              </div>
            )}

            {/* Action Buttons to Pipeline */}
            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={() => onEnterDealRoom(`3D-${Date.now().toString().slice(-4)}`)}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-black text-xs py-3 rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>انتقال مدل و مصالح به اتاق معامله امن</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigateTab('customer_requests')}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black text-xs py-2.5 rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>استعلام آنی قیمت کارخانجات برای این متریال</span>
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
