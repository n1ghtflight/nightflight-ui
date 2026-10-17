# Component specs

Every component is built only from tokens in `assets/tokens.css`. `assets/shell.html` has working
versions of most of these. Copy from there rather than re-deriving.

## Contents
- Buttons · Inputs · Segmented control · Toggle · Chips/badges
- Navigation (sidebar items, group headers, tabs)
- Lists & rows · Tables
- Tiles (stat, chart, map) · Callouts · Empty states
- Overlays: command palette, menus/popovers, tooltips, dialogs
- Charts & maps
- Patterns proven in XPerf (2026-10): editable property chips · re-plan "dim and swap" ·
  phone tab bar + More sheet · list → detail on phones · typed commands in the palette · touch details

---

## Buttons
| Variant | Rest | Hover | Notes |
|---|---|---|---|
| Primary | `--accent` bg, `--accent-ink` text, no border | `--accent-hover` | One per view. The single most important action. |
| Secondary | `--tile` bg, hairline `--line` | `--tile-hover` | Default button. |
| Ghost | transparent | `--tile-hover` bg, `--text` | Toolbars, inline actions. |
| Icon | 28×28, `--r-sm`, `--text-3` icon | `--tile-hover`, `--text` | Always has `aria-label` + `data-tip` (+ `data-kbd` if it has a shortcut). |
| Danger | ghost style with `--bad` text | `--bad-soft` bg | Never a red-filled button by default; confirm destructive actions. |

Height `--h-control` (28px), `--h-control-lg` (32px) for primary form actions. Padding 0 12px, radius `--r`,
`--fs-small`, `--w-medium`, 6px gap to a 16px icon. Disabled: `--text-4`, no hover, `cursor:not-allowed`.

## Inputs
- Text field: height 32px, `--field` bg, hairline `--line`, radius `--r`, padding 0 10px, `--fs-small`.
  Placeholder `--text-3`. Focus: border `--accent` (no glow, no thick ring). Error: border `--bad`, message below in
  `--fs-mini` `--bad`.
- Label above the field: `--fs-small` `--text-2` `--w-medium`, 6px gap. Hints: `--fs-mini` `--text-3`.
- Large identifier fields (e.g. codes, IDs the user types often): may use `--fs-large` `--w-semibold` with the
  resolved name beneath in `--fs-mini` `--text-3`.
- Select/combobox: same box as a text field plus a 12px chevron in `--text-3`. Prefer a searchable combobox for
  lists longer than ~12 options.

## Segmented control
Use instead of a `<select>` for 2–4 mutually exclusive options that the user switches often.
Track: `--field`, hairline `--line`, radius `--r`, 2px padding. Segment: height 24px, `--fs-small` `--w-medium`
`--text-2`. Selected: `--tile` bg, `--text`, `--shadow`. Use `aria-pressed`.

## Toggle switch
Track 28×16, radius full. Off: `--active` track, knob `--text-3`. On: `--accent` track, knob `#fff`.
Knob moves with `--dur` `--ease`. For on/off settings only. Use a checkbox when it's part of a form that gets submitted.

## Chips / badges
Height 20px, padding 0 6px, radius `--r-xs`, `--fs-mini` `--w-medium`.
Neutral: `--field` + hairline `--line` + `--text-2`. Status: `--{good|warn|bad|info}-soft` bg, matching text,
no border. A leading 6px dot is optional. Keep chip text to 1–2 words.

## Navigation
- **Sidebar item:** height 28, padding 0 8, radius `--r-sm`, 8px gap, 16px icon `--text-3`, label `--fs-small`
  `--w-medium` `--text-2`. Hover `--tile-hover`. Current page: `--active` bg + `--text` (neutral, *not* accent).
  Optional count right-aligned `--fs-mini` `--text-3`.
- **Group header:** collapsible button (`aria-expanded`), `--fs-small` `--w-medium` `--text-3`, 12px chevron
  rotating -90° when collapsed, 14px top margin. Remember the collapsed state per group.
- **Title-bar tabs:** height 30, radius `--r-sm`, `--tile` bg for the active tab, `--fs-small` `--w-medium`, icon +
  title, max-width 240 with ellipsis. Back/forward + history live left of the tabs.
- **View header (inside the surface):** height `--h-header` (43px), hairline bottom border `--line-soft`, title
  `--fs-regular` `--w-medium`, a `···` actions button next to it, right-aligned icon buttons + one primary button.

## Lists & rows
- **Card row** (inboxes, record lists): grid `avatar | title+subtitle | meta`, padding 8px 12px, radius `--r`,
  no border. Title `--fs-regular` `--w-medium`, subtitle `--fs-small` `--text-3` one line with ellipsis, meta
  (time, count) `--fs-mini` `--text-3` top-aligned. Hover `--tile-hover`; selected `--active`. Hover-reveal
  secondary actions (icon buttons) on the right instead of permanent clutter.
- **Compact row** (dense lists, 100+ items): height 32–36, hairline `--line-soft` separators, no card background.
- Keyboard: ↑/↓ move selection, Enter opens, single-letter actions act on the selected row (shown in the palette).

## Tables
Header row 32px: `--fs-mini` `--w-medium` `--text-3`, hairline `--line` underneath. Body rows 36px,
hairline `--line-soft` separators, `--fs-small`. Numbers right-aligned with `.num` (tabular). No zebra striping,
no vertical rules. Sticky header when the table scrolls. Hover row `--tile-hover`.

## Tiles
The building block for overviews/dashboards ("bento"): `--tile` bg, hairline `--line`, radius `--r-lg`,
`--shadow`, padding 14–16px. Hover: border `--line-strong` (+ `translateY(-2px)` only if the tile is clickable).
- **Stat tile:** label row (16px icon `--text-3` + `--fs-small` `--w-medium` `--text-2`) → value
  `--fs-title1` `--w-semibold` letter-spacing -.02em, unit in `--fs-small` `--text-3` → one sub-line
  `--fs-small` `--text-3`. One number per tile. Never two big numbers fighting.
- **Comparison bars / meters:** 6px track `--field`, fill `--accent` for the chosen/current value, `--text-4`
  for alternatives.
- **Chart tile / map tile:** chart fills the tile, title row on top, legend as small chips. Clicking a tile opens
  its detail view.
- Overview layout: 12-column grid, 12–14px gaps, a hero tile (map/primary chart) spanning 7–8 columns, stat
  tiles 3–5 columns. Entrance: `rise` 6px fade with 40ms stagger, `--dur-slow`.

## Callouts (warnings, notices)
One compact block, not a paragraph wall: icon + **title** (`--fs-small` `--w-semibold`) + one line `--text-2`
+ a right-aligned action link ("Show on profile →"). Background `--{warn|bad|info}-soft`, hairline border at
35% of the status colour, radius `--r`. If there are several, show the most severe and "+2 more".

## Empty states
Centered in the surface: 20px icon `--text-4`, one sentence `--fs-regular` `--text-2`, one action (secondary
button, with its shortcut). No illustrations.

## Command palette
Open with Ctrl/Cmd+K from anywhere; it's the fastest path to every action.
- Position: fixed, 96px from top, centered, width `min(720px, 100vw - 32px)`. Background `--tile`,
  radius `--r-lg`, `--shadow-pop`. No dimmed backdrop (an invisible click-catcher closes it). `pop` entrance
  (opacity + scale .98, `--dur`).
- Input: 52px tall, `--fs-regular`, placeholder "Type a command or search…", hairline `--line-soft` under it.
- Results: **context group first** (actions on the current selection, labelled "Thing · Name"), then Navigate,
  Create, App/Settings. Group label `--fs-small` `--text-3`. Item 40px, 16px icon `--text-3`, label
  `--fs-regular` `--w-medium`, shortcut keycaps right-aligned. Selected item `--active`.
- Keys: ↑/↓, Enter runs, Esc closes, mouse hover moves selection. Fuzzy/substring filter; hide empty groups;
  "No matching commands" in `--text-3`.
- Every command that has a direct shortcut shows it, which is how users learn the shortcuts.

## Menus & popovers
`--tile` bg, radius `--r`, `--shadow-pop`, 4px padding. Items 28–32px, radius `--r-sm`, hover/selected
`--active`, shortcut keycaps right-aligned, hairline `--line-soft` separators between groups.

## Tooltips
Delay ~450ms, `--tile` bg, `--shadow-pop`, radius `--r-sm`, `--fs-mini` `--text-2`, label + keycaps
(`data-tip`, `data-kbd`). Below the element, clamped to the viewport. Hide on pointerdown.

## Dialogs
Only for decisions that block (confirm destructive, unsaved changes). `--panel` bg, radius `--r-lg`,
`--shadow-pop`, `--overlay` backdrop, max-width 440px, title `--fs-large` `--w-semibold`, buttons right-aligned
(secondary then primary/danger). Esc cancels, Enter confirms the default.

## Charts & maps
- Use the `dataviz` skill for chart construction if available, but feed it these tokens: axes and tick labels
  `--text-3` `--fs-micro`, gridlines `--line-soft`, no chart borders/backgrounds (the tile is the frame).
- Series order: `--accent`, `--violet`, `--info`, `--good`, `--warn`. Highlight the one that matters in
  `--accent` and render the rest in `--text-4`/`--line-strong` when comparing.
- Status colours mean status (good/warn/bad), never "series 4".
- Never hard-code chart colours in JS/SVG: read them with `getComputedStyle` or use `currentColor` /
  `var(--…)` in SVG so charts follow the theme.
- Maps (Leaflet etc.): in dark theme apply a desaturating/inverting CSS filter to raster tiles; drop it in light.
  Route/overlay lines in `--accent`, markers with a 1.5px `--panel` outline so they read on any tile.

---

## Patterns proven in XPerf (first app built on this skill, 2026-10)

**Editable property chips (setup that folds away).** Before the first result, show the full form in the work
surface. After it, collapse the form into one line of chips (`[C172] [KPAO → KTRK] [Direct] [VFR] … [All settings]`)
above the results, and move the *same form DOM* into an "All settings" side drawer (ids unchanged, so existing code
keeps working). Each chip is a control: option chips open a small menu with single-letter keys (`I` `V` `A`); entity
chips (airport, aircraft) open a type-to-search box (reuse the app's existing search component by moving its node into
the popover). Picking a value writes the underlying form field and re-runs the computation immediately. Chips:
`--field` bg, hairline `--line`, height 28, caret icon `--text-3`; the "All settings" chip is ghost style.

**Re-run state: "dim and swap".** While a recompute runs, keep the previous results on screen at ~45% opacity with
`aria-busy` and `pointer-events:none`, then swap everything in at once. Never blank the page and never show partial
figures. Serialise runs: if another edit arrives mid-run, queue exactly one more run that reads the latest values
("latest choice wins"). Errors appear in a callout above the results; the previous results stay.

**Phone navigation.** Below 768px: no sidebar; a bottom tab bar with the 4 most-used views + "More" (a sheet listing
the rest), `env(safe-area-inset-bottom)` padding. 768–1023px: icon-only sidebar that expands on demand.

**List → detail on phones.** Lists that open a detail pane show the list first on phones; tapping a row opens the
detail with a "‹ Back" button. Keep every detail rendered (hidden) so its controls keep their hooks.

**Typed commands in the palette.** Beyond fixed actions, parse domain shorthand ("KPAO KTRK C172") with a pure,
unit-tested function returning `plan | ambiguous | unknown | none`. Only treat input as a typed command when its first
token resolves (so ordinary command text never shows "not found" rows). Ambiguous → one row per candidate that
rewrites the query; unknown → a disabled explanatory row. Typed rows come first, then contextual actions, navigation,
app commands. Handle Ctrl/Cmd+K in the capture phase so it works from inside inputs.

**Touch details.** Chart details in SVG `<title>` elements never show on touch. One generic handler: on a non-mouse
tap, find the nearest ancestor with a `<title>` child and show its text in a sticky tooltip; tapping elsewhere
closes it. On coarse pointers, rewrite "hover" to "tap" in hint copy.

**Charts follow the theme live.** SVG presentation attributes accept `var(--token)` and `color-mix()` in Chromium,
so chart code can emit `fill="var(--accent)"` and needs no re-render on theme change. Leaflet's SVG renderer passes
colours through to attributes, so `color:"var(--accent)"` works for polylines and markers too (not with
`preferCanvas`). Remember the accent is identical in both themes: test theme-following on a theme-dependent token.

**Verification lessons.** Freeze live data (record/replay network responses with CDP `Fetch`) before restyling an app
whose output depends on live feeds; compare outputs, treat unrecorded requests as warnings unless the output changes.
Launch test browsers with `--disable-extensions` (policy-installed extensions can still inject requests).
