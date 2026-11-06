import fs from "node:fs/promises";
import path from "node:path";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";

const job = {
  jobId: "job-001",
  requiredSkills: ["Python", "AWS", "Docker", "Kubernetes", "Terraform"],
};
const dataPath = (file: string) => path.resolve(process.cwd(), "../data", file);

describe("API", () => {
  it("retorna informações na raiz", async () => {
    const response = await request(createApp()).get("/");
    expect(response.status).toBe(200);
    expect(response.body.name).toBe("CV Match API");
    expect(response.body.endpoints).toHaveLength(3);
  });

  it("valida cada entrada inválida do POST", async () => {
    const cases: unknown[] = [
      {},
      { cv: 1, job },
      { cv: "", job },
      { cv: "ok" },
      { cv: "ok", job: {} },
      { cv: "ok", job: { jobId: "", requiredSkills: ["Python"] } },
      { cv: "ok", job: { jobId: "j", requiredSkills: [] } },
      { cv: "ok", job: { jobId: "j", requiredSkills: "Python" } },
      { cv: "ok", job: { jobId: "j", requiredSkills: ["Python", 1] } },
    ];
    for (const body of cases) {
      const response = await request(createApp())
        .post("/api/match")
        .send(body as object);
      expect(response.status).toBe(400);
      expect(response.body).toEqual(
        expect.objectContaining({ error: expect.any(String) }),
      );
    }
  });

  it("retorna 400 para JSON inválido", async () => {
    const response = await request(createApp())
      .post("/api/match")
      .set("Content-Type", "application/json")
      .send('{"cv":');
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "JSON inválido." });
  });

  it("cria e recupera o mesmo relatório", async () => {
    const app = createApp();
    const created = await request(app)
      .post("/api/match")
      .send({ cv: "Python e AWS", job });
    expect(created.status).toBe(201);
    const report = await request(app).get(
      `/api/match/report/${created.body.matchId}`,
    );
    expect(report.status).toBe(200);
    expect(report.body).toEqual(created.body);
  });

  it("retorna 404 para relatório inexistente", async () => {
    const response = await request(createApp()).get(
      "/api/match/report/nao-existe",
    );
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Análise não encontrada." });
  });

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
  ])("faz match com o CV real %s", async (file, score, matched, missing) => {
    const cv = await fs.readFile(dataPath(file), "utf8");
    const response = await request(createApp())
      .post("/api/match")
      .send({ cv, job });
    expect(response.status).toBe(201);
    expect(response.body.overallScore).toBe(score);
    expect(response.body.matchedSkills).toEqual(matched);
    expect(response.body.missingSkills).toEqual(missing);
  });
});
