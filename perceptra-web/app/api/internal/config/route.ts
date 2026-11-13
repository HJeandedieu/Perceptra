import {serviceAuth,failure} from '../../../../lib/api';import {camera} from '../../../../lib/camera';
export async function GET(request:Request){try{serviceAuth(request);return Response.json({camera:await camera()},{headers:{'Cache-Control':'no-store'}})}catch(e){return failure(e)}}
