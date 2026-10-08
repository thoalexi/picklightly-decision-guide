import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Btn, Card, PageHeader } from "@/components/ui-kit";

export const Route = createFileRoute("/compare")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title: "Comparison Lab — Picklightly" },
      { name: "description", content: "Compare 2–5 options with weighted priorities, deal-breakers, and automatic scores." },
      { property: "og:title", content: "Comparison Lab — Picklightly" },
      { property: "og:description", content: "Weighted, side-by-side option comparison." },
    ],
  }),
  component: Compare,
});

type Crit = { name: string; weight: number; must: boolean };

function Compare() {
  const [options, setOptions] = useState(["Option A", "Option B"]);
  const [crits, setCrits] = useState<Crit[]>([
    { name: "Price", weight: 3, must: false },
    { name: "Quality", weight: 4, must: false },
  ]);
  const [scores, setScores] = useState<Record<string, number>>({});
  const s = (o: number, c: number) => scores[`${o}-${c}`] ?? 3;

  const results = options.map((name, oi) => {
    const fails = crits.some((c, ci) => c.must && s(oi, ci) <= 2);
    const total = crits.reduce((t, c, ci) => t + c.weight * s(oi, ci), 0);
    const max = crits.reduce((t, c) => t + c.weight * 5, 0) || 1;
    return { name, pct: Math.round((total / max) * 100), fails };
  });
  const best = [...results].filter((r) => !r.fails).sort((a, b) => b.pct - a.pct)[0];

  return (
    <div>
      <PageHeader eyebrow="Tool 2" title="The Comparison Lab" intro="Score each option 1–5. Mark deal-breakers: anything scoring 2 or less on one is out." />
      <div className="mx-auto max-w-5xl space-y-6 px-4 pb-20">
        <Card className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="p-2 text-left">Priority</th>
                <th className="p-2">Weight</th>
                <th className="p-2">Must-have</th>
                {options.map((o, oi) => (
                  <th key={oi} className="p-2">
                    <input value={o} onChange={(e) => setOptions(options.map((x, i) => (i === oi ? e.target.value : x)))}
                      className="w-28 rounded-lg border border-input bg-background px-2 py-1 text-center font-semibold" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {crits.map((c, ci) => (
                <tr key={ci} className="border-t border-border">
                  <td className="p-2"><input value={c.name} onChange={(e) => setCrits(crits.map((x, i) => (i === ci ? { ...x, name: e.target.value } : x)))} className="w-32 rounded-lg border border-input bg-background px-2 py-1" /></td>
                  <td className="p-2 text-center"><input type="range" min={1} max={5} value={c.weight} onChange={(e) => setCrits(crits.map((x, i) => (i === ci ? { ...x, weight: +e.target.value } : x)))} className="accent-primary" /> {c.weight}</td>
                  <td className="p-2 text-center"><input type="checkbox" checked={c.must} onChange={(e) => setCrits(crits.map((x, i) => (i === ci ? { ...x, must: e.target.checked } : x)))} className="accent-primary" /></td>
                  {options.map((_, oi) => (
                    <td key={oi} className="p-2 text-center">
                      <select aria-label="Score for this option" value={s(oi, ci)} onChange={(e) => setScores({ ...scores, [`${oi}-${ci}`]: +e.target.value })} className="rounded-lg border border-input bg-background px-2 py-1">
                        {[1, 2, 3, 4, 5].map((n) => <option key={n}>{n}</option>)}
                      </select>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 flex flex-wrap gap-2">
            <Btn variant="soft" onClick={() => setCrits([...crits, { name: "New priority", weight: 3, must: false }])}>+ Priority</Btn>
            <Btn variant="soft" disabled={options.length >= 5} onClick={() => setOptions([...options, `Option ${String.fromCharCode(65 + options.length)}`])}>+ Option</Btn>
          </div>
        </Card>
        <Card>
          <h2 className="text-2xl font-semibold">Summary</h2>
          <div className="mt-4 space-y-3">
            {results.map((r) => (
              <div key={r.name}>
                <div className="flex justify-between text-sm"><span className="font-medium">{r.name}{r.fails && " — fails a must-have"}</span><span>{r.pct}%</span></div>
                <div className="mt-1 h-3 rounded-full bg-muted"><div className={`h-3 rounded-full transition-all ${r.fails ? "bg-destructive/50" : "bg-primary"}`} style={{ width: `${r.pct}%` }} /></div>
              </div>
            ))}
          </div>
          {best && <p className="mt-5 rounded-xl bg-accent p-4 text-accent-foreground">Leading choice: <strong>{best.name}</strong>. If the gap is small, both are good — pick one and move on.</p>}
        </Card>
      </div>
    </div>
  );
}
