"use client";

import { useEffect, useState } from "react";
import { createSession, loadSession, saveSession } from "@/lib/storage";
import type { SessionState } from "@/types";

export function usePersistentSession() {
  const [state, setState] = useState<SessionState | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setState(loadSession() ?? createSession());
      setReady(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (ready && state) saveSession(state);
  }, [ready, state]);

  return { state, setState, ready };
}
