// games/RedDogGame.js
import { BaseGame } from './BaseGame.js';

export class RedDogGame extends BaseGame {
  mount(container) {
    super.mount(container);
    container.innerHTML = this.render();
    this.cacheElements();
    this.attachEvents();
    this.deck = [];
  }
  render() {
    return `
            <h2>Red Dog Poker</h2>
            <div style="display: flex; justify-content: space-around; margin:20px;">
                <div>First: <span id="reddog-first">?</span></div>
                <div>Second: <span id="reddog-second">?</span></div>
                <div>Third: <span id="reddog-third">?</span></div>
            </div>
            <div class="balance-box">Balance: $<span id="reddog-balance">${window.balance}</span></div>
            <div class="game-controls">
                <input type="number" id="reddog-bet" min="1" value="10">
                <button class="btn btn-primary" id="reddog-deal">Deal</button>
                <button class="btn btn-secondary" id="reddog-raise" disabled>Raise</button>
                <span id="reddog-message"></span>
            </div>
        `;
  }
  cacheElements() {
    this.firstSpan = this.container.querySelector('#reddog-first');
    this.secondSpan = this.container.querySelector('#reddog-second');
    this.thirdSpan = this.container.querySelector('#reddog-third');
    this.balanceSpan = this.container.querySelector('#reddog-balance');
    this.betInput = this.container.querySelector('#reddog-bet');
    this.messageSpan = this.container.querySelector('#reddog-message');
    this.dealBtn = this.container.querySelector('#reddog-deal');
    this.raiseBtn = this.container.querySelector('#reddog-raise');
  }
  attachEvents() {
    this.dealBtn.addEventListener('click', () => this.deal());
    this.raiseBtn.addEventListener('click', () => this.raise());
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
    this.firstCard = this.deck.pop();
    this.secondCard = this.deck.pop();
    this.thirdCard = null;
    this.firstSpan.textContent = this.firstCard;
    this.secondSpan.textContent = this.secondCard;
    this.thirdSpan.textContent = '?';
    
    const firstVal = this.cardValue(this.firstCard);
    const secondVal = this.cardValue(this.secondCard);
    const spread = Math.abs(firstVal - secondVal);
    if (spread === 0) {
      // Pair – automatically win?
      if (this.thirdCard) {
        // We already have third card? Actually we just dealt two, so need to handle later
        // In real Red Dog, if first two are pair, third card decides tie/win.
        // For simplicity, if pair, player wins 11:1? Actually rules vary. We'll just do immediate win.
        const win = bet * 11;
        window.balance += win;
        window.updateGlobalBalance();
        this.messageSpan.textContent = `Pair! You win $${win}!`;
        this.dealBtn.disabled = false;
        this.raiseBtn.disabled = true;
        return;
      }
    } else if (spread === 1) {
      // No raise possible, immediate loss
      this.messageSpan.textContent = 'Spread of 1 – no raise, you lose.';
      this.dealBtn.disabled = false;
      this.raiseBtn.disabled = true;
      return;
    } else {
      // Raise possible
      this.raiseBtn.disabled = false;
      this.dealBtn.disabled = true;
      this.raiseAmount = bet;
      this.messageSpan.textContent = 'Click Raise to double your bet and reveal third card.';
      return;
    }
    // Continue with raise logic
  }
  raise() {
    const bet = parseInt(this.betInput.value);
    if (window.balance < bet) {
      alert('Insufficient balance to raise');
      return;
    }
    window.balance -= bet;
    window.updateGlobalBalance();
    this.balanceSpan.textContent = window.balance;
    
    this.thirdCard = this.deck.pop();
    this.thirdSpan.textContent = this.thirdCard;
    const firstVal = this.cardValue(this.firstCard);
    const secondVal = this.cardValue(this.secondCard);
    const thirdVal = this.cardValue(this.thirdCard);
    const low = Math.min(firstVal, secondVal);
    const high = Math.max(firstVal, secondVal);
    let winMultiplier = 0;
    if (thirdVal > low && thirdVal < high) {
      // Win
      const spread = high - low;
      if (spread === 2) winMultiplier = 4;
      else if (spread === 3) winMultiplier = 3;
      else winMultiplier = 2;
    }
    if (winMultiplier > 0) {
      const win = bet * winMultiplier;
      window.balance += win;
      window.updateGlobalBalance();
      this.messageSpan.textContent = `Third card falls between! You win $${win}!`;
    } else {
      this.messageSpan.textContent = 'Third card outside range. You lose.';
    }
    this.dealBtn.disabled = false;
    this.raiseBtn.disabled = true;
    this.balanceSpan.textContent = window.balance;
  }
  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
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
}