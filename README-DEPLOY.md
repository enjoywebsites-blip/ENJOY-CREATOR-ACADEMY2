# Enjoy Creator Academy V18 — deployment package

## Included
- Responsive ECA academy website for laptop, tablet and mobile
- Home, Academy, Programmes, Course Detail, Mentor, Community, Resources, Creator Services, Student Guide, FAQ, Contact, Student Login, Learning Portal and legal pages
- Supplied logo, founder photo, four certificate images and supplied YouTube links retained
- Contextual ₹999 enrollment UI: header CTA, course modal, mobile enrollment bar and timed reminder popup
- Responsive mobile navigation with animated panel + backdrop
- Touch-friendly scroll reveals, mobile press states, page-load transitions, reading progress and lightweight pointer depth on desktop
- SEO metadata, canonical page URLs, OpenGraph/Twitter metadata, Organization/EducationalOrganization/Course/FAQ/Person/ContactPage structured data
- robots.txt, sitemap.xml, manifest, favicon/apple-touch icon and 404 page

## Production notes
1. Replace `REPLACE_WITH_YOUR_DOMAIN` in `robots.txt` and `sitemap.xml` with the final HTTPS origin.
2. For full canonical/OG absolute URLs, replace the current page-relative `canonical` and `og:url` values with the live HTTPS URLs for each page.
3. The Student Login is intentionally a static access shell: it remembers only the entered email locally and never stores passwords. The linked Google Drive resource remains controlled by Google account permissions. Use a real auth provider/backend before calling it a secure account system.
4. Keep all HTML, `styles.css`, `script.js`, `manifest.webmanifest`, `robots.txt`, `sitemap.xml`, `404.html` and the complete `assets/` directory together when deploying.
5. Test Razorpay, Google Drive permissions, WhatsApp and email on the live domain.


V22 interaction notes:
- Homepage review videos are embedded as real YouTube iframes in stable 9:16 frames.
- Offer popup appears after 6 seconds, can reappear 6 seconds after each X dismissal, and stops after four appearances/dismissals or immediate Enter/enrollment engagement.
- Mobile navigation uses the actual sticky header geometry and includes Student Login + Enroll actions.
