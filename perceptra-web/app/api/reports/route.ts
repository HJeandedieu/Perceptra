import {authorize,failure} from '../../../lib/api';import {reportRows} from '../../../lib/reports';import {summarize} from '../../../lib/report-utils.mjs';
export async function GET(request:Request){try{await authorize(request);return Response.json(summarize(await reportRows(request)),{headers:{'Cache-Control':'no-store'}})}catch(e){return failure(e)}}
