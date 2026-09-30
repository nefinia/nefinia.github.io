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
    const y0 = Math.max(narrow? 40 : 64, H*.11), y1 = Math.min(H-(narrow?40:70), H*.8);
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
    W=b.width; H=b.height; dpr=Math.min(2,window.devicePixelRatio||1); narrow=getComputedStyle(intro).position!=='absolute';
    cv.width=W*dpr; cv.height=H*dpr; ctx.setTransform(dpr,0,0,dpr,0,0);
    const gut=Math.max(0,(W-1180)/2);
    const x0 = narrow? 30 : intro.getBoundingClientRect().right-b.left+60, x1 = narrow? W-30 : W-gut-60;
    const ov=(p,q,m)=> p[0]<q[0]+q[2]+m && q[0]<p[0]+p[2]+m && p[1]<q[1]+q[3]+m && q[1]<p[1]+p[3]+m;
    const area=(p,q)=> Math.max(0,Math.min(p[0]+p[2],q[0]+q[2])-Math.max(p[0],q[0]))*Math.max(0,Math.min(p[1]+p[3],q[1]+q[3])-Math.max(p[1],q[1]));
    const xmin = narrow? 6 : x0-30, fTop=Math.round(H*.08), fBot=Math.round(H*.84), frame=[xmin,fTop,W-6-xmin,fBot-fTop];
    const inFrame=bx=> bx[0]>=frame[0] && bx[1]>=frame[1] && bx[0]+bx[2]<=frame[0]+frame[2] && bx[1]+bx[3]<=frame[1]+frame[3];
    const lbl = s=>s.el.querySelector('.lbl');
    const lboxFor=(s,side)=>{ const lw=lbl(s).offsetWidth, lh=lbl(s).offsetHeight||18, x=s.v.x, y=s.v.y;
      return side==='r'? [x+24,y-lh/2,lw,lh] : side==='l'? [x-24-lw,y-lh/2,lw,lh] : side==='u'? [x-lw/2,y-18-lh,lw,lh] : [x-lw/2,y+18,lw,lh]; };
    // label placement: each label may sit right, left, above or below its point; returns how much still collides
    function placeLabels(){
      const pts = SECTIONS.map(s=>[s.v.x-14,s.v.y-14,28,28]);
      const cost=(s,side,placed)=>{ const bx=lboxFor(s,side); let c=inFrame(bx)?0:1e6;
        pts.forEach((p,i)=>{ if(SECTIONS[i]!==s) c+=area(bx,p)*50; });
        placed.forEach(q=>{ c+=area(bx,q)*100; if(ov(bx,q,6)) c+=500; });
        return c + ({r:0,l:1,u:3,d:4})[side]; };
      const placed=[];
      SECTIONS.forEach(s=>{ let best='r',bc=Infinity;
        for(const side of ['r','l','u','d']){ const c=cost(s,side,placed); if(c<bc){bc=c;best=side;} }
        s.side=best; placed.push(lboxFor(s,best)); });
      let total=0;
      for(let pass=0;pass<4;pass++){ total=0; SECTIONS.forEach(s=>{
        const others=SECTIONS.filter(o=>o!==s).map(o=>lboxFor(o,o.side));
        let best=s.side,bc=cost(s,s.side,others);
        for(const side of ['r','l','u','d']){ const c=cost(s,side,others); if(c<bc){bc=c;best=side;} }
        s.side=best; total+=bc-({r:0,l:1,u:3,d:4})[best]; }); }
      return total;
    }
    // choose the web whose sections are well spread AND whose labels all fit
    let bestSeed=3,bestScore=-Infinity;
    for(let sd=3; sd<120; sd+=2){
      voronoi(rng(sd)); const d=pick(x0,x1); if(!d) continue;
      SECTIONS.forEach((s,i)=>{ s.v=picks[i]; });
      const c=placeLabels(); const score=Math.min(d,narrow?110:170) - c;
      if(score>bestScore){bestScore=score;bestSeed=sd;}
      if(c===0 && d>(narrow?105:150)) break;
    }
    voronoi(rng(bestSeed)); pick(x0,x1); render(rng(bestSeed+101));
    SECTIONS.forEach((s,i)=>{ s.v=picks[i]; s.paths=s.v.nb.map(([n])=>edgePath(s.v,verts[n])); });
    placeLabels();
    SECTIONS.forEach(s=>{ s.el.classList.toggle('left',s.side==='l'); s.el.classList.toggle('up',s.side==='u'); s.el.classList.toggle('down',s.side==='d'); s.lab=lboxFor(s,s.side); });

    // ---- notes: spread around the node, inside the frame, never on each other or on the node's own label
    SECTIONS.forEach(s=>{
      s.mEls.forEach(e=>e.classList.remove('compact')); s.crowded=false;
      const used=[s.lab,[s.v.x-14,s.v.y-14,28,28]]; s.spots=[];
      const otherPts = SECTIONS.filter(o=>o!==s).map(o=>[o.v.x-12,o.v.y-12,24,24]);
      s.mEls.forEach(e=>{
        const w=e.offsetWidth||150, hgt=e.offsetHeight||36; let best=null,bs=-Infinity,fb=null,fbc=Infinity;
        const radii = narrow? [64,88,112,136,160,190,220,250] : [90,115,140,165,195,225,260];
        for(const R of radii) for(let j=0;j<24;j++){
          const ang=j*Math.PI/12, cx=s.v.x+Math.cos(ang)*R, cy=s.v.y+Math.sin(ang)*R*.85, left=cx<s.v.x;
          const box= left? [cx-w+2,cy-9,w,hgt] : [cx-3,cy-9,w,hgt];
          let pen=0; used.forEach(u=>pen+=area(u,box)); if(!inFrame(box)) pen+=1e5;
          if(pen<fbc){fbc=pen;fb={x:cx,y:cy,left,box};}
          if(pen>0 || used.some(u=>ov(u,box,6))) continue;
          const hitsNode = otherPts.some(o=>ov(o,box,2));
          let d=Infinity; for(const u of used) d=Math.min(d,Math.hypot(u[0]+u[2]/2-box[0]-w/2,u[1]+u[3]/2-box[1]-hgt/2));
          const sc = Math.min(d,140) - R*.5 - (hitsNode?80:0);
          if(sc>bs){bs=sc;best={x:cx,y:cy,left,box};}
        }
        if(!best) s.crowded=true;
        best = best||fb; used.push(best.box); s.spots.push(best); e.classList.toggle('left',best.left);
      });
      // not enough room around the node: stack the notes in a tidy column beside it
      if(s.crowded){
        s.mEls.forEach(e=>e.classList.add('compact'));
        const ws=s.mEls.map(e=>e.offsetWidth||150), hs=s.mEls.map(e=>e.offsetHeight||26), gap=6;
        const total=hs.reduce((a,b)=>a+b,0)+gap*(hs.length-1), maxw=Math.max(...ws);
        const clampY=v=>Math.max(fTop,Math.min(fBot-total,v));
        const colFor = sd => sd==='r' ? Math.min(s.v.x+26, W-6-maxw) : Math.max(xmin, s.v.x-26-maxw);
        const ptBox=[s.v.x-14,s.v.y-14,28,28];
        const freeFor = sd => { const bx=lboxFor(s,sd); return inFrame(bx) &&
          !SECTIONS.some(o=>o!==s && (ov(bx,o.lab,4) || ov(bx,[o.v.x-14,o.v.y-14,28,28],2))); };
        // search: label side (current first, then any free side) × column side × vertical position
        let found=null;
        const labelSides=[s.side,'l','r','u','d'].filter((v,i,a)=>a.indexOf(v)===i && (v===s.side || freeFor(v)));
        outer: for(const ls of labelSides){
          const lab=lboxFor(s,ls);
          const colSides = (s.v.x < W/2) ? ['r','l'] : ['l','r'];
          for(const cs of colSides){
            const cx=colFor(cs);
            const ys=[s.v.y-total/2, lab[1]+lab[3]+8, lab[1]-8-total, s.v.y+18, s.v.y-18-total].map(clampY);
            for(const yy of ys){
              const col=[cx,yy,maxw,total];
              if(!ov(col,lab,4) && !ov(col,ptBox,0)){ found={ls,cs,cx,y:yy}; break outer; }
            }
          }
        }
        if(!found) found={ls:s.side,cs:(s.v.x<W/2?'r':'l'),cx:colFor(s.v.x<W/2?'r':'l'),y:clampY(s.v.y-total/2)};
        s.side=found.ls; s.lab=lboxFor(s,s.side);
        s.el.classList.toggle('left',s.side==='l'); s.el.classList.toggle('up',s.side==='u'); s.el.classList.toggle('down',s.side==='d');
        let side=found.cs, y=found.y;
        s.spots=[]; s.crowded=false;
        s.mEls.forEach((e,k)=>{
          const w=ws[k];
          const bx = side==='r' ? Math.min(s.v.x+26, W-6-w) : Math.max(xmin, s.v.x-26-w);
          const left = side==='l';
          const px = left ? bx+w-2 : bx+3;
          s.spots.push({x:px,y:y+9,left,box:[bx,y,w,hs[k]]}); e.classList.toggle('left',left);
          y+=hs[k]+gap;
        });
      }
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
      const x=s.v.x+ox, y=s.v.y+oy, w=s.el.offsetWidth, h=s.el.offsetHeight;
      const tx = s.side==='l'? x-w+14 : (s.side==='u'||s.side==='d')? x-w/2 : x-14;
      const ty = s.side==='u'? y-h+14 : y-14;
      s.el.style.transform='translate('+tx+'px,'+ty+'px)';
      if(s===active) s.mEls.forEach((e,k)=>{ const p=s.spots[k], l=e.classList.contains('left');
        e.style.transform='translate('+(l? p.x+ox-e.offsetWidth+2.5 : p.x+ox-2.5)+'px,'+(p.y+oy-8.5)+'px)'; });
    });
    if(!reduce) requestAnimationFrame(draw);
  }


  let rt; addEventListener('resize',()=>{ clearTimeout(rt); rt=setTimeout(build,150); });
  build();
  if(document.fonts && document.fonts.ready) document.fonts.ready.then(build);
})();
