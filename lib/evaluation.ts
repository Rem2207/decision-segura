import { categories, categoryOrder, challenges, postQuestions, preQuestions } from "@/data/content";
import type { AnswerMap, CategoryResult, Question, SessionState } from "@/types";

export function scoreAnswers(questions: Question[], answers: AnswerMap) {
  return questions.reduce((total, question) => total + (answers[question.id] === question.correctOption ? 1 : 0), 0);
}

export function categoryResults(preAnswers: AnswerMap, postAnswers: AnswerMap): CategoryResult[] {
  return categoryOrder.map((category) => {
    const pre = preQuestions.filter((q) => q.category === category);
    const post = postQuestions.filter((q) => q.category === category);
    return {
      category,
      preCorrect: scoreAnswers(pre, preAnswers),
      postCorrect: scoreAnswers(post, postAnswers),
      total: 3,
    };
  });
}

export function challengeScore(state: SessionState) {
  return Object.values(state.challengeAnswers).filter((answer) => answer.correct).length * 100;
}

export function makeExport(state: SessionState) {
  const preScore = scoreAnswers(preQuestions, state.preAnswers);
  const postScore = scoreAnswers(postQuestions, state.postAnswers);
  return {
    schemaVersion: "1.0",
    instrumentVersion: "POC-SD-2026-01",
    participantId: state.participantId,
    timestamps: { startedAt: state.startedAt, completedAt: state.completedAt },
    consented: state.consented,
    responses: {
      preTest: preQuestions.map((q) => ({ questionId: q.id, category: q.category, selectedOption: state.preAnswers[q.id] ?? null, correct: state.preAnswers[q.id] === q.correctOption })),
      postTest: postQuestions.map((q) => ({ questionId: q.id, category: q.category, selectedOption: state.postAnswers[q.id] ?? null, correct: state.postAnswers[q.id] === q.correctOption })),
      challenges: challenges.map((challenge) => ({ challengeId: challenge.id, category: challenge.category, ...state.challengeAnswers[challenge.id] })),
      perception: state.perception,
    },
    results: {
      preTest: { score: preScore, total: 12, percentage: Math.round((preScore / 12) * 100) },
      postTest: { score: postScore, total: 12, percentage: Math.round((postScore / 12) * 100) },
      difference: postScore - preScore,
      byCategory: categoryResults(state.preAnswers, state.postAnswers).map((result) => ({ ...result, label: categories[result.category].label })),
      challenges: { score: challengeScore(state), maximum: challenges.length * 100, completed: Object.keys(state.challengeAnswers).length },
    },
    privacyNotice: "No contiene nombre, correo, documento ni credenciales. El archivo fue generado localmente en el navegador.",
  };
}

export function makeCsv(state: SessionState) {
  const data = makeExport(state);
  const headers = ["participant_id", "instrument_version", "started_at", "completed_at", "pre_score", "post_score", "difference", "challenge_score", "clarity", "feedback_utility", "interest"];
  const values = [data.participantId, data.instrumentVersion, data.timestamps.startedAt, data.timestamps.completedAt ?? "", data.results.preTest.score, data.results.postTest.score, data.results.difference, data.results.challenges.score, state.perception.clarity ?? "", state.perception.feedbackUtility ?? "", state.perception.interest ?? ""];
  return `${headers.join(",")}\n${values.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(",")}\n`;
}

export function makeSummary(state: SessionState) {
  const data = makeExport(state);
  return [
    "Resumen — Alfabetización en seguridad digital",
    `Participante: ${data.participantId}`,
    `Pre-test: ${data.results.preTest.score}/12 (${data.results.preTest.percentage}%)`,
    `Post-test: ${data.results.postTest.score}/12 (${data.results.postTest.percentage}%)`,
    `Diferencia individual: ${data.results.difference >= 0 ? "+" : ""}${data.results.difference}`,
    `Desafíos: ${data.results.challenges.score}/${data.results.challenges.maximum} puntos`,
    "Este resultado describe únicamente esta sesión y no demuestra causalidad ni un cambio sostenido de comportamiento.",
  ].join("\n");
}

