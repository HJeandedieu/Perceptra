import {db} from './db';
export function camera(){return db.camera.upsert({where:{id:'camera-01'},create:{id:'camera-01'},update:{}})}
