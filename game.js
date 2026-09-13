/* 贪吃蛇 — 纯 Canvas 实现 */
(() => {
  'use strict';
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');
  const W = 400, H = 400, N = 20, CELL = W / N;
  const dpr = Math.max(1, Math.min(3, window.devicePixelRatio || 1));
  canvas.width = W * dpr; canvas.height = H * dpr; ctx.scale(dpr, dpr);

  const scoreEl = document.getElementById('score');
  const bestEl = document.getElementById('best');
  const overlay = document.getElementById('overlay');
  const ovTitle = document.getElementById('ov-title');
  const ovSub = document.getElementById('ov-sub');

  let snake, dir, pending, food, score, best, speed, alive, acc, last;

  best = Number(localStorage.getItem('snake_best') || 0);
  bestEl.textContent = best;

  function spawnFood() {
    const occ = new Set(snake.map(s => s.x + ',' + s.y));
    let cells = [];
    for (let x = 0; x < N; x++) for (let y = 0; y < N; y++) if (!occ.has(x + ',' + y)) cells.push({ x, y });
    return cells[Math.floor(Math.random() * cells.length)];
  }

  function reset() {
    snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
    dir = { x: 1, y: 0 }; pending = { x: 1, y: 0 };
    food = spawnFood(); score = 0; speed = 130; alive = true; acc = 0; last = performance.now();
    scoreEl.textContent = '0';
    overlay.classList.add('hidden');
  }

  function step() {
    if (!pending || (pending.x === -dir.x && pending.y === -dir.y)) { /* keep dir */ }
    else dir = pending;
    const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
    if (head.x < 0 || head.x >= N || head.y < 0 || head.y >= N) return gameOver();
    if (snake.some(s => s.x === head.x && s.y === head.y)) return gameOver();
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
      score += 10; scoreEl.textContent = score;
      if (score > best) { best = score; localStorage.setItem('snake_best', best); bestEl.textContent = best; }
      food = spawnFood();
      speed = Math.max(60, speed - 4);
    } else {
      snake.pop();
    }
  }

  function gameOver() {
    alive = false;
    ovTitle.textContent = '游戏结束';
    ovSub.textContent = '本局得分 ' + score;
    overlay.classList.remove('hidden');
  }

  function draw() {
    ctx.fillStyle = '#16213e';
    ctx.fillRect(0, 0, W, H);
    // 网格
    ctx.strokeStyle = 'rgba(15,52,96,0.5)';
    ctx.lineWidth = 1;
    for (let i = 1; i < N; i++) {
      ctx.beginPath(); ctx.moveTo(i * CELL, 0); ctx.lineTo(i * CELL, H); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i * CELL); ctx.lineTo(W, i * CELL); ctx.stroke();
    }
    // 食物
    ctx.fillStyle = '#e94560';
    roundRect(food.x * CELL + 3, food.y * CELL + 3, CELL - 6, CELL - 6, 5);
    ctx.fill();
    // 蛇
    for (let i = snake.length - 1; i >= 0; i--) {
      ctx.fillStyle = i === 0 ? '#2ecc71' : '#43d97a';
      roundRect(snake[i].x * CELL + 1, snake[i].y * CELL + 1, CELL - 2, CELL - 2, 5);
      ctx.fill();
    }
  }

  function roundRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function loop(t) {
    const dt = t - last; last = t;
    if (alive) {
      acc += dt;
      while (acc >= speed) { acc -= speed; step(); }
    }
    draw();
    requestAnimationFrame(loop);
  }

  // 输入
  const MAP = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1],
    a: [-1, 0], d: [1, 0], w: [0, -1], s: [0, 1], A: [-1, 0], D: [1, 0], W: [0, -1], S: [0, 1] };
  window.addEventListener('keydown', (e) => {
    const m = MAP[e.key]; if (!m) return;
    e.preventDefault();
    const nd = { x: m[0], y: m[1] };
    if (!(nd.x === -dir.x && nd.y === -dir.y)) pending = nd;
  });
  let sx = 0, sy = 0;
  canvas.addEventListener('touchstart', (e) => { const t = e.changedTouches[0]; sx = t.clientX; sy = t.clientY; }, { passive: true });
  canvas.addEventListener('touchend', (e) => {
    const t = e.changedTouches[0]; const dx = t.clientX - sx, dy = t.clientY - sy;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
    let nd;
    if (Math.abs(dx) > Math.abs(dy)) nd = { x: dx > 0 ? 1 : -1, y: 0 };
    else nd = { x: 0, y: dy > 0 ? 1 : -1 };
    if (!(nd.x === -dir.x && nd.y === -dir.y)) pending = nd;
  }, { passive: true });

  document.getElementById('new').addEventListener('click', reset);
  document.getElementById('ov-btn').addEventListener('click', reset);

  reset();
  requestAnimationFrame(loop);
})();
