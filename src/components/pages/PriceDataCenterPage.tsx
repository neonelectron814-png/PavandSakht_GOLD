import React, { useState, useEffect, useRef } from 'react';
import { TrendingUp, LineChart as LineChartIcon, Calculator, ArrowUpRight, Activity, BarChart3, Clock, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { PriceIndex } from '../../types';
import { mockPriceIndices } from '../../data/mockData';
import { formatToman, formatTomanShort, toPersianDigits } from '../../utils/formatters';

export type TimeFrameType = '1D' | '1W' | '1M' | '1Y';

interface ChartPoint {
  month: string;
  price: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  isGreen: boolean;
}

// =========================================================================
// STANDARD FINANCIAL CANDLESTICK CHART (TradingView Standard SVG with Spacious Margin)
// =========================================================================
interface CandlestickSvgChartProps {
  data: ChartPoint[];
  lastPrice: number;
  timeFrame: TimeFrameType;
}

const CandlestickSvgChart: React.FC<CandlestickSvgChartProps> = ({ data, lastPrice, timeFrame }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!data || data.length === 0) return null;

  const svgWidth = 920;
  const svgHeight = 360; // Taller, expansive canvas
  const padTop = 30;
  const padBottom = 52;
  const padLeft = 32;
  const padRight = 200; // 200px dedicated solely to the price axis
  const safetyBuffer = 65; // 65px extra clearance between rightmost candle and price axis

  const plotW = svgWidth - padLeft - padRight - safetyBuffer;
  const plotH = svgHeight - padTop - padBottom;

  const allLows = data.map((d) => d.low);
  const allHighs = data.map((d) => d.high);
  const minVal = Math.min(...allLows);
  const maxVal = Math.max(...allHighs);
  const valRange = maxVal - minVal || 1;

  // Add 12% headroom and footroom for comfortable breathing space
  const domainMin = minVal - valRange * 0.12;
  const domainMax = maxVal + valRange * 0.12;
  const domainRange = domainMax - domainMin;

  const getY = (val: number) => {
    const ratio = (val - domainMin) / domainRange;
    return padTop + plotH * (1 - ratio);
  };

  const candleCount = data.length;
  const step = plotW / candleCount;
  const candleW = Math.max(12, Math.min(24, step * 0.55)); // Prominent, bold candlestick bodies

  // 5 horizontal price gridlines
  const gridLevels = [0.12, 0.32, 0.52, 0.72, 0.90].map((ratio) => {
    const price = domainMin + domainRange * ratio;
    const y = getY(price);
    return { price, y };
  });

  const activeCandle =
    hoveredIndex !== null && data[hoveredIndex] ? data[hoveredIndex] : data[data.length - 1];
  const lastY = getY(lastPrice);

  return (
    <div className="w-full h-full flex flex-col justify-between relative select-none">
      {/* Top HUD Info Bar with clear spacing */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-[#faf8f4] border border-[#e8dfcf] rounded-2xl text-xs font-mono font-bold mb-3 shadow-2xs">
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <span className="text-slate-950 font-black font-sans px-2.5 py-1 bg-amber-100/80 rounded-lg border border-amber-300">
            {activeCandle.month}
          </span>
          <span className="text-slate-700">
            باز: <strong className="text-slate-950">{formatTomanShort(activeCandle.open)}</strong>
          </span>
          <span className="text-emerald-700">
            بالا: <strong className="text-emerald-800">{formatTomanShort(activeCandle.high)}</strong>
          </span>
          <span className="text-rose-700">
            پایین: <strong className="text-rose-800">{formatTomanShort(activeCandle.low)}</strong>
          </span>
          <span className={activeCandle.isGreen ? 'text-emerald-700' : 'text-rose-700'}>
            بسته: <strong className="font-black text-sm">{formatTomanShort(activeCandle.close)}</strong>
          </span>
        </div>
        <div className="flex items-center gap-2 font-sans">
          <span className="text-xs text-slate-600 font-bold">قیمت لحظه‌ای:</span>
          <span className="font-black text-amber-950 bg-amber-200/80 px-3 py-1 rounded-xl border-2 border-[#dfc282] shadow-2xs text-[13px]">
            {formatToman(lastPrice)} تومان
          </span>
        </div>
      </div>

      {/* SVG Canvas Area - Large and Spacious */}
      <div className="relative flex-1 w-full min-h-[320px] sm:min-h-[360px]">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-full overflow-visible"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {/* Vertical Axis Dividing Line between chart area and price numbers */}
          <line
            x1={svgWidth - padRight}
            y1={padTop - 5}
            x2={svgWidth - padRight}
            y2={padTop + plotH + 5}
            stroke="#dfc282"
            strokeWidth={1.5}
          />

          {/* Horizontal Gridlines & Price Scale Axis */}
          {gridLevels.map((lvl, idx) => (
            <g key={idx}>
              <line
                x1={padLeft}
                y1={lvl.y}
                x2={svgWidth - padRight}
                y2={lvl.y}
                stroke="#eee7db"
                strokeWidth={1}
                strokeDasharray="4 4"
              />
              <text
                x={svgWidth - padRight + 16}
                y={lvl.y + 4}
                className="fill-slate-700 text-[12.5px] font-mono font-bold"
              >
                {formatTomanShort(lvl.price)}
              </text>
            </g>
          ))}

          {/* Current Live Price Dashed Line across chart */}
          <line
            x1={padLeft}
            y1={lastY}
            x2={svgWidth - padRight}
            y2={lastY}
            stroke="#d97706"
            strokeWidth={1.5}
            strokeDasharray="5 3"
          />
          {/* Price Tag Badge on Right Axis (Fully separated with clear gap) */}
          <g transform={`translate(${svgWidth - padRight + 12}, ${lastY - 13})`}>
            <rect width={125} height={26} rx={8} fill="#92400e" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.15))" />
            <text
              x={62.5}
              y={18}
              fill="#ffffff"
              fontSize={12}
              fontWeight="bold"
              textAnchor="middle"
              fontFamily="monospace"
            >
              {formatTomanShort(lastPrice)}
            </text>
          </g>

          {/* Candlesticks & Interactive Hitboxes */}
          {data.map((c, i) => {
            const cx = padLeft + (i + 0.5) * step;
            const yHigh = getY(c.high);
            const yLow = getY(c.low);
            const yOpen = getY(c.open);
            const yClose = getY(c.close);

            const bodyY = Math.min(yOpen, yClose);
            const bodyH = Math.max(4, Math.abs(yClose - yOpen));

            const isHovered = hoveredIndex === i;

            return (
              <g
                key={i}
                className="cursor-crosshair"
                onMouseEnter={() => setHoveredIndex(i)}
              >
                {/* Crosshair Vertical Guide Line on Hover */}
                {isHovered && (
                  <line
                    x1={cx}
                    y1={padTop}
                    x2={cx}
                    y2={padTop + plotH}
                    stroke="#b45309"
                    strokeWidth={1.2}
                    strokeDasharray="3 3"
                    opacity={0.65}
                  />
                )}

                {/* Candlestick Upper & Lower Wick */}
                <line
                  x1={cx}
                  y1={yHigh}
                  x2={cx}
                  y2={yLow}
                  stroke={c.isGreen ? '#10b981' : '#f43f5e'}
                  strokeWidth={2.5}
                  strokeLinecap="round"
                />

                {/* Candlestick Real Body */}
                <rect
                  x={cx - candleW / 2}
                  y={bodyY}
                  width={candleW}
                  height={bodyH}
                  rx={2.5}
                  fill={c.isGreen ? '#10b981' : '#f43f5e'}
                  stroke={c.isGreen ? '#059669' : '#e11d48'}
                  strokeWidth={1.2}
                  opacity={isHovered ? 1 : 0.95}
                />

                {/* Transparent hit box for effortless hovering */}
                <rect
                  x={cx - step / 2}
                  y={padTop}
                  width={step}
                  height={plotH}
                  fill="transparent"
                />
              </g>
            );
          })}

          {/* Time/Date Labels on Bottom Axis with generous spacing */}
          {data.map((c, i) => {
            const total = data.length;
            const stride = total <= 8 ? 1 : total <= 16 ? 2 : 4;
            if (i % stride !== 0 && i !== total - 1) return null;
            const cx = padLeft + (i + 0.5) * step;
            return (
              <text
                key={i}
                x={cx}
                y={svgHeight - 16}
                className="fill-slate-600 text-[11.5px] font-bold"
                textAnchor="middle"
              >
                {c.month}
              </text>
            );
          })}
        </svg>
      </div>

      {/* Axis Caption */}
      <div className="flex justify-between items-center text-xs font-bold text-slate-600 border-t border-[#ede6d8] pt-2.5 px-3 mt-2">
        <span>ابتدای دوره پایش ({timeFrame === '1D' ? '۲۴ ساعت گذشته' : timeFrame === '1W' ? 'هفته جاری' : timeFrame === '1M' ? '۱۲ ماه اخیر' : 'روند چندساله'})</span>
        <span className="text-amber-950 font-black">تحلیل تکنیکال شاخص رسمی ارزش مسکن</span>
        <span>پایان دوره (معاملات قطعی)</span>
      </div>
    </div>
  );
};

// =========================================================================
// MAIN PAGE COMPONENT
// =========================================================================
export const PriceDataCenterPage: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState<PriceIndex>(mockPriceIndices[0]);
  const [chartType, setChartType] = useState<'candlestick' | 'line'>('candlestick');
  const [timeFrame, setTimeFrame] = useState<TimeFrameType>('1W');

  // Live real-time chart data state
  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const [lastTickPrice, setLastTickPrice] = useState<number>(0);
  const [tickDirection, setTickDirection] = useState<'up' | 'down' | 'same'>('same');

  // Generate realistic data based on selected index and timeframe
  useEffect(() => {
    const basePrice = selectedIndex.avgPricePerMeter;
    const points: ChartPoint[] = [];

    if (timeFrame === '1D') {
      // Daily: 14 Hourly intervals (08:00 to 21:00)
      const hours = ['۰۸:۰۰', '۰۹:۰۰', '۱۰:۰۰', '۱۱:۰۰', '۱۲:۰۰', '۱۳:۰۰', '۱۴:۰۰', '۱۵:۰۰', '۱۶:۰۰', '۱۷:۰۰', '۱۸:۰۰', '۱۹:۰۰', '۲۰:۰۰', '۲۱:۰۰'];
      let cur = Math.round(basePrice * 0.985);

      hours.forEach((h, i) => {
        const delta = (Math.sin(i * 0.7) * 0.004 + (Math.random() - 0.45) * 0.005);
        const open = cur;
        const close = Math.round(open * (1 + delta));
        const maxOC = Math.max(open, close);
        const minOC = Math.min(open, close);
        const high = Math.round(maxOC + Math.random() * (open * 0.003));
        const low = Math.round(minOC - Math.random() * (open * 0.003));
        const isGreen = close >= open;

        points.push({
          month: h,
          price: close,
          open,
          high,
          low,
          close,
          volume: Math.round(50 + Math.random() * 80),
          isGreen,
        });
        cur = close;
      });
    } else if (timeFrame === '1W') {
      // Weekly: 7 days of the week
      const days = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'];
      let cur = Math.round(basePrice * 0.97);

      days.forEach((d, i) => {
        const delta = (Math.sin(i * 0.6) * 0.008 + (Math.random() - 0.42) * 0.009);
        const open = cur;
        const close = Math.round(open * (1 + delta));
        const maxOC = Math.max(open, close);
        const minOC = Math.min(open, close);
        const high = Math.round(maxOC + Math.random() * (open * 0.005) + open * 0.001);
        const low = Math.round(minOC - Math.random() * (open * 0.005) - open * 0.001);
        const isGreen = close >= open;

        points.push({
          month: d,
          price: close,
          open,
          high,
          low,
          close,
          volume: Math.round(120 + Math.random() * 150),
          isGreen,
        });
        cur = close;
      });
    } else if (timeFrame === '1M') {
      // Monthly: 12 Persian Months
      const months = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
      let cur = Math.round(basePrice * 0.88);

      months.forEach((m, i) => {
        const growth = 0.012 + Math.sin(i * 0.5) * 0.008 + (Math.random() - 0.4) * 0.01;
        const open = cur;
        const close = Math.round(open * (1 + growth));
        const maxOC = Math.max(open, close);
        const minOC = Math.min(open, close);
        const high = Math.round(maxOC + Math.random() * (open * 0.01) + open * 0.003);
        const low = Math.round(minOC - Math.random() * (open * 0.01) - open * 0.003);
        const isGreen = close >= open;

        points.push({
          month: m,
          price: close,
          open,
          high,
          low,
          close,
          volume: Math.round(350 + Math.random() * 250),
          isGreen,
        });
        cur = close;
      });
    } else {
      // Yearly: 6 Consecutive Years
      const years = ['۱۳۹۹', '۱۴۰۰', '۱۴۰۱', '۱۴۰۲', '۱۴۰۳', '۱۴۰۴'];
      let cur = Math.round(basePrice * 0.35);

      years.forEach((yr, i) => {
        const annualRate = 0.38 + (Math.random() - 0.5) * 0.08;
        const open = cur;
        const close = Math.round(open * (1 + annualRate));
        const maxOC = Math.max(open, close);
        const minOC = Math.min(open, close);
        const high = Math.round(maxOC + open * 0.06);
        const low = Math.round(minOC - open * 0.04);
        const isGreen = close >= open;

        points.push({
          month: yr,
          price: close,
          open,
          high,
          low,
          close,
          volume: Math.round(1200 + Math.random() * 800),
          isGreen,
        });
        cur = close;
      });
    }

    setChartData(points);
    setLastTickPrice(points[points.length - 1].close || basePrice);
  }, [selectedIndex, timeFrame]);

  // Live Real-Time Ticking Effect (every 3 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setChartData((prev) => {
        if (prev.length === 0) return prev;
        const lastIdx = prev.length - 1;
        const last = prev[lastIdx];

        const delta = (Math.random() * 0.3 - 0.14) / 100;
        const newPrice = Math.round(last.price * (1 + delta));
        const direction = newPrice > last.price ? 'up' : newPrice < last.price ? 'down' : 'same';

        setTickDirection(direction);
        setLastTickPrice(newPrice);

        const updated = [...prev];
        const open = last.open;
        updated[lastIdx] = {
          ...last,
          price: newPrice,
          close: newPrice,
          high: Math.max(last.high, newPrice),
          low: Math.min(last.low, newPrice),
          isGreen: newPrice >= open,
        };
        return updated;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Price Estimator state
  const [area, setArea] = useState<number>(120);
  const [year, setYear] = useState<number>(1402);
  const [floor, setFloor] = useState<number>(3);
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);
  const regionsScrollRef = useRef<HTMLDivElement>(null);

  const handleScrollRegions = (direction: 'left' | 'right') => {
    if (regionsScrollRef.current) {
      const amount = direction === 'left' ? -240 : 240;
      regionsScrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  const handleRegionsWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (regionsScrollRef.current) {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        regionsScrollRef.current.scrollBy({
          left: -e.deltaY * 1.5,
          behavior: 'auto'
        });
      }
    }
  };

  const handleEstimate = (e: React.FormEvent) => {
    e.preventDefault();
    const basePerMeter = lastTickPrice || selectedIndex.avgPricePerMeter;
    const yearFactor = 1 - (1403 - year) * 0.015;
    const floorFactor = 1 + (floor - 1) * 0.01;
    const calculatedPerMeter = Math.round(basePerMeter * Math.max(0.7, yearFactor) * floorFactor);
    const total = calculatedPerMeter * area;
    setEstimatedPrice(total);
  };

  const timeframeTabs: { id: TimeFrameType; label: string; subLabel: string }[] = [
    { id: '1D', label: 'روزانه', subLabel: '۲۴ ساعت' },
    { id: '1W', label: 'هفتگی', subLabel: '۷ روز' },
    { id: '1M', label: 'ماهانه', subLabel: '۱۲ ماه' },
    { id: '1Y', label: 'سالانه', subLabel: 'چندساله' },
  ];

  return (
    <div className="space-y-6 pb-12 text-[#1c1d22]">
      {/* Header Banner Card (Full Framed Gold Box) */}
      <div className="bg-white p-5 sm:p-6 rounded-[28px] border-2 border-[#dfc282] shadow-[0_4px_16px_rgba(180,130,40,0.1)] relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 btn-3d-gold text-[#2c1b04] px-3 py-1 rounded-lg text-xs font-black mb-2 shadow-2xs">
              <TrendingUp className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>دیتاسنتر و شاخص رسمی قیمت مسکن و مصالح</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-950">
              استعلام قیمت، نمودار روند و ارزش‌گذاری هوشمند
            </h1>
            <p className="text-xs sm:text-[13px] text-slate-700 font-bold mt-1 max-w-xl leading-relaxed">
              داده‌های ثبت‌شده بر اساس معاملات قطعی اعتبارسنجی‌شده در بستر سامانه و اتصال به پایگاه‌های اطلاعاتی رسمی.
            </p>
          </div>

          {/* Live Real-Time Badge */}
          <div className="bg-[#faf8f4] px-4 py-2.5 rounded-2xl border-2 border-[#dfc282] flex items-center gap-3 shrink-0 shadow-2xs">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <div className="text-right">
              <span className="text-[10.5px] text-slate-500 block font-bold">فید زنده معاملات (Real-Time)</span>
              <span className="text-xs sm:text-sm font-black text-amber-950 font-mono">
                {formatTomanShort(lastTickPrice)} / متر
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Region Selector Card with Dedicated Border & Generous Spacing */}
      <div className="bg-white p-4 sm:p-5 rounded-[24px] border-2 border-[#dfc282] shadow-[0_4px_16px_rgba(180,130,40,0.08)] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
            <span className="text-xs sm:text-[13.5px] font-black text-slate-900">
              انتخاب منطقه تحت پوشش جهت نمایش شاخص و نمودار:
            </span>
          </div>
          <span className="text-[11.5px] font-bold text-slate-500 bg-[#faf8f4] px-2.5 py-0.5 rounded-lg border border-[#ede5d6]">
            {mockPriceIndices.length} منطقه پایش
          </span>
        </div>

        {/* Region Selector Tabs with Navigation Controls & Wheel Support */}
        <div className="relative flex items-center gap-2">
          {/* Scroll Right Button */}
          <button
            type="button"
            onClick={() => handleScrollRegions('right')}
            className="w-8 h-8 rounded-xl btn-3d-gold text-[#2c1b04] flex items-center justify-center shrink-0 shadow-2xs hover:scale-105 active:scale-95 transition-all cursor-pointer z-10"
            title="مشاهده مناطق قبلی"
            aria-label="مناطق قبلی"
          >
            <ChevronRight className="w-4 h-4 stroke-[3]" />
          </button>

          <div 
            ref={regionsScrollRef}
            onWheel={handleRegionsWheel}
            className="flex-1 flex gap-2 overflow-x-auto py-1 px-0.5 scroll-smooth touch-pan-x select-none"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#dfc282 #faf8f4'
            }}
          >
            {mockPriceIndices.map((idx) => {
              const isSelected = selectedIndex.id === idx.id;
              return (
                <button
                  key={idx.id}
                  onClick={() => {
                    setSelectedIndex(idx);
                    setEstimatedPrice(null);
                  }}
                  className={`h-9 px-4 rounded-xl text-[14.5px] font-black shrink-0 transition-all cursor-pointer flex items-center justify-center active:scale-95 ${
                    isSelected
                      ? 'btn-3d-gold text-[#2c1b04] shadow-2xs'
                      : 'bg-[#faf8f4] text-slate-800 hover:bg-amber-50/80 border-2 border-[#dfc282] shadow-2xs'
                  }`}
                >
                  <span>
                    {idx.city} - {idx.district}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Scroll Left Button */}
          <button
            type="button"
            onClick={() => handleScrollRegions('left')}
            className="w-8 h-8 rounded-xl btn-3d-gold text-[#2c1b04] flex items-center justify-center shrink-0 shadow-2xs hover:scale-105 active:scale-95 transition-all cursor-pointer z-10"
            title="مشاهده سایر مناطق"
            aria-label="سایر مناطق"
          >
            <ChevronLeft className="w-4 h-4 stroke-[3]" />
          </button>
        </div>
      </div>

      {/* Main Chart Card - Full Framed Gold Box with Generous Top Margin */}
      <div className="bg-white p-5 sm:p-7 rounded-[32px] border-2 border-[#dfc282] space-y-5 shadow-[0_8px_24px_rgba(180,130,40,0.12)] relative overflow-hidden mt-4">
        
        {/* Terminal Top Bar: Title & Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#eee7db] pb-4">
          <div>
            <h2 className="font-black text-lg sm:text-xl text-slate-950 flex items-center gap-2">
              <Activity className="w-5 h-5 text-amber-600 animate-pulse" />
              <span>
                ترمینال زنده تحلیل قیمت • {selectedIndex.city} - {selectedIndex.district.replace(/^\((.+)\)$/, '$1')}
              </span>
            </h2>
            <p className="text-xs sm:text-[13px] text-slate-600 font-bold mt-1">
              نوع ملک: {selectedIndex.propertyType} • بازه زمانی انتخابی: {timeFrame === '1D' ? 'روزانه (۲۴ ساعت)' : timeFrame === '1W' ? 'هفتگی (۷ روز)' : timeFrame === '1M' ? 'ماهانه (۱۲ ماه)' : 'سالانه (روند چندساله)'}
            </p>
          </div>

          {/* Timeframe & Chart Type Controls */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* TIMEFRAME SELECTOR (روزانه، هفتگی، ماهانه، سالانه) */}
            <div className="bg-[#f7f4ed] p-1 rounded-2xl border-2 border-[#dfc282] flex items-center gap-1 shadow-2xs">
              {timeframeTabs.map((tab) => {
                const isActive = timeFrame === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setTimeFrame(tab.id)}
                    className={`h-8.5 px-3 rounded-xl text-[15px] font-black transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                      isActive
                        ? 'btn-3d-gold text-[#2c1b04] shadow-2xs'
                        : 'text-slate-700 hover:text-amber-950 hover:bg-white/80'
                    }`}
                    title={`نمایش بازه ${tab.label}`}
                  >
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Chart Type Switcher (Candlestick vs Line) */}
            <div className="bg-[#f7f4ed] p-1 rounded-2xl border-2 border-[#dfc282] flex items-center gap-1 shadow-2xs">
              <button
                onClick={() => setChartType('candlestick')}
                className={`h-8.5 px-3 rounded-xl text-[15px] font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                  chartType === 'candlestick'
                    ? 'btn-3d-gold text-[#2c1b04] shadow-2xs'
                    : 'text-slate-700 hover:text-slate-950'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>کندل‌استیک</span>
              </button>

              <button
                onClick={() => setChartType('line')}
                className={`h-8.5 px-3 rounded-xl text-[15px] font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                  chartType === 'line'
                    ? 'btn-3d-gold text-[#2c1b04] shadow-2xs'
                    : 'text-slate-700 hover:text-slate-950'
                }`}
              >
                <LineChartIcon className="w-4 h-4" />
                <span>خطی</span>
              </button>
            </div>

            {/* Growth Badge */}
            <span
              className={`bg-emerald-50 text-emerald-950 font-black text-xs sm:text-[13px] px-3 py-2 rounded-xl flex items-center gap-1 border-2 border-emerald-300 shadow-2xs transition-all ${
                tickDirection === 'up'
                  ? 'ring-2 ring-emerald-400 scale-105'
                  : tickDirection === 'down'
                  ? 'ring-2 ring-rose-400 scale-105'
                  : ''
              }`}
            >
              <ArrowUpRight className="w-4 h-4 text-emerald-600 stroke-[3]" />
              <span>+{toPersianDigits(selectedIndex.change30dPercent)}٪ رشد</span>
            </span>

          </div>
        </div>

        {/* Chart View Area with Generous Space */}
        <div className="h-96 w-full pt-2 relative bg-[#fcfbf9] rounded-2xl border-2 border-[#ede5d6] p-4 shadow-inner">
          {chartType === 'line' ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 20, right: 35, left: 15, bottom: 25 }}>
                <defs>
                  <linearGradient id="priceGoldGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d97706" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#d97706" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke="#e8dfd0" />
                <XAxis dataKey="month" stroke="#78716c" fontSize={11.5} tickLine={false} dy={8} />
                <YAxis
                  stroke="#78716c"
                  fontSize={11.5}
                  tickLine={false}
                  tickFormatter={(val) => `${formatTomanShort(val)}`}
                  domain={['dataMin - 2000000', 'dataMax + 2000000']}
                  orientation="right"
                  dx={8}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload as ChartPoint;
                      return (
                        <div className="bg-white border-2 border-[#dfc282] p-3.5 rounded-2xl shadow-xl text-xs space-y-1" dir="rtl">
                          <p className="font-black text-slate-950 text-sm">{data.month}</p>
                          <p className="text-amber-900 font-black font-mono text-xs">
                            قیمت هر متر: {formatToman(data.price)} تومان
                          </p>
                          <p className="text-slate-600 font-bold text-[11px]">
                            حجم معاملات: {toPersianDigits(data.volume)} قرارداد
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="#b45309"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#priceGoldGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <CandlestickSvgChart
              data={chartData}
              lastPrice={lastTickPrice || selectedIndex.avgPricePerMeter}
              timeFrame={timeFrame}
            />
          )}
        </div>

        {/* Live Indicator Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs font-bold text-slate-600 bg-[#faf8f4] p-3 rounded-2xl border border-[#ede5d6]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-slate-950 font-black">وضعیت سرور مظنه‌گیری: آنلاین و متصل به شبکه هوشمند پیوندساخت</span>
          </div>
          <div className="flex items-center gap-3">
            <span>دامنه نوسان مجاز: ±۳٪</span>
            <span>•</span>
            <span className="text-amber-950 font-black">حجم نمونه معاملات: {toPersianDigits(selectedIndex.transactionsCount30d)} فایل قطعی</span>
          </div>
        </div>

      </div>

      {/* Smart Price Estimator Widget (3D Gold Framing) */}
      <div className="bg-white p-5 sm:p-6 rounded-[28px] border-2 border-[#dfc282] shadow-[0_4px_16px_rgba(180,130,40,0.1)] space-y-5">
        <div className="flex items-center gap-2.5 border-b border-[#eee7db] pb-3">
          <div className="w-10 h-10 rounded-xl btn-3d-gold flex items-center justify-center text-[#2c1b04] shadow-2xs">
            <Calculator className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="font-black text-slate-950 text-base sm:text-lg">ماشین‌حساب هوشمند تخمین قیمت ملک</h3>
            <p className="text-xs text-slate-600 font-bold mt-0.5">
              محاسبه ارزش کارشناسی بر اساس متراژ، سن بنا، طبقه و آخرین مظنه منطقه {selectedIndex.district}
            </p>
          </div>
        </div>

        <form onSubmit={handleEstimate} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-900 block">متراژ مفید (مترمربع)</label>
            <input
              type="number"
              value={area}
              onChange={(e) => setArea(Number(e.target.value))}
              min={20}
              max={2000}
              className="w-full bg-[#faf8f4] border-2 border-[#dfc282] rounded-xl px-3 py-2 text-sm font-black text-slate-950 focus:border-[#caa758] focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-900 block">سال ساخت بنا</label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              min={1370}
              max={1403}
              className="w-full bg-[#faf8f4] border-2 border-[#dfc282] rounded-xl px-3 py-2 text-sm font-black text-slate-950 focus:border-[#caa758] focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-900 block">طبقه واحد</label>
            <input
              type="number"
              value={floor}
              onChange={(e) => setFloor(Number(e.target.value))}
              min={1}
              max={40}
              className="w-full bg-[#faf8f4] border-2 border-[#dfc282] rounded-xl px-3 py-2 text-sm font-black text-slate-950 focus:border-[#caa758] focus:outline-none"
            />
          </div>

          <div className="sm:col-span-3 flex justify-end pt-2">
            <button
              type="submit"
              className="h-10 px-6 rounded-xl btn-3d-gold text-[#2c1b04] text-[15px] font-black shadow-2xs active:scale-95 transition-transform cursor-pointer"
            >
              محاسبه و ارزیابی هوشمند قیمت
            </button>
          </div>
        </form>

        {estimatedPrice !== null && (
          <div className="p-4 bg-[#faf8f4] border-2 border-[#dfc282] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-inner">
            <div>
              <span className="text-xs font-bold text-slate-600 block">ارزش برآوردی کل ملک:</span>
              <span className="text-xl sm:text-2xl font-black text-amber-950 font-mono">
                {formatToman(estimatedPrice)} تومان
              </span>
            </div>
            <div className="text-left">
              <span className="text-[11px] text-slate-500 font-bold block">مبنای محاسبه هر متر:</span>
              <span className="text-sm font-bold text-slate-800 font-mono">
                {formatTomanShort(Math.round(estimatedPrice / area))} / متر
              </span>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
