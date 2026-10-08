import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Btn, Card, PageHeader } from "@/components/ui-kit";

export const Route = createFileRoute("/second-guessing")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title: "Second-Guessing Check — Picklightly" },
      { name: "description", content: "Tell genuinely new information apart from the same old worries." },
      { property: "og:title", content: "Second-Guessing Check — Picklightly" },
      { property: "og:description", content: "Know when a decision should actually be reconsidered." },
    ],
  }),
  component: Check,
});

const qs = [
  "Has something factually changed since you decided?",
  "Is this a worry you haven't already considered?",
  "Would this new information change the outcome meaningfully?",
  "Did you set a 'revisit if' condition — and has it been met?",
];

function Check() {
  const [a, setA] = useState<Record<number, boolean>>({});
  const done = Object.keys(a).length === qs.length;
  const yes = Object.values(a).filter(Boolean).length;
  return (
    <div>
      <PageHeader eyebrow="Tool 3" title="The Second-Guessing Check" intro="Example: Should I change the weekend plans I already agreed to?" />
      <div className="mx-auto max-w-xl space-y-4 px-4 pb-20">
        {qs.map((q, i) => (
          <Card key={i} className="flex items-center justify-between gap-4">
            <p className="font-medium">{q}</p>
            <div className="flex shrink-0 gap-2">
              <Btn variant={a[i] === true ? "primary" : "ghost"} onClick={() => setA({ ...a, [i]: true })}>Yes</Btn>
              <Btn variant={a[i] === false ? "primary" : "ghost"} onClick={() => setA({ ...a, [i]: false })}>No</Btn>
            </div>
          </Card>
        ))}
        {done && (
          <Card className="bg-secondary text-secondary-foreground animate-in fade-in">
            <h2 className="text-2xl font-semibold">{yes >= 3 ? "Reconsider — this is real new information." : yes >= 1 ? "Probably just noise. Hold steady." : "Same worry, new outfit. Let it go."}</h2>
            <p className="mt-2">{yes >= 3 ? "It's legitimate to reopen this decision. Keep it brief and bounded." : "Nothing meaningful has changed. Your original decision still stands."}</p>
          </Card>
        )}
      </div>
    </div>
  );
}
