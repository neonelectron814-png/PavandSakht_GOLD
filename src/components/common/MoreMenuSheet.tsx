import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Sparkles, 
  RefreshCw, 
  Handshake, 
  Layers, 
  Hammer, 
  Flame, 
  TrendingUp, 
  User, 
  ShieldCheck, 
  Radio, 
  Bell, 
  Compass, 
  Lock,
  Headphones,
  CheckCircle2,
  Package,
  HardHat
} from 'lucide-react';
import { UserRole } from '../../types';
import { toPersianDigits } from '../../utils/formatters';

interface MoreMenuSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: string) => void;
  onOpenLiveFeed: () => void;
  activeRole: UserRole;
  activeTab: string;
  unreadNotificationsCount: number;
}

export const MoreMenuSheet: React.FC<MoreMenuSheetProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  onOpenLiveFeed,
  activeRole,
  activeTab,
  unreadNotificationsCount,
}) => {
  const [filterCategory, setFilterCategory] = useState<'all' | 'specialized' | 'tools'>('all');

  const allIcons = [
    {
      id: 'partnership',
      category: 'specialized',
      title: 'مشارکت در ساخت',
      subtitle: 'سرمایه‌گذاران و پروژه‌ها',
      icon: Handshake,
      badge: 'ویژه',
      badgeBg: 'bg-amber-100 text-amber-800 border-amber-300',
    },
    {
      id: 'materials',
      category: 'specialized',
      title: 'بازار متریال و مصالح',
      subtitle: 'استعلام قیمت دست اول',
      icon: Package,
      badge: 'قیمت روز',
      badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    },
    {
      id: 'craftsmen',
      category: 'specialized',
      title: 'پیوند عمران و مجریان',
      subtitle: 'مهندسان و اکیپ‌های اجرایی',
      icon: HardHat,
      badge: 'تأییدشده',
      badgeBg: 'bg-blue-100 text-blue-800 border-blue-300',
    },
    {
      id: 'rate_cutter',
      category: 'specialized',
      title: 'تخفیفات ویژه و کمپین‌ها',
      subtitle: 'فرصت‌های استثنایی زیر قیمت',
      icon: Flame,
      badge: 'شکار قیمت',
      badgeBg: 'bg-rose-100 text-rose-800 border-rose-300',
    },
    {
      id: 'deal_room',
      category: 'specialized',
      title: 'اتاق معامله محرمانه',
      subtitle: 'مذاکرات امن املاک و سرمایه',
      icon: Lock,
      badge: 'محرمانه',
      badgeBg: 'bg-amber-100 text-amber-800 border-amber-300',
    },
    {
      id: 'barter',
      category: 'specialized',
      title: 'تهاتر هوشمند ملک و مصالح',
      subtitle: 'مبادله املاک با متریال و خودرو',
      icon: RefreshCw,
      badge: 'تهاتر',
      badgeBg: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    },
    {
      id: 'price_data',
      category: 'tools',
      title: 'دیتاسنتر قیمت و شاخص',
      subtitle: 'نمودارهای رسمی تحلیلی مسکن',
      icon: TrendingUp,
      badge: 'داده زنده',
      badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    },
    {
      id: 'audio_analysis',
      category: 'tools',
      title: 'استعلام صوتی و تحلیل',
      subtitle: 'تحلیل صوتی نیازمندی ملکی',
      icon: Headphones,
      badge: 'هوشمند',
      badgeBg: 'bg-purple-100 text-purple-800 border-purple-300',
    },
    {
      id: 'admin_panel',
      category: 'tools',
      title: 'پنل نظارت و اعتبارسنجی',
      subtitle: 'کارشناسی و صدور نشان سلامت',
      icon: ShieldCheck,
      badge: 'مدیریت',
      badgeBg: 'bg-slate-100 text-slate-800 border-slate-300',
    },
    {
      id: 'role_dashboard',
      category: 'tools',
      title: 'داشبورد کاربری من',
      subtitle: 'فایل‌ها، استعلام‌ها و پیام‌ها',
      icon: User,
      badge: 'شخصی',
      badgeBg: 'bg-amber-100 text-amber-800 border-amber-300',
    },
  ];

  const displayedIcons = allIcons.filter(item => {
    if (filterCategory === 'all') return true;
    return item.category === filterCategory;
  });

  const handleItemClick = (id: string) => {
    onClose();
    if (id === 'live_feed_action') {
      onOpenLiveFeed();
    } else {
      onNavigateTab(id);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-auto" dir="rtl">
          {/* Backdrop Dimmer */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Floating Light Card */}
          <motion.div
            key="modal-card"
            initial={{ opacity: 0, y: 120, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-20 left-3 right-3 max-w-lg mx-auto z-50 bg-white/98 border border-[#ede8de] rounded-[28px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] flex flex-col text-slate-900 overflow-hidden backdrop-blur-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Amber Accent Line */}
            <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#caa758] to-transparent" />

            {/* Drag Handle */}
            <div className="w-full flex justify-center pt-2.5 pb-1 cursor-pointer" onClick={onClose}>
              <div className="w-12 h-1 bg-slate-300 rounded-full" />
            </div>

            {/* Header */}
            <div className="px-5 py-3 flex items-center justify-between border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
                  <Sparkles className="w-4 h-4 text-[#caa758]" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">امکانات و خدمات پیوند ساخت</h3>
                  <p className="text-[11px] text-slate-500">دسترسی سریع به سامانه‌ها و ماژول‌ها</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Category Filter Tabs */}
            <div className="px-5 pt-3 pb-1 flex gap-2">
              <button
                onClick={() => setFilterCategory('all')}
                className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                  filterCategory === 'all'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                همه بخش‌ها
              </button>
              <button
                onClick={() => setFilterCategory('specialized')}
                className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                  filterCategory === 'specialized'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                بخش‌های تخصصی
              </button>
              <button
                onClick={() => setFilterCategory('tools')}
                className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                  filterCategory === 'tools'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                ابزارها و داده‌ها
              </button>
            </div>

            {/* Grid of Items */}
            <div className="p-4 grid grid-cols-2 gap-2.5 max-h-[50vh] overflow-y-auto">
              {displayedIcons.map((item) => {
                const Icon = item.icon;
                const isItemActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className={`p-3 rounded-2xl border text-right transition-all flex items-start gap-2.5 cursor-pointer ${
                      isItemActive
                        ? 'bg-amber-50 border-amber-400 text-amber-900 shadow-sm'
                        : 'bg-white border-slate-200/80 hover:border-amber-300 hover:bg-amber-50/40 text-slate-800'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-5 h-5 text-[#b88e36]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-bold text-slate-900 truncate">{item.title}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 truncate mt-0.5">{item.subtitle}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Footer Close */}
            <div className="p-3 bg-[#fdfcfa] border-t border-slate-100 flex justify-end">
              <button
                onClick={onClose}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer text-center"
              >
                بستن منو
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
