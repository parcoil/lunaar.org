console.log(
  `%cLunaar%c v7 - games.js Loaded`,
  "font-size: 16px; background-color: #9282fb; border-top-left-radius: 5px; border-bottom-left-radius: 5px; padding: 4px; font-weight: bold;",
  "font-size: 16px; background-color: #090810; font-weight: bold; padding: 4px; border-top-right-radius: 5px; border-bottom-right-radius: 5px;",
);

let allGames = [];

function applyFilters() {
  let filtered = allGames;
  const showProxy = document
    .getElementById("proxy-btn")
    .classList.contains("active");
  const showHtml5 = document
    .getElementById("html5-btn")
    .classList.contains("active");

  if (!showProxy && !showHtml5) {
    renderGames([]);
    return;
  }

  if (showProxy && showHtml5) {
    filtered = allGames;
  } else {
    filtered = allGames.filter((game) => {
      if (showProxy && game.proxy) return true;
      if (showHtml5 && !game.proxy) return true;
      return false;
    });
  }

  const searchValue = document
    .getElementById("search-input")
    .value.toLowerCase();
  if (searchValue) {
    filtered = filtered.filter((game) =>
      game.name.toLowerCase().includes(searchValue),
    );
  }
  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.placeholder = `Search for ${filtered.length} game${filtered.length !== 1 ? "s" : ""}`;
  }
  renderGames(filtered);
}

function renderGames(games) {
  const gamesList = document.getElementById("games-list");
  if (!gamesList) {
    console.error('Element with id "games-list" not found.');
    return;
  }
  gamesList.innerHTML = "";
  if (games.length === 0) {
    gamesList.innerHTML =
      '<p style="color:var(--text-color);opacity:0.7;"><i <i class="fa-solid fa-circle-exclamation"></i> No games found.</p>';
    return;
  }

  const sortedGames = [...games].sort((a, b) => {
    if (a.name === "Request a game") return -1;
    if (b.name === "Request a game") return 1;

    // new games first
    if (a.new && !b.new) return -1;
    if (!a.new && b.new) return 1;

    // then hot games
    if (a.top && !b.top) return -1;
    if (!a.top && b.top) return 1;

    return 0;
  });

  sortedGames.forEach((game) => {
    const gameItem = document.createElement("div");
    gameItem.className = "game-item";

    const img = document.createElement("img");
    img.alt = game.name;
    img.loading = "lazy";
    if (game.proxy) {
      if (game.image.startsWith("https://")) {
        img.src = game.image;
      } else {
        img.src = `/media/games/${game.image}`;
      }
    } else {
      if (game.image.startsWith("https://")) {
        img.src = game.image;
      } else {
        const firstSegment = game.url.split("/")[0];
        img.src = `/cdn/${firstSegment}/${game.image}`;
      }
    }
    gameItem.appendChild(img);
    const badgeContainer = document.createElement("div");
    badgeContainer.className = "badge-container";
    gameItem.appendChild(badgeContainer);
    if (game.top) {
      const badge = document.createElement("span");
      badge.innerHTML = `<i class="fa-solid fa-fire"></i> HOT`;
      badge.className = "badge";
      badgeContainer.appendChild(badge);
    }
    if (game.new) {
      const badge = document.createElement("span");
      badge.innerHTML = `<i class="fa-solid fa-sparkles"></i> NEW`;
      badge.className = "badge";
      badgeContainer.appendChild(badge);
    }
    if (game.exp) {
      const badge = document.createElement("span");
      badge.innerHTML = `<i class="fa-solid fa-vial"></i> EXP`;
      badge.className = "badge";
      badgeContainer.appendChild(badge);
    }
    if (game.updated) {
      const badge = document.createElement("span");
      badge.innerHTML = `<i class="fa-solid fa-sparkles"></i> UPDATED`;
      badge.className = "badge";
      badgeContainer.appendChild(badge);
    }
    const name = document.createElement("p");
    name.className = "game-link";
    name.textContent = game.name;
    gameItem.appendChild(name);

    if (game.proxy) {
      img.onclick = (e) => {
        e.preventDefault();
        if (game.url.includes("jsdelivr")) {
          sessionStorage.setItem("lpurl", game.url);
          window.location.href = "/go";
        } else {
          if (localStorage.getItem("proxy-backend") === "ultraviolet") {
            sessionStorage.setItem(
              "lpurl",
              __uv$config.prefix + __uv$config.encodeUrl(game.url),
            );
            sessionStorage.setItem("rawurl", game.url);
            window.location.href = "/go";
          } else {
            const tmp = window.sjEncodeAndGo(game.url);
            sessionStorage.setItem("lpurl", tmp);
            window.location.href = "/go";
          }
        }
      };
    } else {
      img.onclick = (e) => {
        e.preventDefault();
        sessionStorage.setItem("lpurl", game.url);
        window.location.href = "/go";
      };
    }

    gamesList.appendChild(gameItem);
  });
}

Promise.all([
  fetch("json/games.json").then((response) => response.json()),
  fetch("json/games-local.json").then((response) => response.json()),
  fetch("/cdn/all").then((response) => response.json()),
])
  .then(([gamesData1, gamesData2, gamesData3]) => {
    allGames = [...gamesData1, ...gamesData2, ...gamesData3];
    const searchInput = document.getElementById("search-input");
    searchInput.placeholder = `Search for ${allGames.length} games`;
    applyFilters();
  })
  .catch((error) => {
    console.error("Error loading games:", error);
    // Fallback to local games if remote fails
    fetch("json/games.json")
      .then((response) => response.json())
      .then((data) => {
        allGames = data;
        const searchInput = document.getElementById("search-input");
        searchInput.placeholder = `Search for ${allGames.length} games`;
        applyFilters();
      });
  });

const searchInput = document.getElementById("search-input");
if (searchInput) {
  searchInput.addEventListener("input", applyFilters);
}

const proxyBtn = document.getElementById("proxy-btn");
if (proxyBtn) {
  proxyBtn.addEventListener("click", () => {
    proxyBtn.classList.toggle("active");
    applyFilters();
  });
}

const html5Btn = document.getElementById("html5-btn");
if (html5Btn) {
  html5Btn.addEventListener("click", () => {
    html5Btn.classList.toggle("active");
    applyFilters();
  });
}
