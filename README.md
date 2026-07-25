# VOYNICH

VOYNICH is an original 2D semi-pixelated psychological mystery game foundation set in an abandoned university in 2086. This repository currently contains the static browser shell, player movement, the corridor, archive, manuscript, and post-manuscript reality-change chapters.

## Run Locally

Open `index.html` directly in a modern browser.

No local server, package install, build step, framework, or online dependency is required.

## Project Structure

```text
VOYNICH/
├── index.html
├── style.css
├── game.js
├── AUDIO_GUIDE.md
├── NORMAL_PLAYTHROUGH_GUIDE.md
├── TEST_CHECKLIST.md
├── VIDEO_SHOT_LIST.md
├── assets/
│   ├── audio/
│   │   └── AUDIO_GUIDE.md
│   ├── images/
│   └── symbols/
└── README.md
```

- `index.html` defines the page and the 640 x 360 canvas.
- `style.css` handles the full-screen wrapper and sharp nearest-neighbor scaling.
- `game.js` contains the game loop, state manager, input manager, title/settings/credits screens, player movement, camera, corridor/archive/manuscript/distorted scene rendering, interaction, dialogue, objectives, journal, keypad, audio management, transitions, and temporary debug render.
- `TEST_CHECKLIST.md` covers manual regression testing for the full route.
- `NORMAL_PLAYTHROUGH_GUIDE.md` documents the normal route and current timing estimate.
- `VIDEO_SHOT_LIST.md` gives a trailer capture route using real in-game footage.
- `AUDIO_GUIDE.md` points to the detailed editable audio slot list.
- `assets/images/` is reserved for future original pixel-art image assets.
- `assets/audio/` is reserved for future original audio assets.
- `assets/audio/AUDIO_GUIDE.md` documents the editable audio filenames expected by `game.js`.
- `assets/symbols/` is reserved for future original symbol, manuscript, and puzzle artwork.

## Keyboard Controls

The foundation currently detects these keys for future interaction systems:

- `A`
- `D`
- `Left Arrow`
- `Right Arrow`
- `Up Arrow`
- `Down Arrow`
- `E`
- `F`
- `J`
- `C`
- `Escape`
- `Enter`
- `F2`
- `F6` trailer mode only
- `F7` trailer mode only
- `F8`
- `F9` trailer mode only
- `F10` trailer mode only

On the title screen and menu screens, use `Up Arrow`, `Down Arrow`, `E`, `Enter`, or the mouse to choose items. In Settings, use `Left Arrow`, `Right Arrow`, `A`, or `D` to adjust sliders.

Use `A`, `D`, `Left Arrow`, or `Right Arrow` to move the placeholder player horizontally. Press `E` to interact and advance dialogue. Press `F` to toggle the flashlight. Press `J` to open or close the journal. Press `C` to open the controls overlay. Press `F2` to toggle the large debug text overlay. Pressed keys are shown there only while that overlay is enabled.

When the journal is open, use `A` / `D` or `Left Arrow` / `Right Arrow` to page through collected clues.

When the keypad UI is open, type number keys, press `Backspace` to erase, press `E` or `Enter` to submit, and press `Escape` to close.

When manuscript puzzles are open, use `C` for the full controls list. Puzzle screens keep only compact active controls visible.

When `TRAILER_MODE` is set to `true`, developer-only shortcuts are available for rapid capture: `F6` forces the changed archive, `F7` triggers the silhouette event, `F8` triggers the corridor glitch route or current manuscript stage completion, `F9` reveals the final page, and `F10` toggles cinematic capture mode to hide prompts, objectives, and debug indicators.

## Visual Direction

- Render internally at `640 x 360`, then scale to the browser window with nearest-neighbor scaling.
- Aim for late-1990s and early-2000s computer-horror atmosphere: retro resolution with modern lighting, not fully old-school 8-bit pixel art.
- Keep the palette dark and muted: cold blue-grey walls, dirty brown floors, faded yellow lights, and deep black shadows.
- Build scenes from original Canvas shapes, gradients, shadows, noise, and small repeated details.
- Use subtle perspective and parallax for corridors, shelves, doors, floors, and ceilings.
- Keep characters around `24 x 48` display pixels with a clear silhouette, visible clothing shapes, flashlight details, and more animation detail than traditional tiny sprites.
- Current player animation targets are 2 idle frames, 4 walking frames, and 2 interaction frames.
- Use restrained effects: film grain, low-resolution dithering, vignette, light VHS noise, occasional frame jitter, and chromatic separation only during future horror events.
- Keep text, dialogue boxes, buttons, and prompts sharp and readable.
- Avoid bright cartoon colors, thick playful outlines, exaggerated platformer visuals, and childish UI.

## Gameplay Direction

- Preserve the existing working systems as the game grows.
- The normal route should eventually support roughly 20-25 minutes of meaningful gameplay.
- Do not stretch playtime with artificial waiting, excessive walking, or repeated dialogue.
- Gameplay length should come from exploration, environmental tasks, clue collection, puzzle solving, and story progression.
- `TRAILER_MODE` is kept near the top of `game.js` for the Round 2 trailer route. When enabled in future systems, it should shorten tasks and provide rapid access to major scenes without changing the normal game route.

## Audio

Audio is managed in `game.js` by a reusable `AudioManager` built around browser audio elements.

- Editable audio paths live in the `AUDIO_LIBRARY` constant and point inside `assets/audio/`.
- Exact expected filenames are listed in `assets/audio/AUDIO_GUIDE.md`.
- The manager supports background music, ambience loops, one-shot SFX, smooth fades, and independent master/music/ambience/SFX volume setters.
- The game shows an audio unlock message because browsers may block sound until the first key press or click.
- Missing audio files are tolerated. The game should keep running silently until real original audio files are added.
- Do not invent, download, or include copyrighted audio.

Current editable SFX hooks include interaction prompts, dialogue ticks, journal open/close, clue collection, locked door, keypad buttons, wrong/correct code, power return, archive door unlock/open, shelf creaks, paper movement, drawer movement, filing cabinet locks, ladder movement, distant metallic impact, access-card beeps, fluorescent hum, and manuscript-light activation.

Manuscript audio hooks include book opening, page movement, paper fragment pickup, fragment placement, subtle symbol tone, incorrect puzzle, stage completion, ring rotation, final alignment, glitch burst, low musical rise, and silence before reality change.

Post-manuscript audio hooks include distorted corridor ambience, reverse electrical hum, distant footsteps, subtle low music pulse, false-door loops, wall switches, passage-opening bass impact, and final-page reveal.

## Corridor Chapter

The first corridor chapter now has reusable interaction, dialogue, objective, journal, and keypad systems.

Normal progression:

1. Read the damaged university directory.
2. Inspect the locked archive door.
3. Inspect the dead archive keypad.
4. Read the maintenance notice about auxiliary power.
5. Read the abandoned security memo for the indirect code clue.
6. Collect the loose maintenance key near the overturned furniture.
7. Use the key on the electrical cabinet and reset power.
8. Return to the powered archive keypad.
9. Enter the four-digit code.
10. Open the unlocked archive door.

The security memo indicates that public records end in `2079`, while archive logs continued after that. The archive code is `2079`.

`TRAILER_MODE` keeps the normal game untouched. When set to `true` in `game.js`, the archive keypad starts powered and the code can be entered immediately. `F8` is isolated as a trailer-only shortcut that primes the corridor requirements and moves quickly into the archive route.

## Archive Chapter

The archive chapter adds a scene transition from the corridor into a wider archive room. Opening the unlocked archive door fades out the corridor ambience, plays the archive-door sound hook, fades into the archive, and spawns the player near the entrance.

Normal progression:

1. Enter the archive through the unlocked corridor door.
2. Read the archive index terminal.
3. Search shelf sections `A-02`, `C-11`, and `V-13`.
4. Find the handwritten shelf coordinate in a loose folder.
5. Move the rolling archive ladder to the V-13 high shelf.
6. Retrieve the sealed storage key.
7. Use the key on cabinet `R-6`.
8. Collect the photograph, archive access card, and note about "the page that was removed."
9. Use the access card on the restricted cabinet.
10. Reveal the concealed manuscript table.

The archive supports reusable conditional interactables, clue collection, locked containers, a simple inspect-item overlay, objective updates, and a movable ladder clamped to its rail. The manuscript table cannot be interacted with until the restricted cabinet has been opened.

The player can return to the corridor from the archive entrance until the manuscript sequence permanently changes reality.

`TRAILER_MODE` adds a one-interaction reveal prompt near the archive entrance while keeping the normal route intact when `TRAILER_MODE` is `false`.

## Manuscript Chapter

Press `E` at the revealed manuscript table to open a dedicated manuscript inspection state. The surrounding archive audio fades, the manuscript opens in close-up, and progress persists if the player closes and reopens before committing to the final ring stage.

Puzzle stages:

1. Page reconstruction: rotate and place four torn fragments into the page outline. Mouse players can drag fragments and use rotate buttons. Keyboard players can use `Tab` or `1`-`4` to select fragments, arrow keys to move, `Q` / `E` to rotate, and `Enter` to try placement.
2. Symbol interpretation: use journal clues to map four original symbols to archive classifications, then choose the three-symbol margin sequence: personnel transfer, restricted access, removed page. Incorrect answers cause restrained shake, ink movement, and an audio hook.
3. Missing-page alignment: rotate three circular manuscript rings until one complete symbol forms. Mouse players can select rings and press rotate buttons. Keyboard players can use `A` / `D` or arrows to choose a ring, `Q` / `E` to rotate, `R` to reset, and `B` to go back.

Solving the final alignment locks the solved state, stops ambient audio briefly, triggers a controlled visual glitch, marks `realityChanged`, returns to the altered archive, and changes the archive exit so it leads to the distorted corridor.

`TRAILER_MODE` shows a developer-only manuscript shortcut button and supports `F8` inside the manuscript state to auto-complete the current stage. These controls are hidden in normal mode.

## Reality-Change Chapter

After the manuscript puzzle is solved, the player returns to the archive. It initially reads as almost normal, but the first attempt to leave folds the player back into the same room and makes the changes easier to notice.

Normal progression:

1. Try to leave through the archive entrance.
2. Inspect three changed archive details: the moved shelf, altered photograph, and backward-running desk clock.
3. Use the three revealed symbols to identify the real duplicate door in the distorted corridor.
4. False duplicate doors loop the corridor safely and change one detail.
5. The correct duplicate door reaches the sealed records section.
6. Activate the wall switches in the previous manuscript order: staff assignment, restricted access, removed page.
7. The final passage opens and the missing page appears under a distant light.

The changed archive also includes two optional inspectable changes: the wrong exit sign and an extra door. The manuscript table is empty after reality changes, and the normal archive route cannot be re-entered from the distorted corridor.

The distorted corridor reuses the original corridor's palette and horror language while changing the geometry: stretched perspective, displaced supports, duplicate doors, moving papers, changing wall markings, sequential light shutdown, controlled chromatic separation, and subtle camera instability.

The silhouette event is non-violent and triggers once in normal play. It creates hard silence, one unstable light, and a brief movement slowdown without removing player control.

## Game States

The game-state manager currently supports these placeholder states:

- `title`
- `settings`
- `credits`
- `corridor`
- `archive`
- `manuscript`
- `puzzle`
- `distorted`
- `ending`

The active state currently starts as `title`. Start fades into the corridor through the same state manager and transition system used by the later chapters. Future systems can switch states through the state manager in `game.js`, while each state can later receive its own update and render behavior.

## Future Assets

Place future original assets in the matching folder:

- Put pixel-art sprites, backgrounds, UI images, and texture work in `assets/images/`.
- Put music, ambience, stingers, and effects in `assets/audio/`.
- Put manuscript glyphs, diagrams, cipher plates, and puzzle symbols in `assets/symbols/`.

Do not add copied characters, layouts, code, assets, or music.
