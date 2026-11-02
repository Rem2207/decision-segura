import type { SessionState } from "@/types";

export const STORAGE_KEY = "seguridad-digital-poc-session-v3";

export function createSession(): SessionState {
  return {
    participantId: `SD-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
    instrumentVersion: "POC-SD-2026-03",
    startedAt: new Date().toISOString(),
    completedAt: null,
    stage: "welcome",
    consented: false,
    preAnswers: {},
    postAnswers: {},
    challengeAnswers: {},
    perception: { clarity: null, feedbackUtility: null, interest: null },
  };
}

export function loadSession(): SessionState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SessionState) : null;
  } catch {
    return null;
  }
}

export function saveSession(state: SessionState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function clearSession() {
  localStorage.removeItem(STORAGE_KEY);
}

export function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

