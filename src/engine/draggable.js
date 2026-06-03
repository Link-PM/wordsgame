// 用 Pointer Events 统一鼠标 / 触摸，让 token 在舞台内拖动。
// 坐标基于 token 自身的 translate(x, y)，与舞台布局无关。
export function makeDraggable(token, handlers = {}) {
  const node = token.el;
  let dragging = false;
  let pointerId = null;
  let startX = 0;
  let startY = 0;
  let originX = 0;
  let originY = 0;

  function onDown(e) {
    if (token.locked || !token.draggable) return;
    dragging = true;
    pointerId = e.pointerId;
    node.setPointerCapture(pointerId);
    node.classList.add('dragging');
    startX = e.clientX;
    startY = e.clientY;
    originX = token.x;
    originY = token.y;
    handlers.onStart?.(token, e);
    e.preventDefault();
  }

  function onMove(e) {
    if (!dragging || e.pointerId !== pointerId) return;
    token.moveTo(originX + (e.clientX - startX), originY + (e.clientY - startY));
    handlers.onMove?.(token, e);
  }

  function onUp(e) {
    if (!dragging || e.pointerId !== pointerId) return;
    dragging = false;
    node.classList.remove('dragging');
    if (node.hasPointerCapture?.(pointerId)) node.releasePointerCapture(pointerId);
    pointerId = null;
    handlers.onDrop?.(token, e);
  }

  node.addEventListener('pointerdown', onDown);
  node.addEventListener('pointermove', onMove);
  node.addEventListener('pointerup', onUp);
  node.addEventListener('pointercancel', onUp);

  // 返回解绑函数，便于关卡销毁时清理。
  return () => {
    node.removeEventListener('pointerdown', onDown);
    node.removeEventListener('pointermove', onMove);
    node.removeEventListener('pointerup', onUp);
    node.removeEventListener('pointercancel', onUp);
  };
}
