// Mouse and keyboard input for Twin Tides. The mouse clicks a spot on
// either panel; the keyboard moves a crosshair with the arrow keys (Tab
// switches panels, Space or Enter clicks where the crosshair stands), H
// spends a hint, R restarts the level and M mutes the sound.

/** Make a crosshair state: which panel it is on and where it stands. */
export function makeCrosshair() {
  return { panel: 'A', x: 270, y: 270, visible: false };
}

/**
 * Bind the two panel canvases and the keyboard. `handlers` gets:
 * onSpot(panel, x, y) for a click, onHint(), onRestart(), onMute(),
 * onNext() and onEscape(). Returns a function that moves the crosshair
 * element to its current place.
 */
export function bindInput(canvases, crosshair, handlers) {
  const toScene = (event, canvas) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * 540,
      y: ((event.clientY - rect.top) / rect.height) * 540,
    };
  };

  for (const [panel, canvas] of Object.entries(canvases)) {
    canvas.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      const at = toScene(event, canvas);
      crosshair.panel = panel;
      crosshair.x = at.x;
      crosshair.y = at.y;
      crosshair.visible = true;
      handlers.onSpot(panel, at.x, at.y);
    });
    canvas.addEventListener('pointermove', (event) => {
      if (event.pointerType !== 'mouse') return;
      const at = toScene(event, canvas);
      crosshair.panel = panel;
      crosshair.x = at.x;
      crosshair.y = at.y;
      crosshair.visible = true;
    });
  }

  window.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight' || event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault();
      crosshair.visible = true;
      const step = event.shiftKey ? 4 : 14;
      if (event.key === 'ArrowLeft') crosshair.x = Math.max(10, crosshair.x - step);
      if (event.key === 'ArrowRight') crosshair.x = Math.min(530, crosshair.x + step);
      if (event.key === 'ArrowUp') crosshair.y = Math.max(10, crosshair.y - step);
      if (event.key === 'ArrowDown') crosshair.y = Math.min(530, crosshair.y + step);
      return;
    }
    if (event.key === 'Tab') {
      event.preventDefault();
      crosshair.panel = crosshair.panel === 'A' ? 'B' : 'A';
      crosshair.visible = true;
      return;
    }
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      crosshair.visible = true;
      handlers.onSpot(crosshair.panel, crosshair.x, crosshair.y);
      return;
    }
    const key = event.key.toLowerCase();
    if (key === 'h') handlers.onHint();
    else if (key === 'r') handlers.onRestart();
    else if (key === 'm') handlers.onMute();
    else if (key === 'n') handlers.onNext();
    else if (key === 'escape') handlers.onEscape();
  });
}
