import test from 'node:test';
import assert from 'node:assert/strict';
import {recordAttempt,pickFixQuestions,learningSummary,skillProfile,sessionFeedback} from '../src/learning.js';

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

test('grammar consistency requires multiple questions and separate successful days',()=>{
 const bank=Array.from({length:4},(_,i)=>({id:'x'+i,subtopic:'Wo vs. Wohin?'}));
 let h={};
 for(let i=0;i<3;i++){
  h=recordAttempt(h,'x'+i,false,'2026-01-01T09:00:00Z');
  h=recordAttempt(h,'x'+i,true,'2026-01-01T10:00:00Z');
  h=recordAttempt(h,'x'+i,true,'2026-01-01T11:00:00Z');
 }
 assert.notEqual(skillProfile(bank,h)[0].status,'Getting consistent');
 for(let i=0;i<3;i++)for(let n=0;n<8;n++)h=recordAttempt(h,'x'+i,true,'2026-01-02T10:00:00Z');
 assert.equal(skillProfile(bank,h)[0].status,'Getting consistent');
});
test('session feedback distinguishes errors from strengths by grammar pattern',()=>{
 const feedback=sessionFeedback([{skill:'Wo vs. Wohin?',correct:false},{skill:'Wo vs. Wohin?',correct:true},{skill:'Verb position',correct:true}]);
 assert.equal(feedback.focus[0].name,'Wo vs. Wohin?');
 assert.equal(feedback.strengths[0].name,'Verb position');
});
