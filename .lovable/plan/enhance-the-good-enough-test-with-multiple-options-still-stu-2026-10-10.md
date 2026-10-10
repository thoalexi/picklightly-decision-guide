# Enhance the Good-Enough Test with multiple options + Still Stuck copy

Two changes, both on existing pages with no design overhaul.

## 1. Good-Enough Test: check several options side by side

Today the tool only tracks one option at a time, so ticking boxes feels pointless — there's nothing to compare against. Keep the current look and flow (category pills → step 1 requirements → step 2 checking), but step 2 becomes a list of options:

- **"2. Now check your options — does each one meet every requirement?"**
- Each option gets its own card: a name field (with the category-specific placeholder, e.g. "Which apartment? (e.g. Unit 4B, Oakview)") and the same requirement checkboxes under it.
- An **+ Add another option** button appends a new option card (up to 5). Each option can be removed with an ×.
- Verdict logic, unchanged in spirit: as soon as one option has every requirement ticked, show the existing amber "…is good enough. [Book it / Apply it / Buy it]. You're done." card naming that option. Options that don't clear the bar show a small "doesn't clear your bar yet" note inline, so users can see at a glance which option is winning.
- Category switching resets everything, as today.

Technical: in `src/routes/good-enough.tsx` replace the single `opt` / `checks` / `checkedOnce` state with `options: { name: string; checks: boolean[] }[]`; derive `allChecked` per option; render option cards with `.map()`. Category data (`categories` record, examples, doneVerb) and all styling tokens stay exactly as they are. No backend changes.

## 2. Still Stuck section: consultation options

In the "Still stuck?" block on the homepage (`src/routes/index.tsx`), under the existing intro sentence, add:

- Two small pills: **Video consult** and **Text consult**.
- The line: "We can talk about your specific time, budget, motivation, and restrictions."

Form, styling, and where messages are saved stay unchanged.

## Verification

Fresh build log check, plus Playwright screenshots of both pages: the Good-Enough Test with two options added (one clearing the bar, one not) and the Still Stuck section at desktop and phone widths.
