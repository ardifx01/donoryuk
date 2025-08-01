"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { ERROR_MESSAGES } from "@/lib/constants";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const { signUp } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        // Validation
        if (password !== confirmPassword) {
            setError("Password dan konfirmasi password tidak cocok");
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError("Password minimal 6 karakter");
            setLoading(false);
            return;
        }

        try {
            await signUp(email, password);
            setSuccess("Akun berhasil dibuat! Silakan cek email untuk verifikasi.");

            // Redirect after 3 seconds
            setTimeout(() => {
                router.push("/auth/login");
            }, 3000);
        } catch (err: unknown) {
            setError((err as Error).message || ERROR_MESSAGES.SERVER_ERROR);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-soft flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <Link href="/" className="inline-flex items-center space-x-3 mb-8">
                        <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-red-500 rounded-xl flex items-center justify-center shadow-md">
                            <span className="text-white font-bold text-xl">🩸</span>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800">DonorYuk</h1>
                    </Link>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Buat Akun Baru</h2>
                    <p className="text-gray-600">
                        Sudah punya akun?{" "}
                        <Link href="/auth/login" className="text-red-500 hover:text-red-600 font-semibold">
                            Masuk sekarang
                        </Link>
                    </p>
                </div>

                {/* Form */}
                <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">{error}</div>}

                        {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl">{success}</div>}

                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                                placeholder="nama@email.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                                placeholder="Minimal 6 karakter"
                            />
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                                Konfirmasi Password
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                                placeholder="Ulangi password"
                            />
                        </div>

                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <input id="terms" name="terms" type="checkbox" required className="h-4 w-4 text-red-500 focus:ring-red-500 border-gray-300 rounded" />
                            </div>
                            <div className="ml-3 text-sm">
                                <label htmlFor="terms" className="text-gray-700">
                                    Saya menyetujui{" "}
                                    <Link href="/terms" className="text-red-500 hover:text-red-600 font-semibold">
                                        Syarat & Ketentuan
                                    </Link>{" "}
                                    dan{" "}
                                    <Link href="/privacy" className="text-red-500 hover:text-red-600 font-semibold">
                                        Kebijakan Privasi
                                    </Link>
                                </label>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:transform-none"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center space-x-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Mendaftar...</span>
                                </div>
                            ) : (
                                "Daftar Akun"
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Atau</span>
                            </div>
                        </div>
                    </div>

                    {/* Back to Home */}
                    <div className="mt-6 text-center">
                        <Link href="/" className="text-gray-600 hover:text-red-500 font-medium transition-colors">
                            ← Kembali ke Beranda
                        </Link>
                    </div>
                </div>

                {/* Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                            <span className="text-blue-500 text-lg">ℹ️</span>
                        </div>
                        <div className="text-sm text-blue-700">
                            <p className="font-semibold mb-1">Langkah selanjutnya:</p>
                            <ol className="list-decimal list-inside space-y-1">
                                <li>Verifikasi email Anda</li>
                                <li>Login ke akun</li>
                                <li>Lengkapi profil sebagai pendonor</li>
                                <li>Upload kartu donor untuk verifikasi</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
