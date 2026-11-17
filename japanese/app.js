(()=>{
  'use strict';
  const {words,lessons}=JapaneseVocabulary;
  const {Session,selectWords,isCorrect}=JapaneseCore;
  const $=id=>document.getElementById(id);
  let lesson='all',session=null,flipped=false,checked=false,hiddenPrompt=false;
  let activeMode='cards',activeDirection='english',activePrompt='japanese';
  function selected(){return selectWords(words,lesson,$('pos').value,$('subtype').value);}
  function folderTitle(){return lesson==='all'?'全部单元':`第 ${lesson} 单元 · ${lessons[Number(lesson)-1]}`;}
  function textCell(row,value,ja=false){const cell=document.createElement('td');cell.textContent=value;if(ja)cell.lang='ja';row.append(cell);}
  function updateSelection(){
    const list=selected();
    $('count').textContent=`${list.length} 个词条`;
    $('list-count').textContent=`(${list.length})`;
    $('start').disabled=!list.length;
    $('direction-wrap').hidden=$('mode').value!=='cards';
    $('prompt-wrap').hidden=$('mode').value!=='spelling';
    // A settings change ends the old exercise, so grades can never use mixed filters.
    session=null;$('exercise').hidden=true;$('complete').hidden=true;
    $('welcome').hidden=!list.length;$('empty').hidden=!!list.length;
    $('deck-title').textContent=folderTitle();$('round').textContent='准备开始';
    $('position').textContent='等待开始';$('mastery').textContent='已掌握 0';$('progress').value=0;
    $('settings-note').textContent='选择文件夹和模式，然后开始。更改设置会重新开始本次练习。';
    $('word-list').replaceChildren();
    const fragment=document.createDocumentFragment();
    list.forEach(w=>{const row=document.createElement('tr');textCell(row,w.lesson);textCell(row,w.written,true);textCell(row,w.reading,true);textCell(row,w.english);textCell(row,w.type);fragment.append(row);});
    $('word-list').append(fragment);
  }
  function updateTypes(){
    const current=$('subtype').value;
    const types=[...new Set(selectWords(words,lesson,$('pos').value).map(w=>w.type))];
    $('subtype').replaceChildren(new Option('全部分类','all'),...types.map(t=>new Option(t,t)));
    if(types.includes(current))$('subtype').value=current;
    updateSelection();
  }
  ['all',1,2,3,4,5,6,7,8].forEach(value=>{
    const button=document.createElement('button');button.type='button';
    const title=document.createElement('span');title.textContent=value==='all'?'全部单元':`第 ${value} 单元`;
    const sub=document.createElement('small');sub.textContent=value==='all'?`8 个单元 · ${words.length} 个词条`:lessons[value-1];
    button.append(title,sub);button.classList.toggle('active',value==='all');button.setAttribute('aria-pressed',String(value==='all'));
    button.addEventListener('click',()=>{lesson=value;for(const sibling of $('folders').children){sibling.classList.remove('active');sibling.setAttribute('aria-pressed','false');}button.classList.add('active');button.setAttribute('aria-pressed','true');updateTypes();});
    $('folders').append(button);
  });
  function start(){
    const list=selected();if(!list.length)return;
    session=new Session(list);activeMode=$('mode').value;activeDirection=$('direction').value;activePrompt=$('prompt').value;
    $('settings-note').textContent='本次练习进行中。不会或写错的词会进入下一轮。';render();
  }
  function renderCard(){
    const w=session.current,showJapanese=(activeDirection==='japanese')!==flipped;
    $('card-label').textContent=showJapanese?'日本語':'ENGLISH';
    $('card-main').textContent=showJapanese?w.written:w.english;
    $('card-main').lang=showJapanese?'ja':'en';
    $('card-reading').textContent=showJapanese&&w.written!==w.reading?w.reading:'';
    $('flashcard').setAttribute('aria-label',`${showJapanese?'日语':'英文'}：${$('card-main').textContent}。点击翻面`);
  }
  function render(){
    $('welcome').hidden=true;$('complete').hidden=!session.done;$('exercise').hidden=session.done;
    $('progress').max=session.total;$('progress').value=session.mastered;
    $('mastery').textContent=`已掌握 ${session.mastered} / ${session.total}`;
    $('round').textContent=`第 ${session.round} 轮`;
    if(session.done){$('position').textContent='本次完成';$('complete-text').textContent=`${session.total} 个词条已全部通过，共练习 ${session.round} 轮。`;$('again').focus();return;}
    $('position').textContent=`本轮 ${session.index+1} / ${session.queue.length} · 待重练 ${session.missed.length}`;
    const w=session.current;flipped=false;checked=false;hiddenPrompt=false;
    $('word-meta').textContent=`第 ${w.lesson} 单元 · ${w.type}`;
    $('flashcard').hidden=activeMode!=='cards';$('card-actions').hidden=activeMode!=='cards';$('spelling').hidden=activeMode!=='spelling';
    if(activeMode==='cards'){renderCard();$('flashcard').focus();return;}
    $('prompt-label').textContent=activePrompt==='japanese'?'先看日语，再隐藏提示默写':'根据英文写出日语';
    $('spelling-word').textContent=activePrompt==='japanese'?w.written:w.english;
    $('spelling-word').lang=activePrompt==='japanese'?'ja':'en';
    $('spelling-meaning').textContent=activePrompt==='japanese'?w.english:'';
    $('hide-word').hidden=activePrompt!=='japanese';$('hide-word').textContent='隐藏日语提示';
    $('answer').value='';$('answer').disabled=false;$('check').disabled=false;
    $('feedback').textContent='';$('feedback').className='';$('next').hidden=true;
    if(activePrompt==='english')$('answer').focus();
  }
  function grade(known){if(!session||session.done)return;session.grade(known);render();}
  $('start').addEventListener('click',start);$('again').addEventListener('click',start);
  $('pos').addEventListener('change',updateTypes);
  ['subtype','mode','direction','prompt'].forEach(id=>$(id).addEventListener('change',updateSelection));
  $('flashcard').addEventListener('click',()=>{if(session&&!session.done){flipped=!flipped;renderCard();}});
  $('known').addEventListener('click',()=>grade(true));$('unknown').addEventListener('click',()=>grade(false));
  $('hide-word').addEventListener('click',()=>{hiddenPrompt=!hiddenPrompt;$('spelling-word').textContent=hiddenPrompt?'••••••':session.current.written;$('hide-word').textContent=hiddenPrompt?'显示日语提示':'隐藏日语提示';if(hiddenPrompt)$('answer').focus();});
  $('answer-form').addEventListener('submit',event=>{
    event.preventDefault();
    // Enter used to confirm a Japanese IME composition must not submit the answer.
    if(composing||!session||session.done||checked)return;
    if(!$('answer').value.trim()){$('feedback').textContent='请先输入日语答案。';$('answer').focus();return;}
    checked=true;const w=session.current,correct=isCorrect(w,$('answer').value);
    $('feedback').className=correct?'correct':'incorrect';
    $('feedback').textContent=correct?'✓ 正确！':`再记一次：${w.written}（${w.reading}） · ${w.english}。下一轮会再次出现。`;
    $('answer').disabled=true;$('check').disabled=true;$('next').hidden=false;
    // Keep the graded card visible until Next, avoiding skipped feedback.
    $('next').dataset.correct=String(correct);$('next').focus();
  });
  let composing=false;
  $('answer').addEventListener('compositionstart',()=>{composing=true;});
  $('answer').addEventListener('compositionend',()=>{setTimeout(()=>{composing=false;},0);});
  $('answer').addEventListener('keydown',event=>{if(event.key==='Enter'&&(event.isComposing||composing||event.keyCode===229))event.preventDefault();});
  $('next').addEventListener('click',()=>{if(checked)grade($('next').dataset.correct==='true');});
  updateTypes();
})();
