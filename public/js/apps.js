console.log(
  `%cLunaar%c v7 - apps.js Loaded`,
  "font-size: 16px; background-color: #9282fb; border-top-left-radius: 5px; border-bottom-left-radius: 5px; padding: 4px; font-weight: bold;",
  "font-size: 16px; background-color: #090810; font-weight: bold; padding: 4px; border-top-right-radius: 5px; border-bottom-right-radius: 5px;",
);

let allApps = [];

function renderApps(apps) {
  const appsList = document.getElementById("apps-list");
  if (!appsList) {
    console.error('Element with id "apps-list" not found.');
    return;
  }
  appsList.innerHTML = "";
  if (apps.length === 0) {
    appsList.innerHTML =
      '<p style="color:var(--text-color);opacity:0.7;"><i class="fa-solid fa-circle-exclamation"></i> No apps found.</p>';
    return;
  }

  apps.forEach((app) => {
    const appItem = document.createElement("div");
    appItem.className = "app-item";

    const img = document.createElement("img");
    img.alt = app.name;
    img.loading = "lazy";
    img.src = app.image;
    appItem.appendChild(img);

    const name = document.createElement("p");
    name.className = "app-link";
    name.textContent = app.name;
    appItem.appendChild(name);

    appItem.onclick = (e) => {
      e.preventDefault();
      if (localStorage.getItem("proxy-backend") === "scramjet") {
        const tmp = window.sjEncodeAndGo(app.url);
        sessionStorage.setItem("lpurl", tmp);
        window.location.href = "/go";
      } else {
        sessionStorage.setItem(
          "lpurl",
          __uv$config.prefix + __uv$config.encodeUrl(app.url),
        );
        window.location.href = "/go";
      }
    };

    appsList.appendChild(appItem);
  });
}

fetch("json/apps.json")
  .then((response) => response.json())
  .then((data) => {
    allApps = data;
    const searchInput = document.getElementById("search-input");
    searchInput.placeholder = `Search for ${allApps.length} apps`;
    renderApps(allApps);
  });

const searchInput = document.getElementById("search-input");
if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    const value = e.target.value.toLowerCase();
    const filtered = allApps.filter((app) =>
      app.name.toLowerCase().includes(value),
    );
    renderApps(filtered);
  });
}
