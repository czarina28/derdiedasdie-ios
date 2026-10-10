import {questionBank,isCorrect} from './grammar.js';
import './style.css';
const bank=questionBank();
const root=document.getElementById('app');
let remaining=[],question=null,answered=false,correct=0,total=0;
function next(){if(!remaining.length)remaining=[...bank].sort(()=>Math.random()-.5);question=remaining.pop();answered=false;render();}
function render(){root.innerHTML=`<main><header><span class="brand">der<span>die</span>das<span>die</span></span><small>GERMAN PRACTICE · EARLY PROTOTYPE</small></header><section class="intro"><div class="eyebrow">GRAMMAR LAB</div><h1>Get the details right.</h1><p>Every subject stays free. This first prototype tests declension-table questions; contextual sentence exercises come next.</p></section><section class="quiz"><div class="meta"><span>${question.table}</span><span>${correct} / ${total} correct</span></div><h2>${question.prompt}</h2><div class="answers">${question.options.map((opt,i)=>`<button class="answer" data-i="${i}">${opt}</button>`).join('')}</div><div id="feedback" aria-live="polite"></div><button id="next" hidden>Next question →</button></section><footer>Content and question wording are under review. No purchases are enabled.</footer></main>`;
 document.querySelectorAll('.answer').forEach(btn=>btn.addEventListener('click',()=>{if(answered)return;answered=true;total++;const selected=question.options[Number(btn.dataset.i)];const ok=isCorrect(question,selected);if(ok)correct++;document.querySelectorAll('.answer').forEach(b=>{b.disabled=true;const v=question.options[Number(b.dataset.i)];if(v===question.answer)b.classList.add('right');else if(b===btn)b.classList.add('wrong');});document.getElementById('feedback').textContent=(ok?'Correct. ':'Not quite. ')+question.explanation;document.getElementById('next').hidden=false;}));
 document.getElementById('next').addEventListener('click',next);
}
next();
