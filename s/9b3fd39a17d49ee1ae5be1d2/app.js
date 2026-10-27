// Lógica do app. O texto clínico fica em content.js.
const C=CONTENT,KEY='atleta-equipe-ficha',KC='atleta-equipe-check';
const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;');
const inl=s=>esc(s).replace(/\*\*(.+?)\*\*/g,'<b>$1</b>').replace(/PENDENTE/g,'<span class="pend">PENDENTE</span>');
function md(t){let h='',L=t.split('\n'),i=0,list=null;const close=()=>{if(list){h+='</'+list+'>';list=null}};
 while(i<L.length){let l=L[i];
  if(/^\|/.test(l)){close();let rows=[];while(i<L.length&&/^\|/.test(L[i])){if(!/^\|[-| ]+\|$/.test(L[i]))rows.push(L[i]);i++}
   h+='<table>'+rows.map((r,k)=>'<tr>'+r.replace(/^\||\|$/g,'').split('|').map(c=>`<${k?'td':'th'}>${inl(c.trim())}</${k?'td':'th'}>`).join('')+'</tr>').join('')+'</table>';continue}
  let m;
  if(m=l.match(/^(#{1,3}) (.*)/)){close();h+=`<h${m[1].length+1}>${inl(m[2])}</h${m[1].length+1}>`}
  else if(m=l.match(/^\s*- (.*)/)){if(list!=='ul'){close();h+='<ul>';list='ul'}h+='<li>'+inl(m[1])+'</li>'}
  else if(m=l.match(/^\d+\. (.*)/)){if(list!=='ol'){close();h+='<ol>';list='ol'}h+='<li>'+inl(m[1])+'</li>'}
  else if(!l.trim())close(); else{close();h+='<p>'+inl(l)+'</p>'}
  i++}close();return h}
const T=[['guia','Sessão'],['ficha','Ficha'],['retorno','Retorno'],['emerg','Emergência'],['carta','Carta'],['staff','Staff'],['pac','Paciente']];
const V={
guia:()=>`<h1>Guia da <em>sessão</em></h1><div class="card warn"><p>${inl(C.meta.status)}</p><p>${inl(C.meta.decisao)}</p><p>${inl(C.meta.lado)}</p></div>${md(C.roteiro.md)}<details class="card"><summary><b>Ver passo a passo detalhado</b></summary>${md(C.guia.md)}</details>`,
ficha:()=>{const d=JSON.parse(localStorage.getItem(KEY)||'{}');return `<h1>Ficha de <em>registro</em></h1><p class="muted">Salva só neste aparelho. Paciente: ${C.meta.paciente}.</p><form id="f">${C.ficha.campos.map((c,i)=>`<label>${inl(c.campo)} ${c.pendente?'<span class="pend">PENDENTE</span>':''}</label><textarea name="c${i}">${esc(d['c'+i]??c.valor_inicial)}</textarea>`).join('')}</form><button class="btn" onclick="share()">Compartilhar pelo WhatsApp</button><button class="btn sec" onclick="limpar()">Limpar ficha</button>`},
retorno:()=>{const d=JSON.parse(localStorage.getItem(KC)||'{}'),n=C.retorno.criterios.filter((_,i)=>d[i]).length;return `<h1>Retorno ao <em>jogo</em></h1><p class="score">${n} de ${C.retorno.criterios.length} critérios</p><p class="muted">Precisa de todos. Marcações salvas neste aparelho.</p>${C.retorno.criterios.map((c,i)=>`<label class="chk"><input type="checkbox" ${d[i]?'checked':''} onchange="ck(${i},this.checked)"><span>${inl(c)}</span></label>`).join('')}<div class="card warn"><p>${inl(C.retorno.regra_jogo)}</p></div><h2>Cenários sábado 31/10</h2>${md(C.retorno.cenarios_md)}<h2>Fases do programa</h2>${md(C.retorno.fases_md)}`},
emerg:()=>`<h1>Sinais de <em>emergência</em></h1><div class="card warn">${md(C.emergencia.md)}</div>`,
carta:()=>`<h1>Carta ao <em>médico</em></h1><span class="rasc">RASCUNHO</span><div class="card">${md(C.carta.md_pt)}</div><div class="card">${md(C.carta.md_en)}</div>`,
staff:()=>`<h1>Mensagem ao <em>staff</em></h1><span class="rasc">RASCUNHO</span><p class="muted">${inl(C.staff.aviso)}</p><div class="card">${md('## pt-BR\n'+C.staff.md_pt)}</div><div class="card">${md('## EN\n'+C.staff.md_en)}</div>`,
pac:()=>`<h1>App do <em>paciente</em></h1><p>Versão em inglês com o programa de casa do atleta.</p><a class="btn" href="${C.meta.app_paciente}" target="_blank" rel="noopener noreferrer">Abrir app do paciente</a>`};
function go(t){document.querySelectorAll('.tabs button').forEach(b=>b.classList.toggle('on',b.dataset.t===t));main.innerHTML=V[t]();scrollTo(0,0);location.hash=t;
 const f=document.getElementById('f');if(f)f.oninput=()=>{const o={};new FormData(f).forEach((v,k)=>o[k]=v);localStorage.setItem(KEY,JSON.stringify(o))}}
function ck(i,v){const d=JSON.parse(localStorage.getItem(KC)||'{}');d[i]=v;localStorage.setItem(KC,JSON.stringify(d));go('retorno')}
function share(){const d=JSON.parse(localStorage.getItem(KEY)||'{}');const t='Ficha '+C.meta.paciente+'\n'+C.ficha.campos.map((c,i)=>c.campo+': '+((d['c'+i]??c.valor_inicial)||'-')).join('\n');open('https://wa.me/?text='+encodeURIComponent(t),'_blank')}
function limpar(){if(confirm('Apagar a ficha deste aparelho?')){localStorage.removeItem(KEY);go('ficha')}}
tabs.innerHTML=T.map(([k,n])=>`<button data-t="${k}" onclick="go('${k}')">${n}</button>`).join('');
go((location.hash.slice(1) in V)?location.hash.slice(1):'guia');
if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js');
