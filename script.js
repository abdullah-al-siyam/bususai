/* ================= LOADER ================= */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hide');
    heroIntro();
  }, 1800);
});

/* ================= HERO INTRO ANIMATION ================= */
function heroIntro(){
  const tl = gsap.timeline({ defaults:{ ease:'power3.out' }});
  tl.from('.hero-top',    { y:30, opacity:0, duration:.8 })
    .from('.hero-names',  { y:40, opacity:0, duration:1 }, '-=.4')
    .from('.hero-divider',{ scaleX:0, duration:.6 }, '-=.5')
    .from('.hero-date',   { y:20, opacity:0, duration:.7 }, '-=.4')
    .from('.hero-subdate',{ y:20, opacity:0, duration:.6 }, '-=.4')
    .from('.hero-tag',    { y:20, opacity:0, duration:.6 }, '-=.3')
    .from('.hero-btns a', { y:20, opacity:0, stagger:.15, duration:.6 }, '-=.3');
}

/* ================= MUSIC SYSTEM ================= */
let currentMusic = null;

const sounds = {
  romantic: new Howl({ src:['audio/romantic.mp3'], loop:true, volume:0.35 }),
  islamic:  new Howl({ src:['audio/islamic.mp3'],  loop:true, volume:0.35 }),
  pen:      new Howl({ src:['audio/pen.mp3'],      volume:0.6 }),
  pop:      new Howl({ src:['audio/pop.mp3'],      volume:0.6 }),
};

// শুরুতে রোমান্টিক
function playRomantic(){
  if(currentMusic === 'romantic') return;
  sounds.islamic.stop();
  sounds.romantic.play();
  currentMusic = 'romantic';
}
function playIslamic(){
  if(currentMusic === 'islamic') return;
  sounds.romantic.stop();
  sounds.islamic.play();
  currentMusic = 'islamic';
}
function stopAll(){
  sounds.romantic.stop();
  sounds.islamic.stop();
  currentMusic = null;
}

// প্রথম ইউজার ক্লিকে মিউজিক চালু (ব্রাউজার পলিসি)
document.body.addEventListener('click', () => {
  if(!currentMusic) playRomantic();
}, { once:true });

// সাউন্ড টগল
let muted = false;
document.getElementById('soundToggle').addEventListener('click', (e) => {
  e.stopPropagation();
  muted = !muted;
  Howler.mute(muted);
  e.currentTarget.textContent = muted ? '🔇' : '🔊';
});

/* ================= LANGUAGE TOGGLE ================= */
let lang = 'bn';
document.querySelectorAll('#langToggle button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#langToggle button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    lang = btn.dataset.lang;
    document.querySelectorAll('[data-bn]').forEach(el => {
      const txt = el.getAttribute('data-' + lang);
      if(txt) el.textContent = txt;
    });
    document.documentElement.lang = lang;
  });
});

/* ================= SCROLL TRIGGER (পরের সেকশনের জন্য প্রস্তুত) ================= */
gsap.registerPlugin(ScrollTrigger);

// নেভিগেশন স্মুথ (Lenis পরে যোগ হবে Part 2 এ)
/* ================= 🎂 CAKE SLIDE TO CUT ================= */
(function(){
  const track = document.getElementById('slideTrack');
  const fill  = document.getElementById('slideFill');
  const thumb = document.getElementById('slideThumb');
  const knife = document.getElementById('knife');
  const success = document.getElementById('cakeSuccess');
  if(!track) return;

  let dragging = false, startX = 0, maxX = 0, done = false;

  function init(){ maxX = track.offsetWidth - thumb.offsetWidth - 8; }

  function onDown(e){
    if(done) return;
    dragging = true;
    startX = (e.touches ? e.touches[0].clientX : e.clientX);
    thumb.style.cursor = 'grabbing';
  }
  function onMove(e){
    if(!dragging || done) return;
    const x = (e.touches ? e.touches[0].clientX : e.clientX);
    let dx = x - startX;
    dx = Math.max(0, Math.min(dx, maxX));
    thumb.style.left = (4 + dx) + 'px';
    fill.style.width = (56 + dx) + 'px';
    if(dx >= maxX - 4){ finish(); }
  }
  function onUp(){
    if(done) return;
    dragging = false;
    thumb.style.cursor = 'grab';
    // স্লাইড সম্পূর্ণ না হলে রিসেট
    if(parseInt(thumb.style.left) < maxX - 4){
      thumb.style.left = '4px';
      fill.style.width = '56px';
    }
  }
  function finish(){
    done = true; dragging = false;
    knife.classList.add('cut');
    setTimeout(()=>{
      success.classList.add('show');
      // 🎉 কনফেটি (Canvas Confetti CDN দিয়ে)
      if(window.confetti){
        confetti({ particleCount:180, spread:100, origin:{ y:.6 }, colors:['#D4AF37','#8B1E3F','#B76E79','#FFF8F0']});
        setTimeout(()=>confetti({ particleCount:120, spread:80, origin:{ x:.2, y:.5 }}), 400);
        setTimeout(()=>confetti({ particleCount:120, spread:80, origin:{ x:.8, y:.5 }}), 700);
      }
      sounds.pop.play();
    }, 900);
  }

  thumb.addEventListener('mousedown', onDown);
  thumb.addEventListener('touchstart', onDown, {passive:true});
  document.addEventListener('mousemove', onMove);
  document.addEventListener('touchmove', onMove, {passive:true});
  document.addEventListener('mouseup', onUp);
  document.addEventListener('touchend', onUp);
  window.addEventListener('resize', init);
  init();
})();

/* ================= 🕌 ISLAMIC MUSIC AUTO-SWITCH ================= */
ScrollTrigger.create({
  trigger:'#islamic',
  start:'top 60%',
  end:'bottom 40%',
  onEnter: () => playIslamic(),
  onEnterBack: () => playIslamic(),
  onLeave: () => playRomantic(),
  onLeaveBack: () => playRomantic(),
});

/* ================= ✍️ SCROLL ANIMATIONS (AOS) ================= */
AOS.init({ duration:900, once:true, easing:'ease-out-cubic' });
/* ================= 🎁 SURPRISE VIDEO ================= */
(function(){
  const box = document.getElementById('giftBox');
  const modal = document.getElementById('videoModal');
  const video = document.getElementById('surpriseVideo');
  const close = document.getElementById('videoClose');
  const endMsg = document.getElementById('videoEndMsg');
  if(!box) return;

  box.addEventListener('click', () => {
    box.classList.add('open');
    sounds.pop.play();
    setTimeout(() => {
      modal.classList.add('show');
      video.play().catch(()=>{});
      // সব মিউজিক পজ (ভিডিও অডিও কনফ্লিক্ট এড়াতে)
      sounds.romantic.pause();
      sounds.islamic.pause();
    }, 700);
  });

  function closeModal(){
    modal.classList.remove('show');
    video.pause();
    video.currentTime = 0;
    endMsg.classList.remove('show');
    box.classList.remove('open');
    // আবার মিউজিক
    if(currentMusic === 'islamic') sounds.islamic.play();
    else sounds.romantic.play();
  }

  close.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if(e.target === modal) closeModal(); });

  video.addEventListener('ended', () => endMsg.classList.add('show'));
})();

/* ================= 🎁 YES / NO ================= */
(function(){
  const yes = document.getElementById('btnYes');
  const no  = document.getElementById('btnNo');
  const tease = document.getElementById('noTease');
  const reveal = document.getElementById('giftReveal');
  if(!yes) return;

  const teases = {
    bn:[
      "উফ! ধরতে পারলে না! 😜",
      "No বাটনটি পালিয়ে যাচ্ছে! 🏃",
      "তুমি না পারবে, না! 😄",
      "বাটনটি তোমাকে ভয় পাচ্ছে! 🙈",
      "এত চেষ্টা করেও No চাপতে পারলে না! 🤭"
    ],
    en:[
      "Oops! You missed it! 😜",
      "The No button is running! 🏃",
      "You can't press it! 😄",
      "The button is scared of you! 🙈",
      "Try as you might, No won't be caught! 🤭"
    ]
  };
  let idx = 0;

  function moveNo(){
    const maxX = window.innerWidth - no.offsetWidth - 30;
    const maxY = 120;
    const x = Math.random() * maxX - (window.innerWidth/2 - no.offsetWidth);
    const y = Math.random() * maxY - (maxY/2);
    no.style.transform = `translate(${x}px, ${y}px) rotate(${Math.random()*40-20}deg)`;
    tease.textContent = teases[lang][idx % teases[lang].length];
    idx++;
    sounds.pop.play();
  }

  no.addEventListener('mouseenter', moveNo);
  no.addEventListener('touchstart', (e)=>{ e.preventDefault(); moveNo(); }, {passive:false});
  no.addEventListener('click', (e)=>{ e.preventDefault(); moveNo(); });

  yes.addEventListener('click', () => {
    reveal.classList.add('show');
    sounds.pop.play();
    if(window.confetti){
      confetti({ particleCount:150, spread:90, origin:{ y:.7 }, colors:['#D4AF37','#8B1E3F','#B76E79']});
    }
    reveal.scrollIntoView({behavior:'smooth', block:'center'});
  });
})();

/* ================= ⏳ COUNTDOWN ================= */
(function(){
  const startDate = new Date('2025-10-24T00:00:00');
  const el = id => document.getElementById(id);
  if(!el('cSec')) return;

  // বাংলা সংখ্যা
  const bn = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
  function toBn(n){ return String(n).padStart(2,'0').split('').map(d=>bn[+d]).join(''); }
  function fmt(n){ return lang === 'bn' ? toBn(n) : String(n).padStart(2,'0'); }

  function update(){
    const now = new Date();
    let diff = Math.floor((now - startDate)/1000);
    if(diff < 0) diff = 0;

    const years  = Math.floor(diff / (365.25*24*3600));
    diff -= years * 365.25*24*3600;

    const months = Math.floor(diff / (30.44*24*3600));
    diff -= months * 30.44*24*3600;

    const days   = Math.floor(diff / (24*3600)); diff -= days*24*3600;
    const hours  = Math.floor(diff / 3600);      diff -= hours*3600;
    const mins   = Math.floor(diff / 60);        diff -= mins*60;
    const secs   = Math.floor(diff);

    el('cYear').textContent  = fmt(years);
    el('cMonth').textContent = fmt(months);
    el('cDay').textContent   = fmt(days);
    el('cHour').textContent  = fmt(hours);
    el('cMin').textContent   = fmt(mins);
    el('cSec').textContent   = fmt(secs);
  }
  update();
  setInterval(update, 1000);
})();

/* ================= TIMELINE SCROLL ANIMATION ================= */
gsap.utils.toArray('.tl-item').forEach(item => {
  gsap.from(item.querySelector('.tl-card'), {
    scrollTrigger:{ trigger:item, start:'top 85%' },
    y:40, opacity:0, duration:.9, ease:'power3.out'
  });
});
/* ================= ✍️ LETTER TYPEWRITER ================= */
(function(){
  const content = document.getElementById('letterContent');
  const sign = document.getElementById('letterSign');
  const pen = document.getElementById('penIcon');
  if(!content) return;

  let started = false;

  function typeLetter(){
    if(started) return;
    started = true;

    const full = content.getAttribute('data-full-' + lang);
    content.textContent = '';
    pen.classList.add('show');

    let i = 0;
    function tick(){
      if(i < full.length){
        content.textContent += full[i];
        // প্রতি ২ অক্ষরে কলমের সাউন্ড (অনেক loud না হওয়ার জন্য)
        if(i % 3 === 0) sounds.pen.play();
        i++;
        setTimeout(tick, 45);
      } else {
        pen.classList.remove('show');
        content.classList.add('done');
        sign.classList.add('show');
      }
    }
    tick();
  }

  // ভাষা বদলালে রিসেট
  document.querySelectorAll('#langToggle button').forEach(b=>{
    b.addEventListener('click', ()=>{ started = false; content.classList.remove('done'); sign.classList.remove('show'); content.textContent=''; });
  });

  ScrollTrigger.create({
    trigger:'#letter',
    start:'top 65%',
    once:true,
    onEnter: typeLetter
  });
})();

/* ================= 🧠 ISLAMIC QUIZ ================= */
(function(){
  const questions = [
    {
      bn:"দাম্পত্য জীবনে কুরআনে স্বামী-স্ত্রীকে কী বলা হয়েছে?",
      en:"In the Quran, what are husband and wife called for each other?",
      opts:{
        bn:["বন্ধু","পোশাক","সাথী","আত্মীয়"],
        en:["Friends","Garments","Companions","Relatives"]
      },
      ans:1
    },
    {
      bn:"কোন সূরায় বলা হয়েছে আল্লাহ স্বামী-স্ত্রীর মাঝে ভালোবাসা ও দয়া দিয়েছেন?",
      en:"Which surah says Allah placed love & mercy between spouses?",
      opts:{
        bn:["সূরা আল-বাকারা","সূরা আর-রূম","সূরা আন-নিসা","সূরা আল-ফুরকান"],
        en:["Al-Baqarah","Ar-Rum","An-Nisa","Al-Furqan"]
      },
      ans:1
    },
    {
      bn:"হাদিস অনুযায়ী তোমাদের মধ্যে সর্বোত্তম ব্যক্তি কে?",
      en:"According to hadith, who is the best among you?",
      opts:{
        bn:["যে বেশি নামাজ পড়ে","যে বেশি দান করে","যে তার পরিবারের প্রতি সর্বোত্তম","যে বেশি রোজা রাখে"],
        en:["Who prays most","Who gives most charity","Who is best to his family","Who fasts most"]
      },
      ans:2
    },
    {
      bn:"‘তারা তোমাদের পোশাক, তোমরা তাদের পোশাক’ — কোন সূরায়?",
      en:"‘They are your garment, you are theirs’ — which surah?",
      opts:{
        bn:["সূরা আল-বাকারা","সূরা আর-রূম","সূরা আন-নূর","সূরা আল-ফুরকান"],
        en:["Al-Baqarah","Ar-Rum","An-Nur","Al-Furqan"]
      },
      ans:0
    },
    {
      bn:"সন্তান ও স্ত্রীকে ‘চোখের শীতলতা’ বলার দোয়া কোন সূরায়?",
      en:"Which surah has the dua for spouses/children as ‘comfort of eyes’?",
      opts:{
        bn:["সূরা আল-ফুরকান","সূরা আর-রূম","সূরা আল-বাকারা","সূরা আন-নিসা"],
        en:["Al-Furqan","Ar-Rum","Al-Baqarah","An-Nisa"]
      },
      ans:0
    }
  ];

  const box = document.getElementById('quizBox');
  if(!box) return;

  let idx = 0, score = 0;
  const qText = document.getElementById('questionText');
  const qOpts = document.getElementById('quizOptions');
  const qFb = document.getElementById('quizFeedback');
  const qNow = document.getElementById('qNow');
  const qTotal = document.getElementById('qTotal');
  const cert = document.getElementById('certificate');
  const certDate = document.getElementById('certDate');

  const bnNum = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
  function num(n){ return lang==='bn' ? String(n).split('').map(d=>bnNum[+d]).join('') : n; }

  qTotal.textContent = num(questions.length);

  function render(){
    const q = questions[idx];
    qNow.textContent = num(idx+1);
    qText.textContent = q[lang];
    qFb.textContent = '';
    qOpts.innerHTML = '';
    q.opts[lang].forEach((opt, i)=>{
      const b = document.createElement('button');
      b.className = 'quiz-opt';
      b.textContent = opt;
      b.onclick = ()=> choose(i, b);
      qOpts.appendChild(b);
    });
  }

  function choose(i, btn){
    const q = questions[idx];
    const all = qOpts.querySelectorAll('.quiz-opt');
    all.forEach(b => b.disabled = true);

    if(i === q.ans){
      btn.classList.add('correct');
      score++;
      qFb.textContent = lang==='bn' ? '✅ সঠিক!' : '✅ Correct!';
      sounds.pop.play();
      if(window.confetti) confetti({ particleCount:60, spread:60, origin:{y:.7}, colors:['#D4AF37','#2ea043'] });
    } else {
      btn.classList.add('wrong');
      all[q.ans].classList.add('correct');
      qFb.textContent = lang==='bn' ? '❌ ভুল উত্তর।' : '❌ Wrong answer.';
    }

    setTimeout(()=>{
      idx++;
      if(idx < questions.length) render();
      else finish();
    }, 1400);
  }

  function finish(){
    box.style.display = 'none';
    cert.classList.add('show');
    certDate.textContent = lang==='bn'
      ? 'তারিখ: ' + new Date().toLocaleDateString('bn-BD')
      : 'Date: ' + new Date().toLocaleDateString('en-GB');
    if(window.confetti){
      confetti({ particleCount:220, spread:120, origin:{y:.6}, colors:['#D4AF37','#8B1E3F','#B76E79','#FFF8F0']});
      setTimeout(()=>confetti({ particleCount:180, spread:100, origin:{x:.2,y:.6}}), 400);
      setTimeout(()=>confetti({ particleCount:180, spread:100, origin:{x:.8,y:.6}}), 800);
    }
  }

  render();

  // ভাষা বদলালে কুইজ রিরেন্ডার
  document.querySelectorAll('#langToggle button').forEach(b=>{
    b.addEventListener('click', ()=> setTimeout(render, 50));
  });
})();

/* ================= 🤲 DUA BOARD ================= */
(function(){
  const form = document.getElementById('duaForm');
  const list = document.getElementById('duaList');
  if(!form) return;

  const defaultDuas = [
    { name:'আম্মু',   text:'আল্লাহ তোমাদের দুজনকে জান্নাত পর্যন্ত একসাথে রাখুন।' },
    { name:'আব্বু',   text:'তোমাদের সংসারে বরকত দিন, সুখে রাখুন।' },
    { name:'ভাইয়া',  text:'তোমরা সুখে থাকো — এটাই আমার গিফট ব্যাক।' }
  ];

  function render(list_){
    list.innerHTML = '';
    list_.forEach(d => {
      const c = document.createElement('div');
      c.className = 'dua-card';
      c.innerHTML = `<h4>🤲 ${d.name}</h4><p>${d.text}</p>`;
      list.appendChild(c);
    });
  }

  const saved = JSON.parse(localStorage.getItem('duas') || '[]');
  render([...defaultDuas, ...saved]);

  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const name = document.getElementById('duaName').value.trim();
    const text = document.getElementById('duaText').value.trim();
    if(!name || !text) return;
    saved.push({ name, text });
    localStorage.setItem('duas', JSON.stringify(saved));
    render([...defaultDuas, ...saved]);
    form.reset();
    sounds.pop.play();
    if(window.confetti) confetti({ particleCount:80, spread:70, origin:{y:.8}, colors:['#D4AF37'] });
    list.lastElementChild?.scrollIntoView({behavior:'smooth', block:'center'});
  });
})();

/* ================= 🌸 FALLING PETALS ================= */
(function(){
  const wrap = document.getElementById('petals');
  if(!wrap) return;
  const items = ['🌸','🌺','💮','🌹','✨','🤍'];
  for(let i=0;i<18;i++){
    const p = document.createElement('span');
    p.className = 'petal';
    p.textContent = items[Math.floor(Math.random()*items.length)];
    p.style.left = Math.random()*100 + 'vw';
    p.style.animationDuration = (8 + Math.random()*10) + 's';
    p.style.animationDelay = (Math.random()*8) + 's';
    p.style.fontSize = (0.8 + Math.random()*0.9) + 'rem';
    wrap.appendChild(p);
  }
})();

/* ================= 🌊 SMOOTH SCROLL (LENIS) ================= */
// Lenis CDN index.html-এ যোগ করুন (নিচে দেখুন)
if(window.Lenis){
  const lenis = new Lenis({ duration:1.1, smoothWheel:true });
  function raf(t){ lenis.raf(t); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);
  lenis.on('scroll', ScrollTrigger.update);
}

/* ================= FINAL POLISH ================= */
window.addEventListener('load', ()=>{
  ScrollTrigger.refresh();
  AOS.refresh();
});