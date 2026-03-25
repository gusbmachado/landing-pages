import express from "express";
import axios from "axios";
import * as cheerio from "cheerio";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("."));

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
    valorArrecadadoNum !== null &&
    valorMetaNum !== null &&
    valorMetaNum > 0
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

app.post("/api/vakinha", async (req, res) => {
  try {
    const { url } = req.body || {};

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
    return res.status(500).json({
      error: "Falha ao consultar a campanha.",
      details: error.message
    });
  }
});

app.get("/api/vakinha", async (req, res) => {
  try {
    const { url } = req.query;

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
    return res.status(500).json({
      error: "Falha ao consultar a campanha.",
      details: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
