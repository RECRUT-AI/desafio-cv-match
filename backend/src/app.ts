import express, { type ErrorRequestHandler } from "express";
import cors from "cors";
import { createMatchRouter } from "./routes/match.js";
import { InMemoryMatchRepository } from "./store/match-repository.js";

export function createApp() {
  const app = express();
  const origin = process.env.CORS_ORIGIN ?? "http://localhost:5173";
  app.use(cors({ origin }));
  app.use(express.json({ limit: "1mb" }));

  app.get("/", (_req, res) =>
    res.json({
      name: "CV Match API",
      message:
        "API de matching entre currículos e vagas. Envie um CV e uma vaga para POST /api/match e consulte a análise em GET /api/match/report/:id.",
      endpoints: [
        { method: "GET", path: "/", description: "Informações sobre a API" },
        {
          method: "POST",
          path: "/api/match",
          description: "Calcula a compatibilidade entre um CV e uma vaga",
        },
        {
          method: "GET",
          path: "/api/match/report/:id",
          description: "Retorna os detalhes de uma análise de match",
        },
      ],
    }),
  );
  app.use("/api", createMatchRouter(new InMemoryMatchRepository()));

  const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
    if (error instanceof SyntaxError && "body" in error)
      return res.status(400).json({ error: "JSON inválido." });
    return res.status(500).json({ error: "Erro interno do servidor." });
  };
  app.use(errorHandler);
  return app;
}
