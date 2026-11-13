"use client";
import {useEffect,useRef,useState} from 'react';
import type {Room} from 'livekit-client';

export function CameraVideo(){
  const video=useRef<HTMLVideoElement>(null);
  const [aspect,setAspect]=useState('16 / 9');
  const [mode,setMode]=useState(''),[message,setMessage]=useState('Connecting camera...');
  useEffect(()=>{
    let active=true,room:Room|undefined,lease:ReturnType<typeof setInterval>|undefined,retry:ReturnType<typeof setTimeout>|undefined;
    async function connect(){
      try{
        const health=await fetch('/api/cameras',{cache:'no-store'});
        if(!health.ok)throw Error('Camera access unavailable');
        const configuration=await health.json();
        if(!active)return;
        setMode(configuration.transport);
        if(configuration.transport==='local')return;
        if(configuration.transport!=='livekit')throw Error('Remote video has not been configured');
        const response=await fetch('/api/cameras/camera-01/media-token',{method:'POST'});
        const credentials=await response.json();
        if(!response.ok)throw Error(credentials.error||'Camera access denied');
        if(!active)return;
        const {Room,RoomEvent,Track}=await import('livekit-client');
        if(!active)return;
        const connection=new Room({adaptiveStream:true,dynacast:true});room=connection;
        connection.on(RoomEvent.TrackSubscribed,(track,publication,participant)=>{
          if(track.kind===Track.Kind.Video&&participant.identity==='camera-01'&&video.current){track.attach(video.current);setMessage('')}
        });
        connection.on(RoomEvent.TrackUnsubscribed,track=>{track.detach();if(active)setMessage('Waiting for fresh camera video...')});
        connection.on(RoomEvent.Disconnected,()=>{if(active){setMessage('Reconnecting camera...');clearInterval(lease);retry=setTimeout(connect,3000)}});
        setMessage('Waiting for camera station...');
        await connection.connect(credentials.url,credentials.token);
        if(!active){await connection.disconnect();return}
        lease=setInterval(async()=>{try{const r=await fetch('/api/cameras/camera-01/view',{method:'POST'});if(!r.ok){setMessage('Camera access unavailable');await connection.disconnect()}}catch{setMessage('Connection interrupted');await connection.disconnect()}},20000);
      }catch(e){clearInterval(lease);const failed=room;room=undefined;failed?.removeAllListeners();await failed?.disconnect();if(active){setMessage((e as Error).message);retry=setTimeout(connect,5000)}}
    }
    void connect();
    return()=>{active=false;clearInterval(lease);clearTimeout(retry);void room?.disconnect()};
  },[]);
  if(mode==='local')return <LocalVideo/>;
  return <div style={{position:'relative',aspectRatio:aspect,background:'#171717',borderRadius:10,overflow:'hidden'}}><video ref={video} autoPlay muted playsInline aria-label="Camera 01 live feed" onLoadedMetadata={e=>{const v=e.currentTarget;if(v.videoWidth&&v.videoHeight)setAspect(v.videoWidth+' / '+v.videoHeight)}} style={{width:'100%',height:'100%',objectFit:'contain',visibility:message?'hidden':'visible'}}/>{message&&<div className="empty-state" role="status" style={{position:'absolute',inset:0,color:'#fafafa'}}>{message}</div>}</div>;
}
function LocalVideo(){const [key,setKey]=useState(0),[failed,setFailed]=useState(false);useEffect(()=>{if(failed){const timer=setTimeout(()=>{setKey(k=>k+1);setFailed(false)},3000);return()=>clearTimeout(timer)}},[failed]);return failed?<div className="empty-state">Camera offline. Retrying...</div>:<img key={key} src={'/api/cameras/camera-01/stream?connection='+key} alt="Camera 01 live feed" draggable={false} style={{width:'100%',borderRadius:10}} onError={()=>setFailed(true)}/>}
