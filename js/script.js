// ------- Config -------
const ANNIVERSARY = new Date('2023-08-16T00:00:00'); // วันครบรอบ
const ACCEPTED_PASSWORDS = [
  '16 สิงหาคม 2023', '16สิงหาคม2023',
  '16-08-2023', '16/08/2023', '16082023', '16 08 2023'
];

// ------- Helpers -------
function $(sel){ return document.querySelector(sel); }

function normalizeThaiDigits(str){
  // แปลงเลขไทยเป็นอารบิก
  const map = {'๐':'0','๑':'1','๒':'2','๓':'3','๔':'4','๕':'5','๖':'6','๗':'7','๘':'8','๙':'9'};
  return str.replace(/[๐-๙]/g, d => map[d]);
}

function isPasswordValid(input){
  if(!input) return false;
  const cleaned = normalizeThaiDigits(input.trim().replace(/\s+/g,' '));
  const variants = new Set(ACCEPTED_PASSWORDS.map(v=>normalizeThaiDigits(v)));
  return variants.has(cleaned);
}

function fmtCounter(fromDate){
  const now = new Date();
  const diff = now - fromDate;
  const days = Math.floor(diff / (1000*60*60*24));
  const hours = Math.floor((diff / (1000*60*60)) % 24);
  const mins = Math.floor((diff / (1000*60)) % 60);
  const secs = Math.floor((diff / 1000) % 60);
  return `${days} วัน ${hours} ชั่วโมง ${mins} นาที ${secs} วินาที`;
}

// ------- Typewriter on index -------
(function initTypewriter(){
  const el = $('#typewriter');
  if(!el) return;
  const text = 'Happy Anniversary 2 year💕';
  let i = 0;
  function type(){
    if(i <= text.length){
      el.textContent = text.slice(0,i);
      i++;
      setTimeout(type, 110);
    }
  }
  type();
})();

// ------- Counter (on pages that have #counter) -------
(function initCounter(){
  const label = $('#counter');
  if(!label) return;
  function tick(){ label.textContent = fmtCounter(ANNIVERSARY); }
  tick();
  setInterval(tick, 1000);
})();

// ------- Password page -------
(function initPassword(){
  const pass = $('#password');
  const btn = $('#enterBtn');
  if(!pass || !btn) return;
  btn.addEventListener('click', ()=>{
    if(isPasswordValid(pass.value)){
      document.body.classList.add('fade-out');
      setTimeout(()=>location.href='main.html', 320);
    } else {
      $('#error').textContent = 'รหัสไม่ตรง ลองอีกครั้งนะ 💗';
    }
  });
  pass.addEventListener('keydown', e=>{
    if(e.key==='Enter') btn.click();
  });
})();

// ------- Music control (persist with localStorage) -------
(function initMusic(){
  const audio = $('#bgm');
  const toggle = $('#musicToggle');
  if(!audio || !toggle) return;

  let enabled = localStorage.getItem('music') === 'on';
  toggleLabel();

  // try autoplay if enabled
  if(enabled){
    audio.play().catch(()=>{});
  }

  toggle.addEventListener('click', ()=>{
    enabled = !enabled;
    if(enabled){
      audio.play().catch(()=>{});
      localStorage.setItem('music','on');
    } else {
      audio.pause();
      localStorage.setItem('music','off');
    }
    toggleLabel();
  });

  function toggleLabel(){
    toggle.textContent = (enabled ? '🔊 ปิดเพลง' : '🔈 เปิดเพลง');
  }
})();

// ------- Hearts background + click to spawn -------
(function initHearts(){
  const canvas = document.getElementById('hearts-canvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let W = canvas.width = innerWidth;
  let H = canvas.height = innerHeight;
  let hearts = [];

  function onResize(){
    W = canvas.width = innerWidth;
    H = canvas.height = innerHeight;
  }
  addEventListener('resize', onResize);

  class Heart{
    constructor(x, y, s, vy){
      this.x = x; this.y = y; this.s = s; this.vy = vy;
      this.alpha = 0.9; this.vx = (Math.random()-.5)*0.4;
    }
    step(){
      this.y -= this.vy;
      this.x += this.vx;
      this.alpha -= 0.004 + Math.random()*0.003;
      return this.alpha > 0 && this.y > -30;
    }
    draw(){
      ctx.save();
      ctx.globalAlpha = Math.max(this.alpha,0);
      ctx.fillStyle = '#ff6fa3';
      ctx.beginPath();
      const s = this.s;
      ctx.moveTo(this.x, this.y);
      ctx.bezierCurveTo(this.x - s/2, this.y - s/2, this.x - s, this.y + s/3, this.x, this.y + s);
      ctx.bezierCurveTo(this.x + s, this.y + s/3, this.x + s/2, this.y - s/2, this.x, this.y);
      ctx.fill();
      ctx.restore();
    }
  }

  function spawn(n=1, x=Math.random()*W, y=H+20){
    for(let i=0;i<n;i++){
      hearts.push(new Heart(x + (Math.random()*30-15), y + Math.random()*10, 12+Math.random()*16, 0.6+Math.random()*0.9));
    }
  }

  setInterval(()=>spawn(2), 220);
  addEventListener('click', (e)=>spawn(12, e.clientX, e.clientY));

  function loop(){
    ctx.clearRect(0,0,W,H);
    hearts = hearts.filter(h=>{
      h.draw();
      return h.step();
    });
    requestAnimationFrame(loop);
  }
  loop();
})();
