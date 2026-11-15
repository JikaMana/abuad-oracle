import test from "node:test";
import assert from "node:assert/strict";
import { COURSES } from "./courses.mjs";
import { promoActive, promoUntilDate } from "./account.mjs";
import { handleGenerate } from "./generate.mjs";
import {
  PAST_QUESTIONS,
  pickLocalQuestions,
  similarPrompt,
  alignQuestion,
  answerFromExplanation,
} from "./questions.mjs";
import { groqKeys } from "./groq.mjs";

test("promo runs through 20 November 2026 Lagos time", () => {
  delete process.env.ORACLE_FREE_UNTIL;
  assert.equal(promoUntilDate(), "2026-11-20");
  assert.equal(promoActive(Date.parse("2026-11-20T22:59:59Z")), true);
  assert.equal(promoActive(Date.parse("2026-11-20T23:00:00Z")), false);
});

test("the saved option is the one the explanation verifies", () => {
  const acceleration = answerFromExplanation({
    options: ["2 m/s^2", "4 m/s^2", "10 m/s^2", "20 m/s^2"],
    answer: 0,
    steps: [
      "Use a = (v - u)/t.",
      "Here u = 0, v = 20 m/s and t = 5 s, so a = (20 - 0)/5 = 4.",
      "The result is 4 m/s^2, which corresponds to option index 1, not 0. Wait, recalc: 20/5 = 4, so the correct answer is 4 m/s^2.",
    ],
  });
  assert.equal(acceleration.answer, 1);
  assert.equal(
    acceleration.steps.some((step) => /wait|option index/i.test(step)),
    false,
  );
  assert.match(acceleration.steps.at(-1), /4 m\/s\^2/);

  const series = answerFromExplanation({
    options: ["255", "363", "192", "768"],
    answer: 1,
    steps: [
      "The sum of the first n terms is S_n = a (r^n - 1)/(r - 1).",
      "The correct sum is 255, so the answer index should be 0.",
    ],
  });
  assert.equal(series.answer, 0);
  assert.equal(
    series.steps.some((step) => /answer index/i.test(step)),
    false,
  );

  assert.equal(
    answerFromExplanation({
      options: ["4.375 m/s", "5.00 m/s", "6.25 m/s", "8.00 m/s"],
      answer: 2,
      steps: [
        "Total distance is 350 m and total time is 80 s.",
        "The correct average speed is 350/80 = 4.375 m/s. Choose option 5.00 m/s.",
      ],
    }),
    null,
  );

  const clean = answerFromExplanation({
    options: ["2 m/s^2", "4 m/s^2", "10 m/s^2", "20 m/s^2"],
    answer: 0,
    steps: [
      "Use a = (v - u)/t, where u is the initial speed and v is the final speed.",
      "Substitute u = 0, v = 20 m/s and t = 5 s to get a = (20 - 0)/5 = 4 m/s^2.",
      "The correct answer is 4 m/s^2.",
    ],
  });
  assert.equal(clean.answer, 1);

  assert.equal(
    answerFromExplanation({
      options: ["2 m/s^2", "4 m/s^2", "6 m/s^2", "8 m/s^2"],
      answer: 1,
      steps: ["The correct answer is 9 m/s^2."],
    }),
    null,
  );

  const mean = answerFromExplanation({
    options: ["7.8", "8.4", "8", "9"],
    answer: 2,
    steps: [
      "Add the numbers: 5+7+8+10+12 = 42. Divide by the number of observations 5 to get 42/5 = 8.4.",
      "The correct answer is 8.4.",
    ],
  });
  assert.equal(mean.answer, 1);
  assert.match(mean.steps.at(-1), /8\.4/);

  const published = alignQuestion({
    options: ["7.8", "8.4", "8", "9"],
    answer: 2,
    steps: [
      "Add the numbers: 5+7+8+10+12 = 42. Divide by the number of observations 5 to get 42/5 = 8.4.",
      "The correct answer is 8.4.",
    ],
  });
  assert.equal(published.answer, 1);
  assert.equal(published.options[published.answer], "8.4");
  assert.equal(
    alignQuestion({
      options: ["7.8", "8.4", "8", "9"],
      answer: 2,
      steps: ["The correct answer is 6.5."],
    }),
    null,
  );
});

test("similar prompts are caught and fresh stems are kept", () => {
  assert.equal(
    similarPrompt(
      "If z1 = 7 + 3i and z2 = 4 - 2i, what is z1 + z2?",
      "If z1 = 2 + 5i and z2 = 1 - 4i, what is z1 + z2?",
    ),
    true,
  );
  assert.equal(
    similarPrompt(
      "Five consecutive integers add up to 100. The smallest is",
      "The roots of x squared minus 4x minus 6 are",
    ),
    false,
  );
});

test("every topic can fill a 3-question batch with labels and unique options", () => {
  for (const [course, cfg] of Object.entries(COURSES)) {
    for (const topic of cfg.topics) {
      const questions = pickLocalQuestions({
        course,
        topics: [topic],
        count: 3,
        avoid: [],
        batch: 1,
        salt: `coverage-${course}-${topic}`,
      });
      assert.equal(questions.length, 3, `${course} / ${topic}`);
      for (const question of questions) {
        assert.equal(question.options.length, 4);
        assert.equal(new Set(question.options).size, 4, question.prompt);
        assert.ok(question.answer >= 0 && question.answer <= 3);
        assert.ok(question.steps.length >= 1);
        assert.equal(question.topic, topic);
        assert.ok(question.origin === "pq" || question.origin === "oracle");
      }
    }
  }
});

test("MTH 101 mixes one PQ with fresh oracle questions", () => {
  const questions = pickLocalQuestions({
    course: "MTH 101",
    topics: ["Complex numbers", "Sequences and series", "Sets"],
    count: 3,
    avoid: [],
    batch: 0,
    salt: "mix",
  });
  assert.equal(questions.filter((question) => question.origin === "pq").length, 1);
  const again = pickLocalQuestions({
    course: "MTH 101",
    topics: ["Complex numbers", "Sequences and series", "Sets"],
    count: 3,
    avoid: questions.map((question) => question.prompt),
    batch: 2,
    salt: "mix-2",
  });
  assert.equal(again.length, 3);
  for (const question of again) {
    assert.equal(
      questions.some((seen) => similarPrompt(seen.prompt, question.prompt)),
      false,
    );
  }
});

test("known MTH 101 past-question arithmetic", () => {
  const byId = Object.fromEntries(PAST_QUESTIONS["MTH 101"].map((item) => [item.id, item]));
  /** @param {string} id */
  const answer = (id) => byId[id].options[byId[id].answer];
  assert.equal(answer("mth101-z-sum"), "11 + i");
  assert.equal(answer("mth101-z-product"), "34 − 2i");
  assert.equal(answer("mth101-quad-roots"), "2 ± √10");
  assert.equal(answer("mth101-cube-roots"), "x³ = −1");
  assert.equal(answer("mth101-gp"), "3990");
  assert.equal(answer("mth101-consecutive"), "18");
  assert.equal(answer("mth101-evens"), "247050");
  assert.equal(answer("mth101-sets"), "{1, 2, 5, 6}");
});

function clearGroqEnv() {
  delete process.env.GROQ_API_KEY;
  delete process.env.GROQ_API_KEYS;
  delete process.env.GROQ_MODEL;
  for (const name of Object.keys(process.env)) {
    if (/^GROQ_API_KEY_\d+$/.test(name)) delete process.env[name];
  }
}

test("groq collects numbered keys past 10", () => {
  clearGroqEnv();
  for (let slot = 1; slot <= 12; slot++) {
    const name = slot === 1 ? "GROQ_API_KEY" : `GROQ_API_KEY_${slot}`;
    process.env[name] = `gsk_test_${slot}`;
  }
  process.env.GROQ_API_KEYS = "gsk_test_1,gsk_extra";
  assert.deepEqual(groqKeys(), [
    ...Array.from({ length: 12 }, (_, index) => `gsk_test_${index + 1}`),
    "gsk_extra",
  ]);
  clearGroqEnv();
  assert.deepEqual(groqKeys(), []);
});

test("generate falls back without a Groq key", async () => {
  clearGroqEnv();
  delete process.env.DEEPSEEK_API_KEY;
  delete process.env.FIREBASE_SERVICE_ACCOUNT;
  const request = new Request("http://127.0.0.1:8080/.netlify/functions/generate-questions", {
    method: "POST",
    headers: {
      origin: "http://127.0.0.1:8080",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      course: "MTH 101",
      topics: ["Complex numbers", "Quadratic equations"],
      count: 3,
      batch: 0,
      avoid: [],
    }),
  });
  const response = await handleGenerate(request, {
    uid: "local_testuser1",
    local: true,
    email: null,
    getIdToken: async () => "local:testuser1",
  });
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.fallback, true);
  assert.equal(body.questions.length, 3);
  assert.equal(body.paid, true);
  for (const question of body.questions) {
    assert.ok(question.source === "PQ" || question.source === "Oracle Question");
    assert.equal(question.options[question.answer] !== undefined, true);
  }
});
