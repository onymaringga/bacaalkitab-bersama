import type { Metadata } from "next";

import { LegalDocumentView } from "@/components/marketing/legal-document-view";
import { MarketingShell } from "@/components/marketing/marketing-shell";
import { copy } from "@/lib/copy";
import { termsAndConditions } from "@/lib/legal-content";

export const metadata: Metadata = {
  title: `Syarat & Ketentuan · ${copy.app.name}`,
  description:
    "Syarat dan ketentuan penggunaan platform Baca Alkitab Bersama untuk komunitas baca Alkitab.",
};

export default function TermsPage() {
  return (
    <MarketingShell>
      <LegalDocumentView document={termsAndConditions} />
    </MarketingShell>
  );
}
