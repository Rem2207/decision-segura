"use client";

import { ArrowRight, ClipboardCheck } from "lucide-react";
import { useState } from "react";
import type { AnswerMap, Option, Question } from "@/types";
import { OptionCard, Shell } from "@/components/app-ui";

export function Quiz({ kind, questions, initialAnswers, onComplete }: { kind: "pre" | "post"; questions: Question[]; initialAnswers: AnswerMap; onComplete: (answers: AnswerMap) => void }) {
  const answeredCount = Object.keys(initialAnswers).length;
  const [index, setIndex] = useState(Math.min(answeredCount, questions.length - 1));
  const [answers, setAnswers] = useState<AnswerMap>(initialAnswers);
  const question = questions[index];
  const selected = answers[question.id];
  const isLast = index === questions.length - 1;
  const title = kind === "pre" ? "Evaluación inicial" : "Evaluación final";
  const subtitle = kind === "pre" ? "Respondé según lo que harías hoy. No se mostrará la corrección durante la evaluación." : "Aplicá lo aprendido. La corrección se mostrará cuando termines.";

  function choose(option: Option["id"]) { setAnswers((current) => ({ ...current, [question.id]: option })); }
  function next() {
    if (!selected) return;
    if (isLast) onComplete(answers);
    else setIndex((value) => value + 1);
  }

  return <Shell eyebrow={kind === "pre" ? "Paso 2 de 5" : "Paso 4 de 5"} title={title} subtitle={subtitle} progress={((index + 1) / questions.length) * 100}>
    <div className="quiz-meta"><span><ClipboardCheck size={16} /> Pregunta {index + 1} de {questions.length}</span><span>{question.id}</span></div>
    <section className="question-card">
      <p className="question-category">{question.category === "passwords" ? "Contraseñas" : question.category === "social" ? "Ingeniería social" : question.category === "privacy" ? "Información personal" : "Phishing"}</p>
      <h2>{question.prompt}</h2>
      <div className="options">{question.options.map((option) => <OptionCard key={option.id} letter={option.id} text={option.text} selected={selected === option.id} onClick={() => choose(option.id)} />)}</div>
    </section>
    <div className="actions split"><span className="helper-text">Seleccioná una opción para continuar.</span><button className="primary-button" disabled={!selected} onClick={next}>{isLast ? "Finalizar evaluación" : "Continuar"}<ArrowRight size={18} /></button></div>
  </Shell>;
}

