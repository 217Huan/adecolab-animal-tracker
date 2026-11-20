const {test}=require('node:test'),assert=require('node:assert/strict');
const {topics,starts}=require('../japanese/grammar.js');
test('grammar matches the eight lesson topic counts in the supplied third-edition contents',()=>{
 assert.equal(topics.length,53);assert.equal(new Set(topics.map(t=>t.id)).size,53);
 assert.deepEqual(Array.from({length:8},(_,i)=>topics.filter(t=>t.lesson===i+1).length),[3,7,8,8,6,7,6,8]);
 assert.deepEqual(starts,[41,60,86,107,132,150,170,190]);
 for(const topic of topics){for(const lang of ['zh','en'])assert.ok(topic.title[lang]&&topic.note[lang]&&topic.translation[lang]);assert.ok(topic.form&&topic.example);assert.ok(!/\p{Script=Han}/u.test(topic.example),topic.id);}
});
test('grammar navigation renders all units, changes language and yields to listening',()=>{
 const fs=require('node:fs'),vm=require('node:vm'),i18n=require('../japanese/i18n.js');
 function element(){return {children:[],dataset:{},events:{},value:'',hidden:true,open:false,append(...items){this.children.push(...items);},replaceChildren(...items){this.children=items;this.value=items[0]?.value||'';},setAttribute(k,v){this[k]=v;},addEventListener(k,f){this.events[k]=f;},querySelectorAll(){return this.children.filter(c=>c.open);},pause(){this.paused=true;}};}
 const nodes=new Map();const $=id=>{if(!nodes.has(id))nodes.set(id,element());return nodes.get(id);};
 const classes=new Set();const document={createElement:element,querySelector:()=>({classList:{toggle:(name,on)=>on?classes.add(name):classes.delete(name)}})};
 const context=vm.createContext({$,document,lang:'en',lessons:require('../japanese/vocabulary.js').lessons,JapaneseGrammar:require('../japanese/grammar.js'),JapaneseListeningExtra:require('../japanese/listening-extra.js'),JapaneseListeningMore:require('../japanese/listening-more.js'),Option:function(text,value){this.text=text;this.value=value;},encodeURIComponent,paintFolders:()=>{}});
 context.t=(key,values)=>i18n.t(context.lang,key,values);
 const source=fs.readFileSync('japanese/app.js','utf8');vm.runInContext(source.slice(source.indexOf('  let listeningActive=false;'),source.indexOf('  const verbMode=')),context);
 $('grammar-tab').events.click();assert.equal($('grammar-panel').hidden,false);assert.ok(classes.has('grammar-view'));assert.equal($('grammar-lessons').children.length,8);assert.equal($('grammar-topics').children.length,3);
 $('grammar-lessons').children[7].events.click();assert.equal($('grammar-topics').children.length,8);assert.match($('grammar-source').textContent,/190/);
 $('grammar-topics').children[0].open=false;$('grammar-topics').children[2].open=true;
 context.lang='zh';vm.runInContext('paintGrammar()',context);assert.match($('grammar-topics').children[2].children[0].textContent,/表达想法/);assert.equal($('grammar-topics').children[2].open,true);assert.equal($('grammar-topics').children[0].open,false);
 $('listening-tab').events.click();assert.equal($('grammar-panel').hidden,true);assert.ok(!classes.has('grammar-view'));assert.ok(classes.has('listening-view'));
});
