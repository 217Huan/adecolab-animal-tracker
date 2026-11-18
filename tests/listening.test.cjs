const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
test('listening playback, speed, subtitles, errors and navigation preserve study view',async()=>{
 const elements=new Map();
 function $(id){if(!elements.has(id))elements.set(id,{value:id==='listening-speed'?'1':'',hidden:true,checked:false,textContent:'',events:{},setAttribute(k,v){this[k]=v;},replaceChildren(...options){this.options=options;this.value=options[0]?.value||'';},addEventListener(k,f){this.events[k]=f;},pause(){this.paused=true;},play(){this.paused=false;return Promise.resolve();}});return elements.get(id);}
 const classes=new Set(),document={querySelector:()=>({classList:{toggle:(name,on)=>on?classes.add(name):classes.delete(name)}})};
 const context=vm.createContext({$,document,lang:'en',Option:function(text,value){this.text=text;this.value=value;},encodeURIComponent,paintFolders:()=>{}});
 const source=fs.readFileSync('japanese/app.js','utf8');vm.runInContext(source.slice(source.indexOf('  let listeningActive=false;'),source.indexOf('  const verbMode=')),context);
 vm.runInContext('paintListening();loadListening();',context);
 assert.match($('listening-audio').src,/03-07/);
 $('listening-tab').events.click();assert.equal($('listening-panel').hidden,false);assert.ok(classes.has('listening-view'));
 $('listening-speed').value='.75';$('listening-speed').events.change();assert.equal($('listening-audio').playbackRate,.75);
 $('listening-clip').value='1';$('listening-clip').events.change();assert.match($('listening-audio').src,/04-08/);assert.match($('listening-ja').textContent,/にじゅうごさい/);assert.equal($('listening-audio').playbackRate,.75);
 $('listening-subtitles').checked=true;$('listening-subtitles').events.change();assert.equal($('listening-transcript').hidden,false);
 $('listening-audio').events.error();assert.equal($('listening-error').hidden,false);
 $('listening-replay').events.click();assert.equal($('listening-audio').currentTime,0);
 vm.runInContext('showListening(false)',context);assert.equal($('listening-panel').hidden,true);assert.equal($('listening-audio').paused,true);assert.ok(!classes.has('listening-view'));
});
