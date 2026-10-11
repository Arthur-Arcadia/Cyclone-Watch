import {stormFrames} from './demo-data.js';
export function createStormMap(maps,state){
 const map=new maps.Map(document.getElementById('map'),{center:{lat:state.lat,lng:state.lng},zoom:8,mapId:'DEMO_MAP_ID',streetViewControl:false,fullscreenControl:false,gestureHandling:'cooperative'});
 const elapsed=new maps.Polyline({map,strokeColor:'#245dcc',strokeWeight:4,zIndex:3});
 const remaining=new maps.Polyline({map,strokeOpacity:0,icons:[{icon:{path:'M 0,-1 0,1',strokeColor:'#66758b',strokeOpacity:1,scale:2},offset:'0',repeat:'12px'}],zIndex:2});
 class Footprint extends maps.OverlayView{
  constructor(){super();this.state=state;this.setMap(map);}
  onAdd(){this.el=document.createElement('div');this.el.className='cyclone-footprint';this.el.setAttribute('aria-hidden','true');const image=document.createElement('img');image.src='Images/cyclone.png';image.alt='';this.el.append(image);this.getPanes().overlayLayer.append(this.el);}
  draw(){
   const projection=this.getProjection();if(!projection||!this.el)return;
   const s=this.state,dy=s.radius/111320,dx=dy/Math.cos(s.lat*Math.PI/180);
   const nw=projection.fromLatLngToDivPixel(new maps.LatLng(s.lat+dy,s.lng-dx));
   const se=projection.fromLatLngToDivPixel(new maps.LatLng(s.lat-dy,s.lng+dx));
   Object.assign(this.el.style,{left:`${nw.x}px`,top:`${nw.y}px`,width:`${se.x-nw.x}px`,height:`${se.y-nw.y}px`});
  }
  update(next){this.state=next;this.draw();}
  onRemove(){this.el?.remove();}
 }
 const footprint=new Footprint();
 const dot=document.createElement('div');dot.className='cyclone-center';
 const center=new maps.marker.AdvancedMarkerElement({map,position:{lat:state.lat,lng:state.lng},content:dot,title:'Illustrative cyclone centre',zIndex:4});
 const update=next=>{elapsed.setPath(next.elapsed);remaining.setPath(next.remaining);footprint.update(next);center.position={lat:next.lat,lng:next.lng};if(document.getElementById('follow-storm').checked)map.panTo(center.position);};
 const fit=document.getElementById('fit-track');fit.disabled=false;
 fit.addEventListener('click',()=>{document.getElementById('follow-storm').checked=false;const bounds=new maps.LatLngBounds();stormFrames.forEach(p=>bounds.extend({lat:p.lat,lng:p.lng}));map.fitBounds(bounds,48);});
 update(state);return {update,map};
}
