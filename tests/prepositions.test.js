import test from 'node:test';
import assert from 'node:assert/strict';
import {prepositionSentences} from '../src/preposition-sentences.js';
import {validateSentence} from '../src/sentences.js';
import {buildCatalog} from '../src/catalog.js';
import {pickProgressiveQuestions} from '../src/session.js';

test('all verb-preposition questions have unique IDs and valid choices',()=>{
 assert.equal(prepositionSentences.length,57);
 assert.equal(new Set(prepositionSentences.map(q=>q.id)).size,57);
 for(const q of prepositionSentences){
  assert.ok(validateSentence(q),q.id);
  assert.ok(q.explanation.length>35,q.id);
 }
});
test('new topic is available in focused and mixed practice',()=>{
 const bank=buildCatalog();
 const focused=pickProgressiveQuestions(bank,'Prepositions',[],1);
 assert.equal(focused.length,10);
 assert.ok(focused.every(q=>q.topic==='Prepositions'));
 for(const stage of [1,2,3]){
  const mixed=pickProgressiveQuestions(bank,'Mixed practice',[],stage);
  assert.ok(mixed.some(q=>q.topic==='Prepositions'));
 }
});

test('leiden questions do not mark valid alternative prepositions wrong',()=>{
 for(const id of ['prep-014','prep-015']){
  const q=prepositionSentences.find(item=>item.id===id);
  assert.ok(q);
  assert.ok(!q.options.includes(q.answer==='an'?'unter':'an'));
 }
});
