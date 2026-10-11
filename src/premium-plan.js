import {skillFor} from './learning.js';

export function weakSpots(bank,history={},limit=5){
 const groups=new Map();
 for(const q of bank){
  const h=history[q.id];
  if(!h||!h.attempts)continue;
  const name=skillFor(q);
  if(!groups.has(name))groups.set(name,{name,attempts:0,correct:0,misses:0,unresolved:0});
  const g=groups.get(name);
  g.attempts+=h.attempts;
  g.correct+=h.correct||0;
  g.misses+=h.misses||0;
  if(h.misses>0&&h.streak<2)g.unresolved++;
 }
 return [...groups.values()].filter(g=>g.misses>0).map(g=>({...g,accuracy:Math.round(100*g.correct/g.attempts)})).sort((a,b)=>b.unresolved-a.unresolved||a.accuracy-b.accuracy).slice(0,limit);
}

export function practicePlan(bank,history={},days=3){
 return weakSpots(bank,history,days).map((s,i)=>({day:i+1,skill:s.name,unresolved:s.unresolved}));
}

export function targetedQuestions(bank,history={},skill,recentIds=[],length=10){
 const pool=bank.filter(q=>skillFor(q)===skill);
 const recent=new Set(recentIds);
 const score=q=>{
  const h=history[q.id];
  return (h?.misses&&h.streak<2?100:0)+(h?.misses||0)*5-(h?.streak||0)*3;
 };
 const ranked=items=>items.map(q=>({q,tie:Math.random()})).sort((a,b)=>score(b.q)-score(a.q)||a.tie-b.tie).map(x=>x.q);
 return [...ranked(pool.filter(q=>!recent.has(q.id))),...ranked(pool.filter(q=>recent.has(q.id)))].slice(0,length);
}
