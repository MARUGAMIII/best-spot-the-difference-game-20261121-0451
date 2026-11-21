// Shared canvas drawing helpers: the small shapes every scene is built
// from, so each scene file reads like a list of what is in the picture.

/** Begin a rounded-rectangle path. */
export function roundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** Fill a circle. */
export function disc(ctx, x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

/** Fill an ellipse. */
export function ellipse(ctx, x, y, rx, ry, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

/** Fill a polygon from [x, y] points. */
export function polygon(ctx, points, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i += 1) ctx.lineTo(points[i][0], points[i][1]);
  ctx.closePath();
  ctx.fill();
}

/** A five-pointed star. */
export function star(ctx, x, y, outer, inner, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < 10; i += 1) {
    const r = i % 2 === 0 ? outer : inner;
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const px = x + Math.cos(a) * r;
    const py = y + Math.sin(a) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}

/** A puffy cloud made of overlapping discs. */
export function cloud(ctx, x, y, s, color) {
  disc(ctx, x, y, 16 * s, color);
  disc(ctx, x + 16 * s, y - 6 * s, 13 * s, color);
  disc(ctx, x + 32 * s, y, 15 * s, color);
  disc(ctx, x + 16 * s, y + 5 * s, 14 * s, color);
}

/** A simple seagull: two curved wing strokes. */
export function gull(ctx, x, y, s, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.4 * s;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - 11 * s, y);
  ctx.quadraticCurveTo(x - 5 * s, y - 7 * s, x, y);
  ctx.quadraticCurveTo(x + 5 * s, y - 7 * s, x + 11 * s, y);
  ctx.stroke();
}

/** A vertical linear gradient fill for a rectangle. */
export function skyGradient(ctx, x, y, w, h, stops) {
  const g = ctx.createLinearGradient(x, y, x, y + h);
  for (const [at, color] of stops) g.addColorStop(at, color);
  ctx.fillStyle = g;
  ctx.fillRect(x, y, w, h);
}

/** A small four-point sparkle (a twinkle star). */
export function sparkle(ctx, x, y, r, color) {
  polygon(
    ctx,
    [
      [x, y - r],
      [x + r * 0.28, y - r * 0.28],
      [x + r, y],
      [x + r * 0.28, y + r * 0.28],
      [x, y + r],
      [x - r * 0.28, y + r * 0.28],
      [x - r, y],
      [x - r * 0.28, y - r * 0.28],
    ],
    color,
  );
}
