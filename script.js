const ORALPETS = {
  phone: "+573154841552",
  whatsapp:
    "https://wa.me/573154841552?text=Hola%2C%20quiero%20agendar%20una%20consulta%20odontol%C3%B3gica%20para%20mi%20mascota",
  confirmafyUrl: "",
  metaPixelId: "282429905966327",
};

function loadMetaPixel() {
  if (typeof window.fbq === "function") return;

  !(function (f, b, e, v, n, t, s) {
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = "2.0";
    n.queue = [];
    t = b.createElement(e);
    t.async = true;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");

  window.fbq("init", ORALPETS.metaPixelId);
  window.fbq("track", "PageView");
}

window.addEventListener("load", () => {
  setTimeout(loadMetaPixel, 8000);
});

function trackConversion(eventName, payload = {}) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: eventName, ...payload });

  if (typeof window.fbq !== "function") {
    loadMetaPixel();
  }

  if (typeof window.fbq === "function") {
    window.fbq("trackCustom", eventName, payload);
  }
}

document.querySelectorAll("[data-track]").forEach((element) => {
  element.addEventListener("click", () => {
    trackConversion(element.dataset.track, {
      label: element.textContent.trim(),
      href: element.getAttribute("href") || "",
    });
  });
});

document.querySelectorAll(".js-confirmafy").forEach((link) => {
  link.addEventListener("click", () => {
    trackConversion("click_confirmafy", { status: ORALPETS.confirmafyUrl ? "ready" : "fallback_whatsapp" });

    if (ORALPETS.confirmafyUrl) {
      link.href = ORALPETS.confirmafyUrl;
      link.removeAttribute("target");
    }
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

function animateCounter(counter) {
  const target = Number(counter.dataset.target || 0);
  const duration = 1200;
  const start = performance.now();

  function frame(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    counter.textContent = Math.floor(target * eased).toLocaleString("es-CO");

    if (progress < 1) {
      requestAnimationFrame(frame);
    }
  }

  requestAnimationFrame(frame);
}

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.6 }
);

document.querySelectorAll(".counter").forEach((counter) => counterObserver.observe(counter));

const imageObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const image = entry.target;
      if (image.dataset.src) {
        image.src = image.dataset.src;
        image.removeAttribute("data-src");
      }
      imageObserver.unobserve(image);
    });
  },
  { rootMargin: "420px 0px" }
);

document.querySelectorAll("img[data-src]").forEach((image) => {
  imageObserver.observe(image);
});

document.querySelectorAll(".before-after").forEach((slider) => {
  const input = slider.querySelector("input");

  function update(value) {
    slider.style.setProperty("--position", `${value}%`);
  }

  input.addEventListener("input", (event) => update(event.target.value));
  update(input.value);
});

const backgroundObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const source = entry.target.dataset.src;
      if (source) {
        entry.target.querySelectorAll(".ba-image").forEach((image) => {
          image.style.backgroundImage = `url("${source}")`;
        });
      }
      backgroundObserver.unobserve(entry.target);
    });
  },
  { rootMargin: "320px 0px" }
);

document.querySelectorAll(".before-after[data-src]").forEach((slider) => {
  backgroundObserver.observe(slider);
});

const sectionTrackers = [
  { selector: "#proceso", event: "scroll_bloque_3" },
  { selector: "#prueba-social", event: "scroll_bloque_4" },
];

const scrollObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        trackConversion(entry.target.dataset.scrollEvent);
        scrollObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.25 }
);

sectionTrackers.forEach(({ selector, event }) => {
  const element = document.querySelector(selector);
  if (element) {
    element.dataset.scrollEvent = event;
    scrollObserver.observe(element);
  }
});

const leadForm = document.querySelector("#lead-form");

if (leadForm) {
  leadForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(leadForm);
    const body = Array.from(data.entries())
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n");
    const subject = encodeURIComponent("Solicitud de consulta odontológica OralPets");
    const encodedBody = encodeURIComponent(body);
    const mailto = `mailto:oralpets@gmail.com?subject=${subject}&body=${encodedBody}`;
    const status = leadForm.querySelector(".form-status");

    trackConversion("submit_backup_form", { channel: "mailto" });
    status.textContent = "Abrimos tu correo para enviar la solicitud. También puedes escribirnos por WhatsApp.";
    window.location.href = mailto;
  });
}
