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
