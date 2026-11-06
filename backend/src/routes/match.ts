import { randomUUID } from "node:crypto";
import { Router, type Request, type Response } from "express";
import {
  calculateScore,
  createInsights,
  createSuggestedQuestions,
  detectSkills,
} from "../services/matching.js";
import type { JobInput, MatchRequest, MatchResult } from "../types.js";
import type { MatchRepository } from "../store/match-repository.js";

function isJobInput(value: unknown): value is JobInput {
  if (!value || typeof value !== "object") return false;
  const job = value as Record<string, unknown>;
  return (
    typeof job.jobId === "string" &&
    job.jobId.trim().length > 0 &&
    Array.isArray(job.requiredSkills) &&
    job.requiredSkills.length > 0 &&
    job.requiredSkills.every((skill) => typeof skill === "string")
  );
}

export function createMatchRouter(repository: MatchRepository): Router {
  const router = Router();

  router.post("/match", (req: Request, res: Response) => {
    const body = req.body as Partial<MatchRequest> | undefined;
    if (!body || typeof body.cv !== "string" || body.cv.trim().length === 0) {
      return res
        .status(400)
        .json({
          error: "O campo cv é obrigatório e deve ser uma string não vazia.",
        });
    }
    if (!body.job || typeof body.job !== "object") {
      return res.status(400).json({ error: "O campo job é obrigatório." });
    }
    const rawJob = body.job as Partial<JobInput>;
    if (typeof rawJob.jobId !== "string" || rawJob.jobId.trim().length === 0) {
      return res
        .status(400)
        .json({
          error: "O campo job.jobId é obrigatório e não pode ser vazio.",
        });
    }
    if (
      !Array.isArray(rawJob.requiredSkills) ||
      rawJob.requiredSkills.length === 0
    ) {
      return res
        .status(400)
        .json({
          error: "O campo requiredSkills é obrigatório e não pode ser vazio.",
        });
    }
    if (!rawJob.requiredSkills.every((skill) => typeof skill === "string")) {
      return res
        .status(400)
        .json({ error: "Todos os itens de requiredSkills devem ser strings." });
    }
    if (!isJobInput(body.job)) {
      return res
        .status(400)
        .json({
          error: "O campo job deve conter jobId e requiredSkills válidos.",
        });
    }

    const { matchedSkills, missingSkills } = detectSkills(
      body.cv,
      body.job.requiredSkills,
    );
    const overallScore = calculateScore(
      matchedSkills.length,
      matchedSkills.length + missingSkills.length,
    );
    const result: MatchResult = {
      matchId: randomUUID(),
      candidateId: randomUUID(),
      jobId: body.job.jobId,
      overallScore,
      matchedSkills,
      missingSkills,
      insights: createInsights(overallScore, matchedSkills, missingSkills),
      suggestedQuestions: createSuggestedQuestions(
        matchedSkills,
        missingSkills,
      ),
    };
    repository.save(result);
    return res.status(201).json(result);
  });

  router.get("/match/report/:id", (req: Request, res: Response) => {
    const result = repository.findById(String(req.params.id));
    if (!result)
      return res.status(404).json({ error: "Análise não encontrada." });
    return res.status(200).json(result);
  });

  return router;
}
