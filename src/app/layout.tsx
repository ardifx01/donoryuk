import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "DonorYuk - Platform Digital Donor Darah Indonesia",
    description: "Platform digital yang menghubungkan pendonor darah dengan mereka yang membutuhkan. Temukan donor darah berdasarkan golongan darah, lokasi, dan ketersediaan secara real-time.",
    keywords: "donor darah, pendonor, golongan darah, kesehatan, indonesia, platform donor, donoryuk",
    authors: [{ name: "DonorYuk Team" }],
    openGraph: {
        title: "DonorYuk - Platform Digital Donor Darah Indonesia",
        description: "Platform digital yang menghubungkan pendonor darah dengan mereka yang membutuhkan.",
        type: "website",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="id">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <AuthProvider>{children}</AuthProvider>
            </body>
        </html>
    );
}
