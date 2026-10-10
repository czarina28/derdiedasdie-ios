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
 assert.ok(bank.length>=278,'catalog unexpectedly shrank');
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

test('quantifiers topic includes the original and expanded exercises',()=>{
 const bank=buildCatalog();
 const topic=bank.filter(q=>q.id.startsWith('viel-')||q.id.startsWith('quant-'));
 assert.equal(topic.length,44);
 assert.equal(topic.filter(q=>q.id.startsWith('viel-')).length,24);
 assert.equal(topic.filter(q=>q.id.startsWith('quant-')).length,20);
 for(const q of topic){
  assert.ok(q.before.trim()&&q.after.trim(),q.id+' missing context');
  assert.equal(q.options.length,4,q.id);
  assert.equal(new Set(q.options).size,4,q.id);
  assert.ok(q.options.includes(q.answer),q.id);
 }
});

test('answer choices cannot be duplicated after trimming or case folding',()=>{
 for(const q of buildCatalog()){
  const normalized=q.options.map(o=>o.trim().toLocaleLowerCase('de'));
  assert.equal(new Set(normalized).size,4,q.id+' equivalent choices');
  assert.ok(q.options.every(o=>o===o.trim()&&o.length>0),q.id+' malformed choice');
 }
});
test('question text does not contain empty placeholders or unbalanced punctuation',()=>{
 for(const q of buildCatalog()){
  assert.ok(!q.before.includes('___')&&!q.after.includes('___'),q.id);
  assert.ok(!q.before.includes('  ')&&!q.after.includes('  '),q.id);
  assert.ok(!q.explanation.includes('TODO'),q.id);
 }
});
test('reviewed ambiguity regressions are excluded',()=>{
 const bank=new Map(buildCatalog().map(q=>[q.id,q]));
 assert.ok(!bank.get('quant-001').options.includes('weniger'));
 assert.ok(!bank.get('quant-016').options.includes('mehrere'));
 assert.ok(!bank.get('quant-019').options.includes('alles'));
});


test('all active questions have recognized curriculum topics and subtopics',async()=>{
 const {TOPIC_LABELS}=await import('../src/curriculum.js');
 const bank=buildCatalog();
 assert.equal(bank.length,338);
 for(const q of bank){
  assert.ok(TOPIC_LABELS.includes(q.topic),q.id+' topic');
  assert.ok(q.subtopic,q.id+' subtopic');
 }
 assert.ok(!bank.some(q=>q.id==='core-019'));
 assert.equal(bank.find(q=>q.id==='orderextra-020').subtopic,'Relative pronouns');
});

test('adjective ending drills are genuine suffix questions',()=>{
 const questions=buildCatalog().filter(q=>q.id.startsWith('adj-'));
 assert.equal(questions.length,60);
 assert.ok(questions.every(q=>q.topic==='Adjective endings'));
 assert.ok(questions.every(q=>q.options.every(option=>/^(e|en|em|er|es)$/.test(option))));
 assert.ok(questions.every(q=>q.answer.length>=1&&q.explanation.length>=40));
});
