import {clearSession,validOrigin} from '../../../../lib/session';
export async function POST(request:Request){if(!validOrigin(request))return Response.json({error:'Invalid request origin'},{status:403});await clearSession();return Response.json({ok:true})}
