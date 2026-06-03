import { makeCombiner } from '../engine/mechanics.js';
import { poof, floatText, tokenCenter } from '../engine/effects.js';

// 第 12 关《一马当先》：赵高 + 指 → “指认”这个动作；再施加到「鹿」上，硬说是马 → 「马」。
export default {
  meta: { id: 12 },

  init({ stage, Token }) {
    const combiner = makeCombiner(stage, [
      { inputs: ['赵高', '指'], output: '指认', className: 'token--auth', color: '#9a3b3b' },
      {
        inputs: ['指认', '鹿'], output: '马', className: 'token--beast',
        fx: (s, p) => poof(s, p.x, p.y, '#9a3b3b'),
        onResult: (t) => {
          t.el.classList.remove('token--auth');
          const c = tokenCenter(stage, t);
          floatText(stage, c.x, c.y - 34, '指鹿为马！', 'warn');
        },
      },
    ]);
    stage.setHandlers({ onDrop: (t, info) => combiner.onDrop(t, info) });

    stage.addToken(new Token({ value: '鹿', x: 248, y: 280, className: 'token--beast' }));
    stage.addToken(new Token({ value: '指', x: 60, y: 140 }));
    stage.addToken(new Token({ value: '赵高', x: 56, y: 300, className: 'token--auth' }));
    return {};
  },
};
