import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Sparkles, 
  CheckCircle2, 
  Lock,
  ExternalLink
} from 'lucide-react';
import { toPersianDigits } from '../../utils/formatters';
import { PayvandLogoV3, SvgGoldDefs } from './Golden3DIcons';

interface FullscreenPromoVideoModalProps {
  isOpen: boolean;
  onFinished: () => void;
  durationSeconds?: number;
  sponsorName?: string;
  sponsorTagline?: string;
  sponsorUrl?: string;
  videoUrl?: string;
}

export const FullscreenPromoVideoModal: React.FC<FullscreenPromoVideoModalProps> = ({
  isOpen,
  onFinished,
  durationSeconds = 10,
  sponsorName = 'گروه انبوه‌سازی و مهندسی سازه‌گستر پرشین',
  sponsorTagline = 'بزرگ‌ترین مجری ابرپروژه‌های مدرن و پایدار ساختمانی در کشور',
  sponsorUrl = 'https://payvand-sakht.ir/sponsor',
  videoUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState(durationSeconds);
  const [isMuted, setIsMuted] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Keep a stable ref to onFinished to avoid re-triggering timer on parent re-renders
  const onFinishedRef = useRef(onFinished);
  useEffect(() => {
    onFinishedRef.current = onFinished;
  });

  const startTimeRef = useRef<number>(0);
  const hasTriggeredRef = useRef<boolean>(false);

  // Robust, uninterruptible wall-clock 10-second countdown timer
  useEffect(() => {
    if (!isOpen) {
      setSecondsRemaining(durationSeconds);
      setIsFinished(false);
      hasTriggeredRef.current = false;
      return;
    }

    startTimeRef.current = Date.now();
    hasTriggeredRef.current = false;
    setSecondsRemaining(durationSeconds);
    setIsFinished(false);

    // Disable scrolling when ad is active
    document.body.style.overflow = 'hidden';

    const checkTimer = () => {
      if (hasTriggeredRef.current) return;

      const elapsedSeconds = (Date.now() - startTimeRef.current) / 1000;
      const left = Math.max(0, Math.ceil(durationSeconds - elapsedSeconds));

      setSecondsRemaining(left);

      if (left <= 0) {
        hasTriggeredRef.current = true;
        setIsFinished(true);
        if (intervalId) clearInterval(intervalId);

        // Immediate transition to main app
        setTimeout(() => {
          if (onFinishedRef.current) {
            onFinishedRef.current();
          }
        }, 150);
      }
    };

    const intervalId = setInterval(checkTimer, 200);

    // Play video
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {
        if (videoRef.current) {
          videoRef.current.muted = true;
          setIsMuted(true);
          videoRef.current.play().catch(() => {});
        }
      });
    }

    return () => {
      clearInterval(intervalId);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, durationSeconds]);

  if (!isOpen) return null;

  // Handle clicking anywhere on the screen -> Open advertised sponsor website in new tab
  const handleScreenClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    // Don't trigger link if clicking specifically on the sound mute button
    if (target.closest('button')) {
      return;
    }

    try {
      window.open(sponsorUrl, '_blank', 'noopener,noreferrer');
    } catch {
      window.location.href = sponsorUrl;
    }
  };

  const progressPercent = Math.min(
    100,
    Math.max(0, ((durationSeconds - secondsRemaining) / durationSeconds) * 100)
  );

  return (
    <div 
      onClick={handleScreenClick}
      className="fixed inset-0 z-[99999] bg-black text-white flex flex-col justify-between overflow-hidden select-none font-['Vazirmatn',sans-serif] cursor-pointer" 
      dir="rtl"
      title="برای ورود به وب‌سایت تبلیغ‌شده روی تصویر کلیک کنید"
      onContextMenu={(e) => e.preventDefault()}
    >
      <SvgGoldDefs />

      {/* 100% Full Unobstructed Background Video Player with Poster Fallback */}
      <div className="absolute inset-0 z-0 bg-black flex items-center justify-center">
        <video
          ref={videoRef}
          src={videoUrl}
          poster="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1200"
          playsInline
          autoPlay
          loop
          muted={isMuted}
          className="w-full h-full object-cover opacity-95 filter contrast-105"
        />

        {/* Subtle Edge Vignette (Keeps the entire center 100% clear and cinematic) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/70 pointer-events-none" />
      </div>

      {/* =========================================================================
          TOP HEADER BAR: BRAND, SPONSOR MINI-BADGE, COUNTDOWN & MUTE CONTROLS
          ========================================================================= */}
      <header className="relative z-20 p-4 sm:p-6 flex items-center justify-between gap-3">
        {/* Brand & Sponsor Tag */}
        <div className="flex items-center gap-3 bg-black/75 backdrop-blur-md px-3.5 sm:px-4 py-2 rounded-2xl border border-white/20 shadow-xl">
          <PayvandLogoV3 className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 filter drop-shadow-[0_2px_8px_rgba(218,165,32,0.5)]" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-xs sm:text-sm text-white">پیوندساخت</span>
              <span className="text-[10px] bg-amber-500/30 text-amber-300 border border-amber-400/50 px-2 py-0.5 rounded-full font-bold">
                پیام بازرگانی اختصاصی
              </span>
            </div>
            <p className="text-[10.5px] text-amber-200 font-bold truncate max-w-[220px] sm:max-w-md">
              حامی این بخش: {sponsorName}
            </p>
          </div>
        </div>

        {/* Top Controls: Sound Toggle + Unclosable 10s Countdown */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Audio Mute/Unmute Switch */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (videoRef.current) {
                const nextMuted = !isMuted;
                videoRef.current.muted = nextMuted;
                setIsMuted(nextMuted);
              }
            }}
            className="w-10 h-10 rounded-2xl bg-black/75 hover:bg-black/95 border border-white/25 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-md active:scale-90 shadow-lg"
            title={isMuted ? 'روشن کردن صدا' : 'قطع صدا'}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-amber-300" />
            ) : (
              <Volume2 className="w-5 h-5 text-emerald-400" />
            )}
          </button>

          {/* Undisturbed 10-Second Countdown Badge */}
          <div className="flex items-center gap-2 bg-gradient-to-r from-amber-950/95 to-black/95 border-2 border-amber-400/80 px-3.5 sm:px-4 py-2 rounded-2xl shadow-[0_4px_20px_rgba(218,165,32,0.4)] backdrop-blur-md">
            {/* Animated Circular SVG Ring */}
            <div className="relative w-7 h-7 flex items-center justify-center">
              <svg className="w-7 h-7 -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-white/20"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-amber-400 transition-all duration-300 ease-linear"
                  strokeDasharray={`${(secondsRemaining / durationSeconds) * 100}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute font-mono text-xs font-black text-amber-300">
                {toPersianDigits(secondsRemaining)}
              </span>
            </div>

            <div className="text-right">
              <span className="text-[11px] sm:text-xs font-black text-amber-200 block leading-tight">
                {isFinished ? 'در حال ورود...' : `پایان پیام: ${toPersianDigits(secondsRemaining)} ثانیه`}
              </span>
              <span className="text-[9.5px] text-amber-400/80 font-bold block">
                غیرقابل بستن • انتقال خودکار
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* =========================================================================
          CENTER AREA: COMPLETELY EMPTY & UNOBSTRUCTED (NO TEXT, NO BUTTONS)
          ========================================================================= */}
      <div className="flex-1 pointer-events-none" />

      {/* =========================================================================
          BOTTOM FOOTER: SPONSOR LINK BANNER, PROGRESS BAR & REDIRECT TIMER
          ========================================================================= */}
      <footer className="relative z-20 p-4 sm:p-6 space-y-3 bg-gradient-to-t from-black via-black/85 to-transparent">
        {/* Subtle Sponsor Info Pill (At bottom edge, does not block the video) */}
        <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-slate-200">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-bold text-white text-xs">{sponsorName}</span>
            <span className="text-slate-400 hidden sm:inline">|</span>
            <span className="text-slate-300 text-[11px] hidden sm:inline">{sponsorTagline}</span>
          </div>

          <div className="flex items-center gap-1.5 text-amber-300 bg-amber-500/20 border border-amber-400/30 px-3 py-1.5 rounded-xl text-xs font-black">
            <span>مشاهده سایت اسپانسر</span>
            <ExternalLink className="w-3.5 h-3.5 text-amber-300" />
          </div>
        </div>

        {/* Live Smooth Golden Progress Bar */}
        <div className="w-full bg-white/15 h-2.5 rounded-full overflow-hidden border border-white/20 p-0.5 shadow-inner">
          <div 
            className="h-full bg-gradient-to-r from-amber-500 via-amber-300 to-yellow-400 rounded-full transition-all duration-300 ease-out shadow-[0_0_12px_rgba(245,158,11,0.9)]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs text-slate-300 font-bold px-1 flex-wrap gap-2">
          <div className="flex items-center gap-1.5 text-amber-300">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>پخش الزامی ویدیو • این پیام قابل رد کردن نیست</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-300">
            {isFinished ? (
              <span className="text-emerald-400 font-black flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>پایان ۱۰ ثانیه • ورود به صفحه اصلی سامانه...</span>
              </span>
            ) : (
              <span>انتقال خودکار به صفحه اصلی تا {toPersianDigits(secondsRemaining)} ثانیه دیگر...</span>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
};
