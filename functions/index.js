const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const axios = require("axios");
const cheerio = require("cheerio");

function parseMoneyBRL(text) {
  if (!text) return null;

  const cleaned = text
    .replace(/[^\d,.-]/g, "")
    .replace(/\./g, "")
    .replace(",", ".");

  const value = Number(cleaned);
  return Number.isFinite(value) ? value : null;
}

function extractCampaignData(html, url) {
  const $ = cheerio.load(html);
  const fullText = $("body").text().replace(/\s+/g, " ").trim();

  const arrecadadoMatch = fullText.match(/Arrecadado\s*R\$\s*([\d\.,]+)/i);
  const apoiadoresMatch = fullText.match(/Apoiadores\s*(\d+)/i);
  const metaMatch = fullText.match(/Meta\s*R\$\s*([\d\.,]+)/i);

  const valorArrecadadoStr = arrecadadoMatch ? `R$ ${arrecadadoMatch[1]}` : null;
  const valorMetaStr = metaMatch ? `R$ ${metaMatch[1]}` : null;
  const apoiadoresNum = apoiadoresMatch ? Number(apoiadoresMatch[1]) : null;

  const valorArrecadadoNum = valorArrecadadoStr ? parseMoneyBRL(valorArrecadadoStr) : null;
  const valorMetaNum = valorMetaStr ? parseMoneyBRL(valorMetaStr) : null;

  const percentual =
    valorArrecadadoNum !== null && valorMetaNum !== null && valorMetaNum > 0
      ? Math.min(100, Math.round((valorArrecadadoNum / valorMetaNum) * 100))
      : null;

  return {
    url,
    valor_arrecadado: valorArrecadadoStr,
    valor_arrecadado_num: valorArrecadadoNum,
    valor_meta: valorMetaStr,
    valor_meta_num: valorMetaNum,
    percentual,
    num_apoiadores: Number.isFinite(apoiadoresNum) ? apoiadoresNum : null
  };
}

function isValidVakinhaUrl(value) {
  try {
    const u = new URL(value);
    return u.hostname.includes("vakinha.com.br");
  } catch {
    return false;
  }
}

async function fetchVakinha(url) {
  const response = await axios.get(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
      "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7"
    },
    timeout: 15000
  });

  return extractCampaignData(response.data, url);
}

function getUrlFromRequest(req) {
  if (req.method === "GET") {
    return req.query?.url;
  }

  if (req.method === "POST") {
    if (typeof req.body === "string") {
      try {
        const parsed = JSON.parse(req.body);
        return parsed?.url;
      } catch {
        return null;
      }
    }

    return req.body?.url;
  }

  return null;
}

exports.api = onRequest(
  {
    region: "southamerica-east1",
    timeoutSeconds: 30,
    memory: "256MiB"
  },
  async (req, res) => {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Headers", "Content-Type");
    res.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");

    if (req.method === "OPTIONS") {
      return res.status(204).send("");
    }

    const normalizedPath = (req.path || "").replace(/\/+$/, "");
    const validPath =
      normalizedPath === "/vakinha" ||
      normalizedPath === "/api/vakinha" ||
      normalizedPath === "";

    if (!validPath) {
      return res.status(404).json({ error: "Rota não encontrada." });
    }

    if (req.method !== "GET" && req.method !== "POST") {
      return res.status(405).json({ error: "Método não permitido." });
    }

    try {
      const url = getUrlFromRequest(req);

      if (!isValidVakinhaUrl(url)) {
        return res.status(400).json({ error: "URL inválida da Vakinha." });
      }

      const data = await fetchVakinha(url);

      if (data.valor_arrecadado === null && data.num_apoiadores === null) {
        return res.status(422).json({
          error: "Não foi possível localizar os dados da campanha na página."
        });
      }

      return res.json(data);
    } catch (error) {
      logger.error("Falha ao consultar campanha da Vakinha", error);
      return res.status(500).json({
        error: "Falha ao consultar a campanha.",
        details: error.message
      });
    }
  }
);
