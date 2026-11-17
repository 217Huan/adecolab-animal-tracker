const {test}=require('node:test');
const assert=require('node:assert/strict');
const {words}=require('../japanese/vocabulary.js');
const {Session,selectWords,isCorrect}=require('../japanese/core.js');
test('all eight lessons have unique IDs and complete vocabulary fields',()=>{
  assert.equal(new Set(words.map(w=>w.id)).size,words.length);
  assert.deepEqual([...new Set(words.map(w=>w.lesson))],[1,2,3,4,5,6,7,8]);
  for(const w of words)assert.ok(w.english&&w.reading&&w.written&&w.answers.length);
  for(let lesson=1;lesson<=8;lesson++)assert.ok(words.filter(w=>w.lesson===lesson).length>=45);
});
test('lesson and cross-lesson part-of-speech filters',()=>{
  const verbs=selectWords(words,'all','verb','all');
  assert.ok(new Set(verbs.map(w=>w.lesson)).size>3);
  assert.ok(verbs.every(w=>w.pos==='verb'));
  assert.ok(selectWords(words,1,'verb','all').length===0);
  assert.ok(selectWords(words,8,'verb','う动词').every(w=>w.lesson===8&&w.type==='う动词'));
});
test('unknown words repeat, known words leave the next round, then completion',()=>{
  const s=new Session(words.slice(0,3),()=>0.5);
  const first=s.current.id;
  s.grade(false);s.grade(true);s.grade(true);
  assert.equal(s.round,2);assert.equal(s.queue.length,1);assert.equal(s.current.id,first);
  s.grade(false);assert.equal(s.round,3);assert.equal(s.queue.length,1);
  s.grade(true);assert.equal(s.done,true);assert.equal(s.mastered,3);
  assert.throws(()=>s.grade(true));
});
test('answers normalize width and whitespace without accepting spelling errors',()=>{
  const eat=words.find(w=>w.reading==='たべる');
  assert.ok(isCorrect(eat,' 食べる '));assert.ok(isCorrect(eat,'たべる'));
  assert.ok(!isCorrect(eat,'たべろ'));assert.ok(!isCorrect(eat,''));
  const shirt=words.find(w=>w.reading==='Ｔシャツ');
  assert.ok(isCorrect(shirt,'Tシャツ'));
  const quiet=words.find(w=>w.reading==='しずか');
  assert.ok(isCorrect(quiet,'静かな'));
  const what=words.find(w=>w.reading==='なん／なに');
  assert.ok(isCorrect(what,'なに'));assert.ok(isCorrect(what,'なん'));
  const morning=words.find(w=>w.reading==='おばあさん');
  assert.ok(!isCorrect(morning,'おばさん'));
});
test('empty session completes safely and shuffle does not mutate source',()=>{
  assert.ok(new Session([]).done);
  const source=words.slice(0,4),ids=source.map(w=>w.id);
  new Session(source);assert.deepEqual(source.map(w=>w.id),ids);
});
test('tracker scripts remain identical to the original repository version',()=>{
  const fs=require('node:fs'),cp=require('node:child_process');
  const original=cp.execFileSync('git',['show','HEAD:index.html'],{encoding:'utf8'});
  const current=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
  const scripts=html=>[...html.replace(/\r\n/g,'\n').matchAll(/<script\b[^>]*>[\s\S]*?<\/script>/g)].map(m=>m[0]).filter(s=>!s.includes('src="japanese/navigation-language.js"'));
  assert.deepEqual(scripts(current),scripts(original));
});
