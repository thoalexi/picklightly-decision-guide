# Make the Good-Enough Test understandable + category-specific

## Problem
The page jumps straight into empty input boxes with no explanation. A first-time visitor can't tell what "minimum bar" means or what happens at the end.

## Changes (one page: /good-enough)

1. **Category picker at the top** — tappable cards for decisions people commonly overthink:
   - Travel / hotels
   - House purchase
   - Apartment hunt
   - Car purchase
   - Job offer
   - Moving to a new city
   - Big purchase (laptop, phone, appliance)
   - Gift for someone
   - Wedding / event planning
   - Restaurant or dinner plans
   - "Something else" (generic prompts)

2. **Category-specific prompts and one-tap example chips**, e.g.:
   - Travel: "Under $150/night", "Walkable to downtown", "Rated 4+ stars"
   - House: "Within budget", "Under 45 min commute", "No major repairs"
   - Apartment: "Allows pets", "In-unit laundry", "Safe neighborhood"
   - Car: "Under $20k", "Under 80k miles", "Good safety rating"
   - Job offer: "Meets salary floor", "Work I won't dread", "Reasonable hours"
   - Moving: "Affordable rent", "Near people I know", "Decent job market"
   - Big purchase: "Within budget", "Meets my must-have feature", "Good reviews"
   - Gift: "Within budget", "Fits their taste", "Arrives in time"
   - Event: "Within budget", "Date works for key people", "Venue fits the group"
   - Restaurant: "Food everyone can eat", "Not too far", "Within budget"

3. **Plain-language intro** — "Stop comparing endless options. Set a few simple requirements, then take the first option that meets them all."

4. **Step-by-step flow**
   - Step 1: "What must be true for an option to be good enough?" (worded per category)
   - Step 2 appears after at least one requirement: "Now check one option — does it meet every requirement?"
   - "Try another option" hidden until an option has been checked once.

5. **Clear outcome messages**
   - All boxes ticked: "Book it. You're done." — further searching rarely helps.
   - Some unticked: "This one doesn't clear your bar — try the next option."

## Technical details
- Edit only `src/routes/good-enough.tsx`; reuse Card/Btn/Field from `src/components/ui-kit.tsx`.
- Category data is a static object in the route file. No new dependencies, no data changes.
