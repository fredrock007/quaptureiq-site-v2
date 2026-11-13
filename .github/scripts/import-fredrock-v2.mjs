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

// Real examination files stay at their credited publishers; generated tests are removed.
const papers = [];

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
    if (relativePath === "index.html") {
      for (const year of [2023, 2024, 2025, 2026]) {
        const oldLink = `href="study/?grade=12&amp;subject=mathematics&amp;term=4&amp;year=${year}"`;
        if (!contents.includes(oldLink)) throw new Error(`Missing ${year} home archive link`);
        contents = contents.replace(oldLink, `href="archive/${year}/"`);
        contents = contents.replace(`${year} Grade 12 example &amp; paper archive`, `${year} official Grade 12 papers &amp; memos`);
      }
    }
    if (relativePath.endsWith(".html")) {
      const copyEdits = [
        ["Practise questions on FredRock, check the answers, and browse 2022–2026 paper collections.", "Browse authentic published examination papers and memorandums from 2022–2026."],
        ["Original sets you can view and print", "Published exams and official memos"],
        ["Practice &amp; memos", "Papers &amp; memos"],
        ["Keep practising here, then use QuaptureIQ", "Explore real papers here, then use QuaptureIQ"],
        ["Start with an original FredRock practice task, reveal the memorandum when you are ready, and print or save it as a PDF. Browse real past papers from credited sources when available.", "Select authentic papers from credited publishers, open the original examination, and download an official memorandum when available."],
        ["Practise with an on-site FredRock set.", "Open a real paper from its publisher."],
        ["Reveal answers or print the paper.", "Read the memorandum and revise."],
        ["Jump straight into a Grade 12 Mathematics example for a selected year, or select any other grade, subject and year above.", "Open the official Grade 12 examination archive for any year, or choose another grade and subject above."],
        ["Original practice and marking guides for South African", "Published examination resources for South African"],
        ["Choose practice by school term", "Explore the source archives"],
        ["All practice opens inside FredRock", "Exam resources are shown in FredRock"],
        ["Subject practice opens on this website", "Genuine published papers only"],
        ["Open the on-site original practice paper.", "Browse real published exam papers."],
        ["Reveal the memo or print/save as PDF.", "Open or download the original memorandum."],
        ["Our practice is original.", "No generated exam tests are included."],
        ["Find subjects, practice papers, memos and 2022–2026 source archives.", "Find real exam sources and memos, where available, from 2022–2026."],
        ["Subject practice opens", "Exam resources open"],
        ["PRACTICE TIME", "EXAM RESOURCES"],
        ["Original practice •", "Authentic resources •"],
        ["All practice opens", "Verified exam resources open"]
      ];
      for (const [oldText,newText] of copyEdits) contents = contents.replaceAll(oldText,newText);
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
  if (relativePath === "assets/grade.mjs") {
    let contents = bytes.toString("utf8");
    contents = contents.replaceAll("Original practice + 2022–2026 source archive", "Genuine exam sources · availability varies");
    contents = contents.replaceAll("Free Grade ${grade} practice and paper archive", "Free Grade ${grade} published exam resources");
    contents = contents.replaceAll("Find practice questions, check your answers, and discover past paper collections from 2022 to 2026.", "Find published examination papers and memorandums, where available, from 2022 to 2026.");
    contents = contents.replace("render();\ninitHeaderTTS();", "render();\ndocument.getElementById('term-pills')?.parentElement?.remove();\ninitHeaderTTS();");
    bytes = Buffer.from(contents, "utf8");
  }
  if (relativePath === "assets/study.mjs") {
    let contents = bytes.toString("utf8");
    const hook = "  document.getElementById('term-select').addEventListener";
    if (!contents.includes(hook)) {
      throw new Error("Expected study page rendering hook not found.");
    }
    contents = "import {mountStudyArchive2022} from './dbe-2022.mjs';\n" + contents;
    contents = contents.replace(hook, "  mountStudyArchive2022({grade,subjectId:subject.id,year});\n" + hook);
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
// The legacy generated mathematics PDFs were removed at FredRock's request.
await fs.rm("docs/papers/original", { recursive: true, force: true });
await fs.copyFile("docs/assets/official-study.mjs", "docs/assets/study.mjs");
await import("./import-provincial.mjs");
await fs.copyFile(".github/scripts/fredrock-search.mjs", "docs/assets/search.mjs");
await fs.writeFile("docs/.nojekyll", "");
console.log(`Ready: ${imported} files plus .nojekyll in docs/`);
