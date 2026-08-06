document.addEventListener('DOMContentLoaded', () => {
  const navtoggle = document.getElementById('navtoggle');
  const navlinks = document.getElementById('navlinks');

  if (navtoggle && navlinks) {
    navtoggle.addEventListener('click', () => {
      const isOpen = navlinks.classList.toggle('open');
      navtoggle.classList.toggle('open', isOpen);
      navtoggle.setAttribute('aria-expanded', isOpen);
    });

    navlinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navlinks.classList.remove('open');
        navtoggle.classList.remove('open');
        navtoggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    reveals.forEach((element) => observer.observe(element));
  } else {
    reveals.forEach((element) => element.classList.add('in'));
  }

  const carousels = document.querySelectorAll('[data-carousel]');
  carousels.forEach((carousel) => {
    const track = carousel.querySelector('[data-track]');
    const dotsWrap = carousel.querySelector('[data-dots]');
    const prevBtn = carousel.querySelector('[data-action="prev"]');
    const nextBtn = carousel.querySelector('[data-action="next"]');
    if (!track || !dotsWrap || !prevBtn || !nextBtn) {
      return;
    }

    const slides = Array.from(track.querySelectorAll('img'));
    if (slides.length <= 1) {
      return;
    }

    let currentIndex = Math.max(0, slides.findIndex((slide) => slide.classList.contains('active')));
    if (!slides[currentIndex]) {
      currentIndex = 0;
    }

    const dots = slides.map((_, index) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'shot-dot';
      dot.setAttribute('aria-label', `Go to image ${index + 1}`);
      dot.addEventListener('click', () => setSlide(index));
      dotsWrap.appendChild(dot);
      return dot;
    });

    function setSlide(index) {
      currentIndex = (index + slides.length) % slides.length;
      slides.forEach((slide, slideIndex) => {
        slide.classList.toggle('active', slideIndex === currentIndex);
      });
      dots.forEach((dot, dotIndex) => {
        dot.classList.toggle('active', dotIndex === currentIndex);
      });
    }

    prevBtn.addEventListener('click', () => setSlide(currentIndex - 1));
    nextBtn.addEventListener('click', () => setSlide(currentIndex + 1));

    setSlide(currentIndex);
  });
});
