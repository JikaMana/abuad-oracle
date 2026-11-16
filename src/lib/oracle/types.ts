export type Course = {
  id: string;
  label: string;
  name: string;
  topics: string[];
  grounded: boolean;
};

export type OracleConfig = {
  paid: boolean;
  sitewidePremium: boolean;
  promoUntil: string;
  promoActive: boolean;
  authMode: string;
  freeDaily: number;
  freeCoursesDaily: number;
  subjectsUsed: number;
  maxPerTest: number;
  used: Record<string, number>;
  courses: Course[];
};

export type OracleQuestion = {
  topic: string;
  prompt: string;
  options: string[];
  answer: number;
  steps: string[];
  origin?: string;
  source?: string;
  course?: string;
};

export type TopicResult = { name: string; correct: number; total: number };

export type SavedTest = {
  id?: string;
  course: string;
  topics: string[];
  total: number;
  correct: number;
  score?: number;
  topicResults?: TopicResult[];
  date?: number | string;
  completedAt?: number | string | { seconds?: number; _seconds?: number };
};

export type PrizeView = {
  title: string;
  reward: string;
  leaderName: string | null;
  yours: boolean;
  locked: boolean;
  code: string | null;
  note?: string;
};

export type BoardRow = {
  rank: number;
  name: string;
  you: boolean;
  average: number;
  improvement: number;
  tests: number;
  days: number;
  points: number;
};

export type BoardPeriod = {
  label: string;
  rows: BoardRow[];
  chart: { label: string; tests: number; average: number }[];
};

export type Leaderboard = {
  ranking: string;
  updatedAt: string;
  whatsapp: string;
  periods: { daily: BoardPeriod; weekly: BoardPeriod; monthly: BoardPeriod };
  prizes: { weekly: PrizeView; monthly: PrizeView };
};

export const ADMIN_EMAIL = "burhantutors@gmail.com";
export const CHUNK = 3;
export const WHATSAPP = "2348165689362";
