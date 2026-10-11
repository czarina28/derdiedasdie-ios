export const MASTERY_KEY='derdiedasdie-mastery-v1';
export function recordSkillSession(log=[],answers=[],date=new Date().toISOString()){
 const groups=new Map();
 for(const a of answers){
  if(!a.id||!a.skill)continue;
  if(!groups.has(a.skill))groups.set(a.skill,{skill:a.skill,ids:[],correct:0,total:0});
  const g=groups.get(a.skill);g.ids.push(a.id);g.total++;if(a.correct)g.correct++;
 }
 return [...log,...[...groups.values()].map(g=>({...g,ids:[...new Set(g.ids)],date}))].slice(-500);
}
export function masteryProfile(log=[],skill){
 const sessions=log.filter(s=>s.skill===skill&&s.total>0&&typeof s.date==='string').sort((a,b)=>a.date.localeCompare(b.date));
 if(!sessions.length)return {status:'Learning',accuracy:null,days:0,perfectDays:0,questions:0,goal:100};
 const total=sessions.reduce((n,s)=>n+s.total,0),correct=sessions.reduce((n,s)=>n+s.correct,0);
 const days=new Map();
 for(const s of sessions){
  const day=s.date.slice(0,10);
  if(!days.has(day))days.set(day,{perfect:true,ids:new Set()});
  const d=days.get(day);if(s.correct!==s.total)d.perfect=false;
  for(const id of s.ids||[])d.ids.add(id);
 }
 let run=[];
 for(const [,d] of [...days].sort((a,b)=>a[0].localeCompare(b[0]))){if(d.perfect && d.ids.size >= 2)run.push(d);else run=[];}
 const questions=new Set(run.flatMap(d=>[...d.ids])).size;
 const mastered=run.length>=3&&questions>=6;
 return {status:mastered?'Mastered':sessions.length>1||correct<total?'Improving':'Learning',accuracy:Math.round(100*correct/total),days:days.size,perfectDays:run.length,questions,goal:100};
}
