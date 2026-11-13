import {PrismaClient} from '@prisma/client';
import bcrypt from 'bcryptjs';
import {createInterface} from 'node:readline/promises';
const db=new PrismaClient();const prompt=createInterface({input:process.stdin,output:process.stdout});
try{const email=(await prompt.question('Admin email: ')).trim().toLowerCase();const name=(await prompt.question('Admin name: ')).trim();const password=process.env.BOOTSTRAP_PASSWORD;if(!email.includes('@')||!name||!password||password.length<12)throw new Error('Provide a name, valid email, and BOOTSTRAP_PASSWORD of at least 12 characters.');if(await db.user.findUnique({where:{email}}))throw new Error('Account exists; refusing to overwrite.');await db.user.create({data:{name,email,password:await bcrypt.hash(password,12),role:'ADMIN'}});console.log('Admin created. Clear BOOTSTRAP_PASSWORD from the environment.')}catch(e){console.error(e.message);process.exitCode=1}finally{prompt.close();await db.$disconnect()}
