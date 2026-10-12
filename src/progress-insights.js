// Pure progress calculations: usable without an iPhone or StoreKit.
export function progressTrend(sessions=[],limit=8){
 if(!Array.isArray(sessions))return [];
 return sessions.filter(s=>s&&typeof s.date==='string'&&Number.isFinite(s.correct)&&Number.isFinite(s.total)&&s.total>0)
  .slice(-limit).map(s=>({date:s.date.slice(0,10),accuracy:Math.round(100*s.correct/s.total),correct:s.correct,total:s.total}));
}
export function progressChange(sessions=[]){
 const points=progressTrend(sessions,10);
 if(points.length<2)return null;
 const split=Math.floor(points.length/2);
 const average=xs=>Math.round(xs.reduce((n,p)=>n+p.correct,0)*100/xs.reduce((n,p)=>n+p.total,0));
 return average(points.slice(split))-average(points.slice(0,split));
}
export function masteryOverview(log=[],masteryProfile){
 const skills=[...new Set(log.filter(x=>x&&typeof x.skill==='string').map(x=>x.skill))];
 const profiles=skills.map(skill=>({skill,...masteryProfile(log,skill)}));
 return {tracked:profiles.length,mastered:profiles.filter(p=>p.status==='Mastered').length,profiles};
}
