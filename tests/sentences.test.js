import test from 'node:test';
import assert from 'node:assert/strict';
import {sentences,validateSentence,checkAnswer} from '../src/sentences.js';
test('all sentence questions have unique choices and one correct answer',()=>{
 assert.ok(sentences.length>=15);
 for(const q of sentences){assert.ok(validateSentence(q),q.before+q.after);assert.equal(q.options.filter(x=>checkAnswer(q,x)).length,1);}
});
test('grading uses answer text rather than position',()=>{
 const q=sentences[0];assert.ok(checkAnswer(q,'einen'));assert.ok(!checkAnswer(q,'ein'));
});
test('question order and distractors cannot alter correctness',()=>{
 for(let n=0;n<10000;n++){const q=sentences[Math.floor(Math.random()*sentences.length)];const choices=[...q.options].sort(()=>Math.random()-.5);assert.equal(choices.filter(x=>checkAnswer(q,x)).length,1);}
});
