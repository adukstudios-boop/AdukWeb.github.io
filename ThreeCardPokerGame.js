// games/ThreeCardPokerGame.js
import { BaseGame } from './BaseGame.js';

export class ThreeCardPokerGame extends BaseGame {
  mount(container) {
    super.mount(container);
    container.innerHTML = this.render();
    this.cacheElements();
    this.attachEvents();
    this.deck = [];
    this.playerHand = [];
    this.dealerHand = [];
  }
  render() {
    return `
            <h2>Three Card Poker</h2>
            <div>Dealer: <span id="tcp-dealer">?</span></div>
            <div>Player: <span id="tcp-player">?</span></div>
            <div class="balance-box">Balance: $<span id="tcp-balance">${window.balance}</span></div>
            <div class="game-controls">
                <input type="number" id="tcp-bet" min="1" value="10">
                <button class="btn btn-primary" id="tcp-deal">Deal</button>
                <span id="tcp-message"></span>
            </div>
        `;
  }
  cacheElements() {
    this.dealerSpan = this.container.querySelector('#tcp-dealer');
    this.playerSpan = this.container.querySelector('#tcp-player');
    this.balanceSpan = this.container.querySelector('#tcp-balance');
    this.betInput = this.container.querySelector('#tcp-bet');
    this.messageSpan = this.container.querySelector('#tcp-message');
    this.dealBtn = this.container.querySelector('#tcp-deal');
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
    this.playerHand = [this.deck.pop(), this.deck.pop(), this.deck.pop()];
    this.dealerHand = [this.deck.pop(), this.deck.pop(), this.deck.pop()];
    this.playerSpan.textContent = this.playerHand.join(' ');
    this.dealerSpan.textContent = this.dealerHand.join(' ');
    
    const playerRank = this.handRank(this.playerHand);
    const dealerRank = this.handRank(this.dealerHand);
    let win = false;
    if (playerRank > dealerRank) {
      const winAmount = bet * 2;
      window.balance += winAmount;
      window.updateGlobalBalance();
      this.messageSpan.textContent = `You win $${winAmount}!`;
    } else if (playerRank === dealerRank) {
      window.balance += bet;
      window.updateGlobalBalance();
      this.messageSpan.textContent = 'Push. Bet returned.';
    } else {
      this.messageSpan.textContent = 'Dealer wins.';
    }
    this.balanceSpan.textContent = window.balance;
  }
  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
  handRank(hand) {
    const values = hand.map(c => {
      let r = c.slice(0, -1);
      if (r === 'A') return 14;
      if (r === 'K') return 13;
      if (r === 'Q') return 12;
      if (r === 'J') return 11;
      if (r === '10') return 10;
      return parseInt(r);
    }).sort((a, b) => b - a);
    const suits = hand.map(c => c.slice(-1));
    const isFlush = suits.every(s => s === suits[0]);
    const isStraight = values[0] === values[1] + 1 && values[1] === values[2] + 1;
    const threeSame = values[0] === values[1] && values[1] === values[2];
    if (threeSame) return 6;
    if (isStraight && isFlush) return 5;
    if (isStraight) return 4;
    if (isFlush) return 3;
    if (values[0] === values[1] || values[1] === values[2]) return 2;
    return 1;
  }
}