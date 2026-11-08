document.addEventListener("DOMContentLoaded",()=>{
 const year=document.getElementById("year");if(year)year.textContent=new Date().getFullYear();
 const nav=document.getElementById("nav"),menu=document.querySelector(".menu");
 menu?.addEventListener("click",()=>nav.classList.toggle("open"));
 nav?.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>nav.classList.remove("open")));
 const reveal=document.querySelectorAll(".section-meta,.section-intro,.work-card,.cap,.about-layout,.contact-content");
 if("IntersectionObserver"in window&&!matchMedia("(prefers-reduced-motion:reduce)").matches){const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("visible");io.unobserve(e.target)}}),{threshold:.12});reveal.forEach(el=>{el.classList.add("reveal");io.observe(el)})}
 const canvas=document.getElementById("field"),ctx=canvas?.getContext("2d");
 if(canvas&&ctx){
  const host=canvas.parentElement;let w=0,h=0,dpr=1,raf=0,mouse={x:0,y:0},target={x:0,y:0},points=[],tick=0;
  const reduced=matchMedia("(prefers-reduced-motion:reduce)").matches;
  function resize(){const r=host.getBoundingClientRect();w=r.width;h=r.height;dpr=Math.min(devicePixelRatio||1,1.7);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);points=[];const count=Math.min(760,Math.max(300,Math.floor(w*h/220)));for(let i=0;i<count;i++){const u=Math.random()*Math.PI*2,v=Math.acos(2*Math.random()-1);const radius=105+Math.random()*65;points.push({x:radius*Math.sin(v)*Math.cos(u),y:radius*Math.sin(v)*Math.sin(u),z:radius*Math.cos(v),phase:Math.random()*6.28,size:Math.random()*1.35+.35})}}
  function pointer(e){const r=canvas.getBoundingClientRect();target.x=(e.clientX-r.left)/r.width-.5;target.y=(e.clientY-r.top)/r.height-.5}
  host.addEventListener("pointermove",pointer,{passive:true});host.addEventListener("pointerleave",()=>{target.x=0;target.y=0});
  function draw(){ctx.clearRect(0,0,w,h);mouse.x+=(target.x-mouse.x)*.035;mouse.y+=(target.y-mouse.y)*.035;if(!reduced)tick+=.0025;const angle=tick+mouse.x*.9,tilt=mouse.y*.8,ca=Math.cos(angle),sa=Math.sin(angle),ct=Math.cos(tilt),st=Math.sin(tilt),projected=[];
   for(const p of points){const pulse=1+Math.sin(tick*2+p.phase)*.025;const x=p.x*pulse,z=p.z*pulse;const rx=x*ca-z*sa,rz=x*sa+z*ca,ry=p.y*ct-rz*st,zz=p.y*st+rz*ct;const scale=390/(390+zz);projected.push({x:w/2+rx*scale*1.25,y:h/2+ry*scale*1.25,z:zz,scale,size:p.size*scale})}
   projected.sort((a,b)=>b.z-a.z);
   for(let i=0;i<projected.length;i++){const p=projected[i];for(let j=i+1;j<projected.length;j++){const q=projected[j],dist=Math.hypot(p.x-q.x,p.y-q.y);if(dist<23){ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.strokeStyle="rgba(212,255,88,"+((1-dist/23)*.18*p.scale)+")";ctx.lineWidth=.55;ctx.stroke()}}}
   for(const p of projected){ctx.beginPath();ctx.arc(p.x,p.y,p.size,0,Math.PI*2);ctx.fillStyle=p.z>0?"rgba(229,255,153,"+(.35+p.scale*.5)+")":"rgba(165,138,255,.36)";ctx.shadowBlur=p.z>0?9:0;ctx.shadowColor="#d4ff58";ctx.fill()}ctx.shadowBlur=0;
   const g=ctx.createRadialGradient(w/2,h/2,8,w/2,h/2,w*.42);g.addColorStop(0,"rgba(212,255,88,.055)");g.addColorStop(1,"rgba(212,255,88,0)");ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
   if(!reduced)raf=requestAnimationFrame(draw)
  }
  resize();draw();window.addEventListener("resize",()=>{cancelAnimationFrame(raf);resize();draw()},{passive:true});
 }
});