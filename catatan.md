# Audit portfolio — code, UI/UX, accessibility, performance

## Hasil perbaikan setelah audit

Implementasi telah diperbaiki berdasarkan persetujuan user; bagian audit di bawah merupakan baseline historis, bukan daftar bug yang seluruhnya masih aktif. Belum commit/push/deploy.

- F01-F08: menu media-preference cleanup, visibility kontrol, nama reduced-motion, scroll history (termasuk halaman panjang → pendek), footer inert, lokalisasi UI/title, heading hierarchy, serta runner browser otomatis sudah diperbaiki dan diuji.
- F09: title/description dan OG dasar unik per HTML. Canonical, OG URL/gambar absolut dan prerender tetap menunggu domain/deployment dan kebutuhan final.
- F10: WebP 812px 36.946 byte, 1624px 95.092 byte dengan PNG asli sebagai fallback. Browser mobile tinggi memilih varian besar untuk mempertahankan crop-cover; bukan memakai gambar kecil secara membabi buta.
- F11: footer dan page-motion menjadi dynamic chunks; main 282,48 kB / gzip 89,46 kB, motion 122,19 kB / gzip 48,06 kB, footer 10,58 kB / gzip 4,80 kB. Ini pemisahan payload, bukan bukti pengurangan total transfer atau LCP; dynamic imports masih diminta setelah mount. Halaman kecil tetap eager agar tidak menambah waterfall route tanpa bukti manfaat.
- F12-F16: kontrol pause marquee + offscreen/visibility suspend, idle canvas, cache grain pattern, fixed timestep, fallback carousel debounce, dan routing SPA footer selesai. Canvas mask ditunda sampai mendekati viewport.
- F17-F18: footer Contact ganda dihapus; footer mobile 460px, metadata diperbesar, label lebih terang, CTA hero berlabel. Komposisi monokrom tetap.
- F19: status credential dihitung dari expiry month yang diberikan, bulan terakhir inklusif UTC. Judul project tidak lagi menautkan daftar repository seolah URL project; daftar GitHub tetap tersedia dengan label jujur. URL project spesifik/keaslian credential belum terverifikasi.
- F20: main diformat dan lifecycle dibagi ke page-motion; layout canvas dideduplikasi. Reformat seluruh CSS lama dan migrasi JS/checkJs bukan bagian yang dinyatakan selesai.

Verifikasi akhir: npm test exit 0: 18 unit test, 10 regression scenario masing-masing pada dev/production, dan suite 5 halaman pada 1440/390/320. Runner membangun production dan mengelola server sendiri. Tes regresi mencakup media preference, pause, footer SPA, judul bahasa, inert/focus, static name, malformed hash dan history panjang/pendek. npm run build melalui runner lulus; warning use-client/sourcemap lama masih ada. git diff --check lulus.

Axe 4.10.3 dijalankan ulang pada 5 halaman mobile reduced motion: tidak ada violation pada konfigurasi yang diuji. Layout production dicek tambahan 1440/768/390/320 tanpa overflow dokumen. Screenshot mobile reduced-motion hero menunjukkan nama lengkap fit tanpa overlap. Footer Contact sudah tunggal. Canvas 390x460 menghasilkan 9.748 piksel terang setelah masuk viewport. Ini bukan sertifikasi aksesibilitas/performa atau validasi perangkat asli.

## Status dan cakupan

Audit read-only terhadap implementasi; tidak ada source aplikasi yang diperbaiki, commit, push, atau deploy. File laporan ini dibuat sebagai deliverable. Baseline Git: main, PROGRESS.md sudah untracked sebelum audit.

Skill: requesting-code-review, web-design-guidelines (guideline terbaru diambil lewat curl setelah extractor 403), local-webapp-qa, vercel-react-best-practices; dua reviewer independen memeriksa lifecycle animasi/canvas serta arsitektur/routing.

Source yang ditinjau: semua entry HTML, seluruh src/pages, main/Header/language/footer/motion/carousel, komponen canvas dan demo, konfigurasi package/Vite/TypeScript, styles, helper, dokumentasi dan tests. Runtime: Chrome lokal via Playwright karena layanan browser Camofox tidak aktif. Screenshot 5 halaman pada lebar 1440/768/390/320, tinggi 900; tambahan menu 320x568 dan edge cases production. Screenshot bukan pengukuran performa perangkat fisik.

## Hasil verifikasi

- npm test: 4 lulus, 0 gagal. Hanya helper canvas, bukan seluruh aplikasi.
- npm run build: lulus, dengan warning use-client dan sourcemap. Bukan build failure.
- npm audit --json: 0 vulnerability yang dilaporkan registry saat audit.
- node tests/react-browser.cjs: lulus di dev 5173 dan production preview 5174, masing-masing 1440/390/320.
- Audit tambahan: 5 halaman x 4 lebar tanpa horizontal overflow dokumen dan tanpa pageerror pada matriks reduced-motion tersebut.
- Axe 4.10.3 pada kelima halaman mobile reduced motion: heading-order ditemukan di Home, Skills, Certifications; About/Contact tidak menghasilkan violation pada konfigurasi itu. Ini bukan sertifikasi aksesibilitas penuh.
- Carousel mobile diuji sampai akhir: scrollLeft=1098, max=1098, indikator 04 / 04, Next disabled. Desktop 03 / 04 di akhir bukan bug karena dua kartu terlihat sekaligus.
- Canvas footer benar-benar menghasilkan gambar: 9.743 piksel terang pada canvas 390x560 setelah footer discroll terlihat. Screenshot full-page awal dapat menangkap canvas offscreen sebelum observer menggambar; jangan menyimpulkan footer rusak dari screenshot tersebut.

## Prioritas

P1: menghambat interaksi utama untuk kondisi tertentu. P2: bug UX/accessibility atau masalah efisiensi penting. P3: polish/maintainability/content follow-up. Tidak ditemukan P0 atau vulnerability kritis yang terkonfirmasi.

### F01 — P1 — Link menu hilang setelah perubahan reduced motion [runtime dev + production]
Lokasi: src/motion.js:127-130,150-153.
Reproduksi: motion aktif → buka menu → tutup → tunggu animasi selesai → aktifkan reduced motion → buka menu lagi.
Bukti: link pertama masih computed opacity=0 dan transform matrix(1,0,0,1,0,15), meski menu terbuka. Link tetap di DOM tetapi tidak terlihat.
Akar: tween yang dibuat dari callback event tidak dikembalikan oleh cleanup matchMedia; cabang reduced-motion tidak menormalkan style links.
Perbaikan: kelola lifecycle tween event melalui context atau referensi eksplisit, kill dan clear opacity/transform saat teardown, serta tetapkan state terlihat ketika motion dinonaktifkan. Tambahkan tes ganti preferensi ketika menu terbuka/tertutup.

### F02 — P2 — Tombol menu desktop tersembunyi tetapi masih tabbable [runtime]
Lokasi: style.css:2; src/Header.tsx:16.
Bukti: di atas beranda desktop tombol memiliki rect 0x0 karena transform scale(0), tetapi tabIndex=0 dan display=block.
Dampak: keyboard mencapai kontrol tanpa indikator visual; Enter masih dapat memicunya.
Perbaikan: sinkronkan visibility/inert/tabIndex dengan kondisi tampil, jangan hanya scale.

### F03 — P2 — Nama hero terpotong permanen pada reduced-motion mobile [runtime production + visual]
Lokasi: src/pages/Home.tsx:2; style.css:9,12.
Bukti: pada 390px, h1 berakhir di x=555.046875; parent transform=none. Hero overflow hidden. Karena gerak dimatikan, sisa nama tidak pernah masuk layar.
Batas: pemotongan marquee saat bergerak adalah desain yang diterima, bukan bug; yang bermasalah adalah fallback statis ini.
Perbaikan: khusus reduced motion, fit/wrap nama lengkap atau sediakan representasi statis yang terlihat.

### F04 — P2 — Back/Forward menghilangkan posisi scroll [runtime production]
Lokasi: src/main.tsx:23.
Reproduksi: scroll About ke 500 → buka Skills via menu → Back. Hasil scrollY=0.
Akar: effect memaksa scrollTo(top:0) pada semua location tanpa hash, termasuk POP.
Perbaikan: bedakan navigasi baru dari riwayat dan pulihkan posisi per location.key.

### F05 — P2 — Background footer tidak inert saat overlay menu terbuka [runtime]
Lokasi: src/Header.tsx:11-14; src/main.tsx:24.
Bukti: main.inert=true tetapi footerInert=false; pemanggilan focus() pada link footer sukses ketika menu terbuka.
Batas: jalur Tab normal yang diuji berputar dari tombol ke link terakhir dan bekerja. Ini kekurangan isolasi modal, bukan klaim Tab biasa selalu bocor.
Perbaikan: inert seluruh background termasuk footer, pertahankan tombol close di luar subtree inert. Pertimbangkan semantics/focus management dialog sesuai pola overlay yang dipilih.

### F06 — P2 — Judul tab dan sejumlah label tidak mengikuti bahasa [runtime + source]
Lokasi: src/main.tsx:23-24; src/Header.tsx:16; components/ui/halftone-wordmark-footer.tsx:190.
Bukti: mode EN menghasilkan html.lang=en tetapi title About tetap Tentang — Fahrur Anshori. Skip link tetap Lewati ke konten; menu label selalu Inggris; Back to top selalu Inggris.
Perbaikan: pusatkan teks UI dan metadata pada language provider, masukkan language ke dependency metadata. Label carousel sudah diterjemahkan; jangan memperbaiki bagian yang sudah benar.

### F07 — P2 — Hierarki heading melompat h1 ke h3 [axe + source]
Lokasi: src/pages/Home.tsx:9; src/pages/Skills.tsx:6; src/pages/Certifications.tsx:11.
Bukti: axe heading-order pada ketiga halaman; section-head hanya span, bukan heading.
Dampak: outline navigasi pembaca layar kurang terstruktur.
Perbaikan: jadikan judul section h2 dengan styling tetap, lalu item h3, atau sesuaikan heading item menurut struktur sebenarnya.

### F08 — P2 — Browser suite tidak masuk jalur npm test [source + execution]
Lokasi: package.json:10; tests/halftone-wordmark-footer.test.mjs:6-13; tests/react-browser.cjs:1.
Bukti: npm test menjalankan 4 helper tests saja. Browser script dijalankan manual, mengharuskan dua server dan menggunakan DOM evaluate click untuk beberapa interaksi. Cek bahasa hanya html.lang.
Dampak: hasil hijau tidak menjamin navigasi, fokus, konten terjemahan, atau lifecycle benar.
Perbaikan: script test:e2e dengan server lifecycle otomatis, klik nyata, assertion text/title, media preference transition, Back restoration, keyboard, touch, canvas idle/cleanup.

### F09 — P2 — Metadata awal kelima HTML identik dan minim [source]
Lokasi: index.html:1; about.html:1; skills.html:1; certifications.html:1; contact.html:1; src/main.tsx:23.
Bukti: title/description HTML awal sama, isi root kosong; hanya title diubah client-side. Tidak ada Open Graph/social image atau canonical.
Dampak: preview sosial dan pembaca tanpa JS tidak mendapat informasi halaman spesifik. Bukan bukti Google tidak bisa mengindeks React.
Perbaikan: metadata unik per shell; setelah domain final diketahui, canonical/OG absolut. Pertimbangkan prerender untuk portfolio statis, bukan migrasi framework tanpa kebutuhan.

### F10 — P2 — Hero PNG besar tanpa varian responsif [ukuran file + source]
Lokasi: src/pages/Home.tsx:2; public/fahrur-portrait.png.
Bukti: satu PNG 1.834.296 byte, sumber 1624x912, dipakai semua viewport tanpa srcset/picture. Width/height dan fetchPriority sudah benar.
Dampak: transfer gambar awal berpotensi dominan pada jaringan mobile; belum ada pengukuran LCP atau jaringan perangkat nyata.
Perbaikan: pertahankan original, hasilkan AVIF/WebP dan ukuran responsif dengan crop wajah tetap aman. Ukur kualitas dan LCP sebelum/sesudah.

### F11 — P2 — Animasi dan seluruh halaman masuk bundle awal [build + source]
Lokasi: src/main.tsx:4-15; vite.config.ts:6.
Bukti: build menghasilkan satu JS 412,18 kB (gzip 140,36 kB); semua route, GSAP/ScrollTrigger, dan canvas diimpor eager, termasuk pada direct Contact.
Dampak: visitor satu halaman membayar graph seluruh aplikasi. Ukuran ini bukan bukti otomatis situs lambat.
Perbaikan: prioritaskan defer motion home/canvas offscreen; ukur penghematan sebelum lazy-split halaman yang kecil agar tidak menambah waterfall tanpa manfaat.

### F12 — P2 — Marquee tak punya pause dan terus ditick offscreen [source]
Lokasi: src/motion.js:87-107; src/pages/Home.tsx:2.
Bukti: ticker GSAP hidup selama halaman home mounted, tanpa intersection gate; loop teks otomatis tidak punya pause/stop. Reduced-motion global tersedia tetapi bukan kontrol pause di halaman.
Dampak: potensi isu WCAG 2.2.2 dan kerja animasi tak perlu ketika hero tak terlihat. Tidak ada klaim FPS/CPU terukur.
Perbaikan: kontrol pause yang accessible serta suspend ticker ketika hero offscreen.

### F13 — P2 — Canvas tidak idle selama pointer diam di footer [source]
Lokasi: components/ui/halftone-wordmark-footer.tsx:134-165.
Bukti: awake tetap true selama interactive && px > -1e4, meskipun dots tidak bergerak. Tiap frame clear canvas, loop dots, arc/fill, serta createPattern grain.
Dampak: rendering berulang tanpa perubahan visual. Intersection dan visibility guards sudah ada dan perlu dipertahankan.
Perbaikan: tidur ketika settle, bangun via pointermove; cache pattern grain. Ukur trace dan frame cost untuk menetapkan dampak aktual.

### F14 — P2 — Physics canvas bergantung jumlah frame [source]
Lokasi: components/ui/halftone-wordmark-footer.tsx:40-48,142-148,164.
Bukti: damping .84 dan spring diterapkan per draw tanpa delta time, sementara ripple memakai waktu milidetik.
Dampak: tempo/feel pada 60 dan 120/144Hz bisa berbeda; belum dibandingkan pada hardware fisik.
Perbaikan: fixed timestep/accumulator atau normalisasi dt dengan clamp jeda panjang.

### F15 — P2 — Carousel manual scroll bergantung scrollend [risiko kompatibilitas]
Lokasi: src/carousel.js:20-29.
Bukti: target tombol disinkronkan dari scrollLeft hanya saat scrollend/resize, bukan pada scroll manual. Tidak ada fallback browser tanpa scrollend.
Dampak: browser yang tidak mengirim event tersebut dapat melompat ke target lama setelah swipe/trackpad.
Batas: Chrome yang diuji bekerja; ini bukan bug yang direproduksi pada Safari/Firefox lama atau perangkat touch nyata.
Perbaikan: feature detection/fallback end-scroll dan tes gesture di browser target tanpa merusak rapid clicks.

### F16 — P3 — Link footer memuat ulang aplikasi [runtime]
Lokasi: src/footer.tsx:14-16; components/ui/halftone-wordmark-footer.tsx:189.
Bukti: window marker hilang setelah klik About dari footer, sedangkan navigasi header mempertahankan marker pada browser suite.
Dampak: inkonsisten dengan SPA header; inisialisasi React/canvas diulang. Bukan klaim semua asset selalu didownload ulang karena cache browser tetap berlaku.
Perbaikan: renderer link internal memakai React Router Link, external tetap anchor; pertahankan komponen reusable lewat prop renderer jika diperlukan.

### F17 — P3 — Kontak memiliki dua penutup/footer berulang [visual + source]
Lokasi: src/pages/Contact.tsx:7-15; src/main.tsx:24; src/footer.tsx:12.
Bukti: nama, GitHub/LinkedIn dan copyright muncul di footer lokal Contact, lalu global footer. Screenshot mobile menunjukkan email/CTA berulang dan perbedaan gaya tipografi kedua blok.
Footer global berukuran 560px pada mobile; pada halaman Sertifikasi reduced motion main sekitar 715px sehingga dekorasi penutup mengambil porsi besar.
Perbaikan: satu footer global; pertahankan satu CTA kontak utama, rapikan ruang vertikal mobile tanpa membuang halftone yang sudah diterima.

### F18 — P3 — Metadata visual kecil, CTA hero kurang eksplisit [visual + source]
Lokasi: style.css:2,5; components/ui/halftone-wordmark-footer.tsx:59-63; src/pages/Home.tsx:2.
Bukti: beberapa label/date mobile 8px, body 13px; footer 10.5px dan label opacity .4. Hero hanya panah tanpa label terlihat untuk langkah selanjutnya.
Dampak: informasi sekunder sulit dipindai; hierarki lebih didominasi dekorasi. Axe tidak melaporkan contrast violation pada konfigurasi yang dijalankan; jangan menyebut semua teks gagal WCAG contrast.
Perbaikan: perbesar metadata penting dan target sentuh, pertahankan gaya monokrom, tambahkan label ringkas pada ajakan scroll bila sesuai arah desain.

### F19 — P3 — Tautan project tidak spesifik, status credential statis [source]
Lokasi: src/pages/Home.tsx:25; src/pages/Certifications.tsx:12-47.
Bukti: judul BNNK membuka daftar repo profil, bukan project tertentu. Status aktif/expired ditulis terpisah dari tanggal.
Dampak: bukti project sulit ditemukan; badge credential bisa usang ketika tanggal berlalu.
Perbaikan: minta URL project/demo yang benar bila tersedia; jangan mengarang repo. Simpan expiry sebagai data terstruktur atau jadwalkan review. Tanggal/keaslian credential belum diverifikasi ke issuer, dan tidak dituduh salah.

### F20 — P3 — Startup canvas berulang dan source sulit dirawat [source]
Lokasi: components/ui/halftone-wordmark-footer.tsx:90-130,174-179; style.css:2-12; src/main.tsx:20-27; tests/react-browser.cjs:1.
Bukti: layout canvas pada initial effect, initial ResizeObserver dan fonts.ready dapat mengulang mask/ImageData/grain sebelum footer terlihat. Banyak source/CSS/test dipadatkan ke baris sangat panjang; CSS menyimpan rule lama dan override berlapis. allowJs aktif tanpa checkJs pada tsconfig.json:13 sehingga motion/carousel tidak mendapat pemeriksaan tipe setara TSX.
Dampak: risiko startup work dan maintenance tinggi, bug breakpoint/lifecycle lebih sulit diaudit. Bukan bukti memory leak atau jank yang telah diukur.
Perbaikan: deduplikasi invalidasi layout dan lazy initialization saat mendekati viewport; rapikan format source terpisah dari perubahan perilaku, kurangi rule obsolete setelah coverage, tambah lint/checkJs atau migrasi JS secara bertahap.

## Penilaian visual

Arah monokrom dan editorial tetap layak dipertahankan. Foto/wajah terbaca, hierarki judul kuat, work rows bersih, dan layout tidak meluber pada matriks yang diuji. Tidak ada alasan audit untuk redesign total.

Yang perlu diperbaiki: fallback nama reduced motion, skala metadata, duplikasi footer Contact, proporsi footer mobile, kejelasan aksi hero. Whitespace luas bukan bug otomatis. Crop marquee ketika animasi berjalan dan crop halftone yang disengaja bukan bukti rusak. Tablet menampilkan desktop navigation dan hamburger bersamaan; pada screenshot 768px tidak ada overlap, tetapi fungsi ganda dan kepadatan dapat dipolish. Safe area dan contrast lokal hero perlu diperiksa pada perangkat asli, belum dinyatakan gagal.

## Urutan kerja yang disarankan

1. F01-F05: regresi menu, visibility/focus, fallback reduced motion, history restoration; tulis failing E2E dahulu.
2. F06-F09: bahasa, heading semantics, test runner, metadata.
3. F10-F16: aset gambar, lazy-loading terukur, pause/offscreen/idle animasi, physics, kompatibilitas carousel, link SPA footer.
4. F17-F20: polish visual dan maintainability; pertahankan desain yang sudah disetujui.

## Batas audit

Belum menjalankan Lighthouse/Core Web Vitals, profiling CPU/GPU/frame rate, Safari/Firefox, real-device touch/swipe, 200% zoom, screen reader manual, network throttling, deploy subdirectory/hosting nyata, dan verifikasi eksternal credential/repo. Tidak ada klaim lulus untuk area tersebut. Production yang diuji adalah Vite preview lokal, bukan hosting publik.

Bukti browser/screenshot dan probe disimpan sementara di C:/Users/hp/AppData/Local/hermes/cache/scratch/portfolio-audit/. Scratch dapat dibersihkan otomatis; laporan ini merupakan catatan permanen audit, screenshot bukan artifact permanen repository.
