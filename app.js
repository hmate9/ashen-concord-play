const PLAYER_COLORS = ["#36a3ff", "#d34545", "#38b764", "#d6b13d"];
const FACTIONS = ["emperor", "spacing_guild", "bene_gesserit", "fremen"];
const VP_SOURCE_ORDER = [
  "starting",
  "combat",
  "spice_must_flow",
  "card_acquisition",
  "faction_space",
  "combat_influence",
  "leader",
  "alliance",
  "intrigue",
];
const WEB_SKIN_SETTING_KEY = "duneAgentWebSkin";
const UPRISING_WEB_DATA = window.UPRISING_WEB_DATA || {
  leaders: [],
  boardLayout: {},
  observationPostLinks: [],
  boardSpaces: [],
  contracts: [],
  standardContractKeys: [],
  ixCompanionContractKeys: [],
};
const KNOWN_WEB_SKINS = ["dune", "starfall", "uprising"];
const WEB_SKIN_LABELS = {
  dune: "Founding",
  starfall: "Founding",
  uprising: "Insurgence",
};
const DEFAULT_WEB_PLAYER_COUNT = 4;

function normalizeKnownSkin(value) {
  return value === "dune" ? "starfall" : KNOWN_WEB_SKINS.includes(value) ? value : null;
}

function configuredDefaultSkin() {
  return normalizeKnownSkin(window.DUNE_AGENT_DEFAULT_SKIN);
}

function normalizeWebPlayerCount(value) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 2 || parsed > PLAYER_COLORS.length) {
    return DEFAULT_WEB_PLAYER_COUNT;
  }
  return parsed;
}

function configuredWebPlayerCount() {
  return normalizeWebPlayerCount(window.DUNE_AGENT_PLAYER_COUNT);
}

function allowedSkinKeys() {
  if (!Array.isArray(window.DUNE_AGENT_ALLOWED_SKINS)) {
    return ["starfall", "uprising"];
  }
  const allowed = [];
  for (const raw of window.DUNE_AGENT_ALLOWED_SKINS) {
    const key = normalizeKnownSkin(raw);
    if (key && !allowed.includes(key)) {
      allowed.push(key);
    }
  }
  return allowed.length ? allowed : KNOWN_WEB_SKINS;
}

function defaultSkinFallback() {
  const allowed = allowedSkinKeys();
  const configured = configuredDefaultSkin();
  if (configured && allowed.includes(configured)) return configured;
  if (allowed.includes("starfall")) return "starfall";
  return allowed[0] || "starfall";
}

function normalizeSkin(value) {
  const key = normalizeKnownSkin(value);
  const allowed = allowedSkinKeys();
  return key && allowed.includes(key) ? key : defaultSkinFallback();
}

function loadSkinSetting() {
  const configured = configuredDefaultSkin();
  if (configured && allowedSkinKeys().includes(configured)) {
    return configured;
  }
  try {
    return normalizeSkin(window.localStorage.getItem(WEB_SKIN_SETTING_KEY));
  } catch (error) {
    return defaultSkinFallback();
  }
}

function saveSkinSetting(value) {
  try {
    window.localStorage.setItem(WEB_SKIN_SETTING_KEY, normalizeSkin(value));
  } catch (error) {
    // Ignore storage failures; the skin still applies to the current page.
  }
}

function starfallAssetSlug(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function starfallLeader(data) {
  const leaderSlug = starfallAssetSlug(data.name);
  return {
    ...data,
    image: `./assets/starfall/art/leaders/leader-${leaderSlug}.webp`,
    headImage: `./assets/starfall/art/leader-heads/${leaderSlug}.png`,
  };
}

const SKIN_CONFIGS = {
  dune: {
    title: "Ashen Concord · Founding",
    loading: "Loading Ashen Concord...",
    chooseLeaderTitle: "Choose Your Leader!",
    confirmLabel: "Confirm",
    factionLabels: {
      emperor: "Emperor",
      spacing_guild: "Spacing Guild",
      bene_gesserit: "Bene Gesserit",
      fremen: "Fremen",
    },
    vpSourceLabels: {
      starting: "Starting",
      combat: "Combat",
      spice_must_flow: "The Spice Must Flow",
      card_acquisition: "Card buys",
      faction_space: "Faction spaces",
      combat_influence: "Combat influence",
      leader: "Leader",
      alliance: "Alliances",
      intrigue: "Intrigue",
    },
    leaders: [
      {
        id: 0,
        key: "baron_vladimir_harkonnen",
        name: "Baron Vladimir Harkonnen",
        house: "House Harkonnen",
        passive: {
          name: "Masterstroke",
          text: "During setup, secretly choose two Factions. The first time you deploy 4 or more troops in a single turn, gain 1 Influence with each chosen Faction.",
        },
        signet: {
          name: "Scheming",
          text: "Pay 1 Solari to draw an Intrigue card.",
        },
        image: "./assets/cards/dune-imperium-leader-baron-vladimir-harkonnen.webp",
        headImage: "./assets/leader-heads/baron_vladimir_harkonnen.png",
      },
      {
        id: 1,
        key: "paul_atreides",
        name: "Paul Atreides",
        house: "House Atreides",
        passive: {
          name: "Prescience",
          text: "You may always look at the top card of your deck.",
        },
        signet: {
          name: "Discipline",
          text: "Draw a card.",
        },
        image: "./assets/cards/dune-imperium-leader-paul-atreides.webp",
        headImage: "./assets/leader-heads/paul_atreides.png",
      },
      {
        id: 2,
        key: "countess_ariana_thorvald",
        name: "Countess Ariana Thorvald",
        house: "House Thorvald",
        passive: {
          name: "Spice Addict",
          text: "Whenever you harvest spice, gain 1 less and draw a card.",
        },
        signet: {
          name: "Hidden Reservoir",
          text: "Gain 1 Water.",
        },
        image: "./assets/cards/dune-imperium-leader-countess-ariana-thorvald.webp",
        headImage: "./assets/leader-heads/countess_ariana_thorvald.png",
      },
      {
        id: 3,
        key: "earl_memnon_thorvald",
        name: "Earl Memnon Thorvald",
        house: "House Thorvald",
        passive: {
          name: "Connections",
          text: "When you take your seat on the High Council, gain 1 Influence with a Faction of your choice.",
        },
        signet: {
          name: "Signet Ring",
          text: "Gain 1 Spice.",
        },
        image: "./assets/cards/dune-imperium-leader-earl-memnon-thorvald.webp",
        headImage: "./assets/leader-heads/earl_memnon_thorvald.png",
      },
      {
        id: 4,
        key: "count_ilban_richese",
        name: "Count Ilban Richese",
        house: "House Richese",
        passive: {
          name: "Manufacturing",
          text: "When you send an Agent to a board space that costs Solari, draw a card.",
        },
        signet: {
          name: "Signet Ring",
          text: "Gain 1 Solari.",
        },
        image: "./assets/cards/dune-imperium-leader-count-ilban-richese.webp",
        headImage: "./assets/leader-heads/count_ilban_richese.png",
      },
      {
        id: 5,
        key: "helena_richese",
        name: "Helena Richese",
        house: "House Richese",
        passive: {
          name: "Eyes Everywhere",
          text: "Enemy Agents do not block your Agents at Landsraad or City board spaces.",
        },
        signet: {
          name: "Manipulate",
          text: "Remove and replace a card in the Imperium Row. During your Reveal turn this round, you may acquire the removed card for 1 less.",
        },
        image: "./assets/cards/dune-imperium-leader-helena-richese.webp",
        headImage: "./assets/leader-heads/helena_richese.png",
      },
      {
        id: 6,
        key: "glossu_the_beast_rabban",
        name: "Glossu \"The Beast\" Rabban",
        house: "House Harkonnen",
        passive: {
          name: "Arrakis Fiefdom",
          text: "Begin the game with 1 extra Spice and 1 extra Solari.",
        },
        signet: {
          name: "Brutality",
          text: "Recruit 1 troop, or 2 troops if you hold an Alliance.",
        },
        image: "./assets/cards/dune-imperium-leader-glossu-the-beast-rabban.webp",
        headImage: "./assets/leader-heads/glossu_the_beast_rabban.png",
      },
      {
        id: 7,
        key: "duke_leto_atreides",
        name: "Duke Leto Atreides",
        house: "House Atreides",
        passive: {
          name: "Landsraad Popularity",
          text: "Sending an Agent to a Landsraad board space costs you 1 Solari less.",
        },
        signet: {
          name: "Prudent Diplomacy",
          text: "Pay 1 Spice to gain 1 Influence with a Faction where an opponent has more Influence than you.",
        },
        image: "./assets/cards/dune-imperium-leader-dune-leto-atreides.webp",
        headImage: "./assets/leader-heads/duke_leto_atreides.png",
      },
    ],
    factionIcons: {
      emperor: "./assets/icons/Emperor.png",
      spacing_guild: "./assets/icons/SpacingGuild.png",
      bene_gesserit: "./assets/icons/BeneGesserit.png",
      fremen: "./assets/icons/Fremen.png",
    },
    factionLevel4Bonus: {
      emperor: { icon: "./assets/icons/Solari_Blank.png", count: 2, label: "+2 Solari" },
      spacing_guild: { icon: "./assets/icons/Spice_Blank.png", count: 2, label: "+2 Spice" },
      bene_gesserit: { icon: "./assets/icons/intrigue.png", count: 1, label: "+1 Intrigue" },
      fremen: { icon: "./assets/icons/Water.png", count: 1, label: "+1 Water" },
    },
    resourceIcons: {
      water: "./assets/icons/Water.png",
      spice: "./assets/icons/Spice_Blank.png",
      solari: "./assets/icons/Solari_Blank.png",
      intrigue: "./assets/icons/intrigue.png",
      vp: "./assets/icons/VictoryPoint.png",
      sword: "./assets/icons/sword.png",
      troop: "./assets/icons/Recruit.png",
      card: "./assets/icons/Draw.png",
      persuasion: "./assets/icons/Persuasion_Blank.png",
      agent: "./assets/icons/leader.png",
      influence: "./assets/icons/Influence_Plus.png",
      contract: "./assets/icons/imperium.png",
      deck: "./assets/icons/imperium.png",
      discard: "./assets/icons/Discard.png",
      trash: "./assets/icons/Trash.png",
      location: "./assets/icons/location.png",
      conflict: "./assets/icons/conflict.png",
    },
    firstPlayerToken: "./assets/first-player-sandworm-token.png",
    agentIconMeta: {
      emperor: { icon: "./assets/icons/Emperor_Agent.png", label: "Emperor" },
      spacing_guild: { icon: "./assets/icons/SpacingGuild_Agent.png", label: "Spacing Guild" },
      bene_gesserit: { icon: "./assets/icons/BeneGesserit_Agent.png", label: "Bene Gesserit" },
      fremen: { icon: "./assets/icons/Fremen_Agent.png", label: "Fremen" },
      landsraad: { icon: "./assets/icons/Landsraad_Agent.png", label: "Landsraad" },
      cities: { icon: "./assets/icons/Cities_Agent.png", label: "Cities" },
      spice_trade: { icon: "./assets/icons/SpiceTrade_Agent.png", label: "Spice trade" },
    },
  },
  starfall: {
    title: "Ashen Concord · Founding",
    loading: "Loading Ashen Concord...",
    chooseLeaderTitle: "Choose Your Leader!",
    confirmLabel: "Confirm",
    factionLabels: {
      emperor: "Helix Authority",
      spacing_guild: "Slipstream Combine",
      bene_gesserit: "Mnemosyne Synod",
      fremen: "Rim Freeholds",
    },
    vpSourceLabels: {
      starting: "Starting",
      combat: "Combat",
      spice_must_flow: "Prestige Initiative",
      card_acquisition: "Card buys",
      faction_space: "Faction spaces",
      combat_influence: "Combat influence",
      leader: "Leader",
      alliance: "Alliances",
      intrigue: "Tactics",
    },
    leaders: [
  {
    id: 0,
    key: "baron_vladimir_harkonnen",
    name: "Director Mara Voss",
    house: "Voss Combine",
    passive: {
      name: "Masterstroke",
      text: "During setup, secretly choose two Factions. The first time you deploy 4 or more crews in a single turn, gain 1 Influence with each chosen Faction.",
    },
    signet: {
      name: "Quiet Funding",
      text: "Pay 1 Credit to draw a Tactic card.",
    },
    image: "",
    headImage: "",
  },
  {
    id: 1,
    key: "paul_atreides",
    name: "Navigator Ilyan Vale",
    house: "Vale Survey",
    passive: {
      name: "Foresight",
      text: "You may always look at the top card of your deck.",
    },
    signet: {
      name: "Discipline",
      text: "Draw a card.",
    },
    image: "",
    headImage: "",
  },
  {
    id: 2,
    key: "countess_ariana_thorvald",
    name: "Envoy Sera Nyx",
    house: "Nyx Charter",
    passive: {
      name: "Aether Dependency",
      text: "Whenever you harvest aetherite, gain 1 less and draw a card.",
    },
    signet: {
      name: "Emergency Reserves",
      text: "Gain 1 Coolant.",
    },
    image: "",
    headImage: "",
  },
  {
    id: 3,
    key: "earl_memnon_thorvald",
    name: "Chancellor Oren Taal",
    house: "Taal Compact",
    passive: {
      name: "Connections",
      text: "When you take your seat on the Command Council, gain 1 Influence with a Faction of your choice.",
    },
    signet: {
      name: "Command Seal",
      text: "Gain 1 Aetherite.",
    },
    image: "",
    headImage: "",
  },
  {
    id: 4,
    key: "count_ilban_richese",
    name: "Fabricator Cassian Rook",
    house: "Rook Foundry",
    passive: {
      name: "Manufacturing",
      text: "When you send an Agent to a board space that costs Credits, draw a card.",
    },
    signet: {
      name: "Command Seal",
      text: "Gain 1 Credit.",
    },
    image: "",
    headImage: "",
  },
  {
    id: 5,
    key: "helena_richese",
    name: "Spymaster Lyra Quen",
    house: "Quen Directorate",
    passive: {
      name: "Eyes Everywhere",
      text: "Enemy Agents do not block your Agents at Compact Council or City board spaces.",
    },
    signet: {
      name: "Manipulate",
      text: "Remove and replace a card in the Compact Row. During your Reveal turn this round, you may acquire the removed card for 1 less.",
    },
    image: "",
    headImage: "",
  },
  {
    id: 6,
    key: "glossu_the_beast_rabban",
    name: "Warden Brakk Sorn",
    house: "Sorn Bastion",
    passive: {
      name: "Frontier Charter",
      text: "Begin the game with 1 extra Aetherite and 1 extra Credit.",
    },
    signet: {
      name: "Pressure",
      text: "Recruit 1 crew, or 2 crews if you hold an Alliance.",
    },
    image: "",
    headImage: "",
  },
  {
    id: 7,
    key: "duke_leto_atreides",
    name: "Admiral Toma Ardent",
    house: "Ardent League",
    passive: {
      name: "Council Favor",
      text: "Sending an Agent to a Compact Council board space costs you 1 Credit less.",
    },
    signet: {
      name: "Prudent Diplomacy",
      text: "Pay 1 Aetherite to gain 1 Influence with a Faction where an opponent has more Influence than you.",
    },
    image: "",
    headImage: "",
  },
    ].map(starfallLeader),
    factionIcons: {
      emperor: "./assets/starfall/icons/helix-authority.svg",
      spacing_guild: "./assets/starfall/icons/slipstream-combine.svg",
      bene_gesserit: "./assets/starfall/icons/mnemosyne-synod.svg",
      fremen: "./assets/starfall/icons/rim-freeholds.svg",
    },
    factionLevel4Bonus: {
      emperor: { icon: "./assets/starfall/icons/credits.svg", count: 2, label: "+2 Credits" },
      spacing_guild: { icon: "./assets/starfall/icons/aetherite.svg", count: 2, label: "+2 Aetherite" },
      bene_gesserit: { icon: "./assets/starfall/icons/tactic.svg", count: 1, label: "+1 Tactic" },
      fremen: { icon: "./assets/starfall/icons/coolant.svg", count: 1, label: "+1 Coolant" },
    },
    resourceIcons: {
      water: "./assets/starfall/icons/coolant.svg",
      spice: "./assets/starfall/icons/aetherite.svg",
      solari: "./assets/starfall/icons/credits.svg",
      intrigue: "./assets/starfall/icons/tactic.svg",
      vp: "./assets/starfall/icons/prestige.svg",
      sword: "./assets/starfall/icons/force.svg",
      troop: "./assets/starfall/icons/crew.svg",
      card: "./assets/starfall/icons/draw.svg",
      persuasion: "./assets/starfall/icons/command.svg",
      agent: "./assets/starfall/icons/seal.svg",
      influence: "./assets/starfall/icons/influence-plus.svg",
      deck: "./assets/starfall/icons/compact-deck.svg",
      discard: "./assets/starfall/icons/discard.svg",
      trash: "./assets/starfall/icons/scrap.svg",
      location: "./assets/starfall/icons/location.svg",
      conflict: "./assets/starfall/icons/conflict.svg",
    },
    firstPlayerToken: "./assets/starfall/tokens/initiative-token.svg",
    agentIconMeta: {
      emperor: { icon: "./assets/starfall/icons/helix-authority-agent.svg", label: "Helix Authority" },
      spacing_guild: { icon: "./assets/starfall/icons/slipstream-combine-agent.svg", label: "Slipstream Combine" },
      bene_gesserit: { icon: "./assets/starfall/icons/mnemosyne-synod-agent.svg", label: "Mnemosyne Synod" },
      fremen: { icon: "./assets/starfall/icons/rim-freeholds-agent.svg", label: "Rim Freeholds" },
      landsraad: { icon: "./assets/starfall/icons/council-agent.svg", label: "Compact Council" },
      cities: { icon: "./assets/starfall/icons/city-agent.svg", label: "City ports" },
      spice_trade: { icon: "./assets/starfall/icons/trade-agent.svg", label: "Aether trade" },
    },
  },
};

SKIN_CONFIGS.uprising = {
  ...SKIN_CONFIGS.dune,
  title: "Ashen Concord · Insurgence",
  loading: "Loading Ashen Concord: Insurgence...",
  resourceIcons: {
    ...SKIN_CONFIGS.dune.resourceIcons,
    battle_crysknife: "./assets/cards/uprising-intrigue-crysknife.webp",
    battle_desert_mouse: "./assets/cards/uprising-intrigue-desert-mouse.webp",
    battle_ornithopter: "./assets/cards/uprising-intrigue-ornitopter.webp",
    battle_wild: "./assets/cards/uprising-conflict-propaganda.webp",
    sandworm: "./assets/first-player-sandworm-token.png",
    spy: "./assets/icons/Spy_Agent.svg",
  },
  agentIconMeta: {
    ...SKIN_CONFIGS.dune.agentIconMeta,
    spy: { icon: "./assets/icons/Spy_Agent.svg", label: "Spy" },
  },
  leaders: UPRISING_WEB_DATA.leaders.length
    ? UPRISING_WEB_DATA.leaders.filter((leader) => leader.key !== "reverend_mother_jessica")
    : SKIN_CONFIGS.dune.leaders,
  boardLayout: UPRISING_WEB_DATA.boardLayout || {},
  observationPostLinks: UPRISING_WEB_DATA.observationPostLinks || [],
  boardSpaces: UPRISING_WEB_DATA.boardSpaces || [],
  playable: true,
};

let activeSkin = loadSkinSetting();
let FACTION_LABELS = {};
let VP_SOURCE_LABELS = {};
let LEADER_OPTIONS = [];
let FACTION_ICONS = {};
let FACTION_LEVEL4_BONUS = {};
let RESOURCE_ICONS = {};
let AGENT_ICON_META = {};
let FIRST_PLAYER_TOKEN = "";

function skinConfig() {
  return SKIN_CONFIGS[activeSkin] || SKIN_CONFIGS.starfall;
}

function cloneLeaders(leaders) {
  return leaders.map((leader) => ({
    ...leader,
    passive: { ...(leader.passive || {}) },
    signet: { ...(leader.signet || {}) },
  }));
}

function applySkinConfig() {
  const config = skinConfig();
  FACTION_LABELS = config.factionLabels;
  VP_SOURCE_LABELS = config.vpSourceLabels;
  LEADER_OPTIONS = cloneLeaders(config.leaders);
  FACTION_ICONS = config.factionIcons;
  FACTION_LEVEL4_BONUS = config.factionLevel4Bonus;
  RESOURCE_ICONS = config.resourceIcons;
  AGENT_ICON_META = config.agentIconMeta;
  FIRST_PLAYER_TOKEN = config.firstPlayerToken;
  if (!window.Concord && activeSkin !== "starfall" && window.DunePresentation) {
    const icons = activeSkin === "uprising" ? window.DunePresentation.uprisingIcons : window.DunePresentation.icons;
    RESOURCE_ICONS = { ...config.resourceIcons, ...icons };
    FACTION_ICONS = Object.fromEntries(FACTIONS.map(key => [key, icons[key]]));
    AGENT_ICON_META = Object.fromEntries(Object.entries(config.agentIconMeta)
      .map(([key, value]) => [key, { ...value, icon: icons[key] || icons.agent }]));
    FACTION_LEVEL4_BONUS = Object.fromEntries(FACTIONS.map((key, index) => [key, {
      ...config.factionLevel4Bonus[key],
      icon: icons[["solari", "spice", "intrigue", "water"][index]],
    }]));
    FIRST_PLAYER_TOKEN = icons.sandworm;
  }
  if (window.Concord) {
    const ac = window.Concord;
    const ruleset = activeSkin === "uprising" ? "uprising" : "imperium";
    const translated = value => ac.text(value);
    FACTION_LABELS = Object.fromEntries(Object.entries(ac.data.factions).map(([key,v])=>[key,v.name]));
    VP_SOURCE_LABELS = Object.fromEntries(Object.entries(config.vpSourceLabels).map(([key,v])=>[key,translated(v)]));
    RESOURCE_ICONS = { ...ac.icons };
    FACTION_ICONS = Object.fromEntries(FACTIONS.map(key=>[key,ac.icons[key]]));
    AGENT_ICON_META = Object.fromEntries(Object.entries(config.agentIconMeta).map(([key,v])=>
      [key,{label:translated(v.label),icon:ac.icons[key] || ac.icons.agent}]));
    FACTION_LEVEL4_BONUS = Object.fromEntries(FACTIONS.map((key,index)=>[key,{
      ...config.factionLevel4Bonus[key],label:translated(config.factionLevel4Bonus[key].label),
      icon:ac.icons[["solari","spice","intrigue","water"][index]],
    }]));
    LEADER_OPTIONS = cloneLeaders(activeSkin === "uprising" ? config.leaders : SKIN_CONFIGS.dune.leaders).map(leader=>{
      const record = ac.item(ruleset,"leader",leader.key);
      return {...leader,name:record?.name || translated(leader.name),house:translated(leader.house),
        image:record?.image || "",headImage:record?.image || "",
        passive:{name:'Standing ability',text:translated(leader.passive.text)},
        signet:{name:'Seal ability',text:translated(leader.signet.text)}};
    });
    FIRST_PLAYER_TOKEN = ac.icons.initiative;
  }
  document.title = "Ashen Concord · " + (activeSkin === "uprising" ? "Insurgence" : "Founding");
  document.body.dataset.skin = activeSkin;
}

applySkinConfig();

// Full-viewport board layout (percent coordinates), anchored on the
// Starfall board surface: faction column + ladders on the left,
// Compact Council / Trade Compact tiles across the top, cities in the middle and the
// conflict zone at the lower right of the board.
const SPACE_LAYOUT = {
  conspire: { x: 20.4, y: 6.4, w: 10.4, h: 10.0 },
  wealth: { x: 20.4, y: 16.9, w: 10.4, h: 10.0 },
  heighliner: { x: 20.4, y: 29.7, w: 10.4, h: 10.0 },
  foldspace: { x: 20.4, y: 40.2, w: 10.4, h: 10.0 },
  selective_breeding: { x: 20.4, y: 53.0, w: 10.4, h: 10.0 },
  secrets: { x: 20.4, y: 63.5, w: 10.4, h: 10.0 },
  hardy_warriors: { x: 20.4, y: 76.3, w: 10.4, h: 10.0 },
  stillsuits: { x: 20.4, y: 86.8, w: 10.4, h: 10.0 },
  high_council: { x: 32.4, y: 6.4, w: 11.6, h: 10.4 },
  swordmaster: { x: 44.6, y: 6.4, w: 11.6, h: 10.4 },
  mentat: { x: 56.8, y: 6.4, w: 11.6, h: 10.4 },
  rally_troops: { x: 32.4, y: 17.6, w: 11.6, h: 10.4 },
  hall_of_oratory: { x: 44.6, y: 17.6, w: 11.6, h: 10.4 },
  secure_contract: { x: 70.6, y: 6.4, w: 11.6, h: 10.4 },
  sell_melange: { x: 70.6, y: 17.6, w: 11.6, h: 10.4 },
  carthag: { x: 38.8, y: 32.6, w: 11.8, h: 11.0 },
  arrakeen: { x: 52.8, y: 32.6, w: 11.8, h: 11.0 },
  imperial_basin: { x: 66.8, y: 36.2, w: 11.8, h: 11.0 },
  research_station: { x: 33.4, y: 47.8, w: 11.8, h: 11.0 },
  sietch_tabr: { x: 47.0, y: 49.6, w: 11.8, h: 11.0 },
  hagga_basin: { x: 31.0, y: 63.6, w: 11.8, h: 11.0 },
  the_great_flat: { x: 44.2, y: 67.0, w: 11.8, h: 11.0 },
};

function activeBoardLayout() {
  return skinConfig().boardLayout || SPACE_LAYOUT;
}

function spaceLayout(spaceKey) {
  return activeBoardLayout()[spaceKey] || SPACE_LAYOUT[spaceKey] || { x: 45, y: 45, w: 12, h: 11 };
}

function activeObservationPostLinks() {
  return skinConfig().observationPostLinks || [];
}

function layoutCenter(layout) {
  return {
    x: layout.x + layout.w / 2,
    y: layout.y + layout.h / 2,
  };
}

// Vertical influence ladders sitting to the left of each faction's spaces.
const FACTION_LADDERS = {
  emperor: { x: 16.4, y: 6.4, w: 3.4, h: 20.5 },
  spacing_guild: { x: 16.4, y: 29.7, w: 3.4, h: 20.5 },
  bene_gesserit: { x: 16.4, y: 53.0, w: 3.4, h: 20.5 },
  fremen: { x: 16.4, y: 76.3, w: 3.4, h: 20.5 },
};

const BR_RECOMMENDATION_SETTING_KEY = "duneShowBrRecommendation";
const OPPONENT_SEARCH_SETTING_KEY = "duneOpponentSearchEnabled";
const OPPONENT_SEARCH_SIMULATIONS_SETTING_KEY = "duneOpponentSearchSimulations";
const SELECTED_LEADER_SETTING_KEY = "duneSelectedLeader";
const DEFAULT_OPPONENT_SEARCH_SIMULATIONS = 16;

let gameState = null;
let selectedSpaceKey = null;
let selectedCardKey = null;
let selectedActionGroupKey = null;
let selectedTroopsByGroup = new Map();
let selectedTrashByGroup = new Map();
let selectedSignetByGroup = new Map();
let selectedAgentChoicesByGroup = new Map();
let selectedChoiceGroupKey = null;
let selectedChoicesByGroup = new Map();
let selectedLeaderSetupFactions = [];
let actionSearch = "";
let busy = false;
let acquirePointerDrag = null;
let acquireMouseDrag = null;
let acquireDocumentDragBound = false;
let suppressAcquireClickCardKey = null;
// Hidden via the close button / Escape so the board stays reachable during
// the Reveal turn (e.g. to play plot Tactic cards before acquiring).
let acquireOverlayHidden = false;
let movesDrawerOpen = false;
let logDrawerOpen = false;
let settingsDrawerOpen = false;
// Full-screen viewer for a player's public card zones (deck/discard/trash).
let playerViewId = null;
let playerViewTab = "deck";
let handDrag = null;
let handDragDocumentBound = false;
let suppressHandClickCardKey = null;
// Set when a tactic card was dropped on the board but its play still
// needs disambiguation; the prompt dock then shows just that card's options.
let intrigueDropKey = null;
let showBrRecommendation = loadBooleanSetting(
    BR_RECOMMENDATION_SETTING_KEY, false);
let opponentSearchEnabled = loadBooleanSetting(
    OPPONENT_SEARCH_SETTING_KEY, false);
let opponentSearchSimulations = loadIntegerSetting(
    OPPONENT_SEARCH_SIMULATIONS_SETTING_KEY,
    DEFAULT_OPPONENT_SEARCH_SIMULATIONS);
let selectedLeaderId = loadLeaderSetting();
const configuredPlayerCount = configuredWebPlayerCount();

const app = document.getElementById("app");

function loadBooleanSetting(key, fallback) {
  try {
    const value = window.localStorage.getItem(key);
    return value === null ? fallback : value === "1";
  } catch (error) {
    return fallback;
  }
}

function loadIntegerSetting(key, fallback) {
  try {
    const value = window.localStorage.getItem(key);
    if (value === null) return fallback;
    return normalizeSearchSimulations(Number(value));
  } catch (error) {
    return fallback;
  }
}

function loadLeaderSetting() {
  try {
    const stored = window.localStorage.getItem(SELECTED_LEADER_SETTING_KEY);
    if (stored === null) return 1;
    const value = Number(stored);
    return LEADER_OPTIONS.some((leader) => leader.id === value) ? value : 1;
  } catch (error) {
    return 1;
  }
}

function saveBooleanSetting(key, value) {
  try {
    window.localStorage.setItem(key, value ? "1" : "0");
  } catch (error) {
    // Ignore storage failures; the setting still works for the current page.
  }
}

function saveIntegerSetting(key, value) {
  try {
    window.localStorage.setItem(key, String(value));
  } catch (error) {
    // Ignore storage failures; the setting still works for the current page.
  }
}

function saveLeaderSetting(value) {
  try {
    window.localStorage.setItem(SELECTED_LEADER_SETTING_KEY, String(value));
  } catch (error) {
    // Ignore storage failures; the leader remains selected for this page.
  }
}

function normalizeSelectedLeader() {
  if (!LEADER_OPTIONS.some((leader) => leader.id === selectedLeaderId)) {
    selectedLeaderId = LEADER_OPTIONS[0]?.id ?? 1;
    saveLeaderSetting(selectedLeaderId);
  }
}

function normalizeSearchSimulations(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return DEFAULT_OPPONENT_SEARCH_SIMULATIONS;
  }
  return Math.max(1, Math.floor(parsed));
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function starfallText(value) {
  let text = String(value ?? "");
  const replacements = [
    ["Poison Snooper", "Sensor Probe"],
    ["Signet Ring", "Command Seal"],
    ["High Council", "Command Council"],
    ["Victory Points", "Prestige"],
    ["Victory Point", "Prestige"],
    ["victory points", "prestige"],
    ["victory point", "prestige"],
    ["Imperium Row", "Compact Row"],
    ["Imperium row", "Compact row"],
    ["Imperium deck", "Compact deck"],
    ["Imperium", "Compact"],
    ["Intrigue", "Tactic"],
    ["intrigue", "tactic"],
    ["Spice", "Aetherite"],
    ["spice", "aetherite"],
    ["Solari", "Credits"],
    ["solari", "credits"],
    ["Water", "Coolant"],
    ["water", "coolant"],
    ["Persuasion", "Command"],
    ["persuasion", "command"],
    ["Mentat", "Analyst"],
    ["Swordmaster", "Fleet Marshal"],
    ["swords", "force"],
    ["Swords", "Force"],
    ["sword", "force"],
    ["Sword", "Force"],
    ["troops", "crews"],
    ["Troops", "Crews"],
    ["troop", "crew"],
    ["Troop", "Crew"],
    ["Emperor", "Helix Authority"],
    ["Spacing Guild", "Slipstream Combine"],
    ["Bene Gesserit", "Mnemosyne Synod"],
    ["Fremen", "Rim Freeholds"],
    ["Landsraad", "Compact Council"],
    ["CHOAM", "Trade Compact"],
    ["VP", "Prestige"],
  ];
  for (const [from, to] of replacements) {
    text = text.replaceAll(from, to);
  }
  return text;
}

function publicText(value) {
  return window.Concord ? window.Concord.text(value) : String(value ?? "");
}

function temporaryAgentName() {
  if (activeSkin === "starfall") return "Analyst";
  if (activeSkin === "uprising") return "extra Agent";
  return "Mentat";
}

function temporaryAgentRecruitedText() {
  if (activeSkin === "uprising") return "Extra Agent available this round";
  return `${temporaryAgentName()} recruited (extra agent this round)`;
}

function temporaryAgentNextRoundText() {
  if (activeSkin === "uprising") return "Temporary extra Agent next round";
  return `Temporary ${temporaryAgentName()} next round`;
}

function imageTag(src, alt, className = "") {
  if (activeSkin !== "starfall" && window.DunePresentation &&
      !window.DunePresentation.installed(src)) {
    src = window.DunePresentation.artwork(alt, /space|landscape|preview/.test(className));
  }
  if (!src) {
    return `<div class="image-fallback ${className}">${escapeHtml(initials(alt))}</div>`;
  }
  // Eager loading + sync decode: the whole app re-renders via innerHTML, so
  // lazy images would flash dark on every state change even when cached.
  return `<img class="${className}" src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" decoding="sync">`;
}

function iconTag(kind, label, className = "") {
  return imageTag(RESOURCE_ICONS[kind], label || kind, className);
}

function agentIconTag(key) {
  const meta = AGENT_ICON_META[key] || { icon: RESOURCE_ICONS.agent, label: key };
  return imageTag(meta.icon, meta.label, "sf-agent-icon");
}

function leaderHeadImage(leader) {
  return leader?.headImage || leaderInfoForKey(leader?.key)?.headImage || leader?.image || "";
}

function leaderPortraitImage(leader) {
  return leader?.image || leaderInfoForKey(leader?.key)?.image || leaderHeadImage(leader);
}

function initials(text) {
  return String(text || "?")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

async function postJson(url, body) {
  const staticEngine = window.starfallStaticEngine || window.duneStaticEngine;
  if (staticEngine?.postJson) {
    return await staticEngine.postJson(url, body);
  }
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body ?? {}),
  });
  const payload = await response.json();
  if (!response.ok || payload.error) {
    throw new Error(payload.error || `HTTP ${response.status}`);
  }
  return payload;
}

async function startGame(seed = null, humanLeader = selectedLeaderId, seedInputValue = "") {
  setBusy(true);
  if (!gameState) {
    renderStartScreen("", seedInputValue);
  }
  try {
    setGameState(await postJson("/api/new", {
      ...(seed === null ? {} : { seed }),
      players: configuredPlayerCount,
      humanPlayer: 0,
      humanLeader,
      opponentSearchEnabled,
      opponentSearchSimulations,
      skin: activeSkin,
    }));
    selectedSpaceKey = null;
    selectedCardKey = null;
    selectedActionGroupKey = null;
    selectedTroopsByGroup.clear();
    selectedTrashByGroup.clear();
    selectedSignetByGroup.clear();
    selectedAgentChoicesByGroup.clear();
    selectedChoiceGroupKey = null;
    selectedChoicesByGroup.clear();
    selectedLeaderSetupFactions = [];
    intrigueDropKey = null;
    actionSearch = "";
    playerViewId = null;
    playerViewTab = "deck";
    render();
  } finally {
    setBusy(false);
  }
}

function poisonSnooperState() {
  return gameState?.poisonSnooper || null;
}

function poisonSnooperPending() {
  const snooper = poisonSnooperState();
  return Boolean(snooper?.pending && snooper.topDeck);
}

async function applyAction(actionId) {
  if (!gameState || busy) return;
  // State is already authoritative. Starting another action dismisses the
  // remaining presentation instead of swallowing the player's input.
  resetFx();
  // Sensor Probe resolves in two steps: every path that would submit a
  // draw/trash option before the card is committed plays the card first, so
  // the top-deck card is never revealed before the commitment.
  const snooper = poisonSnooperState();
  if (snooper?.available && !snooper.pending &&
      (actionId === snooper.drawActionId || actionId === snooper.trashActionId)) {
    actionId = snooper.commitActionId;
  }
  setBusy(true);
  try {
    setGameState(await postJson(`/api/session/${gameState.sessionId}/action`, {
      action: actionId,
    }));
    selectedSpaceKey = null;
    selectedCardKey = null;
    selectedActionGroupKey = null;
    selectedTroopsByGroup.clear();
    selectedTrashByGroup.clear();
    selectedSignetByGroup.clear();
    selectedAgentChoicesByGroup.clear();
    selectedChoiceGroupKey = null;
    selectedChoicesByGroup.clear();
    selectedLeaderSetupFactions = [];
    intrigueDropKey = null;
    actionSearch = "";
    selectDefaultPendingChoiceGroup();
    render();
  } catch (error) {
    showError(error.message);
  } finally {
    setBusy(false);
  }
}

async function updateOpponentSearchSettings(nextEnabled, nextSimulations) {
  opponentSearchEnabled = Boolean(nextEnabled);
  opponentSearchSimulations = normalizeSearchSimulations(nextSimulations);
  saveBooleanSetting(OPPONENT_SEARCH_SETTING_KEY, opponentSearchEnabled);
  saveIntegerSetting(
      OPPONENT_SEARCH_SIMULATIONS_SETTING_KEY, opponentSearchSimulations);
  if (!gameState || busy) {
    render();
    return;
  }
  setBusy(true);
  try {
    setGameState(await postJson(`/api/session/${gameState.sessionId}/settings`, {
      opponentSearchEnabled,
      opponentSearchSimulations,
      skin: activeSkin,
    }));
    render();
  } catch (error) {
    showError(error.message);
    render();
  } finally {
    setBusy(false);
  }
}

async function updateSkinSetting(nextSkin) {
  const normalized = normalizeSkin(nextSkin);
  activeSkin = normalized;
  saveSkinSetting(activeSkin);
  applySkinConfig();
  normalizeSelectedLeader();
  if (!gameState || busy) {
    render();
    return;
  }
  setBusy(true);
  try {
    setGameState(await postJson(`/api/session/${gameState.sessionId}/settings`, {
      opponentSearchEnabled,
      opponentSearchSimulations,
      skin: activeSkin,
    }));
    render();
  } catch (error) {
    showError(error.message);
    render();
  } finally {
    setBusy(false);
  }
}

function setGameState(nextState) {
  const previousState = gameState;
  if (nextState?.skin) {
    const stateSkin = normalizeSkin(nextState.skin);
    if (stateSkin !== activeSkin) {
      activeSkin = stateSkin;
      saveSkinSetting(activeSkin);
      applySkinConfig();
      normalizeSelectedLeader();
    }
  }
  gameState = nextState;
  if (nextState?.phase !== previousState?.phase ||
      nextState?.currentPlayer !== previousState?.currentPlayer) {
    acquireOverlayHidden = false;
  }
  queueStateFx(previousState, nextState);
  const opponentSearch = gameState?.opponentSearch;
  if (!opponentSearch) return;
  opponentSearchEnabled = Boolean(opponentSearch.enabled);
  if (Number.isFinite(opponentSearch.simulations)) {
    opponentSearchSimulations = normalizeSearchSimulations(
        opponentSearch.simulations);
  }
  saveBooleanSetting(OPPONENT_SEARCH_SETTING_KEY, opponentSearchEnabled);
  saveIntegerSetting(
      OPPONENT_SEARCH_SIMULATIONS_SETTING_KEY, opponentSearchSimulations);
}

function setBusy(nextBusy) {
  busy = nextBusy;
  document.body.classList.toggle("busy", busy);
  document.querySelectorAll(
      ".action-button, .agent-group-button, .trash-picker button, " +
      ".signet-picker button, .faction-picker button, .choice-group-button, " +
      ".choice-picker button, .reveal-button, .confirm-button, " +
      ".space-choice-chip, .space-choice-skip").forEach((button) => {
    button.disabled = busy;
  });
}

function showError(message) {
  const banner = document.querySelector(".error-banner");
  if (banner) {
    banner.textContent = message;
    banner.hidden = false;
  } else {
    alert(message);
  }
}

function currentHuman() {
  return gameState.players.find((player) => player.id === gameState.humanPlayer);
}

function isHumanTurn() {
  return !gameState.terminal && gameState.currentPlayer === gameState.humanPlayer;
}

function currentRecommendation() {
  const recommendation = gameState?.recommendation;
  if (!recommendation?.available || !Number.isFinite(recommendation.actionId)) {
    return null;
  }
  return recommendation;
}

function formatProbability(probability) {
  if (!Number.isFinite(probability)) return "";
  const percent = Math.max(0, probability * 100);
  if (percent > 0 && percent < 0.1) return "<0.1%";
  return `${percent.toFixed(percent < 10 ? 1 : 0)}%`;
}

function currentBrRecommendations() {
  if (!showBrRecommendation) return [];
  const recommendation = currentRecommendation();
  if (!recommendation) return [];
  const topActions = Array.isArray(recommendation.topActions) &&
      recommendation.topActions.length
    ? recommendation.topActions
    : [recommendation];
  return topActions
    .filter((item) => Number.isFinite(item.actionId))
    .slice(0, 3)
    .map((item, index) => ({
      ...item,
      rank: Number.isFinite(item.rank) ? item.rank : index + 1,
    }));
}

function currentBrRecommendationForAction(action) {
  return currentBrRecommendationForActionId(action.id);
}

function currentBrRecommendationForActionId(actionId) {
  return currentBrRecommendations()
    .find((item) => item.actionId === actionId) || null;
}

function currentBrAcquireRecommendationsByCardKey() {
  const recommendations = new Map();
  if (!showBrRecommendation) return recommendations;
  const recommendation = currentRecommendation();
  if (!recommendation || !Array.isArray(recommendation.acquireCards)) {
    return recommendations;
  }
  for (const item of recommendation.acquireCards) {
    if (!item?.cardKey || !Number.isFinite(item.probability)) continue;
    recommendations.set(item.cardKey, item);
  }
  return recommendations;
}

function orderActionsForRecommendation(actions) {
  const topActions = currentBrRecommendations();
  if (!topActions.length) return actions;
  const actionsById = new Map(actions.map((action) => [action.id, action]));
  const rankedActions = topActions
    .map((item) => actionsById.get(item.actionId))
    .filter(Boolean);
  if (!rankedActions.length) return actions;
  const rankedIds = new Set(rankedActions.map((action) => action.id));
  return rankedActions.concat(
    actions.filter((action) => !rankedIds.has(action.id)));
}

function orderGroupsForRecommendation(groups, recommendationForGroup) {
  const rankedGroups = groups
    .map((group, index) => ({ group, index, recommendation: recommendationForGroup(group) }))
    .filter((item) => item.recommendation)
    .sort((left, right) =>
      left.recommendation.rank - right.recommendation.rank ||
      left.index - right.index);
  if (!rankedGroups.length) return groups;
  const rankedKeys = new Set(rankedGroups.map((item) => item.group.key));
  return rankedGroups.map((item) => item.group).concat(
    groups.filter((group) => !rankedKeys.has(group.key)));
}

function recommendationTitle(action) {
  const brRecommendation = currentBrRecommendationForAction(action);
  if (!brRecommendation) return "";
  const recommendation = currentRecommendation();
  if (!recommendation) return "";
  const label = recommendation.searched ? "Search" : "BR";
  const sourceId = recommendation.searchPolicyId || recommendation.policyId;
  const probability = formatProbability(brRecommendation.probability);
  const probabilityText = probability
    ? `, ${probability} policy probability`
    : "";
  const searchText = recommendation.searched &&
      Number.isFinite(brRecommendation.meanValue)
    ? `, ${brRecommendation.meanValue.toFixed(3)} searched value over ${brRecommendation.visits} samples`
    : "";
  return `${label} #${brRecommendation.rank} from ${sourceId}${probabilityText}${searchText}`;
}

function selectedHandCard() {
  if (!selectedCardKey || !gameState) return null;
  const human = currentHuman();
  return human.cards.hand.find((card) => card.key === selectedCardKey) || null;
}

function legalSpaceKeysForCard(cardKey) {
  const groupedSpaces = new Set(agentPlacementGroups()
    .filter((group) => group.cardKey === cardKey)
    .map((group) => group.spaceKey));
  if (groupedSpaces.size > 0) return groupedSpaces;
  return new Set(gameState.legalActions
    .filter((action) => action.kind === "agent" && action.cardKey === cardKey && action.spaceKey)
    .map((action) => action.spaceKey));
}

function agentPlacementGroups() {
  return gameState?.actionGroups?.agentPlacements || [];
}

function leaderSetupGroups() {
  return gameState?.actionGroups?.leaderSetups || [];
}

function choiceGroups() {
  return gameState?.actionGroups?.choiceGroups || [];
}

function choiceGroupForKey(key) {
  return choiceGroups().find((group) => group.key === key) || null;
}

// Pending stand-alone choices that target a board space (e.g. "Place spy on
// Arrakeen"). These are resolved by clicking the highlighted space directly.
function spaceChoiceActions() {
  if (!gameState || gameState.terminal || !isHumanTurn()) return [];
  const actions = (gameState.legalActions || []).filter(
    (action) => action.kind === "choice");
  if (!actions.length || !actions.some((action) => action.spaceKey)) return [];
  return actions;
}

function spaceChoiceTargets() {
  const targets = new Map();
  spaceChoiceActions().forEach((action) => {
    if (action.spaceKey && !targets.has(action.spaceKey)) {
      targets.set(action.spaceKey, action);
    }
  });
  return targets;
}

function spaceChoicePrompt(actions) {
  const first = actions.find((action) => action.spaceKey);
  if (!first) return "Choose an option";
  const label = publicText(first.label || "Choose a space");
  const suffix = ` on ${first.spaceName || ""}`;
  return label.endsWith(suffix)
    ? label.slice(0, label.length - suffix.length)
    : label;
}

function leaderSetupGroup() {
  return leaderSetupGroups()[0] || null;
}

function sameFactionSet(left, right) {
  if (!Array.isArray(left) || !Array.isArray(right) || left.length !== right.length) {
    return false;
  }
  return left.every((faction) => right.includes(faction));
}

function leaderSetupRecommendation(group) {
  const ranked = (group?.actionOptions || [])
    .map((option) => currentBrRecommendationForActionId(option.actionId))
    .filter(Boolean)
    .sort((left, right) => left.rank - right.rank);
  return ranked[0] || null;
}

function leaderSetupRecommendationOption(group) {
  const recommendation = leaderSetupRecommendation(group);
  if (!recommendation) return null;
  return (group?.actionOptions || [])
    .find((option) => option.actionId === recommendation.actionId) || null;
}

function defaultLeaderSetupFactions(group) {
  const options = group?.actionOptions || [];
  if (options.some((option) => sameFactionSet(option.factionKeys, selectedLeaderSetupFactions))) {
    return selectedLeaderSetupFactions;
  }
  const legalFactions = new Set((group?.factionOptions || []).map((option) => option.factionKey));
  const partial = selectedLeaderSetupFactions.filter((faction) => legalFactions.has(faction));
  if (partial.length !== selectedLeaderSetupFactions.length) {
    selectedLeaderSetupFactions = partial;
  }
  if (partial.length > 0 && partial.length < (group?.requiredChoices || 2)) return partial;
  return [];
}

function actionIdForLeaderSetup(group, factionKeys) {
  return (group?.actionOptions || [])
    .find((option) => sameFactionSet(option.factionKeys, factionKeys))?.actionId ?? null;
}

function toggleLeaderSetupFaction(group, factionKey) {
  const requiredChoices = group?.requiredChoices || 2;
  const current = defaultLeaderSetupFactions(group).slice();
  const existing = current.indexOf(factionKey);
  if (existing >= 0) {
    current.splice(existing, 1);
  } else if (current.length < requiredChoices) {
    current.push(factionKey);
  } else {
    current.shift();
    current.push(factionKey);
  }
  selectedLeaderSetupFactions = current;
  render();
}

function sortedTroopOptions(group) {
  return (group?.troopOptions || [])
    .slice()
    .sort((left, right) => left.troops - right.troops);
}

function sortedTrashOptions(group) {
  const options = (group?.trashOptions || [])
    .slice()
    .sort((left, right) => left.cardName.localeCompare(right.cardName));
  const hasNoTrashOption = sortedActionOptions(group)
    .some((option) => !option.trashCardKey);
  if (options.length > 0 && hasNoTrashOption) {
    return [{ cardKey: "", cardName: "No trash" }, ...options];
  }
  return options;
}

function signetOptionKey(option) {
  if (!option || option.kind === "none") return "none";
  if (option.kind === "spice") return `spice:${option.factionKey || ""}`;
  if (option.kind === "solari") {
    return option.factionKey ? `solari:${option.factionKey}` : "solari";
  }
  return option.kind || "none";
}

function actionSignetKey(option) {
  if (option?.signetPaySpice) return `spice:${option.signetFactionKey || ""}`;
  if (option?.signetPaySolari) {
    return option.signetFactionKey ? `solari:${option.signetFactionKey}` : "solari";
  }
  return "none";
}

const AGENT_CHOICE_DIMENSIONS = [
  { field: "sellSpice", label: "Spice", numeric: true },
  { field: "signetCardKey", label: "Reserve", labelField: "signetCardName" },
  { field: "leaderFactionKey", label: "Faction", labelField: "leaderFactionName", faction: true },
  { field: "effectPayCost", label: "Cost", boolLabels: ["Skip cost", "Pay cost"] },
  { field: "effectFactionKey", label: "Gain", labelField: "effectFactionName", faction: true },
  { field: "effectLoseFactionKey", label: "Lose", labelField: "effectLoseFactionName", faction: true },
  { field: "voiceSpaceKey", label: "Block", labelField: "voiceSpaceName" },
  { field: "recallSpaceKey", label: "Recall", labelField: "recallSpaceName" },
];

const GENERIC_CHOICE_DIMENSIONS = [
  { field: "source", label: "Source" },
  { field: "choiceCardKey", label: "Card", labelField: "choiceCardName" },
  { field: "factionKey", label: "Faction", labelField: "factionName", faction: true },
  { field: "factionChoiceKey", label: "Factions", labelField: "factionChoiceName", faction: true },
  { field: "rewardOptionKey", label: "Reward", labelField: "rewardOptionName" },
  { field: "trashChoiceKey", label: "Trash", labelField: "trashChoiceName" },
  { field: "discardCardKey", label: "Discard", labelField: "discardCardName" },
  { field: "responseKey", label: "Response", labelField: "responseName" },
  { field: "memoryChoiceKey", label: "Choice", labelField: "memoryChoiceName" },
  { field: "recoverCardKey", label: "Recover", labelField: "recoverCardName" },
  { field: "optionValue", label: "Option", labelField: "optionName" },
  { field: "targetPlayer", label: "Target", labelField: "targetPlayerName" },
  { field: "spaceKey", label: "Space", labelField: "spaceName" },
  { field: "troops", label: "Troops", numeric: true },
  { field: "paySpice", label: "Spice", boolLabels: ["No spice", "Pay spice"] },
  { field: "toTopDeck", label: "Destination", boolLabels: ["Discard", "Top deck"] },
];

function optionValue(option, field) {
  if (!Object.prototype.hasOwnProperty.call(option, field)) {
    if (field === "effectPayCost" || field === "paySpice" || field === "toTopDeck") return false;
    return "";
  }
  return option[field];
}

function sameChoiceValue(left, right) {
  return String(left) === String(right);
}

function trashChoiceButtonLabel(value, option) {
  if (option?.trashChoiceName) {
    if (String(value) === "skip") return option.trashChoiceName;
    return `Trash ${option.trashChoiceName}`;
  }
  return option?.label || "";
}

function choiceValueLabel(value, option, dimension) {
  if (dimension.field === "trashChoiceKey") {
    const trashLabel = trashChoiceButtonLabel(value, option);
    if (trashLabel) return trashLabel;
  }
  if (dimension.boolLabels) {
    return publicText(value ? dimension.boolLabels[1] : dimension.boolLabels[0]);
  }
  if (dimension.labelField && option?.[dimension.labelField]) {
    return option[dimension.labelField];
  }
  if (typeof value === "number") return String(value);
  return publicText(String(value || "None").replaceAll("_", " "));
}

function dimensionsForOptions(options, dimensions) {
  const resolved = dimensions
    .map((dimension) => {
      const seen = new Set();
      const values = [];
      for (const option of options) {
        const value = optionValue(option, dimension.field);
        const key = String(value);
        if (seen.has(key)) continue;
        seen.add(key);
        values.push({
          value,
          label: choiceValueLabel(value, option, dimension),
          className: dimension.faction ? String(value).split("|")[0] : "",
        });
      }
      values.sort((left, right) => {
        if (typeof left.value === "number" && typeof right.value === "number") {
          return left.value - right.value;
        }
        return left.label.localeCompare(right.label);
      });
      return { ...dimension, values };
    })
    .filter((dimension) => dimension.values.length > 1);
  if (resolved.some((dimension) => dimension.field !== "optionValue")) {
    return resolved.filter((dimension) => dimension.field !== "optionValue");
  }
  return resolved;
}

function normalizeChoiceSelection(options, dimensions, choices, changedField = null) {
  if (!dimensions.length) return {};
  const exact = options.find((option) => dimensions.every((dimension) =>
    sameChoiceValue(optionValue(option, dimension.field), choices[dimension.field])));
  const fallback = exact || (changedField
    ? options.find((option) =>
      sameChoiceValue(optionValue(option, changedField), choices[changedField]))
    : null) || options[0];
  const normalized = {};
  for (const dimension of dimensions) {
    normalized[dimension.field] = optionValue(fallback, dimension.field);
  }
  return normalized;
}

function choiceSelectionKey(groupKey, field) {
  return `${groupKey}:${field}`;
}

function parseChoiceDataAttribute(rawValue) {
  const text = String(rawValue || "");
  const separatorIndex = text.indexOf(":");
  if (separatorIndex < 0) return ["", ""];
  return [
    text.slice(0, separatorIndex),
    text.slice(separatorIndex + 1),
  ];
}

function sortedSignetOptions(group) {
  return (group?.signetOptions || [])
    .slice()
    .sort((left, right) => {
      const order = { none: 0, spice: 1, solari: 2 };
      return (order[left.kind] ?? 9) - (order[right.kind] ?? 9) ||
        (left.factionName || left.label || "").localeCompare(
            right.factionName || right.label || "");
    });
}

function sortedActionOptions(group) {
  return (group?.actionOptions || [])
    .slice()
    .sort((left, right) =>
      left.troops - right.troops ||
      (left.trashCardName || "").localeCompare(right.trashCardName || "") ||
      actionSignetKey(left).localeCompare(actionSignetKey(right)) ||
      (left.signetCardName || "").localeCompare(right.signetCardName || "") ||
      (left.leaderFactionName || "").localeCompare(right.leaderFactionName || "") ||
      String(Boolean(left.effectPayCost)).localeCompare(String(Boolean(right.effectPayCost))) ||
      (left.effectFactionName || "").localeCompare(right.effectFactionName || "") ||
      (left.effectLoseFactionName || "").localeCompare(right.effectLoseFactionName || "") ||
      (left.sellSpice ?? -1) - (right.sellSpice ?? -1) ||
      (left.voiceSpaceName || "").localeCompare(right.voiceSpaceName || "") ||
      (left.recallSpaceName || "").localeCompare(right.recallSpaceName || "") ||
      left.actionId - right.actionId);
}

function agentGroupForKey(key) {
  return agentPlacementGroups().find((group) => group.key === key) || null;
}

function agentGroupsForSelection(cardKey, spaceKey) {
  return agentPlacementGroups().filter((group) =>
    (!cardKey || group.cardKey === cardKey) &&
    (!spaceKey || group.spaceKey === spaceKey));
}

function groupVisible(group) {
  if (selectedSpaceKey && group.spaceKey !== selectedSpaceKey) return false;
  if (selectedCardKey && group.cardKey !== selectedCardKey) return false;
  if (actionSearch) {
    const haystack = `${group.cardName} ${group.spaceName} ${group.cost} ${group.extras}`.toLowerCase();
    if (!haystack.includes(actionSearch.toLowerCase())) return false;
  }
  return true;
}

function groupRecommendation(group) {
  const ranked = sortedActionOptions(group)
    .map((option) => currentBrRecommendationForActionId(option.actionId))
    .filter(Boolean)
    .sort((left, right) => left.rank - right.rank);
  return ranked[0] || null;
}

function choiceGroupRecommendation(group) {
  const ranked = (group?.actionOptions || [])
    .map((option) => currentBrRecommendationForActionId(option.actionId))
    .filter(Boolean)
    .sort((left, right) => left.rank - right.rank);
  return ranked[0] || null;
}

function recommendedActionOptionForAgentGroup(group) {
  const recommendation = groupRecommendation(group);
  if (!recommendation) return null;
  return sortedActionOptions(group)
    .find((option) => option.actionId === recommendation.actionId) || null;
}

function recommendedActionOptionForChoiceGroup(group) {
  const recommendation = choiceGroupRecommendation(group);
  if (!recommendation) return null;
  return (group?.actionOptions || [])
    .find((option) => option.actionId === recommendation.actionId) || null;
}

function defaultTroopsForGroup(group) {
  const options = sortedTroopOptions(group);
  if (options.length === 0) return 0;
  const stored = selectedTroopsByGroup.get(group.key);
  if (options.some((option) => option.troops === stored)) return stored;
  const zeroTroops = options.find((option) => option.troops === 0);
  return zeroTroops ? zeroTroops.troops : options[0].troops;
}

function defaultTrashForGroup(group) {
  const options = sortedTrashOptions(group);
  if (options.length === 0) return "";
  const stored = selectedTrashByGroup.get(group.key);
  if (options.some((option) => option.cardKey === stored)) return stored;
  return options[0].cardKey;
}

function defaultSignetForGroup(group) {
  const options = sortedSignetOptions(group);
  if (options.length === 0) return "none";
  const stored = selectedSignetByGroup.get(group.key);
  if (options.some((option) => signetOptionKey(option) === stored)) return stored;
  return signetOptionKey(options[0]);
}

function defaultAgentChoicesForGroup(group) {
  const options = sortedActionOptions(group);
  const stored = selectedAgentChoicesByGroup.get(group.key) || {};
  const dimensions = dimensionsForOptions(options, AGENT_CHOICE_DIMENSIONS);
  const choices = {};
  for (const dimension of dimensions) {
    const storedValue = stored[dimension.field];
    if (dimension.values.some((item) => sameChoiceValue(item.value, storedValue))) {
      choices[dimension.field] = storedValue;
    } else {
      choices[dimension.field] = optionValue(options[0], dimension.field);
    }
  }
  return normalizeChoiceSelection(options, dimensions, choices);
}

function actionIdForGroupSelection(group, troops, trashCardKey, signetKey, agentChoices = {}) {
  return sortedActionOptions(group)
    .find((option) =>
      option.troops === troops &&
      ((option.trashCardKey || "") === (trashCardKey || "")) &&
      actionSignetKey(option) === (signetKey || "none") &&
      dimensionsForOptions(sortedActionOptions(group), AGENT_CHOICE_DIMENSIONS)
        .every((dimension) =>
          sameChoiceValue(optionValue(option, dimension.field), agentChoices[dimension.field])))?.actionId ?? null;
}

function selectAgentGroup(group) {
  selectedActionGroupKey = group.key;
  selectedCardKey = group.cardKey;
  selectedSpaceKey = group.spaceKey;
  selectedTroopsByGroup.set(group.key, defaultTroopsForGroup(group));
  selectedTrashByGroup.set(group.key, defaultTrashForGroup(group));
  selectedSignetByGroup.set(group.key, defaultSignetForGroup(group));
  selectedAgentChoicesByGroup.set(group.key, defaultAgentChoicesForGroup(group));
  selectedChoiceGroupKey = null;
  render();
}

function cancelAgentMoveSelection() {
  const hadAgentGroup = Boolean(selectedActionGroupKey);
  const hadAgentCard = Boolean(selectedCardKey && selectedHandCard());
  if (!hadAgentGroup && !hadAgentCard && !selectedSpaceKey) return false;
  selectedActionGroupKey = null;
  selectedSpaceKey = null;
  if (hadAgentGroup || hadAgentCard) selectedCardKey = null;
  selectedTroopsByGroup.clear();
  selectedTrashByGroup.clear();
  selectedSignetByGroup.clear();
  selectedAgentChoicesByGroup.clear();
  return true;
}

function maybeSelectOrApplyAgentGroup(cardKey, spaceKey) {
  const groups = agentGroupsForSelection(cardKey, spaceKey);
  if (groups.length !== 1) return false;
  const options = sortedActionOptions(groups[0]);
  if (options.length === 1) {
    applyAction(options[0].actionId);
  } else {
    selectAgentGroup(groups[0]);
  }
  return true;
}

function defaultChoicesForChoiceGroup(group) {
  const options = group?.actionOptions || [];
  const stored = selectedChoicesByGroup.get(group.key) || {};
  const dimensions = dimensionsForOptions(options, GENERIC_CHOICE_DIMENSIONS);
  const choices = {};
  for (const dimension of dimensions) {
    const storedValue = stored[dimension.field];
    if (dimension.values.some((item) => sameChoiceValue(item.value, storedValue))) {
      choices[dimension.field] = storedValue;
    } else {
      choices[dimension.field] = optionValue(options[0], dimension.field);
    }
  }
  return normalizeChoiceSelection(options, dimensions, choices);
}

function actionIdForChoiceSelection(group, choices) {
  const dimensions = dimensionsForOptions(group?.actionOptions || [], GENERIC_CHOICE_DIMENSIONS);
  return (group?.actionOptions || [])
    .find((option) => dimensions.every((dimension) =>
      sameChoiceValue(optionValue(option, dimension.field), choices[dimension.field])))?.actionId ?? null;
}

function choiceConfirmLabel(group, actionId) {
  const option = (group?.actionOptions || [])
    .find((candidate) => candidate.actionId === actionId);
  if (group?.choiceKey === "card_trash" && option) {
    return trashChoiceButtonLabel(option.trashChoiceKey || "", option) ||
        option.label || "Trash card";
  }
  return "Confirm";
}

function selectChoiceGroup(group) {
  selectedChoiceGroupKey = group.key;
  selectedActionGroupKey = null;
  selectedChoicesByGroup.set(group.key, defaultChoicesForChoiceGroup(group));
  render();
}

function selectDefaultPendingChoiceGroup() {
  const groups = choiceGroups().filter((group) => group.choiceKey === "card_trash");
  if (groups.length !== 1) return;
  selectedChoiceGroupKey = groups[0].key;
  selectedChoicesByGroup.set(groups[0].key, defaultChoicesForChoiceGroup(groups[0]));
}

function intrigueActionCardKey(action) {
  return action.intrigueKey || action.cardKey || "";
}

function intrigueActionsForCard(cardKey) {
  return gameState.legalActions.filter((action) =>
    action.kind === "intrigue" && intrigueActionCardKey(action) === cardKey);
}

function isTacticChoiceGroup(group) {
  const options = group?.actionOptions || [];
  return options.length > 0 && options.every((option) => option.intrigueKey);
}

function intrigueChoiceGroupForCard(cardKey) {
  return choiceGroups().find((group) =>
    isTacticChoiceGroup(group) &&
    (group.actionOptions || []).some((option) => option.intrigueKey === cardKey)) || null;
}

function intrigueCardPlayable(cardKey) {
  return intrigueActionsForCard(cardKey).length > 0 ||
    Boolean(intrigueChoiceGroupForCard(cardKey));
}

function playTacticCard(cardKey) {
  const snooper = poisonSnooperState();
  if (cardKey === "poison_snooper" && snooper?.available) {
    // Commit the card first; the top card is only revealed afterwards in the
    // dedicated Sensor Probe overlay.
    applyAction(snooper.commitActionId);
    return;
  }
  const group = intrigueChoiceGroupForCard(cardKey);
  if (group) {
    intrigueDropKey = cardKey;
    selectedCardKey = cardKey;
    selectChoiceGroup(group);
    return;
  }
  const actions = intrigueActionsForCard(cardKey);
  if (actions.length === 1) {
    applyAction(actions[0].id);
    return;
  }
  if (actions.length > 1) {
    intrigueDropKey = cardKey;
    selectedCardKey = cardKey;
    selectedChoiceGroupKey = null;
  }
  render();
}

function intrigueRecommendationForCard(cardKey) {
  return currentBrRecommendations().find((item) => {
    const action = gameState.legalActions.find((candidate) => candidate.id === item.actionId);
    return action && action.kind === "intrigue" &&
      intrigueActionCardKey(action) === cardKey;
  }) || null;
}

function brHintLabel() {
  return gameState?.recommendation?.searched ? "Search" : "BR";
}

function brAgentPlacementHints() {
  const hand = currentHuman()?.cards?.hand || [];
  const hints = [];
  for (const item of currentBrRecommendations()) {
    const action = gameState.legalActions
      .find((candidate) => candidate.id === item.actionId) || null;
    let cardKey = action?.kind === "agent" ? action.cardKey || "" : "";
    let spaceKey = action?.kind === "agent" ? action.spaceKey || "" : "";
    if (!cardKey) {
      const group = agentPlacementGroups().find((candidate) =>
        (candidate.actionOptions || []).some((option) => option.actionId === item.actionId));
      if (group) {
        cardKey = group.cardKey || "";
        spaceKey = group.spaceKey || spaceKey;
      }
    }
    if (!cardKey) continue;
    hints.push({
      ...item,
      cardKey,
      spaceKey,
      spaceName: spaceKey ? spaceDisplayName(spaceKey) : "",
      cardName: hand.find((card) => card.key === cardKey)?.name || "",
    });
  }
  return hints;
}

function brHandCardHints() {
  const hints = new Map();
  for (const hint of brAgentPlacementHints()) {
    const existing = hints.get(hint.cardKey);
    if (!existing || hint.rank < existing.rank) hints.set(hint.cardKey, hint);
  }
  return hints;
}

function brBoardSpaceHints() {
  const hints = new Map();
  for (const hint of brAgentPlacementHints()) {
    if (!hint.spaceKey) continue;
    if (selectedCardKey && hint.cardKey !== selectedCardKey) continue;
    const existing = hints.get(hint.spaceKey);
    if (!existing || hint.rank < existing.rank) hints.set(hint.spaceKey, hint);
  }
  return hints;
}

function renderBrHintBadge(hint, destText = "") {
  const probability = formatProbability(hint.probability);
  return `
    <span class="br-hint-badge br-rank-${hint.rank}">
      <b class="br-hint-rank">${hint.rank}</b>
      ${destText ? `<span class="br-hint-dest">${escapeHtml(destText)}</span>` : ""}
      ${probability ? `<span class="br-hint-prob">${escapeHtml(probability)}</span>` : ""}
    </span>
  `;
}

function renderBrPickLabel() {
  return `<i class="br-pick">${recommendationSourceLabel()}</i>`;
}

function renderBrSpaceBadges(brSpaceHints) {
  if (!brSpaceHints.size) return "";
  return Array.from(brSpaceHints.values()).map((hint) => {
    const layout = spaceLayout(hint.spaceKey);
    if (!layout) return "";
    const probability = formatProbability(hint.probability);
    const title = `${brHintLabel()} #${hint.rank}: play ${hint.cardName || "a card"} here` +
      (probability ? ` (${probability})` : "");
    return `
      <span class="br-hint-badge space-br-badge br-rank-${hint.rank}"
            style="left:${layout.x + layout.w / 2}%;top:${layout.y}%"
            title="${escapeHtml(title)}">
        <b class="br-hint-rank">${hint.rank}</b>
        ${hint.cardName ? `<span class="br-hint-dest">${escapeHtml(hint.cardName)}</span>` : ""}
        ${probability ? `<span class="br-hint-prob">${escapeHtml(probability)}</span>` : ""}
      </span>
    `;
  }).join("");
}

function isAcquirePhase() {
  return gameState?.phase === "acquire" && isHumanTurn();
}

function currentPersuasion(player) {
  if (!player?.reveal?.done) return revealPersuasionTotal(player);
  const remaining = player?.reveal?.remainingPersuasion;
  if (Number.isFinite(remaining)) return remaining;
  return revealPersuasionTotal(player);
}

function acquireActionsByCardKey() {
  const actions = new Map();
  if (!gameState) return actions;
  for (const action of gameState.legalActions) {
    if (action.kind !== "acquire" || !action.cardKey) continue;
    if (!actions.has(action.cardKey)) actions.set(action.cardKey, []);
    actions.get(action.cardKey).push(action);
  }
  return actions;
}

function acquireActionsForCard(cardKey, source = "") {
  const actions = acquireActionsByCardKey().get(cardKey) || [];
  return source ? actions.filter((action) => action.source === source) : actions;
}

function chooseAcquireAction(cardKey, source = "") {
  const actions = acquireActionsForCard(cardKey, source);
  if (actions.length === 0) return null;
  if (actions.length === 1) return actions[0];
  const group = choiceGroups().find((candidate) =>
    candidate.kind === "acquire" &&
    (candidate.actionOptions || []).some((option) =>
      option.cardKey === cardKey && (!source || option.source === source)));
  if (group) {
    selectChoiceGroup(group);
    return null;
  }
  return actions[0];
}

function applyAcquireDrag(cardKey, source = "") {
  suppressAcquireClickCardKey = cardKey;
  setTimeout(() => {
    if (suppressAcquireClickCardKey === cardKey) {
      suppressAcquireClickCardKey = null;
    }
  }, 0);
  const action = chooseAcquireAction(cardKey, source);
  if (action) applyAction(action.id);
}

function statChip(kind, value, label, extraClass = "") {
  return `
    <span class="stat-chip ${extraClass}" title="${escapeHtml(label)}">
      ${iconTag(kind, label)}
      <b>${escapeHtml(value)}</b>
    </span>
  `;
}

function iconCount(kind, count, label = "") {
  if (!count) return "";
  return `
    <span class="icon-count" ${label ? `title="${escapeHtml(label)}"` : ""}>
      ${iconTag(kind, label || kind)}
      ${count > 1 ? `<b>${count}</b>` : ""}
    </span>
  `;
}

function vpSourceEntries(vpSources) {
  const sources = vpSources || {};
  const knownEntries = VP_SOURCE_ORDER.map((key) => [key, Number(sources[key] || 0)]);
  const extraEntries = Object.entries(sources)
    .filter(([key]) => !VP_SOURCE_LABELS[key])
    .map(([key, value]) => [key, Number(value || 0)])
    .sort(([left], [right]) => left.localeCompare(right));
  return knownEntries.concat(extraEntries).filter(([, value]) => value !== 0);
}

function vpSourceLabel(key) {
  return VP_SOURCE_LABELS[key] || key.replaceAll("_", " ");
}

function vpAmountText(value) {
  return publicText(`${value} VP`);
}

function renderVpMedallion(player) {
  const entries = vpSourceEntries(player.vpSources);
  const rows = entries.length
    ? entries.map(([key, value]) => `
      <span class="vp-tooltip-row">
        <span>${escapeHtml(vpSourceLabel(key))}</span>
        <b>${escapeHtml(vpAmountText(value))}</b>
      </span>
    `).join("")
    : `<span class="vp-tooltip-empty">${escapeHtml(publicText("No scored VP yet"))}</span>`;
  const ariaSourceText = entries.length
    ? entries.map(([key, value]) => `${vpSourceLabel(key)} ${vpAmountText(value)}`).join(", ")
    : publicText("No scored VP yet");
  return `
    <span class="vp-medallion vp-line" tabindex="0"
          aria-label="${escapeHtml(publicText(`${player.vp} VP. ${ariaSourceText}`))}">
      ${player.vp}
      <span class="vp-tooltip-panel" role="tooltip">
        <span class="vp-tooltip-title">${escapeHtml(publicText("VP sources"))}</span>
        ${rows}
      </span>
    </span>
  `;
}

function revealPersuasionTotal(player) {
  const preview = player?.reveal?.previewPersuasion;
  if (Number.isFinite(preview)) return preview;
  return player?.reveal?.persuasion || 0;
}

function revealPersuasionTitle(player) {
  return player?.reveal?.done
    ? publicText("Remaining persuasion this Reveal turn")
    : publicText("Persuasion available if you reveal now");
}

function instructionText() {
  if (!gameState) return "";
  if (gameState.terminal) {
    return gameState.winners.length
      ? `Game over — winner: ${gameState.winners
          .map((id) => gameState.players[id]?.leader?.name || `Player ${id}`)
          .join(", ")}`
      : "Game over.";
  }
  if (!isHumanTurn()) {
    const current = gameState.players
      .find((player) => player.id === gameState.currentPlayer);
    return `${current ? current.leader.name : `Player ${gameState.currentPlayer}`} is thinking…`;
  }
  if (leaderSetupGroup()) return "Choose two Factions for the leader setup.";
  if (selectedActionGroupKey) return "Choose options for your Agent turn.";
  const pendingSpaceChoices = spaceChoiceActions();
  if (pendingSpaceChoices.some((action) => action.spaceKey)) {
    return `${spaceChoicePrompt(pendingSpaceChoices)} — tap a highlighted space on the board.`;
  }
  if (isAcquirePhase()) {
    if (acquireOverlayHidden) {
      return "Play Intrigue cards from your hand, or press Cards to keep acquiring.";
    }
    const playablePlots = (currentHuman()?.cards?.intrigue || [])
      .some((card) => intrigueCardPlayable(card.key));
    return playablePlots
      ? "Choose a card to acquire, or play an Intrigue, then End Turn."
      : "Choose a card to acquire, then End Turn.";
  }
  if (selectedCardKey && selectedHandCard()) {
    if (!legalSpaceKeysForCard(selectedCardKey).size) {
      return `${selectedHandCard().name} has no available Agent placements. Keep it for Reveal, or inspect its effects.`;
    }
    return "Select an available board space to send your Agent there.";
  }
  const groups = choiceGroups();
  if (groups.length) return groups[0].title || "Choose an ability to use it.";
  if (gameState.phase === "agent") return "Play a card to take an Agent turn, or Reveal.";
  if (gameState.phase === "combat" || gameState.phase === "combat_intrigue" ||
      gameState.phase === "combat_win_intrigue") {
    return "Combat — choose an option.";
  }
  return `${gameState.phase.replaceAll("_", " ")} — choose an option.`;
}

function renderInstructionBar() {
  return `
    <div class="instruction-bar" role="status" aria-live="polite"><span>${escapeHtml(publicText(instructionText()))}</span></div>
  `;
}

function renderTableMasthead() {
  if (activeSkin !== "uprising") return "";
  return `<header class="table-masthead">
    <div class="table-wordmark"><span>Ashen Concord</span><strong>INSURGENCE</strong></div>
    <div class="table-round"><span>Round <b>${gameState.round}</b> / 10</span>
      <div class="round-pips" aria-hidden="true">${Array.from({ length: 10 }, (_, i) =>
        `<i class="${i < gameState.round ? "reached" : ""}"></i>`).join("")}</div></div>
    <span class="table-phase">${gameState.terminal ? "Game over" : escapeHtml(prettyKey(gameState.phase))}</span>
  </header>`;
}

function renderUprisingGlobalStatus() {
  if (activeSkin !== "uprising" || !gameState) return "";
  const shieldWallStanding = Boolean(gameState.shieldWallStanding);
  const sandwormsBank = Number.isFinite(gameState.sandwormsBank)
    ? gameState.sandwormsBank
    : 0;
  const makerHooksBank = Number.isFinite(gameState.makerHooksBank)
    ? gameState.makerHooksBank
    : 0;
  const wallTitle = shieldWallStanding
    ? "Shield Wall standing — no sandworms can be summoned to Conflicts at Arrakeen, Spice Refinery, or Imperial Basin"
    : "Shield Wall destroyed — sandworms may be summoned to any Conflict";
  return `
    <div class="uprising-global-status" aria-label="Uprising board state">
      <span class="uprising-global-chip shield-wall ${shieldWallStanding ? "standing" : "fallen"}"
            title="${escapeHtml(wallTitle)}">
        <b>Shield Wall</b><em>${escapeHtml(shieldWallStanding ? "Up" : "Down")}</em>
      </span>
      <span class="uprising-global-chip sandworms"
            title="${escapeHtml(`${sandwormsBank} sandworm${sandwormsBank === 1 ? "" : "s"} left in the bank — summoning one needs a Maker Hooks token, and worms double your Conflict rewards`)}">
        ${iconTag("sandworm", "Sandworms", "uprising-global-chip-icon")}
        <b>Worms</b><em>${sandwormsBank}</em>
      </span>
      <span class="uprising-global-chip maker-hooks"
            title="${escapeHtml(`${makerHooksBank} Maker Hooks token${makerHooksBank === 1 ? "" : "s"} left in the bank — gain one at Sietch Tabr to summon sandworms`)}">
        <b>Hooks</b><em>${makerHooksBank}</em>
      </span>
    </div>
  `;
}

function renderTopIcons() {
  return `
    <div class="top-icons">
      ${renderUprisingGlobalStatus()}
      <button class="top-icon${movesDrawerOpen ? " open" : ""}" data-toggle-drawer="moves"
              title="All legal moves" aria-label="All legal moves">&#9776;
        <b>${gameState.legalActions.length}</b>
      </button>
      <button class="top-icon${logDrawerOpen ? " open" : ""}" data-toggle-drawer="log"
              title="Game log" aria-label="Game log">&#9636;</button>
      <button class="top-icon${settingsDrawerOpen ? " open" : ""}" data-toggle-drawer="settings"
              title="Settings" aria-label="Settings">&#9881;</button>
    </div>
  `;
}

function renderSkinSelector(className = "") {
  const options = allowedSkinKeys().map((key) => ({
    key,
    label: WEB_SKIN_LABELS[key] || key,
  }));
  return `
    <div class="skin-selector ${className}" role="group" aria-label="Game skin">
      ${options.map((option) => `
        <button type="button"
                class="${option.key === activeSkin ? "active" : ""}"
                data-skin-choice="${option.key}"
                aria-pressed="${option.key === activeSkin ? "true" : "false"}"
                ${busy ? "disabled" : ""}>
          ${escapeHtml(option.label)}
        </button>
      `).join("")}
    </div>
  `;
}

function renderAgentSlots(player) {
  const agents = player.agents || {};
  const revealed = Boolean(player.reveal?.done);
  const max = (agents.max || 0) + (agents.temporaryMentat ? 1 : 0);
  const available = Math.max(0, max - (agents.placed || 0));
  const slots = [];
  for (let slot = 0; slot < max; slot += 1) {
    const analyst = agents.temporaryMentat && slot === max - 1 ? " analyst" : "";
    slots.push(`<i class="agent-slot${slot < available ? " ready" : ""}${analyst}"></i>`);
  }
  if (!agents.swordmaster) slots.push(`<i class="agent-slot locked"></i>`);
  const notes = [
    revealed
      ? `revealed — no more Agent turns this round${available
          ? ` (${available} unspent agent${available === 1 ? "" : "s"})`
          : ""}`
      : `${available} of ${max} agents available`,
    agents.temporaryMentat ? temporaryAgentRecruitedText() : "",
    agents.swordmaster ? "" : "Swordmaster not recruited",
    agents.highCouncil ? "holds High Council seat" : "",
  ].filter(Boolean).map(publicText).join(" — ");
  return `
    <span class="agent-slots${revealed ? " revealed" : ""}"
          title="${escapeHtml(notes)}">${slots.join("")}</span>
  `;
}

function renderCouncilSeat(player) {
  const seated = Boolean(player.agents?.highCouncil);
  const note = seated
    ? publicText(`${player.leader.name} holds a permanent High Council seat — +2 Persuasion every Reveal turn.`)
    : publicText(`${player.leader.name} has no High Council seat — an Agent sent to the High Council space claims one permanently.`);
  return `
    <div class="council-seat${seated ? " seated" : ""}" title="${escapeHtml(note)}">
      <svg class="council-chair" viewBox="0 0 12 12" aria-hidden="true" focusable="false">
        <path d="M4 8 V3.4 a2 2 0 0 1 4 0 V8 Z"></path>
        <rect x="1.7" y="6.9" width="8.6" height="1.7" rx="0.5"></rect>
        <path d="M2.5 8.6 h2 v2.2 h-2 Z M7.5 8.6 h2 v2.2 h-2 Z"></path>
      </svg>
      <span class="council-label">${escapeHtml(publicText(seated ? "High Council Seat" : "No Council Seat"))}</span>
    </div>
  `;
}

function renderBattleIconStats(player) {
  if (activeSkin !== "uprising") return "";
  const icons = player.battleIcons || {};
  const rows = [
    ["battle_crysknife", icons.crysknife || 0, "Crysknife battle icons"],
    ["battle_desert_mouse", icons.desert_mouse || 0, "Desert Mouse battle icons"],
    ["battle_ornithopter", icons.ornithopter || 0, "Ornithopter battle icons"],
    ["battle_wild", icons.wild || 0, "Wild battle icons"],
  ].filter(([, count]) => count > 0);
  return rows.map(([kind, count, label]) =>
    statChip(kind, count, publicText(label), "battle-icon-chip")).join("");
}

function renderUprisingSpyStat(player) {
  if (activeSkin !== "uprising") return "";
  const spies = player.spies || {};
  const supply = Number.isFinite(spies.supply) ? spies.supply : 0;
  const placed = Number.isFinite(spies.placed) ? spies.placed : 0;
  const placedNames = (gameState?.boardSpaces || [])
    .filter((space) => Array.isArray(space.spiesBy) && space.spiesBy.includes(player.id))
    .map((space) => space.name);
  const title = placed
    ? `${supply} ${supply === 1 ? "Spy" : "Spies"} in supply — ${placed} deployed: ${placedNames.join(", ")}`
    : `${supply} ${supply === 1 ? "Spy" : "Spies"} in supply — none deployed`;
  return statChip("spy", placed ? `${supply}+${placed}` : `${supply}`, title, "spy-stat-chip");
}

function renderUprisingMakerHooksStat(player) {
  if (activeSkin !== "uprising" || !player?.makerHooks) return "";
  return `
    <span class="maker-hooks-chip" title="Has Maker Hooks token">
      ${iconTag("sandworm", "Maker Hooks")}
      <b>Hooks</b>
    </span>
  `;
}

function renderUprisingLeaderStateStats(player) {
  if (activeSkin !== "uprising") return "";
  const leaderState = player?.leaderState || {};
  const memories = Number.isFinite(leaderState.jessicaMemories)
    ? leaderState.jessicaMemories
    : 0;
  const chips = [];
  if (memories > 0) {
    chips.push(`
      <span class="leader-state-chip memory"
            title="${escapeHtml(`${memories} Jessica memor${memories === 1 ? "y" : "ies"}`)}">
        ${iconTag("card", "Jessica memories")}
        <b>${memories} Mem</b>
      </span>
    `);
  }
  if (leaderState.jessicaReverendMother) {
    chips.push(`
      <span class="leader-state-chip reverend"
            title="Jessica has become Reverend Mother">
        ${iconTag("influence", "Reverend Mother")}
        <b>Reverend</b>
      </span>
    `);
  }
  const feydTrainingNode = Number.isFinite(leaderState.feydTrainingNode)
    ? leaderState.feydTrainingNode
    : 0;
  if (player?.leader?.key === "feyd_rautha_harkonnen" || feydTrainingNode > 0) {
    chips.push(`
      <span class="leader-state-chip feyd-training"
            title="${escapeHtml(`Feyd Personal Training node ${feydTrainingNode} of 7`)}">
        ${iconTag("sword", "Feyd Personal Training")}
        <b>Training ${feydTrainingNode}/7</b>
      </span>
    `);
  }
  return chips.join("");
}

function uprisingBattleIconKind(battleIcon) {
  switch (battleIcon?.key) {
    case "crysknife":
      return "battle_crysknife";
    case "desert_mouse":
      return "battle_desert_mouse";
    case "ornithopter":
      return "battle_ornithopter";
    case "wild":
      return "battle_wild";
    default:
      return "conflict";
  }
}

function uprisingObjectiveIconKind(objective) {
  return uprisingBattleIconKind(objective?.battleIcon);
}

function renderUprisingObjectiveBadge(player, className = "") {
  if (activeSkin !== "uprising" || !player?.objective) return "";
  const objective = player.objective;
  const name = objective.name || "Objective";
  const iconName = objective.battleIcon?.name || "Objective";
  const titleParts = [`Objective: ${name}`];
  if (objective.battleIcon?.name) {
    titleParts.push(`Battle icon: ${objective.battleIcon.name}`);
  }
  if (objective.firstPlayerMarker) {
    titleParts.push("Includes the first-player marker");
  }
  const classes = `uprising-objective-badge${className ? ` ${className}` : ""}`;
  return `
    <div class="${classes}" title="${escapeHtml(titleParts.join(" - "))}">
      ${iconTag(uprisingObjectiveIconKind(objective), iconName, "uprising-objective-icon")}
      <b>${escapeHtml(name)}</b>
      ${objective.firstPlayerMarker ? `<em>First</em>` : ""}
    </div>
  `;
}

function renderUprisingConflictBattleIcon(conflict) {
  if (activeSkin !== "uprising" || !conflict?.battleIcon) return "";
  const battleIcon = conflict.battleIcon;
  const name = battleIcon.name || "Battle icon";
  return `
    <span class="uprising-conflict-battle-icon"
          title="${escapeHtml(`${conflict.name}: ${name} battle icon`)}">
      ${iconTag(uprisingBattleIconKind(battleIcon), name, "uprising-conflict-battle-icon-art")}
      <b>${escapeHtml(name)}</b>
    </span>
  `;
}

function renderUprisingCombatSandworms(player) {
  if (activeSkin !== "uprising") return "";
  const count = Number.isFinite(player.troops?.sandworms) ? player.troops.sandworms : 0;
  if (count <= 0) return "";
  return `
    <span class="combat-sandworms"
          title="${escapeHtml(`${count} sandworm${count === 1 ? "" : "s"} in the Conflict (3 strength each) — the rewards this player takes are doubled`)}">
      ${iconTag("sandworm", "Sandworm")}
      <b>${count}</b>
      <em class="worm-double">&times;2</em>
    </span>
  `;
}

const UPRISING_SHIELDED_CONFLICT_LOCATIONS = {
  siege_of_arrakeen: "Arrakeen",
  battle_for_arrakeen: "Arrakeen",
  seize_spice_refinery: "Spice Refinery",
  battle_for_spice_refinery: "Spice Refinery",
  secure_imperial_basin: "Imperial Basin",
  battle_for_imperial_basin: "Imperial Basin",
};

function renderUprisingConflictShieldBadge(conflict) {
  if (activeSkin !== "uprising" || !conflict?.key) return "";
  const location = UPRISING_SHIELDED_CONFLICT_LOCATIONS[conflict.key];
  if (!location) return "";
  const standing = Boolean(gameState?.shieldWallStanding);
  const title = standing
    ? `${location} is protected by the Shield Wall — no sandworms can be summoned to this Conflict`
    : `The Shield Wall is destroyed — sandworms may be summoned to this Conflict at ${location}`;
  return `
    <span class="conflict-shield-badge ${standing ? "standing" : "fallen"}"
          title="${escapeHtml(title)}">
      ${standing ? "&#128737; Shielded" : "&#128737; Breached"}
    </span>
  `;
}

function renderPlaque(player) {
  const active = player.id === gameState.currentPlayer ? " active" : "";
  const human = player.isHuman ? " human" : "";
  const first = player.id === gameState.firstPlayer ? " first-player" : "";
  const revealed = player.reveal?.done ? " revealed" : "";
  const color = PLAYER_COLORS[player.id % PLAYER_COLORS.length];
  const subtitle = player.isHuman ? "You" : "AI opponent";
  const stats = player.isHuman
    ? `
      ${statChip("spice", player.resources.spice, publicText("Spice"))}
      ${statChip("solari", player.resources.solari, publicText("Solari"))}
      ${statChip("water", player.resources.water, publicText("Water"))}
      ${renderUprisingSpyStat(player)}
      ${renderUprisingMakerHooksStat(player)}
      ${renderUprisingLeaderStateStats(player)}
      ${renderBattleIconStats(player)}
      ${statChip("troop", player.troops.garrison, publicText("Troops in garrison"))}
      ${statChip("deck", player.cards.deckCount, "Cards left in deck")}
      ${statChip("discard", player.cards.discardCount, "Cards in discard pile")}
    `
    : `
      ${statChip("spice", player.resources.spice, publicText("Spice"))}
      ${statChip("solari", player.resources.solari, publicText("Solari"))}
      ${statChip("water", player.resources.water, publicText("Water"))}
      ${renderUprisingSpyStat(player)}
      ${renderUprisingMakerHooksStat(player)}
      ${renderUprisingLeaderStateStats(player)}
      ${renderBattleIconStats(player)}
      ${statChip("card", player.cards.handCount, "Cards in hand")}
      ${statChip("intrigue", player.resources.intrigue, publicText("Intrigue cards"))}
      ${statChip("troop", player.troops.garrison, publicText("Troops in garrison"))}
    `;
  return `
    <section class="plaque${active}${human}${first}${revealed}" style="--player-color:${color}"
             data-player-view="${player.id}" role="button" tabindex="0"
             title="${escapeHtml(`${player.leader.name} (${subtitle}) — view deck, discard and trash`)}"
             aria-label="${escapeHtml(`${player.leader.name} (${subtitle}) — view deck, discard and trash`)}">
      <div class="plaque-top">
        ${revealed ? `
          <span class="plaque-revealed-tag"
                title="Already revealed — no more Agent turns this round">Revealed</span>
        ` : ""}
        <span class="plaque-portrait">
          ${imageTag(leaderHeadImage(player.leader), player.leader.name, "plaque-art")}
          ${first ? `
            <img class="first-player-token"
                 src="${escapeHtml(FIRST_PLAYER_TOKEN)}"
                 alt="First player this round" title="First player this round">
          ` : ""}
        </span>
        ${renderVpMedallion(player)}
        ${renderAgentSlots(player)}
      </div>
      <div class="plaque-name">${escapeHtml(player.leader.name)}</div>
      ${renderUprisingObjectiveBadge(player, "plaque-objective")}
      <div class="plaque-stats">${stats}</div>
      ${renderCouncilSeat(player)}
    </section>
  `;
}

function renderPlaques() {
  const human = currentHuman();
  const opponents = gameState.players.filter((player) => !player.isHuman);
  return `
    <aside class="player-strip">
      ${opponents.map((player) => renderPlaque(player)).join("")}
    </aside>
    <aside class="human-corner">
      ${renderPlaque(human)}
    </aside>
  `;
}

function rewardChips(rewards) {
  if (!rewards) return "";
  const tacticCards = Number.isFinite(rewards.intrigue) ? rewards.intrigue : rewards.cards;
  return [
    iconCount("vp", rewards.vp, publicText("Gain VP")),
    iconCount("card", rewards.cards, "Draw cards"),
    Number.isFinite(tacticCards) && tacticCards !== rewards.cards
      ? iconCount("intrigue", tacticCards, publicText("Draw Intrigue cards"))
      : "",
    iconCount("water", rewards.water, publicText("Gain Water")),
    iconCount("spice", rewards.spice, publicText("Gain Spice")),
    iconCount("solari", rewards.solari, publicText("Gain Solari")),
    iconCount("troop", rewards.troops, publicText("Recruit troops")),
    iconCount("influence", rewards.factionChoices, "Gain faction influence"),
    iconCount("trash", rewards.trashCards, "Trash cards"),
    iconCount("influence", rewards.influence, "Gain influence"),
    iconCount("spy", rewards.spies, "Place spies"),
    iconCount("contract", rewards.contracts, "Take contracts"),
    iconCount("trash", rewards.trash, "Trash cards"),
    rewards.mentatNextRound ? iconCount("agent", 1, temporaryAgentNextRoundText()) : "",
  ].filter(Boolean).join("");
}

function cardEffectRow(label, content) {
  if (!content) return "";
  return `
    <div class="sf-card-effect-row">
      <span>${escapeHtml(label)}</span>
      <b>${content}</b>
    </div>
  `;
}

function renderImageOnlyCard(item, className = "", dataAttribute = "data-card") {
  if (!item) return `<div class="small-card dune-image-card empty-card"></div>`;
  const name = item.name || "Card";
  const dataKey = escapeHtml(item.key || "");
  const classes = `small-card dune-image-card card-art ${className}`.trim();
  const data = `${dataAttribute}="${dataKey}"`;
  if (!item.image) {
    return `<div class="image-fallback ${classes}" ${data}>${escapeHtml(initials(name))}</div>`;
  }
  return `<img class="${classes}" ${data} src="${escapeHtml(item.image)}" alt="${escapeHtml(name)}" loading="lazy">`;
}

function cardDetails(card) {
  return activeSkin === "uprising" ? UPRISING_WEB_DATA.cardDetails?.[card?.key] : window.CONCORD_BASE_DETAILS?.[card?.key] || null;
}

function cardRuleSections(card) {
  const sections = cardDetails(card)?.sections || [];
  return sections.filter(section => section.timing !== "general");
}

function renderReadableCard(card, className = "", conflict = false) {
  const type = conflict ? "Conflict" : cardDetails(card)?.type === "intrigue"
    ? "Intrigue" : cardDetails(card)?.type === "contract" ? "Contract" : card.timing ? "Intrigue" : "Imperium";
  const faction = FACTIONS.includes(card.faction) ? card.faction : "imperium";
  const rules = [
    ...cardRuleSections(card).flatMap(section => section.lines),
    ...(card.textLines || []), card.text || "",
  ].filter(Boolean).filter(line => type !== "Imperium" ||
    !/^(Agent icon:|Persuasion on reveal:|Swords:|Troops:|Spice:|Water:|Solari:)/.test(line));
  const reveal = iconCount("persuasion", card.revealPersuasion, "Reveal persuasion") +
    iconCount("sword", card.revealSwords, "Reveal swords") + rewardChips(card.revealRewards);
  const artwork = window.DunePresentation?.artwork(card.name, true) || "";
  const scan = card.image && window.DunePresentation?.installed(card.image)
    ? `<img class="optional-card-scan card-art" src="${escapeHtml(card.image)}" alt="${escapeHtml(card.name)}">` : "";
  return `<article class="small-card readable-card ${faction} ${className}"
      data-${conflict ? "conflict" : "card"}="${escapeHtml(card.key)}">
    <header><span>${escapeHtml(type)}</span>${card.acquireCost > 0
      ? `<b class="readable-card-cost" title="${card.acquireCost} persuasion">${card.acquireCost}</b>` : ""}
      <strong>${escapeHtml(card.name)}</strong></header>
    <div class="readable-card-scene" style="background-image:url('${artwork}')">
      ${iconTag(conflict ? "conflict" : faction === "imperium" ? type === "Intrigue" ? "intrigue" : "agent" : faction, type, "card-emblem")}
    </div>
    <div class="readable-card-rules">
      ${conflict ? (card.rewards || []).map((reward, i) =>
        `<div class="card-rule-line"><span>${["1st", "2nd", "3rd"][i]}</span><b>${rewardChips(reward) || "—"}</b></div>`).join("") : `
        ${(card.agentIcons || []).length ? `<div class="card-rule-line"><span>Agent</span><b>${card.agentIcons.map(agentIconTag).join("")}</b></div>` : ""}
        ${rewardChips(card.agentRewards) ? `<div class="card-rule-line"><span>Gain</span><b>${rewardChips(card.agentRewards)}</b></div>` : ""}
        ${reveal ? `<div class="card-rule-line reveal"><span>Reveal</span><b>${reveal}</b></div>` : ""}`}
      ${rules.length ? `<p class="card-rule-summary">${escapeHtml(rules.join(" · "))}</p>` : ""}
    </div>${scan}</article>`;
}

function inspectCard(key, trigger) {
  const card = findCardInState(key) || (gameState?.conflict?.key === key ? gameState.conflict : null) ||
    uprisingContractCard(key);
  if (!card) return;
  document.querySelector(".card-inspector")?.close();
  const dialog = document.createElement("dialog");
  dialog.className = "card-inspector";
  dialog.setAttribute("aria-label", card.name);
  const description = cardDetails(card)?.description || (card.textLines || []).join(" ") || card.text || "";
  // Prose preserves alternatives and conditions that an icon list cannot convey.
  const sections = (cardDetails(card)?.sections || [])
    .filter(section => !description || section.timing === "general");
  const availablePlays = [...new Set((gameState?.legalActions || [])
    .filter(action => action.kind === "intrigue" && (action.intrigueKey || action.cardKey) === key)
    .map(action => action.detail).filter(detail => detail && !["plot", "combat", "endgame"].includes(detail)))];
  dialog.innerHTML = `<button class="inspector-close" aria-label="Close card details">×</button>
    <div class="inspector-art">${card.key === gameState?.conflict?.key
      ? renderConflictCard(card) : renderCardFace(card)}</div>
    <section class="inspector-copy"><span class="eyebrow">Card details</span><h2>${escapeHtml(card.name)}</h2>
      ${sections.map(section => `<h3>${escapeHtml(prettyKey(section.timing))}</h3>
        <ul>${section.lines.map(line => `<li>${escapeHtml(line)}</li>`).join("")}</ul>`).join("")}
      ${description ? description.split("\n").filter(Boolean).map(line => `<p>${escapeHtml(line)}</p>`).join("") : ""}
      ${availablePlays.length ? `<h3>Available plays</h3>${availablePlays.map(detail => `<p>${escapeHtml(detail)}</p>`).join("")}` : ""}
      ${!sections.length && !description ? `<p>Agent access and available rewards are shown on the card.</p>` : ""}
    </section>`;
  dialog.querySelector("button").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", event => {
    if (event.target === dialog && (event.clientX < dialog.getBoundingClientRect().left ||
        event.clientX > dialog.getBoundingClientRect().right)) dialog.close();
  });
  dialog.addEventListener("close", () => { dialog.remove(); if (trigger?.isConnected) trigger.focus(); });
  document.body.appendChild(dialog);
  dialog.showModal();
}

function renderCardFace(card, className = "") {
  if (window.Concord) {
    const details = cardDetails(card);
    const type = details?.type === "contract" ? "contract" : details?.type === "intrigue" || card?.timing ? "intrigue" : "imperium";
    return window.Concord.render(card,{skin:activeSkin,type,className,details});
  }
  if (!card) return `<article class="small-card sf-card empty-card"></article>`;
  if (activeSkin !== "starfall") return renderReadableCard(card, className);
  const agentIcons = Array.isArray(card.agentIcons) ? card.agentIcons : [];
  const agentAccess = agentIcons.map((key) => agentIconTag(key)).join("");
  const agentRewards = rewardChips(card.agentRewards);
  const revealParts = [
    iconCount("persuasion", card.revealPersuasion, publicText("Reveal persuasion")),
    iconCount("sword", card.revealSwords, publicText("Reveal swords")),
    rewardChips(card.revealRewards),
  ].filter(Boolean).join("");
  const hasCardStats = Number.isFinite(card.acquireCost) ||
    Number.isFinite(card.revealPersuasion) ||
    Number.isFinite(card.revealSwords) ||
    agentIcons.length ||
    agentRewards ||
    revealParts;
  const cost = Number.isFinite(card.acquireCost) && card.acquireCost > 0
    ? `<span class="sf-card-cost" title="Acquire cost">${iconTag("persuasion", publicText("Persuasion cost"))}${card.acquireCost}</span>`
    : "";
  const typeLabel = publicText(hasCardStats ? "Imperium" : "Intrigue");
  const ruleLines = Array.isArray(card.textLines) ? card.textLines : [];
  const displayText = [
    card.timing ? `${card.timing} ${publicText("Intrigue")}` : "",
    ...ruleLines,
    card.text || "",
  ].filter(Boolean);
  return `
    <article class="small-card sf-card ${hasCardStats ? "sf-card--deck" : "sf-card--tactic"} ${className}"
             data-card="${escapeHtml(card.key || "")}">
      <header class="sf-card-header">
        <span>${escapeHtml(typeLabel)}</span>
        ${cost}
        <strong title="${escapeHtml(card.name || "Card")}">${escapeHtml(card.name || "Card")}</strong>
      </header>
      <div class="sf-card-art-wrap">
        ${imageTag(card.image, card.name || "Card", "sf-card-art card-art")}
      </div>
      <section class="sf-card-rules">
        ${agentAccess ? cardEffectRow("Agent", `<span class="sf-agent-icons">${agentAccess}</span>`) : ""}
        ${agentRewards ? cardEffectRow("Gain", agentRewards) : ""}
        ${revealParts ? cardEffectRow("Reveal", revealParts) : ""}
        ${displayText.map((line) => `<p>${escapeHtml(publicText(line))}</p>`).join("")}
      </section>
    </article>
  `;
}

function renderConflictCard(conflict, className = "") {
  if (window.Concord) return window.Concord.render(conflict,{skin:activeSkin,type:"conflict",className});
  if (!conflict) return "";
  if (activeSkin !== "starfall") {
    return renderReadableCard(conflict, className, true);
  }
  const rankLabels = ["1st", "2nd", "3rd"];
  const rewards = Array.isArray(conflict.rewards) ? conflict.rewards : [];
  const rankRows = rewards.length ? rewards.map((reward, index) => {
    const chips = rewardChips(reward);
    return `
      <div>
        <span>${rankLabels[index] || `${index + 1}th`}</span>
        <b>${chips || escapeHtml(publicText(reward.text || "Reward"))}</b>
        ${reward.text ? `<em>${escapeHtml(publicText(reward.text))}</em>` : ""}
      </div>
    `;
  }).join("") : `
      <div><span>1st</span><b>Primary</b></div>
      <div><span>2nd</span><b>Support</b></div>
      <div><span>3rd</span><b>Minor</b></div>
    `;
  return `
    <article class="small-card sf-card sf-card--conflict ${className}"
             data-conflict="${escapeHtml(conflict.key || "")}">
      <header class="sf-card-header">
        <span>Conflict</span>
        <b>Tier ${escapeHtml(conflict.tier || "?")}</b>
        <strong title="${escapeHtml(conflict.name || "Conflict")}">${escapeHtml(conflict.name || "Conflict")}</strong>
      </header>
      <div class="sf-card-art-wrap">
        ${imageTag(conflict.image, conflict.name || "Conflict", "sf-card-art card-art")}
      </div>
      <section class="sf-conflict-ranks" aria-label="Conflict rewards">
        ${rankRows}
      </section>
    </article>
  `;
}

function renderZoom(card, kind = "card") {
  if (!card?.image && !card?.name) return "";
  return `
    <span class="card-zoom">
      ${kind === "conflict" ? renderConflictCard(card, "sf-card--zoom") : renderCardFace(card, "sf-card--zoom")}
    </span>
  `;
}

function spaceCostBadge(space) {
  const cost = space.cost || {};
  const parts = [
    iconCount("water", cost.water, publicText("Water cost")),
    iconCount("spice", cost.spice, publicText("Spice cost")),
    iconCount("solari", cost.solari, publicText("Solari cost")),
  ].filter(Boolean);
  if (activeSkin === "uprising") {
    const optional = cost.optionalSpice ? "spice" : cost.optionalSolari ? "solari" : null;
    if (optional) parts.push(`<span class="optional-cost" title="Optional payment">${iconTag(optional, "Optional " + optional)}0/${cost.optionalSpice || cost.optionalSolari}</span>`);
    const faction = { imperial_privilege: "emperor", shipping: "spacing_guild", sietch_tabr: "fremen" }[space.key];
    if (faction && cost.requiredInfluence) parts.push(`<span class="influence-requirement" title="Requires ${cost.requiredInfluence} ${FACTION_LABELS[faction]} influence">${iconTag(faction, FACTION_LABELS[faction])}${cost.requiredInfluence}+</span>`);
  }
  if (!parts.length) return "";
  return `<span class="space-cost">${parts.join("")}</span>`;
}

function uprisingSpaceDescription(key) {
  return activeSkin === "uprising"
    ? UPRISING_WEB_DATA.boardSpaces.find(space => space.key === key)?.description || "" : "";
}

function uprisingSpaceOptions(space) {
  const gain = (icon, amount = 1) => iconCount(icon, amount, icon);
  const or = '<em class="space-or">or</em>';
  // Printed alternatives are presentation only; the engine supplies legal choices.
  switch (space.key) {
    case "deep_desert":
    case "hagga_basin":
      return `${gain("spice", space.key === "deep_desert" ? 4 : 2)}${or}<span title="Requires Maker Hooks">${gain("sandworm", space.key === "deep_desert" ? 2 : 1)}${iconTag("hooks", "Requires Maker Hooks")}</span>`;
    case "gather_support":
      return `${gain("troop", 2)}<span class="conditional-reward" title="Gain 1 water only if you pay 2 Solari">+${gain("water")}</span>`;
    case "spice_refinery":
      return `${gain("solari", 2)}${or}<span title="Pay 1 spice to gain 4 Solari">${gain("solari", 4)}</span>`;
    case "assembly_hall":
      return `${gain("intrigue")}<span class="conditional-reward" title="Gain 1 persuasion during your Reveal turn if your Agent is here">${gain("persuasion")}<em>reveal</em></span>`;
    case "swordmaster":
      return `<span title="Gain your Swordmaster: a third Agent for this and future rounds">${gain("agent")}<em>third Agent</em></span>`;
    case "sietch_tabr":
      return `${gain("water")}<span title="Take Maker Hooks if needed and recruit a troop">${gain("hooks")}${gain("troop")}</span>${or}<span title="You may destroy the Shield Wall">${iconTag("shield_wall", "Destroy Shield Wall")}</span>`;
    case "high_council": {
      const seats = (gameState.players || []).map(player => `<i class="council-marker${player.agents?.highCouncil ? " seated" : ""}"
        style="--player-color:${PLAYER_COLORS[player.id]}" title="${escapeHtml(`${player.leader.name}: ${player.agents?.highCouncil ? "Council seat" : "no Council seat"}`)}"></i>`).join("");
      return `<span class="board-council-seats" aria-label="High Council seats">${seats}</span>${gain("persuasion", 2)}<span class="council-return" title="Subsequent visits: 2 spice, 1 Intrigue, 3 troops"><em>return</em>${gain("spice", 2)}${gain("intrigue")}${gain("troop", 3)}</span>`;
    }
    default: return null;
  }
}

function spaceRewardIcons(space) {
  const rewards = space.rewards || {};
  const makerBadge = space.makerBonus
    ? `
      <span class="maker-bonus"
            title="${escapeHtml(publicText(
              `Maker space — ${space.makerBonus} bonus spice accumulated; an Agent sent here collects it`))}">
        ${iconTag("spice", publicText("Bonus spice"))}<b>+${space.makerBonus}</b>
      </span>
    `
    : "";
  const parts = [
    iconCount("vp", rewards.vp, publicText("Gain VP")),
    iconCount("card", rewards.cards, "Draw cards"),
    iconCount("intrigue", rewards.intrigue, publicText("Draw Intrigue cards")),
    iconCount("troop", rewards.troops, publicText("Recruit troops")),
    iconCount("spice", rewards.spice, publicText("Gain Spice")),
    iconCount("water", rewards.water, publicText("Gain Water")),
    iconCount("solari", rewards.solari, publicText("Gain Solari")),
    iconCount("influence", rewards.influence, publicText("Gain Influence")),
    iconCount("spy", rewards.spies, publicText("Place spies")),
    iconCount("sandworm", rewards.sandworms, publicText("Summon sandworms")),
    iconCount("trash", rewards.trash, publicText("Trash cards")),
    iconCount("contract", rewards.contracts, publicText("Take contracts")),
  ].filter(Boolean);
  return `
    <span class="space-rewards">
      ${activeSkin === "uprising" ? uprisingSpaceOptions(space) ?? parts.join("") : parts.join("")}
      ${makerBadge}
      ${space.combat ? `<span class="combat-flag" title="Combat space">${iconTag("sword", "Combat")}</span>` : ""}
    </span>
  `;
}

function controlRewardText(space) {
  const rewards = space.rewards || {};
  const parts = [
    rewards.controllerSpice ? `${rewards.controllerSpice} Spice` : "",
    rewards.controllerSolari ? `${rewards.controllerSolari} Solari` : "",
  ].filter(Boolean);
  return parts.join(", ");
}

function renderControlMarker(space) {
  if (space.control === null || space.control === undefined) return "";
  const controllerId = Number(space.control);
  if (!Number.isInteger(controllerId) || controllerId < 0) return "";
  const controller = gameState.players?.[controllerId];
  const controllerName = controller?.leader?.name || `Player ${controllerId + 1}`;
  const rewardText = controlRewardText(space);
  const title = rewardText
    ? `${controllerName} controls ${space.name}; controller gains ${rewardText} when visited.`
    : `${controllerName} controls ${space.name}.`;
  const rewards = space.rewards || {};
  const rewardIcons = [
    iconCount("spice", rewards.controllerSpice, "Controller Spice"),
    iconCount("solari", rewards.controllerSolari, "Controller Solari"),
  ].filter(Boolean).join("");
  return `
    <span class="control" style="--player-color:${PLAYER_COLORS[controllerId % PLAYER_COLORS.length]}"
          title="${escapeHtml(title)}">
      <span class="control-flag" aria-hidden="true">&#9873;</span>
      ${rewardIcons ? `<span class="control-rewards">${rewardIcons}</span>` : ""}
    </span>
  `;
}

function observationPostGeometry() {
  const boardLayout = activeBoardLayout();
  return activeObservationPostLinks()
    .map((link) => {
      const spaces = Array.isArray(link.spaces) ? link.spaces : [];
      if (!spaces.length) return null;
      const centers = spaces
        .map((spaceKey) => boardLayout[spaceKey])
        .filter(Boolean)
        .map(layoutCenter);
      if (centers.length !== spaces.length) return null;
      const post = link.post || centers.reduce((sum, center) => ({
        x: sum.x + center.x / centers.length,
        y: sum.y + center.y / centers.length,
      }), { x: 0, y: 0 });
      return { key: link.key || spaces.join("_"), spaces, centers, post };
    })
    .filter(Boolean);
}

function sharedObservationSpaceKeys() {
  const keys = new Set();
  activeObservationPostLinks().forEach((link) =>
    (link.spaces || []).forEach((spaceKey) => keys.add(spaceKey)));
  return keys;
}

function spyTokenTag(playerId, spaceName) {
  const player = gameState?.players?.[playerId];
  const owner = player?.leader?.name || `Player ${playerId + 1}`;
  return `
    <i class="spy-token" style="--player-color:${PLAYER_COLORS[playerId % PLAYER_COLORS.length]}"
       title="${escapeHtml(`${owner}'s Spy — watching ${spaceName}`)}">
      ${iconTag("spy", "Spy")}
    </i>
  `;
}

function renderObservationPostLinks() {
  if (activeSkin !== "uprising") return "";
  const segments = observationPostGeometry().map(({ key, centers, post }) => `
    <g data-observation-link="${escapeHtml(key)}">
      ${centers.map((center) =>
        `<line x1="${center.x}" y1="${center.y}" x2="${post.x}" y2="${post.y}"></line>`
      ).join("")}
    </g>
  `).join("");
  if (!segments) return "";
  return `
    <svg class="observation-links" aria-hidden="true" viewBox="0 0 100 100"
         preserveAspectRatio="none">
      ${segments}
    </svg>
  `;
}

function renderObservationPosts() {
  if (activeSkin !== "uprising") return "";
  const spacesByKey = new Map(
    (gameState.boardSpaces || []).map((space) => [space.key, space]));
  const spyChoices = spaceChoiceActions().filter(action => /spy/i.test(action.label || ""));
  return observationPostGeometry().map(({ key, spaces, post }) => {
    const members = spaces.map((spaceKey) => spacesByKey.get(spaceKey)).filter(Boolean);
    const names = members.map((space) => space.name);
    const choice = spyChoices.find(action => spaces.includes(action.spaceKey));
    const tokens = members.flatMap((space) =>
      (Array.isArray(space.spiesBy) ? space.spiesBy : [])
        .map((playerId) => spyTokenTag(playerId, names.join(" / "))));
    return `
      <button class="observation-post${tokens.length ? " occupied" : ""}${choice ? " choice-target" : ""}"
           data-observation-post="${escapeHtml(key)}"
           ${choice ? `data-action="${choice.id}"` : "disabled"}
           style="left:${post.x}%;top:${post.y}%"
           aria-label="${escapeHtml(`Observation post: ${names.join(" / ")}${choice ? "; " + choice.label : ""}`)}"
           title="${escapeHtml(`Observation post — Spies here watch ${names.join(" and ")}`)}">
        ${tokens.length ? tokens.join("") : `<i class="post-pin" aria-hidden="true"></i>`}
      </button>
    `;
  }).join("");
}

function renderSpaceTile(space, legalSpaces, selectedCardSpaces, brSpaceHints,
                         sharedSpySpaces, choiceTargets) {
  const layout = spaceLayout(space.key);
  const legal = legalSpaces.has(space.key) ? " legal" : "";
  const unreachable = selectedCardSpaces && !selectedCardSpaces.has(space.key)
    ? " unreachable"
    : "";
  const selected = selectedSpaceKey === space.key ? " selected" : "";
  const occupied = space.occupiedBy.length ? " occupied" : "";
  const brHint = brSpaceHints?.get(space.key);
  const brTarget = brHint && !unreachable ? ` br-target br-rank-${brHint.rank}` : "";
  const choiceTarget = choiceTargets?.has(space.key) ? " choice-target" : "";
  const style = `left:${layout.x}%;top:${layout.y}%;width:${layout.w}%;height:${layout.h}%`;
  const hiddenMarkers = fxAgentMarkerHiddenFlags(space);
  // Spies are drawn on observation posts, including posts watching one space.
  const spiesBy = sharedSpySpaces?.has(space.key)
    ? []
    : (Array.isArray(space.spiesBy) ? space.spiesBy : []);
  return `
    <button class="space-tile${legal}${unreachable}${selected}${occupied}${brTarget}${choiceTarget} ${space.faction || space.icon}"
            style="${style}" data-space="${space.key}" title="${escapeHtml([space.name, uprisingSpaceDescription(space.key)].filter(Boolean).join("\n"))}">
      ${imageTag(space.image, space.name, "space-art")}
      <span class="space-name">${escapeHtml(space.name)}</span>
      ${spaceCostBadge(space)}
      ${spaceRewardIcons(space)}
      <span class="agents">
        ${space.occupiedBy.map((playerId, markerIndex) =>
          `<i style="--player-color:${PLAYER_COLORS[playerId]}" title="Agent"
              data-agent-player="${playerId}"
              class="${hiddenMarkers[markerIndex] ? "fx-hidden-marker" : ""}"></i>`).join("")}
      </span>
      ${spiesBy.length ? `
        <span class="spies">
          ${spiesBy.map((playerId) => spyTokenTag(playerId, space.name)).join("")}
        </span>
      ` : ""}
      ${renderControlMarker(space)}
    </button>
  `;
}

function renderFactionLadder(faction) {
  const layout = activeSkin === "uprising"
    ? { x: 0.8, y: 2 + FACTIONS.indexOf(faction) * 23, w: 6.2, h: 22 }
    : FACTION_LADDERS[faction];
  if (!layout) return "";
  const holder = gameState.alliances?.[faction];
  const holderPlayer = Number.isInteger(holder) && holder >= 0
    ? gameState.players[holder]
    : null;
  const bonus = FACTION_LEVEL4_BONUS[faction];
  const style = `left:${layout.x}%;top:${layout.y}%;width:${layout.w}%;height:${layout.h}%`;
  const levels = [];
  for (let level = 6; level >= 0; level -= 1) {
    const markers = gameState.players
      .slice()
      .sort((left, right) => left.id - right.id)
      .map((player) => player.influence[faction] === level
        ? `<i style="--player-color:${PLAYER_COLORS[player.id]}"
              title="${escapeHtml(`${player.leader.name}: ${level} influence`)}"></i>`
        : `<i class="lane-empty"></i>`)
      .join("");
    levels.push(`
      <div class="ladder-rung level-${level}${level === 4 ? " alliance-line" : ""}${level === 2 ? " vp-line-mark" : ""}">
        ${level === 4 ? imageTag(bonus.icon, bonus.label, "rung-bonus") : ""}
        ${level === 2 ? imageTag(RESOURCE_ICONS.vp, "+1 VP", "rung-bonus") : ""}
        <span class="rung-markers">${markers}</span>
      </div>
    `);
  }
  return `
    <div class="faction-ladder ${faction}" style="${style}"
         title="${escapeHtml(`${FACTION_LABELS[faction]} influence track`)}">
      <div class="ladder-head">
        ${imageTag(FACTION_ICONS[faction], FACTION_LABELS[faction], "ladder-icon")}
        <span class="alliance-token${holderPlayer ? " held" : ""}"
              style="${holderPlayer ? `--player-color:${PLAYER_COLORS[holderPlayer.id]}` : ""}"
              title="${escapeHtml(holderPlayer
                ? `Alliance: ${holderPlayer.leader.name}`
                : "Alliance token — reach 4 influence")}">
          ${iconTag("vp", "Alliance")}
        </span>
      </div>
      <div class="ladder-track">${levels.join("")}</div>
    </div>
  `;
}

function renderConflictPanel() {
  if (!gameState.conflict) return "";
  if (activeSkin === "uprising") return renderUprisingConflictField();
  const conflict = gameState.conflict;
  const fighters = gameState.players
    .slice()
    .sort((left, right) => right.troops.strength - left.troops.strength);
  return `
    <section class="conflict-panel">
      <header class="conflict-header">
        <span class="conflict-title" title="${escapeHtml(conflict.name)}">${escapeHtml(conflict.name)}</span>
        ${renderUprisingConflictShieldBadge(conflict)}
        ${renderUprisingConflictBattleIcon(conflict)}
        <b class="conflict-round">${gameState.round} of 10</b>
      </header>
      <div class="conflict-body">
        <button class="conflict-card zoomable" data-inspect-card="${escapeHtml(conflict.key)}" aria-label="Inspect ${escapeHtml(conflict.name)}">
          ${renderConflictCard(conflict, "conflict-card-art")}
          ${renderZoom(conflict, "conflict")}
        </button>
        <div class="combat-rows">
          ${fighters.map((player) => `
            <div class="combat-row${player.troops.conflict || player.troops.sandworms ? " fighting" : ""}"
                 style="--player-color:${PLAYER_COLORS[player.id]}"
                 data-combat-player="${player.id}">
              ${imageTag(leaderHeadImage(player.leader), player.leader.name, "combat-portrait")}
              <span class="combat-strength" title="${escapeHtml(publicText("Combat swords"))}">
                ${iconTag("sword", publicText("Swords"))}${player.troops.strength}
              </span>
              <span class="combat-player-name">${escapeHtml(player.isHuman ? "You" : player.leader.name)}</span>
              <span class="combat-troops" title="${escapeHtml(publicText("Troops in conflict"))}">
                ${Array.from({ length: Math.min(player.troops.conflict, 8) })
                  .map(() => "<i></i>").join("")}
              </span>
              ${renderUprisingCombatSandworms(player)}
            </div>
          `).join("")}
        </div>
      </div>
    </section>
  `;
}

function titleFromKey(key) {
  return String(key || "")
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function uprisingContractCard(key) {
  const contracts = Array.isArray(UPRISING_WEB_DATA.contracts)
    ? UPRISING_WEB_DATA.contracts
    : [];
  const contract = contracts.find((item) => item.key === key);
  const concord = window.Concord?.item('uprising', 'contract', key);
  if (contract) return concord ? {...contract, name:concord.name, image:concord.image} : contract;
  return {
    key,
    name: concord?.name || titleFromKey(key),
    image: concord?.image || "",
    standardChoam: true,
    ixCompanion: false,
  };
}

function uprisingContractCardsForKeys(keys) {
  if (activeSkin !== "uprising" || !Array.isArray(keys)) return [];
  return keys.filter(Boolean).map((key) => uprisingContractCard(key));
}

function renderUprisingChoamMarket() {
  if (activeSkin !== "uprising" || !gameState.choamModule) return "";
  const faceUpContracts = Array.isArray(gameState.faceUpContracts)
    ? gameState.faceUpContracts.filter(Boolean)
    : [];
  if (!faceUpContracts.length && !Number.isFinite(gameState.contractDeckCount)) {
    return "";
  }
  return `
    <section class="choam-market" aria-label="CHOAM contracts">
      <header>
        <span>CHOAM</span>
        <b>${Number.isFinite(gameState.contractDeckCount) ? gameState.contractDeckCount : 0}</b>
      </header>
      <div class="choam-contracts">
        ${faceUpContracts.map((key) => {
          const contract = uprisingContractCard(key);
          return `
            <button class="choam-contract zoomable" data-inspect-card="${escapeHtml(contract.key)}" aria-label="Inspect ${escapeHtml(contract.name)}" title="${escapeHtml(contract.name)}">
              ${renderCardFace(contract, "choam-contract-art")}
              ${renderZoom(contract)}
            </button>
          `;
        }).join("")}
      </div>
    </section>
  `;
}

function uprisingTrackPosition(value, combat = false) {
  const score = Math.max(0, Math.floor(Number(value) || 0));
  return combat && score > 20 ? (score - 1) % 20 + 1 : Math.min(combat ? 20 : 12, score);
}

function renderUprisingTrack(combat = false) {
  const limit = combat ? 20 : 12;
  const label = combat ? "Combat strength" : "Victory points";
  const kind = combat ? "combat" : "vp";
  const levels = Array.from({ length: limit + 1 }, (_, i) => combat ? i : limit - i);
  return `<section class="board-${kind}-track" aria-label="${label} track">
    ${levels.map(level => `<div class="board-track-space${!combat && level >= 10 ? " finish" : ""}"
        data-${kind}-level="${level}"><span>${level}</span><div class="board-track-markers">
      ${gameState.players.filter(player => uprisingTrackPosition(combat ? player.troops.strength : player.vp, combat) === level)
        .map(player => {
          const value = combat ? player.troops.strength : player.vp;
          const overflow = value > limit ? (combat ? `+${value - level}` : value) : "";
          return `<i style="--player-color:${PLAYER_COLORS[player.id % PLAYER_COLORS.length]}"
            role="img" aria-label="${escapeHtml(`${player.leader.name}: ${value} ${label.toLowerCase()}`)}"
            title="${escapeHtml(`${player.leader.name}: ${value} ${label.toLowerCase()}`)}">${overflow}</i>`;
        }).join("")}</div></div>`).join("")}</section>`;
}

function renderUprisingBoardSurface() {
  if (activeSkin !== "uprising") return "";
  return `<div class="board-terrain" aria-hidden="true">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none">
        <path class="desert-surface" d="M28 41Q48 26 96 29L96 95H28Z"/>
        <path class="desert-ridge" d="M29 65Q51 49 93 51M28 76Q52 57 94 65M29 86Q67 61 95 79"/>
        <path class="shielded-region" d="M56 36 73 29 94 29 94 64 72 66 56 51Z"/>
      </svg>
    </div>
    ${FACTIONS.map((faction, index) => `<div class="board-faction-region ${faction}" style="top:${1 + index * 23}%" aria-hidden="true"><span>${escapeHtml(FACTION_LABELS[faction])}</span></div>`).join("")}
    <div class="board-council-region" aria-hidden="true"></div>
    <div class="board-choam-region" aria-hidden="true"></div>
    <div class="board-heading council">Civic Assembly</div>
    <div class="board-heading commerce">CHOAM</div>
    <div class="arrakis-label" aria-hidden="true">ARRAKIS</div>
    <div class="shield-wall-token ${gameState.shieldWallStanding ? "standing" : "fallen"}"
         role="img" aria-label="Shield Wall ${gameState.shieldWallStanding ? "standing" : "destroyed"}">
      <span>Shield Wall</span><b>${gameState.shieldWallStanding ? "Standing" : "Destroyed"}</b>
    </div>
    ${renderUprisingTrack()}${renderUprisingTrack(true)}`;
}

function renderUprisingConflictField() {
  const conflict = gameState.conflict;
  // The four garrisons surround the matching quadrants of the Conflict.
  const seats = ["south-east", "north-east", "north-west", "south-west"];
  const troops = player => `<span class="field-troops">${iconTag("troop", "Troops")}<b>${player.troops.conflict}</b>${renderUprisingCombatSandworms(player)}</span>`;
  return `<section class="conflict-panel uprising-conflict-field" aria-label="Conflict and garrisons">
    <button class="conflict-card" data-inspect-card="${escapeHtml(conflict.key)}" aria-label="Inspect ${escapeHtml(conflict.name)}">
      ${renderConflictCard(conflict, "conflict-card-art")}
    </button>
    <div class="conflict-arena">
      <header><strong title="${escapeHtml(conflict.name)}">${escapeHtml(conflict.name)}</strong>
        ${renderUprisingConflictBattleIcon(conflict)}${renderUprisingConflictShieldBadge(conflict)}</header>
      <div class="conflict-quadrants">${gameState.players.map(player => `<div class="conflict-force ${seats[player.id]}"
        data-combat-player="${player.id}" style="--player-color:${PLAYER_COLORS[player.id]}"
        title="${escapeHtml(`${player.leader.name}: ${player.troops.strength} strength`)}">
        <span class="force-owner">${escapeHtml(player.isHuman ? "You" : player.leader.name)}</span>
        ${troops(player)}<span class="force-strength">${iconTag("sword", "Strength")}${player.troops.strength}</span>
      </div>`).join("")}</div>
    </div>
    ${gameState.players.map(player => `<div class="board-garrison ${seats[player.id]}" data-garrison-player="${player.id}"
      style="--player-color:${PLAYER_COLORS[player.id]}" role="img"
      aria-label="${escapeHtml(`${player.leader.name}: ${player.troops.garrison} troops in garrison`)}"
      title="${escapeHtml(`${player.leader.name}: ${player.troops.garrison} troops in garrison`)}">
      <span>Garrison</span><b>${player.troops.garrison}</b><div class="garrison-cubes" aria-hidden="true">${Array.from({length: Math.min(12, player.troops.garrison)}, () => "<i></i>").join("")}</div>
    </div>`).join("")}
  </section>`;
}

function renderBoard() {
  const selectedCard = selectedHandCard();
  const selectedCardSpaces = selectedCard ? legalSpaceKeysForCard(selectedCard.key) : null;
  const legalSpaces = selectedCardSpaces || new Set(gameState.legalSpaceKeys);
  const brSpaceHints = brBoardSpaceHints();
  const sharedSpySpaces = activeSkin === "uprising" ? sharedObservationSpaceKeys() : null;
  const choiceTargets = spaceChoiceTargets();
  return `
    ${activeSkin === "uprising" ? '<div class="board-viewport" tabindex="0" role="region" aria-label="Uprising board; scroll to explore on smaller screens">' : ""}
    <main class="board-layer">
      <div class="planet"></div>
      ${renderUprisingBoardSurface()}
      ${renderObservationPostLinks()}
      ${FACTIONS.map((faction) => renderFactionLadder(faction)).join("")}
      ${gameState.boardSpaces.map((space) =>
        renderSpaceTile(space, legalSpaces, selectedCardSpaces, brSpaceHints,
                        sharedSpySpaces, choiceTargets)).join("")}
      ${renderObservationPosts()}
      ${renderBrSpaceBadges(brSpaceHints)}
      <div class="intrigue-drop-zone" data-intrigue-drop>
        ${iconTag("intrigue", publicText("Intrigue"))}
        <span>${escapeHtml(publicText("Play Intrigue"))}</span>
      </div>
      ${renderConflictPanel()}
    </main>
    ${activeSkin === "uprising" ? "</div>" : ""}
  `;
}

function renderCard(card, className = "", withZoom = false) {
  if (!card) return `<div class="small-card empty-card"></div>`;
  return `
    <div class="${withZoom ? "zoomable" : ""}" data-card="${escapeHtml(card.key)}">
      ${renderCardFace(card, className)}
      ${withZoom ? renderZoom(card) : ""}
    </div>
  `;
}

function adjustedAcquireCost(card, acquireActions) {
  const actionCosts = (acquireActions || [])
    .map((action) => action.acquireCost)
    .filter((cost) => Number.isFinite(cost));
  if (actionCosts.length) return Math.min(...actionCosts);
  return card.acquireCost || 0;
}

function renderAcquireCard(
    card,
    acquireActions,
    brRecommendation = null,
    className = "",
    source = "") {
  const legal = Boolean(acquireActions?.length);
  const probability = brRecommendation
    ? formatProbability(brRecommendation.probability)
    : "";
  const cost = adjustedAcquireCost(card, acquireActions);
  const baseTitle = legal
    ? publicText(`Acquire ${card.name} for ${cost} persuasion`)
    : publicText(`${card.name} costs ${cost} persuasion`);
  const title = probability
    ? `${baseTitle}; BR ${probability}`
    : baseTitle;
  return `
    <div class="acquire-option">
    <button class="acquire-card zoomable ${legal ? "affordable" : "unaffordable"} ${className}"
            type="button"
            data-acquire-card="${escapeHtml(card.key)}"
            data-acquire-source="${escapeHtml(source)}"
            ${legal ? "" : "disabled"}
            title="${escapeHtml(title)}"
            aria-label="${escapeHtml(title)}">
      ${renderCardFace(card, "acquire-card-image")}
      <b class="acquire-cost-badge">${escapeHtml(cost)}</b>
      ${probability ? `<b class="acquire-recommendation-badge">${escapeHtml(probability)}</b>` : ""}
      ${renderZoom(card)}
    </button>
    <button class="acquire-inspect" type="button" data-inspect-card="${escapeHtml(card.key)}"
            aria-label="Inspect ${escapeHtml(card.name)}">Card details</button>
    </div>
  `;
}

function renderAcquireOverlay() {
  if (!isAcquirePhase()) return "";
  const human = currentHuman();
  const brRecommendationsByCardKey = currentBrAcquireRecommendationsByCardKey();
  const played = human.cards.played || [];
  const helenaReserved = human.cards.helenaReserved;
  return `
    <section class="acquire-overlay" aria-label="Acquire cards">
      <header class="acquire-heading"><div><span class="eyebrow">Build your deck</span><h2>Acquire cards</h2></div>
        <p>${iconTag("persuasion", "Persuasion")} <b>${currentPersuasion(human)}</b> to spend</p></header>
      <button class="acquire-close-button" type="button" data-acquire-close
              title="Close to see the board (Esc)"
              aria-label="Close acquire cards">&times;</button>
      <div class="acquire-table">
        <div class="acquire-main">
          <div class="acquire-row ${helenaReserved ? "with-helena" : ""}">
            ${helenaReserved ? `
              <div class="helena-acquire-slot">
                <span class="zone-label">Helena</span>
                ${renderAcquireCard(
                  helenaReserved,
                  acquireActionsForCard(helenaReserved.key, "helena"),
                  brRecommendationsByCardKey.get(helenaReserved.key),
                  "helena-acquire-card",
                  "helena")}
              </div>
              <div class="helena-acquire-divider" aria-hidden="true"></div>
            ` : ""}
            ${gameState.imperiumRow.map((card) =>
              renderAcquireCard(
                card,
                acquireActionsForCard(card.key, "row"),
                brRecommendationsByCardKey.get(card.key),
                "",
                "row")).join("")}
          </div>
          ${played.length ? `
            <div class="acquire-played">
              <span class="zone-label">In Play</span>
              <div class="acquire-played-row">
                ${played.map((card) => renderCard(card, "played-card", true)).join("")}
              </div>
            </div>
          ` : ""}
        </div>
        <div class="acquire-side">
          <span class="zone-label">Reserve</span>
          ${gameState.reserves.map((reserve) => `
            <div class="acquire-reserve-card">
              ${renderAcquireCard(
                reserve.card,
                acquireActionsForCard(reserve.card.key, "reserve"),
                brRecommendationsByCardKey.get(reserve.card.key),
                "reserve-acquire-card",
                "reserve")}
            </div>
          `).join("")}
        </div>
        <div class="persuasion-drop-target" data-acquire-drop
             title="${escapeHtml(publicText("Drag a card here to acquire it"))}">
          <span>+</span>
          <b>${currentPersuasion(human)}</b>
        </div>
      </div>
    </section>
  `;
}

function renderPoisonSnooperOverlay() {
  if (!poisonSnooperPending()) return "";
  const snooper = poisonSnooperState();
  const card = snooper.topDeck;
  const drawHint = currentBrRecommendationForActionId(snooper.drawActionId);
  const trashHint = currentBrRecommendationForActionId(snooper.trashActionId);
  const hintLabel = (hint) => hint
    ? `<b class="recommendation-badge">${brHintLabel()} #${hint.rank} ${escapeHtml(formatProbability(hint.probability))}</b>`
    : "";
  return `
    <section class="poison-snooper-overlay" aria-label="${escapeHtml(publicText("Poison Snooper"))}">
      <div class="poison-snooper-panel">
        <div class="poison-snooper-header">
          <span>${escapeHtml(publicText("Poison Snooper"))}</span>
          <b>Top card of your deck</b>
        </div>
        <div class="poison-snooper-card">
          ${renderCard(card, "poison-snooper-art-card", true)}
        </div>
        <div class="poison-snooper-buttons">
          <button class="poison-snooper-button${drawHint ? " recommended" : ""}"
                  data-action="${snooper.drawActionId}"
                  title="${escapeHtml(`Draw ${card.name} into your hand`)}">
            Draw ${hintLabel(drawHint)}
          </button>
          <button class="poison-snooper-button${trashHint ? " recommended" : ""}"
                  data-action="${snooper.trashActionId}"
                  title="${escapeHtml(`Trash ${card.name}`)}">
            Trash ${hintLabel(trashHint)}
          </button>
        </div>
      </div>
    </section>
  `;
}

function actionDataAttributes(action) {
  const cardKey = action.cardKey || action.intrigueKey || "";
  return [
    `data-action="${action.id}"`,
    cardKey ? `data-card-key="${escapeHtml(cardKey)}"` : "",
    action.spaceKey ? `data-space-key="${escapeHtml(action.spaceKey)}"` : "",
  ].filter(Boolean).join(" ");
}

function renderActionButton(action) {
  const brRecommendation = currentBrRecommendationForAction(action);
  const recommended = Boolean(brRecommendation);
  const probability = brRecommendation
    ? formatProbability(brRecommendation.probability)
    : "";
  const badge = recommended
    ? `${gameState?.recommendation?.searched ? "Search" : "BR"} #${brRecommendation.rank}${probability ? ` ${escapeHtml(probability)}` : ""}`
    : "";
  const title = recommendationTitle(action);
  return `
    <button class="action-button ${action.kind}${recommended ? " recommended" : ""}"
            ${actionDataAttributes(action)}
            ${title ? `title="${escapeHtml(title)}"` : ""}
            ${busy ? "disabled" : ""}>
      <span class="action-label">${escapeHtml(publicText(action.label))}</span>
      ${recommended ? `<b class="recommendation-badge">${badge}</b>` : ""}
      <small>${escapeHtml(publicText(action.detail))}</small>
    </button>
  `;
}

function renderChoiceGroupButton(group) {
  const recommendation = choiceGroupRecommendation(group);
  const recommended = Boolean(recommendation);
  const probability = recommendation ? formatProbability(recommendation.probability) : "";
  const selected = selectedChoiceGroupKey === group.key ? " selected" : "";
  const badge = recommended
    ? `${gameState?.recommendation?.searched ? "Search" : "BR"} #${recommendation.rank}${probability ? ` ${escapeHtml(probability)}` : ""}`
    : "";
  const dimensions = dimensionsForOptions(group.actionOptions || [], GENERIC_CHOICE_DIMENSIONS);
  const detailParts = [
    `${(group.actionOptions || []).length} legal option${(group.actionOptions || []).length === 1 ? "" : "s"}`,
    ...dimensions.map((dimension) => publicText(dimension.label)),
  ];
  return `
    <button class="choice-group-button${selected}${recommended ? " recommended" : ""}"
            data-choice-group="${escapeHtml(group.key)}"
            ${busy ? "disabled" : ""}>
      <span class="action-label">${escapeHtml(publicText(group.title || "Choose action"))}</span>
      ${recommended ? `<b class="recommendation-badge">${badge}</b>` : ""}
      <small>${escapeHtml(detailParts.join("; "))}</small>
    </button>
  `;
}

function renderChoiceDimension(groupKey, dimension, selectedValue, dataPrefix, recommendedValue = undefined) {
  const hasRecommendation = recommendedValue !== undefined && recommendedValue !== null;
  if (dimension.field === "troops") {
    return `
      <div class="choice-field">
        <span>${escapeHtml(publicText(dimension.label))}</span>
        <div class="troop-deploy-options compact">
          ${dimension.values.map((item) => {
            const selected = sameChoiceValue(item.value, selectedValue);
            const recommended = hasRecommendation && sameChoiceValue(item.value, recommendedValue);
            return `
              <button class="troop-deploy-option${selected ? " selected" : ""}${recommended ? " recommended" : ""}"
                      data-${dataPrefix}-choice="${escapeHtml(dimension.field)}:${escapeHtml(item.value)}"
                      aria-pressed="${selected ? "true" : "false"}"
                      ${busy ? "disabled" : ""}>
                <b>${escapeHtml(item.value)}</b>
                ${troopPips(Number(item.value))}
                ${recommended ? renderBrPickLabel() : ""}
              </button>
            `;
          }).join("")}
        </div>
      </div>
    `;
  }
  if (dimension.numeric) {
    const selectedIndex = Math.max(0, dimension.values.findIndex((item) =>
      sameChoiceValue(item.value, selectedValue)));
    const canDecrease = selectedIndex > 0;
    const canIncrease = selectedIndex < dimension.values.length - 1;
    const current = dimension.values[selectedIndex]?.value ?? selectedValue;
    const recommended = hasRecommendation && sameChoiceValue(current, recommendedValue);
    return `
      <div class="choice-field numeric-choice">
        <span>${escapeHtml(publicText(dimension.label))}</span>
        <div class="troop-stepper${hasRecommendation ? " has-recommendation" : ""}">
          <button data-${dataPrefix}-step="${escapeHtml(dimension.field)}:-1" ${canDecrease ? "" : "disabled"} aria-label="${escapeHtml(publicText(`Decrease ${dimension.label}`))}">-</button>
          <output class="${recommended ? "recommended" : ""}">${escapeHtml(current)}</output>
          <button data-${dataPrefix}-step="${escapeHtml(dimension.field)}:1" ${canIncrease ? "" : "disabled"} aria-label="${escapeHtml(publicText(`Increase ${dimension.label}`))}">+</button>
          ${hasRecommendation ? `<span class="recommended-count">${recommendationSourceLabel()}: ${escapeHtml(recommendedValue)}</span>` : ""}
        </div>
      </div>
    `;
  }
  return `
    <div class="choice-field">
      <span>${escapeHtml(publicText(dimension.label))}</span>
      <div class="choice-picker">
        ${dimension.values.map((item) => {
          const selected = sameChoiceValue(item.value, selectedValue);
          const recommended = hasRecommendation && sameChoiceValue(item.value, recommendedValue);
          return `
          <button class="${escapeHtml(item.className || "")}${selected ? " selected" : ""}${recommended ? " recommended" : ""}"
                  data-${dataPrefix}-choice="${escapeHtml(dimension.field)}:${escapeHtml(item.value)}"
                  ${busy ? "disabled" : ""}>
            ${escapeHtml(publicText(item.label))}
            ${recommended ? renderBrPickLabel() : ""}
          </button>
        `;
        }).join("")}
      </div>
    </div>
  `;
}

function recommendationSourceLabel() {
  return gameState?.recommendation?.searched ? "Search" : "BR";
}

function troopPips(count) {
  if (!count) return `<span class="troop-pips none">hold</span>`;
  const shown = Math.min(count, 4);
  const icons = Array.from({ length: shown })
    .map(() => iconTag("troop", publicText("Troop")))
    .join("");
  return `<span class="troop-pips">${icons}${count > shown ? `<em>+${count - shown}</em>` : ""}</span>`;
}

function renderTroopDeployPicker(group) {
  const options = sortedTroopOptions(group);
  if (options.length < 2) return "";
  const troops = defaultTroopsForGroup(group);
  const recommendedTroops = recommendedActionOptionForAgentGroup(group)?.troops;
  const hasRecommendation = recommendedTroops !== undefined && recommendedTroops !== null;
  const combatSpace = Boolean(gameState?.boardSpaces
    ?.find((space) => space.key === group.spaceKey)?.combat);
  const garrison = currentHuman()?.troops?.garrison;
  return `
    <div class="troop-deploy${combatSpace ? " combat" : ""}" role="group"
         aria-label="${escapeHtml(publicText(combatSpace ? "Troops to send into the conflict" : "Troops"))}">
      <div class="troop-deploy-header">
        ${iconTag(combatSpace ? "sword" : "troop", publicText(combatSpace ? "Combat" : "Troop"))}
        <span>${escapeHtml(publicText(combatSpace ? "Send to conflict" : "Troops"))}</span>
        ${combatSpace && Number.isFinite(garrison)
          ? `<small>${garrison} in garrison</small>`
          : ""}
      </div>
      <div class="troop-deploy-options">
        ${options.map((option) => {
          const selected = option.troops === troops;
          const recommended = hasRecommendation && option.troops === recommendedTroops;
          const title = option.troops === 0
            ? publicText("Hold troops back")
            : publicText(`Send ${option.troops} troop${option.troops === 1 ? "" : "s"}${combatSpace ? " into the conflict" : ""}`);
          return `
            <button class="troop-deploy-option${selected ? " selected" : ""}${recommended ? " recommended" : ""}"
                    data-troop-set="${option.troops}"
                    aria-pressed="${selected ? "true" : "false"}"
                    title="${title}"
                    ${busy ? "disabled" : ""}>
              <b>${option.troops}</b>
              ${troopPips(option.troops)}
              ${recommended ? renderBrPickLabel() : ""}
            </button>
          `;
        }).join("")}
      </div>
    </div>
  `;
}

function renderAgentGroupButton(group) {
  const recommendation = groupRecommendation(group);
  const recommended = Boolean(recommendation);
  const probability = recommendation ? formatProbability(recommendation.probability) : "";
  const options = sortedTroopOptions(group);
  const minTroops = options[0]?.troops ?? 0;
  const maxTroops = options[options.length - 1]?.troops ?? 0;
  const troopText = minTroops === maxTroops
    ? publicText(`${minTroops} troops`)
    : publicText(`${minTroops}-${maxTroops} troops`);
  const trashCount = sortedTrashOptions(group).length;
  const signetCount = sortedSignetOptions(group).length;
  const sellSpiceValues = sortedActionOptions(group)
    .map((option) => option.sellSpice)
    .filter((value, index, values) => Number.isFinite(value) && values.indexOf(value) === index)
    .sort((left, right) => left - right);
  const sellSpiceText = sellSpiceValues.length
    ? publicText(`sell ${sellSpiceValues[0]}${sellSpiceValues.length > 1 ? `-${sellSpiceValues[sellSpiceValues.length - 1]}` : ""} spice`)
    : "";
  const selected = selectedActionGroupKey === group.key ? " selected" : "";
  const badge = recommended
    ? `${gameState?.recommendation?.searched ? "Search" : "BR"} #${recommendation.rank}${probability ? ` ${escapeHtml(probability)}` : ""}`
    : "";
  const detailParts = [
    sellSpiceText || (group.cost ? `cost ${group.cost}` : ""),
    troopText,
    trashCount ? `${trashCount} trash choices` : "",
    signetCount > 1 ? `${signetCount} signet choices` : "",
    dimensionsForOptions(sortedActionOptions(group), AGENT_CHOICE_DIMENSIONS).length
      ? "effect choices"
      : "",
    publicText(group.extras || ""),
  ].filter(Boolean);
  return `
    <button class="agent-group-button${selected}${recommended ? " recommended" : ""}"
            data-agent-group="${escapeHtml(group.key)}"
            ${busy ? "disabled" : ""}>
      <span class="action-label">${escapeHtml(publicText(`${group.cardName} -> ${group.spaceName}`))}</span>
      ${recommended ? `<b class="recommendation-badge">${badge}</b>` : ""}
      <small>${escapeHtml(detailParts.join("; "))}</small>
    </button>
  `;
}

function renderAgentComposer(group) {
  if (!group) return "";
  const options = sortedTroopOptions(group);
  if (!options.length) return "";
  const troops = defaultTroopsForGroup(group);
  const trashCardKey = defaultTrashForGroup(group);
  const signetKey = defaultSignetForGroup(group);
  const trashOptions = sortedTrashOptions(group);
  const signetOptions = sortedSignetOptions(group);
  const agentChoices = defaultAgentChoicesForGroup(group);
  const agentDimensions = dimensionsForOptions(sortedActionOptions(group), AGENT_CHOICE_DIMENSIONS);
  const recommendation = groupRecommendation(group);
  const recommendedOption = recommendedActionOptionForAgentGroup(group);
  const recommendedTrashCardKey = recommendedOption ? (recommendedOption.trashCardKey || "") : null;
  const recommendedSignetKey = recommendedOption ? actionSignetKey(recommendedOption) : null;
  const actionId = actionIdForGroupSelection(group, troops, trashCardKey, signetKey, agentChoices);
  const confirmRecommended = recommendation && actionId === recommendation.actionId;
  return `
    <section class="agent-composer" aria-label="Agent placement options">
      <div class="agent-composer-header">
        <span>${escapeHtml(publicText(group.cardName))}</span>
        <b>${escapeHtml(publicText(group.spaceName))}</b>
      </div>
      <div class="agent-composer-meta">
        ${group.spaceKey === "sell_melange"
          ? `<span>${escapeHtml(publicText("Choose spice to sell"))}</span>`
          : (group.cost ? `<span>Cost ${escapeHtml(group.cost)}</span>` : "")}
        ${group.extras ? `<span>${escapeHtml(publicText(group.extras))}</span>` : ""}
      </div>
      ${uprisingSpaceDescription(group.spaceKey) ? `<details class="space-rules"><summary>Board space effects</summary><p>${escapeHtml(uprisingSpaceDescription(group.spaceKey))}</p></details>` : ""}
      ${renderTroopDeployPicker(group)}
      ${trashOptions.length ? `
        <div class="trash-picker" aria-label="Choose card to trash">
          ${trashOptions.map((option) => {
            const selected = option.cardKey === trashCardKey;
            const recommended = recommendedTrashCardKey !== null && option.cardKey === recommendedTrashCardKey;
            return `
            <button class="${selected ? "selected" : ""}${recommended ? " recommended" : ""}"
                    data-trash-card="${escapeHtml(option.cardKey)}"
                    ${busy ? "disabled" : ""}>
              ${escapeHtml(publicText(option.cardName))}
              ${recommended ? renderBrPickLabel() : ""}
            </button>
          `;
          }).join("")}
        </div>
      ` : ""}
      ${signetOptions.length > 1 ? `
        <div class="signet-picker" aria-label="${escapeHtml(publicText("Choose Signet Ring option"))}">
          ${signetOptions.map((option) => {
            const optionKey = signetOptionKey(option);
            const recommended = recommendedSignetKey !== null && optionKey === recommendedSignetKey;
            return `
              <button class="${option.kind || "none"} ${option.factionKey || ""}${optionKey === signetKey ? " selected" : ""}${recommended ? " recommended" : ""}"
                      data-signet-option="${escapeHtml(optionKey)}"
                      ${busy ? "disabled" : ""}>
                ${escapeHtml(publicText(option.label))}
                ${recommended ? renderBrPickLabel() : ""}
              </button>
            `;
          }).join("")}
        </div>
      ` : ""}
      ${agentDimensions.map((dimension) =>
        renderChoiceDimension(
            group.key,
            dimension,
            agentChoices[dimension.field],
            "agent",
            recommendedOption ? optionValue(recommendedOption, dimension.field) : undefined)).join("")}
      <button class="confirm-agent-button${confirmRecommended ? " recommended" : ""}"
              data-confirm-agent="${actionId}"
              ${Number.isFinite(actionId) ? "" : "disabled"}>
        Send Agent
      </button>
    </section>
  `;
}

function renderChoiceComposer(group) {
  if (!group) return "";
  const options = group.actionOptions || [];
  if (!options.length) return "";
  const choices = defaultChoicesForChoiceGroup(group);
  const dimensions = dimensionsForOptions(options, GENERIC_CHOICE_DIMENSIONS);
  const actionId = dimensions.length
    ? actionIdForChoiceSelection(group, choices)
    : options[0].actionId;
  const confirmLabel = choiceConfirmLabel(group, actionId);
  const recommendation = choiceGroupRecommendation(group);
  const recommendedOption = recommendedActionOptionForChoiceGroup(group);
  const confirmRecommended = recommendation && actionId === recommendation.actionId;
  return `
    <section class="choice-composer" aria-label="Choose action options">
      <div class="leader-setup-header">
        <span>${escapeHtml(group.kind || "choice")}</span>
        <b>${escapeHtml(group.title || "Choose action")}</b>
      </div>
      ${dimensions.length ? dimensions.map((dimension) =>
        renderChoiceDimension(
            group.key,
            dimension,
            choices[dimension.field],
            "choice",
            recommendedOption ? optionValue(recommendedOption, dimension.field) : undefined)).join("") : `
        <div class="choice-field">
          <span>Action</span>
          <div class="choice-picker">
            <button class="selected${confirmRecommended ? " recommended" : ""}" disabled>
              ${escapeHtml(publicText(options[0].detail || options[0].label || "Resolve"))}
              ${confirmRecommended ? renderBrPickLabel() : ""}
            </button>
          </div>
        </div>
      `}
      <button class="confirm-choice-button${confirmRecommended ? " recommended" : ""}"
              data-confirm-choice="${actionId}"
              ${Number.isFinite(actionId) ? "" : "disabled"}>
        ${escapeHtml(publicText(confirmLabel))}
      </button>
    </section>
  `;
}

function renderLeaderSetupComposer(group) {
  if (!group) return "";
  const selected = defaultLeaderSetupFactions(group);
  const actionId = actionIdForLeaderSetup(group, selected);
  const requiredChoices = group.requiredChoices || 2;
  const recommendation = leaderSetupRecommendation(group);
  const recommendedOption = leaderSetupRecommendationOption(group);
  const recommendedFactionKeys = recommendedOption?.factionKeys || [];
  const probability = recommendation ? formatProbability(recommendation.probability) : "";
  const badge = recommendation
    ? `${gameState?.recommendation?.searched ? "Search" : "BR"} #${recommendation.rank}${probability ? ` ${escapeHtml(probability)}` : ""}`
    : "";
  return `
    <section class="leader-setup-composer${recommendation ? " recommended" : ""}" aria-label="Choose leader factions">
      <div class="leader-setup-header">
        <span>Leader setup</span>
        ${recommendation ? `<b class="recommendation-badge">${badge}</b>` : ""}
        <b>${selected.length}/${requiredChoices} factions</b>
      </div>
      <div class="faction-picker">
        ${(group.factionOptions || []).map((option) => {
          const active = selected.includes(option.factionKey);
          const recommended = recommendedFactionKeys.includes(option.factionKey);
          return `
            <button class="${option.factionKey}${active ? " selected" : ""}${recommended ? " recommended" : ""}"
                    data-leader-faction="${escapeHtml(option.factionKey)}"
                    aria-pressed="${active ? "true" : "false"}"
                    ${busy ? "disabled" : ""}>
              ${escapeHtml(option.factionName)}
              ${recommended ? renderBrPickLabel() : ""}
            </button>
          `;
        }).join("")}
      </div>
      <button class="confirm-leader-setup-button${recommendation && actionId === recommendation.actionId ? " recommended" : ""}"
              data-confirm-leader-setup="${actionId}"
              ${Number.isFinite(actionId) ? "" : "disabled"}>
        Confirm Factions
      </button>
    </section>
  `;
}

function renderImperiumRail() {
  const human = currentHuman();
  return `
    <aside class="imperium-rail" aria-label="${escapeHtml(publicText("Imperium Row"))}">
      <div class="market-heading"><span class="eyebrow">Build your deck</span><strong>${escapeHtml(publicText("Imperium Row"))}</strong></div>
      <div class="rail-tab" title="${escapeHtml(publicText(`Imperium deck: ${gameState.imperiumDeckCount} cards`))}">
        ${iconTag("deck", publicText("Imperium deck"))}
        <b>${gameState.imperiumDeckCount}</b>
      </div>
      <div class="rail-cards">
        ${gameState.imperiumRow.map((card) => `
          <button class="rail-card zoomable" data-inspect-card="${escapeHtml(card.key)}" aria-label="Inspect ${escapeHtml(card.name)}" title="${escapeHtml(card.name)}">
            ${renderCardFace(card, "rail-card-art")}
            ${renderZoom(card)}
          </button>
        `).join("")}
      </div>
      <div class="rail-reserves">
        ${gameState.reserves.map((reserve) => `
          <button class="rail-reserve zoomable" data-inspect-card="${escapeHtml(reserve.card.key)}" aria-label="Inspect ${escapeHtml(reserve.card.name)}; ${reserve.count} remaining" title="${escapeHtml(reserve.card.name)}">
            ${renderCardFace(reserve.card, "rail-reserve-art")}
            ${renderZoom(reserve.card)}
            <span>${reserve.count}</span>
          </button>
        `).join("")}
      </div>
      ${renderUprisingChoamMarket()}
    </aside>
  `;
}

function titleCaseWords(text) {
  return String(text || "")
    .split(" ")
    .map((word) => (word ? word.charAt(0).toUpperCase() + word.slice(1) : word))
    .join(" ");
}

// Turn raw engine action strings ("Agent(card=dagger, space=gather Support,
// troops=2)") into readable log sentences. Unknown formats pass through.
function formatLogText(text) {
  const raw = String(text || "");
  const agent = /^Agent\(card=([^,)]+), space=([^,)]+)(.*)\)$/i.exec(raw);
  if (agent) {
    const card = titleCaseWords(agent[1].trim());
    const space = titleCaseWords(agent[2].trim());
    const extras = agent[3] || "";
    const notes = [];
    if (/infiltrate/i.test(extras)) notes.push("infiltrated past the enemy Agent with a Spy");
    if (/gather.?intelligence/i.test(extras)) notes.push("recalled a Spy to draw a card");
    const troops = /troops=(\d+)/i.exec(extras);
    if (troops && troops[1] !== "0") {
      notes.push(`deployed ${troops[1]} troop${troops[1] === "1" ? "" : "s"}`);
    }
    return `Sent Agent to ${space} with ${card}${notes.length ? ` — ${notes.join(", ")}` : ""}`;
  }
  const choice = /^Choice\(option=(\d+)\)$/i.exec(raw);
  if (choice) return `Resolved a choice (option ${Number(choice[1]) + 1})`;
  const acquire = /^Acquire\((.*)\)$/i.exec(raw);
  if (acquire) {
    const card = /card=([^,)]+)/.exec(acquire[1]);
    return card
      ? `Acquired ${titleCaseWords(card[1].trim())}`
      : "Acquired a card from the Imperium Row";
  }
  const intrigue = /^Intrigue\(card=([^,)]+)(?:, mode=([^,)]+))?\)$/i.exec(raw);
  if (intrigue) {
    return `Played Intrigue: ${titleCaseWords(intrigue[1].trim())}`;
  }
  if (/^Reveal$/i.test(raw)) return "Revealed hand";
  if (/^Pass$/i.test(raw)) return "Passed";
  if (/^Pass Acquire$/i.test(raw)) return "Finished acquiring";
  return raw;
}

function renderLogDrawer() {
  return `
    <aside class="drawer log-drawer${logDrawerOpen ? " open" : ""}" aria-label="Game log">
      <header class="drawer-header">
        <span>Game Log</span>
        <b>Round ${gameState.round} · ${escapeHtml(gameState.phase.replaceAll("_", " "))}</b>
        <button class="drawer-close" data-toggle-drawer="log" aria-label="Close log">&times;</button>
      </header>
      <div class="log-list">
        ${gameState.log.slice().reverse().map((entry) => `
          <div class="log-entry ${entry.kind}">
            <span style="${Number.isInteger(entry.player) && entry.player >= 0
              ? `color:${PLAYER_COLORS[entry.player % PLAYER_COLORS.length]}`
              : ""}">${entry.player === null ? "—" : `P${entry.player}`}</span>
            <p>${escapeHtml(publicText(formatLogText(entry.text)))}</p>
          </div>
        `).join("")}
      </div>
    </aside>
  `;
}

function renderSettingsDrawer() {
  const opponentSearch = gameState.opponentSearch || {};
  const opponentSearchAvailable = Boolean(opponentSearch.available);
  const opponentSearchTitle = opponentSearchAvailable
    ? `Make all opponents search their moves with ${opponentSearchSimulations} simulations`
    : opponentSearch.reason || "Opponent search unavailable";
  const policyCount = gameState.policyPool.policyIds.length;
  const policyStatus = ["trained", "static_trained"].includes(gameState.policyPool.source)
    ? `${policyCount} trained ${policyCount === 1 ? "policy" : "policies"}`
    : "current-rules bots";
  return `
    <aside class="drawer settings-drawer${settingsDrawerOpen ? " open" : ""}" aria-label="Settings">
      <header class="drawer-header">
        <span>Settings</span>
        <button class="drawer-close" data-toggle-drawer="settings" aria-label="Close settings">&times;</button>
      </header>
      <div class="settings-body">
        ${renderSkinSelector("settings-skin")}
        <a class="concord-catalog-link" href="./concord-catalog.html" target="_blank" rel="noopener">Browse the card catalog ↗</a>
        ${window.DUNE_AGENT_MODEL_DOWNLOAD ? `<a class="concord-catalog-link" href="${escapeHtml(window.DUNE_AGENT_MODEL_DOWNLOAD)}" download>Download trained model</a><a class="concord-catalog-link" href="./MODEL_CARD.md" target="_blank" rel="noopener">About the AI ↗</a>` : ""}
        <label class="toggle-setting" title="Highlight the current trained-policy recommendation">
          <input type="checkbox" id="br-recommendation-toggle" ${showBrRecommendation ? "checked" : ""}>
          <span>BR hint</span>
        </label>
        <label class="toggle-setting" title="${escapeHtml(opponentSearchTitle)}">
          <input type="checkbox" id="opponent-search-toggle"
                 ${opponentSearchEnabled ? "checked" : ""}
                 ${opponentSearchAvailable ? "" : "disabled"}>
          <span>Search bots</span>
          <b>${opponentSearchSimulations}</b>
        </label>
        <button class="toggle-settings-button" id="opponent-search-settings"
                title="Search simulations" aria-label="Search simulations"
                ${opponentSearchAvailable ? "" : "disabled"}>Simulations…</button>
        <label class="fx-speed-setting"
               title="Animation speed — slide to 0 to turn animations off">
          <span>Animations</span>
          <input type="range" id="fx-speed-slider" min="0" max="3" step="0.25"
                 value="${fxSpeed}" aria-label="Animation speed">
          <b id="fx-speed-value">${escapeHtml(fxSpeedLabel(fxSpeed))}</b>
        </label>
        <div class="settings-meta">
          <span>Seed ${gameState.seed ?? "—"}</span>
          <span title="${escapeHtml(gameState.policyPool.loadError || "")}">${escapeHtml(policyStatus)}</span>
        </div>
        <button class="new-game-button" id="new-game-button">New Game</button>
      </div>
    </aside>
  `;
}

function renderMovesDrawer() {
  const leaderSetup = leaderSetupGroup();
  const agentGroups = agentPlacementGroups();
  const choiceActionGroups = choiceGroups();
  const groupedActionIds = groupedChoiceActionIds(choiceActionGroups);
  const visibleAgentGroups = orderGroupsForRecommendation(
      agentGroups.filter((group) => groupVisible(group)),
      groupRecommendation);
  const visibleChoiceGroups = orderGroupsForRecommendation(
      choiceActionGroups.filter((group) =>
        group.kind !== "acquire" && choiceGroupVisible(group)),
      choiceGroupRecommendation);
  const visibleActions = orderActionsForRecommendation(
      gameState.legalActions.filter((action) =>
        action.kind !== "leader_setup" &&
        action.kind !== "agent" &&
        !groupedActionIds.has(action.id) &&
        (!isAcquirePhase() || action.kind !== "acquire") &&
        actionVisible(action)));
  const totalShownMoves = (leaderSetup ? 1 : 0) + visibleAgentGroups.length +
      visibleChoiceGroups.length + visibleActions.length;
  return `
    <aside class="drawer moves-drawer${movesDrawerOpen ? " open" : ""}" aria-label="All legal moves">
      <header class="drawer-header">
        <span>Moves</span>
        <b>${totalShownMoves}/${gameState.legalActions.length}</b>
        <button class="drawer-close" data-toggle-drawer="moves" aria-label="Close moves">&times;</button>
      </header>
      <div class="moves-toolbar">
        <input id="action-search" value="${escapeHtml(actionSearch)}" placeholder="Search moves">
        <div class="filter-chips">
          ${selectedSpaceKey ? `<button class="chip" data-clear="space">${escapeHtml(selectedSpaceKey.replaceAll("_", " "))} ×</button>` : ""}
          ${selectedCardKey ? `<button class="chip" data-clear="card">${escapeHtml(selectedCardKey.replaceAll("_", " "))} ×</button>` : ""}
          ${selectedActionGroupKey ? `<button class="chip" data-clear="group">placement ×</button>` : ""}
          ${selectedChoiceGroupKey ? `<button class="chip" data-clear="choice">choice ×</button>` : ""}
        </div>
      </div>
      <div class="moves-lists">
        ${visibleAgentGroups.length ? `
          <div class="agent-groups-list">
            ${visibleAgentGroups.map((group) => renderAgentGroupButton(group)).join("")}
          </div>
        ` : ""}
        ${visibleChoiceGroups.length ? `
          <div class="choice-groups-list">
            ${visibleChoiceGroups.map((group) => renderChoiceGroupButton(group)).join("")}
          </div>
        ` : ""}
        <div class="actions-list">
          ${visibleActions.length ? visibleActions.map((action) => renderActionButton(action)).join("") :
            totalShownMoves === 0 ? `
            <div class="no-actions">${gameState.terminal ? "Terminal state" : "No legal moves match"}</div>
          ` : ""}
        </div>
      </div>
    </aside>
  `;
}

function actionVisible(action) {
  const isReveal = action.kind === "reveal";
  if (selectedSpaceKey && !isReveal && action.spaceKey !== selectedSpaceKey) return false;
  if (selectedCardKey && !isReveal) {
    const actionCardKey = action.cardKey || action.intrigueKey;
    if (actionCardKey !== selectedCardKey) return false;
  }
  if (actionSearch) {
    const haystack = `${action.label} ${action.detail} ${action.actionString}`.toLowerCase();
    if (!haystack.includes(actionSearch.toLowerCase())) return false;
  }
  return true;
}

function choiceGroupVisible(group) {
  if (selectedCardKey) {
    const hasCard = (group.actionOptions || []).some((option) =>
      option.cardKey === selectedCardKey ||
      option.intrigueKey === selectedCardKey ||
      option.choiceCardKey === selectedCardKey ||
      option.discardCardKey === selectedCardKey ||
      option.recoverCardKey === selectedCardKey);
    if (!hasCard) return false;
  }
  if (selectedSpaceKey) {
    const hasSpace = (group.actionOptions || []).some((option) =>
      option.spaceKey === selectedSpaceKey ||
      option.voiceSpaceKey === selectedSpaceKey ||
      option.recallSpaceKey === selectedSpaceKey);
    if (!hasSpace) return false;
  }
  if (actionSearch) {
    const haystack = [
      group.title,
      group.kind,
      ...(group.actionOptions || []).flatMap((option) => [
        option.label,
        option.detail,
        option.actionString,
      ]),
    ].join(" ").toLowerCase();
    if (!haystack.includes(actionSearch.toLowerCase())) return false;
  }
  return true;
}

function groupedChoiceActionIds(groups) {
  return new Set(groups.flatMap((group) =>
    (group.actionOptions || []).map((option) => option.actionId)));
}

function handCardAdvancePx() {
  const viewportWidth = window.innerWidth || 0;
  const cardWidth = Math.min(Math.max(96, viewportWidth * 0.086), 132);
  return cardWidth - 20;
}

function renderGameResult() {
  const winners = new Set(gameState.winners || []);
  const players = [...gameState.players].sort((a, b) =>
    Number(winners.has(b.id)) - Number(winners.has(a.id)) || b.vp - a.vp);
  return `<section class="table-cards game-result" aria-label="Final scores">
    <header><div><span class="eyebrow">The final reckoning</span><h2>${winners.has(gameState.humanPlayer) ? "Victory is yours" : "Game complete"}</h2></div>
      <button class="confirm-button" data-new-game>Play again</button></header>
    <div class="result-scores">${players.map(player => `<div class="result-score${winners.has(player.id) ? " winner" : ""}">
      <strong>${player.vp}<small>VP</small></strong><span>${escapeHtml(player.leader.name)}
      <small>${winners.has(player.id) ? "Winner" : player.isHuman ? "You" : "AI opponent"}</small></span></div>`).join("")}</div>
  </section>`;
}

function renderHandFan() {
  if (activeSkin === "uprising" && gameState.terminal) return renderGameResult();
  const human = currentHuman();
  const intrigueCards = human.cards.intrigue || [];
  const selectedIntrigue = intrigueCards.find(card => card.key === selectedCardKey);
  const inspectedCard = selectedHandCard() || selectedIntrigue;
  // During the Reveal turn the hand is in play and shown inside the acquire
  // overlay, so keep only the Intrigue cluster: plot cards stay visible and
  // draggable above the overlay (table-cards stacks higher).
  const acquiring = isAcquirePhase();
  if (acquiring && !intrigueCards.length) return "";
  // While the Poison Snooper overlay is up it already shows the top card.
  const topDeck = acquiring || poisonSnooperPending() ? null : human.cards.topDeck;
  const hand = acquiring ? [] : (human.cards.hand || []);
  const handHints = brHandCardHints();
  const handRightOffset = Math.ceil((hand.length * handCardAdvancePx()) / 2 + 18);
  return `
    <div class="table-cards" style="--hand-right-offset:${handRightOffset}px">
      <div class="hand-toolbar"><span><b>Your hand</b> · ${hand.length} card${hand.length === 1 ? "" : "s"}</span>
        <span class="hand-card-controls">${selectedIntrigue && intrigueCardPlayable(selectedIntrigue.key)
          ? `<button data-play-intrigue="${escapeHtml(selectedIntrigue.key)}">Play Intrigue</button>` : ""}
        ${inspectedCard ? `<button data-inspect-card="${escapeHtml(inspectedCard.key)}" aria-label="Inspect ${escapeHtml(inspectedCard.name)}">Card details</button>` : '<small>Select a card, then a glowing space</small>'}</span></div>
      ${intrigueCards.length ? `
        <div class="intrigue-cluster">
          <span class="zone-label">${escapeHtml(publicText("Intrigue"))}</span>
          <div class="intrigue-row">
            ${intrigueCards.map((card) => {
              const playable = intrigueCardPlayable(card.key);
              const recommendation = intrigueRecommendationForCard(card.key);
              const baseTitle = playable
                ? publicText(`${card.name} — drag onto the board to play it`)
                : card.name;
              const title = recommendation
                ? `${baseTitle} — ${brHintLabel()} #${recommendation.rank} recommends playing this now`
                : baseTitle;
              return `
              <button class="intrigue-card zoomable${playable ? " playable" : ""}${recommendation ? ` recommended br-rank-${recommendation.rank}` : ""}${selectedCardKey === card.key ? " selected" : ""}"
                      data-card-filter="${card.key}"
                      ${playable ? `data-intrigue-card="${escapeHtml(card.key)}"` : ""}
                      title="${escapeHtml(title)}">
                ${renderCard(card, "intrigue-art-card")}
                ${recommendation ? renderBrHintBadge(recommendation, "Play now") : ""}
                ${renderZoom(card)}
              </button>
            `;
            }).join("")}
          </div>
        </div>
      ` : ""}
      ${topDeck ? `
        <div class="peek-cluster">
          <span class="zone-label">Top of Deck</span>
          <button class="peek-card zoomable ${selectedCardKey === topDeck.key ? "selected" : ""}"
                  data-card-filter="${topDeck.key}" title="${escapeHtml(topDeck.name)}">
            ${renderCard(topDeck, "peek-art-card")}
            ${renderZoom(topDeck)}
          </button>
        </div>
      ` : ""}
      <div class="hand-fan" style="--hand-count:${hand.length}">
        ${hand.map((card, index) => {
          const hint = handHints.get(card.key);
          const probability = hint ? formatProbability(hint.probability) : "";
          const title = hint
            ? `${card.name} — ${brHintLabel()} #${hint.rank}` +
              `${hint.spaceName ? `: play on ${hint.spaceName}` : ""}` +
              `${probability ? ` (${probability})` : ""}`
            : card.name;
          return `
          <button class="hand-card zoomable ${selectedCardKey === card.key ? "selected" : ""}${hint ? ` recommended br-rank-${hint.rank}` : ""}"
                  data-card-filter="${card.key}" data-hand-card="${escapeHtml(card.key)}"
                  style="--card-index:${index}" title="${escapeHtml(title)}">
            ${renderCard(card, "hand-art-card")}
            ${hint ? renderBrHintBadge(hint, hint.spaceName ? `➜ ${hint.spaceName}` : "") : ""}
            ${renderZoom(card)}
          </button>
        `;
        }).join("")}
      </div>
    </div>
  `;
}

function renderSpaceChoicePanel() {
  const actions = spaceChoiceActions();
  const spatial = actions.filter((action) => action.spaceKey);
  if (!spatial.length) return "";
  const others = actions.filter((action) => !action.spaceKey);
  const isSpy = /\bspy\b/i.test(spatial[0].label || "");
  const detail = publicText(spatial[0].detail || "");
  const recommendation = bestRecommendationForActions(spatial);
  return `
    <div class="space-choice-panel${isSpy ? " spy" : ""}">
      <header>
        ${isSpy ? iconTag("spy", "Spy", "space-choice-icon") : ""}
        <b>${escapeHtml(spaceChoicePrompt(actions))}</b>
      </header>
      ${detail ? `<p class="space-choice-detail">${escapeHtml(detail)}</p>` : ""}
      <p class="space-choice-hint">${escapeHtml(
        isSpy
          ? "Tap a highlighted observation post on the board, or pick a space below."
          : "Tap a highlighted space on the board, or pick one below.")}</p>
      <div class="space-choice-chips">
        ${spatial.map((action) => {
          const hint = currentBrRecommendationForAction(action);
          const best = recommendation && hint && hint.rank === recommendation.rank;
          return `
            <button class="space-choice-chip${best ? " recommended" : ""}"
                    data-action="${action.id}" ${busy ? "disabled" : ""}
                    title="${escapeHtml(publicText(action.label || ""))}">
              ${escapeHtml(action.spaceName || action.optionName || publicText(action.label))}
            </button>
          `;
        }).join("")}
      </div>
      ${others.length ? `
        <div class="space-choice-others">
          ${others.map((action) => `
            <button class="space-choice-skip" data-action="${action.id}" ${busy ? "disabled" : ""}
                    title="${escapeHtml(publicText(action.detail || ""))}">
              ${escapeHtml(publicText(action.label || "Skip"))}
            </button>
          `).join("")}
        </div>
      ` : ""}
    </div>
  `;
}

function renderPromptDock() {
  if (gameState.terminal) return "";
  if (poisonSnooperPending()) return "";
  const leaderSetup = leaderSetupGroup();
  const selectedAgentGroup = agentGroupForKey(selectedActionGroupKey);
  const selectedChoiceGroup = choiceGroupForKey(selectedChoiceGroupKey);
  const composer =
    renderLeaderSetupComposer(leaderSetup) +
    renderAgentComposer(selectedAgentGroup) +
    renderChoiceComposer(selectedChoiceGroup);
  let lists = "";
  if (!composer) {
    const spaceChoicePanel = renderSpaceChoicePanel();
    const spaceChoiceIds = new Set(spaceChoiceActions().map((action) => action.id));
    const choiceActionGroups = choiceGroups();
    const groupedActionIds = groupedChoiceActionIds(choiceActionGroups);
    // Tactic cards are played by dragging them onto the board, so their
    // actions stay out of the dock unless a drop still needs disambiguation.
    const visibleChoiceGroups = orderGroupsForRecommendation(
        choiceActionGroups.filter((group) =>
          group.kind !== "acquire" &&
          (!isTacticChoiceGroup(group) ||
            (group.actionOptions || []).some((option) =>
              option.intrigueKey === intrigueDropKey)) &&
          choiceGroupVisible(group)),
        choiceGroupRecommendation);
    const visibleActions = orderActionsForRecommendation(
        gameState.legalActions.filter((action) =>
          !["leader_setup", "agent", "reveal", "pass"].includes(action.kind) &&
          !groupedActionIds.has(action.id) &&
          !spaceChoiceIds.has(action.id) &&
          (!isAcquirePhase() || action.kind !== "acquire") &&
          (action.kind !== "intrigue" ||
            intrigueActionCardKey(action) === intrigueDropKey) &&
          actionVisible(action)));
    // Ambiguous space click (several cards reach it): offer the pairings.
    const agentGroupButtons = selectedSpaceKey && !selectedCardKey
      ? orderGroupsForRecommendation(
          agentPlacementGroups().filter((group) => groupVisible(group)),
          groupRecommendation)
      : [];
    lists = `
      ${spaceChoicePanel}
      ${agentGroupButtons.length ? `
        <div class="agent-groups-list">
          ${agentGroupButtons.map((group) => renderAgentGroupButton(group)).join("")}
        </div>
      ` : ""}
      ${visibleChoiceGroups.length ? `
        <div class="choice-groups-list">
          ${visibleChoiceGroups.map((group) => renderChoiceGroupButton(group)).join("")}
        </div>
      ` : ""}
      ${visibleActions.length ? `
        <div class="actions-list">
          ${visibleActions.map((action) => renderActionButton(action)).join("")}
        </div>
      ` : ""}
    `;
    if (!spaceChoicePanel && !agentGroupButtons.length && !visibleChoiceGroups.length &&
        !visibleActions.length) {
      return "";
    }
  }
  return `
    <section class="prompt-dock" aria-label="Pending choices">
      ${composer || lists}
    </section>
  `;
}

function bestRecommendationForActions(actions) {
  return actions
    .map((action) => currentBrRecommendationForAction(action))
    .filter(Boolean)
    .sort((left, right) => left.rank - right.rank)[0] || null;
}

function renderRevealCorner() {
  const human = currentHuman();
  const revealActions = gameState.legalActions.filter((action) => action.kind === "reveal");
  const passActions = gameState.legalActions.filter((action) => action.kind === "pass");
  let button = "";
  let recommendation = null;
  let extraClass = "";
  let attrs = "";
  let label = "";
  if (isHumanTurn() && revealActions.length) {
    recommendation = bestRecommendationForActions(revealActions);
    attrs = revealActions.length === 1
      ? `data-action="${revealActions[0].id}"`
      : `data-open-moves="reveal"`;
    label = revealActions.length === 1 ? "Reveal" : "Reveal…";
  } else if (isHumanTurn() && passActions.length) {
    recommendation = bestRecommendationForActions(passActions);
    extraClass = " end-turn";
    if (passActions.length === 1) {
      attrs = `data-action="${passActions[0].id}"`;
      label = isAcquirePhase() ? "End Turn" : (passActions[0].label || "End Turn");
    } else {
      attrs = `data-open-moves="pass"`;
      label = "End Turn…";
    }
  }
  if (label) {
    const probability = recommendation
      ? formatProbability(recommendation.probability)
      : "";
    const title = recommendation
      ? `${brHintLabel()} #${recommendation.rank} recommends this` +
        `${probability ? ` (${probability})` : ""}`
      : "";
    button = `
      <span class="reveal-button-holder">
        ${recommendation ? renderBrHintBadge(recommendation) : ""}
        <button class="reveal-button${extraClass}${recommendation ? ` recommended br-rank-${recommendation.rank}` : ""}"
                ${attrs} ${busy ? "disabled" : ""}
                ${title ? `title="${escapeHtml(title)}"` : ""}>
          ${escapeHtml(label)}
        </button>
      </span>
    `;
  }
  const reopenButton = isAcquirePhase() && acquireOverlayHidden
    ? `
      <button class="reveal-button acquire-reopen-button" data-acquire-reopen
              ${busy ? "disabled" : ""}
              title="Reopen the acquirable cards">
        Cards
      </button>
    `
    : "";
  return `
    <div class="reveal-corner">
      <div class="persuasion-gem" title="${escapeHtml(revealPersuasionTitle(human))}">
        <b>${currentPersuasion(human)}</b>
      </div>
      ${reopenButton}
      ${button}
    </div>
  `;
}

function leaderInfoForKey(key) {
  return LEADER_OPTIONS.find((leader) => leader.key === key) || null;
}

function groupCardsByKey(cards) {
  const groups = new Map();
  for (const card of cards || []) {
    if (!card?.key) continue;
    const entry = groups.get(card.key);
    if (entry) {
      entry.count += 1;
    } else {
      groups.set(card.key, { card, count: 1 });
    }
  }
  return [...groups.values()].sort((left, right) =>
    left.card.name.localeCompare(right.card.name));
}

function playerViewZones(player) {
  const cards = player.cards || {};
  const contracts = player.contracts || {};
  const zones = [{
    key: "deck",
    label: cards.deckIncludesHand ? "Deck + Hand" : "Deck",
    cards: cards.deck || [],
    note: cards.deckIncludesHand
      ? "Unrevealed cards (draw deck and hand combined) — which are in hand, and the draw order, are hidden."
      : "Cards left in your draw deck — the draw order is hidden.",
  }];
  if ((cards.played || []).length) {
    zones.push({ key: "played", label: "In Play", cards: cards.played });
  }
  zones.push(
    { key: "discard", label: "Discard", cards: cards.discard || [] },
    { key: "trash", label: "Trash", cards: cards.trashed || [] });
  const activeContracts = uprisingContractCardsForKeys(contracts.active);
  const reservedContracts = uprisingContractCardsForKeys(contracts.reserved);
  const completedContracts = uprisingContractCardsForKeys(contracts.completed);
  if (activeContracts.length) {
    zones.push({
      key: "contracts",
      label: "Contracts",
      cards: activeContracts,
      note: "Active CHOAM contracts available to complete.",
    });
  }
  if (reservedContracts.length) {
    zones.push({
      key: "reserved-contracts",
      label: "Reserved",
      cards: reservedContracts,
      note: "Reserved contracts only this player can take.",
    });
  }
  if (completedContracts.length) {
    zones.push({
      key: "completed-contracts",
      label: "Completed",
      cards: completedContracts,
      note: "Completed CHOAM contracts already scored.",
    });
  }
  return zones;
}

function playerViewPlayer() {
  if (playerViewId === null || !gameState) return null;
  return gameState.players.find((player) => player.id === playerViewId) || null;
}

function stepPlayerView(delta) {
  if (!gameState?.players?.length) return;
  const players = gameState.players.slice().sort((left, right) => left.id - right.id);
  const index = players.findIndex((player) => player.id === playerViewId);
  const next = players[(index + delta + players.length) % players.length];
  playerViewId = next.id;
  render();
}

function renderPlayerViewCard(group) {
  return `
    <figure class="pv-card zoomable" title="${escapeHtml(group.card.name)}">
      ${renderCardFace(group.card, "pv-card-art")}
      ${renderZoom(group.card)}
      <figcaption>
        <span class="pv-card-name">${escapeHtml(group.card.name)}</span>
        ${group.count > 1 ? `<b class="pv-card-count">&times;${group.count}</b>` : ""}
      </figcaption>
    </figure>
  `;
}

function renderPlayerView() {
  const player = playerViewPlayer();
  if (!player) return "";
  const color = PLAYER_COLORS[player.id % PLAYER_COLORS.length];
  const leaderInfo = leaderInfoForKey(player.leader.key);
  const zones = playerViewZones(player);
  const activeZone = zones.find((zone) => zone.key === playerViewTab) || zones[0];
  const groups = groupCardsByKey(activeZone.cards);
  const subtitle = player.isHuman ? "You" : "AI opponent";
  const agents = player.agents || {};
  const agentsMax = (agents.max || 0) + (agents.temporaryMentat ? 1 : 0);
  const agentsLeft = Math.max(0, agentsMax - (agents.placed || 0));
  return `
    <div class="player-view" style="--player-color:${color}" role="dialog" aria-modal="true"
         aria-label="${escapeHtml(`${player.leader.name} — cards`)}">
      <div class="player-view-backdrop" data-player-view-close></div>
      <section class="player-view-panel">
        <header class="pv-top">
          <div class="pv-player-tab">
            <i class="pawn" style="--player-color:${color}"></i>
            <span>${escapeHtml(subtitle)}</span>
          </div>
          <div class="pv-stats">
            ${statChip("vp", player.vp, publicText("Victory points"))}
            ${statChip("spice", player.resources.spice, publicText("Spice"))}
            ${statChip("water", player.resources.water, publicText("Water"))}
            ${statChip("solari", player.resources.solari, publicText("Solari"))}
            ${statChip("card", player.cards.handCount, "Cards in hand")}
            ${statChip("intrigue", player.resources.intrigue, publicText("Intrigue cards"))}
            ${statChip("agent", `${agentsLeft}/${agentsMax}`, "Agents remaining")}
            ${renderUprisingSpyStat(player)}
            ${renderUprisingMakerHooksStat(player)}
            ${renderUprisingLeaderStateStats(player)}
            ${statChip("troop", player.troops.garrison, publicText("Troops in garrison"))}
          </div>
          <button class="pv-dismiss" data-player-view-close aria-label="Close">&times;</button>
        </header>
        <div class="pv-hero">
          <button class="pv-arrow" data-player-view-step="-1" aria-label="Previous player">&#10094;</button>
          <div class="pv-identity">
            <h2>${escapeHtml(player.leader.name)}</h2>
            <div class="pv-house">${escapeHtml(leaderInfo?.house || "")}</div>
            ${renderUprisingObjectiveBadge(player, "pv-objective")}
            ${leaderInfo?.passive ? `
              <div class="pv-ability">
                <span class="pv-ability-name">${escapeHtml(leaderInfo.passive.name)}</span>
                <p>${escapeHtml(leaderInfo.passive.text)}</p>
              </div>
            ` : ""}
            ${leaderInfo?.signet ? `
              <div class="pv-ability signet">
                <span class="pv-ability-name">
                  ${iconTag("agent", publicText("Signet Ring"))}
                  ${escapeHtml(leaderInfo.signet.name)}
                </span>
                <p>${escapeHtml(leaderInfo.signet.text)}</p>
              </div>
            ` : ""}
          </div>
          <div class="pv-portrait">
            ${imageTag(leaderPortraitImage(player.leader), player.leader.name, "pv-portrait-art")}
          </div>
          <button class="pv-arrow" data-player-view-step="1" aria-label="Next player">&#10095;</button>
        </div>
        <nav class="pv-tabs" aria-label="Card zones">
          ${zones.map((zone) => `
            <button class="pv-tab${zone.key === activeZone.key ? " active" : ""}"
                    data-player-view-tab="${zone.key}">
              ${escapeHtml(zone.label)}
              <b>${zone.cards.length}</b>
            </button>
          `).join("")}
        </nav>
        ${activeZone.note ? `<p class="pv-note">${escapeHtml(activeZone.note)}</p>` : ""}
        <div class="pv-cards">
          ${groups.length
            ? groups.map((group) => renderPlayerViewCard(group)).join("")
            : `<div class="pv-empty">No cards here yet</div>`}
        </div>
        <footer class="pv-footer">
          <button class="pv-close" data-player-view-close>Close</button>
        </footer>
      </section>
    </div>
  `;
}

function renderUprisingStartPreview() {
  if (activeSkin !== "uprising") return "";
  const spacesByKey = new Map(
      (UPRISING_WEB_DATA.boardSpaces || []).map((space) => [space.key, space]));
  const featuredSpaces = [
    "arrakeen",
    "spice_refinery",
    "imperial_basin",
    "deep_desert",
  ].map((key) => spacesByKey.get(key)).filter(Boolean);
  return `
    <section class="uprising-start-preview" aria-label="Uprising standard mode">
      <div class="uprising-preview-chips">
        <span>${configuredPlayerCount} players${configuredPlayerCount === 2 ? " · no Rival" : ""}</span>
        <span>CHOAM contracts</span>
        <span>${LEADER_OPTIONS.length} leaders</span>
        <span>${(UPRISING_WEB_DATA.boardSpaces || []).length} spaces</span>
      </div>
      <div class="uprising-preview-board">
        ${featuredSpaces.map((space) => `
          <figure class="uprising-preview-space">
            ${imageTag(space.image, space.name, "uprising-preview-art")}
            <figcaption>${escapeHtml(space.name)}</figcaption>
          </figure>
        `).join("")}
      </div>
    </section>
  `;
}

function configuredPlayerSeatIds() {
  return Array.from(
      { length: configuredPlayerCount },
      (_, index) => configuredPlayerCount - 1 - index);
}

function renderStartScreen(errorMessage = "", seedValue = "") {
  const selectedLeader = LEADER_OPTIONS.find((leader) => leader.id === selectedLeaderId) ||
      LEADER_OPTIONS[0];
  const playable = skinConfig().playable !== false;
  const passiveHtml = selectedLeader.passive?.name || selectedLeader.passive?.text
    ? `
        <div class="ls-ability">
          <span class="ls-ability-name">${escapeHtml(selectedLeader.passive?.name || "")}</span>
          <p>${escapeHtml(selectedLeader.passive?.text || "")}</p>
        </div>
      `
    : "";
  const signetHtml = selectedLeader.signet?.name || selectedLeader.signet?.text
    ? `
        <div class="ls-ability signet">
          <span class="ls-ability-name">
            ${iconTag("agent", publicText("Signet Ring"))}
            ${escapeHtml(selectedLeader.signet?.name || publicText("Signet Ring"))}
          </span>
          <p>${escapeHtml(selectedLeader.signet?.text || "")}</p>
        </div>
      `
    : "";
  app.className = "leader-select";
  app.innerHTML = `
    <header class="ls-top">
      <div class="ls-player-tab">
        <i class="pawn" style="--player-color:${PLAYER_COLORS[0]}"></i>
        <span>You</span>
      </div>
      <h1>${escapeHtml(skinConfig().chooseLeaderTitle)}</h1>
    </header>
    <div class="ls-body">
      <section class="ls-hexes" aria-label="Choose your leader">
        ${LEADER_OPTIONS.map((leader) => `
          <button class="ls-hex ${leader.id === selectedLeaderId ? "selected" : ""}"
                  data-leader-id="${leader.id}" title="${escapeHtml(leader.name)}"
                  aria-pressed="${leader.id === selectedLeaderId ? "true" : "false"}"
                  ${busy ? "disabled" : ""}>
            ${imageTag(leaderHeadImage(leader), leader.name, "ls-hex-art")}
            ${activeSkin === "uprising" ? `<span class="ls-leader-name">${escapeHtml(leader.name)}</span>` : ""}
          </button>
        `).join("")}
      </section>
      <section class="ls-detail">
        <h2>${escapeHtml(selectedLeader.name)}</h2>
        <div class="ls-house">${escapeHtml(selectedLeader.house || "")}</div>
        ${passiveHtml}
        ${signetHtml}
      </section>
      <section class="ls-portrait">
        ${imageTag(leaderPortraitImage(selectedLeader), selectedLeader.name, "ls-portrait-art")}
      </section>
    </div>
    <footer class="ls-footer">
      <div class="ls-roster">
        ${configuredPlayerSeatIds().map((seat) => `
          <div class="ls-roster-row">
            <i class="pawn" style="--player-color:${PLAYER_COLORS[seat]}"></i>
            <span>Player ${seat + 1}: ${seat === 0 ? "You" : "AI opponent"}</span>
          </div>
        `).join("")}
      </div>
      ${renderUprisingStartPreview()}
      <div class="ls-start-panel">
        ${renderSkinSelector("ls-skin")}
        <form class="ls-actions" id="start-game-form">
          <label>
            <span>Seed</span>
            <input id="start-seed" inputmode="numeric" placeholder="Random"
                   value="${escapeHtml(seedValue)}" ${busy ? "disabled" : ""}>
          </label>
          <button class="confirm-button" type="submit" ${busy || !playable ? "disabled" : ""}>
            ${escapeHtml(busy ? "Starting..." : playable ? skinConfig().confirmLabel : "Preview Only")}
          </button>
        </form>
        ${busy ? `
          <div class="ls-start-progress" role="status" aria-live="polite">
            <span>Preparing AI opponents</span>
            <div class="ls-progress-bar" role="progressbar" aria-label="Starting game"></div>
          </div>
        ` : ""}
      </div>
    </footer>
    <div class="error-banner" ${errorMessage ? "" : "hidden"}>${escapeHtml(errorMessage)}</div>
  `;
  bindStartEvents();
}

function captureTableScroll() {
  return [".board-viewport", ".hand-fan", ".intrigue-row", ".rail-cards", ".player-strip"]
    .flatMap(selector => {
      const element = document.querySelector(selector);
      return element ? [{ selector, left: element.scrollLeft, top: element.scrollTop }] : [];
    });
}

function restoreTableScroll(positions) {
  positions.forEach(({selector, left, top}) => {
    const element = document.querySelector(selector);
    if (element) {
      element.scrollLeft = left;
      element.scrollTop = top;
    }
  });
}

let renderedTableSessionId = null;

function render() {
  if (!gameState) {
    renderStartScreen();
    return;
  }
  // Selecting a card or resolving a choice must not move a panned board/hand.
  const scrollPositions = renderedTableSessionId === gameState.sessionId ? captureTableScroll() : [];
  app.className = "game-screen";
  app.innerHTML = `
    ${renderTableMasthead()}
    ${renderBoard()}
    ${renderPlaques()}
    ${renderInstructionBar()}
    ${renderTopIcons()}
    ${isAcquirePhase() && !acquireOverlayHidden
      ? renderAcquireOverlay()
      : renderImperiumRail()}
    ${renderPromptDock()}
    ${renderPoisonSnooperOverlay()}
    ${renderHandFan()}
    ${renderRevealCorner()}
    ${renderMovesDrawer()}
    ${renderLogDrawer()}
    ${renderSettingsDrawer()}
    ${renderPlayerView()}
    <div class="error-banner" role="alert" hidden></div>
  `;
  bindEvents();
  restoreTableScroll(scrollPositions);
  renderedTableSessionId = gameState.sessionId;
}

function clearHandDragHighlights() {
  document.body.classList.remove("dragging-card", "dragging-intrigue");
  document.querySelectorAll("[data-space]").forEach((element) => {
    element.classList.remove("drag-legal", "drag-blocked", "drag-hover");
  });
  document.querySelector("[data-intrigue-drop]")?.classList.remove("drag-over");
  handDrag?.ghost?.remove();
}

function beginHandDragHighlights(cardKey) {
  const spaces = legalSpaceKeysForCard(cardKey);
  document.body.classList.add("dragging-card");
  document.querySelectorAll("[data-space]").forEach((element) => {
    const key = element.getAttribute("data-space");
    element.classList.toggle("drag-legal", spaces.has(key));
    element.classList.toggle("drag-blocked", !spaces.has(key));
  });
  return spaces;
}

function spaceElementAt(clientX, clientY) {
  return document.elementFromPoint(clientX, clientY)?.closest("[data-space]") || null;
}

function intrigueDropElementAt(clientX, clientY) {
  return document.elementFromPoint(clientX, clientY)
    ?.closest("[data-intrigue-drop]") || null;
}

function beginDrag(element, event, type, cardKey) {
  // Touch players tap to select/place cards; swiping must scroll the hand.
  if (event.pointerType === "touch") return;
  const image = element.querySelector(".card-art");
  handDrag = {
    type,
    cardKey,
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    moved: false,
    legalSpaces: null,
    ghost: null,
    imageSrc: image?.getAttribute("src") || "",
    cardFace: element.querySelector(".readable-card")?.cloneNode(true) || null,
  };
}

function bindSkinChoices() {
  document.querySelectorAll("[data-skin-choice]").forEach((element) => {
    element.addEventListener("click", () => {
      if (busy) return;
      updateSkinSetting(element.getAttribute("data-skin-choice"));
    });
  });
}

function bindHandDrag() {
  document.querySelectorAll("[data-hand-card]").forEach((element) => {
    element.addEventListener("pointerdown", (event) => {
      if (busy || event.button !== 0) return;
      beginDrag(element, event, "hand", element.getAttribute("data-hand-card"));
    });
  });
  document.querySelectorAll("[data-intrigue-card]").forEach((element) => {
    element.addEventListener("pointerdown", (event) => {
      if (busy || event.button !== 0) return;
      beginDrag(element, event, "intrigue", element.getAttribute("data-intrigue-card"));
    });
  });
  if (handDragDocumentBound) return;
  handDragDocumentBound = true;
  // Native image dragging would swallow the pointermove stream.
  document.addEventListener("dragstart", (event) => event.preventDefault());
  document.addEventListener("pointermove", (event) => {
    if (!handDrag || event.pointerId !== handDrag.pointerId) return;
    const dx = event.clientX - handDrag.startX;
    const dy = event.clientY - handDrag.startY;
    if (!handDrag.moved && Math.hypot(dx, dy) > 10) {
      handDrag.moved = true;
      if (handDrag.type === "intrigue") {
        document.body.classList.add("dragging-card", "dragging-intrigue");
      } else {
        handDrag.legalSpaces = beginHandDragHighlights(handDrag.cardKey);
      }
      const ghost = document.createElement("div");
      ghost.className = "drag-ghost";
      if (handDrag.cardFace) {
        ghost.appendChild(handDrag.cardFace);
      } else if (handDrag.imageSrc) {
        const img = document.createElement("img");
        img.src = handDrag.imageSrc;
        ghost.appendChild(img);
      }
      document.body.appendChild(ghost);
      handDrag.ghost = ghost;
    }
    if (!handDrag.moved) return;
    handDrag.ghost.style.left = `${event.clientX}px`;
    handDrag.ghost.style.top = `${event.clientY}px`;
    if (handDrag.type === "intrigue") {
      const dropZone = document.querySelector("[data-intrigue-drop]");
      dropZone?.classList.toggle(
          "drag-over",
          intrigueDropElementAt(event.clientX, event.clientY) === dropZone);
      return;
    }
    const hover = spaceElementAt(event.clientX, event.clientY);
    document.querySelectorAll("[data-space].drag-hover").forEach((element) => {
      if (element !== hover) element.classList.remove("drag-hover");
    });
    if (hover?.classList.contains("drag-legal")) hover.classList.add("drag-hover");
  });
  document.addEventListener("pointerup", (event) => {
    if (!handDrag || event.pointerId !== handDrag.pointerId) return;
    const drag = handDrag;
    // Hit-test before clearing: the drop zone hides once highlights reset.
    const intrigueDropTarget = drag.type === "intrigue"
      ? intrigueDropElementAt(event.clientX, event.clientY)
      : null;
    const target = drag.type === "intrigue"
      ? null
      : spaceElementAt(event.clientX, event.clientY);
    clearHandDragHighlights();
    handDrag = null;
    if (!drag.moved) return;
    suppressHandClickCardKey = drag.cardKey;
    setTimeout(() => {
      if (suppressHandClickCardKey === drag.cardKey) {
        suppressHandClickCardKey = null;
      }
    }, 0);
    if (drag.type === "intrigue") {
      if (intrigueDropTarget) {
        playTacticCard(drag.cardKey);
      }
      return;
    }
    const spaceKey = target?.getAttribute("data-space");
    if (!spaceKey || !drag.legalSpaces?.has(spaceKey)) {
      render();
      return;
    }
    selectedCardKey = drag.cardKey;
    if (!maybeSelectOrApplyAgentGroup(drag.cardKey, spaceKey)) {
      selectedSpaceKey = spaceKey;
      render();
    }
  });
  document.addEventListener("pointercancel", () => {
    if (!handDrag) return;
    clearHandDragHighlights();
    handDrag = null;
  });
}

function bindEvents() {
  document.querySelectorAll("[data-play-intrigue]").forEach(button => {
    button.addEventListener("click", () => playTacticCard(button.dataset.playIntrigue));
  });
  document.querySelectorAll("[data-inspect-card]").forEach(button => {
    button.addEventListener("click", () => inspectCard(button.dataset.inspectCard, button));
  });
  bindSkinChoices();
  document.querySelectorAll("#new-game-button, [data-new-game]").forEach(button => button.addEventListener("click", () => {
    resetFx();
    clearHandDragHighlights();
    handDrag = null;
    gameState = null;
    movesDrawerOpen = false;
    logDrawerOpen = false;
    settingsDrawerOpen = false;
    playerViewId = null;
    renderStartScreen();
  }));
  document.querySelectorAll("[data-toggle-drawer]").forEach((element) => {
    element.addEventListener("click", () => {
      const drawer = element.getAttribute("data-toggle-drawer");
      if (drawer === "moves") {
        movesDrawerOpen = !movesDrawerOpen;
        if (movesDrawerOpen) {
          logDrawerOpen = false;
          settingsDrawerOpen = false;
        }
      }
      if (drawer === "log") {
        logDrawerOpen = !logDrawerOpen;
        if (logDrawerOpen) {
          movesDrawerOpen = false;
          settingsDrawerOpen = false;
        }
      }
      if (drawer === "settings") {
        settingsDrawerOpen = !settingsDrawerOpen;
        if (settingsDrawerOpen) {
          movesDrawerOpen = false;
          logDrawerOpen = false;
        }
      }
      render();
    });
  });
  document.querySelectorAll("[data-open-moves]").forEach((element) => {
    element.addEventListener("click", () => {
      actionSearch = element.getAttribute("data-open-moves") || "";
      movesDrawerOpen = true;
      logDrawerOpen = false;
      settingsDrawerOpen = false;
      render();
    });
  });
  document.querySelectorAll("[data-space]").forEach((element) => {
    element.addEventListener("click", () => {
      if (element.classList.contains("unreachable")) return;
      const key = element.getAttribute("data-space");
      const pendingChoice = spaceChoiceTargets().get(key);
      if (pendingChoice && !busy) {
        applyAction(pendingChoice.id);
        return;
      }
      if (selectedCardKey && maybeSelectOrApplyAgentGroup(selectedCardKey, key)) return;
      selectedSpaceKey = selectedSpaceKey === key ? null : key;
      selectedActionGroupKey = null;
      render();
    });
  });
  document.querySelectorAll("[data-card-filter]").forEach((element) => {
    element.addEventListener("click", () => {
      const key = element.getAttribute("data-card-filter");
      if (suppressHandClickCardKey === key) return;
      if (key === selectedCardKey && selectedHandCard()) {
        cancelAgentMoveSelection();
        render();
        return;
      }
      if (selectedSpaceKey && maybeSelectOrApplyAgentGroup(key, selectedSpaceKey)) return;
      selectedCardKey = selectedCardKey === key ? null : key;
      selectedActionGroupKey = null;
      if (intrigueDropKey && intrigueDropKey !== selectedCardKey) {
        intrigueDropKey = null;
      }
      if (selectedCardKey && selectedHandCard()) {
        const reachableSpaces = legalSpaceKeysForCard(selectedCardKey);
        if (selectedSpaceKey && !reachableSpaces.has(selectedSpaceKey)) {
          selectedSpaceKey = null;
        }
      }
      render();
    });
  });
  bindHandDrag();
  document.querySelectorAll("[data-player-view]").forEach((element) => {
    const open = () => {
      playerViewId = Number(element.getAttribute("data-player-view"));
      playerViewTab = "deck";
      render();
    };
    element.addEventListener("click", open);
    element.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        open();
      }
    });
  });
  document.querySelectorAll("[data-player-view-close]").forEach((element) => {
    element.addEventListener("click", () => {
      playerViewId = null;
      render();
    });
  });
  document.querySelectorAll("[data-player-view-step]").forEach((element) => {
    element.addEventListener("click", () =>
      stepPlayerView(Number(element.getAttribute("data-player-view-step"))));
  });
  document.querySelectorAll("[data-player-view-tab]").forEach((element) => {
    element.addEventListener("click", () => {
      playerViewTab = element.getAttribute("data-player-view-tab");
      render();
    });
  });
  document.querySelectorAll("[data-agent-group]").forEach((element) => {
    element.addEventListener("click", () => {
      const group = agentGroupForKey(element.getAttribute("data-agent-group"));
      if (!group) return;
      const options = sortedActionOptions(group);
      if (options.length === 1) {
        applyAction(options[0].actionId);
      } else {
        selectAgentGroup(group);
      }
    });
  });
  document.querySelectorAll("[data-choice-group]").forEach((element) => {
    element.addEventListener("click", () => {
      const group = choiceGroupForKey(element.getAttribute("data-choice-group"));
      if (!group) return;
      const options = group.actionOptions || [];
      if (options.length === 1) {
        applyAction(options[0].actionId);
      } else {
        selectChoiceGroup(group);
      }
    });
  });
  document.querySelectorAll("[data-troop-set]").forEach((element) => {
    element.addEventListener("click", () => {
      const group = agentGroupForKey(selectedActionGroupKey);
      if (!group) return;
      const troops = Number(element.getAttribute("data-troop-set"));
      if (!sortedTroopOptions(group).some((option) => option.troops === troops)) return;
      selectedTroopsByGroup.set(group.key, troops);
      render();
    });
  });
  document.querySelectorAll("[data-trash-card]").forEach((element) => {
    element.addEventListener("click", () => {
      const group = agentGroupForKey(selectedActionGroupKey);
      if (!group) return;
      selectedTrashByGroup.set(group.key, element.getAttribute("data-trash-card"));
      render();
    });
  });
  document.querySelectorAll("[data-signet-option]").forEach((element) => {
    element.addEventListener("click", () => {
      const group = agentGroupForKey(selectedActionGroupKey);
      if (!group) return;
      selectedSignetByGroup.set(group.key, element.getAttribute("data-signet-option"));
      render();
    });
  });
  document.querySelectorAll("[data-agent-choice]").forEach((element) => {
    element.addEventListener("click", () => {
      const group = agentGroupForKey(selectedActionGroupKey);
      if (!group) return;
      const [field, rawValue] = parseChoiceDataAttribute(
        element.getAttribute("data-agent-choice"));
      const choices = defaultAgentChoicesForGroup(group);
      choices[field] = rawValue === "true" ? true : (rawValue === "false" ? false : rawValue);
      const dimensions = dimensionsForOptions(sortedActionOptions(group), AGENT_CHOICE_DIMENSIONS);
      selectedAgentChoicesByGroup.set(
          group.key,
          normalizeChoiceSelection(sortedActionOptions(group), dimensions, choices, field));
      render();
    });
  });
  document.querySelectorAll("[data-agent-step]").forEach((element) => {
    element.addEventListener("click", () => {
      const group = agentGroupForKey(selectedActionGroupKey);
      if (!group) return;
      const [field, rawDelta] = element.getAttribute("data-agent-step").split(":");
      const choices = defaultAgentChoicesForGroup(group);
      const dimension = dimensionsForOptions(sortedActionOptions(group), AGENT_CHOICE_DIMENSIONS)
        .find((item) => item.field === field);
      if (!dimension) return;
      const currentIndex = dimension.values.findIndex((item) =>
        sameChoiceValue(item.value, choices[field]));
      const nextIndex = currentIndex + Number(rawDelta);
      if (nextIndex < 0 || nextIndex >= dimension.values.length) return;
      choices[field] = dimension.values[nextIndex].value;
      const dimensions = dimensionsForOptions(sortedActionOptions(group), AGENT_CHOICE_DIMENSIONS);
      selectedAgentChoicesByGroup.set(
          group.key,
          normalizeChoiceSelection(sortedActionOptions(group), dimensions, choices, field));
      render();
    });
  });
  document.querySelectorAll("[data-confirm-agent]").forEach((element) => {
    element.addEventListener("click", () => applyAction(Number(element.getAttribute("data-confirm-agent"))));
  });
  document.querySelectorAll("[data-choice-choice]").forEach((element) => {
    element.addEventListener("click", () => {
      const group = choiceGroupForKey(selectedChoiceGroupKey);
      if (!group) return;
      const [field, rawValue] = parseChoiceDataAttribute(
        element.getAttribute("data-choice-choice"));
      const choices = defaultChoicesForChoiceGroup(group);
      choices[field] = rawValue === "true" ? true : (rawValue === "false" ? false : rawValue);
      const dimensions = dimensionsForOptions(group.actionOptions || [], GENERIC_CHOICE_DIMENSIONS);
      selectedChoicesByGroup.set(
          group.key,
          normalizeChoiceSelection(group.actionOptions || [], dimensions, choices, field));
      render();
    });
  });
  document.querySelectorAll("[data-choice-step]").forEach((element) => {
    element.addEventListener("click", () => {
      const group = choiceGroupForKey(selectedChoiceGroupKey);
      if (!group) return;
      const [field, rawDelta] = element.getAttribute("data-choice-step").split(":");
      const choices = defaultChoicesForChoiceGroup(group);
      const dimension = dimensionsForOptions(group.actionOptions || [], GENERIC_CHOICE_DIMENSIONS)
        .find((item) => item.field === field);
      if (!dimension) return;
      const currentIndex = dimension.values.findIndex((item) =>
        sameChoiceValue(item.value, choices[field]));
      const nextIndex = currentIndex + Number(rawDelta);
      if (nextIndex < 0 || nextIndex >= dimension.values.length) return;
      choices[field] = dimension.values[nextIndex].value;
      const dimensions = dimensionsForOptions(group.actionOptions || [], GENERIC_CHOICE_DIMENSIONS);
      selectedChoicesByGroup.set(
          group.key,
          normalizeChoiceSelection(group.actionOptions || [], dimensions, choices, field));
      render();
    });
  });
  document.querySelectorAll("[data-confirm-choice]").forEach((element) => {
    element.addEventListener("click", () => {
      const actionId = Number(element.getAttribute("data-confirm-choice"));
      if (Number.isFinite(actionId)) applyAction(actionId);
    });
  });
  document.querySelectorAll("[data-leader-faction]").forEach((element) => {
    element.addEventListener("click", () => {
      const group = leaderSetupGroup();
      if (!group) return;
      toggleLeaderSetupFaction(group, element.getAttribute("data-leader-faction"));
    });
  });
  document.querySelectorAll("[data-confirm-leader-setup]").forEach((element) => {
    element.addEventListener("click", () => {
      const actionId = Number(element.getAttribute("data-confirm-leader-setup"));
      if (Number.isFinite(actionId)) applyAction(actionId);
    });
  });
  document.querySelectorAll("[data-action]").forEach((element) => {
    element.addEventListener("click", () => applyAction(Number(element.getAttribute("data-action"))));
  });
  document.querySelectorAll("[data-acquire-close]").forEach((element) => {
    element.addEventListener("click", () => {
      acquireOverlayHidden = true;
      render();
    });
  });
  document.querySelectorAll("[data-acquire-reopen]").forEach((element) => {
    element.addEventListener("click", () => {
      acquireOverlayHidden = false;
      render();
    });
  });
  document.querySelectorAll("[data-acquire-card]").forEach((element) => {
    element.addEventListener("click", () => {
      if (element.disabled) return;
      const cardKey = element.getAttribute("data-acquire-card");
      const source = element.getAttribute("data-acquire-source") || "";
      if (suppressAcquireClickCardKey === cardKey) return;
      const action = chooseAcquireAction(cardKey, source);
      if (action) applyAction(action.id);
    });
    element.addEventListener("pointerdown", (event) => {
      if (element.disabled || event.button !== 0 || event.pointerType === "touch") return;
      acquirePointerDrag = {
        cardKey: element.getAttribute("data-acquire-card"),
        source: element.getAttribute("data-acquire-source") || "",
        moved: false,
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
      };
      element.setPointerCapture?.(event.pointerId);
    });
    element.addEventListener("pointermove", (event) => {
      if (!acquirePointerDrag || acquirePointerDrag.pointerId !== event.pointerId) return;
      const dx = event.clientX - acquirePointerDrag.startX;
      const dy = event.clientY - acquirePointerDrag.startY;
      if (Math.hypot(dx, dy) > 8) {
        acquirePointerDrag.moved = true;
        document.querySelector("[data-acquire-drop]")?.classList.add("drag-over");
      }
    });
    element.addEventListener("pointerup", (event) => {
      if (!acquirePointerDrag || acquirePointerDrag.pointerId !== event.pointerId) return;
      const drag = acquirePointerDrag;
      acquirePointerDrag = null;
      element.releasePointerCapture?.(event.pointerId);
      document.querySelector("[data-acquire-drop]")?.classList.remove("drag-over");
      const dropTarget = document.elementFromPoint(
          event.clientX, event.clientY)?.closest("[data-acquire-drop]");
      if (!drag.moved || !dropTarget) return;
      applyAcquireDrag(drag.cardKey, drag.source);
    });
    element.addEventListener("mousedown", (event) => {
      if (element.disabled || event.button !== 0) return;
      acquireMouseDrag = {
        cardKey: element.getAttribute("data-acquire-card"),
        source: element.getAttribute("data-acquire-source") || "",
        moved: false,
        startX: event.clientX,
        startY: event.clientY,
      };
    });
  });
  if (!acquireDocumentDragBound) {
    acquireDocumentDragBound = true;
    document.addEventListener("mousemove", (event) => {
      if (!acquireMouseDrag) return;
      const dx = event.clientX - acquireMouseDrag.startX;
      const dy = event.clientY - acquireMouseDrag.startY;
      if (Math.hypot(dx, dy) > 8) {
        acquireMouseDrag.moved = true;
        document.querySelector("[data-acquire-drop]")?.classList.add("drag-over");
      }
    });
    document.addEventListener("mouseup", (event) => {
      if (!acquireMouseDrag) return;
      const drag = acquireMouseDrag;
      acquireMouseDrag = null;
      document.querySelector("[data-acquire-drop]")?.classList.remove("drag-over");
      const dropTarget = document.elementFromPoint(
          event.clientX, event.clientY)?.closest("[data-acquire-drop]");
      if (drag.moved && dropTarget) {
        applyAcquireDrag(drag.cardKey, drag.source);
      }
    });
  }
  document.getElementById("br-recommendation-toggle")?.addEventListener("change", (event) => {
    showBrRecommendation = Boolean(event.target.checked);
    saveBooleanSetting(BR_RECOMMENDATION_SETTING_KEY, showBrRecommendation);
    render();
  });
  document.getElementById("opponent-search-toggle")?.addEventListener("change", (event) => {
    updateOpponentSearchSettings(
        Boolean(event.target.checked), opponentSearchSimulations);
  });
  document.getElementById("fx-speed-slider")?.addEventListener("input", (event) => {
    setFxSpeed(Number(event.target.value));
    // Update the label in place: a full render would rebuild the slider
    // mid-drag and drop the pointer capture.
    const label = document.getElementById("fx-speed-value");
    if (label) label.textContent = fxSpeedLabel(fxSpeed);
  });
  document.getElementById("opponent-search-settings")?.addEventListener("click", () => {
    const raw = prompt("Search simulations", String(opponentSearchSimulations));
    if (raw === null) return;
    const value = Number(raw.trim());
    if (!Number.isInteger(value) || value < 1) {
      showError("Search simulations must be a positive integer.");
      return;
    }
    updateOpponentSearchSettings(opponentSearchEnabled, value);
  });
  document.querySelectorAll("[data-clear]").forEach((element) => {
    element.addEventListener("click", () => {
      const target = element.getAttribute("data-clear");
      if (target === "space") selectedSpaceKey = null;
      if (target === "card") {
        selectedCardKey = null;
        intrigueDropKey = null;
      }
      if (target === "group") {
        selectedActionGroupKey = null;
        selectedTrashByGroup.clear();
        selectedSignetByGroup.clear();
        selectedAgentChoicesByGroup.clear();
      }
      if (target === "choice") {
        selectedChoiceGroupKey = null;
        selectedChoicesByGroup.clear();
      }
      render();
    });
  });
  const search = document.getElementById("action-search");
  search?.addEventListener("input", (event) => {
    actionSearch = event.target.value;
    render();
  });
}

function bindStartEvents() {
  bindSkinChoices();
  document.querySelectorAll("[data-leader-id]").forEach((element) => {
    element.addEventListener("click", () => {
      if (busy) return;
      selectedLeaderId = Number(element.getAttribute("data-leader-id"));
      saveLeaderSetting(selectedLeaderId);
      renderStartScreen();
    });
  });
  document.getElementById("start-game-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (busy) return;
    const rawSeed = document.getElementById("start-seed")?.value.trim() || "";
    const seed = rawSeed === "" ? null : Number(rawSeed);
    if (rawSeed !== "" && !Number.isFinite(seed)) {
      renderStartScreen("Seed must be a number.", rawSeed);
      return;
    }
    if (skinConfig().playable === false) {
      renderStartScreen("This skin is preview-only in this build.", rawSeed);
      return;
    }
    saveLeaderSetting(selectedLeaderId);
    startGame(seed, selectedLeaderId, rawSeed).catch((error) => {
      renderStartScreen(error.message, rawSeed);
    });
  });
}

/* ============================================================== */
/* FX layer — animated showcases for plays, ladders and alliances */
/* ============================================================== */
// The whole UI re-renders via innerHTML on every state change, so transient
// animations live in a separate overlay on document.body. Events are derived
// by diffing consecutive game states: bot/human moves come from new game-log
// entries (machine-readable action strings), while influence climbs, alliance
// grabs, VP and resource changes come from structured player diffs.

let fxQueue = [];
let fxPlaying = false;
let fxAdvanceTimer = null;
const fxTimers = new Set();
function scheduleFx(callback, delay) {
  const timer = window.setTimeout(() => {
    fxTimers.delete(timer);
    callback();
  }, delay);
  fxTimers.add(timer);
  return timer;
}
// Agent discs whose placement animation has not landed yet, keyed by
// "spaceKey|playerId" with a count; renderSpaceTile keeps them hidden.
const fxPendingAgentReveals = new Map();

// Animation playback speed. The base timings below were tuned at what is now
// labelled 2x, so the wall-clock scale factor is 2 / fxSpeed; 0 disables FX.
const FX_SPEED_SETTING_KEY = "starfallFxSpeed";
const FX_BASE_SPEED = 2;
const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
let fxSpeed = loadFxSpeedSetting();
reducedMotionQuery.addEventListener("change", () => {
  if (reducedMotionQuery.matches) resetFx();
  applyFxScale();
});

function normalizeFxSpeed(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 1;
  if (parsed <= 0) return 0;
  const clamped = Math.min(3, Math.max(0.25, parsed));
  return Math.round(clamped * 4) / 4;
}

function loadFxSpeedSetting() {
  try {
    const stored = window.localStorage.getItem(FX_SPEED_SETTING_KEY);
    if (stored === null) return 2;
    return normalizeFxSpeed(stored);
  } catch (error) {
    return 2;
  }
}

function setFxSpeed(value) {
  fxSpeed = normalizeFxSpeed(value);
  try {
    window.localStorage.setItem(FX_SPEED_SETTING_KEY, String(fxSpeed));
  } catch (error) {
    // Ignore storage failures; the speed still applies to the current page.
  }
  applyFxScale();
  if (fxSpeed === 0) resetFx();
}

function fxSpeedLabel(speed) {
  return speed === 0 ? "Off" : `${speed}×`;
}

function fxTime(milliseconds) {
  return fxSpeed > 0 && !reducedMotionQuery.matches
    ? Math.round((milliseconds * FX_BASE_SPEED) / fxSpeed) : 0;
}

// CSS keyframe animations (showcase entrance, rings, pops…) read this scale
// from a custom property; it lives on :root because pop classes also land on
// board elements outside #fx-layer.
function applyFxScale() {
  document.documentElement.style.setProperty(
      "--fx-scale", String(fxSpeed > 0 ? FX_BASE_SPEED / fxSpeed : 1));
}

applyFxScale();

function fxLayer() {
  let layer = document.getElementById("fx-layer");
  if (!layer) {
    layer = document.createElement("div");
    layer.id = "fx-layer";
    document.body.appendChild(layer);
  }
  return layer;
}

function humanPendingChoiceCanReceiveInput() {
  if (!gameState || !isHumanTurn()) return false;
  if (leaderSetupGroup() || poisonSnooperPending() || spaceChoiceActions().length) {
    return true;
  }
  return choiceGroups().some((group) => group.kind !== "acquire");
}

function fxBlocking() {
  return (fxPlaying || fxQueue.length > 0) && !humanPendingChoiceCanReceiveInput();
}

// Show a skip control while the presentation catches up. The layer stays
// transparent to input; a new action cancels any remaining animations.
function updateFxBlocking() {
  const layer = fxLayer();
  const blocking = fxBlocking();
  layer.classList.toggle("blocking", blocking);
  let hint = layer.querySelector(".fx-skip-hint");
  if (blocking && !hint) {
    hint = document.createElement("button");
    hint.className = "fx-skip-hint";
    hint.textContent = "Skip effects · Esc";
    hint.addEventListener("pointerdown", event => { event.stopPropagation(); resetFx(); });
    hint.addEventListener("click", resetFx);
    layer.appendChild(hint);
  } else if (!blocking && hint) {
    hint.remove();
  }
}

function resetFx() {
  fxQueue = [];
  fxPlaying = false;
  clearTimeout(fxAdvanceTimer);
  for (const timer of fxTimers) clearTimeout(timer);
  fxTimers.clear();
  flushPendingAgentReveals();
  const layer = document.getElementById("fx-layer");
  if (layer) {
    layer.getAnimations({ subtree: true }).forEach(animation => animation.cancel());
    layer.replaceChildren();
    layer.classList.remove("blocking");
  }
  document.querySelectorAll(".fx-ladder-glow, .fx-vp-pop, .fx-marker-pop").forEach(element =>
    element.classList.remove("fx-ladder-glow", "fx-vp-pop", "fx-marker-pop"));
}

// Safety net: if reveals are still pending once nothing is animating (an
// event errored, or FX were turned off), show the discs immediately.
function flushPendingAgentReveals() {
  if (!fxPendingAgentReveals.size) return;
  fxPendingAgentReveals.clear();
  document.querySelectorAll(".agents i.fx-hidden-marker").forEach((marker) =>
    marker.classList.remove("fx-hidden-marker"));
}

// Flags the occupiedBy entries (last placements first) whose reveal is still
// pending, so render keeps those discs invisible until their animation.
function fxAgentMarkerHiddenFlags(space) {
  const flags = space.occupiedBy.map(() => false);
  if (!fxPendingAgentReveals.size) return flags;
  const used = new Map();
  for (let index = space.occupiedBy.length - 1; index >= 0; index -= 1) {
    const key = `${space.key}|${space.occupiedBy[index]}`;
    const pending = fxPendingAgentReveals.get(key) || 0;
    const taken = used.get(key) || 0;
    if (taken < pending) {
      flags[index] = true;
      used.set(key, taken + 1);
    }
  }
  return flags;
}

function prettyKey(key) {
  return String(key || "")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function findCardInState(key) {
  const pools = [gameState?.imperiumRow];
  for (const reserve of gameState?.reserves || []) pools.push([reserve.card]);
  for (const player of gameState?.players || []) {
    const cards = player.cards || {};
    pools.push(cards.hand, cards.played, cards.discard, cards.deck,
        cards.trashed, cards.intrigue);
  }
  for (const pool of pools) {
    const hit = (pool || []).find((card) => card?.key === key);
    if (hit) return hit;
  }
  return null;
}

function resolveCard(types, key) {
  for (const type of types) {
    const entry = gameState?.assetManifest?.[`${type}:${key}`];
    if (entry) {
      return {
        name: publicText(entry.name || prettyKey(key)),
        image: window.DunePresentation?.installed(entry.image) ? entry.image :
          window.DunePresentation?.artwork(entry.name || prettyKey(key), true) || "",
      };
    }
  }
  const stateCard = findCardInState(key);
  if (stateCard) return { name: publicText(stateCard.name), image: stateCard.image };
  return { name: publicText(prettyKey(key)), image: "" };
}

function spaceDisplayName(spaceKey) {
  return publicText(gameState?.boardSpaces?.find((space) => space.key === spaceKey)?.name ||
      prettyKey(spaceKey));
}

function fxPlayerInfo(state, playerId) {
  const player = state.players.find((candidate) => candidate.id === playerId);
  return {
    playerId,
    playerName: player?.leader?.name || `Player ${playerId}`,
    leaderImage: window.DunePresentation?.installed(leaderHeadImage(player?.leader))
      ? leaderHeadImage(player?.leader) : window.DunePresentation?.artwork(player?.leader?.name || "Player") || "",
    color: PLAYER_COLORS[playerId % PLAYER_COLORS.length],
    isHuman: Boolean(player?.isHuman),
  };
}

// The serialized log is a sliding window over the full game log, so the new
// entries are everything after the longest prefix of nextLog that matches a
// suffix of prevLog.
function newLogEntries(prevLog, nextLog) {
  if (!Array.isArray(prevLog) || !Array.isArray(nextLog)) return [];
    const same = (left, right) => left.kind === right.kind &&
      left.player === right.player && left.text === right.text &&
      left.actionString === right.actionString;
  for (let kept = Math.min(prevLog.length, nextLog.length); kept >= 0; kept -= 1) {
    let match = true;
    for (let index = 0; index < kept; index += 1) {
      if (!same(prevLog[prevLog.length - kept + index], nextLog[index])) {
        match = false;
        break;
      }
    }
    if (match) return nextLog.slice(kept);
  }
  return nextLog.slice();
}

// Parses action strings like "agent(card=foo, space=bar, cost=(0,4,0))" into
// { kind, fields }; bare tokens like "to_top_deck" become boolean flags.
function parseActionString(text) {
  const clean = String(text || "").replace(/\s*\[[^\]]*\]\s*$/, "").trim();
  const parenIndex = clean.indexOf("(");
  const kind = parenIndex < 0 ? clean : clean.slice(0, parenIndex);
  const fields = {};
  if (parenIndex >= 0 && clean.lastIndexOf(")") > parenIndex) {
    const body = clean.slice(parenIndex + 1, clean.lastIndexOf(")"));
    const tokens = [];
    let token = "";
    let depth = 0;
    for (const character of body) {
      if (character === "(") depth += 1;
      if (character === ")") depth -= 1;
      if (character === "," && depth === 0) {
        tokens.push(token);
        token = "";
        continue;
      }
      token += character;
    }
    if (token.trim()) tokens.push(token);
    for (const raw of tokens) {
      const part = raw.trim();
      const eq = part.indexOf("=");
      if (eq < 0) {
        fields[part] = true;
      } else if (fields[part.slice(0, eq)] === undefined) {
        fields[part.slice(0, eq)] = part.slice(eq + 1);
      }
    }
  }
  return { kind, fields };
}

function buildFxMoveEvents(prev, next) {
  const moves = [];
  for (const entry of newLogEntries(prev.log, next.log)) {
    if (!Number.isInteger(entry.player) || entry.player < 0) continue;
    const isBot = String(entry.kind || "").startsWith("bot");
    const info = fxPlayerInfo(next, entry.player);
    const { kind, fields } = parseActionString(entry.actionString || entry.text);
    if (kind === "agent" && fields.card && fields.space) {
      moves.push({
        ...info,
        type: "agent",
        cardKey: fields.card,
        spaceKey: fields.space,
        troops: Number(fields.troops || 0),
      });
    } else if (kind === "intrigue" && fields.card) {
      moves.push({ ...info, type: "intrigue", cardKey: fields.card, mode: fields.mode || "" });
    } else if (kind === "acquire" && fields.card) {
      moves.push({
        ...info,
        type: "acquire",
        cardKey: fields.card,
        source: fields.source || "",
        toTopDeck: Boolean(fields.to_top_deck),
      });
    } else if (kind === "reveal" && isBot) {
      moves.push({ ...info, type: "reveal" });
    }
  }
  return moves;
}

// VP sources that are paid out when a conflict resolves; their deltas are
// animated by the combat announcement instead of the generic VP pop.
const FX_COMBAT_VP_SOURCES = ["combat", "combat_influence"];

function fxVpSourceTotal(player, keys) {
  const sources = player?.vpSources || {};
  return keys.reduce((sum, key) => sum + Number(sources[key] || 0), 0);
}

function buildFxCombatEvent(prev, next, combatVpByPlayer, movedPlayers) {
  const roundEnded = next.round > prev.round || (!prev.terminal && next.terminal);
  if (!roundEnded || !prev.conflict) return null;
  const fighters = prev.players.filter((player) =>
    (player.troops?.conflict || 0) + (player.troops?.sandworms || 0) > 0);
  if (!fighters.length) return null;
  const places = fighters
    .slice()
    .sort((left, right) => right.troops.strength - left.troops.strength)
    .map((fighter) => {
      const current = next.players.find((candidate) => candidate.id === fighter.id);
      // Resource payouts can only be attributed cleanly when the fighter took
      // no further actions in this batch (otherwise space rewards mix in).
      const rewardsExact = !movedPlayers.has(fighter.id) && Boolean(current);
      const rewards = [];
      if (rewardsExact) {
        for (const [kind, valueOf] of FX_RESOURCE_KINDS) {
          const delta = valueOf(current) - valueOf(fighter);
          if (delta > 0) rewards.push({ kind, amount: delta });
        }
      }
      return {
        ...fxPlayerInfo(next, fighter.id),
        rank: 1 + fighters.filter(other => other.troops.strength > fighter.troops.strength).length,
        tied: fighters.filter(other => other.troops.strength === fighter.troops.strength).length > 1,
        strength: fighter.troops.strength,
        troops: fighter.troops.conflict,
        vp: combatVpByPlayer.get(fighter.id) || 0,
        rewards,
        rewardsExact,
      };
    });
  return {
    type: "combat_result",
    conflictName: prev.conflict.name,
    conflictImage: prev.conflict.image,
    places,
  };
}

// Assembles the play-out order: move events stay in log order, and each
// player's influence/alliance/VP changes are spliced in right after that
// player's last move so reactions follow their cause. A resolved combat is
// announced before the first agent placement of the new round.
function buildFxEvents(prev, next) {
  const moves = buildFxMoveEvents(prev, next);
  const movedPlayers = new Set(moves.map((move) => move.playerId));

  const diffsByPlayer = new Map();
  const diffsFor = (playerId) => {
    if (!diffsByPlayer.has(playerId)) diffsByPlayer.set(playerId, []);
    return diffsByPlayer.get(playerId);
  };
  for (const player of next.players) {
    const before = prev.players.find((candidate) => candidate.id === player.id);
    if (!before) continue;
    const info = fxPlayerInfo(next, player.id);
    for (const faction of FACTIONS) {
      const from = before.influence?.[faction] ?? 0;
      const to = player.influence?.[faction] ?? 0;
      if (to !== from) diffsFor(player.id).push({ ...info, type: "influence", faction, from, to });
    }
  }
  for (const faction of FACTIONS) {
    const from = prev.alliances?.[faction];
    const to = next.alliances?.[faction];
    if (to !== from && Number.isInteger(to) && to >= 0) {
      diffsFor(to).push({ ...fxPlayerInfo(next, to), type: "alliance", faction });
    }
  }
  const combatVpByPlayer = new Map();
  for (const player of next.players) {
    const before = prev.players.find((candidate) => candidate.id === player.id);
    if (!before) continue;
    const combatVp = fxVpSourceTotal(player, FX_COMBAT_VP_SOURCES) -
        fxVpSourceTotal(before, FX_COMBAT_VP_SOURCES);
    if (combatVp > 0) combatVpByPlayer.set(player.id, combatVp);
    const otherVp = (player.vp || 0) - (before.vp || 0) - Math.max(0, combatVp);
    if (otherVp !== 0) {
      diffsFor(player.id).push({ ...fxPlayerInfo(next, player.id), type: "vp", delta: otherVp });
    }
  }

  const combatEvent = buildFxCombatEvent(prev, next, combatVpByPlayer, movedPlayers);
  if (combatEvent) {
    // Combat VP for anyone outside the podium still deserves its VP pop.
    const placed = new Set(combatEvent.places.map((place) => place.playerId));
    for (const [playerId, vp] of combatVpByPlayer) {
      if (!placed.has(playerId)) {
        diffsFor(playerId).push({ ...fxPlayerInfo(next, playerId), type: "vp", delta: vp });
      }
    }
  } else {
    for (const [playerId, vp] of combatVpByPlayer) {
      diffsFor(playerId).push({ ...fxPlayerInfo(next, playerId), type: "vp", delta: vp });
    }
  }

  const queue = [];
  const appendDiffs = (playerId) => {
    const diffs = diffsByPlayer.get(playerId);
    if (!diffs) return;
    diffsByPlayer.delete(playerId);
    queue.push(...diffs);
  };
  let combatPending = Boolean(combatEvent);
  const appendCombat = () => {
    if (!combatPending) return;
    combatPending = false;
    queue.push(combatEvent);
    // Fighters who took no further actions get their influence/alliance
    // animations right after the announcement — those came from the combat.
    for (const place of combatEvent.places) {
      if (!movedPlayers.has(place.playerId)) appendDiffs(place.playerId);
    }
  };
  const lastMoveIndexByPlayer = new Map();
  moves.forEach((move, index) => lastMoveIndexByPlayer.set(move.playerId, index));
  moves.forEach((move, index) => {
    // The first agent placement in the batch starts the new round, so the
    // old round's combat must be announced before it.
    if (move.type === "agent") appendCombat();
    queue.push(move);
    if (lastMoveIndexByPlayer.get(move.playerId) === index) appendDiffs(move.playerId);
  });
  appendCombat();
  for (const playerId of [...diffsByPlayer.keys()]) appendDiffs(playerId);
  if (!prev.terminal && next.terminal && next.winners?.length) {
    queue.push({
      type: "victory",
      winners: next.winners.map((id) => fxPlayerInfo(next, id)),
    });
  }
  if (prev.shieldWallStanding && next.shieldWallStanding === false) {
    queue.push({ type: "wall" });
  }
  for (const player of next.players) {
    const before = prev.players.find(other => other.id === player.id);
    const worms = (player.troops?.sandworms || 0) - (before?.troops?.sandworms || 0);
    if (worms > 0) queue.push({ ...fxPlayerInfo(next, player.id), type: "worm", amount: worms });
    const loggedDeployments = moves.filter(move => move.playerId === player.id && move.type === "agent")
      .reduce((sum, move) => sum + move.troops, 0);
    const deployed = (player.troops?.conflict || 0) - (before?.troops?.conflict || 0) - loggedDeployments;
    if (next.round === prev.round && deployed > 0) {
      queue.push({ ...fxPlayerInfo(next, player.id), type: "deployment", troops: deployed });
    }
  }
  return queue;
}

function queueStateFx(prev, next) {
  if (!next || !prev || prev.sessionId !== next.sessionId) {
    resetFx();
    return;
  }
  if (fxSpeed === 0 || reducedMotionQuery.matches) return;
  const events = buildFxEvents(prev, next);
  // Register pending agent-marker reveals synchronously, before the render()
  // that follows setGameState, so the new discs start out hidden and only
  // appear when their placement animation lands.
  const combatPayoutPlayers = new Set();
  for (const event of events) {
    if (event.type === "agent") {
      const key = `${event.spaceKey}|${event.playerId}`;
      fxPendingAgentReveals.set(key, (fxPendingAgentReveals.get(key) || 0) + 1);
    } else if (event.type === "combat_result") {
      for (const place of event.places) {
        if (place.rewardsExact) combatPayoutPlayers.add(place.playerId);
      }
    }
  }
  // Defer until after the synchronous render() that follows setGameState so
  // position lookups see the new DOM.
  scheduleFx(() => {
    if (!gameState || gameState.sessionId !== next.sessionId) return;
    playResourceFx(prev, next, combatPayoutPlayers);
    if (events.length) {
      fxQueue.push(...events);
      updateFxBlocking();
      playNextFx();
    }
  }, 60);
}

function playNextFx() {
  if (fxPlaying) return;
  const event = fxQueue.shift();
  if (!event) {
    flushPendingAgentReveals();
    updateFxBlocking();
    return;
  }
  fxPlaying = true;
  updateFxBlocking();
  // Long queues (round upkeep, several bot turns) play faster.
  const factor = fxQueue.length >= 6 ? 0.55 : fxQueue.length >= 3 ? 0.75 : 1;
  let duration = 0;
  try {
    duration = playFxEvent(event, factor) || 0;
  } catch (error) {
    duration = 0;
  }
  advanceFxAfter(duration);
}

function advanceFxAfter(milliseconds) {
  clearTimeout(fxAdvanceTimer);
  fxAdvanceTimer = scheduleFx(() => {
    fxPlaying = false;
    playNextFx();
  }, milliseconds);
}

function playFxEvent(event, factor) {
  if (!gameState) return 0;
  switch (event.type) {
    case "agent": return playAgentFx(event, factor);
    case "intrigue": return playTacticFx(event, factor);
    case "acquire": return playAcquireFx(event, factor);
    case "reveal": return playRevealFx(event, factor);
    case "influence": return playInfluenceFx(event, factor);
    case "alliance": return playAllianceFx(event, factor);
    case "vp": return playVpFx(event, factor);
    case "combat_result": return playCombatResultFx(event, factor);
    case "victory": return playVictoryFx(event, factor);
    case "deployment": playTroopDeployFx(event, factor); return fxTime(450);
    case "wall":
      briefFx("The Shield Wall falls", "Shield Wall is now down", RESOURCE_ICONS.sandworm, "#d7aa6d", fxTime(1100));
      return fxTime(650);
    case "worm": {
      const rect = fxRect(`[data-combat-player="${event.playerId}"]`);
      if (rect) { const point = rectCenter(rect); spawnSparks(point.x, point.y, "#d7aa6d", 12); }
      briefFx(`${event.playerName} summons`, `${event.amount} sandworm${event.amount > 1 ? "s" : ""} deployed to the conflict`, RESOURCE_ICONS.sandworm, event.color, fxTime(1100));
      return fxTime(650);
    }
    default: return 0;
  }
}

function rectCenter(rect) {
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
}

function fxRect(selector) {
  const element = document.querySelector(selector);
  return element ? element.getBoundingClientRect() : null;
}

function spawnShowcase(options) {
  const element = document.createElement("div");
  element.className = `fx-showcase ${options.theme || ""}`;
  element.style.setProperty("--player-color", options.color || "var(--gold)");
  const imageHtml = options.image
    ? `<img class="${options.emblem ? "fx-showcase-emblem" : "fx-showcase-card"}" src="${escapeHtml(options.image)}" alt="">`
    : (options.caption ? `<div class="fx-showcase-card fx-card-fallback"><span>${escapeHtml(options.caption)}</span></div>` : "");
  element.innerHTML = `
    <div class="fx-showcase-header">
      ${options.leaderImage ? `<img class="fx-showcase-portrait" src="${escapeHtml(options.leaderImage)}" alt="">` : ""}
      <span>${escapeHtml(options.title)}</span>
    </div>
    ${imageHtml}
    ${options.caption && options.image && !options.emblem ? `<div class="fx-showcase-caption">${escapeHtml(options.caption)}</div>` : ""}
    ${options.subtitle ? `<div class="fx-showcase-footer">${escapeHtml(options.subtitle)}</div>` : ""}
  `;
  // Tap to dismiss and fast-forward to the next animation.
  element.addEventListener("pointerdown", () => {
    element.remove();
    advanceFxAfter(0);
  });
  fxLayer().appendChild(element);
  const duration = options.duration || fxTime(700);
  scheduleFx(() => element.classList.add("leaving"),
      Math.max(0, duration - fxTime(240)));
  scheduleFx(() => element.remove(), duration + 60);
  return element;
}

function briefFx(title, subtitle, image, color, duration) {
  const element = document.createElement("div");
  element.className = "fx-brief";
  element.style.setProperty("--player-color", color);
  element.innerHTML = `${image ? imageTag(image, "") : ""}<strong>${escapeHtml(title)}</strong><span>${escapeHtml(subtitle)}</span>`;
  fxLayer().appendChild(element);
  scheduleFx(() => element.classList.add("leaving"), Math.max(0, duration - 150));
  scheduleFx(() => element.remove(), duration);
}

function flyImage(src, fromRect, toRect, { duration = 0, delay = 0 } = {}) {
  if (!src || !fromRect || !toRect) return;
  if (!duration) duration = fxTime(750);
  const image = document.createElement("img");
  image.className = "fx-fly-card";
  image.src = src;
  fxLayer().appendChild(image);
  const from = rectCenter(fromRect);
  const to = rectCenter(toRect);
  const midX = (from.x + to.x) / 2;
  const midY = Math.min(from.y, to.y) - 80;
  image.animate([
    { transform: `translate(${from.x}px, ${from.y}px) translate(-50%, -50%) scale(0.45) rotate(-9deg)`, opacity: 0 },
    { transform: `translate(${midX}px, ${midY}px) translate(-50%, -50%) scale(1) rotate(4deg)`, opacity: 1, offset: 0.55 },
    { transform: `translate(${to.x}px, ${to.y}px) translate(-50%, -50%) scale(0.3) rotate(0deg)`, opacity: 0.9 },
  ], {
    duration,
    delay,
    easing: "cubic-bezier(0.3, 0.1, 0.3, 1)",
    fill: "both",
  }).onfinish = () => image.remove();
}

function spawnSparks(x, y, color, count = 10) {
  const layer = fxLayer();
  for (let index = 0; index < count; index += 1) {
    const spark = document.createElement("i");
    spark.className = "fx-spark";
    spark.style.background = color;
    spark.style.left = `${x}px`;
    spark.style.top = `${y}px`;
    layer.appendChild(spark);
    const angle = (Math.PI * 2 * index) / count + Math.random() * 0.7;
    const distance = 26 + Math.random() * 48;
    spark.animate([
      { transform: "translate(-50%, -50%) scale(1)", opacity: 1 },
      {
        transform: `translate(calc(-50% + ${Math.cos(angle) * distance}px), calc(-50% + ${Math.sin(angle) * distance}px)) scale(0)`,
        opacity: 0,
      },
    ], {
      duration: fxTime(550 + Math.random() * 350),
      easing: "cubic-bezier(0.2, 0.6, 0.3, 1)",
      fill: "forwards",
    }).onfinish = () => spark.remove();
  }
}

function floatText(x, y, html, className = "") {
  const element = document.createElement("div");
  element.className = `fx-float ${className}`;
  element.innerHTML = html;
  element.style.left = `${x}px`;
  element.style.top = `${y}px`;
  fxLayer().appendChild(element);
  element.animate([
    { transform: "translate(-50%, -50%) translateY(8px) scale(0.8)", opacity: 0 },
    { transform: "translate(-50%, -50%) translateY(-12px) scale(1)", opacity: 1, offset: 0.22 },
    { transform: "translate(-50%, -50%) translateY(-48px) scale(1)", opacity: 0 },
  ], { duration: fxTime(1500), easing: "ease-out", fill: "forwards" }).onfinish =
      () => element.remove();
}

function pulseSpace(spaceKey, color) {
  const tile = document.querySelector(`[data-space="${spaceKey}"]`);
  if (!tile) return;
  const rect = tile.getBoundingClientRect();
  const center = rectCenter(rect);
  const ring = document.createElement("div");
  ring.className = "fx-ring";
  ring.style.setProperty("--fx-color", color);
  ring.style.left = `${center.x}px`;
  ring.style.top = `${center.y}px`;
  ring.style.width = `${rect.width}px`;
  ring.style.height = `${rect.height}px`;
  fxLayer().appendChild(ring);
  scheduleFx(() => ring.remove(), fxTime(950));
  spawnSparks(center.x, center.y, color, 8);
}

// Unhides the disc for one pending placement and pops it in. Falls back to
// popping the player's last visible disc when nothing is pending (e.g. the
// reveals were flushed early).
function revealAgentMarker(spaceKey, playerId) {
  const key = `${spaceKey}|${playerId}`;
  const pending = fxPendingAgentReveals.get(key) || 0;
  if (pending > 1) {
    fxPendingAgentReveals.set(key, pending - 1);
  } else {
    fxPendingAgentReveals.delete(key);
  }
  const tile = document.querySelector(`[data-space="${spaceKey}"]`);
  if (!tile) return;
  const hidden = tile.querySelector(
      `.agents i.fx-hidden-marker[data-agent-player="${playerId}"]`);
  const marker = hidden ||
      [...tile.querySelectorAll(`.agents i[data-agent-player="${playerId}"]`)].pop();
  if (!marker) return;
  marker.classList.remove("fx-hidden-marker");
  marker.classList.add("fx-marker-pop");
}

function playAgentFx(event, factor) {
  if (event.troops > 0) playTroopDeployFx(event, factor);
  if (event.isHuman) {
    const card = resolveCard(["imperium", "other"], event.cardKey);
    flyImage(card.image, fxRect(".hand-fan"), fxRect(`[data-space="${event.spaceKey}"]`),
      { duration: fxTime(500) });
    revealAgentMarker(event.spaceKey, event.playerId);
    pulseSpace(event.spaceKey, event.color);
    return fxTime(320);
  }
  // Schedule the disc reveal first so it cannot get stuck hidden if a later
  // step of this animation throws; it lands together with the card flight.
  scheduleFx(() => {
    revealAgentMarker(event.spaceKey, event.playerId);
    pulseSpace(event.spaceKey, event.color);
  }, fxTime(420 * factor));
  const duration = fxTime(850 * factor);
  const card = resolveCard(["imperium", "other"], event.cardKey);
  const troopsText = event.troops
    ? publicText(` · ${event.troops} troop${event.troops === 1 ? "" : "s"}`)
    : "";
  briefFx(`${event.playerName} · ${card.name}`,
    `${spaceDisplayName(event.spaceKey)}${troopsText}`, event.leaderImage, event.color, duration);
  flyImage(
      card.image || event.leaderImage,
      fxRect(`[data-player-view="${event.playerId}"]`),
      fxRect(`[data-space="${event.spaceKey}"]`),
      { duration: fxTime(470 * factor), delay: fxTime(60 * factor) });
  return duration;
}

function playTacticFx(event, factor) {
  const duration = fxTime(850 * factor);
  const card = resolveCard(["intrigue"], event.cardKey);
  briefFx(`${event.isHuman ? "You play" : event.playerName + " plays"} ${card.name}`,
    event.mode === "combat" ? "Combat intrigue" : "Plot intrigue", RESOURCE_ICONS.intrigue, event.color, duration);
  return duration;
}

function playAcquireFx(event, factor) {
  const card = resolveCard(["imperium", "other"], event.cardKey);
  const plaqueRect = fxRect(`[data-player-view="${event.playerId}"]`);
  if (event.isHuman) {
    const sourceRect = fxRect(".acquire-row") || fxRect(".imperium-rail");
    flyImage(card.image, sourceRect, plaqueRect, { duration: fxTime(700) });
    if (plaqueRect) {
      const center = rectCenter(plaqueRect);
      spawnSparks(center.x, center.y, event.color, 10);
    }
    return fxTime(360);
  }
  const duration = fxTime(700 * factor);
  briefFx(`${event.playerName} acquires ${card.name}`,
    event.toTopDeck ? "Placed on top of the deck" : "Added to discard", event.leaderImage, event.color, duration);
  flyImage(card.image, fxRect(".imperium-rail") || fxRect(".acquire-row"), plaqueRect,
      { duration: fxTime(750 * factor), delay: fxTime(260 * factor) });
  return duration;
}

function playRevealFx(event, factor) {
  const rect = fxRect(`[data-player-view="${event.playerId}"]`);
  if (!rect) return 0;
  const toast = document.createElement("div");
  toast.className = "fx-toast";
  toast.style.setProperty("--player-color", event.color);
  toast.textContent = `${event.playerName} reveals`;
  toast.style.left = `${rect.left + rect.width / 2}px`;
  toast.style.top = `${rect.bottom + 14}px`;
  fxLayer().appendChild(toast);
  scheduleFx(() => toast.remove(), fxTime(1100));
  return fxTime(650 * factor);
}

function playInfluenceFx(event, factor) {
  const up = event.to > event.from;
  const duration = fxTime((up ? 950 : 700) * factor);
  const ladder = document.querySelector(`.faction-ladder.${event.faction}`);
  if (ladder) {
    ladder.classList.add("fx-ladder-glow");
    scheduleFx(() => ladder.classList.remove("fx-ladder-glow"), fxTime(1300));
  }
  const clamp = (level) => Math.max(0, Math.min(6, level));
  const fromRect = fxRect(`.faction-ladder.${event.faction} .ladder-rung.level-${clamp(event.from)}`);
  const toRect = fxRect(`.faction-ladder.${event.faction} .ladder-rung.level-${clamp(event.to)}`);
  if (fromRect && toRect) {
    const ghost = document.createElement("i");
    ghost.className = "fx-ghost-pawn";
    ghost.style.background = event.color;
    fxLayer().appendChild(ghost);
    const from = rectCenter(fromRect);
    const to = rectCenter(toRect);
    ghost.animate([
      { transform: `translate(${from.x}px, ${from.y}px) translate(-50%, -50%) scale(0.9)`, opacity: 0.15 },
      { transform: `translate(${to.x}px, ${to.y}px) translate(-50%, -50%) scale(1.25)`, opacity: 0.95 },
    ], {
      duration: fxTime(650 * factor),
      easing: "cubic-bezier(0.3, 0.7, 0.2, 1.15)",
      fill: "both",
    }).onfinish = () => {
      ghost.remove();
      if (up) spawnSparks(to.x, to.y, event.color, 7);
    };
  }
  if (toRect) {
    const delta = event.to - event.from;
    floatText(
        toRect.right + 34,
        rectCenter(toRect).y,
        `${delta > 0 ? "+" : "−"}${Math.abs(delta)} ${escapeHtml(FACTION_LABELS[event.faction])}`,
        delta > 0 ? "gain" : "loss");
  }
  document.querySelector(
      `.faction-ladder.${event.faction} .ladder-rung.level-${clamp(event.to)} .rung-markers i:nth-child(${event.playerId + 1})`)
    ?.classList.add("fx-marker-pop");
  return duration;
}

function playAllianceFx(event, factor) {
  const duration = fxTime(1900 * factor);
  const tokenRect = fxRect(`.faction-ladder.${event.faction} .alliance-token`);
  if (tokenRect) {
    const center = rectCenter(tokenRect);
    spawnSparks(center.x, center.y, event.color, 14);
    spawnSparks(center.x, center.y, "#f2d28b", 8);
  }
  spawnShowcase({
    ...event,
    theme: "fx-alliance",
    emblem: true,
    title: `${event.playerName} forges an Alliance!`,
    image: FACTION_ICONS[event.faction],
    subtitle: `${FACTION_LABELS[event.faction]} Alliance — worth 1 VP while held`,
    duration,
  });
  return duration;
}

function playVpFx(event, factor) {
  const medallion = document.querySelector(`[data-player-view="${event.playerId}"] .vp-medallion`);
  if (medallion) {
    medallion.classList.add("fx-vp-pop");
    scheduleFx(() => medallion.classList.remove("fx-vp-pop"), fxTime(1000));
    const rect = medallion.getBoundingClientRect();
    const center = rectCenter(rect);
    spawnSparks(center.x, center.y, "#f2d28b", 12);
    // The medallion hugs the plaque's left edge; spawn the float inward so it
    // is not clipped by the viewport for left-column plaques.
    floatText(center.x + 52, center.y - 12, `${event.delta > 0 ? "+" : "−"}${Math.abs(event.delta)} VP`, event.delta > 0 ? "gain vp" : "loss vp");
  }
  return fxTime(850 * factor);
}

function playVictoryFx(event) {
  const layer = fxLayer();
  const colors = ["#f2d28b", "#d8b35e", ...event.winners.map((winner) => winner.color)];
  for (let index = 0; index < 90; index += 1) {
    const confetti = document.createElement("i");
    confetti.className = "fx-confetti";
    confetti.style.background = colors[index % colors.length];
    confetti.style.left = `${Math.random() * 100}%`;
    layer.appendChild(confetti);
    confetti.animate([
      { transform: "translateY(-30px) rotate(0deg)", opacity: 1 },
      {
        transform: `translateY(${window.innerHeight + 60}px) rotate(${360 + Math.random() * 540}deg)`,
        opacity: 0.85,
      },
    ], {
      duration: fxTime(2200 + Math.random() * 1800),
      delay: fxTime(Math.random() * 900),
      easing: "cubic-bezier(0.3, 0.4, 0.6, 1)",
      fill: "forwards",
    }).onfinish = () => confetti.remove();
  }
  const winner = event.winners[0];
  spawnShowcase({
    ...winner,
    theme: "fx-victory",
    title: "Victory!",
    image: winner?.leaderImage,
    caption: event.winners.map((item) => item.playerName).join(" & "),
    subtitle: publicText("The Imperium endures"),
    duration: fxTime(3200),
  });
  return fxTime(3200);
}

// Small resource/VP token arcing between two points (combat payouts).
function flyIcon(src, from, to, { duration = 0, delay = 0 } = {}) {
  if (!src || !from || !to) return;
  if (!duration) duration = fxTime(650);
  const icon = document.createElement("img");
  icon.className = "fx-fly-icon";
  icon.src = src;
  fxLayer().appendChild(icon);
  const midX = (from.x + to.x) / 2;
  const midY = Math.min(from.y, to.y) - 46;
  icon.animate([
    { transform: `translate(${from.x}px, ${from.y}px) translate(-50%, -50%) scale(0.5)`, opacity: 0 },
    { transform: `translate(${midX}px, ${midY}px) translate(-50%, -50%) scale(1.15)`, opacity: 1, offset: 0.5 },
    { transform: `translate(${to.x}px, ${to.y}px) translate(-50%, -50%) scale(0.6)`, opacity: 0.9 },
  ], {
    duration,
    delay,
    easing: "cubic-bezier(0.3, 0.1, 0.3, 1)",
    fill: "both",
  }).onfinish = () => icon.remove();
}

// Troop disc arcing from a player's plaque into the conflict zone.
function flyTroop(color, from, to, { duration = 0, delay = 0 } = {}) {
  if (!from || !to) return;
  if (!duration) duration = fxTime(600);
  const troop = document.createElement("i");
  troop.className = "fx-fly-troop";
  troop.style.background = color;
  fxLayer().appendChild(troop);
  const lift = 60 + Math.random() * 50;
  const midX = (from.x + to.x) / 2 + (Math.random() - 0.5) * 40;
  const midY = Math.min(from.y, to.y) - lift;
  const endX = to.x + (Math.random() - 0.5) * 26;
  const endY = to.y + (Math.random() - 0.5) * 10;
  troop.animate([
    { transform: `translate(${from.x}px, ${from.y}px) translate(-50%, -50%) scale(0.5)`, opacity: 0 },
    { transform: `translate(${midX}px, ${midY}px) translate(-50%, -50%) scale(1.2)`, opacity: 1, offset: 0.5 },
    { transform: `translate(${endX}px, ${endY}px) translate(-50%, -50%) scale(0.85)`, opacity: 1 },
  ], {
    duration,
    delay,
    easing: "cubic-bezier(0.35, 0.1, 0.3, 1)",
    fill: "both",
  }).onfinish = () => {
    spawnSparks(endX, endY, color, 4);
    troop.remove();
  };
}

// Deployed crews stream out of the player's plaque into their row of the
// conflict panel, one at a time in quick succession, timed so the first
// crew launches as the played card lands on its space.
function playTroopDeployFx(event, factor) {
  const plaqueRect = fxRect(`[data-garrison-player="${event.playerId}"]`) ||
      fxRect(`[data-player-view="${event.playerId}"]`);
  const targetRect = fxRect(`[data-combat-player="${event.playerId}"]`) ||
      fxRect(".conflict-panel");
  if (!plaqueRect || !targetRect) return;
  const from = {
    x: plaqueRect.right - 16,
    y: plaqueRect.top + plaqueRect.height * 0.5,
  };
  const to = rectCenter(targetRect);
  const count = Math.min(event.troops, 8);
  for (let index = 0; index < count; index += 1) {
    flyTroop(event.color, from, to, {
      duration: fxTime(620 * factor),
      delay: fxTime((180 + 75 * index) * factor),
    });
  }
}

const FX_COMBAT_RANK_LABELS = ["1st", "2nd", "3rd"];

function playCombatResultFx(event, factor) {
  const duration = fxTime((2300 + 500 * event.places.length) * factor);
  const element = document.createElement("div");
  element.className = "fx-showcase fx-combat-result";
  element.innerHTML = `
    <div class="fx-showcase-header">
      ${imageTag(RESOURCE_ICONS.sword, "Combat", "fx-showcase-portrait")}
      <span>Combat resolved — ${escapeHtml(event.conflictName)}</span>
    </div>
    <div class="fx-combat-places">
      ${event.places.map((place, index) => `
        <div class="fx-combat-place rank-${index + 1}"
             style="--player-color:${place.color}; animation-delay: ${fxTime(180 * (index + 1) * factor)}ms">
          <b class="fx-combat-rank">${place.tied ? "Tied " : ""}${FX_COMBAT_RANK_LABELS[place.rank - 1] || `${place.rank}th`}</b>
          ${place.leaderImage
            ? `<img class="fx-combat-portrait" src="${escapeHtml(place.leaderImage)}" alt="">`
            : ""}
          <span class="fx-combat-name">${escapeHtml(place.playerName)}</span>
          <span class="fx-combat-strength" title="${escapeHtml(publicText("Combat swords"))}">
            ${iconTag("sword", publicText("Swords"))}${place.strength}
          </span>
          <span class="fx-combat-payout">
            ${place.vp ? `
              <span class="fx-combat-chip vp">
                ${iconTag("vp", "VP")}+${place.vp}
              </span>
            ` : ""}
            ${place.rewards.map((reward) => `
              <span class="fx-combat-chip">
                ${iconTag(reward.kind, reward.kind)}+${reward.amount}
              </span>
            `).join("")}
            ${!place.vp && !place.rewards.length && place.rewardsExact
              ? `<span class="fx-combat-chip none">—</span>`
              : ""}
          </span>
        </div>
      `).join("")}
    </div>
  `;
  element.addEventListener("pointerdown", () => {
    element.remove();
    advanceFxAfter(0);
  });
  fxLayer().appendChild(element);
  scheduleFx(() => element.classList.add("leaving"), Math.max(0, duration - fxTime(240)));
  scheduleFx(() => element.remove(), duration + 60);

  // Payouts fly from each podium row to the player's plaque, staggered.
  const rows = element.querySelectorAll(".fx-combat-place");
  event.places.forEach((place, index) => {
    const row = rows[index];
    const baseDelay = fxTime((700 + 420 * index) * factor);
    scheduleFx(() => {
      if (!row.isConnected) return;
      const from = rectCenter(row.getBoundingClientRect());
      if (place.vp > 0) {
        const medallion = document.querySelector(
            `[data-player-view="${place.playerId}"] .vp-medallion`);
        if (medallion) {
          const to = rectCenter(medallion.getBoundingClientRect());
          flyIcon(RESOURCE_ICONS.vp, from, to);
          scheduleFx(() => {
            medallion.classList.add("fx-vp-pop");
            scheduleFx(() => medallion.classList.remove("fx-vp-pop"), fxTime(1000));
            spawnSparks(to.x, to.y, "#f2d28b", 10);
            floatText(to.x + 52, to.y - 12, `+${place.vp} VP`, "gain vp");
          }, fxTime(650));
        }
      }
      const plaqueRect = fxRect(`[data-player-view="${place.playerId}"]`);
      place.rewards.forEach((reward, rewardIndex) => {
        if (!plaqueRect) return;
        const to = {
          x: plaqueRect.left + plaqueRect.width * 0.7,
          y: plaqueRect.top + plaqueRect.height * 0.5,
        };
        flyIcon(RESOURCE_ICONS[reward.kind], from, to,
            { delay: fxTime(140 * (rewardIndex + 1)) });
        scheduleFx(() => floatText(
            to.x,
            to.y,
            `${iconTag(reward.kind, reward.kind)}+${reward.amount}`,
            "gain"), fxTime(140 * (rewardIndex + 1) + 650));
      });
    }, baseDelay);
  });
  return duration;
}

const FX_RESOURCE_KINDS = [
  ["spice", (player) => player.resources.spice],
  ["water", (player) => player.resources.water],
  ["solari", (player) => player.resources.solari],
  ["intrigue", (player) => player.resources.intrigue],
  ["troop", (player) => player.troops.garrison],
];

// Resource gains/losses float off the plaques in parallel with the queued
// showcases; they are ambient rather than sequenced. Players whose gains are
// combat payouts are excluded — the combat announcement animates those.
function playResourceFx(prev, next, combatPayoutPlayers = new Set()) {
  for (const player of next.players) {
    const before = prev.players.find((candidate) => candidate.id === player.id);
    if (!before) continue;
    const rect = fxRect(`[data-player-view="${player.id}"]`);
    if (!rect) continue;
    let slot = 0;
    for (const [kind, valueOf] of FX_RESOURCE_KINDS) {
      const delta = valueOf(player) - valueOf(before);
      if (!delta) continue;
      const gain = delta > 0;
      if (gain && combatPayoutPlayers.has(player.id)) continue;
      const x = rect.left + rect.width * 0.7;
      const y = rect.top + rect.height * 0.5;
      scheduleFx(() => floatText(
          x,
          y,
          `${iconTag(kind, kind)}${gain ? "+" : "−"}${Math.abs(delta)}`,
          gain ? "gain" : "loss"), slot * fxTime(170));
      slot += 1;
    }
  }
}

document.addEventListener("keydown", (event) => {
  if (!gameState) return;
  if (event.key === "Escape") {
    if (document.querySelector(".card-inspector[open]")) return;
    if (fxPlaying || fxQueue.length) resetFx();
    if (playerViewId !== null) {
      playerViewId = null;
      event.preventDefault();
      render();
      return;
    }
    if (isAcquirePhase() && !acquireOverlayHidden) {
      acquireOverlayHidden = true;
      event.preventDefault();
      render();
      return;
    }
    if (cancelAgentMoveSelection()) {
      event.preventDefault();
      render();
    }
    return;
  }
  if (playerViewId === null) return;
  if (event.key === "ArrowLeft") {
    stepPlayerView(-1);
  } else if (event.key === "ArrowRight") {
    stepPlayerView(1);
  }
});

// Debug hooks for scripted UI testing (drive games from the console).
window.duneDebug = {
  applyAction,
  state: () => gameState,
  startGame,
};

renderStartScreen();
