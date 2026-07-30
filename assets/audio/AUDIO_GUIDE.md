# VOYNICH Audio Guide

`game.js` is currently wired to the complete MP3 pack in this folder. Do not rename these files without updating `AUDIO_LIBRARY`.

All audio should be original, commissioned, or clearly licensed. Add creator, license, and source notes to the credits before shipping any external material.

## Looping Music And Ambience

- `title-music.mp3` - title screen loop after browser audio unlock.
- `archive-room-tone.mp3` - normal corridor, archive, exterior, fluorescent hum, electrical hum, and temporary archive music bed.
- `distorted-corridor-tone.mp3` - distorted corridor ambience, reverse hum, manuscript rise, and distorted music bed.
- `ending-music.mp3` - ending sequence music loop.

## Interface And Interaction

- `ui-click.mp3` - menu movement, menu selection, keypad presses, small switches, camera shutter, and compact UI feedback.
- `flashlight-toggle.mp3` - flashlight on/off only.
- `dialogue-tick.mp3` - quiet typewriter tick while dialogue text reveals.
- `final-notification.mp3` - final important notification only.

## Documents And Mechanisms

- `paper-movement.mp3` - journal open/close, pages, folders, books, and manuscript fragments.
- `metal-creak.mp3` - doors, drawers, shelves, ladders, cabinets, and metal mechanism movement.
- `locked-door.mp3` - locked doors, locked cabinets, and unavailable mechanisms.
- `success.mp3` - clue collection, correct answers, restored power, solved stages, and unlocked mechanisms.
- `wrong.mp3` - incorrect answers, failed actions, invalid sequences, empty charge, and blocked Archivist hits.

## Horror And Impact

- `glitch.mp3` - visual corruption, false doors, teleportation, scene shifts, light flickers, and reality distortion.
- `heavy-impact.mp3` - debris impacts, environmental collapses, heavy passage openings, and major physical impacts.
- `distant-footsteps.mp3` - occasional scripted distant scare accents only.
- `camera-drop.mp3` - the moment the escape camera hits the floor.

## Combat

- `charged-flashlight-beam.mp3` - once when the charged flashlight beam starts firing.
- `boss-windup.mp3` - when the Archivist telegraphs major attacks or phase actions.
- `boss-hit.mp3` - only when a valid attack reduces Archivist health.
- `player-hurt.mp3` - only after player stability/health is actually reduced.
- `archivist-defeat.mp3` - once when the Archivist defeat state begins.

## Runtime Behavior

- Audio unlocks only after a valid browser user interaction.
- The AudioManager keeps one music loop and one ambience loop active, with fades.
- One-shot failure/locked sounds have short cooldowns to avoid spam.
- Missing or blocked audio must never crash gameplay; warnings are one-shot.
