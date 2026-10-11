import {LEARNING_KEY,recordAttempt,pickFixQuestions,learningSummary,skillProfile,skillFor,sessionFeedback} from './learning.js';
import {weakSpots,practicePlan} from './premium-plan.js';
import {MASTERY_KEY,recordSkillSession,masteryProfile} from './mastery.js';
import {TOPIC_LABELS} from './curriculum.js';
import {checkAnswer} from './sentences.js';
import {buildCatalog} from './catalog.js';
import {pickFreshQuestions,pickProgressiveQuestions,practiceStage,shuffle} from './session.js';
import './style.css';
const bank=buildCatalog();
const root=document.getElementById('app');
let learning={};
try{const saved=JSON.parse(localStorage.getItem(LEARNING_KEY)||'{}');if(saved&&typeof saved==='object'&&!Array.isArray(saved))learning=saved;}catch{learning={};}
let masteryLog=[];
try{const saved=JSON.parse(localStorage.getItem(MASTERY_KEY)||'[]');if(Array.isArray(saved))masteryLog=saved;}catch{}
let planSkill=null;
let deck=[],question=null,answered=false,correct=0,total=0,position=0,mode='Mixed practice',mistakes=new Set(),reviewStartingCount=0,sessionAnswers=[];
try{const saved=JSON.parse(localStorage.getItem('derdiedasdie-mistakes')||'[]');mistakes=new Set(saved.map(id=>typeof id==='number'?bank.find(q=>q.legacyId===id)?.id:id).filter(Boolean));localStorage.setItem('derdiedasdie-mistakes',JSON.stringify([...mistakes]));}catch{mistakes=new Set();}

function start(topic){planSkill=null;mode=topic;const pool=topic==='Review mistakes'?bank.filter(q=>mistakes.has(q.id)):bank;const recent=JSON.parse(localStorage.getItem('derdiedasdie-recent')||'[]').map(id=>typeof id==='number'?bank.find(q=>q.legacyId===id)?.id:id).filter(Boolean);const history=JSON.parse(localStorage.getItem('derdiedasdie-sessions')||'[]');reviewStartingCount=topic==='Review mistakes'?pool.length:0;deck=topic==='Fix My German'?pickFixQuestions(bank,learning,recent,[...mistakes]):topic==='Review mistakes'?shuffle(pool):topic==='Mixed practice'?pickProgressiveQuestions(pool,topic,recent,practiceStage(history)):pickFreshQuestions(pool,topic,recent);position=0;correct=0;total=0;sessionAnswers=[];if(deck.length)next();else if(topic==='Review mistakes')emptyReview();else home();}
function startSkill(skill){
 const pool=bank.filter(q=>skillFor(q)===skill);
 if(!pool.length)return;
 const recent=JSON.parse(localStorage.getItem('derdiedasdie-recent')||'[]');
 planSkill=skill;mode='Plus: '+skill;
 deck=pickFreshQuestions(pool,'Mixed practice',recent);
 position=0;correct=0;total=0;sessionAnswers=[];
 if(deck.length)next();
}
function next(){if(position>=deck.length){summary();return;}question={...deck[position++]};const recent=JSON.parse(localStorage.getItem('derdiedasdie-recent')||'[]').map(id=>typeof id==='number'?bank.find(q=>q.legacyId===id)?.id:id).filter(Boolean);recent.push(question.id);localStorage.setItem('derdiedasdie-recent',JSON.stringify(recent.slice(-Math.min(80,bank.length-10))));question.options=shuffle(question.options);answered=false;render();}
function premiumPreview(){
 const spots=weakSpots(bank,learning);
 const plan=practicePlan(bank,learning);
 const masterySkills=[...new Set(masteryLog.map(s=>s.skill))].map(skill=>({skill,...masteryProfile(masteryLog,skill)}));
 root.innerHTML=`<main class="premium-preview"><header><button class="home-exit" id="back-home">← Home</button><img class="brand-logo" src="${import.meta.env.BASE_URL}logo.svg" alt="derdiedasdie"></header><section class="home-hero"><div class="eyebrow">PLUS · COMING SOON</div><h1>Make progress <em>you can see.</em></h1><p>Fix My German adapts one practice session. Plus is being developed to guide your improvement over multiple sessions. Here is what your current practice data can tell us.</p></section><section class="skill-section"><h2>My Weak Spots</h2>${spots.length?`<div class="skill-list">${spots.map(s=>`<div class="skill-row"><strong>${s.name}</strong><span>${s.accuracy}% accuracy · ${s.unresolved} unresolved</span></div>`).join('')}</div>`:'<p>Complete some practice sessions to discover your weak spots.</p>'}</section><section class="skill-section"><h2>Mastery progress · 100% goal</h2>${masterySkills.length?`<div class="skill-list">${masterySkills.map(s=>`<div class="skill-row"><strong>${s.skill} · ${s.status}</strong><span>${s.accuracy}% overall · ${s.perfectDays}/3 perfect days · ${s.questions}/6 varied questions</span></div>`).join("")}</div>`:"<p>Finish a practice session to start tracking mastery across days.</p>"}</section><section class="skill-section"><h2>Suggested focus order</h2>${plan.length?`<div class="skill-list">${plan.map(p=>`<div class="skill-row"><strong>Priority ${p.day}: ${p.skill}</strong><span>${p.unresolved?`${p.unresolved} errors to revisit`:'Reinforce previous mistakes'}</span></div>`).join('')}</div>`:'<p>Your personalized plan will appear after you make some practice attempts.</p>'}</section><p class="preview-note">This is an early preview based on your cumulative answers, not yet a multi-session improvement tracker. Purchases are not enabled. All existing grammar practice remains free.</p><button class="hero-start" id="return-practice">Continue free practice →</button></main>`;
 document.getElementById('back-home').addEventListener('click',home);
 document.getElementById('return-practice').addEventListener('click',()=>start('Mixed practice'));
}
function home(){
 const sessions=JSON.parse(localStorage.getItem('derdiedasdie-sessions')||'[]');
 const completed=sessions.length;
 const progress=learningSummary(learning);
 const skills=skillProfile(bank,learning).slice(0,3);
 const unresolved=bank.filter(q=>{const h=learning[q.id];return h&&h.misses>0&&h.streak<2;}).length;
 const details={'Cases & articles':'Articles · genitive · dative plural','Adjective endings':'Strong · weak · mixed','Prepositions':'Verb + preposition','Pronouns & determiners':'Quantifiers · relative pronouns','Verb forms & tenses':'Conjugation · auxiliaries','Word order':'Verb position · clauses','Sentence connections':'weil · obwohl · deshalb','Advanced constructions':'Konjunktiv · passive'};
 const topics=TOPIC_LABELS.map(name=>[name,details[name],bank.filter(q=>q.topic===name).length]);

 root.innerHTML=`<main class="home-screen"><header><img class="brand-logo" src="${import.meta.env.BASE_URL}logo.svg" alt="derdiedasdie" width="162" height="48"><span class="header-note">GERMAN GRAMMAR PRACTICE</span></header>
 <section class="home-hero"><h1>You know better.<br><em>Now do better.</em></h1><p>You know the rules. Now make them automatic. Ten focused German grammar questions at a time.</p><button class="hero-start" data-mode="Mixed practice"><span>Practice <small>10 questions · all topics</small></span><span aria-hidden="true">↗</span></button></section>
 <section class="fix-feature" aria-label="Personalized practice"><button class="hero-start" data-mode="Fix My German"><span>Fix My German <small>${progress.attempts?"Target recurring mistakes · 10 questions":"Adapts to your answers as you practice · 10 questions"}</small></span><span aria-hidden="true">↗</span></button></section>
 <section class="premium-teaser"><span class="eyebrow">COMING SOON · PLUS</span><h2>Build lasting progress</h2><p>Plus organizes your weak areas into a long-term plan so you can see what improves.</p><button class="premium-preview-button" id="show-premium">Explore Plus →</button></section>
 <section class="home-stats" aria-label="Your progress"><div><strong>${completed}</strong><span>Rounds completed</span></div><div><strong>${bank.length}</strong><span>Practice questions</span></div><div><strong>${mistakes.size}</strong><span>Mistakes to revisit</span></div></section>
 <section class="skill-section" aria-label="Your grammar patterns"><div class="section-heading"><h2>Your grammar patterns</h2><span>PERSONAL TO YOU</span></div>${skills.length?`<div class="skill-list">${skills.map(s=>`<div class="skill-row"><strong>${s.name}</strong><span>${s.status} · ${s.questions} question${s.questions===1?"":"s"} tried</span></div>`).join("")}</div>`:`<p>Start practicing to discover which grammar patterns need attention. We’ll look for patterns across different questions.</p>`}</section>
 <section class="topic-section"><div class="section-heading"><h2>Choose your focus</h2><span>8 TOPICS</span></div><div class="topic-list">${topics.map(([name,detail,count],i)=>`<button ${count?`data-mode="${name}"`:"disabled"}><span class="topic-index">${String(i+1).padStart(2,'0')}</span><span class="topic-copy"><strong>${name}</strong><small>${count?detail+` · ${count} questions`:"Coming soon"}</small></span><span class="topic-arrow" aria-hidden="true">↗</span></button>`).join('')}</div></section>
 <button class="review-link" data-mode="Review mistakes"><span>↺ &nbsp; Practice what you missed <strong>(${mistakes.size})</strong></span></button>
 <footer>Know it. Do it. Own it. Every topic is free.</footer></main>`;
 document.getElementById('show-premium').addEventListener('click',premiumPreview);
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
 masteryLog=recordSkillSession(masteryLog,sessionAnswers);localStorage.setItem(MASTERY_KEY,JSON.stringify(masteryLog));
 const feedback=sessionFeedback(sessionAnswers);
 const focusText=feedback.focus.length?'Focus next: '+feedback.focus.slice(0,2).map(s=>s.name).join(' · ')+'.':'No mistakes this round. Keep practicing across different days to build consistency.';
 const strengthText=feedback.strengths.length?'Strong this round: '+feedback.strengths.slice(0,2).map(s=>s.name).join(' · ')+'.':'';
 root.innerHTML='<main><header><img class="brand-logo" src="'+import.meta.env.BASE_URL+'logo.svg" alt="derdiedasdie" width="162" height="48"></header><section class="intro session-summary"><div class="eyebrow">SESSION COMPLETE</div><h1>'+correct+' out of '+total+'</h1><p>'+ (correct===total?'Perfect round. Every answer correct.':correct>=8?'Strong round. Keep the momentum.':'Every mistake is a chance to learn. Try another round.') +'</p><div class="session-insights"><h2>Your grammar this round</h2><p>'+focusText+'</p>'+(strengthText?'<p>'+strengthText+'</p>':'')+'</div><button id="again">Another session</button><button id="back">Choose a topic</button></section></main>';
 document.getElementById('again').addEventListener('click',()=>start(mode));
 document.getElementById('back').addEventListener('click',home);
}
function render(){
 root.innerHTML=`<main><header class="practice-header"><button class="home-exit" id="exit" aria-label="Leave practice and return home">← <span>Home</span></button><img class="brand-logo" src="${import.meta.env.BASE_URL}logo.svg" alt="derdiedasdie" width="162" height="48"></header>
 <section class="intro quiz-intro"><div class="eyebrow">DAILY PRACTICE</div><h1>Complete the sentence.</h1><p>Choose an answer, then learn why it works.</p></section>
 <section class="quiz"><div class="meta"><span>${mode} · Question ${position} of ${deck.length}${mode==='Review mistakes'?' · '+mistakes.size+' still to review':''}</span><span>${correct} / ${total} correct</span></div>
 <div class="progress-track" role="progressbar" aria-label="Session progress" aria-valuemin="0" aria-valuemax="${deck.length}" aria-valuenow="${position-1}"><div class="progress-fill" style="width:${Math.round((position-1)/deck.length*100)}%"></div></div>
 <h2 lang="de">${question.before}<span class="blank">_____</span>${question.after}</h2>
 <div class="answers" role="group" aria-label="Answer choices">${question.options.map((opt,i)=>`<button class="answer" data-i="${i}" lang="de">${opt}</button>`).join('')}</div>
 <div id="feedback" aria-live="polite"></div><button id="next" hidden>${position===deck.length?'See results →':'Next sentence →'}</button></section>
 <footer>Early prototype: sentence content awaits independent language review. No purchases enabled.</footer></main>`;
 document.querySelectorAll('.answer').forEach(btn=>btn.addEventListener('click',()=>{
 if(answered)return;answered=true;total++;const selected=question.options[Number(btn.dataset.i)];const ok=checkAnswer(question,selected);if(ok){correct++;mistakes.delete(question.id);}else mistakes.add(question.id);sessionAnswers.push({id:question.id,skill:skillFor(question),correct:ok});learning=recordAttempt(learning,question.id,ok);localStorage.setItem(LEARNING_KEY,JSON.stringify(learning));localStorage.setItem('derdiedasdie-mistakes',JSON.stringify([...mistakes]));
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
