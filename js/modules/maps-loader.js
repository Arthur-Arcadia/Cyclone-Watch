import {MAPS_API_KEY} from '../config.js';
let loading,attempt=0,authFailed=false;
window.gm_authFailure=()=>{authFailed=true;window.dispatchEvent(new Event('maps-auth-error'));};
export function loadMaps(){
 if(authFailed)return Promise.reject(new Error('Map authorisation failed.'));
 if(window.google?.maps?.Map && window.google?.maps?.marker?.AdvancedMarkerElement)return Promise.resolve(window.google.maps);
 if(loading)return loading;
 loading=new Promise((resolve,reject)=>{
  if(!MAPS_API_KEY){reject(new Error('A Maps API key is required.'));return;}
  const script=document.createElement('script'),callback=`__cycloneMapsReady${++attempt}`;
  let settled=false;
  const finish=(error)=>{
   if(settled)return;settled=true;clearTimeout(timer);window.removeEventListener('maps-auth-error',onAuthError);
   // Late callbacks after a network timeout must remain harmless.
   window[callback]=()=>{};
   if(error){script.remove();reject(error);}else resolve(window.google.maps);
  };
  const onAuthError=()=>finish(new Error('Map authorisation failed.'));
  const timer=setTimeout(()=>finish(new Error('The map took too long to load.')),20000);
  window.addEventListener('maps-auth-error',onAuthError);
  window[callback]=()=>finish();
  script.onerror=()=>finish(new Error('The map could not connect.'));
  const params=new URLSearchParams({key:MAPS_API_KEY,callback,loading:'async',libraries:'maps,marker',v:'weekly'});
  script.src=`https://maps.googleapis.com/maps/api/js?${params}`;script.async=true;script.id='google-maps-loader';document.head.append(script);
 }).catch(error=>{loading=null;throw error;});
 return loading;
}
export function mapStatus(message,error=false){
 const el=document.getElementById('map-status');el.hidden=false;el.classList.toggle('error',error);
 el.querySelector('p').textContent=message;document.getElementById('retry-map').hidden=!error;
}
export function mapReady(){document.getElementById('map-status').hidden=true;}
export function connectMap(start,fallback){
 let busy=false,ready=false;
 const button=document.getElementById('retry-map');
 const run=async()=>{
  if(busy)return;
  if(authFailed){location.reload();return;}
  busy=true;button.disabled=true;mapStatus('Loading map…');
  try{const maps=await loadMaps();if(!ready){await start(maps);ready=true;}if(authFailed)throw new Error('Map authorisation failed.');mapReady();}
  catch(error){mapStatus(`${error.message} ${fallback} Please check your connection and retry.`,true);}
  finally{busy=false;button.disabled=false;}
 };
 window.addEventListener('maps-auth-error',()=>mapStatus(`The map is unavailable. ${fallback} The map owner may need to check API access.`,true));
 button.addEventListener('click',run);run();
}
