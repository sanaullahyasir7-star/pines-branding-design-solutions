# Pines Branding & Designs Solution — website

A responsive, static multi-page website for Pines, built for GitHub Pages. The current GitHub Pages address is the live website.

## Visitor experience

- Home, Services, Selected Work, Process, About, FAQ, Contact and Start a Project pages.
- Packaging, Print & Paper, Branding & Design, Digital Branding, and Mockups, Sampling & Production.
- Four owner-approved client testimonials.
- A guided Project Planner that builds a brief from visitor answers. It uses templates and browser-side JavaScript; it is not an AI assistant.
- Service imagery introduces the business categories. The site does not present these images as named client case studies.

## Enquiry flow

The project form routes a prepared WhatsApp brief to the regional representative selected by the visitor. Visitors review the brief and then press Send in WhatsApp. Opening WhatsApp does not submit or send the enquiry. The site has no email form endpoint or enquiry database. Visitors can copy or download a brief before leaving the page.

The prepared brief is included in the WhatsApp destination URL. Do not enter passwords, payment details or other sensitive information in the project planner.

## Deploy on GitHub Pages

The `.github/workflows/pages.yml` workflow publishes the allowlisted static site whenever `main` is updated. Check the repository Actions tab for the deploy run. The site has no build server or API dependency.

The custom domain has not yet been verified on GitHub Pages. Keep sharing the GitHub Pages address until DNS and Pages domain configuration are connected and confirmed.

## Project files

- `index.html` — homepage
- `services/`, `work/`, `process/`, `about/`, `faq/`, `start-project/`, `contact/` — public site sections
- `assets/site.css`, `assets/site.js` — shared visual system and interactions
- `assets/brief.js` — planner, WhatsApp message, copy and download behavior
- `assets/testimonials.json` — approved testimonial source record
- `CLIENT_LAUNCH_CHECKLIST.md` — outstanding business-owner confirmations
- `HANDOVER.md` — engineering notes and verification history

## Business details still to confirm

Exact product catalogue, available materials and print methods, minimum quantities, production capacity and timing, quote and payment terms, destination-specific delivery arrangements, business email and hours, and any approved project photos and case-study facts. Do not invent these details in site copy.

## Verification limits

Responsive browser checks are recorded in `HANDOVER.md`. These checks do not replace testing on physical Android and iOS devices. No Lighthouse score or formal accessibility certification is claimed.
