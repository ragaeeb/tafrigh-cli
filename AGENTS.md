# Agent guide

Welcome! This project is a Bun-first CLI that orchestrates transcription jobs through the upstream `tafrigh` engine. Please follow the guidance below so future contributors receive consistent behaviour and documentation.

## Repository layout

- `src/index.ts` – CLI entry executed via `bunx tafrigh-cli`. Wiring for `meow`, tafrigh bootstrapping and logging happens here.
- `src/utils/` – Focused helpers grouped by responsibility (config, prompts, media discovery, filesystem IO, option mapping). Every exported helper needs JSDoc coverage and Bun tests.
- `tests/` – Bun test suites mirroring the helper modules (e.g. `mediaUtils.test.ts`). Always use `bun:test` with the `it('should …')` naming convention.
- `tsdown.config.ts` – Source of truth for bundling. `tsdown` reads this file directly, so keep entrypoints, externals and banners in sync with CLI expectations.
- `README.md` – Landing page for the CLI. Update feature lists, flag descriptions and workflow notes whenever behaviour changes.
- `AGENTS.md` – This document. Extend it when you add tooling, conventions or new directories.
- `bun.lock` – Bun’s lockfile. Commit changes after running `bun update --latest` or touching dependencies.
- `biome.json` – Formatting/linting rules. `$schema` must match the currently installed Biome version.

## Tooling & workflow

- **Package management:** Bun only. Run `bun install` after editing dependencies. We pin `https-proxy-agent@5.0.1` via overrides to keep `ffmpeg-static` installs happy behind proxies—leave that override alone unless you know what you’re doing.
- **Dependency updates:** Use `bun update --latest` to stay on the newest stack, then commit both `package.json` and `bun.lock`.
- **Build:** `bun run build` shells out to `bunx tsdown --config tsdown.config.ts`. `tsdown` injects the Bun shebang via the `banner` config and the `postbuild` script sets the executable bit on `dist/index.js`. Preserve both behaviours whenever you touch build scripts.
- **Testing:** `bun test`. Add coverage alongside any new exported helper. Mock networked services (tafrigh, YouTube, Facebook, X/Twitter) so the suite runs offline.
- **Lint/format:** Use Biome through `bun run lint` / `bun run format`. Keep `$schema` on the latest release and include `src` + `tests` only (generated `dist/` stays excluded).

## Coding conventions

- Exported functions and complex helpers must include JSDoc mirroring the tone already used across `src/utils`.
- Prefer explicit named exports and avoid defaults in `src/utils` for easier mocking.
- Keep log messages actionable and leverage the existing `pino` logger utilities instead of `console` inside the CLI flow.
- Avoid `try/catch` around imports per repo guidelines; use targeted error handling elsewhere.
- Tests should describe behaviour (`it('should ...')`), assert against real return values, and isolate filesystem/network activity with Bun’s mocking tools.

## Documentation

- Update `README.md` whenever you add CLI flags, change supported platforms, or touch the build/test workflow.
- When you introduce a new directory, script or convention, add a short note in this guide so the next agent can find it faster.

Generated artifacts under `dist/` remain untracked—never commit build output. Thanks for keeping the CLI tidy!
