"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase-client";
import { BLOOD_TYPES, RHESUS_TYPES, INDONESIAN_CITIES } from "@/lib/constants";
import { formatWhatsAppUrl, getBloodTypeCompatibility } from "@/lib/utils";
import type { Donor } from "@/types/database";

export default function SearchPage() {
    const [donors, setDonors] = useState<Donor[]>([]);
    const [filteredDonors, setFilteredDonors] = useState<Donor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Filter states
    const [filters, setFilters] = useState({
        blood_type: "",
        rhesus: "",
        location: "",
        search: "",
    });

    const supabase = createClient();

    useEffect(() => {
        fetchDonors();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        applyFilters();
    }, [donors, filters]); // eslint-disable-line react-hooks/exhaustive-deps

    const fetchDonors = async () => {
        try {
            const { data, error } = await supabase.from("donors").select("*").eq("status", "active").order("created_at", { ascending: false });

            if (error) {
                throw error;
            }

            setDonors(data || []);
        } catch (err: unknown) {
            setError((err as Error).message || "Gagal memuat data donor");
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...donors];

        // Filter by blood type
        if (filters.blood_type) {
            filtered = filtered.filter((donor) => donor.blood_type === filters.blood_type);
        }

        // Filter by rhesus
        if (filters.rhesus) {
            filtered = filtered.filter((donor) => donor.rhesus === filters.rhesus);
        }

        // Filter by location
        if (filters.location) {
            filtered = filtered.filter((donor) => donor.location === filters.location);
        }

        // Filter by search term (name)
        if (filters.search) {
            filtered = filtered.filter((donor) => donor.name.toLowerCase().includes(filters.search.toLowerCase()));
        }

        setFilteredDonors(filtered);
    };

    const handleFilterChange = (key: string, value: string) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const clearFilters = () => {
        setFilters({
            blood_type: "",
            rhesus: "",
            location: "",
            search: "",
        });
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
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Cari Pendonor Darah</h2>
                    <p className="text-gray-600">Temukan pendonor darah yang sesuai dengan kebutuhan Anda</p>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Golongan Darah</label>
                            <select
                                value={filters.blood_type}
                                onChange={(e) => handleFilterChange("blood_type", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            >
                                <option value="">Semua</option>
                                {BLOOD_TYPES.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Rhesus</label>
                            <select
                                value={filters.rhesus}
                                onChange={(e) => handleFilterChange("rhesus", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            >
                                <option value="">Semua</option>
                                {RHESUS_TYPES.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Lokasi</label>
                            <select
                                value={filters.location}
                                onChange={(e) => handleFilterChange("location", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            >
                                <option value="">Semua</option>
                                {INDONESIAN_CITIES.map((city) => (
                                    <option key={city} value={city}>
                                        {city}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Cari Nama</label>
                            <input
                                type="text"
                                value={filters.search}
                                onChange={(e) => handleFilterChange("search", e.target.value)}
                                placeholder="Nama pendonor..."
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            />
                        </div>
                    </div>

                    <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-600">
                            Menampilkan {filteredDonors.length} dari {donors.length} pendonor
                        </p>
                        <button onClick={clearFilters} className="text-red-500 hover:text-red-600 font-medium text-sm">
                            Reset Filter
                        </button>
                    </div>
                </div>

                {/* Results */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600">Memuat data pendonor...</p>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-center">{error}</div>
                ) : filteredDonors.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-gray-400 text-2xl">🔍</span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Tidak Ada Pendonor Ditemukan</h3>
                        <p className="text-gray-600 mb-4">Coba ubah filter pencarian atau coba lagi nanti</p>
                        <button onClick={clearFilters} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-semibold transition-colors">
                            Reset Filter
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredDonors.map((donor) => (
                            <div key={donor.id} className="bg-white rounded-2xl shadow-sm border border-red-100 p-6 hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-800 mb-1">{donor.name}</h3>
                                        <p className="text-gray-600 text-sm">{donor.location}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                                            {donor.blood_type}
                                            {donor.rhesus === "Rh+" ? "+" : "-"}
                                        </div>
                                    </div>
                                </div>

                                {donor.notes && (
                                    <div className="mb-4">
                                        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{donor.notes}</p>
                                    </div>
                                )}

                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-gray-500">
                                        <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                        Tersedia
                                    </div>

                                    <a
                                        href={formatWhatsAppUrl(
                                            donor.phone_number,
                                            `Halo ${donor.name}, saya membutuhkan donor darah ${donor.blood_type}${donor.rhesus === "Rh+" ? "+" : "-"}. Apakah Anda bersedia membantu?`
                                        )}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl font-semibold transition-colors flex items-center space-x-2"
                                    >
                                        <span>💬</span>
                                        <span>WhatsApp</span>
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Info Box */}
                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                            <span className="text-blue-500 text-xl">💡</span>
                        </div>
                        <div className="text-sm text-blue-700">
                            <p className="font-semibold mb-2">Tips Mencari Donor:</p>
                            <ul className="list-disc list-inside space-y-1">
                                <li>Pastikan golongan darah kompatibel dengan kebutuhan Anda</li>
                                <li>Hubungi pendonor dengan sopan dan jelaskan situasi Anda</li>
                                <li>Berikan informasi lokasi dan waktu yang dibutuhkan</li>
                                <li>Selalu konfirmasi ketersediaan sebelum membuat janji</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
