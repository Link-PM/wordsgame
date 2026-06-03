import { makeFlippable, flipMorph } from '../engine/mechanics.js';
import { tokenCenter, poof, floatText } from '../engine/effects.js';

// 第 3 关《更上一层楼》：把「下」向上一掀、翻个面，就成了「上」。
// 上、下互为上下镜像，意义又正相反——翻一下，方向也反过来。
export default {
  meta: { id: 3 },

  init({ stage, Token }) {
    const xia = new Token({ value: '下', x: 152, y: 252 });
    stage.addToken(xia, { draggable: false });

    makeFlippable(xia, {
      threshold: 60,
      onFlip: async (t) => {
        const c = tokenCenter(stage, t);
        floatText(stage, c.x, c.y - 34, '翻过来！');
        await flipMorph(t, '上');
        poof(stage, c.x, c.y, 'var(--gold)');
        stage.enableDrag(t);
      },
    });

    return {};
  },
};
