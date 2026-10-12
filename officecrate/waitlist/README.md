# Connect the waitlist (free, about 10 minutes)

Signups go to a Google Sheet you own. The sheet includes UTM columns, so you can see which post or ad produced each signup.

1. Create a Google Sheet called **OfficeCrate Waitlist**.
2. **Extensions → Apps Script**. Delete the starter code and paste in [`Code.gs`](Code.gs). Save.
3. **Deploy → New deployment → Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Approve the permissions prompt, then copy the **Web app URL** (`https://script.google.com/macros/s/.../exec`).
5. In `officecrate/js/waitlist.js`, set `var WAITLIST_ENDPOINT = '<that URL>';` (no other code changes needed), then commit and push.
6. Test it: submit the form once and confirm a row shows up in the sheet.

**Alternative:** use a [Formspree](https://formspree.io) form endpoint as `WAITLIST_ENDPOINT`. The page handles both.

## Tag every link you share

Use links like `.../officecrate/?utm_source=tiktok&utm_campaign=reel_03_blazer`. Each signup row then shows which reel or ad produced it. That data feeds the CAC input in `roi.html`.

## Security notes

- The Web app URL is public by design. Anyone can POST to it, but it can only append rows. It never reads data back, and the Sheet itself stays private.
- `Code.gs` rejects bad input server-side:
  - Fields: invalid emails, unknown dropdown values, missing consent, honeypot hits, and over-long fields are rejected.
  - Duplicates: an email that is already on the list is ignored.
  - Rate limit: after 30 signups in 10 minutes, new submissions are refused.
  - Formula injection: cells that start with `= + - @` are neutralized.
- If spam gets through anyway, use **Deploy → Manage deployments → Archive**, then create a new deployment. That generates a new URL; paste it into `js/waitlist.js`.
- Never share the Sheet publicly, and never commit its URL or ID to this repo.
