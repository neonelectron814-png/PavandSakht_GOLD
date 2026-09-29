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
  HardHat,
  Building2,
  CreditCard,
  Bot,
  Box
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
      id: 'market',
      category: 'specialized',
      title: 'املاک و مستغلات',
      subtitle: 'رهن و اجاره با تبدیل، فروش و زمین',
      icon: Building2,
      badge: 'رهن و فروش',
      badgeBg: 'bg-amber-100 text-amber-800 border-amber-300',
    },
    {
      id: 'partnership',
      category: 'specialized',
      title: 'مشارکت در ساخت',
      subtitle: 'اتصال مالکین به سازندگان رتبه‌دار',
      icon: Handshake,
      badge: 'ویژه',
      badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    },
    {
      id: 'materials',
      category: 'specialized',
      title: 'مصالح و متریال ساختمانی',
      subtitle: 'کاشی، سیمان، میلگرد، شیشه، لوله و درب',
      icon: Package,
      badge: 'قیمت بورس',
      badgeBg: 'bg-blue-100 text-blue-800 border-blue-300',
    },
    {
      id: 'industrial',
      category: 'specialized',
      title: 'کارخانجات و شهرک‌های صنعتی',
      subtitle: 'تأمین مستقیم عمده از تولیدکنندگان دسته اول',
      icon: Layers,
      badge: 'مستقیم کارخانه',
      badgeBg: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    },
    {
      id: 'craftsmen',
      category: 'specialized',
      title: 'پیوند عمران و معادن سنگین',
      subtitle: 'ماشین‌آلات سنگین، معادن و راه‌سازی',
      icon: HardHat,
      badge: 'تأییدشده',
      badgeBg: 'bg-purple-100 text-purple-800 border-purple-300',
    },
    {
      id: 'rate_cutter',
      category: 'specialized',
      title: 'فرصت‌های طلایی و نرخ‌شکن',
      subtitle: 'فروش زیر قیمت کارشناسی و مزایدات',
      icon: Flame,
      badge: 'شکار قیمت',
      badgeBg: 'bg-rose-100 text-rose-800 border-rose-300',
    },
    {
      id: 'price_data',
      category: 'tools',
      title: 'استعلام قیمت و متراژ',
      subtitle: 'شاخص رسمی آهن، میلگرد، سیمان و ملک',
      icon: TrendingUp,
      badge: 'داده زنده',
      badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    },
    {
      id: 'contractors',
      category: 'specialized',
      title: 'پیمانکاران و مجریان ساخت',
      subtitle: 'استادکاران، گچ‌کار، سنگ‌کار و مهندسین',
      icon: Hammer,
      badge: 'دارای رتبه',
      badgeBg: 'bg-teal-100 text-teal-800 border-teal-300',
    },
    {
      id: 'installments',
      category: 'specialized',
      title: 'فروش اقساطی ملک و تجهیزات',
      subtitle: 'برنامه‌های منعطف اقساطی متریال و ماشین‌آلات',
      icon: CreditCard,
      badge: 'اقساط ویژه',
      badgeBg: 'bg-amber-100 text-amber-800 border-amber-300',
    },
    {
      id: 'customer_requests',
      category: 'tools',
      title: 'درخواست‌های مشتری و تطبیق هوشمند',
      subtitle: 'ثبت نیازمندی و دریافت آنی استعلام از تأمین‌کنندگان',
      icon: Bot,
      badge: 'هوشمند',
      badgeBg: 'bg-sky-100 text-sky-800 border-sky-300',
    },
    {
      id: 'building_3d',
      category: 'tools',
      title: 'استودیو هوش مصنوعی مدل‌سازی ۳ بعدی',
      subtitle: 'شبیه‌سازی ۳ بعدی ساختمان، متریال، متره و سازه',
      icon: Box,
      badge: '3D AI',
      badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
    },
    {
      id: 'deal_room',
      category: 'tools',
      title: 'اتاق معامله امن (Deal Room)',
      subtitle: 'استعلام ثنا، اصالت سند، ارزیابی ۳گانه و امین',
      icon: Lock,
      badge: 'محرمانه',
      badgeBg: 'bg-amber-100 text-amber-800 border-amber-300',
    },
    {
      id: 'barter',
      category: 'specialized',
      title: 'اتاق تهاتر هوشمند',
      subtitle: 'تهاتر ملک با ملک، ملک با متریال و ماشین‌آلات',
      icon: RefreshCw,
      badge: 'تهاتر',
      badgeBg: 'bg-indigo-100 text-indigo-800 border-indigo-300',
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
      title: 'پنل نظارت و اعتبارسنجی ضد تقلب',
      subtitle: 'سامانه غربالگری و حذف آگهی‌های صوری',
      icon: ShieldCheck,
      badge: 'نظارت',
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
            className="fixed bottom-20 left-3 right-3 max-w-lg mx-auto z-50 bg-[#fbf9f4] border-2 border-[#dfc282] rounded-[32px] shadow-[0_20px_60px_rgba(160,118,48,0.25)] flex flex-col text-slate-900 overflow-hidden backdrop-blur-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-5 py-3.5 flex items-center justify-between border-b border-[#e8dfcf] bg-white/70">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl btn-3d-gold flex items-center justify-center text-[#2c1b04] shadow-2xs">
                  <Sparkles className="w-4.5 h-4.5 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="font-black text-slate-950 text-sm sm:text-base">امکانات و خدمات پیوند ساخت</h3>
                  <p className="text-xs text-slate-600 font-bold mt-0.5">دسترسی سریع به سامانه‌ها و ماژول‌ها</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-xl btn-3d-gold text-[#2c1b04] flex items-center justify-center cursor-pointer shadow-2xs active:scale-95 transition-transform"
                aria-label="بستن"
              >
                <X className="w-4 h-4 stroke-[3]" />
              </button>
            </div>

            {/* Category Filter Tabs */}
            <div className="px-4 pt-3 pb-1 flex gap-2">
              <button
                onClick={() => setFilterCategory('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer transition-all ${
                  filterCategory === 'all'
                    ? 'btn-3d-gold text-[#2c1b04] shadow-xs'
                    : 'bg-white text-slate-700 border border-[#ded5c5] hover:bg-amber-50/70'
                }`}
              >
                همه بخش‌ها
              </button>
              <button
                onClick={() => setFilterCategory('specialized')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer transition-all ${
                  filterCategory === 'specialized'
                    ? 'btn-3d-gold text-[#2c1b04] shadow-xs'
                    : 'bg-white text-slate-700 border border-[#ded5c5] hover:bg-amber-50/70'
                }`}
              >
                بخش‌های تخصصی
              </button>
              <button
                onClick={() => setFilterCategory('tools')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer transition-all ${
                  filterCategory === 'tools'
                    ? 'btn-3d-gold text-[#2c1b04] shadow-xs'
                    : 'bg-white text-slate-700 border border-[#ded5c5] hover:bg-amber-50/70'
                }`}
              >
                ابزارها و داده‌ها
              </button>
            </div>

            {/* Grid of Items */}
            <div className="p-3.5 grid grid-cols-2 gap-2.5 max-h-[50vh] overflow-y-auto no-scrollbar">
              {displayedIcons.map((item) => {
                const Icon = item.icon;
                const isItemActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className={`p-2.5 rounded-[20px] border-2 text-right transition-all flex items-start gap-2.5 cursor-pointer shadow-[0_3px_0_#d5c8b2] ${
                      isItemActive
                        ? 'bg-amber-50/90 border-[#caa758] text-amber-950 shadow-[0_4px_0_#b88a31]'
                        : 'bg-white border-[#e6dfd3] hover:border-[#caa758] hover:bg-amber-50/30 text-slate-900'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-xl btn-3d-gold flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                      <Icon className="w-4.5 h-4.5 text-[#2c1b04] stroke-[2.2]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs sm:text-[13px] font-black text-slate-950 truncate block">{item.title}</span>
                      <p className="text-[10.5px] font-bold text-[#644b1c] truncate mt-0.5">{item.subtitle}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Footer Close */}
            <div className="p-3 bg-[#f5ede0] border-t border-[#e2d8c3] flex justify-end">
              <button
                onClick={onClose}
                className="w-full py-2.5 btn-3d-gold text-[#2c1b04] text-xs font-black rounded-xl shadow-xs cursor-pointer text-center active:scale-98 transition-transform"
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
