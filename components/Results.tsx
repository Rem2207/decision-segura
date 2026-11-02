"use client";

import { Award, BarChart3, Check, Clipboard, Download, FileJson, LockKeyhole, MessageCircleWarning, RotateCcw, Send, ShieldAlert, Sparkles, TrendingDown, TrendingUp, UserRoundCheck } from "lucide-react";
import { useState } from "react";
import { categories, challenges } from "@/data/content";
import { categoryResults, challengeScore, makeCsv, makeExport, makeSummary, scoreAnswers } from "@/lib/evaluation";
import { downloadFile } from "@/lib/storage";
import { postQuestions, preQuestions } from "@/data/content";
import type { PerceptionAnswers, SessionState } from "@/types";
import { Progress, Shell } from "@/components/app-ui";

const perceptionQuestions: { key: keyof PerceptionAnswers; label: string }[] = [
  { key: "clarity", label: "Los desafíos fueron claros" },
  { key: "feedbackUtility", label: "La retroalimentación fue útil" },
  { key: "interest", label: "La experiencia resultó interesante" },
];

const badges = [
  { label: "Radar antifraude", detail: "Phishing", icon: ShieldAlert },
  { label: "Guardián de claves", detail: "Contraseñas", icon: LockKeyhole },
  { label: "Mente alerta", detail: "Ingeniería social", icon: MessageCircleWarning },
  { label: "Custodio de datos", detail: "Información personal", icon: UserRoundCheck },
];

export function Results({ state, onPerception, onReset }: { state: SessionState; onPerception: (value: PerceptionAnswers) => void; onReset: () => void }) {
  const [copied, setCopied] = useState(false);
  const pre = scoreAnswers(preQuestions, state.preAnswers);
  const post = scoreAnswers(postQuestions, state.postAnswers);
  const difference = post - pre;
  const byCategory = categoryResults(state.preAnswers, state.postAnswers);
  const gameScore = challengeScore(state);
  const gameMaximum = challenges.length * 100;
  const stamp = state.participantId.toLowerCase();
  const Trend = difference >= 0 ? TrendingUp : TrendingDown;

  function downloadJson() { downloadFile(JSON.stringify(makeExport(state), null, 2), `resultados-${stamp}.json`, "application/json;charset=utf-8"); }
  function downloadCsv() { downloadFile(makeCsv(state), `resumen-${stamp}.csv`, "text/csv;charset=utf-8"); }
  async function copy() { await navigator.clipboard.writeText(makeSummary(state)); setCopied(true); setTimeout(() => setCopied(false), 1800); }

  return <Shell eyebrow="Experiencia completada" title="Tu recorrido, en perspectiva" subtitle="Estos resultados corresponden únicamente a tu sesión y muestran tu desempeño inmediato." progress={100}>
    <section className="result-hero">
      <div className="result-copy"><span className="celebration"><Sparkles /> Sesión finalizada</span><h2>{difference > 0 ? `Tu puntaje aumentó ${difference} ${difference === 1 ? "punto" : "puntos"}` : difference === 0 ? "Mantuviste tu puntaje" : `La diferencia fue de ${difference} puntos`}</h2><p>Completaste las dos evaluaciones y los cuatro niveles educativos.</p></div>
      <div className="delta-orb"><Trend /><strong>{difference > 0 ? "+" : ""}{difference}</strong><span>post − pre</span></div>
    </section>

    <div className="score-grid">
      <article className="score-card"><span>Pre-test</span><strong>{pre}<small>/12</small></strong><Progress value={(pre / 12) * 100} /><p>{Math.round((pre / 12) * 100)}% de respuestas correctas</p></article>
      <article className="score-card accent"><span>Post-test</span><strong>{post}<small>/12</small></strong><Progress value={(post / 12) * 100} /><p>{Math.round((post / 12) * 100)}% de respuestas correctas</p></article>
      <article className="score-card game"><span>Puntos de desafíos</span><strong>{gameScore}<small>/{gameMaximum}</small></strong><Progress value={(gameScore / gameMaximum) * 100} /><p>Puntaje gamificado independiente</p></article>
    </div>

    <section className="panel results-panel"><div className="section-title"><BarChart3 /><div><h2>Desempeño por categoría</h2><p>Aciertos sobre 3 preguntas en cada medición.</p></div></div>
      <div className="category-results">{byCategory.map((result) => <div className="category-row" key={result.category}><strong>{categories[result.category].label}</strong><div className="mini-bars"><div><span>Pre {result.preCorrect}/3</span><Progress value={(result.preCorrect / 3) * 100} /></div><div><span>Post {result.postCorrect}/3</span><Progress value={(result.postCorrect / 3) * 100} /></div></div></div>)}</div>
    </section>

    <section className="panel badge-panel"><div className="section-title"><Award /><div><h2>Insignias de misión</h2><p>Una por cada nivel educativo completado.</p></div></div><div className="badge-grid">{badges.map(({ label, detail, icon: Icon }) => <article key={label}><span><Icon /></span><div><strong>{label}</strong><small>{detail}</small></div><Check /></article>)}</div></section>

    <section className="panel perception-panel"><div className="section-title"><Sparkles /><div><h2>Tu percepción <span>Opcional</span></h2><p>Valorá cada afirmación del 1 (muy en desacuerdo) al 5 (muy de acuerdo).</p></div></div>
      <div className="rating-list">{perceptionQuestions.map((question) => <div className="rating-row" key={question.key}><strong>{question.label}</strong><div className="rating-buttons" role="group" aria-label={question.label}>{[1,2,3,4,5].map((value) => <button key={value} className={state.perception[question.key] === value ? "active" : ""} onClick={() => onPerception({ ...state.perception, [question.key]: value })}>{value}</button>)}</div></div>)}</div>
    </section>

    <section className="export-panel"><div><span className="export-icon"><Send /></span><h2>Compartí tus resultados voluntariamente</h2><p>Descargá el archivo JSON y envialo al investigador por el canal que te haya indicado. El archivo no incluye nombre, correo, documento ni credenciales.</p></div>
      <button className="primary-button large" onClick={downloadJson}><FileJson /> Descargar resultados (.json)</button>
      <div className="secondary-actions"><button className="secondary-button" onClick={downloadCsv}><Download /> Descargar resumen CSV</button><button className="secondary-button" onClick={copy}>{copied ? <Check /> : <Clipboard />} {copied ? "Resumen copiado" : "Copiar resumen"}</button></div>
      <p className="local-note">Los resultados permanecen en este navegador hasta que los exportes o reinicies la experiencia. LocalStorage no es una base de datos centralizada.</p>
    </section>

    <aside className="research-note"><strong>Cómo interpretar este resultado</strong><p>La comparación es exploratoria e individual. Una diferencia positiva no demuestra que la aplicación haya causado una mejora general del aprendizaje ni permite inferir un cambio sostenido de comportamiento.</p></aside>
    <button className="reset-button" onClick={onReset}><RotateCcw /> Reiniciar experiencia</button>
  </Shell>;
}

