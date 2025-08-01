import Link from "next/link";
import AuthButtons from "@/components/AuthButtons";

export default function Home() {
    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="bg-white/95 backdrop-blur-sm border-b border-red-100 sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-red-500 rounded-xl flex items-center justify-center shadow-md">
                                <span className="text-white font-bold text-lg">🩸</span>
                            </div>
                            <h1 className="text-2xl font-bold text-gray-800">DonorYuk</h1>
                        </div>
                        <nav className="hidden md:flex space-x-8">
                            <Link href="#tentang" className="text-gray-600 hover:text-red-500 transition-colors font-medium">
                                Tentang
                            </Link>
                            <Link href="#fitur" className="text-gray-600 hover:text-red-500 transition-colors font-medium">
                                Fitur
                            </Link>
                            <Link href="#cara-kerja" className="text-gray-600 hover:text-red-500 transition-colors font-medium">
                                Cara Kerja
                            </Link>
                        </nav>
                        <AuthButtons />
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-soft">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="mb-8">
                        <span className="inline-block bg-red-100 text-red-600 px-4 py-2 rounded-full text-sm font-semibold mb-6">Platform Donor Darah Terpercaya</span>
                    </div>
                    <h2 className="text-5xl md:text-7xl font-bold text-gray-800 mb-6 leading-tight">
                        Menghubungkan
                        <span className="text-red-500"> Pendonor </span>
                        dengan
                        <span className="text-red-500"> Penerima</span>
                    </h2>
                    <p className="text-xl text-gray-600 mb-10 max-w-4xl mx-auto leading-relaxed">
                        Platform digital yang memudahkan pencarian donor darah berdasarkan golongan darah, lokasi, dan ketersediaan secara real-time. Bergabunglah dalam komunitas penyelamat nyawa.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                            Mulai Sekarang
                        </button>
                        <button className="border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
                            Pelajari Lebih Lanjut
                        </button>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div className="bg-red-50 p-8 rounded-2xl border border-red-100">
                            <div className="text-5xl font-bold text-red-500 mb-3">100+</div>
                            <div className="text-gray-600 font-medium">Pendonor Terdaftar</div>
                        </div>
                        <div className="bg-red-50 p-8 rounded-2xl border border-red-100">
                            <div className="text-5xl font-bold text-red-500 mb-3">50+</div>
                            <div className="text-gray-600 font-medium">Nyawa Terselamatkan</div>
                        </div>
                        <div className="bg-red-50 p-8 rounded-2xl border border-red-100">
                            <div className="text-5xl font-bold text-red-500 mb-3">24/7</div>
                            <div className="text-gray-600 font-medium">Layanan Tersedia</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Problem & Solution Section */}
            <section id="tentang" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h3 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">Mengapa DonorYuk?</h3>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">Kami memahami tantangan dalam mencari donor darah yang tepat waktu dan sesuai kebutuhan</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <h4 className="text-2xl font-bold text-gray-800 mb-6">Masalah yang Kami Selesaikan:</h4>
                            <div className="space-y-4">
                                <div className="flex items-start space-x-4">
                                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                        <span className="text-red-500 text-sm font-bold">✗</span>
                                    </div>
                                    <p className="text-gray-600">Sulitnya mencari pendonor darah yang cocok dalam waktu singkat</p>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                        <span className="text-red-500 text-sm font-bold">✗</span>
                                    </div>
                                    <p className="text-gray-600">Tidak ada sistem pencatatan yang rapi dan real-time</p>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                        <span className="text-red-500 text-sm font-bold">✗</span>
                                    </div>
                                    <p className="text-gray-600">Kurangnya transparansi dan verifikasi informasi pendonor</p>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                        <span className="text-red-500 text-sm font-bold">✗</span>
                                    </div>
                                    <p className="text-gray-600">Tidak ada media komunikasi langsung antara pendonor dan penerima</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <h4 className="text-2xl font-bold text-gray-800 mb-6">Solusi Kami:</h4>
                            <div className="space-y-4">
                                <div className="flex items-start space-x-4">
                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                        <span className="text-green-600 text-sm font-bold">✓</span>
                                    </div>
                                    <p className="text-gray-600">Direktori pendonor berdasarkan lokasi, golongan darah, dan ketersediaan</p>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                        <span className="text-green-600 text-sm font-bold">✓</span>
                                    </div>
                                    <p className="text-gray-600">Sistem verifikasi pendonor dengan upload kartu donor</p>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                        <span className="text-green-600 text-sm font-bold">✓</span>
                                    </div>
                                    <p className="text-gray-600">Logika otomatis cooldown 100 hari setelah donor terakhir</p>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                        <span className="text-green-600 text-sm font-bold">✓</span>
                                    </div>
                                    <p className="text-gray-600">Kontak langsung via WhatsApp untuk komunikasi cepat</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="fitur" className="py-20 bg-white px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h3 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">Fitur Utama Platform</h3>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">Semua yang Anda butuhkan untuk mendonor atau mencari donor darah dalam satu platform</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="bg-white border border-red-100 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                            <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center mb-6">
                                <span className="text-red-500 text-2xl">📝</span>
                            </div>
                            <h4 className="text-xl font-semibold text-gray-800 mb-4">Registrasi Mudah</h4>
                            <p className="text-gray-600 leading-relaxed">Daftar sebagai pendonor dengan formulir lengkap termasuk golongan darah, lokasi, dan upload kartu donor untuk verifikasi.</p>
                        </div>

                        <div className="bg-white border border-red-100 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                            <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center mb-6">
                                <span className="text-red-500 text-2xl">🔍</span>
                            </div>
                            <h4 className="text-xl font-semibold text-gray-800 mb-4">Pencarian Cerdas</h4>
                            <p className="text-gray-600 leading-relaxed">Cari pendonor berdasarkan golongan darah, lokasi, dan status ketersediaan dengan filter yang akurat.</p>
                        </div>

                        <div className="bg-white border border-red-100 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                            <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center mb-6">
                                <span className="text-red-500 text-2xl">✅</span>
                            </div>
                            <h4 className="text-xl font-semibold text-gray-800 mb-4">Verifikasi Terpercaya</h4>
                            <p className="text-gray-600 leading-relaxed">Sistem verifikasi admin memastikan semua pendonor telah tervalidasi dengan kartu donor resmi.</p>
                        </div>

                        <div className="bg-white border border-red-100 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                            <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center mb-6">
                                <span className="text-red-500 text-2xl">⏰</span>
                            </div>
                            <h4 className="text-xl font-semibold text-gray-800 mb-4">Cooldown Otomatis</h4>
                            <p className="text-gray-600 leading-relaxed">Sistem otomatis mengelola periode cooldown 100 hari setelah donor terakhir untuk keamanan pendonor.</p>
                        </div>

                        <div className="bg-white border border-red-100 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                            <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center mb-6">
                                <span className="text-red-500 text-2xl">💬</span>
                            </div>
                            <h4 className="text-xl font-semibold text-gray-800 mb-4">Kontak Langsung</h4>
                            <p className="text-gray-600 leading-relaxed">Hubungi pendonor langsung melalui WhatsApp untuk koordinasi yang cepat dan efisien.</p>
                        </div>

                        <div className="bg-white border border-red-100 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                            <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center mb-6">
                                <span className="text-red-500 text-2xl">📊</span>
                            </div>
                            <h4 className="text-xl font-semibold text-gray-800 mb-4">Dashboard Admin</h4>
                            <p className="text-gray-600 leading-relaxed">Panel admin lengkap untuk mengelola verifikasi, status pendonor, dan monitoring aktivitas platform.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="cara-kerja" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h3 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">Cara Kerja Platform</h3>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">Proses sederhana untuk menjadi pendonor atau mencari donor darah</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        {/* For Donors */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <h4 className="text-2xl font-bold text-red-500 mb-8 text-center">Untuk Pendonor</h4>
                            <div className="space-y-6">
                                <div className="flex items-start space-x-4">
                                    <div className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">1</div>
                                    <div>
                                        <h5 className="font-semibold text-gray-800 mb-2">Daftar Akun</h5>
                                        <p className="text-gray-600">Buat akun dengan informasi lengkap termasuk golongan darah dan lokasi</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <div className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">2</div>
                                    <div>
                                        <h5 className="font-semibold text-gray-800 mb-2">Upload Kartu Donor</h5>
                                        <p className="text-gray-600">Upload foto kartu donor untuk proses verifikasi admin</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <div className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">3</div>
                                    <div>
                                        <h5 className="font-semibold text-gray-800 mb-2">Menunggu Verifikasi</h5>
                                        <p className="text-gray-600">Admin akan memverifikasi kartu donor dan mengaktifkan akun Anda</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <div className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">4</div>
                                    <div>
                                        <h5 className="font-semibold text-gray-800 mb-2">Siap Membantu</h5>
                                        <p className="text-gray-600">Profil Anda akan muncul dalam pencarian dan dapat dihubungi langsung</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* For Recipients */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <h4 className="text-2xl font-bold text-red-500 mb-8 text-center">Untuk Pencari Donor</h4>
                            <div className="space-y-6">
                                <div className="flex items-start space-x-4">
                                    <div className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">1</div>
                                    <div>
                                        <h5 className="font-semibold text-gray-800 mb-2">Cari Pendonor</h5>
                                        <p className="text-gray-600">Gunakan filter golongan darah dan lokasi untuk menemukan pendonor</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <div className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">2</div>
                                    <div>
                                        <h5 className="font-semibold text-gray-800 mb-2">Lihat Status</h5>
                                        <p className="text-gray-600">Periksa status ketersediaan pendonor (aktif/tidak tersedia)</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <div className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">3</div>
                                    <div>
                                        <h5 className="font-semibold text-gray-800 mb-2">Hubungi Langsung</h5>
                                        <p className="text-gray-600">Klik tombol WhatsApp untuk menghubungi pendonor secara langsung</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <div className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">4</div>
                                    <div>
                                        <h5 className="font-semibold text-gray-800 mb-2">Koordinasi</h5>
                                        <p className="text-gray-600">Atur waktu dan tempat donor darah dengan pendonor</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Blood Types Section */}
            <section className="py-20 bg-white px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h3 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">Golongan Darah yang Didukung</h3>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">Platform kami mendukung semua jenis golongan darah dengan sistem Rhesus</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                        {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bloodType) => (
                            <div key={bloodType} className="blood-type-card">
                                <div className="text-3xl font-bold text-red-500 mb-2">{bloodType}</div>
                                <div className="text-sm text-gray-600">Tersedia</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-primary-soft">
                <div className="max-w-4xl mx-auto text-center">
                    <h3 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">Siap Bergabung dalam Komunitas Penyelamat Nyawa?</h3>
                    <p className="text-xl text-gray-600 mb-10">Bergabunglah dengan ribuan pendonor darah yang telah membantu menyelamatkan nyawa di seluruh Indonesia</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                            Daftar Sebagai Pendonor
                        </button>
                        <button className="border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
                            Cari Donor Sekarang
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-red-500 rounded-xl flex items-center justify-center shadow-md">
                                    <span className="text-white font-bold text-lg">🩸</span>
                                </div>
                                <h4 className="text-2xl font-bold text-red-400">DonorYuk</h4>
                            </div>
                            <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
                                Platform digital yang menghubungkan pendonor darah dengan mereka yang membutuhkan. Bersama-sama kita selamatkan lebih banyak nyawa.
                            </p>
                            <div className="text-sm text-gray-400">© 2024 DonorYuk. Semua hak dilindungi.</div>
                        </div>

                        <div>
                            <h5 className="font-semibold mb-4 text-lg">Platform</h5>
                            <ul className="space-y-3 text-gray-300">
                                <li>
                                    <Link href="#" className="hover:text-red-400 transition-colors">
                                        Tentang Kami
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="hover:text-red-400 transition-colors">
                                        Cara Kerja
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="hover:text-red-400 transition-colors">
                                        Fitur
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="hover:text-red-400 transition-colors">
                                        FAQ
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h5 className="font-semibold mb-4 text-lg">Dukungan</h5>
                            <ul className="space-y-3 text-gray-300">
                                <li>
                                    <Link href="#" className="hover:text-red-400 transition-colors">
                                        Pusat Bantuan
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="hover:text-red-400 transition-colors">
                                        Kontak
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="hover:text-red-400 transition-colors">
                                        Kebijakan Privasi
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="hover:text-red-400 transition-colors">
                                        Syarat & Ketentuan
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
                        <p>Dibuat dengan ❤️ untuk menyelamatkan lebih banyak nyawa di Indonesia</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
