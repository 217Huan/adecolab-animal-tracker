const {test}=require('node:test');
const assert=require('node:assert/strict');
const {Session}=require('../japanese/core.js');
const words=Array.from({length:4},(_,id)=>({id}));
test('browsing forward and backward preserves mastery and returns to the same word',()=>{
  const session=new Session(words,()=>.5),original=session.current;
  session.navigate(1);assert.notEqual(session.current,original);
  session.navigate(-1);assert.equal(session.current,original);
  assert.equal(session.mastered,0);assert.equal(session.index,0);assert.equal(session.round,1);
  assert.deepEqual(session.missed,[]);
});
test('browsing never regrades processed words and preserves the missed-only next round',()=>{
  const session=new Session(words,()=>.5),missed=session.current;
  session.grade(false);const known=session.current;session.grade(true);
  for(let n=0;n<8;n++){session.navigate(1);assert.notEqual(session.current,missed);assert.notEqual(session.current,known);}
  session.grade(true);session.navigate(-1);session.grade(true);
  assert.equal(session.round,2);assert.equal(session.current,missed);assert.equal(session.queue.length,1);
  session.navigate(1);assert.equal(session.current,missed);session.grade(true);
  assert.equal(session.done,true);assert.equal(session.mastered,4);
  session.navigate(-1);assert.equal(session.done,true);
});
