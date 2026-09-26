// Utility helpers for Persian numbers, Tomans formatting, and Jalali dates

export function toPersianDigits(num: number | string | undefined | null): string {
  if (num === undefined || num === null) return '۰';
  const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(num).replace(/\d/g, (x) => farsiDigits[parseInt(x, 10)]);
}

export function formatToman(amount: number | string | undefined | null, usePersianDigits = true): string {
  if (amount === undefined || amount === null) return usePersianDigits ? '۰ تومان' : '0 تومان';
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num) || num === 0) return usePersianDigits ? '۰ تومان' : '0 تومان';
  
  const formatted = num.toLocaleString('en-US');
  if (usePersianDigits) {
    return `${toPersianDigits(formatted)} تومان`;
  }
  return `${formatted} تومان`;
}

export function formatTomanShort(amount: number | string | undefined | null): string {
  if (amount === undefined || amount === null) return '۰ تومان';
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num) || num === 0) return '۰ تومان';

  if (num >= 1_000_000_000) {
    const miliard = (num / 1_000_000_000).toFixed(1);
    return `${toPersianDigits(miliard)} میلیارد تومان`;
  }
  if (num >= 1_000_000) {
    const million = (num / 1_000_000).toFixed(0);
    return `${toPersianDigits(million)} میلیون تومان`;
  }
  if (num >= 1_000) {
    const hezar = (num / 1_000).toFixed(0);
    return `${toPersianDigits(hezar)} هزار تومان`;
  }
  return `${toPersianDigits(num)} تومان`;
}

export function maskPhoneNumber(phone: string | undefined | null): string {
  if (!phone || phone.length < 11) return '۰۹***۰*';
  return `${toPersianDigits(phone.slice(0, 4))}****${toPersianDigits(phone.slice(8))}`;
}

export function getVerificationBadgeText(status: string): string {
  switch (status) {
    case 'verified':
      return 'تأییدشده و سالم';
    case 'pending':
      return 'در حال اعتبارسنجی';
    case 'need_inquiry':
      return 'نیازمند استعلام سند';
    case 'rejected':
      return 'ردشده / عدم مطابقت';
    default:
      return 'نامشخص';
  }
}

export function getVerificationBadgeColor(status: string): { bg: string; text: string; border: string } {
  switch (status) {
    case 'verified':
      return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' };
    case 'pending':
      return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' };
    case 'need_inquiry':
      return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' };
    case 'rejected':
      return { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' };
    default:
      return { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' };
  }
}
