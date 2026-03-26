// games/SlotGame.js
import { BaseGame } from './BaseGame.js';

export class SlotGame extends BaseGame {
  mount(container) {
    super.mount(container);
    container.innerHTML = this.render();
    this.cacheElements();
    this.attachEvents();
  }
  render() {
    return `
            <h2>Slot Machine</h2>
            <div style="display: flex; gap: 20px; justify-content: center; margin: 20px 0;">
                <div class="reel" data-reel="0">🍒</div>
                <div class="reel" data-reel="1">🍒</div>
                <div class="reel" data-reel="2">🍒</div>
            </div>
            <div class="balance-box">Balance: $<span id="slot-balance">${window.balance}</span></div>
            <div class="game-controls">
                <input type="number" id="slot-bet" min="1" value="10">
                <button class="btn btn-primary" id="slot-spin">Spin</button>
                <span id="slot-message"></span>
            </div>
        `;
  }
  cacheElements() {
    this.reels = this.container.querySelectorAll('.reel');
    this.balanceSpan = this.container.querySelector('#slot-balance');
    this.betInput = this.container.querySelector('#slot-bet');
    this.messageSpan = this.container.querySelector('#slot-message');
    this.spinBtn = this.container.querySelector('#slot-spin');
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
    
    const symbols = ['🍒', '🍋', '🍊', '🍑', '🔔', '💵', '7️⃣'];
    const results = [
      symbols[Math.floor(Math.random() * symbols.length)],
      symbols[Math.floor(Math.random() * symbols.length)],
      symbols[Math.floor(Math.random() * symbols.length)]
    ];
    
    this.reels.forEach(r => r.classList.add('spinning'));
    setTimeout(() => {
      this.reels.forEach((r, i) => {
        r.classList.remove('spinning');
        r.textContent = results[i];
      });
      this.checkWin(results, bet);
    }, 400);
  }
  checkWin(results, bet) {
    let win = 0;
    const [r1, r2, r3] = results;
    if (r1 === r2 && r2 === r3) {
      if (r1 === '7️⃣') win = bet * 10;
      else if (r1 === '💵') win = bet * 7;
      else if (r1 === '🔔') win = bet * 5;
      else win = bet * 3;
    } else if (r1 === r2 || r2 === r3 || r1 === r3) {
      win = bet * 1.5;
    }
    if (win > 0) {
      window.balance += win;
      window.updateGlobalBalance();
      this.messageSpan.textContent = `You won $${win}!`;
    } else {
      this.messageSpan.textContent = 'No win.';
    }
    this.balanceSpan.textContent = window.balance;
  }
}