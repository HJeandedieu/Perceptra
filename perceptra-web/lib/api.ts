import {currentUser,validOrigin} from './session';
import {timingSafeEqual} from 'node:crypto';
export class ApiError extends Error{constructor(public status:number,message:string){super(message)}}
export async function authorize(request:Request,admin=false){const user=await currentUser();if(!user)throw new ApiError(401,'Unauthorized');if(admin&&user.role!=='ADMIN')throw new ApiError(403,'Administrator required');if(!['GET','HEAD'].includes(request.method)&&!validOrigin(request))throw new ApiError(403,'Invalid request origin');return user}
export function serviceAuth(request:Request){const expected=process.env.SERVICE_TOKEN||'';const actual=request.headers.get('authorization')?.replace(/^Bearer /,'')||'';const a=Buffer.from(actual),b=Buffer.from(expected);if(expected.length<32||a.length!==b.length||!timingSafeEqual(a,b))throw new ApiError(401,'Invalid service credential')}
export async function jsonBody(request:Request){const text=await request.text();if(text.length>1048576)throw new ApiError(413,'Payload too large');try{return JSON.parse(text)}catch{throw new ApiError(400,'Invalid JSON')}}
export function failure(error:unknown){if(error instanceof ApiError)return Response.json({error:error.message},{status:error.status});return Response.json({error:'Storage unavailable. Check PostgreSQL and migrations.'},{status:503})}
