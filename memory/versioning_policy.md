---
name: versioning-policy
description: Version tracking and changelog for RemindMe extension
metadata:
  type: project
---

# RemindMe Versioning & Changelog

## Current Version
**v01.27** — Formatting Fixes (Layout & Color)

## Version History

### v01.27 — Formatting Fixes (Layout & Color)
- **Fix #1:** Color picker default changed from black to light green (#90EE90)
- **Fix #2:** Font size formatting (enlarge/reduce) no longer causes text line breaks
  - Added `display: inline; line-height: inherit;` to all span styles
  - Prevents text reflow and alignment issues
  - Links, numbers, and text stay on same line
- **Result:** All formatting options (bold, link, enlarge, reduce, color) preserve layout
- **Files Modified:** content-script.js

### v01.26 — Text Formatting Toolbar (Font Size + Color)
- **Feature:** Added three new formatting options to Edit Reminder dialog
  - Enlarge Font (A↑): Wraps selected text with 1.2em font size
  - Reduce Font (A↓): Wraps selected text with 0.8em font size
  - Color Picker: HTML color input to change selected text color
- **Implementation:** Added buttons and color picker to toolbar, created helper functions
- **Result:** Users can format text with size and color adjustments
- **Files Modified:** content-script.js

### v01.17 — Fixed Top Position (Static Offset)
- **Fixed Modal Top Position:**
  - Changed from `top: 50%` (percentage, changes with viewport)
  - To: `top: 60px` (fixed pixel offset from top)
  - Modal now stays 60px from top of viewport always
  - Only horizontal centering: `transform: translateX(-50%)`
  - No more vertical movement
- **Result:**
  - Modal top position ALWAYS 60px from top ✅
  - Doesn't change when scrolling ✅
  - Doesn't change when modal size changes ✅
  - Consistent fixed position ✅
- **Files Modified:** content-script.js
- **Impact:** Modal positioning now truly fixed

### v01.16 — Fixed Position & Dark Theme (Proper Implementation)
- **Fixed Modal Position (Properly):**
  - Added `width: 100% !important` and `height: 100%` to overlay
  - Ensures overlay covers entire viewport in fixed position
  - Modal now truly stays in center of viewport
- **Fixed Search Input Dark Theme:**
  - Added `!important` flags to ALL inline styles
  - Now resists CSS revert and overrides
  - Background: `rgba(0,0,0,0.3)` (dark)
  - Focus: `rgba(0,0,0,0.5)` (darker)
  - Text: white on dark background
  - All properties forced with !important
- **Result:**
  - Modal fixed in center of viewport ✅
  - Stays centered when scrolling ✅
  - Search input dark theme applied ✅
  - No CSS overrides ✅
- **Files Modified:** content-script.js
- **Impact:** UI/UX fixed properly

### v01.15 — Fixed Modal Position & Dark Theme Search
- **Fixed Modal Positioning:**
  - Changed from `position: relative` to `position: fixed`
  - Centered with `top: 50%, left: 50%, transform: translate(-50%, -50%)`
  - Modal stays in viewport, doesn't move when page scrolls
  - Consistent position regardless of page size/layout
- **Updated Search Input Styling:**
  - Background: `rgba(0,0,0,0.3)` (dark, matches header)
  - Changed from light `rgba(255,255,255,0.1)` to dark theme
  - Focus state: darker `rgba(0,0,0,0.5)` for visual feedback
  - Color: white text on dark background
  - Matches overall dark theme aesthetic
- **Result:**
  - Modal position is fixed and centered ✅
  - Search input matches dark theme ✅
  - Better visual consistency ✅
- **Files Modified:** content-script.js
- **Impact:** UI/UX improvements

### v01.14 — Search FIXED - CSS Class Method
- **Bug Found:** `* { all: revert !important; }` CSS was reverting inline styles
- **Root Cause:** Global CSS reset was overriding `row.style.display = 'none'` 
- **Solution:**
  - Added CSS rule: `.settings-table tbody tr.hidden { display: none !important; }`
  - Changed from inline style to CSS class method
  - Use `row.classList.add('hidden')` instead of `row.style.display = 'none'`
  - CSS class has !important so global revert can't override it
- **Result:**
  - Search filtering now WORKS correctly ✅
  - Hidden rows actually disappear ✅
  - Real-time filtering instant and reliable ✅
- **Files Modified:** content-script.js
- **Impact:** Critical - search feature FINALLY WORKING

### v01.13 — Enhanced Search Debugging
- **Added Detailed Console Logging:**
  - Log raw input value and trimmed search term
  - Log each row's text content and match result
  - Log computed CSS display property for each row
  - Show which rows match, which rows are hidden
  - Display visible/hidden count summary
- **Purpose:**
  - Debug visual display issues
  - Verify CSS is being applied correctly
  - Identify if rows are hidden but still visible
  - Trace filtering logic step-by-step
- **Console Output:**
  - Formatted logs with [SEARCH] prefix
  - Clear start/end markers for each search
  - Row-by-row filtering details
  - Computed style verification
- **Files Modified:** content-script.js
- **Impact:** Debugging aid - diagnoses search display issues

### v01.12 — Search Fixed for RTL/LTR Modes
- **Bug Found:** Search was only reading first 2 cells
  - In RTL: cells 0-1 are Actions & Active (no text!)
  - Missing: Domain & Reminder columns
- **Root Cause:** Hard-coded `Math.min(2, cells.length)` didn't account for column reordering
- **Solution:** Search ALL cells in the row (works in both RTL and LTR)
- **Result:**
  - Search now filters correctly in RTL mode ✅
  - Search works in LTR mode ✅
  - Real-time matching on each keystroke ✅
  - Finds matches in Reminder and Domain columns ✅
- **Files Modified:** content-script.js
- **Impact:** Critical - search feature NOW WORKING

### v01.11 — Search Debugging & Console Logging
- **Added Console Logging:**
  - Logs when search input is found/not found
  - Logs each keystroke and search term
  - Logs tbody query results
  - Logs total rows and visible count after filtering
- **Purpose:**
  - Debug why search might not be working
  - Verify event listener is firing
  - Confirm DOM elements are being found
- **How to Use:**
  - Open DevTools (F12)
  - Go to Console tab
  - Look for "🔍" logs when using search
  - Reports will show what's happening
- **Files Modified:** content-script.js
- **Impact:** Debugging aid - helps identify search issues

### v01.10 — Search Filtering Improvements
- **Feature:** Enhanced search functionality with better event handling
- **Changes:**
  - Improved search input event listener attachment
  - Better handling of row visibility toggling
  - Simplified display:none logic for reliable filtering
  - Added defensive error handling
- **Result:**
  - Search filters on each keystroke ✅
  - Real-time matching of Reminder and Domain columns ✅
  - Proper row hiding/showing in shadow DOM ✅
- **Files Modified:** content-script.js
- **Impact:** Minor - search robustness improvements

### v01.09 — RTL/LTR Localization for Column Headers
- **Feature:** Column headers now display in correct language based on page direction
  - RTL pages (Hebrew): "תזכורת" (reminder), "דומיין/URL", "פעיל" (active), "פעולות" (actions)
  - LTR pages (English): "Reminder", "Domain/URL", "Active", "Actions"
- **Implementation:**
  - Added "active" label to both English and Hebrew dictionaries
  - Updated header cells to use `getLabel('active')` instead of hardcoded "Active"
  - `getLabel()` function automatically detects RTL/LTR and returns appropriate text
- **Result:**
  - Settings modal headers fully localized ✅
  - Works with RTL (Hebrew) and LTR (English) sites ✅
- **Files Modified:** content-script.js
- **Impact:** Minor - localization/internationalization

### v01.08 — Scrollbar in Content Area Only
- **Bug Fixed:** Scrollbar appeared on entire modal (header + content) instead of just content
- **Root Cause:** Modal inline style had `overflow: auto` instead of `overflow: hidden`
- **Solution:** 
  - Changed modal overflow from `auto` to `hidden`
  - Added `display: flex; flex-direction: column;` to modal inline style
  - Content area `.settings-content` has `overflow-y: auto` for scrolling
- **Result:**
  - Scrollbar now appears ONLY in table/content area ✅
  - Header stays fixed at top (no scrolling) ✅
  - Clean, professional layout ✅
- **Files Modified:** content-script.js
- **Impact:** Minor - scrollbar positioning/UX improvement

### v01.07 — Search Input Width Fix
- **Bug Fixed:** Search input width was 100% instead of 180px due to CSS class override
- **Root Cause:** `.search-input` CSS class had `width: 100% !important` overriding inline `width: 180px`
- **Solution:** Removed conflicting `.search-container` and `.search-input` CSS classes
- **Result:** 
  - Search input now displays at correct width (180px) ✅
  - Aligned properly with "Add Reminder" button on same row ✅
  - Header layout remains sticky and responsive ✅
- **Files Modified:** content-script.js
- **Impact:** Minor - visual alignment of search input

### v01.06 — Fixed Header + Search Feature
- **Feature 1: Fixed Header**
  - Settings header stays at top while table scrolls
  - No flicker, smooth experience
  - Scrollbar only on table content area
- **Feature 2: Real-time Search**
  - Search input above table with 🔍 icon
  - Filters Reminder column (1st) + Domain column (2nd)
  - Results update instantly as user types
  - Clear search to show all reminders
  - Works while sorting and with active filters
- **Implementation:**
  - Modal: flex column layout with fixed header
  - Search: event delegation on input with case-insensitive matching
  - UX: smooth, non-blocking, responsive
- **Files Modified:** content-script.js

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
