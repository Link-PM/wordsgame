import { makeChopper, proximityCharge } from '../engine/mechanics.js';
import { smoke, sparks, poof, floatText, tokenCenter } from '../engine/effects.js';

// 第 14 关《雪中送炭》：先用「斧」砍 森→林→木（复用斧砍）；再用「火」把「木」烧成「炭」（复用邻近加热）。
export default {
  meta: { id: 14 },

  init({ stage, Token }) {
    const forest = new Token({ value: '森', x: 232, y: 250, className: 'token--plant' });
    const axe = new Token({ value: '斧', x: 58, y: 150, className: 'token--metal' });
    const fire = new Token({ value: '火', x: 58, y: 342, className: 'token--fire' });

    const chopper = makeChopper(stage, { axe, target: forest, sequence: ['森', '林', '木'], color: '#4f8a52' });
    stage.setHandlers({ onDrop: (t, info) => chopper.onDrop(t, info) });

    let burned = false;
    const charger = proximityCharge(stage, {
      source: fire,
      target: forest,
      range: 110,
      rate: 0.012,
      chargingClass: 'heating',
      enabled: () => forest.value === '木' && !burned, // 只有砍到「木」才能烧成炭
      onProgress: (p, { near, frame }) => {
        if (near && frame % 8 === 0) {
          const c = tokenCenter(stage, forest);
          sparks(stage, c.x, c.y - 8, 'var(--fire)');
        }
      },
      onComplete: async () => {
        burned = true;
        const c = tokenCenter(stage, forest);
        await forest.morphTo('炭');
        forest.el.classList.remove('token--plant');
        forest.el.classList.add('token--ash');
        smoke(stage, c.x, c.y);
        poof(stage, c.x, c.y, '#4a4441');
        floatText(stage, c.x, c.y - 30, '烧成炭！', 'good');
      },
    });

    stage.addToken(forest);
    stage.addToken(axe);
    stage.addToken(fire);
    return { destroy() { charger.destroy(); } };
  },
};
