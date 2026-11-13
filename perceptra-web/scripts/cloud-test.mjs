import {spawn} from 'node:child_process';
import {randomUUID,randomBytes} from 'node:crypto';
import {PrismaClient,Prisma} from '@prisma/client';
import bcrypt from 'bcryptjs';
import assert from 'node:assert/strict';
const db=new PrismaClient(),base='http://127.0.0.1:5004',id=randomUUID(),password=randomBytes(24).toString('hex');
let child,user,original,checks=0;
async function api(path,options={},status=200){const r=await fetch(base+path,options);assert.equal(r.status,status,path);checks++;return r}
try{
 original=await db.camera.findUnique({where:{id:'camera-01'}});
 user=await db.user.create({data:{name:'Cloud verification',email:id+'@local.invalid',password:await bcrypt.hash(password,12),role:'ADMIN'}});
 child=spawn(process.execPath,['node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','-p','5004'],{env:{...process.env,APP_ORIGIN:base,WORKER_CONNECTION:'outbound',STREAM_TRANSPORT:'livekit',LIVEKIT_URL:'wss://verification.invalid',LIVEKIT_API_KEY:'verification-key',LIVEKIT_API_SECRET:randomBytes(32).toString('hex'),LIVEKIT_ROOM:'verification'},stdio:'ignore'});
 for(let i=0;i<100;i++){try{if((await fetch(base+'/api/health')).ok)break}catch{}await new Promise(r=>setTimeout(r,200))}
 const headers={origin:base,'content-type':'application/json'};
 const login=await api('/api/auth/login',{method:'POST',headers,body:JSON.stringify({email:user.email,password})});
 const auth={...headers,cookie:login.headers.get('set-cookie').split(';')[0]},service={'content-type':'application/json',authorization:'Bearer '+process.env.SERVICE_TOKEN};
 await api('/api/cameras/camera-01/media-token',{method:'POST',headers},401);
 await api('/api/internal/sync',{method:'POST',headers,body:'{}'},401);
 await api('/api/internal/media-token',{method:'POST',headers:service,body:'{}'},409);
 const sync=await(await api('/api/internal/sync',{method:'POST',headers:service,body:JSON.stringify({cameraId:'camera-01',health:{capture:'online',inference:'unavailable',pending:0,appliedVersion:1}})})).json();assert.equal(sync.streamDemand,false);
 const health=await(await api('/api/cameras',{headers:auth})).json();assert.equal(health.transport,'livekit');assert.equal(health.health.capture,'online');
 const viewer=await(await api('/api/cameras/camera-01/media-token',{method:'POST',headers:auth})).json();
 const grant=JSON.parse(Buffer.from(viewer.token.split('.')[1],'base64url')).video;assert.equal(grant.canPublish,false);assert.equal(grant.canSubscribe,true);
 const publisher=await(await api('/api/internal/media-token',{method:'POST',headers:service,body:'{}'})).json();
 const publishGrant=JSON.parse(Buffer.from(publisher.token.split('.')[1],'base64url')).video;assert.equal(publishGrant.canPublish,true);assert.equal(publishGrant.canSubscribe,false);assert.deepEqual(publishGrant.canPublishSources,['camera']);
 await api('/api/cameras/camera-01/view',{method:'POST',headers:auth});
 await api('/api/cameras/camera-01/stream',{headers:auth},409);
 await db.camera.update({where:{id:'camera-01'},data:{lastHeartbeat:new Date(Date.now()-30000)}});
 assert.equal((await(await api('/api/cameras',{headers:auth})).json()).health.capture,'offline');
 await api('/api/cron/retention',{},401);
 console.log('PASS '+checks+' cloud-mode HTTP checks: auth, heartbeat staleness, viewing lease, scoped media tokens, MJPEG rejection, cron protection. No external video connection or webcam used.');
}finally{
 child?.kill();
 if(user)await db.user.delete({where:{id:user.id}});
 if(original)await db.camera.update({where:{id:'camera-01'},data:{health:original.health??Prisma.DbNull,lastHeartbeat:original.lastHeartbeat,viewerUntil:original.viewerUntil}});
 await db.$disconnect();
}
