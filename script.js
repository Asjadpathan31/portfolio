document.addEventListener("DOMContentLoaded",function(){
  const year=document.getElementById("year");if(year)year.textContent=new Date().getFullYear();
  const toggle=document.getElementById("menuToggle"),nav=document.getElementById("siteNav");
  if(toggle&&nav){
    const close=()=>{nav.classList.remove("open");toggle.setAttribute("aria-expanded","false");toggle.setAttribute("aria-label","Open menu");};
    toggle.addEventListener("click",()=>{const open=toggle.getAttribute("aria-expanded")==="true";toggle.setAttribute("aria-expanded",String(!open));toggle.setAttribute("aria-label",open?"Open menu":"Close menu");nav.classList.toggle("open",!open);});
    nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",close));
    document.addEventListener("keydown",e=>{if(e.key==="Escape")close();});
    window.addEventListener("resize",()=>{if(innerWidth>680)close();});
  }
  const progress=document.getElementById("scrollProgress");
  const updateProgress=()=>{if(progress){const max=document.documentElement.scrollHeight-innerHeight;progress.style.width=(max>0?scrollY/max*100:0)+"%";}};
  addEventListener("scroll",updateProgress,{passive:true});updateProgress();
  const glow=document.getElementById("cursorGlow");
  if(glow&&matchMedia("(pointer:fine)").matches){let x=innerWidth/2,y=innerHeight/2,cx=x,cy=y;addEventListener("pointermove",e=>{x=e.clientX;y=e.clientY;glow.style.opacity="1";},{passive:true});const follow=()=>{cx+=(x-cx)*.12;cy+=(y-cy)*.12;glow.style.left=cx+"px";glow.style.top=cy+"px";requestAnimationFrame(follow);};follow();}
  const revealItems=document.querySelectorAll(".section-label,.section-heading,.skill-card,.project-row,.contact-panel,.intro-content");
  if("IntersectionObserver"in window){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("visible");observer.unobserve(entry.target);}}),{threshold:.12});revealItems.forEach(el=>{el.classList.add("reveal");observer.observe(el);});}
  const canvas=document.getElementById("heroCanvas");
  if(!canvas||matchMedia("(prefers-reduced-motion: reduce)").matches)return;
  import("https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js").then(THREE=>{
    const scene=new THREE.Scene();scene.fog=new THREE.FogExp2(0x0b0908,.075);
    const camera=new THREE.PerspectiveCamera(34,1,.1,100);camera.position.set(0,0,10);
    const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:innerWidth>700,powerPreference:"high-performance"});
    renderer.setPixelRatio(Math.min(devicePixelRatio,innerWidth<700?1.35:1.8));renderer.setSize(canvas.clientWidth,canvas.clientHeight,false);
    renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;
    const root=new THREE.Group();scene.add(root);
    const key=new THREE.PointLight(0xff6745,95,18);key.position.set(3,3,4);scene.add(key);
    const cyan=new THREE.PointLight(0xe8bd86,75,16);cyan.position.set(-4,-2,2);scene.add(cyan);
    const white=new THREE.PointLight(0xffffff,30,14);white.position.set(0,4,-3);scene.add(white);
    scene.add(new THREE.AmbientLight(0x9b7860,.55));
    const coreGeo=new THREE.TorusKnotGeometry(1.42,.39,220,28,2,5);
    const coreMat=new THREE.MeshPhysicalMaterial({color:0xff7951,metalness:.82,roughness:.19,clearcoat:1,clearcoatRoughness:.08,iridescence:.75,iridescenceIOR:1.8,iridescenceThicknessRange:[100,700],emissive:0x45190d,emissiveIntensity:.32});
    const core=new THREE.Mesh(coreGeo,coreMat);root.add(core);
    const inner=new THREE.Mesh(new THREE.IcosahedronGeometry(.72,2),new THREE.MeshPhysicalMaterial({color:0xffd7aa,metalness:.48,roughness:.12,transmission:.35,thickness:1.4,transparent:true,opacity:.9,emissive:0x60351d,emissiveIntensity:.35,wireframe:false}));root.add(inner);
    const wire=new THREE.Mesh(new THREE.IcosahedronGeometry(2.18,2),new THREE.MeshBasicMaterial({color:0xff7951,wireframe:true,transparent:true,opacity:.16}));root.add(wire);
    const ringMat=new THREE.MeshBasicMaterial({color:0xe8bd86,transparent:true,opacity:.42});
    const rings=[];
    for(let n=0;n<3;n++){const ring=new THREE.Mesh(new THREE.TorusGeometry(2.45+n*.22,.006,8,220),ringMat.clone());ring.rotation.set(.7+n*.45,.35+n*.6,n*.65);root.add(ring);rings.push(ring);}
    const count=innerWidth<700?650:1450,positions=new Float32Array(count*3),colors=new Float32Array(count*3);
    const colorA=new THREE.Color(0xff7951),colorB=new THREE.Color(0xe8bd86);
    for(let k=0;k<count;k++){const radius=3.1+Math.random()*5.5,theta=Math.random()*Math.PI*2,phi=Math.acos(2*Math.random()-1);positions[k*3]=radius*Math.sin(phi)*Math.cos(theta);positions[k*3+1]=radius*Math.sin(phi)*Math.sin(theta);positions[k*3+2]=radius*Math.cos(phi);const col=colorA.clone().lerp(colorB,Math.random());colors[k*3]=col.r;colors[k*3+1]=col.g;colors[k*3+2]=col.b;}
    const pGeo=new THREE.BufferGeometry();pGeo.setAttribute("position",new THREE.BufferAttribute(positions,3));pGeo.setAttribute("color",new THREE.BufferAttribute(colors,3));
    const particles=new THREE.Points(pGeo,new THREE.PointsMaterial({size:.018,vertexColors:true,transparent:true,opacity:.85,sizeAttenuation:true,depthWrite:false}));scene.add(particles);
    const stars=new THREE.Group();scene.add(stars);
    for(let n=0;n<32;n++){const dot=new THREE.Mesh(new THREE.SphereGeometry(.018+Math.random()*.025,8,8),new THREE.MeshBasicMaterial({color:n%3===0?0xe8bd86:0xffc18c,transparent:true,opacity:.75}));const a=Math.random()*Math.PI*2,r=3.2+Math.random()*2.4;dot.position.set(Math.cos(a)*r,(Math.random()-.5)*5,Math.sin(a)*r);stars.add(dot);}
    let targetX=0,targetY=0,mouseX=0,mouseY=0,scroll=0;
    addEventListener("pointermove",e=>{targetX=(e.clientX/innerWidth-.5)*.8;targetY=(e.clientY/innerHeight-.5)*.55;},{passive:true});
    addEventListener("scroll",()=>{scroll=Math.min(1,scrollY/Math.max(1,innerHeight));},{passive:true});
    const resize=()=>{const w=canvas.clientWidth||innerWidth,h=canvas.clientHeight||innerHeight;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false);renderer.setPixelRatio(Math.min(devicePixelRatio,innerWidth<700?1.35:1.8));};
    new ResizeObserver(resize).observe(canvas);resize();
    const clock=new THREE.Clock();
    renderer.setAnimationLoop(()=>{
      const t=clock.getElapsedTime();mouseX+=(targetX-mouseX)*.035;mouseY+=(targetY-mouseY)*.035;
      root.rotation.y=t*.12+mouseX;root.rotation.x=Math.sin(t*.22)*.12+mouseY*.35;root.position.y=Math.sin(t*.55)*.12-scroll*.5;
      core.rotation.x=t*.18;core.rotation.z=t*.13;inner.rotation.y=-t*.22;inner.rotation.x=t*.17;wire.rotation.y=-t*.07;wire.rotation.x=t*.05;
      rings.forEach((r,n)=>{r.rotation.z+=.0015*(n+1);r.rotation.x+=.0008;});
      particles.rotation.y=t*.012;particles.rotation.x=Math.sin(t*.08)*.04;stars.rotation.y=-t*.025;
      camera.position.x=mouseX*.42;camera.position.y=-mouseY*.35;camera.lookAt(0,0,0);renderer.render(scene,camera);
    });
  }).catch(err=>{console.warn("3D scene unavailable; keeping CSS fallback.",err);});
});