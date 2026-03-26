// games/ScratchGame.js
import { BaseGame } from './BaseGame.js';

export class ScratchGame extends BaseGame {
  mount(container) {
    super.mount(container);
    container.innerHTML = this.render();
    this.cacheElements();
    this.attachEvents();
    this.card = ['?', '?', '?'];
    this.revealed = [false, false, false];
    this.purchased = false;
  }
  render() {
    return `
            <h2>Scratch Card</h2>
            <div style="display: flex; gap:20px; justify-content:center; margin:20px;">
                <div class="reel" id="scratch1" onclick="window.currentGame?.reveal(0)">?</div>
                <div class="reel" id="scratch2" onclick="window.currentGame?.reveal(1)">?</div>
                <div class="reel" id="scratch3" onclick="window.currentGame?.reveal(2)">?</div>
            </div>
            <div class="balance-box">Balance: $<span id="scratch-balance">${window.balance}</span></div>
            <div class="game-controls">
                <input type="number" id="scratch-bet" min="1" value="10">
                <button class="btn btn-primary" id="scratch-buy">Buy Card</button>
                <span id="scratch-message"></span>
            </div>
        `;
  }
  cacheElements() {
    this.balanceSpan = this.container.querySelector('#scratch-balance');
    this.betInput = this.container.querySelector('#scratch-bet');
    this.messageSpan = this.container.querySelector('#scratch-message');
    this.buyBtn = this.container.querySelector('#scratch-buy');
    this.reel1 = this.container.querySelector('#scratch1');
    this.reel2 = this.container.querySelector('#scratch2');
    this.reel3 = this.container.querySelector('#scratch3');
    window.currentGame = this; // to allow onclick from HTML
  }
  attachEvents() {
    this.buyBtn.addEventListener('click', () => this.buy());
  }
  buy() {
    const bet = parseInt(this.betInput.value);
    if (bet > window.balance) {
      alert('Insufficient balance');
      return;
    }
    window.balance -= bet;
    window.updateGlobalBalance();
    this.balanceSpan.textContent = window.balance;
    this.purchased = true;
    this.revealed = [false, false, false];
    this.reel1.textContent = '?';
    this.reel2.textContent = '?';
    this.reel3.textContent = '?';
    this.messageSpan.textContent = 'Click boxes to reveal';
    const symbols = ['🍒', '🍋', '🍊', '🍑', '🔔', '💵', '7️⃣', '💰'];
    this.card = [
      symbols[Math.floor(Math.random() * symbols.length)],
      symbols[Math.floor(Math.random() * symbols.length)],
      symbols[Math.floor(Math.random() * symbols.length)]
    ];
  }
  reveal(index) {
    if (!this.purchased) {
      alert('Buy a card first');
      return;
    }
    if (this.revealed[index]) return;
    this.revealed[index] = true;
    const reel = index === 0 ? this.reel1 : index === 1 ? this.reel2 : this.reel3;
    reel.textContent = this.card[index];
    if (this.revealed.every(v => v)) {
      if (this.card[0] === this.card[1] && this.card[1] === this.card[2]) {
        const win = parseInt(this.betInput.value) * 3;
        window.balance += win;
        window.updateGlobalBalance();
        this.messageSpan.textContent = `You won $${win}!`;
      } else {
        this.messageSpan.textContent = 'No win.';
      }
      this.purchased = false;
      this.balanceSpan.textContent = window.balance;
    }
  }
}