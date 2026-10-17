# nightflight-ui

A personal house design system, packaged as a [Claude](https://claude.com/claude-code) skill.

It's a calm, near-black, light-and-dark interface style: hairline borders, a single indigo accent,
a keyboard-first feel with a Ctrl+K command palette, and dense-but-airy spacing. The goal is an app that
looks built in 2026 and feels identical in spirit across web, desktop, and tooling.

The values (colour, type scale, weight, geometry, motion) were measured from a best-in-class productivity
app and used as a reference for the *design spirit* only — see [`references/provenance.md`](references/provenance.md).
This is an inspired-by style: it carries no third-party brand's name, logo, or assets.

## What's inside

| File | Purpose |
|------|---------|
| [`SKILL.md`](SKILL.md) | The skill itself — when to apply the style and how. |
| [`assets/tokens.css`](assets/tokens.css) | **Source of truth.** Drop-in CSS variables; follows the OS light/dark setting, or force it with `<html data-theme="dark\|light">`. |
| [`assets/shell.html`](assets/shell.html) | A working starter app: title bar, sidebar, raised work surface, tiles, table, status bar, command palette, theme toggle, responsive layout. Copy it and replace the sample content. |
| [`references/components.md`](references/components.md) | Exact specs and states for each component. |
| [`references/platforms.md`](references/platforms.md) | Token mappings for React, Tailwind, Electron, WPF/WinUI, and more. |
| [`references/provenance.md`](references/provenance.md) | Where the values came from and how to re-measure. |
| [`scripts/verify_ui.mjs`](scripts/verify_ui.mjs) | A visual verification routine. |

## Install as a Claude skill

Clone into your Claude skills directory:

```bash
git clone https://github.com/n1ghtflight/nightflight-ui ~/.claude/skills/nightflight-ui
```

Claude will pick it up on the next session. A skill is just a directory containing `SKILL.md`, so this
repository *is* the installable package — no build step.

## Use the tokens directly

If you only want the look, copy [`assets/tokens.css`](assets/tokens.css) into your project and build on its
variables, then start your layout from [`assets/shell.html`](assets/shell.html). Layer your own domain colours
on top of the base tokens rather than replacing them.

## License

[MIT](LICENSE) © n1ghtflight
