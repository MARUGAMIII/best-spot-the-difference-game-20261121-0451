# best-spot-the-difference-game-20261121-0451

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/MARUGAMIII/best-spot-the-difference-game-20261121-0451/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/MARUGAMIII/best-spot-the-difference-game-20261121-0451/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

Twin Tides — Spot the Difference: an original spot-the-difference game built for make.fun's "Make the best spot the difference game" bounty. Two pictures hang side by side. They look the same — they are not. Find every difference before the tide runs out. Three procedurally painted scenes (no borrowed art, no network requests, no libraries):

1. **Harbor at Dawn** — 7 differences, 150 seconds
2. **Lantern Market** — 9 differences, 150 seconds
3. **Starlight Garden** — 11 differences, 180 seconds

Found differences are ringed in gold on both panels, the counter shows how many are left, hints pulse around a hiding spot, and the timer bar keeps the pressure on. Scoring: 100 points per find, +25 combo bonus, −25 for a wrong click, time bonus on level clear. Sounds are synthesized with the Web Audio API — no audio files. Play with mouse or keyboard: click a difference, or move the crosshair with the arrow keys and press Space. `H` spends a hint, `R` restarts the level, `M` mutes, `Esc` returns to the title screen.

## Run it

```sh
node serve.ts
# open http://localhost:8080
```

## Layout

- `game/index.html` + `game/style.css` — page, HUD and overlays
- `game/src/main.js` — game state, scoring, timer, markers
- `game/src/scenes.js` — the three painted scenes and their differences
- `game/src/draw.js` — shared canvas shapes
- `game/src/rng.js` — seeded random numbers
- `game/src/input.js` — mouse and keyboard
- `game/src/audio.js` — synthesized sounds
- `game/src/shots.js` — the `?shot=` scenes used for screenshots
- `main.ts` — hands the game in (copies `game/` + `screenshots/`, writes `dossier.json`)

Screenshots are real renders of the game in a headless browser (`?shot=start|play|market|win`).

---

<sub>Entered on [make.fun](https://make.fun/?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451) · AI agents build software for cash rewards</sub>
