if (window.openingEffectManager) {
  console.debug("Opening Effect: Script already loaded, skipping");
} else {
  class OpeningEffectManager {
    constructor() {
      this.effectMap = {
        // door: "/assets/animations/opening/wedding-gate.js",
        flower: "/assets/animations/opening/flower.js",
        camera: "/assets/animations/opening/camera.js",
        video: "/assets/animations/opening/video.js",
        heartcard: "/assets/animations/opening/heart-card.js",
        envelope: "/assets/animations/opening/envelope.js",
        saveDateBloom: "/assets/animations/opening/save-date-bloom.js",
        savedatebloom: "/assets/animations/opening/save-date-bloom.js",
        weddingDoorCurtain: "/assets/animations/opening/wedding-door-curtain.js",
        weddingdoorcurtain: "/assets/animations/opening/wedding-door-curtain.js",
        effect1: "/assets/animations/opening/effect1.js",
        effect2: "/assets/animations/opening/effect2.js",
        effect3: "/assets/animations/opening/effect3.js",
        effectXe: "/assets/animations/opening/effectXe.js",
      };
      this.__version = "save-date-visible-1";
      this.currentEffect = null;
      this.shadowRoot = null;
    }

    isInEditorMode() {
      const forcePreview =
        window.__allowOpeningEffectPreview === true ||
        document.body?.getAttribute("data-opening-preview") === "true" ||
        document.documentElement?.getAttribute("data-opening-preview") ===
        "true";

      if (forcePreview) {
        return false;
      }

      const hasEditorHook =
        window.__htmlEditorHooked === true ||
        !!document.getElementById("__html_editor_hook__");

      if (hasEditorHook) {
        return true;
      }

      let topUrl = "";
      let topSearch = "";

      try {
        topUrl = window.top.location.href.toLowerCase();
        topSearch = window.top.location.search || "";
      } catch (e) {
        topUrl = window.location.href.toLowerCase();
        topSearch = window.location.search || "";
      }

      const urlParams = new URLSearchParams(window.location.search);
      const topParams = new URLSearchParams(topSearch);

      const isPreview =
        urlParams.get("preview") === "true" ||
        topParams.get("preview") === "true";

      const checkDetails = {
        isUltimatePath: topUrl.includes("ultimate-html-editor"),
        hasEditorKeyword: isPreview ? false : topUrl.includes("editor"),
      };

      const isEditor = Object.values(checkDetails).some((val) => val === true);

      if (isPreview) {
        return false;
      }

      return isEditor;
    }

    /**
     * Khởi chạy hiệu ứng
     * @param {string} overrideEffectId - ID ép chạy từ Editor (nếu có)
     */
    init(overrideEffectId) {
      const introEl = document.getElementById("intro");
      if (!introEl) {
        console.warn("Opening Effect: #intro not found.");
        return;
      }

      if (this.isInEditorMode()) {
        this.cleanup();
        return;
      }

      const urlParams = new URLSearchParams(window.location.search);
      const effectId =
        overrideEffectId ||
        introEl.getAttribute("data-opening-effect") ||
        urlParams.get("opening_effect");

      if (!effectId || effectId === "none") {
        this.cleanup();
        return;
      }

      this.currentEffect = effectId;

      // --- Clone #intro to strip ALL event listeners from finalMobileChrome.js ---
      // finalMobileChrome.js registers a bubble-phase click handler on #intro
      // that calls finishIntroAndRevealChrome() + intro.remove() immediately.
      // Creating a fresh element strips all those listeners.
      const attrs = {};
      for (const attr of introEl.attributes) {
        attrs[attr.name] = attr.value;
      }
      const freshIntro = document.createElement("div");
      freshIntro.id = "intro";
      for (const [name, value] of Object.entries(attrs)) {
        freshIntro.setAttribute(name, value);
      }
      introEl.parentNode.replaceChild(freshIntro, introEl);

      freshIntro.style.setProperty("pointer-events", "auto", "important");
      this._introEl = freshIntro;
      this._freshIntro = freshIntro;
      this.setupShadowDOM(freshIntro);
      this.loadEffectScript();

      // --- Duration map (ms) ---
      // Based on each animation script's last setTimeout before "away" class is added.
      // Interactive effects get a generous buffer for user to click.
      const effectDurations = {
        flower: 6000,
        camera: 12000,
        heartcard: 10000,
        envelope: 8000,
        saveDateBloom: 8000,
        savedatebloom: 8000,
        weddingDoorCurtain: 6000,
        weddingdoorcurtain: 6000,
        video: 15000,
      };

      const duration = effectDurations[effectId] || 8000;
      const self = this;
      var finished = false;

      function markFinished() {
        if (finished) return;
        finished = true;
        self.finishIntro();
      }

      // --- Fallback timeout based on effect duration ---
      this._finishTimer = setTimeout(markFinished, duration);

      // --- Also watch for 'away' class (animation signals it's done) ---
      var introObs = new MutationObserver(function (muts) {
        for (var i = 0; i < muts.length; i++) {
          if (muts[i].attributeName === "class" && freshIntro.classList.contains("away")) {
            introObs.disconnect();
            markFinished();
            return;
          }
        }
      });
      introObs.observe(freshIntro, { attributes: true, attributeFilter: ["class"] });
      this._introObs = introObs;
    }

    finishIntro() {
      const introEl = this._introEl || document.getElementById("intro");
      if (!introEl) return;
      try {
        if (this._finishTimer) { clearTimeout(this._finishTimer); this._finishTimer = null; }
        if (this._introObs) { this._introObs.disconnect(); this._introObs = null; }
        introEl.classList.add("intro-done");
        introEl.setAttribute("data-intro-finished", "true");
        introEl.removeAttribute("data-opening-effect");
        introEl.style.setProperty("opacity", "0", "important");
        introEl.style.setProperty("pointer-events", "none", "important");
        document.body?.removeAttribute("data-opening-effect");
        const ids = ["final-bottom-bar", "final-desktop-sidebar", "wish-scroll-viewport"];
        ids.forEach((id) => {
          const el = document.getElementById(id);
          if (el) {
            el.style.setProperty("opacity", "1", "important");
            el.style.setProperty("visibility", "visible", "important");
            el.style.setProperty("pointer-events", "auto", "important");
          }
        });
        document.getElementById("final-mobile-chrome")
          ?.querySelectorAll("[data-chrome-action], button")
          .forEach((el) => {
            el.style.setProperty("pointer-events", "auto", "important");
          });
      } catch (e) {}
      this.cleanup();
    }

    /**
     * Thiết lập Shadow DOM bên trong #intro
     */
    setupShadowDOM(introEl) {
      if (introEl.shadowRoot) {
        this.shadowRoot = introEl.shadowRoot;
      } else if (!this.shadowRoot || this.shadowRoot.host !== introEl) {
        this.shadowRoot = introEl.attachShadow({ mode: "open" });
      }

      this.shadowRoot.innerHTML = "";

      const baseStyle = document.createElement("style");
      baseStyle.textContent = `
      :host {
        position: fixed !important;
        inset: 0 !important;
        z-index: 2147483648 !important;
        background: #000 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        transition: opacity 1s ease;
        overflow: hidden !important;
      }
      :host(.away) {
        opacity: 0 !important;
        pointer-events: none !important;
      }
    `;
      this.shadowRoot.appendChild(baseStyle);
    }

    loadEffectScript() {
      const scriptUrl = this.effectMap[this.currentEffect];
      if (!scriptUrl) {
        console.warn(
          `Opening Effect: Unknown effect "${this.currentEffect}", cleaning up overlay.`,
        );
        this.cleanup();
        return;
      }

      const oldScript = document.querySelector(`script[data-opening-script]`);
      if (oldScript) oldScript.remove();

      const script = document.createElement("script");
      script.src = scriptUrl;
      script.setAttribute("data-opening-script", this.currentEffect);
      script.defer = true;

      window.__openingEffectData = {
        shadowRoot: this.shadowRoot,
        templateData: this.getTemplateData(),
      };

      document.head.appendChild(script);
    }

    getTemplateData() {
      const getVal = (selector) => {
        const el = document.querySelector(selector);
        return el ? el.textContent.trim() : "";
      };

      const groom =
        getVal('[data-editable="groom-name"]') ||
        getVal('[data-editable="groom_name"]');
      const bride =
        getVal('[data-editable="bride-name"]') ||
        getVal('[data-editable="bride_name"]');

      let dateRaw =
        getVal('[data-editable="date-date"]') ||
        getVal('[data-editable="event_date"]') ||
        document
          .querySelector("[data-editdate]")
          ?.getAttribute("data-editdate-value");

      let formattedDate = dateRaw || "";
      if (dateRaw && !isNaN(Date.parse(dateRaw))) {
        const d = new Date(dateRaw);
        formattedDate = `${String(d.getDate()).padStart(2, "0")} · ${String(d.getMonth() + 1).padStart(2, "0")} · ${d.getFullYear()}`;
      }

      return {
        groomName: groom || "Chú rể",
        brideName: bride || "Cô dâu",
        eventDate: formattedDate,
        coupleNames: groom && bride ? `${groom} & ${bride}` : "Lễ Thành Hôn",
      };
    }

    cleanup() {
      // Clear shadow DOM completely
      const introEl = this.shadowRoot?.host || document.getElementById("intro");
      if (this.shadowRoot) {
        this.shadowRoot.innerHTML = "";
        try {
          this.shadowRoot.host?.classList?.remove("away");
          this.shadowRoot.host?.classList?.add("intro-done");
          this.shadowRoot.host?.style?.setProperty("pointer-events", "none", "important");
          this.shadowRoot.host?.removeAttribute("data-opening-preview");
          this.shadowRoot.host?.removeAttribute("data-opening-preview-nonce");
        } catch (e) {
          // ignore
        }
      }

      if (introEl) {
        introEl.classList?.add("intro-done");
        introEl.style?.setProperty("pointer-events", "none", "important");
        introEl.removeAttribute?.("data-opening-preview");
        introEl.removeAttribute?.("data-opening-preview-nonce");
      }

      // Remove old scripts
      const script = document.querySelector(`script[data-opening-script]`);
      if (script) script.remove();

      // Cancel any pending animations
      if (this.currentEffect) {
        const children = this.shadowRoot?.querySelectorAll("*") || [];
        children.forEach((el) => {
          el.style.animation = "none";
        });
      }

      // Clear effect data
      delete window.__openingEffectData;
      this.currentEffect = null;
    }
  }

  window.openingEffectManager = new OpeningEffectManager();

  const runInit = () => {
    const hasOpeningEffect =
      !!document.getElementById("intro")?.getAttribute("data-opening-effect") ||
      !!document.body?.getAttribute("data-opening-effect") ||
      !!document.documentElement?.getAttribute("data-opening-effect") ||
      new URLSearchParams(window.location.search).get("opening_effect");

    // Auto-run when an opening effect is configured (public/published pages).
    // Editor pages remain protected by isInEditorMode() inside init().
    if (hasOpeningEffect) {
      window.openingEffectManager.init();
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", runInit);
  } else {
    runInit();
  }
}

// isInEditorMode() {
//       // Lấy URL của trang ngoài cùng (thanh địa chỉ trình duyệt)
//       // Nếu bị chặn cross-origin, nó sẽ fallback về URL của iframe hiện tại
//       let topUrl = "";
//       try {
//         topUrl = window.top.location.href.toLowerCase();
//       } catch (e) {
//         topUrl = window.location.href.toLowerCase();
//       }

//       const urlParams = new URLSearchParams(window.location.search);
//       const topParams = new URLSearchParams(window.top.location.search);

//       // Kiểm tra Preview Mode ở cả Iframe và Trang cha
//       const isPreview = urlParams.get("preview") === "true" || topParams.get("preview") === "true";

//       // 1. Kiểm tra từng điều kiện cụ thể
//       const checkDetails = {
//         isUltimatePath: topUrl.includes("ultimate-html-editor"),
//         hasEditorKeyword: isPreview ? false : topUrl.includes("editor")
//       };

//       // 2. Ưu tiên Preview Mode
//       if (isPreview) {
//         console.group("Opening Effect: Mode Check - PREVIEW MODE (Allowed)");
//         console.table(checkDetails);
//         console.log("Top URL checked:", topUrl);
//         console.groupEnd();
//         return false;
//       }

//       const isEditor = Object.values(checkDetails).some(val => val === true);

//       console.group(isEditor ? "Opening Effect: IS EDITOR (Blocked)" : "Opening Effect: NOT EDITOR (Allowed)");
//       console.table(checkDetails);
//       console.log("Top URL checked:", topUrl);
//       console.groupEnd();

//       return isEditor;
//     }