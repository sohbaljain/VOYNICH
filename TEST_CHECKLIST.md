# VOYNICH Test Checklist

Use this checklist after any gameplay, input, rendering, or audio change. The project should still run by directly opening `index.html`.

## Title

- [ ] Open `index.html` directly from the filesystem.
- [ ] Confirm the title screen appears first.
- [ ] Confirm the animated corridor background has parallax, dust, flicker, and restrained grain.
- [ ] Confirm `VOYNICH` and the tagline are readable.
- [ ] Navigate Start, Settings, Credits, and Exit with keyboard.
- [ ] Navigate Start, Settings, Credits, and Exit with mouse.
- [ ] Confirm Continue appears only when an in-memory session is valid.
- [ ] Confirm Exit shows `You may close this tab.`
- [ ] Start fades into the corridor cleanly.

## Settings

- [ ] Master volume slider changes the master mixer value.
- [ ] Music volume slider changes the music mixer value.
- [ ] Ambience volume slider changes the ambience mixer value.
- [ ] SFX volume slider changes the SFX mixer value.
- [ ] Text speed slider changes dialogue typewriter speed.
- [ ] Screen shake toggle disables manuscript shake and distorted camera jitter.
- [ ] Grain / scanlines slider changes the visual noise intensity.
- [ ] Fullscreen button enters or exits fullscreen where supported.
- [ ] Settings persist after refreshing the page.
- [ ] Escape returns from Settings to the title screen.

## Audio Unlock

- [ ] Before first input, the audio unlock prompt is visible.
- [ ] Click hides the prompt and unlocks audio.
- [ ] Any tracked key hides the prompt and unlocks audio.
- [ ] Missing audio files do not throw errors or stop gameplay.
- [ ] Title, corridor, archive, manuscript, distorted corridor, and ending loops do not duplicate.
- [ ] Scene changes crossfade or fade down existing loops.

## Movement

- [ ] `A` moves left.
- [ ] `D` moves right.
- [ ] Left Arrow moves left.
- [ ] Right Arrow moves right.
- [ ] Releasing movement decelerates smoothly.
- [ ] Player never moves vertically or diagonally.
- [ ] Player faces the direction of movement.
- [ ] Player stays inside scene boundaries.
- [ ] Camera follows horizontally and clamps near scene edges.
- [ ] Movement remains stable when frame rate changes.

## Flashlight

- [ ] `F` toggles the flashlight in exploration scenes.
- [ ] Darkness remains readable with the flashlight on.
- [ ] Flashlight-off darkness is visibly stronger.
- [ ] Flashlight does not toggle on title, settings, credits, or ending screens.

## Corridor Visuals

- [ ] Corridor renders at 640 x 360 internally.
- [ ] Canvas scales without blurred filtering.
- [ ] Check 1366 x 768, 1440 x 900, 1536 x 864, and 1920 x 1080.
- [ ] Tiled floor, cracked wall pattern, ceiling panels, supports, light fixtures, pipes, papers, archive sign, and archive door are visible.
- [ ] Flicker is atmospheric but not unreadable.
- [ ] Film grain and vignette remain restrained.

## Journal

- [ ] `J` opens and closes the journal during exploration.
- [ ] Journal pauses movement.
- [ ] Current objective is shown.
- [ ] Collected clues are listed.
- [ ] `A` / `D` or arrows page through clues.
- [ ] Journal cannot open over dialogue, keypad, inspect overlay, controls, title, settings, credits, or ending.

## Corridor Clues And Locks

- [ ] Damaged university directory records the archive location.
- [ ] Archive door is locked before the code is entered.
- [ ] Dead electronic lock panel records the power problem.
- [ ] Maintenance notice points to auxiliary power.
- [ ] Security memo reveals the code indirectly through official records ending in 2079.
- [ ] Loose maintenance key can be collected.
- [ ] Maintenance key opens the electrical cabinet only, not the archive door.
- [ ] Electrical cabinet cannot be reset before the key, notice, and lock-panel inspection.
- [ ] Normal mode keypad is blocked until the door has been checked and all required clues are known.
- [ ] Incorrect keypad code gives feedback and does not break progression.
- [ ] Correct code `2079` unlocks the archive door.

## Archive Transition

- [ ] Opening the unlocked archive door fades corridor audio.
- [ ] Door sound hook is requested.
- [ ] Archive fades in and spawns the player near the entrance.
- [ ] Player can return to corridor before the manuscript changes reality.
- [ ] After reality changes, normal archive re-entry is blocked.

## Archive Search Tasks

- [ ] Archive index terminal must be read before shelf searching.
- [ ] V-13 is missing from the searchable index.
- [ ] Shelf A-02 yields the personnel transfer record.
- [ ] Shelf C-11 yields the atmospheric water damage record.
- [ ] Shelf V-13 yields the restricted access record.
- [ ] Duplicate shelf searches do not add duplicate clues.
- [ ] Loose coordinate folder is blocked until all shelves are searched.
- [ ] Handwritten coordinate appears in the journal.
- [ ] Archive music pulse starts after the first useful restricted clue.
- [ ] Archive tension increases after the access card is found.

## Ladder

- [ ] Ladder cannot be meaningfully moved before the shelf coordinate is known.
- [ ] Ladder moves to the high shelf target.
- [ ] Ladder stays within its valid rail range.
- [ ] High shelf is blocked until the ladder is moved.
- [ ] Sealed storage key appears in the journal.

## Locked Containers

- [ ] Filing cabinet is locked before the sealed storage key.
- [ ] Filing cabinet opens with the sealed storage key.
- [ ] Photograph, access card, and removed-page note are collected.
- [ ] Restricted cabinet is locked before the access card.
- [ ] Access card opens the restricted cabinet.
- [ ] Manuscript table is not interactable until revealed.

## Manuscript Inspection

- [ ] Pressing `E` near the revealed table enters manuscript inspection.
- [ ] Archive audio fades down.
- [ ] Manuscript close-up is readable.
- [ ] The manuscript can be closed before committing to the final alignment stage.
- [ ] Closing and reopening preserves puzzle state.
- [ ] The `C` controls overlay opens and closes.
- [ ] Developer completion control is hidden when `TRAILER_MODE` is false.

## Puzzle Stage 1

- [ ] Mouse can select and drag fragments.
- [ ] Keyboard can select fragments with `Tab` or `1`-`4`.
- [ ] Keyboard can move fragments with arrows.
- [ ] `Q` / `E` rotate selected fragments.
- [ ] Fragments snap only when position and rotation are correct.
- [ ] Completing all four fragments reveals margin marks.

## Puzzle Stage 2

- [ ] Journal clues logically map symbols to classifications.
- [ ] Correct sequence is staff assignment, restricted access, removed page.
- [ ] Incorrect sequence shakes/animates ink only if screen shake is enabled.
- [ ] Incorrect sequence can be retried.
- [ ] Correct sequence advances to the alignment entry.

## Puzzle Stage 3

- [ ] Mouse can select rings and rotate with buttons.
- [ ] Keyboard can select rings with arrows, `A` / `D`, or `Tab`.
- [ ] `Q` rotates left.
- [ ] `E` or Enter rotates right.
- [ ] Reset returns all rings to zero.
- [ ] Back returns to the symbol stage before final commitment completes.
- [ ] Correct alignment completes once.
- [ ] Restart resets every manuscript puzzle stage.

## Changed Archive

- [ ] After manuscript completion, the archive initially looks almost normal.
- [ ] First archive exit attempt loops back and starts the changed archive objective.
- [ ] Moved shelf reveals the staff symbol.
- [ ] Altered photograph reveals the restricted symbol.
- [ ] Backward clock reveals the removed-page symbol.
- [ ] Wrong exit sign is optional and inspectable.
- [ ] Extra door is optional and inspectable.
- [ ] Manuscript table is empty.
- [ ] Archive exit enters the distorted corridor after the three required symbols.

## Looping Corridor

- [ ] Distorted corridor renders stretched perspective, duplicate doors, displaced supports, moving papers, and controlled chromatic separation.
- [ ] False door A-02 loops safely.
- [ ] False door R-06 loops safely.
- [ ] False doors remain understandable and do not trap the player.
- [ ] Correct door V-13 reaches the sealed records section.

## Silhouette Event

- [ ] Silhouette event triggers only once in normal play.
- [ ] Event causes hard silence.
- [ ] One light flickers and visibility returns.
- [ ] Player movement slows briefly but is not removed.
- [ ] No chase, combat, gore, or jumpscare face appears.

## Final Page And Ending

- [ ] Wall switches reject the wrong order and reset.
- [ ] Correct order is staff, restricted, removed.
- [ ] Passage opens after the third correct switch.
- [ ] Missing page appears under distant light.
- [ ] Taking the missing page opens an inspect overlay.
- [ ] Closing the overlay fades to the ending.
- [ ] Ending screen offers Restart and Title.
- [ ] Restart begins a fresh corridor run.
- [ ] Restart clears clues, objectives, manuscript puzzle state, distorted state, and silhouette flags.

## Trailer Mode

- [ ] `TRAILER_MODE` is controlled by the constant near the top of `game.js`.
- [ ] When false, trailer prompts and developer controls are hidden.
- [ ] When true, the corridor keypad route is shortened.
- [ ] `F6` forces the changed archive.
- [ ] `F7` triggers the silhouette event.
- [ ] `F8` triggers the archive/manuscript/corridor shortcut based on current state.
- [ ] `F9` reveals the final page.
- [ ] Trailer shortcuts do not alter normal mode when `TRAILER_MODE` is false.

## Cinematic Capture Mode

- [ ] `F10` toggles cinematic capture mode only when `TRAILER_MODE` is true.
- [ ] Capture mode hides debug indicators.
- [ ] Capture mode hides objectives.
- [ ] Capture mode hides interaction prompts and controls hint.
- [ ] Normal mode remains unchanged.

## Browser Compatibility

- [ ] Chrome or Chromium-based browser opens `index.html` directly.
- [ ] Safari opens `index.html` directly.
- [ ] Firefox opens `index.html` directly.
- [ ] Browser autoplay restrictions show the unlock prompt instead of failing.
- [ ] Fullscreen failures show a readable message.
- [ ] localStorage failures do not crash settings.
- [ ] Tab visibility pause stops gameplay updates and clears held inputs.
