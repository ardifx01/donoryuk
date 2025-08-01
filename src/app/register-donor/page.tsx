"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase-client";
import { BLOOD_TYPES, RHESUS_TYPES, INDONESIAN_CITIES, ERROR_MESSAGES } from "@/lib/constants";
import { isValidIndonesianPhone } from "@/lib/utils";

export default function RegisterDonorPage() {
    const [formData, setFormData] = useState({
        name: "",
        blood_type: "",
        rhesus: "",
        location: "",
        phone_number: "",
        notes: "",
    });
    const [donorCard, setDonorCard] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const { user } = useAuth();
    const router = useRouter();
    const supabase = createClient();

    // Redirect if not authenticated
    if (!user) {
        router.push("/auth/login");
        return null;
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith("image/")) {
                setError("File harus berupa gambar (JPG, PNG, dll)");
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setError("Ukuran file maksimal 5MB");
                return;
            }

            setDonorCard(file);
            setError("");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            // Validation
            if (!formData.name.trim()) {
                throw new Error("Nama lengkap wajib diisi");
            }

            if (!formData.blood_type || !formData.rhesus) {
                throw new Error("Golongan darah dan rhesus wajib dipilih");
            }

            if (!formData.location) {
                throw new Error("Lokasi wajib dipilih");
            }

            if (!formData.phone_number.trim()) {
                throw new Error("Nomor HP wajib diisi");
            }

            if (!isValidIndonesianPhone(formData.phone_number)) {
                throw new Error("Format nomor HP tidak valid");
            }

            if (!donorCard) {
                throw new Error("Kartu donor wajib diupload");
            }

            // Upload donor card to Supabase Storage
            const fileExt = donorCard.name.split(".").pop();
            const fileName = `${user.id}-${Date.now()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage.from("donor-cards").upload(fileName, donorCard);

            if (uploadError) {
                throw new Error("Gagal mengupload kartu donor: " + uploadError.message);
            }

            // Get public URL for the uploaded file
            const {
                data: { publicUrl },
            } = supabase.storage.from("donor-cards").getPublicUrl(fileName);

            // Insert donor data
            const { error: donorError } = await supabase.from("donors").insert({
                name: formData.name.trim(),
                blood_type: formData.blood_type,
                rhesus: formData.rhesus,
                location: formData.location,
                phone_number: formData.phone_number.trim(),
                notes: formData.notes.trim() || null,
                status: "pending_verification",
                user_id: user.id,
            });

            if (donorError) {
                throw new Error("Gagal menyimpan data donor: " + donorError.message);
            }

            // Get the created donor ID
            const { data: donorData } = await supabase.from("donors").select("id").eq("user_id", user.id).single();

            if (donorData) {
                // Insert verification record
                const { error: verificationError } = await supabase.from("verifications").insert({
                    donor_id: donorData.id,
                    donor_card_url: publicUrl,
                    verified: false,
                });

                if (verificationError) {
                    throw new Error("Gagal menyimpan data verifikasi: " + verificationError.message);
                }
            }

            setSuccess("Pendaftaran berhasil! Data Anda akan diverifikasi oleh admin dalam 1-2 hari kerja.");

            // Redirect to dashboard after 3 seconds
            setTimeout(() => {
                router.push("/dashboard");
            }, 3000);
        } catch (err: unknown) {
            setError((err as Error).message || ERROR_MESSAGES.SERVER_ERROR);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-soft">
            {/* Header */}
            <header className="bg-white/95 backdrop-blur-sm border-b border-red-100 sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <Link href="/" className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-red-500 rounded-xl flex items-center justify-center shadow-md">
                                <span className="text-white font-bold text-lg">🩸</span>
                            </div>
                            <h1 className="text-2xl font-bold text-gray-800">DonorYuk</h1>
                        </Link>

                        <div className="flex items-center space-x-4">
                            <Link href="/dashboard" className="text-gray-600 hover:text-red-500 font-medium">
                                Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Daftar Sebagai Pendonor</h2>
                    <p className="text-gray-600">Lengkapi data diri Anda untuk bergabung sebagai pendonor darah</p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">{error}</div>}

                        {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl">{success}</div>}

                        {/* Personal Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Nama Lengkap *
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                                    placeholder="Masukkan nama lengkap"
                                />
                            </div>

                            <div>
                                <label htmlFor="phone_number" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Nomor HP *
                                </label>
                                <input
                                    id="phone_number"
                                    name="phone_number"
                                    type="tel"
                                    required
                                    value={formData.phone_number}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                                    placeholder="08xxxxxxxxxx"
                                />
                            </div>
                        </div>

                        {/* Blood Type Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="blood_type" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Golongan Darah *
                                </label>
                                <select
                                    id="blood_type"
                                    name="blood_type"
                                    required
                                    value={formData.blood_type}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                                >
                                    <option value="">Pilih Golongan Darah</option>
                                    {BLOOD_TYPES.map((type) => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="rhesus" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Rhesus *
                                </label>
                                <select
                                    id="rhesus"
                                    name="rhesus"
                                    required
                                    value={formData.rhesus}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                                >
                                    <option value="">Pilih Rhesus</option>
                                    {RHESUS_TYPES.map((type) => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Location */}
                        <div>
                            <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-2">
                                Lokasi (Kota/Kabupaten) *
                            </label>
                            <select
                                id="location"
                                name="location"
                                required
                                value={formData.location}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                            >
                                <option value="">Pilih Kota/Kabupaten</option>
                                {INDONESIAN_CITIES.map((city) => (
                                    <option key={city} value={city}>
                                        {city}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Donor Card Upload */}
                        <div>
                            <label htmlFor="donor_card" className="block text-sm font-semibold text-gray-700 mb-2">
                                Upload Kartu Donor *
                            </label>
                            <input
                                id="donor_card"
                                name="donor_card"
                                type="file"
                                accept="image/*"
                                required
                                onChange={handleFileChange}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                            />
                            <p className="text-sm text-gray-500 mt-2">Upload foto kartu donor Anda. Format: JPG, PNG. Maksimal 5MB.</p>
                        </div>

                        {/* Notes */}
                        <div>
                            <label htmlFor="notes" className="block text-sm font-semibold text-gray-700 mb-2">
                                Catatan Tambahan (Opsional)
                            </label>
                            <textarea
                                id="notes"
                                name="notes"
                                rows={3}
                                value={formData.notes}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                                placeholder="Riwayat penyakit, alergi, atau informasi penting lainnya..."
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="flex items-center justify-between pt-6">
                            <Link href="/dashboard" className="text-gray-600 hover:text-red-500 font-medium transition-colors">
                                ← Kembali ke Dashboard
                            </Link>

                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:transform-none"
                            >
                                {loading ? (
                                    <div className="flex items-center space-x-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Mendaftar...</span>
                                    </div>
                                ) : (
                                    "Daftar Sebagai Pendonor"
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Info Box */}
                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                            <span className="text-blue-500 text-xl">ℹ️</span>
                        </div>
                        <div className="text-sm text-blue-700">
                            <p className="font-semibold mb-2">Proses Verifikasi:</p>
                            <ol className="list-decimal list-inside space-y-1">
                                <li>Data Anda akan direview oleh admin dalam 1-2 hari kerja</li>
                                <li>Admin akan memverifikasi kartu donor yang Anda upload</li>
                                <li>Setelah disetujui, status Anda akan berubah menjadi &quot;Aktif&quot;</li>
                                <li>Anda akan muncul dalam pencarian donor dan dapat dihubungi</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
