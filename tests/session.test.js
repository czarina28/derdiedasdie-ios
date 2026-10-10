import test from 'node:test';
import assert from 'node:assert/strict';
import {pickQuestions,pickFreshQuestions,SESSION_LENGTH} from '../src/session.js';
const sample=Array.from({length:30},(_,i)=>({id:i,topic:i%2?'Genitive':'Articles & endings'}));
test('sessions contain at most ten distinct questions',()=>{
 for(let i=0;i<100;i++){const q=pickQuestions(sample);assert.equal(q.length,SESSION_LENGTH);assert.equal(new Set(q.map(x=>x.id)).size,q.length);}
});
test('topic selection only returns that topic',()=>{
 const q=pickQuestions(sample,'Genitive');assert.ok(q.every(x=>x.topic==='Genitive'));
});

test('recently seen questions are skipped while fresh choices exist',()=>{
 const recent=Array.from({length:10},(_,i)=>i);
 const q=pickFreshQuestions(sample,'Mixed practice',recent);
 assert.equal(q.length,10);
 assert.ok(q.every(item=>!recent.includes(item.id)));
 assert.equal(new Set(q.map(item=>item.id)).size,10);
});
test('mixed sessions include more than one topic',()=>{
 for(let i=0;i<30;i++){
  const q=pickFreshQuestions(sample);
  assert.ok(new Set(q.map(item=>item.topic)).size>1);
 }
});
test('review sessions work when fewer than ten questions are available',()=>{
 const q=pickFreshQuestions(sample.slice(0,3),'Mixed practice',[]);
 assert.equal(q.length,3);
});
