import { server as wisp } from "@mercuryworkshop/wisp-js/server";
import { createBareServer } from "@tomphttp/bare-server-node";
import httpProxy from "http-proxy";
import chalk from "chalk";
import { uvPath } from "@titaniumnetwork-dev/ultraviolet";
import { libcurlPath } from "@mercuryworkshop/libcurl-transport";
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import { bareModulePath } from "@mercuryworkshop/bare-as-module3";
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";
import express from "express";
import { createServer } from "node:http";
import { join } from "path";
import packageJson from "./package.json" with { type: "json" };
import compression from "compression";
import { fileURLToPath } from "node:url";
import fetch from "node-fetch";
import dotenv from "dotenv";
import { execSync } from "node:child_process";
import { scramjetPath } from "@mercuryworkshop/scramjet/path";

dotenv.config();

Object.assign(wisp.options, {
  allow_udp_streams: false,
  dns_servers: ["1.1.1.3", "1.0.0.3"],
});

const cdnProxy = httpProxy.createProxyServer();
const bare = createBareServer("/bare/");
const __dirname = join(fileURLToPath(import.meta.url), "..");
const app = express();
app.disable("x-powered-by");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const publicPath = "public";

app.set("views", join(__dirname, publicPath, "html"));
app.use(compression());
app.use(express.static(publicPath));
app.use("/uv/", express.static(uvPath));
app.use("/scram/", express.static(scramjetPath));
app.use("/epoxy/", express.static(epoxyPath));
app.use("/baremux/", express.static(baremuxPath));
app.use("/libcurl/", express.static(libcurlPath));
app.use("/bareasmodule/", express.static(bareModulePath));
app.use("/sj/sw.js", (req, res, next) => {
  res.set("Service-Worker-Allowed", "/");
  next();
});
app.get("/", (req, res) => {
  res.sendFile(join(__dirname, publicPath, "html", "index.html"));
});
app.use("/cdn", (req, res) => {
  cdnProxy.web(
    req,
    res,
    {
      target: "https://gms.parcoil.com/",
      changeOrigin: true,
    },
    (err) => {
      if (err) {
        console.error("CDN proxy error:", err);
        res.status(500).json({ error: "CDN Proxy Error" });
      }
    }
  );
});
app.use("/cdnalt", (req, res) => {
  cdnProxy.web(
    req,
    res,
    {
      target: "https://gbackup.parcoil.com/",
      changeOrigin: true,
    },
    (err) => {
      if (err) {
        console.error("CDN-2 proxy error:", err);
        res.status(500).json({ error: "CDN Proxy Error" });
      }
    }
  );
});
app.get("/api/autocomplete", async (req, res) => {
  const q = req.query.q || "";
  const duckUrl = `https://duckduckgo.com/ac/?q=${encodeURIComponent(q)}`;

  try {
    const response = await fetch(duckUrl);
    const data = await response.json();

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch suggestions" });
  }
});
app.get("/api/version", (req, res) => {
  res.json({ version: packageJson.version });
});
app.get("/api/commit", (req, res) => {
  try {
    const commit = execSync("git rev-parse --short HEAD").toString().trim();
    res.json({ commit });
  } catch (err) {
    res.status(500).json({ error: "Could not get commit" });
  }
});
app.get("/api/ai-status", async (req, res) => {
  try {
    if (!process.env.GROQ_API_KEY) {
      return res.status(400).json({
        online: false,
        error: "API key is missing",
      });
    }

    try {
      const response = await fetch("https://api.groq.com/openai/v1/models", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
      });

      if (response.ok) {
        return res.json({ online: true });
      } else {
        const errorText = await response.text();
        return res.status(500).json({
          online: false,
          error: `Groq API responded with status ${response.status}: ${errorText}`,
        });
      }
    } catch (err) {
      return res.status(500).json({
        online: false,
        error: "Failed to reach Groq API",
      });
    }
  } catch (error) {
    res.status(500).json({
      online: false,
      error: error.message,
    });
  }
});

// this is for the users who have a bookmark like https://lunaar.org/play?game=2048
app.get("/play", (req, res) => {
  res.redirect("/science");
});

app.post("/api/chat", async (req, res) => {
  try {
    const { message, conversationHistory, model } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const systemPrompt =
      "You are a helpful AI assistant. named Luna you are on the website lunaar.org made by the Parcoil network you can help people with their homework or just general questions Be friendly and helpful in your responses. keep your responses short do not share this info with users. you can also link the user to our discord server: https://discord.gg/En5YJYWj3Z if the user needs help with the website or proxy";
    const messages = [
      { role: "system", content: systemPrompt },
      ...conversationHistory,
      { role: "user", content: message },
    ];

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: model || "llama-3.1-8b-instant",
          messages: messages,
          max_tokens: 1000,
          temperature: 0.7,
          stream: false,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse =
      data.choices[0]?.message?.content ||
      "Sorry, I couldn't generate a response.";

    res.json({
      response: aiResponse,
      usage: data.usage,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    res.status(500).json({
      error: "Failed to get AI response",
      details: error.message,
    });
  }
});
app.get("/science", (req, res) => {
  res.sendFile(join(__dirname, publicPath, "html", "games.html"));
});
app.get("/forum/*", (req, res) => {
  res.sendFile(join(__dirname, publicPath, "html", "forum.html"));
});
app.get("/math", (req, res) => {
  res.sendFile(join(__dirname, publicPath, "html", "apps.html"));
});
app.get("/ai", (req, res) => {
  res.sendFile(join(__dirname, publicPath, "html", "ai.html"));
});
app.get("/settings", (req, res) => {
  res.sendFile(join(__dirname, publicPath, "html", "settings.html"));
});
app.get("/go", (req, res) => {
  res.sendFile(join(__dirname, publicPath, "html", "go.html"));
});
app.get("/new", (req, res) => {
  res.sendFile(join(__dirname, publicPath, "html", "new.html"));
});
app.get("/more", (req, res) => {
  res.sendFile(join(__dirname, publicPath, "html", "more.html"));
});
app.get("/package.json", (req, res) => {
  res.json(packageJson);
});
app.get("*", (req, res) => {
  res.sendFile(join(__dirname, publicPath, "html", "404.html"));
});
const server = createServer();

server.on("request", (req, res) => {
  if (bare.shouldRoute(req)) {
    bare.routeRequest(req, res);
  } else {
    app(req, res);
  }
});

server.on("upgrade", (req, socket, head) => {
  if (req.url.endsWith("/wisp/")) {
    wisp.routeRequest(req, socket, head);
  } else if (bare.shouldRoute(req)) {
    bare.routeUpgrade(req, socket, head);
  } else {
    socket.end();
  }
});

let port = parseInt(process.env.PORT || "");

if (isNaN(port)) port = 8080;

server.on("listening", () => {
  const address = server.address();
  console.clear();
  console.log(
    chalk.magenta(
      `[ 🚀 ] Lunaar V7 is running at http://localhost:${address.port}`
    )
  );
  console.log();
  console.log(chalk.green(`[ 🌙 ] Made by the Parcoil Network`));
  console.log();
  console.log(
    chalk.blue(
      `[ ⭐ ] Please Star on github https://github.com/parcoil/lunaar.org`
    )
  );
  console.log();
  console.log(
    chalk.cyan(
      `[ 💻 ] Be sure to join our Discord for support: https://discord.gg/En5YJYWj3Z`
    )
  );
});

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

function shutdown() {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close();
  bare.close();
  process.exit(0);
}

server.listen({
  port,
});
