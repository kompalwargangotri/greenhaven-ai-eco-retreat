/**
 * GreenHaven Eco-Retreat - Fullstack Client Script
 * Author: Gangotri Kompalwar
 * Date: 2026-07-15
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialization of modules
  initTheme();
  initNavbar();
  initTypewriter();
  initPackagesFilter();
  initBookingSimulator();
  initGalleryLightbox();
  initReviewsCarousel();
  initFaqAccordion();
  initContactForm();
});

/* ==========================================================================
   1. Theme Switcher Module (Light / Dark Mode)
   ========================================================================== */
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  const sunIcon = themeToggle.querySelector('.sun-icon');
  const moonIcon = themeToggle.querySelector('.moon-icon');
  
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
  
  applyTheme(initialTheme);
  
  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
  });
  
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    if (theme === 'dark') {
      sunIcon.style.display = 'block';
      moonIcon.style.display = 'none';
    } else {
      sunIcon.style.display = 'none';
      moonIcon.style.display = 'block';
    }
  }
}

/* ==========================================================================
   2. Sticky Navbar, Scroll Spy & Mobile Menu
   ========================================================================== */
function initNavbar() {
  const header = document.getElementById('header');
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navLinks = document.getElementById('nav-links');
  const navItems = navLinks.querySelectorAll('a');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }
    scrollSpy();
  });
  
  hamburgerBtn.addEventListener('click', () => {
    hamburgerBtn.classList.toggle('active');
    navLinks.classList.toggle('active');
  });
  
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      hamburgerBtn.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });
  
  const sections = document.querySelectorAll('section[id]');
  
  function scrollSpy() {
    const scrollPos = window.scrollY + 120;
    
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      
      if (scrollPos >= top && scrollPos < top + height) {
        navItems.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }
}

/* ==========================================================================
   3. Typewriter Headline Animation
   ========================================================================== */
function initTypewriter() {
  const textElement = document.getElementById('typing-text');
  const phrases = [
    "Welcome to GreenHaven Eco-Retreat!",
    "Experience forest trekking & boating outings.",
    "Book pristine luxury cottage accommodations.",
    "Create beautiful memories with your family!"
  ];
  
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 70;
  
  function type() {
    const currentPhrase = phrases[phraseIndex];
    
    if (isDeleting) {
      textElement.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 30;
    } else {
      textElement.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 80;
    }
    
    if (!isDeleting && charIndex === currentPhrase.length) {
      isDeleting = true;
      typingSpeed = 1500;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingSpeed = 500;
    }
    
    setTimeout(type, typingSpeed);
  }
  
  setTimeout(type, 1000);
}

/* ==========================================================================
   4. Packages Category Filter
   ========================================================================== */
function initPackagesFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const packageCards = document.querySelectorAll('.package-card');
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const filterValue = btn.getAttribute('data-filter');
      
      packageCards.forEach(card => {
        const category = card.getAttribute('data-category');
        
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          card.animate([
            { opacity: 0, transform: 'scale(0.95)' },
            { opacity: 1, transform: 'scale(1)' }
          ], { duration: 300, easing: 'ease-out' });
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   5. Interactive Booking Simulator & Calculator (Fullstack Integrated)
   ========================================================================== */
function initBookingSimulator() {
  const form = document.getElementById('booking-form');
  const packageSelect = document.getElementById('booking-package');
  const adultsInput = document.getElementById('booking-adults');
  const childrenInput = document.getElementById('booking-children');
  const dateInput = document.getElementById('booking-date');
  
  const chkBonfire = document.getElementById('chk-bonfire');
  const chkGuide = document.getElementById('chk-guide');
  const chkBuffet = document.getElementById('chk-buffet');
  const addonItems = document.querySelectorAll('.addon-item');
  
  const summaryPackage = document.getElementById('summary-package');
  const summaryGuests = document.getElementById('summary-guests');
  const summaryAddons = document.getElementById('summary-addons');
  const summaryTax = document.getElementById('summary-tax');
  const summaryTotal = document.getElementById('summary-total');
  
  const modalOverlay = document.getElementById('booking-modal-overlay');
  const modalClose = document.getElementById('booking-modal-close');
  const receiptContainer = document.getElementById('booking-receipt');
  const btnPrint = document.getElementById('btn-print-receipt');
  const btnDismiss = document.getElementById('btn-dismiss-receipt');
  const submitBtn = form.querySelector('button[type="submit"]');
  
  // Set default check-in date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  dateInput.value = tomorrow.toISOString().split('T')[0];
  dateInput.min = tomorrow.toISOString().split('T')[0];
  
  addonItems.forEach(item => {
    item.addEventListener('click', (e) => {
      const checkbox = item.querySelector('input[type="checkbox"]');
      if (e.target !== checkbox) {
        checkbox.checked = !checkbox.checked;
      }
      item.classList.toggle('selected', checkbox.checked);
      calculateTotal();
    });
  });
  
  packageSelect.addEventListener('change', calculateTotal);
  adultsInput.addEventListener('input', calculateTotal);
  childrenInput.addEventListener('input', calculateTotal);
  
  function calculateTotal() {
    const packageCostPerGuest = parseFloat(packageSelect.value);
    const adultsCount = parseInt(adultsInput.value) || 0;
    const childrenCount = parseInt(childrenInput.value) || 0;
    
    const packageTotal = (packageCostPerGuest * adultsCount) + (packageCostPerGuest * 0.5 * childrenCount);
    
    let addonTotal = 0;
    if (chkBonfire.checked) addonTotal += 150;
    if (chkGuide.checked) addonTotal += 300;
    if (chkBuffet.checked) {
      addonTotal += 250 * (adultsCount + childrenCount);
    }
    
    const subtotal = packageTotal + addonTotal;
    const taxRate = 0.05;
    const taxTotal = subtotal * taxRate;
    const grandTotal = subtotal + taxTotal;
    
    summaryPackage.textContent = `₹${packageTotal.toLocaleString('en-IN', {maximumFractionDigits:2})}`;
    summaryGuests.textContent = `${adultsCount} Adult${adultsCount > 1 ? 's' : ''}, ${childrenCount} Kid${childrenCount > 1 ? 's' : ''}`;
    summaryAddons.textContent = `₹${addonTotal.toLocaleString('en-IN', {maximumFractionDigits:2})}`;
    summaryTax.textContent = `₹${taxTotal.toLocaleString('en-IN', {maximumFractionDigits: 2})}`;
    summaryTotal.textContent = `₹${grandTotal.toLocaleString('en-IN', {maximumFractionDigits: 2})}`;
    
    return {
      packagePrice: packageCostPerGuest,
      packageTotal,
      adultsCount,
      childrenCount,
      addonTotal,
      taxTotal,
      grandTotal
    };
  }
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('booking-name').value.trim();
    const email = document.getElementById('booking-email').value.trim();
    
    if (!name || !email || !dateInput.value) {
      showToast('Please fill out all required fields.', 'info');
      return;
    }
    
    const finalBill = calculateTotal();
    const packageName = packageSelect.options[packageSelect.selectedIndex].getAttribute('data-name');
    
    // Compile checked addons
    const addonsList = [];
    if (chkBonfire.checked) addonsList.push('Campfire & Bonfire Setup');
    if (chkGuide.checked) addonsList.push('Private Nature Guide');
    if (chkBuffet.checked) addonsList.push('Organic Buffet Dinner Upgrade');
    
    const bookingPayload = {
      name,
      email,
      date: dateInput.value,
      package_name: packageName,
      adults: finalBill.adultsCount,
      children: finalBill.childrenCount,
      addons: addonsList.join(', '),
      total_price: finalBill.grandTotal
    };
    
    // Disable submit button during dynamic api call
    submitBtn.disabled = true;
    submitBtn.textContent = 'Processing Booking...';
    
    // Send payload to Node.js backend SQLite DB
    fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingPayload)
    })
    .then(res => {
      if (!res.ok) throw new Error("Server error during booking save.");
      return res.json();
    })
    .then(data => {
      // Re-enable and reset form
      submitBtn.disabled = false;
      submitBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 18px; height: 18px;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        Confirm Booking & Generate Ticket
      `;
      form.reset();
      addonItems.forEach(item => item.classList.remove('selected'));
      calculateTotal();
      
      // Build dynamic receipt modal with SQL generated IDs
      let receiptHtml = `
        <div class="receipt-header">
          <div class="receipt-logo">GREENHAVEN ECO-RETREAT</div>
          <div>Booking Gate Pass Ticket</div>
          <div style="font-size: 0.75rem; color: var(--text-muted);">Ticket ID: ${data.ticket_id}</div>
        </div>
        
        <div class="receipt-row">
          <span>Visitor Name:</span>
          <strong>${data.visitor_name}</strong>
        </div>
        <div class="receipt-row">
          <span>Email Address:</span>
          <span>${data.email}</span>
        </div>
        <div class="receipt-row">
          <span>Booking Date:</span>
          <span>${data.visit_date}</span>
        </div>
        <div class="receipt-row">
          <span>Package Choice:</span>
          <span>${data.package_name}</span>
        </div>
        
        <div class="receipt-divider"></div>
        
        <div class="receipt-row">
          <span>Base package (${data.adults} Ad, ${data.children} Ch):</span>
          <span>₹${finalBill.packageTotal.toFixed(2)}</span>
        </div>
      `;
      
      if (data.addons) {
        receiptHtml += `
          <div class="receipt-row" style="flex-direction: column; align-items: flex-start; gap: 4px;">
            <span>Add-ons Checked:</span>
            <span style="font-size: 0.82rem; color: var(--text-muted); padding-left: 10px;">${data.addons}</span>
          </div>
          <div class="receipt-row">
            <span>Add-ons Pricing total:</span>
            <span>₹${finalBill.addonTotal.toFixed(2)}</span>
          </div>
        `;
      }
      
      receiptHtml += `
        <div class="receipt-row">
          <span>Eco & service Tax (5%):</span>
          <span>₹${finalBill.taxTotal.toFixed(2)}</span>
        </div>
        
        <div class="receipt-divider"></div>
        
        <div class="receipt-row total">
          <span>GRAND TOTAL:</span>
          <span>₹${data.total_price.toFixed(2)}</span>
        </div>
        
        <div class="receipt-barcode">
          <div>SCANNABLE ENTRANCE TICKET</div>
          <div class="barcode-sim"></div>
          <div style="font-size: 0.7rem; margin-top: 5px;">Present this barcode at gate check-in</div>
        </div>
      `;
      
      receiptContainer.innerHTML = receiptHtml;
      
      // Toggle modal overlay
      modalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      showToast('Booking success! Gate pass generated.', 'success');
    })
    .catch(err => {
      console.error(err);
      submitBtn.disabled = false;
      submitBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 18px; height: 18px;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        Confirm Booking & Generate Ticket
      `;
      showToast('Error booking ticket. Try again later.', 'info');
    });
  });
  
  function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }
  
  modalClose.addEventListener('click', closeModal);
  btnDismiss.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });
  
  btnPrint.addEventListener('click', () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Pass - GreenHaven</title>
          <style>
            body { font-family: monospace; padding: 30px; text-align: left; line-height: 1.5; color: #333; }
            .receipt-header { text-align: center; border-bottom: 2px dashed #ccc; padding-bottom: 15px; margin-bottom: 15px; }
            .receipt-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; }
            .receipt-divider { border-top: 2px dashed #ccc; margin: 12px 0; }
            .receipt-row.total { font-weight: bold; font-size: 16px; margin-top: 10px; }
            .receipt-barcode { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px dashed #ccc; }
            .barcode-sim { height: 45px; background: repeating-linear-gradient(90deg, #000, #000 2px, transparent 2px, transparent 6px, #000 6px, #000 10px, transparent 10px, transparent 12px); width: 70%; margin: 8px auto 0; }
          </style>
        </head>
        <body onload="window.print();window.close();">
          ${receiptContainer.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
  });
  
  calculateTotal();
}

/* ==========================================================================
   6. Image Lightbox Module
   ========================================================================== */
function initGalleryLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('gallery-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  
  let currentIdx = 0;
  const imageSources = Array.from(galleryItems).map(item => ({
    src: item.getAttribute('data-src'),
    title: item.getAttribute('data-title'),
    cat: item.getAttribute('data-cat')
  }));
  
  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      currentIdx = index;
      openLightbox(currentIdx);
    });
  });
  
  function openLightbox(index) {
    const current = imageSources[index];
    lightboxImg.src = current.src;
    lightboxCaption.innerHTML = `<strong>${current.cat}</strong> - ${current.title}`;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  
  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
  
  function showNext() {
    currentIdx = (currentIdx + 1) % imageSources.length;
    openLightbox(currentIdx);
  }
  
  function showPrev() {
    currentIdx = (currentIdx - 1 + imageSources.length) % imageSources.length;
    openLightbox(currentIdx);
  }
  
  lightboxClose.addEventListener('click', closeLightbox);
  lightboxNext.addEventListener('click', showNext);
  lightboxPrev.addEventListener('click', showPrev);
  
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });
}

/* ==========================================================================
   7. Reviews slider & Submission System (SQL API backed)
   ========================================================================== */
function initReviewsCarousel() {
  const slider = document.getElementById('reviews-slider');
  const dotsContainer = document.getElementById('reviews-dots');
  const reviewForm = document.getElementById('review-form');
  const starSelector = document.getElementById('star-selector');
  const starBtns = starSelector.querySelectorAll('.star-btn');
  
  let activeIndex = 0;
  let activeRating = 5;
  let reviews = [];
  
  // Star button selector logic
  starBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      activeRating = parseInt(btn.getAttribute('data-value'));
      updateStarUI(activeRating);
    });
  });
  
  function updateStarUI(rating) {
    starBtns.forEach(btn => {
      const val = parseInt(btn.getAttribute('data-value'));
      if (val <= rating) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }
  
  updateStarUI(activeRating);
  
  // Fetch reviews from SQL database on load
  function fetchReviews() {
    fetch('/api/reviews')
      .then(res => {
        if (!res.ok) throw new Error("Failed to load reviews from server.");
        return res.json();
      })
      .then(data => {
        reviews = data;
        renderReviews();
      })
      .catch(err => {
        console.error("Error loading reviews:", err);
        // Fallback reviews array in case backend server encounters issues
        reviews = [
          { name: "Sanjay Rao", title: "Family Visitor", rating: 5, text: "The trekking and the cottage package were absolutely incredible. The local food is cooked organically and reminds us of traditional home dishes." }
        ];
        renderReviews();
      });
  }
  
  // POST review to Express API
  reviewForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('review-name').value.trim();
    const message = document.getElementById('review-message').value.trim();
    const submitBtn = reviewForm.querySelector('button[type="submit"]');
    
    if (!name || !message) {
      showToast('Please fill in your name and message.', 'info');
      return;
    }
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Posting review...';
    
    fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, rating: activeRating, text: message })
    })
    .then(res => {
      if (!res.ok) throw new Error("Failed to submit review to SQL.");
      return res.json();
    })
    .then(savedReview => {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit Review';
      
      // Reset form
      reviewForm.reset();
      activeRating = 5;
      updateStarUI(activeRating);
      
      // Update local state list and re-render
      reviews.unshift(savedReview);
      renderReviews();
      
      showToast('Thank you! Review posted to SQL database.', 'success');
    })
    .catch(err => {
      console.error(err);
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit Review';
      showToast('Failed to save review to server.', 'info');
    });
  });
  
  function renderReviews() {
    slider.innerHTML = '';
    dotsContainer.innerHTML = '';
    
    if (reviews.length === 0) {
      slider.innerHTML = `
        <div class="review-slide">
          <div class="review-card" style="text-align: center;">
            <p class="review-text">No reviews posted yet. Be the first to write one!</p>
          </div>
        </div>
      `;
      return;
    }
    
    reviews.forEach((review, idx) => {
      let starsHtml = '';
      for (let i = 1; i <= 5; i++) {
        const starColor = i <= review.rating ? 'currentColor' : 'var(--border-color)';
        starsHtml += `
          <svg viewBox="0 0 24 24" style="color: ${starColor}; width: 18px; height: 18px; fill: ${i <= review.rating ? 'currentColor' : 'none'}; stroke: ${starColor}; stroke-width: 2;">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
          </svg>
        `;
      }
      
      const initials = review.name.split(' ').map(n => n[0]).join('').substring(0, 2);
      
      const slide = document.createElement('div');
      slide.className = 'review-slide';
      slide.innerHTML = `
        <div class="review-card">
          <div class="review-stars">${starsHtml}</div>
          <p class="review-text">${review.text}</p>
          <div class="review-author">
            <div class="review-avatar">${initials || 'V'}</div>
            <div>
              <h4 class="review-author-name">${review.name}</h4>
              <span class="review-author-title">${review.title}</span>
            </div>
          </div>
        </div>
      `;
      slider.appendChild(slide);
      
      const dot = document.createElement('div');
      dot.className = `dot ${idx === 0 ? 'active' : ''}`;
      dot.addEventListener('click', () => goToSlide(idx));
      dotsContainer.appendChild(dot);
    });
    
    goToSlide(0);
  }
  
  function goToSlide(index) {
    if (reviews.length === 0) return;
    activeIndex = index;
    slider.style.transform = `translateX(-${activeIndex * 100}%)`;
    
    const dots = dotsContainer.querySelectorAll('.dot');
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === index);
    });
  }
  
  let autoPlayTimer = setInterval(nextSlide, 7000);
  
  function nextSlide() {
    if (reviews.length === 0) return;
    goToSlide((activeIndex + 1) % reviews.length);
  }
  
  function resetAutoplay() {
    clearInterval(autoPlayTimer);
    autoPlayTimer = setInterval(nextSlide, 7000);
  }
  
  dotsContainer.addEventListener('click', resetAutoplay);
  
  // Trigger initial server load
  fetchReviews();
}

/* ==========================================================================
   8. Collapsible FAQ Accordion Toggle
   ========================================================================== */
function initFaqAccordion() {
  const faqQuestions = document.querySelectorAll('.faq-question');
  
  faqQuestions.forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const answer = item.querySelector('.faq-answer');
      const isActive = item.classList.contains('active');
      
      document.querySelectorAll('.faq-item').forEach(otherItem => {
        otherItem.classList.remove('active');
        otherItem.querySelector('.faq-answer').style.maxHeight = null;
      });
      
      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}

/* ==========================================================================
   9. Contact Form & Newsletter Submit Validation (Fullstack Integrated)
   ========================================================================== */
function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  const newsletterForm = document.getElementById('newsletter-form');
  
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const message = document.getElementById('contact-message').value.trim();
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    
    if (!name || !email || !message) {
      showToast('Please fill out all fields.', 'info');
      return;
    }
    
    if (!validateEmail(email)) {
      showToast('Please enter a valid email address.', 'info');
      return;
    }
    
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending Message...';
    
    // POST request to backend API to log messages in database
    fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, message })
    })
    .then(res => {
      if (!res.ok) throw new Error("Server error saving message.");
      return res.json();
    })
    .then(data => {
      showToast('Message logged in SQL! We will contact you soon.', 'success');
      contactForm.reset();
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    })
    .catch(err => {
      console.error(err);
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
      showToast('Failed to deliver message to database.', 'info');
    });
  });
  
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = newsletterForm.querySelector('input');
    
    showToast('Subscribed! Check your inbox for vouchers.', 'success');
    emailInput.value = '';
  });
  
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }
}

/* ==========================================================================
   10. Toast Notification Helper
   ========================================================================== */
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let iconHtml = '';
  if (type === 'success') {
    iconHtml = `
      <div class="toast-icon success">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>
    `;
  } else {
    iconHtml = `
      <div class="toast-icon info">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
        </svg>
      </div>
    `;
  }
  
  toast.innerHTML = `
    ${iconHtml}
    <div class="toast-body">${message}</div>
  `;
  
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add('active');
  }, 50);
  
  setTimeout(() => {
    toast.classList.remove('active');
    setTimeout(() => {
      toast.remove();
    }, 400);
  }, 4000);
}
