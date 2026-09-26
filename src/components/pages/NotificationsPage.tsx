import React from 'react';
import { Bell, CheckCircle2 } from 'lucide-react';
import { NotificationItem } from '../../types';

interface NotificationsPageProps {
  notifications: NotificationItem[];
  onMarkAllAsRead: () => void;
  onNavigateTab: (tab: string) => void;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({
  notifications,
  onMarkAllAsRead,
  onNavigateTab,
}) => {
  return (
    <div className="space-y-4 pb-16 max-w-3xl mx-auto" dir="rtl">
      
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-[#e2dcd0] shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
        <div>
          <h1 className="text-base sm:text-lg font-black flex items-center gap-2 text-slate-950">
            <Bell className="w-5 h-5 text-amber-600 shrink-0" />
            <span>پیام‌ها و اعلان‌های سیستم</span>
          </h1>
          <p className="text-xs text-slate-600 font-medium mt-1">
            اطلاعیه‌های اتاق معامله، اعتبارسنجی اسناد، کارشناسی و هشدارهای جدید
          </p>
        </div>

        <button
          onClick={onMarkAllAsRead}
          className="text-xs font-black text-amber-900 bg-amber-50 hover:bg-amber-100 transition-colors px-3 py-1.5 rounded-xl border border-amber-300 self-start sm:self-auto cursor-pointer"
        >
          علامت‌گذاری همه به عنوان خوانده‌شده
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            onClick={() => n.linkTab && onNavigateTab(n.linkTab)}
            className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
              n.read
                ? 'bg-white border-[#e6e0d4] text-slate-800 hover:border-amber-300 shadow-xs'
                : 'bg-[#fffaf0] border-[#d8be8a] text-slate-950 font-medium shadow-[0_2px_8px_rgba(180,130,40,0.08)] ring-1 ring-[#e2ca9a]'
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className={`text-xs sm:text-sm flex items-center gap-2 ${n.read ? 'font-bold text-slate-800' : 'font-black text-slate-950'}`}>
                {!n.read ? (
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-600 ring-2 ring-amber-200 shrink-0 animate-pulse" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                )}
                <span>{n.title}</span>
              </span>
              <span className="text-[11px] font-bold text-slate-500 shrink-0">{n.date}</span>
            </div>
            
            {/* Body Text: High Contrast, Solid Dark Slate */}
            <p className={`text-xs leading-relaxed ${n.read ? 'text-slate-600 font-normal' : 'text-slate-900 font-semibold'}`}>
              {n.message}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
};
