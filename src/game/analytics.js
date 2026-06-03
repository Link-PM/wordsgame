// 51.LA 自定义事件封装。
// 注意：51.LA 的「事件分析」自 2022-05 起默认关闭，需在 51.LA 后台开启后，自定义事件才会被记录。
// PV / UV 是 SDK 自动统计的，不依赖这里。
function track(event, params) {
  try {
    if (window.LA && typeof window.LA.track === 'function') {
      window.LA.track(event, params);
    }
  } catch (e) {
    /* 统计失败绝不影响游戏 */
  }
}

// 关卡通关：用同一个事件名 + level 参数，后台可按 level 拆分出“各关通关数”。
export function trackLevelClear(id, title) {
  track('pass_level', { level: String(id), name: title });
}
