import { makeSplitChopper } from '../engine/mechanics.js';

// 第 6 关《移花接木》：用「斧」劈树。一刀两断——
// 「森」从中间裂开变成两个「林」，「林」被劈再裂成两个「木」。砍到「木」即可填空。
export default {
  meta: { id: 6 },

  init({ stage, Token }) {
    const axe = new Token({ value: '斧', x: 70, y: 250, className: 'token--metal' });
    const forest = new Token({ value: '森', x: 250, y: 250, className: 'token--plant' });

    const chopper = makeSplitChopper(stage, Token, { axe, next: { 森: '林', 林: '木' } });
    stage.setHandlers({ onDrop: (t, info) => chopper.onDrop(t, info) });

    stage.addToken(axe);
    stage.addToken(forest);
    return {};
  },
};
