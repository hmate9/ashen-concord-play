/* Shared presentation for both rulesets. Engine keys and action IDs stay opaque. */
(() => {
  'use strict';
  const data = window.CONCORD_DATA;
  if (!data) throw new Error('Ashen Concord data is missing');
  const escape = value => String(value ?? '').replace(/[&<>"']/g,
    c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));
  const terms = new Map(Object.entries(data.terms).map(([a,b]) => [a.toLowerCase(), b]));
  const pattern = new RegExp('(?<![\\w])(?:' + [...terms.keys()].sort((a,b)=>b.length-a.length)
    .map(s=>s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')(?![\\w])', 'gi');
  const text = value => String(value ?? '').replace(pattern, match => {
    const target=terms.get(match.toLowerCase());
    return target.toLowerCase()===match.toLowerCase()?match:target;
  });
  const e = value => escape(text(value));
  const iconPaths = {
    emperor: '<path fill="currentColor" stroke="none" d="M4 26V11h6v15h3V4h6v22h3V14h6v12ZM3 28h26v3H3Z"/>',
    spacing_guild: '<circle cx="16" cy="16" r="9"/><path d="m2 23 28-14"/><circle cx="16" cy="16" r="3" fill="currentColor" stroke="none"/>',
    bene_gesserit: '<path d="M4 6q6-3 12 1 6-4 12-1v21q-6-3-12 1-6-4-12-1ZM16 7v21"/>',
    fremen: '<path fill="currentColor" stroke="none" d="m2 27 10-21 6 12 4-8 9 17Z"/><circle cx="23" cy="5" r="3" fill="currentColor" stroke="none"/>',
    water: '<path fill="currentColor" stroke="none" d="M16 2C13 8 5 16 5 21a11 11 0 0 0 22 0C27 16 19 8 16 2Z"/>',
    spice: '<path fill="currentColor" stroke="none" d="m16 2 12 11-5 16H9L4 13Z"/><path d="m16 6-7 8 7 12 7-12Z" stroke="var(--symbol-cutout)" stroke-width="2"/>',
    solari: '<circle cx="16" cy="16" r="12" fill="currentColor" stroke="none"/><path d="M12 9h8m-8 7h8m-8 7h8M16 6v20" stroke="var(--symbol-cutout)"/>',
    persuasion: '<path d="M5 6h22v14H15l-8 7v-7H5ZM10 11h12m-12 4h8"/>',
    vp: '<path fill="currentColor" stroke="none" d="m16 2 4 9 10 1-7 7 2 11-9-5-9 5 2-11-7-7 10-1Z"/>',
    sword: '<path d="m5 27 18-22 4 3-18 22M5 19l9 8M17 12l5 4"/>',
    troop: '<path fill="currentColor" stroke="none" d="M4 14 16 9l12 5v15H4Z"/><circle cx="16" cy="4" r="4" fill="currentColor" stroke="none"/><path d="M10 19v10m12-10v10" stroke="var(--symbol-cutout)"/>',
    intrigue: '<path d="M5 4h22v25H5Z"/><path fill="currentColor" stroke="none" d="m16 8 7 8-7 8-7-8Z"/>',
    agent: '<circle cx="16" cy="8" r="5"/><path d="m11 15-5 13h20l-5-13Z"/>',
    spy: '<path d="M3 16q13-17 26 0Q16 33 3 16Z"/><circle cx="16" cy="16" r="4"/><path d="M16 12v8"/>',
    sandworm: '<path d="M7 9h18v12H7ZM9 21l-5 7m10-7-2 7m11-7 5 7M3 10h4m18 0h4M12 5h8v4"/>',
    hooks: '<path d="M8 5v18l8 5 8-5V5M8 12h16M12 5v7m8-7v7M16 12v16"/>',
    shield_wall: '<path d="M3 27V12l6-4v19m2 0V5h10v22m2 0V8l6 4v15M3 27h26"/>',
    landsraad: '<path d="M4 27h24M6 23V10m10 13V10m10 13V10M3 7l13-4 13 4Z"/>',
    cities: '<path fill="currentColor" stroke="none" d="M3 29V12h8v17h3V3h9v26h3V17h5v12Z"/>',
    card: '<path d="M8 6h18v23H8ZM4 23V3h18M12 12h10m-10 5h10"/>',
    discard: '<path d="M6 3h20v26H6Zm10 6v14m-5-5 5 5 5-5"/>',
    trash: '<path d="M5 8h22M12 4h8M8 8l2 21h12l2-21M13 13v11m6-11v11"/>',
    influence: '<path d="M7 28V10m-4 5 4-5 4 5M17 28V4m-4 5 4-5 4 5M26 28V17"/>',
    contract: '<path d="M7 3h14l5 5v21H7ZM20 3v7h6M11 15h10m-10 5h6m0 4 3 3 6-7"/>',
    location: '<path d="M25 12c0 7-9 17-9 17S7 19 7 12a9 9 0 0 1 18 0Z"/><circle cx="16" cy="12" r="3"/>',
    battle_crysknife: '<path d="m5 27 20-22 2 6L11 28ZM12 21l-4-4"/>',
    battle_desert_mouse: '<path d="m5 8 8 5 10-9-1 13 6 4-8 7-12-4ZM13 13l-1 8m5-5h2"/>',
    battle_ornithopter: '<path d="m3 8 13 6L29 8 20 23h-8ZM16 5v23"/>',
    battle_wild: '<path d="m16 3 13 13-13 13L3 16ZM10 16h12m-6-6v12"/>',
  };
  iconPaths.spice_trade = iconPaths.spice;
  iconPaths.city = iconPaths.cities;
  iconPaths.conflict = iconPaths.sword;
  iconPaths.deck = iconPaths.card;
  iconPaths.initiative = '<path d="m16 3 4 9 9 4-9 4-4 9-4-9-9-4 9-4Z"/>';
  // The silhouette carries meaning without color; the opaque plate keeps it
  // readable over both bright artwork and the dark board, even at small sizes.
  const iconColors = {
    emperor:'#ffd45a', spacing_guild:'#ff839e', bene_gesserit:'#c7a0ff', fremen:'#56d9ed',
    landsraad:'#7cdd8c', cities:'#a5b9ff', city:'#a5b9ff', spice_trade:'#ffac55',
    water:'#56d9ed', spice:'#ffac55', solari:'#ffd45a', persuasion:'#f5f0df',
    vp:'#bdf572', sword:'#ff7277', conflict:'#ff7277', troop:'#f5f0df',
    intrigue:'#c7a0ff', card:'#86c5ff', deck:'#86c5ff', agent:'#f5f0df',
    spy:'#ff839e', influence:'#7cdd8c', trash:'#ff7277', discard:'#ffac55',
    contract:'#bdf572', sandworm:'#ffac55', hooks:'#56d9ed', shield_wall:'#a5b9ff',
  };
  const iconSvg = key => {
    const color = iconColors[key] || '#f5f0df';
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" style="color:${color};--symbol-cutout:#101b24"><rect x="1" y="1" width="38" height="38" rx="8" fill="#101b24" stroke="${color}" stroke-width="2"/><g transform="translate(4 4)" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round">${iconPaths[key] || iconPaths.card}</g></svg>`;
  };
  const icons = Object.fromEntries(Object.keys(iconPaths).map(key => [key,
    'data:image/svg+xml,' + encodeURIComponent(iconSvg(key))]));
  const icon = (key, label=key) => `<img class="ac-icon" src="${icons[key] || icons.card}" alt="${e(label)}" title="${e(label)}">`;
  const edition = skin => skin === 'uprising' ? 'uprising' : 'imperium';
  function item(rule, type, key) {
    const r = edition(rule);
    return data.items[`${r}:${type}:${key}`] ||
      (type === 'imperium' ? data.items[`${r}:other:${key}`] : null);
  }
  const factionKeys = { 'Emperor':'emperor', 'Spacing Guild':'spacing_guild', 'Bene Gesserit':'bene_gesserit', 'Fremen':'fremen' };
  const accessLabels = {landsraad:'Civic Assembly',cities:'City ports',city:'City ports',
    spice_trade:'Emberstone trade',spy:'Observer'};
  const accessLabel = key => data.factions[key]?.name || accessLabels[key] || 'Agent access';
  const resourceKeys = {cards:'card',water:'water',spice:'spice',solari:'solari',troops:'troop',
    intrigue:'intrigue',vp:'vp',victory_points:'vp',spies:'spy',sandworms:'sandworm',contracts:'contract',
    persuasion:'persuasion',swords:'sword',trash:'trash',trashCards:'trash',influence:'influence',factionChoices:'influence'};
  const resourceLabels = {card:'Draw',water:'Condensate',spice:'Emberstone',solari:'Crowns',troop:'Cohorts',intrigue:'Schemes',vp:'Renown',spy:'Observers',sandworm:'Siege engines',contract:'Charters',persuasion:'Authority',sword:'Force',trash:'Trash',influence:'Influence'};
  function rewards(values={}) {
    return Object.entries(values).filter(([key,n])=>resourceKeys[key] && Number.isFinite(n) && n !== 0)
      .map(([key,n])=>`<span class="ac-value" title="${e(resourceLabels[resourceKeys[key]])}">${icon(resourceKeys[key],resourceLabels[resourceKeys[key]])}<b>${n}</b></span>`).join('');
  }
  function render(card, {skin='starfall', type='imperium', className='', details=null}={}) {
    if (!card) return '<article class="small-card readable-card ac-card empty-card"></article>';
    const record = item(skin,type,card.key);
    const name = record?.name || text(card.name || card.key);
    const image = record?.image || card.image || '';
    const factions = (card.factions || record?.factions || []).map(f=>factionKeys[f] || f).filter(f=>data.factions[f]);
    if (card.faction && data.factions[card.faction] && !factions.includes(card.faction)) factions.push(card.faction);
    const faction = factions[0] || '';
    const types = {imperium:'Concord',other:'Concord',intrigue:'Scheme',conflict:'Conflict',leader:'Leader',location:'Location',contract:'Charter'};
    const ruleLines = [...(card.textLines || []), card.text || ''].filter(Boolean)
      .filter(line=>!(/^(Agent|Reveal): /.test(line) && !/\b(if|may|choose|when|pay|trash|each|another)\b/i.test(line)));
    // Conditional prose takes precedence over unqualified attribute totals.
    const sourceDescription = record?.displayText || details?.description || record?.description || '';
    // Costs, faction tags and ordinary access already have exact header/icon fields.
    // Preserve observer access conditions and all effect sentences.
    const description = sourceDescription
      .replace(/^.*? costs? \d+ persuasion[^.]*\.\s*/i, '')
      .replace(/You can send an agent to (?!a board space)[^.]+ (?:locations|spaces)\.\s*/gi, '');
    const sections = details?.sections || [];
    const prose = description ? description.split('\n').filter(Boolean) :
      ruleLines.length ? ruleLines : sections.filter(s=>s.timing !== 'general')
        .flatMap(s=>s.lines.map(line=>s.timing.replaceAll('_',' ')+': '+line));
    const ruleRow = (label,content) => content ? `<div class="ac-rule-row"><span>${e(label)}</span><div>${content}</div></div>` : '';
    const access = (card.agentIcons || []).map(k=>icon(k,accessLabel(k))).join('');
    const reveal = rewards({persuasion:card.revealPersuasion,swords:card.revealSwords,...card.revealRewards});
    const conflict = type === 'conflict';
    return `<article class="small-card readable-card ac-card ${escape(faction)} ${escape(className)}" data-${conflict?'conflict':'card'}="${escape(card.key || '')}" data-edition="${edition(skin)}" style="--ac-accent:${record?.artPalette?.subject || data.factions[faction]?.color || '#be9870'};--ac-art-background:${record?.artPalette?.background || '#394343'}">
      <header class="ac-card-header"><span class="ac-card-type">${types[type] || 'Concord'} · ${edition(skin)==='uprising'?'Insurgence':'Founding'}</span>
        ${Number.isFinite(card.acquireCost) && card.acquireCost > 0 ? `<span class="ac-cost" title="${card.acquireCost} Authority">${icon('persuasion','Authority')}${card.acquireCost}</span>`:''}
        <strong>${escape(name)}</strong></header>
      ${access && !conflict ? `<div class="ac-access-strip" aria-label="Agent access">${access}</div>` : ''}
      <div class="ac-art-wrap readable-card-scene">${image?`<img class="ac-art card-art" src="${escape(image)}" alt="${escape(name)}" loading="lazy">`:''}
        <div class="ac-factions">${factions.map(k=>icon(k,data.factions[k].name)).join('')}</div></div>
      <section class="ac-rules readable-card-rules">
        ${conflict ? (card.rewards || []).map((r,i)=>ruleRow(['1st','2nd','3rd'][i],r.text?`<span>${e(r.text)}</span>`:rewards(r))).join('') :
          (!description ? ruleRow('Agent',rewards(card.agentRewards)) + ruleRow('Reveal',reveal) : '')}
        ${prose.map(line=>`<p>${e(line)}</p>`).join('')}
        ${record?.specialText?`<p>${e(record.specialText)}</p>`:''}
        ${type==='leader'?[card.passive,card.signet].filter(Boolean).map((a,i)=>`<p><b>${i?'Seal ability':'Standing ability'}.</b> ${e(a.text)}</p>`).join(''):''}
      </section><footer class="ac-card-footer"><span>ASHEN CONCORD</span><span>${escape(types[type] || 'Concord')}</span></footer>
    </article>`;
  }
  function translateTree(root) {
    if (root.nodeType === 3) {
      if (/^(SCRIPT|STYLE|CODE|PRE)$/.test(root.parentElement?.tagName || '')) return;
      const next = text(root.nodeValue);
      if (next !== root.nodeValue) root.nodeValue = next;
      return;
    }
    if (root.nodeType !== 1 || /^(SCRIPT|STYLE|CODE|PRE)$/.test(root.tagName)) return;
    for (const key of ['title','alt','aria-label','placeholder']) {
      const old = root.getAttribute(key);
      if (old && text(old) !== old) root.setAttribute(key,text(old));
    }
    for (const child of root.childNodes) translateTree(child);
  }
  // Translates display nodes only. Never touches data-* keys, URLs, action strings or IDs.
  function observeDisplay() {
    if (!window.MutationObserver || !document.body) return;
    const observer = new window.MutationObserver(records=>{
      observer.disconnect();
      for (const r of records) {
        if (r.type === 'characterData' || r.type === 'attributes') translateTree(r.target);
        else for (const node of r.addedNodes) translateTree(node);
      }
      observer.observe(document.body,options);
    });
    const options = {subtree:true,childList:true,characterData:true,attributes:true,
      attributeFilter:['title','alt','aria-label','placeholder']};
    translateTree(document.body);
    observer.observe(document.body,options);
  }
  window.Concord = {data,text,escape,icons,iconSvg,icon,accessLabel,item,render,rewards,translateTree,observeDisplay};
  observeDisplay();
})();
