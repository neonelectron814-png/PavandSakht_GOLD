-- =========================================================================
-- PAYVAND SAKHT (پیوندساخت) - ENTERPRISE PRODUCTION-GRADE SECURE SUPABASE SQL
-- FIXED VERSION
-- =========================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =========================================================================
-- SECTION 1: SECURITY AUDIT & HELPER FUNCTIONS (SECURITY DEFINER HARDENING)
-- =========================================================================

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    IF current_user IN ('postgres', 'service_role') THEN
        RETURN TRUE;
    END IF;
    RETURN EXISTS (
        SELECT 1 FROM public.users_profiles
        WHERE id = (SELECT auth.uid()::TEXT)
          AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

CREATE OR REPLACE FUNCTION public.get_auth_user_id()
RETURNS TEXT AS $$
BEGIN
    RETURN (SELECT auth.uid()::TEXT);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

CREATE OR REPLACE FUNCTION public.log_security_audit_event()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.security_audit_logs (table_name, action_type, record_id, performed_by)
    VALUES (
        TG_TABLE_NAME,
        TG_OP,
        COALESCE(NEW.id::TEXT, OLD.id::TEXT, 'unknown'),
        COALESCE(public.get_auth_user_id(), 'system')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- 1. Enforce Profile Security
-- FIX #3: در INSERT، ادمینِ احرازهویت‌شده هم بای‌پس شد (قبلاً role ادمین هم buyer می‌شد)
CREATE OR REPLACE FUNCTION public.enforce_profile_security()
RETURNS TRIGGER AS $$
BEGIN
    IF current_user IN ('postgres', 'service_role') THEN
        NEW.updated_at := timezone('utc'::text, now());
        RETURN NEW;
    END IF;

    IF TG_OP = 'INSERT' THEN
        IF NOT public.is_admin() THEN
            NEW.role := 'buyer';
            NEW.verified_identity := FALSE;
            NEW.credit_score := 95;
            NEW.badge_title := 'عضو تأییدشده';
        END IF;
    ELSIF TG_OP = 'UPDATE' THEN
        IF NOT public.is_admin() THEN
            IF NEW.role IS DISTINCT FROM OLD.role THEN
                RAISE EXCEPTION 'Role modification is strictly restricted to administrators.';
            END IF;
            IF NEW.verified_identity IS DISTINCT FROM OLD.verified_identity THEN
                NEW.verified_identity := OLD.verified_identity;
            END IF;
            IF NEW.credit_score IS DISTINCT FROM OLD.credit_score THEN
                NEW.credit_score := OLD.credit_score;
            END IF;
            IF NEW.badge_title IS DISTINCT FROM OLD.badge_title THEN
                NEW.badge_title := OLD.badge_title;
            END IF;
        END IF;
    END IF;

    NEW.updated_at := timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- 2. Enforce Property Update Security
CREATE OR REPLACE FUNCTION public.enforce_property_update_security()
RETURNS TRIGGER AS $$
BEGIN
    IF current_user IN ('postgres', 'service_role') OR public.is_admin() THEN
        NEW.updated_at := timezone('utc'::text, now());
        RETURN NEW;
    END IF;

    IF NEW.verified_status IS DISTINCT FROM OLD.verified_status THEN
        NEW.verified_status := OLD.verified_status;
    END IF;
    IF NEW.rating IS DISTINCT FROM OLD.rating THEN
        NEW.rating := OLD.rating;
    END IF;
    IF NEW.views_count IS DISTINCT FROM OLD.views_count THEN
        NEW.views_count := OLD.views_count;
    END IF;
    IF NEW.owner_id IS DISTINCT FROM OLD.owner_id THEN
        NEW.owner_id := OLD.owner_id;
    END IF;

    NEW.updated_at := timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- 3. Enforce Property Private Verification Security
CREATE OR REPLACE FUNCTION public.enforce_property_private_security()
RETURNS TRIGGER AS $$
BEGIN
    IF current_user IN ('postgres', 'service_role') OR public.is_admin() THEN
        RETURN NEW;
    END IF;

    IF TG_OP = 'INSERT' THEN
        NEW.verification_notes := NULL;
        NEW.verified_by := NULL;
    ELSIF TG_OP = 'UPDATE' THEN
        IF NEW.verification_notes IS DISTINCT FROM OLD.verification_notes THEN
            NEW.verification_notes := OLD.verification_notes;
        END IF;
        IF NEW.verified_by IS DISTINCT FROM OLD.verified_by THEN
            NEW.verified_by := OLD.verified_by;
        END IF;
        IF NEW.property_id IS DISTINCT FROM OLD.property_id THEN
            NEW.property_id := OLD.property_id;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- 4. Enforce Review Verification Security
CREATE OR REPLACE FUNCTION public.enforce_review_security()
RETURNS TRIGGER AS $$
BEGIN
    IF current_user IN ('postgres', 'service_role') OR public.is_admin() THEN
        RETURN NEW;
    END IF;

    IF TG_OP = 'INSERT' THEN
        NEW.author_id := public.get_auth_user_id();
        NEW.verified_transaction := FALSE;
    ELSIF TG_OP = 'UPDATE' THEN
        IF NEW.verified_transaction IS DISTINCT FROM OLD.verified_transaction THEN
            NEW.verified_transaction := OLD.verified_transaction;
        END IF;
        IF NEW.author_id IS DISTINCT FROM OLD.author_id THEN
            NEW.author_id := OLD.author_id;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- 5. Enforce General System Fields Hardening
CREATE OR REPLACE FUNCTION public.enforce_general_system_fields()
RETURNS TRIGGER AS $$
BEGIN
    IF current_user IN ('postgres', 'service_role') OR public.is_admin() THEN
        RETURN NEW;
    END IF;

    IF TG_TABLE_NAME = 'barter_offers' THEN
        IF NEW.owner_id IS DISTINCT FROM OLD.owner_id OR NEW.match_score_percent IS DISTINCT FROM OLD.match_score_percent OR NEW.status IS DISTINCT FROM OLD.status THEN
            NEW.owner_id := OLD.owner_id;
            NEW.match_score_percent := OLD.match_score_percent;
            NEW.status := OLD.status;
        END IF;
    ELSIF TG_TABLE_NAME = 'customer_requests' THEN
        IF NEW.customer_id IS DISTINCT FROM OLD.customer_id OR NEW.matched_count IS DISTINCT FROM OLD.matched_count OR NEW.status IS DISTINCT FROM OLD.status THEN
            NEW.customer_id := OLD.customer_id;
            NEW.matched_count := OLD.matched_count;
            NEW.status := OLD.status;
        END IF;
    ELSIF TG_TABLE_NAME = 'notifications' THEN
        IF NEW.user_id IS DISTINCT FROM OLD.user_id OR NEW.message IS DISTINCT FROM OLD.message OR NEW.type IS DISTINCT FROM OLD.type THEN
            NEW.user_id := OLD.user_id;
            NEW.message := OLD.message;
            NEW.type := OLD.type;
        END IF;
    ELSIF TG_TABLE_NAME = 'deal_rooms' THEN
        IF NEW.buyer_id IS DISTINCT FROM OLD.buyer_id OR NEW.seller_id IS DISTINCT FROM OLD.seller_id OR NEW.assigned_agent_id IS DISTINCT FROM OLD.assigned_agent_id THEN
            RAISE EXCEPTION 'Deal room membership is immutable for normal users.';
        END IF;
    ELSIF TG_TABLE_NAME = 'deal_room_documents' THEN
        IF NEW.deal_room_id IS DISTINCT FROM OLD.deal_room_id THEN
            RAISE EXCEPTION 'Cannot move document to another deal room.';
        END IF;
    ELSIF TG_TABLE_NAME = 'scrap_materials' THEN
        IF NEW.owner_id IS DISTINCT FROM OLD.owner_id THEN
            NEW.owner_id := OLD.owner_id;
        END IF;
    ELSIF TG_TABLE_NAME = 'partnerships' THEN
        IF NEW.owner_id IS DISTINCT FROM OLD.owner_id THEN
            NEW.owner_id := OLD.owner_id;
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';


-- =========================================================================
-- SECTION 2: STORAGE BUCKETS & STRICT RLS POLICIES FOR STORAGE
-- =========================================================================

-- FIX #6: آپدیت کامل فیلدهای باکت در اجرای مجدد
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('property-images', 'property-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('material-images', 'material-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('craftsmen-portfolios', 'craftsmen-portfolios', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('scrap-images', 'scrap-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('ad-media', 'ad-media', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm']),
  ('deal-documents', 'deal-documents', false, 20971520, ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf'])
ON CONFLICT (id) DO UPDATE SET 
  public = EXCLUDED.public, 
  file_size_limit = EXCLUDED.file_size_limit, 
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Public Read Public Buckets" ON storage.objects;
CREATE POLICY "Public Read Public Buckets" ON storage.objects 
FOR SELECT USING (
    bucket_id IN ('avatars', 'property-images', 'material-images', 'craftsmen-portfolios', 'scrap-images', 'ad-media')
);

DROP POLICY IF EXISTS "Authenticated Users Upload" ON storage.objects;
CREATE POLICY "Authenticated Users Upload" ON storage.objects 
FOR INSERT TO authenticated 
WITH CHECK (
    bucket_id IN ('avatars', 'property-images', 'material-images', 'craftsmen-portfolios', 'scrap-images', 'ad-media')
    AND auth.uid()::text = (storage.foldername(name))[1]
);

-- FIX #4: محدودیت bucket_id اضافه شد (قبلاً به deal-documents هم نشت می‌کرد)
DROP POLICY IF EXISTS "Owner Update Storage" ON storage.objects;
CREATE POLICY "Owner Update Storage" ON storage.objects 
FOR UPDATE TO authenticated 
USING (
    bucket_id IN ('avatars', 'property-images', 'material-images', 'craftsmen-portfolios', 'scrap-images', 'ad-media')
    AND (auth.uid()::text = (storage.foldername(name))[1] OR public.is_admin())
);

DROP POLICY IF EXISTS "Owner Delete Storage" ON storage.objects;
CREATE POLICY "Owner Delete Storage" ON storage.objects 
FOR DELETE TO authenticated 
USING (
    bucket_id IN ('avatars', 'property-images', 'material-images', 'craftsmen-portfolios', 'scrap-images', 'ad-media')
    AND (auth.uid()::text = (storage.foldername(name))[1] OR public.is_admin())
);

-- Deal Documents Private Bucket Policies
DROP POLICY IF EXISTS "Deal Members Read Documents Storage" ON storage.objects;
CREATE POLICY "Deal Members Read Documents Storage" ON storage.objects 
FOR SELECT TO authenticated 
USING (
    bucket_id = 'deal-documents'
    AND (
        public.is_admin()
        OR EXISTS (
            SELECT 1 FROM public.deal_rooms dr
            WHERE dr.id::text = (storage.foldername(name))[1]
              AND (
                  dr.buyer_id = public.get_auth_user_id()
                  OR dr.seller_id = public.get_auth_user_id()
                  OR dr.assigned_agent_id = public.get_auth_user_id()
              )
        )
    )
);

DROP POLICY IF EXISTS "Deal Members Insert Documents Storage" ON storage.objects;
CREATE POLICY "Deal Members Insert Documents Storage" ON storage.objects 
FOR INSERT TO authenticated 
WITH CHECK (
    bucket_id = 'deal-documents'
    AND (
        public.is_admin()
        OR EXISTS (
            SELECT 1 FROM public.deal_rooms dr
            WHERE dr.id::text = (storage.foldername(name))[1]
              AND (
                  dr.buyer_id = public.get_auth_user_id()
                  OR dr.seller_id = public.get_auth_user_id()
                  OR dr.assigned_agent_id = public.get_auth_user_id()
              )
        )
    )
);

DROP POLICY IF EXISTS "Deal Members Delete Documents Storage" ON storage.objects;
CREATE POLICY "Deal Members Delete Documents Storage" ON storage.objects 
FOR DELETE TO authenticated 
USING (
    bucket_id = 'deal-documents'
    AND (
        public.is_admin()
        OR EXISTS (
            SELECT 1 FROM public.deal_rooms dr
            WHERE dr.id::text = (storage.foldername(name))[1]
              AND (
                  dr.buyer_id = public.get_auth_user_id()
                  OR dr.seller_id = public.get_auth_user_id()
              )
        )
    )
);


-- =========================================================================
-- SECTION 3: CORE TABLES SCHEMA, CONSTRAINTS & FOREIGN KEYS
-- =========================================================================

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

-- FIX #2: ویوها security DEFINER شدند (حذف security_invoker) تا anon هم بتواند بخواند؛
-- فیلتر سختگیرانه WHERE به خود ویو منتقل شد
CREATE OR REPLACE VIEW public.users_profiles_public AS
SELECT 
    id,
    full_name,
    city,
    avatar_url,
    bio,
    company_name,
    mine_name,
    created_at
FROM public.users_profiles;

CREATE TABLE IF NOT EXISTS public.properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE,
    title VARCHAR(255) NOT NULL,
    deal_type VARCHAR(50) NOT NULL CHECK (deal_type IN ('sale', 'rent', 'partnership', 'barter', 'installment', 'presale')),
    property_type VARCHAR(50) NOT NULL CHECK (property_type IN ('apartment', 'villa', 'land', 'commercial', 'office', 'industrial')),
    city VARCHAR(100) NOT NULL,
    province VARCHAR(100) DEFAULT 'تهران',
    district VARCHAR(150),
    price BIGINT NOT NULL CHECK (price >= 0),
    price_per_meter BIGINT DEFAULT 0 CHECK (price_per_meter >= 0),
    area NUMERIC(10, 2) NOT NULL CHECK (area > 0),
    rooms INTEGER DEFAULT 0 CHECK (rooms >= 0),
    floor INTEGER,
    total_floors INTEGER,
    year_built INTEGER DEFAULT 1403,
    document_type VARCHAR(100) DEFAULT 'سند تکبرگ ششدانگ',
    verified_status VARCHAR(50) DEFAULT 'pending' CHECK (verified_status IN ('verified', 'pending', 'legal_audit', 'rejected', 'need_inquiry')),
    rating NUMERIC(2, 1) DEFAULT 5.0 CHECK (rating >= 1.0 AND rating <= 5.0),
    views_count INTEGER DEFAULT 0,
    images TEXT[] DEFAULT ARRAY[]::TEXT[],
    features TEXT[] DEFAULT ARRAY[]::TEXT[],
    description TEXT,
    owner_id VARCHAR(100) REFERENCES public.users_profiles(id) ON DELETE SET NULL,
    owner_name VARCHAR(150),
    
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

CREATE TABLE IF NOT EXISTS public.properties_private (
    property_id UUID PRIMARY KEY REFERENCES public.properties(id) ON DELETE CASCADE,
    address TEXT,
    owner_phone VARCHAR(20),
    verification_notes TEXT,
    verified_by VARCHAR(150),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE OR REPLACE VIEW public.properties_public AS
SELECT 
    p.id,
    p.code,
    p.title,
    p.deal_type,
    p.property_type,
    p.city,
    p.province,
    p.district,
    p.price,
    p.price_per_meter,
    p.area,
    p.rooms,
    p.floor,
    p.total_floors,
    p.year_built,
    p.document_type,
    p.verified_status,
    p.rating,
    p.views_count,
    p.images,
    p.features,
    p.description,
    p.owner_id,
    p.owner_name,
    p.is_rate_cutter,
    p.discount_percent,
    p.discount_reason,
    p.deposit_price,
    p.monthly_rent,
    p.is_convertible,
    p.eviction_status,
    p.suitable_for,
    p.barter_accepts_property,
    p.barter_accepts_materials,
    p.barter_target_requirement,
    p.barter_max_ratio_percent,
    p.partnership_land_area,
    p.partnership_proposed_ratio,
    p.partnership_permits_obtained,
    p.partnership_density_permission,
    p.created_at
FROM public.properties p
WHERE p.verified_status = 'verified';

CREATE TABLE IF NOT EXISTS public.materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50),
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    supplier_type VARCHAR(50) DEFAULT 'factory' CHECK (supplier_type IN ('factory', 'local', 'mine')),
    supplier_name VARCHAR(200) NOT NULL,
    supplier_id VARCHAR(100) REFERENCES public.users_profiles(id) ON DELETE SET NULL,
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

-- FIX #2: فقط مواد تأییدشده از ویو عمومی
CREATE OR REPLACE VIEW public.materials_public AS
SELECT 
    id, code, title, category, supplier_type, supplier_name, city, price_per_unit, unit, 
    min_order_quantity, delivery_time_days, verified_status, images, spec_sheet_url, description, 
    rating, quarry_name, monthly_extraction_tons, assay_purity_percent, grade, is_direct_from_quarry, created_at
FROM public.materials
WHERE verified_status = 'verified';

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

CREATE OR REPLACE VIEW public.craftsmen_public AS
SELECT 
    id, name, specialty, city, daily_rate, rating, projects_done, availability, 
    avatar_url, portfolio_images, bio, verified_badge, created_at
FROM public.craftsmen;

CREATE TABLE IF NOT EXISTS public.scrap_materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    scrap_type VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    district VARCHAR(150),
    estimated_weight_tons NUMERIC(10, 2) NOT NULL CHECK (estimated_weight_tons >= 0),
    suggested_price_per_kg BIGINT NOT NULL CHECK (suggested_price_per_kg >= 0),
    is_auction BOOLEAN DEFAULT TRUE,
    owner_id VARCHAR(100) REFERENCES public.users_profiles(id) ON DELETE SET NULL,
    seller_name VARCHAR(150),
    seller_phone VARCHAR(20),
    images TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE OR REPLACE VIEW public.scrap_materials_public AS
SELECT 
    id, title, scrap_type, city, district, estimated_weight_tons, suggested_price_per_kg, is_auction, seller_name, images, created_at
FROM public.scrap_materials;

CREATE TABLE IF NOT EXISTS public.deal_rooms (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    property_code VARCHAR(50) NOT NULL,
    property_title VARCHAR(255) NOT NULL,
    property_price BIGINT NOT NULL CHECK (property_price >= 0),
    property_image TEXT,
    buyer_id VARCHAR(100) REFERENCES public.users_profiles(id) ON DELETE SET NULL,
    buyer_name VARCHAR(150) NOT NULL,
    buyer_phone VARCHAR(20) NOT NULL,
    seller_id VARCHAR(100) REFERENCES public.users_profiles(id) ON DELETE SET NULL,
    seller_name VARCHAR(150) NOT NULL,
    seller_phone VARCHAR(20) NOT NULL,
    assigned_agent_id VARCHAR(100) REFERENCES public.users_profiles(id) ON DELETE SET NULL,
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

CREATE TABLE IF NOT EXISTS public.barter_offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id VARCHAR(100) REFERENCES public.users_profiles(id) ON DELETE SET NULL,
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

CREATE TABLE IF NOT EXISTS public.partnerships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    land_area NUMERIC(10, 2) NOT NULL CHECK (land_area > 0),
    location VARCHAR(200) NOT NULL,
    proposed_ratio VARCHAR(50) DEFAULT '60-40',
    permits_obtained BOOLEAN DEFAULT TRUE,
    builder_requirements TEXT,
    owner_id VARCHAR(100) REFERENCES public.users_profiles(id) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.customer_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id VARCHAR(100) REFERENCES public.users_profiles(id) ON DELETE SET NULL,
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

CREATE OR REPLACE VIEW public.ad_campaigns_public AS
SELECT 
    id, business_name, headline, sub_headline, badge_text, media_url, media_format, starts_at, expires_at
FROM public.ad_campaigns
WHERE status = 'active' AND expires_at > timezone('utc'::text, now());

CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(100) REFERENCES public.users_profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'system',
    read BOOLEAN DEFAULT FALSE,
    link_tab VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.user_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_id VARCHAR(100) REFERENCES public.users_profiles(id) ON DELETE SET NULL,
    target_name VARCHAR(150) NOT NULL,
    author_name VARCHAR(150) NOT NULL,
    rating NUMERIC(2, 1) DEFAULT 5.0 CHECK (rating BETWEEN 1.0 AND 5.0),
    text TEXT NOT NULL,
    verified_transaction BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

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
-- SECTION 4: PERFORMANCE INDEXES
-- =========================================================================
CREATE INDEX IF NOT EXISTS idx_properties_owner ON public.properties (owner_id);
CREATE INDEX IF NOT EXISTS idx_properties_city ON public.properties (city);
CREATE INDEX IF NOT EXISTS idx_properties_deal_type ON public.properties (deal_type);
CREATE INDEX IF NOT EXISTS idx_materials_supplier ON public.materials (supplier_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications (user_id);
CREATE INDEX IF NOT EXISTS idx_deal_rooms_buyerseller ON public.deal_rooms (buyer_id, seller_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON public.security_audit_logs (created_at DESC);


-- =========================================================================
-- SECTION 5: AUTOMATED TRIGGERS
-- =========================================================================
DROP TRIGGER IF EXISTS trg_enforce_profile_security ON public.users_profiles;
CREATE TRIGGER trg_enforce_profile_security
    BEFORE INSERT OR UPDATE ON public.users_profiles
    FOR EACH ROW EXECUTE FUNCTION public.enforce_profile_security();

DROP TRIGGER IF EXISTS trg_enforce_property_update_security ON public.properties;
CREATE TRIGGER trg_enforce_property_update_security
    BEFORE UPDATE ON public.properties
    FOR EACH ROW EXECUTE FUNCTION public.enforce_property_update_security();

DROP TRIGGER IF EXISTS trg_enforce_property_private_security ON public.properties_private;
CREATE TRIGGER trg_enforce_property_private_security
    BEFORE INSERT OR UPDATE ON public.properties_private
    FOR EACH ROW EXECUTE FUNCTION public.enforce_property_private_security();

DROP TRIGGER IF EXISTS trg_enforce_review_security ON public.user_reviews;
CREATE TRIGGER trg_enforce_review_security
    BEFORE INSERT OR UPDATE ON public.user_reviews
    FOR EACH ROW EXECUTE FUNCTION public.enforce_review_security();

DROP TRIGGER IF EXISTS trg_enforce_general_barter ON public.barter_offers;
CREATE TRIGGER trg_enforce_general_barter
    BEFORE UPDATE ON public.barter_offers
    FOR EACH ROW EXECUTE FUNCTION public.enforce_general_system_fields();

DROP TRIGGER IF EXISTS trg_enforce_general_requests ON public.customer_requests;
CREATE TRIGGER trg_enforce_general_requests
    BEFORE UPDATE ON public.customer_requests
    FOR EACH ROW EXECUTE FUNCTION public.enforce_general_system_fields();

DROP TRIGGER IF EXISTS trg_enforce_general_notifications ON public.notifications;
CREATE TRIGGER trg_enforce_general_notifications
    BEFORE UPDATE ON public.notifications
    FOR EACH ROW EXECUTE FUNCTION public.enforce_general_system_fields();

DROP TRIGGER IF EXISTS trg_enforce_general_deal_rooms ON public.deal_rooms;
CREATE TRIGGER trg_enforce_general_deal_rooms
    BEFORE UPDATE ON public.deal_rooms
    FOR EACH ROW EXECUTE FUNCTION public.enforce_general_system_fields();

DROP TRIGGER IF EXISTS trg_enforce_general_deal_docs ON public.deal_room_documents;
CREATE TRIGGER trg_enforce_general_deal_docs
    BEFORE UPDATE ON public.deal_room_documents
    FOR EACH ROW EXECUTE FUNCTION public.enforce_general_system_fields();

DROP TRIGGER IF EXISTS trg_audit_properties ON public.properties;
CREATE TRIGGER trg_audit_properties
    AFTER INSERT OR UPDATE OR DELETE ON public.properties
    FOR EACH ROW EXECUTE FUNCTION public.log_security_audit_event();

DROP TRIGGER IF EXISTS trg_audit_deal_rooms ON public.deal_rooms;
CREATE TRIGGER trg_audit_deal_rooms
    AFTER INSERT OR UPDATE OR DELETE ON public.deal_rooms
    FOR EACH ROW EXECUTE FUNCTION public.log_security_audit_event();


-- =========================================================================
-- SECTION 6: STRICT ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================

ALTER TABLE public.users_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties_private ENABLE ROW LEVEL SECURITY;
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

-- 1. users_profiles RLS
DROP POLICY IF EXISTS "Users read own profile or admin" ON public.users_profiles;
CREATE POLICY "Users read own profile or admin" ON public.users_profiles 
FOR SELECT TO authenticated 
USING (id = public.get_auth_user_id() OR public.is_admin());

DROP POLICY IF EXISTS "Users update own profile" ON public.users_profiles;
CREATE POLICY "Users update own profile" ON public.users_profiles 
FOR UPDATE TO authenticated 
USING (id = public.get_auth_user_id() OR public.is_admin())
WITH CHECK (id = public.get_auth_user_id() OR public.is_admin());

-- FIX #5: ادمین هم بتواند پروفایل دیگران را درج کند
DROP POLICY IF EXISTS "Users insert own profile" ON public.users_profiles;
CREATE POLICY "Users insert own profile" ON public.users_profiles 
FOR INSERT TO authenticated 
WITH CHECK (id = public.get_auth_user_id() OR public.is_admin());

-- FIX #5: پلیسی DELETE جا افتاده بود (کاربر/ادمین نمی‌توانست پروفایل حذف کند)
DROP POLICY IF EXISTS "Users delete own profile" ON public.users_profiles;
CREATE POLICY "Users delete own profile" ON public.users_profiles 
FOR DELETE TO authenticated 
USING (id = public.get_auth_user_id() OR public.is_admin());

-- 2. properties RLS
DROP POLICY IF EXISTS "Owner or admin read properties base" ON public.properties;
CREATE POLICY "Owner or admin read properties base" ON public.properties 
FOR SELECT TO authenticated 
USING (owner_id = public.get_auth_user_id() OR public.is_admin() OR verified_status = 'verified');

DROP POLICY IF EXISTS "Owner insert properties" ON public.properties;
CREATE POLICY "Owner insert properties" ON public.properties 
FOR INSERT TO authenticated 
WITH CHECK (owner_id = public.get_auth_user_id() OR public.is_admin());

DROP POLICY IF EXISTS "Owner update properties" ON public.properties;
CREATE POLICY "Owner update properties" ON public.properties 
FOR UPDATE TO authenticated 
USING (owner_id = public.get_auth_user_id() OR public.is_admin())
WITH CHECK (owner_id = public.get_auth_user_id() OR public.is_admin());

DROP POLICY IF EXISTS "Owner delete properties" ON public.properties;
CREATE POLICY "Owner delete properties" ON public.properties 
FOR DELETE TO authenticated 
USING (owner_id = public.get_auth_user_id() OR public.is_admin());

-- 2.1. properties_private RLS
DROP POLICY IF EXISTS "Owner admin read properties private" ON public.properties_private;
CREATE POLICY "Owner admin read properties private" ON public.properties_private 
FOR SELECT TO authenticated 
USING (
    public.is_admin() 
    OR EXISTS (
        SELECT 1 FROM public.properties p 
        WHERE p.id = properties_private.property_id 
          AND p.owner_id = public.get_auth_user_id()
    )
);

DROP POLICY IF EXISTS "Owner admin manage properties private" ON public.properties_private;
CREATE POLICY "Owner admin manage properties private" ON public.properties_private 
FOR ALL TO authenticated 
USING (
    public.is_admin() 
    OR EXISTS (
        SELECT 1 FROM public.properties p 
        WHERE p.id = properties_private.property_id 
          AND p.owner_id = public.get_auth_user_id()
    )
)
WITH CHECK (
    public.is_admin() 
    OR EXISTS (
        SELECT 1 FROM public.properties p 
        WHERE p.id = properties_private.property_id 
          AND p.owner_id = public.get_auth_user_id()
    )
);

-- 3. materials RLS
DROP POLICY IF EXISTS "Supplier admin select materials" ON public.materials;
CREATE POLICY "Supplier admin select materials" ON public.materials 
FOR SELECT TO authenticated 
USING (supplier_id = public.get_auth_user_id() OR public.is_admin());

DROP POLICY IF EXISTS "Supplier manage materials" ON public.materials;
CREATE POLICY "Supplier manage materials" ON public.materials 
FOR ALL TO authenticated 
USING (supplier_id = public.get_auth_user_id() OR public.is_admin())
WITH CHECK (supplier_id = public.get_auth_user_id() OR public.is_admin());

-- 4. craftsmen RLS
DROP POLICY IF EXISTS "Admin craftsmen select" ON public.craftsmen;
CREATE POLICY "Admin craftsmen select" ON public.craftsmen 
FOR SELECT TO authenticated 
USING (true);

DROP POLICY IF EXISTS "Admin manage craftsmen" ON public.craftsmen;
CREATE POLICY "Admin manage craftsmen" ON public.craftsmen 
FOR ALL TO authenticated 
USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 5. scrap_materials RLS
DROP POLICY IF EXISTS "Owner admin scrap select" ON public.scrap_materials;
CREATE POLICY "Owner admin scrap select" ON public.scrap_materials 
FOR SELECT TO authenticated 
USING (owner_id = public.get_auth_user_id() OR public.is_admin());

DROP POLICY IF EXISTS "Owner manage scrap" ON public.scrap_materials;
CREATE POLICY "Owner manage scrap" ON public.scrap_materials 
FOR ALL TO authenticated 
USING (owner_id = public.get_auth_user_id() OR public.is_admin())
WITH CHECK (owner_id = public.get_auth_user_id() OR public.is_admin());

-- 6. deal_rooms RLS
DROP POLICY IF EXISTS "Members access deal room" ON public.deal_rooms;
CREATE POLICY "Members access deal room" ON public.deal_rooms 
FOR SELECT TO authenticated 
USING (
    public.is_admin() 
    OR buyer_id = public.get_auth_user_id()
    OR seller_id = public.get_auth_user_id()
    OR assigned_agent_id = public.get_auth_user_id()
);

DROP POLICY IF EXISTS "Admin manage deal room" ON public.deal_rooms;
CREATE POLICY "Admin manage deal room" ON public.deal_rooms 
FOR ALL TO authenticated 
USING (public.is_admin()) 
WITH CHECK (public.is_admin());

-- 7. deal_room_documents RLS
DROP POLICY IF EXISTS "Members access deal documents" ON public.deal_room_documents;
CREATE POLICY "Members access deal documents" ON public.deal_room_documents 
FOR SELECT TO authenticated 
USING (
    public.is_admin()
    OR EXISTS (
        SELECT 1 FROM public.deal_rooms dr
        WHERE dr.id = deal_room_documents.deal_room_id
          AND (
              dr.buyer_id = public.get_auth_user_id()
              OR dr.seller_id = public.get_auth_user_id()
              OR dr.assigned_agent_id = public.get_auth_user_id()
          )
    )
);

DROP POLICY IF EXISTS "Admin manage deal documents" ON public.deal_room_documents;
CREATE POLICY "Admin manage deal documents" ON public.deal_room_documents 
FOR ALL TO authenticated 
USING (public.is_admin()) 
WITH CHECK (public.is_admin());

-- 8. barter_offers RLS
DROP POLICY IF EXISTS "Owner admin barter select" ON public.barter_offers;
CREATE POLICY "Owner admin barter select" ON public.barter_offers 
FOR SELECT TO authenticated 
USING (owner_id = public.get_auth_user_id() OR public.is_admin());

DROP POLICY IF EXISTS "Owner manage barter" ON public.barter_offers;
CREATE POLICY "Owner manage barter" ON public.barter_offers 
FOR ALL TO authenticated 
USING (owner_id = public.get_auth_user_id() OR public.is_admin())
WITH CHECK (owner_id = public.get_auth_user_id() OR public.is_admin());

-- 9. partnerships RLS
DROP POLICY IF EXISTS "Owner admin partnership select" ON public.partnerships;
CREATE POLICY "Owner admin partnership select" ON public.partnerships 
FOR SELECT TO authenticated 
USING (owner_id = public.get_auth_user_id() OR public.is_admin());

DROP POLICY IF EXISTS "Owner manage partnerships" ON public.partnerships;
CREATE POLICY "Owner manage partnerships" ON public.partnerships 
FOR ALL TO authenticated 
USING (owner_id = public.get_auth_user_id() OR public.is_admin())
WITH CHECK (owner_id = public.get_auth_user_id() OR public.is_admin());

-- 10. customer_requests RLS
DROP POLICY IF EXISTS "Users manage own requests" ON public.customer_requests;
CREATE POLICY "Users manage own requests" ON public.customer_requests 
FOR ALL TO authenticated 
USING (customer_id = public.get_auth_user_id() OR public.is_admin())
WITH CHECK (customer_id = public.get_auth_user_id() OR public.is_admin());

-- 11. price_indices RLS
DROP POLICY IF EXISTS "Public read price indices" ON public.price_indices;
CREATE POLICY "Public read price indices" ON public.price_indices 
FOR SELECT USING (true);

-- 12. live_events RLS
DROP POLICY IF EXISTS "Public read live events" ON public.live_events;
CREATE POLICY "Public read live events" ON public.live_events 
FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin insert live events" ON public.live_events;
CREATE POLICY "Admin insert live events" ON public.live_events 
FOR INSERT TO authenticated 
WITH CHECK (public.is_admin());

-- 13. ad_campaigns RLS
DROP POLICY IF EXISTS "Admin only ad campaigns select" ON public.ad_campaigns;
CREATE POLICY "Admin only ad campaigns select" ON public.ad_campaigns 
FOR SELECT TO authenticated 
USING (public.is_admin());

DROP POLICY IF EXISTS "Admin manage ads" ON public.ad_campaigns;
CREATE POLICY "Admin manage ads" ON public.ad_campaigns 
FOR ALL TO authenticated 
USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 14. notifications RLS
-- FIX #5: بای‌پس ادمین اضافه شد (ادمین نمی‌توانست نوتیفیکیشن بفرستد)
DROP POLICY IF EXISTS "Users access own notifications" ON public.notifications;
CREATE POLICY "Users access own notifications" ON public.notifications 
FOR ALL TO authenticated 
USING (user_id = public.get_auth_user_id() OR public.is_admin())
WITH CHECK (user_id = public.get_auth_user_id() OR public.is_admin());

-- 15. user_reviews RLS
DROP POLICY IF EXISTS "Public read reviews" ON public.user_reviews;
CREATE POLICY "Public read reviews" ON public.user_reviews 
FOR SELECT USING (true);

DROP POLICY IF EXISTS "Author create reviews" ON public.user_reviews;
CREATE POLICY "Author create reviews" ON public.user_reviews 
FOR INSERT TO authenticated 
WITH CHECK (author_id = public.get_auth_user_id());

DROP POLICY IF EXISTS "Author manage own reviews" ON public.user_reviews;
CREATE POLICY "Author manage own reviews" ON public.user_reviews 
FOR UPDATE TO authenticated 
USING (author_id = public.get_auth_user_id() OR public.is_admin())
WITH CHECK (author_id = public.get_auth_user_id() OR public.is_admin());

-- FIX #5: DELETE جا افتاده بود
DROP POLICY IF EXISTS "Author delete own reviews" ON public.user_reviews;
CREATE POLICY "Author delete own reviews" ON public.user_reviews 
FOR DELETE TO authenticated 
USING (author_id = public.get_auth_user_id() OR public.is_admin());

-- 16. security_audit_logs RLS
DROP POLICY IF EXISTS "Admin only read audit logs" ON public.security_audit_logs;
CREATE POLICY "Admin only read audit logs" ON public.security_audit_logs 
FOR SELECT TO authenticated 
USING (public.is_admin());


-- =========================================================================
-- SECTION 7: DEFAULT PRIVILEGES HARDENING + FIX #1 (GRANT مجدد)
-- =========================================================================
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC, ANON, AUTHENTICATED;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE SELECT, INSERT, UPDATE, DELETE ON TABLES FROM PUBLIC, ANON, AUTHENTICATED;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE USAGE, SELECT, UPDATE ON SEQUENCES FROM PUBLIC, ANON, AUTHENTICATED;

-- FIX #1 (کشنده): RLS بدون GRANT بی‌اثر است؛ پس از REVOKE، دسترسی جداول پایه بازگردانده شد.
-- دسترسی واقعی ردیف‌ها توسط Section 6 (RLS) کنترل می‌شود.
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO anon, authenticated;

-- GRANT SELECT روی ویوهای عمومی
GRANT SELECT ON public.users_profiles_public TO anon, authenticated;
GRANT SELECT ON public.properties_public TO anon, authenticated;
GRANT SELECT ON public.materials_public TO anon, authenticated;
GRANT SELECT ON public.craftsmen_public TO anon, authenticated;
GRANT SELECT ON public.scrap_materials_public TO anon, authenticated;
GRANT SELECT ON public.ad_campaigns_public TO anon, authenticated;


-- =========================================================================
-- SECTION 8: LOCK DOWN SECURITY DEFINER FUNCTIONS
-- =========================================================================
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC, ANON;
GRANT EXECUTE ON FUNCTION public.is_admin() TO AUTHENTICATED, SERVICE_ROLE;

REVOKE EXECUTE ON FUNCTION public.get_auth_user_id() FROM PUBLIC, ANON;
GRANT EXECUTE ON FUNCTION public.get_auth_user_id() TO AUTHENTICATED, SERVICE_ROLE;

REVOKE EXECUTE ON FUNCTION public.log_security_audit_event() FROM PUBLIC, ANON, AUTHENTICATED;
GRANT EXECUTE ON FUNCTION public.log_security_audit_event() TO SERVICE_ROLE;

REVOKE EXECUTE ON FUNCTION public.enforce_profile_security() FROM PUBLIC, ANON, AUTHENTICATED;
GRANT EXECUTE ON FUNCTION public.enforce_profile_security() TO SERVICE_ROLE;

REVOKE EXECUTE ON FUNCTION public.enforce_property_update_security() FROM PUBLIC, ANON, AUTHENTICATED;
GRANT EXECUTE ON FUNCTION public.enforce_property_update_security() TO SERVICE_ROLE;

REVOKE EXECUTE ON FUNCTION public.enforce_property_private_security() FROM PUBLIC, ANON, AUTHENTICATED;
GRANT EXECUTE ON FUNCTION public.enforce_property_private_security() TO SERVICE_ROLE;

REVOKE EXECUTE ON FUNCTION public.enforce_review_security() FROM PUBLIC, ANON, AUTHENTICATED;
GRANT EXECUTE ON FUNCTION public.enforce_review_security() TO SERVICE_ROLE;

REVOKE EXECUTE ON FUNCTION public.enforce_general_system_fields() FROM PUBLIC, ANON, AUTHENTICATED;
GRANT EXECUTE ON FUNCTION public.enforce_general_system_fields() TO SERVICE_ROLE;


-- =========================================================================
-- SECTION 9: INITIAL SAFE SEED DATA
-- =========================================================================
INSERT INTO public.users_profiles (id, phone_number, full_name, role, city, verified_identity, credit_score, badge_title, avatar_url, bio)
VALUES
('u1', '09121112233', 'مهندس علی فرهمند', 'builder', 'تهران', true, 98, 'سازنده رتبهدار ممتاز', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200', 'عضو نظام مهندسی با بیش از ۱۵ سال سابقه احداث پروژههای لوکس منطقه ۱ و ۲ تهران')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.properties (code, title, deal_type, property_type, city, province, district, price, price_per_meter, area, rooms, document_type, verified_status, images, features, description, owner_id, owner_name)
VALUES
('PYS-1001', 'پنتهاوس مجلل فرمانیه (تسویه نقدی فوری)', 'sale', 'apartment', 'تهران', 'تهران', 'فرمانیه', 48500000000, 142647000, 340, 4, 'سند تکبرگ ششدانگ', 'verified', ARRAY['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800'], ARRAY['استعلام ثبتی پاک', 'دید ابدی ۳۶۰ درجه', 'سند تکبرگ عرصه و عیان'], 'فروش فوری با تسویه نقدی رسمی در دفترخانه. سند ششدانگ پاک و فاقد هرگونه بدهی بانکی.', 'u1', 'مهندس فرهمند')
ON CONFLICT (code) DO NOTHING;

INSERT INTO public.properties_private (property_id, address, owner_phone, verification_notes, verified_by)
VALUES
((SELECT id FROM public.properties WHERE code = 'PYS-1001'), 'فرمانیه، خیابان لواسانی، پلاک ۱۲', '09121112233', 'تاییدیه کامل اسناد ثبتی توسط تیم حقوقی پیوندساخت', 'واحد حقوقی و اسناد')
ON CONFLICT (property_id) DO NOTHING;


-- =========================================================================
-- SECTION 10: REAL EXECUTABLE SECURITY TESTS
-- =========================================================================
DO $$
BEGIN
    RAISE NOTICE 'Executing Real Security Tests for Pyvand Sakht...';
    
    ASSERT (SELECT proname FROM pg_proc WHERE proname = 'enforce_profile_security') IS NOT NULL, 'Test 1 Failed: enforce_profile_security missing';
    
    ASSERT NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users_profiles_public' 
          AND column_name IN ('phone_number', 'national_id', 'credit_score')
    ), 'Test 2 Failed: users_profiles_public leaks sensitive columns';

    ASSERT NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'ad_campaigns_public' 
          AND column_name IN ('contact_number', 'total_paid_toman', 'payment_reference_id')
    ), 'Test 3 Failed: ad_campaigns_public leaks payment info';

    ASSERT EXISTS (
        SELECT 1 FROM pg_default_acl acl
        JOIN pg_namespace n ON n.oid = acl.defaclnamespace
        WHERE n.nspname = 'public' AND acl.defaclobjtype = 'f'
    ), 'Test 4 Failed: Default privileges for functions not set';

    -- FIX: تست جدید — اطمینان از GRANT جداول پایه
    ASSERT EXISTS (
        SELECT 1 FROM information_schema.role_table_grants 
        WHERE table_schema = 'public' 
          AND grantee = 'authenticated' 
          AND privilege_type = 'SELECT'
          AND table_name = 'users_profiles'
    ), 'Test 5 Failed: Base table grants missing';

    RAISE NOTICE 'All Real Security Tests Passed Successfully!';
END $$;