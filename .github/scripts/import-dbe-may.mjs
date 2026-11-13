/** Index real DBE Grade 12 May/June NSC/SC papers (2022–2025).
 * We link to the DBE's original files; no PDF is copied into GitHub.
 */
import fs from 'node:fs/promises';
const root='https://www.education.gov.za/';
const sources=new Map([
  [2022,root+'Curriculum/NationalSeniorCertificate%28NSC%29Examinations/2022MayJuneExamPapers.aspx'],
  [2023,root+'Curriculum/NationalSeniorCertificate%28NSC%29Examinations/2023MayJuneExamPapers.aspx'],
  [2024,root+'Curriculum/NationalSeniorCertificate%28NSC%29Examinations/2024MayJuneExamPapers.aspx'],
  [2025,root+'LinkClick.aspx?link=5475&mid=4149&portalid=0&tabid=338']
]);
const clean=s=>String(s).replace(/<[^>]*>/g,' ').replace(/&amp;/gi,'&').replace(/&#39;/gi,"'").replace(/&nbsp;/gi,' ').replace(/&quot;/gi,'"').replace(/\s+/g,' ').trim();
const heading=/<h2\b[^>]*>\s*<span\b[^>]*class=["'][^"']*eds_containerTitle[^"']*["'][^>]*>([\s\S]*?)<\/span>/gi;
const link=/<td\b[^>]*class=["'][^"']*\bTitleCell\b[^"']*["'][^>]*>\s*<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
async function getHtml(url){
  let error;
  for(let attempt=1;attempt<=4;attempt++){
    try{
      const response=await fetch(url,{headers:{'User-Agent':'Mozilla/5.0 FredRock-Paper-Club','Connection':'close'},signal:AbortSignal.timeout(45000)});
      if(!response.ok)throw new Error('HTTP '+response.status);
      const html=await response.text();
      if(html.length<30000)throw new Error('Unexpectedly short HTML archive');
      return html;
    }catch(e){
      error=e;
      if(attempt<4)await new Promise(resolve=>setTimeout(resolve,1000*attempt));
    }
  }
  throw error;
}
for(const [year,source] of sources){
  const output='docs/assets/dbe-may-'+year+'.json';
  let html;
  try{html=await getHtml(source);}catch(e){
    console.warn('DBE May/June '+year+' unavailable: '+e.message+'; retaining any existing index.');
    continue;
  }
  const chapters=[...html.matchAll(heading)].map(x=>({at:x.index,subject:clean(x[1])}));
  const docs=[];let chapter=-1;
  for(const match of html.matchAll(link)){
    while(chapter+1<chapters.length&&chapters[chapter+1].at<match.index)chapter++;
    const subject=chapters[chapter]?.subject;
    if(!subject||/^(non.languages|language papers|contents|may\/june)/i.test(subject))continue;
    const url=new URL(match[1].replace(/&amp;/gi,'&'),root);
    if(url.hostname!=='www.education.gov.za'||url.pathname!=='/LinkClick.aspx')continue;
    const title=clean(match[2]);
    if(!title||/^Download$/i.test(title))continue;
    const kind=/memo|memorandum|marking guideline/i.test(title)?'memo':/data files?|answer\s*book|addendum|ppt|audio|supplement|annexure/i.test(title)?'supplement':'paper';
    const paper=Number((title.match(/\b(?:Paper|Memo|P)\s*([123])\b/i)||[])[1])||null;
    docs.push({subject,title,kind,paper,session:'May/June',url:url.href});
  }
  const unique=[...new Map(docs.map(d=>[d.subject+'|'+d.title+'|'+d.url,d])).values()];
  if(unique.length<130){
    console.warn('DBE May/June '+year+' produced only '+unique.length+' links; preserving prior verified index.');
    continue;
  }
  const result={grade:12,year,session:'May/June NSC/SC',source,publisher:'Department of Basic Education',
    notice:'Original examination papers and memorandums remain on education.gov.za. FredRock indexes verified source links only.',
    documents:unique};
  await fs.writeFile(output,JSON.stringify(result));
  console.log('DBE Grade 12 May/June '+year+': '+unique.length+' original links; '+new Set(unique.map(d=>d.subject)).size+' subjects');
}
