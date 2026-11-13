import {PrismaClient} from '@prisma/client';
const globalDb=globalThis as unknown as {prisma?:PrismaClient};
const connection=process.env.DATABASE_URL_POOLED||process.env.DATABASE_URL;
export const db=globalDb.prisma??new PrismaClient(connection?{datasources:{db:{url:connection}}}:undefined);
globalDb.prisma=db;
