import {shuffle,SESSION_LENGTH} from './session.js';

export const LEARNING_KEY='derdiedasdie-learning-v1';
export function recordAttempt(history,id,correct,date=new Date().toISOString()){
 const next={...history};
 const prev=next[id]||{attempts:0,correct:0,streak:0,misses:0};
 next[id]={attempts:prev.attempts+1,correct:prev.correct+(correct?1:0),streak:correct?prev.streak+1:0,misses:prev.misses+(correct?0:1),lastSeen:date,lastMiss:correct?prev.lastMiss||null:date};
 return next;
}
export function pickFixQuestions(bank,history={},recentIds=[],legacyMistakes=[],length=SESSION_LENGTH){
 const recent=new Set(recentIds),missed=new Set(legacyMistakes);
 const score=q=>{
  const h=history[q.id];
  if(!h)return missed.has(q.id)?90:0;
  const rate=h.correct/Math.max(1,h.attempts);
  return (h.misses?40:0)+(1-rate)*35+(h.streak<2&&h.misses?25:0)+(missed.has(q.id)?15:0);
 };
 const rank=items=>shuffle(items).sort((a,b)=>score(b)-score(a));
 const weak=rank(bank.filter(q=>score(q)>0&&!recent.has(q.id)));
 const olderWeak=rank(bank.filter(q=>score(q)>0&&recent.has(q.id)));
 const fresh=shuffle(bank.filter(q=>!history[q.id]&&!missed.has(q.id)&&!recent.has(q.id)));
 const practiced=shuffle(bank.filter(q=>history[q.id]&&!recent.has(q.id)&&score(q)===0));
 const selected=[],used=new Set();
 const take=(items,n)=>{for(const q of items){if(selected.length>=length||n<=0)break;if(!used.has(q.id)){selected.push(q);used.add(q.id);n--;}}};
 take(weak,Math.ceil(length*.6));
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
