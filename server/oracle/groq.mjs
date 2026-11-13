// @ts-nocheck
import Groq from "groq-sdk";

const RESPONSE_HINT = `Return JSON only, with this shape:
{"questions":[{"topic":"","prompt":"","options":["","","",""],"answer":0,"steps":["",""]}]}`;

const KEY_SLOTS = 10;

export function groqModel() {
  return (
    (process.env.GROQ_MODEL || "openai/gpt-oss-120b").split(",")[0].trim() || "openai/gpt-oss-120b"
  );
}

export function groqKeys() {
  const numbered = [];
  for (let slot = 1; slot <= KEY_SLOTS; slot++) {
    const name = slot === 1 ? "GROQ_API_KEY" : `GROQ_API_KEY_${slot}`;
    const value = String(process.env[name] || "").trim();
    if (value) numbered.push(value);
  }
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
- Exactly 4 options. Exactly one is correct. "answer" is the zero-based index (0 to 3) of the correct option.
- Wrong options must be plausible (typical student mistakes), never silly.
- Match the difficulty of ABUAD 100-level CBT papers: short stems, one idea each, a mix of recall and short working.
- This is set #${batch + 1}. Use fresh numbers and situations. Do not reuse a stem with only a number changed if the method is identical to an avoided question.
- Solve every question yourself and verify the answer before returning it.
- Plain text only. No LaTeX, no markdown, no $ signs. Write maths as x^2, sqrt(x), a/b, 3 + 4i.
- "steps": 2 to 4 short strings showing the working.
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
  return new Groq({ apiKey });
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
          temperature: 0.7,
          max_completion_tokens: 2500,
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
