(() => {
  'use strict';
  const data=window.ATLAS_DATA;
  if(!data || !Array.isArray(data.dimensions)) { document.getElementById('ladder').textContent='研究数据加载失败，请刷新页面。';return; }
  const byId=Object.fromEntries([...data.dimensions,...(data.views||[])].map(d=>[d.id,d]));
  const countries=Object.fromEntries(data.countries.map(c=>[c.id,c]));
  const $=id=>document.getElementById(id);
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const safeUrl=u=>/^https:\/\//i.test(u||'')?u:'#';
  let active='models',currentRecord=null;
  const countryDialog=$('country-dialog'),methodDialog=$('method-dialog');
  function sourceHtml(s){return `<a class="source-link" href="${esc(safeUrl(s.url))}" target="_blank" rel="noopener noreferrer"><b>${esc(s.title)} ↗</b><span>${esc(s.publisher||'原始来源')}${s.date?' · '+esc(s.date):''}${s.locator?' · '+esc(s.locator):''}</span></a>`;}
  function closeDialog(dialog){if(dialog.open)dialog.close();}
  function setRoute(dim,country){const target='#'+dim+(country?'/'+country:'');if(location.hash!==target)history.replaceState(null,'',target);}
  function showDimension(id,updateRoute=true){
    active=byId[id]?id:data.dimensions[0].id;
    const d=byId[active];
    const base=d.baseId||active;
    document.querySelectorAll('.tab').forEach(b=>{const on=b.dataset.dimension===base;b.setAttribute('aria-selected',String(on));b.tabIndex=on?0:-1;});
    $('research').setAttribute('aria-labelledby','tab-'+base);
    const choices=byId[base].viewChoices||[];
    $('view-switch').hidden=!choices.length;
    $('view-switch').innerHTML=choices.map(v=>`<button type="button" data-view="${esc(v.id)}" aria-pressed="${v.id===active}">${esc(v.label)}</button>`).join('');
    $('view-switch').querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>showDimension(b.dataset.view)));
    $('dimension-kicker').textContent=d.kicker;
    $('dimension-title').textContent=d.title;
    $('dimension-description').textContent=d.description;
    $('metric-strip').innerHTML=[['分层指标',d.metric],['数据期',d.period],[d.sourceHeading||'统一来源',d.sourceLabel]].map(([k,v],i)=>`<div class="metric-item"><span>${esc(k)}</span><strong>${i===2&&d.sourceUrl?`<a href="${esc(safeUrl(d.sourceUrl))}" target="_blank" rel="noopener noreferrer">${esc(v)} ↗</a>`:esc(v)}</strong></div>`).join('');
    $('dimension-notice').textContent=d.notice;
    $('tier-footnote').textContent=d.footnote||'层级是本研究的分析分组，不是来源机构发布的官方等级。不同维度不加总；无披露、未覆盖和未达到门槛分别处理。';
    renderLadder();if(updateRoute)setRoute(active);
  }
  function matches(r){const c=countries[r.country];const q=$('country-search').value.trim().toLowerCase();const region=$('region-filter').value;return c && (region==='all'||c.region===region)&&(!q||[c.name,c.en,c.id,...(c.aliases||[])].join(' ').toLowerCase().includes(q));}
  function renderLadder(){
    const d=byId[active],records=d.records.filter(matches);
    $('ladder').hidden=d.type==='ecosystem';$('ecosystem').hidden=d.type!=='ecosystem';
    if(d.type==='ecosystem'){renderEcosystem(d,records);return;}
    $('coverage-count').textContent=d.type==='evidence'?d.records.filter(r=>r.evidenceGroup!=='unknown').length+' / '+data.countries.length+' 国有运行或扩容证据':d.records.filter(r=>r.tier>0).length+' / '+data.countries.length+(d.lowerBoundTiers?' 国可核实供电下限':' 国可定级');
    $('empty-results').hidden=records.length>0;
    const defs=d.type==='evidence'?d.evidenceGroups:[...d.tiers,{level:0,title:'待核实 / 未覆盖',range:'保留位置，不记零分',definition:'现有资料不足以完成同口径定级。'}];
    $('ladder').innerHTML=records.length?defs.map(t=>{
      const rows=records.filter(r=>d.type==='evidence'?r.evidenceGroup===t.id:r.tier===t.level).sort((a,b)=>(b.sortValue??0)-(a.sortValue??0)||countries[a.country].order-countries[b.country].order);
      if(!rows.length && (t.level===0 || d.type==='evidence' || $('country-search').value || $('region-filter').value!=='all'))return '';
      return `<article class="tier" data-level="${t.level}" aria-label="${esc(t.title)}"><div class="tier-heading"><span class="tier-level">${d.type==='evidence'?esc(t.kicker):t.level?(d.lowerBoundTiers?'AT LEAST L':'LEVEL ')+String(t.level).padStart(2,'0'):'UNRATED'}</span><h3>${esc(t.title)}</h3><span class="tier-range">${esc(t.range||'')}</span><span class="tier-count">${rows.length} 个国家</span></div><div class="tier-countries">${rows.length?rows.map(r=>{const c=countries[r.country];return `<button class="country-card" type="button" data-country="${esc(c.id)}" aria-label="查看${esc(c.name)}的${esc(d.name)}依据"><span class="country-name"><span class="iso">${esc(c.id)}</span>${esc(c.name)}<span class="card-arrow" aria-hidden="true">↗</span></span><span class="country-value">${esc(r.value)}</span><span class="country-subtitle">${esc(r.subtitle)}</span><span class="country-bottom"><span class="evidence-tag ${r.status==='估计'?'estimate':r.tier===0?'pending':''}">${esc(r.status||'来源披露')}</span><span>${esc(r.shortPeriod||r.period||'')}</span></span></button>`;}).join(''):'<p class="tier-empty">'+(d.lowerBoundTiers?'本轮尚无达到这一门槛的同口径下限证据。':'本次覆盖国家中暂无符合这一门槛的记录。')+'</p>'}</div></article>`;
    }).join(''):'';
    $('ladder').querySelectorAll('[data-country]').forEach(b=>{
      const r=d.records.find(x=>x.country===b.dataset.country);
      if(r?.creators?.length){const el=document.createElement('span');el.className='creator-chips';el.innerHTML=r.creators.map(n=>'<span>'+esc(n)+'</span>').join('');b.querySelector('.country-subtitle').before(el);}
      b.addEventListener('click',()=>showCountry(b.dataset.country));
    });
  }
  function renderEcosystem(d,records){
    const known=records.filter(r=>r.ecosystem?.weightedRepos!=null);
    $('coverage-count').textContent=d.records.filter(r=>r.ecosystem?.weightedRepos!=null).length+' / '+data.countries.length+' 国有账号样本';
    $('empty-results').hidden=records.length>0;
    const order=$('ecosystem-sort')?.value||'downloads30d';
    const rows=[...records].sort((a,b)=>(b.ecosystem?.[order]??-1)-(a.ecosystem?.[order]??-1));
    const format=n=>n==null?'—':new Intl.NumberFormat('zh-CN').format(n);
    $('ecosystem').innerHTML=`<div class="ecosystem-heading"><p>官方发布账号样本 · 数量与下载采用同一权重仓库集合</p><label>排序 <select id="ecosystem-sort"><option value="downloads30d">近30天下载</option><option value="weightedRepos">权重仓库数量</option></select></label></div><div class="ecosystem-table-wrap"><table class="ecosystem-table"><thead><tr><th scope="col">国家 / 官方账号样本</th><th scope="col">公开模型仓库</th><th scope="col">含权重仓库</th><th scope="col">近30天下载</th><th scope="col">核查</th></tr></thead><tbody>${rows.map(r=>{const e=r.ecosystem,c=countries[r.country];return `<tr><td><b>${esc(c.name)}</b><small>${esc(e?.accounts?.join(' · ')||'本轮未纳入可核实账号')}</small></td><td>${format(e?.publicRepos)}</td><td>${format(e?.weightedRepos)}</td><td class="download-value">${format(e?.downloads30d)}</td><td><button type="button" data-country="${c.id}" aria-label="查看${esc(c.name)}开放模型统计">${e?'详情 ↗':'待补 ↗'}</button></td></tr>`;}).join('')}</tbody></table></div><p class="small muted">排序只描述已纳入账号，不是国家总量排名。— 表示没有完成可比统计；实际采集为0时才显示0。${known.length?'':'当前筛选下没有已统计账号。'}</p>${d.downloadUrl?`<a class="text-link evidence-download" href="${esc(d.downloadUrl)}" download>下载逐仓库快照与统计范围 ↓</a>`:''}`;
    $('ecosystem-sort').value=order;$('ecosystem-sort').addEventListener('change',()=>renderEcosystem(d,d.records.filter(matches)));
    $('ecosystem').querySelectorAll('[data-country]').forEach(b=>b.addEventListener('click',()=>showCountry(b.dataset.country)));
  }
  function showCountry(id){
    const d=byId[active],r=d.records.find(x=>x.country===id),c=countries[id];if(!r||!c)return;
    currentRecord=r;
    $('dialog-kicker').textContent=d.name+' / '+c.en;
    const tier=d.tiers.find(t=>t.level===r.tier);
    $('dialog-body').innerHTML=`<h2 id="dialog-title">${esc(c.name)}</h2><p class="dialog-value">${esc(r.value)}</p><p class="period">${esc(r.period||d.period)} · ${r.tier?(r.isLowerBound?'≥L':'L')+r.tier+' '+esc(tier?.title||''):'尚不能定级'} · ${esc(r.status||'来源披露')}</p><h3>归层依据</h3><p class="reason">${esc(r.reason)}</p>${r.facts?.length?'<div class="facts">'+r.facts.map(f=>`<div class="fact"><span>${esc(f.label)}</span><strong>${esc(f.value)}</strong></div>`).join('')+'</div>':''}${r.caveats?.length?'<h3>证据边界</h3><ul>'+r.caveats.map(t=>'<li>'+esc(t)+'</li>').join('')+'</ul>':''}${r.nextChecks?.length?'<h3>下一步核查</h3><ul>'+r.nextChecks.map(t=>'<li>'+esc(t)+'</li>').join('')+'</ul>':''}<h3>原始来源 ${r.sources?.length?'('+r.sources.length+')':''}</h3><div class="sources">${r.sources?.length?r.sources.map(sourceHtml).join(''):'<p class="small muted">尚未找到足以定级的原始披露。</p>'}</div><h3>这个国家的其他维度</h3><div class="other-dimensions">${data.dimensions.filter(x=>x.id!==(d.baseId||active)).map(x=>{const other=x.records.find(y=>y.country===id);return `<button type="button" data-jump="${esc(x.id)}">${esc(x.name)} · ${other?.tier?(other.isLowerBound?'≥L':'L')+other.tier:other?.evidenceGroup&&other.evidenceGroup!=='unknown'?'有证据':'待核'}</button>`;}).join('')}</div>`;
    $('dialog-body').querySelectorAll('[data-jump]').forEach(b=>b.addEventListener('click',()=>{showDimension(b.dataset.jump,false);showCountry(id);}));
    if(d.type==='evidence'){$('dialog-body').querySelector('h3').textContent='证据如何解读';}
    if(d.type==='ecosystem'){$('dialog-body').querySelector('.period').textContent=(r.period||d.period)+' · 官方账号样本 · '+r.status;$('dialog-body').querySelector('h3').textContent='统计依据';}
    $('copy-status').textContent='';
    setRoute(active,id);
    if(!countryDialog.open)countryDialog.showModal();
    countryDialog.scrollTop=0;
  }
  function showMethod(){const d=byId[active];$('method-body').innerHTML=`<h2 id="method-title">${esc(d.name)}：${['ecosystem','evidence'].includes(d.type)?'指标口径':'如何分层'}</h2><p class="method-lead">${esc(d.methodology)}</p>${d.tiers.map(t=>`<div class="method-tier"><strong>L${t.level} · ${esc(t.title)} ${esc(t.range||'')}</strong><p>${esc(t.definition)}</p></div>`).join('')}<div class="method-status">${esc(d.limitations)}</div><h3>指标与方法来源</h3><div class="sources">${(d.methodSources||[]).map(sourceHtml).join('')}</div>`;methodDialog.showModal();}
  function renderMatrix(){
    $('coverage-table').innerHTML=`<thead><tr><th scope="col">国家</th>${data.dimensions.map(d=>`<th scope="col">${esc(d.name)}</th>`).join('')}</tr></thead><tbody>${data.countries.map(c=>`<tr><td>${esc(c.name)}<span class="matrix-iso">${esc(c.id)}</span></td>${data.dimensions.map(d=>{const r=d.records.find(x=>x.country===c.id);return `<td><button type="button" data-dimension="${d.id}" data-country="${c.id}" data-level="${r?.tier||0}" aria-label="${esc(c.name)}，${esc(d.name)}，${r?.tier?(r.isLowerBound?'已核实下限层级':'层级')+r.tier:r?.evidenceGroup&&r.evidenceGroup!=='unknown'?'有证据，待同口径定级':'待核实'}">${r?.tier?(r.isLowerBound?'≥L':'L')+r.tier:r?.evidenceGroup&&r.evidenceGroup!=='unknown'?'证据':'—'}</button></td>`;}).join('')}</tr>`).join('')}</tbody>`;
    $('coverage-table').querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{showDimension(b.dataset.dimension,false);showCountry(b.dataset.country);}));
  }
  $('country-count').textContent=data.countries.length;
  $('dimension-count').textContent=data.dimensions.length;
  $('tabs').innerHTML=data.dimensions.map((d,i)=>`<button class="tab" id="tab-${d.id}" data-dimension="${d.id}" role="tab" aria-controls="research" aria-selected="false" tabindex="-1" type="button"><span class="tab-index">0${i+1}</span>${esc(d.name)}</button>`).join('');
  $('tabs').querySelectorAll('button').forEach((b,i)=>{b.addEventListener('click',()=>{closeDialog(countryDialog);showDimension(b.dataset.dimension);});b.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();let next=e.key==='Home'?0:e.key==='End'?data.dimensions.length-1:(i+(e.key==='ArrowRight'?1:-1)+data.dimensions.length)%data.dimensions.length;const target=$('tabs').children[next];target.focus();showDimension(target.dataset.dimension);});});
  $('country-search').addEventListener('input',renderLadder);$('region-filter').addEventListener('change',renderLadder);
  $('method-button').addEventListener('click',showMethod);
  $('dialog-close').addEventListener('click',()=>closeDialog(countryDialog));$('method-close').addEventListener('click',()=>closeDialog(methodDialog));
  for(const d of [countryDialog,methodDialog])d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();}});
  countryDialog.addEventListener('close',()=>setRoute(active));
  $('copy-record').addEventListener('click',async()=>{if(!currentRecord)return;const r=currentRecord,c=countries[r.country],d=byId[active];const text=[c.name+'｜'+d.name,'指标：'+d.metric,'记录：'+r.value,...(r.facts||[]).map(f=>f.label+'：'+f.value),'数据期：'+(r.period||d.period),'归层依据：'+r.reason,'边界：'+(r.caveats||[]).join('；'),'待核：'+(r.nextChecks||[]).join('；'),'来源：',...(r.sources||[]).map(s=>s.title+' '+s.url),'页面：'+location.href].join('\n');try{await navigator.clipboard.writeText(text);$('copy-status').textContent='已复制，含来源与核查问题';}catch{$('copy-status').textContent='浏览器未允许复制，可直接选择详情文本。';}});
  $('export-data').addEventListener('click',()=>{const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='ai-capacity-atlas-'+data.meta.reviewedAt.replaceAll('-','')+'.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2000);});
  if(data.audit){$('review-content').innerHTML=`<p class="section-copy">${esc(data.audit.scope)}</p><div class="review-grid">${data.audit.items.map(a=>`<article><span class="review-label">${esc(a.label)}</span><h3>${esc(a.title)}</h3><p>${esc(a.text)}</p>${a.source?`<a class="text-link" href="${esc(safeUrl(a.source.url))}" target="_blank" rel="noopener noreferrer">${esc(a.source.title)} ↗</a>`:''}</article>`).join('')}</div>${data.audit.proposals?.length?'<h3 class="proposals-title">下一轮值得补充的更直接指标</h3><div class="proposal-list">'+data.audit.proposals.map(p=>`<article><b>${esc(p.title)}</b><p>${esc(p.text)}</p>${p.source?`<a class="text-link" href="${esc(safeUrl(p.source.url))}" target="_blank" rel="noopener noreferrer">${esc(p.source.title)} ↗</a>`:''}</article>`).join('')+'</div>':''}`;}
  function readRoute(){const [id,country]=(location.hash.slice(1)||'models').split('/');if(['coverage','review','research'].includes(id))return;showDimension(id,false);if(country&&countries[country])showCountry(country);else closeDialog(countryDialog);}
  window.addEventListener('hashchange',readRoute);
  renderMatrix();readRoute();
})();
