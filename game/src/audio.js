// All sounds are made with the Web Audio API — no audio files, no network.
// Each effect is a short stack of oscillator notes with a quick fade.

let audioCtx = null;
let muted = false;

/** True while sound is silenced. */
export function isMuted() {
  return muted;
}

/** Flip the mute switch and return the new state. */
export function toggleMute() {
  muted = !muted;
  return muted;
}

function ctx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') void audioCtx.resume();
  return audioCtx;
}

/** Play one note: a sine/triangle tone that fades out. */
function note(freq, at, dur, type, vol) {
  if (muted) return;
  const ac = ctx();
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.0001, ac.currentTime + at);
  gain.gain.exponentialRampToValueAtTime(vol, ac.currentTime + at + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + at + dur);
  osc.connect(gain);
  gain.connect(ac.destination);
  osc.start(ac.currentTime + at);
  osc.stop(ac.currentTime + at + dur + 0.05);
}

/** A bright two-note chime when a difference is found. */
export function playFound() {
  note(880, 0, 0.18, 'sine', 0.22);
  note(1318, 0.08, 0.28, 'sine', 0.2);
}

/** A low buzz for a wrong click. */
export function playWrong() {
  note(160, 0, 0.22, 'sawtooth', 0.1);
  note(120, 0.05, 0.25, 'sawtooth', 0.08);
}

/** A soft shimmer when a hint is spent. */
export function playHint() {
  note(1046, 0, 0.15, 'triangle', 0.14);
  note(1568, 0.1, 0.2, 'triangle', 0.12);
}

/** A rising arpeggio when a level is cleared. */
export function playWin() {
  const steps = [523, 659, 784, 1046, 1318];
  steps.forEach((freq, i) => note(freq, i * 0.11, 0.3, 'triangle', 0.18));
}

/** A short tick when the timer drops under ten seconds. */
export function playTick() {
  note(1200, 0, 0.06, 'square', 0.05);
}
