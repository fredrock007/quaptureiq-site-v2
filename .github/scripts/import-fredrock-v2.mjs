/**
 * Import the public, already-published FredRock Paper Club V2 into GitHub Pages.
 * This script downloads only the explicitly listed, site-owned static assets.
 * QuaptureIQ's separate legal-pages repository is never modified.
 */
import fs from "node:fs/promises";
import path from "node:path";

const source = "https://quaptureiq-site-v2.daring-crown-6816.chatgpt.site";
const destination = "https://fredrock007.github.io/quaptureiq-site-v2";

const pages = [
  "index.html",
  "study/index.html",
  ...["foundation", "intermediate", "senior", "fet"].map(
    (phase) => `phase/${phase}/index.html`
  ),
  ...Array.from({ length: 12 }, (_, index) => `grade${index + 1}/index.html`)
];

const assets = [
  "catalog.mjs",
  "practice.mjs",
  "shared.mjs",
  "grade.mjs",
  "landing.mjs",
  "study.mjs",
  "demo-question-workflow.gif",
  "demo-heart-labels.gif",
  "demo-review-vault.gif",
  "fredrock-share-card.png",
  "fredrock-favicon.svg",
  "fredrock-favicon.png"
].map((name) => `assets/${name}`);

const papers = Array.from({ length: 12 }, (_, index) =>
  Array.from(
    { length: 4 },
    (_, term) => `papers/original/grade${index + 1}/mathematics/term${term + 1}.pdf`
  )
).flat();

const mandatory = [...pages, ...assets, ...papers];
const optional = ["sitemap.xml", "robots.txt"];
const files = [...mandatory, ...optional];
let imported = 0;

async function download(relativePath, isOptional = false) {
  let response;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      response = await fetch(`${source}/${relativePath}`, {
        headers: { "User-Agent": "FredRock-Paper-Club-V2-GitHub-Pages-Import/1.0" },
        signal: AbortSignal.timeout(30000)
      });
      if (response.ok) break;
      if (response.status === 404 && isOptional) {
        console.log(`Optional file not found: ${relativePath}`);
        return;
      }
      throw new Error(`HTTP ${response.status} for ${relativePath}`);
    } catch (error) {
      if (attempt === 3) {
        if (isOptional) {
          console.warn(`Skipping optional file ${relativePath}: ${error}`);
          return;
        }
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, 500 * attempt));
    }
  }

  let bytes = Buffer.from(await response.arrayBuffer());
  if (relativePath.endsWith(".pdf") && bytes.subarray(0, 4).toString() !== "%PDF") {
    throw new Error(`Not a valid PDF: ${relativePath}`);
  }
  if (relativePath.endsWith(".gif") && !bytes.subarray(0, 3).equals(Buffer.from("GIF"))) {
    throw new Error(`Not a valid GIF: ${relativePath}`);
  }
  if (relativePath.endsWith(".png") && !bytes.subarray(1, 4).equals(Buffer.from("PNG"))) {
    throw new Error(`Not a valid PNG: ${relativePath}`);
  }
  if (relativePath.endsWith(".html") || relativePath.endsWith(".xml") || relativePath.endsWith(".txt")) {
    let contents = bytes.toString("utf8");
    if (relativePath.endsWith(".html") && !contents.includes("<html")) {
      throw new Error(`Not an HTML page: ${relativePath}`);
    }
    // Update sharing previews and canonical URLs, while keeping the counter's API
    // URL in assets/shared.mjs directed to the existing cross-origin endpoint.
    contents = contents.replaceAll(source, destination);
    if (relativePath === "index.html") {
      const oldLink = 'href="study/?grade=12&amp;subject=mathematics&amp;term=4&amp;year=2022"';
      const oldLabel = '2022 Grade 12 example &amp; paper archive';
      if (!contents.includes(oldLink) || !contents.includes(oldLabel)) {
        throw new Error("Expected 2022 home archive link is missing.");
      }
      contents = contents.replace(oldLink, 'href="archive/2022/"');
      contents = contents.replace(oldLabel, '2022 official Grade 12 papers &amp; memos');
    }
    bytes = Buffer.from(contents, "utf8");
  }
  if (relativePath === "assets/shared.mjs") {
    let contents = bytes.toString("utf8");
    const repeatBadge = '<span class="demo-loop">↻ Repeats automatically</span>';
    const visitorNumber = '<strong id="hero-visitor-total">3 031 500</strong>';
    if (!contents.includes(repeatBadge) || !contents.includes(visitorNumber)) {
      throw new Error("Expected FredRock label markup not found; refusing unrelated changes.");
    }
    contents = contents.replace(repeatBadge, "");
    contents = contents.replace(visitorNumber, `${visitorNumber}<small>visits</small>`);
    const hook = "export function initVisitorCounter(){";
    if (!contents.includes(hook)) throw new Error("Search initialization hook missing.");
    contents = "import {initExamSearch} from './search.mjs';\n" + contents;
    contents = contents.replace(hook,hook + "\n  initExamSearch();");
    bytes = Buffer.from(contents, "utf8");
  }
  if (relativePath === "assets/study.mjs") {
    let contents = bytes.toString("utf8");
    const hook = "  document.getElementById('term-select').addEventListener";
    if (!contents.includes(hook)) {
      throw new Error("Expected study page rendering hook not found.");
    }
    contents = "import {mountStudyArchive2022} from './dbe-2022.mjs';\\n" + contents;
    contents = contents.replace(hook, "  mountStudyArchive2022({grade,subjectId:subject.id,year});\\n" + hook);
    bytes = Buffer.from(contents, "utf8");
  }
  const outputPath = path.join("docs", relativePath);
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, bytes);
  imported += 1;
  console.log(`Imported ${relativePath}: ${bytes.byteLength} bytes`);
}

for (let index = 0; index < files.length; index += 6) {
  const group = files.slice(index, index + 6);
  await Promise.all(
    group.map((file) => download(file, optional.includes(file)))
  );
}
await fs.copyFile(".github/scripts/fredrock-search.mjs", "docs/assets/search.mjs");
await fs.writeFile("docs/.nojekyll", "");
console.log(`Ready: ${imported} files plus .nojekyll in docs/`);
