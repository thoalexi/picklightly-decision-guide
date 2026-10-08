# Add login so the Decision Log saves to your account

## Goal
Today the Decision Log only saves on the device (browser storage), so entries are lost on another device or after clearing the browser. We'll add sign-in so each person's log is saved to their account and follows them anywhere.

## What you'll get
- A new **Sign in** page with **email + password** and **Continue with Google**.
- A **Sign in / Account** button in the header that shows when you're signed in, with a sign-out option.
- The **Decision Log** page asks you to sign in before using it. All other tools (Filter, Comparison Lab, Second-Guessing, Good-Enough) stay open to everyone — no login needed.
- Once signed in, your log entries save to your account automatically and load on any device.
- If you already have entries saved on this device, they'll be **copied into your account** the first time you sign in, so nothing is lost.

## How it works (technical)
1. **Enable Lovable Cloud** — adds the built-in database and login system (no external accounts needed).
2. **Turn on email/password and Google sign-in** in the Cloud settings.
3. **Database:** a `decision_entries` table linked to each user, protected by row-level security so people can only ever see their own entries.
4. **Auth page:** a public `/auth` route with email/password and Google sign-in; after signing in you're sent back to the Decision Log.
5. **Log page update:** the Decision Log moves from browser storage to the database. Signed-out visitors see a friendly "Sign in to keep your log" prompt; signed-in users get the same form and list as today, now synced.
6. **Header:** shows "Sign in" when logged out, and your account with a sign-out option when logged in.

## Notes
- No user profiles or extra data collected — login exists only to save the log.
- First Google sign-in may need the published app URL; it works fully once published.
