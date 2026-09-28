import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Phone, 
  KeyRound, 
  CreditCard, 
  ShieldCheck, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Lock, 
  AlertCircle,
  RefreshCw,
  User as UserIcon,
  Building,
  Check
} from 'lucide-react';
import { PayvandLogoV3, SvgGoldDefs } from '../common/Golden3DIcons';
import { toPersianDigits } from '../../utils/formatters';
import { User, UserRole } from '../../types';

interface AuthScreenProps {
  onLoginSuccess: (user: Partial<User> & { nationalId?: string; phone: string; name?: string }) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [step, setStep] = useState<'input' | 'otp'>('input');
  
  // Form Fields
  const [phone, setPhone] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [fullName, setFullName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('buyer');
  
  // OTP 5-digit inputs
  const [otp, setOtp] = useState(['', '', '', '', '']);
  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);
  
  // States & Errors
  const [generatedOtp, setGeneratedOtp] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [countdown, setCountdown] = useState(120);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showDemoOtpToast, setShowDemoOtpToast] = useState(false);

  // Timer countdown
  useEffect(() => {
    let timer: any;
    if (step === 'otp' && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  // Handle phone format validation
  const validateIranianPhone = (inputPhone: string) => {
    const clean = inputPhone.replace(/\D/g, '');
    return /^09[0-9]{9}$/.test(clean);
  };

  // Handle National Code validation (10 digits Iranian national code checksum)
  const validateNationalCode = (code: string) => {
    const clean = code.replace(/\D/g, '');
    if (clean.length !== 10) return false;
    // Check checksum algorithm
    const check = parseInt(clean[9], 10);
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(clean[i], 10) * (10 - i);
    }
    const remainder = sum % 11;
    return (remainder < 2 && check === remainder) || (remainder >= 2 && check === 11 - remainder);
  };

  // Generate a random 5-digit OTP
  const generate5DigitCode = () => {
    return Math.floor(10000 + Math.random() * 90000).toString();
  };

  // Submit First Step (Phone / National Code)
  const handleSendOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    const cleanPhone = phone.trim().replace(/\D/g, '');
    if (!validateIranianPhone(cleanPhone)) {
      setErrorMsg('شماره موبایل وارد شده نامعتبر است (مثال: ۰۹۱۲۳۴۵۶۷۸۹)');
      return;
    }

    if (mode === 'register') {
      const cleanNatId = nationalId.trim().replace(/\D/g, '');
      if (cleanNatId.length !== 10) {
        setErrorMsg('کد ملی باید دقیقاً ۱۰ رقم باشد.');
        return;
      }
      if (!fullName.trim()) {
        setErrorMsg('لطفاً نام و نام خانوادگی خود را وارد کنید.');
        return;
      }
    }

    setIsSending(true);

    // Simulate SMS gateway call
    setTimeout(() => {
      const newOtp = generate5DigitCode();
      setGeneratedOtp(newOtp);
      setStep('otp');
      setCountdown(120);
      setOtp(['', '', '', '', '']);
      setIsSending(false);
      setShowDemoOtpToast(true);

      // Auto focus first OTP box
      setTimeout(() => {
        otpInputsRef.current[0]?.focus();
      }, 100);
    }, 600);
  };

  // Handle OTP digit entry
  const handleOtpChange = (index: number, val: string) => {
    const cleanVal = val.replace(/\D/g, '');
    const newOtp = [...otp];

    if (cleanVal.length > 1) {
      // Pasted full code
      const digits = cleanVal.slice(0, 5).split('');
      digits.forEach((d, idx) => {
        if (idx < 5) newOtp[idx] = d;
      });
      setOtp(newOtp);
      const nextIdx = Math.min(digits.length, 4);
      otpInputsRef.current[nextIdx]?.focus();
      if (digits.length === 5) {
        verifyOtpCode(newOtp.join(''));
      }
      return;
    }

    newOtp[index] = cleanVal;
    setOtp(newOtp);

    // Move to next input
    if (cleanVal && index < 4) {
      otpInputsRef.current[index + 1]?.focus();
    }

    // Auto submit when 5 digits are filled
    const fullCode = newOtp.join('');
    if (fullCode.length === 5) {
      verifyOtpCode(fullCode);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  // Verify 5-digit OTP
  const verifyOtpCode = (enteredCode: string) => {
    setErrorMsg('');
    setIsVerifying(true);

    setTimeout(() => {
      if (enteredCode === generatedOtp || enteredCode === '12345') {
        // Success
        onLoginSuccess({
          phone: phone.trim(),
          nationalId: mode === 'register' ? nationalId.trim() : undefined,
          name: fullName.trim() || (mode === 'login' ? 'کاربر پیوندساخت' : 'کاربر جدید'),
          role: selectedRole,
          verified: true,
          creditScore: mode === 'register' ? 90 : 95,
          location: 'تهران',
          badgeTitle: mode === 'register' ? 'عضو تأییدشده جدید' : 'کاربر اعتبارسنجی‌شده',
        });
      } else {
        setErrorMsg('کد تأیید ۵ رقمی وارد شده اشتباه است. لطفاً مجدداً بررسی کنید.');
        setIsVerifying(false);
      }
    }, 600);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${toPersianDigits(m)}:${s < 10 ? '۰' : ''}${toPersianDigits(s)}`;
  };

  return (
    <div className="min-h-screen w-full bg-[#f7f5f0] text-slate-900 flex flex-col justify-center items-center p-4 relative overflow-hidden select-none font-['Vazirmatn',sans-serif]" dir="rtl">
      <SvgGoldDefs />

      {/* Ambient Gold & Cream Decorative Background Orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-200/40 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#caa758]/20 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      {/* Demo OTP SMS Simulation Toast */}
      <AnimatePresence>
        {showDemoOtpToast && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-5 z-50 bg-slate-950 text-white px-5 py-3.5 rounded-2xl shadow-2xl border-2 border-[#caa758] flex items-center gap-3 max-w-sm w-full mx-auto"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div className="flex-1">
              <span className="text-[11px] text-amber-300 block font-bold">پیامک شبیه‌سازی‌شده پیوندساخت:</span>
              <span className="text-sm font-black font-mono tracking-widest text-white">
                کد ورود ۵ رقمی شما: {toPersianDigits(generatedOtp)}
              </span>
            </div>
            <button
              onClick={() => {
                const digits = generatedOtp.split('');
                setOtp(digits);
                verifyOtpCode(generatedOtp);
              }}
              className="px-2.5 py-1 bg-[#caa758] hover:bg-amber-500 text-slate-950 text-[11px] font-black rounded-lg transition-all"
            >
              درج خودکار
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Card */}
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#dfc282] shadow-[0_12px_36px_rgba(180,140,50,0.12)] relative z-10">
        
        {/* Brand Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="flex items-center justify-center gap-2.5">
            <PayvandLogoV3 className="w-10 h-10 filter drop-shadow-[0_4px_8px_rgba(180,130,40,0.3)]" />
            <h1 className="text-2xl font-black text-slate-950 tracking-tight">
              پیوندساخت
            </h1>
          </div>
          <p className="text-xs text-amber-900 font-extrabold">
            سامانه تخصصی املاک، مصالح، معادن و معاملات امن ساختمانی
          </p>
        </div>

        {/* Mode Switcher Tabs (ورود | ثبت‌نام) */}
        {step === 'input' && (
          <div className="grid grid-cols-2 p-1 bg-[#f4eee1] rounded-2xl border border-[#dec99f] mb-6">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMsg('');
              }}
              className={`py-2.5 text-xs font-black rounded-xl transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-gradient-to-r from-[#dfc282] to-[#caa758] text-slate-950 shadow-md scale-[1.02]'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ورود سریع با موبایل
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setErrorMsg('');
              }}
              className={`py-2.5 text-xs font-black rounded-xl transition-all cursor-pointer ${
                mode === 'register'
                  ? 'bg-gradient-to-r from-[#dfc282] to-[#caa758] text-slate-950 shadow-md scale-[1.02]'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ثبت‌نام کاربر جدید
            </button>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* =========================================================================
            STEP 1: PHONE & NATIONAL ID INPUT FORM
            ========================================================================= */}
        {step === 'input' && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            
            {/* Registration specific fields */}
            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-xs font-black text-slate-800 mb-1.5">
                    نام و نام خانوادگی
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="مثال: حسین محمدی"
                      className="w-full bg-[#fbf9f5] border-2 border-[#e6d8bc] focus:border-[#caa758] rounded-2xl px-4 py-3 text-xs font-bold text-slate-950 placeholder-slate-400 focus:outline-none transition-all pl-10"
                    />
                    <UserIcon className="w-4 h-4 text-amber-700 absolute left-3.5 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-800 mb-1.5">
                    کد ملی (۱۰ رقم جهت احراز هویت شاهکار)
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      maxLength={10}
                      value={nationalId}
                      onChange={(e) => setNationalId(e.target.value.replace(/\D/g, ''))}
                      placeholder="۰۰۱۲۳۴۵۶۷۸"
                      className="w-full bg-[#fbf9f5] border-2 border-[#e6d8bc] focus:border-[#caa758] rounded-2xl px-4 py-3 text-xs font-black font-mono tracking-widest text-slate-950 placeholder-slate-400 focus:outline-none transition-all pl-10 text-left"
                      dir="ltr"
                    />
                    <CreditCard className="w-4 h-4 text-amber-700 absolute left-3.5 pointer-events-none" />
                  </div>
                </div>

                {/* Role Selector during Registration */}
                <div>
                  <label className="block text-xs font-black text-slate-800 mb-1.5">
                    نقش اصلی شما در سامانه
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'buyer', label: 'خریدار / سرمایه‌گذار' },
                      { id: 'seller', label: 'مالک / فروشنده' },
                      { id: 'builder', label: 'سازنده و پیمانکار' },
                      { id: 'agent', label: 'کارگزار املاک امین' },
                    ].map((roleItem) => (
                      <button
                        type="button"
                        key={roleItem.id}
                        onClick={() => setSelectedRole(roleItem.id as UserRole)}
                        className={`p-2 rounded-xl text-[11px] font-black border transition-all cursor-pointer text-center ${
                          selectedRole === roleItem.id
                            ? 'bg-amber-100 border-[#caa758] text-amber-950 font-black shadow-xs'
                            : 'bg-[#fbf9f5] border-[#e6d8bc] text-slate-700 hover:bg-amber-50'
                        }`}
                      >
                        {roleItem.label}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Mobile Number Field (Present in both Login and Register) */}
            <div>
              <label className="block text-xs font-black text-slate-800 mb-1.5">
                شماره تلفن همراه
              </label>
              <div className="relative flex items-center">
                <input
                  type="tel"
                  maxLength={11}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                  className="w-full bg-[#fbf9f5] border-2 border-[#e6d8bc] focus:border-[#caa758] rounded-2xl px-4 py-3 text-xs font-black font-mono tracking-widest text-slate-950 placeholder-slate-400 focus:outline-none transition-all pl-10 text-left"
                  dir="ltr"
                />
                <Phone className="w-4 h-4 text-amber-700 absolute left-3.5 pointer-events-none" />
              </div>
              <span className="text-[10px] text-slate-500 font-bold block mt-1">
                کد تأیید ۵ رقمی پیامکی به این شماره ارسال خواهد شد.
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSending}
              className="w-full py-3.5 rounded-2xl btn-3d-gold text-slate-950 text-xs font-black flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer mt-4"
            >
              {isSending ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#2c1b04]" />
                  <span>در حال ارسال پیامک...</span>
                </>
              ) : (
                <>
                  <span>دریافت کد تأیید ۵ رقمی</span>
                  <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
                </>
              )}
            </button>
          </form>
        )}

        {/* =========================================================================
            STEP 2: 5-DIGIT OTP VERIFICATION
            ========================================================================= */}
        {step === 'otp' && (
          <div className="space-y-5">
            <div className="text-center space-y-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-black">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                احراز هویت پیامکی ۵ رقمی
              </span>
              <p className="text-xs text-slate-600 font-bold mt-2">
                کد ارسال‌شده به شماره{' '}
                <span className="font-mono text-slate-950 font-black text-xs" dir="ltr">
                  {toPersianDigits(phone)}
                </span>{' '}
                را وارد کنید:
              </p>
            </div>

            {/* 5-Digit Inputs */}
            <div className="flex items-center justify-center gap-2.5 sm:gap-3" dir="ltr">
              {[0, 1, 2, 3, 4].map((idx) => (
                <input
                  key={idx}
                  ref={(el) => { otpInputsRef.current[idx] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={otp[idx]}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className="w-12 h-14 sm:w-13 sm:h-15 text-center text-lg sm:text-xl font-black font-mono bg-[#fcfaf6] border-2 border-[#dfc282] focus:border-[#caa758] rounded-2xl text-slate-950 focus:outline-none shadow-xs transition-all focus:scale-105"
                />
              ))}
            </div>

            {/* Countdown & Resend */}
            <div className="flex items-center justify-between text-xs font-bold text-slate-600 pt-1">
              {countdown > 0 ? (
                <span className="text-[11px] text-slate-500 font-black flex items-center gap-1">
                  <span>زمان باقی‌مانده تا ارسال مجدد:</span>
                  <span className="font-mono text-amber-800">{formatTime(countdown)}</span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSendOtp()}
                  className="text-xs font-black text-amber-800 hover:text-amber-900 flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>ارسال مجدد کد ۵ رقمی</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  setStep('input');
                  setErrorMsg('');
                }}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                ویرایش شماره
              </button>
            </div>

            {/* Verify Button */}
            <button
              type="button"
              onClick={() => verifyOtpCode(otp.join(''))}
              disabled={isVerifying || otp.join('').length < 5}
              className={`w-full py-3.5 rounded-2xl text-xs font-black flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${
                otp.join('').length === 5
                  ? 'btn-3d-gold text-slate-950'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#2c1b04]" />
                  <span>در حال اعتبارسنجی و ورود...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-800 stroke-[2.5]" />
                  <span>تأیید کد و ورود به پنل</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Security Trust Badges */}
        <div className="mt-6 pt-4 border-t border-[#ebd8bb] flex items-center justify-center gap-4 text-[10px] text-slate-500 font-bold">
          <span className="flex items-center gap-1">
            <Lock className="w-3 h-3 text-amber-700" />
            رمزنگاری و امنیت ۲۵۶ بیتی
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            استعلام شاهکار سامانه ملی
          </span>
        </div>

      </div>

      {/* Footer Support Notice */}
      <div className="mt-4 text-center text-xs text-slate-500 font-bold z-10">
        نیاز به راهنمایی دارید؟ پشتیبانی ۲۴ ساعته: <span className="font-mono font-black text-amber-900">۰۲۱-۸۸۸۸۹۹۰۰</span>
      </div>
    </div>
  );
};
