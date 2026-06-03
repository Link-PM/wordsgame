import { el } from '../engine/dom.js';
import { proximityCharge } from '../engine/mechanics.js';
import { drip, smoke, sparks, flash, ripple, poof, tokenCenter } from '../engine/effects.js';

// 第 1 关《水能载舟》：火烤冰 → 冰下塌出汗、接触处滋滋冒汽、滴水 → 蓄满变「水」→ 拖入填空。
// 火熊熊燃烧、冰冒寒气（CSS）+ 不断窜出方框的火星 / 寒气（JS 在舞台层生成，不被方框裁剪）。
export default {
  meta: { id: 1 },

  init({ stage, Token }) {
    const fire = new Token({ value: '火', x: 70, y: 250, className: 'token--fire' });
    const ice = new Token({ value: '冰', x: 250, y: 250, className: 'token--ice' });
    ice.el.append(el('div', { class: 'charge-ring' }));
    ice.el.append(el('div', { class: 'melt-puddle' })); // 脚下随融化扩大的水洼

    stage.addToken(fire);
    stage.addToken(ice);

    // 从 token 顶部往上飘的粒子（火星 / 寒气），生成在舞台层，能窜出方框。
    function emit(token, cls, spread) {
      const r = token.el.getBoundingClientRect();
      const sr = stage.el.getBoundingClientRect();
      const node = el('div', { class: cls });
      node.style.left = `${r.left - sr.left + r.width / 2}px`;
      node.style.top = `${r.top - sr.top + 6}px`;
      node.style.setProperty('--dx', `${(Math.random() - 0.5) * spread}px`);
      stage.el.append(node);
      node.addEventListener('animationend', () => node.remove(), { once: true });
    }
    const emberTimer = setInterval(() => emit(fire, 'fx-ember', 30), 170);
    const vaporTimer = setInterval(() => { if (ice.value !== '水') emit(ice, 'fx-vaporpuff', 24); }, 300);

    // 冰朝着火的那一侧 = 滋滋融化的接触点
    function contact() {
      const ic = tokenCenter(stage, ice);
      const fc = tokenCenter(stage, fire);
      const dx = fc.x - ic.x;
      const dy = fc.y - ic.y;
      const d = Math.hypot(dx, dy) || 1;
      return { x: ic.x + (dx / d) * 22, y: ic.y + (dy / d) * 16, ic };
    }

    const charger = proximityCharge(stage, {
      source: fire,
      target: ice,
      range: 120,
      rate: 0.0105,
      chargingClass: 'heating',
      onProgress: (p, { near, frame }) => {
        if (!near) return;
        const { x, y, ic } = contact();
        if (frame % 6 === 0) drip(stage, ic.x + (Math.random() - 0.5) * 42, ic.y + 22);
        if (frame % 18 === 0) smoke(stage, x, y, 'rgba(228,244,252,.9)');
        if (frame % 14 === 0) sparks(stage, x, y, '#fff1c0');
      },
      onComplete: async () => {
        const c = tokenCenter(stage, ice);
        ice.el.querySelector('.charge-ring')?.remove();
        flash(stage, c.x, c.y);
        smoke(stage, c.x, c.y - 6, 'rgba(228,244,252,.95)');
        for (let i = 0; i < 7; i++) drip(stage, c.x + (Math.random() - 0.5) * 56, c.y + 8);
        ripple(stage, c.x, c.y + 24);
        ice.el.classList.remove('token--ice');
        await ice.morphTo('水');
        ice.el.classList.add('token--water');
        ice.el.querySelector('.melt-puddle')?.remove();
        poof(stage, c.x, c.y, 'var(--water)');
        ice.pulse();
      },
    });

    return {
      destroy() {
        charger.destroy();
        clearInterval(emberTimer);
        clearInterval(vaporTimer);
      },
    };
  },
};
