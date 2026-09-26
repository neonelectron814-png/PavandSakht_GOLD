import { LiveActivityEvent, LiveTickerItem } from '../types';

export const initialTickerItems: LiveTickerItem[] = [
  { id: 't1', symbol: 'STEEL-14', name: 'میلگرد ۱۴ ذوب‌آهن اصفهان', price: 29800, unit: 'کیلوگرم', changePercent: 1.4, category: 'metal' },
  { id: 't2', symbol: 'CEMENT-T2', name: 'سیمان تیپ ۲ البرز (کیسه)', price: 92000, unit: 'کیسه ۵۰ک', changePercent: -0.8, category: 'cement' },
  { id: 't3', symbol: 'STONE-TRV', name: 'کوپ تراورتن سوپر عباس‌آباد', price: 3400000, unit: 'هر تن', changePercent: 2.1, category: 'stone' },
  { id: 't4', symbol: 'TEH-D1', name: 'مسکن منطقه ۱ تهران (میانگین)', price: 178000000, unit: 'هر متر', changePercent: 0.6, category: 'real_estate' },
  { id: 't5', symbol: 'SAND-QRH', name: 'پوکه معدنی سبک قروه', price: 420000, unit: 'متر مکعب', changePercent: 0.0, category: 'sand' },
  { id: 't6', symbol: 'STONE-MRM', name: 'کوپ مرمریت دهبید شایان', price: 2850000, unit: 'هر تن', changePercent: -1.2, category: 'stone' },
  { id: 't7', symbol: 'TEH-D2', name: 'مسکن منطقه ۲ تهران (سعادت‌آباد)', price: 142000000, unit: 'هر متر', changePercent: 1.1, category: 'real_estate' },
  { id: 't8', symbol: 'BEAM-18', name: 'تیرآهن ۱۸ اصفهان', price: 36500, unit: 'کیلوگرم', changePercent: 0.9, category: 'metal' },
];

export const initialLiveEvents: LiveActivityEvent[] = [
  {
    id: 'ev-1',
    type: 'verification',
    title: 'تأیید اصالت ثبتی سند تک‌برگ',
    description: 'استعلام الکترونیک کاداستر فایل PYS-9021 (زعفرانیه) با موفقیت تأیید شد.',
    timestamp: 'هم‌اکنون',
    actor: 'کارشناس رسمی ثبتی کد ۱۰۴',
    badge: 'استعلام رسمی',
    badgeColor: 'emerald',
  },
  {
    id: 'ev-2',
    type: 'mine',
    title: 'بارگیری مستقیم از سینه کار معدن',
    description: 'محموله ۲۵۰ تنی کوپ تراورتن درجه ۱ معدن محلات به سمت پروژه برج باغ فرمانیه ارسال شد.',
    timestamp: '۱ دقیقه پیش',
    actor: 'مجموعه معادن کرمی',
    badge: 'سینه کار معدن',
    badgeColor: 'amber',
    amount: 250,
    unit: 'تن',
  },
  {
    id: 'ev-3',
    type: 'deal',
    title: 'پیشنهاد قیمت جدید در اتاق معامله',
    description: 'خریدار پیشنهاد رسمی ۵۴ میلیارد تومان را برای پنت‌هاوس سعادت‌آباد ثبت نمود.',
    timestamp: '۳ دقیقه پیش',
    actor: 'سرمایه‌گذار ویژه',
    badge: 'اتاق معامله',
    badgeColor: 'blue',
    amount: 54000000000,
  },
  {
    id: 'ev-4',
    type: 'rent',
    title: 'تنظیم قرارداد رهن و اجاره کارشناسی',
    description: 'پیش‌نویس قرارداد رهن ۵۰۰ م و اجاره ۲۲ م برای واحد ۸۵ متری گیشا صادر شد.',
    timestamp: '۵ دقیقه پیش',
    actor: 'دفتر املاک امین کد ۷۴۸',
    badge: 'رهن و اجاره',
    badgeColor: 'purple',
  },
  {
    id: 'ev-5',
    type: 'price',
    title: 'به‌روزرسانی قیمت پایه کارخانه',
    description: 'صنایع سیمان و بتن البرز قیمت تحویل پای کارگاه سیمان تیپ ۲ را به‌روزرسانی کرد.',
    timestamp: '۸ دقیقه پیش',
    actor: 'کارخانه سیمان البرز',
    badge: 'قیمت مصالح',
    badgeColor: 'rose',
    changePercent: -0.8,
  },
];

const mockEventPool: Omit<LiveActivityEvent, 'id' | 'timestamp'>[] = [
  {
    type: 'mine',
    title: 'تخصیص سهمیه کوپ سنگ دهبید',
    description: 'اعلام عرضه ۱۲۰ تن سنگ کوپ مرمریت با عیار صادراتی از معدن دهبید فارس.',
    actor: 'معدن‌دار مجاز کد ۵۱۲',
    badge: 'عرضه معدن',
    badgeColor: 'amber',
    amount: 120,
    unit: 'تن',
  },
  {
    type: 'deal',
    title: 'ورود به مرحله تنظیم پیش‌نویس',
    description: 'طرفین معامله ویلای لواسان شروط نحوه پرداخت ثمن را تایید و امضا کردند.',
    actor: 'اتاق معامله امن #102',
    badge: 'پیشرفت معامله',
    badgeColor: 'emerald',
  },
  {
    type: 'verification',
    title: 'صدور گواهی عدم خلاف شهرداری',
    description: 'استعلام سیستمی پایان‌کار و عدم خلاف برای برج باغ نیاوران دریافت شد.',
    actor: 'سامانه استعلام شهرداری',
    badge: 'استعلام فنی',
    badgeColor: 'emerald',
  },
  {
    type: 'rent',
    title: 'ثبت متقاضی جدید رهن کامل',
    description: 'درخواست رهن آپارتمان ۱۲۰ متری در منطقه ۲ با ودیعه ۲.۵ میلیارد تومان ثبت شد.',
    actor: 'مستأجر احراز هویت شده',
    badge: 'رهن و اجاره',
    badgeColor: 'purple',
  },
  {
    type: 'barter',
    title: 'انطباق هوشمند ۹۲٪ در میز تهاتر',
    description: 'انطباق آپارتمان الهیه با ۳۰۰۰ مترمربع سرامیک پرسلان و آهن‌آلات تأیید گردید.',
    actor: 'موتور هوشمند تهاتر',
    badge: 'انطباق تهاتر',
    badgeColor: 'blue',
  },
  {
    type: 'price',
    title: 'نوسان لحظه‌ای نرخ مقاطع فولادی',
    description: 'تیرآهن سایز ۱۶ و ۱۸ ذوب‌آهن اصفهان به دلیل افزایش تقاضا ۰.۷٪ افزایش یافت.',
    actor: 'تابلو لحظه‌ای بورس کالا',
    badge: 'شاخص قیمت',
    badgeColor: 'amber',
    changePercent: 0.7,
  },
  {
    type: 'mine',
    title: 'تخلیه بار پوکه معدنی در کارگاه چیتگر',
    description: 'محموله ۵۰ مترمکعبی پوکه فوق سبک قروه با بارنامه دیجیتال تحویل گردید.',
    actor: 'ناوگان حمل پیوند ساخت',
    badge: 'تحویل پای کار',
    badgeColor: 'emerald',
  },
  {
    type: 'deal',
    title: 'پرداخت امن ودیعه اولیه',
    description: 'ودیعه حسن انجام معامله در حساب امانی کارگزاری با ضمانت بانکی مسدود شد.',
    actor: 'حساب امانی پیوند ساخت',
    badge: 'تضمین مالی',
    badgeColor: 'emerald',
  },
];

// Audio chime using Web Audio API (gentle high-frequency bell)
export function playSubtleChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
    osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.12); // E6

    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.36);
  } catch {
    // AudioContext blocked or not allowed - ignore silently
  }
}

// Helper to generate a new live event
export function generateNextLiveEvent(): LiveActivityEvent {
  const template = mockEventPool[Math.floor(Math.random() * mockEventPool.length)];
  return {
    ...template,
    id: `ev-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: 'لحظاتی پیش',
  };
}

// Helper to jitter ticker prices slightly for live reality feel
export function updateTickerItems(prevItems: LiveTickerItem[]): LiveTickerItem[] {
  return prevItems.map((item) => {
    // 40% chance of price nudge
    if (Math.random() > 0.4) {
      const deltaPercent = (Math.random() * 0.6 - 0.3); // -0.3% to +0.3%
      const newPrice = Math.round(item.price * (1 + deltaPercent / 100));
      const roundedDelta = Number((item.changePercent + deltaPercent * 0.5).toFixed(1));
      return {
        ...item,
        price: newPrice,
        changePercent: Math.max(-5, Math.min(5, roundedDelta)),
      };
    }
    return item;
  });
}
