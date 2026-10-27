/* ===== EASY SETTINGS ===== */
const WHATSAPP_NUMBER = "PENDENTE_NUMERO_RAFAEL"; // international digits only, e.g. 5531999999999
const EMERGENCY_NUMBER = "PENDENTE_NUMERO_EMERGENCIA"; // country emergency number
const GAME = new Date("2026-10-31T00:00:00-03:00");
/* Image mapping: drop files into images/ with these names */
const IMAGES = {
  neck_rom:"images/ex01-neck-rom.png", chin_tuck:"images/ex02-chin-tuck.png", pendulum:"images/ex03-pendulum.png",
  scap_set:"images/ex04-scapular-set.png", shoulder_iso:"images/ex05-shoulder-isometrics.png",
  neck_iso:"images/ex06-neck-isometrics.png", conditioning:"images/ex07-conditioning.png",
  tackle_head_up:"images/ex08-head-up-tackle.png", pads:"images/ex09-shoulder-pads-ac-pad.png"
};
const STOP = "Stop if you feel numbness, tingling or weakness in the arm.";
const EX = {
  neck_rom:{t:"Neck movement",start:"Sit tall.",move:"Slowly turn, tilt, bend forward and back, only within comfort.",dose:"2 x 5 each direction",stop:"Stop with any symptom in the arm."},
  chin_tuck:{t:"Chin tuck lying down",start:"Lie on your back, folded towel under your head, knees bent.",move:"Make a small 'yes' nod, tuck the chin gently back and hold.",dose:"10 x 10 s",stop:"Stop with any arm symptom or if neck pain increases."},
  pendulum:{t:"Pendulum / assisted shoulder motion",start:"Lean forward, good hand on a table, injured arm hanging loose.",move:"Small circles and back-and-forth by swaying your body. Or lift the arm with a stick, pain free.",dose:"2 x 30 to 60 s",stop:"Stop if pain goes above 2/10 or any numbness."},
  scap_set:{t:"Shoulder blade set",start:"Sit or stand, arms by your side.",move:"Gently draw the shoulder blades back and down. Hold.",dose:"2 x 10, hold 5 s",stop:"Stop if pain goes above 2/10 or any numbness."},
  shoulder_iso:{t:"Shoulder isometrics (5 directions)",start:"Stand by a wall or door frame, elbow bent 90 degrees at your side, towel between hand and wall.",move:"Push into the wall without moving the arm: out, in, forward, side, back.",dose:"5 x 10 s each direction",stop:"Keep pain at 2/10 or less. Stop with any numbness, tingling or weakness."},
  neck_iso:{t:"Gentle neck isometrics",start:"Sit. Hand on forehead, then back of head, then side of head.",move:"Push your head gently into the hand without moving.",dose:"5 x 5 s each direction",stop:"ONLY if Rafael says your neuro exam was normal. Stop with any arm symptom or neck pain."},
  conditioning:{t:"Conditioning",start:"Bike, legs and core.",move:"Bike 15 to 20 min moderate. Legs: squat, lunge, jumps, trap bar only if no shoulder pain. Core with no weight on the injured arm (dead bug with injured arm still, side plank on the good side).",dose:"Legs 3 x 8 to 12",stop:"Stop if shoulder pain goes above 2/10 or any numbness."}
};
const PH1 = ["neck_rom","chin_tuck","pendulum","scap_set","shoulder_iso","neck_iso","conditioning"];
const DAYS = [
 {id:"2026-10-27",d:"TUE",n:"27",title:"Session day",ex:PH1,tasks:["Session with Rafael: full neuro exam first","Book X-ray (AC joint and collarbone) and a sports doctor visit this week"]},
 {id:"2026-10-28",d:"WED",n:"28",title:"Phase 1 at home",ex:PH1,tasks:["Sports doctor or orthopedist this week","X-ray booked or done"]},
 {id:"2026-10-29",d:"THU",n:"29",title:"Test day",ex:PH1,tasks:["Tests with Rafael (see Game tab)","Bring X-ray and doctor notes if you have them"]},
 {id:"2026-10-30",d:"FRI",n:"30",title:"Light day",ex:PH1,tasks:["Only if cleared: try pads, AC pad and tape at practice. Never try new tape on game day","No contact unless the doctor cleared you"]},
 {id:"2026-10-31",d:"SAT",n:"31",title:"Game day",ex:[],tasks:["Default plan: you do NOT play. Stay with the team without contact (watch, film study) if the coach wants","Only if ALL criteria are met and the doctor cleared you: follow the game day checklist (Game tab)"]},
 {id:"2026-11-01",d:"SUN",n:"01",title:"Recovery and recheck",ex:["neck_rom","scap_set","conditioning"],tasks:["Recheck with Rafael: same neuro tests","Report any numbness, tingling or weakness"]},
 {id:"2026-11-02",d:"MON",n:"02",title:"Recheck",ex:["neck_rom","scap_set","conditioning"],tasks:["Recheck with Rafael: same tests as Thursday","Next phase only by criteria, not by calendar"]}
];
/* ===== state ===== */
const KEY="lm-rehab-v1";
let S=JSON.parse(localStorage.getItem(KEY)||"{}");
const save=()=>localStorage.setItem(KEY,JSON.stringify(S));
const today=()=>{const t=new Date();const iso=t.toLocaleDateString("en-CA",{timeZone:"America/Sao_Paulo"});return DAYS.find(d=>d.id===iso)?iso:(iso<DAYS[0].id?DAYS[0].id:DAYS[DAYS.length-1].id)};
let cur=today();
const $=s=>document.querySelector(s);
function imgSlot(k){return `<div class="img" data-src="${IMAGES[k]}"><svg width="70" height="70" viewBox="0 0 70 70" fill="none" stroke="#7ADFBB" stroke-width="2"><circle cx="35" cy="14" r="8"/><path d="M35 22v24M35 30l-14 8M35 30l14 8M35 46l-10 18M35 46l10 18"/></svg><span>Illustration coming: ${IMAGES[k].split('/')[1]}</span></div>`}
function exHTML(day,k){const e=EX[k],id=day+"|"+k,c=(S.done||{})[id]?"checked":"";return `<div class="ex"><input type="checkbox" class="chk" id="${id}" ${c} onchange="tick('${id}',this.checked)"><label for="${id}"><h3>${e.t}</h3>${imgSlot(k)}<div><b>Start:</b> ${e.start}</div><div><b>Move:</b> ${e.move}</div><span class="dose">${e.dose}</span><div class="stop">${e.stop}</div></label></div>`}
function prog(){const all=[];DAYS.forEach(d=>d.ex.forEach(k=>all.push(d.id+"|"+k)));const n=all.filter(i=>(S.done||{})[i]).length;return [n,all.length]}
function tick(id,v){S.done=S.done||{};S.done[id]=v;save();renderBars()}
function renderBars(){const [n,t]=prog();document.querySelectorAll(".pbar").forEach(b=>b.innerHTML=`<div class="bar"><i style="width:${t?n/t*100:0}%"></i></div><small>${n} of ${t} exercises done this week</small>`);const d=DAYS.find(x=>x.id===cur);const dn=d.ex.filter(k=>(S.done||{})[d.id+"|"+k]).length;document.querySelectorAll(".dbar").forEach(b=>b.innerHTML=`<div class="bar"><i style="width:${d.ex.length?dn/d.ex.length*100:0}%"></i></div><small>${dn} of ${d.ex.length} today</small>`)}
function renderHome(){const ms=GAME-new Date();const dd=Math.max(0,Math.floor(ms/864e5)),hh=Math.max(0,Math.floor(ms%864e5/36e5));const d=DAYS.find(x=>x.id===today());
$("#home").innerHTML=`<p class="micro">Your plan until Saturday</p><h1>LET'S GO, <span class="k">LARMAR</span></h1>
<div class="count"><div><b>${dd}</b><span>days</span></div><div><b>${hh}</b><span>hours</span></div></div><p class="micro" style="text-align:center">to the game, Saturday 31/10</p>
<div class="card"><p class="micro">Today's recommendation for Saturday</p><div class="no">NOT CLEARED TO PLAY</div><p>This only changes after a full neuro exam, an X-ray, neck imaging and medical clearance. The final decision is the doctor's.</p></div>
<h2>TODAY: <span class="k">${d.d} ${d.n}</span></h2><div class="card"><h3>${d.title}</h3><ul class="l">${d.tasks.map(t=>`<li>${t}</li>`).join("")}</ul><div class="pbar"></div></div>
<button class="btn" onclick="go('day')">Open today's exercises</button><button class="btn alt" onclick="go('check')">Daily check-in</button>
<div class="note">Pain rule: shoulder pain up to 2/10 during exercise is OK if it settles in 24 h. Numbness rule: numbness, tingling or weakness is never OK. Stop and tell Rafael.</div>`;renderBars()}
function renderDay(){const d=DAYS.find(x=>x.id===cur);
$("#day").innerHTML=`<p class="micro">Day by day</p><div class="days">${DAYS.map(x=>`<button class="${x.id===cur?'on':''}" onclick="cur='${x.id}';renderDay()">${x.d}<b>${x.n}</b></button>`).join("")}</div>
<h1>${d.d} ${d.n}: <span class="k">${d.title}</span></h1><div class="dbar"></div><div class="card"><ul class="l">${d.tasks.map(t=>`<li>${t}</li>`).join("")}</ul></div>
<div class="note">${STOP} Pain above 2/10: stop that exercise. Do NOT do: bench press, push-ups, dips, overhead weights, weight on the injured shoulder, contact, neck cracking.</div>
${d.ex.length?d.ex.map(k=>exHTML(d.id,k)).join(""):'<div class="card">No exercise program today. Follow the game day plan.</div>'}
<div class="card"><small>Home program from Natália (file 03) still to come: <span class="pend">PENDENTE</span>. Exercises above are the phase 1 exercises from today's session plan.</small></div>`;renderBars()}
function renderCheck(){const c=(S.check||{})[cur]||{};
$("#check").innerHTML=`<p class="micro">Daily check-in · ${cur.split("-").reverse().slice(0,2).join("/")}</p><h1>HOW ARE <span class="k">YOU</span> TODAY</h1>
<h3>Shoulder pain now (0 to 10)</h3><div class="pain">${[...Array(11)].map((_,i)=>`<button class="${c.pain===i?'on':''}" onclick="setC('pain',${i})">${i}</button>`).join("")}</div>
<h3 style="margin-top:18px">Any numbness or tingling?</h3><div class="yn"><button class="${c.numb===true?'on':''}" onclick="setC('numb',true)">YES</button><button class="${c.numb===false?'on':''}" onclick="setC('numb',false)">NO</button></div>
<h3 style="margin-top:18px">Where?</h3><div class="where">${["Injured arm","Other arm","Both arms","Legs","Neck","Hand or fingers"].map(w=>`<label><input type="checkbox" ${(c.where||[]).includes(w)?'checked':''} onchange="toggleW('${w}',this.checked)">${w}</label>`).join("")}</div>
<button class="btn" onclick="submitC()">Save check-in</button><a class="btn alt" id="wa" href="#" onclick="return sendWA()">Send report to Rafael</a>`}
function setC(k,v){S.check=S.check||{};S.check[cur]=S.check[cur]||{};S.check[cur][k]=v;save();renderCheck()}
function toggleW(w,on){setC('where',[...new Set(((S.check||{})[cur]||{}).where||[])].filter(x=>x!==w).concat(on?[w]:[]))}
function submitC(){const c=(S.check||{})[cur]||{};const w=c.where||[];if(w.includes("Both arms")||w.includes("Legs"))return showAlert(true);if(c.numb||w.some(x=>x!=="Neck"))return showAlert(false);alert("Saved. Keep going.")}
function showAlert(em){const a=$("#alert");a.className="alert show"+(em?" em":"");a.innerHTML=em?`<p class="micro">Emergency</p><div class="big">STOP. CALL FOR HELP NOW</div><p>Symptoms in both arms or in the legs can mean a spinal cord problem. Do not move your neck.</p><a class="btn" href="tel:${EMERGENCY_NUMBER}">Call emergency: ${EMERGENCY_NUMBER}</a><a class="btn alt" href="#" onclick="return sendWA()">Tell Rafael</a><button class="btn alt" onclick="hideA()">Back</button>`:`<p class="micro">Red flag</p><div class="big">STOP TRAINING TODAY</div><p>Numbness, tingling or weakness is not normal pain. Stop all exercise and contact. Tell Rafael today.</p><ul class="l"><li>If it spreads to both arms or legs, or weakness gets worse: emergency.</li><li>No contact and no exercise that brings it back.</li></ul><a class="btn" href="#" onclick="return sendWA()">Send report to Rafael</a><button class="btn alt" onclick="hideA()">Back</button>`}
function hideA(){$("#alert").className="alert"}
function waText(){const c=(S.check||{})[cur]||{};const d=DAYS.find(x=>x.id===cur);const done=d.ex.filter(k=>(S.done||{})[cur+"|"+k]).map(k=>EX[k].t);return `Larmar rehab report ${cur.split("-").reverse().slice(0,2).join("/")}\nPain: ${c.pain??"-"}/10\nNumbness: ${c.numb===true?"YES":c.numb===false?"no":"-"}${(c.where||[]).length?" ("+c.where.join(", ")+")":""}\nExercises done (${done.length}/${d.ex.length}): ${done.join(", ")||"none"}`}
function sendWA(){window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waText())}`,"_blank");return false}
function renderGame(){
$("#game").innerHTML=`<p class="micro">Saturday 31/10</p><h1>GAME <span class="k">CLEARANCE</span></h1>
<div class="card"><div class="no">TODAY: DO NOT PLAY</div><p>Not until: full neuro exam, X-ray of the AC joint (Zanca view, both sides) and collarbone, neck imaging and medical clearance. The final decision is the doctor's.</p><p>If the AC injury is grade III or higher, or you still get numbness crossing the arm on Friday, you do not play.</p></div>
<h2>THURSDAY <span class="k">TESTS</span></h2><p><small>All must be yes. Rafael runs these.</small></p><ul class="list">${["X-ray: no fracture, no AC grade III or higher, no injury at the breastbone joint","Neuro exam normal and the same on both sides (strength, feeling, reflexes), no symptoms in neck tests or in football moves","Neck: full movement, no pain","Shoulder: full movement","Arm across the body: pain 2/10 or less (team rule, not validated, never clears you alone)","Strength close to the other side","DB tests with no pain or numbness: backpedal, pass break-up, contested catch, progressive tackle, neuro recheck after each block","No worse 24 h later","Neck imaging with nothing that rules out playing","Medical clearance"].map((t,i)=>`<li>${chkBox("crit"+i)}<label for="crit${i}">${t}</label></li>`).join("")}</ul>
<h2>GAME DAY <span class="k">CHECKLIST</span></h2><p><small>Only if every test above is yes.</small></p>${imgSlot("pads")}<ul class="list">${["Shoulder pads fit snug, no gap over the AC joint","AC pad (donut) under the pads, tested Friday","Tape tested Friday, fits under the pads (optional, comfort only)","Neck collar only if the doctor cleared it","Shoulder and DB warm-up","Neuro recheck before the game and at halftime","Head-up tackling: eyes on the target, hit with shoulder and chest, never lead with the head"].map((t,i)=>`<li>${chkBox("g"+i)}<label for="g${i}">${t}</label></li>`).join("")}</ul>${imgSlot("tackle_head_up")}
<h2>STOP <span class="k">RULES</span></h2><div class="card ind"><ul class="l"><li>Numbness, a shock or weakness in the arm: you come out and do not return this game.</li><li>Symptoms in both arms or in the legs: emergency. Do not move the neck. Medical team protocol.</li><li>Pain that changes how you tackle: come out.</li></ul></div>
<h2>AFTER THE <span class="k">GAME</span></h2><ul class="l"><li>Sunday and Monday: recheck with Rafael, same neuro tests.</li><li>Report any numbness, tingling or weakness right away.</li></ul>`}
function chkBox(k){return `<input type="checkbox" class="chk" id="${k}" ${(S.g||{})[k]?'checked':''} onchange="S.g=S.g||{};S.g['${k}']=this.checked;save()">`}
function renderLearn(){
$("#learn").innerHTML=`<p class="micro">Understand your injury</p><h1>KNOW YOUR <span class="k">BODY</span></h1>
<div class="card"><h3>What might be going on</h3><p>Three possibilities, none confirmed yet. That is why you need the exam and imaging.</p><ul class="l"><li><b>AC joint injury:</b> the joint on top of the shoulder. Grade still unknown.</li><li><b>Stinger (burner):</b> a nerve in the neck or shoulder gets stretched or pinched in a tackle. It can cause numbness or burning in the arm.</li><li><b>Neck injury:</b> must be ruled out before any contact.</li></ul></div>
<div class="card"><h3>Why not play with symptoms</h3><p>Playing with symptoms goes against expert consensus, and stingers often come back, about 1 in 5.</p></div>
<div class="card"><h3>Your two rules</h3><ul class="l"><li>Shoulder pain up to 2/10 during exercise is OK if it settles in 24 h.</li><li>Numbness, tingling or weakness is never OK. Stop and tell Rafael.</li></ul></div>
<div class="card"><h3>Laser and electrotherapy</h3><p>Optional, for comfort only. Weak evidence. They do not replace exercise or change the game decision.</p></div>
<div class="card"><small>Full education program from Natália (file 04): <span class="pend">PENDENTE</span></small></div>
<h2>RED FLAG <span class="k">CARD</span></h2><div class="card ind"><p class="micro">Emergency, call now</p><ul class="l"><li>Symptoms in both arms</li><li>Symptoms in the legs</li><li>Weakness getting worse</li><li>Loss of bladder or bowel control</li><li>Severe neck pain after the hit</li></ul><a class="btn" href="tel:${EMERGENCY_NUMBER}">Emergency: ${EMERGENCY_NUMBER}</a></div>
<h2>STILL TO <span class="k">CONFIRM</span></h2><ul class="l"><li>Dominant side: <span class="pend">PENDENTE</span></li><li>Numbness passed or still there: <span class="pend">PENDENTE</span></li><li>Number of past stingers: <span class="pend">PENDENTE</span></li></ul>
<p style="margin-top:20px"><small>Rafael Cestaro, physiotherapist, CREFITO-4 235926-F. InterAção, Belo Horizonte. This plan does not replace your doctor.</small></p>`}
function go(t){document.querySelectorAll("section").forEach(s=>s.classList.toggle("on",s.id===t));document.querySelectorAll("nav button").forEach(b=>b.classList.toggle("on",b.dataset.t===t));({home:renderHome,day:renderDay,check:renderCheck,game:renderGame,learn:renderLearn})[t]();loadImgs();scrollTo(0,0)}
function loadImgs(){document.querySelectorAll(".img[data-src]").forEach(el=>{const i=new Image();i.onload=()=>{el.innerHTML="";el.appendChild(i)};i.alt="";i.src=el.dataset.src})}
if("serviceWorker"in navigator)navigator.serviceWorker.register("sw.js").catch(()=>{});
go(location.hash.slice(1)||"home");
