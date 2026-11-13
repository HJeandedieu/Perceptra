import test from 'node:test';import assert from 'node:assert/strict';import {shouldAlert} from '../lib/notification-policy.mjs';
const incident={id:'one',severity:'medium',status:'NEW',activities:[{action:'CREATED'}]};
test('creation alerts once per severity',()=>{assert.ok(shouldAlert(incident,new Set()));assert.equal(shouldAlert(incident,new Set(['one:medium'])),false)});
test('acknowledgement does not create a new alert',()=>assert.equal(shouldAlert({...incident,status:'ACKNOWLEDGED',activities:[{action:'ACKNOWLEDGED'}]},new Set()),false));
test('escalation can alert even after acknowledgement',()=>assert.ok(shouldAlert({...incident,severity:'high',status:'ACKNOWLEDGED',activities:[{action:'ESCALATED'}]},new Set(['one:medium']))));
test('resolved incidents do not alert',()=>assert.equal(shouldAlert({...incident,status:'RESOLVED'},new Set()),false));
