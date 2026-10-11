import {stormAt} from './modules/demo-data.js';
import {connectMap} from './modules/maps-loader.js';
import {createStormMap} from './modules/map.js';
const slider=document.getElementById('storm-time');let controller;
function render(){
 const s=stormAt(slider.value);
 document.getElementById('simulation-time').textContent=s.time;
 document.getElementById('category-value').textContent=s.category;
 document.getElementById('wind-value').textContent=Math.round(s.wind);
 document.getElementById('radius-value').textContent=Math.round(s.radius/1000);
 document.getElementById('position-value').textContent=`Example centre: ${Math.abs(s.lat).toFixed(2)}°S, ${s.lng.toFixed(2)}°E`;
 slider.setAttribute('aria-valuetext',`${s.time}, example category ${s.category}, illustrative radius ${Math.round(s.radius/1000)} kilometres`);
 document.getElementById('previous-time').disabled=Number(slider.value)===0;
 document.getElementById('next-time').disabled=Number(slider.value)===900;
 controller?.update(s);
}
slider.addEventListener('input',render);
document.getElementById('previous-time').addEventListener('click',()=>{slider.value=Math.max(0,Number(slider.value)-100);render();});
document.getElementById('next-time').addEventListener('click',()=>{slider.value=Math.min(900,Number(slider.value)+100);render();});
document.getElementById('follow-storm').addEventListener('change',render);
render();connectMap(maps=>{controller=createStormMap(maps,stormAt(slider.value));},'The example timeline is still available.');
