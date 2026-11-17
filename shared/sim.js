/* Shared helpers for all simulation pages (classic script: everything here is global).
   Load before the page script:  <script src="../../shared/sim.js"></script>
   A page provides: the element ids used below (theme, notes, play, restart, scrub, speed, spv),
   its own colour tokens (registered with addColors) and its draw functions. */
"use strict";
const FS = 14, FONT = FS + 'px system-ui, sans-serif';
const $ = id => document.getElementById(id);

/* ---------- colours (CSS tokens --c-<name> on :root, read into C) ---------- */
const C = {};
const COLOR_KEYS = ['fg','muted','grid','axis','ex','first','drive','levelA'];
function addColors(...keys){ for (const k of keys) if (!COLOR_KEYS.includes(k)) COLOR_KEYS.push(k); readColors(); }
function readColors(){
  const cs = getComputedStyle(document.documentElement);
  for (const k of COLOR_KEYS) C[k] = cs.getPropertyValue('--c-'+k).trim();
  C.card = cs.getPropertyValue('--card').trim();
}

/* ---------- canvas helpers ---------- */
// size the canvas for HiDPI, clear it, and return its CSS-pixel size
function setup(cv){
  const dpr = window.devicePixelRatio || 1, w = cv.clientWidth, h = cv.clientHeight;
  if (cv.width !== Math.round(w*dpr) || cv.height !== Math.round(h*dpr)){ cv.width = Math.round(w*dpr); cv.height = Math.round(h*dpr); }
  const ctx = cv.getContext('2d');
  ctx.setTransform(dpr,0,0,dpr,0,0); ctx.clearRect(0,0,w,h); ctx.font = FONT;
  return {ctx, w, h};
}
function niceTicks(min, max, n){
  const span = max-min; if (!(span>0)) return {ticks:[min], step:1};
  const s0 = span/n, mag = Math.pow(10, Math.floor(Math.log10(s0))), r = s0/mag;
  const step = (r<1.5?1:r<3?2:r<7?5:10)*mag, ticks = [];
  for (let v=Math.ceil(min/step)*step; v<=max+1e-9*step; v+=step) ticks.push(Math.abs(v)<step*1e-9?0:v);
  return {ticks, step};
}
function fmt(v, step){
  if (v === 0) return '0';
  if (step < 1e-3 || Math.abs(v) >= 1e4) return v.toExponential(1).replace('e-','e−');
  const dec = Math.max(0, Math.min(6, -Math.floor(Math.log10(step)+1e-9)));
  return v.toFixed(dec);
}
// text with sub/superscripts: parts = [['P'],['b','sub'],['(t)']] or a plain string; returns the width
function rich(ctx, parts, x, y, align, fs, color){
  if (typeof parts === 'string') parts = [[parts]];
  fs = fs || FS; align = align || 'center';
  const F = s => s.toFixed(1) + 'px system-ui, sans-serif';
  ctx.save(); if (color) ctx.fillStyle = color;
  let wt = 0;
  for (const p of parts){ ctx.font = F(p[1] ? fs*0.75 : fs); wt += ctx.measureText(p[0]).width; }
  let cx = align === 'center' ? x - wt/2 : align === 'right' ? x - wt : x;
  ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  for (const p of parts){
    ctx.font = F(p[1] ? fs*0.75 : fs);
    ctx.fillText(p[0], cx, y + (p[1] === 'sub' ? fs*0.3 : p[1] === 'sup' ? -fs*0.38 : 0));
    cx += ctx.measureText(p[0]).width;
  }
  ctx.restore();
  return wt;
}
// axes with grid and ticks. o = {xmin,xmax,ymin,ymax, xlabel,ylabel, l,r,t,b (margins), log (y values are log10), noXlabels}
// returns {X, Y, L, R, T, B}: data-to-pixel maps and the plot rectangle
function axes(ctx, w, h, o){
  const L = o.l ?? 66, R = w-(o.r ?? 14), T = o.t ?? 12, B = h-(o.b ?? 42);
  const X = x => L + (x-o.xmin)/(o.xmax-o.xmin)*(R-L);
  const Y = y => B - (y-o.ymin)/(o.ymax-o.ymin)*(B-T);
  const xt = niceTicks(o.xmin, o.xmax, Math.max(3, Math.floor((R-L)/80)));
  ctx.lineWidth = 1; ctx.strokeStyle = C.grid; ctx.fillStyle = C.muted;
  ctx.textAlign = 'center'; ctx.textBaseline = 'top';
  for (const x of xt.ticks){
    ctx.beginPath(); ctx.moveTo(X(x),T); ctx.lineTo(X(x),B); ctx.stroke();
    if (!o.noXlabels) ctx.fillText(fmt(x,xt.step), X(x), B+4);
  }
  if (o.log){
    for (let n=Math.ceil(o.ymin); n<=Math.floor(o.ymax); n++){
      ctx.beginPath(); ctx.moveTo(L,Y(n)); ctx.lineTo(R,Y(n)); ctx.stroke();
      if (n === 0) rich(ctx, '1', L-6, Y(n), 'right', FS, C.muted);
      else rich(ctx, [['10'],[String(n).replace('-','−'),'sup']], L-6, Y(n), 'right', FS, C.muted);
    }
  } else {
    const yt = niceTicks(o.ymin, o.ymax, Math.max(2, Math.floor((B-T)/45)));
    ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
    for (const y of yt.ticks){ ctx.beginPath(); ctx.moveTo(L,Y(y)); ctx.lineTo(R,Y(y)); ctx.stroke(); ctx.fillText(fmt(y,yt.step), L-6, Y(y)); }
  }
  ctx.strokeStyle = C.axis; ctx.strokeRect(L,T,R-L,B-T);
  if (o.xlabel) rich(ctx, o.xlabel, (L+R)/2, h-11, 'center', FS, C.muted);
  if (o.ylabel){ ctx.save(); ctx.translate(15,(T+B)/2); ctx.rotate(-Math.PI/2); rich(ctx, o.ylabel, 0, 0, 'center', FS, C.muted); ctx.restore(); }
  return {X, Y, L, R, T, B};
}
// clip to the plot rectangle (pair with ctx.restore())
function clip(ctx, A){ ctx.save(); ctx.beginPath(); ctx.rect(A.L, A.T, A.R-A.L, A.B-A.T); ctx.clip(); }
// polyline through points i0..i1; non-finite points break the line
function poly(ctx, A, xf, yf, i0, i1, color, width, dash, alpha){
  if (i1 <= i0) return;
  ctx.save(); ctx.globalAlpha = alpha ?? 1; ctx.strokeStyle = color; ctx.lineWidth = width ?? 2;
  ctx.setLineDash(dash || []); ctx.lineJoin = 'round';
  ctx.beginPath(); let pen = false;
  for (let i=i0;i<=i1;i++){
    const x = A.X(xf(i)), y = A.Y(yf(i));
    if (!isFinite(x) || !isFinite(y)){ pen = false; continue; }
    if (pen) ctx.lineTo(x, y); else { ctx.moveTo(x, y); pen = true; }
  }
  ctx.stroke(); ctx.restore();
}
// legend right-aligned at x, first item at y; items = [{label, color, dash}]
function legend(ctx, x, y, items){
  if (!items.length) return;
  ctx.save(); ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.font = FONT;
  let wmax = 0; for (const it of items) wmax = Math.max(wmax, ctx.measureText(it.label).width);
  const x0 = x - wmax - 34;
  ctx.globalAlpha = 0.85; ctx.fillStyle = C.card;
  ctx.fillRect(x0-6, y-10, wmax+40, items.length*(FS+7)+4); ctx.globalAlpha = 1;
  items.forEach((it,i) => {
    const yy = y + i*(FS+7);
    ctx.strokeStyle = it.color; ctx.lineWidth = 2.5; ctx.setLineDash(it.dash || []);
    ctx.beginPath(); ctx.moveTo(x0, yy); ctx.lineTo(x0+22, yy); ctx.stroke();
    ctx.fillStyle = C.fg; ctx.fillText(it.label, x0+28, yy);
  });
  ctx.restore();
}
function vline(ctx, A, x, color, dash, label, bottom){
  ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = 1.3; ctx.setLineDash(dash || []);
  ctx.beginPath(); ctx.moveTo(A.X(x),A.T); ctx.lineTo(A.X(x),A.B); ctx.stroke();
  if (label){
    ctx.fillStyle = color; ctx.textAlign = 'left';
    if (bottom){ ctx.textBaseline = 'bottom'; ctx.fillText(label, A.X(x)+3, A.B-2); }
    else { ctx.textBaseline = 'top'; ctx.fillText(label, A.X(x)+3, A.T+2); }
  }
  ctx.restore();
}
function hline(ctx, A, y, color, dash, label){
  ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = 1.3; ctx.setLineDash(dash || []);
  ctx.beginPath(); ctx.moveTo(A.L,A.Y(y)); ctx.lineTo(A.R,A.Y(y)); ctx.stroke();
  if (label){ ctx.fillStyle = color; ctx.textAlign = 'right'; ctx.textBaseline = 'top'; ctx.fillText(label, A.R-6, A.Y(y)+3); }
  ctx.restore();
}

/* ---------- theme & notes (buttons #theme, #notes; optional) ---------- */
// texts can be overridden for Hebrew pages: initThemeNotes({dark:'מצב כהה', light:'מצב בהיר', show:'הצג הערות', hide:'הסתר הערות'})
function initThemeNotes(txt){
  txt = Object.assign({dark:'☾ Dark mode', light:'☀ Light mode', show:'Show notes', hide:'Hide notes'}, txt || {});
  const store = (k, v) => { try { localStorage.setItem(k, v); } catch(e){} };
  const load = k => { try { return localStorage.getItem(k); } catch(e){ return null; } };
  function applyTheme(t){
    document.documentElement.dataset.theme = t;
    if ($('theme')) $('theme').textContent = t === 'dark' ? txt.light : txt.dark;
    store('tdpt-theme', t);
    readColors();
  }
  function applyNotes(on){
    document.body.classList.toggle('notes-off', !on);
    if ($('notes')) $('notes').textContent = on ? txt.hide : txt.show;
    store('tdpt-notes', on ? '1' : '0');
  }
  applyTheme(load('tdpt-theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  if ($('theme')) $('theme').onclick = () => applyTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
  if ($('notes')){
    applyNotes(load('tdpt-notes') === '1');
    $('notes').onclick = () => applyNotes(document.body.classList.contains('notes-off'));
  }
}

/* ---------- playback & frame loop ---------- */
// S must have: playing, k (fractional time index), speed. NT = number of recorded steps, PERIOD = seconds per run at speed 1.
let PB = null;
function setPlaying(p){ PB.S.playing = p; $('play').textContent = p ? PB.txt.pause : PB.txt.play; }
function initPlayback(S, NT, PERIOD, txt){
  PB = {S, NT, PERIOD, txt: Object.assign({play:'Play', pause:'Pause'}, txt || {})};
  $('play').onclick = () => { if (!S.playing && S.k >= NT) S.k = 0; setPlaying(!S.playing); };
  $('restart').onclick = () => { S.k = 0; setPlaying(true); };
  $('scrub').max = NT;
  $('scrub').oninput = e => { S.k = +e.target.value; setPlaying(false); };
  $('speed').oninput = e => { S.speed = +e.target.value; if ($('spv')) $('spv').textContent = S.speed + '×'; };
  document.addEventListener('keydown', e => {
    if (e.code === 'Space' && !['INPUT','SELECT','BUTTON','TEXTAREA'].includes(document.activeElement.tagName)){ e.preventDefault(); $('play').click(); }
  });
  // ?t=0.6 opens the page paused at 60% of the run (used for thumbnails and for linking to a moment)
  const q = new URLSearchParams(location.search).get('t');
  if (q !== null && isFinite(+q)){ S.k = Math.min(1, Math.max(0, +q))*NT; S.playing = false; }
  setPlaying(S.playing);
}
// panels = [[canvasId, drawFn(k)], ...]; after(k) runs every frame after drawing (readouts)
function startLoop(panels, after){
  const {S, NT, PERIOD} = PB;
  let last = performance.now();
  function frame(now){
    requestAnimationFrame(frame);   // schedule first, so one failed draw never stops the loop
    const dt = Math.max(0, Math.min((now-last)/1000, 0.1)); last = now;   // rAF time can precede `last` on the first frame
    if (S.playing){
      S.k += dt*S.speed*NT/PERIOD;
      if (S.k >= NT){ S.k = NT; setPlaying(false); }
    }
    const k = Math.min(NT, Math.max(0, Math.round(S.k)));
    $('scrub').value = k;
    for (const [id, fn] of panels){
      const el = $(id);
      if (!el || el.clientWidth < 60 || el.clientHeight < 60) continue;   // canvas hidden or mid-resize
      try { fn(k); } catch(e){ console.error(e); }
    }
    if (after) try { after(k); } catch(e){ console.error(e); }
  }
  requestAnimationFrame(frame);
}
