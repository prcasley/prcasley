# OfficeCrate: 60-day launch plan

**Goal:** within 60 days, show that at least 5 people will pay for an OfficeCrate box at a price that leaves room to grow.
**Budget:** start with $1,000. Release the other $500 only if the day-30 checkpoint passes.

| File | What it is |
|---|---|
| [`index.html`](index.html) | Landing page with a qualifying waitlist, UTM tracking, and honest offer copy |
| [`roi.html`](roi.html) | Interactive budget, unit-economics, and ROI model |
| [`waitlist/`](waitlist/) | Free Google Sheets backend for the waitlist (10-minute setup) |
| [`privacy.html`](privacy.html) | Privacy policy (template; have it reviewed) |

## What changed on the landing page, and why

| Before | After | Why |
|---|---|---|
| Form showed a fake success message | Posts to a Google Sheet or Formspree, and says plainly when it isn't connected yet | Leads were being thrown away |
| Name + email only | Adds dress code, box choice, buying timing, consent, and UTM source | Qualified leads, plus cost-per-signup by channel |
| "Delivered monthly", $89/mo | One-time capsule box at $89/box. Quarterly refresh is opt-in, and each box is approved before it's charged. | Clothes don't run out, and this keeps recurring billing clean |
| 20% off the first 3 boxes | Free 1:1 style consult and launch price locked for year one | A 20% discount cut Starter contribution from $26 to about $9 |
| 3–4 / 5–6 pieces | 3 / 5 pieces | Price the minimum and over-deliver with a bonus piece when margin allows |
| "Free fit exchanges" | One free size exchange per box | Puts a ceiling on the cost |
| 200 founding members | 25 founding boxes | Matches the pilot's real capacity |
| Images embedded as base64 (560 KB of HTML) | `img/*.webp` | Faster page and readable diffs |

## Budget

| Line | Lean $1,000 | Comfortable $1,500 |
|---|---:|---:|
| Website, domain, email | 100 | 100 |
| Samples & fit testing | 200 | 250 |
| Content & packaging | 50 | 150 |
| Ad experiments | 150 | 350 |
| Business setup (NJ registration) | 200 | 200 |
| Working capital / returns reserve (kept, not spent) | 300 | 450 |

Take payment through Stripe Payment Links or Shopify Starter. Buy the garments after the customer pays and approves the preview.

## Unit economics (assumptions; replace with real quotes)

| | Starter $89 · 3 pcs | Professional $149 · 5 pcs |
|---|---:|---:|
| Garments @ $14/pc | −42.00 | −70.00 |
| Shipping | −10.00 | −12.00 |
| Packaging | −3.00 | −4.00 |
| Processing (2.9% + $0.30) | −2.88 | −4.62 |
| Exchange reserve | −5.00 | −8.00 |
| **Contribution** | **$26.12 (29%)** | **$50.38 (34%)** |

**Sourcing rule:** for a 30% Starter margin, the average garment cost must stay at or below **$13.81 per piece**. `roi.html` recalculates this whenever you change shipping or other inputs.

## The ROI picture

With the default assumptions ($6 per signup, 8% waitlist-to-paid, 35% buy a second box):

- **Pilot:** about 8 paying customers. That passes the goal of 5.
- **The pilot doesn't pay for itself.** $1,050 of setup takes about 34 full-price boxes to recover. Treat the pilot as the cost of finding out whether the business works.
- **Paid ads lose money at these numbers.** Paid CAC is about $75, and 12-month contribution per customer (LTV) is about $52, so LTV:CAC is 0.7×. **Don't scale ads yet.**

**Path to profitable ads** (LTV:CAC of about 1.8×): signups at $4, waitlist-to-paid at 12%, and 40% of boxes on Professional. The levers, in order:

1. Organic reels to bring cost per signup down.
2. A "ready now" plus "new role" segment, followed up personally, to raise conversion.
3. Steering established professionals to the $149 box.
4. Cheaper garments.

The UTM columns in the waitlist sheet give you the real cost per signup by channel.

## 60-day rollout

| Days | Do | Exit criteria |
|---|---|---|
| 1–14 | Connect the waitlist ([setup](waitlist/README.md)). Register the business in NJ. Order samples from 2–3 wholesalers. Start 3–5 reels a week. | Waitlist live. 10 qualified signups. 2–3 suppliers with documented per-piece costs. |
| 15–30 | Shoot real sample outfits. Interview 10 people from the waitlist. Show them actual proposed boxes. | 40+ signups. 5 people say "I'd pay $89 now." **Checkpoint: release the extra $500?** |
| 31–45 | Sell 5–10 one-time founding boxes. Buy garments only after payment and preview approval. | 5+ paid orders |
| 46–60 | Track fit issues, refunds, delivery time, and actual contribution per box. Ask every customer about a refresh. | Positive contribution on real orders. 30%+ say yes to a refresh. |

**Kill or pivot if** fewer than 3 people pay by day 45, or real garment cost comes in above about $17 per piece (Starter margin under 20%).

## Time

Plan for 8–12 hours a week:

- 4–5 hours of content
- 3–4 hours of suppliers, packing, and DMs
- 2–3 hours of admin

## Compliance (not legal advice; check before charging anyone)

- **Business registration:** register with NJ before you start doing business.
- **Sales tax:** most clothing is exempt from NJ sales tax. Check other states as you sell into them.
- **Recurring billing:** use explicit opt-in (never pre-checked), clear renewal terms, and online cancellation. The FTC's 2024 click-to-cancel rule was vacated in July 2025, but state auto-renewal laws and FTC deception rules still apply.
- **Privacy contact:** `privacy.html` lists `hello@officecrate.com`. Replace it with an inbox you actually own.
