"use strict";

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
    titleTheme: "assets/audio/title-music.ogg",
    corridorTheme: "assets/audio/corridor-theme.ogg",
    archivePulse: "assets/audio/archive-pulse.ogg",
    archiveTension: "assets/audio/archive-tension.ogg",
    manuscriptRise: "assets/audio/manuscript-low-rise.ogg",
    distortedPulse: "assets/audio/distorted-low-pulse.ogg",
    endingTheme: "assets/audio/ending-music.ogg",
  }),
  ambience: Object.freeze({
    corridorRoomTone: "assets/audio/corridor-room-tone.ogg",
    archiveRoomTone: "assets/audio/archive-room-tone.ogg",
    archiveFluorescentHum: "assets/audio/archive-fluorescent-hum.ogg",
    distortedCorridorTone: "assets/audio/distorted-corridor-tone.ogg",
    reverseElectricalHum: "assets/audio/reverse-electrical-hum.ogg",
  }),
  sfx: Object.freeze({
    flashlightToggle: "assets/audio/flashlight-toggle.ogg",
    debugToggle: "assets/audio/debug-toggle.ogg",
    interactionPrompt: "assets/audio/interaction-prompt.ogg",
    dialogueTick: "assets/audio/dialogue-tick.ogg",
    journalOpen: "assets/audio/journal-open.ogg",
    journalClose: "assets/audio/journal-close.ogg",
    uiMove: "assets/audio/ui-move.ogg",
    uiSelect: "assets/audio/ui-select.ogg",
    uiBack: "assets/audio/ui-back.ogg",
    fullscreenToggle: "assets/audio/fullscreen-toggle.ogg",
    clueCollected: "assets/audio/clue-collected.ogg",
    lockedDoor: "assets/audio/locked-door.ogg",
    keypadButton: "assets/audio/keypad-button.ogg",
    wrongCode: "assets/audio/wrong-code.ogg",
    correctCode: "assets/audio/correct-code.ogg",
    powerReturn: "assets/audio/power-return.ogg",
    archiveDoorUnlock: "assets/audio/archive-door-unlock.ogg",
    archiveDoorOpen: "assets/audio/archive-door-open.ogg",
    shelfCreak: "assets/audio/shelf-creak.ogg",
    paperMove: "assets/audio/paper-movement.ogg",
    drawerOpen: "assets/audio/drawer-open.ogg",
    drawerClose: "assets/audio/drawer-close.ogg",
    filingCabinetLock: "assets/audio/filing-cabinet-lock.ogg",
    ladderMove: "assets/audio/ladder-movement.ogg",
    distantMetallicImpact: "assets/audio/distant-metallic-impact.ogg",
    accessCardBeep: "assets/audio/access-card-beep.ogg",
    manuscriptLightActivation: "assets/audio/manuscript-light-activation.ogg",
    fluorescentHum: "assets/audio/fluorescent-hum.ogg",
    bookOpen: "assets/audio/book-opening.ogg",
    pageMovement: "assets/audio/page-movement.ogg",
    paperFragmentPickup: "assets/audio/paper-fragment-pickup.ogg",
    fragmentPlacement: "assets/audio/fragment-placement.ogg",
    symbolTone: "assets/audio/subtle-symbol-tone.ogg",
    incorrectPuzzle: "assets/audio/incorrect-puzzle.ogg",
    stageCompletion: "assets/audio/stage-completion.ogg",
    ringRotation: "assets/audio/ring-rotation.ogg",
    finalAlignment: "assets/audio/final-alignment.ogg",
    glitchBurst: "assets/audio/glitch-burst.ogg",
    silenceBeforeRealityChange: "assets/audio/silence-before-reality-change.ogg",
    distantFootsteps: "assets/audio/distant-footsteps.ogg",
    corridorLoop: "assets/audio/corridor-loop.ogg",
    falseDoor: "assets/audio/false-door.ogg",
    wallSwitch: "assets/audio/wall-switch.ogg",
    passageOpenBass: "assets/audio/passage-open-bass.ogg",
    finalPageReveal: "assets/audio/final-page-reveal.ogg",
    electricalHum: "assets/audio/electrical-hum.ogg",
    lightFlicker: "assets/audio/light-flicker.ogg",
  }),
});

const AUDIO_VOLUME_DEFAULTS = Object.freeze({
  master: 0.8,
  music: 0.72,
  ambience: 0.64,
  sfx: 0.8,
});

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
  SETTINGS: "settings",
  CREDITS: "credits",
  EXIT: "exit",
});

const SETTINGS_ITEMS = Object.freeze([
  Object.freeze({ id: "masterVolume", label: "Master volume", type: "range", min: 0, max: 1, step: 0.05 }),
  Object.freeze({ id: "musicVolume", label: "Music volume", type: "range", min: 0, max: 1, step: 0.05 }),
  Object.freeze({ id: "ambienceVolume", label: "Ambience volume", type: "range", min: 0, max: 1, step: 0.05 }),
  Object.freeze({ id: "sfxVolume", label: "SFX volume", type: "range", min: 0, max: 1, step: 0.05 }),
  Object.freeze({ id: "textSpeed", label: "Text speed", type: "range", min: 24, max: 90, step: 6 }),
  Object.freeze({ id: "screenShake", label: "Screen shake", type: "toggle" }),
  Object.freeze({ id: "grainIntensity", label: "Grain / scanlines", type: "range", min: 0, max: 1, step: 0.1 }),
  Object.freeze({ id: "fullscreen", label: "Fullscreen", type: "action" }),
  Object.freeze({ id: "back", label: "Back", type: "action" }),
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
  PLAYER_RIGHT_BOUNDARY: 2176,
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
    { x: 260, y: 138, label: "LAB" },
    { x: 872, y: 106, label: "2086" },
    { x: 1510, y: 154, label: "NO ENTRY" },
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
  LADDER_TARGET_X: 1196,
  HIGH_SHELF_X: 1216,
  TABLE_X: 1478,
  TABLE_Y: 228,
  TABLE_WIDTH: 148,
  TABLE_HEIGHT: 50,
  DUST_COUNT: 56,
  DEEP_SHELVES: Object.freeze([170, 380, 590, 800, 1010, 1220, 1430, 1640]),
  FOREGROUND_SHELVES: Object.freeze([
    { x: 244, y: 110, w: 138, h: 178, mark: "A-02" },
    { x: 572, y: 104, w: 154, h: 184, mark: "C-11" },
    { x: 890, y: 106, w: 156, h: 184, mark: "V-13" },
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
    title: "Personnel transfer",
    text:
      "A transfer list names three archivists assigned to V-13 in 2081, two years after the university stopped issuing official records.",
    useful: true,
  }),
  waterDamage: Object.freeze({
    shelfId: "waterDamage",
    mark: "C-11",
    clueId: "shelfAtmosphericRecord",
    title: "Water damage log",
    text:
      "The log is mostly mildew and initials. Someone kept reporting wet paper beneath a dry ceiling.",
    useful: false,
  }),
  restrictedAccess: Object.freeze({
    shelfId: "restrictedAccess",
    mark: "V-13",
    clueId: "shelfAccessRecord",
    title: "Restricted access sheet",
    text:
      "Cabinet R-6 is listed beside a sealed key held above the V-13 shelf line. The entry is not in the terminal.",
    useful: true,
  }),
});

const MANUSCRIPT_STAGES = Object.freeze({
  RECONSTRUCT: "reconstruct",
  SYMBOLS: "symbols",
  ALIGNMENT: "alignment",
  SOLVED: "solved",
});

const MANUSCRIPT_VIEW = Object.freeze({
  PAGE_X: 42,
  PAGE_Y: 28,
  PAGE_WIDTH: 346,
  PAGE_HEIGHT: 304,
  OUTLINE_X: 100,
  OUTLINE_Y: 76,
  OUTLINE_WIDTH: 212,
  OUTLINE_HEIGHT: 174,
  PANEL_X: 416,
  PANEL_Y: 42,
  BUTTON_HEIGHT: 26,
  SNAP_DISTANCE: 24,
  RING_CENTER_X: 300,
  RING_CENTER_Y: 182,
});

const MANUSCRIPT_FRAGMENTS = Object.freeze([
  Object.freeze({
    id: "upperLeft",
    label: "I",
    startX: 428,
    startY: 82,
    targetX: 108,
    targetY: 84,
    width: 88,
    height: 68,
    rotation: 1,
    targetRotation: 0,
    mark: "staff",
  }),
  Object.freeze({
    id: "upperRight",
    label: "II",
    startX: 528,
    startY: 88,
    targetX: 196,
    targetY: 88,
    width: 100,
    height: 64,
    rotation: 3,
    targetRotation: 0,
    mark: "restricted",
  }),
  Object.freeze({
    id: "lowerLeft",
    label: "III",
    startX: 430,
    startY: 188,
    targetX: 112,
    targetY: 152,
    width: 86,
    height: 82,
    rotation: 2,
    targetRotation: 0,
    mark: "maintenance",
  }),
  Object.freeze({
    id: "lowerRight",
    label: "IV",
    startX: 532,
    startY: 184,
    targetX: 198,
    targetY: 152,
    width: 96,
    height: 82,
    rotation: 1,
    targetRotation: 0,
    mark: "removed",
  }),
]);

const MANUSCRIPT_SYMBOLS = Object.freeze([
  Object.freeze({
    id: "staff",
    label: "Aster",
    classLabel: "personnel transfer",
    clueId: "shelfPersonnelRecord",
    hint: "The transfer list points to staff assigned after the official end.",
  }),
  Object.freeze({
    id: "maintenance",
    label: "Drain",
    classLabel: "water damage",
    clueId: "shelfAtmosphericRecord",
    hint: "The water log is a maintenance classification, not the missing-page path.",
  }),
  Object.freeze({
    id: "restricted",
    label: "Grille",
    classLabel: "restricted access",
    clueId: "shelfAccessRecord",
    hint: "The access sheet links V-13 to cabinet R-6 and the sealed key.",
  }),
  Object.freeze({
    id: "removed",
    label: "Hollow leaf",
    classLabel: "removed page",
    clueId: "removedPageNote",
    hint: "The cabinet note names the page removed from the catalogue.",
  }),
]);

const MANUSCRIPT_SYMBOL_SEQUENCE = Object.freeze(["staff", "restricted", "removed"]);

const MANUSCRIPT_RINGS = Object.freeze([
  Object.freeze({ id: "outer", label: "Outer ring", radius: 96, width: 18, target: 1 }),
  Object.freeze({ id: "middle", label: "Middle ring", radius: 68, width: 16, target: 5 }),
  Object.freeze({ id: "inner", label: "Inner ring", radius: 42, width: 14, target: 3 }),
]);

const REALITY_CHANGE_SYMBOLS = Object.freeze([
  Object.freeze({
    id: "movedShelf",
    symbolId: "staff",
    clueId: "changedShelfSymbol",
    x: 930,
    prompt: "Inspect moved shelf",
  }),
  Object.freeze({
    id: "alteredPhotograph",
    symbolId: "restricted",
    clueId: "alteredPhotographSymbol",
    x: 742,
    prompt: "Inspect altered photograph",
  }),
  Object.freeze({
    id: "backwardClock",
    symbolId: "removed",
    clueId: "backwardClockSymbol",
    x: 786,
    prompt: "Inspect backward clock",
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
    { id: "falseWest", x: 504, symbolId: "maintenance", label: "A-02" },
    { id: "realDoor", x: 1096, symbolId: "restricted", label: "V-13" },
    { id: "falseEast", x: 1718, symbolId: "staff", label: "R-06" },
  ]),
  SWITCHES: Object.freeze([
    { id: "staff", x: 2190, symbolId: "staff" },
    { id: "restricted", x: 2296, symbolId: "restricted" },
    { id: "removed", x: 2404, symbolId: "removed" },
  ]),
  SWITCH_ORDER: Object.freeze(["staff", "restricted", "removed"]),
});

const ARCHIVE_CODE = "2079";

const OBJECTIVE_DATA = Object.freeze({
  findArchive: Object.freeze({
    title: "Find a way into the archive.",
    detail: "Start with the university directory.",
  }),
  checkDoor: Object.freeze({
    title: "Find a way into the archive.",
    detail: "Check the archive door at the east end.",
  }),
  inspectLock: Object.freeze({
    title: "Find a way into the archive.",
    detail: "Inspect the archive lock panel.",
  }),
  restorePower: Object.freeze({
    title: "Restore auxiliary power.",
    detail: "Find how the dead archive keypad is powered.",
  }),
  findKey: Object.freeze({
    title: "Find the maintenance key.",
    detail: "The electrical cabinet has a small physical lock.",
  }),
  resetPower: Object.freeze({
    title: "Reset the archive power.",
    detail: "Use the maintenance key on the electrical cabinet.",
  }),
  findCode: Object.freeze({
    title: "Find the archive code.",
    detail: "The keypad needs four digits.",
  }),
  enterCode: Object.freeze({
    title: "Unlock the archive door.",
    detail: "Enter the code at the powered keypad.",
  }),
  enterArchive: Object.freeze({
    title: "Enter the archive.",
    detail: "The door has finally released.",
  }),
  locateRestricted: Object.freeze({
    title: "Locate the restricted collection.",
    detail: "Begin with the archive index terminal.",
  }),
  searchMarkedShelves: Object.freeze({
    title: "Search the marked shelf sections.",
    detail: "Restricted Collection V-13 is missing from the index.",
  }),
  findShelfCoordinate: Object.freeze({
    title: "Find the handwritten shelf coordinate.",
    detail: "Check the loose folders around the searched sections.",
  }),
  moveArchiveLadder: Object.freeze({
    title: "Move the rolling ladder.",
    detail: "Reach the high shelf coordinate hidden in the folder.",
  }),
  retrieveStorageKey: Object.freeze({
    title: "Retrieve the sealed storage key.",
    detail: "Search the high shelf now that the ladder is in place.",
  }),
  openArchiveCabinet: Object.freeze({
    title: "Open the filing cabinet.",
    detail: "Use the sealed storage key on the locked records cabinet.",
  }),
  useArchiveAccessCard: Object.freeze({
    title: "Use the archive access card.",
    detail: "Find what the removed page was meant to hide.",
  }),
  revealManuscriptTable: Object.freeze({
    title: "Reveal the manuscript table.",
    detail: "The restricted cabinet has power again.",
  }),
  inspectManuscript: Object.freeze({
    title: "Inspect the manuscript.",
    detail: "Open the revealed page on the central table.",
  }),
  reconstructPage: Object.freeze({
    title: "Reconstruct the torn page.",
    detail: "Place and rotate the four fragments into the outline.",
  }),
  interpretSymbols: Object.freeze({
    title: "Interpret the margin marks.",
    detail: "Use the journal clues to choose the three-symbol sequence.",
  }),
  alignMissingPage: Object.freeze({
    title: "Align the missing page.",
    detail: "Rotate the three rings until a single symbol forms.",
  }),
  escapeDistortion: Object.freeze({
    title: "Leave the archive.",
    detail: "The exit no longer returns to the same corridor.",
  }),
  findMissingPage: Object.freeze({
    title: "Find the missing page.",
    detail: "Try leaving through the archive entrance.",
  }),
  noticeArchiveChanges: Object.freeze({
    title: "Notice three impossible changes.",
    detail: "Each changed detail exposes one symbol.",
  }),
  testDistortedExit: Object.freeze({
    title: "Test the corridor exit.",
    detail: "The normal way out is no longer trustworthy.",
  }),
  chooseRealDoor: Object.freeze({
    title: "Choose the real duplicate door.",
    detail: "Use the three revealed symbols to reject the false doors.",
  }),
  activateWallSwitches: Object.freeze({
    title: "Open the sealed records section.",
    detail: "Activate the wall switches in the order the manuscript taught you.",
  }),
  reachMissingPage: Object.freeze({
    title: "Reach the missing page.",
    detail: "The final passage is open under the distant light.",
  }),
});

const CLUE_DATA = Object.freeze({
  directory: Object.freeze({
    title: "Damaged university directory",
    text: "The archive is marked in the lower east wing, past the decommissioned records hall.",
  }),
  lockPanel: Object.freeze({
    title: "Dead electronic lock panel",
    text: "The archive keypad is intact, but no power reaches it.",
  }),
  maintenanceNotice: Object.freeze({
    title: "Maintenance notice",
    text: "Auxiliary archive power runs through a small electrical cabinet with a physical maintenance lock.",
  }),
  securityMemo: Object.freeze({
    title: "Abandoned security memo",
    text: "The archive code follows the last official university record year. The public registry ends in 2079.",
  }),
  maintenanceKey: Object.freeze({
    title: "Loose maintenance key",
    text: "A narrow service key for a utility cabinet, not for the archive door itself.",
  }),
  powerReset: Object.freeze({
    title: "Auxiliary power reset",
    text: "Power returned to the archive keypad after the cabinet switch was thrown.",
  }),
  archiveUnlocked: Object.freeze({
    title: "Archive door unlocked",
    text: "The keypad accepted 2079. Something behind the door woke up late.",
  }),
  archiveIndex: Object.freeze({
    title: "Archive index terminal",
    text: "Restricted Collection V-13 does not appear in the searchable index, but adjacent shelves still reference it.",
  }),
  shelfPersonnelRecord: Object.freeze({
    title: "Useful record: personnel transfer",
    text: "A late transfer list assigns staff to Restricted Collection V-13 after the university records officially ended.",
  }),
  shelfAtmosphericRecord: Object.freeze({
    title: "Atmospheric record: water damage log",
    text: "A maintenance log notes ceiling leaks, spoiled labels, and a smell of wet paper that never left.",
  }),
  shelfAccessRecord: Object.freeze({
    title: "Useful record: restricted access",
    text: "A restricted access sheet mentions cabinet R-6 and a storage key held above the V-13 shelf.",
  }),
  handwrittenCoordinate: Object.freeze({
    title: "Handwritten shelf coordinate",
    text: "A folder margin reads V-13 HIGH / LADDER LINE / KEY SEALED.",
  }),
  sealedStorageKey: Object.freeze({
    title: "Sealed storage key",
    text: "A waxed paper sleeve contains a small key stamped R-6.",
  }),
  cabinetPhotograph: Object.freeze({
    title: "Photograph from cabinet R-6",
    text: "A blurred archive table stands under a hanging lamp. The date is scratched away.",
  }),
  archiveAccessCard: Object.freeze({
    title: "Archive access card",
    text: "The card is still warm around the magnetic strip, as if it has been used recently.",
  }),
  removedPageNote: Object.freeze({
    title: "Note about the removed page",
    text: "A note says: The page that was removed must not be catalogued with the rest.",
  }),
  manuscriptTableReveal: Object.freeze({
    title: "Concealed manuscript table",
    text: "The restricted cabinet opens the darkness around the central table.",
  }),
  reconstructedMargin: Object.freeze({
    title: "Reconstructed margin marks",
    text: "The repaired page orders the archive path as staff assignment, restricted access, then the removed page.",
  }),
  changedShelfSymbol: Object.freeze({
    title: "Changed archive shelf",
    text: "The V-13 shelf has moved by itself. Behind it, the staff-assignment symbol is scratched into bare wall.",
  }),
  alteredPhotographSymbol: Object.freeze({
    title: "Altered photograph",
    text: "The photograph now shows the restricted cabinet where the manuscript table used to be.",
  }),
  backwardClockSymbol: Object.freeze({
    title: "Backward-running clock",
    text: "The desk clock runs backward. Its second hand drags the removed-page symbol through dust.",
  }),
  wrongDuplicateDoor: Object.freeze({
    title: "False duplicate door",
    text: "The wrong door folds the corridor back onto itself and changes one detail.",
  }),
  sealedRecordsOpened: Object.freeze({
    title: "Sealed records section opened",
    text: "The wall switches accepted the order: staff assignment, restricted access, removed page.",
  }),
  missingPageVisible: Object.freeze({
    title: "Missing page visible",
    text: "The missing page lies under a distant light, no longer hidden by the archive.",
  }),
});

const DIALOGUE_DATA = Object.freeze({
  directory: Object.freeze({
    allowEscape: true,
    lines: Object.freeze([
      Object.freeze({
        speaker: "Directory",
        text: "LOWER EAST: ARCHIVE, RECORDS HALL, RESTRICTED STACKS. Most of the letters have lifted from the plastic.",
      }),
      Object.freeze({
        speaker: "Voynich",
        text: "The archive should not still be listed. Someone kept updating the arrows after the directory died.",
        thought: true,
      }),
    ]),
  }),
  doorLocked: Object.freeze({
    allowEscape: true,
    lines: Object.freeze([
      Object.freeze({
        speaker: "Archive Door",
        text: "The handle refuses to move. There is no keyhole meant for a person; this lock belongs to the electronics.",
      }),
      Object.freeze({
        speaker: "Voynich",
        text: "The door is waiting for the electronics, not for me.",
        thought: true,
      }),
    ]),
  }),
  doorPoweredLocked: Object.freeze({
    allowEscape: true,
    lines: Object.freeze([
      Object.freeze({
        speaker: "Archive Door",
        text: "A powered keypad watches from the frame. The door still holds shut.",
      }),
    ]),
  }),
  doorUnlocked: Object.freeze({
    allowEscape: true,
    lines: Object.freeze([
      Object.freeze({
        speaker: "Archive Door",
        text: "The lock has released. Cold air presses through the seam.",
      }),
      Object.freeze({
        speaker: "Voynich",
        text: "For the first time tonight, the university lets something open.",
        thought: true,
      }),
    ]),
  }),
  lockPanelDead: Object.freeze({
    allowEscape: true,
    lines: Object.freeze([
      Object.freeze({
        speaker: "Lock Panel",
        text: "The keypad is black. A faded diagnostic strip reads AUX POWER: CABINET B.",
      }),
    ]),
  }),
  lockNeedsClues: Object.freeze({
    allowEscape: true,
    lines: Object.freeze([
      Object.freeze({
        speaker: "Lock Panel",
        text: "The keypad wakes, but it asks for four digits I have not earned yet.",
      }),
    ]),
  }),
  memo: Object.freeze({
    allowEscape: true,
    lines: Object.freeze([
      Object.freeze({
        speaker: "Security Memo",
        text: "ARCHIVE ACCESS: Use the last official record year until central authentication returns.",
      }),
      Object.freeze({
        speaker: "Security Memo",
        text: "Public university records terminate in 2079. Archive access logs continue for seven years after, written by hand.",
      }),
      Object.freeze({
        speaker: "Voynich",
        text: "Officially the university stopped remembering itself. Unofficially, someone kept feeding the archive.",
        thought: true,
      }),
    ]),
  }),
  maintenanceNotice: Object.freeze({
    allowEscape: true,
    lines: Object.freeze([
      Object.freeze({
        speaker: "Maintenance Notice",
        text: "AUXILIARY POWER: Archive keypad routed through east service cabinet. Physical key required after outages.",
      }),
    ]),
  }),
  keyCollected: Object.freeze({
    allowEscape: true,
    lines: Object.freeze([
      Object.freeze({
        speaker: "Maintenance Key",
        text: "The key is taped under broken chair metal. Its tag reads CABINET B, not ARCHIVE.",
      }),
    ]),
  }),
  cabinetLocked: Object.freeze({
    allowEscape: true,
    lines: Object.freeze([
      Object.freeze({
        speaker: "Electrical Cabinet",
        text: "The cabinet has a small utility lock. It will not open by force.",
      }),
    ]),
  }),
  cabinetNeedsNotice: Object.freeze({
    allowEscape: true,
    lines: Object.freeze([
      Object.freeze({
        speaker: "Electrical Cabinet",
        text: "The key fits, but the labels are half burned away. I need to know what this cabinet feeds before I touch it.",
        thought: true,
      }),
    ]),
  }),
  cabinetNeedsPanel: Object.freeze({
    allowEscape: true,
    lines: Object.freeze([
      Object.freeze({
        speaker: "Electrical Cabinet",
        text: "Before I send power anywhere, I should inspect the archive panel and make sure this is the right circuit.",
        thought: true,
      }),
    ]),
  }),
  powerReset: Object.freeze({
    allowEscape: false,
    lines: Object.freeze([
      Object.freeze({
        speaker: "Electrical Cabinet",
        text: "The reset switch snaps upward. Somewhere in the wall, relays answer one by one.",
      }),
      Object.freeze({
        speaker: "Voynich",
        text: "The corridor sounds less abandoned when it remembers how to breathe.",
        thought: true,
      }),
    ]),
  }),
  manuscriptObject: Object.freeze({
    allowEscape: true,
    lines: Object.freeze([
      Object.freeze({
        speaker: "Sealed Cart",
        text: "The cart is chained shut. The label plate has been scraped until it shines.",
      }),
    ]),
  }),
  finalPageObject: Object.freeze({
    allowEscape: true,
    lines: Object.freeze([
      Object.freeze({
        speaker: "Loose Page",
        text: "The page is blank except for pressure marks. Whatever wrote here pressed too hard.",
      }),
    ]),
  }),
  wrongCode: Object.freeze({
    allowEscape: true,
    lines: Object.freeze([
      Object.freeze({
        speaker: "Lock Panel",
        text: "The keypad rejects the sequence. The red light lingers a little too long.",
      }),
    ]),
  }),
  correctCode: Object.freeze({
    allowEscape: false,
    lines: Object.freeze([
      Object.freeze({
        speaker: "Lock Panel",
        text: "2079 is accepted. The archive door unlocks with a sound like a held breath leaving a room.",
      }),
    ]),
  }),
  archiveEntrance: Object.freeze({
    allowEscape: true,
    lines: Object.freeze([
      Object.freeze({
        speaker: "Voynich",
        text: "The archive is warmer than the corridor. That makes it worse.",
        thought: true,
      }),
    ]),
  }),
  archiveExitBlockedLater: Object.freeze({
    allowEscape: true,
    lines: Object.freeze([
      Object.freeze({
        speaker: "Archive Door",
        text: "The doorway has folded into a flat strip of wall. It remembers being an exit, but not for me.",
      }),
    ]),
  }),
  archiveIndex: Object.freeze({
    allowEscape: true,
    lines: Object.freeze([
      Object.freeze({
        speaker: "Index Terminal",
        text: "The terminal lists collections A through V-12. V-13 is missing, but the adjacent shelves still reserve its gap.",
      }),
      Object.freeze({
        speaker: "Voynich",
        text: "Deleted from the search, not from the room.",
        thought: true,
      }),
    ]),
  }),
  archiveIndexUnreadable: Object.freeze({
    allowEscape: true,
    lines: Object.freeze([
      Object.freeze({
        speaker: "Index Terminal",
        text: "A dead cursor blinks beside the archive seal. The search prompt is waiting for someone who knows what to ask.",
      }),
    ]),
  }),
  shelfBeforeIndex: Object.freeze({
    allowEscape: true,
    lines: Object.freeze([
      Object.freeze({
        speaker: "Shelf Marker",
        text: "The shelf labels mean nothing until I know what the archive refuses to list.",
        thought: true,
      }),
    ]),
  }),
  shelfAlreadySearched: Object.freeze({
    allowEscape: true,
    lines: Object.freeze([
      Object.freeze({
        speaker: "Shelf Section",
        text: "Only dust and duplicate folders remain here.",
      }),
    ]),
  }),
  coordinateFolderLocked: Object.freeze({
    allowEscape: true,
    lines: Object.freeze([
      Object.freeze({
        speaker: "Loose Folder",
        text: "The folder is wedged under a collapsed stack. I should finish checking the marked shelves first.",
      }),
    ]),
  }),
  coordinateFolder: Object.freeze({
    allowEscape: true,
    lines: Object.freeze([
      Object.freeze({
        speaker: "Loose Folder",
        text: "Someone wrote V-13 HIGH / LADDER LINE / KEY SEALED inside the folder spine.",
      }),
    ]),
  }),
  ladderNeedsCoordinate: Object.freeze({
    allowEscape: true,
    lines: Object.freeze([
      Object.freeze({
        speaker: "Rolling Ladder",
        text: "It moves along a fixed rail. I need a shelf coordinate before dragging it through the dark.",
      }),
    ]),
  }),
  ladderMoved: Object.freeze({
    allowEscape: true,
    lines: Object.freeze([
      Object.freeze({
        speaker: "Rolling Ladder",
        text: "The ladder stops under the V-13 high shelf. The rail trembles after my hands leave it.",
      }),
    ]),
  }),
  highShelfNeedsLadder: Object.freeze({
    allowEscape: true,
    lines: Object.freeze([
      Object.freeze({
        speaker: "High Shelf",
        text: "The shelf is out of reach. The ladder rail runs directly beneath it.",
      }),
    ]),
  }),
  sealedKeyFound: Object.freeze({
    allowEscape: true,
    lines: Object.freeze([
      Object.freeze({
        speaker: "High Shelf",
        text: "A sealed paper sleeve drops into my hand. The key inside is tagged R-6.",
      }),
    ]),
  }),
  filingCabinetLocked: Object.freeze({
    allowEscape: true,
    lines: Object.freeze([
      Object.freeze({
        speaker: "Filing Cabinet",
        text: "The cabinet refuses the drawer. Its lock is stamped R-6.",
      }),
    ]),
  }),
  filingCabinetOpened: Object.freeze({
    allowEscape: true,
    lines: Object.freeze([
      Object.freeze({
        speaker: "Filing Cabinet",
        text: "The drawer opens onto a photograph, an access card, and a note folded around an empty page slot.",
      }),
    ]),
  }),
  restrictedGateLocked: Object.freeze({
    allowEscape: true,
    lines: Object.freeze([
      Object.freeze({
        speaker: "Restricted Cabinet",
        text: "A card reader glows behind the shelf grille. It wants something issued by the archive itself.",
      }),
    ]),
  }),
  manuscriptReveal: Object.freeze({
    allowEscape: false,
    lines: Object.freeze([
      Object.freeze({
        speaker: "Restricted Cabinet",
        text: "The access card chirps once. The shelves around the center table lose their shadows.",
      }),
      Object.freeze({
        speaker: "Voynich",
        text: "There was a table here the whole time. The dark was arranged around it.",
        thought: true,
      }),
    ]),
  }),
  manuscriptTable: Object.freeze({
    allowEscape: true,
    lines: Object.freeze([
      Object.freeze({
        speaker: "Manuscript Table",
        text: "The glass is black with dust. Something beneath it has been waiting without becoming visible.",
      }),
    ]),
  }),
  trailerArchiveReveal: Object.freeze({
    allowEscape: true,
    lines: Object.freeze([
      Object.freeze({
        speaker: "Trailer Route",
        text: "The archive search is compressed. The manuscript table reveal is now staged for capture.",
      }),
    ]),
  }),
  trailerReveal: Object.freeze({
    allowEscape: true,
    lines: Object.freeze([
      Object.freeze({
        speaker: "Trailer Route",
        text: "Archive reveal state armed. Normal progression has not been changed.",
      }),
    ]),
  }),
});

const GAME_STATES = Object.freeze({
  TITLE: "title",
  SETTINGS: "settings",
  CREDITS: "credits",
  CORRIDOR: "corridor",
  ARCHIVE: "archive",
  MANUSCRIPT: "manuscript",
  PUZZLE: "puzzle",
  DISTORTED: "distorted",
  ENDING: "ending",
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
    prompt: "Read directory",
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
    prompt: "Read security memo",
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
    prompt: "Read maintenance notice",
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
    prompt: "Take maintenance key",
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
    prompt: "Inspect sealed cart",
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
    prompt: "Inspect loose page",
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
    prompt: "Stage manuscript reveal",
    isAvailable: () => TRAILER_MODE && !archiveProgress.manuscriptTableRevealed,
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
    prompt: "Use index terminal",
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
    prompt: "Search shelf A-02",
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
    prompt: "Search shelf C-11",
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
    prompt: "Search shelf V-13",
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
    prompt: "Inspect manuscript table",
    dialogueId: "manuscriptTable",
    isAvailable: () => archiveProgress.manuscriptTableRevealed,
    onInteract: handleManuscriptTableInteract,
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
    prompt: "Inspect moved shelf",
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
    prompt: "Inspect altered photo",
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
    prompt: "Inspect backward clock",
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
    prompt: "Inspect wrong exit sign",
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
    prompt: "Inspect extra door",
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
    prompt: "Try corridor exit",
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
    prompt: "Open duplicate door A-02",
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
    prompt: "Open duplicate door V-13",
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
    prompt: "Open duplicate door R-06",
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
    prompt: "Activate staff switch",
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
    prompt: "Activate restricted switch",
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
    prompt: "Activate removed-page switch",
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
    prompt: "Take missing page",
    isAvailable: () => realityProgress.finalPageVisible && !realityProgress.finalPageCollected,
    onInteract: handleMissingPageInteract,
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
const corridorScene = {
  time: 0,
  grainFrame: 0,
  grainTimer: 0,
  flashlightOn: true,
};
const archiveScene = createArchiveScene();
const manuscriptScene = createManuscriptScene();
const distortedScene = createDistortedScene();
const chapterProgress = createChapterProgress();
const archiveProgress = createArchiveProgress();
const manuscriptProgress = createManuscriptProgress();
const realityProgress = createRealityProgress();
const dialogueState = createDialogueState();
const objectiveState = createObjectiveState(
  TRAILER_MODE ? "enterCode" : "findArchive",
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

audioManager.playMusic("titleTheme", { fadeSeconds: 2.6, volume: 0.34 });
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
  const fadeTokens = new WeakMap();
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
    const path = library.sfx[key];

    if (!canUseAudio || !path || !unlocked) {
      return false;
    }

    const element = createAudioElement(path, `sfx:${key}`, false);
    element.volume = getChannelVolume("sfx") * normalizeVolume(options.volume ?? 1);
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
    const path = library[channel][key];

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

    stopLoop(channel, { fadeSeconds: options.crossfadeSeconds ?? options.fadeSeconds ?? 0.8 });

    const element = createAudioElement(path, `${channel}:${key}`, true);
    const loop = { element, key, volumeScale: normalizeVolume(options.volume ?? 1) };

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
      },
      { once: true },
    );

    return element;
  }

  function safelyPlay(element, assetId) {
    try {
      const playResult = element.play();

      if (playResult?.catch) {
        playResult.catch(() => {
          failedStarts.add(assetId);
        });
      }
    } catch {
      failedStarts.add(assetId);
    }
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
    setSettingsMessage("Settings could not be saved here.");
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
    setSettingsMessage("Settings saved.");
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
    setSettingsMessage("Fullscreen is not available in this browser.");
    return;
  }

  const request = document.fullscreenElement
    ? document.exitFullscreen?.()
    : document.documentElement.requestFullscreen();

  if (request?.then) {
    request
      .then(() => setSettingsMessage(document.fullscreenElement ? "Fullscreen enabled." : "Fullscreen closed."))
      .catch(() => setSettingsMessage("Fullscreen was blocked by the browser."));
    return;
  }

  setSettingsMessage("Fullscreen toggled.");
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
    ladderMoved: false,
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
    selectedFragmentId: MANUSCRIPT_FRAGMENTS[0].id,
    draggingFragmentId: null,
    dragOffsetX: 0,
    dragOffsetY: 0,
    pageReconstructed: false,
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
    state === GAME_STATES.CREDITS
  );
}

function isInterfaceScreenState(state = gameState.current) {
  return isTitleFamilyState(state) || state === GAME_STATES.ENDING;
}

function isGameplayState(state = gameState.current) {
  return (
    state === GAME_STATES.CORRIDOR ||
    state === GAME_STATES.ARCHIVE ||
    state === GAME_STATES.MANUSCRIPT ||
    state === GAME_STATES.DISTORTED
  );
}

function shouldHideCaptureUi() {
  return TRAILER_MODE && cinematicCaptureActive;
}

function getTitleMenuOptions() {
  const options = [
    Object.freeze({ label: "Start", action: TITLE_MENU_ACTIONS.START }),
  ];

  if (runtimeSession.valid) {
    options.push(Object.freeze({ label: "Continue", action: TITLE_MENU_ACTIONS.CONTINUE }));
  }

  options.push(
    Object.freeze({ label: "Settings", action: TITLE_MENU_ACTIONS.SETTINGS }),
    Object.freeze({ label: "Credits", action: TITLE_MENU_ACTIONS.CREDITS }),
    Object.freeze({ label: "Exit", action: TITLE_MENU_ACTIONS.EXIT }),
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
  }
}

function updateEndingControls() {
  if (gameState.current !== GAME_STATES.ENDING || controlsState.open || transitionState.active) {
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
    Object.freeze({ label: "Restart", action: ENDING_MENU_ACTIONS.RESTART }),
    Object.freeze({ label: "Title", action: ENDING_MENU_ACTIONS.TITLE }),
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
    titleMenuState.exitMessage = "You may close this tab.";
    titleMenuState.exitMessageTimer = 4.5;
  }
}

function startNewGameFromTitle() {
  resetRunProgressForNewGame();
  runtimeSession.valid = true;
  runtimeSession.state = GAME_STATES.CORRIDOR;
  runtimeSession.playerX = PLAYER_CONFIG.SPAWN_X;
  runtimeSession.facing = 1;
  startSceneTransition(GAME_STATES.CORRIDOR, {
    spawnX: PLAYER_CONFIG.SPAWN_X,
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
  Object.assign(manuscriptProgress, createManuscriptProgress());
  Object.assign(realityProgress, createRealityProgress());
  Object.assign(keypadState, createKeypadState());
  Object.assign(inspectOverlayState, createInspectOverlayState());
  endingState.selectedIndex = 0;
  endingState.pendingAfterInspect = false;
  endingState.reached = false;
  debug.showOverlay = false;
  closeDialogue();
  setJournalOpen(false, { silent: true });
  controlsState.open = false;
  objectiveState.currentId = TRAILER_MODE ? "enterCode" : "findArchive";
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

function updateRuntimeSessionSnapshot() {
  if (!isGameplayState() || transitionState.active) {
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
  audioManager.playMusic("titleTheme", { fadeSeconds: 1.2, volume: 0.34 });
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
  updateDialogue(deltaSeconds);
  updateJournalControls();
  updateKeypad(deltaSeconds);
  updateInspectOverlayControls();
  updateObjectiveState(deltaSeconds);
  updateTransition(deltaSeconds);

  if (gameState.current === GAME_STATES.CORRIDOR) {
    updateCorridorScene(corridorScene, deltaSeconds);
  } else if (gameState.current === GAME_STATES.ARCHIVE) {
    updateArchiveScene(archiveScene, deltaSeconds);
  } else if (gameState.current === GAME_STATES.MANUSCRIPT) {
    updateManuscriptScene(manuscriptScene, deltaSeconds);
  } else if (gameState.current === GAME_STATES.DISTORTED) {
    updateDistortedScene(distortedScene, deltaSeconds);
  }

  updateInteractionPrompt();
  updatePlayer(player, deltaSeconds);
  updateCamera(camera, player, deltaSeconds);
  updateRuntimeSessionSnapshot();
  input.finishFrame();
  mouse.finishFrame();
}

function getCurrentWorld() {
  if (gameState.current === GAME_STATES.ARCHIVE) {
    return ARCHIVE_WORLD;
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

  return WORLD;
}

function getActiveVisualScene() {
  if (gameState.current === GAME_STATES.ARCHIVE) {
    return archiveScene;
  }

  if (gameState.current === GAME_STATES.MANUSCRIPT) {
    return manuscriptScene;
  }

  if (gameState.current === GAME_STATES.DISTORTED) {
    return distortedScene;
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

  if (targetState === GAME_STATES.ARCHIVE) {
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

  if (targetState === GAME_STATES.ARCHIVE) {
    enterArchiveScene();
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

  if (targetState === GAME_STATES.ENDING) {
    enterEndingScene();
  }
}

function enterTitleScene() {
  audioManager.stopAmbience({ fadeSeconds: 0.8 });
  audioManager.playMusic("titleTheme", { fadeSeconds: 1.8, volume: 0.34 });
}

function enterArchiveScene() {
  const firstEntry = !archiveProgress.entered;

  archiveProgress.entered = true;
  completeObjective("enterArchive");

  if (manuscriptProgress.realityChanged) {
    startRealityChangeChapter();
    audioManager.playAmbience("archiveRoomTone", { fadeSeconds: 1.6, volume: 0.12 });
  } else {
    setCurrentObjective(
      archiveProgress.manuscriptTableRevealed ? "inspectManuscript" : "locateRestricted",
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

function enterCorridorScene() {
  audioManager.playAmbience("corridorRoomTone", { fadeSeconds: 1.5, volume: 0.72 });
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
  audioManager.playAmbience("distortedCorridorTone", { fadeSeconds: 1.8, volume: 0.38 });
  audioManager.playMusic("distortedPulse", {
    fadeSeconds: 2.2,
    volume: getDistortedMusicVolume(),
  });
  audioManager.playSfx("reverseElectricalHum", { volume: 0.42 });
  audioManager.playSfx("distantFootsteps", { volume: 0.24 });
}

function enterEndingScene() {
  endingState.reached = true;
  endingState.selectedIndex = 0;
  runtimeSession.valid = false;
  audioManager.stopAmbience({ fadeSeconds: 1 });
  audioManager.playMusic("endingTheme", { fadeSeconds: 2.6, volume: 0.26 });
}

function startRealityChangeChapter() {
  if (!realityProgress.chapterStarted) {
    realityProgress.chapterStarted = true;
    realityProgress.archiveReturnSeen = true;
    setCurrentObjective("findMissingPage");
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
  const forceDebugHidden = TRAILER_MODE || cinematicCaptureActive || isInterfaceScreenState();

  if (forceDebugHidden) {
    debug.showOverlay = false;
  } else if (input.wasPressed("F2")) {
    debug.showOverlay = !debug.showOverlay;
    audioManager.playSfx("debugToggle");
  }

  if (isInterfaceScreenState()) {
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
    !inspectOverlayState.active
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
      ? "Cinematic capture enabled."
      : "Cinematic capture disabled.";
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
  realityProgress.message = "Trailer: changed archive forced.";
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
  realityProgress.message = "Trailer: final page reveal forced.";
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
    if (visibleCount >= dialogueState.lastTickCharacter + 3) {
      dialogueState.lastTickCharacter = visibleCount;
      audioManager.playSfx("dialogueTick", { volume: 0.36 });
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
    audioManager.playSfx("interactionPrompt", { volume: 0.28 });
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

function updateArchiveScene(scene, deltaSeconds) {
  scene.time += deltaSeconds;
  scene.grainTimer += deltaSeconds;
  realityProgress.messageTimer = Math.max(0, realityProgress.messageTimer - deltaSeconds);

  while (scene.grainTimer >= 0.08) {
    scene.grainTimer -= 0.08;
    scene.grainFrame = (scene.grainFrame + 3) % 997;
  }
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
    audioManager.playAmbience("distortedCorridorTone", { fadeSeconds: 1.6, volume: 0.34 });
    audioManager.playMusic("distortedPulse", {
      fadeSeconds: 1.8,
      volume: getDistortedMusicVolume(),
    });
  }
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
    inspectOverlayState.active
  ) {
    return;
  }

  if (handleManuscriptChromeInput()) {
    return;
  }

  if (TRAILER_MODE && handleManuscriptDeveloperShortcut()) {
    return;
  }

  if (manuscriptProgress.stage === MANUSCRIPT_STAGES.RECONSTRUCT) {
    updatePageReconstructionInput();
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

    if (selected && isPointInRect(mouse.x, mouse.y, rotateLeft)) {
      rotateSelectedFragment(-1);
      return;
    }

    if (selected && isPointInRect(mouse.x, mouse.y, rotateRight)) {
      rotateSelectedFragment(1);
      return;
    }

    const clickedFragment = getFragmentAtPoint(mouse.x, mouse.y);
    if (clickedFragment && !clickedFragment.placed) {
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
    dragging.x = clamp(mouse.x - manuscriptProgress.dragOffsetX, 26, CANVAS_WIDTH - dragging.width - 20);
    dragging.y = clamp(mouse.y - manuscriptProgress.dragOffsetY, 48, CANVAS_HEIGHT - dragging.height - 24);
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
    selected.x = clamp(selected.x - moveAmount, 26, CANVAS_WIDTH - selected.width - 20);
    setManuscriptCooldown(0.04);
  }

  if (input.wasPressed("ArrowRight") || input.wasPressed("KeyD")) {
    selected.x = clamp(selected.x + moveAmount, 26, CANVAS_WIDTH - selected.width - 20);
    setManuscriptCooldown(0.04);
  }

  if (input.wasPressed("ArrowUp")) {
    selected.y = clamp(selected.y - moveAmount, 48, CANVAS_HEIGHT - selected.height - 24);
    setManuscriptCooldown(0.04);
  }

  if (input.wasPressed("ArrowDown")) {
    selected.y = clamp(selected.y + moveAmount, 48, CANVAS_HEIGHT - selected.height - 24);
    setManuscriptCooldown(0.04);
  }

  if (input.wasPressed("KeyQ")) {
    rotateSelectedFragment(-1);
  }

  if (input.wasPressed("KeyE")) {
    rotateSelectedFragment(1);
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
    manuscriptProgress.message = "Sequence cleared.";
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
  for (let index = manuscriptProgress.fragments.length - 1; index >= 0; index -= 1) {
    const fragment = manuscriptProgress.fragments[index];

    if (
      x >= fragment.x &&
      x <= fragment.x + fragment.width &&
      y >= fragment.y &&
      y <= fragment.y + fragment.height
    ) {
      return fragment;
    }
  }

  return null;
}

function rotateSelectedFragment(direction) {
  const fragment = getSelectedFragment();

  if (!fragment || fragment.placed) {
    return;
  }

  fragment.rotation = wrapRotation(fragment.rotation + direction, 4);
  audioManager.playSfx("pageMovement", { volume: 0.45 });
  trySnapFragment(fragment);
  setManuscriptCooldown(0.12);
}

function trySnapFragment(fragment) {
  const data = getFragmentData(fragment.id);
  const distance = Math.hypot(fragment.x - data.targetX, fragment.y - data.targetY);

  if (distance <= MANUSCRIPT_VIEW.SNAP_DISTANCE && fragment.rotation === data.targetRotation) {
    fragment.x = data.targetX;
    fragment.y = data.targetY;
    fragment.rotation = data.targetRotation;
    fragment.placed = true;
    audioManager.playSfx("fragmentPlacement", { volume: 0.58 });
    checkPageReconstructionCompletion();
    return true;
  }

  manuscriptProgress.message = "Close, but the tear and marking must both line up.";
  manuscriptProgress.messageTimer = 1.8;
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
  manuscriptProgress.marginMarksRevealed = true;
  manuscriptProgress.stage = MANUSCRIPT_STAGES.SYMBOLS;
  manuscriptProgress.message = "Margin marks surfaced in the repaired seam.";
  manuscriptProgress.messageTimer = 3;
  collectClue("reconstructedMargin");
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
    manuscriptProgress.message = "The ink recoils. That order does not match the records.";
    manuscriptProgress.messageTimer = 2.5;
    audioManager.playSfx("incorrectPuzzle", { volume: 0.68 });
    setManuscriptCooldown(0.28);
    return;
  }

  manuscriptProgress.symbolStageSolved = true;
  manuscriptProgress.message = "The three marks hold in the margin. The last page ring can be moved.";
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
  manuscriptProgress.message = "Rings reset.";
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
    return { x: 430, y: 274, width: 76, height: MANUSCRIPT_VIEW.BUTTON_HEIGHT };
  }

  if (id === "rotateRight") {
    return { x: 518, y: 274, width: 76, height: MANUSCRIPT_VIEW.BUTTON_HEIGHT };
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
    dialogueState.active ||
    journalState.open ||
    keypadState.active ||
    inspectOverlayState.active ||
    controlsState.open ||
    gameState.current === GAME_STATES.MANUSCRIPT ||
    transitionState.active
  );
}

function shouldShowInteractionPrompt() {
  return (
    (gameState.current === GAME_STATES.CORRIDOR ||
      gameState.current === GAME_STATES.ARCHIVE ||
      gameState.current === GAME_STATES.DISTORTED) &&
    !dialogueState.active &&
    !journalState.open &&
    !keypadState.active &&
    !inspectOverlayState.active &&
    !controlsState.open &&
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
  collectClue(definition.clueId);
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

  if (chapterProgress.powerReset) {
    setCurrentObjective(getNextCodeObjectiveId());
    startDialogue("powerReset");
    return;
  }

  chapterProgress.electricalCabinetOpen = true;
  chapterProgress.powerReset = true;
  collectClue("powerReset");
  audioManager.playSfx("powerReturn");
  startDialogue("powerReset");
  setCurrentObjective(getNextCodeObjectiveId());
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
      realityProgress.message = "The exit sign points away from itself. Three changes still need names.";
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

function loopChangedArchiveExit() {
  realityProgress.archiveExitLooped = true;
  realityProgress.message = "The threshold returns you to the same room. The archive has started correcting itself.";
  realityProgress.messageTimer = 4;
  player.x = ARCHIVE_WORLD.ENTRANCE_X + 22;
  player.velocityX = 0;
  clampCameraToCurrentWorld(camera, player);
  setCurrentObjective("noticeArchiveChanges");
  audioManager.playSfx("corridorLoop", { volume: 0.56 });
  audioManager.playSfx("reverseElectricalHum", { volume: 0.36 });
}

function handleTrailerArchiveRevealInteract() {
  if (!TRAILER_MODE) {
    return;
  }

  revealManuscriptTable({ trailer: true });
}

function handleArchiveIndexInteract(definition) {
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

  archiveProgress.ladderX = clamp(
    ARCHIVE_ROOM.LADDER_TARGET_X,
    ARCHIVE_ROOM.LADDER_MIN_X,
    ARCHIVE_ROOM.LADDER_MAX_X,
  );
  archiveProgress.ladderMoved = true;
  audioManager.playSfx("ladderMove", { volume: 0.58 });
  startDialogue("ladderMoved");
  completeObjective("moveArchiveLadder");
  setCurrentObjective("retrieveStorageKey");
}

function handleArchiveHighShelfInteract() {
  if (!archiveProgress.ladderMoved) {
    startDialogue("highShelfNeedsLadder");
    setCurrentObjective("moveArchiveLadder");
    return;
  }

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
      "Cabinet R-6",
      "The drawer is open. Empty folder slots surround the photograph, card imprint, and removed-page note already copied into the journal.",
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
    realityProgress.message = "It looks almost normal until you try to leave.";
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
      "Exit sign",
      "The arrow points deeper into the archive, but its reflected shadow points to the door.",
    );
    return;
  }

  showInspectOverlay(
    "Extra door",
    "The door has no hinges and no room behind it on any map you collected.",
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
  realityProgress.message = "The exit opens onto the same corridor. The wall marks have changed.";
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
    realityProgress.message = "The duplicate doors share too many symbols. The archive changes are the key.";
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
  realityProgress.message = "False door. The corridor returns you safely, but one detail changes.";
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
    realityProgress.message = "The switches fall back into the wall. The order starts with staff assignment.";
    realityProgress.messageTimer = 3.2;
    audioManager.playSfx("incorrectPuzzle", { volume: 0.58 });
    return;
  }

  realityProgress.switchSequence.push(definition.switchId);
  audioManager.playSfx("wallSwitch", { volume: 0.56 });

  if (realityProgress.switchSequence.length < DISTORTED_CORRIDOR.SWITCH_ORDER.length) {
    realityProgress.message = `${realityProgress.switchSequence.length}/3 switches accepted.`;
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
    "Missing page",
    "The page is real under the light. The ink is dry, but the shadow beneath it is still moving.",
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
  return chapterProgress.archiveDoorUnlocked ? "Open archive door" : "Inspect archive door";
}

function getArchiveExitPrompt() {
  if (!manuscriptProgress.realityChanged) {
    return "Return to corridor";
  }

  if (!realityProgress.archiveExitLooped) {
    return "Try archive exit";
  }

  if (realityProgress.discoveredSymbols.size < REALITY_CHANGE_SYMBOLS.length) {
    return "Test wrong exit";
  }

  return "Enter distorted corridor";
}

function getCoordinateFolderPrompt() {
  return hasSearchedAllArchiveShelves() ? "Search loose folder" : "Inspect loose folder";
}

function getArchiveLadderPrompt() {
  return archiveProgress.ladderMoved ? "Inspect ladder" : "Move rolling ladder";
}

function getArchiveHighShelfPrompt() {
  return archiveProgress.ladderMoved ? "Retrieve sealed key" : "Inspect high shelf";
}

function getArchiveFilingCabinetPrompt() {
  if (archiveProgress.filingCabinetUnlocked) {
    return "Inspect open cabinet";
  }

  return archiveProgress.sealedStorageKeyCollected
    ? "Use sealed key"
    : "Inspect locked cabinet";
}

function getArchiveRestrictedCabinetPrompt() {
  if (archiveProgress.manuscriptTableRevealed) {
    return "Inspect restricted cabinet";
  }

  return archiveProgress.accessCardFound
    ? "Use archive access card"
    : "Inspect restricted cabinet";
}

function getLockPanelPrompt() {
  return chapterProgress.powerReset ? "Use archive keypad" : "Inspect dead keypad";
}

function getElectricalCabinetPrompt() {
  if (chapterProgress.powerReset) {
    return "Inspect electrical cabinet";
  }

  if (chapterProgress.maintenanceKeyCollected) {
    return "Use maintenance key";
  }

  return "Inspect electrical cabinet";
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
  const shouldEnterEnding =
    endingState.pendingAfterInspect &&
    gameState.current === GAME_STATES.DISTORTED &&
    realityProgress.finalPageCollected;

  inspectOverlayState.active = false;
  inspectOverlayState.title = "";
  inspectOverlayState.text = "";
  inspectOverlayState.clueId = null;

  if (shouldEnterEnding && !transitionState.active) {
    endingState.pendingAfterInspect = false;
    startSceneTransition(GAME_STATES.ENDING, {
      spawnX: player.x,
      facing: player.facing,
      duration: getTrailerAdjustedDuration(0.86),
      doorSfx: null,
    });
  }
}

function openKeypad() {
  keypadState.active = true;
  keypadState.enteredCode = "";
  keypadState.message = "Enter four digits.";
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
    keypadState.message = "Four digits required.";
    keypadState.messageTimer = 2.2;
    audioManager.playSfx("wrongCode");
    return;
  }

  if (!TRAILER_MODE && !hasRequiredNormalInvestigation()) {
    keypadState.message = "Sequence rejected. Missing context.";
    keypadState.messageTimer = 2.8;
    keypadState.enteredCode = "";
    audioManager.playSfx("wrongCode");
    return;
  }

  if (keypadState.enteredCode !== ARCHIVE_CODE) {
    keypadState.message = "Incorrect code.";
    keypadState.messageTimer = 2.5;
    keypadState.enteredCode = "";
    audioManager.playSfx("wrongCode");
    return;
  }

  keypadState.message = "Accepted.";
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
    audioManager.playSfx("clueCollected");
    objectiveState.bannerText = `Clue collected: ${CLUE_DATA[clueId].title}`;
    objectiveState.bannerTimer = 4;
  }
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
  objectiveState.bannerText = `Completed: ${OBJECTIVE_DATA[objectiveId].title}`;
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
  } else if (gameState.current === GAME_STATES.MANUSCRIPT) {
    drawManuscriptInspectionScene(manuscriptScene);
  } else if (gameState.current === GAME_STATES.DISTORTED) {
    drawDistortedCorridorScene(camera, distortedScene);
    drawPlayer(player, camera, distortedScene);
    drawDistortedSceneEffects(distortedScene, player, camera);
  } else {
    drawPlaceholderState();
  }

  if (
    debug.showOverlay &&
    debug.showCollisionBoxes &&
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
  drawDialoguePanel();
  drawControlsHint();
  drawControlsOverlay();
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
  context.fillText("VOYNICH", 70, 62);
  context.fillStyle = "#b6b091";
  context.font = "15px monospace";
  context.fillText("Some truths are never meant to be discovered.", 74, 116);

  options.forEach((option, index) => {
    drawMenuButton(
      getTitleButtonRect(index, options.length),
      option.label,
      index === titleMenuState.selectedIndex,
    );
  });

  context.fillStyle = "#68787c";
  context.font = "11px monospace";
  context.fillText("Arrow keys, E, Enter, or mouse", 244, 328);

  if (TRAILER_MODE && !shouldHideCaptureUi()) {
    context.fillStyle = "#d8c16f";
    context.fillText("Trailer route enabled. F6-F10 shortcuts are isolated from normal mode.", 48, 18);
  }

  if (titleMenuState.exitMessageTimer > 0 && titleMenuState.exitMessage) {
    context.fillStyle = "#d8c16f";
    context.font = "13px monospace";
    context.fillText(titleMenuState.exitMessage, 244, 306);
  }
}

function drawSettingsScreen() {
  drawSubscreenPanel("SETTINGS", "Escape or Back returns");

  SETTINGS_ITEMS.forEach((item, index) => {
    drawSettingsItem(item, index, index === settingsMenuState.selectedIndex);
  });

  context.fillStyle = "#68787c";
  context.font = "11px monospace";
  context.fillText("Left / Right adjusts selected ranges. Enter or E confirms.", 126, 314);

  if (settingsMenuState.messageTimer > 0 && settingsMenuState.message) {
    context.fillStyle = "#d8c16f";
    context.font = "12px monospace";
    context.fillText(settingsMenuState.message, 396, 54);
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
  context.fillText(item.label, row.x + 10, row.y + 5);

  if (item.type === "range") {
    drawSettingsSlider(item, index);
    return;
  }

  context.fillStyle = item.type === "toggle" && settings[item.id] ? "#d8c16f" : "#839296";
  context.fillText(formatSettingValue(item), row.x + row.width - 94, row.y + 5);
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
  drawSubscreenPanel("CREDITS", "E, Enter, Escape, or mouse returns");

  context.fillStyle = "#e0ddca";
  context.font = "15px monospace";
  context.fillText("Created by Sohbal Jain and Ishaan Aggarwal.", 126, 92);

  context.fillStyle = "#aebabc";
  context.font = "12px monospace";
  drawWrappedText(
    "The concept, story, and game design for VOYNICH are original.",
    126,
    124,
    390,
    16,
  );

  context.fillStyle = "#d8c16f";
  context.font = "13px monospace";
  context.fillText("Licensed audio", 126, 178);
  context.fillStyle = "#88989c";
  context.font = "11px monospace";
  context.fillText("Add track names, creators, licenses, and source links here before shipping.", 126, 199);

  context.fillStyle = "#d8c16f";
  context.font = "13px monospace";
  context.fillText("Licensed assets", 126, 230);
  context.fillStyle = "#88989c";
  context.font = "11px monospace";
  context.fillText("Add external asset credits here only after licensed assets are added.", 126, 251);

  drawMenuButton(getCreditsBackButtonRect(), "Back", true);
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
  context.fillText("THE MISSING PAGE", 192, 86);
  context.fillStyle = "#b9b293";
  context.font = "13px monospace";
  drawWrappedText(
    "The archive is quiet again. That does not mean it has let you leave.",
    178,
    128,
    292,
    18,
  );

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
  context.fillText("Arrow keys, E, Enter, or mouse", 224, 298);
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
  context.fillText(title, panel.x + 24, panel.y + 18);
  context.fillStyle = "#68787c";
  context.font = "11px monospace";
  context.fillText(hint, panel.x + panel.width - measureTextWidth(hint, "11px monospace") - 22, panel.y + 25);
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
  context.fillText(label, rect.x + 18, rect.y + 7);
}

function getTitleButtonRect(index, total) {
  const width = 166;
  const height = 28;
  const x = 238;
  const startY = total > 4 ? 154 : 168;

  return {
    x,
    y: startY + index * 34,
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
    return typeof document !== "undefined" && document.fullscreenElement ? "Exit" : "Open";
  }

  if (item.id === "back") {
    return "Return";
  }

  if (item.id === "textSpeed") {
    return `${Math.round(settings.textSpeed)} cps`;
  }

  if (item.type === "range") {
    return `${Math.round(settings[item.id] * 100)}%`;
  }

  if (item.type === "toggle") {
    return settings[item.id] ? "On" : "Off";
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
      shelf.mark === "V-13"
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
    context.fillText("EXIT  --->", signX + 14, 101);
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
  const glow = manuscriptProgress.marginMarksRevealed || manuscriptProgress.stage !== MANUSCRIPT_STAGES.RECONSTRUCT;
  const symbols = glow ? MANUSCRIPT_SYMBOL_SEQUENCE : ["maintenance", "staff", "removed"];

  symbols.forEach((symbolId, index) => {
    const markY = y + index * 48;
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
  drawStageTitle("Stage 1", "Page reconstruction");
  drawPageOutline();
  drawFragments(scene);
  drawStageMessage("Place all four fragments. Match the torn edge and rotate markings.");
  drawButton(getPuzzleButtonRect("rotateLeft"), "Rotate -");
  drawButton(getPuzzleButtonRect("rotateRight"), "Rotate +");
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
  manuscriptProgress.fragments.forEach((fragment) => {
    const data = getFragmentData(fragment.id);
    const selected = fragment.id === manuscriptProgress.selectedFragmentId;

    drawTornFragment(fragment, data, scene.time, selected);
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
    context.strokeStyle = "#d8c16f";
    context.lineWidth = 2;
    context.strokeRect(
      -fragment.width / 2 - 3,
      -fragment.height / 2 - 3,
      fragment.width + 6,
      fragment.height + 6,
    );
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
  drawStageTitle("Stage 2", "Symbol interpretation");
  drawStageMessage("Use the records in the journal. The margin order is staff, restricted access, removed page.");
  drawSymbolMappingPanel();
  drawSymbolSequenceSlots();

  MANUSCRIPT_SYMBOLS.forEach((symbol, index) => {
    const rect = getSymbolButtonRect(index);
    const selected = index === manuscriptProgress.selectedSymbolIndex;
    const chosen = manuscriptProgress.symbolSequence.includes(symbol.id);

    drawSymbolButton(symbol, rect, selected, chosen);
  });

  if (manuscriptProgress.symbolStageSolved) {
    drawButton(getBeginAlignmentButtonRect(), "Begin final alignment");
  }

  drawInkPulse(scene);
}

function drawSymbolMappingPanel() {
  const x = 418;
  const y = 74;

  context.fillStyle = "rgba(7, 10, 12, 0.72)";
  context.fillRect(x, y, 182, 138);
  context.strokeStyle = "#303f45";
  context.strokeRect(x + 0.5, y + 0.5, 182, 138);
  context.fillStyle = "#d8d7c8";
  context.font = "12px monospace";
  context.fillText("Journal mappings", x + 12, y + 10);

  MANUSCRIPT_SYMBOLS.forEach((symbol, index) => {
    const clueKnown = chapterProgress.clues.has(symbol.clueId);
    const rowY = y + 34 + index * 25;

    drawOriginalSymbol(symbol.id, x + 16, rowY, 0.68, false);
    context.fillStyle = clueKnown ? "#cfc5a0" : "#6b7375";
    context.font = "10px monospace";
    context.fillText(symbol.classLabel, x + 38, rowY - 4);
    context.fillStyle = clueKnown ? "#7f9094" : "#4c5659";
    context.fillRect(x + 38, rowY + 10, clueKnown ? 82 : 38, 2);
  });
}

function drawSymbolSequenceSlots() {
  const x = 102;
  const y = 94;

  context.fillStyle = "rgba(28, 18, 12, 0.24)";
  context.fillRect(x - 14, y - 14, 232, 58);
  context.fillStyle = "#8c7d55";
  context.font = "11px monospace";
  context.fillText("Margin sequence", x, y - 28);

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
  drawStageTitle("Stage 3", "Missing-page alignment");
  drawStageMessage("Rotate each ring until the broken lines form one complete mark.");
  drawManuscriptRings(scene);
  drawButton(getRingRotateLeftButtonRect(), "Rotate -");
  drawButton(getRingRotateRightButtonRect(), "Rotate +");
  drawButton(getStageThreeBackButtonRect(), "Back");
  drawButton(getStageThreeResetButtonRect(), "Reset");
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
    context.font = "11px monospace";
    context.fillText(
      `${ringData.label}: ${ring.rotation}`,
      420,
      112 + index * 24,
    );
  });

  drawOriginalSymbol("removed", cx - 16, cy - 15, 1.5, true);
}

function drawSolvedManuscriptStage(scene) {
  drawStageTitle("Solved", "The page is no longer paper");
  context.globalAlpha = 0.72;
  drawOriginalSymbol("removed", 286, 160, 3.4, true);
  context.globalAlpha = 1;
  drawStageMessage("The archive has accepted the missing page. Reality is changing.");
}

function drawManuscriptChrome() {
  context.fillStyle = "#d8d7c8";
  context.font = "17px monospace";
  context.textBaseline = "top";
  context.fillText("VOYNICH MANUSCRIPT", 28, 16);

  drawButton(getControlsButtonRect(), "C Controls");

  if (canCloseManuscriptInspection()) {
    drawButton(getCloseManuscriptButtonRect(), "Close");
  }

  if (TRAILER_MODE && !shouldHideCaptureUi() && !manuscriptProgress.finalTriggered) {
    drawButton(getDeveloperCompleteButtonRect(), "DEV: Complete current stage");
  }

  if (manuscriptProgress.messageTimer > 0 && manuscriptProgress.message) {
    context.fillStyle = "#d8c16f";
    context.font = "12px monospace";
    drawWrappedText(manuscriptProgress.message, 54, 314, 330, 14);
  }
}

function drawStageTitle(label, title) {
  context.fillStyle = "#8fa0a4";
  context.font = "12px monospace";
  context.fillText(label, MANUSCRIPT_VIEW.PANEL_X, MANUSCRIPT_VIEW.PANEL_Y);
  context.fillStyle = "#e1ddca";
  context.font = "17px monospace";
  context.fillText(title, MANUSCRIPT_VIEW.PANEL_X, MANUSCRIPT_VIEW.PANEL_Y + 18);
}

function drawStageMessage(text) {
  context.fillStyle = "#9ba9ad";
  context.font = "11px monospace";
  drawWrappedText(text, MANUSCRIPT_VIEW.PANEL_X, MANUSCRIPT_VIEW.PANEL_Y + 48, 180, 13);
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
  context.fillText(label, rect.x + 8, rect.y + 7);
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

  if (symbolId === "staff") {
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
  context.fillText("ARCHIVE", x + 17, y + 6);
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
  if (journalState.open || keypadState.active || isInterfaceScreenState() || shouldHideCaptureUi()) {
    return;
  }

  const objective = OBJECTIVE_DATA[objectiveState.currentId];
  const alpha = objectiveState.bannerTimer > 0 ? 0.94 : 0.34;
  const x = 360;
  const y = 18;
  const width = 256;
  const height = 46;

  context.globalAlpha = alpha;
  context.fillStyle = "rgba(4, 7, 10, 0.72)";
  context.fillRect(x, y, width, height);
  context.fillStyle = "rgba(164, 181, 184, 0.28)";
  context.fillRect(x, y, width, 2);
  context.fillStyle = "#d8d7c8";
  context.font = "13px monospace";
  context.textBaseline = "top";
  context.fillText(objective.title, x + 10, y + 8);
  context.fillStyle = "#93a3a6";
  context.font = "11px monospace";
  context.fillText(objective.detail, x + 10, y + 27);
  context.globalAlpha = 1;
}

function drawRealityMessage() {
  if (
    realityProgress.messageTimer <= 0 ||
    !realityProgress.message ||
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
  drawWrappedText(realityProgress.message, x + 12, y + 10, width - 24, 14);
}

function drawControlsHint() {
  if (
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

  const text = "C Controls";
  const width = Math.ceil(measureTextWidth(text, "11px monospace")) + 18;
  const x = 18;
  const y = CANVAS_HEIGHT - 28;

  context.fillStyle = "rgba(3, 5, 7, 0.64)";
  context.fillRect(x, y, width, 20);
  context.fillStyle = "#9ba9ad";
  context.font = "11px monospace";
  context.textBaseline = "top";
  context.fillText(text, x + 9, y + 5);
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
  context.fillText("CONTROLS", x + 22, y + 18);

  context.fillStyle = "#8fa0a4";
  context.font = "11px monospace";
  context.fillText("C or Escape closes", x + width - 132, y + 23);

  drawControlsColumn(x + 24, y + 60, "Exploration", [
    "A / D or Left / Right: move",
    "E: interact, advance dialogue",
    "F: flashlight",
    "J: journal",
    "F2: debug overlay",
  ]);

  drawControlsColumn(x + 24, y + 164, "Journal and keypad", [
    "Journal A / D: clue pages",
    "Numbers: keypad digits",
    "Backspace: erase digit",
    "Enter or E: submit",
    "Escape: close open panel",
  ]);

  drawControlsColumn(x + 270, y + 60, "Manuscript puzzles", [
    "Mouse: select, drag, press buttons",
    "Tab or 1-4: choose fragment",
    "Arrows: move selected item",
    "Q / E: rotate selected item",
    "Enter: place, choose, or rotate",
    "R: reset sequence or rings",
    "B: back from final rings",
  ]);

  if (TRAILER_MODE && !shouldHideCaptureUi()) {
    context.fillStyle = "#d8c16f";
    context.font = "11px monospace";
    context.fillText("Trailer only: F6 changed archive, F7 silhouette, F8 glitch, F9 final, F10 capture.", x + 270, y + 250);
  }
}

function drawControlsColumn(x, y, title, lines) {
  context.fillStyle = "#d8c16f";
  context.font = "13px monospace";
  context.fillText(title, x, y);

  context.fillStyle = "#b8c3c5";
  context.font = "11px monospace";
  lines.forEach((line, index) => {
    context.fillText(line, x, y + 22 + index * 15);
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

  const prompt = `[E] ${getInteractablePrompt(interactionState.activeInteractable)}`;
  const x = Math.round(CANVAS_WIDTH / 2 - measureTextWidth(prompt, "15px monospace") / 2 - 12);
  const y = 306;
  const width = Math.ceil(measureTextWidth(prompt, "15px monospace")) + 24;

  context.fillStyle = "rgba(3, 5, 7, 0.82)";
  context.fillRect(x, y, width, 30);
  context.fillStyle = "rgba(214, 203, 143, 0.38)";
  context.fillRect(x, y, width, 2);
  context.fillStyle = "#e0ddc8";
  context.font = "15px monospace";
  context.textBaseline = "top";
  context.fillText(prompt, x + 12, y + 8);
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
  context.fillText("JOURNAL", panelX + 22, panelY + 18);

  context.font = "14px monospace";
  context.fillStyle = "#b8c3c5";
  context.fillText("Current objective", panelX + 24, panelY + 58);
  context.fillStyle = "#e2dbc4";
  context.fillText(objective.title, panelX + 24, panelY + 80);
  context.fillStyle = "#8fa0a4";
  context.font = "12px monospace";
  context.fillText(objective.detail, panelX + 24, panelY + 101);

  context.fillStyle = "#b8c3c5";
  context.font = "14px monospace";
  context.fillText("Collected clues", panelX + 24, panelY + 136);

  const clueIds = Array.from(chapterProgress.clues);
  const cluesPerPage = 2;
  const pageCount = getJournalPageCount();
  const pageStart = journalState.cluePage * cluesPerPage;
  const visibleClues = clueIds.slice(pageStart, pageStart + cluesPerPage);

  context.font = "12px monospace";
  if (clueIds.length === 0) {
    context.fillStyle = "#65777b";
    context.fillText("No clues recorded.", panelX + 24, panelY + 160);
  } else {
    visibleClues.forEach((clueId, index) => {
      const clue = CLUE_DATA[clueId];
      const y = panelY + 158 + index * 58;
      context.fillStyle = "#d0c8ad";
      context.fillText(clue.title, panelX + 24, y);
      context.fillStyle = "#7f9094";
      drawWrappedText(clue.text, panelX + 42, y + 14, panelWidth - 74, 13);
    });

  }

  context.fillStyle = "#68787c";
  context.font = "11px monospace";
  const pageText =
    pageCount > 1
      ? `A/D pages ${journalState.cluePage + 1}/${pageCount} - ${clueIds.length} clues`
      : `${clueIds.length} clues`;
  context.fillText(pageText, panelX + 24, panelY + panelHeight - 24);
  context.fillText("J / Escape closes", panelX + panelWidth - 132, panelY + panelHeight - 24);
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
  context.fillText(inspectOverlayState.title, panelX + 18, panelY + 18);

  context.fillStyle = "#aab7ba";
  context.font = "13px monospace";
  drawWrappedText(inspectOverlayState.text, panelX + 20, panelY + 52, panelWidth - 40, 17);

  if (inspectOverlayState.clueId) {
    context.fillStyle = "#756f4a";
    context.font = "11px monospace";
    context.fillText("Copied to journal", panelX + 20, panelY + panelHeight - 25);
  }

  context.fillStyle = "#68787c";
  context.font = "11px monospace";
  context.fillText("E / Enter / Escape", panelX + panelWidth - 124, panelY + panelHeight - 25);
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

  const text = "Click or press any key to enable audio";
  const width = Math.ceil(measureTextWidth(text, "12px monospace")) + 28;
  const x = Math.round((CANVAS_WIDTH - width) / 2);
  const y = 18;

  context.fillStyle = "rgba(3, 6, 9, 0.86)";
  context.fillRect(x, y, width, 28);
  context.strokeStyle = "#38484f";
  context.lineWidth = 1;
  context.strokeRect(x + 0.5, y + 0.5, width, 28);
  context.fillStyle = "#d8c16f";
  context.font = "12px monospace";
  context.textBaseline = "top";
  context.fillText(text, x + 14, y + 8);
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
  context.fillText("ARCHIVE ACCESS", x + 32, y + 18);

  context.fillStyle = "#10191e";
  context.fillRect(x + 34, y + 52, 136, 36);
  context.fillStyle = chapterProgress.archiveDoorUnlocked ? "#d7c56d" : "#9fb28d";
  context.font = "24px monospace";
  context.fillText(getKeypadDisplayText(), x + 54, y + 58);

  drawKeypadButtons(x + 48, y + 108);

  context.fillStyle = keypadState.messageTimer > 0 ? "#d8c16f" : "#68787c";
  context.font = "12px monospace";
  context.fillText(keypadState.message || "Type digits. Enter submits. Esc exits.", x + 22, y + 222);
}

function drawKeypadButtons(x, y) {
  const labels = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "<", "0", "OK"];

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
  context.fillText(line.speaker, panelX + 18, panelY + 12);

  context.fillStyle = line.thought ? "#aab7ba" : "#e1ddca";
  context.font = line.thought ? "italic 14px monospace" : "14px monospace";
  drawWrappedText(visibleText, panelX + 18, panelY + 36, panelWidth - 36, 17);

  context.fillStyle = "#68787c";
  context.font = "11px monospace";
  context.fillText("E / Enter", panelX + panelWidth - 78, panelY + panelHeight - 18);
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

function drawPlaceholderState() {
  context.fillStyle = "#000";
  context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function drawDebugScreen() {
  if (
    !debug.showOverlay ||
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

function drawWrappedText(text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";
  let lineY = y;

  words.forEach((word) => {
    const testLine = line ? `${line} ${word}` : word;

    if (measureTextWidth(testLine, context.font) > maxWidth && line) {
      context.fillText(line, x, lineY);
      line = word;
      lineY += lineHeight;
      return;
    }

    line = testLine;
  });

  if (line) {
    context.fillText(line, x, lineY);
  }
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
