import {YEARS,phaseForGrade,subjectForGrade,subjectCollectionUrl,gradeCollectionUrl,PLAY_URL} from './catalog.mjs';
import {practiceFor} from './practice.mjs';
import {promoMarkup,footerMarkup,initTesterPopup,initVisitorCounter,initHeaderTTS} from './shared.mjs';
const qs=new URLSearchParams(location.search);
const grade=Number(qs.get('grade')||1);
const subject=subjectForGrade(grade,qs.get('subject'));
let term=Math.max(1,Math.min(4,Number(qs.get('term')||1)));
let year=YEARS.includes(Number(qs.get('year')))?Number(qs.get('year')):2026;
const phase=phaseForGrade(grade);
const target=document.getElementById('study-content');
const escapeHtml=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const nscYears={
  2026:'https://www.education.gov.za/Curriculum/NationalSeniorCertificate%28NSC%29Examinations/2026MayJuneExamPapers.aspx',
  2025:'https://www.education.gov.za/Curriculum/NationalSeniorCertificate%28NSC%29Examinations/2025NovemberExamPapers.aspx',
  2024:'https://www.education.gov.za/2024NSCNovemberpastpapers.aspx',
  2023:'https://www.education.gov.za/Curriculum/NationalSeniorCertificate%28NSC%29Examinations/2023NSCNovemberpastpapers.aspx',
  2022:'https://www.education.gov.za/Curriculum/NationalSeniorCertificate%28NSC%29Examinations/2022NovemberExams.aspx'
};

function updateUrl(){const u=new URL(location.href);u.searchParams.set('grade',grade);u.searchParams.set('subject',subject.id);u.searchParams.set('term',term);u.searchParams.set('year',year);history.replaceState(null,'',u);}
function questionMarkup(q,i){return `<div class="question"><h3>${i+1}. ${escapeHtml(q.question)} <small>(${q.marks} marks)</small></h3><div class="answer-lines" aria-hidden="true"></div><div class="memo"><strong>Model answer:</strong> ${escapeHtml(q.answer)}</div></div>`;}
function originalPdfPanel(practice){
  if(subject.id!=='mathematics')return `<section class="resource-panel" aria-label="Printable originals"><span class="section-kicker">FredRock PDF resources</span><h2>Printable original practice</h2><p>Use the <strong>Print / Save PDF</strong> button above for this subject. A separately downloadable PDF is being prepared. This is original practice, not an official past paper.</p></section>`;
  const url=`../papers/original/grade${grade}/mathematics/term${term}.pdf`;
  const questions=practice.questions.map((q,i)=>`<div class="preview-question"><strong>${i+1}. (${q.marks} marks)</strong>${escapeHtml(q.question)}</div>`).join('');
  const memo=practice.questions.map((q,i)=>`<p class="preview-answer"><strong>${i+1}. (${q.marks} marks)</strong>${escapeHtml(q.answer)}</p>`).join('');
  return `<section class="resource-panel" aria-label="Download original PDF"><span class="section-kicker">FredRock original practice PDF</span><h2>Read or download the complete PDF</h2><p>Grade ${grade} Mathematics, Term ${term}. Questions and answers are in one downloadable PDF, with the memorandum on a separate page. <strong>Not an official examination.</strong></p><div class="pdf-actions no-print"><button id="open-pdf-viewer" type="button" aria-expanded="false" aria-controls="original-pdf-preview">Preview PDF pages</button><a class="secondary" href="${url}" download>Download original PDF ↓</a></div><div id="original-pdf-preview" class="pdf-page-preview no-print" role="region" aria-label="Mobile-friendly preview of both PDF pages" hidden><article class="pdf-preview-sheet"><h3>FredRock Paper Club</h3><p class="pdf-preview-subtitle">Grade ${grade} • Mathematics • Term ${term} • Practice paper • ${practice.totalMarks} marks</p><p><strong>Name:</strong> ________________________ &nbsp; <strong>Date:</strong> ____________</p>${questions}<p class="pdf-preview-footer">Original FredRock practice material · Not an official past examination.</p></article><article class="pdf-preview-sheet"><h3>Memorandum</h3><p class="pdf-preview-subtitle">Grade ${grade} • Mathematics • Term ${term} • Model answers</p>${memo}<p class="pdf-preview-footer">© 2026 FredRock · For study and revision.</p></article></div></section>`;
}
function sourcePanel(){
  const site=subjectCollectionUrl(grade,subject.id);
  const listed=site!==gradeCollectionUrl(grade);
  return `<section class="resource-panel" id="archive" aria-labelledby="archive-heading"><span class="section-kicker">Real papers • published sources</span><h2 id="archive-heading">Past-paper archive: ${year}</h2><p>Explore papers and memos from <strong>2022–2026</strong>. These are third-party or official documents, <strong>not</strong> FredRock's original practice questions. We have not copied files without redistribution rights. Availability varies by grade, subject and term; some 2026 examinations are not yet published.</p><div class="year-tabs" role="group" aria-label="Past paper year">${YEARS.map(y=>`<button type="button" data-year="${y}" aria-pressed="${y===year}">${y}</button>`).join('')}</div>
  <div class="source-card"><strong>📚 ${listed?'Subject-specific paper collection':'Grade-wide paper collection'}</strong><p>Browse ${escapeHtml(subject.name)} resources and select <strong>${year}</strong> on the original collection. Source credit: StudyPapers, which indexes examination material from schools and education departments.</p><a href="${site}" target="_blank" rel="noopener noreferrer">Open verified source collection ↗</a></div>
  ${grade===12?`<div class="source-card"><strong>🏛️ Department of Basic Education — ${year} NSC papers</strong><p>Official Grade 12 examination papers and memorandums. ${year===2026?'The May/June 2026 collection is available; November papers may not be published yet.':'Choose the subject and paper on the DBE page.'}</p><a href="${nscYears[year]}" target="_blank" rel="noopener noreferrer">Open DBE ${year} examination collection ↗</a></div>`:''}
  <p class="disclosure">We keep the practice reader inside FredRock. External archives are linked with attribution because their licences do not automatically permit republication on this site.</p></section>`;
}
function render(){
  const practice=practiceFor(grade,subject,term);
  document.title=`${subject.name} • Grade ${grade} | FredRock Paper Club`;
  target.innerHTML=`<div class="study-intro"><div class="study-breadcrumbs"><a href="../">Home</a> / <a href="../phase/${phase.id}/">${phase.name}</a> / <a href="../grade${grade}/">Grade ${grade}</a> / ${escapeHtml(subject.name)}</div><span class="section-kicker">Free on-site practice · Grade ${grade}</span><h1>${escapeHtml(subject.name)}<br><em style="color:#087e78">Study Corner.</em></h1><p>Work through an original practice set, check its memorandum and print or save it as a PDF. Then consult the separately credited past-paper archive for ${year}.</p><span class="section-note">Original practice • not an official past examination</span></div>
  <div class="practice-bar no-print"><label for="term-select">Practice term</label><select id="term-select">${[1,2,3,4].map(t=>`<option value="${t}" ${t===term?'selected':''}>Term ${t}</option>`).join('')}</select><button id="memo-toggle" type="button" aria-pressed="false">Show memorandum</button><button id="print-paper" type="button">🖨️ Print / Save PDF</button><a href="../grade${grade}/#subjects" style="color:#087e78;font-weight:850;text-decoration:none">← Other subjects</a></div>
  <article class="paper-sheet" aria-label="FredRock practice paper"><div class="paper-head"><div><strong>FredRock Paper Club</strong><small>Grade ${grade} • ${escapeHtml(subject.name)} • Practice term ${term}</small><p class="muted" style="margin:6px 0 0">Name: ________________________ &nbsp;&nbsp; Date: ____________</p></div><span class="badge">${practice.totalMarks} MARKS</span></div>${practice.questions.map(questionMarkup).join('')}<p class="disclosure">${escapeHtml(practice.disclaimer)}</p></article>
  ${originalPdfPanel(practice)}
  ${sourcePanel()}
  <section class="quapture-panel" aria-labelledby="study-quapture-title" style="max-width:880px;margin:26px auto 0"><div><span class="panel-kicker">Learn beyond the memo</span><h2 id="study-quapture-title">Stuck on a question?</h2><p>Take a photo with QuaptureIQ and explore an explanation. Practice first, then use the app to understand the steps.</p><div class="panel-actions"><a class="panel-btn" href="${PLAY_URL}" target="_blank" rel="noopener noreferrer">Explore QuaptureIQ ↗</a><a class="panel-link" href="mailto:quaptureiq.reviewer@gmail.com?subject=QuaptureIQ%20tester%20interest">Become a tester</a></div></div><span aria-hidden="true" style="font-size:4rem">📸</span></section>`;
  document.getElementById('term-select').addEventListener('change',e=>{term=Number(e.target.value);updateUrl();render();});
  document.getElementById('memo-toggle').addEventListener('click',e=>{const show=e.target.getAttribute('aria-pressed')!=='true';document.querySelectorAll('.memo').forEach(el=>el.classList.toggle('visible',show));e.target.setAttribute('aria-pressed',String(show));e.target.textContent=show?'Hide memorandum':'Show memorandum';});
  document.getElementById('print-paper').addEventListener('click',()=>window.print());
  const openPdf=document.getElementById('open-pdf-viewer');
  if(openPdf)openPdf.addEventListener('click',()=>{const preview=document.getElementById('original-pdf-preview');const visible=preview.hidden;preview.hidden=!visible;openPdf.setAttribute('aria-expanded',String(visible));openPdf.textContent=visible?'Hide PDF preview':'Preview PDF pages';});
  document.querySelector('.year-tabs').addEventListener('click',e=>{const b=e.target.closest('button[data-year]');if(!b)return;year=Number(b.dataset.year);updateUrl();render();document.getElementById('archive').scrollIntoView({block:'start'});});
}
if(!phase||!subject){target.innerHTML='<section class="container" style="padding:70px 0"><h1>Subject not found.</h1><p>Choose a grade and subject from the homepage.</p><a href="../">Back to Paper Club →</a></section>';}
else render();
document.getElementById('site-footer-slot').innerHTML=footerMarkup();
initTesterPopup();
initHeaderTTS();
initVisitorCounter();
