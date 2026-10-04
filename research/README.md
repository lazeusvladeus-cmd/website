# Agency website benchmark (October 2026)

Research behind the October 2026 rebuild of vikemarketing.com. The raw data is in [`agencies.csv`](agencies.csv), with one row per agency homepage.

## Method

- **Sample:** 132 distinct marketing agency homepages:
  - performance, PPC and paid-social agencies in the US, Canada, Australia and globally
  - digital agencies in the UK, Ireland and the Netherlands
  - agencies positioned for small and local businesses
  - Ukrainian and Eastern European agencies serving international clients
- **Collection:** two FireCrawl research-agent runs. Each run visited the homepages and recorded only what was visible there: headline, primary CTA, prices, contract terms, proof types, first-step offer, form length, people and FAQ.
- **Limits:**
  - Only homepages were checked, so prices shown on a separate page count as "not shown".
  - The second batch of 58 unique sites was recorded more conservatively than the first batch of 74. For example, it found FAQ sections on 0% of sites versus 15% in batch 1. Detailed features are therefore quoted from the 74-site batch. Metrics that agree across batches are quoted for all 132.
  - Treat the numbers as indicative of the market, not a census.

## Findings

| Feature | All 132 | Detailed sample (74) |
|---|---|---|
| Shows a price on the homepage | **9%** (12) | 9% |
| Says "no long-term contract" | 9% | **15%** |
| CTA in the hero | 80% | 84% |
| Big aggregate stat claims ("$1B+ revenue driven") | **64%** | 65% |
| Aggregate claims without any case study or named testimonial | 32 sites | |
| Headline is a vague slogan | **31%** | 31% |
| Client logos | | 77% |
| Case studies with numbers | | 54% |
| Named testimonials | | 39% |
| Free audit / proposal / plan as the first step | | 43% |
| Founder or team photos | | 36% |
| FAQ section | | 15% |
| Calendar booking on the homepage | | 14% |
| Visible form: median fields | 5 (12 of 28 forms ask 6+) | |

## Good patterns adopted

- **Specific headline.** The headline names an audience and an outcome, like "Marketing that actually books jobs for local service businesses". New home H1: *Meta & Google ads that turn ad spend into booked customers.*
- **Named free first step with clear contents.** Like KlientBoost's free plan, BlueHat's 15-point audit and ScaledOn's Opportunity Review. New page: `/free-audit/`, a written funnel audit with its contents, timing and FAQ.
- **Proof next to the CTA.** A real testimonial now sits directly under the hero buttons.
- **Published prices and "no contracts".** Only about 1 in 10 agencies do either, so these are now stated in the hero and in a comparison table.
- **Process, FAQ and industry pages.** Already present; kept.
- **AI-search positioning.** This is a 2026 trend: several agencies now lead with "Google & ChatGPT" visibility. In response:
  - The SEO page covers AI Overviews and assistants.
  - Every article opens with "Key takeaways".
  - `llms.txt` was added.

## Bad patterns deliberately avoided

- **Slogan headlines and "#1" superlatives.**
- **Animated counters.** Several rendered as "$0" in captured pages. The site uses no counters and no aggregate claims it can't back up.
- **Long qualification forms.** The form stays at 2 fields (name + email or phone).
- **No clear first step.** About 1 in 5 homepages had no CTA in the hero, and external Typeforms take visitors off-site. Our hero has a primary CTA plus the free audit, and on mobile a sticky bar keeps "Book a call" in reach.
- **Pop-ups on load.** None.

## Performance (Lighthouse, mobile, local server)

| Page | Before (P / A / BP / SEO, Speed Index) | After |
|---|---|---|
| Home | 96 / 100 / 96 / 100, SI 4.1 s | **98 / 100 / 100 / 100, SI 1.8 s** |
| Blog article | 96 / 100 / 96 / 100, SI 4.0 s | **97 / 100 / 100 / 100, SI 1.7 s** |
| Free audit, SEO service, Pricing | (new / changed) | **99 / 100 / 100 / 100** |

Changes behind these numbers:
- **Fonts:** self-hosted and preloaded, with no Google Fonts request. This is also better for GDPR.
- **Analytics:** gtag.js is only downloaded after cookie consent.
- **Images:** WebP blog images with responsive 600/1200 px sizes.
- **Animations:** compositor-only (opacity/transform).
- **Caching:** CSS/JS are versioned and cached for 1 year.
- **Security:** a Content-Security-Policy header.
