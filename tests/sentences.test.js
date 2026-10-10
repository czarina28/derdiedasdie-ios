import test from 'node:test';
import assert from 'node:assert/strict';
import {sentences,validateSentence,checkAnswer} from '../src/sentences.js';
import {moreSentences} from '../src/more-sentences.js';
import {vielSentences} from '../src/viel-sentences.js';
import {genitiveSentences} from '../src/genitive-sentences.js';
const allQuestions=[...sentences,...moreSentences,...vielSentences,...genitiveSentences];
test('all sentence questions have unique choices and one correct answer',()=>{
 assert.ok(allQuestions.length>=140);
 for(const q of allQuestions){assert.ok(validateSentence(q),q.before+q.after);assert.equal(q.options.filter(x=>checkAnswer(q,x)).length,1);}
});
test('grading uses answer text rather than position',()=>{
 const q=sentences[0];assert.ok(checkAnswer(q,'einen'));assert.ok(!checkAnswer(q,'ein'));
});
test('question order and distractors cannot alter correctness',()=>{
 for(let n=0;n<10000;n++){const q=allQuestions[Math.floor(Math.random()*allQuestions.length)];const choices=[...q.options].sort(()=>Math.random()-.5);assert.equal(choices.filter(x=>checkAnswer(q,x)).length,1);}
});

test('singular test question explicitly rules out genitive plural',()=>{
 const q=genitiveSentences.find(item=>item.before==='Die Ergebnisse ');
 assert.ok(q,'genitive test question exists');
 assert.equal(q.answer,'des');
 assert.match(q.after,/Tests, den wir gestern geschrieben haben/);
 assert.ok(q.options.includes('der'),'plural distractor remains available');
});
test('plural accusative noun phrases use weak adjective endings',()=>{
 const apples=moreSentences.find(q=>q.before==='Wir kaufen ');
 const shoes=moreSentences.find(q=>q.before==='Ich habe '&&q.after.includes('Schuhe'));
 assert.equal(apples.after,' frischen Äpfel.');
 assert.equal(shoes.after,' neuen Schuhe bestellt.');
});
