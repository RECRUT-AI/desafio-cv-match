import { useState, type ChangeEvent, type FormEvent } from "react";
import { createMatch, getReport } from "../services/api";
import type { JobInput, MatchResult } from "../types";
import { FileIcon, UploadIcon } from "./Icons";

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
  const [fileName, setFileName] = useState("");

  async function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setCv(await file.text());
    setFileName(file.name);
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
    <form className="space-y-7" onSubmit={handleSubmit}>
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-indigo-100 text-sm font-bold text-indigo-700">
              1
            </span>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Currículo</h3>
              <p className="text-xs text-slate-500">
                Carregue ou cole o conteúdo
              </p>
            </div>
          </div>
          <div>
            <label
              htmlFor="cv-file"
              className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-indigo-200 bg-white px-5 py-6 text-center hover:border-indigo-500 hover:bg-indigo-50 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2"
            >
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-indigo-50 text-indigo-600">
                <UploadIcon className="h-5 w-5" />
              </span>
              <span className="mt-3 text-sm font-bold text-slate-800">
                Selecione um arquivo .md ou .txt
              </span>
              <span className="mt-1 text-xs text-slate-500">
                ou arraste para esta área
              </span>
              <input
                id="cv-file"
                type="file"
                accept=".md,.txt,text/markdown,text/plain"
                onChange={handleFile}
                className="sr-only"
              />
            </label>
            {fileName && (
              <div className="mt-3 inline-flex max-w-full items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-800">
                <FileIcon className="h-4 w-4 shrink-0" />
                <span className="break-all">{fileName}</span>
              </div>
            )}
            <p className="mt-2 text-xs text-slate-500">
              Aceitamos arquivos .md e .txt. Você também pode colar ou editar o
              conteúdo abaixo.
            </p>
          </div>
          <div>
            <label
              className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-slate-500"
              htmlFor="cv-text"
            >
              Texto do currículo
            </label>
            <textarea
              id="cv-text"
              value={cv}
              onChange={(event) => setCv(event.target.value)}
              rows={8}
              className="min-h-64 w-full resize-y rounded-xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-800 outline-none placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-indigo-500"
              placeholder="Cole aqui o texto do currículo..."
              aria-invalid={Boolean(errors.cv)}
            />
            {errors.cv && (
              <p className="mt-2 text-sm text-red-700" role="alert">
                {errors.cv}
              </p>
            )}
          </div>
        </section>
        <section className="space-y-4 rounded-2xl border border-slate-200 bg-slate-900 p-4 sm:p-5">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-slate-800 text-sm font-bold text-indigo-100">
              2
            </span>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-white">Vaga</h3>
              <p className="text-xs text-slate-400">
                Defina os requisitos da posição
              </p>
            </div>
            <span className="ml-auto shrink-0 rounded-md border border-slate-700 bg-slate-800 px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400">
              JSON
            </span>
          </div>
          <div>
            <label className="sr-only" htmlFor="job-json">
              Vaga em JSON
            </label>
            <textarea
              id="job-json"
              value={jobJson}
              onChange={(event) => setJobJson(event.target.value)}
              rows={8}
              className="min-h-64 w-full resize-y rounded-xl border border-slate-700 bg-slate-950 p-4 font-mono text-[13px] leading-6 text-slate-100 outline-none placeholder:text-slate-600 focus-visible:ring-2 focus-visible:ring-indigo-500"
              aria-invalid={Boolean(errors.job)}
            />
            {errors.job && (
              <p className="mt-2 text-sm text-rose-300" role="alert">
                {errors.job}
              </p>
            )}
            <p className="mt-2 text-xs text-slate-400">
              Formato provisório: jobId e requiredSkills.
            </p>
          </div>
        </section>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-bold text-white hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 sm:w-auto sm:min-w-56 sm:self-end"
      >
        {loading ? "Analisando..." : "Analisar compatibilidade"}
      </button>
    </form>
  );
}
