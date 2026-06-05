---
name: versioning-policy
description: Version tracking and changelog for RemindMe extension
metadata:
  type: project
---

# RemindMe Versioning & Changelog

## Current Version
**v01.05** — Smooth Sorting UX

## Version History

### v01.05 — Smooth Sorting UX (No Modal Flicker)
- **Improvement:** Sorting now updates table in-place without modal close/reopen
- **Result:** 
  - No flicker or disappear-reappear effect ✅
  - Smooth, fluent sorting experience ✅
  - Modal stays stable while table re-renders
  - Sort direction indicators (▲/▼) update smoothly
- **How it works:**
  - Sorts data in memory
  - Re-renders only tbody element
  - Re-attaches event listeners to new rows
  - No modal destruction/recreation
- **Files Modified:** content-script.js

### v01.04 — Active Column Bug Fix (Event Delegation)
- **Bug Fixed:** Active checkbox event listeners not firing in shadow DOM
- **Root Cause:** Direct event listener attachment doesn't work in shadow DOM context
- **Solution:** Implemented event delegation on tbody element
- **Result:** 
  - Disabling reminder via checkbox now saves immediately ✅
  - Popup updates correctly when reminder disabled ✅
  - No need for manual save button
- **Files Modified:** content-script.js
- **Impact:** Minor - only affects active column functionality

### v01.03 — Sorting & Active Column in Settings
- **Feature**: Sortable columns for Reminder and Domain
  - Click column header to sort A→Z or Z→A
  - Toggles between ascending and descending
- **Feature**: Active column with checkboxes
  - ✅ Checked = reminder is active (shows in popup)
  - ☐ Unchecked = reminder is inactive (hidden from popup)
  - No need to delete reminders, just disable them
- **Storage Update**: Reminders now include `active: true/false` field
- **Files Modified**: content-script.js
- **Key Changes**:
  - `getSettingsHTML()` - Added sorting logic and Active column
  - `setupSettingsModal()` - Added click handlers for sort and active toggle
  - `showSettingsModalWithSort()` - New function for sorted view
  - `getMatchingReminders()` - Filters to show only active reminders

### v01.02 — Per-URL Dialog Position Persistence
- **Feature**: Dialog position now saved per-domain in localStorage
- **Behavior**: 
  - When user drags reminder dialog to new position, it's saved for that domain
  - Next time visiting same domain, dialog opens at last saved position
  - Default position (top-right) used if no saved position exists
- **Files Modified**: content-script.js
- **Key Functions**: 
  - `getDomainKey()` — Generate localStorage key from domain
  - `getSavedPosition()` — Load saved position
  - `savePosition(x, y)` — Save position on drag end
- **Storage**: localStorage keyed by `reminder-pos-{hostname}`

### v01.01 (Previous)
- Fixed version display positioning for RTL/LTR
