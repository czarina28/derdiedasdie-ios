import test from 'node:test';
import assert from 'node:assert/strict';
import {pickQuestions,pickFreshQuestions,pickProgressiveQuestions,practiceStage,questionDifficulty,diversifyAnswers,SESSION_LENGTH} from '../src/session.js';
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

test('mixed practice balances three topics at every stage',()=>{
 const bank=['Articles & endings','Quantifiers & determiners','Genitive'].flatMap((topic,t)=>Array.from({length:20},(_,i)=>({id:t*20+i,topic,answer:'des',options:['des','der']})));
 for(const stage of [1,2,3])for(let run=0;run<30;run++){
  const deck=pickProgressiveQuestions(bank,'Mixed practice',[],stage);
  const counts=[...new Set(deck.map(q=>q.topic))].map(topic=>deck.filter(q=>q.topic===topic).length).sort();
  assert.deepEqual(counts,[3,3,4]);
 }
});
test('difficulty preference changes within a topic without increasing its share',()=>{
 const bank=[
 ...Array.from({length:20},(_,i)=>({id:i,topic:'Articles & endings',answer:'der',options:['der','die']})),
 ...Array.from({length:20},(_,i)=>({id:i+20,topic:'Quantifiers & determiners',answer:i%2?'vielen':'viel',options:['viel','vielen']})),
 ...Array.from({length:20},(_,i)=>({id:i+40,topic:'Genitive',answer:'des',options:i%2?['meines','meiner']:['des','der']}))
 ];
 const difficult=stage=>pickProgressiveQuestions(bank,'Mixed practice',[],stage).filter(q=>questionDifficulty(q)===3).length;
 assert.equal(difficult(1),0);
 assert.ok(difficult(3)>=3);
});

test('answer diversification avoids immediate repeated forms when alternatives exist',()=>{
 const items=[...Array.from({length:6},(_,id)=>({id,answer:'der'})),...Array.from({length:4},(_,i)=>({id:i+6,answer:'die'}))];
 const ordered=diversifyAnswers(items);
 assert.equal(ordered.length,10);
 assert.equal(new Set(ordered.map(q=>q.id)).size,10);
 for(let i=1;i<8;i++)assert.notEqual(ordered[i].answer,ordered[i-1].answer);
});
test('topic practice prefers fresh questions even when their answers repeat',()=>{
 const items=Array.from({length:20},(_,id)=>({id,topic:'Articles & endings',answer:id<15?'der':'die'}));
 const deck=pickFreshQuestions(items,'Articles & endings',[...Array(10).keys()]);
 assert.equal(deck.length,10);
 assert.ok(deck.every(q=>q.id>=10));
});
