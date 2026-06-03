import { makeCombiner } from '../engine/mechanics.js';
import { el } from '../engine/dom.js';
import { ripple, poof, floatText, tokenCenter, bump } from '../engine/effects.js';

// 第 7 关《鲜为人知》：用「网」在水池里捞出「鱼」；再把「鱼」拖到「羊」上 → 「鲜」。
export default {
  meta: { id: 7 },

  init({ stage, Token }) {
    const W = stage.el.clientWidth || 344;
    const H = stage.el.clientHeight || 460;

    const pool = el('div', { class: 'pool' });
    stage.el.append(pool);
    for (let i = 0; i < 4; i++) {
      const w = el('div', { class: 'pool__drop', text: '水' });
      w.style.left = `${28 + i * ((W - 90) / 3)}px`;
      w.style.animationDelay = `${i * 300}ms`;
      pool.append(w);
    }

    let caught = false;
    const combiner = makeCombiner(stage, [
      { inputs: ['鱼', '羊'], output: '鲜', color: 'var(--gold)' },
    ]);

    const inPool = (token) => {
      const r = stage.el.getBoundingClientRect();
      return (token.center.y - r.top) > H - 132;
    };

    stage.setHandlers({
      onDrop: async (token, info) => {
        if (token.value === '网' && !caught && inPool(token)) {
          caught = true;
          const c = tokenCenter(stage, token);
          ripple(stage, c.x, c.y);
          ripple(stage, c.x - 18, c.y + 8);
          bump(token);
          const fish = new Token({ value: '鱼', x: token.x + 8, y: Math.max(70, token.y - 76), className: 'token--beast' });
          stage.addToken(fish);
          poof(stage, c.x, c.y - 40, 'var(--water)');
          bump(fish);
          floatText(stage, c.x, c.y - 30, '捞到鱼！', 'good');
          return true;
        }
        return combiner.onDrop(token, info);
      },
    });

    stage.addToken(new Token({ value: '网', x: Math.round(W / 2 - 32), y: 96 }));
    stage.addToken(new Token({ value: '羊', x: 56, y: 110, className: 'token--beast' }));
    return {};
  },
};
