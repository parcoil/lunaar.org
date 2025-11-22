document.addEventListener("DOMContentLoaded", () => {
  if (!window.lunaarConsoleLogged) {
    console.log(
      `%cLunaar%c v7 - main.js Loaded`,
      "font-size: 16px; background-color: #9282fb; border-top-left-radius: 5px; border-bottom-left-radius: 5px; padding: 4px; font-weight: bold;",
      "font-size: 16px; background-color: #090810; font-weight: bold; padding: 4px; border-top-right-radius: 5px; border-bottom-right-radius: 5px;"
    );

    const ascii = `
 _._     _,-'""\`-._
(,-.\`._,'(       |\\\`-/|
        \`-.-' \\ )-\`( , o o)
                    \`-    \\_\`"'- 
        `;

    console.log(
      `%c${ascii}\ndiscord.gg/En5YJYWj3Z`,
      "font-size: 24px; display: block; white-space: pre; text-align: center;"
    );

    window.lunaarConsoleLogged = true;
  }

  const theme = localStorage.getItem("theme");
  const background = localStorage.getItem("backgroundImage");

  if (background) {
    console.log(background);
    document.body.style.backgroundImage = `url(${background})`;
  }
  if (theme) {
    document.body.setAttribute("theme", theme);
  }

  window.updateParticles = function () {
    const checkTheme = localStorage.getItem("theme");
    switch (checkTheme) {
      case "ssb":
        const leafContSSB = document.getElementById("leaf-container");
        if (leafContSSB) leafContSSB.remove();
        const leafScriptSSB = document.querySelector(
          'script[src="../js/leafs.js"]'
        );
        if (leafScriptSSB) leafScriptSSB.remove();
        window.leafsLoaded = false;
        if (localStorage.getItem("stars") === "true") {
          document.getElementById("particles-js").style.display = "block";
        }
        particlesJS("particles-js", {"particles":{"number":{"value":43,"density":{"enable":true,"value_area":800}},"color":{"value":"#fff"},"shape":{"type":"circle","stroke":{"width":0,"color":"#000000"},"polygon":{"nb_sides":5},"image":{"src":"img/github.svg","width":100,"height":100}},"opacity":{"value":0.5,"random":true,"anim":{"enable":false,"speed":1,"opacity_min":0.1,"sync":false}},"size":{"value":10,"random":true,"anim":{"enable":false,"speed":40,"size_min":0.1,"sync":false}},"line_linked":{"enable":false,"distance":500,"color":"#ffffff","opacity":0.4,"width":2},"move":{"enable":true,"speed":6,"direction":"bottom","random":false,"straight":false,"out_mode":"out","bounce":false,"attract":{"enable":false,"rotateX":600,"rotateY":1200}}},"interactivity":{"detect_on":"canvas","events":{"onhover":{"enable":true,"mode":"bubble"},"onclick":{"enable":true,"mode":"repulse"},"resize":true},"modes":{"grab":{"distance":400,"line_linked":{"opacity":0.5}},"bubble":{"distance":400,"size":4,"duration":0.3,"opacity":1,"speed":3},"repulse":{"distance":200,"duration":0.4},"push":{"particles_nb":4},"remove":{"particles_nb":2}}},"retina_detect":true}); // prettier-ignore
        break;
      case "grey":
        const leafContGrey = document.getElementById("leaf-container");
        if (leafContGrey) leafContGrey.remove();
        const leafScriptGrey = document.querySelector(
          'script[src="../js/leafs.js"]'
        );
        if (leafScriptGrey) leafScriptGrey.remove();
        window.leafsLoaded = false;
        if (localStorage.getItem("stars") === "true") {
          document.getElementById("particles-js").style.display = "block";
        }
        particlesJS("particles-js", {"particles":{"number":{"value":80,"density":{"enable":true,"value_area":800}},"color":{"value":"#ffffff"},"shape":{"type":"circle","stroke":{"width":0,"color":"#000000"},"polygon":{"nb_sides":5},"image":{"src":"img/github.svg","width":100,"height":100}},"opacity":{"value":0.5,"random":false,"anim":{"enable":false,"speed":1,"opacity_min":0.1,"sync":false}},"size":{"value":3,"random":true,"anim":{"enable":false,"speed":40,"size_min":0.1,"sync":false}},"line_linked":{"enable":true,"distance":150,"color":"#ffffff","opacity":0.4,"width":1},"move":{"enable":true,"speed":6,"direction":"none","random":false,"straight":false,"out_mode":"out","bounce":false,"attract":{"enable":false,"rotateX":600,"rotateY":1200}}},"interactivity":{"detect_on":"canvas","events":{"onhover":{"enable":true,"mode":"repulse"},"onclick":{"enable":true,"mode":"push"},"resize":true},"modes":{"grab":{"distance":400,"line_linked":{"opacity":1}},"bubble":{"distance":400,"size":40,"duration":2,"opacity":8,"speed":3},"repulse":{"distance":200,"duration":0.4},"push":{"particles_nb":4},"remove":{"particles_nb":2}}},"retina_detect":true}); // prettier-ignore
        break;
      case "audi":
        const leafContAudi = document.getElementById("leaf-container");
        if (leafContAudi) leafContAudi.remove();
        const leafScriptAudi = document.querySelector(
          'script[src="../js/leafs.js"]'
        );
        if (leafScriptAudi) leafScriptAudi.remove();
        window.leafsLoaded = false;
        if (localStorage.getItem("stars") === "true") {
          document.getElementById("particles-js").style.display = "block";
        }
        particlesJS("particles-js", {"particles":{"number":{"value":10,"density":{"enable":true,"value_area":800}},"color":{"value":"#f50537"},"shape":{"type":"circle","stroke":{"width":0,"color":"#000"},"polygon":{"nb_sides":3},"image":{"src":"img/github.svg","width":100,"height":100}},"opacity":{"value":0.8286181017543023,"random":true,"anim":{"enable":true,"speed":0.1,"opacity_min":0.1,"sync":false}},"size":{"value":100,"random":false,"anim":{"enable":true,"speed":10,"size_min":40,"sync":false}},"line_linked":{"enable":false,"distance":536.6288658980243,"color":"#f50537","opacity":1,"width":2},"move":{"enable":true,"speed":8,"direction":"bottom","random":true,"straight":false,"out_mode":"out","bounce":false,"attract":{"enable":false,"rotateX":600,"rotateY":1200}}},"interactivity":{"detect_on":"canvas","events":{"onhover":{"enable":false,"mode":"repulse"},"onclick":{"enable":false,"mode":"remove"},"resize":true},"modes":{"grab":{"distance":400,"line_linked":{"opacity":1}},"bubble":{"distance":400,"size":267.7151510792516,"duration":2,"opacity":8,"speed":3},"repulse":{"distance":223.76191731997147,"duration":0.4},"push":{"particles_nb":4},"remove":{"particles_nb":2}}},"retina_detect":true}); // prettier-ignore
        break;
      case "starlight":
        const leafContStar = document.getElementById("leaf-container");
        if (leafContStar) leafContStar.remove();
        const leafScriptStar = document.querySelector(
          'script[src="../js/leafs.js"]'
        );
        if (leafScriptStar) leafScriptStar.remove();
        window.leafsLoaded = false;
        if (localStorage.getItem("stars") === "true") {
          document.getElementById("particles-js").style.display = "block";
        }
        particlesJS("particles-js", {"particles":{"number":{"value":38,"density":{"enable":true,"value_area":800}},"color":{"value":"#ffffff"},"shape":{"type":"star","stroke":{"width":0,"color":"#000000"},"polygon":{"nb_sides":5},"image":{"src":"img/github.svg","width":100,"height":100}},"opacity":{"value":0.5,"random":false,"anim":{"enable":false,"speed":1,"opacity_min":0.1,"sync":false}},"size":{"value":3.945738208161363,"random":false,"anim":{"enable":false,"speed":40,"size_min":0.1,"sync":false}},"line_linked":{"enable":true,"distance":150,"color":"#ffffff","opacity":0.4,"width":1},"move":{"enable":true,"speed":0.5,"direction":"none","random":false,"straight":false,"out_mode":"out","bounce":false,"attract":{"enable":false,"rotateX":600,"rotateY":1200}}},"interactivity":{"detect_on":"window","events":{"onhover":{"enable":true,"mode":"repulse"},"onclick":{"enable":true,"mode":"push"},"resize":true},"modes":{"grab":{"distance":400,"line_linked":{"opacity":1}},"bubble":{"distance":400,"size":40,"duration":2,"opacity":8,"speed":3},"repulse":{"distance":200,"duration":0.4},"push":{"particles_nb":4},"remove":{"particles_nb":2}}},"retina_detect":true}); // prettier-ignore
        break;
      case "halloween":
        document.getElementById("particles-js").style.display = "none";
        if (!window.leafsLoaded) {
          const script = document.createElement("script");
          script.src = "../js/leafs.js";
          script.onload = () => {
            window.leafsLoaded = true;
          };
          document.head.appendChild(script);
        }
        const leafContHall = document.getElementById("leaf-container");
        if (leafContHall) {
          leafContHall.style.display =
            localStorage.getItem("stars") === "true" ? "block" : "none";
        }
        break;
      default:
        const leafContDef = document.getElementById("leaf-container");
        if (leafContDef) leafContDef.remove();
        const leafScriptDef = document.querySelector(
          'script[src="../js/leafs.js"]'
        );
        if (leafScriptDef) leafScriptDef.remove();
        window.leafsLoaded = false;
        if (localStorage.getItem("stars") === "true") {
          document.getElementById("particles-js").style.display = "block";
        }
        particlesJS("particles-js", { particles: { number: { value: 160, density: { enable: true, value_area: 800 } }, color: { value: "#ffffff" }, shape: { type: "circle", stroke: { width: 0, color: "#000000" }, polygon: { nb_sides: 5 }, image: { src: "img/github.svg", width: 100, height: 100 } }, opacity: { value: 1, random: true, anim: { enable: false, speed: 1, opacity_min: 0, sync: false } }, size: { value: 3, random: true, anim: { enable: false, speed: 4, size_min: 0.3, sync: false } }, line_linked: { enable: false, distance: 150, color: "#ffffff", opacity: 0.4, width: 1 }, move: { enable: true, speed: 1, direction: "none", random: true, straight: false, out_mode: "out", bounce: false, attract: { enable: false, rotateX: 600, rotateY: 600 } } }, interactivity: { detect_on: "canvas", events: { onhover: { enable: false, mode: "repulse" }, onclick: { enable: true, mode: "push" }, resize: true }, modes: { grab: { distance: 400, line_linked: { opacity: 1 } }, bubble: { distance: 250, size: 0, duration: 2, opacity: 0, speed: 3 }, repulse: { distance: 400, duration: 0.4 }, push: { particles_nb: 4 }, remove: { particles_nb: 2 } } }, retina_detect: true }); // prettier-ignore
        break;
    }
  };

  updateParticles();

  const prxBackend = localStorage.getItem("proxy-backend");

  if (!prxBackend) {
    localStorage.setItem("proxy-backend", "ultraviolet");
  }

  fetch("/api/version")
    .then((res) => res.json())
    .then((ver) => {
      const footer = document.querySelector(".footer");
      if (footer) {
        footer.insertAdjacentHTML(
          "beforeend",
          `<a class="link footer-version" href="https://github.com/parcoil/lunaar.org"> v${ver.version}</a>`
        );
      }
    });

  if (
    window.localStorage.getItem("disableTips") !== "true" &&
    window.localStorage.getItem("v7toast") === "true"
  ) {
    const randomMessages = [
      "Did you know? Lunaar V7 is awesome!",
      "Luna AI is Amazing. you should try it out!",
      "350+ games and counting!",
      "350+ games and counting!",
      "SCRAMJET WHAT",
      "Have you tried the new proxy backend scramjet?",
      "Did you know? You can set a panic button in settings",
      "Did you know? You can change themes in settings",
      "Did you know? You can Disable Particles and Blobs in settings",
      "Did you know? You can Export and Import your save data in settings",
      "Did you know? You can Export and Import your save data in settings",
      'Proxy giving you issues? try changing the "Transport" in settings',
      "https://discord.gg/En5YJYWj3Z",
      "https://discord.gg/En5YJYWj3Z",
      "Have a Windows PC? Check out Sparkle! at getsparkle.net",
      "Join our discord for support and updates! discord.gg/En5YJYWj3Z",
      "Welcome Back to lunaar!",
      "Welcome Back to lunaar!",
      "Tip: You can disable tips in settings (but dont be mean keep them on :3)",
    ];

    const message =
      randomMessages[Math.floor(Math.random() * randomMessages.length)];
    const urlMatch = message.match(/(https?:\/\/[^\s]+|discord\.gg\/[^\s]+)/);
    const destination = urlMatch
      ? urlMatch[0].startsWith("http")
        ? urlMatch[0]
        : "https://" + urlMatch[0]
      : null;

    Toastify({
      text: message,
      duration: 3000,
      gravity: "bottom",
      destination: destination || undefined,
      position: "right",
      style: {
        background: "var(--primary-color)",
        borderRadius: "var(--border-radius)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
      },
    }).showToast();
  }
  if (localStorage.getItem("v7toast") !== "true") {
    Toastify({
      text: `Welcome To Lunaar V7`,
      duration: 5000,
      gravity: "bottom",
      position: "right",
      style: {
        background: "var(--accent-color)",
        // boxShadow: "0 3px 6px -1px var(--primary-color),0 10px 36px -4px var(--accent-color)",
        borderRadius: "var(--border-radius)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
      },
    }).showToast();

    localStorage.setItem("v7toast", true);
  }
  // const transport = localStorage.getItem("proxyTransport");

  // if (!transport) {
  //   localStorage.setItem("proxyTransport", "libcurl");
  // }

  let blobs = localStorage.getItem("blobs");
  let stars = localStorage.getItem("stars");

  if (!stars) {
    localStorage.setItem("stars", "true");
    stars = "true";
  }

  if (stars !== "true") {
    document.getElementById("particles-js").style.display = "none";
    const leafCont = document.getElementById("leaf-container");
    if (leafCont) leafCont.style.display = "none";
  }

  if (!blobs) {
    localStorage.setItem("blobs", "true");
    blobs = "true";
  }

  if (blobs !== "true") {
    document.getElementById("blobs").style.display = "none";
  }

  const panicUrl = localStorage.getItem("panicUrl");
  const panicKey = localStorage.getItem("panicKey");

  if (panicUrl && panicKey) {
    window.addEventListener("keydown", (e) => {
      if (e.key === panicKey) {
        window.location.href = panicUrl;
      }
    });
  }

  if (!panicUrl || !panicKey) {
    localStorage.setItem("panicUrl", "https://google.com");
    localStorage.setItem("panicKey", "~");
  }

  const panicBtn = document.getElementById("panicBtn");

  if (panicBtn) {
    panicBtn.addEventListener("click", () => {
      window.location.href = panicUrl;
    });
  }

  // Announcements modal
  const currentAnnouncement = `
<div>
<h2>(BIG UPDATE) Whats New:</h2>
  <ul style="list-style-position: inside; text-align: center;">
    <li>ADDED 613 GAMES!</li>
    <li>Added More page</li>
    <li>Reverted Scramjet as default</li>
    <li>Added Christmas Theme 🎄</li>
    <li>Added Christmas Countdown</li>
    <li>Other small changes</li>
  </ul>
  <p>Join the Discord: https://dsc.gg/parcoil</p>
</div>`;
  const lastAnnouncement = localStorage.getItem("lastAnnouncement");

  if (lastAnnouncement !== currentAnnouncement) {
    Swal.fire({
      title: "Announcement",
      html: currentAnnouncement,
      confirmButtonText: "Alr thats cool",
      allowOutsideClick: false,
      allowEscapeKey: false,
    }).then(() => {
      localStorage.setItem("lastAnnouncement", currentAnnouncement);
    });
  }
});
