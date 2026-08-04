export type LegalSection = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

export type LegalDocument = {
  title: string;
  subtitle: string;
  updatedAt: string;
  sections: LegalSection[];
};

export const termsAndConditions: LegalDocument = {
  title: "Syarat & Ketentuan",
  subtitle:
    "Ketentuan penggunaan layanan Baca Alkitab Bersama. Dengan mendaftar atau menggunakan aplikasi, kamu setuju dengan syarat di bawah ini.",
  updatedAt: "3 Agustus 2026",
  sections: [
    {
      title: "1. Tentang layanan",
      paragraphs: [
        "Baca Alkitab Bersama adalah platform digital untuk membantu komunitas membaca Alkitab secara terjadwal, berkelompok, dan saling mendukung. Layanan mencakup jadwal baca, pembaca Alkitab, catatan renungan, fitur kelompok, serta alat bantu belajar Firman.",
        "Kami dapat memperbarui, menambah, atau mengubah fitur dari waktu ke waktu untuk meningkatkan pengalaman pengguna, dengan pemberitahuan melalui aplikasi jika perubahan berdampak signifikan.",
      ],
    },
    {
      title: "2. Pendaftaran dan akun",
      paragraphs: [
        "Kamu wajib memberikan informasi yang benar saat mendaftar, termasuk nama dan alamat email yang dapat dihubungi. Kamu bertanggung jawab menjaga kerahasiaan kata sandi dan semua aktivitas yang terjadi melalui akunmu.",
        "Kamu dapat mendaftar sebagai pengguna individu atau bergabung ke kelompok baca sesuai pilihan saat registrasi. Bergabung ke kelompok dapat memerlukan kode undangan atau persetujuan ketua kelompok, tergantung pengaturan komunitas.",
        "Kami berhak menangguhkan atau menutup akun yang melanggar syarat ini, digunakan secara menyesatkan, atau membahayakan komunitas.",
      ],
    },
    {
      title: "3. Penggunaan yang diperbolehkan",
      paragraphs: [
        "Kamu setuju menggunakan layanan hanya untuk tujuan rohani, pendidikan, dan komunitas yang sehat. Kamu tidak boleh:",
      ],
      bullets: [
        "Menyalahgunakan, mengganggu, atau mencoba merusak sistem aplikasi",
        "Mengunggah konten yang menghina, penuh kebencian, cabul, atau melanggar hukum",
        "Menyamar sebagai orang lain atau menggunakan identitas palsu",
        "Mengumpulkan data pengguna lain tanpa izin",
        "Menggunakan layanan untuk spam, promosi komersial tanpa persetujuan, atau aktivitas yang merugikan komunitas",
      ],
    },
    {
      title: "4. Konten pengguna",
      paragraphs: [
        "Renungan, catatan, komentar, atau konten lain yang kamu buat tetap milikmu. Dengan membagikan konten di dalam kelompok atau fitur komunitas, kamu memberi kami izin non-eksklusif untuk menampilkan konten tersebut kepada anggota yang berhak melihatnya sesuai pengaturan privasi yang kamu pilih.",
        "Kamu bertanggung jawab atas konten yang kamu bagikan. Kami dapat menghapus konten yang melanggar syarat ini atau permintaan yang sah dari pihak berwenang.",
      ],
    },
    {
      title: "5. Peran ketua kelompok dan admin",
      paragraphs: [
        "Ketua kelompok dan admin program dapat melihat ringkasan progress baca anggota untuk tujuan pendampingan pastoral atau administrasi program — bukan untuk mempermalukan atau menghukum.",
        "Peran tersebut harus digunakan dengan integritas, kerendahan hati, dan sesuai kebijakan komunitas yang mengelola program.",
      ],
    },
    {
      title: "6. Teks Alkitab dan materi referensi",
      paragraphs: [
        "Teks Alkitab, renungan, glosarium, dan materi referensi lain disediakan untuk keperluan baca dan belajar. Hak cipta teks Alkitab mengikuti sumber dan penerbit masing-masing. Kamu tidak boleh menyalin, mendistribusikan, atau memperjualbelikan materi tersebut di luar penggunaan pribadi atau komunitas yang diizinkan.",
      ],
    },
    {
      title: "7. Ketersediaan layanan",
      paragraphs: [
        "Kami berupaya menjaga layanan tetap tersedia, namun tidak menjamin aplikasi bebas dari gangguan, error, atau kehilangan data. Kamu disarankan mencadangkan renungan penting secara pribadi jika diperlukan.",
        "Fitur tertentu (misalnya transkripsi suara atau pengingat) dapat bergantung pada layanan pihak ketiga dan koneksi internet.",
      ],
    },
    {
      title: "8. Batasan tanggung jawab",
      paragraphs: [
        "Layanan disediakan \"sebagaimana adanya\". Baca Alkitab Bersama tidak bertanggung jawab atas kerugian tidak langsung, kehilangan data, atau dampak yang timbul dari penggunaan atau ketidakmampuan menggunakan aplikasi, sejauh diizinkan oleh hukum yang berlaku.",
        "Materi di aplikasi membantu perjalanan rohani, tetapi tidak menggantikan nasihat pastoral, teologi resmi gereja, atau bimbingan profesional.",
      ],
    },
    {
      title: "9. Perubahan syarat",
      paragraphs: [
        "Kami dapat memperbarui Syarat & Ketentuan ini. Tanggal pembaruan terakhir dicantumkan di halaman ini. Penggunaan berkelanjutan setelah perubahan dianggap sebagai persetujuan terhadap syarat yang diperbarui.",
      ],
    },
    {
      title: "10. Hukum yang berlaku dan kontak",
      paragraphs: [
        "Syarat ini diatur oleh hukum Republik Indonesia. Jika ada pertanyaan, saran, atau laporan pelanggaran, hubungi pengelola program melalui fitur bantuan di aplikasi atau kanal resmi komunitas yang mengelola layanan ini.",
      ],
    },
  ],
};

export const privacyPolicy: LegalDocument = {
  title: "Kebijakan Privasi",
  subtitle:
    "Kami menghargai privasimu. Kebijakan ini menjelaskan data apa yang kami kumpulkan, bagaimana kami menggunakannya, dan hak yang kamu miliki.",
  updatedAt: "3 Agustus 2026",
  sections: [
    {
      title: "1. Siapa yang mengelola data",
      paragraphs: [
        "Baca Alkitab Bersama dikelola untuk mendukung program baca Alkitab komunitas. Pengelola program (gereja, organisasi, atau tim yang men-deploy aplikasi) dapat menjadi pengendali data untuk anggota kelompoknya, sementara platform menyediakan infrastruktur teknis.",
      ],
    },
    {
      title: "2. Data yang kami kumpulkan",
      paragraphs: ["Saat kamu menggunakan layanan, kami dapat memproses data berikut:"],
      bullets: [
        "Data akun: nama, alamat email, kata sandi (disimpan dalam bentuk terenkripsi), dan preferensi membership (individu atau kelompok)",
        "Data baca: progress baca harian, streak, jadwal, bookmark, sorotan ayat, dan catatan renungan",
        "Data kelompok: keanggotaan kelompok, peran (anggota, ketua, admin), dan interaksi di fitur komunitas",
        "Data teknis: jenis perangkat, log error, dan preferensi tampilan (misalnya ukuran font) yang disimpan lokal",
        "Data opsional: feedback, permintaan bantuan, atau unggahan suara jika kamu menggunakan fitur transkripsi",
      ],
    },
    {
      title: "3. Bagaimana kami menggunakan data",
      paragraphs: ["Data digunakan untuk:"],
      bullets: [
        "Menyediakan akun, login, dan pengalaman baca yang personal",
        "Menampilkan progress dan statistik baca pribadi maupun ringkasan kelompok",
        "Memungkinkan ketua kelompok mendampingi anggota yang perlu perhatian",
        "Mengirim pengingat baca jika kamu mengaktifkannya",
        "Meningkatkan keamanan, mencegah penyalahgunaan, dan memperbaiki bug",
      ],
    },
    {
      title: "4. Penyimpanan data",
      paragraphs: [
        "Sebagian data disimpan di perangkatmu (localStorage) untuk mode demo atau penggunaan offline, seperti progress baca, bookmark, dan preferensi membership.",
        "Jika aplikasi terhubung ke server/database, data akun dan konten dapat disimpan di infrastruktur cloud yang digunakan pengelola program. Retensi data mengikuti kebijakan komunitas dan kebutuhan operasional program.",
      ],
    },
    {
      title: "5. Berbagi data dengan pihak lain",
      paragraphs: [
        "Kami tidak menjual data pribadimu. Data dapat dibagikan hanya dalam kondisi berikut:",
      ],
      bullets: [
        "Kepada anggota kelompok atau ketua, sesuai pengaturan visibilitas (misalnya refleksi yang kamu pilih bagikan)",
        "Kepada penyedia layanan teknis (hosting, email pengingat, transkripsi suara) yang terikat kewajiban kerahasiaan",
        "Jika diwajibkan oleh hukum atau permintaan resmi yang sah",
      ],
    },
    {
      title: "6. Privasi renungan dan catatan",
      paragraphs: [
        "Renungan dan catatan pribadi secara default hanya untukmu. Kamu yang memilih apakah ingin membagikannya ke timeline kelompok atau komunitas.",
        "Kami mendorong penggunaan fitur berbagi dengan bijak dan hormat terhadap privasi orang lain.",
      ],
    },
    {
      title: "7. Cookie dan teknologi serupa",
      paragraphs: [
        "Aplikasi dapat menggunakan penyimpanan lokal di browser untuk menjaga sesi login, preferensi tampilan, dan data baca offline. Kamu dapat menghapus data lokal melalui pengaturan browser, namun beberapa fitur mungkin perlu disetel ulang.",
      ],
    },
    {
      title: "8. Keamanan",
      paragraphs: [
        "Kami menerapkan langkah-langkah wajar untuk melindungi data, termasuk enkripsi kata sandi dan akses terbatas ke sistem administrasi. Namun, tidak ada sistem yang sepenuhnya aman; gunakan kata sandi yang kuat dan jangan membagikannya.",
      ],
    },
    {
      title: "9. Hak kamu",
      paragraphs: ["Kamu berhak untuk:"],
      bullets: [
        "Mengakses dan memperbarui data profil melalui pengaturan akun",
        "Meminta penghapusan akun melalui pengelola program",
        "Menarik persetujuan berbagi konten dengan menghapus atau mengubah visibilitas renungan",
        "Menghubungi kami jika ada pertanyaan tentang data yang kami simpan",
      ],
    },
    {
      title: "10. Anak dan remaja",
      paragraphs: [
        "Layanan ditujukan untuk komunitas dengan supervisi ketua kelompok atau orang tua/wali. Pengguna di bawah usia yang disyaratkan hukum setempat memerlukan izin wali saat mendaftar.",
      ],
    },
    {
      title: "11. Perubahan kebijakan",
      paragraphs: [
        "Kebijakan Privasi dapat diperbarui seiring perkembangan fitur atau regulasi. Perubahan material akan diberitahukan melalui aplikasi atau email. Tanggal pembaruan terakhir tercantum di halaman ini.",
      ],
    },
    {
      title: "12. Hubungi kami",
      paragraphs: [
        "Untuk pertanyaan privasi, permintaan akses data, atau laporan kebocoran, silakan hubungi pengelola program melalui halaman Bantuan di aplikasi atau kontak resmi komunitas yang mengelola Baca Alkitab Bersama.",
      ],
    },
  ],
};
