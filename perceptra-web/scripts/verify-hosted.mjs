import {readFileSync} from 'node:fs';
import {randomUUID} from 'node:crypto';
import {PrismaClient} from '@prisma/client';
import assert from 'node:assert/strict';
const db=new PrismaClient(),base='https://perceptra-phi.vercel.app';
const qa=JSON.parse(readFileSync('.runtime/cloud-qa.json','utf8'));
const secrets=JSON.parse(readFileSync('.env.cloud-secrets.json','utf8'));
const id='cloud-acceptance-'+randomUUID(),deliveries=[randomUUID(),randomUUID()];let checks=0;
async function api(path,options={},status=200){const r=await fetch(base+path,{...options,signal:AbortSignal.timeout(30000)});assert.equal(r.status,status,path);checks++;return r}
try{
 const headers={origin:base,'content-type':'application/json'};
 await api('/api/cameras',{},401);await api('/api/internal/sync',{method:'POST',headers,body:'{}'},401);
 const login=await api('/api/auth/login',{method:'POST',headers,body:JSON.stringify(qa)});
 const auth={...headers,cookie:login.headers.get('set-cookie').split(';')[0]};
 const camera=await(await api('/api/cameras',{headers:auth})).json();assert.equal(camera.transport,'livekit');assert.equal(camera.health.capture,'online');assert.equal(camera.health.backend,'connected');
 await api('/api/cameras/camera-01',{method:'PATCH',headers:auth,body:JSON.stringify({loiterSeconds:20})},403);
 const token=await(await api('/api/cameras/camera-01/media-token',{method:'POST',headers:auth})).json();const grant=JSON.parse(Buffer.from(token.token.split('.')[1],'base64url')).video;assert.equal(grant.canPublish,false);assert.equal(grant.canSubscribe,true);
 await api('/api/cameras/camera-01/media-token',{method:'POST',headers:{...auth,origin:'https://untrusted.invalid'}},403);
 const now=new Date().toISOString();const payload={id,deliveryId:deliveries[0],trackId:id,cameraId:'camera-01',severity:'medium',firstSeen:now,lastSeen:now,reason:'Disposable cloud acceptance test; not a real rule violation',metadata:{test:true}};
 const service={...headers,authorization:'Bearer '+secrets.SERVICE_TOKEN};
 await api('/api/internal/incidents',{method:'POST',headers:service,body:JSON.stringify(payload)});
 await api('/api/internal/incidents',{method:'POST',headers:service,body:JSON.stringify(payload)});assert.equal(await db.incident.count({where:{id}}),1);
 await api('/api/internal/incidents',{method:'POST',headers:service,body:JSON.stringify({...payload,deliveryId:deliveries[1],severity:'high',lastSeen:new Date(Date.now()+1000).toISOString()})});
 await api('/api/incidents/'+id+'/acknowledge',{method:'POST',headers:auth});
 await api('/api/incidents/'+id+'/resolve',{method:'POST',headers:auth,body:JSON.stringify({outcome:'FALSE_ALARM',note:'Disposable hosted verification completed'})});
 const incident=await db.incident.findUnique({where:{id},include:{activities:true}});assert.equal(incident.severity,'high');assert.equal(incident.status,'FALSE_ALARM');assert.equal(incident.acknowledgedBy,qa.id);assert.equal(incident.activities.length,4);
 const reports=await(await api('/api/reports',{headers:auth})).json();assert.ok(reports.total>=1);
 assert.ok((await(await api('/api/reports/export',{headers:auth})).text()).includes(id));
 await api('/api/cron/retention',{},401);
 console.log('PASS '+checks+' hosted HTTP checks: cloud login, camera heartbeat, read-only video grant, origin/role protection, durable idempotent incidents, escalation, acknowledgement, resolution, reports, CSV, cron protection.');
}finally{await db.incident.deleteMany({where:{id}});await db.delivery.deleteMany({where:{id:{in:deliveries}}});await db.$disconnect()}
