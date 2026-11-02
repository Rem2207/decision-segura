export type Category = "phishing" | "passwords" | "social" | "privacy";
export type Stage = "welcome" | "consent" | "pretest" | "challenges" | "posttest" | "results";

export interface Option { id: "A" | "B" | "C"; text: string }
export type AnswerMap = Record<string, Option["id"]>;
export interface Question { id: string; category: Category; prompt: string; options: Option[]; correctOption: Option["id"] }
export interface Challenge extends Question { title: string; explanation: string; saferAlternative: string }
export interface ChallengeAnswer { option: Option["id"]; correct: boolean; points: number }
export interface PerceptionAnswers { clarity: number | null; feedbackUtility: number | null; interest: number | null }

export interface SessionState {
  participantId: string;
  instrumentVersion: string;
  startedAt: string;
  completedAt: string | null;
  stage: Stage;
  consented: boolean;
  preAnswers: AnswerMap;
  postAnswers: AnswerMap;
  challengeAnswers: Record<string, ChallengeAnswer>;
  perception: PerceptionAnswers;
}

export interface CategoryResult { category: Category; preCorrect: number; postCorrect: number; total: number }

