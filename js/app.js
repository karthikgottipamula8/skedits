/**
 * SK EDITS — Dedicated Short-Form Video Editing for Coaches
 * Interactive Logic:
 * 1. CardNav Component (React Bits / GSAP)
 * 2. DepthCarousel 3D Component (React Bits / GSAP)
 * 3. Portfolio "See All" Paginated Grid View (4 Videos per Page)
 * 4. Video Modal with Local & Google Drive Video Playback
 * 5. Scroll-Driven Reveal Animations (IntersectionObserver)
 * 6. Countdown Timer (₹499 with 1-Month Commitment Offer)
 * 7. Before/After Split Comparison Slider (AI Coach Portrait)
 * 8. On-Page Booking Pop-Up Modal (Pre-filled ₹499 Offer)
 * 9. FAQ Accordion & Contact Forms
 * 10. Social Proof Conversion Toasts & Floating WhatsApp Button
 */

document.addEventListener('DOMContentLoaded', () => {
  initAuroraCanvas();
  initCardNav();
  initCountUp();
  initDepthCarousel();
  initPortfolioPagination();
  initServicesMobileSwipe();
  initFlowingMenu();
  initVideoModal();
  initScrollReveal();
  initOfferCountdown();
  initBeforeAfterSlider();
  initBookingModal();
  initFaqAccordion();
  initContactFormAndWhatsApp();
  initSocialProofToasts();
  initFloatingWhatsApp();
});

/* ==========================================================================
   VIDEO DATA STORE (User's Local Videos + Google Drive Embeds)
   ========================================================================== */
const PORTFOLIO_VIDEOS = [
  // HERO & FEATURED REEL
  {
    id: 'video-hero',
    title: 'High-Retention Short-Form Reel',
    subtitle: 'Timeline 1 Master Edit • Engineered for Viral Watch-Time & Growth',
    category: 'Featured Coach Reel',
    categoryGroup: 'coaches',
    badge: 'Hero Reel',
    duration: '0:35',
    type: 'local',
    src: 'assets/videos/timeline_1.mp4',
    poster: 'assets/thumb_hero_reel.jpg',
    tags: ['Hook Retention', 'DaVinci Graded', 'Viral SFX']
  },

  // REAL ESTATE CATEGORY
  {
    id: 'video-re-1',
    title: 'Luxury Villa Architectural Walkthrough',
    subtitle: 'Dynamic speed ramps, ambient foley sound design & 4K grading',
    category: 'Luxury Real Estate',
    categoryGroup: 'real_estate',
    badge: 'Real Estate',
    duration: '0:48',
    type: 'local',
    src: 'assets/videos/monarch butterfly edit.mp4',
    poster: 'assets/thumb_monarch.jpg',
    tags: ['Architectural', 'Speed Ramps', 'Luxury Listing']
  },
  {
    id: 'video-re-2',
    title: 'High-ROI Commercial Investment Pitch',
    subtitle: '3D animated floorplan tracking & keyframe callouts for investors',
    category: 'Commercial Property',
    categoryGroup: 'real_estate',
    badge: 'Investor Hook',
    duration: '0:36',
    type: 'local',
    src: 'assets/videos/post.mp4',
    poster: 'assets/thumb_post.jpg',
    tags: ['3D Floorplan', 'Investor Pitch', 'Property Hook']
  },
  {
    id: 'video-re-3',
    title: 'Top Producer Realtor Brand Reel',
    subtitle: 'Market statistics breakdown with punchy captions & neighborhood drone cutaways',
    category: 'Agent Branding',
    categoryGroup: 'real_estate',
    badge: 'Realtor Brand',
    duration: '0:44',
    type: 'local',
    src: 'assets/videos/hero_reel.mp4',
    poster: 'assets/thumb_hero_reel.jpg',
    tags: ['Realtor Brand', 'Market Stats', 'Viral Captions']
  },

  // COACHES CATEGORY
  {
    id: 'video-2',
    title: 'Client Acquisition Post Hook',
    subtitle: 'First 3-second retention formula with punchy captions',
    category: 'Business & Scaling',
    categoryGroup: 'coaches',
    badge: 'Lead Gen Hook',
    duration: '0:38',
    type: 'local',
    src: 'assets/videos/post.mp4',
    poster: 'assets/thumb_post.jpg',
    tags: ['3s Hook', 'Lead Magnet', 'Hormozi Captions']
  },
  {
    id: 'video-3',
    title: 'Executive Mindset & High-Ticket Authority',
    subtitle: 'Crisp audio cleanup, subtitle highlights, and 3D step callouts',
    category: 'Executive & Career',
    categoryGroup: 'coaches',
    badge: 'Authority Reel',
    duration: '0:45',
    type: 'gdrive',
    src: 'https://drive.google.com/file/d/1s4gjkHy9xTqHq3y6bMDf9XYr0a5exaO1/preview',
    poster: 'assets/thumb_executive.jpg',
    tags: ['3D Callouts', 'Authority', 'Studio Grade']
  },
  {
    id: 'video-4',
    title: '1.5x Revenue Scaling Case Study',
    subtitle: 'Direct callout graphics, charts and high-converting lead magnet CTA',
    category: 'Business Coach',
    categoryGroup: 'coaches',
    badge: 'Case Study',
    duration: '0:48',
    type: 'gdrive',
    src: 'https://drive.google.com/file/d/1hsX4WZIpOtau2QzoPJexw1KlYGWtjzwm/preview',
    poster: 'assets/thumb_revenue.jpg',
    tags: ['Revenue Charts', 'Funnel CTA', 'High-Ticket']
  },
  {
    id: 'video-6',
    title: 'Diet Myth Buster & Energy SFX',
    subtitle: 'Fast-paced cuts with food b-roll cutaways and studio sound design',
    category: 'Fitness Mentor',
    categoryGroup: 'coaches',
    badge: 'Fitness & Health',
    duration: '0:42',
    type: 'local',
    src: 'assets/videos/post.mp4',
    poster: 'assets/thumb_post.jpg',
    tags: ['B-Roll Cutaway', 'SFX', 'Punch-Ins']
  },
  {
    id: 'video-5',
    title: 'Live Cohort Launch Teaser',
    subtitle: 'High urgency motion graphics, calendar countdown & student wins',
    category: 'Launch Promo',
    categoryGroup: 'coaches',
    badge: 'Masterclass Teaser',
    duration: '0:30',
    type: 'gdrive',
    src: 'https://drive.google.com/file/d/1Vcwtb90qaYPLdpwZKB8nmBw3MSw5RxOZ/preview',
    poster: 'assets/thumb_launch.jpg',
    tags: ['Launch Teaser', 'Countdown', 'Enrollment']
  },

  // OTHERS CATEGORY
  {
    id: 'video-1',
    title: 'Monarch Butterfly Cinematic Reel',
    subtitle: 'Dynamic speed ramps, visual overlays, sound design',
    category: 'Cinematic Reel',
    categoryGroup: 'others',
    badge: 'Cinematic Reel',
    duration: '0:52',
    type: 'local',
    src: 'assets/videos/monarch butterfly edit.mp4',
    poster: 'assets/thumb_monarch.jpg',
    tags: ['Speed Ramps', 'Sound FX', 'Viral Pacing']
  },
  {
    id: 'video-oth-2',
    title: 'Cyberpunk Apparel Brand Teaser',
    subtitle: 'Neon vector tracking, hyperlapse transitions & kinetic audio foley',
    category: 'Brand Commercial',
    categoryGroup: 'others',
    badge: 'Brand Teaser',
    duration: '0:35',
    type: 'local',
    src: 'assets/videos/post.mp4',
    poster: 'assets/thumb_post.jpg',
    tags: ['Hyperlapse', 'Neon Tracking', 'Foley SFX']
  },
  {
    id: 'video-oth-3',
    title: 'Next-Gen Tech Gadget Showcase',
    subtitle: 'Seamless camera whip pans, macro lens zooms & visual rhythm',
    category: 'Product Launch',
    categoryGroup: 'others',
    badge: 'Tech Showcase',
    duration: '0:40',
    type: 'local',
    src: 'assets/videos/hero_reel.mp4',
    poster: 'assets/thumb_hero_reel.jpg',
    tags: ['Macro Zoom', 'Whip Pans', 'Visual Rhythm']
  }
];

/* ==========================================================================
   1. CARDNAV COMPONENT (React Bits / GSAP Timeline Animation)
   ========================================================================== */
function initCardNav() {
  const navContainer = document.querySelector('.card-nav-container');
  const navEl = document.getElementById('card-nav-el');
  const hamburger = document.getElementById('card-nav-hamburger');
  const cards = document.querySelectorAll('.nav-card');
  const navLinks = document.querySelectorAll('.nav-card-link');

  if (!navEl || !hamburger || !cards.length) return;

  let isHamburgerOpen = false;
  let isExpanded = false;
  let tl = null;

  const calculateHeight = () => {
    if (!navEl) return 260;
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (isMobile) {
      const contentEl = navEl.querySelector('.card-nav-content');
      if (contentEl) {
        const wasVisible = contentEl.style.visibility;
        const wasPointerEvents = contentEl.style.pointerEvents;
        const wasPosition = contentEl.style.position;
        const wasHeight = contentEl.style.height;

        contentEl.style.visibility = 'visible';
        contentEl.style.pointerEvents = 'auto';
        contentEl.style.position = 'static';
        contentEl.style.height = 'auto';

        contentEl.offsetHeight;

        const topBar = 60;
        const padding = 20;
        const contentHeight = contentEl.scrollHeight;

        contentEl.style.visibility = wasVisible;
        contentEl.style.pointerEvents = wasPointerEvents;
        contentEl.style.position = wasPosition;
        contentEl.style.height = wasHeight;

        return topBar + contentHeight + padding;
      }
    }
    return 260;
  };

  const createTimeline = () => {
    if (typeof gsap === 'undefined') return null;

    gsap.set(navEl, { height: 60, overflow: 'hidden' });
    gsap.set(cards, { y: 50, opacity: 0 });

    const timeline = gsap.timeline({ paused: true });

    timeline.to(navEl, {
      height: calculateHeight,
      duration: 0.4,
      ease: 'power3.out'
    });

    timeline.to(cards, {
      y: 0,
      opacity: 1,
      duration: 0.4,
      ease: 'power3.out',
      stagger: 0.08
    }, '-=0.1');

    return timeline;
  };

  tl = createTimeline();

  const toggleMenu = () => {
    if (!tl) {
      tl = createTimeline();
      if (!tl) return;
    }

    if (!isExpanded) {
      isHamburgerOpen = true;
      isExpanded = true;
      hamburger.classList.add('open');
      hamburger.setAttribute('aria-expanded', 'true');
      navEl.classList.add('open');
      tl.play(0);
    } else {
      isHamburgerOpen = false;
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      tl.eventCallback('onReverseComplete', () => {
        isExpanded = false;
        navEl.classList.remove('open');
      });
      tl.reverse();
    }
  };

  hamburger.addEventListener('click', toggleMenu);
  hamburger.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleMenu();
    }
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (isExpanded) toggleMenu();
    });
  });

  document.addEventListener('click', (e) => {
    if (isExpanded && navContainer && !navContainer.contains(e.target)) {
      toggleMenu();
    }
  });

  window.addEventListener('resize', () => {
    if (!tl) return;
    if (isExpanded) {
      const newHeight = calculateHeight();
      gsap.set(navEl, { height: newHeight });
      tl.kill();
      tl = createTimeline();
      if (tl) tl.progress(1);
    } else {
      tl.kill();
      tl = createTimeline();
    }
  });
}

/* ==========================================================================
   2. DEPTH CAROUSEL 3D COMPONENT (React Bits / GSAP)
   ========================================================================== */
function initDepthCarousel() {
  const root = document.getElementById('portfolio-depth-carousel');
  if (!root) return;

  const cardEls = root.querySelectorAll('.depth-carousel__card');
  const dotEls = root.querySelectorAll('.depth-carousel__dot');
  const prevBtn = root.querySelector('.depth-carousel__arrow--prev');
  const nextBtn = root.querySelector('.depth-carousel__arrow--next');

  const count = cardEls.length;
  if (!count) return;

  const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

  const cfg = {
    count,
    depth: 220,
    spread: 90,
    tilt: 22,
    tiltDirection: 'right',
    visibleCards: 4,
    falloff: 0.2,
    blur: 6,
    duration: 700,
    ease: 'power3.out',
    loop: true,
    cardWidth: 320,
    autoplay: true,
    autoplayDelay: 3500
  };

  let pos = 0;
  let focus = 0;
  let scale = 1;
  let tween = null;
  let drag = null;
  let autoTimer = null;
  let wheelTimer = null;
  let hovered = false;

  function layout(currentPos) {
    const dir = cfg.tiltDirection === 'left' ? -1 : 1;
    const sc = scale;

    for (let i = 0; i < count; i++) {
      const el = cardEls[i];
      if (!el) continue;

      let d = i - currentPos;
      if (cfg.loop && count > 1) {
        d = ((d % count) + count) % count;
        if (d > count / 2) d -= count;
      }

      const back = Math.max(0, d);
      const az = Math.abs(d);
      const shown = az <= cfg.visibleCards + 0.5;

      const tz = -cfg.depth * d;
      const tx = dir * cfg.spread * d;
      const ry = dir * cfg.tilt * clamp(d, 0, 1);

      let opacity = d < 0 ? Math.max(0, 1 + d) : 1;
      if (!shown) opacity = 0;

      const brightness = Math.max(0.15, 1 - back * cfg.falloff);
      const blurPx = cfg.blur > 0 ? Math.min(cfg.blur, (back / Math.max(1, cfg.visibleCards)) * cfg.blur) : 0;
      const zi = Math.round(2000 - d * 20);

      el.style.transform = `translate(-50%, -50%) scale(${sc}) translateX(${tx.toFixed(2)}px) translateZ(${tz.toFixed(2)}px) rotateY(${ry.toFixed(3)}deg)`;
      el.style.opacity = opacity.toFixed(3);
      el.style.filter = `brightness(${brightness.toFixed(3)}) blur(${blurPx.toFixed(2)}px)`;
      el.style.zIndex = String(zi);
      el.style.pointerEvents = shown && opacity > 0.05 ? 'auto' : 'none';

      const ov = el.querySelector('.depth-carousel__tint');
      if (ov) ov.style.opacity = clamp(back * cfg.falloff * 1.25, 0, 0.86).toFixed(3);
    }
  }

  function notify(idx) {
    dotEls.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === idx);
      dot.setAttribute('aria-selected', i === idx ? 'true' : 'false');
    });
    cardEls.forEach((card, i) => {
      card.classList.toggle('is-focused', i === idx);
      card.setAttribute('aria-hidden', i === idx ? 'false' : 'true');
    });
  }

  function tweenTo(target, animate) {
    if (tween) tween.kill();
    const proxy = { p: pos };
    const dur = animate ? cfg.duration / 1000 : 0;

    if (typeof gsap !== 'undefined') {
      tween = gsap.to(proxy, {
        p: target,
        duration: dur,
        ease: cfg.ease,
        onUpdate: () => {
          pos = proxy.p;
          layout(pos);
        },
        onComplete: () => {
          if (count > 0) pos = ((pos % count) + count) % count;
          layout(pos);
        }
      });
    } else {
      pos = target;
      layout(pos);
    }
  }

  function setFocus(rawIndex, animate = true) {
    const idx = cfg.loop ? ((rawIndex % count) + count) % count : clamp(rawIndex, 0, count - 1);
    let delta = idx - pos;
    if (cfg.loop && count > 1) {
      delta = ((delta % count) + count) % count;
      if (delta > count / 2) delta -= count;
    }
    tweenTo(pos + delta, animate);
    if (idx !== focus) {
      focus = idx;
      notify(idx);
    }
  }

  function navigateBy(step) {
    setFocus(focus + step, true);
  }

  // Pointer drag & swipe support
  root.addEventListener('pointerdown', (e) => {
    if (count < 2) return;
    if (tween) tween.kill();
    drag = {
      x: e.clientX,
      startPos: pos,
      lastX: e.clientX,
      lastT: performance.now(),
      v: 0,
      moved: false,
      id: e.pointerId
    };
  });

  window.addEventListener('pointermove', (e) => {
    if (!drag) return;
    const stepPx = Math.max(cfg.cardWidth * 0.55 * scale, 40);
    const dx = e.clientX - drag.x;
    if (!drag.moved && Math.abs(dx) > 4) {
      drag.moved = true;
      try { root.setPointerCapture(drag.id); } catch (_) {}
    }
    if (!drag.moved) return;
    const now = performance.now();
    const dt = Math.max(now - drag.lastT, 1);
    drag.v = (e.clientX - drag.lastX) / dt;
    drag.lastX = e.clientX;
    drag.lastT = now;
    pos = drag.startPos - dx / stepPx;
    layout(pos);
  });

  const onPointerEnd = () => {
    if (!drag) return;
    const wasMoved = drag.moved;
    const stepPx = Math.max(cfg.cardWidth * 0.55 * scale, 40);
    const projected = pos - (drag.v * 180) / stepPx;
    drag = null;
    if (wasMoved) {
      setFocus(Math.round(projected), true);
    }
  };

  window.addEventListener('pointerup', onPointerEnd);
  window.addEventListener('pointercancel', onPointerEnd);

  // Wheel listener
  root.addEventListener('wheel', (e) => {
    if (count < 2) return;
    e.preventDefault();
    if (tween) tween.kill();
    const raw = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    const delta = e.deltaMode === 1 ? raw * 24 : raw;
    const step = clamp(delta / (cfg.cardWidth * 0.9), -0.6, 0.6);
    pos += step;
    layout(pos);
    if (wheelTimer) clearTimeout(wheelTimer);
    wheelTimer = setTimeout(() => setFocus(Math.round(pos), true), 130);
  }, { passive: false });

  // Keyboard navigation
  root.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      navigateBy(-1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      navigateBy(1);
    }
  });

  // Card Clicks
  cardEls.forEach((card, i) => {
    card.addEventListener('click', () => {
      if (drag && drag.moved) return;
      if (i === focus) {
        // Open Video Modal
        const videoId = card.getAttribute('data-video-id');
        openVideoModalById(videoId);
      } else {
        setFocus(i, true);
      }
    });
  });

  // Controls
  if (prevBtn) prevBtn.addEventListener('click', () => navigateBy(-1));
  if (nextBtn) nextBtn.addEventListener('click', () => navigateBy(1));

  dotEls.forEach((dot, i) => {
    dot.addEventListener('click', () => setFocus(i, true));
  });

  // Autoplay
  const startAutoplay = () => {
    if (!cfg.autoplay || count < 2) return;
    stopAutoplay();
    autoTimer = setInterval(() => {
      if (!hovered) navigateBy(1);
    }, cfg.autoplayDelay);
  };

  const stopAutoplay = () => {
    if (autoTimer) clearInterval(autoTimer);
    autoTimer = null;
  };

  root.addEventListener('mouseenter', () => { hovered = true; });
  root.addEventListener('mouseleave', () => { hovered = false; });

  // Responsive scale
  const updateScale = () => {
    const w = root.clientWidth || window.innerWidth;
    const needed = cfg.cardWidth + Math.abs(cfg.spread) * 2 + 120;
    scale = clamp(w / needed, 0.45, 1);
    layout(pos);
  };

  window.addEventListener('resize', updateScale);
  updateScale();
  notify(0);
  layout(0);
  startAutoplay();
}

/* ==========================================================================
   3. "SEE ALL" PAGINATED GRID VIEW WITH 3 CATEGORIES (REAL ESTATE, COACHES, OTHERS)
   ========================================================================== */
function initPortfolioPagination() {
  const depthView = document.getElementById('portfolio-depth-view');
  const gridView = document.getElementById('portfolio-grid-view');
  const toggleSeeAllBtn = document.getElementById('portfolio-see-all-btn');

  const gridContainer = document.getElementById('paginated-grid-container');
  const prevPageBtn = document.getElementById('pag-prev-btn');
  const nextPageBtn = document.getElementById('pag-next-btn');
  const pageInfoText = document.getElementById('pagination-info-text');
  const categoryBtns = document.querySelectorAll('.category-pill-btn');

  if (!depthView || !gridView || !gridContainer) return;

  const ITEMS_PER_PAGE = 4;
  let currentPage = 1;
  let activeCategory = 'all';
  let isGridView = false;

  function getFilteredVideos() {
    if (activeCategory === 'all') return PORTFOLIO_VIDEOS;
    return PORTFOLIO_VIDEOS.filter(v => v.categoryGroup === activeCategory);
  }

  function renderGridPage(page) {
    const filtered = getFilteredVideos();
    const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
    currentPage = Math.min(Math.max(1, page), totalPages);

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filtered.length);
    const currentVideos = filtered.slice(startIndex, endIndex);

    if (currentVideos.length === 0) {
      gridContainer.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted);">
          <i class="fas fa-folder-open" style="font-size: 2rem; margin-bottom: 12px; color: var(--accent-lime);"></i>
          <p>No edits currently listed in this category. Check back soon or switch to All Work!</p>
        </div>
      `;
    } else {
      gridContainer.innerHTML = currentVideos.map(video => {
        const catLabel = video.categoryGroup === 'real_estate' ? 'Real Estate' : (video.categoryGroup === 'others' ? 'Others' : 'Coaches');
        return `
          <div class="paginated-video-card card-3d-hover" data-video-id="${video.id}">
            <div class="paginated-thumb-frame">
              <img src="${video.poster}" alt="${video.title}">
              <div class="portfolio-play-btn"><i class="fas fa-play" style="margin-left:3px;"></i></div>
              <span class="portfolio-category-badge">${catLabel}</span>
              <span class="portfolio-duration">${video.duration}</span>
            </div>
            <div class="paginated-card-content">
              <h4>${video.title}</h4>
              <div class="portfolio-tags">
                <span class="tag-sm category-tag-pill"><i class="fas fa-folder"></i> ${catLabel}</span>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }

    // Attach click listeners to new cards
    gridContainer.querySelectorAll('.paginated-video-card').forEach(card => {
      card.addEventListener('click', () => {
        const vid = card.getAttribute('data-video-id');
        openVideoModalById(vid);
      });
    });

    // Update pagination info text
    if (pageInfoText) {
      const catLabel = activeCategory === 'all' ? 'Work' : activeCategory.replace('_', ' ');
      pageInfoText.textContent = `Showing ${filtered.length > 0 ? startIndex + 1 : 0}–${endIndex} of ${filtered.length} ${catLabel} Edits`;
    }

    // Update buttons
    if (prevPageBtn) prevPageBtn.disabled = (currentPage <= 1);
    if (nextPageBtn) nextPageBtn.disabled = (currentPage >= totalPages);

    // Update page pills dynamically
    const paginationBtnGroup = document.querySelector('.pagination-btn-group');
    if (paginationBtnGroup) {
      const oldPills = paginationBtnGroup.querySelectorAll('.page-num-pill');
      oldPills.forEach(p => p.remove());

      for (let i = 1; i <= totalPages; i++) {
        const pill = document.createElement('button');
        pill.type = 'button';
        pill.className = `page-num-pill ${i === currentPage ? 'active' : ''}`;
        pill.setAttribute('data-page', i);
        pill.textContent = i;
        pill.addEventListener('click', () => renderGridPage(i));
        if (nextPageBtn) {
          paginationBtnGroup.insertBefore(pill, nextPageBtn);
        } else {
          paginationBtnGroup.appendChild(pill);
        }
      }
    }
  }

  // Category Filter clicks
  categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      categoryBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.getAttribute('data-category') || 'all';
      renderGridPage(1);
    });
  });

  // Single "See All" with Arrow Toggle
  if (toggleSeeAllBtn) {
    toggleSeeAllBtn.addEventListener('click', () => {
      isGridView = !isGridView;
      if (isGridView) {
        depthView.style.display = 'none';
        gridView.classList.add('active');
        toggleSeeAllBtn.classList.add('active');
        toggleSeeAllBtn.innerHTML = `<span>Back to Carousel</span> <i class="fas fa-arrow-left"></i>`;
        renderGridPage(1);
        gridView.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        gridView.classList.remove('active');
        depthView.style.display = 'block';
        toggleSeeAllBtn.classList.remove('active');
        toggleSeeAllBtn.innerHTML = `<span>See All</span> <i class="fas fa-arrow-right"></i>`;
      }
    });
  }

  // Prev / Next Page Buttons
  if (prevPageBtn) {
    prevPageBtn.addEventListener('click', () => {
      if (currentPage > 1) renderGridPage(currentPage - 1);
    });
  }

  if (nextPageBtn) {
    nextPageBtn.addEventListener('click', () => {
      const filtered = getFilteredVideos();
      const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
      if (currentPage < totalPages) renderGridPage(currentPage + 1);
    });
  }

  renderGridPage(1);
}

/* ==========================================================================
   3B. MOBILE OPTIMIZED SERVICES SWIPE TRACKER
   ========================================================================== */
function initServicesMobileSwipe() {
  const grid = document.querySelector('.services-grid');
  const dots = document.querySelectorAll('.srv-dot');
  if (!grid || !dots.length) return;

  grid.addEventListener('scroll', () => {
    const scrollLeft = grid.scrollLeft;
    const card = grid.querySelector('.service-card');
    const cardWidth = card ? card.offsetWidth + 14 : 300;
    const activeIdx = Math.min(dots.length - 1, Math.max(0, Math.round(scrollLeft / cardWidth)));
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === activeIdx);
    });
  }, { passive: true });

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.getAttribute('data-index'), 10);
      const card = grid.querySelector('.service-card');
      const cardWidth = card ? card.offsetWidth + 14 : 300;
      grid.scrollTo({ left: idx * cardWidth, behavior: 'smooth' });
    });
  });
}

/* ==========================================================================
   4. VIDEO MODAL (LOCAL MP4 & GOOGLE DRIVE STREAMING)
   ========================================================================== */
function openVideoModalById(videoId) {
  const modal = document.getElementById('video-modal');
  const modalPlayerContainer = document.getElementById('modal-player-container');
  const modalTitle = document.getElementById('modal-video-title');
  const modalCategory = document.getElementById('modal-video-category');
  const modalDuration = document.getElementById('modal-video-duration');

  if (!modal || !modalPlayerContainer) return;

  const item = PORTFOLIO_VIDEOS.find(v => v.id === videoId) || PORTFOLIO_VIDEOS[0];

  if (modalTitle) modalTitle.textContent = item.title;
  if (modalCategory) modalCategory.innerHTML = `<i class="fas fa-folder"></i> ${item.category}`;
  if (modalDuration) modalDuration.innerHTML = `<i class="fas fa-clock"></i> ${item.duration}`;

  if (item.type === 'gdrive') {
    modalPlayerContainer.innerHTML = `
      <iframe 
        src="${item.src}" 
        style="width:100%; height:100%; border:none; background:#000;" 
        allow="autoplay; fullscreen" 
        allowfullscreen>
      </iframe>
    `;
  } else {
    modalPlayerContainer.innerHTML = `
      <video controls autoplay playsinline style="width:100%; height:100%; object-fit:cover; background:#000;">
        <source src="${item.src}" type="video/mp4">
        Your browser does not support the video tag.
      </video>
    `;
  }

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function initVideoModal() {
  const modal = document.getElementById('video-modal');
  const closeBtn = document.getElementById('modal-close');
  const modalPlayerContainer = document.getElementById('modal-player-container');

  if (!modal || !closeBtn) return;

  const heroReelTrigger = document.getElementById('hero-reel-trigger');
  if (heroReelTrigger) {
    heroReelTrigger.addEventListener('click', () => {
      openVideoModalById('video-hero');
    });
  }

  // Ensure hero phone video autoplays in loop
  const heroVideo = document.getElementById('hero-phone-video');
  if (heroVideo) {
    const playHero = () => {
      if (heroVideo.paused) {
        heroVideo.play().catch(() => {});
      }
    };
    playHero();
    window.addEventListener('load', playHero);
    document.addEventListener('touchstart', playHero, { once: true });
    document.addEventListener('click', playHero, { once: true });
  }

  function closeModal() {
    modal.classList.remove('active');
    if (modalPlayerContainer) modalPlayerContainer.innerHTML = '';
    document.body.style.overflow = 'auto';
  }

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   5. SCROLL-DRIVEN REVEAL ANIMATIONS
   ========================================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.scroll-reveal');
  if (!revealElements.length) return;

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => revealObserver.observe(el));
}

/* ==========================================================================
   6. SPECIAL OFFER COUNTDOWN TIMER (₹499 Deal)
   ========================================================================== */
function initOfferCountdown() {
  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minsEl = document.getElementById('cd-mins');
  const secsEl = document.getElementById('cd-secs');

  if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

  let targetDate = localStorage.getItem('sk_coach_offer_end');
  if (!targetDate) {
    targetDate = new Date().getTime() + (48 * 60 * 60 * 1000);
    localStorage.setItem('sk_coach_offer_end', targetDate);
  } else {
    targetDate = parseInt(targetDate, 10);
    if (targetDate <= new Date().getTime()) {
      targetDate = new Date().getTime() + (24 * 60 * 60 * 1000);
      localStorage.setItem('sk_coach_offer_end', targetDate);
    }
  }

  function updateTimer() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minsEl.textContent = '00';
      secsEl.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60));
    const minutes = Math.floor((distance % (1000 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minsEl.textContent = String(minutes).padStart(2, '0');
    secsEl.textContent = String(seconds).padStart(2, '0');
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

/* ==========================================================================
   7. INTERACTIVE BEFORE & AFTER SLIDER (AI COACH PORTRAIT)
   ========================================================================== */
function initBeforeAfterSlider() {
  const container = document.getElementById('comparison-box');
  const beforeImage = document.getElementById('comp-before-img');
  const handle = document.getElementById('comp-handle');

  if (!container || !beforeImage || !handle) return;

  let isSliding = false;

  function syncBeforeImgWidth() {
    const beforeImg = beforeImage.querySelector('img');
    if (beforeImg && container) {
      beforeImg.style.width = container.offsetWidth + 'px';
      beforeImg.style.maxWidth = container.offsetWidth + 'px';
    }
  }
  syncBeforeImgWidth();
  window.addEventListener('resize', syncBeforeImgWidth, { passive: true });

  function slide(x) {
    const rect = container.getBoundingClientRect();
    let position = ((x - rect.left) / rect.width) * 100;
    if (position < 5) position = 5;
    if (position > 95) position = 95;

    beforeImage.style.width = `${position}%`;
    handle.style.left = `${position}%`;
  }

  handle.addEventListener('mousedown', () => { isSliding = true; });
  window.addEventListener('mouseup', () => { isSliding = false; });
  container.addEventListener('mousemove', (e) => {
    if (isSliding) slide(e.clientX);
  });

  handle.addEventListener('touchstart', () => { isSliding = true; }, { passive: true });
  window.addEventListener('touchend', () => { isSliding = false; });
  container.addEventListener('touchmove', (e) => {
    if (isSliding && e.touches[0]) slide(e.touches[0].clientX);
  }, { passive: true });

  container.addEventListener('click', (e) => {
    slide(e.clientX);
  });
}

/* ==========================================================================
   8. DYNAMIC BOOKING ENGINE & INTERACTIVE MODAL DISPATCH SYSTEM
   ========================================================================== */
function initBookingModal() {
  initDynamicBookingEngine();
}

function initDynamicBookingEngine() {
  const defaultPhoneNumber = '918074015211';
  const telegramUsername = 'skedits';

  // State Store
  const state = {
    packageId: 'starter',
    packageName: 'Starter Pack (Offer)',
    basePrice: 499,
    baseReels: 1,
    reels: 1,
    turnaround: 'standard',
    turnaroundCost: 0,
    addons: new Set(),
    coachName: '',
    coachHandle: '',
    coachNiche: 'Executive & Business Coaching',
    coachNotes: ''
  };

  // Add-on definitions
  const ADDONS_INFO = {
    'hook-opt': { name: 'Viral Hook & Script Optimization', price: 149 },
    'multi-aspect': { name: 'Multi-Platform Aspect Ratio Bundle (9:16 + 1:1)', price: 199 },
    'broll-sfx': { name: '4K Cinematic B-Roll & SFX Layering', price: 149 },
    'custom-thumb': { name: '3x High-CTR Cover Thumbnails', price: 99 }
  };

  // Package definitions
  const PACKAGES_INFO = {
    starter: { name: 'Starter Pack', basePrice: 999, defaultReels: 1 },
    growth: { name: 'Growth Coach Pack', basePrice: 999, defaultReels: 1 },
    pro: { name: 'Premium Pack', basePrice: 1499, defaultReels: 1 }
  };

  // UI Elements (On-Page)
  const pagePkgOptions = document.querySelectorAll('#engine-package-selector .package-option');
  const pageSlider = document.getElementById('engine-volume-slider');
  const pageReelCount = document.getElementById('engine-reel-count');
  const pageDiscountTag = document.getElementById('engine-discount-tag');
  const pageTurnaroundTabs = document.querySelectorAll('#engine-turnaround-selector .turnaround-tab');
  const pageAddonCards = document.querySelectorAll('#engine-addons-container .addon-card');
  const pageCoachName = document.getElementById('engine-coach-name');
  const pageCoachHandle = document.getElementById('engine-coach-handle');
  const pageCoachNiche = document.getElementById('engine-coach-niche');
  const pageCoachNotes = document.getElementById('engine-coach-notes');

  // Summary Elements (On-Page)
  const summaryPkgName = document.getElementById('summary-pkg-name');
  const summaryPkgCost = document.getElementById('summary-pkg-cost');
  const summaryReelCount = document.getElementById('summary-reel-count');
  const summaryVolumeSubtotal = document.getElementById('summary-volume-subtotal');
  const summaryTurnaroundLabel = document.getElementById('summary-turnaround-label');
  const summaryTurnaroundCost = document.getElementById('summary-turnaround-cost');
  const summaryAddonCount = document.getElementById('summary-addon-count');
  const summaryAddonCost = document.getElementById('summary-addon-cost');
  const summaryDiscountRow = document.getElementById('summary-discount-row');
  const summaryDiscountPct = document.getElementById('summary-discount-pct');
  const summaryDiscountAmt = document.getElementById('summary-discount-amt');
  const engineGrandTotal = document.getElementById('engine-grand-total');
  const enginePayloadPreview = document.getElementById('engine-payload-preview');

  // Modal UI Elements
  const modal = document.getElementById('booking-modal');
  const modalCloseBtn = document.getElementById('booking-modal-close');
  const modalPkgOptions = document.querySelectorAll('#modal-package-selector .package-option');
  const modalQtyNum = document.getElementById('modal-qty-num');
  const modalQtyMinus = document.getElementById('modal-qty-minus');
  const modalQtyPlus = document.getElementById('modal-qty-plus');
  const modalSpeedStd = document.getElementById('modal-speed-std');
  const modalSpeedExp = document.getElementById('modal-speed-exp');
  const modalAddonCards = document.querySelectorAll('#modal-addons-grid .modal-addon-card');
  const modalCoachName = document.getElementById('modal-coach-name');
  const modalCoachPhone = document.getElementById('modal-coach-phone');
  const modalGrandTotal = document.getElementById('modal-grand-total');
  const modalSummarySubtext = document.getElementById('modal-summary-subtext');
  const modalPayloadPreview = document.getElementById('modal-payload-preview');

  // Calculation Engine
  function calculateTotal() {
    const pkg = PACKAGES_INFO[state.packageId] || PACKAGES_INFO.starter;
    const basePrice = state.basePrice || pkg.basePrice || 999;
    
    let effectiveUnitPrice = 0;
    let netTotal = 0;

    if (state.reels >= 13) {
      // 13+ reels: flat 499 per reel
      effectiveUnitPrice = 499;
      netTotal = state.reels * 499;
    } else {
      // Under 13 reels: 10% off base price
      effectiveUnitPrice = Math.round(basePrice * 0.90);
      netTotal = Math.round(state.reels * basePrice * 0.90);
    }

    return {
      basePrice,
      effectiveUnitPrice,
      subtotal: basePrice * state.reels,
      netTotal: Math.max(netTotal, 1)
    };
  }

  // Pre-formatted, URI-Encoded Payload Generator
  function generateFormattedPayload() {
    const calc = calculateTotal();
    const pkg = PACKAGES_INFO[state.packageId] || PACKAGES_INFO.starter;

    const rateNote = state.reels >= 13 
      ? `🔥 Special Offer Rate: ₹499/reel (13+ reels)`
      : `✨ 10% Off Rate: ₹${calc.effectiveUnitPrice}/reel (Base ₹${calc.basePrice})`;

    const payload = 
`🚀 *NEW COACHING EDITING BRIEF — SK EDITS*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 *Coach Name:* ${state.coachName || 'Not specified'}
📱 *Handle / Contact:* ${state.coachHandle || 'Not specified'}
🎯 *Coaching Niche:* ${state.coachNiche || 'Executive & Business Coaching'}

📦 *Selected Package:* ${pkg.name}
🎬 *Reel Volume Target:* ${state.reels} Video${state.reels > 1 ? 's' : ''}
💡 *Applied Rate:* ${rateNote}

💡 *Goals / Style Notes:* ${state.coachNotes || 'High-retention Hormozi captions & dynamic pacing'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💰 *Total Calculated Investment:* ₹${calc.netTotal.toLocaleString('en-IN')}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Ready to start editing! Please confirm availability.`;

    return payload;
  }

  // Synchronize UI
  function updateUI() {
    const calc = calculateTotal();
    const pkg = PACKAGES_INFO[state.packageId] || PACKAGES_INFO.starter;
    const payload = generateFormattedPayload();

    // 1. On-Page UI updates
    if (pageReelCount) pageReelCount.textContent = state.reels;
    if (pageSlider) pageSlider.value = state.reels;

    if (pageDiscountTag) {
      if (state.reels >= 13) {
        pageDiscountTag.innerHTML = `<i class="fas fa-fire" style="color:var(--accent-lime);"></i> <strong style="color:var(--accent-lime);">Flat ₹499/reel Special Offer Applied!</strong>`;
      } else {
        pageDiscountTag.innerHTML = `<i class="fas fa-tag" style="color:var(--accent-lime);"></i> <span><strong style="color:var(--accent-lime);">10% Off Applied (₹${calc.effectiveUnitPrice}/reel)!</strong> Select 13+ reels for flat ₹499/reel.</span>`;
      }
    }

    if (summaryPkgName) summaryPkgName.textContent = pkg.name;
    if (summaryPkgCost) summaryPkgCost.textContent = `₹${calc.effectiveUnitPrice}/reel`;
    if (summaryReelCount) summaryReelCount.textContent = state.reels;
    if (summaryVolumeSubtotal) summaryVolumeSubtotal.textContent = `₹${calc.netTotal.toLocaleString('en-IN')}`;
    
    // Hide volume bonus discount row as requested
    if (summaryDiscountRow) summaryDiscountRow.style.display = 'none';

    if (engineGrandTotal) {
      engineGrandTotal.textContent = calc.netTotal.toLocaleString('en-IN');
      engineGrandTotal.style.animation = 'none';
      setTimeout(() => { engineGrandTotal.style.animation = 'countUpPopLime 0.3s ease'; }, 10);
    }

    if (enginePayloadPreview) {
      enginePayloadPreview.textContent = payload;
    }

    // 2. Modal UI updates
    if (modalQtyNum) modalQtyNum.textContent = state.reels;
    if (modalGrandTotal) modalGrandTotal.textContent = calc.netTotal.toLocaleString('en-IN');
    if (modalSummarySubtext) {
      modalSummarySubtext.textContent = `${pkg.name} • ${state.reels} Reel${state.reels > 1 ? 's' : ''} @ ₹${calc.effectiveUnitPrice}/reel`;
    }
    if (modalPayloadPreview) {
      modalPayloadPreview.textContent = payload;
    }
  }

  // --- Dispatch Event Handlers ---
  function dispatchToWhatsApp() {
    const payload = generateFormattedPayload();
    const encoded = encodeURIComponent(payload);
    const whatsappUrl = `https://wa.me/${defaultPhoneNumber}?text=${encoded}`;
    window.open(whatsappUrl, '_blank');
  }

  function dispatchToTelegram() {
    const payload = generateFormattedPayload();
    const encoded = encodeURIComponent(payload);
    const telegramUrl = `https://t.me/${telegramUsername}?text=${encoded}`;
    window.open(telegramUrl, '_blank');
  }

  function copyPayloadToClipboard(btnElement) {
    const payload = generateFormattedPayload();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(payload).then(() => {
        showCopyFeedback(btnElement);
      });
    } else {
      const tempArea = document.createElement('textarea');
      tempArea.value = payload;
      document.body.appendChild(tempArea);
      tempArea.select();
      document.execCommand('copy');
      document.body.removeChild(tempArea);
      showCopyFeedback(btnElement);
    }
  }

  function showCopyFeedback(btnElement) {
    if (!btnElement) return;
    const originalHtml = btnElement.innerHTML;
    btnElement.innerHTML = '<i class="fas fa-check" style="color:var(--text-dark);"></i> Copied Brief!';
    btnElement.style.background = '#c8f542';
    btnElement.style.color = '#12300f';

    const toast = document.getElementById('conversion-toast');
    const toastName = document.getElementById('toast-creator-name');
    const toastAction = document.getElementById('toast-action-text');
    if (toast && toastName && toastAction) {
      toastName.textContent = 'Brief Copied to Clipboard!';
      toastAction.textContent = 'Paste into WhatsApp, Telegram or Email to book instantly.';
      toast.classList.add('visible');
      setTimeout(() => toast.classList.remove('visible'), 4000);
    }

    setTimeout(() => {
      btnElement.innerHTML = originalHtml;
      btnElement.style.background = '';
      btnElement.style.color = '';
    }, 2000);
  }

  // Bind On-Page Package Selection
  pagePkgOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      pagePkgOptions.forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      const pkgId = opt.getAttribute('data-pkg-id');
      state.packageId = pkgId;
      state.basePrice = parseInt(opt.getAttribute('data-pkg-base-price'), 10) || 499;

      // Sync modal option
      modalPkgOptions.forEach(mOpt => {
        if (mOpt.getAttribute('data-pkg-id') === pkgId) {
          mOpt.classList.add('selected');
        } else {
          mOpt.classList.remove('selected');
        }
      });

      updateUI();
    });
  });

  // Bind On-Page Volume Slider
  if (pageSlider) {
    pageSlider.addEventListener('input', (e) => {
      state.reels = parseInt(e.target.value, 10) || 1;
      updateUI();
    });
  }

  // Bind On-Page Turnaround Selection
  pageTurnaroundTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      pageTurnaroundTabs.forEach(t => t.classList.remove('selected'));
      tab.classList.add('selected');
      const speed = tab.getAttribute('data-speed');
      state.turnaround = speed;
      state.turnaroundCost = parseInt(tab.getAttribute('data-cost'), 10) || 0;

      // Sync modal buttons
      if (modalSpeedStd && modalSpeedExp) {
        if (speed === 'express') {
          modalSpeedExp.style.background = 'rgba(13, 54, 23, 0.9)';
          modalSpeedExp.style.color = '#fff';
          modalSpeedStd.style.background = 'transparent';
          modalSpeedStd.style.color = 'rgba(255,255,255,0.7)';
        } else {
          modalSpeedStd.style.background = 'rgba(13, 54, 23, 0.9)';
          modalSpeedStd.style.color = '#fff';
          modalSpeedExp.style.background = 'transparent';
          modalSpeedExp.style.color = 'rgba(255,255,255,0.7)';
        }
      }

      updateUI();
    });
  });

  // Bind On-Page Addon Toggles
  pageAddonCards.forEach(card => {
    card.addEventListener('click', () => {
      const addonId = card.getAttribute('data-addon-id');
      if (state.addons.has(addonId)) {
        state.addons.delete(addonId);
        card.classList.remove('selected');
      } else {
        state.addons.add(addonId);
        card.classList.add('selected');
      }

      // Sync modal addon card
      modalAddonCards.forEach(mCard => {
        if (mCard.getAttribute('data-addon-id') === addonId) {
          if (state.addons.has(addonId)) {
            mCard.classList.add('selected');
          } else {
            mCard.classList.remove('selected');
          }
        }
      });

      updateUI();
    });
  });

  // Bind On-Page Inputs
  if (pageCoachName) pageCoachName.addEventListener('input', (e) => { state.coachName = e.target.value; updateUI(); });
  if (pageCoachHandle) pageCoachHandle.addEventListener('input', (e) => { state.coachHandle = e.target.value; updateUI(); });
  if (pageCoachNiche) pageCoachNiche.addEventListener('change', (e) => { state.coachNiche = e.target.value; updateUI(); });
  if (pageCoachNotes) pageCoachNotes.addEventListener('input', (e) => { state.coachNotes = e.target.value; updateUI(); });

  // Bind On-Page Action Buttons
  const btnPageWhatsapp = document.getElementById('btn-dispatch-whatsapp');
  const btnPageTelegram = document.getElementById('btn-dispatch-telegram');
  const btnPageCopy = document.getElementById('btn-copy-brief');

  if (btnPageWhatsapp) btnPageWhatsapp.addEventListener('click', dispatchToWhatsApp);
  if (btnPageTelegram) btnPageTelegram.addEventListener('click', dispatchToTelegram);
  if (btnPageCopy) btnPageCopy.addEventListener('click', () => copyPayloadToClipboard(btnPageCopy));

  // --- Modal Bindings ---
  modalPkgOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      modalPkgOptions.forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      const pkgId = opt.getAttribute('data-pkg-id');
      state.packageId = pkgId;
      state.basePrice = parseInt(opt.getAttribute('data-pkg-base-price'), 10) || 499;

      // Sync on-page options
      pagePkgOptions.forEach(pOpt => {
        if (pOpt.getAttribute('data-pkg-id') === pkgId) {
          pOpt.classList.add('selected');
        } else {
          pOpt.classList.remove('selected');
        }
      });

      updateUI();
    });
  });

  if (modalQtyMinus) {
    modalQtyMinus.addEventListener('click', () => {
      if (state.reels > 1) {
        state.reels--;
        updateUI();
      }
    });
  }

  if (modalQtyPlus) {
    modalQtyPlus.addEventListener('click', () => {
      if (state.reels < 30) {
        state.reels++;
        updateUI();
      }
    });
  }

  if (modalSpeedStd && modalSpeedExp) {
    modalSpeedStd.addEventListener('click', () => {
      state.turnaround = 'standard';
      state.turnaroundCost = 0;
      modalSpeedStd.style.background = 'rgba(13, 54, 23, 0.9)';
      modalSpeedStd.style.color = '#fff';
      modalSpeedExp.style.background = 'transparent';
      modalSpeedExp.style.color = 'rgba(255,255,255,0.7)';
      pageTurnaroundTabs.forEach(t => {
        if (t.getAttribute('data-speed') === 'standard') t.classList.add('selected');
        else t.classList.remove('selected');
      });
      updateUI();
    });

    modalSpeedExp.addEventListener('click', () => {
      state.turnaround = 'express';
      state.turnaroundCost = 199;
      modalSpeedExp.style.background = 'rgba(13, 54, 23, 0.9)';
      modalSpeedExp.style.color = '#fff';
      modalSpeedStd.style.background = 'transparent';
      modalSpeedStd.style.color = 'rgba(255,255,255,0.7)';
      pageTurnaroundTabs.forEach(t => {
        if (t.getAttribute('data-speed') === 'express') t.classList.add('selected');
        else t.classList.remove('selected');
      });
      updateUI();
    });
  }

  modalAddonCards.forEach(card => {
    card.addEventListener('click', () => {
      const addonId = card.getAttribute('data-addon-id');
      if (state.addons.has(addonId)) {
        state.addons.delete(addonId);
        card.classList.remove('selected');
      } else {
        state.addons.add(addonId);
        card.classList.add('selected');
      }

      // Sync on-page card
      pageAddonCards.forEach(pCard => {
        if (pCard.getAttribute('data-addon-id') === addonId) {
          if (state.addons.has(addonId)) {
            pCard.classList.add('selected');
          } else {
            pCard.classList.remove('selected');
          }
        }
      });

      updateUI();
    });
  });

  if (modalCoachName) modalCoachName.addEventListener('input', (e) => { state.coachName = e.target.value; updateUI(); });
  if (modalCoachPhone) modalCoachPhone.addEventListener('input', (e) => { state.coachHandle = e.target.value; updateUI(); });

  const modalDispatchWhatsapp = document.getElementById('modal-dispatch-whatsapp');
  const modalDispatchTelegram = document.getElementById('modal-dispatch-telegram');
  const modalCopyBrief = document.getElementById('modal-copy-brief');

  if (modalDispatchWhatsapp) modalDispatchWhatsapp.addEventListener('click', dispatchToWhatsApp);
  if (modalDispatchTelegram) modalDispatchTelegram.addEventListener('click', dispatchToTelegram);
  if (modalCopyBrief) modalCopyBrief.addEventListener('click', () => copyPayloadToClipboard(modalCopyBrief));

  // --- Modal Open & Close Management ---
  const triggerBtns = document.querySelectorAll('.open-booking-modal-btn');
  triggerBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const planName = btn.getAttribute('data-plan-name') || '';
      const planPrice = btn.getAttribute('data-plan-price') || '';

      // Auto-select package based on button trigger
      if (planPrice.includes('499') || planName.toLowerCase().includes('starter')) {
        state.packageId = 'starter';
        state.basePrice = 499;
      } else if (planPrice.includes('999') || planName.toLowerCase().includes('growth')) {
        state.packageId = 'growth';
        state.basePrice = 999;
      } else if (planPrice.includes('1499') || planName.toLowerCase().includes('premium') || planPrice.includes('1500') || planName.toLowerCase().includes('pro')) {
        state.packageId = 'pro';
        state.basePrice = 1499;
      }

      // Sync radio buttons
      modalPkgOptions.forEach(opt => {
        if (opt.getAttribute('data-pkg-id') === state.packageId) {
          opt.classList.add('selected');
        } else {
          opt.classList.remove('selected');
        }
      });

      pagePkgOptions.forEach(opt => {
        if (opt.getAttribute('data-pkg-id') === state.packageId) {
          opt.classList.add('selected');
        } else {
          opt.classList.remove('selected');
        }
      });

      updateUI();

      if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeBookingModal() {
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeBookingModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeBookingModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeBookingModal();
    }
  });

  // Initialize display
  updateUI();
}

/* ==========================================================================
   9. FAQ ACCORDION
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (!question || !answer) return;

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        const otherAnswer = otherItem.querySelector('.faq-answer');
        if (otherAnswer) otherAnswer.style.maxHeight = null;
      });

      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}

/* ==========================================================================
   10. CONTACT FORM & WHATSAPP GENERATOR
   ========================================================================== */
function initContactFormAndWhatsApp() {
  const form = document.getElementById('sk-contact-form');
  const whatsappQuickBtn = document.getElementById('whatsapp-quick-btn');

  const defaultPhoneNumber = '918074015211';

  function triggerWhatsApp(customMessage) {
    const message = customMessage || encodeURIComponent(
      "Hi SK Edits! I'm a coach looking for dedicated short-form video editing for my reels/shorts. Let's discuss pricing and turnaround!"
    );
    window.open(`https://wa.me/${defaultPhoneNumber}?text=${message}`, '_blank');
  }

  if (whatsappQuickBtn) {
    whatsappQuickBtn.addEventListener('click', () => triggerWhatsApp());
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('contact-name')?.value.trim() || 'Coach';
      const email = document.getElementById('contact-email')?.value.trim() || '';
      const coachNiche = document.getElementById('contact-coach-niche')?.value || 'Coaching Business';
      const packageSelected = document.getElementById('contact-project-type')?.value || 'Starter Pack (₹499)';
      const message = document.getElementById('contact-message')?.value.trim() || 'Ready to scale short-form coaching content.';

      const formattedText = encodeURIComponent(
        `*New Coach Inquiry for SK Edits*\n\n` +
        `👤 *Coach Name:* ${name}\n` +
        `📧 *Email:* ${email}\n` +
        `🎯 *Coaching Niche:* ${coachNiche}\n` +
        `🎬 *Selected Package:* ${packageSelected}\n` +
        `📝 *Goals / Video Links:* ${message}`
      );

      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> Opening WhatsApp Chat...';
        submitBtn.style.background = '#25D366';
        submitBtn.style.color = '#fff';
      }

      setTimeout(() => {
        window.open(`https://wa.me/${defaultPhoneNumber}?text=${formattedText}`, '_blank');
        if (submitBtn) {
          submitBtn.innerHTML = 'Get Started';
          submitBtn.style.background = '';
          submitBtn.style.color = '';
        }
        form.reset();
      }, 750);
    });
  }
}

/* ==========================================================================
   11. FLOATING CIRCULAR WHATSAPP BUTTON (BOTTOM RIGHT)
   ========================================================================== */
function initFloatingWhatsApp() {
  const floatingBtn = document.getElementById('floating-whatsapp-trigger');
  const defaultPhoneNumber = '918074015211';

  if (!floatingBtn) return;

  floatingBtn.addEventListener('click', () => {
    const text = encodeURIComponent("Hi SK Edits! I'm interested in the ₹499/reel 1-Month Commitment Coaching Pack. Let's chat!");
    window.open(`https://wa.me/${defaultPhoneNumber}?text=${text}`, '_blank');
  });
}

/* ==========================================================================
   12. SOCIAL PROOF CONVERSION TOASTS
   ========================================================================== */
function initSocialProofToasts() {
  const toast = document.getElementById('conversion-toast');
  const toastName = document.getElementById('toast-creator-name');
  const toastAction = document.getElementById('toast-action-text');

  if (!toast || !toastName || !toastAction) return;

  const coachEvents = [
    { name: 'Dr. Priya (Executive Coach)', action: 'Claimed ₹499 1-Month Commitment Pack' },
    { name: 'Sameer (Fitness Mentor)', action: 'Booked 15 Viral Reels for Client Growth' },
    { name: 'Aarav (Business Coach)', action: 'Increased Revenue 1.5x from Reels' },
    { name: 'Meera (Career Consultant)', action: 'Generated 250k Views on First 3 Reels' },
    { name: 'Vikram (Mindset Coach)', action: 'Signed 4 High-Ticket Clients via Reels' }
  ];

  let eventIndex = 0;

  function showNextToast() {
    const current = coachEvents[eventIndex % coachEvents.length];
    toastName.textContent = current.name;
    toastAction.textContent = current.action;

    toast.classList.add('visible');

    setTimeout(() => {
      toast.classList.remove('visible');
    }, 4500);

    eventIndex++;
  }

  setTimeout(showNextToast, 3500);
  setInterval(showNextToast, 13000);
}

/* ==========================================================================
   13. REACT BITS FLOWING MENU (DIRECTIONAL SWEEP MARQUEE)
   ========================================================================== */
function initFlowingMenu() {
  const menuNav = document.getElementById('flowing-menu-nav');
  if (!menuNav) return;

  const items = menuNav.querySelectorAll('.menu__item');
  if (!items.length) return;

  const animationDefaults = { duration: 0.6, ease: 'expo' };

  const distMetric = (x, y, x2, y2) => {
    const xDiff = x - x2;
    const yDiff = y - y2;
    return xDiff * xDiff + yDiff * yDiff;
  };

  const findClosestEdge = (mouseX, mouseY, width, height) => {
    const topEdgeDist = distMetric(mouseX, mouseY, width / 2, 0);
    const bottomEdgeDist = distMetric(mouseX, mouseY, width / 2, height);
    return topEdgeDist < bottomEdgeDist ? 'top' : 'bottom';
  };

  items.forEach(item => {
    const marquee = item.querySelector('.marquee');
    const marqueeInner = item.querySelector('.marquee__inner');
    const text = item.getAttribute('data-text') || '';
    const image = item.getAttribute('data-image') || '';
    const speed = 14;

    if (!marquee || !marqueeInner) return;

    let marqueeTween = null;

    const setupMarqueeParts = () => {
      marqueeInner.innerHTML = '';
      const dummy = document.createElement('div');
      dummy.className = 'marquee__part';
      dummy.innerHTML = `<span>${text}</span><div class="marquee__img" style="background-image: url('${image}');"></div>`;
      marqueeInner.appendChild(dummy);

      const partWidth = dummy.offsetWidth || 320;
      const viewportWidth = window.innerWidth;
      const repetitions = Math.max(4, Math.ceil(viewportWidth / partWidth) + 2);

      marqueeInner.innerHTML = '';
      for (let i = 0; i < repetitions; i++) {
        const part = document.createElement('div');
        part.className = 'marquee__part';
        part.innerHTML = `<span>${text}</span><div class="marquee__img" style="background-image: url('${image}');"></div>`;
        marqueeInner.appendChild(part);
      }

      if (marqueeTween) marqueeTween.kill();
      if (typeof gsap !== 'undefined') {
        marqueeTween = gsap.to(marqueeInner, {
          x: -partWidth,
          duration: speed,
          ease: 'none',
          repeat: -1
        });
      }
    };

    setTimeout(setupMarqueeParts, 80);
    window.addEventListener('resize', setupMarqueeParts);

    // Directional sweep GSAP animation
    item.addEventListener('mouseenter', (ev) => {
      const rect = item.getBoundingClientRect();
      const x = ev.clientX - rect.left;
      const y = ev.clientY - rect.top;
      const edge = findClosestEdge(x, y, rect.width, rect.height);

      if (typeof gsap !== 'undefined') {
        gsap.timeline({ defaults: animationDefaults })
          .set(marquee, { y: edge === 'top' ? '-101%' : '101%' }, 0)
          .set(marqueeInner, { y: edge === 'top' ? '101%' : '-101%' }, 0)
          .to([marquee, marqueeInner], { y: '0%' }, 0);
      }
    });

    item.addEventListener('mouseleave', (ev) => {
      const rect = item.getBoundingClientRect();
      const x = ev.clientX - rect.left;
      const y = ev.clientY - rect.top;
      const edge = findClosestEdge(x, y, rect.width, rect.height);

      if (typeof gsap !== 'undefined') {
        gsap.timeline({ defaults: animationDefaults })
          .to(marquee, { y: edge === 'top' ? '-101%' : '101%' }, 0)
          .to(marqueeInner, { y: edge === 'top' ? '101%' : '-101%' }, 0);
      }
    });
  });
}

/* ==========================================================================
   14. REACT BITS GOOEY NAV COMPONENT (PHYSICS PARTICLES & LIQUID PILL)
   ========================================================================== */
function initGooeyNav() {
  const container = document.getElementById('sk-gooey-nav');
  if (!container) return;

  const nav = container.querySelector('nav');
  const ul = nav ? nav.querySelector('ul') : null;
  const listItems = ul ? ul.querySelectorAll('li') : [];
  const filterEl = container.querySelector('.effect.filter');
  const textEl = container.querySelector('.effect.text');

  if (!ul || !listItems.length || !filterEl || !textEl) return;

  const animationTime = 600;
  const particleCount = 15;
  const particleDistances = [90, 10];
  const particleR = 100;
  const timeVariance = 300;
  const colors = [1, 2, 3, 1, 2, 3, 1, 4];
  let activeIndex = 0;

  const noise = (n = 1) => n / 2 - Math.random() * n;

  const getXY = (distance, pointIndex, totalPoints) => {
    const angle = ((360 + noise(8)) / totalPoints) * pointIndex * (Math.PI / 180);
    return [distance * Math.cos(angle), distance * Math.sin(angle)];
  };

  const createParticle = (i, t, d, r) => {
    let rotate = noise(r / 10);
    return {
      start: getXY(d[0], particleCount - i, particleCount),
      end: getXY(d[1] + noise(7), particleCount - i, particleCount),
      time: t,
      scale: 1 + noise(0.2),
      color: colors[Math.floor(Math.random() * colors.length)],
      rotate: rotate > 0 ? (rotate + r / 20) * 10 : (rotate - r / 20) * 10
    };
  };

  const makeParticles = element => {
    const d = particleDistances;
    const r = particleR;
    const bubbleTime = animationTime * 2 + timeVariance;
    element.style.setProperty('--time', `${bubbleTime}ms`);

    for (let i = 0; i < particleCount; i++) {
      const t = animationTime * 2 + noise(timeVariance * 2);
      const p = createParticle(i, t, d, r);
      element.classList.remove('active');

      setTimeout(() => {
        const particle = document.createElement('span');
        const point = document.createElement('span');
        particle.classList.add('particle');
        particle.style.setProperty('--start-x', `${p.start[0]}px`);
        particle.style.setProperty('--start-y', `${p.start[1]}px`);
        particle.style.setProperty('--end-x', `${p.end[0]}px`);
        particle.style.setProperty('--end-y', `${p.end[1]}px`);
        particle.style.setProperty('--time', `${p.time}ms`);
        particle.style.setProperty('--scale', `${p.scale}`);
        particle.style.setProperty('--color', `var(--color-${p.color}, #8BC53D)`);
        particle.style.setProperty('--rotate', `${p.rotate}deg`);

        point.classList.add('point');
        particle.appendChild(point);
        element.appendChild(particle);
        requestAnimationFrame(() => {
          element.classList.add('active');
        });
        setTimeout(() => {
          try {
            element.removeChild(particle);
          } catch (_) {}
        }, t);
      }, 30);
    }
  };

  const updateEffectPosition = element => {
    const containerRect = container.getBoundingClientRect();
    const pos = element.getBoundingClientRect();

    const styles = {
      left: `${pos.x - containerRect.x}px`,
      top: `${pos.y - containerRect.y}px`,
      width: `${pos.width}px`,
      height: `${pos.height}px`
    };
    Object.assign(filterEl.style, styles);
    Object.assign(textEl.style, styles);
    textEl.innerText = element.innerText;
  };

  listItems.forEach((li, index) => {
    li.addEventListener('click', (e) => {
      if (activeIndex === index) return;

      listItems.forEach(item => item.classList.remove('active'));
      li.classList.add('active');
      activeIndex = index;

      updateEffectPosition(li);

      const particles = filterEl.querySelectorAll('.particle');
      particles.forEach(p => {
        try { filterEl.removeChild(p); } catch (_) {}
      });

      textEl.classList.remove('active');
      void textEl.offsetWidth;
      textEl.classList.add('active');

      makeParticles(filterEl);
    });
  });

  const activeLi = listItems[activeIndex];
  if (activeLi) {
    updateEffectPosition(activeLi);
    textEl.classList.add('active');
  }

  window.addEventListener('resize', () => {
    const curr = listItems[activeIndex];
    if (curr) updateEffectPosition(curr);
  });
}

/* ==========================================================================
   15. REACT BITS COUNTUP COMPONENT (SPRING / CUBIC EASING)
   ========================================================================== */
function initCountUp() {
  const elements = document.querySelectorAll('.count-up-text, [data-to]');
  if (!elements.length) return;

  const formatNumber = (num, separator, suffix = '') => {
    const formatted = Math.round(num).toString();
    const separated = separator ? formatted.replace(/\B(?=(\d{3})+(?!\d))/g, separator) : formatted;
    return separated + suffix;
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        obs.unobserve(el);

        const to = parseFloat(el.getAttribute('data-to') || el.innerText.replace(/[^0-9.]/g, '') || 499);
        const from = parseFloat(el.getAttribute('data-from') || 0);
        const duration = parseFloat(el.getAttribute('data-duration') || 2) * 1000;
        const delay = parseFloat(el.getAttribute('data-delay') || 0) * 1000;
        const separator = el.getAttribute('data-separator') || '';
        const suffix = el.getAttribute('data-suffix') || '';
        const direction = el.getAttribute('data-direction') || 'up';

        const startVal = direction === 'down' ? to : from;
        const targetVal = direction === 'down' ? from : to;

        el.textContent = formatNumber(startVal, separator, suffix);

        setTimeout(() => {
          const startTime = performance.now();

          const updateCount = currentTime => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Smooth cubic ease-out matching motion/react spring
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentVal = startVal + (targetVal - startVal) * easeOut;

            el.textContent = formatNumber(currentVal, separator, suffix);

            if (progress < 1) {
              requestAnimationFrame(updateCount);
            } else {
              el.textContent = formatNumber(targetVal, separator, suffix);
              el.classList.add('counted');

              // Continuous Pop Trigger (0.8 sec delay cycle after count up)
              const popTargets = [
                el,
                el.closest('.continuous-pop'),
                el.closest('.new-price'),
                el.closest('.price'),
                el.closest('.hero-price-pop'),
                el.closest('.highlight-pop-views')
              ].filter(Boolean);

              popTargets.forEach(target => {
                target.classList.add('is-popping');
              });
            }
          };

          requestAnimationFrame(updateCount);
        }, delay);
      }
    });
  }, { threshold: 0.1 });

  elements.forEach(el => observer.observe(el));

  // Global activation safety: ensure ALL .continuous-pop elements are popping after 2.4s
  setTimeout(() => {
    document.querySelectorAll('.continuous-pop, .new-price, .hero-price-pop, .highlight-pop-views').forEach(popEl => {
      popEl.classList.add('is-popping');
    });
  }, 2400);
}

/* ==========================================================================
   14. OPTIMIZED AURORA RAY-CASTING CANVAS ENGINE (FROM LOCALHOST:3000)
   ========================================================================== */
function initAuroraCanvas() {
  const canvas = document.getElementById('aurora-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  let mouseX = width / 2;
  let mouseY = height * 0.3;
  let targetMouseX = mouseX;
  let targetMouseY = mouseY;

  const handleResize = () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  };

  const handleMouseMove = (e) => {
    targetMouseX = e.clientX;
    targetMouseY = e.clientY;
  };

  window.addEventListener('resize', handleResize);
  window.addEventListener('mousemove', handleMouseMove, { passive: true });

  let time = 0;

  // Aurora Ray Configuration (exact colors from localhost:3000)
  const rays = [
    { speed: 0.0008, color: 'rgba(163, 230, 53, 0.14)', widthScale: 1.2, xOffset: -0.2, phase: 0 },
    { speed: 0.0012, color: 'rgba(204, 255, 0, 0.18)', widthScale: 0.8, xOffset: 0.1, phase: 2 },
    { speed: 0.0006, color: 'rgba(132, 204, 22, 0.10)', widthScale: 1.5, xOffset: 0.35, phase: 4 },
    { speed: 0.0015, color: 'rgba(52, 211, 153, 0.09)', widthScale: 0.9, xOffset: -0.1, phase: 1.5 },
    { speed: 0.0009, color: 'rgba(163, 230, 53, 0.12)', widthScale: 1.1, xOffset: 0.2, phase: 3.2 },
  ];

  function render() {
    time += 1;
    mouseX += (targetMouseX - mouseX) * 0.04;
    mouseY += (targetMouseY - mouseY) * 0.04;

    ctx.clearRect(0, 0, width, height);

    // Deep obsidian base layer
    ctx.fillStyle = '#050608';
    ctx.fillRect(0, 0, width, height);

    // Radial origin for light rays near top hero
    const originX = width * 0.5 + (mouseX - width * 0.5) * 0.15;
    const originY = -50 + (mouseY - height * 0.3) * 0.1;

    // Draw undulating aurora ray beams
    rays.forEach((ray, i) => {
      const rayAngle = Math.sin(time * ray.speed + ray.phase) * 0.28;
      const beamSpread = width * 0.6 * ray.widthScale;
      const currentOriginX = originX + Math.sin(time * 0.0005 + i) * 80;

      const grad = ctx.createRadialGradient(
        currentOriginX,
        originY,
        20,
        currentOriginX + Math.tan(rayAngle) * height,
        height * 0.85,
        beamSpread
      );

      grad.addColorStop(0, ray.color);
      grad.addColorStop(0.3, ray.color.replace('0.', '0.0'));
      grad.addColorStop(0.7, 'rgba(5, 6, 8, 0)');
      grad.addColorStop(1, 'rgba(5, 6, 8, 0)');

      ctx.save();
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(currentOriginX - 100, originY);
      ctx.lineTo(currentOriginX + 100, originY);
      ctx.lineTo(currentOriginX + Math.tan(rayAngle) * height + beamSpread, height);
      ctx.lineTo(currentOriginX + Math.tan(rayAngle) * height - beamSpread, height);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    });

    // Ambient radial bloom behind hero
    const heroGlow = ctx.createRadialGradient(
      width * 0.5,
      height * 0.2,
      0,
      width * 0.5,
      height * 0.2,
      width * 0.5
    );
    heroGlow.addColorStop(0, 'rgba(204, 255, 0, 0.07)');
    heroGlow.addColorStop(0.5, 'rgba(132, 204, 22, 0.02)');
    heroGlow.addColorStop(1, 'rgba(5, 6, 8, 0)');

    ctx.fillStyle = heroGlow;
    ctx.fillRect(0, 0, width, height);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}



