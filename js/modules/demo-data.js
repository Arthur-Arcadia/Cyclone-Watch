// All values below are invented for the high-fidelity prototype, not weather or retail data.
export const stormFrames = [
 {lat:-23.40532,lng:155.02345,radius:22000,wind:18,category:1},
 {lat:-24.81247,lng:154.71893,radius:28000,wind:24,category:1},
 {lat:-26.22764,lng:154.40981,radius:38000,wind:30,category:2},
 {lat:-26.80981,lng:154.02764,radius:48000,wind:34,category:2},
 {lat:-27.32123,lng:153.91234,radius:62000,wind:43,category:3},
 {lat:-27.37256,lng:153.68876,radius:76000,wind:48,category:3},
 {lat:-27.4,lng:153.43,radius:85000,wind:55,category:4},
 {lat:-27.49145,lng:153.21234,radius:58000,wind:41,category:3},
 {lat:-27.58678,lng:152.92345,radius:35000,wind:29,category:2},
 {lat:-27.86987,lng:152.63456,radius:15000,wind:18,category:1}
];
export function stormAt(value) {
 const t=Math.max(0,Math.min(900,Number(value)))/100;
 const i=Math.min(Math.floor(t),stormFrames.length-2), f=t-i;
 const a=stormFrames[i],b=stormFrames[i+1];
 const state={}; for(const k of ['lat','lng','radius','wind']) state[k]=a[k]+(b[k]-a[k])*f;
 state.category=f<.5?a.category:b.category;
 state.elapsed=stormFrames.slice(0,i+1).map(({lat,lng})=>({lat,lng}));
 state.elapsed.push({lat:state.lat,lng:state.lng});
 state.remaining=[{lat:state.lat,lng:state.lng},...stormFrames.slice(i+1).map(({lat,lng})=>({lat,lng}))];
 const minutes=Math.round(t*360),day=Math.floor(minutes/1440)+1,hour=Math.floor(minutes%1440/60),minute=minutes%60;
 state.time=`Day ${day} · ${String(hour).padStart(2,'0')}:${String(minute).padStart(2,'0')}`;
 return state;
}
export const shops=[
 {id:'shop-1',name:'Woolworths · Demo A',area:'Example west-side location',lat:-27.4848667,lng:152.9928103,stock:{Water:15,Fruit:23,Bread:0}},
 {id:'shop-2',name:'Woolworths · Demo B',area:'Example local shopping area',lat:-27.483444,lng:152.995158,stock:{Water:0,Fruit:5,Bread:7}},
 {id:'shop-3',name:'Woolworths · Demo C',area:'Example riverside location',lat:-27.4856933,lng:153.0013844,stock:{Water:20,Fruit:15,Bread:14}},
 {id:'shop-4',name:'ALDI · Demo',area:'Example neighbourhood location',lat:-27.4819616,lng:153.0034864,stock:{Water:0,Fruit:0,Bread:0}},
 {id:'shop-5',name:'IGA · Demo',area:'Example south-side location',lat:-27.5018882,lng:153.0061635,stock:{Water:12,Fruit:23,Bread:14}},
 {id:'shop-6',name:'Coles · Demo',area:'Example east-side location',lat:-27.4863816,lng:153.0347582,stock:{Water:2,Fruit:11,Bread:7}},
 {id:'shop-7',name:'Woolworths · Demo D',area:'Example central location',lat:-27.482075,lng:153.0236941,stock:{Water:0,Fruit:0,Bread:0}}
];
export const hasStock=shop=>Object.values(shop.stock).some(quantity=>quantity>0);
