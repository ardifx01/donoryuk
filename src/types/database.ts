// Database types for DonorYuk
export type BloodType = "A" | "B" | "AB" | "O";
export type RhesusType = "Rh+" | "Rh-";
export type DonorStatus = "active" | "unavailable" | "pending_verification";

// Full blood type (e.g., "A+", "O-")
export type FullBloodType = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";

// Database table interfaces
export interface Donor {
    id: string;
    name: string;
    blood_type: BloodType;
    rhesus: RhesusType;
    location: string;
    phone_number: string;
    notes?: string;
    status: DonorStatus;
    last_donation_date?: string;
    user_id: string;
    created_at: string;
    updated_at: string;
}

export interface Verification {
    id: string;
    donor_id: string;
    donor_card_url: string;
    verified: boolean;
    verified_at?: string;
    admin_id?: string;
    created_at: string;
}

export interface Admin {
    id: string;
    name: string;
    email: string;
    user_id: string;
    created_at: string;
}

// Extended interfaces with relations
export interface DonorWithVerification extends Donor {
    verification?: Verification;
}

export interface VerificationWithDonor extends Verification {
    donor: Donor;
}

export interface VerificationWithAdmin extends Verification {
    admin?: Admin;
}

// Form interfaces
export interface DonorRegistrationForm {
    name: string;
    blood_type: BloodType;
    rhesus: RhesusType;
    location: string;
    phone_number: string;
    notes?: string;
    donor_card_file?: File;
}

export interface DonorUpdateForm {
    name?: string;
    location?: string;
    phone_number?: string;
    notes?: string;
}

export interface AdminUpdateDonorForm {
    status?: DonorStatus;
    last_donation_date?: string;
    notes?: string;
}

// Search and filter interfaces
export interface DonorSearchFilters {
    blood_type?: BloodType[];
    rhesus?: RhesusType[];
    location?: string;
    status?: DonorStatus[];
    available_only?: boolean;
}

export interface DonorSearchParams extends DonorSearchFilters {
    search?: string;
    page?: number;
    limit?: number;
    sort_by?: "name" | "location" | "created_at" | "last_donation_date";
    sort_order?: "asc" | "desc";
}

// API response interfaces
export interface ApiResponse<T> {
    data: T;
    message?: string;
    error?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        total_pages: number;
    };
}

// Statistics interfaces
export interface DonorStats {
    total_donors: number;
    active_donors: number;
    pending_verification: number;
    unavailable_donors: number;
    donors_by_blood_type: Record<string, number>;
    donors_by_location: Record<string, number>;
    recent_registrations: number;
}

export interface AdminStats extends DonorStats {
    pending_verifications: number;
    verified_today: number;
    donations_this_month: number;
}

// Notification interfaces
export interface Notification {
    id: string;
    user_id: string;
    title: string;
    message: string;
    type: "info" | "success" | "warning" | "error";
    read: boolean;
    created_at: string;
}

// WhatsApp integration
export interface WhatsAppMessage {
    phone_number: string;
    message: string;
    donor_name: string;
    blood_type: string;
    location: string;
}

// File upload interfaces
export interface FileUploadResponse {
    url: string;
    path: string;
    size: number;
    type: string;
}

// Error interfaces
export interface DatabaseError {
    code: string;
    message: string;
    details?: string;
    hint?: string;
}

// Supabase specific types
export interface SupabaseUser {
    id: string;
    email?: string;
    phone?: string;
    created_at: string;
    updated_at: string;
    email_confirmed_at?: string;
    phone_confirmed_at?: string;
    last_sign_in_at?: string;
}

// Auth context types
export interface AuthContextType {
    user: SupabaseUser | null;
    donor: Donor | null;
    admin: Admin | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    resendConfirmation: (email: string) => Promise<void>;
    updateProfile: (data: Partial<Donor>) => Promise<void>;
}

// Component prop types
export interface DonorCardProps {
    donor: Donor;
    showContact?: boolean;
    showStatus?: boolean;
    onContact?: (donor: Donor) => void;
}

export interface SearchFormProps {
    filters: DonorSearchFilters;
    onFiltersChange: (filters: DonorSearchFilters) => void;
    onSearch: (params: DonorSearchParams) => void;
    loading?: boolean;
}

export interface AdminTableProps {
    donors: DonorWithVerification[];
    onStatusUpdate: (donorId: string, status: DonorStatus) => void;
    onVerify: (verificationId: string) => void;
    onReject: (verificationId: string) => void;
    loading?: boolean;
}

// Utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Blood type compatibility
export interface BloodCompatibility {
    can_donate_to: FullBloodType[];
    can_receive_from: FullBloodType[];
}

export type BloodCompatibilityMap = Record<FullBloodType, BloodCompatibility>;
