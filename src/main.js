import {sentences,validateSentence,checkAnswer} from './sentences.js';
import {moreSentences} from './more-sentences.js';
import {vielSentences} from './viel-sentences.js';
import {genitiveSentences} from './genitive-sentences.js';
import {pickFreshQuestions,shuffle} from './session.js';
import './style.css';
const bank=[...sentences,...moreSentences,...vielSentences,...genitiveSentences].filter(validateSentence).map((q,i)=>({...q,id:i,topic:i<sentences.length+moreSentences.length?'Articles & endings':i<sentences.length+moreSentences.length+vielSentences.length?'Viel & viele':'Genitive'}));
const root=document.getElementById('app');
let deck=[],question=null,answered=false,correct=0,total=0,position=0,mode='Mixed practice',mistakes=new Set();
try{mistakes=new Set(JSON.parse(localStorage.getItem('derdiedasdie-mistakes')||'[]'));}catch{mistakes=new Set();}

function start(topic){mode=topic;const pool=topic==='Review mistakes'?bank.filter(q=>mistakes.has(q.id)):bank;const recent=JSON.parse(localStorage.getItem('derdiedasdie-recent')||'[]');deck=pickFreshQuestions(pool,topic==='Review mistakes'?'Mixed practice':topic,recent);position=0;correct=0;total=0;if(deck.length)next();else home();}
function next(){if(position>=deck.length){summary();return;}question={...deck[position++]};const recent=JSON.parse(localStorage.getItem('derdiedasdie-recent')||'[]');recent.push(question.id);localStorage.setItem('derdiedasdie-recent',JSON.stringify(recent.slice(-Math.min(80,bank.length-10))));question.options=shuffle(question.options);answered=false;render();}
function home(){
 root.innerHTML='<main><header><span class="brand">der<span>die</span>das<span>die</span></span></header><section class="intro"><div class="eyebrow">PRACTICE</div><h1>Ten sentences. One good habit.</h1><p>Choose a topic to begin.</p></section><section class="mode-list">'+['Mixed practice','Articles & endings','Viel & viele','Genitive','Review mistakes'].map(m=>'<button data-mode="'+m+'">'+m+' →</button>').join('')+'</section></main>';
 document.querySelectorAll('[data-mode]').forEach(b=>b.addEventListener('click',()=>start(b.dataset.mode)));
}
function summary(){
 const history=JSON.parse(localStorage.getItem('derdiedasdie-sessions')||'[]');history.push({date:new Date().toISOString(),mode,correct,total});localStorage.setItem('derdiedasdie-sessions',JSON.stringify(history.slice(-100)));
 root.innerHTML='<main><header><span class="brand">derdiedasdie</span></header><section class="intro"><div class="eyebrow">SESSION COMPLETE</div><h1>'+correct+' out of '+total+'</h1><p>Good practice. Ready for another round?</p><button id="again">Another session</button><button id="back">Choose a topic</button></section></main>';
 document.getElementById('again').addEventListener('click',()=>start(mode));
 document.getElementById('back').addEventListener('click',home);
}
function render(){
 root.innerHTML=`<main><header><span class="brand">der<span>die</span>das<span>die</span></span><small>GERMAN PRACTICE · PROTOTYPE</small></header>
 <section class="intro"><div class="eyebrow">DAILY PRACTICE</div><h1>Complete the sentence.</h1><p>Everyday German. Choose what sounds right, then see why.</p></section>
 <section class="quiz"><div class="meta"><span>${mode} · ${position} / ${deck.length}</span><span>${correct} / ${total} correct</span></div>
 <h2 lang="de">${question.before}<span class="blank">_____</span>${question.after}</h2>
 <div class="answers">${question.options.map((opt,i)=>`<button class="answer" data-i="${i}" lang="de">${opt}</button>`).join('')}</div>
 <div id="feedback" aria-live="polite"></div><button id="next" hidden>Next sentence →</button></section>
 <footer>Early prototype: sentence content awaits independent language review. No purchases enabled.</footer></main>`;
 document.querySelectorAll('.answer').forEach(btn=>btn.addEventListener('click',()=>{
 if(answered)return;answered=true;total++;const selected=question.options[Number(btn.dataset.i)];const ok=checkAnswer(question,selected);if(ok){correct++;mistakes.delete(question.id);}else mistakes.add(question.id);localStorage.setItem('derdiedasdie-mistakes',JSON.stringify([...mistakes]));
 document.querySelectorAll('.answer').forEach(b=>{b.disabled=true;const v=question.options[Number(b.dataset.i)];if(v===question.answer)b.classList.add('right');else if(b===btn)b.classList.add('wrong');});
 document.getElementById('feedback').textContent=(ok?'✓ Correct. Why? ':'Not quite. Correct answer: '+question.answer+'. Why? ')+question.explanation;
 document.getElementById('next').hidden=false;
 }));
 document.getElementById('next').addEventListener('click',next);
}
if(!bank.length)throw new Error('No validated questions');
home();
