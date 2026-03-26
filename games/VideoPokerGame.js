// games/VideoPokerGame.js
import { BaseGame } from './BaseGame.js';

export class VideoPokerGame extends BaseGame {
  mount(container) {
    super.mount(container);
    container.innerHTML = this.render();
    this.cacheElements();
    this.attachEvents();
    this.deck = [];
    this.hand = [];
    this.held = [false, false, false, false, false];
  }
  render() {
    return `
            <h2>Video Poker</h2>
            <div class="balance-box">Balance: $<span id="videopoker-balance">${window.balance}</span></div>
            <div class="game-controls">
                <input type="number" id="videopoker-bet" min="1" value="10">
                <button class="btn btn-primary" id="videopoker-deal">Deal</button>
                <button class="btn btn-secondary" id="videopoker-draw">Draw</button>
                <span id="videopoker-message"></span>
            </div>
            <div style="display: flex; gap: 10px; justify-content: center; margin-top:20px;" id="videopoker-hand"></div>
        `;
  }
  cacheElements() {
    this.balanceSpan = this.container.querySelector('#videopoker-balance');
    this.betInput = this.container.querySelector('#videopoker-bet');
    this.messageSpan = this.container.querySelector('#videopoker-message');
    this.dealBtn = this.container.querySelector('#videopoker-deal');
    this.drawBtn = this.container.querySelector('#videopoker-draw');
    this.handDiv = this.container.querySelector('#videopoker-hand');
  }
  attachEvents() {
    this.dealBtn.addEventListener('click', () => this.deal());
    this.drawBtn.addEventListener('click', () => this.draw());
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
    this.messageSpan.textContent = 'Click cards to hold';
    
    const suits = ['♠', '♥', '♦', '♣'];
    const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    this.deck = [];
    for (let s of suits) {
      for (let r of ranks) {
        this.deck.push(r + s);
      }
    }
    this.shuffle(this.deck);
    this.hand = this.deck.slice(0, 5);
    this.deck = this.deck.slice(5);
    this.held = [false, false, false, false, false];
    this.renderHand();
    this.drawBtn.disabled = false;
    this.dealBtn.disabled = true;
  }
  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
  renderHand() {
    this.handDiv.innerHTML = '';
    this.hand.forEach((card, i) => {
      const cardDiv = document.createElement('div');
      cardDiv.textContent = card;
      cardDiv.style.cssText = `
                display: inline-block; width:60px; height:90px; background:white;
                border-radius:8px; text-align:center; line-height:90px; font-size:1.2rem;
                margin:5px; cursor:pointer; color:${card.includes('♥')||card.includes('♦')?'red':'black'};
                border: ${this.held[i] ? '4px solid var(--gold)' : '1px solid #ccc'};
            `;
      cardDiv.addEventListener('click', () => this.toggleHold(i));
      this.handDiv.appendChild(cardDiv);
    });
  }
  toggleHold(i) {
    if (this.dealBtn.disabled === false) return;
    this.held[i] = !this.held[i];
    this.renderHand();
  }
  draw() {
    for (let i = 0; i < 5; i++) {
      if (!this.held[i] && this.deck.length > 0) {
        this.hand[i] = this.deck.pop();
      }
    }
    this.renderHand();
    this.drawBtn.disabled = true;
    this.dealBtn.disabled = false;
    
    const rankCount = {};
    this.hand.forEach(card => {
      let r = card.slice(0, -1);
      rankCount[r] = (rankCount[r] || 0) + 1;
    });
    const counts = Object.values(rankCount);
    let winMultiplier = 0;
    if (counts.includes(3)) winMultiplier = 3;
    else if (counts.includes(2) && counts.length === 3) winMultiplier = 2;
    else if (counts.includes(2)) winMultiplier = 1;
    
    if (winMultiplier > 0) {
      const bet = parseInt(this.betInput.value);
      const win = bet * winMultiplier;
      window.balance += win;
      window.updateGlobalBalance();
      this.messageSpan.textContent = `You won $${win}! (${winMultiplier}x)`;
    } else {
      this.messageSpan.textContent = 'No win.';
    }
    this.balanceSpan.textContent = window.balance;
  }
}