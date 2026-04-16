/**
* Template Name: Story
* Template URL: https://bootstrapmade.com/story-bootstrap-blog-template/
* Updated: Aug 11 2025 with Bootstrap v5.3.7
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(function() {
  "use strict";

  const navItems = [
    { label: "HOME", href: "index.html" },
    { label: "COMMITTEES", href: "committees.html" },
    {
      label: "CONTRIBUTION",
      children: [
        { label: "CALL FOR PAPERS", href: "call-for-papers.html" },
        { label: "PAPER SUBMISSION", href: "paper-submission.html" },
        { label: "WORKSHOP/SPECIAL SESSION PROPOSAL SUBMISSION", href: "workshop-submission.html" },
        { label: "FINAL SUBMISSION", href: "final-submission.html" }
      ]
    },
    { label: "PROGRAM", href: "program.html" },
    { label: "REGISTRATION", href: "registration.html" },
    { label: "SPONSORSHIP", href: "sponsorship.html" },
    {
      label: "TRAVEL",
      children: [
        { label: "VISA & TRAVEL", href: "visa.html" },
        { label: "VENUE", href: "venue.html" },
        { label: "ACCOMMODATION", href: "accommodation.html" },
        { label: "ATTRACTIONS", href: "attractions.html" }
      ]
    },
    { label: "AWARDS", href: "awards.html" }
  ];

  const footerColumns = [
    [
      { label: "COMMITTEES", href: "committees.html", className: "mb-4" },
      { label: "VISA & TRAVEL", href: "visa.html" }
    ],
    [
      { label: "CONTRIBUTION", href: "call-for-papers.html", className: "mb-4" },
      { label: "VENUE", href: "venue.html" }
    ],
    [
      { label: "PROGRAM", href: "program.html", className: "mb-4" },
      { label: "ACCOMMODATION", href: "accommodation.html" }
    ],
    [
      { label: "REGISTRATION", href: "registration.html", className: "mb-4" },
      { label: "AWARDS", href: "awards.html" }
    ]
  ];

  const footerCreditsHtml = `
    <div class="copyright">
      © Copyright <strong>IEEE ROBIO 2026</strong>. All Rights Reserved
    </div>
    <div class="credits">
      <!-- All the links in the footer should remain intact. -->
      <!-- You can delete the links only if you've purchased the pro version. -->
      <!-- Licensing information: https://bootstrapmade.com/license/ -->
      <!-- Purchase the pro version with working PHP/AJAX contact form: [buy-url] -->
      Designed by <a href="https://bootstrapmade.com/">BootstrapMade</a> | <a href="https://bootstrapmade.com/tools/">DevTools</a>
    </div>
  `;

  function getCurrentPath() {
    const rawPath = window.location.pathname.split('/').pop() || 'index.html';
    return rawPath.toLowerCase();
  }

  function renderNavigation() {
    const navMenu = document.querySelector('#navmenu[data-nav-inject="true"]');
    if (!navMenu) {
      return;
    }

    const currentPath = getCurrentPath();
    const navList = navItems.map((item) => {
      if (!item.children) {
        const activeClass = currentPath === item.href ? ' class="active"' : '';
        return `<li><a href="${item.href}"${activeClass}>${item.label}</a></li>`;
      }

      const hasActiveChild = item.children.some((child) => currentPath === child.href);
      const parentClass = hasActiveChild ? ' class="active"' : '';
      const childrenHtml = item.children
        .map((child) => {
          const childClass = currentPath === child.href ? ' class="active"' : '';
          return `<li><a href="${child.href}"${childClass}>${child.label}</a></li>`;
        })
        .join('');

      return `<li class="dropdown"><a href="#"${parentClass}><span>${item.label}</span> <i class="bi bi-chevron-down toggle-dropdown"></i></a><ul>${childrenHtml}</ul></li>`;
    }).join('');

    navMenu.innerHTML = `<ul>${navList}</ul><i class="mobile-nav-toggle d-xl-none bi bi-list"></i>`;
  }

  function renderFooter() {
    const footer = document.querySelector('#footer[data-footer-inject="true"]');
    if (!footer) {
      return;
    }

    const columns = footerColumns.map((column) => {
      const links = column
        .map((link) => `<a href="${link.href}"><h5${link.className ? ` class="${link.className}"` : ''}>${link.label}</h5></a>`)
        .join('');
      return `<div class="d-flex flex-column">${links}</div>`;
    }).join('');

    footer.innerHTML = `
      <div class="footer-top">
        <div class="container" data-aos="fade-up">
          <div class="row justify-content-between align-items-start">
            <div class="col-auto">
              <a href="index.html" class="logo d-flex align-items-center">
                <img src="assets/img/logo.png" alt="" style="max-width: 180px;">
              </a>
            </div>
            <div class="col-auto">
              <div class="d-flex flex-wrap gap-5">${columns}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <div class="container">
          <div class="footer-bottom-content">
            ${footerCreditsHtml}
          </div>
        </div>
      </div>
    `;
  }

  renderNavigation();
  renderFooter();

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader || !selectBody) return;
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    if (!mobileNavToggleBtn) return;
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener('click', mobileNavToogle);
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  if (scrollTop) {
    scrollTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    if (!window.AOS) return;
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    if (!window.Swiper) return;

    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = {
        speed: 600,
        loop: true,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false
        },
        slidesPerView: 1
      };

      const configNode = swiperElement.querySelector(".swiper-config");
      if (configNode) {
        try {
          config = JSON.parse(configNode.innerHTML.trim());
        } catch (error) {
          console.warn("Invalid swiper config JSON. Using default config.", error);
        }
      }

      new Swiper(swiperElement, config);
    });
  }

  window.addEventListener("load", initSwiper);

})();
