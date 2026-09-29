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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4.5 sm:p-5 rounded-[26px] border-2 border-[#dfc282] shadow-[0_4px_16px_rgba(180,130,40,0.1)] relative overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl btn-3d-gold flex items-center justify-center text-[#2c1b04] shrink-0 shadow-2xs">
            <Bell className="w-4.5 h-4.5 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-black text-slate-950">
              پیام‌ها و اعلان‌های سیستم
            </h1>
            <p className="text-xs sm:text-[13px] text-slate-700 font-bold mt-0.5">
              اطلاعیه‌های اتاق معامله، اعتبارسنجی اسناد، کارشناسی و هشدارهای جدید
            </p>
          </div>
        </div>

        <button
          onClick={onMarkAllAsRead}
          className="btn-3d-gold text-[11px] font-black text-[#2c1b04] px-2.5 py-1.5 rounded-lg shadow-2xs self-start sm:self-auto cursor-pointer active:scale-95 transition-transform shrink-0"
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
            className={`p-4 rounded-[22px] border-2 transition-all cursor-pointer ${
              n.read
                ? 'bg-white border-[#e6dfd3] hover:border-[#caa758] text-slate-900 shadow-[0_3px_0_#d5c8b2]'
                : 'bg-[#fffdfa] border-[#dfc282] text-slate-950 shadow-[0_3px_0_#caa758,0_6px_14px_rgba(180,130,40,0.08)]'
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className={`text-[14.5px] sm:text-base flex items-center gap-2 ${n.read ? 'font-black text-slate-800' : 'font-black text-slate-950'}`}>
                {!n.read ? (
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-600 ring-2 ring-amber-200 shrink-0 animate-pulse" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                )}
                <span>{n.title}</span>
              </span>
              <span className="text-xs font-black text-amber-900 shrink-0">{n.date}</span>
            </div>
            
            {/* Body Text: High Contrast, Solid Dark Slate */}
            <p className={`text-xs sm:text-[13px] leading-relaxed ${n.read ? 'text-slate-600 font-bold' : 'text-slate-900 font-black'}`}>
              {n.message}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
};
