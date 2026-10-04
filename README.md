# vikemarketing.com

Multipage static website for **Vike Marketing**. It's plain HTML, CSS and JS with no build step and no frameworks.

Everything that gets deployed lives in [`site/`](site/):

```
site/
├── index.html                      Home
├── services/  (+ 4 service pages)  meta-ads-management, google-ads-management, seo, creative-production
├── industries/ (+ 4 pages)         ecommerce, local-services, construction-real-estate, education-schools
├── locations/  (+ 3 pages)         netherlands, united-kingdom, ireland
├── blog/       (+ 6 articles, incl. original agency-website research)
├── free-audit/                     Free funnel audit landing page
├── pricing/  about/  contact/  privacy/  terms/
├── 404.html  sitemap.xml  robots.txt  llms.txt  netlify.toml
└── assets/
    ├── css/style.css               all shared styles
    ├── js/main.js                  all shared JS (config block at the top)
    ├── fonts/                      self-hosted Archivo + IBM Plex Mono
    └── img/                        favicon, logo, OG image, blog covers (JPG + WebP)
```

## Deploying on Netlify

- **From Git:** connect this repo and set **Base directory** to `site`. Leave the build command empty. `site/netlify.toml` sets the publish directory, security headers, caching and redirects.
- **Drag and drop:** drag the `site` folder (or unzip `vike-marketing-site.zip`) onto Netlify Drop.

Clean URLs work out of the box because every page is `folder/index.html`.

## Before you go live: checklist

1. **Google Analytics.** Replace `G-XXXXXXXXXX` with your GA4 Measurement ID. It appears once, in the `<head>` of every page (`window.VIKE_GA_ID`):
   `grep -rl G-XXXXXXXXXX site | xargs sed -i 's/G-XXXXXXXXXX/G-YOURID/g'`
   The Analytics script is only downloaded after a visitor accepts cookies.
2. **Telegram lead alerts.** The original `vike.html` didn't contain a bot token or chat IDs (it only used the mailto fallback). Paste them into the `VIKE_CONFIG` block at the top of `site/assets/js/main.js`. Until you do, the form falls back to a pre-filled email. Note that a token in front-end JS is publicly readable. Use a bot that only posts leads, or move the call to a Netlify Function later.
3. **Logo and favicon.** `assets/img/favicon.svg`, `favicon-32.png`, `apple-touch-icon.png`, `logo.png` and `og-default.jpg` were generated from the existing "V" mark. Swap in official files if you have them, keeping the same filenames.
4. **Removed unverified numbers.** The old page showed hero stats (3.4x ROAS, 120+ campaigns, +218%), metric badges on testimonials (CPC $0.12, +184% ROAS, +3.1x reach) and 5-star rows. These were removed because they couldn't be verified. The three testimonial quotes are kept word for word. Re-add any figure only if you can back it up.
5. **Legal pages.** Privacy and Terms are real, complete pages, but they include policy choices you should confirm, ideally with a lawyer: the 24-month retention period for enquiries, billing monthly in advance, the 3-month liability cap, and the listed processors (Google, Telegram, Netlify, your email provider).
6. **Operational claims.** Check that these are still true: campaigns go live "typically within 48 hours of sign-off", replies come "within 24 hours on business days", Ukrainian is spoken on calls, Vladyslav is involved in every account, and native-speaker Dutch translation is arranged when needed.
7. **Blog dates.** The articles are dated 18 Aug to 4 Oct 2026. Change them to the real publish dates in each article's `<time>` tag, its JSON-LD and `sitemap.xml`.
8. **Calendar booking (optional).** Only about 14% of agencies in the detailed research sample offer self-booking, so this helps you stand out. Paste a Calendly or Cal.com link into `BOOKING_URL` in `main.js`, and the booking form then shows "Open the calendar".
9. **Founder photo (recommended).** Only about a third of agencies in the detailed research sample show their people, and you're selling direct access to the founder. Add a real photo of Vladyslav to the About page and the author box; it's not included because no photo was supplied.
10. **Free audit turnaround.** `/free-audit/` promises a reply within 24 hours and a written audit typically within 2–4 business days, based on the original site's FAQ. Confirm you can keep to this.
11. **Social profiles (optional).** No social URLs were available, so none are linked. If you add them, also add a `sameAs` array to the Organization JSON-LD on the home page.
12. **After launch.** Set up the custom domain plus HTTPS in Netlify, verify the site in Google Search Console, submit `https://vikemarketing.com/sitemap.xml`, and test the booking form once on the live domain.

## Research

The October 2026 rebuild is based on a review of 132 agency homepages. Findings, method and before/after Lighthouse scores are in [`research/README.md`](research/README.md); raw data is in [`research/agencies.csv`](research/agencies.csv).
