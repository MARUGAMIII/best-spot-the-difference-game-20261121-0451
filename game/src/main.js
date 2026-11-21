// Twin Tides — the game itself: state, scoring, timer, markers, overlays
// and the render loop. The two panels are drawn from scenes.js; this file
// only decides what happens when the player clicks, hints, wins or runs
// out of time.

import { LEVELS, SCENE_SIZE } from './scenes.js';
import { bindInput, makeCrosshair } from './input.js';
import { isMuted, playFound, playHint, playTick, playWin, playWrong, toggleMute } from './audio.js';
import { stageShot } from './shots.js';

const $ = (id) => document.getElementById(id);
const canvasA = $('panelA');
const canvasB = $('panelB');
const ctxA = canvasA.getContext('2d');
const ctxB = canvasB.getContext('2d');
const stage = $('stage');

const BEST_KEY = 'twin-tides-best';

const state = {
  screen: 'title', // title | play | levelDone | failed | victory
  levelIndex: 0,
  found: new Set(),
  score: 0,
  levelStartScore: 0,
  combo: 0,
  hints: 3,
  timeLeft: 0,
  timeLimit: 0,
  hintTarget: null,
  hintUntil: 0,
  wrongMarks: [],
  crosshair: makeCrosshair(),
  frozen: false, // screenshot mode: the timer does not run
  best: Number(localStorage.getItem(BEST_KEY) || 0),
  lastTickSecond: -1,
};

function level() {
  return LEVELS[state.levelIndex];
}

function remaining() {
  return level().diffs.length - state.found.size;
}

/* ------------------------------------------------------------------ */
/* HUD                                                                 */
/* ------------------------------------------------------------------ */

function renderHud() {
  const lvl = level();
  $('levelChip').textContent = `Level ${state.levelIndex + 1} / ${LEVELS.length} — ${lvl.name}`;
  $('levelName').textContent = lvl.subtitle;
  $('counterText').textContent = `FOUND ${state.found.size}/${lvl.diffs.length} · ${remaining()} LEFT`;
  $('scoreText').textContent = `Score ${state.score}`;
  $('hintBtn').textContent = `Hint (${state.hints}) [H]`;
  $('hintBtn').disabled = state.hints <= 0 || state.screen !== 'play';
  $('muteBtn').textContent = isMuted() ? 'Sound off [M]' : 'Sound on [M]';
  $('bestText').textContent = state.best > 0 ? `Best run: ${state.best}` : '';
  const dots = $('dots');
  dots.innerHTML = '';
  for (let i = 0; i < lvl.diffs.length; i += 1) {
    const dot = document.createElement('span');
    dot.className = 'dot' + (i < state.found.size ? ' found' : '');
    dots.appendChild(dot);
  }
  const pct = Math.max(0, (state.timeLeft / state.timeLimit) * 100);
  $('timerFill').style.width = `${pct}%`;
  $('timerFill').classList.toggle('low', state.timeLeft <= 15);
  $('timerText').textContent = `${Math.ceil(state.timeLeft)}s`;
}

/* ------------------------------------------------------------------ */
/* Overlays                                                            */
/* ------------------------------------------------------------------ */

function showOverlay(html) {
  const overlay = $('overlay');
  overlay.innerHTML = html;
  overlay.classList.remove('hidden');
}

function hideOverlay() {
  $('overlay').classList.add('hidden');
  $('overlay').innerHTML = '';
}

function showTitle() {
  state.screen = 'title';
  state.levelIndex = 0;
  state.score = 0;
  state.found = new Set();
  state.timeLeft = LEVELS[0].seconds;
  state.timeLimit = LEVELS[0].seconds;
  state.hintTarget = null;
  renderHud();
  const list = LEVELS.map(
    (lvl, i) => `<li><b>${i + 1}. ${lvl.name}</b> — ${lvl.diffs.length} differences, ${lvl.seconds}s</li>`,
  ).join('');
  showOverlay(`
    <div class="card">
      <h1>TWIN TIDES</h1>
      <p class="tagline">Spot the Difference</p>
      <p>Two pictures hang side by side. They look the same — they are not.
      Find every difference before the tide runs out.</p>
      <ul class="levels">${list}</ul>
      <p class="keys">Click a difference · Arrow keys move the crosshair · Space selects ·
      <b>H</b> hint · <b>R</b> restart · <b>M</b> sound</p>
      <button id="startBtn" class="big">Start the hunt</button>
      ${state.best > 0 ? `<p class="best">Best run: ${state.best} points</p>` : ''}
    </div>`);
  $('startBtn').addEventListener('click', () => startLevel(0));
}

function showLevelDone(levelScore, timeBonus) {
  state.screen = 'levelDone';
  playWin();
  const last = state.levelIndex === LEVELS.length - 1;
  showOverlay(`
    <div class="card">
      <h2>${last ? 'All tides explored!' : 'Level clear!'}</h2>
      <p>${level().name} — every difference found.</p>
      <p class="points">Level points: ${levelScore} &nbsp;·&nbsp; Time bonus: +${timeBonus}</p>
      <p class="points">Total score: ${state.score}</p>
      <button id="nextBtn" class="big">${last ? 'See the final tally' : 'Next level'}</button>
    </div>`);
  $('nextBtn').addEventListener('click', () => {
    if (last) showVictory();
    else startLevel(state.levelIndex + 1);
  });
}

function showFailed() {
  state.screen = 'failed';
  showOverlay(`
    <div class="card">
      <h2>Out of time!</h2>
      <p>The tide came in with ${remaining()} difference${remaining() === 1 ? '' : 's'} still hiding
      in ${level().name}.</p>
      <p class="points">Score so far: ${state.score}</p>
      <button id="retryBtn" class="big">Try this level again</button>
      <button id="titleBtn" class="ghost">Back to title</button>
    </div>`);
  $('retryBtn').addEventListener('click', () => startLevel(state.levelIndex));
  $('titleBtn').addEventListener('click', showTitle);
}

function showVictory() {
  state.screen = 'victory';
  if (state.score > state.best) {
    state.best = state.score;
    localStorage.setItem(BEST_KEY, String(state.best));
  }
  renderHud();
  const rows = LEVELS.map(
    (lvl) => `<li><b>${lvl.name}</b> — ${lvl.diffs.length} differences found</li>`,
  ).join('');
  showOverlay(`
    <div class="card">
      <h1>YOU FOUND THEM ALL!</h1>
      <p class="tagline">Every tide, every difference.</p>
      <ul class="levels">${rows}</ul>
      <p class="points">Final score: ${state.score}</p>
      <p class="best">Best run: ${state.best} points</p>
      <button id="againBtn" class="big">Play again</button>
    </div>`);
  $('againBtn').addEventListener('click', () => {
    state.score = 0;
    startLevel(0);
  });
}

/* ------------------------------------------------------------------ */
/* Playing                                                             */
/* ------------------------------------------------------------------ */

function startLevel(index) {
  state.levelIndex = index;
  state.found = new Set();
  state.combo = 0;
  state.hints = 3;
  state.hintTarget = null;
  state.wrongMarks = [];
  state.timeLimit = level().seconds;
  state.timeLeft = level().seconds;
  state.levelStartScore = state.score;
  state.screen = 'play';
  state.lastTickSecond = -1;
  hideOverlay();
  renderHud();
}

function floater(panel, x, y, text, good) {
  const canvas = panel === 'A' ? canvasA : canvasB;
  const cr = canvas.getBoundingClientRect();
  const sr = stage.getBoundingClientRect();
  const el = document.createElement('div');
  el.className = 'floater' + (good ? ' good' : ' bad');
  el.textContent = text;
  el.style.left = `${cr.left - sr.left + (x / SCENE_SIZE) * cr.width}px`;
  el.style.top = `${cr.top - sr.top + (y / SCENE_SIZE) * cr.height}px`;
  $('floaters').appendChild(el);
  window.setTimeout(() => el.remove(), 1100);
}

function onSpot(panel, x, y) {
  if (state.screen !== 'play') return;
  const lvl = level();
  let hit = null;
  let bestDist = Infinity;
  for (const diff of lvl.diffs) {
    if (state.found.has(diff.id)) continue;
    const d = Math.hypot(diff.x - x, diff.y - y);
    if (d < diff.r && d < bestDist) {
      hit = diff;
      bestDist = d;
    }
  }
  if (hit) {
    state.found.add(hit.id);
    state.combo += 1;
    const points = 100 + (state.combo - 1) * 25;
    state.score += points;
    playFound();
    floater(panel, hit.x, hit.y, `+${points} · ${hit.label}`, true);
    if (state.found.size === lvl.diffs.length) {
      const timeBonus = Math.round(state.timeLeft) * 2;
      state.score += timeBonus;
      const levelScore = state.score - state.levelStartScore - timeBonus;
      renderHud();
      window.setTimeout(() => showLevelDone(levelScore, timeBonus), 450);
    }
  } else {
    state.combo = 0;
    state.score = Math.max(0, state.score - 25);
    state.wrongMarks.push({ panel, x, y, until: performance.now() + 700 });
    playWrong();
    floater(panel, x, y, '−25 · not a difference', false);
  }
  renderHud();
}

function onHint() {
  if (state.screen !== 'play' || state.hints <= 0) return;
  const left = level().diffs.filter((d) => !state.found.has(d.id));
  if (left.length === 0) return;
  state.hints -= 1;
  state.hintTarget = left[Math.floor(Math.random() * left.length)];
  state.hintUntil = performance.now() + 2600;
  playHint();
  renderHud();
}

/* ------------------------------------------------------------------ */
/* Drawing                                                             */
/* ------------------------------------------------------------------ */

function drawMarker(ctx, x, y, r, pulse) {
  const now = performance.now();
  const breathe = pulse ? 1 + 0.12 * Math.sin(now / 160) : 1;
  ctx.save();
  ctx.strokeStyle = '#ffd21f';
  ctx.lineWidth = 4;
  ctx.setLineDash([10, 6]);
  ctx.beginPath();
  ctx.arc(x, y, r * breathe, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
  // A small gold check in the ring's corner.
  ctx.strokeStyle = '#ffd21f';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x + r * 0.45, y + r * 0.55);
  ctx.lineTo(x + r * 0.75, y + r * 0.85);
  ctx.lineTo(x + r * 1.15, y + r * 0.3);
  ctx.stroke();
  ctx.restore();
}

function drawPanels() {
  const lvl = level();
  lvl.draw(ctxA, 'A');
  lvl.draw(ctxB, 'B');
  const now = performance.now();
  for (const ctx of [ctxA, ctxB]) {
    for (const diff of lvl.diffs) {
      if (state.found.has(diff.id)) drawMarker(ctx, diff.x, diff.y, diff.r, false);
    }
    if (state.hintTarget && now < state.hintUntil) {
      ctx.save();
      ctx.strokeStyle = 'rgba(110,198,255,0.95)';
      ctx.lineWidth = 3;
      ctx.setLineDash([8, 6]);
      const pulse = 1 + 0.15 * Math.sin(now / 140);
      ctx.beginPath();
      ctx.arc(state.hintTarget.x, state.hintTarget.y, state.hintTarget.r * pulse + 6, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
    for (const mark of state.wrongMarks) {
      if (now > mark.until) continue;
      ctx.strokeStyle = 'rgba(229,72,77,0.9)';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      const s = 12;
      ctx.beginPath();
      ctx.moveTo(mark.x - s, mark.y - s);
      ctx.lineTo(mark.x + s, mark.y + s);
      ctx.moveTo(mark.x + s, mark.y - s);
      ctx.lineTo(mark.x - s, mark.y + s);
      ctx.stroke();
    }
  }
  // Crosshair: a thin ring where the keyboard cursor stands.
  if (state.crosshair.visible && state.screen === 'play') {
    const ctx = state.crosshair.panel === 'A' ? ctxA : ctxB;
    const { x, y } = state.crosshair;
    ctx.save();
    ctx.strokeStyle = 'rgba(255,255,255,0.9)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, 16, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x - 22, y);
    ctx.lineTo(x - 10, y);
    ctx.moveTo(x + 10, y);
    ctx.lineTo(x + 22, y);
    ctx.moveTo(x, y - 22);
    ctx.lineTo(x, y - 10);
    ctx.moveTo(x, y + 10);
    ctx.lineTo(x, y + 22);
    ctx.stroke();
    ctx.restore();
  }
  // Move the DOM crosshair ring to match (a visible focus aid).
  const cross = $('crosshair');
  if (state.crosshair.visible && state.screen === 'play') {
    const canvas = state.crosshair.panel === 'A' ? canvasA : canvasB;
    const cr = canvas.getBoundingClientRect();
    const sr = stage.getBoundingClientRect();
    cross.style.display = 'block';
    cross.style.left = `${cr.left - sr.left + (state.crosshair.x / SCENE_SIZE) * cr.width - 14}px`;
    cross.style.top = `${cr.top - sr.top + (state.crosshair.y / SCENE_SIZE) * cr.height - 14}px`;
  } else {
    cross.style.display = 'none';
  }
}

/* ------------------------------------------------------------------ */
/* Timer loop                                                          */
/* ------------------------------------------------------------------ */

let lastFrame = performance.now();

function loop(now) {
  const dt = Math.min(0.25, (now - lastFrame) / 1000);
  lastFrame = now;
  if (state.screen === 'play' && !state.frozen) {
    state.timeLeft -= dt;
    const whole = Math.ceil(state.timeLeft);
    if (state.timeLeft <= 10 && whole !== state.lastTickSecond && whole > 0) {
      state.lastTickSecond = whole;
      playTick();
    }
    if (state.timeLeft <= 0) {
      state.timeLeft = 0;
      renderHud();
      drawPanels();
      showFailed();
      requestAnimationFrame(loop);
      return;
    }
    renderHud();
  }
  drawPanels();
  requestAnimationFrame(loop);
}

/* ------------------------------------------------------------------ */
/* Wiring and start                                                    */
/* ------------------------------------------------------------------ */

bindInput({ A: canvasA, B: canvasB }, state.crosshair, {
  onSpot,
  onHint,
  onRestart: () => {
    if (state.screen === 'play' || state.screen === 'failed') startLevel(state.levelIndex);
  },
  onMute: () => {
    toggleMute();
    renderHud();
  },
  onNext: () => {
    if (state.screen === 'levelDone') $('nextBtn')?.click();
  },
  onEscape: () => {
    if (state.screen !== 'title') showTitle();
  },
});

$('hintBtn').addEventListener('click', onHint);
$('muteBtn').addEventListener('click', () => {
  toggleMute();
  renderHud();
});

// Screenshot scenes (?shot=start|play|market|win) stage a real game state
// through the same functions a player would reach; anything else is the
// normal title screen.
const shot = new URLSearchParams(window.location.search).get('shot');
if (shot) {
  stageShot(shot, {
    startLevel,
    showTitle,
    showVictory,
    markFound(id) {
      state.found.add(id);
    },
    markAllFound() {
      for (const diff of level().diffs) state.found.add(diff.id);
    },
    setHint(id) {
      state.hintTarget = level().diffs.find((d) => d.id === id) || null;
      state.hintUntil = performance.now() + 60000;
    },
    setTimeLeft(seconds) {
      state.timeLeft = seconds;
    },
    freeze() {
      state.frozen = true;
    },
    get state() {
      return state;
    },
  });
  renderHud();
} else {
  showTitle();
}
requestAnimationFrame(loop);
