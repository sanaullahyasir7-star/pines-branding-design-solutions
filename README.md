# Pines Branding & Design Solutions — website

Responsive, buildless multi-page website for GitHub Pages.

## Structure

- `index.html` — homepage
- `services/`, `process/`, `work/`, `materials/`, `about/`, `faq/`, `start-project/`, `contact/` — site sections
- `work/case-study-template.html` — reusable case study template
- `DESIGN_NOTES.md` — concise rationale for the visual and content decisions
- `CLIENT_LAUNCH_CHECKLIST.md` — facts, permissions and connections Pines must confirm
- `privacy.html`, `terms.html`, `404.html` — supporting pages
- `assets/site.css`, `assets/site.js` — shared design system and accessible interactions
- `assets/pines-logo.webp` — supplied logo; do not distort
- `assets/packaging-concept.webp` — illustrative placeholder visual, not client work

## Contact form setup (Formspree)

1. Have Pines create/own a Formspree form and confirm which email should receive enquiries.
2. Confirm file-upload support and maximum upload size on the selected Formspree plan.
3. Edit `assets/site.js` and replace the empty `ENDPOINT` constant with the verified Formspree endpoint. This is a public form endpoint, not a secret.
4. Confirm required fields, privacy wording, spam controls, notification behavior and file retention with Pines. Test using a client-approved test submission.
5. The optional “Download a copy” checkbox creates a text brief only after a successful send. Files are not copied into that text file.

The current endpoint is intentionally blank. Until connected, the form clearly reports that online enquiries are not connected. Do not publish it as a working submission form before setup and testing.

## Deploy / update on GitHub Pages

The repository uses the existing GitHub Actions Pages workflow. Edit the static files and push changes to `main`; the workflow deploys automatically. Check the Actions tab for a successful run.

## Add a custom domain later

1. Register the client-approved domain with the client as owner.
2. Add the domain under repository Settings → Pages → Custom domain.
3. At the registrar, add DNS records GitHub Pages currently specifies for the chosen apex or `www` host.
4. Wait for DNS and certificate checks, then enforce HTTPS.
5. Update canonical URLs, Open Graph URLs, `sitemap.xml`, and `robots.txt` in this project; submit the sitemap to Search Console if requested.

## Client confirmation items

Search project files for `[CONFIRM WITH CLIENT]`. The full client checklist is in `CLIENT_LAUNCH_CHECKLIST.md`. Remove illustrative placeholders and draft legal language once replaced with approved facts.

## Checks

No build step or server is required. Test all links, the mobile menu, keyboard navigation, reduced motion, required form fields, upload constraints, 404 page and live endpoint after connecting it.

## Mobile layout

The shared stylesheet includes breakpoints at 1020px, 760px, 480px and 360px. At phone widths it switches to a single-column service list and timeline, collapses navigation behind an accessible menu button, stacks form fields, enlarges tap targets and adds a safe-area-aware sticky project CTA. Test widths around 320px, 360px, 390px, 430px, 768px and desktop before adding client content.
