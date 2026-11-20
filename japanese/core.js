(function(root){
  function shuffle(source,random=Math.random){
    const result=[...source];
    for(let i=result.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}
    return result;
  }
  function selectWords(words,lesson='all',pos='all',type='all'){
    return words.filter(w=>(lesson==='all'||w.lesson===Number(lesson))&&(pos==='all'||w.pos===pos)&&(type==='all'||w.type===type));
  }
  function combineGroups(words,groups){return words.filter(w=>groups.some(g=>(g.lesson==='all'||w.lesson===Number(g.lesson))&&(g.pos==='all'||w.pos===g.pos)&&(g.type==='all'||w.type===g.type)));}
  function normalize(text){return String(text).normalize('NFKC').replace(/[\s\p{P}]/gu,char=>char==='〜'?char:'');}
  function isCorrect(word,answer){const value=normalize(answer);return !!value&&word.answers.some(a=>normalize(a)===value);}
  function teForm(word){
    const v=word.kana;
    if(word.type==='不规则动词'){
      if(v.endsWith('する'))return v.slice(0,-2)+'して';
      if(v.endsWith('くる'))return v.slice(0,-2)+'きて';
    }
    if(word.type==='る动词')return v.slice(0,-1)+'て';
    if(word.type==='う动词'){
      if(v.endsWith('いく'))return v.slice(0,-2)+'いって';
      const endings={'う':'って','つ':'って','る':'って','む':'んで','ぶ':'んで','ぬ':'んで','く':'いて','ぐ':'いで','す':'して'};
      if(endings[v.slice(-1)])return v.slice(0,-1)+endings[v.slice(-1)];
    }
    return null;
  }
  function matchesVerbPractice(word,mode){return !!teForm(word)&&(mode!=='verbType'||word.kana.endsWith('る'));}
  function answerPreview(typed,checked,correct,expected){return {text:checked&&!correct?expected:(typed||'—'),state:checked?(correct?'correct':'correction'):'typing'};}
  class Session{
    constructor(words,random=Math.random,randomOrder=true){this.random=random;this.randomOrder=randomOrder;this.total=words.length;this.queue=randomOrder?shuffle(words,random):[...words];this.missed=[];this.reviewed=new Set();this.index=0;this.round=1;this.mastered=0;}
    get done(){return this.queue.length===0;}
    get current(){return this.queue[this.index];}
    get remaining(){return this.queue.length-this.reviewed.size;}
    navigate(direction){
      // Keep this round's order immutable. Only the cursor moves, skipping graded cards.
      if(this.remaining<1)return;
      const step=direction>0?1:-1;
      do{this.index=(this.index+step+this.queue.length)%this.queue.length;}while(this.reviewed.has(this.index));
    }
    grade(known){
      if(this.done)throw new Error('Session is complete');
      if(known)this.mastered++;else this.missed.push(this.current);
      this.reviewed.add(this.index);
      if(this.remaining===0){const missed=new Set(this.missed),next=this.queue.filter(word=>missed.has(word));this.queue=this.randomOrder?shuffle(next,this.random):next;this.missed=[];this.reviewed.clear();this.index=0;if(this.queue.length)this.round++;}
      else this.navigate(1);
    }
  }
  const api={shuffle,selectWords,combineGroups,normalize,isCorrect,teForm,matchesVerbPractice,answerPreview,Session};
  if(typeof module!=='undefined')module.exports=api;else root.JapaneseCore=api;
})(typeof globalThis!=='undefined'?globalThis:this);
