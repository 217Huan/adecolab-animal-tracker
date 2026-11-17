const {test}=require('node:test');
const assert=require('node:assert/strict');
const {FavoriteStore}=require('../japanese/favorites.js');
const {messages,typeName}=require('../japanese/i18n.js');
function storage(){const map=new Map();return {getItem:k=>map.get(k)||null,setItem:(k,v)=>map.set(k,v)};}
test('all interface messages have Chinese and English translations',()=>{
  assert.deepEqual(Object.keys(messages.zh).sort(),Object.keys(messages.en).sort());
  for(const text of Object.values(messages.en))assert.ok(text&&!/[\u4e00-\u9fff]/u.test(text));
  const {words}=require('../japanese/vocabulary.js');
  for(const w of words)assert.ok(!/[\u4e00-\u9fff]/u.test(typeName(w.type,'en')));
  const html=require('node:fs').readFileSync(require('node:path').join(__dirname,'../japanese.html'),'utf8');
  for(const [,key] of html.matchAll(/data-text="([^"]+)"/g))assert.ok(messages.en[key],key);
});
test('cloud adapter scopes queries to the user and handles duplicate saves idempotently',async()=>{
  const {remoteStore}=require('../japanese/favorites.js');
  const calls=[];let response={data:[{word_id:'1-1'}],error:null};
  const query={select(value){calls.push(['select',value]);return this;},eq(k,v){calls.push(['eq',k,v]);return this;},insert(value){calls.push(['insert',value]);return this;},delete(){calls.push(['delete']);return this;},then(resolve){resolve(response);}};
  const remote=remoteStore({from:name=>{assert.equal(name,'vocabulary_favorites');return query;}});
  assert.deepEqual(await remote.load('user-a'),['1-1']);assert.ok(calls.some(c=>c[0]==='eq'&&c[1]==='user_id'&&c[2]==='user-a'));
  response={error:{code:'23505'}};await remote.write('user-a','1-1',true);
  assert.ok(calls.some(c=>c[0]==='insert'&&c[1].user_id==='user-a'&&c[1].word_id==='1-1'));
  response={error:Error('offline')};await assert.rejects(()=>remote.write('user-a','1-1',false));
  assert.ok(calls.some(c=>c[0]==='eq'&&c[1]==='word_id'&&c[2]==='1-1'));
});
test('guest favorites persist on this browser and can be removed',async()=>{
  const local=storage(),s=new FavoriteStore(local,['1-1','2-1']);
  await s.toggle('1-1');assert.ok(s.ids.has('1-1'));
  const restored=new FavoriteStore(local,['1-1','2-1']);assert.ok(restored.ids.has('1-1'));
  await restored.toggle('1-1');assert.equal(restored.ids.size,0);
  await assert.rejects(()=>s.toggle('bad-id'));
});
test('accounts are isolated from each other and guest; rejected writes do not appear saved',async()=>{
  const db={a:new Set(['2-1']),b:new Set()};let fail=false;
  const remote={load:async id=>[...db[id]],write:async(id,word,on)=>{if(fail)throw Error('offline');on?db[id].add(word):db[id].delete(word);}};
  const s=new FavoriteStore(storage(),['1-1','2-1']);s.remote=remote;
  await s.toggle('1-1');await s.switchUser({id:'a'});
  assert.deepEqual([...s.ids],['2-1']);await s.toggle('1-1');
  await s.switchUser({id:'b'});assert.equal(s.ids.size,0);
  fail=true;await assert.rejects(()=>s.toggle('1-1'));assert.equal(s.ids.size,0);
  await s.switchUser(null);assert.deepEqual([...s.ids],['1-1']);
});
test('late account response cannot show another account favorites',async()=>{
  let finish;const s=new FavoriteStore(storage(),['1-1']);
  s.remote={load:()=>new Promise(r=>{finish=r;})};
  const pending=s.switchUser({id:'a'});assert.ok(s.loading);
  await s.switchUser(null);finish(['1-1']);await pending;
  assert.equal(s.user,null);assert.equal(s.ids.size,0);
});
test('storage and account-load failures are explicit and do not claim persistence',async()=>{
  const s=new FavoriteStore({getItem:()=>null,setItem:()=>{throw Error('blocked');}},['1-1']);
  await assert.rejects(()=>s.toggle('1-1'));assert.equal(s.ids.size,0);
  s.remote={load:async()=>{throw Error('offline');}};
  await assert.rejects(()=>s.switchUser({id:'a'}));assert.ok(s.loadFailed);
  await assert.rejects(()=>s.toggle('1-1'));
});
