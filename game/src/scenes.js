// The three scenes of Twin Tides, each drawn from scratch on a canvas with
// flat colours and a seeded random generator, so the two panels of a level
// are identical except where a difference says otherwise. A difference is a
// spot with a centre and a radius: { id, x, y, r, label }. Panel A is the
// original, panel B the twin; `side` is 'A' or 'B'.

import { mulberry32, range } from './rng.js';
import { cloud, disc, ellipse, gull, polygon, roundedRect, skyGradient, sparkle, star } from './draw.js';

const W = 540;
const H = 540;

/* ------------------------------------------------------------------ */
/* Level 1 — Harbor at Dawn                                            */
/* ------------------------------------------------------------------ */

function drawHarbor(ctx, side) {
  const b = side === 'B';
  const rnd = mulberry32(11);

  // Dawn sky and sun.
  skyGradient(ctx, 0, 0, W, 300, [
    [0, '#ffe7b8'],
    [0.6, '#ffb98a'],
    [1, '#ff9e7d'],
  ]);
  disc(ctx, 448, 78, 30, '#fff3c4');
  disc(ctx, 448, 78, 22, '#ffe98a');

  // Clouds; the middle one only exists in panel A.
  cloud(ctx, 96, 64, 1.0, '#fff4e0');
  if (!b) cloud(ctx, 318, 62, 0.9, '#fff4e0');
  cloud(ctx, 420, 152, 0.65, '#ffe9d2');

  // Gulls; the one at (150, 72) only flies in panel A.
  if (!b) gull(ctx, 150, 72, 1, '#5a4a42');
  gull(ctx, 210, 52, 0.9, '#5a4a42');
  gull(ctx, 268, 88, 1.1, '#5a4a42');
  gull(ctx, 330, 58, 0.9, '#5a4a42');
  gull(ctx, 392, 96, 1, '#5a4a42');

  // Sea and distant hills.
  skyGradient(ctx, 0, 300, W, 240, [
    [0, '#2f7f9e'],
    [1, '#175a75'],
  ]);
  polygon(
    ctx,
    [
      [0, 300],
      [90, 268],
      [190, 300],
      [330, 272],
      [430, 300],
      [540, 278],
      [540, 300],
    ],
    '#1d5c6e',
  );
  // Wave strokes.
  ctx.strokeStyle = 'rgba(255,255,255,0.5)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 7; i += 1) {
    const wx = 40 + i * 72 + range(rnd, -8, 8);
    const wy = 330 + (i % 3) * 52;
    ctx.beginPath();
    ctx.arc(wx, wy, 16, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();
  }

  // Lighthouse, striped tower with a lamp room; the lamp glows only in A.
  ctx.fillStyle = '#f5efe2';
  ctx.fillRect(62, 196, 52, 104);
  ctx.fillStyle = '#e05252';
  ctx.fillRect(62, 222, 52, 16);
  ctx.fillRect(62, 262, 52, 16);
  polygon(
    ctx,
    [
      [58, 196],
      [118, 196],
      [106, 172],
      [70, 172],
    ],
    '#3d4a5c',
  );
  disc(ctx, 88, 186, 8, b ? '#4a5568' : '#ffe98a');
  if (!b) {
    ctx.fillStyle = 'rgba(255,233,138,0.25)';
    ctx.beginPath();
    ctx.arc(88, 186, 26, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#3d4a5c';
  ctx.fillRect(56, 300, 64, 8);

  // Three little houses along the shore.
  const houses = [
    { x: 168, w: 62, wall: '#f2c14e', roof: '#b4483c' },
    { x: 240, w: 62, wall: '#7fb069', roof: '#4a6b8a' },
    { x: 312, w: 62, wall: '#e08e79', roof: '#7a4a8a' },
  ];
  for (const house of houses) {
    ctx.fillStyle = house.wall;
    ctx.fillRect(house.x, 258, house.w, 42);
    polygon(
      ctx,
      [
        [house.x - 6, 258],
        [house.x + house.w / 2, 232],
        [house.x + house.w + 6, 258],
      ],
      house.roof,
    );
    ctx.fillStyle = '#3d4a5c';
    ctx.fillRect(house.x + house.w / 2 - 6, 282, 12, 18);
  }
  // Windows; the middle house's left window is lit in A, dark in B.
  const windows = [
    { x: 180, y: 268, lit: true },
    { x: 204, y: 268, lit: false },
    { x: 252, y: 268, lit: !b },
    { x: 276, y: 268, lit: true },
    { x: 324, y: 268, lit: false },
    { x: 348, y: 268, lit: true },
  ];
  for (const win of windows) {
    ctx.fillStyle = win.lit ? '#ffe98a' : '#3d4a5c';
    ctx.fillRect(win.x, win.y, 12, 14);
  }

  // Wooden pier.
  ctx.fillStyle = '#8a5a33';
  ctx.fillRect(140, 308, 280, 10);
  ctx.fillStyle = '#6e4525';
  for (let i = 0; i < 8; i += 1) ctx.fillRect(150 + i * 34, 308, 3, 10);
  ctx.fillRect(160, 318, 8, 26);
  ctx.fillRect(392, 318, 8, 26);

  // Sailboat; its flag is red in A, teal in B.
  ctx.fillStyle = '#7a3b2e';
  polygon(
    ctx,
    [
      [316, 344],
      [388, 344],
      [372, 364],
      [332, 364],
    ],
    '#7a3b2e',
  );
  ctx.fillStyle = '#5d2d24';
  ctx.fillRect(350, 292, 4, 52);
  polygon(
    ctx,
    [
      [354, 296],
      [354, 340],
      [386, 340],
    ],
    '#fff4e0',
  );
  polygon(
    ctx,
    [
      [354, 292],
      [376, 298],
      [354, 304],
    ],
    b ? '#2bb3a3' : '#e5484d',
  );

  // Rowboat with an oar.
  ctx.fillStyle = '#4a6b8a';
  polygon(
    ctx,
    [
      [188, 372],
      [252, 372],
      [240, 388],
      [200, 388],
    ],
    '#4a6b8a',
  );
  ctx.strokeStyle = '#8a5a33';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(236, 368);
  ctx.lineTo(262, 348);
  ctx.stroke();

  // Buoy; orange in A, yellow in B.
  ctx.fillStyle = b ? '#ffd21f' : '#ff7a1a';
  polygon(
    ctx,
    [
      [428, 396],
      [448, 396],
      [444, 420],
      [432, 420],
    ],
    b ? '#ffd21f' : '#ff7a1a',
  );
  ctx.fillStyle = '#fff4e0';
  ctx.fillRect(430, 404, 16, 5);
  disc(ctx, 438, 392, 4, '#3d4a5c');

  // A jumping fish; panel B has a second one near the rowboat.
  const fish = (fx, fy) => {
    ctx.fillStyle = '#ffd21f';
    ctx.beginPath();
    ctx.ellipse(fx, fy, 14, 7, -0.5, 0, Math.PI * 2);
    ctx.fill();
    polygon(
      ctx,
      [
        [fx + 12, fy - 2],
        [fx + 22, fy - 8],
        [fx + 22, fy + 4],
      ],
      '#ffd21f',
    );
  };
  fish(300, 424);
  if (b) fish(182, 392);

  // A few more wave sparkles low in the frame.
  ctx.strokeStyle = 'rgba(255,255,255,0.35)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 5; i += 1) {
    const wx = 60 + i * 96;
    ctx.beginPath();
    ctx.arc(wx, 470 + (i % 2) * 30, 13, Math.PI * 1.2, Math.PI * 1.8);
    ctx.stroke();
  }
}

const HARBOR_DIFFS = [
  { id: 'gull', x: 150, y: 72, r: 26, label: 'a gull is missing' },
  { id: 'lamp', x: 88, y: 186, r: 24, label: 'the lighthouse lamp is out' },
  { id: 'flag', x: 362, y: 298, r: 22, label: 'the sailboat flag changed colour' },
  { id: 'window', x: 258, y: 275, r: 20, label: 'a house window went dark' },
  { id: 'buoy', x: 438, y: 408, r: 22, label: 'the buoy changed colour' },
  { id: 'fish', x: 182, y: 392, r: 26, label: 'an extra fish is jumping' },
  { id: 'cloud', x: 318, y: 62, r: 30, label: 'a cloud drifted away' },
];

/* ------------------------------------------------------------------ */
/* Level 2 — Lantern Market                                            */
/* ------------------------------------------------------------------ */

function drawMarket(ctx, side) {
  const b = side === 'B';
  const rnd = mulberry32(23);

  // Night sky, stars and the moon; the moon is full in A, crescent in B.
  skyGradient(ctx, 0, 0, W, 330, [
    [0, '#1b2a4a'],
    [1, '#0e1830'],
  ]);
  for (let i = 0; i < 26; i += 1) {
    sparkle(ctx, 20 + rnd() * 500, 14 + rnd() * 150, 2 + rnd() * 2.4, 'rgba(255,244,200,0.85)');
  }
  disc(ctx, 472, 64, 26, '#ffe9a8');
  if (b) disc(ctx, 482, 58, 22, '#1b2a4a');

  // Strings of festival lights across the top.
  const strings = [
    { x0: 0, y0: 30, x1: 270, y1: 96 },
    { x0: 270, y0: 96, x1: 540, y1: 44 },
  ];
  for (const s of strings) {
    ctx.strokeStyle = '#3a2f2f';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(s.x0, s.y0);
    ctx.quadraticCurveTo((s.x0 + s.x1) / 2, s.y1 + 26, s.x1, s.y1);
    ctx.stroke();
  }
  const bulbColors = ['#ff5d5d', '#ffd21f', '#7ee081', '#6ec6ff', '#ff9de2'];
  for (let i = 0; i < 12; i += 1) {
    const t = i / 11;
    const bx = 12 + t * 516;
    const by = 58 + Math.sin(t * Math.PI) * 34;
    // The bulb at (200, 89) is dark in panel B.
    const dark = b && i === 4;
    disc(ctx, bx, by, 6, dark ? '#2c3444' : bulbColors[i % bulbColors.length]);
    if (!dark) {
      ctx.fillStyle = 'rgba(255,220,120,0.18)';
      ctx.beginPath();
      ctx.arc(bx, by, 12, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Cobblestones.
  ctx.fillStyle = '#232a3d';
  ctx.fillRect(0, 330, W, 210);
  ctx.fillStyle = '#2c3550';
  for (let row = 0; row < 4; row += 1) {
    for (let col = 0; col < 7; col += 1) {
      roundedRect(ctx, 12 + col * 76 + (row % 2) * 20, 352 + row * 44, 58, 30, 8);
      ctx.fill();
    }
  }

  // Three market stalls.
  const stalls = [
    { x: 30, awning: ['#e05252', '#fff4e0'], goods: 'fruit' },
    { x: 200, awning: [b ? '#8a5fd0' : '#2bb3a3', '#fff4e0'], goods: 'bread' },
    { x: 370, awning: ['#e8a13c', '#fff4e0'], goods: 'pots' },
  ];
  for (const stall of stalls) {
    // Awning: striped canopy.
    for (let i = 0; i < 6; i += 1) {
      ctx.fillStyle = stall.awning[i % 2];
      ctx.fillRect(stall.x + i * 23, 216, 23, 26);
    }
    ctx.fillStyle = '#3a2f2f';
    ctx.fillRect(stall.x - 4, 242, 146, 6);
    // Counter and legs.
    ctx.fillStyle = '#6e4525';
    ctx.fillRect(stall.x + 4, 330, 130, 14);
    ctx.fillRect(stall.x + 10, 344, 8, 46);
    ctx.fillRect(stall.x + 120, 344, 8, 46);
    // Back wall.
    ctx.fillStyle = '#4a3a2e';
    ctx.fillRect(stall.x + 4, 248, 130, 82);
  }

  // Hanging lanterns under the awnings; one is missing in B, one changes colour.
  const lanterns = [
    { x: 82, y: 152, color: '#ff5d5d' },
    { x: 132, y: 160, color: '#ffd21f' },
    { x: 262, y: 152, color: b ? '#7ee081' : '#ff5d5d' },
    { x: 312, y: 160, color: '#6ec6ff' },
    { x: 392, y: 158, color: '#ff9de2', missingInB: true },
    { x: 448, y: 150, color: '#ffd21f' },
  ];
  for (const lamp of lanterns) {
    if (b && lamp.missingInB) continue;
    ctx.strokeStyle = '#3a2f2f';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(lamp.x, 242);
    ctx.lineTo(lamp.x, lamp.y - 12);
    ctx.stroke();
    ellipse(ctx, lamp.x, lamp.y, 13, 16, lamp.color);
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.fillRect(lamp.x - 3, lamp.y - 10, 6, 20);
    disc(ctx, lamp.x, lamp.y - 16, 3, '#e8a13c');
    disc(ctx, lamp.x, lamp.y + 17, 3, '#e8a13c');
  }

  // A cat naps on the left stall's roof in panel A only.
  if (!b) {
    ctx.fillStyle = '#1c1c26';
    ellipse(ctx, 118, 210, 22, 10, '#1c1c26');
    disc(ctx, 138, 202, 8, '#1c1c26');
    polygon(
      ctx,
      [
        [133, 196],
        [136, 188],
        [140, 195],
      ],
      '#1c1c26',
    );
    polygon(
      ctx,
      [
        [141, 195],
        [145, 187],
        [147, 196],
      ],
      '#1c1c26',
    );
    ctx.strokeStyle = '#1c1c26';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(98, 210);
    ctx.quadraticCurveTo(88, 200, 96, 192);
    ctx.stroke();
  }

  // Fruit on the left stall, bread on the middle, pots on the right.
  const apple = (ax, ay) => {
    disc(ctx, ax, ay, 8, '#e05252');
    ctx.strokeStyle = '#7fb069';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(ax, ay - 7);
    ctx.lineTo(ax + 3, ay - 12);
    ctx.stroke();
  };
  // Middle stall basket: five apples in A, four in B.
  apple(248, 322);
  apple(268, 316);
  apple(288, 322);
  if (!b) apple(258, 306);
  apple(278, 306);
  // Left stall oranges.
  disc(ctx, 66, 322, 8, '#ff9f1c');
  disc(ctx, 86, 316, 8, '#ff9f1c');
  disc(ctx, 106, 322, 8, '#ff9f1c');
  // Right stall clay pots.
  ctx.fillStyle = '#b4632a';
  polygon(
    ctx,
    [
      [410, 318],
      [434, 318],
      [430, 336],
      [414, 336],
    ],
    '#b4632a',
  );
  polygon(
    ctx,
    [
      [442, 318],
      [466, 318],
      [462, 336],
      [446, 336],
    ],
    '#b4632a',
  );

  // Wooden sign on the right stall: a star in A, a crescent moon in B.
  ctx.fillStyle = '#8a5a33';
  roundedRect(ctx, 404, 252, 68, 34, 6);
  ctx.fill();
  ctx.fillStyle = '#3a2f2f';
  ctx.fillRect(436, 286, 4, 44);
  if (b) {
    disc(ctx, 438, 269, 9, '#ffe9a8');
    disc(ctx, 442, 266, 8, '#8a5a33');
  } else {
    star(ctx, 438, 269, 11, 5, '#ffe9a8');
  }

  // Crates by the right stall; panel B has one extra crate stacked on top.
  ctx.fillStyle = '#a4713a';
  ctx.fillRect(470, 392, 34, 34);
  ctx.fillRect(436, 406, 34, 20);
  ctx.strokeStyle = '#6e4525';
  ctx.lineWidth = 2;
  ctx.strokeRect(470, 392, 34, 34);
  ctx.strokeRect(436, 406, 34, 20);
  if (b) {
    ctx.fillStyle = '#a4713a';
    ctx.fillRect(474, 360, 30, 30);
    ctx.strokeStyle = '#6e4525';
    ctx.strokeRect(474, 360, 30, 30);
  }

  // A sleepy vendor behind the middle stall.
  ctx.fillStyle = '#f2c14e';
  disc(ctx, 270, 292, 14, '#f2c14e');
  ctx.fillStyle = '#e8a13c';
  roundedRect(ctx, 250, 306, 40, 24, 8);
  ctx.fill();
  disc(ctx, 270, 276, 16, '#e8a13c');
  ctx.fillStyle = '#e8a13c';
  ctx.fillRect(252, 288, 36, 6);
}

const MARKET_DIFFS = [
  { id: 'moon', x: 472, y: 64, r: 30, label: 'the moon turned crescent' },
  { id: 'bulb', x: 200, y: 89, r: 16, label: 'a festival bulb went dark' },
  { id: 'lantern-color', x: 262, y: 152, r: 20, label: 'a lantern changed colour' },
  { id: 'lantern-gone', x: 392, y: 158, r: 20, label: 'a lantern is missing' },
  { id: 'cat', x: 118, y: 206, r: 24, label: 'the cat left the roof' },
  { id: 'apples', x: 268, y: 314, r: 24, label: 'an apple is gone from the basket' },
  { id: 'awning', x: 268, y: 229, r: 24, label: 'the middle awning changed colour' },
  { id: 'sign', x: 438, y: 269, r: 22, label: 'the stall sign changed symbol' },
  { id: 'crate', x: 489, y: 375, r: 26, label: 'an extra crate appeared' },
];

/* ------------------------------------------------------------------ */
/* Level 3 — Starlight Garden                                          */
/* ------------------------------------------------------------------ */

function drawGarden(ctx, side) {
  const b = side === 'B';
  const rnd = mulberry32(37);

  // Night sky and stars; one star near the top right only shines in A.
  skyGradient(ctx, 0, 0, W, 340, [
    [0, '#141b3d'],
    [1, '#2a1e4f'],
  ]);
  for (let i = 0; i < 30; i += 1) {
    const sx = 16 + rnd() * 508;
    const sy = 12 + rnd() * 220;
    sparkle(ctx, sx, sy, 1.6 + rnd() * 2.6, 'rgba(255,244,200,0.9)');
  }
  if (!b) sparkle(ctx, 486, 74, 5, '#fff4c8');

  // The moon; panel B has one crater more.
  disc(ctx, 462, 66, 24, '#f4ead2');
  disc(ctx, 454, 58, 5, '#d9cba6');
  disc(ctx, 470, 74, 4, '#d9cba6');
  if (b) disc(ctx, 472, 58, 4, '#d9cba6');

  // Garden ground and a stone wall at the back.
  ctx.fillStyle = '#2c4630';
  ctx.fillRect(0, 330, W, 210);
  ctx.fillStyle = '#3d5a40';
  for (let row = 0; row < 2; row += 1) {
    for (let col = 0; col < 8; col += 1) {
      roundedRect(ctx, 8 + col * 68 + (row % 2) * 30, 300 + row * 18, 58, 14, 5);
      ctx.fill();
    }
  }

  // A big tree on the left with an owl; the owl's eyes are open in A,
  // closed in B.
  ctx.fillStyle = '#4a3220';
  ctx.fillRect(78, 200, 18, 130);
  ctx.strokeStyle = '#4a3220';
  ctx.lineWidth = 10;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(88, 230);
  ctx.lineTo(50, 190);
  ctx.moveTo(88, 250);
  ctx.lineTo(128, 214);
  ctx.stroke();
  disc(ctx, 86, 150, 58, '#2f6b3a');
  disc(ctx, 40, 168, 34, '#2f6b3a');
  disc(ctx, 132, 166, 36, '#2f6b3a');
  disc(ctx, 86, 118, 40, '#3d7a48');
  // Owl on the branch.
  ellipse(ctx, 96, 132, 16, 20, '#6b4a2f');
  disc(ctx, 96, 114, 12, '#6b4a2f');
  polygon(
    ctx,
    [
      [86, 106],
      [88, 98],
      [93, 105],
    ],
    '#6b4a2f',
  );
  polygon(
    ctx,
    [
      [99, 105],
      [104, 98],
      [106, 106],
    ],
    '#6b4a2f',
  );
  if (b) {
    ctx.strokeStyle = '#1c1c26';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(86, 112);
    ctx.lineTo(94, 112);
    ctx.moveTo(98, 112);
    ctx.lineTo(106, 112);
    ctx.stroke();
  } else {
    disc(ctx, 90, 112, 3.4, '#ffd21f');
    disc(ctx, 102, 112, 3.4, '#ffd21f');
    disc(ctx, 90, 112, 1.6, '#1c1c26');
    disc(ctx, 102, 112, 1.6, '#1c1c26');
  }
  polygon(
    ctx,
    [
      [94, 118],
      [98, 118],
      [96, 122],
    ],
    '#e8a13c',
  );

  // Fireflies; one near (306, 158) only glows in panel A.
  const fireflies = [
    [180, 120],
    [240, 90],
    [306, 158],
    [360, 110],
    [420, 180],
    [150, 200],
  ];
  for (const [fx, fy] of fireflies) {
    if (b && fx === 306) continue;
    disc(ctx, fx, fy, 3, '#d8ff7a');
    ctx.fillStyle = 'rgba(216,255,122,0.25)';
    ctx.beginPath();
    ctx.arc(fx, fy, 10, 0, Math.PI * 2);
    ctx.fill();
  }

  // A butterfly over the flower bed in panel A only.
  if (!b) {
    ctx.fillStyle = '#ff9f1c';
    ellipse(ctx, 344, 220, 10, 13, '#ff9f1c');
    ellipse(ctx, 360, 220, 10, 13, '#ff9f1c');
    ellipse(ctx, 346, 234, 8, 9, '#e05252');
    ellipse(ctx, 358, 234, 8, 9, '#e05252');
    ctx.strokeStyle = '#1c1c26';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(352, 214);
    ctx.lineTo(348, 206);
    ctx.moveTo(352, 214);
    ctx.lineTo(356, 206);
    ctx.stroke();
  }

  // Flower bed: tulips and daisies; one tulip is red in A, blue in B.
  const tulip = (tx, ty, color) => {
    ctx.strokeStyle = '#3d7a48';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(tx, ty);
    ctx.lineTo(tx, ty + 26);
    ctx.stroke();
    polygon(
      ctx,
      [
        [tx - 9, ty - 6],
        [tx - 9, ty + 6],
        [tx + 9, ty + 6],
        [tx + 9, ty - 6],
        [tx + 4, ty - 12],
        [tx, ty - 6],
        [tx - 4, ty - 12],
      ],
      color,
    );
  };
  tulip(160, 414, '#e05252');
  tulip(206, 414, b ? '#6ec6ff' : '#e05252');
  tulip(252, 414, '#ffd21f');
  tulip(298, 414, '#ff9de2');
  tulip(344, 414, '#e05252');
  const daisy = (dx, dy) => {
    for (let p = 0; p < 6; p += 1) {
      const a = (p * Math.PI) / 3;
      disc(ctx, dx + Math.cos(a) * 7, dy + Math.sin(a) * 7, 4, '#fff4e0');
    }
    disc(ctx, dx, dy, 5, '#ffd21f');
  };
  daisy(120, 448);
  daisy(392, 448);
  daisy(452, 420);

  // Mushrooms; three spots in A, two in B.
  const mushroom = (mx, my, s) => {
    ctx.fillStyle = '#fff4e0';
    ctx.fillRect(mx - 4 * s, my, 8 * s, 12 * s);
    ctx.fillStyle = '#e05252';
    ctx.beginPath();
    ctx.arc(mx, my, 16 * s, Math.PI, 0);
    ctx.fill();
    ctx.fillStyle = '#fff4e0';
    disc(ctx, mx - 7 * s, my - 7 * s, 2.4 * s, '#fff4e0');
    disc(ctx, mx + 6 * s, my - 10 * s, 2.4 * s, '#fff4e0');
    if (!b) disc(ctx, mx + 1 * s, my - 4 * s, 2.4 * s, '#fff4e0');
  };
  mushroom(428, 392, 1);
  mushroom(470, 404, 0.7);

  // A watering can by the flower bed in panel A only.
  if (!b) {
    ctx.fillStyle = '#6ec6ff';
    roundedRect(ctx, 104, 300, 34, 24, 5);
    ctx.fill();
    polygon(
      ctx,
      [
        [104, 308],
        [84, 296],
        [88, 306],
        [104, 316],
      ],
      '#6ec6ff',
    );
    ctx.strokeStyle = '#6ec6ff';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(140, 312, 10, -Math.PI / 2, Math.PI / 2);
    ctx.stroke();
  }

  // The pond with a lily pad; the frog sits on it in panel A only.
  ellipse(ctx, 380, 470, 112, 34, '#2f7f9e');
  ellipse(ctx, 380, 470, 96, 26, '#3d94b5');
  ellipse(ctx, 352, 462, 26, 10, '#3d7a48');
  if (!b) {
    disc(ctx, 392, 452, 12, '#7fb069');
    disc(ctx, 386, 440, 5, '#7fb069');
    disc(ctx, 398, 440, 5, '#7fb069');
    disc(ctx, 384, 438, 2.4, '#1c1c26');
    disc(ctx, 396, 438, 2.4, '#1c1c26');
    ctx.strokeStyle = '#1c1c26';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.arc(390, 446, 4, 0.15 * Math.PI, 0.85 * Math.PI);
    ctx.stroke();
  }

  // Stepping stones over the grass; panel B has one stone more.
  const stones = [
    [190, 490],
    [250, 486],
    [310, 480],
  ];
  for (const [sx, sy] of stones) ellipse(ctx, sx, sy, 20, 8, '#8d99ae');
  if (b) ellipse(ctx, 280, 500, 20, 8, '#8d99ae');

  // A snail crossing the lawn in panel A only.
  if (!b) {
    disc(ctx, 152, 446, 10, '#c98f5f');
    ctx.strokeStyle = '#8a5a33';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.arc(152, 446, 6, 0, Math.PI * 2);
    ctx.stroke();
    disc(ctx, 164, 440, 4, '#e8c39a');
    ctx.strokeStyle = '#e8c39a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(164, 436);
    ctx.lineTo(162, 430);
    ctx.moveTo(166, 436);
    ctx.lineTo(166, 430);
    ctx.stroke();
  }

  // Fireflies drift low too, plus a few grass blades for texture.
  ctx.strokeStyle = 'rgba(127,176,105,0.8)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 12; i += 1) {
    const gx = 30 + rnd() * 480;
    const gy = 500 + rnd() * 26;
    ctx.beginPath();
    ctx.moveTo(gx, gy);
    ctx.lineTo(gx + 3, gy - 9);
    ctx.stroke();
  }
}

const GARDEN_DIFFS = [
  { id: 'owl-eyes', x: 96, y: 112, r: 20, label: 'the owl closed its eyes' },
  { id: 'firefly', x: 306, y: 158, r: 18, label: 'a firefly went out' },
  { id: 'tulip', x: 206, y: 408, r: 20, label: 'a tulip changed colour' },
  { id: 'mushroom', x: 428, y: 388, r: 22, label: 'a mushroom lost a spot' },
  { id: 'snail', x: 152, y: 442, r: 20, label: 'the snail crawled away' },
  { id: 'butterfly', x: 352, y: 222, r: 22, label: 'the butterfly flew off' },
  { id: 'frog', x: 392, y: 448, r: 22, label: 'the frog hopped away' },
  { id: 'stone', x: 280, y: 500, r: 20, label: 'an extra stepping stone appeared' },
  { id: 'watering-can', x: 118, y: 310, r: 22, label: 'the watering can vanished' },
  { id: 'star', x: 486, y: 74, r: 18, label: 'a star went out' },
  { id: 'crater', x: 472, y: 58, r: 16, label: 'the moon grew a crater' },
];

/* ------------------------------------------------------------------ */
/* The level list                                                      */
/* ------------------------------------------------------------------ */

/** Every level: its name, time limit, seed and the spots that differ. */
export const LEVELS = [
  {
    id: 'harbor',
    name: 'Harbor at Dawn',
    subtitle: 'Sunrise over the little fishing harbor',
    seconds: 150,
    diffs: HARBOR_DIFFS,
    draw: drawHarbor,
  },
  {
    id: 'market',
    name: 'Lantern Market',
    subtitle: 'A night market under strings of light',
    seconds: 150,
    diffs: MARKET_DIFFS,
    draw: drawMarket,
  },
  {
    id: 'garden',
    name: 'Starlight Garden',
    subtitle: 'Fireflies, frogs and a sleepy owl',
    seconds: 180,
    diffs: GARDEN_DIFFS,
    draw: drawGarden,
  },
];

/** The scene is 540 by 540 in both panels. */
export const SCENE_SIZE = 540;
