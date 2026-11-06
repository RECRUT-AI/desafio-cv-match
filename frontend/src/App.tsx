import { useState } from "react";
import { ResultDashboard } from "./components/ResultDashboard";
import { AlertIcon, SparkIcon } from "./components/Icons";
import { LoadingSkeleton } from "./components/LoadingSkeleton";
import { UploadForm } from "./components/UploadForm";
import type { MatchResult } from "./types";

export default function App() {
  const [result, setResult] = useState<MatchResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-6xl px-4 py-7 sm:px-6 sm:py-10 lg:px-8">
        <header className="mb-7 flex items-start justify-between gap-5 sm:mb-9">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-indigo-700 shadow-sm">
              <span className="grid h-5 w-5 place-items-center rounded-md bg-indigo-600 text-white">
                <SparkIcon className="h-3.5 w-3.5" />
              </span>
              CV Match
            </div>
            <h1 className="mt-5 max-w-2xl text-3xl font-bold tracking-[-0.03em] text-slate-900 sm:text-4xl">
              Encontre a melhor combinação
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              Transforme currículos em decisões de contratação mais objetivas.
            </p>
          </div>
        </header>
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8 lg:p-10">
          <div aria-live="polite">
            {error && (
              <div
                className="mb-6 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800"
                role="alert"
              >
                <AlertIcon className="mt-0.5 h-5 w-5 shrink-0 text-rose-700" />
                {error}
              </div>
            )}
          </div>
          {loading ? (
            <LoadingSkeleton />
          ) : result ? (
            <ResultDashboard
              result={result}
              onNewAnalysis={() => {
                setResult(null);
                setError("");
              }}
            />
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-bold tracking-tight text-slate-900">
                  Nova análise
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Preencha os dois campos para iniciar.
                </p>
              </div>
              <UploadForm
                loading={loading}
                onResult={setResult}
                onError={setError}
                onLoadingChange={setLoading}
              />
              <div
                aria-live="polite"
                className="mt-3 min-h-5 text-center text-sm text-slate-500"
              >
                {loading ? "Analisando compatibilidade..." : ""}
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
