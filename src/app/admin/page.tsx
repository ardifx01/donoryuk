"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase-client";
import { DONOR_STATUS_LABELS, DONOR_STATUS_COLORS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import type { Donor, Verification } from "@/types/database";

interface DonorWithVerification extends Donor {
    verifications?: Verification[];
}

export default function AdminDashboardPage() {
    const [donors, setDonors] = useState<DonorWithVerification[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filter, setFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");

    const { user, admin } = useAuth();
    const supabase = createClient();

    // Redirect if not admin
    useEffect(() => {
        if (!loading && (!user || !admin)) {
            window.location.href = "/auth/login";
        }
    }, [user, admin, loading]);

    useEffect(() => {
        if (user && admin) {
            fetchDonors();
        }
    }, [user, admin]);

    const fetchDonors = async () => {
        try {
            const { data, error } = await supabase
                .from("donors")
                .select(
                    `
          *,
          verifications (*)
        `
                )
                .order("created_at", { ascending: false });

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

    const updateDonorStatus = async (donorId: string, newStatus: string) => {
        try {
            const { error } = await supabase
                .from("donors")
                .update({
                    status: newStatus,
                    ...(newStatus === "unavailable" ? { last_donation_date: new Date().toISOString() } : {}),
                })
                .eq("id", donorId);

            if (error) {
                throw error;
            }

            // Refresh data
            await fetchDonors();
        } catch (err: unknown) {
            alert((err as Error).message || "Gagal mengupdate status donor");
        }
    };

    const verifyDonor = async (verificationId: string, approved: boolean) => {
        try {
            // Update verification status
            const { error: verificationError } = await supabase
                .from("verifications")
                .update({
                    verified: approved,
                    verified_at: new Date().toISOString(),
                    admin_id: admin?.id,
                })
                .eq("id", verificationId);

            if (verificationError) {
                throw verificationError;
            }

            // If approved, update donor status to active
            if (approved) {
                const verification = donors.flatMap((d) => d.verifications || []).find((v) => v.id === verificationId);

                if (verification) {
                    await updateDonorStatus(verification.donor_id, "active");
                }
            }

            // Refresh data
            await fetchDonors();
        } catch (err: unknown) {
            alert((err as Error).message || "Gagal memverifikasi donor");
        }
    };

    const filteredDonors = donors.filter((donor) => {
        const matchesFilter = filter === "all" || donor.status === filter;
        const matchesSearch = donor.name.toLowerCase().includes(searchTerm.toLowerCase()) || donor.location.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const getStatusColor = (status: string) => {
        const colorMap = {
            active: "bg-green-100 text-green-800",
            unavailable: "bg-red-100 text-red-800",
            pending_verification: "bg-yellow-100 text-yellow-800",
        };
        return colorMap[status as keyof typeof colorMap] || "bg-gray-100 text-gray-800";
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-soft flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Memuat dashboard admin...</p>
                </div>
            </div>
        );
    }

    if (!user || !admin) {
        return null;
    }

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
                            <h1 className="text-2xl font-bold text-gray-800">DonorYuk Admin</h1>
                        </Link>

                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-600">Halo, {admin.name}</span>
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
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Dashboard Admin</h2>
                    <p className="text-gray-600">Kelola pendonor dan verifikasi kartu donor</p>
                </div>

                {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">{error}</div>}

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-red-100">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <span className="text-green-600 text-xl">✅</span>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Donor Aktif</p>
                                <p className="text-2xl font-bold text-gray-900">{donors.filter((d) => d.status === "active").length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-red-100">
                        <div className="flex items-center">
                            <div className="p-2 bg-yellow-100 rounded-lg">
                                <span className="text-yellow-600 text-xl">⏳</span>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Menunggu Verifikasi</p>
                                <p className="text-2xl font-bold text-gray-900">{donors.filter((d) => d.status === "pending_verification").length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-red-100">
                        <div className="flex items-center">
                            <div className="p-2 bg-red-100 rounded-lg">
                                <span className="text-red-600 text-xl">❌</span>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Tidak Tersedia</p>
                                <p className="text-2xl font-bold text-gray-900">{donors.filter((d) => d.status === "unavailable").length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-red-100">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <span className="text-blue-600 text-xl">👥</span>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Donor</p>
                                <p className="text-2xl font-bold text-gray-900">{donors.length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-sm border border-red-100 p-6 mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                        <div className="flex space-x-4">
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            >
                                <option value="all">Semua Status</option>
                                <option value="active">Aktif</option>
                                <option value="pending_verification">Menunggu Verifikasi</option>
                                <option value="unavailable">Tidak Tersedia</option>
                            </select>
                        </div>

                        <div className="flex-1 max-w-md">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Cari nama atau lokasi..."
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Donors Table */}
                <div className="bg-white rounded-xl shadow-sm border border-red-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Donor</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Golongan Darah</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lokasi</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Daftar</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredDonors.map((donor) => (
                                    <tr key={donor.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{donor.name}</div>
                                                <div className="text-sm text-gray-500">{donor.phone_number}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                {donor.blood_type}
                                                {donor.rhesus === "Rh+" ? "+" : "-"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{donor.location}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(donor.status)}`}>
                                                {DONOR_STATUS_LABELS[donor.status as keyof typeof DONOR_STATUS_LABELS]}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(donor.created_at)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                            {donor.status === "pending_verification" && donor.verifications && donor.verifications.length > 0 && (
                                                <div className="flex space-x-2">
                                                    <button onClick={() => verifyDonor(donor.verifications![0].id, true)} className="text-green-600 hover:text-green-900">
                                                        Setujui
                                                    </button>
                                                    <button onClick={() => verifyDonor(donor.verifications![0].id, false)} className="text-red-600 hover:text-red-900">
                                                        Tolak
                                                    </button>
                                                </div>
                                            )}

                                            {donor.status === "active" && (
                                                <button onClick={() => updateDonorStatus(donor.id, "unavailable")} className="text-red-600 hover:text-red-900">
                                                    Tandai Donor
                                                </button>
                                            )}

                                            {donor.status === "unavailable" && (
                                                <button onClick={() => updateDonorStatus(donor.id, "active")} className="text-green-600 hover:text-green-900">
                                                    Aktifkan
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredDonors.length === 0 && (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-gray-400 text-2xl">👥</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Tidak Ada Data</h3>
                            <p className="text-gray-600">Belum ada donor yang terdaftar atau sesuai filter</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
