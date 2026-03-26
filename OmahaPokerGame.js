// games/OmahaPokerGame.js
import { BaseGame } from './BaseGame.js';

export class OmahaPokerGame extends BaseGame {
  mount(container) {
    super.mount(container);
    container.innerHTML = this.render();
    this.cacheElements();
    this.attachEvents();
    this.deck = [];
    this.playerHand = []; // 4 cards
    this.community = []; // 5 cards
    this.bestHand = [];
    this.gameActive = false;
  }
  render() {
    return `
            <h2>Omaha Poker</h2>
            <div>Your hand: <span id="omaha-hand">?</span></div>
            <div>Community: <span id="omaha-community">?</span></div>
            <div class="balance-box">Balance: $<span id="omaha-balance">${window.balance}</span></div>
            <div class="game-controls">
                <input type="number" id="omaha-bet" min="1" value="10">
                <button class="btn btn-primary" id="omaha-deal">Deal</button>
                <span id="omaha-message"></span>
            </div>
        `;
  }
  cacheElements() {
    this.handSpan = this.container.querySelector('#omaha-hand');
    this.communitySpan = this.container.querySelector('#omaha-community');
    this.balanceSpan = this.container.querySelector('#omaha-balance');
    this.betInput = this.container.querySelector('#omaha-bet');
    this.messageSpan = this.container.querySelector('#omaha-message');
    this.dealBtn = this.container.querySelector('#omaha-deal');
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
    this.messageSpan.textContent = '';
    
    const suits = ['♠', '♥', '♦', '♣'];
    const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    this.deck = [];
    for (let s of suits) {
      for (let r of ranks) {
        this.deck.push(r + s);
      }
    }
    this.shuffle(this.deck);
    // Player gets 4 cards
    this.playerHand = [];
    for (let i = 0; i < 4; i++) this.playerHand.push(this.deck.pop());
    // 5 community cards
    this.community = [];
    for (let i = 0; i < 5; i++) this.community.push(this.deck.pop());
    
    this.handSpan.textContent = this.playerHand.join(' ');
    this.communitySpan.textContent = this.community.join(' ');
    
    // Evaluate best 5-card hand using exactly 2 from player hand + 3 from community
    const best = this.evaluateBestHand();
    const rankName = this.getRankName(best.rank);
    let winMultiplier = this.getPayout(best.rank);
    if (winMultiplier > 0) {
      const win = bet * winMultiplier;
      window.balance += win;
      window.updateGlobalBalance();
      this.messageSpan.textContent = `You have ${rankName}! Won $${win}!`;
    } else {
      this.messageSpan.textContent = `You have ${rankName}. No win.`;
    }
    this.balanceSpan.textContent = window.balance;
  }
  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
  evaluateBestHand() {
    // Generate all combinations of 2 from player hand and 3 from community
    let bestRank = 0;
    let bestHigh = [];
    for (let i = 0; i < 4; i++) {
      for (let j = i + 1; j < 4; j++) {
        const playerCards = [this.playerHand[i], this.playerHand[j]];
        for (let a = 0; a < 5; a++) {
          for (let b = a + 1; b < 5; b++) {
            for (let c = b + 1; c < 5; c++) {
              const communityCards = [this.community[a], this.community[b], this.community[c]];
              const hand = [...playerCards, ...communityCards];
              const { rank, high } = this.getHandRank(hand);
              if (rank > bestRank) {
                bestRank = rank;
                bestHigh = high;
              } else if (rank === bestRank && this.compareHigh(high, bestHigh) > 0) {
                bestHigh = high;
              }
            }
          }
        }
      }
    }
    return { rank: bestRank, high: bestHigh };
  }
  getHandRank(cards) {
    // Simplified: just use the same rank function as in FiveCardDraw
    const ranks = cards.map(c => {
      let r = c.slice(0, -1);
      if (r === 'A') return 14;
      if (r === 'K') return 13;
      if (r === 'Q') return 12;
      if (r === 'J') return 11;
      if (r === '10') return 10;
      return parseInt(r);
    }).sort((a, b) => b - a);
    const suits = cards.map(c => c.slice(-1));
    const isFlush = suits.every(s => s === suits[0]);
    const isStraight = ranks[0] === ranks[1] + 1 && ranks[1] === ranks[2] + 1 && ranks[2] === ranks[3] + 1 && ranks[3] === ranks[4] + 1;
    const rankCount = {};
    ranks.forEach(r => rankCount[r] = (rankCount[r] || 0) + 1);
    const values = Object.values(rankCount);
    const hasFour = values.includes(4);
    const hasThree = values.includes(3);
    const hasTwo = values.includes(2);
    const pairs = values.filter(v => v === 2).length;
    
    if (isStraight && isFlush) return { rank: 9, high: ranks };
    if (hasFour) return { rank: 8, high: ranks };
    if (hasThree && hasTwo) return { rank: 7, high: ranks };
    if (isFlush) return { rank: 6, high: ranks };
    if (isStraight) return { rank: 5, high: ranks };
    if (hasThree) return { rank: 4, high: ranks };
    if (pairs === 2) return { rank: 3, high: ranks };
    if (pairs === 1) return { rank: 2, high: ranks };
    return { rank: 1, high: ranks };
  }
  compareHigh(high1, high2) {
    for (let i = 0; i < high1.length; i++) {
      if (high1[i] !== high2[i]) return high1[i] - high2[i];
    }
    return 0;
  }
  getRankName(rank) {
    const names = ['', 'High Card', 'One Pair', 'Two Pair', 'Three of a Kind', 'Straight', 'Flush', 'Full House', 'Four of a Kind', 'Straight Flush'];
    return names[rank];
  }
  getPayout(rank) {
    const payouts = [0, 0, 1, 2, 3, 5, 7, 10, 25, 50];
    return payouts[rank];
  }
}