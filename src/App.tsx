/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  mockUsers, 
  mockProperties, 
  mockDealRooms, 
  mockNotifications, 
  mockPriceIndices 
} from './data/mockData';
import { UserRole, User, Property, DealRoom, NotificationItem, LiveActivityEvent, LiveTickerItem } from './types';
import { Header } from './components/common/Header';
import { DesktopHeader } from './components/common/DesktopHeader';
import { BottomNav } from './components/common/BottomNav';
import { FAB } from './components/common/FAB';
import { BottomSheetModal } from './components/common/BottomSheetModal';
import { SubmitModal } from './components/modals/SubmitModal';
import { CitySelectModal } from './components/modals/CitySelectModal';
import { LiveTickerBar } from './components/common/LiveTickerBar';
import { LiveActivityModal } from './components/common/LiveActivityModal';
import { MoreMenuSheet } from './components/common/MoreMenuSheet';
import { 
  initialTickerItems, 
  initialLiveEvents, 
  generateNextLiveEvent, 
  updateTickerItems, 
  playSubtleChime 
} from './utils/realtimeEngine';
import { ChevronLeft, Home as HomeIcon } from 'lucide-react';

// Pages
import { PayvandHome } from './components/pages/PayvandHome';
import { PayvandWebDesktop } from './components/pages/PayvandWebDesktop';
import { MarketplacePage } from './components/pages/MarketplacePage';
import { DealRoomPage } from './components/pages/DealRoomPage';
import { RateCutterPage } from './components/pages/RateCutterPage';
import { BarterPage } from './components/pages/BarterPage';
import { PartnershipPage } from './components/pages/PartnershipPage';
import { MaterialsMarketPage } from './components/pages/MaterialsMarketPage';
import { CraftsmenPage } from './components/pages/CraftsmenPage';
import { PriceDataCenterPage } from './components/pages/PriceDataCenterPage';
import { PropertyDetailPage } from './components/pages/PropertyDetailPage';
import { RoleDashboardPage } from './components/pages/RoleDashboardPage';
import { AdminPanelPage } from './components/pages/AdminPanelPage';
import { NotificationsPage } from './components/pages/NotificationsPage';
import { ProfilePage } from './components/pages/ProfilePage';
import { AudioAnalysisPage } from './components/pages/AudioAnalysisPage';
import { InstallmentPage } from './components/pages/InstallmentPage';
import { CustomerRequestsPage } from './components/pages/CustomerRequestsPage';
import { Building3DStudioPage } from './components/pages/Building3DStudioPage';
import { AuthScreen } from './components/pages/AuthScreen';

export default function App() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('payvand_auth_token') === 'true';
    }
    return false;
  });

  const [loggedInUser, setLoggedInUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('payvand_user_data');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          return null;
        }
      }
    }
    return null;
  });

  // Navigation State
  const [activeTab, setActiveTab] = useState<string>('home');
  const [activeRole, setActiveRole] = useState<UserRole>('buyer');
  
  // Screen size & device preview detection: Desktop Web (>= 1024px) vs Mobile Android (< 1024px)
  const [isDesktop, setIsDesktop] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024;
    }
    return false;
  });

  // Manual view preview toggle (if user wants to toggle between desktop web & mobile frame)
  const [forcedViewMode, setForcedViewMode] = useState<'auto' | 'desktop' | 'mobile'>('auto');

  useEffect(() => {
    const handleResize = () => {
      if (forcedViewMode === 'auto') {
        setIsDesktop(window.innerWidth >= 1024);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [forcedViewMode]);

  const effectiveIsDesktop = forcedViewMode === 'desktop' ? true : forcedViewMode === 'mobile' ? false : isDesktop;

  // Data States
  const [properties, setProperties] = useState<Property[]>(mockProperties);
  const [dealRooms, setDealRooms] = useState<DealRoom[]>(mockDealRooms);
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);
  
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('انتخاب استان / شهر');

  // Real-Time Engine States
  const [tickerItems, setTickerItems] = useState<LiveTickerItem[]>(initialTickerItems);
  const [liveEvents, setLiveEvents] = useState<LiveActivityEvent[]>(initialLiveEvents);
  const [isLiveActive, setIsLiveActive] = useState<boolean>(true);
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(false);
  const [isLiveFeedModalOpen, setIsLiveFeedModalOpen] = useState<boolean>(false);

  // Modals & Bottom Sheets
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState<boolean>(false);
  const [isCityModalOpen, setIsCityModalOpen] = useState<boolean>(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false);
  const [isMoreMenuSheetOpen, setIsMoreMenuSheetOpen] = useState<boolean>(false);
  const [submitModalType, setSubmitModalType] = useState<'property' | 'material_quote' | 'barter' | 'partnership'>('property');

  // Real-Time Simulation Interval
  useEffect(() => {
    if (!isLiveActive) return;

    const interval = setInterval(() => {
      setTickerItems((prev) => updateTickerItems(prev));
      const newEvent = generateNextLiveEvent();
      setLiveEvents((prev) => [newEvent, ...prev.slice(0, 40)]);
      if (isSoundEnabled) {
        playSubtleChime();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isLiveActive, isSoundEnabled]);

  const handleLoginSuccess = (userData: Partial<User> & { nationalId?: string; phone: string; name?: string }) => {
    const matched = mockUsers.find(u => u.phone === userData.phone);
    const userToSet: User = matched || {
      id: `u-${Date.now()}`,
      name: userData.name || 'کاربر پیوندساخت',
      phone: userData.phone,
      role: userData.role || 'buyer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      verified: true,
      creditScore: userData.creditScore || 95,
      badgeTitle: userData.badgeTitle || 'عضو تأییدشده',
      location: userData.location || 'تهران',
      bio: 'کاربر احراز هویت شده در سامانه پیوندساخت',
    };

    setLoggedInUser(userToSet);
    setIsAuthenticated(true);
    if (userToSet.role) {
      setActiveRole(userToSet.role);
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('payvand_auth_token', 'true');
      localStorage.setItem('payvand_user_data', JSON.stringify(userToSet));
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setLoggedInUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('payvand_auth_token');
      localStorage.removeItem('payvand_user_data');
    }
    setActiveTab('home');
  };

  const currentUser: User = loggedInUser || mockUsers.find((u) => u.role === activeRole) || mockUsers[0];
  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  const handleRoleChange = (newRole: UserRole) => {
    setActiveRole(newRole);
  };

  const handleSelectProperty = (property: Property) => {
    setSelectedProperty(property);
    setActiveTab('property_detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEnterDealRoom = (propertyCode: string) => {
    const existing = dealRooms.find((dr) => dr.propertyCode === propertyCode);
    if (existing) {
      setActiveTab('deal_room');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const targetProp = properties.find((p) => p.code === propertyCode);
    if (targetProp) {
      const newRoom: DealRoom = {
        id: `dr-${Date.now()}`,
        title: `اتاق معامله محرمانه - ${targetProp.title}`,
        propertyCode: targetProp.code,
        propertyTitle: targetProp.title,
        propertyPrice: targetProp.price,
        propertyImage: targetProp.images[0],
        buyerName: currentUser.name,
        buyerPhone: currentUser.phone,
        sellerName: targetProp.ownerName,
        sellerPhone: targetProp.ownerPhone,
        assignedAgentName: 'رضا کریمی',
        assignedAgentAgency: 'دفتر املاک امین کد ۷۴۸',
        currentStep: 1,
        status: 'active',
        expertAppraisalPrice: Math.round(targetProp.price * 0.98),
        commissionEstimate: Math.round(targetProp.price * 0.005),
        createdAt: 'امروز',
        lastUpdate: 'هم‌اکنون',
        confidentialNotes: ['ورود خریدار به اتاق معامله محرمانه ثبت گردید.'],
        steps: [
          { stepNumber: 1, title: 'استعلام اسناد و هویت', description: 'بررسی اصل سند و استعلام الکترونیک ثبت', completed: false, active: true, date: 'امروز' },
          { stepNumber: 2, title: 'ارزیابی و قیمت‌گذاری کارشناسی', description: 'بازدید کارشناس پیوند ساخت و تعیین قیمت عادلانه روز', completed: false, active: false },
          { stepNumber: 3, title: 'تنظیم پیش‌نویس محرمانه', description: 'توافق نحوه پرداخت و شروط طرفین', completed: false, active: false },
          { stepNumber: 4, title: 'ارجاع به املاک امین', description: 'ارسال مدارک به دفتر املاک امین جهت ثبت کد رهگیری', completed: false, active: false },
          { stepNumber: 5, title: 'امضای نهایی و کمیسیون', description: 'امضای مبایعه‌نامه رسمی و تسویه کمیسیون مصوب', completed: false, active: false },
        ],
        documents: [
          { id: 'd1', title: 'سند تک‌برگ ملک', type: 'سند ملکی', verified: true },
          { id: 'd2', title: 'استعلام ثبتی عدم بازداشتی', type: 'استعلام', verified: true },
        ],
      };

      setDealRooms([newRoom, ...dealRooms]);
    }

    setActiveTab('deal_room');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddProperty = (newPropPartial: Partial<Property>) => {
    const newProp: Property = {
      id: `p-${Date.now()}`,
      code: `PYS-${Math.floor(1000 + Math.random() * 9000)}`,
      title: newPropPartial.title || 'فایل ملک اعتبارسنجی‌شده',
      dealType: newPropPartial.dealType || 'sale',
      propertyType: newPropPartial.propertyType || 'apartment',
      city: newPropPartial.city || 'تهران',
      district: newPropPartial.district || 'سعادت‌آباد',
      price: newPropPartial.price || 30000000000,
      pricePerMeter: newPropPartial.pricePerMeter || 150000000,
      area: newPropPartial.area || 150,
      rooms: newPropPartial.rooms || 3,
      year: 1403,
      verifiedStatus: 'pending',
      images: newPropPartial.images || ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800'],
      features: newPropPartial.features || ['مستر‌روم', 'پارکینگ'],
      description: newPropPartial.description || 'فایل ملک ثبت‌شده جهت اعتبارسنجی.',
      ownerId: currentUser.id,
      ownerName: currentUser.name,
      ownerPhone: currentUser.phone,
      documentType: 'سند تک‌برگ شش‌دانگ',
      createdAt: 'امروز',
      rating: 5,
      viewsCount: 1,
    };

    setProperties([newProp, ...properties]);
  };

  const handleVerifyProperty = (id: string) => {
    setProperties(properties.map((p) => p.id === id ? { ...p, verifiedStatus: 'verified' } : p));
  };

  const handleRejectProperty = (id: string) => {
    setProperties(properties.map((p) => p.id === id ? { ...p, verifiedStatus: 'rejected' } : p));
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const handleEmitCustomLiveEvent = (title: string, desc: string, type: LiveActivityEvent['type']) => {
    const timeStr = new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const customEv: LiveActivityEvent = {
      id: `custom-${Date.now()}`,
      title,
      description: desc,
      type,
      timestamp: timeStr,
      badge: 'رویداد لحظه‌ای',
      badgeColor: 'amber',
      actor: currentUser.name,
    };
    setLiveEvents((prev) => [customEv, ...prev]);
    if (isSoundEnabled) playSubtleChime();
  };

  const getPageTitle = (tab: string): string => {
    switch (tab) {
      case 'market': return 'بازار معاملات و املاک اعتبارسنجی‌شده';
      case 'deal_room': return 'اتاق معامله محرمانه و مدیریت قراردادها';
      case 'rate_cutter': return 'شکارچی قیمت و فرصت‌های زیر فی کارشناسی';
      case 'barter': return 'سامانه تهاتر و معاوضه تخصصی ملک و متریال';
      case 'installments': return 'فروش اقساطی ملک و مصالح ساختمانی';
      case 'customer_requests': return 'درخواست‌های مشتریان و تطبیق هوشمند';
      case 'building_3d': return 'استودیو سه‌بعدی WebGL و برآورد هوشمند سازه';
      case 'partnership': return 'مشارکت در ساخت و سرمایه‌گذاری ملکی';
      case 'materials': return 'بازار مستقیم مصالح و متریال ساختمانی';
      case 'craftsmen': return 'بانک اطلاعات پیمانکاران، مهندسان و ماشین‌آلات';
      case 'price_data': return 'دیتاسنتر رسمی قیمت مسکن و مصالح بورس';
      case 'property_detail': return 'جزییات شناسنامه فنی و ملکی';
      case 'role_dashboard': return 'داشبورد اختصاصی نقش کاربری';
      case 'admin_panel': return 'پنل مدیریت و اعتبارسنجی اسناد';
      case 'notifications': return 'مرکز اعلانات و پیام‌های سیستمی';
      case 'profile': return 'پروفایل و تنظیمات کاربری';
      case 'audio_analysis': return 'استودیو تحلیل صوتی هوش مصنوعی';
      default: return 'پیوندساخت';
    }
  };

  // Render Page Content based on Active Tab
  const renderPageContent = () => {
    switch (activeTab) {
      case 'home':
        return effectiveIsDesktop ? (
          <PayvandWebDesktop
            currentUser={currentUser}
            activeRole={activeRole}
            properties={properties}
            priceIndices={mockPriceIndices}
            tickerItems={tickerItems}
            selectedCity={selectedCity}
            onOpenCityModal={() => setIsCityModalOpen(true)}
            onNavigateTab={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectProperty={handleSelectProperty}
            onEnterDealRoom={handleEnterDealRoom}
            onOpenRegisterModal={() => {
              setSubmitModalType('property');
              setIsSubmitModalOpen(true);
            }}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            hideHeader={true}
          />
        ) : (
          <PayvandHome
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenFilterSheet={() => setIsFilterSheetOpen(true)}
            onOpenCityModal={() => setIsCityModalOpen(true)}
            onOpenNotifications={() => setActiveTab('notifications')}
            unreadNotificationsCount={unreadNotificationsCount}
            selectedCity={selectedCity}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        );

      case 'market':
        return (
          <MarketplacePage
            properties={properties}
            onSelectProperty={handleSelectProperty}
            onEnterDealRoom={handleEnterDealRoom}
            searchQuery={searchQuery}
            onOpenFilterSheet={() => setIsFilterSheetOpen(true)}
          />
        );

      case 'deal_room':
        return <DealRoomPage dealRooms={dealRooms} />;

      case 'rate_cutter':
        return (
          <RateCutterPage
            properties={properties}
            onSelectProperty={handleSelectProperty}
            onEnterDealRoom={handleEnterDealRoom}
          />
        );

      case 'barter':
        return (
          <BarterPage
            onOpenBarterOfferModal={() => {
              setSubmitModalType('barter');
              setIsSubmitModalOpen(true);
            }}
            onEnterDealRoom={handleEnterDealRoom}
          />
        );

      case 'installments':
        return <InstallmentPage onEnterDealRoom={handleEnterDealRoom} />;

      case 'customer_requests':
        return <CustomerRequestsPage onEnterDealRoom={handleEnterDealRoom} />;

      case 'building_3d':
        return (
          <Building3DStudioPage
            onEnterDealRoom={handleEnterDealRoom}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        );

      case 'partnership':
        return (
          <PartnershipPage
            onOpenPartnershipModal={() => {
              setSubmitModalType('partnership');
              setIsSubmitModalOpen(true);
            }}
          />
        );

      case 'materials':
        return (
          <MaterialsMarketPage
            onOpenMaterialQuoteModal={() => {
              setSubmitModalType('material_quote');
              setIsSubmitModalOpen(true);
            }}
          />
        );

      case 'craftsmen':
        return <CraftsmenPage />;

      case 'price_data':
        return <PriceDataCenterPage />;

      case 'property_detail':
        return selectedProperty ? (
          <PropertyDetailPage
            property={selectedProperty}
            onBack={() => setActiveTab('market')}
            onEnterDealRoom={handleEnterDealRoom}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        ) : (
          <div className="text-center py-20 text-slate-500 font-bold">
            ملکی انتخاب نشده است.
            <button 
              onClick={() => setActiveTab('market')}
              className="block mx-auto mt-4 px-6 py-2 rounded-xl bg-amber-500 text-white font-bold text-xs"
            >
              مشاهده بازار املاک
            </button>
          </div>
        );

      case 'role_dashboard':
        return (
          <RoleDashboardPage
            currentUser={currentUser}
            activeRole={activeRole}
            properties={properties}
            onOpenRegisterProperty={() => {
              setSubmitModalType('property');
              setIsSubmitModalOpen(true);
            }}
            onOpenMaterialQuote={() => {
              setSubmitModalType('material_quote');
              setIsSubmitModalOpen(true);
            }}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        );

      case 'admin_panel':
        return (
          <AdminPanelPage
            properties={properties}
            onVerifyProperty={handleVerifyProperty}
            onRejectProperty={handleRejectProperty}
          />
        );

      case 'notifications':
        return (
          <NotificationsPage
            notifications={notifications}
            onMarkAllAsRead={handleMarkAllNotificationsRead}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        );

      case 'profile':
        return (
          <ProfilePage
            currentUser={currentUser}
            activeRole={activeRole}
            onRoleChange={handleRoleChange}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onLogout={handleLogout}
          />
        );

      case 'audio_analysis':
        return <AudioAnalysisPage />;

      default:
        return (
          <div className="text-center py-20 text-slate-500 font-bold">
            صفحه مورد نظر یافت نشد.
            <button 
              onClick={() => setActiveTab('home')}
              className="block mx-auto mt-4 px-6 py-2 rounded-xl bg-amber-500 text-white font-bold text-xs"
            >
              بازگشت به صفحه اصلی
            </button>
          </div>
        );
    }
  };

  // Render Mobile View Wrapper
  const renderMobileContent = () => (
    <div className="w-full flex-1 flex flex-col relative bg-[#fcfbf9] text-[#1c1d22]">
      {/* If not on home tab, render mobile Header */}
      {activeTab !== 'home' && (
        <Header
          activeRole={activeRole}
          onRoleChange={handleRoleChange}
          currentUser={currentUser}
          onOpenNotifications={() => setActiveTab('notifications')}
          unreadCount={unreadNotificationsCount}
          onNavigateTab={(tab) => {
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenFilterSheet={() => setIsFilterSheetOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenLiveFeed={() => setIsLiveFeedModalOpen(true)}
          isLiveActive={isLiveActive}
          onOpenMoreMenu={() => setIsMoreMenuSheetOpen(true)}
        />
      )}

      {/* Main Tab Views */}
      <div className={`flex-1 w-full ${activeTab === 'home' ? 'pb-18' : 'pb-24'}`}>
        {activeTab === 'home' ? (
          <PayvandHome
            onNavigateTab={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenFilterSheet={() => setIsFilterSheetOpen(true)}
            onOpenCityModal={() => setIsCityModalOpen(true)}
            onOpenNotifications={() => setActiveTab('notifications')}
            unreadNotificationsCount={unreadNotificationsCount}
            selectedCity={selectedCity}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        ) : (
          <div className="p-4 max-w-4xl mx-auto">
            {renderPageContent()}
          </div>
        )}
      </div>

      {/* Floating Action Button (FAB) on non-home pages */}
      {activeTab !== 'home' && (
        <FAB
          onOpenRegisterProperty={() => {
            setSubmitModalType('property');
            setIsSubmitModalOpen(true);
          }}
          onOpenMaterialQuote={() => {
            setSubmitModalType('material_quote');
            setIsSubmitModalOpen(true);
          }}
          onOpenBarterOffer={() => {
            setSubmitModalType('barter');
            setIsSubmitModalOpen(true);
          }}
          onOpenPartnership={() => {
            setSubmitModalType('partnership');
            setIsSubmitModalOpen(true);
          }}
        />
      )}

      {/* Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={(tab) => {
          setIsMoreMenuSheetOpen(false);
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSubmitModal={() => {
          setSubmitModalType('property');
          setIsSubmitModalOpen(true);
        }}
        unreadNotificationsCount={unreadNotificationsCount}
        onOpenMoreMenu={() => setIsMoreMenuSheetOpen(prev => !prev)}
        isMoreMenuOpen={isMoreMenuSheetOpen}
      />
    </div>
  );

  // If not authenticated, render the AuthScreen first
  if (!isAuthenticated) {
    return <AuthScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-[#faf8f4] text-[#1c1d22] font-sans selection:bg-amber-400 selection:text-slate-950 flex flex-col relative overflow-x-hidden" dir="rtl">
      
      {/* Desktop Web Layout Mode */}
      {effectiveIsDesktop ? (
        <div className="w-full flex-1 flex flex-col">
          {/* Universal Sticky Desktop Header */}
          <DesktopHeader
            currentUser={currentUser}
            activeRole={activeRole}
            onRoleChange={handleRoleChange}
            activeTab={activeTab}
            onNavigateTab={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            unreadCount={unreadNotificationsCount}
            onOpenNotifications={() => setActiveTab('notifications')}
            selectedCity={selectedCity}
            onOpenCityModal={() => setIsCityModalOpen(true)}
            onOpenRegisterModal={() => {
              setSubmitModalType('property');
              setIsSubmitModalOpen(true);
            }}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            tickerItems={tickerItems}
            isDevicePreview={forcedViewMode === 'mobile'}
            onToggleDevicePreview={() => setForcedViewMode(forcedViewMode === 'mobile' ? 'desktop' : 'mobile')}
          />

          {/* Desktop Subpage View Container */}
          {activeTab === 'home' ? (
            renderPageContent()
          ) : (
            <div className="w-full max-w-7xl mx-auto px-6 py-6 flex-1 flex flex-col">
              {/* Desktop Breadcrumb Bar */}
              <div className="mb-6 bg-white border border-[#eae2d5] rounded-2xl px-6 py-3.5 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-3 text-xs font-bold">
                  <button
                    onClick={() => setActiveTab('home')}
                    className="flex items-center gap-1.5 text-slate-500 hover:text-amber-800 transition-colors cursor-pointer"
                  >
                    <HomeIcon className="w-4 h-4 text-amber-700" />
                    <span>صفحه اصلی</span>
                  </button>
                  <span className="text-slate-300 font-normal">/</span>
                  <span className="text-slate-900 font-black text-sm">
                    {getPageTitle(activeTab)}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveTab('home')}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-amber-50 text-slate-700 hover:text-amber-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>بازگشت به خانه</span>
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Subpage Main Content */}
              <div className="flex-1 w-full bg-white/70 border border-[#eae2d5] rounded-3xl p-6 shadow-sm">
                {renderPageContent()}
              </div>
            </div>
          )}

          {/* Global Desktop Footer */}
          <footer className="bg-white border-t border-[#ede6d8] py-8 px-6 text-slate-600 text-xs mt-auto">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <span className="text-base font-black text-slate-900">پیوندساخت</span>
                <span className="text-slate-400">|</span>
                <span className="text-[11px] text-amber-900 font-black">سوپر اپلیکیشن و اکوسیستم زنجیره ارزش ساختمان و مسکن</span>
              </div>
              <div className="flex items-center gap-4 text-slate-500 text-[11px]">
                <button 
                  onClick={() => setForcedViewMode('mobile')}
                  className="hover:text-amber-800 underline cursor-pointer"
                >
                  مشاهده در قالب موبایل اندروید
                </button>
                <span>|</span>
                <span>© کلیه حقوق مادی و معنوی محفوظ است.</span>
              </div>
            </div>
          </footer>
        </div>
      ) : (
        /* Mobile View Mode */
        <div className="flex-1 w-full max-w-lg mx-auto min-h-screen bg-[#faf8f4] shadow-xs flex flex-col relative">
          {forcedViewMode === 'mobile' && (
            <div className="bg-amber-500 text-slate-950 px-4 py-1.5 text-xs font-bold flex items-center justify-between">
              <span>نمای شبیه‌ساز موبایل (Android)</span>
              <button 
                onClick={() => setForcedViewMode('desktop')}
                className="underline text-[11px] font-black cursor-pointer"
              >
                بازگشت به وب دسکتاپ
              </button>
            </div>
          )}
          {renderMobileContent()}
        </div>
      )}

      {/* Global Modals & Overlays */}
      <CitySelectModal
        isOpen={isCityModalOpen}
        onClose={() => setIsCityModalOpen(false)}
        selectedCity={selectedCity}
        onSelectCity={(city) => setSelectedCity(city)}
      />

      <MoreMenuSheet
        isOpen={isMoreMenuSheetOpen}
        onClose={() => setIsMoreMenuSheetOpen(false)}
        onNavigateTab={(tab) => {
          setIsMoreMenuSheetOpen(false);
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenLiveFeed={() => {
          setIsMoreMenuSheetOpen(false);
          setIsLiveFeedModalOpen(true);
        }}
        activeRole={activeRole}
        activeTab={activeTab}
        unreadNotificationsCount={unreadNotificationsCount}
      />

      <BottomSheetModal
        isOpen={isFilterSheetOpen}
        onClose={() => setIsFilterSheetOpen(false)}
        title="فیلترهای پیشرفته جستجوی املاک و مصالح"
        subtitle="محدودسازی نتایج بر اساس شهر، نوع معامله و اعتبارسنجی"
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-bold mb-1.5">انتخاب شهر یا استان:</label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full bg-[#faf9f6] border border-[#ded7cb] rounded-xl p-3 text-slate-900 font-bold focus:outline-none focus:border-amber-500"
            >
              <option value="همه شهرهای ایران">همه شهرهای ایران</option>
              <option value="تهران">تهران</option>
              <option value="اصفهان">اصفهان</option>
              <option value="مازندران و گیلان">مازندران و گیلان</option>
              <option value="شیراز">شیراز</option>
              <option value="مشهد">مشهد</option>
              <option value="کیش">کیش</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1.5">وضعیت اعتبارسنجی اسناد:</label>
            <div className="space-y-2.5">
              <label className="flex items-center gap-2.5 text-slate-700 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded accent-amber-500 w-4 h-4" />
                <span>فقط فایل‌های سالم و دارای استعلام ثبتی معتبر</span>
              </label>
              <label className="flex items-center gap-2.5 text-slate-700 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded accent-amber-500 w-4 h-4" />
                <span>دارای گزارش ارزیابی و قیمت کارشناسی روز</span>
              </label>
            </div>
          </div>

          <button
            onClick={() => setIsFilterSheetOpen(false)}
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-3.5 rounded-2xl text-xs cursor-pointer shadow-md transition-all"
          >
            اعمال فیلترها
          </button>
        </div>
      </BottomSheetModal>

      <SubmitModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        type={submitModalType}
        onSubmitProperty={handleAddProperty}
      />

      <LiveActivityModal
        isOpen={isLiveFeedModalOpen}
        onClose={() => setIsLiveFeedModalOpen(false)}
        events={liveEvents}
        tickerItems={tickerItems}
        isLiveActive={isLiveActive}
        onToggleLive={() => setIsLiveActive(!isLiveActive)}
        isSoundEnabled={isSoundEnabled}
        onToggleSound={() => setIsSoundEnabled(!isSoundEnabled)}
        onEmitCustomEvent={handleEmitCustomLiveEvent}
        onNavigateTab={(tab) => {
          setIsLiveFeedModalOpen(false);
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

    </div>
  );
}
