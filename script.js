// Scroll progress bar
const progress = document.querySelector('.progress');
function updateProgress(){
  const h = document.documentElement;
  const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight) * 100;
  progress.style.width = (isFinite(scrolled) ? scrolled : 0) + '%';
}
document.addEventListener('scroll', updateProgress, {passive:true});
updateProgress();

// Reveal-on-scroll
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      revealObserver.unobserve(e.target);
    }
  });
}, {threshold:0.15, rootMargin:'0px 0px -8% 0px'});
revealEls.forEach(el => revealObserver.observe(el));

// Dot nav active state
const sections = document.querySelectorAll('.game[id]');
const dots = document.querySelectorAll('.dotnav a');
const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    const dot = document.querySelector('.dotnav a[href="#' + e.target.id + '"]');
    if (!dot) return;
    if (e.isIntersecting) {
      dots.forEach(d => d.classList.remove('active'));
      dot.classList.add('active');
    }
  });
}, {threshold:0.5});
sections.forEach(s => navObserver.observe(s));

// Global sound gate: autoplay-with-sound is blocked by every browser until
// the visitor interacts once. This button is that one interaction; after
// it fires, every video that scrolls into view plays unmuted automatically.
let soundEnabled = false;
const soundGate = document.getElementById('sound-gate');
function setCardIcons(card, muted) {
  const iconOn = card.querySelector('.icon-on');
  const iconOff = card.querySelector('.icon-off');
  if (iconOn) iconOn.hidden = muted;
  if (iconOff) iconOff.hidden = !muted;
}
soundGate.addEventListener('click', () => {
  soundEnabled = true;
  soundGate.classList.add('gone');
  document.querySelectorAll('.frame').forEach(card => {
    const video = card.querySelector('video');
    if (!video) return;
    video.muted = false;
    setCardIcons(card, false);
    video.play().catch(() => {});
  });
});

// Lazy play/pause video when visible, with per-card sound toggle
const videoCards = document.querySelectorAll('.frame');
const videoObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const card = entry.target;
    const video = card.querySelector('video');
    if (!video) return;
    if (entry.isIntersecting) {
      if (!video.src && video.dataset.src) {
        video.src = video.dataset.src;
        video.muted = !soundEnabled;
        setCardIcons(card, video.muted);
      }
      video.play().catch(() => {
        // Autoplay with sound was refused (gate not used this session yet) — fall back to muted.
        if (!video.muted) { video.muted = true; setCardIcons(card, true); video.play().catch(() => {}); }
      });
    } else {
      video.pause();
    }
  });
}, {threshold:0.25});
videoCards.forEach(card => videoObserver.observe(card));

videoCards.forEach(card => {
  const video = card.querySelector('video');
  const btn = card.querySelector('.sound');
  if (!video || !btn) return;
  btn.addEventListener('click', () => {
    video.muted = !video.muted;
    setCardIcons(card, video.muted);
  });
});
