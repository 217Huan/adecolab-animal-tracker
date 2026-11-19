const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
test('deployment packages only website runtime assets and resolves local links',()=>{
  const root=path.resolve(__dirname,'..');cp.execFileSync(process.execPath,[path.join(root,'scripts/build-static.cjs')]);
  const config=JSON.parse(fs.readFileSync(path.join(root,'wrangler.jsonc'),'utf8'));
  assert.equal(config.assets.directory,'./dist');
  function entries(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?entries(path.join(dir,e.name)):[path.join(dir,e.name)]);}
  const files=entries(path.join(root,'dist'));assert.equal(files.length,13);
  for(const file of files)assert.ok(/\.(html|css|js)$/.test(file)||path.basename(file)==='_redirects');
  assert.equal(fs.readFileSync(path.join(root,'dist/_redirects'),'utf8').trim(),'/ /index.html 200');
  for(const html of ['index.html','japanese.html']){
    const text=fs.readFileSync(path.join(root,'dist',html),'utf8');
    for(const [,link] of text.matchAll(/(?:src|href)="([^"]+)"/g))if(!link.startsWith('http')&&!link.startsWith('#'))assert.ok(fs.existsSync(path.join(root,'dist',link)),link);
  }
  const browserConfig=fs.readFileSync(path.join(root,'dist/japanese/config.js'),'utf8');assert.ok(browserConfig.includes('sb_publishable_'));assert.ok(!browserConfig.includes('sb_secret_'));
});
