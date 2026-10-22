
"use strict";

require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");

const app = express();

const PORT = Number(process.env.PORT) || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";
const IS_PRODUCTION = NODE_ENV === "production";
const PUBLIC_DIR = path.resolve(__dirname, "../public");

// Confiança em proxy somente quando explicitamente configurada.
// Configure corretamente ao publicar atrás de um proxy reverso.
if (process.env.TRUST_PROXY === "1") {
  app.set("trust proxy", 1);
}

app.disable("x-powered-by");

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
        imgSrc: ["'self'", "data:", "https://images.unsplash.com"],
        connectSrc: ["'self'"],
        formAction: ["'self'"],
        baseUri: ["'self'"],
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"],
        upgradeInsecureRequests: IS_PRODUCTION ? [] : null
      }
    },
    referrerPolicy: {
      policy: "strict-origin-when-cross-origin"
    }
  })
);

// Limite geral de requisições por IP.
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 200,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
      error: "Muitas solicitações. Aguarde alguns minutos e tente novamente."
    }
  })
);

// Não é necessário aceitar payloads grandes neste site estático.
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: false, limit: "10kb" }));

// Arquivos estáticos.
app.use(
  express.static(PUBLIC_DIR, {
    index: "index.html",
    dotfiles: "deny",
    etag: true,
    maxAge: IS_PRODUCTION ? "1h" : 0,
    setHeaders(res, filePath) {
      if (path.extname(filePath) === ".html") {
        res.setHeader("Cache-Control", "no-cache");
      }
    }
  })
);

// Verificação básica de disponibilidade.
app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "clinica-odontologica"
  });
});

// Página não encontrada.
app.use((_req, res) => {
  res.status(404).sendFile(path.join(PUBLIC_DIR, "404.html"));
});

// Tratamento centralizado de erros.
app.use((err, _req, res, _next) => {
  console.error("Erro interno:", err.message);

  if (res.headersSent) return;

  res.status(500).json({
    error: "Ocorreu um erro interno. Tente novamente mais tarde."
  });
});

app.listen(PORT, () => {
  console.log(`Clínica odontológica disponível em http://localhost:${PORT}`);
  console.log(`Ambiente: ${NODE_ENV}`);
});
