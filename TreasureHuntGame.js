// games/TreasureHuntGame.js
import { BaseGame } from './BaseGame.js';

export class TreasureHuntGame extends BaseGame {
  mount(container) {
    super.mount(container);
    container.innerHTML = this.render();
    this.cacheElements();
    this.attachEvents();
    this.chests = [false, false, false];
    this.picked = [false, false, false];
    this.gameActive = false;
    window.currentGame = this;
  }
  render() {
    return `
            <h2>Treasure Hunt</h2>
            <div style="display: flex; gap: 20px; justify-content: center; margin: 20px;">
                <div class="reel" id="chest0" onclick="window.currentGame?.openChest(0)">📦</div>
                <div class="reel" id="chest1" onclick="window.currentGame?.openChest(1)">📦</div>
                <div class="reel" id="chest2" onclick="window.currentGame?.openChest(2)">📦</div>
            </div>
            <div class="balance-box">Balance: $<span id="treasure-balance">${window.balance}</span></div>
            <div class="game-controls">
                <input type="number" id="treasure-bet" min="1" value="10">
                <button class="btn btn-primary" id="treasure-start">Start Hunt</button>
                <span id="treasure-message"></span>
            </div>
        `;
  }
  cacheElements() {
    this.balanceSpan = this.container.querySelector('#treasure-balance');
    this.betInput = this.container.querySelector('#treasure-bet');
    this.messageSpan = this.container.querySelector('#treasure-message');
    this.startBtn = this.container.querySelector('#treasure-start');
    this.chestEls = [
      this.container.querySelector('#chest0'),
      this.container.querySelector('#chest1'),
      this.container.querySelector('#chest2')
    ];
  }
  attachEvents() {
    this.startBtn.addEventListener('click', () => this.start());
  }
  start() {
    const bet = parseInt(this.betInput.value);
    if (bet > window.balance) {
      alert('Insufficient balance');
      return;
    }
    window.balance -= bet;
    window.updateGlobalBalance();
    this.balanceSpan.textContent = window.balance;
    this.gameActive = true;
    this.picked = [false, false, false];
    this.chests = [false, false, false];
    // Randomly place treasure in one chest
    const treasureIndex = Math.floor(Math.random() * 3);
    this.chests[treasureIndex] = true;
    // Reset chest visuals
    this.chestEls.forEach(el => {
      el.textContent = '📦';
      el.style.background = '';
    });
    this.messageSpan.textContent = 'Choose a chest to find treasure!';
  }
  openChest(index) {
    if (!this.gameActive) {
      this.messageSpan.textContent = 'Click "Start Hunt" first.';
      return;
    }
    if (this.picked[index]) return;
    this.picked[index] = true;
    const hasTreasure = this.chests[index];
    const chestEl = this.chestEls[index];
    if (hasTreasure) {
      chestEl.textContent = '💎';
      chestEl.style.background = 'gold';
      const win = parseInt(this.betInput.value) * 5;
      window.balance += win;
      window.updateGlobalBalance();
      this.messageSpan.textContent = `You found the treasure! Won $${win}!`;
      this.gameActive = false;
    } else {
      chestEl.textContent = '💀';
      chestEl.style.background = '#444';
      this.messageSpan.textContent = 'Empty chest. Try again!';
      this.gameActive = false;
    }
    this.balanceSpan.textContent = window.balance;
  }
}