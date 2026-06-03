import { makeSplitChopper } from '../engine/mechanics.js';
import { smoke, sparks, poof, floatText, tokenCenter } from '../engine/effects.js';

// 第 14 关《雪中送炭》：先用「斧」一刀两断地砍 森→林→木（与第6关同款裂字特效），
// 再用「火」把任意一块「木」烧成「炭」。
export default {
  meta: { id: 14 },

  init({ stage, Token }) {
    const axe = new Token({ value: '斧', x: 58, y: 150, className: 'token--metal' });
    const fire = new Token({ value: '火', x: 58, y: 342, className: 'token--fire' });
    const forest = new Token({ value: '森', x: 235, y: 250, className: 'token--plant' });

    const chopper = makeSplitChopper(stage, Token, { axe, next: { 森: '林', 林: '木' } });
    stage.setHandlers({ onDrop: (t, info) => chopper.onDrop(t, info) });

    // 火烤：找离火最近的「木」蓄能，烧满变「炭」
    let frame = 0;
    let raf = requestAnimationFrame(loop);
    function loop() {
      frame += 1;
      const woods = stage.tokens.filter((t) => t.value === '木' && !t.locked);
      let target = null;
      let best = 110;
      for (const w of woods) {
        const d = stage.distance(fire, w);
        if (d < best) { best = d; target = w; }
      }
      for (const w of woods) if (w !== target) w.el.classList.remove('heating');
      if (target && !fire.locked) {
        target.state.burn = Math.min(1, (target.state.burn || 0) + 0.012);
        target.el.style.setProperty('--charge', target.state.burn.toFixed(3));
        target.el.classList.add('heating');
        if (frame % 8 === 0) {
          const c = tokenCenter(stage, target);
          sparks(stage, c.x, c.y - 8, 'var(--fire)');
        }
        if (target.state.burn >= 1) burn(target);
      }
      raf = requestAnimationFrame(loop);
    }

    async function burn(w) {
      w.locked = true;
      w.el.classList.remove('heating');
      const c = tokenCenter(stage, w);
      await w.morphTo('炭');
      w.el.classList.remove('token--plant');
      w.el.classList.add('token--ash');
      w.locked = false;
      smoke(stage, c.x, c.y);
      poof(stage, c.x, c.y, '#4a4441');
      floatText(stage, c.x, c.y - 30, '烧成炭！', 'good');
    }

    stage.addToken(axe);
    stage.addToken(fire);
    stage.addToken(forest);
    return { destroy() { cancelAnimationFrame(raf); } };
  },
};
