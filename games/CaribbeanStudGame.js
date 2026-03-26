// games/CaribbeanStudGame.js
import { BaseGame } from './BaseGame.js';

export class CaribbeanStudGame extends BaseGame {
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
            <h2>Caribbean Stud Poker</h2>
            <div>Dealer: <span id="caribbean-dealer">?</span></div>
            <div>Player: <span id="caribbean-player">?</span></div>
            <div class="balance-box">Balance: $<span id="caribbean-balance">${window.balance}</span></div>
            <div class="game-controls">
                <input type="number" id="caribbean-bet" min="1" value="10">
                <button class="btn btn-primary" id="caribbean-deal">Deal</button>
                <span id="caribbean-message"></span>
            </div>
        `;
  }
  cacheElements() {
    this.dealerSpan = this.container.querySelector('#caribbean-dealer');
    this.playerSpan = this.container.querySelector('#caribbean-player');
    this.balanceSpan = this.container.querySelector('#caribbean-balance');
    this.betInput = this.container.querySelector('#caribbean-bet');
    this.messageSpan = this.container.querySelector('#caribbean-message');
    this.dealBtn = this.container.querySelector('#caribbean-deal');
  }
  attachEvents() {
    this.dealBtn.addEventListener('click', () => this.deal());
  }
  deal() {
    const ante = parseInt(this.betInput.value);
    if (ante > window.balance) {
      alert('Insufficient balance');
      return;
    }
    window.balance -= ante;
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
    this.playerHand = [this.deck.pop(), this.deck.pop(), this.deck.pop(), this.deck.pop(), this.deck.pop()];
    this.dealerHand = [this.deck.pop(), this.deck.pop(), this.deck.pop(), this.deck.pop(), this.deck.pop()];
    this.playerSpan.textContent = this.playerHand.join(' ');
    this.dealerSpan.textContent = this.dealerHand[0] + ' ? ? ? ?';
    
    const playerRank = this.handRank(this.playerHand);
    const dealerQualify = this.handRank(this.dealerHand) >= 1; // dealer needs Ace-King or better to qualify
    if (!dealerQualify) {
      const winAmount = ante;
      window.balance += winAmount;
      window.updateGlobalBalance();
      this.messageSpan.textContent = `Dealer does not qualify. You win $${winAmount}!`;
    } else {
      if (playerRank > this.handRank(this.dealerHand)) {
        const winAmount = ante * 2;
        window.balance += winAmount;
        window.updateGlobalBalance();
        this.messageSpan.textContent = `You beat the dealer! +$${winAmount}`;
      } else if (playerRank === this.handRank(this.dealerHand)) {
        window.balance += ante;
        window.updateGlobalBalance();
        this.messageSpan.textContent = 'Push. Bet returned.';
      } else {
        this.messageSpan.textContent = 'Dealer wins.';
      }
    }
    this.balanceSpan.textContent = window.balance;
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
    const isStraight = values[0] === values[1] + 1 && values[1] === values[2] + 1 && values[2] === values[3] + 1 && values[3] === values[4] + 1;
    const rankCount = {};
    values.forEach(v => rankCount[v] = (rankCount[v] || 0) + 1);
    const counts = Object.values(rankCount);
    if (isFlush && isStraight && values[0] === 14) return 9;
    if (isFlush && isStraight) return 8;
    if (counts.includes(4)) return 7;
    if (counts.includes(3) && counts.includes(2)) return 6;
    if (isFlush) return 5;
    if (isStraight) return 4;
    if (counts.includes(3)) return 3;
    if (counts.filter(c => c === 2).length === 2) return 2;
    if (counts.includes(2)) return 1;
    if (values[0] === 14 || values[0] === 13) return 1; // Ace or King high qualifies
    return 0;
  }
  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
}