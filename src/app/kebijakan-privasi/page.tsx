import type { Metadata } from "next";

import { LegalDocumentView } from "@/components/marketing/legal-document-view";
import { MarketingShell } from "@/components/marketing/marketing-shell";
import { copy } from "@/lib/copy";
import { privacyPolicy } from "@/lib/legal-content";

export const metadata: Metadata = {
  title: `Kebijakan Privasi · ${copy.app.name}`,
  description:
    "Kebijakan privasi Baca Alkitab Bersama — bagaimana kami mengumpulkan, menggunakan, dan melindungi datamu.",
};

export default function PrivacyPage() {
  return (
    <MarketingShell>
      <LegalDocumentView document={privacyPolicy} />
    </MarketingShell>
  );
}
