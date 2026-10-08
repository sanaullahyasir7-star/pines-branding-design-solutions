# Pines website engineering handover — 7 October 2026

## Changes
- Preserved brand palette, logo, typography and existing page structure.
- Removed decorative gradients only from portfolio photo surfaces. Four consistently proportioned, uncropped images link to their original full-size files; no modal to trap keyboard focus.
- Improved form notice contrast, focus feedback, required-field messages, semantic headings and real image dimensions.
- Added stable service anchors and distinct briefing/deliverable explanations.
- Kept concept labels; no invented case studies, materials, timings or capabilities.
- Published all four approved testimonials directly in HTML: equal desktop cards, two tablet columns, stacked mobile cards. Removed conflicting testimonial CSS and runtime carousel rendering.
- Added a three-stage Project Planner with live summary, transfer, copy, download and WhatsApp links. Rules/templates only; no AI service or backend.
- Form prepares a reviewable brief before opening WhatsApp. Copy/download/reopen and same-tab links remain available. Inputs remain in the page when opening fails. Nothing is described as sent until the visitor sends it in WhatsApp.
- Added secondary engineering credit and a pause control for moving text.
- No-JavaScript navigation and testimonials remain readable; the form has a direct WhatsApp fallback.

## Verification
- Chromium browser checks in same-origin frames at 360, 390, 768, 1024 and 1440 CSS pixels: 183/183 checks passed on the implementation candidate.
- Ten public pages at every width: no page-wide horizontal overflow, one H1, all images decoded.
- Four testimonial cards at every width, correct column counts, equal heights at 1024 and 1440.
- Four portfolio photo overlays absent; object-fit contain confirmed at every width.
- Required-field validation, live planner summary, existing-contact preservation on transfer, correct WhatsApp destination and encoded message, message updates after edits.
- Simulated blocked navigation; persistent recovery instructions and fields verified. No test enquiry sent.
- Clipboard success and permission-failure branches tested with a controlled clipboard substitute. Download blob text and status verified without sending a message.
- Static local-link and fragment checks passed. JavaScript syntax checks passed.
- Calculated notice contrast: 8.94:1. Secondary text on paper: 6.08:1. Olive text on olive wash: 6.40:1.
- Responsive frame checks exercise real browser layout at each width, not physical iOS/Android hardware. OS-level reduced-motion preferences require an additional physical-device check; CSS rules disable moving text and transition effects.
- No Lighthouse or performance score is claimed. No complete automated WCAG certification is claimed.

## Maintenance and deployment
- GitHub Pages uses `.github/workflows/pages.yml` to publish the explicit static site allowlist. No build server or API keys required.
- `assets/brief.js` holds planner and enquiry behavior; number is 923244485746.
- Quotes live in `index.html`; `assets/testimonials.json` remains the owner-approved source record. Update both together if quotes change.
- `tests/browser.html` contains the repeatable browser verification fixture. Serve the repository using `python -m http.server 8000`, then open `/tests/browser.html`. Tests are excluded from Pages deployment.
- User input is not persisted in local storage. It remains in the current page; downloading/copying provides a copy before navigating away.
- Opening WhatsApp places prepared text in its URL. WhatsApp and the visitor's browser handle that URL. Attach artwork directly in the WhatsApp conversation.

## Owner information still needed
- Approved completed-project photos, briefs, Pines contributions and exact materials/finishes for genuine case studies.
- Product catalogue, available materials and print methods, minimum quantities, production limits, delivery areas, timing and quote policies.
- Evidence for any sourcing, recycling, sustainability or certification statements.
- Business email, opening hours and approved social links if they should be published.
- Final custom domain and associated DNS settings when purchased.

## Future improvements
1. Publish approved case studies with original photography.
2. Add a secure backend for an optional genuine AI brief assistant grounded in owner-approved service facts; define handling/retention before use.
3. Measure real enquiry conversion and performance after launch with owner-approved analytics.

## Visual evidence and final checks
- Desktop and mobile screenshots are saved in `tests/screenshots/`.
- All four Work photos inspected visually on desktop and mobile.
- Mobile navigation opened using Enter; Escape closed it and returned focus to the toggle.
- Browser console inspection showed extension metadata errors only, not application errors.
- Release-specific asset URLs prevent stale scripts from hiding the new same-tab fallback.
