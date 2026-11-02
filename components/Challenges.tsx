"use client";

import { ArrowRight, Award, CheckCircle2, Flame, Lightbulb, LockKeyhole, MessageCircleWarning, ShieldAlert, Sparkles, Trophy, UserRoundCheck, XCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { categories, categoryOrder, challenges } from "@/data/content";
import type { Category, ChallengeAnswer, Option, SessionState } from "@/types";
import { OptionCard, Progress, Shell } from "@/components/app-ui";

const categoryIcons = { phishing: ShieldAlert, passwords: LockKeyhole, social: MessageCircleWarning, privacy: UserRoundCheck };
const badgeNames: Record<Category, string> = { phishing: "Radar antifraude", passwords: "Guardián de claves", social: "Mente alerta", privacy: "Custodio de datos" };

function getStreaks(answers: Record<string, ChallengeAnswer>) {
  let current = 0;
  let maximum = 0;
  for (const item of challenges) {
    const answer = answers[item.id];
    if (!answer) break;
    current = answer.correct ? current + 1 : 0;
    maximum = Math.max(maximum, current);
  }
  return { current, maximum };
}

export function Challenges({ state, onSave, onComplete }: { state: SessionState; onSave: (answers: Record<string, ChallengeAnswer>) => void; onComplete: (answers: Record<string, ChallengeAnswer>) => void }) {
  const firstOpen = Math.min(Object.keys(state.challengeAnswers).length, challenges.length - 1);
  const [index, setIndex] = useState(firstOpen);
  const [answers, setAnswers] = useState(state.challengeAnswers);
  const [selected, setSelected] = useState<Option["id"] | null>(null);
  const [feedback, setFeedback] = useState(false);
  const [completedModule, setCompletedModule] = useState<Category | null>(null);
  const challenge = challenges[index];
  const correct = selected === challenge.correctOption;
  const isLast = index === challenges.length - 1;
  const currentCategoryIndex = categoryOrder.indexOf(challenge.category);
  const moduleChallenges = challenges.filter((item) => item.category === challenge.category);
  const moduleChallengeIndex = moduleChallenges.findIndex((item) => item.id === challenge.id);
  const points = Object.values(answers).filter((answer) => answer.correct).length * 100;
  const streaks = getStreaks(answers);
  const Icon = categoryIcons[challenge.category];
  const completedIds = useMemo(() => new Set(Object.keys(answers)), [answers]);

  function respond(option: Option["id"]) {
    if (feedback) return;
    setSelected(option);
  }
  function check() {
    if (!selected) return;
    const next = { ...answers, [challenge.id]: { option: selected, correct, points: correct ? 100 : 0 } };
    setAnswers(next); onSave(next); setFeedback(true);
  }
  function next() {
    if (isLast) { onComplete(answers); return; }
    if (challenge.category !== challenges[index + 1].category) { setCompletedModule(challenge.category); return; }
    setIndex((value) => value + 1); setSelected(null); setFeedback(false);
  }

  if (completedModule) {
    const CompleteIcon = categoryIcons[completedModule];
    const moduleScore = challenges.filter((item) => item.category === completedModule && answers[item.id]?.correct).length;
    return <Shell eyebrow={`Nivel ${categoryOrder.indexOf(completedModule) + 1} completado`} title="Misión cumplida" subtitle="Sumaste nuevas herramientas para tomar decisiones más seguras.">
      <section className="module-complete"><span><CompleteIcon /></span><p>Completaste el nivel</p><h2>{categories[completedModule].label}</h2><div className="module-reward"><Award /><div><small>Insignia desbloqueada</small><strong>{badgeNames[completedModule]}</strong></div></div><div className="module-stats"><span><strong>{moduleScore}/3</strong> decisiones seguras</span><span><strong>{points}</strong> puntos acumulados</span><span><strong>{streaks.maximum}</strong> mejor racha</span></div><button className="primary-button" onClick={() => { setCompletedModule(null); setIndex((value) => value + 1); setSelected(null); setFeedback(false); }}>Continuar al siguiente nivel <ArrowRight /></button></section>
    </Shell>;
  }

  return <Shell eyebrow="Paso 3 de 5 · Dificultad avanzada" title="Misiones de seguridad" subtitle="Las señales son más sutiles y varias respuestas pueden parecer razonables. Elegí siempre la alternativa más segura.">
    <div className="game-hud">
      <div className="points"><Trophy size={18} /> <strong>{points}</strong><span>puntos</span></div>
      <div className={`streak ${streaks.current >= 2 ? "hot" : ""}`}><Flame size={18} /><strong>{streaks.current}</strong><span>racha</span></div>
      <div className="hud-progress"><span>{Object.keys(answers).length} de {challenges.length} desafíos</span><Progress value={(Object.keys(answers).length / challenges.length) * 100} /></div>
    </div>
    <nav className="level-map" aria-label="Niveles">
      {categoryOrder.map((category, level) => { const LevelIcon = categoryIcons[category]; const categoryChallenges = challenges.filter((c) => c.category === category); const completedCount = categoryChallenges.filter((c) => completedIds.has(c.id)).length; const complete = completedCount === categoryChallenges.length; return <div key={category} className={`level ${level === currentCategoryIndex ? "active" : ""} ${complete ? "complete" : ""}`}><span>{complete ? <CheckCircle2 /> : <LevelIcon />}</span><small>Nivel {level + 1} · {completedCount}/{categoryChallenges.length}</small><strong>{categories[category].shortLabel}</strong></div>; })}
    </nav>
    <section className="challenge-card">
      <div className="challenge-top"><span className={`category-icon ${challenge.category}`}><Icon /></span><div><p className="question-category">Nivel {currentCategoryIndex + 1} · Desafío {moduleChallengeIndex + 1} de {moduleChallenges.length}</p><h2>{challenge.title}</h2></div></div>
      <p className="scenario">{challenge.prompt}</p>
      <div className="options">{challenge.options.map((option) => <OptionCard key={option.id} letter={option.id} text={option.text} selected={selected === option.id} correct={feedback && option.id === challenge.correctOption} incorrect={feedback && selected === option.id && !correct} disabled={feedback} onClick={() => respond(option.id)} />)}</div>
      {feedback && <div className={`feedback ${correct ? "good" : "learn"}`}>
        <div className="feedback-title">{correct ? <CheckCircle2 /> : <XCircle />}<strong>{correct ? `¡Decisión segura! +100 puntos${streaks.current >= 2 ? ` · Racha x${streaks.current}` : ""}` : "Esta vez no fue la opción más segura"}</strong></div>
        <p>{challenge.explanation}</p>{!correct && <p className="safer"><Lightbulb size={18} /><span><strong>Alternativa más segura:</strong> {challenge.saferAlternative}</span></p>}
      </div>}
    </section>
    <div className="actions split"><span className="helper-text"><Sparkles size={15} /> Sin penalización por errores</span>{feedback ? <button className="primary-button" onClick={next}>{isLast ? "Ir al post-test" : challenge.category !== challenges[index + 1]?.category ? "Completar nivel" : "Siguiente desafío"}<ArrowRight size={18} /></button> : <button className="primary-button" disabled={!selected} onClick={check}>Confirmar decisión<ArrowRight size={18} /></button>}</div>
  </Shell>;
}

