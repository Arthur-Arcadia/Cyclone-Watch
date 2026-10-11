import {shops,hasStock} from './modules/demo-data.js';
import {connectMap} from './modules/maps-loader.js';
const list=document.getElementById('shop-list'),dialog=document.getElementById('shop-dialog');
let activeId=null,opener=null,map,previousOverflow='',markers=[];
function selectShop(shop){
 activeId=shop.id;opener=document.activeElement;
 document.querySelectorAll('.shop-card').forEach(card=>card.classList.toggle('selected',card.dataset.shop===shop.id));
 markers.forEach(({el,shop:s})=>el.classList.toggle('selected',s.id===shop.id));
 document.getElementById('shop-title').textContent=shop.name;
 document.getElementById('shop-subtitle').textContent=shop.area+' · Demonstration data';
 const available=hasStock(shop),status=document.getElementById('shop-stock-status');
 status.textContent=available?'✓ Some stock available':'× All items out of stock';status.classList.toggle('sold-out',!available);
 const rows=document.getElementById('stock-items');rows.replaceChildren();
 for(const [name,quantity] of Object.entries(shop.stock)){
  const row=document.createElement('div');row.className='stock-row'+(quantity===0?' out':'');
  const title=document.createElement('strong');title.textContent=name;
  const count=document.createElement('span');count.className='quantity';count.textContent=String(quantity);
  const detail=document.createElement('small');detail.textContent=quantity>0?'Available · example units':'Out of stock · example units';
  row.append(title,count,detail);rows.append(row);
 }
 resizeMarkers();previousOverflow=document.body.style.overflow;document.body.style.overflow='hidden';dialog.showModal();
}
for(const shop of shops){
 const card=document.createElement('button');card.type='button';card.className='shop-card';card.dataset.shop=shop.id;card.setAttribute('aria-haspopup','dialog');
 const content=document.createElement('span'),title=document.createElement('strong'),detail=document.createElement('small');
 title.textContent=shop.name;const dot=document.createElement('i');dot.className='stock-dot '+(hasStock(shop)?'available':'empty');dot.setAttribute('aria-hidden','true');
 detail.append(dot,document.createTextNode(hasStock(shop)?'Some stock available':'All items out of stock'));content.append(title,detail);
 const arrow=document.createElement('span');arrow.textContent='→';arrow.setAttribute('aria-hidden','true');card.append(content,arrow);card.addEventListener('click',()=>selectShop(shop));list.append(card);
}
function close(){dialog.close();}
document.getElementById('close-shop').addEventListener('click',close);document.getElementById('done-shop').addEventListener('click',close);
dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)close();});
dialog.addEventListener('close',()=>{document.body.style.overflow=previousOverflow;opener?.focus();});
function resizeMarkers(){
 if(!map)return;
 const compact=document.getElementById('map').clientWidth<520;
 const base=Math.max(30,Math.min(48,34+((map.getZoom()??13)-12)*3+(compact?2:0)));
 markers.forEach(({el,shop})=>el.style.setProperty('--marker-size',`${base+(shop.id===activeId?4:0)}px`));
}
connectMap(maps=>{
 map=new maps.Map(document.getElementById('map'),{center:{lat:-27.48977,lng:153.01512},zoom:13,mapId:'DEMO_MAP_ID',streetViewControl:false,fullscreenControl:false,gestureHandling:'cooperative'});
 markers=shops.map(shop=>{
  const available=hasStock(shop),el=document.createElement('div');el.className='shop-marker '+(available?'available':'empty');
  const image=document.createElement('img');image.src=available?'Images/market-full.png':'Images/market-none.png';image.alt='';
  const symbol=document.createElement('span');symbol.className='marker-symbol';symbol.textContent=available?'✓':'×';symbol.setAttribute('aria-hidden','true');el.append(image,symbol);
  const marker=new maps.marker.AdvancedMarkerElement({map,position:{lat:shop.lat,lng:shop.lng},content:el,title:`${shop.name}: ${available?'some stock available':'all items out of stock'}`});
  marker.addListener('click',()=>selectShop(shop));return {marker,el,shop};
 });
 map.addListener('zoom_changed',resizeMarkers);new ResizeObserver(resizeMarkers).observe(document.getElementById('map'));resizeMarkers();
},'You can still open every shop from the list.');
