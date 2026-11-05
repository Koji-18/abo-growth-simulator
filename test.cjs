const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const I=require('./incentives.js');
assert.deepEqual([0,1,2,3].map(t=>1+I.continuous(1,t).reduce((a,b)=>a+b,0)),[1,2,4,8]);
assert.deepEqual([0,1,2,3].map(t=>1+I.continuous(3,t).reduce((a,b)=>a+b,0)),[1,4,16,64]);
assert.equal(I.monthly('I',10000,true),100000);assert.equal(I.monthly('II',10000,true),20000);assert.equal(I.monthly('III',10000,true),0);assert.equal(I.monthly('I',10000,false),null);
assert.equal(I.annual(12,12,120000,true),600000);assert.equal(I.annual(12,11,120000,true),750000);assert.equal(I.annual(6,7,120000,true),60000);assert.equal(I.annual(6,null,120000,true),null);assert.equal(I.annual(5,0,120000,true),0);
assert.equal(I.front(12,12,120000,'FPT',12,null,null),300000);assert.equal(I.front(26,28,120000,'E',12,null,null),234000);assert.equal(I.front(12,12,120000,'FPT',10,null,null),null);
assert.equal(I.front(12,12,120000,'FPT',10,21600000,null),300000);
assert.equal(I.oneTime('GP','renew',2028,2027,true),148000);assert.equal(I.oneTime('GP','renew',2029,2027,true),0);assert.equal(I.oneTime('PT','new',2027,2027,true),296000);
assert.equal(I.repeat([10000,10000,10000],'2026-09',true),1000);assert.equal(I.repeat([10000,0,10000,10000,10000],'2026-09',true),1000);assert.equal(I.repeat([0,0,0,10000,10000,10000],'2026-09',true),0);assert.equal(I.repeat([10000,10000,10000],'2026-08',true),null);
for(const route of ['index.html','continuous.html','continuous']){
 const file=route==='continuous'?'continuous.html':route;
 const html=fs.readFileSync(__dirname+'/'+file,'utf8');assert.equal((html.match(/type="checkbox"/g)||[]).length,4);
 const els={};for(const m of html.matchAll(/<(input|select|div|span|button|tbody|label|main|p)[^>]*id="([^"]+)"[^>]*>/g)){els[m[2]]={value:(m[0].match(/value="([^"]*)"/)||[])[1]||'',checked:false,setAttribute(k,v){this[k]=v;},focus(){},style:{},addEventListener(name,fn){this[name]=fn;},querySelectorAll(){return []}};}
 Object.assign(els.duration,{value:'12'});Object.assign(els.interval,{value:'1'});
 const context={Incentives:I,location:{pathname:'/'+route},document:{getElementById:id=>{assert.ok(els[id],id);return els[id]},querySelectorAll:()=>[]},window:{addEventListener(){}},localStorage:{},Date,Intl,console};
 vm.runInNewContext(html.match(/<script>([\s\S]*?)<\/script>/)[1],context);
 assert.equal(els.count.textContent,'1 人');
 const options=html.match(/<select id="front">([\s\S]*?)<\/select>/)[1];
 assert.equal((options.match(/<option /g)||[]).length,30);
 assert.match(options,/<option value="1">1<\/option>/);
 assert.match(options,/<option value="30">30<\/option>/);
 els.pv.value='2';els.front.value='1';els.interval.value='2';els.front.input();els.month.input({target:{value:'3'}});
 els.continuousTab.click();assert.equal(els.count.textContent,'8 人');assert.equal(els.pv.value,'2');assert.equal(els.interval.value,'2');assert.equal(els.intervalField.hidden,true);
 els.stageTab.click();assert.equal(els.count.textContent,'2 人');assert.equal(els.pv.value,'2');assert.equal(els.intervalField.hidden,false);
 els.front.value='30';els.interval.value='1';els.stageTab.click();els.month.input({target:{value:'2'}});assert.equal(els.count.textContent,'931 人');
 els.continuousTab.click();assert.equal(els.count.textContent,'961 人');
 els.month.input({target:{value:'5'}});assert.equal(els.count.textContent,'—');
 els.reset.click();assert.equal(els.count.textContent,'1 人');assert.equal(els.pv.value,'1');
 if(file==='continuous.html')els.continuousTab.click();

 if(file==='continuous.html'){for(const n of [1,2,3,30]){els.front.value=String(n);els.front.input();els.month.input({target:{value:'3'}});assert.equal(els.count.textContent,((1+n)**3).toLocaleString('ja-JP')+' 人');}els.front.value='1';els.front.input();els.month.input({target:{value:'12'}});assert.equal(els.count.textContent,'4,096 人');assert.match(els.frontStats.innerHTML,/直下フロント：<strong>12人/);assert.match(els.frontStats.innerHTML,/直下フロント：<strong>11人/);}
assert.ok(!html.includes('id="achievement"'));
}
console.log('All incentive boundaries, growth models, and both page initializations passed');
