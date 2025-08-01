import type { BloodType, RhesusType, FullBloodType, BloodCompatibilityMap } from "@/types/database";

// Blood types
export const BLOOD_TYPES: BloodType[] = ["A", "B", "AB", "O"];
export const RHESUS_TYPES: RhesusType[] = ["Rh+", "Rh-"];

// Full blood types
export const FULL_BLOOD_TYPES: FullBloodType[] = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

// Donor status
export const DONOR_STATUS = {
    ACTIVE: "active" as const,
    UNAVAILABLE: "unavailable" as const,
    PENDING_VERIFICATION: "pending_verification" as const,
};

export const DONOR_STATUS_LABELS = {
    [DONOR_STATUS.ACTIVE]: "Aktif",
    [DONOR_STATUS.UNAVAILABLE]: "Tidak Tersedia",
    [DONOR_STATUS.PENDING_VERIFICATION]: "Menunggu Verifikasi",
};

export const DONOR_STATUS_COLORS = {
    [DONOR_STATUS.ACTIVE]: "green",
    [DONOR_STATUS.UNAVAILABLE]: "red",
    [DONOR_STATUS.PENDING_VERIFICATION]: "yellow",
};

// Blood type compatibility matrix
export const BLOOD_COMPATIBILITY: BloodCompatibilityMap = {
    "A+": {
        can_donate_to: ["A+", "AB+"],
        can_receive_from: ["A+", "A-", "O+", "O-"],
    },
    "A-": {
        can_donate_to: ["A+", "A-", "AB+", "AB-"],
        can_receive_from: ["A-", "O-"],
    },
    "B+": {
        can_donate_to: ["B+", "AB+"],
        can_receive_from: ["B+", "B-", "O+", "O-"],
    },
    "B-": {
        can_donate_to: ["B+", "B-", "AB+", "AB-"],
        can_receive_from: ["B-", "O-"],
    },
    "AB+": {
        can_donate_to: ["AB+"],
        can_receive_from: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    "AB-": {
        can_donate_to: ["AB+", "AB-"],
        can_receive_from: ["A-", "B-", "AB-", "O-"],
    },
    "O+": {
        can_donate_to: ["A+", "B+", "AB+", "O+"],
        can_receive_from: ["O+", "O-"],
    },
    "O-": {
        can_donate_to: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
        can_receive_from: ["O-"],
    },
};

// Indonesian provinces/cities for location dropdown
export const INDONESIAN_LOCATIONS = [
    "DKI Jakarta",
    "Jawa Barat",
    "Jawa Tengah",
    "Jawa Timur",
    "Yogyakarta",
    "Banten",
    "Sumatera Utara",
    "Sumatera Barat",
    "Sumatera Selatan",
    "Riau",
    "Kepulauan Riau",
    "Jambi",
    "Bengkulu",
    "Lampung",
    "Bangka Belitung",
    "Kalimantan Barat",
    "Kalimantan Tengah",
    "Kalimantan Selatan",
    "Kalimantan Timur",
    "Kalimantan Utara",
    "Sulawesi Utara",
    "Sulawesi Tengah",
    "Sulawesi Selatan",
    "Sulawesi Tenggara",
    "Gorontalo",
    "Sulawesi Barat",
    "Bali",
    "Nusa Tenggara Barat",
    "Nusa Tenggara Timur",
    "Maluku",
    "Maluku Utara",
    "Papua",
    "Papua Barat",
    "Papua Selatan",
    "Papua Tengah",
    "Papua Pegunungan",
];

// Indonesian Cities (Major ones)
export const INDONESIAN_CITIES = [
    "Jakarta Pusat",
    "Jakarta Utara",
    "Jakarta Barat",
    "Jakarta Selatan",
    "Jakarta Timur",
    "Bandung",
    "Bekasi",
    "Depok",
    "Tangerang",
    "Tangerang Selatan",
    "Bogor",
    "Surabaya",
    "Malang",
    "Semarang",
    "Yogyakarta",
    "Solo",
    "Magelang",
    "Medan",
    "Palembang",
    "Pekanbaru",
    "Padang",
    "Jambi",
    "Bengkulu",
    "Bandar Lampung",
    "Serang",
    "Cilegon",
    "Sukabumi",
    "Cirebon",
    "Tasikmalaya",
    "Purwokerto",
    "Tegal",
    "Pekalongan",
    "Salatiga",
    "Klaten",
    "Surakarta",
    "Kediri",
    "Blitar",
    "Mojokerto",
    "Pasuruan",
    "Probolinggo",
    "Jember",
    "Banyuwangi",
    "Denpasar",
    "Singaraja",
    "Mataram",
    "Bima",
    "Kupang",
    "Pontianak",
    "Banjarmasin",
    "Palangkaraya",
    "Samarinda",
    "Balikpapan",
    "Manado",
    "Palu",
    "Makassar",
    "Kendari",
    "Gorontalo",
    "Mamuju",
    "Ambon",
    "Ternate",
    "Jayapura",
    "Sorong",
    "Merauke",
    "Nabire",
];

// Donation cooldown period (days)
export const DONATION_COOLDOWN_DAYS = 100;

// File upload constraints
export const FILE_UPLOAD = {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: ["image/jpeg", "image/png", "image/webp"],
    ALLOWED_EXTENSIONS: [".jpg", ".jpeg", ".png", ".webp"],
};

// Pagination
export const PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100,
};

// API endpoints
export const API_ENDPOINTS = {
    DONORS: "/api/donors",
    VERIFICATIONS: "/api/verifications",
    ADMINS: "/api/admins",
    SEARCH: "/api/search",
    STATS: "/api/stats",
    UPLOAD: "/api/upload",
};

// Local storage keys
export const STORAGE_KEYS = {
    SEARCH_FILTERS: "donoryuk_search_filters",
    USER_PREFERENCES: "donoryuk_user_preferences",
    RECENT_SEARCHES: "donoryuk_recent_searches",
};

// WhatsApp message templates
export const WHATSAPP_TEMPLATES = {
    DONOR_REQUEST: (donorName: string, bloodType: string, location: string) =>
        `Halo ${donorName}, saya membutuhkan donor darah ${bloodType} di area ${location}. Apakah Anda bersedia membantu? Terima kasih.`,

    URGENT_REQUEST: (donorName: string, bloodType: string, location: string, hospital: string) =>
        `URGENT: Halo ${donorName}, saya membutuhkan donor darah ${bloodType} SEGERA di ${hospital}, ${location}. Mohon bantuannya. Terima kasih.`,

    FOLLOW_UP: (donorName: string) => `Halo ${donorName}, terima kasih atas kesediaannya. Kapan waktu yang tepat untuk koordinasi lebih lanjut?`,
};

// Notification types
export const NOTIFICATION_TYPES = {
    INFO: "info" as const,
    SUCCESS: "success" as const,
    WARNING: "warning" as const,
    ERROR: "error" as const,
};

// Date formats
export const DATE_FORMATS = {
    DISPLAY: "dd MMMM yyyy",
    INPUT: "yyyy-MM-dd",
    DATETIME: "dd MMMM yyyy HH:mm",
    TIME: "HH:mm",
};

// Validation rules
export const VALIDATION = {
    NAME: {
        MIN_LENGTH: 2,
        MAX_LENGTH: 100,
        PATTERN: /^[a-zA-Z\s.'-]+$/,
    },
    PHONE: {
        MIN_LENGTH: 10,
        MAX_LENGTH: 15,
        PATTERN: /^(\+62|62|0)[0-9]{8,13}$/,
    },
    NOTES: {
        MAX_LENGTH: 500,
    },
};

// Error messages
export const ERROR_MESSAGES = {
    REQUIRED: "Field ini wajib diisi",
    INVALID_EMAIL: "Format email tidak valid",
    INVALID_PHONE: "Format nomor telepon tidak valid",
    INVALID_FILE_TYPE: "Tipe file tidak didukung",
    FILE_TOO_LARGE: "Ukuran file terlalu besar",
    NETWORK_ERROR: "Terjadi kesalahan jaringan",
    UNAUTHORIZED: "Anda tidak memiliki akses",
    NOT_FOUND: "Data tidak ditemukan",
    SERVER_ERROR: "Terjadi kesalahan server",
};

// Success messages
export const SUCCESS_MESSAGES = {
    REGISTRATION_SUCCESS: "Pendaftaran berhasil! Menunggu verifikasi admin.",
    PROFILE_UPDATED: "Profil berhasil diperbarui",
    VERIFICATION_SUCCESS: "Verifikasi berhasil",
    STATUS_UPDATED: "Status berhasil diperbarui",
    FILE_UPLOADED: "File berhasil diupload",
};

// App metadata
export const APP_METADATA = {
    NAME: "DonorYuk",
    DESCRIPTION: "Platform Digital Donor Darah Indonesia",
    VERSION: "1.0.0",
    AUTHOR: "DonorYuk Team",
    KEYWORDS: ["donor darah", "pendonor", "golongan darah", "kesehatan", "indonesia"],
};

// Social media links
export const SOCIAL_LINKS = {
    FACEBOOK: "https://facebook.com/donoryuk",
    TWITTER: "https://twitter.com/donoryuk",
    INSTAGRAM: "https://instagram.com/donoryuk",
    LINKEDIN: "https://linkedin.com/company/donoryuk",
};

// Contact information
export const CONTACT_INFO = {
    EMAIL: "info@donoryuk.com",
    PHONE: "+62-21-1234-5678",
    ADDRESS: "Jakarta, Indonesia",
    SUPPORT_EMAIL: "support@donoryuk.com",
};

// Feature flags
export const FEATURE_FLAGS = {
    ENABLE_NOTIFICATIONS: true,
    ENABLE_WHATSAPP_INTEGRATION: true,
    ENABLE_EMAIL_VERIFICATION: true,
    ENABLE_PHONE_VERIFICATION: false,
    ENABLE_GEOLOCATION: false,
    ENABLE_ANALYTICS: true,
};
