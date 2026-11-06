import type { JobInput, MatchRequest, MatchResult } from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

interface ErrorPayload {
  error?: unknown;
}

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function isErrorPayload(value: unknown): value is ErrorPayload {
  return typeof value === "object" && value !== null && "error" in value;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, init);
  } catch {
    throw new ApiError(
      "Não foi possível conectar à API. Verifique se o backend está em execução.",
      0,
    );
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new ApiError(
      "A API retornou uma resposta inválida.",
      response.status,
    );
  }
  if (!response.ok) {
    const message =
      isErrorPayload(payload) && typeof payload.error === "string"
        ? payload.error
        : "Não foi possível concluir a solicitação.";
    throw new ApiError(message, response.status);
  }
  return payload as T;
}

export function createMatch(cv: string, job: JobInput): Promise<MatchResult> {
  const body: MatchRequest = { cv, job };
  return request<MatchResult>("/api/match", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export function getReport(matchId: string): Promise<MatchResult> {
  return request<MatchResult>(
    `/api/match/report/${encodeURIComponent(matchId)}`,
  );
}
