import test from 'node:test';
import assert from 'node:assert/strict';
import {pickQuestions,pickFreshQuestions,pickProgressiveQuestions,practiceStage,questionDifficulty,SESSION_LENGTH} from '../src/session.js';
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

test('stage uses recent mixed practice results',()=>{assert.equal(practiceStage([]),1);assert.equal(practiceStage([{mode:'Mixed practice',correct:9,total:10},{mode:'Mixed practice',correct:9,total:10}]),3);assert.equal(practiceStage([{mode:'Mixed practice',correct:7,total:10},{mode:'Mixed practice',correct:8,total:10}]),2);});
test('progressive sessions preserve ten distinct questions',()=>{for(const stage of [1,2,3]){const deck=pickProgressiveQuestions(sample,'Mixed practice',[],stage);assert.equal(deck.length,10);assert.equal(new Set(deck.map(q=>q.id)).size,10);}});
test('genitive questions are not automatically all advanced',()=>{assert.equal(questionDifficulty({topic:'Genitive',options:['des','dem','den','der']}),2);});

test('adaptive stages change difficulty proportions when all tiers are available',()=>{
 const bank=[
 ...Array.from({length:20},(_,id)=>({id,topic:'Articles & endings',options:['der','die'],answer:'der'})),
 ...Array.from({length:20},(_,i)=>({id:i+20,topic:'Genitive',options:['des','der'],answer:'des'})),
 ...Array.from({length:20},(_,i)=>({id:i+40,topic:'Genitive',options:['meines','meiner'],answer:'meines'}))
 ];
 const count=stage=>pickProgressiveQuestions(bank,'Mixed practice',[],stage).reduce((a,q)=>(a[questionDifficulty(q)]++,a),{1:0,2:0,3:0});
 assert.deepEqual(count(1),{1:7,2:2,3:1});
 assert.deepEqual(count(2),{1:4,2:4,3:2});
 assert.deepEqual(count(3),{1:2,2:4,3:4});
});
