/* ===== DATA ===== */
const ROWS=[["あいうえお","a i u e o"],["かきくけこ","ka ki ku ke ko"],["さしすせそ","sa shi su se so"],["たちつてと","ta chi tsu te to"],["なにぬねの","na ni nu ne no"],["はひふへほ","ha hi fu he ho"],["まみむめも","ma mi mu me mo"],["や_ゆ_よ","ya _ yu _ yo"],["らりるれろ","ra ri ru re ro"],["わ___を","wa _ _ _ wo"],["ん","n"]];
const DAK=[["がぎぐげご","ga gi gu ge go"],["ざじずぜぞ","za ji zu ze zo"],["だぢづでど","da ji zu de do"],["ばびぶべぼ","ba bi bu be bo"],["ぱぴぷぺぽ","pa pi pu pe po"]];
const kata=s=>[...s].map(c=>c>="ぁ"&&c<="ゖ"?String.fromCharCode(c.charCodeAt(0)+96):c).join("");
const build=(rows,k)=>rows.map(([s,r])=>{const R=r.split(" ");return[...s].map((c,i)=>({jp:k?kata(c):c,ro:R[i]}))});
const SETS={hiragana:{name:"ฮิรางะนะ",icon:"あ",groups:[["พื้นฐาน",build(ROWS)],["เสียงขุ่น / กึ่งขุ่น",build(DAK)]]},
katakana:{name:"คาตาคานะ",icon:"ア",groups:[["พื้นฐาน",build(ROWS,1)],["เสียงขุ่น / กึ่งขุ่น",build(DAK,1)]]}};
const VOCAB=`こんにちは|konnichiwa|สวัสดี/hello/hi
ありがとう|arigatou|ขอบคุณ/thank you/thanks
さようなら|sayounara|ลาก่อน/goodbye/bye
おはよう|ohayou|อรุณสวัสดิ์/good morning
すみません|sumimasen|ขอโทษ/excuse me/sorry
はい|hai|ใช่/yes
いいえ|iie|ไม่ใช่/no
みず|mizu|น้ำ/water
ねこ|neko|แมว/cat
いぬ|inu|หมา/dog/สุนัข
さかな|sakana|ปลา/fish
ほん|hon|หนังสือ/book
くるま|kuruma|รถ/car
でんしゃ|densha|รถไฟ/train
がっこう|gakkou|โรงเรียน/school
せんせい|sensei|ครู/teacher
ともだち|tomodachi|เพื่อน/friend
たべる|taberu|กิน/to eat/eat
のむ|nomu|ดื่ม/to drink/drink
いく|iku|ไป/to go/go
みる|miru|ดู/to see/to watch/see/watch
やま|yama|ภูเขา/mountain
うみ|umi|ทะเล/sea/ocean
おいしい|oishii|อร่อย/delicious/tasty
おおきい|ookii|ใหญ่/big/large
ちいさい|chiisai|เล็ก/small
にほん|nihon|ญี่ปุ่น/japan
さくら|sakura|ซากุระ/cherry blossom
コーヒー|koohii|กาแฟ/coffee
ラーメン|raamen|ราเมน/ramen`.split("\n").map(l=>{const[jp,ro,m]=l.split("|"),a=m.split("/");return{jp,ro,th:a[0],en:a.slice(1),alts:a}});
const flat=k=>SETS[k].groups.flatMap(g=>g[1].flat()).filter(x=>x.ro!=="_"&&x.jp!=="_");

/* ===== UTIL ===== */
const $=s=>document.querySelector(s),app=$("#app");
const norm=s=>s.toLowerCase().trim().replace(/\s+/g," ").replace(/\bsi\b/g,"shi").replace(/\bti\b/g,"chi").replace(/\btu\b/g,"tsu").replace(/\bhu\b/g,"fu").replace(/\b(zi|di)\b/g,"ji").replace(/\bdu\b/g,"zu").replace(/ou\b/g,"o").replace(/oo/g,"o");
const say=t=>{if(!window.speechSynthesis)return;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.lang="ja-JP";u.rate=.8;speechSynthesis.speak(u)};
const shuffle=a=>[...a].sort(()=>Math.random()-.5);
const store={get:(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}},set:(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}}};
let best=store.get("best",0),streak=0;
let xp=store.get("xp",0);const lvl=()=>Math.floor(xp/100)+1;const addXp=n=>{xp+=n;store.set("xp",xp);hud()};
const hud=()=>{$("#hudStreak").textContent="🔥 "+streak+" · 🏆 "+best;$("#hudBest").textContent="⭐ Lv "+lvl()+" · "+(xp%100)+"/100"};
const rain=()=>{const r=$("#rain"),ch="あいうえおアイウエオ日月火水木金土桜愛夢";for(let i=0;i<22;i++){const s=document.createElement("span");s.textContent=ch[Math.floor(Math.random()*ch.length)];s.style.cssText=`left:${Math.random()*100}%;font-size:${20+Math.random()*50}px;animation-duration:${14+Math.random()*20}s;animation-delay:-${Math.random()*30}s`;r.append(s)}};

/* ===== VIEWS ===== */
const tile=(h,k,t,s,c="")=>`<a class="tile ${c}" href="${h}"><span class="kana">${k}</span><h2>${t}</h2><small>${s}</small></a>`;
const views={
home:()=>`<section class="hero"><div><h1>เรียนภาษาญี่ปุ่น </h1><p>ฝึกอ่านตัวอักษร ฟังเสียงจริง จำคำศัพท์ แล้วพิมพ์ตอบเองในโหมดทดสอบ เก็บสถิติสูงสุดไว้ในเครื่องคุณ</p>
<div class="tiles">${tile("#/learn","学","แบบเรียน","ตารางอักษร • เสียงอ่าน • แฟลชการ์ด","")}${tile("#/test","試","แบบทดสอบ","พิมพ์ตอบเอง • สะสมสตรีค","red")}</div></div><div class="vert" aria-hidden="true">日本語</div></section>`,
menu:m=>`<a class="crumb" href="#/">← กลับหน้าแรก</a><h1 class="page">${m=="learn"?"แบบเรียน":"แบบทดสอบ"}</h1><p class="sub">เลือกหมวดที่อยากฝึก</p><div class="tiles">${tile(`#/${m}/hiragana`,"あ","ฮิรางะนะ","46 ตัว + เสียงขุ่น")}${tile(`#/${m}/katakana`,"ア","คาตาคานะ","ใช้เขียนคำต่างชาติ")}${tile(`#/${m}/vocab`,"語","คำศัพท์",VOCAB.length+" คำพื้นฐาน")}</div>`,
learnKana:k=>`<a class="crumb" href="#/learn">← แบบเรียน</a><h1 class="page">${SETS[k].name}</h1><p class="sub">กดที่ตัวอักษรเพื่อฟังเสียงอ่าน (เสียงมาจากเบราว์เซอร์ของคุณ)</p>`+SETS[k].groups.map(([n,rows])=>`<div class="sec">${n}</div><div class="grid">${rows.flat().map(x=>x.ro==="_"||x.jp==="_"?`<div class="card blank"></div>`:`<button class="card" data-s="${x.jp}">${x.jp}<small>${x.ro}</small></button>`).join("")}</div>`).join("")+`<a class="btn" href="#/test/${k}">ทดสอบเลย</a>`,
learnVocab:()=>`<a class="crumb" href="#/learn">← แบบเรียน</a><h1 class="page">คำศัพท์</h1><p class="sub">กดการ์ดเพื่อพลิกดูความหมาย • กดค้างไม่ต้อง แค่กดซ้ำเพื่อฟังเสียง</p><div class="vgrid">${VOCAB.map(v=>`<button class="flip" data-s="${v.jp}"><div><span class="face front"><b>${v.jp}</b><span>${v.ro}</span></span><span class="face back">${v.th}<small>${v.en[0]||""}</small></span></div></button>`).join("")}</div><a class="btn" href="#/test/vocab">ทดสอบเลย</a>`
};

/* ===== VIEWS V2 ===== */
const kname=k=>k==="vocab"?"คำศัพท์":SETS[k].name;
const T={learn:["แบบเรียน","เลือกหมวดที่อยากฝึก"],test:["แบบทดสอบ","เลือกหมวดที่อยากทดสอบ"],"play/match":["จับคู่การ์ด","เลือกหมวดที่อยากเล่น"],"play/speed":["สปีดรัน 30 วิ","เลือกหมวดที่อยากเล่น"]};
views.home=()=>`<section class="hero"><div><h1>เรียนภาษาญี่ปุ่น<br>ให้เฟี้ยว ให้แจ่ม</h1><p>อ่าน ฟัง เล่นเกม ทำแบบทดสอบ สะสม XP </p>
<div class="tiles">${tile("#/learn","学","แบบเรียน","ตารางอักษร • แฟลชการ์ด")}${tile("#/test","試","แบบทดสอบ","แตะเลือก • พิมพ์ • ฟัง","red")}${tile("#/play","遊","เกม","จับคู่ • สปีดรัน","blue")}</div></div><div class="vert" aria-hidden="true">日本語</div></section>`;
views.menu=m=>`<a class="crumb" href="${m.startsWith("play/")?"#/play":"#/"}">← กลับ</a><h1 class="page">${T[m][0]}</h1><p class="sub">${T[m][1]}</p><div class="tiles">${tile(`#/${m}/hiragana`,"あ","ฮิรางะนะ","46 ตัว + เสียงขุ่น")}${tile(`#/${m}/katakana`,"ア","คาตาคานะ","คำต่างชาติ")}${tile(`#/${m}/vocab`,"語","คำศัพท์",VOCAB.length+" คำพื้นฐาน")}</div>`;
views.play=()=>`<a class="crumb" href="#/">← กลับ</a><h1 class="page">เกม</h1><p class="sub">เล่นสนุกแล้วได้ XP ด้วย</p><div class="tiles">${tile("#/play/match","🃏","จับคู่การ์ด","จับอักษรคู่กับคำอ่าน/คำแปล","red")}${tile("#/play/speed","⚡","สปีดรัน","30 วินาที ตอบให้ได้มากที่สุด","blue")}</div>`;

/* ===== QUIZ V2 ===== */
let run=0;
const lab=(q,k)=>k==="vocab"?q.en[0]+" · "+q.th:q.ro;
const mk=(q,pool,k,listen)=>{const f=listen?x=>x.jp:x=>lab(x,k),a=f(q),set=new Set([a]);for(const x of shuffle(pool)){if(set.size>=4)break;set.add(f(x))}return shuffle([...set]).map(t=>({t,ok:t===a}))};
const opts=(q,pool,k,l)=>`<div class="opts ${l?"jp":""}">${mk(q,pool,k,l).map(o=>`<button class="opt" data-ok="${o.ok}">${o.t}</button>`).join("")}</div>`;
const bump=()=>{if(streak>best){best=streak;store.set("best",best)}hud()};
const pickMode=k=>{app.innerHTML=`<a class="crumb" href="#/test">← กลับ</a><h1 class="page">เลือกวิธีตอบ</h1><p class="sub">${kname(k)}</p><div class="tiles">${tile(`#/test/${k}/choice`,"👆","แตะเลือก","4 ตัวเลือก เหมาะกับมือถือ")}${tile(`#/test/${k}/type`,"⌨️","พิมพ์ตอบเอง","พิมพ์โรมันจิ / คำแปล","red")}${tile(`#/test/${k}/listen`,"👂","ฟังแล้วเลือก","ฟังเสียง เลือกตัวที่ใช่","blue")}</div>`};
function quiz(kind,mode){
  if(!["choice","type","listen"].includes(mode))return pickMode(kind);
  const pool=kind==="vocab"?VOCAB:flat(kind),N=10,qs=shuffle(pool).slice(0,N),word=kind==="vocab",id=++run;let i=0,score=0,miss=[],locked=false;
  const ans=q=>word?q.en[0]+" / "+q.th:q.ro;
  const show=()=>{locked=false;const q=qs[i];
    const prompt=mode==="listen"?`<button class="q speak" id="snd" aria-label="ฟังเสียง">🔊</button><div class="hint">แตะเพื่อฟังอีกครั้ง แล้วเลือกตัวที่ได้ยิน</div>`:`<div class="q ${word?"word":""}">${q.jp}</div><div class="hint">${mode==="type"?(word?"พิมพ์ความหมาย (อังกฤษ/ไทย)":"พิมพ์โรมันจิ เช่น ka, shi")+" • ":""}<a href="#" id="snd">🔊 ฟังเสียง</a></div>`;
    const body=mode==="type"?`<input id="ans" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="คำตอบ"><div class="fb" id="fb"></div><button class="btn" id="go">ตรวจคำตอบ</button><button class="btn ghost" id="skip">ข้าม</button>`:opts(q,pool,kind,mode==="listen")+`<div class="fb" id="fb"></div>`;
    app.innerHTML=`<div class="quiz"><a class="crumb" href="#/test/${kind}">← เปลี่ยนโหมด</a><div class="bar"><i style="width:${i/N*100}%"></i></div>${prompt}${body}</div>`;
    $("#snd").onclick=e=>{e.preventDefault();say(q.jp)};setTimeout(()=>say(q.jp),150);
    if(mode==="type"){const inp=$("#ans");inp.focus();$("#go").onclick=check;$("#skip").onclick=()=>{if(!locked)finish(false)};inp.onkeydown=e=>{if(e.key==="Enter")check()}}
    else document.querySelectorAll(".opt").forEach(b=>b.onclick=()=>{if(locked)return;const ok=b.dataset.ok==="true";b.classList.add(ok?"ok":"no");if(!ok)$('.opt[data-ok="true"]').classList.add("ok");finish(ok)});
  };
  const check=()=>{if(locked)return;const v=norm($("#ans").value);if(!v)return;const q=qs[i];finish(word?q.alts.some(a=>norm(a)===v)||norm(q.ro)===v:norm(q.ro)===v)};
  const finish=ok=>{locked=true;const q=qs[i];
    if(ok){score++;streak++;addXp(10)}else{streak=0;miss.push(`${q.jp} = ${ans(q)}`)}
    bump();if(mode==="type"){$("#ans").className=ok?"ok":"no";$("#go")?.remove();$("#skip")?.remove()}
    $("#fb").innerHTML=ok?`✅ ถูกต้อง! +10 XP`:`❌ เฉลย: <b>${ans(q)}</b>`;
    setTimeout(()=>{if(id!==run)return;i++;i<N?show():end()},ok?700:1500)};
  const end=()=>{addXp(score>=9?20:0);app.innerHTML=`<div class="quiz"><div class="score">${score}/${N}</div><h1 class="page">${score>=9?"สุดยอด! 🌸":score>=6?"เก่งมาก!":"ฝึกอีกนิดนะ สู้ๆ!"}</h1><p class="sub">${hudText()}</p>${miss.length?`<div class="sec">ที่ควรทบทวน</div><div class="wrong">${miss.map(m=>`<span>${m}</span>`).join("")}</div>`:""}<a class="btn" href="#/test/${kind}/${mode}" id="again">เล่นอีกรอบ</a><a class="btn ghost" href="#/learn/${kind}">กลับไปเรียน</a></div>`;$("#again").onclick=e=>{e.preventDefault();quiz(kind,mode)}};
  show();
}
const hudText=()=>`⭐ Lv ${lvl()} • สตรีคสูงสุด 🏆 ${best}`;

/* ===== GAMES ===== */
function match(kind){
  const pool=kind==="vocab"?VOCAB:flat(kind),ps=shuffle(pool).slice(0,6);run++;
  const cards=shuffle(ps.flatMap((p,n)=>[{id:n,t:p.jp,j:1},{id:n,t:lab(p,kind),j:0}]));
  let sel=null,done=0,moves=0;const t0=Date.now();
  app.innerHTML=`<a class="crumb" href="#/play/match">← กลับ</a><h1 class="page">จับคู่การ์ด</h1><p class="sub">แตะอักษรกับคำอ่าน/คำแปลที่ตรงกัน • <b id="mv">0</b> ครั้ง</p><div class="mgrid">${cards.map((c,n)=>`<button class="mc ${c.j?"jp":""}">${c.t}</button>`).join("")}</div>`;
  document.querySelectorAll(".mc").forEach((b,n)=>b.onclick=()=>{
    const c=cards[n];if(b.classList.contains("hit")||b.classList.contains("bad")||(sel&&sel.b===b))return;
    if(c.j)say(c.t);b.classList.add("on");if(!sel){sel={b,c};return}
    const s=sel;sel=null;moves++;$("#mv").textContent=moves;
    if(s.c.id===c.id&&s.c.j!==c.j){[s.b,b].forEach(x=>{x.classList.remove("on");x.classList.add("hit")});streak++;bump();if(++done===6)win()}
    else{[s.b,b].forEach(x=>x.classList.add("bad"));streak=0;hud();setTimeout(()=>[s.b,b].forEach(x=>x.classList.remove("on","bad")),500)}});
  const win=()=>{const xpg=Math.max(20,70-moves*3);addXp(xpg);setTimeout(()=>{app.innerHTML=`<div class="quiz"><div class="score">🎉</div><h1 class="page">จับคู่ครบแล้ว!</h1><p class="sub">${moves} ครั้ง • ${Math.round((Date.now()-t0)/1000)} วินาที • +${xpg} XP</p><a class="btn" href="#/play/match/${kind}" id="again">เล่นอีกรอบ</a><a class="btn ghost" href="#/play">เกมอื่น</a></div>`;$("#again").onclick=e=>{e.preventDefault();match(kind)}},500)};
}
function speed(kind){
  const pool=kind==="vocab"?VOCAB:flat(kind),id=++run,key="sp_"+kind,hi=store.get(key,0);let t=30,score=0,q;
  app.innerHTML=`<div class="quiz"><a class="crumb" href="#/play/speed">← กลับ</a><div class="bar"><i id="tb" style="width:100%"></i></div><div class="hud2"><span>⏱ <b id="tm">30</b></span><span>คะแนน <b id="sc">0</b></span><span>🏆 ${hi}</span></div><div class="q ${kind==="vocab"?"word":""}" id="sq"></div><div id="so"></div><p class="hint">ตอบผิดเสียเวลา 2 วินาที</p></div>`;
  const next=()=>{q=pool[Math.floor(Math.random()*pool.length)];$("#sq").textContent=q.jp;$("#so").innerHTML=opts(q,pool,kind,false)};
  $("#so").onclick=e=>{const b=e.target.closest(".opt");if(!b||b.disabled)return;
    if(b.dataset.ok==="true"){score++;$("#sc").textContent=score;streak++;bump();next()}else{streak=0;hud();t=Math.max(0,t-2);b.disabled=true;b.classList.add("no")}};
  const iv=setInterval(()=>{if(id!==run){clearInterval(iv);return}t--;$("#tm").textContent=t;$("#tb").style.width=t/30*100+"%";if(t<=0){clearInterval(iv);over()}},1000);
  const over=()=>{const nb=score>hi;if(nb)store.set(key,score);addXp(score*3);app.innerHTML=`<div class="quiz"><div class="score">${score}</div><h1 class="page">${nb?"สถิติใหม่! 🔥":"หมดเวลา!"}</h1><p class="sub">+${score*3} XP • สถิติสูงสุด ${Math.max(score,hi)}</p><a class="btn" href="#/play/speed/${kind}" id="again">เล่นอีกรอบ</a><a class="btn ghost" href="#/play">เกมอื่น</a></div>`;$("#again").onclick=e=>{e.preventDefault();speed(kind)}};
  next();
}

/* ===== ROUTER ===== */
function route(){
  const [,m,k,x]=(location.hash||"#/").split("/"),ok=z=>z==="vocab"||z in SETS;scrollTo(0,0);run++;window.speechSynthesis?.cancel();
  document.querySelectorAll(".dock a").forEach(a=>a.classList.toggle("act",a.dataset.m===(m||"")));
  const set=h=>app.innerHTML=h;
  if(m==="learn")set(!k?views.menu("learn"):!ok(k)?views.home():k==="vocab"?views.learnVocab():views.learnKana(k));
  else if(m==="test")!k?set(views.menu("test")):ok(k)?quiz(k,x):set(views.home());
  else if(m==="play"){if(!k)set(views.play());else if(!["match","speed"].includes(k))set(views.home());else if(!x)set(views.menu("play/"+k));else if(ok(x))(k==="match"?match:speed)(x);else set(views.home())}
  else set(views.home());
}
app.addEventListener("click",e=>{const c=e.target.closest("[data-s]");if(!c)return;say(c.dataset.s);
  if(c.classList.contains("flip"))c.classList.toggle("on");else{c.classList.remove("pop");void c.offsetWidth;c.classList.add("pop")}});
addEventListener("hashchange",route);rain();hud();route();
