import {shuffle,SESSION_LENGTH} from './session.js';

export const LEARNING_KEY='derdiedasdie-learning-v1';
export function recordAttempt(history,id,correct,date=new Date().toISOString()){
 const next={...history};
 const prev=next[id]||{attempts:0,correct:0,streak:0,misses:0};
 next[id]={attempts:prev.attempts+1,correct:prev.correct+(correct?1:0),streak:correct?prev.streak+1:0,misses:prev.misses+(correct?0:1),lastSeen:date,lastMiss:correct?prev.lastMiss||null:date};
 return next;
}
export function skillFor(q){return q.subtopic||q.topic||'General grammar';}
export function skillProfile(bank,history={}){
 const groups=new Map();
 for(const q of bank){const h=history[q.id];if(!h)continue;const name=skillFor(q);if(!groups.has(name))groups.set(name,{name,attempts:0,correct:0,questions:new Set(),recentSuccesses:0});const g=groups.get(name);g.attempts+=h.attempts;g.correct+=h.correct;g.questions.add(q.id);if(h.streak>=2)g.recentSuccesses++;}
 return [...groups.values()].map(g=>({name:g.name,attempts:g.attempts,accuracy:g.correct/g.attempts,questions:g.questions.size,status:g.questions.size>=3&&g.accuracy>=.85&&g.recentSuccesses>=2?'Getting consistent':g.accuracy>=.7?'Improving':'Needs practice'})).sort((a,b)=>a.accuracy-b.accuracy);
}
export function pickFixQuestions(bank,history={},recentIds=[],legacyMistakes=[],length=SESSION_LENGTH){
 const recent=new Set(recentIds),missed=new Set(legacyMistakes);
 const profile=skillProfile(bank,history);
 const weakSkills=new Set(profile.filter(s=>s.status==='Needs practice'&&s.questions>=1).map(s=>s.name));
 const score=q=>{
  const h=history[q.id];
  if(!h)return missed.has(q.id)?90:0;
  const rate=h.correct/Math.max(1,h.attempts);
  return (h.misses?40:0)+(1-rate)*35+(h.streak<2&&h.misses?25:0)+(missed.has(q.id)?15:0);
 };
 const rank=items=>shuffle(items).sort((a,b)=>(score(b)+(weakSkills.has(skillFor(b))?30:0))-(score(a)+(weakSkills.has(skillFor(a))?30:0)));
 const related=rank(bank.filter(q=>weakSkills.has(skillFor(q))&&!history[q.id]&&!missed.has(q.id)&&!recent.has(q.id)));
 const weak=rank(bank.filter(q=>score(q)>0&&!recent.has(q.id)));
 const olderWeak=rank(bank.filter(q=>score(q)>0&&recent.has(q.id)));
 const fresh=shuffle(bank.filter(q=>!history[q.id]&&!missed.has(q.id)&&!recent.has(q.id)));
 const practiced=shuffle(bank.filter(q=>history[q.id]&&!recent.has(q.id)&&score(q)===0));
 const selected=[],used=new Set();
 const take=(items,n)=>{for(const q of items){if(selected.length>=length||n<=0)break;if(!used.has(q.id)){selected.push(q);used.add(q.id);n--;}}};
 take(weak,Math.ceil(length*.4));
 take(related,Math.ceil(length*.2));
 take(fresh,Math.ceil(length*.3));
 take(practiced,Math.max(1,Math.floor(length*.1)));
 take(olderWeak,length-selected.length);
 take(fresh,length-selected.length);
 take(practiced,length-selected.length);
 take(shuffle(bank.filter(q=>!recent.has(q.id))),length-selected.length);
 take(shuffle(bank),length-selected.length);
 return shuffle(selected);
}
export function learningSummary(history={}){
 const entries=Object.values(history);
 return {attempts:entries.reduce((n,h)=>n+h.attempts,0),persistent:entries.filter(h=>h.misses>0&&h.streak<2).length,improving:entries.filter(h=>h.misses>0&&h.streak>=2).length};
}
