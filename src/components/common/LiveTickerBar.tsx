import React from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  TrendingDown, 
  Pause, 
  Play, 
  Volume2, 
  VolumeX, 
  Activity,
  Zap
} from 'lucide-react';
import { LiveTickerItem } from '../../types';
import { formatTomanShort, toPersianDigits } from '../../utils/formatters';

interface LiveTickerBarProps {
  tickerItems: LiveTickerItem[];
  isLiveActive: boolean;
  onToggleLive: () => void;
  isSoundEnabled: boolean;
  onToggleSound: () => void;
  onOpenLiveFeed: () => void;
  liveEventsCount: number;
}

export const LiveTickerBar: React.FC<LiveTickerBarProps> = ({
  tickerItems,
  isLiveActive,
  onToggleLive,
  isSoundEnabled,
  onToggleSound,
  onOpenLiveFeed,
  liveEventsCount,
}) => {
  return (
    <div className="bg-[#fcfaf5] border-b border-[#ebdcc7] text-xs py-1.5 px-3 sm:px-4 relative z-20 overflow-hidden shadow-xs select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2.5">
        
        {/* Left Live Badge Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={onOpenLiveFeed}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white hover:bg-amber-50 border border-[#ded5c5] text-slate-900 font-bold transition-all group shadow-2xs cursor-pointer"
            title="مشاهده تابلوی کامل رویدادهای زنده"
          >
            <span className="relative flex h-2 w-2">
              {isLiveActive && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
              )}
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isLiveActive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
            </span>
            <span className="text-[10px] sm:text-[11px] text-amber-900 font-black group-hover:text-amber-700">تابلو زنده</span>
            <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[9px] sm:text-[10px] px-1.5 py-0.2 rounded-md font-mono font-black">
              {toPersianDigits(liveEventsCount)}
            </span>
          </motion.button>

          {/* Pause / Resume button */}
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={onToggleLive}
            className={`p-1 rounded-lg border transition-all cursor-pointer ${
              isLiveActive 
                ? 'bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-100' 
                : 'bg-rose-50 border-rose-300 text-rose-700 hover:bg-rose-100'
            }`}
            title={isLiveActive ? 'توقف پایش زنده' : 'شروع مجدد پایش زنده'}
          >
            {isLiveActive ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 text-amber-600" />}
          </motion.button>

          {/* Sound Toggle */}
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={onToggleSound}
            className={`p-1 rounded-lg border transition-all hidden xs:flex items-center justify-center cursor-pointer ${
              isSoundEnabled 
                ? 'bg-amber-100 border-amber-300 text-amber-800 hover:bg-amber-200' 
                : 'bg-white border-slate-200 text-slate-500 hover:text-slate-900'
            }`}
            title={isSoundEnabled ? 'هشدار صوتی فعال است' : 'هشدار صوتی خاموش است'}
          >
            {isSoundEnabled ? <Volume2 className="w-3 h-3 text-amber-600" /> : <VolumeX className="w-3 h-3" />}
          </motion.button>
        </div>

        {/* Center Scrolling / Flowing Ticker Items */}
        <div className="flex-1 overflow-x-auto no-scrollbar scroll-smooth flex items-center gap-2 text-[11px] whitespace-nowrap py-0.5 touch-pan-x">
          {tickerItems.map((item) => {
            const isPositive = item.changePercent > 0;
            const isNegative = item.changePercent < 0;

            return (
              <motion.div 
                key={item.id}
                whileTap={{ scale: 0.95 }}
                onClick={onOpenLiveFeed}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white hover:bg-amber-50 border border-[#ded5c5] hover:border-amber-400 cursor-pointer transition-all shrink-0 shadow-2xs"
              >
                <span className="font-bold text-slate-800">{item.name}:</span>
                <span className="font-black font-mono text-slate-900">
                  {formatTomanShort(item.price)}
                </span>
                <span className="text-[9px] text-slate-500 font-bold">({item.unit})</span>

                <span
                  className={`inline-flex items-center gap-0.5 text-[10px] font-black px-1.5 py-0.2 rounded-md ${
                    isPositive
                      ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                      : isNegative
                      ? 'text-rose-700 bg-rose-50 border border-rose-200'
                      : 'text-slate-600 bg-slate-100'
                  }`}
                >
                  {isPositive && <TrendingUp className="w-2.5 h-2.5" />}
                  {isNegative && <TrendingDown className="w-2.5 h-2.5" />}
                  <span>%{toPersianDigits(Math.abs(item.changePercent))}</span>
                </span>
              </motion.div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
