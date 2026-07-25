# VOYNICH Normal Playthrough Guide

This guide covers the current complete normal route with `TRAILER_MODE = false`.

Approximate first-time duration: 21-24 minutes.

This estimate assumes a new player reads the short text, walks the spaces once or twice, makes one or two wrong keypad/puzzle attempts, and checks a few optional details. It does not rely on waiting screens, forced slow walking, repeated dialogue, or empty backtracking.

## Chapter 1: Corridor

Estimated first-time duration: 4-6 minutes.

1. Start from the title screen.
2. Read the damaged university directory.
3. Walk to the far east archive door and inspect it.
4. Inspect the dead archive lock panel.
5. Read the maintenance notice about auxiliary power.
6. Read the abandoned security memo.
7. Collect the loose maintenance key near the overturned furniture.
8. Use the maintenance key on the electrical cabinet.
9. Reset auxiliary power.
10. Return to the archive keypad.
11. Enter `2079`.
12. Open the archive door.

The keypad should not accept the code in normal mode until the door has been checked and the required clues are known.

## Chapter 2: Archive Search

Estimated first-time duration: 6-8 minutes.

1. Read the archive index terminal.
2. Confirm Restricted Collection V-13 is missing from the searchable index.
3. Search shelf A-02 for the personnel transfer record.
4. Search shelf C-11 for the water damage record.
5. Search shelf V-13 for the restricted access record.
6. Search the loose folder for the handwritten shelf coordinate.
7. Move the rolling archive ladder to the high shelf.
8. Retrieve the sealed storage key.
9. Use the sealed storage key on cabinet R-6.
10. Collect the photograph, archive access card, and note about the removed page.
11. Use the access card on the restricted cabinet.
12. Reveal the manuscript table.
13. Inspect the manuscript.

The manuscript table should remain unavailable before the restricted cabinet reveal.

## Chapter 3: Manuscript

Estimated first-time duration: 5-6 minutes.

1. Reconstruct the page by placing and rotating the four torn fragments.
2. Use the journal clues to map the symbols.
3. Enter the symbol sequence:
   `staff assignment -> restricted access -> removed page`
4. Commit to the missing-page alignment stage.
5. Rotate the rings to the target alignment:
   `outer 1, middle 5, inner 3`
6. Let the reality-change transition return to the archive.

The puzzle state should persist if the manuscript is closed before the final alignment commitment. Restart should reset all puzzle state.

## Chapter 4: Changed Archive And Distorted Corridor

Estimated first-time duration: 6-7 minutes.

1. Try to leave through the archive entrance.
2. Notice the exit loops back into the changed archive.
3. Inspect the moved shelf to reveal the staff symbol.
4. Inspect the altered photograph to reveal the restricted symbol.
5. Inspect the backward clock to reveal the removed-page symbol.
6. Optional: inspect the wrong exit sign and extra door.
7. Leave through the archive entrance again.
8. In the distorted corridor, reject false doors A-02 and R-06 if testing loops.
9. Open the real duplicate door V-13.
10. Let the silhouette event play once.
11. Activate wall switches in order:
    `staff -> restricted -> removed`
12. Walk to the distant light.
13. Take the missing page.
14. Close the inspect overlay to reach the ending.

The false doors should never trap the player. The silhouette event should not repeat in normal play.

## Ending And Restart

1. On the ending screen, choose Restart.
2. Confirm the game returns to the corridor.
3. Confirm journal clues, current objective, manuscript puzzle state, distorted-corridor flags, final page state, and silhouette flags are reset.
4. Return to the title screen from a completed run by choosing Title on the ending screen.

## Fastest Full Testing Order

Use this order when checking a build quickly without skipping required normal-mode gates:

1. Title: Start.
2. Corridor: directory, archive door, lock panel, maintenance notice, memo, key, cabinet, keypad wrong code, keypad `2079`, archive door.
3. Archive: index, three shelves, loose folder, ladder, high shelf, filing cabinet, restricted cabinet, manuscript table.
4. Manuscript: complete stage 1, test one wrong stage 2 answer, complete stage 2, reset rings once, complete stage 3.
5. Changed archive: exit loop, three changed details, optional details if time allows, exit to distorted corridor.
6. Distorted corridor: false door, real door, wait for silhouette to end, wrong switch, correct switch order, final page.
7. Ending: Restart, then verify the opening corridor has fresh state.

## Duration Notes

The current route lands in the intended 20-25 minute target for a first-time player:

- Corridor: 4-6 minutes.
- Archive: 6-8 minutes.
- Manuscript: 5-6 minutes.
- Changed archive / distorted corridor: 6-7 minutes.

Total expected first-time route: 21-24 minutes.

If later testing shows experienced players finish too quickly, extend through new readable clues, optional environmental inspections, or logical puzzle steps. Do not pad with waits, slower walking, or repeated dialogue.
