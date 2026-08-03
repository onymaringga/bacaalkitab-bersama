import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  Church,
  HeartPulse,
  Home,
  Users,
} from "lucide-react";

import {
  MarketingCta,
  MarketingShell,
} from "@/components/marketing/marketing-shell";

const IMG_LIGHT =
  "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1400&q=85";

const audiences = [
  {
    icon: Building2,
    title: "Komunitas kantor",
    description:
      "Bacaan singkat di sela kerja. Tim tetap satu ritme tanpa perlu grup chat baru setiap minggu.",
    fit: "Cocok jika lokasi atau shift berbeda.",
  },
  {
    icon: Church,
    title: "Gereja & ministry",
    description:
      "Satu program, banyak kelompok. Admin mengatur jadwal; ketua mendampingi anggota.",
    fit: "Cocok jika peserta banyak dan perlu dibagi kelompok.",
  },
  {
    icon: Users,
    title: "Youth & small group",
    description:
      "Baca bersama, tulis renungan, saling menguatkan — tanpa ranking yang membuat malu.",
    fit: "Cocok jika yang utama adalah kedekatan, bukan angka.",
  },
  {
    icon: Home,
    title: "Keluarga & sahabat",
    description:
      "Lingkaran kecil juga dapat memiliki jadwal yang jelas. Renungan tetap dapat diprivatkan.",
    fit: "Cocok untuk memulai tanpa organisasi besar.",
  },
] as const;

const roles = [
  {
    title: "Anggota",
    platform: "Mobile",
    description:
      "Buka bacaan hari ini, tulis jika ingin, dan lihat aktivitas kelompok. Program tidak perlu dikelola sendiri.",
    capabilities: [
      "Baca pasal dan tandai selesai",
      "Tulis renungan — pilih siapa yang dapat melihat",
      "Lihat progress pribadi dan aktivitas kelompok",
    ],
  },
  {
    title: "Ketua",
    platform: "Mobile",
    description:
      "Lihat siapa yang sudah baca hari ini, kirim pengingat jika perlu, dan ikut membaca seperti anggota.",
    capabilities: [
      "Progress kelompok hari ini",
      "Kirim pengingat atau dorongan",
      "Baca dan renung seperti anggota",
    ],
  },
  {
    title: "Admin",
    platform: "Web",
    description:
      "Atur jadwal, kelompok, dan peserta. Pantau ringkasan partisipasi untuk merawat program.",
    capabilities: [
      "Kelola organisasi, program, dan kelompok",
      "Atur jadwal baca harian",
      "Lihat ringkasan partisipasi",
    ],
  },
] as const;

const hierarchy = [
  {
    label: "Organisasi",
    detail:
      "Gereja, kantor, ministry, atau lingkaran sahabat — wadah komunitasmu.",
  },
  {
    label: "Program",
    detail:
      "Rencana baca dengan tanggal dan pasal per hari. Satu organisasi dapat memiliki lebih dari satu program.",
  },
  {
    label: "Kelompok",
    detail:
      "Tempat orang benar-benar berjalan bersama. Di sini ketua dan anggota saling melihat.",
  },
] as const;

export default function UntukKomunitasPage() {
  return (
    <MarketingShell activeHref="/untuk-komunitas">
      <section className="relative overflow-hidden border-b border-[var(--l-line-soft)]">
        <div className="landing-hero-wash" aria-hidden />
        <div className="landing-shell relative grid items-center gap-10 py-14 md:grid-cols-12 md:gap-10 md:py-16">
          <div className="landing-reveal md:col-span-6">
            <p className="landing-kicker text-[var(--l-accent)]">
              Untuk komunitas
            </p>
            <h1 className="landing-display mt-4 text-[clamp(2.2rem,5vw,3.75rem)] leading-[1.05] text-[var(--l-ink)]">
              Baca bersama tanpa{" "}
              <span className="landing-display-italic text-[var(--l-accent)]">
                rasa absensi
              </span>
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-[var(--l-ink-soft)] md:text-[1.05rem]">
              Jadwal dan kelompok yang rapi — agar komunitas tetap konsisten,
              tanpa suasana diawasi.
            </p>
            <div className="mt-7">
              <Link href="/login" className="landing-btn-primary">
                Masuk
                <ArrowUpRight className="size-4" />
              </Link>
            </div>
          </div>
          <div
            className="landing-reveal md:col-span-6"
            style={{ animationDelay: "100ms" }}
          >
            <div
              className="landing-side-photo aspect-[5/4] bg-cover bg-center"
              style={{ backgroundImage: `url(${IMG_LIGHT})` }}
              role="img"
              aria-label="Halaman Alkitab di cahaya pagi"
            />
          </div>
        </div>
      </section>

      <section className="bg-[var(--l-paper)]">
        <div className="landing-shell py-14 md:py-16">
          <div className="landing-reveal max-w-2xl">
            <p className="landing-kicker text-[var(--l-accent)]">Struktur</p>
            <h2 className="landing-display mt-3 text-[clamp(1.85rem,4vw,2.75rem)] leading-[1.1] text-[var(--l-ink)]">
              Tiga tingkat, dari organisasi ke kelompok
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--l-ink-soft)] md:text-base">
              Agar program tetap teratur seiring komunitas bertumbuh.
            </p>
          </div>

          <div className="landing-reveal mt-10 grid gap-4 md:grid-cols-3 md:gap-5">
            {hierarchy.map((item, index) => (
              <div key={item.label} className="relative">
                {index < hierarchy.length - 1 ? (
                  <span
                    className="pointer-events-none absolute -bottom-3 left-1/2 z-10 flex size-7 -translate-x-1/2 items-center justify-center rounded-full border border-[var(--l-line-soft)] bg-white text-[var(--l-accent)] md:top-1/2 md:-right-4 md:bottom-auto md:left-auto md:translate-x-0 md:-translate-y-1/2"
                    aria-hidden
                  >
                    <ArrowRight className="size-3.5 rotate-90 md:rotate-0" />
                  </span>
                ) : null}
                <article className="flex h-full flex-col rounded-2xl border border-[var(--l-line-soft)] bg-[var(--l-wash)] p-5 md:p-6">
                  <span className="text-xs font-bold tracking-[0.16em] text-[var(--l-accent)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="landing-display mt-3 text-2xl text-[var(--l-ink)]">
                    {item.label}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--l-ink-soft)]">
                    {item.detail}
                  </p>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--l-wash)]">
        <div className="landing-shell py-14 md:py-16">
          <div className="landing-reveal max-w-2xl">
            <p className="landing-kicker text-[var(--l-accent)]">Siapa yang cocok</p>
            <h2 className="landing-display mt-3 text-[clamp(1.85rem,4vw,2.75rem)] leading-[1.1] text-[var(--l-ink)]">
              Untuk siapa saja yang ingin membaca bersama
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--l-ink-soft)] md:text-base">
              Tidak harus organisasi besar. Yang penting ada orang yang mau
              berjalan bersama.
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {audiences.map((item, index) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.title}
                  className="landing-reveal rounded-2xl border border-[var(--l-line-soft)] bg-white p-5 md:p-6"
                  style={{ animationDelay: `${70 + index * 50}ms` }}
                >
                  <div className="flex size-10 items-center justify-center rounded-xl bg-[var(--l-wash)] text-[var(--l-accent)]">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="landing-display mt-4 text-xl text-[var(--l-ink)]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--l-ink-soft)]">
                    {item.description}
                  </p>
                  <p className="mt-4 border-t border-[var(--l-line-soft)] pt-3 text-xs text-[var(--l-ink)]/65">
                    {item.fit}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[var(--l-paper)]">
        <div className="landing-shell py-14 md:py-16">
          <div className="landing-reveal max-w-2xl">
            <p className="landing-kicker text-[var(--l-accent)]">Peran</p>
            <h2 className="landing-display mt-3 text-[clamp(1.85rem,4vw,2.75rem)] leading-[1.1] text-[var(--l-ink)]">
              Tiga peran, tanggung jawab berbeda
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--l-ink-soft)] md:text-base">
              Anggota fokus baca. Ketua menjaga kelompok. Admin merawat program
              secara keseluruhan.
            </p>
          </div>
          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {roles.map((role, index) => (
              <article
                key={role.title}
                className="landing-reveal flex flex-col rounded-2xl border border-[var(--l-line-soft)] bg-white p-5 md:p-6"
                style={{ animationDelay: `${70 + index * 50}ms` }}
              >
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="landing-display text-2xl text-[var(--l-ink)]">
                    {role.title}
                  </h3>
                  <span className="text-xs font-medium text-[var(--l-ink-soft)]">
                    {role.platform}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-[var(--l-ink-soft)]">
                  {role.description}
                </p>
                <ul className="mt-5 space-y-2 border-t border-[var(--l-line-soft)] pt-4">
                  {role.capabilities.map((cap) => (
                    <li
                      key={cap}
                      className="flex gap-2.5 text-sm text-[var(--l-ink)]"
                    >
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[var(--l-accent)]" />
                      {cap}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--l-line-soft)] bg-[var(--l-wash)]">
        <div className="landing-shell py-14 md:py-16">
          <div className="landing-reveal mx-auto max-w-2xl text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-white text-[var(--l-accent)] shadow-sm">
              <HeartPulse className="size-5" />
            </div>
            <h2 className="landing-display mt-5 text-[clamp(1.85rem,4vw,2.75rem)] leading-[1.1] text-[var(--l-ink)]">
              Angka untuk merawat, bukan menghakimi
            </h2>
            <p className="mx-auto mt-4 text-sm leading-relaxed text-[var(--l-ink-soft)] md:text-base">
              Admin melihat partisipasi dan kelompok yang perlu perhatian —
              agar saling menguatkan, bukan menilai siapa yang “kurang rohani”.
            </p>
          </div>
        </div>
      </section>

      <MarketingCta
        title="Siap untuk komunitasmu?"
        subtitle="Masuk, atur program, undang kelompok. Mulai dari situ."
      />
    </MarketingShell>
  );
}
