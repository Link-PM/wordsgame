import { showLevelSelect } from './ui/level-select.js';
import { showLevel } from './ui/level-screen.js';

const root = document.getElementById('app');

const nav = {
  back: () => showLevelSelect(root, { onPick: (id) => showLevel(root, id, nav) }),
};

// 进入选关界面。
nav.back();
