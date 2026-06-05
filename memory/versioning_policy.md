---
name: versioning-policy
description: Version tracking and changelog for RemindMe extension
metadata:
  type: project
---

# RemindMe Versioning & Changelog

## Current Version
**v01.02** — Per-URL Dialog Position Persistence

## Version History

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
