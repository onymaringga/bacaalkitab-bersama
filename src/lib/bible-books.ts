export type BibleBook = {
  abbr: string;
  name: string;
  aliases: string[];
};

/** Pemetaan nama kitab (Indonesia / Inggris) ke singkatan Beeble/SABDA. */
export const BIBLE_BOOKS: BibleBook[] = [
  { abbr: "Kej", name: "Kejadian", aliases: ["genesis", "gen"] },
  { abbr: "Kel", name: "Keluaran", aliases: ["exodus", "exo"] },
  { abbr: "Im", name: "Imamat", aliases: ["leviticus", "lev"] },
  { abbr: "Bil", name: "Bilangan", aliases: ["numbers", "num"] },
  { abbr: "Ul", name: "Ulangan", aliases: ["deuteronomy", "deu"] },
  { abbr: "Jos", name: "Yosua", aliases: ["joshua", "jos"] },
  { abbr: "Hk", name: "Hakim-hakim", aliases: ["judges", "jdg"] },
  { abbr: "Rut", name: "Rut", aliases: ["ruth"] },
  { abbr: "1Sa", name: "1 Samuel", aliases: ["1 samuel", "1sam"] },
  { abbr: "2Sa", name: "2 Samuel", aliases: ["2 samuel", "2sam"] },
  { abbr: "1Ra", name: "1 Raja-raja", aliases: ["1 kings", "1ki"] },
  { abbr: "2Ra", name: "2 Raja-raja", aliases: ["2 kings", "2ki"] },
  { abbr: "1Ta", name: "1 Tawarikh", aliases: ["1 chronicles", "1ch"] },
  { abbr: "2Ta", name: "2 Tawarikh", aliases: ["2 chronicles", "2ch"] },
  { abbr: "Ezr", name: "Ezra", aliases: ["ezra"] },
  { abbr: "Ne", name: "Nehemia", aliases: ["nehemiah", "neh"] },
  { abbr: "Est", name: "Ester", aliases: ["esther", "est"] },
  { abbr: "Ay", name: "Ayub", aliases: ["job"] },
  { abbr: "Maz", name: "Mazmur", aliases: ["mazmur", "psalm", "psalms", "ps"] },
  { abbr: "Pnh", name: "Amsal", aliases: ["amsal", "proverbs", "pro"] },
  { abbr: "Pkh", name: "Pengkhotbah", aliases: ["ecclesiastes", "ecc"] },
  { abbr: "Kid", name: "Kidung Agung", aliases: ["song of songs", "sos"] },
  { abbr: "Yes", name: "Yesaya", aliases: ["isaiah", "isa"] },
  { abbr: "Yer", name: "Yeremia", aliases: ["jeremiah", "jer"] },
  { abbr: "Rat", name: "Ratapan", aliases: ["lamentations", "lam"] },
  { abbr: "Yeh", name: "Yehezkiel", aliases: ["ezekiel", "ezk"] },
  { abbr: "Dan", name: "Daniel", aliases: ["daniel", "dan"] },
  { abbr: "Ho", name: "Hosea", aliases: ["hosea", "hos"] },
  { abbr: "Yo", name: "Yoel", aliases: ["joel"] },
  { abbr: "Am", name: "Amos", aliases: ["amos"] },
  { abbr: "Ob", name: "Obaja", aliases: ["obadiah", "oba"] },
  { abbr: "Yun", name: "Yunus", aliases: ["jonah", "jon"] },
  { abbr: "Mi", name: "Mikha", aliases: ["micah", "mic"] },
  { abbr: "Na", name: "Nahum", aliases: ["nahum", "nah"] },
  { abbr: "Hab", name: "Habakuk", aliases: ["habakkuk", "hab"] },
  { abbr: "Zef", name: "Zefanya", aliases: ["zephaniah", "zep"] },
  { abbr: "Hag", name: "Hagai", aliases: ["haggai", "hag"] },
  { abbr: "Za", name: "Zakharia", aliases: ["zechariah", "zec"] },
  { abbr: "Mal", name: "Maleakhi", aliases: ["malachi", "mal"] },
  { abbr: "Mat", name: "Matius", aliases: ["matius", "matthew", "mat", "mt"] },
  { abbr: "Mrk", name: "Markus", aliases: ["markus", "mark", "mrk", "mk"] },
  { abbr: "Luk", name: "Lukas", aliases: ["lukas", "luke", "luk", "lk"] },
  { abbr: "Yoh", name: "Yohanes", aliases: ["yohanes", "john", "yoh", "jn"] },
  { abbr: "Kis", name: "Kisah Para Rasul", aliases: ["acts", "kisah"] },
  { abbr: "Rom", name: "Roma", aliases: ["romans", "rom"] },
  { abbr: "1Ko", name: "1 Korintus", aliases: ["1 korintus", "1 corinthians", "1co"] },
  { abbr: "2Ko", name: "2 Korintus", aliases: ["2 korintus", "2 corinthians", "2co"] },
  { abbr: "Gal", name: "Galatia", aliases: ["galatians", "gal"] },
  { abbr: "Ef", name: "Efesus", aliases: ["efesus", "ephesians", "eph"] },
  { abbr: "Fil", name: "Filipi", aliases: ["filipi", "philippians", "php"] },
  { abbr: "Kol", name: "Kolose", aliases: ["kolose", "colossians", "col"] },
  { abbr: "1Te", name: "1 Tesalonika", aliases: ["1 tesalonika", "1 thessalonians", "1th"] },
  { abbr: "2Te", name: "2 Tesalonika", aliases: ["2 tesalonika", "2 thessalonians", "2th"] },
  { abbr: "1Ti", name: "1 Timotius", aliases: ["1 timotius", "1 timothy", "1ti"] },
  { abbr: "2Ti", name: "2 Timotius", aliases: ["2 timotius", "2 timothy", "2ti"] },
  { abbr: "Tit", name: "Titus", aliases: ["titus"] },
  { abbr: "Flm", name: "Filemon", aliases: ["philemon", "phm"] },
  { abbr: "Ibr", name: "Ibrani", aliases: ["ibrani", "hebrews", "heb"] },
  { abbr: "Yaa", name: "Yakobus", aliases: ["yakobus", "james", "jas"] },
  { abbr: "1Pe", name: "1 Petrus", aliases: ["1 petrus", "1 peter", "1pe"] },
  { abbr: "2Pe", name: "2 Petrus", aliases: ["2 petrus", "2 peter", "2pe"] },
  { abbr: "1Yo", name: "1 Yohanes", aliases: ["1 yohanes", "1 john", "1jo"] },
  { abbr: "2Yo", name: "2 Yohanes", aliases: ["2 yohanes", "2 john", "2jo"] },
  { abbr: "3Yo", name: "3 Yohanes", aliases: ["3 yohanes", "3 john", "3jo"] },
  { abbr: "Yud", name: "Yudas", aliases: ["yudas", "jude"] },
  { abbr: "Why", name: "Wahyu", aliases: ["wahyu", "revelation", "rev"] },
];

const bookLookup = new Map<string, BibleBook>();

for (const book of BIBLE_BOOKS) {
  bookLookup.set(normalizeBookKey(book.name), book);
  bookLookup.set(normalizeBookKey(book.abbr), book);
  for (const alias of book.aliases) {
    bookLookup.set(normalizeBookKey(alias), book);
  }
}

function normalizeBookKey(value: string) {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

export function resolveBook(input: string): BibleBook | null {
  return bookLookup.get(normalizeBookKey(input)) ?? null;
}

export const BIBLE_VERSIONS = {
  tb: "Terjemahan Baru",
  bis: "Bahasa Indonesia Sehari-hari",
  tl: "Terjemahan Lama",
  toba: "Batak Toba",
  simalungun: "Batak Simalungun",
  karo: "Batak Karo",
} as const;

export type BibleVersionCode = keyof typeof BIBLE_VERSIONS;

/** Singkatan pendek untuk UI picker. */
export const BIBLE_VERSION_SHORT: Record<BibleVersionCode, string> = {
  tb: "TB",
  bis: "BIS",
  tl: "TL",
  toba: "Toba",
  simalungun: "Sim",
  karo: "Karo",
};

export const OLD_TESTAMENT_SIZE = 39;

export function getOldTestamentBooks() {
  return BIBLE_BOOKS.slice(0, OLD_TESTAMENT_SIZE);
}

export function getNewTestamentBooks() {
  return BIBLE_BOOKS.slice(OLD_TESTAMENT_SIZE);
}
