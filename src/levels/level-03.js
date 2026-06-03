import { makeLiveFlip } from '../engine/mechanics.js';
import { el } from '../engine/dom.js';
import { tokenCenter, poof, floatText, bump } from '../engine/effects.js';

// 第 3 关《更上一层楼》：往上拉「下」，它跟手做 3D 翻面，翻过半即变成「上」。
// 上、下互为上下镜像——看得见它一边翻一边变，不用教就懂。
export default {
  meta: { id: 3 },

  init({ stage, Token }) {
    const xia = new Token({ value: '下', x: 152, y: 252 });
    stage.addToken(xia, { draggable: false });

    makeLiveFlip(xia, {
      distance: 84,
      onCommit: async (t) => {
        const c = tokenCenter(stage, t);
        await t.morphTo('上'); // 翻面后换成干净正立的「上」
        t.face.style.transition = 'transform 0s';
        t.face.style.transform = 'rotateX(0deg)';
        floatText(stage, c.x, c.y - 34, '翻过来！');
        poof(stage, c.x, c.y, 'var(--gold)');
        bump(t);
        stage.enableDrag(t);
      },
    });

    // 诱导：上拉箭头 + 字轻轻翻一下，暗示“往上拉可翻转”，一上手就消失
    const hint = el('div', { class: 'flip-hint', text: '↑' });
    xia.el.append(hint);
    xia.face.classList.add('hint-flip');
    xia.el.addEventListener('pointerdown', () => {
      hint.remove();
      xia.face.classList.remove('hint-flip');
    }, { once: true });

    return {};
  },
};
