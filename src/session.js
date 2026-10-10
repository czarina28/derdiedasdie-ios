export const SESSION_LENGTH = 10;
export function shuffle(items){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
export function pickQuestions(items,topic='Mixed practice'){const pool=topic==='Mixed practice'?items:items.filter(x=>x.topic===topic);return shuffle(pool).slice(0,SESSION_LENGTH);}

export function pickFreshQuestions(items,topic='Mixed practice',recentIds=[],length=SESSION_LENGTH){
 const pool=topic==='Mixed practice'?items:items.filter(x=>x.topic===topic);
 const recent=new Set(recentIds);
 const fresh=shuffle(pool.filter(q=>!recent.has(q.id)));
 const older=shuffle(pool.filter(q=>recent.has(q.id)));
 if(topic!=='Mixed practice')return [...fresh,...older].slice(0,length);
 const groups=new Map();
 for(const q of fresh){if(!groups.has(q.topic))groups.set(q.topic,[]);groups.get(q.topic).push(q);}
 const selected=[];
 while(selected.length<length && [...groups.values()].some(g=>g.length)){
  for(const group of shuffle([...groups.values()])){if(selected.length<length && group.length)selected.push(group.pop());}
 }
 return [...selected,...older].slice(0,length);
}

export function practiceStage(history=[]){const recent=history.filter(s=>s.mode==='Mixed practice'&&s.total>=8).slice(-3);if(recent.length<2)return 1;const correct=recent.reduce((n,s)=>n+s.correct,0);const total=recent.reduce((n,s)=>n+s.total,0);return correct/total>=.85?3:correct/total>=.7?2:1;}

export function questionDifficulty(q){if(q.topic==='Genitive')return (q.options??[]).includes('meines')||(q.options??[]).includes('unseres')?3:2;if(q.topic==='Viel & viele')return q.answer==='vielen'?2:1;return 1;}

export function pickProgressiveQuestions(items,topic,recentIds=[],stage=1){
 if(topic!=='Mixed practice')return pickFreshQuestions(items,topic,recentIds);
 const recent=new Set(recentIds);
 const topics=shuffle([...new Set(items.map(q=>q.topic))]);
 const quotas=new Map(topics.map((name,i)=>[name,Math.floor(SESSION_LENGTH/topics.length)+(i<SESSION_LENGTH%topics.length?1:0)]));
 const chosen=[],used=new Set();
 for(const name of topics){
  const pool=items.filter(q=>q.topic===name);
  const levels=stage===1?[1,2,3]:stage===2?[2,1,3]:[3,2,1];
  const ordered=levels.flatMap(level=>{
   const tier=pool.filter(q=>questionDifficulty(q)===level);
   return [...shuffle(tier.filter(q=>!recent.has(q.id))),...shuffle(tier.filter(q=>recent.has(q.id)))];
  });
  for(const q of ordered.slice(0,quotas.get(name))){chosen.push(q);used.add(q.id);}
 }
 const remaining=shuffle(items.filter(q=>!used.has(q.id)&&!recent.has(q.id)));
 const older=shuffle(items.filter(q=>!used.has(q.id)&&recent.has(q.id)));
 return shuffle([...chosen,...remaining.slice(0,Math.max(0,SESSION_LENGTH-chosen.length)),...older.slice(0,Math.max(0,SESSION_LENGTH-chosen.length-remaining.length))]).slice(0,SESSION_LENGTH);
}
