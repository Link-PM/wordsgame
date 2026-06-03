import { el } from './dom.js';
import { makeDraggable } from './draggable.js';

// 游戏区域：管理素材 token、填空 slot，处理拖放命中（填空 / 交给关卡逻辑）。
export class Stage {
  constructor() {
    this.el = el('div', { class: 'stage' });
    this.tokens = [];
    this.slots = [];
    this.handlers = {};       // 关卡注入：onStart / onMove / onDrop / onAfterFill
    this._unbinders = [];
  }

  setHandlers(handlers) {
    this.handlers = { ...this.handlers, ...handlers };
  }

  addToken(token, { draggable = true } = {}) {
    this.tokens.push(token);
    this.el.append(token.el);
    if (draggable && token.draggable) this.enableDrag(token);
    return token;
  }

  // 给一个 token 绑定拖动（用于先以非拖动方式加入、之后再开启拖动的场景）。
  enableDrag(token) {
    token.draggable = true;
    const unbind = makeDraggable(token, {
      onStart: (t, e) => this.handlers.onStart?.(t, e),
      onMove: (t, e) => this.handlers.onMove?.(t, e),
      onDrop: (t, e) => this.handleDrop(t, e),
    });
    this._unbinders.push(unbind);
  }

  removeToken(token) {
    this.tokens = this.tokens.filter((t) => t !== token);
    token.remove();
  }

  registerSlot(slot) {
    this.slots.push(slot);
  }

  async handleDrop(token, e) {
    const slot = this._slotUnder(token);
    if (slot && slot.accepts(token)) {
      this.fillSlot(token, slot);
      return;
    }
    // 不是有效填空 → 交给关卡处理合成 / 变形等逻辑。
    await this.handlers.onDrop?.(token, { slot, nearest: this.nearestToken(token) }, e);
  }

  fillSlot(token, slot) {
    slot.fill(token.value);
    token.lock();
    token.el.classList.add('token--consumed');
    this.handlers.onAfterFill?.(slot, token);
  }

  _slotUnder(token) {
    const c = token.center;
    return this.slots.find((slot) => {
      if (slot.filled) return false;
      const r = slot.rect();
      return c.x >= r.left && c.x <= r.right && c.y >= r.top && c.y <= r.bottom;
    });
  }

  distance(a, b) {
    const ca = a.center;
    const cb = b.center;
    return Math.hypot(ca.x - cb.x, ca.y - cb.y);
  }

  nearestToken(token, maxDist = Infinity) {
    let best = null;
    let bestDist = maxDist;
    for (const other of this.tokens) {
      if (other === token || other.locked) continue;
      const d = this.distance(token, other);
      if (d < bestDist) {
        bestDist = d;
        best = other;
      }
    }
    return best;
  }

  destroy() {
    for (const unbind of this._unbinders) unbind();
    this._unbinders = [];
  }
}
