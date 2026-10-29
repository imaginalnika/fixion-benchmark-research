'use strict';
(async()=>{
const $=id=>document.getElementById(id), canvas=$('game'), ctx=canvas.getContext('2d');
const data=await fetch('data.json').then(r=>{if(!r.ok)throw Error('Maps could not load');return r.json()});
const images={};
function load(url){return new Promise(resolve=>{let im=new Image;im.onload=()=>{images[url]=im;resolve()};im.onerror=resolve;im.src=url})}
await Promise.all(Object.values(data.maps).map(m=>load(m.image)));
await Promise.all([...new Set(Object.values(data.maps).flatMap(m=>m.actors.map(a=>a.sprite).filter(Boolean)))].map(n=>load('assets/'+n+'.png')));
let map,wid,pos,face=[0,-1],visual,queue=[],after=null,anim=null,keys=new Set,hover=null,camX=0,camY=0,tile=32,seen=new Set,toastTimer,walkTarget=null,arrivedFrom=null,arrivedAt=null;
let debug=false;try{debug=localStorage.getItem('fixion-debug')==='1'}catch{}
try{seen=new Set(JSON.parse(localStorage.getItem('fixion-visited')||'[]'))}catch{}
for(const [id,w]of Object.entries(data.worlds)){let o=document.createElement('option');o.value=id;o.textContent=w.title;$('world').append(o)}
function note(text){$('toast').textContent=text;$('toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('show'),2400)}
function setDebug(on){debug=on;document.body.classList.toggle('debug',on);$('debug').checked=on;try{localStorage.setItem('fixion-debug',on?'1':'0')}catch{}}
// Enter a map. `at` is the arrival cell (derived from the layout: the doorstep, the foot of the stairs, the aligned edge cell).
function open(id,at=null,facing=null,via=null){map=data.maps[id];wid=map.world;$('world').value=wid;pos=[...(at||map.start)];if(facing)face=[...facing];visual=[...pos];queue=[];after=null;anim=null;hover=null;walkTarget=null;arrivedFrom=via;arrivedAt=[...pos];$('hover').style.display='none';seen.add(id);try{localStorage.setItem('fixion-visited',JSON.stringify([...seen]))}catch{};
 $('title').textContent=map.title;$('worldTitle').textContent=data.worlds[wid].title;$('opening').textContent=map.opening||'';$('count').textContent=data.worlds[wid].maps.filter(n=>seen.has(n)).length+' / '+data.worlds[wid].maps.length+' explored';$('routes').replaceChildren();
 for(const [i,p]of map.portals.entries()){let b=document.createElement('button');let k=document.createElement('i');k.textContent=({edge:'EDGE',door:'DOOR',descent:'DOWN',climb:'UP'})[p.kind]||'PORTAL';let t=document.createElement('b');t.textContent=data.maps[p.to_map].title;let s=document.createElement('span');s.textContent=p.feature||'';b.append(k,t,s);b.onclick=()=>cross(i);$('routes').append(b)}
 resize();note(map.title);updatePerson();history.replaceState(null,'','#'+wid);
}
function inside(x,y){return x>=0&&y>=0&&x<map.width&&y<map.height}
function pass(x,y){return inside(x,y)&&!map.solid[y][x]}
function stepPortalAt(x,y){return map.portals.find(p=>p.trigger==='step'&&p.cells.some(c=>c[0]===x&&c[1]===y))}
function exitPortal(x,y,dx,dy){return map.portals.find(p=>p.trigger==='exit'&&p.dir[0]===dx&&p.dir[1]===dy&&p.cells.some(c=>c[0]===x&&c[1]===y))}
function path(from,to){let q=[from],prev=new Map([[from.join(','),null]]);for(let i=0;i<q.length;i++){let u=q[i];if(u[0]===to[0]&&u[1]===to[1]){let out=[];for(let v=u;prev.get(v.join(','));v=prev.get(v.join(',')))out.unshift(v);return out}for(let [dx,dy]of [[0,-1],[1,0],[0,1],[-1,0]]){let v=[u[0]+dx,u[1]+dy],k=v.join(',');if(pass(...v)&&!prev.has(k)&&(!stepPortalAt(...v)||(v[0]===to[0]&&v[1]===to[1]))){prev.set(k,u);q.push(v)}}}return null}
function go(target,then=null){if(anim){walkTarget=target;return}let dest=target;if(!pass(...dest)){let near=[];for(let y=0;y<map.height;y++)for(let x=0;x<map.width;x++)if(pass(x,y))near.push([x,y]);near.sort((a,b)=>Math.hypot(a[0]-dest[0],a[1]-dest[1])-Math.hypot(b[0]-dest[0],b[1]-dest[1]));dest=near.find(v=>path(pos,v)!==null)||dest}let p=path(pos,dest);if(p){queue=p;after=then;if(!p.length&&then){after=null;then()}}else note('There is no clear path from here.');canvas.focus({preventScroll:true})}
// Walk to a portal and use it: step onto a door/stair, or walk to the edge cell and push outward.
function cross(i){let p=map.portals[i];if(!p)return;let c=p.cells[0];if(p.trigger==='exit'){go(c,()=>move(p.dir[0],p.dir[1],performance.now()))}else go(c)}
// A transition: leaving by an edge arrives on the child's opposite edge in the aligned cell; a door arrives on the doorstep inside.
function transit(p,i,facing){let to=p.to_cells[Math.min(i,p.to_cells.length-1)];open(p.to_map,to,facing,p.id)}
function move(dx,dy,now){face=[dx,dy];let to=[pos[0]+dx,pos[1]+dy];if(!inside(...to)){let p=exitPortal(pos[0],pos[1],dx,dy);if(p){let i=p.cells.findIndex(c=>c[0]===pos[0]&&c[1]===pos[1]);transit(p,i,[dx,dy]);return true}return false}if(!pass(...to))return false;anim={from:[...pos],to,start:now};return true}
function arrived(){let p=stepPortalAt(...pos);if(p){let i=p.cells.findIndex(c=>c[0]===pos[0]&&c[1]===pos[1]);transit(p,i,p.face||face);return true}return false}
function updatePerson(){let near=hover?.actor||map.actors.find(a=>Math.hypot(a.at[0]-pos[0],a.at[1]-pos[1])<2.3);let el=$('person');el.replaceChildren();let h=document.createElement('h3'),p=document.createElement('p');h.textContent=near?near.name:map.title;p.textContent=near?(near.bio||''):(map.opening||'');el.append(h,p)}
function resize(){if(!map)return;let width=$('viewport').clientWidth;tile=Math.min(width/Math.min(map.width,16),52);let maxHeight=innerWidth<=800?Math.min(innerHeight*.61,620):Math.min(innerHeight-225,770);let h=Math.min(map.height*tile,Math.max(tile*8,maxHeight));let dpr=Math.min(devicePixelRatio||1,2);canvas.style.height=h+'px';canvas.width=Math.round(width*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);ctx.imageSmoothingEnabled=false}
window.addEventListener('resize',resize);
const dirs={ArrowUp:[0,-1],w:[0,-1],ArrowDown:[0,1],s:[0,1],ArrowLeft:[-1,0],a:[-1,0],ArrowRight:[1,0],d:[1,0]};
window.addEventListener('keydown',e=>{if(e.target.tagName==='SELECT'||e.target.tagName==='INPUT')return;let k=e.key.length===1?e.key.toLowerCase():e.key;if(dirs[k]){e.preventDefault();keys.add(k);queue=[];after=null;walkTarget=null}if(k==='Escape'){queue=[];keys.clear()}if(k==='`'){setDebug(!debug)}});
window.addEventListener('keyup',e=>keys.delete(e.key.length===1?e.key.toLowerCase():e.key));window.addEventListener('blur',()=>{keys.clear();queue=[]});document.addEventListener('visibilitychange',()=>keys.clear());
for(let b of document.querySelectorAll('[data-dir]')){b.onpointerdown=e=>{e.preventDefault();try{b.setPointerCapture(e.pointerId)}catch{};keys.add('pad');dirs.pad=b.dataset.dir.split(',').map(Number);queue=[];if(!anim)move(...dirs.pad,performance.now())};b.onpointerup=b.onpointercancel=()=>keys.delete('pad')}
function cell(e){let r=canvas.getBoundingClientRect();return [Math.floor((e.clientX-r.left+camX)/tile),Math.floor((e.clientY-r.top+camY)/tile)]}
canvas.addEventListener('pointerdown',e=>{e.preventDefault();go(cell(e))});
canvas.addEventListener('pointermove',e=>{let [x,y]=cell(e);let actor=map.actors.find(a=>a.at[0]===x&&a.at[1]===y),name=map.names[x+','+y],portal=debug?map.portals.find(p=>p.cells.some(c=>c[0]===x&&c[1]===y)):null;hover=actor?{actor}:null;let el=$('hover');el.textContent=actor?actor.name+(actor.bio?' · '+actor.bio:''):portal?'→ '+data.maps[portal.to_map].title+' ('+portal.kind+')':name||'';el.style.display=el.textContent?'block':'none';canvas.style.cursor=actor?'pointer':'crosshair';updatePerson()});
canvas.addEventListener('pointerleave',()=>{hover=null;$('hover').style.display='none';updatePerson()});
$('world').onchange=()=>{keys.clear();open(data.worlds[$('world').value].start)};$('restart').onclick=()=>open(data.worlds[wid].start);$('help').onclick=()=>{$('scene').open=!$('scene').open};$('debug').onchange=e=>setDebug(e.target.checked);
function label(text,x,y,color='#f4ebd0'){ctx.font=`600 ${Math.max(10,tile*.25)}px system-ui`;let w=ctx.measureText(text).width;ctx.fillStyle='#101819df';ctx.fillRect(x-w/2-5,y-12,w+10,17);ctx.fillStyle=color;ctx.textAlign='center';ctx.fillText(text,x,y)}
function draw(now){let width=canvas.clientWidth,height=canvas.clientHeight;ctx.clearRect(0,0,width,height);camX=Math.max(0,Math.min(map.width*tile-width,(visual[0]+.5)*tile-width*.5));camY=Math.max(0,Math.min(map.height*tile-height,(visual[1]+.5)*tile-height*.52));if(map.width*tile<width)camX=-(width-map.width*tile)/2;ctx.save();ctx.translate(-camX,-camY);ctx.drawImage(images[map.image],0,0,map.width*tile,map.height*tile);
 if(debug){for(const p of map.portals){ctx.strokeStyle=p.trigger==='exit'?'#8de0c0':'#efd28e';ctx.lineWidth=2;for(const [x,y]of p.cells){ctx.strokeRect(x*tile+2,y*tile+2,tile-4,tile-4)}let [x,y]=p.cells[0];ctx.fillStyle='#fff';ctx.font=`${Math.max(9,tile*.22)}px system-ui`;ctx.textAlign='left';ctx.fillText(p.kind+'→'+p.to_map,x*tile+3,y*tile+tile-4)}ctx.strokeStyle='#ffffff22';for(let x=0;x<=map.width;x++){ctx.beginPath();ctx.moveTo(x*tile,0);ctx.lineTo(x*tile,map.height*tile);ctx.stroke()}for(let y=0;y<=map.height;y++){ctx.beginPath();ctx.moveTo(0,y*tile);ctx.lineTo(map.width*tile,y*tile);ctx.stroke()}}
 let actors=[...map.actors.map(a=>({...a,xy:a.at})),{name:'You',xy:visual,player:true}].sort((a,b)=>a.xy[1]-b.xy[1]);
 for(let a of actors){let [x,y]=a.xy,cx=(x+.5)*tile,cy=(y+.52)*tile;ctx.fillStyle='#0006';ctx.beginPath();ctx.ellipse(cx,cy+tile*.25,tile*.27,tile*.12,0,0,Math.PI*2);ctx.fill();
  if(a.sprite&&images['assets/'+a.sprite+'.png'])ctx.drawImage(images['assets/'+a.sprite+'.png'],x*tile,y*tile-tile*.15,tile,tile);
  else if(a.player){let bob=anim?Math.sin(now/75)*tile*.025:0;ctx.fillStyle='#194c44';ctx.fillRect(cx-tile*.17,cy-tile*.12+bob,tile*.34,tile*.39);ctx.fillStyle='#85e1c3';ctx.beginPath();ctx.arc(cx,cy-tile*.22+bob,tile*.14,0,7);ctx.fill();ctx.fillStyle='#0b2b26';ctx.fillRect(cx-tile*.05+face[0]*tile*.07,cy-tile*.25+face[1]*tile*.06,tile*.1,tile*.05);ctx.fillStyle='#d9eee2';ctx.fillRect(cx-tile*.12,cy+tile*.22,tile*.08,tile*.14);ctx.fillRect(cx+tile*.04,cy+tile*.22,tile*.08,tile*.14)}
  else{ctx.fillStyle=`rgb(${a.color.join(',')})`;ctx.font=`bold ${tile*.6}px Georgia,serif`;ctx.textAlign='center';ctx.fillText(a.glyph,cx,cy+tile*.19)}
  if(a.player)label('YOU',cx,cy-tile*.5,'#98e8cc');else if(Math.hypot(x-pos[0],y-pos[1])<2.3||hover?.actor?.name===a.name)label(a.name,cx,cy-tile*.5)}
 ctx.restore();
}
function frame(now){if(anim){let t=Math.min(1,(now-anim.start)/135);visual=[anim.from[0]+(anim.to[0]-anim.from[0])*t,anim.from[1]+(anim.to[1]-anim.from[1])*t];if(t===1){pos=[...anim.to];visual=[...pos];anim=null;if(!arrived()){updatePerson();if(walkTarget){let target=walkTarget;walkTarget=null;go(target)}else if(!queue.length&&after){let f=after;after=null;f()}}}}
 if(!anim){let k=[...keys].at(-1);if(k&&dirs[k])move(...dirs[k],now);else if(queue.length){let to=queue.shift();move(to[0]-pos[0],to[1]-pos[1],now)}}draw(now);requestAnimationFrame(frame)}
setDebug(debug);let initial=location.hash.slice(1);open(data.worlds[initial]?.start||data.worlds[Object.keys(data.worlds)[0]].start);requestAnimationFrame(frame);
// QA surface. state/data are read-only; walkTo/cross/step go through the same movement and collision code as the player.
// debugOpen places the player directly (test setup only).
window.fixion={get state(){return {map:map.id,world:wid,pos:[...pos],face:[...face],moving:!!anim,queued:queue.length,via:arrivedFrom,arrivedAt:arrivedAt&&[...arrivedAt],debug}},get data(){return data},
 walkTo:t=>go(t),cross:i=>cross(i),step:(dx,dy)=>move(dx,dy,performance.now()),debugOpen:(id,at)=>open(id,at),setDebug};
})().catch(e=>{document.getElementById('title').textContent='Unable to load maps';console.error(e)});
