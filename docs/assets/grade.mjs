import {PHASES,YEARS,subjectsForGrade,phaseForGrade,PLAY_URL} from './catalog.mjs';
import {initVisitorCounter,initHeaderTTS,toggleFredRockSpeech} from './shared.mjs';
const grade=Number(document.body.dataset.grade);
const phase=phaseForGrade(grade);
const subjects=subjectsForGrade(grade);
const grid=document.getElementById('subject-grid');
const search=document.getElementById('subject-search');
const summary=document.getElementById('results-summary');
let category='all',term='all',year=2026;

function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function card(subject){
  const location=`../study/?grade=${grade}&subject=${encodeURIComponent(subject.id)}&term=${term==='all'?1:term}&year=${year}`;
  const kind=subject.type==='core'?'Core subject':subject.type==='extra'?'Elective subject':'Language option';
  const tags=subject.tags.map(tag=>`<span>${esc(tag)}</span>`).join('');
  return `<article class="subject-card"><div class="card-top"><span class="subject-icon" style="--tile:${subject.color}" aria-hidden="true">${subject.icon}</span><span class="card-category">${kind}</span></div><h3>${esc(subject.name)}</h3><p>${esc(subject.desc)}</p><div class="subject-tags">${tags}</div><a class="card-link" href="${location}" aria-label="Open on-site ${esc(subject.name)} resources">Open on-site resources <span aria-hidden="true">→</span></a><small class="card-note">Original practice + 2022–2026 source archive</small></article>`;
}
function render(){
  const q=search.value.trim().toLowerCase();
  const matching=subjects.filter(s=>(category==='all'||s.type===category||(category==='core'&&['english','afrikaans','isixhosa','isizulu'].includes(s.id)))&&(!q||`${s.name} ${s.desc} ${s.tags.join(' ')}`.toLowerCase().includes(q)));
  grid.innerHTML=matching.map(card).join('');
  document.getElementById('empty-state').style.display=matching.length?'none':'block';
  summary.textContent=`Showing ${matching.length} of ${subjects.length} subject options`;
}
document.getElementById('category-pills').addEventListener('click',ev=>{
  const b=ev.target.closest('button[data-category]');if(!b)return;
  category=b.dataset.category;
  document.querySelectorAll('#category-pills button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
  render();
});
document.getElementById('term-pills').addEventListener('click',ev=>{
  const b=ev.target.closest('button[data-term]');if(!b)return;
  term=b.dataset.term;
  document.querySelectorAll('#term-pills button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
  render();
});
document.getElementById('year-pills').addEventListener('click',ev=>{
  const b=ev.target.closest('button[data-year]');if(!b)return;
  year=Number(b.dataset.year);
  document.querySelectorAll('#year-pills button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
  render();
});
search.addEventListener('input',render);

document.getElementById('share-btn').addEventListener('click',async()=>{
  const button=document.getElementById('share-btn');
  try{if(navigator.share){await navigator.share({title:`Grade ${grade} Paper Club`,text:`Free Grade ${grade} practice and paper archive`,url:location.href});return;}
    if(navigator.clipboard){await navigator.clipboard.writeText(location.href);button.textContent='✓ Link copied!';setTimeout(()=>button.textContent='Share this page',2500);return;}
  }catch(e){if(e.name==='AbortError')return;}
  window.prompt('Copy this link:',location.href);
});

const audioButton=document.getElementById('welcome-audio');
const audioLabel=audioButton.querySelector('.audio-label');
const audioIcon=audioButton.querySelector('.play-circle');
function resetAudio(){audioButton.setAttribute('aria-pressed','false');audioButton.setAttribute('aria-label','Play the FredRock welcome message');audioLabel.textContent='Listen to your FredRock welcome';audioIcon.textContent='▶';}
function activeAudio(){audioButton.setAttribute('aria-pressed','true');audioButton.setAttribute('aria-label','Stop the FredRock welcome message');audioLabel.textContent='Stop welcome audio';audioIcon.textContent='■';}
audioButton.addEventListener('click',()=>{
  if(!window.speechSynthesis||typeof SpeechSynthesisUtterance==='undefined'){audioLabel.textContent='Audio unavailable in this browser';return;}
  toggleFredRockSpeech(audioButton,`Welcome to Grade ${grade} Paper Club, brought to you by FredRock. Find practice questions, check your answers, and discover past paper collections from 2022 to 2026. If you need an explanation, explore QuaptureIQ. Happy learning!`,resetAudio,activeAudio);
});
window.addEventListener('pagehide',()=>window.speechSynthesis?.cancel());

const dialog=document.getElementById('tester-dialog');
const KEY='fredrock_quapture_testers_dismissed';
const dismissed=()=>{try{return sessionStorage.getItem(KEY)==='yes';}catch{return false;}};
const remember=()=>{try{sessionStorage.setItem(KEY,'yes');}catch{}};
document.getElementById('tester-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('close',remember);
dialog.querySelectorAll('.tester-actions a').forEach(a=>a.addEventListener('click',()=>dialog.close()));
window.setTimeout(()=>{if(!dismissed()&&!dialog.open&&typeof dialog.showModal==='function'&&document.visibilityState==='visible')dialog.showModal();},5000);
render();
initHeaderTTS();
initVisitorCounter();
