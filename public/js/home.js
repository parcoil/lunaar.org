console.log(
  `%cLunaar%c v7 - home.js Loaded`,
  "font-size: 16px; background-color: #9282fb; border-top-left-radius: 5px; border-bottom-left-radius: 5px; padding: 4px; font-weight: bold;",
  "font-size: 16px; background-color: #090810; font-weight: bold; padding: 4px; border-top-right-radius: 5px; border-bottom-right-radius: 5px;",
);

function openApp(url) {
  if (localStorage.getItem("proxy-backend") === "scramjet") {
    const tmp = window.sjEncodeAndGo(url);
    sessionStorage.setItem("lpurl", tmp);
  } else {
    sessionStorage.setItem(
      "lpurl",
      __uv$config.prefix + __uv$config.encodeUrl(url),
    );
  }
  window.location.href = "/go";
}

const rngText = document.getElementById("rng-text");
const greetings = [
  "Soixante Sept",
  "Bayerische Motoren Werke ist schlecht",
  "Hello!",
  "v7 is here!",
  "Freedom",
  "The Best Proxy",
  "Welcome to the best proxy",
  "Welcome",
  "こんにちは",
  "こんにちは",
  "こんにちは",
  "Lunaar",
  "uhh",
];
function getRandomGreeting() {
  const randomIndex = Math.floor(Math.random() * greetings.length);
  return greetings[randomIndex];
}
rngText.textContent = getRandomGreeting();

const searchInput = document.getElementById("proxy-address");
const autocompleteBox = document.getElementById("autocomplete");

async function fetchSuggestions(query) {
  if (!query) {
    autocompleteBox.innerHTML = "";
    autocompleteBox.style.display = "none";
    return;
  }

  try {
    const res = await fetch(`/api/autocomplete?q=${encodeURIComponent(query)}`);
    const suggestions = await res.json();
    autocompleteBox.innerHTML = "";
    if (suggestions.length === 0) {
      autocompleteBox.style.display = "none";
      return;
    }
    suggestions.forEach((s) => {
      const item = document.createElement("div");
      item.textContent = s.phrase;
      item.onclick = () => {
        searchInput.value = s.phrase;
        autocompleteBox.innerHTML = "";
        autocompleteBox.style.display = "none";
      };
      autocompleteBox.appendChild(item);
    });
    autocompleteBox.style.display = "block";
  } catch (err) {
    console.error("Autocomplete error:", err);
    autocompleteBox.style.display = "none";
  }
}

searchInput.addEventListener("input", (e) => {
  fetchSuggestions(e.target.value);
});

document.addEventListener("click", (e) => {
  if (!autocompleteBox.contains(e.target) && e.target !== searchInput) {
    autocompleteBox.innerHTML = "";
    autocompleteBox.style.display = "none";
  }
});

const addShortcutBtn = document.getElementById("add-shortcut");
const shortcutsContainer = document.querySelector(".shortcuts");

function showToast(text) {
  if (window.Toastify) {
    Toastify({
      text,
      duration: 3000,
      gravity: "bottom",
      position: "right",
      style: {
        background: "var(--primary-color)",
        borderRadius: "var(--border-radius)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
      },
    }).showToast();
  }
}

const savedShortcuts = JSON.parse(localStorage.getItem("shortcuts") || "[]");

const defaults = [
  {
    name: "Tiktok",
    url: "https://tiktok.com",
    icon: "https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://tiktok.com&size=64",
  },
  {
    name: "Discord",
    url: "https://discord.com",
    icon: "https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://discord.com&size=64",
  },
  {
    name: "Youtube",
    url: "https://www.youtube.com",
    icon: "https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://www.youtube.com&size=64",
  },
  {
    name: "Spotify",
    url: "https://spotify.com",
    icon: "https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://spotify.com&size=64",
  },
];

const isArray = Array.isArray(savedShortcuts);
const existing = isArray ? savedShortcuts : [];
const missingDefaults = defaults.filter(
  (d) =>
    !existing.some(
      (s) => (s.url && s.url.toLowerCase()) === d.url.toLowerCase(),
    ),
);
const combinedShortcuts = [...missingDefaults, ...existing];

if (!isArray || missingDefaults.length > 0) {
  localStorage.setItem("shortcuts", JSON.stringify(combinedShortcuts));
  savedShortcuts.length = 0;
  combinedShortcuts.forEach((s) => savedShortcuts.push(s));
}

combinedShortcuts.forEach((s) => createShortcutElement(s.name, s.url, s.icon));

addShortcutBtn.addEventListener("click", async () => {
  try {
    const { value: formValues } = await Swal.fire({
      title: "Add Shortcut",
      showClass: { popup: "swal2-smooth-in" },
      hideClass: { popup: "swal2-smooth-out" },
      html:
        '<input id="swal-add-name" class="swal2-input" placeholder="Name">' +
        '<input id="swal-add-url" class="swal2-input" placeholder="URL">' +
        "<p class='modalTip'>tip: edit a shortcut and press ok to update the icon</p>",
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        const name = document.getElementById("swal-add-name").value.trim();
        const url = document.getElementById("swal-add-url").value.trim();
        if (!name || !url) {
          Swal.showValidationMessage("Please provide both name and URL");
          return false;
        }
        return { name, url };
      },
    });

    if (!formValues) return;
    const { name, url } = formValues;
    console.log("Form submitted:", { name, url });

    let icon = `https://www.google.com/s2/favicons?domain=${
      new URL(url).hostname
    }`;
    console.log("Favicon URL:", icon);

    savedShortcuts.push({ name, url, icon });
    localStorage.setItem("shortcuts", JSON.stringify(savedShortcuts));
    createShortcutElement(name, url, icon);
    showToast(`Added "${name}"`);
    console.log("Shortcut added:", { name, url, icon });
  } catch (err) {
    console.log("Error adding shortcut:", err);
  }
});

function createShortcutElement(name, url, icon) {
  const shortcut = document.createElement("div");
  shortcut.className = "shortcut";

  const iconDiv = document.createElement("div");
  iconDiv.className = "shortcut-icon";
  const img = document.createElement("img");
  img.src = icon;
  img.alt = name;
  img.width = 40;
  img.height = 40;
  img.style.transition = "width 0.3s ease, height 0.3s ease";
  iconDiv.appendChild(img);

  const span = document.createElement("span");
  span.textContent = name;

  const menuBtn = document.createElement("button");
  menuBtn.className = "shortcut-menu-btn";
  menuBtn.innerHTML = "<i class='fa-solid fa-ellipsis-vertical'></i>";
  menuBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdown.classList.toggle("show");
  });

  const dropdown = document.createElement("div");
  dropdown.className = "shortcut-dropdown";

  const editBtn = document.createElement("button");
  editBtn.innerHTML = "<i class='fa-solid fa-pencil'></i> Edit";
  editBtn.addEventListener("click", async (e) => {
    e.stopPropagation();
    try {
      const { value: formValues } = await Swal.fire({
        title: "Edit Shortcut",
        showClass: { popup: "swal2-smooth-in" },
        hideClass: { popup: "swal2-smooth-out" },
        html:
          '<input id="swal-name" class="swal2-input" placeholder="Name" value="' +
          name.replace(/"/g, "&quot;") +
          '">' +
          '<input id="swal-url" class="swal2-input" placeholder="URL" value="' +
          url.replace(/"/g, "&quot;") +
          '">' +
          "<p class='modalTip'>tip: edit a shortcut and press ok to update the icon</p>",
        focusConfirm: false,
        showCancelButton: true,
        preConfirm: () => {
          const newName = document.getElementById("swal-name").value.trim();
          const newUrl = document.getElementById("swal-url").value.trim();
          if (!newName || !newUrl) {
            Swal.showValidationMessage("Please provide both name and URL");
            return false;
          }
          return { newName, newUrl };
        },
      });

      if (!formValues) return;
      const { newName, newUrl } = formValues;

      // Update favicon based on new URL
      const newIcon = `https://www.google.com/s2/favicons?domain=${
        new URL(newUrl).hostname
      }`;
      img.src = newIcon;
      console.log("Updated favicon URL:", newIcon);

      span.textContent = newName;
      shortcut.onclick = () => openApp(newUrl);

      const index = savedShortcuts.findIndex(
        (s) => s.url === url && s.name === name,
      );
      if (index > -1) {
        savedShortcuts[index] = { name: newName, url: newUrl, icon: newIcon };
        localStorage.setItem("shortcuts", JSON.stringify(savedShortcuts));
      }

      dropdown.classList.remove("show");
      showToast(`Updated "${newName}"`);
    } catch (_) {}
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.innerHTML = "<i class='fa-solid fa-trash'></i> Delete";
  deleteBtn.addEventListener("click", async (e) => {
    e.stopPropagation();
    const res = await Swal.fire({
      title: "Delete shortcut?",
      text: `"${name}" will be removed`,
      icon: "warning",
      showClass: {
        popup: "swal2-smooth-in",
      },
      hideClass: {
        popup: "swal2-smooth-out",
      },
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#e53935",
    });
    if (res.isConfirmed) {
      shortcut.remove();
      const index = savedShortcuts.findIndex(
        (s) => s.name === name && s.url === url,
      );
      if (index > -1) {
        savedShortcuts.splice(index, 1);
        localStorage.setItem("shortcuts", JSON.stringify(savedShortcuts));
      }
      dropdown.classList.remove("show");
      showToast(`Deleted "${name}"`);
    }
  });

  dropdown.appendChild(editBtn);
  dropdown.appendChild(deleteBtn);

  shortcut.appendChild(iconDiv);
  shortcut.appendChild(span);
  shortcut.appendChild(menuBtn);
  shortcut.appendChild(dropdown);

  shortcut.onclick = () => openApp(url);

  shortcutsContainer.insertBefore(shortcut, addShortcutBtn);
}

document.addEventListener("click", () => {
  document
    .querySelectorAll(".shortcut-dropdown.show")
    .forEach((d) => d.classList.remove("show"));
});
