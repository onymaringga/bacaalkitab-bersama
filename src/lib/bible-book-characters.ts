/**
 * Tokoh utama yang terlibat per kitab — untuk halaman Sejarah Kitab.
 * Digabung ke pengantar di bible-book-intros.ts.
 */

export type BibleBookCharacter = {
  name: string;
  /** Peran singkat dalam kitab ini */
  role: string;
};

export const BIBLE_BOOK_CHARACTERS: Record<string, BibleBookCharacter[]> = {
  Kej: [
    { name: "Adam & Hawa", role: "Manusia pertama; kejatuhan ke dalam dosa" },
    { name: "Nuh", role: "Diselamatkan dari air bah; perjanjian pelangi" },
    { name: "Abraham", role: "Bapa perjanjian; dipanggil agar berkat sampai ke bangsa-bangsa" },
    { name: "Sara", role: "Istri Abraham; ibu Ishak" },
    { name: "Ishak & Ribka", role: "Generasi perjanjian berikutnya" },
    { name: "Yakub (Israel)", role: "Bapa dua belas suku; bergumul dengan Allah" },
    { name: "Yusuf", role: "Dijual ke Mesir; dipakai Allah menyelamatkan keluarga" },
  ],
  Kel: [
    { name: "Musa", role: "Pemimpin pembebasan; perantara perjanjian Sinai" },
    { name: "Harun", role: "Saudara Musa; imam besar pertama" },
    { name: "Miryam", role: "Saudari Musa; pemimpin nyanyian setelah Laut Teberau" },
    { name: "Firaun", role: "Raja Mesir yang menindas dan menolak melepaskan Israel" },
    { name: "Yitro", role: "Mertua Musa; menasihati soal kepemimpinan" },
  ],
  Im: [
    { name: "Musa", role: "Menyampaikan peraturan kekudusan dari Tuhan" },
    { name: "Harun", role: "Imam besar; ditahbiskan bersama anak-anaknya" },
    { name: "Nadab & Abihu", role: "Anak Harun yang mati karena api yang asing" },
  ],
  Bil: [
    { name: "Musa", role: "Pemimpin di padang gurun" },
    { name: "Harun & Miryam", role: "Keluarga Musa; sempat menentang, lalu dipulihkan" },
    { name: "Yosua & Kaleb", role: "Pengintai yang percaya; masuk tanah perjanjian" },
    { name: "Bileam", role: "Nabi bayaran yang dipaksa memberkati Israel" },
    { name: "Korah", role: "Pemimpin pemberontakan melawan Musa" },
  ],
  Ul: [
    { name: "Musa", role: "Pengkhotbah perpisahan; mengulang hukum dan perjanjian" },
    { name: "Yosua", role: "Penerus Musa yang akan memimpin masuk Kanaan" },
  ],
  Jos: [
    { name: "Yosua", role: "Pemimpin penaklukan dan pembagian tanah" },
    { name: "Rahab", role: "Perempuan Yerikho yang menolong pengintai; diselamatkan" },
    { name: "Kaleb", role: "Menerima Hebron sebagai warisan karena iman" },
    { name: "Akhan", role: "Mengambil barang terkutuk; mendatangkan penghakiman" },
  ],
  Hk: [
    { name: "Debora", role: "Hakim dan nabi perempuan; memimpin bersama Barak" },
    { name: "Gideon", role: "Hakim yang mengalahkan Midian dengan pasukan kecil" },
    { name: "Yefta", role: "Hakim yang menang melawan Amon; nazar tragis" },
    { name: "Simson", role: "Hakim berkekuatan besar; konflik dengan orang Filistin" },
    { name: "Samuel (latar)", role: "Zaman hakim berakhir menjelang Samuel di kitab berikutnya" },
  ],
  Rut: [
    { name: "Rut", role: "Janda Moab yang setia; nenek moyang Daud" },
    { name: "Naomi", role: "Mertua Rut; dari kepahitan menuju pemulihan" },
    { name: "Boas", role: "Penebus keluarga; menikahi Rut" },
  ],
  "1Sa": [
    { name: "Samuel", role: "Nabi, imam, dan hakim terakhir; mengurapi raja" },
    { name: "Hana", role: "Ibu Samuel yang berdoa di Silo" },
    { name: "Saul", role: "Raja pertama Israel; ditolak karena ketidaktaatan" },
    { name: "Daud", role: "Digembala menjadi raja pilihan Allah" },
    { name: "Yonatan", role: "Putra Saul; sahabat setia Daud" },
  ],
  "2Sa": [
    { name: "Daud", role: "Raja di Yerusalem; menerima perjanjian takhta" },
    { name: "Batsyeba", role: "Istri Uria yang diambil Daud; ibu Salomo" },
    { name: "Natan", role: "Nabi yang menegur dosa Daud" },
    { name: "Absalom", role: "Putra Daud yang memberontak" },
    { name: "Yoab", role: "Panglima Daud" },
  ],
  "1Ra": [
    { name: "Salomo", role: "Raja hikmat; membangun Bait Suci, lalu jatuh" },
    { name: "Yerobeam", role: "Raja pertama kerajaan Utara; mendirikan anak lembu" },
    { name: "Rehobeam", role: "Putra Salomo; kerajaan terpecah di masanya" },
    { name: "Elia", role: "Nabi yang melawan Baal di Gunung Karmel" },
    { name: "Ahab & Izebel", role: "Raja dan ratu Utara yang mendorong penyembahan Baal" },
  ],
  "2Ra": [
    { name: "Elisa", role: "Penerus Elia; banyak mujizat dan pelayanan nabi" },
    { name: "Hizkia", role: "Raja Yehuda yang setia; diselamatkan dari Asyur" },
    { name: "Yosia", role: "Raja reformasi; menemukan kembali kitab Taurat" },
    { name: "Nebukadnezar", role: "Raja Babel yang menghancurkan Yerusalem" },
  ],
  "1Ta": [
    { name: "Daud", role: "Fokus ibadah, Lewi, dan persiapan Bait" },
    { name: "Para Lewi & penyanyi", role: "Ditata untuk pelayanan di hadapan Tuhan" },
    { name: "Salomo", role: "Ditunjuk membangun Bait Suci" },
  ],
  "2Ta": [
    { name: "Salomo", role: "Membangun dan mendedikasikan Bait" },
    { name: "Asa, Yosafat, Hizkia, Yosia", role: "Raja-raja Yehuda yang dikenal karena reformasi" },
    { name: "Koresy", role: "Raja Persia yang mengizinkan pembangunan kembali" },
  ],
  Ezr: [
    { name: "Ezra", role: "Imam-ahli Taurat; memimpin pembaruan umat" },
    { name: "Zerubabel", role: "Pemimpin rombongan pertama; membangun altar dan Bait" },
    { name: "Yesua", role: "Imam besar yang bersama Zerubabel" },
    { name: "Koresy & Artahsasta", role: "Raja Persia yang mendukung pemulihan" },
  ],
  Ne: [
    { name: "Nehemia", role: "Bupati yang membangun kembali tembok Yerusalem" },
    { name: "Ezra", role: "Membacakan Taurat dan memimpin pertobatan" },
    { name: "Sanbalat & Tobia", role: "Lawanan terhadap pembangunan tembok" },
  ],
  Est: [
    { name: "Ester", role: "Ratu Persia yang memberanikan diri menyelamatkan bangsanya" },
    { name: "Mordekhai", role: "Paman Ester; menolak sujud kepada Haman" },
    { name: "Haman", role: "Pejabat yang merencanakan pemusnahan orang Yahudi" },
    { name: "Ahasyweros", role: "Raja Persia dalam kisah ini" },
  ],
  Ay: [
    { name: "Ayub", role: "Orang saleh yang menderita; bergumul soal keadilan Allah" },
    { name: "Elifas, Bildad, Zofar", role: "Teman-teman yang menasihati secara keliru" },
    { name: "Elihu", role: "Pembicara muda sebelum Tuhan menjawab" },
    { name: "Iblis", role: "Penggugat yang menguji kesalehan Ayub" },
  ],
  Maz: [
    { name: "Daud", role: "Penulis banyak mazmur; raja yang berdoa dan bernyanyi" },
    { name: "Asaf", role: "Pemimpin nyanyian; beberapa mazmur atas namanya" },
    { name: "Anak-anak Korah", role: "Penulis/penyanyi mazmur ibadah" },
    { name: "Salomo & Musa", role: "Dikaitkan dengan beberapa mazmur tertentu" },
  ],
  Pnh: [
    { name: "Salomo", role: "Sumber utama tradisi hikmat dalam Amsal" },
    { name: "Agur & Lemuel", role: "Penulis bagian akhir kitab" },
    { name: "Si Hikmat & Si Bodoh", role: "Tokoh personifikasi dalam pengajaran" },
  ],
  Pkh: [
    { name: "Pengkhotbah (Kohelet)", role: "Suara utama; merenungkan arti hidup “di bawah matahari”" },
    { name: "Salomo (tradisi)", role: "Sering dikaitkan sebagai raja hikmat di balik kitab ini" },
  ],
  Kid: [
    { name: "Mempelai perempuan", role: "Suara cinta yang mencari dan bersukacita" },
    { name: "Mempelai laki-laki", role: "Kekasih yang dipuji dan dinantikan" },
    { name: "Salomo (tradisi)", role: "Sering dikaitkan dengan latar/raja dalam kidung" },
  ],
  Yes: [
    { name: "Yesaya", role: "Nabi Yehuda; penglihatan tentang kudus-Nya Tuhan dan Hamba Tuhan" },
    { name: "Hizkia", role: "Raja yang berdoa saat Asyur mengepung" },
    { name: "Ahas", role: "Raja yang tidak percaya; menerima tanda Imanuel" },
  ],
  Yer: [
    { name: "Yeremia", role: "Nabi yang menangis; memanggil Yehuda bertobat sebelum Babel" },
    { name: "Barukh", role: "Sekretaris Yeremia yang menulis nubuat" },
    { name: "Zedekia", role: "Raja terakhir Yehuda sebelum kejatuhan Yerusalem" },
  ],
  Rat: [
    { name: "Yeremia (tradisi)", role: "Sering dikaitkan sebagai penulis ratapan atas Yerusalem" },
    { name: "Umat Yehuda", role: "Suara kolektif yang berkabung di tengah reruntuhan" },
  ],
  Yeh: [
    { name: "Yehezkiel", role: "Nabi-imam di pembuangan; penglihatan kemuliaan dan bait baru" },
    { name: "Umat di Babel", role: "Penerima pesan penghakiman dan harapan pemulihan" },
  ],
  Dan: [
    { name: "Daniel", role: "Setia di istana Babel/Persia; menerima penglihatan kerajaan Allah" },
    { name: "Sadrakh, Mesakh, Abednego", role: "Teman Daniel; selamat dari perapian" },
    { name: "Nebukadnezar", role: "Raja Babel yang belajar tentang kedaulatan Allah" },
    { name: "Belshazar & Darius", role: "Penguasa dalam kisah tulisan di dinding dan gua singa" },
  ],
  Ho: [
    { name: "Hosea", role: "Nabi yang hidupnya menjadi tanda kasih Allah yang setia" },
    { name: "Gomer", role: "Istri Hosea; gambaran Israel yang tidak setia" },
  ],
  Yo: [
    { name: "Yoel", role: "Nabi yang memanggil pertobatan di tengah bencana belalang" },
    { name: "Umat Yehuda", role: "Dipanggil meratap dan kembali kepada Tuhan" },
  ],
  Am: [
    { name: "Amos", role: "Gembala dari Tekoa; menegur ketidakadilan di Israel Utara" },
    { name: "Yerobeam II", role: "Raja di masa kemakmuran yang penuh penindasan" },
  ],
  Ob: [
    { name: "Obaja", role: "Nabi yang mengumumkan penghakiman atas Edom" },
    { name: "Edom", role: "Bangsa yang digambarkan sombong terhadap Yehuda" },
  ],
  Yun: [
    { name: "Yunus", role: "Nabi yang lari dari panggilan; belajar tentang belas kasihan Allah" },
    { name: "Pelaut-pelaut", role: "Bertobat saat badai; kontras dengan Yunus" },
    { name: "Penduduk Niniwe", role: "Bertobat setelah pemberitaan Yunus" },
  ],
  Mi: [
    { name: "Mikha", role: "Nabi yang menegur pemimpin dan mengumumkan raja dari Betlehem" },
    { name: "Pemimpin Yehuda/Israel", role: "Ditegur karena penindasan dan ibadah kosong" },
  ],
  Na: [
    { name: "Nahum", role: "Nabi yang mengumumkan kejatuhan Niniwe" },
    { name: "Asyur / Niniwe", role: "Kekuatan penindas yang akan dihakimi" },
  ],
  Hab: [
    { name: "Habakuk", role: "Nabi yang bertanya mengapa orang fasik berjaya; belajar hidup oleh iman" },
    { name: "Bangsa Kasdim (Babel)", role: "Alat penghakiman yang juga akan dihakimi" },
  ],
  Zef: [
    { name: "Zefanya", role: "Nabi hari Tuhan; memanggil rendah hati dan mencari Tuhan" },
    { name: "Yosia (latar)", role: "Raja reformasi di masa pelayanan Zefanya" },
  ],
  Hag: [
    { name: "Hagai", role: "Nabi yang mendorong pembangunan kembali Bait" },
    { name: "Zerubabel", role: "Gubernur Yehuda; pemimpin pembangunan" },
    { name: "Yesua", role: "Imam besar yang bersama Zerubabel" },
  ],
  Za: [
    { name: "Zakharia", role: "Nabi penglihatan; penghiburan dan harapan Mesias" },
    { name: "Zerubabel & Yesua", role: "Pemimpin umat yang digambarkan dalam penglihatan" },
  ],
  Mal: [
    { name: "Maleakhi", role: "Nabi terakhir PL; menegur imam dan umat yang lesu" },
    { name: "Para imam", role: "Ditegur karena ibadah asal-asalan" },
    { name: "Elia yang akan datang", role: "Janji utusan sebelum hari Tuhan" },
  ],
  Mat: [
    { name: "Yesus Kristus", role: "Raja Mesias; penggenap janji Perjanjian Lama" },
    { name: "Maria & Yusuf", role: "Orang tua duniawi Yesus; kisah kelahiran" },
    { name: "Para murid / Petrus", role: "Dipanggil mengikuti dan belajar Kerajaan Surga" },
    { name: "Yohanes Pembaptis", role: "Perintis jalan; membaptis Yesus" },
    { name: "Ahli Taurat & Farisi", role: "Lawan yang sering berdebat dengan Yesus" },
  ],
  Mrk: [
    { name: "Yesus Kristus", role: "Anak Allah yang melayani dengan kuasa dan salib" },
    { name: "Petrus", role: "Sumber tradisi Markus; murid yang dekat namun goyah" },
    { name: "Para murid", role: "Sering tidak mengerti, lalu dipanggil menyangkal diri" },
    { name: "Yohanes Pembaptis", role: "Membuka Injil dengan pemberitaan pertobatan" },
  ],
  Luk: [
    { name: "Yesus Kristus", role: "Juruselamat bagi semua orang; penuh belas kasihan" },
    { name: "Maria", role: "Ibu Yesus; nyanyian Magnificat" },
    { name: "Zakharia & Elisabet", role: "Orang tua Yohanes Pembaptis" },
    { name: "Lukas (tradisi)", role: "Penulis; dokter dan rekan Paulus" },
    { name: "Orang Samaria & orang miskin", role: "Tokoh yang sering ditonjolkan dalam perumpamaan" },
  ],
  Yoh: [
    { name: "Yesus Kristus", role: "Firman yang menjadi manusia; “Akulah…”" },
    { name: "Yohanes (murid yang dikasihi)", role: "Saksi mata; penulis tradisi Injil ini" },
    { name: "Nikodemus", role: "Pemimpin Yahudi yang datang malam hari" },
    { name: "Perempuan Samaria", role: "Menerima air hidup di sumur" },
    { name: "Lazarus, Marta & Maria", role: "Sahabat Yesus di Betania" },
  ],
  Kis: [
    { name: "Petrus", role: "Pemimpin awal jemaat di Yerusalem" },
    { name: "Paulus", role: "Rasul bagi bangsa-bangsa; perjalanan misi" },
    { name: "Stefanus", role: "Martir pertama; diaken yang penuh Roh" },
    { name: "Barnabas", role: "Rekan misi Paulus di awal" },
    { name: "Filipus", role: "Menginjili Samaria dan sida-sida Etiopia" },
    { name: "Roh Kudus", role: "Tokoh penggerak seluruh narasi Kisah" },
  ],
  Rom: [
    { name: "Paulus", role: "Penulis; menjelaskan Injil kebenaran Allah" },
    { name: "Jemaat di Roma", role: "Yahudi dan non-Yahudi yang dipanggil hidup dari iman" },
  ],
  "1Ko": [
    { name: "Paulus", role: "Rasul yang menegur dan membangun jemaat Korintus" },
    { name: "Jemaat Korintus", role: "Terpecah, sombong, namun dikasihi dan dinasihati" },
    { name: "Apolos & Kefas", role: "Nama yang dijadikan kubu perpecahan" },
  ],
  "2Ko": [
    { name: "Paulus", role: "Membela pelayanan apostoliknya dengan kelemahan dan anugerah" },
    { name: "Titus", role: "Rekan yang membawa kabar dan menolong rekonsiliasi" },
    { name: "“Rasul-rasul palsu”", role: "Lawan yang membanggakan diri di Korintus" },
  ],
  Gal: [
    { name: "Paulus", role: "Membela Injil anugerah melawan sunat sebagai syarat selamat" },
    { name: "Jemaat Galatia", role: "Tergoda kembali ke hukum sebagai dasar kebenaran" },
    { name: "Petrus (Kefas)", role: "Ditegur Paulus di Antiokhia soal persekutuan meja" },
  ],
  Ef: [
    { name: "Paulus", role: "Menulis tentang gereja sebagai tubuh Kristus" },
    { name: "Jemaat di Efesus (dan sekitar)", role: "Dipanggil hidup dalam kesatuan dan kekudusan" },
  ],
  Fil: [
    { name: "Paulus", role: "Menulis dari penjara dengan sukacita" },
    { name: "Jemaat Filipi", role: "Mitra pelayanan yang mengasihi Paulus" },
    { name: "Timotius & Epafroditus", role: "Rekan yang diutus dan dihargai" },
  ],
  Kol: [
    { name: "Paulus", role: "Menegaskan keunggulan Kristus atas segala kuasa" },
    { name: "Jemaat Kolose", role: "Diperhadapkan dengan ajaran yang mencampur Kristus" },
    { name: "Epafras", role: "Pelayan yang memberitakan Injil di Kolose" },
  ],
  "1Te": [
    { name: "Paulus, Silas & Timotius", role: "Tim yang mendirikan dan menguatkan jemaat" },
    { name: "Jemaat Tesalonika", role: "Teladan iman, kasih, dan pengharapan akan kedatangan Kristus" },
  ],
  "2Te": [
    { name: "Paulus", role: "Meluruskan kebingungan soal hari Tuhan" },
    { name: "Jemaat Tesalonika", role: "Dipanggil tetap bekerja dan berpegang pada ajaran" },
  ],
  "1Ti": [
    { name: "Paulus", role: "Mentor yang memberi petunjuk pastoral" },
    { name: "Timotius", role: "Pemimpin muda di Efesus yang digembalakan" },
  ],
  "2Ti": [
    { name: "Paulus", role: "Surat perpisahan dari penjara; tetap memberitakan Injil" },
    { name: "Timotius", role: "Dipanggil setia meski masa sulit datang" },
  ],
  Tit: [
    { name: "Paulus", role: "Memberi arahan menata jemaat" },
    { name: "Titus", role: "Rekan yang diutus menertibkan jemaat di Kreta" },
  ],
  Flm: [
    { name: "Paulus", role: "Menjadi perantara rekonsiliasi" },
    { name: "Filemon", role: "Tuan Kristen yang diminta menerima kembali Onesimus" },
    { name: "Onesimus", role: "Budak yang melarikan diri; kini saudara di dalam Kristus" },
  ],
  Ibr: [
    { name: "Yesus Kristus", role: "Imam Besar sejati; lebih tinggi dari malaikat, Musa, dan imamat Lewi" },
    { name: "Penulis anonim", role: "Pengajar yang mendalam tentang PL dan Kristus" },
    { name: "Tokoh iman (Ibr 11)", role: "Abraham, Musa, dan lainnya sebagai saksi iman" },
  ],
  Yaa: [
    { name: "Yakobus", role: "Pemimpin jemaat Yerusalem; menekankan iman yang bekerja" },
    { name: "Jemaat tersebar", role: "Dipanggil menahan pencobaan dan menjauhi pilih kasih" },
  ],
  "1Pe": [
    { name: "Petrus", role: "Rasul yang menguatkan orang percaya di tengah penderitaan" },
    { name: "Orang-orang buangan pilihan", role: "Penerima surat di Asia Kecil" },
  ],
  "2Pe": [
    { name: "Petrus", role: "Mengingatkan akan pengajaran palsu dan hari Tuhan" },
    { name: "Guru-guru palsu", role: "Ancaman yang digambarkan dengan tajam" },
  ],
  "1Yo": [
    { name: "Yohanes", role: "Saksi yang menulis tentang persekutuan, terang, dan kasih" },
    { name: "Jemaat yang digoda bidat", role: "Dipanggil menguji roh dan tetap dalam Kristus" },
  ],
  "2Yo": [
    { name: "Yohanes (penatua)", role: "Menulis singkat tentang kebenaran dan kasih" },
    { name: "Ibu yang terpilih", role: "Penerima (jemaat atau tokoh perempuan)" },
  ],
  "3Yo": [
    { name: "Yohanes (penatua)", role: "Memuji keramahtamahan dan menegur kesombongan" },
    { name: "Gayus", role: "Penerima yang setia menerima utusan" },
    { name: "Diotrefes", role: "Pemimpin yang suka menjadi yang terkemuka" },
    { name: "Demetrius", role: "Dipuji sebagai teladan yang baik" },
  ],
  Yud: [
    { name: "Yudas", role: "Saudara Yakobus; menulis peringatan singkat" },
    { name: "Guru-guru fasik", role: "Menyusup dan menyelewengkan anugerah" },
  ],
  Why: [
    { name: "Yesus Kristus", role: "Anak Domba yang menang; Raja segala raja" },
    { name: "Yohanes", role: "Menerima penglihatan di Patmos" },
    { name: "Tujuh jemaat Asia", role: "Penerima surat-surat pembuka" },
    { name: "Anak Domba & naga", role: "Kontras pusat: Kristus vs kuasa jahat" },
  ],
};
