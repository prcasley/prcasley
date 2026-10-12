# Connect the waitlist (free, about 10 minutes)

Signups go to a Google Sheet you own. The sheet includes UTM columns, so you can see which post or ad produced each signup.

1. Create a Google Sheet called **OfficeCrate Waitlist**.
2. **Extensions → Apps Script**. Delete the starter code and paste in [`Code.gs`](Code.gs). Save.
3. **Deploy → New deployment → Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Approve the permissions prompt, then copy the **Web app URL** (`https://script.google.com/macros/s/.../exec`).
5. In `officecrate/index.html`, set `var WAITLIST_ENDPOINT = '<that URL>';`, then commit and push.
6. Test it: submit the form once and confirm a row shows up in the sheet.

**Alternative:** use a [Formspree](https://formspree.io) form endpoint as `WAITLIST_ENDPOINT`. The page handles both.

## Tag every link you share

Use links like `.../officecrate/?utm_source=tiktok&utm_campaign=reel_03_blazer`. Each signup row then shows which reel or ad produced it. That data feeds the CAC input in `roi.html`.
