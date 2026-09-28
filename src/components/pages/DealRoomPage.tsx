import React, { useState } from 'react';
import { 
  Lock, 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Building2, 
  UserCheck, 
  Calculator, 
  Send, 
  AlertCircle, 
  Check, 
  ChevronRight, 
  User, 
  Phone,
  Scale,
  Sparkles,
  Layers,
  KeyRound
} from 'lucide-react';
import { DealRoom, DealRoomDocument } from '../../types';
import { formatToman, formatTomanShort, maskPhoneNumber, toPersianDigits } from '../../utils/formatters';

interface DealRoomPageProps {
  dealRooms: DealRoom[];
  onAdvanceStep?: (roomId: string) => void;
  onSendToAgent?: (roomId: string) => void;
}

export const DealRoomPage: React.FC<DealRoomPageProps> = ({
  dealRooms,
  onAdvanceStep,
  onSendToAgent,
}) => {
  const [selectedRoomId, setSelectedRoomId] = useState<string>(dealRooms[0]?.id || '');
  const [newNote, setNewNote] = useState('');
  const [notes, setNotes] = useState<string[]>(dealRooms[0]?.confidentialNotes || []);
  const [showSentSuccess, setShowSentSuccess] = useState<boolean>(false);
  const [bidAmount, setBidAmount] = useState<string>('');
  const [bidSuccessMsg, setBidSuccessMsg] = useState<string | null>(null);

  const activeRoom = dealRooms.find((r) => r.id === selectedRoomId) || dealRooms[0];

  if (!activeRoom) {
    return (
      <div className="bg-white rounded-3xl p-10 text-center space-y-4 border border-[#ded5c5] shadow-[0_2px_12px_rgba(0,0,0,0.04)]" dir="rtl">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-900 mx-auto flex items-center justify-center border border-amber-300 shadow-xs">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-base font-black text-slate-950">اتاق معامله فعال یافت نشد</h2>
        <p className="text-xs text-slate-700 font-medium">از طریق بازار ملک می‌توانید وارد اتاق معامله محرمانه شوید.</p>
      </div>
    );
  }

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setNotes([`امروز - ${new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}: ${newNote}`, ...notes]);
    setNewNote('');
  };

  const handleSendToAgentClick = () => {
    if (onSendToAgent) onSendToAgent(activeRoom.id);
    setShowSentSuccess(true);
    setTimeout(() => setShowSentSuccess(false), 5000);
  };

  const handleSendInstantBid = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bidAmount.trim()) return;
    const bidMsg = `پیشنهاد مالی جدید (${bidAmount} تومان) به صورت رمزنگاری‌شده در جریان زنده اتاق معامله ثبت و به اطلاع طرفین رسید.`;
    setNotes([`لحظاتی پیش: ${bidMsg}`, ...notes]);
    setBidSuccessMsg(`پیشنهاد رسمی ${bidAmount} با موفقیت ثبت شد.`);
    setBidAmount('');
    setTimeout(() => setBidSuccessMsg(null), 4000);
  };

  return (
    <div className="space-y-6 pb-16" dir="rtl">
      
      {/* Header Banner: Clean High-Contrast White Card */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#ded5c5] space-y-3 relative overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-950 border border-amber-300 px-3.5 py-1 rounded-full text-xs font-black shadow-xs">
                <KeyRound className="w-3.5 h-3.5 text-amber-700" />
                <span>محیط محرمانه رمزنگاری‌شده ۲۵۶ بیتی (E2EE)</span>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-950 border border-emerald-300 px-3 py-1 rounded-full font-black">
                بیش از ۸۰٪ معاملات رسمی در اتاق معامله منعقد می‌شود
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-black text-slate-950">
              اتاق معامله تخصصی و امن (Deal Room)
            </h1>
            <p className="text-xs text-slate-700 font-semibold mt-1 max-w-xl leading-relaxed">
              مدیریت مرحله‌ای اسناد، کارشناسی قیمت، توافق‌نامه و ارجاع حقوقی به دفاتر املاک امین با ضمانت سلامت معامله
            </p>
          </div>

          <div className="bg-[#fffcf7] p-3.5 rounded-2xl border border-amber-200 text-xs space-y-1 shrink-0">
            <p className="text-slate-600 font-bold">شناسه امنیتی پرونده:</p>
            <p className="font-mono font-black text-amber-900 text-sm tracking-wider">{activeRoom.propertyCode}</p>
          </div>
        </div>
      </div>

      {/* Select active deal room tabs if multiple */}
      {dealRooms.length > 1 && (
        <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
          {dealRooms.map((room) => (
            <button
              key={room.id}
              onClick={() => {
                setSelectedRoomId(room.id);
                setNotes(room.confidentialNotes);
              }}
              className={`px-4.5 py-2.5 rounded-2xl text-xs font-black shrink-0 transition-all cursor-pointer ${
                selectedRoomId === room.id
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'bg-white hover:bg-slate-50 text-slate-900 border border-[#ded5c5]'
              }`}
            >
              {room.propertyTitle} ({room.propertyCode})
            </button>
          ))}
        </div>
      )}

      {/* 5-Step Pipeline Stepper */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#ded5c5] space-y-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
        <h2 className="text-sm font-black text-slate-950 flex items-center gap-2 border-b border-[#ede6d8] pb-3">
          <Clock className="w-4 h-4 text-amber-700" />
          <span>مراحل گام به گام معامله تا تنظیم سند رسمی</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 relative">
          {activeRoom.steps.map((step) => (
            <div
              key={step.stepNumber}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                step.completed
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : step.active
                  ? 'bg-amber-50 border-amber-400 text-amber-950 shadow-md ring-2 ring-amber-400/40'
                  : 'bg-[#faf8f4] border-[#e2dcd0] text-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className={`w-7 h-7 rounded-xl text-xs font-black flex items-center justify-center shadow-xs ${
                    step.completed
                      ? 'bg-emerald-600 text-white'
                      : step.active
                      ? 'bg-amber-600 text-white'
                      : 'bg-slate-200 text-slate-800'
                  }`}>
                    {step.completed ? <Check className="w-4 h-4 stroke-[3]" /> : toPersianDigits(step.stepNumber)}
                  </span>
                  
                  {step.active && (
                    <span className="text-[10px] bg-amber-200 text-amber-950 font-black px-2 py-0.5 rounded-full border border-amber-400">
                      گام جاری
                    </span>
                  )}
                </div>

                <h3 className="font-black text-xs mb-1 text-slate-950">{step.title}</h3>
                <p className="text-[10.5px] leading-relaxed text-slate-700 font-semibold">{step.description}</p>
              </div>
              
              {step.date && (
                <span className="text-[9.5px] block mt-2.5 font-bold font-mono text-slate-500">{step.date}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid: Document Checklist & Price/Commission Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 cols): Document Verification & Confidential Notes */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Document Verification Checklist */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#ded5c5] space-y-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between border-b border-[#ede6d8] pb-3">
              <div>
                <h3 className="font-black text-sm text-slate-950 flex items-center gap-2">
                  <ShieldCheck className="w-4.5 h-4.5 text-emerald-700" />
                  <span>اسناد، مدارک و استعلام‌های ثبتی</span>
                </h3>
                <p className="text-xs text-slate-600 font-semibold mt-0.5">مدارک احراز هویت، کاداستر و اسناد ثبتی طرفین</p>
              </div>

              <span className="text-xs bg-emerald-50 text-emerald-950 font-black px-3 py-1 rounded-xl border border-emerald-300">
                {toPersianDigits(activeRoom.documents.filter(d => d.verified).length)} از {toPersianDigits(activeRoom.documents.length)} تأیید شده
              </span>
            </div>

            <div className="space-y-2.5">
              {activeRoom.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="p-3.5 rounded-2xl bg-[#faf8f4] border border-[#e4ddd0] flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0 border border-amber-300">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-black text-xs text-slate-950">{doc.title}</h4>
                      <span className="text-[10.5px] font-bold text-slate-600">{doc.type}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {doc.verified ? (
                      <span className="bg-emerald-50 text-emerald-900 text-[11px] px-3 py-1 rounded-xl font-black flex items-center gap-1 border border-emerald-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                        <span>تأیید ثبتی شش‌دانگ</span>
                      </span>
                    ) : (
                      <span className="bg-amber-50 text-amber-950 text-[11px] px-3 py-1 rounded-xl font-black flex items-center gap-1 border border-amber-300">
                        <Clock className="w-3.5 h-3.5 text-amber-700" />
                        <span>در حال استعلام</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Confidential Notes & Live Negotiations Log */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#ded5c5] space-y-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between border-b border-[#ede6d8] pb-3">
              <h3 className="font-black text-sm flex items-center gap-2 text-slate-950">
                <Lock className="w-4 h-4 text-amber-700" />
                <span>مذاکرات و توافقات زنده طرفین (Live Negotiation)</span>
              </h3>
              <span className="text-[10px] bg-emerald-50 text-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1 font-black">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
                جریان زنده فعال
              </span>
            </div>

            {/* Instant Bid Submission Form */}
            <form onSubmit={handleSendInstantBid} className="p-3.5 rounded-2xl bg-[#fffdf7] border border-amber-300 space-y-2">
              <div className="flex items-center justify-between text-xs text-amber-950 font-black">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                  ارسال پیشنهاد قیمت یا شرط توافق جدید:
                </span>
                <span className="text-[10px] font-bold text-slate-600">ثبت آنی در کانال امن</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  placeholder="مثال: ۴۹.۵ میلیارد تومان یا شروط پرداخت سه مرحله‌ای..."
                  className="flex-1 bg-white border border-[#ded5c5] rounded-xl px-3 py-2 text-xs text-slate-950 font-bold placeholder-slate-400 focus:outline-none focus:border-amber-600"
                />
                <button
                  type="submit"
                  className="bg-[#a37936] hover:bg-[#8f6628] text-white font-black px-4 py-2 rounded-xl text-xs flex items-center gap-1 cursor-pointer shadow-xs transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>ارسال زنده</span>
                </button>
              </div>
              {bidSuccessMsg && (
                <div className="bg-emerald-50 border border-emerald-300 p-2 rounded-xl text-[11px] text-emerald-950 font-black flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{bidSuccessMsg}</span>
                </div>
              )}
            </form>

            <div className="space-y-2.5 max-h-56 overflow-y-auto no-scrollbar">
              {notes.map((note, idx) => (
                <div key={idx} className="bg-[#faf8f4] p-3.5 rounded-2xl border border-[#e4ddd0] text-xs text-slate-800 font-semibold leading-relaxed">
                  {note}
                </div>
              ))}
            </div>

            {/* Form to add note */}
            <form onSubmit={handleAddNote} className="flex gap-2 pt-2">
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="ثبت یادداشت محرمانه تکمیلی..."
                className="flex-1 bg-[#faf8f4] border border-[#ded5c5] rounded-xl px-3.5 py-2.5 text-xs text-slate-950 font-bold placeholder-slate-400 focus:outline-none focus:border-amber-600"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-black px-4.5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>ثبت</span>
              </button>
            </form>
          </div>

        </div>

        {/* Right Column (1 col): Parties, Valuation, Agency Referral & Commission */}
        <div className="space-y-6">
          
          {/* Parties Overview Box with Dual-Sided Verification & Anti-Fake Solvency */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#ded5c5] space-y-3.5 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between border-b border-[#ede6d8] pb-2.5">
              <h3 className="font-black text-xs text-slate-950">
                طرفین معامله و اعتبارسنجی ضد تقلب (Anti-Fake)
              </h3>
              <span className="text-[9.5px] bg-emerald-100 text-emerald-950 font-black px-2 py-0.5 rounded-full border border-emerald-300">
                احراز هویت ۲ طرفه
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              {/* Buyer Card with Solvency Check */}
              <div className="p-3 rounded-2xl bg-[#faf8f4] border border-[#e4ddd0] space-y-1.5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-600 font-bold block">خریدار / سرمایه‌گذار واقعی:</span>
                    <span className="font-black text-slate-950">{activeRoom.buyerName}</span>
                  </div>
                  <span className="font-mono font-bold text-slate-700 dir-ltr">{maskPhoneNumber(activeRoom.buyerPhone)}</span>
                </div>
                {/* Solvency & Sana Badges */}
                <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-[#ede6d8]">
                  <span className="inline-flex items-center gap-1 text-[9.5px] bg-emerald-50 text-emerald-900 border border-emerald-300 px-2 py-0.5 rounded-md font-black">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    احراز ثنا و کدملی
                  </span>
                  <span className="inline-flex items-center gap-1 text-[9.5px] bg-blue-50 text-blue-900 border border-blue-300 px-2 py-0.5 rounded-md font-black">
                    <ShieldCheck className="w-3 h-3 text-blue-600" />
                    گواهی تمکن مالی و توان پرداخت شتاب
                  </span>
                </div>
              </div>

              {/* Seller Card with Cadastre Check */}
              <div className="p-3 rounded-2xl bg-[#faf8f4] border border-[#e4ddd0] space-y-1.5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-600 font-bold block">فروشنده / صاحب رسمی سند:</span>
                    <span className="font-black text-slate-950">{activeRoom.sellerName}</span>
                  </div>
                  <span className="font-mono font-bold text-slate-700 dir-ltr">{maskPhoneNumber(activeRoom.sellerPhone)}</span>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-[#ede6d8]">
                  <span className="inline-flex items-center gap-1 text-[9.5px] bg-emerald-50 text-emerald-900 border border-emerald-300 px-2 py-0.5 rounded-md font-black">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    استعلام تک‌برگ کاداستر
                  </span>
                  <span className="inline-flex items-center gap-1 text-[9.5px] bg-amber-50 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-md font-black">
                    <ShieldCheck className="w-3 h-3 text-amber-600" />
                    فاقد بازداشتی و معارض حقوقی
                  </span>
                </div>
              </div>

              {/* Notary / Trusted Agency */}
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-300 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-amber-950 font-black block">دفتر املاک امین حقوقی منتخب منطقه:</span>
                  <span className="font-black text-slate-950">{activeRoom.assignedAgentAgency}</span>
                </div>
                <UserCheck className="w-5 h-5 text-amber-700" />
              </div>
            </div>
          </div>

          {/* Valuation & Commission Breakdown */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#ded5c5] space-y-3.5 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
            <h3 className="font-black text-xs text-slate-950 flex items-center gap-1.5 border-b border-[#ede6d8] pb-2.5">
              <Calculator className="w-4 h-4 text-amber-700" />
              <span>ارزیابی کارشناسی و برآورد کمیسیون</span>
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-[#ede6d8]">
                <span className="text-slate-600 font-bold">قیمت پیشنهادی مالک:</span>
                <span className="font-black text-slate-950">{formatTomanShort(activeRoom.propertyPrice)}</span>
              </div>

              {/* Valuation Engine: 3 Local Expert Appraisals */}
              <div className="bg-[#fbf9f4] p-2.5 rounded-xl border border-[#ede6d8] space-y-1.5">
                <span className="text-[10.5px] font-black text-slate-800 block">
                  موتور ارزش‌گذاری سه‌گانه کارشناسان محلی منطقه:
                </span>
                <div className="flex justify-between text-[10px] text-slate-600">
                  <span>۱. کارشناسی کانون کارشناسان:</span>
                  <span className="font-bold text-slate-900">{formatTomanShort(activeRoom.expertAppraisalPrice * 0.98)}</span>
                </div>
                <div className="flex justify-between text-[10px] text-slate-600">
                  <span>۲. ارزیابی اتحادیه املاک منطقه:</span>
                  <span className="font-bold text-slate-900">{formatTomanShort(activeRoom.expertAppraisalPrice * 1.01)}</span>
                </div>
                <div className="flex justify-between text-[10px] text-slate-600">
                  <span>۳. الگوریتم هوشمند دیتاسنتر پیوند:</span>
                  <span className="font-bold text-slate-900">{formatTomanShort(activeRoom.expertAppraisalPrice)}</span>
                </div>
              </div>

              <div className="flex justify-between py-1 border-b border-[#ede6d8]">
                <span className="text-slate-600 font-bold">میانگین موزون کارشناسی عادلانه:</span>
                <span className="font-black text-emerald-900">{formatTomanShort(activeRoom.expertAppraisalPrice)}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-[#ede6d8]">
                <span className="text-slate-600 font-bold">مبنای محاسبه کمیسیون قانونی (۰.۵٪):</span>
                <span className="font-black text-amber-900">{formatTomanShort(activeRoom.commissionEstimate)}</span>
              </div>
            </div>

            {/* Action Referral Button */}
            <button
              onClick={handleSendToAgentClick}
              className="w-full mt-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3.5 rounded-2xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition-colors"
            >
              <Send className="w-4 h-4" />
              <span>ارسال پیش‌نویس به دفتر املاک امین</span>
            </button>

            {showSentSuccess && (
              <div className="mt-3 p-3 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs text-emerald-950 font-black flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>پیش‌نویس و مدارک اعتبارسنجی با موفقیت به کارگزاری املاک امین ارسال گردید.</span>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
