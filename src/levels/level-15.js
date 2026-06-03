import { sparks, flash, floatText } from '../engine/effects.js';

// 第 15 关《一针见血》：拿「磨」反复摩擦「铁杵」，来回磨很多下，杵越磨越细、迸出火花，最后变「针」。
export default {
  meta: { id: 15 },

  init({ stage, Token }) {
    const chu = new Token({ value: '铁杵', x: 196, y: 250, className: 'token--metal' });
    const stone = new Token({ value: '磨', x: 70, y: 250, className: 'token--metal' });
    stage.addToken(chu);
    stage.addToken(stone);

    const NEED = 10;
    let rubs = 0;
    let lastX = null;
    let lastDir = 0;
    let moveCount = 0;
    let done = false;

    const overlapping = () => stage.distance(stone, chu) < 74;

    // 接触点（两块中间），火花从这里迸出
    function contact() {
      const a = stone.center;
      const b = chu.center;
      const r = stage.el.getBoundingClientRect();
      return { x: (a.x + b.x) / 2 - r.left, y: (a.y + b.y) / 2 - r.top };
    }

    function setGlow(p) {
      chu.el.style.boxShadow =
        `0 0 ${8 + p * 22}px ${1 + p * 4}px rgba(255, ${Math.round(150 - p * 90)}, 30, ${0.25 + p * 0.55}), var(--shadow)`;
    }

    async function oneRub() {
      rubs += 1;
      const p = Math.min(1, rubs / NEED);
      const c = contact();
      sparks(stage, c.x, c.y, 'var(--fire)');   // 双层迸溅
      sparks(stage, c.x, c.y, '#ffd84d');
      flash(stage, c.x, c.y);                    // 白热闪光
      setGlow(p);                                // 铁杵越磨越烫
      chu.face.style.transform = `scaleX(${1 - 0.66 * p})`;
      if (rubs >= NEED && !done) {
        done = true;
        chu.face.style.transform = '';
        chu.el.style.boxShadow = '';
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
          if (dir !== 0 && (++moveCount % 3 === 0)) { const c = contact(); sparks(stage, c.x, c.y, 'var(--fire)'); }
          if (dir !== 0 && lastDir !== 0 && dir !== lastDir) oneRub(); // 来回一次算一下
          if (dir !== 0) lastDir = dir;
        }
        lastX = x;
      },
    });

    return {};
  },
};
