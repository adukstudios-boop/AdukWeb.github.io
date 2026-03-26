// games/RouletteGame.js
import { BaseGame } from './BaseGame.js';

export class RouletteGame extends BaseGame {
  mount(container) {
    super.mount(container);
    container.innerHTML = this.render();
    this.cacheElements();
    this.attachEvents();
  }
  render() {
    return `
            <h2>Roulette</h2>
            <div style="font-size: 2rem; text-align: center; margin: 20px;" id="roulette-result">-</div>
            <div class="balance-box">Balance: $<span id="roulette-balance">${window.balance}</span></div>
            <div class="game-controls">
                <input type="number" id="roulette-bet" min="1" value="10">
                <input type="number" id="roulette-number" min="0" max="36" placeholder="Number (0-36)">
                <button class="btn btn-primary" id="roulette-spin">Spin</button>
                <span id="roulette-message"></span>
            </div>
        `;
  }
  cacheElements() {
    this.resultSpan = this.container.querySelector('#roulette-result');
    this.balanceSpan = this.container.querySelector('#roulette-balance');
    this.betInput = this.container.querySelector('#roulette-bet');
    this.numberInput = this.container.querySelector('#roulette-number');
    this.messageSpan = this.container.querySelector('#roulette-message');
    this.spinBtn = this.container.querySelector('#roulette-spin');
  }
  attachEvents() {
    this.spinBtn.addEventListener('click', () => this.spin());
  }
  spin() {
    const bet = parseInt(this.betInput.value);
    const number = parseInt(this.numberInput.value);
    if (isNaN(number) || number < 0 || number > 36) {
      alert('Pick a number 0-36');
      return;
    }
    if (bet > window.balance) {
      alert('Insufficient balance');
      return;
    }
    window.balance -= bet;
    window.updateGlobalBalance();
    this.balanceSpan.textContent = window.balance;
    
    const result = Math.floor(Math.random() * 37);
    this.resultSpan.textContent = result;
    
    const win = (result === number) ? bet * 35 : 0;
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