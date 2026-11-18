const {test}=require('node:test'),assert=require('node:assert/strict');
const {combineGroups,Session}=require('../japanese/core.js');
const {words}=require('../japanese/vocabulary.js');
test('custom set unions lesson nouns and ru verbs without duplicate IDs',()=>{
 const groups=[{lesson:6,pos:'noun',type:'all'},{lesson:6,pos:'verb',type:'る动词'},{lesson:6,pos:'noun',type:'all'}];
 const result=combineGroups(words,groups);
 assert.ok(result.some(w=>w.pos==='noun'));assert.ok(result.some(w=>w.type==='る动词'));
 assert.ok(result.every(w=>w.lesson===6&&(w.pos==='noun'||w.type==='る动词')));
 assert.equal(new Set(result.map(w=>w.id)).size,result.length);
 assert.deepEqual(new Session(result,()=>0,false).queue,result);
 assert.notDeepEqual(new Session(result,()=>0,true).queue,result);
 assert.deepEqual(combineGroups(words,[]),[]);
});
