import test from 'node:test';
import assert from 'node:assert/strict';
import {buildCatalog,QUESTION_SOURCES} from '../src/catalog.js';

test('every active question has a unique permanent ID',()=>{
 const bank=buildCatalog();
 assert.ok(bank.length>=140);
 assert.equal(new Set(bank.map(q=>q.id)).size,bank.length);
 assert.ok(bank.every(q=>typeof q.id==='string'));
});
test('permanent IDs are stored in source records',()=>{
 for(const source of QUESTION_SOURCES){
  for(const q of source.questions){
   assert.match(q.id,new RegExp('^'+source.key+'-[0-9]{3}$'));
  }
 }
});
test('catalog preserves legacy positions for saved progress',()=>{
 const bank=buildCatalog();
 assert.deepEqual(bank.map(q=>q.legacyId),bank.map((_,i)=>i));
});

test('every active question has one answer, distinct choices and a substantive explanation',()=>{
 const bank=buildCatalog();
 assert.equal(bank.length,228);
 for(const q of bank){
  assert.ok(q.before.trim() && q.after.trim(),q.id+' missing context');
  assert.equal(q.options.length,4,q.id+' should have four options');
  assert.equal(new Set(q.options).size,4,q.id+' duplicate choices');
  assert.equal(q.options.filter(option=>option===q.answer).length,1,q.id+' answer mismatch');
  assert.ok(q.explanation.length>=40,q.id+' explanation too short');
 }
});
test('known overlapping constructions are not used as false distractors',()=>{
 const byId=new Map(buildCatalog().map(q=>[q.id,q]));
 for(const id of ['prep-014','prep-015']){
  const q=byId.get(id);
  assert.ok(!q.options.includes(q.answer==='an'?'unter':'an'),id);
 }
 assert.ok(!byId.get('prep-035').options.includes('über'));
 assert.match(byId.get('order-006').before,/frage mich/);
});
