import { wait } from '../engine/dom.js';
import { poof, floatText, tokenCenter, bump } from '../engine/effects.js';

// 第 10 关《风吹草低见牛羊》：把「风」吹向「草」，草伏低，露出藏着的「牛」「羊」（两个空）。
export default {
  meta: { id: 10 },

  init({ stage, Token }) {
    const W = stage.el.clientWidth || 344;
    const grass = new Token({ value: '草', x: Math.round(W / 2 - 32), y: 150, className: 'token--plant' });
    const wind = new Token({ value: '风', x: 52, y: 300 });
    let revealed = false;

    stage.setHandlers({
      onDrop: async (token) => {
        if (token.value === '风' && !revealed && stage.distance(wind, grass) < 98) {
          revealed = true;
          grass.face.classList.add('swaying');
          const c = tokenCenter(stage, grass);
          floatText(stage, c.x, c.y - 30, '风吹草低…');
          await wait(320);
          const niu = new Token({ value: '牛', x: grass.x - 88, y: grass.y + 96, className: 'token--beast' });
          const yang = new Token({ value: '羊', x: grass.x + 88, y: grass.y + 96, className: 'token--beast' });
          stage.addToken(niu);
          stage.addToken(yang);
          poof(stage, c.x - 62, c.y + 96, '#4f8a52');
          poof(stage, c.x + 62, c.y + 96, '#4f8a52');
          bump(niu);
          bump(yang);
          floatText(stage, c.x, c.y + 50, '见牛羊！', 'good');
          return true;
        }
        return false;
      },
    });

    stage.addToken(grass, { draggable: false });
    stage.addToken(wind);
    return {};
  },
};
