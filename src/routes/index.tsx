import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/ui-kit";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Picklightly — You've thought about it enough" },
      { name: "description", content: "A practical decision toolkit for everyday overthinkers. Match your effort to the stakes and stop reopening decisions." },
      { property: "og:title", content: "Picklightly — You've thought about it enough" },
      { property: "og:description", content: "Match decision effort to decision stakes with the CLEAR method." },
    ],
  }),
  component: Home,
});

const clear = [
  ["C", "Classify", "Small and reversible, or worth deeper thought?"],
  ["L", "Limit", "Set a time boundary. Two good options are often enough."],
  ["E", "Evaluate", "Name your non-negotiables and compare what's left."],
  ["A", "Act", "Pick the next concrete step. Stop collecting info."],
  ["R", "Release", "Decide what would truly justify revisiting it."],
];

const routes = {
  low: {
    label: "Low stakes", hint: "Food, entertainment, small plans", title: "Quick Choice", time: "1–2 minutes",
    steps: ["Identify any real deal-breaker.", "If both options are fine, pick the easier one — or flip a coin.", "Move on unless meaningful new information appears."],
    to: "/filter" as const, cta: "Run the 60-Second Filter",
  },
  medium: {
    label: "Medium stakes", hint: "Purchases, subscriptions, weekend plans", title: "Good-Enough Pass", time: "5–10 minutes",
    steps: ["List 2–3 options max.", "Set a minimum bar for 'good enough'.", "Choose the first option that clears it."],
    to: "/good-enough" as const, cta: "Take the Good-Enough Test",
  },
  high: {
    label: "High stakes", hint: "Consequential or hard to reverse", title: "Full Comparison", time: "20–30 minutes",
    steps: ["Write your non-negotiables.", "Weight what matters and score each option.", "Log your reasoning and when you'd revisit."],
    to: "/compare" as const, cta: "Open the Comparison Lab",
  },
};

function Home() {
  const [stake, setStake] = useState<keyof typeof routes | null>(null);
  const r = stake ? routes[stake] : null;
  return (
    <div className="paper-texture">
      <section className="mx-auto max-w-3xl px-4 pt-20 pb-16 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">For everyday overthinkers</p>
        <h1 className="mt-4 text-5xl font-semibold leading-tight tracking-tight md:text-7xl">
          You've thought about it <em className="text-primary">enough.</em>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
          Make a reasonable decision, understand why you made it, and know when to stop reopening it.
        </p>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-16">
        <Card className="p-8">
          <h2 className="text-3xl font-semibold">The Decision Router</h2>
          <p className="mt-2 text-muted-foreground">How consequential or hard to reverse is your decision?</p>
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {(Object.keys(routes) as (keyof typeof routes)[]).map((k) => (
              <button key={k} onClick={() => setStake(k)}
                className={`rounded-xl border p-4 text-left transition ${stake === k ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:border-primary"}`}>
                <div className="font-display text-lg font-semibold">{routes[k].label}</div>
                <div className={`text-sm ${stake === k ? "opacity-80" : "text-muted-foreground"}`}>{routes[k].hint}</div>
              </button>
            ))}
          </div>
          {r && (
            <div className="mt-6 rounded-xl bg-secondary p-6 text-secondary-foreground animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="text-2xl font-semibold">{r.title}</h3>
                <span className="text-sm">{r.time}</span>
              </div>
              <ol className="mt-3 list-decimal space-y-1 pl-5">{r.steps.map((s) => <li key={s}>{s}</li>)}</ol>
              <Link to={r.to} className="mt-5 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90">{r.cta} →</Link>
            </div>
          )}
        </Card>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-20">
        <h2 className="text-center text-3xl font-semibold">The CLEAR Method</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-5">
          {clear.map(([l, t, d]) => (
            <Card key={l} className="text-center">
              <div className="font-display text-5xl font-bold text-primary">{l}</div>
              <div className="mt-2 font-semibold">{t}</div>
              <p className="mt-1 text-sm text-muted-foreground">{d}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
