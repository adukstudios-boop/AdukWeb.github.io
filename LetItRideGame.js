// games/LetItRideGame.js
import { BaseGame } from './BaseGame.js';

export class LetItRideGame extends BaseGame {
  mount(container) {
    super.mount(container);
    container.innerHTML = this.render();
    this.cacheElements();
    this.attachEvents();
    this.deck = [];
    this.playerHand = [];
    this.community = [];
    this.bet = 0;
    this.round = 0;
  }
  render() {
    return `
            <h2>Let It Ride</h2>
            <div>Your hand: <span id="letitride-hand">?</span></div>
            <div>Community: <span id="letitride-community">?</span></div>
            <div class="balance-box">Balance: $<span id="letitride-balance">${window.balance}</span></div>
            <div class="game-controls">
                <input type="number" id="letitride-bet" min="1" value="10">
                <button class="btn btn-primary" id="letitride-deal">Deal</button>
                <button class="btn btn-secondary" id="letitride-ride" disabled>Let It Ride</button>
                <span id="letitride-message"></span>
            </div>
        `;
  }
  cacheElements() {
    this.handSpan = this.container.querySelector('#letitride-hand');
    this.communitySpan = this.container.querySelector('#letitride-community');
    this.balanceSpan = this.container.querySelector('#letitride-balance');
    this.betInput = this.container.querySelector('#letitride-bet');
    this.messageSpan = this.container.querySelector('#letitride-message');
    this.dealBtn = this.container.querySelector('#letitride-deal');
    this.rideBtn = this.container.querySelector('#letitride-ride');
  }
  attachEvents() {
    this.dealBtn.addEventListener('click', () => this.deal());
    this.rideBtn.addEventListener('click', () => this.ride());
  }
  deal() {
    this.bet = parseInt(this.betInput.value);
    if (this.bet > window.balance) {
      alert('Insufficient balance');
      return;
    }
    window.balance -= this.bet;
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
    this.community = [this.deck.pop(), this.deck.pop()]; // first two community cards
    this.round = 1;
    this.updateUI();
    this.rideBtn.disabled = false;
    this.dealBtn.disabled = true;
    this.messageSpan.textContent = 'You may "Let It Ride" or take back one bet.';
  }
  ride() {
    if (this.round === 1) {
      // after first decision, reveal third community card and evaluate
      this.community.push(this.deck.pop());
      this.round = 2;
      this.updateUI();
      const payout = this.evaluatePayout();
      if (payout > 0) {
        const winAmount = this.bet * payout;
        window.balance += winAmount;
        window.updateGlobalBalance();
        this.messageSpan.textContent = `You win $${winAmount}! (${payout}x)`;
      } else {
        this.messageSpan.textContent = 'No win.';
      }
      this.rideBtn.disabled = true;
      this.dealBtn.disabled = false;
    }
  }
  evaluatePayout() {
    const allCards = [...this.playerHand, ...this.community];
    const rank = this.handRank(allCards);
    const payouts = [0, 0, 0, 0, 0, 1, 2, 3, 5, 10, 25]; // simplified
    return payouts[rank] || 0;
  }
  handRank(hand) {
    // Simplified ranking: high card to royal flush not fully implemented
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
    const isStraight = values[0] === values[1] + 1 && values[1] === values[2] + 1 && values[2] === values[3] + 1 && values[3] === values[4] + 1;
    const rankCount = {};
    values.forEach(v => rankCount[v] = (rankCount[v] || 0) + 1);
    const counts = Object.values(rankCount);
    if (counts.includes(4)) return 7;
    if (counts.includes(3) && counts.includes(2)) return 6;
    if (isFlush && isStraight) return 8;
    if (isFlush) return 5;
    if (isStraight) return 4;
    if (counts.includes(3)) return 3;
    if (counts.filter(c => c === 2).length === 2) return 2;
    if (counts.includes(2)) return 1;
    return 0;
  }
  updateUI() {
    this.handSpan.textContent = this.playerHand.join(' ');
    this.communitySpan.textContent = this.community.join(' ');
  }
  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
}