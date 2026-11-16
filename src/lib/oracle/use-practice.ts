import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  fetchConfig,
  fetchHistory,
  fetchLeaderboard,
  fetchQuestions,
  postActivity,
  saveHistory,
} from "./api";
import { lockAnswerToExplanation } from "./answers";
import { useOracleAuth } from "./auth";
import {
  CHUNK,
  type OracleConfig,
  type OracleQuestion,
  type PrizeView,
  type SavedTest,
} from "./types";

export type Graded = { question: OracleQuestion; selected: number; correct: boolean };

const SEEN_KEY = "oracle-seen-prompts";
const HISTORY_TTL = 2 * 60 * 1000;

function readSeen() {
  try {
    return JSON.parse(localStorage.getItem(SEEN_KEY) || "[]") as string[];
  } catch {
    return [];
  }
}

function rememberSeen(prompts: string[]) {
  const next = [...readSeen(), ...prompts].slice(-40);
  try {
    localStorage.setItem(SEEN_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
}

function historyKey(uid: string) {
  return `oracle_history_v1_${uid}`;
}

export function usePractice() {
  const auth = useOracleAuth();
  const [config, setConfig] = useState<OracleConfig | null>(null);
  const [courseId, setCourseId] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [count, setCount] = useState(10);
  const [notice, setNotice] = useState("");
  const [phase, setPhase] = useState<"build" | "test" | "results">("build");
  const [questions, setQuestions] = useState<OracleQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Graded[]>([]);
  const [picked, setPicked] = useState<number | null>(null);
  const [showSteps, setShowSteps] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadNote, setLoadNote] = useState("");
  const [history, setHistory] = useState<SavedTest[]>([]);
  const [historyNote, setHistoryNote] = useState("");
  const [premiumUntil, setPremiumUntil] = useState("");
  const [usageText, setUsageText] = useState("");
  const [courseUsageText, setCourseUsageText] = useState("");
  const [weeklyPrize, setWeeklyPrize] = useState<PrizeView | null>(null);
  const [monthlyPrize, setMonthlyPrize] = useState<PrizeView | null>(null);
  const [whatsapp, setWhatsapp] = useState("2348165689362");
  const [registerOpen, setRegisterOpen] = useState(false);
  const testId = useRef("");
  const cancelled = useRef(false);
  const solutions = useRef(0);
  const target = useRef(0);
  const generating = useRef(false);
  const seenDuringTest = useRef<string[]>([]);

  const course = config?.courses.find((item) => item.id === courseId) ?? config?.courses[0];
  const paid = Boolean(config?.paid);
  const used = course ? Number(config?.used?.[course.id] || 0) : 0;
  const remaining = Math.max(0, (config?.freeDaily || 10) - used);
  const maxCount = paid ? config?.maxPerTest || 60 : Math.max(1, remaining);

  const refreshConfig = useCallback(async () => {
    const token = await auth.getToken();
    const next = await fetchConfig(token);
    setConfig(next);
    setCourseId((current) => current || next.courses[0]?.id || "");
  }, [auth]);

  useEffect(() => {
    if (!auth.confirmed) return;
    refreshConfig().catch(() =>
      setNotice("The practice room could not be loaded. Refresh and try again."),
    );
  }, [auth.confirmed, auth.user, refreshConfig]);

  useEffect(() => {
    if (!course) return;
    setSelectedTopics(course.topics);
  }, [course?.id]);

  const loadPrizes = useCallback(async () => {
    try {
      const token = await auth.getToken();
      const board = await fetchLeaderboard(token);
      setWeeklyPrize(board.prizes.weekly);
      setMonthlyPrize(board.prizes.monthly);
      if (board.whatsapp) setWhatsapp(board.whatsapp);
    } catch {
      /* prizes are optional here */
    }
  }, [auth]);

  const loadHistory = useCallback(async () => {
    if (!auth.user || !auth.confirmed) {
      setHistory([]);
      return;
    }
    const key = historyKey(auth.user.uid);
    let cached: {
      tests: SavedTest[];
      savedAt: number;
      premiumUntil?: string;
      usageText?: string;
      courseUsageText?: string;
    } | null = null;
    try {
      cached = JSON.parse(sessionStorage.getItem(key) || "null");
    } catch {
      cached = null;
    }
    if (cached?.tests) {
      setHistory(cached.tests);
      setPremiumUntil(cached.premiumUntil || "");
      setUsageText(cached.usageText || "");
      setCourseUsageText(cached.courseUsageText || "");
      if (Date.now() - cached.savedAt < HISTORY_TTL) return;
    }
    try {
      const token = await auth.getToken();
      if (!token) return;
      const data = await fetchHistory(token);
      const tests = data.tests || [];
      const until = data.premiumUntil
        ? `Until ${new Date(data.premiumUntil).toLocaleDateString()}`
        : "";
      const usage = (data.usage || {}) as {
        paidQuestionsTotal?: number;
        paidQuestionsByDay?: Record<string, number>;
        paidQuestionsByCourse?: Record<string, number>;
      };
      const today = new Date(Date.now() + 3600 * 1000).toISOString().slice(0, 10);
      const usageLine = `${Number(usage.paidQuestionsTotal || 0)} paid questions total · ${Number(usage.paidQuestionsByDay?.[today] || 0)} today`;
      const byCourse = usage.paidQuestionsByCourse || {};
      const courseLine = Object.keys(byCourse).length
        ? `By course: ${Object.keys(byCourse)
            .map((name) => `${name} ${Number(byCourse[name] || 0)}`)
            .join(" · ")}`
        : "";
      setHistory(tests);
      setPremiumUntil(until);
      setUsageText(usageLine);
      setCourseUsageText(courseLine);
      sessionStorage.setItem(
        key,
        JSON.stringify({
          tests,
          savedAt: Date.now(),
          premiumUntil: until,
          usageText: usageLine,
          courseUsageText: courseLine,
        }),
      );
    } catch {
      if (!cached) setHistoryNote("Could not load your saved tests. Refresh to try again.");
    }
  }, [auth]);

  useEffect(() => {
    if (!auth.confirmed) return;
    loadHistory();
    loadPrizes();
  }, [auth.confirmed, auth.user?.uid, loadHistory, loadPrizes]);

  const startTest = useCallback(async () => {
    if (!auth.confirmed) {
      setNotice("Checking the saved sign-in…");
      return false;
    }
    if (!auth.user) {
      setNotice("Sign in before starting a test.");
      return false;
    }
    if (!course || !selectedTopics.length) {
      setNotice("Choose a course and at least one topic.");
      return false;
    }
    const size = Math.min(Math.max(1, count), maxCount);
    setNotice("");
    cancelled.current = false;
    generating.current = true;
    solutions.current = 0;
    target.current = size;
    seenDuringTest.current = [];
    testId.current = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
    setQuestions([]);
    setAnswers([]);
    setIndex(0);
    setPicked(null);
    setShowSteps(false);
    setPhase("test");
    setLoading(true);
    setLoadNote("Writing your first questions…");
    const token = await auth.getToken();
    if (token) {
      postActivity(token, {
        action: "start",
        id: testId.current,
        course: course.label,
        topics: selectedTopics,
        total: size,
      }).catch(() => undefined);
    }

    let got = 0;
    let requests = 0;
    const maxRequests = Math.ceil(size / CHUNK) + 6;
    while (!cancelled.current && got < size && requests < maxRequests) {
      const batchNo = requests++;
      try {
        const fresh = await auth.getToken(requests > 1);
        if (!fresh) throw new Error("Sign in to continue.");
        const body = await fetchQuestions(fresh, {
          course: course.id,
          topics: [
            selectedTopics[batchNo % selectedTopics.length],
            selectedTopics[(batchNo + 1) % selectedTopics.length],
          ].filter((topic, topicIndex, list) => list.indexOf(topic) === topicIndex),
          count: Math.min(CHUNK, size - got),
          batch: batchNo,
          avoid: [...readSeen(), ...seenDuringTest.current].slice(-24),
        });
        const incoming = (Array.isArray(body.questions) ? body.questions : []) as OracleQuestion[];
        const locked = incoming.map(lockAnswerToExplanation);
        if (!locked.length) continue;
        seenDuringTest.current.push(...locked.map((item) => item.prompt.slice(0, 140)));
        rememberSeen(locked.map((item) => item.prompt));
        got += locked.length;
        setQuestions((current) => [...current, ...locked].slice(0, size));
        setLoading(false);
      } catch (error) {
        if (got === 0) {
          generating.current = false;
          setNotice(error instanceof Error ? error.message : "Questions could not be written.");
          setPhase("build");
          setLoading(false);
          return false;
        }
        break;
      }
    }
    setLoading(false);
    generating.current = false;
    if (got === 0) {
      setNotice("Oracle couldn't write a usable set. Please try again.");
      setPhase("build");
      return false;
    }
    return true;
  }, [auth, course, selectedTopics, count, maxCount]);

  const answer = useCallback(
    (selected: number) => {
      const question = questions[index];
      if (!question || picked !== null) return;
      const locked = lockAnswerToExplanation(question);
      const correct = selected === locked.answer;
      setQuestions((current) =>
        current.map((item, itemIndex) => (itemIndex === index ? locked : item)),
      );
      setPicked(selected);
      setAnswers((current) => [...current, { question: locked, selected, correct }]);
      auth.getToken().then((liveToken) => {
        if (!liveToken) return;
        postActivity(liveToken, {
          action: "answer",
          id: testId.current,
          index,
          answer: {
            topic: locked.topic,
            prompt: locked.prompt,
            options: locked.options,
            selected,
            correctAnswer: locked.answer,
            correct,
          },
        }).catch(() => undefined);
      });
    },
    [questions, index, picked, auth],
  );

  const revealSteps = useCallback(() => {
    setShowSteps(true);
    solutions.current += 1;
    if (!paid && solutions.current === 2) setRegisterOpen(true);
    const question = questions[index];
    auth.getToken().then((liveToken) => {
      if (!liveToken || !question) return;
      postActivity(liveToken, {
        action: "solution",
        id: testId.current,
        index,
        topic: question.topic,
      }).catch(() => undefined);
    });
  }, [auth, index, paid, questions]);

  const finish = useCallback(
    async (graded: Graded[]) => {
      setPhase("results");
      if (!auth.user || !course || !graded.length) return;
      const correct = graded.filter((item) => item.correct).length;
      const topicMap = new Map<string, { correct: number; total: number }>();
      graded.forEach((item) => {
        const row = topicMap.get(item.question.topic) || { correct: 0, total: 0 };
        row.total += 1;
        if (item.correct) row.correct += 1;
        topicMap.set(item.question.topic, row);
      });
      const entry: SavedTest = {
        id: testId.current,
        course: course.label,
        topics: selectedTopics,
        total: graded.length,
        correct,
        score: Math.round((correct / graded.length) * 100),
        topicResults: [...topicMap.entries()].map(([name, row]) => ({ name, ...row })),
        date: Date.now(),
      };
      setHistoryNote("Saving your result to your account…");
      try {
        const liveToken = await auth.getToken();
        if (!liveToken) throw new Error("Sign in to save.");
        await saveHistory(liveToken, {
          id: entry.id,
          course: entry.course,
          topics: entry.topics,
          total: entry.total,
          correct: entry.correct,
          topicResults: entry.topicResults,
          answers: graded.map((item) => ({
            topic: item.question.topic,
            prompt: item.question.prompt,
            options: item.question.options,
            selected: item.selected,
            correctAnswer: item.question.answer,
            correct: item.correct,
          })),
          name: auth.user.displayName || "",
        });
        setHistory((current) =>
          [entry, ...current.filter((item) => item.id !== entry.id)].slice(0, 20),
        );
        setHistoryNote("Saved to your account.");
        sessionStorage.removeItem(historyKey(auth.user.uid));
        refreshConfig().catch(() => undefined);
        loadPrizes();
      } catch {
        setHistoryNote("This result could not sync. Stay on this page and try again.");
      }
    },
    [auth, course, selectedTopics, refreshConfig, loadPrizes],
  );

  const next = useCallback(() => {
    if (picked === null) return;
    const upcoming = index + 1;
    if (upcoming >= target.current || (upcoming >= questions.length && !generating.current)) {
      void finish(answers);
      return;
    }
    if (upcoming >= questions.length) {
      setLoadNote("The next question is still being written…");
      setLoading(true);
      return;
    }
    setIndex(upcoming);
    setPicked(null);
    setShowSteps(false);
  }, [picked, index, questions.length, loading, answers, finish]);

  const endTest = useCallback(() => {
    cancelled.current = true;
    auth.getToken().then((liveToken) => {
      if (!liveToken) return;
      postActivity(liveToken, { action: "abandon", id: testId.current }).catch(() => undefined);
    });
    if (answers.length) void finish(answers);
    else setPhase("build");
  }, [answers, auth, finish]);

  const learningMap = useMemo(() => {
    const totals = new Map<string, { correct: number; total: number }>();
    history.forEach((test) => {
      (test.topicResults || []).forEach((result) => {
        const row = totals.get(result.name) || { correct: 0, total: 0 };
        row.correct += result.correct;
        row.total += result.total;
        totals.set(result.name, row);
      });
    });
    return [...totals.entries()]
      .filter(([, row]) => row.total > 0)
      .map(([name, row]) => ({
        name,
        correct: row.correct,
        total: row.total,
        score: Math.round((row.correct / row.total) * 100),
      }))
      .sort((a, b) => a.score - b.score || b.total - a.total);
  }, [history]);

  const mapSummary = useMemo(() => {
    if (!learningMap.length) {
      return auth.user
        ? "Complete a test to see your personal strengths and focus areas."
        : "Sign in to sync your learning map, or take a test to start one on this device.";
    }
    const needsWork = learningMap.filter((item) => item.score < 70);
    return needsWork.length
      ? `Your next focus: ${needsWork
          .slice(0, 2)
          .map((item) => item.name)
          .join(" and ")}.`
      : "Strong work. Your recent results are at least 70% across every tracked topic.";
  }, [auth.user, learningMap]);

  return {
    auth,
    config,
    course,
    courseId,
    setCourseId,
    selectedTopics,
    setSelectedTopics,
    count,
    setCount,
    notice,
    phase,
    questions,
    index,
    answers,
    picked,
    showSteps,
    loading,
    loadNote,
    history,
    historyNote,
    premiumUntil,
    usageText,
    courseUsageText,
    weeklyPrize,
    monthlyPrize,
    whatsapp,
    registerOpen,
    setRegisterOpen,
    paid,
    remaining,
    maxCount,
    learningMap,
    mapSummary,
    startTest,
    answer,
    revealSteps,
    next,
    endTest,
    setPhase,
    refreshConfig,
  };
}
