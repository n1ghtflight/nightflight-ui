---
name: nightflight-ui
description: The user's personal house design system for every app, tool, website, dashboard, desktop window, internal page, mockup or prototype they build or restyle. It's a calm near-black, light-and-dark, hairline-bordered, single-indigo-accent, keyboard-first style with a command palette, inspired by modern productivity apps. Use it whenever you create, redesign, re-skin, theme or lay out any user interface (HTML/CSS, React, Vue, Svelte, Tailwind, Electron, WebView2/.NET, WPF/WinUI, Claude artifacts, landing pages, admin panels, settings screens, dashboards, CLI/TUI output), even if the user never mentions design, styling or this skill by name. Skip it only when the user explicitly asks for a different look, an existing brand guide, or a third-party design system. It provides drop-in tokens.css, a working app-shell starter, component specs, platform mappings and a visual verification routine.
---

# nightflight-ui

The user's house style for everything they ship. It aims for an app that looks built in 2026: calm, dense but
airy, fast to operate from the keyboard, identical in spirit across web, desktop and tools. The values were
measured from a best-in-class productivity app (see `references/provenance.md`), so start from them; don't
re-invent them.

## Files
- `assets/tokens.css`: **the source of truth.** Copy it into every project and build on its variables.
  It follows the OS light/dark setting by default; `<html data-theme="dark|light">` forces a theme.
- `assets/shell.html`: working starter app: title bar, sidebar, raised work surface with list → detail,
  tiles, callout, segmented control, table, status bar, Ctrl+K command palette, shortcut tooltips, theme
  toggle, narrow-screen layout. Start any app/tool UI by copying it and replacing the sample content.
- `references/components.md`: exact specs and states for each component (read when building components),
  plus **patterns proven in XPerf**: editable property chips with an "All settings" drawer, "dim and swap" re-runs,
  phone tab bar, list → detail, typed commands in the palette, touch details, theme-following charts.
- `references/platforms.md`: React/Tailwind/Electron/WebView2/WPF/terminal mappings and a hex table for
  places that can't use `lch()` (read when the target isn't plain HTML/CSS).
- `references/provenance.md`: where values came from, how to re-measure, IP rules.
- `scripts/verify_ui.mjs`: one-command visual check (both themes, true phone width, overflow, Ctrl+K).

## The five ideas (and why)

1. **Chrome recedes, work comes forward.** The title bar and sidebar sit on the darkest layer (`--bg`/`--chrome`).
   The work area is a *raised* surface (`--panel`) inset by an 8px gutter, with an opaque hairline border and a soft
   shadow. Tiles, fields and hover states step up in small, even lightness increments (`--field` → `--tile` →
   `--tile-hover` → `--active`). Navigation then stays out of the way without needing borders between
   regions. In light theme the same order holds: grey chrome, near-white panel, white tiles.
2. **One accent, used for meaning.** Indigo `--accent` marks the primary action, focus, selection, and the one
   value that matters in a chart. Everything else is neutral. The current nav item is `--active` grey, not indigo.
   Status colours (`--good/--warn/--bad/--info`) only signal state. When everything is colourful, nothing stands out.
3. **Hairlines, not boxes.** Borders are opaque and one device pixel (`var(--hairline) solid var(--line)`;
   `.5px` rounds up to exactly 1 device px on every display). In dark theme, depth comes from lightness steps, not
   heavy shadows or gradients. Thick borders and glows make dense UIs look busy.
4. **Dense but legible type.** Inter, weight **450** for body, 500 for labels/buttons, 600 for titles and big numbers
   (avoid 700). UI chrome (nav, buttons, labels, tables) at **13px**, content at **15px**, meta at 12/11px. Figures
   use `.num` (tabular numerals), so columns and live values don't jitter. Letter-spacing -0.1px.
5. **Keyboard-first.** Ctrl/Cmd+K opens a command palette that lists **actions on the current thing first**, then
   navigation, then app commands, each with its shortcut shown as keycaps. Single-key actions on the selection,
   `G` then a letter to jump between views, and tooltips that teach the shortcut. Power users never need the mouse,
   and new users discover shortcuts from the palette and tooltips.

## Workflow

1. **Tokens first.** Copy `assets/tokens.css` into the project. If the project already has tokens, map its
   names onto these values instead of adding a second system. Keep **domain colours** (e.g. aviation flight
   categories, terrain, map water) as extra semantic tokens defined in both themes. That's how the first adopter
   (XPerf) did it.
2. **Pick the layout** (details below): app shell, single-surface tool, or site. For an app or tool, copy
   `assets/shell.html` and adapt it rather than writing the shell from scratch.
3. **Build components** from `references/components.md`. Every colour, size, radius and duration comes from a
   token. A literal hex or px in component CSS is a smell: either a token is missing (add it to the
   token file in both themes) or the component is drifting.
4. **Wire the keyboard:** palette commands for every primary action, shortcuts on frequent ones, `data-tip` +
   `data-kbd` on icon buttons, Esc closes overlays, visible `:focus-visible` ring (from tokens).
5. **Verify visually** (below) in both themes before calling it done.

When **restyling an existing app**, change presentation, not behaviour: same data, same calculations, same
routes. Re-skin by changing emitted classes/wrappers and swapping hard-coded colours (including those inside
JS-generated SVG/charts) for tokens. Compare key outputs before and after.

## Layouts

**App shell** (multi-view apps, desktop windows):
```
┌ title bar 42px: [sidebar toggle] [‹ ›] [tab / breadcrumb]      [status chips] [theme] ┐  ← chrome
├ sidebar 244px ──┬───────────────────────────────────────────────────────────────────┤
│ workspace ▾ 🔍 + │ ┌ raised surface (panel, hairline, r 8, shadow) ───────────────┐ │
│ ▣ Current (pill) │ │ View title ···                         [filters] [Primary] │ │  ← header 43px
│   Item           │ │ ┌ list ~390px ──────┐ ┌ detail ─────────────────────────┐ │ │
│ Group ▾          │ │ │ card rows         │ │ title · meta chips · callout     │ │ │
│   Item           │ │ │                   │ │ tiles / chart / table             │ │ │
│ ? ⚙              │ │ └───────────────────┘ └──────────────────────────────────┘ │ │
└──────────────────┴─┴────────────────────────────────────────────────────────────┴─┘
  status bar 32px: ● state · info                                  Ctrl K Command palette
```
- Sidebar groups are collapsible and remember their state. The sidebar itself collapses (`[`) and drops away
  below ~760px.
- **List → detail** is the default for anything with several records (airports, legs, items, notifications),
  instead of one long scrolling page.
- **Overview = bento of tiles**: a 12-column grid with a hero tile and stat tiles; each tile opens its detail view.
- Warnings are one compact callout at the top (title + one line + action link), never a wall of text.
- Long-lived status (connection, data version, last sync) goes in the status bar, not in the content.

**Single-surface tool** (calculator, converter, small utility): no sidebar. Title bar + one raised surface,
with the form on the left (~360–400px) and results on the right, stacking on narrow screens. Still has Ctrl+K if it
has more than a handful of actions.

**Website / landing page:** same tokens and type, content width 720–1080px, larger display sizes allowed
for heroes (40–64px, weight 600, tracking -0.02em). Still one accent, hairline section dividers, no stock
gradients. Follows system theme with a toggle.

## Motion
Durations: `--dur-quick` 100ms (presses), `--dur` 150ms (hover/colour), `--dur-regular` 250ms (layout,
sidebar), `--dur-slow` 350ms (entrances). Easing `--ease` (ease-out-quint). Tiles fade and rise 6px with a 40ms stagger on
view change; overlays use a short scale-from-.98 pop. Animate opacity and transform, not layout, except the sidebar
column. `tokens.css` already honours `prefers-reduced-motion`.

## Don'ts
- No gradients, glassmorphism, glows, neon, or drop shadows heavier than `--shadow`/`--shadow-pop`.
- No second accent colour; no coloured nav pills; no accent-coloured body text except links.
- No pure `#000` backgrounds or pure `#fff` panels in dark theme. Use the tokens (they're tuned to sit together).
- No 700-weight body text, no ALL-CAPS paragraphs (small uppercase section labels with letter-spacing are fine).
- No 1px CSS borders where a hairline is meant; no zebra-striped tables; no vertical table rules.
- Don't put the reference app's name, logo, icons, illustrations, copy or other assets in any product. This is an
  inspired-by style (see provenance).
- Don't load fonts or scripts from CDNs in desktop/offline apps. Bundle Inter locally.

## Verify before done
Render the UI and look at it. Don't trust the CSS alone. For anything HTML-based run:
```
node <skill-dir>/scripts/verify_ui.mjs <file-or-url> <out-dir>
```
It renders dark + light at 1440×900 and dark at a true 390×844 phone width, lists elements that overflow
horizontally, and checks that Ctrl/Cmd+K opens a palette with the input focused. Then open the PNGs and look.
Two traps it already avoids, which matter if you capture by hand:
- **Entrance animations** get captured at `opacity: 0`, so content looks missing. Force `prefers-reduced-motion`.
  If something still looks missing, render the unmodified original the same way as a baseline before
  assuming your change broke it.
- **Headless `--window-size` can't go below ~500px.** A "390px" screenshot is really a 504px layout cropped,
  which looks like overflow. Use CDP device emulation (the script does) for phone widths.

Then check by eye: chrome darker than the work surface; exactly one accent per view; hairlines crisp; numbers
aligned; `--text-3` still readable on `--tile`; focus ring visible when tabbing; palette filters, runs, Esc closes.
