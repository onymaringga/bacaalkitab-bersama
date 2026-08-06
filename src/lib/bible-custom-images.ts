import type { BibleCustomCategoryId } from "@/lib/bible-customs";

export type CustomImage = {
  src: string;
  fallbackSrc: string;
  alt: string;
};

type PhotoPair = { src: string; fallbackSrc: string };

/** URL Unsplash terverifikasi (200) — jangan pakai ID tanpa hash suffix. */
function u(id: string): PhotoPair {
  const url = `https://images.unsplash.com/photo-${id}?w=800&h=500&fit=crop&q=80&auto=format`;
  return { src: url, fallbackSrc: url };
}

const FALLBACK = u("1500382017468-9049fed747ef");

/** Foto tematik per kategori — semua URL sudah dicek hidup. */
const P = {
  /** Perjamuan / perayaan */
  feast: u("1517248135467-4c7edcad34c4"),
  /** Pintu / ambang */
  door: u("1558618666-fcd25c85cd64"),
  /** Alkitab / perjanjian */
  covenant: u("1504052434569-70ad5836ab65"),
  /** Air / pembasuhan */
  water: u("1529156069898-49953e39b3ac"),
  /** Sandal / langkah kudus */
  sandals: u("1522673607200-164d1b6ce486"),
  /** Kabut / perhentian */
  rest: u("1470071459604-3b5ec3a7fe05"),
  /** Lilin / api */
  flame: u("1514525253161-7a46d19cd819"),
  /** Mandi ritual */
  washing: u("1545235617-9465d2a55698"),
  /** Hidangan / makanan */
  food: u("1565299624946-b28f40a0ae38"),
  /** Api / korban */
  altar: u("1511795409834-ef04bbd61622"),
  /** Gunung / nazir */
  vow: u("1506905925346-21bda4d32df4"),
  /** Meja sederhana / puasa */
  fast: u("1504674900247-0877df9cc836"),
  /** Malam / Yom Kippur */
  night: u("1519681393784-d120267933ba"),
  /** Lembah / sukkot */
  booth: u("1469474968028-56623f02e42e"),
  /** Panen / persepuluhan */
  harvest: u("1500382017468-9049fed747ef"),
  /** Pantai / basuh kaki */
  basin: u("1507525428034-b723cf961d3e"),
  /** Pernikahan */
  wedding: u("1519741497674-611481863552"),
} as const satisfies Record<string, PhotoPair>;

const CUSTOM_PHOTOS: Record<string, PhotoPair> = {
  paskah: P.feast,
  "darah-ambang-pintu": P.door,
  sunat: P.covenant,
  "menstruasi-niddah": P.water,
  "lepas-sandal": P.sandals,
  sabat: P.rest,
  pentakosta: P.flame,
  "pembasuhan-ritual": P.washing,
  "makanan-halal": P.food,
  "korban-bakaran": P.altar,
  nazir: P.vow,
  puasa: P.fast,
  "yom-kippur": P.night,
  sukkot: P.booth,
  mezuzah: P.door,
  "persembahan-persepuluhan": P.harvest,
  "basuh-tangan-kaki": P.basin,
  "pernikahan-perjanjian": P.wedding,
};

function categoryPhoto(category: BibleCustomCategoryId): PhotoPair {
  switch (category) {
    case "perayaan":
      return P.feast;
    case "perjanjian":
      return P.covenant;
    case "kesucian":
      return P.water;
    case "ibadah":
      return P.altar;
    case "simbol":
      return P.door;
  }
}

export function getCustomImage(
  slug: string,
  title: string,
  category?: BibleCustomCategoryId,
): CustomImage {
  const photo =
    CUSTOM_PHOTOS[slug] ?? (category ? categoryPhoto(category) : FALLBACK);
  return {
    src: photo.src,
    fallbackSrc: FALLBACK.src,
    alt: `Gambar kebiasaan: ${title}`,
  };
}
