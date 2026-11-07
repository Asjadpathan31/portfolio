document.addEventListener("DOMContentLoaded",function(){
  var year=document.getElementById("year");
  if(year) year.textContent=new Date().getFullYear();
  var toggle=document.getElementById("menuToggle");
  var nav=document.getElementById("siteNav");
  if(toggle&&nav){
    function closeMenu(){nav.classList.remove("open");toggle.setAttribute("aria-expanded","false");toggle.setAttribute("aria-label","Open menu");}
    toggle.addEventListener("click",function(){var open=toggle.getAttribute("aria-expanded")==="true";toggle.setAttribute("aria-expanded",String(!open));toggle.setAttribute("aria-label",open?"Open menu":"Close menu");nav.classList.toggle("open",!open);});
    nav.querySelectorAll("a").forEach(function(link){link.addEventListener("click",closeMenu);});
    document.addEventListener("keydown",function(event){if(event.key==="Escape")closeMenu();});
    window.addEventListener("resize",function(){if(window.innerWidth>680)closeMenu();});
  }
  var items=document.querySelectorAll(".section-label,.section-heading,.skill-card,.project-row,.contact-panel,.intro-content");
  if("IntersectionObserver" in window){
    var observer=new IntersectionObserver(function(entries){entries.forEach(function(entry){if(entry.isIntersecting){entry.target.classList.add("visible");observer.unobserve(entry.target);}});},{threshold:.12});
    items.forEach(function(item){item.classList.add("reveal");observer.observe(item);});
  }
});