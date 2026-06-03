# RemindMe Extension - Claude Code Rules

## CRITICAL RULES

### 1. No Unauthorized Changes
- ❌ NO code edits without explicit user permission
- ❌ NO git commits without explicit user permission
- ✅ Write findings to memory/MD files instead
- ✅ Ask user, get approval, then execute

### 2. Version Increment - EVERY Change
- **MUST increment VERSION with EVERY code change**
- Location: `content-script.js` line 1: `const VERSION = "01.XX"`
- Format: `vXX.XX` (e.g., v01.00, v01.01, v01.02)
- Update change log: `memory/versioning_policy.md`

### 3. Workflow
1. Identify needed change
2. Write analysis to memory file
3. Ask user for approval
4. **Only after approval:**
   - Make code change
   - Increment VERSION
   - Update change log
   - Update MEMORY.md if major

### 4. No Git Commits
- Commits only with explicit permission
- Never auto-commit after changes

## Memory Files
- `memory/feedback_workflow.md` - Rules and workflow
- `memory/versioning_policy.md` - Version tracking and change log
- `memory/css_isolation_analysis.md` - CSS isolation findings
- `memory/project_css_isolation_issue.md` - Current issues

## Current Version
**v01.01** - Fixed version display positioning for RTL/LTR
