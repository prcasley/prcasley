# Instructions for AI assistants (ChatGPT/Codex, Meta AI, Claude, others)

This repo holds Pratiyush Casley's GitHub profile (`README.md`) and the OfficeCrate site (`officecrate/`), served on GitHub Pages from `main`. Anything merged to `main` is live.

## Workflow
- Work on a branch and open a pull request. Never push directly to `main`.
- Keep changes small and say what changed and why in the PR description.
- Don't edit `README.md` unless asked; it's the GitHub profile page.

## Security rules (do not break these)
- **No secrets in the repo.** No API keys, tokens, passwords, Google Sheet URLs/IDs, or customer data. The site is public, and so is the git history.
- **Keep the Content-Security-Policy `<meta>` tag** on every page. Put JavaScript in `officecrate/js/*.js`: no inline `<script>` blocks and no `onclick=` attributes. If you add a third-party domain, add it to the CSP of that page and explain why in the PR.
- **No third-party trackers or analytics scripts** without the owner's approval. UTM capture in `js/waitlist.js` is the analytics.
- **Never insert user input with `innerHTML`.** Use `textContent`.
- **Waitlist backend:** `officecrate/waitlist/Code.gs` validates every field server-side. If you add a form field, add it to `FIELDS` (and `ALLOWED` if it's a dropdown) in `Code.gs` and to the privacy policy.

## Business rules (legal and trust)
- No pre-checked boxes for recurring billing or marketing email. Recurring purchases must be explicit opt-in, with renewal terms stated and online cancellation.
- Don't promise discounts, delivery times, or features that aren't in `officecrate/PLAN.md`. Check margin impact in `officecrate/roi.html` first.
- Numbers on the site and in the plan must be labeled as assumptions unless sourced.

## Check before opening a PR
- Open `officecrate/index.html`, `roi.html`, and `privacy.html` in a browser. There should be no console errors and no CSP violations, and pages should work at 390 px wide.
