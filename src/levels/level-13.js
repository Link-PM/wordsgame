import { el } from '../engine/dom.js';
import { proximityCharge } from '../engine/mechanics.js';
import { ripple, poof, floatText, tokenCenter, bump } from '../engine/effects.js';

// 第 13 关《笔走龙蛇》：把「弓」举到酒杯上方，倒影落进酒里，浮出一条「蛇」的影子，捞出「蛇」。
// 复用邻近蓄能机制（同火烤冰，只是把“火”换成“弓影”）。
export default {
  meta: { id: 13 },

  init({ stage, Token }) {
    const cup = new Token({
      value: '酒', x: Math.round((stage.el.clientWidth || 344) / 2 - 32), y: 300, className: 'token--prop',
    });
    cup.el.append(el('div', { class: 'charge-ring' }));
    cup.el.style.setProperty('--ring', 'rgba(120,160,200,0.9)');
    const bow = new Token({ value: '弓', x: 58, y: 150 });

    stage.addToken(cup, { draggable: false });
    stage.addToken(bow);

    let spawned = false;
    const charger = proximityCharge(stage, {
      source: bow,
      target: cup,
      range: 120,
      rate: 0.012,
      chargingClass: 'reflecting',
      enabled: () => !spawned,
      onProgress: (p, { near, frame }) => {
        if (near && frame % 11 === 0) {
          const c = tokenCenter(stage, cup);
          ripple(stage, c.x, c.y);
        }
      },
      onComplete: async () => {
        spawned = true;
        cup.el.querySelector('.charge-ring')?.remove();
        const c = tokenCenter(stage, cup);
        ripple(stage, c.x, c.y);
        poof(stage, c.x, c.y, '#95613a');
        const snake = new Token({ value: '蛇', x: cup.x, y: cup.y - 82, className: 'token--beast' });
        stage.addToken(snake);
        bump(snake);
        floatText(stage, c.x, c.y - 30, '杯弓蛇影！', 'good');
      },
    });

    return { destroy() { charger.destroy(); } };
  },
};
