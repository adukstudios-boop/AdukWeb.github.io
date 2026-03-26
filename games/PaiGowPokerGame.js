// games/PaiGowPokerGame.js
import { BaseGame } from './BaseGame.js';

export class PaiGowPokerGame extends BaseGame {
  mount(container) {
    super.mount(container);
    container.innerHTML = this.render();
    this.cacheElements();
    this.attachEvents();
    this.deck = [];
    this.playerHand = [];
    this.bankerHand = [];
  }
  render() {
    return `
            <h2>Pai Gow Poker</h2>
            <div>Banker: <span id="paigowpoker-banker">?</span></div>
            <div>Player: <span id="paigowpoker-player">?</span></div>
            <div class="balance-box">Balance: $<span id="paigowpoker-balance">${window.balance}</span></div>
            <div class="game-controls">
                <input type="number" id="paigowpoker-bet" min="1" value="10">
                <button class="btn btn-primary" id="paigowpoker-deal">Deal</button>
                <span id="paigowpoker-message"></span>
            </div>
        `;
  }
  cacheElements() {
    this.bankerSpan = this.container.querySelector('#paigowpoker-banker');
    this.playerSpan = this.container.querySelector('#paigowpoker-player');
    this.balanceSpan = this.container.querySelector('#paigowpoker-balance');
    this.betInput = this.container.querySelector('#paigowpoker-bet');
    this.messageSpan = this.container.querySelector('#paigowpoker-message');
    this.dealBtn = this.container.querySelector('#paigowpoker-deal');
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
    this.playerHand = this.deck.slice(0, 7);
    this.bankerHand = this.deck.slice(7, 14);
    this.deck = this.deck.slice(14);
    this.playerSpan.textContent = this.playerHand.join(' ');
    this.bankerSpan.textContent = this.bankerHand.join(' ');
    
    // Simplified: Compare high hand only
    const playerHigh = this.getHighHand(this.playerHand);
    const bankerHigh = this.getHighHand(this.bankerHand);
    let win = false;
    if (playerHigh > bankerHigh) {
      const winAmount = bet * 2;
      window.balance += winAmount;
      window.updateGlobalBalance();
      this.messageSpan.textContent = `You win $${winAmount}!`;
    } else if (playerHigh === bankerHigh) {
      window.balance += bet;
      window.updateGlobalBalance();
      this.messageSpan.textContent = 'Push. Bet returned.';
    } else {
      this.messageSpan.textContent = 'Banker wins.';
    }
    this.balanceSpan.textContent = window.balance;
  }
  getHighHand(hand) {
    const values = hand.map(c => {
      let r = c.slice(0, -1);
      if (r === 'A') return 14;
      if (r === 'K') return 13;
      if (r === 'Q') return 12;
      if (r === 'J') return 11;
      if (r === '10') return 10;
      return parseInt(r);
    }).sort((a, b) => b - a);
    return values[0];
  }
  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
}