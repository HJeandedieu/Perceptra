import type {PrismaClient} from '@prisma/client';export function sweep(db:PrismaClient,now?:Date):Promise<{count:number}>;
