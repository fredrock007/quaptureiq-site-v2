# FredRock Paper Club V2

**Free South African CAPS practice, organised from Grade 1 to Grade 12.**

This is the **separate GitHub repository** for FredRock Paper Club V2. It does not replace or modify the original `quaptureiq-site` repository used for QuaptureIQ's legal pages.

## Website

- **GitHub Pages address:** https://fredrock007.github.io/quaptureiq-site-v2/
- **Existing live edition:** https://quaptureiq-site-v2.daring-crown-6816.chatgpt.site/

The GitHub Pages address works after Pages is enabled in the repository settings.

## What's included

- Foundation Phase: Grades 1–3
- Intermediate Phase: Grades 4–6
- Senior Phase: Grades 7–9
- FET Phase: Grades 10–12
- Original, downloadable Grade 1–12 Mathematics practice PDFs for all four terms, including answer resources and an in-browser PDF viewer
- A 2022–2026 year selector and credited references to published examination collections
- Three looping QuaptureIQ GIFs: question photo and answer, heart diagram labels, and Review Vault
- QuaptureIQ Google Play and tester invitations
- Header voice playback that pronounces **QuaptureIQ** as **Capture Eye Queue**
- FredRock copyright, social-sharing thumbnail, and a visitor counter connected to the existing live counter endpoint

**Note:** FredRock's own downloadable practice PDFs are not presented as official Department of Basic Education examination papers. Availability of external official papers varies by grade and year.

## Publish on GitHub Pages

1. Open **Settings → Pages** for this repository: https://github.com/fredrock007/quaptureiq-site-v2/settings/pages
2. Under **Build and deployment**, choose **Source: GitHub Actions**. Save the setting if prompted.
3. Open **Actions → Publish FredRock Paper Club V2**: https://github.com/fredrock007/quaptureiq-site-v2/actions/workflows/import-fredrock-v2.yml
4. Select **Run workflow** on the `main` branch (or rerun the previously failed deployment). The import is already complete; GitHub Pages will deploy the contents of `docs/`.

The first Actions run successfully imported the site files; its deploy job could not finish until Pages is enabled.

## Website files and maintenance

- `docs/` — ready-to-host, self-contained static website: HTML, scripts, GIFs, and PDFs
- `.github/scripts/import-fredrock-v2.mjs` — imports the explicitly listed static files from the existing public FredRock V2 site, then adapts canonical and share URLs for GitHub Pages
- `.github/workflows/import-fredrock-v2.yml` — manually re-runnable GitHub Actions importer and GitHub Pages deployment

The site is free to browse and retains credit to the original publishers of any linked external documents.

© 2026 FredRock. All rights reserved.
