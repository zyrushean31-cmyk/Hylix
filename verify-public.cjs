'use strict';
const fs=require('node:fs/promises');
const path=require('node:path');
module.exports=async context=>{
  const files=await fs.readdir(path.join(context.appOutDir,'resources'));
  if(files.some(file=>file==='server' || /(?:\.db|\.env)$/.test(file)))
    throw Error('The public app must not include a local database, server or private configuration');
  console.log('Verified online-only application resources.');
};
