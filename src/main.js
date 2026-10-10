import {checkAnswer} from './sentences.js';
import {buildCatalog} from './catalog.js';
import {pickFreshQuestions,pickProgressiveQuestions,practiceStage,shuffle} from './session.js';
import './style.css';
const bank=buildCatalog();
const root=document.getElementById('app');
let deck=[],question=null,answered=false,correct=0,total=0,position=0,mode='Mixed practice',mistakes=new Set();
try{const saved=JSON.parse(localStorage.getItem('derdiedasdie-mistakes')||'[]');mistakes=new Set(saved.map(id=>typeof id==='number'?bank.find(q=>q.legacyId===id)?.id:id).filter(Boolean));localStorage.setItem('derdiedasdie-mistakes',JSON.stringify([...mistakes]));}catch{mistakes=new Set();}

function start(topic){mode=topic;const pool=topic==='Review mistakes'?bank.filter(q=>mistakes.has(q.id)):bank;const recent=JSON.parse(localStorage.getItem('derdiedasdie-recent')||'[]').map(id=>typeof id==='number'?bank.find(q=>q.legacyId===id)?.id:id).filter(Boolean);const history=JSON.parse(localStorage.getItem('derdiedasdie-sessions')||'[]');deck=topic==='Mixed practice'?pickProgressiveQuestions(pool,topic,recent,practiceStage(history)):pickFreshQuestions(pool,topic==='Review mistakes'?'Mixed practice':topic,recent);position=0;correct=0;total=0;if(deck.length)next();else home();}
function next(){if(position>=deck.length){summary();return;}question={...deck[position++]};const recent=JSON.parse(localStorage.getItem('derdiedasdie-recent')||'[]').map(id=>typeof id==='number'?bank.find(q=>q.legacyId===id)?.id:id).filter(Boolean);recent.push(question.id);localStorage.setItem('derdiedasdie-recent',JSON.stringify(recent.slice(-Math.min(80,bank.length-10))));question.options=shuffle(question.options);answered=false;render();}
function home(){
 root.innerHTML='<main><header><span class="brand">der<span>die</span>das<span>die</span></span></header><section class="intro"><div class="eyebrow">PRACTICE</div><h1>Ten sentences. One good habit.</h1><p>Choose a topic to begin. Every topic is free.</p></section><section class="mode-list">'+['Mixed practice','Articles & endings','Viel & viele','Genitive','Verbs & prepositions','Review mistakes'].map(m=>'<button data-mode="'+m+'">'+m+' →</button>').join('')+'</section></main>';
 document.querySelectorAll('[data-mode]').forEach(b=>b.addEventListener('click',()=>start(b.dataset.mode)));
}
function summary(){
 const history=JSON.parse(localStorage.getItem('derdiedasdie-sessions')||'[]');history.push({date:new Date().toISOString(),mode,correct,total});localStorage.setItem('derdiedasdie-sessions',JSON.stringify(history.slice(-100)));
 root.innerHTML='<main><header><span class="brand">derdiedasdie</span></header><section class="intro"><div class="eyebrow">SESSION COMPLETE</div><h1>'+correct+' out of '+total+'</h1><p>'+ (correct===total?'Perfect round. Every answer correct.':correct>=8?'Strong round. Keep the momentum.':'Every mistake is a chance to learn. Try another round.') +'</p><button id="again">Another session</button><button id="back">Choose a topic</button></section></main>';
 document.getElementById('again').addEventListener('click',()=>start(mode));
 document.getElementById('back').addEventListener('click',home);
}
function render(){
 root.innerHTML=`<main><header><span class="brand">der<span>die</span>das<span>die</span></span><small>GERMAN PRACTICE · PROTOTYPE</small></header>
 <section class="intro"><div class="eyebrow">DAILY PRACTICE</div><h1>Complete the sentence.</h1><p>Everyday German. Choose what sounds right, then see why.</p></section>
 <section class="quiz"><div class="meta"><span>${mode} · ${position} / ${deck.length}</span><span>${correct} / ${total} correct</span></div>
 <div class="progress-track" role="progressbar" aria-label="Session progress" aria-valuemin="0" aria-valuemax="${deck.length}" aria-valuenow="${position-1}"><div class="progress-fill" style="width:${Math.round((position-1)/deck.length*100)}%"></div></div>
 <h2 lang="de">${question.before}<span class="blank">_____</span>${question.after}</h2>
 <div class="answers">${question.options.map((opt,i)=>`<button class="answer" data-i="${i}" lang="de">${opt}</button>`).join('')}</div>
 <div id="feedback" aria-live="polite"></div><button id="next" hidden>Next sentence →</button></section>
 <footer>Early prototype: sentence content awaits independent language review. No purchases enabled.</footer></main>`;
 document.querySelectorAll('.answer').forEach(btn=>btn.addEventListener('click',()=>{
 if(answered)return;answered=true;total++;const selected=question.options[Number(btn.dataset.i)];const ok=checkAnswer(question,selected);if(ok){correct++;mistakes.delete(question.id);}else mistakes.add(question.id);localStorage.setItem('derdiedasdie-mistakes',JSON.stringify([...mistakes]));
 document.querySelectorAll('.answer').forEach(b=>{b.disabled=true;const v=question.options[Number(b.dataset.i)];if(v===question.answer)b.classList.add('right');else if(b===btn)b.classList.add('wrong');});
 const specific=!ok&&question.wrongFeedback?.[selected];
 document.getElementById('feedback').textContent=(ok?'✓ Correct. Why? ':'Not quite. Correct answer: '+question.answer+'. Why? ')+(specific?specific+' ':'')+question.explanation;
 document.getElementById('next').hidden=false;
 }));
 document.getElementById('next').addEventListener('click',next);
}
if(!bank.length)throw new Error('No validated questions');
home();
