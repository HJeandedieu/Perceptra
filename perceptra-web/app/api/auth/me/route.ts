import {currentUser} from '../../../../lib/session';
export async function GET(){const user=await currentUser();return Response.json(user?{user}:{error:'Unauthorized'},{status:user?200:401,headers:{'Cache-Control':'no-store'}})}
