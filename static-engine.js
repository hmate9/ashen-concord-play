(function () {
  const script = document.currentScript;
  const policyDir = script?.dataset.policyDir || "/static-policies";
  const staticDir = script?.dataset.staticDir || "/web";
  const assetVersion = script?.dataset.assetVersion || "";

  let engineReady = null;
  let cwraps = null;

  function parseJsonResult(text) {
    // Native asset paths are rooted at /assets. Keep packaged games portable
    // under a project subdirectory as well as a domain root.
    const payload = JSON.parse(text, (_key, value) =>
      typeof value === "string" && value.startsWith("/assets/")
        ? new URL(`.${value}`, document.baseURI).href : value);
    if (payload && payload.error) {
      throw new Error(payload.error);
    }
    return payload;
  }

  function normalizeSkin(value) {
    if (value === "dune" || value === "starfall" || value === "uprising") {
      return value;
    }
    const configured = window.DUNE_AGENT_DEFAULT_SKIN;
    if (configured === "dune" || configured === "starfall" || configured === "uprising") {
      return configured;
    }
    return "starfall";
  }

  function normalizePlayers(value) {
    const parsed = Number(value);
    if (Number.isInteger(parsed) && parsed >= 2 && parsed <= 4) {
      return parsed;
    }
    const configured = Number(window.DUNE_AGENT_PLAYER_COUNT);
    return Number.isInteger(configured) && configured >= 2 && configured <= 4
      ? configured
      : 4;
  }

  async function loadModule(initialSkin = "", players = 4) {
    if (cwraps) return cwraps;
    if (!engineReady) {
      engineReady = (async () => {
        const normalizedInitialSkin = normalizeSkin(initialSkin);
        const createStaticModule = window.createStarfallStaticModule;
        if (typeof createStaticModule !== "function") {
          throw new Error("Static engine module is not loaded.");
        }
        const moduleOptions = {};
        if (assetVersion) {
          moduleOptions.locateFile = (path, prefix) => {
            const base = `${prefix || ""}${path}`;
            if (path === "starfall_static_web.data" || path === "starfall_static_web.wasm") {
              return `${base}?v=${encodeURIComponent(assetVersion)}`;
            }
            return base;
          };
        }
        const module = await createStaticModule(moduleOptions);
        let initWithSkin = null;
        try {
          initWithSkin = module.cwrap("starfall_static_web_init_with_skin", "string",
              ["string", "string", "number", "number", "number", "string"]);
        } catch (error) {
          initWithSkin = null;
        }
        if (!initWithSkin && normalizedInitialSkin === "uprising") {
          throw new Error("Static Uprising requires a rebuilt static engine with Uprising support.");
        }
        const init = initWithSkin || module.cwrap("starfall_static_web_init", "string",
            ["string", "string", "number", "number", "number"]);
        cwraps = {
          init,
          health: module.cwrap("starfall_static_web_health", "string", []),
          currentState: module.cwrap("starfall_static_web_current_state", "string", ["string"]),
          initSupportsSkin: Boolean(initWithSkin),
          newGame: module.cwrap("starfall_static_web_new_game", "string",
              ["number", "number", "number", "string"]),
          applyAction: module.cwrap("starfall_static_web_apply_action", "string", ["string", "number"]),
          setSettings: module.cwrap("starfall_static_web_set_settings", "string",
              ["string", "number", "number", "string"]),
        };
        const playerCount = normalizePlayers(players);
        parseJsonResult(initWithSkin
          ? init(policyDir, staticDir, playerCount, 0, 0, normalizedInitialSkin)
          : init(policyDir, staticDir, playerCount, 0, 0));
        return cwraps;
      })();
    }
    return await engineReady;
  }

  const staticEngine = {
    async health() {
      return parseJsonResult((await loadModule()).health());
    },
    async currentState(sessionId) {
      return parseJsonResult((await loadModule()).currentState(sessionId));
    },
    async postJson(url, body) {
      if (url === "/api/new") {
        const requestedSkin = normalizeSkin(body?.skin);
        const engine = await loadModule(requestedSkin, body?.players);
        if (!engine.initSupportsSkin && requestedSkin === "uprising") {
          throw new Error("Static Uprising requires a rebuilt static engine with Uprising support.");
        }
        return parseJsonResult(engine.newGame(
            Number(body?.seed || 0),
            Number.isFinite(Number(body?.humanPlayer)) ? Number(body.humanPlayer) : -1,
            Number.isFinite(Number(body?.humanLeader)) ? Number(body.humanLeader) : -1,
            requestedSkin));
      }
      const engine = await loadModule(body?.skin, body?.players);
      const actionMatch = url.match(/^\/api\/session\/([^/]+)\/action$/);
      if (actionMatch) {
        return parseJsonResult(engine.applyAction(actionMatch[1], Number(body?.action)));
      }
      const settingsMatch = url.match(/^\/api\/session\/([^/]+)\/settings$/);
      if (settingsMatch) {
        return parseJsonResult(engine.setSettings(
            settingsMatch[1],
            body?.opponentSearchEnabled ? 1 : 0,
            Number(body?.opponentSearchSimulations || 1),
            body?.skin ? normalizeSkin(body.skin) : ""));
      }
      throw new Error(`Unsupported static engine endpoint: ${url}`);
    },
  };
  window.starfallStaticEngine = staticEngine;
  window.duneStaticEngine = staticEngine;
})();
