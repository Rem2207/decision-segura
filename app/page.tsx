"use client";

import { ArrowRight, CheckCircle2, Clock3, Database, Eye, FileDown, Fingerprint, LockKeyhole, MessageCircleWarning, ShieldAlert, ShieldCheck, UserRoundCheck } from "lucide-react";
import { useState } from "react";
import { Challenges } from "@/components/Challenges";
import { Quiz } from "@/components/Quiz";
import { Results } from "@/components/Results";
import { Brand, Shell } from "@/components/app-ui";
import { categories, postQuestions, preQuestions } from "@/data/content";
import { clearSession, createSession } from "@/lib/storage";
import { usePersistentSession } from "@/lib/usePersistentSession";
import type { AnswerMap, ChallengeAnswer, PerceptionAnswers } from "@/types";

const cards = [
  { key: "phishing" as const, icon: ShieldAlert },
  { key: "passwords" as const, icon: LockKeyhole },
  { key: "social" as const, icon: MessageCircleWarning },
  { key: "privacy" as const, icon: UserRoundCheck },
];

export default function Home() {
  const { state, setState, ready } = usePersistentSession();
  if (!ready || !state) return <div className="loading-screen"><ShieldCheck /><span>Preparando tu experiencia…</span></div>;

  const update = (change: Partial<typeof state>) => setState((current) => current ? { ...current, ...change } : current);
  function finishQuiz(kind: "pre" | "post", answers: AnswerMap) {
    if (kind === "pre") update({ preAnswers: answers, stage: "challenges" });
    else update({ postAnswers: answers, stage: "results", completedAt: new Date().toISOString() });
  }
  function reset() {
    if (!window.confirm("¿Querés eliminar esta sesión? Recomendamos descargar los resultados antes de reiniciar. Esta acción no se puede deshacer.")) return;
    clearSession(); setState(createSession());
  }

  if (state.stage === "welcome") return <Welcome onStart={() => update({ stage: "consent" })} />;
  if (state.stage === "consent") return <Consent participantId={state.participantId} onBack={() => update({ stage: "welcome" })} onAccept={() => update({ consented: true, stage: "pretest" })} />;
  if (state.stage === "pretest") return <Quiz kind="pre" questions={preQuestions} initialAnswers={state.preAnswers} onComplete={(answers) => finishQuiz("pre", answers)} />;
  if (state.stage === "challenges") return <Challenges state={state} onSave={(challengeAnswers: Record<string, ChallengeAnswer>) => update({ challengeAnswers })} onComplete={(challengeAnswers) => update({ challengeAnswers, stage: "posttest" })} />;
  if (state.stage === "posttest") return <Quiz kind="post" questions={postQuestions} initialAnswers={state.postAnswers} onComplete={(answers) => finishQuiz("post", answers)} />;
  return <Results state={state} onPerception={(perception: PerceptionAnswers) => update({ perception })} onReset={reset} />;
}

function Welcome({ onStart }: { onStart: () => void }) {
  return <main className="landing">
    <header className="landing-nav"><Brand /><span className="academic-pill">Proyecto universitario · PoC</span></header>
    <section className="hero">
      <div className="hero-copy"><span className="eyebrow"><Fingerprint size={16} /> Aprendé a decidir con confianza</span><h1>Tu seguridad digital empieza con una <em>buena decisión.</em></h1><p>Una experiencia breve y gamificada para reconocer riesgos cotidianos, practicar respuestas seguras y observar tu propio desempeño.</p>
        <div className="hero-actions"><button className="primary-button hero-button" onClick={onStart}>Comenzar experiencia <ArrowRight /></button><span><Clock3 /> 10–15 minutos</span></div>
        <div className="privacy-note"><Eye /><p><strong>Sin datos personales.</strong> No pedimos nombre, correo ni documento.</p></div>
      </div>
      <div className="hero-visual" aria-label="Vista previa del recorrido"><div className="glow" /><div className="mission-preview"><div className="preview-top"><span>Tu recorrido</span><strong>0 / 4 niveles</strong></div><div className="preview-ring"><ShieldCheck /><span>LISTO PARA<br/><strong>EMPEZAR</strong></span></div><div className="preview-levels">{cards.map(({ key, icon: Icon }, i) => <div key={key}><span><Icon /></span><small>0{i + 1}</small><strong>{categories[key].shortLabel}</strong></div>)}</div></div></div>
    </section>
    <section className="topics"><div className="section-kicker">4 niveles · 8 desafíos</div><h2>Situaciones reales. Decisiones más seguras.</h2><div className="topic-grid">{cards.map(({ key, icon: Icon }, i) => <article key={key}><span>0{i + 1}</span><Icon/><div><h3>{categories[key].label}</h3><p>{categories[key].description}</p></div></article>)}</div></section>
  </main>;
}

function Consent({ participantId, onBack, onAccept }: { participantId: string; onBack: () => void; onAccept: () => void }) {
  const [checked, setChecked] = useState(false);
  return <Shell eyebrow="Paso 1 de 5" title="Antes de comenzar" subtitle="Leé esta información y decidí si querés participar." onBack={onBack}>
    <section className="consent-card"><div className="consent-icon"><ShieldCheck /></div><div><h2>Consentimiento para la prueba académica</h2><p>Esta es una prueba de concepto desarrollada para una investigación universitaria sobre alfabetización en seguridad digital.</p>
      <ul className="consent-list"><li><CheckCircle2 /><span>La experiencia incluye un pre-test, desafíos educativos y un post-test.</span></li><li><Database /><span>Las respuestas se guardan <strong>solo en este navegador</strong> mediante LocalStorage. No existe una base de datos centralizada.</span></li><li><FileDown /><span>Al finalizar, podrás exportar los resultados y compartirlos voluntariamente con el investigador.</span></li><li><Eye /><span>No se solicitan nombres, correos, documentos, credenciales ni otros datos personales.</span></li></ul>
      <div className="participant-code"><span>Identificador aleatorio de esta sesión</span><strong>{participantId}</strong></div>
      <label className="consent-check"><input type="checkbox" checked={checked} onChange={(event) => setChecked(event.target.checked)} /><span>Acepto participar voluntariamente y comprendo cómo se almacenan los datos.</span></label>
    </div></section>
    <div className="actions end"><button className="primary-button" disabled={!checked} onClick={onAccept}>Aceptar y continuar <ArrowRight /></button></div>
  </Shell>;
}
