const KEY = 'hanzi-puzzle/progress/v1';

// 进度存储：哪些关卡通关了。默认线性解锁（过了第 N 关才解锁第 N+1 关）。
export const Progress = {
  load() {
    try {
      return JSON.parse(localStorage.getItem(KEY)) || { completed: [] };
    } catch {
      return { completed: [] };
    }
  },

  save(state) {
    localStorage.setItem(KEY, JSON.stringify(state));
  },

  complete(id) {
    const state = this.load();
    if (!state.completed.includes(id)) {
      state.completed.push(id);
      this.save(state);
    }
  },

  isComplete(id) {
    return this.load().completed.includes(id);
  },

  isUnlocked(id) {
    return id === 1 || this.isComplete(id - 1);
  },

  reset() {
    localStorage.removeItem(KEY);
  },
};
