interface SkillListProps {
  title: string;
  skills: string[];
  tone: "matched" | "missing";
}

export function SkillList({ title, skills, tone }: SkillListProps) {
  const colors =
    tone === "matched"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : "border-amber-200 bg-amber-50 text-amber-900";
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-base font-bold text-slate-900">{title}</h3>
      {skills.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">Nenhuma skill faltante</p>
      ) : (
        <ul className="mt-4 flex flex-wrap gap-2">
          {skills.map((skill) => (
            <li
              key={skill}
              className={`rounded-full border px-3 py-1 text-sm font-semibold ${colors}`}
            >
              {skill}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
