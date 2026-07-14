(function () {
  if (!window.__openingEffectData || !window.__openingEffectData.shadowRoot) {
    console.warn("Effect1: No shadow root available");
    return;
  }

  const shadowRoot = window.__openingEffectData.shadowRoot;

  const css = `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    :host {
      position: fixed !important; inset: 0 !important;
      z-index: 2147483648 !important;
      background: #000 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      overflow: hidden !important;
      font-family: Arial, sans-serif;
      transition: opacity 1s ease;
    }
    :host(.away) { opacity: 0 !important; pointer-events: none !important; }

    .menu-content {
      position: fixed; inset: 0;
      background: url("https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600") center/cover;
      display: flex; flex-direction: column;
      justify-content: center; align-items: center;
      color: #fff;
    }
    .menu-content::before {
      content: ""; position: absolute; inset: 0;
      background: rgba(0,0,0,.6);
    }
    .menu-content h1, .menu-list { position: relative; z-index: 2; }
    .menu-content h1 { font-size: 42px; margin-bottom: 30px; text-align: center; padding: 0 20px; }
    .menu-list { width: 85%; max-width: 420px; }
    .item {
      display: flex; justify-content: space-between;
      padding: 14px; margin-bottom: 10px;
      background: rgba(255,255,255,.12);
      backdrop-filter: blur(8px); border-radius: 12px;
      font-size: 17px;
    }

    .doors { position: fixed; inset: 0; display: flex; z-index: 10; }
    .door {
      width: 50%; height: 100%; position: relative; overflow: hidden;
      transition: 1.4s cubic-bezier(.77,0,.18,1);
      background: repeating-linear-gradient(90deg, #5b3a29 0px, #6a432d 10px, #7b5237 20px, #5c3928 35px);
      box-shadow: inset 0 0 50px rgba(0,0,0,.45), inset 0 0 8px rgba(255,255,255,.08);
    }
    .left { border-right: 2px solid rgba(255,255,255,.1); }
    .right { border-left: 2px solid rgba(255,255,255,.1); }
    .handle {
      position: absolute; top: 50%; width: 16px; height: 80px;
      transform: translateY(-50%); border-radius: 30px;
      background: linear-gradient(to right, #7a5b12, #d4af37, #fff2b0, #b8860b);
      box-shadow: 0 0 18px rgba(212,175,55,.6);
    }
    .left .handle { right: 25px; }
    .right .handle { left: 25px; }

    #openBtn {
      position: absolute; left: 50%; top: 70%;
      transform: translate(-50%, -50%);
      padding: 16px 40px; border: none; border-radius: 50px;
      background: #fff; font-size: 20px; cursor: pointer;
      z-index: 20; transition: .3s;
    }
    #openBtn:hover { transform: translate(-50%, -50%) scale(1.05); }

    .open .left { transform: translateX(-100%); }
    .open .right { transform: translateX(100%); }
    .open #openBtn { opacity: 0; pointer-events: none; }
  `;

  const styleSheet = document.createElement("style");
  styleSheet.textContent = css;
  shadowRoot.appendChild(styleSheet);

  const container = document.createElement("div");
  container.innerHTML = `
    <div class="menu-content">
      <h1>THỰC ĐƠN</h1>
      <div class="menu-list">
        <div class="item"><span>Món 1</span><span>---</span></div>
        <div class="item"><span>Món 2</span><span>---</span></div>
        <div class="item"><span>Món 3</span><span>---</span></div>
        <div class="item"><span>Món 4</span><span>---</span></div>
      </div>
    </div>
    <div class="doors" id="doors">
      <div class="door left"><div class="handle"></div></div>
      <div class="door right"><div class="handle"></div></div>
      <button id="openBtn">XEM THỰC ĐƠN</button>
    </div>
  `;
  shadowRoot.appendChild(container);

  const btn = shadowRoot.getElementById("openBtn");
  const doors = shadowRoot.getElementById("doors");
  const host = shadowRoot.host;

  btn.onclick = function () {
    doors.classList.add("open");
    setTimeout(function () {
      host.classList.add("away");
    }, 1600);
  };
})();
