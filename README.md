# Pines Branding & Designs Solution — website

A responsive static multi-page website for Pines, published through GitHub Pages.

## Live site

- Public website: https://pinesbrandingdesignsolutions.com/
- Based in New York City, NY; worldwide delivery.
- The custom-domain website and its canonical URLs were opened and verified during the 13 October 2026 audit.

## Visitor experience

- Home, Services, Selected Work, Process, About, FAQ, Contact and Start a Project pages.
- Packaging, Print & Paper, Branding & Design, Digital Branding, and Mockups, Sampling & Production.
- Four client-provided testimonials, preserved as supplied.
- A guided Project Planner that organizes visitor answers with templates and browser-side JavaScript. It is not an AI assistant.
- Supplied client photos, videos and artwork appear in brand-specific sections with clear media labels.

## Contact and enquiry flow

The Contact page lists regional representatives and their current phone, WhatsApp and email details. Email links are plain mailto links that open the visitor’s own email app with the published Pines address prefilled. The website does not send an email.

The Project Planner and enquiry form prepare a WhatsApp message for the selected regional representative. The visitor reviews it and presses Send in WhatsApp for Pines to receive it. The prepared brief is included in the WhatsApp destination URL. The website does not store enquiry details or provide a server-side form endpoint.

## Deployment

The .github/workflows/pages.yml workflow publishes the allowlisted static site when main is updated. Check GitHub Actions for the latest Pages run. There is no build server or API dependency.

## Project files

- index.html — homepage
- services/, work/, process/, about/, faq/, start-project/, contact/ — public sections
- assets/site.css, assets/site.js — shared visual system, fonts and interactions, including the motion layer (word-by-word headlines, scroll reveals, image curtains, hero parallax and tilt, hover polish, progress bar). Motion switches itself off for visitors who prefer reduced motion.
- assets/fonts/ — self-hosted DM Sans and Zilla Slab (SIL Open Font License); no requests go to Google Fonts
- assets/brief.js — project planner, WhatsApp message, copy and download behavior
- assets/contact-page.js — contact-page behavior and copy actions
- assets/testimonials.json — testimonial source record
- tests/browser.html, tests/brand-home.html — responsive and browser regression harnesses
- CLIENT_LAUNCH_CHECKLIST.md — remaining owner confirmations
- HANDOVER.md — engineering notes and verification history

## Owner confirmations still needed

The site avoids unconfirmed prices, minimum quantities, production timing, materials, print methods, detailed product specifications, shipping terms, business hours and legal terms. Confirm those before publishing specific claims. Google Search Console ownership and sitemap submission have not been verified. No ranking promise, Lighthouse score or formal accessibility certification is claimed.

## Verification limits

The audit checks recorded in HANDOVER.md cover source consistency and selected live behaviors. They do not replace a physical Android/iOS device check or a full assistive-technology audit.
