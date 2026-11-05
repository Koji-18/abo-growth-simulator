/* Business Support 2027, booklet pp.10–11,16–21. Unknown is null, never zero. */
(function(root){
'use strict';
const known=x=>typeof x==='number'&&Number.isFinite(x)&&x>=0;
const integer=(x,max)=>known(x)&&Number.isInteger(x)&&x<=max;
const compare=(a,b)=>a>b?0:a===b?1:2;
const api={
 continuous(n,t){if(!integer(n,30)||!integer(t,72))throw Error('Invalid growth input');return Array.from({length:n*t},(_,i)=>(1+n)**(t-1-Math.floor(i/n)));},
 repeat(pvs,registration,eligible){
  if(!eligible||registration<'2026-09'||pvs.some(x=>!known(x)))return null;
  let start=pvs.slice(0,3).findIndex(x=>x>=10000);if(start<0)return 0;
  if(start===0&&pvs[1]<10000&&pvs[2]>=10000)start=2;
  const run=pvs.slice(start);if(run.some(x=>x<10000))return 0;
  return ({3:1000,6:2000,9:3000,12:6000})[run.length]||0;
 },
 monthly(type,pv,qualified){if(!qualified||!known(pv))return null;return pv<10000?0:({I:100000,II:20000,III:0,none:0})[type]??null;},
 annual(q,previous,pv,pt){if(!integer(q,12)||!integer(previous,12)||!known(pv)||!pt)return null;if(q<6||pv<120000)return 0;return [[250000,200000,60000],[312500,250000,75000],[375000,300000,90000],[437500,350000,105000],[500000,400000,120000],[562500,450000,135000],[750000,600000,null]][q-6][compare(q,previous)];},
 front(count,previous,pv,pin,q,total,award){
  if(!integer(count,100000)||!integer(previous,100000)||!known(pv)||!integer(q,12)||!pin)return null;
  if(pv<120000)return 0;
  if(q<12){if(q<10)return 0;if(!((known(total)&&total>=21600000)||(known(award)&&award>=18000000))){if(!known(total)||!known(award))return null;return 0;}}
  const rates={FPT:[31250,25000,7500],E:[37500,30000,9000],D:[75000,60000,18000],ED:[100000,80000,24000]};
  return rates[pin]?count*rates[pin][compare(count,previous)]:null;
 },
 oneTime(pin,kind,fy,newFY,certified){if(!certified||!integer(fy,9999)||!integer(newFY,9999))return null;if(kind==='new'&&fy!==newFY||kind==='renew'&&fy!==newFY+1)return 0;return ({GP:148000,PT:296000,FPT:517000})[pin]??null;}
};root.Incentives=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
