export type ImageSource = {
  /** Halaman sumber eksternal — opsional untuk ilustrasi asli. */
  url?: string;
  label: string;
  credit?: string;
};

export function unsplashSource(photoId: string): ImageSource {
  const hash = photoId.includes("-")
    ? photoId.split("-").slice(1).join("-")
    : photoId;
  return {
    url: `https://unsplash.com/photos/${hash}`,
    label: "Unsplash",
  };
}

export function wikimediaSearchSource(query: string, credit?: string): ImageSource {
  return {
    url: `https://commons.wikimedia.org/w/index.php?search=${encodeURIComponent(query)}&title=Special:MediaSearch&type=image`,
    label: "Wikimedia Commons",
    credit,
  };
}

export function originalComicSource(): ImageSource {
  return {
    label: "Ilustrasi komik asli",
  };
}

/** Kueri pencarian Wikimedia Commons per kisah (dari scripts/fetch-story-illustrations.mjs). */
const STORY_WIKIMEDIA_SEARCH: Record<string, string> = {
  penciptaan: "Creation of Adam Michelangelo Sistine",
  "air-bah": "Noah's Ark Deluge painting",
  "panggilan-abraham": "Sacrifice of Isaac Caravaggio",
  "yusuf-mesir": "Joseph recognized by his brothers Rembrandt",
  "keluaran-mesir": "Crossing of the Red Sea painting",
  "sepuluh-firman": "Moses receives Ten Commandments painting",
  yerikho: "Battle of Jericho trumpets painting",
  "rut-boas": "Ruth and Boaz biblical painting",
  "daud-goliat": "David and Goliath Caravaggio",
  "elia-karmel": "Elijah sacrifice Mount Carmel painting",
  "daniel-singa": "Daniel in the lions den Rubens",
  ester: "Esther before Ahasuerus painting",
  yunus: "Jonah and the whale painting",
  "kelahiran-yesus": "Adoration of the Shepherds Nativity painting",
  "khotbah-bukit": "Sermon on the Mount painting",
  "anak-hilang": "Return of the Prodigal Son Rembrandt",
  "salib-kebangkitan": "Crucifixion Resurrection Jesus painting",
  pentakosta: "Pentecost disciples painting",
  "paulus-damaskus": "Conversion of Saint Paul Caravaggio",
};

/** Kueri pencarian Wikimedia Commons per tokoh (dari scripts/fetch-character-portraits.mjs). */
const CHARACTER_WIKIMEDIA_SEARCH: Record<string, string> = {
  abraham: "Abraham biblical painting",
  sara: "Sarah Abraham biblical",
  ishak: "Isaac sacrifice painting",
  yakub: "Jacob biblical painting",
  yusuf: "Joseph Egypt biblical painting",
  musa: "Moses biblical painting",
  aaron: "Aaron priest biblical",
  yosua: "Joshua biblical painting",
  debora: "Deborah judge biblical",
  gideon: "Gideon biblical",
  rut: "Ruth Naomi biblical painting",
  samuel: "Samuel anoints David painting",
  "saul-raja": "King Saul David painting",
  daud: "David Goliath painting Caravaggio",
  salomo: "King Solomon temple painting",
  elias: "Elijah prophet painting",
  elisa: "Elisha prophet painting",
  yesaya: "Isaiah prophet Michelangelo",
  yeremia: "Jeremiah prophet painting",
  daniel: "Daniel lions den painting",
  ester: "Esther queen painting",
  nehemia: "Nehemiah Jerusalem painting",
  maria: "Madonna Virgin Mary painting",
  "yusuf-suami-maria": "Saint Joseph Mary painting",
  "yohanes-pembaptis": "Saint John the Baptist painting",
  petrus: "Saint Peter apostle painting",
  "yohanes-rasul": "Saint John apostle painting",
  paulus: "Saint Paul apostle Rembrandt",
  barnabas: "Saint Barnabas painting",
  "maria-magdalena": "Mary Magdalene painting",
  stefanus: "Saint Stephen martyr Rembrandt",
  timotius: "Timothy biblical",
  lidia: "Lydia Philippi conversion",
  nuh: "Noah ark painting",
  adam: "Adam creation Michelangelo",
  hawa: "Eve biblical painting",
  hagar: "Hagar Ishmael painting",
  lea: "Leah biblical",
  rahel: "Rachel biblical well",
  yehuda: "Judah biblical",
  miryam: "Miriam Moses sister",
  rahab: "Rahab Jericho spies",
  simson: "Samson Delilah Rubens",
  naomi: "Naomi Ruth painting",
  boas: "Boaz Ruth painting",
  yonatan: "David Jonathan painting",
  ayub: "Job suffering painting",
  yunus: "Jonah whale painting",
  ezra: "Ezra scribe law painting",
  hizkia: "Hezekiah king painting",
  andreas: "Saint Andrew apostle",
  yakobus: "Saint James apostle",
  tomas: "Doubting Thomas Caravaggio",
  marta: "Martha Mary Jesus painting",
  "maria-betania": "Mary anointing Jesus feet",
  nikodemus: "Nicodemus Jesus painting",
  zakheus: "Zacchaeus sycamore tree",
  priskila: "Priscilla Aquila Acts",
  silas: "Paul Silas prison",
  "yohanes-markus": "Saint Mark evangelist",
  aquila: "Aquila tentmaker Acts",
  yesus: "Crucifixion Resurrection Jesus painting",
};

const STORY_COMIC_ONLY = new Set(["ester", "keluaran-mesir", "penciptaan"]);

const CHARACTER_COMIC_ONLY = new Set([
  "adam",
  "ester",
  "hagar",
  "hawa",
  "lidia",
  "maria-magdalena",
  "naomi",
  "priskila",
  "simson",
  "yehuda",
  "yunus",
  "yusuf",
  "zakheus",
]);

const CHARACTER_STORY_IMAGE: Record<string, string> = {
  yesus: "salib-kebangkitan",
};

export function getStoryImageSource(slug: string): ImageSource {
  if (STORY_COMIC_ONLY.has(slug)) {
    return originalComicSource();
  }

  const query = STORY_WIKIMEDIA_SEARCH[slug];
  if (query) {
    return wikimediaSearchSource(query);
  }

  return wikimediaSearchSource(`${slug.replace(/-/g, " ")} biblical painting`);
}

export function getCharacterImageSource(slug: string): ImageSource {
  if (CHARACTER_COMIC_ONLY.has(slug)) {
    return originalComicSource();
  }

  const storySlug = CHARACTER_STORY_IMAGE[slug];
  if (storySlug) {
    return getStoryImageSource(storySlug);
  }

  const query = CHARACTER_WIKIMEDIA_SEARCH[slug];
  if (query) {
    return wikimediaSearchSource(query);
  }

  return wikimediaSearchSource(`${slug.replace(/-/g, " ")} biblical painting`);
}
