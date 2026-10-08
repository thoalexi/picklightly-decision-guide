import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Area, Btn, Card, Field, PageHeader } from "@/components/ui-kit";
import { loadLog, saveLog } from "@/lib/decision-log";

export const Route = createFileRoute("/log")({
  staticData: { sitemap: false },
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

type Entry = {
  id: string;
  decision: string;
  choice: string;
  reasoning: string;
  confidence: number;
  revisit_if: string;
  outcome: string;
  created_at: string;
};

const empty = { decision: "", choice: "", reasoning: "", confidence: 3, revisitIf: "" };

function Log() {
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [f, setF] = useState(empty);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setChecking(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
      setChecking(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  // Load entries and, on first sign-in, copy any device-saved entries into the account.
  useEffect(() => {
    if (!user) return;
    (async () => {
      const local = loadLog();
      if (local.length > 0) {
        await supabase.from("decision_entries").insert(
          local.map((e) => ({
            user_id: user.id,
            decision: e.decision,
            choice: e.choice,
            reasoning: e.reasoning,
            confidence: e.confidence,
            revisit_if: e.revisitIf,
            outcome: e.outcome,
            created_at: e.date,
          })),
        );
        saveLog([]);
      }
      const { data } = await supabase
        .from("decision_entries")
        .select("*")
        .order("created_at", { ascending: false });
      setEntries(data ?? []);
    })();
  }, [user]);

  const submit = async () => {
    if (!f.decision.trim() || !user) return;
    setSaving(true);
    const { data, error } = await supabase
      .from("decision_entries")
      .insert({
        user_id: user.id,
        decision: f.decision,
        choice: f.choice,
        reasoning: f.reasoning,
        confidence: f.confidence,
        revisit_if: f.revisitIf,
      })
      .select()
      .single();
    setSaving(false);
    if (!error && data) {
      setEntries([data, ...entries]);
      setF(empty);
    }
  };

  const setOutcome = async (id: string, outcome: string) => {
    setEntries(entries.map((e) => (e.id === id ? { ...e, outcome } : e)));
    await supabase.from("decision_entries").update({ outcome }).eq("id", id);
  };

  const remove = async (id: string) => {
    setEntries(entries.filter((e) => e.id !== id));
    await supabase.from("decision_entries").delete().eq("id", id);
  };

  if (checking) {
    return <div className="py-24 text-center text-muted-foreground">Loading…</div>;
  }

  if (!user) {
    return (
      <div>
        <PageHeader
          eyebrow="Tool 5"
          title="The Decision Log"
          intro="Most decisions turn out fine without perfect certainty. Here's your proof."
        />
        <Card className="mx-auto max-w-md text-center">
          <h2 className="text-xl font-semibold">Sign in to keep your log</h2>
          <p className="mt-2 text-muted-foreground">
            Your decision log saves to your account, so it's there on any device — and only you can see it.
          </p>
          <Link to="/auth">
            <Btn className="mt-5">Sign in or create an account</Btn>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        eyebrow="Tool 5"
        title="The Decision Log"
        intro="Most decisions turn out fine without perfect certainty. Here's your proof. Saved to your account."
      />
      <div className="mx-auto grid max-w-5xl gap-6 px-4 pb-20 md:grid-cols-[1fr_1.2fr]">
        <Card className="h-fit space-y-3">
          <h2 className="text-xl font-semibold">New entry</h2>
          <Field label="Decision" value={f.decision} onChange={(e) => setF({ ...f, decision: e.target.value })} placeholder="Which headphones to buy" />
          <Field label="What I chose" value={f.choice} onChange={(e) => setF({ ...f, choice: e.target.value })} />
          <Area label="Why" value={f.reasoning} onChange={(e) => setF({ ...f, reasoning: e.target.value })} />
          <label className="block text-sm font-medium">
            Confidence: {f.confidence}/5
            <input type="range" min={1} max={5} value={f.confidence} onChange={(e) => setF({ ...f, confidence: +e.target.value })} className="mt-1 w-full accent-primary" />
          </label>
          <Field label="I'll revisit only if…" value={f.revisitIf} onChange={(e) => setF({ ...f, revisitIf: e.target.value })} />
          <Btn onClick={submit} disabled={saving || !f.decision.trim()}>
            {saving ? "Saving…" : "Save decision"}
          </Btn>
        </Card>
        <div className="space-y-4">
          {entries.length === 0 && <Card className="text-center text-muted-foreground">No decisions logged yet.</Card>}
          {entries.map((e) => (
            <Card key={e.id}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(e.created_at).toLocaleDateString()} · confidence {e.confidence}/5
                  </p>
                  <h3 className="text-xl font-semibold">{e.decision}</h3>
                </div>
                <button onClick={() => remove(e.id)} className="text-sm text-muted-foreground hover:text-destructive">
                  Delete
                </button>
              </div>
              {e.choice && <p className="mt-2"><strong>Chose:</strong> {e.choice}</p>}
              {e.reasoning && <p className="mt-1 text-sm text-muted-foreground">{e.reasoning}</p>}
              {e.revisit_if && <p className="mt-1 text-sm"><strong>Revisit if:</strong> {e.revisit_if}</p>}
              <input
                defaultValue={e.outcome}
                onBlur={(ev) => setOutcome(e.id, ev.target.value)}
                placeholder="How did it turn out?"
                className="mt-3 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
              />
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
