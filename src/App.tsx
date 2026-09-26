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

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<string>('home');
  const [activeRole, setActiveRole] = useState<UserRole>('buyer');
  
  // Automatic screen size & device detection: Desktop Web (>= 1024px) vs Mobile Android (< 1024px)
  const [isDesktop, setIsDesktop] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024;
    }
    return false;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
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

  // Global Smooth Horizontal Mouse Wheel Support
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const scrollable = target.closest('.overflow-x-auto') as HTMLElement | null;
      if (scrollable && scrollable.scrollWidth > scrollable.clientWidth) {
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
          scrollable.scrollLeft += e.deltaY;
          e.preventDefault();
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, []);

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

  const currentUser: User = mockUsers.find((u) => u.role === activeRole) || mockUsers[0];
  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  const handleRoleChange = (newRole: UserRole) => {
    setActiveRole(newRole);
  };

  const handleSelectProperty = (property: Property) => {
    setSelectedProperty(property);
    setActiveTab('property_detail');
  };

  const handleEnterDealRoom = (propertyCode: string) => {
    const existing = dealRooms.find((dr) => dr.propertyCode === propertyCode);
    if (existing) {
      setActiveTab('deal_room');
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

  // Render Mobile App Content
  const renderMobileContent = () => (
    <div className="w-full flex-1 flex flex-col relative bg-[#fcfbf9] text-[#1c1d22]">
      {/* If not on home tab, render top Header */}
      {activeTab !== 'home' && (
        <Header
          activeRole={activeRole}
          onRoleChange={handleRoleChange}
          currentUser={currentUser}
          onOpenNotifications={() => setActiveTab('notifications')}
          unreadCount={unreadNotificationsCount}
          onNavigateTab={(tab) => setActiveTab(tab)}
          onOpenFilterSheet={() => setIsFilterSheetOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenLiveFeed={() => setIsLiveFeedModalOpen(true)}
          isLiveActive={isLiveActive}
          onOpenMoreMenu={() => setIsMoreMenuSheetOpen(true)}
        />
      )}

      {/* Main Tab Views */}
      <div className="flex-1 w-full">
        {activeTab === 'home' && (
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
        )}

        {activeTab === 'market' && (
          <div className="p-4 max-w-4xl mx-auto pb-28">
            <MarketplacePage
              properties={properties}
              onSelectProperty={handleSelectProperty}
              onEnterDealRoom={handleEnterDealRoom}
              searchQuery={searchQuery}
              onOpenFilterSheet={() => setIsFilterSheetOpen(true)}
            />
          </div>
        )}

        {activeTab === 'deal_room' && (
          <div className="p-4 max-w-4xl mx-auto pb-28">
            <DealRoomPage dealRooms={dealRooms} />
          </div>
        )}

        {activeTab === 'rate_cutter' && (
          <div className="p-4 max-w-4xl mx-auto pb-28">
            <RateCutterPage
              properties={properties}
              onSelectProperty={handleSelectProperty}
              onEnterDealRoom={handleEnterDealRoom}
            />
          </div>
        )}

        {activeTab === 'barter' && (
          <div className="p-4 max-w-4xl mx-auto pb-28">
            <BarterPage
              onOpenBarterOfferModal={() => {
                setSubmitModalType('barter');
                setIsSubmitModalOpen(true);
              }}
            />
          </div>
        )}

        {activeTab === 'partnership' && (
          <div className="p-4 max-w-4xl mx-auto pb-28">
            <PartnershipPage
              onOpenPartnershipModal={() => {
                setSubmitModalType('partnership');
                setIsSubmitModalOpen(true);
              }}
            />
          </div>
        )}

        {activeTab === 'materials' && (
          <div className="p-4 max-w-4xl mx-auto pb-28">
            <MaterialsMarketPage
              onOpenMaterialQuoteModal={() => {
                setSubmitModalType('material_quote');
                setIsSubmitModalOpen(true);
              }}
            />
          </div>
        )}

        {activeTab === 'craftsmen' && (
          <div className="p-4 max-w-4xl mx-auto pb-28">
            <CraftsmenPage />
          </div>
        )}

        {activeTab === 'price_data' && (
          <div className="p-4 max-w-4xl mx-auto pb-28">
            <PriceDataCenterPage />
          </div>
        )}

        {activeTab === 'property_detail' && selectedProperty && (
          <div className="p-4 max-w-4xl mx-auto pb-28">
            <PropertyDetailPage
              property={selectedProperty}
              onBack={() => setActiveTab('market')}
              onEnterDealRoom={handleEnterDealRoom}
            />
          </div>
        )}

        {activeTab === 'role_dashboard' && (
          <div className="p-4 max-w-4xl mx-auto pb-28">
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
          </div>
        )}

        {activeTab === 'admin_panel' && (
          <div className="p-4 max-w-4xl mx-auto pb-28">
            <AdminPanelPage
              properties={properties}
              onVerifyProperty={handleVerifyProperty}
              onRejectProperty={handleRejectProperty}
            />
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="p-4 max-w-4xl mx-auto pb-28">
            <NotificationsPage
              notifications={notifications}
              onMarkAllAsRead={handleMarkAllNotificationsRead}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="p-4 max-w-4xl mx-auto pb-28">
            <ProfilePage
              currentUser={currentUser}
              activeRole={activeRole}
              onRoleChange={handleRoleChange}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          </div>
        )}

        {activeTab === 'audio_analysis' && (
          <div className="p-4 max-w-4xl mx-auto pb-28">
            <AudioAnalysisPage />
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

  return (
    <div className="min-h-screen bg-[#faf8f4] text-[#1c1d22] font-sans selection:bg-amber-400 selection:text-slate-950 flex flex-col relative overflow-x-hidden">
      
      {/* Automatic Layout Migration: Desktop Web vs Mobile Android */}
      {isDesktop ? (
        /* =========================================================================
           DEDICATED WEB DESKTOP DESIGN (مهاجرت کاملاً خودکار در حالت وب و صفحات بزرگ)
           ========================================================================= */
        <PayvandWebDesktop
          currentUser={currentUser}
          activeRole={activeRole}
          properties={properties}
          priceIndices={mockPriceIndices}
          tickerItems={tickerItems}
          selectedCity={selectedCity}
          onOpenCityModal={() => setIsCityModalOpen(true)}
          onNavigateTab={(tab) => setActiveTab(tab)}
          onSelectProperty={handleSelectProperty}
          onEnterDealRoom={handleEnterDealRoom}
          onOpenRegisterModal={() => {
            setSubmitModalType('property');
            setIsSubmitModalOpen(true);
          }}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      ) : (
        /* =========================================================================
           MOBILE ANDROID MODE: Native Mobile Screen (حالت اندروید با ریسپانسیو کامل)
           با منوی ناوبری اندرویدی با حاشیه گرد (Border Radius)
           ========================================================================= */
        <div className="flex-1 w-full max-w-lg mx-auto min-h-screen bg-[#faf8f4] shadow-xs flex flex-col relative">
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
        }}
      />

    </div>
  );
}
