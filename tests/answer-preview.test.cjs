const {test}=require('node:test'),assert=require('node:assert/strict');
const {answerPreview}=require('../japanese/core.js');
test('typing preview never reveals an answer before grading, including IME text',()=>{
 for(const text of ['', 'そ','そうじ','souji']){
  const preview=answerPreview(text,false,false,'そうじする');
  assert.equal(preview.text,text||'—');assert.equal(preview.state,'typing');
 }
});
test('grading replaces wrong answers but preserves accepted variants and resets on next word',()=>{
 assert.deepEqual(answerPreview('そうし',true,false,'そうじする'),{text:'そうじする',state:'correction'});
 assert.deepEqual(answerPreview('しずかな',true,true,'しずか'),{text:'しずかな',state:'correct'});
 assert.deepEqual(answerPreview('',false,false,'たべて'),{text:'—',state:'typing'});
});
