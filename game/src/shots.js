// The screenshot scenes behind ?shot=start|play|market|win. Each one reaches
// a real game state through the same functions a player would use — start a
// level, mark differences found, spend a hint — then freezes the timer, so
// the frame is what a real game looks like at that moment and the same URL
// always gives the same frame.

/**
 * Set the game to the named scene. `api` is the small set of actions
 * main.js hands over (startLevel, markFound, setHint, setTimeLeft,
 * freeze, showTitle, showVictory and the live state).
 */
export function stageShot(name, api) {
  api.freeze();
  if (name === 'play') {
    // Level 1 mid-hunt: four differences found and ringed, three still
    // hiding, the counter reading "3 LEFT".
    api.startLevel(0);
    for (const id of ['gull', 'lamp', 'flag', 'window']) api.markFound(id);
    api.state.score = 550; // 100 + 125 + 150 + 175, the combo as played
    api.setTimeLeft(98);
    return;
  }
  if (name === 'market') {
    // Level 2 mid-hunt with a hint pulsing around a lantern that is gone.
    api.startLevel(1);
    for (const id of ['moon', 'cat', 'apples']) api.markFound(id);
    api.state.score = 375; // 100 + 125 + 150, the combo as played
    api.setHint('lantern-gone');
    api.setTimeLeft(112);
    return;
  }
  if (name === 'win') {
    // The final tally after all three levels are cleared: level 3 shows
    // every difference found, so the HUD behind the card agrees with it.
    api.startLevel(2);
    api.markAllFound();
    api.state.score = 2840;
    api.setTimeLeft(42);
    api.showVictory();
    return;
  }
  // 'start' and anything else: the title screen over level 1.
  api.showTitle();
}
