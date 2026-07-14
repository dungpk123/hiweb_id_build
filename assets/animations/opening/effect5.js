(function () {
    if (!window.__openingEffectData || !window.__openingEffectData.shadowRoot) {
        console.warn("Effect5: No shadow root available");
        return;
    }

    const shadowRoot = window.__openingEffectData.shadowRoot;

    const css = `
    :root {
      --lacquer: #7a1f1f;
      --lacquer-dark: #4e1212;
      --rice-paper: #ede2c8;
      --rice-paper-dark: #e2d3ac;
      --ink: #2a1f14;
      --gold: #c9a15a;
      --gold-bright: #e6c983;
      --seal-red: #a3281f;
    }

    * { box-sizing: border-box; }

    :host {
      position: fixed !important;
      inset: 0 !important;
      z-index: 2147483648 !important;
      background: radial-gradient(ellipse at top, #2b1a12 0%, #140b07 70%) !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      overflow: hidden !important;
      padding: 40px 16px !important;
      font-family: "Noto Serif", serif;
      transition: opacity 1s ease;
    }

    :host(.away) {
      opacity: 0 !important;
      pointer-events: none !important;
    }

    .stage {
      position: relative;
      width: min(420px, 90vw);
      display: flex;
      flex-direction: column;
      align-items: center;
      filter: drop-shadow(0 30px 60px rgba(0,0,0,0.55));
    }

    .hint {
      color: var(--gold);
      font-family: "Noto Serif SC", serif;
      letter-spacing: 0.35em;
      font-size: 12px;
      text-transform: uppercase;
      margin-bottom: 18px;
      opacity: 0.75;
      text-align: center;
      transition: opacity .4s ease;
    }

    .stage.open .hint { opacity: 0; }

    .roller {
      position: relative;
      width: calc(100% + 46px);
      height: 26px;
      border-radius: 13px;
      background: linear-gradient(180deg, #6b4322 0%, #4a2c14 45%, #2c1a0b 100%);
      box-shadow:
        inset 0 3px 4px rgba(255,255,255,0.25),
        inset 0 -4px 6px rgba(0,0,0,0.5),
        0 4px 10px rgba(0,0,0,0.5);
      z-index: 5;
    }

    .roller::before, .roller::after {
      content: "";
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background: radial-gradient(circle at 35% 30%, var(--gold-bright), var(--gold) 55%, #7a5a26 100%);
      box-shadow: 0 3px 8px rgba(0,0,0,0.6), inset 0 0 4px rgba(0,0,0,0.4);
    }

    .roller::before { left: -15px; }
    .roller::after { right: -15px; }

    .roller-top { margin-bottom: -2px; }
    .roller-bottom { margin-top: -2px; transition: transform 1.1s cubic-bezier(.25,.85,.35,1); }

    .tassel {
      position: absolute;
      top: 100%;
      width: 3px;
      height: 46px;
      background: linear-gradient(180deg, var(--seal-red), #6e120c);
    }

    .tassel.left { left: 10%; }
    .tassel.right { right: 10%; }

    .tassel::after {
      content: "";
      position: absolute;
      bottom: -10px;
      left: 50%;
      transform: translateX(-50%);
      width: 16px;
      height: 16px;
      border-radius: 0 0 50% 50%;
      background: radial-gradient(circle at 40% 20%, #d1493c, var(--seal-red) 70%);
      box-shadow: 0 3px 6px rgba(0,0,0,0.5);
    }

    .paper-clip {
      width: 100%;
      height: 0px;
      overflow: hidden;
      transition: height 1.1s cubic-bezier(.25,.85,.35,1);
      position: relative;
      z-index: 3;
    }

    .paper {
      width: 100%;
      background:
        radial-gradient(120% 60% at 50% 0%, rgba(255,255,255,0.35), rgba(255,255,255,0) 55%),
        repeating-linear-gradient(90deg, rgba(120,90,40,0.05) 0 2px, transparent 2px 5px),
        linear-gradient(180deg, var(--rice-paper) 0%, var(--rice-paper-dark) 100%);
      background-color: var(--rice-paper);
      border-left: 1px solid #c9b581;
      border-right: 1px solid #c9b581;
      padding: 26px 30px;
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 160px;
    }

    .paper::before {
      content: "";
      position: absolute;
      inset: 0;
      background-image: radial-gradient(rgba(120,90,40,0.06) 1px, transparent 1px);
      background-size: 9px 9px;
      pointer-events: none;
      mix-blend-mode: multiply;
    }

    .paper-clip::after {
      content: "";
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 28px;
      background: linear-gradient(180deg, rgba(0,0,0,0), rgba(0,0,0,0.28));
      opacity: 1;
      transition: opacity .5s ease .6s;
      pointer-events: none;
    }

    .stage.open .paper-clip::after { opacity: 0; }

    .reveal-title {
      text-align: center;
      opacity: 0;
      transform: translateY(8px);
      transition: opacity .5s ease .55s, transform .5s ease .55s;
    }

    .stage.open .reveal-title { opacity: 1; transform: none; }

    .reveal-title .cn {
      font-family: "Ma Shan Zheng", cursive;
      font-size: 34px;
      color: var(--lacquer);
      line-height: 1;
    }

    .reveal-title .sub {
      display: block;
      margin-top: 6px;
      font-family: "Noto Serif SC", serif;
      letter-spacing: 0.3em;
      font-size: 11px;
      color: var(--lacquer-dark);
      text-transform: uppercase;
    }

    .seal-btn {
      position: relative;
      z-index: 10;
      width: 78px;
      height: 78px;
      border-radius: 50%;
      border: none;
      cursor: pointer;
      margin-top: -39px;
      background: radial-gradient(circle at 35% 30%, #c2453a, var(--seal-red) 55%, #6e120c 100%);
      box-shadow: 0 8px 18px rgba(0,0,0,0.55), inset 0 2px 3px rgba(255,255,255,0.25);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform .35s ease, opacity .5s ease .3s, box-shadow .35s ease;
    }

    .seal-btn span {
      font-family: "Ma Shan Zheng", cursive;
      color: var(--gold-bright);
      font-size: 30px;
      transform: rotate(2deg);
    }

    .seal-btn:hover { transform: scale(1.06); box-shadow: 0 10px 22px rgba(0,0,0,0.6), inset 0 2px 3px rgba(255,255,255,0.3); }
    .seal-btn:active { transform: scale(0.95); }

    .stage.open .seal-btn {
      opacity: 0;
      pointer-events: none;
      transform: scale(0.6) translateY(10px);
    }
  `;

    const styleSheet = document.createElement("style");
    styleSheet.textContent = css;
    shadowRoot.appendChild(styleSheet);

    const container = document.createElement("div");
    container.innerHTML = `
    <div class="stage" id="stage">
      <div class="hint">Chạm vào ấn triện để mở thực đơn</div>

      <div class="roller roller-top"></div>

      <div class="paper-clip" id="paperClip">
        <div class="paper" id="paperContent">
          <div class="reveal-title">
            <span class="cn">琅 園</span>
            <span class="sub">Lãng Viên</span>
          </div>
        </div>
      </div>

      <div class="roller roller-bottom" id="rollerBottom">
        <div class="tassel left"></div>
        <div class="tassel right"></div>
      </div>

      <button class="seal-btn" id="sealBtn" aria-label="Mở thực đơn"><span>開</span></button>
    </div>
  `;
    shadowRoot.appendChild(container);

    const stage = shadowRoot.getElementById("stage");
    const clip = shadowRoot.getElementById("paperClip");
    const content = shadowRoot.getElementById("paperContent");
    const btn = shadowRoot.getElementById("sealBtn");
    const host = shadowRoot.host;

    let openedIntro = false;

    function openScroll() {
        if (openedIntro) return;
        openedIntro = true;

        const h = content.scrollHeight;
        clip.style.height = h + "px";
        stage.classList.add("open");

        setTimeout(function () {
            host.classList.add("away");
        }, 1200);
    }

    btn.addEventListener("click", openScroll);
})();
