const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
test('twenty additional recordings have unique sources, measured durations and aligned kana transcripts',()=>{
 const {clips}=require('../japanese/listening-extra.js');assert.equal(clips.length,20);assert.equal(new Set(clips.map(c=>c.file)).size,20);
 for(const clip of clips){
  assert.ok(clip.duration>=20&&clip.duration<=80,clip.file);assert.ok(clip.sourcePage>0);
  assert.ok(clip.file.startsWith('X_['+clip.lesson+'-'));
  assert.ok(!/\p{Script=Han}/u.test(clip.ja),clip.file);
  const turns=clip.ja.split('\n').length;assert.ok(turns>=3);
  assert.equal(clip.translation.zh.split('\n').length,turns,clip.file+' Chinese');
  assert.equal(clip.translation.en.split('\n').length,turns,clip.file+' English');
 }
});
test('listening playback, speed, subtitles, errors and navigation preserve study view',async()=>{
 const elements=new Map();
 function $(id){if(!elements.has(id))elements.set(id,{value:id==='listening-speed'?'1':'',hidden:true,checked:false,textContent:'',children:[],append(...items){this.children.push(...items);},events:{},setAttribute(k,v){this[k]=v;},replaceChildren(...options){this.children=options;this.options=options;this.value=options[0]?.value||'';},addEventListener(k,f){this.events[k]=f;},pause(){this.paused=true;},play(){this.paused=false;return Promise.resolve();}});return elements.get(id);}
 const classes=new Set(),document={createElement:()=>({children:[],append(...items){this.children.push(...items);}}),querySelector:()=>({classList:{toggle:(name,on)=>on?classes.add(name):classes.delete(name)}})};
 const context=vm.createContext({JapaneseListeningExtra:require('../japanese/listening-extra.js'),$,document,lang:'en',Option:function(text,value){this.text=text;this.value=value;},encodeURIComponent,paintFolders:()=>{}});
 const source=fs.readFileSync('japanese/app.js','utf8');vm.runInContext(source.slice(source.indexOf('  let listeningActive=false;'),source.indexOf('  const verbMode=')),context);
 vm.runInContext('paintListening();loadListening();',context);
 assert.equal($('listening-clip').options.length,23);assert.match($('listening-audio').src,/03-07/);
 for(let i=0;i<23;i++){$('listening-clip').value=String(i);$('listening-clip').events.change();const pairs=$('listening-transcript').children;assert.ok(pairs.length>=2);for(const pair of pairs){assert.equal(pair.children.length,2);assert.equal(pair.children[0].lang,'ja');assert.equal(pair.children[1].lang,'en');assert.ok(pair.children[1].textContent);}}
 $('listening-tab').events.click();assert.equal($('listening-panel').hidden,false);assert.ok(classes.has('listening-view'));
 $('listening-speed').value='.75';$('listening-speed').events.change();assert.equal($('listening-audio').playbackRate,.75);
 $('listening-clip').value='1';$('listening-clip').events.change();assert.match($('listening-audio').src,/04-08/);assert.match($('listening-transcript').children.map(pair=>pair.children[0].textContent).join('\n'),/にじゅうごさい/);assert.equal($('listening-audio').playbackRate,.75);
 $('listening-subtitles').checked=true;$('listening-subtitles').events.change();assert.equal($('listening-transcript').hidden,false);
 $('listening-audio').events.error();assert.equal($('listening-error').hidden,false);
 $('listening-replay').events.click();assert.equal($('listening-audio').currentTime,0);
 $('listening-clip').value='22';$('listening-clip').events.change();assert.match($('listening-audio').src,/12-17/);assert.match($('listening-transcript').children.map(pair=>pair.children[0].textContent).join('\n'),/こんばん/);assert.equal($('listening-audio').playbackRate,.75);
 context.lang='zh';vm.runInContext('paintListening()',context);assert.equal($('listening-transcript').children[0].children[1].lang,'zh-CN');assert.match($('listening-transcript').children[0].children[1].textContent,/洪/);
 vm.runInContext('showListening(false)',context);assert.equal($('listening-panel').hidden,true);assert.equal($('listening-audio').paused,true);assert.ok(!classes.has('listening-view'));
});
