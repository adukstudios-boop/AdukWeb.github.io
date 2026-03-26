// games/PullTabsGame.js
import { BaseGame } from './BaseGame.js';

export class PullTabsGame extends BaseGame {
  mount(container) {
    super.mount(container);
    container.innerHTML = this.render();
    this.cacheElements();
    this.attachEvents();
  }
  render() {
    return `
            <h2>Pull Tabs</h2>
            <div style="display: flex; gap: 20px; justify-content: center; margin: 20px;">
                <div id="pulltab-tab" style="width:100px; height:150px; background:#8B4513; border-radius:8px; display:flex; align-items:center; justify-content:center; cursor:pointer; color:white;">PULL</div>
            </div>
            <div id="pulltab-result" style="text-align:center; margin:10px;"></div>
            <div class="balance-box">Balance: $<span id="pulltab-balance">${window.balance}</span></div>
            <div class="game-controls">
                <input type="number" id="pulltab-bet" min="1" value="10">
                <button class="btn btn-primary" id="pulltab-buy">Buy Tab ($5)</button>
                <span id="pulltab-message"></span>
            </div>
        `;
  }
  cacheElements() {
    this.tabDiv = this.container.querySelector('#pulltab-tab');
    this.resultDiv = this.container.querySelector('#pulltab-result');
    this.balanceSpan = this.container.querySelector('#pulltab-balance');
    this.betInput = this.container.querySelector('#pulltab-bet');
    this.messageSpan = this.container.querySelector('#pulltab-message');
    this.buyBtn = this.container.querySelector('#pulltab-buy');
  }
  attachEvents() {
    this.buyBtn.addEventListener('click', () => this.buy());
    this.tabDiv.addEventListener('click', () => this.pull());
  }
  buy() {
    const price = 5;
    if (price > window.balance) {
      this.messageSpan.textContent = 'Insufficient balance';
      return;
    }
    window.balance -= price;
    window.updateGlobalBalance();
    this.balanceSpan.textContent = window.balance;
    this.hasTab = true;
    this.tabDiv.textContent = 'PULL';
    this.resultDiv.textContent = '';
    this.messageSpan.textContent = 'Tab purchased! Click to pull.';
  }
  pull() {
    if (!this.hasTab) {
      this.messageSpan.textContent = 'Buy a tab first.';
      return;
    }
    this.hasTab = false;
    // Simulate pull-tab prize: random between $0 and $20
    const prize = Math.floor(Math.random() * 21);
    this.tabDiv.textContent = prize ? `$${prize}` : 'LOSE';
    if (prize > 0) {
      window.balance += prize;
      window.updateGlobalBalance();
      this.resultDiv.innerHTML = `You won $${prize}!`;
    } else {
      this.resultDiv.innerHTML = 'Sorry, no prize.';
    }
    this.balanceSpan.textContent = window.balance;
    this.messageSpan.textContent = 'Buy another tab to play again.';
  }
}