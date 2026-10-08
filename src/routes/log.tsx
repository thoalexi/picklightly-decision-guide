import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Area, Btn, Card, Field, PageHeader } from "@/components/ui-kit";
import { addLogEntry, loadLog, saveLog, type LogEntry } from "@/lib/decision-log";

export const Route = createFileRoute("/log")({
  head: () => ({
    meta: [
      { title: "Decision Log — Picklightly" },
      { name: "description", content: "Record decisions, your reasoning, confidence, and what happened afterward." },
      { property: "og:title", content: "Decision Log — Picklightly" },
      { property: "og:description", content: "Look back at decisions that turned out fine." },
    ],
  }),
  component: Log,
});

const empty = { decision: "", choice: "", reasoning: "", confidence: 3, revisitIf: "", outcome: "" };

function Log() {
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [f, setF] = useState(empty);
  useEffect(() => setEntries(loadLog()), []);

  const submit = () => {
    if (!f.decision.trim()) return;
    addLogEntry(f);
    setEntries(loadLog());
    setF(empty);
  };
  const setOutcome = (id: string, outcome: string) => {
    const next = entries.map((e) => (e.id === id ? { ...e, outcome } : e));
    setEntries(next); saveLog(next);
  };
  const remove = (id: string) => { const next = entries.filter((e) => e.id !== id); setEntries(next); saveLog(next); };

  return (
    <div>
      <PageHeader eyebrow="Tool 5" title="The Decision Log" intro="Most decisions turn out fine without perfect certainty. Here's your proof. Saved on this device." />
      <div className="mx-auto grid max-w-5xl gap-6 px-4 pb-20 md:grid-cols-[1fr_1.2fr]">
        <Card className="h-fit space-y-3">
          <h2 className="text-xl font-semibold">New entry</h2>
          <Field label="Decision" value={f.decision} onChange={(e) => setF({ ...f, decision: e.target.value })} placeholder="Which headphones to buy" />
          <Field label="What I chose" value={f.choice} onChange={(e) => setF({ ...f, choice: e.target.value })} />
          <Area label="Why" value={f.reasoning} onChange={(e) => setF({ ...f, reasoning: e.target.value })} />
          <label className="block text-sm font-medium">Confidence: {f.confidence}/5
            <input type="range" min={1} max={5} value={f.confidence} onChange={(e) => setF({ ...f, confidence: +e.target.value })} className="mt-1 w-full accent-primary" />
          </label>
          <Field label="I'll revisit only if…" value={f.revisitIf} onChange={(e) => setF({ ...f, revisitIf: e.target.value })} />
          <Btn onClick={submit} disabled={!f.decision.trim()}>Save decision</Btn>
        </Card>
        <div className="space-y-4">
          {entries.length === 0 && <Card className="text-center text-muted-foreground">No decisions logged yet.</Card>}
          {entries.map((e) => (
            <Card key={e.id}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs text-muted-foreground">{new Date(e.date).toLocaleDateString()} · confidence {e.confidence}/5</p>
                  <h3 className="text-xl font-semibold">{e.decision}</h3>
                </div>
                <button onClick={() => remove(e.id)} className="text-sm text-muted-foreground hover:text-destructive">Delete</button>
              </div>
              {e.choice && <p className="mt-2"><strong>Chose:</strong> {e.choice}</p>}
              {e.reasoning && <p className="mt-1 text-sm text-muted-foreground">{e.reasoning}</p>}
              {e.revisitIf && <p className="mt-1 text-sm"><strong>Revisit if:</strong> {e.revisitIf}</p>}
              <input defaultValue={e.outcome} onBlur={(ev) => setOutcome(e.id, ev.target.value)} placeholder="How did it turn out?"
                className="mt-3 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm" />
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
