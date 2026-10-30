/* Love Wrapped 🎧 — a Spotify-Wrapped-style love story. Plain HTML/CSS/JS + canvas. Made by @hack.n.code */
(() => {
'use strict';
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const Q = new URLSearchParams(location.search);
const clean = (s, n) => (s || '').replace(/[<>]/g, '').trim().slice(0, n);
const NAME = clean(Q.get('name'), 20) || 'my love';
const MEMORY = clean(Q.get('memory'), 40);
const DEMO = Q.get('demo') === '1';
const now = () => performance.now();
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const ease = t => 1 - Math.pow(1 - clamp(t, 0, 1), 3);
const lerp = (a, b, t) => a + (b - a) * t;
let seed = 20261031;
const rnd = () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const DPR = () => Math.min(window.devicePixelRatio || 1, 3);

$$('[data-name]').forEach(e => e.textContent = NAME);
window.__demo = DEMO ? 'intro' : '';
if (DEMO) document.getElementById('musicBtn').textContent = '🔊';

/* ---------------- data ---------------- */
const SONGS = [
  [MEMORY || 'Our first call – 3:12 AM', 'played 1,000+ times', '📞', 'linear-gradient(135deg,#1ed760,#0a7d3b)'],
  ['That one smile', 'on repeat in my head', '😊', 'linear-gradient(135deg,#ff3ea5,#8b5cff)'],
  ['Late night chai', 'our best duet ☕', '☕', 'linear-gradient(135deg,#ffb03e,#ff5e3a)'],
  ['Your good morning texts', 'my daily mix', '🌅', 'linear-gradient(135deg,#ffe14d,#ff7ac8)'],
  ['Our long walks', 'slow & perfect', '🌙', 'linear-gradient(135deg,#3ee8ff,#5b5cff)'],
];
const MIX = [['Butterflies 🦋', 42, '#1ed760'], ['Inside jokes 😂', 28, '#ff3ea5'], ['Forehead kisses 😚', 18, '#8b5cff'], ['Chai dates ☕', 12, '#ffb03e']];
const MONTHS = 'JFMAMJJASOND'.split('');
const VALS = [30, 36, 41, 47, 52, 58, 63, 69, 74, 80, 86, 130];
const LYRICS = ['Every song I hear sounds like you 🎶', 'Your laugh is my favourite melody', 'I keep you on repeat, every day', 'You are my forever playlist 💚', 'Same song, same us, always 🎧', 'Press play on forever with me'];
const THEMES = [ // blob colours per scene
  ['#1ed760', '#8b5cff', '#ff3ea5', '#0f3d2a'], // intro
  ['#ff7a3e', '#ff3ea5', '#ffd23f', '#3d1020'], // minutes
  ['#1ed760', '#3ee8ff', '#0aa860', '#08281c'], // artist
  ['#8b5cff', '#5b5cff', '#ff3ea5', '#1a1240'], // top5
  ['#ff3ea5', '#ff7ac8', '#a12bff', '#3a0a2a'], // genre
  ['#ffd23f', '#ff7a3e', '#ff3ea5', '#3a2408'], // personality
  ['#3ee8ff', '#1ed760', '#5b5cff', '#08263a'], // chart
  ['#ff4d6d', '#ff9ad5', '#ffb03e', '#3a0a16'], // moment
  ['#1ed760', '#0aa860', '#8b5cff', '#071c12'], // player
  ['#1ed760', '#ff3ea5', '#ffd23f', '#14102a'], // finale
];
const hex = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const THEME_RGB = THEMES.map(t => t.map(hex));

/* ---------------- canvases ---------------- */
const bg = $('#bg'), bctx = bg.getContext('2d');
const fx = $('#fx'), fctx = fx.getContext('2d');
let W = 0, H = 0;
function fit(cv, w, h) { const d = DPR(); cv.width = Math.round(w * d); cv.height = Math.round(h * d); const c = cv.getContext('2d'); c.setTransform(d, 0, 0, d, 0, 0); return c; }
function resize() {
  W = innerWidth; H = innerHeight;
  fit(bg, W, H); fit(fx, W, H);
  sizeVinyls(); drawPolaroid(); sizeWave();
}

/* background: drifting neon gradient blobs that blend between scene themes */
let themeFrom = 0, themeTo = 0, themeT0 = 0;
const curCol = THEME_RGB[0].map(c => c.slice());
function setTheme(i) { themeFrom = -1; themeTo = i; themeT0 = now(); for (let k = 0; k < 4; k++) startCol[k] = curCol[k].slice(); }
const startCol = THEME_RGB[0].map(c => c.slice());
function drawBg(t) {
  const k = ease((now() - themeT0) / 900);
  for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) curCol[i][j] = lerp(startCol[i][j], THEME_RGB[themeTo][i][j], k);
  const base = curCol[3];
  bctx.globalCompositeOperation = 'source-over';
  bctx.fillStyle = `rgb(${base[0] * .35 | 0},${base[1] * .35 | 0},${base[2] * .35 | 0})`;
  bctx.fillRect(0, 0, W, H);
  bctx.fillStyle = 'rgba(7,7,13,.55)'; bctx.fillRect(0, 0, W, H);
  bctx.globalCompositeOperation = 'lighter';
  const s = t / 1000, R = Math.max(W, H);
  const blobs = [[.2 + .18 * Math.sin(s * .5), .2 + .12 * Math.cos(s * .4), .55, 0], [.85 + .12 * Math.cos(s * .45), .35 + .15 * Math.sin(s * .6), .5, 1], [.3 + .2 * Math.cos(s * .35), .85 + .1 * Math.sin(s * .5), .6, 2], [.75 + .15 * Math.sin(s * .3), .9 + .08 * Math.cos(s * .7), .45, 0]];
  for (const [x, y, r, ci] of blobs) {
    const c = curCol[ci], g = bctx.createRadialGradient(x * W, y * H, 0, x * W, y * H, r * R);
    g.addColorStop(0, `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},.55)`); g.addColorStop(.5, `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},.16)`); g.addColorStop(1, 'rgba(0,0,0,0)');
    bctx.fillStyle = g; bctx.fillRect(0, 0, W, H);
  }
  bctx.globalCompositeOperation = 'source-over';
  // subtle star dust
  bctx.fillStyle = 'rgba(255,255,255,.5)';
  for (let i = 0; i < 40; i++) { const x = (i * 97.3 % 1) * W || (i * 53 % W), y = ((i * 0.618 * 1000) % H), a = .2 + .3 * Math.sin(s * 2 + i); bctx.globalAlpha = Math.max(0, a); bctx.fillRect((i * 137) % W, y, 2, 2); }
  bctx.globalAlpha = 1;
}

/* vinyl record with a heart label */
const vinyls = [$('#vinyl1'), $('#vinyl2')].map(cv => ({ cv, ctx: null, s: 0 }));
function sizeVinyls() {
  for (const v of vinyls) {
    let w = v.cv.parentElement.clientWidth, h = v.cv.parentElement.clientHeight;
    if (v.cv.id === 'vinyl2') { const s = Math.max(100, Math.min(w, h, 420)); v.cv.style.width = s + 'px'; v.cv.style.height = s + 'px'; w = h = s; }
    v.s = Math.max(60, Math.min(w, h)); v.ctx = fit(v.cv, v.s, v.s);
  }
}
function heartPath(c, x, y, s) { c.beginPath(); c.moveTo(x, y + s * .3); c.bezierCurveTo(x, y, x - s * .5, y - s * .05, x - s * .5, y + s * .3); c.bezierCurveTo(x - s * .5, y + s * .6, x - s * .1, y + s * .8, x, y + s * .98); c.bezierCurveTo(x + s * .1, y + s * .8, x + s * .5, y + s * .6, x + s * .5, y + s * .3); c.bezierCurveTo(x + s * .5, y - s * .05, x, y, x, y + s * .3); c.closePath(); }
function drawVinyl(v, ang, arm) {
  const c = v.ctx, S = v.s; if (!c) return; c.clearRect(0, 0, S, S);
  const cx = S / 2, cy = S / 2, R = S * .47;
  c.save(); c.shadowColor = 'rgba(30,215,96,.55)'; c.shadowBlur = S * .08;
  c.beginPath(); c.arc(cx, cy, R, 0, 7); c.fillStyle = '#0b0b0f'; c.fill(); c.restore();
  const g = c.createRadialGradient(cx, cy, R * .3, cx, cy, R); g.addColorStop(0, '#1c1c22'); g.addColorStop(1, '#050507'); c.fillStyle = g; c.beginPath(); c.arc(cx, cy, R, 0, 7); c.fill();
  c.lineWidth = 1;
  for (let r = R * .38; r < R * .98; r += S * .012) { c.strokeStyle = `rgba(255,255,255,${.04 + .03 * Math.sin(r)})`; c.beginPath(); c.arc(cx, cy, r, 0, 7); c.stroke(); }
  c.save(); c.translate(cx, cy); c.rotate(ang);
  // sheen that rotates with the record
  for (const a0 of [0, Math.PI]) { const sg = c.createLinearGradient(0, -R, 0, R); c.beginPath(); c.moveTo(0, 0); c.arc(0, 0, R * .97, a0 - .35, a0 + .35); c.closePath(); c.fillStyle = 'rgba(255,255,255,.07)'; c.fill(); }
  // label
  const lr = R * .34, lg = c.createLinearGradient(-lr, -lr, lr, lr); lg.addColorStop(0, '#1ed760'); lg.addColorStop(.55, '#7cffb2'); lg.addColorStop(1, '#ff3ea5');
  c.beginPath(); c.arc(0, 0, lr, 0, 7); c.fillStyle = lg; c.fill();
  c.fillStyle = '#ff2e63'; heartPath(c, 0, -lr * .55, lr * 1.0); c.fill();
  c.fillStyle = '#fff'; c.font = `900 ${Math.max(10, lr * .26)}px Poppins,sans-serif`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('YOU', 0, -lr * .02);
  c.fillStyle = '#111'; c.font = `800 ${Math.max(8, lr * .17)}px Poppins,sans-serif`; c.fillText('LOVE WRAPPED', 0, lr * .68);
  c.beginPath(); c.arc(0, 0, S * .012 + 2, 0, 7); c.fillStyle = '#050507'; c.fill();
  c.restore();
  if (arm) { // tonearm
    c.save(); c.translate(S * .9, S * .1); c.rotate(.32 * Math.min(1, arm));
    c.strokeStyle = '#d9d9e3'; c.lineWidth = S * .025; c.lineCap = 'round'; c.beginPath(); c.moveTo(0, 0); c.lineTo(0, S * .42); c.lineTo(-S * .05, S * .5); c.stroke();
    c.fillStyle = '#9a9aa8'; c.fillRect(-S * .07, S * .48, S * .07, S * .08);
    c.beginPath(); c.arc(0, 0, S * .045, 0, 7); c.fillStyle = '#c8c8d4'; c.fill(); c.restore();
  }
}

/* polaroid: the day we met (sunset, two people, a heart) */
function drawPolaroid() {
  const cv = $('#polCv'); const w = cv.clientWidth || 280; const c = fit(cv, w, w);
  const sky = c.createLinearGradient(0, 0, 0, w); sky.addColorStop(0, '#3b1f6e'); sky.addColorStop(.45, '#ff6f91'); sky.addColorStop(.7, '#ffc46b'); sky.addColorStop(1, '#ff9a5a');
  c.fillStyle = sky; c.fillRect(0, 0, w, w);
  const sg = c.createRadialGradient(w * .5, w * .64, 0, w * .5, w * .64, w * .22); sg.addColorStop(0, '#fff6c8'); sg.addColorStop(.5, '#ffd36b'); sg.addColorStop(1, 'rgba(255,190,90,0)'); c.fillStyle = sg; c.beginPath(); c.arc(w * .5, w * .64, w * .22, 0, 7); c.fill();
  c.fillStyle = '#2b1b3d'; c.fillRect(0, w * .7, w, w * .3);
  c.fillStyle = 'rgba(255,214,140,.5)'; for (let i = 0; i < 7; i++) c.fillRect(w * (.3 + i * .06), w * (.73 + i * .03), w * (.4 - i * .05), 2);
  c.fillStyle = 'rgba(255,255,255,.85)'; for (let i = 0; i < 14; i++) c.fillRect((i * 71 % 100) / 100 * w, (i * 37 % 30) / 100 * w, 2, 2);
  // two silhouettes holding hands
  const person = (x, hair) => { c.fillStyle = '#1a0f26'; c.beginPath(); c.arc(x, w * .5, w * .045, 0, 7); c.fill(); c.beginPath(); c.moveTo(x - w * .05, w * .72); c.quadraticCurveTo(x - w * .06, w * .56, x, w * .55); c.quadraticCurveTo(x + w * .06, w * .56, x + w * .05, w * .72); c.fill(); if (hair) { c.beginPath(); c.ellipse(x + w * .02, w * .53, w * .03, w * .06, .3, 0, 7); c.fill(); } };
  person(w * .42, false); person(w * .58, true);
  c.strokeStyle = '#1a0f26'; c.lineWidth = w * .02; c.lineCap = 'round'; c.beginPath(); c.moveTo(w * .46, w * .6); c.quadraticCurveTo(w * .5, w * .65, w * .54, w * .6); c.stroke();
  c.fillStyle = '#ff2e63'; c.shadowColor = '#ff2e63'; c.shadowBlur = 16; heartPath(c, w * .5, w * .3, w * .12); c.fill(); c.shadowBlur = 0;
  c.fillStyle = 'rgba(255,255,255,.9)'; c.font = `700 ${w * .06}px Poppins,sans-serif`; c.textAlign = 'right'; c.fillText('day 1', w * .95, w * .08);
}

/* waveform */
const wave = $('#wave'); let wctx = null, WW = 0, WH = 0;
function sizeWave() { WW = wave.clientWidth || 300; WH = wave.clientHeight || 56; wctx = fit(wave, WW, WH); }
function drawWave(t, amp, prog) {
  if (!wctx) return; wctx.clearRect(0, 0, WW, WH);
  const n = Math.max(24, Math.floor(WW / 9)), bw = WW / n;
  for (let i = 0; i < n; i++) {
    const base = .25 + .75 * Math.abs(Math.sin(i * .61) * Math.cos(i * .23 + 1));
    const live = Math.abs(Math.sin(i * .7 + t * .006) * Math.sin(i * .19 + t * .0037));
    const h = Math.max(4, WH * (base * .45 + amp * live * .55));
    wctx.fillStyle = i / n < prog ? '#1ed760' : 'rgba(255,255,255,.35)';
    const x = i * bw + bw * .2, y = (WH - h) / 2; const r = Math.min(3, bw * .3);
    wctx.beginPath(); wctx.roundRect ? wctx.roundRect(x, y, bw * .6, h, r) : wctx.rect(x, y, bw * .6, h); wctx.fill();
  }
}

/* ---------------- FX: confetti & hearts ---------------- */
const parts = [];
const CONF = ['#1ed760', '#7cffb2', '#ff3ea5', '#ffd23f', '#8b5cff', '#3ee8ff', '#ffffff'];
function burstHearts(x, y, n = 28) { for (let i = 0; i < n; i++) { const a = rnd() * Math.PI * 2, sp = 3 + rnd() * 7; parts.push({ k: 'h', x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 4, s: 14 + rnd() * 18, r: rnd() * .6 - .3, vr: (rnd() - .5) * .1, c: ['#ff2e63', '#ff3ea5', '#1ed760', '#ff7ac8', '#ffd23f'][i % 5], life: 1, d: .012 + rnd() * .01 }); } }
function confetti(n = 140, fromTop = true) { for (let i = 0; i < n; i++) { const x = fromTop ? rnd() * W : W / 2, y = fromTop ? -20 - rnd() * H * .5 : H * .45; const a = rnd() * Math.PI * 2, sp = fromTop ? 0 : 6 + rnd() * 10; parts.push({ k: rnd() < .18 ? 'h' : 'c', x, y, vx: fromTop ? (rnd() - .5) * 3 : Math.cos(a) * sp, vy: fromTop ? 2 + rnd() * 4 : Math.sin(a) * sp - 6, s: 8 + rnd() * 10, r: rnd() * 6, vr: (rnd() - .5) * .3, c: CONF[i % CONF.length], life: 1, d: .003 + rnd() * .003 }); } }
function stepFx(dt) {
  fctx.clearRect(0, 0, W, H); const f = dt / 16.67;
  for (let i = parts.length - 1; i >= 0; i--) {
    const p = parts[i];
    p.vy += (p.k === 'h' && p.d > .01 ? .18 : .12) * f; p.vx *= Math.pow(.985, f); p.x += p.vx * f; p.y += p.vy * f; p.r += p.vr * f; p.life -= p.d * f;
    if (p.k === 'c') { p.vy = Math.min(p.vy, 4.5); p.x += Math.sin(p.r) * .6 * f; }
    if (p.life <= 0 || p.y > H + 40) { parts.splice(i, 1); continue; }
    fctx.save(); fctx.globalAlpha = clamp(p.life * 1.6, 0, 1); fctx.translate(p.x, p.y); fctx.rotate(p.r); fctx.fillStyle = p.c;
    if (p.k === 'h') { heartPath(fctx, 0, -p.s / 2, p.s); fctx.fill(); }
    else { fctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2 * (.5 + .5 * Math.abs(Math.cos(p.r * 2)))); }
    fctx.restore();
  }
}

/* ---------------- sound: WebAudio synth ---------------- */
let AC = null, master = null, musicOn = false, schedT = 0, step = 0, schedTimer = null;
const mtof = m => 440 * Math.pow(2, (m - 69) / 12);
function ensureAudio() {
  if (AC) return AC;
  const C = window.AudioContext || window.webkitAudioContext; if (!C) return null;
  AC = new C(); master = AC.createGain(); master.gain.value = 0;
  const comp = AC.createDynamicsCompressor(); master.connect(comp); comp.connect(AC.destination);
  return AC;
}
function note(m, t, dur, type, vol, cut) {
  const o = AC.createOscillator(), g = AC.createGain(), f = AC.createBiquadFilter();
  o.type = type; o.frequency.value = mtof(m); f.type = 'lowpass'; f.frequency.value = cut || 2000;
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + (type === 'triangle' && dur > 1 ? .35 : .01)); g.gain.exponentialRampToValueAtTime(.0005, t + dur);
  o.connect(f); f.connect(g); g.connect(master); o.start(t); o.stop(t + dur + .05);
}
const PROG = [[60, 64, 67, 71], [57, 60, 64, 67], [53, 57, 60, 64], [55, 59, 62, 67]]; // Cmaj7 Am7 Fmaj7 G
const BEAT = 60 / 76;
function schedule() {
  if (!AC) return;
  while (schedT < AC.currentTime + .3) {
    const bar = Math.floor(step / 8) % 4, ch = PROG[bar], e = step % 8, t = schedT;
    if (e === 0) { ch.forEach(n => { note(n - 12, t, BEAT * 4.2, 'triangle', .05, 1100); note(n - 12 + .07, t, BEAT * 4.2, 'triangle', .03, 900); }); note(ch[0] - 24, t, BEAT * 3.5, 'sine', .12, 400); }
    const arp = [0, 2, 1, 3, 2, 1, 3, 2][e]; note(ch[arp] + 12, t, .9, 'sine', .045, 3000);
    if (e === 0 || e === 4) kick(t);
    if (e % 2 === 1) hat(t);
    schedT += BEAT / 2; step++;
  }
}
function kick(t) { const o = AC.createOscillator(), g = AC.createGain(); o.frequency.setValueAtTime(110, t); o.frequency.exponentialRampToValueAtTime(42, t + .18); g.gain.setValueAtTime(.18, t); g.gain.exponentialRampToValueAtTime(.001, t + .3); o.connect(g); g.connect(master); o.start(t); o.stop(t + .32); }
let noiseBuf = null;
function noise() { if (!noiseBuf) { noiseBuf = AC.createBuffer(1, AC.sampleRate * .5, AC.sampleRate); const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; } const s = AC.createBufferSource(); s.buffer = noiseBuf; return s; }
function hat(t) { const s = noise(), f = AC.createBiquadFilter(), g = AC.createGain(); f.type = 'highpass'; f.frequency.value = 7000; g.gain.setValueAtTime(.025, t); g.gain.exponentialRampToValueAtTime(.001, t + .05); s.connect(f); f.connect(g); g.connect(master); s.start(t); s.stop(t + .06); }
function sfx(kind) {
  if (!AC || !musicOn) return; const t = AC.currentTime;
  if (kind === 'tap') { note(84, t, .25, 'sine', .08, 5000); note(91, t + .04, .25, 'sine', .05, 5000); }
  if (kind === 'whoosh') { const s = noise(), f = AC.createBiquadFilter(), g = AC.createGain(); f.type = 'bandpass'; f.Q.value = 1.2; f.frequency.setValueAtTime(400, t); f.frequency.exponentialRampToValueAtTime(3500, t + .3); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.12, t + .08); g.gain.exponentialRampToValueAtTime(.001, t + .38); s.connect(f); f.connect(g); g.connect(master); s.start(t); s.stop(t + .4); }
  if (kind === 'pop') { [76, 81, 88].forEach((m, i) => note(m, t + i * .06, .35, 'triangle', .09, 6000)); }
  if (kind === 'win') { [72, 76, 79, 84, 88].forEach((m, i) => note(m, t + i * .09, .8, 'triangle', .07, 6000)); }
}
function setMusic(on) {
  if (on && !ensureAudio()) return;
  musicOn = on; $('#musicBtn').textContent = on ? '🔊' : '🔇';
  if (!AC) return;
  if (on) { AC.resume(); if (schedT < AC.currentTime) schedT = AC.currentTime + .05; if (!schedTimer) schedTimer = setInterval(schedule, 60); master.gain.cancelScheduledValues(AC.currentTime); master.gain.linearRampToValueAtTime(.7, AC.currentTime + .6); }
  else { master.gain.cancelScheduledValues(AC.currentTime); master.gain.linearRampToValueAtTime(0, AC.currentTime + .3); }
}
let musicTouched = false;
$('#musicBtn').addEventListener('click', e => { e.stopPropagation(); musicTouched = true; setMusic(!musicOn); });

/* ---------------- screens ---------------- */
let screen = 'intro';
function show(id) { $$('.screen').forEach(s => s.classList.toggle('show', s.id === id)); screen = id; document.body.classList.toggle('fin', id === 'finale'); }
function tapFx(el) { const r = el.getBoundingClientRect(); const d = document.createElement('div'); d.className = 'tap'; d.style.left = (r.left + r.width / 2) + 'px'; d.style.top = (r.top + r.height / 2) + 'px'; $('#taps').appendChild(d); setTimeout(() => d.remove(), 800); }

/* story */
const slides = $$('.slide'); const NS = slides.length;
const DUR = DEMO ? [3400, 3100, 3600, 3000, 3200, 3300, 3300] : [5200, 5000, 6500, 5200, 5600, 5600, 5800];
let si = 0, slideT0 = 0, paused = false, pausedAt = 0;
$('#sbar').innerHTML = slides.map(() => '<div class="seg"><i></i></div>').join('');
const segs = $$('#sbar .seg i');
$('#top5').innerHTML = SONGS.map((s, i) => `<li style="--d:${(.45 + i * .2).toFixed(2)}s"><span class="n">${i + 1}</span><span class="art" style="background:${s[3]}">${s[2]}</span><span><div class="ti"></div><div class="su">${s[1]}</div></span></li>`).join('');
$$('#top5 .ti').forEach((e, i) => e.textContent = SONGS[i][0]);
$('#mix').innerHTML = MIX.map((m, i) => `<div class="mx-row" style="--d:${(.9 + i * .15).toFixed(2)}s"><b style="--w:${Math.round(m[1] / 42 * 100)}%;--d2:${(1.0 + i * .15).toFixed(2)}s;background:linear-gradient(90deg,${m[2]},${m[2]}99)"></b><span><em style="font-style:normal">${m[0]}</em><em style="font-style:normal">${m[1]}%</em></span></div>`).join('');
$('#chart').innerHTML = VALS.map((v, i) => `<div class="bar${i === 11 ? ' big' : ''}"><div class="col">${i === 11 ? '<span class="inf">∞ 💚</span>' : ''}</div><span class="ml">${MONTHS[i]}</span></div>`).join('');
const cols = $$('#chart .col');
if (MEMORY) $('#cardSong').textContent = MEMORY;

function goSlide(i) {
  si = i; slideT0 = now(); paused = false;
  slides.forEach((s, k) => s.classList.toggle('on', k === i));
  setTheme(1 + i); sfx('whoosh');
  window.__demo = DEMO ? 'story-' + i : window.__demo;
}
function startStory() { show('story'); goSlide(0); $('#tapHint').style.opacity = 1; }
function next() { $('#tapHint').style.opacity = 0; if (si < NS - 1) goSlide(si + 1); else startPlayer(); }
function prev() { goSlide(Math.max(0, si - 1)); }
let downT = 0, holdTimer = 0, held = false;
const sl = $('#slides');
sl.addEventListener('pointerdown', e => { if (screen !== 'story') return; downT = now(); held = false; holdTimer = setTimeout(() => { held = true; paused = true; pausedAt = now(); }, 260); });
sl.addEventListener('pointerup', e => {
  if (screen !== 'story') return; clearTimeout(holdTimer);
  if (held) { slideT0 += now() - pausedAt; paused = false; return; }
  const r = sl.getBoundingClientRect(); if (e.clientX - r.left < r.width * .33) prev(); else next();
});
sl.addEventListener('pointercancel', () => { clearTimeout(holdTimer); if (held) { slideT0 += now() - pausedAt; paused = false; } });
addEventListener('keydown', e => { if (screen === 'story') { if (e.key === 'ArrowRight' || e.key === ' ') next(); if (e.key === 'ArrowLeft') prev(); } });

function updateStory(t) {
  const el = now() - slideT0;
  segs.forEach((s, k) => s.style.width = (k < si ? 100 : k > si ? 0 : clamp(el / DUR[si], 0, 1) * 100) + '%');
  if (si === 0) { const v = Math.round(525600 * ease((el - 350) / 1900)); $('#minCount').textContent = v.toLocaleString('en-US'); }
  if (si === 1 || screen === 'story') drawVinyl(vinyls[0], t * .0012, 0);
  if (si === 5) { cols.forEach((c, k) => { const p = ease((el - 350 - k * 90) / 900); c.style.height = (Math.min(1, VALS[k] / 130) * 100 * p) + '%'; }); }
  if (!paused && el >= DUR[si]) next();
}

/* player */
let playing = true, liked = false, songT = 72, plT0 = 0, lastT = 0, lineH = 0;
const lyr = $('#lyrics'); lyr.innerHTML = '<div class="lyr-in">' + LYRICS.map(l => `<div class="ly"></div>`).join('') + '</div>';
$$('#lyrics .ly').forEach((e, i) => e.textContent = LYRICS[i]);
const lyrIn = $('#lyrics .lyr-in'), lys = $$('#lyrics .ly');
const LINE = 1900; let lyrPos = 0;
function startPlayer() { show('player'); setTheme(8); window.__demo = DEMO ? 'player' : window.__demo; plT0 = now(); playing = true; $('#playBtn').textContent = '⏸'; liked = false; $('#likeBtn').textContent = '🤍'; $('#likeBtn').classList.remove('on'); lyrPos = 0; requestAnimationFrame(() => { sizeVinyls(); sizeWave(); }); sfx('whoosh'); }
$('#playBtn').addEventListener('click', () => { playing = !playing; $('#playBtn').textContent = playing ? '⏸' : '▶'; sfx('tap'); });
$('#likeBtn').addEventListener('click', () => doLike());
function doLike() { const b = $('#likeBtn'); liked = !liked; b.textContent = liked ? '💚' : '🤍'; b.classList.remove('on'); void b.offsetWidth; b.classList.add('on'); if (liked) { const r = b.getBoundingClientRect(); burstHearts(r.left + r.width / 2, r.top + r.height / 2, 34); sfx('pop'); } }
$('#prevSong').addEventListener('click', () => { lyrPos = 0; songT = 72; sfx('tap'); });
$('#nextSong').addEventListener('click', () => { lyrPos = (Math.floor(lyrPos / LINE) + 1) % LYRICS.length * LINE; sfx('tap'); });
$('#toCard').addEventListener('click', () => startFinale());
let ang2 = 0, armP = 0;
function updatePlayer(t, dt) {
  if (playing) { lyrPos += dt; songT += dt / 1000; ang2 += dt * .0016; }
  armP = lerp(armP, playing ? 1 : 0, .08);
  drawVinyl(vinyls[1], ang2, .001 + armP);
  drawWave(t, playing ? 1 : .15, (songT % 225) / 225);
  const s = Math.floor(songT) % 225; $('#tNow').textContent = Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
  const li = Math.floor(lyrPos / LINE) % LYRICS.length, p = (lyrPos % LINE) / (LINE * .85);
  lys.forEach((e, k) => e.style.setProperty('--p', (k < li ? 100 : k > li ? 0 : clamp(p, 0, 1) * 100) + '%'));
  lineH = lys[0].offsetHeight || 40; const boxH = lyr.clientHeight;
  lyrIn.style.transform = `translateY(${boxH / 2 - lineH * (li + .5)}px)`;
}

/* finale */
let finT0 = 0, rainUntil = 0;
function startFinale() { show('finale'); setTheme(9); finT0 = now(); window.__demo = DEMO ? 'finale' : window.__demo; seed = 777; confetti(170, true); setTimeout(() => { confetti(90, false); sfx('win'); }, 700); rainUntil = now() + 4200; }
function updateFinale() { const el = now() - finT0; if (now() < rainUntil && Math.floor(el / 300) !== Math.floor((el - 17) / 300)) confetti(10, true); }
$('#replayBtn').addEventListener('click', () => { parts.length = 0; startStory(); });
$('#startBtn').addEventListener('click', () => { if (!musicTouched && !DEMO) setMusic(true); sfx('tap'); startStory(); });

/* card PNG */
function wrapText(c, text, x, y, maxW, lh) { const words = text.split(' '); let line = '', yy = y; for (const w of words) { const t = line ? line + ' ' + w : w; if (c.measureText(t).width > maxW && line) { c.fillText(line, x, yy); line = w; yy += lh; } else line = t; } c.fillText(line, x, yy); return yy; }
function rr(c, x, y, w, h, r) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
function cardPNG() {
  const cv = document.createElement('canvas'); cv.width = 1080; cv.height = 1350; const c = cv.getContext('2d');
  const g = c.createLinearGradient(0, 0, 1080, 1350); g.addColorStop(0, '#1b1240'); g.addColorStop(.6, '#0f2a1c'); g.addColorStop(1, '#2a0f2a'); c.fillStyle = g; c.fillRect(0, 0, 1080, 1350);
  for (const [x, y, r, col] of [[150, 150, 600, '124,255,178'], [980, 1250, 650, '255,62,165'], [900, 300, 380, '139,92,255']]) { const rg = c.createRadialGradient(x, y, 0, x, y, r); rg.addColorStop(0, `rgba(${col},.55)`); rg.addColorStop(1, `rgba(${col},0)`); c.fillStyle = rg; c.fillRect(0, 0, 1080, 1350); }
  c.strokeStyle = 'rgba(124,255,178,.7)'; c.lineWidth = 8; rr(c, 30, 30, 1020, 1290, 60); c.stroke();
  c.textBaseline = 'alphabetic'; c.fillStyle = '#1ed760'; c.font = '900 46px Poppins,sans-serif'; c.fillText('🎧 LOVE WRAPPED', 90, 140); c.textAlign = 'right'; c.fillText('2026', 990, 140); c.textAlign = 'left';
  c.fillStyle = '#ffd23f'; c.font = '900 92px Poppins,sans-serif'; let y = wrapText(c, NAME + "'s", 90, 270, 900, 96);
  c.fillStyle = '#fff'; c.font = '900 72px Poppins,sans-serif'; c.fillText('year in love', 90, y + 86);
  const stats = [['Minutes in my head', '525,600'], ['Top Artist', 'YOU 💚'], ['Top Song', SONGS[0][0]], ['Top Genre', 'Pure Love 💗']];
  const top = y + 140;
  stats.forEach((s, i) => { const x = 90 + (i % 2) * 460, yy = top + Math.floor(i / 2) * 230; c.fillStyle = 'rgba(255,255,255,.1)'; rr(c, x, yy, 440, 210, 32); c.fill(); c.fillStyle = 'rgba(255,255,255,.75)'; c.font = '600 34px Poppins,sans-serif'; c.fillText(s[0], x + 30, yy + 62); c.fillStyle = '#fff'; c.font = `900 ${s[1].length > 14 ? 40 : 56}px Poppins,sans-serif`; wrapText(c, s[1], x + 30, yy + 130, 390, 48); });
  const py = top + 460; c.fillStyle = 'rgba(255,255,255,.1)'; rr(c, 90, py, 900, 170, 32); c.fill(); c.fillStyle = 'rgba(255,255,255,.75)'; c.font = '600 34px Poppins,sans-serif'; c.fillText('Listening personality', 120, py + 60); c.fillStyle = '#fff'; c.font = '900 58px Poppins,sans-serif'; c.fillText('The Forever Kind ♾️', 120, py + 135);
  c.textAlign = 'center'; c.fillStyle = '#1ed760'; c.font = '900 54px Poppins,sans-serif'; c.fillText('Same time next year? Forever. 💚', 540, 1225);
  c.fillStyle = 'rgba(255,255,255,.75)'; c.font = '700 34px Poppins,sans-serif'; c.fillText('Made by @hack.n.code', 540, 1285);
  return cv;
}
$('#dlBtn').addEventListener('click', () => { const a = document.createElement('a'); a.download = 'love-wrapped-2026.png'; a.href = cardPNG().toDataURL('image/png'); document.body.appendChild(a); a.click(); a.remove(); sfx('tap'); });
const base = () => location.origin + location.pathname;
const link = (n, m) => base() + '?name=' + encodeURIComponent(n) + (m ? '&memory=' + encodeURIComponent(m) : '');
const waOpen = (n, l) => window.open('https://wa.me/?text=' + encodeURIComponent(`I made something for you, ${n} 💚 Your 2026 Love Wrapped is ready 🎧 Tap: ${l}`), '_blank');
$('#waBtn').addEventListener('click', () => waOpen(NAME, link(NAME, MEMORY)));

/* make your own */
const modal = $('#makeModal');
const openMake = () => { modal.classList.remove('hide'); $('#mOut').classList.add('hide'); };
$('#makeBtn1').addEventListener('click', openMake); $('#makeBtn2').addEventListener('click', openMake);
$('#mClose').addEventListener('click', () => modal.classList.add('hide'));
modal.addEventListener('click', e => { if (e.target === modal) modal.classList.add('hide'); });
let made = '';
$('#mGo').addEventListener('click', () => { const n = clean($('#mName').value, 20) || 'my love', m = clean($('#mMem').value, 40); made = link(n, m); $('#mLink').textContent = made; $('#mOut').classList.remove('hide'); $('#mOut').dataset.n = n; });
$('#mWa').addEventListener('click', () => waOpen($('#mOut').dataset.n || 'my love', made));
$('#mCopy').addEventListener('click', () => { const done = () => { $('#mCopy').textContent = 'Copied ✅'; setTimeout(() => $('#mCopy').textContent = '📋 Copy link', 1600); }; if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(made).then(done, done); else done(); });

/* ---------------- loop ---------------- */
function frame(t) {
  const dt = Math.min(50, lastT ? t - lastT : 16.7); lastT = t;
  drawBg(t);
  if (screen === 'story') updateStory(t);
  if (screen === 'player') updatePlayer(t, dt);
  if (screen === 'finale') updateFinale();
  stepFx(dt);
  requestAnimationFrame(frame);
}

/* ---------------- demo (auto-play for recording) ---------------- */
function runDemo() {
  const at = (ms, f) => setTimeout(f, ms);
  at(2400, () => { tapFx($('#startBtn')); });
  at(2600, () => startStory());
  const storyEnd = 2600 + DUR.reduce((a, b) => a + b, 0);
  at(storyEnd + 2100, () => { tapFx($('#likeBtn')); doLike(); });
  at(storyEnd + 5100, () => tapFx($('#toCard')));
  at(storyEnd + 5300, () => startFinale());
  at(storyEnd + 5300 + 4800, () => { window.__demo = 'done'; });
}

window.__api = { phase: () => screen + (screen === 'story' ? ':' + si : ''), cardPNG, next, startFinale, startPlayer };
addEventListener('resize', resize);
const go = () => { resize(); setTheme(0); requestAnimationFrame(frame); if (DEMO) runDemo(); window.__ready = true; };
(document.fonts && document.fonts.ready ? Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 2500))]) : Promise.resolve()).then(() => { drawPolaroid(); go(); });
})();
