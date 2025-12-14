const logo = "\x1b[91m[Parcoil Cloak]\x1b[0m";

const cloak = {
  getFavicon() {
    try {
      const icons = document.querySelectorAll('link[rel="icon"]');
      return icons.length > 0 ? icons[0].href : null;
    } catch (err) {
      console.error(logo, err);
    }
  },
  setFavicon(url) {
    try {
      const icons = document.querySelectorAll('link[rel="icon"]');
      if (icons.length === 0) {
        throw new Error("Favicon not found. Try adding rel='icon'");
      }
      icons.forEach((icon) => (icon.href = url));
      localStorage.setItem("cloakFavicon", url);
    } catch (err) {
      console.error(logo, err);
    }
  },
  getTitle() {
    try {
      return document.title;
    } catch (err) {
      console.error(logo, err);
    }
  },
  setTitle(newTitle) {
    try {
      document.title = newTitle;
      localStorage.setItem("cloakTitle", newTitle);
    } catch (err) {
      console.error(logo, err);
    }
  },
  setCloak(newTitle, url) {
    try {
      this.setTitle(newTitle);
      this.setFavicon(url);
    } catch (err) {
      console.error(logo, err);
    }
  },
  init() {
    console.warn(
      logo,
      "cloak.init() has been deprecated. theres no need to call it anymore.",
    );
  },
  getCloak() {
    const title = localStorage.getItem("cloakTitle");
    const icon = localStorage.getItem("cloakFavicon");
    return [title, icon];
  },
  aboutBlank(url, newURl) {
    if (!url) url = "https://www.google.com/search?q=how+many+seconds+in+a+day";
    const newWindow = window.open();
    const iframe = newWindow.document.createElement("iframe");
    newWindow.document.body.style.margin = "0";
    newWindow.document.body.style.height = "100vh";
    iframe.src = newURl || window.location.href;
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.border = "none";
    newWindow.document.body.appendChild(iframe);
    window.location.replace(url);
  },
  blob(url) {
    if (!url) url = "https://www.google.com/search?q=how+many+seconds+in+a+day";
    const html = `
       <!DOCTYPE html>
       <html>
       <head>
         <title>Blob</title>
         <style>
           body { margin: 0; height: 100vh; }
           iframe { width: 100%; height: 100%; border: none; }
         </style>
       </head>
       <body>
         <iframe src="${window.location.href}"></iframe>
       </body>
       </html>
     `;
    const blob = new Blob([html], { type: "text/html" });
    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl);
    window.location.replace(url);
  },
  reset(reload = true) {
    localStorage.removeItem("cloakTitle");
    localStorage.removeItem("cloakFavicon");
    console.log(
      logo,
      "Cloak reset. Title and favicon will remain unset until needed.",
    );
    if (reload === true) {
      window.location.reload();
    }
  },
};

window.cloak = cloak;

document.addEventListener("DOMContentLoaded", () => {
  const cloakSelect = document.querySelector("[data-cloak-select]");

  if (cloakSelect) {
    cloakSelect.addEventListener("change", () => {
      const selectedCloakName = cloakSelect.value;
      const selectedCloak = cloaks.find(
        (cloak) => cloak.name === selectedCloakName,
      );

      if (selectedCloak) {
        cloak.setCloak(selectedCloak.title, selectedCloak.icon);
        console.log(logo, `Set cloak to: ${selectedCloak.title}`);
      } else {
        console.error(
          `Cloak '${selectedCloakName}' not found in cloaks array.`,
        );
      }
    });
  }

  const savedTitle = localStorage.getItem("cloakTitle");
  const savedFavicon = localStorage.getItem("cloakFavicon");
  if (savedTitle && savedFavicon) {
    cloak.setTitle(savedTitle);
    cloak.setFavicon(savedFavicon);
  }
});
