/**
 * Konten ringkas 12 murid Yesus & kelompok tokoh PB lain untuk halaman Explore Tokoh.
 */

import { getBibleCharacter } from "@/lib/bible-characters";

export type DiscipleSpotlight = {
  order: number;
  slug: string;
  name: string;
  alsoKnownAs?: string;
  role: string;
  summary: string;
};

/** Daftar resmi 12 murid menurut Matius 10:2–4 / Markus 3:16–19. */
export const TWELVE_DISCIPLES: DiscipleSpotlight[] = [
  {
    order: 1,
    slug: "petrus",
    name: "Petrus",
    alsoKnownAs: "Simon, Kefas",
    role: "Nelayan · juru bicara murid",
    summary:
      "Dipanggil dari perahu dan diberi nama Petrus (“batu”). Ia mengakui Yesus sebagai Mesias, pernah menyangkal, lalu dipulihkan menjadi gembala domba-domba Kristus dan berkhotbah di Pentakosta.",
  },
  {
    order: 2,
    slug: "andreas",
    name: "Andreas",
    role: "Nelayan · penghubung",
    summary:
      "Saudara Petrus yang mula-mula mengikuti Yohanes Pembaptis, lalu membawa saudaranya kepada Yesus. Ia dikenal memperkenalkan orang — termasuk anak dengan roti dan ikan — kepada Kristus.",
  },
  {
    order: 3,
    slug: "yakobus",
    name: "Yakobus",
    alsoKnownAs: "anak Zebedeus, Yakobus Agung",
    role: "Nelayan · murid inti",
    summary:
      "Anak Zebedeus bersama adiknya Yohanes; salah satu dari tiga murid terdekat Yesus. Ia menyaksikan transfigurasi dan menjadi rasul pertama yang mati martir di bawah Herodes.",
  },
  {
    order: 4,
    slug: "yohanes-rasul",
    name: "Yohanes",
    alsoKnownAs: "anak Zebedeus, murid yang dikasihi",
    role: "Murid terkasih · penulis",
    summary:
      "Murid yang dekat dengan Yesus — ada di salib, Getsemani, dan Gunung Pemuliaan. Tradisi mengaitkannya dengan Injil, surat-surat, dan Wahyu; tekannya kasih dan percaya kepada Anak Allah.",
  },
  {
    order: 5,
    slug: "filipus",
    name: "Filipus",
    role: "Murid dari Betsaida",
    summary:
      "Asal Betsaida, sama seperti Andreas dan Petrus. Ia dipercaya Yesus untuk menanyakan bekal roti dan ikan; juga membawa Natanael kepada Kristus dengan undangan: “Mari, lihatlah!”",
  },
  {
    order: 6,
    slug: "bartolomeus",
    name: "Bartolomeus",
    alsoKnownAs: "Natanael",
    role: "Murid jujur dari Kana",
    summary:
      "Dikenal jujur tanpa tipu daya. Saat Filipus memanggilnya, ia ragu tentang Nazaret, lalu bertemu Yesus yang sudah mengenalnya. Ia menjadi saksi awal yang mengakui Yesus sebagai Anak Allah dan Raja Israel.",
  },
  {
    order: 7,
    slug: "tomas",
    name: "Tomas",
    alsoKnownAs: "Didimus",
    role: "Murid yang ragu lalu percaya",
    summary:
      "Murid yang ingin bukti kebangkitan — “kecuali aku melihat bekas paku…” — lalu jatuh berlutut: “Tuhan dan Allahku!” Keraguannya jujur, dan imannya akhirnya teguh.",
  },
  {
    order: 8,
    slug: "matius",
    name: "Matius",
    alsoKnownAs: "Lewi",
    role: "Pemungut cukai · penulis Injil",
    summary:
      "Pemungut cukai yang dipanggil Yesus dari meja tol; ia meninggalkan segalanya dan mengundang teman seprofesi. Tradisi mengaitkannya dengan Injil Matius dan pelayanan kepada bangsa Yahudi.",
  },
  {
    order: 9,
    slug: "yakobus-anak-alfius",
    name: "Yakobus",
    alsoKnownAs: "anak Alfeus",
    role: "Murid · mungkin “Yakobus yang kecil”",
    summary:
      "Salah satu dari dua belas, anak Alfeus — berbeda dari Yakobus anak Zebedeus. Alkitab mencatat namanya di daftar rasul; tradisi gereja mengaitkannya dengan Yakobus penulis surat dan/atau uskup Yerusalem.",
  },
  {
    order: 10,
    slug: "yudas-yakobus",
    name: "Yudas",
    alsoKnownAs: "Tadeus, Yudas anak Yakobus",
    role: "Murid · bukan Yudas Iskariot",
    summary:
      "Disebut Yudas anak Yakobus (bukan Iskariot) agar tidak bercampur dengan pengkhianat. Di Yohanes 14 ia bertanya mengapa Yesus akan menyatakan diri; Yesus menjawab tentang kasih dan ketaatan.",
  },
  {
    order: 11,
    slug: "simon-zelot",
    name: "Simon",
    alsoKnownAs: "Simon orang Zelot",
    role: "Murid · latar Zelot",
    summary:
      "Disebut “orang Zelot” — kemungkinan bekas simpatisan gerakan nasionalis Yahudi. Kehadirannya di antara kedua belas menunjukkan kerajaan Yesus melampaui spektrum politis: dari pemungut cukai hingga zelot.",
  },
  {
    order: 12,
    slug: "yudas-iskariot",
    name: "Yudas Iskariot",
    role: "Murid yang mengkhianati",
    summary:
      "Menjaga dompet murid-murid, lalu menyerahkan Yesus dengan ciuman demi tiga puluh keping perak. Kisahnya mengingatkan bahwa kedekatan fisik dengan Yesus tidak otomatis berarti hati yang setia.",
  },
];

export type NotableCharacterGroup = {
  id: string;
  title: string;
  description: string;
  slugs: string[];
};

/** Tokoh Perjanjian Baru penting di luar daftar 12 murid. */
export const OTHER_NOTABLE_PB_GROUPS: NotableCharacterGroup[] = [
  {
    id: "rasul-misi",
    title: "Rasul & misi",
    description:
      "Paulus bukan dari kedua belas, tetapi dipanggil sebagai rasul bagi bangsa-bangsa. Barnabas, Silas, dan Timotius menemani dan melanjutkan pekerjaan Injil — menunjukkan bahwa gereja tumbuh melampaui lingkaran awal.",
    slugs: ["paulus", "barnabas", "matias", "silas", "timotius"],
  },
  {
    id: "pengikut-dekat",
    title: "Pengikut & saksi dekat",
    description:
      "Banyak perempuan dan laki-laki mengikuti Yesus di luar daftar resmi kedua belas. Mereka melayani, mendengar, dan menjadi saksi kebangkitan — fondasi jemaat yang sering terlupakan.",
    slugs: [
      "maria-magdalena",
      "marta",
      "maria-betania",
      "nikodemus",
      "zakheus",
    ],
  },
  {
    id: "jemaat-mula",
    title: "Jemaat mula-mula",
    description:
      "Setelah Pentakosta, pelayanan jemaat melebar: diaken, penghibur, dan tuan rumah yang membuka rumah untuk persekutuan dan misi Paulus.",
    slugs: ["stefanus", "lidia", "priskila", "aquila"],
  },
  {
    id: "keluarga-yesus",
    title: "Keluarga & persiapan Injil",
    description:
      "Allah bekerja melalui keluarga dan nabi persiapan sebelum pelayanan Yesus — dari Maria yang menerima janji, Yosef yang melindungi, hingga Yohanes Pembaptis yang menyiapkan jalan.",
    slugs: ["maria", "yusuf-suami-maria", "yohanes-pembaptis"],
  },
];

export function getDiscipleSpotlight(slug: string) {
  return TWELVE_DISCIPLES.find((item) => item.slug === slug) ?? null;
}

export function getResolvedNotableGroups() {
  return OTHER_NOTABLE_PB_GROUPS.map((group) => ({
    ...group,
    characters: group.slugs
      .map((slug) => getBibleCharacter(slug))
      .filter((item): item is NonNullable<typeof item> => item !== null),
  })).filter((group) => group.characters.length > 0);
}

export function countTwelveDisciplesInCatalog() {
  return TWELVE_DISCIPLES.filter((item) => getBibleCharacter(item.slug)).length;
}
