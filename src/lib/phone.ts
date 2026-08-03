/** Normalisasi nomor HP Indonesia ke format WhatsApp (E.164 tanpa +). */

export function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

/** Hasil: "6281234567890" atau "" jika tidak valid. */
export function toWhatsAppPhone(raw: string) {
  let digits = digitsOnly(raw);
  if (!digits) return "";

  if (digits.startsWith("0")) {
    digits = `62${digits.slice(1)}`;
  } else if (digits.startsWith("8") && digits.length >= 9) {
    digits = `62${digits}`;
  } else if (digits.startsWith("620")) {
    digits = `62${digits.slice(3)}`;
  }

  if (!digits.startsWith("62") || digits.length < 10 || digits.length > 15) {
    return "";
  }
  return digits;
}

export function formatPhoneDisplay(raw: string) {
  const wa = toWhatsAppPhone(raw);
  if (!wa) return raw.trim() || "";
  if (wa.startsWith("62") && wa.length >= 4) {
    return `+${wa.slice(0, 2)} ${wa.slice(2, 5)}-${wa.slice(5, 9)}-${wa.slice(9)}`.replace(
      /-+$/,
      "",
    );
  }
  return `+${wa}`;
}

export function buildWhatsAppDeepLink(phone: string, text: string) {
  const wa = toWhatsAppPhone(phone);
  if (!wa) return "";
  const encoded = encodeURIComponent(text.trim());
  return `https://wa.me/${wa}?text=${encoded}`;
}
