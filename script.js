const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const PAYMENT='https://rzp.io/rzp/KGXR4D3';
const PORTAL='https://drive.google.com/drive/folders/1mTcOr9r5IKXvQq97HyAf4x8wze__XMit';

// Enrollment modal: payment is only opened from the explicit final action.
let lastFocused=null;
function openCourse(){const m=$('#courseModal');if(!m)return;lastFocused=document.activeElement;const iframe=m.querySelector('[data-youtube-modal]');if(iframe&&!iframe.src.endsWith('about:blank')){}else if(iframe){const id=iframe.getAttribute('data-youtube-modal');iframe.src=`https://www.youtube.com/embed/${id}?rel=0&modestbranding=1&playsinline=1`;};m.classList.add('open');m.setAttribute('aria-hidden','false');document.body.classList.add('lock');setTimeout(()=>m.querySelector('.modal-close')?.focus(),40)}
function closeCourse(){const m=$('#courseModal');if(!m)return;m.classList.remove('open');m.setAttribute('aria-hidden','true');const iframe=m.querySelector('[data-youtube-modal]');if(iframe)iframe.src='about:blank';document.body.classList.remove('lock');lastFocused?.focus?.()}
$$('[data-course]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();openCourse()}));
$$('[data-close]').forEach(b=>b.addEventListener('click',closeCourse));

// Lightweight YouTube facades: videos load only when the visitor asks to play.
$$('[data-youtube]').forEach((trigger)=>{
  trigger.addEventListener('click',()=>{
    const id=trigger.getAttribute('data-youtube');
    if(!id)return;
    const iframe=document.createElement('iframe');
    iframe.src=`https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1&playsinline=1&autoplay=1&controls=1&fs=1&iv_load_policy=3&vq=hd1080`;
    iframe.title=trigger.getAttribute('aria-label')||'YouTube video';
    iframe.loading='lazy';
    iframe.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.allowFullscreen=true;
    iframe.setAttribute('playsinline',''); iframe.setAttribute('referrerpolicy','strict-origin-when-cross-origin');
    iframe.style.cssText='display:block;width:100%;height:100%;border:0;background:#050608';
    trigger.replaceWith(iframe);
  },{passive:true});
});
document.addEventListener('keydown',e=>{
  if(e.key==='Escape') closeCourse();
  const m=$('#courseModal');
  if(m?.classList.contains('open')&&e.key==='Tab'){
    const focusables=$$('a[href],button,input,select,textarea,[tabindex]:not([tabindex="-1"])',m).filter(x=>!x.disabled);
    if(focusables.length){const first=focusables[0],last=focusables[focusables.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}
  }
});

// Offer reminder: first display after 6s, then every 6s after dismissal, maximum 4 appearances per session.
// Repeated X dismissals consume the four reminders. Enter or the enrollment action ends reminders immediately.
const toast=$('#offerToast'),toastClose=$('#toastClose');
const OFFER_MAX=4,OFFER_RESHOW_MS=6000,OFFER_FIRST_MS=6000;
let offerTimer=null;
const offerCount=()=>Number(sessionStorage.getItem('eca_offer_count')||'0');
const offerEnded=()=>sessionStorage.getItem('eca_offer_ended')==='1';
const hideOffer=()=>{if(!toast)return;toast.classList.remove('show');toast.setAttribute('aria-hidden','true')};
const stopOffer=()=>{sessionStorage.setItem('eca_offer_ended','1');hideOffer();clearTimeout(offerTimer)};
const showOffer=()=>{
  if(!toast||offerEnded()||offerCount()>=OFFER_MAX)return;
  sessionStorage.setItem('eca_offer_count',String(offerCount()+1));
  toast.classList.add('show');
  toast.setAttribute('aria-hidden','false');
};
const scheduleOffer=delay=>{
  clearTimeout(offerTimer);
  if(!toast||offerEnded()||offerCount()>=OFFER_MAX)return;
  offerTimer=setTimeout(showOffer,delay);
};
if(toast){
  scheduleOffer(OFFER_FIRST_MS);
  toastClose?.addEventListener('click',e=>{
    e.preventDefault(); e.stopPropagation();
    hideOffer();
    if(offerCount()>=OFFER_MAX) stopOffer(); else scheduleOffer(OFFER_RESHOW_MS);
  });
  toast.querySelector('[data-course]')?.addEventListener('click',()=>stopOffer());
  document.addEventListener('keydown',e=>{
    if(e.key==='Enter'&&toast.classList.contains('show')) stopOffer();
  });
}

// Responsive navigation: desktop active state + mobile drawer with geometry-aware positioning.
const menu=$('[data-menu]'),header=$('.header'),navBackdrop=$('.nav-backdrop');
const navLinks=$$('.navlinks a');
const isMobileNav=()=>matchMedia('(max-width:900px)').matches;
const syncNavGeometry=()=>{
  if(!header)return;
  const rect=header.getBoundingClientRect();
  document.documentElement.style.setProperty('--eca-header-bottom',`${Math.max(0,Math.round(rect.bottom))}px`);
};
syncNavGeometry();
addEventListener('resize',syncNavGeometry,{passive:true});
addEventListener('scroll',()=>{if(isMobileNav()&&header?.classList.contains('nav-open'))syncNavGeometry()},{passive:true});
if(menu&&header){
  const setNav=open=>{
    syncNavGeometry();
    header.classList.toggle('nav-open',open);
    menu.setAttribute('aria-expanded',String(open));
    menu.setAttribute('aria-label',open?'Close navigation':'Open navigation');
    navBackdrop?.setAttribute('aria-hidden',String(!open));
    document.body.classList.toggle('nav-locked',open&&isMobileNav());
  };
  const closeNav=()=>setNav(false);
  menu.addEventListener('click',()=>setNav(!header.classList.contains('nav-open')));
  navBackdrop?.addEventListener('click',closeNav);
  navLinks.forEach(a=>a.addEventListener('click',closeNav));
  addEventListener('resize',()=>{syncNavGeometry();if(!isMobileNav())setNav(false)},{passive:true});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeNav()});
}
const path=(location.pathname.split('/').pop()||'index.html');
navLinks.forEach(a=>{const target=(a.getAttribute('href')||'').replace('./','');if(target===path||(!target&&path==='index.html'))a.setAttribute('aria-current','page')});

// Native-feeling smooth transitions for in-page anchors.
document.addEventListener('click',e=>{
  const a=e.target.closest('a[href^="#"]');
  if(!a)return;
  const id=a.getAttribute('href');
  if(!id||id==='#')return;
  const target=document.querySelector(id);
  if(!target)return;
  e.preventDefault();
  target.scrollIntoView({behavior:reduced?'auto':'smooth',block:'start'});
  history.replaceState(null,'',id);
});

// Mobile-first scroll reveals: no hover dependency.
const reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;
const io=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in');io.unobserve(entry.target)}}),{threshold:.08,rootMargin:'0px 0px -8% 0px'});
$$('.reveal').forEach((el,i)=>{if(!el.dataset.delay)el.style.setProperty('--reveal-index',String(i%5));io.observe(el)});
$$('.review-card').forEach((el,i)=>el.style.setProperty('--review-index',String(i)));

// Reading progress. Useful on long desktop pages and compact mobile pages.
const progress=$('#scrollProgress');
let scrollFrame=0;
const renderScroll=()=>{scrollFrame=0;const h=document.documentElement.scrollHeight-window.innerHeight;const v=h>0?window.scrollY/h:0;if(progress)progress.style.transform=`scaleX(${Math.max(0,Math.min(1,v))})`;document.body.classList.toggle('is-scrolled',window.scrollY>16)};
const requestScrollRender=()=>{if(scrollFrame===0)scrollFrame=requestAnimationFrame(renderScroll)};
renderScroll();addEventListener('scroll',requestScrollRender,{passive:true});addEventListener('resize',requestScrollRender,{passive:true});

// Desktop pointer depth; touch devices get press feedback from CSS instead.
if(matchMedia('(hover:hover) and (pointer:fine)').matches&&!reduced){$$('.depth-card').forEach(card=>{card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5;const y=(e.clientY-r.top)/r.height-.5;card.style.transform=`perspective(900px) rotateX(${(-y*2.5).toFixed(2)}deg) rotateY(${(x*3).toFixed(2)}deg) translateY(-4px)`});card.addEventListener('pointerleave',()=>card.style.transform='')})}

// Curriculum renderer.
const lessons=[
['What Is AI Video Creation?','FOUNDATION','Understand the AI video creation landscape and how the medium works.'],
['Free AI Tools For AI Video Creation.','FOUNDATION','Identify accessible tools and where they fit in a creator workflow.'],
['Prompt Engineering Basics','FOUNDATION','Write clearer prompts with intent, structure and useful specificity.'],
['How To Create AI Images?','VISUAL','Generate visual assets that can become the foundation for motion.'],
['Canva AI Tutorial','VISUAL','Use Canva AI to turn ideas into practical creative assets.'],
['AI Image To Video Conversion.','VISUAL','Move from still images into animated and video outputs.'],
['How To Create AI Avatar?','VISUAL','Explore presenter and character-led avatar creation workflows.'],
['How To Create AI Videos?','PRODUCTION','Connect prompts, visuals and motion into a complete video workflow.'],
['Creator Workflow — Idea To Output','PRODUCTION','Turn separate skills into a repeatable end-to-end creator process.'],
['How To Create AI Story Videos?','STORY','Build narrative-led videos with characters, scenes and structure.'],
['How To Create AI Ad Videos?','COMMERCIAL','Apply AI creation to products, services and promotional ideas.'],
['How To Create AI Movies?','CINEMA','Explore cinematic concepts, scenes and AI-assisted production.'],
['AI Voiceover Creation.','AUDIO','Create narration and voice layers for creative work.'],
['AI Song Creation.','AUDIO','Explore AI-assisted music and song creation.'],
['Inshot Video Editing.','EDITING','Assemble and polish AI-generated assets for publishing.'],
['Gamma AI Tutorial.','COMMUNICATION','Turn ideas into polished AI-assisted presentations.']
];
const list=$('#lessonList');
if(list){list.innerHTML=lessons.map((l,i)=>`<article class="lesson reveal" style="--reveal-index:${i%6}"><span class="n">${String(i+1).padStart(2,'0')}</span><div><h3>${l[0]}</h3><p>${l[1]}</p></div><div class="outcome"><b>OUTCOME</b>${l[2]}</div></article>`).join('');$$('.lesson',list).forEach(el=>io.observe(el))}

// Certificate lightbox.
$$('[data-cert]').forEach(c=>c.addEventListener('click',()=>{const m=$('#certModal'),img=$('#certLarge');if(!m||!img)return;img.src=c.querySelector('img').src;m.classList.add('open');m.setAttribute('aria-hidden','false');document.body.classList.add('lock')}));
$$('[data-cert-close]').forEach(b=>b.addEventListener('click',()=>{$('#certModal')?.classList.remove('open');document.body.classList.remove('lock')}));

// Front-end student entry shell: no passwords stored. Real authentication requires a backend/auth provider.
const loginForm=$('#studentLoginForm');
if(loginForm){loginForm.addEventListener('submit',e=>{e.preventDefault();const email=$('#studentEmail')?.value.trim();if(!email||!email.includes('@'))return;localStorage.setItem('eca_student_email',email);window.location.href='portal.html'})}
const storedStudentEmail=localStorage.getItem('eca_student_email');
if(path==='portal.html'&&!storedStudentEmail){window.location.replace('login.html');}
const studentEmail=$('#studentEmailView');if(studentEmail)studentEmail.textContent=storedStudentEmail||'Student';
const logout=$('#studentLogout');if(logout)logout.addEventListener('click',()=>{localStorage.removeItem('eca_student_email');window.location.href='login.html'});

// Prevent background focus while the mobile navigation is expanded.
window.addEventListener('pageshow',()=>document.body.classList.add('page-transition'));
