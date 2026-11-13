/** Links to DBE-hosted, November 2022 Grade 12 NSC papers and memorandums.
 * The actual files stay on education.gov.za until redistribution is authorised.
 */
const DATA_URL = new URL('./dbe-2022.json', import.meta.url);
let catalogPromise;
const subjectIds = {
  'afrikaans':'afrikaans', 'english':'english', 'isindebele':'isindebele',
  'isixhosa':'isixhosa', 'isizulu':'isizulu', 'sepedi':'sepedi',
  'setswana':'setswana', 'sesotho':'sesotho', 'siswati':'siswati',
  'tshivenda':'tshivenda', 'xitsonga':'xitsonga',
  'accounting':'accounting', 'agricultural sciences':'agricultural-sciences',
  'business studies':'business-studies', 'computer application technology':'cat',
  'consumer studies':'consumer-studies', 'dramatic arts':'dramatic-arts',
  'economics':'economics', 'engineering graphic and design':'egd',
  'geography':'geography', 'history':'history',
  'information technology':'it', 'life orientation':'life-orientation',
  'life sciences':'life-sciences', 'mathematical literacy':'math-lit',
  'mathematics':'mathematics', 'physical sciences':'physical-sciences',
  'tourism':'tourism', 'visual arts':'visual-arts'
};
const esc = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const kindName = {paper:'Question paper',memo:'Memorandum',supplement:'Supporting file'};
const kindOrder = {paper:0,memo:1,supplement:2};
export const mappedSubject = name => subjectIds[String(name).toLowerCase()] || '';
export function getDBE2022() {
  catalogPromise ??= fetch(DATA_URL).then(response => {
    if (!response.ok) throw new Error(`2022 catalogue HTTP ${response.status}`);
    return response.json();
  });
  return catalogPromise;
}

function styles() {
  if (document.getElementById('dbe-2022-styles')) return;
  const style = document.createElement('style');
  style.id = 'dbe-2022-styles';
  style.textContent = `
    .dbe-study-panel{border:2px solid #aad8cb;background:#f7fff9;border-radius:20px;padding:22px;margin:22px 0;box-shadow:0 10px 30px #102f2f0b}
    .dbe-study-panel h3{margin:4px 0 9px;font-size:clamp(1.3rem,3vw,1.85rem);line-height:1.22;letter-spacing:-.035em}
    .dbe-study-panel p{color:#53676a;margin:0 0 15px}
    .dbe-study-panel .dbe-subtitle{color:#117e72;text-transform:uppercase;font-size:.75rem;font-weight:900;letter-spacing:.09em}
    .dbe-doc-list{display:grid;gap:8px}
    .dbe-doc-row{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 14px;background:#fff;border:1px solid #e1eae7;border-radius:12px}
    .dbe-doc-row strong{display:block;color:#1a3440;font-size:.91rem;line-height:1.3}
    .dbe-doc-row small{display:block;color:#60757b;margin-top:2px;font-size:.77rem}
    .dbe-doc-actions{display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end}
    .dbe-doc-row a{font-size:.82rem;font-weight:850;color:#087e78;text-decoration:none;border:1px solid #bcdad3;background:#f6fcf8;border-radius:9px;padding:9px 11px;white-space:nowrap}
    .dbe-doc-row a:hover{background:#e0f8ee}
    .dbe-full-link{display:inline-block;background:#087e78;color:#fff!important;font-weight:900;padding:11px 15px;border-radius:11px;text-decoration:none;margin-top:14px}
    .dbe-legal-note{font-size:.8rem!important;color:#627478!important;margin-top:14px!important}
    @media(max-width:480px){.dbe-study-panel{padding:15px}.dbe-doc-row{align-items:flex-start;flex-wrap:wrap}.dbe-doc-actions{width:100%;justify-content:stretch}.dbe-doc-row a{flex:1;text-align:center}}
    @media print{.dbe-study-panel{display:none!important}}
  `;
  document.head.appendChild(style);
}

const sortPapers = (left,right) => (left.paper || 99) - (right.paper || 99) ||
  kindOrder[left.kind] - kindOrder[right.kind] || left.title.localeCompare(right.title);

function documentRow(doc, label = false) {
  // URLs are from the verified DBE catalogue, not visitor input.
  const download = new URL(doc.url);
  download.searchParams.set('forcedownload', 'true');
  return `<div class="dbe-doc-row"><div><strong>${esc(doc.title)}</strong><small>${label ? `${esc(doc.subject)} · ` : ''}${kindName[doc.kind] || 'Official document'} · DBE November 2022</small></div><div class="dbe-doc-actions"><a href="${esc(doc.url)}" target="_blank" rel="noopener noreferrer" aria-label="View ${esc(doc.subject)} ${esc(doc.title)} at the Department of Basic Education">View ↗</a><a href="${esc(download.href)}" target="_blank" rel="noopener noreferrer" aria-label="Download ${esc(doc.subject)} ${esc(doc.title)} from the Department of Basic Education">Download ↓</a></div></div>`;
}

/** Called after each study-page render, including switching the year tabs. */
export async function mountStudyArchive2022({grade,subjectId,year}) {
  if (Number(grade) !== 12 || Number(year) !== 2022) return;
  const tabs = document.querySelector('#archive .year-tabs');
  if (!tabs) return;
  styles();
  const panel = document.createElement('section');
  panel.className = 'dbe-study-panel no-print';
  panel.setAttribute('aria-label', 'Official 2022 examination files');
  panel.innerHTML = '<p>Loading official 2022 papers and memorandums…</p>';
  tabs.insertAdjacentElement('afterend', panel);
  const archiveLink = `../archive/2022/?subject=${encodeURIComponent(subjectId)}`;
  try {
    const catalogue = await getDBE2022();
    if (!panel.isConnected) return;
    const docs = catalogue.documents.filter(doc => mappedSubject(doc.subject) === subjectId).sort(sortPapers);
    panel.innerHTML = `<div class="dbe-subtitle">🏛️ Department of Basic Education · November 2022</div>
      <h3>Official Grade 12 ${docs.length ? esc(docs[0].subject) : 'NSC'} exam papers</h3>
      <p>${docs.length ? `${docs.length} actual DBE files for this subject — question papers, marking guidelines and any supporting documents.` : 'This subject is not in the department’s 2022 archive under the selected name. Browse the complete collection.'}</p>
      ${docs.length ? `<div class="dbe-doc-list">${docs.map(doc => documentRow(doc)).join('')}</div>` : ''}
      <a class="dbe-full-link" href="${archiveLink}">Browse all 2022 subjects and papers →</a>
      <p class="dbe-legal-note">Source: South African Department of Basic Education. Files open from education.gov.za; FredRock does not host copies of these copyrighted documents.</p>`;
  } catch {
    if (!panel.isConnected) return;
    panel.innerHTML = `<h3>Official November 2022 papers</h3><p>The document index could not load right now.</p><a class="dbe-full-link" href="${archiveLink}">Open 2022 catalogue →</a>`;
  }
}

/** The searchable dedicated 2022 catalogue includes all DBE source subjects. */
export async function mountDBE2022ArchivePage() {
  const subject = document.getElementById('archive-subject');
  const query = document.getElementById('archive-query');
  const kind = document.getElementById('archive-kind');
  const result = document.getElementById('archive-results');
  const count = document.getElementById('archive-count');
  if (!subject || !query || !kind || !result || !count) return;
  styles();
  try {
    const catalogue = await getDBE2022();
    const groups = [...new Set(catalogue.documents.map(doc => doc.subject))].sort((a,b)=>a.localeCompare(b));
    for (const name of groups) subject.add(new Option(name, name));
    const initial = new URL(location.href).searchParams.get('subject');
    const initialGroup = groups.find(name => mappedSubject(name) === initial || name.toLowerCase() === initial?.toLowerCase());
    if (initialGroup) subject.value = initialGroup;
    document.getElementById('archive-total').textContent = `${catalogue.documents.length} official files · ${groups.length} subjects`;
    const display = () => {
      const searchTerm = query.value.trim().toLocaleLowerCase();
      const chosenGroup = subject.value;
      const chosenKind = kind.value;
      const matches = catalogue.documents.filter(doc =>
        (!chosenGroup || doc.subject === chosenGroup) &&
        (!chosenKind || doc.kind === chosenKind) &&
        (!searchTerm || `${doc.subject} ${doc.title}`.toLocaleLowerCase().includes(searchTerm))
      );
      const filteredGroups = [...new Set(matches.map(doc => doc.subject))].sort((a,b)=>a.localeCompare(b));
      count.textContent = `${matches.length} document${matches.length === 1 ? '' : 's'} found in ${filteredGroups.length} subject${filteredGroups.length === 1 ? '' : 's'}`;
      if (!matches.length) {
        result.innerHTML = '<div class="archive-empty">No files match your filters. Try a different subject, paper number or keyword.</div>';
        return;
      }
      result.innerHTML = filteredGroups.map((name,index) => {
        const entries = matches.filter(doc => doc.subject === name).sort(sortPapers);
        return `<details class="archive-group" ${chosenGroup || searchTerm || chosenKind || index === 0 ? 'open' : ''}>
          <summary><span>📘 ${esc(name)}</span><span class="archive-group-count">${entries.length} files ▾</span></summary>
          <div class="dbe-doc-list">${entries.map(doc => documentRow(doc)).join('')}</div>
        </details>`;
      }).join('');
    };
    for (const field of [subject,query,kind]) field.addEventListener(field === query ? 'input' : 'change', display);
    display();
  } catch {
    count.textContent = 'Catalogue temporarily unavailable';
    result.innerHTML = '<p class="archive-empty">Please use the official <a href="https://www.education.gov.za/Curriculum/NationalSeniorCertificate%28NSC%29Examinations/2022NovemberExams.aspx" target="_blank" rel="noopener noreferrer">DBE November 2022 collection ↗</a>.</p>';
  }
}
