-- =========================================================================
-- PAYVAND SAKHT (پیوندساخت) - MASTER DATABASE & STORAGE SCHEMA FOR SUPABASE
-- Project URL: https://pvuavjzdsmvzybuscdih.supabase.co
-- =========================================================================

-- Enable Necessary PostgreSQL Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =========================================================================
-- SECTION 1: SUPABASE STORAGE BUCKETS (باکت‌های ذخیره‌سازی تصاویر و رسانه‌ها)
-- =========================================================================

-- 1. avatars (تصاویر پروفایل کاربران و احراز هویت)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. property-images (تصاویر املاک، ویلا، مشارکت و تهاتر)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('property-images', 'property-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET public = true;

-- 3. material-images (تصاویر مصالح کارخانجات، معادن و کانی‌ها)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('material-images', 'material-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET public = true;

-- 4. craftsmen-portfolios (نمونه کارهای پیمانکاران، استادکاران و مهندسین)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('craftsmen-portfolios', 'craftsmen-portfolios', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET public = true;

-- 5. scrap-images (تصاویر ضایعات و بازیافت ساختمانی)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('scrap-images', 'scrap-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET public = true;

-- 6. ad-media (ویدیوهای تبلیغاتی ساعتی و بنرهای اسپانسر)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('ad-media', 'ad-media', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm'])
ON CONFLICT (id) DO UPDATE SET public = true;

-- 7. deal-documents (اسناد و استعلامات ثبتی محرمانه اتاق معامله)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('deal-documents', 'deal-documents', true, 20971520, ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf'])
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage RLS Policies
DROP POLICY IF EXISTS "Public can view storage objects" ON storage.objects;
CREATE POLICY "Public can view storage objects" ON storage.objects FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can upload storage objects" ON storage.objects;
CREATE POLICY "Public can upload storage objects" ON storage.objects FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can update storage objects" ON storage.objects;
CREATE POLICY "Public can update storage objects" ON storage.objects FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Public can delete storage objects" ON storage.objects;
CREATE POLICY "Public can delete storage objects" ON storage.objects FOR DELETE USING (true);


-- =========================================================================
-- SECTION 2: APPLICATION TABLES (جداول پایگاه داده سامانه پیوندساخت)
-- =========================================================================

-- 1. USERS PROFILES TABLE (پروفایل کاربران و نقش‌های صنفی)
CREATE TABLE IF NOT EXISTS public.users_profiles (
    id VARCHAR(100) PRIMARY KEY,
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    full_name VARCHAR(150),
    national_id VARCHAR(10),
    role VARCHAR(50) DEFAULT 'buyer' CHECK (role IN ('buyer', 'seller', 'tenant', 'agent', 'builder', 'mine_owner', 'factory', 'materials_seller', 'craftsman', 'admin')),
    city VARCHAR(100) DEFAULT 'تهران',
    verified_identity BOOLEAN DEFAULT FALSE,
    credit_score INTEGER DEFAULT 95,
    badge_title VARCHAR(100) DEFAULT 'عضو تأییدشده',
    avatar_url TEXT,
    bio TEXT,
    company_name VARCHAR(200),
    mine_name VARCHAR(200),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. PROPERTIES TABLE (املاک نقدی، رهن و اجاره، مشارکت، تهاتر و نرخ‌شکن)
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
    price BIGINT NOT NULL DEFAULT 0,
    price_per_meter BIGINT DEFAULT 0,
    area NUMERIC(10, 2) NOT NULL DEFAULT 0,
    rooms INTEGER DEFAULT 0,
    floor INTEGER,
    total_floors INTEGER,
    year_built INTEGER DEFAULT 1403,
    document_type VARCHAR(100) DEFAULT 'سند تک‌برگ شش‌دانگ',
    verified_status VARCHAR(50) DEFAULT 'verified' CHECK (verified_status IN ('verified', 'pending', 'legal_audit', 'rejected', 'need_inquiry')),
    verified_by VARCHAR(150),
    verification_notes TEXT,
    rating NUMERIC(2, 1) DEFAULT 5.0,
    views_count INTEGER DEFAULT 0,
    images TEXT[] DEFAULT ARRAY[]::TEXT[],
    features TEXT[] DEFAULT ARRAY[]::TEXT[],
    description TEXT,
    owner_id VARCHAR(100),
    owner_name VARCHAR(150),
    owner_phone VARCHAR(20),
    
    -- Distressed Deals & Bargains (نرخ‌شکن)
    is_rate_cutter BOOLEAN DEFAULT FALSE,
    discount_percent NUMERIC(5, 2) DEFAULT 0,
    discount_reason TEXT,
    
    -- Rental Details (رهن و اجاره)
    deposit_price BIGINT DEFAULT 0,
    monthly_rent BIGINT DEFAULT 0,
    is_convertible BOOLEAN DEFAULT TRUE,
    eviction_status VARCHAR(50) DEFAULT 'immediate',
    suitable_for VARCHAR(50) DEFAULT 'family_or_single',
    
    -- Barter Details (تهاتر)
    barter_accepts_property BOOLEAN DEFAULT TRUE,
    barter_accepts_materials BOOLEAN DEFAULT FALSE,
    barter_target_requirement TEXT,
    barter_max_ratio_percent INTEGER DEFAULT 100,
    
    -- Partnership Details (مشارکت در ساخت)
    partnership_land_area NUMERIC(10, 2),
    partnership_proposed_ratio VARCHAR(50) DEFAULT '60-40',
    partnership_permits_obtained BOOLEAN DEFAULT TRUE,
    partnership_density_permission VARCHAR(100),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. MATERIALS & MINING TABLE (مصالح ساختمانی و معادن)
CREATE TABLE IF NOT EXISTS public.materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50),
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    supplier_type VARCHAR(50) DEFAULT 'factory' CHECK (supplier_type IN ('factory', 'local', 'mine')),
    supplier_name VARCHAR(200) NOT NULL,
    supplier_id VARCHAR(100),
    city VARCHAR(100) NOT NULL,
    price_per_unit BIGINT NOT NULL DEFAULT 0,
    unit VARCHAR(50) NOT NULL,
    min_order_quantity NUMERIC(10, 2) NOT NULL DEFAULT 1,
    delivery_time_days INTEGER DEFAULT 2,
    verified_status VARCHAR(50) DEFAULT 'verified',
    images TEXT[] DEFAULT ARRAY[]::TEXT[],
    spec_sheet_url TEXT,
    description TEXT,
    rating NUMERIC(2, 1) DEFAULT 4.9,
    
    -- Mine Quarry Specifics (مشخصات سینه کار و معدن)
    quarry_name VARCHAR(200),
    monthly_extraction_tons NUMERIC(10, 2),
    assay_purity_percent NUMERIC(5, 2),
    grade VARCHAR(50),
    license_number VARCHAR(100),
    is_direct_from_quarry BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. CRAFTSMEN & CONTRACTORS TABLE (پیمانکاران و استادکاران)
CREATE TABLE IF NOT EXISTS public.craftsmen (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    specialty VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    daily_rate BIGINT NOT NULL DEFAULT 0,
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

-- 5. SCRAP & RECYCLING TABLE (ضایعات و بازیافت ساختمانی)
CREATE TABLE IF NOT EXISTS public.scrap_materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    scrap_type VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    district VARCHAR(150),
    estimated_weight_tons NUMERIC(10, 2) NOT NULL DEFAULT 0,
    suggested_price_per_kg BIGINT NOT NULL DEFAULT 0,
    is_auction BOOLEAN DEFAULT TRUE,
    seller_name VARCHAR(150),
    seller_phone VARCHAR(20),
    images TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. DEAL ROOMS TABLE (اتاق معامله امن و مدیریت قرارداد)
CREATE TABLE IF NOT EXISTS public.deal_rooms (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    property_code VARCHAR(50) NOT NULL,
    property_title VARCHAR(255) NOT NULL,
    property_price BIGINT NOT NULL,
    property_image TEXT,
    buyer_name VARCHAR(150) NOT NULL,
    buyer_phone VARCHAR(20) NOT NULL,
    seller_name VARCHAR(150) NOT NULL,
    seller_phone VARCHAR(20) NOT NULL,
    assigned_agent_name VARCHAR(150),
    assigned_agent_agency VARCHAR(200),
    current_step INTEGER DEFAULT 1,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
    expert_appraisal_price BIGINT DEFAULT 0,
    commission_estimate BIGINT DEFAULT 0,
    confidential_notes TEXT[] DEFAULT ARRAY[]::TEXT[],
    steps JSONB DEFAULT '[]'::JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. DEAL ROOM DOCUMENTS TABLE (اسناد و مدارک استعلام شده اتاق معامله)
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

-- 8. BARTER OFFERS TABLE (آفرهای تهاتر هوشمند)
CREATE TABLE IF NOT EXISTS public.barter_offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    source_title VARCHAR(255) NOT NULL,
    source_value BIGINT NOT NULL,
    source_city VARCHAR(100) NOT NULL,
    target_requirement TEXT NOT NULL,
    target_estimated_value BIGINT NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    owner_name VARCHAR(150),
    match_score_percent INTEGER DEFAULT 95,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. PARTNERSHIPS TABLE (پروژه‌های مشارکت در ساخت)
CREATE TABLE IF NOT EXISTS public.partnerships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    land_area NUMERIC(10, 2) NOT NULL,
    location VARCHAR(200) NOT NULL,
    proposed_ratio VARCHAR(50) DEFAULT '60-40',
    permits_obtained BOOLEAN DEFAULT TRUE,
    builder_requirements TEXT,
    owner_id VARCHAR(100),
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. CUSTOMER REQUESTS & AI MATCHING TABLE (درخواست‌های متقاضیان)
CREATE TABLE IF NOT EXISTS public.customer_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_type VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    city VARCHAR(100) NOT NULL,
    budget_min BIGINT DEFAULT 0,
    budget_max BIGINT DEFAULT 0,
    urgency VARCHAR(50) DEFAULT 'immediate',
    matched_count INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'active',
    customer_phone VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. PRICE INDICES TABLE (شاخص‌های قیمت منطقه‌ای مسکن و مصالح)
CREATE TABLE IF NOT EXISTS public.price_indices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    city VARCHAR(100) NOT NULL,
    district VARCHAR(150) NOT NULL,
    property_type VARCHAR(100) NOT NULL,
    avg_price_per_meter BIGINT NOT NULL,
    change_30d_percent NUMERIC(5, 2) DEFAULT 0.0,
    transactions_count_30d INTEGER DEFAULT 0,
    historical_chart JSONB DEFAULT '[]'::JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 12. LIVE ACTIVITY EVENTS TABLE (پالس‌های رویداد زنده بازار)
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

-- 13. AD CAMPAIGNS TABLE (تبلیغات ساعتی بنری و ویدیویی اسپانسرها)
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
    duration_hours INTEGER DEFAULT 1,
    total_paid_toman BIGINT DEFAULT 125000,
    payment_reference_id VARCHAR(100),
    status VARCHAR(50) DEFAULT 'active',
    starts_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 14. NOTIFICATIONS TABLE (اعلان‌های کاربری و سیستمی)
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

-- 15. USER REVIEWS TABLE (نظرات، رضایت‌مندی و امتیاز معاملات)
CREATE TABLE IF NOT EXISTS public.user_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    target_name VARCHAR(150) NOT NULL,
    author_name VARCHAR(150) NOT NULL,
    rating NUMERIC(2, 1) DEFAULT 5.0,
    text TEXT NOT NULL,
    verified_transaction BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);


-- =========================================================================
-- SECTION 3: PERFORMANCE INDEXES (ایندکس‌های پرسرعت)
-- =========================================================================
CREATE INDEX IF NOT EXISTS idx_properties_city ON public.properties (city);
CREATE INDEX IF NOT EXISTS idx_properties_deal_type ON public.properties (deal_type);
CREATE INDEX IF NOT EXISTS idx_properties_price ON public.properties (price);
CREATE INDEX IF NOT EXISTS idx_properties_created ON public.properties (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_materials_category ON public.materials (category);
CREATE INDEX IF NOT EXISTS idx_materials_supplier_type ON public.materials (supplier_type);
CREATE INDEX IF NOT EXISTS idx_live_events_created ON public.live_events (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ad_campaigns_active ON public.ad_campaigns (status, expires_at);
CREATE INDEX IF NOT EXISTS idx_craftsmen_city ON public.craftsmen (city, specialty);
CREATE INDEX IF NOT EXISTS idx_deal_rooms_user ON public.deal_rooms (buyer_phone, seller_phone);


-- =========================================================================
-- SECTION 4: ROW LEVEL SECURITY (سیاست‌های امنیتی RLS)
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

-- Grant Full CRUD Access to Anon and Authenticated Users for Demo & Real API Access
DO $$ 
DECLARE 
    t text;
BEGIN
    FOR t IN 
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
          AND table_type = 'BASE TABLE'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS "Public access policy on %I" ON public.%I', t, t);
        EXECUTE format('CREATE POLICY "Public access policy on %I" ON public.%I FOR ALL USING (true) WITH CHECK (true)', t, t);
    END LOOP;
END $$;


-- =========================================================================
-- SECTION 5: INITIAL SEED DATA (اطلاعات اولیه اعتبارسنجی شده)
-- =========================================================================

-- 1. Seed Initial Users
INSERT INTO public.users_profiles (id, phone_number, full_name, role, city, verified_identity, credit_score, badge_title, avatar_url, bio)
VALUES
('u1', '09121112233', 'مهندس علی فرهمند', 'builder', 'تهران', true, 98, 'سازنده رتبه‌دار ممتاز', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200', 'عضو نظام مهندسی با بیش از ۱۵ سال سابقه احداث پروژه‌های لوکس منطقه ۱ و ۲ تهران'),
('u2', '09123334455', 'حاج کاظم معدن‌کار', 'mine_owner', 'اصفهان', true, 99, 'مالک پروانه معدن سنگ', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200', 'تأمین‌کننده مستقیم سنگ گرانیت، تراورتن و سیلیس از معادن نطنز و محلات'),
('u3', '09129876543', 'رضا شایسته', 'buyer', 'تهران', true, 94, 'سرمایه‌گذار تأییدشده', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200', 'خریدار نقد و سرمایه‌گذار در املاک تجاری و مسکونی تهران')
ON CONFLICT (id) DO NOTHING;

-- 2. Seed Initial Properties
INSERT INTO public.properties (code, title, deal_type, property_type, city, province, district, price, price_per_meter, area, rooms, document_type, verified_status, images, features, description, owner_name, owner_phone)
VALUES
('PYS-1001', 'پنت‌هاوس مجلل فرمانیه (تسویه نقدی فوری)', 'sale', 'apartment', 'تهران', 'تهران', 'فرمانیه', 48500000000, 142647000, 340, 4, 'سند تک‌برگ شش‌دانگ', 'verified', ARRAY['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800'], ARRAY['استعلام ثبتی پاک', 'دید ابدی ۳۶۰ درجه', 'سند تک‌برگ عرصه و عیان'], 'فروش فوری با تسویه نقدی رسمی در دفترخانه. سند شش‌دانگ پاک و فاقد هرگونه بدهی بانکی.', 'مهندس فرهمند', '09121112233'),
('PYS-1002', 'زمین ۴۰۰ متری با پروانه ۶ طبقه ساخت', 'partnership', 'land', 'مشهد', 'خراسان رضوی', 'سجاد', 32000000000, 80000000, 400, 0, 'سند شش‌دانگ مسکونی', 'verified', ARRAY['https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800'], ARRAY['پروانه ساخت آماده', 'سود تضمینی ۴۵ درصد', 'بر ۱۶ متری شمالی'], 'زمین آماده مشارکت با سازندگان رتبه‌دار دارای رزومه معتبر با نسبت ۶۰ به ۴۰.', 'حاج محمدی', '09151234567'),
('PYS-1003', 'تهاتر آپارتمان ۱۸۰ متری سعادت‌آباد با میلگرد و فولاد', 'barter', 'apartment', 'تهران', 'تهران', 'سعادت‌آباد', 22000000000, 122222000, 180, 3, 'سند تک‌برگ', 'verified', ARRAY['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800'], ARRAY['آماده تهاتر رسمی', 'استعلام سند پاک', 'فول امکانات'], 'تهاتر کامل یا ترکیبی با میلگرد استاندارد اصفهان یا ورق گالوانیزه.', 'آقای شایسته', '09129876543')
ON CONFLICT (code) DO NOTHING;

-- 3. Seed Initial Materials
INSERT INTO public.materials (code, title, category, supplier_type, supplier_name, city, unit, price_per_unit, min_order_quantity, quarry_name, assay_purity_percent, monthly_extraction_tons)
VALUES
('MAT-01', 'سنگ گرانیت مشکی نطنز (کوپ درجه یک صادراتی)', 'سنگ کوپ و بلوک معدنی', 'mine', 'معدن سنگ گرانیت نطنز', 'نطنز', 'تن', 3800000, 25, 'سینه کار شماره ۲ معدن نطنز', 99.2, 1200),
('MAT-02', 'میلگرد آجدار ۱۶ استاندارد A3 اصفهان', 'میلگرد و آهن‌آلات', 'factory', 'کارخانه ذوب آهن اصفهان', 'اصفهان', 'کیلوگرم', 28500, 5000, NULL, NULL, NULL),
('MAT-03', 'سیمان تیپ ۲ کیسه‌ای ۵۰ کیلویی تهران', 'سیمان', 'factory', 'سیمان تهران', 'تهران', 'کیسه', 82000, 100, NULL, NULL, NULL);

-- 4. Seed Initial Live Events
INSERT INTO public.live_events (type, title, description, badge, badge_color, actor, amount, unit, city)
VALUES
('mine', 'بارگیری ۲۰۰ تن سنگ گرانیت مشکی', 'سفارش مستقیم از سینه کار معدن نطنز به مقصد پروژه الهیه', 'معدن مستقیم', 'amber', 'شرکت مهندسی آریا', 200, 'تن سنگ', 'نطنز'),
('deal', 'تکمیل استعلام ثنا و عقد قرارداد رسمی', 'معامله آپارتمان ۲۱۰ متری زعفرانیه در اتاق معامله امن', 'معامله موفق', 'emerald', 'دفترخانه ۲۱۸ تهران', 38000000000, 'تومان', 'تهران'),
('verification', 'تأیید اصالت سند تک‌برگ کاداستری', 'استعلام برخط سند ملک ۵۰۰ متری مهرشهر با موفقیت انجام شد', 'استعلام سبز', 'teal', 'سازمان ثبت اسناد', 1, 'استعلام', 'کرج');

-- =========================================================================
-- COMPLETE SUPABASE INITIALIZATION FINISHED SUCCESSFULLY
-- =========================================================================
