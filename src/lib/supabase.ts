import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database tables
export interface Donor {
    id: string;
    name: string;
    blood_type: "A" | "B" | "AB" | "O";
    rhesus: "Rh+" | "Rh-";
    location: string;
    phone_number: string;
    notes?: string;
    status: "active" | "unavailable" | "pending_verification";
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
    created_at: string;
}
