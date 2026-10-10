import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Btn, Card, Field, PageHeader } from "@/components/ui-kit";

export const Route = createFileRoute("/good-enough")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title: "Good-Enough Test — Picklightly" },
      { name: "description", content: "Pick a category, weight what matters, score your options, and take the one that comes out on top." },
      { property: "og:title", content: "Good-Enough Test — Picklightly" },
      { property: "og:description", content: "Stop hunting for the single best option." },
    ],
  }),
  component: GoodEnough,
});

type Category = { label: string; step1: string; examples: string[]; optionPlaceholder: string; doneVerb: string };

const categories: Record<string, Category> = {
  travel: { label: "Travel / hotels", step1: "What matters for a place to be good enough?", examples: ["Under $150/night", "Walkable to downtown", "Rated 4+ stars"], optionPlaceholder: "Which place? (e.g. Hotel Meridian)", doneVerb: "Book it" },
  house: { label: "House purchase", step1: "What matters for a house to be good enough?", examples: ["Within budget", "Under 45 min commute", "No major repairs"], optionPlaceholder: "Which house? (e.g. 42 Maple St)", doneVerb: "Make the offer" },
  apartment: { label: "Apartment hunt", step1: "What matters for an apartment to be good enough?", examples: ["Allows pets", "In-unit laundry", "Safe neighborhood"], optionPlaceholder: "Which apartment? (e.g. Unit 4B, Oakview)", doneVerb: "Apply for it" },
  car: { label: "Car purchase", step1: "What matters for a car to be good enough?", examples: ["Under $20k", "Under 80k miles", "Good safety rating"], optionPlaceholder: "Which car? (e.g. 2019 Honda CR-V)", doneVerb: "Buy it" },
  job: { label: "Job offer", step1: "What matters for a job to be good enough?", examples: ["Meets salary floor", "Work I won't dread", "Reasonable hours"], optionPlaceholder: "Which offer? (e.g. Acme, product manager)", doneVerb: "Accept it" },
  moving: { label: "Moving to a new city", step1: "What matters for a city to be good enough?", examples: ["Affordable rent", "Near people I know", "Decent job market"], optionPlaceholder: "Which city? (e.g. Austin)", doneVerb: "Pick it" },
  purchase: { label: "Big purchase", step1: "What matters for it to be good enough?", examples: ["Within budget", "Has my must-have feature", "Good reviews"], optionPlaceholder: "Which one? (e.g. the mid-range model)", doneVerb: "Buy it" },
  gift: { label: "Gift for someone", step1: "What matters for a gift to be good enough?", examples: ["Within budget", "Fits their taste", "Arrives in time"], optionPlaceholder: "Which gift? (e.g. the cookbook)", doneVerb: "Order it" },
  event: { label: "Wedding / event", step1: "What matters for the plan to be good enough?", examples: ["Within budget", "Date works for key people", "Venue fits the group"], optionPlaceholder: "Which option? (e.g. Riverside Barn, June 12)", doneVerb: "Lock it in" },
  restaurant: { label: "Restaurant / dinner", step1: "What matters for a restaurant to be good enough?", examples: ["Food everyone can eat", "Not too far", "Within budget"], optionPlaceholder: "Which restaurant? (e.g. Trattoria Lupa)", doneVerb: "Book the table" },
  other: { label: "Something else", step1: "What matters for an option to be good enough?", examples: ["Within budget", "Available when I need it", "Meets my main need"], optionPlaceholder: "What are you checking?", doneVerb: "Go with it" },
};

type Req = { name: string; weight: number };
type Option = { id: number; name: string; scores: Record<string, number> };

let nextOptionId = 1;
const freshOption = (): Option => ({ id: nextOptionId++, name: "", scores: {} });

function GoodEnough() {
  const [cat, setCat] = useState<string | null>(null);
  const [reqs, setReqs] = useState<Req[]>([]);
  const [draft, setDraft] = useState("");
  const [options, setOptions] = useState<Option[]>([]);

  const c = cat ? categories[cat] : null;

  const addReq = (text: string) => {
    const name = text.trim();
    if (!name || reqs.some((r) => r.name === name)) return;
    setReqs([...reqs, { name, weight: 3 }]);
    setDraft("");
  };

  const setScore = (oi: number, req: string, value: number) => {
    setOptions(options.map((o, i) => (i === oi ? { ...o, scores: { ...o.scores, [req]: value } } : o)));
  };

  const results = options.map((o) => {
    const scored = reqs.filter((r) => o.scores[r.name] != null);
    const complete = reqs.length > 0 && scored.length === reqs.length;
    const total = reqs.reduce((t, r) => t + r.weight * (o.scores[r.name] ?? 0), 0);
    const max = reqs.reduce((t, r) => t + r.weight * 5, 0) || 1;
    return { option: o, pct: Math.round((total / max) * 100), complete };
  });
  const ranked = results.filter((r) => r.complete).sort((a, b) => b.pct - a.pct);
  const winner = ranked[0];
  const runnerUp = ranked[1];
  const closeCall = winner && runnerUp && winner.pct - runnerUp.pct <= 5;

  return (
    <div>
      <PageHeader
        eyebrow="Tool 4"
        title="The Good-Enough Test"
        intro="Stop comparing endless options. Decide what matters, score each option 1–5, and take the one with the highest weighted score. Good enough is good enough."
      />
      <div className="mx-auto max-w-xl space-y-6 px-4 pb-20">
        <Card>
          <h2 className="text-xl font-semibold">What are you deciding?</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {Object.entries(categories).map(([k, v]) => (
              <button
                key={k}
                onClick={() => { setCat(k); setReqs([]); setOptions([freshOption()]); }}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${cat === k ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:border-primary"}`}
              >
                {v.label}
              </button>
            ))}
          </div>
        </Card>

        {c && (
          <Card className="space-y-3 animate-in fade-in">
            <h2 className="text-xl font-semibold">1. {c.step1}</h2>
            <p className="text-sm text-muted-foreground">Tap to add, or write your own. Then set how much each one matters (1 = nice to have, 5 = essential):</p>
            <div className="flex flex-wrap gap-2">
              {c.examples.filter((e) => !reqs.some((r) => r.name === e)).map((e) => (
                <button key={e} onClick={() => addReq(e)}
                  className="rounded-full bg-secondary px-3 py-1.5 text-sm text-secondary-foreground hover:bg-sage">
                  + {e}
                </button>
              ))}
            </div>
            {reqs.map((r, i) => (
              <div key={r.name} className="space-y-1 rounded-xl bg-muted px-3 py-2 text-sm">
                <div className="flex items-center justify-between">
                  <span>{r.name}</span>
                  <button onClick={() => setReqs(reqs.filter((_, j) => j !== i))} aria-label="Remove requirement" className="text-muted-foreground hover:text-destructive">×</button>
                </div>
                <label className="flex items-center gap-2 text-xs text-muted-foreground">
                  Importance
                  <input type="range" min={1} max={5} value={r.weight} aria-label={`Importance of ${r.name}`}
                    onChange={(e) => setReqs(reqs.map((x, j) => (j === i ? { ...x, weight: +e.target.value } : x)))}
                    className="accent-primary" />
                  <span className="font-semibold text-foreground">{r.weight}</span>
                </label>
              </div>
            ))}
            <div className="flex gap-2">
              <Field placeholder="Add your own requirement…" value={draft} onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addReq(draft)} />
              <Btn variant="soft" onClick={() => addReq(draft)}>Add</Btn>
            </div>
          </Card>
        )}

        {c && reqs.length > 0 && (
          <Card className="space-y-4 animate-in fade-in">
            <h2 className="text-xl font-semibold">2. Score each option 1–5 on every requirement</h2>
            <p className="text-sm text-muted-foreground">1 = falls short, 5 = nails it. Weights do the rest of the math for you.</p>
            {options.map((o, oi) => {
              const res = results[oi] ?? { pct: 0, complete: false };
              return (
                <div key={o.id} className={`space-y-3 rounded-xl border p-4 ${winner?.option.id === o.id ? "border-primary" : "border-border"}`}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-bold uppercase tracking-wide text-muted-foreground">Option {oi + 1}</span>
                    <div className="flex items-center gap-3">
                      {res.complete && <span className="text-sm font-semibold text-primary">{res.pct}%</span>}
                      {options.length > 1 && (
                        <button onClick={() => setOptions(options.filter((_, i) => i !== oi))} aria-label="Remove option" className="text-muted-foreground hover:text-destructive">×</button>
                      )}
                    </div>
                  </div>
                  <Field placeholder={c.optionPlaceholder} value={o.name} onChange={(e) => setOptions(options.map((x, i) => (i === oi ? { ...x, name: e.target.value } : x)))} />
                  {reqs.map((r) => (
                    <label key={r.name} className="flex items-center justify-between gap-3 text-sm">
                      <span>{r.name}</span>
                      <select aria-label={`Score for ${r.name}`} value={o.scores[r.name] ?? ""}
                        onChange={(e) => setScore(oi, r.name, +e.target.value)}
                        className="rounded-lg border border-input bg-background px-2 py-1">
                        <option value="" disabled>—</option>
                        {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </label>
                  ))}
                  {res.complete && (
                    <div className="h-2.5 rounded-full bg-muted">
                      <div className="h-2.5 rounded-full bg-primary transition-all" style={{ width: `${res.pct}%` }} />
                    </div>
                  )}
                </div>
              );
            })}
            {options.length < 5 && (
              <Btn variant="ghost" onClick={() => setOptions([...options, freshOption()])}>+ Add another option</Btn>
            )}
          </Card>
        )}

        {winner && c && (
          <Card className="bg-accent text-accent-foreground animate-in fade-in">
            <h2 className="text-2xl font-semibold">{winner.option.name || "This option"} wins at {winner.pct}%. {c.doneVerb}. You're done.</h2>
            <p className="mt-2">
              {closeCall
                ? `It's a close call — ${runnerUp.option.name || "your other option"} is right behind at ${runnerUp.pct}%. When scores are this close, both are good enough. Pick one and move on.`
                : "It scores highest on the things you said matter most. Looking further is unlikely to make you happier — just more tired."}
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
