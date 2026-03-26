// games/Lucky7Game.js
import { BaseGame } from './BaseGame.js';

export class Lucky7Game extends BaseGame {
  mount(container) {
    super.mount(container);
    container.innerHTML = this.render();
    this.cacheElements();
    this.attachEvents();
  }
  render() {
    return `
            <h2>Lucky 7</h2>
            <div style="display: flex; gap: 20px; justify-content: center; margin: 20px 0;">
                <div class="reel" data-reel="0">7️⃣</div>
                <div class="reel" data-reel="1">7️⃣</div>
                <div class="reel" data-reel="2">7️⃣</div>
            </div>
            <div class="balance-box">Balance: $<span id="lucky7-balance">${window.balance}</span></div>
            <div class="game-controls">
                <input type="number" id="lucky7-bet" min="1" value="10">
                <button class="btn btn-primary" id="lucky7-spin">Spin</button>
                <span id="lucky7-message"></span>
            </div>
        `;
  }
  cacheElements() {
    this.reels = this.container.querySelectorAll('.reel');
    this.balanceSpan = this.container.querySelector('#lucky7-balance');
    this.betInput = this.container.querySelector('#lucky7-bet');
    this.messageSpan = this.container.querySelector('#lucky7-message');
    this.spinBtn = this.container.querySelector('#lucky7-spin');
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
    
    const symbols = ['7️⃣', '🍒', '🍋', '🍊', '🔔', '💵'];
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
      if (r1 === '7️⃣') win = bet * 777;
      else if (r1 === '💵') win = bet * 10;
      else if (r1 === '🔔') win = bet * 5;
      else win = bet * 3;
    } else if (r1 === '7️⃣' || r2 === '7️⃣' || r3 === '7️⃣') {
      win = bet * 2;
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