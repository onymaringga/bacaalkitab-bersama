import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  EyeOff,
  HeartHandshake,
  PenLine,
  Shield,
} from "lucide-react";

import {
  MarketingCta,
  MarketingShell,
} from "@/components/marketing/marketing-shell";

const IMG_BIBLE =
  "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=1200&q=85";
const IMG_PAGES =
  "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&q=85";
const IMG_LIGHT =
  "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1200&q=85";

const problems = [
  {
    title: "Ritme mudah terputus",
    body: "Niat ada, tetapi tanpa jadwal bersama, bacaan harian sering tertinggal diam-diam.",
  },
  {
    title: "Terasa seperti absensi",
    body: "Jika yang dihitung hanya tanda selesai, program baca berubah menjadi kewajiban.",
  },
  {
    title: "Sulit melihat siapa yang perlu didampingi",
    body: "Ketua kesulitan memahami kondisi kelompok tanpa chat satu-satu atau spreadsheet.",
  },
] as const;

const steps = [
  {
    icon: BookOpen,
    title: "Baca",
    lead: "Pasal dulu. Progress menyusul.",
    description:
      "Setiap hari ada bacaan dari rencana program. Buka, baca, tandai selesai. Progress tersedia — tanpa ranking.",
    image: IMG_BIBLE,
    points: [
      "Jadwal bacaan harian dari program",
      "Pembaca Alkitab dan renungan singkat",
      "Progress pribadi tanpa ranking",
    ],
  },
  {
    icon: PenLine,
    title: "Renung",
    lead: "Tulis jika ada yang berbicara.",
    description:
      "Setelah baca, ada ruang untuk menulis. Kamu yang memilih: pribadi, ketua, atau kelompok. Tidak wajib dibagikan.",
    image: IMG_PAGES,
    points: [
      "Tulis refleksi setelah bacaan",
      "Atur siapa yang dapat melihat",
      "Tanpa tekanan harus selalu berbagi",
    ],
  },
  {
    icon: HeartHandshake,
    title: "Tumbuh bersama",
    lead: "Dorongan, bukan teguran.",
    description:
      "Di kelompok, kamu melihat siapa yang sudah baca dan renungan yang dibagikan. Ketua dapat mengirim pengingat dengan nada peduli.",
    image: IMG_LIGHT,
    points: [
      "Lihat perjalanan kelompok hari ini",
      "Saling mendukung lewat aktivitas dan renungan",
      "Ketua mendampingi tanpa suasana absensi",
    ],
  },
] as const;

const principles = [
  {
    icon: Shield,
    title: "Ringkasan untuk merawat program",
    body: "Admin melihat partisipasi dan penyelesaian bacaan — bukan untuk menilai spiritualitas individu.",
  },
  {
    icon: EyeOff,
    title: "Renungan tetap di tanganmu",
    body: "Yang kamu tulis bersifat pribadi secara default. Mau privat atau dibagikan — kamu yang mengatur.",
  },
] as const;

export default function CaraKerjaPage() {
  return (
    <MarketingShell activeHref="/cara-kerja">
      <section className="relative overflow-hidden border-b border-[var(--l-line-soft)]">
        <div className="landing-hero-wash" aria-hidden />
        <div className="landing-shell relative py-14 md:py-16">
          <div className="landing-reveal max-w-3xl">
            <p className="landing-kicker text-[var(--l-accent)]">Cara kerja</p>
            <h1 className="landing-display mt-4 text-[clamp(2.2rem,5vw,3.75rem)] leading-[1.05] text-[var(--l-ink)]">
              Baca. Renung.{" "}
              <span className="landing-display-italic text-[var(--l-accent)]">
                Jalan bersama.
              </span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--l-ink-soft)] md:text-[1.05rem]">
              Alur sederhana agar komunitas tetap membaca bersama — tanpa rasa
              diawasi.
            </p>
            <div className="mt-7">
              <Link href="/login" className="landing-btn-primary">
                Masuk
                <ArrowUpRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[var(--l-wash)]">
        <div className="landing-shell py-14 md:py-16">
          <div className="landing-reveal max-w-2xl">
            <p className="landing-kicker text-[var(--l-accent)]">Tantangan</p>
            <h2 className="landing-display mt-3 text-[clamp(1.85rem,4vw,2.75rem)] leading-[1.1] text-[var(--l-ink)]">
              Yang sering terjadi di program baca bersama
            </h2>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {problems.map((item, index) => (
              <article
                key={item.title}
                className="landing-reveal rounded-2xl border border-[var(--l-line-soft)] bg-white p-5 md:p-6"
                style={{ animationDelay: `${70 + index * 60}ms` }}
              >
                <p className="text-xs font-bold tracking-[0.16em] text-[var(--l-accent)]">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="landing-display mt-3 text-xl text-[var(--l-ink)]">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--l-ink-soft)]">
                  {item.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--l-paper)]">
        <div className="landing-shell space-y-14 py-14 md:space-y-20 md:py-20">
          <div className="landing-reveal max-w-2xl">
            <p className="landing-kicker text-[var(--l-accent)]">Alur</p>
            <h2 className="landing-display mt-3 text-[clamp(1.85rem,4vw,2.75rem)] leading-[1.1] text-[var(--l-ink)]">
              Tiga langkah setiap hari
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--l-ink-soft)] md:text-base">
              Baca untuk menjaga ritme. Renung untuk memberi ruang. Kelompok
              agar tidak berjalan sendirian.
            </p>
          </div>

          {steps.map((step, index) => {
            const Icon = step.icon;
            const reverse = index % 2 === 1;
            return (
              <article
                key={step.title}
                className="landing-reveal grid items-center gap-8 md:grid-cols-12 md:gap-10"
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <div
                  className={
                    reverse
                      ? "order-2 md:col-span-6"
                      : "order-2 md:order-1 md:col-span-6"
                  }
                >
                  <div
                    className="landing-side-photo aspect-[5/4] bg-cover bg-center"
                    style={{ backgroundImage: `url(${step.image})` }}
                    role="img"
                    aria-label={step.title}
                  />
                </div>
                <div
                  className={
                    reverse
                      ? "order-1 md:col-span-6"
                      : "order-1 md:order-2 md:col-span-6"
                  }
                >
                  <p className="text-xs font-bold tracking-[0.16em] text-[var(--l-accent)]">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <div className="mt-3 flex size-11 items-center justify-center rounded-2xl bg-[var(--l-wash)] text-[var(--l-accent)]">
                    <Icon className="size-5" />
                  </div>
                  <h2 className="landing-display mt-4 text-3xl text-[var(--l-ink)] md:text-4xl">
                    {step.title}
                  </h2>
                  <p className="landing-display-italic mt-2 text-lg text-[var(--l-accent)]">
                    {step.lead}
                  </p>
                  <p className="mt-3 text-base leading-relaxed text-[var(--l-ink-soft)]">
                    {step.description}
                  </p>
                  <ul className="mt-5 space-y-2.5">
                    {step.points.map((point) => (
                      <li
                        key={point}
                        className="flex gap-3 text-sm text-[var(--l-ink)]"
                      >
                        <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[var(--l-accent)]" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-y border-[var(--l-line-soft)] bg-[var(--l-wash)]">
        <div className="landing-shell py-14 md:py-16">
          <div className="landing-reveal max-w-2xl">
            <p className="landing-kicker text-[var(--l-accent)]">Prinsip</p>
            <h2 className="landing-display mt-3 text-[clamp(1.85rem,4vw,2.75rem)] leading-[1.1] text-[var(--l-ink)]">
              Dua hal yang kami jaga
            </h2>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {principles.map((item, index) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.title}
                  className="landing-reveal rounded-2xl border border-[var(--l-line-soft)] bg-white p-5 md:p-6"
                  style={{ animationDelay: `${70 + index * 60}ms` }}
                >
                  <div className="flex size-10 items-center justify-center rounded-xl bg-[var(--l-wash)] text-[var(--l-accent)]">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="landing-display mt-4 text-xl text-[var(--l-ink)]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--l-ink-soft)]">
                    {item.body}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <MarketingCta
        title="Siap mencoba alurnya?"
        subtitle="Masuk, buka bacaan hari ini, dan tulis renungan jika ingin."
      />
    </MarketingShell>
  );
}
