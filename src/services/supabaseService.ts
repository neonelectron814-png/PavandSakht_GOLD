import { supabase } from '../lib/supabase';
import { Property, LiveActivityEvent, User, MaterialProduct, Craftsman } from '../types';

export const supabaseService = {
  // =========================================================================
  // 1. SUPABASE STORAGE (آپلود تصاویر و اسناد به باکت‌های Supabase)
  // =========================================================================

  /**
   * آپلود تصویر پروفایل کاربر به باکت avatars در Supabase
   */
  async uploadAvatar(file: File, userId: string): Promise<string> {
    const fileExt = file.name.split('.').pop() || 'jpg';
    const filePath = `user-${userId}-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) {
      console.warn('Supabase storage avatar upload note:', uploadError.message);
      // Fallback: create object URL if upload fails offline
      return URL.createObjectURL(file);
    }

    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
    return data.publicUrl;
  },

  /**
   * آپلود تصویر ملک به باکت property-images در Supabase
   */
  async uploadPropertyImage(file: File, propertyId?: string): Promise<string> {
    const fileExt = file.name.split('.').pop() || 'jpg';
    const filePath = `prop-${propertyId || Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('property-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) {
      console.warn('Supabase storage property image upload note:', uploadError.message);
      return URL.createObjectURL(file);
    }

    const { data } = supabase.storage.from('property-images').getPublicUrl(filePath);
    return data.publicUrl;
  },

  /**
   * آپلود تصویر و ویدیوی تبلیغات ساعتی به باکت ad-media در Supabase
   */
  async uploadAdMedia(file: File): Promise<string> {
    const fileExt = file.name.split('.').pop() || 'mp4';
    const filePath = `ad-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('ad-media')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) {
      console.warn('Supabase storage ad media upload note:', uploadError.message);
      return URL.createObjectURL(file);
    }

    const { data } = supabase.storage.from('ad-media').getPublicUrl(filePath);
    return data.publicUrl;
  },

  /**
   * آپلود اسناد محرمانه اتاق معامله به باکت deal-documents
   */
  async uploadDealDocument(file: File, dealRoomId: string): Promise<string> {
    const fileExt = file.name.split('.').pop() || 'pdf';
    const filePath = `deal-${dealRoomId}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('deal-documents')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) {
      console.warn('Supabase storage document upload note:', uploadError.message);
      return URL.createObjectURL(file);
    }

    const { data } = supabase.storage.from('deal-documents').getPublicUrl(filePath);
    return data.publicUrl;
  },

  // =========================================================================
  // 2. USERS & PROFILES (پروفایل کاربران)
  // =========================================================================
  async updateProfileAvatar(userId: string, avatarUrl: string) {
    const { data, error } = await supabase
      .from('users_profiles')
      .upsert({
        id: userId,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      })
      .select();

    if (error) {
      console.warn('Supabase profile avatar update note:', error.message);
    }
    return data;
  },

  // =========================================================================
  // 3. PROPERTIES (املاک و فایل‌ها)
  // =========================================================================
  async getProperties() {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetch properties fallback:', error.message);
      return null;
    }
    return data;
  },

  async createProperty(propData: Partial<Property>) {
    const { data, error } = await supabase
      .from('properties')
      .insert([
        {
          title: propData.title || 'ملک جدید',
          deal_type: propData.dealType || 'sale',
          property_type: propData.propertyType || 'apartment',
          city: propData.city || 'تهران',
          district: propData.district || '',
          price: propData.price || 0,
          price_per_meter: propData.pricePerMeter || 0,
          area: propData.area || 0,
          rooms: propData.rooms || 0,
          document_type: propData.documentType || 'سند تک‌برگ شش‌دانگ',
          verified_status: propData.verifiedStatus || 'verified',
          images: propData.images || [],
          features: propData.features || [],
          description: propData.description || '',
          owner_name: propData.ownerName || 'کاربر پیوندساخت',
          owner_phone: propData.ownerPhone || '09121234567',
        },
      ])
      .select();

    if (error) {
      console.error('Error inserting property to Supabase:', error);
      throw error;
    }
    return data;
  },

  // =========================================================================
  // 4. MATERIALS & INDUSTRIAL
  // =========================================================================
  async getMaterials() {
    const { data, error } = await supabase
      .from('materials')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetch materials fallback:', error.message);
      return null;
    }
    return data;
  },

  // =========================================================================
  // 5. LIVE EVENTS & TICKER
  // =========================================================================
  async getLiveEvents() {
    const { data, error } = await supabase
      .from('live_events')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(30);

    if (error) {
      console.warn('Supabase fetch live events fallback:', error.message);
      return null;
    }
    return data;
  },

  async createLiveEvent(event: Partial<LiveActivityEvent>) {
    const { data, error } = await supabase
      .from('live_events')
      .insert([
        {
          type: event.type || 'mine',
          title: event.title || 'رویداد جدید',
          description: event.description || '',
          badge: event.badge || 'ثبت جدید',
          badge_color: event.badgeColor || 'amber',
          actor: event.actor || 'کاربر پیوندساخت',
          amount: event.amount || null,
          unit: event.unit || 'تومان',
          city: 'تهران',
        },
      ])
      .select();

    if (error) {
      console.error('Error inserting live event to Supabase:', error);
      return null;
    }
    return data;
  },

  // =========================================================================
  // 6. CUSTOMER REQUESTS & AI MATCHING
  // =========================================================================
  async createCustomerRequest(req: {
    title: string;
    description: string;
    city: string;
    budgetMax?: number;
    requestType?: string;
  }) {
    const { data, error } = await supabase
      .from('customer_requests')
      .insert([
        {
          title: req.title,
          description: req.description,
          city: req.city,
          budget_max: req.budgetMax || 0,
          request_type: req.requestType || 'buy_property',
        },
      ])
      .select();

    if (error) {
      console.error('Error inserting customer request:', error);
      return null;
    }
    return data;
  },

  // =========================================================================
  // 7. HOURLY AD CAMPAIGNS
  // =========================================================================
  async createAdCampaign(adData: {
    businessName: string;
    contactNumber: string;
    targetLink: string;
    headline: string;
    subHeadline?: string;
    mediaUrl: string;
    mediaFormat?: 'image' | 'video' | 'gif';
    durationHours?: number;
    totalPaidToman?: number;
  }) {
    const startsAt = new Date();
    const expiresAt = new Date(startsAt.getTime() + (adData.durationHours || 1) * 3600 * 1000);

    const { data, error } = await supabase
      .from('ad_campaigns')
      .insert([
        {
          business_name: adData.businessName,
          contact_number: adData.contactNumber,
          target_link: adData.targetLink,
          headline: adData.headline,
          sub_headline: adData.subHeadline || '',
          media_url: adData.mediaUrl,
          media_format: adData.mediaFormat || 'image',
          duration_hours: adData.durationHours || 1,
          total_paid_toman: adData.totalPaidToman || 125000,
          status: 'active',
          starts_at: startsAt.toISOString(),
          expires_at: expiresAt.toISOString(),
        },
      ])
      .select();

    if (error) {
      console.error('Error inserting ad campaign to Supabase:', error);
      return null;
    }
    return data;
  },
};
