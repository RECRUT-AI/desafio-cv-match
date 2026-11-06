import { afterEach, describe, expect, it, vi } from "vitest";
import { ApiError, createMatch } from "./api";

afterEach(() => vi.restoreAllMocks());

describe("api", () => {
  it("envia o match e retorna o resultado", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(
          new Response(JSON.stringify({ matchId: "m1" }), { status: 201 }),
        ),
    );
    await expect(
      createMatch("Python", { jobId: "job-001", requiredSkills: ["Python"] }),
    ).resolves.toEqual({ matchId: "m1" });
    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:3001/api/match",
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("propaga a mensagem de erro da API", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(
          new Response(JSON.stringify({ error: "Análise não encontrada." }), {
            status: 404,
          }),
        ),
    );
    await expect(
      createMatch("Python", { jobId: "j", requiredSkills: ["Python"] }),
    ).rejects.toEqual(
      expect.objectContaining({
        message: "Análise não encontrada.",
        status: 404,
      } satisfies Partial<ApiError>),
    );
  });

  it("informa falha de conexão", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("network")));
    await expect(
      createMatch("Python", { jobId: "j", requiredSkills: ["Python"] }),
    ).rejects.toThrow("Não foi possível conectar à API");
  });
});
