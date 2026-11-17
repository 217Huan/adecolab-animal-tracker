const {test}=require('node:test'),assert=require('node:assert/strict');
const {teForm}=require('../japanese/core.js');
const {words}=require('../japanese/vocabulary.js');
test('te forms cover all endings, irregular compounds and ambiguous ru endings',()=>{
 for(const [kana,type,answer] of [['いく','う动词','いって'],['もっていく','う动词','もっていって'],['およぐ','う动词','およいで'],['しぬ','う动词','しんで'],['のむ','う动词','のんで'],['あそぶ','う动词','あそんで'],['かく','う动词','かいて'],['はなす','う动词','はなして'],['まつ','う动词','まって'],['かう','う动词','かって'],['かえる','う动词','かえって'],['きる','う动词','きって'],['きる','る动词','きて'],['いる','う动词','いって'],['いる','る动词','いて'],['べんきょうする','不规则动词','べんきょうして'],['つれてくる','不规则动词','つれてきて']])assert.equal(teForm({kana,type}),answer);
 for(const w of words.filter(w=>['う动词','る动词','不规则动词'].includes(w.type)))assert.ok(teForm(w));
 assert.equal(teForm({kana:'しっています',type:'动词表达'}),null);
});
