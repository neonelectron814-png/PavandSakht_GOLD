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
    <div className="bg-slate-950/80 border-b border-white/10 backdrop-blur-xl text-xs py-1.5 px-3 sm:px-4 relative z-20 overflow-hidden shadow-inner select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2.5">
        
        {/* Left Live Badge Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={onOpenLiveFeed}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-white/15 text-white font-bold transition-all group shadow-sm cursor-pointer"
            title="مشاهده تابلوی کامل رویدادهای زنده"
          >
            <span className="relative flex h-2 w-2">
              {isLiveActive && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              )}
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isLiveActive ? 'bg-emerald-400' : 'bg-slate-500'}`} />
            </span>
            <span className="text-[10px] sm:text-[11px] text-amber-300 group-hover:text-amber-200">تابلو زنده</span>
            <span className="bg-amber-400/20 text-amber-300 text-[9px] sm:text-[10px] px-1 py-0.2 rounded font-mono font-bold">
              {toPersianDigits(liveEventsCount)}
            </span>
          </motion.button>

          {/* Pause / Resume button */}
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={onToggleLive}
            className={`p-1 rounded-lg border transition-all cursor-pointer ${
              isLiveActive 
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30' 
                : 'bg-rose-500/20 border-rose-500/40 text-rose-300 hover:bg-rose-500/30'
            }`}
            title={isLiveActive ? 'توقف پایش زنده' : 'شروع مجدد پایش زنده'}
          >
            {isLiveActive ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
          </motion.button>

          {/* Sound Toggle */}
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={onToggleSound}
            className={`p-1 rounded-lg border transition-all hidden xs:flex items-center justify-center cursor-pointer ${
              isSoundEnabled 
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 hover:bg-amber-500/30' 
                : 'bg-slate-800/60 border-white/10 text-slate-400 hover:text-white'
            }`}
            title={isSoundEnabled ? 'هشدار صوتی فعال است' : 'هشدار صوتی خاموش است'}
          >
            {isSoundEnabled ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
          </motion.button>
        </div>

        {/* Center Scrolling / Flowing Ticker Items */}
        <div className="flex-1 overflow-x-auto no-scrollbar scroll-smooth flex items-center gap-2 text-[11px] whitespace-nowrap mask-edges py-0.5 touch-pan-x">
          {tickerItems.map((item) => {
            const isPositive = item.changePercent > 0;
            const isNegative = item.changePercent < 0;

            return (
              <motion.div 
                key={item.id}
                whileTap={{ scale: 0.95 }}
                onClick={onOpenLiveFeed}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-white/10 hover:border-amber-400/40 cursor-pointer transition-all shrink-0 shadow-sm"
              >
                <span className="text-slate-300 text-[10px] sm:text-[11px] font-medium">{item.name}:</span>
                <span className="font-bold text-white font-mono text-[10px] sm:text-[11px]">{formatTomanShort(item.price)}</span>
                
                <span className={`inline-flex items-center gap-0.5 text-[9px] sm:text-[10px] font-bold font-mono px-1 py-0.2 rounded ${
                  isPositive 
                    ? 'text-emerald-400 bg-emerald-500/15' 
                    : isNegative 
                      ? 'text-rose-400 bg-rose-500/15' 
                      : 'text-slate-400 bg-slate-800/40'
                }`}>
                  {isPositive && <TrendingUp className="w-2.5 h-2.5" />}
                  {isNegative && <TrendingDown className="w-2.5 h-2.5" />}
                  <span>{isPositive ? '+' : ''}{toPersianDigits(item.changePercent)}٪</span>
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Right Ping & Node Status */}
        <div className="hidden md:flex items-center gap-2 shrink-0 text-[10px] text-slate-400">
          <div className="flex items-center gap-1 bg-slate-900/80 px-2 py-0.5 rounded-xl border border-white/10">
            <Zap className="w-3 h-3 text-amber-400" />
            <span>پینگ: <strong className="font-mono text-emerald-400">{toPersianDigits(24)}ms</strong></span>
          </div>
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <Activity className="w-3 h-3 animate-pulse" />
            نود زنده
          </span>
        </div>

      </div>
    </div>
  );
};

