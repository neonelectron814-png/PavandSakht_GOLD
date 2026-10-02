import {
  User,
  Property,
  MaterialProduct,
  Craftsman,
  DealRoom,
  BarterOffer,
  Partnership,
  PriceIndex,
  NotificationItem,
  UserReview,
} from '../types';

export const defaultGuestUser: User = {
  id: 'guest',
  name: 'کاربر میهمان',
  phone: '۰۹۱۲۰۰۰۰۰۰۰',
  role: 'buyer',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
  verified: false,
  creditScore: 100,
  badgeTitle: 'کاربر عادی',
  location: 'ایران',
  bio: '',
};

export const mockUsers: User[] = [defaultGuestUser];

export const mockProperties: Property[] = [];

export const mockMaterials: MaterialProduct[] = [];

export const mockCraftsmen: Craftsman[] = [];

export const mockDealRooms: DealRoom[] = [];

export const mockBarterOffers: BarterOffer[] = [];

export const mockPartnerships: Partnership[] = [];

export const mockPriceIndices: PriceIndex[] = [];

export const mockNotifications: NotificationItem[] = [];

export const mockReviews: UserReview[] = [];
