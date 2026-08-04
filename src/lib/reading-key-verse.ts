import type { DailyVerse } from "@/lib/daily-verse";
import { normalizePassageKey } from "@/lib/passage-parser";

export type ReadingThemeId =
  | "presence"
  | "promise"
  | "faith"
  | "forgiveness"
  | "obedience"
  | "provision"
  | "courage"
  | "calling"
  | "family"
  | "general";

/**
 * Benang merah kurasi per bacaan jadwal.
 * hook → focus (kisah) → angle (makna) → application → prayer → questions
 * harus satu napas, bukan potongan terpisah.
 */
export type ReadingDevotionalSeed = DailyVerse & {
  title: string;
  /** Undangan singkat di awal renungan */
  hook: string;
  /** Apa yang terjadi dalam bacaan */
  focus: string;
  /** Makna yang dalam, menyambung ke ayat kunci & hidup */
  angle: string;
  /** Ajakan hidup — bahasa yang sama dengan kisah */
  application: string;
  prayer: string;
  questions: string[];
  themeId: ReadingThemeId;
};

const READING_SEEDS: Record<string, ReadingDevotionalSeed> = {
  "kejadian 1-2": {
    reference: "Kejadian 1:27",
    text: "Maka Allah menciptakan manusia itu menurut gambar-Nya, menurut gambar Allah diciptakan-Nya dia; laki-laki dan perempuan diciptakan-Nya mereka.",
    title: "Gambar Allah, bukan kebetulan",
    hook: "Sebelum kita bertanya “apa yang harus kulakukan?”, Firman lebih dulu menjawab “siapa diriku”.",
    focus:
      "Allah menciptakan langit, bumi, dan manusia dengan maksud yang teratur. Kita bukan produk kebetulan, melainkan ciptaan yang menerima napas, martabat, dan tugas memelihara apa yang Ia buat.",
    angle:
      "Identitas kita dimulai dari Allah. Ketika dunia mengukur manusia dari produktivitas atau penampilan, Kejadian 1:27 menarik kita kembali: martabat, relasi, dan panggilan hidup mengalir dari kebenaran bahwa kita diciptakan menurut gambar-Nya.",
    application:
      "Langkah hari ini: di depan cermin atau dalam jurnal singkat, ucapkan satu kalimat yang benar—“Aku ciptaan Allah, bukan kebetulan”—lalu pilih satu cara kecil untuk memelihara orang atau tempat yang dipercayakan kepadamu.",
    prayer:
      "Allah Pencipta, kembalikan aku pada identitas yang Engkau berikan. Tolong aku hidup sebagai gambar-Mu—dengan martabat, tanggung jawab, dan rasa syukur. Amin.",
    questions: [
      "Di area mana kamu paling mudah lupa bahwa dirimu adalah gambar Allah?",
      "Bagaimana Kejadian 1:27 menantang cara dunia menilai manusia?",
      "Satu tanggung jawab pemeliharaan apa yang ingin kamu pegang lebih serius minggu ini?",
    ],
    themeId: "calling",
  },
  "kejadian 3-4": {
    reference: "Kejadian 3:15",
    text: "Aku akan mengadakan permusuhan antara engkau dan perempuan ini, antara keturunanmu dan keturunannya; keturunannya akan meremukkan kepalamu, dan engkau akan meremukkan tumitnya.",
    title: "Dosa masuk, harapan tetap bicara",
    hook: "Kegagalan manusia nyata—tetapi bukan kata terakhir dalam cerita Allah.",
    focus:
      "Pemberontakan Adam dan Hawa merusak relasi dengan Allah; malu dan saling tuduh muncul. Lalu kekerasan masuk ke antara saudara. Namun di tengah penghakiman, Allah sudah menanam janji pemulihan.",
    angle:
      "Kejadian 3:15 bukan hanya hukuman atas ular—itu benih Injil. Dosa membawa perpecahan, tetapi Tuhan tidak membiarkan cerita berakhir di kegagalan. Di pasal yang kelam, harapan sudah berbicara lebih dulu.",
    application:
      "Langkah hari ini: akui satu area di mana kamu masih bersembunyi atau menyalahkan orang lain. Bawa ke dalam doa, lalu pegang satu pengingat: penghakiman Allah tidak membatalkan janji pemulihan-Nya.",
    prayer:
      "Tuhan, di hadapan dosa yang merusak, ajar aku tidak putus asa. Biar harapan-Mu lebih keras terdengar daripada malu dan saling tuduh dalam hatiku. Amin.",
    questions: [
      "Di mana malu atau saling tuduh masih menguasai caramu berhubungan dengan Allah atau orang lain?",
      "Bagaimana Kejadian 3:15 menolongmu melihat penghakiman dan harapan sekaligus?",
      "Satu langkah jujur apa yang menandai pertobatan, bukan sekadar penyesalan?",
    ],
    themeId: "promise",
  },
  "kejadian 5-6": {
    reference: "Kejadian 6:9",
    text: "Inilah riwayat Nuh: Nuh adalah seorang yang benar dan tidak bercela di antara orang-orang sezamannya; dan Nuh itu hidup bergaul dengan Allah.",
    title: "Bergaul dengan Allah di zaman gelap",
    hook: "Kekudusan bukan soal menjauh dari dunia, melainkan dekat dengan Allah di tengah dunia yang rusak.",
    focus:
      "Dunia semakin rusak, tetapi satu orang memilih jalan berbeda: Nuh hidup bergaul dengan Allah di tengah generasi yang menolak-Nya. Kebenarannya lahir dari hubungan, bukan dari isolasi.",
    angle:
      "“Bergaul dengan Allah” adalah inti yang menopang Nuh saat budaya mendorong menjauh. Saat tekanan zaman membuat kita ikut arus, bacaan ini memanggil kita untuk dekat lagi—sebelum kita sibuk “membuktikan diri benar”.",
    application:
      "Langkah hari ini: sisihkan 10 menit tanpa gangguan hanya untuk “bergaul dengan Allah”—baca ulang satu perikop singkat, diam sejenak, dan bicara jujur kepada-Nya tentang tekanan yang kamu rasakan dari sekitar.",
    prayer:
      "Tuhan, di tengah suara yang ramai dan rusak, tarik aku dekat. Bentuk hidupku dari pergaulan dengan-Mu, bukan dari tekanan orang sezaman. Amin.",
    questions: [
      "Tekanan budaya apa yang paling sering menjauhkanmu dari Allah?",
      "Apa bedanya “terlihat benar” dengan “hidup bergaul dengan Allah” dalam rutinitasmu?",
      "Satu kebiasaan kedekatan apa yang ingin kamu bangun minggu ini?",
    ],
    themeId: "faith",
  },
  "kejadian 7-8": {
    reference: "Kejadian 8:1",
    text: "Maka Allah ingat kepada Nuh dan kepada segala binatang liar dan segala ternak yang bersama-sama dengan dia dalam bahtera itu, lalu Allah membuat angin bertiup di atas bumi, sehingga air itu turun.",
    title: "Allah ingat—meski air belum surut",
    hook: "Menunggu Tuhan sering terasa seperti air yang belum turun—tetapi Ia tidak absen.",
    focus:
      "Air bah menutupi bumi, dan Nuh menunggu lama di dalam bahtera. Di puncak kesunyian itu, Allah mengingat Nuh dan mulai membuka jalan keluar. Pemeliharaan datang tepat pada waktunya.",
    angle:
      "“Allah ingat” bukan berarti Ia sempat lupa. Itu bahasa kasih yang aktif: Ia campur tangan. Menunggu bukan sia-sia—bahtera yang sesak sekalipun tetap berada dalam genggaman-Nya.",
    application:
      "Langkah hari ini: tulis satu doa yang sudah lama kamu bawa. Di bawahnya tulis kalimat Kejadian 8:1 sebagai pengingat—“Allah ingat”—lalu serahkan ulang tanpa memaksa jadwal-Nya.",
    prayer:
      "Allah yang mengingat Nuh, ingat juga pergumulanku. Ajar aku menunggu tanpa putus asa, dan percaya Engkau sedang bekerja bahkan saat air belum surut. Amin.",
    questions: [
      "Di musim menunggu yang mana kamu paling mudah merasa dilupakan Tuhan?",
      "Bagaimana “Allah ingat” mengubah caramu menafsir penundaan?",
      "Satu sikap apa yang ingin kamu ganti: panik, pasrah sinis, atau percaya yang aktif?",
    ],
    themeId: "presence",
  },
  "kejadian 9-10": {
    reference: "Kejadian 9:13",
    text: "Busur-Ku Kutaruh di awan, supaya itu menjadi tanda perjanjian antara Aku dan bumi.",
    title: "Tanda perjanjian di langit",
    hook: "Allah tidak hanya menyelamatkan—Ia juga mengikat diri-Nya dengan janji yang bisa diingat.",
    focus:
      "Setelah air bah, Allah membuat perjanjian dengan Nuh dan seluruh ciptaan. Pelangi menjadi tanda: penghakiman-Nya tidak menghapus kesetiaan-Nya kepada bumi yang Ia pelihara.",
    angle:
      "Janji Tuhan diberi tanda yang terlihat supaya hati yang takut bisa tenang. Kita diundang percaya: Allah mengikat diri pada firman-Nya, bukan pada suasana hati kita yang naik-turun.",
    application:
      "Langkah hari ini: pilih satu “tanda pengingat” sederhana (ayat di HP, catatan di meja) untuk janji Tuhan yang sedang kamu butuhkan—supaya saat cemas datang, kamu punya jangkar yang terlihat.",
    prayer:
      "Tuhan perjanjian, tenangkan hatiku yang mudah takut. Ajar aku berpegang pada firman-Mu lebih dari perasaan, dan melihat kesetiaan-Mu di langit maupun di hidupku. Amin.",
    questions: [
      "Janji Tuhan mana yang paling sulit kamu percaya saat ini?",
      "Apa “tanda” yang menolongmu mengingat kesetiaan Allah?",
      "Bagaimana Kejadian 9:13 menantang kebiasaan mengukur Tuhan dari suasana hatimu?",
    ],
    themeId: "promise",
  },
  "kejadian 11-12": {
    reference: "Kejadian 12:2",
    text: "Aku akan membuat engkau menjadi bangsa yang besar, dan memberkati engkau serta membuat namamu masyhur; dan engkau akan menjadi berkat.",
    title: "Dipanggil untuk menjadi berkat",
    hook: "Ambisi membangun nama sendiri berbenturan dengan panggilan menjadi berkat bagi orang lain.",
    focus:
      "Menara Babel mengejar nama sendiri; Abram dipanggil meninggalkan tanahnya agar namanya dijadikan besar oleh Tuhan—dan menjadi berkat bagi bangsa-bangsa. Iman dimulai dengan langkah taat yang belum sepenuhnya jelas.",
    angle:
      "Panggilan Abraham membalik ambisi manusia: berkat diterima supaya dibagikan. Kejadian 12:2 menempatkan kita bukan sebagai pusat cerita, tetapi sebagai saluran—nama yang dimasyhurkan Tuhan selalu mengarah keluar, kepada orang lain.",
    application:
      "Langkah hari ini: tanyakan, “Siapa yang bisa kuberikan berkat konkret hari ini?” Lalu lakukan satu tindakan kecil—pesan, bantuan, atau doa yang disebut namanya.",
    prayer:
      "Tuhan, lepaskan aku dari obsesi membangun namaku sendiri. Jadikan hidupku berkat, seperti panggilan-Mu kepada Abram, dan tuntun langkah taat yang belum kulihat ujungnya. Amin.",
    questions: [
      "Di mana kamu sedang membangun “menara” nama sendiri?",
      "Apa artinya “menjadi berkat” dalam pekerjaan, keluarga, atau kelompokmu?",
      "Satu langkah taat apa yang Tuhan minta meski belum jelas hasilnya?",
    ],
    themeId: "calling",
  },
  "kejadian 13-14": {
    reference: "Kejadian 13:8",
    text: "Maka berkatalah Abram kepada Lot: »Janganlah kiranya ada perkelahian antara aku dan engkau, dan antara gembala-gembalaku dan gembala-gembalamu, sebab kita ini kerabat.«",
    title: "Damai lebih berharga dari tanah",
    hook: "Kadang yang paling “berhak” justru dipanggil mengalah demi hubungan.",
    focus:
      "Konflik muncul karena harta dan ruang. Abram memilih mengalah demi damai dengan Lot, lalu Tuhan meneguhkan janji-Nya kembali. Relasi dijaga lebih dulu daripada keuntungan.",
    angle:
      "Abram menunjukkan bahwa hubungan lebih berharga daripada hak yang paling menguntungkan. Damai dalam keluarga iman sering lahir dari kerelaan melepaskan, bukan dari menang debat. Setelah itu, Tuhanlah yang meneguhkan.",
    application:
      "Langkah hari ini: pilih satu konflik kecil di mana kamu bisa mengalah tanpa mengkhianati kebenaran—kirim pesan damai, lepaskan hak “harus menang”, atau tawarkan solusi yang menjaga hubungan.",
    prayer:
      "Tuhan, ajar aku mengasihi damai lebih dari kemenangan. Beri hikmat untuk mengalah pada tempatnya, dan percaya Engkau yang meneguhkan apa yang kutitipkan kepada-Mu. Amin.",
    questions: [
      "Hak atau keuntungan apa yang sedang kamu genggam sampai merusak hubungan?",
      "Bagaimana sikap Abram menantang caramu berselisih dengan “kerabat” dalam iman?",
      "Satu langkah damai apa yang bisa kamu ambil hari ini?",
    ],
    themeId: "family",
  },
  "kejadian 15-16": {
    reference: "Kejadian 15:6",
    text: "Lalu percayalah Abram kepada Tuhan, maka Tuhan memperhitungkan hal itu kepadanya sebagai kebenaran.",
    title: "Percaya saat janji belum kelihatan",
    hook: "Iman diuji paling tajam ketika jawaban Tuhan masih belum terlihat.",
    focus:
      "Abram masih menunggu keturunan. Ia percaya kepada janji Tuhan—meski jalan keluar manusiawi lewat Hagar kemudian membawa komplikasi. Kebenaran diperhitungkan karena percaya, bukan karena sudah “selesai sempurna”.",
    angle:
      "Kejadian 15:6 menjadi poros: iman menaruh bobot pada firman Tuhan, bukan pada solusi cepat. Kita belajar membedakan percaya yang menunggu dari “percaya” yang sebenarnya adalah panik mencari jalan sendiri.",
    application:
      "Langkah hari ini: tulis janji Tuhan yang sedang kamu tunggu. Di sampingnya, tulis satu “solusi cepat” yang menggoda. Pilih untuk menunggu dengan doa, bukan memaksakan jalan yang belum Tuhan buka.",
    prayer:
      "Tuhan, ajar aku percaya seperti Abram: bukan tanpa pergumulan, tetapi dengan menaruh bobot pada firman-Mu. Lindungi aku dari jalan pintas yang merusak. Amin.",
    questions: [
      "Janji apa yang paling sulit kamu tunggu tanpa memaksakan jalan sendiri?",
      "Apa bedanya iman yang menunggu dengan panik yang menyamar sebagai “usaha”?",
      "Bagaimana Kejadian 15:6 menghiburmu yang merasa belum “cukup hebat” untuk dibenarkan?",
    ],
    themeId: "faith",
  },
  "kejadian 17-18": {
    reference: "Kejadian 17:1",
    text: "Ketika Abram berumur sembilan puluh sembilan tahun, maka Tuhan menampakkan diri kepada Abram dan berfirman kepadanya: »Akulah Allah Yang Mahakuasa, hiduplah di hadapan-Ku dengan tidak bercela.«",
    title: "El Shaddai memanggil hidup utuh",
    hook: "Allah yang Mahakuasa tidak hanya menjanjikan yang mustahil—Ia juga membentuk karakter orang yang menerima janji itu.",
    focus:
      "Allah menegaskan perjanjian, mengganti nama Abram, dan menjanjikan Ishak. Ia juga membuka ruang perjamuan dan doa syafaat Abraham bagi Sodom. Janji dan kekudusan berjalan bersama.",
    angle:
      "“Hiduplah di hadapan-Ku” adalah undangan hubungan, bukan sekadar aturan. El Shaddai membentuk kita sambil memegang janji yang mustahil bagi manusia—supaya kita tidak memisahkan anugerah dari kehidupan yang utuh di hadapan-Nya.",
    application:
      "Langkah hari ini: pilih satu area hidup yang kamu “pisahkan” dari Tuhan (uang, layar, marah, atau rahasia). Bawa kembali ke hadapan-Nya dengan doa jujur: “Aku mau hidup di hadapan-Mu di sini juga.”",
    prayer:
      "Allah Yang Mahakuasa, bentuk hidupku utuh di hadapan-Mu. Teguhkan janji-Mu, dan biar anugerah-Mu mengerjakan kekudusan yang nyata dalam langkahku. Amin.",
    questions: [
      "Area mana yang paling sulit kamu “hidupi di hadapan Allah”?",
      "Bagaimana janji Tuhan dan panggilan hidup utuh saling menopang dalam Kejadian 17:1?",
      "Untuk siapa kamu dipanggil berdoa syafaat seperti Abraham?",
    ],
    themeId: "obedience",
  },
  "kejadian 19": {
    reference: "Kejadian 19:16",
    text: "Ketika Lot berlambat-lambat, maka kedua orang itu memegang tangan Lot dan tangan isteri serta kedua anaknya, karena belas kasihan Tuhan terhadap dia, lalu membawa dia keluar dan melepaskannya di luar kota itu.",
    title: "Diselamatkan karena belas kasihan",
    hook: "Kadang kita berlambat-lambat meninggalkan yang merusak—dan tetap ditolong oleh belas kasihan Tuhan.",
    focus:
      "Sodom dihakimi, dan Lot hampir terlambat keluar. Keselamatan keluarganya terjadi bukan karena respons yang sempurna, melainkan karena belas kasihan Tuhan yang menarik mereka keluar.",
    angle:
      "Kejadian 19:16 menyingkapkan kasih yang memegang tangan orang yang ragu. Keselamatan bukan prestasi kecepatan kita; itu campur tangan Allah. Namun belas kasihan itu juga memanggil kita untuk tidak terus berlambat-lambat di tempat yang membinasakan.",
    application:
      "Langkah hari ini: sebutkan satu kebiasaan atau lingkungan yang membuatmu “berlambat-lambat” bertobat. Ambillah satu langkah keluar yang konkret—batasi, tinggalkan, atau minta akuntabilitas.",
    prayer:
      "Tuhan yang berbelas kasihan, pegang tanganku saat aku ragu meninggalkan yang merusak. Tarik aku keluar, dan beri keberanian untuk tidak kembali. Amin.",
    questions: [
      "Di mana kamu sedang berlambat-lambat seperti Lot?",
      "Bagaimana belas kasihan Tuhan di Kejadian 19:16 menghibur sekaligus menegurmu?",
      "Siapa yang bisa “memegang tanganmu” sebagai bentuk pertolongan praktis?",
    ],
    themeId: "forgiveness",
  },
  "kejadian 20-21": {
    reference: "Kejadian 21:1",
    text: "Tuhan memperhatikan Sara, seperti yang difirmankan-Nya, dan Tuhan melakukan kepada Sara seperti yang dijanjikan-Nya.",
    title: "Tuhan menepati janji-Nya",
    hook: "Penundaan Tuhan bukan pembatalan—kesetiaan-Nya lebih kuat dari keraguan kita.",
    focus:
      "Di tengah kelemahan Abraham dan Sara, Ishak lahir sesuai waktu Tuhan. Janji yang lama ditunggu akhirnya menjadi nyata: Tuhan memperhatikan dan melakukan seperti yang dijanjikan-Nya.",
    angle:
      "Kejadian 21:1 merangkum kesetiaan Allah dalam satu napas: memperhatikan dan melakukan. Saat kita lelah menunggu, ayat ini menarik kita dari spekulasi ke kepercayaan—Allah tidak lupa pada apa yang Ia ucapkan.",
    application:
      "Langkah hari ini: baca ulang satu janji Firman yang kamu tunggu. Ucapkan syukur seolah kesetiaan Tuhan sudah cukup untuk hari ini—sebelum jawabanmu lengkap kelihatan.",
    prayer:
      "Tuhan yang menepati janji, tenangkan hatiku yang lelah menunggu. Ajar aku percaya bahwa Engkau memperhatikan dan melakukan seperti firman-Mu. Amin.",
    questions: [
      "Janji mana yang paling lama kamu tunggu dari Tuhan?",
      "Bagaimana Kejadian 21:1 menolongmu membedakan penundaan dari pembatalan?",
      "Satu cara bersyukur apa yang bisa kamu lakukan sambil menunggu?",
    ],
    themeId: "promise",
  },
  "kejadian 22-23": {
    reference: "Kejadian 22:8",
    text: "Sahut Abraham: »Allah yang akan menyediakan anak domba untuk korban bakaran bagi-Nya, anakku.« Demikianlah keduanya berjalan bersama-sama.",
    title: "Tuhan yang menyediakan",
    hook: "Iman yang paling dalam sering diucapkan sebelum jawaban kelihatan.",
    focus:
      "Abraham diuji di Gunung Moria: mempersembahkan Ishak. Di puncak ujian, ia berjalan bersama anaknya dengan pengakuan iman—“Allah yang akan menyediakan”—dan Tuhan memang menyediakan ganti.",
    angle:
      "Yehowah Yireh dikenal bukan hanya di akhir cerita, tetapi di mulut Abraham di tengah jalan. Ketaatan membuka ruang bagi kita melihat Tuhan menyediakan di kebutuhan terdalam—sering dengan cara yang tidak kita diktakan.",
    application:
      "Langkah hari ini: sebutkan satu kebutuhan yang membuatmu cemas. Berdoa seperti Abraham: “Allah yang akan menyediakan”—lalu ambil satu langkah taat yang sudah jelas, tanpa menunggu seluruh peta selesai.",
    prayer:
      "Tuhan penyedia, ajar aku percaya sebelum jawaban kelihatan. Di gunung ujianku, sediakan yang Engkau kehendaki, dan bentuk ketaatanku supaya tidak berhenti di tengah jalan. Amin.",
    questions: [
      "Apa “Ishak” dalam hidupmu—hal yang paling sulit dipersembahkan?",
      "Bagaimana pengakuan Abraham di Kejadian 22:8 menantang doamu yang ingin mengatur jawaban Tuhan?",
      "Satu langkah taat apa yang bisa kamu jalani “bersama-sama” dengan Tuhan hari ini?",
    ],
    themeId: "provision",
  },
  "kejadian 24": {
    reference: "Kejadian 24:27",
    text: "Katanya: »Terpujilah Tuhan, Allah tuanku Abraham, yang tidak menarik kembali kasih-Nya dan setia-Nya dari tuanku itu; dan aku telah dituntun oleh Tuhan ke rumah saudara-saudara tuanku itu.«",
    title: "Dituntun dalam detail hidup",
    hook: "Pemeliharaan Tuhan tidak hanya di mukjizat besar—Ia juga hadir di sumur, doa, dan pertemuan sehari-hari.",
    focus:
      "Hamba Abraham mencari istri bagi Ishak. Doa, langkah, dan pertemuan di sumur menunjukkan Tuhan menuntun sampai ke detail. Kasih setia Allah tidak ditarik kembali.",
    angle:
      "Kejadian 24:27 adalah doksologi orang yang mengenali tuntunan: bukan keberuntungan, melainkan kasih setia. Kita diajak melihat detail hidup—keputusan, perjalanan, percakapan—sebagai arena di mana Tuhan bekerja.",
    application:
      "Langkah hari ini: tinjau satu keputusan yang sedang kamu doakan. Catat tanda tuntunan yang sudah ada (bukan paksaan), lalu ucapkan syukur seperti hamba Abraham sebelum hasil final tiba.",
    prayer:
      "Tuhan yang menuntun, buka mataku melihat kasih setia-Mu di detail hidupku. Ajar aku berjalan dengan doa dan syukur, bukan hanya dengan rencana yang kaku. Amin.",
    questions: [
      "Di detail hidup mana kamu sering lupa melibatkan Tuhan?",
      "Bagaimana Kejadian 24:27 membentuk caramu mengenali tuntunan-Nya?",
      "Satu keputusan apa yang ingin kamu serahkan ulang kepada tuntunan Tuhan minggu ini?",
    ],
    themeId: "provision",
  },
  "kejadian 25": {
    reference: "Kejadian 25:23",
    text: "Firman Tuhan kepadanya: »Dua bangsa ada dalam kandunganmu, dan dua suku bangsa akan berpencar dari dalam rahimmu; suku bangsa yang satu akan lebih kuat dari yang lain, dan anak yang tua akan menjadi hamba kepada anak yang muda.«",
    title: "Rencana Tuhan di tengah ketegangan",
    hook: "Konflik manusia tidak membatalkan rencana Allah yang sudah berbicara lebih dulu.",
    focus:
      "Esau dan Yakub bertikai sejak dalam kandungan. Hak kesulungan dan berkat menjadi medan konflik—namun Tuhan sudah menyatakan rencana-Nya kepada Ribka sebelum drama keluarga memuncak.",
    angle:
      "Pilihan manusia sering kacau, tetapi kedaulatan Tuhan tidak goyah. Kejadian 25:23 mengajak kita tidak menyamakan keinginan kita dengan rencana Tuhan, melainkan tunduk pada firman-Nya bahkan saat ketegangan keluarga terasa membingungkan.",
    application:
      "Langkah hari ini: dalam satu ketegangan yang kamu hadapi, tanyakan lebih dulu—“Apa yang sudah Tuhan katakan dalam Firman?”—sebelum bereaksi dari iri, takut, atau ambisi.",
    prayer:
      "Tuhan yang berdaulat, di tengah ketegangan yang membingungkan, ajarkan aku tunduk pada firman-Mu. Jangan biarkan ambisiku menafsirkan rencana-Mu. Amin.",
    questions: [
      "Ketegangan mana yang paling mudah membuatmu bertindak tanpa bertanya pada Firman?",
      "Bagaimana Kejadian 25:23 menolongmu melihat kedaulatan Tuhan di atas drama manusia?",
      "Satu sikap tunduk apa yang ingin kamu latih minggu ini?",
    ],
    themeId: "calling",
  },
  "kejadian 26": {
    reference: "Kejadian 26:24",
    text: "Pada malam itu Tuhan menampakkan diri kepadanya serta berfirman: »Akulah Allah ayahmu Abraham; janganlah takut, sebab Aku menyertai engkau; Aku akan memberkati engkau dan Aku akan membuat banyak keturunanmu karena hamba-Ku Abraham.«",
    title: "Jangan takut—Aku menyertai",
    hook: "Ketakutan yang berulang dijawab Tuhan dengan janji yang sama: Aku menyertai engkau.",
    focus:
      "Ishak menghadapi kelaparan, konflik sumur, dan tekanan dari sekitar. Tuhan mengulangi janji Abraham kepadanya: penyertaan dan berkat. Anak yang takut menerima ulang kepastian yang sama.",
    angle:
      "Penyertaan Tuhan adalah jawaban atas ketakutan yang berulang. Kejadian 26:24 menunjukkan bahwa janji Allah lintas generasi tetap hidup untuk orang yang ragu—bukan karena kita kuat, tetapi karena Ia setia pada perjanjian-Nya.",
    application:
      "Langkah hari ini: tulis satu ketakutan yang berulang. Di bawahnya salin “janganlah takut, sebab Aku menyertai engkau”, lalu doakan nama tempat atau situasi di mana kamu butuh penyertaan itu.",
    prayer:
      "Allah Abraham, bicara juga kepada ketakutanku: “Jangan takut, Aku menyertai.” Buat janji itu hidup di langkahku hari ini. Amin.",
    questions: [
      "Ketakutan berulang apa yang paling sering menguasai keputusanmu?",
      "Bagaimana penyertaan Tuhan di Kejadian 26:24 berbeda dari “solusi” yang kamu paksa?",
      "Di tempat mana kamu paling butuh mendengar “Aku menyertai engkau”?",
    ],
    themeId: "presence",
  },
  "kejadian 27": {
    reference: "Kejadian 27:28",
    text: "Allah akan memberikan kepadamu embun yang dari langit dan lemak yang dari bumi, dan gandum serta anggur berlimpah-limpah.",
    title: "Berkat yang diperebutkan",
    hook: "Berkat sejati berasal dari Allah—manipulasi manusia hanya meninggalkan luka keluarga.",
    focus:
      "Tipu daya Yakub dan Ribka merebut berkat Esau. Keluarga retak, air mata dan amarah muncul. Berkat yang diucapkan membawa bobot, tetapi cara mendapatkannya merusak hubungan.",
    angle:
      "Pasal ini tidak merayakan tipu daya. Ia memperlihatkan akibat dosa dalam keluarga, sekaligus mengingatkan bahwa berkat sejati tidak bisa diganti dengan manipulasi. Apa yang diperebutkan tanpa Tuhan akhirnya memecah rumah.",
    application:
      "Langkah hari ini: periksa satu area di mana kamu tergoda “merebut” (pengakuan, posisi, perhatian). Pilih kejujuran atau langkah rekonsiliasi kecil daripada jalan pintas.",
    prayer:
      "Tuhan, lepaskan aku dari tipu daya yang merusak. Ajar aku mencari berkat-Mu dengan cara yang benar, dan pulihkan luka dalam keluargaku. Amin.",
    questions: [
      "Di mana kamu tergoda memanipulasi untuk mendapat “berkat”?",
      "Apa akibat tipu daya yang masih kamu rasakan dalam relasi dekat?",
      "Satu langkah jujur apa yang bisa mulai memulihkan kepercayaan?",
    ],
    themeId: "family",
  },
  "kejadian 28-29": {
    reference: "Kejadian 28:15",
    text: "Sesungguhnya Aku menyertai engkau dan Aku akan melindungi engkau, ke mana pun engkau pergi, dan Aku akan membawa engkau kembali ke tanah ini; sebab Aku tidak akan meninggalkan engkau, melainkan Aku akan melakukan apa yang Kujanjikan kepadamu.",
    title: "Penyertaan di tanah asing",
    hook: "Allah menemui kita bukan setelah kita “beres”—sering justru di tengah pelarian.",
    focus:
      "Yakub melarikan diri, bermimpi di Betel, lalu masuk ke rumah Laban. Di perjalanan pengungsi itu, Tuhan berjanji menyertai, melindungi, dan membawa pulang. Janji itu menjadi bekal di tanah asing.",
    angle:
      "Kejadian 28:15 adalah jaminan bagi orang yang belum layak merasa aman. Penyertaan Tuhan meneguhkan: Ia tidak meninggalkan, dan Ia melakukan apa yang dijanjikan—bahkan saat kita masih membawa bekas tipu daya dan takut.",
    application:
      "Langkah hari ini: jika ada “tanah asing” dalam hidupmu (tempat baru, fase sepi, atau akibat kesalahan), doakan Kejadian 28:15 atas situasimu, lalu ambil satu langkah setia di tempat itu tanpa menunggu perasaan nyaman dulu.",
    prayer:
      "Tuhan Betel, sertai aku di tanah yang terasa asing. Lindungi, jangan tinggalkan, dan bawa aku pada penggenapan janji-Mu. Amin.",
    questions: [
      "Di “tanah asing” mana kamu paling butuh mendengar janji penyertaan?",
      "Bagaimana Kejadian 28:15 menghibur orang yang merasa belum layak dikunjungi Tuhan?",
      "Satu langkah setia apa yang bisa kamu lakukan di tempatmu sekarang?",
    ],
    themeId: "presence",
  },
  "kejadian 30": {
    reference: "Kejadian 30:22",
    text: "Lalu Allah mengingat Rahel; Allah mendengarkan doanya serta membuka kandungannya.",
    title: "Allah mendengar doa yang lama",
    hook: "Doa yang tertunda bukan berarti doa yang diabaikan.",
    focus:
      "Persaingan Lea dan Rahel, serta strategi keluarga yang rumit, tidak menutup fakta sederhana: Allah mengingat Rahel, mendengar doanya, dan membuka apa yang lama tertutup.",
    angle:
      "Di tengah drama manusia yang berisik, Kejadian 30:22 membawa kita ke pusat yang sunyi: Allah mendengar. Waktu Tuhan bukan penolakan. Belas kasihan-Nya dapat membuka apa yang sudah lama mustahil bagi kita.",
    application:
      "Langkah hari ini: sebutkan satu doa lama yang hampir kamu anggap “selesai ditolak”. Bawa lagi kepada Tuhan dengan kejujuran—bukan menuntut, tetapi percaya Ia mendengar.",
    prayer:
      "Allah yang mengingat Rahel, ingat juga doaku yang lama. Ajar aku menunggu dengan percaya, dan menerima waktu-Mu tanpa mengeraskan hati. Amin.",
    questions: [
      "Doa lama mana yang paling sulit kamu bawa lagi kepada Tuhan?",
      "Bagaimana Kejadian 30:22 menantang kebiasaan mengukur doa dari kecepatan jawaban?",
      "Satu sikap hati apa yang ingin kamu jaga sambil menunggu?",
    ],
    themeId: "provision",
  },
  "kejadian 31": {
    reference: "Kejadian 31:3",
    text: "Lalu berfirmanlah Tuhan kepada Yakub: »Pulanglah ke tanah nenek moyangmu dan kepada kaummu, dan Aku akan menyertai engkau.«",
    title: "Dipanggil pulang bersama janji",
    hook: "Langkah taat kadang berarti meninggalkan tempat yang “aman secara ekonomi” demi arah Tuhan.",
    focus:
      "Ketegangan dengan Laban memuncak. Tuhan memerintahkan Yakub pulang—dengan jaminan yang sama: Aku akan menyertai engkau. Arah pulang disertai janji, bukan sekadar perintah kosong.",
    angle:
      "Ketaatan Yakub ditopang penyertaan. Kejadian 31:3 mengingatkan: Tuhan tidak memanggil kita ke jalan sulit lalu meninggalkan kita di tengah. Bekal taat adalah janji “Aku akan menyertai”, bukan kenyamanan yang kita hitung sendiri.",
    application:
      "Langkah hari ini: identifikasi satu “tempat nyaman” yang mulai menahan ketaatanmu. Tanyakan kepada Tuhan apakah ada langkah “pulang” atau berpindah yang Ia minta—lalu patuhkan pada satu tindakan kecil yang jelas.",
    prayer:
      "Tuhan, jika Engkau memanggilku bergerak, beri keberanian untuk taat. Sertai aku di jalan pulang itu, dan lepaskan aku dari rasa aman yang palsu. Amin.",
    questions: [
      "Apa “tempat nyaman” yang paling sulit kamu tinggalkan demi Tuhan?",
      "Bagaimana jaminan penyertaan di Kejadian 31:3 mengubah caramu mendengar panggilan taat?",
      "Satu langkah “pulang” apa yang bisa kamu mulai minggu ini?",
    ],
    themeId: "obedience",
  },
  "kejadian 32-33": {
    reference: "Kejadian 32:28",
    text: "Lalu kata-Nya: »Namamu tidak akan disebutkan lagi Yakub, tetapi Israel, sebab engkau telah bergumul melawan Allah dan manusia, dan engkau menang.«",
    title: "Bergumul sampai nama berubah",
    hook: "Rekonsiliasi dengan manusia sering dimulai dari pergumulan jujur dengan Allah.",
    focus:
      "Yakub takut bertemu Esau, bergumul semalaman, lalu berdamai dengan saudaranya. Identitasnya diganti: dari penipu menjadi Israel. Pertemuan dengan Tuhan mengubah cara ia bertemu manusia.",
    angle:
      "Nama baru lahir dari gumul, bukan dari tipu yang berhasil. Kejadian 32:28 mengajak kita: sebelum memperbaiki relasi yang retak, biarkan Tuhan menangani siapa kita sebenarnya di hadapan-Nya.",
    application:
      "Langkah hari ini: sebelum menghubungi orang yang tegang denganmu, luangkan waktu bergumul dalam doa—akui tipu daya atau takutmu—lalu kirim satu langkah damai yang sederhana.",
    prayer:
      "Tuhan, bergumullah denganku sampai namaku berubah. Ubah caraku bertemu manusia setelah aku bertemu dengan-Mu. Amin.",
    questions: [
      "Dengan siapa kamu sedang takut berdamai, seperti Yakub menghadapi Esau?",
      "Apa “nama lama” (pola dosa) yang Tuhan ingin ubah dalam dirimu?",
      "Satu langkah rekonsiliasi apa yang bisa menyusul pergumulan doamu?",
    ],
    themeId: "family",
  },
  "kejadian 34-35": {
    reference: "Kejadian 35:3",
    text: "Mari kita bersiap dan pergi ke Betel; aku akan mendirikan mezbah di sana bagi Allah, yang telah menjawab aku pada waktu aku dalam kesesakan, dan yang telah menyertai aku di jalan yang kutempuh.",
    title: "Kembali ke Betel",
    hook: "Iman butuh “kembali”: membuang yang mencemari, lalu mendirikan mezbah syukur.",
    focus:
      "Setelah krisis di Sikhem, Yakub membawa keluarga membersihkan berhala dan kembali ke Betel—tempat Allah menjawabnya di masa sesak. Penyertaan di jalan lama diingat dengan ibadah yang baru.",
    angle:
      "Betel adalah memori kesetiaan Allah yang menjadi panggilan bertobat. Kejadian 35:3 mengikat syukur dan kekudusan: kita kembali bukan hanya untuk nostalgia, tetapi untuk membuang berhala dan menyembah lagi dengan hati yang bersih.",
    application:
      "Langkah hari ini: sebutkan satu “berhala” kecil (kebiasaan, layar, sikap) yang mencemari rumah hatimu. Buang atau batasi, lalu luangkan waktu syukur mengingat saat Tuhan menjawabmu di kesesakan.",
    prayer:
      "Allah Betel, bawa aku kembali. Tolong aku membuang yang mencemari, dan mendirikan mezbah syukur bagi-Mu yang menjawabku di kesesakan. Amin.",
    questions: [
      "Apa “Betel” dalam hidupmu—tempat/memori kesetiaan Tuhan yang perlu kamu kunjungi lagi?",
      "Berhala apa yang perlu dibersihkan dari rumah atau hatimu?",
      "Bagaimana syukur dan pertobatan saling mengikat dalam Kejadian 35:3?",
    ],
    themeId: "obedience",
  },
  "kejadian 36": {
    reference: "Kejadian 36:6–7",
    text: "Esau membawa isteri-isterinya, anak-anaknya, dan segala hartanya, lalu pergilah ia ke negeri lain, menjauhi Yakub adiknya, sebab harta milik mereka terlalu banyak untuk tinggal bersama.",
    title: "Dua jalan, satu pemeliharaan",
    hook: "Pemeliharaan Allah lebih luas dari jalur yang kita anggap “satu-satunya cerita penting”.",
    focus:
      "Silsilah Esau menunjukkan bahwa Tuhan juga memelihara garis keturunan di luar jalur janji Yakub. Mereka berpisah karena berkat yang melimpah—ruang diatur supaya masing-masing berjalan.",
    angle:
      "Bahkan di pasal yang terasa “hanya daftar nama”, kita melihat Allah mengatur ruang dan masa depan. Pemeliharaan-Nya tidak sempit. Kita diajak berhenti iri pada jalur orang lain dan percaya Ia juga bekerja di luar sorotan kita.",
    application:
      "Langkah hari ini: lepaskan satu perbandingan dengan “jalur” orang lain (karier, keluarga, berkat). Ucapkan syukur untuk pemeliharaan Tuhan di jalurmu sendiri.",
    prayer:
      "Tuhan yang memelihara banyak jalur, lepaskan aku dari iri. Ajar aku percaya pada pemeliharaan-Mu di tempatku berdiri hari ini. Amin.",
    questions: [
      "Dengan jalur siapa kamu paling sering membandingkan hidupmu?",
      "Bagaimana Kejadian 36 menolongmu melihat pemeliharaan Tuhan yang lebih luas?",
      "Satu syukur spesifik apa untuk “jalurmu” sendiri hari ini?",
    ],
    themeId: "provision",
  },
  "kejadian 37-38": {
    reference: "Kejadian 37:5",
    text: "Pada suatu kali bermimpilah Yusuf, lalu mimpinya itu diceritakannya kepada saudara-saudaranya; sebab itulah mereka lebih membenci lagi dia.",
    title: "Mimpi Tuhan, hati yang sakit",
    hook: "Panggilan Tuhan bisa memicu konflik sebelum membuahkan berkat.",
    focus:
      "Yusuf dikasihi ayahnya, dibenci saudara-saudaranya, dan dijual. Di tengah iri hati keluarga, Tuhan sudah menanam mimpi yang akan menata masa depan. Penolakan manusia bukan akhir rencana Allah.",
    angle:
      "Mimpi itu benar, tetapi hati saudara sakit. Kejadian 37:5 mengajak kita tidak menyamakan penolakan manusia dengan kegagalan Tuhan—sekaligus berhati-hati: karunia tanpa hikmat bisa melukai. Panggilan butuh ketekunan melewati musim yang gelap.",
    application:
      "Langkah hari ini: jika ada penolakan yang kamu kaitkan dengan “gagal dipanggil”, tulis ulang: “Penolakan manusia ≠ gagalnya Tuhan.” Lalu lakukan satu langkah setia di tugas kecil yang ada di depanmu.",
    prayer:
      "Tuhan, saat panggilan-Mu membawa luka, jaga hatiku. Ajar aku setia di musim gelap, dan jangan biarkan penolakan manusia mendefinisikan akhir ceritaku. Amin.",
    questions: [
      "Penolakan mana yang paling mudah kamu artikan sebagai kegagalan Tuhan?",
      "Bagaimana mimpi Yusuf menantang caramu membawa karunia di tengah orang lain?",
      "Satu langkah setia apa di “musim gelap” yang bisa kamu kerjakan hari ini?",
    ],
    themeId: "calling",
  },
  "kejadian 39-40": {
    reference: "Kejadian 39:2",
    text: "Tetapi Tuhan menyertai Yusuf, sehingga ia menjadi seorang yang selalu berhasil dalam pekerjaannya; dan ia tinggal di rumah tuannya, orang Mesir itu.",
    title: "Tuhan menyertai di rumah orang",
    hook: "Keberhasilan sejati bukan karena tempatnya enak, tetapi karena Tuhan yang menyertai.",
    focus:
      "Yusuf jadi budak, lalu dipenjara karena fitnah. Namun berulang kali dicatat: Tuhan menyertai dia—di rumah Potifar maupun di penjara. Integritas tetap mungkin di tempat asing.",
    angle:
      "Kejadian 39:2 memindahkan pusat cerita dari lokasi ke penyertaan. Kita bisa berada di “rumah orang” yang tidak ideal, tetapi tetap berhasil dalam arti yang benar: setia, bersih, dan dipakai Tuhan di sana.",
    application:
      "Langkah hari ini: di tempat kerja atau rumah yang terasa “bukan milikmu”, kerjakan satu tugas dengan integritas penuh—sebagai respons atas penyertaan Tuhan, bukan untuk pujian manusia.",
    prayer:
      "Tuhan yang menyertai Yusuf, sertai aku di tempat yang asing atau sulit. Bentuk integritasku, dan biar penyertaan-Mu menjadi kekuatan kerjaku. Amin.",
    questions: [
      "Di “rumah orang” mana kamu paling sulit menjaga integritas?",
      "Bagaimana Kejadian 39:2 mendefinisikan ulang “berhasil” bagimu?",
      "Satu batasan kudus apa yang perlu kamu jaga minggu ini?",
    ],
    themeId: "presence",
  },
  "kejadian 41": {
    reference: "Kejadian 41:16",
    text: "Yusuf menjawab Firaun: »Bukan aku, melainkan Allah yang akan memberitakan kesejahteraan kepada Firaun.«",
    title: "Bukan aku, melainkan Allah",
    hook: "Di puncak kenaikan, hati yang sehat mengalihkan hormat kepada Allah.",
    focus:
      "Yusuf menafsir mimpi Firaun dan diangkat menjadi pengelola Mesir. Di momen yang bisa membesarkan ego, ia menolak mengambil kredit: bukan aku, melainkan Allah.",
    angle:
      "Karunia yang membuka pintu bukan untuk membangun nama sendiri. Kejadian 41:16 adalah pola yang menjaga hati saat Tuhan meninggikan kita—supaya keberhasilan tidak menjadi berhala baru.",
    application:
      "Langkah hari ini: saat ada pujian atau keberhasilan kecil, alihkan secara sadar—“Bukan aku, melainkan Allah”—dalam doa atau ucapan syukur yang konkret kepada-Nya.",
    prayer:
      "Tuhan, jaga hatiku saat Engkau meninggikan. Ajar aku berkata seperti Yusuf: bukan aku, melainkan Engkau. Amin.",
    questions: [
      "Di area mana ego paling mudah mengambil kredit dari pekerjaan Tuhan?",
      "Bagaimana Kejadian 41:16 menolongmu memegang karunia dengan rendah hati?",
      "Satu cara apa untuk mengalihkan hormat kepada Allah minggu ini?",
    ],
    themeId: "calling",
  },
  "kejadian 42": {
    reference: "Kejadian 42:21",
    text: "Mereka berkata seorang kepada yang lain: »Sesungguhnya kita harus menanggung akibat dosa kita terhadap adik kita itu; kita telah melihat kesusahan jiwanya, ketika ia memohon belas kasihan kepada kita, tetapi kita tidak mendengarkannya; itulah sebabnya kesusahan ini menimpa kita.«",
    title: "Nurani yang akhirnya bicara",
    hook: "Allah sering memakai keadaan untuk menghadapkan kita pada dosa yang lama dikubur.",
    focus:
      "Saudara-saudara Yusuf datang membeli gandum. Tekanan di Mesir membangunkan rasa bersalah lama. Mereka akhirnya mengakui: kesusahan adik yang dulu diabaikan kini menimpa mereka.",
    angle:
      "Pertobatan sejati mulai saat nurani jujur—bukan hanya saat kita mencari jalan keluar. Kejadian 42:21 menunjukkan bahwa pengakuan adalah pintu: dosa disebut dengan namanya, belas kasihan yang ditolak dulu kini menjadi cermin.",
    application:
      "Langkah hari ini: jika ada kesalahan lama yang “muncul lagi” lewat keadaan, jangan hanya mencari solusi praktis. Akui di hadapan Tuhan (dan bila perlu kepada orang yang dilukai) dengan kalimat yang jujur.",
    prayer:
      "Tuhan, bangunkan nuraniku dengan benar. Ajar aku mengakui dosa, bukan hanya melarikan diri dari akibatnya. Pulihkan aku dalam kebenaran. Amin.",
    questions: [
      "Kesalahan lama apa yang sedang “dibangunkan” oleh keadaanmu sekarang?",
      "Bagaimana pengakuan saudara-saudara Yusuf menantang caramu bertobat?",
      "Kepada siapa kamu perlu berbicara jujur minggu ini?",
    ],
    themeId: "forgiveness",
  },
  "kejadian 43": {
    reference: "Kejadian 43:14",
    text: "Kiranya Allah Yang Mahakuasa membuat orang itu menaruh belas kasihan kepadamu, supaya ia membiarkan saudaramu yang lain itu dan Benyamin pergi bersama-sama dengan kamu. Mengenai aku, jika aku harus kehilangan anak-anakku, biarlah aku kehilangan!",
    title: "Menyerahkan anak ke tangan Allah",
    hook: "Mengasihi seseorang tidak selalu berarti kita sanggup menjaganya sendiri.",
    focus:
      "Kelaparan memaksa Yakub mengambil keputusan yang paling ditakutinya: melepas Benyamin ke Mesir. Bayangan kehilangan Yusuf masih hidup, dan kini anak kesayangan harus pergi. Di ujung keengganannya, Yakub tidak lagi bertahan hanya dengan strategi manusia—ia menyerahkan anak-anaknya kepada Allah Yang Mahakuasa.",
    angle:
      "Iman Yakub di sini bukan iman yang tenang tanpa gemetar. Ia berdoa agar orang Mesir itu menaruh belas kasihan, lalu mengakui kemungkinan kehilangan. Justru di situlah kedalamannya: takut diakui, kendali dilepas, dan masa depan orang yang dikasihi ditaruh di tangan Tuhan. Mengasihi dengan benar kadang berarti berhenti menggenggam seolah kita sumber keamanannya.",
    application:
      "Langkah hari ini: sebutkan satu orang atau satu perkara yang kamu genggam terlalu erat karena takut kehilangan. Serahkan dalam doa singkat—bukan karena berhenti peduli, tetapi karena Allah lebih setia daripada genggamanmu. Lalu ambil satu langkah percaya yang selama ini kamu tunda.",
    prayer:
      "Allah Yang Mahakuasa, seperti Yakub yang akhirnya melepas Benyamin, ajar aku mempercayakan orang yang kukasihi kepada-Mu. Ganti genggamanku dengan iman, dan takutku dengan belas kasihan-Mu. Amin.",
    questions: [
      "Apa yang paling sulit kamu serahkan kepada Tuhan saat ini—orang, rencana, atau kendali?",
      "Dalam Kejadian 43:14, Yakub jujur soal kemungkinan kehilangan. Di mana kamu masih berpura-pura “kuat” padahal takut?",
      "Satu langkah kecil apa yang menunjukkan bahwa kamu mulai percaya, bukan hanya menggenggam?",
    ],
    themeId: "faith",
  },
  "kejadian 44": {
    reference: "Kejadian 44:33",
    text: "Oleh sebab itu, biarkanlah kiranya hambamu ini tinggal menjadi budak tuanku sebagai ganti anak itu, dan biarkanlah anak itu pulang bersama-sama dengan saudara-saudaranya.",
    title: "Pengganti yang rela berkorban",
    hook: "Perubahan sejati terlihat saat kita rela rugi demi orang lain.",
    focus:
      "Di hadapan Yusuf, Yehuda berbicara jujur dan menawarkan dirinya menjadi budak menggantikan Benyamin. Hati yang dulu rela menjual adik kini berani maju—bukan menghindar—demi melindungi saudara dan ayahnya.",
    angle:
      "Kejadian 44:33 menunjukkan pertobatan yang sudah matang: bukan sekadar menyesal, tetapi siap menanggung akibat demi memulihkan keluarga. Rekonsiliasi jarang dimulai dengan kata-kata indah; sering kali butuh seseorang yang mau rugi lebih dulu.",
    application:
      "Langkah hari ini: pikirkan satu relasi yang masih tegang. Tanyakan pada diri sendiri, “Apa satu kerugian kecil yang rela kutanggung demi pemulihan?”—waktu, ego, atau langkah pertama meminta maaf—lalu kerjakan hari ini.",
    prayer:
      "Tuhan, bentuk hatiku seperti Yehuda yang berubah: rela maju dan berkorban demi rekonsiliasi. Lepaskan aku dari ego yang ingin menang sendiri. Amin.",
    questions: [
      "Di relasi mana kamu dipanggil “mengganti” dengan menanggung sesuatu demi damai?",
      "Bagaimana tawaran Yehuda menyingkapkan bedanya penyesalan dan pertobatan?",
      "Satu kerugian kecil apa yang bisa kamu tanggung minggu ini demi pemulihan?",
    ],
    themeId: "forgiveness",
  },
  "kejadian 45-46": {
    reference: "Kejadian 45:5",
    text: "Tetapi sekarang, janganlah bersusah hati dan janganlah menyesali diri, karena kamu menjual aku ke sini, sebab untuk memelihara kehidupanlah Allah menyuruh aku mendahului kamu.",
    title: "Allah yang menulis ulang niat jahat",
    hook: "Kedaulatan Allah tidak menyangkal kejahatan—tetapi menolak membiarkan dendam yang menentukan akhir cerita.",
    focus:
      "Yusuf membuka identitasnya, menghibur saudara-saudaranya, dan membawa keluarga Yakub ke Mesir. Rekonsiliasi terjadi karena ia melihat tangan Allah di balik pengkhianatan: untuk memelihara kehidupan.",
    angle:
      "Yusuf jujur soal penjualan itu, namun menafsir ulang artinya dalam pemeliharaan Allah. Kejadian 45:5 memampukan pengampunan tanpa menutup mata pada luka: dosa tetap dosa, tetapi Tuhan sanggup mengerjakannya menjadi jalan hidup bagi banyak orang.",
    application:
      "Langkah hari ini: sebutkan satu luka lama. Di hadapan Tuhan, akui kejahatannya dengan jujur, lalu mintalah mata untuk melihat—jika ada—cara Ia memelihara hidupmu meski lewat jalan yang menyakitkan. Lepaskan satu dendam dalam doa.",
    prayer:
      "Allah yang memelihara kehidupan, beri aku mata Yusuf: jujur pada luka, tetapi tunduk pada kedaulatan-Mu. Ajar aku mengampuni tanpa menyangkal kebenaran. Amin.",
    questions: [
      "Luka mana yang paling sulit kamu lihat di bawah kedaulatan Allah?",
      "Bagaimana Kejadian 45:5 menolongmu memegang kejujuran dan pengampunan sekaligus?",
      "Satu dendam apa yang ingin kamu lepaskan dalam doa hari ini?",
    ],
    themeId: "provision",
  },
  "kejadian 47-48": {
    reference: "Kejadian 48:15",
    text: "Lalu diberkatinyalah Yusuf: »Allah yang di hadapan-Nya berjalan leluhurku Abraham dan Ishak, Allah yang telah digembalakan aku selama hidupku sampai sekarang.«",
    title: "Digembalakan sampai sekarang",
    hook: "Berkat terbaik yang diwariskan bukan harta, melainkan kesaksian: Allah setia menggembalakan.",
    focus:
      "Yakub memberkati anak-anak Yusuf dan mengenang Allah yang menggembalakannya seumur hidup—dari tipu daya muda sampai masa tua di Mesir. Masa lalu yang rumit tidak membatalkan pemeliharaan-Nya.",
    angle:
      "Kejadian 48:15 merangkum biografi iman: digembalakan sampai sekarang. Kita diajak melihat seluruh perjalanan—bukan hanya musim indah—sebagai arena gembalaan Allah, lalu mewariskan kesaksian itu kepada generasi berikutnya.",
    application:
      "Langkah hari ini: tulis 3 titik dalam hidupmu di mana Tuhan menggembalakanmu “sampai sekarang”. Bagikan satu di antaranya kepada anak, adik, atau sahabat dalam iman.",
    prayer:
      "Allah Gembala, terima kasih Engkau menggembalakan aku sampai sekarang. Ajar aku mewariskan kesaksian itu, bukan hanya harta atau prestasi. Amin.",
    questions: [
      "Di musim mana kamu paling jelas merasakan digembalakan Tuhan?",
      "Bagaimana Kejadian 48:15 menantang caramu memandang masa lalu yang rumit?",
      "Kesaksian apa yang ingin kamu wariskan minggu ini?",
    ],
    themeId: "presence",
  },
  "kejadian 49-50": {
    reference: "Kejadian 50:20",
    text: "Memang kamu telah mereka-rekakan yang jahat terhadap aku, tetapi Allah telah mereka-rekakannya untuk kebaikan, dengan maksud melakukan seperti yang terjadi sekarang ini, yakni memelihara hidup suatu bangsa yang besar.",
    title: "Jahatan manusia, kebaikan Allah",
    hook: "Kita diajak memegang dua kebenaran sekaligus: dosa itu nyata, dan Tuhan sanggup mengerjakan kebaikan dari padanya.",
    focus:
      "Yakub meninggal, saudara-saudara takut dendam Yusuf. Yusuf menjawab dengan teologi yang matang: niat jahat manusia tidak membatalkan kebaikan rencana Allah yang memelihara hidup banyak orang.",
    angle:
      "Ini klimaks kisah Yusuf. Kejadian 50:20 menolak naif (“semua baik-baik saja”) sekaligus menolak putus asa (“semua sia-sia”). Pengampunan berpijak pada kedaulatan Allah yang memelihara kehidupan—lebih besar dari jahatan yang pernah terjadi.",
    application:
      "Langkah hari ini: hadapi satu kenangan pahit dengan dua kalimat jujur—“Itu jahat / itu menyakitkan” dan “Allah sanggup mengerjakan kebaikan”. Lalu pilih satu tindakan yang memelihara hidup orang lain, bukan memelihara dendam.",
    prayer:
      "Tuhan, beri aku iman Yusuf: melihat jahatan tanpa menyangkalnya, dan melihat kebaikan-Mu tanpa menutup mata. Bentuk pengampunanku di atas kedaulatan-Mu. Amin.",
    questions: [
      "Di mana kamu masih hanya melihat jahatan, tanpa ruang bagi kebaikan Allah?",
      "Bagaimana Kejadian 50:20 menjaga supaya pengampunan tidak menjadi penyangkalan?",
      "Satu tindakan “memelihara hidup” apa yang bisa menggantikan dendam minggu ini?",
    ],
    themeId: "forgiveness",
  },
  "keluaran 1-2": {
    reference: "Keluaran 2:24",
    text: "Allah mendengar keluhan mereka dan Allah ingat akan perjanjian-Nya dengan Abraham, Ishak dan Yakub.",
    title: "Allah ingat di tengah perbudakan",
    hook: "Ketika tekanan terasa tidak berujung, Firman mengingatkan: Allah tidak lupa janji-Nya meski generasi berganti.",
    focus:
      "Bangsa Israel diperbudak di Mesir; kelahiran Musa diselamatkan lewat keranjang di sungai. Di balik kerja paksa dan pembunuhan bayi, Allah mendengar keluhan umat-Nya dan mengingat perjanjian dengan nenek moyang mereka.",
    angle:
      "Keluaran 2:24 menempatkan pembebasan bukan dimulai dari kekuatan manusia, melainkan dari ingatan dan kasih setia Allah. Perbudakan nyata, tetapi janji lebih nyata lagi. Tuhan tidak absen hanya karena situasi terlihat permanen.",
    application:
      "Langkah hari ini: sebutkan satu situasi yang terasa “tidak akan berubah”. Baca Keluaran 2:24 sebagai pengingat, lalu doakan—bukan menuntut jadwal, tetapi percaya bahwa Allah mendengar dan mengingat.",
    prayer:
      "Allah perjanjian, dengar keluhanku di tengah tekanan. Ingat janji-Mu, dan jangan biarkan aku putus asa sebelum Engkau bekerja. Amin.",
    questions: [
      "Tekanan apa yang paling membuatmu merasa Allah lupa?",
      "Bagaimana Keluaran 2:24 mengubah caramu menunggu pembebasan?",
      "Siapa yang bisa kamu doakan hari ini yang sedang “diperbudak” oleh keadaan?",
    ],
    themeId: "promise",
  },
  "keluaran 3-4": {
    reference: "Keluaran 3:12",
    text: "Ia berfirman: »Aku pasti akan menyertai engkau; inilah tanda bagimu, bahwa Akulah yang menyuruh engkau: apabila engkau telah membawa umat itu keluar dari Mesir, kamu akan beribadah kepada Allah di gunung ini.«",
    title: "Semak menyala, panggilan yang takut",
    hook: "Allah memanggil bukan orang yang merasa siap, melainkan orang yang butuh jaminan penyertaan.",
    focus:
      "Musa melihat semak yang menyala tanpa habis terbakar. Tuhan menyatakan diri dan memanggilnya membebaskan Israel. Musa keberatan berulang kali—siapa aku, siapa Engkau, mereka tidak percaya—tetapi Allah memberi tanda dan janji: Aku pasti akan menyertai engkau.",
    angle:
      "Panggilan Musa penuh keraguan manusiawi, bukan heroisme instan. Keluaran 3:12 adalah jangkar: penyertaan datang sebelum keberhasilan. Tuhan tidak menuntut kepercayaan diri Musa; Ia menuntut kepercayaan pada janji-Nya.",
    application:
      "Langkah hari ini: jika ada panggilan atau tanggung jawab yang kamu hindari karena merasa tidak cukup, tulis Keluaran 3:12 di tempat yang terlihat. Ambil satu langkah kecil taat—kirim pesan, mulai percakapan, atau berdoa dengan jujur tentang ketakutanmu.",
    prayer:
      "Tuhan semak yang menyala, panggil aku meski aku ragu. Sertai aku seperti Engkau menjanjikan Musa, dan kuatkan langkah taat yang pertama. Amin.",
    questions: [
      "Keberatan apa yang paling sering kamu bawa saat Tuhan memanggil?",
      "Bagaimana janji penyertaan di Keluaran 3:12 berbeda dari “merasa siap”?",
      "Satu langkah taat apa yang sudah jelas meski hatimu masih gemetar?",
    ],
    themeId: "calling",
  },
  "keluaran 5-6": {
    reference: "Keluaran 6:6",
    text: "Karena itu, katakanlah kepada orang Israel: Akulah TUHAN, dan Aku akan membebaskan kamu dari kerja paksa orang Mesir dan melepaskan kamu dari perbudakan; Aku akan menebus kamu dengan tangan yang teracung dan dengan keputusan-keputusan yang dahsyat.",
    title: "Tekanan bertambah sebelum pembebasan",
    hook: "Kadang taat justru membuat beban sementara terasa lebih berat—bukan tanda Tuhan gagal.",
    focus:
      "Musa dan Harun meminta Firaun melepaskan Israel; Firaun malah menambah beban kerja. Bangsa Israel marah kepada Musa. Di titik putus asa itu, Tuhan menegaskan identitas-Nya: Akulah TUHAN, dan Aku akan menebus.",
    angle:
      "Keluaran 5–6 mengajarkan bahwa pembebasan Allah tidak selalu linear. Tekanan bisa memuncak tepat sebelum campur tangan-Nya. Janji di Keluaran 6:6 diucapkan bukan saat semuanya mudah, melainkan saat umat sudah kehilangan harapan.",
    application:
      "Langkah hari ini: jika langkah taatmu baru-baru ini malah memperberat situasi, jangan menarik kesimpulan “salah jalan”. Bawa kegelapan itu ke dalam doa, lalu pegang Keluaran 6:6 sebagai janji yang belum habis waktunya.",
    prayer:
      "TUHAN yang membebaskan, jangan biarkan tekanan sementara membuatku menyerah. Teguhkan hatiku pada janji-Mu meski jalan masih sulit. Amin.",
    questions: [
      "Kapan kamu pernah merasa taat malah memperburuk keadaan?",
      "Bagaimana Keluaran 6:6 menolongmu menunggu pembebasan yang belum kelihatan?",
      "Siapa yang perlu kamu hibur dengan janji Tuhan hari ini?",
    ],
    themeId: "promise",
  },
  "keluaran 7-8": {
    reference: "Keluaran 7:5",
    text: "Maka orang Mesir akan mengetahui, bahwa Akulah TUHAN, apabila Aku mengacungkan tangan-Ku terhadap Mesir dan membawa orang Israel, umat-Ku, keluar dari negeri mereka.«",
    title: "TUHAN diperkenalkan lewat keputusan",
    hook: "Plagen bukan sekadar spektakel—Allah sedang menegaskan siapa Dia di hadapan bangsa yang lupa.",
    focus:
      "Musa dan Harun menghadap Firaun; tongkat jadi ular, sungai jadi darah, katak memenuhi negeri. Firaun keras hati, tetapi setiap keputusan menunjukkan bahwa TUHAN, bukan dewa-dewa Mesir, yang berdaulat.",
    angle:
      "Keluaran 7:5 menjelaskan tujuan plagen: supaya orang Mesir mengetahui Akulah TUHAN. Allah tidak malu menampakkan otoritas-Nya ketika penindasan sudah terlalu lama. Kita diajak percaya: kejahatan tidak akan selamanya tidak dijawab.",
    application:
      "Langkah hari ini: sebutkan satu ketidakadilan yang membuatmu lelah menunggu. Serahkan kepada Tuhan yang berdaulat—bukan dengan pemberontakan, melainkan dengan doa yang percaya Ia melihat dan bertindak.",
    prayer:
      "TUHAN yang berdaulat, ajar aku percaya bahwa Engkau tidak diam selamanya. Kuatkan imanku saat kejahatan tampak menang. Amin.",
    questions: [
      "Ketidakadilan apa yang paling sulit kamu serahkan kepada kedaulatan Tuhan?",
      "Bagaimana plagen mengingatkanmu bahwa Allah peduli pada penindasan?",
      "Doa apa yang muncul setelah membaca Keluaran 7–8?",
    ],
    themeId: "courage",
  },
  "keluaran 9": {
    reference: "Keluaran 9:16",
    text: "Tetapi justru karena itulah Aku membiarkan engkau hidup, yaitu untuk menunjukkan kepadamu kekuasaan-Ku, dan agar nama-Ku dimasyhurkan di seluruh bumi.",
    title: "Kekerasan hati dan tujuan yang lebih besar",
    hook: "Allah tidak kehilangan kendali meski Firaun berulang kali menolak.",
    focus:
      "Hujan es dan petir dahsyat menghancurkan tanaman; Firaun sempat mengakui dosa lalu mengeras lagi. Tuhan berfirman bahwa Firaun dipertahankan hidup agar kekuasaan Allah nyata dan nama-Nya dimasyhurkan.",
    angle:
      "Keluaran 9:16 tidak membenarkan kejahatan Firaun, tetapi menegaskan kedaulatan Allah bahkan atas orang yang keras kepala. Cerita pembebasan lebih besar dari satu raja; tujuan akhirnya adalah kemuliaan TUHAN dan keselamatan umat-Nya.",
    application:
      "Langkah hari ini: jika ada orang atau sistem yang terasa “tidak akan pernah berubah”, bawa frustrasimu ke Tuhan. Percayalah bahwa rencana-Nya lebih luas dari satu musuh—dan jangan biarkan kegelapan orang lain merusak imanmu.",
    prayer:
      "Allah yang berdaulat, jangan biarkan kekerasanku atau kekerasan orang lain mengalahkan rencana-Mu. Masyhurkan nama-Mu, dan selamatkan aku dari keras hati. Amin.",
    questions: [
      "Di mana kamu tergoda mengeras seperti Firaun setelah hampir bertobat?",
      "Bagaimana Keluaran 9:16 menantang caramu melihat “mengapa Tuhan menunggu”?",
      "Apa yang Tuhan ajarkan tentang karakter-Nya lewat plagen ini?",
    ],
    themeId: "obedience",
  },
  "keluaran 10-11": {
    reference: "Keluaran 10:2",
    text: "Dan supaya engkau menceritakan kepada anak-anakmu dan cucu-cucumu, bahwa Aku telah bertindak kejam terhadap orang Mesir dan tentang tanda-tanda kekuasaan-Ku, yang Kuperbuat di antara mereka, supaya kamu mengetahui, bahwa Akulah TUHAN.«",
    title: "Kegelapan sebelum keluar",
    hook: "Malam terpanjang sering datang tepat sebelum pagi pembebasan.",
    focus:
      "Belalang melahap sisa tanaman; kegelapan tiga hari menutup Mesir. Firaun masih menolak. Tuhan mengumumkan kematian anak sulung—pembayaran terakhir—dan memerintahkan Israel mempersiapkan Paskah.",
    angle:
      "Keluaran 10:2 mengingatkan generasi mendatang: ceritakan apa yang TUHAN lakukan. Pembebasan bukan hanya untuk yang mengalami, melainkan warisan iman. Kegelapan dan plagen terakhir menunjukkan betapa seriusnya dosa penindasan—dan betapa besar kasih Allah yang menuntun umat-Nya keluar.",
    application:
      "Langkah hari ini: ceritakan satu kisah pembebasan atau pertolongan Tuhan dalam hidupmu kepada anak, adik, atau teman seiman. Biarkan kesaksian menjadi benih iman generasi berikutnya.",
    prayer:
      "TUHAN, ajar aku menceritakan perbuatan-Mu, bukan hanya mengeluh. Biar anak-anak imanku tahu: Engkau yang membebaskan. Amin.",
    questions: [
      "Kisah pertolongan Tuhan apa yang perlu kamu wariskan?",
      "Bagaimana kegelapan di Keluaran 10 menolongmu memahami “malam sebelum pagi”?",
      "Siapa yang bisa kamu ajak merenungkan kekuasaan TUHAN minggu ini?",
    ],
    themeId: "promise",
  },
  "keluaran 12": {
    reference: "Keluaran 12:13",
    text: "Dan darah itu akan menjadi tanda bagimu di rumah-rumah tempat tinggalmu; apabila Aku melihat darah itu, maka Aku akan lewat dari pada kamu, sehingga kamu tidak akan ditimpa tulah pemusnah, apabila Aku menghukum tanah Mesir.«",
    title: "Paskah: darah yang melindungi",
    hook: "Pembebasan dimulai dengan anugerah yang ditandai—bukan dengan prestasi umat.",
    focus:
      "Allah menetapkan Paskah: domba sembelihan, darah di ambang pintu, roti tidak beragi, bersiap pergi. Malam itu anak sulung Mesir mati, tetapi rumah Israel yang ditandai darah dilindungi. Mereka keluar dari Mesir.",
    angle:
      "Keluaran 12:13 adalah inti: perlindungan datang karena tanda yang Allah tetapkan, bukan karena Israel lebih layak. Paskah mengajarkan bahwa hidup diselamatkan oleh kasih karunia yang ditandai—teladan yang akan digenapi sepenuhnya di Kristus.",
    application:
      "Langkah hari ini: renungkan satu “tanda” anugerah dalam hidup imanmu (baptisan, perjamuan, atau waktu Tuhan menolong). Ucapkan syukur bahwa keselamatan bukan hasil usahamu sendiri.",
    prayer:
      "Allah Paskah, terima kasih Engkau melindungi dan membebaskan. Ajar aku hidup sebagai orang yang diselamatkan oleh anugerah, bukan oleh prestasi. Amin.",
    questions: [
      "Apa artinya “darah sebagai tanda” bagimu dalam iman?",
      "Bagaimana Keluaran 12 menantang kebanggaan “sudah cukup baik”?",
      "Satu respons syukur apa setelah membaca pembebasan malam itu?",
    ],
    themeId: "provision",
  },
  "keluaran 13-14": {
    reference: "Keluaran 14:14",
    text: "TUHAN akan berperang untuk kamu, sedang kamu diam saja.«",
    title: "Laut terbelah, Allah berperang",
    hook: "Di ujung jalan buntu, Tuhan meminta kepercayaan—bukan panik.",
    focus:
      "Israel keluar dengan harta Mesir, dikejar tentara Firaun. Umat takut di depan Laut Teberau. Musa menegur: berdirilah, lihat keselamatan TUHAN. Laut terbelah, Israel menyeberang, Firaun tenggelam.",
    angle:
      "Keluaran 14:14 bukan ajakan pasif total, melainkan iman yang menunggu Allah bertindak di saat manusia tidak punya jalan. TUHAN berperang—kita diajak berhenti mengambil alih dengan kepanikan. Keselamatan datang dengan cara yang tidak terduga.",
    application:
      "Langkah hari ini: hadapi satu situasi “terkepung” dengan doa diam 5 menit sebelum bereaksi. Ucapkan Keluaran 14:14, lalu lihat langkah apa yang Tuhan buka setelah hatimu tenang.",
    prayer:
      "TUHAN yang berperang, di depan lautanku, ajar aku diam yang percaya. Selamatkan aku dengan cara-Mu, bukan dengan kepanikanku. Amin.",
    questions: [
      "Situasi “terkepung” apa yang sedang kamu hadapi?",
      "Apa bedanya “diam percaya” dengan “pasrah sinis” menurut Keluaran 14?",
      "Di mana kamu melihat Tuhan “membelah laut” dalam hidupmu?",
    ],
    themeId: "presence",
  },
  "keluaran 15-16": {
    reference: "Keluaran 15:2",
    text: "Ia kekuatanku dan mazmurku, Ia menjadi keselamatanku. Ia Allahku, kumasihi-Nya, kupuji-Nya, Allah bapaku, kupuja-Nya.",
    title: "Nyanyian di pantai, manna di padang",
    hook: "Pujian dan keluhan bisa hidup berdampingan dalam perjalanan iman.",
    focus:
      "Musa dan umat menyanyikan kemenangan di Laut Teberau. Di padang gurun, air pahit di Manah, lalu manna turun setiap pagi. Tuhan memberi roti dari langit dan aturan: ambil cukup, percaya untuk hari esok.",
    angle:
      "Keluaran 15:2 adalah puncak syukur; Keluaran 16 mengajarkan ketergantungan harian. Allah cukup untuk hari ini—manusia cenderung mengumpul karena takut. Perjalanan iman penuh nyanyian dan godaan untuk tidak percaya lagi.",
    application:
      "Langkah hari ini: tulis satu baris pujian seperti Keluaran 15:2 untuk pertolongan terbaru. Lalu praktikkan “manna”: cukupkan diri dengan apa yang Tuhan beri hari ini, tanpa mengumpul kecemasan untuk besok.",
    prayer:
      "Allah keselamatanku, terima kasih untuk laut yang terbelah. Beri aku manna hari ini—cukup, segar, dan penuh percaya. Amin.",
    questions: [
      "Antara pujian dan keluhan, hatimu lebih dekat ke mana minggu ini?",
      "Bagaimana aturan manna menantang kebiasaan mengumpul kecemasan?",
      "Satu nyanyian syukur apa yang ingin kamu ucapkan hari ini?",
    ],
    themeId: "provision",
  },
  "keluaran 17-18": {
    reference: "Keluaran 17:15",
    text: "Musa mendirikan mezbah dan menamainya: TUHAN panji ku.",
    title: "Batu di Horeb, nasihat Yitro",
    hook: "Tuhan memberi dari batu—dan mengirim orang untuk menolong kita tidak sendirian.",
    focus:
      "Umat haus, Musa memukul batu dan air mengalir. Amalek diserang; Israel menang selama Musa mengangkat tangannya. Yitro datang, memberi nasihat mengatur hakim supaya Musa tidak jatuh.",
    angle:
      "Keluaran 17:15 menamai tempat: TUHAN panji ku—Allah adalah panji kemenangan. Yitro menunjukkan bahwa iman tidak menolak struktur dan komunitas. Tuhan memberi secara ajaib sekaligus praktis: air, kemenangan, dan kebijaksanaan melalui sahabat.",
    application:
      "Langkah hari ini: akui satu “Yitro” dalam hidupmu—orang yang memberi nasihat bijak. Terima bantuan itu, atau jadilah Yitro bagi seseorang yang kelelahan melayani.",
    prayer:
      "TUHAN panji ku, jadi benderaku di pertempuran. Kirimkan penolong dan hikmat, supaya aku tidak melayani sendirian sampai jatuh. Amin.",
    questions: [
      "Di mana kamu haus dan butuh “air dari batu”?",
      "Siapa Yitro dalam hidupmu—atau siapa yang butuh kamu jadi Yitro?",
      "Apa artinya “TUHAN panji ku” dalam situasimu sekarang?",
    ],
    themeId: "presence",
  },
  "keluaran 19-20": {
    reference: "Keluaran 20:2",
    text: "Akulah TUHAN, Allahmu, yang telah membawa engkau keluar dari tanah Mesir, dari tempat perbudakan.",
    title: "Gunung Sinai dan Sepuluh Firman",
    hook: "Hukum Tuhan didasarkan bukan pada ketakutan sembarangan, melainkan pada pembebasan yang sudah dikerjakan.",
    focus:
      "Israel berkemah di Sinai; gunung bergemuruh, Tuhan turun dalam kemuliaan. Sepuluh Firman diumumkan—dimulai dengan identitas: Akulah TUHAN yang membebaskan engkau. Umat takut; Musa menjadi pengantara.",
    angle:
      "Keluaran 20:2 menempatkan ketaatan di atas fondasi anugerah: Engkau dibebaskan dulu, lalu hidup menurut firman. Hukum bukan jalan masuk pembebasan, melainkan respons umat yang sudah diselamatkan. Tuhan dekat, tetapi kudus.",
    application:
      "Langkah hari ini: pilih satu firman dari Keluaran 20 yang paling menegur atau menghibur. Tanyakan: “Bagaimana ini respons syukur atas pembebasan yang sudah Tuhan beri?”",
    prayer:
      "TUHAN yang membebaskan, ajar aku hidup Sepuluh Firman bukan sebagai beban, melainkan sebagai jalan syukur. Kuduskan hatiku. Amin.",
    questions: [
      "Firman mana dari Keluaran 20 paling menggugah hatimu?",
      "Bagaimana Keluaran 20:2 mengubah caramu melihat “aturan”?",
      "Di mana kamu perlu pengantara seperti Musa untuk mendekati Tuhan dengan benar?",
    ],
    themeId: "obedience",
  },
  "keluaran 21-22": {
    reference: "Keluaran 21:1",
    text: "Inilah hukum-hukum yang harus kauletakkan di depan mereka:",
    title: "Hukum untuk kehidupan bersama",
    hook: "Allah peduli detail keadilan—bukan hanya ibadah di gunung.",
    focus:
      "Setelah Sepuluh Firman, Tuhan memberi hukum tentang hamba, kekerasan, ganti rugi, kepedulian terhadap yang lemah. Hukum Taurat membentuk masyarakat yang adil, bukan hanya ritual.",
    angle:
      "Keluaran 21–22 menunjukkan bahwa iman menyentuh kontrak, tetangga, dan yang rentan. Tuhan tidak hanya memanggil umat dekat kepada-Nya, tetapi memanggil mereka hidup adil di antara manusia. Kekudusan Allah membasahi etika sehari-hari.",
    application:
      "Langkah hari ini: periksa satu relasi atau transaksi di mana keadilan bisa kamu perbaiki—bayar utang, kembalikan barang, atau minta maaf atas ketidakadilan kecil.",
    prayer:
      "Allah adil, bentuk hidupku supaya keadilan-Mu tampak dalam detail. Lindungi yang lemah melalui tanganku. Amin.",
    questions: [
      "Hukum mana di Keluaran 21–22 paling menantang budaya sekitarmu?",
      "Di mana imanmu perlu turun dari “ibadah” ke keadilan praktis?",
      "Satu langkah keadilan apa yang bisa kamu ambil hari ini?",
    ],
    themeId: "obedience",
  },
  "keluaran 23-24": {
    reference: "Keluaran 24:7",
    text: "Lalu diambilnyalah kitab perjanjian itu dan dibacakannya dengan didengar oleh rakyat; mereka berkata: »Semua yang difirmankan TUHAN, akan kami lakukan dan kami akan mentaati.«",
    title: "Perjanjian yang dibacakan dan dijawab",
    hook: "Iman sejati berkata “ya” setelah mendengar—bukan sebelum memahami.",
    focus:
      "Hukum dan janji diperluas; Israel diundang ke perjamuan di gunung. Musa membaca kitab perjanjian; umat menjawab taat. Musa memercikkan darah sebagai tanda perjanjian; sebagian naik dan melihat Allah.",
    angle:
      "Keluaran 24:7 adalah momen komitmen kolektif: mendengar, menjawab, mentaati. Perjanjian bukan kontrak dingin—ada darah, ada perjamuan, ada kehadiran. Kita diajak tidak hanya setuju secara emosional, tetapi hidup dalam ketaatan yang diingat.",
    application:
      "Langkah hari ini: baca satu bagian Firman dengan sengaja “mendengar”, lalu ucapkan respons sederhana: “Tuhan, aku mau taat pada yang jelas hari ini.” Kerjakan satu hal konkret.",
    prayer:
      "TUHAN perjanjian, baca firman-Mu di hatiku. Beri aku “ya” yang sungguh, bukan janji kosong. Amin.",
    questions: [
      "Apakah “semua akan kami lakukan” masih jujur bagimu—atau sudah menjadi kebiasaan?",
      "Bagaimana Keluaran 24 menolongmu melihat perjanjian sebagai hubungan, bukan kontrak?",
      "Satu ketaatan konkret apa yang ingin kamu teguhkan minggu ini?",
    ],
    themeId: "faith",
  },
  "keluaran 25": {
    reference: "Keluaran 25:8",
    text: "Mereka harus membuat tempat kudus B-Ku, supaya Aku dapat diam di tengah-tengah mereka.",
    title: "Allah ingin diam di tengah",
    hook: "Bukan manusia yang naik ke surga dulu—Allah yang merancang kedekatan di tengah umat.",
    focus:
      "Tuhan memerintahkan pembangunan Kemah Suci: persembahan sukarela, tabut perjanjian, propisiatori, kaki dian. Tujuan akhirnya jelas: supaya Aku dapat diam di tengah-tengah mereka.",
    angle:
      "Keluaran 25:8 adalah inti teologi Kemah: Allah yang kudus datang dekat. Ibadah bukan hanya ritual; itu rumah di mana Tuhan dan umat bertemu. Kita diajak melihat bahwa kehadiran Allah adalah hadiah, bukan hak otomatis.",
    application:
      "Langkah hari ini: ciptakan “ruang kudus” kecil—10 menit tanpa HP, dengan Alkitab atau doa—sebagai respons atas kerinduan Tuhan untuk diam dekat.",
    prayer:
      "Allah yang rindu diam di tengah, datang dekat. Buat hatiku tempat kudus yang Engkau sukai singgahi. Amin.",
    questions: [
      "Apa artinya “Allah diam di tengah” bagimu dalam rutinitas?",
      "Persembahan sukarela di Keluaran 25—apa yang rela kamu berikan untuk kedekatan dengan Tuhan?",
      "Bagaimana kamu membuat ruang untuk kehadiran-Nya hari ini?",
    ],
    themeId: "presence",
  },
  "keluaran 26-27": {
    reference: "Keluaran 26:30",
    text: "Haruslah kaurealisasikan kemah itu menurut corak yang telah ditunjukkan kepadamu di gunung.",
    title: "Kemah yang dibuat persis seperti firman",
    hook: "Kedekatan dengan Allah butuh ketaatan detail—bukan hanya niat baik.",
    focus:
      "Petunjuk rinci untuk kemah, tabir, dan pekerjaan: kayu, linen, emas. Altar korban bakaran dan pagar halaman. Semua harus dibuat menurut corak yang Tuhan tunjukkan kepada Musa.",
    angle:
      "Keluaran 26–27 bisa terasa repetitif, tetapi intinya serius: Tuhan peduli bagaimana umat-Nya menyembah. Ketaatan dalam detail adalah bentuk penghormatan. Bukan sembarang ibadah yang diterima—melainkan yang sesuai firman.",
    application:
      "Langkah hari ini: tanyakan apakah ada area ibadah atau pelayananmu yang “seadanya”. Perbaiki satu detail kecil—datang tepat waktu, persiapan doa, atau kerapian—sebagai penghormatan kepada Tuhan.",
    prayer:
      "Tuhan, ajar aku taat pada detail firman-Mu, bukan hanya pada perasaan. Hormatiku tampak dalam ketaatan kecil. Amin.",
    questions: [
      "Di mana kamu cenderung “mengubah corak” firman agar nyaman?",
      "Apa satu detail ketaatan yang ingin kamu perbaiki minggu ini?",
      "Bagaimana petunjuk kemah mengajarkan bahwa ibadah bukan sembarang?",
    ],
    themeId: "obedience",
  },
  "keluaran 28": {
    reference: "Keluaran 28:36",
    text: "Haruslah kaubuat lembaran dari emas murni, dan padanya kaupahatkan ungkapan: KUDUS BAGI TUHAN.",
    title: "Kudus bagi TUHAN",
    hook: "Yang melayani di hadapan Allah dipanggil membawa kekudusan yang terlihat.",
    focus:
      "Allah memerintahkan pakaian imam: efod, tutup dada, bulang, jubah. Harun dan anak-anaknya dikuduskan untuk melayani. Di dahi imam besar tertulis: KUDUS BAGI TUHAN.",
    angle:
      "Keluaran 28:36 bukan hanya dekorasi—itu identitas pelayan. Kehadiran Allah kudus; yang mendekat harus disediakan. Kita melihat bayangan: pelayanan dan kehidupan umat dipanggil mencerminkan kekudusan Tuhan.",
    application:
      "Langkah hari ini: pilih satu area hidup (kata-kata, pekerjaan, media sosial) dan tanyakan: “Apakah ini ‘kudus bagi TUHAN’?” Lakukan satu perbaikan kecil.",
    prayer:
      "TUHAN kudus, kuduskan hidupku. Tulis “Kudus bagi-Mu” di hatiku, bukan hanya di bibir. Amin.",
    questions: [
      "Area mana yang paling sulit kamu hidupi sebagai “kudus bagi TUHAN”?",
      "Apa artinya kekudusan Allah bagimu—jauh atau dekat?",
      "Satu perubahan kecil apa untuk mencerminkan kekudusan-Nya?",
    ],
    themeId: "obedience",
  },
  "keluaran 29": {
    reference: "Keluaran 29:45",
    text: "Aku akan diam di tengah-tengah orang Israel dan Aku akan menjadi Allah mereka.",
    title: "Dikuduskan untuk kehadiran",
    hook: "Pengurapan dan korban bukan tujuan—kehadiran Allah yang menjadi tujuan.",
    focus:
      "Upacara pengurapan Harun dan anak-anaknya, korban panggilan, korban penghapus dosa, roti yang tidak beragi. Tuhan berjanji akan diam di tengah Israel dan menjadi Allah mereka.",
    angle:
      "Keluaran 29:45 merangkum seluruh upacara: supaya Allah menjadi Allah mereka—dekat, personal, hadir. Korban dan pengurapan adalah jalan yang Tuhan sediakan agar yang tidak kudus bisa dekat dengan yang kudus. Anugerah melalui sistem yang ditentukan Allah.",
    application:
      "Langkah hari ini: renungkan bahwa Tuhan ingin “menjadi Allahmu”—bukan hanya Tuhan generik. Bicara kepada-Nya dengan personal: “Allahku, Engkau yang dekat.”",
    prayer:
      "Allahku, diam di tengah hidupku. Kuduskan aku supaya aku bisa dekat dengan-Mu tanpa takut yang salah arah. Amin.",
    questions: [
      "Apakah Tuhan terasa “Allahmu” atau masih jauh dan abstrak?",
      "Bagaimana korban di Keluaran 29 menunjukkan biaya kedekatan?",
      "Satu cara apa untuk merespons kehadiran-Nya hari ini?",
    ],
    themeId: "presence",
  },
  "keluaran 30": {
    reference: "Keluaran 30:6",
    text: "Haruslah kaudupakan di depan propisiatorium di atas tabut hukum Testimonium, di tempat Aku akan bertemu dengan engkau.",
    title: "Tempat pertemuan di atas hukum",
    hook: "Allah bertemu kita di atas dasar perjanjian—bukan di luar realitas dosa kita.",
    focus:
      "Altar dupa, uang tebusan jiwa, bejana pembasuhan, minyak urapan. Tuhan menetapkan tempat pertemuan: di depan propisiatorium, di atas tabut hukum—tempat Aku akan bertemu dengan engkau.",
    angle:
      "Keluaran 30:6 mengikat pertemuan dengan hukum dan tutup pendamaian. Tuhan tidak bertemu kita dengan mengabaikan dosa, melainkan dengan menyediakan tempat pendamaian. Ibadah yang benar mengarah ke pertemuan yang diatur Allah.",
    application:
      "Langkah hari ini: datanglah kepada Tuhan dengan jujur tentang pelanggaran, lalu percayai bahwa Ia menyediakan tempat pertemuan—bukan untuk menghakimi tanpa jalan, melainkan untuk bertemu setelah pendamaian.",
    prayer:
      "Tuhan, temui aku di tempat yang Engkau sediakan. Terima doaku dan hidupku yang jujur, dan damaikan aku. Amin.",
    questions: [
      "Di mana kamu butuh “tempat pertemuan” dengan Tuhan minggu ini?",
      "Bagaimana Keluaran 30:6 menolongmu memahami ibadah dan pendamaian?",
      "Doa apa yang ingin kamu bawa ke hadirat-Nya?",
    ],
    themeId: "forgiveness",
  },
  "keluaran 31-32": {
    reference: "Keluaran 32:26",
    text: "Lalu berdirilah Musa di pintu gerbang perkemahan, sambil berkata: »Siapa yang untuk TUHAN, baiklah datang kepadaku!« Maka berkumpullah kepadanya semua anak-anak Lewi.",
    title: "Lembu emas dan pilihan untuk TUHAN",
    hook: "Ketidaksabaran bisa membuat lembu emas—bahkan saat Tuhan masih berfirman.",
    focus:
      "Allah memberi Musa petunjuk kemah dan hari Sabat. Sementara Musa di gunung, Israel membuat anak lembu emas dan berpesta. Musa memecahkan loh batu, menghancurkan patung, dan memanggil: Siapa yang untuk TUHAN?",
    angle:
      "Keluaran 32 adalah peringatan keras: umat bisa mengganti Tuhan yang invisible dengan berhala yang cepat dan terlihat. Musa menjadi pengantara; sebagian memilih berdiri untuk TUHAN. Ketaatan tidak bisa diganti dengan euforia ritual buatan sendiri.",
    application:
      "Langkah hari ini: tanyakan, “Anak lembu emas apa yang kubuat karena tidak sabar menunggu Tuhan?”—hobi, uang, validasi, atau shortcut. Buang satu kebiasaan yang menggantikan kedekatan dengan Allah.",
    prayer:
      "TUHAN, ampuni berhala kesabaranku. Tarik aku kembali dari euforia palsu, dan biar aku berdiri untuk-Mu. Amin.",
    questions: [
      "“Lembu emas” apa yang paling menggoda saat Tuhan terasa lambat?",
      "Bagaimana Keluaran 32 menantang ibadah yang hanya cari perasaan?",
      "Apa artinya “siapa yang untuk TUHAN” dalam keputusanmu hari ini?",
    ],
    themeId: "faith",
  },
  "keluaran 33-34": {
    reference: "Keluaran 34:6",
    text: "Lalu TUHAN lewat dari depannya dan berseru: »TUHAN, TUHAN, Allah yang pengasih dan penyayang, panjang sabar dan berlimpah kasih setia,«",
    title: "Wajah Musa bersinar",
    hook: "Setelah kegagalan besar, Allah memperkenalkan diri ulang—bukan dengan amarah saja, melainkan dengan kasih setia.",
    focus:
      "Musa memohon kehadiran Tuhan; Tuhan menampakkan kemuliaan-Nya sebagian. Perjanjian diperbarui; loh batu baru. Musa turun dengan wajah bersinar. Allah menyatakan nama-Nya: pengasih, penyayang, panjang sabar, berlimpah kasih setia.",
    angle:
      "Keluaran 34:6 adalah kristalisasi karakter Allah setelah kemurtadan. Tuhan tidak menarik diri total—Ia memperbarui dan menyatakan kasih setia. Wajah Musa bersinar karena ia dekat dengan kehadiran; kita diajak kembali dekat setelah jatuh.",
    application:
      "Langkah hari ini: jika kamu baru gagal besar, jangan lari dari Tuhan. Minta seperti Musa: “Perlihatkan kemuliaan-Mu”—dan biarkan Keluaran 34:6 menjadi firman yang kamu baca berulang.",
    prayer:
      "TUHAN yang pengasih dan panjang sabar, perbarui perjanjian-Mu denganku. Pulihkan aku, dan biar wajahku—hidupku—memantulkan kedekatan dengan-Mu. Amin.",
    questions: [
      "Setelah kegagalan, apakah kamu lari dari Tuhan atau mendekat seperti Musa?",
      "Firman mana dari Keluaran 34:6 paling menghibur hatimu?",
      "Bagaimana kasih setia Tuhan mengubah caramu memandang diri sendiri?",
    ],
    themeId: "forgiveness",
  },
  "keluaran 35": {
    reference: "Keluaran 35:21",
    text: "Lalu datanglah setiap orang yang tergerak hatinya, dan setiap orang yang merasa rela hatinya; mereka membawa persembahan persembahan sukarela untuk pekerjaan Kemah Pertemuan.",
    title: "Hati yang tergerak memberi",
    hook: "Pembangunan rumah Tuhan dimulai dari kemauan hati—bukan dari manipulasi rasa bersalah.",
    focus:
      "Musa mengumpulkan Israel; Sabat ditegaskan lagi. Orang-orang membawa persembahan sukarela—emas, kain, kayu—untuk kemah. Para ahli datang, hati tergerak untuk bekerja.",
    angle:
      "Keluaran 35:21 menunjukkan ibadah yang sehat: pemberian dari hati yang tergerak, bukan paksaan. Setelah kegagalan di Sinai, umat dipulihkan dan merespons dengan kemurahan. Tuhan memakai karunia setiap orang untuk pekerjaan-Nya.",
    application:
      "Langkah hari ini: berikan sesuatu—waktu, uang, atau skill—karena hati tergerak, bukan karena malu atau tekanan. Tanyakan: “Apa yang Tuhan taruh di tanganku untuk kemah-Nya?”",
    prayer:
      "Tuhan, gerakkan hatiku sukarela. Pakailah karuniaku untuk pekerjaan-Mu, bukan untuk pamer. Amin.",
    questions: [
      "Apakah pemberianmu lebih dari kewajiban atau dari hati yang tergerak?",
      "Karunia apa yang Tuhan taruh padamu untuk “membangun kemah”?",
      "Bagaimana Keluaran 35 mengubah caramu melihat pelayanan?",
    ],
    themeId: "calling",
  },
  "keluaran 36": {
    reference: "Keluaran 36:5",
    text: "Mereka berkata kepada Musa: »Umat ini membawa jauh lebih banyak dari yang diperlukan untuk pekerjaan yang diwajibkan TUHAN untuk mengerjakannya.«",
    title: "Cukup—bahkan lebih dari cukup",
    hook: "Ketika hati umat selaras, Tuhan memberi kelimpahan untuk pekerjaan-Nya.",
    focus:
      "Betsaleel dan Aholiab memimpin pembuatan kemah. Umat memberi begitu banyak sehingga Musa harus menyuruh berhenti. Setiap bagian dibuat persis seperti perintah Tuhan.",
    angle:
      "Keluaran 36:5 adalah momen langka: “sudah cukup, bahkan kelebihan”. Kelimpahan datang ketika umat merespons panggilan dengan sukarela. Ketaatan detail dan kemurahan hati berjalan bersama—kemah terbangun bukan oleh satu pahlawan, melainkan oleh komunitas.",
    application:
      "Langkah hari ini: dalam satu proyek komunitas (gereja, kelompok, keluarga), tanyakan apakah kamu hanya mengandalkan “Musa” atau ikut memberi. Lakukan satu kontribusi konkret.",
    prayer:
      "Tuhan, beri aku hati memberi yang cukup—dan komunitas yang saling mendukung membangun rumah-Mu. Amin.",
    questions: [
      "Di komunitas imanmu, apakah kamu memberi atau hanya menunggu orang lain?",
      "Bagaimana Keluaran 36 menantang individualisme dalam pelayanan?",
      "Satu kontribusi apa yang bisa kamu berikan minggu ini?",
    ],
    themeId: "provision",
  },
  "keluaran 37-38": {
    reference: "Keluaran 37:1",
    text: "Betsaleel membuat tabut itu dari kayu aka; panjangnya dua hasta setengah, lebarnya satu setengah hasta, dan tingginya satu setengah hasta.",
    title: "Tabut, kandil, mezbah—tempat pertemuan",
    hook: "Setiap detail kemah mengarahkan mata kepada kehadiran Allah.",
    focus:
      "Betsaleel membuat tabut perjanjian, kandil emas, mezbah dupa, mezbah korban, bejana pembasuhan. Setiap alat punya ukuran dan tujuan—semua untuk ibadah yang Tuhan tentukan.",
    angle:
      "Keluaran 37–38 mengajarkan bahwa ibadah itu terarah: tabut untuk perjanjian, kandil untuk terang, mezbah untuk korban. Tidak ada bagian yang random. Tuhan memimpin bagaimana umat-Nya mendekat—kita diajak menghormati cara-Nya, bukan menciptakan cara sendiri.",
    application:
      "Langkah hari ini: renungkan satu “alat” imanmu—doa, Alkitab, persekutuan. Gunakan dengan sengaja sebagai jalan mendekat kepada Tuhan, bukan sebagai tradisi kosong.",
    prayer:
      "Tuhan, arahkan ibadahku kepada-Mu. Biar setiap kebiasaan rohani membawaku dekat, bukan hanya sibuk religius. Amin.",
    questions: [
      "Kebiasaan rohani mana yang sudah menjadi rutinitas kosong?",
      "Bagaimana tabut dan kandil melambangkan kebutuhanmu akan perjanjian dan terang?",
      "Satu kebiasaan ibadah apa yang ingin kamu hidupi lebih sungguh?",
    ],
    themeId: "obedience",
  },
  "keluaran 39": {
    reference: "Keluaran 39:43",
    text: "Musa melihat seluruh pekerjaan itu, dan sesungguhnya, mereka telah melaksanakannya; seperti yang difirmankan TUHAN demikianlah mereka melaksanakannya. Lalu Musa memberkati mereka.",
    title: "Selesai—persis seperti firman",
    hook: "Keberhasilan sejati di mata Tuhan: sudah dilakukan seperti yang difirmankan.",
    focus:
      "Pakaian imam dan segala perlengkapan kemah selesai dibuat. Israel melaksanakan persis seperti Tuhan perintahkan. Musa memeriksa, memberkati, dan mempersiapkan pendirian kemah.",
    angle:
      "Keluaran 39:43 adalah penutup yang tenang: ketaatan detail membuahkan pekerjaan selesai. Musa memberkati—bukan karena perfect people, melainkan karena pekerjaan yang selaras firman. Tuhan menghargai ketekunan membangun apa yang Ia minta.",
    application:
      "Langkah hari ini: selesaikan satu tugas iman atau tanggung jawab yang sudah lama setengah jadi. Kerjakan “seperti difirmankan”—dengan integritas, bukan asal cepat.",
    prayer:
      "Tuhan, bantu aku menyelesaikan yang Engkau mulai dalam hidupku. Terima pekerjaanku yang taat, dan berkatilah langkahku. Amin.",
    questions: [
      "Pekerjaan apa yang perlu kamu “selesaikan seperti firman”?",
      "Bagaimana Keluaran 39:43 menantang perfeksionisme versus ketaatan?",
      "Siapa yang perlu kamu berkati karena melayani setia?",
    ],
    themeId: "obedience",
  },
  "keluaran 40": {
    reference: "Keluaran 40:34",
    text: "Lalu awan itu menutupi Kemah Pertemuan dan kemuliaan TUHAN memenuhi Kemah Suci.",
    title: "Kemuliaan memenuhi kemah",
    hook: "Tujuan akhir bukan bangunan—melainkan kemuliaan Tuhan yang memenuhi.",
    focus:
      "Musa mendirikan kemah, mengurapi perlengkapan dan imam. Ia menyelesaikan pekerjaan. Awan menutupi kemah; kemuliaan TUHAN memenuhi Kemah Suci sehingga Musa tidak bisa masuk.",
    angle:
      "Keluaran 40:34 adalah klimaks buku: Allah hadir. Semua korban, petunjuk, dan kerja tangan manusia mengarah ke sini—kemuliaan memenuhi. Tuhan tidak hanya memberi aturan; Ia datang tinggal di tengah umat. Itu anugerah yang menakjubkan.",
    application:
      "Langkah hari ini: berhenti sejenak dan syukuri: Tuhan ingin hadir, bukan hanya diatur. Doakan: “Tuhan, penuhi tempat hidupku dengan kemuliaan-Mu”—lalu hidupi hari ini aware akan kehadiran-Nya.",
    prayer:
      "TUHAN yang memenuhi kemah, penuhi hatiku dengan kemuliaan-Mu. Ajar aku hidup aware Engkau hadir. Amin.",
    questions: [
      "Apakah imanmu lebih banyak “membangun kemah” atau “menyambut kemuliaan”?",
      "Bagaimana Keluaran 40:34 mengubah motivasimu melayani?",
      "Di mana kamu butuh sadar akan kehadiran Tuhan hari ini?",
    ],
    themeId: "presence",
  },
  "imamat 1-3": {
    reference: "Imamat 1:4",
    text: "Lalu haruslah ia meletakkan tangannya ke atas kepala korban bakaran itu, supaya korban itu dapat diterima baginya untuk mengadakan pendamaian baginya.",
    title: "Korban: sentuhan yang mengakui",
    hook: "Imamat terbuka dengan ritual—tetapi di baliknya ada hati yang harus mengakui kebutuhan akan pendamaian.",
    focus:
      "Allah memberi petunjuk korban bakaran, korban sajian, dan korban keselamatan. Orang Israel membawa hewan atau tepung; imam meletakkan tangannya di atas kepala korban. Korban diterima untuk pendamaian dan persekutuan.",
    angle:
      "Imamat 1:4 menekankan sentuhan pribadi: orang itu meletakkan tangannya—mengakui “ini milikku, ini dosa dan kebutuhanku”. Korban bukan mantra; itu bahasa iman yang mengarahkan hati kepada Allah yang menyediakan pendamaian.",
    application:
      "Langkah hari ini: bawa satu kebutuhan pendamaian atau syukur kepada Tuhan dengan jujur—bukan ritual kosong, melainkan “meletakkan tangan” secara rohani: akui, serahkan, percaya.",
    prayer:
      "Allah yang menerima korban, terima jujurku. Ajar aku datang dengan hati yang mengakui, bukan hanya formalitas. Amin.",
    questions: [
      "Apa artinya “meletakkan tangan” atas kebutuhanmu hari ini?",
      "Bagaimana korban di Imamat 1–3 menunjukkan bahwa Tuhan peduli pada pendamaian?",
      "Syukur atau pengakuan apa yang perlu kamu bawa kepada Tuhan?",
    ],
    themeId: "forgiveness",
  },
  "imamat 4": {
    reference: "Imamat 4:20",
    text: "Demikianlah harus diperbuat imam itu dengan lembu itu; jadi ia mengadakan pendamaian bagi mereka, dan mereka akan diampuni.",
    title: "Ketika yang diurapi atau umat bersalah",
    hook: "Allah sediakan jalan pendamaian—bahkan ketika dosa menyentuh pemimpin atau seluruh komunitas.",
    focus:
      "Imamat 4 mengatur korban penghapus dosa untuk yang diurapi, seluruh umat, pemimpin, atau orang biasa. Darah disemburkan; daging dipersembahkan. Tujuannya jelas: supaya diadakan pendamaian dan diampuni.",
    angle:
      "Dosa tidak dianggap enteng—tetapi Allah tidak membiarkan umat-Nya tanpa jalan kembali. Korban penghapus dosa menunjukkan bahwa pengampunan butuh biaya dan pengantara. Bayangan yang mengarah kepada pengorbanan Kristus.",
    application:
      "Langkah hari ini: jika ada dosa yang kamu tunda mengakui, bawa kepada Tuhan sekarang—jujur, spesifik, tanpa alasan. Terima bahwa Ia menyediakan pendamaian.",
    prayer:
      "Tuhan, aku mengakui dosaku. Adakan pendamaian bagiku, dan jangan biarkan aku hidup dalam penolakan. Amin.",
    questions: [
      "Dosa apa yang masih kamu tunda bawa kepada Tuhan?",
      "Bagaimana Imamat 4 menantang sikap “dosa kecil tidak apa-apa”?",
      "Apa artinya percaya bahwa “akan diampuni” bagimu?",
    ],
    themeId: "forgiveness",
  },
  "imamat 5-6": {
    reference: "Imamat 5:6",
    text: "Lalu haruslah ia, sebagai korban penghapus dosa karena kesalahan itu, membawa seekor domba betina dari kambing domba, atau seekor domba betina, kepada imam; demikian imam itu mengadakan pendamaian baginya karena kesalahan itu.",
    title: "Kesalahan, restitusi, dan api yang tetap menyala",
    hook: "Allah peduli bukan hanya hati, melainkan juga ganti rugi kepada yang dirugikan.",
    focus:
      "Imamat 5–6 meliputi korban karena sumpah palsu, najis, atau lupa; korban penebus salah dengan restitusi plus sepertiga. Api korban di mezbah tidak boleh padam—pelayanan imam terus menerus.",
    angle:
      "Pendamaian dengan Allah dan keadilan kepada sesama tidak bisa dipisah. Imamat mengajarkan: akui, bayar kembali, baru tenang. Api yang tidak padam mengingatkan bahwa ibadah dan pendamaian bukan sekali-sekali, melainkan kehidupan yang terus dijaga.",
    application:
      "Langkah hari ini: jika kamu berutang—secara literal atau moral—kepada seseorang, ambil langkah restitusi: minta maaf, kembalikan, atau ganti rugi. Jangan hanya “beres dengan Tuhan” tanpa beres dengan orang.",
    prayer:
      "Allah adil, bantu aku mengakui kesalahan dan memperbaikinya. Jangan biarkan api ibadahku padam karena dosa yang diabaikan. Amin.",
    questions: [
      "Kepada siapa kamu perlu restitusi—bukan hanya pengakuan?",
      "Bagaimana Imamat 5–6 menghubungkan pendamaian dengan Allah dan keadilan kepada sesama?",
      "Apa yang bisa membuat “api” imanmu padam, dan bagaimana menyalakannya lagi?",
    ],
    themeId: "obedience",
  },
  "imamat 7": {
    reference: "Imamat 7:37",
    text: "Itulah undang-undang tentang korban bakaran, korban sajian, korban penghapus dosa, korban penebus salah, korban pentahbisan dan korban keselamatan,",
    title: "Berbagai korban, satu Allah",
    hook: "Setiap jenis korban mengajarkan satu sisi hubungan dengan Tuhan—syukur, pendamaian, persekutuan.",
    focus:
      "Imamat 7 melengkapi aturan korban: lemak tidak dimakan, darah tidak diminum, bagian imam, korban keselamatan untuk syukur. Musa merangkum undang-undang korban yang Tuhan berikan di Sinai.",
    angle:
      "Ritual yang tampak repetitif sebenarnya membentuk irama hidup beribadah: ada waktu untuk pengakuan, syukur, dan perjamuan dengan Allah. Imamat 7 mengingatkan bahwa iman Israel utuh—makan, korban, dan kekudusan saling terkait.",
    application:
      "Langkah hari ini: identifikasi “jenis korban” hatimu sekarang—syukur, pengakuan, atau persekutuan. Respons dengan doa yang sesuai, bukan doa generik.",
    prayer:
      "Tuhan, terima syukurku, pendamaianku, dan kerinduanku bersekutu dengan-Mu. Ajar aku ibadah yang utuh. Amin.",
    questions: [
      "Apakah hatimu lebih dekat ke syukur, pengakuan, atau kerinduan persekutuan hari ini?",
      "Bagaimana Imamat 7 menantang ibadah yang hanya satu dimensi?",
      "Satu respons ibadah apa yang paling jujur untuk kondisimu?",
    ],
    themeId: "faith",
  },
  "imamat 8": {
    reference: "Imamat 8:36",
    text: "Lalu Harun dan anak-anaknya melakukan segala sesuatu yang difirmankan TUHAN dengan perantaraan Musa.",
    title: "Harun diurapi, tugas dimulai",
    hook: "Pelayanan di hadirat Allah dimulai dengan pengurapan dan ketaatan pada firman.",
    focus:
      "Musa memimpin upacara pengurapan Harun dan anak-anaknya: pakaian, minyak, korban panggilan, penghapus dosa. Mereka makan di pintu kemah. Segala sesuatu dilakukan seperti difirmankan TUHAN.",
    angle:
      "Imamat 8 menunjukkan bahwa pelayanan imam tidak sembarang—disediakan, diurapi, disucikan. Ketaatan “seperti difirmankan” adalah standar. Kita melihat bahwa mendekati Tuhan yang kudus butuh persiapan yang Tuhan sendiri tentukan.",
    application:
      "Langkah hari ini: sebelum melayani atau memimpin (meski kecil), luangkan waktu persiapan rohani—doa singkat, cek motivasi, pastikan ketaatan pada firman, bukan ego.",
    prayer:
      "Tuhan, urapi hidupku untuk pelayanan. Ajar aku melakukan segala sesuatu seperti firman-Mu, bukan menurut kemauanku. Amin.",
    questions: [
      "Apakah kamu melayani dengan persiapan rohani atau “langsung saja”?",
      "Bagaimana Imamat 8 menantang pelayanan yang didorong ego?",
      "Motivasi apa yang perlu kamu serahkan sebelum melayani?",
    ],
    themeId: "calling",
  },
  "imamat 9-10": {
    reference: "Imamat 10:3",
    text: "Lalu berkatalah Musa kepada Harun: »Inilah yang difirmankan TUHAN: Di hadapan-Ku haruslah kaudapat kemuliaan; Aku akan Kudapat kemuliaan di tengah seluruh umat.« Kemudian Harun berdiam diri.",
    title: "Nadab dan Abihu: kudus atau sembarangan",
    hook: "Kedekatan dengan Allah bukan lisensi untuk sembarangan—kekudusan-Nya serius.",
    focus:
      "Harun memimpin korban pertama; kemuliaan Tuhan muncul. Nadab dan Abihu membawa api asing; api dari TUHAN memakan mereka. Musa menegur; Harun berdiam diri dalam dukacita.",
    angle:
      "Imamat 10:3 adalah teguran keras: Tuhan akan Kudapat kemuliaan. Ibadah “yang kreatif” tanpa ketaatan bukan penerapan iman—itu penghinaan. Harun berdiam diri: kadang respons benar adalah henti, merenung, dan menerima kekudusan Allah.",
    application:
      "Langkah hari ini: evaluasi satu kebiasaan ibadah atau pelayanan—apakah “api asing” (trend, ego, shortcut) atau api yang Tuhan tentukan? Berhenti sejenak jika perlu, dan kembalilah pada firman.",
    prayer:
      "TUHAN kudus, ampuni ibadah sembaranganku. Ajar aku berdiam diri saat perlu, dan hormati kemuliaan-Mu. Amin.",
    questions: [
      "“Api asing” apa yang mungkin kamu bawa ke ibadah atau pelayanan?",
      "Bagaimana Imamat 10 menantang kreativitas tanpa ketaatan?",
      "Kapan “berdiam diri” seperti Harun adalah respons yang benar?",
    ],
    themeId: "obedience",
  },
  "imamat 11-12": {
    reference: "Imamat 11:44",
    text: "Sebab Aku ini, TUHAN, Allahmu; oleh sebab itu haruslah kamu menguduskan dirimu dan haruslah kamu kudus, sebab Aku kudus. Janganlah kamu menajiskan dirimu dengan binatang melata yang bergerak di bumi.",
    title: "Kudus, sebab Aku kudus",
    hook: "Kekudusan bukan daftar random—itu menyerupai karakter Allah dalam kehidupan sehari-hari.",
    focus:
      "Allah membedakan hewan tahu dan najis; aturan tentang kelahiran dan nifas. Puncaknya: haruslah kamu kudus, sebab Aku kudus. Bahkan makan dan tubuh diajak refleksi kekudusan.",
    angle:
      "Imamat 11:44 mengikat kekudusan dengan identitas Allah—bukan legalisme kosong, melainkan “seperti Bapa”. Makan, kebersihan, dan ritme hidup membentuk umat yang berbeda. Kudus berarti dipisahkan untuk Tuhan, bukan hanya “baik menurut budaya”.",
    application:
      "Langkah hari ini: pilih satu area “kebiasaan tubuh” (makan, media, tidur) dan tanyakan: “Apakah ini membentuk kekudusan atau menajiskan?” Lakukan satu penyesuaian kecil.",
    prayer:
      "TUHAN kudus, bentuk hidupku supaya menyerupai-Mu. Pisahkan aku untuk-Mu dalam hal-hal kecil sehari-hari. Amin.",
    questions: [
      "Kebiasaan sehari-hari mana yang paling sulit kamu lihat sebagai soal kekudusan?",
      "Bagaimana “sebab Aku kudus” mengubah motivasi kekudusanmu?",
      "Satu perubahan kecil apa untuk hidup lebih “dipisahkan” untuk Tuhan?",
    ],
    themeId: "obedience",
  },
  "imamat 13": {
    reference: "Imamat 13:45",
    text: "Orang yang timbul penyakit kusta pada kulitnya, haruslah memakai pakaian yang koyak-koyak, rambutnya haruslah dijuntai, ia harus menutupi mukanya sambil berseru: »Najis! Najis!«",
    title: "Yang terpisah karena penyakit",
    hook: "Imamat peduli pada yang terisolasi—Allah memberi aturan agar komunitas tetap aman sekaligus manusiawi.",
    focus:
      "Aturan panjang tentang kusta dan bercak kulit: imam memeriksa, isolasi sementara, pemeriksaan ulang. Yang najis harus tinggal di luar perkemahan dan memberi tahu orang.",
    angle:
      "Imamat 13 terasa keras, tetapi di zamannya melindungi komunitas dan memberi jalan kembali (Imamat 14). Kita belajar: dosa dan penderitaan sering mengisolasi. Allah tidak cuek—Ia atur proses agar ada harapan pemulihan, bukan stigma selamanya.",
    application:
      "Langkah hari ini: pikirkan seseorang yang “di luar perkemahan” karena malu, sakit, atau dosa. Dekati dengan hati-hati—doakan, kirim pesan, atau bantu proses pemulihan tanpa menghakimi.",
    prayer:
      "Tuhan, lihat yang terisolasi. Pakai aku untuk proses pemulihan, bukan untuk stigma. Amin.",
    questions: [
      "Siapa yang perlu kamu dekati yang sedang “di luar perkemahan”?",
      "Bagaimana Imamat 13–14 bersama-sama mengajarkan isolasi dan harapan?",
      "Apakah komunitasmu lebih cepat menghakimi atau memulihkan?",
    ],
    themeId: "forgiveness",
  },
  "imamat 14": {
    reference: "Imamat 14:8",
    text: "Orang yang harus dibersihkan itu haruslah mencuci pakaiannya, mencukur seluruh rambutnya, membasuh dirinya dengan air, maka dengan demikian ia menjadi tahir; sesudah itu ia boleh masuk perkemahan, tetapi harus tinggal di luar kemahnya tujuh hari lagi.",
    title: "Jalan kembali setelah najis",
    hook: "Allah sediakan ritual pemulihan—kembali ke komunitas bukan mustahil.",
    focus:
      "Prosedur membersihkan yang kusta: burung, kayu cedar, kain merah, hisop, darah, air. Cuci, cukur, basuh; tunggu tujuh hari; korban penghapus dosa dan korban bakaran. Yang najis bisa kembali.",
    angle:
      "Imamat 14 adalah Injil dalam bayangan: ada jalan kembali. Pemulihan butuh waktu, langkah, dan korban—tetapi tujuannya reintegrasi, bukan pengasingan selamanya. Tuhan peduli agar yang terpisah bisa masuk lagi.",
    application:
      "Langkah hari ini: jika kamu merasa “najis” atau jauh dari komunitas iman, jangan menyerah. Ambil satu langkah kembali—hubungi pemimpin, hadir ibadah, atau minta doa—percaya ada jalan pemulihan.",
    prayer:
      "Tuhan pemulih, bawa aku kembali. Beri langkah-langkah ke tahir, dan terima aku dalam komunitas-Mu. Amin.",
    questions: [
      "Apakah kamu perlu “jalan pemulihan” ke komunitas iman?",
      "Bagaimana Imamat 14 menantang stigma permanen atas masa lalu?",
      "Siapa yang bisa kamu bantu proses “masuk kembali”?",
    ],
    themeId: "forgiveness",
  },
  "imamat 15-16": {
    reference: "Imamat 16:30",
    text: "Sebab pada hari ini akan diadakan pendamaian bagimu untuk mentahirkan kamu; dari segala dosa kamu akan dibersihkan di hadapan TUHAN.",
    title: "Hari Pendamaian",
    hook: "Sekali setahun, seluruh umat diingatkan: dosa itu nyata, tetapi Allah sediakan pendamaian total.",
    focus:
      "Imamat 15 tentang najis tubuh; Imamat 16 tentang Yom Kippur: imam besar masuk Bait Kekudusan sekali setahun, korban untuk dirinya dan umat, kambing hiburan dilepaskan. Pendamaian untuk mentahirkan dari segala dosa.",
    angle:
      "Imamat 16:30 adalah puncak sistem korban: satu hari untuk “segala dosa”. Umat menunggu di luar sementara imam besar masuk—bayangan Kristus yang masuk sekali untuk selamanya. Pendamaian bukan tambal sulam; Allah ingin umat-Nya tahir di hadapan-Nya.",
    application:
      "Langkah hari ini: luangkan waktu untuk “Hari Pendamaian” pribadi—akui dosa secara spesifik, terima pengampunan, lalu lepaskan beban yang sudah Tuhan angkat.",
    prayer:
      "Tuhan, pada hari ini adakan pendamaian bagiku. Bersihkan aku dari segala dosa, dan biar aku hidup tahir di hadapan-Mu. Amin.",
    questions: [
      "Apakah kamu hidup dengan beban dosa yang sebenarnya sudah bisa diserahkan?",
      "Bagaimana Imamat 16 mengarahkan pandanganmu kepada salib Kristus?",
      "Dosa apa yang perlu kamu akui spesifik hari ini?",
    ],
    themeId: "forgiveness",
  },
  "imamat 17-18": {
    reference: "Imamat 18:4",
    text: "Haruslah kamu lakukan hukum-hukum-Ku dan tetap mengikuti peraturan-peraturan-Ku; dengan demikian kamu akan hidup di negeri itu.",
    title: "Darah suci, tubuh suci",
    hook: "Allah memanggil umat-Nya hidup berbeda—bukan meniru praktik bangsa-bangsa sekitar.",
    focus:
      "Imamat 17 melarang makan darah; korban hanya di pintu kemah. Imamat 18 melarang praktik seksual yang dilakukan Mesir dan Kanaan—incest, perzinahan, dan lainnya. Hidup di negeri itu dengan cara Tuhan.",
    angle:
      "Kekudusan Israel mencakup tubuh dan darah—hidup sebagai umat perjanjian, bukan meniru budaya yang merusak. Imamat 18:4 mengikat ketaatan dengan kehidupan: kamu akan hidup. Moralitas bukan beban random; itu perlindungan dan identitas.",
    application:
      "Langkah hari ini: evaluasi satu area seksualitas, batas, atau media yang terpengaruh budaya sekitar. Pilih ketaatan pada firman sebagai bentuk “hidup” sejati, bukan sekadar menghindari hukum.",
    prayer:
      "Tuhan, pisahkan aku dari praktik yang merusak. Ajar aku hidup di negeri-Mu dengan cara-Mu, dan berikan kehidupan yang sejati. Amin.",
    questions: [
      "Praktik budaya mana yang paling menggoda umat Tuhan hari ini?",
      "Bagaimana Imamat 17–18 menghubungkan ketaatan dengan “hidup”?",
      "Satu batas apa yang perlu kamu tegakkan demi kekudusan?",
    ],
    themeId: "obedience",
  },
  "imamat 19-20": {
    reference: "Imamat 19:18",
    text: "Janganlah engkau menuntut balas, janganlah menaruh dendam terhadap orang-orang sebangsamu, melainkan haruslah engkau mengasihi sesamamu manusia seperti dirimu sendiri; Akulah TUHAN.",
    title: "Kudus dalam kehidupan bersama",
    hook: "Imamat 19 adalah etika surga di tengah kehidupan desa—panen, gaji, tetangga, dan asing.",
    focus:
      "Allah memerintahkan: hormati ibu-bapa, tinggalkan tepi ladang untuk miskin, jangan curang, jangan fitnah, kasihi sesama seperti dirimu. Imamat 20 menegaskan hukuman untuk praktik keji. Akulah TUHAN—motivasi kekudusan.",
    angle:
      "Imamat 19:18 adalah inti: kasihi sesamamu. Kekudusan bukan hanya di kemah suci, melainkan di gaji, panen, dan percakapan. Tuhan peduli bagaimana umat-Nya memperlakukan tetangga, pekerja, dan orang asing.",
    application:
      "Langkah hari ini: praktikkan Imamat 19:18 secara konkret—tolak dendam, lakukan kebaikan pada “sesama” yang sulit, atau bantu yang miskin dengan sengaja.",
    prayer:
      "TUHAN, ajar aku mengasihi sesama seperti diriku. Kuduskan caramu memperlakukan tetangga, pekerja, dan yang rentan. Amin.",
    questions: [
      "Siapa “sesamamu” yang paling sulit kamu kasihi?",
      "Praktik Imamat 19 mana yang paling relevan untuk hidupmu?",
      "Satu tindakan kasih konkret apa hari ini?",
    ],
    themeId: "family",
  },
  "imamat 21-22": {
    reference: "Imamat 21:6",
    text: "Mereka harus kudus bagi Allahnya dan janganlah menodai nama Allahnya, sebab merekalah yang mempersembahkan korban api-apian TUHAN, santapan Allahnya; oleh sebab itu haruslah mereka kudus.",
    title: "Imam dan korban yang layak",
    hook: "Yang melayani di hadirat Allah dipanggil ke kudus yang lebih dalam—bukan kemunafikan, melainkan penghormatan.",
    focus:
      "Aturan untuk imam: tidak mencemari diri dengan mayat, kawin dengan benar, cacat tubuh tertentu. Imamat 22 tentang korban yang cacat—hanya yang layak dipersembahkan. Santapan Allah harus dari yang terbaik.",
    angle:
      "Imamat 21–22 menegaskan: pelayanan dan persembahan layak Tuhan yang kudus. Bukan perfeksionisme manusia, melainkan penghormatan—jangan menodai nama Allah dengan pelayanan setengah hati atau korban cacat.",
    application:
      "Langkah hari ini: jika kamu melayani (di gereja, kelompok, keluarga), persembahkan yang terbaik—waktu, persiapan, hati—bukan sisa-sisa yang lelah.",
    prayer:
      "Tuhan, jangan biarkan aku menodai nama-Mu dengan pelayanan setengah hati. Kuduskan persembahanku. Amin.",
    questions: [
      "Apakah kamu memberi Tuhan “korban cacat”—sisa waktu, sisa perhatian?",
      "Bagaimana Imamat 21–22 menantang pelayanan yang minimal?",
      "Satu perbaikan apa dalam pelayanan atau persembahanmu?",
    ],
    themeId: "calling",
  },
  "imamat 23-24": {
    reference: "Imamat 23:22",
    text: "Apabila kamu menuai hasil tanahmu, janganlah habiskan semuanya apabila kamu menuai, dan janganlah kamu pungut sisanya dari hasil tanahmu; haruslah kaubiarkan itu bagi orang miskin dan bagi orang asing; Akulah TUHAN, Allahmu.",
    title: "Pesta, Sabat, dan tepi ladang",
    hook: "Kalender Israel penuh ritme—istirahat, ingat, syukur, dan kepedulian pada yang lemah.",
    focus:
      "Imamat 23 merinci Paskah, Hari Raya Roti Tidak Beragi, Pentakosta, Trompet, Hari Raya Pendamaian, Pondok Daun. Imamat 24: roti santapan, minyak kandil, hukuman bagi penghujat. Tepi ladang ditinggal untuk miskin.",
    angle:
      "Imamat 23:22 di tengah daftar pesta mengingatkan: kekudusan juga sosial. Umat yang merayakan pembebasan dan panen tidak boleh lupa miskin dan asing. Akulah TUHAN—identitas Allah memotivasi kemurahan.",
    application:
      "Langkah hari ini: “tinggalkan tepi ladang”—berikan sesuatu untuk yang miskin atau asing: uang, makanan, atau waktu. Hubungkan syukur dengan kemurahan.",
    prayer:
      "Allah pesta dan kemurahan, ajar aku merayakan dengan ingat pada yang lemah. Biar syukurku mengalir ke tindakan. Amin.",
    questions: [
      "Apakah ritme syukurmu disertai kepedulian pada miskin?",
      "Pesta mana dalam Imamat 23 paling menggugah imanmu?",
      "Satu “tepi ladang” apa yang bisa kamu tinggalkan minggu ini?",
    ],
    themeId: "provision",
  },
  "imamat 25": {
    reference: "Imamat 25:23",
    text: "Janganlah tanah dijual keluar untuk selama-lamanya, sebab tanah itu milik-Ku; kamu datang sebagai orang asing dan tinggal di sini.",
    title: "Tahun Sabat dan Yovel",
    hook: "Allah pemilik tanah—umat hanya menumpang, dan harus belajar melepaskan.",
    focus:
      "Imamat 25 mengatur tahun Sabat tanah (istirahat), Yovel (pembebasan hamba, pengembalian tanah), harga jual tanah menurut tahun Yovel. Tanah milik TUHAN; Israel orang asing di bumi-Nya.",
    angle:
      "Imamat 25:23 mengubah ekonomi: tidak ada akumulasi tanah selamanya, ada pembebasan berkala. Tuhan pemilik; manusia penjaga. Yovel adalah bayangan pembebasan menyeluruh—Allah peduli agar miskin tidak terjebak selamanya.",
    application:
      "Langkah hari ini: renungkan “milik siapa” harta, rumah, atau rencanamu. Lepaskan genggaman dengan doa: “Tanah ini milik-Mu.” Berikan atau bantu dengan perspektif penjaga, bukan pemilik absolut.",
    prayer:
      "Tuhan pemilik tanah, ajar aku hidup sebagai orang asing yang setia. Bebaskan aku dari akumulasi, dan pakai hartaku untuk keadilan-Mu. Amin.",
    questions: [
      "Apakah kamu hidup seperti “pemilik absolut” atau penjaga yang setia?",
      "Bagaimana Imamat 25 menantang sistem ekonomi yang tidak adil?",
      "Satu langkah “melepaskan” apa terkait harta atau rencana?",
    ],
    themeId: "promise",
  },
  "imamat 26": {
    reference: "Imamat 26:12",
    text: "Aku akan berjalan-jalan di tengah-tengah kamu dan Aku akan menjadi Allahmu, dan kamu akan menjadi umat-Ku.",
    title: "Berkat taat, peringatan murtad",
    hook: "Allah menawarkan kedekatan—tetapi peringatan keras jika umat menolak.",
    focus:
      "Imamat 26: berkat jika taat (hujan, damai, kehadiran); kutuk jika memberontak (penyakit, pengusiran). Puncak berkat: Aku akan berjalan di tengah kamu. Meski umat jatuh, Tuhan tidak membatalkan perjanjian selamanya.",
    angle:
      "Imamat 26:12 adalah janji persekutuan: berjalan bersama. Tuhan tidak hanya memberi aturan—Ia ingin dekat. Peringatan kutuk bukan kekejaman; itu perlindungan agar umat tidak hancur oleh pemberontakan. Kasih setia tetap ada meski disiplin.",
    application:
      "Langkah hari ini: baca Imamat 26:12 sebagai undangan. Jawab: “Ya, Tuhan, jadilah Allahku, dan aku umat-Mu.” Cek satu area pemberontakan yang perlu diserahkan.",
    prayer:
      "Allahku, berjalanlah di tengah hidupku. Ajar aku taat supaya kedekatan ini terus hidup, bukan hanya janji di kertas. Amin.",
    questions: [
      "Apakah kamu lebih sering hidup di “berkat” atau “peringatan” Imamat 26?",
      "Bagaimana janji “berjalan di tengah” menggugah hatimu?",
      "Satu area pemberontakan apa yang perlu kamu serahkan?",
    ],
    themeId: "presence",
  },
  "imamat 27": {
    reference: "Imamat 27:34",
    text: "Itulah perintah-perintah yang diberikan TUHAN kepada Musa di gunung Sinai untuk orang Israel.",
    title: "Nazar dan penutup Imamat",
    hook: "Imamat berakhir dengan janji sukarela—umat bisa mengikat diri lebih dekat kepada Tuhan.",
    focus:
      "Imamat 27 tentang nazar: manusia, hewan, rumah yang didedicated kepada TUHAN; nilai tebusan. Buku ditutup: perintah-perintah yang diberikan TUHAN kepada Musa di Sinai untuk Israel.",
    angle:
      "Setelah banyak aturan, Imamat 27 membuka ruang sukarela: nazar. Ketaatan wajib dan kemauan ekstra berjalan bersama. Penutup buku mengingatkan: semua ini dari TUHAN di Sinai—bukan tradisi manusia, melainkan firman yang membentuk umat.",
    application:
      "Langkah hari ini: pertimbangkan satu “nazar” rohani sukarela—bukan legalisme, melainkan komitmen ekstra: puasa, pelayanan, atau pemberian—sebagai respons kasih, bukan utang.",
    prayer:
      "Tuhan Sinai, terima nazar sukarelaku. Bentuk aku lewat firman-Mu, dan biar Imamat mengajarku hidup dekat dan kudus. Amin.",
    questions: [
      "Apakah imanmu lebih banyak kewajiban atau respons sukarela?",
      "Nazar sukarela apa yang ingin kamu persembahkan kepada Tuhan?",
      "Pelajaran utama apa dari seluruh Imamat untuk hidupmu?",
    ],
    themeId: "faith",
  },
};

/** Ringkas renungan resmi jadwal dari seed kurasi (hook + makna). */
export function getScheduleDevotionalSummary(
  passage: string | null | undefined,
): string {
  const seed = getReadingDevotionalSeed(passage);
  if (!seed) return "";

  const parts = [seed.hook.trim(), seed.angle.trim()].filter(Boolean);
  return parts.join("\n\n");
}

/** Normalisasi ajakan hidup — hilangkan prefix formulaik saat ditampilkan. */
export function polishDevotionalApplication(text: string): string {
  return text
    .replace(/^Langkah hari ini:\s*/i, "")
    .replace(/^Praktis:\s*/i, "")
    .trim();
}

export function getReadingDevotionalSeed(
  passage: string | null | undefined,
): ReadingDevotionalSeed | null {
  if (!passage || passage === "Belum dijadwalkan") return null;
  const key = normalizePassageKey(passage);
  return READING_SEEDS[key] ?? null;
}

export function getCuratedReadingKeyVerse(
  passage: string | null | undefined,
): DailyVerse | null {
  const seed = getReadingDevotionalSeed(passage);
  if (!seed) return null;
  return { reference: seed.reference, text: seed.text };
}

/** Alias stabil untuk beranda / kutipan bacaan. */
export function getReadingKeyVerse(
  passage: string | null | undefined,
): DailyVerse | null {
  return getCuratedReadingKeyVerse(passage);
}
