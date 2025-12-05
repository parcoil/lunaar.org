"use strict";

(() => {
  var h = self.Ultraviolet,
    O = [
      "cross-origin-embedder-policy",
      "cross-origin-opener-policy",
      "cross-origin-resource-policy",
      "content-security-policy",
      "content-security-policy-report-only",
      "expect-ct",
      "feature-policy",
      "origin-isolation",
      "strict-transport-security",
      "upgrade-insecure-requests",
      "x-content-type-options",
      "x-download-options",
      "x-frame-options",
      "x-permitted-cross-domain-policies",
      "x-powered-by",
      "x-xss-protection",
    ],
    C = ["GET", "HEAD"],
    g = class extends h.EventEmitter {
      constructor(e = __uv$config) {
        (super(),
          e.prefix || (e.prefix = "/service/"),
          (this.config = e),
          (this.bareClient = new h.BareClient()));
      }
      route({ request: e }) {
        return !!e.url.startsWith(location.origin + this.config.prefix);
      }
      async fetch({ request: e }) {
        let s;
        try {
          if (!e.url.startsWith(location.origin + this.config.prefix))
            return await fetch(e);
          let t = new h(this.config);
          typeof this.config.construct == "function" &&
            this.config.construct(t, "service");
          let w = await t.cookie.db();
          ((t.meta.origin = location.origin),
            (t.meta.base = t.meta.url = new URL(t.sourceUrl(e.url))));
          let o = new v(
            e,
            t,
            C.includes(e.method.toUpperCase()) ? null : await e.blob()
          );
          if (
            (t.meta.url.protocol === "blob:" &&
              ((o.blob = !0), (o.base = o.url = new URL(o.url.pathname))),
            e.referrer && e.referrer.startsWith(location.origin))
          ) {
            let i = new URL(t.sourceUrl(e.referrer));
            ((o.headers.origin ||
              (t.meta.url.origin !== i.origin && e.mode === "cors")) &&
              (o.headers.origin = i.origin),
              (o.headers.referer = i.href));
          }
          let f = (await t.cookie.getCookies(w)) || [],
            x = t.cookie.serialize(f, t.meta, !1);
          ((o.headers["user-agent"] = navigator.userAgent),
            x && (o.headers.cookie = x));
          let p = new u(o, null, null);
          if ((this.emit("request", p), p.intercepted)) return p.returnValue;
          s = o.blob ? "blob:" + location.origin + o.url.pathname : o.url;
          let c = await this.bareClient.fetch(s, {
              headers: o.headers,
              method: o.method,
              body: o.body,
              credentials: o.credentials,
              mode: o.mode,
              cache: o.cache,
              redirect: o.redirect,
            }),
            r = new y(o, c),
            l = new u(r, null, null);
          if ((this.emit("beforemod", l), l.intercepted)) return l.returnValue;
          for (let i of O) r.headers[i] && delete r.headers[i];
          if (
            (r.headers.location &&
              (r.headers.location = t.rewriteUrl(r.headers.location)),
            ["document", "iframe"].includes(e.destination))
          ) {
            let i = r.getHeader("content-disposition");
            if (!/\s*?((inline|attachment);\s*?)filename=/i.test(i)) {
              let n = /^\s*?attachment/i.test(i) ? "attachment" : "inline",
                [m] = new URL(c.finalURL).pathname.split("/").slice(-1);
              r.headers["content-disposition"] =
                `${n}; filename=${JSON.stringify(m)}`;
            }
          }
          if (
            (r.headers["set-cookie"] &&
              (Promise.resolve(
                t.cookie.setCookies(r.headers["set-cookie"], w, t.meta)
              ).then(() => {
                self.clients.matchAll().then(function (i) {
                  i.forEach(function (n) {
                    n.postMessage({
                      msg: "updateCookies",
                      url: t.meta.url.href,
                    });
                  });
                });
              }),
              delete r.headers["set-cookie"]),
            r.body)
          )
            switch (e.destination) {
              case "script":
                r.body = t.js.rewrite(await c.text());
                break;
              case "worker":
                {
                  let i = [
                    t.bundleScript,
                    t.clientScript,
                    t.configScript,
                    t.handlerScript,
                  ]
                    .map((n) => JSON.stringify(n))
                    .join(",");
                  ((r.body = `if (!self.__uv) {
                                ${t.createJsInject(
                                  t.cookie.serialize(f, t.meta, !0),
                                  e.referrer
                                )}
                            importScripts(${i});
                            }
`),
                    (r.body += t.js.rewrite(await c.text())));
                }
                break;
              case "style":
                r.body = t.rewriteCSS(await c.text());
                break;
              case "iframe":
              case "document":
                if (
                  r.getHeader("content-type") &&
                  r.getHeader("content-type").startsWith("text/html")
                ) {
                  let i = await c.text();
                  if (Array.isArray(this.config.inject)) {
                    let n = i.indexOf("<head>"),
                      m = i.indexOf("<HEAD>"),
                      b = i.indexOf("<body>"),
                      k = i.indexOf("<BODY>"),
                      S = new URL(s),
                      U = this.config.inject;
                    for (let d of U)
                      new RegExp(d.host).test(S.host) &&
                        (d.injectTo === "head"
                          ? (n !== -1 || m !== -1) &&
                            (i = i.slice(0, n) + `${d.html}` + i.slice(n))
                          : d.injectTo === "body" &&
                            (b !== -1 || k !== -1) &&
                            (i = i.slice(0, b) + `${d.html}` + i.slice(b)));
                  }
                  r.body = t.rewriteHtml(i, {
                    document: !0,
                    injectHead: t.createHtmlInject(
                      t.handlerScript,
                      t.bundleScript,
                      t.clientScript,
                      t.configScript,
                      t.cookie.serialize(f, t.meta, !0),
                      e.referrer
                    ),
                  });
                }
                break;
              default:
                break;
            }
          return (
            o.headers.accept === "text/event-stream" &&
              (r.headers["content-type"] = "text/event-stream"),
            crossOriginIsolated &&
              (r.headers["Cross-Origin-Embedder-Policy"] = "require-corp"),
            this.emit("response", l),
            l.intercepted
              ? l.returnValue
              : new Response(r.body, {
                  headers: r.headers,
                  status: r.status,
                  statusText: r.statusText,
                })
          );
        } catch (t) {
          return ["document", "iframe"].includes(e.destination)
            ? (console.error(t), T(t, s))
            : new Response(void 0, { status: 500 });
        }
      }
      static Ultraviolet = h;
    };
  self.UVServiceWorker = g;
  var y = class {
      constructor(e, s) {
        ((this.request = e),
          (this.raw = s),
          (this.ultraviolet = e.ultraviolet),
          (this.headers = {}));
        for (let t in s.rawHeaders)
          this.headers[t.toLowerCase()] = s.rawHeaders[t];
        ((this.status = s.status),
          (this.statusText = s.statusText),
          (this.body = s.body));
      }
      get url() {
        return this.request.url;
      }
      get base() {
        return this.request.base;
      }
      set base(e) {
        this.request.base = e;
      }
      getHeader(e) {
        return Array.isArray(this.headers[e])
          ? this.headers[e][0]
          : this.headers[e];
      }
    },
    v = class {
      constructor(e, s, t = null) {
        ((this.ultraviolet = s),
          (this.request = e),
          (this.headers = Object.fromEntries(e.headers.entries())),
          (this.method = e.method),
          (this.body = t || null),
          (this.cache = e.cache),
          (this.redirect = e.redirect),
          (this.credentials = "omit"),
          (this.mode = e.mode === "cors" ? e.mode : "same-origin"),
          (this.blob = !1));
      }
      get url() {
        return this.ultraviolet.meta.url;
      }
      set url(e) {
        this.ultraviolet.meta.url = e;
      }
      get base() {
        return this.ultraviolet.meta.base;
      }
      set base(e) {
        this.ultraviolet.meta.base = e;
      }
    },
    u = class {
      #e;
      #t;
      constructor(e = {}, s = null, t = null) {
        ((this.#e = !1),
          (this.#t = null),
          (this.data = e),
          (this.target = s),
          (this.that = t));
      }
      get intercepted() {
        return this.#e;
      }
      get returnValue() {
        return this.#t;
      }
      respondWith(e) {
        ((this.#t = e), (this.#e = !0));
      }
    };
  function E(a, e) {
    let s = `
        errorTrace.value = ${JSON.stringify(a)};
        fetchedURL.textContent = ${JSON.stringify(e)};
        for (const node of document.querySelectorAll("#uvHostname")) node.textContent = ${JSON.stringify(
          location.hostname
        )};
        reload.addEventListener("click", () => location.reload());
        uvVersion.textContent = ${JSON.stringify("3.2.10")};
        uvBuild.textContent = ${JSON.stringify("92d9075")};
    `;
    return `<!DOCTYPE html>
        <html>
        <head>
        <meta charset='utf-8' />
        <title>Error - \u004C\u0075\u006E\u0061\u0061\u0072</title>
        <style>
        * { 
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body { 
          background-color: var(--bg-color, #090810);
          color: var(--text-color, #e5e4f2);
          font-family: var(--font-family, "Poppins", sans-serif);
          line-height: 1.6;
          padding: 2rem;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        
        h1 { 
          color: var(--primary-color, #9282fb);
          margin-bottom: 1rem;
          font-size: 2.5rem;
          text-align: center;
        }
        
        hr { 
          border: none;
          height: 2px;
          background: var(--border-color, #2c2c3f);
          margin: 2rem 0;
          width: 100%;
          max-width: 600px;
        }
        
        p { 
          margin: 1rem 0;
          text-align: center;
          max-width: 600px;
        }
        
        b { 
          color: var(--accent-color, #b263a6);
          font-weight: 600;
        }
        
        textarea { 
          background: var(--bg-2-color, #171527);
          border: 2px solid var(--border-color, #2c2c3f);
          border-radius: var(--border-radius, 12px);
          color: var(--text-color, #e5e4f2);
          padding: 1rem;
          width: 100%;
          max-width: 600px;
          height: 200px;
          font-family: monospace;
          resize: vertical;
          margin: 1rem 0;
        }
        
        textarea:focus {
          outline: none;
          border-color: var(--primary-color, #9282fb);
          box-shadow: 0 0 0 3px rgba(146, 130, 251, 0.1);
        }
        
        ul { 
          margin: 1rem 0;
          padding-left: 2rem;
          max-width: 600px;
        }
        
        li { 
          margin: 0.5rem 0;
          color: var(--text-secondary-color, #b0b0b0);
        }
        
        button { 
          background: var(--primary-color, #9282fb);
          color: var(--text-color, #e5e4f2);
          border: none;
          border-radius: var(--border-radius, 12px);
          padding: 0.75rem 2rem;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          margin: 1rem 0;
        }
        
        button:hover {
          background: var(--accent-color, #b263a6);
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(146, 130, 251, 0.3);
        }
        
        a { 
          color: var(--primary-color, #9282fb);
          text-decoration: none;
          transition: color 0.2s ease;
        }
        
        a:hover {
          color: var(--accent-color, #b263a6);
        }
        
        i { 
          color: var(--text-secondary-color, #b0b0b0);
          font-style: normal;
        }
        
        .error-container {
          background: var(--bg-2-color, #171527);
          border: 2px solid var(--border-color, #2c2c3f);
          border-radius: var(--border-radius, 12px);
          padding: 2rem;
          max-width: 700px;
          width: 100%;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }
        
        .error-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        
        .error-content {
          margin-bottom: 2rem;
        }
        
        .error-actions {
          text-align: center;
        }
        
        .error-footer {
          text-align: center;
          margin-top: 2rem;
        }
        
        @media (max-width: 768px) {
          body {
            padding: 1rem;
          }
          
          h1 {
            font-size: 2rem;
          }
          
          .error-container {
            padding: 1.5rem;
          }
        }
        </style>
            <!-- Google tag (gtag.js) -->
    <script
      async
      src="https://www.googletagmanager.com/gtag/js?id=G-W8NZMM8WN9"
    ></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        dataLayer.push(arguments);
      }
      gtag("js", new Date());

      gtag("config", "G-W8NZMM8WN9");
    </script>

    <script
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1565760898646999"
      crossorigin="anonymous"
    ></script>
  <script>
    !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey getNextSurveyStep identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
    posthog.init('phc_P06vTyQqGuoDZVvO6sIw4diVNQH1vcqahBmrqhx1TrO',{api_host:'https://us.i.posthog.com', defaults:'2025-05-24'})
</script>

</head>
        <body>
        <div class="error-container">
          <div class="error-header">
          
            <h1 id='errorTitle'>Error Processing Request</h1>
          </div>
          
          <div class="error-content">
            <p>Failed to load <b id="fetchedURL"></b></p>
            <p id="errorMessage">Internal Server Error</p>
            
            <textarea id="errorTrace" cols="40" rows="10" readonly placeholder="Error details will appear here..."></textarea>
            
            <p><b>Try these solutions:</b></p>
            <ul>
              <li>Check your internet connection</li>
              <li>Verify you entered the correct address</li>
              <li>Clear the site data and cookies</li>
              <li>Contact <b id="uvHostname"></b>'s administrator</li>
              <li>Verify the server isn't censored</li>
            </ul>
            
            <p><b>If you're the administrator of <b id="uvHostname"></b>:</b></p>
            <ul>
              <li>Restart your server</li>
              <li>Update Ultraviolet to the latest version</li>
              <li>Troubleshoot the error on the <a href="https://github.com/titaniumnetwork-dev/Ultraviolet" target="_blank">GitHub repository</a></li>
            </ul>
          </div>
          
          <div class="error-actions">
            <button id="reload">Reload Page</button>
          </div>
          
          <div class="error-footer">
            <i>\u004C\u0075\u006E\u0061\u0061\u0072 V7 Ultraviolet v<span id="uvVersion"></span> (build <span id="uvBuild"></span>)</i>
          </div>
        </div>
        <script src="${
          "data:application/javascript," + encodeURIComponent(s)
        }"><\/script>
        <script src="https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js"></script>
</body>
        </html>
        `;
  }
  function T(a, e) {
    let s = { "content-type": "text/html" };
    return (
      crossOriginIsolated &&
        (s["Cross-Origin-Embedder-Policy"] = "require-corp"),
      new Response(E(String(a), e), { status: 500, headers: s })
    );
  }
})();
//# sourceMappingURL=uv.sw.js.map
