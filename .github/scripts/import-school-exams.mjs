/**
 * Original school-published examination PDFs, Grade 4, 5 and 8.
 * Source: Noah's Ark Academy's publicly accessible Past Exams page.
 * GitHub-hosted runners cannot consistently fetch this WordPress site,
 * so its original PDF URLs are captured in an audited source list.
 *
 * No PDFs are copied to FredRock. This creates a credited index of exact
 * publisher URLs, preserving their original filenames and source attribution.
 *
 * Only Term 2 and Term 4 PDFs with a grade, year and term explicitly encoded
 * in the filename are indexed. Tests, projects, assignments and practical
 * assessments are excluded at FredRock's request.
 */
import fs from 'node:fs/promises';
import crypto from 'node:crypto';

const SOURCE='https://noahsark.org.za/past-exams/';
const DEST='docs/assets/school-exams.json';
const PUBLISHER="Noah's Ark Academy";
const GRADES=[4,5,8];
const SUBJECTS=[
  [/NATURAL\s+SCIENCE(?:S)?\s*(?:&|AND|\+)\s*TECHNOLOGY|NATURAL\s+SCIENCE\s+TECHNOLOGY|\bN\s*&\s*T\b|\bNST\b/i,g=>g===8?'natural-sciences':'nst','Natural Sciences & Technology'],
  [/ECONOMIC\s*(?:&|AND)?\s*MANAGEMENT|\bEMS\b|\bLEMS\b/i,()=> 'ems','Economic & Management Sciences'],
  [/LIFE\s+ORIENTATION/i,()=> 'life-orientation','Life Orientation'],
  [/LIFE\s*SKILLS?/i,()=> 'life-skills','Life Skills'],
  [/CREATIVE\s+ARTS?/i,g=>g===8?'creative-arts':'life-skills','Creative Arts'],
  [/MATHEMATICS|\bMATHS?\b/i,()=> 'mathematics','Mathematics'],
  [/GEOGRAPHY|GEORGRAPHY/i,()=> 'geography','Geography'],
  [/HISTORY/i,()=> 'history','History'],
  [/ENGLISH|\bHL\s*PAPER|\bHL\s*P[1-3]\b|\bHL-PAPER|\bHOME\s+LANGUAGE\b/i,()=> 'english','English'],
  [/AFRIKAANS/i,()=> 'afrikaans','Afrikaans'],
  [/SETSWANA|SETSWNA/i,()=> 'setswana','Setswana'],
  [/ISIXHOSA/i,()=> 'isixhosa','isiXhosa'],
  [/ISIZULU/i,()=> 'isizulu','isiZulu'],
  [/SESOTHO/i,()=> 'sesotho','Sesotho'],
  [/NATURAL\s+SCIENCES?/i,g=>g===8?'natural-sciences':'nst','Natural Sciences'],
  [/TECHNOLOGY/i,g=>g===8?'technology':'nst','Technology'],
  [/VISUAL\s+ARTS?|DRAMATIC\s+ARTS?/i,g=>g===8?'creative-arts':'life-skills','Creative Arts']
];

function decode(s){
  return String(s).replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#0*39;/g,"'")
    .replace(/&#(\d+);/g,(_,n)=>String.fromCodePoint(Number(n)))
    .replace(/&nbsp;/g,' ').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
}

function collect(html){
  const documents=[];
  // Limit the source to the three named grade sections. The next grade
  // heading terminates the current section.
  const headings=[...html.matchAll(/<h3\b[^>]*class=["'][^"']*\baccordion_title\b[^"']*["'][^>]*>\s*Grade\s+([1-9])\s*<\/h3>/gi)];
  if(headings.length<3)throw new Error('School archive grade headings not found');
  for(let i=0;i<headings.length;i++){
    const grade=Number(headings[i][1]);
    if(!GRADES.includes(grade))continue;
    const section=html.slice(headings[i].index,headings[i+1]?.index??html.length);
    const links=section.matchAll(/<a\b([^>]*?)>([\s\S]*?)<\/a>/gi);
    for(const match of links){
      const href=match[1].match(/\bhref\s*=\s*["']([^"']+)["']/i)?.[1];
      const label=decode(match[2]);
      if(!href||!label)continue;
      let url;
      try{url=new URL(decode(href),SOURCE)}catch{continue}
      if(url.hostname!=='noahsark.org.za'||!['https:','http:'].includes(url.protocol))continue;
      if(url.pathname.includes('https:')||url.pathname.includes('http:'))continue;
      const filename=decodeURIComponent(url.pathname.split('/').pop()||'');
      const identity=filename.match(/^(20(?:22|23|24|25))-Grade-(4|5|8)-Term-([24])(?:-|[_.])/i);
      if(!identity||Number(identity[2])!==grade||!/\.pdf$/i.test(filename))continue;
      const year=Number(identity[1]),term=Number(identity[3]);
      const description=label+' '+filename.replace(/[-_]/g,' ');
      if(/\b(?:assignment|project|investigation|practical|controlled\s+test|control\s+test|assessment\s+task|revision|worksheet|case\s+study)\b/i.test(description))continue;
      // Some files are standalone tests rather than examination papers.
      if(/\b(?:test|quizz?es?|exercise)\b/i.test(description))continue;
      // Do not include religious studies not present in the CAPS navigation.
      if(/\b(?:bible|scripture)\b/i.test(description))continue;
      const subject=SUBJECTS.find(([pattern])=>pattern.test(description));
      if(!subject)continue;
      const [,subjectIdForGrade,name]=subject;
      const subjectId=subjectIdForGrade(grade);
      // The generic "HL Paper" fallback is only valid for English, never
      // for other languages explicitly identified by name.
      if(subjectId==='english'&&/(?:Setswana|Afrikaans|isiXhosa|isiZulu|Sesotho)/i.test(description)&&!/\bEnglish\b/i.test(description))continue;
      const kind=/\b(?:memo|memorandum|marking\s*guide|answers?)\b/i.test(description)?'memo':'paper';
      const paper=Number((label+' '+filename).match(/\b(?:Paper[-\s]*|P)([123])\b/i)?.[1])||null;
      url.protocol='https:';
      url.search='';url.hash='';
      const id=crypto.createHash('sha1').update(url.href).digest('hex').slice(0,14);
      documents.push({id:'school-'+id,grade,year,term,session:term===2?'June (Term 2)':'November (Term 4)',
        subjectId,subject:name,kind,paper,title:'Grade '+grade+' '+name+' · '+year+' Term '+term+' · '+label,
        format:'PDF',url:url.href,publisher:PUBLISHER,sourceUrl:SOURCE});
    }
  }
  // The school occasionally repeats one PDF URL with two differently worded
  // links. Publishing it once avoids fabricated duplicates.
  return [...new Map(documents.map(doc=>[doc.url,doc])).values()];
}

async function run(){
  const sourceList=await fs.readFile(new URL('./school-exams-source.txt',import.meta.url),'utf8');
  const gradeLinks=new Map(GRADES.map(grade=>[grade,[]]));
  for(const line of sourceList.split(/\r?\n/)){
    const relative=line.trim();
    if(!relative||relative.startsWith('#'))continue;
    const match=relative.match(/^\d{4}\/\d{2}\/(20(?:22|23|24|25))-Grade-(4|5|8)-Term-([24])[-_.][^\s]+\.pdf$/i);
    if(!match)throw new Error('Malformed verified school PDF path: '+relative);
    const grade=Number(match[2]);
    const label=relative.split('/').pop().replace(/^20\d{2}-Grade-[458]-Term-[24]-/i,'')
      .replace(/\.pdf$/i,'').replace(/[-_]/g,' ');
    gradeLinks.get(grade).push('<a href="https://noahsark.org.za/wp-content/uploads/'+relative+'">'+label+'</a>');
  }
  const html=GRADES.map(grade=>'<h3 class="accordion_title">Grade '+grade+'</h3>'+gradeLinks.get(grade).join('\n')).join('\n');
  const documents=collect(html);
  const counts=Object.fromEntries(GRADES.map(grade=>[grade,documents.filter(d=>d.grade===grade).length]));
  if(GRADES.some(grade=>counts[grade]<15)){
    throw new Error('School archive incomplete; keeping existing index: '+JSON.stringify(counts));
  }
  await fs.mkdir('docs/assets',{recursive:true});
  await fs.writeFile(DEST,JSON.stringify({sourceUrl:SOURCE,kind:'School-published past exams',documents},null,2)+'\n');
  console.log('Verified original school examination PDF links by grade: '+JSON.stringify(counts));
}
try{await run();}
catch(error){
  console.warn('School exam importer: '+error);
  try{await fs.access(DEST);console.log('Keeping previously validated school examination index.');}
  catch{console.warn('No previously saved school examination index.');}
}
