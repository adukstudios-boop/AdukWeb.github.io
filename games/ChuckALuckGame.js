// games/ChuckALuckGame.js
import { BaseGame } from './BaseGame.js';

export class ChuckALuckGame extends BaseGame {
  mount(container) {
    super.mount(container);
    container.innerHTML = this.render();
    this.cacheElements();
    this.attachEvents();
  }
  render() {
    return `
            <h2>Chuck-a-Luck</h2>
            <div style="font-size: 2rem; text-align: center; margin:20px;">
                🎲 <span id="chuck-dice1">⚀</span> <span id="chuck-dice2">⚀</span> <span id="chuck-dice3">⚀</span> 🎲
            </div>
            <div class="balance-box">Balance: $<span id="chuck-balance">${window.balance}</span></div>
            <div class="game-controls">
                <input type="number" id="chuck-bet" min="1" value="10">
                <select id="chuck-number">
                    <option value="1">1</option><option value="2">2</option><option value="3">3</option>
                    <option value="4">4</option><option value="5">5</option><option value="6">6</option>
                </select>
                <button class="btn btn-primary" id="chuck-roll">Roll</button>
                <span id="chuck-message"></span>
            </div>
        `;
  }
  cacheElements() {
    this.dice1Span = this.container.querySelector('#chuck-dice1');
    this.dice2Span = this.container.querySelector('#chuck-dice2');
    this.dice3Span = this.container.querySelector('#chuck-dice3');
    this.balanceSpan = this.container.querySelector('#chuck-balance');
    this.betInput = this.container.querySelector('#chuck-bet');
    this.numberSelect = this.container.querySelector('#chuck-number');
    this.messageSpan = this.container.querySelector('#chuck-message');
    this.rollBtn = this.container.querySelector('#chuck-roll');
  }
  attachEvents() {
    this.rollBtn.addEventListener('click', () => this.roll());
  }
  roll() {
    const bet = parseInt(this.betInput.value);
    if (bet > window.balance) {
      alert('Insufficient balance');
      return;
    }
    window.balance -= bet;
    window.updateGlobalBalance();
    this.balanceSpan.textContent = window.balance;
    
    const dice = [
      Math.floor(Math.random() * 6) + 1,
      Math.floor(Math.random() * 6) + 1,
      Math.floor(Math.random() * 6) + 1
    ];
    const diceSymbols = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
    this.dice1Span.textContent = diceSymbols[dice[0] - 1];
    this.dice2Span.textContent = diceSymbols[dice[1] - 1];
    this.dice3Span.textContent = diceSymbols[dice[2] - 1];
    
    const number = parseInt(this.numberSelect.value);
    const count = dice.filter(d => d === number).length;
    let payout = 0;
    if (count === 1) payout = bet;
    else if (count === 2) payout = bet * 2;
    else if (count === 3) payout = bet * 10;
    if (payout > 0) {
      window.balance += bet + payout;
      window.updateGlobalBalance();
      this.messageSpan.textContent = `You won $${payout}! (${count} matches)`;
    } else {
      this.messageSpan.textContent = 'No match. You lose.';
    }
    this.balanceSpan.textContent = window.balance;
  }
}