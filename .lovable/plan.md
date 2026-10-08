# Make the Good-Enough Test understandable

## Problem
The page jumps straight into empty input boxes with no explanation of what to do or why. A first-time visitor can't tell what "minimum bar" means or what happens at the end.

## Changes (one page: /good-enough)

1. **Plain-language intro at the top** — one short paragraph: "Stop comparing endless options. Set a few simple requirements, then take the first option that meets them all. Good enough is good enough."

2. **Step-by-step flow instead of everything at once**
   - Step 1: "What must be true for an option to be good enough?" with friendly examples shown as tappable chips (e.g. "Under $100", "Rated 4+ stars", "Walkable to downtown") that fill the boxes.
   - Step 2 only appears after at least one requirement is entered: "Now check one option. Does it meet every requirement?"
   - The "Try another option" button is hidden until the user has checked an option once.

3. **Clear outcome messages**
   - All boxes ticked: a warm "Book it. You're done." card explaining that further searching rarely helps.
   - Some unticked: "This one doesn't clear your bar — try the next option."

4. **Small wording fixes** — rename "Option name" to "What are you checking?" and number the steps consistently.

## Technical details
- Edit only `src/routes/good-enough.tsx`; reuse the existing Card/Btn/Field components from `src/components/ui-kit.tsx`.
- No new dependencies, no data changes. State stays client-side as it is now.
