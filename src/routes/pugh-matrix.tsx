import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, PageHeader } from "@/components/ui-kit";

const URL = "https://picklightly-decision-guide.lovable.app/pugh-matrix";

export const Route = createFileRoute("/pugh-matrix")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title: "Pugh Matrix: How to Use It for Everyday Decisions — Picklightly" },
      { name: "description", content: "A plain-language guide to the Pugh matrix (weighted decision matrix): pick criteria, weight them, score options, and choose — with a worked example." },
      { property: "og:title", content: "Pugh Matrix: A Simple Guide for Everyday Decisions" },
      { property: "og:description", content: "Learn the weighted scoring method behind the Pugh matrix and try it free in the Comparison Lab." },
      { property: "og:type", content: "article" },
      { property: "og:url", content: URL },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: URL }],
  }),
  component: Pugh,
});

const rows = [
  { c: "Rent", w: 5, a: 4, b: 2 },
  { c: "Commute", w: 4, a: 2, b: 5 },
  { c: "Natural light", w: 2, a: 5, b: 3 },
  { c: "Laundry in unit", w: 3, a: 3, b: 4 },
];
const total = (k: "a" | "b") => rows.reduce((t, r) => t + r.w * r[k], 0);

function Pugh() {
  return (
    <div>
      <PageHeader
        eyebrow="Guide"
        title="The Pugh matrix, made simple"
        intro="A Pugh matrix (also called a weighted decision matrix) compares options against the criteria you care about, so the choice rests on your priorities instead of whichever worry is loudest."
      />
      <article className="mx-auto max-w-3xl space-y-6 px-4 pb-20">
        <Card>
          <h2 className="text-2xl font-semibold">Where it comes from</h2>
          <p className="mt-2 text-muted-foreground">
            Engineer Stuart Pugh developed the method for comparing design concepts. The classic version scores each option as better, same, or worse than a baseline. The everyday version most people use today gives each criterion a weight and each option a score, then adds them up.
          </p>
        </Card>
        <Card>
          <h2 className="text-2xl font-semibold">How to use it in 4 steps</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-muted-foreground">
            <li><strong className="text-foreground">List your criteria.</strong> 3–6 things that actually matter. More than that and you're back to spiraling.</li>
            <li><strong className="text-foreground">Weight them.</strong> Rate each 1–5 for how much it matters to you.</li>
            <li><strong className="text-foreground">Score each option.</strong> Rate how well each option does on each criterion, 1–5.</li>
            <li><strong className="text-foreground">Multiply and add.</strong> Weight × score for every cell, then total per option. Highest total wins — unless it fails a deal-breaker.</li>
          </ol>
        </Card>
        <Card className="overflow-x-auto">
          <h2 className="text-2xl font-semibold">Example: two apartments</h2>
          <table className="mt-3 w-full text-sm">
            <thead>
              <tr className="text-left">
                <th className="p-2">Criterion</th><th className="p-2">Weight</th><th className="p-2">Apartment A</th><th className="p-2">Apartment B</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.c} className="border-t border-border">
                  <td className="p-2">{r.c}</td><td className="p-2">{r.w}</td>
                  <td className="p-2">{r.a} → {r.w * r.a}</td><td className="p-2">{r.b} → {r.w * r.b}</td>
                </tr>
              ))}
              <tr className="border-t border-border font-semibold">
                <td className="p-2">Total</td><td className="p-2" /><td className="p-2">{total("a")}</td><td className="p-2">{total("b")}</td>
              </tr>
            </tbody>
          </table>
          <p className="mt-3 text-muted-foreground">
            Apartment B edges ahead because the commute matters a lot to this person. If the totals are within a few points, both are good enough — pick one and move on.
          </p>
        </Card>
        <Card>
          <h2 className="text-2xl font-semibold">Tips so it doesn't become another spiral</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-muted-foreground">
            <li>Set the weights before you score, so you don't nudge numbers toward the option you already like.</li>
            <li>Mark true deal-breakers separately — a great total shouldn't hide a "no."</li>
            <li>If the result feels wrong, that's useful information: you may have a missing criterion.</li>
            <li>Save it for medium- and high-stakes choices. Dinner doesn't need a matrix.</li>
          </ul>
        </Card>
        <div className="text-center">
          <Link to="/compare" className="inline-block rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground">
            Try it in the Comparison Lab
          </Link>
        </div>
      </article>
    </div>
  );
}
