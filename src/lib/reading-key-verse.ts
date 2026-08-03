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
};

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
