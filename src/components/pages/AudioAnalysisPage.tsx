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
    title: 'فایل صوتی شماره ۱: مذاکره شرایط پرداخت و تخفیف نقدی ملک سعادت‌آباد',
    duration: '۰۳:۴۵',
    fileSize: '4.8 MB',
    uploadDate: 'امروز، ۱۴:۲۰',
    speaker: 'مهندس کامران رستمی (سازنده) و حسین محمدی (خریدار)',
    context: 'اتاق معامله ملک کد PYS-9021 (سعادت‌آباد)',
    summary: 'در این فایل صوتی، خریدار درخواست تخفیف ۷ درصدی روی مبلغ کل ۳۴.۲ میلیارد تومانی را مطرح می‌کند و سازنده با پرداخت نقد طی دو مرحله (۶۰٪ نقد و ۴۰٪ همزمان با تحویل کلید در دفتر اسناد رسمی) موافقت می‌نماید.',
    sentiment: 'positive',
    confidenceScore: 98,
    extractedTerms: [
      'تخفیف توافقی: ۷٪ روی قیمت کل',
      'شرایط پرداخت: ۶۰٪ پیش‌پرداخت، ۴۰٪ هنگام تحویل',
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
    title: 'فایل صوتی شماره ۲: توافق تأمین مصالح سیمان و میلگرد تهاتری با زمین',
    duration: '۰۵:۱۲',
    fileSize: '6.2 MB',
    uploadDate: 'دیروز، ۱۱:۱۰',
    speaker: 'حاج بهرام کرمی (معدن‌دار) و نماینده پروژه شهرک غرب',
    context: 'بخش تهاتر و تأمین مصالح ساختمانی پیوند ساخت',
    summary: 'توافق بر سر تحویل ۵۰۰ تن سیمان و ۲۰۰ شاخه میلگرد آجدار در ازای واگذاری بخشی از سفت‌کاری پروژه شهرک غرب. تحویل به صورت هفتگی از سیمین‌دشت و معدن محلات انجام خواهد شد.',
    sentiment: 'urgent',
    confidenceScore: 96,
    extractedTerms: [
      'حجم بار: ۵۰۰ تن سیمان پاکتی تیپ ۲ و ۲۰۰ شاخه میلگرد',
      'نحوه تسویه: تهاتر با واحد مسکونی فاز ۲ شهرک غرب',
      'زمان‌بندی ارسال: شروع بارگیری از شنبه آینده',
      'گارانتی کیفیت: دارای برگه آنالیز آزمایشگاه فنی'
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
  const [activeTab, setActiveTab] = useState<'transcript' | 'summary' | 'terms'>('summary');
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
    <div className="space-y-6 pb-12">
      
      {/* Header Banner */}
      <div className="glass-card text-white p-6 sm:p-7 rounded-3xl border border-amber-500/30 space-y-3 relative overflow-hidden shadow-glass-3d">
        <div className="absolute top-0 -left-10 w-80 h-80 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 glass-amber text-amber-300 border border-amber-400/40 px-3.5 py-1 rounded-full text-xs font-black mb-2 shadow-sm">
              <Headphones className="w-3.5 h-3.5" />
              <span>مرکز هوشمند هوش مصنوعی و آنالیز صوتی (AI Voice Intelligence)</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">تحلیل، پیاده‌سازی متن و استخراج نکات کلیدی فایل‌های صوتی</h1>
            <p className="text-xs text-slate-300 font-light mt-1 max-w-xl">
              فایل‌های صوتی بارگذاری‌شده توسط هوش مصنوعی پردازش شده، متن کامل پیاده‌سازی و توافق‌نامه‌ها به صورت خودکار استخراج می‌گردند.
            </p>
          </div>

          <button
            onClick={handleSimulateNewUpload}
            disabled={isAnalyzingNew}
            className="btn-3d-amber text-slate-950 font-black px-5 py-3 rounded-2xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shrink-0 border border-amber-300/50"
          >
            {isAnalyzingNew ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>در حال تحلیل هوش مصنوعی فایل صوتی...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>بارگذاری و آنالیز فایل صوتی جدید</span>
              </>
            )}
          </button>
        </div>

        {analysisSuccess && (
          <div className="p-3 bg-emerald-500/20 border border-emerald-400/50 rounded-xl text-emerald-200 text-xs font-bold animate-pulse flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>فایل صوتی جدید با موفقیت پردازش شد و به آرشیو اتاق معامله اضافه گردید.</span>
          </div>
        )}
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Sidebar: Audio Records List */}
        <div className="space-y-3">
          <h3 className="font-extrabold text-xs text-slate-300 uppercase tracking-wider px-1">
            فایل‌های صوتی بارگذاری‌شده ({initialAudioRecords.length})
          </h3>

          <div className="space-y-3">
            {initialAudioRecords.map((rec) => (
              <div
                key={rec.id}
                onClick={() => setSelectedRecord(rec)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer card-3d-tilt ${
                  selectedRecord.id === rec.id
                    ? 'glass-amber border-amber-400/60 text-amber-200 shadow-glass-3d'
                    : 'glass-card border-white/10 text-slate-300 hover:text-white'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800/80 text-amber-300 border border-amber-500/30 font-mono inline-block">
                      {rec.context}
                    </span>
                    <h4 className="font-bold text-xs leading-relaxed text-white">{rec.title}</h4>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900/80 text-amber-400 border border-white/10 shrink-0">
                    <Mic className="w-4 h-4" />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 mt-3 pt-2 border-t border-white/10 font-mono">
                  <span>زمان: {rec.duration}</span>
                  <span>دقت هوش مصنوعی: {rec.confidenceScore}٪</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Main Panel: Selected Audio Details, Waveform & AI Insights */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Audio Player & Waveform Card */}
          <div className="glass-card p-6 rounded-3xl border border-white/20 space-y-5 shadow-glass-3d relative overflow-hidden">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <span className="text-xs text-amber-400 font-mono block mb-1">{selectedRecord.context}</span>
                <h2 className="text-sm sm:text-base font-black text-white">{selectedRecord.title}</h2>
              </div>
              <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold flex items-center gap-1.5 shrink-0">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                تایید اصالت صوتی ({selectedRecord.confidenceScore}٪)
              </span>
            </div>

            {/* Simulated Interactive Player Bar */}
            <div className="glass-panel-dark p-4 rounded-2xl border border-white/15 space-y-3">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-12 h-12 rounded-2xl btn-3d-amber text-slate-950 font-black flex items-center justify-center cursor-pointer shadow-lg"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                </button>

                {/* Animated Waveform Visualizer */}
                <div className="flex items-center gap-1 flex-1 mx-4 h-10 overflow-hidden">
                  {[40, 65, 30, 85, 95, 45, 70, 55, 90, 40, 75, 60, 30, 80, 100, 50, 70, 35, 85, 60, 45, 90, 65, 30, 75].map((h, i) => (
                    <div
                      key={i}
                      style={{ height: isPlaying ? `${Math.max(15, (h * Math.random() + 20))}%` : `${h}%` }}
                      className={`flex-1 rounded-full transition-all duration-300 ${
                        isPlaying ? 'bg-amber-400 animate-pulse' : 'bg-slate-600'
                      }`}
                    />
                  ))}
                </div>

                <span className="text-xs font-mono text-slate-300 font-bold shrink-0">
                  {selectedRecord.duration} / {isPlaying ? '۰۱:۲۰' : '۰۰:۰۰'}
                </span>
              </div>
            </div>

            {/* Tab Navigation for Transcript vs Summary vs Terms */}
            <div className="flex gap-2 border-b border-white/10 pb-3">
              <button
                onClick={() => setActiveTab('summary')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'summary'
                    ? 'glass-amber text-amber-300 border border-amber-400/50'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                خلاصه هوشمند هوش مصنوعی
              </button>

              <button
                onClick={() => setActiveTab('terms')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'terms'
                    ? 'glass-amber text-amber-300 border border-amber-400/50'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                نکات و بندهای استخراج‌شده
              </button>

              <button
                onClick={() => setActiveTab('transcript')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'transcript'
                    ? 'glass-amber text-amber-300 border border-amber-400/50'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                متن کامل پیاده‌سازی‌شده (Transcript)
              </button>
            </div>

            {/* Tab Contents */}
            <div className="pt-2">
              {activeTab === 'summary' && (
                <div className="space-y-4 text-xs">
                  <div className="p-4 rounded-2xl glass-panel-dark border border-white/15 leading-relaxed text-slate-200">
                    <h4 className="font-extrabold text-amber-300 mb-2 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>نتیجه‌گیری خودکار جلسه صوتی:</span>
                    </h4>
                    <p>{selectedRecord.summary}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl glass-card border border-white/10">
                      <span className="text-[10px] text-slate-400 block font-medium">افراد حاضر در گفت‌وگو:</span>
                      <span className="font-bold text-white text-xs mt-0.5 block">{selectedRecord.speaker}</span>
                    </div>

                    <div className="p-3.5 rounded-xl glass-card border border-white/10">
                      <span className="text-[10px] text-slate-400 block font-medium">تاریخ و زمان ثبت:</span>
                      <span className="font-bold text-amber-300 text-xs mt-0.5 block font-mono">{selectedRecord.uploadDate}</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'terms' && (
                <div className="space-y-3">
                  <h4 className="font-extrabold text-xs text-amber-300 flex items-center gap-1.5 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>مهم‌ترین توافقات و تعهدات حقوقی استخراج‌شده:</span>
                  </h4>

                  {selectedRecord.extractedTerms.map((term, i) => (
                    <div key={i} className="p-3.5 rounded-xl glass-panel-dark border border-white/15 flex items-center gap-3 text-xs">
                      <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center font-mono font-bold shrink-0 border border-amber-500/40">
                        {toPersianDigits(i + 1)}
                      </span>
                      <span className="font-bold text-white">{term}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'transcript' && (
                <div className="space-y-3 max-h-96 overflow-y-auto pr-1 no-scrollbar">
                  {selectedRecord.transcript.map((line, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl glass-panel-dark border border-white/10 text-xs space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-amber-300 font-mono">
                        <span className="font-bold">{line.speaker}</span>
                        <span>{toPersianDigits(line.time)}</span>
                      </div>
                      <p className="text-slate-200 leading-relaxed">{line.text}</p>
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
