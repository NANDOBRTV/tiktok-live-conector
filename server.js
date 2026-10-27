const express = require("express");

const app = express();
app.disable("x-powered-by");
app.use(express.json({ limit: "32kb" }));

const PORT = Number(process.env.PORT || 3000);
const TIKTOOLS_API_KEY = process.env.TIKTOOLS_API_KEY;
const DEFAULT_TIKTOK_USERNAME = (process.env.TIKTOK_USERNAME || "nandobr_ofc").replace(/^@/, "");

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    service: "tiktok-live-conector",
    configured: Boolean(TIKTOOLS_API_KEY),
    username: DEFAULT_TIKTOK_USERNAME
  });
});

app.get("/api/live-status", async (req, res) => {
  if (!TIKTOOLS_API_KEY) {
    return res.status(503).json({
      ok: false,
      error: "TIKTOOLS_API_KEY não configurada no ambiente do servidor."
    });
  }

  const username = String(req.query.username || DEFAULT_TIKTOK_USERNAME)
    .trim()
    .replace(/^@/, "");

  if (!/^[a-zA-Z0-9._]{1,64}$/.test(username)) {
    return res.status(400).json({ ok: false, error: "Nome de usuário TikTok inválido." });
  }

  const url = new URL("https://api.tik.tools/webcast/check_alive");
  url.searchParams.set("apiKey", TIKTOOLS_API_KEY);
  url.searchParams.set("unique_id", username);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const upstream = await fetch(url, {
      method: "GET",
      headers: { accept: "application/json" },
      signal: controller.signal
    });

    const bodyText = await upstream.text();
    let data;
    try {
      data = JSON.parse(bodyText);
    } catch {
      data = { raw: bodyText.slice(0, 2000) };
    }

    return res.status(upstream.ok ? 200 : 502).json({
      ok: upstream.ok,
      username,
      providerStatus: upstream.status,
      data
    });
  } catch (error) {
    const timedOut = error && error.name === "AbortError";
    return res.status(502).json({
      ok: false,
      username,
      error: timedOut
        ? "Tempo limite ao consultar Tik.Tools."
        : "Não foi possível conectar à API Tik.Tools."
    });
  } finally {
    clearTimeout(timeout);
  }
});

app.use((_req, res) => {
  res.status(404).json({ ok: false, error: "Endpoint não encontrado." });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`tiktok-live-conector listening on port ${PORT}`);
});