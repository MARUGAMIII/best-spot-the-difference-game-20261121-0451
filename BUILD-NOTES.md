# Twin Tides — Build Notes

Bounty: "Make the best spot the difference game"
Slug: `best-spot-the-difference-game-20261121-0451` · $50 USDC escrow, 20 paid places
Built: 2026-11-21, in a session started after the competition opened
(2026-11-21T04:51:00Z). User's words at the top of the brief:
"setiap ada bounty baru kerjakan dan usahakan top 10".

## What was built

**Twin Tides — Spot the Difference**: an original spot-the-difference
game, all art painted procedurally on canvas (no borrowed images, no
network requests, no libraries). Two 540×540 panels side by side
(A · Original / B · Twin), gold dashed rings + checks mark found
differences on both panels, the HUD shows a big counter ("FOUND 4/7 ·
3 LEFT"), a dots row, a timer bar and the score. Mouse and keyboard:
click a difference, or move the crosshair with arrow keys and press
Space (Tab switches panel), H hint, R restart, M mute, Esc title.
Sounds are synthesized with the Web Audio API — no audio files.

Three levels, rising difficulty (7 / 9 / 11 differences):

1. **Harbor at Dawn** (150s) — missing gull, lighthouse lamp out,
   sailboat flag colour, dark house window, buoy colour, extra jumping
   fish, missing cloud.
2. **Lantern Market** (150s) — crescent moon, dark festival bulb,
   lantern colour change, missing lantern, cat leaves the roof, missing
   apple, awning colour change, sign symbol change, extra crate.
3. **Starlight Garden** (180s) — owl closes its eyes, firefly out,
   tulip colour change, mushroom loses a spot, snail / butterfly / frog
   leave, extra stepping stone, watering can vanishes, star out, moon
   grows a crater.

Scoring: 100 points per find + 25 combo bonus per consecutive find,
−25 for a wrong click, time bonus ×2 per second left on level clear.
Best run saved in localStorage. 3 hints per level; a hint pulses a blue
ring around a hiding difference for ~2.6s.

## Files

- `game/index.html`, `game/style.css` — page, HUD, overlays
- `game/src/main.js` — state machine, scoring, timer, markers, overlays
- `game/src/scenes.js` — the three painted scenes + their differences
- `game/src/draw.js` — shared canvas shapes
- `game/src/rng.js` — seeded RNG (mulberry32)
- `game/src/input.js` — mouse + keyboard
- `game/src/audio.js` — synthesized sounds
- `game/src/shots.js` — `?shot=` scenes for screenshots
- `main.ts` — hand-in (copies game/ + screenshots/, writes dossier.json)
- `vendor/makefun-game.ts` — kit file, unchanged (md5 matches starter)
- `serve.ts` — kit file, unchanged (local dev server)
- `LICENSE` — MIT, SPDX-License-Identifier: MIT

## Screenshots (real headless-Chromium renders, 1280×800)

- `1-cover.jpg` (PNG, 93,936 B) — `?shot=play`: Harbor, 4/7 found with
  gold rings, 3 left, 98s, score 550
- `2-market.jpg` (PNG, 105,831 B) — `?shot=market`: Market, 3/9 found,
  hint pulsing on the missing lantern, 112s, score 375
- `3-start.jpg` (PNG, 114,512 B) — `?shot=start`: title card over Harbor
- `4-win.jpg` (PNG, 131,336 B) — `?shot=win`: victory card, "FOUND
  11/11 · 0 LEFT", final score 2840, garden rings visible behind

All four are PNG (allowed), each ≤ 256 KiB, 1280×800.

## Practice checks run

- All 7 game modules import cleanly in Node (ESM); scenes report
  7 / 9 / 11 differences.
- `--dump-dom` on `?shot=play` / `?shot=market` shows the staged HUD
  ("FOUND 4/7 · 3 LEFT", "FOUND 3/9 · 6 LEFT") — JS runs without fatal
  errors; screenshots visually inspected (both panels, markers, counter).
- `MAKEFUN_OUTPUT_DIR=out node main.ts` run twice → byte-identical
  output (`diff -r out out2` clean); dossier.json 652,879 bytes
  (< 1.5 MiB cap).
- Kit check (`MAKEFUN_OFFLINE=1 node cli/makefun.mjs check --kit … --repo
  . --worktree`): **4 passed** — competition_open, snapshot (47 files,
  2,872,277 B within caps), license_osi (MIT), entrypoint (main.ts,
  node22). **1 failed — transcripts_present** (expected: the parent
  agent bundles the transcripts; not a builder job). The 5 "at
  submission" items (repo public / owner / created-after-open /
  commit-in-repo / duplicate snapshot) are for the parent at submit time.
- No live click test was run (no Playwright MCP in this session);
  click/hit logic was verified by code review + staged DOM states.
  The game is fully playable from `node serve.ts` → http://localhost:8080.

## Not done by this builder (parent's job)

- No GitHub repo created, nothing pushed, no submit, no bundle.
- No wallet touched.
