import net from 'node:net';import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import {spawnSync} from 'node:child_process';
const bin='C:/Program Files/PostgreSQL/18/bin';const runtime=path.resolve('.runtime');const data=path.join(runtime,'postgres');fs.mkdirSync(runtime,{recursive:true});
function run(exe,args,env=process.env){const r=spawnSync(path.join(bin,exe+'.exe'),args,{env,encoding:'utf8',windowsHide:true,stdio:exe==='pg_ctl'?'ignore':'pipe'});if(r.status!==0)throw Error(exe+' failed: '+(r.stderr||r.stdout));console.log(exe+' completed')}
if(fs.existsSync(path.join(data,'PG_VERSION')))throw Error('Local cluster already exists; refusing to reinitialize.');
const config=fs.readFileSync('.env.local','utf8');if(!config.includes('configure_password'))throw Error('DATABASE_URL already configured; refusing to replace it.');
const port=await new Promise((resolve,reject)=>{const server=net.createServer();server.once('error',reject);server.listen(0,'127.0.0.1',()=>{const port=server.address().port;server.close(()=>resolve(port))})});
const password=crypto.randomBytes(32).toString('hex');
fs.writeFileSync('.env.local',config.replace(/^DATABASE_URL=.*$/m,'DATABASE_URL="postgresql://perceptra:'+password+'@127.0.0.1:'+port+'/perceptra_db?connect_timeout=3"')); const pw=path.join(runtime,'db-password.tmp');fs.writeFileSync(pw,password,{mode:0o600});
try{run('initdb',['-D',data,'-U','perceptra','--auth=scram-sha-256','--encoding=UTF8','--locale=C','--pwfile='+pw])}finally{fs.unlinkSync(pw)}
run('pg_ctl',['-D',data,'-l',path.join(runtime,'postgres.log'),'-o','-p '+port+' -h 127.0.0.1','-w','start']);
run('createdb',['-h','127.0.0.1','-p',String(port),'-U','perceptra','perceptra_db'],{...process.env,PGPASSWORD:password});

console.log('Isolated PostgreSQL ready on an available loopback port. Credentials saved only in ignored .env.local.');
