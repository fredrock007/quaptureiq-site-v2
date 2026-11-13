/** Instant, accessible paper-cover illustrations assembled from verified metadata.
 * These are original visual index cards, not scans or reproduced DBE pages.
 * They avoid the oversized Android PDF "Open" placeholder entirely.
 */
const esc = input => String(input ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const short = (s,n) => String(s ?? '').length > n ? String(s).slice(0,n-1).trim() + '…' : String(s ?? '');

export function installCoverStyles(){
  if(document.getElementById('fredrock-cover-style')) return;
  const style=document.createElement('style');
  style.id='fredrock-cover-style';
  style.textContent=`
    .dbe-doc-row .fred-paper-cover,.real-document .fred-paper-cover{flex:none;display:flex;flex-direction:column;justify-content:space-between;position:relative;overflow:hidden;
      width:104px;height:138px;padding:12px 9px 9px;border:1px solid #c5d7dc;border-radius:5px;
      background:linear-gradient(90deg,#ecf3f1 0 8px,#fff 8px);box-shadow:3px 5px 0 #d8e3df,0 7px 17px #12313c12;
      color:#172c36!important;text-decoration:none!important;text-align:left;white-space:normal!important;transition:transform .15s ease,box-shadow .15s ease}
    .fred-paper-cover:hover{transform:translateY(-3px);box-shadow:4px 8px 0 #d8e3df,0 9px 21px #12313c1c}
    .fred-paper-cover:focus-visible{outline:3px solid #f0a852;outline-offset:4px}
    .fred-cover-kicker{font-size:8px;line-height:1.15;text-transform:uppercase;letter-spacing:.08em;color:#27857b;font-weight:950}
    .fred-cover-grade{font-size:12px;line-height:1.2;font-weight:950;margin-top:5px}
    .fred-cover-title{font-size:9px;line-height:1.2;font-weight:750;max-height:45px;overflow:hidden;overflow-wrap:anywhere}
    .fred-cover-lines{height:15px;border-top:1px solid #d8e5e3;border-bottom:1px solid #d8e5e3;margin-top:auto}
    .fred-cover-bottom{display:flex;justify-content:space-between;align-items:center;gap:2px;font-size:8px;font-weight:900;color:#087e78}
    .fred-cover-bottom b{display:inline-block;background:#ffdb79;color:#223640;border-radius:4px;padding:2px 4px}
    .fred-cover-caption{font-size:.74rem;color:#52736c;margin-top:6px;line-height:1.2}
    .fred-cover-layout{display:flex;align-items:center;gap:15px;min-width:0}
    .fred-cover-content{min-width:0;flex:1}
    @media(max-width:520px){
      .fred-paper-cover{width:89px;height:119px;padding:10px 7px 7px}
      .fred-cover-grade{font-size:11px}
      .fred-cover-title{font-size:8px}
      .fred-cover-layout{gap:12px}
    }
    @media(prefers-reduced-motion:reduce){.fred-paper-cover{transition:none}}
  `;
  document.head.appendChild(style);
}

/** Clicking the cover opens the actual paper. The visual itself is a
 * generated catalogue graphic using title/year data, not a PDF page copy. */
export function paperCover({grade,year,subject,title,kind,url}){
  if(kind==='supplement'||/\.zip(?:[?#]|$)/i.test(url||'')) return '';
  const type=kind==='memo'?'MEMO':'PAPER';
  const subj=short(subject,35);
  return `<a class="fred-paper-cover" href="${esc(url)}" target="_blank" rel="noopener noreferrer" aria-label="Open original ${esc(title)} PDF from its publisher" title="Tap to open the original document"><span class="fred-cover-kicker">FredRock paper index</span><span class="fred-cover-grade">GRADE ${esc(grade)}<br>${esc(year)}</span><span class="fred-cover-title">${esc(subj)}<br>${esc(short(title,48))}</span><span class="fred-cover-lines" aria-hidden="true"></span><span class="fred-cover-bottom"><span>↗ OPEN PDF</span><b>${type}</b></span></a>`;
}
