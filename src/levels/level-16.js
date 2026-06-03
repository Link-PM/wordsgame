import { glideTo, poof, floatText, tokenCenter, shake, bump } from '../engine/effects.js';

// 第 16 关《动如脱兔》：把「树桩」摆好然后等待；过一会儿一只兔子飞奔撞上树桩，得到「兔」。
// 这关不靠操作靠“等”——守株待兔。
export default {
  meta: { id: 16 },

  init({ stage, Token }) {
    const W = stage.el.clientWidth || 344;
    const stump = new Token({ value: '树桩', x: Math.round(W / 2 - 40), y: 262, className: 'token--plant' });
    stage.addToken(stump);

    let armed = false;
    let arrived = false;
    const timers = [];

    function arm() {
      if (armed) return;
      armed = true;
      const c = tokenCenter(stage, stump);
      floatText(stage, c.x, c.y - 36, '守株…待兔…');
      timers.push(setTimeout(spawnRabbit, 3200));
    }

    async function spawnRabbit() {
      if (arrived) return;
      arrived = true;
      const rabbit = new Token({ value: '兔', x: W - 56, y: stump.y, className: 'token--beast' });
      stage.addToken(rabbit, { draggable: false });
      await glideTo(rabbit, stump.x + 80, stump.y, 600);
      shake(stump);
      bump(rabbit);
      const c = tokenCenter(stage, rabbit);
      poof(stage, c.x, c.y, '#95613a');
      floatText(stage, c.x, c.y - 30, '撞上来了！', 'good');
      stage.enableDrag(rabbit);
    }

    stage.setHandlers({
      onDrop: (token) => { if (token === stump) { arm(); return true; } return false; },
    });
    timers.push(setTimeout(arm, 3000)); // 即便什么都不做，等一会儿也会开始

    return { destroy() { timers.forEach(clearTimeout); } };
  },
};
