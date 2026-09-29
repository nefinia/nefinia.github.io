/* Cozy "How to play" dialog.
   A game provides <template id="cz-howto" data-title="How to play X"> with:
     <p class="lead">…</p>
     <article><svg viewBox="0 0 116 88">…</svg><div><h3>1. …</h3><p>…</p></div></article> (×N)
     <div class="tips"><span>…</span>…</div>   (optional)
   Include with <script src="cozy/howto.js" defer></script> (../cozy/ in subfolders).
   Adds a "? How to play" button to the .cz-bar, and opens once automatically on a visitor's first visit. */
(function(){
  function init(){
    var tpl=document.getElementById("cz-howto"); if(!tpl) return;
    var frag=tpl.content.cloneNode(true);
    var title=tpl.getAttribute("data-title")||"How to play";
    var modal=document.createElement("div"); modal.className="cz-howto"; modal.setAttribute("role","dialog"); modal.setAttribute("aria-modal","true"); modal.setAttribute("aria-label",title);
    var card=document.createElement("div"); card.className="cz-howto-card"; modal.appendChild(card);
    card.innerHTML='<div class="cz-howto-head"><h2></h2><button type="button" class="cz-howto-x" aria-label="Close">✕</button></div>';
    card.querySelector("h2").textContent=title;
    var lead=frag.querySelector(".lead"); if(lead){lead.className="cz-howto-lead"; card.appendChild(lead);}
    var steps=document.createElement("div"); steps.className="cz-howto-steps";
    frag.querySelectorAll("article").forEach(function(a){steps.appendChild(a);}); card.appendChild(steps);
    var tips=frag.querySelector(".tips"); if(tips){tips.className="cz-howto-tips"; card.appendChild(tips);}
    var go=document.createElement("div"); go.className="cz-howto-go"; go.innerHTML='<button type="button">Let’s play!</button>'; card.appendChild(go);
    document.body.appendChild(modal);

    var bar=document.querySelector(".cz-bar"), btn=document.createElement("button");
    btn.type="button"; btn.className="cz-help"; btn.setAttribute("aria-haspopup","dialog"); btn.innerHTML='<b>?</b><span>How to play</span>';
    if(bar){ var home=bar.querySelector(".cz-home"); var right=document.createElement("div"); right.className="cz-right";
      if(home){ bar.insertBefore(right,home); right.appendChild(btn); right.appendChild(home);} else { bar.appendChild(right); right.appendChild(btn);} }
    else { btn.style.cssText="position:fixed;right:14px;bottom:14px;z-index:999"; document.body.appendChild(btn); }

    var last=null;
    function open(){ last=document.activeElement; modal.classList.add("on"); card.scrollTop=0; go.querySelector("button").focus({preventScroll:true}); }
    function close(){ modal.classList.remove("on"); if(last&&last.focus) last.focus(); }
    btn.addEventListener("click",open);
    modal.querySelector(".cz-howto-x").addEventListener("click",close);
    go.querySelector("button").addEventListener("click",close);
    modal.addEventListener("click",function(e){ if(e.target===modal) close(); });
    document.addEventListener("keydown",function(e){ if(e.key==="Escape"&&modal.classList.contains("on")){ e.stopPropagation(); close(); } },true);
    window.czHowto={open:open,close:close};

    var key="cz-howto-seen:"+location.pathname, seen=false;
    try{ seen=localStorage.getItem(key)==="1"; localStorage.setItem(key,"1"); }catch(e){ seen=true; }
    if(!seen && !/[?&]nohowto\b/.test(location.search)) open();
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",init); else init();
})();
