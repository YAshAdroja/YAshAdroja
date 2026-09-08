/**
 * Yash Adroja - Portfolio Scripts
 * Handles animations, number counters, modals, clipboard, filterable tabs, and direct messaging
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const navbar = document.querySelector('.navbar');
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');
  const navLinkItems = document.querySelectorAll('.nav-link');
  const themeToggle = document.getElementById('themeToggle');
  const metricNumbers = document.querySelectorAll('.metric-number');
  const skillTabs = document.querySelectorAll('.tab-btn');
  const skillCards = document.querySelectorAll('.skill-card');
  const modalBackdrop = document.getElementById('coverLetterModal');
  const openModalBtns = document.querySelectorAll('.open-cover-letter-btn');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const contactForm = document.getElementById('contactForm');
  const toast = document.getElementById('toast');

  /* -------------------------------------------------------------
     1. NAVBAR SCROLL EFFECT & ACTIVE SECTION TRACKING
  ------------------------------------------------------------- */
  const handleScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    const scrollY = window.pageYOffset + 120;
    const sections = document.querySelectorAll('section[id]');

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop;
      const sectionId = current.getAttribute('id');
      const targetNavLink = document.querySelector(`.nav-links a[href*="${sectionId}"]`);

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinkItems.forEach(link => link.classList.remove('active'));
        if (targetNavLink) targetNavLink.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });

  /* -------------------------------------------------------------
     2. MOBILE MENU TOGGLE
  ------------------------------------------------------------- */
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('open');
      navLinks.classList.toggle('open');
    });

    navLinkItems.forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }

  /* -------------------------------------------------------------
     3. THEME TOGGLE (DARK / LIGHT)
  ------------------------------------------------------------- */
  const updateThemeUI = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ya_portfolio_theme', theme);
    if (themeToggle) {
      themeToggle.innerHTML = theme === 'light' ? '🌙' : '☀️';
      themeToggle.setAttribute('title', `Switch to ${theme === 'light' ? 'dark' : 'light'} mode`);
    }
  };

  const savedTheme = localStorage.getItem('ya_portfolio_theme') || 'dark';
  updateThemeUI(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      updateThemeUI(newTheme);
      showToast(`Switched to ${newTheme} mode`);
    });
  }

  /* -------------------------------------------------------------
     4. ANIMATED NUMBER COUNTERS
  ------------------------------------------------------------- */
  let countersStarted = false;

  const startCounters = () => {
    metricNumbers.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      const suffix = counter.getAttribute('data-suffix') || '';
      let count = 0;
      const step = Math.max(1, Math.ceil(target / 40));

      const updateCounter = () => {
        count += step;
        if (count < target) {
          counter.innerText = count + suffix;
          requestAnimationFrame(updateCounter);
        } else {
          counter.innerText = target + suffix;
        }
      };

      updateCounter();
    });
  };

  const metricsSection = document.getElementById('metrics');
  if (metricsSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersStarted) {
          countersStarted = true;
          startCounters();
        }
      });
    }, { threshold: 0.2 });

    observer.observe(metricsSection);
  }

  /* -------------------------------------------------------------
     5. SKILLS FILTERING TABS (INCLUDES AI & MODERN TOOLS)
  ------------------------------------------------------------- */
  skillTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      skillTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');

      skillCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 180);
        }
      });
    });
  });

  /* -------------------------------------------------------------
     6. MODAL HANDLERS (COVER LETTER)
  ------------------------------------------------------------- */
  const openModal = () => {
    if (modalBackdrop) {
      modalBackdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeModal = () => {
    if (modalBackdrop) {
      modalBackdrop.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  openModalBtns.forEach(btn => btn.addEventListener('click', openModal));
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        closeModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop && modalBackdrop.classList.contains('active')) {
      closeModal();
    }
  });

  /* -------------------------------------------------------------
     7. CLIPBOARD UTILITIES & TOAST
  ------------------------------------------------------------- */
  window.copyToClipboard = (text, type = 'Text') => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        showToast(`✓ ${type} copied to clipboard!`);
      }).catch(() => {
        fallbackCopyText(text, type);
      });
    } else {
      fallbackCopyText(text, type);
    }
  };

  function fallbackCopyText(text, type) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      showToast(`✓ ${type} copied to clipboard!`);
    } catch (err) {
      showToast(`Please copy manually: ${text}`);
    }
    document.body.removeChild(textArea);
  }

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  /* -------------------------------------------------------------
     8. SIMPLIFIED DIRECT MESSAGING (GMAIL, MAIL CLIENT & COPY)
  ------------------------------------------------------------- */
  const getFormData = () => {
    const name = document.getElementById('formName').value.trim();
    const email = document.getElementById('formEmail').value.trim();
    const message = document.getElementById('formMessage').value.trim();
    const subject = `Portfolio Inquiry from ${name || 'Prospective Partner'}`;

    return { name, email, subject, message };
  };

  // Option A: Send via Web Gmail directly
  window.sendViaGmail = () => {
    const { name, email, subject, message } = getFormData();
    if (!message) {
      showToast('Please type a short message first');
      document.getElementById('formMessage').focus();
      return;
    }

    const recipient = 'yash.developer8456@gmail.com';
    const bodyContent = `Hi Yash,\n\n${message}\n\nBest,\n${name || 'Anonymous'}\n${email ? `Contact: ${email}` : ''}`;
    
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(recipient)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyContent)}`;
    window.open(gmailUrl, '_blank');
    showToast('Opening Gmail composer...');
  };

  // Option B: Send via Default Mail client (Apple Mail / Outlook / Thunderbird)
  window.sendViaDefaultMail = () => {
    const { name, email, subject, message } = getFormData();
    if (!message) {
      showToast('Please type a short message first');
      document.getElementById('formMessage').focus();
      return;
    }

    const recipient = 'yash.developer8456@gmail.com';
    const bodyContent = `Hi Yash,\n\n${message}\n\nBest regards,\n${name || 'Anonymous'}\n${email ? `Reply-to: ${email}` : ''}`;

    const mailtoUrl = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyContent)}`;
    window.location.href = mailtoUrl;
    showToast('Opening your default mail app...');
  };

  // Option C: Copy full compiled message text to clipboard
  window.copyFormMessage = () => {
    const { name, email, message } = getFormData();
    if (!message) {
      showToast('Please type a message first');
      document.getElementById('formMessage').focus();
      return;
    }

    const fullText = `To: Yash Adroja (yash.developer8456@gmail.com)\nFrom: ${name || 'Anonymous'} (${email || 'No email provided'})\n\nMessage:\n${message}`;
    copyToClipboard(fullText, 'Complete Message');
  };

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      sendViaGmail();
    });
  }
});
