'use strict';
const fs=require('node:fs/promises');const path=require('node:path');const {createRequire}=require('node:module');
module.exports=async function copyDependencies(source,target){
 const seen=new Map();
 async function locate(name,from){const req=createRequire(path.join(from,'package.json'));for(const candidate of req.resolve.paths(name)||[]){try{const file=path.join(candidate,name,'package.json');await fs.access(file);return await fs.realpath(path.dirname(file));}catch{}}throw Error('Missing runtime dependency '+name);}
 async function copy(name,real,parent){
  const meta=JSON.parse(await fs.readFile(path.join(real,'package.json'),'utf8'));const key=name+'@'+meta.version;
  if(seen.has(key))return;
  const dest=path.join(target,'node_modules',name);
  if([...seen.keys()].some(x=>x.startsWith(name+'@')))throw Error('Conflicting runtime dependency '+name);
  seen.set(key,dest);
  await fs.cp(real,dest,{recursive:true,dereference:true,filter:file=>{const relative=path.relative(real,file);return !relative.split(path.sep).some(part=>['node_modules','.git','test','tests','__tests__'].includes(part))&&!/\.(map|md)$/i.test(file);}});
  for(const dep of Object.keys({...meta.dependencies,...meta.optionalDependencies})){
   let resolved;try{resolved=await locate(dep,real);}catch(error){if(meta.optionalDependencies?.[dep])continue;throw error;}
   const info=JSON.parse(await fs.readFile(path.join(resolved,'package.json'),'utf8'));
   if(info.os&&!info.os.includes(process.platform))continue;
   if(info.cpu&&!info.cpu.includes(process.arch))continue;
   await copy(dep,resolved,dest);
  }
 }
 for(const name of ['next','react','react-dom','@prisma/client','quickjs-emscripten'])await copy(name,await locate(name,source),target);
 const prismaReal=await locate('@prisma/client',source);
 const generated=await locate('.prisma/client',prismaReal);
 await fs.cp(generated,path.join(target,'node_modules/.prisma/client'),{recursive:true,dereference:true});
 console.log('Relocatable production dependencies: '+seen.size);
};
