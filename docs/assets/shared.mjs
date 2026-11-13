import {PLAY_URL,TESTER_EMAIL,ORIGINAL_SITE} from './catalog.mjs';
export const LOGO_URL=`${ORIGINAL_SITE}assets/quaptureiq-logo.webp`;
const mail=`mailto:${TESTER_EMAIL}?subject=QuaptureIQ%20tester%20interest&body=Hello%2C%20I%20would%20like%20to%20test%20QuaptureIQ.%20My%20Gmail%20address%20is%3A%20`;
export function promoMarkup(){return `<section class="quapture-panel" aria-labelledby="quapture-title"><div><span class="panel-kicker">From FredRock · QuaptureIQ closed testing</span><h2 id="quapture-title">Turn a difficult question into an opportunity to learn.</h2><p>Working through a paper and need an explanation? <strong aria-label="Capture Eye Queue">QuaptureIQ</strong> can analyse a photo of a question and help you understand the answer. We're inviting <strong>teachers, learners and parents</strong> to test it and shape a better learning experience.</p><div class="panel-actions"><a class="panel-btn" href="${mail}">Become a tester →</a><a class="panel-link" href="${PLAY_URL}" target="_blank" rel="noopener noreferrer">View QuaptureIQ on Google Play ↗</a></div></div><img class="brand-art" src="${LOGO_URL}" alt="QuaptureIQ official logo" width="215" height="120" loading="lazy"></section>`;}

// Slots for original, short GIFs made from Fred's QuaptureIQ video demonstrations.
// GIF files are not invented: the source recordings still need to be provided or located.
const DEMO_ROOT=new URL('./',import.meta.url).href;
export function showcaseMarkup(){
  const cards=[
    {kind:'questions',file:'demo-question-workflow.gif',title:'Questions Mode',description:'Take a photo, tap Answer Questions, and see the explanation.',alt:'Looping QuaptureIQ demonstration: capture a Geography question, tap Answer Questions, and view the answer.',post:'https://lnkd.in/p/dgDY5GNj'},
    {kind:'diagrams',file:'demo-heart-labels.gif',title:'Heart Diagram Labels',description:'See the actual human heart diagram, numbered labels, and AI explanation.',alt:'Looping QuaptureIQ demonstration: human heart diagram with numbered labels, followed by labelled answers.',post:'https://lnkd.in/p/dGVfqs3S'},
    {kind:'vault',file:'demo-review-vault.gif',title:'Review Vault',description:'Zoom in on Review Vault, open a saved heart label, and review its answer.',alt:'Looping QuaptureIQ demonstration: zoom in on the Review Vault button, open the saved heart label and read the answer.',post:'https://lnkd.in/p/dGVfqs3S'}
  ];
  const cardMarkup=cards.map(card=>[
    '<article class="demo-card" data-gif="',card.kind,'">',
    '<div class="demo-visual"><img src="',DEMO_ROOT,card.file,'" alt="',card.alt,'" loading="lazy" decoding="async">',
    '<span class="demo-loop">↻ Repeats automatically</span></div>',
    '<strong>',card.title,'</strong><p>',card.description,'</p>',
    '<small><a href="',card.post,'" target="_blank" rel="noopener noreferrer">Watch FredRock’s full video ↗</a></small></article>'
  ].join('')).join('');
  return '<section class="demo-showcase" id="quapture-demos" aria-labelledby="demos-heading"><span class="section-kicker">See learning in action</span><h2 id="demos-heading">QuaptureIQ demonstrations<span style="color:#ff8e5c">.</span></h2><p class="section-desc">Three short, silent GIFs from FredRock’s own QuaptureIQ demonstrations. They play continuously so you can follow each step at a glance.</p><div class="demo-grid">'+cardMarkup+'</div><a class="demo-link" href="'+PLAY_URL+'" target="_blank" rel="noopener noreferrer">Explore QuaptureIQ on Google Play ↗</a></section>';
}

export function footerMarkup(){return `<footer class="site-footer"><div class="container footer-row"><div><strong>FredRock Paper Club 📚</strong>Making schoolwork a little less stressful.</div><div>Free resources • South African CAPS<br>Official papers remain credited to their original publishers.</div></div><div class="container copyright">© 2026 FredRock. All rights reserved.</div></footer>`;}

// The website's own spoken audio is controlled here; Chrome's built-in
// Read Aloud may use its own pronunciation engine, independent of Web Speech.
let playing=null;
function stopPlaying(){
  const previous=playing;
  playing=null;
  if(previous)previous.reset();
}
export function toggleFredRockSpeech(button,message,reset,setPlaying){
  const speech=window.speechSynthesis;
  if(!speech||typeof SpeechSynthesisUtterance==='undefined')return false;
  if(playing?.button===button){speech.cancel();stopPlaying();return false;}
  speech.cancel();stopPlaying();
  const spoken=message.replace(/QuaptureIQ/gi,'Capture eye queue');
  const utterance=new SpeechSynthesisUtterance(spoken);
  utterance.lang='en-ZA';utterance.rate=.92;
  const voices=speech.getVoices();
  utterance.voice=voices.find(v=>v.lang.toLowerCase()==='en-za')||voices.find(v=>v.lang.toLowerCase()==='en-gb')||voices.find(v=>v.lang.toLowerCase().startsWith('en'))||null;
  playing={button,reset};
  utterance.onend=()=>{if(playing?.button===button)stopPlaying();};
  utterance.onerror=()=>{if(playing?.button===button)stopPlaying();};
  setPlaying();
  speech.speak(utterance);
  return true;
}

export function initHeaderTTS(){
  const nav=document.querySelector('.site-header .nav-side');
  if(!nav||document.getElementById('header-tts'))return;
  const button=document.createElement('button');
  button.type='button';button.id='header-tts';button.className='header-tts';button.setAttribute('aria-pressed','false');
  button.setAttribute('aria-label','Play the FredRock website welcome message');
  button.innerHTML='<span class="header-tts-icon" aria-hidden="true">🔊</span><span class="header-tts-label">Listen</span>';
  nav.insertBefore(button,nav.querySelector('.nav-badge'));
  const label=button.querySelector('.header-tts-label');
  const grade=Number(document.body.dataset.grade)||0;
  const welcome=grade?`Welcome to Grade ${grade} Paper Club, brought to you by FredRock.`:'Welcome to FredRock Paper Club, your free South African study corner.';
  const script=`${welcome} Choose a grade and subject, practise questions, and check memorandums. Need help understanding a question? Explore QuaptureIQ, an app that helps you learn from photographs. Happy learning!`;
  const reset=()=>{button.setAttribute('aria-pressed','false');button.setAttribute('aria-label','Play the FredRock website welcome message');label.textContent='Listen';};
  const active=()=>{button.setAttribute('aria-pressed','true');button.setAttribute('aria-label','Stop the FredRock website welcome message');label.textContent='Stop';};
  button.addEventListener('click',()=>{if(!toggleFredRockSpeech(button,script,reset,active))reset();});
}

export function initVisitorCounter(){
  const footer=document.querySelector('.site-footer');
  if(!footer||document.getElementById('visitor-total'))return;
  const holder=document.createElement('div');
  holder.className='container visitor-panel';
  holder.setAttribute('aria-label','Paper Club visitor counter');
  holder.innerHTML='<span class="visitor-icon" aria-hidden="true">👁️</span><strong id="visitor-total">3 031 500</strong>';
  footer.insertBefore(holder,footer.querySelector('.copyright'));
  const fields=[document.getElementById('visitor-total')];
  const hero=document.querySelector('.home-hero .home-inner>div:first-child');
  if(hero){
    const top=document.createElement('div');top.className='visitor-top';top.setAttribute('aria-label','Paper Club visitor counter');
    top.innerHTML='<span aria-hidden="true">👁️</span><strong id="hero-visitor-total">3 031 500</strong>';
    hero.insertBefore(top,hero.firstChild);fields.push(top.querySelector('strong'));
  }
  const format=new Intl.NumberFormat('en-ZA');
  const display=value=>fields.forEach(el=>el.textContent=format.format(value));
  async function animate(start,end,duration){
    if(document.visibilityState!=='visible'||window.matchMedia('(prefers-reduced-motion: reduce)').matches||end<=start){display(end);return;}
    await new Promise(resolve=>{
      const startTime=performance.now();let finished=false;
      const finish=()=>{if(finished)return;finished=true;display(end);resolve();};
      const tick=now=>{
        if(finished)return;
        const progress=Math.min(1,(now-startTime)/duration);
        const ease=1-(1-progress)**3;
        display(Math.round(start+(end-start)*ease));
        if(progress<1)requestAnimationFrame(tick);else finish();
      };
      requestAnimationFrame(tick);
      setTimeout(finish,duration+350);
    });
  }
  let recorded=false;
  try{recorded=sessionStorage.getItem('fredrock-visit-counted-v2')==='yes';}catch{}
  const endpoint=location.hostname==='fredrock007.github.io'?'https://quaptureiq-site-v2.daring-crown-6816.chatgpt.site/api/visitors':'/api/visitors';
  fetch(endpoint,{method:recorded?'GET':'POST',cache:'no-store',headers:{Accept:'application/json'}})
    .then(async r=>{if(!r.ok)throw new Error('counter unavailable');return r.json();})
    .then(async data=>{
      if(!Number.isSafeInteger(data.total))throw new Error('invalid count');
      try{sessionStorage.setItem('fredrock-visit-counted-v2','yes');}catch{}
      const before=recorded?data.total:data.total-1;
      await animate(3031500,Math.max(3031500,before),1250);
      if(!recorded)await animate(before,data.total,320);
      else display(data.total);
    })
    .catch(()=>{fields.forEach(el=>el.textContent='—');});
}

export function initTesterPopup(){
  if(document.getElementById('tester-dialog'))return;
  const shell=document.createElement('div');
  shell.innerHTML=`<dialog class="tester-dialog" id="tester-dialog" aria-labelledby="tester-title" aria-describedby="tester-description"><div class="tester-modal-inner"><button type="button" class="tester-close" id="tester-close" aria-label="Close tester invitation">×</button><div class="tester-logo-wrap"><img src="${LOGO_URL}" alt="QuaptureIQ" width="300" height="94"></div><span class="tester-tag">Teachers, learners and parents wanted</span><h2 id="tester-title">What if a photo could help you understand a question?</h2><p id="tester-description"><span aria-label="Capture Eye Queue">QuaptureIQ</span> is an educational app that can analyse a photograph of a question and provide an answer with an explanation. Help us test it and improve the learning experience.</p><p><strong>Interested?</strong> Email <a class="tester-email" href="mailto:${TESTER_EMAIL}?subject=QuaptureIQ%20tester%20interest">${TESTER_EMAIL}</a> and include your Gmail address for closed testing.</p><div class="tester-actions"><a class="apply" href="${mail}">Email to volunteer</a><a class="play-store" href="${PLAY_URL}" target="_blank" rel="noopener noreferrer">Google Play ↗</a></div><p class="tester-small">Google Play closed testing requires your Gmail address to be added to the tester list. This invitation appears once per browsing session.</p></div></dialog>`;
  document.body.appendChild(shell.firstElementChild);
  const dialog=document.getElementById('tester-dialog');
  const KEY='fredrock_quapture_testers_dismissed';
  const dismissed=()=>{try{return sessionStorage.getItem(KEY)==='yes';}catch{return false;}};
  const remember=()=>{try{sessionStorage.setItem(KEY,'yes');}catch{}};
  document.getElementById('tester-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('close',remember);
  dialog.querySelectorAll('.tester-actions a').forEach(a=>a.addEventListener('click',()=>dialog.close()));
  window.setTimeout(()=>{if(!dismissed()&&!dialog.open&&typeof dialog.showModal==='function'&&document.visibilityState==='visible')dialog.showModal();},5000);
}
