"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase-client";

function AuthCallbackContent() {
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const handleAuthCallback = async () => {
            try {
                const supabase = createClient();

                // Get the code from URL parameters
                const code = searchParams.get("code");

                if (code) {
                    // Exchange the code for a session
                    const { error } = await supabase.auth.exchangeCodeForSession(code);

                    if (error) {
                        throw error;
                    }

                    // Show success message
                    setSuccess(true);

                    // Redirect after showing success message
                    setTimeout(() => {
                        const redirectTo = searchParams.get("redirect_to") || "/dashboard";
                        router.push(redirectTo);
                    }, 2000);
                } else {
                    // No code found, redirect to login
                    router.push("/auth/login");
                }
            } catch (err: unknown) {
                console.error("Auth callback error:", err);
                setError((err as Error).message || "Terjadi kesalahan saat memproses autentikasi");
            }
        };

        handleAuthCallback();
    }, [router, searchParams]);

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-soft flex items-center justify-center py-12 px-4">
                <div className="max-w-md w-full">
                    <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-8 text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-red-500 text-2xl">⚠️</span>
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">Autentikasi Gagal</h2>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <button onClick={() => router.push("/auth/login")} className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-xl transition-colors">
                            Kembali ke Login
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen bg-gradient-soft flex items-center justify-center py-12 px-4">
                <div className="max-w-md w-full">
                    <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-8 text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-green-500 text-2xl">✅</span>
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">Email Berhasil Dikonfirmasi!</h2>
                        <p className="text-gray-600 mb-4">Anda akan dialihkan ke dashboard dalam beberapa detik...</p>
                        <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-soft flex items-center justify-center py-12 px-4">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-8 text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Memproses Autentikasi</h2>
                    <p className="text-gray-600">Mohon tunggu sebentar...</p>
                </div>
            </div>
        </div>
    );
}

function LoadingFallback() {
    return (
        <div className="min-h-screen bg-gradient-soft flex items-center justify-center py-12 px-4">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-8 text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Memuat...</h2>
                    <p className="text-gray-600">Mohon tunggu sebentar...</p>
                </div>
            </div>
        </div>
    );
}

export default function AuthCallbackPage() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <AuthCallbackContent />
        </Suspense>
    );
}
