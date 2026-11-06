import { skillAliases } from "./aliases.js";

export function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function appearsAsTerm(cv: string, term: string): boolean {
  const normalizedTerm = normalizeText(term);
  if (!normalizedTerm) return false;

  // limites alfanuméricos funcionam para termos com pontuação (C++, .NET, Node.js)
  // e impedem matches parciais como Go/Google e Java/JavaScript.
  const pattern = new RegExp(
    `(?<![\\p{L}\\p{N}])${escapeRegExp(normalizedTerm)}(?![\\p{L}\\p{N}])`,
    "iu",
  );
  return pattern.test(cv);
}

function variantsFor(skill: string): string[] {
  const normalized = normalizeText(skill);
  return [normalized, ...(skillAliases[normalized] ?? [])];
}

export function deduplicateSkills(skills: string[]): string[] {
  const seen = new Set<string>();
  return skills.filter((skill) => {
    const key = normalizeText(skill);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function detectSkills(
  cv: string,
  requiredSkills: string[],
): { matchedSkills: string[]; missingSkills: string[] } {
  const normalizedCv = normalizeText(cv);
  const uniqueSkills = deduplicateSkills(requiredSkills);
  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  for (const skill of uniqueSkills) {
    if (
      variantsFor(skill).some((variant) => appearsAsTerm(normalizedCv, variant))
    )
      matchedSkills.push(skill);
    else missingSkills.push(skill);
  }
  return { matchedSkills, missingSkills };
}

export function calculateScore(
  matchedCount: number,
  requiredCount: number,
): number {
  if (requiredCount === 0) return 0;
  return Math.round((matchedCount / requiredCount) * 100);
}

export function createInsights(
  score: number,
  matched: string[],
  missing: string[],
): string {
  const faixa =
    score >= 80
      ? "aderência forte"
      : score >= 50
        ? "aderência parcial"
        : "aderência baixa";
  const faltantes =
    missing.length > 0
      ? ` Skills faltantes: ${missing.join(", ")}.`
      : " Não há skills faltantes.";
  return `O currículo apresenta ${faixa}, com ${matched.length} de ${matched.length + missing.length} skills exigidas encontradas.${faltantes}`;
}

export function createSuggestedQuestions(
  matched: string[],
  missing: string[],
): string[] {
  const questions = missing
    .slice(0, 3)
    .map(
      (skill) =>
        `O currículo não menciona ${skill}. Qual sua experiência ou familiaridade com ${skill}?`,
    );
  questions.push(
    ...matched
      .slice(0, 2)
      .map(
        (skill) => `Conte um exemplo prático de uso de ${skill} em um projeto.`,
      ),
  );
  return questions.slice(0, 5);
}
