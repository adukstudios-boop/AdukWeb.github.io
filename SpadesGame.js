// games/SpadesGame.js
import { BaseGame } from './BaseGame.js';

export class SpadesGame extends BaseGame {
  mount(container) {
    super.mount(container);
    container.innerHTML = this.render();
    this.cacheElements();
    this.attachEvents();
    this.newGame();
  }
  render() {
    return `
            <h2>Spades</h2>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span>Your hand: <span id="spades-hand"></span></span>
                <span>Score: <span id="spades-score">0</span></span>
            </div>
            <div style="display: flex; gap: 10px; justify-content: center; margin: 20px 0;" id="spades-cards"></div>
            <div class="balance-box">Balance: $<span id="spades-balance">${window.balance}</span></div>
            <div class="game-controls">
                <button class="btn btn-primary" id="spades-deal">Deal</button>
                <span id="spades-message"></span>
            </div>
        `;
  }
  cacheElements() {
    this.handSpan = this.container.querySelector('#spades-hand');
    this.scoreSpan = this.container.querySelector('#spades-score');
    this.balanceSpan = this.container.querySelector('#spades-balance');
    this.cardsDiv = this.container.querySelector('#spades-cards');
    this.messageSpan = this.container.querySelector('#spades-message');
    this.dealBtn = this.container.querySelector('#spades-deal');
  }
  attachEvents() {
    this.dealBtn.addEventListener('click', () => this.newGame());
  }
  newGame() {
    const bet = 10;
    if (bet > window.balance) {
      this.messageSpan.textContent = 'Insufficient balance';
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
    this.playerHand = [this.deck.pop(), this.deck.pop(), this.deck.pop()];
    this.aiHand = [this.deck.pop(), this.deck.pop(), this.deck.pop()];
    this.renderHand();
    
    // In spades, spades are trump. Player wins if they have more spades or higher spade.
    const playerSpades = this.playerHand.filter(c => c.endsWith('♠')).length;
    const aiSpades = this.aiHand.filter(c => c.endsWith('♠')).length;
    let win = false;
    if (playerSpades > aiSpades) win = true;
    else if (playerSpades === aiSpades) {
      // Compare highest spade card
      const playerSpadeCards = this.playerHand.filter(c => c.endsWith('♠')).map(c => this.cardValue(c));
      const aiSpadeCards = this.aiHand.filter(c => c.endsWith('♠')).map(c => this.cardValue(c));
      const playerHigh = Math.max(...playerSpadeCards, 0);
      const aiHigh = Math.max(...aiSpadeCards, 0);
      if (playerHigh > aiHigh) win = true;
      else if (playerHigh === aiHigh) win = true; // tie goes to player for demo
    }
    if (win) {
      const winAmount = bet * 2;
      window.balance += winAmount;
      window.updateGlobalBalance();
      this.messageSpan.textContent = `You win! +$${winAmount}`;
    } else {
      this.messageSpan.textContent = 'You lose.';
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
  cardValue(card) {
    let rank = card.slice(0, -1);
    if (rank === 'A') return 14;
    if (rank === 'K') return 13;
    if (rank === 'Q') return 12;
    if (rank === 'J') return 11;
    if (rank === '10') return 10;
    return parseInt(rank);
  }
  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
}