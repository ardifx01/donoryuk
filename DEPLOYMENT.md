# 🚀 Deployment Guide - DonorYuk

Panduan lengkap untuk deploy aplikasi DonorYuk ke production.

## 📋 Prerequisites

-   Akun [Supabase](https://supabase.com)
-   Akun [Vercel](https://vercel.com)
-   Repository GitHub
-   Node.js 18+ (untuk development)

## 🗄️ Setup Database (Supabase)

### 1. Buat Project Supabase

1. Login ke [Supabase Dashboard](https://supabase.com/dashboard)
2. Klik "New Project"
3. Pilih organization dan isi detail project:
    - **Name**: donoryuk-production
    - **Database Password**: [Generate strong password]
    - **Region**: Southeast Asia (Singapore) - untuk performa optimal di Indonesia

### 2. Setup Database Schema

Jalankan SQL berikut di Supabase SQL Editor:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enums
CREATE TYPE blood_type_enum AS ENUM ('A', 'B', 'AB', 'O');
CREATE TYPE rhesus_enum AS ENUM ('Rh+', 'Rh-');
CREATE TYPE donor_status_enum AS ENUM ('active', 'unavailable', 'pending_verification');

-- Create donors table
CREATE TABLE donors (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    blood_type blood_type_enum NOT NULL,
    rhesus rhesus_enum NOT NULL,
    location VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    notes TEXT,
    status donor_status_enum DEFAULT 'pending_verification',
    last_donation_date TIMESTAMP WITH TIME ZONE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admins table
CREATE TABLE admins (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create verifications table
CREATE TABLE verifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    donor_id UUID REFERENCES donors(id) ON DELETE CASCADE,
    donor_card_url TEXT NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMP WITH TIME ZONE,
    admin_id UUID REFERENCES admins(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_donors_status ON donors(status);
CREATE INDEX idx_donors_blood_type ON donors(blood_type);
CREATE INDEX idx_donors_location ON donors(location);
CREATE INDEX idx_donors_user_id ON donors(user_id);
CREATE INDEX idx_verifications_donor_id ON verifications(donor_id);
CREATE INDEX idx_verifications_verified ON verifications(verified);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_donors_updated_at BEFORE UPDATE ON donors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admins_updated_at BEFORE UPDATE ON admins
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_verifications_updated_at BEFORE UPDATE ON verifications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically update donor status after cooldown period
CREATE OR REPLACE FUNCTION update_donor_availability()
RETURNS void AS $$
BEGIN
    UPDATE donors
    SET status = 'active'
    WHERE status = 'unavailable'
    AND last_donation_date IS NOT NULL
    AND last_donation_date < NOW() - INTERVAL '100 days';
END;
$$ LANGUAGE plpgsql;

-- Create a scheduled job to run the availability update (if pg_cron is available)
-- SELECT cron.schedule('update-donor-availability', '0 0 * * *', 'SELECT update_donor_availability();');
```

### 3. Setup Row Level Security (RLS)

```sql
-- Enable RLS on all tables
ALTER TABLE donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE verifications ENABLE ROW LEVEL SECURITY;

-- Donors policies
CREATE POLICY "Public can view active donors" ON donors
    FOR SELECT USING (status = 'active');

CREATE POLICY "Users can view own donor profile" ON donors
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own donor profile" ON donors
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own donor profile" ON donors
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all donors" ON donors
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admins
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can update all donors" ON donors
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM admins
            WHERE user_id = auth.uid()
        )
    );

-- Admins policies
CREATE POLICY "Admins can view all admins" ON admins
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admins
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can view own admin profile" ON admins
    FOR SELECT USING (auth.uid() = user_id);

-- Verifications policies
CREATE POLICY "Users can view own verifications" ON verifications
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM donors
            WHERE id = donor_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own verifications" ON verifications
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM donors
            WHERE id = donor_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can view all verifications" ON verifications
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admins
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can update all verifications" ON verifications
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM admins
            WHERE user_id = auth.uid()
        )
    );
```

### 4. Setup Storage Bucket

1. Go to **Storage** > **Buckets**
2. Create new bucket:
    - **Name**: `donor-cards`
    - **Public**: `true`
3. Set bucket policies:

```sql
-- Allow authenticated users to upload files
CREATE POLICY "Users can upload donor cards" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'donor-cards'
        AND auth.role() = 'authenticated'
    );

-- Allow public access to view files
CREATE POLICY "Public can view donor cards" ON storage.objects
    FOR SELECT USING (bucket_id = 'donor-cards');

-- Allow users to update their own files
CREATE POLICY "Users can update own donor cards" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'donor-cards'
        AND auth.uid()::text = (storage.foldername(name))[1]
    );
```

### 5. Create Admin User

```sql
-- Insert admin user (replace with actual admin details)
INSERT INTO admins (name, email, user_id) VALUES
('Admin DonorYuk', 'admin@donoryuk.com', 'USER_ID_FROM_AUTH_USERS');
```

## 🌐 Deploy to Vercel

### 1. Push to GitHub

```bash
git add .
git commit -m "Ready for production deployment"
git push origin main
```

### 2. Connect to Vercel

1. Login ke [Vercel Dashboard](https://vercel.com/dashboard)
2. Klik "New Project"
3. Import repository dari GitHub
4. Configure project:
    - **Framework Preset**: Next.js
    - **Root Directory**: `./` (atau `./donoryuk` jika ada subfolder)

### 3. Environment Variables

Set environment variables di Vercel:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 4. Deploy

Klik "Deploy" dan tunggu proses selesai.

## 🔧 Post-Deployment Setup

### 1. Update Supabase Auth Settings

1. Go to **Authentication** > **URL Configuration**
2. Add site URL: `https://your-app.vercel.app`
3. Add redirect URLs:
    - `https://your-app.vercel.app/auth/callback`
    - `http://localhost:3000/auth/callback` (untuk development)

### 2. Test Application

1. Buka aplikasi di browser
2. Test registrasi user baru
3. Test registrasi donor
4. Test pencarian donor
5. Test admin panel (jika sudah ada admin)

### 3. Setup Custom Domain (Optional)

1. Di Vercel Dashboard, go to project settings
2. **Domains** > Add domain
3. Configure DNS records sesuai instruksi Vercel

## 📊 Monitoring & Maintenance

### 1. Database Monitoring

-   Monitor query performance di Supabase Dashboard
-   Check storage usage untuk donor card uploads
-   Monitor active connections

### 2. Application Monitoring

-   Use Vercel Analytics untuk traffic monitoring
-   Setup error tracking (Sentry, LogRocket, dll)
-   Monitor Core Web Vitals

### 3. Regular Maintenance

-   Update dependencies secara berkala
-   Backup database secara rutin
-   Monitor dan clean up unused storage files
-   Review dan update RLS policies jika diperlukan

## 🚨 Troubleshooting

### Common Issues

1. **Build Errors**

    - Check TypeScript errors
    - Verify all environment variables
    - Check import paths

2. **Database Connection Issues**

    - Verify Supabase URL and keys
    - Check RLS policies
    - Verify user permissions

3. **Storage Upload Issues**
    - Check bucket policies
    - Verify file size limits
    - Check CORS settings

### Support

Untuk bantuan lebih lanjut:

-   Check Supabase documentation
-   Check Vercel documentation
-   Review application logs di Vercel Dashboard
-   Check browser console untuk client-side errors

## 🎉 Success!

Aplikasi DonorYuk sekarang sudah live dan siap digunakan!

**Next Steps:**

-   Setup monitoring dan analytics
-   Implement feedback system
-   Plan for scaling dan optimizations
-   Marketing dan user acquisition
