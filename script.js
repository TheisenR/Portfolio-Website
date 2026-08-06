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

  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML = '<button type="button" class="lightbox-nav lightbox-prev" aria-label="Previous expanded image">Prev</button><button type="button" class="lightbox-nav lightbox-next" aria-label="Next expanded image">Next</button><button type="button" class="lightbox-close" aria-label="Close expanded image">Close</button><img alt="Expanded project screenshot">';
  document.body.appendChild(lightbox);

  const lightboxImage = lightbox.querySelector('img');
  const lightboxClose = lightbox.querySelector('.lightbox-close');
  const lightboxPrev = lightbox.querySelector('.lightbox-prev');
  const lightboxNext = lightbox.querySelector('.lightbox-next');
  const lightboxState = {
    slides: [],
    currentIndex: 0,
    setSlide: null,
  };

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    lightboxState.slides = [];
    lightboxState.currentIndex = 0;
    lightboxState.setSlide = null;
  }

  function openLightbox(slides, index, setSlide) {
    if (!lightboxImage) {
      return;
    }
    const safeIndex = (index + slides.length) % slides.length;
    const sourceImage = slides[safeIndex];
    lightboxImage.src = sourceImage.src;
    lightboxImage.alt = sourceImage.alt;
    lightboxState.slides = slides;
    lightboxState.currentIndex = safeIndex;
    lightboxState.setSlide = setSlide;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function stepLightbox(offset) {
    if (!lightbox.classList.contains('open') || !lightboxState.slides.length || !lightboxState.setSlide) {
      return;
    }

    const nextIndex = (lightboxState.currentIndex + offset + lightboxState.slides.length) % lightboxState.slides.length;
    lightboxState.setSlide(nextIndex);
    openLightbox(lightboxState.slides, nextIndex, lightboxState.setSlide);
  }

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', () => stepLightbox(-1));
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', () => stepLightbox(1));
  }

  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight' && lightbox.classList.contains('open')) {
      event.preventDefault();
      stepLightbox(1);
      return;
    }
    if (event.key === 'ArrowLeft' && lightbox.classList.contains('open')) {
      event.preventDefault();
      stepLightbox(-1);
      return;
    }
    if (event.key === 'Escape') {
      closeLightbox();
    }
  });

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

      if (lightbox.classList.contains('open') && lightboxState.slides === slides && lightboxImage) {
        lightboxImage.src = slides[currentIndex].src;
        lightboxImage.alt = slides[currentIndex].alt;
        lightboxState.currentIndex = currentIndex;
      }
    }

    slides.forEach((slide, slideIndex) => {
      slide.addEventListener('click', () => openLightbox(slides, slideIndex, setSlide));
    });

    prevBtn.addEventListener('click', () => setSlide(currentIndex - 1));
    nextBtn.addEventListener('click', () => setSlide(currentIndex + 1));

    setSlide(currentIndex);
  });
});
