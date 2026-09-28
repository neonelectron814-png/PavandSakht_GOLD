import React, { useState, useEffect } from 'react';
import { TrendingUp, LineChart as LineChartIcon, Calculator, MapPin, Search, ArrowUpRight, Sparkles, Activity, BarChart3 } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { PriceIndex } from '../../types';
import { mockPriceIndices } from '../../data/mockData';
import { formatToman, formatTomanShort, toPersianDigits } from '../../utils/formatters';

interface ChartPoint {
  month: string;
  price: number;
  open?: number;
  high?: number;
  low?: number;
  close?: number;
  isGreen?: boolean;
}

export const PriceDataCenterPage: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState<PriceIndex>(mockPriceIndices[0]);
  const [chartType, setChartType] = useState<'line' | 'candlestick'>('candlestick');
  
  // Live real-time chart data state
  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const [lastTickPrice, setLastTickPrice] = useState<number>(0);
  const [tickDirection, setTickDirection] = useState<'up' | 'down' | 'same'>('same');

  // Initialize and update chart data when selectedIndex changes
  useEffect(() => {
    const basePrices = selectedIndex.historicalChart;
    const expanded: ChartPoint[] = [];
    let curPrice = basePrices[0].price * 0.85;

    for (let i = 0; i < 52; i++) {
      const wave = Math.sin(i * 0.35) * 0.025 + Math.cos(i * 0.15) * 0.015;
      const trend = i * 0.003;
      const noise = (Math.sin(i * 12.5) * 0.012);
      
      const open = curPrice;
      const change = curPrice * (wave + trend + noise);
      const close = Math.round(open + change);
      const high = Math.round(Math.max(open, close) + (Math.abs(change) * 0.6) + (curPrice * 0.004));
      const low = Math.round(Math.min(open, close) - (Math.abs(change) * 0.6) - (curPrice * 0.004));
      
      const isGreen = close >= open;
      const weekLabel = `کندل ${i + 1}`;

      expanded.push({
        month: weekLabel,
        price: close,
        open: Math.round(open),
        high,
        low,
        close,
        isGreen,
      });

      curPrice = close;
    }

    setChartData(expanded);
    setLastTickPrice(expanded[expanded.length - 1].price);
  }, [selectedIndex]);

  // Live Real-Time Ticking Effect (every 2.5 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setChartData((prev) => {
        if (prev.length === 0) return prev;
        const lastIdx = prev.length - 1;
        const currentLast = prev[lastIdx];
        
        const pct = (Math.random() * 0.4 - 0.18) / 100;
        const newPrice = Math.round(currentLast.price * (1 + pct));
        
        const direction = newPrice > currentLast.price ? 'up' : newPrice < currentLast.price ? 'down' : 'same';
        setTickDirection(direction);
        setLastTickPrice(newPrice);

        const updated = [...prev];
        const openPrice = currentLast.open || newPrice;
        updated[lastIdx] = {
          ...currentLast,
          price: newPrice,
          close: newPrice,
          high: Math.max(currentLast.high || newPrice, newPrice * 1.003),
          low: Math.min(currentLast.low || newPrice, newPrice * 0.997),
          isGreen: newPrice >= openPrice,
        };
        return updated;
      });
    }, 2500);

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
      
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#ded5c5] space-y-3 relative overflow-hidden shadow-xs">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-900 border border-amber-300 px-3.5 py-1 rounded-full text-xs font-black mb-2 shadow-xs">
              <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
              <span>دیتاسنتر و شاخص رسمی قیمت مسکن، آهن و مصالح</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">استعلام قیمت و متراژ، نمودار روند و ارزش‌گذاری هوشمند</h1>
            <p className="text-xs text-slate-600 font-medium mt-1 max-w-xl">
              داده‌های ثبت‌شده بر اساس معاملات قطعی اعتبارسنجی‌شده پیوندساخت و اتصال به دیتابیس بورس کالا و ثبت اسناد و املاک کشور.
            </p>
          </div>

          {/* Live Real-Time Badge */}
          <div className="bg-[#faf8f4] px-4 py-2.5 rounded-2xl border border-amber-300 flex items-center gap-2.5 shrink-0 shadow-xs">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <div className="text-right">
              <span className="text-[10px] text-slate-500 block font-bold">فید زنده معاملات (Websocket)</span>
              <span className="text-xs font-black text-amber-900 font-mono">
                {formatTomanShort(lastTickPrice)} / متر
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Region Selector Tabs */}
      <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
        {mockPriceIndices.map((idx) => (
          <button
            key={idx.id}
            onClick={() => {
              setSelectedIndex(idx);
              setEstimatedPrice(null);
            }}
            className={`px-4.5 py-2.5 rounded-2xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
              selectedIndex.id === idx.id
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-sm font-black'
                : 'bg-white text-slate-700 hover:text-slate-950 border border-[#ded5c5]'
            }`}
          >
            {idx.city} - {idx.district}
          </button>
        ))}
      </div>

      {/* Main Chart Card - Clean White Light Terminal */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#ded5c5] space-y-4 shadow-xs relative overflow-hidden">
        
        {/* Terminal Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#eee7db] pb-3.5">
          <div>
            <h2 className="font-black text-base text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-amber-600 animate-pulse" />
              <span>ترمینال زنده کندل‌استیک قیمت - {selectedIndex.city} ({selectedIndex.district})</span>
            </h2>
            <p className="text-xs text-slate-500 font-bold mt-0.5">{selectedIndex.propertyType} • تایم‌فریم هفتگی (تحلیل تکنیکال بازار)</p>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Chart Type Switcher */}
            <div className="bg-[#faf8f4] p-1 rounded-xl border border-[#ded5c5] flex items-center gap-1">
              <button
                onClick={() => setChartType('line')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  chartType === 'line'
                    ? 'bg-amber-500 text-white shadow-sm font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LineChartIcon className="w-3.5 h-3.5" />
                <span>نمودار خطی</span>
              </button>

              <button
                onClick={() => setChartType('candlestick')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  chartType === 'candlestick'
                    ? 'bg-amber-500 text-white shadow-sm font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>کندل‌استیک زنده</span>
              </button>
            </div>

            <span className={`bg-emerald-50 text-emerald-800 font-black px-3 py-1.5 rounded-xl flex items-center gap-1 border border-emerald-300 shadow-2xs transition-all ${
              tickDirection === 'up' ? 'ring-2 ring-emerald-400 scale-105' : tickDirection === 'down' ? 'ring-2 ring-rose-400 scale-105' : ''
            }`}>
              <ArrowUpRight className="w-4 h-4 text-emerald-600" />
              <span>+{toPersianDigits(selectedIndex.change30dPercent)}٪</span>
            </span>
          </div>
        </div>

        {/* Chart View Area */}
        <div className="h-80 w-full pt-3 relative bg-[#fcfbf9] rounded-2xl border border-[#f0e9dc] p-2">
          {chartType === 'line' ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="priceGoldGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d97706" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#d97706" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8dfd0" />
                <XAxis dataKey="month" stroke="#78716c" fontSize={10} tickLine={false} />
                <YAxis
                  stroke="#78716c"
                  fontSize={10}
                  tickLine={false}
                  tickFormatter={(val) => `${formatTomanShort(val)}`}
                  domain={['dataMin - 5000000', 'dataMax + 5000000']}
                  orientation="right"
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload as ChartPoint;
                      return (
                        <div className="bg-white border border-amber-300 p-3 rounded-xl shadow-lg text-xs">
                          <p className="font-black text-slate-900 mb-1">{data.month}</p>
                          <p className="text-amber-700 font-black font-mono">
                            قیمت: {formatToman(data.price)} تومان
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
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#priceGoldGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            /* Professional Candlestick Simulator */
            <div className="w-full h-full flex flex-col justify-between select-none">
              <div className="flex-1 flex items-end gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar px-2 pb-6 pt-2">
                {chartData.map((candle, idx) => {
                  const minPrice = Math.min(...chartData.map(c => c.low || c.price));
                  const maxPrice = Math.max(...chartData.map(c => c.high || c.price));
                  const range = maxPrice - minPrice || 1;

                  const open = candle.open || candle.price;
                  const close = candle.close || candle.price;
                  const high = candle.high || Math.max(open, close);
                  const low = candle.low || Math.min(open, close);

                  const isUp = close >= open;
                  const bodyTop = Math.max(open, close);
                  const bodyBottom = Math.min(open, close);

                  const bodyHeightPct = Math.max(4, ((bodyTop - bodyBottom) / range) * 100);
                  const bottomOffsetPct = ((bodyBottom - minPrice) / range) * 100;
                  const wickHeightPct = Math.max(6, ((high - low) / range) * 100);
                  const wickBottomPct = ((low - minPrice) / range) * 100;

                  return (
                    <div 
                      key={idx}
                      className="group relative flex-1 min-w-[5px] sm:min-w-[8px] h-full flex items-end justify-center cursor-crosshair"
                    >
                      {/* High/Low Wick */}
                      <div 
                        className={`absolute w-[1.5px] rounded-full ${isUp ? 'bg-emerald-600' : 'bg-rose-600'}`}
                        style={{
                          bottom: `${wickBottomPct}%`,
                          height: `${wickHeightPct}%`,
                        }}
                      />

                      {/* Open/Close Real Body */}
                      <div
                        className={`w-full max-w-[12px] rounded-xs z-10 transition-all ${
                          isUp 
                            ? 'bg-emerald-500 border border-emerald-600' 
                            : 'bg-rose-500 border border-rose-600'
                        }`}
                        style={{
                          bottom: `${bottomOffsetPct}%`,
                          height: `${bodyHeightPct}%`,
                        }}
                      />

                      {/* Candlestick Hover Tooltip */}
                      <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col bg-white border border-amber-300 p-2 rounded-xl shadow-xl text-[10px] font-mono z-50 whitespace-nowrap pointer-events-none text-right">
                        <span className="font-bold text-slate-800">{candle.month}</span>
                        <span className="text-slate-600">Open: {formatTomanShort(open)}</span>
                        <span className="text-emerald-700 font-bold">High: {formatTomanShort(high)}</span>
                        <span className="text-rose-700 font-bold">Low: {formatTomanShort(low)}</span>
                        <span className="text-slate-900 font-black">Close: {formatTomanShort(close)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Candlestick Axis Legend */}
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 border-t border-[#ede6d8] pt-1.5 px-2">
                <span>ابتدای دوره پایش</span>
                <span className="text-amber-700 font-black">آخرین قیمت لحظه‌ای: {formatToman(lastTickPrice)} تومان / متر</span>
                <span>هم‌اکنون</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Value Estimator Form */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#ded5c5] space-y-4 shadow-xs">
        <h3 className="font-black text-sm text-slate-900 flex items-center gap-2 border-b border-[#eee7db] pb-3">
          <Calculator className="w-4 h-4 text-amber-600" />
          <span>محاسبه‌گر تخمین قیمت کارشناسی ملک بر اساس دیتاسنتر</span>
        </h3>

        <form onSubmit={handleEstimate} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-slate-700 font-bold mb-1.5">متراژ زیربنا (مترمربع):</label>
            <input
              type="number"
              value={area}
              onChange={(e) => setArea(Number(e.target.value))}
              className="w-full bg-white border border-[#ded5c5] rounded-xl px-3.5 py-2.5 font-bold text-slate-900 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1.5">سال ساخت:</label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="w-full bg-white border border-[#ded5c5] rounded-xl px-3.5 py-2.5 font-bold text-slate-900 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1.5">طبقه واحد:</label>
            <input
              type="number"
              value={floor}
              onChange={(e) => setFloor(Number(e.target.value))}
              className="w-full bg-white border border-[#ded5c5] rounded-xl px-3.5 py-2.5 font-bold text-slate-900 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="sm:col-span-3 flex justify-end">
            <button
              type="submit"
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-black px-6 py-3 rounded-2xl text-xs shadow-md transition-all cursor-pointer"
            >
              محاسبه ارزش کارشناسی روز
            </button>
          </div>
        </form>

        {estimatedPrice !== null && (
          <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl flex items-center justify-between text-xs shadow-xs animate-in fade-in">
            <span className="text-slate-700 font-bold">ارزش برآوردی کل ملک در {selectedIndex.district}:</span>
            <span className="text-base font-black text-amber-900">{formatToman(estimatedPrice)} تومان</span>
          </div>
        )}
      </div>

    </div>
  );
};
