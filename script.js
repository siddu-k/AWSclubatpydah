/* ─── NAVBAR SCROLL ─── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

/* ─── MOBILE MENU ─── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  spans[0].style.transform = navLinks.classList.contains('open') ? 'rotate(45deg) translate(5px,5px)' : '';
  spans[1].style.opacity   = navLinks.classList.contains('open') ? '0' : '1';
  spans[2].style.transform = navLinks.classList.contains('open') ? 'rotate(-45deg) translate(5px,-5px)' : '';
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = '1'; });
  });
});

/* ─── SMOOTH ACTIVE NAV LINK ─── */
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 100) current = sec.getAttribute('id');
  });
  navItems.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current ? '#FF9900' : '';
  });
});

/* ─── ANIMATED COUNTER ─── */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) { current = target; clearInterval(timer); }
    el.textContent = Math.floor(current);
  }, 16);
}
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));

/* ─── SCROLL REVEAL ─── */
let revealDelay = 0;
let revealTimeout = null;

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, revealDelay);
      revealDelay += 100;
      
      clearTimeout(revealTimeout);
      revealTimeout = setTimeout(() => { revealDelay = 0; }, 100);
      
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.about-card, .event-card, .team-card, .gallery-item').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  revealObserver.observe(el);
});

/* ─── 3D TILT EFFECT ─── */
document.querySelectorAll('.tilt-card').forEach(card => {
  card.style.transition = 'transform 0.1s ease, box-shadow 0.1s ease';
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transition = 'transform 0.6s ease, box-shadow 0.6s ease';
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)`;
    setTimeout(() => {
      card.style.transition = 'transform 0.1s ease, box-shadow 0.1s ease';
    }, 600);
  });
});

/* ─── REGISTRATION FORM VALIDATION ─── */
const form        = document.getElementById('registerForm');
const formSuccess = document.getElementById('formSuccess');

function showError(fieldId, msg) {
  const el = document.getElementById(fieldId + 'Error');
  const input = document.getElementById(fieldId);
  if (el) el.textContent = msg;
  if (input) input.classList.add('error');
}
function clearError(fieldId) {
  const el = document.getElementById(fieldId + 'Error');
  const input = document.getElementById(fieldId);
  if (el) el.textContent = '';
  if (input) input.classList.remove('error');
}
function clearAllErrors() {
  ['fullName','email','phone','branch','year','event','consent'].forEach(clearError);
}

function validateForm() {
  clearAllErrors();
  let valid = true;

  const fullName = document.getElementById('fullName').value.trim();
  if (!fullName) { showError('fullName', 'Full name is required.'); valid = false; }
  else if (fullName.length < 3) { showError('fullName', 'Name must be at least 3 characters.'); valid = false; }

  const email = document.getElementById('email').value.trim();
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) { showError('email', 'Email address is required.'); valid = false; }
  else if (!emailRe.test(email)) { showError('email', 'Enter a valid email address.'); valid = false; }

  const phone = document.getElementById('phone').value.trim();
  const phoneRe = /^[+]?[\d\s\-()]{8,15}$/;
  if (!phone) { showError('phone', 'Phone number is required.'); valid = false; }
  else if (!phoneRe.test(phone)) { showError('phone', 'Enter a valid phone number.'); valid = false; }

  if (!document.getElementById('branch').value) { showError('branch', 'Please select your branch.'); valid = false; }
  if (!document.getElementById('year').value)   { showError('year',   'Please select your year.'); valid = false; }
  if (!document.getElementById('event').value)  { showError('event',  'Please select an event or membership.'); valid = false; }

  if (!document.getElementById('consent').checked) {
    showError('consent', 'You must agree to receive updates.'); valid = false;
  }
  return valid;
}

/* Live clear errors on input */
['fullName','email','phone','branch','year','event'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('input', () => clearError(id));
});
const consentEl = document.getElementById('consent');
if (consentEl) {
  consentEl.addEventListener('change', () => clearError('consent'));
}

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const btn = document.getElementById('submitBtn');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';

    /* Simulate async submission */
    setTimeout(() => {
      form.style.display = 'none';
      formSuccess.classList.add('visible');
    }, 1400);
  });
}

function resetForm() {
  form.reset();
  clearAllErrors();
  form.style.display = 'block';
  formSuccess.classList.remove('visible');
  const btn = document.getElementById('submitBtn');
  btn.disabled = false;
  btn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Registration';
}

/* ─── FOUNDATIONAL TEAM SLIDER ─── */
const slider = document.getElementById('foundational-slider');
if (slider) {
  let isDown = false;
  let startX;
  let scrollLeft;
  let autoScrollInterval;
  
  slider.addEventListener('mousedown', (e) => {
    isDown = true;
    slider.style.cursor = 'grabbing';
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
    pauseAutoScroll();
  });
  
  slider.addEventListener('mouseleave', () => {
    isDown = false;
    slider.style.cursor = 'grab';
    resumeAutoScroll();
  });
  
  slider.addEventListener('mouseup', () => {
    isDown = false;
    slider.style.cursor = 'grab';
  });
  
  slider.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 2;
    slider.scrollLeft = scrollLeft - walk;
  });

  function startAutoScroll() {
    autoScrollInterval = setInterval(() => {
      slider.scrollLeft += 1;
      if (slider.scrollLeft >= (slider.scrollWidth - slider.clientWidth - 1)) {
        slider.scrollLeft = 0;
      }
    }, 20);
  }
  
  function pauseAutoScroll() {
    clearInterval(autoScrollInterval);
  }
  
  function resumeAutoScroll() {
    if(!isDown) startAutoScroll();
  }

  slider.addEventListener('mouseenter', pauseAutoScroll);
  
  startAutoScroll();
}

/* ─── GALLERY SLIDER ─── */
const gallerySlider = document.getElementById('gallery-slider');
if (gallerySlider) {
  let isDownG = false;
  let startXG;
  let scrollLeftG;
  let autoScrollIntervalG;
  
  gallerySlider.addEventListener('mousedown', (e) => {
    isDownG = true;
    gallerySlider.style.cursor = 'grabbing';
    startXG = e.pageX - gallerySlider.offsetLeft;
    scrollLeftG = gallerySlider.scrollLeft;
    pauseAutoScrollG();
  });
  
  gallerySlider.addEventListener('mouseleave', () => {
    isDownG = false;
    gallerySlider.style.cursor = 'grab';
    resumeAutoScrollG();
  });
  
  gallerySlider.addEventListener('mouseup', () => {
    isDownG = false;
    gallerySlider.style.cursor = 'grab';
  });
  
  gallerySlider.addEventListener('mousemove', (e) => {
    if (!isDownG) return;
    e.preventDefault();
    const x = e.pageX - gallerySlider.offsetLeft;
    const walk = (x - startXG) * 2;
    gallerySlider.scrollLeft = scrollLeftG - walk;
  });

  function startAutoScrollG() {
    autoScrollIntervalG = setInterval(() => {
      gallerySlider.scrollLeft += 1;
      if (gallerySlider.scrollLeft >= (gallerySlider.scrollWidth - gallerySlider.clientWidth - 1)) {
        gallerySlider.scrollLeft = 0;
      }
    }, 25);
  }
  
  function pauseAutoScrollG() {
    clearInterval(autoScrollIntervalG);
  }
  
  function resumeAutoScrollG() {
    if(!isDownG) startAutoScrollG();
  }

  gallerySlider.addEventListener('mouseenter', pauseAutoScrollG);
  
  startAutoScrollG();
}
