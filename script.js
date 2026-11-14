document.addEventListener("DOMContentLoaded", () => {
      // 1. Stagger delay kartu proyek
      const projectCards = document.querySelectorAll(".projects article");
      projectCards.forEach((card, index) => {
        card.style.transitionDelay = `${(index % 3) * 100}ms`;
      });

      // 2. Elemen efek timbul (scroll reveal)
      const targets = document.querySelectorAll(
        "section h2, .featured, .projects article, .timeline li, dl.skills dt, dl.skills dd, .two > div, .contact .btns"
      );
      targets.forEach((el) => el.classList.add("reveal"));

      // 3. Intersection Observer (efek muncul sekali tanpa flicker saat scroll balik)
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("active");
              setTimeout(() => {
                entry.target.style.transitionDelay = "0ms";
              }, 750);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -30px 0px" }
      );
      targets.forEach((el) => observer.observe(el));

      // 4. Sticky Header, Back to Top, & Scrollspy (Tunggal & Throttled via requestAnimationFrame)
      const header = document.querySelector("header.top");
      const backToTopBtn = document.getElementById("backToTop");
      const sections = document.querySelectorAll("section[id]");
      const navLinks = document.querySelectorAll('nav a[href^="#"]');

      const onScrollUpdate = () => {
        const y = window.scrollY;

        // Sticky Navbar
        if (header) {
          header.classList.toggle("scrolled", y > 24);
        }

        // Tombol Back to Top
        if (backToTopBtn) {
          backToTopBtn.classList.toggle("show", y > 300);
        }

        // Scrollspy
        const scrollPos = y + 140;
        let currentId = "";

        if (window.innerHeight + y >= document.documentElement.scrollHeight - 20) {
          currentId = "kontak";
        } else {
          sections.forEach((sec) => {
            const top = sec.offsetTop;
            const height = sec.offsetHeight;
            if (scrollPos >= top && scrollPos < top + height) {
              currentId = sec.getAttribute("id");
            }
          });
        }

        navLinks.forEach((link) => {
          link.classList.toggle("active", Boolean(currentId && link.getAttribute("href") === `#${currentId}`));
        });
      };

      let ticking = false;
      window.addEventListener("scroll", () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            onScrollUpdate();
            ticking = false;
          });
          ticking = true;
        }
      }, { passive: true });

      onScrollUpdate();

      if (backToTopBtn) {
        backToTopBtn.addEventListener("click", () => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        });
      }

      // 5. Salin Email ke Clipboard
      const copyEmailBtn = document.getElementById("copyEmailBtn");
      const copyToast = document.getElementById("copyToast");
      const emailAddress = "alnazirul.work@gmail.com";
      let toastTimeout;

      if (copyEmailBtn && copyToast) {
        copyEmailBtn.addEventListener("click", async () => {
          try {
            await navigator.clipboard.writeText(emailAddress);
          } catch {
            const temp = document.createElement("input");
            temp.value = emailAddress;
            document.body.appendChild(temp);
            temp.select();
            document.execCommand("copy");
            document.body.removeChild(temp);
          }

          const originalHTML = copyEmailBtn.innerHTML;
          copyEmailBtn.classList.add("copied");
          copyEmailBtn.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          `;

          copyToast.classList.add("show");
          clearTimeout(toastTimeout);
          toastTimeout = setTimeout(() => {
            copyToast.classList.remove("show");
            copyEmailBtn.classList.remove("copied");
            copyEmailBtn.innerHTML = originalHTML;
          }, 2200);
        });
      }

      // 6. Mobile Hamburger Menu
      const menuToggle = document.getElementById("menuToggle");
      const primaryNav = document.getElementById("primaryNav");

      if (menuToggle && primaryNav) {
        const closeMenu = () => {
          primaryNav.classList.remove("open");
          menuToggle.setAttribute("aria-expanded", "false");
          menuToggle.setAttribute("aria-label", "Buka menu navigasi");
        };

        menuToggle.addEventListener("click", (e) => {
          e.stopPropagation();
          const isOpen = primaryNav.classList.toggle("open");
          menuToggle.setAttribute("aria-expanded", String(isOpen));
          menuToggle.setAttribute("aria-label", isOpen ? "Tutup menu navigasi" : "Buka menu navigasi");
        });

        primaryNav.querySelectorAll("a").forEach((link) => {
          link.addEventListener("click", closeMenu);
        });

        document.addEventListener("click", (e) => {
          if (!e.target.closest("header.top")) {
            closeMenu();
          }
        });
      }
    });
