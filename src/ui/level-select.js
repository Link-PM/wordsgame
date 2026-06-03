import { el, mount } from '../engine/dom.js';
import { LEVELS, CHAPTERS } from '../levels/data.js';
import { Progress } from '../game/progress.js';

// 选关界面：按章节分组，显示编号 / 成语 / 难度，以及解锁、通关状态。
export function showLevelSelect(root, { onPick }) {
  const screen = el('div', { class: 'screen select-screen' },
    el('header', { class: 'select-header' },
      el('h1', { class: 'select-title', text: '你从来没玩过的完形填空' }),
      el('p', { class: 'select-sub', text: '把桌上的东西，变成那个缺的字' }),
    ),
  );

  for (const chapter of CHAPTERS) {
    const grid = el('div', { class: 'level-grid' });
    for (const lvl of LEVELS.filter((l) => l.chapter === chapter.id)) {
      grid.append(levelCard(lvl, onPick));
    }
    screen.append(
      el('section', { class: 'chapter' },
        el('h2', { class: 'chapter-title', text: chapter.title }),
        grid,
      ),
    );
  }

  screen.append(
    el('footer', { class: 'select-footer' },
      el('button', {
        class: 'btn btn--ghost',
        onClick: () => {
          if (confirm('确定清除所有通关进度？')) {
            Progress.reset();
            showLevelSelect(root, { onPick });
          }
        },
      }, '清除进度'),
    ),
  );

  mount(root, screen);
}

function levelCard(lvl, onPick) {
  const done = Progress.isComplete(lvl.id);
  const unlocked = Progress.isUnlocked(lvl.id);
  const stars = '★'.repeat(lvl.difficulty) + '☆'.repeat(4 - lvl.difficulty);

  const card = el('button', {
    class: `level-card${done ? ' is-done' : ''}${unlocked ? '' : ' is-locked'}`,
    // 开发阶段：所有关卡都可点开预览（不强制线性解锁）。
    onClick: () => onPick(lvl.id),
  },
    el('div', { class: 'level-card__no', text: String(lvl.id) }),
    // 不外露谜底：未通关只显示挖空题面，通关后才显示完整成语。
    el('div', { class: 'level-card__name', text: done ? lvl.title : lvl.template }),
    el('div', { class: 'level-card__stars', text: stars }),
    el('div', { class: 'level-card__tag', text: lvl.implemented ? (done ? '已通关' : '可玩') : '待开发' }),
  );
  return card;
}
