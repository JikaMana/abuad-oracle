// @ts-nocheck
import OpenAI from "openai";

const RESPONSE_HINT = `Return JSON only, with this shape:
{"questions":[{"topic":"","prompt":"","options":["","","",""],"answer":0,"correct":"","steps":["",""]}]}`;

export function groqModel() {
  return (
    (process.env.GROQ_MODEL || "openai/gpt-oss-20b").split(",")[0].trim() || "openai/gpt-oss-20b"
  );
}

export function groqKeys() {
  const slots = new Map();
  for (const [name, raw] of Object.entries(process.env)) {
    if (name === "GROQ_API_KEY") slots.set(1, raw);
    const match = /^GROQ_API_KEY_(\d+)$/.exec(name);
    if (match) slots.set(Number(match[1]), raw);
  }
  const numbered = [...slots.keys()]
    .sort((a, b) => a - b)
    .map((slot) => String(slots.get(slot) || "").trim())
    .filter(Boolean);
  const listed = String(process.env.GROQ_API_KEYS || "")
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
  return [...new Set([...numbered, ...listed])];
}

export function groqConfigured() {
  return groqKeys().length > 0;
}

export function buildPrompt({ course, cfg, topics, count, avoid, batch }) {
  const avoidBlock = avoid.length
    ? `\nDo NOT repeat or closely paraphrase these questions already asked:\n${avoid
        .map((item) => `- ${item}`)
        .join("\n")}\n`
    : "";
  return `You write practice questions for ABUAD (Afe Babalola University) ${course} (${cfg.name}), in the style of Nigerian university computer-based tests (CBT).

Write exactly ${count} multiple-choice questions on these topics only: ${topics.join("; ")}.
Rules:
- Exactly 4 options. One of them must be the result you are about to calculate. The other three are typical mistakes.
- Match the difficulty of ABUAD 100-level CBT papers: short stems, one idea each, a mix of recall and short working.
- This is set #${batch + 1}. Use fresh numbers and situations. Do not reuse a stem with only a number changed if the method is identical to an avoided question.
- Do not choose "answer" first. Solve the question in "steps", then copy the option that matches the result.
- End "steps" with one sentence in this exact form: The correct answer is <option text>.
- That final sentence is what gets saved. If it names an option, that option is marked correct even when "answer" is wrong.
- If the steps name two different results, the question is thrown away. Finish the arithmetic before you write the final sentence.
- "steps" is shown to the student word for word. Never write "wait", "recalculate", "actually", "correction", "option index", "none match", or "most plausible".
- Plain text only. No LaTeX, no markdown, no $ signs. Write maths as x^2, sqrt(x), a/b, 3 + 4i.
- A one-fact recall question needs 2 or 3 full sentences, then the final answer sentence.
- A calculation, derivation, or law question needs the formula, the substitution, the result with units, why the most tempting wrong option fails, then the final answer sentence.
- Each step is one or two complete sentences.
- "answer" must still be the index of the option named in the final sentence. "correct" must be that option copied exactly.
- "topic" must be copied exactly from the topic list above.
${avoidBlock}
SOURCE MATERIAL:
${cfg.source}

${RESPONSE_HINT}`;
}

function parseModelJson(text) {
  const cleaned = String(text || "")
    .replace(/^\s*```(?:json)?/i, "")
    .replace(/```\s*$/i, "")
    .trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end <= start) throw new Error("No JSON object");
  return JSON.parse(cleaned.slice(start, end + 1));
}

function groqClient(apiKey) {
  return new OpenAI({
    apiKey,
    baseURL: "https://api.groq.com/openai/v1",
    timeout: 20000,
    maxRetries: 0,
  });
}

function failure(error) {
  return {
    status: error?.status || error?.statusCode || 502,
    message: error?.error?.message || error?.message || "Groq request failed",
  };
}

let nextKey = 0;

export async function callGroq(prompt) {
  const keys = groqKeys();
  const model = groqModel();
  if (!keys.length) return { error: { status: 503, message: "No Groq API key" } };

  const start = nextKey % keys.length;
  let last = { status: 502, message: "Groq did not respond" };

  for (let offset = 0; offset < keys.length; offset++) {
    const apiKey = keys[(start + offset) % keys.length];
    const client = groqClient(apiKey);
    const attempts = [{ reasoning_effort: "low" }, {}];
    let tryNextKey = false;

    for (const extras of attempts) {
      try {
        // Chat completions, not responses.create: Groq's JSON mode lives here,
        // which is what the question parser needs.
        const response = await client.chat.completions.create({
          model,
          messages: [
            {
              role: "system",
              content:
                "You are Exam Oracle, writing verified ABUAD CBT practice questions. Reply with one JSON object and nothing else.",
            },
            { role: "user", content: prompt },
          ],
          response_format: { type: "json_object" },
          temperature: 0.4,
          max_completion_tokens: 4000,
          ...extras,
        });
        const text = response.choices?.[0]?.message?.content || "";
        if (!text.trim()) {
          last = { status: 502, message: "Empty response" };
          tryNextKey = true;
          break;
        }
        nextKey = (start + offset + 1) % keys.length;
        return { parsed: parseModelJson(text), model };
      } catch (error) {
        last = failure(error);
        console.error("Groq error", {
          model,
          status: last.status,
          message: String(last.message).slice(0, 400),
        });
        if (last.status === 400 && extras.reasoning_effort) continue;
        if (last.status === 400) return { error: last };
        tryNextKey = true;
        break;
      }
    }

    if (tryNextKey) continue;
  }

  return { error: last };
}
