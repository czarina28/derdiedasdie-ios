import test from 'node:test';
import assert from 'node:assert/strict';
import {progressTrend,progressChange,masteryOverview} from './progress-insights.js';
test('trend ignores incomplete sessions and limits recent rounds',()=>{
 const sessions=[{date:'2026-01-01',correct:2,total:10},{date:'2026-01-02',correct:0,total:0},{date:'2026-01-03',correct:9,total:10}];
 assert.deepEqual(progressTrend(sessions),[{date:'2026-01-01',accuracy:20,correct:2,total:10},{date:'2026-01-03',accuracy:90,correct:9,total:10}]);
 assert.equal(progressChange(sessions),70);
});
test('no fabricated trend for one round',()=>{assert.equal(progressChange([{date:'2026-01-01',correct:8,total:10}]),null);});
test('mastery overview counts actual mastered skills',()=>{
 const result=masteryOverview([{skill:'Articles'},{skill:'Cases'}],(_,skill)=>({status:skill==='Cases'?'Mastered':'Improving'}));
 assert.equal(result.tracked,2);assert.equal(result.mastered,1);
});
