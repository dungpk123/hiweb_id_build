(function () {
  if (!window.__openingEffectData || !window.__openingEffectData.shadowRoot) {
    console.warn("Effect2: No shadow root available");
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

    .bg { position: fixed; inset: 0; background: url("https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1920&auto=format&fit=crop") center/cover no-repeat; transform: scale(1.05); }
    .overlay { position: fixed; inset: 0; background: rgba(0,0,0,.72); }

    .light {
      position: fixed; left: 50%; top: 0; transform: translateX(-50%);
      width: 12px; height: 100%;
      background: linear-gradient(to bottom, rgba(255,255,220,.95), rgba(255,215,120,.55), transparent);
      filter: blur(22px); animation: pulse 2.4s infinite; z-index: 3;
    }
    @keyframes pulse {
      0%,100% { opacity: .45; width: 10px; }
      50% { opacity: 1; width: 26px; }
    }

    .particles { position: fixed; inset: 0; pointer-events: none; z-index: 4; }
    .particles span {
      position: absolute; width: 5px; height: 5px; border-radius: 50%;
      background: #ffe9a8; box-shadow: 0 0 12px #fff4c8;
      opacity: 0; animation: float 6s linear infinite;
    }
    .particles span:nth-child(1) { left: 49%; bottom: 0; animation-delay: 0s; }
    .particles span:nth-child(2) { left: 51%; bottom: -5%; animation-delay: .6s; }
    .particles span:nth-child(3) { left: 48%; bottom: -8%; animation-delay: 1.2s; }
    .particles span:nth-child(4) { left: 52%; bottom: -10%; animation-delay: 1.8s; }
    .particles span:nth-child(5) { left: 50%; bottom: -12%; animation-delay: 2.4s; }
    @keyframes float {
      0% { transform: translateY(0) scale(.3); opacity: 0; }
      20% { opacity: .9; }
      100% { transform: translateY(-850px) scale(1.8); opacity: 0; }
    }

    .hero {
      position: absolute; left: 50%; top: 50%;
      transform: translate(-50%, -50%);
      display: flex; flex-direction: column; align-items: center;
      z-index: 20; color: white; transition: 1s;
    }
    .logo { text-align: center; margin-bottom: 30px; }
    .logo h3 { font-weight: 300; letter-spacing: 6px; font-size: 16px; text-transform: uppercase; opacity: .85; }
    .logo h1 { font-size: 48px; margin: 10px 0; letter-spacing: 3px; }
    .logo p { font-size: 16px; opacity: .8; }

    .plate { position: relative; width: 340px; height: 280px; display: flex; justify-content: center; align-items: center; }
    .dish {
      position: absolute; bottom: 20px; width: 260px; height: 45px;
      border-radius: 50%; background: linear-gradient(#ddd, #fafafa);
      box-shadow: 0 15px 30px rgba(0,0,0,.45), inset 0 4px 8px rgba(255,255,255,.7);
    }
    .glow {
      position: absolute; bottom: 45px; width: 180px; height: 100px;
      background: radial-gradient(circle, rgba(255,230,150,.9), transparent 70%);
      filter: blur(35px); animation: glow 2s infinite;
    }
    @keyframes glow { 50% { transform: scale(1.15); opacity: .9; } }

    .cloche {
      position: absolute; bottom: 40px; width: 240px; height: 130px;
      border-radius: 240px 240px 0 0;
      background: linear-gradient(to bottom, #fff 0%, #ececec 25%, #cfcfcf 50%, #f8f8f8 75%, #bdbdbd 100%);
      box-shadow: inset 0 8px 20px rgba(255,255,255,.8), inset 0 -12px 20px rgba(0,0,0,.15), 0 15px 40px rgba(0,0,0,.45);
      transform-origin: bottom center; transition: 1.3s cubic-bezier(.2,.8,.2,1);
      z-index: 20;
    }
    .cloche::before {
      content: ""; position: absolute; left: 8px; right: 8px; top: 8px; bottom: 8px;
      border-radius: 220px 220px 0 0; border: 2px solid rgba(255,255,255,.55);
    }
    .cloche-handle {
      position: absolute; left: 50%; top: -20px; transform: translateX(-50%);
      width: 40px; height: 40px; border-radius: 50%;
      background: linear-gradient(to bottom, #ffe9a3, #d4af37, #8b6914);
      box-shadow: 0 0 20px rgba(212,175,55,.6), inset 0 2px 5px rgba(255,255,255,.8);
    }

    .steam {
      position: absolute; bottom: 70px; width: 8px; height: 70px;
      border-radius: 50%;
      background: linear-gradient(to top, rgba(255,255,255,.45), transparent);
      filter: blur(6px); opacity: .6; animation: steam 4s linear infinite;
    }
    .s1 { left: 130px; } .s2 { left: 155px; animation-delay: .6s; }
    .s3 { left: 180px; animation-delay: 1.2s; } .s4 { left: 205px; animation-delay: 1.8s; }
    .s5 { left: 230px; animation-delay: 2.4s; }
    @keyframes steam {
      0% { transform: translateY(20px) scale(.8); opacity: 0; }
      30% { opacity: .5; }
      100% { transform: translateY(-100px) scale(1.5); opacity: 0; }
    }

    #openBtn {
      margin-top: 20px; padding: 16px 50px; border: none;
      border-radius: 60px; background: #d4af37; color: #fff;
      font-size: 16px; font-weight: 600; cursor: pointer;
      letter-spacing: 2px; transition: .3s;
      box-shadow: 0 15px 30px rgba(0,0,0,.35);
    }
    #openBtn:hover { transform: translateY(-3px) scale(1.04); background: #e2bc45; }

    .open .cloche { transform: translateY(-400px) scale(.6) rotate(-20deg); opacity: 0; visibility: hidden; pointer-events: none; }
    .open .hero { opacity: 0; visibility: hidden; pointer-events: none; transition: all .8s ease; }
    .open .light { opacity: 0; transition: 1s; }
    .open .particles { opacity: 0; transition: .8s; }
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
    <div class="overlay"></div>
    <div class="light"></div>
    <div class="particles">
      <span></span><span></span><span></span><span></span><span></span>
    </div>
    <div class="hero" id="hero">
      <div class="logo">
        <h3>Fine Dining</h3>
        <h1>MENU</h1>
        <p>Luxury Restaurant</p>
      </div>
      <div class="plate">
        <div class="steam s1"></div><div class="steam s2"></div><div class="steam s3"></div>
        <div class="steam s4"></div><div class="steam s5"></div>
        <div class="glow"></div><div class="dish"></div>
        <div class="cloche" id="cloche"><div class="cloche-handle"></div></div>
      </div>
      <button id="openBtn">XEM THỰC ĐƠN</button>
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
    }, 1500);
  };
})();
