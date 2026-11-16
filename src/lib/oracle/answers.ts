import type { OracleQuestion } from "./types";

function normalizeAnswer(value: string) {
  return value
    .toLowerCase()
    .replace(/√/g, "sqrt")
    .replace(/sqrt\(([^)]+)\)/g, "sqrt$1")
    .replace(/±/g, "+-")
    .replace(/×/g, "*")
    .replace(/[−–]/g, "-")
    .replace(/\s+/g, "");
}

function bareNumber(value: string) {
  let text = value.trim();
  if (/[±√]|sqrt|\+\/-/.test(text)) return null;
  text = text.replace(/\s*[a-z][a-z0-9/.^]*$/i, "");
  if (!/^-?\d+(?:\.\d+)?$/.test(text)) return null;
  const number = Number(text);
  return Number.isFinite(number) ? number : null;
}

function sameAnswer(left: string, right: string) {
  const a = normalizeAnswer(left);
  const b = normalizeAnswer(right);
  if (!a || !b) return false;
  if (a === b) return true;
  const leftNumber = bareNumber(left);
  const rightNumber = bareNumber(right);
  return leftNumber != null && rightNumber != null && leftNumber === rightNumber;
}

function looksLikeAnswer(value: string) {
  const text = value.trim();
  if (!text || text.length > 48) return false;
  if (/^(the|a|an|not|because|when|this|that|which|where)\b/i.test(text)) return false;
  return /\d|√|sqrt|±/.test(text);
}

/** The last result the explanation actually reaches decides the marked option. */
export function lockAnswerToExplanation(question: OracleQuestion): OracleQuestion {
  if (!Array.isArray(question.options) || question.options.length !== 4) return question;
  const steps = Array.isArray(question.steps) ? question.steps.map((step) => String(step)) : [];
  const text = steps.join("\n");
  const body = text.replace(
    /(?:the correct(?:\s+[a-z0-9/^]+){0,6}\s+is|the result is|so the answer is|choose option)\s+(?!not\b)(?![^.]*?=)[^.]*(?:\.|$)/gi,
    " ",
  );
  const found: string[] = [];
  const pattern =
    /=\s*((?:(?!\.\s|\.$)[^\n]){1,80})|\b(?:is|equals)\s+((?:(?!\.\s|\.$)[^\n]){1,40})/gi;
  for (const match of body.matchAll(pattern)) {
    const raw = match[1] || match[2] || "";
    const rhs =
      raw
        .split("=")
        .pop()
        ?.trim()
        .replace(/[,;].*$/, "")
        .trim() || "";
    if (looksLikeAnswer(rhs)) found.push(rhs);
  }
  const lead =
    /(?:the correct(?:\s+[a-z0-9/^]+){0,6}\s+is|the result is|so the answer is)\s+(?!not\b)/gi;
  const claims: string[] = [];
  for (const match of text.matchAll(lead)) {
    const rest = text.slice((match.index ?? 0) + match[0].length);
    const end = rest.search(/\.(?!\d)/);
    const claim = (end === -1 ? rest : rest.slice(0, end)).trim();
    if (claim) claims.push(claim);
  }
  const result = found[found.length - 1] || claims[claims.length - 1];
  if (!result) return question;
  let options = question.options.slice();
  let answer = options.findIndex((option) => sameAnswer(option, result));
  if (answer < 0) {
    const slot = question.answer >= 0 && question.answer < options.length ? question.answer : 0;
    options = options.slice();
    options[slot] = result.trim();
    answer = slot;
  }
  const marked = options[answer];
  const cleaned = steps
    .map((step) =>
      step
        .split(/(?<=[.?!])\s+/)
        .filter((sentence) => {
          const hit = sentence.match(
            /(?:the correct(?:\s+[a-z0-9/^]+){0,6}\s+is|the result is|so the answer is)\s+(?!not\b)([^.]+)/i,
          );
          return !hit || sameAnswer(hit[1], marked);
        })
        .join(" ")
        .trim(),
    )
    .filter(Boolean);
  return { ...question, options, answer, steps: cleaned.length ? cleaned : steps };
}
