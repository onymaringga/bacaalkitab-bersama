/**
 * Metadata tokoh untuk pencarian & filter lanjutan.
 */

export type CharacterGender = "laki-laki" | "perempuan";

export type CharacterAgeAtDeath =
  | "muda"
  | "dewasa"
  | "paruh-baya"
  | "lanjut"
  | "sangat-lanjut"
  | "tidak-diketahui";

export type BibleCharacterMeta = {
  gender: CharacterGender;
  ageAtDeath: CharacterAgeAtDeath;
  /** Catatan usia spesifik, mis. "175 tahun" */
  ageNote?: string;
  birthPlace?: string;
  occupations: string[];
  /** Bidang gerak / peran utama */
  fields: string[];
  /** Kitab atau konteks cerita utama */
  storyContexts: string[];
};

export const CHARACTER_GENDER_OPTIONS: { value: CharacterGender; label: string }[] =
  [
    { value: "laki-laki", label: "Laki-laki" },
    { value: "perempuan", label: "Perempuan" },
  ];

export const CHARACTER_AGE_OPTIONS: {
  value: CharacterAgeAtDeath;
  label: string;
}[] = [
  { value: "muda", label: "Muda (<30 tahun)" },
  { value: "dewasa", label: "Dewasa (30–50 tahun)" },
  { value: "paruh-baya", label: "Paruh baya (51–80 tahun)" },
  { value: "lanjut", label: "Lanjut (81–120 tahun)" },
  { value: "sangat-lanjut", label: "Sangat lanjut (>120 tahun)" },
  { value: "tidak-diketahui", label: "Tidak diketahui" },
];

export const CHARACTER_BIRTH_PLACES = [
  "Ur",
  "Eden",
  "Mesir",
  "Kanaan",
  "Mesopotamia",
  "Betlehem",
  "Yerusalem",
  "Nazaret",
  "Galilea",
  "Kapernaum",
  "Babel",
  "Susa",
  "Moab",
  "Yerikho",
  "Tarsus",
  "Siprus",
  "Magdala",
  "Listra",
  "Thyatira",
  "Uz",
  "Gath-Hepher",
  "Betsaida",
  "Betania",
  "Roma",
  "Pontus",
  "Gilead",
  "Manasye",
  "Ramah",
  "Benyamin",
  "Zora",
  "Anatot",
  "Yehuda",
] as const;

export const CHARACTER_OCCUPATIONS = [
  "Patriarkh",
  "Gembala",
  "Raja",
  "Nabi",
  "Imam",
  "Hakim",
  "Rasul",
  "Nelayan",
  "Pejabat",
  "Pedagang",
  "Diaken",
  "Pendeta",
  "Pemungut cukai",
  "Penjahit",
  "Ibu rumah tangga",
  "Murid",
  "Tentara",
  "Pembuat kapal",
  "Petani",
  "Pembaptis",
] as const;

export const CHARACTER_FIELDS = [
  "Politik & pemerintahan",
  "Militer & peperangan",
  "Ibadah & imamat",
  "Nubuat & pengajaran",
  "Keluarga & rumah tangga",
  "Misi & jemaat",
  "Pekerjaan & ekonomi",
  "Hukum & keadilan",
  "Pemulihan & pembangunan",
] as const;

export const CHARACTER_STORY_CONTEXTS = [
  "Kejadian & patriarkh",
  "Keluaran & padang gurun",
  "Penaklukan & hakim",
  "Kerajaan Israel",
  "Nabi-nabi",
  "Pembuangan & pemulihan",
  "Injil & kehidupan Yesus",
  "Gereja mula-mula",
  "Kitab kebijaksanaan",
] as const;

export type CharacterFilterState = {
  gender: CharacterGender[];
  ageAtDeath: CharacterAgeAtDeath[];
  birthPlace: string[];
  occupation: string[];
  field: string[];
  storyContext: string[];
};

export const EMPTY_CHARACTER_FILTERS: CharacterFilterState = {
  gender: [],
  ageAtDeath: [],
  birthPlace: [],
  occupation: [],
  field: [],
  storyContext: [],
};

const META: Record<string, BibleCharacterMeta> = {
  abraham: {
    gender: "laki-laki",
    ageAtDeath: "sangat-lanjut",
    ageNote: "175 tahun",
    birthPlace: "Ur",
    occupations: ["Patriarkh", "Gembala"],
    fields: ["Keluarga & rumah tangga", "Ibadah & imamat"],
    storyContexts: ["Kejadian & patriarkh"],
  },
  sara: {
    gender: "perempuan",
    ageAtDeath: "lanjut",
    ageNote: "127 tahun",
    birthPlace: "Ur",
    occupations: ["Ibu rumah tangga"],
    fields: ["Keluarga & rumah tangga"],
    storyContexts: ["Kejadian & patriarkh"],
  },
  ishak: {
    gender: "laki-laki",
    ageAtDeath: "sangat-lanjut",
    ageNote: "180 tahun",
    birthPlace: "Kanaan",
    occupations: ["Patriarkh"],
    fields: ["Keluarga & rumah tangga"],
    storyContexts: ["Kejadian & patriarkh"],
  },
  yakub: {
    gender: "laki-laki",
    ageAtDeath: "lanjut",
    ageNote: "147 tahun",
    birthPlace: "Kanaan",
    occupations: ["Patriarkh", "Gembala"],
    fields: ["Keluarga & rumah tangga"],
    storyContexts: ["Kejadian & patriarkh"],
  },
  yusuf: {
    gender: "laki-laki",
    ageAtDeath: "lanjut",
    ageNote: "110 tahun",
    birthPlace: "Kanaan",
    occupations: ["Pejabat"],
    fields: ["Politik & pemerintahan", "Pekerjaan & ekonomi"],
    storyContexts: ["Kejadian & patriarkh"],
  },
  musa: {
    gender: "laki-laki",
    ageAtDeath: "lanjut",
    ageNote: "120 tahun",
    birthPlace: "Mesir",
    occupations: ["Nabi", "Pejabat"],
    fields: ["Hukum & keadilan", "Ibadah & imamat"],
    storyContexts: ["Keluaran & padang gurun"],
  },
  aaron: {
    gender: "laki-laki",
    ageAtDeath: "lanjut",
    ageNote: "123 tahun",
    birthPlace: "Mesir",
    occupations: ["Imam"],
    fields: ["Ibadah & imamat"],
    storyContexts: ["Keluaran & padang gurun"],
  },
  yosua: {
    gender: "laki-laki",
    ageAtDeath: "lanjut",
    ageNote: "110 tahun",
    birthPlace: "Mesir",
    occupations: ["Hakim"],
    fields: ["Militer & peperangan", "Politik & pemerintahan"],
    storyContexts: ["Penaklukan & hakim"],
  },
  debora: {
    gender: "perempuan",
    ageAtDeath: "tidak-diketahui",
    birthPlace: "Kanaan",
    occupations: ["Hakim", "Nabi"],
    fields: ["Hukum & keadilan", "Militer & peperangan"],
    storyContexts: ["Penaklukan & hakim"],
  },
  gideon: {
    gender: "laki-laki",
    ageAtDeath: "paruh-baya",
    birthPlace: "Manasye",
    occupations: ["Hakim"],
    fields: ["Militer & peperangan"],
    storyContexts: ["Penaklukan & hakim"],
  },
  rut: {
    gender: "perempuan",
    ageAtDeath: "tidak-diketahui",
    birthPlace: "Moab",
    occupations: ["Petani"],
    fields: ["Keluarga & rumah tangga", "Pekerjaan & ekonomi"],
    storyContexts: ["Penaklukan & hakim"],
  },
  samuel: {
    gender: "laki-laki",
    ageAtDeath: "lanjut",
    birthPlace: "Ramah",
    occupations: ["Nabi", "Hakim"],
    fields: ["Ibadah & imamat", "Politik & pemerintahan"],
    storyContexts: ["Kerajaan Israel"],
  },
  "saul-raja": {
    gender: "laki-laki",
    ageAtDeath: "dewasa",
    birthPlace: "Benyamin",
    occupations: ["Raja"],
    fields: ["Politik & pemerintahan", "Militer & peperangan"],
    storyContexts: ["Kerajaan Israel"],
  },
  daud: {
    gender: "laki-laki",
    ageAtDeath: "paruh-baya",
    ageNote: "70 tahun",
    birthPlace: "Betlehem",
    occupations: ["Raja", "Gembala"],
    fields: ["Politik & pemerintahan", "Militer & peperangan", "Ibadah & imamat"],
    storyContexts: ["Kerajaan Israel"],
  },
  salomo: {
    gender: "laki-laki",
    ageAtDeath: "lanjut",
    birthPlace: "Yerusalem",
    occupations: ["Raja"],
    fields: ["Politik & pemerintahan"],
    storyContexts: ["Kerajaan Israel", "Kitab kebijaksanaan"],
  },
  elias: {
    gender: "laki-laki",
    ageAtDeath: "tidak-diketahui",
    birthPlace: "Gilead",
    occupations: ["Nabi"],
    fields: ["Nubuat & pengajaran", "Ibadah & imamat"],
    storyContexts: ["Nabi-nabi"],
  },
  elisa: {
    gender: "laki-laki",
    ageAtDeath: "lanjut",
    birthPlace: "Kanaan",
    occupations: ["Nabi"],
    fields: ["Nubuat & pengajaran"],
    storyContexts: ["Nabi-nabi"],
  },
  yesaya: {
    gender: "laki-laki",
    ageAtDeath: "paruh-baya",
    birthPlace: "Yerusalem",
    occupations: ["Nabi"],
    fields: ["Nubuat & pengajaran"],
    storyContexts: ["Nabi-nabi"],
  },
  yeremia: {
    gender: "laki-laki",
    ageAtDeath: "lanjut",
    birthPlace: "Anatot",
    occupations: ["Nabi"],
    fields: ["Nubuat & pengajaran"],
    storyContexts: ["Nabi-nabi"],
  },
  daniel: {
    gender: "laki-laki",
    ageAtDeath: "lanjut",
    birthPlace: "Yerusalem",
    occupations: ["Nabi", "Pejabat"],
    fields: ["Politik & pemerintahan", "Nubuat & pengajaran"],
    storyContexts: ["Pembuangan & pemulihan"],
  },
  ester: {
    gender: "perempuan",
    ageAtDeath: "tidak-diketahui",
    birthPlace: "Susa",
    occupations: ["Pejabat"],
    fields: ["Politik & pemerintahan"],
    storyContexts: ["Pembuangan & pemulihan"],
  },
  nehemia: {
    gender: "laki-laki",
    ageAtDeath: "lanjut",
    birthPlace: "Susa",
    occupations: ["Pejabat"],
    fields: ["Pemulihan & pembangunan", "Politik & pemerintahan"],
    storyContexts: ["Pembuangan & pemulihan"],
  },
  yesus: {
    gender: "laki-laki",
    ageAtDeath: "paruh-baya",
    birthPlace: "Betlehem",
    occupations: ["Guru", "Nabi"],
    fields: ["Misi & jemaat", "Nubuat & pengajaran"],
    storyContexts: ["Injil & kehidupan Yesus", "Gereja mula-mula"],
  },
  maria: {
    gender: "perempuan",
    ageAtDeath: "lanjut",
    birthPlace: "Nazaret",
    occupations: ["Ibu rumah tangga"],
    fields: ["Keluarga & rumah tangga", "Ibadah & imamat"],
    storyContexts: ["Injil & kehidupan Yesus"],
  },
  "yusuf-suami-maria": {
    gender: "laki-laki",
    ageAtDeath: "tidak-diketahui",
    birthPlace: "Nazaret",
    occupations: ["Penjahit"],
    fields: ["Keluarga & rumah tangga", "Pekerjaan & ekonomi"],
    storyContexts: ["Injil & kehidupan Yesus"],
  },
  "yohanes-pembaptis": {
    gender: "laki-laki",
    ageAtDeath: "dewasa",
    birthPlace: "Yehuda",
    occupations: ["Nabi", "Pembaptis"],
    fields: ["Ibadah & imamat", "Nubuat & pengajaran"],
    storyContexts: ["Injil & kehidupan Yesus"],
  },
  petrus: {
    gender: "laki-laki",
    ageAtDeath: "paruh-baya",
    birthPlace: "Kapernaum",
    occupations: ["Rasul", "Nelayan"],
    fields: ["Misi & jemaat"],
    storyContexts: ["Injil & kehidupan Yesus", "Gereja mula-mula"],
  },
  "yohanes-rasul": {
    gender: "laki-laki",
    ageAtDeath: "lanjut",
    birthPlace: "Galilea",
    occupations: ["Rasul"],
    fields: ["Misi & jemaat", "Ibadah & imamat"],
    storyContexts: ["Injil & kehidupan Yesus", "Gereja mula-mula"],
  },
  paulus: {
    gender: "laki-laki",
    ageAtDeath: "paruh-baya",
    birthPlace: "Tarsus",
    occupations: ["Rasul", "Tentara"],
    fields: ["Misi & jemaat", "Nubuat & pengajaran"],
    storyContexts: ["Gereja mula-mula"],
  },
  barnabas: {
    gender: "laki-laki",
    ageAtDeath: "tidak-diketahui",
    birthPlace: "Siprus",
    occupations: ["Rasul"],
    fields: ["Misi & jemaat"],
    storyContexts: ["Gereja mula-mula"],
  },
  "maria-magdalena": {
    gender: "perempuan",
    ageAtDeath: "tidak-diketahui",
    birthPlace: "Magdala",
    occupations: ["Murid"],
    fields: ["Misi & jemaat", "Ibadah & imamat"],
    storyContexts: ["Injil & kehidupan Yesus"],
  },
  stefanus: {
    gender: "laki-laki",
    ageAtDeath: "muda",
    birthPlace: "Yerusalem",
    occupations: ["Diaken"],
    fields: ["Misi & jemaat", "Ibadah & imamat"],
    storyContexts: ["Gereja mula-mula"],
  },
  timotius: {
    gender: "laki-laki",
    ageAtDeath: "paruh-baya",
    birthPlace: "Listra",
    occupations: ["Pendeta"],
    fields: ["Misi & jemaat"],
    storyContexts: ["Gereja mula-mula"],
  },
  lidia: {
    gender: "perempuan",
    ageAtDeath: "tidak-diketahui",
    birthPlace: "Thyatira",
    occupations: ["Pedagang"],
    fields: ["Pekerjaan & ekonomi", "Misi & jemaat"],
    storyContexts: ["Gereja mula-mula"],
  },
  nuh: {
    gender: "laki-laki",
    ageAtDeath: "sangat-lanjut",
    ageNote: "950 tahun",
    occupations: ["Pembuat kapal", "Petani"],
    fields: ["Keluarga & rumah tangga"],
    storyContexts: ["Kejadian & patriarkh"],
  },
  adam: {
    gender: "laki-laki",
    ageAtDeath: "sangat-lanjut",
    ageNote: "930 tahun",
    birthPlace: "Eden",
    occupations: ["Petani"],
    fields: ["Keluarga & rumah tangga"],
    storyContexts: ["Kejadian & patriarkh"],
  },
  hawa: {
    gender: "perempuan",
    ageAtDeath: "tidak-diketahui",
    birthPlace: "Eden",
    occupations: ["Ibu rumah tangga"],
    fields: ["Keluarga & rumah tangga"],
    storyContexts: ["Kejadian & patriarkh"],
  },
  hagar: {
    gender: "perempuan",
    ageAtDeath: "tidak-diketahui",
    birthPlace: "Mesir",
    occupations: ["Ibu rumah tangga"],
    fields: ["Keluarga & rumah tangga"],
    storyContexts: ["Kejadian & patriarkh"],
  },
  lea: {
    gender: "perempuan",
    ageAtDeath: "lanjut",
    birthPlace: "Mesopotamia",
    occupations: ["Ibu rumah tangga"],
    fields: ["Keluarga & rumah tangga"],
    storyContexts: ["Kejadian & patriarkh"],
  },
  rahel: {
    gender: "perempuan",
    ageAtDeath: "dewasa",
    birthPlace: "Mesopotamia",
    occupations: ["Ibu rumah tangga"],
    fields: ["Keluarga & rumah tangga"],
    storyContexts: ["Kejadian & patriarkh"],
  },
  yehuda: {
    gender: "laki-laki",
    ageAtDeath: "lanjut",
    birthPlace: "Kanaan",
    occupations: ["Patriarkh"],
    fields: ["Keluarga & rumah tangga"],
    storyContexts: ["Kejadian & patriarkh"],
  },
  miryam: {
    gender: "perempuan",
    ageAtDeath: "tidak-diketahui",
    birthPlace: "Mesir",
    occupations: ["Nabi"],
    fields: ["Ibadah & imamat"],
    storyContexts: ["Keluaran & padang gurun"],
  },
  rahab: {
    gender: "perempuan",
    ageAtDeath: "tidak-diketahui",
    birthPlace: "Yerikho",
    occupations: ["Ibu rumah tangga"],
    fields: ["Militer & peperangan", "Keluarga & rumah tangga"],
    storyContexts: ["Penaklukan & hakim"],
  },
  simson: {
    gender: "laki-laki",
    ageAtDeath: "dewasa",
    birthPlace: "Zora",
    occupations: ["Hakim"],
    fields: ["Militer & peperangan"],
    storyContexts: ["Penaklukan & hakim"],
  },
  naomi: {
    gender: "perempuan",
    ageAtDeath: "lanjut",
    birthPlace: "Betlehem",
    occupations: ["Ibu rumah tangga"],
    fields: ["Keluarga & rumah tangga"],
    storyContexts: ["Penaklukan & hakim"],
  },
  boas: {
    gender: "laki-laki",
    ageAtDeath: "lanjut",
    birthPlace: "Betlehem",
    occupations: ["Petani"],
    fields: ["Pekerjaan & ekonomi", "Keluarga & rumah tangga"],
    storyContexts: ["Penaklukan & hakim"],
  },
  yonatan: {
    gender: "laki-laki",
    ageAtDeath: "dewasa",
    birthPlace: "Benyamin",
    occupations: ["Tentara"],
    fields: ["Militer & peperangan", "Politik & pemerintahan"],
    storyContexts: ["Kerajaan Israel"],
  },
  ayub: {
    gender: "laki-laki",
    ageAtDeath: "lanjut",
    birthPlace: "Uz",
    occupations: ["Petani"],
    fields: ["Keluarga & rumah tangga"],
    storyContexts: ["Kitab kebijaksanaan"],
  },
  yunus: {
    gender: "laki-laki",
    ageAtDeath: "tidak-diketahui",
    birthPlace: "Gath-Hepher",
    occupations: ["Nabi"],
    fields: ["Nubuat & pengajaran"],
    storyContexts: ["Nabi-nabi"],
  },
  ezra: {
    gender: "laki-laki",
    ageAtDeath: "lanjut",
    birthPlace: "Babel",
    occupations: ["Imam"],
    fields: ["Pemulihan & pembangunan", "Ibadah & imamat"],
    storyContexts: ["Pembuangan & pemulihan"],
  },
  hizkia: {
    gender: "laki-laki",
    ageAtDeath: "lanjut",
    birthPlace: "Yerusalem",
    occupations: ["Raja"],
    fields: ["Politik & pemerintahan", "Ibadah & imamat"],
    storyContexts: ["Kerajaan Israel", "Nabi-nabi"],
  },
  andreas: {
    gender: "laki-laki",
    ageAtDeath: "paruh-baya",
    birthPlace: "Betsaida",
    occupations: ["Rasul", "Nelayan"],
    fields: ["Misi & jemaat"],
    storyContexts: ["Injil & kehidupan Yesus", "Gereja mula-mula"],
  },
  yakobus: {
    gender: "laki-laki",
    ageAtDeath: "paruh-baya",
    birthPlace: "Yerusalem",
    occupations: ["Rasul", "Pendeta"],
    fields: ["Misi & jemaat", "Ibadah & imamat"],
    storyContexts: ["Gereja mula-mula"],
  },
  tomas: {
    gender: "laki-laki",
    ageAtDeath: "paruh-baya",
    birthPlace: "Galilea",
    occupations: ["Rasul"],
    fields: ["Misi & jemaat"],
    storyContexts: ["Injil & kehidupan Yesus"],
  },
  filipus: {
    gender: "laki-laki",
    ageAtDeath: "paruh-baya",
    birthPlace: "Betsaida",
    occupations: ["Rasul"],
    fields: ["Misi & jemaat"],
    storyContexts: ["Injil & kehidupan Yesus"],
  },
  bartolomeus: {
    gender: "laki-laki",
    ageAtDeath: "paruh-baya",
    birthPlace: "Kanaan",
    occupations: ["Rasul"],
    fields: ["Misi & jemaat"],
    storyContexts: ["Injil & kehidupan Yesus"],
  },
  matius: {
    gender: "laki-laki",
    ageAtDeath: "paruh-baya",
    birthPlace: "Kapernaum",
    occupations: ["Rasul", "Pemungut cukai"],
    fields: ["Misi & jemaat", "Pekerjaan & ekonomi"],
    storyContexts: ["Injil & kehidupan Yesus"],
  },
  "yakobus-anak-alfius": {
    gender: "laki-laki",
    ageAtDeath: "tidak-diketahui",
    birthPlace: "Galilea",
    occupations: ["Rasul"],
    fields: ["Misi & jemaat"],
    storyContexts: ["Injil & kehidupan Yesus", "Gereja mula-mula"],
  },
  "yudas-yakobus": {
    gender: "laki-laki",
    ageAtDeath: "paruh-baya",
    birthPlace: "Galilea",
    occupations: ["Rasul"],
    fields: ["Misi & jemaat"],
    storyContexts: ["Injil & kehidupan Yesus"],
  },
  "simon-zelot": {
    gender: "laki-laki",
    ageAtDeath: "paruh-baya",
    birthPlace: "Galilea",
    occupations: ["Rasul"],
    fields: ["Misi & jemaat", "Politik & pemerintahan"],
    storyContexts: ["Injil & kehidupan Yesus"],
  },
  "yudas-iskariot": {
    gender: "laki-laki",
    ageAtDeath: "paruh-baya",
    birthPlace: "Yehuda",
    occupations: ["Rasul"],
    fields: ["Misi & jemaat"],
    storyContexts: ["Injil & kehidupan Yesus"],
  },
  matias: {
    gender: "laki-laki",
    ageAtDeath: "paruh-baya",
    birthPlace: "Yerusalem",
    occupations: ["Rasul"],
    fields: ["Misi & jemaat"],
    storyContexts: ["Gereja mula-mula"],
  },
  marta: {
    gender: "perempuan",
    ageAtDeath: "tidak-diketahui",
    birthPlace: "Betania",
    occupations: ["Ibu rumah tangga"],
    fields: ["Keluarga & rumah tangga", "Ibadah & imamat"],
    storyContexts: ["Injil & kehidupan Yesus"],
  },
  "maria-betania": {
    gender: "perempuan",
    ageAtDeath: "tidak-diketahui",
    birthPlace: "Betania",
    occupations: ["Murid"],
    fields: ["Ibadah & imamat", "Keluarga & rumah tangga"],
    storyContexts: ["Injil & kehidupan Yesus"],
  },
  nikodemus: {
    gender: "laki-laki",
    ageAtDeath: "lanjut",
    birthPlace: "Yerusalem",
    occupations: ["Pejabat"],
    fields: ["Hukum & keadilan", "Ibadah & imamat"],
    storyContexts: ["Injil & kehidupan Yesus"],
  },
  zakheus: {
    gender: "laki-laki",
    ageAtDeath: "paruh-baya",
    birthPlace: "Yerikho",
    occupations: ["Pemungut cukai"],
    fields: ["Pekerjaan & ekonomi"],
    storyContexts: ["Injil & kehidupan Yesus"],
  },
  priskila: {
    gender: "perempuan",
    ageAtDeath: "tidak-diketahui",
    birthPlace: "Roma",
    occupations: ["Penjahit"],
    fields: ["Misi & jemaat", "Pekerjaan & ekonomi"],
    storyContexts: ["Gereja mula-mula"],
  },
  silas: {
    gender: "laki-laki",
    ageAtDeath: "tidak-diketahui",
    birthPlace: "Yerusalem",
    occupations: ["Nabi"],
    fields: ["Misi & jemaat"],
    storyContexts: ["Gereja mula-mula"],
  },
  "yohanes-markus": {
    gender: "laki-laki",
    ageAtDeath: "paruh-baya",
    birthPlace: "Yerusalem",
    occupations: ["Rasul"],
    fields: ["Misi & jemaat"],
    storyContexts: ["Gereja mula-mula"],
  },
  aquila: {
    gender: "laki-laki",
    ageAtDeath: "tidak-diketahui",
    birthPlace: "Pontus",
    occupations: ["Penjahit"],
    fields: ["Misi & jemaat", "Pekerjaan & ekonomi"],
    storyContexts: ["Gereja mula-mula"],
  },
};

export function getCharacterMeta(slug: string): BibleCharacterMeta | null {
  return META[slug] ?? null;
}

export function characterAgeLabel(age: CharacterAgeAtDeath, note?: string) {
  const base =
    CHARACTER_AGE_OPTIONS.find((item) => item.value === age)?.label ?? age;
  return note ? `${base} · ${note}` : base;
}

function matchesScalarFilter<T>(selected: T[], value: T | undefined) {
  if (selected.length === 0) return true;
  return value !== undefined && selected.includes(value);
}

function matchesArrayOverlap(
  selected: string[],
  metaValues: readonly string[],
) {
  if (selected.length === 0) return true;
  return selected.some((item) => metaValues.includes(item));
}

export function countActiveCharacterFilters(filters: CharacterFilterState) {
  return (
    filters.gender.length +
    filters.ageAtDeath.length +
    filters.birthPlace.length +
    filters.occupation.length +
    filters.field.length +
    filters.storyContext.length
  );
}

export function hasActiveCharacterFilters(filters: CharacterFilterState) {
  return countActiveCharacterFilters(filters) > 0;
}

export function matchesCharacterFilters(
  slug: string,
  filters: CharacterFilterState,
) {
  if (!hasActiveCharacterFilters(filters)) return true;
  const meta = getCharacterMeta(slug);
  if (!meta) return false;

  if (!matchesScalarFilter(filters.gender, meta.gender)) return false;
  if (!matchesScalarFilter(filters.ageAtDeath, meta.ageAtDeath)) return false;
  if (!matchesScalarFilter(filters.birthPlace, meta.birthPlace)) return false;
  if (!matchesArrayOverlap(filters.occupation, meta.occupations)) return false;
  if (!matchesArrayOverlap(filters.field, meta.fields)) return false;
  if (!matchesArrayOverlap(filters.storyContext, meta.storyContexts)) {
    return false;
  }
  return true;
}
