// FredRock Paper Club V2. Subjects follow DBE CAPS phase structures.
// This is a navigation catalogue, not a claim that each subject has a formal paper every year.
export const PHASES = [
  {id:'foundation',name:'Foundation Phase',short:'Foundation',grades:[1,2,3],icon:'🌱',strap:'Build confident reading, writing and number skills.',desc:'Language, Mathematics and Life Skills for the first three school years.'},
  {id:'intermediate',name:'Intermediate Phase',short:'Intermediate',grades:[4,5,6],icon:'📚',strap:'Explore ideas and practise across more subjects.',desc:'Languages, Mathematics, Natural Sciences & Technology, Social Sciences and Life Skills.'},
  {id:'senior',name:'Senior Phase',short:'Senior',grades:[7,8,9],icon:'🔬',strap:'Get ready for greater independence.',desc:'Languages, Mathematics, Natural Sciences, Technology, EMS, Social Sciences, Creative Arts and Life Orientation.'},
  {id:'fet',name:'FET Phase',short:'FET',grades:[10,11,12],icon:'🎓',strap:'Study with purpose. Prepare for what comes next.',desc:'Compulsory subjects and popular elective pathways towards the NSC.'}
];
export const YEARS = [2026,2025,2024,2023,2022];
export const TERMS = [1,2,3,4];
export const PLAY_URL='https://play.google.com/store/apps/details?id=com.quaptureiq.app';
export const TESTER_EMAIL='quaptureiq.reviewer@gmail.com';
export const ORIGINAL_SITE='https://fredrock007.github.io/quaptureiq-site/';

const language=(id,name,icon='💬')=>({id,name,type:'language',icon,desc:`Reading, language and writing practice in ${name}. Choose Home or First Additional Language as taught at your school.`,tags:['Languages','HL / FAL'],color:'#f0e7ff'});
export const LANGUAGES = [
  language('english','English','📖'),language('afrikaans','Afrikaans','✏️'),language('isixhosa','isiXhosa'),language('isizulu','isiZulu','📗'),
  language('sesotho','Sesotho'),language('setswana','Setswana'),language('sepedi','Sepedi'),language('siswati','siSwati'),
  language('isindebele','isiNdebele'),language('tshivenda','Tshivenda'),language('xitsonga','Xitsonga')
];
const S=(id,name,icon,desc,tags=[],color='#e8f0ff',type='core')=>({id,name,icon,desc,tags,type,color});

const foundation=[
  S('mathematics','Mathematics','➗','Number sense, patterns, shapes, measurement and problem-solving.',['Numbers','Numeracy'],'#e6edff'),
  S('life-skills','Life Skills','🌱','Beginning Knowledge, personal well-being, Creative Arts and physical education.',['Well-being','Activities'],'#fff2ce')
];
const intermediate=[
  S('mathematics','Mathematics','➗','Whole numbers, fractions, decimals, shapes and problem-solving.',['Maths','Numbers'],'#e6edff'),
  S('nst','Natural Sciences & Technology','🔬','Living things, matter, energy and designing solutions.',['Science','Technology'],'#e7f7dc'),
  S('geography','Social Sciences: Geography','🌍','Maps, places, climate and people in the environment.',['Social Sciences','Geography'],'#e3f3f7'),
  S('history','Social Sciences: History','🏺','Historical sources, people, events and change over time.',['Social Sciences','History'],'#e8edff'),
  S('life-skills','Life Skills','🎨','Personal and social well-being, Creative Arts and physical education.',['Well-being','Activities'],'#fff2ce')
];
const senior=[
  S('mathematics','Mathematics','➗','Integers, algebra, geometry and data handling.',['Maths','Problem-solving'],'#e6edff'),
  S('natural-sciences','Natural Sciences','🔬','Life and living, matter, energy and Earth systems.',['Science','Experiments'],'#e7f7dc'),
  S('technology','Technology','🛠️','Design processes, structures, systems and practical projects.',['Design','Structures'],'#ffeddc'),
  S('ems','Economic & Management Sciences (EMS)','💼','The economy, entrepreneurship and financial literacy.',['EMS','Business'],'#e7f0ff'),
  S('geography','Social Sciences: Geography','🌍','Maps, weather, settlements and the environment.',['Geography','Social Sciences'],'#e3f3f7'),
  S('history','Social Sciences: History','🏺','Historical interpretation, societies, sources and events.',['History','Social Sciences'],'#e8edff'),
  S('life-orientation','Life Orientation','🌱','Personal well-being, citizenship, careers and physical education.',['Well-being','Careers'],'#fff2ce'),
  S('creative-arts','Creative Arts','🎨','Visual Arts, Music, Drama and Dance practice.',['Arts','Creativity'],'#f4e9fa')
];
const fet=[
  S('mathematics','Mathematics','➗','Algebra, functions, trigonometry, calculus and statistics.',['Core option','Mathematics'],'#e6edff'),
  S('math-lit','Mathematical Literacy','🧮','Everyday finance, measurement, maps, plans and data.',['Core option','Mathematical Literacy'],'#e0efff'),
  S('life-orientation','Life Orientation','🌱','Citizenship, healthy choices, career planning and study skills.',['Compulsory','Careers'],'#fff2ce'),
  S('physical-sciences','Physical Sciences','⚗️','Physics, chemistry, mechanics, waves and reactions.',['Elective','Science'],'#e7f7dc','extra'),
  S('life-sciences','Life Sciences','🧬','Cells, biodiversity, human systems, genetics and ecology.',['Elective','Biology'],'#e6f6e8','extra'),
  S('geography','Geography','🌍','Climate, geomorphology, development and mapwork.',['Elective','Mapwork'],'#e3f3f7','extra'),
  S('history','History','🏺','Historical inquiry, evidence, change and political transformations.',['Elective','Sources'],'#e8edff','extra'),
  S('accounting','Accounting','📒','Financial records, statements, reconciliations and ethics.',['Elective','Finance'],'#fff0dd','extra'),
  S('business-studies','Business Studies','💼','Business environments, ventures, operations and roles.',['Elective','Business'],'#e7f0ff','extra'),
  S('economics','Economics','📈','Markets, macroeconomics, microeconomics and development.',['Elective','Economy'],'#eff4db','extra'),
  S('cat','Computer Applications Technology (CAT)','💻','Productivity tools, information management and systems technologies.',['Elective','Computing'],'#e6ebff','extra'),
  S('it','Information Technology (IT)','⌨️','Programming, databases, hardware, networks and problem-solving.',['Elective','Coding'],'#e9e4ff','extra'),
  S('tourism','Tourism','🧳','Travel, destinations, sustainable tourism and customer care.',['Elective','Travel'],'#e5f4f0','extra'),
  S('consumer-studies','Consumer Studies','🛍️','Consumer choices, nutrition, textiles and entrepreneurship.',['Elective','Life skills'],'#fff0e7','extra'),
  S('agricultural-sciences','Agricultural Sciences','🌾','Soil, animal systems, plants and sustainable agriculture.',['Elective','Agriculture'],'#e8f4dd','extra'),
  S('egd','Engineering Graphics & Design','📐','Orthographic projection, design and technical drawing.',['Elective','Engineering'],'#e3edfa','extra'),
  S('visual-arts','Visual Arts','🖌️','Art theory, visual literacy and creative processes.',['Elective','Arts'],'#fae9f3','extra'),
  S('dramatic-arts','Dramatic Arts','🎭','Performance, theatre history and dramatic analysis.',['Elective','Arts'],'#f8e8f2','extra')
];

export function phaseForGrade(grade){return PHASES.find(p=>p.grades.includes(Number(grade)));}
export function subjectsForGrade(grade){
  const p=phaseForGrade(grade);if(!p)return [];
  const base=p.id==='foundation'?foundation:p.id==='intermediate'?intermediate:p.id==='senior'?senior:fet;
  // Language options appear in all four phases; each school offers its own selected languages.
  return [...base.map(s=>({...s})),...LANGUAGES.map(s=>({...s}))];
}
export function subjectForGrade(grade,id){return subjectsForGrade(grade).find(s=>s.id===id);}
export function gradeCollectionUrl(grade){return `https://studypapers.co.za/grade-${grade}/`;}
export function capsUrl(grade){
  const p=phaseForGrade(grade);
  return p?.id==='foundation'?'https://www.education.gov.za/Curriculum/CurriculumAssessmentPolicyStatements(CAPS)/CAPSFoundation.aspx':
    p?.id==='intermediate'?'https://www.education.gov.za/Curriculum/CurriculumAssessmentPolicyStatements(CAPS)/CAPSIntermediate.aspx':
    p?.id==='senior'?'https://www.education.gov.za/Curriculum/CurriculumAssessmentPolicyStatements(CAPS)/CAPSSenior.aspx':
    'https://www.education.gov.za/Curriculum/CurriculumAssessmentPolicyStatements(CAPS)/CAPSFET.aspx';
}
export const KNOWN_COLLECTIONS={
  3:{mathematics:'https://studypapers.co.za/grade-3/mathematics-grade-3/'},
  4:{mathematics:'https://studypapers.co.za/grade-4/mathematics-grade-4/'},
  5:{mathematics:'https://studypapers.co.za/grade-5/mathematics-grade-5/'},
  6:{mathematics:'https://studypapers.co.za/grade-6/mathematics-grade-6/'},
  7:{mathematics:'https://studypapers.co.za/grade-7/mathematics-grade-7/',english:'https://studypapers.co.za/grade-7/english-grade-7/',afrikaans:'https://studypapers.co.za/grade-7/afrikaans-grade-7/',
    'natural-sciences':'https://studypapers.co.za/grade-7/latest-natural-sciences-grade-7/',technology:'https://studypapers.co.za/grade-7/technology-grade-7-2/',ems:'https://studypapers.co.za/grade-7/economics-management-and-science-ems-grade-7/',
    geography:'https://studypapers.co.za/geography-grade-7-exam-papers-and-tests-with-memos/',history:'https://studypapers.co.za/grade-7/grade-7-histor/',
    'life-orientation':'https://studypapers.co.za/grade-7/life-orientation-grade-7/','creative-arts':'https://studypapers.co.za/grade-7/creative-arts-grade-7/',
    isixhosa:'https://studypapers.co.za/grade-7/isixhosa-grade-7/',isizulu:'https://studypapers.co.za/grade-7/isizulu-grade-7/'}
};
export function subjectCollectionUrl(grade,id){return KNOWN_COLLECTIONS[grade]?.[id]||gradeCollectionUrl(grade);}
