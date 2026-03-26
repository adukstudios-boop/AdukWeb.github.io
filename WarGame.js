// games/WarGame.js
import { BaseGame } from './BaseGame.js';

export class WarGame extends BaseGame {
  mount(container) {
    super.mount(container);
    container.innerHTML = this.render();
    this.cacheElements();
    this.attachEvents();
    this.deck = [];
    this.playerCard = null;
    this.aiCard = null;
  }
  render() {
    return `
            <h2>War</h2>
            <div style="display: flex; justify-content: space-around; margin:20px;">
                <div>AI: <span id="war-ai">?</span></div>
                <div>You: <span id="war-player">?</span></div>
            </div>
            <div class="balance-box">Balance: $<span id="war-balance">${window.balance}</span></div>
            <div class="game-controls">
                <input type="number" id="war-bet" min="1" value="10">
                <button class="btn btn-primary" id="war-deal">Deal</button>
                <span id="war-message"></span>
            </div>
        `;
  }
  cacheElements() {
    this.aiSpan = this.container.querySelector('#war-ai');
    this.playerSpan = this.container.querySelector('#war-player');
    this.balanceSpan = this.container.querySelector('#war-balance');
    this.betInput = this.container.querySelector('#war-bet');
    this.messageSpan = this.container.querySelector('#war-message');
    this.dealBtn = this.container.querySelector('#war-deal');
  }
  attachEvents() {
    this.dealBtn.addEventListener('click', () => this.deal());
  }
  deal() {
    const bet = parseInt(this.betInput.value);
    if (bet > window.balance) {
      alert('Insufficient balance');
      return;
    }
    window.balance -= bet;
    window.updateGlobalBalance();
    this.balanceSpan.textContent = window.balance;
    
    const suits = ['♠', '♥', '♦', '♣'];
    const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    this.deck = [];
    for (let s of suits) {
      for (let r of ranks) {
        this.deck.push(r + s);
      }
    }
    this.shuffle(this.deck);
    this.playerCard = this.deck.pop();
    this.aiCard = this.deck.pop();
    this.playerSpan.textContent = this.playerCard;
    this.aiSpan.textContent = this.aiCard;
    
    const playerVal = this.cardValue(this.playerCard);
    const aiVal = this.cardValue(this.aiCard);
    let message = '';
    if (playerVal > aiVal) {
      const win = bet * 2;
      window.balance += win;
      window.updateGlobalBalance();
      message = `You win $${win}!`;
    } else if (playerVal < aiVal) {
      message = 'AI wins.';
    } else {
      window.balance += bet;
      window.updateGlobalBalance();
      message = 'Tie. Bet returned.';
    }
    this.messageSpan.textContent = message;
    this.balanceSpan.textContent = window.balance;
  }
  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
  cardValue(card) {
    let rank = card.slice(0, -1);
    if (rank === 'A') return 14;
    if (rank === 'K') return 13;
    if (rank === 'Q') return 12;
    if (rank === 'J') return 11;
    if (rank === '10') return 10;
    return parseInt(rank);
  }
}