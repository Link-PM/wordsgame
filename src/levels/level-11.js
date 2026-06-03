import { wait } from '../engine/dom.js';
import { poof, floatText, tokenCenter } from '../engine/effects.js';

// 第 11 关《虎头蛇尾》：三个「人」聚到一起，一口咬定有虎——三人成虎，凭空“说”出一只「虎」。
export default {
  meta: { id: 11 },

  init({ stage, Token }) {
    const people = [
      new Token({ value: '人', x: 56, y: 140 }),
      new Token({ value: '人', x: 244, y: 150 }),
      new Token({ value: '人', x: 150, y: 330 }),
    ];
    people.forEach((p) => stage.addToken(p));
    let done = false;

    const clustered = () => {
      for (let i = 0; i < people.length; i++) {
        for (let j = i + 1; j < people.length; j++) {
          if (stage.distance(people[i], people[j]) > 122) return false;
        }
      }
      return true;
    };

    stage.setHandlers({
      onDrop: async () => {
        if (done || !clustered()) return false;
        done = true;
        const r = stage.el.getBoundingClientRect();
        const lx = people.reduce((s, p) => s + p.center.x, 0) / 3 - r.left;
        const ly = people.reduce((s, p) => s + p.center.y, 0) / 3 - r.top;

        people.forEach((p) => {
          const c = tokenCenter(stage, p);
          floatText(stage, c.x, c.y - 28, '有虎！', 'warn');
        });
        await wait(680);
        poof(stage, lx, ly, '#95613a');
        poof(stage, lx, ly, 'var(--gold)');
        people.forEach((p) => {
          p.el.style.transition = 'opacity .4s ease, transform .4s ease';
          p.el.style.opacity = '0';
          p.el.style.transformOrigin = 'center';
        });
        await wait(420);
        people.forEach((p) => stage.removeToken(p));
        const tiger = new Token({ value: '虎', x: Math.round(lx - 32), y: Math.round(ly - 32), className: 'token--beast' });
        stage.addToken(tiger);
        tiger.pulse();
        floatText(stage, lx, ly - 42, '三人成虎！', 'good');
        return true;
      },
    });

    return {};
  },
};
