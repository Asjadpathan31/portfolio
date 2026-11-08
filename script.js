document.addEventListener("DOMContentLoaded",()=>{
const year=document.getElementById("year");if(year)year.textContent=new Date().getFullYear();
const menu=document.getElementById("menu"),nav=document.getElementById("navLinks");
menu?.addEventListener("click",()=>nav.classList.toggle("open"));
nav?.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>nav.classList.remove("open")));
const progress=document.getElementById("progress");
const update=()=>{const max=document.documentElement.scrollHeight-innerHeight;if(progress)progress.style.width=(max>0?scrollY/max*100:0)+"%"};addEventListener("scroll",update,{passive:true});update();
const reveal=document.querySelectorAll(".section-index,.about-main,.work-heading,.project-card,.approach-grid article,.toolbelt,.contact h2,.contact-row");
if("IntersectionObserver"in window){const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("visible");io.unobserve(e.target)}}),{threshold:.13});reveal.forEach(el=>{el.classList.add("reveal");io.observe(el)})}
const fine=matchMedia("(hover:hover) and (pointer:fine)").matches&&!matchMedia("(prefers-reduced-motion:reduce)").matches;
if(fine){document.querySelectorAll(".project-card").forEach(card=>{card.addEventListener("pointermove",e=>{const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;card.style.transform="perspective(1100px) rotateX("+((.5-y)*5)+"deg) rotateY("+((x-.5)*7)+"deg) translateY(-5px)"});card.addEventListener("pointerleave",()=>card.style.transform="")});
const frame=document.getElementById("portraitFrame");const stage=document.getElementById("portraitStage");stage?.addEventListener("pointermove",e=>{const r=stage.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;frame.style.transform="rotateY("+(-9+(x-.5)*12)+"deg) rotateX("+(2+(.5-y)*8)+"deg)"});stage?.addEventListener("pointerleave",()=>frame.style.transform="rotateY(-9deg) rotateX(2deg)")}
const email=document.getElementById("emailLink");email?.addEventListener("click",e=>{e.preventDefault();window.location.href="https://github.com/Asjadpathan31"})
});