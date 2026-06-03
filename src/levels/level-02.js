import { makeRotatable } from '../engine/mechanics.js';
import { el } from '../engine/dom.js';
import { tokenCenter, poof, floatText, bump } from '../engine/effects.js';

// 第 2 关《歪打正着》：抓住「正」往一边拧/扳斜，转过一定角度它就成了「歪」。
// “扳斜”这个动作本身就是“歪”的字义——动作即语义。
export default {
  meta: { id: 2 },

  init({ stage, Token }) {
    const zheng = new Token({ value: '正', x: 152, y: 250 });
    stage.addToken(zheng, { draggable: false });

    // 诱导：弧形旋转箭头 + 字轻轻晃，暗示“可以拧/扳斜”，一上手就消失
    const hint = el('div', { class: 'rotate-hint', text: '↻' });
    zheng.el.append(hint);
    zheng.face.classList.add('hint-wobble');
    zheng.el.addEventListener('pointerdown', () => {
      hint.remove();
      zheng.face.classList.remove('hint-wobble');
    }, { once: true });

    makeRotatable(zheng, {
      threshold: 42,
      onPast: async (t) => {
        t.el.style.transition = 'transform .25s ease';
        t.setRotation(16); // 定格一个倾角
        setTimeout(() => { t.el.style.transition = ''; }, 250);
        const c = tokenCenter(stage, t);
        floatText(stage, c.x, c.y - 34, '扳歪了！');
        poof(stage, c.x, c.y, 'var(--gold)');
        await t.morphTo('歪');
        bump(t);
        stage.enableDrag(t); // 现在可以把「歪」拖进填空
      },
    });

    return {};
  },
};
