/**
 * Index directly published North West Department of Education provincial exams.
 * This imports URL metadata only. PDFs remain with the department.
 *
 * The official Assessment page groups June/November 2024 documents in
 * labelled tab panels. It contains published Grade 6, Grade 7 and Grade 10
 * exam question papers and marking guidelines.
 */
import fs from 'node:fs/promises';
import crypto from 'node:crypto';

const SOURCE='https://education.nwpg.gov.za/?page_id=4644';
const DEST='docs/assets/nw-exams.json';
const PUBLISHER='North West Department of Education';
const PANELS=[
  {id:'ctu-ulitate-style-13-id-135',grade:6,year:2024,session:'May/June'},
  {id:'ctu-ulitate-style-13-id-136',grade:6,year:2024,session:'November'},
  {id:'ctu-ulitate-style-13-id-137',grade:7,year:2024,session:'May/June'},
  {id:'ctu-ulitate-style-14-id-119',grade:10,year:2024,session:'May/June'},
  {id:'ctu-ulitate-style-14-id-120',grade:10,year:2024,session:'November'}
];
const SUBJECTS=[
  [/TECHNICAL\s+MATHE?MATICS|TECHNIESE\s+WISKUNDE/i,'technical-mathematics','Technical Mathematics'],
  [/TECHNICAL\s+SCIENCES|TEGNIESE\s+WETENSKAPPE/i,'technical-sciences','Technical Sciences'],
  [/MATHEMATICAL\s+LITERACY|MATHS?\s*LIT/i,'math-lit','Mathematical Literacy'],
  [/PHYSICAL\s+SCIENCES?/i,'physical-sciences','Physical Sciences'],
  [/LIFE\s+SCIENCES?/i,'life-sciences','Life Sciences'],
  [/AGRICULTURAL\s+SCIENCES?/i,'agricultural-sciences','Agricultural Sciences'],
  [/COMPUTER\s+APPLICATIONS?\s+TECHNOLOGY|\bCAT\b/i,'cat','Computer Applications Technology'],
  [/INFORMATION\s+TECHNOLOGY|\bIT\b/i,'it','Information Technology'],
  [/ENGINEERING\s+GRAPHICS?\s*(?:AND|&|\+)\s*DESIGN|\bEGD\b/i,'egd','Engineering Graphics & Design'],
  [/LIFE\s+ORIENTATION/i,'life-orientation','Life Orientation'],
  [/VISUAL\s+ARTS?/i,'visual-arts','Visual Arts'],
  [/DRAMATIC\s+ARTS?/i,'dramatic-arts','Dramatic Arts'],
  [/BUSINESS\s+STUDIES?/i,'business-studies','Business Studies'],
  [/ACCOUNTING/i,'accounting','Accounting'],
  [/ECONOMICS/i,'economics','Economics'],
  [/NATURAL\s+SCIENCES?\s*(?:&|AND|\+)\s*TECH|NS\s*&\s*TECH|NS\s*AND\s*TECH|NS\s*&\s*TEG|NST\s*&?\s*ECH/i,'nst','Natural Sciences & Technology'],
  [/LIFE\s+SKILLS?/i,'life-skills','Life Skills'],
  [/SOCIAL\s+SCIENCES?\s*:?\s*GEOGRAPHY|\bSS\s*GEO|GEOGRAPHY|GOGRAPHY/i,'geography','Geography'],
  [/SOCIAL\s+SCIENCES?\s*:?\s*HISTORY|\bSS\s*HISTORY|HISTORY/i,'history','History'],
  [/MATHEMATICS|\bMATHS?\b|\bWISKUNDE\b/i,'mathematics','Mathematics'],
  [/ENGLISH|\bENG\s+(?:FAL|HL)\b/i,'english','English'],
  [/AFRIKAANS|\bAFR\s+(?:FAL|HL|HT)\b/i,'afrikaans','Afrikaans'],
  [/ISIXHOSA/i,'isixhosa','isiXhosa'],
  [/ISIZULU/i,'isizulu','isiZulu'],
  [/SESOTHO/i,'sesotho','Sesotho'],
  [/SETSWANA/i,'setswana','Setswana'],
  [/SEPEDI/i,'sepedi','Sepedi'],
  [/SISWATI/i,'siswati','siSwati'],
  [/TOURISM/i,'tourism','Tourism'],
  [/CONSUMER\s+STUDIES?/i,'consumer-studies','Consumer Studies'],
  [/TECHNOLOGY/i,'technology','Technology'],
  [/\bEMS\b|ECONOMIC.*MANAGEMENT/i,'ems','Economic & Management Sciences']
];
function decode(s){
  return String(s).replace(/&amp;/g,'&').replace(/&quot;/g,'"')
    .replace(/&#(\d+);/g,(_,code)=>String.fromCodePoint(Number(code)))
    .replace(/&nbsp;/g,' ').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
}
function panelHTML(html,id){
  const marker=new RegExp(`<div\\b(?=[^>]*\\bid="${id}")[^>]*>`,'i');
  const match=marker.exec(html);
  if(!match)return '';
  const begin=match.index+match[0].length;
  // The official site's published tab panels contain <p><a> rows only.
  return html.slice(begin,html.indexOf('</div>',begin));
}
function parsePanel(html,panel){
  const chunk=panelHTML(html,panel.id);
  if(!chunk)return [];
  const documents=[];
  const rx=/<a\b([^>]*?)>([\s\S]*?)<\/a>/gi;
  for(const match of chunk.matchAll(rx)){
    const href=match[1].match(/\bhref\s*=\s*["']([^"']+)["']/i)?.[1];
    const originalTitle=decode(match[2]);
    if(!href||!originalTitle)continue;
    let url;
    try{url=new URL(decode(href),SOURCE)}catch{continue}
    if(!['education.nwpg.gov.za','desd.nwpg.gov.za'].includes(url.hostname))continue;
    if(!/\.pdf$/i.test(url.pathname))continue;
    url.protocol='https:';
    // Four Grade 7 EMS November files were placed under the Grade 6 tab.
    const grade=panel.grade===6&&/\b(?:NW\s*7|GR\s*7)\s+EMS\b/i.test(originalTitle)?7:panel.grade;
    const found=SUBJECTS.find(([rx])=>rx.test(originalTitle));
    if(!found)continue; // Keep unrecognised streams out of unrelated subjects.
    const [unused,subjectId,subject]=found;
    const kind=/\b(?:MG|MEMO|MARKING\s+GUIDELINES?|NR|NASIENRIGLYNE)\b/i.test(originalTitle)?'memo':
      /\b(?:AB|ANSWER\s*BOOK|ADDENDUM|\bADD\b)\b/i.test(originalTitle)?'supplement':
      /\b(?:QP|QUESTION\s*PAPER|VR|VRAESTEL)\b/i.test(originalTitle)?'paper':null;
    if(!kind)continue;
    const paper=Number(originalTitle.match(/\bP([12])\b/i)?.[1])||null;
    const id=crypto.createHash('sha1').update(url.href).digest('hex').slice(0,14);
    documents.push({id:'nw-'+id,grade,year:panel.year,session:panel.session,subjectId,subject,
      paper,kind,title:originalTitle,format:'PDF',url:url.href,publisher:PUBLISHER,sourceUrl:SOURCE});
  }
  return documents;
}

async function run(){
  let html;
  for(let attempt=1;attempt<=3;attempt++){
    try{
      const response=await fetch(SOURCE,{headers:{'User-Agent':'Mozilla/5.0 FredRock-Paper-Club-V2'},signal:AbortSignal.timeout(35000)});
      if(!response.ok)throw new Error('HTTP '+response.status);
      html=await response.text();break;
    }catch(error){
      if(attempt===3)throw error;
      await new Promise(resolve=>setTimeout(resolve,1000*attempt));
    }
  }
  const all=PANELS.flatMap(p=>parsePanel(html,p));
  const unique=[...new Map(all.map(doc=>[doc.url,doc])).values()];
  const counts=Object.fromEntries([6,7,10].map(g=>[g,unique.filter(x=>x.grade===g).length]));
  if((counts[10]||0)<40||(counts[6]||0)<20){
    throw new Error('NW index incomplete, refusing to replace previously validated data: '+JSON.stringify(counts));
  }
  await fs.mkdir('docs/assets',{recursive:true});
  await fs.writeFile(DEST,JSON.stringify({sourceUrl:SOURCE,examYear:2024,documents:unique},null,2)+'\n');
  console.log('Verified North West provincial exam PDFs by grade: '+JSON.stringify(counts));
}
try{
  await run();
}catch(error){
  console.warn('NW importer: '+error);
  try{await fs.access(DEST);console.log('Keeping previously validated North West catalogue.')}
  catch{console.warn('No existing NW catalogue; this source will be temporarily unavailable.')}
}
