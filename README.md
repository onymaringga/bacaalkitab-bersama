# Baca Alkitab Bersama

Aplikasi web mobile-first untuk baca Alkitab terjadwal — dengan kelompok, leader, admin, renungan harian, catatan pribadi, dan reminder.

## Fitur

| Fitur | Status |
|-------|--------|
| Jadwal baca harian + renungan | UI demo ✓ |
| Kelompok dengan leader | UI demo ✓ |
| Catatan pribadi per bacaan | UI demo ✓ |
| Panel admin (set jadwal & kelompok) | UI demo ✓ |
| Auth (email/password) | Schema siap, perlu DB |
| Reminder push notification | Fase berikutnya |
| Database persisten | Schema siap, perlu Neon |

## Peran pengguna

- **Admin** — mengatur jadwal baca, renungan, dan kelompok
- **Leader** — membimbing kelompoknya
- **Member** — membaca, menulis catatan, menandai progress

## Tech stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4 + shadcn/ui
- Drizzle ORM + Neon Postgres
- Better Auth

## Mulai development

```bash
cd bacaalkitab-bersama
cp .env.example .env
# Isi DATABASE_URL, BETTER_AUTH_SECRET, BETTER_AUTH_URL

npm install
npm run db:push   # setelah DATABASE_URL diisi
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

Tanpa database, UI demo tetap bisa diakses lewat **Lihat demo aplikasi** di landing page.

## Struktur halaman

- `/` — Landing
- `/dashboard` — Bacaan & renungan hari ini
- `/jadwal` — Daftar jadwal baca
- `/kelompok` — Daftar kelompok
- `/catatan` — Catatan pribadi
- `/profil` — Profil & reminder
- `/admin` — Panel admin
- `/login`, `/register` — Auth

## Langkah berikutnya

1. Hubungkan Neon Postgres dan jalankan `npm run db:push`
2. Wire UI ke database (ganti demo data)
3. Proteksi route berdasarkan role (admin / leader / member)
4. Tambah PWA + push notification untuk reminder mobile
5. Deploy ke Vercel
