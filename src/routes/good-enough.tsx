import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Btn, Card, Field, PageHeader } from "@/components/ui-kit";

export const Route = createFileRoute("/good-enough")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title: "Good-Enough Test — Picklightly" },
      { name: "description", content: "Pick a category, set your minimum bar, and take the first option that clears it." },
      { property: "og:title", content: "Good-Enough Test — Picklightly" },
      { property: "og:description", content: "Stop hunting for the single best option." },
    ],
  }),
  component: GoodEnough,
});

type Category = { label: string; step1: string; examples: string[]; optionPlaceholder: string; doneVerb: string };

const categories: Record<string, Category> = {
  travel: { label: "Travel / hotels", step1: "What must be true for a place to be good enough?", examples: ["Under $150/night", "Walkable to downtown", "Rated 4+ stars"], optionPlaceholder: "Which place? (e.g. Hotel Meridian)", doneVerb: "Book it" },
  house: { label: "House purchase", step1: "What must be true for a house to be good enough?", examples: ["Within budget", "Under 45 min commute", "No major repairs"], optionPlaceholder: "Which house? (e.g. 42 Maple St)", doneVerb: "Make the offer" },
  apartment: { label: "Apartment hunt", step1: "What must be true for an apartment to be good enough?", examples: ["Allows pets", "In-unit laundry", "Safe neighborhood"], optionPlaceholder: "Which apartment? (e.g. Unit 4B, Oakview)", doneVerb: "Apply for it" },
  car: { label: "Car purchase", step1: "What must be true for a car to be good enough?", examples: ["Under $20k", "Under 80k miles", "Good safety rating"], optionPlaceholder: "Which car? (e.g. 2019 Honda CR-V)", doneVerb: "Buy it" },
  job: { label: "Job offer", step1: "What must be true for a job to be good enough?", examples: ["Meets salary floor", "Work I won't dread", "Reasonable hours"], optionPlaceholder: "Which offer? (e.g. Acme, product manager)", doneVerb: "Accept it" },
  moving: { label: "Moving to a new city", step1: "What must be true for a city to be good enough?", examples: ["Affordable rent", "Near people I know", "Decent job market"], optionPlaceholder: "Which city? (e.g. Austin)", doneVerb: "Pick it" },
  purchase: { label: "Big purchase", step1: "What must be true for it to be good enough?", examples: ["Within budget", "Has my must-have feature", "Good reviews"], optionPlaceholder: "Which one? (e.g. the mid-range model)", doneVerb: "Buy it" },
  gift: { label: "Gift for someone", step1: "What must be true for a gift to be good enough?", examples: ["Within budget", "Fits their taste", "Arrives in time"], optionPlaceholder: "Which gift? (e.g. the cookbook)", doneVerb: "Order it" },
  event: { label: "Wedding / event", step1: "What must be true for the plan to be good enough?", examples: ["Within budget", "Date works for key people", "Venue fits the group"], optionPlaceholder: "Which option? (e.g. Riverside Barn, June 12)", doneVerb: "Lock it in" },
  restaurant: { label: "Restaurant / dinner", step1: "What must be true for a restaurant to be good enough?", examples: ["Food everyone can eat", "Not too far", "Within budget"], optionPlaceholder: "Which restaurant? (e.g. Trattoria Lupa)", doneVerb: "Book the table" },
  other: { label: "Something else", step1: "What must be true for an option to be good enough?", examples: ["Within budget", "Available when I need it", "Meets my main need"], optionPlaceholder: "What are you checking?", doneVerb: "Go with it" },
};

type Option = { id: number; name: string; checks: Record<string, boolean> };

let nextOptionId = 1;
const freshOption = (): Option => ({ id: nextOptionId++, name: "", checks: {} });

function GoodEnough() {
  const [cat, setCat] = useState<string | null>(null);
  const [reqs, setReqs] = useState<string[]>([]);
  const [draft, setDraft] = useState("");
  const [options, setOptions] = useState<Option[]>([]);

  const c = cat ? categories[cat] : null;
  const active = reqs.filter((r) => r.trim());
  const clearsBar = (o: Option) => active.length > 0 && active.every((r) => o.checks[r]);
  const winner = options.find(clearsBar);

  const addReq = (text: string) => {
    if (!text.trim() || reqs.includes(text.trim())) return;
    setReqs([...reqs, text.trim()]);
    setDraft("");
  };

  const toggleCheck = (oi: number, req: string) => {
    setOptions(options.map((o, i) => {
      if (i !== oi) return o;
      const checks = { ...o.checks, [req]: !o.checks[req] };
      return { ...o, checks };
    }));
  };

  return (
    <div>
      <PageHeader
        eyebrow="Tool 4"
        title="The Good-Enough Test"
        intro="Stop comparing endless options. Set a few simple requirements, then take the first option that meets them all. Good enough is good enough."
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
            <p className="text-sm text-muted-foreground">Tap to add, or write your own:</p>
            <div className="flex flex-wrap gap-2">
              {c.examples.filter((e) => !reqs.includes(e)).map((e) => (
                <button key={e} onClick={() => addReq(e)}
                  className="rounded-full bg-secondary px-3 py-1.5 text-sm text-secondary-foreground hover:bg-sage">
                  + {e}
                </button>
              ))}
            </div>
            {reqs.map((r, i) => (
              <div key={i} className="flex items-center justify-between rounded-xl bg-muted px-3 py-2 text-sm">
                {r}
                <button onClick={() => setReqs(reqs.filter((_, j) => j !== i))} aria-label="Remove requirement" className="text-muted-foreground hover:text-destructive">×</button>
              </div>
            ))}
            <div className="flex gap-2">
              <Field placeholder="Add your own requirement…" value={draft} onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addReq(draft)} />
              <Btn variant="soft" onClick={() => addReq(draft)}>Add</Btn>
            </div>
          </Card>
        )}

        {c && active.length > 0 && (
          <Card className="space-y-4 animate-in fade-in">
            <h2 className="text-xl font-semibold">2. Now check your options — does each one meet every requirement?</h2>
            {options.map((o, oi) => {
              const done = clearsBar(o);
              const someChecked = active.some((r) => o.checks[r]);
              return (
                <div key={o.id} className={`space-y-3 rounded-xl border p-4 ${done ? "border-primary" : "border-border"}`}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-bold uppercase tracking-wide text-muted-foreground">Option {oi + 1}</span>
                    {options.length > 1 && (
                      <button onClick={() => setOptions(options.filter((_, i) => i !== oi))} aria-label="Remove option" className="text-muted-foreground hover:text-destructive">×</button>
                    )}
                  </div>
                  <Field placeholder={c.optionPlaceholder} value={o.name} onChange={(e) => setOptions(options.map((x, i) => (i === oi ? { ...x, name: e.target.value } : x)))} />
                  {active.map((r) => (
                    <label key={r} className="flex items-center gap-3">
                      <input type="checkbox" className="h-5 w-5 accent-primary" checked={!!o.checks[r]}
                        onChange={() => toggleCheck(oi, r)} />
                      {r}
                    </label>
                  ))}
                  {someChecked && !done && (
                    <p className="text-sm text-muted-foreground">Doesn't clear your bar yet — tick every requirement, or move on to the next option.</p>
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
            <h2 className="text-2xl font-semibold">{winner.name || "This option"} is good enough. {c.doneVerb}. You're done.</h2>
            <p className="mt-2">It clears every bar you set. Looking further is unlikely to make you happier — just more tired.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
