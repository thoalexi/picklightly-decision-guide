import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Btn, Card, PageHeader } from "@/components/ui-kit";

export const Route = createFileRoute("/filter")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title: "60-Second Decision Filter — Picklightly" },
      { name: "description", content: "Three quick questions to find out how much thought a decision really deserves." },
      { property: "og:title", content: "60-Second Decision Filter — Picklightly" },
      { property: "og:description", content: "Find out how much thought a decision really deserves." },
    ],
  }),
  component: Filter,
});

const qs = [
  "Can you easily undo or change this decision later?",
  "If it goes wrong, would the consequences be minor?",
  "Would more research realistically change what you pick?",
];

function Filter() {
  const [a, setA] = useState<boolean[]>([]);
  const done = a.length === qs.length;
  const quick = done && a[0] && a[1] && !a[2];
  const deep = done && !a[0] && !a[1];
  return (
    <div>
      <PageHeader eyebrow="Tool 1" title="The 60-Second Decision Filter" intro="Example: Which restaurant should we order from tonight?" />
      <div className="mx-auto max-w-xl px-4 pb-20">
        <Card className="p-8">
          {!done ? (
            <>
              <p className="text-sm text-muted-foreground">Question {a.length + 1} of {qs.length}</p>
              <h2 className="mt-2 text-2xl font-semibold">{qs[a.length]}</h2>
              <div className="mt-6 flex gap-3">
                <Btn onClick={() => setA([...a, true])}>Yes</Btn>
                <Btn variant="ghost" onClick={() => setA([...a, false])}>No</Btn>
              </div>
            </>
          ) : (
            <div className="animate-in fade-in">
              <h2 className="text-3xl font-semibold">
                {quick ? "Just pick. Seriously." : deep ? "This one deserves real thought." : "Give it a short, bounded look."}
              </h2>
              <p className="mt-3 text-muted-foreground">
                {quick
                  ? "It's reversible, low-stakes, and more research won't help. Choose the easier option or flip a coin, then move on."
                  : deep
                  ? "It's hard to undo and matters. Use the Comparison Lab to weigh options and write down your reasoning."
                  : "Set a 10-minute timer, define what 'good enough' looks like, and pick the first option that clears the bar."}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {quick && <Btn onClick={() => alert(Math.random() < 0.5 ? "Heads — go with option A" : "Tails — go with option B")}>Flip a coin</Btn>}
                {deep && <Link to="/compare" className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground">Comparison Lab →</Link>}
                {!quick && !deep && <Link to="/good-enough" className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground">Good-Enough Test →</Link>}
                <Btn variant="ghost" onClick={() => setA([])}>Start over</Btn>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
