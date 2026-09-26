import React, { useState } from 'react';
import { 
  X, 
  Radio, 
  ShieldCheck, 
  Mountain, 
  Building2, 
  Package, 
  Sparkles, 
  Clock, 
  Zap, 
  TrendingUp, 
  TrendingDown, 
  SlidersHorizontal,
  Volume2,
  VolumeX,
  PlusCircle,
  Play,
  Pause,
  KeyRound,
  FileCheck2,
  RotateCcw
} from 'lucide-react';
import { LiveActivityEvent, LiveTickerItem } from '../../types';
import { formatTomanShort, toPersianDigits } from '../../utils/formatters';

interface LiveActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  events: LiveActivityEvent[];
  tickerItems: LiveTickerItem[];
  isLiveActive: boolean;
  onToggleLive: () => void;
  isSoundEnabled: boolean;
  onToggleSound: () => void;
  onEmitCustomEvent: (title: string, desc: string, type: LiveActivityEvent['type']) => void;
  onNavigateTab?: (tab: string) => void;
}

export const LiveActivityModal: React.FC<LiveActivityModalProps> = ({
  isOpen,
  onClose,
  events,
  tickerItems,
  isLiveActive,
  onToggleLive,
  isSoundEnabled,
  onToggleSound,
  onEmitCustomEvent,
  onNavigateTab,
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [customTitle, setCustomTitle] = useState('');
  const [customDesc, setCustomDesc] = useState('');
  const [customCategory, setCustomCategory] = useState<LiveActivityEvent['type']>('mine');
  const [showCustomForm, setShowCustomForm] = useState(false);

  if (!isOpen) return null;

  const filteredEvents = events.filter((ev) => {
    if (filterType === 'all') return true;
    return ev.type === filterType;
  });

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim()) return;
    onEmitCustomEvent(
      customTitle.trim(),
      customDesc.trim() || 'رویداد زنده ثبت شده توسط کاربر در اکوسیستم پیوند ساخت',
      customCategory
    );
    setCustomTitle('');
    setCustomDesc('');
    setShowCustomForm(false);
  };

  const getEventIcon = (type: LiveActivityEvent['type']) => {
    switch (type) {
      case 'mine':
        return <Mountain className="w-4 h-4 text-amber-400" />;
      case 'deal':
        return <Building2 className="w-4 h-4 text-blue-400" />;
      case 'rent':
        return <KeyRound className="w-4 h-4 text-purple-400" />;
      case 'verification':
        return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
      case 'price':
        return <TrendingUp className="w-4 h-4 text-rose-400" />;
      case 'barter':
        return <RotateCcw className="w-4 h-4 text-cyan-400" />;
      default:
        return <Zap className="w-4 h-4 text-amber-400" />;
    }
  };

  const getBadgeStyle = (color: LiveActivityEvent['badgeColor']) => {
    switch (color) {
      case 'emerald':
        return 'glass-emerald text-emerald-300 border-emerald-400/40';
      case 'amber':
        return 'glass-amber text-amber-300 border-amber-400/40';
      case 'blue':
        return 'glass-blue text-blue-300 border-blue-400/40';
      case 'rose':
        return 'glass-rose text-rose-300 border-rose-400/40';
      case 'purple':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      default:
        return 'glass-card text-white border-white/20';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div 
        className="glass-panel-dark w-full max-w-4xl max-h-[90vh] rounded-3xl border border-white/20 shadow-2xl flex flex-col overflow-hidden text-right"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between gap-3 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-emerald-400 text-slate-950 flex items-center justify-center font-black shadow-md">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white">تابلوی پالس و رویدادهای زنده (LIVE STREAM)</h2>
                <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                  isLiveActive ? 'glass-emerald text-emerald-300 border-emerald-400/40' : 'glass-rose text-rose-300 border-rose-400/40'
                }`}>
                  {isLiveActive ? 'متصل به نود مرکزی' : 'پایش متوقف'}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-light mt-0.5">
                جریان لحظه‌ای استعلامات ثبتی، بارگیری معادن، پیشنهادات اتاق معامله و نوسان مصالح
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onToggleLive}
              className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
                isLiveActive ? 'glass-emerald text-emerald-300 border-emerald-400/50' : 'glass-rose text-rose-300 border-rose-400/50'
              }`}
            >
              {isLiveActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span className="hidden sm:inline">{isLiveActive ? 'توقف پخش' : 'شروع پخش'}</span>
            </button>

            <button
              onClick={onToggleSound}
              className={`p-2 rounded-xl border transition-all ${
                isSoundEnabled ? 'glass-amber text-amber-300 border-amber-400/50' : 'glass-panel-dark text-slate-400 border-white/10'
              }`}
              title={isSoundEnabled ? 'هشدار صوتی فعال' : 'هشدار صوتی غیرفعال'}
            >
              {isSoundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live Ticker Quick Row */}
        <div className="bg-slate-950/70 border-b border-white/10 p-3 overflow-x-auto no-scrollbar flex items-center gap-3 text-xs">
          <span className="text-[10px] text-amber-300 font-black shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            شاخص‌های زنده:
          </span>
          {tickerItems.slice(0, 5).map((item) => (
            <div key={item.id} className="glass-card px-2.5 py-1 rounded-xl border border-white/10 shrink-0 flex items-center gap-2">
              <span className="text-slate-300 text-[11px]">{item.name}</span>
              <span className="text-white font-mono font-bold">{formatTomanShort(item.price)}</span>
              <span className={`text-[10px] font-mono font-bold ${item.changePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {item.changePercent >= 0 ? '+' : ''}{toPersianDigits(item.changePercent)}٪
              </span>
            </div>
          ))}
        </div>

        {/* Filter Tabs & Custom Event Button */}
        <div className="p-3 sm:p-4 border-b border-white/10 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            {[
              { id: 'all', label: 'همه رویدادها' },
              { id: 'mine', label: 'معادن و سنگ' },
              { id: 'deal', label: 'اتاق معامله' },
              { id: 'rent', label: 'رهن و اجاره' },
              { id: 'verification', label: 'استعلام ثبتی' },
              { id: 'price', label: 'نوسان قیمت' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  filterType === tab.id
                    ? 'glass-amber text-amber-300 border border-amber-400/50 shadow-sm'
                    : 'glass-panel-dark text-slate-400 hover:text-white border border-white/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowCustomForm(!showCustomForm)}
            className="text-xs font-bold px-3 py-1.5 rounded-xl glass-emerald text-emerald-300 hover:brightness-110 border border-emerald-400/40 flex items-center gap-1.5 transition-all shadow-sm"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>ثبت رویداد تست زنده</span>
          </button>
        </div>

        {/* Custom Event Injection Form (Collapsible) */}
        {showCustomForm && (
          <form onSubmit={handleCreateCustom} className="p-4 bg-emerald-950/30 border-b border-emerald-500/30 space-y-3 animate-in fade-in duration-150">
            <p className="text-xs font-bold text-emerald-300">ارسال رویداد آنی به شبکه زنده پیوند ساخت:</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="عنوان رویداد (مثلاً: استعلام جدید ملک PYS-104)"
                className="bg-slate-900 border border-white/20 rounded-xl px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400"
                required
              />
              <input
                type="text"
                value={customDesc}
                onChange={(e) => setCustomDesc(e.target.value)}
                placeholder="توضیحات تکمیلی یا جزئیات"
                className="bg-slate-900 border border-white/20 rounded-xl px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400"
              />
              <select
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value as LiveActivityEvent['type'])}
                className="bg-slate-900 border border-white/20 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-400"
              >
                <option value="mine">سینه کار معدن</option>
                <option value="deal">اتاق معامله</option>
                <option value="rent">رهن و اجاره</option>
                <option value="verification">استعلام ثبتی</option>
                <option value="price">نوسان مصالح</option>
                <option value="barter">میز تهاتر</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowCustomForm(false)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
              >
                انصراف
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-bold glass-emerald text-white rounded-xl border border-emerald-400/50 shadow"
              >
                ارسال فوری به جریان زنده
              </button>
            </div>
          </form>
        )}

        {/* Events Feed List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              رویدادی در این دسته یافت نشد. منتظر پالس بعدی جریان زنده باشید...
            </div>
          ) : (
            filteredEvents.map((ev) => (
              <div
                key={ev.id}
                className="glass-card hover:bg-white/10 p-4 rounded-2xl border border-white/10 transition-all hover:scale-[1.01] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-glass-3d"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl glass-panel-dark border border-white/15 flex items-center justify-center shrink-0 mt-0.5">
                    {getEventIcon(ev.type)}
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${getBadgeStyle(ev.badgeColor)}`}>
                        {ev.badge}
                      </span>
                      <h4 className="text-xs sm:text-sm font-extrabold text-white">{ev.title}</h4>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-light">{ev.description}</p>
                    <div className="flex items-center gap-3 text-[10px] text-slate-400 pt-1">
                      <span>عامل: <strong className="text-slate-200">{ev.actor}</strong></span>
                      {ev.amount && (
                        <span>مقدار: <strong className="text-amber-300 font-mono">{formatTomanShort(ev.amount)} {ev.unit || 'تومان'}</strong></span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center sm:flex-col items-end justify-between sm:justify-center gap-1 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10">
                  <span className="text-[11px] font-mono text-amber-400 flex items-center gap-1 font-bold">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {ev.timestamp}
                  </span>
                  
                  {onNavigateTab && (
                    <button
                      onClick={() => {
                        onClose();
                        if (ev.type === 'mine' || ev.type === 'price') onNavigateTab('materials');
                        else if (ev.type === 'deal') onNavigateTab('deal_room');
                        else if (ev.type === 'rent') onNavigateTab('market');
                        else onNavigateTab('market');
                      }}
                      className="text-[10px] text-emerald-400 hover:text-emerald-300 underline font-medium"
                    >
                      مشاهده بخش مربوطه ←
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-950/80 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <span>رویدادهای زنده ثبت‌شده: <strong className="text-amber-400 font-mono">{toPersianDigits(events.length)}</strong> مورد</span>
          <span className="text-[11px]">پروتکل اختصاصی همگام‌سازی لحظه‌ای پیوند ساخت</span>
        </div>

      </div>
    </div>
  );
};
