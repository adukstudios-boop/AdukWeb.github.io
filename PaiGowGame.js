// games/PaiGowGame.js
import { BaseGame } from './BaseGame.js';

export class PaiGowGame extends BaseGame {
  mount(container) {
    super.mount(container);
    container.innerHTML = this.render();
    this.cacheElements();
    this.attachEvents();
    this.deck = [];
    this.playerHand = [];
    this.bankerHand = [];
    this.gameActive = false;
  }
  render() {
    return `
            <h2>Pai Gow Poker</h2>
            <div>Player hand: <span id="paigow-player">?</span></div>
            <div>Banker hand: <span id="paigow-banker">?</span></div>
            <div class="balance-box">Balance: $<span id="paigow-balance">${window.balance}</span></div>
            <div class="game-controls">
                <input type="number" id="paigow-bet" min="1" value="10">
                <button class="btn btn-primary" id="paigow-deal">Deal</button>
                <span id="paigow-message"></span>
            </div>
        `;
  }
  cacheElements() {
    this.playerSpan = this.container.querySelector('#paigow-player');
    this.bankerSpan = this.container.querySelector('#paigow-banker');
    this.balanceSpan = this.container.querySelector('#paigow-balance');
    this.betInput = this.container.querySelector('#paigow-bet');
    this.messageSpan = this.container.querySelector('#paigow-message');
    this.dealBtn = this.container.querySelector('#paigow-deal');
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
    
    // Split each hand into a 5-card high hand and 2-card low hand.
    // Simplified: we just compare the best 5-card hand for both.
    const playerRank = this.getHandRank(this.playerHand);
    const bankerRank = this.getHandRank(this.bankerHand);
    let message = '';
    if (playerRank > bankerRank) {
      const win = bet * 2;
      window.balance += win;
      window.updateGlobalBalance();
      message = `You win $${win}!`;
    } else if (playerRank < bankerRank) {
      message = 'Banker wins.';
    } else {
      // Tie: push
      window.balance += bet;
      window.updateGlobalBalance();
      message = 'Push.';
    }
    this.messageSpan.textContent = message;
    this.playerSpan.textContent = this.playerHand.join(' ');
    this.bankerSpan.textContent = this.bankerHand.join(' ');
    this.balanceSpan.textContent = window.balance;
  }
  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
  getHandRank(hand) {
    // Simplified rank function for 7 cards: use the best 5-card hand
    // For demo, we'll just use a simple high card ranking (first card value)
    // In reality, would need to evaluate all combinations.
    const values = hand.map(c => {
      let r = c.slice(0, -1);
      if (r === 'A') return 14;
      if (r === 'K') return 13;
      if (r === 'Q') return 12;
      if (r === 'J') return 11;
      if (r === '10') return 10;
      return parseInt(r);
    }).sort((a, b) => b - a);
    // Check for pair, etc.
    const counts = {};
    values.forEach(v => counts[v] = (counts[v] || 0) + 1);
    const hasPair = Object.values(counts).includes(2);
    if (hasPair) return 2;
    return 1; // high card
  }
}