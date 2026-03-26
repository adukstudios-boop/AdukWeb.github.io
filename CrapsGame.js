// games/CrapsGame.js
import { BaseGame } from './BaseGame.js';

export class CrapsGame extends BaseGame {
  mount(container) {
    super.mount(container);
    container.innerHTML = this.render();
    this.cacheElements();
    this.attachEvents();
    this.point = null;
    this.gameState = 'comeout';
  }
  render() {
    return `
            <h2>Craps (Simplified)</h2>
            <div style="font-size: 2rem; text-align: center; margin:20px;">
                🎲 <span id="craps-dice1">⚀</span> <span id="craps-dice2">⚀</span> 🎲
            </div>
            <div>Point: <span id="craps-point">-</span></div>
            <div class="balance-box">Balance: $<span id="craps-balance">${window.balance}</span></div>
            <div class="game-controls">
                <input type="number" id="craps-bet" min="1" value="10">
                <button class="btn btn-primary" id="craps-roll">Roll</button>
                <span id="craps-message"></span>
            </div>
        `;
  }
  cacheElements() {
    this.dice1Span = this.container.querySelector('#craps-dice1');
    this.dice2Span = this.container.querySelector('#craps-dice2');
    this.pointSpan = this.container.querySelector('#craps-point');
    this.balanceSpan = this.container.querySelector('#craps-balance');
    this.betInput = this.container.querySelector('#craps-bet');
    this.messageSpan = this.container.querySelector('#craps-message');
    this.rollBtn = this.container.querySelector('#craps-roll');
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
    // Only deduct bet at the start of a new round? For simplicity, deduct each roll.
    // Better: only deduct when betting? We'll do standard: bet placed before comeout roll.
    if (this.gameState === 'comeout') {
      window.balance -= bet;
      window.updateGlobalBalance();
      this.balanceSpan.textContent = window.balance;
    }
    
    const die1 = Math.floor(Math.random() * 6) + 1;
    const die2 = Math.floor(Math.random() * 6) + 1;
    const sum = die1 + die2;
    const diceSymbols = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
    this.dice1Span.textContent = diceSymbols[die1 - 1];
    this.dice2Span.textContent = diceSymbols[die2 - 1];
    
    let win = false;
    let message = '';
    if (this.gameState === 'comeout') {
      if (sum === 7 || sum === 11) {
        win = true;
        message = `Comeout roll ${sum}. You win!`;
        this.gameState = 'comeout';
      } else if (sum === 2 || sum === 3 || sum === 12) {
        win = false;
        message = `Comeout roll ${sum}. Craps! You lose.`;
        this.gameState = 'comeout';
      } else {
        this.point = sum;
        this.pointSpan.textContent = this.point;
        this.gameState = 'point';
        message = `Point is ${sum}. Roll again.`;
      }
    } else if (this.gameState === 'point') {
      if (sum === this.point) {
        win = true;
        message = `You made the point! You win!`;
        this.gameState = 'comeout';
        this.pointSpan.textContent = '-';
      } else if (sum === 7) {
        win = false;
        message = `Seven out! You lose.`;
        this.gameState = 'comeout';
        this.pointSpan.textContent = '-';
      } else {
        message = `Rolled ${sum}. Point is still ${this.point}.`;
      }
    }
    
    if (win) {
      const winAmount = bet * 2;
      window.balance += winAmount;
      window.updateGlobalBalance();
      this.messageSpan.textContent = `${message} +$${winAmount}`;
    } else if (this.gameState === 'comeout' && !win && message.includes('lose')) {
      this.messageSpan.textContent = message;
    } else {
      this.messageSpan.textContent = message;
    }
    this.balanceSpan.textContent = window.balance;
  }
}