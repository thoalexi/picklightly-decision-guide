# Add consultation options to the "Still stuck?" section

## What changes

Under the existing "Still stuck?" heading and intro on the homepage, add two short lines:

1. A note that video or text consultation is available — shown as two small pills: **Video consult** and **Text consult**.
2. The sentence: "We can talk about your specific time, budget, motivation, and restrictions."

The rest of the section stays as is: the intro about 1:1 help from a Dr. of Psychology, the name/email/decision form, and the confirmation message after sending.

## How it will read

```text
Still stuck?

Get 1:1 help with your decision from a Dr. of Psychology with experience in
efficiency, optimization, bandwidth, and ADHD.

[ Video consult ]  [ Text consult ]

We can talk about your specific time, budget, motivation, and restrictions.

        [ Your name ]  [ Email ]  [ What decision... ]
                    ( Get in touch )
```

## Technical details

- One file: `src/routes/index.tsx`, inside the `StillStuck` component's heading block (the `<div className="text-center">` above the form).
- New markup: a centered flex row of two pills using existing tokens (`rounded-full border border-border bg-secondary px-3 py-1 text-sm text-secondary-foreground`), then a `text-muted-foreground` sentence below it. Wraps cleanly on narrow screens.
- No new colors, fonts, components, tables, or routes. No change to form fields, validation, or where messages are saved.
- Verify with a fresh build log read and screenshots of the section at desktop and phone widths.
