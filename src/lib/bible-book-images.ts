import { type ImageSource, unsplashSource } from "@/lib/image-source";

export type BookImage = {
  src: string;
  fallbackSrc: string;
  alt: string;
  kind: "photo";
  source: ImageSource;
};

type PhotoPair = { src: string; fallbackSrc: string; source: ImageSource };

/** URL Unsplash terverifikasi (200) — jangan pakai ID tanpa hash suffix. */
function u(id: string): PhotoPair {
  const url = `https://images.unsplash.com/photo-${id}?w=800&h=500&fit=crop&q=80&auto=format`;
  return { src: url, fallbackSrc: url, source: unsplashSource(id) };
}

const FALLBACK = u("1500382017468-9049fed747ef");

/** Foto tematik per genre — semua URL sudah dicek hidup. */
const P = {
  /** Ladang / alam — Kejadian */
  creation: u("1451187580459-43490279c0fa"),
  /** Gurun — Keluaran */
  desert: u("1682687220063-4742bd7fd538"),
  /** Rak buku / kitab — Torat & hikmat */
  scroll: u("1481627834876-b7833e8f5570"),
  /** Pegunungan — perjalanan & mazmur */
  mountain: u("1506905925346-21bda4d32df4"),
  /** Jembatan / langit emas — sejarah & nabi */
  jerusalem: u("1501594907352-04cda38ebc29"),
  /** Ladang gandum */
  harvest: u("1500382017468-9049fed747ef"),
  /** Meja baca / komunitas */
  study: u("1544716278-ca5e3f4abd8c"),
  /** Danau & lembah */
  valley: u("1469474968028-56623f02e42e"),
  /** Pantai — Galilea */
  sea: u("1507525428034-b723cf961d3e"),
  /** Kabut pagi */
  mist: u("1470071459604-3b5ec3a7fe05"),
  /** Jalan — Kisah Para Rasul */
  road: u("1469854523086-cc02fe5d8800"),
  /** Bintang / malam — Wahyu */
  stars: u("1519681393784-d120267933ba"),
  /** Alkitab terbuka */
  bible: u("1504052434569-70ad5836ab65"),
} as const satisfies Record<string, PhotoPair>;

const BOOK_PHOTOS: Record<string, PhotoPair> = {
  Kej: P.creation,
  Kel: P.desert,
  Im: P.scroll,
  Bil: P.desert,
  Ul: P.mountain,
  Jos: P.jerusalem,
  Hk: P.mountain,
  Rut: P.harvest,
  "1Sa": P.jerusalem,
  "2Sa": P.jerusalem,
  "1Ra": P.study,
  "2Ra": P.study,
  "1Ta": P.jerusalem,
  "2Ta": P.jerusalem,
  Ezr: P.scroll,
  Ne: P.mist,
  Est: P.study,
  Ay: P.mist,
  Maz: P.valley,
  Pnh: P.scroll,
  Pkh: P.mountain,
  Kid: P.valley,
  Yes: P.jerusalem,
  Yer: P.mist,
  Rat: P.mist,
  Yeh: P.stars,
  Dan: P.study,
  Ho: P.jerusalem,
  Yo: P.jerusalem,
  Am: P.mountain,
  Ob: P.desert,
  Yun: P.sea,
  Mi: P.mountain,
  Na: P.jerusalem,
  Hab: P.mist,
  Zef: P.jerusalem,
  Hag: P.jerusalem,
  Za: P.jerusalem,
  Mal: P.jerusalem,
  Mat: P.harvest,
  Mrk: P.road,
  Luk: P.harvest,
  Yoh: P.sea,
  Kis: P.jerusalem,
  Rom: P.bible,
  "1Ko": P.bible,
  "2Ko": P.bible,
  Gal: P.desert,
  Ef: P.bible,
  Fil: P.bible,
  Kol: P.bible,
  "1Te": P.bible,
  "2Te": P.bible,
  "1Ti": P.bible,
  "2Ti": P.bible,
  Tit: P.bible,
  Flm: P.bible,
  Ibr: P.scroll,
  Yaa: P.mountain,
  "1Pe": P.jerusalem,
  "2Pe": P.jerusalem,
  "1Yo": P.sea,
  "2Yo": P.bible,
  "3Yo": P.bible,
  Yud: P.mist,
  Why: P.stars,
};

function genrePhotoFromLabel(genre: string): PhotoPair {
  const g = genre.toLowerCase();
  if (g.includes("injil")) return P.harvest;
  if (g.includes("surat") || g.includes("epist")) return P.bible;
  if (g.includes("wahyu")) return P.stars;
  if (g.includes("kisah para rasul")) return P.road;
  if (g.includes("hukum") || g.includes("ibadah")) return P.scroll;
  if (g.includes("sajak") || g.includes("mazmur") || g.includes("puisi")) return P.valley;
  if (g.includes("hikmat")) return P.mountain;
  if (g.includes("nabi") || g.includes("kenabian")) return P.jerusalem;
  if (g.includes("sejarah") || g.includes("narasi")) return P.jerusalem;
  return P.creation;
}

export function getBookImage(
  abbr: string,
  bookName: string,
  genre: string,
): BookImage {
  const photo = BOOK_PHOTOS[abbr] ?? genrePhotoFromLabel(genre);
  return {
    src: photo.src,
    fallbackSrc: FALLBACK.src,
    alt: `Gambar ${bookName}`,
    kind: "photo",
    source: photo.source,
  };
}
