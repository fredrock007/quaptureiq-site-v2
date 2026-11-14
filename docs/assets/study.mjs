/** FredRock Paper Club: publisher-verified exam and assessment documents only. */
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
  .real-group-heading{font-size:1.25rem;color:#173541;margin:22px 0 8px}
  .real-group-intro{font-size:.9rem;color:#50666b;margin:0 0 14px}
  .real-resource-tag{display:inline-block;font-size:.69rem;font-weight:900;border-radius:999px;padding:5px 9px;background:#e7f1f8;color:#24556b;margin:4px 0 2px}
  @media(max-width:580px){.real-document-top{display:block}.real-actions{margin-top:12px}.real-actions a,.real-actions button{flex:1;text-align:center}}
  @media print{.real-year-nav,.real-actions,.quapture-panel{display:none!important}}
`;
document.head.appendChild(css);

function makeLink(doc){
  const download=new URL(doc.url);download.searchParams.set('forcedownload','true');
  const kind=/\b(?:answer\s*books?|data files?|addendum|annexure|supplement)\b/i.test(doc.title)?'supplement':doc.kind;
  const type=kind==='memo'?'Memorandum':kind==='supplement'?'Supporting document':'Exam paper';
  const isZip=doc.format==='ZIP'||/\.zip(?:[?#]|$)/i.test(doc.url);
  const origin=doc.publisher==="Noah's Ark Academy"?"Noah's Ark Academy · school examinations":doc.publisher==='North West Department of Education'?'North West · provincial examinations':grade===12?'Department of Basic Education':doc.publisher==='Department of Basic Education'?'DBE · GEC pilot':`Eastern Cape · ${grade===9?'GEC assessment':'November exam'}`;
  return `<article class="real-document"><div class="real-document-top"><div class="fred-cover-layout">${paperCover({grade,year,subject:doc.subject,title:doc.title,kind,url:doc.url})}<div class="fred-cover-content"><span class="doc-type">${type}</span><h3>${esc(doc.title)}</h3><p>Grade ${grade} · ${esc(doc.subject)} · ${origin} ${year}${doc.session&&!(grade===9&&doc.publisher==='Department of Basic Education')?` · ${esc(doc.session)}`:''}${isZip?' · ZIP archive':''}</p></div></div><div class="real-actions">${isZip?'':`<a href="${esc(doc.url)}" target="_blank" rel="noopener noreferrer">View original ↗</a>`}<a href="${esc(isZip?doc.url:download.href)}" target="_blank" rel="noopener noreferrer">Download ${isZip?'ZIP':'↓'}</a></div></div></article>`;
}

function makePrimaryLink(doc){
  const label=doc.type==='olympiad'?(doc.kind==='memo'?'Olympiad memorandum':'Olympiad paper'):doc.type==='diagnostic'?'Diagnostic assessment':'School-based assessment exemplar';
  const fileYear=doc.year||'Undated';
  return `<article class="real-document"><div class="real-document-top"><div class="fred-cover-layout">${paperCover({grade,year:doc.year||'CAPS',subject:subject.name,title:doc.title,kind:doc.kind,url:doc.url})}<div class="fred-cover-content"><span class="real-resource-tag">${esc(label)}</span><h3>${esc(doc.title)}</h3><p>${esc(doc.publisher)} · ${fileYear}${doc.grades.length>1?' · Covers Grades '+doc.grades.join(', '):''}</p></div></div><div class="real-actions"><a href="${esc(doc.url)}" target="_blank" rel="noopener noreferrer">Open PDF ↗</a><a href="${esc(doc.sourceUrl)}" target="_blank" rel="noopener noreferrer">Publisher ↗</a></div></div></article>`;
}

async function fetchNorthWest(displayYear){
  if(displayYear!==2024)return [];
  const response=await fetch(new URL('./nw-exams.json',import.meta.url));
  if(!response.ok)throw new Error('North West examination index unavailable');
  const data=await response.json();
  if(!Array.isArray(data.documents))throw new Error('Invalid North West examination index');
  return data.documents;
}

async function fetchSchoolExams(displayYear){
  if(displayYear<2022||displayYear>2025)return [];
  const response=await fetch(new URL('./school-exams.json',import.meta.url));
  if(!response.ok)throw new Error('School examination index unavailable');
  const data=await response.json();
  if(!Array.isArray(data.documents))throw new Error('Invalid school examination index');
  return data.documents;
}

async function loadPrimaryResults(displayYear,box){
  try{
    const response=await fetch(new URL('./primary-resources.json',import.meta.url));
    if(!response.ok)throw new Error('Primary resource index unavailable');
    const data=await response.json();
    if(!Array.isArray(data.documents))throw new Error('Invalid resource index');
    const matching=data.documents.filter(doc=>doc.grades.includes(grade)&&doc.subjectIds.includes(subject.id));
    const dated=matching.filter(doc=>doc.year===displayYear).sort((a,b)=>a.type.localeCompare(b.type)||a.title.localeCompare(b.title));
    const undated=matching.filter(doc=>doc.year==null).sort((a,b)=>a.title.localeCompare(b.title));
    let provincial=[];
    if(grade===6||grade===7){
      try{
        provincial=(await fetchNorthWest(displayYear)).filter(doc=>doc.grade===grade&&doc.subjectId===subject.id)
          .sort((a,b)=>a.session.localeCompare(b.session)||(a.paper||99)-(b.paper||99)||a.title.localeCompare(b.title));
      }catch{/* Keep the DBE and SAASTA collections visible if provincial site is down. */}
    }
    let school=[];
    if([4,5,8].includes(grade)){
      try{
        school=(await fetchSchoolExams(displayYear)).filter(doc=>doc.grade===grade&&doc.year===displayYear&&doc.subjectId===subject.id)
          .sort((a,b)=>a.term-b.term||(a.paper||99)-(b.paper||99)||a.title.localeCompare(b.title));
      }catch{/* Preserve the official DBE and SAASTA resources when the school index is unavailable. */}
    }
    if(!box.isConnected||displayYear!==year)return;
    box.innerHTML=`<div class="real-note">🏛️ Verified publisher documents for Grade ${grade}. ${provincial.length?'The North West provincial records are actual 2024 exam papers and memorandums. ':''}${school.length?'The academy papers below are original school publications, not national or provincial government examinations. ':''}School-based exemplars, diagnostic items and Olympiad papers are <strong>not standard school term examinations</strong>.</div>
      ${school.length?`<h3 class="real-group-heading">${displayYear} school examination papers</h3><p class="real-group-intro"><strong>${school.length} original Noah's Ark Academy document${school.length===1?'':'s'} for ${esc(subject.name)}.</strong> June and November school examinations, credited to the school that published them. Tap a cover to open the original PDF.</p><div class="real-docs">${school.map(makeLink).join('')}</div><p class="real-attribution">Source: <a href="https://noahsark.org.za/past-exams/" target="_blank" rel="noopener noreferrer">Noah's Ark Academy past exams ↗</a>. These are school-published papers, not Department of Basic Education papers.</p>`:''}
      ${provincial.length?`<h3 class="real-group-heading">${displayYear} provincial examination papers</h3><p class="real-group-intro"><strong>${provincial.length} North West examination document${provincial.length===1?'':'s'}.</strong> Tap a cover to open the original official PDF.</p><div class="real-docs">${provincial.map(makeLink).join('')}</div><p class="real-attribution">Source: <a href="https://education.nwpg.gov.za/?page_id=4644" target="_blank" rel="noopener noreferrer">North West Department of Education ↗</a>.</p>`:''}
      <h3 class="real-group-heading">${displayYear} published papers &amp; assessments</h3>
      ${dated.length?`<p class="real-group-intro"><strong>${dated.length} verified ${displayYear} document${dated.length===1?'':'s'}.</strong> Tap a cover to open the original PDF from its publisher.</p><div class="real-docs">${dated.map(makePrimaryLink).join('')}</div>`:
        `<div class="real-empty"><strong>No additional Grade ${grade} ${esc(subject.name)} assessment dated ${displayYear} in this collection.</strong><p>Grades 1–8 do not have a complete national annual school exam archive. Undated official exemplar material is shown below where available.</p></div>`}
      ${undated.length?`<h3 class="real-group-heading">Official CAPS assessment exemplars</h3><p class="real-group-intro">${undated.length} Department of Basic Education booklet${undated.length===1?'':'s'} covering assessment tasks for this subject. <strong>These booklets are not dated ${displayYear} exams</strong>; many cover an entire grade band.</p><div class="real-docs">${undated.map(makePrimaryLink).join('')}</div>`:''}
      <p class="real-attribution">The PDFs open directly from their original publishers and retain their copyright. This catalogue does not claim these exemplars were written as official ${displayYear} school examinations. <a href="https://www.education.gov.za/Curriculum/NationalCurriculumStatementsGradesR-12/SBAExemplars.aspx" target="_blank" rel="noopener noreferrer">DBE SBA collection ↗</a>${matching.some(doc=>doc.type==='olympiad')?' · <a href="https://www.saasta.ac.za/competitions/natural-science-olympiad/" target="_blank" rel="noopener noreferrer">SAASTA past-paper collection ↗</a>':''}.</p>`;
  }catch{
    if(box.isConnected&&displayYear===year)box.innerHTML='<div class="real-empty">The Grade 1–8 resource index could not load. <a href="https://www.education.gov.za/Curriculum/NationalCurriculumStatementsGradesR-12/SBAExemplars.aspx" target="_blank" rel="noopener noreferrer">Browse verified DBE assessment exemplars ↗</a></div>';
  }
}
installCoverStyles();

function render(){
  if(!phase||!subject){target.innerHTML='<section class="container"><h1>Subject not found.</h1><a href="../">Choose a grade →</a></section>';return;}
  document.title=`${subject.name} published exam resources · Grade ${grade} | FredRock Paper Club`;
  target.innerHTML=`<section class="study-intro real-hero"><div class="study-breadcrumbs"><a href="../">Home</a> / <a href="../phase/${phase.id}/">${phase.name}</a> / <a href="../grade${grade}/">Grade ${grade}</a> / ${esc(subject.name)}</div>
    <span class="section-kicker">Verified publisher resources</span><h1>Grade ${grade} ${esc(subject.name)}<br><em style="color:#087e78">Examination Archive.</em></h1>
    <p>Browse authentic published papers and assessments, clearly identified by type and publisher. No invented practice tests.</p></section>
    <section class="resource-panel" id="archive" aria-label="Official examination archive"><span class="section-kicker">Published exam material</span><h2>${year} papers and assessment resources</h2>
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
  if(grade>=1&&grade<=8){await loadPrimaryResults(displayYear,box);return;}
  if(grade===10){
    try{
      const docs=(await fetchNorthWest(displayYear)).filter(doc=>doc.grade===10&&doc.subjectId===subject.id)
        .sort((a,b)=>a.session.localeCompare(b.session)||(a.paper||99)-(b.paper||99)||a.title.localeCompare(b.title));
      if(!box.isConnected||displayYear!==year)return;
      box.innerHTML=`<div class="real-note">🏛️ North West Department of Education · Grade 10 · ${displayYear}. Verified provincial papers and marking guidelines, where published.</div>
        ${docs.length?`<p><strong>${docs.length} genuine ${displayYear} examination document${docs.length===1?'':'s'} for ${esc(subject.name)}.</strong> Tap the front-page thumbnail to open the original exam PDF.</p><div class="real-docs">${docs.map(makeLink).join('')}</div>`:
        `<div class="real-empty"><strong>No verified Grade 10 ${esc(subject.name)} exam paper indexed for ${displayYear} yet.</strong><p>The provincial archive currently supplies 2024 Grade 10 exams. Other years will appear when publisher-verified papers are indexed.</p></div>`}
        <a class="real-main-link" href="https://education.nwpg.gov.za/?page_id=4644" target="_blank" rel="noopener noreferrer">View North West's original examination archive ↗</a>
        <p class="real-attribution">Original PDFs remain on the North West Department of Education's website. FredRock lists only identifiable publisher files; availability varies by subject and session.</p>`;
    }catch{
      if(box.isConnected&&displayYear===year)box.innerHTML='<div class="real-empty">The provincial document index is currently unavailable. <a href="https://education.nwpg.gov.za/?page_id=4644" target="_blank" rel="noopener noreferrer">Browse the North West examination archive ↗</a></div>';
    }
    return;
  }
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
