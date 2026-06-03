import { el } from '../engine/dom.js';
import { proximityCharge } from '../engine/mechanics.js';
import { drip, poof, tokenCenter } from '../engine/effects.js';

// 第 1 关《水能载舟》：火烤冰 → 冰出汗、滴水、蓄满 → 变「水」→ 拖入填空。
// 用通用的 proximityCharge 机制，后面火/邻近加热的关卡复用同一套交互。
export default {
  meta: { id: 1 },

  init({ stage, Token }) {
    const fire = new Token({ value: '火', x: 70, y: 250, className: 'token--fire' });
    const ice = new Token({ value: '冰', x: 250, y: 250, className: 'token--ice' });
    ice.el.append(el('div', { class: 'charge-ring' }));

    stage.addToken(fire);
    stage.addToken(ice);

    const charger = proximityCharge(stage, {
      source: fire,
      target: ice,
      range: 120,
      rate: 0.012,
      chargingClass: 'heating',
      onProgress: (p, { near, frame }) => {
        if (near && frame % 7 === 0) {
          const c = tokenCenter(stage, ice);
          drip(stage, c.x + (Math.random() - 0.5) * 36, c.y + 20);
        }
      },
      onComplete: async () => {
        ice.el.querySelector('.charge-ring')?.remove();
        ice.el.classList.remove('token--ice');
        await ice.morphTo('水');
        ice.el.classList.add('token--water');
        const c = tokenCenter(stage, ice);
        poof(stage, c.x, c.y, 'var(--water)');
        ice.pulse();
      },
    });

    return { destroy() { charger.destroy(); } };
  },
};
