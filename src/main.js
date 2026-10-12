import {LEARNING_KEY,recordAttempt,pickFixQuestions,learningSummary,skillProfile,skillFor,sessionFeedback} from './learning.js';
import {weakSpots,practicePlan,targetedQuestions} from './premium-plan.js';
import {MASTERY_KEY,recordSkillSession,masteryProfile} from './mastery.js';
import {progressTrend,progressChange,masteryOverview} from './progress-insights.js';
import {plusProduct,PLUS_PRODUCT_ID} from './plus-store.js';
import {verifiedPlusEntitlement,buyVerifiedPlus,restoreVerifiedPlus} from './plus-entitlement.js';
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
let plusOwned=false;
let plusPreviewMode=false; // Session-only UI preview; never a purchase entitlement.
let planSkill=null;
let deck=[],question=null,answered=false,correct=0,total=0,position=0,mode='Mixed practice',mistakes=new Set(),reviewStartingCount=0,sessionAnswers=[];
try{const saved=JSON.parse(localStorage.getItem('derdiedasdie-mistakes')||'[]');mistakes=new Set(saved.map(id=>typeof id==='number'?bank.find(q=>q.legacyId===id)?.id:id).filter(Boolean));localStorage.setItem('derdiedasdie-mistakes',JSON.stringify([...mistakes]));}catch{mistakes=new Set();}

function start(topic){planSkill=null;mode=topic;const pool=topic==='Review mistakes'?bank.filter(q=>mistakes.has(q.id)):bank;const recent=JSON.parse(localStorage.getItem('derdiedasdie-recent')||'[]').map(id=>typeof id==='number'?bank.find(q=>q.legacyId===id)?.id:id).filter(Boolean);const history=JSON.parse(localStorage.getItem('derdiedasdie-sessions')||'[]');reviewStartingCount=topic==='Review mistakes'?pool.length:0;deck=topic==='Fix My German'?pickFixQuestions(bank,learning,recent,[...mistakes]):topic==='Review mistakes'?shuffle(pool):topic==='Mixed practice'?pickProgressiveQuestions(pool,topic,recent,practiceStage(history)):pickFreshQuestions(pool,topic,recent);position=0;correct=0;total=0;sessionAnswers=[];if(deck.length)next();else if(topic==='Review mistakes')emptyReview();else home();}
function startSkill(skill,source='Plus'){
 const pool=bank.filter(q=>skillFor(q)===skill);
 if(!pool.length)return;
 const recent=JSON.parse(localStorage.getItem('derdiedasdie-recent')||'[]');
 planSkill=skill;mode=source+': '+skill;
 deck=targetedQuestions(pool,learning,skill,recent);
 position=0;correct=0;total=0;sessionAnswers=[];
 if(deck.length)next();
}
function next(){if(position>=deck.length){summary();return;}question={...deck[position++]};const recent=JSON.parse(localStorage.getItem('derdiedasdie-recent')||'[]').map(id=>typeof id==='number'?bank.find(q=>q.legacyId===id)?.id:id).filter(Boolean);recent.push(question.id);localStorage.setItem('derdiedasdie-recent',JSON.stringify(recent.slice(-Math.min(80,bank.length-10))));question.options=shuffle(question.options);answered=false;render();}
async function refreshPlusOwnership(){
 try{plusOwned=(await verifiedPlusEntitlement()).active===true;}catch{plusOwned=false;}
 return plusOwned;
}
function plusPurchaseScreen(){
 plusPreviewMode=false;
 root.innerHTML=`<main class="plus-checkout"><header><button class="home-exit" id="back-plus">← Plus</button><img class="brand-logo" src="${import.meta.env.BASE_URL}logo.svg" alt="derdiedasdie"></header><section class="home-hero"><div class="eyebrow">DERDIEDASDIE PLUS</div><h1>Know what you've mastered. <em>Know what's next.</em></h1><p>Track your grammar mastery, see how you're improving, and discover what to focus on next.</p></section><section class="plus-offer"><h2>What's included</h2><ul><li>Personal practice plan for your weak spots</li><li>Long-term progress for each grammar skill</li><li>Mastery tracking across multiple days</li><li>Clear priorities for what to practice next</li></ul><div class="plus-price"><strong id="plus-displayed-price">Checking price…</strong><span>One-time purchase · No subscription</span></div></section><button class="hero-start" id="buy-plus" disabled>Checking PLUS…</button><button class="plus-restore" id="restore-plus">Restore Purchases</button><p class="preview-note" id="store-status" role="status">Checking Apple StoreKit…</p></main>`;
 const status=document.getElementById('store-status'),buy=document.getElementById('buy-plus'),restore=document.getElementById('restore-plus');
 const showOwned=()=>{buy.disabled=true;buy.textContent='PLUS unlocked ✓';status.textContent='Apple verified your PLUS purchase on this device.';};
 Promise.all([plusProduct(),refreshPlusOwnership()]).then(([product,owned])=>{
  if(!status.isConnected)return;
  if(owned){showOwned();return;}
  if(!product){status.textContent='PLUS product not available from Apple.';buy.textContent='PLUS unavailable';document.getElementById('plus-displayed-price').textContent='Price unavailable';return;}
  const applePrice=product.priceString;
  if(!applePrice){status.textContent='Apple did not provide a localized price.';buy.textContent='PLUS unavailable';return;}
  document.getElementById('plus-displayed-price').textContent=applePrice;
  buy.disabled=false;buy.textContent='Unlock PLUS · '+applePrice;
  status.textContent='One-time purchase. All grammar practice remains free.';
 }).catch(e=>{if(status.isConnected){status.textContent='Store unavailable: '+(e?.message||'Unknown error');buy.textContent='PLUS unavailable';}});
 buy.addEventListener('click',async()=>{
  buy.disabled=true;restore.disabled=true;status.textContent='Contacting Apple…';
  try{
   const result=await buyVerifiedPlus();
   if(result.active){plusOwned=true;showOwned();}
   else{status.textContent=result.cancelled?'Purchase cancelled.':result.pending?'Purchase pending Apple approval.':'Purchase not completed.';buy.disabled=false;}
  }catch(e){status.textContent='Purchase failed: '+(e?.message||'Unknown error');buy.disabled=false;}
  finally{restore.disabled=false;}
 });
 restore.addEventListener('click',async()=>{
  restore.disabled=true;buy.disabled=true;status.textContent='Restoring purchases with Apple…';
  try{
   const result=await restoreVerifiedPlus();
   plusOwned=result.active;
   if(plusOwned)showOwned();
   else{status.textContent='No verified PLUS purchase found for this Apple account.';buy.disabled=false;}
  }catch(e){status.textContent='Restore failed: '+(e?.message||'Unknown error');buy.disabled=false;}
  finally{restore.disabled=false;}
 });
 document.getElementById('back-plus').addEventListener('click',premiumPreview);
}
function premiumPreview(){
 if(!plusPreviewMode){
  root.innerHTML=`<main class="premium-preview"><header><button class="home-exit" id="back-home">← Progress</button></header><section class="home-hero"><div class="eyebrow">DERDIEDASDIE PLUS</div><h1>Know what you've mastered. <em>Know what's next.</em></h1><p>Track your grammar mastery, see how you're improving, and discover what to focus on next.</p></section><section class="plus-offer"><h2>Plus Progress</h2><ul><li>Mastery across multiple days</li><li>Personalized progress plan</li><li>Weak spots and improvement priorities</li></ul></section><button class="hero-start" id="preview-progress">Preview PLUS →</button><button class="premium-preview-button" id="show-plus-offer">Purchase information →</button><p class="preview-note">Preview only. No purchase or entitlement is granted.</p></main>`;
  document.getElementById('back-home').addEventListener('click',home);
  document.getElementById('preview-progress').addEventListener('click',()=>{plusPreviewMode=true;premiumPreview();});
  document.getElementById('show-plus-offer').addEventListener('click',plusPurchaseScreen);
  return;
 }
 const spots=weakSpots(bank,learning);
 const plan=practicePlan(bank,learning);
 const mastery=masteryOverview(masteryLog,masteryProfile);
 const masterySkills=mastery.profiles;
 let pastSessions=[];try{pastSessions=JSON.parse(localStorage.getItem('derdiedasdie-sessions')||'[]');}catch{}
 const trend=progressTrend(pastSessions),change=progressChange(pastSessions);
 const trendSection='<section class="skill-section"><h2>Progress over time</h2>'+(trend.length?'<p>'+trend.length+' recent rounds · '+(change===null?'Complete another round to see your trend.':(change>0?'+':'')+change+' percentage points vs earlier rounds')+'</p><div class="plus-trend" aria-label="Accuracy in recent rounds">'+trend.map((p,i)=>'<div class="plus-trend-col"><div class="plus-trend-bar" style="height:'+Math.max(4,p.accuracy)+'%" title="Round '+(i+1)+': '+p.accuracy+'%"></div><small>'+p.accuracy+'%</small></div>').join('')+'</div>':'<p>Complete a round to start tracking your progress.</p>')+'</section>';

 root.innerHTML=`<main class="premium-preview"><header><button class="home-exit" id="back-home">← Home</button><img class="brand-logo" src="${import.meta.env.BASE_URL}logo.svg" alt="derdiedasdie"></header><section class="home-hero"><div class="eyebrow">${plusOwned?"PLUS · UNLOCKED":"PLUS · PREVIEW"}</div><h1>Know what you've mastered. <em>Know what's next.</em></h1><p>Track your grammar mastery, see how you're improving, and discover what to focus on next.</p></section><button class="hero-start" id="work-plan" ${plan.length&&plusOwned?"":"disabled"}>${plusOwned?"Work my plan →":"Preview of your PLUS plan"}</button>${trendSection}<section class="skill-section"><h2>My Weak Spots</h2>${spots.length?`<div class="skill-list">${spots.map(s=>`<button class="skill-row plan-skill" data-skill="${s.name}"><strong>${s.name}</strong><span>${s.accuracy}% accuracy · ${s.unresolved} unresolved ↗</span></button>`).join('')}</div>`:'<p>Complete some practice sessions to discover your weak spots.</p>'}</section><section class="skill-section"><h2>Mastery progress · 100% goal</h2>${masterySkills.length?`<div class="skill-list">${masterySkills.map(s=>`<button class="skill-row plan-skill" data-skill="${s.skill}"><strong>${s.skill} · ${s.status}</strong><span>${s.accuracy}% overall · ${s.perfectDays}/3 perfect days · ${s.questions}/6 proven ability ↗</span></button>`).join("")}</div>`:"<p>Finish a practice session to start tracking mastery across days.</p>"}</section><section class="skill-section"><h2>Suggested focus order</h2>${plan.length?`<div class="skill-list">${plan.map(p=>`<button class="skill-row plan-skill" data-skill="${p.skill}"><strong>Priority ${p.day}: ${p.skill}</strong><span>${p.unresolved?`${p.unresolved} errors to revisit`:'Reinforce previous mistakes'} ↗</span></button>`).join('')}</div>`:'<p>Your personalized plan will appear after you make some practice attempts.</p>'}</section><button class="premium-preview-button" id="show-plus-offer">${plusOwned?"Purchase details →":"Unlock PLUS →"}</button><p class="preview-note">${plusOwned?"Your PLUS ownership is verified by Apple.":"PLUS insights shown as a preview. All grammar practice remains free."}</p><button class="hero-start" id="return-practice">Continue free practice →</button></main>`;
 document.getElementById('show-plus-offer').addEventListener('click',plusPurchaseScreen);
 document.getElementById('work-plan').addEventListener('click',()=>{if(plusOwned&&plan.length)startSkill(plan[0].skill);});
 document.querySelectorAll('.plan-skill').forEach(b=>{b.disabled=!plusOwned;b.addEventListener('click',()=>{if(plusOwned)startSkill(b.dataset.skill);});});
 document.getElementById('back-home').addEventListener('click',()=>{plusPreviewMode=false;home();});
 document.getElementById('return-practice').addEventListener('click',()=>start('Mixed practice'));
}
function home(){
 plusPreviewMode=false;
 const sessions=JSON.parse(localStorage.getItem('derdiedasdie-sessions')||'[]');
 const completed=sessions.length;
 const nativeHome=window.Capacitor?.isNativePlatform?.()===true;
 const progress=learningSummary(learning);
 const skills=skillProfile(bank,learning).slice(0,3);
 const unresolved=bank.filter(q=>{const h=learning[q.id];return h&&h.misses>0&&h.streak<2;}).length;
 const details={'Cases & articles':'Articles · genitive · dative plural','Adjective endings':'Strong · weak · mixed','Prepositions':'Verb + preposition','Pronouns & determiners':'Quantifiers · relative pronouns','Verb forms & tenses':'Conjugation · auxiliaries','Word order':'Verb position · clauses','Sentence connections':'weil · obwohl · deshalb','Advanced constructions':'Konjunktiv · passive'};
 const topics=TOPIC_LABELS.map(name=>[name,details[name],bank.filter(q=>q.topic===name).length]);

 if(nativeHome){nativeDashboard(sessions,topics,skills);return;}
 root.innerHTML=`<main class="home-screen ${nativeHome?"native-home":""}"><header><img class="brand-logo" src="${import.meta.env.BASE_URL}logo.svg" alt="derdiedasdie" width="162" height="48"></header>
 <section class="home-hero"><div class="native-welcome">YOUR DAILY GERMAN PRACTICE</div><h1>You know better.<br><em>Now do better.</em></h1><p>You know the rules. Now make them automatic.</p><button class="hero-start" data-mode="Mixed practice"><span>Practice <small>10 questions · all topics</small></span><span aria-hidden="true">→</span></button></section>
 <section class="fix-feature" aria-label="Personalized practice"><button class="hero-start" data-mode="Fix My German"><span>Target Weak Spots <small>${progress.attempts?"Target recurring mistakes · 10 questions":"Adapts as you practice · 10 questions"}</small></span><span aria-hidden="true">→</span></button></section>
 <button class="review-link" data-mode="Review mistakes"><span>Review Mistakes <small>${mistakes.size} saved question${mistakes.size===1?"":"s"} to revisit</small></span><span aria-hidden="true">→</span></button>
 <section class="home-stats" aria-label="Your progress"><div><strong>${completed}</strong><span>Rounds completed</span></div><div><strong>${bank.length}</strong><span>Practice questions</span></div><div><strong>${mistakes.size}</strong><span>Mistakes to revisit</span></div></section>
 <section class="skill-section" aria-label="Your grammar patterns"><div class="section-heading"><h2>Your grammar patterns</h2><span>PERSONAL TO YOU</span></div>${skills.length?`<div class="skill-list">${skills.map(s=>`<button type="button" class="skill-row pattern-skill" data-skill="${s.name}"><strong>${s.name}</strong><span>${s.status} · ${s.questions} question${s.questions===1?"":"s"} tried ↗</span></button>`).join("")}</div>`:`<p>Practice a round to discover your grammar patterns.</p>`}</section>
 <section class="topic-section"><div class="section-heading"><h2>Choose your focus</h2><span>8 TOPICS</span></div><div class="topic-list">${topics.map(([name,detail,count],i)=>`<button ${count?`data-mode="${name}"`:"disabled"}><span class="topic-index">${String(i+1).padStart(2,'0')}</span><span class="topic-copy"><strong>${name}</strong><small>${count?detail+` · ${count} questions`:"Coming soon"}</small></span><span class="topic-arrow" aria-hidden="true">↗</span></button>`).join('')}</div></section>
 <section class="premium-teaser"><span class="eyebrow">COMING SOON · PLUS</span><h2>Progress your way</h2><p>Track your grammar mastery, see how you're improving, and discover what to focus on next. €4.99 one time.</p><button class="premium-preview-button" id="show-premium">Explore Plus →</button></section>
 <footer>Know it. Do it. Own it. Every topic is free.</footer></main>`;
 document.getElementById('show-premium').addEventListener('click',premiumPreview);
 document.querySelectorAll('.pattern-skill').forEach(b=>b.addEventListener('click',()=>startSkill(b.dataset.skill,'Focused')));
 document.querySelectorAll('[data-mode]').forEach(b=>b.addEventListener('click',()=>start(b.dataset.mode)));
}

function nativeDashboard(sessions,topics,skills,tab='home'){
 const last=sessions.at(-1);
 const score=last&&last.total?Math.round(last.correct/last.total*100):0;
 const nav='<nav class="app-tabs" aria-label="App navigation"><button data-tab="home" class="'+(tab==='home'?'selected':'')+'"><span aria-hidden="true">⌂</span>Home</button><button data-tab="practice" class="'+(tab==='practice'?'selected':'')+'"><span aria-hidden="true">▤</span>Practice</button><button data-tab="progress" class="'+(tab==='progress'?'selected':'')+'"><span aria-hidden="true">▥</span>Progress</button></nav>';
 const topicCards=topics.map(([name,detail,count])=>'<button class="app-topic" '+(count?'data-mode="'+name+'"':'disabled')+'><span><strong>'+name+'</strong><small>'+detail+'</small></span></button>').join('');
 const homeBody='<div class="app-greeting"><h1>Bereit für Deutsch?</h1><p>A little practice goes a long way.</p></div><section class="app-progress-card"><div class="app-card-head"><strong>Your progress</strong><span>Last session</span></div>'+(last?'<div class="app-score"><strong>'+last.correct+'/'+last.total+'</strong><span>correct answers</span></div><div class="app-meter"><span style="width:'+score+'%"></span></div>':'<p>Your first session is waiting.</p>')+'</section><button class="app-primary" data-mode="Mixed practice"><strong>Start Practice</strong><small>10 questions · About 3 minutes</small></button><div class="app-shortcuts"><button data-mode="Review mistakes"><span class="app-shortcut-icon" aria-hidden="true">↶</span><strong>Review Mistakes</strong><small>'+mistakes.size+' saved questions</small></button><button data-tab="practice"><span class="app-shortcut-icon" aria-hidden="true">◎</span><strong>Choose Topic</strong><small>Focused practice</small></button></div><button class="app-plus-nudge" id="home-plus"><span><strong>✦ Unlock PLUS</strong><small>Know what you&#39;ve mastered. Know what&#39;s next.</small></span><span aria-hidden="true">›</span></button><button class="app-weak" data-mode="Fix My German"><span><strong>Target Weak Spots</strong><small>Personalized practice based on your answers</small></span><span aria-hidden="true">›</span></button>';
 const practiceBody='<div class="app-page-title"><h1>Practice</h1><p>Choose how you want to learn today.</p></div><button class="app-primary" data-mode="Mixed practice"><strong>Mixed Practice</strong><small>10 questions · All topics</small></button><button class="app-weak" data-mode="Fix My German"><span><strong>Target Weak Spots</strong><small>Practice what needs attention</small></span><span aria-hidden="true">›</span></button><h2 class="app-subtitle">Grammar topics</h2><div class="app-topics">'+topicCards+'</div>';
 const progressBody='<div class="app-page-title"><h1>Your progress</h1><p>Every round makes a difference.</p></div><div class="app-metrics"><div><strong>'+sessions.length+'</strong><small>Rounds completed</small></div><div><strong>'+mistakes.size+'</strong><small>Mistakes to review</small></div></div><section class="app-progress-card"><div class="app-card-head"><strong>Last session</strong></div>'+(last?'<div class="app-score"><strong>'+last.correct+'/'+last.total+'</strong><span>correct answers</span></div><div class="app-meter"><span style="width:'+score+'%"></span></div>':'<p>Complete a round to see your results.</p>')+'</section><section class="app-plus-progress"><div class="app-plus-label">PLUS · PROGRESS</div><h2>Know what you&#39;ve mastered. Know what&#39;s next.</h2><p>Track your grammar mastery, see how you&#39;re improving, and discover what to focus on next.</p><div class="app-plus-benefits"><div><strong>Grammar mastery</strong><small>100% across 3 days and 6 distinct questions</small></div><div><strong>Personal improvement plan</strong><small>Prioritized skills and next steps</small></div><div><strong>Long-term progress</strong><small>See which weak spots become strengths</small></div></div><button class="app-primary" id="show-premium"><strong>Preview PLUS</strong><small>One-time upgrade · No subscription</small></button></section><h2 class="app-subtitle">Grammar patterns</h2>'+(skills.length?'<div class="app-topics">'+skills.map(x=>'<button class="app-topic pattern-skill" data-skill="'+x.name+'"><span><strong>'+x.name+'</strong><small>'+x.status+' · '+x.questions+' questions tried</small></span><span aria-hidden="true">›</span></button>').join('')+'</div>':'<p>Start practicing to see which patterns need work.</p>');
 root.innerHTML='<main class="app-shell"><header class="app-top"><img class="brand-logo" src="'+import.meta.env.BASE_URL+'logo.svg" alt="derdiedasdie"><span aria-label="Current section">'+(tab==='home'?'Home':tab==='practice'?'Practice':'Progress')+'</span></header><div class="app-content">'+(tab==='home'?homeBody:tab==='practice'?practiceBody:progressBody)+'</div>'+nav+'</main>';
 root.querySelectorAll('[data-tab]').forEach(b=>b.addEventListener('click',()=>nativeDashboard(sessions,topics,skills,b.dataset.tab)));
 root.querySelectorAll('[data-mode]').forEach(b=>b.addEventListener('click',()=>start(b.dataset.mode)));
 root.querySelectorAll('.pattern-skill').forEach(b=>b.addEventListener('click',()=>startSkill(b.dataset.skill,'Focused')));
 root.querySelector('#home-plus')?.addEventListener('click',premiumPreview);
 root.querySelector('#show-premium')?.addEventListener('click',premiumPreview);
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
 const skillProgress=planSkill?masteryProfile(masteryLog,planSkill):null;
 const focusText=feedback.focus.length?'Focus next: '+feedback.focus.slice(0,2).map(s=>s.name).join(' · ')+'.':'No mistakes this round. Keep practicing across different days to build consistency.';
 const strengthText=feedback.strengths.length?'Strong this round: '+feedback.strengths.slice(0,2).map(s=>s.name).join(' · ')+'.':'';
 const planResult=planSkill?'<div class="session-insights"><h2>'+planSkill+' · '+skillProgress.status+'</h2><p>'+correct+' of '+total+' correct this session.</p><p>'+skillProgress.perfectDays+' of 3 perfect days · '+skillProgress.questions+' of 6 varied questions toward mastery.</p></div>':'';
 root.innerHTML='<main><header><img class="brand-logo" src="'+import.meta.env.BASE_URL+'logo.svg" alt="derdiedasdie" width="162" height="48"></header><section class="intro session-summary"><div class="eyebrow">SESSION COMPLETE</div><h1>'+correct+' out of '+total+'</h1><p>'+ (correct===total?'Perfect round. Every answer correct.':correct>=8?'Strong round. Keep the momentum.':'Every mistake is a chance to learn. Try another round.') +'</p><div class="session-insights"><h2>Your grammar this round</h2><p>'+focusText+'</p>'+(strengthText?'<p>'+strengthText+'</p>':'')+'</div>'+planResult+'<button id="again">Another session</button>'+(planSkill?'<button id="back-plan">Back to my plan →</button>':'')+'<button id="back">Choose a topic</button></section></main>';
 document.getElementById('again').addEventListener('click',()=>planSkill?startSkill(planSkill):start(mode));
 if(planSkill)document.getElementById('back-plan').addEventListener('click',premiumPreview);
 document.getElementById('back').addEventListener('click',home);
}
function render(){
 root.innerHTML=`<main class="practice-screen"><header class="practice-header"><button class="home-exit" id="exit" aria-label="Leave practice and return home">← <span>Home</span></button><img class="brand-logo" src="${import.meta.env.BASE_URL}logo.svg" alt="derdiedasdie" width="162" height="48"></header>
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
 document.querySelector('.practice-screen').classList.add('answer-revealed');
 document.getElementById('next').hidden=false;
 document.getElementById('next').focus({preventScroll:true});
 }));
 document.getElementById('next').addEventListener('click',next);
 document.getElementById('exit').addEventListener('click',home);
}
if(!bank.length)throw new Error('No validated questions');
refreshPlusOwnership().finally(()=>home());
