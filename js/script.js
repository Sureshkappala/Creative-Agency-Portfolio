/**
 * PixelCraft Studio — Vanilla JavaScript Engine
 * Modern, High-Performance, Interactive Behaviors
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initCounters();
  initScrollReveal();
  initModals();
  initAccordions();
  initNewsletter();
  initPageSpecific();
});

/* ==========================================================================
   1. Navigation & Mobile Drawer
   ========================================================================== */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const drawer = document.querySelector('.mobile-drawer');
  const backdrop = document.querySelector('.mobile-drawer-backdrop');
  const closeBtn = document.querySelector('.drawer-close-btn');

  // Sticky navbar shadow on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  }, { passive: true });

  // Highlight active nav link based on current page
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Mobile drawer controls
  function openDrawer() {
    hamburger?.classList.add('active');
    drawer?.classList.add('active');
    backdrop?.classList.add('active');
    document.body.classList.add('drawer-open');
    if (hamburger) hamburger.setAttribute('aria-expanded', 'true');
  }

  function closeDrawer() {
    hamburger?.classList.remove('active');
    drawer?.classList.remove('active');
    backdrop?.classList.remove('active');
    document.body.classList.remove('drawer-open');
    if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
  }

  hamburger?.addEventListener('click', () => {
    const isOpen = drawer?.classList.contains('active');
    if (isOpen) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  backdrop?.addEventListener('click', closeDrawer);
  closeBtn?.addEventListener('click', closeDrawer);

  // Close drawer when clicking any link inside it
  drawer?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // Close drawer on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer?.classList.contains('active')) {
      closeDrawer();
    }
  });
}

/* ==========================================================================
   2. Animated Number Counters
   ========================================================================== */
function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target') || el.innerText, 10);
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 1800;
        const start = 0;
        const startTime = performance.now();

        function updateCounter(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out expo
          const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
          const currentVal = Math.floor(easeProgress * (target - start) + start);
          el.innerText = `${currentVal}${suffix}`;

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            el.innerText = `${target}${suffix}`;
          }
        }

        requestAnimationFrame(updateCounter);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  counters.forEach(counter => observer.observe(counter));
}

/* ==========================================================================
   3. Scroll Reveal Animations
   ========================================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('[data-reveal]');
  if (!revealElements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, { threshold: 0.15 });

  revealElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   4. Toast Notification Utility
   ========================================================================== */
function showToast(message, type = 'info', duration = 4000) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let icon = '✨';
  if (type === 'success') icon = '✓';
  if (type === 'error') icon = '⚠';

  toast.innerHTML = `<span style="font-size:1.2rem; color:var(--color-orange);">${icon}</span> <span>${message}</span>`;
  container.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, duration);
}

/* ==========================================================================
   5. Modal Utility
   ========================================================================== */
function initModals() {
  document.querySelectorAll('[data-modal-open]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-modal-open');
      openModal(modalId);
    });
  });

  document.querySelectorAll('[data-modal-close]').forEach(btn => {
    btn.addEventListener('click', () => {
      const backdrop = btn.closest('.modal-backdrop');
      if (backdrop) closeModal(backdrop.id);
    });
  });

  // Close when clicking backdrop
  document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        closeModal(backdrop.id);
      }
    });
  });

  // Close modal on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const activeModal = document.querySelector('.modal-backdrop.active');
      if (activeModal) closeModal(activeModal.id);
    }
  });
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    document.body.classList.add('drawer-open');
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    document.body.classList.remove('drawer-open');
  }
}

/* ==========================================================================
   6. Accordions
   ========================================================================== */
function initAccordions() {
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isOpen = item.classList.contains('active');
      
      // Close all in this accordion
      const parent = item.parentElement;
      parent.querySelectorAll('.accordion-item').forEach(other => {
        other.classList.remove('active');
        const content = other.querySelector('.accordion-content');
        if (content) content.style.maxHeight = null;
      });

      if (!isOpen) {
        item.classList.add('active');
        const content = item.querySelector('.accordion-content');
        if (content) {
          content.style.maxHeight = content.scrollHeight + 'px';
        }
      }
    });
  });
}

/* ==========================================================================
   7. Newsletter Subscription
   ========================================================================== */
function initNewsletter() {
  document.querySelectorAll('.newsletter-form, .footer-newsletter-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('.newsletter-input, .footer-newsletter-input');
      const email = input ? input.value.trim() : '';

      if (!email || !validateEmail(email)) {
        showToast('Please enter a valid email address.', 'error');
        return;
      }

      showToast('Thank you for subscribing to Stackly updates!', 'success');
      form.reset();
    });
  });
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ==========================================================================
   8. Page-Specific Handlers
   ========================================================================== */
function initPageSpecific() {
  const page = window.location.pathname.split('/').pop() || 'index.html';

  if (page === 'services.html') initServicesPage();
  if (page === 'service-details.html') initServiceDetailsPage();
  if (page === 'portfolio.html') initPortfolioPage();
  if (page === 'project-details.html') initProjectDetailsPage();
  if (page === 'team.html') initTeamPage();
  if (page === 'team-details.html') initTeamDetailsPage();
  if (page === 'blog.html') initBlogPage();
  if (page === 'blog-details.html') initBlogDetailsPage();
  if (page === 'pricing.html') initPricingPage();
  if (page === 'contact.html') initContactPage();
  if (page === 'start-project.html') initStartProjectPage();
  if (page === 'login.html') initLoginPage();
  if (page === 'register.html') initRegisterPage();
  if (page === 'user-dashboard.html') initUserDashboard();
  if (page === 'admin-dashboard.html') initAdminDashboard();
  if (page === '404.html') init404Page();
}

/* --- Services Page Filtering & Search --- */
function initServicesPage() {
  const searchInput = document.getElementById('serviceSearchInput');
  const filterBtns = document.querySelectorAll('#serviceFilterBar .filter-btn');
  const serviceCards = document.querySelectorAll('.service-card-item');
  const countEl = document.getElementById('serviceResultCount');

  let activeCategory = 'all';
  let searchTerm = '';

  function filterServices() {
    let visibleCount = 0;
    serviceCards.forEach(card => {
      const category = card.getAttribute('data-category') || '';
      const title = card.querySelector('.service-card-title')?.innerText.toLowerCase() || '';
      const desc = card.querySelector('.service-card-desc')?.innerText.toLowerCase() || '';

      const matchesCat = activeCategory === 'all' || category.includes(activeCategory);
      const matchesSearch = !searchTerm || title.includes(searchTerm) || desc.includes(searchTerm);

      if (matchesCat && matchesSearch) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (countEl) countEl.innerText = `Showing ${visibleCount} services`;
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.getAttribute('data-filter') || 'all';
      filterServices();
    });
  });

  searchInput?.addEventListener('input', (e) => {
    searchTerm = e.target.value.toLowerCase().trim();
    filterServices();
  });
}

/* --- Service Details Dynamic Populator --- */
const SERVICES_DATA = {
  'brand-identity': {
    title: 'Brand Identity Design',
    badge: 'Branding & Positioning',
    desc: 'Craft an unforgettable brand persona that resonates globally. From comprehensive brand guidelines and tone of voice to tactile collateral and digital identity systems.',
    deliverables: ['Brand Guidelines & Stylebook', 'Color Palette & Typography System', 'Tone of Voice & Messaging Matrix', 'Collateral, Stationery & Pitch Decks', 'Asset Export Suite for Web, App & Print'],
    image: 'assets/images/service-brand-identity.webp'
  },
  'logo-design': {
    title: 'Logo Design',
    badge: 'Marks & Symbols',
    desc: 'Precision-crafted logos engineered for scalability, recognizability, and longevity. Designed to stand out on mobile screens, physical products, and architectural signage.',
    deliverables: ['Primary & Secondary Logo Marks', 'Responsive App Icons & Favicons', 'Monochrome & Reverse Variants', 'Vector Formats (SVG, EPS, PDF, PNG)', 'Logo Spacing & Safe-Zone Rules'],
    image: 'assets/images/service-logo-design.webp'
  },
  'website-design': {
    title: 'Website Design',
    badge: 'Web & UI/UX',
    desc: 'Award-winning digital experiences that merge high aesthetics with frictionless customer journeys. Tailored responsive layouts designed to elevate brand authority.',
    deliverables: ['High-Fidelity Figma Prototypes', 'Responsive Layouts (Mobile, Tablet, 4K)', 'Interactive Micro-Animations', 'Design Tokens & Component Library', 'Design Handoff Documentation'],
    image: 'assets/images/service-website-design.webp'
  },
  'web-development': {
    title: 'Website Development',
    badge: 'Engineering',
    desc: 'Cutting-edge frontend and full-stack development. Blazing-fast page speeds, SEO-optimized semantic markup, zero bloat, and smooth WebGL/canvas interactions.',
    deliverables: ['HTML5, CSS3 & Modern JavaScript Architecture', 'Sub-second Load Times (100% Lighthouse)', 'Accessible Semantic Code (WCAG 2.1 AA)', 'Headless CMS Integration', 'Cross-Browser & Multi-Device Testing'],
    image: 'assets/images/service-web-development.webp'
  },
  'ui-ux': {
    title: 'UI/UX Design',
    badge: 'Product Strategy',
    desc: 'Empathetic product design rooted in user psychology. We turn complex workflows into intuitive digital interfaces that drive engagement and retention.',
    deliverables: ['User Research & Journey Mapping', 'Information Architecture & Wireframes', 'Interactive Clickable Prototypes', 'Usability Testing & Feedback Loops', 'Design System Systematization'],
    image: 'assets/images/service-ui-ux.webp'
  },
  'graphic-design': {
    title: 'Graphic Design',
    badge: 'Visual Arts',
    desc: 'Visually arresting print, editorial, and digital design. From packaging and billboard takeovers to investor pitch decks and social editorial campaigns.',
    deliverables: ['Editorial Catalogs & Magazines', 'Marketing Banners & Social Creatives', 'Trade Show Displays & Banners', 'Infographics & Data Visualizations', 'Print Production-Ready Files'],
    image: 'assets/images/service-graphic-design.webp'
  },
  'social-marketing': {
    title: 'Social Media Marketing',
    badge: 'Growth & Content',
    desc: 'Trendsetting social media storytelling that cuts through algorithm clutter. High-impact video snippets, carousel narratives, and viral campaigns.',
    deliverables: ['Content Calendar & Grid Aesthetic', 'Custom Motion Graphics & Reels', 'Influencer Collaboration Framework', 'Community Engagement Protocols', 'Monthly Analytics & Growth Insights'],
    image: 'assets/images/service-social-marketing.webp'
  },
  'digital-marketing': {
    title: 'Digital Marketing',
    badge: 'Performance & Paid Media',
    desc: 'Precision data-backed growth campaigns. Combining conversion-rate optimization (CRO), search engine marketing, and multi-channel retargeting funnels.',
    deliverables: ['Performance Ad Creatives & Copy', 'Multi-Channel Funnel Architecture', 'A/B Testing & Conversion Rate Optimization', 'Google Ads & Meta Advertising Setup', 'Full attribution & ROI Reporting'],
    image: 'assets/images/service-digital-marketing.webp'
  },
  'motion-graphics': {
    title: 'Motion Graphics',
    badge: 'Animation & Kinetic UI',
    desc: 'Dynamic animations that captivate audiences. 2D/3D kinetic typography, animated product reveal videos, logo stings, and interactive web motion.',
    deliverables: ['Brand Reveal Animations', 'Kinetic Typography Promo Videos', 'Lottie / WebGL Animation Files', 'Social Media Motion Loops', 'Custom Sound Design Integration'],
    image: 'assets/images/service-motion-graphics.webp'
  },
  'photography': {
    title: 'Photography & Videography',
    badge: 'Commercial Production',
    desc: 'World-class studio and on-location photography. Capturing product details in hyper-crisp macro shots and crafting cinematic brand commercials.',
    deliverables: ['High-Resolution Product Lookbooks', 'Cinematic 4K Brand Anthems', 'Studio Lighting & Color Grading', 'Commercial Licensing Rights', 'Web-Optimized Image Delivery'],
    image: 'assets/images/service-photography.webp'
  },
  'packaging-design': {
    title: 'Packaging Design',
    badge: 'Industrial & Unboxing',
    desc: 'Tactile packaging solutions that create unforgettable unboxing rituals. Sustainable materials, bespoke structural die-cuts, and shelf-stopping typography.',
    deliverables: ['Structural Dielines & 3D Renders', 'Eco-Conscious Material Guidance', 'Foil, Emboss & Spot UV Specifications', 'Regulatory & Barcode Placement', 'Manufacturer-Ready Production Specs'],
    image: 'assets/images/service-packaging-design.webp'
  },
  'creative-strategy': {
    title: 'Creative Strategy',
    badge: 'Executive Advisory',
    desc: 'Guiding visionary founders and enterprise teams. Uncovering untapped market white spaces and steering creative decisions that yield exponential brand equity.',
    deliverables: ['Competitive Landscape Audit', 'Brand Positioning & Value Proposition', 'Cultural Trend Forecasting', 'Quarterly Creative Roadmaps', 'Executive Workshop Sessions'],
    image: 'assets/images/service-creative-strategy.webp'
  }
};

function initServiceDetailsPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const serviceKey = urlParams.get('service') || 'brand-identity';
  const service = SERVICES_DATA[serviceKey] || SERVICES_DATA['brand-identity'];

  const titleEl = document.getElementById('serviceDetailTitle');
  const badgeEl = document.getElementById('serviceDetailBadge');
  const descEl = document.getElementById('serviceDetailDesc');
  const imageEl = document.getElementById('serviceDetailImg');
  const deliverablesList = document.getElementById('serviceDetailDeliverables');
  const ctaBtn = document.getElementById('serviceDetailCta');

  if (titleEl) titleEl.innerText = service.title;
  if (badgeEl) badgeEl.innerText = service.badge;
  if (descEl) descEl.innerText = service.desc;
  if (imageEl) imageEl.src = service.image;
  if (ctaBtn) ctaBtn.href = `start-project.html?service=${encodeURIComponent(service.title)}`;

  if (deliverablesList) {
    deliverablesList.innerHTML = service.deliverables
      .map(item => `<li><span class="text-accent-orange">✓</span> ${item}</li>`)
      .join('');
  }
}

/* --- Portfolio Page Filtering & Search --- */
function initPortfolioPage() {
  const searchInput = document.getElementById('portfolioSearchInput');
  const filterBtns = document.querySelectorAll('#portfolioFilterBar .filter-btn');
  const projectCards = document.querySelectorAll('.project-card-item');
  const countEl = document.getElementById('portfolioResultCount');

  let activeCategory = 'all';
  let searchTerm = '';

  function filterProjects() {
    let count = 0;
    projectCards.forEach(card => {
      const category = (card.getAttribute('data-category') || '').toLowerCase();
      const title = card.querySelector('.project-title')?.innerText.toLowerCase() || '';
      const desc = card.querySelector('.project-desc')?.innerText.toLowerCase() || '';

      const matchesCat = activeCategory === 'all' || category.includes(activeCategory.toLowerCase());
      const matchesSearch = !searchTerm || title.includes(searchTerm) || desc.includes(searchTerm);

      if (matchesCat && matchesSearch) {
        card.style.display = 'flex';
        count++;
      } else {
        card.style.display = 'none';
      }
    });

    if (countEl) countEl.innerText = `Showing ${count} projects`;
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.getAttribute('data-filter') || 'all';
      filterProjects();
    });
  });

  searchInput?.addEventListener('input', (e) => {
    searchTerm = e.target.value.toLowerCase().trim();
    filterProjects();
  });
}

/* --- Project Details Case Study Populator --- */
const PROJECTS_DATA = {
  'portfolio-1': {
    title: 'Aura Spatial Audio',
    client: 'Aura Sound Labs (Demo Client)',
    category: 'Branding & Packaging',
    year: '2026',
    duration: '10 Weeks',
    overview: 'Aura Sound Labs is a pioneering acoustic hardware startup developing spatial audio headphones. PixelCraft Studio was commissioned to build the brand identity from the ground up, including physical unboxing packaging, 3D renders, and an interactive e-commerce launch site.',
    requirements: 'Create a minimalist yet emotionally resonant identity that conveys sonic precision and quiet luxury. The packaging required 100% recyclable molded fiber with custom metallic foil typography.',
    strategy: 'We rooted the visual language in acoustic wave theory. Using electric purple gradients paired with deep velvety obsidian, the system translates sound frequencies into fluid visual art.',
    tools: ['Figma', 'Blender 3D', 'Cinema 4D', 'Illustrator', 'Next.js'],
    results: [
      { metric: '+184%', label: 'Pre-order Conversion' },
      { metric: '42,000+', label: 'Waitlist Signups' },
      { metric: 'Red Dot', label: 'Design Award 2026' }
    ],
    mainImg: 'assets/images/portfolio-1.webp'
  },
  'portfolio-2': {
    title: 'Luminary Financial App',
    client: 'Luminary Fintech Corp (Demo Client)',
    category: 'UI/UX Design',
    year: '2026',
    duration: '12 Weeks',
    overview: 'Luminary sought to dismantle the intimidating aura of institutional wealth management. We crafted a radically intuitive mobile banking and multi-asset portfolio interface tailored for next-generation investors.',
    requirements: 'Transform complex algorithmic trading, crypto balances, and yield farming analytics into glanceable, visually rewarding UI cards that delight users.',
    strategy: 'Developed a high-contrast dark mode system with neon cyan data accents, biometric security flows, and haptic feedback micro-interactions.',
    tools: ['Figma', 'ProtoPie', 'TailwindCSS', 'WebGL Shaders'],
    results: [
      { metric: '4.9/5', label: 'App Store Rating' },
      { metric: '3.4x', label: 'Daily Session Time' },
      { metric: '$120M', label: 'Assets Tracked in Q1' }
    ],
    mainImg: 'assets/images/portfolio-2.webp'
  },
  'portfolio-3': {
    title: 'Vortex Autonomous Mobility',
    client: 'Vortex Motors Inc (Demo Client)',
    category: 'Website Design',
    year: '2025',
    duration: '8 Weeks',
    overview: 'An editorial interactive experience showcasing Vortex\'s flagship Level-4 autonomous electric sports sedan. Features real-time 3D vehicle configurator and cockpit walkthrough.',
    requirements: 'Deliver a desktop and mobile website that mimics the sensation of high-speed aerodynamism with zero lag.',
    strategy: 'Leveraged lightweight WebGL canvas rendering, smooth scroll pinning, and cinematic typographic layouts.',
    tools: ['Three.js', 'Figma', 'Webflow', 'GSAP'],
    results: [
      { metric: '2.1M', label: 'Global Page Views' },
      { metric: '+92%', label: 'Test Drive Bookings' },
      { metric: 'Awwwards', label: 'Site of the Day' }
    ],
    mainImg: 'assets/images/portfolio-3.webp'
  },
  'portfolio-4': {
    title: 'NeoKyoto Streetwear',
    client: 'NeoKyoto Collective (Demo Client)',
    category: 'Graphic Design',
    year: '2025',
    duration: '6 Weeks',
    overview: 'A limited-run cyberpunk streetwear apparel drop. PixelCraft designed typographic posters, holographic hangtags, augmented reality lookbooks, and garment graphic prints.',
    requirements: 'Blend traditional Japanese kanji calligraphy with futuristic brutalist layout systems and glowing neon gradients.',
    strategy: 'Synthesized vintage manga halftone patterns with electric risograph ink palettes for a distinctive subculture aesthetic.',
    tools: ['Photoshop', 'InDesign', 'Procreate', 'Screen-printing'],
    results: [
      { metric: 'Sold Out', label: 'In 48 Minutes' },
      { metric: '150k+', label: 'Instagram Impressions' },
      { metric: '98%', label: 'Positive Brand Sentiment' }
    ],
    mainImg: 'assets/images/portfolio-4.webp'
  },
  'portfolio-5': {
    title: 'Solstice Botanical Elixir',
    client: 'Solstice Organics (Demo Client)',
    category: 'Packaging Design',
    year: '2026',
    duration: '9 Weeks',
    overview: 'A premium line of adaptogenic sparkling botanical beverages packaged in sleek matte aluminum canisters with debossed botanical illustrations.',
    requirements: 'Stand out on Whole Foods and luxury boutique shelves with eco-conscious inks and tactile embossing.',
    strategy: 'Paired earth-toned emerald greens with luminous amber accents, celebrating organic ingredients with sophisticated restraint.',
    tools: ['Illustrator', 'Keyshot 3D', 'ESKO Studio', 'Figma'],
    results: [
      { metric: '1,400+', label: 'Retail Outlets Placed' },
      { metric: '+215%', label: 'First-Year Retail Velocity' },
      { metric: 'Dieline', label: 'Beverage Feature' }
    ],
    mainImg: 'assets/images/portfolio-5.webp'
  },
  'portfolio-6': {
    title: 'Pulse Worldwide Festival',
    client: 'Pulse Live Global (Demo Client)',
    category: 'Digital Marketing',
    year: '2026',
    duration: '7 Weeks',
    overview: 'Full digital marketing campaign, stage visual identities, and interactive lineup explorer for a premier 3-day electronic music festival in Amsterdam.',
    requirements: 'Drive ticket sales across 14 European countries while creating an unforgettable kinetic festival atmosphere.',
    strategy: 'Dynamic motion graphics responding to audio beats, countdown banner takeovers, and personalized artist schedule builders.',
    tools: ['After Effects', 'Figma', 'Meta Ads Manager', 'TikTok Creative'],
    results: [
      { metric: '85,000', label: 'Tickets Sold Out' },
      { metric: '14.2M', label: 'Social Video Views' },
      { metric: '4.2x', label: 'Blended ROAS' }
    ],
    mainImg: 'assets/images/portfolio-6.webp'
  }
};

function initProjectDetailsPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get('project') || 'portfolio-1';
  const project = PROJECTS_DATA[projectId] || PROJECTS_DATA['portfolio-1'];

  const titleEl = document.getElementById('projectCaseTitle');
  const clientEl = document.getElementById('projectCaseClient');
  const categoryEl = document.getElementById('projectCaseCategory');
  const yearEl = document.getElementById('projectCaseYear');
  const overviewEl = document.getElementById('projectCaseOverview');
  const reqEl = document.getElementById('projectCaseRequirements');
  const stratEl = document.getElementById('projectCaseStrategy');
  const toolsEl = document.getElementById('projectCaseTools');
  const metricsEl = document.getElementById('projectCaseMetrics');
  const heroImg = document.getElementById('projectCaseHeroImg');

  if (titleEl) titleEl.innerText = project.title;
  if (clientEl) clientEl.innerText = project.client;
  if (categoryEl) categoryEl.innerText = project.category;
  if (yearEl) yearEl.innerText = `${project.year} • ${project.duration}`;
  if (overviewEl) overviewEl.innerText = project.overview;
  if (reqEl) reqEl.innerText = project.requirements;
  if (stratEl) stratEl.innerText = project.strategy;
  if (heroImg) heroImg.src = project.mainImg;

  if (toolsEl) {
    toolsEl.innerHTML = project.tools
      .map(tool => `<span class="badge badge-purple" style="font-size:0.85rem; padding:0.4rem 0.85rem;">${tool}</span>`)
      .join('');
  }

  if (metricsEl) {
    metricsEl.innerHTML = project.results
      .map(res => `
        <div class="achievement-card" style="padding:1.75rem 1.25rem;">
          <div class="counter-value" style="font-size:2.4rem; color:var(--color-orange);">${res.metric}</div>
          <div class="counter-label" style="font-size:0.85rem;">${res.label}</div>
        </div>
      `)
      .join('');
  }
}

/* --- Team Page & Details --- */
const TEAM_DATA = {
  'elena-vance': {
    name: 'Elena Vance',
    role: 'Creative Director & Founder',
    bio: 'Elena has led brand identity and digital product strategy for over 14 years. A former senior director at Pentagram and R/GA, she founded PixelCraft Studio to build bespoke digital artifacts where typography, code, and emotion coalesce.',
    specialties: ['Creative Direction', 'Brand Narrative', 'Spatial Design', 'Executive Typography'],
    awards: ['Cannes Lions Gold (Design)', 'Awwwards Agency of the Year 2025', 'ADC Young Guns Award'],
    image: 'assets/images/team-1.webp'
  },
  'marcus-thorne': {
    name: 'Marcus Thorne',
    role: 'Lead UI/UX Designer',
    bio: 'Marcus turns multifaceted algorithmic platforms into elegant user journeys. Obsessed with micro-interactions, ergonomics, and design systems that scale effortlessly.',
    specialties: ['Design Systems', 'Micro-Interactions', 'Prototyping', 'Fintech & SaaS UX'],
    awards: ['Figma Community Spotlight', 'UX Design Award 2024'],
    image: 'assets/images/team-2.webp'
  },
  'sophia-chen': {
    name: 'Sophia Chen',
    role: 'Senior Brand Identity Strategist',
    bio: 'Sophia blends ethnographic research with fearless visual systems. She guides startups and heritage enterprises through transformative rebranding sprints.',
    specialties: ['Brand Architecture', 'Naming & Positioning', 'Packaging Systems', 'Print & Editorial'],
    awards: ['D&AD Wood Pencil', 'Graphis Design Platinum'],
    image: 'assets/images/team-3.webp'
  },
  'alex-rivera': {
    name: 'Alex Rivera',
    role: 'Lead Full-Stack Web Developer',
    bio: 'Alex is a creative technologist fluent in modern web stacks, WebGL, and headless CMS architectures. He guarantees pixel-perfection with sub-second speeds.',
    specialties: ['Full-Stack JavaScript', 'WebGL & Canvas Animation', 'Jamstack & Headless CMS', 'Performance Auditing'],
    awards: ['GitHub Star Contributor', 'Smashing Magazine Author'],
    image: 'assets/images/team-4.webp'
  },
  'liam-oconnor': {
    name: "Liam O'Connor",
    role: 'Commercial Photographer & Art Director',
    bio: 'Liam crafts cinematic visual campaigns with an uncompromising eye for light, macro textures, and spatial composition across product and editorial photography.',
    specialties: ['Product Macro Photography', 'Studio Lighting & Color Grading', 'Art Direction', 'Commercial Film'],
    awards: ['International Photography Awards 1st Place', 'PDN Photo Annual'],
    image: 'assets/images/team-5.webp'
  },
  'maya-patel': {
    name: 'Maya Patel',
    role: 'Digital Marketing & Content Lead',
    bio: 'Maya combines conversion-focused performance marketing with viral cultural storytelling, driving hyper-growth for global fashion and technology brands.',
    specialties: ['Growth Marketing', 'Viral Video Strategy', 'CRO & Funnel Optimization', 'Brand PR & Placement'],
    awards: ['Forbes 30 Under 30 Marketing', 'Adweek Rising Star'],
    image: 'assets/images/team-6.webp'
  }
};

function initTeamPage() {
  // Team cards are pre-populated with direct links to team-details.html?member=id
}

function initTeamDetailsPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const memberKey = urlParams.get('member') || 'elena-vance';
  const member = TEAM_DATA[memberKey] || TEAM_DATA['elena-vance'];

  const nameEl = document.getElementById('teamMemberName');
  const roleEl = document.getElementById('teamMemberRole');
  const bioEl = document.getElementById('teamMemberBio');
  const imageEl = document.getElementById('teamMemberImg');
  const skillsEl = document.getElementById('teamMemberSkills');
  const awardsEl = document.getElementById('teamMemberAwards');

  if (nameEl) nameEl.innerText = member.name;
  if (roleEl) roleEl.innerText = member.role;
  if (bioEl) bioEl.innerText = member.bio;
  if (imageEl) imageEl.src = member.image;

  if (skillsEl) {
    skillsEl.innerHTML = member.specialties
      .map(s => `<span class="badge badge-purple" style="font-size:0.85rem; padding:0.4rem 0.85rem;">${s}</span>`)
      .join('');
  }

  if (awardsEl) {
    awardsEl.innerHTML = member.awards
      .map(a => `<li style="font-size:0.95rem; color:#e2e2ec; margin-bottom:0.5rem;"><span class="text-accent-orange">🏆</span> ${a}</li>`)
      .join('');
  }
}

/* --- Blog Page Filtering & Search --- */
function initBlogPage() {
  const searchInput = document.getElementById('blogSearchInput');
  const filterBtns = document.querySelectorAll('#blogFilterBar .filter-btn');
  const blogCards = document.querySelectorAll('.blog-card-item');
  const countEl = document.getElementById('blogResultCount');

  let activeCat = 'all';
  let term = '';

  function filterBlogs() {
    let count = 0;
    blogCards.forEach(card => {
      const cat = (card.getAttribute('data-category') || '').toLowerCase();
      const title = card.querySelector('.blog-title')?.innerText.toLowerCase() || '';
      const desc = card.querySelector('.blog-desc')?.innerText.toLowerCase() || '';

      const matchCat = activeCat === 'all' || cat.includes(activeCat.toLowerCase());
      const matchSearch = !term || title.includes(term) || desc.includes(term);

      if (matchCat && matchSearch) {
        card.style.display = 'flex';
        count++;
      } else {
        card.style.display = 'none';
      }
    });

    if (countEl) countEl.innerText = `Showing ${count} articles`;
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCat = btn.getAttribute('data-filter') || 'all';
      filterBlogs();
    });
  });

  searchInput?.addEventListener('input', (e) => {
    term = e.target.value.toLowerCase().trim();
    filterBlogs();
  });
}

function initBlogDetailsPage() {
  const commentForm = document.getElementById('blogCommentForm');
  const commentList = document.getElementById('blogCommentList');
  const copyLinkBtn = document.getElementById('copyArticleLinkBtn');

  commentForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('commentName');
    const msgInput = document.getElementById('commentMessage');

    const name = nameInput ? nameInput.value.trim() : '';
    const message = msgInput ? msgInput.value.trim() : '';

    if (!name || !message) {
      showToast('Please fill in both your name and comment.', 'error');
      return;
    }

    const commentItem = document.createElement('div');
    commentItem.className = 'card';
    commentItem.style.padding = '1.25rem 1.5rem';
    commentItem.style.marginBottom = '1rem';
    commentItem.innerHTML = `
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.5rem;">
        <h5 style="color:#ffffff; font-size:1rem;">${escapeHtml(name)}</h5>
        <span style="font-size:0.75rem; color:var(--color-text-dim);">Just now</span>
      </div>
      <p style="font-size:0.92rem; color:var(--color-text-muted); margin-bottom:0;">${escapeHtml(message)}</p>
    `;

    commentList?.prepend(commentItem);
    commentForm.reset();
    showToast('Your comment has been posted (Demo simulation)!', 'success');
  });

  copyLinkBtn?.addEventListener('click', () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Article link copied to clipboard!', 'success');
  });
}

/* --- Pricing Page Monthly / Project Toggle --- */
function initPricingPage() {
  const toggle = document.getElementById('pricingToggle');
  const projectLabel = document.getElementById('projectPriceLabel');
  const monthlyLabel = document.getElementById('monthlyPriceLabel');
  
  const starterPrice = document.getElementById('priceStarter');
  const proPrice = document.getElementById('pricePro');
  const premiumPrice = document.getElementById('pricePremium');

  let isMonthly = false;

  toggle?.addEventListener('click', () => {
    isMonthly = !isMonthly;
    toggle.classList.toggle('toggled', isMonthly);

    if (isMonthly) {
      projectLabel?.classList.remove('active');
      monthlyLabel?.classList.add('active');
      if (starterPrice) starterPrice.innerHTML = '$950 <span style="font-size:1rem; font-weight:400; color:var(--color-text-muted);">/ mo</span>';
      if (proPrice) proPrice.innerHTML = '$2,450 <span style="font-size:1rem; font-weight:400; color:var(--color-text-muted);">/ mo</span>';
      if (premiumPrice) premiumPrice.innerHTML = '$4,950 <span style="font-size:1rem; font-weight:400; color:var(--color-text-muted);">/ mo</span>';
    } else {
      monthlyLabel?.classList.remove('active');
      projectLabel?.classList.add('active');
      if (starterPrice) starterPrice.innerHTML = '$1,899 <span style="font-size:1rem; font-weight:400; color:var(--color-text-muted);">/ project</span>';
      if (proPrice) proPrice.innerHTML = '$4,499 <span style="font-size:1rem; font-weight:400; color:var(--color-text-muted);">/ project</span>';
      if (premiumPrice) premiumPrice.innerHTML = '$9,899 <span style="font-size:1rem; font-weight:400; color:var(--color-text-muted);">/ project</span>';
    }
  });
}

/* --- Start a Project Form (Detailed Validation & File Attachment) --- */
function initStartProjectPage() {
  const form = document.getElementById('startProjectForm');
  const fileInput = document.getElementById('projectAttachment');
  const filePreview = document.getElementById('fileInfoPreview');
  const fileNameDisplay = document.getElementById('attachedFileName');
  const fileRemoveBtn = document.getElementById('fileRemoveBtn');

  // Pre-fill service from URL if provided
  const urlParams = new URLSearchParams(window.location.search);
  const preService = urlParams.get('service');
  if (preService) {
    const serviceSelect = document.getElementById('projectService');
    if (serviceSelect) {
      for (let i = 0; i < serviceSelect.options.length; i++) {
        if (serviceSelect.options[i].text.toLowerCase().includes(preService.toLowerCase())) {
          serviceSelect.selectedIndex = i;
          break;
        }
      }
    }
  }

  // Pre-fill package if provided
  const prePackage = urlParams.get('package');
  if (prePackage) {
    const descField = document.getElementById('projectDescription');
    if (descField) {
      descField.value = `Interested in the ${prePackage} Package. `;
    }
  }

  // File upload change
  fileInput?.addEventListener('change', () => {
    if (fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];
      const sizeKB = (file.size / 1024).toFixed(1);
      if (fileNameDisplay) fileNameDisplay.innerText = `${file.name} (${sizeKB} KB)`;
      filePreview?.classList.add('active');
    }
  });

  fileRemoveBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    if (fileInput) fileInput.value = '';
    filePreview?.classList.remove('active');
  });

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // 1. Full name validation
    const nameEl = document.getElementById('fullName');
    const nameVal = nameEl ? nameEl.value.trim() : '';
    if (!nameVal || nameVal.length < 2) {
      setFieldError('fullName', 'Please enter your full name (at least 2 characters).');
      isValid = false;
    } else {
      clearFieldError('fullName');
    }

    // 2. Email validation
    const emailEl = document.getElementById('emailAddress');
    const emailVal = emailEl ? emailEl.value.trim() : '';
    if (!emailVal || !validateEmail(emailVal)) {
      setFieldError('emailAddress', 'Please enter a valid email address.');
      isValid = false;
    } else {
      clearFieldError('emailAddress');
    }

    // 3. Mobile Number: exactly 10 digits
    const mobileEl = document.getElementById('mobileNumber');
    const mobileVal = mobileEl ? mobileEl.value.trim().replace(/\D/g, '') : '';
    if (mobileVal.length !== 10) {
      setFieldError('mobileNumber', 'Please enter exactly 10 digits mobile number.');
      isValid = false;
    } else {
      clearFieldError('mobileNumber');
    }

    // 4. Service Selection
    const serviceEl = document.getElementById('projectService');
    if (!serviceEl || !serviceEl.value) {
      setFieldError('projectService', 'Please select a service.');
      isValid = false;
    } else {
      clearFieldError('projectService');
    }

    // 5. Budget Range
    const budgetEl = document.getElementById('projectBudget');
    if (!budgetEl || !budgetEl.value) {
      setFieldError('projectBudget', 'Please select your estimated budget.');
      isValid = false;
    } else {
      clearFieldError('projectBudget');
    }

    // 6. Project Timeline
    const timelineEl = document.getElementById('projectTimeline');
    if (!timelineEl || !timelineEl.value) {
      setFieldError('projectTimeline', 'Please select an expected project timeline.');
      isValid = false;
    } else {
      clearFieldError('projectTimeline');
    }

    // 7. Project Description
    const descEl = document.getElementById('projectDescription');
    const descVal = descEl ? descEl.value.trim() : '';
    if (!descVal || descVal.length < 15) {
      setFieldError('projectDescription', 'Please describe your project (at least 15 characters).');
      isValid = false;
    } else {
      clearFieldError('projectDescription');
    }

    if (!isValid) {
      showToast('Please correct the highlighted fields before submitting.', 'error');
      return;
    }

    // Populate Success Modal summary
    const modalName = document.getElementById('modalSummaryName');
    const modalEmail = document.getElementById('modalSummaryEmail');
    const modalPhone = document.getElementById('modalSummaryPhone');
    const modalService = document.getElementById('modalSummaryService');
    const modalFile = document.getElementById('modalSummaryFile');

    if (modalName) modalName.innerText = nameVal;
    if (modalEmail) modalEmail.innerText = emailVal;
    if (modalPhone) modalPhone.innerText = mobileVal;
    if (modalService) modalService.innerText = serviceEl.options[serviceEl.selectedIndex].text;
    if (modalFile) {
      modalFile.innerText = (fileInput && fileInput.files[0]) ? fileInput.files[0].name : 'No attachment';
    }

    // Save demo inquiry into localStorage for Admin Dashboard!
    saveDemoInquiry({
      id: 'INQ-' + Math.floor(1000 + Math.random() * 9000),
      name: nameVal,
      email: emailVal,
      phone: mobileVal,
      service: serviceEl.options[serviceEl.selectedIndex].text,
      budget: budgetEl.options[budgetEl.selectedIndex].text,
      status: 'New',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    });

    openModal('inquirySuccessModal');
    form.reset();
    if (filePreview) filePreview.classList.remove('active');
  });
}

function setFieldError(fieldId, errorMsg) {
  const field = document.getElementById(fieldId);
  const group = field ? field.closest('.form-group') : null;
  if (group) {
    group.classList.add('has-error');
    const errorEl = group.querySelector('.form-error');
    if (errorEl) errorEl.innerText = errorMsg;
  }
}

function clearFieldError(fieldId) {
  const field = document.getElementById(fieldId);
  const group = field ? field.closest('.form-group') : null;
  if (group) {
    group.classList.remove('has-error');
  }
}

function saveDemoInquiry(inquiry) {
  try {
    const existing = JSON.parse(localStorage.getItem('pixelcraft_inquiries') || '[]');
    existing.unshift(inquiry);
    localStorage.setItem('pixelcraft_inquiries', JSON.stringify(existing));
  } catch (err) {
    console.warn('Storage error', err);
  }
}

/* --- Contact Page Form Validation --- */
function initContactPage() {
  const form = document.getElementById('contactForm');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    const nameVal = document.getElementById('contactName')?.value.trim();
    if (!nameVal || nameVal.length < 2) {
      setFieldError('contactName', 'Please enter your name.');
      isValid = false;
    } else {
      clearFieldError('contactName');
    }

    const emailVal = document.getElementById('contactEmail')?.value.trim();
    if (!emailVal || !validateEmail(emailVal)) {
      setFieldError('contactEmail', 'Please enter a valid email address.');
      isValid = false;
    } else {
      clearFieldError('contactEmail');
    }

    const phoneVal = document.getElementById('contactPhone')?.value.trim().replace(/\D/g, '');
    if (phoneVal.length !== 10) {
      setFieldError('contactPhone', 'Please enter a 10-digit mobile number.');
      isValid = false;
    } else {
      clearFieldError('contactPhone');
    }

    const subjectVal = document.getElementById('contactSubject')?.value.trim();
    if (!subjectVal) {
      setFieldError('contactSubject', 'Please enter a message subject.');
      isValid = false;
    } else {
      clearFieldError('contactSubject');
    }

    const msgVal = document.getElementById('contactMessage')?.value.trim();
    if (!msgVal || msgVal.length < 10) {
      setFieldError('contactMessage', 'Please provide a message (min 10 characters).');
      isValid = false;
    } else {
      clearFieldError('contactMessage');
    }

    if (!isValid) {
      showToast('Please correct form errors.', 'error');
      return;
    }

    showToast('Your message has been received! Our studio will respond within 24 hours.', 'success');
    form.reset();
  });
}

/* --- Login & Register Pages --- */
function initLoginPage() {
  const form = document.getElementById('loginForm');
  const togglePassBtn = document.getElementById('togglePassword');
  const passInput = document.getElementById('loginPassword');

  // Check if arriving from logout
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('logout') === 'true') {
    showToast('You have been logged out successfully.', 'info', 3500);
    try {
      window.history.replaceState({}, document.title, window.location.pathname);
    } catch (e) {}
  }

  togglePassBtn?.addEventListener('click', () => {
    const isPass = passInput.type === 'password';
    passInput.type = isPass ? 'text' : 'password';
    togglePassBtn.innerHTML = isPass ? '👁️‍🗨️' : '👁️';
  });

  // Demo Login Helper Buttons
  document.getElementById('demoUserBtn')?.addEventListener('click', () => {
    document.getElementById('loginEmail').value = 'user@pixelcraft.demo';
    passInput.value = 'UserPass2026!';
    document.getElementById('loginRole').value = 'User';
    clearFieldError('loginEmail');
    clearFieldError('loginPassword');
    showToast('Demo User credentials filled. Click "Sign In" to proceed.', 'info', 2500);
  });

  document.getElementById('demoAdminBtn')?.addEventListener('click', () => {
    document.getElementById('loginEmail').value = 'admin@pixelcraft.studio';
    passInput.value = 'AdminPass2026!';
    document.getElementById('loginRole').value = 'Admin';
    clearFieldError('loginEmail');
    clearFieldError('loginPassword');
    showToast('Demo Admin credentials filled. Click "Sign In" to proceed.', 'info', 2500);
  });

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail')?.value.trim();
    const pass = passInput?.value;
    const role = document.getElementById('loginRole')?.value || 'User';

    if (!email || !validateEmail(email)) {
      setFieldError('loginEmail', 'Please enter a valid email address.');
      return;
    } else {
      clearFieldError('loginEmail');
    }

    if (!pass || pass.length < 6) {
      setFieldError('loginPassword', 'Password must be at least 6 characters.');
      return;
    } else {
      clearFieldError('loginPassword');
    }

    showToast(`Welcome back! Logging in as ${role}...`, 'success');
    setTimeout(() => {
      if (role === 'Admin') {
        window.location.href = 'admin-dashboard.html';
      } else {
        window.location.href = 'user-dashboard.html';
      }
    }, 800);
  });
}

function initRegisterPage() {
  const form = document.getElementById('registerForm');
  const togglePassBtn = document.getElementById('toggleRegPassword');
  const passInput = document.getElementById('regPassword');
  const confirmPassInput = document.getElementById('regConfirmPassword');

  togglePassBtn?.addEventListener('click', () => {
    const isPass = passInput.type === 'password';
    passInput.type = isPass ? 'text' : 'password';
    confirmPassInput.type = isPass ? 'text' : 'password';
    togglePassBtn.innerHTML = isPass ? '👁️‍🗨️' : '👁️';
  });

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    const name = document.getElementById('regFullName')?.value.trim();
    if (!name || name.length < 2) {
      setFieldError('regFullName', 'Please enter your full name.');
      isValid = false;
    } else {
      clearFieldError('regFullName');
    }

    const email = document.getElementById('regEmail')?.value.trim();
    if (!email || !validateEmail(email)) {
      setFieldError('regEmail', 'Please enter a valid email.');
      isValid = false;
    } else {
      clearFieldError('regEmail');
    }

    const phone = document.getElementById('regPhone')?.value.trim().replace(/\D/g, '');
    if (phone.length !== 10) {
      setFieldError('regPhone', 'Phone number must be exactly 10 digits.');
      isValid = false;
    } else {
      clearFieldError('regPhone');
    }

    const pass = passInput?.value;
    if (!pass || pass.length < 6) {
      setFieldError('regPassword', 'Password must be at least 6 characters.');
      isValid = false;
    } else {
      clearFieldError('regPassword');
    }

    const confirmPass = confirmPassInput?.value;
    if (pass !== confirmPass) {
      setFieldError('regConfirmPassword', 'Passwords do not match.');
      isValid = false;
    } else {
      clearFieldError('regConfirmPassword');
    }

    const role = document.getElementById('regRole')?.value || 'User';

    if (!isValid) return;

    showToast(`Registration successful! Redirecting to ${role} workspace...`, 'success');
    setTimeout(() => {
      if (role === 'Admin') {
        window.location.href = 'admin-dashboard.html';
      } else {
        window.location.href = 'user-dashboard.html';
      }
    }, 1000);
  });
}

/* --- User Dashboard --- */
function initUserDashboard() {
  const navItems = document.querySelectorAll('.dashboard-sidebar .dashboard-nav-item');
  const panels = document.querySelectorAll('.dashboard-tab-panel');
  const sidebarToggle = document.getElementById('dashboardSidebarToggle');
  const sidebar = document.querySelector('.dashboard-sidebar');

  sidebarToggle?.addEventListener('click', (e) => {
    e.stopPropagation();
    sidebar?.classList.toggle('active');
  });

  document.addEventListener('click', (e) => {
    if (sidebar?.classList.contains('active') && !sidebar.contains(e.target) && !sidebarToggle?.contains(e.target)) {
      sidebar.classList.remove('active');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar?.classList.contains('active')) {
      sidebar.classList.remove('active');
    }
  });

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const target = item.getAttribute('data-tab');
      if (!target) return;

      navItems.forEach(n => n.classList.remove('active'));
      item.classList.add('active');

      panels.forEach(panel => {
        if (panel.id === target) {
          panel.classList.add('active');
        } else {
          panel.classList.remove('active');
        }
      });

      // Close mobile sidebar if open
      sidebar?.classList.remove('active');
    });
  });

  // Profile save demo
  const profileForm = document.getElementById('userProfileForm');
  profileForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Profile information updated successfully!', 'success');
  });

  // Project request save
  const newReqForm = document.getElementById('newProjectReqForm');
  newReqForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('New project inquiry submitted to studio art directors!', 'success');
    closeModal('newProjectModal');
  });

  // Handle Logout -> Open Login Page
  const logoutBtn = sidebar?.querySelector('.dashboard-logout-btn');
  logoutBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    try {
      localStorage.removeItem('pixelcraft_auth_user');
      sessionStorage.removeItem('pixelcraft_auth_session');
    } catch (err) {}
    window.location.href = 'login.html?logout=true';
  });
}

/* --- Admin Dashboard --- */
function initAdminDashboard() {
  const navItems = document.querySelectorAll('.dashboard-sidebar .dashboard-nav-item');
  const panels = document.querySelectorAll('.dashboard-tab-panel');
  const sidebarToggle = document.getElementById('adminSidebarToggle');
  const sidebar = document.querySelector('.dashboard-sidebar');

  // Handle Logout -> Open Login Page
  const adminLogoutBtn = sidebar?.querySelector('.dashboard-logout-btn');
  adminLogoutBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    try {
      localStorage.removeItem('pixelcraft_auth_admin');
      sessionStorage.removeItem('pixelcraft_auth_session');
    } catch (err) {}
    window.location.href = 'login.html?logout=true';
  });

  sidebarToggle?.addEventListener('click', (e) => {
    e.stopPropagation();
    sidebar?.classList.toggle('active');
  });

  document.addEventListener('click', (e) => {
    if (sidebar?.classList.contains('active') && !sidebar.contains(e.target) && !sidebarToggle?.contains(e.target)) {
      sidebar.classList.remove('active');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar?.classList.contains('active')) {
      sidebar.classList.remove('active');
    }
  });

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const target = item.getAttribute('data-tab');
      if (!target) return;

      navItems.forEach(n => n.classList.remove('active'));
      item.classList.add('active');

      panels.forEach(panel => {
        if (panel.id === target) {
          panel.classList.add('active');
        } else {
          panel.classList.remove('active');
        }
      });

      sidebar?.classList.remove('active');
    });
  });

  // Initialize Canvas Charts
  initAdminCharts();

  // Admin Project CRUD management
  initAdminProjectCrud();

  // Admin Inquiries management
  initAdminInquiries();
}

function initAdminCharts() {
  // Chart 1: Revenue Trend Line Chart
  const revCanvas = document.getElementById('revenueChartCanvas');
  if (revCanvas && revCanvas.getContext) {
    const ctx = revCanvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    revCanvas.width = revCanvas.offsetWidth * dpr;
    revCanvas.height = revCanvas.offsetHeight * dpr;
    ctx.scale(dpr, dpr);

    const w = revCanvas.offsetWidth;
    const h = revCanvas.offsetHeight;
    const padding = 40;

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
    const values = [28, 35, 42, 38, 55, 62, 58, 74, 82, 98]; // in thousands
    const maxVal = 110;

    // Grid lines
    ctx.strokeStyle = '#26263a';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = h - padding - (i / 4) * (h - padding * 2);
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(w - padding, y);
      ctx.stroke();

      ctx.fillStyle = '#686882';
      ctx.font = '11px Plus Jakarta Sans';
      ctx.fillText(`$${i * 25}k`, 8, y + 4);
    }

    // Points
    const points = values.map((val, idx) => {
      const x = padding + (idx / (values.length - 1)) * (w - padding * 2);
      const y = h - padding - (val / maxVal) * (h - padding * 2);
      return { x, y, label: months[idx], val };
    });

    // Draw Gradient Area
    const grad = ctx.createLinearGradient(0, padding, 0, h - padding);
    grad.addColorStop(0, 'rgba(139, 92, 246, 0.4)');
    grad.addColorStop(1, 'rgba(139, 92, 246, 0.0)');

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.lineTo(points[points.length - 1].x, h - padding);
    ctx.lineTo(points[0].x, h - padding);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Line
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Dots & Labels
    points.forEach(pt => {
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#ff5722';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#9e9eb4';
      ctx.font = '11px Plus Jakarta Sans';
      ctx.textAlign = 'center';
      ctx.fillText(pt.label, pt.x, h - 15);
    });
  }

  // Chart 2: Category Bar Chart
  const catCanvas = document.getElementById('categoryChartCanvas');
  if (catCanvas && catCanvas.getContext) {
    const ctx = catCanvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    catCanvas.width = catCanvas.offsetWidth * dpr;
    catCanvas.height = catCanvas.offsetHeight * dpr;
    ctx.scale(dpr, dpr);

    const w = catCanvas.offsetWidth;
    const h = catCanvas.offsetHeight;
    const padding = 35;

    const cats = ['Branding', 'Web Design', 'UI/UX', 'Marketing', 'Motion'];
    const counts = [18, 26, 22, 14, 11];
    const max = 30;

    const barWidth = (w - padding * 2) / cats.length - 20;

    cats.forEach((cat, i) => {
      const x = padding + i * ((w - padding * 2) / cats.length) + 10;
      const barHeight = (counts[i] / max) * (h - padding * 2);
      const y = h - padding - barHeight;

      const grad = ctx.createLinearGradient(0, y, 0, h - padding);
      grad.addColorStop(0, '#ff5722');
      grad.addColorStop(1, '#8b5cf6');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barHeight, [6, 6, 0, 0]);
      ctx.fill();

      // Value on top
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px Plus Jakarta Sans';
      ctx.textAlign = 'center';
      ctx.fillText(counts[i], x + barWidth / 2, y - 6);

      // Label below
      ctx.fillStyle = '#9e9eb4';
      ctx.font = '10px Plus Jakarta Sans';
      ctx.fillText(cat, x + barWidth / 2, h - 12);
    });
  }
}

let adminProjects = [
  { id: 'PRJ-101', title: 'Aura Spatial Audio', category: 'Branding', client: 'Aura Sound Labs', status: 'Completed', budget: '$18,500' },
  { id: 'PRJ-102', title: 'Luminary Mobile App', category: 'UI/UX Design', client: 'Luminary Fintech', status: 'In Progress', budget: '$32,000' },
  { id: 'PRJ-103', title: 'Vortex Autonomous', category: 'Website Design', client: 'Vortex Motors', status: 'Review', budget: '$24,500' },
  { id: 'PRJ-104', title: 'NeoKyoto Streetwear', category: 'Graphic Design', client: 'NeoKyoto Collective', status: 'Completed', budget: '$9,800' },
  { id: 'PRJ-105', title: 'Solstice Botanicals', category: 'Packaging', client: 'Solstice Organics', status: 'In Progress', budget: '$14,200' }
];

function initAdminProjectCrud() {
  const tableBody = document.getElementById('adminProjectsTableBody');
  const searchInput = document.getElementById('adminProjectSearch');
  const catFilter = document.getElementById('adminProjectCatFilter');
  const addForm = document.getElementById('adminAddProjectForm');
  const editForm = document.getElementById('adminEditProjectForm');

  // Load from localStorage if present
  try {
    const saved = localStorage.getItem('pixelcraft_admin_projects');
    if (saved) adminProjects = JSON.parse(saved);
  } catch (e) {}

  function renderProjects() {
    if (!tableBody) return;
    const term = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const cat = catFilter ? catFilter.value : 'all';

    const filtered = adminProjects.filter(p => {
      const matchSearch = !term || p.title.toLowerCase().includes(term) || p.client.toLowerCase().includes(term);
      const matchCat = cat === 'all' || p.category === cat;
      return matchSearch && matchCat;
    });

    if (!filtered.length) {
      tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:2rem; color:var(--color-text-dim);">No matching projects found.</td></tr>`;
      return;
    }

    tableBody.innerHTML = filtered.map(p => {
      let statusClass = 'status-new';
      if (p.status === 'Completed') statusClass = 'status-completed';
      if (p.status === 'In Progress') statusClass = 'status-in-progress';
      if (p.status === 'Review') statusClass = 'status-review';

      return `
        <tr>
          <td><strong>${p.id}</strong></td>
          <td>${escapeHtml(p.title)}</td>
          <td><span class="badge badge-purple">${escapeHtml(p.category)}</span></td>
          <td>${escapeHtml(p.client)}</td>
          <td><span class="status-pill ${statusClass}">${p.status}</span></td>
          <td style="text-align:right;">
            <button class="btn btn-outline btn-sm edit-proj-btn" data-id="${p.id}" style="padding:0.35rem 0.75rem; margin-right:0.35rem;">Edit</button>
            <button class="btn btn-outline btn-sm delete-proj-btn" data-id="${p.id}" style="padding:0.35rem 0.75rem; color:var(--color-rose); border-color:rgba(244,63,94,0.3);">Delete</button>
          </td>
        </tr>
      `;
    }).join('');

    // Attach row events
    tableBody.querySelectorAll('.edit-proj-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        openEditProjectModal(id);
      });
    });

    tableBody.querySelectorAll('.delete-proj-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        deleteProject(id);
      });
    });
  }

  function saveProjects() {
    try {
      localStorage.setItem('pixelcraft_admin_projects', JSON.stringify(adminProjects));
    } catch (e) {}
    renderProjects();
  }

  // Add Project
  addForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('addProjTitle')?.value.trim();
    const client = document.getElementById('addProjClient')?.value.trim();
    const category = document.getElementById('addProjCategory')?.value;
    const status = document.getElementById('addProjStatus')?.value;
    const budget = document.getElementById('addProjBudget')?.value.trim();

    if (!title || !client) {
      showToast('Please provide both title and client name.', 'error');
      return;
    }

    const newProj = {
      id: 'PRJ-' + Math.floor(100 + Math.random() * 900),
      title,
      client,
      category,
      status,
      budget: budget || '$15,000'
    };

    adminProjects.unshift(newProj);
    saveProjects();
    closeModal('addProjectModal');
    addForm.reset();
    showToast(`Project "${title}" added successfully!`, 'success');
  });

  // Edit Project
  function openEditProjectModal(id) {
    const proj = adminProjects.find(p => p.id === id);
    if (!proj) return;

    document.getElementById('editProjId').value = proj.id;
    document.getElementById('editProjTitle').value = proj.title;
    document.getElementById('editProjClient').value = proj.client;
    document.getElementById('editProjCategory').value = proj.category;
    document.getElementById('editProjStatus').value = proj.status;

    openModal('editProjectModal');
  }

  editForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('editProjId')?.value;
    const proj = adminProjects.find(p => p.id === id);
    if (!proj) return;

    proj.title = document.getElementById('editProjTitle')?.value.trim();
    proj.client = document.getElementById('editProjClient')?.value.trim();
    proj.category = document.getElementById('editProjCategory')?.value;
    proj.status = document.getElementById('editProjStatus')?.value;

    saveProjects();
    closeModal('editProjectModal');
    showToast(`Project ${id} updated!`, 'success');
  });

  // Delete Project with confirmation
  function deleteProject(id) {
    const proj = adminProjects.find(p => p.id === id);
    if (!proj) return;

    if (confirm(`Are you sure you want to delete project "${proj.title}" (${id})? This action cannot be undone.`)) {
      adminProjects = adminProjects.filter(p => p.id !== id);
      saveProjects();
      showToast(`Project ${id} removed.`, 'info');
    }
  }

  searchInput?.addEventListener('input', renderProjects);
  catFilter?.addEventListener('change', renderProjects);

  renderProjects();
}

function initAdminInquiries() {
  const tableBody = document.getElementById('adminInquiriesTableBody');
  if (!tableBody) return;

  let defaultInquiries = [
    { id: 'INQ-9421', name: 'James Sterling', email: 'james@sterling.co', phone: '5552345678', service: 'Brand Identity Design', budget: '$15k - $30k', status: 'New', date: 'Nov 10, 2026' },
    { id: 'INQ-9418', name: 'Claire Dufresne', email: 'claire@dufresne.design', phone: '5559876543', service: 'UI/UX Design', budget: '$30k - $50k', status: 'Under Review', date: 'Nov 09, 2026' },
    { id: 'INQ-9402', name: 'Tariq Al-Mansoor', email: 'tariq@novaenergy.io', phone: '5554321098', service: 'Website Development', budget: '$50k+', status: 'Quoted', date: 'Nov 08, 2026' }
  ];

  try {
    const saved = localStorage.getItem('pixelcraft_inquiries');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.length) defaultInquiries = parsed;
    }
  } catch (e) {}

  function renderInquiries() {
    tableBody.innerHTML = defaultInquiries.map(inq => `
      <tr>
        <td><strong>${inq.id}</strong></td>
        <td>
          <div style="font-weight:700; color:#fff;">${escapeHtml(inq.name)}</div>
          <div style="font-size:0.8rem; color:var(--color-text-dim);">${escapeHtml(inq.email)} • ${inq.phone}</div>
        </td>
        <td><span class="badge badge-purple">${escapeHtml(inq.service)}</span></td>
        <td>${escapeHtml(inq.budget)}</td>
        <td>
          <select class="form-control inquiry-status-select" data-id="${inq.id}" style="padding:0.35rem 0.75rem; font-size:0.85rem; width:auto;">
            <option value="New" ${inq.status === 'New' ? 'selected' : ''}>New</option>
            <option value="Under Review" ${inq.status === 'Under Review' ? 'selected' : ''}>Under Review</option>
            <option value="Quoted" ${inq.status === 'Quoted' ? 'selected' : ''}>Quoted</option>
            <option value="Closed" ${inq.status === 'Closed' ? 'selected' : ''}>Closed</option>
          </select>
        </td>
        <td style="font-size:0.85rem; color:var(--color-text-muted);">${inq.date}</td>
      </tr>
    `).join('');

    tableBody.querySelectorAll('.inquiry-status-select').forEach(select => {
      select.addEventListener('change', () => {
        const id = select.getAttribute('data-id');
        const target = defaultInquiries.find(i => i.id === id);
        if (target) {
          target.status = select.value;
          try {
            localStorage.setItem('pixelcraft_inquiries', JSON.stringify(defaultInquiries));
          } catch (e) {}
          showToast(`Inquiry ${id} updated to "${select.value}"`, 'success');
        }
      });
    });
  }

  renderInquiries();
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>"']/g, (m) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }[m]));
}

/* --- 404 Error Page Interactive Search --- */
function init404Page() {
  const searchInput = document.getElementById('errorSearchInput');
  const searchBtn = document.getElementById('errorSearchBtn');
  const resultsContainer = document.getElementById('errorSearchResults');
  if (!searchInput || !resultsContainer) return;

  const DIRECTORY = [
    { title: 'Brand Identity Design', category: 'Services', url: 'service-details.html?service=brand-identity' },
    { title: 'Logo Design & Positioning', category: 'Services', url: 'service-details.html?service=logo-design' },
    { title: 'Website Design & UI/UX', category: 'Services', url: 'service-details.html?service=website-design' },
    { title: 'Website Development & WebGL', category: 'Services', url: 'service-details.html?service=website-development' },
    { title: 'All 12 Studio Disciplines', category: 'Services', url: 'services.html' },
    { title: 'Aura Spatial Audio Case Study', category: 'Portfolio', url: 'project-details.html?project=portfolio-1' },
    { title: 'Portfolio Project Showcase', category: 'Portfolio', url: 'portfolio.html' },
    { title: 'Meet Our Creative Team', category: 'Team', url: 'team.html' },
    { title: 'Elena Vance — Creative Director', category: 'Team', url: 'team-details.html?member=elena-vance' },
    { title: 'Marcus Thorne — Lead UI/UX', category: 'Team', url: 'team-details.html?member=marcus-thorne' },
    { title: 'Pricing & Creative Packages', category: 'Pricing', url: 'pricing.html' },
    { title: 'Studio Journal & Design Trends', category: 'Blog', url: 'blog.html' },
    { title: 'Start a Project Inquiry', category: 'Inquiry', url: 'start-project.html' },
    { title: 'Client & Admin Login', category: 'Auth', url: 'login.html' },
    { title: 'Contact Coordinates & Office', category: 'Contact', url: 'contact.html' },
    { title: 'Agency Homepage', category: 'Navigation', url: 'index.html' }
  ];

  function performSearch() {
    const q = searchInput.value.trim().toLowerCase();
    if (!q) {
      resultsContainer.classList.remove('active');
      resultsContainer.innerHTML = '';
      return;
    }

    const matches = DIRECTORY.filter(item => 
      item.title.toLowerCase().includes(q) || item.category.toLowerCase().includes(q)
    );

    if (matches.length > 0) {
      resultsContainer.innerHTML = matches.map(m => `
        <a href="${m.url}" class="error-search-item">
          <span>${m.title}</span>
          <span class="badge badge-purple" style="font-size:0.75rem;">${m.category}</span>
        </a>
      `).join('');
      resultsContainer.classList.add('active');
    } else {
      resultsContainer.innerHTML = `
        <div style="padding:0.75rem 1rem; color:var(--color-text-dim); font-size:0.85rem;">
          No matching pages found. Try "services", "team", "pricing", or <a href="index.html" style="color:var(--color-orange); text-decoration:underline;">go home</a>.
        </div>
      `;
      resultsContainer.classList.add('active');
    }
  }

  searchInput.addEventListener('input', performSearch);
  searchBtn?.addEventListener('click', performSearch);

  // Close results when clicking outside
  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !resultsContainer.contains(e.target) && !searchBtn?.contains(e.target)) {
      resultsContainer.classList.remove('active');
    }
  });

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const firstLink = resultsContainer.querySelector('a.error-search-item');
      if (firstLink) {
        window.location.href = firstLink.getAttribute('href');
      } else {
        performSearch();
      }
    }
  });
}
