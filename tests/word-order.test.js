import test from 'node:test';
import assert from 'node:assert/strict';
import {buildCatalog} from '../src/catalog.js';
test('word-order topic retains at least 50 questions',()=>{
 const bank=buildCatalog();
 assert.ok(bank.filter(q=>q.topic==='Word order & clauses').length>=50);
 assert.ok(bank.length>=278,'catalog unexpectedly shrank');
});

test('reviewed distractors do not penalize valid alternatives',()=>{
 const bank=buildCatalog();
 const indirect=bank.find(q=>q.id==='order-006');
 assert.match(indirect.before,/frage mich/);
 const visit=bank.find(q=>q.id==='prep-035');
 assert.ok(!visit.options.includes('über'));
});

test('expanded word-order questions keep unique answers and meaningful contexts',()=>{
 const items=buildCatalog().filter(q=>q.id.startsWith('orderextra-'));
 assert.equal(items.length,30);
 for(const q of items){
  assert.equal(q.options.length,4,q.id);
  assert.equal(new Set(q.options).size,4,q.id);
  assert.equal(q.options.filter(o=>o===q.answer).length,1,q.id);
  assert.ok(q.before.trim()&&q.after.trim(),q.id);
  assert.ok(q.explanation.length>=40,q.id);
 }
});
