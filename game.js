
"use strict";

if (typeof TEXT_CONTENT === "undefined") {
  throw new Error("TEXT_CONTENT failed to load. Include text-content.js before game.js.");
}

const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 360;
const GROUND_Y = 292;

// Trailer-only shortcuts are isolated behind this constant; normal play must stay unchanged.
const TRAILER_MODE = false;
const CINEMATIC_CAPTURE_MODE = false;
const SETTINGS_STORAGE_KEY = "voynich.settings.v1";

const GAMEPLAY_TARGET = Object.freeze({
  NORMAL_MINUTES: 20,
  NORMAL_MAX_MINUTES: 25,
  TRAILER_TASK_SCALE: 0.35,
});

const AUDIO_LIBRARY = Object.freeze({
  music: Object.freeze({
    titleTheme: "assets/audio/title-music.mp3",
    corridorTheme: "assets/audio/archive-room-tone.mp3",
    archivePulse: "assets/audio/archive-room-tone.mp3",
    archiveTension: "assets/audio/archive-room-tone.mp3",
    manuscriptRise: "assets/audio/distorted-corridor-tone.mp3",
    distortedPulse: "assets/audio/distorted-corridor-tone.mp3",
    endingTheme: "assets/audio/ending-music.mp3",
  }),

  ambience: Object.freeze({
    corridorRoomTone: "assets/audio/archive-room-tone.mp3",
    archiveRoomTone: "assets/audio/archive-room-tone.mp3",
    archiveFluorescentHum: "assets/audio/archive-room-tone.mp3",
    distortedCorridorTone: "assets/audio/distorted-corridor-tone.mp3",
    reverseElectricalHum: "assets/audio/distorted-corridor-tone.mp3",
    exteriorAmbience: "assets/audio/archive-room-tone.mp3",
  }),

  sfx: Object.freeze({
    flashlightToggle: "assets/audio/flashlight-toggle.mp3",
    debugToggle: "assets/audio/ui-click.mp3",
    interactionPrompt: "assets/audio/ui-click.mp3",
    dialogueTick: "assets/audio/dialogue-tick.mp3",

    journalOpen: "assets/audio/paper-movement.mp3",
    journalClose: "assets/audio/paper-movement.mp3",

    uiMove: "assets/audio/ui-click.mp3",
    uiSelect: "assets/audio/ui-click.mp3",
    uiBack: "assets/audio/ui-click.mp3",
    fullscreenToggle: "assets/audio/ui-click.mp3",

    clueCollected: "assets/audio/success.mp3",
    lockedDoor: "assets/audio/locked-door.mp3",
    keypadButton: "assets/audio/ui-click.mp3",
    wrongCode: "assets/audio/wrong.mp3",
    correctCode: "assets/audio/success.mp3",
    powerReturn: "assets/audio/success.mp3",
    archiveDoorUnlock: "assets/audio/success.mp3",
    archiveDoorOpen: "assets/audio/metal-creak.mp3",

    shelfCreak: "assets/audio/metal-creak.mp3",
    paperMove: "assets/audio/paper-movement.mp3",
    drawerOpen: "assets/audio/metal-creak.mp3",
    drawerClose: "assets/audio/metal-creak.mp3",
    filingCabinetLock: "assets/audio/locked-door.mp3",
    ladderMove: "assets/audio/metal-creak.mp3",
    distantMetallicImpact: "assets/audio/heavy-impact.mp3",
    accessCardBeep: "assets/audio/ui-click.mp3",

    manuscriptLightActivation: "assets/audio/glitch.mp3",
    fluorescentHum: "assets/audio/archive-room-tone.mp3",
    bookOpen: "assets/audio/paper-movement.mp3",
    pageMovement: "assets/audio/paper-movement.mp3",
    paperFragmentPickup: "assets/audio/paper-movement.mp3",
    fragmentPlacement: "assets/audio/success.mp3",

    symbolTone: "assets/audio/ui-click.mp3",
    incorrectPuzzle: "assets/audio/wrong.mp3",
    stageCompletion: "assets/audio/success.mp3",
    ringRotation: "assets/audio/metal-creak.mp3",
    finalAlignment: "assets/audio/success.mp3",

    glitchBurst: "assets/audio/glitch.mp3",
    silenceBeforeRealityChange: "assets/audio/glitch.mp3",
    distantFootsteps: "assets/audio/distant-footsteps.mp3",
    corridorLoop: "assets/audio/glitch.mp3",
    falseDoor: "assets/audio/glitch.mp3",
    wallSwitch: "assets/audio/ui-click.mp3",
    passageOpenBass: "assets/audio/heavy-impact.mp3",
    finalPageReveal: "assets/audio/success.mp3",

    electricalHum: "assets/audio/archive-room-tone.mp3",
    lightFlicker: "assets/audio/glitch.mp3",
    circuitSwitch: "assets/audio/ui-click.mp3",
    circuitWrong: "assets/audio/wrong.mp3",

    ladderWheel: "assets/audio/metal-creak.mp3",
    ladderLock: "assets/audio/locked-door.mp3",
    ladderClimb: "assets/audio/metal-creak.mp3",

    ringFailure: "assets/audio/wrong.mp3",
    ringSuccess: "assets/audio/success.mp3",

    archivistAppear: "assets/audio/glitch.mp3",
    corruptedNode: "assets/audio/glitch.mp3",
    stabilityHit: "assets/audio/player-hurt.mp3",
    bossPhase: "assets/audio/boss-windup.mp3",
    archiveShutdown: "assets/audio/glitch.mp3",
    bossWindup: "assets/audio/boss-windup.mp3",
    recordSlash: "assets/audio/metal-creak.mp3",
    inkProjectile: "assets/audio/glitch.mp3",
    spikeWarning: "assets/audio/glitch.mp3",
    archivistHit: "assets/audio/boss-hit.mp3",
    archivistTeleport: "assets/audio/glitch.mp3",
    archivistBlocked: "assets/audio/wrong.mp3",
    chargeEmpty: "assets/audio/wrong.mp3",
    chargedBeam: "assets/audio/charged-flashlight-beam.mp3",
    archivistDefeat: "assets/audio/archivist-defeat.mp3",

    escapeSequence: "assets/audio/glitch.mp3",
    finalNotification: "assets/audio/final-notification.mp3",
    cameraShutter: "assets/audio/ui-click.mp3",
    recordContradiction: "assets/audio/glitch.mp3",
    classroomShift: "assets/audio/glitch.mp3",
    debrisWarning: "assets/audio/glitch.mp3",
    debrisImpact: "assets/audio/heavy-impact.mp3",
    cameraDrop: "assets/audio/camera-drop.mp3",
  }),
});

const AUDIO_VOLUME_DEFAULTS = Object.freeze({
  master: 0.8,
  music: 0.72,
  ambience: 0.64,
  sfx: 0.8,
});

const AUDIO_MIX_DEFAULTS = Object.freeze({
  music: 0.22,
  ambience: 0.22,
  ui: 0.35,
  effect: 0.5,
  combat: 0.65,
  dialogueTick: 0.12,
});
const INTERACTION_PROMPT_VOLUME = 0.12;
const DIALOGUE_TICK_INTERVAL_CHARACTERS = 3;

const AUDIO_SFX_COOLDOWNS = Object.freeze({
  lockedDoor: 0.35,
  archivistBlocked: 0.45,
  chargeEmpty: 0.35,
  bossWindup: 2.75,
  bossPhase: 1.2,
  wrongCode: 0.22,
  incorrectPuzzle: 0.25,
  ringFailure: 0.25,
  circuitWrong: 0.25,
});

const AUDIO_UI_SFX = new Set([
  "flashlightToggle",
  "debugToggle",
  "interactionPrompt",
  "dialogueTick",
  "uiMove",
  "uiSelect",
  "uiBack",
  "fullscreenToggle",
  "keypadButton",
  "accessCardBeep",
  "symbolTone",
  "wallSwitch",
  "circuitSwitch",
  "cameraShutter",
]);

const AUDIO_COMBAT_SFX = new Set([
  "archivistHit",
  "archivistBlocked",
  "stabilityHit",
  "bossPhase",
  "bossWindup",
  "recordSlash",
  "inkProjectile",
  "spikeWarning",
  "chargeEmpty",
  "archivistDefeat",
  "debrisWarning",
  "debrisImpact",
  "cameraDrop",
]);

const DEFAULT_SETTINGS = Object.freeze({
  masterVolume: AUDIO_VOLUME_DEFAULTS.master,
  musicVolume: AUDIO_VOLUME_DEFAULTS.music,
  ambienceVolume: AUDIO_VOLUME_DEFAULTS.ambience,
  sfxVolume: AUDIO_VOLUME_DEFAULTS.sfx,
  textSpeed: 48,
  screenShake: true,
  grainIntensity: 0.7,
});

const TITLE_MENU_ACTIONS = Object.freeze({
  START: "start",
  CONTINUE: "continue",
  PRESENTATION: "presentation",
  SETTINGS: "settings",
  CREDITS: "credits",
  EXIT: "exit",
});

const PRESENTATION_MENU_ACTIONS = Object.freeze({
  LOAD_SECTION: "loadSection",
  RUN_FULL: "runFull",
  BACK_TO_TITLE: "backToTitle",
  RESTART_CURRENT: "restartCurrent",
  NEXT_SECTION: "nextSection",
  PREVIOUS_SECTION: "previousSection",
  RESUME_SECTION: "resumeSection",
});

const PRESENTATION_UI = Object.freeze({
  SAFE_X: 32,
  SAFE_Y: 24,
  MENU_WIDTH: 504,
  MENU_HEIGHT: 312,
  MENU_PADDING_X: 28,
  MENU_PADDING_Y: 18,
  CARD_MAX_WIDTH: 472,
  CARD_PADDING_X: 30,
  CARD_PADDING_Y: 24,
  TITLE_FONT: "20px monospace",
  CARD_TITLE_FONT: "21px monospace",
  BODY_FONT: "12px monospace",
  BUTTON_FONT: "10px monospace",
  SMALL_FONT: "9px monospace",
  INDICATOR_FONT: "10px monospace",
  PROMPT_SECONDS: 2.2,
});

const SETTINGS_ITEMS = Object.freeze([
  Object.freeze({ id: "masterVolume", label: TEXT_CONTENT.settings.items.masterVolume, type: "range", min: 0, max: 1, step: 0.05 }),
  Object.freeze({ id: "musicVolume", label: TEXT_CONTENT.settings.items.musicVolume, type: "range", min: 0, max: 1, step: 0.05 }),
  Object.freeze({ id: "ambienceVolume", label: TEXT_CONTENT.settings.items.ambienceVolume, type: "range", min: 0, max: 1, step: 0.05 }),
  Object.freeze({ id: "sfxVolume", label: TEXT_CONTENT.settings.items.sfxVolume, type: "range", min: 0, max: 1, step: 0.05 }),
  Object.freeze({ id: "textSpeed", label: TEXT_CONTENT.settings.items.textSpeed, type: "range", min: 24, max: 90, step: 6 }),
  Object.freeze({ id: "screenShake", label: TEXT_CONTENT.settings.items.screenShake, type: "toggle" }),
  Object.freeze({ id: "grainIntensity", label: TEXT_CONTENT.settings.items.grainIntensity, type: "range", min: 0, max: 1, step: 0.1 }),
  Object.freeze({ id: "fullscreen", label: TEXT_CONTENT.settings.items.fullscreen, type: "action" }),
  Object.freeze({ id: "back", label: TEXT_CONTENT.settings.items.back, type: "action" }),
]);

const ENDING_MENU_ACTIONS = Object.freeze({
  RESTART: "restart",
  TITLE: "title",
});

const WORLD = Object.freeze({
  WIDTH: 2320,
  CAMERA_LEFT_BOUNDARY: 0,
  CAMERA_RIGHT_BOUNDARY: 2320,
  PLAYER_LEFT_BOUNDARY: 36,
  PLAYER_RIGHT_BOUNDARY: 2280,
});

const ARCHIVE_WORLD = Object.freeze({
  WIDTH: 1840,
  CAMERA_LEFT_BOUNDARY: 0,
  CAMERA_RIGHT_BOUNDARY: 1840,
  PLAYER_LEFT_BOUNDARY: 40,
  PLAYER_RIGHT_BOUNDARY: 1768,
  ENTRANCE_X: 86,
  CORRIDOR_RETURN_X: 2118,
});

const PLAYER_CONFIG = Object.freeze({
  SPAWN_X: 144,
  SPAWN_Y: GROUND_Y - 48,
  WIDTH: 24,
  HEIGHT: 48,
  SPEED: 148,
  ACCELERATION: 1240,
  DECELERATION: 1520,
  WALK_FRAME_TIME: 0.11,
  IDLE_FRAME_TIME: 0.58,
  INTERACTION_FRAME_TIME: 0.18,
});

const CAMERA_CONFIG = Object.freeze({
  FOLLOW_SPEED: 13,
});

const CORRIDOR = Object.freeze({
  CEILING_HEIGHT: 68,
  WALL_Y: 68,
  FLOOR_Y: GROUND_Y,
  VANISH_X: 332,
  VANISH_Y: 132,
  LIGHTS: Object.freeze([
    { x: 328, phase: 0.2 },
    { x: 1104, phase: 2.7 },
    { x: 1856, phase: 4.3 },
  ]),
  SUPPORTS: Object.freeze([40, 368, 696, 1024, 1352, 1680, 2008, 2272]),
  STAINS: Object.freeze([
    { x: 148, y: 180, w: 54, h: 18 },
    { x: 512, y: 116, w: 38, h: 48 },
    { x: 845, y: 206, w: 72, h: 14 },
    { x: 1326, y: 150, w: 46, h: 35 },
    { x: 1740, y: 212, w: 88, h: 18 },
    { x: 2050, y: 118, w: 42, h: 52 },
  ]),
  PAPERS: Object.freeze([
    { x: 252, y: 316, w: 16, h: 6, shade: "#918b7e" },
    { x: 448, y: 340, w: 22, h: 8, shade: "#777268" },
    { x: 730, y: 324, w: 12, h: 6, shade: "#a8a092" },
    { x: 956, y: 346, w: 24, h: 6, shade: "#80796f" },
    { x: 1284, y: 318, w: 18, h: 8, shade: "#9b9486" },
    { x: 1580, y: 336, w: 14, h: 6, shade: "#6f6a62" },
    { x: 1916, y: 312, w: 26, h: 8, shade: "#8f897e" },
    { x: 2074, y: 346, w: 16, h: 6, shade: "#aaa293" },
  ]),
  WARNINGS: Object.freeze([
    { x: 260, y: 138, label: TEXT_CONTENT.corridor.signs.lab },
    { x: 872, y: 106, label: TEXT_CONTENT.corridor.signs.year },
    { x: 1510, y: 154, label: TEXT_CONTENT.corridor.signs.noEntry },
  ]),
  SHELVES: Object.freeze([
    { x: 628, y: 178, w: 126, h: 76 },
    { x: 1458, y: 174, w: 142, h: 82 },
  ]),
  DOOR_X: 2192,
  DOOR_Y: 144,
  DOOR_WIDTH: 92,
  DOOR_HEIGHT: 148,
});

const ARCHIVE_ROOM = Object.freeze({
  CEILING_HEIGHT: 60,
  FLOOR_Y: GROUND_Y,
  VANISH_X: 320,
  VANISH_Y: 122,
  ENTRANCE_X: 38,
  LADDER_MIN_X: 278,
  LADDER_MAX_X: 1356,
  LADDER_START_X: 364,
  LADDER_TARGET_X: 950,
  HIGH_SHELF_X: 968,
  TABLE_X: 1478,
  TABLE_Y: 228,
  TABLE_WIDTH: 148,
  TABLE_HEIGHT: 50,
  DUST_COUNT: 56,
  DEEP_SHELVES: Object.freeze([170, 380, 590, 800, 1010, 1220, 1430, 1640]),
  FOREGROUND_SHELVES: Object.freeze([
    { x: 244, y: 110, w: 138, h: 178, mark: "A-02" },
    { x: 572, y: 104, w: 154, h: 184, mark: "C-11" },
    { x: 890, y: 106, w: 156, h: 184, mark: "C13" },
    { x: 1204, y: 98, w: 166, h: 192, mark: "R-06" },
  ]),
  FILING_CABINETS: Object.freeze([
    { x: 1324, y: 202, w: 94, h: 86 },
    { x: 1420, y: 210, w: 84, h: 78 },
  ]),
  FOLDERS: Object.freeze([
    { x: 430, y: 330, w: 34, h: 8 },
    { x: 748, y: 318, w: 42, h: 10 },
    { x: 1024, y: 338, w: 30, h: 8 },
    { x: 1512, y: 324, w: 38, h: 10 },
    { x: 1660, y: 344, w: 48, h: 8 },
  ]),
});

const ARCHIVE_SHELF_SEARCHES = Object.freeze({
  personnelTransfer: Object.freeze({
    shelfId: "personnelTransfer",
    mark: "A-02",
    clueId: "shelfPersonnelRecord",
    title: TEXT_CONTENT.archive.shelfSearches.personnelTransfer.title,
    text: TEXT_CONTENT.archive.shelfSearches.personnelTransfer.text,
    useful: true,
  }),
  waterDamage: Object.freeze({
    shelfId: "waterDamage",
    mark: "C-11",
    clueId: "shelfAtmosphericRecord",
    title: TEXT_CONTENT.archive.shelfSearches.waterDamage.title,
    text: TEXT_CONTENT.archive.shelfSearches.waterDamage.text,
    useful: false,
  }),
  restrictedAccess: Object.freeze({
    shelfId: "restrictedAccess",
    mark: "C13",
    clueId: "shelfAccessRecord",
    title: TEXT_CONTENT.archive.shelfSearches.restrictedAccess.title,
    text: TEXT_CONTENT.archive.shelfSearches.restrictedAccess.text,
    useful: true,
  }),
});

const MANUSCRIPT_STAGES = Object.freeze({
  RECONSTRUCT: "reconstruct",
  PATTERN: "pattern",
  SYMBOLS: "symbols",
  ALIGNMENT: "alignment",
  SOLVED: "solved",
});

const MANUSCRIPT_VIEW = Object.freeze({
  PAGE_X: 30,
  PAGE_Y: 50,
  PAGE_WIDTH: 356,
  PAGE_HEIGHT: 278,
  BOARD_X: 46,
  BOARD_Y: 66,
  BOARD_WIDTH: 324,
  BOARD_HEIGHT: 244,
  OUTLINE_X: 100,
  OUTLINE_Y: 76,
  OUTLINE_WIDTH: 212,
  OUTLINE_HEIGHT: 174,
  PANEL_X: 410,
  PANEL_Y: 58,
  PANEL_WIDTH: 214,
  PANEL_HEIGHT: 244,
  BUTTON_HEIGHT: 26,
  SNAP_DISTANCE: 24,
  RING_CENTER_X: 300,
  RING_CENTER_Y: 182,
});

const MANUSCRIPT_FRAGMENTS = Object.freeze([
  Object.freeze({
    id: "upperLeft",
    label: TEXT_CONTENT.manuscript.fragments.upperLeft,
    startX: 58,
    startY: 92,
    targetX: 108,
    targetY: 84,
    width: 88,
    height: 68,
    rotation: 1,
    targetRotation: 0,
    mark: "eye",
  }),
  Object.freeze({
    id: "upperRight",
    label: TEXT_CONTENT.manuscript.fragments.upperRight,
    startX: 244,
    startY: 82,
    targetX: 196,
    targetY: 88,
    width: 100,
    height: 64,
    rotation: 3,
    targetRotation: 0,
    mark: "spiral",
  }),
  Object.freeze({
    id: "lowerLeft",
    label: TEXT_CONTENT.manuscript.fragments.lowerLeft,
    startX: 62,
    startY: 210,
    targetX: 112,
    targetY: 152,
    width: 86,
    height: 82,
    rotation: 2,
    targetRotation: 0,
    mark: "brokenSquare",
  }),
  Object.freeze({
    id: "lowerRight",
    label: TEXT_CONTENT.manuscript.fragments.lowerRight,
    startX: 248,
    startY: 204,
    targetX: 198,
    targetY: 152,
    width: 96,
    height: 82,
    rotation: 1,
    targetRotation: 0,
    mark: "verticalLine",
  }),
]);

const MANUSCRIPT_SYMBOLS = Object.freeze([
  Object.freeze({
    id: "staff",
    label: TEXT_CONTENT.manuscript.symbols.staff.label,
    classLabel: TEXT_CONTENT.manuscript.symbols.staff.classLabel,
    clueId: "shelfPersonnelRecord",
    hint: TEXT_CONTENT.manuscript.symbols.staff.hint,
  }),
  Object.freeze({
    id: "maintenance",
    label: TEXT_CONTENT.manuscript.symbols.maintenance.label,
    classLabel: TEXT_CONTENT.manuscript.symbols.maintenance.classLabel,
    clueId: "shelfAtmosphericRecord",
    hint: TEXT_CONTENT.manuscript.symbols.maintenance.hint,
  }),
  Object.freeze({
    id: "restricted",
    label: TEXT_CONTENT.manuscript.symbols.restricted.label,
    classLabel: TEXT_CONTENT.manuscript.symbols.restricted.classLabel,
    clueId: "shelfAccessRecord",
    hint: TEXT_CONTENT.manuscript.symbols.restricted.hint,
  }),
  Object.freeze({
    id: "removed",
    label: TEXT_CONTENT.manuscript.symbols.removed.label,
    classLabel: TEXT_CONTENT.manuscript.symbols.removed.classLabel,
    clueId: "removedPageNote",
    hint: TEXT_CONTENT.manuscript.symbols.removed.hint,
  }),
]);

const MANUSCRIPT_SYMBOL_SEQUENCE = Object.freeze(["staff", "restricted", "removed"]);

// The repaired page teaches the order reused by the chamber lock and finale.
const ARCHIVE_SYMBOL_PATTERN = Object.freeze(["eye", "spiral", "brokenSquare", "verticalLine"]);
const ARCHIVE_SYMBOL_LABELS = Object.freeze({
  eye: TEXT_CONTENT.archivist.symbolLabels.eye,
  spiral: TEXT_CONTENT.archivist.symbolLabels.spiral,
  brokenSquare: TEXT_CONTENT.archivist.symbolLabels.brokenSquare,
  verticalLine: TEXT_CONTENT.archivist.symbolLabels.verticalLine,
});
const CIRCUIT_SEQUENCE = Object.freeze(["auxiliary", "ventilation", "archive", "lighting"]);

const ARCHIVIST_CHAMBER = Object.freeze({
  WIDTH: 1600,
  START_X: 92,
  NODES: Object.freeze([280, 790, 1280]),
  COPIES: Object.freeze([360, 790, 1220]),
  CONTROLS: Object.freeze([250, 610, 970, 1330]),
  TERMINAL_X: 1450,
});

const PROLOGUE_WORLD = Object.freeze({
  WIDTH: 980,
  CAMERA_LEFT_BOUNDARY: 0,
  CAMERA_RIGHT_BOUNDARY: 980,
  PLAYER_LEFT_BOUNDARY: 36,
  PLAYER_RIGHT_BOUNDARY: 944,
  ENTRANCE_X: 884,
});

const ESCAPE_WORLD = Object.freeze({
  WIDTH: 4200,
  CAMERA_LEFT_BOUNDARY: 0,
  CAMERA_RIGHT_BOUNDARY: 4200,
  PLAYER_LEFT_BOUNDARY: 36,
  PLAYER_RIGHT_BOUNDARY: 4160,
  EXIT_X: 4050,
});

const RECORDS_WORLD = Object.freeze({
  WIDTH: 1540,
  CAMERA_LEFT_BOUNDARY: 0,
  CAMERA_RIGHT_BOUNDARY: 1540,
  PLAYER_LEFT_BOUNDARY: 36,
  PLAYER_RIGHT_BOUNDARY: 1504,
  ENTRANCE_X: 82,
});

const CLASSROOM_WORLD = Object.freeze({
  WIDTH: 920,
  CAMERA_LEFT_BOUNDARY: 0,
  CAMERA_RIGHT_BOUNDARY: 920,
  PLAYER_LEFT_BOUNDARY: 36,
  PLAYER_RIGHT_BOUNDARY: 884,
  ENTRANCE_X: 82,
});

const MISSING_PERSON_CASES = Object.freeze([
  Object.freeze({
    id: "mara",
    name: TEXT_CONTENT.recordsWing.cases.mara.name,
    role: TEXT_CONTENT.recordsWing.cases.mara.role,
    x: 330,
    correctIndex: 2,
    clueId: "maraVossCase",
    records: TEXT_CONTENT.recordsWing.cases.mara.records,
  }),
  Object.freeze({
    id: "elias",
    name: TEXT_CONTENT.recordsWing.cases.elias.name,
    role: TEXT_CONTENT.recordsWing.cases.elias.role,
    x: 760,
    correctIndex: 1,
    clueId: "eliasWardCase",
    records: TEXT_CONTENT.recordsWing.cases.elias.records,
  }),
  Object.freeze({
    id: "jonah",
    name: TEXT_CONTENT.recordsWing.cases.jonah.name,
    role: TEXT_CONTENT.recordsWing.cases.jonah.role,
    x: 1190,
    correctIndex: 2,
    clueId: "jonahValeCase",
    records: TEXT_CONTENT.recordsWing.cases.jonah.records,
  }),
]);

const BOSS_COMBAT = Object.freeze({
  MAX_HEALTH: 100,
  MAX_STABILITY: 5,
  MAX_CHARGE: 100,
  BEAM_DAMAGE: 5,
  BEAM_PULSE_SECONDS: 0.2,
  BEAM_RANGE: 430,
  CHARGE_DRAIN_PER_SECOND: 34,
  CHARGE_REGEN_PER_SECOND: 25,
  DODGE_SECONDS: 0.28,
  DODGE_COOLDOWN: 1,
  BLOCKED_SOUND_COOLDOWN: 0.45,
});

const MANUSCRIPT_RINGS = Object.freeze([
  Object.freeze({ id: "outer", label: TEXT_CONTENT.manuscript.rings.outer, radius: 96, width: 18, target: 1 }),
  Object.freeze({ id: "middle", label: TEXT_CONTENT.manuscript.rings.middle, radius: 68, width: 16, target: 5 }),
  Object.freeze({ id: "inner", label: TEXT_CONTENT.manuscript.rings.inner, radius: 42, width: 14, target: 3 }),
]);

const REALITY_CHANGE_SYMBOLS = Object.freeze([
  Object.freeze({
    id: "movedShelf",
    symbolId: "staff",
    clueId: "changedShelfSymbol",
    x: 930,
    prompt: TEXT_CONTENT.distortedArchive.prompts.inspectMovedShelf,
  }),
  Object.freeze({
    id: "alteredPhotograph",
    symbolId: "restricted",
    clueId: "alteredPhotographSymbol",
    x: 742,
    prompt: TEXT_CONTENT.distortedArchive.prompts.inspectAlteredPhotograph,
  }),
  Object.freeze({
    id: "backwardClock",
    symbolId: "removed",
    clueId: "backwardClockSymbol",
    x: 786,
    prompt: TEXT_CONTENT.distortedArchive.prompts.inspectBackwardClock,
  }),
]);

const DISTORTED_CORRIDOR = Object.freeze({
  WIDTH: 2680,
  EXIT_LOOP_X: 74,
  START_X: 142,
  RETURN_X: 156,
  FIRST_DOOR_X: 504,
  SECOND_DOOR_X: 1096,
  THIRD_DOOR_X: 1718,
  SEALED_SECTION_X: 2140,
  FINAL_PAGE_X: 2504,
  LIGHTS: Object.freeze([
    { x: 312, phase: 0.2 },
    { x: 812, phase: 2.3 },
    { x: 1330, phase: 4.1 },
    { x: 1884, phase: 1.2 },
    { x: 2386, phase: 3.6 },
  ]),
  SUPPORTS: Object.freeze([70, 404, 690, 1038, 1274, 1660, 1918, 2320, 2580]),
  DOORS: Object.freeze([
    { id: "falseWest", x: 504, symbolId: "maintenance", label: TEXT_CONTENT.distortedArchive.doorLabels.falseWest },
    { id: "realDoor", x: 1096, symbolId: "restricted", label: TEXT_CONTENT.distortedArchive.doorLabels.realDoor },
    { id: "falseEast", x: 1718, symbolId: "staff", label: TEXT_CONTENT.distortedArchive.doorLabels.falseEast },
  ]),
  SWITCHES: Object.freeze([
    { id: "staff", x: 2190, symbolId: "staff" },
    { id: "restricted", x: 2296, symbolId: "restricted" },
    { id: "removed", x: 2404, symbolId: "removed" },
  ]),
  SWITCH_ORDER: Object.freeze(["staff", "restricted", "removed"]),
});

const ARCHIVE_CODE = "2079";

const OBJECTIVE_DATA = TEXT_CONTENT.objectives;
const CLUE_DATA = TEXT_CONTENT.journalClues;
const DIALOGUE_DATA = TEXT_CONTENT.dialogue;

const GAME_STATES = Object.freeze({
  TITLE: "title",
  SETTINGS: "settings",
  CREDITS: "credits",
  PRESENTATION_MENU: "presentationMenu",
  PROLOGUE: "prologue",
  CORRIDOR: "corridor",
  ARCHIVE: "archive",
  RECORDS: "records",
  MANUSCRIPT: "manuscript",
  PUZZLE: "puzzle",
  DISTORTED: "distorted",
  RING: "ring",
  ARCHIVIST: "archivist",
  ESCAPE: "escape",
  CLASSROOM: "classroom",
  ENDING: "ending",
});

const PRESENTATION_SECTION_IDS = Object.freeze([
  "introduction",
  "archiveMystery",
  "manuscriptPuzzle",
  "realityShift",
  "archivistBoss",
  "finalChoice",
]);

const PRESENTATION_SECTION_LOADERS = Object.freeze({
  introduction: loadPresentationIntroduction,
  archiveMystery: loadPresentationArchiveMystery,
  manuscriptPuzzle: loadPresentationManuscript,
  realityShift: loadPresentationRealityShift,
  archivistBoss: loadPresentationBoss,
  finalChoice: loadPresentationEnding,
});

const INTERACTABLE_DEFINITIONS = Object.freeze([
  Object.freeze({
    id: "directory",
    type: "inspectable",
    x: 292,
    y: 174,
    width: 78,
    height: 58,
    range: 84,
    prompt: TEXT_CONTENT.corridor.prompts.readDirectory,
    dialogueId: "directory",
    clueId: "directory",
    onInteract: handleDirectoryInteract,
  }),
  Object.freeze({
    id: "securityMemo",
    type: "collectibleClue",
    x: 834,
    y: 312,
    width: 30,
    height: 14,
    range: 74,
    prompt: TEXT_CONTENT.corridor.prompts.readSecurityMemo,
    dialogueId: "memo",
    clueId: "securityMemo",
    onInteract: handleSecurityMemoInteract,
  }),
  Object.freeze({
    id: "lockPanel",
    type: "switch",
    x: 2148,
    y: 204,
    width: 36,
    height: 52,
    range: 78,
    getPrompt: getLockPanelPrompt,
    onInteract: handleLockPanelInteract,
  }),
  Object.freeze({
    id: "maintenanceNotice",
    type: "inspectable",
    x: 1198,
    y: 158,
    width: 76,
    height: 34,
    range: 78,
    prompt: TEXT_CONTENT.corridor.prompts.readMaintenanceNotice,
    dialogueId: "maintenanceNotice",
    clueId: "maintenanceNotice",
    onInteract: handleMaintenanceNoticeInteract,
  }),
  Object.freeze({
    id: "maintenanceKey",
    type: "collectibleClue",
    x: 1526,
    y: 326,
    width: 28,
    height: 10,
    range: 66,
    prompt: TEXT_CONTENT.corridor.prompts.takeMaintenanceKey,
    dialogueId: "keyCollected",
    clueId: "maintenanceKey",
    isAvailable: () => !chapterProgress.maintenanceKeyCollected,
    onInteract: handleMaintenanceKeyInteract,
  }),
  Object.freeze({
    id: "electricalCabinet",
    type: "switch",
    x: 1768,
    y: 176,
    width: 58,
    height: 94,
    range: 82,
    getPrompt: getElectricalCabinetPrompt,
    requiresFlashlight: true,
    onInteract: handleElectricalCabinetInteract,
  }),
  Object.freeze({
    id: "archiveDoor",
    type: "door",
    x: 2238,
    y: 222,
    width: 92,
    height: 148,
    range: 88,
    getPrompt: getArchiveDoorPrompt,
    onInteract: handleArchiveDoorInteract,
  }),
  Object.freeze({
    id: "sealedCart",
    type: "manuscriptObject",
    x: 1010,
    y: 248,
    width: 70,
    height: 42,
    range: 68,
    prompt: TEXT_CONTENT.corridor.prompts.inspectSealedCart,
    dialogueId: "manuscriptObject",
    onInteract: handleGenericDialogueInteract,
  }),
  Object.freeze({
    id: "looseFinalPage",
    type: "finalPageObject",
    x: 1968,
    y: 328,
    width: 24,
    height: 10,
    range: 58,
    prompt: TEXT_CONTENT.corridor.prompts.inspectLoosePage,
    dialogueId: "finalPageObject",
    isAvailable: () => chapterProgress.archiveDoorUnlocked,
    onInteract: handleGenericDialogueInteract,
  }),
  Object.freeze({
    id: "archiveExit",
    scene: GAME_STATES.ARCHIVE,
    type: "door",
    x: 44,
    y: 182,
    width: 72,
    height: 108,
    range: 82,
    getPrompt: getArchiveExitPrompt,
    onInteract: handleArchiveExitInteract,
  }),
  Object.freeze({
    id: "trailerArchiveReveal",
    scene: GAME_STATES.ARCHIVE,
    type: "switch",
    x: 152,
    y: 252,
    width: 42,
    height: 28,
    range: 72,
    prompt: TEXT_CONTENT.archive.prompts.stageManuscriptReveal,
    isAvailable: () =>
      TRAILER_MODE && !presentationState.active && !archiveProgress.manuscriptTableRevealed,
    onInteract: handleTrailerArchiveRevealInteract,
  }),
  Object.freeze({
    id: "archiveIndexTerminal",
    scene: GAME_STATES.ARCHIVE,
    type: "inspectable",
    x: 214,
    y: 190,
    width: 74,
    height: 72,
    range: 78,
    prompt: TEXT_CONTENT.archive.prompts.useIndexTerminal,
    dialogueId: "archiveIndex",
    clueId: "archiveIndex",
    onInteract: handleArchiveIndexInteract,
  }),
  Object.freeze({
    id: "archiveShelfPersonnel",
    scene: GAME_STATES.ARCHIVE,
    type: "collectibleClue",
    x: 306,
    y: 118,
    width: 92,
    height: 166,
    range: 82,
    prompt: TEXT_CONTENT.archive.prompts.searchShelfA02,
    requiresFlashlight: true,
    shelfSearchId: "personnelTransfer",
    onInteract: handleArchiveShelfInteract,
  }),
  Object.freeze({
    id: "archiveShelfWaterDamage",
    scene: GAME_STATES.ARCHIVE,
    type: "collectibleClue",
    x: 640,
    y: 116,
    width: 96,
    height: 168,
    range: 82,
    prompt: TEXT_CONTENT.archive.prompts.searchShelfC11,
    requiresFlashlight: true,
    shelfSearchId: "waterDamage",
    onInteract: handleArchiveShelfInteract,
  }),
  Object.freeze({
    id: "archiveShelfRestricted",
    scene: GAME_STATES.ARCHIVE,
    type: "collectibleClue",
    x: 954,
    y: 116,
    width: 104,
    height: 168,
    range: 82,
    prompt: TEXT_CONTENT.archive.prompts.searchShelfC13,
    requiresFlashlight: true,
    isAvailable: () => !archiveProgress.searchedShelves.has("restrictedAccess"),
    shelfSearchId: "restrictedAccess",
    onInteract: handleArchiveShelfInteract,
  }),
  Object.freeze({
    id: "archiveCoordinateFolder",
    scene: GAME_STATES.ARCHIVE,
    type: "collectibleClue",
    x: 1088,
    y: 326,
    width: 42,
    height: 12,
    range: 70,
    getPrompt: getCoordinateFolderPrompt,
    requiresFlashlight: true,
    isAvailable: () => !archiveProgress.coordinateFound,
    onInteract: handleCoordinateFolderInteract,
  }),
  Object.freeze({
    id: "archiveLadder",
    scene: GAME_STATES.ARCHIVE,
    type: "switch",
    getX: () => archiveProgress.ladderX,
    y: 116,
    width: 48,
    height: 174,
    range: 78,
    getPrompt: getArchiveLadderPrompt,
    onInteract: handleArchiveLadderInteract,
  }),
  Object.freeze({
    id: "archiveHighShelf",
    scene: GAME_STATES.ARCHIVE,
    type: "collectibleClue",
    x: ARCHIVE_ROOM.HIGH_SHELF_X,
    y: 92,
    width: 74,
    height: 44,
    range: 86,
    getPrompt: getArchiveHighShelfPrompt,
    requiresFlashlight: true,
    isAvailable: () => !archiveProgress.sealedStorageKeyCollected,
    onInteract: handleArchiveHighShelfInteract,
  }),
  Object.freeze({
    id: "archiveFilingCabinet",
    scene: GAME_STATES.ARCHIVE,
    type: "lockedContainer",
    x: 1340,
    y: 204,
    width: 118,
    height: 86,
    range: 82,
    getPrompt: getArchiveFilingCabinetPrompt,
    onInteract: handleArchiveFilingCabinetInteract,
  }),
  Object.freeze({
    id: "archiveRestrictedCabinet",
    scene: GAME_STATES.ARCHIVE,
    type: "lockedContainer",
    x: 1562,
    y: 124,
    width: 96,
    height: 164,
    range: 86,
    getPrompt: getArchiveRestrictedCabinetPrompt,
    onInteract: handleArchiveRestrictedCabinetInteract,
  }),
  Object.freeze({
    id: "archiveManuscriptTable",
    scene: GAME_STATES.ARCHIVE,
    type: "manuscriptObject",
    x: ARCHIVE_ROOM.TABLE_X,
    y: ARCHIVE_ROOM.TABLE_Y,
    width: ARCHIVE_ROOM.TABLE_WIDTH,
    height: ARCHIVE_ROOM.TABLE_HEIGHT,
    range: 78,
    prompt: TEXT_CONTENT.archive.prompts.inspectManuscriptTable,
    requiresFlashlight: true,
    dialogueId: "manuscriptTable",
    isAvailable: () => archiveProgress.manuscriptTableRevealed,
    onInteract: handleManuscriptTableInteract,
  }),
  Object.freeze({
    id: "missingPersonsWingDoor",
    scene: GAME_STATES.ARCHIVE,
    type: "door",
    x: 1712,
    y: 154,
    width: 72,
    height: 136,
    range: 82,
    prompt: TEXT_CONTENT.archive.prompts.enterMissingPersonsWing,
    isAvailable: () => !manuscriptProgress.realityChanged,
    onInteract: handleMissingPersonsWingDoor,
  }),
  Object.freeze({
    id: "changedShelf",
    scene: GAME_STATES.ARCHIVE,
    type: "inspectable",
    x: 930,
    y: 104,
    width: 126,
    height: 178,
    range: 84,
    prompt: TEXT_CONTENT.distortedArchive.prompts.inspectMovedShelf,
    requiresFlashlight: true,
    isAvailable: () => manuscriptProgress.realityChanged,
    onInteract: handleChangedArchiveDetailInteract,
    realityDetailId: "movedShelf",
  }),
  Object.freeze({
    id: "alteredPhotograph",
    scene: GAME_STATES.ARCHIVE,
    type: "inspectable",
    x: 742,
    y: 218,
    width: 44,
    height: 30,
    range: 68,
    prompt: TEXT_CONTENT.distortedArchive.prompts.inspectAlteredPhoto,
    requiresFlashlight: true,
    isAvailable: () => manuscriptProgress.realityChanged,
    onInteract: handleChangedArchiveDetailInteract,
    realityDetailId: "alteredPhotograph",
  }),
  Object.freeze({
    id: "backwardClock",
    scene: GAME_STATES.ARCHIVE,
    type: "inspectable",
    x: 818,
    y: 220,
    width: 30,
    height: 28,
    range: 64,
    prompt: TEXT_CONTENT.distortedArchive.prompts.inspectBackwardClock,
    requiresFlashlight: true,
    isAvailable: () => manuscriptProgress.realityChanged,
    onInteract: handleChangedArchiveDetailInteract,
    realityDetailId: "backwardClock",
  }),
  Object.freeze({
    id: "wrongExitSign",
    scene: GAME_STATES.ARCHIVE,
    type: "inspectable",
    x: 82,
    y: 110,
    width: 76,
    height: 28,
    range: 68,
    prompt: TEXT_CONTENT.distortedArchive.prompts.inspectWrongExitSign,
    isAvailable: () => manuscriptProgress.realityChanged,
    onInteract: handleOptionalArchiveChangeInteract,
    optionalDetailId: "wrongExitSign",
  }),
  Object.freeze({
    id: "extraArchiveDoor",
    scene: GAME_STATES.ARCHIVE,
    type: "inspectable",
    x: 1668,
    y: 154,
    width: 70,
    height: 136,
    range: 78,
    prompt: TEXT_CONTENT.distortedArchive.prompts.inspectExtraDoor,
    isAvailable: () => manuscriptProgress.realityChanged,
    onInteract: handleOptionalArchiveChangeInteract,
    optionalDetailId: "extraArchiveDoor",
  }),
  Object.freeze({
    id: "distortedExitLoop",
    scene: GAME_STATES.DISTORTED,
    type: "door",
    x: DISTORTED_CORRIDOR.EXIT_LOOP_X,
    y: 168,
    width: 70,
    height: 122,
    range: 82,
    prompt: TEXT_CONTENT.distortedArchive.prompts.tryCorridorExit,
    isAvailable: () => !realityProgress.archiveExitLooped,
    onInteract: handleDistortedExitLoopInteract,
  }),
  Object.freeze({
    id: "distortedDoorFalseWest",
    scene: GAME_STATES.DISTORTED,
    type: "door",
    x: DISTORTED_CORRIDOR.FIRST_DOOR_X,
    y: 154,
    width: 74,
    height: 136,
    range: 84,
    prompt: TEXT_CONTENT.distortedArchive.prompts.openDuplicateDoorA02,
    isAvailable: () => realityProgress.archiveExitLooped && !realityProgress.correctDoorChosen,
    onInteract: handleDistortedDoorInteract,
    doorId: "falseWest",
  }),
  Object.freeze({
    id: "distortedDoorReal",
    scene: GAME_STATES.DISTORTED,
    type: "door",
    x: DISTORTED_CORRIDOR.SECOND_DOOR_X,
    y: 150,
    width: 78,
    height: 140,
    range: 86,
    prompt: TEXT_CONTENT.distortedArchive.prompts.openDuplicateDoorC13,
    isAvailable: () => realityProgress.archiveExitLooped && !realityProgress.correctDoorChosen,
    onInteract: handleDistortedDoorInteract,
    doorId: "realDoor",
  }),
  Object.freeze({
    id: "distortedDoorFalseEast",
    scene: GAME_STATES.DISTORTED,
    type: "door",
    x: DISTORTED_CORRIDOR.THIRD_DOOR_X,
    y: 156,
    width: 74,
    height: 134,
    range: 84,
    prompt: TEXT_CONTENT.distortedArchive.prompts.openDuplicateDoorR06,
    isAvailable: () => realityProgress.archiveExitLooped && !realityProgress.correctDoorChosen,
    onInteract: handleDistortedDoorInteract,
    doorId: "falseEast",
  }),
  Object.freeze({
    id: "distortedSwitchStaff",
    scene: GAME_STATES.DISTORTED,
    type: "switch",
    x: 2190,
    y: 196,
    width: 38,
    height: 62,
    range: 72,
    prompt: TEXT_CONTENT.distortedArchive.prompts.activateStaffSwitch,
    requiresFlashlight: true,
    isAvailable: () => realityProgress.correctDoorChosen && !realityProgress.passageOpen,
    onInteract: handleDistortedWallSwitchInteract,
    switchId: "staff",
  }),
  Object.freeze({
    id: "distortedSwitchRestricted",
    scene: GAME_STATES.DISTORTED,
    type: "switch",
    x: 2296,
    y: 196,
    width: 38,
    height: 62,
    range: 72,
    prompt: TEXT_CONTENT.distortedArchive.prompts.activateRestrictedSwitch,
    requiresFlashlight: true,
    isAvailable: () => realityProgress.correctDoorChosen && !realityProgress.passageOpen,
    onInteract: handleDistortedWallSwitchInteract,
    switchId: "restricted",
  }),
  Object.freeze({
    id: "distortedSwitchRemoved",
    scene: GAME_STATES.DISTORTED,
    type: "switch",
    x: 2404,
    y: 196,
    width: 38,
    height: 62,
    range: 72,
    prompt: TEXT_CONTENT.distortedArchive.prompts.activateRemovedPageSwitch,
    requiresFlashlight: true,
    isAvailable: () => realityProgress.correctDoorChosen && !realityProgress.passageOpen,
    onInteract: handleDistortedWallSwitchInteract,
    switchId: "removed",
  }),
  Object.freeze({
    id: "missingFinalPage",
    scene: GAME_STATES.DISTORTED,
    type: "finalPageObject",
    x: DISTORTED_CORRIDOR.FINAL_PAGE_X,
    y: 326,
    width: 42,
    height: 14,
    range: 72,
    prompt: TEXT_CONTENT.distortedArchive.prompts.takeMissingPage,
    requiresFlashlight: true,
    isAvailable: () => realityProgress.finalPageVisible && !realityProgress.finalPageCollected,
    onInteract: handleMissingPageInteract,
  }),
  Object.freeze({
    id: "uncataloguedClassroomDoor",
    scene: GAME_STATES.DISTORTED,
    type: "door",
    x: 1450,
    y: 154,
    width: 74,
    height: 136,
    range: 84,
    prompt: TEXT_CONTENT.distortedArchive.prompts.enterUnmarkedClassroom,
    isAvailable: () =>
      realityProgress.archiveExitLooped &&
      !realityProgress.correctDoorChosen &&
      !classroomProgress.completed,
    onInteract: enterUncataloguedClassroom,
  }),
  Object.freeze({
    id: "recordsWingExit",
    scene: GAME_STATES.RECORDS,
    type: "door",
    x: RECORDS_WORLD.ENTRANCE_X,
    y: 166,
    width: 70,
    height: 124,
    range: 80,
    prompt: TEXT_CONTENT.recordsWing.prompts.returnToMainArchive,
    onInteract: leaveMissingPersonsWing,
  }),
  ...MISSING_PERSON_CASES.map((caseData) =>
    Object.freeze({
      id: `missingPersonCase-${caseData.id}`,
      scene: GAME_STATES.RECORDS,
      type: "inspectable",
      x: caseData.x,
      y: 132,
      width: 112,
      height: 150,
      range: 88,
      prompt: formatText(TEXT_CONTENT.recordsWing.prompts.compareCaseFile, { name: caseData.name }),
      onInteract: () => openMissingPersonCase(caseData.id),
    }),
  ),
  Object.freeze({
    id: "classroomExit",
    scene: GAME_STATES.CLASSROOM,
    type: "door",
    x: CLASSROOM_WORLD.ENTRANCE_X,
    y: 164,
    width: 70,
    height: 126,
    range: 82,
    prompt: TEXT_CONTENT.distortedArchive.prompts.leaveClassroom,
    onInteract: leaveUncataloguedClassroom,
  }),
  Object.freeze({
    id: "classroomRegister",
    scene: GAME_STATES.CLASSROOM,
    type: "inspectable",
    x: 790,
    y: 228,
    width: 76,
    height: 38,
    range: 76,
    prompt: TEXT_CONTENT.distortedArchive.prompts.readAttendanceRegister,
    onInteract: inspectClassroomRegister,
  }),
  ...ARCHIVIST_CHAMBER.NODES.map((x, index) =>
    Object.freeze({
      id: `archivistNode${index}`,
      scene: GAME_STATES.ARCHIVIST,
      type: "switch",
      x,
      y: 180,
      width: 56,
      height: 92,
      range: 78,
      prompt: TEXT_CONTENT.archivist.prompts.disableCorruptedRecord,
      requiresFlashlight: true,
      isAvailable: () => false,
      onInteract: () => disableCorruptedNode(index),
    }),
  ),
  ...ARCHIVIST_CHAMBER.COPIES.map((x, index) =>
    Object.freeze({
      id: `archivistCopy${index}`,
      scene: GAME_STATES.ARCHIVIST,
      type: "inspectable",
      x,
      y: 156,
      width: 48,
      height: 134,
      range: 76,
      prompt: TEXT_CONTENT.archivist.prompts.testRevealedFigure,
      requiresFlashlight: true,
      isAvailable: () => false,
      onInteract: () => testArchivistCopy(index),
    }),
  ),
  ...ARCHIVIST_CHAMBER.CONTROLS.map((x, index) =>
    Object.freeze({
      id: `archiveLoopControl${index}`,
      scene: GAME_STATES.ARCHIVIST,
      type: "switch",
      x,
      y: 210,
      width: 44,
      height: 70,
      range: 72,
      prompt: formatText(TEXT_CONTENT.archivist.prompts.activateControl, {
        label: ARCHIVE_SYMBOL_LABELS[ARCHIVE_SYMBOL_PATTERN[index]],
      }),
      requiresFlashlight: true,
      isAvailable: () =>
        archivistProgress.symbolInterruptionActive &&
        !archivistProgress.bossDefeated,
      onInteract: () => activateCombatSealControl(index),
    }),
  ),
  Object.freeze({
    id: "finalArchiveTerminal",
    scene: GAME_STATES.ARCHIVIST,
    type: "inspectable",
    x: ARCHIVIST_CHAMBER.TERMINAL_X,
    y: 174,
    width: 72,
    height: 108,
    range: 82,
    prompt: TEXT_CONTENT.archivist.prompts.inspectFinalArchiveEntry,
    isAvailable: () => false,
    onInteract: inspectFinalArchiveTerminal,
  }),
]);

const DEBUG_KEYS = Object.freeze([
  { code: "KeyA", label: "A" },
  { code: "KeyD", label: "D" },
  { code: "ArrowLeft", label: "Left" },
  { code: "ArrowRight", label: "Right" },
  { code: "ArrowUp", label: "Up" },
  { code: "ArrowDown", label: "Down" },
  { code: "KeyE", label: "E" },
  { code: "KeyF", label: "F" },
  { code: "KeyJ", label: "J" },
  { code: "KeyC", label: "C" },
  { code: "Escape", label: "Escape" },
  { code: "Enter", label: "Enter" },
  { code: "Space", label: "Space" },
  { code: "F2", label: "F2" },
  { code: "F8", label: "F8" },
  { code: "F10", label: "F10" },
]);

const INPUT_KEYS = Object.freeze([
  ...DEBUG_KEYS,
  { code: "Backspace", label: "Backspace" },
  { code: "Digit0", label: "0" },
  { code: "Digit1", label: "1" },
  { code: "Digit2", label: "2" },
  { code: "Digit3", label: "3" },
  { code: "Digit4", label: "4" },
  { code: "Digit5", label: "5" },
  { code: "Digit6", label: "6" },
  { code: "Digit7", label: "7" },
  { code: "Digit8", label: "8" },
  { code: "Digit9", label: "9" },
  { code: "Numpad0", label: "0" },
  { code: "Numpad1", label: "1" },
  { code: "Numpad2", label: "2" },
  { code: "Numpad3", label: "3" },
  { code: "Numpad4", label: "4" },
  { code: "Numpad5", label: "5" },
  { code: "Numpad6", label: "6" },
  { code: "Numpad7", label: "7" },
  { code: "Numpad8", label: "8" },
  { code: "Numpad9", label: "9" },
  { code: "Tab", label: "Tab" },
  { code: "KeyQ", label: "Q" },
  { code: "KeyR", label: "R" },
  { code: "KeyB", label: "B" },
  { code: "KeyH", label: "H" },
  { code: "KeyP", label: "P" },
  { code: "KeyY", label: "Y" },
  { code: "PageUp", label: "PageUp" },
  { code: "PageDown", label: "PageDown" },
  { code: "BracketLeft", label: "[" },
  { code: "BracketRight", label: "]" },
  { code: "F6", label: "F6" },
  { code: "F7", label: "F7" },
  { code: "F9", label: "F9" },
]);

const canvas = document.getElementById("game");
const context = canvas.getContext("2d");

context.imageSmoothingEnabled = false;

const gameState = createGameStateManager(GAME_STATES.TITLE);
const input = createInputManager(INPUT_KEYS);
const mouse = createMouseManager(canvas);
const player = createPlayer(PLAYER_CONFIG);
const camera = createCamera(player);
const titleScene = createTitleScene();
const prologueScene = createDistortedScene();
const corridorScene = {
  time: 0,
  grainFrame: 0,
  grainTimer: 0,
  flashlightOn: true,
};
const archiveScene = createArchiveScene();
const recordsScene = createDistortedScene();
const manuscriptScene = createManuscriptScene();
const distortedScene = createDistortedScene();
const classroomScene = createDistortedScene();
const archivistScene = createDistortedScene();
const escapeScene = createDistortedScene();
const chapterProgress = createChapterProgress();
const archiveProgress = createArchiveProgress();
const recordsProgress = createRecordsProgress();
const manuscriptProgress = createManuscriptProgress();
const realityProgress = createRealityProgress();
const classroomProgress = createClassroomProgress();
const circuitPuzzleState = createCircuitPuzzleState();
const chamberRingProgress = createChamberRingProgress();
const archivistProgress = createArchivistProgress();
const prologueProgress = createPrologueProgress();
const escapeProgress = createEscapeProgress();
const dialogueState = createDialogueState();
const objectiveState = createObjectiveState(
  TRAILER_MODE ? "enterCode" : "enterUniversity",
);
const journalState = {
  open: false,
  cluePage: 0,
};
const keypadState = createKeypadState();
const inspectOverlayState = createInspectOverlayState();
const controlsState = {
  open: false,
};
const titleMenuState = {
  selectedIndex: 0,
  exitMessage: "",
  exitMessageTimer: 0,
};
const presentationState = {
  active: false,
  fullRoute: false,
  selectedMenuIndex: 0,
  endingSelectedIndex: 0,
  currentSectionIndex: 0,
  currentSectionId: null,
  menuReturnState: null,
  overlayVisible: true,
  explanationPaused: false,
  cardTitle: "",
  cardBody: "",
  cardTimer: 0,
  promptText: "",
  promptTimer: 0,
  normalSnapshot: null,
};
const settingsMenuState = {
  selectedIndex: 0,
  message: "",
  messageTimer: 0,
};
const creditsState = {
  selectedIndex: 0,
};
const endingState = {
  selectedIndex: 0,
  pendingAfterInspect: false,
  reached: false,
};
const runtimeSession = {
  valid: false,
  state: GAME_STATES.CORRIDOR,
  playerX: PLAYER_CONFIG.SPAWN_X,
  facing: 1,
};
const interactionState = {
  activeInteractable: null,
  lastPromptId: null,
};
const transitionState = {
  active: false,
  phase: "none",
  timer: 0,
  duration: 0.7,
  targetState: null,
  spawnX: null,
  facing: 1,
};
const settings = loadSettings();
let cinematicCaptureActive = CINEMATIC_CAPTURE_MODE;
const audioManager = createAudioManager(AUDIO_LIBRARY, {
  master: settings.masterVolume,
  music: settings.musicVolume,
  ambience: settings.ambienceVolume,
  sfx: settings.sfxVolume,
});
const debug = {
  showOverlay: false,
  showCollisionBoxes: false,
};

let lastFrameTime = 0;
let isPausedForVisibility = document.hidden;

audioManager.playMusic("titleTheme", { fadeSeconds: 1.6, volume: 0.3 });
registerAudioUnlockHandlers(audioManager);

function createAudioManager(library, defaultVolumes) {
  const canUseAudio = typeof Audio !== "undefined";
  const activeLoops = {
    music: null,
    ambience: null,
  };
  const pendingLoops = {
    music: null,
    ambience: null,
  };
  const activeSfx = new Set();
  const missingAssets = new Set();
  const failedStarts = new Set();
  const warnedAudioIssues = new Set();
  const fadeTokens = new WeakMap();
  const lastSfxTimes = new Map();
  const volumes = {
    master: normalizeVolume(defaultVolumes.master),
    music: normalizeVolume(defaultVolumes.music),
    ambience: normalizeVolume(defaultVolumes.ambience),
    sfx: normalizeVolume(defaultVolumes.sfx),
  };
  let unlocked = false;

  function unlock() {
    unlocked = true;
    startPendingLoop("music");
    startPendingLoop("ambience");

    return true;
  }

  function playMusic(key, options = {}) {
    return playLoop("music", key, options);
  }

  function playAmbience(key, options = {}) {
    return playLoop("ambience", key, options);
  }

  function stopMusic(options = {}) {
    stopLoop("music", options);
  }

  function stopAmbience(options = {}) {
    stopLoop("ambience", options);
  }

  function playSfx(key, options = {}) {
    const path = getAudioPath("sfx", key);

    if (!canUseAudio || !path || !unlocked || isSfxOnCooldown(key)) {
      return false;
    }

    const element = createAudioElement(path, `sfx:${key}`, false);
    const volumeScale = getEffectiveSfxVolume(
      key,
      normalizeVolume(options.volume ?? getDefaultSfxVolume(key)),
    );
    element.volume =
      getChannelVolume("sfx") * volumeScale;
    activeSfx.add(element);

    element.addEventListener("ended", () => activeSfx.delete(element), { once: true });
    element.addEventListener("error", () => activeSfx.delete(element), { once: true });
    safelyPlay(element, `sfx:${key}`);

    return true;
  }

  function playLoop(channel, key, options = {}) {
    if (!canUseAudio) {
      return false;
    }

    if (!unlocked) {
      pendingLoops[channel] = { key, options };
      return false;
    }

    return startLoop(channel, key, options);
  }

  function startPendingLoop(channel) {
    const pending = pendingLoops[channel];

    if (!pending) {
      return;
    }

    pendingLoops[channel] = null;
    startLoop(channel, pending.key, pending.options);
  }

  function startLoop(channel, key, options = {}) {
    const path = getAudioPath(channel, key);

    if (!path) {
      return false;
    }

    const currentLoop = activeLoops[channel];
    if (currentLoop?.key === key) {
      currentLoop.volumeScale = normalizeVolume(options.volume ?? currentLoop.volumeScale);
      fadeElement(
        currentLoop.element,
        getLoopVolume(channel, currentLoop),
        options.fadeSeconds ?? 0.8,
      );
      return true;
    }

    const otherChannel = channel === "music" ? "ambience" : "music";
    const otherLoop = activeLoops[otherChannel];
    if (channel === "music" && otherLoop?.path === path) {
      stopLoop(channel, { fadeSeconds: options.crossfadeSeconds ?? options.fadeSeconds ?? 0.8 });
      return true;
    }
    if (channel === "ambience" && otherLoop?.path === path) {
      stopLoop(otherChannel, { fadeSeconds: options.crossfadeSeconds ?? options.fadeSeconds ?? 0.8 });
    }

    stopLoop(channel, { fadeSeconds: options.crossfadeSeconds ?? options.fadeSeconds ?? 0.8 });

    const element = createAudioElement(path, `${channel}:${key}`, true);
    const loop = {
      element,
      key,
      path,
      volumeScale: normalizeVolume(options.volume ?? getDefaultLoopVolume(channel)),
    };

    element.volume = 0;
    activeLoops[channel] = loop;
    safelyPlay(element, `${channel}:${key}`);
    fadeElement(element, getLoopVolume(channel, loop), options.fadeSeconds ?? 1);

    return true;
  }

  function stopLoop(channel, options = {}) {
    pendingLoops[channel] = null;

    const loop = activeLoops[channel];

    if (!loop) {
      return;
    }

    activeLoops[channel] = null;
    fadeElement(loop.element, 0, options.fadeSeconds ?? 0.6, () => {
      loop.element.pause();
      loop.element.currentTime = 0;
    });
  }

  function createAudioElement(path, assetId, isLooping) {
    const element = new Audio(path);

    element.preload = "auto";
    element.loop = isLooping;
    element.addEventListener(
      "error",
      () => {
        missingAssets.add(assetId);
        warnAudioOnce(
          `load:${assetId}`,
          `[VOYNICH audio] Failed to load ${assetId} from ${path}.`,
        );
      },
      { once: true },
    );

    return element;
  }

  function safelyPlay(element, assetId) {
    try {
      const playResult = element.play();

      if (playResult?.catch) {
        playResult.catch((error) => {
          markFailedStart(assetId, error);
        });
      }
    } catch (error) {
      markFailedStart(assetId, error);
    }
  }

  function getAudioPath(channel, key) {
    const path = library[channel]?.[key];

    if (!path) {
      warnAudioOnce(
        `missing-id:${channel}:${key}`,
        `[VOYNICH audio] No ${channel} asset is mapped for "${key}".`,
      );
      return null;
    }

    return path;
  }

  function markFailedStart(assetId, error) {
    failedStarts.add(assetId);
    warnAudioOnce(
      `play:${assetId}`,
      `[VOYNICH audio] Playback failed or was blocked for ${assetId}.`,
      error,
    );
  }

  function warnAudioOnce(key, message, detail) {
    if (warnedAudioIssues.has(key) || typeof console === "undefined" || !console.warn) {
      return;
    }

    warnedAudioIssues.add(key);
    console.warn(message, detail ?? "");
  }

  function isSfxOnCooldown(key) {
    const cooldownSeconds = AUDIO_SFX_COOLDOWNS[key] ?? 0;

    if (cooldownSeconds <= 0) {
      return false;
    }

    const now = getNow();
    const lastPlayedAt = lastSfxTimes.get(key) ?? -Infinity;

    if (now - lastPlayedAt < cooldownSeconds * 1000) {
      return true;
    }

    lastSfxTimes.set(key, now);
    return false;
  }

  function fadeElement(element, targetVolume, seconds, onComplete) {
    const endVolume = normalizeVolume(targetVolume);
    const startVolume = element.volume;
    const duration = Math.max(0, seconds);
    const token = Symbol("audio-fade");

    fadeTokens.set(element, token);

    if (duration === 0 || typeof requestAnimationFrame === "undefined") {
      element.volume = endVolume;
      onComplete?.();
      return;
    }

    const startedAt = getNow();

    function step(now) {
      if (fadeTokens.get(element) !== token) {
        return;
      }

      const progress = clamp((now - startedAt) / (duration * 1000), 0, 1);
      element.volume = startVolume + (endVolume - startVolume) * progress;

      if (progress < 1) {
        requestAnimationFrame(step);
        return;
      }

      onComplete?.();
    }

    requestAnimationFrame(step);
  }

  function setVolume(channel, value) {
    if (!Object.prototype.hasOwnProperty.call(volumes, channel)) {
      throw new Error(`Unknown audio volume channel: ${channel}`);
    }

    volumes[channel] = normalizeVolume(value);
    applyLoopVolumes();
  }

  function applyLoopVolumes() {
    ["music", "ambience"].forEach((channel) => {
      const loop = activeLoops[channel];

      if (loop) {
        fadeElement(loop.element, getLoopVolume(channel, loop), 0.18);
      }
    });
  }

  function getChannelVolume(channel) {
    return normalizeVolume(volumes.master * volumes[channel]);
  }

  function getLoopVolume(channel, loop) {
    return normalizeVolume(getChannelVolume(channel) * (loop?.volumeScale ?? 1));
  }

  function getStatus() {
    return {
      available: canUseAudio,
      unlocked,
      missingCount: missingAssets.size,
      failedStartCount: failedStarts.size,
      activeMusic: activeLoops.music?.key ?? null,
      activeAmbience: activeLoops.ambience?.key ?? null,
      volumes: { ...volumes },
    };
  }

  return {
    unlock,
    playMusic,
    playAmbience,
    stopMusic,
    stopAmbience,
    playSfx,
    getStatus,
    getVolumes() {
      return { ...volumes };
    },
    setMasterVolume(value) {
      setVolume("master", value);
    },
    setMusicVolume(value) {
      setVolume("music", value);
    },
    setAmbienceVolume(value) {
      setVolume("ambience", value);
    },
    setSfxVolume(value) {
      setVolume("sfx", value);
    },
  };
}

function getDefaultLoopVolume(channel) {
  return channel === "ambience" ? AUDIO_MIX_DEFAULTS.ambience : AUDIO_MIX_DEFAULTS.music;
}

function getDefaultSfxVolume(key) {
  if (key === "dialogueTick") {
    return AUDIO_MIX_DEFAULTS.dialogueTick;
  }

  if (AUDIO_UI_SFX.has(key)) {
    return AUDIO_MIX_DEFAULTS.ui;
  }

  if (AUDIO_COMBAT_SFX.has(key)) {
    return AUDIO_MIX_DEFAULTS.combat;
  }

  return AUDIO_MIX_DEFAULTS.effect;
}

function getEffectiveSfxVolume(key, volume) {
  if (key === "dialogueTick") {
    return Math.min(volume, AUDIO_MIX_DEFAULTS.dialogueTick);
  }

  if (AUDIO_UI_SFX.has(key)) {
    return Math.min(volume, AUDIO_MIX_DEFAULTS.ui);
  }

  return volume;
}

function normalizeVolume(value) {
  return clamp(Number.isFinite(value) ? value : 1, 0, 1);
}

function getNow() {
  if (typeof performance !== "undefined" && typeof performance.now === "function") {
    return performance.now();
  }

  return Date.now();
}

function getTrailerAdjustedDuration(seconds) {
  return TRAILER_MODE ? seconds * GAMEPLAY_TARGET.TRAILER_TASK_SCALE : seconds;
}

function getTrailerAdjustedRequirement(count) {
  return TRAILER_MODE ? Math.max(1, Math.ceil(count * GAMEPLAY_TARGET.TRAILER_TASK_SCALE)) : count;
}

function registerAudioUnlockHandlers(manager) {
  if (typeof window === "undefined") {
    return;
  }

  function handleAudioUnlock() {
    manager.unlock();
  }

  window.addEventListener("pointerdown", handleAudioUnlock, { once: true });
  window.addEventListener("keydown", handleAudioUnlock, { once: true });
}

function loadSettings() {
  const fallback = normalizeSettings(DEFAULT_SETTINGS);

  if (typeof localStorage === "undefined") {
    return fallback;
  }

  try {
    const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);

    if (!stored) {
      return fallback;
    }

    return normalizeSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(stored) });
  } catch {
    return fallback;
  }
}

function normalizeSettings(candidate) {
  return {
    masterVolume: normalizeVolume(candidate.masterVolume),
    musicVolume: normalizeVolume(candidate.musicVolume),
    ambienceVolume: normalizeVolume(candidate.ambienceVolume),
    sfxVolume: normalizeVolume(candidate.sfxVolume),
    textSpeed: clamp(Number(candidate.textSpeed) || DEFAULT_SETTINGS.textSpeed, 24, 90),
    screenShake: Boolean(candidate.screenShake),
    grainIntensity: normalizeVolume(candidate.grainIntensity),
  };
}

function saveSettings() {
  if (typeof localStorage === "undefined") {
    return false;
  }

  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    return true;
  } catch {
    setSettingsMessage(TEXT_CONTENT.settings.messages.saveFailed);
    return false;
  }
}

function applySettingsToAudio() {
  audioManager.setMasterVolume(settings.masterVolume);
  audioManager.setMusicVolume(settings.musicVolume);
  audioManager.setAmbienceVolume(settings.ambienceVolume);
  audioManager.setSfxVolume(settings.sfxVolume);
}

function updateSettingValue(settingId, value, options = {}) {
  const item = SETTINGS_ITEMS.find((entry) => entry.id === settingId);

  if (!item) {
    return;
  }

  if (item.type === "range") {
    settings[settingId] = clamp(Number(value), item.min, item.max);
  } else if (item.type === "toggle") {
    settings[settingId] = Boolean(value);
  }

  applySettingsToAudio();
  saveSettings();

  if (!options.silent) {
    setSettingsMessage(TEXT_CONTENT.settings.messages.saved);
  }
}

function adjustSelectedSetting(direction) {
  const item = SETTINGS_ITEMS[settingsMenuState.selectedIndex];

  if (!item || item.type !== "range") {
    return;
  }

  updateSettingValue(item.id, settings[item.id] + item.step * direction);
  audioManager.playSfx("uiMove", { volume: 0.45 });
}

function toggleSelectedSetting() {
  const item = SETTINGS_ITEMS[settingsMenuState.selectedIndex];

  if (!item) {
    return;
  }

  if (item.type === "toggle") {
    updateSettingValue(item.id, !settings[item.id]);
    audioManager.playSfx("uiSelect", { volume: 0.55 });
    return;
  }

  if (item.id === "fullscreen") {
    requestFullscreenMode();
    return;
  }

  if (item.id === "back") {
    returnToTitleFromSubmenu();
  }
}

function setSettingsMessage(message) {
  settingsMenuState.message = message;
  settingsMenuState.messageTimer = 2.4;
}

function requestFullscreenMode() {
  audioManager.playSfx("fullscreenToggle", { volume: 0.55 });

  if (typeof document === "undefined" || !document.documentElement.requestFullscreen) {
    setSettingsMessage(TEXT_CONTENT.settings.messages.fullscreenUnavailable);
    return;
  }

  const request = document.fullscreenElement
    ? document.exitFullscreen?.()
    : document.documentElement.requestFullscreen();

  if (request?.then) {
    request
      .then(() => setSettingsMessage(
        document.fullscreenElement
          ? TEXT_CONTENT.settings.messages.fullscreenEnabled
          : TEXT_CONTENT.settings.messages.fullscreenClosed,
      ))
      .catch(() => setSettingsMessage(TEXT_CONTENT.settings.messages.fullscreenBlocked));
    return;
  }

  setSettingsMessage(TEXT_CONTENT.settings.messages.fullscreenToggled);
}

function createChapterProgress() {
  return {
    directoryRead: false,
    archiveDoorChecked: false,
    lockPanelInspected: false,
    maintenanceNoticeRead: false,
    securityMemoRead: false,
    maintenanceKeyCollected: false,
    electricalCabinetOpen: false,
    circuitPuzzleSolved: TRAILER_MODE,
    circuitAttempts: 0,
    powerReset: TRAILER_MODE,
    archiveDoorUnlocked: false,
    archiveDoorRevealed: false,
    clues: new Set(),
  };
}

function createArchiveScene() {
  return {
    time: 0,
    grainFrame: 0,
    grainTimer: 0,
    flashlightOn: true,
    dust: createArchiveDust(),
  };
}

function createArchiveDust() {
  return Array.from({ length: ARCHIVE_ROOM.DUST_COUNT }, (_, index) => {
    const x = 80 + ((index * 157) % (ARCHIVE_WORLD.WIDTH - 160));
    const y = 70 + ((index * 43) % 178);
    const depth = 0.34 + ((index * 19) % 56) / 100;

    return Object.freeze({
      x,
      y,
      depth,
      phase: index * 0.73,
      size: index % 5 === 0 ? 2 : 1,
    });
  });
}

function createArchiveProgress() {
  return {
    entered: false,
    entranceDialogueShown: false,
    indexRead: false,
    searchedShelves: new Set(),
    firstUsefulRecordFound: false,
    coordinateFound: false,
    ladderX: ARCHIVE_ROOM.LADDER_START_X,
    ladderPosition: ARCHIVE_ROOM.LADDER_START_X,
    ladderMoved: false,
    ladderLockedAtC13: false,
    ladderSequenceActive: false,
    ladderSequenceTimer: 0,
    ladderClimbPhase: 0,
    ladderPushActive: false,
    sealedStorageKeyCollected: false,
    filingCabinetUnlocked: false,
    photographFound: false,
    accessCardFound: false,
    removedPageNoteFound: false,
    restrictedGateOpened: false,
    manuscriptTableRevealed: false,
    manuscriptSequenceStarted: false,
    musicPhase: "silent",
  };
}

function createManuscriptScene() {
  return {
    time: 0,
    grainFrame: 0,
    grainTimer: 0,
  };
}

function createManuscriptProgress() {
  return {
    entered: false,
    stage: MANUSCRIPT_STAGES.RECONSTRUCT,
    fragments: MANUSCRIPT_FRAGMENTS.map((fragment) => ({
      id: fragment.id,
      x: fragment.startX,
      y: fragment.startY,
      width: fragment.width,
      height: fragment.height,
      rotation: fragment.rotation,
      placed: false,
    })),
    selectedFragmentId: null,
    draggingFragmentId: null,
    dragOffsetX: 0,
    dragOffsetY: 0,
    pageReconstructed: false,
    manuscriptCompleted: false,
    manuscriptPatternDiscovered: false,
    marginMarksRevealed: false,
    selectedSymbolIndex: 0,
    symbolSequence: [],
    symbolStageSolved: false,
    committedToFinalStage: false,
    rings: MANUSCRIPT_RINGS.map((ring) => ({
      id: ring.id,
      rotation: 0,
    })),
    selectedRingIndex: 0,
    solved: false,
    realityChanged: false,
    finalTriggered: false,
    inputCooldown: 0,
    shakeTimer: 0,
    inkMotionTimer: 0,
    glitchTimer: 0,
    returnTimer: 0,
    message: "",
    messageTimer: 0,
  };
}

function createDistortedScene() {
  return {
    time: 0,
    grainFrame: 0,
    grainTimer: 0,
    flashlightOn: true,
    cameraJitter: 0,
  };
}

function createTitleScene() {
  return {
    time: 0,
    grainFrame: 0,
    grainTimer: 0,
    dust: Array.from({ length: 42 }, (_, index) =>
      Object.freeze({
        x: (index * 97) % CANVAS_WIDTH,
        y: 28 + ((index * 53) % 230),
        depth: 0.28 + ((index * 17) % 62) / 100,
        phase: index * 0.61,
        size: index % 7 === 0 ? 2 : 1,
      }),
    ),
  };
}

function createRealityProgress() {
  return {
    chapterStarted: false,
    archiveReturnSeen: false,
    archiveExitLooped: false,
    changedDetails: new Set(),
    discoveredSymbols: new Set(),
    optionalInspections: new Set(),
    distortedEntries: 0,
    falseDoorLoops: 0,
    correctDoorChosen: false,
    sealedSectionReached: false,
    switchSequence: [],
    passageOpen: false,
    finalPageVisible: false,
    finalPageCollected: false,
    silhouetteTriggered: false,
    silhouetteActive: false,
    silhouetteTimer: 0,
    lightShutdownCount: 0,
    loopDetailVariant: 0,
    message: "",
    messageTimer: 0,
    musicIntensity: 0,
    darkAttemptIndex: 0,
  };
}

function createRecordsProgress() {
  return {
    entered: false,
    solvedCases: new Set(),
    photographedCases: new Set(),
    activeCaseId: null,
    selectedRecordIndex: 0,
    errorTimer: 0,
    completed: false,
    message: "",
    messageTimer: 0,
  };
}

function createClassroomProgress() {
  return {
    entered: false,
    occupants: 0,
    previousFlashlightOn: true,
    completed: false,
    registerInspected: false,
    returnX: 1450,
    message: "",
    messageTimer: 0,
  };
}

function createCircuitPuzzleState() {
  return {
    active: false,
    sequence: [],
    message: "",
    messageTimer: 0,
    flickerTimer: 0,
  };
}

function createChamberRingProgress() {
  return {
    entered: false,
    selectedSection: 0,
    symbols: [1, 3, 0, 2],
    ringSolved: false,
    inputCooldown: 0,
    rejectionTimer: 0,
    message: "",
    messageTimer: 0,
  };
}

function createArchivistProgress() {
  return {
    bossActive: false,
    bossHealth: BOSS_COMBAT.MAX_HEALTH,
    playerInvulnerable: 0,
    manuscriptCharge: BOSS_COMBAT.MAX_CHARGE,
    beamPulseTimer: 0,
    beamActive: false,
    beamSoundActive: false,
    bossBlockedSoundCooldown: 0,
    dodgeActive: 0,
    dodgeCooldown: 0,
    bossAttackState: null,
    bossAttackCooldown: 1.8,
    bossInvulnerable: false,
    bossDefeated: false,
    bossHitReaction: 0,
    hitsSinceTeleport: 0,
    projectiles: [],
    spikeWarnings: [],
    collapseWarnings: [],
    falseCopies: [],
    phaseTransitionTimer: 0,
    symbolInterruptionActive: false,
    symbolInterruptionSequence: [],
    sealErrorTimer: 0,
    finalStandTriggered: false,
    playerDefeated: false,
    defeatMenuIndex: 0,
    tutorialTimer: 8,
    tutorialMoved: false,
    tutorialDodged: false,
    tutorialAttacked: false,
    bossStarted: false,
    bossPhase: 1,
    corruptedNodesDisabled: new Set(),
    trueArchivistIdentified: false,
    realCopyIndex: 1,
    finalSequence: [],
    finalSequenceSolved: false,
    playerStability: 3,
    stabilityCooldown: 0,
    archivistX: 1180,
    teleportTimer: 3.5,
    interferenceTimer: 4,
    interferenceActive: false,
    interferenceDuration: 0,
    message: "",
    messageTimer: 0,
    gameEnding: false,
    endingTimer: 0,
    finalTerminalInspected: false,
  };
}

function createPrologueProgress() {
  return {
    prologueStarted: false,
    prologueCompleted: false,
    timer: 0,
    controlGranted: false,
  };
}

function createEscapeProgress() {
  return {
    escapeSequenceActive: false,
    protagonistEscaped: false,
    endingStarted: false,
    timer: 0,
    revealTimer: 0,
    notificationPlayed: false,
    debris: [],
    debrisInvulnerability: 0,
    detourActive: false,
    detourCompleted: false,
    cameraChoiceActive: false,
    cameraChoice: null,
    cameraChoiceIndex: 0,
    evidencePreserved: false,
    message: "",
    messageTimer: 0,
  };
}

function createDialogueState() {
  return {
    active: false,
    dialogueId: null,
    lines: [],
    lineIndex: 0,
    visibleCharacters: 0,
    lastTickCharacter: 0,
    typewriterSpeed: 48,
    allowEscape: false,
  };
}

function createInspectOverlayState() {
  return {
    active: false,
    title: "",
    text: "",
    clueId: null,
  };
}

function createObjectiveState(currentId) {
  return {
    currentId,
    completedIds: new Set(),
    bannerTimer: 4,
    bannerText: OBJECTIVE_DATA[currentId].title,
  };
}

function createKeypadState() {
  return {
    active: false,
    enteredCode: "",
    message: "",
    messageTimer: 0,
  };
}

function createGameStateManager(initialState) {
  const validStates = new Set(Object.values(GAME_STATES));
  let currentState = initialState;

  return {
    get current() {
      return currentState;
    },
    set(nextState) {
      if (!validStates.has(nextState)) {
        throw new Error(`Unknown game state: ${nextState}`);
      }

      currentState = nextState;
    },
  };
}

function isTitleFamilyState(state = gameState.current) {
  return (
    state === GAME_STATES.TITLE ||
    state === GAME_STATES.SETTINGS ||
    state === GAME_STATES.CREDITS ||
    state === GAME_STATES.PRESENTATION_MENU
  );
}

function isInterfaceScreenState(state = gameState.current) {
  return isTitleFamilyState(state) || state === GAME_STATES.ENDING;
}

function isGameplayState(state = gameState.current) {
  return (
    state === GAME_STATES.PROLOGUE ||
    state === GAME_STATES.CORRIDOR ||
    state === GAME_STATES.ARCHIVE ||
    state === GAME_STATES.RECORDS ||
    state === GAME_STATES.MANUSCRIPT ||
    state === GAME_STATES.DISTORTED ||
    state === GAME_STATES.CLASSROOM ||
    state === GAME_STATES.RING ||
    state === GAME_STATES.ARCHIVIST ||
    state === GAME_STATES.ESCAPE
  );
}

function shouldHideCaptureUi() {
  return TRAILER_MODE && cinematicCaptureActive;
}

function getTitleMenuOptions() {
  const options = [
    Object.freeze({ label: TEXT_CONTENT.title.menu.start, action: TITLE_MENU_ACTIONS.START }),
  ];

  if (runtimeSession.valid) {
    options.push(Object.freeze({ label: TEXT_CONTENT.title.menu.continue, action: TITLE_MENU_ACTIONS.CONTINUE }));
  }

  options.push(
    Object.freeze({
      label: TEXT_CONTENT.title.menu.presentation || "Presentation Mode",
      action: TITLE_MENU_ACTIONS.PRESENTATION,
    }),
    Object.freeze({ label: TEXT_CONTENT.title.menu.settings, action: TITLE_MENU_ACTIONS.SETTINGS }),
    Object.freeze({ label: TEXT_CONTENT.title.menu.credits, action: TITLE_MENU_ACTIONS.CREDITS }),
    Object.freeze({ label: TEXT_CONTENT.title.menu.exit, action: TITLE_MENU_ACTIONS.EXIT }),
  );

  return options;
}

function updateMenuScreens(deltaSeconds) {
  updateTitleScene(titleScene, deltaSeconds);
  titleMenuState.exitMessageTimer = Math.max(0, titleMenuState.exitMessageTimer - deltaSeconds);
  settingsMenuState.messageTimer = Math.max(0, settingsMenuState.messageTimer - deltaSeconds);

  if (controlsState.open || transitionState.active) {
    return;
  }

  if (gameState.current === GAME_STATES.TITLE) {
    updateTitleMenuControls();
    return;
  }

  if (gameState.current === GAME_STATES.SETTINGS) {
    updateSettingsMenuControls();
    return;
  }

  if (gameState.current === GAME_STATES.CREDITS) {
    updateCreditsControls();
    return;
  }

  if (gameState.current === GAME_STATES.PRESENTATION_MENU) {
    updatePresentationMenuControls();
  }
}

function updateEndingControls() {
  if (gameState.current !== GAME_STATES.ENDING || controlsState.open || transitionState.active) {
    return;
  }

  if (presentationState.active) {
    updatePresentationEndingControls();
    return;
  }

  const options = getEndingMenuOptions();

  if (input.wasPressed("ArrowUp") || input.wasPressed("ArrowLeft") || input.wasPressed("KeyA")) {
    endingState.selectedIndex =
      (endingState.selectedIndex + options.length - 1) % options.length;
    audioManager.playSfx("uiMove", { volume: 0.46 });
  }

  if (input.wasPressed("ArrowDown") || input.wasPressed("ArrowRight") || input.wasPressed("KeyD")) {
    endingState.selectedIndex = (endingState.selectedIndex + 1) % options.length;
    audioManager.playSfx("uiMove", { volume: 0.46 });
  }

  const hoveredIndex = getHoveredEndingOptionIndex(options.length);
  if (hoveredIndex !== -1) {
    endingState.selectedIndex = hoveredIndex;
  }

  if (input.wasPressed("KeyE") || input.wasPressed("Enter")) {
    activateEndingOption(options[endingState.selectedIndex]);
  }

  if (mouse.justPressed && hoveredIndex !== -1) {
    activateEndingOption(options[hoveredIndex]);
  }
}

function getEndingMenuOptions() {
  return [
    Object.freeze({ label: TEXT_CONTENT.ending.menu.restart, action: ENDING_MENU_ACTIONS.RESTART }),
    Object.freeze({ label: TEXT_CONTENT.ending.menu.title, action: ENDING_MENU_ACTIONS.TITLE }),
  ];
}

function getHoveredEndingOptionIndex(optionCount) {
  for (let index = 0; index < optionCount; index += 1) {
    if (isPointInRect(mouse.x, mouse.y, getEndingButtonRect(index, optionCount))) {
      return index;
    }
  }

  return -1;
}

function activateEndingOption(option) {
  if (!option) {
    return;
  }

  audioManager.playSfx("uiSelect", { volume: 0.52 });

  if (option.action === ENDING_MENU_ACTIONS.RESTART) {
    startNewGameFromTitle();
    return;
  }

  startSceneTransition(GAME_STATES.TITLE, {
    spawnX: PLAYER_CONFIG.SPAWN_X,
    facing: 1,
    duration: getTrailerAdjustedDuration(0.68),
    doorSfx: null,
  });
}

function getPresentationEndingOptions() {
  const actionText = getPresentationText().actions || {};
  return [
    { label: actionText.restartCurrent || "Restart Current Section", action: "restart" },
    { label: actionText.presentationMenu || "Presentation Menu", action: "menu" },
    { label: actionText.returnToTitle || actionText.backToTitle || "Return to Title", action: "title" },
  ];
}

function getPresentationEndingButtonRect(index, total) {
  const width = 172;
  const height = 28;
  const gap = 12;
  const totalWidth = total * width + (total - 1) * gap;
  return {
    x: Math.round((CANVAS_WIDTH - totalWidth) / 2) + index * (width + gap),
    y: 238,
    width,
    height,
  };
}

function getHoveredPresentationEndingOptionIndex(optionCount) {
  for (let index = 0; index < optionCount; index += 1) {
    if (isPointInRect(mouse.x, mouse.y, getPresentationEndingButtonRect(index, optionCount))) {
      return index;
    }
  }

  return -1;
}

function updatePresentationEndingControls() {
  const options = getPresentationEndingOptions();
  presentationState.endingSelectedIndex = clamp(
    presentationState.endingSelectedIndex,
    0,
    options.length - 1,
  );

  if (
    input.wasPressed("ArrowUp") ||
    input.wasPressed("ArrowLeft") ||
    input.wasPressed("KeyA")
  ) {
    presentationState.endingSelectedIndex =
      (presentationState.endingSelectedIndex + options.length - 1) % options.length;
    audioManager.playSfx("uiMove", { volume: 0.36 });
  }

  if (
    input.wasPressed("ArrowDown") ||
    input.wasPressed("ArrowRight") ||
    input.wasPressed("KeyD")
  ) {
    presentationState.endingSelectedIndex =
      (presentationState.endingSelectedIndex + 1) % options.length;
    audioManager.playSfx("uiMove", { volume: 0.36 });
  }

  const hoveredIndex = getHoveredPresentationEndingOptionIndex(options.length);
  if (hoveredIndex !== -1) {
    presentationState.endingSelectedIndex = hoveredIndex;
  }

  if (input.wasPressed("KeyP") || input.wasPressed("Escape")) {
    openPresentationMenuFromGameplay();
    return;
  }
  if (input.wasPressed("Backspace")) {
    restartPresentationSection();
    return;
  }
  if (input.wasPressed("PageUp") || input.wasPressed("BracketLeft")) {
    advancePresentationSection(-1);
    return;
  }
  if (input.wasPressed("PageDown") || input.wasPressed("BracketRight")) {
    advancePresentationSection(1);
    return;
  }

  if (input.wasPressed("KeyE") || input.wasPressed("Enter")) {
    activatePresentationEndingOption(options[presentationState.endingSelectedIndex]);
  }

  if (mouse.justPressed && hoveredIndex !== -1) {
    activatePresentationEndingOption(options[hoveredIndex]);
  }
}

function activatePresentationEndingOption(option) {
  if (!option) {
    return;
  }

  audioManager.playSfx("uiSelect", { volume: 0.36 });

  if (option.action === "restart") {
    restartPresentationSection();
    return;
  }

  if (option.action === "menu") {
    openPresentationMenuFromGameplay();
    return;
  }

  exitPresentationToTitle();
}

function updateTitleScene(scene, deltaSeconds) {
  scene.time += deltaSeconds;
  scene.grainTimer += deltaSeconds;

  while (scene.grainTimer >= 0.07) {
    scene.grainTimer -= 0.07;
    scene.grainFrame = (scene.grainFrame + 11) % 997;
  }
}

function updateTitleMenuControls() {
  const options = getTitleMenuOptions();
  titleMenuState.selectedIndex = clamp(titleMenuState.selectedIndex, 0, options.length - 1);

  if (input.wasPressed("ArrowUp")) {
    titleMenuState.selectedIndex =
      (titleMenuState.selectedIndex + options.length - 1) % options.length;
    audioManager.playSfx("uiMove", { volume: 0.46 });
  }

  if (input.wasPressed("ArrowDown")) {
    titleMenuState.selectedIndex = (titleMenuState.selectedIndex + 1) % options.length;
    audioManager.playSfx("uiMove", { volume: 0.46 });
  }

  const hoveredIndex = getHoveredTitleOptionIndex(options.length);
  if (hoveredIndex !== -1) {
    titleMenuState.selectedIndex = hoveredIndex;
  }

  if (input.wasPressed("KeyE") || input.wasPressed("Enter")) {
    activateTitleMenuOption(options[titleMenuState.selectedIndex]);
  }

  if (mouse.justPressed && hoveredIndex !== -1) {
    activateTitleMenuOption(options[hoveredIndex]);
  }
}

function activateTitleMenuOption(option) {
  if (!option) {
    return;
  }

  if (option.action !== TITLE_MENU_ACTIONS.EXIT) {
    titleMenuState.exitMessage = "";
    titleMenuState.exitMessageTimer = 0;
  }

  if (option.action === TITLE_MENU_ACTIONS.START) {
    audioManager.playSfx("uiSelect", { volume: 0.58 });
    startNewGameFromTitle();
    return;
  }

  if (option.action === TITLE_MENU_ACTIONS.CONTINUE) {
    audioManager.playSfx("uiSelect", { volume: 0.58 });
    continueRuntimeSession();
    return;
  }

  if (option.action === TITLE_MENU_ACTIONS.PRESENTATION) {
    audioManager.playSfx("uiSelect", { volume: 0.52 });
    openPresentationMenuFromTitle();
    return;
  }

  if (option.action === TITLE_MENU_ACTIONS.SETTINGS) {
    audioManager.playSfx("uiSelect", { volume: 0.52 });
    gameState.set(GAME_STATES.SETTINGS);
    settingsMenuState.selectedIndex = 0;
    return;
  }

  if (option.action === TITLE_MENU_ACTIONS.CREDITS) {
    audioManager.playSfx("uiSelect", { volume: 0.52 });
    gameState.set(GAME_STATES.CREDITS);
    return;
  }

  if (option.action === TITLE_MENU_ACTIONS.EXIT) {
    audioManager.playSfx("uiBack", { volume: 0.5 });
    titleMenuState.exitMessage = TEXT_CONTENT.title.exitMessage;
    titleMenuState.exitMessageTimer = 4.5;
  }
}

function startNewGameFromTitle() {
  resetRunProgressForNewGame();
  runtimeSession.valid = true;
  runtimeSession.state = GAME_STATES.PROLOGUE;
  runtimeSession.playerX = PLAYER_CONFIG.SPAWN_X;
  runtimeSession.facing = 1;
  startSceneTransition(GAME_STATES.PROLOGUE, {
    spawnX: 72,
    facing: 1,
    duration: getTrailerAdjustedDuration(0.86),
    doorSfx: null,
  });
}

function continueRuntimeSession() {
  if (!runtimeSession.valid) {
    return;
  }

  startSceneTransition(runtimeSession.state, {
    spawnX: runtimeSession.playerX,
    facing: runtimeSession.facing,
    duration: getTrailerAdjustedDuration(0.72),
    doorSfx: null,
  });
}

function resetRunProgressForNewGame() {
  Object.assign(chapterProgress, createChapterProgress());
  Object.assign(archiveProgress, createArchiveProgress());
  Object.assign(recordsProgress, createRecordsProgress());
  Object.assign(manuscriptProgress, createManuscriptProgress());
  Object.assign(realityProgress, createRealityProgress());
  Object.assign(classroomProgress, createClassroomProgress());
  Object.assign(circuitPuzzleState, createCircuitPuzzleState());
  Object.assign(chamberRingProgress, createChamberRingProgress());
  Object.assign(archivistProgress, createArchivistProgress());
  Object.assign(prologueProgress, createPrologueProgress());
  Object.assign(escapeProgress, createEscapeProgress());
  Object.assign(keypadState, createKeypadState());
  Object.assign(inspectOverlayState, createInspectOverlayState());
  endingState.selectedIndex = 0;
  endingState.pendingAfterInspect = false;
  endingState.reached = false;
  debug.showOverlay = false;
  closeDialogue();
  setJournalOpen(false, { silent: true });
  controlsState.open = false;
  objectiveState.currentId = TRAILER_MODE ? "enterCode" : "enterUniversity";
  objectiveState.completedIds = new Set();
  objectiveState.bannerTimer = 4;
  objectiveState.bannerText = OBJECTIVE_DATA[objectiveState.currentId].title;
  player.x = PLAYER_CONFIG.SPAWN_X;
  player.y = PLAYER_CONFIG.SPAWN_Y;
  player.velocityX = 0;
  player.facing = 1;
  player.animationTimer = 0;
  player.animationFrame = 0;
  player.animationMode = "idle";
  clampCameraToCurrentWorld(camera, player);
}

function cloneStateValue(value) {
  if (value instanceof Set) {
    return new Set(Array.from(value, cloneStateValue));
  }

  if (Array.isArray(value)) {
    return value.map(cloneStateValue);
  }

  if (!value || typeof value !== "object") {
    return value;
  }

  const clone = {};
  Object.keys(value).forEach((key) => {
    clone[key] = cloneStateValue(value[key]);
  });
  return clone;
}

function replaceStateObject(target, snapshot) {
  Object.keys(target).forEach((key) => {
    delete target[key];
  });
  Object.assign(target, cloneStateValue(snapshot));
}

function createNormalProgressSnapshot() {
  return {
    chapterProgress: cloneStateValue(chapterProgress),
    archiveProgress: cloneStateValue(archiveProgress),
    recordsProgress: cloneStateValue(recordsProgress),
    manuscriptProgress: cloneStateValue(manuscriptProgress),
    realityProgress: cloneStateValue(realityProgress),
    classroomProgress: cloneStateValue(classroomProgress),
    circuitPuzzleState: cloneStateValue(circuitPuzzleState),
    chamberRingProgress: cloneStateValue(chamberRingProgress),
    archivistProgress: cloneStateValue(archivistProgress),
    prologueProgress: cloneStateValue(prologueProgress),
    escapeProgress: cloneStateValue(escapeProgress),
    keypadState: cloneStateValue(keypadState),
    inspectOverlayState: cloneStateValue(inspectOverlayState),
    dialogueState: cloneStateValue(dialogueState),
    objectiveState: cloneStateValue(objectiveState),
    journalState: cloneStateValue(journalState),
    endingState: cloneStateValue(endingState),
    runtimeSession: cloneStateValue(runtimeSession),
    player: cloneStateValue(player),
    camera: cloneStateValue(camera),
    gameState: gameState.current,
  };
}

function restoreNormalProgressSnapshot(snapshot) {
  if (!snapshot) {
    return;
  }

  replaceStateObject(chapterProgress, snapshot.chapterProgress);
  replaceStateObject(archiveProgress, snapshot.archiveProgress);
  replaceStateObject(recordsProgress, snapshot.recordsProgress);
  replaceStateObject(manuscriptProgress, snapshot.manuscriptProgress);
  replaceStateObject(realityProgress, snapshot.realityProgress);
  replaceStateObject(classroomProgress, snapshot.classroomProgress);
  replaceStateObject(circuitPuzzleState, snapshot.circuitPuzzleState);
  replaceStateObject(chamberRingProgress, snapshot.chamberRingProgress);
  replaceStateObject(archivistProgress, snapshot.archivistProgress);
  replaceStateObject(prologueProgress, snapshot.prologueProgress);
  replaceStateObject(escapeProgress, snapshot.escapeProgress);
  replaceStateObject(keypadState, snapshot.keypadState);
  replaceStateObject(inspectOverlayState, snapshot.inspectOverlayState);
  replaceStateObject(dialogueState, snapshot.dialogueState);
  replaceStateObject(objectiveState, snapshot.objectiveState);
  replaceStateObject(journalState, snapshot.journalState);
  replaceStateObject(endingState, snapshot.endingState);
  replaceStateObject(runtimeSession, snapshot.runtimeSession);
  replaceStateObject(player, snapshot.player);
  replaceStateObject(camera, snapshot.camera);
}

function updateRuntimeSessionSnapshot() {
  if (presentationState.active || !isGameplayState() || transitionState.active) {
    return;
  }

  runtimeSession.valid = true;
  runtimeSession.state = gameState.current;
  runtimeSession.playerX = player.x;
  runtimeSession.facing = player.facing;
}

function getHoveredTitleOptionIndex(optionCount) {
  for (let index = 0; index < optionCount; index += 1) {
    if (isPointInRect(mouse.x, mouse.y, getTitleButtonRect(index, optionCount))) {
      return index;
    }
  }

  return -1;
}

function getPresentationText() {
  return TEXT_CONTENT.presentation || {};
}

function getPresentationSectionLabel(sectionId) {
  const presentationText = getPresentationText();
  return presentationText.sections?.[sectionId] || sectionId;
}

function getPresentationMenuOptions() {
  const presentationText = getPresentationText();
  const sectionText = presentationText.sections || {};
  const actionText = presentationText.actions || {};
  const options = PRESENTATION_SECTION_IDS.map((sectionId) => ({
    label: sectionText[sectionId] || getPresentationSectionLabel(sectionId),
    action: PRESENTATION_MENU_ACTIONS.LOAD_SECTION,
    sectionId,
  }));

  options.push({
    label: sectionText.fullPresentation || "Run Full Presentation",
    action: PRESENTATION_MENU_ACTIONS.RUN_FULL,
  });

  if (presentationState.active && presentationState.menuReturnState) {
    options.push({
      label: actionText.resumeSection || "Resume Section",
      action: PRESENTATION_MENU_ACTIONS.RESUME_SECTION,
    });
  }

  options.push(
    {
      label: actionText.restartCurrent || "Restart Current Section",
      action: PRESENTATION_MENU_ACTIONS.RESTART_CURRENT,
    },
    {
      label: actionText.previousSection || "Previous Section",
      action: PRESENTATION_MENU_ACTIONS.PREVIOUS_SECTION,
    },
    {
      label: actionText.nextSection || "Next Section",
      action: PRESENTATION_MENU_ACTIONS.NEXT_SECTION,
    },
    {
      label: actionText.backToTitle || "Back to Title",
      action: PRESENTATION_MENU_ACTIONS.BACK_TO_TITLE,
    },
  );

  return options;
}

function getPresentationMenuLayout(optionCount = getPresentationMenuOptions().length) {
  const panelWidth = Math.min(
    PRESENTATION_UI.MENU_WIDTH,
    CANVAS_WIDTH - PRESENTATION_UI.SAFE_X * 2,
  );
  const panelHeight = Math.min(
    PRESENTATION_UI.MENU_HEIGHT,
    CANVAS_HEIGHT - PRESENTATION_UI.SAFE_Y * 2,
  );
  const rowHeight = optionCount >= 12 ? 14 : 15;
  const rowGap = 2;

  return {
    x: Math.round((CANVAS_WIDTH - panelWidth) / 2),
    y: Math.round((CANVAS_HEIGHT - panelHeight) / 2),
    width: panelWidth,
    height: panelHeight,
    contentX: Math.round((CANVAS_WIDTH - panelWidth) / 2) + PRESENTATION_UI.MENU_PADDING_X,
    contentWidth: panelWidth - PRESENTATION_UI.MENU_PADDING_X * 2,
    titleY: Math.round((CANVAS_HEIGHT - panelHeight) / 2) + PRESENTATION_UI.MENU_PADDING_Y,
    currentY: Math.round((CANVAS_HEIGHT - panelHeight) / 2) + 46,
    listTitleY: Math.round((CANVAS_HEIGHT - panelHeight) / 2) + 66,
    listY: Math.round((CANVAS_HEIGHT - panelHeight) / 2) + 84,
    footerY: Math.round((CANVAS_HEIGHT - panelHeight) / 2) + panelHeight - 24,
    rowHeight,
    rowGap,
  };
}

function getPresentationButtonRect(index, optionCount = getPresentationMenuOptions().length) {
  const layout = getPresentationMenuLayout(optionCount);

  return {
    x: layout.contentX,
    y: layout.listY + index * (layout.rowHeight + layout.rowGap),
    width: layout.contentWidth,
    height: layout.rowHeight,
  };
}

function getHoveredPresentationOptionIndex() {
  const options = getPresentationMenuOptions();
  for (let index = 0; index < options.length; index += 1) {
    if (isPointInRect(mouse.x, mouse.y, getPresentationButtonRect(index, options.length))) {
      return index;
    }
  }

  return -1;
}

function openPresentationMenuFromTitle() {
  presentationState.selectedMenuIndex = 0;
  presentationState.menuReturnState = null;
  gameState.set(GAME_STATES.PRESENTATION_MENU);
}

function openPresentationMenuFromGameplay() {
  if (!presentationState.active) {
    return;
  }

  presentationState.menuReturnState = gameState.current;
  presentationState.selectedMenuIndex = 0;
  closeDialogue();
  closeKeypad();
  closeInspectOverlay();
  setJournalOpen(false, { silent: true });
  controlsState.open = false;
  interactionState.activeInteractable = null;
  gameState.set(GAME_STATES.PRESENTATION_MENU);
}

function resumePresentationSection() {
  if (!presentationState.active || !presentationState.menuReturnState) {
    return;
  }

  const targetState = presentationState.menuReturnState;
  presentationState.menuReturnState = null;
  gameState.set(targetState);
}

function clearPresentationState() {
  presentationState.active = false;
  presentationState.fullRoute = false;
  presentationState.currentSectionIndex = 0;
  presentationState.currentSectionId = null;
  presentationState.menuReturnState = null;
  presentationState.overlayVisible = true;
  presentationState.explanationPaused = false;
  presentationState.endingSelectedIndex = 0;
  presentationState.cardTitle = "";
  presentationState.cardBody = "";
  presentationState.cardTimer = 0;
  presentationState.promptText = "";
  presentationState.promptTimer = 0;
  presentationState.normalSnapshot = null;
}

function exitPresentationToTitle() {
  const snapshot = presentationState.normalSnapshot;
  if (snapshot) {
    restoreNormalProgressSnapshot(snapshot);
  }
  clearPresentationState();
  debug.showOverlay = false;
  titleMenuState.selectedIndex = 0;
  gameState.set(GAME_STATES.TITLE);
  enterTitleScene();
}

function setPresentationNotice(message) {
  if (!message) {
    return;
  }

  if (presentationState.active) {
    presentationState.promptText = message;
    presentationState.promptTimer = PRESENTATION_UI.PROMPT_SECONDS;
    return;
  }

  realityProgress.message = message;
  realityProgress.messageTimer = 2.4;
}

function showPresentationSectionCard(sectionId) {
  const card = getPresentationText().cards?.[sectionId] || {};
  presentationState.cardTitle = card.title || getPresentationSectionLabel(sectionId);
  presentationState.cardBody = card.body || "";
  presentationState.cardTimer = 1.8;
}

function beginPresentationSection(sectionId, options = {}) {
  const loader = PRESENTATION_SECTION_LOADERS[sectionId];
  if (typeof loader !== "function") {
    return;
  }

  if (!presentationState.active || !presentationState.normalSnapshot) {
    presentationState.normalSnapshot = createNormalProgressSnapshot();
  }

  presentationState.active = true;
  presentationState.fullRoute = Boolean(options.fullRoute);
  presentationState.currentSectionId = sectionId;
  presentationState.currentSectionIndex = PRESENTATION_SECTION_IDS.indexOf(sectionId);
  if (presentationState.currentSectionIndex < 0) {
    presentationState.currentSectionIndex = 0;
  }
  presentationState.menuReturnState = null;
  presentationState.overlayVisible = true;
  presentationState.explanationPaused = false;
  presentationState.endingSelectedIndex = 0;
  debug.showOverlay = false;

  resetPresentationCheckpointState();
  loader();
  showPresentationSectionCard(sectionId);
}

function restartPresentationSection() {
  const sectionId = presentationState.currentSectionId || PRESENTATION_SECTION_IDS[presentationState.currentSectionIndex] || PRESENTATION_SECTION_IDS[0];
  beginPresentationSection(sectionId, { fullRoute: presentationState.fullRoute });
}

function advancePresentationSection(direction) {
  const currentIndex = Math.max(0, presentationState.currentSectionIndex);
  const nextIndex = Math.min(PRESENTATION_SECTION_IDS.length - 1, Math.max(0, currentIndex + direction));
  beginPresentationSection(PRESENTATION_SECTION_IDS[nextIndex], { fullRoute: presentationState.fullRoute });
}

function activatePresentationMenuOption(option) {
  audioManager.playSfx("uiSelect", { volume: 0.38 });

  if (option.action === PRESENTATION_MENU_ACTIONS.LOAD_SECTION) {
    beginPresentationSection(option.sectionId);
    return;
  }

  if (option.action === PRESENTATION_MENU_ACTIONS.RUN_FULL) {
    beginPresentationSection(PRESENTATION_SECTION_IDS[0], { fullRoute: true });
    return;
  }

  if (option.action === PRESENTATION_MENU_ACTIONS.RESUME_SECTION) {
    resumePresentationSection();
    return;
  }

  if (option.action === PRESENTATION_MENU_ACTIONS.PREVIOUS_SECTION) {
    advancePresentationSection(-1);
    return;
  }

  if (option.action === PRESENTATION_MENU_ACTIONS.RESTART_CURRENT) {
    restartPresentationSection();
    return;
  }

  if (option.action === PRESENTATION_MENU_ACTIONS.NEXT_SECTION) {
    advancePresentationSection(1);
    return;
  }

  if (option.action === PRESENTATION_MENU_ACTIONS.BACK_TO_TITLE) {
    exitPresentationToTitle();
  }
}

function updatePresentationMenuControls() {
  const options = getPresentationMenuOptions();
  presentationState.selectedMenuIndex = clamp(presentationState.selectedMenuIndex, 0, options.length - 1);
  const hoveredIndex = getHoveredPresentationOptionIndex();
  if (hoveredIndex >= 0) {
    presentationState.selectedMenuIndex = hoveredIndex;
  }

  if (input.wasPressed("ArrowUp")) {
    presentationState.selectedMenuIndex = (presentationState.selectedMenuIndex - 1 + options.length) % options.length;
    audioManager.playSfx("uiMove", { volume: 0.32 });
  }
  if (input.wasPressed("ArrowDown")) {
    presentationState.selectedMenuIndex = (presentationState.selectedMenuIndex + 1) % options.length;
    audioManager.playSfx("uiMove", { volume: 0.32 });
  }

  const selectedOption = options[presentationState.selectedMenuIndex];
  if ((input.wasPressed("KeyE") || input.wasPressed("Enter")) && selectedOption) {
    activatePresentationMenuOption(selectedOption);
  }
  if (mouse.justPressed && hoveredIndex >= 0) {
    activatePresentationMenuOption(options[hoveredIndex]);
  }
  if (input.wasPressed("Escape")) {
    if (presentationState.active && presentationState.menuReturnState) {
      resumePresentationSection();
    } else {
      exitPresentationToTitle();
    }
  }
}

function resetPresentationCheckpointState() {
  resetRunProgressForNewGame();
  closeDialogue();
  closeKeypad();
  closeInspectOverlay();
  setJournalOpen(false, { silent: true });
  controlsState.open = false;
  interactionState.activeInteractable = null;
  interactionState.lastPromptId = null;
  recordsProgress.activeCaseId = null;
  transitionState.active = false;
  transitionState.phase = "none";
  transitionState.timer = 0;
  transitionState.targetState = null;
  transitionState.spawnX = null;
  presentationState.cardTimer = 0;
  presentationState.explanationPaused = false;
  presentationState.promptText = "";
  presentationState.promptTimer = 0;
}

function addCompletedPresentationObjectives(objectiveIds) {
  objectiveIds.forEach((objectiveId) => {
    if (OBJECTIVE_DATA[objectiveId]) {
      objectiveState.completedIds.add(objectiveId);
    }
  });
}

function collectPresentationClues(clueIds) {
  clueIds.forEach((clueId) => {
    if (CLUE_DATA[clueId]) {
      collectClue(clueId, { silent: true });
    }
  });
}

function placePresentationPlayer(x, facing = 1) {
  player.x = x;
  player.y = PLAYER_CONFIG.SPAWN_Y;
  player.velocityX = 0;
  player.facing = facing;
  clampCameraToCurrentWorld(camera, player);
}

function preparePresentationCorridorSolved() {
  Object.assign(chapterProgress, {
    directoryRead: true,
    archiveDoorChecked: true,
    lockPanelInspected: true,
    maintenanceNoticeRead: true,
    securityMemoRead: true,
    maintenanceKeyCollected: true,
    electricalCabinetOpen: true,
    circuitPuzzleSolved: true,
    powerReset: true,
    archiveDoorUnlocked: true,
    archiveDoorRevealed: true,
  });
  collectPresentationClues([
    "directory",
    "lockPanel",
    "maintenanceNotice",
    "securityMemo",
    "maintenanceKey",
    "powerReset",
    "archiveUnlocked",
  ]);
  addCompletedPresentationObjectives([
    "enterUniversity",
    "findArchive",
    "checkDoor",
    "resetPower",
    "findCode",
    "enterCode",
    "enterArchive",
  ]);
}

function preparePresentationRecordsSolved() {
  recordsProgress.entered = true;
  recordsProgress.completed = true;
  recordsProgress.solvedCases = new Set(["mara", "elias", "jonah"]);
  recordsProgress.photographedCases = new Set(["mara", "elias", "jonah"]);
  collectPresentationClues([
    "maraVossCase",
    "eliasWardCase",
    "jonahValeCase",
    "jonahAlignmentLog",
  ]);
  addCompletedPresentationObjectives(["investigateMissingPersons", "returnFromRecordsWing"]);
}

function preparePresentationArchiveSearch(tableRevealed = false) {
  preparePresentationCorridorSolved();
  preparePresentationRecordsSolved();
  archiveProgress.entered = true;
  archiveProgress.entranceDialogueShown = true;
  archiveProgress.indexRead = true;
  archiveProgress.searchedShelves = new Set([
    "personnelTransfer",
    "waterDamage",
    "restrictedAccess",
  ]);
  archiveProgress.firstUsefulRecordFound = true;
  archiveProgress.coordinateFound = true;
  archiveProgress.ladderX = ARCHIVE_ROOM.LADDER_TARGET_X;
  archiveProgress.ladderPosition = ARCHIVE_ROOM.LADDER_TARGET_X;
  archiveProgress.ladderMoved = true;
  archiveProgress.ladderLockedAtC13 = true;
  archiveProgress.sealedStorageKeyCollected = true;
  archiveProgress.filingCabinetUnlocked = true;
  archiveProgress.photographFound = true;
  archiveProgress.accessCardFound = true;
  archiveProgress.removedPageNoteFound = true;
  archiveProgress.restrictedGateOpened = tableRevealed;
  archiveProgress.manuscriptTableRevealed = tableRevealed;
  archiveProgress.musicPhase = tableRevealed ? "tension" : "pulse";
  collectPresentationClues([
    "archiveIndex",
    "shelfPersonnelRecord",
    "shelfAtmosphericRecord",
    "shelfAccessRecord",
    "handwrittenCoordinate",
    "sealedStorageKey",
    "cabinetPhotograph",
    "archiveAccessCard",
    "removedPageNote",
  ]);
  if (tableRevealed) {
    collectPresentationClues(["manuscriptTableReveal"]);
  }
  addCompletedPresentationObjectives([
    "locateRestricted",
    "moveArchiveLadder",
    "unlockFilingCabinet",
    "useArchiveAccessCard",
  ]);
}

function preparePresentationManuscriptSolved() {
  archiveProgress.manuscriptSequenceStarted = true;
  manuscriptProgress.entered = true;
  manuscriptProgress.fragments.forEach((fragment) => {
    const data = getFragmentData(fragment.id);
    fragment.x = data.targetX;
    fragment.y = data.targetY;
    fragment.rotation = data.targetRotation;
    fragment.placed = true;
  });
  manuscriptProgress.pageReconstructed = true;
  manuscriptProgress.manuscriptCompleted = true;
  manuscriptProgress.manuscriptPatternDiscovered = true;
  manuscriptProgress.marginMarksRevealed = true;
  manuscriptProgress.symbolSequence = [...MANUSCRIPT_SYMBOL_SEQUENCE];
  manuscriptProgress.symbolStageSolved = true;
  manuscriptProgress.committedToFinalStage = true;
  manuscriptProgress.rings.forEach((ring, index) => {
    ring.rotation = MANUSCRIPT_RINGS[index].target;
  });
  manuscriptProgress.stage = MANUSCRIPT_STAGES.SOLVED;
  manuscriptProgress.solved = true;
  manuscriptProgress.realityChanged = true;
  manuscriptProgress.finalTriggered = true;
  manuscriptProgress.returnTimer = 0;
  manuscriptProgress.glitchTimer = 0;
  collectPresentationClues([
    "reconstructedMargin",
    "manuscriptPattern",
    "manuscriptControlInterface",
  ]);
  addCompletedPresentationObjectives(["reconstructPage", "interpretSymbols", "alignMissingPage"]);
}

function preparePresentationRealitySymbols() {
  REALITY_CHANGE_SYMBOLS.forEach((detail) => discoverRealitySymbol(detail.id, { silent: true }));
  realityProgress.archiveExitLooped = true;
  realityProgress.distortedEntries = 1;
  realityProgress.lightShutdownCount = 2;
  realityProgress.musicIntensity = REALITY_CHANGE_SYMBOLS.length;
}

function loadPresentationIntroduction() {
  switchScene(GAME_STATES.PROLOGUE, 72, 1);
  prologueProgress.timer = 24;
  prologueProgress.controlGranted = true;
  setCurrentObjective("enterUniversity");
  placePresentationPlayer(72, 1);
}

function loadPresentationArchiveMystery() {
  preparePresentationArchiveSearch(false);
  switchScene(GAME_STATES.ARCHIVE, ARCHIVE_ROOM.TABLE_X - 190, 1);
  setCurrentObjective("useArchiveAccessCard");
  placePresentationPlayer(ARCHIVE_ROOM.TABLE_X - 190, 1);
}

function loadPresentationManuscript() {
  preparePresentationArchiveSearch(true);
  switchScene(GAME_STATES.MANUSCRIPT, ARCHIVE_ROOM.TABLE_X, 1);
  manuscriptProgress.stage = MANUSCRIPT_STAGES.RECONSTRUCT;
  setCurrentObjective("reconstructPage");
}

function loadPresentationRealityShift() {
  preparePresentationArchiveSearch(true);
  preparePresentationManuscriptSolved();
  realityProgress.chapterStarted = true;
  realityProgress.archiveReturnSeen = true;
  preparePresentationRealitySymbols();
  switchScene(GAME_STATES.ARCHIVE, ARCHIVE_ROOM.TABLE_X - 82, -1);
  setCurrentObjective("chooseRealDoor");
  placePresentationPlayer(ARCHIVE_ROOM.TABLE_X - 82, -1);
}

function loadPresentationBoss() {
  preparePresentationArchiveSearch(true);
  preparePresentationManuscriptSolved();
  preparePresentationRealitySymbols();
  realityProgress.correctDoorChosen = true;
  realityProgress.sealedSectionReached = true;
  realityProgress.passageOpen = true;
  realityProgress.finalPageVisible = true;
  realityProgress.finalPageCollected = true;
  chamberRingProgress.entered = true;
  chamberRingProgress.ringSolved = true;
  switchScene(GAME_STATES.ARCHIVIST, ARCHIVIST_CHAMBER.START_X, 1);
  configurePresentationBossSealPhase();
}

function loadPresentationEnding() {
  preparePresentationArchiveSearch(true);
  preparePresentationManuscriptSolved();
  preparePresentationRealitySymbols();
  chamberRingProgress.ringSolved = true;
  addCompletedPresentationObjectives(["confrontArchivist"]);
  switchScene(GAME_STATES.ESCAPE, 3238, 1);
  escapeProgress.cameraChoiceActive = true;
  escapeProgress.cameraChoice = null;
  escapeProgress.cameraChoiceIndex = 0;
  escapeProgress.detourCompleted = true;
  escapeProgress.timer = 12;
  setCurrentObjective("chooseCamera");
  placePresentationPlayer(3238, 1);
}

function setPresentationManuscriptStage(stage) {
  manuscriptProgress.stage = stage;
  manuscriptProgress.inputCooldown = 0;
  manuscriptProgress.message = "";
  manuscriptProgress.messageTimer = 0;

  if (stage === MANUSCRIPT_STAGES.RECONSTRUCT) {
    Object.assign(manuscriptProgress, createManuscriptProgress());
    manuscriptProgress.entered = true;
    setCurrentObjective("reconstructPage");
    return;
  }

  manuscriptProgress.fragments.forEach((fragment) => {
    const data = getFragmentData(fragment.id);
    fragment.x = data.targetX;
    fragment.y = data.targetY;
    fragment.rotation = data.targetRotation;
    fragment.placed = true;
  });
  manuscriptProgress.pageReconstructed = true;
  manuscriptProgress.manuscriptCompleted = true;
  manuscriptProgress.manuscriptPatternDiscovered = true;
  manuscriptProgress.marginMarksRevealed = true;
  collectPresentationClues(["reconstructedMargin", "manuscriptPattern"]);

  if (stage === MANUSCRIPT_STAGES.PATTERN) {
    manuscriptProgress.symbolSequence = [];
    manuscriptProgress.symbolStageSolved = false;
    manuscriptProgress.committedToFinalStage = false;
    setCurrentObjective("interpretSymbols");
    return;
  }

  if (stage === MANUSCRIPT_STAGES.SYMBOLS) {
    manuscriptProgress.symbolSequence = [];
    manuscriptProgress.symbolStageSolved = false;
    manuscriptProgress.committedToFinalStage = false;
    setCurrentObjective("interpretSymbols");
    return;
  }

  if (stage === MANUSCRIPT_STAGES.ALIGNMENT) {
    manuscriptProgress.symbolSequence = [...MANUSCRIPT_SYMBOL_SEQUENCE];
    manuscriptProgress.symbolStageSolved = true;
    manuscriptProgress.committedToFinalStage = true;
    manuscriptProgress.rings.forEach((ring) => {
      ring.rotation = 0;
    });
    setCurrentObjective("alignMissingPage");
  }
}

function advancePresentationManuscriptStage() {
  if (manuscriptProgress.stage === MANUSCRIPT_STAGES.RECONSTRUCT) {
    autoCompleteCurrentManuscriptStage();
    setPresentationNotice(getPresentationText().messages?.puzzleStageAdvanced);
    return;
  }
  if (manuscriptProgress.stage === MANUSCRIPT_STAGES.PATTERN) {
    setPresentationManuscriptStage(MANUSCRIPT_STAGES.SYMBOLS);
    setPresentationNotice(getPresentationText().messages?.puzzleStageAdvanced);
    return;
  }
  if (manuscriptProgress.stage === MANUSCRIPT_STAGES.SYMBOLS) {
    if (!manuscriptProgress.symbolStageSolved) {
      autoCompleteCurrentManuscriptStage();
    }
    commitToFinalAlignmentStage();
    setPresentationNotice(getPresentationText().messages?.puzzleStageAdvanced);
    return;
  }
  if (manuscriptProgress.stage === MANUSCRIPT_STAGES.ALIGNMENT) {
    autoCompleteCurrentManuscriptStage();
    setPresentationNotice(getPresentationText().messages?.puzzleStageAdvanced);
  }
}

function rewindPresentationManuscriptStage() {
  if (manuscriptProgress.stage === MANUSCRIPT_STAGES.PATTERN) {
    setPresentationManuscriptStage(MANUSCRIPT_STAGES.RECONSTRUCT);
  } else if (manuscriptProgress.stage === MANUSCRIPT_STAGES.SYMBOLS) {
    setPresentationManuscriptStage(MANUSCRIPT_STAGES.PATTERN);
  } else if (manuscriptProgress.stage === MANUSCRIPT_STAGES.ALIGNMENT) {
    setPresentationManuscriptStage(MANUSCRIPT_STAGES.SYMBOLS);
  }
  setPresentationNotice(getPresentationText().messages?.puzzleStageRewound);
}

function completePresentationManuscriptStage() {
  autoCompleteCurrentManuscriptStage();
  setPresentationNotice(getPresentationText().messages?.puzzleStageCompleted);
}

function configurePresentationBossSealPhase() {
  resetArchivistCombat();
  archivistProgress.bossHealth = 35;
  archivistProgress.bossInvulnerable = true;
  archivistProgress.bossPhase = 2;
  archivistProgress.symbolInterruptionActive = true;
  archivistProgress.symbolInterruptionSequence = [0, 1];
  archivistProgress.falseCopies = [420, 1020];
  archivistProgress.bossAttackState = null;
  archivistProgress.bossAttackCooldown = 1.4;
  archivistProgress.message = TEXT_CONTENT.boss.messages.machineSeal;
  archivistProgress.messageTimer = 3;
  setCurrentObjective("breakArchivistSeal");
  setPresentationNotice(getPresentationText().messages?.bossSealReady);
}

function configurePresentationBossVulnerable() {
  resetArchivistCombat();
  archivistProgress.bossPhase = 3;
  archivistProgress.bossHealth = 35;
  archivistProgress.bossInvulnerable = false;
  archivistProgress.symbolInterruptionActive = false;
  archivistProgress.falseCopies = [];
  archivistProgress.bossAttackCooldown = 1.1;
  archivistProgress.message = TEXT_CONTENT.boss.messages.finalEntryExposed;
  archivistProgress.messageTimer = 3;
  setCurrentObjective("confrontArchivist");
  setPresentationNotice(getPresentationText().messages?.bossVulnerable);
}

function triggerPresentationBossDefeat() {
  configurePresentationBossVulnerable();
  defeatArchivist();
  setPresentationNotice(getPresentationText().messages?.bossDefeat);
}

function activatePresentationSpecialAction(action) {
  if (gameState.current === GAME_STATES.MANUSCRIPT) {
    if (action === "previousStage") {
      rewindPresentationManuscriptStage();
    } else if (action === "completeStage") {
      completePresentationManuscriptStage();
    } else if (action === "nextStage") {
      advancePresentationManuscriptStage();
    }
    return true;
  }

  if (gameState.current === GAME_STATES.ARCHIVIST) {
    if (action === "restartBoss") {
      loadPresentationBoss();
    } else if (action === "sealPhase") {
      configurePresentationBossSealPhase();
    } else if (action === "vulnerablePhase") {
      configurePresentationBossVulnerable();
    } else if (action === "defeatBoss") {
      triggerPresentationBossDefeat();
    }
    return true;
  }

  return false;
}

function getPresentationSpecialButtons() {
  if (gameState.current === GAME_STATES.MANUSCRIPT) {
    return [
      { label: "Prev", action: "previousStage" },
      { label: "Complete", action: "completeStage" },
      { label: "Next", action: "nextStage" },
    ];
  }

  return [];
}

function getPresentationSpecialButtonRect(index) {
  if (gameState.current === GAME_STATES.MANUSCRIPT) {
    const width = 66;
    const gap = 6;
    const totalWidth = width * 3 + gap * 2;
    const startX = MANUSCRIPT_VIEW.PANEL_X + MANUSCRIPT_VIEW.PANEL_WIDTH - totalWidth;
    return {
      x: startX + index * (width + gap),
      y: MANUSCRIPT_VIEW.PANEL_Y + MANUSCRIPT_VIEW.PANEL_HEIGHT + 8,
      width,
      height: 18,
    };
  }

  return {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  };
}

function updatePresentationSpecialControls() {
  if (gameState.current === GAME_STATES.MANUSCRIPT) {
    if (input.wasPressed("Digit7")) return activatePresentationSpecialAction("previousStage");
    if (input.wasPressed("Digit8")) return activatePresentationSpecialAction("completeStage");
    if (input.wasPressed("Digit9")) return activatePresentationSpecialAction("nextStage");
  }

  if (gameState.current === GAME_STATES.ARCHIVIST) {
    if (input.wasPressed("Digit1")) return activatePresentationSpecialAction("restartBoss");
    if (input.wasPressed("Digit2")) return activatePresentationSpecialAction("sealPhase");
    if (input.wasPressed("Digit3")) return activatePresentationSpecialAction("vulnerablePhase");
    if (input.wasPressed("Digit4")) return activatePresentationSpecialAction("defeatBoss");
  }

  if (mouse.justPressed) {
    const buttons = getPresentationSpecialButtons();
    const clickedIndex = buttons.findIndex((button, index) =>
      isPointInRect(mouse.x, mouse.y, getPresentationSpecialButtonRect(index)),
    );
    if (clickedIndex !== -1) {
      return activatePresentationSpecialAction(buttons[clickedIndex].action);
    }
  }

  return false;
}

function updatePresentationControls(deltaSeconds) {
  if (!presentationState.active || gameState.current === GAME_STATES.PRESENTATION_MENU) {
    return false;
  }

  const cardWasVisible = presentationState.cardTimer > 0;
  if (cardWasVisible) {
    presentationState.cardTimer = Math.max(0, presentationState.cardTimer - deltaSeconds);
    if (
      input.wasPressed("KeyE") ||
      input.wasPressed("Enter") ||
      input.wasPressed("Space") ||
      mouse.justPressed
    ) {
      presentationState.cardTimer = 0;
    }
    return true;
  }

  if (input.wasPressed("KeyH")) {
    presentationState.overlayVisible = !presentationState.overlayVisible;
    audioManager.playSfx("uiSelect", { volume: 0.28 });
    return true;
  }

  if (input.wasPressed("KeyP")) {
    openPresentationMenuFromGameplay();
    audioManager.playSfx("uiSelect", { volume: 0.32 });
    return true;
  }

  if (input.wasPressed("KeyY")) {
    presentationState.explanationPaused = !presentationState.explanationPaused;
    setPresentationNotice(
      presentationState.explanationPaused
        ? getPresentationText().messages?.explanationPaused
        : getPresentationText().messages?.explanationResumed,
    );
    audioManager.playSfx("uiSelect", { volume: 0.26 });
    return true;
  }

  if (input.wasPressed("PageDown") || input.wasPressed("BracketRight")) {
    advancePresentationSection(1);
    return true;
  }

  if (input.wasPressed("PageUp") || input.wasPressed("BracketLeft")) {
    advancePresentationSection(-1);
    return true;
  }

  if (input.wasPressed("Backspace")) {
    restartPresentationSection();
    return true;
  }

  if (updatePresentationSpecialControls()) {
    return true;
  }

  return presentationState.explanationPaused;
}

function updatePresentationPausedVisuals(deltaSeconds) {
  const scene = getActiveVisualScene();

  if (!scene || typeof scene.time !== "number") {
    return;
  }

  scene.time += deltaSeconds * 0.28;
  if (typeof scene.grainTimer === "number") {
    scene.grainTimer += deltaSeconds * 0.28;
  }
}

function updatePresentationUiTimers(deltaSeconds) {
  if (!presentationState.active) {
    return;
  }

  presentationState.promptTimer = Math.max(0, presentationState.promptTimer - deltaSeconds);
  if (presentationState.promptTimer === 0) {
    presentationState.promptText = "";
  }
}

function updateSettingsMenuControls() {
  if (input.wasPressed("Escape")) {
    returnToTitleFromSubmenu();
    return;
  }

  if (input.wasPressed("ArrowUp")) {
    settingsMenuState.selectedIndex =
      (settingsMenuState.selectedIndex + SETTINGS_ITEMS.length - 1) % SETTINGS_ITEMS.length;
    audioManager.playSfx("uiMove", { volume: 0.46 });
  }

  if (input.wasPressed("ArrowDown")) {
    settingsMenuState.selectedIndex = (settingsMenuState.selectedIndex + 1) % SETTINGS_ITEMS.length;
    audioManager.playSfx("uiMove", { volume: 0.46 });
  }

  if (input.wasPressed("ArrowLeft") || input.wasPressed("KeyA")) {
    adjustSelectedSetting(-1);
  }

  if (input.wasPressed("ArrowRight") || input.wasPressed("KeyD")) {
    adjustSelectedSetting(1);
  }

  if (input.wasPressed("KeyE") || input.wasPressed("Enter")) {
    toggleSelectedSetting();
  }

  updateSettingsMouseInput();
}

function updateSettingsMouseInput() {
  SETTINGS_ITEMS.forEach((item, index) => {
    const row = getSettingsRowRect(index);

    if (!isPointInRect(mouse.x, mouse.y, row)) {
      return;
    }

    settingsMenuState.selectedIndex = index;

    if (item.type === "range" && mouse.isDown) {
      const slider = getSettingsSliderRect(index);
      const value = item.min + clamp((mouse.x - slider.x) / slider.width, 0, 1) * (item.max - item.min);

      updateSettingValue(item.id, value, { silent: true });
      return;
    }

    if (mouse.justPressed) {
      toggleSelectedSetting();
    }
  });
}

function updateCreditsControls() {
  if (
    input.wasPressed("Escape") ||
    input.wasPressed("KeyE") ||
    input.wasPressed("Enter") ||
    isMouseClickInRect(getCreditsBackButtonRect())
  ) {
    returnToTitleFromSubmenu();
  }
}

function returnToTitleFromSubmenu() {
  gameState.set(GAME_STATES.TITLE);
  titleMenuState.selectedIndex = 0;
  debug.showOverlay = false;
  audioManager.playSfx("uiBack", { volume: 0.5 });
  audioManager.stopAmbience({ fadeSeconds: 0.8 });
  audioManager.playMusic("titleTheme", { fadeSeconds: 1.2, volume: 0.3 });
}

function createInputManager(trackedKeys) {
  const trackedCodes = new Set(trackedKeys.map((key) => key.code));
  const pressed = new Set();
  const justPressed = new Set();

  function handleKeyDown(event) {
    if (!trackedCodes.has(event.code)) {
      return;
    }

    event.preventDefault();
    if (!pressed.has(event.code)) {
      justPressed.add(event.code);
    }

    pressed.add(event.code);
  }

  function handleKeyUp(event) {
    if (!trackedCodes.has(event.code)) {
      return;
    }

    event.preventDefault();
    pressed.delete(event.code);
  }

  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);

  return {
    isPressed(code) {
      return pressed.has(code);
    },
    wasPressed(code) {
      return justPressed.has(code);
    },
    finishFrame() {
      justPressed.clear();
    },
    clear() {
      pressed.clear();
      justPressed.clear();
    },
  };
}

function createMouseManager(targetCanvas) {
  const pointer = {
    x: 0,
    y: 0,
    isDown: false,
    justPressed: false,
    justReleased: false,
  };

  function updatePosition(event) {
    const rect = targetCanvas.getBoundingClientRect();
    const scaleX = CANVAS_WIDTH / Math.max(1, rect.width);
    const scaleY = CANVAS_HEIGHT / Math.max(1, rect.height);

    pointer.x = clamp((event.clientX - rect.left) * scaleX, 0, CANVAS_WIDTH);
    pointer.y = clamp((event.clientY - rect.top) * scaleY, 0, CANVAS_HEIGHT);
  }

  function handlePointerDown(event) {
    updatePosition(event);
    pointer.isDown = true;
    pointer.justPressed = true;
    targetCanvas.setPointerCapture?.(event.pointerId);
    event.preventDefault();
  }

  function handlePointerMove(event) {
    updatePosition(event);
  }

  function handlePointerUp(event) {
    updatePosition(event);
    pointer.isDown = false;
    pointer.justReleased = true;
    targetCanvas.releasePointerCapture?.(event.pointerId);
    event.preventDefault();
  }

  targetCanvas.addEventListener("pointerdown", handlePointerDown);
  targetCanvas.addEventListener("pointermove", handlePointerMove);
  targetCanvas.addEventListener("pointerup", handlePointerUp);
  targetCanvas.addEventListener("pointercancel", handlePointerUp);

  return {
    get x() {
      return pointer.x;
    },
    get y() {
      return pointer.y;
    },
    get isDown() {
      return pointer.isDown;
    },
    get justPressed() {
      return pointer.justPressed;
    },
    get justReleased() {
      return pointer.justReleased;
    },
    finishFrame() {
      pointer.justPressed = false;
      pointer.justReleased = false;
    },
    clear() {
      pointer.isDown = false;
      pointer.justPressed = false;
      pointer.justReleased = false;
    },
  };
}

function createPlayer(config) {
  return {
    x: config.SPAWN_X,
    y: config.SPAWN_Y,
    width: config.WIDTH,
    height: config.HEIGHT,
    velocityX: 0,
    facing: 1,
    animationTimer: 0,
    animationFrame: 0,
    animationMode: "idle",
    isWalking: false,
    isInteracting: false,
  };
}

function createCamera(target) {
  const world = getCurrentWorld();

  return {
    x: clamp(
      getCameraTargetX(target),
      world.CAMERA_LEFT_BOUNDARY,
      world.CAMERA_RIGHT_BOUNDARY - CANVAS_WIDTH,
    ),
  };
}

function update(deltaSeconds) {
  updateDebugControls();
  updateTrailerShortcuts();
  updateControlsOverlayControls();
  updateMenuScreens(deltaSeconds);
  updateEndingControls();
  updatePresentationUiTimers(deltaSeconds);
  if (updatePresentationControls(deltaSeconds)) {
    if (presentationState.explanationPaused) {
      updatePresentationPausedVisuals(deltaSeconds);
    }
    updateObjectiveState(deltaSeconds);
    input.finishFrame();
    mouse.finishFrame();
    return;
  }
  updateDialogue(deltaSeconds);
  updateJournalControls();
  updateKeypad(deltaSeconds);
  updateInspectOverlayControls();
  updateObjectiveState(deltaSeconds);
  updateTransition(deltaSeconds);
  updateCircuitPuzzle(deltaSeconds);

  if (gameState.current === GAME_STATES.CORRIDOR) {
    updateCorridorScene(corridorScene, deltaSeconds);
  } else if (gameState.current === GAME_STATES.ARCHIVE) {
    updateArchiveScene(archiveScene, deltaSeconds);
  } else if (gameState.current === GAME_STATES.RECORDS) {
    updateMissingPersonsWing(deltaSeconds);
  } else if (gameState.current === GAME_STATES.MANUSCRIPT) {
    updateManuscriptScene(manuscriptScene, deltaSeconds);
  } else if (gameState.current === GAME_STATES.DISTORTED) {
    updateDistortedScene(distortedScene, deltaSeconds);
  } else if (gameState.current === GAME_STATES.CLASSROOM) {
    updateUncataloguedClassroom(deltaSeconds);
  } else if (gameState.current === GAME_STATES.RING) {
    updateChamberRingPuzzle(deltaSeconds);
  } else if (gameState.current === GAME_STATES.ARCHIVIST) {
    updateArchivistEncounter(deltaSeconds);
  } else if (gameState.current === GAME_STATES.PROLOGUE) {
    updatePrologueScene(deltaSeconds);
  } else if (gameState.current === GAME_STATES.ESCAPE) {
    updateEscapeSequence(deltaSeconds);
  }

  updateLadderSequence(deltaSeconds);

  updateInteractionPrompt();
  updatePlayer(player, deltaSeconds);
  updateCamera(camera, player, deltaSeconds);
  updateRuntimeSessionSnapshot();
  input.finishFrame();
  mouse.finishFrame();
}

function getCurrentWorld() {
  if (gameState.current === GAME_STATES.PROLOGUE) {
    return PROLOGUE_WORLD;
  }

  if (gameState.current === GAME_STATES.ARCHIVE) {
    return ARCHIVE_WORLD;
  }

  if (gameState.current === GAME_STATES.RECORDS) {
    return RECORDS_WORLD;
  }

  if (gameState.current === GAME_STATES.DISTORTED) {
    return {
      WIDTH: DISTORTED_CORRIDOR.WIDTH,
      CAMERA_LEFT_BOUNDARY: 0,
      CAMERA_RIGHT_BOUNDARY: DISTORTED_CORRIDOR.WIDTH,
      PLAYER_LEFT_BOUNDARY: 42,
      PLAYER_RIGHT_BOUNDARY: DISTORTED_CORRIDOR.WIDTH - 72,
    };
  }

  if (gameState.current === GAME_STATES.ARCHIVIST) {
    return {
      WIDTH: ARCHIVIST_CHAMBER.WIDTH,
      CAMERA_LEFT_BOUNDARY: 0,
      CAMERA_RIGHT_BOUNDARY: ARCHIVIST_CHAMBER.WIDTH,
      PLAYER_LEFT_BOUNDARY: 36,
      PLAYER_RIGHT_BOUNDARY: ARCHIVIST_CHAMBER.WIDTH - 36,
    };
  }

  if (gameState.current === GAME_STATES.CLASSROOM) {
    return CLASSROOM_WORLD;
  }

  if (gameState.current === GAME_STATES.ESCAPE) {
    return ESCAPE_WORLD;
  }

  return WORLD;
}

function getActiveVisualScene() {
  if (gameState.current === GAME_STATES.PROLOGUE) {
    return prologueScene;
  }

  if (gameState.current === GAME_STATES.ARCHIVE) {
    return archiveScene;
  }

  if (gameState.current === GAME_STATES.RECORDS) {
    return recordsScene;
  }

  if (gameState.current === GAME_STATES.MANUSCRIPT) {
    return manuscriptScene;
  }

  if (gameState.current === GAME_STATES.DISTORTED) {
    return distortedScene;
  }

  if (gameState.current === GAME_STATES.CLASSROOM) {
    return classroomScene;
  }

  if (gameState.current === GAME_STATES.ARCHIVIST) {
    return archivistScene;
  }

  if (gameState.current === GAME_STATES.ESCAPE) {
    return escapeScene;
  }

  return corridorScene;
}

function clampCameraToCurrentWorld(view, target) {
  const world = getCurrentWorld();

  view.x = clamp(
    getCameraTargetX(target),
    world.CAMERA_LEFT_BOUNDARY,
    world.CAMERA_RIGHT_BOUNDARY - CANVAS_WIDTH,
  );
}

function startSceneTransition(targetState, options = {}) {
  closeDialogue();
  closeKeypad();
  closeInspectOverlay();
  controlsState.open = false;
  debug.showOverlay = false;
  setJournalOpen(false, { silent: true });
  interactionState.activeInteractable = null;
  interactionState.lastPromptId = null;

  transitionState.active = true;
  transitionState.phase = "fadeOut";
  transitionState.timer = 0;
  transitionState.duration = options.duration ?? 0.78;
  transitionState.targetState = targetState;
  transitionState.spawnX = options.spawnX ?? null;
  transitionState.facing = options.facing ?? player.facing;

  if (options.doorSfx !== null) {
    audioManager.playSfx(options.doorSfx ?? "archiveDoorOpen");
  }

  if (targetState === GAME_STATES.PROLOGUE) {
    audioManager.stopAmbience({ fadeSeconds: 0.8 });
    audioManager.stopMusic({ fadeSeconds: 0.8 });
  } else if (targetState === GAME_STATES.ARCHIVE) {
    audioManager.stopAmbience({ fadeSeconds: 1.05 });
    audioManager.stopMusic({ fadeSeconds: 0.85 });
  } else if (targetState === GAME_STATES.CORRIDOR) {
    audioManager.stopAmbience({ fadeSeconds: 0.95 });
    audioManager.stopMusic({ fadeSeconds: 0.7 });
  } else if (targetState === GAME_STATES.MANUSCRIPT) {
    audioManager.stopAmbience({ fadeSeconds: 0.95 });
    audioManager.stopMusic({ fadeSeconds: 0.8 });
  } else if (targetState === GAME_STATES.DISTORTED) {
    audioManager.stopAmbience({ fadeSeconds: 0.3 });
    audioManager.stopMusic({ fadeSeconds: 0.3 });
  } else if (
    targetState === GAME_STATES.RING ||
    targetState === GAME_STATES.ARCHIVIST ||
    targetState === GAME_STATES.ESCAPE
  ) {
    audioManager.stopAmbience({ fadeSeconds: 0.45 });
    audioManager.stopMusic({ fadeSeconds: 0.45 });
  } else if (targetState === GAME_STATES.TITLE || targetState === GAME_STATES.ENDING) {
    audioManager.stopAmbience({ fadeSeconds: 0.8 });
    audioManager.stopMusic({ fadeSeconds: 0.8 });
  }
}

function updateTransition(deltaSeconds) {
  if (!transitionState.active) {
    return;
  }

  transitionState.timer += deltaSeconds;

  if (transitionState.timer < transitionState.duration) {
    return;
  }

  if (transitionState.phase === "fadeOut") {
    switchScene(
      transitionState.targetState,
      transitionState.spawnX,
      transitionState.facing,
    );
    transitionState.phase = "fadeIn";
    transitionState.timer = 0;
    return;
  }

  transitionState.active = false;
  transitionState.phase = "none";
  transitionState.timer = 0;
  transitionState.targetState = null;
  transitionState.spawnX = null;
}

function switchScene(targetState, spawnX, facing) {
  gameState.set(targetState);
  player.x = spawnX ?? player.x;
  player.y = PLAYER_CONFIG.SPAWN_Y;
  player.velocityX = 0;
  player.facing = facing || 1;
  clampCameraToCurrentWorld(camera, player);

  if (targetState === GAME_STATES.TITLE) {
    enterTitleScene();
    return;
  }

  if (targetState === GAME_STATES.PROLOGUE) {
    enterPrologueScene();
    return;
  }

  if (targetState === GAME_STATES.ARCHIVE) {
    enterArchiveScene();
    return;
  }

  if (targetState === GAME_STATES.RECORDS) {
    enterMissingPersonsWing();
    return;
  }

  if (targetState === GAME_STATES.CORRIDOR) {
    enterCorridorScene();
    return;
  }

  if (targetState === GAME_STATES.MANUSCRIPT) {
    enterManuscriptScene();
    return;
  }

  if (targetState === GAME_STATES.DISTORTED) {
    enterDistortedCorridorScene();
    return;
  }

  if (targetState === GAME_STATES.CLASSROOM) {
    enterClassroomScene();
    return;
  }

  if (targetState === GAME_STATES.RING) {
    enterChamberRingScene();
    return;
  }

  if (targetState === GAME_STATES.ARCHIVIST) {
    enterArchivistScene();
    return;
  }

  if (targetState === GAME_STATES.ESCAPE) {
    enterEscapeScene();
    return;
  }

  if (targetState === GAME_STATES.ENDING) {
    enterEndingScene();
  }
}

function enterTitleScene() {
  if (presentationState.active) {
    const snapshot = presentationState.normalSnapshot;
    if (snapshot) {
      restoreNormalProgressSnapshot(snapshot);
    }
    clearPresentationState();
    debug.showOverlay = false;
    titleMenuState.selectedIndex = 0;
    gameState.set(GAME_STATES.TITLE);
  }

  audioManager.stopAmbience({ fadeSeconds: 0.8 });
  audioManager.playMusic("titleTheme", { fadeSeconds: 1.2, volume: 0.3 });
}

function enterPrologueScene() {
  prologueProgress.prologueStarted = true;
  prologueProgress.timer = 0;
  prologueProgress.controlGranted = false;
  setCurrentObjective("enterUniversity");
  audioManager.stopMusic({ fadeSeconds: 1 });
  audioManager.playAmbience("exteriorAmbience", { fadeSeconds: 1.5, volume: 0.22 });
}

function enterArchiveScene() {
  const firstEntry = !archiveProgress.entered;

  archiveProgress.entered = true;
  completeObjective("enterArchive");

  if (manuscriptProgress.realityChanged) {
    startRealityChangeChapter();
    audioManager.playAmbience("archiveRoomTone", { fadeSeconds: 1.6, volume: 0.18 });
  } else {
    setCurrentObjective(
      archiveProgress.manuscriptTableRevealed
        ? "inspectManuscript"
        : recordsProgress.completed
          ? "locateRestricted"
          : "investigateMissingPersons",
    );
    audioManager.playAmbience("archiveRoomTone", { fadeSeconds: 2.2, volume: 0.22 });
    audioManager.playSfx("fluorescentHum", { volume: 0.34 });
    audioManager.playSfx("distantMetallicImpact", { volume: 0.28 });
  }

  if (firstEntry && !archiveProgress.entranceDialogueShown) {
    archiveProgress.entranceDialogueShown = true;
    startDialogue("archiveEntrance", { speed: 44 });
  }
}

function enterMissingPersonsWing() {
  recordsProgress.entered = true;
  recordsScene.flashlightOn = true;
  setCurrentObjective(
    recordsProgress.completed ? "returnFromRecordsWing" : "investigateMissingPersons",
  );
  audioManager.playAmbience("archiveRoomTone", { fadeSeconds: 1.2, volume: 0.22 });
  audioManager.playMusic("archivePulse", { fadeSeconds: 1.6, volume: 0.16 });
}

function enterCorridorScene() {
  audioManager.playAmbience("corridorRoomTone", { fadeSeconds: 1.5, volume: 0.22 });
  audioManager.playMusic("corridorTheme", { fadeSeconds: 2.4, volume: 0.22 });

  if (chapterProgress.archiveDoorUnlocked && !archiveProgress.entered) {
    setCurrentObjective("enterArchive");
  }
}

function enterManuscriptScene() {
  manuscriptProgress.entered = true;
  setCurrentObjective(getManuscriptObjectiveForStage());
  audioManager.playSfx("bookOpen", { volume: 0.66 });
  audioManager.playMusic("manuscriptRise", { fadeSeconds: 3.2, volume: 0.18 });
}

function enterDistortedCorridorScene() {
  realityProgress.distortedEntries += 1;
  setCurrentObjective(
    realityProgress.correctDoorChosen ? "activateWallSwitches" : "chooseRealDoor",
  );
  distortedScene.flashlightOn = true;
  audioManager.playAmbience("distortedCorridorTone", { fadeSeconds: 1.8, volume: 0.28 });
  audioManager.playMusic("distortedPulse", {
    fadeSeconds: 2.2,
    volume: getDistortedMusicVolume(),
  });
  audioManager.playSfx("electricalHum", { volume: 0.42 });
  audioManager.playSfx("distantFootsteps", { volume: 0.24 });
}

function enterClassroomScene() {
  classroomProgress.entered = true;
  classroomProgress.previousFlashlightOn = classroomScene.flashlightOn;
  classroomScene.flashlightOn = true;
  realityProgress.message = TEXT_CONTENT.archivist.chamber.absentFromDirectory;
  realityProgress.messageTimer = 3;
  audioManager.playAmbience("distortedCorridorTone", { fadeSeconds: 1.2, volume: 0.28 });
}

function enterEndingScene() {
  endingState.reached = true;
  endingState.selectedIndex = 0;
  if (!presentationState.active) {
    runtimeSession.valid = false;
  }
  audioManager.stopAmbience({ fadeSeconds: 1 });
  audioManager.playMusic("endingTheme", { fadeSeconds: 2.6, volume: 0.32 });
}

function enterChamberRingScene() {
  chamberRingProgress.entered = true;
  setCurrentObjective("unlockRestrictedChamber");
  chamberRingProgress.message = TEXT_CONTENT.archivist.chamber.lockDescription;
  chamberRingProgress.messageTimer = 4;
  audioManager.playAmbience("reverseElectricalHum", { fadeSeconds: 1.4, volume: 0.28 });
}

function enterArchivistScene() {
  if (!chamberRingProgress.ringSolved) {
    gameState.set(GAME_STATES.RING);
    enterChamberRingScene();
    return;
  }

  resetArchivistCombat();
  archivistProgress.bossStarted = true;
  archivistProgress.bossActive = true;
  archivistProgress.message = TEXT_CONTENT.archivist.messages.archivistTurns;
  archivistProgress.messageTimer = 4;
  setCurrentObjective("confrontArchivist");
  audioManager.playSfx("archivistAppear", { volume: 0.72 });
  audioManager.playAmbience("distortedCorridorTone", { fadeSeconds: 1.2, volume: 0.28 });
  audioManager.playMusic("distortedPulse", { fadeSeconds: 1.4, volume: 0.3 });
}

function enterEscapeScene() {
  escapeProgress.escapeSequenceActive = true;
  escapeProgress.protagonistEscaped = false;
  escapeProgress.endingStarted = false;
  escapeProgress.timer = 0;
  escapeProgress.revealTimer = 0;
  escapeProgress.debris = [
    { x: 760, timer: -1, active: 0, hit: false, hardOnly: false },
    { x: 2720, timer: -1, active: 0, hit: false, hardOnly: false },
    { x: 3520, timer: -1, active: 0, hit: false, hardOnly: true },
    { x: 3820, timer: -1, active: 0, hit: false, hardOnly: true },
  ];
  escapeProgress.debrisInvulnerability = 0;
  escapeProgress.detourActive = false;
  escapeProgress.detourCompleted = false;
  escapeProgress.cameraChoiceActive = false;
  escapeProgress.cameraChoice = null;
  escapeProgress.cameraChoiceIndex = 0;
  escapeProgress.evidencePreserved = false;
  escapeProgress.message = "";
  escapeProgress.messageTimer = 0;
  escapeScene.flashlightOn = true;
  setCurrentObjective("escapeUniversity");
  audioManager.playMusic("distortedPulse", { fadeSeconds: 0.8, volume: 0.32 });
  audioManager.playSfx("escapeSequence", { volume: 0.66 });
}

function startRealityChangeChapter() {
  if (!realityProgress.chapterStarted) {
    realityProgress.chapterStarted = true;
    realityProgress.archiveReturnSeen = true;
    setCurrentObjective("findMissingPage");
    startDialogue("postManuscriptPurpose");
    return;
  }

  if (realityProgress.finalPageVisible) {
    setCurrentObjective("reachMissingPage");
    return;
  }

  if (realityProgress.discoveredSymbols.size < REALITY_CHANGE_SYMBOLS.length) {
    setCurrentObjective(
      realityProgress.archiveExitLooped ? "noticeArchiveChanges" : "testDistortedExit",
    );
    return;
  }

  setCurrentObjective("chooseRealDoor");
}

function updateDebugControls() {
  const forceDebugHidden =
    presentationState.active || TRAILER_MODE || cinematicCaptureActive || isInterfaceScreenState();

  if (forceDebugHidden) {
    debug.showOverlay = false;
  } else if (input.wasPressed("F2")) {
    debug.showOverlay = !debug.showOverlay;
    audioManager.playSfx("debugToggle");
  }

  if (
    isInterfaceScreenState() ||
    gameState.current === GAME_STATES.MANUSCRIPT ||
    gameState.current === GAME_STATES.RING ||
    gameState.current === GAME_STATES.ARCHIVIST
  ) {
    return;
  }

  if (input.wasPressed("KeyF")) {
    const scene = getActiveVisualScene();

    scene.flashlightOn = !scene.flashlightOn;
    audioManager.playSfx("flashlightToggle");
  }
}

function updateControlsOverlayControls() {
  if (transitionState.active) {
    return;
  }

  if (controlsState.open && (input.wasPressed("Escape") || input.wasPressed("KeyC"))) {
    controlsState.open = false;
    return;
  }

  if (isInterfaceScreenState()) {
    return;
  }

  if (
    input.wasPressed("KeyC") &&
    !dialogueState.active &&
    !journalState.open &&
    !keypadState.active &&
    !inspectOverlayState.active &&
    recordsProgress.activeCaseId === null &&
    !escapeProgress.cameraChoiceActive
  ) {
    controlsState.open = true;
  }
}

function updateTrailerShortcuts() {
  if (!TRAILER_MODE || controlsState.open) {
    return;
  }

  if (input.wasPressed("F10")) {
    cinematicCaptureActive = !cinematicCaptureActive;
    realityProgress.message = cinematicCaptureActive
      ? TEXT_CONTENT.notifications.cinematicCaptureEnabled
      : TEXT_CONTENT.notifications.cinematicCaptureDisabled;
    realityProgress.messageTimer = 2;
    audioManager.playSfx("uiSelect", { volume: 0.42 });
    return;
  }

  if (input.wasPressed("F6")) {
    forceChangedArchiveForTrailer();
    return;
  }

  if (input.wasPressed("F7")) {
    forceSilhouetteEventForTrailer();
    return;
  }

  if (input.wasPressed("F9")) {
    forceFinalPageRevealForTrailer();
    return;
  }

  if (!input.wasPressed("F8")) {
    return;
  }

  if (gameState.current === GAME_STATES.MANUSCRIPT) {
    return;
  }

  if (manuscriptProgress.realityChanged) {
    forceCorridorGlitchForTrailer();
    return;
  }

  chapterProgress.directoryRead = true;
  chapterProgress.archiveDoorChecked = true;
  chapterProgress.lockPanelInspected = true;
  chapterProgress.maintenanceNoticeRead = true;
  chapterProgress.securityMemoRead = true;
  chapterProgress.maintenanceKeyCollected = true;
  chapterProgress.electricalCabinetOpen = true;
  chapterProgress.circuitPuzzleSolved = true;
  chapterProgress.powerReset = true;
  chapterProgress.archiveDoorUnlocked = true;
  chapterProgress.archiveDoorRevealed = true;
  collectClue("directory", { silent: true });
  collectClue("lockPanel", { silent: true });
  collectClue("maintenanceNotice", { silent: true });
  collectClue("securityMemo", { silent: true });
  collectClue("maintenanceKey", { silent: true });
  collectClue("powerReset", { silent: true });
  collectClue("archiveUnlocked", { silent: true });
  completeObjective("findArchive");
  setCurrentObjective("enterArchive");

  if (gameState.current === GAME_STATES.ARCHIVE) {
    revealManuscriptTable({ trailer: true });
    return;
  }

  startSceneTransition(GAME_STATES.ARCHIVE, {
    spawnX: ARCHIVE_WORLD.ENTRANCE_X,
    facing: 1,
    duration: 0.35,
  });
}

function forceChangedArchiveForTrailer() {
  manuscriptProgress.manuscriptCompleted = true;
  manuscriptProgress.manuscriptPatternDiscovered = true;
  manuscriptProgress.solved = true;
  manuscriptProgress.realityChanged = true;
  manuscriptProgress.finalTriggered = true;
  archiveProgress.manuscriptSequenceStarted = true;
  archiveProgress.manuscriptTableRevealed = true;
  realityProgress.chapterStarted = false;
  gameState.set(GAME_STATES.ARCHIVE);
  player.x = ARCHIVE_ROOM.TABLE_X - 54;
  clampCameraToCurrentWorld(camera, player);
  startRealityChangeChapter();
  realityProgress.message = TEXT_CONTENT.distortedArchive.messages.trailerChangedArchiveForced;
  realityProgress.messageTimer = 2.2;
}

function forceSilhouetteEventForTrailer() {
  if (gameState.current !== GAME_STATES.DISTORTED) {
    manuscriptProgress.realityChanged = true;
    realityProgress.archiveExitLooped = true;
    gameState.set(GAME_STATES.DISTORTED);
    player.x = 820;
    clampCameraToCurrentWorld(camera, player);
    enterDistortedCorridorScene();
  }

  triggerSilhouetteEvent({ force: true });
}

function forceCorridorGlitchForTrailer() {
  if (gameState.current !== GAME_STATES.DISTORTED) {
    realityProgress.archiveExitLooped = true;
    gameState.set(GAME_STATES.DISTORTED);
    player.x = DISTORTED_CORRIDOR.RETURN_X;
    clampCameraToCurrentWorld(camera, player);
    enterDistortedCorridorScene();
  }

  handleFalseDistortedDoor("trailer");
}

function forceFinalPageRevealForTrailer() {
  manuscriptProgress.manuscriptCompleted = true;
  manuscriptProgress.manuscriptPatternDiscovered = true;
  manuscriptProgress.realityChanged = true;
  realityProgress.archiveExitLooped = true;
  REALITY_CHANGE_SYMBOLS.forEach((detail) => discoverRealitySymbol(detail.id, { silent: true }));
  realityProgress.correctDoorChosen = true;
  realityProgress.sealedSectionReached = true;
  realityProgress.switchSequence = [...DISTORTED_CORRIDOR.SWITCH_ORDER];
  realityProgress.passageOpen = true;
  revealMissingPage();
  gameState.set(GAME_STATES.DISTORTED);
  player.x = DISTORTED_CORRIDOR.FINAL_PAGE_X - 84;
  clampCameraToCurrentWorld(camera, player);
  realityProgress.message = TEXT_CONTENT.distortedArchive.messages.trailerFinalPageRevealForced;
  realityProgress.messageTimer = 2.2;
}

function updateDialogue(deltaSeconds) {
  if (!dialogueState.active || controlsState.open) {
    return;
  }

  const line = getCurrentDialogueLine();
  const fullTextLength = line.text.length;

  if (dialogueState.visibleCharacters < fullTextLength) {
    dialogueState.visibleCharacters = Math.min(
      fullTextLength,
      dialogueState.visibleCharacters + dialogueState.typewriterSpeed * deltaSeconds,
    );

    const visibleCount = Math.floor(dialogueState.visibleCharacters);
    if (
      visibleCount < fullTextLength &&
      visibleCount >= dialogueState.lastTickCharacter + DIALOGUE_TICK_INTERVAL_CHARACTERS
    ) {
      dialogueState.lastTickCharacter = visibleCount;
      audioManager.playSfx("dialogueTick", { volume: AUDIO_MIX_DEFAULTS.dialogueTick });
    } else if (visibleCount >= fullTextLength) {
      dialogueState.lastTickCharacter = visibleCount;
    }
  }

  if (input.wasPressed("KeyE") || input.wasPressed("Enter")) {
    advanceDialogue();
  }

  if (input.wasPressed("Escape") && dialogueState.allowEscape) {
    closeDialogue();
  }
}

function updateJournalControls() {
  if (
    isInterfaceScreenState() ||
    dialogueState.active ||
    keypadState.active ||
    inspectOverlayState.active ||
    recordsProgress.activeCaseId !== null ||
    escapeProgress.cameraChoiceActive ||
    controlsState.open ||
    transitionState.active
  ) {
    return;
  }

  if (input.wasPressed("KeyJ")) {
    setJournalOpen(!journalState.open);
    return;
  }

  if (journalState.open && input.wasPressed("Escape")) {
    setJournalOpen(false);
    return;
  }

  if (!journalState.open) {
    return;
  }

  const pageCount = getJournalPageCount();
  if (
    input.wasPressed("ArrowLeft") ||
    input.wasPressed("KeyA")
  ) {
    journalState.cluePage = clamp(journalState.cluePage - 1, 0, pageCount - 1);
  }

  if (
    input.wasPressed("ArrowRight") ||
    input.wasPressed("KeyD")
  ) {
    journalState.cluePage = clamp(journalState.cluePage + 1, 0, pageCount - 1);
  }
}

function updateInspectOverlayControls() {
  if (!inspectOverlayState.active || controlsState.open) {
    return;
  }

  if (
    input.wasPressed("KeyE") ||
    input.wasPressed("Enter") ||
    input.wasPressed("Escape")
  ) {
    closeInspectOverlay();
  }
}

function updateKeypad(deltaSeconds) {
  if (!keypadState.active || controlsState.open) {
    return;
  }

  keypadState.messageTimer = Math.max(0, keypadState.messageTimer - deltaSeconds);

  const digit = getPressedDigit();
  if (digit !== null && keypadState.enteredCode.length < 4) {
    keypadState.enteredCode += digit;
    keypadState.message = "";
    audioManager.playSfx("keypadButton");
  }

  if (input.wasPressed("Backspace")) {
    keypadState.enteredCode = keypadState.enteredCode.slice(0, -1);
    audioManager.playSfx("keypadButton", { volume: 0.7 });
  }

  if (input.wasPressed("Escape")) {
    closeKeypad();
    return;
  }

  if (input.wasPressed("KeyE") || input.wasPressed("Enter")) {
    submitKeypadCode();
  }
}

function updateObjectiveState(deltaSeconds) {
  objectiveState.bannerTimer = Math.max(0, objectiveState.bannerTimer - deltaSeconds);
}

function updateInteractionPrompt() {
  if (!shouldShowInteractionPrompt()) {
    interactionState.activeInteractable = null;
    interactionState.lastPromptId = null;
    return;
  }

  const nearest = getNearestValidInteractable();
  interactionState.activeInteractable = nearest;

  if (nearest && interactionState.lastPromptId !== nearest.id) {
    interactionState.lastPromptId = nearest.id;
    audioManager.playSfx("interactionPrompt", { volume: INTERACTION_PROMPT_VOLUME });
  }

  if (!nearest) {
    interactionState.lastPromptId = null;
    return;
  }

  if (input.wasPressed("KeyE")) {
    interactWith(nearest);
  }
}

function updateCorridorScene(scene, deltaSeconds) {
  scene.time += deltaSeconds;
  scene.grainTimer += deltaSeconds;

  while (scene.grainTimer >= 0.07) {
    scene.grainTimer -= 0.07;
    scene.grainFrame = (scene.grainFrame + 1) % 997;
  }
}

function updatePrologueScene(deltaSeconds) {
  prologueScene.time += deltaSeconds;
  prologueProgress.timer += deltaSeconds;

  if (
    !prologueProgress.controlGranted &&
    prologueProgress.timer >= 3 &&
    (input.wasPressed("Space") || input.wasPressed("KeyE") || input.wasPressed("Enter"))
  ) {
    prologueProgress.controlGranted = true;
    prologueProgress.timer = 24;
  }

  if (!prologueProgress.controlGranted && prologueProgress.timer >= 24) {
    prologueProgress.controlGranted = true;
  }

  if (
    prologueProgress.controlGranted &&
    player.x >= PROLOGUE_WORLD.ENTRANCE_X &&
    !transitionState.active
  ) {
    prologueProgress.prologueCompleted = true;
    completeObjective("enterUniversity");
    setCurrentObjective("findArchive");
    startSceneTransition(GAME_STATES.CORRIDOR, {
      spawnX: PLAYER_CONFIG.SPAWN_X,
      facing: 1,
      duration: 1,
      doorSfx: "archiveDoorOpen",
    });
  }
}

function updateArchiveScene(scene, deltaSeconds) {
  scene.time += deltaSeconds;
  scene.grainTimer += deltaSeconds;
  realityProgress.messageTimer = Math.max(0, realityProgress.messageTimer - deltaSeconds);

  while (scene.grainTimer >= 0.08) {
    scene.grainTimer -= 0.08;
    scene.grainFrame = (scene.grainFrame + 3) % 997;
  }
}

function updateMissingPersonsWing(deltaSeconds) {
  recordsScene.time += deltaSeconds;
  recordsScene.grainTimer += deltaSeconds;
  recordsProgress.messageTimer = Math.max(0, recordsProgress.messageTimer - deltaSeconds);
  recordsProgress.errorTimer = Math.max(0, recordsProgress.errorTimer - deltaSeconds);

  while (recordsScene.grainTimer >= 0.07) {
    recordsScene.grainTimer -= 0.07;
    recordsScene.grainFrame = (recordsScene.grainFrame + 9) % 997;
  }

  if (recordsProgress.activeCaseId === null) {
    return;
  }

  const caseData = getMissingPersonCase(recordsProgress.activeCaseId);
  if (!caseData) {
    recordsProgress.activeCaseId = null;
    return;
  }

  if (input.wasPressed("Escape")) {
    recordsProgress.activeCaseId = null;
    return;
  }

  if (input.wasPressed("ArrowUp") || input.wasPressed("KeyW")) {
    recordsProgress.selectedRecordIndex = wrapRotation(
      recordsProgress.selectedRecordIndex - 1,
      caseData.records.length,
    );
    audioManager.playSfx("uiMove", { volume: 0.4 });
  }
  if (input.wasPressed("ArrowDown") || input.wasPressed("KeyS")) {
    recordsProgress.selectedRecordIndex = wrapRotation(
      recordsProgress.selectedRecordIndex + 1,
      caseData.records.length,
    );
    audioManager.playSfx("uiMove", { volume: 0.4 });
  }

  for (let index = 0; index < caseData.records.length; index += 1) {
    if (isMouseClickInRect(getMissingPersonRecordRect(index))) {
      recordsProgress.selectedRecordIndex = index;
      submitMissingPersonContradiction(caseData);
      return;
    }
  }

  if (input.wasPressed("KeyE") || input.wasPressed("Enter")) {
    submitMissingPersonContradiction(caseData);
  }
}

function updateUncataloguedClassroom(deltaSeconds) {
  classroomScene.time += deltaSeconds;
  classroomScene.grainTimer += deltaSeconds;
  classroomProgress.messageTimer = Math.max(0, classroomProgress.messageTimer - deltaSeconds);

  while (classroomScene.grainTimer >= 0.06) {
    classroomScene.grainTimer -= 0.06;
    classroomScene.grainFrame = (classroomScene.grainFrame + 13) % 997;
  }

  if (classroomProgress.previousFlashlightOn && !classroomScene.flashlightOn) {
    classroomProgress.occupants = Math.min(4, classroomProgress.occupants + 1);
    classroomProgress.message =
      classroomProgress.occupants < 4
        ? TEXT_CONTENT.distortedArchive.classroom.chairScrape
        : TEXT_CONTENT.distortedArchive.classroom.freshInk;
    classroomProgress.messageTimer = 2.5;
    realityProgress.message = classroomProgress.message;
    realityProgress.messageTimer = 2.5;
    audioManager.playSfx("classroomShift", { volume: 0.58 });

    if (classroomProgress.occupants === 4 && !classroomProgress.completed) {
      classroomProgress.completed = true;
      collectClue("uncataloguedAttendance");
    }
  }

  classroomProgress.previousFlashlightOn = classroomScene.flashlightOn;
}

function updateDistortedScene(scene, deltaSeconds) {
  scene.time += deltaSeconds;
  scene.grainTimer += deltaSeconds;
  realityProgress.messageTimer = Math.max(0, realityProgress.messageTimer - deltaSeconds);
  scene.cameraJitter = settings.screenShake
    ? Math.sin(scene.time * 8.7) * 1.6 + Math.sin(scene.time * 17.3) * 0.7
    : 0;

  while (scene.grainTimer >= 0.06) {
    scene.grainTimer -= 0.06;
    scene.grainFrame = (scene.grainFrame + 7) % 997;
  }

  const shutdownByPosition = clamp(Math.floor((player.x - 260) / 470), 0, DISTORTED_CORRIDOR.LIGHTS.length);
  realityProgress.lightShutdownCount = Math.max(realityProgress.lightShutdownCount, shutdownByPosition);

  if (
    !realityProgress.silhouetteTriggered &&
    realityProgress.archiveExitLooped &&
    player.x > 760
  ) {
    triggerSilhouetteEvent();
  }

  if (!realityProgress.silhouetteActive) {
    return;
  }

  realityProgress.silhouetteTimer = Math.max(0, realityProgress.silhouetteTimer - deltaSeconds);

  if (realityProgress.silhouetteTimer === 0) {
    realityProgress.silhouetteActive = false;
    audioManager.playAmbience("distortedCorridorTone", { fadeSeconds: 1.6, volume: 0.28 });
    audioManager.playMusic("distortedPulse", {
      fadeSeconds: 1.8,
      volume: getDistortedMusicVolume(),
    });
  }
}

function updateEscapeSequence(deltaSeconds) {
  escapeScene.time += deltaSeconds;
  escapeScene.grainTimer += deltaSeconds;
  escapeProgress.messageTimer = Math.max(0, escapeProgress.messageTimer - deltaSeconds);
  escapeProgress.debrisInvulnerability = Math.max(
    0,
    escapeProgress.debrisInvulnerability - deltaSeconds,
  );

  while (escapeScene.grainTimer >= 0.06) {
    escapeScene.grainTimer -= 0.06;
    escapeScene.grainFrame = (escapeScene.grainFrame + 5) % 997;
  }

  if (!escapeProgress.protagonistEscaped) {
    escapeProgress.timer += deltaSeconds;

    if (escapeProgress.cameraChoiceActive) {
      updateEscapeCameraChoice();
      return;
    }

    updateEscapeDebris(deltaSeconds);
    updateEscapeDetour();

    if (player.x >= 3260 && escapeProgress.cameraChoice === null) {
      escapeProgress.cameraChoiceActive = true;
      escapeProgress.cameraChoiceIndex = 0;
      player.velocityX = 0;
      setCurrentObjective("chooseCamera");
      return;
    }

    if (player.x >= ESCAPE_WORLD.EXIT_X && escapeProgress.cameraChoice !== null) {
      escapeProgress.protagonistEscaped = true;
      escapeProgress.escapeSequenceActive = false;
      escapeProgress.revealTimer = 0;
      player.velocityX = 0;
      completeObjective("escapeUniversity");
      audioManager.stopMusic({ fadeSeconds: 1.2 });
      audioManager.playAmbience("exteriorAmbience", { fadeSeconds: 1.4, volume: 0.22 });
    }
    return;
  }

  escapeProgress.revealTimer += deltaSeconds;
  if (escapeProgress.revealTimer >= 9 && !escapeProgress.notificationPlayed) {
    escapeProgress.notificationPlayed = true;
    audioManager.playSfx("finalNotification", { volume: 0.68 });
  }

  if (
    escapeProgress.revealTimer >= 20 &&
    !escapeProgress.endingStarted &&
    !transitionState.active
  ) {
    escapeProgress.endingStarted = true;
    startSceneTransition(GAME_STATES.ENDING, {
      spawnX: player.x,
      facing: player.facing,
      duration: 1.5,
      doorSfx: null,
    });
  }
}

function updateEscapeDetour() {
  if (escapeProgress.detourCompleted) {
    return;
  }

  if (!escapeProgress.detourActive && player.x >= 1540) {
    player.x = 1540;
    player.velocityX = 0;
    escapeProgress.message = TEXT_CONTENT.escape.messages.corridorBuried;
    escapeProgress.messageTimer = 2.4;
    if (input.wasPressed("ArrowUp")) {
      escapeProgress.detourActive = true;
      player.y = PLAYER_CONFIG.SPAWN_Y - 68;
      audioManager.playSfx("ladderClimb", { volume: 0.52 });
    }
    return;
  }

  if (escapeProgress.detourActive) {
    player.y = PLAYER_CONFIG.SPAWN_Y - 68;
    if (player.x >= 2110) {
      escapeProgress.detourActive = false;
      escapeProgress.detourCompleted = true;
      player.y = PLAYER_CONFIG.SPAWN_Y;
      escapeProgress.message = TEXT_CONTENT.escape.messages.bypassCollapses;
      escapeProgress.messageTimer = 2;
      audioManager.playSfx("debrisImpact", { volume: 0.58 });
    }
  }
}

function updateEscapeDebris(deltaSeconds) {
  for (const debris of escapeProgress.debris) {
    if (debris.resolved || (debris.hardOnly && escapeProgress.cameraChoice !== "keep")) {
      continue;
    }
    if (debris.timer < 0 && Math.abs(player.x - debris.x) < 155) {
      debris.timer = 0.9;
      audioManager.playSfx("debrisWarning", { volume: 0.54 });
    }
    if (debris.timer > 0) {
      debris.timer = Math.max(0, debris.timer - deltaSeconds);
      if (debris.timer === 0) {
        debris.active = 0.46;
        audioManager.playSfx("debrisImpact", { volume: 0.62 });
      }
      continue;
    }
    if (debris.active <= 0) {
      continue;
    }

    debris.active = Math.max(0, debris.active - deltaSeconds);
    if (
      !debris.hit &&
      escapeProgress.debrisInvulnerability === 0 &&
      Math.abs(player.x + player.width / 2 - debris.x) < 48
    ) {
      debris.hit = true;
      player.x = Math.max(48, player.x - 120);
      escapeProgress.debrisInvulnerability = 1;
      escapeProgress.message = TEXT_CONTENT.escape.messages.debrisStrikes;
      escapeProgress.messageTimer = 1.8;
      manuscriptProgress.glitchTimer = 0.35;
    }
    if (debris.active === 0) {
      debris.resolved = true;
    }
  }
}

function updateEscapeCameraChoice() {
  if (
    input.wasPressed("ArrowUp") ||
    input.wasPressed("ArrowLeft") ||
    input.wasPressed("KeyA") ||
    input.wasPressed("ArrowDown") ||
    input.wasPressed("ArrowRight") ||
    input.wasPressed("KeyD")
  ) {
    escapeProgress.cameraChoiceIndex = 1 - escapeProgress.cameraChoiceIndex;
    audioManager.playSfx("uiMove", { volume: 0.44 });
  }

  for (let index = 0; index < 2; index += 1) {
    if (isMouseClickInRect(getEscapeCameraChoiceRect(index))) {
      chooseEscapeCameraOption(index);
      return;
    }
  }
  if (input.wasPressed("KeyE") || input.wasPressed("Enter")) {
    chooseEscapeCameraOption(escapeProgress.cameraChoiceIndex);
  }
}

function chooseEscapeCameraOption(index) {
  escapeProgress.cameraChoice = index === 0 ? "keep" : "drop";
  escapeProgress.evidencePreserved = index === 0;
  escapeProgress.cameraChoiceActive = false;
  setCurrentObjective("escapeUniversity");
  if (escapeProgress.evidencePreserved) {
    escapeProgress.message = TEXT_CONTENT.escape.messages.keepCamera;
    audioManager.playSfx("cameraShutter", { volume: 0.56 });
  } else {
    escapeProgress.message = TEXT_CONTENT.escape.messages.dropCamera;
    audioManager.playSfx("cameraDrop", { volume: 0.7 });
  }
  escapeProgress.messageTimer = 3;
}

function getEscapeCameraChoiceRect(index) {
  return { x: 144, y: 184 + index * 50, width: 352, height: 38 };
}

function updateManuscriptScene(scene, deltaSeconds) {
  scene.time += deltaSeconds;
  scene.grainTimer += deltaSeconds;
  manuscriptProgress.inputCooldown = Math.max(0, manuscriptProgress.inputCooldown - deltaSeconds);
  manuscriptProgress.shakeTimer = Math.max(0, manuscriptProgress.shakeTimer - deltaSeconds);
  manuscriptProgress.inkMotionTimer = Math.max(0, manuscriptProgress.inkMotionTimer - deltaSeconds);
  manuscriptProgress.glitchTimer = Math.max(0, manuscriptProgress.glitchTimer - deltaSeconds);
  manuscriptProgress.messageTimer = Math.max(0, manuscriptProgress.messageTimer - deltaSeconds);

  while (scene.grainTimer >= 0.06) {
    scene.grainTimer -= 0.06;
    scene.grainFrame = (scene.grainFrame + 5) % 997;
  }

  if (manuscriptProgress.finalTriggered) {
    manuscriptProgress.returnTimer = Math.max(0, manuscriptProgress.returnTimer - deltaSeconds);

    if (
      manuscriptProgress.returnTimer === 0 &&
      gameState.current === GAME_STATES.MANUSCRIPT &&
      !transitionState.active
    ) {
      startSceneTransition(GAME_STATES.ARCHIVE, {
        spawnX: ARCHIVE_ROOM.TABLE_X - 54,
        facing: -1,
        duration: getTrailerAdjustedDuration(0.64),
        doorSfx: null,
      });
    }

    return;
  }

  if (
    controlsState.open ||
    transitionState.active ||
    dialogueState.active ||
    journalState.open ||
    keypadState.active ||
    recordsProgress.activeCaseId !== null ||
    inspectOverlayState.active
  ) {
    return;
  }

  if (handleManuscriptChromeInput()) {
    return;
  }

  if (TRAILER_MODE && !presentationState.active && handleManuscriptDeveloperShortcut()) {
    return;
  }

  if (manuscriptProgress.stage === MANUSCRIPT_STAGES.RECONSTRUCT) {
    updatePageReconstructionInput();
    return;
  }

  if (manuscriptProgress.stage === MANUSCRIPT_STAGES.PATTERN) {
    updatePatternInspectionInput();
    return;
  }

  if (manuscriptProgress.stage === MANUSCRIPT_STAGES.SYMBOLS) {
    updateSymbolInterpretationInput();
    return;
  }

  if (manuscriptProgress.stage === MANUSCRIPT_STAGES.ALIGNMENT) {
    updateMissingPageAlignmentInput();
  }
}

function handleManuscriptChromeInput() {
  if (input.wasPressed("KeyC") || isMouseClickInRect(getControlsButtonRect())) {
    controlsState.open = true;
    return true;
  }

  if (
    canCloseManuscriptInspection() &&
    (input.wasPressed("Escape") || isMouseClickInRect(getCloseManuscriptButtonRect()))
  ) {
    closeManuscriptInspection();
    return true;
  }

  return false;
}

function handleManuscriptDeveloperShortcut() {
  if (!input.wasPressed("F8") && !isMouseClickInRect(getDeveloperCompleteButtonRect())) {
    return false;
  }

  autoCompleteCurrentManuscriptStage();
  return true;
}

function updatePageReconstructionInput() {
  const selected = getSelectedFragment();

  if (mouse.justPressed) {
    const rotateLeft = getPuzzleButtonRect("rotateLeft");
    const rotateRight = getPuzzleButtonRect("rotateRight");

    if (isPointInRect(mouse.x, mouse.y, rotateLeft)) {
      requestFragmentRotation(-1);
      return;
    }

    if (isPointInRect(mouse.x, mouse.y, rotateRight)) {
      requestFragmentRotation(1);
      return;
    }

    const clickedFragment = getFragmentAtPoint(mouse.x, mouse.y);
    if (clickedFragment && !clickedFragment.placed) {
      // Selection is explicit and the pointer keeps its pickup offset while dragging.
      selectFragment(clickedFragment.id);
      manuscriptProgress.draggingFragmentId = clickedFragment.id;
      manuscriptProgress.dragOffsetX = mouse.x - clickedFragment.x;
      manuscriptProgress.dragOffsetY = mouse.y - clickedFragment.y;
      audioManager.playSfx("paperFragmentPickup", { volume: 0.52 });
      return;
    }
  }

  const dragging = getFragmentById(manuscriptProgress.draggingFragmentId);
  if (dragging && mouse.isDown) {
    dragging.x = mouse.x - manuscriptProgress.dragOffsetX;
    dragging.y = mouse.y - manuscriptProgress.dragOffsetY;
    clampFragmentToBoard(dragging);
  }

  if (dragging && mouse.justReleased) {
    trySnapFragment(dragging);
    manuscriptProgress.draggingFragmentId = null;
  }

  if (manuscriptProgress.inputCooldown > 0) {
    return;
  }

  if (input.wasPressed("Tab")) {
    selectNextFragment();
    setManuscriptCooldown(0.12);
  }

  for (let index = 1; index <= MANUSCRIPT_FRAGMENTS.length; index += 1) {
    if (input.wasPressed(`Digit${index}`) || input.wasPressed(`Numpad${index}`)) {
      selectFragment(MANUSCRIPT_FRAGMENTS[index - 1].id);
      setManuscriptCooldown(0.12);
    }
  }

  if (!selected || selected.placed) {
    return;
  }

  const moveAmount = 6;
  if (input.wasPressed("ArrowLeft") || input.wasPressed("KeyA")) {
    selected.x -= moveAmount;
    clampFragmentToBoard(selected);
    setManuscriptCooldown(0.04);
  }

  if (input.wasPressed("ArrowRight") || input.wasPressed("KeyD")) {
    selected.x += moveAmount;
    clampFragmentToBoard(selected);
    setManuscriptCooldown(0.04);
  }

  if (input.wasPressed("ArrowUp")) {
    selected.y -= moveAmount;
    clampFragmentToBoard(selected);
    setManuscriptCooldown(0.04);
  }

  if (input.wasPressed("ArrowDown")) {
    selected.y += moveAmount;
    clampFragmentToBoard(selected);
    setManuscriptCooldown(0.04);
  }

  if (input.wasPressed("KeyQ")) {
    requestFragmentRotation(-1);
  }

  if (input.wasPressed("KeyE")) {
    requestFragmentRotation(1);
  }

  if (input.wasPressed("Enter")) {
    trySnapFragment(selected);
  }
}

function updateSymbolInterpretationInput() {
  if (manuscriptProgress.symbolStageSolved) {
    if (
      input.wasPressed("Enter") ||
      input.wasPressed("KeyE") ||
      isMouseClickInRect(getBeginAlignmentButtonRect())
    ) {
      commitToFinalAlignmentStage();
    }

    return;
  }

  if (manuscriptProgress.inputCooldown > 0) {
    return;
  }

  if (input.wasPressed("ArrowLeft") || input.wasPressed("KeyA")) {
    manuscriptProgress.selectedSymbolIndex =
      (manuscriptProgress.selectedSymbolIndex + MANUSCRIPT_SYMBOLS.length - 1) %
      MANUSCRIPT_SYMBOLS.length;
    setManuscriptCooldown(0.12);
  }

  if (input.wasPressed("ArrowRight") || input.wasPressed("KeyD") || input.wasPressed("Tab")) {
    manuscriptProgress.selectedSymbolIndex =
      (manuscriptProgress.selectedSymbolIndex + 1) % MANUSCRIPT_SYMBOLS.length;
    setManuscriptCooldown(0.12);
  }

  if (input.wasPressed("Backspace") || input.wasPressed("KeyR")) {
    manuscriptProgress.symbolSequence = [];
    manuscriptProgress.message = TEXT_CONTENT.manuscript.messages.sequenceCleared;
    manuscriptProgress.messageTimer = 1.5;
    setManuscriptCooldown(0.16);
  }

  const clickedSymbolId = getClickedSymbolButtonId();
  if (clickedSymbolId) {
    addSymbolToSequence(clickedSymbolId);
    return;
  }

  if (input.wasPressed("Enter") || input.wasPressed("KeyE")) {
    addSymbolToSequence(MANUSCRIPT_SYMBOLS[manuscriptProgress.selectedSymbolIndex].id);
  }
}

function updatePatternInspectionInput() {
  if (
    input.wasPressed("KeyE") ||
    input.wasPressed("Enter") ||
    isMouseClickInRect(getPatternContinueButtonRect())
  ) {
    manuscriptProgress.stage = MANUSCRIPT_STAGES.SYMBOLS;
    manuscriptProgress.message = TEXT_CONTENT.manuscript.messages.orderRepeats;
    manuscriptProgress.messageTimer = 2;
    audioManager.playSfx("pageMovement", { volume: 0.44 });
  }
}

function updateMissingPageAlignmentInput() {
  if (manuscriptProgress.inputCooldown > 0) {
    return;
  }

  if (isMouseClickInRect(getStageThreeBackButtonRect()) || input.wasPressed("KeyB")) {
    manuscriptProgress.stage = MANUSCRIPT_STAGES.SYMBOLS;
    manuscriptProgress.committedToFinalStage = false;
    setCurrentObjective("interpretSymbols");
    audioManager.playSfx("pageMovement", { volume: 0.48 });
    setManuscriptCooldown(0.18);
    return;
  }

  if (isMouseClickInRect(getStageThreeResetButtonRect()) || input.wasPressed("KeyR")) {
    resetRingAlignment();
    return;
  }

  const clickedRingIndex = getRingIndexAtPoint(mouse.x, mouse.y);
  if (mouse.justPressed && clickedRingIndex !== null) {
    manuscriptProgress.selectedRingIndex = clickedRingIndex;
    setManuscriptCooldown(0.1);
  }

  if (input.wasPressed("ArrowLeft") || input.wasPressed("KeyA")) {
    manuscriptProgress.selectedRingIndex =
      (manuscriptProgress.selectedRingIndex + MANUSCRIPT_RINGS.length - 1) %
      MANUSCRIPT_RINGS.length;
    setManuscriptCooldown(0.12);
  }

  if (input.wasPressed("ArrowRight") || input.wasPressed("KeyD") || input.wasPressed("Tab")) {
    manuscriptProgress.selectedRingIndex =
      (manuscriptProgress.selectedRingIndex + 1) % MANUSCRIPT_RINGS.length;
    setManuscriptCooldown(0.12);
  }

  if (input.wasPressed("KeyQ") || isMouseClickInRect(getRingRotateLeftButtonRect())) {
    rotateSelectedRing(-1);
  }

  if (input.wasPressed("KeyE") || input.wasPressed("Enter") || isMouseClickInRect(getRingRotateRightButtonRect())) {
    rotateSelectedRing(1);
  }
}

function canCloseManuscriptInspection() {
  return (
    gameState.current === GAME_STATES.MANUSCRIPT &&
    !manuscriptProgress.solved &&
    !manuscriptProgress.committedToFinalStage
  );
}

function closeManuscriptInspection() {
  audioManager.playSfx("pageMovement", { volume: 0.5 });
  startSceneTransition(GAME_STATES.ARCHIVE, {
    spawnX: ARCHIVE_ROOM.TABLE_X - 42,
    facing: -1,
    duration: getTrailerAdjustedDuration(0.56),
    doorSfx: null,
  });
}

function getManuscriptObjectiveForStage() {
  if (manuscriptProgress.stage === MANUSCRIPT_STAGES.RECONSTRUCT) {
    return "reconstructPage";
  }

  if (manuscriptProgress.stage === MANUSCRIPT_STAGES.PATTERN) {
    return "interpretSymbols";
  }

  if (manuscriptProgress.stage === MANUSCRIPT_STAGES.SYMBOLS) {
    return "interpretSymbols";
  }

  if (manuscriptProgress.stage === MANUSCRIPT_STAGES.ALIGNMENT) {
    return "alignMissingPage";
  }

  return manuscriptProgress.realityChanged ? "escapeDistortion" : "inspectManuscript";
}

function getFragmentById(fragmentId) {
  return manuscriptProgress.fragments.find((fragment) => fragment.id === fragmentId) ?? null;
}

function getFragmentData(fragmentId) {
  return MANUSCRIPT_FRAGMENTS.find((fragment) => fragment.id === fragmentId) ?? null;
}

function getSelectedFragment() {
  return getFragmentById(manuscriptProgress.selectedFragmentId);
}

function selectFragment(fragmentId) {
  manuscriptProgress.selectedFragmentId = fragmentId;
}

function selectNextFragment() {
  const currentIndex = MANUSCRIPT_FRAGMENTS.findIndex(
    (fragment) => fragment.id === manuscriptProgress.selectedFragmentId,
  );
  const nextIndex = (currentIndex + 1) % MANUSCRIPT_FRAGMENTS.length;

  selectFragment(MANUSCRIPT_FRAGMENTS[nextIndex].id);
}

function getFragmentAtPoint(x, y) {
  const selected = getSelectedFragment();
  const hitOrder = selected
    ? [selected, ...manuscriptProgress.fragments.filter((fragment) => fragment !== selected).reverse()]
    : [...manuscriptProgress.fragments].reverse();

  for (const fragment of hitOrder) {
    if (isPointInFragment(x, y, fragment)) {
      return fragment;
    }
  }

  return null;
}

function isPointInFragment(x, y, fragment) {
  const centerX = fragment.x + fragment.width / 2;
  const centerY = fragment.y + fragment.height / 2;
  const quarterTurns = wrapRotation(fragment.rotation, 4);
  const hitWidth = quarterTurns % 2 === 0 ? fragment.width : fragment.height;
  const hitHeight = quarterTurns % 2 === 0 ? fragment.height : fragment.width;

  return (
    x >= centerX - hitWidth / 2 &&
    x <= centerX + hitWidth / 2 &&
    y >= centerY - hitHeight / 2 &&
    y <= centerY + hitHeight / 2
  );
}

function clampFragmentToBoard(fragment) {
  const quarterTurns = wrapRotation(fragment.rotation, 4);
  const displayWidth = quarterTurns % 2 === 0 ? fragment.width : fragment.height;
  const displayHeight = quarterTurns % 2 === 0 ? fragment.height : fragment.width;
  const centerX = fragment.x + fragment.width / 2;
  const centerY = fragment.y + fragment.height / 2;
  const clampedCenterX = clamp(
    centerX,
    MANUSCRIPT_VIEW.BOARD_X + displayWidth / 2,
    MANUSCRIPT_VIEW.BOARD_X + MANUSCRIPT_VIEW.BOARD_WIDTH - displayWidth / 2,
  );
  const clampedCenterY = clamp(
    centerY,
    MANUSCRIPT_VIEW.BOARD_Y + displayHeight / 2,
    MANUSCRIPT_VIEW.BOARD_Y + MANUSCRIPT_VIEW.BOARD_HEIGHT - displayHeight / 2,
  );

  fragment.x = clampedCenterX - fragment.width / 2;
  fragment.y = clampedCenterY - fragment.height / 2;
}

function requestFragmentRotation(direction) {
  const fragment = getSelectedFragment();

  if (!fragment || fragment.placed) {
    manuscriptProgress.message = fragment?.placed
      ? TEXT_CONTENT.manuscript.messages.fragmentLocked
      : TEXT_CONTENT.manuscript.messages.selectFragmentFirst;
    manuscriptProgress.messageTimer = 1.5;
    return;
  }

  rotateSelectedFragment(direction);
}

function rotateSelectedFragment(direction) {
  const fragment = getSelectedFragment();

  if (!fragment || fragment.placed) {
    return;
  }

  // Rotation changes only the selected fragment and preserves its center position.
  fragment.rotation = wrapRotation(fragment.rotation + direction, 4);
  clampFragmentToBoard(fragment);
  audioManager.playSfx("pageMovement", { volume: 0.45 });
  trySnapFragment(fragment);
  setManuscriptCooldown(0.12);
}

function trySnapFragment(fragment) {
  const data = getFragmentData(fragment.id);
  const distance = Math.hypot(fragment.x - data.targetX, fragment.y - data.targetY);

  // A fragment snaps only when both its board-relative target and rotation match.
  if (distance <= MANUSCRIPT_VIEW.SNAP_DISTANCE && fragment.rotation === data.targetRotation) {
    fragment.x = data.targetX;
    fragment.y = data.targetY;
    fragment.rotation = data.targetRotation;
    fragment.placed = true;
    audioManager.playSfx("fragmentPlacement", { volume: 0.58 });
    checkPageReconstructionCompletion();
    return true;
  }

  if (distance <= MANUSCRIPT_VIEW.SNAP_DISTANCE) {
    manuscriptProgress.message = TEXT_CONTENT.manuscript.messages.rotateMarking;
    manuscriptProgress.messageTimer = 1.8;
  }
  return false;
}

function checkPageReconstructionCompletion() {
  if (
    manuscriptProgress.pageReconstructed ||
    !manuscriptProgress.fragments.every((fragment) => fragment.placed)
  ) {
    return;
  }

  manuscriptProgress.pageReconstructed = true;
  manuscriptProgress.manuscriptCompleted = true;
  manuscriptProgress.manuscriptPatternDiscovered = true;
  manuscriptProgress.draggingFragmentId = null;
  manuscriptProgress.marginMarksRevealed = true;
  manuscriptProgress.stage = MANUSCRIPT_STAGES.PATTERN;
  manuscriptProgress.message = TEXT_CONTENT.manuscript.messages.reconstructionComplete;
  manuscriptProgress.messageTimer = 3;
  collectClue("reconstructedMargin");
  collectClue("manuscriptPattern");
  completeObjective("reconstructPage");
  setCurrentObjective("interpretSymbols");
  audioManager.playSfx("stageCompletion", { volume: 0.64 });
  audioManager.playSfx("symbolTone", { volume: 0.42 });
}

function addSymbolToSequence(symbolId) {
  if (
    manuscriptProgress.inputCooldown > 0 ||
    manuscriptProgress.symbolStageSolved ||
    manuscriptProgress.symbolSequence.length >= MANUSCRIPT_SYMBOL_SEQUENCE.length
  ) {
    return;
  }

  manuscriptProgress.symbolSequence.push(symbolId);
  audioManager.playSfx("symbolTone", { volume: 0.4 });
  setManuscriptCooldown(0.16);

  if (manuscriptProgress.symbolSequence.length === MANUSCRIPT_SYMBOL_SEQUENCE.length) {
    checkSymbolSequence();
  }
}

function checkSymbolSequence() {
  const isCorrect = MANUSCRIPT_SYMBOL_SEQUENCE.every(
    (symbolId, index) => manuscriptProgress.symbolSequence[index] === symbolId,
  );

  if (!isCorrect) {
    manuscriptProgress.symbolSequence = [];
    manuscriptProgress.shakeTimer = 0.42;
    manuscriptProgress.inkMotionTimer = 1.2;
    manuscriptProgress.message = TEXT_CONTENT.manuscript.messages.incorrectSymbolOrder;
    manuscriptProgress.messageTimer = 2.5;
    audioManager.playSfx("incorrectPuzzle", { volume: 0.68 });
    setManuscriptCooldown(0.28);
    return;
  }

  manuscriptProgress.symbolStageSolved = true;
  manuscriptProgress.message = TEXT_CONTENT.manuscript.messages.symbolStageComplete;
  manuscriptProgress.messageTimer = 3;
  completeObjective("interpretSymbols");
  audioManager.playSfx("stageCompletion", { volume: 0.64 });
}

function commitToFinalAlignmentStage() {
  if (!manuscriptProgress.symbolStageSolved) {
    return;
  }

  manuscriptProgress.stage = MANUSCRIPT_STAGES.ALIGNMENT;
  manuscriptProgress.committedToFinalStage = true;
  setCurrentObjective("alignMissingPage");
  audioManager.playSfx("pageMovement", { volume: 0.54 });
  setManuscriptCooldown(0.2);
}

function rotateSelectedRing(direction) {
  const ring = manuscriptProgress.rings[manuscriptProgress.selectedRingIndex];

  ring.rotation = wrapRotation(ring.rotation + direction, 8);
  audioManager.playSfx("ringRotation", { volume: 0.5 });
  setManuscriptCooldown(0.12);
  checkRingAlignmentCompletion();
}

function resetRingAlignment() {
  manuscriptProgress.rings.forEach((ring) => {
    ring.rotation = 0;
  });
  manuscriptProgress.message = TEXT_CONTENT.manuscript.messages.ringsReset;
  manuscriptProgress.messageTimer = 1.6;
  audioManager.playSfx("ringRotation", { volume: 0.42 });
  setManuscriptCooldown(0.2);
}

function checkRingAlignmentCompletion() {
  if (
    manuscriptProgress.finalTriggered ||
    !MANUSCRIPT_RINGS.every(
      (ringData, index) => manuscriptProgress.rings[index].rotation === ringData.target,
    )
  ) {
    return;
  }

  completeManuscriptPuzzle();
}

function completeManuscriptPuzzle() {
  if (manuscriptProgress.finalTriggered) {
    return;
  }

  manuscriptProgress.stage = MANUSCRIPT_STAGES.SOLVED;
  manuscriptProgress.solved = true;
  manuscriptProgress.realityChanged = true;
  manuscriptProgress.finalTriggered = true;
  manuscriptProgress.glitchTimer = getTrailerAdjustedDuration(1.45);
  manuscriptProgress.returnTimer = getTrailerAdjustedDuration(1.55);
  archiveProgress.manuscriptSequenceStarted = true;
  completeObjective("alignMissingPage");
  collectClue("manuscriptControlInterface");
  setCurrentObjective("escapeDistortion");
  audioManager.stopAmbience({ fadeSeconds: 0.05 });
  audioManager.stopMusic({ fadeSeconds: 0.05 });
  audioManager.playSfx("silenceBeforeRealityChange", { volume: 0.62 });
  audioManager.playSfx("finalAlignment", { volume: 0.72 });
  audioManager.playSfx("glitchBurst", { volume: 0.7 });
}

function autoCompleteCurrentManuscriptStage() {
  if (manuscriptProgress.stage === MANUSCRIPT_STAGES.RECONSTRUCT) {
    manuscriptProgress.fragments.forEach((fragment) => {
      const data = getFragmentData(fragment.id);

      fragment.x = data.targetX;
      fragment.y = data.targetY;
      fragment.rotation = data.targetRotation;
      fragment.placed = true;
    });
    checkPageReconstructionCompletion();
    return;
  }

  if (manuscriptProgress.stage === MANUSCRIPT_STAGES.PATTERN) {
    manuscriptProgress.stage = MANUSCRIPT_STAGES.SYMBOLS;
    return;
  }

  if (manuscriptProgress.stage === MANUSCRIPT_STAGES.SYMBOLS) {
    manuscriptProgress.symbolSequence = [...MANUSCRIPT_SYMBOL_SEQUENCE];
    checkSymbolSequence();
    return;
  }

  if (manuscriptProgress.stage === MANUSCRIPT_STAGES.ALIGNMENT) {
    manuscriptProgress.rings.forEach((ring, index) => {
      ring.rotation = MANUSCRIPT_RINGS[index].target;
    });
    checkRingAlignmentCompletion();
  }
}

function getClickedSymbolButtonId() {
  if (!mouse.justPressed) {
    return null;
  }

  const symbol = MANUSCRIPT_SYMBOLS.find((entry, index) =>
    isPointInRect(mouse.x, mouse.y, getSymbolButtonRect(index)),
  );

  return symbol?.id ?? null;
}

function getRingIndexAtPoint(x, y) {
  const distance = Math.hypot(x - MANUSCRIPT_VIEW.RING_CENTER_X, y - MANUSCRIPT_VIEW.RING_CENTER_Y);

  for (let index = 0; index < MANUSCRIPT_RINGS.length; index += 1) {
    const ring = MANUSCRIPT_RINGS[index];
    const inner = ring.radius - ring.width;
    const outer = ring.radius + ring.width;

    if (distance >= inner && distance <= outer) {
      return index;
    }
  }

  return null;
}

function setManuscriptCooldown(seconds) {
  manuscriptProgress.inputCooldown = Math.max(manuscriptProgress.inputCooldown, seconds);
}

function getCloseManuscriptButtonRect() {
  return { x: 554, y: 18, width: 58, height: 22 };
}

function getControlsButtonRect() {
  return { x: 450, y: 18, width: 88, height: 22 };
}

function getDeveloperCompleteButtonRect() {
  return { x: 430, y: 312, width: 176, height: 26 };
}

function getPuzzleButtonRect(id) {
  if (id === "rotateLeft") {
    return { x: 422, y: 258, width: 88, height: MANUSCRIPT_VIEW.BUTTON_HEIGHT };
  }

  if (id === "rotateRight") {
    return { x: 522, y: 258, width: 88, height: MANUSCRIPT_VIEW.BUTTON_HEIGHT };
  }

  return { x: 0, y: 0, width: 0, height: 0 };
}

function getSymbolButtonRect(index) {
  return {
    x: 72 + index * 124,
    y: 238,
    width: 104,
    height: 58,
  };
}

function getBeginAlignmentButtonRect() {
  return { x: 426, y: 266, width: 160, height: 28 };
}

function getPatternContinueButtonRect() {
  return { x: 438, y: 258, width: 166, height: 28 };
}

function getStageThreeBackButtonRect() {
  return { x: 424, y: 266, width: 76, height: 28 };
}

function getStageThreeResetButtonRect() {
  return { x: 510, y: 266, width: 76, height: 28 };
}

function getRingRotateLeftButtonRect() {
  return { x: 424, y: 220, width: 76, height: 28 };
}

function getRingRotateRightButtonRect() {
  return { x: 510, y: 220, width: 76, height: 28 };
}

function isMouseClickInRect(rect) {
  return mouse.justPressed && isPointInRect(mouse.x, mouse.y, rect);
}

function isPointInRect(x, y, rect) {
  return (
    x >= rect.x &&
    x <= rect.x + rect.width &&
    y >= rect.y &&
    y <= rect.y + rect.height
  );
}

function wrapRotation(value, modulo) {
  return ((value % modulo) + modulo) % modulo;
}

function updateChamberRingPuzzle(deltaSeconds) {
  chamberRingProgress.inputCooldown = Math.max(0, chamberRingProgress.inputCooldown - deltaSeconds);
  chamberRingProgress.rejectionTimer = Math.max(0, chamberRingProgress.rejectionTimer - deltaSeconds);
  chamberRingProgress.messageTimer = Math.max(0, chamberRingProgress.messageTimer - deltaSeconds);
  realityProgress.messageTimer = Math.max(0, realityProgress.messageTimer - deltaSeconds);

  if (chamberRingProgress.ringSolved) {
    if (chamberRingProgress.messageTimer === 0 && !transitionState.active) {
      startSceneTransition(GAME_STATES.ARCHIVIST, {
        spawnX: ARCHIVIST_CHAMBER.START_X,
        facing: 1,
        duration: 1.1,
        doorSfx: null,
      });
    }
    return;
  }

  if (
    chamberRingProgress.inputCooldown > 0 ||
    journalState.open ||
    controlsState.open ||
    transitionState.active
  ) {
    return;
  }

  for (let index = 0; index < ARCHIVE_SYMBOL_PATTERN.length; index += 1) {
    if (isMouseClickInRect(getChamberRingSectionRect(index))) {
      if (chamberRingProgress.selectedSection === index) {
        cycleChamberRingSymbol(1);
        return;
      }
      chamberRingProgress.selectedSection = index;
      audioManager.playSfx("uiMove", { volume: 0.38 });
      return;
    }
  }

  if (input.wasPressed("ArrowLeft") || input.wasPressed("KeyA") || input.wasPressed("Tab")) {
    chamberRingProgress.selectedSection = wrapRotation(
      chamberRingProgress.selectedSection - 1,
      ARCHIVE_SYMBOL_PATTERN.length,
    );
    return;
  }

  if (input.wasPressed("ArrowRight") || input.wasPressed("KeyD")) {
    chamberRingProgress.selectedSection = wrapRotation(
      chamberRingProgress.selectedSection + 1,
      ARCHIVE_SYMBOL_PATTERN.length,
    );
    return;
  }

  if (input.wasPressed("KeyQ") || isMouseClickInRect(getChamberRingRotateRect(-1))) {
    cycleChamberRingSymbol(-1);
    return;
  }

  if (input.wasPressed("KeyE") || isMouseClickInRect(getChamberRingRotateRect(1))) {
    cycleChamberRingSymbol(1);
    return;
  }

  if (input.wasPressed("Enter") || isMouseClickInRect(getChamberRingEngageRect())) {
    testChamberRingAlignment();
  }
}

function cycleChamberRingSymbol(direction) {
  const index = chamberRingProgress.selectedSection;
  chamberRingProgress.symbols[index] = wrapRotation(
    chamberRingProgress.symbols[index] + direction,
    ARCHIVE_SYMBOL_PATTERN.length,
  );
  chamberRingProgress.inputCooldown = 0.1;
  audioManager.playSfx("ringRotation", { volume: 0.5 });
}

function testChamberRingAlignment() {
  if (!manuscriptProgress.manuscriptPatternDiscovered) {
    chamberRingProgress.message = TEXT_CONTENT.archivist.chamber.noMeaning;
    chamberRingProgress.messageTimer = 2.4;
    return;
  }

  const correct = chamberRingProgress.symbols.every((symbolIndex, index) => symbolIndex === index);

  if (!correct) {
    chamberRingProgress.rejectionTimer = 0.75;
    chamberRingProgress.message = TEXT_CONTENT.archivist.chamber.orderRecognizedNotAccepted;
    chamberRingProgress.messageTimer = 2.4;
    audioManager.playSfx("ringFailure", { volume: 0.58 });
    audioManager.playSfx("lightFlicker", { volume: 0.4 });
    return;
  }

  chamberRingProgress.ringSolved = true;
  chamberRingProgress.message = TEXT_CONTENT.archivist.chamber.chamberOpens;
  chamberRingProgress.messageTimer = 2.8;
  completeObjective("unlockRestrictedChamber");
  audioManager.playSfx("ringSuccess", { volume: 0.74 });
  audioManager.playSfx("passageOpenBass", { volume: 0.54 });
}

function getChamberRingSectionRect(index) {
  const positions = [
    { x: 178, y: 68 },
    { x: 292, y: 142 },
    { x: 178, y: 216 },
    { x: 64, y: 142 },
  ];
  return { ...positions[index], width: 92, height: 58 };
}

function getChamberRingRotateRect(direction) {
  return direction < 0
    ? { x: 438, y: 248, width: 78, height: 28 }
    : { x: 526, y: 248, width: 78, height: 28 };
}

function getChamberRingEngageRect() {
  return { x: 438, y: 286, width: 166, height: 28 };
}

function updateLegacyArchivistEncounter(deltaSeconds) {
  archivistScene.time += deltaSeconds;
  archivistScene.grainTimer += deltaSeconds;
  realityProgress.messageTimer = Math.max(0, realityProgress.messageTimer - deltaSeconds);
  archivistProgress.messageTimer = Math.max(0, archivistProgress.messageTimer - deltaSeconds);
  archivistProgress.stabilityCooldown = Math.max(0, archivistProgress.stabilityCooldown - deltaSeconds);
  archivistProgress.interferenceTimer -= deltaSeconds;

  while (archivistScene.grainTimer >= 0.06) {
    archivistScene.grainTimer -= 0.06;
    archivistScene.grainFrame = (archivistScene.grainFrame + 7) % 997;
  }

  if (archivistProgress.interferenceActive) {
    archivistProgress.interferenceDuration = Math.max(
      0,
      archivistProgress.interferenceDuration - deltaSeconds,
    );
    if (archivistProgress.interferenceDuration === 0) {
      archivistProgress.interferenceActive = false;
    }
  } else if (archivistProgress.interferenceTimer <= 0 && archivistProgress.bossPhase < 4) {
    archivistProgress.interferenceActive = true;
    archivistProgress.interferenceDuration = 0.8;
    archivistProgress.interferenceTimer = 4.5 + archivistProgress.bossPhase;
    audioManager.playSfx("lightFlicker", { volume: 0.48 });
  }

  if (archivistProgress.gameEnding) {
    archivistProgress.endingTimer = Math.max(0, archivistProgress.endingTimer - deltaSeconds);
    const endingElapsed = 20 - archivistProgress.endingTimer;
    archivistScene.flashlightOn =
      !(
        (endingElapsed > 5.5 && endingElapsed < 6.3) ||
        (endingElapsed > 10.5 && endingElapsed < 11.7) ||
        endingElapsed > 16
      );
    if (archivistProgress.endingTimer === 0 && !transitionState.active) {
      startSceneTransition(GAME_STATES.ENDING, {
        spawnX: player.x,
        facing: player.facing,
        duration: 1.4,
        doorSfx: null,
      });
    }
    return;
  }

  if (archivistProgress.bossPhase === 1) {
    archivistProgress.teleportTimer -= deltaSeconds;
    if (archivistProgress.teleportTimer <= 0) {
      const positions = [180, 520, 980, 1380];
      const current = positions.findIndex((value) => value === archivistProgress.archivistX);
      archivistProgress.archivistX = positions[(current + 1 + archivistProgress.corruptedNodesDisabled.size) % positions.length];
      archivistProgress.teleportTimer = 3.2;
      archivistProgress.message = TEXT_CONTENT.archivist.messages.falsePrompt;
      archivistProgress.messageTimer = 1.5;
    }

    if (
      Math.abs(player.x + player.width / 2 - archivistProgress.archivistX) < 42 &&
      archivistProgress.stabilityCooldown === 0
    ) {
      applyStabilityHit(TEXT_CONTENT.boss.messages.rewritesSpace);
    }
  }
}

function disableCorruptedNode(index) {
  if (
    archivistProgress.bossPhase !== 1 ||
    archivistProgress.interferenceActive ||
    archivistProgress.corruptedNodesDisabled.has(index)
  ) {
    archivistProgress.message = TEXT_CONTENT.archivist.messages.recordHidden;
    archivistProgress.messageTimer = 1.5;
    return;
  }

  archivistProgress.corruptedNodesDisabled.add(index);
  audioManager.playSfx("corruptedNode", { volume: 0.62 });
  archivistProgress.message = formatText(TEXT_CONTENT.archivist.messages.corruptedRecordsDisabled, {
    count: archivistProgress.corruptedNodesDisabled.size,
  });
  archivistProgress.messageTimer = 2;

  if (archivistProgress.corruptedNodesDisabled.size < 3) {
    return;
  }

  archivistProgress.bossPhase = 2;
  archivistProgress.realCopyIndex = 1;
  setCurrentObjective("identifyTrueArchivist");
  audioManager.playSfx("bossPhase", { volume: 0.65 });
}

function testArchivistCopy(index) {
  if (archivistProgress.bossPhase !== 2 || archivistProgress.interferenceActive) {
    return;
  }

  if (index !== archivistProgress.realCopyIndex) {
    archivistProgress.realCopyIndex = (archivistProgress.realCopyIndex + 1) % 3;
    applyStabilityHit(TEXT_CONTENT.boss.messages.copyCollapses);
    return;
  }

  archivistProgress.trueArchivistIdentified = true;
  archivistProgress.bossPhase = 3;
  setCurrentObjective("breakUpdateLoop");
  archivistProgress.message = TEXT_CONTENT.archivist.messages.trueSequence;
  archivistProgress.messageTimer = 2.6;
  audioManager.playSfx("bossPhase", { volume: 0.65 });
}

function activateArchiveLoopControl(index) {
  if (
    archivistProgress.bossPhase !== 3 ||
    archivistProgress.interferenceActive ||
    archivistProgress.finalSequenceSolved
  ) {
    return;
  }

  const expectedIndex = archivistProgress.finalSequence.length;
  if (index !== expectedIndex) {
    archivistProgress.finalSequence = [];
    applyStabilityHit(TEXT_CONTENT.boss.messages.updateLoopRejects);
    return;
  }

  archivistProgress.finalSequence.push(index);
  audioManager.playSfx("wallSwitch", { volume: 0.58 });
  archivistProgress.message = formatText(TEXT_CONTENT.archivist.messages.controlsHolding, {
    count: archivistProgress.finalSequence.length,
  });
  archivistProgress.messageTimer = 1.6;

  if (archivistProgress.finalSequence.length < ARCHIVE_SYMBOL_PATTERN.length) {
    return;
  }

  archivistProgress.finalSequenceSolved = true;
  archivistProgress.bossPhase = 4;
  archivistProgress.archivistX = -200;
  setCurrentObjective("inspectFinalEntry");
  audioManager.stopMusic({ fadeSeconds: 0.7 });
  audioManager.playSfx("archiveShutdown", { volume: 0.76 });
  archivistProgress.message = TEXT_CONTENT.archivist.messages.updateLoopCollapses;
  archivistProgress.messageTimer = 4;
}

function applyLegacyStabilityHit(message) {
  if (archivistProgress.stabilityCooldown > 0 || archivistProgress.gameEnding) {
    return;
  }

  archivistProgress.playerStability -= 1;
  archivistProgress.stabilityCooldown = 1.4;
  archivistProgress.message = message;
  archivistProgress.messageTimer = 2.2;
  player.x = clamp(player.x - player.facing * 86, 42, ARCHIVIST_CHAMBER.WIDTH - 72);
  audioManager.playSfx("stabilityHit", { volume: 0.65 });

  if (archivistProgress.playerStability > 0) {
    return;
  }

  archivistProgress.playerStability = 3;
  archivistProgress.bossPhase = 1;
  archivistProgress.corruptedNodesDisabled = new Set();
  archivistProgress.trueArchivistIdentified = false;
  archivistProgress.finalSequence = [];
  archivistProgress.finalSequenceSolved = false;
  archivistProgress.archivistX = 1180;
  player.x = ARCHIVIST_CHAMBER.START_X;
  setCurrentObjective("disableCorruptedNodes");
  archivistProgress.message = TEXT_CONTENT.archivist.messages.recordTears;
  archivistProgress.messageTimer = 4;
}

function inspectFinalArchiveTerminal() {
  if (archivistProgress.bossPhase !== 4 || archivistProgress.gameEnding) {
    return;
  }

  archivistProgress.finalTerminalInspected = true;
  archivistProgress.gameEnding = true;
  archivistProgress.endingTimer = 20;
  completeObjective("inspectFinalEntry");
  audioManager.stopAmbience({ fadeSeconds: 2.2 });
  audioManager.playSfx("finalPageReveal", { volume: 0.54 });
}

function resetArchivistCombat() {
  Object.assign(archivistProgress, createArchivistProgress());
  archivistProgress.bossStarted = true;
  archivistProgress.bossActive = true;
  archivistProgress.bossHealth = BOSS_COMBAT.MAX_HEALTH;
  archivistProgress.playerStability = BOSS_COMBAT.MAX_STABILITY;
  archivistProgress.manuscriptCharge = BOSS_COMBAT.MAX_CHARGE;
  archivistProgress.bossPhase = 1;
  archivistProgress.archivistX = 1180;
  archivistProgress.attackCounter = 0;
  archivistProgress.defeatTimer = 0;
  archivistScene.flashlightOn = true;
  player.x = ARCHIVIST_CHAMBER.START_X;
  player.y = PLAYER_CONFIG.SPAWN_Y;
  player.velocityX = 0;
  player.facing = 1;
  clampCameraToCurrentWorld(camera, player);
}

function updateArchivistEncounter(deltaSeconds) {
  archivistScene.time += deltaSeconds;
  archivistScene.grainTimer += deltaSeconds;
  archivistProgress.messageTimer = Math.max(0, archivistProgress.messageTimer - deltaSeconds);
  archivistProgress.playerInvulnerable = Math.max(
    0,
    archivistProgress.playerInvulnerable - deltaSeconds,
  );
  archivistProgress.dodgeActive = Math.max(0, archivistProgress.dodgeActive - deltaSeconds);
  archivistProgress.dodgeCooldown = Math.max(0, archivistProgress.dodgeCooldown - deltaSeconds);
  archivistProgress.bossHitReaction = Math.max(0, archivistProgress.bossHitReaction - deltaSeconds);
  archivistProgress.beamPulseTimer = Math.max(0, archivistProgress.beamPulseTimer - deltaSeconds);
  archivistProgress.bossBlockedSoundCooldown = Math.max(
    0,
    archivistProgress.bossBlockedSoundCooldown - deltaSeconds,
  );
  archivistProgress.sealErrorTimer = Math.max(0, archivistProgress.sealErrorTimer - deltaSeconds);
  archivistProgress.tutorialTimer = Math.max(0, archivistProgress.tutorialTimer - deltaSeconds);

  while (archivistScene.grainTimer >= 0.06) {
    archivistScene.grainTimer -= 0.06;
    archivistScene.grainFrame = (archivistScene.grainFrame + 7) % 997;
  }

  if (archivistProgress.playerDefeated) {
    updateBossDefeatMenu();
    return;
  }

  if (archivistProgress.bossDefeated) {
    archivistProgress.defeatTimer = Math.max(0, archivistProgress.defeatTimer - deltaSeconds);
    if (archivistProgress.defeatTimer === 0 && !transitionState.active) {
      startSceneTransition(GAME_STATES.ESCAPE, {
        spawnX: 72,
        facing: 1,
        duration: 1.2,
        doorSfx: null,
      });
    }
    return;
  }

  const movementInput = getHorizontalInput();
  if (movementInput !== 0) {
    archivistProgress.tutorialMoved = true;
  }

  if (input.wasPressed("Space") && archivistProgress.dodgeCooldown === 0) {
    archivistProgress.dodgeActive = BOSS_COMBAT.DODGE_SECONDS;
    archivistProgress.dodgeCooldown = BOSS_COMBAT.DODGE_COOLDOWN;
    archivistProgress.playerInvulnerable = Math.max(
      archivistProgress.playerInvulnerable,
      BOSS_COMBAT.DODGE_SECONDS,
    );
    archivistProgress.tutorialDodged = true;
    audioManager.playSfx("paperMove", { volume: 0.44 });
  }

  if (archivistProgress.dodgeActive > 0) {
    const dodgeDirection = movementInput || player.facing || 1;
    player.x = clamp(
      player.x + dodgeDirection * 330 * deltaSeconds,
      42,
      ARCHIVIST_CHAMBER.WIDTH - 72,
    );
  }

  updateCombatBeam(deltaSeconds);
  updateBossProjectiles(deltaSeconds);
  updateBossFloorHazards(deltaSeconds);

  if (archivistProgress.phaseTransitionTimer > 0) {
    archivistProgress.phaseTransitionTimer = Math.max(
      0,
      archivistProgress.phaseTransitionTimer - deltaSeconds,
    );
    if (archivistProgress.phaseTransitionTimer === 0) {
      archivistProgress.bossInvulnerable = archivistProgress.symbolInterruptionActive;
    }
    return;
  }

  updateBossAttack(deltaSeconds);

  if (!archivistProgress.symbolInterruptionActive) {
    updateArchivistMovement(deltaSeconds);
  } else if (archivistProgress.bossAttackState === null) {
    archivistProgress.bossAttackCooldown = Math.max(
      0,
      archivistProgress.bossAttackCooldown - deltaSeconds,
    );
    if (archivistProgress.bossAttackCooldown === 0) {
      archivistProgress.bossAttackState = {
        type: "projectile",
        timer: 0.82,
        fired: false,
      };
      archivistProgress.bossAttackCooldown = 1.8;
      audioManager.playSfx("bossWindup", { volume: 0.42 });
    }
  }

  if (
    archivistProgress.bossAttackState === null &&
    !archivistProgress.symbolInterruptionActive
  ) {
    archivistProgress.bossAttackCooldown = Math.max(
      0,
      archivistProgress.bossAttackCooldown - deltaSeconds,
    );
    if (archivistProgress.bossAttackCooldown === 0) {
      startNextBossAttack();
    }
  }
}

function updateCombatBeam(deltaSeconds) {
  const wantsBeam =
    archivistProgress.bossActive &&
    !archivistProgress.playerDefeated &&
    (mouse.isDown || input.isPressed("KeyE"));
  const canBeam = wantsBeam && archivistProgress.manuscriptCharge > 0;
  archivistProgress.beamActive = canBeam;

  if (!canBeam) {
    archivistProgress.beamSoundActive = false;
    archivistProgress.manuscriptCharge = Math.min(
      BOSS_COMBAT.MAX_CHARGE,
      archivistProgress.manuscriptCharge + BOSS_COMBAT.CHARGE_REGEN_PER_SECOND * deltaSeconds,
    );
    return;
  }

  archivistProgress.tutorialAttacked = true;
  if (!archivistProgress.beamSoundActive) {
    archivistProgress.beamSoundActive = true;
    audioManager.playSfx("chargedBeam", { volume: 0.5 });
  }
  player.facing = archivistProgress.archivistX >= player.x ? 1 : -1;
  archivistProgress.manuscriptCharge = Math.max(
    0,
    archivistProgress.manuscriptCharge - BOSS_COMBAT.CHARGE_DRAIN_PER_SECOND * deltaSeconds,
  );

  if (archivistProgress.manuscriptCharge === 0) {
    audioManager.playSfx("chargeEmpty", { volume: 0.48 });
  }

  if (archivistProgress.beamPulseTimer > 0) {
    return;
  }

  archivistProgress.beamPulseTimer = BOSS_COMBAT.BEAM_PULSE_SECONDS;

  const beamStart = player.x + player.width / 2;
  const beamEnd = beamStart + player.facing * BOSS_COMBAT.BEAM_RANGE;
  const minX = Math.min(beamStart, beamEnd);
  const maxX = Math.max(beamStart, beamEnd);

  const copyIndex = archivistProgress.falseCopies.findIndex(
    (copyX) => copyX >= minX && copyX <= maxX,
  );
  if (copyIndex !== -1) {
    archivistProgress.falseCopies.splice(copyIndex, 1);
    audioManager.playSfx("glitchBurst", { volume: 0.34 });
    return;
  }

  if (archivistProgress.archivistX >= minX && archivistProgress.archivistX <= maxX) {
    damageArchivist(BOSS_COMBAT.BEAM_DAMAGE);
  }
}

function updateArchivistMovement(deltaSeconds) {
  if (!archivistProgress.bossActive || archivistProgress.bossAttackState?.type === "finalBeam") {
    return;
  }

  const playerCenter = player.x + player.width / 2;
  const distance = playerCenter - archivistProgress.archivistX;
  const desiredDistance = archivistProgress.bossPhase === 1 ? 82 : 118;
  const speed = archivistProgress.bossPhase === 1 ? 42 : archivistProgress.bossPhase === 2 ? 56 : 68;

  if (Math.abs(distance) > desiredDistance) {
    archivistProgress.archivistX += Math.sign(distance) * speed * deltaSeconds;
  }
  archivistProgress.archivistX = clamp(
    archivistProgress.archivistX,
    80,
    ARCHIVIST_CHAMBER.WIDTH - 80,
  );
}

function startNextBossAttack() {
  const distance = Math.abs(player.x + player.width / 2 - archivistProgress.archivistX);
  const phase = archivistProgress.bossPhase;
  const counter = archivistProgress.attackCounter++;
  let type;

  if (distance < 120 && counter % 2 === 0) {
    type = "slash";
  } else if (phase >= 3 && counter % 5 === 4) {
    type = "collapse";
  } else if (phase >= 3 && counter % 4 === 3) {
    type = "lightFailure";
  } else if (phase >= 2 && counter % 3 === 2) {
    type = "spikes";
  } else {
    type = "projectile";
  }

  const durations = {
    slash: 0.78,
    projectile: 0.82,
    spikes: 1,
    lightFailure: 3.2,
    collapse: 1.25,
  };
  archivistProgress.bossAttackState = {
    type,
    timer: durations[type],
    fired: false,
  };
  if (type === "projectile" && distance < 210) {
    const retreatDirection =
      archivistProgress.archivistX >= player.x + player.width / 2 ? 1 : -1;
    archivistProgress.archivistX = clamp(
      archivistProgress.archivistX + retreatDirection * 100,
      80,
      ARCHIVIST_CHAMBER.WIDTH - 80,
    );
  }
  audioManager.playSfx("bossWindup", { volume: 0.5 });

  if (type === "spikes") {
    createSpikeWarnings();
  } else if (type === "collapse") {
    createCollapseWarnings();
  }
}

function updateBossAttack(deltaSeconds) {
  const attack = archivistProgress.bossAttackState;
  if (!attack) {
    return;
  }

  attack.timer = Math.max(0, attack.timer - deltaSeconds);

  if (attack.type === "slash" && attack.timer <= 0.22 && !attack.fired) {
    attack.fired = true;
    audioManager.playSfx("recordSlash", { volume: 0.62 });
    if (Math.abs(player.x + player.width / 2 - archivistProgress.archivistX) < 112) {
      applyStabilityHit(TEXT_CONTENT.boss.messages.slashCuts, archivistProgress.archivistX);
    }
  } else if (attack.type === "projectile" && attack.timer <= 0.3 && !attack.fired) {
    attack.fired = true;
    const direction = player.x >= archivistProgress.archivistX ? 1 : -1;
    archivistProgress.projectiles.push({
      x: archivistProgress.archivistX,
      y: 228,
      velocityX: direction * (archivistProgress.bossPhase >= 2 ? 205 : 165),
    });
    audioManager.playSfx("inkProjectile", { volume: 0.58 });
  } else if (attack.type === "lightFailure") {
    archivistScene.flashlightOn = Math.sin(archivistScene.time * 5) > -0.45;
  } else if (attack.type === "finalBeam" && attack.timer <= 0.28 && !attack.fired) {
    attack.fired = true;
    if (archivistProgress.dodgeActive === 0) {
      applyStabilityHit(TEXT_CONTENT.boss.messages.finalRecordCloses, archivistProgress.archivistX);
    }
  }

  if (attack.timer > 0) {
    return;
  }

  if (attack.type === "lightFailure") {
    archivistScene.flashlightOn = true;
  }
  if (attack.type === "finalBeam") {
    archivistProgress.bossInvulnerable = false;
    archivistProgress.message = TEXT_CONTENT.boss.messages.finalEntryExposed;
    archivistProgress.messageTimer = 2.2;
  }
  archivistProgress.bossAttackState = null;
  archivistProgress.bossAttackCooldown =
    archivistProgress.bossPhase === 1 ? 1.4 : archivistProgress.bossPhase === 2 ? 1.1 : 0.85;
}

function updateBossProjectiles(deltaSeconds) {
  archivistProgress.projectiles = archivistProgress.projectiles.filter((projectile) => {
    projectile.x += projectile.velocityX * deltaSeconds;
    if (projectile.x < 20 || projectile.x > ARCHIVIST_CHAMBER.WIDTH - 20) {
      return false;
    }
    if (
      Math.abs(projectile.x - (player.x + player.width / 2)) < 18 &&
      archivistProgress.playerInvulnerable === 0
    ) {
      applyStabilityHit(TEXT_CONTENT.boss.messages.corruptedInk, projectile.x);
      return false;
    }
    return true;
  });
}

function createSpikeWarnings() {
  const baseX = player.x;
  archivistProgress.spikeWarnings = [-110, 30, 170].map((offset) => ({
    x: clamp(baseX + offset, 50, ARCHIVIST_CHAMBER.WIDTH - 70),
    timer: 0.9,
    active: 0,
    hit: false,
  }));
  audioManager.playSfx("spikeWarning", { volume: 0.48 });
}

function createCollapseWarnings() {
  const baseX = player.x;
  archivistProgress.collapseWarnings = [0, 240].map((offset) => ({
    x: clamp(baseX + offset, 50, ARCHIVIST_CHAMBER.WIDTH - 90),
    timer: 1.1,
    active: 0,
    hit: false,
  }));
  audioManager.playSfx("spikeWarning", { volume: 0.5 });
}

function updateBossFloorHazards(deltaSeconds) {
  for (const warning of [...archivistProgress.spikeWarnings, ...archivistProgress.collapseWarnings]) {
    if (warning.timer > 0) {
      warning.timer = Math.max(0, warning.timer - deltaSeconds);
      if (warning.timer === 0) {
        warning.active = 0.36;
      }
    } else {
      warning.active = Math.max(0, warning.active - deltaSeconds);
      if (
        warning.active > 0 &&
        !warning.hit &&
        Math.abs(player.x + player.width / 2 - warning.x) < 42
      ) {
        warning.hit = true;
        applyStabilityHit(TEXT_CONTENT.boss.messages.floorErupts, warning.x);
      }
    }
  }
  archivistProgress.spikeWarnings = archivistProgress.spikeWarnings.filter(
    (warning) => warning.timer > 0 || warning.active > 0,
  );
  archivistProgress.collapseWarnings = archivistProgress.collapseWarnings.filter(
    (warning) => warning.timer > 0 || warning.active > 0,
  );
}

function damageArchivist(amount) {
  if (!archivistProgress.bossActive || archivistProgress.bossDefeated) {
    return false;
  }

  if (archivistProgress.bossInvulnerable) {
    playArchivistBlockedFeedback();
    return false;
  }

  archivistProgress.bossHealth = Math.max(0, archivistProgress.bossHealth - amount);
  archivistProgress.bossHitReaction = 0.2;
  archivistProgress.hitsSinceTeleport += 1;
  audioManager.playSfx("archivistHit", { volume: 0.65 });

  if (archivistProgress.hitsSinceTeleport >= 4 && archivistProgress.bossHealth > 10) {
    archivistProgress.hitsSinceTeleport = 0;
    teleportArchivist();
  }

  if (archivistProgress.bossHealth === 0) {
    defeatArchivist();
    return true;
  }

  if (archivistProgress.bossPhase === 1 && archivistProgress.bossHealth <= 70) {
    beginCombatPhaseTwo();
  } else if (
    archivistProgress.bossPhase === 2 &&
    archivistProgress.bossHealth <= 35 &&
    !archivistProgress.symbolInterruptionActive
  ) {
    beginSymbolInterruption();
  } else if (
    archivistProgress.bossPhase === 3 &&
    archivistProgress.bossHealth <= 10 &&
    !archivistProgress.finalStandTriggered
  ) {
    beginFinalStand();
  }
  return true;
}

function playArchivistBlockedFeedback() {
  if (archivistProgress.bossBlockedSoundCooldown > 0) {
    return;
  }

  archivistProgress.bossBlockedSoundCooldown = BOSS_COMBAT.BLOCKED_SOUND_COOLDOWN;
  audioManager.playSfx("archivistBlocked", { volume: 0.55 });
}

function teleportArchivist() {
  const previousX = archivistProgress.archivistX;
  const behindPlayer = player.x - player.facing * 170;
  archivistProgress.archivistX = clamp(
    archivistProgress.bossPhase >= 2
      ? behindPlayer
      : archivistProgress.archivistX < ARCHIVIST_CHAMBER.WIDTH / 2
        ? 1280
        : 320,
    80,
    ARCHIVIST_CHAMBER.WIDTH - 80,
  );
  if (archivistProgress.bossPhase === 2) {
    archivistProgress.falseCopies.push(previousX);
    archivistProgress.falseCopies = archivistProgress.falseCopies.slice(-3);
  }
  audioManager.playSfx("archivistTeleport", { volume: 0.58 });
}

function beginCombatPhaseTwo() {
  archivistProgress.bossPhase = 2;
  archivistProgress.bossHealth = 70;
  archivistProgress.bossInvulnerable = true;
  archivistProgress.phaseTransitionTimer = 2.4;
  archivistProgress.falseCopies = [420, 1020];
  player.x = clamp(player.x - player.facing * 90, 42, ARCHIVIST_CHAMBER.WIDTH - 72);
  archivistProgress.message = TEXT_CONTENT.boss.messages.observerRecord;
  archivistProgress.messageTimer = 4;
  audioManager.playSfx("bossPhase", { volume: 0.65 });
  audioManager.playSfx("lightFlicker", { volume: 0.5 });
}

function beginSymbolInterruption() {
  archivistProgress.bossHealth = 35;
  archivistProgress.bossInvulnerable = true;
  archivistProgress.symbolInterruptionActive = true;
  archivistProgress.symbolInterruptionSequence = [];
  archivistProgress.bossAttackState = null;
  archivistProgress.bossAttackCooldown = 1.4;
  setCurrentObjective("breakArchivistSeal");
  archivistProgress.message = TEXT_CONTENT.boss.messages.machineSeal;
  archivistProgress.messageTimer = 3;
  audioManager.playSfx("bossPhase", { volume: 0.65 });
}

function activateCombatSealControl(index) {
  if (!archivistProgress.symbolInterruptionActive || archivistProgress.playerDefeated) {
    return;
  }

  const expected = archivistProgress.symbolInterruptionSequence.length;
  if (index !== expected) {
    archivistProgress.symbolInterruptionSequence = [];
    archivistProgress.sealErrorTimer = 0.48;
    archivistProgress.message = TEXT_CONTENT.boss.messages.sealRejects;
    archivistProgress.messageTimer = 1.5;
    audioManager.playSfx("ringFailure", { volume: 0.44 });
    return;
  }

  archivistProgress.symbolInterruptionSequence.push(index);
  audioManager.playSfx("wallSwitch", { volume: 0.54 });
  if (archivistProgress.symbolInterruptionSequence.length < 4) {
    return;
  }

  archivistProgress.symbolInterruptionActive = false;
  archivistProgress.bossInvulnerable = false;
  archivistProgress.bossPhase = 3;
  archivistProgress.falseCopies = [];
  archivistProgress.bossAttackCooldown = 1.1;
  setCurrentObjective("confrontArchivist");
  archivistProgress.message = TEXT_CONTENT.boss.messages.sealBreaks;
  archivistProgress.messageTimer = 2.5;
  audioManager.playSfx("bossPhase", { volume: 0.65 });
}

function beginFinalStand() {
  archivistProgress.finalStandTriggered = true;
  archivistProgress.bossHealth = 10;
  archivistProgress.bossInvulnerable = true;
  archivistProgress.bossAttackState = {
    type: "finalBeam",
    timer: 1.65,
    fired: false,
  };
  archivistProgress.message = TEXT_CONTENT.boss.messages.finalRecordCharging;
  archivistProgress.messageTimer = 2;
  audioManager.playSfx("bossWindup", { volume: 0.65 });
}

function applyStabilityHit(message, sourceX = archivistProgress.archivistX) {
  if (
    archivistProgress.playerInvulnerable > 0 ||
    archivistProgress.playerDefeated ||
    archivistProgress.bossDefeated
  ) {
    return false;
  }

  archivistProgress.playerStability = Math.max(0, archivistProgress.playerStability - 1);
  archivistProgress.playerInvulnerable = 1;
  archivistProgress.message = message;
  archivistProgress.messageTimer = 1.8;
  const pushDirection = player.x + player.width / 2 >= sourceX ? 1 : -1;
  player.x = clamp(player.x + pushDirection * 72, 42, ARCHIVIST_CHAMBER.WIDTH - 72);
  audioManager.playSfx("stabilityHit", { volume: 0.65 });
  manuscriptProgress.glitchTimer = 0.45;

  if (archivistProgress.playerStability === 0) {
    archivistProgress.playerDefeated = true;
    archivistProgress.bossActive = false;
    archivistProgress.beamActive = false;
    audioManager.stopMusic({ fadeSeconds: 0.7 });
  }
  return true;
}

function defeatArchivist() {
  archivistProgress.bossHealth = 0;
  archivistProgress.bossActive = false;
  archivistProgress.bossDefeated = true;
  archivistProgress.bossInvulnerable = true;
  archivistProgress.beamActive = false;
  archivistProgress.defeatTimer = 6;
  archivistProgress.message = TEXT_CONTENT.boss.messages.cannotLeave;
  archivistProgress.messageTimer = 6;
  completeObjective("confrontArchivist");
  audioManager.stopMusic({ fadeSeconds: 1 });
  audioManager.playSfx("archivistDefeat", { volume: 0.7 });
  audioManager.playSfx("archiveShutdown", { volume: 0.64 });
}

function updateBossDefeatMenu() {
  if (
    input.wasPressed("ArrowUp") ||
    input.wasPressed("ArrowLeft") ||
    input.wasPressed("KeyA") ||
    input.wasPressed("ArrowDown") ||
    input.wasPressed("ArrowRight") ||
    input.wasPressed("KeyD")
  ) {
    archivistProgress.defeatMenuIndex = 1 - archivistProgress.defeatMenuIndex;
  }

  if (input.wasPressed("KeyE") || input.wasPressed("Enter")) {
    activateBossDefeatOption(archivistProgress.defeatMenuIndex);
  }

  if (mouse.justPressed) {
    for (let index = 0; index < 2; index += 1) {
      if (isPointInRect(mouse.x, mouse.y, getBossDefeatButtonRect(index))) {
        activateBossDefeatOption(index);
      }
    }
  }
}

function activateBossDefeatOption(index) {
  if (index === 0) {
    resetArchivistCombat();
    setCurrentObjective("confrontArchivist");
    audioManager.playMusic("distortedPulse", { fadeSeconds: 0.8, volume: 0.3 });
    return;
  }

  startSceneTransition(GAME_STATES.TITLE, {
    spawnX: PLAYER_CONFIG.SPAWN_X,
    facing: 1,
    duration: 0.9,
    doorSfx: null,
  });
}

function getBossDefeatButtonRect(index) {
  return { x: 220, y: 224 + index * 38, width: 200, height: 30 };
}

function updatePlayer(target, deltaSeconds) {
  if (isMovementPaused()) {
    target.velocityX = 0;
    target.isWalking = false;
    target.isInteracting = false;
    updatePlayerAnimation(target, deltaSeconds);
    return;
  }

  const movementInput = getHorizontalInput();
  const speedScale =
    gameState.current === GAME_STATES.DISTORTED && realityProgress.silhouetteActive
      ? 0.46
      : gameState.current === GAME_STATES.ESCAPE && escapeProgress.cameraChoice === "drop"
        ? 1.18
        : 1;
  const targetVelocityX = movementInput * PLAYER_CONFIG.SPEED * speedScale;

  if (movementInput !== 0) {
    target.facing = movementInput;
  }

  const rate =
    movementInput === 0 ? PLAYER_CONFIG.DECELERATION : PLAYER_CONFIG.ACCELERATION;

  target.velocityX = moveToward(
    target.velocityX,
    targetVelocityX,
    rate * deltaSeconds,
  );

  target.x += target.velocityX * deltaSeconds;
  const world = getCurrentWorld();

  target.x = clamp(
    target.x,
    world.PLAYER_LEFT_BOUNDARY,
    world.PLAYER_RIGHT_BOUNDARY - target.width,
  );

  target.isWalking = Math.abs(target.velocityX) > 2;
  target.isInteracting = input.isPressed("KeyE");
  updatePlayerAnimation(target, deltaSeconds);
}

function getHorizontalInput() {
  const movingLeft = input.isPressed("KeyA") || input.isPressed("ArrowLeft");
  const movingRight = input.isPressed("KeyD") || input.isPressed("ArrowRight");

  return Number(movingRight) - Number(movingLeft);
}

function isMovementPaused() {
  return (
    isInterfaceScreenState() ||
    presentationState.cardTimer > 0 ||
    presentationState.explanationPaused ||
    dialogueState.active ||
    journalState.open ||
    keypadState.active ||
    inspectOverlayState.active ||
    recordsProgress.activeCaseId !== null ||
    controlsState.open ||
    gameState.current === GAME_STATES.MANUSCRIPT ||
    gameState.current === GAME_STATES.RING ||
    (gameState.current === GAME_STATES.PROLOGUE && !prologueProgress.controlGranted) ||
    (gameState.current === GAME_STATES.ESCAPE && escapeProgress.protagonistEscaped) ||
    escapeProgress.cameraChoiceActive ||
    archivistProgress.playerDefeated ||
    archiveProgress.ladderSequenceActive ||
    archiveProgress.ladderPushActive ||
    circuitPuzzleState.active ||
    archivistProgress.gameEnding ||
    transitionState.active
  );
}

function shouldShowInteractionPrompt() {
  return (
    (gameState.current === GAME_STATES.CORRIDOR ||
      gameState.current === GAME_STATES.ARCHIVE ||
      gameState.current === GAME_STATES.RECORDS ||
      gameState.current === GAME_STATES.DISTORTED ||
      gameState.current === GAME_STATES.CLASSROOM ||
      gameState.current === GAME_STATES.ARCHIVIST) &&
    !dialogueState.active &&
    !journalState.open &&
    !keypadState.active &&
    !inspectOverlayState.active &&
    recordsProgress.activeCaseId === null &&
    !controlsState.open &&
    presentationState.cardTimer <= 0 &&
    !presentationState.explanationPaused &&
    !circuitPuzzleState.active &&
    !archiveProgress.ladderSequenceActive &&
    !archiveProgress.ladderPushActive &&
    !archivistProgress.gameEnding &&
    !archivistProgress.playerDefeated &&
    !transitionState.active
  );
}

function getNearestValidInteractable() {
  const playerCenterX = player.x + player.width / 2;
  let nearest = null;
  let nearestDistance = Infinity;

  INTERACTABLE_DEFINITIONS.forEach((definition) => {
    const scene = definition.scene ?? GAME_STATES.CORRIDOR;

    if (scene !== gameState.current) {
      return;
    }

    if (!isInteractableAvailable(definition)) {
      return;
    }

    const centerX = getInteractableCenterX(definition);
    const distance = Math.abs(playerCenterX - centerX);

    if (distance <= definition.range && distance < nearestDistance) {
      nearest = definition;
      nearestDistance = distance;
    }
  });

  return nearest;
}

function isInteractableAvailable(definition) {
  if (typeof definition.isAvailable === "function") {
    return definition.isAvailable();
  }

  return true;
}

function getInteractableX(definition) {
  if (typeof definition.getX === "function") {
    return definition.getX(definition);
  }

  return definition.x;
}

function getInteractableCenterX(definition) {
  return getInteractableX(definition) + definition.width / 2;
}

function getInteractablePrompt(definition) {
  if (!definition) {
    return "";
  }

  if (typeof definition.getPrompt === "function") {
    return definition.getPrompt(definition);
  }

  return definition.prompt ?? "Interact";
}

function getInteractableById(id) {
  return INTERACTABLE_DEFINITIONS.find((definition) => definition.id === id) ?? null;
}

function interactWith(definition) {
  if (!definition || !isInteractableAvailable(definition)) {
    return false;
  }

  if (definition.requiresFlashlight && !getActiveVisualScene().flashlightOn) {
    const darknessLines = TEXT_CONTENT.notifications.darknessLines;
    realityProgress.message =
      darknessLines[realityProgress.darkAttemptIndex % darknessLines.length];
    realityProgress.darkAttemptIndex += 1;
    realityProgress.messageTimer = 2;
    return false;
  }

  if (typeof definition.onInteract === "function") {
    definition.onInteract(definition);
    return true;
  }

  handleGenericDialogueInteract(definition);
  return true;
}

function handleDirectoryInteract(definition) {
  chapterProgress.directoryRead = true;
  collectClue(definition.clueId);
  startDialogue(definition.dialogueId);
  if (!chapterProgress.archiveDoorChecked) {
    setCurrentObjective("checkDoor");
  }
}

function handleSecurityMemoInteract(definition) {
  chapterProgress.securityMemoRead = true;
  collectClue(definition.clueId, { soundVolume: 0.1 });
  startDialogue(definition.dialogueId);
  if (chapterProgress.powerReset && hasRequiredNormalInvestigation()) {
    setCurrentObjective("enterCode");
  } else if (chapterProgress.lockPanelInspected) {
    setCurrentObjective("restorePower");
  }
}

function handleMaintenanceNoticeInteract(definition) {
  chapterProgress.maintenanceNoticeRead = true;
  collectClue(definition.clueId);
  startDialogue(definition.dialogueId);
  if (!chapterProgress.maintenanceKeyCollected) {
    setCurrentObjective("findKey");
  } else if (!chapterProgress.powerReset) {
    setCurrentObjective("resetPower");
  }
}

function handleMaintenanceKeyInteract(definition) {
  chapterProgress.maintenanceKeyCollected = true;
  collectClue(definition.clueId);
  startDialogue(definition.dialogueId);
  if (chapterProgress.maintenanceNoticeRead && chapterProgress.lockPanelInspected) {
    setCurrentObjective("resetPower");
  } else if (!chapterProgress.maintenanceNoticeRead) {
    setCurrentObjective("restorePower");
  }
}

function handleElectricalCabinetInteract() {
  if (!chapterProgress.maintenanceKeyCollected) {
    startDialogue("cabinetLocked");
    setCurrentObjective("findKey");
    return;
  }

  if (!chapterProgress.maintenanceNoticeRead) {
    startDialogue("cabinetNeedsNotice");
    setCurrentObjective("restorePower");
    return;
  }

  if (!chapterProgress.lockPanelInspected) {
    startDialogue("cabinetNeedsPanel");
    setCurrentObjective("inspectLock");
    return;
  }

  if (chapterProgress.circuitPuzzleSolved) {
    setCurrentObjective(getNextCodeObjectiveId());
    startDialogue("powerReset");
    return;
  }

  chapterProgress.electricalCabinetOpen = true;
  collectClue("circuitRoutingNote");
  circuitPuzzleState.active = true;
  circuitPuzzleState.sequence = [];
  circuitPuzzleState.message = TEXT_CONTENT.corridor.breaker.initialMessage;
  circuitPuzzleState.messageTimer = 3;
  setCurrentObjective("resetPower");
}

function updateCircuitPuzzle(deltaSeconds) {
  if (!circuitPuzzleState.active) {
    return;
  }

  circuitPuzzleState.messageTimer = Math.max(0, circuitPuzzleState.messageTimer - deltaSeconds);
  circuitPuzzleState.flickerTimer = Math.max(0, circuitPuzzleState.flickerTimer - deltaSeconds);

  if (chapterProgress.circuitPuzzleSolved && circuitPuzzleState.messageTimer === 0) {
    circuitPuzzleState.active = false;
    return;
  }

  if (input.wasPressed("Escape")) {
    circuitPuzzleState.active = false;
    return;
  }

  for (let index = 0; index < CIRCUIT_SEQUENCE.length; index += 1) {
    if (isMouseClickInRect(getCircuitSwitchRect(index))) {
      activateCircuitSwitch(CIRCUIT_SEQUENCE[index]);
      return;
    }
  }
}

function activateCircuitSwitch(switchId) {
  if (circuitPuzzleState.sequence.includes(switchId)) {
    return;
  }

  const expected = CIRCUIT_SEQUENCE[circuitPuzzleState.sequence.length];
  audioManager.playSfx("circuitSwitch", { volume: 0.56 });

  if (switchId !== expected) {
    chapterProgress.circuitAttempts += 1;
    circuitPuzzleState.sequence = [];
    circuitPuzzleState.flickerTimer = 0.7;
    circuitPuzzleState.message =
      chapterProgress.circuitAttempts >= 3
        ? TEXT_CONTENT.corridor.breaker.indicatorMessage
        : TEXT_CONTENT.corridor.breaker.rejectionMessage;
    circuitPuzzleState.messageTimer = 2.5;
    audioManager.playSfx("circuitWrong", { volume: 0.62 });
    audioManager.playSfx("lightFlicker", { volume: 0.42 });
    return;
  }

  circuitPuzzleState.sequence.push(switchId);
  circuitPuzzleState.message = formatText(TEXT_CONTENT.corridor.breaker.progressTemplate, {
    count: circuitPuzzleState.sequence.length,
  });
  circuitPuzzleState.messageTimer = 1.4;

  if (circuitPuzzleState.sequence.length !== CIRCUIT_SEQUENCE.length) {
    return;
  }

  chapterProgress.circuitPuzzleSolved = true;
  chapterProgress.powerReset = true;
  collectClue("powerReset");
  completeObjective("resetPower");
  setCurrentObjective(getNextCodeObjectiveId());
  circuitPuzzleState.message = TEXT_CONTENT.corridor.breaker.restoredMessage;
  circuitPuzzleState.messageTimer = 3;
  audioManager.playSfx("powerReturn", { volume: 0.72 });
}

function getCircuitSwitchRect(index) {
  return { x: 122 + index * 104, y: 142, width: 82, height: 86 };
}

function handleLockPanelInteract() {
  if (!chapterProgress.powerReset) {
    chapterProgress.lockPanelInspected = true;
    collectClue("lockPanel");
    startDialogue("lockPanelDead");
    if (!chapterProgress.maintenanceNoticeRead) {
      setCurrentObjective("restorePower");
    } else if (!chapterProgress.maintenanceKeyCollected) {
      setCurrentObjective("findKey");
    } else {
      setCurrentObjective("resetPower");
    }
    return;
  }

  if (!TRAILER_MODE && !hasRequiredNormalInvestigation()) {
    startDialogue("lockNeedsClues");
    setCurrentObjective(getNextCodeObjectiveId());
    return;
  }

  openKeypad();
}

function handleArchiveDoorInteract() {
  chapterProgress.archiveDoorChecked = true;

  if (chapterProgress.archiveDoorUnlocked) {
    chapterProgress.archiveDoorRevealed = true;
    completeObjective("findArchive");
    setCurrentObjective("enterArchive");
    startSceneTransition(GAME_STATES.ARCHIVE, {
      spawnX: ARCHIVE_WORLD.ENTRANCE_X,
      facing: 1,
      duration: 0.85,
    });
    return;
  }

  audioManager.playSfx("lockedDoor");
  if (chapterProgress.powerReset) {
    startDialogue("doorPoweredLocked");
    setCurrentObjective(getNextCodeObjectiveId());
    return;
  }

  startDialogue("doorLocked");
  if (!chapterProgress.lockPanelInspected) {
    setCurrentObjective("inspectLock");
  }
}

function handleArchiveExitInteract() {
  if (manuscriptProgress.realityChanged) {
    if (!realityProgress.archiveExitLooped) {
      loopChangedArchiveExit();
      return;
    }

    if (realityProgress.discoveredSymbols.size < REALITY_CHANGE_SYMBOLS.length) {
      realityProgress.message = TEXT_CONTENT.distortedArchive.messages.exitSignPointsAway;
      realityProgress.messageTimer = 3;
      setCurrentObjective("noticeArchiveChanges");
      audioManager.playSfx("corridorLoop", { volume: 0.48 });
      player.x = ARCHIVE_WORLD.ENTRANCE_X + 18;
      clampCameraToCurrentWorld(camera, player);
      return;
    }

    startSceneTransition(GAME_STATES.DISTORTED, {
      spawnX: DISTORTED_CORRIDOR.START_X,
      facing: -1,
      duration: getTrailerAdjustedDuration(0.76),
      doorSfx: null,
    });
    return;
  }

  if (archiveProgress.manuscriptSequenceStarted) {
    startDialogue("archiveExitBlockedLater");
    return;
  }

  startSceneTransition(GAME_STATES.CORRIDOR, {
    spawnX: CORRIDOR.DOOR_X - 118,
    facing: -1,
    duration: 0.72,
  });
}

function handleMissingPersonsWingDoor() {
  startSceneTransition(GAME_STATES.RECORDS, {
    spawnX: RECORDS_WORLD.ENTRANCE_X + 54,
    facing: 1,
    duration: 0.72,
    doorSfx: "archiveDoorOpen",
  });
}

function enterUncataloguedClassroom() {
  classroomProgress.returnX = player.x;
  startSceneTransition(GAME_STATES.CLASSROOM, {
    spawnX: CLASSROOM_WORLD.ENTRANCE_X + 56,
    facing: 1,
    duration: 0.72,
    doorSfx: "falseDoor",
  });
}

function leaveMissingPersonsWing() {
  startSceneTransition(GAME_STATES.ARCHIVE, {
    spawnX: 1690,
    facing: -1,
    duration: 0.72,
    doorSfx: "archiveDoorOpen",
  });
}

function leaveUncataloguedClassroom() {
  startSceneTransition(GAME_STATES.DISTORTED, {
    spawnX: classroomProgress.returnX,
    facing: -1,
    duration: 0.72,
    doorSfx: "falseDoor",
  });
}

function getMissingPersonCase(caseId) {
  return MISSING_PERSON_CASES.find((caseData) => caseData.id === caseId) ?? null;
}

function openMissingPersonCase(caseId) {
  const caseData = getMissingPersonCase(caseId);
  if (!caseData) {
    return;
  }

  if (recordsProgress.solvedCases.has(caseId)) {
    const clue = getJournalClue(caseData.clueId);
    showInspectOverlay(clue.title, clue.text, caseData.clueId);
    return;
  }

  recordsProgress.activeCaseId = caseId;
  recordsProgress.selectedRecordIndex = 0;
  recordsProgress.errorTimer = 0;
}

function submitMissingPersonContradiction(caseData) {
  if (recordsProgress.selectedRecordIndex !== caseData.correctIndex) {
    recordsProgress.errorTimer = 0.48;
    recordsProgress.message = TEXT_CONTENT.recordsWing.messages.selectedCanCoexist;
    recordsProgress.messageTimer = 2;
    audioManager.playSfx("recordContradiction", { volume: 0.7 });
    return;
  }

  recordsProgress.solvedCases.add(caseData.id);
  recordsProgress.photographedCases.add(caseData.id);
  recordsProgress.activeCaseId = null;
  collectClue(caseData.clueId);
  if (caseData.id === "jonah") {
    collectClue("jonahAlignmentLog");
  }
  audioManager.playSfx("cameraShutter", { volume: 0.68 });
  recordsProgress.message = formatText(TEXT_CONTENT.recordsWing.messages.contradictionPreserved, {
    name: caseData.name,
  });
  recordsProgress.messageTimer = 2.4;
  realityProgress.message = recordsProgress.message;
  realityProgress.messageTimer = 2.4;

  if (recordsProgress.solvedCases.size === MISSING_PERSON_CASES.length) {
    recordsProgress.completed = true;
    completeObjective("investigateMissingPersons");
    setCurrentObjective("returnFromRecordsWing");
  }

  if (caseData.id === "jonah") {
    showInspectOverlay(
      TEXT_CONTENT.distortedArchive.overlays.jonahEmergencyTitle,
      TEXT_CONTENT.distortedArchive.overlays.jonahEmergencyText,
      null,
    );
  }
}

function inspectClassroomRegister() {
  classroomProgress.registerInspected = true;
  const names = [...TEXT_CONTENT.distortedArchive.classroom.caseNames];
  if (classroomProgress.occupants >= 4) {
    names.push(TEXT_CONTENT.distortedArchive.classroom.explorerName);
  }
  showInspectOverlay(
    formatText(TEXT_CONTENT.distortedArchive.classroom.attendanceTitleTemplate, {
      year: 2079 + classroomProgress.occupants * 2,
    }),
    formatText(TEXT_CONTENT.distortedArchive.classroom.attendanceLineTemplate, {
      names: names.join(" / "),
      suffix: classroomProgress.occupants < 4
        ? TEXT_CONTENT.distortedArchive.classroom.blankLineSuffix
        : TEXT_CONTENT.distortedArchive.classroom.presentSuffix,
    }),
    classroomProgress.completed ? "uncataloguedAttendance" : null,
  );
}

function loopChangedArchiveExit() {
  realityProgress.archiveExitLooped = true;
  realityProgress.message = TEXT_CONTENT.distortedArchive.messages.thresholdReturns;
  realityProgress.messageTimer = 4;
  player.x = ARCHIVE_WORLD.ENTRANCE_X + 22;
  player.velocityX = 0;
  clampCameraToCurrentWorld(camera, player);
  setCurrentObjective("noticeArchiveChanges");
  audioManager.playSfx("corridorLoop", { volume: 0.56 });
  audioManager.playSfx("electricalHum", { volume: 0.36 });
}

function handleTrailerArchiveRevealInteract() {
  if (!TRAILER_MODE) {
    return;
  }

  revealManuscriptTable({ trailer: true });
}

function handleArchiveIndexInteract(definition) {
  if (!recordsProgress.completed) {
    realityProgress.message = TEXT_CONTENT.archive.messages.quarantinedRecords;
    realityProgress.messageTimer = 3.4;
    setCurrentObjective("investigateMissingPersons");
    audioManager.playSfx("lockedDoor", { volume: 0.42 });
    return;
  }

  archiveProgress.indexRead = true;
  collectClue(definition.clueId);
  audioManager.playSfx("paperMove", { volume: 0.48 });
  startDialogue(definition.dialogueId);

  if (!hasSearchedAllArchiveShelves()) {
    setCurrentObjective("searchMarkedShelves");
  }
}

function handleArchiveShelfInteract(definition) {
  const search = ARCHIVE_SHELF_SEARCHES[definition.shelfSearchId];

  if (!archiveProgress.indexRead) {
    startDialogue("shelfBeforeIndex");
    setCurrentObjective("locateRestricted");
    return;
  }

  if (archiveProgress.searchedShelves.has(search.shelfId)) {
    startDialogue("shelfAlreadySearched");
    return;
  }

  archiveProgress.searchedShelves.add(search.shelfId);
  collectClue(search.clueId);
  audioManager.playSfx("shelfCreak", { volume: 0.44 });
  audioManager.playSfx("paperMove", { volume: 0.5 });

  if (search.useful && !archiveProgress.firstUsefulRecordFound) {
    archiveProgress.firstUsefulRecordFound = true;
    setArchiveMusicPhase("pulse");
  }

  showInspectOverlay(search.title, search.text, search.clueId);

  if (hasSearchedAllArchiveShelves()) {
    completeObjective("searchMarkedShelves");
    setCurrentObjective("findShelfCoordinate");
  } else {
    setCurrentObjective("searchMarkedShelves");
  }
}

function handleCoordinateFolderInteract() {
  if (!hasSearchedAllArchiveShelves()) {
    startDialogue("coordinateFolderLocked");
    setCurrentObjective("searchMarkedShelves");
    return;
  }

  archiveProgress.coordinateFound = true;
  collectClue("handwrittenCoordinate");
  audioManager.playSfx("paperMove", { volume: 0.52 });
  startDialogue("coordinateFolder");
  completeObjective("findShelfCoordinate");
  setCurrentObjective("moveArchiveLadder");
}

function handleArchiveLadderInteract() {
  if (!archiveProgress.coordinateFound) {
    startDialogue("ladderNeedsCoordinate");
    setCurrentObjective("findShelfCoordinate");
    return;
  }

  if (archiveProgress.ladderLockedAtC13) {
    handleArchiveHighShelfInteract();
    return;
  }

  archiveProgress.ladderPushActive = true;
  player.x = archiveProgress.ladderX - 24;
  player.velocityX = 0;
  audioManager.playSfx("ladderWheel", { volume: 0.54 });
}

function handleArchiveHighShelfInteract() {
  if (archiveProgress.sealedStorageKeyCollected) {
    realityProgress.message = TEXT_CONTENT.archive.messages.boxAlreadyEmpty;
    realityProgress.messageTimer = 1.8;
    return;
  }

  if (!archiveProgress.ladderLockedAtC13) {
    startDialogue("highShelfNeedsLadder");
    setCurrentObjective("moveArchiveLadder");
    return;
  }

  if (archiveProgress.ladderSequenceActive) {
    return;
  }

  archiveProgress.ladderSequenceActive = true;
  archiveProgress.ladderSequenceTimer = 0;
  archiveProgress.ladderClimbPhase = 0;
  player.x = archiveProgress.ladderX + 10;
  player.velocityX = 0;
  player.facing = 1;
  audioManager.playSfx("ladderClimb", { volume: 0.58 });
}

function updateLadderSequence(deltaSeconds) {
  if (archiveProgress.ladderPushActive) {
    if (!input.isPressed("KeyE") || gameState.current !== GAME_STATES.ARCHIVE) {
      archiveProgress.ladderPushActive = false;
      return;
    }

    const totalDistance = ARCHIVE_ROOM.LADDER_TARGET_X - ARCHIVE_ROOM.LADDER_START_X;
    const movement = (totalDistance / 4.6) * deltaSeconds;
    archiveProgress.ladderX = Math.min(
      ARCHIVE_ROOM.LADDER_TARGET_X,
      archiveProgress.ladderX + movement,
    );
    archiveProgress.ladderPosition = archiveProgress.ladderX;
    player.x = archiveProgress.ladderX - 24;
    player.animationMode = "interact";

    if (archiveProgress.ladderX < ARCHIVE_ROOM.LADDER_TARGET_X) {
      return;
    }

    archiveProgress.ladderPushActive = false;
    archiveProgress.ladderMoved = true;
    archiveProgress.ladderLockedAtC13 = true;
    audioManager.playSfx("ladderLock", { volume: 0.68 });
    startDialogue("ladderMoved");
    completeObjective("moveArchiveLadder");
    setCurrentObjective("retrieveStorageKey");
    return;
  }

  if (!archiveProgress.ladderSequenceActive) {
    return;
  }

  archiveProgress.ladderSequenceTimer += deltaSeconds;
  const time = archiveProgress.ladderSequenceTimer;
  const climbHeight = time < 1
    ? 0
    : time < 2.4
      ? (time - 1) / 1.4
      : time < 3.5
        ? 1
        : time < 4.9
          ? 1 - (time - 3.5) / 1.4
          : 0;
  archiveProgress.ladderClimbPhase = Math.min(6, Math.floor(time / 0.72));
  player.x = archiveProgress.ladderX + 10 + (time >= 2.4 && time < 3.5 ? 8 : 0);
  player.y = PLAYER_CONFIG.SPAWN_Y - Math.round(clamp(climbHeight, 0, 1) * 112);
  player.animationMode = climbHeight > 0 ? "interact" : "idle";

  if (time < 5.1) {
    return;
  }

  archiveProgress.ladderSequenceActive = false;
  player.y = PLAYER_CONFIG.SPAWN_Y;
  archiveProgress.sealedStorageKeyCollected = true;
  collectClue("sealedStorageKey");
  audioManager.playSfx("paperMove", { volume: 0.5 });
  startDialogue("sealedKeyFound");
  completeObjective("retrieveStorageKey");
  setCurrentObjective("openArchiveCabinet");
}

function handleArchiveFilingCabinetInteract() {
  if (!archiveProgress.sealedStorageKeyCollected) {
    audioManager.playSfx("filingCabinetLock", { volume: 0.7 });
    startDialogue("filingCabinetLocked");
    setCurrentObjective("retrieveStorageKey");
    return;
  }

  if (archiveProgress.filingCabinetUnlocked) {
    showInspectOverlay(
      TEXT_CONTENT.archive.messages.cabinetR6Title,
      TEXT_CONTENT.archive.messages.cabinetR6Open,
    );
    return;
  }

  archiveProgress.filingCabinetUnlocked = true;
  archiveProgress.photographFound = true;
  archiveProgress.accessCardFound = true;
  archiveProgress.removedPageNoteFound = true;
  collectClue("cabinetPhotograph");
  collectClue("archiveAccessCard");
  collectClue("removedPageNote");
  audioManager.playSfx("drawerOpen", { volume: 0.58 });
  setArchiveMusicPhase("tension");
  startDialogue("filingCabinetOpened");
  completeObjective("openArchiveCabinet");
  setCurrentObjective("useArchiveAccessCard");
}

function handleArchiveRestrictedCabinetInteract() {
  if (!archiveProgress.accessCardFound) {
    startDialogue("restrictedGateLocked");
    setCurrentObjective("openArchiveCabinet");
    return;
  }

  revealManuscriptTable();
}

function handleManuscriptTableInteract(definition) {
  if (manuscriptProgress.solved) {
    startDialogue(definition.dialogueId);
    return;
  }

  startSceneTransition(GAME_STATES.MANUSCRIPT, {
    spawnX: player.x,
    facing: player.facing,
    duration: getTrailerAdjustedDuration(0.7),
    doorSfx: "bookOpen",
  });
}

function handleChangedArchiveDetailInteract(definition) {
  if (!realityProgress.archiveExitLooped) {
    realityProgress.message = TEXT_CONTENT.distortedArchive.messages.looksAlmostNormal;
    realityProgress.messageTimer = 2.6;
    return;
  }

  discoverRealitySymbol(definition.realityDetailId);
}

function handleOptionalArchiveChangeInteract(definition) {
  realityProgress.optionalInspections.add(definition.optionalDetailId);
  audioManager.playSfx("paperMove", { volume: 0.36 });

  if (definition.optionalDetailId === "wrongExitSign") {
    showInspectOverlay(
      TEXT_CONTENT.distortedArchive.optionalDetails.wrongExitSignTitle,
      TEXT_CONTENT.distortedArchive.optionalDetails.wrongExitSignText,
    );
    return;
  }

  showInspectOverlay(
    TEXT_CONTENT.distortedArchive.optionalDetails.extraDoorTitle,
    TEXT_CONTENT.distortedArchive.optionalDetails.extraDoorText,
  );
}

function discoverRealitySymbol(detailId, options = {}) {
  const detail = REALITY_CHANGE_SYMBOLS.find((entry) => entry.id === detailId);

  if (!detail) {
    return false;
  }

  realityProgress.changedDetails.add(detailId);
  realityProgress.discoveredSymbols.add(detail.symbolId);
  collectClue(detail.clueId, { silent: options.silent });
  updateDistortedMusicIntensity();

  if (!options.silent) {
    audioManager.playSfx("symbolTone", { volume: 0.48 });
    showInspectOverlay(
      CLUE_DATA[detail.clueId].title,
      CLUE_DATA[detail.clueId].text,
      detail.clueId,
    );
  }

  if (realityProgress.discoveredSymbols.size >= REALITY_CHANGE_SYMBOLS.length) {
    completeObjective("noticeArchiveChanges");
    setCurrentObjective("chooseRealDoor");
  } else if (!options.silent) {
    setCurrentObjective("noticeArchiveChanges");
  }

  return true;
}

function handleDistortedExitLoopInteract() {
  realityProgress.archiveExitLooped = true;
  realityProgress.message = TEXT_CONTENT.distortedArchive.messages.exitSameCorridor;
  realityProgress.messageTimer = 3.4;
  player.x = DISTORTED_CORRIDOR.RETURN_X;
  player.velocityX = 0;
  realityProgress.loopDetailVariant += 1;
  audioManager.playSfx("corridorLoop", { volume: 0.58 });
  setCurrentObjective(
    realityProgress.discoveredSymbols.size >= REALITY_CHANGE_SYMBOLS.length
      ? "chooseRealDoor"
      : "noticeArchiveChanges",
  );
  clampCameraToCurrentWorld(camera, player);
}

function handleDistortedDoorInteract(definition) {
  if (realityProgress.discoveredSymbols.size < REALITY_CHANGE_SYMBOLS.length) {
    realityProgress.message = TEXT_CONTENT.distortedArchive.messages.duplicateDoorsHint;
    realityProgress.messageTimer = 3.2;
    setCurrentObjective("noticeArchiveChanges");
    return;
  }

  if (definition.doorId !== "realDoor") {
    handleFalseDistortedDoor(definition.doorId);
    return;
  }

  realityProgress.correctDoorChosen = true;
  realityProgress.sealedSectionReached = true;
  completeObjective("chooseRealDoor");
  setCurrentObjective("activateWallSwitches");
  player.x = DISTORTED_CORRIDOR.SEALED_SECTION_X;
  player.velocityX = 0;
  clampCameraToCurrentWorld(camera, player);
  audioManager.playSfx("archiveDoorOpen", { volume: 0.46 });
  triggerSilhouetteEvent();
}

function handleFalseDistortedDoor(doorId) {
  realityProgress.falseDoorLoops += 1;
  realityProgress.loopDetailVariant = (realityProgress.loopDetailVariant + 1) % 4;
  realityProgress.message = TEXT_CONTENT.distortedArchive.messages.falseDoor;
  realityProgress.messageTimer = 3.2;
  collectClue("wrongDuplicateDoor", { silent: realityProgress.falseDoorLoops > 1 });
  player.x = DISTORTED_CORRIDOR.RETURN_X + realityProgress.falseDoorLoops * 12;
  player.velocityX = 0;
  realityProgress.lightShutdownCount = Math.min(
    DISTORTED_CORRIDOR.LIGHTS.length,
    realityProgress.lightShutdownCount + 1,
  );
  audioManager.playSfx(doorId === "trailer" ? "glitchBurst" : "falseDoor", { volume: 0.58 });
  audioManager.playSfx("corridorLoop", { volume: 0.5 });
  clampCameraToCurrentWorld(camera, player);
}

function handleDistortedWallSwitchInteract(definition) {
  if (!realityProgress.correctDoorChosen || realityProgress.passageOpen) {
    return;
  }

  const expected = DISTORTED_CORRIDOR.SWITCH_ORDER[realityProgress.switchSequence.length];

  if (definition.switchId !== expected) {
    realityProgress.switchSequence = [];
    realityProgress.message = TEXT_CONTENT.distortedArchive.messages.switchOrderReset;
    realityProgress.messageTimer = 3.2;
    audioManager.playSfx("incorrectPuzzle", { volume: 0.58 });
    return;
  }

  realityProgress.switchSequence.push(definition.switchId);
  audioManager.playSfx("wallSwitch", { volume: 0.56 });

  if (realityProgress.switchSequence.length < DISTORTED_CORRIDOR.SWITCH_ORDER.length) {
    realityProgress.message = formatText(TEXT_CONTENT.distortedArchive.messages.switchProgressTemplate, {
      count: realityProgress.switchSequence.length,
    });
    realityProgress.messageTimer = 1.8;
    return;
  }

  openFinalPassage();
}

function openFinalPassage() {
  if (realityProgress.passageOpen) {
    return;
  }

  realityProgress.passageOpen = true;
  completeObjective("activateWallSwitches");
  collectClue("sealedRecordsOpened");
  audioManager.playSfx("passageOpenBass", { volume: 0.74 });
  revealMissingPage();
}

function revealMissingPage() {
  if (realityProgress.finalPageVisible) {
    return;
  }

  realityProgress.finalPageVisible = true;
  collectClue("missingPageVisible");
  setCurrentObjective("reachMissingPage");
  audioManager.playSfx("finalPageReveal", { volume: 0.62 });
}

function handleMissingPageInteract() {
  if (!realityProgress.finalPageVisible || realityProgress.finalPageCollected) {
    return;
  }

  realityProgress.finalPageCollected = true;
  endingState.pendingAfterInspect = true;
  completeObjective("reachMissingPage");
  completeObjective("findMissingPage");
  showInspectOverlay(
    TEXT_CONTENT.distortedArchive.finalPage.title,
    TEXT_CONTENT.distortedArchive.finalPage.text,
    "missingPageVisible",
  );
}

function triggerSilhouetteEvent(options = {}) {
  if (realityProgress.silhouetteTriggered && !options.force) {
    return;
  }

  realityProgress.silhouetteTriggered = true;
  realityProgress.silhouetteActive = true;
  realityProgress.silhouetteTimer = getTrailerAdjustedDuration(2.8);
  realityProgress.lightShutdownCount = Math.max(realityProgress.lightShutdownCount, 2);
  audioManager.stopAmbience({ fadeSeconds: 0.04 });
  audioManager.stopMusic({ fadeSeconds: 0.04 });
  audioManager.playSfx("silenceBeforeRealityChange", { volume: 0.52 });
}

function updateDistortedMusicIntensity() {
  const nextIntensity = realityProgress.discoveredSymbols.size;

  if (realityProgress.musicIntensity === nextIntensity) {
    return;
  }

  realityProgress.musicIntensity = nextIntensity;

  if (gameState.current === GAME_STATES.DISTORTED || manuscriptProgress.realityChanged) {
    audioManager.playMusic("distortedPulse", {
      fadeSeconds: 1.5,
      volume: getDistortedMusicVolume(),
    });
  }
}

function getDistortedMusicVolume() {
  return clamp(0.12 + realityProgress.musicIntensity * 0.055, 0.12, 0.34);
}

function revealManuscriptTable(options = {}) {
  if (archiveProgress.manuscriptTableRevealed) {
    startDialogue(options.trailer ? "trailerArchiveReveal" : "manuscriptTable");
    return;
  }

  archiveProgress.restrictedGateOpened = true;
  archiveProgress.manuscriptTableRevealed = true;
  collectClue("manuscriptTableReveal");
  completeObjective("locateRestricted");
  completeObjective("useArchiveAccessCard");
  setCurrentObjective("revealManuscriptTable");
  completeObjective("revealManuscriptTable");
  setCurrentObjective("inspectManuscript");
  audioManager.playSfx("accessCardBeep", { volume: 0.62 });
  audioManager.playSfx("manuscriptLightActivation", { volume: 0.68 });
  audioManager.stopMusic({ fadeSeconds: 1.2 });
  startDialogue(options.trailer ? "trailerArchiveReveal" : "manuscriptReveal");
}

function handleGenericDialogueInteract(definition) {
  if (definition.clueId) {
    collectClue(definition.clueId);
  }

  startDialogue(definition.dialogueId);
}

function getArchiveDoorPrompt() {
  return chapterProgress.archiveDoorUnlocked
    ? TEXT_CONTENT.corridor.prompts.openArchiveDoor
    : TEXT_CONTENT.corridor.prompts.inspectArchiveDoor;
}

function getArchiveExitPrompt() {
  if (!manuscriptProgress.realityChanged) {
    return TEXT_CONTENT.archive.prompts.returnToCorridor;
  }

  if (!realityProgress.archiveExitLooped) {
    return TEXT_CONTENT.archive.prompts.tryArchiveExit;
  }

  if (realityProgress.discoveredSymbols.size < REALITY_CHANGE_SYMBOLS.length) {
    return TEXT_CONTENT.archive.prompts.testWrongExit;
  }

  return TEXT_CONTENT.archive.prompts.enterDistortedCorridor;
}

function getCoordinateFolderPrompt() {
  return hasSearchedAllArchiveShelves()
    ? TEXT_CONTENT.archive.prompts.searchLooseFolder
    : TEXT_CONTENT.archive.prompts.inspectLooseFolder;
}

function getArchiveLadderPrompt() {
  if (archiveProgress.ladderLockedAtC13) {
    return TEXT_CONTENT.archive.prompts.climbLadderAtC13;
  }

  if (!archiveProgress.coordinateFound) {
    return TEXT_CONTENT.archive.prompts.findCoordinateBeforeLadder;
  }

  const progress = Math.round(
    ((archiveProgress.ladderX - ARCHIVE_ROOM.LADDER_START_X) /
      (ARCHIVE_ROOM.LADDER_TARGET_X - ARCHIVE_ROOM.LADDER_START_X)) *
      100,
  );
  return formatText(TEXT_CONTENT.archive.prompts.holdToPushLadder, { progress });
}

function getArchiveHighShelfPrompt() {
  return archiveProgress.ladderLockedAtC13
    ? TEXT_CONTENT.archive.prompts.climbToShelfC13
    : TEXT_CONTENT.archive.prompts.inspectShelfC13;
}

function getArchiveFilingCabinetPrompt() {
  if (archiveProgress.filingCabinetUnlocked) {
    return TEXT_CONTENT.archive.prompts.inspectOpenCabinet;
  }

  return archiveProgress.sealedStorageKeyCollected
    ? TEXT_CONTENT.archive.prompts.useSealedKey
    : TEXT_CONTENT.archive.prompts.inspectLockedCabinet;
}

function getArchiveRestrictedCabinetPrompt() {
  if (archiveProgress.manuscriptTableRevealed) {
    return TEXT_CONTENT.archive.prompts.inspectRestrictedCabinet;
  }

  return archiveProgress.accessCardFound
    ? TEXT_CONTENT.archive.prompts.useArchiveAccessCard
    : TEXT_CONTENT.archive.prompts.inspectRestrictedCabinet;
}

function getLockPanelPrompt() {
  return chapterProgress.powerReset
    ? TEXT_CONTENT.corridor.prompts.useArchiveKeypad
    : TEXT_CONTENT.corridor.prompts.inspectDeadKeypad;
}

function getElectricalCabinetPrompt() {
  if (chapterProgress.powerReset) {
    return TEXT_CONTENT.corridor.prompts.inspectElectricalCabinet;
  }

  if (chapterProgress.maintenanceKeyCollected) {
    return TEXT_CONTENT.corridor.prompts.useMaintenanceKey;
  }

  return TEXT_CONTENT.corridor.prompts.inspectElectricalCabinet;
}

function hasRequiredNormalInvestigation() {
  if (TRAILER_MODE) {
    return true;
  }

  return (
    chapterProgress.archiveDoorChecked &&
    chapterProgress.directoryRead &&
    chapterProgress.lockPanelInspected &&
    chapterProgress.maintenanceNoticeRead &&
    chapterProgress.securityMemoRead &&
    chapterProgress.maintenanceKeyCollected
  );
}

function getNextCodeObjectiveId() {
  if (!chapterProgress.archiveDoorChecked) {
    return "checkDoor";
  }

  if (!chapterProgress.powerReset) {
    return "resetPower";
  }

  if (!chapterProgress.securityMemoRead || !chapterProgress.directoryRead) {
    return "findCode";
  }

  return "enterCode";
}

function hasSearchedAllArchiveShelves() {
  return archiveProgress.searchedShelves.size >= Object.keys(ARCHIVE_SHELF_SEARCHES).length;
}

function setArchiveMusicPhase(phase) {
  if (archiveProgress.musicPhase === phase) {
    return;
  }

  archiveProgress.musicPhase = phase;

  if (phase === "pulse") {
    audioManager.playMusic("archivePulse", { fadeSeconds: 2.8, volume: 0.18 });
    return;
  }

  if (phase === "tension") {
    audioManager.playMusic("archiveTension", {
      fadeSeconds: 2.2,
      crossfadeSeconds: 1.6,
      volume: 0.3,
    });
  }
}

function showInspectOverlay(title, text, clueId = null) {
  inspectOverlayState.active = true;
  inspectOverlayState.title = title;
  inspectOverlayState.text = text;
  inspectOverlayState.clueId = clueId;
}

function closeInspectOverlay() {
  const shouldEnterRing =
    endingState.pendingAfterInspect &&
    gameState.current === GAME_STATES.DISTORTED &&
    realityProgress.finalPageCollected;

  inspectOverlayState.active = false;
  inspectOverlayState.title = "";
  inspectOverlayState.text = "";
  inspectOverlayState.clueId = null;

  if (shouldEnterRing && !transitionState.active) {
    endingState.pendingAfterInspect = false;
    startSceneTransition(GAME_STATES.RING, {
      spawnX: 96,
      facing: 1,
      duration: getTrailerAdjustedDuration(0.96),
      doorSfx: null,
    });
  }
}

function openKeypad() {
  keypadState.active = true;
  keypadState.enteredCode = "";
  keypadState.message = TEXT_CONTENT.corridor.keypad.enterFourDigits;
  keypadState.messageTimer = 2.5;
}

function closeKeypad() {
  keypadState.active = false;
  keypadState.enteredCode = "";
  keypadState.message = "";
  keypadState.messageTimer = 0;
}

function submitKeypadCode() {
  if (keypadState.enteredCode.length < 4) {
    keypadState.message = TEXT_CONTENT.corridor.keypad.fourDigitsRequired;
    keypadState.messageTimer = 2.2;
    audioManager.playSfx("wrongCode");
    return;
  }

  if (!TRAILER_MODE && !hasRequiredNormalInvestigation()) {
    keypadState.message = TEXT_CONTENT.corridor.keypad.missingContext;
    keypadState.messageTimer = 2.8;
    keypadState.enteredCode = "";
    audioManager.playSfx("wrongCode");
    return;
  }

  if (keypadState.enteredCode !== ARCHIVE_CODE) {
    keypadState.message = TEXT_CONTENT.corridor.keypad.incorrectCode;
    keypadState.messageTimer = 2.5;
    keypadState.enteredCode = "";
    audioManager.playSfx("wrongCode");
    return;
  }

  keypadState.message = TEXT_CONTENT.corridor.keypad.accepted;
  keypadState.messageTimer = 1;
  closeKeypad();
  unlockArchiveDoor();
}

function unlockArchiveDoor() {
  if (chapterProgress.archiveDoorUnlocked) {
    return;
  }

  chapterProgress.archiveDoorUnlocked = true;
  collectClue("archiveUnlocked");
  completeObjective("findArchive");
  setCurrentObjective("enterArchive");
  audioManager.playSfx("correctCode");
  audioManager.playSfx("archiveDoorUnlock");
  startDialogue("correctCode");
}

function getPressedDigit() {
  for (let digit = 0; digit <= 9; digit += 1) {
    if (input.wasPressed(`Digit${digit}`) || input.wasPressed(`Numpad${digit}`)) {
      return String(digit);
    }
  }

  return null;
}

function startDialogue(dialogueId, options = {}) {
  const dialogue = DIALOGUE_DATA[dialogueId];

  if (!dialogue) {
    throw new Error(`Unknown dialogue: ${dialogueId}`);
  }

  dialogueState.active = true;
  dialogueState.dialogueId = dialogueId;
  dialogueState.lines = dialogue.lines;
  dialogueState.lineIndex = 0;
  dialogueState.visibleCharacters = 0;
  dialogueState.lastTickCharacter = 0;
  dialogueState.typewriterSpeed = options.speed ?? settings.textSpeed;
  dialogueState.allowEscape = dialogue.allowEscape;
}

function getCurrentDialogueLine() {
  return dialogueState.lines[dialogueState.lineIndex];
}

function advanceDialogue() {
  const line = getCurrentDialogueLine();

  if (dialogueState.visibleCharacters < line.text.length) {
    dialogueState.visibleCharacters = line.text.length;
    return;
  }

  if (dialogueState.lineIndex < dialogueState.lines.length - 1) {
    dialogueState.lineIndex += 1;
    dialogueState.visibleCharacters = 0;
    dialogueState.lastTickCharacter = 0;
    return;
  }

  closeDialogue();
}

function closeDialogue() {
  dialogueState.active = false;
  dialogueState.dialogueId = null;
  dialogueState.lines = [];
  dialogueState.lineIndex = 0;
  dialogueState.visibleCharacters = 0;
  dialogueState.lastTickCharacter = 0;
}

function setJournalOpen(isOpen, options = {}) {
  if (journalState.open === isOpen) {
    return;
  }

  journalState.open = isOpen;
  clampJournalPage();

  if (!options.silent) {
    audioManager.playSfx(isOpen ? "journalOpen" : "journalClose");
  }
}

function getJournalPageCount() {
  return Math.max(1, Math.ceil(chapterProgress.clues.size / 2));
}

function clampJournalPage() {
  journalState.cluePage = clamp(journalState.cluePage, 0, getJournalPageCount() - 1);
}

function collectClue(clueId, options = {}) {
  if (!clueId || chapterProgress.clues.has(clueId)) {
    return;
  }

  chapterProgress.clues.add(clueId);
  clampJournalPage();

  if (!options.silent) {
    objectiveState.bannerText = formatText(TEXT_CONTENT.notifications.clueCollected, {
      title: CLUE_DATA[clueId].title,
    });
    objectiveState.bannerTimer = 4;
  }
}

function getJournalClue(clueId) {
  const clue = CLUE_DATA[clueId];
  const caseIdByClue = {
    maraVossCase: "mara",
    eliasWardCase: "elias",
    jonahValeCase: "jonah",
  };
  const caseId = caseIdByClue[clueId];

  if (!clue || !caseId || !recordsProgress.photographedCases.has(caseId)) {
    return clue;
  }
  if (!manuscriptProgress.realityChanged) {
    return clue;
  }
  if (clueId === "maraVossCase") {
    return {
      title: TEXT_CONTENT.journalClues.changedJournal.maraTitle,
      text: TEXT_CONTENT.journalClues.changedJournal.maraText,
    };
  }
  if (clueId === "eliasWardCase") {
    return {
      title: TEXT_CONTENT.journalClues.changedJournal.eliasTitle,
      text: TEXT_CONTENT.journalClues.changedJournal.eliasText,
    };
  }
  return {
    title: realityProgress.finalPageCollected
      ? TEXT_CONTENT.journalClues.changedJournal.explorerTitle
      : TEXT_CONTENT.journalClues.changedJournal.jonahTitle,
    text: realityProgress.finalPageCollected
      ? TEXT_CONTENT.journalClues.changedJournal.explorerText
      : TEXT_CONTENT.journalClues.changedJournal.jonahText,
  };
}

function setCurrentObjective(objectiveId) {
  if (!OBJECTIVE_DATA[objectiveId] || objectiveState.currentId === objectiveId) {
    return;
  }

  objectiveState.currentId = objectiveId;
  objectiveState.bannerText = OBJECTIVE_DATA[objectiveId].title;
  objectiveState.bannerTimer = 4;
}

function completeObjective(objectiveId) {
  if (!OBJECTIVE_DATA[objectiveId] || objectiveState.completedIds.has(objectiveId)) {
    return;
  }

  objectiveState.completedIds.add(objectiveId);
  objectiveState.bannerText = formatText(TEXT_CONTENT.notifications.objectiveCompleted, {
    title: OBJECTIVE_DATA[objectiveId].title,
  });
  objectiveState.bannerTimer = 4.5;
}

function updatePlayerAnimation(target, deltaSeconds) {
  const nextMode = getPlayerAnimationMode(target);
  const frameCount = getPlayerFrameCount(nextMode);

  if (target.animationMode !== nextMode) {
    target.animationMode = nextMode;
    target.animationTimer = 0;
    target.animationFrame = 0;
  }

  target.animationTimer += deltaSeconds;

  while (target.animationTimer >= getPlayerFrameTime(nextMode)) {
    target.animationTimer -= getPlayerFrameTime(nextMode);
    target.animationFrame = (target.animationFrame + 1) % frameCount;
  }
}

function getPlayerAnimationMode(target) {
  if (target.isInteracting) {
    return "interact";
  }

  return target.isWalking ? "walk" : "idle";
}

function getPlayerFrameCount(mode) {
  if (mode === "walk") {
    return 4;
  }

  return 2;
}

function getPlayerFrameTime(mode) {
  if (mode === "walk") {
    return PLAYER_CONFIG.WALK_FRAME_TIME;
  }

  if (mode === "interact") {
    return PLAYER_CONFIG.INTERACTION_FRAME_TIME;
  }

  return PLAYER_CONFIG.IDLE_FRAME_TIME;
}

function updateCamera(view, target, deltaSeconds) {
  const world = getCurrentWorld();
  const desiredX = clamp(
    getCameraTargetX(target),
    world.CAMERA_LEFT_BOUNDARY,
    world.CAMERA_RIGHT_BOUNDARY - CANVAS_WIDTH,
  );
  const followAmount = 1 - Math.exp(-CAMERA_CONFIG.FOLLOW_SPEED * deltaSeconds);

  view.x += (desiredX - view.x) * followAmount;
  view.x = clamp(
    view.x,
    world.CAMERA_LEFT_BOUNDARY,
    world.CAMERA_RIGHT_BOUNDARY - CANVAS_WIDTH,
  );
}

function getCameraTargetX(target) {
  return target.x + target.width / 2 - CANVAS_WIDTH / 2;
}

function render() {
  context.imageSmoothingEnabled = false;
  context.fillStyle = "#000";
  context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  if (isTitleFamilyState()) {
    drawTitleScreen(titleScene);
  } else if (gameState.current === GAME_STATES.PROLOGUE) {
    drawPrologueScene(camera, prologueScene);
    if (prologueProgress.controlGranted) {
      drawPlayer(player, camera, prologueScene);
    }
  } else if (gameState.current === GAME_STATES.ENDING) {
    drawEndingScreen(titleScene);
  } else if (gameState.current === GAME_STATES.CORRIDOR) {
    drawCorridorScene(camera, corridorScene);
    drawChapterInteractables(camera);
    drawPlayer(player, camera, corridorScene);
    drawSceneEffects(corridorScene, player, camera);
  } else if (gameState.current === GAME_STATES.ARCHIVE) {
    drawArchiveScene(camera, archiveScene);
    drawPlayer(player, camera, archiveScene);
    drawArchiveForegroundOccluders(camera, archiveScene);
    drawSceneEffects(archiveScene, player, camera);
  } else if (gameState.current === GAME_STATES.RECORDS) {
    drawMissingPersonsWing(camera, recordsScene);
    drawPlayer(player, camera, recordsScene);
    drawSceneEffects(recordsScene, player, camera);
    drawMissingPersonCaseOverlay();
  } else if (gameState.current === GAME_STATES.MANUSCRIPT) {
    drawManuscriptInspectionScene(manuscriptScene);
  } else if (gameState.current === GAME_STATES.DISTORTED) {
    drawDistortedCorridorScene(camera, distortedScene);
    drawPlayer(player, camera, distortedScene);
    drawDistortedSceneEffects(distortedScene, player, camera);
  } else if (gameState.current === GAME_STATES.CLASSROOM) {
    drawUncataloguedClassroom(camera, classroomScene);
    drawPlayer(player, camera, classroomScene);
    drawSceneEffects(classroomScene, player, camera);
  } else if (gameState.current === GAME_STATES.RING) {
    drawChamberRingScene();
  } else if (gameState.current === GAME_STATES.ARCHIVIST) {
    drawArchivistChamberScene(camera, archivistScene);
    drawPlayer(player, camera, archivistScene);
    drawArchivistEffects(archivistScene, player, camera);
  } else if (gameState.current === GAME_STATES.ESCAPE) {
    drawEscapeScene(camera, escapeScene);
    if (!escapeProgress.protagonistEscaped) {
      drawPlayer(player, camera, escapeScene);
      drawFlashlightDarkness(escapeScene, player, camera);
      drawEscapeGameplayUi();
    } else {
      drawEscapeReveal(escapeScene);
    }
  } else {
    drawPlaceholderState();
  }

  if (
    debug.showOverlay &&
    debug.showCollisionBoxes &&
    !presentationState.active &&
    !TRAILER_MODE &&
    !cinematicCaptureActive &&
    !isInterfaceScreenState()
  ) {
    drawCollisionBoxes(player, camera);
  }

  drawObjectiveDisplay();
  drawRealityMessage();
  drawInteractionPrompt();
  drawJournalScreen();
  drawInspectOverlay();
  drawKeypadScreen();
  drawCircuitPuzzle();
  drawDialoguePanel();
  drawControlsHint();
  drawControlsOverlay();
  drawPresentationIndicator();
  drawPresentationStageButtons();
  drawPresentationTemporaryPrompt();
  drawPresentationCard();
  drawTransitionOverlay();
  drawAudioUnlockPrompt();
  drawDebugScreen();
}

function drawTitleScreen(scene) {
  drawTitleCorridorBackground(scene);
  drawTitleAtmosphere(scene);

  if (gameState.current === GAME_STATES.TITLE) {
    drawTitleMenu();
    return;
  }

  if (gameState.current === GAME_STATES.SETTINGS) {
    drawSettingsScreen();
    return;
  }

  if (gameState.current === GAME_STATES.CREDITS) {
    drawCreditsScreen();
    return;
  }

  if (gameState.current === GAME_STATES.PRESENTATION_MENU) {
    drawPresentationMenuScreen();
  }
}

function drawTitleCorridorBackground(scene) {
  const lightPulse = getLightFlicker(scene.time, 2.8);

  const wallGradient = context.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
  wallGradient.addColorStop(0, "#030506");
  wallGradient.addColorStop(0.28, "#111c24");
  wallGradient.addColorStop(0.62, "#10161b");
  wallGradient.addColorStop(1, "#050505");
  context.fillStyle = wallGradient;
  context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  context.fillStyle = "#070b0f";
  fillPolygon([
    [0, 0],
    [CANVAS_WIDTH, 0],
    [CANVAS_WIDTH, 82],
    [0, 58],
  ]);

  context.fillStyle = "#241c18";
  fillPolygon([
    [0, 286],
    [CANVAS_WIDTH, 274],
    [CANVAS_WIDTH, CANVAS_HEIGHT],
    [0, CANVAS_HEIGHT],
  ]);

  context.strokeStyle = "rgba(74, 93, 100, 0.3)";
  context.lineWidth = 2;
  for (let index = -3; index <= 9; index += 1) {
    const x = index * 86 + Math.sin(scene.time * 0.16) * 6;
    context.beginPath();
    context.moveTo(x, 286);
    context.lineTo(320 + (x - 320) * 0.16, 116);
    context.stroke();
  }

  for (let y = 302; y < CANVAS_HEIGHT; y += 18) {
    context.strokeStyle = y % 36 === 0 ? "#17110f" : "#332a23";
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(CANVAS_WIDTH, y - 6);
    context.stroke();
  }

  for (let panel = -1; panel < 8; panel += 1) {
    const x = panel * 104 - (scene.time * 6) % 104;
    context.fillStyle = panel % 2 === 0 ? "#182630" : "#111b22";
    fillPolygon([
      [x, 14],
      [x + 82, 12],
      [x + 74, 64],
      [x + 5, 68],
    ]);
    context.fillStyle = "#05080a";
    context.fillRect(x + 72, 20, 3, 38);
  }

  for (let support = -1; support < 8; support += 1) {
    const x = Math.round(support * 112 - (scene.time * 8) % 112);

    context.fillStyle = "#050709";
    context.fillRect(x - 6, 72, 22, 216);
    context.fillStyle = "#1b2830";
    context.fillRect(x, 78, 10, 200);
    context.fillStyle = "#34414a";
    context.fillRect(x + 10, 86, 2, 176);
  }

  for (let light = 0; light < 3; light += 1) {
    const x = 128 + light * 196 + Math.sin(scene.time * 0.3 + light) * 4;
    const flicker = getLightFlicker(scene.time, light * 1.7 + 0.5);

    context.fillStyle = "#090b0c";
    context.fillRect(x - 24, 72, 48, 9);
    context.fillStyle = "#a48f51";
    context.globalAlpha = 0.46 + flicker * 0.28;
    context.fillRect(x - 18, 80, 36, 4);
    context.globalAlpha = (0.16 + lightPulse * 0.08) * flicker;
    context.fillStyle = "#d8c16f";
    fillPolygon([
      [x - 28, 86],
      [x + 28, 86],
      [x + 106, 292],
      [x - 106, 292],
    ]);
    context.globalAlpha = 1;
  }

  for (let crack = 0; crack < 28; crack += 1) {
    const x = (crack * 47 + Math.floor(scene.time * 2)) % CANVAS_WIDTH;
    const y = 92 + ((crack * 29) % 144);

    context.fillStyle = crack % 3 === 0 ? "#2f4149" : "#080c10";
    context.fillRect(x, y, 2, 12);
    context.fillRect(x + 2, y + 10, 10, 2);
  }

  context.fillStyle = "rgba(0, 0, 0, 0.36)";
  context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function drawTitleAtmosphere(scene) {
  scene.dust.forEach((dust, index) => {
    const drift = Math.sin(scene.time * (0.28 + dust.depth * 0.36) + dust.phase) * 8;
    const x = Math.round((dust.x + scene.time * dust.depth * 8 + drift) % CANVAS_WIDTH);
    const y = Math.round(dust.y + Math.sin(scene.time * 0.45 + index) * 3);

    context.fillStyle =
      index % 5 === 0 ? "rgba(216, 193, 111, 0.16)" : "rgba(151, 166, 170, 0.1)";
    context.fillRect(x, y, dust.size, dust.size);
  });

  drawVignette();
  drawDitherGrid();
  drawFilmGrain(scene);
}

function drawTitleMenu() {
  const options = getTitleMenuOptions();

  context.textBaseline = "top";
  context.fillStyle = "#e0ddca";
  context.font = "48px monospace";
  context.fillText(TEXT_CONTENT.title.name, 70, 62);
  context.fillStyle = "#b6b091";
  context.font = "15px monospace";
  drawWrappedText(TEXT_CONTENT.title.tagline, 74, 116, 492, 16, {
    maxLines: 1,
    ellipsis: true,
  });

  options.forEach((option, index) => {
    drawMenuButton(
      getTitleButtonRect(index, options.length),
      option.label,
      index === titleMenuState.selectedIndex,
    );
  });

  context.fillStyle = "#68787c";
  context.font = "11px monospace";
  drawWrappedText(TEXT_CONTENT.title.navigationHint, 176, 328, 288, 11, {
    align: "center",
    maxLines: 1,
    ellipsis: true,
  });

  if (TRAILER_MODE && !shouldHideCaptureUi()) {
    context.fillStyle = "#d8c16f";
    drawWrappedText(TEXT_CONTENT.title.trailerNotice, 32, 18, 576, 11, {
      align: "center",
      maxLines: 1,
      ellipsis: true,
    });
  }

  if (titleMenuState.exitMessageTimer > 0 && titleMenuState.exitMessage) {
    context.fillStyle = "#d8c16f";
    context.font = "13px monospace";
    drawWrappedText(titleMenuState.exitMessage, 176, 306, 288, 13, {
      align: "center",
      maxLines: 1,
      ellipsis: true,
    });
  }
}

function drawPresentationMenuScreen() {
  const presentationText = getPresentationText();
  const options = getPresentationMenuOptions();
  const layout = getPresentationMenuLayout(options.length);
  const currentLabel = presentationState.currentSectionId
    ? getPresentationSectionLabel(presentationState.currentSectionId)
    : presentationText.noSection || "No section loaded";

  context.fillStyle = "rgba(0, 0, 0, 0.54)";
  context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  context.fillStyle = "#070c10";
  context.fillRect(layout.x, layout.y, layout.width, layout.height);
  context.strokeStyle = "#39484f";
  context.lineWidth = 2;
  context.strokeRect(layout.x + 0.5, layout.y + 0.5, layout.width, layout.height);
  context.fillStyle = "rgba(216, 193, 111, 0.3)";
  context.fillRect(layout.x, layout.y, layout.width, 2);

  context.textBaseline = "top";
  context.fillStyle = "#e0ddca";
  wrapPresentationText(
    presentationText.title || "PRESENTATION MODE",
    layout.contentX,
    layout.titleY,
    layout.contentWidth,
    22,
    {
      font: PRESENTATION_UI.TITLE_FONT,
      maxLines: 1,
      ellipsis: true,
    },
  );

  context.fillStyle = "#8fa0a4";
  wrapPresentationText(
    formatText(presentationText.currentSectionTemplate || "Current: ${section}", {
      section: currentLabel,
    }),
    layout.contentX,
    layout.currentY,
    layout.contentWidth,
    12,
    {
      font: PRESENTATION_UI.SMALL_FONT,
      maxLines: 1,
      ellipsis: true,
    },
  );

  context.fillStyle = "#d8c16f";
  wrapPresentationText(
    presentationText.sectionsTitle || "Sections",
    layout.contentX,
    layout.listTitleY,
    layout.contentWidth,
    10,
    {
      font: PRESENTATION_UI.SMALL_FONT,
      maxLines: 1,
      ellipsis: true,
    },
  );

  options.forEach((option, index) => {
    const rect = getPresentationButtonRect(index, options.length);
    const selected = index === presentationState.selectedMenuIndex;

    context.fillStyle = selected ? "rgba(216, 193, 111, 0.2)" : "rgba(7, 12, 16, 0.74)";
    context.fillRect(rect.x, rect.y, rect.width, rect.height);
    context.strokeStyle = selected ? "#d8c16f" : "#34464d";
    context.lineWidth = 1;
    context.strokeRect(rect.x + 0.5, rect.y + 0.5, rect.width, rect.height);
    if (selected) {
      context.fillStyle = "#d8c16f";
      context.fillText(">", rect.x + 8, rect.y + 4);
    }
    context.fillStyle = selected ? "#f1e7b5" : "#c4ced0";
    wrapPresentationText(option.label, rect.x + 22, rect.y + 4, rect.width - 32, 10, {
      font: PRESENTATION_UI.BUTTON_FONT,
      maxLines: 1,
      ellipsis: true,
    });
  });

  context.fillStyle = "#5e6d72";
  wrapPresentationText(
    presentationText.menuFooter || "Enter to select - Escape to resume",
    layout.contentX,
    layout.footerY,
    layout.contentWidth,
    10,
    {
      font: PRESENTATION_UI.SMALL_FONT,
      maxLines: 1,
      align: "center",
      ellipsis: true,
    },
  );
}

function drawSettingsScreen() {
  drawSubscreenPanel(TEXT_CONTENT.settings.title, TEXT_CONTENT.settings.hint);

  SETTINGS_ITEMS.forEach((item, index) => {
    drawSettingsItem(item, index, index === settingsMenuState.selectedIndex);
  });

  context.fillStyle = "#68787c";
  context.font = "11px monospace";
  drawWrappedText(TEXT_CONTENT.settings.controlsHint, 126, 314, 388, 11, {
    align: "center",
    maxLines: 1,
    ellipsis: true,
  });

  if (settingsMenuState.messageTimer > 0 && settingsMenuState.message) {
    context.fillStyle = "#d8c16f";
    context.font = "12px monospace";
    drawWrappedText(settingsMenuState.message, 306, 54, 208, 12, {
      align: "right",
      maxLines: 1,
      ellipsis: true,
    });
  }
}

function drawSettingsItem(item, index, selected) {
  const row = getSettingsRowRect(index);

  context.fillStyle = selected ? "rgba(216, 193, 111, 0.15)" : "rgba(9, 14, 18, 0.58)";
  context.fillRect(row.x, row.y, row.width, row.height);
  context.strokeStyle = selected ? "#d8c16f" : "#25343b";
  context.lineWidth = 1;
  context.strokeRect(row.x + 0.5, row.y + 0.5, row.width, row.height);

  context.fillStyle = selected ? "#e6dfbd" : "#b7c1c3";
  context.font = "12px monospace";
  context.textBaseline = "top";
  drawWrappedText(item.label, row.x + 10, row.y + 5, 190, 12, {
    maxLines: 1,
    ellipsis: true,
  });

  if (item.type === "range") {
    drawSettingsSlider(item, index);
    return;
  }

  context.fillStyle = item.type === "toggle" && settings[item.id] ? "#d8c16f" : "#839296";
  drawWrappedText(formatSettingValue(item), row.x + row.width - 94, row.y + 5, 84, 12, {
    align: "right",
    maxLines: 1,
    ellipsis: true,
  });
}

function drawSettingsSlider(item, index) {
  const slider = getSettingsSliderRect(index);
  const value = settings[item.id];
  const progress = clamp((value - item.min) / (item.max - item.min), 0, 1);

  context.fillStyle = "#071014";
  context.fillRect(slider.x, slider.y, slider.width, slider.height);
  context.fillStyle = "#d8c16f";
  context.fillRect(slider.x, slider.y, Math.round(slider.width * progress), slider.height);
  context.fillStyle = "#e0ddca";
  context.fillRect(slider.x + Math.round(slider.width * progress) - 2, slider.y - 3, 4, 11);
  context.fillStyle = "#8fa0a4";
  context.font = "11px monospace";
  context.fillText(formatSettingValue(item), slider.x + slider.width + 14, slider.y - 4);
}

function drawCreditsScreen() {
  drawSubscreenPanel(TEXT_CONTENT.credits.title, TEXT_CONTENT.credits.hint);

  context.fillStyle = "#e0ddca";
  context.font = "15px monospace";
  drawWrappedText(TEXT_CONTENT.credits.createdBy, 126, 92, 390, 16, {
    maxLines: 2,
    ellipsis: true,
  });

  context.fillStyle = "#aebabc";
  context.font = "12px monospace";
  drawWrappedText(
    TEXT_CONTENT.credits.originality,
    126,
    124,
    390,
    16,
  );

  context.fillStyle = "#d8c16f";
  context.font = "13px monospace";
  drawWrappedText(TEXT_CONTENT.credits.licensedAudio, 126, 178, 390, 13, {
    maxLines: 1,
    ellipsis: true,
  });
  context.fillStyle = "#88989c";
  context.font = "11px monospace";
  drawWrappedText(TEXT_CONTENT.credits.licensedAudioPlaceholder, 126, 199, 390, 12, {
    maxLines: 2,
    ellipsis: true,
  });

  context.fillStyle = "#d8c16f";
  context.font = "13px monospace";
  drawWrappedText(TEXT_CONTENT.credits.licensedAssets, 126, 230, 390, 13, {
    maxLines: 1,
    ellipsis: true,
  });
  context.fillStyle = "#88989c";
  context.font = "11px monospace";
  drawWrappedText(TEXT_CONTENT.credits.licensedAssetsPlaceholder, 126, 251, 390, 12, {
    maxLines: 2,
    ellipsis: true,
  });

  drawMenuButton(getCreditsBackButtonRect(), TEXT_CONTENT.credits.back, true);
}

function drawEndingScreen(scene) {
  drawTitleCorridorBackground(scene);

  context.fillStyle = "rgba(0, 0, 0, 0.68)";
  context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  drawVignette();
  drawFilmGrain(scene);

  context.textBaseline = "top";
  context.fillStyle = "#e0ddca";
  context.font = "25px monospace";
  drawWrappedText(TEXT_CONTENT.title.name, 80, 86, 480, 25, {
    align: "center",
    maxLines: 1,
    ellipsis: true,
  });
  context.fillStyle = "#c6ad61";
  context.font = "16px monospace";
  if (escapeProgress.evidencePreserved) {
    drawWrappedText(TEXT_CONTENT.ending.evidenceSurvived, 80, 124, 480, 16, {
      align: "center",
      maxLines: 1,
      ellipsis: true,
    });
    context.fillStyle = "#77888c";
    context.font = "11px monospace";
    drawWrappedText(TEXT_CONTENT.ending.recordContinues, 80, 148, 480, 11, {
      align: "center",
      maxLines: 1,
      ellipsis: true,
    });
  } else {
    drawWrappedText(TEXT_CONTENT.ending.recordContinues, 80, 128, 480, 16, {
      align: "center",
      maxLines: 1,
      ellipsis: true,
    });
  }

  ARCHIVE_SYMBOL_PATTERN.forEach((symbolId, index) => {
    drawOriginalSymbol(symbolId, 250 + index * 42, 176, 0.82, true);
  });
  if (classroomProgress.completed) {
    context.fillStyle = "#80729a";
    context.font = "9px monospace";
    drawWrappedText(TEXT_CONTENT.ending.attendancePresent, 80, 210, 480, 9, {
      align: "center",
      maxLines: 1,
      ellipsis: true,
    });
  }

  if (presentationState.active) {
    drawPresentationEndingOptions();
  } else {
    const options = getEndingMenuOptions();
    options.forEach((option, index) => {
      drawMenuButton(
        getEndingButtonRect(index, options.length),
        option.label,
        index === endingState.selectedIndex,
      );
    });

    context.fillStyle = "#68787c";
    context.font = "11px monospace";
    drawWrappedText(TEXT_CONTENT.ending.navigationHint, 176, 298, 288, 11, {
      align: "center",
      maxLines: 1,
      ellipsis: true,
    });
  }
}

function drawPresentationEndingOptions() {
  const options = getPresentationEndingOptions();
  options.forEach((option, index) => {
    const rect = getPresentationEndingButtonRect(index, options.length);
    const selected = index === presentationState.endingSelectedIndex;
    context.fillStyle = selected ? "rgba(216, 193, 111, 0.22)" : "rgba(7, 12, 16, 0.78)";
    context.fillRect(rect.x, rect.y, rect.width, rect.height);
    context.strokeStyle = selected ? "#d8c16f" : "#34464d";
    context.lineWidth = 2;
    context.strokeRect(rect.x + 0.5, rect.y + 0.5, rect.width, rect.height);
    context.fillStyle = selected ? "#f1e7b5" : "#c4ced0";
    context.textBaseline = "top";
    wrapPresentationText(option.label, rect.x + 12, rect.y + 9, rect.width - 24, 10, {
      font: PRESENTATION_UI.BUTTON_FONT,
      maxLines: 1,
      align: "center",
      ellipsis: true,
    });
  });

  context.fillStyle = "#68787c";
  wrapPresentationText(
    getPresentationText().menuFooter || TEXT_CONTENT.ending.navigationHint,
    PRESENTATION_UI.SAFE_X,
    298,
    CANVAS_WIDTH - PRESENTATION_UI.SAFE_X * 2,
    10,
    {
      font: PRESENTATION_UI.SMALL_FONT,
      maxLines: 1,
      align: "center",
      ellipsis: true,
    },
  );
}

function drawSubscreenPanel(title, hint) {
  const panel = { x: 88, y: 34, width: 464, height: 292 };

  context.fillStyle = "rgba(0, 0, 0, 0.46)";
  context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  context.fillStyle = "#070c10";
  context.fillRect(panel.x, panel.y, panel.width, panel.height);
  context.strokeStyle = "#39484f";
  context.lineWidth = 2;
  context.strokeRect(panel.x + 0.5, panel.y + 0.5, panel.width, panel.height);
  context.fillStyle = "rgba(216, 193, 111, 0.3)";
  context.fillRect(panel.x, panel.y, panel.width, 2);
  context.fillStyle = "#e0ddca";
  context.font = "22px monospace";
  context.textBaseline = "top";
  drawWrappedText(title, panel.x + 24, panel.y + 18, 250, 24, {
    maxLines: 1,
    ellipsis: true,
  });
  context.fillStyle = "#68787c";
  context.font = "11px monospace";
  drawWrappedText(hint, panel.x + 246, panel.y + 25, 194, 12, {
    align: "right",
    maxLines: 1,
    ellipsis: true,
  });
}

function drawMenuButton(rect, label, selected) {
  context.fillStyle = selected ? "rgba(216, 193, 111, 0.22)" : "rgba(7, 12, 16, 0.78)";
  context.fillRect(rect.x, rect.y, rect.width, rect.height);
  context.strokeStyle = selected ? "#d8c16f" : "#34464d";
  context.lineWidth = 2;
  context.strokeRect(rect.x + 0.5, rect.y + 0.5, rect.width, rect.height);
  context.fillStyle = selected ? "#f1e7b5" : "#c4ced0";
  context.font = "14px monospace";
  context.textBaseline = "top";
  drawWrappedText(label, rect.x + 12, rect.y + 7, rect.width - 24, 14, {
    align: "center",
    maxLines: 1,
    ellipsis: true,
  });
}

function getTitleButtonRect(index, total) {
  const width = 166;
  const height = 28;
  const x = 238;
  const startY = total > 5 ? 142 : total > 4 ? 154 : 168;
  const gap = total > 5 ? 30 : 34;

  return {
    x,
    y: startY + index * gap,
    width,
    height,
  };
}

function getSettingsRowRect(index) {
  return {
    x: 126,
    y: 82 + index * 24,
    width: 388,
    height: 20,
  };
}

function getSettingsSliderRect(index) {
  const row = getSettingsRowRect(index);

  return {
    x: row.x + 214,
    y: row.y + 7,
    width: 96,
    height: 6,
  };
}

function getCreditsBackButtonRect() {
  return {
    x: 256,
    y: 288,
    width: 128,
    height: 26,
  };
}

function getEndingButtonRect(index, total) {
  const width = 136;
  const height = 28;
  const gap = 18;
  const totalWidth = total * width + (total - 1) * gap;
  const x = Math.round((CANVAS_WIDTH - totalWidth) / 2) + index * (width + gap);

  return {
    x,
    y: 238,
    width,
    height,
  };
}

function formatSettingValue(item) {
  if (item.id === "fullscreen") {
    return typeof document !== "undefined" && document.fullscreenElement
      ? TEXT_CONTENT.settings.values.exit
      : TEXT_CONTENT.settings.values.open;
  }

  if (item.id === "back") {
    return TEXT_CONTENT.settings.values.return;
  }

  if (item.id === "textSpeed") {
    return formatText(TEXT_CONTENT.settings.values.textSpeedTemplate, {
      speed: Math.round(settings.textSpeed),
    });
  }

  if (item.type === "range") {
    return formatText(TEXT_CONTENT.settings.values.percentTemplate, {
      percent: Math.round(settings[item.id] * 100),
    });
  }

  if (item.type === "toggle") {
    return settings[item.id] ? TEXT_CONTENT.settings.values.on : TEXT_CONTENT.settings.values.off;
  }

  return "";
}

function drawCorridorScene(view, scene) {
  drawDeepBackground(view);
  drawParallaxWall(view);
  drawCeilingPanels(view);
  drawCrackedWallPattern(view);
  drawWallStains(view);
  drawPipes(view);
  drawShelfShadows(view);
  drawWarningSigns(view);
  drawArchiveDoor(view);
  drawVerticalSupports(view);
  drawLightFixtures(view, scene);
  drawTiledFloor(view);
  drawFloorReflections(view, scene);
  drawScatteredPapers(view);
}

function drawChapterInteractables(view) {
  drawDirectoryBoard(view);
  drawSecurityMemo(view);
  drawMaintenanceNotice(view);
  drawOverturnedFurnitureAndKey(view);
  drawElectricalCabinet(view);
  drawArchiveLockPanel(view);
  drawSealedCart(view);
  drawLooseFinalPage(view);
}

function drawArchiveScene(view, scene) {
  drawArchiveBackdrop(view);
  drawArchiveDeepShelves(view);
  drawArchiveCeiling(view, scene);
  drawArchiveFloor(view, scene);
  drawArchiveWallTexture(view);
  drawArchiveEntryDoor(view);
  drawMissingPersonsWingDoor(view);
  drawArchiveIndexTerminalVisual(view);
  drawArchiveOldDesk(view);
  drawArchiveFilingCabinets(view);
  drawArchiveManuscriptTableArea(view, scene);
  drawAlteredArchiveDetails(view, scene);
  drawArchiveForegroundShelves(view);
  drawArchiveRestrictedCabinet(view);
  drawArchiveLadder(view);
  drawArchiveFolders(view);
  drawArchiveDust(view, scene);
}

function drawArchiveBackdrop(view) {
  const gradient = context.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);

  gradient.addColorStop(0, "#05080b");
  gradient.addColorStop(0.32, "#121f27");
  gradient.addColorStop(0.72, "#111318");
  gradient.addColorStop(1, "#17100e");
  context.fillStyle = gradient;
  context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  const parallax = view.x * 0.18;
  for (let x = -120; x < ARCHIVE_WORLD.WIDTH + 220; x += 132) {
    const screenX = Math.round(x - parallax);

    if (screenX < -160 || screenX > CANVAS_WIDTH + 160) {
      continue;
    }

    context.fillStyle = "#0b1218";
    context.fillRect(screenX, 82, 92, 184);
    context.fillStyle = "#16232b";
    context.fillRect(screenX + 8, 94, 76, 3);
    context.fillRect(screenX + 10, 145, 70, 3);
    context.fillRect(screenX + 8, 199, 74, 3);

    for (let slot = 0; slot < 13; slot += 1) {
      const recordX = screenX + 14 + slot * 5;
      const recordH = 22 + ((slot * 9 + x) % 18);

      context.fillStyle = slot % 3 === 0 ? "#26333a" : "#11191f";
      context.fillRect(recordX, 103, 3, recordH);
      context.fillRect(recordX, 156, 3, recordH - 3);
      context.fillRect(recordX, 209, 3, recordH - 6);
    }
  }

  context.fillStyle = "rgba(0, 0, 0, 0.46)";
  context.fillRect(0, 250, CANVAS_WIDTH, 44);
}

function drawArchiveDeepShelves(view) {
  ARCHIVE_ROOM.DEEP_SHELVES.forEach((worldX, index) => {
    const x = Math.round(worldX - view.x * 0.44);

    if (x < -140 || x > CANVAS_WIDTH + 140) {
      return;
    }

    const top = 92 + (index % 2) * 8;
    context.fillStyle = "#060a0d";
    fillPolygon([
      [x, top + 12],
      [x + 96, top],
      [x + 104, 270],
      [x - 8, 278],
    ]);
    context.fillStyle = "#1a252b";
    fillPolygon([
      [x + 8, top + 20],
      [x + 84, top + 12],
      [x + 88, 254],
      [x + 2, 260],
    ]);

    for (let shelf = 0; shelf < 4; shelf += 1) {
      const y = top + 42 + shelf * 46;
      context.fillStyle = "#313a40";
      context.fillRect(x + 10, y, 76, 3);
      context.fillStyle = "#080d10";
      context.fillRect(x + 10, y + 3, 76, 3);
    }
  });
}

function drawArchiveCeiling(view, scene) {
  context.fillStyle = "#080d12";
  fillPolygon([
    [0, 0],
    [CANVAS_WIDTH, 0],
    [CANVAS_WIDTH, ARCHIVE_ROOM.CEILING_HEIGHT + 16],
    [0, ARCHIVE_ROOM.CEILING_HEIGHT],
  ]);

  const panelOffset = view.x * 0.36;
  for (let x = -80; x < ARCHIVE_WORLD.WIDTH + 160; x += 126) {
    const screenX = Math.round(x - panelOffset);

    if (screenX < -140 || screenX > CANVAS_WIDTH + 140) {
      continue;
    }

    const broken = (x / 126) % 4 === 1;
    context.fillStyle = broken ? "#11181d" : "#1c2a33";
    fillPolygon([
      [screenX, 12],
      [screenX + 92, 10],
      [screenX + 86, 52],
      [screenX + 4, 56],
    ]);
    context.fillStyle = "#05080a";
    context.fillRect(screenX + 82, 16, broken ? 20 : 3, broken ? 22 : 38);

    if (broken) {
      context.fillStyle = "#2e3538";
      context.fillRect(screenX + 16, 32, 28, 2);
      context.fillRect(screenX + 45, 34, 2, 16);
    }
  }

  const lampX = Math.round(1512 - view.x * 0.78);
  const lampFlicker = getLightFlicker(scene.time, 5.4);

  if (lampX > -120 && lampX < CANVAS_WIDTH + 120) {
    context.fillStyle = "#090b0d";
    context.fillRect(lampX - 2, 0, 4, 84);
    context.fillStyle = "#15100b";
    context.fillRect(lampX - 24, 80, 48, 12);
    context.fillStyle = "#d8be68";
    context.globalAlpha = 0.42 + lampFlicker * 0.22;
    context.fillRect(lampX - 18, 92, 36, 4);
    context.globalAlpha = 0.16 * lampFlicker;
    context.fillStyle = "#d8be68";
    fillPolygon([
      [lampX - 22, 96],
      [lampX + 22, 96],
      [lampX + 110, 290],
      [lampX - 110, 290],
    ]);
    context.globalAlpha = 1;
  }

  const cameraX = Math.round(486 - view.x * 0.72);
  if (cameraX > -60 && cameraX < CANVAS_WIDTH + 60) {
    context.fillStyle = "#07090b";
    context.fillRect(cameraX, 64, 34, 12);
    context.fillStyle = "#252d31";
    context.fillRect(cameraX + 4, 68, 26, 14);
    context.fillStyle = "#090b0d";
    context.fillRect(cameraX + 26, 72, 12, 6);
    context.fillStyle = "#702d2d";
    context.fillRect(cameraX + 8, 72, 3, 3);
  }
}

function drawArchiveFloor(view, scene) {
  const gradient = context.createLinearGradient(0, ARCHIVE_ROOM.FLOOR_Y, 0, CANVAS_HEIGHT);

  gradient.addColorStop(0, "#40362e");
  gradient.addColorStop(0.58, "#2a211d");
  gradient.addColorStop(1, "#130f0e");
  context.fillStyle = gradient;
  fillPolygon([
    [0, ARCHIVE_ROOM.FLOOR_Y],
    [CANVAS_WIDTH, ARCHIVE_ROOM.FLOOR_Y - 6],
    [CANVAS_WIDTH, CANVAS_HEIGHT],
    [0, CANVAS_HEIGHT],
  ]);

  context.fillStyle = "#17110f";
  for (let y = ARCHIVE_ROOM.FLOOR_Y + 11; y < CANVAS_HEIGHT; y += 17) {
    context.fillRect(0, y, CANVAS_WIDTH, y > 334 ? 3 : 2);
  }

  const firstTile = Math.floor(view.x / 54) * 54;
  for (let x = firstTile - 54; x < view.x + CANVAS_WIDTH + 54; x += 54) {
    const screenX = Math.round(x - view.x);
    const lowerLean = Math.round((screenX - ARCHIVE_ROOM.VANISH_X) * 0.1);

    context.strokeStyle = "#1d1715";
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(screenX, ARCHIVE_ROOM.FLOOR_Y);
    context.lineTo(screenX + lowerLean, CANVAS_HEIGHT);
    context.stroke();
  }

  for (let stain = 0; stain < 10; stain += 1) {
    const x = Math.round(130 + stain * 190 - view.x * 0.94);
    const y = 306 + (stain % 4) * 10;

    if (x < -80 || x > CANVAS_WIDTH + 80) {
      continue;
    }

    context.fillStyle = stain % 2 === 0 ? "rgba(0, 0, 0, 0.18)" : "rgba(119, 105, 72, 0.08)";
    context.fillRect(x, y, 54 + (stain % 3) * 20, 5);
    context.fillRect(x + 12, y + 5, 18, 3);
  }

  const lampX = Math.round(1512 - view.x);
  const flicker = getLightFlicker(scene.time, 5.4);
  if (lampX > -150 && lampX < CANVAS_WIDTH + 150) {
    context.globalAlpha = 0.08 * flicker;
    context.fillStyle = "#d8be68";
    fillPolygon([
      [lampX - 72, ARCHIVE_ROOM.FLOOR_Y + 4],
      [lampX + 72, ARCHIVE_ROOM.FLOOR_Y + 4],
      [lampX + 128, CANVAS_HEIGHT],
      [lampX - 128, CANVAS_HEIGHT],
    ]);
    context.globalAlpha = 1;
  }
}

function drawArchiveWallTexture(view) {
  const parallax = view.x * 0.58;

  for (let index = 0; index < 34; index += 1) {
    const x = Math.round(54 + index * 72 - parallax);
    const y = 78 + ((index * 37) % 160);

    if (x < -32 || x > CANVAS_WIDTH + 32) {
      continue;
    }

    context.fillStyle = index % 4 === 0 ? "#33434a" : "#0d151a";
    context.fillRect(x, y, 2, 14);
    context.fillRect(x + 2, y + 13, 11, 2);
    context.fillRect(x + 11, y + 15, 2, 9);
  }

  for (let seam = -100; seam < ARCHIVE_WORLD.WIDTH + 200; seam += 164) {
    const x = Math.round(seam - view.x * 0.42);

    if (x < -20 || x > CANVAS_WIDTH + 20) {
      continue;
    }

    context.fillStyle = "rgba(67, 78, 82, 0.18)";
    context.fillRect(x, 74, 2, 210);
  }
}

function drawMissingPersonsWingDoor(view) {
  const x = Math.round(1712 - view.x);
  if (x < -100 || x > CANVAS_WIDTH + 100 || manuscriptProgress.realityChanged) {
    return;
  }
  context.fillStyle = "#050708";
  context.fillRect(x - 8, 144, 88, 148);
  context.fillStyle = "#1b252a";
  context.fillRect(x, 154, 72, 138);
  context.strokeStyle = "#536269";
  context.strokeRect(x + 0.5, 154.5, 72, 138);
  context.fillStyle = "#b3aa8d";
  context.font = "8px monospace";
  context.fillText(TEXT_CONTENT.archive.labels.missingPersons, x + 4, 176);
  context.fillStyle = "#774841";
  context.fillRect(x + 8, 188, 56, 3);
}

function drawArchiveEntryDoor(view) {
  const x = Math.round(ARCHIVE_ROOM.ENTRANCE_X - view.x);
  const y = 154;

  if (x < -100 || x > CANVAS_WIDTH + 100) {
    return;
  }

  context.fillStyle = "#030506";
  context.fillRect(x - 18, y - 18, 96, 154);
  context.fillStyle = "#151b21";
  context.fillRect(x, y, 58, 136);
  context.fillStyle = "#29323a";
  context.fillRect(x + 9, y + 15, 40, 38);
  context.fillRect(x + 9, y + 68, 40, 48);
  context.fillStyle = "#050708";
  context.fillRect(x + 46, y + 82, 4, 6);
  context.fillStyle = "rgba(0, 0, 0, 0.38)";
  fillPolygon([
    [x - 22, y + 136],
    [x + 76, y + 136],
    [x + 120, CANVAS_HEIGHT],
    [x - 68, CANVAS_HEIGHT],
  ]);
}

function drawArchiveIndexTerminalVisual(view) {
  const x = Math.round(214 - view.x);
  const y = 190;

  if (x < -100 || x > CANVAS_WIDTH + 100) {
    return;
  }

  context.fillStyle = "#090d10";
  context.fillRect(x - 10, y + 54, 90, 42);
  context.fillStyle = "#151b20";
  context.fillRect(x, y + 48, 70, 48);
  context.fillStyle = "#080b0e";
  context.fillRect(x + 10, y, 54, 48);
  context.fillStyle = archiveProgress.indexRead ? "#8aa58b" : "#344249";
  context.fillRect(x + 16, y + 8, 42, 24);
  context.fillStyle = "#11171b";
  context.fillRect(x + 20, y + 14, 30, 2);
  context.fillRect(x + 20, y + 22, 20, 2);
  context.fillStyle = "#4a565b";
  context.fillRect(x + 18, y + 61, 34, 3);
  context.fillRect(x + 18, y + 72, 42, 3);
}

function drawArchiveOldDesk(view) {
  const x = Math.round(760 - view.x);
  const y = 238;

  if (x < -160 || x > CANVAS_WIDTH + 160) {
    return;
  }

  context.fillStyle = "#0a0706";
  context.fillRect(x - 18, y + 54, 142, 7);
  context.fillStyle = "#2a201b";
  fillPolygon([
    [x, y],
    [x + 110, y + 5],
    [x + 118, y + 58],
    [x - 10, y + 54],
  ]);
  context.fillStyle = "#49392f";
  context.fillRect(x + 8, y + 10, 94, 6);
  context.fillStyle = "#15100e";
  context.fillRect(x + 8, y + 22, 36, 24);
  context.fillRect(x + 60, y + 24, 34, 18);
  context.fillStyle = "#817765";
  context.fillRect(x + 24, y - 8, 42, 9);
  context.fillStyle = "#4f493d";
  context.fillRect(x + 29, y - 4, 32, 2);
}

function drawArchiveFilingCabinets(view) {
  ARCHIVE_ROOM.FILING_CABINETS.forEach((cabinet, index) => {
    const x = Math.round(cabinet.x - view.x);

    if (x < -cabinet.w - 60 || x > CANVAS_WIDTH + 60) {
      return;
    }

    context.fillStyle = "#050709";
    context.fillRect(x - 5, cabinet.y - 5, cabinet.w + 10, cabinet.h + 8);
    context.fillStyle = index === 0 ? "#202a2f" : "#182127";
    context.fillRect(x, cabinet.y, cabinet.w, cabinet.h);

    for (let drawer = 0; drawer < 3; drawer += 1) {
      const drawerY = cabinet.y + 8 + drawer * 24;
      context.fillStyle =
        archiveProgress.filingCabinetUnlocked && index === 0 && drawer === 1
          ? "#10161a"
          : "#2f3a3f";
      context.fillRect(x + 9, drawerY, cabinet.w - 18, 17);
      context.fillStyle = "#07090b";
      context.fillRect(x + 23, drawerY + 7, 22, 3);
      context.fillStyle = "#667176";
      context.fillRect(x + cabinet.w - 22, drawerY + 6, 8, 4);
    }

    if (index === 0 && !archiveProgress.filingCabinetUnlocked) {
      context.fillStyle = "#b19b50";
      context.fillRect(x + cabinet.w - 21, cabinet.y + 38, 6, 8);
    }
  });
}

function drawArchiveManuscriptTableArea(view, scene) {
  const x = Math.round(ARCHIVE_ROOM.TABLE_X - view.x);
  const y = ARCHIVE_ROOM.TABLE_Y;
  const flicker = getLightFlicker(scene.time, 6.8);

  if (x < -220 || x > CANVAS_WIDTH + 220) {
    return;
  }

  if (!archiveProgress.manuscriptTableRevealed) {
    context.fillStyle = "rgba(0, 0, 0, 0.72)";
    context.fillRect(x - 92, y - 92, ARCHIVE_ROOM.TABLE_WIDTH + 184, 160);
    context.fillStyle = "#050607";
    context.fillRect(x - 26, y + 16, ARCHIVE_ROOM.TABLE_WIDTH + 52, 30);
    context.fillStyle = "rgba(20, 28, 34, 0.58)";
    context.fillRect(x + 16, y - 8, ARCHIVE_ROOM.TABLE_WIDTH - 32, 8);
    return;
  }

  context.globalAlpha = 0.2 * flicker;
  context.fillStyle = "#d8be68";
  fillPolygon([
    [x + 6, y - 96],
    [x + ARCHIVE_ROOM.TABLE_WIDTH - 6, y - 96],
    [x + ARCHIVE_ROOM.TABLE_WIDTH + 120, y + 72],
    [x - 120, y + 72],
  ]);
  context.globalAlpha = 1;

  context.fillStyle = "#080909";
  context.fillRect(x - 16, y + 40, ARCHIVE_ROOM.TABLE_WIDTH + 32, 11);
  context.fillStyle = "#1a1714";
  fillPolygon([
    [x, y],
    [x + ARCHIVE_ROOM.TABLE_WIDTH, y + 4],
    [x + ARCHIVE_ROOM.TABLE_WIDTH - 10, y + ARCHIVE_ROOM.TABLE_HEIGHT],
    [x - 8, y + ARCHIVE_ROOM.TABLE_HEIGHT - 4],
  ]);
  context.fillStyle = "#332920";
  context.fillRect(x + 12, y + 11, ARCHIVE_ROOM.TABLE_WIDTH - 28, 25);

  if (manuscriptProgress.realityChanged) {
    context.fillStyle = "#1b1511";
    context.fillRect(x + 28, y + 16, ARCHIVE_ROOM.TABLE_WIDTH - 58, 14);
    context.fillStyle = "rgba(216, 193, 111, 0.22)";
    context.fillRect(x + 34, y + 22, ARCHIVE_ROOM.TABLE_WIDTH - 70, 2);
    context.fillStyle = "#090807";
    context.fillRect(x + 54, y + 11, 42, 4);
    return;
  }

  context.fillStyle = "#050606";
  context.fillRect(x + 28, y + 16, ARCHIVE_ROOM.TABLE_WIDTH - 58, 14);
  context.fillStyle = "#6d6557";
  context.fillRect(x + 42, y + 22, 36, 2);
  context.fillRect(x + 82, y + 18, 22, 2);
  context.fillStyle = "#b9a76b";
  context.fillRect(x + ARCHIVE_ROOM.TABLE_WIDTH - 24, y + 8, 5, 7);
}

function drawArchiveForegroundShelves(view) {
  ARCHIVE_ROOM.FOREGROUND_SHELVES.forEach((shelf, shelfIndex) => {
    const realityOffset =
      manuscriptProgress.realityChanged &&
      realityProgress.archiveExitLooped &&
      shelf.mark === "C13"
        ? 48
        : 0;
    const x = Math.round(shelf.x + realityOffset - view.x);

    if (x < -shelf.w - 80 || x > CANVAS_WIDTH + 80) {
      return;
    }

    context.fillStyle = "#050709";
    context.fillRect(x - 8, shelf.y - 8, shelf.w + 16, shelf.h + 14);
    context.fillStyle = shelfIndex % 2 === 0 ? "#172229" : "#1a252c";
    context.fillRect(x, shelf.y, shelf.w, shelf.h);
    context.fillStyle = "#070b0d";
    context.fillRect(x + shelf.w - 10, shelf.y, 10, shelf.h);
    context.fillStyle = "#2e3940";
    context.fillRect(x + 8, shelf.y + 8, shelf.w - 20, 4);

    for (let row = 0; row < 4; row += 1) {
      const rowY = shelf.y + 28 + row * 36;
      context.fillStyle = "#3a4347";
      context.fillRect(x + 10, rowY, shelf.w - 24, 3);
      context.fillStyle = "#06090b";
      context.fillRect(x + 10, rowY + 3, shelf.w - 24, 3);

      for (let slot = 0; slot < 11; slot += 1) {
        const recordX = x + 16 + slot * 10;
        const recordH = 15 + ((slot + row + shelfIndex) % 5) * 4;
        context.fillStyle =
          slot % 4 === 0 ? "#495049" : slot % 3 === 0 ? "#292b22" : "#11181d";
        context.fillRect(recordX, rowY - recordH, 5, recordH);
      }
    }

    context.fillStyle = "#080b0d";
    context.fillRect(x + 12, shelf.y + shelf.h - 28, 54, 18);
    context.fillStyle = "#b8ad74";
    context.font = "11px monospace";
    context.textBaseline = "top";
    context.fillText(shelf.mark, x + 18, shelf.y + shelf.h - 24);

    if (isArchiveShelfSearchedByMark(shelf.mark)) {
      context.fillStyle = "rgba(216, 190, 104, 0.32)";
      context.fillRect(x + 12, shelf.y + shelf.h - 32, 58, 3);
    }
  });
}

function drawArchiveRestrictedCabinet(view) {
  const x = Math.round(1562 - view.x);
  const y = 124;

  if (x < -120 || x > CANVAS_WIDTH + 120) {
    return;
  }

  context.fillStyle = "#030405";
  context.fillRect(x - 8, y - 8, 112, 174);
  context.fillStyle = archiveProgress.manuscriptTableRevealed ? "#202b31" : "#10171d";
  context.fillRect(x, y, 96, 164);

  for (let bar = 0; bar < 7; bar += 1) {
    context.fillStyle = "#07090a";
    context.fillRect(x + 10 + bar * 11, y + 12, 4, 136);
  }

  context.fillStyle = archiveProgress.accessCardFound ? "#89a985" : "#2f3a40";
  context.fillRect(x + 70, y + 86, 14, 20);
  context.fillStyle = "#080b0d";
  context.fillRect(x + 74, y + 91, 6, 3);

  if (archiveProgress.manuscriptTableRevealed) {
    context.fillStyle = "rgba(216, 190, 104, 0.24)";
    context.fillRect(x + 8, y + 8, 80, 4);
  }
}

function drawArchiveLadder(view) {
  const x = Math.round(archiveProgress.ladderX - view.x);
  const y = 118;

  if (x < -80 || x > CANVAS_WIDTH + 80) {
    return;
  }

  context.fillStyle = "#08090a";
  context.fillRect(x - 20, 104, 90, 5);
  context.fillStyle = "#3d464a";
  context.fillRect(x - 18, 102, 86, 2);

  context.fillStyle = "#11171a";
  fillPolygon([
    [x, y],
    [x + 32, y],
    [x + 46, ARCHIVE_ROOM.FLOOR_Y],
    [x - 14, ARCHIVE_ROOM.FLOOR_Y],
  ]);
  context.fillStyle = "#6d674f";
  context.fillRect(x + 4, y + 4, 5, 162);
  context.fillRect(x + 25, y + 4, 5, 162);

  for (let rung = 0; rung < 8; rung += 1) {
    context.fillStyle = "#a29460";
    context.fillRect(x + 5, y + 18 + rung * 18, 23, 3);
    context.fillStyle = "#312d21";
    context.fillRect(x + 5, y + 21 + rung * 18, 23, 2);
  }

  context.fillStyle = "#050607";
  context.fillRect(x - 10, ARCHIVE_ROOM.FLOOR_Y - 3, 14, 5);
  context.fillRect(x + 33, ARCHIVE_ROOM.FLOOR_Y - 3, 14, 5);

  if (archiveProgress.coordinateFound && !archiveProgress.ladderLockedAtC13) {
    const progress = clamp(
      (archiveProgress.ladderX - ARCHIVE_ROOM.LADDER_START_X) /
        (ARCHIVE_ROOM.LADDER_TARGET_X - ARCHIVE_ROOM.LADDER_START_X),
      0,
      1,
    );
    context.fillStyle = "rgba(4, 7, 9, 0.78)";
    context.beginPath();
    context.arc(x + 17, 86, 16, 0, Math.PI * 2);
    context.fill();
    context.strokeStyle = "#33434a";
    context.lineWidth = 4;
    context.stroke();
    context.strokeStyle = "#d8c16f";
    context.beginPath();
    context.arc(x + 17, 86, 16, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * progress);
    context.stroke();
    context.fillStyle = "#d8d7c8";
    context.font = "8px monospace";
    context.fillText(`${Math.round(progress * 100)}%`, x + 7, 82);
  }
}

function drawArchiveFolders(view) {
  ARCHIVE_ROOM.FOLDERS.forEach((folder, index) => {
    const x = Math.round(folder.x - view.x);

    if (x < -50 || x > CANVAS_WIDTH + 50) {
      return;
    }

    context.fillStyle = index % 2 === 0 ? "#9a8b68" : "#766f61";
    context.fillRect(x, folder.y, folder.w, folder.h);
    context.fillStyle = "#41392f";
    context.fillRect(x + 5, folder.y + 3, Math.max(6, folder.w - 12), 2);
  });

  if (!archiveProgress.coordinateFound) {
    const x = Math.round(1088 - view.x);

    if (x > -40 && x < CANVAS_WIDTH + 40) {
      context.fillStyle = "#b7aa83";
      context.fillRect(x, 326, 42, 12);
      context.fillStyle = "#5c5040";
      context.fillRect(x + 6, 331, 27, 2);
    }
  }
}

function drawArchiveDust(view, scene) {
  scene.dust.forEach((dust, index) => {
    const drift = Math.sin(scene.time * (0.34 + dust.depth * 0.22) + dust.phase) * 5;
    const x = Math.round(dust.x - view.x * dust.depth + drift);
    const y = Math.round(dust.y + Math.sin(scene.time * 0.4 + index) * 3);

    if (x < -6 || x > CANVAS_WIDTH + 6 || y < 0 || y > CANVAS_HEIGHT) {
      return;
    }

    context.fillStyle =
      index % 4 === 0 ? "rgba(220, 205, 142, 0.16)" : "rgba(154, 169, 172, 0.11)";
    context.fillRect(x, y, dust.size, dust.size);
  });
}

function drawArchiveForegroundOccluders(view) {
  const leftX = Math.round(-36 - view.x * 0.12);
  const rightX = Math.round(1768 - view.x * 1.03);

  context.fillStyle = "rgba(0, 0, 0, 0.38)";
  context.fillRect(leftX, 86, 54, 274);

  if (rightX < CANVAS_WIDTH + 120) {
    context.fillStyle = "rgba(0, 0, 0, 0.42)";
    context.fillRect(rightX, 96, 88, 264);
  }
}

function drawAlteredArchiveDetails(view, scene) {
  if (!manuscriptProgress.realityChanged) {
    return;
  }

  const reveal = realityProgress.archiveExitLooped ? 1 : 0.16;
  const pulse = 0.5 + Math.sin(scene.time * 2.8) * 0.18;
  const drawRequiredSymbol = (detailId, symbolId, x, y) => {
    if (!realityProgress.changedDetails.has(detailId)) {
      return;
    }

    context.globalAlpha = 0.34 + pulse * 0.22;
    drawOriginalSymbol(symbolId, x, y, 1.6, true);
    context.globalAlpha = 1;
  };

  context.globalAlpha = reveal;

  const shelfX = Math.round(928 - view.x);
  if (shelfX > -160 && shelfX < CANVAS_WIDTH + 160) {
    context.fillStyle = "rgba(0, 0, 0, 0.58)";
    context.fillRect(shelfX - 22, 124, 48, 142);
    context.fillStyle = "#283238";
    context.fillRect(shelfX + 118, 112, 22, 172);
    drawRequiredSymbol("movedShelf", "staff", shelfX - 8, 146);
  }

  const photoX = Math.round(742 - view.x);
  if (photoX > -80 && photoX < CANVAS_WIDTH + 80) {
    context.fillStyle = "#8f8366";
    context.fillRect(photoX, 218, 44, 30);
    context.fillStyle = "#151a1d";
    context.fillRect(photoX + 5, 223, 34, 20);
    context.fillStyle = "#c7b36b";
    context.fillRect(photoX + 20, 225, 10, 14);
    drawRequiredSymbol("alteredPhotograph", "restricted", photoX + 10, 253);
  }

  const clockX = Math.round(818 - view.x);
  if (clockX > -80 && clockX < CANVAS_WIDTH + 80) {
    context.fillStyle = "#0b0d0e";
    context.fillRect(clockX - 4, 217, 38, 34);
    context.fillStyle = "#958865";
    context.fillRect(clockX, 221, 30, 26);
    context.fillStyle = "#16100c";
    context.fillRect(clockX + 14, 225, 3, 16);
    context.fillRect(clockX + 8 + Math.round(Math.sin(scene.time * -2) * 5), 235, 14, 2);
    drawRequiredSymbol("backwardClock", "removed", clockX + 4, 254);
  }

  const signX = Math.round(54 - view.x * 0.56);
  if (signX > -120 && signX < CANVAS_WIDTH + 120) {
    context.fillStyle = "#0a0d10";
    context.fillRect(signX, 92, 112, 28);
    context.fillStyle = "#b9a85d";
    context.font = "11px monospace";
    context.fillText(TEXT_CONTENT.corridor.signs.exitArrow, signX + 14, 101);
    context.fillStyle = "rgba(216, 193, 111, 0.22)";
    context.fillRect(signX + 74, 111, 24, 2);
  }

  const extraDoorX = Math.round(1668 - view.x);
  if (extraDoorX > -100 && extraDoorX < CANVAS_WIDTH + 100) {
    context.fillStyle = "#040506";
    context.fillRect(extraDoorX - 10, 146, 90, 146);
    context.fillStyle = "#15191d";
    context.fillRect(extraDoorX, 154, 70, 136);
    context.fillStyle = "#242b31";
    context.fillRect(extraDoorX + 10, 168, 50, 42);
    context.fillRect(extraDoorX + 10, 224, 50, 42);
    context.fillStyle = "#050607";
    context.fillRect(extraDoorX + 32, 154, 3, 136);
  }

  context.globalAlpha = 1;
}

function drawDistortedCorridorScene(view, scene) {
  const jitter = Math.round(scene.cameraJitter);
  const viewX = view.x + jitter;
  const vanishingY = 112 + Math.sin(scene.time * 0.7) * 5;

  context.fillStyle = "#030507";
  context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  context.save();
  context.translate(jitter, 0);

  const wallGradient = context.createLinearGradient(0, 0, 0, GROUND_Y);
  wallGradient.addColorStop(0, "#05090d");
  wallGradient.addColorStop(0.42, "#16242c");
  wallGradient.addColorStop(1, "#07090c");
  context.fillStyle = wallGradient;
  context.fillRect(-8, 0, CANVAS_WIDTH + 16, GROUND_Y);

  context.fillStyle = "#0a0d11";
  fillPolygon([
    [0, 0],
    [CANVAS_WIDTH, 0],
    [CANVAS_WIDTH, 76],
    [0, 54],
  ]);

  context.fillStyle = "#211914";
  fillPolygon([
    [0, GROUND_Y],
    [CANVAS_WIDTH, GROUND_Y - 22],
    [CANVAS_WIDTH, CANVAS_HEIGHT],
    [0, CANVAS_HEIGHT],
  ]);

  drawDistortedPerspectiveLines(viewX, vanishingY);
  drawDistortedSupports(viewX);
  drawDistortedMarkings(viewX, scene);
  drawDistortedDuplicateDoors(viewX);
  drawDistortedWallSwitches(viewX);
  drawDistortedLights(viewX, scene);
  drawDistortedMovingPapers(viewX, scene);
  drawDistortedSilhouette(viewX, scene);
  drawDistortedFinalPage(viewX, scene);
  context.restore();

}

function drawDistortedSceneEffects(scene, target, view) {
  drawFlashlightDarkness(scene, target, view);

  context.globalAlpha = realityProgress.silhouetteActive ? 0.07 : 0.12;
  context.fillStyle = "#8fa0ff";
  context.fillRect(2, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  context.globalAlpha = realityProgress.silhouetteActive ? 0.05 : 0.08;
  context.fillStyle = "#d45b54";
  context.fillRect(-3, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  context.globalAlpha = 1;

  context.fillStyle = "rgba(0, 0, 0, 0.22)";
  for (let band = 0; band < 5; band += 1) {
    const y = (scene.grainFrame * 3 + band * 67) % CANVAS_HEIGHT;
    context.fillRect(0, y, CANVAS_WIDTH, 2);
  }

  drawVignette();
  drawFilmGrain(scene);
}

function drawDistortedPerspectiveLines(viewX, vanishingY) {
  context.strokeStyle = "#24343c";
  context.lineWidth = 2;

  for (let index = -4; index <= 8; index += 1) {
    const baseX = index * 94 - (viewX % 94);
    context.beginPath();
    context.moveTo(baseX, GROUND_Y);
    context.lineTo(320 + (baseX - 320) * 0.18, vanishingY);
    context.stroke();
  }

  context.strokeStyle = "#12171b";
  for (let y = GROUND_Y + 12; y < CANVAS_HEIGHT; y += 18) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(CANVAS_WIDTH, y - Math.round((y - GROUND_Y) * 0.22));
    context.stroke();
  }
}

function drawDistortedSupports(viewX) {
  DISTORTED_CORRIDOR.SUPPORTS.forEach((worldX, index) => {
    const sway = Math.round(Math.sin(index * 1.9 + distortedScene.time * 0.8) * 9);
    const x = Math.round(worldX - viewX + sway);

    if (x < -70 || x > CANVAS_WIDTH + 70) {
      return;
    }

    const top = 58 + (index % 3) * 10;
    const bottom = GROUND_Y + (index % 2) * 6;
    context.fillStyle = "#070b0e";
    fillPolygon([
      [x, top],
      [x + 28, top + 8],
      [x + 38, bottom],
      [x - 10, bottom],
    ]);
    context.fillStyle = "#2a3942";
    context.fillRect(x + 5, top + 6, 5, bottom - top - 8);
  });
}

function drawDistortedMarkings(viewX, scene) {
  for (let index = 0; index < 26; index += 1) {
    const x = Math.round(160 + index * 97 - viewX * (index % 2 === 0 ? 0.78 : 0.62));
    const y = 104 + ((index * 43 + realityProgress.loopDetailVariant * 17) % 126);

    if (x < -40 || x > CANVAS_WIDTH + 40) {
      continue;
    }

    const symbol = MANUSCRIPT_SYMBOLS[(index + realityProgress.loopDetailVariant) % MANUSCRIPT_SYMBOLS.length];
    context.globalAlpha = 0.18 + Math.sin(scene.time * 1.4 + index) * 0.05;
    drawOriginalSymbol(symbol.id, x, y, 0.74, true);
    context.globalAlpha = 1;
  }
}

function drawDistortedDuplicateDoors(viewX) {
  DISTORTED_CORRIDOR.DOORS.forEach((door) => {
    const x = Math.round(door.x - viewX);

    if (x < -120 || x > CANVAS_WIDTH + 120) {
      return;
    }

    const isReal = door.id === "realDoor";
    context.fillStyle = "#030506";
    context.fillRect(x - 10, 146, 96, 148);
    context.fillStyle = isReal ? "#151c21" : "#12171b";
    context.fillRect(x, 154, 74, 136);
    context.fillStyle = "#242b31";
    context.fillRect(x + 10, 170, 54, 36);
    context.fillRect(x + 10, 220, 54, 42);
    context.fillStyle = "#07090b";
    context.fillRect(x + 55, 226, 4, 6);
    context.fillStyle = "#b9a85d";
    context.font = "11px monospace";
    context.fillText(door.label, x + 18, 132);
    drawOriginalSymbol(door.symbolId, x + 22, 106, 1, realityProgress.discoveredSymbols.has(door.symbolId));

    if (!isReal && realityProgress.falseDoorLoops > 0) {
      context.fillStyle = "rgba(0, 0, 0, 0.32)";
      context.fillRect(x + 4, 158, 66, 128);
    }
  });

  if (
    realityProgress.archiveExitLooped &&
    !realityProgress.correctDoorChosen &&
    !classroomProgress.completed
  ) {
    const x = Math.round(1450 - viewX);
    if (x > -120 && x < CANVAS_WIDTH + 120) {
      context.fillStyle = "#020304";
      context.fillRect(x - 10, 146, 96, 148);
      context.fillStyle = "#0a0d0f";
      context.fillRect(x, 154, 74, 136);
      context.strokeStyle = "#4e3c38";
      context.strokeRect(x + 0.5, 154.5, 74, 136);
      context.fillStyle = "#78675a";
      context.font = "9px monospace";
      context.fillText(TEXT_CONTENT.archive.labels.noCatalogueEntry, x - 8, 132);
    }
  }
}

function drawDistortedWallSwitches(viewX) {
  if (!realityProgress.correctDoorChosen) {
    return;
  }

  DISTORTED_CORRIDOR.SWITCHES.forEach((switchData) => {
    const x = Math.round(switchData.x - viewX);

    if (x < -70 || x > CANVAS_WIDTH + 70) {
      return;
    }

    const activated = realityProgress.switchSequence.includes(switchData.id);
    context.fillStyle = "#06090b";
    context.fillRect(x - 5, 190, 48, 74);
    context.fillStyle = activated ? "#34453b" : "#172027";
    context.fillRect(x, 196, 38, 62);
    drawOriginalSymbol(switchData.symbolId, x + 8, 204, 0.92, activated);
    context.fillStyle = activated ? "#d8c16f" : "#59696d";
    context.fillRect(x + 13, 240, 12, 5);
  });

  if (realityProgress.passageOpen) {
    const passageX = Math.round(2470 - viewX);
    context.fillStyle = "rgba(216, 193, 111, 0.18)";
    context.fillRect(passageX - 34, 82, 128, 210);
  }
}

function drawDistortedLights(viewX, scene) {
  DISTORTED_CORRIDOR.LIGHTS.forEach((light, index) => {
    const x = Math.round(light.x - viewX);
    const shutOff = index < realityProgress.lightShutdownCount;
    const eventDim = realityProgress.silhouetteActive && index !== 2;
    const flicker = shutOff || eventDim ? 0.12 : getLightFlicker(scene.time, light.phase);

    if (x < -160 || x > CANVAS_WIDTH + 160) {
      return;
    }

    context.globalAlpha = 0.14 * flicker;
    context.fillStyle = "#d8be68";
    fillPolygon([
      [x - 24, 70],
      [x + 24, 70],
      [x + 108, 248],
      [x - 108, 248],
    ]);
    context.globalAlpha = 1;
    context.fillStyle = "#090d10";
    context.fillRect(x - 30, 58, 60, 8);
    context.fillStyle = shutOff ? "#403a2b" : "#c5ae62";
    context.fillRect(x - 18, 66, 36, 4);
  });
}

function drawDistortedMovingPapers(viewX, scene) {
  for (let index = 0; index < 12; index += 1) {
    const x = Math.round(210 + index * 198 - viewX + Math.sin(scene.time * 1.8 + index) * 18);
    const y = 314 + ((index * 17) % 30) + Math.sin(scene.time * 2.2 + index) * 4;

    if (x < -40 || x > CANVAS_WIDTH + 40) {
      continue;
    }

    context.fillStyle = index % 2 === 0 ? "#a79b7e" : "#7e7668";
    context.fillRect(x, y, 20 + (index % 3) * 6, 7);
    context.fillStyle = "#4d453b";
    context.fillRect(x + 4, y + 3, 12, 2);
  }
}

function drawDistortedSilhouette(viewX, scene) {
  if (!realityProgress.silhouetteActive) {
    return;
  }

  const x = Math.round(player.x + 470 - viewX);
  const y = 218;
  const alpha = clamp(realityProgress.silhouetteTimer / getTrailerAdjustedDuration(2.8), 0, 1);

  context.globalAlpha = 0.22 + alpha * 0.2;
  context.fillStyle = "#020303";
  context.fillRect(x + 8, y + 28, 16, 44);
  context.fillRect(x + 4, y + 18, 24, 18);
  context.fillRect(x + 11, y, 10, 18);
  context.fillRect(x + 5, y + 70, 7, 20);
  context.fillRect(x + 20, y + 70, 7, 20);
  context.globalAlpha = 1;

  const lightX = Math.round(player.x + 438 - viewX);
  context.globalAlpha = 0.16;
  context.fillStyle = "#d8c16f";
  fillPolygon([
    [lightX - 20, 72],
    [lightX + 20, 72],
    [lightX + 80, 278],
    [lightX - 80, 278],
  ]);
  context.globalAlpha = 1;
}

function drawDistortedFinalPage(viewX, scene) {
  if (!realityProgress.finalPageVisible) {
    return;
  }

  const x = Math.round(DISTORTED_CORRIDOR.FINAL_PAGE_X - viewX);
  const y = 326 + Math.sin(scene.time * 1.3) * 2;

  if (x < -120 || x > CANVAS_WIDTH + 120) {
    return;
  }

  context.globalAlpha = 0.2 + Math.sin(scene.time * 2.5) * 0.04;
  context.fillStyle = "#d8c16f";
  fillPolygon([
    [x - 70, 80],
    [x + 70, 80],
    [x + 118, 360],
    [x - 118, 360],
  ]);
  context.globalAlpha = 1;

  if (!realityProgress.finalPageCollected) {
    context.fillStyle = "#c5b98e";
    context.fillRect(x, y, 42, 14);
    context.fillStyle = "#3f3424";
    context.fillRect(x + 8, y + 5, 25, 2);
    drawOriginalSymbol("removed", x + 11, y - 24, 0.92, true);
  }
}

function isArchiveShelfSearchedByMark(mark) {
  return Object.values(ARCHIVE_SHELF_SEARCHES).some(
    (search) => search.mark === mark && archiveProgress.searchedShelves.has(search.shelfId),
  );
}

function drawManuscriptInspectionScene(scene) {
  const shake = settings.screenShake && manuscriptProgress.shakeTimer > 0
    ? Math.round(Math.sin(scene.time * 58) * 3)
    : 0;

  context.fillStyle = "#020304";
  context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  context.save();
  context.translate(shake, 0);
  drawManuscriptTableBackdrop(scene);
  drawManuscriptClosePage(scene);

  if (manuscriptProgress.stage === MANUSCRIPT_STAGES.RECONSTRUCT) {
    drawPageReconstructionStage(scene);
  } else if (manuscriptProgress.stage === MANUSCRIPT_STAGES.PATTERN) {
    drawPatternInspectionStage(scene);
  } else if (manuscriptProgress.stage === MANUSCRIPT_STAGES.SYMBOLS) {
    drawSymbolInterpretationStage(scene);
  } else if (manuscriptProgress.stage === MANUSCRIPT_STAGES.ALIGNMENT) {
    drawMissingPageAlignmentStage(scene);
  } else {
    drawSolvedManuscriptStage(scene);
  }

  drawManuscriptChrome();
  context.restore();

  if (manuscriptProgress.glitchTimer > 0) {
    drawControlledGlitch(scene);
  }
}

function drawManuscriptTableBackdrop(scene) {
  const gradient = context.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);

  gradient.addColorStop(0, "#050607");
  gradient.addColorStop(0.42, "#111316");
  gradient.addColorStop(1, "#080504");
  context.fillStyle = gradient;
  context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  context.fillStyle = "#17100d";
  fillPolygon([
    [0, 320],
    [640, 304],
    [640, 360],
    [0, 360],
  ]);

  for (let index = 0; index < 80; index += 1) {
    const x = (index * 67 + scene.grainFrame * 11) % CANVAS_WIDTH;
    const y = 34 + ((index * 41 + scene.grainFrame * 7) % 282);
    context.fillStyle = index % 3 === 0 ? "rgba(189, 170, 104, 0.08)" : "rgba(0, 0, 0, 0.16)";
    context.fillRect(x, y, 1, 1);
  }
}

function drawManuscriptClosePage(scene) {
  const pageWave = Math.sin(scene.time * 1.1) * 1.2;
  const x = MANUSCRIPT_VIEW.PAGE_X;
  const y = MANUSCRIPT_VIEW.PAGE_Y + pageWave;
  const w = MANUSCRIPT_VIEW.PAGE_WIDTH;
  const h = MANUSCRIPT_VIEW.PAGE_HEIGHT;

  context.fillStyle = "#050505";
  context.fillRect(x - 10, y - 8, w + 20, h + 18);
  context.fillStyle = "#8d8061";
  fillPolygon([
    [x + 8, y],
    [x + w - 8, y + 4],
    [x + w, y + h - 12],
    [x + 14, y + h],
  ]);
  context.fillStyle = "#c2b991";
  fillPolygon([
    [x + 16, y + 12],
    [x + w - 24, y + 17],
    [x + w - 18, y + h - 24],
    [x + 24, y + h - 14],
  ]);
  context.fillStyle = "rgba(60, 44, 28, 0.28)";
  context.fillRect(x + 38, y + 54, 72, 12);
  context.fillRect(x + 228, y + 88, 48, 18);
  context.fillRect(x + 118, y + 228, 88, 10);
  context.fillStyle = "rgba(17, 10, 8, 0.35)";
  context.fillRect(x + 20, y + 16, 4, h - 34);
  context.fillRect(x + w - 32, y + 24, 3, h - 54);

  drawFadedWriting(x + 48, y + 42, scene.time);
  drawMarginMarks(x + 278, y + 70, scene.time);
}

function drawFadedWriting(x, y, time) {
  context.fillStyle = "rgba(45, 38, 29, 0.42)";
  for (let row = 0; row < 9; row += 1) {
    for (let mark = 0; mark < 7; mark += 1) {
      const markX = x + mark * 20 + ((row + mark) % 3) * 2;
      const markY = y + row * 18;
      context.fillRect(markX, markY, 9 + ((row + mark) % 4) * 3, 2);
      context.fillRect(markX + 3, markY + 4, 2, 5 + ((row + mark) % 3));
    }
  }

  if (manuscriptProgress.inkMotionTimer > 0) {
    context.fillStyle = "rgba(20, 13, 10, 0.34)";
    for (let drip = 0; drip < 9; drip += 1) {
      const wobble = Math.sin(time * 18 + drip) * 4;
      context.fillRect(x + 18 + drip * 24 + wobble, y + 25 + drip * 9, 3, 22);
    }
  }
}

function drawMarginMarks(x, y, time) {
  const showingPagePattern =
    manuscriptProgress.stage === MANUSCRIPT_STAGES.RECONSTRUCT ||
    manuscriptProgress.stage === MANUSCRIPT_STAGES.PATTERN;
  const glow =
    manuscriptProgress.stage === MANUSCRIPT_STAGES.PATTERN ||
    (!showingPagePattern && manuscriptProgress.marginMarksRevealed);
  const symbols = showingPagePattern
    ? ARCHIVE_SYMBOL_PATTERN
    : MANUSCRIPT_SYMBOL_SEQUENCE;
  const spacing = showingPagePattern ? 40 : 48;

  symbols.forEach((symbolId, index) => {
    const markY = y + index * spacing;
    if (glow) {
      context.globalAlpha = 0.18 + Math.sin(time * 2.4 + index) * 0.04;
      context.fillStyle = "#cbb76f";
      context.fillRect(x - 8, markY - 8, 46, 38);
      context.globalAlpha = 1;
    }

    drawOriginalSymbol(symbolId, x, markY, 1.25, glow);
  });
}

function drawPageReconstructionStage(scene) {
  drawStagePanel();
  drawStageTitle(TEXT_CONTENT.manuscript.ui.stage1Label, TEXT_CONTENT.manuscript.ui.stage1Title);
  drawPageOutline();
  drawFragments(scene);
  drawStageMessage(TEXT_CONTENT.manuscript.ui.stage1Message);
  drawButton(getPuzzleButtonRect("rotateLeft"), TEXT_CONTENT.manuscript.ui.rotateLeft);
  drawButton(getPuzzleButtonRect("rotateRight"), TEXT_CONTENT.manuscript.ui.rotateRight);
}

function drawPatternInspectionStage(scene) {
  drawStagePanel();
  drawStageTitle(
    TEXT_CONTENT.manuscript.ui.pageRepairedLabel,
    TEXT_CONTENT.manuscript.ui.orderRepeatsTitle,
  );
  drawPageOutline();
  drawFragments(scene);
  drawStageMessage(TEXT_CONTENT.manuscript.ui.patternMessage);
  drawButton(getPatternContinueButtonRect(), TEXT_CONTENT.manuscript.ui.recordPattern);

  manuscriptProgress.fragments.forEach((fragment, index) => {
    const pulse = 0.12 + Math.sin(scene.time * 2 + index * 0.8) * 0.04;
    context.globalAlpha = pulse;
    context.fillStyle = "#d8c16f";
    context.fillRect(fragment.x + 8, fragment.y + 8, fragment.width - 16, fragment.height - 16);
  });
  context.globalAlpha = 1;
}

function drawStagePanel() {
  context.fillStyle = "rgba(5, 8, 10, 0.86)";
  context.fillRect(
    MANUSCRIPT_VIEW.PANEL_X,
    MANUSCRIPT_VIEW.PANEL_Y,
    MANUSCRIPT_VIEW.PANEL_WIDTH,
    MANUSCRIPT_VIEW.PANEL_HEIGHT,
  );
  context.strokeStyle = "#303f45";
  context.lineWidth = 2;
  context.strokeRect(
    MANUSCRIPT_VIEW.PANEL_X + 0.5,
    MANUSCRIPT_VIEW.PANEL_Y + 0.5,
    MANUSCRIPT_VIEW.PANEL_WIDTH,
    MANUSCRIPT_VIEW.PANEL_HEIGHT,
  );
}

function drawPageOutline() {
  const x = MANUSCRIPT_VIEW.OUTLINE_X;
  const y = MANUSCRIPT_VIEW.OUTLINE_Y;
  const w = MANUSCRIPT_VIEW.OUTLINE_WIDTH;
  const h = MANUSCRIPT_VIEW.OUTLINE_HEIGHT;

  context.fillStyle = "rgba(42, 30, 20, 0.16)";
  context.fillRect(x, y, w, h);
  context.strokeStyle = "#6c6044";
  context.lineWidth = 2;
  context.strokeRect(x + 0.5, y + 0.5, w, h);

  context.fillStyle = "rgba(0, 0, 0, 0.18)";
  context.fillRect(x + w / 2 - 2, y + 4, 4, h - 8);
  context.fillRect(x + 4, y + h / 2 - 2, w - 8, 4);
}

function drawFragments(scene) {
  const selected = getSelectedFragment();
  const drawOrder = selected
    ? [...manuscriptProgress.fragments.filter((fragment) => fragment !== selected), selected]
    : manuscriptProgress.fragments;

  drawOrder.forEach((fragment) => {
    const data = getFragmentData(fragment.id);
    const isSelected = fragment.id === manuscriptProgress.selectedFragmentId;

    drawTornFragment(fragment, data, scene.time, isSelected);
  });
}

function drawTornFragment(fragment, data, time, selected) {
  const centerX = fragment.x + fragment.width / 2;
  const centerY = fragment.y + fragment.height / 2;

  context.save();
  context.translate(centerX, centerY);
  context.rotate(fragment.rotation * Math.PI / 2);

  context.fillStyle = fragment.placed ? "#d4c99e" : "#b9ad84";
  fillPolygon([
    [-fragment.width / 2 + 4, -fragment.height / 2],
    [fragment.width / 2 - 6, -fragment.height / 2 + 4],
    [fragment.width / 2, fragment.height / 2 - 7],
    [-fragment.width / 2 + 8, fragment.height / 2],
    [-fragment.width / 2, 5],
  ]);
  context.fillStyle = "rgba(42, 26, 16, 0.2)";
  context.fillRect(-fragment.width / 2 + 12, -fragment.height / 2 + 12, fragment.width - 26, 5);
  context.fillRect(-fragment.width / 2 + 18, fragment.height / 2 - 20, fragment.width - 34, 3);

  drawOriginalSymbol(data.mark, -12, -8, 1, manuscriptProgress.marginMarksRevealed);

  context.fillStyle = "#433525";
  context.font = "11px monospace";
  context.textBaseline = "top";
  context.fillText(data.label, -fragment.width / 2 + 8, -fragment.height / 2 + 7);

  if (selected) {
    context.shadowColor = "#d8c16f";
    context.shadowBlur = 7;
    context.strokeStyle = "#d8c16f";
    context.lineWidth = 2;
    context.strokeRect(
      -fragment.width / 2 - 3,
      -fragment.height / 2 - 3,
      fragment.width + 6,
      fragment.height + 6,
    );
    context.shadowBlur = 0;
  }

  if (fragment.placed) {
    context.globalAlpha = 0.18 + Math.sin(time * 3.2) * 0.04;
    context.fillStyle = "#d8c16f";
    context.fillRect(-fragment.width / 2, -fragment.height / 2, fragment.width, 3);
    context.globalAlpha = 1;
  }

  context.restore();
}

function drawSymbolInterpretationStage(scene) {
  drawStagePanel();
  drawStageTitle(TEXT_CONTENT.manuscript.ui.stage2Label, TEXT_CONTENT.manuscript.ui.stage2Title);
  drawStageMessage(TEXT_CONTENT.manuscript.ui.stage2Message);
  drawSymbolMappingPanel();
  drawSymbolSequenceSlots();

  MANUSCRIPT_SYMBOLS.forEach((symbol, index) => {
    const rect = getSymbolButtonRect(index);
    const selected = index === manuscriptProgress.selectedSymbolIndex;
    const chosen = manuscriptProgress.symbolSequence.includes(symbol.id);

    drawSymbolButton(symbol, rect, selected, chosen);
  });

  if (manuscriptProgress.symbolStageSolved) {
    drawButton(
      getBeginAlignmentButtonRect(),
      TEXT_CONTENT.manuscript.ui.beginFinalAlignment,
    );
  }

  drawInkPulse(scene);
}

function drawSymbolMappingPanel() {
  const x = 418;
  const y = 146;
  const height = 82;

  context.fillStyle = "rgba(7, 10, 12, 0.72)";
  context.fillRect(x, y, 182, height);
  context.strokeStyle = "#303f45";
  context.strokeRect(x + 0.5, y + 0.5, 182, height);
  context.fillStyle = "#d8d7c8";
  context.font = "10px monospace";
  context.fillText(TEXT_CONTENT.manuscript.ui.journalMappings, x + 10, y + 7);

  MANUSCRIPT_SYMBOLS.forEach((symbol, index) => {
    const clueKnown = chapterProgress.clues.has(symbol.clueId);
    const rowY = y + 27 + index * 17;

    drawOriginalSymbol(symbol.id, x + 12, rowY - 2, 0.52, false);
    context.fillStyle = clueKnown ? "#cfc5a0" : "#6b7375";
    context.font = "9px monospace";
    context.fillText(symbol.classLabel, x + 34, rowY);
  });
}

function drawSymbolSequenceSlots() {
  const x = 102;
  const y = 94;

  context.fillStyle = "rgba(28, 18, 12, 0.24)";
  context.fillRect(x - 14, y - 14, 232, 58);
  context.fillStyle = "#8c7d55";
  context.font = "11px monospace";
  context.fillText(TEXT_CONTENT.manuscript.ui.marginSequence, x, y - 28);

  for (let index = 0; index < MANUSCRIPT_SYMBOL_SEQUENCE.length; index += 1) {
    const slotX = x + index * 76;

    context.strokeStyle = "#665a40";
    context.lineWidth = 2;
    context.strokeRect(slotX + 0.5, y + 0.5, 48, 42);

    const symbolId = manuscriptProgress.symbolSequence[index];
    if (symbolId) {
      drawOriginalSymbol(symbolId, slotX + 13, y + 8, 1, true);
    } else {
      context.fillStyle = "#6b6048";
      context.font = "13px monospace";
      context.fillText(String(index + 1), slotX + 19, y + 13);
    }
  }
}

function drawSymbolButton(symbol, rect, selected, chosen) {
  context.fillStyle = selected ? "#202b31" : "#11181d";
  context.fillRect(rect.x, rect.y, rect.width, rect.height);
  context.strokeStyle = selected ? "#d8c16f" : "#314047";
  context.lineWidth = 2;
  context.strokeRect(rect.x + 0.5, rect.y + 0.5, rect.width, rect.height);

  if (chosen) {
    context.fillStyle = "rgba(216, 193, 111, 0.18)";
    context.fillRect(rect.x + 3, rect.y + 3, rect.width - 6, rect.height - 6);
  }

  drawOriginalSymbol(symbol.id, rect.x + 15, rect.y + 12, 1, selected);
  context.fillStyle = "#cfc5a0";
  context.font = "11px monospace";
  context.fillText(symbol.label, rect.x + 46, rect.y + 12);
  context.fillStyle = "#7f9094";
  context.font = "9px monospace";
  drawWrappedText(symbol.classLabel, rect.x + 46, rect.y + 28, 48, 10);
}

function drawMissingPageAlignmentStage(scene) {
  drawStagePanel();
  drawStageTitle(TEXT_CONTENT.manuscript.ui.stage3Label, TEXT_CONTENT.manuscript.ui.stage3Title);
  drawStageMessage(
    chapterProgress.clues.has("jonahAlignmentLog")
      ? TEXT_CONTENT.manuscript.ui.jonahAlignmentHint
      : TEXT_CONTENT.manuscript.ui.defaultAlignmentHint,
  );
  drawManuscriptRings(scene);
  drawButton(getRingRotateLeftButtonRect(), TEXT_CONTENT.manuscript.ui.rotateLeft);
  drawButton(getRingRotateRightButtonRect(), TEXT_CONTENT.manuscript.ui.rotateRight);
  drawButton(getStageThreeBackButtonRect(), TEXT_CONTENT.manuscript.ui.back);
  drawButton(getStageThreeResetButtonRect(), TEXT_CONTENT.manuscript.ui.reset);
}

function drawManuscriptRings(scene) {
  const cx = MANUSCRIPT_VIEW.RING_CENTER_X;
  const cy = MANUSCRIPT_VIEW.RING_CENTER_Y;

  MANUSCRIPT_RINGS.forEach((ringData, index) => {
    const ring = manuscriptProgress.rings[index];
    const selected = manuscriptProgress.selectedRingIndex === index;

    context.save();
    context.translate(cx, cy);
    context.rotate(ring.rotation * Math.PI / 4);
    context.strokeStyle = selected ? "#d8c16f" : "#5f573f";
    context.lineWidth = ringData.width;
    context.beginPath();
    context.arc(0, 0, ringData.radius, 0.22, Math.PI * 1.86);
    context.stroke();

    context.strokeStyle = selected ? "#eee1a7" : "#211a14";
    context.lineWidth = 3;
    context.beginPath();
    context.moveTo(-ringData.radius + 10, -4 + index * 3);
    context.lineTo(-16, -4 + index * 3);
    context.lineTo(0, 14 - index * 4);
    context.lineTo(20, -10 + index * 2);
    context.lineTo(ringData.radius - 12, -10 + index * 2);
    context.stroke();
    context.restore();

    context.fillStyle = selected ? "#d8c16f" : "#7f9094";
    context.font = "10px monospace";
    context.fillText(
      formatText(TEXT_CONTENT.manuscript.rings.rotationTemplate, {
        label: ringData.label,
        rotation: ring.rotation,
      }),
      MANUSCRIPT_VIEW.PANEL_X + 12,
      MANUSCRIPT_VIEW.PANEL_Y + 96 + index * 22,
    );
  });

  drawOriginalSymbol("removed", cx - 16, cy - 15, 1.5, true);
}

function drawSolvedManuscriptStage(scene) {
  drawStageTitle(TEXT_CONTENT.manuscript.ui.solvedLabel, TEXT_CONTENT.manuscript.ui.solvedTitle);
  context.globalAlpha = 0.72;
  drawOriginalSymbol("removed", 286, 160, 3.4, true);
  context.globalAlpha = 1;
  drawStageMessage(TEXT_CONTENT.manuscript.ui.solvedMessage);
}

function drawManuscriptChrome() {
  context.fillStyle = "#d8d7c8";
  context.font = "17px monospace";
  context.textBaseline = "top";
  context.fillText(TEXT_CONTENT.manuscript.title, 24, 16);

  drawButton(getControlsButtonRect(), TEXT_CONTENT.manuscript.ui.controlsButton);

  if (canCloseManuscriptInspection()) {
    drawButton(getCloseManuscriptButtonRect(), TEXT_CONTENT.manuscript.ui.close);
  }

  if (
    TRAILER_MODE &&
    !presentationState.active &&
    !shouldHideCaptureUi() &&
    !manuscriptProgress.finalTriggered
  ) {
    drawButton(
      getDeveloperCompleteButtonRect(),
      TEXT_CONTENT.manuscript.ui.developerComplete,
    );
  }

  if (manuscriptProgress.messageTimer > 0 && manuscriptProgress.message) {
    context.fillStyle = "#d8c16f";
    context.font = "10px monospace";
    drawWrappedText(
      manuscriptProgress.message,
      MANUSCRIPT_VIEW.PANEL_X + 12,
      MANUSCRIPT_VIEW.PANEL_Y + 146,
      MANUSCRIPT_VIEW.PANEL_WIDTH - 24,
      12,
    );
  }
}

function drawStageTitle(label, title) {
  context.fillStyle = "#8fa0a4";
  context.font = "12px monospace";
  drawWrappedText(label, MANUSCRIPT_VIEW.PANEL_X, MANUSCRIPT_VIEW.PANEL_Y, MANUSCRIPT_VIEW.PANEL_WIDTH, 12, {
    maxLines: 1,
    ellipsis: true,
  });
  context.fillStyle = "#e1ddca";
  context.font = "17px monospace";
  drawWrappedText(title, MANUSCRIPT_VIEW.PANEL_X, MANUSCRIPT_VIEW.PANEL_Y + 18, MANUSCRIPT_VIEW.PANEL_WIDTH, 18, {
    maxLines: 2,
    ellipsis: true,
  });
}

function drawStageMessage(text) {
  context.fillStyle = "#9ba9ad";
  context.font = "11px monospace";
  drawWrappedText(
    text,
    MANUSCRIPT_VIEW.PANEL_X + 12,
    MANUSCRIPT_VIEW.PANEL_Y + 58,
    MANUSCRIPT_VIEW.PANEL_WIDTH - 24,
    14,
  );
}

function drawButton(rect, label) {
  context.fillStyle = "#10171c";
  context.fillRect(rect.x, rect.y, rect.width, rect.height);
  context.strokeStyle = "#35464d";
  context.lineWidth = 2;
  context.strokeRect(rect.x + 0.5, rect.y + 0.5, rect.width, rect.height);
  context.fillStyle = "#d8d7c8";
  context.font = "11px monospace";
  context.textBaseline = "top";
  drawWrappedText(label, rect.x + 6, rect.y + 7, rect.width - 12, 11, {
    align: "center",
    maxLines: 1,
    ellipsis: true,
  });
}

function drawInkPulse(scene) {
  if (manuscriptProgress.inkMotionTimer <= 0) {
    return;
  }

  context.fillStyle = "rgba(16, 8, 7, 0.32)";
  for (let index = 0; index < 12; index += 1) {
    const x = 80 + index * 28 + Math.sin(scene.time * 20 + index) * 5;
    const y = 132 + (index % 4) * 18;
    context.fillRect(x, y, 4, 24);
  }
}

function drawOriginalSymbol(symbolId, x, y, scale = 1, glowing = false) {
  context.save();
  context.translate(x, y);
  context.scale(scale, scale);

  if (glowing) {
    context.fillStyle = "rgba(216, 193, 111, 0.2)";
    context.fillRect(-8, -8, 34, 32);
  }

  context.strokeStyle = glowing ? "#d8c16f" : "#3f3424";
  context.fillStyle = glowing ? "#d8c16f" : "#3f3424";
  context.lineWidth = 2;

  if (symbolId === "eye") {
    context.beginPath();
    context.moveTo(0, 10);
    context.quadraticCurveTo(10, 0, 22, 10);
    context.quadraticCurveTo(10, 20, 0, 10);
    context.stroke();
    context.fillRect(9, 7, 5, 7);
  } else if (symbolId === "spiral") {
    context.beginPath();
    context.arc(11, 11, 10, 0.2, Math.PI * 1.75);
    context.arc(11, 11, 6, 0.2, Math.PI * 1.65);
    context.arc(11, 11, 2, 0, Math.PI * 1.4);
    context.stroke();
  } else if (symbolId === "brokenSquare") {
    context.beginPath();
    context.arc(5, 8, 5, 0, Math.PI * 2);
    context.moveTo(10, 8);
    context.lineTo(22, 20);
    context.moveTo(15, 13);
    context.lineTo(18, 10);
    context.moveTo(18, 16);
    context.lineTo(21, 13);
    context.stroke();
  } else if (symbolId === "verticalLine") {
    context.strokeRect(6.5, 9.5, 12, 12);
    context.fillRect(7, 1, 3, 11);
    context.fillRect(11, -1, 3, 13);
    context.fillRect(15, 1, 3, 11);
    context.fillRect(19, 5, 3, 11);
    context.fillRect(2, 10, 6, 3);
  } else if (symbolId === "staff") {
    context.strokeRect(1.5, 3.5, 18, 12);
    context.beginPath();
    context.moveTo(10, -2);
    context.lineTo(10, 25);
    context.moveTo(3, 21);
    context.lineTo(17, 21);
    context.stroke();
  } else if (symbolId === "maintenance") {
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(18, 0);
    context.lineTo(10, 18);
    context.lineTo(2, 18);
    context.closePath();
    context.stroke();
    context.fillRect(7, 22, 7, 3);
  } else if (symbolId === "restricted") {
    context.strokeRect(0.5, 0.5, 20, 20);
    context.beginPath();
    context.moveTo(5, 0);
    context.lineTo(5, 20);
    context.moveTo(11, 0);
    context.lineTo(11, 20);
    context.moveTo(17, 0);
    context.lineTo(17, 20);
    context.stroke();
    context.fillRect(7, 8, 7, 5);
  } else {
    context.beginPath();
    context.moveTo(11, -1);
    context.lineTo(22, 10);
    context.lineTo(11, 23);
    context.lineTo(0, 10);
    context.closePath();
    context.stroke();
    context.fillRect(8, 7, 6, 8);
    context.fillStyle = "#1d1610";
    context.fillRect(10, 9, 2, 4);
  }

  context.restore();
}

function drawControlledGlitch(scene) {
  const intensity = clamp(manuscriptProgress.glitchTimer / getTrailerAdjustedDuration(1.45), 0, 1);

  context.globalAlpha = 0.22 * intensity;
  context.fillStyle = "#9fb7ff";
  context.fillRect(0, 70 + (scene.grainFrame % 80), CANVAS_WIDTH, 3);
  context.fillStyle = "#d2605d";
  context.fillRect(0, 112 + (scene.grainFrame % 64), CANVAS_WIDTH, 2);
  context.globalAlpha = 0.18 * intensity;
  for (let band = 0; band < 9; band += 1) {
    const y = (band * 43 + scene.grainFrame * 3) % CANVAS_HEIGHT;
    context.fillStyle = band % 2 === 0 ? "#000" : "#d8c16f";
    context.fillRect((band % 3) * -12, y, CANVAS_WIDTH + 24, 4);
  }
  context.globalAlpha = 1;
}

function drawDirectoryBoard(view) {
  const x = Math.round(254 - view.x * 0.88);
  const y = 140;

  context.fillStyle = "#090f13";
  context.fillRect(x - 4, y - 4, 104, 82);
  context.fillStyle = "#18242c";
  context.fillRect(x, y, 96, 74);
  context.fillStyle = "#58636a";
  context.fillRect(x + 8, y + 10, 72, 2);
  context.fillRect(x + 8, y + 25, 60, 2);
  context.fillRect(x + 8, y + 40, 66, 2);
  context.fillStyle = "#b4a86b";
  context.fillRect(x + 12, y + 54, 28, 3);
  context.fillStyle = "#090f13";
  context.fillRect(x + 74, y + 48, 7, 18);
}

function drawSecurityMemo(view) {
  if (chapterProgress.securityMemoRead) {
    return;
  }

  const x = Math.round(834 - view.x);
  const y = 312;

  if (x < -40 || x > CANVAS_WIDTH + 40) {
    return;
  }

  context.fillStyle = "#aaa38f";
  context.fillRect(x, y, 30, 14);
  context.fillStyle = "#5c5448";
  context.fillRect(x + 4, y + 4, 20, 2);
  context.fillRect(x + 4, y + 8, 13, 2);
}

function drawMaintenanceNotice(view) {
  const x = Math.round(1198 - view.x * 0.88);
  const y = 158;

  if (x < -90 || x > CANVAS_WIDTH + 90) {
    return;
  }

  context.fillStyle = "#2e2a18";
  context.fillRect(x - 3, y - 3, 82, 40);
  context.fillStyle = "#c2ad5d";
  context.fillRect(x, y, 76, 34);
  context.fillStyle = "#3b351d";
  context.fillRect(x + 6, y + 7, 46, 3);
  context.fillRect(x + 6, y + 17, 58, 2);
  context.fillRect(x + 6, y + 24, 36, 2);
}

function drawOverturnedFurnitureAndKey(view) {
  const x = Math.round(1490 - view.x);
  const y = 308;

  if (x < -100 || x > CANVAS_WIDTH + 100) {
    return;
  }

  context.fillStyle = "#17120f";
  fillPolygon([
    [x, y + 18],
    [x + 82, y + 10],
    [x + 88, y + 24],
    [x + 8, y + 34],
  ]);
  context.fillStyle = "#332a24";
  context.fillRect(x + 16, y + 5, 54, 9);
  context.fillStyle = "#0b0908";
  context.fillRect(x + 22, y + 28, 9, 20);
  context.fillRect(x + 66, y + 23, 8, 18);

  if (!chapterProgress.maintenanceKeyCollected) {
    context.fillStyle = "#b8a86b";
    context.fillRect(x + 40, y + 19, 20, 3);
    context.fillRect(x + 56, y + 16, 5, 8);
    context.fillStyle = "#4f4528";
    context.fillRect(x + 43, y + 22, 8, 2);
  }
}

function drawElectricalCabinet(view) {
  const x = Math.round(1768 - view.x);
  const y = 176;

  if (x < -80 || x > CANVAS_WIDTH + 80) {
    return;
  }

  context.fillStyle = "#070b0d";
  context.fillRect(x - 5, y - 5, 68, 104);
  context.fillStyle = chapterProgress.powerReset ? "#26343a" : "#18232a";
  context.fillRect(x, y, 58, 94);
  context.fillStyle = "#3b4b52";
  context.fillRect(x + 7, y + 10, 44, 2);
  context.fillRect(x + 7, y + 72, 44, 2);
  context.fillStyle = chapterProgress.powerReset ? "#d7c56d" : "#2b1917";
  context.fillRect(x + 14, y + 42, 14, 8);
  context.fillStyle = chapterProgress.electricalCabinetOpen ? "#0b0f12" : "#050708";
  context.fillRect(x + 43, y + 42, 5, 9);
}

function drawArchiveLockPanel(view) {
  const x = Math.round(2148 - view.x);
  const y = 204;

  if (x < -60 || x > CANVAS_WIDTH + 60) {
    return;
  }

  context.fillStyle = "#06080a";
  context.fillRect(x - 4, y - 4, 44, 60);
  context.fillStyle = "#151b22";
  context.fillRect(x, y, 36, 52);
  context.fillStyle = chapterProgress.powerReset ? "#93b27b" : "#283036";
  context.fillRect(x + 8, y + 8, 20, 8);

  for (let row = 0; row < 3; row += 1) {
    for (let column = 0; column < 3; column += 1) {
      context.fillStyle = "#242a31";
      context.fillRect(x + 8 + column * 7, y + 23 + row * 7, 4, 4);
    }
  }
}

function drawSealedCart(view) {
  const x = Math.round(1010 - view.x);
  const y = 248;

  if (x < -90 || x > CANVAS_WIDTH + 90) {
    return;
  }

  context.fillStyle = "#080b0e";
  context.fillRect(x, y, 70, 42);
  context.fillStyle = "#1b262e";
  context.fillRect(x + 6, y + 5, 58, 24);
  context.fillStyle = "#5f686b";
  context.fillRect(x + 12, y + 15, 46, 3);
  context.fillStyle = "#0b0e11";
  context.fillRect(x + 12, y + 30, 8, 8);
  context.fillRect(x + 50, y + 30, 8, 8);
}

function drawLooseFinalPage(view) {
  if (!chapterProgress.archiveDoorUnlocked) {
    return;
  }

  const x = Math.round(1968 - view.x);
  const y = 328;

  if (x < -40 || x > CANVAS_WIDTH + 40) {
    return;
  }

  context.fillStyle = "#c0b59a";
  context.fillRect(x, y, 24, 10);
  context.fillStyle = "#776c59";
  context.fillRect(x + 6, y + 4, 13, 2);
}

function drawDeepBackground(view) {
  const gradient = context.createLinearGradient(0, 0, 0, GROUND_Y);

  gradient.addColorStop(0, "#071016");
  gradient.addColorStop(0.45, "#12202a");
  gradient.addColorStop(1, "#0a0e12");
  context.fillStyle = gradient;
  context.fillRect(0, 0, CANVAS_WIDTH, GROUND_Y);

  const farOffset = view.x * 0.16;
  drawRepeatingVerticals(farOffset, 118, "#1f303a", 82, 128, 2);
  drawRepeatingVerticals(farOffset + 48, 174, "#101a21", 105, 112, 2);
}

function drawParallaxWall(view) {
  context.fillStyle = "#1a252d";
  context.fillRect(0, CORRIDOR.WALL_Y, CANVAS_WIDTH, GROUND_Y - CORRIDOR.WALL_Y);

  const parallaxX = view.x * 0.36;
  drawRepeatingVerticals(parallaxX, 128, "#22313b", CORRIDOR.WALL_Y + 16, 164, 2);
  drawRepeatingVerticals(parallaxX + 58, 192, "#141f27", CORRIDOR.WALL_Y + 38, 128, 2);

  context.fillStyle = "rgba(0, 0, 0, 0.22)";
  fillPolygon([
    [0, 92],
    [CANVAS_WIDTH, 84],
    [CANVAS_WIDTH, 122],
    [0, 132],
  ]);

  context.fillStyle = "#11191f";
  context.fillRect(0, GROUND_Y - 8, CANVAS_WIDTH, 8);
}

function drawCeilingPanels(view) {
  context.fillStyle = "#0f171e";
  fillPolygon([
    [0, 0],
    [CANVAS_WIDTH, 0],
    [CANVAS_WIDTH, CORRIDOR.CEILING_HEIGHT],
    [0, CORRIDOR.CEILING_HEIGHT + 12],
  ]);

  context.fillStyle = "#26353f";
  context.fillRect(0, CORRIDOR.CEILING_HEIGHT - 4, CANVAS_WIDTH, 4);

  const firstPanel = Math.floor(view.x / 104) * 104;
  for (let x = firstPanel - 104; x < view.x + CANVAS_WIDTH + 104; x += 104) {
    const screenX = Math.round(x - view.x);

    context.fillStyle = "#2b3b45";
    context.fillRect(screenX, 10, 80, 2);
    context.fillRect(screenX + 4, 50, 78, 2);
    context.fillStyle = "#0b1015";
    context.fillRect(screenX + 78, 12, 2, 38);
  }
}

function drawCrackedWallPattern(view) {
  const parallaxX = view.x * 0.72;

  for (let index = 0; index < 24; index += 1) {
    const baseX = 92 + index * 93;
    const screenX = Math.round(baseX - parallaxX);
    const baseY = 92 + ((index * 31) % 112);

    if (screenX < -48 || screenX > CANVAS_WIDTH + 48) {
      continue;
    }

    context.fillStyle = index % 3 === 0 ? "#0f171d" : "#2d3d47";
    context.fillRect(screenX, baseY, 2, 15);
    context.fillRect(screenX + 2, baseY + 14, 13, 2);
    context.fillRect(screenX + 14, baseY + 16, 2, 10);
    context.fillRect(screenX - 8, baseY + 8, 8, 2);
    context.fillRect(screenX + 5, baseY + 4, 2, 6);
  }
}

function drawWallStains(view) {
  CORRIDOR.STAINS.forEach((stain, index) => {
    const x = Math.round(stain.x - view.x * 0.64);

    if (x < -stain.w || x > CANVAS_WIDTH + stain.w) {
      return;
    }

    context.fillStyle = index % 2 === 0 ? "rgba(4, 8, 10, 0.22)" : "rgba(69, 78, 79, 0.14)";
    context.fillRect(x, stain.y, stain.w, stain.h);
    context.fillRect(x + Math.round(stain.w * 0.18), stain.y + stain.h, 8, 18);
  });
}

function drawPipes(view) {
  drawPipeRun(view.x * 0.82, 88, 6, "#313a3f", "#12181b");
  drawPipeRun(view.x * 0.9, 112, 5, "#252d31", "#0f1518");

  const parallaxX = view.x * 0.9;
  for (let x = 236; x < WORLD.WIDTH; x += 284) {
    const screenX = Math.round(x - parallaxX);

    if (screenX < -16 || screenX > CANVAS_WIDTH + 16) {
      continue;
    }

    context.fillStyle = "#485056";
    context.fillRect(screenX, 84, 10, 14);
    context.fillRect(screenX + 2, 108, 8, 12);
    context.fillStyle = "#151b1f";
    context.fillRect(screenX + 8, 84, 2, 14);
    context.fillRect(screenX + 8, 108, 2, 12);
  }
}

function drawPipeRun(offset, y, height, bodyColor, shadowColor) {
  context.fillStyle = bodyColor;
  context.fillRect(0, y, CANVAS_WIDTH, height);
  context.fillStyle = shadowColor;
  context.fillRect(0, y + height, CANVAS_WIDTH, 2);

  const firstJoin = Math.floor(offset / 160) * 160;
  for (let x = firstJoin - 160; x < offset + CANVAS_WIDTH + 160; x += 160) {
    const screenX = Math.round(x - offset);
    context.fillStyle = "#556066";
    context.fillRect(screenX, y - 2, 8, height + 5);
    context.fillStyle = "#10161a";
    context.fillRect(screenX + 6, y - 2, 2, height + 5);
  }
}

function drawShelfShadows(view) {
  CORRIDOR.SHELVES.forEach((shelf) => {
    const x = Math.round(shelf.x - view.x);

    if (x < -shelf.w || x > CANVAS_WIDTH + shelf.w) {
      return;
    }

    context.fillStyle = "#090d10";
    context.fillRect(x, shelf.y, shelf.w, shelf.h);
    context.fillStyle = "#1a252c";
    context.fillRect(x + 8, shelf.y + 8, shelf.w - 16, 6);
    context.fillRect(x + 8, shelf.y + 34, shelf.w - 18, 5);
    context.fillRect(x + 8, shelf.y + 58, shelf.w - 22, 5);

    for (let slot = 0; slot < 7; slot += 1) {
      const bookX = x + 14 + slot * 14;
      context.fillStyle = slot % 2 === 0 ? "#27323a" : "#11181d";
      context.fillRect(bookX, shelf.y + 16, 7, 18 + (slot % 3) * 4);
    }
  });
}

function drawWarningSigns(view) {
  CORRIDOR.WARNINGS.forEach((sign) => {
    const x = Math.round(sign.x - view.x * 0.88);

    if (x < -80 || x > CANVAS_WIDTH + 80) {
      return;
    }

    context.fillStyle = "#2f2a17";
    context.fillRect(x, sign.y, 64, 24);
    context.fillStyle = "#756c36";
    context.fillRect(x + 2, sign.y + 2, 60, 2);
    context.fillRect(x + 2, sign.y + 20, 60, 2);
    context.fillStyle = "#d1be68";
    context.font = "12px monospace";
    context.textBaseline = "top";
    context.fillText(sign.label, x + 7, sign.y + 6);
  });
}

function drawArchiveDoor(view) {
  const x = Math.round(CORRIDOR.DOOR_X - view.x);
  const y = CORRIDOR.DOOR_Y;

  if (x < -CORRIDOR.DOOR_WIDTH - 56 || x > CANVAS_WIDTH + 56) {
    return;
  }

  context.fillStyle = "#06080a";
  context.fillRect(x - 12, y - 16, CORRIDOR.DOOR_WIDTH + 24, CORRIDOR.DOOR_HEIGHT + 16);

  context.fillStyle = "#181b20";
  context.fillRect(x, y, CORRIDOR.DOOR_WIDTH, CORRIDOR.DOOR_HEIGHT);

  context.fillStyle = "#242934";
  context.fillRect(x + 10, y + 12, CORRIDOR.DOOR_WIDTH - 20, 36);
  context.fillRect(x + 10, y + 62, CORRIDOR.DOOR_WIDTH - 20, 60);

  context.fillStyle = "#07080a";
  context.fillRect(x + 16, y + 18, CORRIDOR.DOOR_WIDTH - 32, 4);
  context.fillRect(x + 16, y + 68, CORRIDOR.DOOR_WIDTH - 32, 4);
  context.fillRect(x + CORRIDOR.DOOR_WIDTH - 20, y + 78, 4, 6);

  context.fillStyle = "rgba(0, 0, 0, 0.36)";
  fillPolygon([
    [x - 18, y + CORRIDOR.DOOR_HEIGHT],
    [x + CORRIDOR.DOOR_WIDTH + 18, y + CORRIDOR.DOOR_HEIGHT],
    [x + CORRIDOR.DOOR_WIDTH + 44, CANVAS_HEIGHT],
    [x - 34, CANVAS_HEIGHT],
  ]);

  drawArchiveSign(x - 48, y - 44);
}

function drawArchiveSign(x, y) {
  context.fillStyle = "#11181d";
  context.fillRect(x, y, 124, 26);
  context.fillStyle = "#39444d";
  context.fillRect(x + 2, y + 2, 120, 2);
  context.fillRect(x + 2, y + 22, 120, 2);

  context.fillStyle = "#b9d5dc";
  context.font = "14px monospace";
  context.textBaseline = "top";
  context.fillText(TEXT_CONTENT.corridor.signs.archive, x + 17, y + 6);
}

function drawVerticalSupports(view) {
  CORRIDOR.SUPPORTS.forEach((worldX) => {
    const x = Math.round(worldX - view.x);

    if (x < -36 || x > CANVAS_WIDTH + 36) {
      return;
    }

    context.fillStyle = "#0e151b";
    context.fillRect(x, CORRIDOR.CEILING_HEIGHT, 28, GROUND_Y - CORRIDOR.CEILING_HEIGHT);
    context.fillStyle = "#2a3942";
    context.fillRect(x + 4, CORRIDOR.CEILING_HEIGHT, 4, GROUND_Y - CORRIDOR.CEILING_HEIGHT);
    context.fillStyle = "#05080a";
    context.fillRect(x + 24, CORRIDOR.CEILING_HEIGHT, 4, GROUND_Y - CORRIDOR.CEILING_HEIGHT);
    context.fillStyle = "#1e2a31";
    context.fillRect(x - 4, GROUND_Y - 14, 36, 14);
  });
}

function drawLightFixtures(view, scene) {
  CORRIDOR.LIGHTS.forEach((light, index) => {
    const centerX = Math.round(light.x - view.x);
    const flicker = getLightFlicker(scene.time, light.phase);

    if (centerX < -160 || centerX > CANVAS_WIDTH + 160) {
      return;
    }

    context.globalAlpha = 0.08 * flicker;
    context.fillStyle = "#d8c17a";
    fillPolygon([
      [centerX - 34, 66],
      [centerX + 34, 66],
      [centerX + 118, 230],
      [centerX - 118, 230],
    ]);
    context.globalAlpha = 0.1 * flicker;
    context.fillStyle = "#dbe7d0";
    context.fillRect(centerX - 68, 68, 136, 54);
    context.globalAlpha = 1;

    context.fillStyle = "#0b0f13";
    context.fillRect(centerX - 32, 56, 64, 8);
    context.fillStyle = "#746d50";
    context.fillRect(centerX - 24, 62, 48, 4);
    context.fillStyle = index === 1 ? "#e4d28b" : "#cbb774";
    context.globalAlpha = 0.62 + flicker * 0.28;
    context.fillRect(centerX - 20, 66, 40, 4);
    context.globalAlpha = 1;
  });
}

function getLightFlicker(time, phase) {
  const slow = Math.sin(time * 4.2 + phase) * 0.045;
  const quick = Math.sin(time * 17.0 + phase * 1.7) * 0.025;

  return clamp(0.9 + slow + quick, 0.82, 1);
}

function drawTiledFloor(view) {
  const floorGradient = context.createLinearGradient(0, CORRIDOR.FLOOR_Y, 0, CANVAS_HEIGHT);

  floorGradient.addColorStop(0, "#39322d");
  floorGradient.addColorStop(0.52, "#2a2522");
  floorGradient.addColorStop(1, "#171413");
  context.fillStyle = floorGradient;
  context.fillRect(0, CORRIDOR.FLOOR_Y, CANVAS_WIDTH, CANVAS_HEIGHT - CORRIDOR.FLOOR_Y);

  context.fillStyle = "#181413";
  for (let y = CORRIDOR.FLOOR_Y + 12; y < CANVAS_HEIGHT; y += 18) {
    const thickness = y > 334 ? 3 : 2;
    context.fillRect(0, y, CANVAS_WIDTH, thickness);
  }

  const firstTile = Math.floor(view.x / 48) * 48;
  for (let x = firstTile - 48; x < view.x + CANVAS_WIDTH + 48; x += 48) {
    const screenX = Math.round(x - view.x);
    const lowerLean = Math.round((screenX - CORRIDOR.VANISH_X) * 0.08);

    context.strokeStyle = "#1b1817";
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(screenX, CORRIDOR.FLOOR_Y + 2);
    context.lineTo(screenX + lowerLean, CANVAS_HEIGHT);
    context.stroke();
  }

  context.fillStyle = "#3a322d";
  context.fillRect(0, CORRIDOR.FLOOR_Y, CANVAS_WIDTH, 4);
  context.fillStyle = "#151312";
  context.fillRect(0, CORRIDOR.FLOOR_Y + 4, CANVAS_WIDTH, 4);
}

function drawFloorReflections(view, scene) {
  CORRIDOR.LIGHTS.forEach((light) => {
    const centerX = Math.round(light.x - view.x);
    const flicker = getLightFlicker(scene.time, light.phase);

    if (centerX < -140 || centerX > CANVAS_WIDTH + 140) {
      return;
    }

    context.globalAlpha = 0.055 * flicker;
    context.fillStyle = "#d8c17a";
    fillPolygon([
      [centerX - 42, GROUND_Y + 5],
      [centerX + 42, GROUND_Y + 5],
      [centerX + 95, CANVAS_HEIGHT],
      [centerX - 95, CANVAS_HEIGHT],
    ]);
    context.globalAlpha = 1;
  });
}

function drawScatteredPapers(view) {
  CORRIDOR.PAPERS.forEach((paper, index) => {
    const x = Math.round(paper.x - view.x);

    if (x < -32 || x > CANVAS_WIDTH + 32) {
      return;
    }

    context.fillStyle = paper.shade;
    context.fillRect(x, paper.y, paper.w, paper.h);
    context.fillStyle = "#4f4a44";
    context.fillRect(x + 2, paper.y + paper.h - 2, Math.max(4, paper.w - 6), 2);

    if (index % 2 === 0) {
      context.fillRect(x + paper.w - 4, paper.y, 2, paper.h);
    }
  });
}

function drawRepeatingVerticals(offset, spacing, color, y, height, width) {
  const start = Math.floor(offset / spacing) * spacing;

  context.fillStyle = color;
  for (let x = start - spacing; x < offset + CANVAS_WIDTH + spacing; x += spacing) {
    context.fillRect(Math.round(x - offset), y, width, height);
  }
}

function drawPlayer(target, view, scene) {
  const x = Math.round(target.x - view.x);
  const y = Math.round(target.y);
  const frame = target.animationFrame;
  const bob = getPlayerBob(target.animationMode, frame);

  drawPlayerShadow(x, y);
  drawPlayerLegs(x, y, target.facing, target.animationMode, frame);
  drawPlayerBody(x, y + bob, target.facing, target.animationMode, frame);
  drawPlayerFlashlight(x, y + bob, target.facing, scene.flashlightOn);
}

function getPlayerBob(mode, frame) {
  if (mode === "walk") {
    return frame % 2;
  }

  if (mode === "interact") {
    return frame;
  }

  return frame === 0 ? 0 : 1;
}

function drawPlayerShadow(x, y) {
  context.fillStyle = "rgba(0, 0, 0, 0.72)";
  context.fillRect(x - 5, y + PLAYER_CONFIG.HEIGHT - 2, PLAYER_CONFIG.WIDTH + 10, 4);
}

function drawPlayerLegs(x, y, facing, mode, frame) {
  const cycle = mode === "walk" ? frame : 0;
  const frontStep = [0, 4, 0, -3][cycle] || 0;
  const backStep = [0, -3, 0, 4][cycle] || 0;
  const frontLegX = facing === 1 ? x + 14 : x + 6;
  const backLegX = facing === 1 ? x + 7 : x + 13;

  context.fillStyle = "#101116";
  context.fillRect(backLegX, y + 31 + backStep, 5, 16 - Math.max(0, backStep));
  context.fillRect(frontLegX, y + 31 + frontStep, 5, 16 - Math.max(0, frontStep));

  context.fillStyle = "#252936";
  context.fillRect(frontLegX - 1, y + 46 + frontStep, 9, 2);
  context.fillRect(backLegX - 2, y + 46 + backStep, 9, 2);
}

function drawPlayerBody(x, y, facing, mode, frame) {
  const eyeX = facing === 1 ? x + 16 : x + 7;
  const shoulderOffset = mode === "walk" && frame % 2 === 1 ? 1 : 0;

  context.fillStyle = "#0a0b0f";
  context.fillRect(x + 4, y + 14, 17, 23);
  context.fillRect(x + 3, y + 20, 19, 16);

  context.fillStyle = "#1b1e29";
  context.fillRect(x + 6, y + 12 + shoulderOffset, 12, 25);
  context.fillStyle = "#303544";
  context.fillRect(x + 8, y + 14 + shoulderOffset, 8, 20);
  context.fillStyle = "#10131a";
  context.fillRect(x + 5, y + 21, 3, 15);
  context.fillRect(x + 17, y + 21, 3, 15);

  context.fillStyle = "#2d3038";
  context.fillRect(x + 7, y + 3, 10, 9);
  context.fillRect(x + 5, y + 10, 14, 6);
  context.fillStyle = "#07080b";
  context.fillRect(x + 4, y + 8, 16, 4);
  context.fillRect(x + 4, y + 15, 5, 4);

  context.fillStyle = "#c1b99f";
  context.fillRect(eyeX, y + 8, 2, 2);

  context.fillStyle = "#171923";
  context.fillRect(facing === 1 ? x + 18 : x + 2, y + 18, 4, 12);
}

function drawPlayerFlashlight(x, y, facing, isOn) {
  const gripX = facing === 1 ? x + 21 : x - 2;
  const beamStartX = facing === 1 ? gripX + 4 : gripX - 8;

  context.fillStyle = "#2d2f34";
  context.fillRect(gripX, y + 24, 6, 4);
  context.fillStyle = isOn ? "#d8cc91" : "#615c46";
  context.fillRect(beamStartX, y + 24, 8, 3);
}

function drawSceneEffects(scene, target, view) {
  drawFlashlightDarkness(scene, target, view);
  drawVignette();
  drawDitherGrid();
  drawFilmGrain(scene);
}

function drawFlashlightDarkness(scene, target, view) {
  if (!scene.flashlightOn) {
    context.fillStyle = "rgba(0, 0, 0, 0.9)";
    context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    return;
  }

  const centerX = Math.round(target.x - view.x + target.width / 2 + target.facing * 22);
  const centerY = Math.round(target.y + 25);
  const gradient = context.createRadialGradient(
    centerX,
    centerY,
    16,
    centerX,
    centerY,
    184,
  );

  gradient.addColorStop(0, "rgba(0, 0, 0, 0.04)");
  gradient.addColorStop(0.28, "rgba(0, 0, 0, 0.18)");
  gradient.addColorStop(0.62, "rgba(0, 0, 0, 0.58)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0.88)");

  context.fillStyle = gradient;
  context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function drawVignette() {
  const gradient = context.createRadialGradient(320, 176, 112, 320, 176, 352);

  gradient.addColorStop(0, "rgba(0, 0, 0, 0)");
  gradient.addColorStop(0.64, "rgba(0, 0, 0, 0.16)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0.68)");

  context.fillStyle = gradient;
  context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function drawDitherGrid() {
  const intensity = settings.grainIntensity;

  if (intensity <= 0) {
    return;
  }

  context.fillStyle = `rgba(0, 0, 0, ${0.055 * intensity})`;
  for (let y = 1; y < CANVAS_HEIGHT; y += 4) {
    for (let x = (y % 8 === 1 ? 0 : 2); x < CANVAS_WIDTH; x += 8) {
      context.fillRect(x, y, 2, 1);
    }
  }
}

function drawFilmGrain(scene) {
  const intensity = settings.grainIntensity;
  const speckCount = Math.round(260 * intensity);

  if (speckCount <= 0) {
    return;
  }

  for (let index = 0; index < speckCount; index += 1) {
    const x = (index * 73 + scene.grainFrame * 29) % CANVAS_WIDTH;
    const y = (index * 47 + scene.grainFrame * 31) % CANVAS_HEIGHT;
    const lightSpeck = index % 4 === 0;

    context.fillStyle = lightSpeck
      ? `rgba(255, 255, 255, ${0.03 * intensity})`
      : `rgba(0, 0, 0, ${0.06 * intensity})`;
    context.fillRect(x, y, 1, 1);
  }
}

function drawObjectiveDisplay() {
  if (
    journalState.open ||
    keypadState.active ||
    recordsProgress.activeCaseId !== null ||
    (gameState.current === GAME_STATES.PROLOGUE && !prologueProgress.controlGranted) ||
    gameState.current === GAME_STATES.MANUSCRIPT ||
    gameState.current === GAME_STATES.RING ||
    (gameState.current === GAME_STATES.ESCAPE && escapeProgress.protagonistEscaped) ||
    isInterfaceScreenState() ||
    shouldHideCaptureUi()
  ) {
    return;
  }

  const objective = OBJECTIVE_DATA[objectiveState.currentId];
  const alpha = objectiveState.bannerTimer > 0 ? 0.94 : 0.34;
  const inBoss = gameState.current === GAME_STATES.ARCHIVIST;
  const x = inBoss ? 408 : 360;
  const y = inBoss ? 296 : 18;
  const width = inBoss ? 216 : 256;
  const height = inBoss ? 50 : 56;

  context.globalAlpha = alpha;
  context.fillStyle = "rgba(4, 7, 10, 0.72)";
  context.fillRect(x, y, width, height);
  context.fillStyle = "rgba(164, 181, 184, 0.28)";
  context.fillRect(x, y, width, 2);
  context.fillStyle = "#d8d7c8";
  context.font = inBoss ? "10px monospace" : "13px monospace";
  context.textBaseline = "top";
  drawWrappedText(objective.title, x + 10, y + 8, width - 20, inBoss ? 11 : 13, {
    maxLines: 1,
    ellipsis: true,
  });
  context.fillStyle = "#93a3a6";
  context.font = inBoss ? "8px monospace" : "10px monospace";
  drawWrappedText(objective.detail, x + 10, y + 27, width - 20, 11, {
    maxLines: 2,
    ellipsis: true,
  });
  context.globalAlpha = 1;
}

function drawRealityMessage() {
  if (
    realityProgress.messageTimer <= 0 ||
    !realityProgress.message ||
    gameState.current === GAME_STATES.RING ||
    shouldHideCaptureUi() ||
    dialogueState.active ||
    journalState.open ||
    keypadState.active ||
    inspectOverlayState.active ||
    controlsState.open
  ) {
    return;
  }

  const x = 46;
  const y = 72;
  const width = 360;
  const height = 44;

  context.fillStyle = "rgba(3, 5, 7, 0.76)";
  context.fillRect(x, y, width, height);
  context.fillStyle = "rgba(216, 193, 111, 0.32)";
  context.fillRect(x, y, width, 2);
  context.fillStyle = "#d8d7c8";
  context.font = "12px monospace";
  context.textBaseline = "top";
  drawWrappedText(realityProgress.message, x + 12, y + 10, width - 24, 14, {
    maxLines: 2,
    ellipsis: true,
  });
}

function drawControlsHint() {
  if (
    (gameState.current === GAME_STATES.PROLOGUE && !prologueProgress.controlGranted) ||
    gameState.current === GAME_STATES.MANUSCRIPT ||
    gameState.current === GAME_STATES.RING ||
    gameState.current === GAME_STATES.ARCHIVIST ||
    (gameState.current === GAME_STATES.ESCAPE && escapeProgress.protagonistEscaped) ||
    isInterfaceScreenState() ||
    shouldHideCaptureUi() ||
    controlsState.open ||
    journalState.open ||
    keypadState.active ||
    dialogueState.active ||
    inspectOverlayState.active
  ) {
    return;
  }

  const text = TEXT_CONTENT.generalUI.controlsHint;
  context.font = "11px monospace";
  const maxTextWidth = 228;
  const layout = measurePresentationText(text, maxTextWidth, 11, {
    maxLines: 1,
    ellipsis: true,
  });
  const textWidth = Math.min(
    maxTextWidth,
    Math.max(...layout.lines.map((line) => measureTextWidth(line, context.font)), 0),
  );
  const width = Math.ceil(textWidth) + 18;
  const x = 18;
  const y = CANVAS_HEIGHT - 28;

  context.fillStyle = "rgba(3, 5, 7, 0.64)";
  context.fillRect(x, y, width, 20);
  context.fillStyle = "#9ba9ad";
  context.textBaseline = "top";
  drawWrappedText(text, x + 9, y + 5, width - 18, 11, {
    maxLines: 1,
    ellipsis: true,
  });
}

function drawControlsOverlay() {
  if (!controlsState.open) {
    return;
  }

  context.fillStyle = "rgba(0, 0, 0, 0.78)";
  context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  const x = 74;
  const y = 34;
  const width = 492;
  const height = 292;

  context.fillStyle = "#080d11";
  context.fillRect(x, y, width, height);
  context.strokeStyle = "#39484f";
  context.lineWidth = 2;
  context.strokeRect(x + 0.5, y + 0.5, width, height);

  context.fillStyle = "#d8d7c8";
  context.font = "20px monospace";
  context.textBaseline = "top";
  drawWrappedText(TEXT_CONTENT.generalUI.controls.title, x + 22, y + 18, 270, 20, {
    maxLines: 1,
    ellipsis: true,
  });

  context.fillStyle = "#8fa0a4";
  context.font = "11px monospace";
  drawWrappedText(TEXT_CONTENT.generalUI.controls.closeHint, x + 314, y + 23, 154, 11, {
    align: "right",
    maxLines: 1,
    ellipsis: true,
  });

  drawControlsColumn(
    x + 24,
    y + 60,
    TEXT_CONTENT.generalUI.controls.explorationTitle,
    TEXT_CONTENT.generalUI.controls.explorationLines,
  );

  drawControlsColumn(
    x + 24,
    y + 164,
    TEXT_CONTENT.generalUI.controls.journalTitle,
    TEXT_CONTENT.generalUI.controls.journalLines,
  );

  drawControlsColumn(
    x + 270,
    y + 60,
    TEXT_CONTENT.generalUI.controls.manuscriptTitle,
    TEXT_CONTENT.generalUI.controls.manuscriptLines,
  );

  drawControlsColumn(
    x + 270,
    y + 196,
    TEXT_CONTENT.generalUI.controls.climaxTitle,
    TEXT_CONTENT.generalUI.controls.climaxLines,
  );

  if (TRAILER_MODE && !presentationState.active && !shouldHideCaptureUi()) {
    context.fillStyle = "#d8c16f";
    context.font = "11px monospace";
    drawWrappedText(TEXT_CONTENT.generalUI.controls.trailerShortcuts, x + 270, y + 250, 196, 11, {
      maxLines: 2,
      ellipsis: true,
    });
  }
}

function shouldHidePresentationIndicator() {
  return (
    !presentationState.active ||
    !presentationState.overlayVisible ||
    isInterfaceScreenState() ||
    cinematicCaptureActive ||
    controlsState.open ||
    dialogueState.active ||
    journalState.open ||
    keypadState.active ||
    inspectOverlayState.active ||
    recordsProgress.activeCaseId !== null ||
    circuitPuzzleState.active ||
    gameState.current === GAME_STATES.MANUSCRIPT ||
    gameState.current === GAME_STATES.RING ||
    gameState.current === GAME_STATES.ARCHIVIST ||
    escapeProgress.cameraChoiceActive ||
    (gameState.current === GAME_STATES.ESCAPE && escapeProgress.protagonistEscaped)
  );
}

function drawPresentationIndicator() {
  if (shouldHidePresentationIndicator()) {
    return;
  }

  const sectionLabel = String(
    getPresentationSectionLabel(presentationState.currentSectionId) || "",
  ).toUpperCase();
  const x = PRESENTATION_UI.SAFE_X;
  const y = PRESENTATION_UI.SAFE_Y;
  const width = 184;
  const height = 34;

  context.fillStyle = "rgba(3, 6, 9, 0.58)";
  context.fillRect(x, y, width, height);
  context.strokeStyle = "rgba(216, 193, 111, 0.22)";
  context.lineWidth = 1;
  context.strokeRect(x + 0.5, y + 0.5, width, height);
  context.textBaseline = "top";
  context.fillStyle = "#d8c16f";
  wrapPresentationText("PRESENTATION MODE", x + 9, y + 6, width - 18, 10, {
    font: PRESENTATION_UI.INDICATOR_FONT,
    maxLines: 1,
    ellipsis: true,
  });
  context.fillStyle = "#8fa0a4";
  wrapPresentationText(sectionLabel, x + 9, y + 19, width - 18, 9, {
    font: PRESENTATION_UI.SMALL_FONT,
    maxLines: 1,
    ellipsis: true,
  });
}

function shouldHidePresentationTemporaryPrompt() {
  return (
    !presentationState.active ||
    !presentationState.overlayVisible ||
    presentationState.promptTimer <= 0 ||
    !presentationState.promptText ||
    isInterfaceScreenState() ||
    cinematicCaptureActive ||
    controlsState.open ||
    dialogueState.active ||
    journalState.open ||
    keypadState.active ||
    inspectOverlayState.active ||
    recordsProgress.activeCaseId !== null ||
    gameState.current === GAME_STATES.MANUSCRIPT ||
    gameState.current === GAME_STATES.RING ||
    gameState.current === GAME_STATES.ARCHIVIST ||
    escapeProgress.cameraChoiceActive
  );
}

function drawPresentationTemporaryPrompt() {
  if (shouldHidePresentationTemporaryPrompt()) {
    return;
  }

  const maxWidth = CANVAS_WIDTH - PRESENTATION_UI.SAFE_X * 2;
  const textWidth = Math.min(
    maxWidth,
    Math.ceil(measureTextWidth(presentationState.promptText, PRESENTATION_UI.BUTTON_FONT)) + 28,
  );
  const x = Math.round((CANVAS_WIDTH - textWidth) / 2);
  const y = CANVAS_HEIGHT - PRESENTATION_UI.SAFE_Y - 62;

  context.globalAlpha = clamp(presentationState.promptTimer / 0.2, 0, 1);
  context.fillStyle = "rgba(3, 6, 9, 0.72)";
  context.fillRect(x, y, textWidth, 22);
  context.strokeStyle = "rgba(216, 193, 111, 0.24)";
  context.lineWidth = 1;
  context.strokeRect(x + 0.5, y + 0.5, textWidth, 22);
  context.fillStyle = "#b8c3c5";
  context.textBaseline = "top";
  wrapPresentationText(presentationState.promptText, x + 14, y + 6, textWidth - 28, 10, {
    font: PRESENTATION_UI.BUTTON_FONT,
    maxLines: 1,
    align: "center",
    ellipsis: true,
  });
  context.globalAlpha = 1;
}

function drawPresentationStageButtons() {
  const buttons = getPresentationSpecialButtons();
  if (
    !presentationState.active ||
    !presentationState.overlayVisible ||
    gameState.current !== GAME_STATES.MANUSCRIPT ||
    buttons.length === 0 ||
    isInterfaceScreenState() ||
    manuscriptProgress.finalTriggered ||
    controlsState.open
  ) {
    return;
  }

  buttons.forEach((button, index) => {
    const rect = getPresentationSpecialButtonRect(index);
    const hovered = isPointInRect(mouse.x, mouse.y, rect);
    context.fillStyle = hovered ? "rgba(216, 193, 111, 0.18)" : "rgba(3, 6, 9, 0.74)";
    context.fillRect(rect.x, rect.y, rect.width, rect.height);
    context.strokeStyle = hovered ? "#d8c16f" : "#34464d";
    context.lineWidth = 1;
    context.strokeRect(rect.x + 0.5, rect.y + 0.5, rect.width, rect.height);
    context.fillStyle = hovered ? "#efe4b1" : "#aebabc";
    context.textBaseline = "top";
    wrapPresentationText(button.label, rect.x + 6, rect.y + 5, rect.width - 12, 9, {
      font: PRESENTATION_UI.SMALL_FONT,
      maxLines: 1,
      align: "center",
      ellipsis: true,
    });
  });
}

function drawPresentationCard() {
  if (!presentationState.active || presentationState.cardTimer <= 0 || isInterfaceScreenState()) {
    return;
  }

  const alpha = clamp(presentationState.cardTimer / 0.22, 0, 1);
  const maxWidth = Math.min(
    PRESENTATION_UI.CARD_MAX_WIDTH,
    CANVAS_WIDTH - PRESENTATION_UI.SAFE_X * 2,
  );
  const contentWidth = maxWidth - PRESENTATION_UI.CARD_PADDING_X * 2;
  const titleMetrics = measurePresentationText(
    presentationState.cardTitle.toUpperCase(),
    contentWidth,
    23,
    {
      font: PRESENTATION_UI.CARD_TITLE_FONT,
      maxLines: 2,
      ellipsis: true,
    },
  );
  const bodyMetrics = measurePresentationText(presentationState.cardBody, contentWidth, 15, {
    font: PRESENTATION_UI.BODY_FONT,
    maxLines: 2,
    ellipsis: true,
  });
  const contentHeight = titleMetrics.height + 14 + bodyMetrics.height;
  const width = maxWidth;
  const height = Math.min(
    CANVAS_HEIGHT - PRESENTATION_UI.SAFE_Y * 2,
    contentHeight + PRESENTATION_UI.CARD_PADDING_Y * 2,
  );
  const x = Math.round((CANVAS_WIDTH - width) / 2);
  const y = Math.round((CANVAS_HEIGHT - height) / 2);
  const textStartY = y + Math.round((height - contentHeight) / 2);

  context.globalAlpha = alpha;
  context.fillStyle = "rgba(0, 0, 0, 0.64)";
  context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  context.fillStyle = "rgba(5, 9, 12, 0.94)";
  context.fillRect(x, y, width, height);
  context.strokeStyle = "#39484f";
  context.lineWidth = 2;
  context.strokeRect(x + 0.5, y + 0.5, width, height);
  context.fillStyle = "rgba(216, 193, 111, 0.34)";
  context.fillRect(x, y, width, 2);

  context.fillStyle = "#e0ddca";
  context.textBaseline = "top";
  wrapPresentationText(
    presentationState.cardTitle.toUpperCase(),
    x + PRESENTATION_UI.CARD_PADDING_X,
    textStartY,
    contentWidth,
    23,
    {
      font: PRESENTATION_UI.CARD_TITLE_FONT,
      maxLines: 2,
      align: "center",
      ellipsis: true,
    },
  );
  context.fillStyle = "#aebabc";
  wrapPresentationText(
    presentationState.cardBody,
    x + PRESENTATION_UI.CARD_PADDING_X,
    textStartY + titleMetrics.height + 14,
    contentWidth,
    15,
    {
      font: PRESENTATION_UI.BODY_FONT,
      maxLines: 2,
      align: "center",
      ellipsis: true,
    },
  );
  context.globalAlpha = 1;
}

function drawControlsColumn(x, y, title, lines) {
  context.fillStyle = "#d8c16f";
  context.font = "13px monospace";
  drawWrappedText(title, x, y, 198, 13, {
    maxLines: 1,
    ellipsis: true,
  });

  context.fillStyle = "#b8c3c5";
  context.font = "11px monospace";
  lines.forEach((line, index) => {
    drawWrappedText(line, x, y + 22 + index * 15, 198, 11, {
      maxLines: 1,
      ellipsis: true,
    });
  });
}

function drawInteractionPrompt() {
  if (
    shouldHideCaptureUi() ||
    !shouldShowInteractionPrompt() ||
    !interactionState.activeInteractable
  ) {
    return;
  }

  const prompt = formatText(TEXT_CONTENT.generalUI.interactionPromptTemplate, {
    prompt: getInteractablePrompt(interactionState.activeInteractable),
  });
  context.font = "15px monospace";
  const maxTextWidth = CANVAS_WIDTH - 80;
  const layout = measurePresentationText(prompt, maxTextWidth, 16, {
    maxLines: 2,
    ellipsis: true,
  });
  const textWidth = Math.min(
    maxTextWidth,
    Math.max(...layout.lines.map((line) => measureTextWidth(line, context.font)), 0),
  );
  const width = Math.ceil(textWidth) + 24;
  const height = layout.height + 16;
  const x = Math.round(clamp((CANVAS_WIDTH - width) / 2, 16, CANVAS_WIDTH - width - 16));
  const y = Math.round(CANVAS_HEIGHT - height - 24);

  context.fillStyle = "rgba(3, 5, 7, 0.82)";
  context.fillRect(x, y, width, height);
  context.fillStyle = "rgba(214, 203, 143, 0.38)";
  context.fillRect(x, y, width, 2);
  context.fillStyle = "#e0ddc8";
  context.textBaseline = "top";
  drawWrappedText(prompt, x + 12, y + 8, width - 24, 16, {
    align: "center",
    maxLines: 2,
    ellipsis: true,
  });
}

function drawJournalScreen() {
  if (!journalState.open) {
    return;
  }

  context.fillStyle = "rgba(0, 0, 0, 0.72)";
  context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  const panelX = 72;
  const panelY = 38;
  const panelWidth = 496;
  const panelHeight = 284;
  const objective = OBJECTIVE_DATA[objectiveState.currentId];

  context.fillStyle = "#0b1116";
  context.fillRect(panelX, panelY, panelWidth, panelHeight);
  context.strokeStyle = "#2d3b42";
  context.lineWidth = 2;
  context.strokeRect(panelX + 0.5, panelY + 0.5, panelWidth, panelHeight);

  context.fillStyle = "#d8d7c8";
  context.font = "20px monospace";
  context.textBaseline = "top";
  context.fillText(TEXT_CONTENT.generalUI.journal.title, panelX + 22, panelY + 18);

  context.font = "14px monospace";
  context.fillStyle = "#b8c3c5";
  context.fillText(TEXT_CONTENT.generalUI.journal.currentObjective, panelX + 24, panelY + 58);
  context.fillStyle = "#e2dbc4";
  drawWrappedText(objective.title, panelX + 24, panelY + 80, panelWidth - 48, 14, {
    maxLines: 2,
    ellipsis: true,
  });
  context.fillStyle = "#8fa0a4";
  context.font = "12px monospace";
  drawWrappedText(objective.detail, panelX + 24, panelY + 106, panelWidth - 48, 13, {
    maxLines: 2,
    ellipsis: true,
  });

  context.fillStyle = "#b8c3c5";
  context.font = "14px monospace";
  context.fillText(TEXT_CONTENT.generalUI.journal.collectedClues, panelX + 24, panelY + 142);

  const clueIds = Array.from(chapterProgress.clues);
  const cluesPerPage = 2;
  const pageCount = getJournalPageCount();
  const pageStart = journalState.cluePage * cluesPerPage;
  const visibleClues = clueIds.slice(pageStart, pageStart + cluesPerPage);

  context.font = "12px monospace";
  if (clueIds.length === 0) {
    context.fillStyle = "#65777b";
    context.fillText(TEXT_CONTENT.generalUI.journal.noClues, panelX + 24, panelY + 166);
  } else {
    visibleClues.forEach((clueId, index) => {
      const clue = getJournalClue(clueId);
      const y = panelY + 164 + index * 72;
      context.fillStyle = "#d0c8ad";
      drawWrappedText(clue.title, panelX + 24, y, panelWidth - 48, 12, {
        maxLines: 1,
        ellipsis: true,
      });
      context.fillStyle = "#7f9094";
      drawWrappedText(clue.text, panelX + 42, y + 14, panelWidth - 74, 13, {
        maxLines: 3,
        ellipsis: true,
      });
    });

  }

  context.fillStyle = "#68787c";
  context.font = "11px monospace";
  const pageText =
    pageCount > 1
      ? formatText(TEXT_CONTENT.generalUI.journal.pageTemplate, {
        page: journalState.cluePage + 1,
        pageCount,
        clueCount: clueIds.length,
      })
      : formatText(TEXT_CONTENT.generalUI.journal.clueCountTemplate, {
        clueCount: clueIds.length,
      });
  context.fillText(pageText, panelX + 24, panelY + panelHeight - 24);
  context.fillText(TEXT_CONTENT.generalUI.journal.closeHint, panelX + panelWidth - 132, panelY + panelHeight - 24);
}

function drawInspectOverlay() {
  if (!inspectOverlayState.active) {
    return;
  }

  context.fillStyle = "rgba(0, 0, 0, 0.66)";
  context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  const panelX = 112;
  const panelY = 82;
  const panelWidth = 416;
  const panelHeight = 168;

  context.fillStyle = "#080d11";
  context.fillRect(panelX, panelY, panelWidth, panelHeight);
  context.strokeStyle = "#39484f";
  context.lineWidth = 2;
  context.strokeRect(panelX + 0.5, panelY + 0.5, panelWidth, panelHeight);

  context.fillStyle = "rgba(216, 190, 104, 0.28)";
  context.fillRect(panelX, panelY, panelWidth, 2);
  context.fillStyle = "#d8d7c8";
  context.font = "16px monospace";
  context.textBaseline = "top";
  const titleLayout = drawWrappedText(
    inspectOverlayState.title,
    panelX + 18,
    panelY + 18,
    panelWidth - 36,
    17,
    {
      maxLines: 2,
      ellipsis: true,
    },
  );

  context.fillStyle = "#aab7ba";
  context.font = "13px monospace";
  drawWrappedText(
    inspectOverlayState.text,
    panelX + 20,
    panelY + 52 + Math.max(0, titleLayout.lines.length - 1) * 17,
    panelWidth - 40,
    17,
    {
      maxLines: titleLayout.lines.length > 1 ? 4 : 5,
      ellipsis: true,
    },
  );

  if (inspectOverlayState.clueId) {
    context.fillStyle = "#756f4a";
    context.font = "11px monospace";
    context.fillText(TEXT_CONTENT.generalUI.inspect.copiedToJournal, panelX + 20, panelY + panelHeight - 25);
  }

  context.fillStyle = "#68787c";
  context.font = "11px monospace";
  context.fillText(TEXT_CONTENT.generalUI.inspect.closeHint, panelX + panelWidth - 124, panelY + panelHeight - 25);
}

function drawTransitionOverlay() {
  if (!transitionState.active) {
    return;
  }

  const progress = clamp(transitionState.timer / transitionState.duration, 0, 1);
  const alpha = transitionState.phase === "fadeOut" ? progress : 1 - progress;

  context.fillStyle = `rgba(0, 0, 0, ${alpha})`;
  context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function drawAudioUnlockPrompt() {
  const status = audioManager.getStatus();

  if (!status.available || status.unlocked || shouldHideCaptureUi()) {
    return;
  }

  const text = TEXT_CONTENT.generalUI.audio.unlockPrompt;
  context.font = "12px monospace";
  const maxTextWidth = CANVAS_WIDTH - 96;
  const layout = measurePresentationText(text, maxTextWidth, 13, {
    maxLines: 2,
    ellipsis: true,
  });
  const textWidth = Math.min(
    maxTextWidth,
    Math.max(...layout.lines.map((line) => measureTextWidth(line, context.font)), 0),
  );
  const width = Math.ceil(textWidth) + 28;
  const height = layout.height + 16;
  const x = Math.round((CANVAS_WIDTH - width) / 2);
  const y = 18;

  context.fillStyle = "rgba(3, 6, 9, 0.86)";
  context.fillRect(x, y, width, height);
  context.strokeStyle = "#38484f";
  context.lineWidth = 1;
  context.strokeRect(x + 0.5, y + 0.5, width, height);
  context.fillStyle = "#d8c16f";
  context.textBaseline = "top";
  drawWrappedText(text, x + 14, y + 8, width - 28, 13, {
    align: "center",
    maxLines: 2,
    ellipsis: true,
  });
}

function drawKeypadScreen() {
  if (!keypadState.active) {
    return;
  }

  context.fillStyle = "rgba(0, 0, 0, 0.72)";
  context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  const x = 218;
  const y = 54;
  const width = 204;
  const height = 254;

  context.fillStyle = "#070b0f";
  context.fillRect(x, y, width, height);
  context.strokeStyle = "#34464d";
  context.lineWidth = 2;
  context.strokeRect(x + 0.5, y + 0.5, width, height);

  context.fillStyle = "#b8c9bd";
  context.font = "16px monospace";
  context.textBaseline = "top";
  context.fillText(TEXT_CONTENT.corridor.keypad.title, x + 32, y + 18);

  context.fillStyle = "#10191e";
  context.fillRect(x + 34, y + 52, 136, 36);
  context.fillStyle = chapterProgress.archiveDoorUnlocked ? "#d7c56d" : "#9fb28d";
  context.font = "24px monospace";
  context.fillText(getKeypadDisplayText(), x + 54, y + 58);

  drawKeypadButtons(x + 48, y + 108);

  context.fillStyle = keypadState.messageTimer > 0 ? "#d8c16f" : "#68787c";
  context.font = "12px monospace";
  drawWrappedText(
    keypadState.message || TEXT_CONTENT.corridor.keypad.defaultHint,
    x + 22,
    y + 220,
    width - 44,
    13,
    {
      maxLines: 2,
      ellipsis: true,
    },
  );
}

function drawKeypadButtons(x, y) {
  const labels = TEXT_CONTENT.corridor.keypad.buttons;

  labels.forEach((label, index) => {
    const column = index % 3;
    const row = Math.floor(index / 3);
    const buttonX = x + column * 38;
    const buttonY = y + row * 26;

    context.fillStyle = "#151d23";
    context.fillRect(buttonX, buttonY, 28, 18);
    context.fillStyle = "#53646a";
    context.fillRect(buttonX, buttonY, 28, 2);
    context.fillStyle = "#d8d7c8";
    context.font = "12px monospace";
    context.textBaseline = "top";
    context.fillText(label, buttonX + 8, buttonY + 4);
  });
}

function getKeypadDisplayText() {
  return keypadState.enteredCode.padEnd(4, "_").split("").join(" ");
}

function drawDialoguePanel() {
  if (!dialogueState.active) {
    return;
  }

  const line = getCurrentDialogueLine();
  const visibleText = line.text.slice(0, Math.floor(dialogueState.visibleCharacters));
  const panelX = 34;
  const panelY = 244;
  const panelWidth = 572;
  const panelHeight = 92;

  context.fillStyle = "rgba(3, 6, 9, 0.9)";
  context.fillRect(panelX, panelY, panelWidth, panelHeight);
  context.strokeStyle = line.thought ? "#566169" : "#3d4f57";
  context.lineWidth = 2;
  context.strokeRect(panelX + 0.5, panelY + 0.5, panelWidth, panelHeight);
  context.fillStyle = line.thought ? "#9ba9ad" : "#d8d7c8";
  context.font = line.thought ? "italic 15px monospace" : "15px monospace";
  context.textBaseline = "top";
  drawWrappedText(line.speaker, panelX + 18, panelY + 12, panelWidth - 118, 15, {
    maxLines: 1,
    ellipsis: true,
  });

  context.fillStyle = line.thought ? "#aab7ba" : "#e1ddca";
  context.font = line.thought ? "italic 14px monospace" : "14px monospace";
  drawWrappedText(visibleText, panelX + 18, panelY + 36, panelWidth - 36, 17, {
    maxLines: 3,
    ellipsis: true,
  });

  context.fillStyle = "#68787c";
  context.font = "11px monospace";
  drawWrappedText(TEXT_CONTENT.generalUI.dialogue.advanceHint, panelX + panelWidth - 118, panelY + panelHeight - 18, 100, 11, {
    align: "right",
    maxLines: 1,
    ellipsis: true,
  });
}

function drawCollisionBoxes(target, view) {
  const x = Math.round(target.x - view.x);
  const y = Math.round(target.y);
  const world = getCurrentWorld();
  const leftBoundary = Math.round(world.PLAYER_LEFT_BOUNDARY - view.x);
  const rightBoundary = Math.round(world.PLAYER_RIGHT_BOUNDARY - view.x);

  context.strokeStyle = "#61ff9b";
  context.lineWidth = 2;
  context.strokeRect(x + 0.5, y + 0.5, target.width, target.height);

  context.fillStyle = "rgba(97, 255, 155, 0.7)";
  context.fillRect(leftBoundary, GROUND_Y - 56, 2, 56);
  context.fillRect(rightBoundary, GROUND_Y - 56, 2, 56);

  INTERACTABLE_DEFINITIONS.forEach((definition) => {
    const scene = definition.scene ?? GAME_STATES.CORRIDOR;

    if (scene !== gameState.current || !isInteractableAvailable(definition)) {
      return;
    }

    const boxX = Math.round(getInteractableX(definition) - view.x);
    const boxY = Math.round(definition.y ?? GROUND_Y - definition.height);

    context.strokeStyle = "#d8c16f";
    context.strokeRect(boxX + 0.5, boxY + 0.5, definition.width, definition.height);
  });
}

function drawMissingPersonsWing(view, scene) {
  const viewX = view.x;
  context.fillStyle = "#05080a";
  context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  context.fillStyle = "#152026";
  context.fillRect(0, 64, CANVAS_WIDTH, GROUND_Y - 64);
  context.fillStyle = "#1a120f";
  context.fillRect(0, GROUND_Y, CANVAS_WIDTH, CANVAS_HEIGHT - GROUND_Y);

  for (let worldX = 0; worldX < RECORDS_WORLD.WIDTH; worldX += 190) {
    const x = Math.round(worldX - viewX);
    context.fillStyle = "#080d10";
    context.fillRect(x, 74, 126, 202);
    context.strokeStyle = "#2b3a40";
    context.strokeRect(x + 0.5, 74.5, 126, 202);
  }

  const exitX = Math.round(RECORDS_WORLD.ENTRANCE_X - viewX);
  context.fillStyle = "#070a0c";
  context.fillRect(exitX, 166, 70, 126);
  context.strokeStyle = "#46565b";
  context.strokeRect(exitX + 0.5, 166.5, 70, 126);

  MISSING_PERSON_CASES.forEach((caseData) => {
    const x = Math.round(caseData.x - viewX);
    const solved = recordsProgress.solvedCases.has(caseData.id);
    context.fillStyle = solved ? "#172c26" : "#171b1b";
    context.fillRect(x, 132, 112, 150);
    context.strokeStyle = solved ? "#5a9872" : "#5b5144";
    context.strokeRect(x + 0.5, 132.5, 112, 150);
    context.fillStyle = "#bbb49d";
    context.fillRect(x + 14, 150, 40, 48);
    context.fillStyle = "#25282a";
    context.fillRect(x + 25, 158, 18, 25);
    context.fillStyle = "#d0c8ad";
    context.font = "10px monospace";
    drawWrappedText(caseData.name.toUpperCase(), x + 10, 210, 92, 10, {
      maxLines: 1,
      ellipsis: true,
    });
    context.fillStyle = "#7f9094";
    context.font = "8px monospace";
    drawWrappedText(caseData.role.toUpperCase(), x + 10, 226, 92, 9, {
      maxLines: 2,
      ellipsis: true,
    });
    drawWrappedText(
      solved
        ? TEXT_CONTENT.recordsWing.labels.contradictionCaptured
        : TEXT_CONTENT.recordsWing.labels.fileAltered,
      x + 10,
      250,
      92,
      9,
      {
        maxLines: 2,
        ellipsis: true,
      },
    );
  });

  context.fillStyle = "rgba(3, 5, 7, 0.78)";
  context.fillRect(18, 18, 322, 34);
  context.fillStyle = "#c7c1aa";
  context.font = "11px monospace";
  context.fillText(TEXT_CONTENT.recordsWing.labels.sceneTitle, 34, 29);
  drawVignette();
  drawFilmGrain(scene);
}

function getMissingPersonRecordRect(index) {
  return { x: 112, y: 150 + index * 38, width: 416, height: 34 };
}

function drawMissingPersonCaseOverlay() {
  if (recordsProgress.activeCaseId === null) {
    return;
  }

  const caseData = getMissingPersonCase(recordsProgress.activeCaseId);
  if (!caseData) return;

  context.fillStyle = "rgba(0, 0, 0, 0.78)";
  context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  context.fillStyle = "#0b1114";
  context.fillRect(70, 34, 500, 292);
  context.strokeStyle = recordsProgress.errorTimer > 0 ? "#b6473f" : "#42545b";
  context.lineWidth = recordsProgress.errorTimer > 0 ? 4 : 2;
  context.strokeRect(70.5, 34.5, 500, 292);
  context.fillStyle = "#e0ddca";
  context.font = "19px monospace";
  drawWrappedText(caseData.name.toUpperCase(), 94, 54, 452, 20, {
    maxLines: 1,
    ellipsis: true,
  });
  context.fillStyle = "#9eaaac";
  context.font = "11px monospace";
  drawWrappedText(caseData.role, 96, 82, 448, 12, {
    maxLines: 1,
    ellipsis: true,
  });
  drawWrappedText(TEXT_CONTENT.recordsWing.overlay.instruction, 96, 112, 448, 12, {
    maxLines: 1,
    ellipsis: true,
  });

  caseData.records.forEach((record, index) => {
    const rect = getMissingPersonRecordRect(index);
    const selected = recordsProgress.selectedRecordIndex === index;
    context.fillStyle = selected ? "#28383e" : "#11191d";
    context.fillRect(rect.x, rect.y, rect.width, rect.height);
    context.strokeStyle = selected ? "#d8c16f" : "#314047";
    context.strokeRect(rect.x + 0.5, rect.y + 0.5, rect.width, rect.height);
    context.fillStyle = selected ? "#e2dbc4" : "#9ba9ab";
    context.font = "10px monospace";
    drawWrappedText(record, rect.x + 10, rect.y + 7, rect.width - 20, 11, {
      maxLines: 2,
      ellipsis: true,
    });
  });

  context.fillStyle = recordsProgress.errorTimer > 0 ? "#d35c51" : "#68787c";
  context.font = "10px monospace";
  drawWrappedText(
    recordsProgress.errorTimer > 0
      ? TEXT_CONTENT.recordsWing.labels.contradictionNotProven
      : TEXT_CONTENT.recordsWing.overlay.controls,
    118,
    306,
    404,
    10,
    {
      align: "center",
      maxLines: 1,
      ellipsis: true,
    },
  );
  if (recordsProgress.errorTimer > 0) {
    context.fillStyle = "rgba(180, 28, 22, 0.16)";
    context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }
}

function drawUncataloguedClassroom(view, scene) {
  const viewX = view.x;
  context.fillStyle = "#050708";
  context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  context.fillStyle = "#182024";
  context.fillRect(0, 62, CANVAS_WIDTH, GROUND_Y - 62);
  context.fillStyle = "#211711";
  context.fillRect(0, GROUND_Y, CANVAS_WIDTH, CANVAS_HEIGHT - GROUND_Y);

  const boardX = 330 - viewX;
  context.fillStyle = "#111c19";
  context.fillRect(boardX, 84, 250, 86);
  context.strokeStyle = "#505549";
  context.strokeRect(boardX + 0.5, 84.5, 250, 86);
  context.fillStyle = "#a8aa91";
  context.font = "13px monospace";
  context.fillText(String(2079 + classroomProgress.occupants * 2), boardX + 96, 110);
  context.font = "9px monospace";
  context.fillText(TEXT_CONTENT.distortedArchive.classroom.attendanceBoard, boardX + 30, 140);

  for (let index = 0; index < 8; index += 1) {
    const worldX = 190 + index * 88;
    const x = worldX - viewX;
    context.fillStyle = "#352a21";
    context.fillRect(x, 232, 54, 8);
    context.fillRect(x + 8, 240, 4, 34);
    context.fillRect(x + 42, 240, 4, 34);
    if (index < classroomProgress.occupants) {
      context.fillStyle = "#030405";
      context.fillRect(x + 18, 190, 20, 42);
      context.beginPath();
      context.arc(x + 28, 184, 10, 0, Math.PI * 2);
      context.fill();
    }
  }

  const exitX = CLASSROOM_WORLD.ENTRANCE_X - viewX;
  context.fillStyle = "#080a0b";
  context.fillRect(exitX, 164, 70, 128);
  const registerX = 790 - viewX;
  context.fillStyle = classroomProgress.completed ? "#c9bb78" : "#898270";
  context.fillRect(registerX, 228, 76, 38);
  context.fillStyle = "#1a1712";
  context.font = "8px monospace";
  context.fillText(TEXT_CONTENT.distortedArchive.classroom.register, registerX + 14, 242);

  if (classroomProgress.completed) {
    context.fillStyle = "rgba(3, 5, 7, 0.82)";
    context.fillRect(188, 20, 264, 28);
    context.fillStyle = "#d8c16f";
    context.font = "11px monospace";
    context.fillText(TEXT_CONTENT.distortedArchive.classroom.explorerPresent, 244, 29);
  }
  drawVignette();
  drawFilmGrain(scene);
}

function drawPrologueScene(view, scene) {
  context.fillStyle = "#020304";
  context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  const buildingX = Math.round(250 - view.x * 0.35);
  context.fillStyle = "#080b0d";
  context.fillRect(buildingX, 70, 650, 222);
  context.fillStyle = "#11181c";
  context.fillRect(buildingX + 40, 104, 570, 188);
  context.fillStyle = "#020405";
  for (let column = 0; column < 7; column += 1) {
    context.fillRect(buildingX + 72 + column * 74, 130, 38, 62);
  }
  const entranceX = Math.round(PROLOGUE_WORLD.ENTRANCE_X - view.x);
  context.fillStyle = "#020303";
  context.fillRect(entranceX, 154, 72, 138);
  context.strokeStyle = "#3d4648";
  context.strokeRect(entranceX + 0.5, 154.5, 72, 138);
  context.fillStyle = "#17110d";
  context.fillRect(0, GROUND_Y, CANVAS_WIDTH, CANVAS_HEIGHT - GROUND_Y);
  context.fillStyle = "rgba(174, 189, 194, 0.08)";
  context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  drawVignette();
  drawFilmGrain(scene);

  if (!prologueProgress.controlGranted) {
    context.fillStyle = "rgba(0, 0, 0, 0.68)";
    context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    const text = getPrologueText(prologueProgress.timer);
    if (text) {
      context.fillStyle = "#d8d7c8";
      context.font = prologueProgress.timer < 3 ? "24px monospace" : "15px monospace";
      context.textBaseline = "top";
      drawWrappedText(text, 40, 142, CANVAS_WIDTH - 80, 18, {
        align: "center",
        maxLines: prologueProgress.timer < 3 ? 1 : 3,
        ellipsis: true,
      });
    }
    if (prologueProgress.timer >= 3) {
      context.fillStyle = "#59696d";
      context.font = "10px monospace";
      drawWrappedText(TEXT_CONTENT.opening.skipHint, 176, 326, 288, 10, {
        align: "center",
        maxLines: 1,
        ellipsis: true,
      });
    }
  } else {
    context.fillStyle = "rgba(3, 5, 7, 0.76)";
    context.fillRect(136, 24, 368, 28);
    context.fillStyle = "#b8c3c5";
    context.font = "11px monospace";
    drawWrappedText(TEXT_CONTENT.opening.serviceEntranceHint, 152, 32, 336, 11, {
      align: "center",
      maxLines: 1,
      ellipsis: true,
    });
  }
}

function getPrologueText(time) {
  const lines = TEXT_CONTENT.opening.prologueLines;
  if (time < 3) return lines[0];
  if (time < 6) return lines[1];
  if (time < 9) return lines[2];
  if (time < 12) return lines[3];
  if (time < 15) return lines[4];
  if (time < 18) return lines[5];
  if (time < 24) return lines[6];
  return "";
}

function drawEscapeScene(view, scene) {
  const viewX = view.x;
  context.fillStyle = "#030506";
  context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  context.fillStyle = "#131c20";
  context.fillRect(0, 58, CANVAS_WIDTH, GROUND_Y - 58);
  context.fillStyle = "#211713";
  context.fillRect(0, GROUND_Y, CANVAS_WIDTH, CANVAS_HEIGHT - GROUND_Y);

  for (let worldX = 0; worldX < ESCAPE_WORLD.WIDTH; worldX += 220) {
    const x = Math.round(worldX - viewX);
    if (x < -100 || x > CANVAS_WIDTH + 100) continue;
    context.fillStyle = "#070a0c";
    context.fillRect(x, 76, 34, 216);
    context.fillStyle = "#34434a";
    context.fillRect(x + 8, 82, 5, 198);
  }

  for (let index = 0; index < 14; index += 1) {
    const worldX = 360 + index * 278;
    const x = Math.round(worldX - viewX);
    if (x < -90 || x > CANVAS_WIDTH + 90) continue;
    const pulse = Math.sin(scene.time * 2.2 + index) > 0.45;
    context.fillStyle = pulse ? "rgba(157, 67, 52, 0.34)" : "rgba(75, 45, 39, 0.18)";
    context.fillRect(x - 34, GROUND_Y - 8, 84, 8);
    context.fillStyle = "#15100d";
    context.fillRect(x, 78 + (index % 3) * 24, 28, 52);
  }

  for (const debris of escapeProgress.debris) {
    if (
      debris.resolved ||
      debris.timer < 0 ||
      (debris.hardOnly && escapeProgress.cameraChoice !== "keep")
    ) {
      continue;
    }
    const x = Math.round(debris.x - viewX);
    if (x < -100 || x > CANVAS_WIDTH + 100) continue;
    if (debris.timer > 0) {
      context.fillStyle = "rgba(193, 49, 39, 0.5)";
      context.fillRect(x - 52, GROUND_Y - 10, 104, 10);
      context.fillStyle = "#c94a40";
      context.font = "9px monospace";
      context.fillText(TEXT_CONTENT.escape.labels.falling, x - 22, GROUND_Y - 27);
    } else if (debris.active > 0) {
      context.fillStyle = "#211612";
      fillPolygon([
        [x - 48, 74],
        [x - 8, 74],
        [x + 36, GROUND_Y],
        [x - 34, GROUND_Y],
      ]);
    }
  }

  const collapseX = Math.round(1660 - viewX);
  if (!escapeProgress.detourCompleted && collapseX > -180 && collapseX < CANVAS_WIDTH + 180) {
    context.fillStyle = "#130d0b";
    context.fillRect(collapseX, 106, 430, 186);
    context.fillStyle = "#392820";
    for (let index = 0; index < 8; index += 1) {
      context.fillRect(collapseX + index * 52, 112 + (index % 3) * 42, 66, 20);
    }
    context.fillStyle = "#29363b";
    context.fillRect(collapseX - 120, 164, 570, 10);
    context.fillStyle = "#849196";
    context.font = "9px monospace";
    context.fillText(TEXT_CONTENT.escape.labels.serviceBypass, collapseX - 104, 148);
  }

  const cameraX = Math.round(3260 - viewX);
  if (escapeProgress.cameraChoice === null && cameraX > -80 && cameraX < CANVAS_WIDTH + 80) {
    context.fillStyle = "#77705e";
    context.fillRect(cameraX, GROUND_Y - 12, 24, 12);
    context.fillStyle = "#17191a";
    context.fillRect(cameraX + 7, GROUND_Y - 9, 8, 6);
  }

  const exitX = Math.round(ESCAPE_WORLD.EXIT_X - viewX);
  if (exitX > -120 && exitX < CANVAS_WIDTH + 120) {
    context.fillStyle = "rgba(211, 220, 194, 0.22)";
    fillPolygon([
      [exitX - 30, 60],
      [exitX + 70, 60],
      [exitX + 180, GROUND_Y],
      [exitX - 110, GROUND_Y],
    ]);
    context.fillStyle = "#d5d6bd";
    context.fillRect(exitX, 128, 70, 164);
  }
  drawVignette();
  drawFilmGrain(scene);
}

function drawEscapeGameplayUi() {
  if (escapeProgress.messageTimer > 0 && escapeProgress.message) {
    context.fillStyle = "rgba(3, 5, 7, 0.88)";
    context.fillRect(120, 82, 400, 42);
    context.fillStyle = "#d0c8ad";
    context.font = "11px monospace";
    drawWrappedText(escapeProgress.message, 134, 94, 372, 13);
  }

  if (!escapeProgress.cameraChoiceActive) {
    return;
  }

  context.fillStyle = "rgba(0, 0, 0, 0.82)";
  context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  context.fillStyle = "#0b1114";
  context.fillRect(112, 54, 416, 250);
  context.strokeStyle = "#46575d";
  context.strokeRect(112.5, 54.5, 416, 250);
  context.fillStyle = "#e0ddca";
  context.font = "18px monospace";
  drawWrappedText(TEXT_CONTENT.escape.cameraChoice.title, 132, 74, 376, 19, {
    align: "center",
    maxLines: 2,
    ellipsis: true,
  });
  context.fillStyle = "#91a0a3";
  context.font = "10px monospace";
  drawWrappedText(TEXT_CONTENT.escape.cameraChoice.description, 132, 112, 376, 12, {
    align: "center",
    maxLines: 3,
    ellipsis: true,
  });

  const options = [
    [TEXT_CONTENT.escape.cameraChoice.keepLabel, TEXT_CONTENT.escape.cameraChoice.keepDetail],
    [TEXT_CONTENT.escape.cameraChoice.dropLabel, TEXT_CONTENT.escape.cameraChoice.dropDetail],
  ];
  options.forEach(([label, detail], index) => {
    const rect = getEscapeCameraChoiceRect(index);
    const selected = escapeProgress.cameraChoiceIndex === index;
    context.fillStyle = selected ? "#28383e" : "#11191d";
    context.fillRect(rect.x, rect.y, rect.width, rect.height);
    context.strokeStyle = selected ? "#d8c16f" : "#314047";
    context.strokeRect(rect.x + 0.5, rect.y + 0.5, rect.width, rect.height);
    context.fillStyle = selected ? "#e2dbc4" : "#a1adaf";
    context.font = "11px monospace";
    drawWrappedText(label, rect.x + 12, rect.y + 6, rect.width - 24, 11, {
      maxLines: 1,
      ellipsis: true,
    });
    context.fillStyle = "#728286";
    context.font = "8px monospace";
    drawWrappedText(detail, rect.x + 12, rect.y + 22, rect.width - 24, 9, {
      maxLines: 1,
      ellipsis: true,
    });
  });
  context.fillStyle = "#68787c";
  context.font = "9px monospace";
  drawWrappedText(TEXT_CONTENT.escape.cameraChoice.controls, 144, 286, 352, 9, {
    align: "center",
    maxLines: 1,
    ellipsis: true,
  });
}

function drawEscapeReveal(scene) {
  const time = escapeProgress.revealTimer;
  context.fillStyle = time < 5 ? "#d0c9ab" : "#050708";
  context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  drawFilmGrain(scene);
  context.textBaseline = "top";

  if (time < 4) {
    context.fillStyle = "#202629";
    context.font = "15px monospace";
    drawWrappedText(TEXT_CONTENT.escape.reveal.morningLight, 80, 154, 480, 17, {
      align: "center",
      maxLines: 2,
      ellipsis: true,
    });
    return;
  }
  if (time < 8) {
    context.fillStyle = "#d8d7c8";
    context.font = "14px monospace";
    drawWrappedText(
      escapeProgress.evidencePreserved
        ? TEXT_CONTENT.escape.reveal.evidenceUpload
        : TEXT_CONTENT.escape.reveal.leftCamera,
      80,
      128,
      480,
      16,
      {
        align: "center",
        maxLines: 2,
        ellipsis: true,
      },
    );
    context.fillStyle = "#839296";
    context.font = "11px monospace";
    drawWrappedText(
      escapeProgress.evidencePreserved
        ? TEXT_CONTENT.escape.reveal.survivingImage
        : TEXT_CONTENT.escape.reveal.phoneImage,
      80,
      164,
      480,
      13,
      {
        align: "center",
        maxLines: 2,
        ellipsis: true,
      },
    );
    drawWrappedText(TEXT_CONTENT.escape.reveal.didNotTakeIt, 80, 196, 480, 13, {
      align: "center",
      maxLines: 1,
      ellipsis: true,
    });
    return;
  }

  context.fillStyle = "#d8d7c8";
  context.font = "17px monospace";
  drawWrappedText(TEXT_CONTENT.escape.reveal.newEntry, 80, 78, 480, 18, {
    align: "center",
    maxLines: 1,
    ellipsis: true,
  });
  context.fillStyle = "#aebabc";
  context.font = "13px monospace";
  drawWrappedText(TEXT_CONTENT.escape.reveal.subjectExplorer, 80, 130, 480, 14, {
    align: "center",
    maxLines: 1,
    ellipsis: true,
  });
  context.fillStyle = "#c6ad61";
  drawWrappedText(TEXT_CONTENT.escape.reveal.statusReleased, 80, 158, 480, 14, {
    align: "center",
    maxLines: 1,
    ellipsis: true,
  });
  drawWrappedText(TEXT_CONTENT.escape.reveal.observationContinuing, 80, 184, 480, 14, {
    align: "center",
    maxLines: 1,
    ellipsis: true,
  });
  if (escapeProgress.evidencePreserved) {
    context.fillStyle = "#75b68b";
    drawWrappedText(TEXT_CONTENT.escape.reveal.evidenceDistributed, 80, 208, 480, 14, {
      align: "center",
      maxLines: 1,
      ellipsis: true,
    });
  }
  if (classroomProgress.completed) {
    context.fillStyle = "#8d7eae";
    drawWrappedText(TEXT_CONTENT.escape.reveal.attendanceOpen, 80, 226, 480, 14, {
      align: "center",
      maxLines: 1,
      ellipsis: true,
    });
  }

  if (time >= 14) {
    context.fillStyle = "#d8d7c8";
    context.font = "12px monospace";
    drawWrappedText(TEXT_CONTENT.escape.reveal.madeItOut, 80, classroomProgress.completed ? 250 : 238, 480, 13, {
      align: "center",
      maxLines: 1,
      ellipsis: true,
    });
    drawWrappedText(
      TEXT_CONTENT.escape.reveal.archiveDidNotLetGo,
      80,
      classroomProgress.completed ? 270 : 260,
      480,
      13,
      {
        align: "center",
        maxLines: 2,
        ellipsis: true,
      },
    );
  }
}

function drawCircuitPuzzle() {
  if (!circuitPuzzleState.active) {
    return;
  }

  context.fillStyle = "rgba(0, 0, 0, 0.78)";
  context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  context.fillStyle = "#080d10";
  context.fillRect(72, 48, 496, 264);
  context.strokeStyle = circuitPuzzleState.flickerTimer > 0 ? "#9a543f" : "#35464d";
  context.lineWidth = 2;
  context.strokeRect(72.5, 48.5, 496, 264);
  context.fillStyle = "#d8d7c8";
  context.font = "19px monospace";
  drawWrappedText(TEXT_CONTENT.corridor.breaker.title, 96, 70, 448, 20, {
    align: "center",
    maxLines: 1,
    ellipsis: true,
  });
  context.fillStyle = "#7f9094";
  context.font = "11px monospace";
  drawWrappedText(TEXT_CONTENT.corridor.breaker.hint, 96, 99, 448, 12, {
    align: "center",
    maxLines: 2,
    ellipsis: true,
  });

  CIRCUIT_SEQUENCE.forEach((switchId, index) => {
    const rect = getCircuitSwitchRect(index);
    const active = circuitPuzzleState.sequence.includes(switchId);
    context.fillStyle = active ? "#263e35" : "#11191e";
    context.fillRect(rect.x, rect.y, rect.width, rect.height);
    context.strokeStyle = active ? "#d8c16f" : "#3b4a50";
    context.strokeRect(rect.x + 0.5, rect.y + 0.5, rect.width, rect.height);
    context.fillStyle = active ? "#d8c16f" : "#a8b4b6";
    context.font = "10px monospace";
    context.fillText(TEXT_CONTENT.corridor.breaker.switchLabels[switchId], rect.x + 8, rect.y + 12);
    context.fillRect(rect.x + 35, rect.y + 38, 12, 30);
    context.fillStyle = active ? "#c9b660" : "#2b3438";
    context.fillRect(rect.x + 38, active ? rect.y + 32 : rect.y + 57, 6, 10);
  });

  for (let index = 0; index < 3; index += 1) {
    context.fillStyle =
      circuitPuzzleState.sequence.length > index ? "#d8c16f" : "#253238";
    context.fillRect(254 + index * 42, 242, 24, 8);
  }

  context.fillStyle = "#aab7ba";
  context.font = "11px monospace";
  drawWrappedText(circuitPuzzleState.message, 100, 270, 390, 14);
  context.fillStyle = "#65777b";
  drawWrappedText(TEXT_CONTENT.corridor.breaker.closeHint, 340, 291, 204, 11, {
    align: "right",
    maxLines: 1,
    ellipsis: true,
  });
}

function drawChamberRingScene() {
  context.fillStyle = "#020405";
  context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  const pulse = chamberRingProgress.rejectionTimer > 0
    ? 0.18 + chamberRingProgress.rejectionTimer * 0.24
    : 0.08;
  context.fillStyle = `rgba(150, 68, 49, ${pulse})`;
  context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  context.fillStyle = "#17130f";
  context.fillRect(42, 40, 354, 282);
  context.strokeStyle = "#665a40";
  context.lineWidth = 3;
  context.strokeRect(42.5, 40.5, 354, 282);

  context.strokeStyle = "#6c6044";
  context.lineWidth = 18;
  context.beginPath();
  context.arc(224, 171, 112, 0, Math.PI * 2);
  context.stroke();
  context.lineWidth = 10;
  context.strokeStyle = "#25211a";
  context.beginPath();
  context.arc(224, 171, 76, 0, Math.PI * 2);
  context.stroke();

  ARCHIVE_SYMBOL_PATTERN.forEach((_, index) => {
    const rect = getChamberRingSectionRect(index);
    const selected = chamberRingProgress.selectedSection === index;
    context.fillStyle = selected ? "#202b31" : "#0f171b";
    context.fillRect(rect.x, rect.y, rect.width, rect.height);
    context.strokeStyle = selected ? "#d8c16f" : "#34464d";
    context.lineWidth = 2;
    context.strokeRect(rect.x + 0.5, rect.y + 0.5, rect.width, rect.height);
    const symbolId = ARCHIVE_SYMBOL_PATTERN[chamberRingProgress.symbols[index]];
    drawOriginalSymbol(symbolId, rect.x + 34, rect.y + 18, 1.25, selected);
  });

  context.fillStyle = "#080d10";
  context.fillRect(420, 40, 198, 282);
  context.strokeStyle = "#303f45";
  context.strokeRect(420.5, 40.5, 198, 282);
  context.fillStyle = "#d8d7c8";
  context.font = "17px monospace";
  drawWrappedText(TEXT_CONTENT.archivist.chamber.lockTitle, 438, 62, 164, 18, {
    maxLines: 2,
    ellipsis: true,
  });
  context.fillStyle = "#8fa0a4";
  context.font = "11px monospace";
  drawWrappedText(
    TEXT_CONTENT.archivist.chamber.lockDescription,
    438,
    94,
    164,
    14,
  );
  context.fillStyle = "#66777b";
  context.font = "10px monospace";
  drawWrappedText(TEXT_CONTENT.archivist.chamber.journalHint, 438, 180, 164, 11, {
    maxLines: 2,
    ellipsis: true,
  });
  drawButton(getChamberRingRotateRect(-1), TEXT_CONTENT.archivist.chamber.symbolMinus);
  drawButton(getChamberRingRotateRect(1), TEXT_CONTENT.archivist.chamber.symbolPlus);
  drawButton(getChamberRingEngageRect(), TEXT_CONTENT.archivist.chamber.engageMechanism);

  if (chamberRingProgress.messageTimer > 0) {
    context.fillStyle = "#c9b660";
    context.font = "10px monospace";
    drawWrappedText(chamberRingProgress.message, 438, 198, 164, 12);
  }
}

function drawLegacyArchivistChamberScene(view, scene) {
  const viewX = view.x;
  const dim = archivistProgress.interferenceActive ? 0.34 : 1;
  context.fillStyle = "#020304";
  context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  context.fillStyle = "#10171b";
  context.fillRect(0, 56, CANVAS_WIDTH, GROUND_Y - 56);
  context.fillStyle = "#17110e";
  context.fillRect(0, GROUND_Y, CANVAS_WIDTH, CANVAS_HEIGHT - GROUND_Y);

  for (let x = -(viewX % 120); x < CANVAS_WIDTH + 120; x += 120) {
    context.fillStyle = "#080c0f";
    context.fillRect(x, 70, 88, 184);
    context.strokeStyle = "#26343a";
    context.strokeRect(x + 0.5, 70.5, 88, 184);
    context.fillStyle = "#59696d";
    for (let row = 0; row < 7; row += 1) {
      context.fillRect(x + 10, 86 + row * 23, 54 + ((row * 13) % 18), 2);
    }
  }

  context.globalAlpha = dim;
  if (archivistProgress.bossPhase === 1) {
    ARCHIVIST_CHAMBER.NODES.forEach((worldX, index) => {
      const x = Math.round(worldX - viewX);
      if (archivistProgress.corruptedNodesDisabled.has(index)) {
        context.fillStyle = "#17201c";
        context.fillRect(x, 210, 56, 62);
        return;
      }
      context.fillStyle = "#251416";
      context.fillRect(x, 180, 56, 92);
      context.strokeStyle = "#8b4f47";
      context.strokeRect(x + 0.5, 180.5, 56, 92);
      context.fillStyle = "#b07060";
      context.font = "9px monospace";
      drawWrappedText(TEXT_CONTENT.boss.ui.updating, x + 6, 192, 44, 9, {
        align: "center",
        maxLines: 1,
        ellipsis: true,
      });
      drawOriginalSymbol(ARCHIVE_SYMBOL_PATTERN[index], x + 17, 222, 1, true);
    });
    drawArchivistFigure(archivistProgress.archivistX - viewX, 154, true, scene.time);
  } else if (archivistProgress.bossPhase === 2) {
    ARCHIVIST_CHAMBER.COPIES.forEach((worldX, index) => {
      const isReal = index === archivistProgress.realCopyIndex;
      drawArchivistFigure(worldX - viewX, 154, isReal, scene.time + index);
      if (scene.flashlightOn) {
        const sequence = isReal ? [0, 1, 2, 3] : [index, 3, 1];
        sequence.forEach((symbolIndex, symbolPosition) => {
          drawOriginalSymbol(
            ARCHIVE_SYMBOL_PATTERN[symbolIndex],
            worldX - viewX - 22 + symbolPosition * 18,
            126,
            0.58,
            isReal,
          );
        });
      }
    });
  } else if (archivistProgress.bossPhase === 3) {
    ARCHIVIST_CHAMBER.CONTROLS.forEach((worldX, index) => {
      const x = Math.round(worldX - viewX);
      const active = archivistProgress.finalSequence.includes(index);
      context.fillStyle = active ? "#2c4036" : "#151d21";
      context.fillRect(x, 210, 44, 70);
      context.strokeStyle = active ? "#d8c16f" : "#35464d";
      context.strokeRect(x + 0.5, 210.5, 44, 70);
      drawOriginalSymbol(ARCHIVE_SYMBOL_PATTERN[index], x + 11, 224, 0.9, active);
    });
    drawArchivistFigure(1180 - viewX, 142, true, scene.time);
  } else {
    const terminalX = Math.round(ARCHIVIST_CHAMBER.TERMINAL_X - viewX);
    context.fillStyle = "#0a1115";
    context.fillRect(terminalX, 174, 72, 108);
    context.fillStyle = "#b7ad77";
    context.fillRect(terminalX + 10, 188, 52, 42);
    context.fillStyle = "#18140f";
    context.font = "8px monospace";
    drawWrappedText(TEXT_CONTENT.boss.ui.entryReady, terminalX + 8, 204, 56, 8, {
      align: "center",
      maxLines: 2,
      ellipsis: true,
    });
  }
  context.globalAlpha = 1;
}

function drawArchivistFigure(x, y, real, time) {
  const sway = Math.sin(time * 2.1) * 3;
  context.globalAlpha = real ? 0.82 : 0.48;
  context.fillStyle = "#010202";
  context.fillRect(x + sway, y + 34, 38, 92);
  context.fillRect(x + 6 + sway, y + 10, 26, 30);
  context.fillRect(x - 8 + sway, y + 52, 54, 18);
  context.fillStyle = real ? "#7e6950" : "#3c4548";
  context.fillRect(x + 11 + sway, y + 18, 4, 4);
  context.fillRect(x + 23 + sway, y + 18, 4, 4);
  context.globalAlpha = 1;
}

function drawLegacyArchivistEffects(scene, target, view) {
  drawFlashlightDarkness(scene, target, view);
  context.fillStyle = "rgba(118, 144, 150, 0.08)";
  context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  drawVignette();
  drawFilmGrain(scene);

  context.fillStyle = "rgba(4, 7, 9, 0.82)";
  context.fillRect(18, 18, 142, 42);
  context.fillStyle = "#8fa0a4";
  context.font = "10px monospace";
  context.fillText(
    formatText(TEXT_CONTENT.boss.ui.stabilityTemplate, {
      marks: "|".repeat(archivistProgress.playerStability),
    }),
    30,
    29,
  );
  context.fillStyle = "#65777b";
  context.fillText(
    formatText(TEXT_CONTENT.boss.ui.phaseTemplate, {
      phase: Math.min(3, archivistProgress.bossPhase),
    }),
    30,
    44,
  );

  if (archivistProgress.messageTimer > 0 && !archivistProgress.symbolInterruptionActive) {
    context.fillStyle = "rgba(4, 7, 9, 0.84)";
    context.fillRect(150, 258, 340, 36);
    context.fillStyle = "#d0c8ad";
    context.font = "11px monospace";
    drawWrappedText(archivistProgress.message, 162, 268, 316, 13);
  }

  if (archivistProgress.gameEnding) {
    drawArchivistAftermath();
  }
}

function drawArchivistAftermath() {
  const elapsed = 20 - archivistProgress.endingTimer;
  context.fillStyle = `rgba(0, 0, 0, ${clamp(elapsed / 8, 0.25, 0.9)})`;
  context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  context.textBaseline = "top";
  context.fillStyle = "#d8d7c8";

  if (elapsed >= 2) {
    context.font = "18px monospace";
    drawWrappedText(TEXT_CONTENT.boss.ui.archiveEntryCreated, 80, 104, 480, 19, {
      align: "center",
      maxLines: 1,
      ellipsis: true,
    });
  }
  if (elapsed >= 6) {
    context.font = "13px monospace";
    drawWrappedText(TEXT_CONTENT.boss.ui.subjectRedacted, 80, 146, 480, 14, {
      align: "center",
      maxLines: 1,
      ellipsis: true,
    });
  }
  if (elapsed >= 9) {
    context.fillStyle = "#c6ad61";
    drawWrappedText(TEXT_CONTENT.boss.ui.statusStillInside, 80, 170, 480, 14, {
      align: "center",
      maxLines: 1,
      ellipsis: true,
    });
  }
  if (elapsed >= 13) {
    context.fillStyle = "#aebabc";
    context.font = "12px monospace";
    drawWrappedText(TEXT_CONTENT.boss.ui.archivePreparing, 80, 222, 480, 13, {
      align: "center",
      maxLines: 2,
      ellipsis: true,
    });
    drawWrappedText(TEXT_CONTENT.boss.ui.nextEntry, 80, 250, 480, 13, {
      align: "center",
      maxLines: 2,
      ellipsis: true,
    });
  }
}

function drawArchivistChamberScene(view, scene) {
  const viewX = view.x;
  const lightFailure = archivistProgress.bossAttackState?.type === "lightFailure";
  context.fillStyle = "#020304";
  context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  context.fillStyle = lightFailure ? "#07090b" : "#11191d";
  context.fillRect(0, 54, CANVAS_WIDTH, GROUND_Y - 54);
  context.fillStyle = "#1b1310";
  context.fillRect(0, GROUND_Y, CANVAS_WIDTH, CANVAS_HEIGHT - GROUND_Y);

  for (let worldX = 0; worldX < ARCHIVIST_CHAMBER.WIDTH; worldX += 116) {
    const x = Math.round(worldX - viewX);
    if (x < -100 || x > CANVAS_WIDTH + 100) continue;
    context.fillStyle = "#070b0d";
    context.fillRect(x, 70, 82, 190);
    context.strokeStyle = "#27353b";
    context.strokeRect(x + 0.5, 70.5, 82, 190);
    context.fillStyle = "#536268";
    for (let row = 0; row < 7; row += 1) {
      context.fillRect(x + 9, 86 + row * 23, 48 + ((row * 11) % 20), 2);
    }
  }

  drawCombatFloorHazards(viewX);
  drawCombatProjectiles(viewX);

  for (const copyX of archivistProgress.falseCopies) {
    drawArchivistFigure(copyX - viewX, 154, false, scene.time + copyX);
  }

  const bossX = archivistProgress.archivistX - viewX;
  if (!archivistProgress.bossDefeated || archivistProgress.defeatTimer > 0) {
    context.save();
    if (archivistProgress.bossHitReaction > 0) {
      context.globalAlpha = 0.44 + Math.sin(scene.time * 42) * 0.24;
      context.translate(Math.sin(scene.time * 60) * 4, 0);
    }
    drawArchivistFigure(
      bossX,
      archivistProgress.bossDefeated ? 172 + (6 - archivistProgress.defeatTimer) * 8 : 148,
      true,
      scene.time,
    );
    context.restore();

    if (
      archivistProgress.beamActive ||
      archivistProgress.bossPhase >= 2 ||
      lightFailure ||
      archivistProgress.bossDefeated
    ) {
      ARCHIVE_SYMBOL_PATTERN.forEach((symbolId, index) => {
        drawOriginalSymbol(symbolId, bossX - 18 + index * 17, 126, 0.55, true);
      });
    }
  }

  drawBossAttackTelegraphs(bossX, viewX);

  if (archivistProgress.symbolInterruptionActive) {
    ARCHIVIST_CHAMBER.CONTROLS.forEach((worldX, index) => {
      const x = Math.round(worldX - viewX);
      const active = archivistProgress.symbolInterruptionSequence.includes(index);
      const required = index === archivistProgress.symbolInterruptionSequence.length;
      const pulse = 0.55 + Math.sin(scene.time * 7) * 0.28;
      context.fillStyle = active ? "#183d2b" : required ? "#423a1f" : "#111a1e";
      context.fillRect(x, 210, 44, 70);
      context.strokeStyle = active ? "#62c784" : required ? "#e1c75e" : "#415158";
      context.globalAlpha = required ? pulse : 1;
      context.strokeRect(x + 0.5, 210.5, 44, 70);
      drawOriginalSymbol(
        ARCHIVE_SYMBOL_PATTERN[index],
        x + 11,
        226,
        0.9,
        active || required,
      );
      context.globalAlpha = 1;
    });
    drawArchivistSealGuidance(viewX, scene);
  }

  drawVignette();
  drawFilmGrain(scene);
}

function drawArchivistSealGuidance(viewX, scene) {
  const completed = archivistProgress.symbolInterruptionSequence.length;
  context.fillStyle = "rgba(4, 7, 9, 0.94)";
  context.fillRect(120, 70, 400, 66);
  context.strokeStyle = archivistProgress.sealErrorTimer > 0 ? "#c8463f" : "#6c6040";
  context.lineWidth = archivistProgress.sealErrorTimer > 0 ? 4 : 2;
  context.strokeRect(120.5, 70.5, 400, 66);
  context.fillStyle = "#d8c16f";
  context.font = "14px monospace";
  drawWrappedText(TEXT_CONTENT.boss.ui.sealActive, 140, 80, 360, 14, {
    align: "center",
    maxLines: 1,
    ellipsis: true,
  });
  context.fillStyle = "#aebabc";
  context.font = "10px monospace";
  drawWrappedText(TEXT_CONTENT.boss.ui.deactivateSymbols, 140, 101, 360, 10, {
    align: "center",
    maxLines: 1,
    ellipsis: true,
  });

  ARCHIVE_SYMBOL_PATTERN.forEach((symbolId, index) => {
    const label = ARCHIVE_SYMBOL_LABELS[symbolId];
    const x = 154 + index * 94;
    const active = index < completed;
    const required = index === completed;
    context.fillStyle = active
      ? "#62c784"
      : required
        ? `rgba(232, 207, 100, ${0.68 + Math.sin(scene.time * 8) * 0.25})`
        : "#66777b";
    context.fillText(`${label}${index < 3 ? "  >" : ""}`, x, 119);
  });

  const nextWorldX = ARCHIVIST_CHAMBER.CONTROLS[completed];
  if (typeof nextWorldX === "number") {
    const nextScreenX = nextWorldX - viewX;
    context.fillStyle = "#e1c75e";
    if (nextScreenX < 24) {
      fillPolygon([[14, 202], [34, 190], [34, 214]]);
      context.fillText(TEXT_CONTENT.boss.ui.next, 40, 198);
    } else if (nextScreenX > CANVAS_WIDTH - 24) {
      fillPolygon([[626, 202], [606, 190], [606, 214]]);
      context.fillText(TEXT_CONTENT.boss.ui.next, 568, 198);
    }
  }

  if (archivistProgress.sealErrorTimer > 0) {
    context.fillStyle = "rgba(196, 31, 25, 0.2)";
    context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }
}

function drawCombatFloorHazards(viewX) {
  for (const warning of archivistProgress.spikeWarnings) {
    const x = warning.x - viewX;
    context.fillStyle = warning.timer > 0 ? "rgba(153, 61, 48, 0.35)" : "#260d0d";
    context.fillRect(x - 38, GROUND_Y - 8, 76, 8);
    if (warning.active > 0) {
      context.fillStyle = "#160707";
      fillPolygon([
        [x - 34, GROUND_Y],
        [x - 18, GROUND_Y - 70],
        [x, GROUND_Y],
        [x + 18, GROUND_Y - 92],
        [x + 34, GROUND_Y],
      ]);
    }
  }

  for (const warning of archivistProgress.collapseWarnings) {
    const x = warning.x - viewX;
    context.fillStyle = warning.timer > 0 ? "rgba(20, 10, 8, 0.4)" : "#0b0706";
    context.fillRect(x - 48, 62, 96, 12);
    if (warning.active > 0) {
      context.fillStyle = "#19110d";
      context.fillRect(x - 34, 76, 68, 180);
      context.fillStyle = "#4c3e31";
      context.fillRect(x - 26, 92, 52, 6);
    }
  }
}

function drawCombatProjectiles(viewX) {
  for (const projectile of archivistProgress.projectiles) {
    const x = projectile.x - viewX;
    context.fillStyle = "rgba(142, 56, 52, 0.26)";
    context.fillRect(x - 12, projectile.y - 12, 26, 26);
    drawOriginalSymbol("brokenSquare", x - 8, projectile.y - 8, 0.72, true);
  }
}

function drawBossAttackTelegraphs(bossX, viewX) {
  const attack = archivistProgress.bossAttackState;
  if (!attack) return;

  if (attack.type === "slash") {
    context.strokeStyle = attack.timer > 0.22 ? "rgba(184, 88, 66, 0.48)" : "#c66a58";
    context.lineWidth = 4;
    context.beginPath();
    context.moveTo(bossX - 90, 222);
    context.lineTo(bossX + 126, 205);
    context.stroke();
  } else if (attack.type === "projectile") {
    context.fillStyle = "rgba(170, 70, 57, 0.38)";
    context.fillRect(bossX - 10, 210, 22, 22);
  } else if (attack.type === "finalBeam") {
    const targetX = player.x + player.width / 2 - viewX;
    context.fillStyle =
      attack.timer > 0.28 ? "rgba(178, 52, 45, 0.22)" : "rgba(208, 70, 55, 0.62)";
    context.fillRect(Math.min(bossX, targetX), 180, Math.abs(targetX - bossX), 78);
  }
}

function drawArchivistEffects(scene, target, view) {
  drawFlashlightDarkness(scene, target, view);

  if (archivistProgress.beamActive) {
    const startX = target.x + target.width / 2 - view.x;
    const endX = startX + target.facing * BOSS_COMBAT.BEAM_RANGE;
    context.globalAlpha = 0.22;
    context.fillStyle = "#e8d883";
    fillPolygon([
      [startX, target.y + 18],
      [startX, target.y + 30],
      [endX, target.y - 20],
      [endX, target.y + 68],
    ]);
    context.globalAlpha = 1;
    for (let index = 0; index < 4; index += 1) {
      const symbolX = startX + target.facing * (58 + index * 54);
      drawOriginalSymbol(
        ARCHIVE_SYMBOL_PATTERN[index],
        symbolX,
        target.y + 12 + (index % 2) * 12,
        0.62,
        true,
      );
    }
  }

  if (archivistProgress.playerInvulnerable > 0) {
    const playerX = target.x - view.x;
    context.fillStyle = `rgba(207, 100, 81, ${
      0.12 + Math.sin(scene.time * 35) * 0.08
    })`;
    context.fillRect(playerX - 8, target.y - 8, target.width + 16, target.height + 16);
  }

  drawBossCombatUi();

  if (archivistProgress.playerDefeated) {
    drawBossDefeatScreen();
  }
}

function drawBossCombatUi() {
  context.fillStyle = "rgba(3, 5, 7, 0.9)";
  context.fillRect(154, 6, 332, 58);
  context.fillStyle = "#e0ddca";
  context.font = "15px monospace";
  context.textBaseline = "top";
  drawWrappedText(TEXT_CONTENT.boss.ui.name, 174, 10, 292, 15, {
    align: "center",
    maxLines: 1,
    ellipsis: true,
  });
  context.fillStyle = "#77888c";
  context.font = "9px monospace";
  drawWrappedText(TEXT_CONTENT.boss.ui.subtitle, 174, 27, 292, 9, {
    align: "center",
    maxLines: 1,
    ellipsis: true,
  });
  context.fillStyle = "#251113";
  context.fillRect(180, 43, 280, 10);
  context.fillStyle = archivistProgress.bossInvulnerable ? "#776b4d" : "#a84e46";
  context.fillRect(
    180,
    43,
    Math.round(280 * (archivistProgress.bossHealth / BOSS_COMBAT.MAX_HEALTH)),
    10,
  );
  context.strokeStyle = "#4d5d62";
  context.strokeRect(180.5, 43.5, 280, 10);

  context.fillStyle = "rgba(3, 5, 7, 0.88)";
  context.fillRect(16, 308, 184, 38);
  context.fillStyle = "#aebabc";
  context.font = "9px monospace";
  drawWrappedText(TEXT_CONTENT.boss.ui.stability, 26, 314, 54, 9, {
    maxLines: 1,
    ellipsis: true,
  });
  for (let index = 0; index < BOSS_COMBAT.MAX_STABILITY; index += 1) {
    context.fillStyle =
      index < archivistProgress.playerStability ? "#d8c16f" : "#28343a";
    context.fillRect(84 + index * 20, 314, 14, 10);
  }

  context.fillStyle = "#aebabc";
  drawWrappedText(TEXT_CONTENT.boss.ui.manuscriptCharge, 26, 330, 94, 9, {
    maxLines: 1,
    ellipsis: true,
  });
  context.fillStyle = "#172126";
  context.fillRect(126, 331, 62, 7);
  context.fillStyle = "#d8c16f";
  context.fillRect(
    126,
    331,
    Math.round(62 * (archivistProgress.manuscriptCharge / BOSS_COMBAT.MAX_CHARGE)),
    7,
  );

  if (archivistProgress.messageTimer > 0) {
    context.fillStyle = "rgba(3, 5, 7, 0.86)";
    context.fillRect(140, 70, 360, 36);
    context.fillStyle = "#d0c8ad";
    context.font = "10px monospace";
    drawWrappedText(archivistProgress.message, 152, 80, 336, 12);
  }

  if (
    archivistProgress.tutorialTimer > 0 &&
    (!archivistProgress.tutorialMoved ||
      !archivistProgress.tutorialDodged ||
      !archivistProgress.tutorialAttacked)
  ) {
    context.fillStyle = "rgba(3, 5, 7, 0.8)";
    context.fillRect(458, 116, 164, 68);
    context.fillStyle = "#8fa0a4";
    context.font = "9px monospace";
    if (!archivistProgress.tutorialMoved) {
      drawWrappedText(TEXT_CONTENT.boss.ui.move, 470, 126, 140, 9, {
        maxLines: 1,
        ellipsis: true,
      });
    }
    if (!archivistProgress.tutorialDodged) {
      drawWrappedText(TEXT_CONTENT.boss.ui.dodge, 470, 144, 140, 9, {
        maxLines: 1,
        ellipsis: true,
      });
    }
    if (!archivistProgress.tutorialAttacked) {
      drawWrappedText(TEXT_CONTENT.boss.ui.focusBeam, 470, 162, 140, 9, {
        maxLines: 1,
        ellipsis: true,
      });
    }
  }
}

function drawBossDefeatScreen() {
  context.fillStyle = "rgba(0, 0, 0, 0.86)";
  context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  context.fillStyle = "#b8c3c5";
  context.font = "18px monospace";
  drawWrappedText(TEXT_CONTENT.boss.ui.archiveEntryCompleted, 80, 96, 480, 18, {
    align: "center",
    maxLines: 1,
    ellipsis: true,
  });
  context.fillStyle = "#a6544b";
  context.font = "13px monospace";
  drawWrappedText(TEXT_CONTENT.boss.ui.statusContained, 80, 132, 480, 13, {
    align: "center",
    maxLines: 1,
    ellipsis: true,
  });
  [TEXT_CONTENT.boss.ui.retryBoss, TEXT_CONTENT.boss.ui.returnToTitle].forEach((label, index) => {
    drawMenuButton(
      getBossDefeatButtonRect(index),
      label,
      archivistProgress.defeatMenuIndex === index,
    );
  });
}

function drawPlaceholderState() {
  context.fillStyle = "#000";
  context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function drawDebugScreen() {
  if (
    !debug.showOverlay ||
    presentationState.active ||
    TRAILER_MODE ||
    cinematicCaptureActive ||
    isInterfaceScreenState()
  ) {
    return;
  }

  const scene = getActiveVisualScene();

  context.fillStyle = "#d7d7d7";
  context.font = "16px monospace";
  context.textBaseline = "top";

  context.fillText("VOYNICH", 24, 16);
  context.fillText(`state: ${gameState.current}`, 24, 40);
  context.fillText(
    `player x: ${Math.round(player.x)} camera x: ${Math.round(camera.x)}`,
    24,
    64,
  );
  context.fillText(
    `flashlight: ${scene.flashlightOn ? "on" : "off"} boxes: ${
      debug.showCollisionBoxes ? "on" : "off"
    }`,
    24,
    88,
  );
  context.fillText(`anim: ${player.animationMode} frame: ${player.animationFrame}`, 24, 112);
  context.fillText(
    `trailer: ${TRAILER_MODE ? "on" : "off"} audio: ${getAudioStatusLabel(
      audioManager.getStatus(),
    )}`,
    24,
    136,
  );
  context.fillText(
    `archive: ${archiveProgress.searchedShelves.size}/3 shelves table ${
      archiveProgress.manuscriptTableRevealed ? "shown" : "hidden"
    } ladder ${Math.round(archiveProgress.ladderX)}`,
    24,
    160,
  );
  context.fillText("keys:", 24, 184);

  DEBUG_KEYS.forEach((key, index) => {
    const value = input.isPressed(key.code) ? "down" : "--";
    const column = Math.floor(index / 6);
    const row = index % 6;
    context.fillText(`${key.label}: ${value}`, 48 + column * 116, 208 + row * 18);
  });
}

function getAudioStatusLabel(status) {
  if (!status.available) {
    return "unavailable";
  }

  if (!status.unlocked) {
    return "press key/click";
  }

  if (status.missingCount > 0) {
    return `ready ${status.missingCount} missing`;
  }

  if (status.failedStartCount > 0) {
    return "ready blocked";
  }

  return "ready";
}

function gameLoop(frameTime) {
  if (isPausedForVisibility) {
    requestAnimationFrame(gameLoop);
    return;
  }

  if (lastFrameTime === 0) {
    lastFrameTime = frameTime;
  }

  const deltaSeconds = Math.min((frameTime - lastFrameTime) / 1000, 0.1);
  lastFrameTime = frameTime;

  update(deltaSeconds);
  render();

  requestAnimationFrame(gameLoop);
}

document.addEventListener("visibilitychange", () => {
  isPausedForVisibility = document.hidden;

  if (isPausedForVisibility) {
    input.clear();
    mouse.clear();
    return;
  }

  lastFrameTime = 0;
});

function fillPolygon(points) {
  context.beginPath();
  context.moveTo(points[0][0], points[0][1]);

  for (let index = 1; index < points.length; index += 1) {
    context.lineTo(points[index][0], points[index][1]);
  }

  context.closePath();
  context.fill();
}

function drawWrappedText(text, x, y, maxWidth, lineHeight, options = {}) {
  const previousFont = context.font;
  if (options.font) {
    context.font = options.font;
  }

  const lines = getPresentationTextLines(text, maxWidth, options);
  const align = options.align || "left";

  lines.forEach((line, index) => {
    const lineWidth = measureTextWidth(line, context.font);
    let drawX = x;
    if (align === "center") {
      drawX = x + (maxWidth - lineWidth) / 2;
    } else if (align === "right") {
      drawX = x + maxWidth - lineWidth;
    }
    context.fillText(line, Math.round(drawX), y + index * lineHeight);
  });

  context.font = previousFont;
  return {
    lines,
    height: lines.length > 0 ? (lines.length - 1) * lineHeight + lineHeight : 0,
  };
}

function getPresentationTextLines(text, maxWidth, options = {}) {
  const maxLines = options.maxLines ?? Infinity;
  const ellipsis = options.ellipsis ?? false;
  const words = String(text || "").trim().split(/\s+/).filter(Boolean);
  const lines = [];
  let line = "";
  let overflowed = false;

  words.forEach((word) => {
    if (lines.length >= maxLines) {
      overflowed = true;
      return;
    }

    const testLine = line ? `${line} ${word}` : word;
    if (measureTextWidth(testLine, context.font) <= maxWidth || !line) {
      line = testLine;
      return;
    }

    lines.push(line);
    line = word;
    if (lines.length >= maxLines) {
      overflowed = true;
    }
  });

  if (line && lines.length < maxLines) {
    lines.push(line);
  } else if (line && lines.length >= maxLines) {
    overflowed = true;
  }

  if (ellipsis && overflowed && words.length > 0 && lines.length === maxLines) {
    let lastLine = lines[lines.length - 1] || "";
    while (lastLine.length > 0 && measureTextWidth(`${lastLine}...`, context.font) > maxWidth) {
      lastLine = lastLine.slice(0, -1).trim();
    }
    lines[lines.length - 1] = lastLine ? `${lastLine}...` : "...";
  }

  return lines;
}

function measurePresentationText(text, maxWidth, lineHeight, options = {}) {
  const previousFont = context.font;
  if (options.font) {
    context.font = options.font;
  }

  const lines = getPresentationTextLines(text, maxWidth, options);
  context.font = previousFont;

  return {
    lines,
    height: lines.length > 0 ? (lines.length - 1) * lineHeight + lineHeight : 0,
  };
}

function wrapPresentationText(text, x, y, maxWidth, lineHeight, options = {}) {
  const previousFont = context.font;
  if (options.font) {
    context.font = options.font;
  }

  const lines = getPresentationTextLines(text, maxWidth, options);
  const align = options.align || "left";

  lines.forEach((line, index) => {
    const lineWidth = measureTextWidth(line);
    let drawX = x;
    if (align === "center") {
      drawX = x + (maxWidth - lineWidth) / 2;
    } else if (align === "right") {
      drawX = x + maxWidth - lineWidth;
    }
    context.fillText(line, Math.round(drawX), y + index * lineHeight);
  });

  context.font = previousFont;
  return {
    lines,
    height: lines.length > 0 ? (lines.length - 1) * lineHeight + lineHeight : 0,
  };
}

function formatText(template, values = {}) {
  return template.replace(/\$\{([A-Za-z0-9_]+)\}/g, (match, key) => {
    if (!Object.prototype.hasOwnProperty.call(values, key)) {
      return match;
    }

    return String(values[key]);
  });
}

function measureTextWidth(text, font) {
  const previousFont = context.font;

  if (font) {
    context.font = font;
  }

  const metrics = context.measureText?.(text);
  const width = typeof metrics?.width === "number" ? metrics.width : text.length * 8;

  context.font = previousFont;
  return width;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function moveToward(value, target, maxDelta) {
  if (value < target) {
    return Math.min(value + maxDelta, target);
  }

  if (value > target) {
    return Math.max(value - maxDelta, target);
  }

  return target;
}

render();
requestAnimationFrame(gameLoop);
