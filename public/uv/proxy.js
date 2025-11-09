"use strict";
/**
 * @type {HTMLFormElement}
 */
const form = document.getElementById("proxy-form");
/**
 * @type {HTMLInputElement}
 */
const address = document.getElementById("proxy-address");
/**
 * @type {HTMLInputElement}
 */
const searchEngine = document.getElementById("proxy-search-engine");
/**
 * @type {HTMLParagraphElement}
 */
const error = document.getElementById("proxy-error");
/**
 * @type {HTMLPreElement}
 */
const errorCode = document.getElementById("proxy-error-code");

const connection = new BareMux.BareMuxConnection("/baremux/worker.js");

const wispUrl =
  (location.protocol === "https:" ? "wss" : "ws") +
  "://" +
  location.host +
  "/wisp/";
const bareUrl = location.protocol + "//" + location.host + "/bare/";
var transport = localStorage.getItem("transport");
if (!transport) {
  transport = "libcurl";
  localStorage.setItem("transport", transport);
}

async function setTransport(transportsel) {
  if (transportsel == "epoxy") {
    await connection.setTransport("/epoxy/index.mjs", [{ wisp: wispUrl }]);
  } else if (transportsel == "libcurl") {
    await connection.setTransport("/libcurl/index.mjs", [{ wisp: wispUrl }]);
  } else {
    await connection.setTransport("/bareasmodule/index.mjs", [bareUrl]);
  }
}
setTransport(transport);

window.setTransport = setTransport;

function encodeURL(url) {
  try {
    const encoded = __uv$config.prefix + __uv$config.encodeUrl(url);
    return encoded;
  } catch (e) {
    console.error("Error encoding URL:", e);
    errorCode.textContent = "Error: " + e.message;
    error.style.display = "block";
    return null; // return null so caller knows it failed
  }
}

function getSearchEngine() {
  const searchEngine = localStorage.getItem("se") || "ddg";
  let baseUrl;
  switch (searchEngine) {
    case "google":
      baseUrl = `https://www.google.com/search?q=%s`;
      break;
    case "bing":
      baseUrl = `https://www.bing.com/search?q=%s`;
      break;
    case "ddg":
      baseUrl = `https://duckduckgo.com/?q=%s`;
      break;
    case "yahoo":
      baseUrl = `https://search.yahoo.com/search?p=%s`;
      break;
    case "brave":
      baseUrl = `https://search.brave.com/search?q=%s`;
      break;
    case "startpage":
      baseUrl = `https://www.startpage.com/sp/search?query=%s`;
      break;
    default:
      baseUrl = `https://duckduckgo.com/?q=%s`;
  }
  return baseUrl;
}
function encodeTEXT(text) {
  const searchEngine = localStorage.getItem("se") || "ddg";
  let baseUrl;

  switch (searchEngine) {
    case "google":
      baseUrl = `https://www.google.com/search?q=${encodeURIComponent(text)}`;
      break;
    case "bing":
      baseUrl = `https://www.bing.com/search?q=${encodeURIComponent(text)}`;
      break;
    case "ddg":
      baseUrl = `https://duckduckgo.com/?q=${encodeURIComponent(text)}`;
      break;
    case "yahoo":
      baseUrl = `https://search.yahoo.com/search?p=${encodeURIComponent(text)}`;
      break;
    case "brave":
      baseUrl = `https://search.brave.com/search?q=${encodeURIComponent(text)}`;
      break;
    case "startpage":
      baseUrl = `https://www.startpage.com/sp/search?query=${encodeURIComponent(
        text,
      )}`;
      break;
    default:
      baseUrl = `https://duckduckgo.com/?q=${encodeURIComponent(text)}`;
  }

  try {
    return __uv$config.prefix + __uv$config.encodeUrl(baseUrl);
  } catch (e) {
    console.error("Error encoding URL:", e);
    errorCode.textContent = "Error: " + e.message;
    error.style.display = "block";
    return null;
  }
}

function decodeURL(url) {
  try {
    const encoded = __uv$config.prefix + __uv$config.decodeURL(url);
    return encoded;
  } catch (e) {
    console.error("Error decoding URL:", e);
    errorCode.textContent = "Error: " + e.message;
    error.style.display = "block";
    return null;
  }
}
function isValidURL(str) {
  if (/^https?:\/\//i.test(str)) return true;

  const domainPattern = /^[a-z0-9.-]+\.[a-z]{2,}$/i;
  return domainPattern.test(str);
}

function encodeAny(input) {
  if (isValidURL(input)) {
    const url = /^https?:\/\//i.test(input) ? input : "http://" + input;
    return encodeURL(url);
  } else {
    return encodeTEXT(input);
  }
}

window.encodeURL = encodeURL;
window.decodeURL = decodeURL;
window.encodeTEXT = encodeTEXT;
window.encodeAny = encodeAny;
function start(url) {
  try {
    if (__uv$config.prefix && __uv$config) {
      sessionStorage.setItem("lpurl", encodeURL(url));
      // console.log("Lunaar Proxy URL:", sessionStorage.getItem("lpurl"));
      location.href = "/go";
      sessionStorage.setItem("rawurl", url);
    }
  } catch (e) {
    errorCode.textContent = "Error: " + e.message;
    error.style.display = "block";
    return;
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (localStorage.getItem("proxy-backend") === "ultraviolet") {
    const url = search(address.value, getSearchEngine());
    start(url);
  } else {
    const res = window.sjEncodeAndGo(address.value);

    console.log(res);
    sessionStorage.setItem("lpurl", res);
    window.location.href = "/go";
  }
});
console.log("Proxy started");
