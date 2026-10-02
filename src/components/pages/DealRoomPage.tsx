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
  Check, 
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
      <div className="bg-white rounded-[28px] p-10 text-center space-y-4 border-2 border-[#dfc282] shadow-[0_4px_16px_rgba(180,130,40,0.1)]" dir="rtl">
        <div className="w-16 h-16 rounded-2xl btn-3d-gold text-[#2c1b04] mx-auto flex items-center justify-center shadow-2xs">
          <Lock className="w-8 h-8 stroke-[2.5]" />
        </div>
        <h2 className="text-lg font-black text-slate-950">اتاق معامله فعال یافت نشد</h2>
        <p className="text-[15px] text-slate-700 font-bold">از طریق بازار ملک می‌توانید وارد اتاق معامله محرمانه شوید.</p>
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
      {/* Header Banner Card (Full Framed 3D Gold Box) */}
      <div className="bg-white p-5 sm:p-6 rounded-[28px] border-2 border-[#dfc282] space-y-3 relative overflow-hidden shadow-[0_4px_16px_rgba(180,130,40,0.1)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <div className="inline-flex items-center gap-1.5 btn-3d-gold text-[#2c1b04] px-3.5 py-1 rounded-xl text-xs font-black shadow-2xs">
                <KeyRound className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>محیط محرمانه رمزنگاری‌شده ۲۵۶ بیتی (E2EE)</span>
              </div>
              <span className="text-xs bg-emerald-100 text-emerald-950 border border-emerald-300 px-3 py-0.5 rounded-full font-black">
                بیش از ۸۰٪ معاملات رسمی در اتاق معامله منعقد می‌شود
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-950">
              اتاق معامله تخصصی و امن (Deal Room)
            </h1>
            <p className="text-[15px] text-slate-700 font-bold mt-1 max-w-xl leading-relaxed">
              مدیریت مرحله‌ای اسناد، کارشناسی قیمت، توافق‌نامه و ارجاع حقوقی به دفاتر املاک امین با ضمانت سلامت معامله
            </p>
          </div>

          <div className="bg-[#fffcf7] p-3.5 rounded-2xl border-2 border-[#dfc282] text-xs space-y-1 shrink-0 shadow-2xs">
            <p className="text-slate-600 font-bold text-xs">شناسه امنیتی پرونده:</p>
            <p className="font-mono font-black text-amber-950 text-base tracking-wider">{activeRoom.propertyCode}</p>
          </div>
        </div>
      </div>

      {/* Select active deal room tabs if multiple */}
      {dealRooms.length > 1 && (
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {dealRooms.map((room) => {
            const isSelected = selectedRoomId === room.id;
            return (
              <button
                key={room.id}
                onClick={() => {
                  setSelectedRoomId(room.id);
                  setNotes(room.confidentialNotes);
                }}
                className={`h-9 px-4 rounded-xl text-[15px] font-black shrink-0 transition-all cursor-pointer active:scale-95 flex items-center justify-center ${
                  isSelected
                    ? 'btn-3d-gold text-[#2c1b04] shadow-2xs'
                    : 'bg-white hover:bg-amber-50/60 text-slate-900 border-2 border-[#dfc282]'
                }`}
              >
                {room.propertyTitle} ({room.propertyCode})
              </button>
            );
          })}
        </div>
      )}

      {/* 5-Step Pipeline Stepper Card */}
      <div className="bg-white p-5 sm:p-6 rounded-[28px] border-2 border-[#dfc282] space-y-4 shadow-[0_4px_16px_rgba(180,130,40,0.1)]">
        <h2 className="text-base font-black text-slate-950 flex items-center gap-2 border-b border-[#ede6d8] pb-3">
          <Clock className="w-4.5 h-4.5 text-amber-700" />
          <span>مراحل گام به گام معامله تا تنظیم سند رسمی</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 relative">
          {activeRoom.steps.map((step) => (
            <div
              key={step.stepNumber}
              className={`p-3.5 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                step.completed
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950 shadow-2xs'
                  : step.active
                  ? 'bg-amber-50 border-[#caa758] text-amber-950 shadow-md ring-2 ring-amber-400/40'
                  : 'bg-[#faf8f4] border-[#e2dcd0] text-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`w-7 h-7 rounded-xl text-xs font-black flex items-center justify-center shadow-xs ${
                    step.completed
                      ? 'bg-emerald-600 text-white'
                      : step.active
                      ? 'btn-3d-gold text-[#2c1b04]'
                      : 'bg-slate-200 text-slate-800'
                  }`}>
                    {step.completed ? <Check className="w-4 h-4 stroke-[3]" /> : toPersianDigits(step.stepNumber)}
                  </span>
                  
                  {step.active && (
                    <span className="text-[11px] btn-3d-gold text-[#2c1b04] font-black px-2 py-0.5 rounded-full shadow-2xs">
                      گام جاری
                    </span>
                  )}
                </div>

                <h3 className="font-black text-[13px] mb-1 text-slate-950">{step.title}</h3>
                <p className="text-[11px] leading-relaxed text-slate-700 font-bold">{step.description}</p>
              </div>
              
              {step.date && (
                <span className="text-[10px] block mt-2 font-bold font-mono text-slate-500">{step.date}</span>
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
          <div className="bg-white p-5 sm:p-6 rounded-[28px] border-2 border-[#dfc282] space-y-4 shadow-[0_4px_16px_rgba(180,130,40,0.1)]">
            <div className="flex items-center justify-between border-b border-[#ede6d8] pb-3">
              <div>
                <h3 className="font-black text-base text-slate-950 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-700" />
                  <span>اسناد، مدارک و استعلام‌های ثبتی</span>
                </h3>
                <p className="text-xs text-slate-600 font-bold mt-0.5">مدارک احراز هویت، کاداستر و اسناد ثبتی طرفین</p>
              </div>

              <span className="text-xs bg-emerald-50 text-emerald-950 font-black px-3 py-1 rounded-xl border border-emerald-300">
                استعلام برخط فعال
              </span>
            </div>

            <div className="space-y-3">
              {activeRoom.documents.map((doc: DealRoomDocument) => (
                <div
                  key={doc.id}
                  className="p-3.5 rounded-2xl bg-[#faf8f4] border-2 border-[#e6dfd3] flex items-center justify-between gap-3 hover:border-[#caa758] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl btn-3d-gold flex items-center justify-center text-[#2c1b04] shadow-2xs shrink-0">
                      <FileText className="w-4.5 h-4.5 stroke-[2.5]" />
                    </div>
                    <div>
                      <h4 className="font-black text-[15px] text-slate-950">{doc.title}</h4>
                      <p className="text-xs text-slate-600 font-bold mt-0.5">{doc.type}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-emerald-50 text-emerald-900 border border-emerald-300 px-2.5 py-1 rounded-xl font-black flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>{doc.verified ? 'تأیید شده' : 'در حال استعلام'}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Confidential Live Negotiation Notes & Bidding Box */}
          <div className="bg-white p-5 sm:p-6 rounded-[28px] border-2 border-[#dfc282] space-y-4 shadow-[0_4px_16px_rgba(180,130,40,0.1)]">
            <h3 className="font-black text-base text-slate-950 flex items-center gap-2 border-b border-[#ede6d8] pb-3">
              <Lock className="w-4.5 h-4.5 text-amber-700" />
              <span>مذاکرات محرمانه و ثبت پیشنهاد قیمت زنده</span>
            </h3>

            {/* Instant Bid Form */}
            <form onSubmit={handleSendInstantBid} className="flex gap-2">
              <input
                type="text"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                placeholder="ثبت پیشنهاد مالی جدید (مثال: ۱۲,۵۰۰,۰۰۰,۰۰۰ تومان)..."
                className="flex-1 bg-[#faf8f4] border-2 border-[#dfc282] focus:border-[#caa758] rounded-xl px-3.5 py-2 text-[15px] text-slate-950 font-bold placeholder-slate-400 focus:outline-none transition-all shadow-2xs"
              />
              <button
                type="submit"
                className="h-9 px-4.5 btn-3d-gold text-[#2c1b04] font-black text-[15px] rounded-xl flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95 transition-transform shrink-0"
              >
                <span>ثبت آفر</span>
              </button>
            </form>

            {bidSuccessMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-950 font-black flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>{bidSuccessMsg}</span>
              </div>
            )}

            {/* Notes List */}
            <div className="space-y-2 max-h-56 overflow-y-auto custom-gold-scrollbar pl-1">
              {notes.map((n, i) => (
                <div key={i} className="p-3 rounded-xl bg-[#faf8f4] border border-[#e4ddd0] text-xs font-bold text-slate-800 leading-relaxed">
                  {n}
                </div>
              ))}
            </div>

            {/* Add regular note */}
            <form onSubmit={handleAddNote} className="flex gap-2 pt-1">
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="افزودن یادداشت محرمانه حقوقی طرفین..."
                className="flex-1 bg-[#faf8f4] border-2 border-[#dfc282] focus:border-[#caa758] rounded-xl px-3.5 py-2 text-[15px] text-slate-950 font-bold placeholder-slate-400 focus:outline-none transition-all shadow-2xs"
              />
              <button
                type="submit"
                className="h-9 px-4.5 btn-3d-gold text-[#2c1b04] font-black text-[15px] rounded-xl flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95 transition-transform shrink-0"
              >
                <Send className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>ارسال</span>
              </button>
            </form>
          </div>

        </div>

        {/* Right Column: Parties, Valuation, Agency Referral & Commission */}
        <div className="space-y-6">
          
          {/* Parties Overview Box */}
          <div className="bg-white p-5 sm:p-6 rounded-[28px] border-2 border-[#dfc282] space-y-3.5 shadow-[0_4px_16px_rgba(180,130,40,0.1)]">
            <div className="flex items-center justify-between border-b border-[#ede6d8] pb-2.5">
              <h3 className="font-black text-[15px] text-slate-950">
                طرفین معامله و اعتبارسنجی
              </h3>
              <span className="text-[11px] bg-emerald-100 text-emerald-950 font-black px-2 py-0.5 rounded-full border border-emerald-300">
                احراز هویت ۲ طرفه
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              {/* Buyer Card */}
              <div className="p-3 rounded-2xl bg-[#faf8f4] border-2 border-[#e6dfd3] space-y-1.5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-600 font-bold block">خریدار / سرمایه‌گذار واقعی:</span>
                    <span className="font-black text-[15px] text-slate-950">{activeRoom.buyerName}</span>
                  </div>
                  <span className="font-mono font-bold text-slate-700 dir-ltr text-xs">{maskPhoneNumber(activeRoom.buyerPhone)}</span>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-[#ede6d8]">
                  <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-900 border border-emerald-300 px-2 py-0.5 rounded-md font-black">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    احراز ثنا و کدملی
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] bg-blue-50 text-blue-900 border border-blue-300 px-2 py-0.5 rounded-md font-black">
                    <ShieldCheck className="w-3 h-3 text-blue-600" />
                    تمکن مالی شتاب
                  </span>
                </div>
              </div>

              {/* Seller Card */}
              <div className="p-3 rounded-2xl bg-[#faf8f4] border-2 border-[#e6dfd3] space-y-1.5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-600 font-bold block">فروشنده / صاحب رسمی سند:</span>
                    <span className="font-black text-[15px] text-slate-950">{activeRoom.sellerName}</span>
                  </div>
                  <span className="font-mono font-bold text-slate-700 dir-ltr text-xs">{maskPhoneNumber(activeRoom.sellerPhone)}</span>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-[#ede6d8]">
                  <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-900 border border-emerald-300 px-2 py-0.5 rounded-md font-black">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    استعلام تک‌برگ کاداستر
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] bg-amber-50 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-md font-black">
                    <ShieldCheck className="w-3 h-3 text-amber-600" />
                    فاقد معارض حقوقی
                  </span>
                </div>
              </div>

              {/* Notary / Trusted Agency */}
              <div className="p-3 rounded-2xl bg-amber-50 border-2 border-[#caa758] flex items-center justify-between">
                <div>
                  <span className="text-xs text-amber-950 font-black block">دفتر املاک امین منتخب منطقه:</span>
                  <span className="font-black text-[15px] text-slate-950">{activeRoom.assignedAgentAgency}</span>
                </div>
                <UserCheck className="w-5 h-5 text-amber-800" />
              </div>
            </div>
          </div>

          {/* Valuation & Commission Breakdown Card */}
          <div className="bg-white p-5 sm:p-6 rounded-[28px] border-2 border-[#dfc282] space-y-3.5 shadow-[0_4px_16px_rgba(180,130,40,0.1)]">
            <h3 className="font-black text-[15px] text-slate-950 flex items-center gap-1.5 border-b border-[#ede6d8] pb-2.5">
              <Calculator className="w-4.5 h-4.5 text-amber-700" />
              <span>ارزیابی کارشناسی و برآورد کمیسیون</span>
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-[#ede6d8]">
                <span className="text-slate-600 font-bold text-xs">قیمت پیشنهادی مالک:</span>
                <span className="font-black text-[15px] text-slate-950 font-mono">{formatTomanShort(activeRoom.propertyPrice)}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-[#ede6d8]">
                <span className="text-slate-600 font-bold text-xs">میانگین موزون کارشناسی عادلانه:</span>
                <span className="font-black text-[15px] text-emerald-900 font-mono">{formatTomanShort(activeRoom.expertAppraisalPrice)}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-[#ede6d8]">
                <span className="text-slate-600 font-bold text-xs">کمیسیون قانونی مصوب (۰.۵٪):</span>
                <span className="font-black text-[15px] text-amber-950 font-mono">{formatTomanShort(activeRoom.commissionEstimate)}</span>
              </div>
            </div>

            {/* Action Referral Button */}
            <button
              onClick={handleSendToAgentClick}
              className="w-full mt-3 h-10 btn-3d-gold text-[#2c1b04] font-black text-[15px] rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-2xs active:scale-95 transition-transform"
            >
              <Send className="w-4 h-4 stroke-[2.5]" />
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
