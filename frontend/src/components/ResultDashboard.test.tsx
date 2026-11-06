import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ResultDashboard } from "./ResultDashboard";

const result = {
  matchId: "m1",
  candidateId: "c1",
  jobId: "job-001",
  overallScore: 40,
  matchedSkills: ["AWS", "Docker"],
  missingSkills: ["Python"],
  insights: "Aderência baixa.",
};

describe("ResultDashboard", () => {
  it("renderiza score, skills, insights e oculta perguntas ausentes", () => {
    render(<ResultDashboard result={result} onNewAnalysis={vi.fn()} />);
    expect(screen.getByText("40", { exact: true })).toBeInTheDocument();
    expect(screen.getByText("AWS")).toBeInTheDocument();
    expect(screen.getByText("Python")).toBeInTheDocument();
    expect(screen.getByText("Aderência baixa.")).toBeInTheDocument();
    expect(screen.queryByText("Perguntas sugeridas")).not.toBeInTheDocument();
  });

  it("exibe o estado amigável quando não há skills faltantes", () => {
    render(
      <ResultDashboard
        result={{ ...result, missingSkills: [] }}
        onNewAnalysis={vi.fn()}
      />,
    );
    expect(screen.getByText("Nenhuma skill faltante")).toBeInTheDocument();
  });
});
