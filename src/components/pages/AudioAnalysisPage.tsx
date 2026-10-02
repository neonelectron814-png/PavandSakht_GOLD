import React, { useState } from 'react';
import { Mic, Play, Pause, Sparkles, FileText, CheckCircle2, ShieldCheck, Activity, Volume2, ArrowUpRight, Radio, Headphones, Download, RefreshCw } from 'lucide-react';
import { formatToman, toPersianDigits } from '../../utils/formatters';

interface AudioRecord {
  id: string;
  title: string;
  duration: string;
  fileSize: string;
  uploadDate: string;
  speaker: string;
  context: string;
  summary: string;
  sentiment: 'positive' | 'neutral' | 'urgent';
  confidenceScore: number;
  extractedTerms: string[];
  transcript: { time: string; speaker: string; text: string }[];
}

const initialAudioRecords: AudioRecord[] = [
  {
    id: 'aud-1',
    title: 'مذاکره شرایط پرداخت و تخفیف نقدی ملک سعادت‌آباد',
    duration: '۰۳:۴۵',
    fileSize: '4.8 MB',
    uploadDate: 'امروز، ۱۴:۲۰',
    speaker: 'مهندس کامران رستمی (سازنده) و حسین محمدی (خریدار)',
    context: 'اتاق معامله ملک کد PYS-9021 (سعادت‌آباد)',
    summary: 'در این فایل صوتی، خریدار درخواست تخفیف ۷ درصدی روی مبلغ کل ۳۴.۲ میلیارد تومانی را مطرح می‌کند و سازنده با پرداخت نقد طی دو مرحله (۶۰٪ نقد و ۴۰٪ همزمان با تحویل کلید در دفتر اسناد رسمی) موافقت می‌نماید.',
    sentiment: 'positive',
    confidenceScore: 98,
    extractedTerms: [
      'تخفیف توافقی: ۷٪ روی قیمت کل کارشناسی‌شده',
      'شرایط پرداخت: ۶۰٪ پیش‌پرداخت نقد، ۴۰٪ هنگام تحویل در محضر',
      'زمان محضر: ۱۰ روز آینده در دفتر املاک امین (کد ۷۴۸)',
      'تعهدات: تقبل هزینه‌های تحویل و پایان‌کار بر عهده سازنده'
    ],
    transcript: [
      { time: '۰۰:۱۵', speaker: 'حسین محمدی (خریدار)', text: 'سلام جناب رستمی. ما روی واحد سعادت‌آباد نظر مثبت داریم، اما اگر روی شرایط پرداختی مساعدت بفرمایید سریع‌تر قرارداد رو نهایی کنیم.' },
      { time: '۰۰:۵۲', speaker: 'کامران رستمی (سازنده)', text: 'سلام جناب محمدی. با توجه به اینکه شما خریدار نقدی هستید، من تا سقف ۷ درصد تخفیف روی کل مبلغ در نظر می‌گیرم مشروط بر اینکه طی دو مرحله تسویه بشه.' },
      { time: '۰۲:۱۰', speaker: 'حسین محمدی (خریدار)', text: 'عالیه. ۶۰ درصد الان و ۴۰ درصد همزمان با انتقال سند در محضر؟' },
      { time: '۰۳:۲۰', speaker: 'کامران رستمی (سازنده)', text: 'تایید میشه. فردا هم توی اتاق معامله امن پیوند ساخت مدارک نهایی رو بارگذاری می‌کنیم.' }
    ]
  },
  {
    id: 'aud-2',
    title: 'توافق تأمین مصالح سیمان و میلگرد تهاتری با زمین',
    duration: '۰۵:۱۲',
    fileSize: '6.2 MB',
    uploadDate: 'دیروز، ۱۱:۱۰',
    speaker: 'حاج بهرام کرمی (معدن‌دار) و نماینده پروژه شهرک غرب',
    context: 'بخش تهاتر و تأمین مصالح ساختمانی پیوند ساخت',
    summary: 'توافق بر سر تحویل ۵۰۰ تن سیمان و ۲۰۰ شاخه میلگرد آجدار در ازای واگذاری بخشی از سفت‌کاری پروژه شهرک غرب. تحویل به صورت هفتگی از سیمین‌دشت و معدن محلات انجام خواهد شد.',
    sentiment: 'urgent',
    confidenceScore: 96,
    extractedTerms: [
      'حجم بار: ۵۰۰ تن سیمان پاکتی تیپ ۲ و ۲۰۰ شاخه میلگرد آجدار',
      'نحوه تسویه: تهاتر با واحد مسکونی فاز ۲ شهرک غرب',
      'زمان‌بندی ارسال: شروع بارگیری از شنبه آینده',
      'گارانتی کیفیت: دارای برگه آنالیز آزمایشگاه فنی متالورژی'
    ],
    transcript: [
      { time: '۰۰:۳۰', speaker: 'حاج بهرام کرمی', text: 'سلام. بابت کوپ سنگ تراورتن و سیمان آماده‌ایم تا طبق قرارداد تهاتری با زمین شهرک غرب عمل کنیم.' },
      { time: '۰۱:۴۵', speaker: 'نماینده پروژه', text: 'بسیار عالی. لطفا آنالیز عیار سیمان و استیمان بارگیری کامیون‌ها رو برای ناظر پروژه ارسال کنید.' },
      { time: '۰۴:۱۰', speaker: 'حاج بهرام کرمی', text: 'حتماً، فردا صبح اولین پارت ۵۰ تنی سیمان و میلگرد به کارگاه ارسال میشه.' }
    ]
  }
];

export const AudioAnalysisPage: React.FC = () => {
  const [selectedRecord, setSelectedRecord] = useState<AudioRecord>(initialAudioRecords[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'summary' | 'terms' | 'transcript'>('summary');
  const [isAnalyzingNew, setIsAnalyzingNew] = useState<boolean>(false);
  const [analysisSuccess, setAnalysisSuccess] = useState<boolean>(false);

  const handleSimulateNewUpload = () => {
    setIsAnalyzingNew(true);
    setTimeout(() => {
      setIsAnalyzingNew(false);
      setAnalysisSuccess(true);
      setTimeout(() => setAnalysisSuccess(false), 4000);
    }, 2500);
  };

  return (
    <div className="space-y-6 pb-16 text-[#1c1d22]" dir="rtl">
      
      {/* Header Banner (Full Framed 3D Gold Box) */}
      <div className="bg-white p-5 sm:p-6 rounded-[28px] border-2 border-[#dfc282] space-y-3 relative overflow-hidden shadow-[0_4px_16px_rgba(180,130,40,0.1)]">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 btn-3d-gold text-[#2c1b04] px-3.5 py-1 rounded-xl text-xs font-black mb-2 shadow-2xs">
              <Headphones className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>مرکز هوش مصنوعی و آنالیز صوتی پیوندساخت (AI Voice Intelligence)</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-950">
              تحلیل، پیاده‌سازی متن و استخراج توافقات فایل‌های صوتی
            </h1>
            <p className="text-[15px] text-slate-700 font-bold mt-1 max-w-2xl leading-relaxed">
              فایل‌های صوتی جلسات و مذاکرات توسط هوش مصنوعی پردازش شده، متن کامل پیاده‌سازی و توافق‌نامه‌ها به صورت خودکار جهت ارجاع به اتاق معامله استخراج می‌گردند.
            </p>
          </div>

          <button
            onClick={handleSimulateNewUpload}
            disabled={isAnalyzingNew}
            className="h-10 px-4.5 btn-3d-gold text-[#2c1b04] font-black text-[15px] rounded-xl shadow-2xs transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer shrink-0 disabled:opacity-60"
          >
            {isAnalyzingNew ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>در حال تحلیل هوش مصنوعی صوتی...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4.5 h-4.5 text-amber-900" />
                <span>بارگذاری و آنالیز فایل صوتی جدید</span>
              </>
            )}
          </button>
        </div>

        {analysisSuccess && (
          <div className="p-3 bg-emerald-50 border-2 border-emerald-300 rounded-xl text-emerald-950 text-xs font-black animate-pulse flex items-center gap-2 shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>فایل صوتی جدید با موفقیت پردازش شد و به آرشیو اتاق معامله اضافه گردید.</span>
          </div>
        )}
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Right Column: Audio Records List */}
        <div className="space-y-3">
          <h3 className="font-black text-sm text-slate-950 px-1 flex items-center gap-1.5">
            <Mic className="w-4 h-4 text-amber-700" />
            <span>فایل‌های صوتی ضبط‌شده ({toPersianDigits(initialAudioRecords.length)})</span>
          </h3>

          <div className="space-y-3">
            {initialAudioRecords.map((rec) => (
              <div
                key={rec.id}
                onClick={() => setSelectedRecord(rec)}
                className={`p-4 rounded-[22px] border-2 transition-all cursor-pointer shadow-[0_4px_16px_rgba(180,130,40,0.08)] ${
                  selectedRecord.id === rec.id
                    ? 'bg-[#fffdfa] border-[#caa758] ring-2 ring-amber-300/40 shadow-md'
                    : 'bg-white border-[#dfc282] hover:border-[#caa758]'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <span className="text-[11px] px-2.5 py-0.5 rounded-lg bg-amber-50 text-amber-950 border border-amber-300 font-bold inline-block">
                      {rec.context}
                    </span>
                    <h4 className="font-black text-[15px] leading-snug text-slate-950 mt-1">{rec.title}</h4>
                  </div>
                  <div className="w-8.5 h-8.5 rounded-xl btn-3d-gold text-[#2c1b04] flex items-center justify-center shrink-0 shadow-2xs">
                    <Mic className="w-4 h-4 stroke-[2.5]" />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600 font-bold mt-3 pt-2 border-t border-[#eee7db]">
                  <span>زمان: {rec.duration}</span>
                  <span className="text-emerald-800 font-black">دقت AI: {toPersianDigits(rec.confidenceScore)}٪</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Left Column (2 cols): Selected Audio Player & AI Insights */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Audio Player Card */}
          <div className="bg-white p-5 sm:p-6 rounded-[28px] border-2 border-[#dfc282] space-y-5 shadow-[0_4px_16px_rgba(180,130,40,0.1)] relative overflow-hidden">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#ede6d8] pb-4">
              <div>
                <span className="text-xs text-amber-900 font-bold block mb-1">{selectedRecord.context}</span>
                <h2 className="text-base sm:text-lg font-black text-slate-950">{selectedRecord.title}</h2>
              </div>
              <span className="px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-950 border-2 border-emerald-300 text-xs font-black flex items-center gap-1.5 shrink-0 shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                تأیید اصالت صوتی ({toPersianDigits(selectedRecord.confidenceScore)}٪)
              </span>
            </div>

            {/* Interactive Player Visualizer */}
            <div className="bg-[#faf8f4] p-4 rounded-2xl border-2 border-[#dfc282] space-y-3 shadow-inner">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-11 h-11 rounded-xl btn-3d-gold text-[#2c1b04] font-black flex items-center justify-center cursor-pointer shadow-2xs active:scale-95 transition-transform shrink-0"
                >
                  {isPlaying ? <Pause className="w-5 h-5 stroke-[2.5]" /> : <Play className="w-5 h-5 ml-0.5 stroke-[2.5]" />}
                </button>

                {/* Animated Waveform Visualizer */}
                <div className="flex items-center gap-1 flex-1 mx-4 h-10 overflow-hidden">
                  {[40, 65, 30, 85, 95, 45, 70, 55, 90, 40, 75, 60, 30, 80, 100, 50, 70, 35, 85, 60, 45, 90, 65, 30, 75].map((h, i) => (
                    <div
                      key={i}
                      style={{ height: isPlaying ? `${Math.max(15, (h * Math.random() + 20))}%` : `${h}%` }}
                      className={`flex-1 rounded-full transition-all duration-300 ${
                        isPlaying ? 'bg-amber-500 animate-pulse' : 'bg-slate-300'
                      }`}
                    />
                  ))}
                </div>

                <span className="text-xs font-mono text-slate-800 font-bold shrink-0">
                  {selectedRecord.duration} / {isPlaying ? '۰۱:۲۰' : '۰۰:۰۰'}
                </span>
              </div>
            </div>

            {/* Tab Navigation (Compact 3D Gold Buttons, 15px Font) */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar border-b border-[#ede6d8] pb-3">
              <button
                onClick={() => setActiveTab('summary')}
                className={`h-9 px-4 rounded-xl text-[15px] font-black transition-all cursor-pointer ${
                  activeTab === 'summary'
                    ? 'btn-3d-gold text-[#2c1b04] shadow-2xs'
                    : 'bg-white text-slate-700 hover:text-slate-950 border-2 border-[#dfc282]'
                }`}
              >
                خلاصه هوشمند جلسه
              </button>

              <button
                onClick={() => setActiveTab('terms')}
                className={`h-9 px-4 rounded-xl text-[15px] font-black transition-all cursor-pointer ${
                  activeTab === 'terms'
                    ? 'btn-3d-gold text-[#2c1b04] shadow-2xs'
                    : 'bg-white text-slate-700 hover:text-slate-950 border-2 border-[#dfc282]'
                }`}
              >
                نکات و بندهای استخراج‌شده
              </button>

              <button
                onClick={() => setActiveTab('transcript')}
                className={`h-9 px-4 rounded-xl text-[15px] font-black transition-all cursor-pointer ${
                  activeTab === 'transcript'
                    ? 'btn-3d-gold text-[#2c1b04] shadow-2xs'
                    : 'bg-white text-slate-700 hover:text-slate-950 border-2 border-[#dfc282]'
                }`}
              >
                متن کامل پیاده‌سازی‌شده (Transcript)
              </button>
            </div>

            {/* Tab Contents */}
            <div className="pt-1">
              {activeTab === 'summary' && (
                <div className="space-y-4 text-xs">
                  <div className="p-4 rounded-2xl bg-[#faf8f4] border-2 border-[#e6dfd3] leading-relaxed text-slate-900">
                    <h4 className="font-black text-amber-950 mb-2 flex items-center gap-1.5 text-[15px]">
                      <Sparkles className="w-4.5 h-4.5 text-amber-700" />
                      <span>نتیجه‌گیری و جمع‌بندی خودکار جلسه صوتی:</span>
                    </h4>
                    <p className="text-[13px] sm:text-sm font-bold text-slate-800 leading-relaxed">{selectedRecord.summary}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl bg-white border-2 border-[#dfc282]">
                      <span className="text-xs text-slate-600 block font-bold">افراد حاضر در گفت‌وگو:</span>
                      <span className="font-black text-slate-950 text-xs sm:text-[13px] mt-0.5 block">{selectedRecord.speaker}</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white border-2 border-[#dfc282]">
                      <span className="text-xs text-slate-600 block font-bold">تاریخ و زمان ثبت:</span>
                      <span className="font-black text-amber-950 text-xs sm:text-[13px] mt-0.5 block font-mono">{selectedRecord.uploadDate}</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'terms' && (
                <div className="space-y-3">
                  <h4 className="font-black text-[15px] text-slate-950 flex items-center gap-1.5 mb-2">
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-700" />
                    <span>مهم‌ترین توافقات و تعهدات حقوقی استخراج‌شده:</span>
                  </h4>

                  {selectedRecord.extractedTerms.map((term, i) => (
                    <div key={i} className="p-3.5 rounded-xl bg-[#faf8f4] border-2 border-[#dfc282] flex items-center gap-3 text-xs sm:text-[13px]">
                      <span className="w-7 h-7 rounded-xl btn-3d-gold text-[#2c1b04] flex items-center justify-center font-mono font-black shrink-0 shadow-2xs">
                        {toPersianDigits(i + 1)}
                      </span>
                      <span className="font-black text-slate-950">{term}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'transcript' && (
                <div className="space-y-3 max-h-96 overflow-y-auto pr-1 custom-gold-scrollbar">
                  {selectedRecord.transcript.map((line, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-[#faf8f4] border-2 border-[#e6dfd3] text-xs space-y-1">
                      <div className="flex items-center justify-between text-xs text-amber-950 font-mono font-bold">
                        <span>{line.speaker}</span>
                        <span>{toPersianDigits(line.time)}</span>
                      </div>
                      <p className="text-slate-900 leading-relaxed font-bold text-xs sm:text-[13px]">{line.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
