import { useState } from "react";
import { ResultDashboard } from "./components/ResultDashboard";
import { UploadForm } from "./components/UploadForm";
import type { MatchResult } from "./types";

export default function App() {
  const [result, setResult] = useState<MatchResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto min-h-screen max-w-5xl px-4 py-8 sm:px-6 lg:py-12">
        <header className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-bold uppercase tracking-widest text-blue-800">
            CV Match
          </div>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            Encontre a melhor combinação
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
            Envie um currículo, informe os requisitos da vaga e receba uma
            análise objetiva de compatibilidade.
          </p>
        </header>
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/60 sm:p-8">
          <div aria-live="polite">
            {error && (
              <div
                className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800"
                role="alert"
              >
                {error}
              </div>
            )}
          </div>
          {result ? (
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
                <h2 className="text-xl font-black text-slate-950">
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
        <footer className="mt-6 text-center text-xs text-slate-500">
          Motor determinístico de matching · dados não persistidos no navegador
        </footer>
      </div>
    </main>
  );
}
