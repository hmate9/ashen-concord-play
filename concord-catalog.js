(() => {
  'use strict';
  const ac=window.Concord, e=s=>ac.escape(ac.text(s));
  const records=Object.values(ac.data.items);
  const runtime={};
  const icons={'Emperor':'emperor','Spacing Guild':'spacing_guild','Bene Gesserit':'bene_gesserit',
    'Fremen':'fremen','Landsraad':'landsraad','City':'cities','Spice Trade':'spice_trade','Spy':'spy'};
  function card(record) {
    const result={key:record.key,name:record.name,image:record.image,...record.card};
    if(record.ruleset==='uprising') {
      const attrs=record.attributes;
      result.acquireCost=(attrs.general||[]).find(v=>v.name==='Persuasion cost')?.value || result.acquireCost;
      result.agentIcons=(attrs.on_play||[]).filter(v=>v.name.startsWith('Agent icon: ')).map(v=>icons[v.name.slice(12)]).filter(Boolean);
      if(record.type==='leader') {
        const leader=window.UPRISING_WEB_DATA.leaders.find(l=>l.key===record.key);
        if(leader)Object.assign(result,{passive:leader.passive,signet:leader.signet});
      }
    }
    return {...result,...runtime[record.ruleset]?.[record.type+':'+record.key],key:record.key};
  }
  document.getElementById('factions').innerHTML=Object.entries(ac.data.factions).map(([key,f])=>`<span>${ac.icon(key,f.name)}${e(f.name)}</span>`).join('');
  function detailsFor(record){return record.ruleset==='uprising'?window.UPRISING_WEB_DATA.cardDetails?.[record.key]:null;}
  function render() {
    const edition=document.getElementById('edition').value;
    const kind=document.getElementById('kind').value;
    const query=document.getElementById('search').value.toLocaleLowerCase();
    const selected=records.filter(r=>(edition==='all'||r.ruleset===edition)&&(kind==='all'||r.type===kind)&&
      `${r.name} ${r.factions.map(ac.text).join(' ')}`.toLocaleLowerCase().includes(query));
    document.getElementById('count').textContent=`${selected.length} cards`;
    document.getElementById('catalog').innerHTML=selected.map(r=>`<section class="catalog-entry">${ac.render(card(r),{skin:r.ruleset==='uprising'?'uprising':'starfall',type:r.type,details:detailsFor(r)})}
      <div class="entry-controls"><span>${r.ruleset==='uprising'?'Insurgence':'Founding'}</span><button data-detail="${ac.escape(r.ruleset+':'+r.type+':'+r.key)}">Inspect</button></div></section>`).join('');
  }
  for(const id of ['edition','kind','search']) {
    document.getElementById(id).addEventListener('input',render);
    document.getElementById(id).addEventListener('change',render);
  }
  document.getElementById('print').addEventListener('click',()=>window.print());
  const dialog=document.getElementById('details');
  dialog.querySelector('.close').addEventListener('click',()=>dialog.close());
  document.getElementById('catalog').addEventListener('click',event=>{
    const key=event.target.closest('[data-detail]')?.dataset.detail;
    if(!key)return;
    const record=ac.data.items[key], details=detailsFor(record);
    const content=details?.description || record.description || record.card?.text || '';
    dialog.querySelector('.detail-content').innerHTML=`<h2>${e(record.name)}</h2>${ac.render(card(record),{skin:record.ruleset==='uprising'?'uprising':'starfall',type:record.type,details})}
      ${content.split('\n').filter(Boolean).map(line=>`<p>${e(line)}</p>`).join('')}
      ${!content?'<p>See the game table for current legal effects and rewards.</p>':''}`;
    dialog.showModal();
  });
  render();
  // Native definitions provide the same ranked rewards and numerical effects as
  // the live table. Static hosting retains the generated visual catalog.
  Promise.all([].map(async rule=>{
    const response=await fetch('/api/catalog/'+rule);
    if(response.ok)runtime[rule]=await response.json();
  })).then(render).catch(()=>{});
})();
