"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function AuthButtons() {
    const { user, loading, admin } = useAuth();

    if (loading) {
        return (
            <div className="flex space-x-3">
                <div className="bg-gray-200 animate-pulse px-5 py-2.5 rounded-xl w-24 h-10"></div>
                <div className="bg-gray-200 animate-pulse px-5 py-2.5 rounded-xl w-24 h-10"></div>
            </div>
        );
    }

    if (user) {
        return (
            <div className="flex space-x-3">
                {admin ? (
                    <Link
                        href="/admin"
                        className="bg-purple-500 hover:bg-purple-600 text-white px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                        Admin Panel
                    </Link>
                ) : (
                    <Link
                        href="/dashboard"
                        className="bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                        Dashboard
                    </Link>
                )}
                <Link
                    href="/search"
                    className="border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 hover:shadow-md transform hover:-translate-y-0.5"
                >
                    Cari Donor
                </Link>
            </div>
        );
    }

    return (
        <div className="flex space-x-3">
            <Link
                href="/auth/register"
                className="bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
                Daftar Donor
            </Link>
            <Link
                href="/search"
                className="border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 hover:shadow-md transform hover:-translate-y-0.5"
            >
                Cari Donor
            </Link>
        </div>
    );
}
