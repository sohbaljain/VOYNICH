"use strict";

function deepFreezeTextContent(value) {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) {
    return value;
  }

  Object.values(value).forEach(deepFreezeTextContent);
  return Object.freeze(value);
}

const TEXT_CONTENT = deepFreezeTextContent({
  // Inventory section 1: Title and opening.
  title: {
    name: "VOYNICH",
    tagline: "Some records were never meant to survive.",
    navigationHint: "Arrow keys, E, Enter, or mouse",
    trailerNotice: "Trailer route enabled. F6-F10 shortcuts are isolated from normal mode.",
    exitMessage: "You may close this tab.",
    menu: {
      start: "Start",
      continue: "Continue",
      presentation: "Presentation Mode",
      settings: "Settings",
      credits: "Credits",
      exit: "Exit",
    },
  },

  // Inventory section 13: Menus and general UI.
  settings: {
    title: "SETTINGS",
    hint: "Escape or Back returns",
    controlsHint: "Left / Right adjusts selected ranges. Enter or E confirms.",
    items: {
      masterVolume: "Master volume",
      musicVolume: "Music volume",
      ambienceVolume: "Ambience volume",
      sfxVolume: "SFX volume",
      textSpeed: "Text speed",
      screenShake: "Screen shake",
      grainIntensity: "Grain / scanlines",
      fullscreen: "Fullscreen",
      back: "Back",
    },
    messages: {
      saved: "Settings saved.",
      saveFailed: "Settings could not be saved here.",
      fullscreenUnavailable: "Fullscreen is not available in this browser.",
      fullscreenEnabled: "Fullscreen enabled.",
      fullscreenClosed: "Fullscreen closed.",
      fullscreenBlocked: "Fullscreen was blocked by the browser.",
      fullscreenToggled: "Fullscreen toggled.",
    },
    values: {
      exit: "Exit",
      open: "Open",
      return: "Return",
      textSpeedTemplate: "${speed} cps",
      percentTemplate: "${percent}%",
      on: "On",
      off: "Off",
    },
  },

  // Inventory section 1: Title and opening.
  credits: {
    title: "CREDITS",
    hint: "E, Enter, Escape, or mouse returns",
    createdBy: "Created by Sohbal Jain and Ishaan Aggarwal.",
    originality: "The concept, story, and game design for VOYNICH are original.",
    licensedAudio: "Licensed audio",
    licensedAudioPlaceholder:
      "Add track names, creators, licenses, and source links here before shipping.",
    licensedAssets: "Licensed assets",
    licensedAssetsPlaceholder:
      "Add external asset credits here only after licensed assets are added.",
    back: "Back",
  },

  // Inventory section 1: Title and opening.
  opening: {
    prologueLines: [
      "2086",
      "Three weeks ago, I received an anonymous photograph of this university.",
      "I investigate abandoned places and document what was left behind.",
      "The message claimed a hidden archive still operates beneath the building.",
      "\"The university closed. The records did not.\"",
      "It also mentioned a missing manuscript connected to the archive.",
      "I came here to find it—and leave with proof.",
    ],
    skipHint: "Space, E, or Enter skips",
    serviceEntranceHint: "The service entrance from the photograph is ahead.",
  },

  // Inventory section 2: First corridor/tutorial.
  corridor: {
    signs: {
      lab: "LAB",
      year: "2086",
      noEntry: "NO ENTRY",
      exitArrow: "EXIT  --->",
      archive: "ARCHIVE",
    },
    prompts: {
      readDirectory: "Read directory",
      readSecurityMemo: "Read security memo",
      readMaintenanceNotice: "Read maintenance notice",
      takeMaintenanceKey: "Take maintenance key",
      inspectArchiveDoor: "Inspect archive door",
      openArchiveDoor: "Open archive door",
      inspectDeadKeypad: "Inspect dead keypad",
      useArchiveKeypad: "Use archive keypad",
      inspectElectricalCabinet: "Inspect electrical cabinet",
      useMaintenanceKey: "Use maintenance key",
      inspectSealedCart: "Inspect sealed cart",
      inspectLoosePage: "Inspect loose page",
    },
    keypad: {
      title: "ARCHIVE ACCESS",
      buttons: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "<", "0", "OK"],
      defaultHint: "Enter the four-digit archive code. Enter submits. Esc exits.",
      enterFourDigits: "Enter the four-digit code.",
      fourDigitsRequired: "Four digits are required.",
      missingContext: "Find and read the security memo before using the code.",
      incorrectCode: "Incorrect code.",
      accepted: "Code accepted.",
    },
    breaker: {
      title: "AUXILIARY BREAKER ROUTING",
      hint: "Set the lines in this order: Auxiliary, Ventilation, Archive, Lighting.",
      closeHint: "Click each line. Escape closes.",
      initialMessage: "Restore power by activating all four lines in the correct order.",
      indicatorMessage: "The safe order is: Auxiliary, Ventilation, Archive, Lighting.",
      rejectionMessage: "Incorrect order. All breaker lines have reset.",
      progressTemplate: "${count}/4 breaker lines active.",
      restoredMessage: "Auxiliary power restored. The archive keypad is now active.",
      switchLabels: {
        auxiliary: "AUXILIARY",
        ventilation: "VENTILATION",
        archive: "ARCHIVE",
        lighting: "LIGHTING",
      },
    },
  },

  // Inventory section 4: Archive exploration.
  archive: {
    labels: {
      missingPersons: "MISSING PERSONS",
      noCatalogueEntry: "NO CATALOGUE ENTRY",
    },
    prompts: {
      returnToCorridor: "Return to corridor",
      tryArchiveExit: "Try archive exit",
      testWrongExit: "Test wrong exit",
      enterDistortedCorridor: "Enter distorted corridor",
      stageManuscriptReveal: "Stage manuscript reveal",
      useIndexTerminal: "Use index terminal",
      searchShelfA02: "Search shelf A-02",
      searchShelfC11: "Search shelf C-11",
      searchShelfC13: "Search shelf C13",
      searchLooseFolder: "Search loose folder",
      inspectLooseFolder: "Inspect loose folder",
      findCoordinateBeforeLadder: "Find coordinate before moving ladder",
      holdToPushLadder: "Hold E to move ladder (${progress}%)",
      climbLadderAtC13: "Climb ladder at C13",
      inspectShelfC13: "Inspect shelf C13",
      climbToShelfC13: "Climb to shelf C13",
      inspectLockedCabinet: "Inspect locked cabinet",
      useSealedKey: "Use sealed key",
      inspectOpenCabinet: "Inspect open cabinet",
      inspectRestrictedCabinet: "Inspect restricted cabinet",
      useArchiveAccessCard: "Use archive access card",
      inspectManuscriptTable: "Inspect manuscript table",
      enterMissingPersonsWing: "Enter missing-person records wing",
    },
    shelfSearches: {
      personnelTransfer: {
        title: "Personnel transfer record",
        text:
          "Three archivists were assigned to shelf C13 in 2081, two years after official university records ended.",
      },
      waterDamage: {
        title: "Water damage log",
        text: "Repeated reports describe wet paper beneath a ceiling that was always dry.",
      },
      restrictedAccess: {
        title: "Restricted access record",
        text: "Cabinet R-6 requires a sealed key stored above shelf C13.",
      },
    },
    messages: {
      boxAlreadyEmpty: "The upper shelf at C13 is empty. You already collected the sealed R-6 key.",
      quarantinedRecords:
        "Three altered missing-person files are stored in the records wing. All other searches are blocked.",
      cabinetR6Title: "Cabinet R-6",
      cabinetR6Open:
        "The open drawer contains empty file slots. The photograph, access card, and removed-page note have already been copied into the journal.",
    },
  },

  // Inventory section 5: Clues and documents.
  recordsWing: {
    labels: {
      sceneTitle: "MISSING PERSONS — ALTERED RECORDS",
      fileAltered: "RECORD ALTERED",
      contradictionCaptured: "CONTRADICTION PHOTOGRAPHED",
      contradictionNotProven: "NOT A CONTRADICTION",
    },
    prompts: {
      returnToMainArchive: "Return to main archive",
      compareCaseFile: "Inspect ${name}'s altered file",
    },
    overlay: {
      instruction: "Select the detail that cannot be true:",
      controls: "Arrow keys select — E photographs — Escape closes",
    },
    messages: {
      selectedCanCoexist: "That detail does not contradict the rest of the file.",
      contradictionPreserved: "${name}: contradiction photographed.",
    },
    cases: {
      mara: {
        name: "Mara Voss",
        role: "Student journalist",
        records: [
          "Official departure: 12 October 2079",
          "Final university photograph: 14 October 2079",
          "Archive access recorded: 18 October 2079",
          "Handwritten note: Her file was closed before her final archive visit.",
        ],
      },
      elias: {
        name: "Elias Ward",
        role: "Maintenance engineer",
        records: [
          "Reported missing: 03 March 2081",
          "Archive badge used: 09 March 2081",
          "Official explanation: electrical accident",
          "Handwritten note: His badge completed one final shift without him.",
        ],
      },
      jonah: {
        name: "Jonah Vale",
        role: "Junior archivist",
        records: [
          "Reported missing: 22 June 2083",
          "Official explanation: voluntary resignation",
          "Photograph: Jonah stands beside a cabinet installed after his disappearance",
          "Attached note: Emergency manuscript alignment recorded.",
        ],
      },
    },
  },

  // Inventory section 6: Main puzzles.
  manuscript: {
    title: "VOYNICH MANUSCRIPT",
    fragments: {
      upperLeft: "I",
      upperRight: "II",
      lowerLeft: "III",
      lowerRight: "IV",
    },
    symbols: {
      staff: {
        label: "Aster",
        classLabel: "Personnel transfer",
        hint: "Aster represents the staff assigned to shelf C13 after the university officially closed.",
      },
      maintenance: {
        label: "Drain",
        classLabel: "Water damage",
        hint: "Drain represents the water-damage log. It is not part of the required three-symbol sequence.",
      },
      restricted: {
        label: "Grille",
        classLabel: "Restricted access",
        hint: "Grille represents the restricted-access record linking C13 to cabinet R-6.",
      },
      removed: {
        label: "Hollow Leaf",
        classLabel: "Removed page",
        hint: "Hollow Leaf represents the manuscript page removed from the archive catalogue.",
      },
    },
    rings: {
      outer: "Outer ring",
      middle: "Middle ring",
      inner: "Inner ring",
      rotationTemplate: "${label}: ${rotation}",
    },
    ui: {
      controlsButton: "C Controls",
      close: "Close",
      developerComplete: "DEV: Complete current stage",
      rotateLeft: "Rotate -",
      rotateRight: "Rotate +",
      stage1Label: "Stage 1",
      stage1Title: "Reconstruct the torn page",
      stage1Message:
        "Place all four fragments inside the outline. Rotate each fragment until its torn edges match.",
      pageRepairedLabel: "Page reconstructed",
      orderRepeatsTitle: "Three records form a sequence",
      patternMessage:
        "The repaired page links three archive records: personnel transfer, restricted access, and the removed page.",
      recordPattern: "Continue to symbol matching",
      stage2Label: "Stage 2",
      stage2Title: "Match records to symbols",
      stage2Message:
        "Choose the symbols for personnel transfer, restricted access, and removed page—in that order.",
      journalMappings: "Archive record mappings",
      marginSequence: "Selected sequence",
      beginFinalAlignment: "Continue to ring alignment",
      stage3Label: "Stage 3",
      stage3Title: "Align the three manuscript rings",
      jonahAlignmentHint: "Set Outer to I, Middle to V, and Inner to III.",
      defaultAlignmentHint: "Use Jonah's emergency alignment from the journal.",
      back: "Back",
      reset: "Reset",
      solvedLabel: "Interface activated",
      solvedTitle: "The manuscript is a control system",
      solvedMessage: "The aligned rings reveal a removed control page hidden beyond the archive.",
    },
    messages: {
      sequenceCleared: "Selected symbols cleared.",
      orderRepeats: "The records repeat in the same order.",
      fragmentLocked: "This fragment is already placed correctly.",
      selectFragmentFirst: "Select a fragment first.",
      rotateMarking: "Rotate the fragment until its torn edges match.",
      reconstructionComplete: "Page reconstructed. Three archive-record symbols are now visible.",
      incorrectSymbolOrder:
        "Incorrect sequence. Use Personnel Transfer, Restricted Access, then Removed Page.",
      symbolStageComplete: "Correct sequence. The manuscript rings are now active.",
      ringsReset: "All three rings reset.",
    },
  },

  // Inventory section 7: Distorted corridor/reality changes.
  distortedArchive: {
    doorLabels: {
      falseWest: "A-02",
      realDoor: "C13",
      falseEast: "R-06",
    },
    prompts: {
      inspectMovedShelf: "Inspect the moved shelf",
      inspectAlteredPhotograph: "Inspect the altered photograph",
      inspectAlteredPhoto: "Inspect altered photo",
      inspectBackwardClock: "Inspect the backward-running clock",
      inspectWrongExitSign: "Inspect wrong exit sign",
      inspectExtraDoor: "Inspect extra door",
      tryCorridorExit: "Test the distorted corridor exit",
      openDuplicateDoorA02: "Open duplicate door A-02",
      openDuplicateDoorC13: "Open duplicate door C13",
      openDuplicateDoorR06: "Open duplicate door R-06",
      activateStaffSwitch: "Activate Staff Assignment switch",
      activateRestrictedSwitch: "Activate Restricted Access switch",
      activateRemovedPageSwitch: "Activate Removed Page switch",
      takeMissingPage: "Take the missing control page",
      enterUnmarkedClassroom: "Enter unmarked classroom",
      leaveClassroom: "Leave classroom",
      readAttendanceRegister: "Read attendance register",
    },
    optionalDetails: {
      wrongExitSignTitle: "Reversed exit sign",
      wrongExitSignText:
        "The sign points deeper into the archive, while its shadow points toward the exit.",
      extraDoorTitle: "Impossible door",
      extraDoorText: "The door has no hinges and does not appear on any map or directory.",
    },
    finalPage: {
      title: "Missing archive control page",
      text:
        "The page changes while you hold it. Four familiar symbols surround a diagram of a hidden chamber. The archive is still being actively maintained.",
    },
    overlays: {
      jonahEmergencyTitle: "Jonah's emergency alignment",
      jonahEmergencyText:
        "OUTER — I / MIDDLE — V / INNER — III. Beneath it: \"Do not align unless the removed page has been reconstructed. The rings authorize the archive.\"",
    },
    classroom: {
      attendanceBoard: "ATTENDANCE IS A FORM OF RECORD",
      register: "ATTENDANCE REGISTER",
      explorerName: "THE EXPLORER",
      explorerPresent: "THE EXPLORER — PRESENT",
      chairScrape: "A chair scrapes across the floor behind you.",
      freshInk: "Fresh ink writes THE EXPLORER — PRESENT into the final row.",
      attendanceTitleTemplate: "Attendance — ${year}",
      blankLineSuffix: " / [blank line]",
      presentSuffix: " — PRESENT",
      attendanceLineTemplate: "${names}${suffix}",
      caseNames: ["MARA VOSS", "ELIAS WARD", "JONAH VALE"],
    },
    messages: {
      looksAlmostNormal:
        "The archive looks unchanged at first, but the exit no longer leads back to the corridor.",
      exitSignPointsAway:
        "Three objects in the archive have changed. Inspect all three to reveal the symbols.",
      thresholdReturns:
        "The doorway returns you to the same archive. The room is rewriting itself.",
      exitNoLongerCorridor: "The archive exit no longer opens to the corridor you entered from.",
      exitSameCorridor:
        "The exit opens onto the same distorted corridor. One detail has changed again.",
      duplicateDoorsHint: "Only one duplicate door matches all three symbols revealed in the archive.",
      falseDoor: "Wrong door. The corridor loops back and changes another detail.",
      switchOrderReset: "Incorrect switch order. Start again with Staff Assignment.",
      switchProgressTemplate: "${count}/3 switches activated.",
      trailerChangedArchiveForced: "Trailer: changed archive forced.",
      trailerFinalPageRevealForced: "Trailer: final page reveal forced.",
    },
  },

  // Inventory sections 8-10: Archivist introduction, panels, vulnerable boss phase.
  archivist: {
    symbolLabels: {
      eye: "Eye",
      spiral: "Spiral",
      brokenSquare: "Key",
      verticalLine: "Hand",
    },
    prompts: {
      disableCorruptedRecord: "Disable corrupted record node",
      testRevealedFigure: "Test this figure with the flashlight",
      activateControl: "Activate ${label} control",
      inspectFinalArchiveEntry: "Inspect active archive terminal",
    },
    chamber: {
      absentFromDirectory:
        "The missing control page reveals a chamber that does not appear on any university map.",
      lockTitle: "HIDDEN CHAMBER LOCK",
      lockDescription:
        "Set the four rotating bands to match the symbol pattern shown on the missing control page.",
      journalHint: "Press J to review the missing-page clue.",
      symbolMinus: "Previous symbol",
      symbolPlus: "Next symbol",
      engageMechanism: "Test chamber alignment",
      noMeaning:
        "I need the reconstructed manuscript and missing control page before I can solve this lock.",
      orderRecognizedNotAccepted: "Incorrect symbol pattern. The chamber remains sealed.",
      chamberOpens: "The four symbols align. A hidden chamber opens behind the records.",
    },
    messages: {
      archivistTurns:
        "The Archivist turns away from a terminal that is still rewriting the university's records.",
      falsePrompt: "The figure disappears, leaving a false record in its place.",
      recordHidden:
        "The corrupted record is hidden during the power failure. Restore visibility before attacking it.",
      corruptedRecordsDisabled: "${count}/3 corrupted record nodes disabled.",
      trueSequence: "Only one figure carries the complete Eye, Spiral, Key, Hand pattern.",
      controlsHolding: "${count}/4 archive controls active.",
      updateLoopCollapses: "The archive update loop shuts down. One terminal remains active.",
      recordTears:
        "Your stability reaches zero. The archive rewrites your record and restarts the encounter.",
    },
  },

  // Inventory section 10: Vulnerable boss phase.
  boss: {
    ui: {
      entryReady: "ENTRY READY",
      updating: "UPDATING",
      stabilityTemplate: "STABILITY ${marks}",
      phaseTemplate: "PHASE ${phase}",
      archiveEntryCreated: "ARCHIVE ENTRY CREATED",
      subjectRedacted: "SUBJECT: [REDACTED]",
      statusStillInside: "STATUS: STILL INSIDE",
      archivePreparing: "The archive was never recording the past.",
      nextEntry: "It was preparing the next entry.",
      sealActive: "ARCHIVE SEAL ACTIVE",
      deactivateSymbols: "Deactivate the four symbols in order:",
      next: "NEXT",
      name: "THE ARCHIVIST",
      subtitle: "KEEPER OF THE LIVING RECORD",
      stability: "STABILITY",
      manuscriptCharge: "MANUSCRIPT CHARGE",
      move: "A/D: Move",
      dodge: "Space: Dodge",
      focusBeam: "E / Click: Focus beam",
      archiveEntryCompleted: "ARCHIVE ENTRY COMPLETED",
      statusContained: "STATUS: CONTAINED",
      retryBoss: "Retry Boss",
      returnToTitle: "Return to Title",
    },
    messages: {
      archivistTurns:
        "The Archivist turns from the terminal. It is the entity that has been maintaining and rewriting the archive.",
      finalEntryExposed: "The final entry is exposed. Strike now.",
      observerRecord: "\"You entered to observe the archive. Now the archive will preserve you.\"",
      cannotLeave: "\"You cannot escape a place that has already created your record.\"",
      machineSeal:
        "The Archivist is protected by a four-symbol machine seal. Activate Eye, Spiral, Key, then Hand.",
      sealRejects: "Incorrect symbol order. The seal resets.",
      sealBreaks: "The protective seal breaks. The Archivist is now vulnerable.",
      finalRecordCharging: "A final record is charging. Dodge the beam.",
      rewritesSpace: "The Archivist rewrites the space around you.",
      copyCollapses: "The copy collapses into an incorrect sequence.",
      updateLoopRejects: "The update loop rejects the symbol and erases the sequence.",
      slashCuts: "The record slash cuts through your outline.",
      finalRecordCloses: "The final record closes around you.",
      corruptedInk: "Corrupted ink enters your record.",
      floorErupts: "The archive floor erupts beneath you.",
    },
  },

  // Inventory section 11: Escape sequence.
  escape: {
    labels: {
      falling: "FALLING",
      serviceBypass: "SERVICE BYPASS",
    },
    messages: {
      corridorBuried: "The corridor is buried. Press Up to climb through the service bypass.",
      bypassCollapses: "The bypass collapses behind you.",
      debrisStrikes: "Debris strikes the floor. Keep moving.",
      keepCamera: "Keep the camera. Carry the evidence through the final collapse.",
      dropCamera: "The camera breaks against the floor. You can run faster now.",
    },
    cameraChoice: {
      title: "THE CAMERA IS SLOWING YOU DOWN",
      description: "The final corridor is collapsing. Decide what leaves with you.",
      keepLabel: "KEEP THE CAMERA",
      keepDetail: "Harder escape — preserve and distribute the evidence",
      dropLabel: "DROP THE CAMERA",
      dropDetail: "Easier escape — lose the recorded evidence",
      controls: "Arrow keys, E, Enter, or mouse",
    },
    reveal: {
      morningLight: "Morning light. The university doors shut behind me.",
      evidenceUpload: "A damaged evidence upload completed before the camera failed.",
      leftCamera: "I left the camera beneath the university.",
      survivingImage:
        "One surviving image shows me inside the archive, photographed from behind.",
      phoneImage:
        "My phone now holds one image: me inside the archive, photographed from behind.",
      didNotTakeIt: "I did not take it.",
      newEntry: "NEW ARCHIVE ENTRY AVAILABLE",
      subjectExplorer: "SUBJECT: THE EXPLORER",
      statusReleased: "STATUS: RELEASED",
      observationContinuing: "OBSERVATION: CONTINUING",
      evidenceDistributed: "EVIDENCE: DISTRIBUTED",
      attendanceOpen: "ATTENDANCE RECORD: STILL OPEN",
      madeItOut: "I made it out.",
      archiveDidNotLetGo: "But the archive did not let me go.",
    },
  },

  // Inventory section 12: Ending.
  ending: {
    evidenceSurvived: "THE EVIDENCE SURVIVED.",
    recordContinues: "THE RECORD CONTINUES.",
    attendancePresent: "ATTENDANCE: PRESENT",
    menu: {
      restart: "Restart",
      title: "Title",
    },
    navigationHint: "Arrow keys, E, Enter, or mouse",
  },

  // Inventory section 13: Menus and general UI.
  generalUI: {
    controlsHint: "C Controls",
    controls: {
      title: "CONTROLS",
      closeHint: "C or Escape closes",
      explorationTitle: "Exploration",
      explorationLines: [
        "A / D or Left / Right: move",
        "E: interact, advance dialogue",
        "F: flashlight",
        "J: journal",
        "F2: debug overlay",
      ],
      journalTitle: "Journal and keypad",
      journalLines: [
        "Journal A / D: clue pages",
        "Numbers: keypad digits",
        "Backspace: erase digit",
        "Enter or E: submit",
        "Escape: close open panel",
      ],
      manuscriptTitle: "Manuscript puzzles",
      manuscriptLines: [
        "Mouse: select, drag, press buttons",
        "Tab or 1-4: choose fragment",
        "Arrows: move selected item",
        "Q / E: rotate selected item",
        "Enter: place, choose, or rotate",
        "R: reset sequence or rings",
        "B: back from final rings",
      ],
      climaxTitle: "Investigation and climax",
      climaxLines: [
        "Records: arrows + E photograph",
        "Classroom: F changes the room",
        "Boss: Space dodge, E/click beam",
        "Escape: Up enters the bypass",
        "Camera choice: arrows + E",
      ],
      trailerShortcuts:
        "Trailer only: F6 changed archive, F7 silhouette, F8 glitch, F9 final, F10 capture.",
    },
    journal: {
      title: "JOURNAL",
      currentObjective: "Current objective",
      collectedClues: "Collected clues",
      noClues: "No clues recorded.",
      pageTemplate: "A/D pages ${page}/${pageCount} - ${clueCount} clues",
      clueCountTemplate: "${clueCount} clues",
      closeHint: "J / Escape closes",
    },
    inspect: {
      copiedToJournal: "Copied to journal",
      closeHint: "E / Enter / Escape",
    },
    dialogue: {
      advanceHint: "E / Enter",
    },
    audio: {
      unlockPrompt: "Click or press any key to enable audio",
    },
    interactionPromptTemplate: "[E] ${prompt}",
  },

  // Inventory section 5: Clues and documents.
  journalClues: {
    directory: {
      title: "University directory",
      text: "The archive entrance is located in the lower east wing, beyond the old records hall.",
    },
    lockPanel: {
      title: "Unpowered archive keypad",
      text: "The electronic archive lock receives auxiliary power from electrical Cabinet B.",
    },
    maintenanceNotice: {
      title: "Archive power notice",
      text: "Cabinet B powers the archive keypad and requires a physical maintenance key after an outage.",
    },
    securityMemo: {
      title: "Temporary archive code",
      text: "The archive code is the final official record year: 2079.",
    },
    maintenanceKey: {
      title: "Cabinet B maintenance key",
      text: "This key opens electrical Cabinet B. It does not open the archive door.",
    },
    powerReset: {
      title: "Archive keypad power restored",
      text: "Cabinet B restored power to the electronic archive keypad.",
    },
    archiveUnlocked: {
      title: "Archive door unlocked",
      text: "The powered keypad accepted code 2079 and released the archive door.",
    },
    archiveIndex: {
      title: "Missing shelf C13",
      text:
        "Shelf C13 was deleted from the digital index, but the surrounding shelves still leave a physical gap for it.",
    },
    shelfPersonnelRecord: {
      title: "C13 personnel record",
      text: "Three archivists were assigned to C13 in 2081, after official university records had ended.",
    },
    shelfAtmosphericRecord: {
      title: "Unexplained water damage",
      text:
        "Archive staff repeatedly reported wet paper beneath a ceiling that remained completely dry.",
    },
    shelfAccessRecord: {
      title: "R-6 access record",
      text: "Cabinet R-6 requires a sealed key stored on the upper shelf at C13.",
    },
    handwrittenCoordinate: {
      title: "C13 ladder note",
      text: "A handwritten note says: C13 — UPPER SHELF — MOVE LADDER — SEALED KEY.",
    },
    sealedStorageKey: {
      title: "Sealed R-6 key",
      text: "The key recovered from the upper shelf at C13 opens filing cabinet R-6.",
    },
    cabinetPhotograph: {
      title: "Photograph from cabinet R-6",
      text:
        "The photograph shows a central archive table beneath a hanging lamp. No such table is currently visible.",
    },
    archiveAccessCard: {
      title: "Archive access card",
      text: "This official access card should open the powered reader on the restricted cabinet.",
    },
    removedPageNote: {
      title: "Removed manuscript page",
      text:
        "A note warns that one manuscript page was removed and must not be catalogued with the rest.",
    },
    manuscriptTableReveal: {
      title: "Hidden manuscript table",
      text: "The restricted cabinet moved the central shelves aside, revealing the manuscript table.",
    },
    reconstructedMargin: {
      title: "Three-symbol archive sequence",
      text:
        "The reconstructed page shows this order: Personnel Transfer, Restricted Access, Removed Page.",
    },
    manuscriptPattern: {
      title: "Manuscript symbol meanings",
      text:
        "Aster means Personnel Transfer. Grille means Restricted Access. Hollow Leaf means Removed Page. Drain represents Water Damage and is not part of the sequence.",
    },
    circuitRoutingNote: {
      title: "Breaker routing note",
      text: "Auxiliary before archive. Lights after ventilation. Never engage all lines together.",
    },
    changedShelfSymbol: {
      title: "Changed shelf — Staff Assignment",
      text: "Shelf C13 moved by itself. Behind it is the Staff Assignment symbol.",
    },
    alteredPhotographSymbol: {
      title: "Altered photograph — Restricted Access",
      text:
        "The photograph now shows the restricted cabinet where the manuscript table should be. It reveals the Restricted Access symbol.",
    },
    backwardClockSymbol: {
      title: "Backward clock — Removed Page",
      text: "The backward-running clock traces the Removed Page symbol through the dust.",
    },
    wrongDuplicateDoor: {
      title: "False duplicate door",
      text:
        "A wrong door loops the corridor back onto itself. The correct door must match all three revealed symbols.",
    },
    sealedRecordsOpened: {
      title: "Sealed records section opened",
      text:
        "The switches accepted this order: Staff Assignment, Restricted Access, Removed Page.",
    },
    missingPageVisible: {
      title: "Missing control page found",
      text: "The missing page lies beyond the sealed records section under a distant light.",
    },
    maraVossCase: {
      title: "Mara Voss — altered record",
      text:
        "Mara officially left on 12 October 2079, but the archive records her presence on 18 October. The contradiction was photographed.",
    },
    eliasWardCase: {
      title: "Elias Ward — altered record",
      text:
        "Elias disappeared on 3 March 2081, but his badge entered the archive six days later. The contradiction was photographed.",
    },
    jonahValeCase: {
      title: "Jonah Vale — altered record",
      text:
        "Jonah appears beside a cabinet installed after he disappeared. His file also contains an emergency manuscript alignment.",
    },
    jonahAlignmentLog: {
      title: "Jonah's emergency ring alignment",
      text: "Set the manuscript rings to Outer I, Middle V, Inner III.",
    },
    manuscriptControlInterface: {
      title: "The manuscript is a control interface",
      text:
        "The symbols and rings do not translate into language. They activate archive systems and reveal a removed control page beyond the room.",
    },
    uncataloguedAttendance: {
      title: "Uncatalogued attendance register",
      text: "A fresh line appeared in the register: THE EXPLORER — PRESENT.",
    },
    changedJournalEntries: {
      maraTitle: "Mara Voss — photograph changed",
      maraText: "Mara's face is now blurred, and the date beneath the photograph has changed to 2086.",
      eliasTitle: "Elias Ward — photograph changed",
      eliasText:
        "A tall figure now stands behind Elias. It was not present in the original photograph.",
      jonahTitle: "Jonah Vale — record changing",
      jonahText: "The letters in Jonah's name rearrange themselves whenever the journal is closed.",
      explorerTitle: "THE EXPLORER — altered file",
      explorerText:
        "Jonah's name has been replaced with THE EXPLORER. The archive is creating a new record.",
    },
  },

  // Inventory sections 1-12: objectives in player encounter order.
  objectives: {
    enterUniversity: {
      title: "Enter the abandoned university.",
      detail: "Reach the service entrance shown in the anonymous photograph.",
    },
    findArchive: {
      title: "Find the archive entrance.",
      detail: "Read the university directory to locate it.",
    },
    checkDoor: {
      title: "Inspect the archive door.",
      detail: "The archive entrance is at the east end of the corridor.",
    },
    inspectLock: {
      title: "Inspect the archive keypad.",
      detail: "Find out why the electronic lock is not working.",
    },
    restorePower: {
      title: "Restore power to the archive keypad.",
      detail: "Read the nearby maintenance notice for the power source.",
    },
    findKey: {
      title: "Find the Cabinet B maintenance key.",
      detail: "The key opens the electrical cabinet, not the archive door.",
    },
    resetPower: {
      title: "Restore auxiliary power.",
      detail: "Activate Auxiliary, Ventilation, Archive, then Lighting.",
    },
    findCode: {
      title: "Find the four-digit archive code.",
      detail: "Read the security memo in the corridor.",
    },
    enterCode: {
      title: "Unlock the archive door.",
      detail: "Enter 2079 at the powered keypad.",
    },
    enterArchive: {
      title: "Enter the archive.",
      detail: "Go through the unlocked archive door.",
    },
    locateRestricted: {
      title: "Find the restricted collection.",
      detail: "Use the archive index terminal to locate missing shelf records.",
    },
    searchMarkedShelves: {
      title: "Search the marked shelf sections.",
      detail: "Inspect A-02, C-11, and the missing shelf position C13.",
    },
    findShelfCoordinate: {
      title: "Find the note about shelf C13.",
      detail: "Inspect the loose folder on the floor beside C13.",
    },
    moveArchiveLadder: {
      title: "Move the ladder beneath shelf C13.",
      detail: "Hold E until the ladder locks into position.",
    },
    retrieveStorageKey: {
      title: "Retrieve the sealed R-6 key.",
      detail: "Climb the ladder and inspect the upper shelf at C13.",
    },
    openArchiveCabinet: {
      title: "Open filing cabinet R-6.",
      detail: "Use the sealed R-6 key on the matching cabinet.",
    },
    useArchiveAccessCard: {
      title: "Use the archive access card.",
      detail: "Swipe the card at the restricted cabinet reader.",
    },
    investigateMissingPersons: {
      title: "Investigate the altered missing-person files.",
      detail: "Find one impossible contradiction in each file and photograph it.",
    },
    returnFromRecordsWing: {
      title: "Return to the main archive.",
      detail: "All three altered records have been photographed.",
    },
    revealManuscriptTable: {
      title: "Reveal the hidden manuscript table.",
      detail: "Open the restricted cabinet with the archive access card.",
    },
    inspectManuscript: {
      title: "Inspect the manuscript.",
      detail: "Approach the newly revealed table in the centre of the archive.",
    },
    reconstructPage: {
      title: "Rebuild the torn manuscript page.",
      detail: "Place all four fragments and rotate them until the torn edges match.",
    },
    interpretSymbols: {
      title: "Choose the three-symbol archive sequence.",
      detail:
        "Match the manuscript symbols to the personnel, restricted-access, and removed-page records.",
    },
    alignMissingPage: {
      title: "Align the manuscript rings.",
      detail: "Set the Outer ring to I, Middle ring to V, and Inner ring to III.",
    },
    escapeDistortion: {
      title: "Protect the evidence.",
      detail: "Return to the archive exit before the photographs and records change again.",
    },
    findMissingPage: {
      title: "Find the removed control page.",
      detail: "Try the archive exit. The manuscript indicates the missing page is beyond this room.",
    },
    noticeArchiveChanges: {
      title: "Inspect three impossible changes.",
      detail: "Each changed object reveals one symbol needed to escape.",
    },
    testDistortedExit: {
      title: "Test the changed corridor exit.",
      detail: "Find out where the archive now sends you.",
    },
    chooseRealDoor: {
      title: "Choose the correct duplicate door.",
      detail: "Use the three revealed symbols to identify the real path.",
    },
    activateWallSwitches: {
      title: "Open the sealed records section.",
      detail: "Activate Staff Assignment, Restricted Access, then Removed Page.",
    },
    reachMissingPage: {
      title: "Take the missing control page.",
      detail: "Follow the newly opened passage to the distant light.",
    },
    unlockRestrictedChamber: {
      title: "Open the hidden archive chamber.",
      detail: "Set the four chamber bands to the symbol pattern shown on the missing control page.",
    },
    disableCorruptedNodes: {
      title: "Disable the three corrupted records.",
      detail: "Use the flashlight to expose and interrupt each corrupted record node.",
    },
    identifyTrueArchivist: {
      title: "Identify the real Archivist.",
      detail: "Use the flashlight to find the figure carrying the complete four-symbol pattern.",
    },
    breakUpdateLoop: {
      title: "Stop the archive update loop.",
      detail: "Activate the four machine controls in the manuscript order.",
    },
    inspectFinalEntry: {
      title: "Inspect the active terminal.",
      detail: "Approach the remaining terminal after the update loop shuts down.",
    },
    confrontArchivist: {
      title: "Survive the Archivist.",
      detail: "Use the charged flashlight beam and dodge its attacks.",
    },
    breakArchivistSeal: {
      title: "Break the Archivist's protective seal.",
      detail: "Activate Eye, Spiral, Key, then Hand. The Archivist cannot be damaged until the seal breaks.",
    },
    escapeUniversity: {
      title: "Escape the university.",
      detail: "Run toward the exterior light before the archive collapses.",
    },
    chooseCamera: {
      title: "Decide what to carry out.",
      detail: "Keep the camera and its evidence, or drop it and run.",
    },
  },

  // Inventory sections 2-7: dialogue in current trigger order.
  dialogue: {
    directory: {
      allowEscape: true,
      lines: [
        {
          speaker: "Directory",
          text: "The archive entrance is in the lower east wing, beyond the old records hall.",
        },
        {
          speaker: "Voynich",
          text: "The archive door should be at the east end of this corridor.",
          thought: true,
        },
      ],
    },
    doorLocked: {
      allowEscape: true,
      lines: [
        {
          speaker: "Archive Door",
          text:
            "The archive door has no physical keyhole. It is controlled by the electronic keypad beside it.",
        },
        {
          speaker: "Voynich",
          text: "I need to restore the keypad, then find its code.",
          thought: true,
        },
      ],
    },
    doorPoweredLocked: {
      allowEscape: true,
      lines: [
        {
          speaker: "Archive Door",
          text: "The keypad has power, but the door still needs the correct four-digit code.",
        },
      ],
    },
    doorUnlocked: {
      allowEscape: true,
      lines: [
        {
          speaker: "Archive Door",
          text: "The electronic lock releases. Cold air leaks through the opening.",
        },
        {
          speaker: "Voynich",
          text: "The archive is open.",
          thought: true,
        },
      ],
    },
    lockPanelDead: {
      allowEscape: true,
      lines: [
        {
          speaker: "Archive Keypad",
          text: "NO POWER. AUXILIARY SUPPLY: CABINET B.",
        },
        {
          speaker: "Voynich",
          text: "Cabinet B powers this keypad.",
          thought: true,
        },
      ],
    },
    lockNeedsClues: {
      allowEscape: true,
      lines: [
        {
          speaker: "Archive Keypad",
          text: "The keypad is active. I still need the four-digit code from the security memo.",
        },
      ],
    },
    memo: {
      allowEscape: true,
      lines: [
        {
          speaker: "Security Memo",
          text: "TEMPORARY ARCHIVE CODE: Use the final year of the university's official records.",
        },
        {
          speaker: "Security Memo",
          text: "Official records ended in 2079. Handwritten archive logs continued afterward.",
        },
        {
          speaker: "Voynich",
          text: "The archive code is 2079.",
          thought: true,
        },
      ],
    },
    maintenanceNotice: {
      allowEscape: true,
      lines: [
        {
          speaker: "Maintenance Notice",
          text:
            "ARCHIVE KEYPAD POWER: Routed through electrical Cabinet B. A physical maintenance key is required after outages.",
        },
      ],
    },
    keyCollected: {
      allowEscape: true,
      lines: [
        {
          speaker: "Maintenance Key",
          text: "The tag reads CABINET B. This key opens the electrical cabinet, not the archive door.",
        },
      ],
    },
    cabinetLocked: {
      allowEscape: true,
      lines: [
        {
          speaker: "Electrical Cabinet",
          text: "Cabinet B is locked. I need its maintenance key.",
        },
      ],
    },
    cabinetNeedsNotice: {
      allowEscape: true,
      lines: [
        {
          speaker: "Electrical Cabinet",
          text: "I should read the maintenance notice before changing these circuits.",
        },
      ],
    },
    cabinetNeedsPanel: {
      allowEscape: true,
      lines: [
        {
          speaker: "Electrical Cabinet",
          text: "I should inspect the dead archive keypad first and confirm what needs power.",
        },
      ],
    },
    powerReset: {
      allowEscape: true,
      lines: [
        {
          speaker: "Electrical Cabinet",
          text: "The final breaker locks into place. Power returns to the archive keypad.",
        },
        {
          speaker: "Voynich",
          text: "Now I only need the four-digit code.",
          thought: true,
        },
      ],
    },
    manuscriptObject: {
      allowEscape: true,
      lines: [
        {
          speaker: "Sealed Cart",
          text: "The cart is chained shut. The label plate has been scraped until it shines.",
        },
      ],
    },
    finalPageObject: {
      allowEscape: true,
      lines: [
        {
          speaker: "Loose Page",
          text: "The page is blank except for pressure marks. Whatever wrote here pressed too hard.",
        },
      ],
    },
    wrongCode: {
      allowEscape: true,
      lines: [
        {
          speaker: "Archive Keypad",
          text: "Incorrect code. Access denied.",
        },
      ],
    },
    correctCode: {
      allowEscape: false,
      lines: [
        {
          speaker: "Archive Keypad",
          text: "2079 accepted. The archive door is now unlocked.",
        },
      ],
    },
    archiveEntrance: {
      allowEscape: true,
      lines: [
        {
          speaker: "Voynich",
          text: "This is the hidden archive from the message.",
          thought: true,
        },
        {
          speaker: "Voynich",
          text: "I need to find the restricted collection and the missing manuscript.",
          thought: true,
        },
      ],
    },
    archiveExitBlockedLater: {
      allowEscape: true,
      lines: [
        {
          speaker: "Archive Exit",
          text: "The doorway has become a solid wall. The route back to the corridor is gone.",
        },
      ],
    },
    archiveIndex: {
      allowEscape: true,
      lines: [
        {
          speaker: "Index Terminal",
          text:
            "The digital index lists every shelf except C13. The shelves on either side still leave a physical gap for it.",
        },
        {
          speaker: "Voynich",
          text: "C13 was deleted from the search system, but it still exists somewhere in this room.",
          thought: true,
        },
      ],
    },
    archiveIndexUnreadable: {
      allowEscape: true,
      lines: [
        {
          speaker: "Index Terminal",
          text: "The terminal is active, but no useful search can begin until I inspect the archive index.",
        },
      ],
    },
    shelfBeforeIndex: {
      allowEscape: true,
      lines: [
        {
          speaker: "Shelf Marker",
          text: "I should use the index terminal first so I know which shelf records matter.",
        },
      ],
    },
    shelfAlreadySearched: {
      allowEscape: true,
      lines: [
        {
          speaker: "Shelf Section",
          text: "I already searched this section and copied its useful record.",
        },
      ],
    },
    coordinateFolderLocked: {
      allowEscape: true,
      lines: [
        {
          speaker: "Loose Folder",
          text: "The folder is trapped beneath the records. I should finish searching A-02, C-11, and C13 first.",
        },
      ],
    },
    coordinateFolder: {
      allowEscape: true,
      lines: [
        {
          speaker: "Loose Folder",
          text: "A handwritten note reads: C13 — UPPER SHELF — MOVE LADDER — SEALED KEY.",
        },
        {
          speaker: "Voynich",
          text: "The sealed key is above C13. I need to move the ladder beneath it.",
          thought: true,
        },
      ],
    },
    ladderNeedsCoordinate: {
      allowEscape: true,
      lines: [
        {
          speaker: "Rolling Ladder",
          text: "I do not know where to position it yet. I should find the handwritten C13 note first.",
        },
      ],
    },
    ladderMoved: {
      allowEscape: true,
      lines: [
        {
          speaker: "Rolling Ladder",
          text: "The ladder locks into position beneath shelf C13.",
        },
      ],
    },
    highShelfNeedsLadder: {
      allowEscape: true,
      lines: [
        {
          speaker: "Upper Shelf C13",
          text: "The sealed key is above reach. I need to move the ladder beneath C13.",
        },
      ],
    },
    sealedKeyFound: {
      allowEscape: true,
      lines: [
        {
          speaker: "Upper Shelf C13",
          text: "A sealed sleeve contains a small key stamped R-6.",
        },
        {
          speaker: "Voynich",
          text: "This key should open filing cabinet R-6.",
          thought: true,
        },
      ],
    },
    filingCabinetLocked: {
      allowEscape: true,
      lines: [
        {
          speaker: "Filing Cabinet R-6",
          text: "The cabinet lock is stamped R-6. It requires the sealed key from shelf C13.",
        },
      ],
    },
    filingCabinetOpened: {
      allowEscape: true,
      lines: [
        {
          speaker: "Filing Cabinet R-6",
          text:
            "Inside are a photograph, an archive access card, and a note wrapped around an empty page slot.",
        },
        {
          speaker: "Removed-Page Note",
          text: "The removed page must not be catalogued with the rest of the manuscript.",
        },
        {
          speaker: "Voynich",
          text: "The access card should open the restricted cabinet.",
          thought: true,
        },
      ],
    },
    restrictedGateLocked: {
      allowEscape: true,
      lines: [
        {
          speaker: "Restricted Cabinet",
          text:
            "A powered card reader blocks access. It requires an official archive access card.",
        },
      ],
    },
    manuscriptReveal: {
      allowEscape: false,
      lines: [
        {
          speaker: "Restricted Cabinet",
          text: "The access card is accepted. The central shelves unlock and slide apart.",
        },
        {
          speaker: "Voynich",
          text: "They were hiding a table in the centre of the archive.",
          thought: true,
        },
        {
          speaker: "Voynich",
          text: "The missing manuscript is lying on it.",
          thought: true,
        },
      ],
    },
    postManuscriptPurpose: {
      allowEscape: false,
      lines: [
        {
          speaker: "Reconstructed Manuscript",
          text:
            "The completed rings form an authorization diagram, not a translation. One control page is marked as removed beyond this room.",
        },
        {
          speaker: "Voynich",
          text:
            "The camera holds proof that the archive erased these people. I have to get that evidence outside before the record changes again.",
          thought: true,
        },
        {
          speaker: "Voynich",
          text:
            "The exit is also the only route toward the removed page—and whoever is still maintaining this place.",
          thought: true,
        },
      ],
    },
    manuscriptTable: {
      allowEscape: true,
      lines: [
        {
          speaker: "Manuscript Table",
          text:
            "The manuscript has been torn into four fragments. Matching lines continue across the broken edges.",
        },
        {
          speaker: "Voynich",
          text: "I need to rebuild the page before I can understand the symbols.",
          thought: true,
        },
      ],
    },
    trailerArchiveReveal: {
      allowEscape: true,
      lines: [
        {
          speaker: "Trailer Route",
          text:
            "The archive search is compressed. The manuscript table reveal is now staged for capture.",
        },
      ],
    },
    trailerReveal: {
      allowEscape: true,
      lines: [
        {
          speaker: "Trailer Route",
          text: "Archive reveal state armed. Normal progression has not been changed.",
        },
      ],
    },
  },

  // Inventory section 13: runtime notification templates.
  notifications: {
    clueCollected: "Clue collected: ${title}",
    objectiveCompleted: "Completed: ${title}",
    cinematicCaptureEnabled: "Cinematic capture enabled.",
    cinematicCaptureDisabled: "Cinematic capture disabled.",
    darknessLines: [
      "I can't make out the label.",
      "Too dark to inspect.",
      "The markings disappear without the light.",
      "I need the flashlight.",
    ],
  },
});

window.TEXT_CONTENT = TEXT_CONTENT;
