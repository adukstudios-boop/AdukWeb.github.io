// games/DiceGame.js
import { BaseGame } from './BaseGame.js';

export class DiceGame extends BaseGame {
  mount(container) {
    super.mount(container);
    container.innerHTML = this.render();
    this.cacheElements();
    this.attachEvents();
  }
  render() {
    return `
            <h2>Dice</h2>
            <div style="font-size: 3rem; text-align: center; margin:20px;" id="dice-result">🎲</div>
            <div class="balance-box">Balance: $<span id="dice-balance">${window.balance}</span></div>
            <div class="game-controls">
                <input type="number" id="dice-bet" min="1" value="10">
                <select id="dice-pick">
                    <option value="over3">Over 3</option>
                    <option value="under4">Under 4</option>
                    <option value="odd">Odd</option>
                    <option value="even">Even</option>
                    <option value="1">1</option><option value="2">2</option><option value="3">3</option>
                    <option value="4">4</option><option value="5">5</option><option value="6">6</option>
                </select>
                <button class="btn btn-primary" id="dice-roll">Roll</button>
                <span id="dice-message"></span>
            </div>
        `;
  }
  cacheElements() {
    this.resultSpan = this.container.querySelector('#dice-result');
    this.balanceSpan = this.container.querySelector('#dice-balance');
    this.betInput = this.container.querySelector('#dice-bet');
    this.pickSelect = this.container.querySelector('#dice-pick');
    this.messageSpan = this.container.querySelector('#dice-message');
    this.rollBtn = this.container.querySelector('#dice-roll');
  }
  attachEvents() {
    this.rollBtn.addEventListener('click', () => this.roll());
  }
  roll() {
    const bet = parseInt(this.betInput.value);
    const pick = this.pickSelect.value;
    if (bet > window.balance) { alert('Insufficient balance'); return; }
    window.balance -= bet;
    window.updateGlobalBalance();
    const roll = Math.floor(Math.random() * 6) + 1;
    this.resultSpan.textContent = '🎲 ' + roll;
    let win = 0;
    if (pick === 'over3' && roll > 3) win = bet * 2;
    else if (pick === 'under4' && roll < 4) win = bet * 2;
    else if (pick === 'odd' && roll % 2 === 1) win = bet * 2;
    else if (pick === 'even' && roll % 2 === 0) win = bet * 2;
    else if (parseInt(pick) === roll) win = bet * 6;
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