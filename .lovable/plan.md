# Make the Good-Enough Test understandable + category-specific

## Problem
The page jumps straight into empty input boxes with no explanation. A first-time visitor can't tell what "minimum bar" means or what happens at the end.

## Changes (one page: /good-enough)

1. **Category picker at the top** — tappable cards: Travel, House purchase, Apartment hunt, Car purchase, plus a "Something else" option. Picking one tailors everything below.

2. **Category-specific prompts and examples**, e.g.:
   - Travel: "Under $150/night", "Walkable to downtown", "Rated 4+ stars"
   - House purchase: "Within budget", "Under 45 min commute", "No major repairs needed"
   - Apartment hunt: "Allows pets", "In-unit laundry", "Safe neighborhood"
   - Car purchase: "Under $20k", "Under 80k miles", "Good safety rating"
   - Examples appear as one-tap chips that fill the requirement boxes.

3. **Plain-language intro** — one short paragraph: "Stop comparing endless options. Set a few simple requirements, then take the first option that meets them all."

4. **Step-by-step flow**
   - Step 1: "What must be true for an option to be good enough?" (worded per category)
   - Step 2 appears after at least one requirement: "Now check one option — does it meet every requirement?"
   - "Try another option" hidden until an option has been checked once.

5. **Clear outcome messages**
   - All boxes ticked: "Book it. You're done." — explaining further searching rarely helps.
   - Some unticked: "This one doesn't clear your bar — try the next option."

## Technical details
- Edit only `src/routes/good-enough.tsx`; reuse Card/Btn/Field from `src/components/ui-kit.tsx`.
- Category data is a small static object in the route file. No new dependencies, no data changes.
