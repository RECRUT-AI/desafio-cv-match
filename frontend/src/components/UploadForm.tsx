import { useState, type ChangeEvent, type FormEvent } from "react";
import { createMatch, getReport } from "../services/api";
import type { JobInput, MatchResult } from "../types";

export const exampleJob: JobInput = {
  jobId: "job-001",
  requiredSkills: ["Python", "AWS", "Docker", "Kubernetes", "Terraform"],
};

interface UploadFormProps {
  onResult: (result: MatchResult) => void;
  onError: (message: string) => void;
  onLoadingChange: (loading: boolean) => void;
  loading: boolean;
}

interface FieldErrors {
  cv?: string;
  job?: string;
}

function validateJob(value: unknown): value is JobInput {
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

export function UploadForm({
  onResult,
  onError,
  onLoadingChange,
  loading,
}: UploadFormProps) {
  const [cv, setCv] = useState("");
  const [jobJson, setJobJson] = useState(JSON.stringify(exampleJob, null, 2));
  const [errors, setErrors] = useState<FieldErrors>({});

  async function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setCv(await file.text());
    setErrors((current) => ({ ...current, cv: undefined }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: FieldErrors = {};
    if (!cv.trim()) nextErrors.cv = "Informe ou carregue o texto do currículo.";

    let job: JobInput | undefined;
    try {
      const parsed: unknown = JSON.parse(jobJson);
      if (!validateJob(parsed))
        nextErrors.job = "Informe um JSON com jobId e requiredSkills válidos.";
      else job = parsed;
    } catch {
      nextErrors.job = "O JSON da vaga é inválido.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0 || !job) return;

    onLoadingChange(true);
    onError("");
    try {
      const created = await createMatch(cv, job);
      const report = await getReport(created.matchId);
      onResult(report);
    } catch (error) {
      onError(
        error instanceof Error
          ? error.message
          : "Não foi possível analisar o currículo.",
      );
    } finally {
      onLoadingChange(false);
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div>
        <label
          className="mb-2 block text-sm font-semibold text-slate-800"
          htmlFor="cv-file"
        >
          Arquivo do currículo
        </label>
        <input
          id="cv-file"
          type="file"
          accept=".md,.txt,text/markdown,text/plain"
          onChange={handleFile}
          className="block w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:font-semibold file:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="mt-2 text-xs text-slate-500">
          Aceitamos arquivos .md e .txt. Você também pode colar ou editar o
          conteúdo abaixo.
        </p>
      </div>

      <div>
        <label
          className="mb-2 block text-sm font-semibold text-slate-800"
          htmlFor="cv-text"
        >
          Texto do currículo
        </label>
        <textarea
          id="cv-text"
          value={cv}
          onChange={(event) => setCv(event.target.value)}
          rows={10}
          className="w-full rounded-xl border border-slate-300 bg-white p-3 text-sm text-slate-800 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          placeholder="Cole aqui o texto do currículo..."
          aria-invalid={Boolean(errors.cv)}
        />
        {errors.cv && (
          <p className="mt-2 text-sm text-red-700" role="alert">
            {errors.cv}
          </p>
        )}
      </div>

      <div>
        <label
          className="mb-2 block text-sm font-semibold text-slate-800"
          htmlFor="job-json"
        >
          Vaga em JSON
        </label>
        <textarea
          id="job-json"
          value={jobJson}
          onChange={(event) => setJobJson(event.target.value)}
          rows={10}
          className="w-full rounded-xl border border-slate-300 bg-white p-3 font-mono text-sm text-slate-800 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          aria-invalid={Boolean(errors.job)}
        />
        {errors.job && (
          <p className="mt-2 text-sm text-red-700" role="alert">
            {errors.job}
          </p>
        )}
        <p className="mt-2 text-xs text-slate-500">
          Formato provisório: jobId e requiredSkills.
        </p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Analisando..." : "Analisar compatibilidade"}
      </button>
    </form>
  );
}
