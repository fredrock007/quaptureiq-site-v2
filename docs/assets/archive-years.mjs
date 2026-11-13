/** First-party catalogue UI for official Grade 12 documents hosted by DBE. */
import {mappedSubject} from './dbe-2022.mjs';
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const label={paper:'Question paper',memo:'Memorandum',supplement:'Supporting file'};

function row(doc,year){
  const download=new URL(doc.url);download.searchParams.set('forcedownload','true');
  const preview=doc.kind!=='supplement';
  return `<article class="dbe-doc-row"><div class="dbe-doc-top"><div><strong>${escape(doc.title)}</strong><small>${label[doc.kind]||'Official document'} · DBE ${year}</small></div><div class="dbe-doc-actions">${preview?'<button class="dbe-preview-button" type="button" aria-expanded="false">Preview first page ▣</button>':''}<a href="${escape(doc.url)}" target="_blank" rel="noopener noreferrer">View ↗</a><a href="${escape(download.href)}" target="_blank" rel="noopener noreferrer">Download ↓</a></div></div>${preview?`<div class="dbe-pdf-preview" data-pdf="${escape(doc.url)}" hidden><p>Showing the original PDF from the Department of Basic Education. If your device cannot display it here, choose View.</p></div>`:''}</article>`;
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
    .dbe-doc-row{padding:13px;background:#fffdf8;border:1px solid #e0e8e1;border-radius:11px}
    .dbe-doc-top{display:flex;justify-content:space-between;align-items:center;gap:14px}
    .dbe-doc-row strong{display:block;color:#152a35;font-size:.94rem}
    .dbe-doc-row small{display:block;color:#668087;font-size:.79rem;margin-top:3px}
    .dbe-doc-actions{display:flex;gap:7px;flex-wrap:wrap}
    .dbe-doc-actions a,.dbe-doc-actions button{background:#f1faf5;border:1px solid #baded0;border-radius:9px;padding:9px 11px;color:#087e78;text-decoration:none;font-family:inherit;font-size:.84rem;font-weight:850;white-space:nowrap;cursor:pointer}
    .dbe-pdf-preview{border-top:1px solid #d7e5de;margin-top:13px;padding-top:12px}
    .dbe-pdf-preview p{font-size:.8rem;color:#60757b;margin:0 0 8px}
    .dbe-pdf-preview iframe{border:1px solid #d1dfd6;border-radius:9px;width:100%;height:min(65vh,650px);min-height:360px;background:#eee}
    @media(max-width:520px){.dbe-doc-top{display:block}.dbe-doc-actions{margin-top:10px}.dbe-doc-actions a,.dbe-doc-actions button{flex:1;text-align:center}}
  `;
  document.head.appendChild(style);
  result.addEventListener('click',event=>{
    const button=event.target.closest('.dbe-preview-button');if(!button)return;
    const preview=button.closest('.dbe-doc-row').querySelector('.dbe-pdf-preview');
    if(!preview)return;
    preview.hidden=!preview.hidden;
    button.setAttribute('aria-expanded',String(!preview.hidden));
    button.textContent=preview.hidden?'Preview first page ▣':'Hide preview ×';
    if(!preview.hidden&&!preview.querySelector('iframe')){
      const frame=document.createElement('iframe');
      frame.title='Original DBE exam PDF first-page preview';
      frame.loading='lazy';frame.referrerPolicy='no-referrer';
      frame.src=preview.dataset.pdf+'#page=1&toolbar=0&navpanes=0';
      preview.appendChild(frame);
    }
  });
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
