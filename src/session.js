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
