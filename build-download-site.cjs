'use strict';
const fs=require('node:fs/promises');
const path=require('node:path');
const {desktopConfiguration}=require('../src/distribution.cjs');
async function main(){
  const config=desktopConfiguration({mode:'online',origin:process.env.HYLIX_PUBLIC_ORIGIN,repository:process.env.HYLIX_RELEASE_REPOSITORY});
  const root=path.resolve(__dirname,'../download-site');
  const output=path.join(root,'dist');
  await fs.mkdir(output,{recursive:true});
  const html=(await fs.readFile(path.join(root,'index.html'),'utf8'))
    .replaceAll('{{DOWNLOAD_URL}}',`https://github.com/${config.repository}/releases/latest/download/Hylix-Windows-x64.exe`)
    .replaceAll('{{RELEASES_URL}}',config.releases);
  await fs.writeFile(path.join(output,'index.html'),html);
  await fs.copyFile(path.resolve(__dirname,'../assets/icon.png'),path.join(output,'logo.png'));
  for(const name of ['style.css','_headers'])await fs.copyFile(path.join(root,name),path.join(output,name));
  console.log('Built the static Cloudflare Pages download website.');
}
main().catch(error=>{console.error(error.message);process.exitCode=1;});
