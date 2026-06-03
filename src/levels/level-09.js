import { makeCombiner, quenchFx } from '../engine/mechanics.js';
import { poof } from '../engine/effects.js';

// 第 9 关《淡泊名利》：火+火→炎（火光）；水+炎→淡（蒸汽浇灭）。复用融合机制 + 自定义特效。
export default {
  meta: { id: 9 },

  init({ stage, Token }) {
    const combiner = makeCombiner(stage, [
      {
        inputs: ['火', '火'], output: '炎', className: 'token--fire',
        fx: (s, p) => poof(s, p.x, p.y, 'var(--fire)'),
      },
      {
        inputs: ['水', '炎'], output: '淡', className: 'token--water',
        fx: quenchFx,
        onResult: (t) => t.el.classList.remove('token--fire'),
      },
    ]);
    stage.setHandlers({ onDrop: (t, info) => combiner.onDrop(t, info) });

    stage.addToken(new Token({ value: '火', x: 70, y: 200, className: 'token--fire' }));
    stage.addToken(new Token({ value: '火', x: 70, y: 332, className: 'token--fire' }));
    stage.addToken(new Token({ value: '水', x: 252, y: 266, className: 'token--water' }));
    return {};
  },
};
