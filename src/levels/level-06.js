import { el, wait } from '../engine/dom.js';
import { tokenCenter, slash, flash, sparks, poof, bump } from '../engine/effects.js';

// 第 6 关《移花接木》：用「斧」劈树。一刀两断——
// 「森」从中间裂开变成两个「林」，「林」被劈再从中间裂成两个「木」。砍到「木」即可填空。
const NEXT = { 森: '林', 林: '木' };

export default {
  meta: { id: 6 },

  init({ stage, Token }) {
    const axe = new Token({ value: '斧', x: 70, y: 250, className: 'token--metal' });
    const forest = new Token({ value: '森', x: 250, y: 250, className: 'token--plant' });
    stage.addToken(axe);
    stage.addToken(forest);

    let busy = false;
    const clampX = (x) => Math.max(6, Math.min((stage.el.clientWidth || 344) - 70, x));

    // 把字一分为二：两片半字向左右弹飞
    function splitHalves(ch, x, y) {
      for (const side of ['l', 'r']) {
        const half = el('div', { class: `split-half split-half--${side}`, text: ch });
        half.style.left = `${x}px`;
        half.style.top = `${y}px`;
        stage.el.append(half);
        half.addEventListener('animationend', () => half.remove(), { once: true });
      }
    }

    async function cleave(target) {
      const next = NEXT[target.value];
      if (!next) return;
      busy = true;
      target.locked = true;
      const ch = target.value;
      const baseX = target.x;
      const baseY = target.y;
      const c = tokenCenter(stage, target);

      axe.face.classList.add('chop-swing');
      slash(stage, c.x, c.y);
      flash(stage, c.x, c.y);
      sparks(stage, c.x, c.y, '#fff');
      splitHalves(ch, c.x, c.y);
      stage.removeToken(target);
      await wait(150);
      axe.face.classList.remove('chop-swing');

      // 裂出两个“下一级”，落在左右两侧
      for (const dx of [-54, 54]) {
        const piece = new Token({ value: next, x: clampX(baseX + dx), y: baseY, className: 'token--plant' });
        stage.addToken(piece);
        bump(piece);
      }
      poof(stage, c.x, c.y, '#4f8a52');
      busy = false;
    }

    stage.setHandlers({
      onDrop: async (token, { nearest }) => {
        if (busy || token !== axe) return false;
        if (!nearest || !NEXT[nearest.value] || stage.distance(axe, nearest) > 84) return false;
        await cleave(nearest);
        return true;
      },
    });

    return {};
  },
};
