# VOYNICH Audio Guide

The game can run with this folder empty. `game.js` points to the editable slots below and the AudioManager safely falls back to silence when a file is missing.

Use original audio, commissioned audio, or clearly licensed audio only. Add creator, license, and source notes to the credits before shipping any external material.

## Music Loops

- `title-music.ogg` - title screen music.
- `corridor-theme.ogg` - restrained corridor music layer.
- `archive-pulse.ogg` - subtle archive pulse after the first restricted clue.
- `archive-tension.ogg` - archive tension layer after the access card is found.
- `manuscript-low-rise.ogg` - manuscript puzzle music / low rise.
- `distorted-low-pulse.ogg` - distorted corridor music.
- `ending-music.ogg` - ending music.

## Ambience Loops

- `corridor-room-tone.ogg` - original corridor ambience.
- `archive-room-tone.ogg` - archive room ambience.
- `archive-fluorescent-hum.ogg` - archive fluorescent hum loop or long bed.
- `distorted-corridor-tone.ogg` - altered corridor ambience.
- `reverse-electrical-hum.ogg` - reverse electrical hum layer.

## Interface And UI

- `ui-move.ogg` - menu selection movement.
- `ui-select.ogg` - menu confirm / select.
- `ui-back.ogg` - menu back / exit message.
- `fullscreen-toggle.ogg` - fullscreen button feedback.
- `interaction-prompt.ogg` - contextual prompt appearing.
- `dialogue-tick.ogg` - quiet typewriter character tick.
- `journal-open.ogg` - journal opening.
- `journal-close.ogg` - journal closing.

## Corridor And Archive Effects

- `flashlight-toggle.ogg` - flashlight on/off.
- `debug-toggle.ogg` - debug collision toggle.
- `clue-collected.ogg` - clue added to journal.
- `locked-door.ogg` - locked archive door.
- `keypad-button.ogg` - keypad press.
- `wrong-code.ogg` - incorrect keypad code.
- `correct-code.ogg` - correct keypad code.
- `power-return.ogg` - auxiliary power reset.
- `archive-door-unlock.ogg` - archive door unlocking.
- `archive-door-open.ogg` - archive door opening / transition.
- `shelf-creak.ogg` - archive shelf movement.
- `paper-movement.ogg` - papers, folders, page handling.
- `drawer-open.ogg` - drawer opening.
- `drawer-close.ogg` - drawer closing.
- `filing-cabinet-lock.ogg` - filing cabinet lock.
- `ladder-movement.ogg` - rolling archive ladder.
- `distant-metallic-impact.ogg` - distant archive impact.
- `access-card-beep.ogg` - access card reader.
- `manuscript-light-activation.ogg` - manuscript table reveal light.
- `fluorescent-hum.ogg` - one-shot or short hum accent.
- `electrical-hum.ogg` - electrical hum accent.
- `light-flicker.ogg` - light flicker accent.

## Manuscript Puzzle Effects

- `book-opening.ogg` - manuscript opening.
- `page-movement.ogg` - manuscript page movement.
- `paper-fragment-pickup.ogg` - picking up a torn fragment.
- `fragment-placement.ogg` - snapping a fragment into place.
- `subtle-symbol-tone.ogg` - symbol selection / reveal.
- `incorrect-puzzle.ogg` - incorrect puzzle answer.
- `stage-completion.ogg` - puzzle stage solved.
- `ring-rotation.ogg` - rotating manuscript rings.
- `final-alignment.ogg` - final ring alignment.
- `glitch-burst.ogg` - controlled reality-change burst.
- `silence-before-reality-change.ogg` - short impact or drop before silence.

## Distorted Corridor Effects

- `distant-footsteps.ogg` - distant non-enemy footsteps.
- `corridor-loop.ogg` - corridor loop transition.
- `false-door.ogg` - false duplicate door feedback.
- `wall-switch.ogg` - distorted wall switch.
- `passage-open-bass.ogg` - correct passage opening bass impact.
- `final-page-reveal.ogg` - missing page reveal.

## Implementation Notes

- Keep loop files seamless and low in volume; the in-game mixer applies additional per-scene scaling.
- Prefer `.ogg` for the listed filenames. If a different format is needed later, update `AUDIO_LIBRARY` in `game.js`.
- Keep UI, dialogue, and clue sounds short and restrained so text remains readable and the tone stays serious.
