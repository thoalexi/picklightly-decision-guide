CREATE TABLE public.decision_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  decision text NOT NULL,
  choice text NOT NULL DEFAULT '',
  reasoning text NOT NULL DEFAULT '',
  confidence integer NOT NULL DEFAULT 3,
  revisit_if text NOT NULL DEFAULT '',
  outcome text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.decision_entries TO authenticated;
GRANT ALL ON public.decision_entries TO service_role;

ALTER TABLE public.decision_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own entries"
  ON public.decision_entries FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own entries"
  ON public.decision_entries FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own entries"
  ON public.decision_entries FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own entries"
  ON public.decision_entries FOR DELETE TO authenticated
  USING (auth.uid() = user_id);