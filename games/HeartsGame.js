// games/HeartsGame.js
import { BaseGame } from './BaseGame.js';

export class HeartsGame extends BaseGame {
  mount(container) {
    super.mount(container);
    container.innerHTML = this.render();
    this.cacheElements();
    this.attachEvents();
    this.newGame();
  }
  render() {
    return `
            <h2>Hearts</h2>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span>Your hand: <span id="hearts-hand"></span></span>
                <span>Score: <span id="hearts-score">0</span></span>
            </div>
            <div style="display: flex; gap: 10px; justify-content: center; margin: 20px 0;" id="hearts-cards"></div>
            <div class="balance-box">Balance: $<span id="hearts-balance">${window.balance}</span></div>
            <div class="game-controls">
                <button class="btn btn-primary" id="hearts-deal">Deal</button>
                <span id="hearts-message"></span>
            </div>
        `;
  }
  cacheElements() {
    this.handSpan = this.container.querySelector('#hearts-hand');
    this.scoreSpan = this.container.querySelector('#hearts-score');
    this.balanceSpan = this.container.querySelector('#hearts-balance');
    this.cardsDiv = this.container.querySelector('#hearts-cards');
    this.messageSpan = this.container.querySelector('#hearts-message');
    this.dealBtn = this.container.querySelector('#hearts-deal');
  }
  attachEvents() {
    this.dealBtn.addEventListener('click', () => this.newGame());
  }
  newGame() {
    const bet = 10; // fixed bet for demo
    if (bet > window.balance) {
      this.messageSpan.textContent = 'Insufficient balance';
      return;
    }
    window.balance -= bet;
    window.updateGlobalBalance();
    this.balanceSpan.textContent = window.balance;
    
    // Create a simplified Hearts game: each player gets 3 cards, try to avoid hearts
    const suits = ['♠', '♥', '♦', '♣'];
    const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    this.deck = [];
    for (let s of suits) {
      for (let r of ranks) {
        this.deck.push(r + s);
      }
    }
    this.shuffle(this.deck);
    // Player gets 3 cards, AI gets 3
    this.playerHand = [this.deck.pop(), this.deck.pop(), this.deck.pop()];
    this.aiHand = [this.deck.pop(), this.deck.pop(), this.deck.pop()];
    this.renderHand();
    // Determine winner: player wins if has no hearts or fewer hearts than AI
    const playerHearts = this.playerHand.filter(c => c.endsWith('♥')).length;
    const aiHearts = this.aiHand.filter(c => c.endsWith('♥')).length;
    let win = false;
    let message = '';
    if (playerHearts === 0) {
      win = true;
      message = 'You have no hearts! You win!';
    } else if (playerHearts < aiHearts) {
      win = true;
      message = `You have fewer hearts (${playerHearts}) than AI (${aiHearts}). You win!`;
    } else {
      message = `You have ${playerHearts} hearts, AI has ${aiHearts}. You lose.`;
    }
    if (win) {
      const winAmount = bet * 2;
      window.balance += winAmount;
      window.updateGlobalBalance();
      this.messageSpan.textContent = `${message} +$${winAmount}`;
    } else {
      this.messageSpan.textContent = message;
    }
    this.balanceSpan.textContent = window.balance;
  }
  renderHand() {
    this.cardsDiv.innerHTML = '';
    this.playerHand.forEach(card => {
      const cardDiv = document.createElement('div');
      cardDiv.textContent = card;
      cardDiv.style.cssText = `
                width: 60px; height: 90px; background: white;
                border-radius: 8px; text-align: center; line-height: 90px;
                font-size: 1.2rem; color: ${card.includes('♥') || card.includes('♦') ? 'red' : 'black'};
                border: 1px solid #ccc; margin: 5px;
            `;
      this.cardsDiv.appendChild(cardDiv);
    });
    this.handSpan.textContent = this.playerHand.join(' ');
  }
  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
}