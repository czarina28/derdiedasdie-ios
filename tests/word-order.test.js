import test from 'node:test';
import assert from 'node:assert/strict';
import {buildCatalog} from '../src/catalog.js';
test('word-order topic has 50 questions',()=>{
 const bank=buildCatalog();
 assert.equal(bank.filter(q=>q.topic==='Word order & clauses').length,50);
 assert.equal(bank.length,258);
});

test('reviewed distractors do not penalize valid alternatives',()=>{
 const bank=buildCatalog();
 const indirect=bank.find(q=>q.id==='order-006');
 assert.match(indirect.before,/frage mich/);
 const visit=bank.find(q=>q.id==='prep-035');
 assert.ok(!visit.options.includes('über'));
});
