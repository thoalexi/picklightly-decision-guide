import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Btn, Card, Field } from "@/components/ui-kit";

export const Route = createFileRoute("/auth")({
  staticData: { sitemap: false },
  head: () => ({
    meta: [
      { title: "Sign in — Picklightly" },
      { name: "description", content: "Sign in to Picklightly to save your decision log to your account." },
      { property: "og:title", content: "Sign in — Picklightly" },
      { property: "og:description", content: "Save your decision log to your account." },
    ],
  }),
  component: Auth,
});

function Auth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/log", replace: true });
    });
  }, [navigate]);

  const submit = async () => {
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        if (!data.session) {
          setMessage("Check your email to confirm your account, then sign in.");
        } else {
          navigate({ to: "/log" });
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/log" });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const google = async () => {
    setError(null);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: `${window.location.origin}/auth`,
      });
      if (result.error) {
        console.error("Google sign-in error", result.error);
        setError(`Google sign-in didn't work: ${result.error.message ?? "please try again."}`);
        return;
      }
      if (result.redirected) return;
      navigate({ to: "/log", replace: true });
    } catch (e) {
      console.error("Google sign-in error", e);
      setError("Google sign-in didn't work. Please try again.");
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="text-center">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Your account</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">
          {mode === "signin" ? "Sign in to Picklightly" : "Create your Picklightly account"}
        </h1>
        <p className="mt-3 text-muted-foreground">
          Sign in to save your decision log and pick it up on any device.
        </p>
      </div>
      <Card className="mt-8 space-y-4">
        <Btn variant="ghost" className="w-full" onClick={google} type="button">
          Continue with Google
        </Btn>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" /> or with email <span className="h-px flex-1 bg-border" />
        </div>
        <Field label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        <Field label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
        {error && <p className="text-sm text-destructive">{error}</p>}
        {message && <p className="text-sm text-primary">{message}</p>}
        <Btn className="w-full" onClick={submit} disabled={busy || !email.trim() || password.length < 6}>
          {busy ? "One moment…" : mode === "signin" ? "Sign in" : "Sign up"}
        </Btn>
        <p className="text-center text-sm text-muted-foreground">
          {mode === "signin" ? "New here? " : "Already have an account? "}
          <button
            type="button"
            className="font-medium text-primary underline-offset-2 hover:underline"
            onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(null); setMessage(null); }}
          >
            {mode === "signin" ? "Create an account" : "Sign in"}
          </button>
        </p>
      </Card>
    </div>
  );
}
