// games/CribbageGame.js
import { BaseGame } from './BaseGame.js';

export class CribbageGame extends BaseGame {
  mount(container) {
    super.mount(container);
    container.innerHTML = this.render();
    this.cacheElements();
    this.attachEvents();
    this.newGame();
  }
  render() {
    return `
            <h2>Cribbage</h2>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span>Your hand: <span id="cribbage-hand"></span></span>
                <span>Score: <span id="cribbage-score">0</span></span>
            </div>
            <div style="display: flex; gap: 10px; justify-content: center; margin: 20px 0;" id="cribbage-cards"></div>
            <div class="balance-box">Balance: $<span id="cribbage-balance">${window.balance}</span></div>
            <div class="game-controls">
                <button class="btn btn-primary" id="cribbage-deal">Deal</button>
                <span id="cribbage-message"></span>
            </div>
        `;
  }
  cacheElements() {
    this.handSpan = this.container.querySelector('#cribbage-hand');
    this.scoreSpan = this.container.querySelector('#cribbage-score');
    this.balanceSpan = this.container.querySelector('#cribbage-balance');
    this.cardsDiv = this.container.querySelector('#cribbage-cards');
    this.messageSpan = this.container.querySelector('#cribbage-message');
    this.dealBtn = this.container.querySelector('#cribbage-deal');
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
    const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    this.deck = [];
    for (let s of suits) {
      for (let r of ranks) {
        this.deck.push(r + s);
      }
    }
    this.shuffle(this.deck);
    // Each player gets 4 cards
    this.playerHand = [this.deck.pop(), this.deck.pop(), this.deck.pop(), this.deck.pop()];
    this.aiHand = [this.deck.pop(), this.deck.pop(), this.deck.pop(), this.deck.pop()];
    // Starter card (cut)
    this.starter = this.deck.pop();
    this.renderHand();
    
    // Simplified scoring: count points in player's hand plus starter
    const playerPoints = this.scoreHand(this.playerHand, this.starter);
    const aiPoints = this.scoreHand(this.aiHand, this.starter);
    let win = false;
    if (playerPoints > aiPoints) {
      const winAmount = bet * 2;
      window.balance += winAmount;
      window.updateGlobalBalance();
      this.messageSpan.textContent = `You win! ${playerPoints} to ${aiPoints}. +$${winAmount}`;
    } else if (playerPoints === aiPoints) {
      window.balance += bet; // tie: push
      window.updateGlobalBalance();
      this.messageSpan.textContent = `Tie! ${playerPoints} to ${aiPoints}. Bet returned.`;
    } else {
      this.messageSpan.textContent = `You lose: ${playerPoints} to ${aiPoints}.`;
    }
    this.balanceSpan.textContent = window.balance;
  }
  scoreHand(hand, starter) {
    const allCards = [...hand, starter];
    // Simplified: count 15s, runs, pairs, etc.
    let points = 0;
    // Count 15s (any combination that sums to 15)
    const values = allCards.map(c => this.cardValue(c));
    for (let i = 0; i < values.length; i++) {
      for (let j = i + 1; j < values.length; j++) {
        if (values[i] + values[j] === 15) points += 2;
        for (let k = j + 1; k < values.length; k++) {
          if (values[i] + values[j] + values[k] === 15) points += 2;
          for (let l = k + 1; l < values.length; l++) {
            if (values[i] + values[j] + values[k] + values[l] === 15) points += 2;
          }
        }
      }
    }
    // Pairs
    for (let i = 0; i < values.length; i++) {
      for (let j = i + 1; j < values.length; j++) {
        if (values[i] === values[j]) points += 2;
      }
    }
    return points;
  }
  cardValue(card) {
    let rank = card.slice(0, -1);
    if (rank === 'A') return 1;
    if (rank === 'J' || rank === 'Q' || rank === 'K') return 10;
    if (rank === '10') return 10;
    return parseInt(rank);
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