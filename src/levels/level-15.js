import { sparks, floatText, tokenCenter } from '../engine/effects.js';

// 第 15 关《一针见血》：拿「磨」反复摩擦「铁杵」，来回磨很多下，杵越磨越细，最后变成「针」。
// 持续型交互——机制本身就在演绎“只要功夫深”。
export default {
  meta: { id: 15 },

  init({ stage, Token }) {
    const chu = new Token({ value: '铁杵', x: 196, y: 250, className: 'token--metal' });
    const stone = new Token({ value: '磨', x: 70, y: 250, className: 'token--metal' });
    stage.addToken(chu);
    stage.addToken(stone);

    const NEED = 10; // 来回摩擦的次数
    let rubs = 0;
    let lastX = null;
    let lastDir = 0;
    let done = false;

    const overlapping = () => stage.distance(stone, chu) < 72;

    async function oneRub() {
      rubs += 1;
      const c = tokenCenter(stage, chu);
      sparks(stage, c.x, c.y, 'var(--fire)');
      const p = Math.min(1, rubs / NEED);
      chu.face.style.transform = `scaleX(${1 - 0.66 * p})`; // 越磨越细
      if (rubs >= NEED && !done) {
        done = true;
        chu.face.style.transform = '';
        await chu.morphTo('针');
        floatText(stage, c.x, c.y - 30, '磨成针！', 'good');
        chu.pulse();
      }
    }

    stage.setHandlers({
      onMove: (token) => {
        if (done || token !== stone || !overlapping()) { lastX = null; return; }
        const x = stone.center.x;
        if (lastX != null) {
          const dir = Math.sign(x - lastX);
          if (dir !== 0 && lastDir !== 0 && dir !== lastDir) oneRub(); // 来回一次算一下
          if (dir !== 0) lastDir = dir;
        }
        lastX = x;
      },
    });

    return {};
  },
};
