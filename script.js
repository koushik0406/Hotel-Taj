/* ---------- Hotel Taj Interactivity: booking, guests, theme, snow, gallery lightbox, map modal ---------- */

/* UTILS: safe query */
const $ = (sel) => document.querySelector(sel);

/* ---------- Guests selector ---------- */
let guests = 1;
const guestDisplay = $('#guestsCount');
if (guestDisplay) guestDisplay.textContent = guests;

const incGuestsBtn = $('#incGuests');
const decGuestsBtn = $('#decGuests');
if (incGuestsBtn) incGuestsBtn.addEventListener('click', () => {
  guests = Math.min(8, guests + 1);
  guestDisplay.textContent = guests;
});
if (decGuestsBtn) decGuestsBtn.addEventListener('click', () => {
  guests = Math.max(1, guests - 1);
  guestDisplay.textContent = guests;
});

/* ---------- Booking form simulation ---------- */
const bookingForm = $('#bookingForm');
if (bookingForm) {
  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = $('#fullName') ? $('#fullName').value : 'Guest';
    $('#bookingMessage').textContent = `Thanks ${name}, your holiday reservation request has been received! 🎄✨`;
    bookingForm.reset();
    guests = 1;
    if (guestDisplay) guestDisplay.textContent = '1';
  });
}

/* Check availability button */
const checkAvailBtn = $('#checkAvail');
if (checkAvailBtn) {
  checkAvailBtn.addEventListener('click', () => {
    const cIn = $('#checkin').value;
    const cOut = $('#checkout').value;
    const msg = $('#bookingMessage');
    if (!cIn || !cOut) {
      msg.textContent = 'Please choose check-in and check-out dates.';
      return;
    }
    msg.textContent = 'Checking availability...';
    setTimeout(() => { msg.textContent = 'Rooms available for your dates ✨'; }, 700);
  });
}

/* ---------- Set footer year ---------- */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ---------- Theme toggle (Holiday / Default) ---------- */
const themeToggle = document.getElementById('themeToggle');
themeToggle && themeToggle.addEventListener('click', () => {
  // toggle class that controls holiday decorations (snow etc.)
  document.body.classList.toggle('holiday-theme');
  // also toggle ARIA pressed
  const pressed = themeToggle.getAttribute('aria-pressed') === 'true';
  themeToggle.setAttribute('aria-pressed', String(!pressed));
});

/* ---------- Snow generator (respects reduced motion) ---------- */
(function snowInit(){
  const container = document.getElementById('snow-container');
  if (!container) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return; // don't animate if user prefers reduced motion

  function createSnowflake() {
    const snow = document.createElement('div');
    snow.className = 'snowflake';
    snow.textContent = '❄';
    snow.style.left = Math.random() * 100 + 'vw';
    snow.style.animationDuration = 4 + Math.random() * 6 + 's';
    snow.style.fontSize = 10 + Math.random() * 16 + 'px';
    container.appendChild(snow);
    setTimeout(() => snow.remove(), 11000);
  }
  // create flakes in intervals (small)
  setInterval(createSnowflake, 220);
})();

/* ---------- ROOM GALLERY LIGHTBOX ---------- */
(function () {
  const galleryButtons = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lbImage = document.getElementById('lbImage');
  const lbCaption = document.getElementById('lbCaption');
  const lbClose = document.getElementById('lbClose');
  const lbPrev = document.getElementById('lbPrev');
  const lbNext = document.getElementById('lbNext');

  if (!galleryButtons.length || !lightbox) return;

  const items = Array.from(galleryButtons).map(btn => ({
    full: btn.getAttribute('data-full'),
    alt: btn.querySelector('img') ? btn.querySelector('img').alt || '' : ''
  }));

  let currentIndex = 0;
  let lastFocused = null;

  function openLightbox(index) {
    currentIndex = index;
    const item = items[index];
    lbImage.src = item.full;
    lbImage.alt = item.alt;
    lbCaption.textContent = item.alt;
    lightbox.setAttribute('aria-hidden', 'false');
    lastFocused = document.activeElement;
    lbClose.focus();
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.setAttribute('aria-hidden', 'true');
    lbImage.src = '';
    lbCaption.textContent = '';
    document.body.style.overflow = '';
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    openLightbox(currentIndex);
  }
  function showNext() {
    currentIndex = (currentIndex + 1) % items.length;
    openLightbox(currentIndex);
  }

  galleryButtons.forEach((btn, idx) => {
    btn.addEventListener('click', () => openLightbox(idx));
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(idx);
      }
    });
  });

  lbClose.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', showPrev);
  lbNext.addEventListener('click', showNext);

  document.addEventListener('keydown', (e) => {
    if (lightbox.getAttribute('aria-hidden') === 'false') {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    }
  });

  // Click outside to close
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
})();

/* ---------- MAP modal open/close ---------- */
(function(){
  const openMapBtn = document.getElementById('openMapBtn');
  const mapModal = document.getElementById('mapModal');
  const closeMapBtn = document.getElementById('closeMapBtn');

  if (!openMapBtn || !mapModal) return;

  openMapBtn.addEventListener('click', () => {
    mapModal.setAttribute('aria-hidden','false');
    openMapBtn.setAttribute('aria-expanded','true');
    // focus the close button for keyboard users
    setTimeout(() => closeMapBtn.focus(), 100);
    document.body.style.overflow = 'hidden';
  });

  function closeMap(){
    mapModal.setAttribute('aria-hidden','true');
    openMapBtn.setAttribute('aria-expanded','false');
    document.body.style.overflow = '';
    openMapBtn.focus();
  }

  closeMapBtn.addEventListener('click', closeMap);

  // close on Esc and click outside
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mapModal.getAttribute('aria-hidden') === 'false') closeMap();
  });
  mapModal.addEventListener('click', (e) => {
    if (e.target === mapModal) closeMap();
  });
})();
