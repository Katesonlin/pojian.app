
const FD={
  oat:{p:13,c:60,f:7},egg:{p:13,c:1,f:11},milk:{p:3,c:5,f:3},
  rice:{p:7,c:75,f:1},chicken:{p:31,c:0,f:3.6},ban:{p:1,c:23,f:0},
  salmon:{p:20,c:0,f:8},sw:{p:1,c:20,f:0},beef:{p:22,c:0,f:8},
  cas:{p:80,c:5,f:2},alm:{p:21,c:22,f:45},veg:{p:1,c:3,f:0}
};
const DAYN=['周一','周二','周三','周四','周五','周六','周日'];
const CARBN={high:'高碳',mid:'中碳',low:'低碳'};
const TRAINN={strength:'力量',cardio:'骑行',rest:'休息'};

let S={
  height:174,weight:90,age:30,tw:74,al:1.55,pf:2,
  deficit:450,chR:4,cmR:2.5,clR:1,fatR:0.8,
  carbType:'high',
  carbDays:['high','mid','high','low','high','low','mid'],
  trainDays:['strength','cardio','strength','strength','strength','rest','cardio'],
  rd:75,rhiit:10,rs:60,rr:120,rw:10,rc:10
};

function $(id){return document.getElementById(id)}
function g(id){return parseFloat($(id)?.value)||0}
function t(id,val){if($(id))$(id).textContent=val}
function pct(v,mx){return Math.min(100,Math.round((v/mx)*100))}
function showN(){const e=$('sn');e.classList.add('show');setTimeout(()=>e.classList.remove('show'),1500)}

function sw(tab){
  document.querySelectorAll('.tab').forEach((d,i)=>d.classList.toggle('active',['b','d','t','f'][i]===tab));
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  $('tab-'+tab)?.classList.add('active');
}

function calcAll(){
  const h=g('s-height'),w=g('s-weight'),a=g('s-age'),tw=g('s-tw');
  const al=parseFloat($('s-al').value),pf=parseFloat($('s-pf').value);
  const def=parseInt($('s-deficit').value)||450;
  const chR=parseFloat($('s-ch-r').value)||4;
  const cmR=parseFloat($('s-cm-r').value)||2.5;
  const clR=parseFloat($('s-cl-r').value)||1;
  const fatR=parseFloat($('s-fat-r').value)||0.8;

  const bmr=Math.round(10*w+6.25*h-5*a+5);
  const tdee=Math.round(bmr*al);
  const target=Math.round(tdee-def);
  const p=Math.round(pf*w);
  const ch=Math.round(chR*w),cm=Math.round(cmR*w),cl=Math.round(clR*w),fat=Math.round(fatR*w);
  const bmi=Math.round(w/Math.pow(h/100,2)*10)/10;
  const weeks=Math.round((w-tw)*7700/def);

  Object.assign(S,{height:h,weight:w,age:a,tw:tw,al,pf,deficit:def,chR,cmR,clR,fatR});

  t('d-bmi',bmi);t('d-bmr',bmr);t('d-tdee',tdee);
  t('d-target',target);t('d-def',def);t('d-rl',(w-tw).toFixed(1));
  t('d-wl',(def*7/7700).toFixed(1));t('d-weeks',weeks+' 周');

  const w1=Math.round(w*10)/10;
  t('cf-w',w1);t('cf-w2',w1);t('cf-w2b',w1);t('cf-w3',w1);t('cf-w4',w1);
  t('cf-pf',pf);t('cf-p',p+' g');
  t('cf-ch',chR);t('cf-chv',ch+' g');
  t('cf-cm',cmR);t('cf-cmv',cm+' g');
  t('cf-cl',clR);t('cf-clv',cl+' g');
  t('cf-fr',fatR);t('cf-frv',fat+' g');

  const carbT=S.carbType==='high'?ch:S.carbType==='mid'?cm:cl;
  const calT=Math.round(p*4+carbT*4+fat*9);
  t('cf-p2',p);t('cf-c2',carbT);t('cf-f2',fat);t('cf-cal',calT+' kcal');
  t('cf-tdee',tdee);t('cf-def',def);t('cf-net',target+' kcal');

  t('cbHighV',ch+'g');t('cbMidV',cm+'g');t('cbLowV',cl+'g');

  const di=new Date().getDay()===0?6:new Date().getDay()-1;
  const labels={high:'🔥 高碳训练日',mid:'⚡ 中碳骑行日',low:'🌙 低碳休息日'};
  const trainLabels={strength:'力量',cardio:'骑行',rest:'休息'};
  t('heroDay',DAYN[di]+' · '+CARBN[S.carbType]+'日<strong>'+trainLabels[S.trainDays[di]]+'</strong>');
  t('heroPill',labels[S.carbType]);
  t('hP',p);t('hC',carbT);t('hF',fat);
  t('hCalTgt',calT);
  t('hDeficit','缺口 '+def+' kcal · 预计每周减 '+(def*7/7700).toFixed(1)+'kg');
  $('hCalBar').style.width='0%';t('hCalCur','0');

  buildCarbGrid();buildTrainGrid();buildCarbBtns();calcMeals();save();
}

function setTC(type){
  S.carbType=type;
  buildCarbBtns();
  const w=S.weight,pf=S.pf,chR=S.chR,cmR=S.cmR,clR=S.clR,fatR=S.fatR;
  const ch=Math.round(chR*w),cm=Math.round(cmR*w),cl=Math.round(clR*w),fat=Math.round(fatR*w);
  const carbT=type==='high'?ch:type==='mid'?cm:cl;
  const p=Math.round(pf*w);
  const calT=Math.round(p*4+carbT*4+fat*9);
  const di=new Date().getDay()===0?6:new Date().getDay()-1;
  const labels={high:'🔥 高碳训练日',mid:'⚡ 中碳骑行日',low:'🌙 低碳休息日'};
  const trainLabels={strength:'力量',cardio:'骑行',rest:'休息'};
  t('heroDay',DAYN[di]+' · '+CARBN[type]+'日<strong>'+trainLabels[S.trainDays[di]]+'</strong>');
  t('heroPill',labels[type]);
  t('hP',p);t('hC',carbT);t('hF',fat);
  t('hCalTgt',calT);
  t('hDeficit','缺口 '+S.deficit+' kcal · 预计每周减 '+(S.deficit*7/7700).toFixed(1)+'kg');
  t('cf-p2',p);t('cf-c2',carbT);t('cf-f2',fat);
  t('cf-cal',calT+' kcal');
  buildCarbGrid();calcMeals();save();
}

function buildCarbBtns(){
  t('cbHighV',Math.round(S.chR*S.weight)+'g');
  t('cbMidV',Math.round(S.cmR*S.weight)+'g');
  t('cbLowV',Math.round(S.clR*S.weight)+'g');
  ['high','mid','low'].forEach(type=>{
    const b=$('cb'+type.charAt(0).toUpperCase()+type.slice(1));
    if(b) b.className='cbtn '+type+(S.carbType===type?' active':'');
  });
}

function calcMeals(){
  const w=S.weight,pf=S.pf,chR=S.chR,cmR=S.cmR,clR=S.clR,fatR=S.fatR;
  const ch=Math.round(chR*w),cm=Math.round(cmR*w),cl=Math.round(clR*w),fat=Math.round(fatR*w);
  const carbT=S.carbType==='high'?ch:S.carbType==='mid'?cm:cl;
  const pT=Math.round(pf*w);
  const calT=Math.round(pT*4+carbT*4+fat*9);

  const oat=g('f-oat'),eggN=g('f-eggn'),eggG=(g('f-eggg')||150);
  const milk=g('f-milk'),rice=g('f-rice'),chicken=g('f-chicken');
  const banN=g('f-bann'),banG=(g('f-bang')||200);
  const salmon=g('f-salmon'),rice2=g('f-rice2'),swG=g('f-sw');
  const beef=g('f-beef'),cas=g('f-cas'),alm=g('f-alm');

  const p=Math.round(oat/100*FD.oat.p+eggN*(eggG/100)*FD.egg.p+milk/100*FD.milk.p+chicken/100*FD.chicken.p+salmon/100*FD.salmon.p+beef/100*FD.beef.p+cas/100*FD.cas.p+alm/100*FD.alm.p);
  const c=Math.round(oat/100*FD.oat.c+rice/100*FD.rice.c+banN*(banG/100)*FD.ban.c+rice2/100*FD.rice.c+swG/100*FD.sw.c);
  const f=Math.round(oat/100*FD.oat.f+eggN*(eggG/100)*FD.egg.f+milk/100*FD.milk.f+alm/100*FD.alm.f);
  const calC=Math.round(p*4+c*4+f*9);

  $('hCalBar').style.width=pct(calC,calT)+'%';
  t('hCalCur',calC);t('pCur',p);t('cCur',c);t('fCur',f);
  t('r-oat',Math.round(oat/100*FD.oat.c));
  t('r-rice',Math.round(rice/100*FD.rice.c));
  t('r-rice2',Math.round(rice2/100*FD.rice.c));
  t('r-ban',Math.round(banN*(banG/100)*FD.ban.c));
  t('r-sw',Math.round(swG/100*FD.sw.c));
  save();
}

function setCD(idx){
  const cur=S.carbDays[idx];
  const t=cur==='high'?'mid':cur==='mid'?'low':'high';
  S.carbDays[idx]=t;
  const b=$('cg'+idx);
  if(b){b.className='dbtn '+(t==='high'?'hi':t==='mid'?'mi':'lo');b.querySelector('.lb').textContent=CARBN[t];}
  save();
}
function buildCarbGrid(){
  let h='';
  for(let i=0;i<7;i++){
    const t=S.carbDays[i];
    const c=t==='high'?'hi':t==='mid'?'mi':'lo';
    h+='<div class="dbtn '+c+'" onclick="setCD('+i+')" id="cg'+i+'"><div class="dn">'+DAYN[i]+'</div><div class="lb">'+CARBN[t]+'</div></div>';
  }
  $('carbGrid').innerHTML=h;
}

function setTD(idx){
  const cur=S.trainDays[idx];
  const next=cur==='strength'?'cardio':cur==='cardio'?'rest':'strength';
  S.trainDays[idx]=next;
  const b=$('tr'+idx);
  if(b){b.className='dbtn '+(next==='strength'?'s':next==='cardio'?'c':'x');b.querySelector('.lb').textContent=TRAINN[next];}
  save();
}
function buildTrainGrid(){
  let h='';
  for(let i=0;i<7;i++){
    const t=S.trainDays[i];
    const c=t==='strength'?'s':t==='cardio'?'c':'x';
    h+='<div class="dbtn '+c+'" onclick="setTD('+i+')" id="tr'+i+'"><div class="dn">'+DAYN[i]+'</div><div class="lb">'+TRAINN[t]+'</div></div>';
  }
  $('trainGrid').innerHTML=h;
}

function save(){
  const data={
    height:S.height,weight:S.weight,age:S.age,tw:S.tw,al:S.al,pf:S.pf,
    deficit:S.deficit,chR:S.chR,cmR:S.cmR,clR:S.clR,fatR:S.fatR,
    carbType:S.carbType,
    carbDays:S.carbDays.join(','),
    trainDays:S.trainDays.join(','),
    rd:S.rd,rhiit:S.rhiit,rs:S.rs,rr:S.rr,rw:S.rw,rc:S.rc
  };
  document.querySelectorAll('[id^=e-m]').forEach(el=>{if(el.id.match(/^e-m\d+-\d+$/))data[el.id]=el.value});
  ['rd','rhiit','rs','rr','rw','rc'].forEach(k=>{const el=$('s-'+k);if(el)data[k]=parseFloat(el.value)||0});
  ['oat','eggn','eggg','milk','rice','chicken','veg1','bann','bang','rice2','salmon','veg2','sw','beef','veg3','cas','alm'].forEach(k=>{const el=$('f-'+k);if(el)data['f'+k]=parseFloat(el.value)||0});
  try{localStorage.setItem('poijun',JSON.stringify(data));showN()}catch(e){}
}

function load(){
  try{
    const d=JSON.parse(localStorage.getItem('poijun'));
    if(!d)return;
    if(d.height!=null)$('s-height').value=d.height;
    if(d.weight!=null)$('s-weight').value=d.weight;
    if(d.age!=null)$('s-age').value=d.age;
    if(d.tw!=null)$('s-tw').value=d.tw;
    if(d.al){$('s-al').value=d.al;S.al=parseFloat(d.al)}
    if(d.pf){$('s-pf').value=d.pf;S.pf=parseFloat(d.pf)}
    if(d.deficit){$('s-deficit').value=d.deficit;S.deficit=parseInt(d.deficit)}
    if(d.chR){$('s-ch-r').value=d.chR;S.chR=parseFloat(d.chR)}
    if(d.cmR){$('s-cm-r').value=d.cmR;S.cmR=parseFloat(d.cmR)}
    if(d.clR){$('s-cl-r').value=d.clR;S.clR=parseFloat(d.clR)}
    if(d.fatR){$('s-fat-r').value=d.fatR;S.fatR=parseFloat(d.fatR)}
    if(d.carbType)S.carbType=d.carbType;
    if(d.carbDays)S.carbDays=d.carbDays.split(',');
    if(d.trainDays)S.trainDays=d.trainDays.split(',');
    ['rd','rhiit','rs','rr','rw','rc'].forEach(k=>{
      const el=$('s-'+k);if(el&&d[k]!=null)el.value=d[k];
      if(d[k]!=null)S[k]=d[k];
    });
    document.querySelectorAll('[id^=e-m]').forEach(el=>{const v=d[el.id];if(v!=null)el.value=v});
    ['oat','eggn','eggg','milk','rice','chicken','veg1','bann','bang','rice2','salmon','veg2','sw','beef','veg3','cas','alm'].forEach(k=>{const el=$('f-'+k);const v=d['f'+k];if(el&&v!=null)el.value=v});
  }catch(e){}
}

document.addEventListener('DOMContentLoaded',()=>{
  load();
  // 新的一天：清空输入栏但保留计算系数
  const lastDate=localStorage.getItem('poijun_date');
  const today=new Date().toDateString();
  if(lastDate&&lastDate!==today){
    // 清空食物输入
    ['oat','eggn','eggg','milk','rice','chicken','veg1','bann','bang','rice2','salmon','veg2','sw','beef','veg3','cas','alm'].forEach(k=>{const el=$('f-'+k);if(el)el.value=''});
    // 清空饮食记录显示
    ['hCalCur','pCur','cCur','fCur'].forEach(id=>t(id,'—'));
    $('hCalBar').style.width='0%';
  }
  localStorage.setItem('poijun_date',today);
  calcAll();
});
