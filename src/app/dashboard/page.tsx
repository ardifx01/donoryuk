"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";

export default function DashboardPage() {
    const { user, donor, admin, loading, signOut } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/auth/login");
        }
    }, [user, loading, router]);

    const handleSignOut = async () => {
        try {
            await signOut();
            router.push("/");
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-soft flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-8 text-center">
                    <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Memuat dashboard...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return null; // Will redirect to login
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
                            <h1 className="text-2xl font-bold text-gray-800">DonorYuk</h1>
                        </Link>

                        <div className="flex items-center space-x-4">
                            <span className="text-gray-600">Halo, {user.email}</span>
                            <button onClick={handleSignOut} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-semibold transition-colors">
                                Keluar
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h2>
                    <p className="text-gray-600">Selamat datang di platform DonorYuk</p>
                </div>

                {/* User Status Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {/* User Info */}
                    <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-6">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                <span className="text-blue-500 text-xl">👤</span>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800">Status Akun</h3>
                                <p className="text-sm text-gray-600">Informasi akun Anda</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm">
                                <span className="font-medium">Email:</span> {user.email}
                            </p>
                            <p className="text-sm">
                                <span className="font-medium">Status:</span> <span className="text-green-600">Aktif</span>
                            </p>
                        </div>
                    </div>

                    {/* Donor Status */}
                    <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-6">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                                <span className="text-red-500 text-xl">🩸</span>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800">Status Pendonor</h3>
                                <p className="text-sm text-gray-600">Informasi donor Anda</p>
                            </div>
                        </div>
                        {donor ? (
                            <div className="space-y-2">
                                <p className="text-sm">
                                    <span className="font-medium">Nama:</span> {donor.name}
                                </p>
                                <p className="text-sm">
                                    <span className="font-medium">Golongan Darah:</span> {donor.blood_type}
                                    {donor.rhesus === "Rh+" ? "+" : "-"}
                                </p>
                                <p className="text-sm">
                                    <span className="font-medium">Lokasi:</span> {donor.location}
                                </p>
                                <p className="text-sm">
                                    <span className="font-medium">Status:</span>{" "}
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            donor.status === "active" ? "bg-green-100 text-green-800" : donor.status === "unavailable" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"
                                        }`}
                                    >
                                        {donor.status === "active" ? "Aktif" : donor.status === "unavailable" ? "Tidak Tersedia" : "Menunggu Verifikasi"}
                                    </span>
                                </p>
                            </div>
                        ) : (
                            <div className="text-center py-4">
                                <p className="text-gray-500 mb-3">Anda belum terdaftar sebagai pendonor</p>
                                <Link href="/register-donor" className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
                                    Daftar Sebagai Pendonor
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Admin Status */}
                    {admin && (
                        <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-6">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                    <span className="text-purple-500 text-xl">👑</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800">Status Admin</h3>
                                    <p className="text-sm text-gray-600">Akses administrator</p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm">
                                    <span className="font-medium">Nama:</span> {admin.name}
                                </p>
                                <p className="text-sm">
                                    <span className="font-medium">Role:</span> Administrator
                                </p>
                                <Link href="/admin" className="inline-block bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors mt-3">
                                    Buka Admin Panel
                                </Link>
                            </div>
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Aksi Cepat</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Link href="/search" className="flex items-center space-x-3 p-4 border border-gray-200 rounded-xl hover:border-red-200 hover:bg-red-50 transition-colors">
                            <span className="text-2xl">🔍</span>
                            <div>
                                <p className="font-medium text-gray-800">Cari Donor</p>
                                <p className="text-sm text-gray-600">Temukan pendonor</p>
                            </div>
                        </Link>

                        {!donor && (
                            <Link href="/register-donor" className="flex items-center space-x-3 p-4 border border-gray-200 rounded-xl hover:border-red-200 hover:bg-red-50 transition-colors">
                                <span className="text-2xl">📝</span>
                                <div>
                                    <p className="font-medium text-gray-800">Daftar Donor</p>
                                    <p className="text-sm text-gray-600">Jadi pendonor</p>
                                </div>
                            </Link>
                        )}

                        <Link href="/profile" className="flex items-center space-x-3 p-4 border border-gray-200 rounded-xl hover:border-red-200 hover:bg-red-50 transition-colors">
                            <span className="text-2xl">⚙️</span>
                            <div>
                                <p className="font-medium text-gray-800">Pengaturan</p>
                                <p className="text-sm text-gray-600">Edit profil</p>
                            </div>
                        </Link>

                        <Link href="/" className="flex items-center space-x-3 p-4 border border-gray-200 rounded-xl hover:border-red-200 hover:bg-red-50 transition-colors">
                            <span className="text-2xl">🏠</span>
                            <div>
                                <p className="font-medium text-gray-800">Beranda</p>
                                <p className="text-sm text-gray-600">Kembali ke home</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
