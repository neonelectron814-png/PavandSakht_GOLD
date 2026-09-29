import React, { useState, useEffect } from 'react';
import { TrendingUp, LineChart as LineChartIcon, Calculator, ArrowUpRight, Activity, BarChart3, Clock, Check } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { PriceIndex } from '../../types';
import { mockPriceIndices } from '../../data/mockData';
import { formatToman, formatTomanShort, toPersianDigits } from '../../utils/formatters';

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
// STANDARD FINANCIAL CANDLESTICK CHART (TradingView Standard SVG)
// =========================================================================
interface CandlestickSvgChartProps {
  data: ChartPoint[];
  lastPrice: number;
}

const CandlestickSvgChart: React.FC<CandlestickSvgChartProps> = ({ data, lastPrice }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!data || data.length === 0) return null;

  const svgWidth = 860;
  const svgHeight = 290;
  const padTop = 20;
  const padBottom = 35;
  const padLeft = 15;
  const padRight = 95;

  const plotW = svgWidth - padLeft - padRight;
  const plotH = svgHeight - padTop - padBottom;

  const allLows = data.map((d) => d.low);
  const allHighs = data.map((d) => d.high);
  const minVal = Math.min(...allLows);
  const maxVal = Math.max(...allHighs);
  const valRange = maxVal - minVal || 1;

  // Add 5% headroom and footroom
  const domainMin = minVal - valRange * 0.05;
  const domainMax = maxVal + valRange * 0.05;
  const domainRange = domainMax - domainMin;

  const getY = (val: number) => {
    const ratio = (val - domainMin) / domainRange;
    return padTop + plotH * (1 - ratio);
  };

  const candleCount = data.length;
  const step = plotW / candleCount;
  const candleW = Math.max(7, Math.min(15, step * 0.68));

  // 5 horizontal price gridlines
  const gridLevels = [0.05, 0.28, 0.52, 0.76, 0.98].map((ratio) => {
    const price = domainMin + domainRange * ratio;
    const y = getY(price);
    return { price, y };
  });

  const activeCandle =
    hoveredIndex !== null && data[hoveredIndex] ? data[hoveredIndex] : data[data.length - 1];
  const lastY = getY(lastPrice);

  return (
    <div className="w-full h-full flex flex-col justify-between relative select-none">
      {/* Top HUD Info Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-1.5 bg-[#faf8f4] border border-[#e8dfcf] rounded-xl text-xs font-mono font-bold mb-2">
        <div className="flex items-center gap-3">
          <span className="text-slate-900 font-black font-sans">{activeCandle.month}</span>
          <span className="text-slate-600">
            باز: <strong className="text-slate-950">{formatTomanShort(activeCandle.open)}</strong>
          </span>
          <span className="text-emerald-700">
            بالا: <strong className="text-emerald-800">{formatTomanShort(activeCandle.high)}</strong>
          </span>
          <span className="text-rose-700">
            پایین: <strong className="text-rose-800">{formatTomanShort(activeCandle.low)}</strong>
          </span>
          <span className={activeCandle.isGreen ? 'text-emerald-700' : 'text-rose-700'}>
            بسته: <strong className="font-black">{formatTomanShort(activeCandle.close)}</strong>
          </span>
        </div>
        <div className="flex items-center gap-1.5 font-sans">
          <span className="text-[11px] text-slate-500 font-bold">آخرین استعلام:</span>
          <span className="font-black text-amber-950 bg-amber-100/90 px-2 py-0.5 rounded-lg border border-amber-300">
            {formatToman(lastPrice)} تومان
          </span>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div className="relative flex-1 w-full min-h-[220px]">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {/* Horizontal Gridlines & Price Scale Axis */}
          {gridLevels.map((lvl, idx) => (
            <g key={idx}>
              <line
                x1={padLeft}
                y1={lvl.y}
                x2={svgWidth - padRight}
                y2={lvl.y}
                stroke="#e8e1d3"
                strokeWidth={1}
                strokeDasharray="4 4"
              />
              <text
                x={svgWidth - padRight + 8}
                y={lvl.y + 4}
                className="fill-slate-600 text-[11px] font-mono font-bold"
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
            strokeDasharray="4 3"
          />
          {/* Price Tag Badge on Right Axis */}
          <g transform={`translate(${svgWidth - padRight + 2}, ${lastY - 9})`}>
            <rect width={82} height={18} rx={4} fill="#b45309" />
            <text
              x={41}
              y={13}
              fill="#ffffff"
              fontSize={10}
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
            const bodyH = Math.max(3, Math.abs(yClose - yOpen));

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

                {/* Candlestick Upper & Lower Wick (سایه بالا و پایین) */}
                <line
                  x1={cx}
                  y1={yHigh}
                  x2={cx}
                  y2={yLow}
                  stroke={c.isGreen ? '#10b981' : '#f43f5e'}
                  strokeWidth={1.75}
                  strokeLinecap="round"
                />

                {/* Candlestick Real Body (بدنه کندل) */}
                <rect
                  x={cx - candleW / 2}
                  y={bodyY}
                  width={candleW}
                  height={bodyH}
                  rx={1.5}
                  fill={c.isGreen ? '#10b981' : '#f43f5e'}
                  stroke={c.isGreen ? '#059669' : '#e11d48'}
                  strokeWidth={1}
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

          {/* Time/Date Labels on Bottom Axis */}
          {data.map((c, i) => {
            // Label every 5 candles and the last candle
            if (i % 5 !== 0 && i !== data.length - 1) return null;
            const cx = padLeft + (i + 0.5) * step;
            return (
              <text
                key={i}
                x={cx}
                y={svgHeight - 12}
                className="fill-slate-500 text-[10.5px] font-bold"
                textAnchor="middle"
              >
                {c.month}
              </text>
            );
          })}
        </svg>
      </div>

      {/* Axis Caption */}
      <div className="flex justify-between items-center text-[11px] font-bold text-slate-500 border-t border-[#ede6d8] pt-2 px-2 mt-1">
        <span>ابتدای بازه پایش معاملات</span>
        <span className="text-amber-900 font-black">تحلیل تکنیکال شاخص رسمی ارزش مسکن</span>
        <span>هفته جاری (معاملات قطعی)</span>
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

  // Live real-time chart data state
  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const [lastTickPrice, setLastTickPrice] = useState<number>(0);
  const [tickDirection, setTickDirection] = useState<'up' | 'down' | 'same'>('same');

  // Initialize standard realistic financial candlestick data
  useEffect(() => {
    const basePrice = selectedIndex.avgPricePerMeter;
    const count = 28; // 28 weekly periods for balanced screen density
    const points: ChartPoint[] = [];

    // Start slightly below base price to create healthy growth trend
    let cur = Math.round(basePrice * 0.94);

    for (let i = 0; i < count; i++) {
      // Natural market variation: healthy alternating bull/bear steps
      const cycle = Math.sin(i * 0.55) * 0.012;
      const upwardDrift = 0.0028;
      const noise = (Math.random() - 0.46) * 0.016;

      const changePct = upwardDrift + cycle + noise;
      const open = cur;
      const close = Math.round(open * (1 + changePct));

      // Realistic upper and lower wicks
      const maxOC = Math.max(open, close);
      const minOC = Math.min(open, close);
      const high = Math.round(maxOC + Math.random() * (open * 0.008) + open * 0.002);
      const low = Math.round(minOC - Math.random() * (open * 0.008) - open * 0.002);
      const volume = Math.round(180 + Math.random() * 220);
      const isGreen = close >= open;

      points.push({
        month: `هفته ${toPersianDigits(i + 1)}`,
        price: close,
        open,
        high,
        low,
        close,
        volume,
        isGreen,
      });

      cur = close;
    }

    setChartData(points);
    setLastTickPrice(points[points.length - 1].close || basePrice);
  }, [selectedIndex]);

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

  const handleEstimate = (e: React.FormEvent) => {
    e.preventDefault();
    const basePerMeter = lastTickPrice || selectedIndex.avgPricePerMeter;
    const yearFactor = 1 - (1403 - year) * 0.015;
    const floorFactor = 1 + (floor - 1) * 0.01;
    const calculatedPerMeter = Math.round(basePerMeter * Math.max(0.7, yearFactor) * floorFactor);
    const total = calculatedPerMeter * area;
    setEstimatedPrice(total);
  };

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
          <div className="bg-[#faf8f4] px-3.5 py-2 rounded-xl border-2 border-[#dfc282] flex items-center gap-2.5 shrink-0 shadow-2xs">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <div className="text-right">
              <span className="text-[10px] text-slate-500 block font-bold">فید زنده معاملات (Real-Time)</span>
              <span className="text-xs font-black text-amber-950 font-mono">
                {formatTomanShort(lastTickPrice)} / متر
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Region Selector Tabs (Compact 3D Gold Buttons, 15px Font Size) */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {mockPriceIndices.map((idx) => {
          const isSelected = selectedIndex.id === idx.id;
          return (
            <button
              key={idx.id}
              onClick={() => {
                setSelectedIndex(idx);
                setEstimatedPrice(null);
              }}
              className={`h-9 px-3.5 rounded-xl text-[15px] font-black shrink-0 transition-all cursor-pointer flex items-center justify-center active:scale-95 ${
                isSelected
                  ? 'btn-3d-gold text-[#2c1b04] shadow-2xs'
                  : 'bg-white text-slate-800 hover:bg-amber-50/60 border-2 border-[#dfc282] shadow-2xs'
              }`}
            >
              <span>
                {idx.city} - {idx.district}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Chart Card - Full Framed Gold Box */}
      <div className="bg-white p-4 sm:p-5 rounded-[28px] border-2 border-[#dfc282] space-y-4 shadow-[0_4px_16px_rgba(180,130,40,0.1)] relative overflow-hidden">
        {/* Terminal Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#eee7db] pb-3">
          <div>
            <h2 className="font-black text-base sm:text-lg text-slate-950 flex items-center gap-2">
              <Activity className="w-5 h-5 text-amber-600 animate-pulse" />
              <span>
                ترمینال زنده کندل‌استیک قیمت - {selectedIndex.city} ({selectedIndex.district})
              </span>
            </h2>
            <p className="text-xs text-slate-600 font-bold mt-0.5">
              {selectedIndex.propertyType} • تایم‌فریم هفتگی (تحلیل تکنیکال بازار)
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Chart Type Switcher (Compact Buttons, 15px Font Size) */}
            <div className="bg-[#faf8f4] p-1 rounded-xl border-2 border-[#dfc282] flex items-center gap-1 shadow-2xs">
              <button
                onClick={() => setChartType('candlestick')}
                className={`h-8 px-3 rounded-lg text-[15px] font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                  chartType === 'candlestick'
                    ? 'btn-3d-gold text-[#2c1b04] shadow-2xs'
                    : 'text-slate-700 hover:text-slate-950'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>کندل‌استیک زنده</span>
              </button>

              <button
                onClick={() => setChartType('line')}
                className={`h-8 px-3 rounded-lg text-[15px] font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                  chartType === 'line'
                    ? 'btn-3d-gold text-[#2c1b04] shadow-2xs'
                    : 'text-slate-700 hover:text-slate-950'
                }`}
              >
                <LineChartIcon className="w-4 h-4" />
                <span>نمودار خطی</span>
              </button>
            </div>

            {/* 30-Day Growth Badge */}
            <span
              className={`bg-emerald-50 text-emerald-900 font-black text-xs px-2.5 py-1.5 rounded-xl flex items-center gap-1 border border-emerald-300 shadow-2xs transition-all ${
                tickDirection === 'up'
                  ? 'ring-2 ring-emerald-400 scale-105'
                  : tickDirection === 'down'
                  ? 'ring-2 ring-rose-400 scale-105'
                  : ''
              }`}
            >
              <ArrowUpRight className="w-4 h-4 text-emerald-600 stroke-[3]" />
              <span>+{toPersianDigits(selectedIndex.change30dPercent)}٪</span>
            </span>
          </div>
        </div>

        {/* Chart View Area */}
        <div className="h-88 w-full pt-1 relative bg-[#fcfbf9] rounded-2xl border border-[#ede5d6] p-3 shadow-inner">
          {chartType === 'line' ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="priceGoldGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d97706" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#d97706" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8dfd0" />
                <XAxis dataKey="month" stroke="#78716c" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#78716c"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(val) => `${formatTomanShort(val)}`}
                  domain={['dataMin - 3000000', 'dataMax + 3000000']}
                  orientation="right"
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload as ChartPoint;
                      return (
                        <div className="bg-white border-2 border-[#dfc282] p-3 rounded-xl shadow-xl text-xs" dir="rtl">
                          <p className="font-black text-slate-950 mb-1">{data.month}</p>
                          <p className="text-amber-900 font-black font-mono">
                            قیمت هر متر: {formatToman(data.price)} تومان
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
                  strokeWidth={2.8}
                  fillOpacity={1}
                  fill="url(#priceGoldGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <CandlestickSvgChart data={chartData} lastPrice={lastTickPrice} />
          )}
        </div>
      </div>

      {/* Interactive Value Estimator Form (Framed Card with 15px 3D Gold Button) */}
      <div className="bg-white p-5 sm:p-6 rounded-[28px] border-2 border-[#dfc282] space-y-4 shadow-[0_4px_16px_rgba(180,130,40,0.1)]">
        <h3 className="font-black text-sm sm:text-base text-slate-950 flex items-center gap-2 border-b border-[#eee7db] pb-3">
          <Calculator className="w-4.5 h-4.5 text-amber-700" />
          <span>محاسبه‌گر تخمین قیمت کارشناسی ملک بر اساس دیتاسنتر</span>
        </h3>

        <form onSubmit={handleEstimate} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-slate-950 font-black text-xs sm:text-[13px] mb-1.5">
              متراژ زیربنا (مترمربع):
            </label>
            <input
              type="number"
              value={area}
              onChange={(e) => setArea(Number(e.target.value))}
              className="w-full bg-white border-2 border-[#dfc282] focus:border-[#caa758] rounded-xl px-3.5 py-2 font-black text-slate-950 text-sm shadow-2xs focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-slate-950 font-black text-xs sm:text-[13px] mb-1.5">
              سال ساخت:
            </label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="w-full bg-white border-2 border-[#dfc282] focus:border-[#caa758] rounded-xl px-3.5 py-2 font-black text-slate-950 text-sm shadow-2xs focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-slate-950 font-black text-xs sm:text-[13px] mb-1.5">
              طبقه واحد:
            </label>
            <input
              type="number"
              value={floor}
              onChange={(e) => setFloor(Number(e.target.value))}
              className="w-full bg-white border-2 border-[#dfc282] focus:border-[#caa758] rounded-xl px-3.5 py-2 font-black text-slate-950 text-sm shadow-2xs focus:outline-none transition-all"
            />
          </div>

          <div className="sm:col-span-3 flex justify-end pt-1">
            <button
              type="submit"
              className="h-10 px-5 btn-3d-gold text-[#2c1b04] text-[15px] font-black rounded-xl shadow-2xs active:scale-95 transition-transform cursor-pointer flex items-center gap-2"
            >
              <Calculator className="w-4 h-4 stroke-[2.5]" />
              <span>محاسبه ارزش کارشناسی روز</span>
            </button>
          </div>
        </form>

        {estimatedPrice !== null && (
          <div className="p-4 bg-amber-50/90 border-2 border-[#caa758] rounded-2xl flex items-center justify-between text-xs shadow-xs animate-in fade-in">
            <span className="text-slate-800 font-bold text-xs sm:text-[13px]">
              ارزش برآوردی کل ملک در {selectedIndex.district}:
            </span>
            <span className="text-base sm:text-lg font-black text-amber-950 font-mono">
              {formatToman(estimatedPrice)} تومان
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
