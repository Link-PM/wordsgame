import { getLevel } from './data.js';

// 已实现交互的关卡 → 动态加载其模块（按需加载，避免一次性拉全部）。
// 实现新关卡时，在这里登记 id → loader 即可。
const loaders = {
  1: () => import('./level-01.js'),
  2: () => import('./level-02.js'),
  3: () => import('./level-03.js'),
  4: () => import('./level-04.js'),
  5: () => import('./level-05.js'),
  6: () => import('./level-06.js'),
  7: () => import('./level-07.js'),
  8: () => import('./level-08.js'),
  9: () => import('./level-09.js'),
  10: () => import('./level-10.js'),
  11: () => import('./level-11.js'),
  12: () => import('./level-12.js'),
  13: () => import('./level-13.js'),
  14: () => import('./level-14.js'),
  15: () => import('./level-15.js'),
  16: () => import('./level-16.js'),
  17: () => import('./level-17.js'),
  18: () => import('./level-18.js'),
};

export async function loadLevel(id) {
  const loader = loaders[id];
  if (!loader) return null;
  const mod = await loader();
  return mod.default;
}

export { getLevel };
