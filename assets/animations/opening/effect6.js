(function () {
  if (!window.__openingEffectData || !window.__openingEffectData.shadowRoot) {
    console.warn("Effect6: No shadow root available");
    return;
  }

  const shadowRoot = window.__openingEffectData.shadowRoot;

  const style = document.createElement("style");
  style.textContent = `
    * { margin: 0; padding: 0; box-sizing: border-box; }

    :host {
      position: fixed !important; inset: 0 !important;
      z-index: 2147483648 !important;
      background: #000 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      overflow: hidden !important;
      transition: opacity 1s ease;
    }
    :host(.away) { opacity: 0 !important; pointer-events: none !important; }

    .loader{
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }

    .stall{
      position: relative;
      width: 220px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .mount{
      width: 150px;
      height: 4px;
      background: #66768A;
      border-radius: 2px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.5);
    }

    .signRig{
      width: 74px;
      height: 30px;
      position: relative;
      transform-origin: top center;
      animation: swing 3.4s ease-in-out infinite;
    }
    .signRig::before,
    .signRig::after{
      content: "";
      position: absolute;
      top: 0;
      width: 1px;
      height: 12px;
      background: #66768A;
    }
    .signRig::before{ left: 6px; }
    .signRig::after{ right: 6px; }

    .placard{
      position: absolute;
      top: 12px;
      left: 0;
      width: 74px;
      height: 18px;
      background: linear-gradient(160deg, #21252F, #14161D);
      border: 1px solid rgba(255,210,122,0.4);
      border-radius: 3px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 9px;
      letter-spacing: 2px;
      color: #FFD27A;
      text-shadow: 0 0 6px rgba(255,210,122,0.8);
      font-family: 'Trebuchet MS', 'Segoe UI', sans-serif;
    }

    @keyframes swing{
      0%, 100% { transform: rotate(-3deg); }
      50%      { transform: rotate(3deg); }
    }

    .awning{
      width: 216px;
      height: 22px;
      margin-top: 8px;
      background: repeating-linear-gradient(
        90deg,
        #B3423A 0 18px,
        #F1E6D3 18px 36px
      );
      border-radius: 6px 6px 0 0;
      position: relative;
      box-shadow: 0 2px 4px rgba(0,0,0,0.35);
    }

    .fringe{
      width: 216px;
      height: 10px;
      background-image:
        linear-gradient(135deg, #8C3129 25%, transparent 25.5%),
        linear-gradient(225deg, #8C3129 25%, transparent 25.5%);
      background-size: 18px 18px;
      background-position: 0 0;
      background-color: #F1E6D3;
    }

    .lights{
      position: absolute;
      bottom: -3px;
      left: 8px;
      right: 8px;
      display: flex;
      justify-content: space-between;
    }
    .lights span{
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: #FFD27A;
      box-shadow: 0 0 4px 1px rgba(255,210,122,0.9);
      animation: twinkle 1.8s ease-in-out infinite;
    }
    .lights span:nth-child(odd){ animation-delay: 0.3s; }
    .lights span:nth-child(3n){ animation-delay: 0.6s; }
    .lights span:nth-child(4n){ animation-delay: 0.9s; }

    @keyframes twinkle{
      0%, 100% { opacity: 0.35; }
      50%      { opacity: 1; }
    }

    .doorway{
      width: 216px;
      height: 108px;
      position: relative;
      overflow: hidden;
      border-radius: 0 0 6px 6px;
      box-shadow: inset 0 0 0 2px rgba(0,0,0,0.4);
    }

    .interior{
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at 50% 105%, #FFB35C, #4A2E1C 55%, #241812 100%);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-end;
      padding-bottom: 14px;
    }

    .signGlow{
      font-size: 20px;
      font-weight: 700;
      letter-spacing: 3px;
      color: #FFF3DE;
      text-shadow:
        0 0 6px #FFD27A,
        0 0 16px #FFB35C,
        0 0 28px rgba(255,179,92,0.6);
      margin-bottom: 10px;
      font-family: 'Trebuchet MS', 'Segoe UI', sans-serif;
    }

    .bowl{ position: relative; width: 40px; height: 16px; }
    .bowl::before{
      content: "";
      position: absolute;
      inset: 0;
      background: #F1E6D3;
      border-radius: 0 0 20px 20px;
    }
    .bowl::after{
      content: "";
      position: absolute;
      top: -2px;
      left: -2px;
      right: -2px;
      height: 4px;
      background: #D8C6A2;
      border-radius: 50%;
    }

    .steam{ position: absolute; bottom: 40px; display: flex; gap: 6px; }
    .steam span{
      width: 2px;
      height: 10px;
      border-radius: 2px;
      background: rgba(241, 230, 211, 0.55);
      animation: rise 2.2s ease-in infinite;
    }
    .steam span:nth-child(1){ animation-delay: 0s; }
    .steam span:nth-child(2){ animation-delay: 0.5s; }
    .steam span:nth-child(3){ animation-delay: 1s; }

    @keyframes rise{
      0%   { transform: translateY(0) scaleY(1); opacity: 0; }
      30%  { opacity: 0.7; }
      100% { transform: translateY(-18px) scaleY(1.7); opacity: 0; }
    }

    .roller{
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 8px;
      background: #20232C;
      box-shadow: 0 2px 3px rgba(0,0,0,0.5);
      z-index: 3;
    }

    .shutter{
      position: absolute;
      top: 8px; left: 0; right: 0;
      height: calc(100% - 8px);
      transform-origin: top;
      background: repeating-linear-gradient(
        #66768A 0 3px,
        #2E3644 3px 7px
      );
      animation: rollUp 3.6s cubic-bezier(.65,0,.35,1) infinite;
      z-index: 2;
    }

    .shutter::after{
      content: "";
      position: absolute;
      bottom: 0; left: 0; right: 0;
      height: 6px;
      background: #66768A;
      box-shadow: 0 1px 2px rgba(0,0,0,0.4);
    }

    @keyframes rollUp{
      0%, 10%  { transform: scaleY(1); }
      45%, 65% { transform: scaleY(0.05); }
      95%,100% { transform: scaleY(1); }
    }

    .ground{
      width: 240px;
      height: 6px;
      border-radius: 3px;
      background: #0D0E17;
      box-shadow: 0 1px 0 rgba(255,255,255,0.03);
    }

    .label{
      font-size: 13px;
      letter-spacing: 0.3px;
      color: #CBBFA8;
      font-family: 'Trebuchet MS', 'Segoe UI', sans-serif;
    }
    .label .dots span{
      animation: blink 1.4s infinite;
      opacity: 0;
    }
    .label .dots span:nth-child(1){ animation-delay: 0s; }
    .label .dots span:nth-child(2){ animation-delay: 0.25s; }
    .label .dots span:nth-child(3){ animation-delay: 0.5s; }

    @keyframes blink{
      0%, 20% { opacity: 0; }
      40%     { opacity: 1; }
      100%    { opacity: 0; }
    }
  `;
  shadowRoot.appendChild(style);

  const container = document.createElement("div");
  container.style.cssText = "display:flex;flex-direction:column;align-items:center;gap:16px;";
  container.innerHTML = `
    <div class="stall">
      <div class="mount"></div>
      <div class="signRig">
        <div class="placard">QUÁN</div>
      </div>
      <div class="awning">
        <div class="lights">
          <span></span><span></span><span></span><span></span>
          <span></span><span></span><span></span><span></span>
        </div>
      </div>
      <div class="fringe"></div>
      <div class="doorway">
        <div class="interior">
          <div class="signGlow">MENU</div>
          <div class="steam"><span></span><span></span><span></span></div>
          <div class="bowl"></div>
        </div>
        <div class="shutter"></div>
        <div class="roller"></div>
      </div>
    </div>
    <div class="ground"></div>
    <div class="label">Đang kéo cửa, bật đèn menu<span class="dots"><span>.</span><span>.</span><span>.</span></span></div>
  `;
  shadowRoot.appendChild(container);

  // Click anywhere to dismiss early
  const host = shadowRoot.host;
  host.addEventListener("click", function dismiss() {
    host.classList.add("away");
    host.removeEventListener("click", dismiss);
  });

  // Auto-dismiss after animation completes (door opens and closes once ~4s)
  setTimeout(function () {
    host.classList.add("away");
  }, 4200);
})();
