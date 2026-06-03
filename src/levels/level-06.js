import { makeChopper } from '../engine/mechanics.js';

// 第 6 关《移花接木》：用「斧」碰「森」，森→林→木 逐级砍减。复用通用斧砍机制。
export default {
  meta: { id: 6 },

  init({ stage, Token }) {
    const forest = new Token({ value: '森', x: 240, y: 250, className: 'token--plant' });
    const axe = new Token({ value: '斧', x: 80, y: 250, className: 'token--metal' });

    const chopper = makeChopper(stage, {
      axe,
      target: forest,
      sequence: ['森', '林', '木'],
      color: '#4f8a52',
    });
    stage.setHandlers({ onDrop: (t, info) => chopper.onDrop(t, info) });

    stage.addToken(forest);
    stage.addToken(axe);
    return {};
  },
};
