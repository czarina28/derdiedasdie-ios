import test from 'node:test';
import assert from 'node:assert/strict';
import {recordAttempt,pickFixQuestions,learningSummary} from '../src/learning.js';

test('attempt history remembers repeated mistakes and later improvement',()=>{
 let h={};
 h=recordAttempt(h,'a',false,'2026-01-01');
 h=recordAttempt(h,'a',true,'2026-01-02');
 h=recordAttempt(h,'a',true,'2026-01-03');
 assert.deepEqual([h.a.attempts,h.a.correct,h.a.misses,h.a.streak],[3,2,1,2]);
 assert.deepEqual(learningSummary(h),{attempts:3,persistent:0,improving:1});
});
test('Fix My German produces unique ten-question sessions for first-time learners',()=>{
 const bank=Array.from({length:30},(_,i)=>({id:'q'+i,topic:i%2?'A':'B'}));
 const deck=pickFixQuestions(bank);
 assert.equal(deck.length,10);
 assert.equal(new Set(deck.map(q=>q.id)).size,10);
});
test('Fix My German favors previously missed questions without repeating within a round',()=>{
 const bank=Array.from({length:40},(_,i)=>({id:'q'+i,topic:'A'}));
 let h={};for(let i=0;i<8;i++)h=recordAttempt(h,'q'+i,false);
 const deck=pickFixQuestions(bank,h);
 assert.equal(deck.length,10);
 assert.ok(deck.filter(q=>Number(q.id.slice(1))<8).length>=6);
});
test('Fix My German supports small banks and older mistake IDs',()=>{
 const bank=[{id:'a'},{id:'b'},{id:'c'}];
 const deck=pickFixQuestions(bank,{},[],['a']);
 assert.equal(deck.length,3);
 assert.equal(new Set(deck.map(q=>q.id)).size,3);
});
