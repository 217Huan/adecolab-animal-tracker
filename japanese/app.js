(()=>{
  'use strict';
  const {words,lessons}=JapaneseVocabulary,{Session,selectWords,isCorrect}=JapaneseCore;
  const {t:translate,typeName}=JapaneseI18n,favoritesAPI=JapaneseFavorites;
  const $=id=>document.getElementById(id),languageKey='adecolab.language';
  let storage;try{storage=localStorage;}catch{storage={getItem:()=>null,setItem:()=>{throw Error('Storage unavailable');}};}
  let lang;try{lang=storage.getItem(languageKey);}catch{}if(!['zh','en'].includes(lang))lang=navigator.language.toLowerCase().startsWith('zh')?'zh':'en';
  const t=(key,values)=>translate(lang,key,values);
  let studyTheme;try{studyTheme=storage.getItem('adecolab.studyTheme');}catch{}
  if(!['light','dark'].includes(studyTheme))studyTheme=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';
  function paintTheme(){document.documentElement.dataset.theme=studyTheme;$('study-theme').textContent=t(studyTheme==='dark'?'lightMode':'darkMode');$('study-theme').setAttribute('aria-label',t(studyTheme==='dark'?'lightMode':'darkMode'));}
  $('study-theme').addEventListener('click',()=>{studyTheme=studyTheme==='dark'?'light':'dark';try{storage.setItem('adecolab.studyTheme',studyTheme);}catch{}paintTheme();});

  const favorites=new favoritesAPI.FavoriteStore(storage,words.map(w=>w.id));
  let lesson='all',session=null,flipped=false,checked=false,hiddenPrompt=false,composing=false;
  let activeMode='cards',activeDirection='english',activePrompt='english',feedbackKey='',favoriteMessage='';
  let client=null,availability='notConfigured',accountMessage='',authBusy=false,recovery=false,authUserId=null,authGeneration=0;
  let cardAnimations=[],outgoingCard=null,gesture=null,suppressClick=false;
  const folderButtons=[],customGroups=[];
  let listeningActive=false;
  const listeningClips=[
  {
    "lesson": "03",
    "file": "X_[03-07]_kaiwa.mp3",
    "zh": "交流会：姓名与国籍 · 60秒",
    "en": "At a gathering: names and countries · 60s",
    "ja": "かねこ：こんにちは。かねこです。\nチャン・ハイ・ケマラ：こんにちは。\nかねこ：おなまえは？\nチャン：チャンです。\nハイ：わたしはハイです。\nケマラ：ケマラです。\nかねこ：えーと、チャンさん、ハイさん、ケマラさん……。ごしゅっしんは？\nチャン：ベトナムです。ハノイからきました。\nかねこ：そうですか。ハイさんは？ おくには？\nハイ：わたしもベトナムです。\nかねこ：ベトナムの、どちらからですか？\nハイ：フエです。\nかねこ：そうですか。ケマラさんも、ベトナムからですか？\nケマラ：いいえ。ベトナムじゃないです。わたしはカンボジアからきました。\nかねこ：そうですか。みなさんは、ともだちですか？\nケマラ：はい。おなじかいしゃです。",
    "translation": {
      "zh": "金子：你好，我是金子。\n三人：你好。\n金子：你们叫什么名字？\nTrang：我是Trang。\nHai：我是Hai。\nKhemera：我是Khemera。\n金子：嗯，Trang、Hai、Khemera……你们来自哪里？\nTrang：越南，来自河内。\n金子：这样啊。Hai呢？来自哪个国家？\nHai：我也来自越南。\n金子：越南的哪里？\nHai：顺化。\n金子：这样啊。Khemera也来自越南吗？\nKhemera：不是，我不是越南人。我来自柬埔寨。\n金子：这样啊。你们是朋友吗？\nKhemera：是的，我们在同一家公司。",
      "en": "Kaneko: Hello, I’m Kaneko.\nAll three: Hello.\nKaneko: Your names?\nTrang: Trang.\nHai: I’m Hai.\nKhemera: Khemera.\nKaneko: Um, Trang, Hai, Khemera… Where are you from?\nTrang: Vietnam. I came from Hanoi.\nKaneko: I see. Hai, your country?\nHai: I’m also from Vietnam.\nKaneko: Where in Vietnam?\nHai: Hue.\nKaneko: I see. Khemera, are you also from Vietnam?\nKhemera: No, not Vietnam. I came from Cambodia.\nKaneko: I see. Are you all friends?\nKhemera: Yes. Same company."
    }
  },
  {
    "lesson": "04",
    "file": "X_[04-08]_kaiwa.mp3",
    "zh": "拜访同事家：家人、年龄和住址 · 59秒",
    "en": "Visiting a coworker: family, age and home · 59s",
    "ja": "ミロ：ミロです。フィリピンからきました。よろしくおねがいします。\nうえだ：ミロさん、うちのかぞくです。つまとこども。それから、ちちです。\nうえだのつま・ちち：ミロさん、よろしく。\nミロ：あのう、おなまえは？\nこども：しんいちです。\nミロ：しんいち。なんさいですか？\nこども：……。\nうえだのつま：いくつですか？\nこども：よんさいです。\nミロ：よんさい。そうですか。\nうえだのちち：ミロさんは、なんさい？\nミロ：にじゅうごさいです。\nうえだのちち：そう。\nうえだのつま：どこにすんでいますか？\nミロ：あかばねです。\nうえだのつま：そうですか。ごかぞくは？\nミロ：かぞくは、フィリピンにすんでいます。\nうえだのつま：そうですか。",
    "translation": {
      "zh": "Miro：我是Miro，来自菲律宾。请多关照。\n上田：Miro，这是我的家人：妻子、孩子，还有父亲。\n妻子和父亲：Miro，请多关照。\nMiro：那个，你叫什么名字？\n孩子：伸一。\nMiro：伸一，你几岁？\n孩子：……\n妻子：你几岁啦？\n孩子：四岁。\nMiro：四岁啊。\n父亲：Miro，你几岁？\nMiro：二十五岁。\n父亲：这样啊。\n妻子：你住在哪里？\nMiro：赤羽。\n妻子：这样啊。你的家人呢？\nMiro：我的家人住在菲律宾。\n妻子：这样啊。",
      "en": "Miro: I’m Miro, from the Philippines. Nice to meet you.\nUeda: Miro, this is my family: my wife, child, and father.\nWife and father: Nice to meet you, Miro.\nMiro: Um, your name?\nChild: Shinichi.\nMiro: Shinichi. How old are you?\nChild: …\nWife: How old are you?\nChild: Four.\nMiro: Four, I see.\nFather: Miro, how old are you?\nMiro: Twenty-five.\nFather: I see.\nWife: Where do you live?\nMiro: Akabane.\nWife: I see. Your family?\nMiro: My family lives in the Philippines.\nWife: I see."
    }
  },
  {
    "lesson": "09",
    "file": "X_[09-03]_kiku1.mp3",
    "zh": "日常作息：起床、慢跑和睡觉 · 33秒",
    "en": "Daily routine: waking up, jogging and bedtime · 33s",
    "ja": "むらかみ：おはようございます。\nパウロ・やまかわ：おはようございます。\nむらかみ：パウロさんも、やまかわさんも、まいにち、はやいですね。パウロさん、あさ、なんじにおきますか？\nパウロ：ごじにおきます。\nやまかわ：ごじ！ はやいですね。\nパウロ：ええ。まいあさ、ジョギングをします。よるは、じゅうじはんにねます。\nむらかみ：そうですか。",
    "translation": {
      "zh": "村上：早上好。\nPaulo、山川：早上好。\n村上：Paulo和山川每天都很早啊。Paulo，你早上几点起床？\nPaulo：五点起床。\n山川：五点！真早啊。\nPaulo：是的。我每天早上慢跑。晚上十点半睡觉。\n村上：这样啊。",
      "en": "Murakami: Good morning.\nPaulo and Yamakawa: Good morning.\nMurakami: You’re both early every day. Paulo, what time do you get up?\nPaulo: At five.\nYamakawa: Five! That’s early.\nPaulo: Yes. I jog every morning. At night, I go to bed at ten thirty.\nMurakami: I see."
    }
  }
];
  function paintListening(){
    const value=$('listening-clip').value||'0';$('listening-clip').replaceChildren(...listeningClips.map((clip,i)=>new Option((i+1)+'. '+clip[lang],String(i))));$('listening-clip').value=value;
    const clip=listeningClips[Number(value)];$('listening-name').textContent=clip[lang];$('listening-ja').textContent=clip.ja;$('listening-translation').textContent=clip.translation[lang];$('listening-source').href='https://www.irodori.jpf.go.jp/starter/audio/lesson'+clip.lesson+'.html';$('listening-script-source').href='https://www.irodori.jpf.go.jp/assets/data/starter/pdf/X_L'+clip.lesson+'.pdf';
  }
  function loadListening(){const clip=listeningClips[Number($('listening-clip').value)||0];$('listening-audio').pause();$('listening-audio').src='https://www.irodori.jpf.go.jp/assets/data/starter/audio/'+clip.lesson+'/'+encodeURIComponent(clip.file);$('listening-audio').playbackRate=Number($('listening-speed').value);$('listening-error').hidden=true;paintListening();}
  function showListening(show){listeningActive=show;$('listening-panel').hidden=!show;document.querySelector('.workspace').classList.toggle('listening-view',show);$('listening-tab').setAttribute('aria-pressed',String(show));if(!show)$('listening-audio').pause();paintFolders();}
  $('listening-tab').addEventListener('click',()=>showListening(true));
  $('listening-clip').addEventListener('change',loadListening);
  $('listening-speed').addEventListener('change',()=>{$('listening-audio').playbackRate=Number($('listening-speed').value);});
  $('listening-audio').addEventListener('loadedmetadata',()=>{$('listening-audio').playbackRate=Number($('listening-speed').value);});
  $('listening-audio').addEventListener('error',()=>{$('listening-error').hidden=false;});
  $('listening-subtitles').addEventListener('change',()=>{$('listening-transcript').hidden=!$('listening-subtitles').checked;});
  $('listening-replay').addEventListener('click',()=>{const audio=$('listening-audio');audio.currentTime=0;audio.play().catch(()=>{$('listening-error').hidden=false;});});

  const verbMode=()=>['te','verbType'].includes($('mode').value);
  const selected=()=>($('use-groups').checked?JapaneseCore.combineGroups(words,customGroups):selectWords(words,lesson,verbMode()?'verb':$('pos').value,verbMode()?'all':$('subtype').value)).filter(w=>(!verbMode()||JapaneseCore.matchesVerbPractice(w,$('mode').value))&&(!$('only-favorites').checked||favorites.ids.has(w.id)));
  const folderTitle=()=>$('use-groups').checked?t('customTitle'):lesson==='all'?t('allLessons'):`${t('lesson',{n:lesson})} · ${lessons[Number(lesson)-1]}`;
  function textCell(row,value,ja=false){const cell=document.createElement('td');cell.textContent=value;if(ja)cell.lang='ja';row.append(cell);return cell;}
  function favoriteButton(button,w,short=false){const saved=favorites.ids.has(w.id);button.textContent=short?(saved?'★':'☆'):t(saved?'saved':'save');button.setAttribute('aria-pressed',String(saved));button.setAttribute('aria-label',t(saved?'removeLabel':'saveLabel',{word:w.kana}));button.disabled=favorites.loading||favorites.saving||favorites.loadFailed;}
  async function toggleFavorite(id){favoriteMessage='';try{await favorites.toggle(id);}catch{favoriteMessage='saveError';}$('favorite-message').textContent=favoriteMessage?t(favoriteMessage):'';}
  function paintList(){
    const list=selected();$('count').textContent=t('wordCount',{n:list.length});$('list-count').textContent=`(${list.length})`;
    $('favorite-count').textContent=favorites.ids.size;$('start').disabled=!list.length||(favorites.loading&&$('only-favorites').checked)||favorites.loadFailed;
    $('word-list').replaceChildren();const fragment=document.createDocumentFragment();
    list.forEach(w=>{const row=document.createElement('tr');textCell(row,w.lesson);textCell(row,w.kana,true);textCell(row,w.romaji);textCell(row,w.english);textCell(row,typeName(w.type,lang));const cell=textCell(row,'');const button=document.createElement('button');button.type='button';favoriteButton(button,w,true);button.addEventListener('click',()=>toggleFavorite(w.id));cell.append(button);fragment.append(row);});$('word-list').append(fragment);
    if(!session){$('welcome').hidden=!list.length;$('empty').hidden=!!list.length;}
    if(session&&!session.done)favoriteButton($('favorite-word'),session.current);
  }
  function resetSelection(){
    clearCardMotion();
    session=null;feedbackKey='';$('exercise').hidden=true;$('complete').hidden=true;
    $('direction-wrap').hidden=$('mode').value!=='cards';
    for(const id of ['pos','subtype'])$(id).closest('label').hidden=verbMode();
    paintGroups();paintList();paintStudy();
  }
  function paintGroups(){
    $('custom-groups').replaceChildren();customGroups.forEach((group,index)=>{const button=document.createElement('button');button.type='button';button.textContent=`${group.lesson==='all'?t('allLessons'):t('lesson',{n:group.lesson})} · ${group.pos==='all'?t('allTypes'):t(group.pos)} · ${group.type==='all'?t('allCategories'):typeName(group.type,lang)} ×`;button.setAttribute('aria-label',button.textContent+' · '+t('removeGroup'));button.addEventListener('click',()=>{customGroups.splice(index,1);resetSelection();});$('custom-groups').append(button);});
  }
  $('add-group').addEventListener('click',()=>{const group={lesson,pos:verbMode()?'verb':$('pos').value,type:verbMode()?'all':$('subtype').value};if(!customGroups.some(g=>JSON.stringify(g)===JSON.stringify(group)))customGroups.push(group);resetSelection();});
  $('use-groups').addEventListener('change',resetSelection);
  function updateTypes(reset=true){
    const current=$('subtype').value,types=[...new Set(selectWords(words,lesson,$('pos').value).map(w=>w.type))];
    $('subtype').replaceChildren(new Option(t('allCategories'),'all'),...types.map(type=>new Option(typeName(type,lang),type)));
    if(types.includes(current))$('subtype').value=current;if(reset)resetSelection();
  }
  ['all',1,2,3,4,5,6,7,8].forEach(value=>{
    const button=document.createElement('button');button.type='button';button.dataset.lesson=value;
    const title=document.createElement('span'),sub=document.createElement('small');button.append(title,sub);folderButtons.push({value,button,title,sub});
    button.addEventListener('click',()=>{showListening(false);lesson=value;paintFolders();updateTypes();});$('folders').append(button);
  });
  function paintFolders(){for(const {value,button,title,sub} of folderButtons){title.textContent=value==='all'?t('allLessons'):t('lesson',{n:value});sub.textContent=value==='all'?t('total',{n:words.length}):lessons[value-1];button.classList.toggle('active',!listeningActive&&lesson===value);button.setAttribute('aria-pressed',String(!listeningActive&&lesson===value));}}
  function paintStudy(){
    $('deck-title').textContent=folderTitle();$('settings-note').textContent=t(session?'running':'choose');
    $('round').textContent=session?t('round',{n:session.round}):t('ready');
    $('mastery').textContent=t('mastery',{n:session?.mastered||0,total:session?.total||selected().length});
    $('position').textContent=!session?t('waiting'):session.done?t('done'):t('position',{n:session.index+1,total:session.queue.length,missed:session.missed.length});
    $('progress').max=session?.total||1;$('progress').value=session?.mastered||0;
    if(!session)return;
    if(session.done){$('complete-text').textContent=t('completeText',{total:session.total,round:session.round});return;}
    const w=session.current;$('word-meta').textContent=`${t('lesson',{n:w.lesson})} · ${activeMode==='verbType'?'':typeName(w.type,lang)}`;
    const frontJapanese=activeDirection==='japanese';
    for(const [prefix,isJapanese] of [['card',frontJapanese],['card-back',!frontJapanese]]){
      $(`${prefix}-label`).textContent=isJapanese?'日本語':'ENGLISH';$(`${prefix}-main`).textContent=isJapanese?w.kana:w.english;$(`${prefix}-main`).lang=isJapanese?'ja':'en';$(`${prefix}-reading`).textContent=isJapanese?w.romaji:'';
    }
    $('flashcard').classList.toggle('is-flipped',flipped);$('flashcard').setAttribute('aria-pressed',String(flipped));
    $('flashcard').querySelector('.card-front').setAttribute('aria-hidden',String(flipped));$('flashcard').querySelector('.card-back').setAttribute('aria-hidden',String(!flipped));
    $('flashcard').setAttribute('aria-label',t('flipLabel',{text:(frontJapanese!==flipped)?`${w.kana}, ${w.romaji}`:w.english}));
    const onlyOne=session.queue.length-session.index<2;for(const id of ['previous-card','next-card'])$(id).disabled=onlyOne;
    $('prompt-label').textContent=t(activePrompt==='japanese'?'look':'fromEnglish');$('hide-word').textContent=t(hiddenPrompt?'show':'hide');
    $('spelling-word').textContent=activePrompt==='japanese'?(hiddenPrompt?'••••••':w.kana):w.english;$('spelling-word').lang=activePrompt==='japanese'?'ja':'en';$('spelling-meaning').textContent=activePrompt==='japanese'?w.english:'';
    $('feedback').textContent=feedbackKey?t(feedbackKey,{word:w.kana,reading:w.romaji,meaning:w.english}):'';
    if(['te','verbType'].includes(activeMode)){
      $('prompt-label').textContent=t(activeMode==='te'?'tePrompt':'typePrompt');$('spelling-word').textContent=w.kana;$('spelling-word').lang='ja';$('spelling-meaning').textContent=w.english;
      if(feedbackKey==='verbReview')$('feedback').textContent=t('verbReview',{word:activeMode==='te'?JapaneseCore.teForm(w):typeName(w.type,lang)});
    }
    paintAnswerPreview();favoriteButton($('favorite-word'),w);
  }
  function paintAnswerPreview(){
    const writing=!!session&&!session.done&&['spelling','te'].includes(activeMode);
    $('answer-preview').hidden=!writing;document.querySelector('.spelling-prompt').classList.toggle('is-writing',writing);
    if(!writing)return;
    const w=session.current,expected=activeMode==='te'?JapaneseCore.teForm(w):w.kana;
    const result=JapaneseCore.answerPreview($('answer').value,checked,feedbackKey==='correct',expected);
    $('preview-text').textContent=result.text;$('answer-preview').dataset.state=result.state;
    $('preview-label').textContent=t(result.state==='correction'?'correctAnswer':result.state==='correct'?'correct':'liveAnswer');
  }
  function renderNewWord(){
    $('flashcard').classList.add('is-resetting');
    $('welcome').hidden=true;$('empty').hidden=true;$('complete').hidden=!session.done;$('exercise').hidden=session.done;
    flipped=false;checked=false;hiddenPrompt=false;feedbackKey='';
    $('card-stage').hidden=activeMode!=='cards';$('card-navigation').hidden=activeMode!=='cards';$('card-actions').hidden=activeMode!=='cards';$('spelling').hidden=activeMode==='cards';$('answer-form').hidden=activeMode==='verbType';$('verb-choices').hidden=activeMode!=='verbType';document.querySelector('.input-note').hidden=activeMode==='verbType';document.querySelectorAll('[data-verb]').forEach(b=>{b.disabled=false;b.setAttribute('aria-pressed','false');});
    $('hide-word').hidden=activePrompt!=='japanese';$('answer').value='';$('answer').disabled=false;$('check').disabled=false;$('feedback').className='';$('next').hidden=true;
    paintStudy();void $('flashcard').offsetWidth;$('flashcard').classList.remove('is-resetting');
    if(session.done)$('again').focus({preventScroll:true});else if(activeMode==='cards')$('flashcard').focus({preventScroll:true});else if(activePrompt==='english')$('answer').focus({preventScroll:true});
  }
  function clearCardMotion(){for(const animation of cardAnimations)animation.cancel();cardAnimations=[];outgoingCard?.remove();outgoingCard=null;$('flashcard').style.transform='';}
  function changeCard(change,direction){
    clearCardMotion();const card=$('flashcard'),reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(activeMode==='cards'&&!reduce&&card.animate){outgoingCard=card.cloneNode(true);outgoingCard.removeAttribute('id');outgoingCard.querySelectorAll('[id]').forEach(el=>el.removeAttribute('id'));outgoingCard.classList.add('outgoing-card');outgoingCard.setAttribute('aria-hidden','true');outgoingCard.inert=true;outgoingCard.tabIndex=-1;$('card-stage').append(outgoingCard);}
    change();renderNewWord();
    if(!outgoingCard||session.done){clearCardMotion();return;}
    const old=outgoingCard,options={duration:240,easing:'cubic-bezier(0.23, 1, 0.32, 1)'};
    const exit=old.animate([{transform:'translateX(0)',opacity:1},{transform:`translateX(${-direction*18}%)`,opacity:0}],{...options,fill:'forwards'});
    const enter=card.animate([{transform:`translateX(${direction*18}%)`,opacity:0},{transform:'translateX(0)',opacity:1}],options);cardAnimations=[exit,enter];exit.finished.then(()=>{old.remove();if(outgoingCard===old)outgoingCard=null;}).catch(()=>{});
  }
  function start(){const list=selected();if(!list.length||$('start').disabled)return;clearCardMotion();session=new Session(list,Math.random,$('order').value==='random');activeMode=$('mode').value;activeDirection=$('direction').value;activePrompt='english';renderNewWord();}
  function grade(known){if(!session||session.done)return;changeCard(()=>session.grade(known),known?1:-1);}
  function navigateCard(direction){if(!session||session.done||activeMode!=='cards'||session.queue.length-session.index<2)return;changeCard(()=>session.navigate(direction),direction);}
  function paintAccount(){
    $('email').required=!recovery;$('password').autocomplete=recovery?'new-password':'current-password';
    $('account-status').textContent=favorites.loading?t('loading'):favorites.loadFailed?t('loadError'):favorites.user?t('signedIn',{email:favorites.user.email||''}):t('guest');
    $('account-availability').textContent=availability==='ready'?'':t(availability);
    $('account-form').hidden=!client||!!favorites.user&&!recovery;$('logout').hidden=!favorites.user;
    $('retry-sync').hidden=!favorites.loadFailed;$('update-password').hidden=!recovery;$('login').hidden=recovery;$('signup').hidden=recovery;$('forgot').hidden=recovery;
    for(const id of ['login','signup','forgot','update-password','logout','retry-sync'])$(id).disabled=authBusy||favorites.loading||favorites.saving;
    $('account-message').textContent=authBusy?t('working'):accountMessage?t(accountMessage):'';
  }
  function paintLanguage(){
    paintListening();document.documentElement.lang=lang==='zh'?'zh-CN':'en';document.title=t('pageTitle');paintTheme();
    document.querySelectorAll('[data-text]').forEach(el=>{el.textContent=t(el.dataset.text);});
    document.querySelectorAll('[data-label]').forEach(el=>{el.setAttribute('aria-label',t(el.dataset.label));});
    $('lesson-header').textContent=lang==='zh'?'单元':'Lesson';$('language').textContent=lang==='zh'?'English':'中文';$('language').setAttribute('aria-label',lang==='zh'?'Switch to English':'切换为中文');
    $('answer').placeholder=t('placeholder');$('folders').setAttribute('aria-label',t('folders'));$('progress').setAttribute('aria-label',t('progress'));paintFolders();paintGroups();updateTypes(false);paintList();paintStudy();paintAccount();$('favorite-message').textContent=favoriteMessage?t(favoriteMessage):'';
  }
  favorites.changed=()=>{paintList();paintStudy();paintAccount();};
  $('language').addEventListener('click',()=>{lang=lang==='zh'?'en':'zh';try{storage.setItem(languageKey,lang);}catch{}paintLanguage();});
  $('start').addEventListener('click',start);$('again').addEventListener('click',start);$('pos').addEventListener('change',()=>updateTypes());
  $('mode').addEventListener('change',()=>{if(verbMode()){$('pos').value='verb';$('subtype').value='all';updateTypes();}else resetSelection();});
  ['subtype','direction','order','only-favorites'].forEach(id=>$(id).addEventListener('change',resetSelection));
  $('favorite-word').addEventListener('click',()=>{if(session&&!session.done)toggleFavorite(session.current.id);});
  $('flashcard').addEventListener('click',()=>{if(suppressClick){suppressClick=false;return;}if(session&&!session.done){flipped=!flipped;paintStudy();}});
  $('previous-card').addEventListener('click',()=>navigateCard(-1));$('next-card').addEventListener('click',()=>navigateCard(1));
  $('flashcard').addEventListener('keydown',event=>{if(['ArrowLeft','ArrowRight'].includes(event.key)){event.preventDefault();navigateCard(event.key==='ArrowRight'?1:-1);}});
  $('flashcard').addEventListener('pointerdown',event=>{if(!event.isPrimary||event.button!==0||!session||session.done)return;suppressClick=false;clearCardMotion();gesture={id:event.pointerId,x:event.clientX,y:event.clientY,dx:0,dragging:false};});
  $('flashcard').addEventListener('pointermove',event=>{if(!gesture||gesture.id!==event.pointerId)return;const dx=event.clientX-gesture.x,dy=event.clientY-gesture.y;if(!gesture.dragging){if(Math.abs(dy)>Math.abs(dx)&&Math.abs(dy)>10){gesture=null;return;}if(Math.abs(dx)<10)return;gesture.dragging=true;$('flashcard').setPointerCapture(event.pointerId);}gesture.dx=dx;if(!matchMedia('(prefers-reduced-motion: reduce)').matches)$('flashcard').style.transform=`translateX(${dx*.65}px)`;});
  function endGesture(event,cancelled=false){if(!gesture||gesture.id!==event.pointerId)return;const {dx,dragging}=gesture;gesture=null;if($('flashcard').hasPointerCapture(event.pointerId))$('flashcard').releasePointerCapture(event.pointerId);if(!dragging)return;suppressClick=true;setTimeout(()=>{suppressClick=false;},0);$('flashcard').style.transform='';if(!cancelled&&Math.abs(dx)>=60)navigateCard(dx<0?1:-1);}
  $('flashcard').addEventListener('pointerup',event=>endGesture(event));$('flashcard').addEventListener('pointercancel',event=>endGesture(event,true));
  $('known').addEventListener('click',()=>grade(true));$('unknown').addEventListener('click',()=>grade(false));
  $('hide-word').addEventListener('click',()=>{hiddenPrompt=!hiddenPrompt;paintStudy();if(hiddenPrompt)$('answer').focus();});
  $('answer-form').addEventListener('submit',event=>{
    event.preventDefault();if(composing||!session||session.done||checked)return;
    if(!$('answer').value.trim()){feedbackKey='enterAnswer';paintStudy();$('answer').focus();return;}
    checked=true;const correct=activeMode==='te'?JapaneseCore.normalize($('answer').value)===JapaneseCore.teForm(session.current):isCorrect(session.current,$('answer').value);feedbackKey=correct?'correct':activeMode==='te'?'verbReview':'incorrect';$('feedback').className=correct?'correct':'incorrect';$('answer').disabled=true;$('check').disabled=true;$('next').hidden=false;$('next').dataset.correct=String(correct);paintStudy();$('next').focus({preventScroll:true});
  });
  $('answer').addEventListener('input',paintAnswerPreview);
  $('answer').addEventListener('compositionstart',()=>{composing=true;});$('answer').addEventListener('compositionend',()=>{paintAnswerPreview();setTimeout(()=>{composing=false;},0);});
  $('answer').addEventListener('keydown',event=>{if(event.key==='Enter'&&(event.isComposing||composing||event.keyCode===229))event.preventDefault();});
  document.querySelectorAll('[data-verb]').forEach(button=>button.addEventListener('click',()=>{if(!session||session.done||checked)return;checked=true;const correct=button.dataset.verb===session.current.type;feedbackKey=correct?'correct':'verbReview';$('feedback').className=correct?'correct':'incorrect';document.querySelectorAll('[data-verb]').forEach(b=>{b.disabled=true;b.setAttribute('aria-pressed',String(b===button));});$('next').dataset.correct=String(correct);$('next').hidden=false;paintStudy();$('next').focus({preventScroll:true});}));
  $('next').addEventListener('click',()=>{if(checked)grade($('next').dataset.correct==='true');});
  async function syncUser(user,force=false){
    if(!force&&authUserId===(user?.id||null))return;authUserId=user?.id||null;const generation=++authGeneration;
    if(accountMessage==='loadError')accountMessage='';
    resetSelection();favoriteMessage='';try{await favorites.switchUser(user);}catch{if(generation===authGeneration)accountMessage='loadError';}if(generation===authGeneration){resetSelection();paintAccount();}
  }
  async function accountAction(action){
    if(!client||authBusy)return;
    if(action!=='logout'){
      if(action!=='update'&&!$('email').reportValidity())return;
      if(['login','signup','update'].includes(action)&&!$('password').reportValidity())return;
    }
    authBusy=true;accountMessage='';paintAccount();
    const email=$('email').value.trim(),password=$('password').value;
    const redirect=new URL('japanese.html',location.href).href;
    try{
      let result;
      if(action==='login')result=await client.auth.signInWithPassword({email,password});
      if(action==='signup')result=await client.auth.signUp({email,password,options:{emailRedirectTo:redirect}});
      if(action==='reset')result=await client.auth.resetPasswordForEmail(email,{redirectTo:redirect});
      if(action==='update')result=await client.auth.updateUser({password});
      if(action==='logout')result=await client.auth.signOut();
      if(result.error)throw result.error;
      if(action==='signup')accountMessage='confirmEmail';
      if(action==='reset')accountMessage='resetSent';
      if(action==='update'){accountMessage='passwordUpdated';recovery=false;}
      if(action==='logout'){recovery=false;await syncUser(null);}
      else if(result.data?.session)await syncUser(result.data.session.user);
    }catch{accountMessage='authError';}finally{$('password').value='';authBusy=false;paintAccount();}
  }
  $('account-form').addEventListener('submit',event=>{event.preventDefault();accountAction(recovery?'update':'login');});
  $('signup').addEventListener('click',()=>accountAction('signup'));$('forgot').addEventListener('click',()=>accountAction('reset'));$('update-password').addEventListener('click',()=>accountAction('update'));$('logout').addEventListener('click',()=>accountAction('logout'));
  $('retry-sync').addEventListener('click',()=>syncUser(favorites.user,true));
  async function initializeAccount(){
    const config=window.JapaneseAccountConfig;if(!config?.supabaseUrl||!config?.publishableKey)return;
    availability='connecting';paintAccount();
    let subscription;
    try{
      const url=new URL(config.supabaseUrl);if(url.protocol!=='https:'||!config.publishableKey.startsWith('sb_publishable_'))throw Error('Invalid public configuration');
      const {createClient}=await import('https://esm.sh/@supabase/supabase-js@2.119.0');
      client=createClient(url.href,config.publishableKey);favorites.remote=favoritesAPI.remoteStore(client);availability='ready';
      subscription=client.auth.onAuthStateChange((event,session)=>{
        // Schedule SDK calls outside its auth event lock.
        if(event==='PASSWORD_RECOVERY'){recovery=true;accountMessage='recovery';$('password').autocomplete='new-password';}
        setTimeout(()=>{if(client)syncUser(session?.user||null).then(paintAccount);},0);
      }).data.subscription;
      const {data,error}=await client.auth.getSession();if(error)throw error;await syncUser(data.session?.user||null);paintAccount();
    }catch{subscription?.unsubscribe();client=null;await syncUser(null);availability='authUnavailable';paintAccount();}
  }
  paintLanguage();loadListening();initializeAccount();
})();
