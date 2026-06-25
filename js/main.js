/* =============================================================
   CloudVision — Sistem Deteksi Awan BMKG Juanda
   Main JavaScript
   -------------------------------------------------------------
   File ini mengatur:
   1. Sticky navbar & mobile menu
   2. Smooth scroll & scroll-reveal animations
   3. Drag & drop upload + preview
   4. Fungsi runDetection() — TEMPAT MENGHUBUNGKAN MODEL ANDA
   5. Render hasil klasifikasi (probabilitas per kelas)
   6. Form kontak (simulasi pengiriman)
   ============================================================= */


/* ---------- 1. Daftar kelas awan ----------
   Sesuaikan dengan kelas dari model Anda.
   Urutan ini akan digunakan untuk menampilkan probabilitas. */
const CLOUD_CLASSES = [
  { name: "Cumulus",       label: "Awan kapas — cuaca cerah" },
  { name: "Stratus",       label: "Lapisan kabut tinggi" },
  { name: "Cumulonimbus",  label: "Awan badai — bahaya untuk penerbangan" },
  { name: "Altocumulus",   label: "Awan menengah berpetak" },
  { name: "Nimbostratus",  label: "Awan hujan terus-menerus" },
  { name: "Cirrus",        label: "Awan tinggi tipis dari kristal es" },
  { name: "Stratocumulus", label: "Lapisan awan rendah bergumpal" },
  { name: "Altostratus",   label: "Lapisan awan menengah keabu-abuan" },
  { name: "Cirrostratus",  label: "Lapisan tipis tinggi, halo matahari" },
  { name: "Cirrocumulus",  label: "Awan tinggi kecil bergerombol" },
  { name: "Contrail", label: "Jejak kondensasi pesawat di atmosfer" },
];


/* ---------- 2. Navbar: sticky on scroll ---------- */
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  if (window.scrollY > 30) navbar.classList.add("scrolled");
  else navbar.classList.remove("scrolled");
});

/* ---------- 3. Mobile menu toggle ---------- */
const navToggle = document.getElementById("navToggle");
const navLinks = document.querySelector(".nav-links");
navToggle?.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});
document.querySelectorAll(".nav-links a").forEach((a) => {
  a.addEventListener("click", () => navLinks.classList.remove("open"));
});


/* ---------- 4. Scroll-reveal animation ---------- */
const revealEls = document.querySelectorAll(
  ".section-head, .feature-list li, .cloud-card, .t-step, .metric-card, .result-block, .contact-item, .contact-form, .image-card, .floating-card"
);
revealEls.forEach((el) => el.classList.add("reveal"));

const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        io.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
revealEls.forEach((el) => io.observe(el));

/* ---------- 5.1 jenis awan yg baru ---------- */
const clouds = {

  cirrus:{
    image:"images/cirrus.jpg",
    name:"Cirrus",
    layer:"Awan Tinggi",
    desc:"Awan tinggi yang tersusun dari kristal es dan sering menjadi indikator awal perubahan cuaca.",
    altitude:"6–12 km",
    shape:"Tipis dan berserat",
    color:"Putih keperakan",
    weather:"Pertanda perubahan cuaca"
  },

  cirrostratus:{
    image:"images/cirrostratus.jpg",
    name:"Cirrostratus",
    layer:"Awan Tinggi",
    desc:"Awan tinggi berbentuk lapisan tipis yang menutupi sebagian besar langit dan sering menjadi tanda perubahan cuaca.",
    altitude:"6–12 km",
    shape:"Lapisan tipis transparan",
    color:"Putih",
    weather:"Indikasi hujan atau cuaca berubah"
  },

  cirrocumulus:{
    image:"images/cirrocumulus.jpg",
    name:"Cirrocumulus",
    layer:"Awan Tinggi",
    desc:"Awan tinggi berupa gumpalan kecil yang tersusun rapat dan tampak seperti riak di langit.",
    altitude:"6–12 km",
    shape:"Gumpalan kecil berderet",
    color:"Putih",
    weather:"Cuaca stabil hingga perubahan cuaca"
  },

  altostratus:{
    image:"images/altostratus.jpg",
    name:"Altostratus",
    layer:"Awan Menengah",
    desc:"Awan menengah berbentuk lapisan luas yang sering menutupi sebagian besar langit.",
    altitude:"2–7 km",
    shape:"Lapisan luas dan merata",
    color:"Putih hingga abu-abu",
    weather:"Mendung dan hujan ringan"
  },

  altocumulus:{
    image:"images/altocumulus.jpg",
    name:"Altocumulus",
    layer:"Awan Menengah",
    desc:"Awan menengah yang tampak sebagai kumpulan gumpalan kecil dan dapat menjadi indikasi perubahan cuaca.",
    altitude:"2–7 km",
    shape:"Gumpalan kecil berkelompok",
    color:"Putih hingga keabu-abuan",
    weather:"Potensi badai petir"
  },

  stratus:{
    image:"images/stratus.jpg",
    name:"Stratus",
    layer:"Awan Rendah",
    desc:"Awan rendah berbentuk lapisan yang menutupi langit secara luas dan sering menimbulkan cuaca mendung.",
    altitude:"0–2 km",
    shape:"Datar dan menyebar",
    color:"Abu-abu",
    weather:"Gerimis dan mendung"
  },

  stratocumulus:{
    image:"images/stratocumulus.jpg",
    name:"Stratocumulus",
    layer:"Awan Rendah",
    desc:"Awan rendah yang terbentuk dari kumpulan gumpalan awan yang menyatu menjadi lapisan luas.",
    altitude:"0–2 km",
    shape:"Gumpalan bertumpuk",
    color:"Putih keabu-abuan",
    weather:"Umumnya cerah atau gerimis ringan"
  },

  nimbostratus:{
    image:"images/nimbostratus.jpg",
    name:"Nimbostratus",
    layer:"Awan Menengah",
    desc:"Awan tebal berwarna abu-abu gelap yang menghasilkan hujan berkepanjangan.",
    altitude:"2–8 km",
    shape:"Lapisan tebal menutupi langit",
    color:"Abu-abu gelap",
    weather:"Hujan terus-menerus"
  },

  cumulus:{
    image:"images/cumulus.jpg",
    name:"Cumulus",
    layer:"Awan Rendah",
    desc:"Awan yang umumnya muncul saat cuaca cerah dan menjadi salah satu jenis awan yang paling mudah dikenali.",
    altitude:"0,5–2 km",
    shape:"Menggumpal seperti kapas",
    color:"Putih cerah",
    weather:"Cuaca cerah"
  },

  cumulonimbus:{
    image:"images/cumulonimbus.jpg",
    name:"Cumulonimbus",
    layer:"Awan Vertikal",
    desc:"Awan badai dengan perkembangan vertikal yang sangat tinggi dan sering dikaitkan dengan cuaca ekstrem.",
    altitude:"0,5–16 km",
    shape:"Menara atau gunung",
    color:"Abu-abu gelap",
    weather:"Hujan lebat, petir, angin kencang"
  }

};

//   cirrus:{
//     image:"images/cirrus.jpg",
//     name:"Cirrus",
//     layer:"Awan Tinggi",
//     desc:"Awan tinggi yang tersusun dari kristal es dan sering menjadi indikator awal perubahan cuaca.

// Karakteristik:
// Tersusun dari kristal es
// Berwarna putih atau keperakan
// Berada pada ketinggian 6.000–12.000 meter
// Berbentuk tipis dan berserat
// Dapat menandakan perubahan cuaca dalam beberapa hari ke depan"
//   },

//   cirrostratus:{
//     image:"images/cirrostratus.jpg",
//     name:"Cirrostratus",
//     layer:"Awan Tinggi",
//     desc:"Awan tinggi berbentuk lapisan tipis yang menutupi sebagian besar langit dan sering menjadi tanda perubahan cuaca.

// Karakteristik:
// Terbentuk dari awan cirrus yang menyatu menjadi lembaran tipis
// Menutupi area langit yang sangat luas
// Berwarna putih dan tampak transparan
// Sulit dikenali karena bentuknya sangat tipis
// Sering menjadi indikasi datangnya hujan atau perubahan cuaca dalam waktu dekat"
//   },

//   cirrocumulus:{
//     image:"images/cirrocumulus.jpg",
//     name:"Cirrocumulus",
//     layer:"Awan Tinggi",
//     desc:"Awan tinggi yang tersusun dari kristal es dan tampak sebagai kumpulan gumpalan kecil yang berderet di langit.

// Karakteristik:
// Merupakan perpaduan karakteristik awan cirrus dan cumulus
// Tersusun dari kristal es
// Berbentuk gumpalan-gumpalan kecil yang tersusun rapat
// Sering terlihat seperti riak atau ombak yang terputus-putus
// Berwarna putih dan umumnya tidak menimbulkan bayangan
// Berada pada ketinggian tinggi di atmosfer"
//   },

//   altostratus:{
//     image:"images/altostratus.jpg",
//     name:"Altostratus",
//     layer:"Awan Menengah",
//     desc:"Awan menengah berbentuk lapisan luas yang sering menutupi sebagian besar langit dan dapat menjadi pertanda hujan.

// Karakteristik:
// Berbentuk lembaran atau lapisan awan yang tipis dan luas
// Berwarna putih hingga abu-abu
// Sinar Matahari masih dapat terlihat samar menembus awan
// Menutupi area langit yang cukup luas
// Umumnya berkaitan dengan hujan ringan atau cuaca mendung
// Berada pada ketinggian menengah di atmosfer"
//   },

//   altocumulus:{
//     image:"images/altocumulus.jpg",
//     name:"Altocumulus",
//     layer:"Awan Menengah",
//     desc:`
//     Awan menengah yang tampak sebagai kumpulan gumpalan kecil dan dapat menjadi indikasi perubahan cuaca.

// Karakteristik:
// Berbentuk gumpalan atau bola-bola kecil yang menyebar di langit
// Polanya sering terlihat teratur atau berderet
// Berada pada ketinggian menengah
// Dapat menjadi pertanda terbentuknya badai petir
// Berwarna putih hingga keabu-abuan dengan bagian yang tampak berbayang
//     `
//   },

//   stratus:{
//     image:"images/stratus.jpg",
//     name:"Stratus",
//     layer:"Awan Rendah",
//     desc:"Awan rendah berbentuk lapisan yang menutupi langit secara luas dan sering menimbulkan cuaca mendung.

// Karakteristik:
// Berbentuk datar dan menyebar seperti lembaran
// Menutupi sebagian besar atau seluruh langit
// Berwarna abu-abu hingga keabu-abuan
// Memberikan kondisi cuaca teduh dan mendung
// Dapat menghasilkan gerimis atau hujan ringan
// Berada pada ketinggian rendah di atmosfer"
//   },

//   stratocumulus:{
//     image:"images/stratocumulus.jpg",
//     name:"Stratocumulus",
//     layer:"Awan Rendah",
//     desc:"Awan rendah yang terbentuk dari kumpulan gumpalan awan yang menyatu menjadi lapisan luas di langit.

// Karakteristik:
// Terbentuk dari kumpulan awan cumulus yang menyatu
// Menyebar membentuk lapisan atau selimut awan yang bertumpuk
//  Berada pada ketinggian rendah
//  Berwarna putih hingga keabu-abuan
//  Menutupi sebagian besar langit
// Umumnya tidak menghasilkan hujan atau hanya gerimis ringan sesekali"
//   },

//   nimbostratus:{
//     image:"images/nimbostratus.jpg",
//     name:"Nimbostratus",
//     layer:"Awan Menengah",
//     desc:"Awan tebal berwarna abu-abu gelap yang menutupi langit secara luas dan menghasilkan hujan yang berlangsung lama.

// Karakteristik:
// Berbentuk lapisan tebal yang menutupi sebagian besar langit
// Berwarna abu-abu hingga abu-abu gelap
// Berada pada ketinggian sekitar 2–8 km
// Menghasilkan hujan atau gerimis yang terus-menerus
// Lebih tebal dan lebih gelap dibandingkan Altostratus"
//   },

//   cumulus:{
//     image:"images/cumulus.jpg",
//     name:"Cumulus",
//     layer:"Awan Rendah",
//     desc:"Awan yang umumnya muncul saat cuaca cerah dan menjadi salah satu jenis awan yang paling mudah dikenali.

// Karakteristik:
//  Menjadi indikator cuaca baik dan cerah
// Berada pada ketinggian rendah hingga menengah
// Berbentuk gundukan, bulat, atau bergelombang dengan tepi yang jelas
// Berwarna putih hingga keabu-abuan saat terkena sinar matahari
// Dapat tampak merah muda atau jingga saat matahari terbit maupun terbenam
// Memiliki dasar awan yang relatif datar dan puncak yang menggumpal seperti kapas"
//   },

//   cumulonimbus:{
//     image:"images/cumulonimbus.jpg",
//     name:"Cumulonimbus",
//     layer:"Awan Vertikal",
//     desc:"Awan badai dengan perkembangan vertikal yang sangat tinggi dan sering dikaitkan dengan cuaca ekstrem.

// Karakteristik:
// Bentuk menyerupai gunung atau menara
// Berwarna gelap hingga kelabu
// Puncak melebar seperti landasan atau payung
// Menghasilkan hujan lebat, petir, dan angin kencang"
//   }

// };

document.querySelectorAll(".cloud").forEach(cloud => {

  cloud.addEventListener("click", () => {

    const data = clouds[cloud.dataset.cloud];

    document.getElementById("cloud-image").src = data.image;
    document.getElementById("cloud-name").textContent = data.name;
    document.getElementById("cloud-layer").textContent = data.layer;
    document.getElementById("cloud-description").textContent = data.desc;

    document.getElementById("cloud-altitude").textContent = data.altitude;
    document.getElementById("cloud-shape").textContent = data.shape;
    document.getElementById("cloud-color").textContent = data.color;
    document.getElementById("cloud-weather").textContent = data.weather;
    
    document.getElementById("close-detail").addEventListener("click", () => {
    document.getElementById("cloud-detail").classList.add("hidden");
    currentCloud = null;
  });

    const panel = document.getElementById("cloud-detail");

    panel.classList.remove("hidden");

    panel.scrollIntoView({
      behavior:"smooth",
      block:"start"
    });

  });

});


// const clouds = {
//   cirrus: {
//     image: "images/cirrus.jpg",
//     name: "Cirrus",
//     layer: "Awan Tinggi",
//     desc: "Awan tipis seperti serat yang tersusun dari kristal es."
//   },

//   cirrostratus: {
//     image: "images/cirrostratus.jpg",
//     name: "Cirrostratus",
//     layer: "Awan Tinggi",
//     desc: "Lapisan awan tipis yang sering menimbulkan halo."
//   },

//   cirrocumulus: {
//     image: "images/cirrocumulus.jpg",
//     name: "Cirrocumulus",
//     layer: "Awan Tinggi",
//     desc: "Awan kecil-kecil menyerupai sisik ikan."
//   },

//   altostratus: {
//     image: "images/altostratus.jpg",
//     name: "Altostratus",
//     layer: "Awan Menengah",
//     desc: "Lapisan awan abu-abu yang menutupi sebagian besar langit."
//   },

//   altocumulus: {
//     image: "images/altocumulus.jpg",
//     name: "Altocumulus",
//     layer: "Awan Menengah",
//     desc: "Gumpalan awan menengah yang sering menjadi pertanda perubahan cuaca."
//   },

//   stratus: {
//     image: "images/stratus.jpg",
//     name: "Stratus",
//     layer: "Awan Rendah",
//     desc: "Awan rendah yang tampak seperti kabut terangkat."
//   },

//   stratocumulus: {
//     image: "images/stratocumulus.jpg",
//     name: "Stratocumulus",
//     layer: "Awan Rendah",
//     desc: "Lapisan awan bergumpal yang menyebar luas."
//   },

//   nimbostratus: {
//     image: "images/nimbostratus.jpg",
//     name: "Nimbostratus",
//     layer: "Awan Menengah",
//     desc: "Awan hujan yang tebal dan menutupi langit."
//   },

//   cumulus: {
//     image: "images/cumulus.jpg",
//     name: "Cumulus",
//     layer: "Awan Rendah",
//     desc: "Awan putih menggumpal yang umumnya muncul saat cuaca cerah."
//   },

//   cumulonimbus: {
//     image: "images/cumulonimbus.jpg",
//     name: "Cumulonimbus",
//     layer: "Awan Vertikal",
//     desc: "Awan badai besar yang menghasilkan hujan lebat dan petir."
//   }
// };

// document.querySelectorAll(".hotspot").forEach(button => {

//   button.addEventListener("click", () => {

//     const cloud = clouds[button.dataset.cloud];

//     document.getElementById("cloud-image").src = cloud.image;
//     document.getElementById("cloud-image").alt = cloud.name;

//     document.getElementById("cloud-name").textContent = cloud.name;
//     document.getElementById("cloud-layer").textContent = cloud.layer;
//     document.getElementById("cloud-description").textContent = cloud.desc;

//     document.getElementById("cloud-detail").scrollIntoView({
//       behavior: "smooth",
//       block: "center"
//     });

//   });

// });

/* ---------- 5. Upload Card: drag & drop + file picker ---------- */
const uploadCard = document.getElementById("uploadCard");
const uploadEmpty = document.getElementById("uploadEmpty");
const uploadPreview = document.getElementById("uploadPreview");
const previewImg = document.getElementById("previewImg");
const fileInput = document.getElementById("fileInput");
const browseBtn = document.getElementById("browseBtn");
const resetBtn = document.getElementById("resetBtn");
const detectBtn = document.getElementById("detectBtn");

let selectedFile = null;

browseBtn?.addEventListener("click", () => fileInput.click());
uploadEmpty?.addEventListener("click", (e) => {
  if (e.target === uploadEmpty || e.target.closest(".upload-icon")) {
    fileInput.click();
  }
});

fileInput?.addEventListener("change", (e) => {
  const file = e.target.files?.[0];
  if (file) handleFile(file);
});

["dragenter", "dragover"].forEach((evt) =>
  uploadCard?.addEventListener(evt, (e) => {
    e.preventDefault();
    uploadCard.classList.add("drag-over");
  })
);
["dragleave", "drop"].forEach((evt) =>
  uploadCard?.addEventListener(evt, (e) => {
    e.preventDefault();
    uploadCard.classList.remove("drag-over");
  })
);
uploadCard?.addEventListener("drop", (e) => {
  const file = e.dataTransfer?.files?.[0];
  if (file && file.type.startsWith("image/")) handleFile(file);
});

function handleFile(file) {
  if (!file.type.startsWith("image/")) {
    alert("Mohon unggah file gambar (JPG / PNG).");
    return;
  }
  if (file.size > 10 * 1024 * 1024) {
    alert("Ukuran file maksimal 10 MB.");
    return;
  }
  selectedFile = file;
  const reader = new FileReader();
  reader.onload = (e) => {
    previewImg.src = e.target.result;
    uploadEmpty.hidden = true;
    uploadPreview.hidden = false;
    resetResult();
  };
  reader.readAsDataURL(file);
}

resetBtn?.addEventListener("click", () => {
  selectedFile = null;
  fileInput.value = "";
  previewImg.src = "";
  uploadEmpty.hidden = false;
  uploadPreview.hidden = true;
  resetResult();
});

detectBtn?.addEventListener("click", () => {
  if (!selectedFile) return;
  runDetection(selectedFile);
});


/* ---------- 6. Result panel state ---------- */
const resultEmpty = document.getElementById("resultEmpty");
const resultLoading = document.getElementById("resultLoading");
const resultData = document.getElementById("resultData");
const resultClass = document.getElementById("resultClass");
const resultConfidence = document.getElementById("resultConfidence");
const resultMeta = document.getElementById("resultMeta");
const resultBars = document.getElementById("resultBars");
const resultTime = document.getElementById("resultTime");

function showState(state) {
  resultEmpty.hidden = state !== "empty";
  resultLoading.hidden = state !== "loading";
  resultData.hidden = state !== "data";
}
function resetResult() {
  showState("empty");
  resultBars.innerHTML = "";
}

document.addEventListener("DOMContentLoaded", () => {
  resetResult();
});

/* ===============================================================
   7. runDetection(file)
   ---------------------------------------------------------------
   *** INI TEMPAT ANDA MENGHUBUNGKAN MODEL ANDA ***

   Saat ini fungsi ini menggunakan SIMULASI hasil agar UI dapat
   ditampilkan tanpa backend. Untuk menggunakan model Anda yang
   sebenarnya, ganti blok di dalam komentar "REPLACE" di bawah.

   Contoh integrasi dengan REST API Flask/FastAPI Anda:
   ----------------------------------------------------------------
   const formData = new FormData();
   formData.append("image", file);
   const res = await fetch("http://localhost:5000/predict", {
     method: "POST",
     body: formData,
   });
   const data = await res.json();
   //  data = {
   //    predictions: [
   //      { class: "Cumulus",       prob: 0.74 },
   //      { class: "Stratus",       prob: 0.10 },
   //      ...
   //    ],
   //    inference_ms: 245
   //  }
   renderResult(data.predictions, data.inference_ms);
   ----------------------------------------------------------------
   =============================================================== */
// async function runDetection(file) {
//   showState("loading");
//   const t0 = performance.now();

//   // ============ REPLACE: panggilan model Anda di sini ============
//   // Saat ini menggunakan simulasi acak.
//   await new Promise((r) => setTimeout(r, 1400));
//   const predictions = simulatePredictions();
//   // ===============================================================

//   const inferenceMs = Math.round(performance.now() - t0);
//   renderResult(predictions, inferenceMs);
// }

// /* Simulasi probabilitas — hasilkan distribusi yang masuk akal */
// function simulatePredictions() {
//   // Tentukan top class secara acak
//   const top = CLOUD_CLASSES[Math.floor(Math.random() * 6)];
//   const topProb = 0.62 + Math.random() * 0.32;        // 62 – 94 %
//   const remaining = 1 - topProb;

//   // Sebar sisanya ke kelas lain
//   const others = CLOUD_CLASSES.filter((c) => c.name !== top.name);
//   const weights = others.map(() => Math.random());
//   const wSum = weights.reduce((a, b) => a + b, 0);
//   const otherPreds = others.map((c, i) => ({
//     class: c.name,
//     prob: (weights[i] / wSum) * remaining,
//   }));

//   return [{ class: top.name, prob: topProb }, ...otherPreds].sort(
//     (a, b) => b.prob - a.prob
//   );
// }
async function runDetection(file) {
  showState("loading");
  const t0 = performance.now();

  try {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch("https://cloudvision-imagedetection.up.railway.app/predict", {
      method: "POST",
      body: formData
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Gagal melakukan prediksi");
    }

    const inferenceMs = Math.round(performance.now() - t0);
    renderResult(data.predictions, inferenceMs);

  } catch (error) {
    console.error("Error klasifikasi:", error);
    alert("Terjadi error saat klasifikasi: " + error.message);
    showState("empty");
  }
}

/* Simulasi probabilitas — hasilkan distribusi yang masuk akal */
function simulatePredictions() {
  // Tentukan top class secara acak
  const top = CLOUD_CLASSES[Math.floor(Math.random() * 6)];
  const topProb = 0.62 + Math.random() * 0.32;        // 62 – 94 %
  const remaining = 1 - topProb;

  // Sebar sisanya ke kelas lain
  const others = CLOUD_CLASSES.filter((c) => c.name !== top.name);
  const weights = others.map(() => Math.random());
  const wSum = weights.reduce((a, b) => a + b, 0);
  const otherPreds = others.map((c, i) => ({
    class: c.name,
    prob: (weights[i] / wSum) * remaining,
  }));

  return [{ class: top.name, prob: topProb }, ...otherPreds].sort(
    (a, b) => b.prob - a.prob
  );
}

/* ---------- 8. Render hasil klasifikasi ---------- */
function renderResult(predictions, inferenceMs) {
  showState("data");
  const top = predictions[0];
  const meta = CLOUD_CLASSES.find((c) => c.name === top.class);

  resultClass.textContent = top.class;
  resultConfidence.textContent = (top.prob * 100).toFixed(1) + "%";
  resultMeta.textContent = meta ? meta.label : "";
  resultTime.textContent = `${inferenceMs} ms`;

  resultBars.innerHTML = "";
  predictions.forEach((p, idx) => {
    const row = document.createElement("div");
    row.className = "bar-row" + (idx === 0 ? " top" : "");
    row.innerHTML = `
      <span class="bar-name">${p.class}</span>
      <span class="bar-track"><span class="bar-fill"></span></span>
      <span class="bar-pct">${(p.prob * 100).toFixed(1)}%</span>
    `;
    resultBars.appendChild(row);
    // animate bar in next frame
    requestAnimationFrame(() => {
      row.querySelector(".bar-fill").style.width = (p.prob * 100).toFixed(1) + "%";
    });
  });
}

// BUAT LIVE 
async function loadRadar() {
  try {
    const res = await fetch("https://api.rainviewer.com/public/weather-maps.json");
    const data = await res.json();

    const frames = data.radar.past;

    if (!frames || frames.length === 0) return;

    const last = frames[frames.length - 1];

    // 🔥 pakai tile yang lebih aman (zoom kecil dulu)
    const url = `https://tilecache.rainviewer.com/v2/radar/${last.path}/256/4/0/0/0/0_0.png`;

    document.getElementById("satelliteCard").style.backgroundImage =
      `url('${url}')`;

    document.getElementById("satelliteCard").style.backgroundSize = "cover";
    document.getElementById("satelliteCard").style.backgroundPosition = "center";

  } catch (e) {
    console.error(e);
  }
}

loadRadar();
setInterval(loadRadar, 60000);

document.getElementById("satelliteCard").style.background =
  "red";


/* ---------- 9. Contact form: simulasi submit ---------- */
const contactForm = document.getElementById("contactForm");
const formNote = document.getElementById("formNote");
contactForm?.addEventListener("submit", () => {
  formNote.hidden = false;
  contactForm.querySelectorAll("input, textarea").forEach((el) => (el.value = ""));
  setTimeout(() => (formNote.hidden = true), 4500);
  return false;
});
