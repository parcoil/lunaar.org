document.addEventListener("DOMContentLoaded", () => {
  const theme = localStorage.getItem("theme");
  const themeSelect = document.getElementById("theme-select");
  const proxyTransport = document.getElementById("proxy-transport");
  const proxyTransportValue = localStorage.getItem("transport");
  const searchEngine = localStorage.getItem("se");
  const searchEngineValue = document.getElementById("search-engine-select");
  const tipsEnabled = localStorage.getItem("disableTips");
  const tipsEnabledValue = document.getElementById("disableTips");
  const resetSettings = document.getElementById("reset-settings");
  const cloakReset = document.getElementById("cloak-reset");
  const proxyBackend = localStorage.getItem("proxy-backend");
  const proxyBackendToggle = document.getElementById("proxy-backend");
  const bgSelect = document.getElementById("background-select");
  const bg = localStorage.getItem("backgroundImage");
  const backgroundImageDropdown = localStorage.getItem(
    "backgroundImageDropdown"
  );
  const bgCustomUrl = localStorage.getItem("customUrl");
  const bgInput = document.getElementById("background-input");

  const blobsCheckbox = document.getElementById("disableBlobs");
  const blobsEl = document.getElementById("blobs");

  const particlesCheckbox = document.getElementById("disableParticles");
  const particlesEl = document.getElementById("particles-js");
  const panicUrl = document.getElementById("panicUrl");
  const panicKey = document.getElementById("panicKey");
  const panicUrlValue = localStorage.getItem("panicUrl");
  const panicKeyValue = localStorage.getItem("panicKey");

  if (panicUrl && panicKey) {
    panicUrl.value = panicUrlValue;
    panicKey.value = panicKeyValue;
  }

  panicUrl.addEventListener("input", (e) => {
    localStorage.setItem("panicUrl", e.target.value);
  });

  panicKey.addEventListener("input", (e) => {
    localStorage.setItem("panicKey", e.target.value);
  });

  if (particlesCheckbox && particlesEl) {
    particlesCheckbox.checked = localStorage.getItem("stars") === "true";

    particlesCheckbox.addEventListener("change", (e) => {
      const isChecked = e.target.checked;

      localStorage.setItem("stars", isChecked);
      particlesEl.style.display = isChecked ? "block" : "none";

      Toastify({
        text: `Particles ${isChecked ? "Enabled" : "Disabled"}`,
        duration: 3000,
        gravity: "bottom",
        position: "right",
        style: {
          background: "var(--primary-color)",
          borderRadius: "var(--border-radius)",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        },
      }).showToast();
    });
  }
  if (blobsCheckbox && blobsEl) {
    blobsCheckbox.checked = localStorage.getItem("blobs") === "true";

    blobsCheckbox.addEventListener("change", (e) => {
      const isChecked = e.target.checked;

      localStorage.setItem("blobs", isChecked);
      blobsEl.style.display = isChecked ? "block" : "none";

      Toastify({
        text: `Blobs ${isChecked ? "Enabled" : "Disabled"}`,
        duration: 3000,
        gravity: "bottom",
        position: "right",
        style: {
          background: "var(--primary-color)",
          borderRadius: "var(--border-radius)",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        },
      }).showToast();
    });
  }

  if (bg) {
    bgSelect.value = backgroundImageDropdown;
  }
  function changeBackground(url, dropdown) {
    document.body.style.backgroundImage = `url(${url})`;
    localStorage.setItem("backgroundImage", url);
    localStorage.setItem("backgroundImageDropdown", dropdown);
    bgInput.value = url || "";
    localStorage.setItem("customUrl", false);
  }

  bgSelect.addEventListener("change", (e) => {
    switch (bgSelect.value) {
      case "default":
        changeBackground("", "default");
        localStorage.removeItem("backgroundImageDropdown");
        localStorage.removeItem("backgroundImage");
        document.body.style.removeProperty("background-image");
        break;
      case "audi":
        changeBackground("/./media/wallpapers/audi.gif", "audi");
        break;
      case "macosdark":
        changeBackground("/./media/wallpapers/macosdark.jpg", "macosdark");
        break;
      case "windows":
        changeBackground("/./media/wallpapers/windows.webp", "windows");
        break;
      case "windowsdark":
        changeBackground("/./media/wallpapers/windowsdark.webp", "windowsdark");
        break;
    }
    e.preventDefault();
    localStorage.setItem("backgroundImageDropdown", e.target.value);

    Toastify({
      text: `Background image Set to ${e.target.value}`,
      duration: 3000,
      gravity: "bottom",
      position: "right",
      style: {
        background: "var(--primary-color)",
        // boxShadow: "0 3px 6px -1px var(--primary-color),0 10px 36px -4px var(--accent-color)",
        borderRadius: "var(--border-radius)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
      },
    }).showToast();
  });

  if (proxyBackend) {
    proxyBackendToggle.value = proxyBackend;
  }

  proxyBackendToggle.addEventListener("change", (e) => {
    e.preventDefault();
    localStorage.setItem("proxy-backend", e.target.value);
    Toastify({
      text: `Proxy Set to ${e.target.value}`,
      duration: 3000,
      gravity: "bottom",
      position: "right",
      style: {
        background: "var(--primary-color)",
        // boxShadow: "0 3px 6px -1px var(--primary-color),0 10px 36px -4px var(--accent-color)",
        borderRadius: "var(--border-radius)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
      },
    }).showToast();
  });

  cloakReset.addEventListener("click", () => {
    window.cloak.reset();
  });

  resetSettings.addEventListener("click", () => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will reset all settings to default!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, reset it!",
      showClass: {
        popup: "swal2-smooth-in",
      },
      hideClass: {
        popup: "swal2-smooth-out",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        location.reload();
      }
    });
  });

  if (tipsEnabled) {
    tipsEnabledValue.checked = tipsEnabled === "true";
  }
  tipsEnabledValue.addEventListener("change", (e) => {
    e.preventDefault();
    localStorage.setItem("disableTips", e.target.checked);
    Toastify({
      text: `Tips ${e.target.checked ? "disabled" : "enabled"}`,
      duration: 3000,
      gravity: "bottom",
      position: "right",
      style: {
        background: "var(--primary-color)",
        // boxShadow: "0 3px 6px -1px var(--primary-color),0 10px 36px -4px var(--accent-color)",
        borderRadius: "var(--border-radius)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
      },
    }).showToast();
  });

  if (searchEngine) {
    searchEngineValue.value = searchEngine;
  }
  searchEngineValue.addEventListener("change", (e) => {
    e.preventDefault();
    localStorage.setItem("se", e.target.value);
    Toastify({
      text: `Search Engine changed to ${e.target.value}`,
      duration: 3000,
      gravity: "bottom",
      position: "right",
      style: {
        background: "var(--primary-color)",
        // boxShadow: "0 3px 6px -1px var(--primary-color),0 10px 36px -4px var(--accent-color)",
        borderRadius: "var(--border-radius)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
      },
    }).showToast();
  });

  if (proxyTransportValue) {
    proxyTransport.value = proxyTransportValue;
  }
  proxyTransport.addEventListener("change", (e) => {
    e.preventDefault();
    localStorage.setItem("transport", e.target.value);
    window.setTransport(e.target.value);
    Toastify({
      text: `Proxy transport changed to ${e.target.value}`,
      duration: 3000,
      gravity: "bottom",
      position: "right",
      style: {
        background: "var(--primary-color)",
        // boxShadow: "0 3px 6px -1px var(--primary-color),0 10px 36px -4px var(--accent-color)",
        borderRadius: "var(--border-radius)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
      },
    }).showToast();
  });

  if (theme) {
    themeSelect.value = theme;
  }

  themeSelect.addEventListener("change", (e) => {
    e.preventDefault();

    window.updateParticles();
    document.body.setAttribute("theme", e.target.value);
    localStorage.setItem("theme", e.target.value);
    Toastify({
      text: `Theme changed to ${e.target.value}`,
      duration: 3000,
      gravity: "bottom",
      position: "right",
      style: {
        background: "var(--primary-color)",
        // boxShadow: "0 3px 6px -1px var(--primary-color),0 10px 36px -4px var(--accent-color)",
        borderRadius: "var(--border-radius)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
      },
    }).showToast();
  });

  const tabButtons = document.querySelectorAll(".tab-button");
  const tabs = document.querySelectorAll(".tab");

  function switchTab(newTab) {
    tabs.forEach((tab) => {
      if (tab === newTab) {
        tab.style.display = "flex";
        tab.classList.add("fadeIn");
      } else {
        tab.style.display = "none";
        tab.classList.remove("fadeIn");
      }
    });
  }
  tabButtons.forEach((button) => {
    button.addEventListener("click", function () {
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      const tabName = button.id.replace("-tab", "");
      const newTab = document.querySelector(`[data-tab-name="${tabName}"]`);

      if (newTab) {
        switchTab(newTab);
      }

      localStorage.setItem("activeSettingstab", tabName);
    });
  });

  const activeTab = localStorage.getItem("activeSettingstab") || "style";
  if (activeTab) {
    document.getElementById(`${activeTab}-tab`).click();
  } else {
    document.getElementById("style-tab").click();
  }
});

function exportBrowserData(
  options = { local: true, session: true, cookies: true }
) {
  let backup = {};

  if (options.local) {
    backup.localStorage = Object.fromEntries(Object.entries(localStorage));
  }

  if (options.session) {
    backup.sessionStorage = Object.fromEntries(Object.entries(sessionStorage));
  }

  if (options.cookies) {
    backup.cookies = document.cookie;
  }
  const encoded = btoa(JSON.stringify(backup));
  return encoded;
}

function downloadBrowserBackup() {
  const encoded = exportBrowserData();
  const blob = new Blob([encoded], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "backup.luna";
  link.click();

  URL.revokeObjectURL(url);
}

function importBrowserBackup(encoded) {
  try {
    const decoded = JSON.parse(atob(encoded));

    if (decoded.localStorage) {
      for (let [k, v] of Object.entries(decoded.localStorage)) {
        localStorage.setItem(k, v);
      }
    }

    if (decoded.sessionStorage) {
      for (let [k, v] of Object.entries(decoded.sessionStorage)) {
        sessionStorage.setItem(k, v);
      }
    }

    if (decoded.cookies) {
      document.cookie = decoded.cookies;
    }

    return true;
  } catch (err) {
    console.error("Import failed:", err);
    return false;
  }
}

function uploadBrowserBackup() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".luna";

  input.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const success = importBrowserBackup(event.target.result);
      if (success) {
        Toastify({
          text: "Backup imported successfully! Please refresh the page.",
          duration: 3000,
          gravity: "bottom",
          position: "right",
          style: {
            background: "green",

            borderRadius: "var(--border-radius)",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          },
        }).showToast();
      } else {
        Swal.fire("Import failed", "Your file might be corrupted.", "error");
      }
    };
    reader.readAsText(file);
  });

  input.click();
}

const cloaks = [
  {
    name: "default",
    icon: "./media/logo.svg",
    title: "&#x4C;&#x75;&#x6E;&#x61;&#x61;&#x72;",
  },
  {
    name: "drive",
    icon: "./media/cloaks/googledrive.png",
    title: "Home - Google Drive",
  },
  {
    name: "edpuzzle",
    icon: "/./media/cloaks/edpuzzle.png",
    title: "Edpuzzle",
  },
  {
    name: "wikipedia",
    icon: "/./media/cloaks/wikipedia.ico",
    title: "Wikipedia",
  },
  {
    name: "classroom",
    icon: "/./media/cloaks/Classroom.png",
    title: "Google Classroom",
  },
  {
    name: "canvas",
    icon: "/./media/cloaks/canvas.png",
    title: "Dashboard",
  },
  {
    name: "classroom",
    icon: "/./media/cloaks/classroom.png",
    title: "Home",
  },
  {
    name: "zoom",
    icon: "/./media/cloaks/zoom.png",
    title: "Zoom",
  },
  {
    name: "khan",
    icon: "/./media/cloaks/khan.ico",
    title: "Khan Academy",
  },
  {
    name: "desmos",
    icon: "/./media/cloaks/desmos.ico",
    title: "Desmos Classroom Activities",
  },
  {
    name: "gforms",
    icon: "/./media/cloaks/googleforms.png",
    title: "Start your quiz",
  },
  {
    name: "quizlet",
    icon: "/./media/cloaks/quizlet.webp",
    title: "Online Flashcard Maker &amp; Flashcard App | Quizlet",
  },
];
