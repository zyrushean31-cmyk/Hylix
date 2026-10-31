'use strict';
const fs=require('node:fs/promises');
const path=require('node:path');
const crypto=require('node:crypto');
async function main(){
  const root=path.resolve(__dirname,'../dist-public');
  const version=require('../package.json').version;
  const filename=`Hylix-Setup-${version}-Windows-x64.exe`;
  await fs.copyFile(path.join(root,filename),path.join(root,'Hylix-Windows-x64.exe'));
  await fs.access(path.join(root,'latest.yml'));
  const lines=[];
  for(const name of (await fs.readdir(root)).filter(name=>/\.(exe|blockmap|yml)$/.test(name)).sort()){
    const hash=crypto.createHash('sha256').update(await fs.readFile(path.join(root,name))).digest('hex');
    lines.push(`${hash}  ${name}`);
  }
  await fs.writeFile(path.join(root,'SHA256SUMS.txt'),lines.join('\n')+'\n');
}
main().catch(error=>{console.error(error.message);process.exitCode=1;});
