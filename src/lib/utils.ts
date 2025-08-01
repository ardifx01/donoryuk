import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { BLOOD_COMPATIBILITY } from "./constants";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Blood type compatibility checker
export const bloodTypeCompatibility = {
    "A+": ["A+", "AB+"],
    "A-": ["A+", "A-", "AB+", "AB-"],
    "B+": ["B+", "AB+"],
    "B-": ["B+", "B-", "AB+", "AB-"],
    "AB+": ["AB+"],
    "AB-": ["AB+", "AB-"],
    "O+": ["A+", "B+", "AB+", "O+"],
    "O-": ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
};

// Get compatible recipients for a donor
export function getCompatibleRecipients(donorBloodType: string): string[] {
    return bloodTypeCompatibility[donorBloodType as keyof typeof bloodTypeCompatibility] || [];
}

// Get compatible donors for a recipient
export function getCompatibleDonors(recipientBloodType: string): string[] {
    const compatibleDonors: string[] = [];

    Object.entries(bloodTypeCompatibility).forEach(([donorType, recipients]) => {
        if (recipients.includes(recipientBloodType)) {
            compatibleDonors.push(donorType);
        }
    });

    return compatibleDonors;
}

// Calculate days since last donation
export function daysSinceLastDonation(lastDonationDate: string | null): number {
    if (!lastDonationDate) return Infinity;

    const lastDonation = new Date(lastDonationDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - lastDonation.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
}

// Check if donor is available (not in cooldown)
export function isDonorAvailable(lastDonationDate: string | null, status: string): boolean {
    if (status !== "active") return false;

    const daysSince = daysSinceLastDonation(lastDonationDate);
    return daysSince >= 100 || daysSince === Infinity;
}

// Calculate when donor will be available again
export function getAvailabilityDate(lastDonationDate: string | null): Date | null {
    if (!lastDonationDate) return null;

    const lastDonation = new Date(lastDonationDate);
    const availabilityDate = new Date(lastDonation);
    availabilityDate.setDate(availabilityDate.getDate() + 100);

    return availabilityDate;
}

// Format phone number for WhatsApp
export function formatPhoneForWhatsApp(phoneNumber: string): string {
    // Remove all non-numeric characters
    let cleaned = phoneNumber.replace(/\D/g, "");

    // If starts with 0, replace with 62 (Indonesia country code)
    if (cleaned.startsWith("0")) {
        cleaned = "62" + cleaned.substring(1);
    }

    // If doesn't start with 62, add it
    if (!cleaned.startsWith("62")) {
        cleaned = "62" + cleaned;
    }

    return cleaned;
}

// Generate WhatsApp URL
export function generateWhatsAppURL(phoneNumber: string, message?: string): string {
    const formattedPhone = formatPhoneForWhatsApp(phoneNumber);
    const encodedMessage = message ? encodeURIComponent(message) : "";

    return `https://wa.me/${formattedPhone}${encodedMessage ? `?text=${encodedMessage}` : ""}`;
}

// Format date for display
export function formatDate(date: string | Date): string {
    const dateObj = typeof date === "string" ? new Date(date) : date;

    return dateObj.toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

// Format relative time (e.g., "2 days ago")
export function formatRelativeTime(date: string | Date): string {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    const now = new Date();
    const diffTime = now.getTime() - dateObj.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Hari ini";
    if (diffDays === 1) return "Kemarin";
    if (diffDays < 7) return `${diffDays} hari yang lalu`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} minggu yang lalu`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} bulan yang lalu`;

    return `${Math.floor(diffDays / 365)} tahun yang lalu`;
}

// Validate Indonesian phone number
export function isValidIndonesianPhone(phoneNumber: string): boolean {
    const cleaned = phoneNumber.replace(/\D/g, "");

    // Indonesian phone numbers typically:
    // - Start with 08 (mobile) or 021, 022, etc. (landline)
    // - Have 10-13 digits total
    // - Mobile: 08xx-xxxx-xxxx (11-12 digits)
    // - Landline: 0xx-xxxx-xxxx (10-11 digits)

    return /^(08|02[1-9]|0[3-9][0-9])[0-9]{7,10}$/.test(cleaned);
}

// Generate random ID for temporary use
export function generateTempId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Debounce function for search
export function debounce<T extends (...args: unknown[]) => unknown>(func: T, wait: number): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null;

    return (...args: Parameters<T>) => {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

// Format WhatsApp URL
export function formatWhatsAppUrl(phoneNumber: string, message: string = ""): string {
    // Clean phone number (remove non-digits)
    const cleanPhone = phoneNumber.replace(/\D/g, "");

    // Convert Indonesian phone format to international
    let internationalPhone = cleanPhone;
    if (cleanPhone.startsWith("08")) {
        internationalPhone = "62" + cleanPhone.substring(1);
    } else if (cleanPhone.startsWith("8")) {
        internationalPhone = "62" + cleanPhone;
    } else if (cleanPhone.startsWith("0")) {
        internationalPhone = "62" + cleanPhone.substring(1);
    }

    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);

    return `https://wa.me/${internationalPhone}${message ? `?text=${encodedMessage}` : ""}`;
}

// Get blood type compatibility
export function getBloodTypeCompatibility(bloodType: string, rhesus: string): string[] {
    const fullBloodType = `${bloodType}${rhesus === "Rh+" ? "+" : "-"}` as keyof typeof BLOOD_COMPATIBILITY;

    return BLOOD_COMPATIBILITY[fullBloodType]?.can_receive_from || [];
}

// Check if blood types are compatible
export function areBloodTypesCompatible(donorBloodType: string, donorRhesus: string, recipientBloodType: string, recipientRhesus: string): boolean {
    const donorFull = `${donorBloodType}${donorRhesus === "Rh+" ? "+" : "-"}`;
    const recipientFull = `${recipientBloodType}${recipientRhesus === "Rh+" ? "+" : "-"}` as keyof typeof BLOOD_COMPATIBILITY;

    const compatibility = BLOOD_COMPATIBILITY[recipientFull];
    return compatibility ? compatibility.can_receive_from.includes(donorFull as never) : false;
}
