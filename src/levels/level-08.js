import { glideTo, poof, ripple, floatText, tokenCenter, bump } from '../engine/effects.js';

// 第 8 关《枯木逢春》：种子浇水 + 晒太阳 → 发芽成「苗」；再浇一次水 → 长成「木」。
// 「水」「日」是可重复使用的工具，用完自动归位。
export default {
  meta: { id: 8 },

  init({ stage, Token }) {
    const seed = new Token({ value: '种子', x: 168, y: 250, className: 'token--plant' });
    const water = new Token({ value: '水', x: 58, y: 150, className: 'token--water' });
    const sun = new Token({ value: '日', x: 58, y: 360, className: 'token--sun' });
    const waterHome = { x: 58, y: 150 };
    const sunHome = { x: 58, y: 360 };

    let watered = false;
    let sunned = false;
    let sprouted = false;

    const near = (a, b) => stage.distance(a, b) < 82;

    async function useTool(tool, home, kind) {
      const c = tokenCenter(stage, seed);
      if (kind === 'water') ripple(stage, c.x, c.y + 16);
      else poof(stage, c.x, c.y, '#d68a2e');
      bump(seed);
      await glideTo(tool, home.x, home.y, 220);
    }

    async function transform(to, label) {
      const c = tokenCenter(stage, seed);
      poof(stage, c.x, c.y, '#4f8a52');
      await seed.morphTo(to);
      bump(seed);
      floatText(stage, c.x, c.y - 30, label, 'good');
    }

    stage.setHandlers({
      onDrop: async (token) => {
        if (token === water && near(water, seed)) {
          if (!sprouted) {
            watered = true;
            await useTool(water, waterHome, 'water');
            if (watered && sunned) { sprouted = true; await transform('苗', '发芽了！'); }
          } else if (seed.value === '苗') {
            await useTool(water, waterHome, 'water');
            await transform('木', '长成大树！');
          } else {
            await useTool(water, waterHome, 'water');
          }
          return true;
        }
        if (token === sun && near(sun, seed)) {
          if (!sprouted) {
            sunned = true;
            await useTool(sun, sunHome, 'sun');
            if (watered && sunned) { sprouted = true; await transform('苗', '发芽了！'); }
          } else {
            await useTool(sun, sunHome, 'sun');
          }
          return true;
        }
        return false;
      },
    });

    stage.addToken(seed);
    stage.addToken(water);
    stage.addToken(sun);
    return {};
  },
};
