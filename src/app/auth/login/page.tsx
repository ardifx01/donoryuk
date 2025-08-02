"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { ERROR_MESSAGES } from "@/lib/constants";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showResendConfirmation, setShowResendConfirmation] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [resendSuccess, setResendSuccess] = useState("");

    const { signIn, resendConfirmation } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await signIn(email, password);
            router.push("/dashboard");
        } catch (err: unknown) {
            const errorMessage = (err as Error).message || ERROR_MESSAGES.SERVER_ERROR;
            setError(errorMessage);

            // Show resend confirmation option if email not confirmed
            if (errorMessage.includes("Email belum dikonfirmasi")) {
                setShowResendConfirmation(true);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleResendConfirmation = async () => {
        setResendLoading(true);
        setResendSuccess("");
        setError("");

        try {
            await resendConfirmation(email);
            setResendSuccess("Email konfirmasi telah dikirim ulang. Silakan cek email Anda.");
            setShowResendConfirmation(false);
        } catch (err: unknown) {
            setError((err as Error).message || "Gagal mengirim ulang email konfirmasi");
        } finally {
            setResendLoading(false);
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
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Masuk ke Akun Anda</h2>
                    <p className="text-gray-600">
                        Belum punya akun?{" "}
                        <Link href="/auth/register" className="text-red-500 hover:text-red-600 font-semibold">
                            Daftar sekarang
                        </Link>
                    </p>
                </div>

                {/* Form */}
                <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">{error}</div>}
                        {resendSuccess && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl">{resendSuccess}</div>}

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
                                placeholder="Masukkan password"
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-red-500 focus:ring-red-500 border-gray-300 rounded" />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                                    Ingat saya
                                </label>
                            </div>

                            <div className="text-sm">
                                <Link href="/auth/forgot-password" className="text-red-500 hover:text-red-600 font-semibold">
                                    Lupa password?
                                </Link>
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
                                    <span>Masuk...</span>
                                </div>
                            ) : (
                                "Masuk"
                            )}
                        </button>

                        {showResendConfirmation && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                                <p className="text-yellow-800 text-sm mb-3">Email Anda belum dikonfirmasi. Klik tombol di bawah untuk mengirim ulang email konfirmasi.</p>
                                <button
                                    type="button"
                                    onClick={handleResendConfirmation}
                                    disabled={resendLoading}
                                    className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-300 text-white font-semibold py-2 px-4 rounded-xl transition-colors"
                                >
                                    {resendLoading ? (
                                        <div className="flex items-center justify-center space-x-2">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            <span>Mengirim...</span>
                                        </div>
                                    ) : (
                                        "Kirim Ulang Email Konfirmasi"
                                    )}
                                </button>
                            </div>
                        )}
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

                {/* Footer */}
                <div className="text-center text-sm text-gray-500">
                    <p>
                        Dengan masuk, Anda menyetujui{" "}
                        <Link href="/terms" className="text-red-500 hover:text-red-600">
                            Syarat & Ketentuan
                        </Link>{" "}
                        dan{" "}
                        <Link href="/privacy" className="text-red-500 hover:text-red-600">
                            Kebijakan Privasi
                        </Link>{" "}
                        kami.
                    </p>
                </div>
            </div>
        </div>
    );
}
