import test from 'node:test';
import assert from 'node:assert/strict';
import {pickQuestions,SESSION_LENGTH} from '../src/session.js';
const sample=Array.from({length:30},(_,i)=>({id:i,topic:i%2?'Genitive':'Articles & endings'}));
test('sessions contain at most ten distinct questions',()=>{
 for(let i=0;i<100;i++){const q=pickQuestions(sample);assert.equal(q.length,SESSION_LENGTH);assert.equal(new Set(q.map(x=>x.id)).size,q.length);}
});
test('topic selection only returns that topic',()=>{
 const q=pickQuestions(sample,'Genitive');assert.ok(q.every(x=>x.topic==='Genitive'));
});
