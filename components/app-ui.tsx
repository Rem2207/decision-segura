import { Check, ChevronLeft, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";

export function Progress({ value, label }: { value: number; label?: string }) {
  return <div className="progress-wrap" aria-label={label ?? `Progreso ${Math.round(value)}%`}><div className="progress-bar" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} /></div>;
}

export function Brand() {
  return <div className="brand"><span className="brand-mark"><ShieldCheck size={21} /></span><span>Decisión Segura</span></div>;
}

export function Shell({ children, eyebrow, title, subtitle, progress, onBack }: { children: ReactNode; eyebrow: string; title: string; subtitle?: string; progress?: number; onBack?: () => void }) {
  return <main className="app-shell">
    <header className="topbar"><Brand /><span className="academic-pill">PoC académica</span></header>
    <section className="screen">
      {onBack && <button className="back-button" onClick={onBack}><ChevronLeft size={17} /> Volver</button>}
      <div className="screen-heading"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1>{subtitle && <p>{subtitle}</p>}</div>
      {typeof progress === "number" && <Progress value={progress} />}
      {children}
    </section>
  </main>;
}

export function OptionCard({ letter, text, selected, disabled, correct, incorrect, onClick }: { letter: string; text: string; selected?: boolean; disabled?: boolean; correct?: boolean; incorrect?: boolean; onClick: () => void }) {
  const state = correct ? " correct" : incorrect ? " incorrect" : selected ? " selected" : "";
  return <button className={`option-card${state}`} onClick={onClick} disabled={disabled} aria-pressed={selected}>
    <span className="option-letter">{correct ? <Check size={18} /> : letter}</span><span>{text}</span>
  </button>;
}

