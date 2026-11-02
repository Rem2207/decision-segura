"use client";

import { ArrowRight, CheckCircle2, Lightbulb, LockKeyhole, MessageCircleWarning, ShieldAlert, Sparkles, Trophy, UserRoundCheck, XCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { categories, categoryOrder, challenges } from "@/data/content";
import type { Category, ChallengeAnswer, Option, SessionState } from "@/types";
import { OptionCard, Progress, Shell } from "@/components/app-ui";

const categoryIcons = { phishing: ShieldAlert, passwords: LockKeyhole, social: MessageCircleWarning, privacy: UserRoundCheck };

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
  const moduleChallengeIndex = challenges.filter((item) => item.category === challenge.category).findIndex((item) => item.id === challenge.id);
  const points = Object.values(answers).filter((answer) => answer.correct).length * 100;
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
    return <Shell eyebrow={`Nivel ${categoryOrder.indexOf(completedModule) + 1} completado`} title="Misión cumplida" subtitle="Sumaste nuevas herramientas para tomar decisiones más seguras.">
      <section className="module-complete"><span><CompleteIcon /></span><p>Completaste el nivel</p><h2>{categories[completedModule].label}</h2><strong>{points} puntos acumulados</strong><button className="primary-button" onClick={() => { setCompletedModule(null); setIndex((value) => value + 1); setSelected(null); setFeedback(false); }}>Continuar al siguiente nivel <ArrowRight /></button></section>
    </Shell>;
  }

  return <Shell eyebrow="Paso 3 de 5" title="Misiones de seguridad" subtitle="Tomá una decisión y recibí retroalimentación inmediata. Podés aprender incluso si te equivocás.">
    <div className="game-hud">
      <div className="points"><Trophy size={18} /> <strong>{points}</strong><span>puntos</span></div>
      <div className="hud-progress"><span>{Object.keys(answers).length} de {challenges.length} desafíos</span><Progress value={(Object.keys(answers).length / challenges.length) * 100} /></div>
    </div>
    <nav className="level-map" aria-label="Niveles">
      {categoryOrder.map((category, level) => { const LevelIcon = categoryIcons[category]; const complete = challenges.filter((c) => c.category === category).every((c) => completedIds.has(c.id)); return <div key={category} className={`level ${level === currentCategoryIndex ? "active" : ""} ${complete ? "complete" : ""}`}><span>{complete ? <CheckCircle2 /> : <LevelIcon />}</span><small>Nivel {level + 1}</small><strong>{categories[category].shortLabel}</strong></div>; })}
    </nav>
    <section className="challenge-card">
      <div className="challenge-top"><span className={`category-icon ${challenge.category}`}><Icon /></span><div><p className="question-category">Nivel {currentCategoryIndex + 1} · Desafío {moduleChallengeIndex + 1} de 2</p><h2>{challenge.title}</h2></div></div>
      <p className="scenario">{challenge.prompt}</p>
      <div className="options">{challenge.options.map((option) => <OptionCard key={option.id} letter={option.id} text={option.text} selected={selected === option.id} correct={feedback && option.id === challenge.correctOption} incorrect={feedback && selected === option.id && !correct} disabled={feedback} onClick={() => respond(option.id)} />)}</div>
      {feedback && <div className={`feedback ${correct ? "good" : "learn"}`}>
        <div className="feedback-title">{correct ? <CheckCircle2 /> : <XCircle />}<strong>{correct ? "¡Decisión segura! +100 puntos" : "Esta vez no fue la opción más segura"}</strong></div>
        <p>{challenge.explanation}</p>{!correct && <p className="safer"><Lightbulb size={18} /><span><strong>Alternativa más segura:</strong> {challenge.saferAlternative}</span></p>}
      </div>}
    </section>
    <div className="actions split"><span className="helper-text"><Sparkles size={15} /> Sin penalización por errores</span>{feedback ? <button className="primary-button" onClick={next}>{isLast ? "Ir al post-test" : challenge.category !== challenges[index + 1]?.category ? "Completar nivel" : "Siguiente desafío"}<ArrowRight size={18} /></button> : <button className="primary-button" disabled={!selected} onClick={check}>Confirmar decisión<ArrowRight size={18} /></button>}</div>
  </Shell>;
}

