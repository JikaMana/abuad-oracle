import type { OracleQuestion } from "./types";

function sameNumber(left: string, right: string) {
  const a = Number(left);
  const b = Number(right);
  return Number.isFinite(a) && Number.isFinite(b) && a === b;
}

function optionForNumber(options: string[], number: string) {
  const hits: number[] = [];
  options.forEach((option, index) => {
    const values = option.match(/\d+(?:\.\d+)?/g) || [];
    if (values.some((value) => sameNumber(value, number))) hits.push(index);
  });
  return hits.length === 1 ? hits[0] : -1;
}

function optionForClaim(options: string[], claim: string) {
  const number = claim.split("=").pop()?.match(/\d+(?:\.\d+)?/)?.[0];
  if (number) return optionForNumber(options, number);
  const text = claim.toLowerCase().replace(/\s+/g, " ").trim();
  const hits: number[] = [];
  options.forEach((option, index) => {
    const value = option.toLowerCase().replace(/\s+/g, " ").trim();
    if (!value) return;
    if (text === value || text.startsWith(value)) {
      const next = text.charAt(value.length);
      const digit = /\d/.test(value.slice(-1));
      if (!(digit && /[\d.]/.test(next))) hits.push(index);
    }
  });
  return hits.length === 1 ? hits[0] : -1;
}

/** The last "correct answer is …" sentence decides which option is marked. */
export function lockAnswerToExplanation(question: OracleQuestion): OracleQuestion {
  if (!Array.isArray(question.options) || question.options.length !== 4) return question;
  const text = Array.isArray(question.steps) ? question.steps.join("\n") : "";
  const lead =
    /(?:the correct(?:\s+[a-z0-9/^]+){0,6}\s+is|the result is|so the answer is)\s+(?!not\b)/gi;
  const claims: string[] = [];
  for (const match of text.matchAll(lead)) {
    const rest = text.slice(match.index + match[0].length);
    const end = rest.search(/\.(?!\d)/);
    const claim = (end === -1 ? rest : rest.slice(0, end)).trim();
    if (claim) claims.push(claim);
  }
  if (!claims.length) return question;
  const index = optionForClaim(question.options, claims[claims.length - 1]);
  return index >= 0 ? { ...question, answer: index } : question;
}
