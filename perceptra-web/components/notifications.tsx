"use client";
import {useEffect,useRef,useState} from 'react';import Link from 'next/link';import type {Preferences} from './notification-preferences';
import {shouldAlert} from '../lib/notification-policy.mjs';
export function Notifications(){const [latest,setLatest]=useState<{id:string;reason:string}|null>(null),[prefs,setPrefs]=useState<Preferences>({notificationInApp:true,notificationDesktop:false,notificationSound:false}),[audioReady,setAudioReady]=useState(false),[message,setMessage]=useState('');const audio=useRef<AudioContext|null>(null);const preferences=useRef(prefs);const seen=useRef(new Set<string>());useEffect(()=>{preferences.current=prefs},[prefs]);useEffect(()=>{let active=true;fetch('/api/preferences',{cache:'no-store'}).then(r=>r.ok?r.json():null).then(d=>{if(d&&active)setPrefs(d.preferences)}).catch(()=>{});function changed(e:Event){setPrefs((e as CustomEvent<Preferences>).detail)}window.addEventListener('perceptra-preferences',changed);return()=>{active=false;window.removeEventListener('perceptra-preferences',changed)}},[]);
useEffect(()=>{let active=true;let cursor={after:new Date().toISOString(),id:''};let polling=false;async function poll(){if(polling)return;polling=true;try{const r=await fetch('/api/notifications?'+new URLSearchParams(cursor),{cache:'no-store'});if(!r.ok)return;const d=await r.json();if(!active)return;for(const incident of d.incidents){const key=incident.id+':'+incident.severity;if(['RESOLVED','FALSE_ALARM'].includes(incident.status))setLatest(current=>current?.id===incident.id?null:current);if(shouldAlert(incident,seen.current)){const p=preferences.current;if(p.notificationInApp)setLatest(incident);if(p.notificationDesktop&&'Notification'in window&&Notification.permission==='granted')new Notification('Perceptra incident',{body:incident.reason,tag:incident.id});if(p.notificationSound&&audio.current?.state==='running'){const ctx=audio.current;const tone=ctx.createOscillator(),gain=ctx.createGain();tone.frequency.value=660;gain.gain.setValueAtTime(.06,ctx.currentTime);gain.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+.25);tone.connect(gain);gain.connect(ctx.destination);tone.start();tone.stop(ctx.currentTime+.25)}}seen.current.add(key)}cursor=d.cursor;if(seen.current.size>2000)seen.current=new Set([...seen.current].slice(-1000))}catch{}finally{polling=false}}void poll();const timer=setInterval(poll,5000);return()=>{active=false;clearInterval(timer)}},[]);
return <>
  <button className="theme-toggle" onClick={async () => {
    if (!("Notification" in window)) { setMessage("Browser notifications unavailable; use in-app alerts."); return; }
    const permission = await Notification.requestPermission();
    setMessage(permission === "granted" ? "Permission granted. Enable browser notifications in Settings." : "Browser notification permission was not granted.");
  }}>Browser alerts</button>
  <button className="theme-toggle" onClick={async () => {
    try {
      if (!audio.current) audio.current = new AudioContext();
      await audio.current.resume();
      setAudioReady(true);
      setMessage("Audio unlocked. Enable alert sound in Settings.");
    } catch { setMessage("Audio unavailable in this browser."); }
  }}>{audioReady ? "Audio ready" : "Enable audio"}</button>
  {message && <button className="theme-toggle" title={message} onClick={() => setMessage("")}>{message} ×</button>}
  {latest && <div className="toast" role="status"><strong>Incident alert</strong><p>{latest.reason}</p><Link href={"/incidents/" + encodeURIComponent(latest.id)}>Review incident →</Link><button onClick={() => setLatest(null)} style={{marginLeft:15}}>Dismiss</button></div>}
</>;
}
