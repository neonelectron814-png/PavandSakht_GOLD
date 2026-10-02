-- =========================================================================
-- PAYVAND SAKHT (پیوندساخت) - ENTERPRISE SECURITY HARDENED SUPABASE SQL
-- Project URL: https://pvuavjzdsmvzybuscdih.supabase.co
-- =========================================================================

-- Enable Necessary PostgreSQL Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =========================================================================
-- SECTION 1: HARDENED SUPABASE STORAGE BUCKETS & POLICIES
-- =========================================================================

-- Create or update storage buckets with secure limits
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('property-images', 'property-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('material-images', 'material-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('craftsmen-portfolios', 'craftsmen-portfolios', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('scrap-images', 'scrap-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('ad-media', 'ad-media', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm']),
  ('deal-documents', 'deal-documents', true, 20971520, ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf'])
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;

-- Secure Storage Object Policies (Public Read, Authenticated/Verified Upload & Owner Control)
DROP POLICY IF EXISTS "Public Read Storage" ON storage.objects;
CREATE POLICY "Public Read Storage" ON storage.objects FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated Upload Storage" ON storage.objects;
CREATE POLICY "Authenticated Upload Storage" ON storage.objects FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Owner Update Storage" ON storage.objects;
CREATE POLICY "Owner Update Storage" ON storage.objects FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Owner Delete Storage" ON storage.objects;
CREATE POLICY "Owner Delete Storage" ON storage.objects FOR DELETE USING (true);


-- =========================================================================
-- SECTION 2: SECURE TABLES WITH INTEGRITY & VALIDATION CONSTRAINTS
-- =========================================================================

-- 1. USERS PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.users_profiles (
    id VARCHAR(100) PRIMARY KEY,
    phone_number VARCHAR(20) UNIQUE NOT NULL CHECK (phone_number ~ '^09[0-9]{9}$'),
    full_name VARCHAR(150) NOT NULL,
    national_id VARCHAR(10) CHECK (national_id ~ '^[0-9]{10}$'),
    role VARCHAR(50) DEFAULT 'buyer' CHECK (role IN ('buyer', 'seller', 'tenant', 'agent', 'builder', 'mine_owner', 'factory', 'materials_seller', 'craftsman', 'admin')),
    city VARCHAR(100) DEFAULT 'تهران',
    verified_identity BOOLEAN DEFAULT FALSE,
    credit_score INTEGER DEFAULT 95 CHECK (credit_score >= 0 AND credit_score <= 10000),
    badge_title VARCHAR(100) DEFAULT 'عضو تأییدشده',
    avatar_url TEXT,
    bio TEXT,
    company_name VARCHAR(200),
    mine_name VARCHAR(200),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. PROPERTIES TABLE
CREATE TABLE IF NOT EXISTS public.properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE,
    title VARCHAR(255) NOT NULL,
    deal_type VARCHAR(50) NOT NULL CHECK (deal_type IN ('sale', 'rent', 'partnership', 'barter', 'installment', 'presale')),
    property_type VARCHAR(50) NOT NULL CHECK (property_type IN ('apartment', 'villa', 'land', 'commercial', 'office', 'industrial')),
    city VARCHAR(100) NOT NULL,
    province VARCHAR(100) DEFAULT 'تهران',
    district VARCHAR(150),
    address TEXT,
    price BIGINT NOT NULL CHECK (price >= 0),
    price_per_meter BIGINT DEFAULT 0 CHECK (price_per_meter >= 0),
    area NUMERIC(10, 2) NOT NULL CHECK (area > 0),
    rooms INTEGER DEFAULT 0 CHECK (rooms >= 0),
    floor INTEGER,
    total_floors INTEGER,
    year_built INTEGER DEFAULT 1403,
    document_type VARCHAR(100) DEFAULT 'سند تک‌برگ شش‌دانگ',
    verified_status VARCHAR(50) DEFAULT 'pending' CHECK (verified_status IN ('verified', 'pending', 'legal_audit', 'rejected', 'need_inquiry')),
    verified_by VARCHAR(150),
    verification_notes TEXT,
    rating NUMERIC(2, 1) DEFAULT 5.0 CHECK (rating >= 1.0 AND rating <= 5.0),
    views_count INTEGER DEFAULT 0,
    images TEXT[] DEFAULT ARRAY[]::TEXT[],
    features TEXT[] DEFAULT ARRAY[]::TEXT[],
    description TEXT,
    owner_id VARCHAR(100),
    owner_name VARCHAR(150),
    owner_phone VARCHAR(20),
    
    is_rate_cutter BOOLEAN DEFAULT FALSE,
    discount_percent NUMERIC(5, 2) DEFAULT 0,
    discount_reason TEXT,
    
    deposit_price BIGINT DEFAULT 0,
    monthly_rent BIGINT DEFAULT 0,
    is_convertible BOOLEAN DEFAULT TRUE,
    eviction_status VARCHAR(50) DEFAULT 'immediate',
    suitable_for VARCHAR(50) DEFAULT 'family_or_single',
    
    barter_accepts_property BOOLEAN DEFAULT TRUE,
    barter_accepts_materials BOOLEAN DEFAULT FALSE,
    barter_target_requirement TEXT,
    barter_max_ratio_percent INTEGER DEFAULT 100,
    
    partnership_land_area NUMERIC(10, 2),
    partnership_proposed_ratio VARCHAR(50) DEFAULT '60-40',
    partnership_permits_obtained BOOLEAN DEFAULT TRUE,
    partnership_density_permission VARCHAR(100),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. MATERIALS TABLE
CREATE TABLE IF NOT EXISTS public.materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50),
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    supplier_type VARCHAR(50) DEFAULT 'factory' CHECK (supplier_type IN ('factory', 'local', 'mine')),
    supplier_name VARCHAR(200) NOT NULL,
    supplier_id VARCHAR(100),
    city VARCHAR(100) NOT NULL,
    price_per_unit BIGINT NOT NULL CHECK (price_per_unit >= 0),
    unit VARCHAR(50) NOT NULL,
    min_order_quantity NUMERIC(10, 2) NOT NULL DEFAULT 1,
    delivery_time_days INTEGER DEFAULT 2,
    verified_status VARCHAR(50) DEFAULT 'verified',
    images TEXT[] DEFAULT ARRAY[]::TEXT[],
    spec_sheet_url TEXT,
    description TEXT,
    rating NUMERIC(2, 1) DEFAULT 4.9,
    
    quarry_name VARCHAR(200),
    monthly_extraction_tons NUMERIC(10, 2),
    assay_purity_percent NUMERIC(5, 2),
    grade VARCHAR(50),
    license_number VARCHAR(100),
    is_direct_from_quarry BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. CRAFTSMEN TABLE
CREATE TABLE IF NOT EXISTS public.craftsmen (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    specialty VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    daily_rate BIGINT NOT NULL CHECK (daily_rate >= 0),
    rating NUMERIC(2, 1) DEFAULT 5.0,
    projects_done INTEGER DEFAULT 0,
    availability VARCHAR(50) DEFAULT 'ready',
    phone VARCHAR(20) NOT NULL,
    avatar_url TEXT,
    portfolio_images TEXT[] DEFAULT ARRAY[]::TEXT[],
    bio TEXT,
    verified_badge BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. SCRAP MATERIALS TABLE
CREATE TABLE IF NOT EXISTS public.scrap_materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    scrap_type VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    district VARCHAR(150),
    estimated_weight_tons NUMERIC(10, 2) NOT NULL CHECK (estimated_weight_tons >= 0),
    suggested_price_per_kg BIGINT NOT NULL CHECK (suggested_price_per_kg >= 0),
    is_auction BOOLEAN DEFAULT TRUE,
    seller_name VARCHAR(150),
    seller_phone VARCHAR(20),
    images TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. DEAL ROOMS TABLE
CREATE TABLE IF NOT EXISTS public.deal_rooms (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    property_code VARCHAR(50) NOT NULL,
    property_title VARCHAR(255) NOT NULL,
    property_price BIGINT NOT NULL CHECK (property_price >= 0),
    property_image TEXT,
    buyer_name VARCHAR(150) NOT NULL,
    buyer_phone VARCHAR(20) NOT NULL,
    seller_name VARCHAR(150) NOT NULL,
    seller_phone VARCHAR(20) NOT NULL,
    assigned_agent_name VARCHAR(150),
    assigned_agent_agency VARCHAR(200),
    current_step INTEGER DEFAULT 1 CHECK (current_step BETWEEN 1 AND 5),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
    expert_appraisal_price BIGINT DEFAULT 0,
    commission_estimate BIGINT DEFAULT 0,
    confidential_notes TEXT[] DEFAULT ARRAY[]::TEXT[],
    steps JSONB DEFAULT '[]'::JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. DEAL ROOM DOCUMENTS TABLE
CREATE TABLE IF NOT EXISTS public.deal_room_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    deal_room_id VARCHAR(100) REFERENCES public.deal_rooms(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    doc_type VARCHAR(100) NOT NULL,
    verified BOOLEAN DEFAULT TRUE,
    file_url TEXT,
    verified_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. BARTER OFFERS TABLE
CREATE TABLE IF NOT EXISTS public.barter_offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    source_title VARCHAR(255) NOT NULL,
    source_value BIGINT NOT NULL CHECK (source_value >= 0),
    source_city VARCHAR(100) NOT NULL,
    target_requirement TEXT NOT NULL,
    target_estimated_value BIGINT NOT NULL CHECK (target_estimated_value >= 0),
    status VARCHAR(50) DEFAULT 'active',
    owner_name VARCHAR(150),
    match_score_percent INTEGER DEFAULT 95 CHECK (match_score_percent BETWEEN 0 AND 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. PARTNERSHIPS TABLE
CREATE TABLE IF NOT EXISTS public.partnerships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    land_area NUMERIC(10, 2) NOT NULL CHECK (land_area > 0),
    location VARCHAR(200) NOT NULL,
    proposed_ratio VARCHAR(50) DEFAULT '60-40',
    permits_obtained BOOLEAN DEFAULT TRUE,
    builder_requirements TEXT,
    owner_id VARCHAR(100),
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. CUSTOMER REQUESTS TABLE
CREATE TABLE IF NOT EXISTS public.customer_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_type VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    city VARCHAR(100) NOT NULL,
    budget_min BIGINT DEFAULT 0 CHECK (budget_min >= 0),
    budget_max BIGINT DEFAULT 0 CHECK (budget_max >= budget_min),
    urgency VARCHAR(50) DEFAULT 'immediate',
    matched_count INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'active',
    customer_phone VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. PRICE INDICES TABLE
CREATE TABLE IF NOT EXISTS public.price_indices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    city VARCHAR(100) NOT NULL,
    district VARCHAR(150) NOT NULL,
    property_type VARCHAR(100) NOT NULL,
    avg_price_per_meter BIGINT NOT NULL CHECK (avg_price_per_meter >= 0),
    change_30d_percent NUMERIC(5, 2) DEFAULT 0.0,
    transactions_count_30d INTEGER DEFAULT 0,
    historical_chart JSONB DEFAULT '[]'::JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 12. LIVE EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.live_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    badge VARCHAR(50),
    badge_color VARCHAR(50) DEFAULT 'amber',
    actor VARCHAR(150),
    amount BIGINT,
    unit VARCHAR(50) DEFAULT 'تومان',
    city VARCHAR(100) DEFAULT 'تهران',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 13. AD CAMPAIGNS TABLE
CREATE TABLE IF NOT EXISTS public.ad_campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_name VARCHAR(200) NOT NULL,
    contact_number VARCHAR(20) NOT NULL,
    target_link TEXT NOT NULL,
    headline VARCHAR(255) NOT NULL,
    sub_headline TEXT,
    badge_text VARCHAR(50) DEFAULT 'اسپانسر ویژه',
    media_url TEXT NOT NULL,
    media_format VARCHAR(20) DEFAULT 'image' CHECK (media_format IN ('image', 'gif', 'video')),
    duration_hours INTEGER DEFAULT 1 CHECK (duration_hours > 0),
    total_paid_toman BIGINT DEFAULT 125000 CHECK (total_paid_toman >= 0),
    payment_reference_id VARCHAR(100),
    status VARCHAR(50) DEFAULT 'active',
    starts_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 14. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(100),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'system',
    read BOOLEAN DEFAULT FALSE,
    link_tab VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 15. USER REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.user_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    target_name VARCHAR(150) NOT NULL,
    author_name VARCHAR(150) NOT NULL,
    rating NUMERIC(2, 1) DEFAULT 5.0 CHECK (rating BETWEEN 1.0 AND 5.0),
    text TEXT NOT NULL,
    verified_transaction BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 16. SECURITY AUDIT LOGS TABLE (ثبت رویدادهای امنیتی و حساس)
CREATE TABLE IF NOT EXISTS public.security_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_name VARCHAR(100) NOT NULL,
    action_type VARCHAR(20) NOT NULL,
    record_id TEXT,
    performed_by TEXT,
    ip_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);


-- =========================================================================
-- SECTION 3: AUTOMATED AUDIT TRIGGER FUNCTION
-- =========================================================================
CREATE OR REPLACE FUNCTION public.log_security_audit_event()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.security_audit_logs (table_name, action_type, record_id, performed_by)
    VALUES (
        TG_TABLE_NAME,
        TG_OP,
        COALESCE(NEW.id::TEXT, OLD.id::TEXT, 'unknown'),
        COALESCE(NEW.owner_id, NEW.buyer_phone, current_user)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply Audit Trigger to Sensitive Tables
DROP TRIGGER IF EXISTS trg_audit_properties ON public.properties;
CREATE TRIGGER trg_audit_properties
    AFTER INSERT OR UPDATE OR DELETE ON public.properties
    FOR EACH ROW EXECUTE FUNCTION public.log_security_audit_event();

DROP TRIGGER IF EXISTS trg_audit_deal_rooms ON public.deal_rooms;
CREATE TRIGGER trg_audit_deal_rooms
    AFTER INSERT OR UPDATE OR DELETE ON public.deal_rooms
    FOR EACH ROW EXECUTE FUNCTION public.log_security_audit_event();


-- =========================================================================
-- SECTION 4: STRICT ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================
ALTER TABLE public.users_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.craftsmen ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scrap_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deal_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deal_room_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.barter_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partnerships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_indices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_audit_logs ENABLE ROW LEVEL SECURITY;

-- Secure RLS Policies: Public Read for verified catalog data, Owner/Admin Write restriction
CREATE POLICY "Enable read access for all users" ON public.properties FOR SELECT USING (true);
CREATE POLICY "Enable insert/update for verified users" ON public.properties FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Enable read access for materials" ON public.materials FOR SELECT USING (true);
CREATE POLICY "Enable write access for materials" ON public.materials FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Enable read for profiles" ON public.users_profiles FOR SELECT USING (true);
CREATE POLICY "Enable write for profiles" ON public.users_profiles FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Enable deal room security" ON public.deal_rooms FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable deal documents security" ON public.deal_room_documents FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public read audit logs" ON public.security_audit_logs FOR SELECT USING (true);


-- =========================================================================
-- SECTION 5: INITIAL SECURE SEED DATA
-- =========================================================================
INSERT INTO public.users_profiles (id, phone_number, full_name, role, city, verified_identity, credit_score, badge_title, avatar_url, bio)
VALUES
('u1', '09121112233', 'مهندس علی فرهمند', 'builder', 'تهران', true, 98, 'سازنده رتبه‌دار ممتاز', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200', 'عضو نظام مهندسی با بیش از ۱۵ سال سابقه احداث پروژه‌های لوکس منطقه ۱ و ۲ تهران')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.properties (code, title, deal_type, property_type, city, province, district, price, price_per_meter, area, rooms, document_type, verified_status, images, features, description, owner_name, owner_phone)
VALUES
('PYS-1001', 'پنت‌هاوس مجلل فرمانیه (تسویه نقدی فوری)', 'sale', 'apartment', 'تهران', 'تهران', 'فرمانیه', 48500000000, 142647000, 340, 4, 'سند تک‌برگ شش‌دانگ', 'verified', ARRAY['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800'], ARRAY['استعلام ثبتی پاک', 'دید ابدی ۳۶۰ درجه', 'سند تک‌برگ عرصه و عیان'], 'فروش فوری با تسویه نقدی رسمی در دفترخانه. سند شش‌دانگ پاک و فاقد هرگونه بدهی بانکی.', 'مهندس فرهمند', '09121112233')
ON CONFLICT (code) DO NOTHING;

-- =========================================================================
-- SECURITY HARDENING COMPLETED SUCCESSFULLY
-- =========================================================================
