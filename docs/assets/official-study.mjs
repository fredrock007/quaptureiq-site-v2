/** FredRock Paper Club: genuine examination documents only. */
import {YEARS,phaseForGrade,subjectForGrade,PLAY_URL} from './catalog.mjs';
import {footerMarkup,initTesterPopup,initVisitorCounter,initHeaderTTS} from './shared.mjs';
import {mappedSubject} from './dbe-2022.mjs';
import {installCoverStyles,paperCover} from './paper-cover.mjs';

const qs=new URLSearchParams(location.search);
const grade=Number(qs.get('grade')||1);
const subject=subjectForGrade(grade,qs.get('subject'));
let year=YEARS.includes(Number(qs.get('year')))?Number(qs.get('year')):2026;
const phase=phaseForGrade(grade);
const target=document.getElementById('study-content');
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const session=y=>y===2026?'May/June NSC/SC':'November NSC';
const sourceUrl=y=>({
  2022:'https://www.education.gov.za/Curriculum/NationalSeniorCertificate%28NSC%29Examinations/2022NovemberExams.aspx',
  2023:'https://www.education.gov.za/Curriculum/NationalSeniorCertificate%28NSC%29Examinations/2023NSCNovemberpastpapers.aspx',
  2024:'https://www.education.gov.za/2024NSCNovemberpastpapers.aspx',
  2025:'https://www.education.gov.za/Curriculum/NationalSeniorCertificate%28NSC%29Examinations/2025NovemberExamPapers.aspx',
  2026:'https://www.education.gov.za/Curriculum/NationalSeniorCertificate%28NSC%29Examinations/2026MayJuneExamPapers.aspx'
}[y]);

const css=document.createElement('style');
css.textContent=`
  .real-hero{padding-bottom:26px}.real-hero h1{font-size:clamp(2rem,5vw,3.4rem);margin:15px 0}
  .real-note{background:#eef8f3;border:1px solid #c8e6d7;border-radius:12px;padding:13px 16px;margin:19px 0;color:#335c53}
  .real-year-nav{display:flex;gap:9px;flex-wrap:wrap;margin:21px 0 24px}
  .real-year-nav button{border:1px solid #caddd4;background:white;border-radius:10px;padding:12px 16px;font-weight:850;color:#1b504f;cursor:pointer}
  .real-year-nav button[aria-pressed=true]{color:white;background:#087e78;border-color:#087e78}
  .real-docs{display:grid;gap:12px}
  .real-document{padding:16px 17px;border:1px solid #d9e8e0;border-radius:14px;background:#fff}
  .real-document-top{display:flex;justify-content:space-between;align-items:center;gap:18px}
  .real-document .doc-type{font-size:.7rem;font-weight:950;color:#087e78;text-transform:uppercase;letter-spacing:.09em}
  .real-document h3{margin:4px 0;font-size:1rem;line-height:1.3}
  .real-document p{margin:0;color:#617178;font-size:.79rem}
  .real-actions{display:flex;gap:8px;flex-wrap:wrap}
  .real-actions a,.real-actions button{background:#eef8f3;border:1px solid #a7cfc3;border-radius:10px;padding:10px 12px;color:#087e78;font-family:inherit;font-weight:850;text-decoration:none;white-space:nowrap;font-size:.85rem;cursor:pointer}
  .real-actions a:hover,.real-actions button:hover{background:#d8f3e6}
  .real-main-link{display:inline-block;margin:17px 0;background:#087e78;color:#fff;text-decoration:none;font-weight:900;border-radius:12px;padding:12px 16px}
  .real-empty{border-radius:15px;border:1px dashed #c9d7ce;background:white;padding:24px;color:#425c61}
  .real-attribution{font-size:.84rem;color:#647780;margin-top:13px}
  @media(max-width:580px){.real-document-top{display:block}.real-actions{margin-top:12px}.real-actions a,.real-actions button{flex:1;text-align:center}}
  @media print{.real-year-nav,.real-actions,.quapture-panel{display:none!important}}
`;
document.head.appendChild(css);

function makeLink(doc){
  const download=new URL(doc.url);download.searchParams.set('forcedownload','true');
  const type=doc.kind==='memo'?'Memorandum':doc.kind==='supplement'?'Supporting document':'Exam paper';
  const isZip=doc.format==='ZIP'||/\.zip(?:[?#]|$)/i.test(doc.url);
  const origin=grade===12?'Department of Basic Education':doc.publisher==='Department of Basic Education'?'DBE · GEC pilot':`Eastern Cape · ${grade===9?'GEC assessment':'November exam'}`;
  return `<article class="real-document"><div class="real-document-top"><div class="fred-cover-layout">${paperCover({grade,year,subject:doc.subject,title:doc.title,kind:doc.kind,url:doc.url})}<div class="fred-cover-content"><span class="doc-type">${type}</span><h3>${esc(doc.title)}</h3><p>Grade ${grade} · ${esc(doc.subject)} · ${origin} ${year}${doc.session&&!(grade===9&&doc.publisher==='Department of Basic Education')?` · ${esc(doc.session)}`:''}${isZip?' · ZIP archive':''}</p></div></div><div class="real-actions">${isZip?'':`<a href="${esc(doc.url)}" target="_blank" rel="noopener noreferrer">View original ↗</a>`}<a href="${esc(isZip?doc.url:download.href)}" target="_blank" rel="noopener noreferrer">Download ${isZip?'ZIP':'↓'}</a></div></div></article>`;
}
installCoverStyles();

function render(){
  if(!phase||!subject){target.innerHTML='<section class="container"><h1>Subject not found.</h1><a href="../">Choose a grade →</a></section>';return;}
  document.title=`${subject.name} examination papers · Grade ${grade} | FredRock Paper Club`;
  target.innerHTML=`<section class="study-intro real-hero"><div class="study-breadcrumbs"><a href="../">Home</a> / <a href="../phase/${phase.id}/">${phase.name}</a> / <a href="../grade${grade}/">Grade ${grade}</a> / ${esc(subject.name)}</div>
    <span class="section-kicker">Real exam papers and memorandums</span><h1>Grade ${grade} ${esc(subject.name)}<br><em style="color:#087e78">Examination Archive.</em></h1>
    <p>Browse authentic, published examination papers. We only list documents with identifiable sources—no invented practice tests.</p></section>
    <section class="resource-panel" id="archive" aria-label="Official examination archive"><span class="section-kicker">Published exam material</span><h2>${year} papers and memorandums</h2>
    <div class="real-year-nav" aria-label="Choose examination year">${YEARS.map(y=>`<button type="button" data-year="${y}" aria-pressed="${y===year}">${y}</button>`).join('')}</div>
    <div id="official-results" role="region" aria-live="polite">Checking the published collection…</div>
    </section><section class="quapture-panel" style="max-width:880px;margin:28px auto 0"><div><span class="panel-kicker">Learn beyond the memo</span><h2>Need help understanding a question?</h2><p>Use <span aria-label="Capture Eye Queue">QuaptureIQ</span> to photograph a question and explore an explanation.</p><div class="panel-actions"><a class="panel-btn" target="_blank" rel="noopener noreferrer" href="${PLAY_URL}">Explore QuaptureIQ ↗</a><a class="panel-link" href="mailto:quaptureiq.reviewer@gmail.com?subject=QuaptureIQ%20tester%20interest">Become a tester</a></div></div><span aria-hidden="true" style="font-size:3rem">📸</span></section>`;
  document.querySelector('.real-year-nav').addEventListener('click',event=>{
    const button=event.target.closest('button[data-year]');if(!button)return;
    year=Number(button.dataset.year);
    const url=new URL(location.href);url.searchParams.set('year',year);history.replaceState(null,'',url);
    render();document.getElementById('archive').scrollIntoView({block:'start'});
  });
  loadResults(year);
}

async function loadResults(displayYear){
  const box=document.getElementById('official-results');
  if(grade===9||grade===11){
    try{
      const response=await fetch(new URL('./provincial-exams.json',import.meta.url));
      if(!response.ok)throw new Error('Provincial index unavailable');
      const data=await response.json();
      const provincial=data.documents.filter(doc=>doc.grade===grade&&doc.year===displayYear&&doc.subjectId===subject.id);
      let dbedocs=[];
      if(grade===9&&[2022,2023,2024].includes(displayYear)){
        try{
          const dbe=await fetch(new URL('./dbe-gec.json',import.meta.url));
          if(dbe.ok)dbedocs=(await dbe.json()).documents.filter(doc=>doc.year===displayYear&&doc.subjectId===subject.id);
        }catch{/* Provincial GEC files remain available as fallback. */}
      }
      const docs=(dbedocs.length?dbedocs:provincial)
        .sort((a,b)=>(a.paper||99)-(b.paper||99)||a.title.localeCompare(b.title));
      if(!box.isConnected||displayYear!==year)return;
      const directDBE=dbedocs.length>0;
      const source='https://www.ecexams.co.za/ExaminationPapers.htm';
      box.innerHTML=`<div class="real-note">🏛️ ${directDBE?'Department of Basic Education': 'Eastern Cape examination archive'} · Grade ${grade} · ${grade===9?'General Education Certificate assessments':'November examinations'} · ${displayYear}.</div>
        ${docs.length?`<p><strong>${docs.length} published source documents for ${esc(subject.name)}.</strong> ${directDBE?'Tap a paper cover to open the original PDF.':'Files open from their source. ZIP collections must be extracted to access their contents.'}</p><div class="real-docs">${docs.map(makeLink).join('')}</div>`:
          `<div class="real-empty"><strong>No ${displayYear} provincial papers indexed for this subject.</strong><p>Only published and identifiable sources are listed.</p></div>`}
        <a class="real-main-link" href="${directDBE?(displayYear===2024?'https://www.education.gov.za/GECTests2024.aspx':'https://www.education.gov.za/GEC'+displayYear+'.aspx'):source}" target="_blank" rel="noopener noreferrer">View the publisher's source index ↗</a>
        <p class="real-attribution">These original documents remain on the publisher's website, not on FredRock. Availability and file formats vary. ${grade===9?'GEC pilot assessments are not the same as standard school term exams.':''}</p>`;
    }catch{
      if(box.isConnected&&displayYear===year)box.innerHTML='<div class="real-empty">The provincial document index is temporarily unavailable. <a href="https://www.ecexams.co.za/ExaminationPapers.htm" target="_blank" rel="noopener noreferrer">Browse source ↗</a></div>';
    }
    return;
  }
  if(grade!==12){
    box.innerHTML=`<div class="real-empty"><strong>No verified ${displayYear} exam paper indexed for Grade ${grade} ${esc(subject.name)}.</strong>
      <p>Not every South African grade has a nationally published annual examination archive. FredRock will display a paper here only when its grade, subject and year can be verified.</p>
      <p>Teachers: if you hold the rights to share a genuine paper, <a href="mailto:quaptureiq.reviewer@gmail.com?subject=FredRock%20verified%20Grade%20${grade}%20paper%20contribution">contact FredRock to help fill this archive ↗</a>.</p>
      <p><a target="_blank" rel="noopener noreferrer" href="https://www.education.gov.za/Examinations/AnnualNationalAssessmentsANA/tabid/569/Default.aspx">DBE National Assessment resources ↗</a></p></div>`;
    return;
  }
  try{
    const response=await fetch(new URL(`./dbe-${displayYear}.json`,import.meta.url));
    if(!response.ok)throw new Error('Catalogue unavailable');
    const data=await response.json();
    let may=[];
    if(displayYear<2026){
      try{
        const mayResponse=await fetch(new URL(`./dbe-may-${displayYear}.json`,import.meta.url));
        if(mayResponse.ok)may=(await mayResponse.json()).documents.map(doc=>({...doc,session:'May/June'}));
      }catch{/* Keep verified November records. */}
    }
    const docs=[...data.documents.map(doc=>({...doc,session:displayYear===2026?'May/June':'November'})),...may].filter(doc=>mappedSubject(doc.subject)===subject.id).sort((a,b)=>(a.paper||99)-(b.paper||99)||({paper:0,memo:1,supplement:2}[a.kind]-{paper:0,memo:1,supplement:2}[b.kind])||a.title.localeCompare(b.title));
    if(!box.isConnected||displayYear!==year)return;
    const fullArchive=`../archive/${displayYear}/?subject=${encodeURIComponent(subject.id)}`;
    box.innerHTML=`<div class="real-note">🏛️ Department of Basic Education · Grade 12 · ${may.length?'November and May/June NSC/SC':session(displayYear)} ${displayYear}. ${displayYear===2026?'This is the May/June collection; November 2026 papers are not yet available.':''}</div>
      ${docs.length?`<p><strong>${docs.length} genuine DBE files found for ${esc(subject.name)}.</strong> Choose View or Download.</p><div class="real-docs">${docs.map(makeLink).join('')}</div>`:
        `<div class="real-empty">No official ${displayYear} files indexed for this subject in this examination session.</div>`}
      <a class="real-main-link" href="${fullArchive}">Browse the full ${displayYear} Grade 12 archive →</a>
      <p class="real-attribution">All files come directly from the <a href="${esc(sourceUrl(displayYear))}" target="_blank" rel="noopener noreferrer">Department of Basic Education ↗</a>. Copyright remains with the publisher. FredRock does not host copies.</p>`;
  }catch{
    if(box.isConnected&&displayYear===year)box.innerHTML=`<div class="real-empty">The ${displayYear} index could not load. <a href="${esc(sourceUrl(displayYear))}" target="_blank" rel="noopener noreferrer">Open the DBE archive ↗</a>.</div>`;
  }
}

render();
document.getElementById('site-footer-slot').innerHTML=footerMarkup();
initTesterPopup();initHeaderTTS();initVisitorCounter();
