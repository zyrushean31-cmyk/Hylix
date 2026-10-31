"use strict";
const fs=require('node:fs/promises');
const path=require('node:path');
const {DatabaseSync}=require('node:sqlite');
const {parseEnv}=require('node:util');
const root=path.resolve(__dirname,'../../hylix');
const desktop=path.resolve(__dirname,'..');
async function main(){
 const source=path.join(root,'.next-desktop/standalone');
 const target=path.join(desktop,'bundle/server');
 await fs.access(path.join(source,'server.js'));
 const resolved=path.resolve(target);if(resolved!==path.resolve(desktop,'bundle/server'))throw Error('Invalid staging path');
 const refresh=process.argv.includes('--refresh');
 if(refresh){const old=JSON.parse(await fs.readFile(path.join(target,'package.json'),'utf8'));const current=JSON.parse(await fs.readFile(path.join(root,'package.json'),'utf8'));if(JSON.stringify(old.dependencies)!==JSON.stringify(current.dependencies))throw Error('Dependencies changed; perform a full server package build.');for(const name of ['server','static']){const cleanup=path.resolve(target,'.next-desktop',name);if(!cleanup.startsWith(path.resolve(target)+path.sep))throw Error('Invalid generated output');await fs.rm(cleanup,{recursive:true,force:true});}}else await fs.rm(resolved,{recursive:true,force:true});
 await fs.mkdir(target,{recursive:true});
 const excluded=(name)=>/^\.env(?:\.|$)/.test(name)||/\.(db|sqlite|sqlite3)(?:-|$)/i.test(name)||/\.(log|pem|pfx|key)$/i.test(name)||name==='cache'||name==='.git'||name==='.private';
 await fs.cp(source,target,{recursive:true,dereference:true,filter:(file)=>{const parts=path.relative(source,file).split(path.sep);return (!refresh||!parts.includes('node_modules'))&&(!parts[0]||['server.js','package.json','.next-desktop','node_modules'].includes(parts[0]))&&!parts.some(excluded);}});
 await fs.cp(path.join(root,'.next-desktop/static'),path.join(target,'.next-desktop/static'),{recursive:true});
 if(!refresh) await require('./copy-runtime-deps.cjs')(root,target);
 await fs.cp(path.join(root,'public'),path.join(target,'public'),{recursive:true});
 await fs.copyFile(path.join(root,'PLUGIN-LICENSES.md'),path.join(target,'PLUGIN-LICENSES.md'));
 // Build a new database from schema + public catalog tables, never from a private DB copy.
 const env=parseEnv(await fs.readFile(path.join(root,'.env'),'utf8'));
 const original=new DatabaseSync(path.resolve(root,'prisma',env.DATABASE_URL.slice(5)),{readOnly:true});
 const seedPath=path.join(target,'catalog.db');
 try { await fs.unlink(seedPath); } catch(error){if(error.code!=='ENOENT')throw error;}
 const seed=new DatabaseSync(seedPath);
 for(const entry of (await fs.readdir(path.join(root,'prisma/migrations'),{withFileTypes:true})).filter(x=>x.isDirectory()).sort((a,b)=>a.name.localeCompare(b.name))) seed.exec(await fs.readFile(path.join(root,'prisma/migrations',entry.name,'migration.sql'),'utf8'));
 const tables=['Movie','MovieCertification','MovieExternalId','MovieMetadataSource','MovieCollection','CollectionMovie','AppSettings'];
 const ids=new Set(original.prepare("SELECT id FROM Movie WHERE status='PUBLISHED'").all().map(x=>x.id));
 for(const table of tables){
   for(const row of original.prepare('SELECT * FROM "'+table+'"').all()){
     if(table==='Movie'&&!ids.has(row.id))continue;
     if('movieId' in row&&!ids.has(row.movieId))continue;
     if(table==='MovieMetadataSource'&&!['TMDB','HYLIX_ARTWORK','HYLIX_BADGE'].includes(row.provider))continue;
     if(table==='Movie') row.status='DRAFT';
     const cols=Object.keys(row);
     seed.prepare('INSERT INTO "'+table+'" ('+cols.map(x=>'"'+x+'"').join(',')+') VALUES ('+cols.map(()=>'?').join(',')+')').run(...Object.values(row));
   }
 }
 for(const id of ids){ seed.prepare("INSERT INTO MovieEditorialReview (id,movieId,actorId,fromStatus,toStatus,note,createdAt) VALUES (?,?,'catalog-import','DRAFT','APPROVED','Imported published Hylix catalog',?)").run('desktop-import-'+id,id,Date.now()); seed.prepare("UPDATE Movie SET status='PUBLISHED' WHERE id=?").run(id); }
 for(const name of ['User','Session','ViewerAccount','ViewerProfile','ViewerIdentity','ViewerSession','ViewerOAuthAttempt','AuditLog'])if(seed.prepare('SELECT count(*) AS n FROM "'+name+'"').get().n!==0)throw Error('Private data in catalog template');
 seed.close();original.close();
 // Reject credential/config files and non-relocatable links anywhere in the installer input.
 let files=0,bytes=0;
 async function verify(dir){for(const item of await fs.readdir(dir,{withFileTypes:true})){const file=path.join(dir,item.name);if(item.isSymbolicLink())throw Error('Bundle has a link: '+item.name);if(item.isDirectory())await verify(file);else{if(excluded(item.name)&&file!==seedPath)throw Error('Excluded file in bundle: '+item.name);files++;bytes+=(await fs.stat(file)).size;}}}
 await verify(target);
 console.log(JSON.stringify({files,bytes,publicMovies:ids.size,privateAccounts:0}));
}
main().catch(error=>{console.error(error.message);process.exit(1)});
