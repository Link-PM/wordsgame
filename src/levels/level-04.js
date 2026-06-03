import { makeCombiner } from '../engine/mechanics.js';

// 第 4 关《明月几时有》：两个「口」上下拼成「日」；再把「日」和「月」合成「明」。两步。
// 复用通用的“融合”机制（拖一个字到另一个上 → 按规则合成）。
export default {
  meta: { id: 4 },

  init({ stage, Token }) {
    const combiner = makeCombiner(stage, [
      { inputs: ['口', '口'], output: '日' },
      { inputs: ['日', '月'], output: '明' },
    ]);
    stage.setHandlers({ onDrop: (t, info) => combiner.onDrop(t, info) });

    stage.addToken(new Token({ value: '口', x: 70, y: 210 }));
    stage.addToken(new Token({ value: '口', x: 70, y: 330 }));
    stage.addToken(new Token({ value: '月', x: 250, y: 270 }));

    return {};
  },
};
