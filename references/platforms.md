# Applying nightflight-ui per platform

The source of truth is `assets/tokens.css`. Everything below translates it. Don't fork values. If a platform
can't express something (e.g. `lch()`), use the hex table at the bottom, which was converted from the exact tokens.

## Web: plain HTML/CSS, vanilla JS
Copy `assets/tokens.css` into the project (e.g. `styles/tokens.css`) and link it first; build components on the
variables. For a single-file page or prototype, inline it in a `<style>` block. Start apps from `assets/shell.html`.

**Font:** Inter (OFL). Sites can load it from Google Fonts (`family=Inter:wght@400..700`) or rsms.me/inter.
Desktop apps and anything that must work offline bundle `InterVariable.woff2` locally and declare
`@font-face{font-family:"Inter Var";src:url(…/InterVariable.woff2) format("woff2");font-weight:100 900;font-display:swap}`.
The stack falls back to system-ui / Segoe UI, so nothing breaks if the font is missing.

## Claude artifacts (published pages)
The artifact-design contract asks for tokens on `:root`, dark-mode overrides, and an explicit body background.
`tokens.css` already satisfies that through `color-scheme: light dark` + `light-dark()` + `data-theme`
overrides, so inline it as-is. Use only allowed CDNs for scripts. Inter from Google Fonts is allowed.

## React / Vue / Svelte / Solid
Import `tokens.css` once globally (entry file). Components use `var(--…)` in CSS modules, scoped styles, or
inline styles. Don't copy values into JS objects. If JS needs a value (charts, canvas), read it at runtime with
`getComputedStyle(document.documentElement).getPropertyValue('--accent')` and re-read on theme change.

## Tailwind CSS v4
Keep `tokens.css` as the source and map it in the theme so utilities follow the tokens:
```css
@import "tailwindcss";
@import "./tokens.css";
@theme inline {
  --color-bg: var(--bg); --color-panel: var(--panel); --color-tile: var(--tile); --color-field: var(--field);
  --color-active: var(--active); --color-line: var(--line); --color-line-soft: var(--line-soft);
  --color-fg: var(--text); --color-fg-2: var(--text-2); --color-fg-3: var(--text-3); --color-fg-4: var(--text-4);
  --color-accent: var(--accent); --color-good: var(--good); --color-warn: var(--warn); --color-bad: var(--bad);
  --font-sans: var(--font); --font-mono: var(--mono);
  --radius-sm: var(--r-sm); --radius-md: var(--r); --radius-lg: var(--r-lg);
}
```
Hairlines: use `border-[length:var(--hairline)]` (or a small `.hairline` utility), not `border` (= 1px).
For Tailwind v3, put the same mapping in `tailwind.config` `theme.extend.colors` as `'var(--…)'` strings.

## Desktop shells: WebView2 (.NET host), Electron, Tauri
- Frameless window with the **title bar drawn by the page** (`.titlebar` in the shell): mark it
  `app-region: drag` (`-webkit-app-region` for Electron); buttons inside get `no-drag`. Draw window controls
  (–, □, ×) as icon buttons on the right, or keep the native caption buttons via
  `titleBarOverlay` (Electron) / WebView2 non-client regions.
- If the native frame is kept on Windows 11, set `DWMWA_USE_IMMERSIVE_DARK_MODE` to follow the theme so the
  frame doesn't flash white. Mica/acrylic backdrops fight the "darkest chrome" model. Prefer a solid `--bg`.
- Bundle Inter and any icon/map libraries locally; don't depend on CDNs.
- Follow the OS theme by default (the tokens do this). Persist an explicit user choice.

## Native Windows: WPF, WinUI 3, WinForms
Put these in a ResourceDictionary / theme class (`Dark` and `Light` dictionaries swapped at runtime).
Font: Inter Variable if bundled, else Segoe UI Variable. Sizes in DIPs = the px values. Corner radii 6/8/12.
Hairline: 1 physical px (`1 / dpiScale` DIP in WPF, or `UseLayoutRounding` + 0.5–1 thickness).

## Terminal / CLI tools
No backgrounds (respect the terminal's). Text levels via truecolor: primary default fg, secondary `#e3e4e6`,
tertiary/dim `#959597`, accent `#5e69d1` (or `#adbbff` for readability on dark), status good `#40c786`,
warn `#f2af48`, bad `#f75d59`. Box-drawing with thin lines (`─│┌┐`) in tertiary colour. Show shortcuts as
`[k]` or reverse-video keycaps. Keep one accent per screen.

## Hex reference (converted from tokens.css; sRGB)
| Token | Dark | Light |
|---|---|---|
| bg / chrome | `#09090a` | `#efeff0` |
| panel | `#121213` | `#f9f9fa` |
| field | `#161617` | `#f4f4f5` |
| tile | `#17181a` | `#ffffff` |
| tile-hover | `#1a1a1b` | `#f6f6f7` |
| active | `#232325` | `#e4e4e6` |
| line-soft | `#1a1b1d` | `#ebebec` |
| line | `#232426` | `#e2e2e2` |
| line-strong | `#28282b` | `#d4d4d6` |
| text | `#ffffff` | `#23252a` |
| text-2 | `#e3e4e6` | `#3c3f46` |
| text-3 | `#959597` | `#6b6f76` |
| text-4 | `#565759` | `#a0a4ab` |
| accent | `#5e69d1` | `#5e69d1` |
| accent-hover | `#6c77e0` | `#5059c4` |
| link | `#adbbff` | `#5e69d1` |
| good | `#40c786` | `#008951` |
| warn | `#f2af48` | `#c26f00` |
| bad | `#f75d59` | `#d02b31` |
| info | `#539af2` | `#0267c7` |
| violet | `#b28fef` | `#8451c9` |
