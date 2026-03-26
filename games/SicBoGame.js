// games/SicBoGame.js
import { BaseGame } from './BaseGame.js';

export class SicBoGame extends BaseGame {
  mount(container) {
    super.mount(container);
    container.innerHTML = this.render();
    this.cacheElements();
    this.attachEvents();
  }
  render() {
    return `
            <h2>Sic Bo</h2>
            <div style="font-size: 2rem; text-align: center; margin:20px;">
                🎲 <span id="sicbo-dice1">⚀</span> <span id="sicbo-dice2">⚀</span> <span id="sicbo-dice3">⚀</span> 🎲
            </div>
            <div class="balance-box">Balance: $<span id="sicbo-balance">${window.balance}</span></div>
            <div class="game-controls">
                <input type="number" id="sicbo-bet" min="1" value="10">
                <select id="sicbo-bet-type">
                    <option value="small">Small (4-10)</option>
                    <option value="big">Big (11-17)</option>
                    <option value="triple">Triple (all same)</option>
                </select>
                <button class="btn btn-primary" id="sicbo-roll">Roll</button>
                <span id="sicbo-message"></span>
            </div>
        `;
  }
  cacheElements() {
    this.dice1Span = this.container.querySelector('#sicbo-dice1');
    this.dice2Span = this.container.querySelector('#sicbo-dice2');
    this.dice3Span = this.container.querySelector('#sicbo-dice3');
    this.balanceSpan = this.container.querySelector('#sicbo-balance');
    this.betInput = this.container.querySelector('#sicbo-bet');
    this.betTypeSelect = this.container.querySelector('#sicbo-bet-type');
    this.messageSpan = this.container.querySelector('#sicbo-message');
    this.rollBtn = this.container.querySelector('#sicbo-roll');
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
    const total = dice[0] + dice[1] + dice[2];
    const diceSymbols = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
    this.dice1Span.textContent = diceSymbols[dice[0] - 1];
    this.dice2Span.textContent = diceSymbols[dice[1] - 1];
    this.dice3Span.textContent = diceSymbols[dice[2] - 1];
    
    const betType = this.betTypeSelect.value;
    let win = false;
    let payout = 0;
    if (betType === 'small' && total >= 4 && total <= 10 && !(dice[0] === dice[1] && dice[1] === dice[2])) {
      win = true;
      payout = bet;
    } else if (betType === 'big' && total >= 11 && total <= 17 && !(dice[0] === dice[1] && dice[1] === dice[2])) {
      win = true;
      payout = bet;
    } else if (betType === 'triple' && dice[0] === dice[1] && dice[1] === dice[2]) {
      win = true;
      payout = bet * 30;
    }
    if (win) {
      window.balance += bet + payout;
      window.updateGlobalBalance();
      this.messageSpan.textContent = `You won $${payout}!`;
    } else {
      this.messageSpan.textContent = `No win. Total: ${total}`;
    }
    this.balanceSpan.textContent = window.balance;
  }
}