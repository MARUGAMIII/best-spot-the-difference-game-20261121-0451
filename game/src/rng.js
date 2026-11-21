// A tiny seeded random number generator (mulberry32) plus the small helpers
// the scene painters use, so every panel of a level draws the same way on
// every load and the two panels only ever differ where a difference says so.

/** Make a deterministic random function from an integer seed. */
export function mulberry32(seed) {
  let a = seed >>> 0;
  return function next() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A float in [min, max). */
export function range(rnd, min, max) {
  return min + rnd() * (max - min);
}

/** An integer in [min, max]. */
export function int(rnd, min, max) {
  return Math.floor(range(rnd, min, max + 1));
}

/** One element of an array, picked at random. */
export function pick(rnd, list) {
  return list[Math.floor(rnd() * list.length)];
}
