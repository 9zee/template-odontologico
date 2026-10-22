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

const PUBLIC_DIR = path.resolve(__dirname, "..", "public");

app.disable("x-powered-by");
app.set("trust proxy", 1);

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: [
          "'self'",
          "data:",
          "https:",
          "blob:"
        ],
        fontSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        upgradeInsecureRequests: IS_PRODUCTION ? [] : null
      }
    },
    crossOriginEmbedderPolicy: false
  })
);

app.use(
  express.json({
    limit: "20kb"
  })
);

app.use(
  express.urlencoded({
    extended: false,
    limit: "20kb"
  })
);

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 200,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    error: "Muitas solicitações. Aguarde e tente novamente."
  }
});

app.use(generalLimiter);

/*
 * Verificação de saúde para a hospedagem.
 * Não depende de banco de dados.
 */
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "template-odontologico",
    environment: NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

/*
 * Arquivos estáticos do site.
 * index.html fica dentro de public/.
 */
app.use(
  express.static(PUBLIC_DIR, {
    index: "index.html",
    extensions: ["html"],
    dotfiles: "ignore",
    fallthrough: true,
    maxAge: IS_PRODUCTION ? "1h" : 0
  })
);

/*
 * Página não encontrada.
 */
app.use((req, res) => {
  res.status(404).sendFile(
    path.join(PUBLIC_DIR, "404.html"),
    (error) => {
      if (error && !res.headersSent) {
        res.status(404).type("text").send(
          "Página não encontrada."
        );
      }
    }
  );
});

/*
 * Tratamento centralizado de erros.
 */
app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  console.error("Erro interno:", error);

  res.status(500).json({
    error: IS_PRODUCTION
      ? "Ocorreu um erro interno no servidor."
      : error.message
  });
});

/*
 * Inicia o servidor para hospedagem
 * e desenvolvimento local.
 */
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log("------------------------------------");
  console.log(" TEMPLATE ODONTOLÓGICO");
  console.log("------------------------------------");
  console.log(`Ambiente: ${NODE_ENV}`);
  console.log(`Porta: ${PORT}`);
  console.log(`Diretório público: ${PUBLIC_DIR}`);
  console.log(`Health check: /health`);
  console.log("------------------------------------");
});

/*
 * Encerramento controlado.
 */
function shutdown(signal) {
  console.log(`${signal} recebido. Encerrando servidor...`);

  server.close((error) => {
    if (error) {
      console.error("Erro ao encerrar:", error);
      process.exit(1);
    }

    console.log("Servidor encerrado.");
    process.exit(0);
  });

  setTimeout(() => {
    console.error("Tempo limite para encerramento excedido.");
    process.exit(1);
  }, 10000).unref();
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));