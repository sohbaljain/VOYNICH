# VOYNICH Text Refinement Inventory

Inventory date: 2026-07-30

Scope: player-facing runtime text found in `index.html` and `game.js`, including text stored in data objects and text drawn directly to the canvas. Existing guide/checklist Markdown files were not treated as in-game player-facing text.

# 1. Title and opening

## 1. Browser title and static fallbacks

**File:** index.html  
**Line/function/key:** lines 6, 11, 14, 17  
**Trigger:** Page loads; fallback text appears if Canvas or JavaScript is unavailable.  
**Speaker/type:** browser title / accessibility label / fallback UI  
**Current text:**  
> VOYNICH  
> VOYNICH game screen  
> VOYNICH requires a browser with HTML Canvas support.  
> VOYNICH requires JavaScript to run.

**Purpose:** Identify the game and explain hard technical requirements when the game cannot run.

## 2. Title screen branding

**File:** game.js  
**Line/function/key:** `drawTitleMenu()` lines 8096-8099  
**Trigger:** Title screen.  
**Speaker/type:** title UI  
**Current text:**  
> VOYNICH  
> Some truths are never meant to be discovered.

**Purpose:** Establish the title and tone before starting.

## 3. Title menu options

**File:** game.js  
**Line/function/key:** `getTitleMenuOptions()` lines 3079-3089  
**Trigger:** Title screen menu. `Continue` appears only when `hasContinueState()` returns true.  
**Speaker/type:** menu UI  
**Current text:**  
> Start  
> Continue  
> Settings  
> Credits  
> Exit

**Purpose:** Provide title navigation choices.

## 4. Title navigation, trailer notice, and exit message

**File:** game.js  
**Line/function/key:** `drawTitleMenu()` lines 8111-8121; `handleTitleMenuAction()` lines 3264-3265  
**Trigger:** Title screen; trailer notice only when `TRAILER_MODE` is true; exit message after choosing Exit.  
**Speaker/type:** menu instruction / trailer notice / notification  
**Current text:**  
> Arrow keys, E, Enter, or mouse  
> Trailer route enabled. F6-F10 shortcuts are isolated from normal mode.  
> You may close this tab.

**Purpose:** Explain title-screen input, trailer-only shortcuts, and browser-exit limitation.

## 5. Settings menu labels and hints

**File:** game.js  
**Line/function/key:** `SETTINGS_ITEMS` lines 214-222; `drawSettingsScreen()` lines 8127-8139  
**Trigger:** Settings screen.  
**Speaker/type:** settings UI  
**Current text:**  
> SETTINGS  
> Escape or Back returns  
> Master volume  
> Music volume  
> Ambience volume  
> SFX volume  
> Text speed  
> Screen shake  
> Grain / scanlines  
> Fullscreen  
> Back  
> Left / Right adjusts selected ranges. Enter or E confirms.

**Purpose:** Let the player adjust audio, text, visual effects, fullscreen, and leave the settings screen.

## 6. Settings feedback messages

**File:** game.js  
**Line/function/key:** `setSettingsMessage()`, `toggleFullscreen()` and settings persistence paths around lines 2949-3000  
**Trigger:** Saving settings or using the fullscreen action.  
**Speaker/type:** settings notification  
**Current text:**  
> Settings saved.  
> Settings could not be saved here.  
> Fullscreen is not available in this browser.  
> Fullscreen enabled.  
> Fullscreen closed.  
> Fullscreen was blocked by the browser.  
> Fullscreen toggled.

**Purpose:** Confirm setting changes or explain why fullscreen/storage did not work.

## 7. Credits screen

**File:** game.js  
**Line/function/key:** `drawCreditsScreen()` lines 8184-8214  
**Trigger:** Credits menu.  
**Speaker/type:** credits UI  
**Current text:**  
> CREDITS  
> E, Enter, Escape, or mouse returns  
> Created by Sohbal Jain and Ishaan Aggarwal.  
> The concept, story, and game design for VOYNICH are original.  
> Licensed audio  
> Add track names, creators, licenses, and source links here before shipping.  
> Licensed assets  
> Add external asset credits here only after licensed assets are added.  
> Back

**Purpose:** Credit creators and reserve editable sections for later licensed material.

## 8. Opening narration

**File:** game.js  
**Line/function/key:** `getPrologueText(time)` lines 11416-11424  
**Trigger:** Start game, before player control.  
**Speaker/type:** narrator / player thought  
**Current text:**  
> 2086  
> Three weeks ago, an anonymous message led me here.  
> I document places people have forgotten.  
> But this building was never truly abandoned.  
> The message named a hidden archive beneath the university.  
> "The records are still being updated."  
> If the lost manuscript is real, I need proof.

**Purpose:** Establish the year, protagonist motive, hidden archive, and manuscript hook.

**Flags:** The phrase "the records" is introduced before the player knows what kind of records matter.

## 9. Opening skip and first movement hint

**File:** game.js  
**Line/function/key:** `drawPrologueScene()` lines 11405-11412  
**Trigger:** During and after opening narration.  
**Speaker/type:** tutorial instruction / objective-like prompt  
**Current text:**  
> Space, E, or Enter skips  
> The photographed service entrance is ahead.

**Purpose:** Explain narration skipping and direct the player toward the entrance.

## 10. Opening objective

**File:** game.js  
**Line/function/key:** `OBJECTIVE_DATA.enterUniversity` lines 674-675  
**Trigger:** New game start.  
**Speaker/type:** objective  
**Current text:**  
> Enter the abandoned university.  
> Reach the service entrance shown in the anonymous photograph.

**Purpose:** Give the first navigation goal.

# 2. First corridor/tutorial

## 11. General controls hint

**File:** game.js  
**Line/function/key:** `drawControlsHint()` lines 10800-10828  
**Trigger:** Exploration states when no panel/dialogue/menu is open.  
**Speaker/type:** UI hint  
**Current text:**  
> C Controls

**Purpose:** Tell the player where to open the controls panel.

## 12. Corridor environmental labels

**File:** game.js  
**Line/function/key:** `CORRIDOR_WORLD.SIGNS` lines 296-298; corridor render labels around lines 9100 and 10422  
**Trigger:** Visible in corridor as world signage.  
**Speaker/type:** environmental text  
**Current text:**  
> LAB  
> 2086  
> NO ENTRY  
> EXIT  --->  
> ARCHIVE

**Purpose:** Add setting detail and orient the player in the corridor.

**Flags:** `2086` repeats the opening date but may read like a room number.

## 13. First corridor objective

**File:** game.js  
**Line/function/key:** `OBJECTIVE_DATA.findArchive` lines 678-679  
**Trigger:** After entering the corridor.  
**Speaker/type:** objective  
**Current text:**  
> Find a way into the archive.  
> Start with the university directory.

**Purpose:** Direct the player to the directory as the first required clue.

## 14. Directory interaction

**File:** game.js  
**Line/function/key:** `INTERACTABLE_DEFINITIONS.directory` lines 1365-1375; `DIALOGUE_DATA.directory` lines 968-980; `CLUE_DATA.directory` lines 837-838  
**Trigger:** Press E near the damaged directory.  
**Speaker/type:** prompt / document / player thought / journal clue  
**Current text:**  
> Read directory  
> Most entries are crossed out. Archive access is still listed under the old maintenance route.  
> The maintenance route leads to the archive.  
> Damaged university directory  
> The archive is marked in the lower east wing, past the decommissioned records hall.

**Purpose:** Establish the archive location and make the door check logical.

## 15. Door-check objective

**File:** game.js  
**Line/function/key:** `OBJECTIVE_DATA.checkDoor` lines 682-683  
**Trigger:** After reading the directory.  
**Speaker/type:** objective  
**Current text:**  
> Find a way into the archive.  
> Check the archive door at the east end.

**Purpose:** Send the player to the archive door.

## 16. Archive door locked state

**File:** game.js  
**Line/function/key:** `getArchiveDoorPrompt()` lines 7493-7501; `DIALOGUE_DATA.doorLocked` lines 982-993  
**Trigger:** Press E at the archive door before the keypad is unlocked.  
**Speaker/type:** prompt / door / player thought  
**Current text:**  
> Inspect archive door  
> The handle refuses to move. There is no keyhole meant for a person; this lock belongs to the electronics.  
> The door is waiting for the electronics, not for me.

**Purpose:** Explain that a physical key will not open the archive door.

## 17. Lock-panel objective

**File:** game.js  
**Line/function/key:** `OBJECTIVE_DATA.inspectLock` lines 686-687  
**Trigger:** After checking the locked archive door.  
**Speaker/type:** objective  
**Current text:**  
> Find a way into the archive.  
> Inspect the archive lock panel.

**Purpose:** Direct the player to the keypad/lock panel.

## 18. Dead lock-panel interaction

**File:** game.js  
**Line/function/key:** `getLockPanelPrompt()` lines 7581-7587; `DIALOGUE_DATA.lockPanelDead` lines 1019-1025; `CLUE_DATA.lockPanel` lines 841-842  
**Trigger:** Press E at the archive keypad before power is restored.  
**Speaker/type:** prompt / lock panel / journal clue  
**Current text:**  
> Inspect dead keypad  
> The keypad is black. A faded diagnostic strip reads AUX POWER: CABINET B.  
> Dead electronic lock panel  
> The archive keypad is intact, but no power reaches it.

**Purpose:** Tell the player the keypad needs auxiliary power from Cabinet B.

## 19. Power objective

**File:** game.js  
**Line/function/key:** `OBJECTIVE_DATA.restorePower` lines 690-691  
**Trigger:** After inspecting the dead lock panel.  
**Speaker/type:** objective  
**Current text:**  
> Restore auxiliary power.  
> Find how the dead archive keypad is powered.

**Purpose:** Move the goal from locating the archive to restoring the keypad.

## 20. Maintenance notice

**File:** game.js  
**Line/function/key:** `INTERACTABLE_DEFINITIONS.maintenanceNotice` lines 1404-1415; `DIALOGUE_DATA.maintenanceNotice` lines 1055-1061; `CLUE_DATA.maintenanceNotice` lines 845-846  
**Trigger:** Press E near the maintenance notice.  
**Speaker/type:** prompt / document / journal clue  
**Current text:**  
> Read maintenance notice  
> AUXILIARY POWER: Archive keypad routed through east service cabinet. Physical key required after outages.  
> Maintenance notice  
> Auxiliary archive power runs through a small electrical cabinet with a physical maintenance lock.

**Purpose:** Explain why the player needs a maintenance key and which cabinet matters.

## 21. Electrical cabinet blocked states

**File:** game.js  
**Line/function/key:** `getElectricalCabinetPrompt()` lines 7569-7579; `DIALOGUE_DATA.cabinetLocked`, `.cabinetNeedsNotice`, `.cabinetNeedsPanel` lines 1073-1098  
**Trigger:** Press E at the electrical cabinet before meeting its requirements.  
**Speaker/type:** prompt / object feedback / player thought  
**Current text:**  
> Inspect electrical cabinet  
> The cabinet has a small utility lock. It will not open by force.  
> The key fits, but the labels are half burned away. I need to know what this cabinet feeds before I touch it.  
> Before I send power anywhere, I should inspect the archive panel and make sure this is the right circuit.

**Purpose:** Prevent bypassing the notice and panel inspection steps.

**Flags:** The phrase "this cabinet feeds" depends on the player remembering the notice and dead panel.

## 22. Maintenance-key objective and pickup

**File:** game.js  
**Line/function/key:** `OBJECTIVE_DATA.findKey` lines 694-695; `INTERACTABLE_DEFINITIONS.maintenanceKey` lines 1416-1428; `DIALOGUE_DATA.keyCollected` lines 1064-1070; `CLUE_DATA.maintenanceKey` lines 853-854  
**Trigger:** Objective update and pressing E near the key.  
**Speaker/type:** objective / prompt / document label / journal clue  
**Current text:**  
> Find the maintenance key.  
> The electrical cabinet has a small physical lock.  
> Take maintenance key  
> The key is taped under broken chair metal. Its tag reads CABINET B, not ARCHIVE.  
> Loose maintenance key  
> A narrow service key for a utility cabinet, not for the archive door itself.

**Purpose:** Clarify that the key opens the cabinet, not the archive.

## 23. Breaker-routing objective and puzzle UI

**File:** game.js  
**Line/function/key:** `OBJECTIVE_DATA.resetPower` lines 698-699; `drawCircuitPuzzle()` lines 11639-11681; `circuitPuzzleState.message` assignments lines 6659-6725; `CLUE_DATA.breakerRouting` lines 913-914  
**Trigger:** Use maintenance key on the cabinet and open the breaker puzzle.  
**Speaker/type:** objective / puzzle instruction / puzzle feedback / journal clue  
**Current text:**  
> Route power to the archive corridor.  
> Set the four breaker lines in their safe order.  
> AUXILIARY BREAKER ROUTING  
> Auxiliary before archive. Lights after ventilation.  
> Click each line. Escape closes.  
> Four lines. One wrong sequence could trip the system again.  
> The indicators pulse: auxiliary, air, records, then light.  
> The relay rejects the route and drops every line.  
> ${circuitPuzzleState.sequence.length}/4 lines holding.  
> Auxiliary power restored. The corridor wakes in sections.  
> Breaker routing note  
> Auxiliary before archive. Lights after ventilation. Never engage all lines together.

**Purpose:** Teach and confirm the breaker order.

**Flags:** The UI says "air" in feedback but the objective says corridor and the clue says ventilation; this may confuse the required switch order.

## 24. Power-restored dialogue and clue

**File:** game.js  
**Line/function/key:** `DIALOGUE_DATA.powerReset` lines 1102-1112; `CLUE_DATA.powerReset` lines 857-858  
**Trigger:** Complete the breaker puzzle.  
**Speaker/type:** electrical cabinet / player thought / journal clue  
**Current text:**  
> The reset switch snaps upward. Somewhere in the wall, relays answer one by one.  
> The corridor sounds less abandoned when it remembers how to breathe.  
> Auxiliary power reset  
> Power returned to the archive keypad after the cabinet switch was thrown.

**Purpose:** Confirm that the keypad should now be powered.

## 25. Powered locked panel and code objective

**File:** game.js  
**Line/function/key:** `DIALOGUE_DATA.doorPoweredLocked` lines 996-1002; `DIALOGUE_DATA.lockNeedsClues` lines 1028-1034; `OBJECTIVE_DATA.findCode` lines 702-703  
**Trigger:** Inspect powered door/keypad before earning the code context.  
**Speaker/type:** door / lock panel / objective  
**Current text:**  
> A powered keypad watches from the frame. The door still holds shut.  
> The keypad wakes, but it asks for four digits I have not earned yet.  
> Find the archive code.  
> The keypad needs four digits.

**Purpose:** Tell the player the power step is done and a separate code clue is required.

**Flags:** "I have not earned yet" is clear as gating but does not say which unread object contains the code.

## 26. Security memo and code clue

**File:** game.js  
**Line/function/key:** `INTERACTABLE_DEFINITIONS.securityMemo` lines 1376-1388; `DIALOGUE_DATA.memo` lines 1037-1051; `CLUE_DATA.securityMemo` lines 849-850  
**Trigger:** Press E near the memo on the corridor floor.  
**Speaker/type:** prompt / document / player thought / journal clue  
**Current text:**  
> Read security memo  
> ARCHIVE ACCESS: Use the last official record year until central authentication returns.  
> Public university records terminate in 2079. Archive access logs continue for seven years after, written by hand.  
> Officially the university stopped remembering itself. Unofficially, someone kept feeding the archive.  
> Abandoned security memo  
> The archive code follows the last official university record year. The public registry ends in 2079.

**Purpose:** Reveal the indirect code `2079` and deepen the records mystery.

**Flags:** If the player reads this early, they may not connect it to the keypad until much later.

## 27. Archive keypad UI and feedback

**File:** game.js  
**Line/function/key:** `OBJECTIVE_DATA.enterCode` lines 706-707; `drawKeypadScreen()` lines 11082-11116; `drawKeypadButtons()` lines 11119-11135; `submitKeypadCode()` lines 7611-7633  
**Trigger:** Use powered keypad.  
**Speaker/type:** objective / keypad UI / failure and success feedback  
**Current text:**  
> Unlock the archive door.  
> Enter the code at the powered keypad.  
> ARCHIVE ACCESS  
> 1  
> 2  
> 3  
> 4  
> 5  
> 6  
> 7  
> 8  
> 9  
> <  
> 0  
> OK  
> Type digits. Enter submits. Esc exits.  
> Enter four digits.  
> Four digits required.  
> Sequence rejected. Missing context.  
> Incorrect code.  
> Accepted.

**Purpose:** Let the player enter the archive code and receive clear error feedback.

**Flags:** "Sequence rejected. Missing context." can appear even if the player knows the number but skipped a required read; the missing context is not named.

## 28. Archive unlock dialogue and clue

**File:** game.js  
**Line/function/key:** `DIALOGUE_DATA.wrongCode`, `.correctCode`, `.doorUnlocked` lines 1134-1149 and 1005-1015; `CLUE_DATA.archiveUnlocked` lines 861-862  
**Trigger:** Submit wrong or correct code; inspect/open unlocked archive door.  
**Speaker/type:** lock panel / door / player thought / journal clue  
**Current text:**  
> The keypad rejects the sequence. The red light lingers a little too long.  
> 2079 is accepted. The archive door unlocks with a sound like a held breath leaving a room.  
> The lock has released. Cold air presses through the seam.  
> For the first time tonight, the university lets something open.  
> Archive door unlocked  
> The keypad accepted 2079. Something behind the door woke up late.

**Purpose:** Confirm the archive is unlocked and raise dread before entry.

# 3. Archive entrance

## 29. Enter archive objective and first archive line

**File:** game.js  
**Line/function/key:** `OBJECTIVE_DATA.enterArchive` lines 710-711; `DIALOGUE_DATA.archiveEntrance` lines 1152-1158  
**Trigger:** Archive door unlocks and the player enters the archive.  
**Speaker/type:** objective / player thought  
**Current text:**  
> Enter the archive.  
> The door has finally released.  
> The archive is warmer than the corridor. That makes it worse.

**Purpose:** Move the player into the next chapter and set discomfort.

## 30. Archive exit prompts

**File:** game.js  
**Line/function/key:** `getArchiveExitPrompt()` lines 7504-7514; `DIALOGUE_DATA.archiveExitBlockedLater` lines 1162-1168  
**Trigger:** Stand near the archive entrance/exit in different story states.  
**Speaker/type:** prompt / door feedback  
**Current text:**  
> Return to corridor  
> Try archive exit  
> Test wrong exit  
> Enter distorted corridor  
> The doorway has folded into a flat strip of wall. It remembers being an exit, but not for me.

**Purpose:** Let the player leave before the manuscript event, then communicate that reality has changed afterward.

**Flags:** These prompt variations depend on state and may feel contradictory unless the player notices the manuscript event as the boundary.

# 4. Archive exploration

## 31. Restricted-collection objective

**File:** game.js  
**Line/function/key:** `OBJECTIVE_DATA.locateRestricted` lines 714-715  
**Trigger:** Entering the archive.  
**Speaker/type:** objective  
**Current text:**  
> Locate the restricted collection.  
> Begin with the archive index terminal.

**Purpose:** Direct the player to the terminal before shelf searches.

## 32. Archive terminal interaction

**File:** game.js  
**Line/function/key:** `INTERACTABLE_DEFINITIONS.archiveIndexTerminal` lines 1515-1525; `DIALOGUE_DATA.archiveIndex` and `.archiveIndexUnreadable` lines 1171-1191; `CLUE_DATA.archiveIndex` lines 865-866  
**Trigger:** Press E at archive index terminal.  
**Speaker/type:** prompt / terminal / player thought / journal clue  
**Current text:**  
> Use index terminal  
> The terminal lists every shelf except C13. Adjacent rows still reserve its gap.  
> Deleted from the search, not from the room.  
> A dead cursor blinks beside the archive seal. The search prompt is waiting for someone who knows what to ask.  
> Archive index terminal  
> Shelf C13 does not appear in the searchable index, but adjacent shelves still reserve its gap.

**Purpose:** Establish C13 as the missing restricted shelf.

**Flags:** The unreadable-terminal line mentions "someone who knows what to ask" but does not explain a player action.

## 33. Shelf-search objective

**File:** game.js  
**Line/function/key:** `OBJECTIVE_DATA.searchMarkedShelves` lines 718-719; `DIALOGUE_DATA.shelfBeforeIndex`, `.shelfAlreadySearched` lines 1194-1210  
**Trigger:** After using the index terminal; also when searching shelves too early or repeatedly.  
**Speaker/type:** objective / shelf feedback  
**Current text:**  
> Search the marked shelf sections.  
> Shelf C13 is missing from the index.  
> The shelf labels mean nothing until I know what the archive refuses to list.  
> Only dust and duplicate folders remain here.

**Purpose:** Send the player to the three marked shelves and gate them behind terminal context.

## 34. Marked shelf records

**File:** game.js  
**Line/function/key:** `ARCHIVE_SHELF_SEARCHES` lines 351-372; `INTERACTABLE_DEFINITIONS.archiveShelfPersonnel`, `.archiveShelfWaterDamage`, `.archiveShelfRestricted` lines 1526-1564  
**Trigger:** Press E at shelf A-02, C-11, or C13.  
**Speaker/type:** prompt / inspect overlay / document text  
**Current text:**  
> Search shelf A-02  
> Personnel transfer  
> A transfer list names three archivists assigned to C13 in 2081, two years after the university stopped issuing official records.  
> Search shelf C-11  
> Water damage log  
> The log is mostly mildew and initials. Someone kept reporting wet paper beneath a dry ceiling.  
> Search shelf C13  
> Restricted access sheet  
> Cabinet R-6 is listed beside a sealed key held above shelf C13. The entry is not in the terminal.

**Purpose:** Provide two useful records, one atmospheric record, and connect C13 to the ladder and R-6 cabinet.

## 35. Shelf clue journal entries

**File:** game.js  
**Line/function/key:** `CLUE_DATA.shelfPersonnelRecord`, `.shelfAtmosphericRecord`, `.shelfAccessRecord` lines 869-878  
**Trigger:** Shelf record is collected and viewed in journal.  
**Speaker/type:** journal clue  
**Current text:**  
> Useful record: personnel transfer  
> A late transfer list assigns staff to shelf C13 after official records ended.  
> Atmospheric record: water damage log  
> A maintenance log notes ceiling leaks, spoiled labels, and a smell of wet paper that never left.  
> Useful record: restricted access  
> A restricted access sheet mentions cabinet R-6 and a storage key held above C13.

**Purpose:** Preserve shelf information for later puzzle reasoning.

## 36. Handwritten coordinate objective and folder

**File:** game.js  
**Line/function/key:** `OBJECTIVE_DATA.findShelfCoordinate` lines 722-723; `getCoordinateFolderPrompt()` lines 7516-7524; `DIALOGUE_DATA.coordinateFolderLocked`, `.coordinateFolder` lines 1213-1228; `CLUE_DATA.shelfCoordinate` lines 881-882  
**Trigger:** After shelf searches; press E at loose folder.  
**Speaker/type:** objective / prompt / folder text / journal clue  
**Current text:**  
> Find the handwritten shelf coordinate.  
> Inspect the loose folder on the floor just right of shelf C13.  
> Search loose folder  
> Inspect loose folder  
> The folder is wedged under a collapsed stack. I should finish checking the marked shelves first.  
> Someone wrote C13 HIGH / LADDER LINE / KEY SEALED inside the folder spine.  
> Handwritten shelf coordinate  
> A folder margin reads C13 HIGH / LADDER LINE / KEY SEALED.

**Purpose:** Tell the player where to move the ladder and what to retrieve.

## 37. Ladder objective and interaction

**File:** game.js  
**Line/function/key:** `OBJECTIVE_DATA.moveArchiveLadder` lines 726-727; `getArchiveLadderPrompt()` lines 7526-7540; `DIALOGUE_DATA.ladderNeedsCoordinate`, `.ladderMoved` lines 1231-1246  
**Trigger:** Press or hold E at the rolling ladder.  
**Speaker/type:** objective / prompt / ladder feedback  
**Current text:**  
> Move the ladder beneath shelf C13.  
> Push repeatedly until the damaged wheels lock at C13.  
> Find coordinate before moving ladder  
> Hold E to push ladder (${progress}%)  
> Climb ladder at C13  
> The damaged wheels will need force, but first I need the handwritten shelf coordinate.  
> The wheels lock beneath C13.

**Purpose:** Explain the ladder task and its hold-to-push mechanic.

**Flags:** This is one of the few places where the required action is "hold E"; players who tap E may not understand movement.

## 38. High-shelf objective and sealed key

**File:** game.js  
**Line/function/key:** `OBJECTIVE_DATA.retrieveStorageKey` lines 730-731; `getArchiveHighShelfPrompt()` lines 7542-7551; `DIALOGUE_DATA.highShelfNeedsLadder`, `.sealedKeyFound` lines 1249-1264; `CLUE_DATA.sealedStorageKey` lines 885-886  
**Trigger:** Press E at the high shelf before/after moving ladder.  
**Speaker/type:** objective / prompt / shelf feedback / journal clue  
**Current text:**  
> Retrieve the archive box from C13.  
> Climb the locked ladder and inspect the upper shelf.  
> Inspect shelf C13  
> Climb to shelf C13  
> The shelf is out of reach. The ladder rail runs directly beneath it.  
> A sealed paper sleeve drops into my hand. The key inside is tagged R-6.  
> Sealed storage key  
> A waxed paper sleeve contains a small key stamped R-6.

**Purpose:** Reward the ladder route with the key for the filing cabinet.

**Flags:** "locked ladder" may sound like the ladder itself needs a key, while the actual gate is its position.

## 39. Filing cabinet objective and contents

**File:** game.js  
**Line/function/key:** `OBJECTIVE_DATA.openArchiveCabinet` lines 734-735; `getArchiveFilingCabinetPrompt()` lines 7553-7560; `DIALOGUE_DATA.filingCabinetLocked`, `.filingCabinetOpened` lines 1267-1282; `CLUE_DATA.cabinetPhotograph`, `.archiveAccessCard`, `.removedPageNote` lines 889-898  
**Trigger:** Press E at the filing cabinet before/after collecting the sealed key.  
**Speaker/type:** objective / prompt / cabinet feedback / journal clues  
**Current text:**  
> Open the filing cabinet.  
> Use the sealed storage key on the locked records cabinet.  
> Inspect locked cabinet  
> Use sealed key  
> Inspect open cabinet  
> The cabinet refuses the drawer. Its lock is stamped R-6.  
> The drawer opens onto a photograph, an access card, and a note folded around an empty page slot.  
> Photograph from cabinet R-6  
> A blurred archive table stands under a hanging lamp. The date is scratched away.  
> Archive access card  
> The card is still warm around the magnetic strip, as if it has been used recently.  
> Note about the removed page  
> A note says: The page that was removed must not be catalogued with the rest.

**Purpose:** Unlock the access card, introduce the removed page, and point toward a concealed table.

**Flags:** "the page" is introduced before the player has a concrete image of what page was removed.

## 40. Restricted cabinet reveal

**File:** game.js  
**Line/function/key:** `OBJECTIVE_DATA.useArchiveAccessCard`, `.revealManuscriptTable`, `.inspectManuscript` lines 738-755; `getArchiveRestrictedCabinetPrompt()` lines 7562-7567; `DIALOGUE_DATA.restrictedGateLocked`, `.manuscriptReveal`, `.manuscriptTable` lines 1285-1304 and 1325-1331; `CLUE_DATA.manuscriptTableRevealed` lines 901-902  
**Trigger:** Press E at restricted cabinet before/after finding the access card, then inspect the table.  
**Speaker/type:** objective / prompt / cabinet / player thought / journal clue  
**Current text:**  
> Use the archive access card.  
> Find what the removed page was meant to hide.  
> Reveal the manuscript table.  
> The restricted cabinet has power again.  
> Inspect the manuscript.  
> Open the revealed page on the central table.  
> Inspect restricted cabinet  
> Use archive access card  
> A card reader glows behind the shelf grille. It wants something issued by the archive itself.  
> The access card chirps once. The shelves around the center table lose their shadows.  
> There was a table here the whole time. The dark was arranged around it.  
> The markings continue across the torn edges.  
> Concealed manuscript table  
> The restricted cabinet opens the darkness around the central table.

**Purpose:** Gate and reveal the manuscript table as the archive chapter payoff.

**Flags:** The line "The restricted cabinet has power again" may be unclear because the player restored corridor power earlier, not a cabinet-specific system.

## 41. Missing-person records wing entry

**File:** game.js  
**Line/function/key:** `OBJECTIVE_DATA.investigateMissingPersons` and `.returnFromRecordsWing` lines 742-747; `INTERACTABLE_DEFINITIONS.missingPersonsWingDoor` lines 1636-1647  
**Trigger:** Press E at the missing-person records wing before the manuscript changes reality.  
**Speaker/type:** objective / prompt  
**Current text:**  
> Investigate the missing-person records.  
> Compare each file and photograph the detail the archive rewrote.  
> Enter missing-person records wing  
> Return to the main archive.  
> All three contradictions are preserved in the camera.

**Purpose:** Add an investigation task before the manuscript reveal and preserve evidence in the journal/camera.

# 5. Clues and documents

## 42. Journal clue: corridor set

**File:** game.js  
**Line/function/key:** `CLUE_DATA` lines 837-862  
**Trigger:** View collected corridor clues in the journal.  
**Speaker/type:** journal clue text  
**Current text:**  
> Damaged university directory  
> The archive is marked in the lower east wing, past the decommissioned records hall.  
> Dead electronic lock panel  
> The archive keypad is intact, but no power reaches it.  
> Maintenance notice  
> Auxiliary archive power runs through a small electrical cabinet with a physical maintenance lock.  
> Abandoned security memo  
> The archive code follows the last official university record year. The public registry ends in 2079.  
> Loose maintenance key  
> A narrow service key for a utility cabinet, not for the archive door itself.  
> Auxiliary power reset  
> Power returned to the archive keypad after the cabinet switch was thrown.  
> Archive door unlocked  
> The keypad accepted 2079. Something behind the door woke up late.

**Purpose:** Keep the corridor progression facts available after discovery.

## 43. Journal clue: archive search set

**File:** game.js  
**Line/function/key:** `CLUE_DATA` lines 865-914  
**Trigger:** View collected archive clues in the journal.  
**Speaker/type:** journal clue text  
**Current text:**  
> Archive index terminal  
> Shelf C13 does not appear in the searchable index, but adjacent shelves still reserve its gap.  
> Useful record: personnel transfer  
> A late transfer list assigns staff to shelf C13 after official records ended.  
> Atmospheric record: water damage log  
> A maintenance log notes ceiling leaks, spoiled labels, and a smell of wet paper that never left.  
> Useful record: restricted access  
> A restricted access sheet mentions cabinet R-6 and a storage key held above C13.  
> Handwritten shelf coordinate  
> A folder margin reads C13 HIGH / LADDER LINE / KEY SEALED.  
> Sealed storage key  
> A waxed paper sleeve contains a small key stamped R-6.  
> Photograph from cabinet R-6  
> A blurred archive table stands under a hanging lamp. The date is scratched away.  
> Archive access card  
> The card is still warm around the magnetic strip, as if it has been used recently.  
> Note about the removed page  
> A note says: The page that was removed must not be catalogued with the rest.  
> Concealed manuscript table  
> The restricted cabinet opens the darkness around the central table.  
> Reconstructed margin marks  
> The repaired page orders the archive path as staff assignment, restricted access, then the removed page.  
> Repeating manuscript pattern  
> The symbols repeat in a fixed order. The page may be showing a sequence rather than a language.  
> Breaker routing note  
> Auxiliary before archive. Lights after ventilation. Never engage all lines together.

**Purpose:** Preserve archive evidence and puzzle clues.

**Flags:** The journal mixes corridor breaker clue text with archive/manuscript clues, which may make the clue trail feel out of order.

## 44. Missing-person case records

**File:** game.js  
**Line/function/key:** `MISSING_PERSON_CASES` lines 550-590; `drawMissingPersonCaseOverlay()` lines 11277-11297  
**Trigger:** Enter missing-person records wing and inspect a case file.  
**Speaker/type:** record UI / document choices  
**Current text:**  
> Mara Voss  
> Student journalist  
> Photograph: 14 October 2079  
> Archive access: 18 October 2079  
> Official departure: 12 October 2079  
> Correction: Her file left before she did.  
> Elias Ward  
> Maintenance engineer  
> Disappearance: 03 March 2081  
> Badge access: archive shift on 09 March 2081  
> Official explanation: electrical accident  
> Correction: The machine signed his final shift.  
> Jonah Vale  
> Junior archivist  
> Photograph: Jonah beside a cabinet installed after he vanished  
> Disappearance: 22 June 2083  
> Official explanation: voluntary resignation  
> Correction: Archive property. Emergency alignment attached.

**Purpose:** Ask the player to identify contradictions and foreshadow the machine/archive agency.

**Flags:** "Correction" may imply the answer rather than an archive entry, which could reduce puzzle clarity.

## 45. Missing-person records UI

**File:** game.js  
**Line/function/key:** `drawMissingPersonsWing()` lines 11240-11251; `drawMissingPersonCaseOverlay()` lines 11277-11297; `INTERACTABLE_DEFINITIONS` lines 1778-1790  
**Trigger:** Records wing scene and case-file overlay.  
**Speaker/type:** scene label / prompt / puzzle instruction / success/failure  
**Current text:**  
> MISSING PERSONS  
> MISSING PERSONS — QUARANTINED RECORDS  
> FILE ALTERED  
> CONTRADICTION CAPTURED  
> Compare Mara Voss's file  
> Compare Elias Ward's file  
> Compare Jonah Vale's file  
> Select the detail the archive rewrote:  
> Arrow keys select — E photographs — Escape closes  
> CONTRADICTION NOT PROVEN  
> The selected detail can coexist with the remaining record.  
> ${caseData.name}: contradiction preserved.

**Purpose:** Teach the records-wing comparison mechanic and confirm each captured contradiction.

**Flags:** The difference between "archive rewrote" and "contradiction" may need earlier explanation.

## 46. Missing-person journal clues and changed versions

**File:** game.js  
**Line/function/key:** `CLUE_DATA` lines 941-958; `getJournalClue()` lines 7763-7781  
**Trigger:** Collect records-wing clues; later view them after reality changes and/or final page collection.  
**Speaker/type:** journal clue / altered clue  
**Current text:**  
> Mara Voss — altered file  
> Her official departure predates her final archive entry. The contradiction is photographed.  
> Elias Ward — altered file  
> His badge entered the archive six days after he disappeared. The contradiction is photographed.  
> Jonah Vale — altered file  
> His photograph contains a cabinet installed after he vanished. A note attached to his file records an emergency manuscript alignment.  
> Jonah's emergency alignment  
> OUTER — I / MIDDLE — V / INNER — III. Jonah warns that the rings authorize the archive and must not be aligned until the removed page is reconstructed.  
> The manuscript is a control interface  
> The completed page does not translate into prose. Its rings authorize changes to the archive and mark one control page as removed beyond the current room.  
> Mara Voss — photograph changed  
> Her face is blurred now. The date beneath the photograph has changed to 2086.  
> Elias Ward — photograph changed  
> A tall figure now stands behind Elias. It was not present when the evidence was photographed.  
> Jonah Vale — photograph changed  
> The letters in Jonah's name rearrange themselves whenever the journal is closed.  
> THE EXPLORER — altered file  
> Jonah's name has been replaced with THE EXPLORER. The access record is still updating.

**Purpose:** Carry evidence forward and show that reality changes alter the journal itself.

**Flags:** The changed clue versions may appear without enough warning that the journal can mutate.

## 47. Optional classroom document

**File:** game.js  
**Line/function/key:** `drawUncataloguedClassroom()` lines 11326-11361; `inspectClassroomRegister()` lines 4496-4501; `CLUE_DATA.classroomRegister` lines 961-962  
**Trigger:** Enter unmarked classroom, use flashlight, read register.  
**Speaker/type:** environmental text / notification / journal clue  
**Current text:**  
> ATTENDANCE IS A FORM OF RECORD  
> REGISTER  
> THE EXPLORER — PRESENT  
> A chair scrapes somewhere behind you.  
> Fresh ink writes your name into the final row.  
> Uncatalogued attendance register  
> The final line appeared in fresh ink: THE EXPLORER — PRESENT.

**Purpose:** Optional horror/lore scene that links the player to the archive records.

**Flags:** This optional lore may be important to the ending but can be missed.

# 6. Main puzzles

## 48. Manuscript entry and close controls

**File:** game.js  
**Line/function/key:** `drawManuscriptChrome()` lines 9863-9878; `INTERACTABLE_DEFINITIONS.archiveManuscriptTable` lines 1622-1634  
**Trigger:** Press E near the revealed manuscript table.  
**Speaker/type:** manuscript UI / button labels  
**Current text:**  
> Inspect manuscript table  
> VOYNICH MANUSCRIPT  
> C Controls  
> Close  
> DEV: Complete current stage

**Purpose:** Identify the manuscript interface, allow controls lookup and closing, and expose trailer-only completion.

**Flags:** Developer completion text should remain hidden in normal mode.

## 49. Manuscript fragment labels

**File:** game.js  
**Line/function/key:** `MANUSCRIPT_FRAGMENTS` lines 410-449; `drawTornFragment()` line 9675  
**Trigger:** Stage 1 page reconstruction.  
**Speaker/type:** puzzle labels  
**Current text:**  
> I  
> II  
> III  
> IV

**Purpose:** Label the four torn fragments.

## 50. Stage 1 reconstruction UI

**File:** game.js  
**Line/function/key:** manuscript stage render functions around lines 9580-9650; `manuscriptProgress.message` assignments lines 5158-5219  
**Trigger:** Manuscript Stage 1.  
**Speaker/type:** puzzle title / instructions / feedback / buttons  
**Current text:**  
> Stage 1  
> Page reconstruction  
> Place the four fragments into the page outline. Rotate markings to match torn edges.  
> Rotate -  
> Rotate +  
> That fragment is already locked in place.  
> Select a fragment first.  
> Rotate the marking to match the torn edge.  
> Page reconstruction complete. Margin marks surfaced.

**Purpose:** Teach fragment placement and confirm completion.

**Flags:** The player may need more explicit mouse-only and keyboard-only controls here.

## 51. Stage 1 pattern inspection

**File:** game.js  
**Line/function/key:** `drawPatternInspectionStage()` lines 9580-9600; `manuscriptProgress.message` line 4987; `CLUE_DATA.marginMarks` lines 905-906  
**Trigger:** After Stage 1 is solved.  
**Speaker/type:** puzzle title / instruction / button / journal clue  
**Current text:**  
> Page repaired  
> The order repeats  
> The four markings cross the repaired page. Read them as a repeated sequence.  
> Record pattern  
> Reconstructed margin marks  
> The repaired page orders the archive path as staff assignment, restricted access, then the removed page.

**Purpose:** Connect the repaired page to the next symbol-sequence puzzle.

## 52. Symbol labels and classifications

**File:** game.js  
**Line/function/key:** `MANUSCRIPT_SYMBOLS` lines 465-486; `drawSymbolButton()` lines 9790-9793; `drawSymbolMappingPanel()` lines 9734-9743  
**Trigger:** Stage 2 symbol interpretation and journal-mapping panel.  
**Speaker/type:** puzzle label / classification text  
**Current text:**  
> Aster  
> personnel transfer  
> Drain  
> water damage  
> Grille  
> restricted access  
> Hollow leaf  
> removed page  
> Journal mappings

**Purpose:** Label each original symbol and tie it to archive clue categories.

**Flags:** "Aster", "Drain", "Grille", and "Hollow leaf" are names but not explained as symbol names.

## 53. Stage 2 interpretation UI and feedback

**File:** game.js  
**Line/function/key:** `drawSymbolInterpretationStage()` lines 9708-9728; `drawSymbolSequenceSlots()` lines 9755-9770; `handleSymbolChoice()` lines 5256-5264  
**Trigger:** Manuscript Stage 2.  
**Speaker/type:** puzzle title / instruction / slot label / feedback / button  
**Current text:**  
> Stage 2  
> Symbol interpretation  
> Use the journal records to identify the three margin marks.  
> Margin sequence  
> Sequence cleared.  
> The ink recoils. That order does not match the records.  
> The three marks hold in the margin. The last page ring can be moved.  
> Begin final alignment

**Purpose:** Make the player choose the three-symbol sequence from journal clues.

**Flags:** "the records" is broad; the specific relevant records are the shelf clues and removed-page note.

## 54. Stage 3 ring labels and alignment UI

**File:** game.js  
**Line/function/key:** `MANUSCRIPT_RINGS` lines 610-612; `drawMissingPageAlignmentStage()` lines 9798-9809; `drawManuscriptRings()` lines 9841-9845; `manuscriptProgress.message` lines 5295 and related handlers  
**Trigger:** Manuscript Stage 3.  
**Speaker/type:** puzzle labels / instructions / feedback / buttons  
**Current text:**  
> Outer ring  
> Middle ring  
> Inner ring  
> Stage 3  
> Missing-page alignment  
> Jonah: OUTER I / MIDDLE V / INNER III.  
> Rotate the rings to complete the mark.  
> ${ringData.label}: ${ring.rotation}  
> Rotate -  
> Rotate +  
> Back  
> Reset  
> Rings reset.

**Purpose:** Let the player align three circular rings using Jonah's clue.

**Flags:** The fallback instruction "complete the mark" is vague if Jonah's clue was missed.

## 55. Manuscript solved text

**File:** game.js  
**Line/function/key:** `drawSolvedManuscriptStage()` lines 9848-9856; `DIALOGUE_DATA.postManuscriptPurpose` lines 1311-1322; `CLUE_DATA.manuscriptInterface` lines 957-958  
**Trigger:** Complete Stage 3 and return to archive.  
**Speaker/type:** puzzle completion / reconstructed manuscript / player thoughts / journal clue  
**Current text:**  
> Solved  
> The page is no longer paper  
> The rings are an authorization interface. A removed control page lies beyond this room.  
> The completed rings form an authorization diagram, not a translation. One control page is marked as removed beyond this room.  
> The camera holds proof that the archive erased these people. I have to get that evidence outside before the record changes again.  
> The exit is also the only route toward the removed page—and whoever is still maintaining this place.  
> The manuscript is a control interface  
> The completed page does not translate into prose. Its rings authorize changes to the archive and mark one control page as removed beyond the current room.

**Purpose:** Reframe the manuscript as a mechanism and send the player toward the changed exit.

**Flags:** "removed control page" and "current room" are abstract; this is a major lore turn that may need stronger grounding.

## 56. Chamber lock puzzle

**File:** game.js  
**Line/function/key:** `enterChamberRing()` and `drawChamberRingScene()` lines 3944-3960 and 11727-11747; `chamberRingProgress.message` lines 5557-5574  
**Trigger:** Reach the chamber ring after final-page progression.  
**Speaker/type:** reality message / puzzle UI / puzzle feedback  
**Current text:**  
> The room is absent from every directory.  
> CHAMBER LOCK  
> Four rotating bands. The markings match the reconstructed page.  
> J opens journal  
> Symbol -  
> Symbol +  
> Engage mechanism  
> The mechanism has no meaning without the reconstructed page.  
> The bands recoil. The order is recognized, but not accepted.  
> The four bands align. A chamber opens behind the records.

**Purpose:** Present a later four-symbol chamber mechanism and gate entry to the Archivist sequence.

**Flags:** This puzzle appears after the missing-page chapter but its relationship to the manuscript rings may be hard to distinguish.

# 7. Distorted corridor/reality changes

## 57. Reality-change objective

**File:** game.js  
**Line/function/key:** `OBJECTIVE_DATA.findMissingPage` lines 774-775  
**Trigger:** After solving manuscript and returning to archive.  
**Speaker/type:** objective  
**Current text:**  
> Get the evidence out of the archive.  
> The manuscript marks its removed control page beyond this room. Try the archive exit.

**Purpose:** Tell the player to use the archive exit after reality changes.

**Flags:** The objective combines escape evidence and missing-page retrieval, which can split player attention.

## 58. Changed archive messages

**File:** game.js  
**Line/function/key:** `beginChangedArchiveChapter()` and archive-exit handlers lines 7186, 6794, 6934, 6954  
**Trigger:** Return from manuscript, inspect changed details, or try the exit.  
**Speaker/type:** reality notification  
**Current text:**  
> It looks almost normal until you try to leave.  
> The exit sign points away from itself. Three changes still need names.  
> The threshold returns you to the same room. The archive has started correcting itself.  
> The archive exit no longer opens to the corridor I entered from.

**Purpose:** Signal that reality changed and prime the player to inspect impossible details.

**Flags:** "Three changes still need names" is evocative but does not plainly say "inspect three changed objects."

## 59. Changed archive objectives

**File:** game.js  
**Line/function/key:** `OBJECTIVE_DATA.noticeArchiveChanges`, `.testDistortedExit`, `.chooseRealDoor`, `.activateWallSwitches`, `.reachMissingPage` lines 778-795  
**Trigger:** Progress through the changed archive and distorted corridor.  
**Speaker/type:** objective  
**Current text:**  
> Notice three impossible changes.  
> Each changed detail exposes one symbol.  
> Test the corridor exit.  
> The normal way out is no longer trustworthy.  
> Choose the real duplicate door.  
> Use the three revealed symbols to reject the false doors.  
> Open the sealed records section.  
> Activate the wall switches in the order the manuscript taught you.  
> Reach the missing page.  
> The final passage is open under the distant light.

**Purpose:** Drive the post-manuscript corridor chapter.

## 60. Required changed archive inspectables

**File:** game.js  
**Line/function/key:** `REALITY_CHANGE_SYMBOLS` lines 616-636; `INTERACTABLE_DEFINITIONS.changedShelf`, `.alteredPhotograph`, `.backwardClock` lines 1648-1683; `CLUE_DATA` lines 917-926  
**Trigger:** Press E near the three required changed details.  
**Speaker/type:** prompt / journal clue  
**Current text:**  
> Inspect moved shelf  
> Inspect altered photograph  
> Inspect backward clock  
> Changed archive shelf  
> Shelf C13 has moved by itself. Behind it, the staff-assignment symbol is scratched into bare wall.  
> Altered photograph  
> The photograph now shows the restricted cabinet where the manuscript table used to be.  
> Backward-running clock  
> The desk clock runs backward. Its second hand drags the removed-page symbol through dust.

**Purpose:** Reveal the symbols needed to choose the real duplicate door.

**Flags:** The altered photograph clue names restricted cabinet but does not explicitly say that is a symbol category.

## 61. Optional changed archive inspectables

**File:** game.js  
**Line/function/key:** `INTERACTABLE_DEFINITIONS.wrongExitSign`, `.extraArchiveDoor` lines 1684-1707; `handleOptionalArchiveChangeInteract()` lines 6794-6810  
**Trigger:** Press E near optional wrong sign or extra door.  
**Speaker/type:** prompt / inspect overlay  
**Current text:**  
> Inspect wrong exit sign  
> Exit sign  
> The arrow points deeper into the archive, but its reflected shadow points to the door.  
> Inspect extra door  
> Extra door  
> The door has no hinges and no room behind it on any map you collected.

**Purpose:** Add optional atmosphere and reinforce altered geography.

## 62. Distorted corridor labels and first loop

**File:** game.js  
**Line/function/key:** `DISTORTED_CORRIDOR.DOORS` lines 658-660; `INTERACTABLE_DEFINITIONS.distortedExitLoop` lines 1708-1718; `handleDistortedExitLoopInteract()` lines 7245-7261  
**Trigger:** Enter distorted corridor and try the initial exit.  
**Speaker/type:** environmental label / prompt / reality notification / clue  
**Current text:**  
> A-02  
> C13  
> R-06  
> Try corridor exit  
> The exit opens onto the same corridor. The wall marks have changed.  
> The duplicate doors share too many symbols. The archive changes are the key.  
> False duplicate door  
> The wrong door folds the corridor back onto itself and changes one detail.

**Purpose:** Introduce looping logic and connect duplicate doors to discovered symbols.

**Flags:** The false-duplicate-door clue can be collected after choosing wrong, but the player may need the concept before choosing.

## 63. Duplicate doors

**File:** game.js  
**Line/function/key:** `INTERACTABLE_DEFINITIONS.distortedDoorFalseWest`, `.distortedDoorReal`, `.distortedDoorFalseEast` lines 1719-1752; `handleDistortedDoorInteract()` lines 7286-7294  
**Trigger:** Press E at a duplicate door.  
**Speaker/type:** prompt / failure feedback  
**Current text:**  
> Open duplicate door A-02  
> Open duplicate door C13  
> Open duplicate door R-06  
> False door. The corridor returns you safely, but one detail changes.

**Purpose:** Let the player choose between false doors and the correct door.

## 64. Distorted wall switches

**File:** game.js  
**Line/function/key:** `INTERACTABLE_DEFINITIONS.distortedSwitchStaff`, `.distortedSwitchRestricted`, `.distortedSwitchRemoved` lines 1753-1785; `handleDistortedWallSwitchInteract()` lines 7309-7319; `CLUE_DATA.sealedRecordsOpened` lines 933-934  
**Trigger:** After choosing the real duplicate door, press E at three wall switches.  
**Speaker/type:** prompt / switch feedback / journal clue  
**Current text:**  
> Activate staff switch  
> Activate restricted switch  
> Activate removed-page switch  
> The switches fall back into the wall. The order starts with staff assignment.  
> ${realityProgress.switchSequence.length}/3 switches accepted.  
> Sealed records section opened  
> The wall switches accepted the order: staff assignment, restricted access, removed page.

**Purpose:** Resolve the switch order puzzle using earlier symbol-order clues.

**Flags:** The failure feedback reveals only the first step of the order.

## 65. Missing page reveal and pickup

**File:** game.js  
**Line/function/key:** `INTERACTABLE_DEFINITIONS.missingFinalPage` lines 1786-1797; `handleMissingPageInteract()` lines 7340-7368; `CLUE_DATA.finalPageVisible` lines 937-938  
**Trigger:** Open the final passage and press E at the page under the distant light.  
**Speaker/type:** prompt / inspect overlay / journal clue  
**Current text:**  
> Take missing page  
> Continuously updated record  
> The page changes while you hold it. Four familiar symbols circle a chamber diagram. Someone is still maintaining the archive.  
> Missing page visible  
> The missing page lies under a distant light, no longer hidden by the archive.

**Purpose:** Reveal the page that leads to the final chamber/Archivist material.

**Flags:** "Someone" is intentionally mysterious, but the action unlocked by the chamber diagram may need clearer signposting.

## 66. Trailer-only reality shortcuts

**File:** game.js  
**Line/function/key:** `handleTrailerShortcuts()` and related messages lines 4095-4220; `DIALOGUE_DATA.trailerArchiveReveal`, `.trailerReveal` lines 1334-1351  
**Trigger:** TRAILER_MODE shortcuts or trailer reveal interaction.  
**Speaker/type:** trailer-only notification / dialogue  
**Current text:**  
> Trailer: changed archive forced.  
> Trailer: final page reveal forced.  
> The archive search is compressed. The manuscript table reveal is now staged for capture.  
> Archive reveal state armed. Normal progression has not been changed.

**Purpose:** Support recording/demo routing without changing normal progression.

**Flags:** Should remain hidden or isolated in normal play and cinematic capture.

# 8. Archivist introduction

## 67. Archivist approach objectives

**File:** game.js  
**Line/function/key:** `OBJECTIVE_DATA.unlockRestrictedChamber`, `.inspectFinalEntry`, `.confrontArchivist` lines 798-819  
**Trigger:** After missing-page/chamber progression and Archivist sequence.  
**Speaker/type:** objective  
**Current text:**  
> Unlock the restricted archive chamber.  
> Arrange the four rotating bands using the manuscript pattern.  
> Inspect the final archive entry.  
> Approach the terminal after the update loop collapses.  
> Survive the Archivist.  
> Use the charged flashlight beam and dodge its attacks.

**Purpose:** Lead into the final chamber and boss encounter.

**Flags:** The bridge from "four rotating bands" to direct combat is abrupt.

## 68. Archivist introduction messages

**File:** game.js  
**Line/function/key:** `enterArchivistChamber()` and combat setup lines 3975, 6092, 6244, 6344  
**Trigger:** Enter the Archivist chamber and progress into combat.  
**Speaker/type:** reality notification / Archivist dialogue / combat notification  
**Current text:**  
> The Archivist turns from a terminal that is still rewriting itself.  
> The final entry is exposed. Strike now.  
> "You entered as an observer. You will remain as a record."  
> "You cannot leave a place that has already written you."

**Purpose:** Introduce the Archivist as the antagonist and motivate the final conflict.

**Flags:** The Archivist's identity and relation to the archive are mostly implied rather than explained.

## 69. Archivist chamber environmental/UI labels

**File:** game.js  
**Line/function/key:** `drawLegacyArchivistChamberScene()` lines 11787-11827; `drawArchivistEffects()` and `drawBossCombatUi()` lines 11856-12169  
**Trigger:** Archivist chamber and boss fight rendering.  
**Speaker/type:** environmental label / combat UI  
**Current text:**  
> UPDATING  
> ENTRY READY  
> STABILITY ${"|".repeat(archivistProgress.playerStability)}  
> PHASE ${Math.min(3, archivistProgress.bossPhase)}  
> THE ARCHIVIST  
> KEEPER OF THE LIVING RECORD  
> STABILITY  
> MANUSCRIPT CHARGE

**Purpose:** Present final encounter status and archive-machine theme.

# 9. Panel and invincibility phase

## 70. Legacy panel objectives and prompts

**File:** game.js  
**Line/function/key:** `OBJECTIVE_DATA.disableCorruptedNodes`, `.identifyTrueArchivist`, `.breakUpdateLoop` lines 802-811; `INTERACTABLE_DEFINITIONS` lines 1811-1949  
**Trigger:** Legacy Archivist/chamber phases if reached/enabled.  
**Speaker/type:** objective / prompt  
**Current text:**  
> Disable the corrupted record nodes.  
> Keep the flashlight on and interrupt all three records.  
> Identify the true Archivist.  
> Use the flashlight to find the figure carrying the complete pattern.  
> Break the archive update loop.  
> Activate the four machine controls in the manuscript order.  
> Disable corrupted record  
> Test revealed figure  
> Activate ${ARCHIVE_SYMBOL_LABELS[ARCHIVE_SYMBOL_PATTERN[index]]} control  
> Inspect final archive entry

**Purpose:** Explain older/conditional final-chamber interaction phases.

**Flags:** Several related interactables are currently unavailable via `isAvailable: () => false`, so this text may be unreachable.

## 71. Legacy Archivist phase feedback

**File:** game.js  
**Line/function/key:** `disableCorruptedNode()`, `testArchivistCopy()`, `activateFinalArchiveControl()`, `damageArchivistPlayer()` lines 5656-5774  
**Trigger:** Legacy Archivist phase actions if enabled/reached.  
**Speaker/type:** objective feedback / failure feedback  
**Current text:**  
> A false prompt blinks where the Archivist stood.  
> The record is hidden during the power drop.  
> ${archivistProgress.corruptedNodesDisabled.size}/3 corrupted records disabled.  
> The true sequence remains when the copies fail.  
> ${archivistProgress.finalSequence.length}/4 controls holding.  
> The update loop collapses. One terminal remains awake.  
> Your record tears and reforms. Stability restored; the encounter restarts.

**Purpose:** Support a phased, non-combat Archivist sequence.

**Flags:** This appears to overlap with the newer boss-combat text and may confuse the story if both paths are reachable.

## 72. Combat seal/invincibility instructions

**File:** game.js  
**Line/function/key:** `OBJECTIVE_DATA.breakArchivistSeal` lines 822-823; `startCombatSealInterruption()`, `activateCombatSealControl()` lines 6259-6291; `drawArchivistSealGuidance()` lines 11995-12022  
**Trigger:** Archivist invincible seal phase.  
**Speaker/type:** objective / combat UI / feedback  
**Current text:**  
> Break the Archivist's machine seal.  
> Activate Eye, Spiral, Key, then Hand.  
> The machine seals its keeper. Break the four-symbol lock.  
> ARCHIVE SEAL ACTIVE  
> Deactivate the four symbols in order:  
> ${label}${index < 3 ? "  >" : ""}  
> NEXT  
> The seal rejects the order.  
> The seal breaks. The final entry is vulnerable.

**Purpose:** Explain why the Archivist cannot be damaged and how to remove invincibility.

**Flags:** The labels Eye/Spiral/Key/Hand are not the same as Aster/Drain/Grille/Hollow leaf from the manuscript puzzle.

# 10. Vulnerable boss phase

## 73. Boss combat tutorial and status

**File:** game.js  
**Line/function/key:** `drawBossCombatUi()` lines 12141-12200  
**Trigger:** Early boss combat until each tutorial action is performed.  
**Speaker/type:** combat tutorial / combat UI  
**Current text:**  
> THE ARCHIVIST  
> KEEPER OF THE LIVING RECORD  
> STABILITY  
> MANUSCRIPT CHARGE  
> A/D: Move  
> Space: Dodge  
> E / Click: Focus beam

**Purpose:** Teach boss movement, dodge, and attack controls.

## 74. Boss attack and damage feedback

**File:** game.js  
**Line/function/key:** `queueBossAttack()`, `damageArchivistPlayerCombat()`, and related handlers lines 6305-6344  
**Trigger:** Boss attack telegraphs, player damage, or phase transitions.  
**Speaker/type:** combat notification / failure feedback  
**Current text:**  
> A final record is charging. Dodge the beam.  
> The Archivist rewrites the space around you.  
> The copy collapses into an incorrect sequence.  
> The update loop rejects the symbol and erases the sequence.  
> The record slash cuts through your outline.  
> The final record closes around you.  
> Corrupted ink enters your record.  
> The archive floor erupts beneath you.

**Purpose:** Communicate attacks, consequences, and failed actions during the boss encounter.

**Flags:** Some lines are atmospheric but may not identify what the player did wrong.

## 75. Boss defeat/failure screens

**File:** game.js  
**Line/function/key:** `drawBossDefeatScreen()` lines 12205-12218; `drawArchivistAftermath()` lines 11876-11897  
**Trigger:** Player defeat or legacy aftermath.  
**Speaker/type:** failure screen / aftermath narration / menu  
**Current text:**  
> ARCHIVE ENTRY COMPLETED  
> STATUS: CONTAINED  
> Retry Boss  
> Return to Title  
> ARCHIVE ENTRY CREATED  
> SUBJECT: [REDACTED]  
> STATUS: STILL INSIDE  
> The archive was never recording the past.  
> It was preparing the next entry.

**Purpose:** Show fail-state outcome and let the player retry or return to title.

# 11. Escape sequence

## 76. Escape objectives

**File:** game.js  
**Line/function/key:** `OBJECTIVE_DATA.escapeUniversity`, `.chooseCamera` lines 826-831  
**Trigger:** After defeating the Archivist and entering escape sequence.  
**Speaker/type:** objective  
**Current text:**  
> Escape the university.  
> Run toward the exterior light before the archive collapses.  
> Decide what to carry out.  
> Keep the camera and its evidence, or drop it and run.

**Purpose:** Direct the final escape and evidence-choice moment.

## 77. Escape route messages

**File:** game.js  
**Line/function/key:** `updateEscape()` and choice handlers lines 4628-4724; `drawEscapeScene()` lines 11471-11495  
**Trigger:** Escape obstacles, bypass, debris, and camera choice.  
**Speaker/type:** action prompt / warning / notification / environmental label  
**Current text:**  
> The corridor is buried. Press Up to climb through the service bypass.  
> The bypass collapses behind you.  
> Debris strikes the floor. Keep moving.  
> FALLING  
> SERVICE BYPASS  
> Keep the camera. Carry the evidence through the final collapse.  
> The camera breaks against the floor. You can run faster now.

**Purpose:** Guide the player through the escape path and hazards.

## 78. Camera-choice panel

**File:** game.js  
**Line/function/key:** `drawEscapeGameplayUi()` lines 11543-11568  
**Trigger:** Reach the camera-choice point during the escape.  
**Speaker/type:** choice UI / instruction  
**Current text:**  
> THE CAMERA IS SLOWING YOU DOWN  
> The final corridor is collapsing. Decide what leaves with you.  
> KEEP THE CAMERA  
> Harder escape — preserve and distribute the evidence  
> DROP THE CAMERA  
> Easier escape — lose the recorded evidence  
> Arrow keys, E, Enter, or mouse

**Purpose:** Present the ending-affecting evidence choice.

# 12. Ending

## 79. Escape reveal narration

**File:** game.js  
**Line/function/key:** `drawEscapeReveal()` lines 11581-11630  
**Trigger:** Escape reaches exterior light and reveal timer advances.  
**Speaker/type:** ending narration / archive entry  
**Current text:**  
> Morning light. The university doors shut behind me.  
> A damaged evidence upload completed before the camera failed.  
> I left the camera beneath the university.  
> One surviving image shows me inside the archive, photographed from behind.  
> My phone now holds one image: me inside the archive, photographed from behind.  
> I did not take it.  
> NEW ARCHIVE ENTRY AVAILABLE  
> SUBJECT: THE EXPLORER  
> STATUS: RELEASED  
> OBSERVATION: CONTINUING  
> EVIDENCE: DISTRIBUTED  
> ATTENDANCE RECORD: STILL OPEN  
> I made it out.  
> But the archive did not let me go.

**Purpose:** Resolve the escape while implying the archive still records or follows the protagonist.

## 80. Ending menu

**File:** game.js  
**Line/function/key:** `drawEndingScreen()` lines 8227-8259; `getEndingMenuOptions()` lines 3153-3154  
**Trigger:** Ending state.  
**Speaker/type:** ending UI / menu  
**Current text:**  
> VOYNICH  
> THE EVIDENCE SURVIVED.  
> THE RECORD CONTINUES.  
> ATTENDANCE: PRESENT  
> Restart  
> Title  
> Arrow keys, E, Enter, or mouse

**Purpose:** Show ending status and allow restart/title navigation.

# 13. Menus and general UI

## 81. Controls overlay

**File:** game.js  
**Line/function/key:** `drawControlsOverlay()` lines 10831-10908  
**Trigger:** Press C.  
**Speaker/type:** controls UI  
**Current text:**  
> CONTROLS  
> C or Escape closes  
> Exploration  
> A / D or Left / Right: move  
> E: interact, advance dialogue  
> F: flashlight  
> J: journal  
> F2: debug overlay  
> Journal and keypad  
> Journal A / D: clue pages  
> Numbers: keypad digits  
> Backspace: erase digit  
> Enter or E: submit  
> Escape: close open panel  
> Manuscript puzzles  
> Mouse: select, drag, press buttons  
> Tab or 1-4: choose fragment  
> Arrows: move selected item  
> Q / E: rotate selected item  
> Enter: place, choose, or rotate  
> R: reset sequence or rings  
> B: back from final rings  
> Investigation and climax  
> Records: arrows + E photograph  
> Classroom: F changes the room  
> Boss: Space dodge, E/click beam  
> Escape: Up enters the bypass  
> Camera choice: arrows + E  
> Trailer only: F6 changed archive, F7 silhouette, F8 glitch, F9 final, F10 capture.

**Purpose:** Centralize controls so gameplay screens can stay uncluttered.

**Flags:** This is long for a single overlay and includes late-game mechanics before the player reaches them.

## 82. Journal shell

**File:** game.js  
**Line/function/key:** `drawJournalScreen()` lines 10936-11003  
**Trigger:** Press J.  
**Speaker/type:** journal UI  
**Current text:**  
> JOURNAL  
> Current objective  
> Collected clues  
> No clues recorded.  
> A/D pages ${journalState.cluePage + 1}/${pageCount} - ${clueIds.length} clues  
> ${clueIds.length} clues  
> J / Escape closes

**Purpose:** Display current objective and collected clue text.

## 83. Objective and clue banners

**File:** game.js  
**Line/function/key:** `drawObjectiveDisplay()` lines 10750-10766; `setCurrentObjective()`, `completeObjective()`, `collectClue()` lines 7741-7799  
**Trigger:** Objective update, objective completion, or clue collection.  
**Speaker/type:** objective UI / notification  
**Current text:**  
> ${OBJECTIVE_DATA[objectiveId].title}  
> ${OBJECTIVE_DATA[objectiveId].detail}  
> Clue collected: ${CLUE_DATA[clueId].title}  
> Completed: ${OBJECTIVE_DATA[objectiveId].title}

**Purpose:** Keep player goals and clue pickups visible.

**Flags:** Dynamic banners may fade before the player has time to read longer titles.

## 84. Interaction prompt template

**File:** game.js  
**Line/function/key:** `drawInteractionPrompt()` lines 10911-10933; `getInteractablePrompt()` line 7510 and nearby prompt getters  
**Trigger:** Player enters range of an available interactable.  
**Speaker/type:** contextual prompt  
**Current text:**  
> [E] ${getInteractablePrompt(interactionState.activeInteractable)}

**Purpose:** Tell the player which object can be interacted with.

## 85. Inspect overlay shell

**File:** game.js  
**Line/function/key:** `drawInspectOverlay()` lines 11006-11044  
**Trigger:** Inspect overlay opens for records, clues, final page, optional details, etc.  
**Speaker/type:** inspect UI  
**Current text:**  
> ${inspectOverlayState.title}  
> ${inspectOverlayState.text}  
> Copied to journal  
> E / Enter / Escape

**Purpose:** Present longer clue/document text and journal-copy confirmation.

## 86. Dialogue panel shell

**File:** game.js  
**Line/function/key:** `drawDialoguePanel()` lines 11152-11171; `DIALOGUE_DATA` lines 966-1351  
**Trigger:** Dialogue is active.  
**Speaker/type:** dialogue UI  
**Current text:**  
> ${line.speaker}  
> ${visibleText}  
> E / Enter

**Purpose:** Show speaker-labeled dialogue with typewriter text.

## 87. Audio unlock prompt

**File:** game.js  
**Line/function/key:** `drawAudioUnlockPrompt()` lines 11059-11079  
**Trigger:** Browser audio is available but not yet unlocked by user input.  
**Speaker/type:** audio UI prompt  
**Current text:**  
> Click or press any key to enable audio

**Purpose:** Explain why audio may be silent until interaction.

## 88. Dynamic key labels

**File:** game.js  
**Line/function/key:** `DEBUG_KEYS` and `INPUT_KEYS` lines 1985-2024  
**Trigger:** Controls/debug systems display key names.  
**Speaker/type:** key label data  
**Current text:**  
> A  
> D  
> Left  
> Right  
> Up  
> Down  
> E  
> F  
> J  
> C  
> Escape  
> Enter  
> Space  
> F2  
> F8  
> F10  
> Backspace  
> 0  
> 1  
> 2  
> 3  
> 4  
> 5  
> 6  
> 7  
> 8  
> 9  
> Tab  
> Q  
> R  
> B  
> F6  
> F7  
> F9

**Purpose:** Provide labels for input tracking, controls, and debug overlay.

## 89. Debug overlay

**File:** game.js  
**Line/function/key:** `drawDebugScreen()` lines 12239-12278; `getAudioStatusLabel()` lines 12282-12298  
**Trigger:** Press F2 in non-trailer, non-cinematic gameplay.  
**Speaker/type:** debug UI  
**Current text:**  
> VOYNICH  
> state: ${gameState.current}  
> player x: ${Math.round(player.x)} camera x: ${Math.round(camera.x)}  
> flashlight: ${scene.flashlightOn ? "on" : "off"} boxes: ${debug.showCollisionBoxes ? "on" : "off"}  
> anim: ${player.animationMode} frame: ${player.animationFrame}  
> trailer: ${TRAILER_MODE ? "on" : "off"} audio: ${getAudioStatusLabel(audioManager.getStatus())}  
> archive: ${archiveProgress.searchedShelves.size}/3 shelves table ${archiveProgress.manuscriptTableRevealed ? "shown" : "hidden"} ladder ${Math.round(archiveProgress.ladderX)}  
> keys:  
> ${key.label}: ${value}  
> unavailable  
> press key/click  
> ready ${status.missingCount} missing  
> ready blocked  
> ready

**Purpose:** Internal state/debug visibility.

**Flags:** This is player-visible if toggled; it should stay hidden in normal and capture modes.

# 14. Unused or unreachable text

## 90. Unused manuscript symbol hints

**File:** game.js  
**Line/function/key:** `MANUSCRIPT_SYMBOLS[].hint` lines 468, 475, 482, 489; no runtime `.hint` use found by `rg`  
**Trigger:** No current trigger found.  
**Speaker/type:** unused puzzle hint text  
**Current text:**  
> The transfer list points to staff assigned after the official end.  
> The water log is a maintenance classification, not the missing-page path.  
> The access sheet links C13 to cabinet R-6 and the sealed key.  
> The cabinet note names the page removed from the catalogue.

**Purpose:** Intended to explain symbol reasoning, but currently not shown.

**Flags:** These are important clarity hints that appear to be unreachable.

## 91. Unavailable legacy Archivist interactables

**File:** game.js  
**Line/function/key:** `INTERACTABLE_DEFINITIONS` lines 1811-1960; `isAvailable: () => false`  
**Trigger:** No current trigger found for these interactables.  
**Speaker/type:** unreachable prompts  
**Current text:**  
> Disable corrupted record  
> Test revealed figure  
> Inspect final archive entry

**Purpose:** Intended to support older final-chamber phases.

**Flags:** These prompts are paired with objectives/messages that may no longer be reachable after the newer boss system.

## 92. Placeholder state with no text

**File:** game.js  
**Line/function/key:** `GAME_STATES.PUZZLE` line 1360; `drawPlaceholderState()` lines 12223-12227  
**Trigger:** If the generic `puzzle` game state is entered.  
**Speaker/type:** unused/placeholder state  
**Current text:**  
> 

**Purpose:** Reserved placeholder; currently renders black with no explanation.

**Flags:** If reached accidentally, the player receives no instruction or recovery text.

## 93. Empty inspect overlay defaults

**File:** game.js  
**Line/function/key:** inspect overlay state initialization around line 3004  
**Trigger:** Default state before any inspect overlay content is assigned.  
**Speaker/type:** empty UI data  
**Current text:**  
> 
> 

**Purpose:** Internal defaults for title/text fields.

**Flags:** Not a problem unless an overlay opens before content is assigned.

## Main clarity problems

- The first corridor code path depends on reading multiple objects in a specific order, but the "missing context" and "four digits I have not earned yet" messages do not identify which clue is still missing.
- The archive ladder requires holding E, while most other interactions use a single E press. The prompt explains this only when the player is already at the ladder.
- The story uses several similar phrases for "records," "archive," "the page," "removed page," "control page," "rings," "symbols," and "machine" before the relationships are firmly established.
- Manuscript symbol naming changes across systems: Stage 2 uses Aster/Drain/Grille/Hollow leaf, while the boss seal objective uses Eye/Spiral/Key/Hand.
- Important puzzle reasoning hints exist in `MANUSCRIPT_SYMBOLS[].hint` but do not appear to be rendered.
- The final third has overlapping language from a legacy Archivist phase and a newer boss-combat phase, which may make the climax feel like two different rule sets.
- Several dynamic notifications are atmospheric but do not always state the exact player action required next.
- Optional lore scenes, especially the classroom and altered journal entries, carry meaning that affects the ending but can be missed.

## Missing explanations

- The game does not clearly tell players that the security memo contains the keypad code clue if they have powered the panel but missed the memo.
- The cabinet puzzle does not fully reconcile "air," "ventilation," "archive," and "records" in one clear switch-order explanation.
- The archive ladder's hold-to-push interaction needs earlier or more persistent explanation.
- The missing-person records wing needs a clearer statement that the player must select the contradictory record detail, not merely read the file.
- The manuscript puzzle needs one consistent explanation of how archive classifications map to symbols.
- The final-page-to-chamber transition needs a clearer explanation of why the page reveals a chamber and what the player should do with it.
- The Archivist's invincibility/seal mechanic needs clearer separation from normal flashlight attacking.
- The escape sequence explains immediate controls, but the consequence of keeping/dropping evidence may need better story framing before the choice.

## Recommended story order

1. Establish the protagonist's job and the anonymous archive lead.
2. Show that the university officially ended its records in 2079.
3. Make the archive door visibly electronic, then reveal that auxiliary power and a four-digit year are needed.
4. Let the security memo plainly connect "last official record year" to the keypad.
5. In the archive, teach that C13 was removed from search but left physical traces.
6. Use shelf records to establish the three archive classifications before the manuscript puzzle asks for them.
7. Reveal that the manuscript is not translated text but an authorization/control interface.
8. After solving it, show the archive rewriting evidence before explaining the missing page.
9. Use the three changed details to teach the distorted corridor's door logic.
10. Let the missing page point directly to the restricted chamber.
11. Introduce the Archivist as the active maintainer of the living record.
12. Teach seal-breaking before allowing damage, then end on the evidence/escape choice and record-continuation consequence.
