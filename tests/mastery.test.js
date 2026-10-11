import test from 'node:test';
import assert from 'node:assert/strict';
import {recordSkillSession,masteryProfile} from '../src/mastery.js';
const skill='Articles';
const add=(log,day,ids,correct=true)=>recordSkillSession(log,ids.map(id=>({id,skill,correct})),day+'T12:00:00Z');
test('three perfect days with varied questions establish mastery',()=>{
 let log=[];
 log=add(log,'2026-10-01',['a','b']);log=add(log,'2026-10-02',['c','d']);log=add(log,'2026-10-03',['e','f']);
 assert.equal(masteryProfile(log,skill).status,'Mastered');
 log=add(log,'2026-10-04',['g'],false);
 assert.equal(masteryProfile(log,skill).status,'Improving');
});
test('one perfect day and repeated questions do not qualify',()=>{
 let log=[];
 log=add(log,'2026-10-01',['a','b']);log=add(log,'2026-10-02',['a','b']);log=add(log,'2026-10-03',['a','b']);
 assert.equal(masteryProfile(log,skill).status,'Learning');
 assert.equal(masteryProfile(log,skill).questions,2);
});
test('old errors do not prevent later mastery',()=>{
 let log=add([],'2026-10-01',['z'],false);
 log=add(log,'2026-10-02',['a','b']);log=add(log,'2026-10-03',['c','d']);log=add(log,'2026-10-04',['e','f']);
 assert.equal(masteryProfile(log,skill).status,'Mastered');
});
