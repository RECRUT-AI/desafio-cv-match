import fs from "node:fs/promises";
import path from "node:path";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";

const app = createApp();
const job = {
  jobId: "job-001",
  requiredSkills: ["Python", "AWS", "Docker", "Kubernetes", "Terraform"],
};

describe("API", () => {
  it("GET / retorna informações", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.body.name).toBe("CV Match API");
    expect(response.body.endpoints).toHaveLength(3);
  });

  it("POST /api/match cria e GET /report recupera o mesmo relatório", async () => {
    const response = await request(app)
      .post("/api/match")
      .send({ cv: "Python AWS", job });
    expect(response.status).toBe(201);
    expect(response.body.overallScore).toBe(40);
    const report = await request(app).get(
      `/api/match/report/${response.body.matchId}`,
    );
    expect(report.status).toBe(200);
    expect(report.body).toEqual(response.body);
  });

  it.each([
    [{ job }, "O campo cv é obrigatório"],
    [{ cv: 1, job }, "O campo cv é obrigatório"],
    [{ cv: "x" }, "O campo job é obrigatório"],
    [{ cv: "x", job: { ...job, jobId: "" } }, "job.jobId"],
    [{ cv: "x", job: { ...job, requiredSkills: [] } }, "requiredSkills"],
    [{ cv: "x", job: { ...job, requiredSkills: "Python" } }, "requiredSkills"],
    [{ cv: "x", job: { ...job, requiredSkills: ["Python", 2] } }, "Todos"],
  ])("valida entrada inválida", async (body, message) => {
    const response = await request(app).post("/api/match").send(body);
    expect(response.status).toBe(400);
    expect(response.body.error).toContain(message);
  });

  it("retorna 400 para JSON inválido e 404 para relatório inexistente", async () => {
    const invalid = await request(app)
      .post("/api/match")
      .set("Content-Type", "application/json")
      .send("{invalid");
    expect(invalid.status).toBe(400);
    expect(invalid.body).toEqual({ error: "JSON inválido." });
    const missing = await request(app).get("/api/match/report/nao-existe");
    expect(missing.status).toBe(404);
    expect(missing.body).toEqual({ error: "Análise não encontrada." });
  });
});

describe("CVs de referência", () => {
  it.each([
    [
      "candidate_cv_maria_silva.md",
      100,
      ["Python", "AWS", "Docker", "Kubernetes", "Terraform"],
      [],
    ],
    [
      "candidate_cv_joao_santos.md",
      40,
      ["AWS", "Docker"],
      ["Python", "Kubernetes", "Terraform"],
    ],
    [
      "candidate_cv_ana_ferreira.md",
      20,
      ["Python"],
      ["AWS", "Docker", "Kubernetes", "Terraform"],
    ],
  ])(
    "calcula o resultado esperado para %s",
    async (file, score, matched, missing) => {
      const cv = await fs.readFile(
        path.resolve(process.cwd(), "../data", file),
        "utf8",
      );
      const response = await request(app).post("/api/match").send({ cv, job });
      expect(response.status).toBe(201);
      expect(response.body.overallScore).toBe(score);
      expect(response.body.matchedSkills).toEqual(matched);
      expect(response.body.missingSkills).toEqual(missing);
    },
  );
});
