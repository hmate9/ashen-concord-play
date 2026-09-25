// Original vector symbols and procedural artwork. These keep the table legible
// in source distributions, where licensed card scans are deliberately absent.
(() => {
  const paths = {
    water: '<path d="M16 3C13 9 7 14 7 20a9 9 0 0 0 18 0C25 14 19 9 16 3Z"/><path d="M11 21a5 5 0 0 0 5 5"/>',
    spice: '<path d="m16 3 10 10-4 14H10L6 13Z M6 13h20 M16 3l-5 10 5 14 5-14Z"/>',
    solari: '<circle cx="16" cy="16" r="12"/><circle cx="16" cy="16" r="8"/><path d="M19 11h-5a3 3 0 0 0 0 6h4a3 3 0 0 1 0 6h-5 M16 8v17"/>',
    vp: '<path d="m16 3 4 8 9 1-6 7 1 10-8-5-8 5 1-10-6-7 9-1Z"/>',
    sword: '<path d="m8 24 16-16 4-4-1 7L12 26 M6 18l8 8 M4 28l5-5 M4 25l3 3"/>',
    troop: '<path d="m16 4 8 5v7l-8 12-8-12V9Z M8 14h16 M12 8v6 M20 8v6"/>',
    card: '<rect x="8" y="5" width="17" height="23" rx="2"/><path d="M4 23V3h16 M13 12h7 M13 17h7 M13 22h4"/>',
    deck: '<rect x="8" y="4" width="18" height="24" rx="2"/><path d="M4 24V8 M12 9h10 M12 23h10 M13 16l4-4 4 4-4 4Z"/>',
    intrigue: '<rect x="6" y="3" width="20" height="26" rx="2"/><path d="M10 16s6-9 12 0c-6 9-12 0-12 0Z"/><circle cx="16" cy="16" r="2"/>',
    persuasion: '<path d="M5 5h22v16H15l-8 6v-6H5Z M10 10h12 M10 15h8"/>',
    agent: '<circle cx="16" cy="8" r="4"/><path d="M12 14h8l5 14H7Z M10 22h12"/>',
    influence: '<path d="M8 27V12 M4 16l4-5 4 5 M19 8h10 M24 3v10 M17 27V16h10v11"/>',
    discard: '<path d="M7 4h18v24H7Z M11 10h10 M16 14v10 M12 20l4 4 4-4"/>',
    trash: '<path d="M5 8h22 M12 8V4h8v4 M9 8l1 20h12l1-20 M14 13v10 M18 13v10"/>',
    contract: '<path d="M7 3h14l5 5v20H7Z M20 3v7h6 M11 14h10 M11 18h6 M15 23l3 3 6-7"/>',
    location: '<path d="M25 12c0 7-9 17-9 17S7 19 7 12a9 9 0 0 1 18 0Z"/><circle cx="16" cy="12" r="3"/>',
    emperor: '<path d="m4 8 5 5 7-9 7 9 5-5-3 17H7Z M8 21h16 M16 11v6"/>',
    spacing_guild: '<ellipse cx="16" cy="16" rx="13" ry="7"/><ellipse cx="16" cy="16" rx="7" ry="13"/><circle cx="16" cy="16" r="3"/>',
    bene_gesserit: '<path d="m16 3 12 24H4Z M10 19s6-8 12 0c-6 7-12 0-12 0Z"/><circle cx="16" cy="19" r="2"/>',
    fremen: '<path d="m3 25 9-16 5 9 4-6 8 13Z M12 9l2 8 M6 25h20"/><circle cx="23" cy="6" r="3"/>',
    landsraad: '<path d="m3 10 13-7 13 7Z M5 28h22 M6 13v11 M13 13v11 M20 13v11 M26 13v11"/>',
    cities: '<path d="M3 28h26 M5 28V13h8v15 M13 28V5h9v23 M22 28V17h5v11 M8 17h2 M16 10h3 M16 15h3 M16 20h3"/>',
    spy: '<path d="M3 16s13-17 26 0C16 33 3 16 3 16Z"/><circle cx="16" cy="16" r="5"/><path d="m25 4-3 4 M7 4l3 4"/>',
    sandworm: '<path d="M4 27c3-7 9-5 12-12 2-5 0-9 5-11 5-1 9 4 6 8-3 5-8 7-8 12 M3 27h26"/><ellipse cx="22" cy="8" rx="4" ry="3"/>',
    hooks: '<path d="M8 4v17a5 5 0 0 0 10 0v-4l-4 4 M20 4v8 M24 4v12 M6 4h4"/>',
    shield_wall: '<path d="M3 25V10h5v5h5V7h6v8h5v-5h5v15Z M18 7l-5 10 6 2-5 6"/>',
    battle_crysknife: '<path d="M6 28 13 18C22 16 28 9 26 3c-6 3-12 8-14 14L4 25Z"/>',
    battle_desert_mouse: '<path d="M10 27c-4-4-3-11 1-14C2 8 7 1 13 7l3 7c6-9 12-1 8 5l-3 7Z M24 27c7 0 7-9 4-11"/><circle cx="17" cy="19" r="1"/>',
    battle_ornithopter: '<path d="M16 6v21 M16 13 3 5l5 12 8 4 8-4 5-12-13 8Z M12 26h8"/>',
    battle_wild: '<path d="m16 2 4 9 10 5-10 5-4 9-4-9-10-5 10-5Z"/>',
  };
  paths.spice_trade = paths.spice;
  paths.conflict = paths.sword;
  const colors = { water: '#79d4ef', spice: '#edab65', solari: '#ebcb77', vp: '#ffe09a',
    sword: '#f2b2a2', troop: '#d4ddd7', intrigue: '#c7afe5', spy: '#a6d8c9',
    emperor: '#e7c36f', spacing_guild: '#e5a56c', bene_gesserit: '#c3a4e9', fremen: '#7fc8e1' };
  const uri = (svg) => `data:image/svg+xml,${encodeURIComponent(svg)}`;
  const icons = Object.fromEntries(Object.entries(paths).map(([name, path]) => [name,
    uri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><g fill="none" stroke="${colors[name] || '#e1c89c'}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${path}</g></svg>`)]));
  const boardSymbol = (path, color) => uri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><g fill="none" stroke="${color}" stroke-width="1.8" stroke-linejoin="round">${path}</g></svg>`);
  const uprisingIcons = { ...icons,
    emperor: boardSymbol(paths.emperor, '#d6d7df'),
    spacing_guild: boardSymbol(paths.spacing_guild, '#f27788'),
    landsraad: boardSymbol('<path d="m16 3 13 10-5 15H8L3 13Z" fill="#498f54"/>', '#b0d59c'),
    cities: boardSymbol('<circle cx="16" cy="16" r="12" fill="#727ec9"/>', '#c8c9ee'),
    spice_trade: boardSymbol('<path d="m16 3 13 25H3Z" fill="#e0aa34"/>', '#ffe0a1'),
  };
  const cache = new Map();
  const available = Array.isArray(window.DUNE_AGENT_AVAILABLE_ART)
    ? new Set(window.DUNE_AGENT_AVAILABLE_ART) : null;
  const unavailable = new Set();
  function installed(src) {
    if (!src || unavailable.has(src)) return false;
    return !available || !/^\/assets\/(cards|leader-heads)\//.test(src) || available.has(src);
  }
  function artwork(name, landscape = false) {
    const key = `${landscape}:${name}`;
    if (cache.has(key)) return cache.get(key);
    const hash = Array.from(String(name)).reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
    const hue = [32, 190, 265, 155, 18][hash % 5];
    const marks = String(name).split(/\s+/).map(w => w[0]).slice(0, 2).join('').replace(/[^A-Za-z]/g, '');
    const geometry = landscape
      ? '<circle cx="225" cy="58" r="24" fill="#efd4a0" opacity=".7"/><path d="M0 145Q75 50 160 133T360 105V220H0Z" fill="#a47753"/><path d="M0 173Q145 82 290 161T400 160V230H0Z" fill="#574839"/><path d="M0 195Q140 122 350 209V230H0Z" fill="#222f31"/><path d="M0 181Q150 100 340 184" fill="none" stroke="#efd3a1" opacity=".3"/>'
      : `<circle cx="160" cy="100" r="75" fill="none" stroke="#e7d5ac" opacity=".22"/><circle cx="160" cy="100" r="64" fill="none" stroke="#e7d5ac" opacity=".18"/><path d="m160 25 63 75-63 77-63-77Z" fill="none" stroke="#e7d5ac" opacity=".24"/><path d="M94 206c0-42 21-59 41-71-18-13-18-51 0-65 13-11 37-11 50 0 18 14 18 52 0 65 20 12 41 29 41 71" fill="#101e22" stroke="#c7b98f" stroke-width="1"/><text x="160" y="190" text-anchor="middle" font-family="Georgia,serif" font-size="28" fill="#e7d5ac">${marks}</text>`;
    const result = uri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 220"><defs><linearGradient id="g" x2="1" y2="1"><stop stop-color="hsl(${hue} 26% 23%)"/><stop offset="1" stop-color="#10171b"/></linearGradient></defs><path fill="url(#g)" d="M0 0h320v220H0z"/>${geometry}</svg>`);
    cache.set(key, result);
    return result;
  }
  // A failed optional image never leaves a broken icon or loses the card's text.
  document.addEventListener('error', (event) => {
    const img = event.target;
    if (!(img instanceof HTMLImageElement) || img.src.startsWith('data:')) return;
    unavailable.add(img.getAttribute('src'));
    if (img.classList.contains('optional-card-scan')) {
      img.remove();
    } else {
      img.src = artwork(img.alt, /space|landscape/.test(img.className));
    }
  }, true);
  window.DunePresentation = { icons, uprisingIcons, artwork, installed };
})();
