(function () {
  if (!window.__openingEffectData || !window.__openingEffectData.shadowRoot) {
    console.warn("Effect3: No shadow root available");
    return;
  }

  const shadowRoot = window.__openingEffectData.shadowRoot;

  const css = `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    :host {
      position: fixed !important; inset: 0 !important;
      z-index: 2147483648 !important;
      background: #111 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      overflow: hidden !important;
      font-family: 'Poppins', sans-serif;
      transition: opacity 1s ease;
    }
    :host(.away) { opacity: 0 !important; pointer-events: none !important; }

    .bg { position: fixed; inset: 0; background: url("https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600") center/cover; filter: brightness(.35); }

    .book {
      position: absolute; left: 50%; top: 50%;
      transform: translate(-50%, -50%);
      width: 90%; max-width: 700px; height: 520px;
      perspective: 2500px;
    }

    .cover {
      position: absolute; inset: 0;
      background: linear-gradient(135deg, #5c3b22, #7b4d2f, #3f2615);
      border-radius: 8px;
      transform-origin: left;
      transition: 2s cubic-bezier(.22,1,.36,1);
      z-index: 10;
      box-shadow: 0 30px 60px rgba(0,0,0,.45);
      display: flex; flex-direction: column;
      justify-content: center; align-items: center;
    }
    .cover::before {
      content: ""; position: absolute; inset: 0;
      background: repeating-linear-gradient(45deg, rgba(255,255,255,.02) 0, rgba(255,255,255,.02) 2px, transparent 2px, transparent 6px);
      opacity: .4;
    }

    .logo { text-align: center; color: #f5d67b; z-index: 2; }
    .logo h3 { letter-spacing: 5px; font-weight: 300; margin-bottom: 12px; font-size: 14px; }
    .logo h1 { font-size: 48px; margin-bottom: 12px; }
    .logo p { letter-spacing: 3px; font-size: 16px; }

    #openBtn {
      margin-top: 40px; padding: 16px 40px; border: none;
      border-radius: 40px; background: #d4af37; color: #fff;
      cursor: pointer; font-size: 16px; font-weight: bold;
      transition: .3s; z-index: 2;
    }
    #openBtn:hover { transform: scale(1.05); }

    .page {
      position: absolute; top: 0; width: 50%; height: 100%;
      background: #fdf7eb; padding: 35px;
      box-shadow: inset 0 0 20px rgba(0,0,0,.08);
    }
    .left-page { left: 0; border-right: 1px solid #ddd; border-radius: 8px 0 0 8px; }
    .right-page { right: 0; border-radius: 0 8px 8px 0; }
    .page h2 { font-size: 32px; margin-bottom: 25px; text-align: center; color: #4d311d; }
    .food {
      display: flex; justify-content: space-between;
      padding: 14px 0; border-bottom: 1px dashed #b7a27d;
      font-size: 15px; color: #333;
    }

    .open .cover { transform: rotateY(-165deg); }
  `;

  const fontLink = document.createElement("link");
  fontLink.rel = "stylesheet";
  fontLink.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Poppins:wght@300;400;500&display=swap";
  document.head.appendChild(fontLink);

  const styleSheet = document.createElement("style");
  styleSheet.textContent = css;
  shadowRoot.appendChild(styleSheet);

  const container = document.createElement("div");
  container.innerHTML = `
    <div class="bg"></div>
    <div class="book" id="book">
      <div class="cover" id="cover">
        <div class="logo">
          <h3>Fine Dining</h3>
          <h1>MENU</h1>
          <p>Luxury Restaurant</p>
        </div>
        <button id="openBtn">XEM THỰC ĐƠN</button>
      </div>
      <div class="page left-page">
        <h2>KHAI VỊ</h2>
        <div class="food"><span>Món khai vị 1</span><span>---</span></div>
        <div class="food"><span>Món khai vị 2</span><span>---</span></div>
        <div class="food"><span>Món khai vị 3</span><span>---</span></div>
      </div>
      <div class="page right-page">
        <h2>MÓN CHÍNH</h2>
        <div class="food"><span>Món chính 1</span><span>---</span></div>
        <div class="food"><span>Món chính 2</span><span>---</span></div>
        <div class="food"><span>Món chính 3</span><span>---</span></div>
      </div>
    </div>
  `;
  shadowRoot.appendChild(container);

  const host = shadowRoot.host;
  const btn = shadowRoot.getElementById("openBtn");

  btn.onclick = function () {
    document.body.classList.add("open");
    host.classList.add("open");
    setTimeout(function () {
      host.classList.add("away");
    }, 2500);
  };
})();
