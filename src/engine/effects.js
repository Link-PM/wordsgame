import { el } from './dom.js';

// 一次性特效：在舞台局部坐标 (x, y) 处放一个元素，动画结束自动移除。
function spawn(stage, className, x, y, extra = {}) {
  const node = el('div', { class: className });
  Object.assign(node.style, { left: `${x}px`, top: `${y}px` }, extra);
  stage.el.append(node);
  node.addEventListener('animationend', () => node.remove(), { once: true });
  return node;
}

// 把一个 token 的中心换算成舞台局部坐标（特效都用这个定位）。
export function tokenCenter(stage, token) {
  const c = token.center;
  const r = stage.el.getBoundingClientRect();
  return { x: c.x - r.left, y: c.y - r.top };
}

// 把视口坐标换算成舞台局部坐标。
export function toLocal(stage, clientX, clientY) {
  const r = stage.el.getBoundingClientRect();
  return { x: clientX - r.left, y: clientY - r.top };
}

// 一团“噗”——扩散光环 + 四散的小火星，用于“有东西诞生/合成”了。
export function poof(stage, x, y, color = 'var(--gold)') {
  spawn(stage, 'fx fx-ring', x, y, { '--fx': color });
  const n = 9;
  for (let i = 0; i < n; i++) {
    const a = (Math.PI * 2 * i) / n + Math.random() * 0.3;
    const dist = 30 + Math.random() * 16;
    spawn(stage, 'fx fx-spark', x, y, {
      '--fx': color,
      '--dx': `${Math.cos(a) * dist}px`,
      '--dy': `${Math.sin(a) * dist}px`,
    });
  }
}

// 一道白光闪一下，强调“成了”。
export function flash(stage, x, y) {
  spawn(stage, 'fx fx-flash', x, y);
}

// 升腾的水汽 / 烟，用于浇灭、烧炭。
export function smoke(stage, x, y, color = 'rgba(180,180,180,0.7)') {
  for (let i = 0; i < 5; i++) {
    spawn(stage, 'fx fx-smoke', x + (Math.random() - 0.5) * 24, y, {
      '--fx': color,
      '--drift': `${(Math.random() - 0.5) * 30}px`,
      animationDelay: `${i * 70}ms`,
    });
  }
}

// 火星 / 摩擦迸溅，用于磨杵、砍、点燃。
export function sparks(stage, x, y, color = 'var(--fire)') {
  const n = 6;
  for (let i = 0; i < n; i++) {
    const a = -Math.PI / 2 + (Math.random() - 0.5) * 1.6;
    const dist = 16 + Math.random() * 22;
    spawn(stage, 'fx fx-spark fx-spark--hot', x, y, {
      '--fx': color,
      '--dx': `${Math.cos(a) * dist}px`,
      '--dy': `${Math.sin(a) * dist}px`,
    });
  }
}

// 一滴下落的水。
export function drip(stage, x, y, color = 'var(--water)') {
  spawn(stage, 'fx fx-drip', x, y, { '--fx': color });
}

// 一圈圈扩散的水波（杯弓蛇影、入水）。
export function ripple(stage, x, y) {
  spawn(stage, 'fx fx-ripple', x, y);
  spawn(stage, 'fx fx-ripple', x, y, { animationDelay: '160ms' });
}

// 一句从某处飘起淡出的文字（成语梗 / 提示反馈）。
export function floatText(stage, x, y, text, kind = '') {
  const node = el('div', { class: `fx-float ${kind}`.trim(), text });
  Object.assign(node.style, { left: `${x}px`, top: `${y}px` });
  stage.el.append(node);
  node.addEventListener('animationend', () => node.remove(), { once: true });
  return node;
}

// 动画作用在内层 face 上，避免覆盖外层用于定位的 translate。
function animateFace(token, cls) {
  const f = token.face;
  f.classList.remove(cls);
  void f.offsetWidth;
  f.classList.add(cls);
  f.addEventListener('animationend', () => f.classList.remove(cls), { once: true });
}

// 让一个 token 抖一下（被砍、被撞、出错）。
export function shake(token) {
  animateFace(token, 'fx-shake');
}

// 让一个 token 轻轻弹一下（强调“它变了/它响应了”）。
export function bump(token) {
  animateFace(token, 'fx-bump');
}

// 把一个 token 平滑移动到 translate 坐标 (x, y)。
export function glideTo(token, x, y, ms = 220) {
  return new Promise((resolve) => {
    token.el.style.transition = `transform ${ms}ms cubic-bezier(.22,.61,.36,1)`;
    token.moveTo(x, y);
    setTimeout(() => {
      token.el.style.transition = '';
      resolve();
    }, ms);
  });
}
