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
      }
      video.play().catch(() => {});
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
  const iconOn = btn.querySelector('.icon-on');
  const iconOff = btn.querySelector('.icon-off');
  btn.addEventListener('click', () => {
    video.muted = !video.muted;
    iconOn.hidden = video.muted;
    iconOff.hidden = !video.muted;
  });
});
