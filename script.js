document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector(".main-nav:not(.static-nav)");
  const toggle = document.querySelector(".menu-toggle");

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    });

    nav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open navigation");
      });
    });

    document.addEventListener("click", event => {
      if (!nav.classList.contains("open")) return;
      if (!nav.contains(event.target) && !toggle.contains(event.target)) {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open navigation");
      }
    });
  }

  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          entry.target.style.transitionDelay = `${Math.min(index * 35, 180)}ms`;
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -30px 0px" });
    revealItems.forEach(el => observer.observe(el));
  } else {
    revealItems.forEach(el => el.classList.add("visible"));
  }

  const glow = document.querySelector(".cursor-glow");
  if (glow && window.matchMedia && window.matchMedia("(pointer:fine)").matches) {
    window.addEventListener("pointermove", event => {
      glow.style.left = `${event.clientX}px`;
      glow.style.top = `${event.clientY}px`;
    }, { passive: true });
  }

  document.querySelectorAll(".magnetic").forEach(button => {
    const reset = () => { button.style.transform = ""; };
    button.addEventListener("pointermove", event => {
      const rect = button.getBoundingClientRect();
      const x = (event.clientX - rect.left - rect.width / 2) * 0.08;
      const y = (event.clientY - rect.top - rect.height / 2) * 0.08;
      button.style.transform = `translate(${x}px, ${y}px)`;
    });
    button.addEventListener("pointerleave", reset);
    button.addEventListener("blur", reset);
  });

  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxClose = lightbox?.querySelector(".lightbox-close");

  if (lightbox && lightboxImg) {
    const closeLightbox = () => {
      lightbox.classList.remove("open");
      lightbox.setAttribute("aria-hidden", "true");
      lightboxImg.removeAttribute("src");
      document.body.classList.remove("lightbox-open");
    };

    document.querySelectorAll(".certificate[data-image]").forEach(card => {
      card.addEventListener("click", () => {
        const image = card.getAttribute("data-image");
        if (!image) return;
        lightboxImg.src = image;
        lightbox.classList.add("open");
        lightbox.setAttribute("aria-hidden", "false");
        document.body.classList.add("lightbox-open");
      });
    });

    lightboxClose?.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", event => {
      if (event.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && lightbox.classList.contains("open")) closeLightbox();
    });
  }

  const reminder = document.getElementById("courseReminder");
  const reminderClose = document.getElementById("reminderClose");
  if (reminder) {
    let dismissed = false;
    try { dismissed = sessionStorage.getItem("ecaReminderDismissed") === "1"; } catch (_) {}

    // Show the course reminder up to 3 times, with a 5-second gap between appearances.
    // Closing it only dismisses the current appearance; the visitor still receives the planned reminders.
    if (!dismissed) {
      [5000, 14000, 23000].forEach(delay => {
        window.setTimeout(() => {
          reminder.classList.add("show");
          window.setTimeout(() => reminder.classList.remove("show"), 4200);
        }, delay);
      });
    }

    reminderClose?.addEventListener("click", () => {
      reminder.classList.remove("show");
    });
  }
});
