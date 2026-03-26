// games/MegaSpinGame.js
import { BaseGame } from './BaseGame.js';

export class MegaSpinGame extends BaseGame {
  mount(container) {
    super.mount(container);
    container.innerHTML = this.render();
    this.cacheElements();
    this.attachEvents();
  }
  render() {
    return `
            <h2>Mega Spin</h2>
            <div style="display: flex; gap: 20px; justify-content: center; margin: 20px 0;">
                <div class="reel" data-reel="0">⭐</div>
                <div class="reel" data-reel="1">⭐</div>
                <div class="reel" data-reel="2">⭐</div>
                <div class="reel" data-reel="3">⭐</div>
                <div class="reel" data-reel="4">⭐</div>
            </div>
            <div class="balance-box">Balance: $<span id="megaspin-balance">${window.balance}</span></div>
            <div class="game-controls">
                <input type="number" id="megaspin-bet" min="1" value="10">
                <button class="btn btn-primary" id="megaspin-spin">Mega Spin</button>
                <span id="megaspin-message"></span>
            </div>
        `;
  }
  cacheElements() {
    this.reels = this.container.querySelectorAll('.reel');
    this.balanceSpan = this.container.querySelector('#megaspin-balance');
    this.betInput = this.container.querySelector('#megaspin-bet');
    this.messageSpan = this.container.querySelector('#megaspin-message');
    this.spinBtn = this.container.querySelector('#megaspin-spin');
  }
  attachEvents() {
    this.spinBtn.addEventListener('click', () => this.spin());
  }
  spin() {
    const bet = parseInt(this.betInput.value);
    if (bet > window.balance) { alert('Insufficient balance'); return; }
    window.balance -= bet;
    window.updateGlobalBalance();
    this.balanceSpan.textContent = window.balance;
    
    const symbols = ['⭐', '✨', '🌟', '💫', '⚡', '🔥', '💎', '7️⃣'];
    const results = [];
    for (let i = 0; i < 5; i++) {
      results.push(symbols[Math.floor(Math.random() * symbols.length)]);
    }
    
    this.reels.forEach(r => r.classList.add('spinning'));
    setTimeout(() => {
      this.reels.forEach((r, i) => {
        r.classList.remove('spinning');
        r.textContent = results[i];
      });
      this.checkWin(results, bet);
    }, 500);
  }
  checkWin(results, bet) {
    // Count matching symbols
    const counts = {};
    results.forEach(s => counts[s] = (counts[s] || 0) + 1);
    let maxCount = Math.max(...Object.values(counts));
    let win = 0;
    if (maxCount >= 3) {
      if (maxCount === 5) win = bet * 50;
      else if (maxCount === 4) win = bet * 10;
      else win = bet * 3;
    }
    if (win > 0) {
      window.balance += win;
      window.updateGlobalBalance();
      this.messageSpan.textContent = `You won $${win}! (${maxCount} of a kind)`;
    } else {
      this.messageSpan.textContent = 'No win.';
    }
    this.balanceSpan.textContent = window.balance;
  }
}