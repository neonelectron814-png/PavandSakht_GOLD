import React, { StrictMode, Component, ErrorInfo, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class RootErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Unhandled app error caught by RootErrorBoundary:', error, errorInfo);
  }

  handleReload = () => {
    try {
      localStorage.removeItem('payvand_auth_token');
      localStorage.removeItem('payvand_user_data');
    } catch {
      // ignore
    }
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full bg-[#faf8f4] flex flex-col items-center justify-center p-6 text-center font-['Vazirmatn',sans-serif]" dir="rtl">
          <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#dfc282] shadow-xl space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 text-2xl font-black">
              ⚠️
            </div>
            <h2 className="text-xl font-black text-slate-950">پیوندساخت | بازنشانی سامانه</h2>
            <p className="text-xs text-slate-600 font-bold leading-relaxed">
              برای نمایش بدون وقفه سامانه، حافظه موقت بازنشانی شد. با زدن دکمه زیر صفحه بلافاصله بارگذاری می‌شود.
            </p>
            <button
              onClick={this.handleReload}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#dfc282] to-[#caa758] text-slate-950 font-black text-xs shadow-md hover:brightness-105 active:scale-95 transition-all cursor-pointer"
            >
              بارگذاری مجدد و مشاهده سامانه
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RootErrorBoundary>
      <App />
    </RootErrorBoundary>
  </StrictMode>,
);
