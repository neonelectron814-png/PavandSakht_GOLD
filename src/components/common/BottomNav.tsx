import React from 'react';
import { motion } from 'motion/react';
import { 
  Home, 
  LayoutGrid, 
  Plus, 
  MessageSquare, 
  User 
} from 'lucide-react';
import { toPersianDigits } from '../../utils/formatters';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenSubmitModal: () => void;
  unreadNotificationsCount?: number;
  onOpenMoreMenu: () => void;
  isMoreMenuOpen?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  onOpenSubmitModal,
  unreadNotificationsCount = 0,
  onOpenMoreMenu,
  isMoreMenuOpen = false,
}) => {
  const isHome = activeTab === 'home' && !isMoreMenuOpen;
  const isCategories = isMoreMenuOpen || activeTab === 'categories';
  const isNotifications = activeTab === 'notifications' && !isMoreMenuOpen;
  const isProfile = activeTab === 'profile' && !isMoreMenuOpen;

  return (
    <div className="fixed bottom-3 left-0 right-0 z-40 px-3 flex justify-center pointer-events-none">
      <nav 
        className="pointer-events-auto w-full max-w-[370px] bg-white/95 backdrop-blur-xl border border-[#e5d8be] shadow-[0_8px_28px_rgba(180,130,40,0.14)] rounded-[28px] px-2 py-1 flex items-center justify-around select-none transition-all"
        dir="rtl" 
        aria-label="ناوبری اصلی"
      >
        {/* 1. پروفایل (Rightmost in RTL) */}
        <button
          onClick={() => onTabChange('profile')}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-all cursor-pointer select-none rounded-2xl ${
            isProfile ? 'text-[#845c1a] bg-amber-500/10' : 'text-[#a88243] hover:text-[#845c1a]'
          }`}
        >
          <User className={`w-4.5 h-4.5 transition-colors ${isProfile ? 'stroke-[2.5] text-[#9a7024]' : 'stroke-[2] text-[#a88243]'}`} />
          <span className={`text-[11.5px] mt-0.5 ${isProfile ? 'font-black text-[#845c1a]' : 'font-extrabold text-[#7c561b]'}`}>
            پروفایل
          </span>
        </button>

        {/* 2. پیام‌ها */}
        <button
          onClick={() => onTabChange('notifications')}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-all relative cursor-pointer select-none rounded-2xl ${
            isNotifications ? 'text-[#845c1a] bg-amber-500/10' : 'text-[#a88243] hover:text-[#845c1a]'
          }`}
        >
          <div className="relative">
            <MessageSquare className={`w-4.5 h-4.5 transition-colors ${isNotifications ? 'stroke-[2.5] text-[#9a7024]' : 'stroke-[2] text-[#a88243]'}`} />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1.5 w-3.5 h-3.5 bg-amber-600 text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-xs">
                {toPersianDigits(unreadNotificationsCount)}
              </span>
            )}
          </div>
          <span className={`text-[11.5px] mt-0.5 ${isNotifications ? 'font-black text-[#845c1a]' : 'font-extrabold text-[#7c561b]'}`}>
            پیام‌ها
          </span>
        </button>

        {/* 3. Center Highlighted Button: ثبت آگهی with Golden Circle & White Plus */}
        <div className="flex-1 flex flex-col items-center justify-center -mt-3.5 relative">
          <motion.button
            whileTap={{ scale: 0.92 }}
            whileHover={{ y: -2 }}
            onClick={onOpenSubmitModal}
            className="w-11 h-11 rounded-full btn-3d-gold flex items-center justify-center text-[#221503] cursor-pointer transition-transform ring-2 ring-white shadow-lg"
            aria-label="ثبت آگهی جدید"
          >
            <Plus className="w-5.5 h-5.5 stroke-[3] text-[#221503]" />
          </motion.button>
          <span className="text-[11.5px] font-black mt-0.5 text-[#5e3e09] tracking-tight">
            ثبت آگهی
          </span>
        </div>

        {/* 4. دسته‌بندی‌ها */}
        <button
          onClick={onOpenMoreMenu}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-all cursor-pointer select-none rounded-2xl ${
            isCategories ? 'text-[#845c1a] bg-amber-500/10' : 'text-[#a88243] hover:text-[#845c1a]'
          }`}
        >
          <LayoutGrid className={`w-4.5 h-4.5 transition-colors ${isCategories ? 'stroke-[2.5] text-[#9a7024]' : 'stroke-[2] text-[#a88243]'}`} />
          <span className={`text-[11.5px] mt-0.5 ${isCategories ? 'font-black text-[#845c1a]' : 'font-extrabold text-[#7c561b]'}`}>
            دسته‌بندی‌ها
          </span>
        </button>

        {/* 5. خانه (Leftmost in RTL, Active) */}
        <button
          onClick={() => onTabChange('home')}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-all cursor-pointer select-none rounded-2xl ${
            isHome ? 'text-[#845c1a] bg-amber-500/10' : 'text-[#a88243] hover:text-[#845c1a]'
          }`}
        >
          <Home className={`w-4.5 h-4.5 transition-colors ${isHome ? 'stroke-[2.5] text-[#9a7024] fill-[#caa758]' : 'stroke-[2] text-[#a88243]'}`} />
          <span className={`text-[11.5px] mt-0.5 ${isHome ? 'font-black text-[#845c1a]' : 'font-extrabold text-[#7c561b]'}`}>
            خانه
          </span>
        </button>

      </nav>
    </div>
  );
};
