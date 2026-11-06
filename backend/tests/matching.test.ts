import { describe, expect, it } from "vitest";
import {
  calculateScore,
  createInsights,
  createSuggestedQuestions,
  detectSkills,
  normalizeText,
} from "../src/services/matching.js";

describe("matching", () => {
  it("normaliza caixa, acentos e espaços", () => {
    expect(normalizeText("  Árvore   DE  Açúcar ")).toBe("arvore de acucar");
  });

  it("respeita limites e pontuação especial", () => {
    const result = detectSkills("Google, JavaScript, C++ e .NET", [
      "Go",
      "Java",
      "C++",
      ".NET",
    ]);
    expect(result.matchedSkills).toEqual(["C++", ".NET"]);
    expect(result.missingSkills).toEqual(["Go", "Java"]);
  });

  it("aplica aliases sem alterar a resposta", () => {
    expect(
      detectSkills("NodeJS, postgres, k8s e JS", [
        "Node.js",
        "PostgreSQL",
        "Kubernetes",
        "JavaScript",
      ]).matchedSkills,
    ).toEqual(["Node.js", "PostgreSQL", "Kubernetes", "JavaScript"]);
  });

  it("deduplica e arredonda o score", () => {
    expect(
      detectSkills("python", ["Python", "PYTHON", "AWS"]).matchedSkills,
    ).toEqual(["Python"]);
    expect(calculateScore(2, 3)).toBe(67);
  });

  it("gera faixas de insight e limita perguntas", () => {
    expect(createInsights(80, ["A", "B"], ["C"])).toContain("aderência forte");
    expect(createInsights(50, ["A"], ["B"])).toContain("aderência parcial");
    expect(createInsights(49, [], ["A"])).toContain("aderência baixa");
    expect(
      createSuggestedQuestions(["A", "B", "C"], ["D", "E", "F", "G"]),
    ).toHaveLength(5);
    expect(createSuggestedQuestions([], [])).toEqual([]);
  });
});
