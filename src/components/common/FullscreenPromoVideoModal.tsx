import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Sparkles, 
  CheckCircle2, 
  Lock,
  ExternalLink,
  Building2,
  ShieldCheck
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
  videoUrl = '/videos/sample-ad.mp4',
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState(durationSeconds);
  const [isMuted, setIsMuted] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
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

        // Transition to main app
        setTimeout(() => {
          if (onFinishedRef.current) {
            onFinishedRef.current();
          }
        }, 180);
      }
    };

    const intervalId = setInterval(checkTimer, 200);

    // Play video with mobile-friendly muted autoplay
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.muted = true;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsVideoLoaded(true))
          .catch(() => {
            // Autoplay blocked or media error, fallback is already displayed
          });
      }
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
      className="fixed inset-0 z-[99999] bg-[#0c0f17] text-white flex flex-col justify-between overflow-hidden select-none font-['Vazirmatn',sans-serif] cursor-pointer" 
      dir="rtl"
      title="برای ورود به وب‌سایت تبلیغ‌شده روی تصویر کلیک کنید"
      onContextMenu={(e) => e.preventDefault()}
    >
      <SvgGoldDefs />

      {/* 100% Full Background Video with Visual Architecture Backdrop (Guaranteed never pitch black) */}
      <div className="absolute inset-0 z-0 bg-[#0a0d14] flex items-center justify-center overflow-hidden">
        {/* Animated Architectural Luxury Backdrop (Ensures rich graphics even before or if video network lags) */}
        <div 
          className="absolute inset-0 bg-cover bg-center scale-105 transition-transform duration-10000 ease-out"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1200')`,
            filter: 'brightness(0.65) contrast(1.15)',
          }}
        />

        {/* Video Player overlay */}
        <video
          ref={videoRef}
          src={videoUrl}
          playsInline
          autoPlay
          loop
          muted={isMuted}
          onLoadedData={() => setIsVideoLoaded(true)}
          className={`w-full h-full object-cover relative z-10 transition-opacity duration-700 ${
            isVideoLoaded ? 'opacity-90' : 'opacity-40'
          }`}
        >
          <source src={videoUrl} type="video/mp4" />
          <source src="/videos/promo-building.mp4" type="video/mp4" />
          <source src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" type="video/mp4" />
        </video>

        {/* Subtle Edge Vignette & Gold Atmospheric Sheen */}
        <div className="absolute inset-0 z-15 bg-gradient-to-t from-black/95 via-transparent to-black/85 pointer-events-none" />
        <div className="absolute inset-0 z-15 bg-gradient-to-r from-amber-950/20 via-transparent to-amber-950/20 pointer-events-none" />
      </div>

      {/* =========================================================================
          TOP HEADER: ADAPTIVE MOBILE/ANDROID SAFE BAR (NEVER OVERFLOWS 400PX)
          ========================================================================= */}
      <header className="relative z-20 pt-3 px-3 sm:px-6 flex items-center justify-between gap-2 max-w-full">
        {/* Brand & Sponsor Tag (Right in RTL - Compact so it fits on 360-400px screens) */}
        <div className="flex items-center gap-2 bg-black/80 backdrop-blur-md px-2.5 sm:px-3.5 py-1.5 rounded-2xl border border-amber-400/40 shadow-lg min-w-0 max-w-[62%] sm:max-w-md">
          <PayvandLogoV3 className="w-6.5 h-6.5 sm:w-8 sm:h-8 shrink-0 filter drop-shadow-[0_2px_8px_rgba(218,165,32,0.5)]" />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-nowrap">
              <span className="font-black text-[11px] sm:text-xs text-white shrink-0">پیوندساخت</span>
              <span className="text-[9px] bg-amber-500/30 text-amber-300 border border-amber-400/50 px-1.5 py-0.2 rounded-full font-bold shrink-0">
                پیام بازرگانی
              </span>
            </div>
            <p className="text-[10px] text-amber-200/90 font-bold truncate">
              {sponsorName}
            </p>
          </div>
        </div>

        {/* Top Controls: Sound Toggle + Unclosable 10s Countdown (Left in RTL - Safe Margins) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
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
            className="w-8.5 h-8.5 sm:w-10 sm:h-10 rounded-xl bg-black/80 hover:bg-black/95 border border-white/25 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-md active:scale-90 shadow-md"
            title={isMuted ? 'روشن کردن صدا' : 'قطع صدا'}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-amber-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            )}
          </button>

          {/* Undisturbed 10-Second Countdown Badge */}
          <div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-950/95 to-black/95 border-2 border-amber-400/80 px-2 sm:px-3 py-1 rounded-xl shadow-[0_4px_16px_rgba(218,165,32,0.35)] backdrop-blur-md">
            {/* Animated Circular SVG Ring */}
            <div className="relative w-6 h-6 flex items-center justify-center shrink-0">
              <svg className="w-6 h-6 -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-white/20"
                  strokeWidth="4"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-amber-400 transition-all duration-300 ease-linear"
                  strokeDasharray={`${(secondsRemaining / durationSeconds) * 100}, 100`}
                  strokeWidth="4"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute font-mono text-[11px] font-black text-amber-300">
                {toPersianDigits(secondsRemaining)}
              </span>
            </div>

            <div className="text-right">
              <span className="text-[10px] sm:text-xs font-black text-amber-200 block leading-tight">
                {isFinished ? 'ورود...' : `${toPersianDigits(secondsRemaining)} ثانیه`}
              </span>
              <span className="text-[8px] text-amber-400/80 font-bold block">
                انتقال خودکار
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* =========================================================================
          CENTER AREA: 100% EMPTY & UNOBSTRUCTED (NO CARDS, NO TEXT, FULL VIDEO)
          ========================================================================= */}
      <div className="flex-1 pointer-events-none" />

      {/* =========================================================================
          BOTTOM FOOTER: CALL TO ACTION, GOLDEN PROGRESS BAR & REDIRECT TIMER
          ========================================================================= */}
      <footer className="relative z-20 pb-4 sm:pb-6 px-3 sm:px-6 pt-2 space-y-2 bg-gradient-to-t from-black via-black/90 to-transparent">
        {/* Action Button: Tap to open sponsor */}
        <div className="w-full flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-slate-300 text-[10.5px] sm:text-xs font-bold min-w-0">
            <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate">پخش الزامی ویدیو • غیرقابل بستن</span>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              window.open(sponsorUrl, '_blank', 'noopener,noreferrer');
            }}
            className="btn-3d-gold text-[#2c1b04] font-black text-xs px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-lg active:scale-95 cursor-pointer shrink-0"
          >
            <span>مشاهده وب‌سایت</span>
            <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>

        {/* Live Smooth Golden Progress Bar */}
        <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden border border-white/25 p-0.5">
          <div 
            className="h-full bg-gradient-to-r from-amber-500 via-amber-300 to-yellow-400 rounded-full transition-all duration-300 ease-out shadow-[0_0_12px_rgba(245,158,11,0.9)]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Countdown Status */}
        <div className="text-center text-[10px] sm:text-[11px] text-amber-200/90 font-bold">
          {isFinished ? (
            <span className="text-emerald-400 font-black">پایان پیام بازرگانی • ورود به سامانه...</span>
          ) : (
            <span>انتقال خودکار به صفحه اصلی تا {toPersianDigits(secondsRemaining)} ثانیه دیگر...</span>
          )}
        </div>
      </footer>
    </div>
  );
};
