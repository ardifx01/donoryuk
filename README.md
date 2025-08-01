# DonorYuk - Platform Digital Donor Darah Indonesia

Platform digital yang menghubungkan pendonor darah dengan mereka yang membutuhkan. Temukan donor darah berdasarkan golongan darah, lokasi, dan ketersediaan secara real-time.

## 🚀 Tech Stack

-   **Frontend**: Next.js 15 + React 19
-   **Styling**: Tailwind CSS 4
-   **Database**: Supabase (PostgreSQL)
-   **Authentication**: Supabase Auth
-   **Storage**: Supabase Storage
-   **Deployment**: Vercel

## 📋 Prerequisites

-   Node.js 18+
-   npm atau yarn
-   Akun Supabase

## 🛠️ Setup Development

### 1. Clone Repository

```bash
git clone <repository-url>
cd donoryuk
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Buat file `.env.local` di root project:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Database URL (optional)
DATABASE_URL=your_database_connection_string
```

### 4. Setup Supabase Database

1. Buat project baru di [Supabase](https://supabase.com)
2. Jalankan SQL schema dari file `database/schema.sql` di Supabase SQL Editor
3. Setup Row Level Security (RLS) policies
4. Konfigurasi Storage bucket untuk upload kartu donor

### 5. Jalankan Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

## 📊 Database Schema

### Tables

1. **donors** - Data pendonor

    - id, name, blood_type, rhesus, location, phone_number, notes, status, last_donation_date, user_id

2. **verifications** - Verifikasi kartu donor

    - id, donor_id, donor_card_url, verified, verified_at, admin_id

3. **admins** - Data admin
    - id, name, email, user_id

### Enums

-   `blood_type_enum`: A, B, AB, O
-   `rhesus_enum`: Rh+, Rh-
-   `donor_status_enum`: active, unavailable, pending_verification

## 🔐 Authentication & Authorization

-   **Pendonor**: Dapat mendaftar, update profil sendiri, lihat donor aktif
-   **Admin**: Dapat melihat semua donor, verifikasi kartu, update status
-   **Public**: Dapat melihat donor aktif untuk pencarian

## 📱 Features

### MVP Features

1. **Registrasi Pendonor**

    - Form lengkap dengan golongan darah, lokasi, kontak
    - Upload kartu donor untuk verifikasi
    - Status: pending_verification → active

2. **Pencarian Donor**

    - Filter berdasarkan golongan darah
    - Filter berdasarkan lokasi
    - Filter berdasarkan status ketersediaan
    - Kontak langsung via WhatsApp

3. **Dashboard Admin**

    - Lihat semua pendonor
    - Verifikasi kartu donor
    - Update status pendonor
    - Tandai tanggal donor terakhir

4. **Cooldown Management**
    - Otomatis set status "unavailable" setelah donor
    - Otomatis kembali "active" setelah 100 hari
    - Trigger database untuk automasi

## 🚀 Deployment

### Vercel Deployment

1. Push code ke GitHub
2. Connect repository di Vercel
3. Set environment variables di Vercel dashboard
4. Deploy otomatis

### Environment Variables untuk Production

```env
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key
```

## 📝 Development Workflow

### Tahap 1: Setup dan MVP ✅

-   [x] Setup Next.js + Supabase
-   [x] Database schema
-   [x] Landing page
-   [x] Authentication system
-   [x] Registrasi pendonor
-   [x] Dashboard admin
-   [x] Sistem verifikasi

### Tahap 2: Pencarian & Interaksi ✅

-   [x] Halaman pencarian donor
-   [x] Filter dan sorting
-   [x] Integrasi WhatsApp
-   [x] Dashboard pendonor

### Tahap 3: Testing & Feedback

-   [ ] Testing internal
-   [ ] Bug fixes
-   [ ] UX improvements

### Tahap 4: Launch

-   [ ] Production deployment
-   [ ] Documentation
-   [ ] Marketing

## 🤝 Contributing

1. Fork repository
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Contact

DonorYuk Team - [email@donoryuk.com](mailto:email@donoryuk.com)

Project Link: [https://github.com/username/donoryuk](https://github.com/username/donoryuk)
