# Security

**Reporting:** to report a vulnerability in the OfficeCrate site, open a GitHub issue that doesn't include exploit details and ask for a private contact, or use GitHub's "Report a vulnerability" button if it's enabled.

## How the site is protected
- **Static hosting:** it's static HTML on GitHub Pages. There is no server, database, or login to attack, and HTTPS is enforced by GitHub.
- **Content-Security-Policy:** every page carries one. Scripts load only from this site, and network calls go only to the waitlist endpoint.
- **Waitlist endpoint (Google Apps Script):**
  - It can only append rows; it can't read them back.
  - It validates input and uses an allow-list for dropdown values.
  - It rate-limits submissions, ignores duplicate emails, and catches bots with a honeypot field.
  - It neutralizes formula injection.
  - See `officecrate/waitlist/README.md`.
- **Secrets:** none are stored in this repo.

## Owner checklist (GitHub settings)
- [ ] Turn on two-factor authentication for the GitHub account.
- [ ] Settings → Pages → check **Enforce HTTPS**.
- [ ] Settings → Branches → add a branch protection rule on `main` that requires a pull request. This stops any AI tool or token from pushing straight to the live site.
- [ ] Settings → Code security → turn on **Secret scanning** and **Push protection**. Both are free for public repos.
- [ ] Give AI tools the least access possible: one repo, and pull requests only where the tool supports it.
