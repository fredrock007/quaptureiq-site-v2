/** Direct links to DBE's genuine Grade 9 GEC pilot assessments (2022–2024).
 * All PDFs remain hosted on education.gov.za.
 */
import fs from 'node:fs/promises';

const website='https://www.education.gov.za/';
const years=[2022,2023,2024];
const records=[];
const decode=s=>String(s).replace(/&amp;/gi,'&').replace(/&nbsp;/gi,' ').replace(/&#39;/gi,"'").replace(/&quot;/gi,'"');
const plain=s=>decode(String(s).replace(/<[^>]+>/g,' ').replace(/\s+/g,' ')).trim();
const idFor=raw=>{
  const s=raw.toLowerCase().replace(/^grade\s*9\s*/,'').trim();
  if(/\b(ems|economic.*management)\b/.test(s))return'ems';
  if(/\bmaths|mathematics\b/.test(s))return'mathematics';
  if(/\bss\s*geography\b/.test(s))return'geography';
  if(/\bss\s*history\b/.test(s))return'history';
  if(/\bns\b|natural sciences/.test(s))return'natural-sciences';
  if(/\blo\b|life orientation/.test(s))return'life-orientation';
  if(/\b(dance|drama|music|visual)\b/.test(s))return'creative-arts';
  if(/\btechnology\b/.test(s))return'technology';
  for(const lang of ['afrikaans','english','isindebele','isixhosa','isizulu','sepedi','sesotho','setswana','siswati','tshivenda','xitsonga'])if(s.startsWith(lang))return lang;
  return'';
};
const chapterPattern=/<h[1-6]\b[^>]*>([\s\S]*?)<\/h[1-6]>/gi;
const anchorPattern=/<a\b([^>]*\bhref\s*=\s*["']([^"']+)["'][^>]*)>([\s\S]*?)<\/a>/gi;
async function archiveHtml(source){
  let lastError;
  for(let attempt=1;attempt<=4;attempt++){
    try{
      const response=await fetch(source,{headers:{'User-Agent':'Mozilla/5.0 FredRock-Paper-Club','Connection':'close'},signal:AbortSignal.timeout(40000)});
      if(!response.ok)throw new Error(`HTTP ${response.status}`);
      return await response.text();
    }catch(error){
      lastError=error;
      console.warn(`Temporary DBE archive error (${attempt}/4): ${error.message}`);
      if(attempt<4)await new Promise(resolve=>setTimeout(resolve,attempt*1200));
    }
  }
  throw new Error(`Could not fetch ${source}: ${lastError.message}`);
}
let archiveUnavailable=false;
for(const year of years){
  const source=website+(year===2024?'GECTests2024.aspx':`GEC${year}.aspx`);
  let html;
  try{html=await archiveHtml(source);}catch(error){
    console.warn(`DBE GEC live refresh unavailable: ${error.message}`);
    archiveUnavailable=true;
    break;
  }
  const chapters=[...html.matchAll(chapterPattern)].map(x=>({position:x.index,label:plain(x[1]).toLowerCase()}));
  let count=0;
  for(const match of html.matchAll(anchorPattern)){
    const title=plain(match[3]);
    if(!/^Grade\s*9\b/i.test(title))continue;
    const subjectId=idFor(title);if(!subjectId)continue;
    const url=new URL(decode(match[2]),website);
    if(url.hostname!=='www.education.gov.za'||url.pathname!=='/LinkClick.aspx')continue;
    const section=[...chapters].reverse().find(c=>c.position<match.index)?.label||'';
    const kind=/\bmemo\b/i.test(title)||section==='memos'||(/creative arts/i.test(section)&&/\bmemo\b/i.test(title))?'memo':'paper';
    const number=Number((title.match(/\b(?:Paper|P)\s*([123])\b/i)||[])[1])||null;
    records.push({grade:9,year,subject:title.replace(/^Grade\s*9\s*/i,''),subjectId,title,kind,paper:number,format:'PDF',url:url.href,publisher:'Department of Basic Education',session:'GEC pilot'});
    count++;
  }
  if(count<15)throw new Error(`GEC ${year}: expected at least 15 direct PDFs, got ${count}`);
  console.log(`DBE GEC ${year}: ${count} original links`);
}
if(archiveUnavailable){
  const existing=JSON.parse(await fs.readFile('docs/assets/dbe-gec.json','utf8'));
  if(!Array.isArray(existing.documents)||existing.documents.length<140){
    throw new Error('Cannot use existing DBE GEC index: verified backup is missing or incomplete.');
  }
  console.log(`Using ${existing.documents.length} previously verified DBE GEC links; preserving successful deployment.`);
}else{
const result={publisher:'Department of Basic Education',source:'https://www.education.gov.za/GECTests2024.aspx',notice:'GEC pilot assessment resources, not standard school examination papers. All PDFs are opened on the DBE website.',documents:[...new Map(records.map(r=>[r.year+'|'+r.url,r])).values()]};
await fs.writeFile('docs/assets/dbe-gec.json',JSON.stringify(result));
console.log(`Direct DBE GEC resources: ${result.documents.length}`);
}
