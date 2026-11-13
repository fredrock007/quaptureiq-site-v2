import {subjectsForGrade} from './catalog.mjs';

// Small, accessible search interface reused on every Paper Club page.
const HOME = new URL('../', import.meta.url);

function addSearchStyles() {
  if (document.getElementById('fredrock-search-styles')) return;
  const style = document.createElement('style');
  style.id = 'fredrock-search-styles';
  style.textContent = [
    '.fr-search-wrap{background:#f7fbf8;border-bottom:1px solid #dbe9e1;padding:17px 0 18px;color:#152a35}',
    '.fr-search-inner{width:min(1140px,calc(100% - 38px));margin:auto;display:flex;align-items:end;gap:24px;justify-content:space-between}',
    '.fr-search-heading{flex:0 1 300px;min-width:185px}',
    '.fr-search-heading strong{display:block;font-size:1.16rem;line-height:1.3;font-weight:900;letter-spacing:-.025em}',
    '.fr-search-heading p{font-size:.81rem;color:#58726d;margin:4px 0 0;line-height:1.4}',
    '.fr-search-form{flex:1;display:grid;grid-template-columns:minmax(125px,.65fr) minmax(190px,1.3fr) auto;gap:11px;align-items:end}',
    '.fr-search-form label{display:flex;flex-direction:column;gap:4px;color:#345a55;font-size:.81rem;font-weight:800}',
    '.fr-search-form select{width:100%;min-width:0;padding:12px 35px 12px 12px;border:1px solid #adcfc4;border-radius:12px;background:#fff;color:#152a35;font:inherit;font-size:.95rem;font-weight:600;cursor:pointer}',
    '.fr-search-form select:disabled{opacity:.65;cursor:not-allowed}',
    '.fr-search-form button{padding:12px 18px;border:1px solid #c8a551;border-radius:12px;background:#ffda79;color:#162c34;font:inherit;font-size:.94rem;font-weight:900;white-space:nowrap;cursor:pointer;box-shadow:0 3px 0 #c9a450}',
    '.fr-search-form button:hover{background:#ffce5e}',
    '.fr-search-form button:focus-visible,.fr-search-form select:focus-visible{outline:3px solid #0a9287;outline-offset:2px}',
    '.fr-search-toast{position:fixed;top:clamp(75px,13vh,150px);left:50%;transform:translateX(-50%);z-index:10000;max-width:calc(100vw - 30px);min-width:min(330px,calc(100vw - 30px));background:#123c41;color:#fff;border:2px solid #ffda79;border-radius:17px;padding:15px 22px;text-align:center;box-shadow:0 15px 35px #081e2455;font-weight:850;font-size:1rem;pointer-events:none;animation:fr-search-enter .35s ease-out}',
    '.fr-search-toast strong{color:#ffe08a}',
    '.fr-search-toast .fr-confetti{position:absolute;left:50%;top:50%;width:8px;height:13px;opacity:0;border-radius:2px;background:var(--c);animation:fr-search-confetti 1.5s ease-out forwards;transform:translate(-50%,-50%)}',
    '@keyframes fr-search-enter{from{opacity:0;transform:translate(-50%,-15px)}to{opacity:1;transform:translate(-50%,0)}}',
    '@keyframes fr-search-confetti{0%{opacity:1;transform:translate(-50%,-50%) rotate(0)}100%{opacity:0;transform:translate(calc(-50% + var(--x)),calc(-50% + var(--y))) rotate(var(--r))}}',
    '@media(max-width:800px){.fr-search-inner{align-items:stretch;display:block}.fr-search-heading{margin-bottom:12px}.fr-search-form{grid-template-columns:minmax(0,1fr) minmax(0,1.35fr) auto}}',
    '@media(max-width:540px){.fr-search-wrap{padding:14px 0 16px}.fr-search-form{grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:10px}.fr-search-form button{grid-column:1/-1;width:100%}.fr-search-form select{padding:11px 9px;font-size:.88rem}.fr-search-heading strong{font-size:1.04rem}}',
    '@media(prefers-reduced-motion:reduce){.fr-search-toast,.fr-search-toast .fr-confetti{animation:none}}'
  ].join('\n');
  document.head.appendChild(style);
}

function showResultToast(grade, subject) {
  const previous = document.getElementById('fr-search-toast');
  if (previous) previous.remove();
  const toast = document.createElement('div');
  toast.id = 'fr-search-toast';
  toast.className = 'fr-search-toast';
  toast.setAttribute('role','status');
  toast.setAttribute('aria-live','polite');
  const label = document.createElement('strong');
  label.textContent = '🎉 Exam papers below!';
  const details = document.createElement('div');
  details.style.cssText='font-size:.82rem;font-weight:650;margin-top:3px;opacity:.94';
  details.textContent = 'Grade ' + grade + ' · ' + subject.name;
  toast.append(label,details);
  document.body.appendChild(toast);
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const palette = ['#ffda79','#68ddd2','#fd8f8a','#c4b5fd','#fff'];
    for (let i=0; i<30; i++) {
      const confetti = document.createElement('span');
      confetti.className = 'fr-confetti';
      confetti.style.setProperty('--c',palette[i%palette.length]);
      confetti.style.setProperty('--x',(Math.random()*500-250).toFixed(0)+'px');
      confetti.style.setProperty('--y',(Math.random()*260-130).toFixed(0)+'px');
      confetti.style.setProperty('--r',(Math.random()*720-360).toFixed(0)+'deg');
      confetti.style.animationDelay=(Math.random()*.24).toFixed(2)+'s';
      toast.appendChild(confetti);
    }
  }
  window.setTimeout(()=>toast.remove(),3900);
}

function revealSearchedPaper() {
  const params = new URLSearchParams(location.search);
  if (params.get('fromSearch')!=='1') return;
  const paper = document.querySelector('#official-results') || document.querySelector('#archive') || document.querySelector('.paper-sheet');
  if (!paper) return;
  const grade = Number(params.get('grade'));
  const subject = subjectsForGrade(grade).find(item=>item.id===params.get('subject'));
  if (!subject) return;
  params.delete('fromSearch');
  history.replaceState(null,'',location.pathname+'?'+params.toString()+location.hash);
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    const top = window.scrollY + paper.getBoundingClientRect().top;
    const offset = Math.min(180,Math.max(95,Math.round(window.innerHeight*.22)));
    window.scrollTo({top:Math.max(0,top-offset),behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
    paper.setAttribute('tabindex','-1');
    paper.focus({preventScroll:true});
    showResultToast(grade,subject);
  }));
}

export function initExamSearch() {
  if (document.getElementById('fr-search-form')) return;
  const anchor = document.querySelector('.phase-tabs-wrap') || document.querySelector('.site-header');
  if (!anchor) return;
  addSearchStyles();
  const section = document.createElement('section');
  section.className = 'fr-search-wrap';
  section.setAttribute('role','search');
  section.setAttribute('aria-label','Find genuine examination papers');
  section.innerHTML =
    '<div class="fr-search-inner">' +
      '<div class="fr-search-heading"><strong>🔎 Find an exam paper</strong><p>Choose your grade and exam subject to go straight to the paper.</p></div>' +
      '<form class="fr-search-form" id="fr-search-form">' +
        '<label for="fr-search-grade">Grade<select id="fr-search-grade" name="grade" required><option value="">Select grade</option></select></label>' +
        '<label for="fr-search-subject">Exam subject<select id="fr-search-subject" name="subject" required disabled><option value="">Select grade first</option></select></label>' +
        '<button type="submit">Search papers →</button>' +
      '</form>' +
    '</div>';
  anchor.insertAdjacentElement('afterend',section);
  const form = section.querySelector('form');
  const gradeField = section.querySelector('#fr-search-grade');
  const subjectField = section.querySelector('#fr-search-subject');
  for (let grade=1;grade<=12;grade++) gradeField.add(new Option('Grade '+grade,String(grade)));
  const params = new URLSearchParams(location.search);
  const presetGrade = document.body.dataset.grade || (location.pathname.includes('/study/')?params.get('grade'):null);
  const presetSubject = location.pathname.includes('/study/')?params.get('subject'):null;
  function updateSubjects(preferred) {
    const grade = Number(gradeField.value);
    const subjects = subjectsForGrade(grade);
    subjectField.replaceChildren(new Option(grade?'Select subject':'Select grade first',''));
    for (const subject of subjects) subjectField.add(new Option(subject.name,subject.id));
    subjectField.disabled = subjects.length===0;
    if (subjects.some(subject=>subject.id===preferred)) subjectField.value=preferred;
  }
  if (presetGrade && Number(presetGrade)>=1 && Number(presetGrade)<=12) gradeField.value=String(presetGrade);
  updateSubjects(presetSubject);
  gradeField.addEventListener('change',()=>updateSubjects());
  form.addEventListener('submit',event=>{
    event.preventDefault();
    if (!form.reportValidity()) return;
    const grade = Number(gradeField.value);
    const subject = subjectField.value;
    if (!subjectsForGrade(grade).some(item=>item.id===subject)) return;
    const target = new URL('study/',HOME);
    target.searchParams.set('grade',String(grade));
    target.searchParams.set('subject',subject);
    target.searchParams.set('term',location.pathname.includes('/study/')?(params.get('term')||'1'):'1');
    target.searchParams.set('year',location.pathname.includes('/study/')?(params.get('year')||'2026'):'2026');
    target.searchParams.set('fromSearch','1');
    location.assign(target.href);
  });
  revealSearchedPaper();
}
