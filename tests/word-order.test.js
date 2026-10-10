import test from 'node:test';
import assert from 'node:assert/strict';
import {buildCatalog} from '../src/catalog.js';
test('word-order topic has 20 questions',()=>{
 const bank=buildCatalog();
 assert.equal(bank.filter(q=>q.topic==='Word order & clauses').length,20);
 assert.equal(bank.length,220);
});
