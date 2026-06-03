import { el } from '../engine/dom.js';
import { smoke, floatText, glideTo } from '../engine/effects.js';

// 第 17 关《杯水车薪》：别浇那杯水（压不住）。把锅底下的「柴（薪）」抽出来——火灭，拿到「薪」。
// 横向思维：最显眼的“浇水”是诱饵，真正的解法是釜底抽薪。
export default {
  meta: { id: 17 },

  init({ stage, Token }) {
    const W = stage.el.clientWidth || 344;
    const cx = Math.round(W / 2 - 32);

    const stove = el('div', { class: 'stove' });
    Object.assign(stove.style, { left: `${cx - 1}px`, top: '152px' });
    const flames = el('div', { class: 'flames' });
    stove.append(flames);
    stage.el.append(stove);

    const fu = new Token({ value: '釜', x: cx, y: 118, className: 'token--prop' });
    const xin = new Token({ value: '薪', x: cx, y: 300, className: 'token--plant' });
    const water = new Token({ value: '水', x: 56, y: 360, className: 'token--water' });
    const waterHome = { x: 56, y: 360 };

    let out = false;
    const stoveCenter = { x: cx + 32, y: 232 };
    const distTo = (token, p) => {
      const r = stage.el.getBoundingClientRect();
      return Math.hypot((token.center.x - r.left) - p.x, (token.center.y - r.top) - p.y);
    };

    function extinguish() {
      if (out) return;
      out = true;
      flames.classList.add('out');
      smoke(stage, cx + 32, 206);
      floatText(stage, cx + 32, 176, '釜底抽薪！', 'good');
    }

    stage.setHandlers({
      onMove: (token) => {
        if (token === xin && !out && distTo(xin, stoveCenter) > 118) extinguish();
      },
      onDrop: async (token) => {
        if (token === water) { // 诱饵：杯水车薪
          if (!out && distTo(water, stoveCenter) < 116) {
            smoke(stage, cx + 32, 200, 'rgba(200,210,220,0.85)');
            floatText(stage, cx + 32, 176, '杯水车薪…', 'warn');
            await glideTo(water, waterHome.x, waterHome.y, 260);
          }
          return true;
        }
        if (token === xin && !out && distTo(xin, stoveCenter) > 118) {
          extinguish();
          return true;
        }
        return false;
      },
    });

    stage.addToken(fu, { draggable: false });
    stage.addToken(xin);
    stage.addToken(water);
    return {};
  },
};
