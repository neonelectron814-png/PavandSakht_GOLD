export type UserRole = 
  | 'buyer'              // خریدار / سرمایه‌گذار
  | 'seller'             // مالکان و فروشندگان
  | 'tenant'             // مستأجران و متقاضیان رهن و اجاره
  | 'agent'              // مشاوران املاک امین
  | 'builder'            // سازندگان و مجریان
  | 'mine_owner'         // معدن‌داران و تأمین‌کنندگان سنگ و کانی خام
  | 'factory'            // کارخانجات و تولیدکنندگان
  | 'materials_seller'   // فروشندگان محلی مصالح
  | 'craftsman'          // استادکاران و پیمانکاران
  | 'admin';             // مدیر سیستم

export type VerificationStatus = 'verified' | 'pending' | 'rejected' | 'need_inquiry';

export type PropertyType = 'apartment' | 'villa' | 'land' | 'commercial' | 'office' | 'industrial';

export type DealType = 'sale' | 'rent' | 'barter' | 'partnership';

export interface User {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
  avatar: string;
  verified: boolean;
  creditScore: number; // 0 - 100
  badgeTitle: string;
  location: string;
  bio?: string;
  companyName?: string;
  mineName?: string; // برای معدن‌داران
}

export interface Property {
  id: string;
  code: string;
  title: string;
  dealType: DealType;
  propertyType: PropertyType;
  city: string;
  district: string;
  price: number; // in Tomans (for sale) or deposit/rahn (for rent)
  pricePerMeter: number;
  area: number; // sq meters
  rooms: number;
  year: number; // Jalali year e.g. 1401
  floor?: number;
  totalFloors?: number;
  verifiedStatus: VerificationStatus;
  verifiedBy?: string;
  verificationNotes?: string;
  images: string[];
  features: string[];
  description: string;
  ownerId: string;
  ownerName: string;
  ownerPhone: string;
  isRateCutter?: boolean; // نرخ‌شکن
  discountPercent?: number;
  discountReason?: string;
  // ویژگی‌های اختصاصی رهن و اجاره
  rentalDetails?: {
    depositPrice: number; // ودیعه / رهن به تومان
    monthlyRent: number; // اجاره ماهانه به تومان
    isConvertible: boolean; // قابلیت تبدیل رهن و اجاره
    conversionRateFormula?: string; // فرمول تبدیل (مثلاً هر ۱۰۰ میلیون معادل ۳ میلیون تومان)
    evictionStatus: 'ready' | 'occupied_until_next_month' | 'immediate'; // وضعیت تخلیه
    suitableFor: 'family_or_single' | 'family_only' | 'office'; // مناسب برای
  };
  barterDetails?: {
    acceptsProperty: boolean;
    acceptsMaterials: boolean;
    desiredMaterialCategories?: string[];
    maxBarterRatioPercent?: number;
  };
  partnershipDetails?: {
    landArea: number;
    proposedRatio: string; // e.g. '60-40'
    permitsObtained: boolean;
    densityPermission: string; // e.g. 'R122 - 5 طبقه'
  };
  createdAt: string; // Jalali date string
  rating: number;
  viewsCount: number;
  documentType: string; // e.g. 'سند تک‌برگ شش‌دانگ'
}

export type MaterialCategory = 
  | 'سنگ کوپ و بلوک معدنی'
  | 'سنگ و کانی معدنی'
  | 'پوکه و شن و ماسه معدنی'
  | 'پوکه و سیلیس'
  | 'سیلیس و مواد خام نسوز'
  | 'سیمان' 
  | 'گچ' 
  | 'کاشی و سرامیک' 
  | 'میلگرد و آهن‌آلات' 
  | 'سنگ ساختمان' 
  | 'در و پنجره' 
  | 'آلومینیوم و شیشه' 
  | 'تجهیزات برق' 
  | 'لوله و اتصالات';

export interface MaterialProduct {
  id: string;
  code: string;
  title: string;
  category: MaterialCategory;
  supplierType: 'factory' | 'local' | 'mine'; // کارخانه/عمده یا محلی/خرد یا معدن‌دار
  price: number; // in Tomans
  unit: string; // e.g. 'تن', 'کیسه', 'مترمربع', 'شاخه', 'کوپ'
  minOrder: number;
  location: string;
  distanceKm: number;
  supplierId: string;
  supplierName: string;
  verifiedStatus: VerificationStatus;
  images: string[];
  specSheet?: string;
  description: string;
  rating: number;
  deliveryTimeDays: number;
  mineDetails?: {
    quarryName?: string; // نام معدن و سینه کار
    mineName?: string; // نام معدن
    monthlyExtractionTons?: number; // تناژ استخراج ماهانه
    monthlyCapacityTons?: number; // ظرفیت استخراج ماهیانه
    assayPurityPercent?: number; // درصد خلوص یا عیار
    grade?: string; // عیار / گرید سنگ
    licenseNumber?: string; // شماره پروانه بهره‌برداری
    isDirectFromQuarry?: boolean; // تحویل مستقیم از سینه کار معدن
  };
}

export interface LiveActivityEvent {
  id: string;
  type: 'deal' | 'mine' | 'price' | 'verification' | 'rent' | 'barter';
  title: string;
  description: string;
  timestamp: string;
  actor: string;
  badge: string;
  badgeColor: 'emerald' | 'amber' | 'blue' | 'rose' | 'purple';
  amount?: number;
  unit?: string;
  changePercent?: number;
}

export interface LiveTickerItem {
  id: string;
  symbol: string;
  name: string;
  price: number;
  unit: string;
  changePercent: number; // positive or negative
  category: 'metal' | 'cement' | 'stone' | 'real_estate' | 'sand';
}

export interface Craftsman {
  id: string;
  name: string;
  specialty: 'بنایی و سفت‌کاری' | 'آرماتوربندی و قالب‌بندی' | 'برق‌کاری' | 'لوله‌کشی و تاسیسات' | 'کاشی‌کاری و سنگ‌کاری' | 'نقاشی و دکوراسیون';
  city: string;
  dailyRate: number; // in Tomans
  rating: number;
  projectsDone: number;
  availability: 'ready' | 'busy_next_week' | 'on_project';
  phone: string;
  avatar: string;
  portfolioImages: string[];
  bio: string;
  verifiedBadge: boolean;
}

export interface DealRoomStep {
  stepNumber: number;
  title: string;
  description: string;
  completed: boolean;
  active: boolean;
  date?: string;
}

export interface DealRoomDocument {
  id: string;
  title: string;
  type: string;
  verified: boolean;
  verifiedAt?: string;
  fileUrl?: string;
}

export interface DealRoom {
  id: string;
  title: string;
  propertyCode: string;
  propertyTitle: string;
  propertyPrice: number;
  propertyImage: string;
  buyerName: string;
  buyerPhone: string;
  sellerName: string;
  sellerPhone: string;
  assignedAgentName: string;
  assignedAgentAgency: string;
  currentStep: number; // 1 to 5
  status: 'active' | 'completed' | 'cancelled';
  steps: DealRoomStep[];
  documents: DealRoomDocument[];
  expertAppraisalPrice: number;
  commissionEstimate: number;
  createdAt: string;
  lastUpdate: string;
  confidentialNotes: string[];
}

export interface BarterOffer {
  id: string;
  type: 'property_to_property' | 'property_to_materials';
  title: string;
  sourceTitle: string;
  sourceValue: number;
  sourceCity: string;
  targetRequirement: string;
  targetEstimatedValue: number;
  status: 'active' | 'matched' | 'negotiating' | 'completed';
  createdAt: string;
  ownerName: string;
  matchScorePercent: number;
}

export interface PriceIndex {
  id: string;
  city: string;
  district: string;
  propertyType: string;
  avgPricePerMeter: number;
  change30dPercent: number; // e.g. +2.4 or -1.1
  transactionsCount30d: number;
  historicalChart: { month: string; price: number }[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'deal' | 'verification' | 'price' | 'system';
  linkTab?: string;
}

export interface Partnership {
  id: string;
  title: string;
  landArea: number;
  location: string;
  proposedRatio: string;
  permitsObtained: boolean;
  builderRequirements: string;
  ownerId: string;
  status: 'active' | 'in_negotiation' | 'closed';
}

export interface UserReview {
  id: string;
  targetName: string;
  authorName: string;
  rating: number;
  text: string;
  date: string;
  verifiedTransaction: boolean;
}
