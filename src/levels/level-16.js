import { glideTo, poof, smoke, sparks, flash, floatText, tokenCenter, shake, shockwave } from '../engine/effects.js';

// 第 16 关《动如脱兔》：把「树桩」摆好然后等待；过一会儿一只兔子飞奔撞上树桩（夸张撞击），得到「兔」。
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
      const rabbit = new Token({ value: '兔', x: W - 54, y: stump.y, className: 'token--beast' });
      stage.addToken(rabbit, { draggable: false });
      rabbit.el.classList.add('dashing'); // 飞奔残影
      await glideTo(rabbit, stump.x + 80, stump.y, 430); // 飞快冲过来
      rabbit.el.classList.remove('dashing');

      // 夸张撞击：闪光 + 冲击波 + 尘土 + 火花 + 双方猛抖
      const sc = tokenCenter(stage, stump);
      flash(stage, sc.x, sc.y);
      shockwave(stage, sc.x, sc.y);
      poof(stage, sc.x, sc.y, '#b9935f');
      smoke(stage, sc.x, sc.y, 'rgba(185,150,110,.85)');
      sparks(stage, sc.x, sc.y, '#fff');
      shake(stump);
      shake(rabbit);
      floatText(stage, sc.x, sc.y - 42, '嘭！', 'warn');

      // 兔子反弹一下再定住
      await glideTo(rabbit, stump.x + 106, stump.y - 8, 110);
      await glideTo(rabbit, stump.x + 84, stump.y, 150);
      const c = tokenCenter(stage, rabbit);
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
