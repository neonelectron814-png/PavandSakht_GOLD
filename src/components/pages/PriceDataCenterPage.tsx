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

  // Initialize and update chart data when selectedIndex changes (Generate 50+ dense TradingView candles)
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
    <div className="space-y-6 pb-12">
      
      {/* Header Banner */}
      <div className="glass-card text-white p-6 sm:p-7 rounded-3xl border border-emerald-500/30 space-y-3 relative overflow-hidden shadow-glass-3d">
        <div className="absolute top-0 -left-10 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 glass-emerald text-emerald-200 border border-emerald-400/40 px-3.5 py-1 rounded-full text-xs font-black mb-2 shadow-sm">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>دیتاسنتر و شاخص رسمی قیمت مسکن</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">نمودار روند قیمت و تخمین هوشمند ارزش ملک</h1>
            <p className="text-xs text-slate-300 font-light mt-1 max-w-xl">
              داده‌های ثبت‌شده بر اساس معاملات قطعی اعتبارسنجی‌شده آکان و اتصال به دیتابیس ثبت اسناد و املاک کشور.
            </p>
          </div>

          {/* Live Real-Time Badge */}
          <div className="glass-panel-dark px-4 py-2.5 rounded-2xl border border-emerald-400/40 flex items-center gap-2.5 shrink-0 shadow-lg">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block">فید زنده معاملات (Websocket)</span>
              <span className="text-xs font-bold text-emerald-300 font-mono">
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
            className={`px-4.5 py-2.5 rounded-2xl text-xs font-bold shrink-0 transition-all card-3d-tilt cursor-pointer ${
              selectedIndex.id === idx.id
                ? 'glass-amber text-amber-300 border border-amber-400/50 shadow-glass-3d'
                : 'glass-card text-slate-300 hover:text-white border border-white/10'
            }`}
          >
            {idx.city} - {idx.district}
          </button>
        ))}
      </div>

      {/* Main Chart 3D Glass Card - TradingView Style Dark Terminal */}
      <div className="bg-slate-950 p-5 sm:p-6 rounded-3xl border border-white/20 space-y-4 shadow-[0_20px_50px_rgba(0,0,0,0.9)] relative overflow-hidden">
        
        {/* Terminal Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3.5">
          <div>
            <h2 className="font-extrabold text-base text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />
              <span>ترمینال زنده کندل‌استیک قیمت - {selectedIndex.city} ({selectedIndex.district})</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">{selectedIndex.propertyType} • تایم‌فریم هفتگی (TradingView Terminal)</p>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Chart Type Switcher: Line vs Candlestick */}
            <div className="bg-slate-900 p-1 rounded-xl border border-white/15 flex items-center gap-1">
              <button
                onClick={() => setChartType('line')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  chartType === 'line'
                    ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <LineChartIcon className="w-3.5 h-3.5" />
                <span>نمودار خطی</span>
              </button>

              <button
                onClick={() => setChartType('candlestick')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  chartType === 'candlestick'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>کندل‌استیک زنده</span>
              </button>
            </div>

            <span className={`glass-emerald text-emerald-300 font-black px-3 py-1.5 rounded-xl flex items-center gap-1 border border-emerald-400/40 shadow-sm transition-all ${
              tickDirection === 'up' ? 'ring-2 ring-emerald-400 scale-105' : tickDirection === 'down' ? 'ring-2 ring-rose-400 scale-105' : ''
            }`}>
              <ArrowUpRight className="w-4 h-4 text-emerald-400" />
              <span>+{toPersianDigits(selectedIndex.change30dPercent)}٪</span>
            </span>
          </div>
        </div>

        {/* Chart View Area */}
        <div className="h-80 w-full pt-3 relative">
          {chartType === 'line' ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={10} tickLine={false} interval={2} />
                <YAxis
                  stroke="#64748b"
                  fontSize={10}
                  domain={['auto', 'auto']}
                  tickFormatter={(val) => `${(val / 1000000).toFixed(0)} م`}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(val: any) => [`${formatTomanShort(Number(val))}`, 'قیمت لحظه‌ای']}
                  labelStyle={{ fontWeight: 'bold', color: '#ffffff' }}
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(16px)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.2)', color: '#ffffff', fontSize: '12px' }}
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#34d399"
                  strokeWidth={3}
                  dot={{ r: 3, fill: '#34d399', strokeWidth: 1, stroke: '#0f172a' }}
                  activeDot={{ r: 7, fill: '#fbbf24', stroke: '#0f172a' }}
                  isAnimationActive={true}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            /* Professional TradingView Style Candlestick Terminal View with Price Scale Sidebar */
            <div className="w-full h-full flex items-stretch relative">
              
              {/* Main Chart Area */}
              <div className="flex-1 flex flex-col justify-between overflow-x-auto no-scrollbar relative">
                
                {/* Grid Background Lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-25">
                  <div className="border-b border-dashed border-slate-700 w-full" />
                  <div className="border-b border-dashed border-slate-700 w-full" />
                  <div className="border-b border-dashed border-slate-700 w-full" />
                  <div className="border-b border-dashed border-slate-700 w-full" />
                </div>

                {/* Candles Row with 15% vertical padding so they never glue to the bottom */}
                <div className="flex items-end justify-between gap-1.5 sm:gap-2.5 h-64 pt-8 pb-4 px-3 relative z-10 min-w-[700px]">
                  {chartData.map((item, index) => {
                    const isGreen = item.isGreen;
                    const bodyColor = isGreen ? 'bg-[#22c55e] shadow-[0_0_12px_rgba(34,197,94,0.45)]' : 'bg-[#ef4444] shadow-[0_0_12px_rgba(239,68,68,0.45)]';
                    const wickColor = isGreen ? 'bg-[#22c55e]' : 'bg-[#ef4444]';
                    
                    const allPrices = chartData.flatMap(d => [d.high || d.price, d.low || d.price]);
                    const rawMin = Math.min(...allPrices);
                    const rawMax = Math.max(...allPrices);
                    const chartMin = rawMin * 0.82;
                    const chartMax = rawMax * 1.08;
                    const chartRange = chartMax - chartMin || 1;

                    const getPercent = (val: number) => {
                      const p = ((val - chartMin) / chartRange) * 100;
                      return Math.max(8, Math.min(92, p));
                    };
                    
                    const highVal = item.high || item.price;
                    const lowVal = item.low || item.price;
                    const openVal = item.open || item.price;
                    const closeVal = item.close || item.price;

                    const highPercent = getPercent(highVal);
                    const lowPercent = getPercent(lowVal);
                    const bodyTopPercent = getPercent(Math.max(openVal, closeVal));
                    const bodyBottomPercent = getPercent(Math.min(openVal, closeVal));
                    
                    const heightPercent = Math.max(8, bodyTopPercent - bodyBottomPercent);

                    return (
                      <div key={index} className="flex flex-col items-center h-full justify-end group relative flex-1">
                        
                        {/* Detailed TradingView Tooltip */}
                        <div className="absolute -top-24 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 border border-white/25 px-3 py-2 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.9)] z-40 pointer-events-none text-right whitespace-nowrap">
                          <p className="text-[11px] font-black text-amber-300 mb-1">{item.month}</p>
                          <div className="space-y-0.5 text-[10px] text-slate-300 font-mono">
                            <p>بالا (High): <span className="text-emerald-400">{formatTomanShort(highVal)}</span></p>
                            <p>باز (Open): <span className="text-white">{formatTomanShort(openVal)}</span></p>
                            <p>بسته (Close): <span className={isGreen ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>{formatTomanShort(closeVal)}</span></p>
                            <p>پایین (Low): <span className="text-rose-400">{formatTomanShort(lowVal)}</span></p>
                          </div>
                        </div>

                        {/* Wick */}
                        <div 
                          style={{ 
                            bottom: `${Math.min(96, lowPercent)}%`, 
                            height: `${Math.max(12, highPercent - lowPercent)}%` 
                          }}
                          className={`w-0.5 absolute ${wickColor} opacity-90`}
                        />

                        {/* Body */}
                        <div 
                          style={{ 
                            bottom: `${Math.min(94, bodyBottomPercent)}%`, 
                            height: `${heightPercent}%` 
                          }}
                          className={`w-3 sm:w-4 rounded-[3px] absolute ${bodyColor} border border-white/20 transition-transform group-hover:scale-125`}
                        />

                        {/* Month Label */}
                        <span className="text-[8px] font-mono text-slate-400 mt-2 z-20 whitespace-nowrap transform -rotate-45 sm:rotate-0">
                          {item.month}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Financial Market Y-Axis Price Scale Sidebar on the Right */}
              <div className="w-24 sm:w-28 border-r border-white/10 flex flex-col justify-between py-2 px-2 text-[9px] font-mono text-slate-400 bg-slate-900/55 select-none shrink-0">
                {(() => {
                  const allPrices = chartData.flatMap(d => [d.high || d.price, d.low || d.price]);
                  const rawMin = Math.min(...allPrices);
                  const rawMax = Math.max(...allPrices);
                  const chartMin = rawMin * 0.82;
                  const chartMax = rawMax * 1.08;
                  const step = (chartMax - chartMin) / 4;
                  return [
                    { label: formatTomanShort(chartMax), color: 'text-emerald-400 font-bold' },
                    { label: formatTomanShort(chartMin + step * 3), color: 'text-white' },
                    { label: formatTomanShort(chartMin + step * 2), color: 'text-slate-300' },
                    { label: formatTomanShort(chartMin + step), color: 'text-slate-300' },
                    { label: formatTomanShort(chartMin), color: 'text-rose-400 font-bold' }
                  ].map((p, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className={p.color}>{p.label}</span>
                      <span className="text-slate-600">--</span>
                    </div>
                  ));
                })()}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI Estimator Form with 3D Glass Inputs */}
      <div className="glass-panel-dark text-white p-6 rounded-3xl border border-white/20 space-y-4 shadow-glass-3d">
        <h3 className="font-extrabold text-sm flex items-center gap-2 text-amber-300 border-b border-white/10 pb-3">
          <Calculator className="w-4 h-4 text-amber-400" />
          <span>تخمین‌گر هوشمند قیمت ملک در منطقه انتخاب‌شده</span>
        </h3>

        <form onSubmit={handleEstimate} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block text-slate-300 font-bold mb-1.5">متراژ ملک (مترمربع):</label>
            <input
              type="number"
              value={area}
              onChange={(e) => setArea(Number(e.target.value))}
              className="w-full bg-slate-950/80 border border-white/15 rounded-xl px-3.5 py-2.5 text-white font-mono font-bold focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1.5">سال ساخت (شمسی):</label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="w-full bg-slate-950/80 border border-white/15 rounded-xl px-3.5 py-2.5 text-white font-mono font-bold focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1.5">طبقه:</label>
            <input
              type="number"
              value={floor}
              onChange={(e) => setFloor(Number(e.target.value))}
              className="w-full bg-slate-950/80 border border-white/15 rounded-xl px-3.5 py-2.5 text-white font-mono font-bold focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="sm:col-span-3 pt-2">
            <button
              type="submit"
              className="w-full btn-3d-amber text-slate-950 font-black py-3.5 rounded-2xl text-xs transition-all cursor-pointer border border-amber-300/50 shadow-lg"
            >
              محاسبه و ارزیابی تخمینی قیمت کارشناسی
            </button>
          </div>
        </form>

        {estimatedPrice !== null && (
          <div className="p-4.5 glass-card rounded-2xl border border-emerald-400/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-inner">
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">قیمت کل تخمینی بر اساس داده‌های کارشناسی:</span>
              <span className="text-lg font-black text-emerald-300">{formatTomanShort(estimatedPrice)}</span>
            </div>
            <button
              onClick={() => alert('درخواست کارشناسی حضوری ثبتی ثبت گردید.')}
              className="btn-3d-emerald text-white font-black px-4.5 py-2.5 rounded-xl text-xs cursor-pointer border border-emerald-300/40"
            >
              درخواست کارشناسی حضوری اسناد
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
