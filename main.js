// decode-on-load effect
function decodeText(el){
  const final = el.dataset.text; const chars = "!<>-_\\/[]{}—=+*^?#";
  let frame = 0; const steps = final.length * 3;
  function tick(){
    let out = "";
    for(let i=0;i<final.length;i++){
      if(final[i]===" "){out+=" "; continue;}
      if(frame/3 > i) out += final[i];
      else out += chars[Math.floor(Math.random()*chars.length)];
    }
    el.textContent = out;
    frame++;
    if(frame <= steps) requestAnimationFrame(tick);
    else el.textContent = final;
  }
  tick();
}
document.querySelectorAll('[data-decode]').forEach(decodeText);

// particle field
const canvas = document.getElementById('field');
if(canvas){
  const ctx = canvas.getContext('2d');
  let w,h,points=[];
  const mouse = {x:-9999,y:-9999};
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize(){
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
    const count = Math.min(70, Math.floor((w*h)/16000));
    points = Array.from({length:count},()=>({
      x:Math.random()*w, y:Math.random()*h,
      vx:(Math.random()-.5)*.25, vy:(Math.random()-.5)*.25
    }));
  }
  window.addEventListener('resize', resize);
  canvas.addEventListener('mousemove', e=>{
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
  });
  canvas.addEventListener('mouseleave', ()=>{mouse.x=-9999; mouse.y=-9999;});

  function draw(){
    ctx.clearRect(0,0,w,h);
    for(const p of points){
      p.x+=p.vx; p.y+=p.vy;
      if(p.x<0||p.x>w) p.vx*=-1;
      if(p.y<0||p.y>h) p.vy*=-1;
      const d = Math.hypot(p.x-mouse.x, p.y-mouse.y);
      const near = d < 160;
      ctx.beginPath();
      ctx.arc(p.x,p.y, near?2.2:1.3, 0, Math.PI*2);
      ctx.fillStyle = near ? '#e3482c' : 'rgba(236,233,226,0.35)';
      ctx.fill();
      if(near){
        ctx.beginPath();
        ctx.moveTo(p.x,p.y); ctx.lineTo(mouse.x,mouse.y);
        ctx.strokeStyle = `rgba(227,72,44,${1-d/160})`;
        ctx.lineWidth = .6;
        ctx.stroke();
      }
    }
    for(let i=0;i<points.length;i++){
      for(let j=i+1;j<points.length;j++){
        const a=points[i], b=points[j];
        const d = Math.hypot(a.x-b.x,a.y-b.y);
        if(d<90){
          ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y);
          ctx.strokeStyle = `rgba(236,233,226,${.08*(1-d/90)})`;
          ctx.lineWidth=.5; ctx.stroke();
        }
      }
    }
    if(!reduceMotion) requestAnimationFrame(draw);
  }
  resize(); draw();
}
