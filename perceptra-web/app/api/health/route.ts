export const dynamic='force-dynamic';
export async function GET(){return Response.json({status:'ok',service:'perceptra-next',timestamp:new Date().toISOString(),capabilities:{authentication:true,incidents:true,cameraStreaming:true}},{headers:{'Cache-Control':'no-store'}})}
