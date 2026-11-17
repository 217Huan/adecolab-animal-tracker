const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const output=path.join(root,'dist');
const files=['index.html','japanese.html','_redirects','japanese/style.css','japanese/vocabulary.js','japanese/core.js','japanese/i18n.js','japanese/favorites.js','japanese/config.js','japanese/app.js','japanese/navigation-language.js'];
fs.mkdirSync(output,{recursive:true});
for(const file of files){const target=path.join(output,file);fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(path.join(root,file),target);}
console.log(`Prepared ${files.length} website assets in dist/`);
