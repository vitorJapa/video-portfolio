const longGrid = document.getElementById("long-grid");
const shortGrid = document.getElementById("short-grid");
const longSection = document.getElementById("long-section");
const shortSection = document.getElementById("short-section");
const aboutSection = document.getElementById("about-section");
const contactSection = document.getElementById("contact-section");
const modalOverlay = document.getElementById("modal-overlay");
const modalContent = document.getElementById("modal-content");
const modalPlayer = document.getElementById("modal-player");
const modalClose = document.getElementById("modal-close");
const filterBtns = document.querySelectorAll(".filter-btn");

function thumbUrl(video) {
  if (!video.platform || video.platform === "youtube") {
    return `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`;
  }
  return null; // non-YouTube: use placeholder
}

const PLATFORM_LABELS = { instagram: "Instagram Reel", tiktok: "TikTok" };
const PLATFORM_COLORS = { instagram: "linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)", tiktok: "linear-gradient(135deg,#010101,#69c9d0)" };

function createCard(video) {
  const card = document.createElement("div");
  card.className = "card";
  const platform = video.platform || "youtube";
  const thumb = thumbUrl(video);

  const thumbHtml = thumb
    ? `<img src="${thumb}" alt="${video.title}" loading="lazy">`
    : `<div class="platform-placeholder" style="background:${PLATFORM_COLORS[platform]}">
         <span class="platform-label">${PLATFORM_LABELS[platform] || platform}</span>
       </div>`;

  card.innerHTML = `
    <div class="thumb-wrap">
      ${thumbHtml}
      <div class="play-icon"></div>
    </div>
    <div class="card-body">
      <h3>${video.title}</h3>
      <p>${video.description || ""}</p>
    </div>
  `;
  card.addEventListener("click", () => openModal(video));
  return card;
}

function render() {
  longGrid.innerHTML = "";
  shortGrid.innerHTML = "";

  const longs = VIDEOS.filter(v => v.type === "long");
  const shorts = VIDEOS.filter(v => v.type === "short");

  if (longs.length === 0) {
    longGrid.innerHTML = '<p class="empty">No long videos added yet.</p>';
  } else {
    longs.forEach(v => longGrid.appendChild(createCard(v)));
  }

  if (shorts.length === 0) {
    shortGrid.innerHTML = '<p class="empty">No shorts added yet.</p>';
  } else {
    shorts.forEach(v => shortGrid.appendChild(createCard(v)));
  }
}

function embedUrl(video) {
  const platform = video.platform || "youtube";
  if (platform === "instagram") return `https://www.instagram.com/p/${video.videoId}/embed/`;
  if (platform === "tiktok")    return `https://www.tiktok.com/embed/v2/${video.videoId}`;
  return `https://www.youtube.com/embed/${video.youtubeId}?autoplay=1`;
}

function openModal(video) {
  modalPlayer.src = embedUrl(video);
  modalContent.classList.toggle("short", video.type === "short");
  modalOverlay.classList.remove("hidden");
}

function closeModal() {
  modalOverlay.classList.add("hidden");
  modalPlayer.src = "";
}

modalClose.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const filter = btn.dataset.filter;
    longSection.style.display = (filter === "all" || filter === "long") ? "" : "none";
    shortSection.style.display = (filter === "all" || filter === "short") ? "" : "none";
    aboutSection.style.display = (filter === "about") ? "" : "none";
    contactSection.style.display = (filter === "contact") ? "" : "none";
  });
});

render();

// Force GIFs to loop (re-trigger when scrolled into view)
function setupGifLooping(img, interval) {
  const src = img.src;
  const restart = () => { img.src = ''; img.src = src; };

  new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) restart();
  }, { threshold: 0.3 }).observe(img);

  setInterval(() => {
    const rect = img.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) restart();
  }, interval);
}

const editsGif = document.querySelector('.card-gif[src*="edits"]');
const hooksGif = document.querySelector('.card-gif[src*="hooks"]');
const stwGif   = document.querySelector('.quote-gif');

if (editsGif) setupGifLooping(editsGif, 11000);
if (hooksGif) setupGifLooping(hooksGif, 11000);
if (stwGif)   setupGifLooping(stwGif, 9000);
