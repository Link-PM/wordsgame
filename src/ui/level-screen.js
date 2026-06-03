import { el, mount } from '../engine/dom.js';
import { Stage } from '../engine/stage.js';
import { Token } from '../engine/token.js';
import { Slot } from '../engine/slot.js';
import { getLevel, loadLevel } from '../levels/registry.js';
import { Progress } from '../game/progress.js';

// 单关界面：题面（含填空）+ 舞台。加载对应关卡模块并接管交互。
export async function showLevel(root, id, nav) {
  const meta = getLevel(id);
  const stage = new Stage();
  const slots = [];
  let levelInstance = null;
  let won = false;

  function destroy() {
    levelInstance?.destroy?.();
    stage.destroy();
  }

  // 题面：把 template 渲染成文字 + 填空格。
  const promptEl = el('div', { class: 'prompt' });
  let ai = 0;
  for (const ch of meta.template) {
    if (ch === '＿') {
      const slot = new Slot(meta.answers[ai++]);
      slots.push(slot);
      stage.registerSlot(slot);
      promptEl.append(slot.el);
    } else {
      promptEl.append(el('span', { class: 'prompt__char', text: ch }));
    }
  }

  const header = el('div', { class: 'level-header' },
    el('button', { class: 'btn btn--ghost', onClick: () => { destroy(); nav.back(); } }, '← 返回'),
    el('div', { class: 'level-name', text: `第 ${meta.id} 关` }),
    el('button', { class: 'btn btn--ghost', onClick: () => { destroy(); showLevel(root, id, nav); } }, '重玩'),
  );

  const tray = el('div', { class: 'tray', text: `素材：${meta.materials.join('　')}` });

  const screen = el('div', { class: 'screen level-screen' }, header, promptEl, tray, stage.el);

  stage.setHandlers({
    onAfterFill: () => {
      if (slots.every((s) => s.filled)) win();
    },
  });

  function win() {
    if (won) return;
    won = true;
    Progress.complete(id);
    const next = getLevel(id + 1);
    screen.append(
      el('div', { class: 'overlay' },
        el('div', { class: 'win-card' },
          el('div', { class: 'win-mark', text: '✓' }),
          el('div', { class: 'win-title', text: '过关' }),
          el('div', { class: 'win-idiom', text: meta.title }),
          el('div', { class: 'win-actions' },
            el('button', { class: 'btn', onClick: () => { destroy(); nav.back(); } }, '返回选关'),
            next && el('button', {
              class: 'btn btn--primary',
              onClick: () => { destroy(); showLevel(root, next.id, nav); },
            }, '下一关'),
          ),
        ),
      ),
    );
  }

  mount(root, screen);

  // 加载关卡交互；未实现的关卡显示占位说明。
  const mod = await loadLevel(id);
  if (mod) {
    levelInstance = mod.init({ stage, Token, Slot, meta }) || null;
  } else {
    stage.el.append(
      el('div', { class: 'todo-note' },
        el('div', { class: 'todo-note__title', text: '这一关的交互还没做' }),
        el('div', { class: 'todo-note__line', text: `玩法：${meta.mechanic}` }),
        el('div', { class: 'todo-note__line', text: `解法：${meta.solution}` }),
      ),
    );
  }
}
