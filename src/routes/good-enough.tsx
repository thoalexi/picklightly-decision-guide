import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Btn, Card, Field, PageHeader } from "@/components/ui-kit";

export const Route = createFileRoute("/good-enough")({
  head: () => ({
    meta: [
      { title: "Good-Enough Test — Picklightly" },
      { name: "description", content: "Set your minimum bar, then pick the first option that clears it." },
      { property: "og:title", content: "Good-Enough Test — Picklightly" },
      { property: "og:description", content: "Stop hunting for the single best option." },
    ],
  }),
  component: GoodEnough,
});

function GoodEnough() {
  const [reqs, setReqs] = useState(["", "", ""]);
  const [opt, setOpt] = useState("");
  const [checks, setChecks] = useState<boolean[]>([]);
  const active = reqs.filter((r) => r.trim());
  const passed = active.length > 0 && checks.length === active.length && checks.every(Boolean);
  return (
    <div>
      <PageHeader eyebrow="Tool 4" title="The Good-Enough Test" intro="Example: Do I really need to compare eight more hotels?" />
      <div className="mx-auto max-w-xl space-y-6 px-4 pb-20">
        <Card className="space-y-3">
          <h2 className="text-xl font-semibold">1. What's your minimum bar?</h2>
          {reqs.map((r, i) => (
            <Field key={i} placeholder={["e.g. Under $150/night", "e.g. Walkable to downtown", "e.g. Rated 4+ stars"][i]} value={r}
              onChange={(e) => { setReqs(reqs.map((x, j) => (j === i ? e.target.value : x))); setChecks([]); }} />
          ))}
        </Card>
        {active.length > 0 && (
          <Card className="space-y-3">
            <h2 className="text-xl font-semibold">2. Check an option</h2>
            <Field placeholder="Option name" value={opt} onChange={(e) => setOpt(e.target.value)} />
            {active.map((r, i) => (
              <label key={i} className="flex items-center gap-3">
                <input type="checkbox" className="h-5 w-5 accent-primary" checked={!!checks[i]}
                  onChange={(e) => { const c = [...checks]; c[i] = e.target.checked; for (let k = 0; k < active.length; k++) c[k] = !!c[k]; setChecks(c); }} />
                {r}
              </label>
            ))}
            <Btn variant="ghost" onClick={() => { setOpt(""); setChecks([]); }}>Try another option</Btn>
          </Card>
        )}
        {passed && (
          <Card className="bg-accent text-accent-foreground animate-in fade-in">
            <h2 className="text-2xl font-semibold">{opt || "This option"} is good enough. Book it.</h2>
            <p className="mt-2">It clears every bar you set. Looking further is unlikely to make you happier — just more tired.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
