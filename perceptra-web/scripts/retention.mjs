import {PrismaClient} from '@prisma/client';import {sweep} from '../lib/retention.mjs';
const db=new PrismaClient();try{const result=await sweep(db);console.log('Removed '+result.count+' expired closed incidents.')}finally{await db.$disconnect()}
