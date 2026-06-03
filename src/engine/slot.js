import { el } from './dom.js';

// 题面里的一个填空格。answer 是期望填入的字。
export class Slot {
  constructor(answer) {
    this.answer = answer;
    this.filled = false;
    this.el = el('span', { class: 'slot', text: '＿' });
  }

  accepts(token) {
    return !this.filled && token.value === this.answer;
  }

  fill(value) {
    this.filled = true;
    this.el.textContent = value;
    this.el.classList.add('slot--filled');
  }

  rect() {
    return this.el.getBoundingClientRect();
  }
}
