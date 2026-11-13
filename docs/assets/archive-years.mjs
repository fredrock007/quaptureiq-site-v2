/** First-party catalogue UI for official Grade 12 documents hosted by DBE. */
import {mappedSubject} from './dbe-2022.mjs';
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const label={paper:'Question paper',memo:'Memorandum',supplement:'Supporting file'};

function row(doc,year){
  const download=new URL(doc.url);download.searchParams.set('forcedownload','true');
  return `<article class="dbe-doc-row"><div><strong>${escape(doc.title)}</strong><small>${label[doc.kind]||'Official document'} · DBE ${year}</small></div><div class="dbe-doc-actions"><a href="${escape(doc.url)}" target="_blank" rel="noopener noreferrer">View ↗</a><a href="${escape(download.href)}" target="_blank" rel="noopener noreferrer">Download ↓</a></div></article>`;
}
export async function mountYearArchivePage(year){
  const subject=document.getElementById('archive-subject');
  const query=document.getElementById('archive-query');
  const kind=document.getElementById('archive-kind');
  const result=document.getElementById('archive-results');
  const count=document.getElementById('archive-count');
  if(!subject||!query||!kind||!result||!count)return;
  const style=document.createElement('style');
  style.textContent=`
    .dbe-doc-list{display:grid;gap:9px;padding:14px}
    .dbe-doc-row{display:flex;justify-content:space-between;align-items:center;gap:14px;padding:13px;background:#fffdf8;border:1px solid #e0e8e1;border-radius:11px}
    .dbe-doc-row strong{display:block;color:#152a35;font-size:.94rem}
    .dbe-doc-row small{display:block;color:#668087;font-size:.79rem;margin-top:3px}
    .dbe-doc-actions{display:flex;gap:7px;flex-wrap:wrap}
    .dbe-doc-actions a{background:#f1faf5;border:1px solid #baded0;border-radius:9px;padding:9px 11px;color:#087e78;text-decoration:none;font-size:.84rem;font-weight:850;white-space:nowrap}
    @media(max-width:520px){.dbe-doc-row{display:block}.dbe-doc-actions{margin-top:10px}.dbe-doc-actions a{flex:1;text-align:center}}
  `;
  document.head.appendChild(style);
  try{
    const response=await fetch(new URL(`./dbe-${year}.json`,import.meta.url));
    if(!response.ok)throw new Error('Catalogue unavailable');
    const data=await response.json();
    const groups=[...new Set(data.documents.map(x=>x.subject))].sort((a,b)=>a.localeCompare(b));
    for(const g of groups)subject.add(new Option(g,g));
    const requested=new URL(location.href).searchParams.get('subject');
    const chosen=groups.find(g=>mappedSubject(g)===requested||g.toLowerCase()===requested?.toLowerCase());
    if(chosen)subject.value=chosen;
    document.getElementById('archive-total').textContent=`${data.documents.length} official files · ${groups.length} subjects`;
    const draw=()=>{
      const q=query.value.trim().toLowerCase();
      const matches=data.documents.filter(d=>(!subject.value||d.subject===subject.value)&&(!kind.value||d.kind===kind.value)&&(!q||`${d.subject} ${d.title}`.toLowerCase().includes(q)));
      const names=[...new Set(matches.map(d=>d.subject))].sort((a,b)=>a.localeCompare(b));
      count.textContent=`${matches.length} documents found in ${names.length} subjects`;
      result.innerHTML=names.length?names.map((name,index)=>{
        const docs=matches.filter(d=>d.subject===name).sort((a,b)=>(a.paper||99)-(b.paper||99)||({paper:0,memo:1,supplement:2}[a.kind]-{paper:0,memo:1,supplement:2}[b.kind])||a.title.localeCompare(b.title));
        return `<details class="archive-group" ${subject.value||q||kind.value||index===0?'open':''}><summary><span>📘 ${escape(name)}</span><span class="archive-group-count">${docs.length} files ▾</span></summary><div class="dbe-doc-list">${docs.map(d=>row(d,year)).join('')}</div></details>`;
      }).join(''):'<div class="archive-empty">No documents match your search. Try another subject or paper number.</div>';
    };
    for(const field of [subject,kind,query])field.addEventListener(field===query?'input':'change',draw);
    draw();
  }catch{
    count.textContent='Index temporarily unavailable';
    result.innerHTML='<div class="archive-empty">This official index could not load. Please try again later.</div>';
  }
}
