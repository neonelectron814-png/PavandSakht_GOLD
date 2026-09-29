import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  RotateCcw,
  CheckCircle2,
  ArrowUpRight
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
        return <Mountain className="w-4 h-4 text-amber-700" />;
      case 'deal':
        return <Building2 className="w-4 h-4 text-emerald-700" />;
      case 'rent':
        return <KeyRound className="w-4 h-4 text-blue-700" />;
      case 'verification':
        return <ShieldCheck className="w-4 h-4 text-teal-700" />;
      case 'price':
        return <TrendingUp className="w-4 h-4 text-rose-700" />;
      case 'barter':
        return <RotateCcw className="w-4 h-4 text-indigo-700" />;
      default:
        return <Zap className="w-4 h-4 text-amber-700" />;
    }
  };

  const getBadgeStyle = (color: LiveActivityEvent['badgeColor']) => {
    switch (color) {
      case 'emerald':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'amber':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'blue':
        return 'bg-blue-100 text-blue-900 border-blue-300';
      case 'rose':
        return 'bg-rose-100 text-rose-900 border-rose-300';
      case 'purple':
        return 'bg-purple-100 text-purple-900 border-purple-300';
      default:
        return 'bg-amber-50 text-amber-950 border-amber-200';
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/45 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
      dir="rtl"
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="w-full max-w-lg max-h-[88vh] bg-[#fbf9f4] rounded-[32px] border-2 border-[#dfc282] shadow-[0_20px_60px_rgba(160,118,48,0.22)] flex flex-col overflow-hidden text-right select-none relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Gold Accent Bar */}
        <div className="w-full h-1.5 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-700 shrink-0" />

        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[#e8dfcf] flex items-center justify-between gap-3 bg-white/90 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl btn-3d-gold flex items-center justify-center font-black shadow-xs shrink-0">
              <Radio className={`w-5 h-5 text-[#2c1b04] ${isLiveActive ? 'animate-pulse' : ''}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-black text-slate-900">پالس زنده و تابلوی معاملات آنی</h2>
                <span className={`inline-flex items-center gap-1 text-[9.5px] font-black px-2 py-0.5 rounded-full border ${
                  isLiveActive ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-rose-100 text-rose-800 border-rose-300'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isLiveActive ? 'bg-emerald-600 animate-ping' : 'bg-rose-600'}`} />
                  {isLiveActive ? 'شبکه زنده فعال' : 'پایش متوقف'}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 font-semibold mt-0.5">
                جریان لحظه‌ای استعلامات، معادن، متریال و پیشنهادات اتاق معامله
              </p>
            </div>
          </div>

          {/* Top Actions: Play/Pause, Sound, Close */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={onToggleLive}
              className={`p-2 rounded-xl border text-xs font-bold flex items-center justify-center transition-all cursor-pointer shadow-2xs ${
                isLiveActive ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100' : 'bg-rose-50 text-rose-800 border-rose-300 hover:bg-rose-100'
              }`}
              title={isLiveActive ? 'توقف پایش زنده' : 'شروع مجدد'}
            >
              {isLiveActive ? <Pause className="w-4 h-4 text-emerald-800" /> : <Play className="w-4 h-4 text-rose-800" />}
            </button>

            <button
              onClick={onToggleSound}
              className={`p-2 rounded-xl border transition-all cursor-pointer shadow-2xs ${
                isSoundEnabled ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-white text-slate-500 border-[#ded5c5] hover:bg-amber-50'
              }`}
              title={isSoundEnabled ? 'هشدار صوتی فعال' : 'هشدار صوتی غیرفعال'}
            >
              {isSoundEnabled ? <Volume2 className="w-4 h-4 text-amber-800" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl btn-3d-gold flex items-center justify-center cursor-pointer shadow-xs text-[#2c1b04] active:scale-95 transition-transform"
              title="بستن پنجره"
              aria-label="بستن"
            >
              <X className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        </div>

        {/* Live Ticker Strip */}
        <div className="bg-[#f5ede0] border-b border-[#e5d9c5] py-2 px-3 overflow-x-auto no-scrollbar flex items-center gap-2 text-xs shrink-0">
          <span className="text-[10.5px] text-[#845c1a] font-black shrink-0 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            شاخص‌های زنده:
          </span>
          {tickerItems.slice(0, 5).map((item) => (
            <div key={item.id} className="bg-white px-2.5 py-1 rounded-xl border border-[#ded5c5] shrink-0 flex items-center gap-1.5 shadow-2xs">
              <span className="text-slate-800 font-bold text-[11px]">{item.name}</span>
              <span className="text-slate-950 font-black text-[11px]">{formatTomanShort(item.price)}</span>
              <span className={`text-[10px] font-black ${item.changePercent >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                {item.changePercent >= 0 ? '+' : ''}{toPersianDigits(item.changePercent)}٪
              </span>
            </div>
          ))}
        </div>

        {/* Filter Tabs & Test Action */}
        <div className="p-3 border-b border-[#ebdcc7] flex flex-wrap items-center justify-between gap-2 bg-[#faf7f0] shrink-0">
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
                className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all cursor-pointer ${
                  filterType === tab.id
                    ? 'btn-3d-gold text-[#221503] shadow-xs'
                    : 'bg-white text-slate-700 border border-[#dfd5c4] hover:bg-amber-50/80 shadow-2xs'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowCustomForm(!showCustomForm)}
            className="text-[11px] font-black px-2.5 py-1.5 rounded-xl bg-white border border-[#caa758] text-[#845c1a] hover:bg-amber-50 flex items-center gap-1 transition-all shadow-2xs cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>ثبت رویداد تست</span>
          </button>
        </div>

        {/* Custom Event Injection Form */}
        {showCustomForm && (
          <form onSubmit={handleCreateCustom} className="p-3.5 bg-amber-50/90 border-b border-amber-200/80 space-y-2.5 shrink-0">
            <p className="text-xs font-black text-amber-950">ارسال رویداد فوری به شبکه زنده پیوند ساخت:</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="عنوان رویداد (مثلاً: استعلام جدید فایل PYS-104)"
                className="bg-white border border-[#dfc282] rounded-xl px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-600 font-bold"
                required
              />
              <input
                type="text"
                value={customDesc}
                onChange={(e) => setCustomDesc(e.target.value)}
                placeholder="توضیحات تکمیلی یا شرایط"
                className="bg-white border border-[#dfc282] rounded-xl px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-600 font-bold"
              />
              <select
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value as LiveActivityEvent['type'])}
                className="bg-white border border-[#dfc282] rounded-xl px-3 py-2 text-slate-900 font-bold focus:outline-none focus:border-amber-600"
              >
                <option value="mine">سینه کار معدن</option>
                <option value="deal">اتاق معامله</option>
                <option value="rent">رهن و اجاره</option>
                <option value="verification">استعلام ثبتی</option>
                <option value="price">نوسان مصالح</option>
                <option value="barter">میز تهاتر</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowCustomForm(false)}
                className="px-3 py-1 text-xs text-slate-600 hover:text-slate-900 font-bold cursor-pointer"
              >
                انصراف
              </button>
              <button
                type="submit"
                className="btn-3d-gold px-4 py-1.5 text-xs font-black text-[#221503] rounded-xl shadow-xs cursor-pointer"
              >
                ارسال به جریان زنده
              </button>
            </div>
          </form>
        )}

        {/* Events Feed List */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2.5">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs font-bold">
              رویدادی در این دسته یافت نشد. منتظر پالس بعدی جریان زنده باشید...
            </div>
          ) : (
            filteredEvents.map((ev) => (
              <motion.div
                key={ev.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white hover:bg-amber-50/40 p-3.5 rounded-2xl border-2 border-[#e6dfd3] hover:border-[#caa758] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[0_2px_8px_rgba(0,0,0,0.03)] group"
              >
                <div className="flex items-start gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#faf6ee] border border-[#dfc282] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    {getEventIcon(ev.type)}
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className={`text-[9.5px] font-black px-2 py-0.5 rounded-full border ${getBadgeStyle(ev.badgeColor)}`}>
                        {ev.badge}
                      </span>
                      <h4 className="text-xs sm:text-sm font-black text-slate-950">{ev.title}</h4>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed font-bold">{ev.description}</p>
                    <div className="flex items-center gap-3 text-[10.5px] text-slate-500 pt-0.5">
                      <span>عامل: <strong className="text-slate-900 font-black">{ev.actor}</strong></span>
                      {ev.amount && (
                        <span>مبلغ/حجم: <strong className="text-amber-800 font-black">{formatTomanShort(ev.amount)} {ev.unit || 'تومان'}</strong></span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center sm:flex-col items-end justify-between sm:justify-center gap-1 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#f0e8db]">
                  <span className="text-[10.5px] text-amber-800 flex items-center gap-1 font-black">
                    <Clock className="w-3 h-3 text-amber-600" />
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
                      className="text-[11px] text-amber-700 hover:text-amber-900 font-black flex items-center gap-0.5 cursor-pointer group-hover:underline"
                    >
                      <span>ورود به بخش مربوطه</span>
                      <ArrowUpRight className="w-3 h-3 text-amber-700" />
                    </button>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-[#f5ede0] border-t border-[#e2d8c3] flex items-center justify-between text-xs text-slate-700 shrink-0">
          <span className="text-[11px] font-bold">
            رویدادهای ثبت‌شده: <strong className="text-amber-900 font-black">{toPersianDigits(events.length)}</strong> پالس
          </span>
          <span className="text-[10px] text-amber-950 font-black">
            پروتکل اختصاصی همگام‌سازی لحظه‌ای پیوند ساخت
          </span>
        </div>

      </motion.div>
    </div>
  );
};
