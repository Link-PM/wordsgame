import { el, wait } from './dom.js';

let nextId = 0;

// 一个可拖动的“素材”——多数是一个汉字，也可以是工具/物件（用 emoji 或文字呈现）。
export class Token {
  constructor({ kind = 'char', value, x = 0, y = 0, className = '', draggable = true } = {}) {
    this.id = ++nextId;
    this.kind = kind;        // 'char' | 'object'
    this.value = value;      // 当前显示的字符
    this.x = x;
    this.y = y;
    this.rotation = 0;
    this.flipX = false;
    this.flipY = false;
    this.locked = false;
    this.draggable = draggable;
    this.state = {};         // 关卡可自由挂载的状态

    this.el = el('div', { class: `token token--${kind} ${className}`.trim() });
    this.face = el('div', { class: 'token__face', text: value });
    this.el.append(this.face);
    this.el.dataset.value = value;
    this.el.classList.toggle('token--word', [...String(value)].length > 1);
    this.applyTransform();
  }

  moveTo(x, y) {
    this.x = x;
    this.y = y;
    this.applyTransform();
  }

  applyTransform() {
    const sx = this.flipX ? -1 : 1;
    const sy = this.flipY ? -1 : 1;
    this.el.style.transform =
      `translate(${this.x}px, ${this.y}px) rotate(${this.rotation}deg) scale(${sx}, ${sy})`;
  }

  setRotation(deg) {
    this.rotation = deg;
    this.applyTransform();
  }

  // 几何居中点（视口坐标），用于碰撞/距离判定，受 transform 影响也准确。
  get center() {
    const r = this.el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }

  // 把当前字渐变替换成另一个字（交叉淡入），用于“变形”的收尾。
  async morphTo(value, { duration = 420 } = {}) {
    const next = el('div', { class: 'token__face token__face--enter', text: value });
    this.el.append(next);
    await wait(20);
    this.face.classList.add('token__face--leave');
    next.classList.remove('token__face--enter');
    await wait(duration);
    this.face.remove();
    this.face = next;
    this.value = value;
    this.el.dataset.value = value;
    this.el.classList.toggle('token--word', [...String(value)].length > 1);
  }

  pulse() {
    this.el.classList.remove('pulse');
    void this.el.offsetWidth; // 重启动画
    this.el.classList.add('pulse');
  }

  lock() {
    this.locked = true;
    this.el.classList.add('token--locked');
  }

  remove() {
    this.el.remove();
  }
}
