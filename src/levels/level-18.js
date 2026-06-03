import { wait } from '../engine/dom.js';
import { glideTo, floatText, tokenCenter, shake } from '../engine/effects.js';

// 第 18 关《打草惊蛇》：直接把「蛇」填进去即可。千万别给蛇添「足」——
// 添了足蛇就长腿溜走、直接逃跑，你得重来。（画蛇添足 · 克制陷阱）
export default {
  meta: { id: 18 },

  init({ stage, Token }) {
    const W = stage.el.clientWidth || 344;
    let snake;
    let foot;
    let resetting = false;

    function spawn() {
      snake = new Token({ value: '蛇', x: Math.round(W / 2 - 32), y: 168, className: 'token--beast' });
      foot = new Token({ value: '足', x: 58, y: 330 });
      stage.addToken(snake);
      stage.addToken(foot);
    }

    async function trap() {
      resetting = true;
      const c = tokenCenter(stage, snake);
      floatText(stage, c.x, c.y - 36, '画蛇添足！蛇跑了', 'warn');
      shake(snake);
      snake.el.classList.add('has-legs');
      foot.locked = true;
      await wait(320);
      snake.locked = true;
      await glideTo(snake, W + 90, snake.y + 50, 600); // 长腿溜走
      stage.removeToken(snake);
      stage.removeToken(foot);
      await wait(220);
      resetting = false;
      spawn();
    }

    stage.setHandlers({
      onDrop: async (token) => {
        if (resetting) return true;
        if (token === foot && stage.distance(foot, snake) < 72) {
          await trap();
          return true;
        }
        return false;
      },
    });

    spawn();
    return {};
  },
};
