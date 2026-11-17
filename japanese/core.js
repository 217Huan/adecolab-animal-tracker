(function(root){
  function shuffle(source,random=Math.random){
    const result=[...source];
    for(let i=result.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}
    return result;
  }
  function selectWords(words,lesson='all',pos='all',type='all'){
    return words.filter(w=>(lesson==='all'||w.lesson===Number(lesson))&&(pos==='all'||w.pos===pos)&&(type==='all'||w.type===type));
  }
  function normalize(text){return String(text).normalize('NFKC').replace(/[\s　]/gu,'').trim();}
  function isCorrect(word,answer){const value=normalize(answer);return !!value&&word.answers.some(a=>normalize(a)===value);}
  class Session{
    constructor(words,random=Math.random){this.random=random;this.total=words.length;this.queue=shuffle(words,random);this.missed=[];this.index=0;this.round=1;this.mastered=0;}
    get done(){return this.queue.length===0;}
    get current(){return this.queue[this.index];}
    navigate(direction){
      // Browse only ungraded cards; browsing never marks a word as mastered.
      const remaining=this.queue.slice(this.index);if(remaining.length<2)return;
      if(direction>0)remaining.push(remaining.shift());else remaining.unshift(remaining.pop());
      this.queue.splice(this.index,remaining.length,...remaining);
    }
    grade(known){
      if(this.done)throw new Error('Session is complete');
      if(known)this.mastered++;else this.missed.push(this.current);
      this.index++;
      if(this.index===this.queue.length){this.queue=shuffle(this.missed,this.random);this.missed=[];this.index=0;if(this.queue.length)this.round++;}
    }
  }
  const api={shuffle,selectWords,normalize,isCorrect,Session};
  if(typeof module!=='undefined')module.exports=api;else root.JapaneseCore=api;
})(typeof globalThis!=='undefined'?globalThis:this);
