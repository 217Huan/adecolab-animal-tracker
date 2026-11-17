// Share the language preference with the original tracker's existing translation system.
(()=>{
  const key='adecolab.language';
  let preference;try{preference=localStorage.getItem(key);}catch{}
  if(!['zh','en'].includes(preference))preference=navigator.language.toLowerCase().startsWith('zh')?'zh':'en';
  lang=preference;applyLanguage();updateMetrics(tracks);
  const entry=document.getElementById('japaneseEntry');
  const paint=()=>{
    entry.textContent=lang==='en'?'Japanese study':'日语学习';
    document.getElementById('resumeAnalyzeBtn').title=lang==='en'?'Continue analysis from the paused position.':'从暂停处继续后续分析。';
    document.getElementById('relockBtn').title=lang==='en'?'Pause analysis first, then click the fish head to relock and reconnect the trajectory.':'请先暂停分析，再点击鱼头位置以重新定位并连接轨迹。';
  };paint();
  document.getElementById('langToggle').addEventListener('click',()=>{try{localStorage.setItem(key,lang);}catch{}paint();});
})();
