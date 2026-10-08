export type LogEntry = {
  id: string;
  date: string;
  decision: string;
  choice: string;
  reasoning: string;
  confidence: number;
  revisitIf: string;
  outcome: string;
};

const KEY = "picklightly-log";

export function loadLog(): LogEntry[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveLog(entries: LogEntry[]) {
  localStorage.setItem(KEY, JSON.stringify(entries));
}

export function addLogEntry(e: Omit<LogEntry, "id" | "date">) {
  const entries = loadLog();
  entries.unshift({ ...e, id: crypto.randomUUID(), date: new Date().toISOString() });
  saveLog(entries);
}
