// Dependency-free logic tests using DOM and Google Maps test doubles. These do not replace real-browser testing.
import assert from 'node:assert/strict';
const root=new URL('../',import.meta.url).href;
const {stormAt,stormFrames,shops,hasStock}=await import(root+'js/modules/demo-data.js');
let checks=0;const check=(truth,message)=>{assert.ok(truth,message);checks++;};
for(let t=0;t<=900;t++){
 const s=stormAt(t);check(Number.isFinite(s.lat)&&Number.isFinite(s.lng)&&s.radius>0,'valid state throughout timeline');
 check(s.elapsed.at(-1).lat===s.lat&&s.remaining[0].lng===s.lng,'both route sections meet at current storm');
 if(t%100===0){const f=stormFrames[t/100];check(s.lat===f.lat&&s.radius===f.radius,'keyframe exactness');}
}
check(stormAt(-1).lat===stormFrames[0].lat,'lower clamp');check(stormAt(901).lat===stormFrames.at(-1).lat,'upper clamp');
check(stormAt(0).time==='Day 1 · 00:00'&&stormAt(900).time==='Day 3 · 06:00','timeline endpoints');
check(shops.filter(hasStock).length===5&&shops.filter(s=>!hasStock(s)).length===2,'five green, two red');
check(shops.filter(s=>!hasStock(s)).every(s=>Object.values(s.stock).every(x=>x===0)),'red means all zero');
class El extends EventTarget{
 constructor(tag='div'){super();this.tag=tag;this.children=[];this.attrs={};this.className='';this.hidden=false;this.style={setProperty:(k,v)=>this.style[k]=v};this.dataset={};this.classList={add:c=>{this.className+=' '+c;},toggle:(c,on)=>{const v=new Set(this.className.split(' ').filter(Boolean));if(on)v.add(c);else v.delete(c);this.className=[...v].join(' ');},contains:c=>this.className.split(' ').includes(c)};}
 append(...els){this.children.push(...els);}replaceChildren(...els){this.children=els;}setAttribute(k,v){this.attrs[k]=v;}remove(){this.removed=true;}focus(){document.activeElement=this;}click(){this.dispatchEvent(new Event('click'));}showModal(){this.open=true;}close(){this.open=false;this.dispatchEvent(new Event('close'));}
 get textContent(){return (this._text??'')+this.children.map(e=>e.textContent??'').join('');}set textContent(s){this._text=String(s);this.children=[];}
 querySelector(sel){return this.children.find(e=>e.tag===sel);}getBoundingClientRect(){return {left:0,right:400,top:0,bottom:600};}
}
let els,created;
function dom(){els={};created=[];globalThis.window=new EventTarget();globalThis.document={head:new El('head'),body:new El('body'),activeElement:null,createElement:tag=>{const e=new El(tag);created.push(e);return e;},createTextNode:text=>({textContent:text}),getElementById:id=>els[id]??=(new El()),querySelectorAll:sel=>created.filter(e=>e.className.split(' ').includes(sel.slice(1)))};document.getElementById('follow-storm').checked=true;document.getElementById('map').clientWidth=400;globalThis.ResizeObserver=class{constructor(fn){this.fn=fn;}observe(){this.fn();}};const status=document.getElementById('map-status');status.append(new El('p'));}
let overlays=[],polylines=[],markers=[];
function mapsMock(){
 overlays=[];polylines=[];markers=[];
 class Map{constructor(el,opt){this.zoom=opt.zoom;this.center=opt.center;this.listeners={};}panTo(p){this.center=p;}getZoom(){return this.zoom;}setZoom(z){this.zoom=z;overlays.forEach(o=>o.draw());this.listeners.zoom_changed?.();}addListener(k,fn){this.listeners[k]=fn;}fitBounds(bounds){this.bounds=bounds;}}
 class OverlayView{setMap(map){this.map=map;overlays.push(this);this.onAdd();this.draw();}getPanes(){return {overlayLayer:document.body};}getProjection(){return {fromLatLngToDivPixel:p=>({x:p.lng*2**this.map.zoom,y:-p.lat*2**this.map.zoom})};}}
 class LatLng{constructor(lat,lng){this.lat=lat;this.lng=lng;}}
 class LatLngBounds{constructor(){this.points=[];}extend(p){this.points.push(p);}}
 class Polyline{constructor(opts){Object.assign(this,opts);polylines.push(this);}setPath(p){this.path=p;}}
 class AdvancedMarkerElement{constructor(opts){Object.assign(this,opts);this.listeners={};markers.push(this);}addListener(k,fn){this.listeners[k]=fn;}}
 return {Map,OverlayView,LatLng,LatLngBounds,Polyline,marker:{AdvancedMarkerElement}};
}
dom();const {createStormMap}=await import(root+'js/modules/map.js');let maps=mapsMock();const controller=createStormMap(maps,stormAt(0));const w0=parseFloat(overlays[0].el.style.width);controller.map.setZoom(9);const w1=parseFloat(overlays[0].el.style.width);check(Math.abs(w1/w0-2)<1e-8,'footprint doubles with one zoom level');
const startPosition=markers[0].position;controller.update(stormAt(600));check(markers[0].position.lat!==startPosition.lat,'timeline moves cyclone');check(parseFloat(overlays[0].el.style.width)>w1,'later larger footprint');check(polylines[0].path.length>2&&polylines[1].path.length<10,'elapsed grows and remaining shrinks');
document.getElementById('fit-track').click();check(!document.getElementById('follow-storm').checked&&controller.map.bounds.points.length===10,'full route and follow toggle');
// Simulate external script failure then success: the map must not start before callback.
dom();let mapStarts=0;const loader=await import(root+'js/modules/maps-loader.js?test=network');loader.connectMap(()=>{mapStarts++;},'Fallback available.');check(mapStarts===0,'does not initialise before SDK is ready');let script=document.head.children.at(-1);script.onerror();await new Promise(setImmediate);check(document.getElementById('map-status').classList.contains('error'),'network failure visible');check(!document.getElementById('retry-map').disabled,'retry enabled');document.getElementById('retry-map').click();script=document.head.children.at(-1);window.google={maps:mapsMock()};window[new URL(script.src).searchParams.get('callback')]();await new Promise(setImmediate);check(mapStarts===1&&document.getElementById('map-status').hidden,'successful retry initialises exactly once');
// Timeout uses the same retry path. Use controlled timers to avoid waiting 20 seconds.
dom();const nativeSetTimeout=globalThis.setTimeout,nativeClearTimeout=globalThis.clearTimeout;let timeout;globalThis.setTimeout=fn=>{timeout=fn;return 1;};globalThis.clearTimeout=()=>{};const timed=await import(root+'js/modules/maps-loader.js?test=timeout');const pending=timed.loadMaps().catch(e=>e);timeout();check((await pending).message.includes('too long'),'timeout rejects without hanging');globalThis.setTimeout=nativeSetTimeout;globalThis.clearTimeout=nativeClearTimeout;
// Inventory view: derive all statuses and modal quantities from one dataset.
dom();window.google={maps:mapsMock()};await import(root+'js/storage.js');await new Promise(setImmediate);check(els['shop-list'].children.length===7,'all shops available without using map');const availableCard=els['shop-list'].children[0];availableCard.focus();availableCard.click();check(els['shop-dialog'].open,'details open');check(els['stock-items'].children.length===3,'three structured stock rows');check(els['stock-items'].children[2].textContent.includes('Out of stock'),'individual shortage shown even for green shop');check(els['shop-stock-status'].textContent.includes('Some stock'),'available status');els['close-shop'].click();check(!els['shop-dialog'].open&&document.activeElement===availableCard,'close restores focus');els['shop-list'].children[3].click();check(els['shop-stock-status'].textContent.includes('All items out'),'all-zero shop is sold out');check(markers.filter(m=>m.content.classList.contains('empty')).length===2,'map has two red markers');check(markers.filter(m=>m.content.classList.contains('available')).length===5,'map has five green markers');const markerMap=markers[0].map;markerMap.setZoom(3);check(markers.every(m=>parseInt(m.content.style['--marker-size'])>=30),'markers stay usable when zoomed out');markerMap.setZoom(22);check(markers.every(m=>parseInt(m.content.style['--marker-size'])<=52),'marker max size bounded');els['done-shop'].click();
console.log(JSON.stringify({checks,result:'PASS',scope:'data + DOM interactions and Maps API doubles; not real browser or Google service validation'}));
