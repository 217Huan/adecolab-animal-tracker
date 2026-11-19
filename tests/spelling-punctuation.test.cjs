const {test}=require('node:test'),assert=require('node:assert/strict');
const {isCorrect,normalize,teForm}=require('../japanese/core.js');
const {words}=require('../japanese/vocabulary.js');
test('spelling ignores incidental punctuation and spaces while retaining character order',()=>{
 const word=words.find(w=>w.kana==='かわいい');
 for(const answer of ['かわいい。','「かわいい！」','か わ、い い？','　かわいい，.！\n'])assert.ok(isCorrect(word,answer),answer);
 for(const answer of ['かわい','かわいあ','いかわい','かわいいね','、。！　',''])assert.ok(!isCorrect(word,answer),answer);
});
test('long vowels, small kana, voicing and meaningful suffix markers remain significant',()=>{
 assert.notEqual(normalize('コーヒー'),normalize('コヒ'));
 assert.notEqual(normalize('がっこう'),normalize('がつこう'));
 assert.notEqual(normalize('かき'),normalize('かぎ'));
 assert.notEqual(normalize('〜さん'),normalize('さん'));
 const verb=words.find(w=>w.kana==='たべる');assert.equal(normalize('た、べて。'),teForm(verb));assert.notEqual(normalize('べたて。'),teForm(verb));
});
