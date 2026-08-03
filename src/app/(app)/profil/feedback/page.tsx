"use client";

import { useState } from "react";

import { PageHeader } from "@/components/layout/page-header";
import { DemoActionButton } from "@/components/ui/demo-action-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function FeedbackPage() {
  const [topic, setTopic] = useState("saran");
  const [message, setMessage] = useState("");

  return (
    <>
      <PageHeader
        backHref="/profil"
        backLabel="Kembali ke profil"
        title="Kirim Feedback"
        hint="Ceritakan saran atau kendala — kami baca setiap masukan."
      />

      <Card className="shadow-[var(--shadow-soft)]">
        <CardHeader>
          <CardTitle className="text-base">Formulir feedback</CardTitle>
          <CardDescription>
            Masukanmu membantu perjalanan baca bersama jadi lebih baik.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Topik</Label>
            <Select value={topic} onValueChange={setTopic}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih topik" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="saran">Saran fitur</SelectItem>
                <SelectItem value="bug">Laporan masalah</SelectItem>
                <SelectItem value="konten">Konten bacaan</SelectItem>
                <SelectItem value="lainnya">Lainnya</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Pesan</Label>
            <Textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Tulis masukanmu di sini…"
              className="min-h-36 rounded-xl"
            />
          </div>
          <DemoActionButton
            className="h-11 w-full rounded-xl font-semibold"
            disabled={!message.trim()}
            successMessage="Feedback terkirim. Terima kasih!"
            onAction={() => {
              const key = "bab-feedbacks";
              const existing = window.localStorage.getItem(key);
              const list = existing ? (JSON.parse(existing) as unknown[]) : [];
              list.push({
                topic,
                message: message.trim(),
                at: new Date().toISOString(),
              });
              window.localStorage.setItem(key, JSON.stringify(list));
              setMessage("");
            }}
          >
            Kirim feedback
          </DemoActionButton>
        </CardContent>
      </Card>
    </>
  );
}
