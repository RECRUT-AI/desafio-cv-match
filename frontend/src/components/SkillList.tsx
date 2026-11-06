import { AlertIcon, CheckIcon } from "./Icons";

interface SkillListProps {
  title: string;
  skills: string[];
  tone: "matched" | "missing";
}

export function SkillList({ title, skills, tone }: SkillListProps) {
  const matched = tone === "matched";
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span
            className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl ${matched ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}
          >
            {matched ? <CheckIcon /> : <AlertIcon className="h-4 w-4" />}
          </span>
          <h3 className="break-words text-sm font-bold text-slate-900">
            {title}
          </h3>
        </div>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold tabular-nums text-slate-600">
          {skills.length}
        </span>
      </div>
      {skills.length === 0 ? (
        <p className="mt-5 flex items-center gap-2 text-sm text-slate-500">
          <CheckIcon className="h-4 w-4 text-emerald-600" />
          Nenhuma skill faltante
        </p>
      ) : (
        <ul className="mt-5 flex flex-wrap gap-2">
          {skills.map((skill) => (
            <li
              key={skill}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-semibold ${matched ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-rose-200 bg-rose-50 text-rose-800"}`}
            >
              <span>
                {matched ? (
                  <CheckIcon className="h-3.5 w-3.5" />
                ) : (
                  <AlertIcon className="h-3.5 w-3.5" />
                )}
              </span>
              {skill}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
