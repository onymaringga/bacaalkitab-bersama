"use client";

import { PageHeader } from "@/components/layout/page-header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const faqs = [
  {
    q: "Bagaimana cara menandai bacaan selesai?",
    a: "Buka menu Baca → Mulai Membaca → tekan Selesai baca. Setelah itu kamu dapat menulis renungan.",
  },
  {
    q: "Apakah renungan wajib dibagikan ke kelompok?",
    a: "Tidak. Default-nya pribadi. Kamu dapat memilih Bagikan ke kelompok hanya jika ingin.",
  },
  {
    q: "Apa perbedaan Anggota dan Ketua?",
    a: "Anggota fokus pada baca dan renungan. Ketua dapat melihat perjalanan kelompok dan mengirim pengingat.",
  },
  {
    q: "Bagaimana cara masuk sebagai Admin?",
    a: "Di halaman Masuk, gunakan akun admin komunitasmu. Di desktop kamu akan melihat dashboard web.",
  },
];

export default function BantuanPage() {
  return (
    <>
      <PageHeader
        backHref="/profil"
        backLabel="Kembali ke profil"
        title="Bantuan & FAQ"
        hint="Jawaban singkat untuk pertanyaan yang sering diajukan."
      />

      <div className="space-y-2">
        {faqs.map((item) => (
          <Card key={item.q} className="shadow-[var(--shadow-soft)]">
            <CardHeader className="pb-2">
              <CardTitle className="text-base leading-snug">{item.q}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {item.a}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
