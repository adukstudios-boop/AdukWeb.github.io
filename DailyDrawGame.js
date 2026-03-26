// games/DailyDrawGame.js
import { BaseGame } from './BaseGame.js';

export class DailyDrawGame extends BaseGame {
  mount(container) {
    super.mount(container);
    container.innerHTML = this.render();
    this.cacheElements();
    this.attachEvents();
    this.lastDraw = localStorage.getItem('dailyDrawLast') ? new Date(localStorage.getItem('dailyDrawLast')) : null;
    this.updateUI();
  }
  render() {
    return `
            <h2>Daily Draw</h2>
            <div style="margin:20px; text-align:center;">
                <div style="font-size:2rem;">🎟️</div>
                <p>Pick 3 numbers (1-10)</p>
                <div id="daily-draw-numbers" style="display:flex; gap:10px; justify-content:center; margin:10px;">
                    <select id="daily-draw-n1">${this.numberOptions()}</select>
                    <select id="daily-draw-n2">${this.numberOptions()}</select>
                    <select id="daily-draw-n3">${this.numberOptions()}</select>
                </div>
                <button class="btn btn-primary" id="daily-draw-play">Play (cost $10)</button>
                <div id="daily-draw-result" style="margin-top:20px;"></div>
            </div>
            <div class="balance-box">Balance: $<span id="daily-draw-balance">${window.balance}</span></div>
            <span id="daily-draw-message"></span>
        `;
  }
  numberOptions() {
    let opts = '';
    for (let i = 1; i <= 10; i++) opts += `<option value="${i}">${i}</option>`;
    return opts;
  }
  cacheElements() {
    this.n1 = this.container.querySelector('#daily-draw-n1');
    this.n2 = this.container.querySelector('#daily-draw-n2');
    this.n3 = this.container.querySelector('#daily-draw-n3');
    this.playBtn = this.container.querySelector('#daily-draw-play');
    this.resultDiv = this.container.querySelector('#daily-draw-result');
    this.balanceSpan = this.container.querySelector('#daily-draw-balance');
    this.messageSpan = this.container.querySelector('#daily-draw-message');
  }
  attachEvents() {
    this.playBtn.addEventListener('click', () => this.play());
  }
  updateUI() {
    const today = new Date().toDateString();
    const lastDraw = this.lastDraw ? this.lastDraw.toDateString() : null;
    if (lastDraw === today) {
      this.playBtn.disabled = true;
      this.resultDiv.innerHTML = 'You have already played today. Come back tomorrow!';
    } else {
      this.playBtn.disabled = false;
    }
  }
  play() {
    const bet = 10;
    if (bet > window.balance) {
      this.messageSpan.textContent = 'Insufficient balance';
      return;
    }
    const today = new Date().toDateString();
    if (this.lastDraw && this.lastDraw.toDateString() === today) {
      this.messageSpan.textContent = 'Already played today.';
      return;
    }
    window.balance -= bet;
    window.updateGlobalBalance();
    this.balanceSpan.textContent = window.balance;
    
    const picks = [parseInt(this.n1.value), parseInt(this.n2.value), parseInt(this.n3.value)];
    const draw = [Math.floor(Math.random() * 10) + 1, Math.floor(Math.random() * 10) + 1, Math.floor(Math.random() * 10) + 1];
    const matches = picks.filter((p, i) => p === draw[i]).length;
    let win = 0;
    if (matches === 3) win = 100;
    else if (matches === 2) win = 20;
    else if (matches === 1) win = 5;
    if (win > 0) {
      window.balance += win;
      window.updateGlobalBalance();
      this.resultDiv.innerHTML = `Draw: ${draw.join(', ')}. You matched ${matches}! Won $${win}!`;
    } else {
      this.resultDiv.innerHTML = `Draw: ${draw.join(', ')}. No matches. You lost.`;
    }
    this.balanceSpan.textContent = window.balance;
    this.lastDraw = new Date();
    localStorage.setItem('dailyDrawLast', this.lastDraw.toISOString());
    this.updateUI();
  }
}