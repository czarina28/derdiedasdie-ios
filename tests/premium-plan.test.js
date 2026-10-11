import test from 'node:test';
import assert from 'node:assert/strict';
import {weakSpots,practicePlan} from '../src/premium-plan.js';

const bank=[{id:'a',topic:'Articles'},{id:'b',topic:'Articles'},{id:'c',topic:'Word order'}];
const history={a:{attempts:4,correct:1,misses:3,streak:0},b:{attempts:2,correct:2,misses:0,streak:2},c:{attempts:3,correct:2,misses:1,streak:2}};

test('weak spots prioritize unresolved errors and report accuracy',()=>{
 const spots=weakSpots(bank,history);
 assert.equal(spots.length,2);
 assert.equal(spots[0].name,'Articles');
 assert.equal(spots[0].unresolved,1);
 assert.equal(spots[0].accuracy,50);
 assert.equal(spots[1].unresolved,0);
});

test('empty history gives a safe empty plan',()=>{
 assert.deepEqual(weakSpots(bank,{}),[]);
 assert.deepEqual(practicePlan(bank,{}),[]);
});

test('plan uses top weak spots without requiring a purchase',()=>{
 const plan=practicePlan(bank,history);
 assert.equal(plan[0].skill,'Articles');
 assert.equal(plan[0].day,1);
});
