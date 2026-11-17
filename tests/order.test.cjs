const {test}=require('node:test');
const assert=require('node:assert/strict');
const {Session}=require('../japanese/core.js');
test('list order is preserved in initial and missed-only rounds',()=>{
 const words=[1,2,3,4];const s=new Session(words,()=>0,false);
 assert.deepEqual(s.queue,words);s.grade(false);s.grade(true);s.grade(false);s.grade(true);
 assert.deepEqual(s.queue,[1,3]);
});
test('shuffle is optional and does not mutate the source',()=>{
 const words=[1,2,3,4];const s=new Session(words,()=>0,true);
 assert.notDeepEqual(s.queue,words);assert.deepEqual(words,[1,2,3,4]);
});
