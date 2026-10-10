import {sentences,validateSentence,checkAnswer} from './sentences.js';
import {moreSentences} from './more-sentences.js';
import {vielSentences} from './viel-sentences.js';
import {genitiveSentences} from './genitive-sentences.js';
import './style.css';
const bank=[...sentences,...moreSentences,...vielSentences,...genitiveSentences].filter(validateSentence);
const root=document.getElementById('app');
let deck=[],question=null,answered=false,correct=0,total=0;
function shuffle(items){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function next(){if(!deck.length)deck=shuffle(bank);question={...deck.pop()};question.options=shuffle(question.options);answered=false;render();}
function render(){
 root.innerHTML=`<main><header><span class="brand">der<span>die</span>das<span>die</span></span><small>GERMAN PRACTICE · PROTOTYPE</small></header>
 <section class="intro"><div class="eyebrow">DAILY PRACTICE</div><h1>Complete the sentence.</h1><p>Everyday German. Choose what sounds right, then see why.</p></section>
 <section class="quiz"><div class="meta"><span>Articles & endings</span><span>${correct} / ${total} correct</span></div>
 <h2 lang="de">${question.before}<span class="blank">_____</span>${question.after}</h2>
 <div class="answers">${question.options.map((opt,i)=>`<button class="answer" data-i="${i}" lang="de">${opt}</button>`).join('')}</div>
 <div id="feedback" aria-live="polite"></div><button id="next" hidden>Next sentence →</button></section>
 <footer>Early prototype: sentence content awaits independent language review. No purchases enabled.</footer></main>`;
 document.querySelectorAll('.answer').forEach(btn=>btn.addEventListener('click',()=>{
 if(answered)return;answered=true;total++;const selected=question.options[Number(btn.dataset.i)];const ok=checkAnswer(question,selected);if(ok)correct++;
 document.querySelectorAll('.answer').forEach(b=>{b.disabled=true;const v=question.options[Number(b.dataset.i)];if(v===question.answer)b.classList.add('right');else if(b===btn)b.classList.add('wrong');});
 document.getElementById('feedback').textContent=(ok?'Correct. ':'Not quite. ')+question.explanation;
 document.getElementById('next').hidden=false;
 }));
 document.getElementById('next').addEventListener('click',next);
}
if(!bank.length)throw new Error('No validated questions');
next();
