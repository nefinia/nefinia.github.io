/* Tally: tiny privacy-first analytics. Usage:
   <script src="https://sofiagallego.com/tally/tally.js" data-app="myapp" defer></script>   (data-app="auto" names it after the folder; data-url overrides the server)
   Then mark buttons with data-ev="name" or data-act/data-tab, or call window.__tally.track("name"). */
(function(){
/* ---- own analytics (reusable in any app) ----
 * Counts what people do, as anonymous hourly totals on our own server: "tab Programme opened: +1".
 * Never sends text people typed, search words, notes or any device code; no cookies.
 * Respects "Do Not Track" and Global Privacy Control. To reuse: set TALLY.url and TALLY.app; mark
 * anything worth counting with data-* attributes (or call TALLY.track("name")).
 */
const TALLY_TAG=document.currentScript||{dataset:{}};
const TALLY={url:TALLY_TAG.dataset.url||"https://moc7-ask.sofiag-gallego.workers.dev/ev",app:(function(a){
    // data-app="auto": name the app after the first part of the address (es/ and fr/ are skipped), "home" for top-level pages
    if(a&&a!=="auto")return a;let seg=location.pathname.split("/").filter(Boolean).filter(x=>!/^(es|fr|en)$/.test(x));
    if(seg.length&&/\./.test(seg[seg.length-1]))seg=seg.slice(0,-1);
    return seg.length?seg[0].toLowerCase().replace(/[^a-z0-9-]/g,"").slice(0,30)||"home":"home"})(TALLY_TAG.dataset.app),q:{},n:0,
  // data-* attributes worth counting; values are kept only for keys whose values are UI names
  keys:["ev","act","tab","go","rate","theme"],
  withValue:new Set(["act","tab","go","theme","rate"]),
  off:(()=>{try{return navigator.globalPrivacyControl===true||navigator.doNotTrack==="1"||window.doNotTrack==="1"}catch(e){return false}})()};
window.__tally=TALLY;
TALLY.track=function(name){if(TALLY.off||!TALLY.url)return;name=String(name).toLowerCase().replace(/[^a-z0-9:_.\-]/g,"").slice(0,48);if(!name)return;TALLY.q[name]=(TALLY.q[name]||0)+1;TALLY.n++;if(TALLY.n>=40)TALLY.flush()};
TALLY.flush=function(start){if(TALLY.off||!TALLY.url)return;if(!TALLY.n&&!start)return;const body=JSON.stringify({app:TALLY.app,ev:TALLY.q,start:!!start});TALLY.q={};TALLY.n=0;
  try{if(navigator.sendBeacon&&navigator.sendBeacon(TALLY.url,new Blob([body],{type:"text/plain"})))return}catch(e){}
  try{fetch(TALLY.url,{method:"POST",body,headers:{"content-type":"text/plain"},keepalive:true}).catch(()=>{})}catch(e){}};
(function(){if(TALLY.off||!TALLY.url)return;
  const w=Math.min(screen.width||0,screen.height||0),touch=window.matchMedia&&matchMedia("(pointer: coarse)").matches,dev=!touch?"desktop":w&&w<600?"phone":"tablet";
  const standalone=window.matchMedia&&matchMedia("(display-mode: standalone)").matches||navigator.standalone===true;
  ["open","page:"+(location.pathname.split("/").filter(Boolean).pop()||"index").replace(/\.html?$/,"").toLowerCase().replace(/[^a-z0-9_.-]/g,"").slice(0,40),"open:"+dev,"open:"+(standalone?"installed":"browser"),"scheme:"+(window.matchMedia&&matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"),"lang:"+String(navigator.language||"xx").slice(0,2)].forEach(TALLY.track);
  setTimeout(()=>TALLY.flush(true),4000);
  document.addEventListener("click",e=>{const el=e.target.closest&&e.target.closest("[data-ev],"+TALLY.keys.map(k=>"[data-"+k+"]").join(","));if(!el)return;
    if(el.dataset.ev)return TALLY.track(el.dataset.ev);
    const k=TALLY.keys.find(k=>el.dataset[k]!==undefined);if(!k)return;const v=el.dataset[k];
    TALLY.track(TALLY.withValue.has(k)&&v&&v.length<=24?k+":"+v:k)},true);
  document.addEventListener("change",e=>{const el=e.target;if(!el||!el.matches||!el.matches("input,textarea,select"))return;const k=Object.keys(el.dataset||{})[0]||el.id||el.type;TALLY.track("edit:"+k)},true);
  setInterval(()=>TALLY.flush(),60000);
  document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="hidden")TALLY.flush()});
  addEventListener("pagehide",()=>TALLY.flush());
})();
})();
