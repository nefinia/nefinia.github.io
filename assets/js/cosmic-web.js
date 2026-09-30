/* Cosmic-web homepage for sofiagallego.com: a warped Voronoi web whose nodes are the site sections. */
(function(){
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const menu = document.getElementById('menu'), burger = document.getElementById('burger');
  function go(id){ const t=document.getElementById(id); if(t) t.scrollIntoView({behavior: reduce?'auto':'smooth'}); }
  document.addEventListener('click', e=>{
    const s = e.target.closest('a[data-scroll]');
    if(s){ e.preventDefault(); go(s.dataset.scroll); history.replaceState(null,'','#'+s.dataset.scroll); }
  });
  burger.addEventListener('click', ()=>{ const o = menu.classList.toggle('open'); burger.setAttribute('aria-expanded', String(o)); });

  /* ---------- typewriter: every role, one after another ---------- */
  const tw=document.getElementById('tw'), ROLES=window.SG_ROLES||[];
  if(tw && ROLES.length && !reduce){
    let r=0,i=0,del=false,wait=0; tw.textContent='';
    (function tick(){
      if(wait>0){ wait--; return setTimeout(tick,60); }
      if(!del){ i++; if(i>=ROLES[r].length){ del=true; wait=28; } }
      else { i--; if(i<=0){ del=false; r=(r+1)%ROLES.length; wait=4; } }
      tw.textContent=ROLES[r].slice(0,i);
      setTimeout(tick, del?26:58);
    })();
  }

  /* ---------- sections ---------- */
  const SECTIONS = window.SG_SECTIONS || [];

  const web=document.getElementById('web'), cv=document.getElementById('cv'), ctx=cv.getContext('2d');
  let active=null;
  SECTIONS.forEach(s=>{
    const a=document.createElement('a'); a.className='node'; a.href=s.href;
    
    a.setAttribute('aria-label', s.label+': '+s.title);
    a.innerHTML='<span class="pt"></span><span class="lbl">'+s.label+'</span>';
    web.appendChild(a); s.el=a;
    s.mEls=s.minis.map((m,k)=>{
      const e=document.createElement('a'); e.className='mini'; e.href=m[2]; if(/^https?:/.test(m[2]) && m[2].indexOf('sofiagallego.com')<0){ e.target='_blank'; e.rel='noopener'; } e.tabIndex=-1;
      e.style.setProperty('--d',(0.06*k+0.08)+'s');
      e.innerHTML='<i></i><span><b>'+m[0]+'</b><em>'+m[1]+'</em></span>';
      web.appendChild(e); return e;
    });
    a.addEventListener('pointerenter',e=>{ if(e.pointerType==='mouse') select(s); });
    a.addEventListener('focus',()=>select(s));
    a.addEventListener('click',e=>{
      if(active!==s){ e.preventDefault(); select(s); return; }   // touch: first tap previews
      
    });
  });
  function select(s){
    if(active===s) return;
    if(active){ active.el.classList.remove('on'); active.mEls.forEach(e=>{e.classList.remove('show'); e.tabIndex=-1;}); }
    glow=0; active=s; web.classList.toggle('focus', !!s);
    if(!s) return;
    s.el.classList.add('on'); s.mEls.forEach(e=>{e.classList.add('show'); e.tabIndex=0;});
  }
  // tap or click outside the web closes the notes
  document.addEventListener('pointerdown',e=>{ if(active && !e.target.closest('.node,.mini')) select(null); });

  /* ---------- cosmic web: a warped, weighted Voronoi field. Voids are cells, filaments are cell edges, clusters are vertices ---------- */
  function rng(seed){ return ()=>{ seed=(seed*16807)%2147483647; return (seed-1)/2147483646; }; }
  let W=0,H=0,dpr=1,narrow=false,layer=null,verts=[],picks=[],seeds=[],boost=new Set();
  const A=24;
  const warp=(x,y)=>[x+A*Math.sin(y*.0105+Math.sin(x*.0063)*1.4), y+A*Math.cos(x*.0112+Math.sin(y*.0081)*1.2)];
  const unwarp=(u,v)=>{ let x=u,y=v; for(let k=0;k<8;k++){ const w=warp(x,y); x+=u-w[0]; y+=v-w[1]; } return [x,y]; };
  const key=(i,j)=> i<j? i*4096+j : j*4096+i;
  const ew=(i,j)=>{ if(boost.has(key(i,j))) return 1; const a=Math.min(i,j),b=Math.max(i,j); const h=Math.abs(Math.sin(a*12.9898+b*78.233)*43758.5453)%1; return .1+.9*h*h; };

  function voronoi(R){
    const cell = narrow? 125 : 160;
    seeds=[];
    for(let y=-cell*1.5; y<H+cell*1.5; y+=cell) for(let x=-cell*1.5; x<W+cell*1.5; x+=cell)
      seeds.push([x+R()*cell, y+R()*cell]);
    verts=[];
    const n=seeds.length, lim=(cell*2.6)**2;
    for(let i=0;i<n;i++) for(let j=i+1;j<n;j++){
      const [ax,ay]=seeds[i],[bx,by]=seeds[j]; if((ax-bx)**2+(ay-by)**2>lim) continue;
      for(let k=j+1;k<n;k++){
        const [cx,cy]=seeds[k]; if((ax-cx)**2+(ay-cy)**2>lim||(bx-cx)**2+(by-cy)**2>lim) continue;
        const d=2*(ax*(by-cy)+bx*(cy-ay)+cx*(ay-by)); if(Math.abs(d)<1e-6) continue;
        const ux=((ax*ax+ay*ay)*(by-cy)+(bx*bx+by*by)*(cy-ay)+(cx*cx+cy*cy)*(ay-by))/d;
        const uy=((ax*ax+ay*ay)*(cx-bx)+(bx*bx+by*by)*(ax-cx)+(cx*cx+cy*cy)*(bx-ax))/d;
        const r2=(ax-ux)**2+(ay-uy)**2; let ok=true;
        for(let m=0;m<n&&ok;m++){ if(m===i||m===j||m===k) continue; if((seeds[m][0]-ux)**2+(seeds[m][1]-uy)**2<r2-1e-3) ok=false; }
        if(ok){ const s=unwarp(ux,uy); verts.push({u:ux,v:uy,x:s[0],y:s[1],s:[i,j,k],nb:[]}); }
      }
    }
    for(let a=0;a<verts.length;a++) for(let b=a+1;b<verts.length;b++){
      const sa=verts[a].s, sb=verts[b].s; const sh=sa.filter(q=>sb.includes(q));
      if(sh.length===2){ verts[a].nb.push([b,sh]); verts[b].nb.push([a,sh]); }
    }
  }
  function pick(x0,x1){
    const y0 = narrow? 40 : 64, y1 = H-(narrow?40:70);
    const cand = verts.filter(v=>v.x>x0&&v.x<x1&&v.y>y0&&v.y<y1);
    if(cand.length<SECTIONS.length) return 0;
    let best=null,bestMin=0;
    for(let t=0;t<cand.length;t++){
      const set=[cand[t]];
      while(set.length<SECTIONS.length){
        let bv=null,bd=-1;
        for(const c of cand){ let m=Infinity; for(const s of set) m=Math.min(m,(c.x-s.x)**2+(c.y-s.y)**2); if(m>bd){bd=m;bv=c;} }
        set.push(bv);
      }
      let m=Infinity; for(let i=0;i<set.length;i++) for(let j=i+1;j<set.length;j++) m=Math.min(m,Math.hypot(set[i].x-set[j].x,set[i].y-set[j].y));
      if(m>bestMin){bestMin=m;best=set;}
    }
    picks=best.slice().sort((a,b)=>a.y-b.y || a.x-b.x);
    return bestMin;
  }
  function near(x,y){
    const [u,v]=warp(x,y); let d1=1e9,d2=1e9,d3=1e9,i1=0,i2=0;
    for(let m=0;m<seeds.length;m++){ const q=seeds[m], d=Math.hypot(q[0]-u,q[1]-v);
      if(d<d1){d3=d2;d2=d1;i2=i1;d1=d;i1=m;} else if(d<d2){d3=d2;d2=d;i2=m;} else if(d<d3) d3=d; }
    return [d2-d1, d3-d1, ew(i1,i2)];
  }

  function render(R){
    boost=new Set(); picks.forEach(p=>{ const [a,b,c]=p.s; boost.add(key(a,b)); boost.add(key(b,c)); boost.add(key(a,c)); });
    const s=2, w=Math.ceil(W/s), h=Math.ceil(H/s);
    const off=document.createElement('canvas'); off.width=w; off.height=h;
    const oc=off.getContext('2d'), img=oc.createImageData(w,h), D=img.data;
    for(let py=0;py<h;py++) for(let px=0;px<w;px++){
      const x=px*s,y=py*s, [f,g,e]=near(x,y);
      const fil=Math.exp(-1*(f/(3+4*e))**2)*e, node=Math.exp(-1*(g/12)**2);
      let v=.13*fil+.2*node*fil+.035*e*Math.exp(-1*(f/22)**2);
      for(const p of picks){ const r2=(p.x-x)**2+(p.y-y)**2; v+=.22*Math.exp(-r2/500); }
      const i=(py*w+px)*4; D[i]=172; D[i+1]=186; D[i+2]=255; D[i+3]=Math.min(255,v*255);
    }
    oc.putImageData(img,0,0);
    layer=document.createElement('canvas'); layer.width=W*dpr; layer.height=H*dpr;
    const lc=layer.getContext('2d'); lc.scale(dpr,dpr);
    lc.imageSmoothingEnabled=true; lc.filter='blur(1.2px)'; lc.drawImage(off,0,0,W,H); lc.filter='none';
    const N = Math.round(W*H/150);
    for(let k=0;k<N;k++){
      const x=R()*W, y=R()*H, [f,g,e]=near(x,y);
      const p = .75*e*Math.exp(-1*(f/(4+5*e))**2) + .9*Math.exp(-1*(g/15)**2)*e + .01;
      if(R()>p) continue;
      const b=.2+R()*.6, r=.3+R()*R()*1.05;
      lc.fillStyle='rgba(228,233,255,'+b+')'; lc.beginPath(); lc.arc(x,y,r,0,6.283); lc.fill();
    }
  }
  // screen-space path of one filament, following the warp
  function edgePath(a,b){
    const pts=[]; for(let k=0;k<=24;k++){ const t=k/24; pts.push(unwarp(a.u+(b.u-a.u)*t, a.v+(b.v-a.v)*t)); } return pts;
  }

  const intro=document.querySelector('.intro');
  function build(){
    const b=web.getBoundingClientRect(); if(!b.width) return;
    W=b.width; H=b.height; dpr=Math.min(2,window.devicePixelRatio||1); narrow=W<760;
    cv.width=W*dpr; cv.height=H*dpr; ctx.setTransform(dpr,0,0,dpr,0,0);
    const gut=Math.max(0,(W-1180)/2);
    const x0 = narrow? 30 : intro.getBoundingClientRect().right-b.left+60, x1 = narrow? W-30 : W-gut-60;
    let bestSeed=1,bestD=0;
    for(let sd=3; sd<80; sd+=2){ voronoi(rng(sd)); const d=pick(x0,x1); if(d>bestD){bestD=d;bestSeed=sd;} if(d>(narrow?105:150)) break; }
    voronoi(rng(bestSeed)); pick(x0,x1); render(rng(bestSeed+101));
    SECTIONS.forEach((s,i)=>{ s.v=picks[i]; s.el.classList.toggle('left', s.v.x + s.el.offsetWidth > (narrow? W-6 : x1+40)); s.paths=s.v.nb.map(([n])=>edgePath(s.v,verts[n])); });
    // keep section labels from colliding: flip a label to the other side when two overlap
    const lbox=s=>{ const w=s.el.offsetWidth, l=s.el.classList.contains('left'); return l? [s.v.x-w+14,s.v.y-12,w,24] : [s.v.x-14,s.v.y-12,w,24]; };
    const hit=(p,q)=> p[0]<q[0]+q[2] && q[0]<p[0]+p[2] && p[1]<q[1]+q[3] && q[1]<p[1]+p[3];
    for(let pass=0;pass<3;pass++) for(let i=0;i<SECTIONS.length;i++) for(let j=i+1;j<SECTIONS.length;j++){
      const a=SECTIONS[i], b=SECTIONS[j];
      if(!hit(lbox(a),lbox(b))) continue;
      for(const m of [a,b]){ m.el.classList.toggle('left'); const bx=lbox(m);
        if(bx[0]>=4 && bx[0]+bx[2]<=W-4 && !hit(lbox(a),lbox(b))) break; m.el.classList.toggle('left'); }
    }
    const xmin = narrow? 8 : x0-30;
    const ov=(p,q,m)=> p[0]<q[0]+q[2]+m && q[0]<p[0]+p[2]+m && p[1]<q[1]+q[3]+m && q[1]<p[1]+p[3]+m;
    SECTIONS.forEach(s=>{
      const lw=s.el.offsetWidth, lab = s.el.classList.contains('left') ? [s.v.x-lw+14,s.v.y-14,lw,28] : [s.v.x-14,s.v.y-14,lw,28];
      const others = SECTIONS.filter(o=>o!==s).map(o=>[o.v.x-10,o.v.y-10,20,20]);
      const used=[lab]; s.spots=[];
      s.mEls.forEach((e,k)=>{
        const w=e.offsetWidth||150, hgt=e.offsetHeight||36; let best=null,bs=-Infinity;
        for(const R of (narrow?[70,100,130]:[90,125,160])) for(let j=0;j<24;j++){
          const ang=j*Math.PI/12, cx=s.v.x+Math.cos(ang)*R, cy=s.v.y+Math.sin(ang)*R*.8, left=cx<s.v.x;
          const box= left? [cx-w+2,cy-9,w,hgt] : [cx-3,cy-9,w,hgt];
          if(box[0]<xmin||box[0]+box[2]>W-6||box[1]<6||box[1]+box[3]>H-24) continue;
          if(used.some(u=>ov(u,box,8))) continue;
          const hitsNode = others.some(o=>ov(o,box,4));
          let d=Infinity; for(const u of used) d=Math.min(d,Math.hypot(u[0]+u[2]/2-box[0]-w/2,u[1]+u[3]/2-box[1]-hgt/2));
          const sc = Math.min(d,160) - R*.6 - (hitsNode?120:0);
          if(sc>bs){bs=sc;best={x:cx,y:cy,left,box};}
        }
        if(!best){ const cy=s.v.y+40+k*40; best={x:s.v.x,y:cy,left:false,box:[s.v.x,cy-9,w,hgt]}; }
        used.push(best.box); s.spots.push(best); e.classList.toggle('left',best.left);
      });
    });
    if(reduce) draw(0); else if(!running){ running=true; requestAnimationFrame(draw); }
  }

  let mx=0,my=0,tx=0,ty=0,running=false,glow=0;
  web.addEventListener('pointermove',e=>{ const b=web.getBoundingClientRect(); tx=(e.clientX-b.left)/W-.5; ty=(e.clientY-b.top)/H-.5; });
  web.addEventListener('pointerleave',e=>{ tx=0; ty=0; if(e.pointerType==='mouse') select(null); });

  function draw(t){
    if(!layer) return;
    mx+=(tx-mx)*.04; my+=(ty-my)*.04;
    const ox = reduce?0: Math.sin(t*.00011)*4 - mx*8, oy = reduce?0: Math.cos(t*.00009)*3 - my*6;
    ctx.clearRect(0,0,W,H);
    ctx.drawImage(layer, ox, oy, W, H);
    if(active && active.paths){
      glow = reduce? 1 : Math.min(1, glow+.05);
      active.paths.forEach(p=>{
        const g=ctx.createLinearGradient(p[0][0]+ox,p[0][1]+oy,p[p.length-1][0]+ox,p[p.length-1][1]+oy);
        g.addColorStop(0,'rgba(205,215,255,'+(.65*glow)+')'); g.addColorStop(1,'rgba(205,215,255,0)');
        ctx.strokeStyle=g; ctx.lineWidth=1; ctx.beginPath();
        p.forEach((q,k)=> k? ctx.lineTo(q[0]+ox,q[1]+oy) : ctx.moveTo(q[0]+ox,q[1]+oy)); ctx.stroke();
      });
    }
    if(active && active.spots){
      const v=active.v; ctx.lineWidth=.8;
      active.spots.forEach(p=>{ ctx.strokeStyle='rgba(205,215,255,'+(.35*glow)+')'; ctx.beginPath(); ctx.moveTo(v.x+ox,v.y+oy); ctx.lineTo(p.x+ox,p.y+oy); ctx.stroke(); });
    }
    if(!narrow){
      const r=intro.getBoundingClientRect().right-web.getBoundingClientRect().left+40;
      const g=ctx.createLinearGradient(0,0,r,0);
      g.addColorStop(0,'rgba(4,5,11,.85)'); g.addColorStop(.7,'rgba(4,5,11,.55)'); g.addColorStop(1,'rgba(4,5,11,0)');
      ctx.fillStyle=g; ctx.fillRect(0,0,r,H);
    }
    SECTIONS.forEach(s=>{
      const x=s.v.x+ox, y=s.v.y+oy, left=s.el.classList.contains('left'), w=s.el.offsetWidth;
      s.el.style.transform='translate('+(left? x-w+14 : x-14)+'px,'+(y-14)+'px)';
      if(s===active) s.mEls.forEach((e,k)=>{ const p=s.spots[k], l=e.classList.contains('left');
        e.style.transform='translate('+(l? p.x+ox-e.offsetWidth+2.5 : p.x+ox-2.5)+'px,'+(p.y+oy-8.5)+'px)'; });
    });
    if(!reduce) requestAnimationFrame(draw);
  }


  let rt; addEventListener('resize',()=>{ clearTimeout(rt); rt=setTimeout(build,150); });
  build();
  if(document.fonts && document.fonts.ready) document.fonts.ready.then(build);
})();
