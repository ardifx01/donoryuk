# Setup Database Supabase untuk DonorYuk

## 1. Buat Project Supabase

1. Kunjungi [Supabase Dashboard](https://supabase.com/dashboard)
2. Klik "New Project"
3. Pilih organization atau buat baru
4. Isi detail project:
    - **Name**: DonorYuk
    - **Database Password**: (buat password yang kuat)
    - **Region**: Southeast Asia (Singapore) - untuk performa terbaik di Indonesia
5. Klik "Create new project"
6. Tunggu hingga project selesai dibuat (2-3 menit)

## 2. Setup Database Schema

1. Buka **SQL Editor** di dashboard Supabase
2. Copy seluruh isi file `schema.sql`
3. Paste ke SQL Editor
4. Klik "Run" untuk menjalankan script
5. Pastikan semua tabel berhasil dibuat tanpa error

## 3. Setup Storage untuk Upload Kartu Donor

1. Buka **Storage** di dashboard Supabase
2. Klik "Create a new bucket"
3. Isi detail bucket:
    - **Name**: `donor-cards`
    - **Public bucket**: ✅ (centang)
    - **File size limit**: 5MB
    - **Allowed MIME types**: `image/jpeg,image/png,image/webp`
4. Klik "Create bucket"

### Setup Storage Policies

Setelah bucket dibuat, setup policies untuk keamanan:

```sql
-- Policy untuk upload kartu donor (hanya user yang login)
CREATE POLICY "Users can upload their own donor cards" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'donor-cards' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy untuk melihat kartu donor (admin dan pemilik)
CREATE POLICY "Users can view donor cards" ON storage.objects
FOR SELECT USING (
  bucket_id = 'donor-cards' AND (
    auth.uid()::text = (storage.foldername(name))[1] OR
    EXISTS (
      SELECT 1 FROM admins
      WHERE user_id = auth.uid()
    )
  )
);

-- Policy untuk update kartu donor (hanya pemilik)
CREATE POLICY "Users can update their own donor cards" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'donor-cards' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy untuk delete kartu donor (pemilik dan admin)
CREATE POLICY "Users can delete donor cards" ON storage.objects
FOR DELETE USING (
  bucket_id = 'donor-cards' AND (
    auth.uid()::text = (storage.foldername(name))[1] OR
    EXISTS (
      SELECT 1 FROM admins
      WHERE user_id = auth.uid()
    )
  )
);
```

## 4. Setup Authentication

1. Buka **Authentication** > **Settings**
2. Konfigurasi **Site URL**:
    - Development: `http://localhost:3000`
    - Production: `https://your-domain.com`
3. Konfigurasi **Redirect URLs**:
    - `http://localhost:3000/auth/callback`
    - `https://your-domain.com/auth/callback`

### Email Templates (Opsional)

Customize email templates di **Authentication** > **Email Templates**:

-   **Confirm signup**: Template konfirmasi pendaftaran
-   **Magic Link**: Template login tanpa password
-   **Change Email Address**: Template perubahan email
-   **Reset Password**: Template reset password

## 5. Buat Admin User Pertama

Setelah setup selesai, buat admin user pertama:

1. Daftar user baru melalui aplikasi atau Supabase Auth
2. Copy User ID dari **Authentication** > **Users**
3. Jalankan SQL berikut di SQL Editor:

```sql
-- Ganti 'USER_ID_HERE' dengan ID user yang akan dijadikan admin
-- Ganti 'admin@donoryuk.com' dengan email admin
INSERT INTO admins (name, email, user_id)
VALUES ('Super Admin', 'admin@donoryuk.com', 'USER_ID_HERE');
```

## 6. Environment Variables

Copy informasi berikut dari **Settings** > **API**:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Database URL (dari Settings > Database)
DATABASE_URL=postgresql://postgres:[password]@db.[project-id].supabase.co:5432/postgres
```

## 7. Testing Database

Test koneksi database dengan menjalankan query sederhana:

```sql
-- Test query untuk memastikan semua tabel ada
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('donors', 'verifications', 'admins');

-- Test enum types
SELECT enumlabel
FROM pg_enum
JOIN pg_type ON pg_enum.enumtypid = pg_type.oid
WHERE pg_type.typname = 'blood_type_enum';
```

## 8. Backup & Monitoring

### Setup Backup (Recommended)

1. Buka **Settings** > **Database**
2. Enable **Point-in-time Recovery** (PITR)
3. Set backup retention sesuai kebutuhan

### Monitoring

1. Buka **Reports** untuk melihat usage
2. Setup **Webhooks** untuk notifikasi (opsional)
3. Monitor **Logs** untuk debugging

## 9. Security Checklist

-   ✅ Row Level Security (RLS) enabled pada semua tabel
-   ✅ Storage policies configured
-   ✅ Environment variables secured
-   ✅ Admin user created
-   ✅ Backup enabled
-   ✅ HTTPS enforced

## 10. Troubleshooting

### Common Issues:

1. **RLS Policy Error**: Pastikan user sudah login dan memiliki permission
2. **Storage Upload Error**: Check bucket policies dan file size limit
3. **Connection Error**: Verify environment variables
4. **Migration Error**: Check SQL syntax dan dependencies

### Debug Commands:

```sql
-- Check current user
SELECT auth.uid(), auth.email();

-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'donors';

-- Check storage objects
SELECT * FROM storage.objects WHERE bucket_id = 'donor-cards';
```

## Next Steps

Setelah database setup selesai:

1. Test koneksi dari aplikasi Next.js
2. Implement authentication pages
3. Build donor registration form
4. Create admin dashboard
5. Test end-to-end functionality
