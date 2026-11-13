import fs from 'node:fs';
import {spawn} from 'node:child_process';
import {randomUUID} from 'node:crypto';
import {PrismaClient} from '@prisma/client';

const seconds=Number(process.argv[2]||7200);
if(!Number.isInteger(seconds)||seconds<30||seconds>14400||seconds%5!==0)throw Error('Duration must be a multiple of five between 30 and 14400 seconds');
fs.mkdirSync('.runtime',{recursive:true});
const lockPath='.runtime/soak.lock';
const runId=randomUUID();
let lock;
try{lock=fs.openSync(lockPath,'wx')}catch{throw Error('A soak lock exists. Verify no other soak is running before removing .runtime/soak.lock.')}
fs.writeFileSync(lock,JSON.stringify({pid:process.pid,runId}));fs.closeSync(lock);
const startedAt=new Date().toISOString();
const status={runId,status:'starting',durationSeconds:seconds,startedAt};
const writeStatus=extra=>fs.writeFileSync('.runtime/soak-status.json',JSON.stringify({...status,...extra},null,2));
writeStatus({});
if(fs.existsSync('.runtime/soak-result.json')){
  fs.copyFileSync('.runtime/soak-result.json','.runtime/soak-previous-result.json');
  fs.unlinkSync('.runtime/soak-result.json');
}
fs.writeFileSync('.runtime/resource-sample.json','[]');
const db=new PrismaClient();let original,child,result,failure;let interrupted=false;
const interrupt=()=>{interrupted=true;child?.kill()};
process.once('SIGINT',interrupt);process.once('SIGTERM',interrupt);
try{
  original=await db.camera.findUniqueOrThrow({where:{id:'camera-01'}});
  fs.writeFileSync('.runtime/soak-original-settings.json',JSON.stringify({monitoring:original.monitoring,loiterSeconds:original.loiterSeconds,zone:original.zone}));
  await db.camera.update({where:{id:'camera-01'},data:{monitoring:true,loiterSeconds:600,version:{increment:1}}});
  let ready=false;
  for(let i=0;i<30;i++){
    if(interrupted)throw Error('Sample interrupted');
    const response=await fetch('http://127.0.0.1:8080/health',{headers:{Authorization:'Bearer '+process.env.SERVICE_TOKEN},signal:AbortSignal.timeout(3000)});
    const health=await response.json();
    if(health.capture==='online'&&health.inference==='online'&&health.monitoring&&health.torchThreads===2){ready=true;break}
    await new Promise(r=>setTimeout(r,1000));
  }
  if(!ready)throw Error('Worker not ready with the expected thread limit');
  if(interrupted)throw Error('Sample interrupted');
  const samplingStartedAt=new Date().toISOString();
  writeStatus({status:'running',samplingStartedAt,expectedEnd:new Date(Date.now()+seconds*1000).toISOString()});
  console.log('AI-enabled sample started for '+seconds+' seconds with verified CPU thread limits.');
  child=spawn('../perceptra-ai-service/.venv/Scripts/python.exe',['resource_probe.py',String(seconds)],{cwd:'../perceptra-ai-service',env:process.env,stdio:['ignore','pipe','pipe'],windowsHide:true});
  child.stdout.on('data',d=>process.stdout.write(d));child.stderr.on('data',d=>process.stderr.write(d));
  const code=await new Promise((resolve,reject)=>{child.on('error',reject);child.on('exit',resolve)});
  if(code!==0)throw Error('Resource probe interrupted or failed');
  const samples=JSON.parse(fs.readFileSync('.runtime/resource-sample.json'));
  if(samples.length!==Math.floor(seconds/5))throw Error('Incomplete sample count');
  const max=name=>Math.max(...samples.map(s=>s.processes[name].rssMB));
  result={runId,durationSeconds:seconds,samplingStartedAt,completedAt:new Date().toISOString(),samples:samples.length,allCaptureOnline:samples.every(s=>s.health?.capture==='online'),allInferenceOnline:samples.every(s=>s.health?.inference==='online'),maxPending:Math.max(...samples.map(s=>s.health?.pending||0)),threadLimitMaintained:samples.every(s=>s.health?.torchThreads===2),maxRssMB:{web:max('web'),worker:max('worker')},maxWorkerCpuPercentOfMachine:Math.max(...samples.map(s=>s.processes.worker.cpuPercent/(s.logicalCpus||12)))};
  result.actualDurationSeconds=Math.round((Date.now()-Date.parse(samplingStartedAt))/1000);
  result.allBackendConnected=samples.every(sample=>sample.health?.backend==='connected');
  result.noWorkerErrors=samples.every(sample=>!sample.healthError&&!sample.health?.error);
  result.finalPending=samples.at(-1)?.health?.pending;
  if(result.finalPending!==0)throw Error('Deliveries remain pending at test completion');
  if(!result.allCaptureOnline||!result.allInferenceOnline||!result.threadLimitMaintained)throw Error('A health or thread-limit check failed');
}catch(error){failure=error.message;process.exitCode=1}
finally{
  if(child&&child.exitCode===null)child.kill();
  let settingsRestored=false;
  try{if(original){await db.camera.update({where:{id:'camera-01'},data:{monitoring:original.monitoring,loiterSeconds:original.loiterSeconds,zone:original.zone,version:{increment:1}}});settingsRestored=true}}
  catch{failure=(failure?failure+'; ':'')+'Camera settings restoration failed';process.exitCode=1}
  await db.$disconnect();
  const final={...result,runId,durationSeconds:seconds,settingsRestored,status:failure?'failed':'completed',error:failure||null,finishedAt:new Date().toISOString()};
  fs.writeFileSync('.runtime/soak-result.json',JSON.stringify(final,null,2));writeStatus(final);
  fs.unlinkSync(lockPath);
  console.log(JSON.stringify(final));
}
