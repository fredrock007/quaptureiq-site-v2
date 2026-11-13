/** Index externally hosted Eastern Cape exam documents. No exam files are copied. */
import fs from 'node:fs/promises';

const origin='https://www.ecexams.co.za/';
const years=[2022,2023,2024,2025,2026];
const entity=s=>String(s).replace(/&(?:amp|quot|lt|gt|nbsp|#39|#\d+);/gi,m=>({ '&amp;':'&','&quot;':'"','&lt;':'<','&gt;':'>','&nbsp;':' ','&#39;':"'"}[m.toLowerCase()]??(/&#\d+;/i.test(m)?String.fromCodePoint(Number(m.slice(2,-1))):m)));
const text=s=>entity(String(s).replace(/<script\b[\s\S]*?<\/script>/gi,'').replace(/<style\b[\s\S]*?<\/style>/gi,'').replace(/<br\s*\/?\s*>/gi,' ').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ')).trim();
const anchors=s=>[...String(s).matchAll(/<a\b([^>]*?)>([\s\S]*?)<\/a>/gi)].map(m=>({url:entity((m[1].match(/\bhref\s*=\s*["']([^"']+)["']/i)||[])[1]||''),title:text(m[2])})).filter(x=>x.url&&!/^(?:mailto:|javascript:|#)/i.test(x.url));
const tags=(s,tag)=>[...s.matchAll(new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}>`,'gi'))].map(m=>m[1]);
const absolute=href=>new URL(href,origin).href;

const IDs={
  'mathematical literacy':'math-lit','mathematics':'mathematics',
  'physical sciences':'physical-sciences','life sciences':'life-sciences',
  'agricultural sciences':'agricultural-sciences','business studies':'business-studies',
  'economics':'economics','geography':'geography','history':'history',
  'accounting':'accounting','english':'english','afrikaans':'afrikaans',
  'natural sciences':'natural-sciences','economic and management sciences':'ems',
  'technology':'technology','life orientation':'life-orientation',
  'isixhosa':'isixhosa','isizulu':'isizulu','isindebele':'isindebele',
  'sepedi':'sepedi','sesotho':'sesotho','setswana':'setswana','siswati':'siswati',
  'tshivenda':'tshivenda','xitsonga':'xitsonga','music':'creative-arts',
  'dance':'creative-arts','drama':'creative-arts','visual arts':'creative-arts'
};
function subjectId(s){
  const name=text(s).replace(/\b(paper|p)\s*[123]\b.*$/i,'').replace(/\b(hl|fal|ht|eat|eat|huistaal|home language|first additional language)\b.*$/i,'').replace(/\b(ns)\b/gi,'Natural Sciences').replace(/\b(ems)\b/gi,'').replace(/[()]/g,' ').trim().toLowerCase();
  return Object.entries(IDs).find(([key])=>name===key||name.startsWith(key+' '))?.[1]||'';
}
const documents=[];
const seen=new Set();
function add({year,grade,subject,title,kind,href}){
  if(!href||!/(\.pdf|\.zip|\.docx?|\.xlsx?)(?:[?#]|$)/i.test(href))return;
  const subjectKey=subjectId(subject||title);
  if(!subjectKey)return;
  const url=absolute(href);const key=`${year}|${grade}|${kind}|${url}`;
  if(seen.has(key))return;seen.add(key);
  const paper=Number((title.match(/\b(?:P|Paper)\s*([123])\b/i)||[])[1])||null;
  documents.push({year,grade,subject:subject.trim(),subjectId:subjectKey,title:title.trim(),paper,kind,url,format:/\.zip(?:[?#]|$)/i.test(url)?'ZIP':'PDF'});
}

// Province's 2023-26 Grade 11 tables put subject in column one, question
// paper in column two, and memo in the last column. Blank cells stay blank.
function parseGrade11Table(html,year){
  for(const row of tags(html,'tr')){
    const cells=tags(row,'td');if(cells.length<3)continue;
    const subject=text(cells[0]);if(!/\bP\s*[12]\b/i.test(subject)||!subjectId(subject))continue;
    for(const a of anchors(cells[1]))add({year,grade:11,subject,title:subject,kind:'paper',href:a.url});
    for(const a of anchors(cells.at(-1)))add({year,grade:11,subject,title:`${subject} memorandum`,kind:'memo',href:a.url});
  }
}

// 2022 has a timetable-style layout, with titled paper links and separate
// 'Memo' links. Index only links whose subject and type are unambiguous.
function parseGrade11Schedule(html,year){
  for(const a of anchors(html)){
    if(!subjectId(a.title)||!/\b(?:P|Paper)\s*[12]\b/i.test(a.title))continue;
    add({year,grade:11,subject:a.title,title:a.title,kind:/\bmemo\b/i.test(a.title)?'memo':'paper',href:a.url});
  }
}
function parseGECTable(html,year){
  for(const row of tags(html,'tr')){
    const cells=tags(row,'td');if(cells.length<3)continue;
    const subject=text(cells[0]);if(!subjectId(subject))continue;
    for(const a of anchors(cells[1]))add({year,grade:9,subject,title:subject,kind:'paper',href:a.url});
    for(const a of anchors(cells[2]))add({year,grade:9,subject,title:`${subject} memorandum`,kind:'memo',href:a.url});
  }
}
function parseGECList(html,year){
  for(const a of anchors(html)){
    if(!subjectId(a.title))continue;
    add({year,grade:9,subject:a.title,title:`${a.title} paper & memo collection`,kind:'supplement',href:a.url});
  }
}

async function obtain(url){
  const result=await fetch(url,{headers:{'User-Agent':'Mozilla/5.0 (compatible; FredRockPaperClubIndexer/1.0)'},signal:AbortSignal.timeout(25000)});
  if(!result.ok)throw new Error(`HTTP ${result.status}`);
  return result.text();
}
for(const year of years){
  const pages=[
    {grade:11,path:`${year}_November_Gr_11_Exams.htm`},
    {grade:9,path:`${year}GEC.htm`}
  ];
  for(const p of pages){
    try{
      const html=await obtain(origin+p.path);
      if(p.grade===11)(year===2022?parseGrade11Schedule:parseGrade11Table)(html,year);
      else(year<=2023?parseGECList:parseGECTable)(html,year);
      console.log(`Eastern Cape ${year} Grade ${p.grade}: indexed ${documents.filter(d=>d.year===year&&d.grade===p.grade).length} links`);
    }catch(error){console.warn(`Eastern Cape ${p.path}: ${error.message}`);}
  }
}
if(!documents.length)throw new Error('No provincial exam documents could be indexed');
await fs.mkdir('docs/assets',{recursive:true});
await fs.writeFile('docs/assets/provincial-exams.json',JSON.stringify({publisher:'Eastern Cape examinations archive',source:origin+'ExaminationPapers.htm',fetched:new Date().toISOString().slice(0,10),documents}));
console.log(`Provincial document index: ${documents.length} links`);
