// --- Scroll animations ---
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll('.animate-on-scroll').forEach((el) => observer.observe(el));

// --- Nav background on scroll ---
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('nav--scrolled', window.scrollY > 50);
}, { passive: true });

// --- Carousel dot sync ---
const track = document.querySelector('.screenshots__track');
const dots = document.querySelectorAll('.screenshots__dot');

if (track && dots.length) {
  const slides = track.querySelectorAll('.screenshots__slide');

  function updateDots() {
    const scrollLeft = track.scrollLeft;
    const trackWidth = track.scrollWidth - track.clientWidth;
    const progress = trackWidth > 0 ? scrollLeft / trackWidth : 0;
    const activeIndex = Math.round(progress * (slides.length - 1));
    dots.forEach((dot, i) => {
      dot.classList.toggle('screenshots__dot--active', i === activeIndex);
    });
  }

  track.addEventListener('scroll', updateDots, { passive: true });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      slides[i].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    });
  });

  updateDots();
}

// --- Guide carousel ---
const guideTrack = document.getElementById('guideTrack');
const guideDots = document.querySelectorAll('.guide__dot');
const guidePrev = document.getElementById('guidePrev');
const guideNext = document.getElementById('guideNext');

if (guideTrack && guideDots.length) {
  const guideSlides = guideTrack.querySelectorAll('.guide__slide');
  let currentStep = 0;

  function goToStep(i) {
    currentStep = Math.max(0, Math.min(i, guideSlides.length - 1));
    guideSlides[currentStep].scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
    guideDots.forEach((d, j) => d.classList.toggle('guide__dot--active', j === currentStep));
    guidePrev.disabled = currentStep === 0;
    guideNext.disabled = currentStep === guideSlides.length - 1;
  }

  guidePrev.addEventListener('click', () => goToStep(currentStep - 1));
  guideNext.addEventListener('click', () => goToStep(currentStep + 1));
  guideDots.forEach((dot, i) => dot.addEventListener('click', () => goToStep(i)));

  // Sync on manual scroll
  guideTrack.addEventListener('scroll', () => {
    const scrollLeft = guideTrack.scrollLeft;
    const slideWidth = guideTrack.scrollWidth / guideSlides.length;
    const idx = Math.round(scrollLeft / slideWidth);
    if (idx !== currentStep) {
      currentStep = idx;
      guideDots.forEach((d, j) => d.classList.toggle('guide__dot--active', j === currentStep));
      guidePrev.disabled = currentStep === 0;
      guideNext.disabled = currentStep === guideSlides.length - 1;
    }
  }, { passive: true });
}
