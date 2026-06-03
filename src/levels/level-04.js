import { makeCombiner } from '../engine/mechanics.js';

// 第 4 关《明月几时有》：两个「口」上下拼成「日」；再把「日」和「月」合成「明」。两步。
// 素材随机散乱摆放（带点随机倾斜），更有“一堆零件”的感觉。
export default {
  meta: { id: 4 },

  init({ stage, Token }) {
    const combiner = makeCombiner(stage, [
      { inputs: ['口', '口'], output: '日' },
      { inputs: ['日', '月'], output: '明' },
    ]);
    stage.setHandlers({ onDrop: (t, info) => combiner.onDrop(t, info) });

    const W = stage.el.clientWidth || 344;
    const H = stage.el.clientHeight || 460;
    const scatter = (token) => {
      token.moveTo(24 + Math.random() * (W - 112), 96 + Math.random() * (H - 196));
      token.setRotation((Math.random() - 0.5) * 26);
      stage.addToken(token);
    };

    scatter(new Token({ value: '口' }));
    scatter(new Token({ value: '口' }));
    scatter(new Token({ value: '月' }));
    return {};
  },
};
