const {test}=require('node:test');
const assert=require('node:assert/strict');
const {words,kanaToRomaji}=require('../japanese/vocabulary.js');
test('every vocabulary display is kana and every pronunciation is romaji',()=>{
  for(const w of words){
    assert.ok(w.kana&&/^[\p{Script=Hiragana}\p{Script=Katakana}ー〜／]+$/u.test(w.kana),`${w.id}: ${w.kana}`);
    assert.ok(w.romaji&&/^[a-z' /~-]+$/.test(w.romaji),`${w.id}: ${w.romaji}`);
    assert.equal(w.romaji,kanaToRomaji(w.kana));
  }
  assert.equal(words.length,442);
  assert.equal(words.find(w=>w.reading==='かわいい').romaji,'kawaii');
  assert.equal(words.find(w=>w.reading==='しんせつ').kana,'しんせつ');
  assert.equal(words.find(w=>w.reading==='べんり').romaji,'benri');
  assert.equal(words.find(w=>w.reading==='うたう').romaji,'utau');
});
test('romaji handles contracted sounds, double consonants, long vowels and syllabic n',()=>{
  for(const [kana,romaji] of [['きょうかしょ','kyoukasho'],['がっこう','gakkou'],['ざっし','zasshi'],['まっちゃ','matcha'],['ほんや',"hon'ya"],['しんぶん','shinbun'],['パーティー','paatii'],['コーヒー','koohii'],['コンピューター','konpyuutaa'],['Ｔシャツ','tiishatsu'],['Ｌサイズ','erusaizu'],['なん／なに','nan / nani']])assert.equal(kanaToRomaji(kana),romaji);
});
