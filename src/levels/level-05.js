import { el, wait } from '../engine/dom.js';
import { glideTo, poof, ripple, floatText, tokenCenter, bump } from '../engine/effects.js';

// 第 5 关《口若悬河》：把一堆「水」排进中央的“河道”，放满即汇流成「河」。
export default {
  meta: { id: 5 },

  init({ stage, Token }) {
    const W = stage.el.clientWidth || 344;
    const colX = Math.round(W / 2 - 32); // 河道列（token 左上角 x）
    const baseY = 86;
    const gap = 56;
    const NEED = 4;
    const slots = Array.from({ length: NEED }, (_, i) => ({ y: baseY + i * gap, taken: false }));

    const channel = el('div', { class: 'river-channel' });
    Object.assign(channel.style, {
      left: `${colX - 4}px`, top: `${baseY - 10}px`, height: `${gap * (NEED - 1) + 84}px`,
    });
    stage.el.append(channel);

    let placed = 0;
    let merged = false;

    const inChannel = (token) => {
      const r = stage.el.getBoundingClientRect();
      return Math.abs((token.center.x - r.left) - (colX + 32)) < 74 && !merged;
    };

    async function snap(token) {
      const slot = slots.find((s) => !s.taken);
      if (!slot) return;
      slot.taken = true;
      token.locked = true;
      token.el.classList.add('flowing');
      await glideTo(token, colX, slot.y, 200);
      const c = tokenCenter(stage, token);
      ripple(stage, c.x, c.y + 18);
      placed += 1;
      if (placed >= NEED) await merge();
    }

    async function merge() {
      merged = true;
      const waters = stage.tokens.filter((t) => t.value === '水' && t.locked);
      const midY = baseY + (gap * (NEED - 1)) / 2;
      await Promise.all(waters.map((w) => glideTo(w, colX, midY, 260)));
      const c = { x: colX + 32, y: midY + 32 };
      poof(stage, c.x, c.y, 'var(--water)');
      ripple(stage, c.x, c.y);
      waters.forEach((w) => stage.removeToken(w));
      const he = new Token({ value: '河', x: colX, y: Math.round(midY), className: 'token--water' });
      he.el.classList.add('big');
      stage.addToken(he);
      bump(he);
      floatText(stage, c.x, c.y - 30, '汇成河！', 'good');
    }

    stage.setHandlers({
      onDrop: async (token) => {
        if (token.value === '水' && !token.locked && inChannel(token)) {
          await snap(token);
          return true;
        }
        return false;
      },
    });

    const spots = [[36, 110], [40, 250], [36, 380], [W - 100, 130], [W - 104, 270], [W - 96, 400]];
    for (const [x, y] of spots) {
      stage.addToken(new Token({ value: '水', x, y, className: 'token--water' }));
    }

    return {};
  },
};
