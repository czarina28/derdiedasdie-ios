import {checkAnswer} from './sentences.js';
import {buildCatalog} from './catalog.js';
import {pickFreshQuestions,pickProgressiveQuestions,practiceStage,shuffle} from './session.js';
import './style.css';
const bank=buildCatalog();
const root=document.getElementById('app');
let deck=[],question=null,answered=false,correct=0,total=0,position=0,mode='Mixed practice',mistakes=new Set(),reviewStartingCount=0;
try{const saved=JSON.parse(localStorage.getItem('derdiedasdie-mistakes')||'[]');mistakes=new Set(saved.map(id=>typeof id==='number'?bank.find(q=>q.legacyId===id)?.id:id).filter(Boolean));localStorage.setItem('derdiedasdie-mistakes',JSON.stringify([...mistakes]));}catch{mistakes=new Set();}

function start(topic){mode=topic;const pool=topic==='Review mistakes'?bank.filter(q=>mistakes.has(q.id)):bank;const recent=JSON.parse(localStorage.getItem('derdiedasdie-recent')||'[]').map(id=>typeof id==='number'?bank.find(q=>q.legacyId===id)?.id:id).filter(Boolean);const history=JSON.parse(localStorage.getItem('derdiedasdie-sessions')||'[]');reviewStartingCount=topic==='Review mistakes'?pool.length:0;deck=topic==='Review mistakes'?shuffle(pool):topic==='Mixed practice'?pickProgressiveQuestions(pool,topic,recent,practiceStage(history)):pickFreshQuestions(pool,topic,recent);position=0;correct=0;total=0;if(deck.length)next();else if(topic==='Review mistakes')emptyReview();else home();}
function next(){if(position>=deck.length){summary();return;}question={...deck[position++]};const recent=JSON.parse(localStorage.getItem('derdiedasdie-recent')||'[]').map(id=>typeof id==='number'?bank.find(q=>q.legacyId===id)?.id:id).filter(Boolean);recent.push(question.id);localStorage.setItem('derdiedasdie-recent',JSON.stringify(recent.slice(-Math.min(80,bank.length-10))));question.options=shuffle(question.options);answered=false;render();}
function home(){
 const sessions=JSON.parse(localStorage.getItem('derdiedasdie-sessions')||'[]');
 const completed=sessions.length;
 const topics=[['Articles & endings','der · die · das'],['Viel & viele','Quantity & endings'],['Genitive','Possession & cases'],['Verbs & prepositions','Fixed combinations'],['Word order & clauses','Build better sentences']];
 root.innerHTML=`<main class="home-screen"><header><span class="brand">der<span>die</span>das<span>die</span></span><span class="header-note">GERMAN, EVERY DAY.</span></header>
 <section class="home-hero"><div class="eyebrow">YOUR DAILY GERMAN</div><h1>A little practice.<br><em>A lot of progress.</em></h1><p>Practice German grammar, ten questions at a time.</p><button class="hero-start" data-mode="Mixed practice"><span>Start a mixed session <small>10 questions · all topics</small></span><span aria-hidden="true">↗</span></button></section>
 <section class="home-stats" aria-label="Your progress"><div><strong>${completed}</strong><span>Rounds completed</span></div><div><strong>${bank.length}</strong><span>Practice questions</span></div><div><strong>${mistakes.size}</strong><span>Mistakes to review</span></div></section>
 <section class="topic-section"><div class="section-heading"><h2>Choose your focus</h2><span>5 TOPICS</span></div><div class="topic-list">${topics.map(([name,detail],i)=>`<button data-mode="${name}"><span class="topic-index">${String(i+1).padStart(2,'0')}</span><span class="topic-copy"><strong>${name}</strong><small>${detail}</small></span><span class="topic-arrow" aria-hidden="true">↗</span></button>`).join('')}</div></section>
 <button class="review-link" data-mode="Review mistakes"><span>↺ &nbsp; Review mistakes <strong>(${mistakes.size})</strong></span></button>
 <footer>Made for curious German learners. Every topic is free.</footer></main>`;
 document.querySelectorAll('[data-mode]').forEach(b=>b.addEventListener('click',()=>start(b.dataset.mode)));
}
function emptyReview(){
 root.innerHTML='<main><section class="intro session-summary"><div class="eyebrow">REVIEW MISTAKES</div><h1>All caught up.</h1><p>No mistakes waiting for review.</p><button id="back">Back home</button></section></main>';
 document.getElementById('back').addEventListener('click',home);
}
function summary(){
 if(mode==='Review mistakes'){
  const cleared=reviewStartingCount-mistakes.size;
  root.innerHTML='<main><section class="intro session-summary"><div class="eyebrow">REVIEW COMPLETE</div><h1>'+cleared+' cleared</h1><p>You reviewed '+total+' questions. '+(mistakes.size===0?'Your mistake list is empty.':mistakes.size+' still to revisit in a future review.')+'</p><button id="back">Back home</button></section></main>';
  document.getElementById('back').addEventListener('click',home);
  return;
 }

 const history=JSON.parse(localStorage.getItem('derdiedasdie-sessions')||'[]');history.push({date:new Date().toISOString(),mode,correct,total});localStorage.setItem('derdiedasdie-sessions',JSON.stringify(history.slice(-100)));
 root.innerHTML='<main><header><span class="brand">derdiedasdie</span></header><section class="intro session-summary"><div class="eyebrow">SESSION COMPLETE</div><h1>'+correct+' out of '+total+'</h1><p>'+ (correct===total?'Perfect round. Every answer correct.':correct>=8?'Strong round. Keep the momentum.':'Every mistake is a chance to learn. Try another round.') +'</p><button id="again">Another session</button><button id="back">Choose a topic</button></section></main>';
 document.getElementById('again').addEventListener('click',()=>start(mode));
 document.getElementById('back').addEventListener('click',home);
}
function render(){
 root.innerHTML=`<main><header class="practice-header"><button class="home-exit" id="exit" aria-label="Leave practice and return home">← <span>Home</span></button><span class="brand">der<span>die</span>das<span>die</span></span></header>
 <section class="intro quiz-intro"><div class="eyebrow">DAILY PRACTICE</div><h1>Complete the sentence.</h1><p>Choose an answer, then learn why it works.</p></section>
 <section class="quiz"><div class="meta"><span>${mode} · Question ${position} of ${deck.length}${mode==='Review mistakes'?' · '+mistakes.size+' still to review':''}</span><span>${correct} / ${total} correct</span></div>
 <div class="progress-track" role="progressbar" aria-label="Session progress" aria-valuemin="0" aria-valuemax="${deck.length}" aria-valuenow="${position-1}"><div class="progress-fill" style="width:${Math.round((position-1)/deck.length*100)}%"></div></div>
 <h2 lang="de">${question.before}<span class="blank">_____</span>${question.after}</h2>
 <div class="answers" role="group" aria-label="Answer choices">${question.options.map((opt,i)=>`<button class="answer" data-i="${i}" lang="de">${opt}</button>`).join('')}</div>
 <div id="feedback" aria-live="polite"></div><button id="next" hidden>${position===deck.length?'See results →':'Next sentence →'}</button></section>
 <footer>Early prototype: sentence content awaits independent language review. No purchases enabled.</footer></main>`;
 document.querySelectorAll('.answer').forEach(btn=>btn.addEventListener('click',()=>{
 if(answered)return;answered=true;total++;const selected=question.options[Number(btn.dataset.i)];const ok=checkAnswer(question,selected);if(ok){correct++;mistakes.delete(question.id);}else mistakes.add(question.id);localStorage.setItem('derdiedasdie-mistakes',JSON.stringify([...mistakes]));
 document.querySelectorAll('.answer').forEach(b=>{b.disabled=true;const v=question.options[Number(b.dataset.i)];if(v===question.answer)b.classList.add('right');else if(b===btn)b.classList.add('wrong');});
 const specific=!ok&&question.wrongFeedback?.[selected];
 document.getElementById('feedback').textContent=(ok?'✓ Correct. Why? ':'Not quite. Correct answer: '+question.answer+'. Why? ')+(specific?specific+' ':'')+question.explanation;
 document.getElementById('next').hidden=false;
 document.getElementById('next').focus({preventScroll:true});
 }));
 document.getElementById('next').addEventListener('click',next);
 document.getElementById('exit').addEventListener('click',home);
}
if(!bank.length)throw new Error('No validated questions');
home();
