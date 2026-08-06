import type {
  BibleCharacter,
  BibleCharacterFamily,
  CharacterFamilyMember,
} from "@/lib/bible-characters";

export type { BibleCharacterFamily, CharacterFamilyMember };

export const CHARACTER_FAMILY: Record<string, BibleCharacterFamily> = {
  abraham: {
    father: { name: "Terah", note: "Kejadian 11:26–32" },
    spouse: [
      { slug: "sara", name: "Sara", note: "Istri utama" },
      { slug: "hagar", name: "Hagar", note: "Selir; ibu Ismael (Kejadian 16)" },
    ],
    children: [
      { slug: "ishak", name: "Ishak", note: "Anak perjanjian dari Sara" },
      { name: "Ismael", note: "Anak dari Hagar (Kejadian 16:15)" },
    ],
  },
  sara: {
    spouse: { slug: "abraham", name: "Abraham" },
    children: { slug: "ishak", name: "Ishak", note: "Kejadian 21:1–3" },
  },
  ishak: {
    father: { slug: "abraham", name: "Abraham" },
    mother: { slug: "sara", name: "Sara" },
    spouse: { name: "Ribka", note: "Kejadian 24:67" },
    children: [
      { name: "Esau", note: "Anak sulung (Kejadian 25:25)" },
      { slug: "yakub", name: "Yakub", note: "Anak bungsu (Kejadian 25:26)" },
    ],
  },
  yakub: {
    father: { slug: "ishak", name: "Ishak" },
    mother: { name: "Ribka", note: "Kejadian 25:20" },
    spouse: [
      { slug: "lea", name: "Lea", note: "Istri pertama (Kejadian 29:23)" },
      { slug: "rahel", name: "Rahel", note: "Istri kedua (Kejadian 29:28)" },
      { name: "Bilha", note: "Selir Rahel (Kejadian 30:4)" },
      { name: "Zilpa", note: "Selir Lea (Kejadian 30:9)" },
    ],
    siblings: { name: "Esau", note: "Saudara kembar (Kejadian 25:25–26)" },
    children: [
      { slug: "yehuda", name: "Yehuda", note: "Anak dari Lea" },
      { slug: "yusuf", name: "Yusuf", note: "Anak dari Rahel" },
      { name: "Ruben, Simeon, Lewi, Dan, Naftali, Gad, Asyer, Isakhar, Zebulon, Benyamin, Dinah", note: "Kejadian 29–30; 35:16–18" },
    ],
  },
  yusuf: {
    father: { slug: "yakub", name: "Yakub" },
    mother: { slug: "rahel", name: "Rahel", note: "Kejadian 30:22–24" },
    siblings: [
      { slug: "yehuda", name: "Yehuda" },
      { name: "Ruben, Simeon, Lewi, Dan, Naftali, Gad, Asyer, Isakhar, Zebulon, Benyamin, Dinah", note: "Sebelas saudara laki-laki dan Dinah (Kejadian 37:2)" },
    ],
    spouse: { name: "Asenath", note: "Putri Poti-Fera, imam On (Kejadian 41:45)" },
    children: [
      { name: "Manasse", note: "Kejadian 41:51" },
      { name: "Efraim", note: "Kejadian 41:52" },
    ],
  },
  musa: {
    father: { name: "Amram", note: "Keluaran 6:20" },
    mother: { name: "Yokebed", note: "Keluaran 6:20" },
    siblings: [
      { slug: "aaron", name: "Aaron" },
      { slug: "miryam", name: "Miryam", note: "Kakak perempuan (Bilangan 26:59)" },
    ],
    spouse: { name: "Sippra", note: "Putri Midian; Keluaran 2:21" },
    children: [
      { name: "Gersom", note: "Keluaran 2:22" },
      { name: "Eliezer", note: "Keluaran 18:4" },
    ],
  },
  aaron: {
    father: { name: "Amram", note: "Keluaran 6:20" },
    mother: { name: "Yokebed", note: "Keluaran 6:20" },
    siblings: [
      { slug: "musa", name: "Musa" },
      { slug: "miryam", name: "Miryam" },
    ],
    spouse: { name: "Elisabet", note: "Putri Aminadab; Keluaran 6:23" },
    children: [
      { name: "Nadab, Abihu, Eleazar, Itamar", note: "Keluaran 6:23–25" },
    ],
  },
  miryam: {
    father: { name: "Amram", note: "Keluaran 6:20" },
    mother: { name: "Yokebed", note: "Keluaran 6:20" },
    siblings: [
      { slug: "musa", name: "Musa" },
      { slug: "aaron", name: "Aaron" },
    ],
  },
  yosua: {
    father: { name: "Nun", note: "Keluaran 33:11; anak Nun" },
  },
  debora: {
    spouse: { name: "Lapidot", note: "Hakim-hakim 4:4" },
  },
  gideon: {
    father: { name: "Yoas", note: "Hakim-hakim 6:11; dari keluarga Abi-ezer" },
    children: { name: "Abimelekh dan 70 anak laki-laki", note: "Hakim-hakim 8:30–31; 9:5" },
  },
  rut: {
    spouse: [
      { name: "Mahlon", note: "Suami pertama; Rut 1:4–5" },
      { slug: "boas", name: "Boas", note: "Penebus keluarga; Rut 4:13" },
    ],
    inLaws: { slug: "naomi", name: "Naomi", note: "Mertua (Rut 1:16)" },
    children: { name: "Obed", note: "Nenek moyang Daud (Rut 4:17)" },
  },
  naomi: {
    spouse: { name: "Elimelekh", note: "Rut 1:2–3" },
    children: [
      { name: "Mahlon", note: "Rut 1:2, 5" },
      { name: "Kilion", note: "Rut 1:2, 5" },
    ],
    inLaws: { slug: "rut", name: "Rut", note: "Menantu perempuan (Rut 1:16)" },
  },
  boas: {
    spouse: { slug: "rut", name: "Rut", note: "Rut 4:13" },
    children: { name: "Obed", note: "Rut 4:13, 17" },
  },
  samuel: {
    father: { name: "Elkana", note: "1 Samuel 1:1" },
    mother: { name: "Hana", note: "1 Samuel 1:2, 20" },
    siblings: { name: "Anak-anak Elkana dari Penina", note: "1 Samuel 1:2, 4" },
    spouse: { name: "Tidak disebutkan", note: "1 Samuel 8:1–2" },
    children: [
      { name: "Yoel", note: "1 Samuel 8:2" },
      { name: "Abia", note: "1 Samuel 8:2" },
    ],
  },
  "saul-raja": {
    father: { name: "Kish", note: "1 Samuel 9:1; bani Abiel" },
    children: [
      { slug: "yonatan", name: "Yonatan", note: "1 Samuel 14:49" },
      { name: "Isyvi, Malkisua, Merab, Mikhal", note: "1 Samuel 14:49; 18:17" },
    ],
  },
  yonatan: {
    father: { slug: "saul-raja", name: "Saul", note: "1 Samuel 14:49" },
    siblings: [
      { name: "Isyvi, Malkisua", note: "Saudara laki-laki (1 Samuel 14:49)" },
      { name: "Merab, Mikhal", note: "Saudara perempuan (1 Samuel 14:49)" },
    ],
    children: { name: "Mefiboset", note: "2 Samuel 4:4; anak Yonatan" },
  },
  daud: {
    father: { name: "Yesse", note: "1 Samuel 16:1; bani Efrata" },
    siblings: { name: "Tujuh saudara laki-laki", note: "1 Samuel 16:10–11; 17:12–14" },
    spouse: [
      { name: "Mikhal", note: "Putri Saul (1 Samuel 18:27)" },
      { name: "Abigail", note: "Janda Nabal (1 Samuel 25:39–42)" },
      { name: "Batsyeba", note: "1 Samuel 11:3–5" },
      { name: "Ahinoam, Maakha, Hagit, Abital, Egla, dan istri-istri lain", note: "2 Samuel 3:2–5; 5:13" },
    ],
    children: [
      { slug: "salomo", name: "Salomo", note: "Anak dari Batsyeba (2 Samuel 12:24)" },
      { name: "Amnon, Absalom, Adonia, dan anak-anak lain", note: "2 Samuel 3:2–5; 13:1; 15:1" },
    ],
  },
  salomo: {
    father: { slug: "daud", name: "Daud" },
    mother: { name: "Batsyeba", note: "2 Samuel 12:24" },
    spouse: { name: "Putri Firaun dan banyak istri asing", note: "1 Raja-raja 3:1; 11:1–3" },
    children: { name: "Rehabeam", note: "1 Raja-raja 11:43; 14:21" },
  },
  elias: {},
  elisa: {
    father: { name: "Safat", note: "1 Raja-raja 19:16; dari Abel-Mehola" },
  },
  yesaya: {
    father: { name: "Amoz", note: "Yesaya 1:1" },
    children: { name: "Sye'ar-Yasyub, Maher-Syalal-Hasy-Baz", note: "Yesaya 7:3; 8:3" },
  },
  yeremia: {
    father: { name: "Hilkia", note: "Yeremia 1:1; imam dari Anatot" },
  },
  daniel: {},
  ester: {
    father: { name: "Abihail", note: "Ester 2:15; 9:29" },
    inLaws: { name: "Mordekhai", note: "Sepupu/pengasuh (Ester 2:7, 15)" },
    spouse: { name: "Ahasyweros (Artaxerxes)", note: "Raja Persia (Ester 2:17)" },
  },
  nehemia: {
    father: { name: "Hakalya", note: "Nehemia 1:1" },
    siblings: { name: "Hanani", note: "Nehemia 1:2; saudara" },
  },
  nuh: {
    father: { name: "Lamekh", note: "Kejadian 5:28–29" },
    spouse: { name: "Tidak disebutkan namanya", note: "Kejadian 6:18; 7:7" },
    children: [
      { name: "Sem", note: "Kejadian 5:32" },
      { name: "Ham", note: "Kejadian 5:32" },
      { name: "Yafet", note: "Kejadian 5:32" },
    ],
  },
  adam: {
    spouse: { slug: "hawa", name: "Hawa", note: "Kejadian 2:22–24" },
    children: [
      { name: "Kain", note: "Kejadian 4:1" },
      { name: "Habel", note: "Kejadian 4:2" },
      { name: "Set", note: "Kejadian 4:25" },
    ],
  },
  hawa: {
    spouse: { slug: "adam", name: "Adam", note: "Kejadian 2:22–24" },
    children: [
      { name: "Kain", note: "Kejadian 4:1" },
      { name: "Habel", note: "Kejadian 4:2" },
      { name: "Set", note: "Kejadian 4:25" },
    ],
  },
  hagar: {
    spouse: { slug: "abraham", name: "Abraham", note: "Selir (Kejadian 16:3)" },
    children: { name: "Ismael", note: "Kejadian 16:15" },
  },
  lea: {
    father: { name: "Laban", note: "Kejadian 29:16" },
    siblings: { slug: "rahel", name: "Rahel", note: "Saudara perempuan (Kejadian 29:16)" },
    spouse: { slug: "yakub", name: "Yakub", note: "Kejadian 29:23" },
    children: [
      { slug: "yehuda", name: "Yehuda" },
      { name: "Ruben, Simeon, Lewi, Isakhar, Zebulon, Dinah", note: "Kejadian 29:32–35; 30:17–21" },
    ],
  },
  rahel: {
    father: { name: "Laban", note: "Kejadian 29:16" },
    siblings: { slug: "lea", name: "Lea", note: "Saudara perempuan (Kejadian 29:16)" },
    spouse: { slug: "yakub", name: "Yakub", note: "Kejadian 29:28" },
    children: [
      { slug: "yusuf", name: "Yusuf", note: "Kejadian 30:22–24" },
      { name: "Benyamin", note: "Kejadian 35:16–18" },
    ],
  },
  yehuda: {
    father: { slug: "yakub", name: "Yakub" },
    mother: { slug: "lea", name: "Lea", note: "Kejadian 29:35" },
    siblings: [
      { slug: "yusuf", name: "Yusuf" },
      { name: "Ruben, Simeon, Lewi, Dan, Naftali, Gad, Asyer, Isakhar, Zebulon, Benyamin, Dinah", note: "Kejadian 35:23–26" },
    ],
    spouse: { name: "Tamar (menantu), lalu istri Kanaan", note: "Kejadian 38; 38:2" },
    children: [
      { name: "Er, Onan, Syela, Peretz, Zerakh", note: "Kejadian 38:3–30; 46:12" },
    ],
  },
  rahab: {
    spouse: { name: "Salmon", note: "Matius 1:5" },
    children: { name: "Boaz", note: "Matius 1:5; nenek moyang Daud" },
  },
  simson: {
    father: { name: "Manoah", note: "Hakim-hakim 13:2" },
    mother: { name: "Tidak disebutkan namanya", note: "Hakim-hakim 13:2–3" },
    spouse: { name: "Perempuan Timna", note: "Hakim-hakim 14:1–2" },
  },
  ayub: {
    spouse: { name: "Istri Ayub", note: "Tidak disebutkan namanya (Ayub 2:9; 19:17)" },
    children: [
      { name: "Tujuh anak laki-laki dan tiga anak perempuan", note: "Ayub 1:2; 42:13" },
    ],
  },
  yunus: {
    father: { name: "Amitai", note: "Yunus 1:1" },
  },
  ezra: {
    father: { name: "Seraya", note: "Ezra 7:1; garis keturunan imam" },
  },
  hizkia: {
    father: { name: "Ahaz", note: "2 Raja-raja 16:2; 18:1" },
    spouse: { name: "Tidak disebutkan namanya", note: "2 Raja-raja 20:18" },
    children: { name: "Manasye", note: "2 Raja-raja 20:21; 21:1" },
  },
  maria: {
    spouse: { slug: "yusuf-suami-maria", name: "Yusuf", note: "Matius 1:18–24" },
    children: { name: "Yesus", note: "Lukas 1:31; 2:7" },
  },
  "yusuf-suami-maria": {
    spouse: { slug: "maria", name: "Maria", note: "Matius 1:18–24" },
    children: { name: "Yesus", note: "Anak angkat/suami Maria (Matius 1:25; Lukas 2:33)" },
  },
  "yohanes-pembaptis": {
    father: { name: "Zakharia", note: "Lukas 1:5–13" },
    mother: { name: "Elisabet", note: "Lukas 1:5–13; kerabat Maria (Lukas 1:36)" },
    inLaws: { slug: "maria", name: "Maria", note: "Bibi/cerut (Lukas 1:36, 56)" },
  },
  petrus: {
    father: { name: "Yohanes (Yonas)", note: "Matius 16:17; Yohanes 1:42" },
    siblings: { slug: "andreas", name: "Andreas", note: "Matius 4:18; saudara" },
    spouse: { name: "Istri Petrus", note: "Tidak disebutkan namanya (1 Korintus 9:5)" },
  },
  andreas: {
    father: { name: "Yohanes (Yonas)", note: "Matius 4:18" },
    siblings: { slug: "petrus", name: "Petrus (Simon)", note: "Matius 4:18; saudara" },
  },
  "yohanes-rasul": {
    father: { name: "Zebedeus", note: "Matius 4:21" },
    mother: { name: "Salome", note: "Matius 27:56; bandingkan Markus 15:40" },
    siblings: { slug: "yakobus", name: "Yakobus", note: "Matius 4:21; saudara" },
  },
  yakobus: {
    father: { name: "Zebedeus", note: "Matius 4:21" },
    mother: { name: "Salome", note: "Matius 27:56" },
    siblings: { slug: "yohanes-rasul", name: "Yohanes", note: "Matius 4:21; saudara" },
  },
  paulus: {
    siblings: { name: "Saudara-saudara Paulus", note: "Roma 16:7, 11, 21 (kerabat)" },
  },
  barnabas: {
    siblings: { slug: "yohanes-markus", name: "Markus (Yohanes Markus)", note: "Kolose 4:10; sepupu" },
  },
  "maria-magdalena": {},
  stefanus: {},
  timotius: {
    father: { name: "Orang Yunani", note: "Tidak disebutkan namanya (Kisah Para Rasul 16:1)" },
    mother: { name: "Eunike", note: "2 Timotius 1:5; Yahudi yang percaya" },
    inLaws: { name: "Lois", note: "Nenek; 2 Timotius 1:5" },
  },
  lidia: {
    children: { name: "Seisi rumah tangga", note: "Kisah Para Rasul 16:15" },
  },
  filipus: {},
  bartolomeus: {
    siblings: { name: "Natanael", note: "Tradisi mengidentifikasi dengan Natanael (Yohanes 1:45–49)" },
  },
  matius: {},
  "yakobus-anak-alfius": {
    father: { name: "Alfius", note: "Matius 10:3; Markus 3:18" },
    siblings: { name: "Mungkin saudara Matius atau Simon Zelot", note: "Matius 10:3; tradisi bervariasi" },
  },
  "yudas-yakobus": {
    father: { name: "Yakobus", note: "Lukas 6:16; anak Yakobus" },
  },
  "simon-zelot": {
    father: { name: "Mungkin Alfius", note: "Tradisi mengaitkan dengan Yakobus anak Alfius" },
  },
  "yudas-iskariot": {
    father: { name: "Simon", note: "Yohanes 6:71; dari Kariot" },
  },
  matias: {},
  tomas: {},
  marta: {
    siblings: [
      { slug: "maria-betania", name: "Maria", note: "Yohanes 11:1; saudara perempuan" },
      { name: "Lazarus", note: "Yohanes 11:1; saudara laki-laki" },
    ],
  },
  "maria-betania": {
    siblings: [
      { slug: "marta", name: "Marta", note: "Yohanes 11:1" },
      { name: "Lazarus", note: "Yohanes 11:1" },
    ],
  },
  nikodemus: {},
  zakheus: {},
  priskila: {
    spouse: { slug: "aquila", name: "Akwila", note: "Kisah Para Rasul 18:2" },
  },
  aquila: {
    spouse: { slug: "priskila", name: "Priskila", note: "Kisah Para Rasul 18:2" },
  },
  silas: {},
  "yohanes-markus": {
    mother: { name: "Maria", note: "Kisah Para Rasul 12:12; ibu Markus" },
    siblings: { slug: "barnabas", name: "Barnabas", note: "Kolose 4:10; sepupu" },
  },
};

export function normalizeFamilyMembers(
  member?: CharacterFamilyMember | CharacterFamilyMember[],
): CharacterFamilyMember[] {
  if (!member) return [];
  return Array.isArray(member) ? member : [member];
}

export function getCharacterFamily(slug: string): BibleCharacterFamily {
  return CHARACTER_FAMILY[slug] ?? {};
}

export function applyCharacterFamily(character: BibleCharacter): BibleCharacter {
  const family = getCharacterFamily(character.slug);
  return { ...character, family };
}

export function hasFamilyInfo(family: BibleCharacterFamily): boolean {
  return (
    normalizeFamilyMembers(family.father).length > 0 ||
    normalizeFamilyMembers(family.mother).length > 0 ||
    normalizeFamilyMembers(family.spouse).length > 0 ||
    normalizeFamilyMembers(family.inLaws).length > 0 ||
    normalizeFamilyMembers(family.siblings).length > 0 ||
    normalizeFamilyMembers(family.children).length > 0
  );
}
