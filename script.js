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
});
