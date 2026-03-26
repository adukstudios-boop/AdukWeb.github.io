// games/BaccaratGame.js
import { BaseGame } from './BaseGame.js';

export class BaccaratGame extends BaseGame {
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
            <h2>Baccarat</h2>
            <div>Player: <span id="baccarat-player">?</span></div>
            <div>Banker: <span id="baccarat-banker">?</span></div>
            <div class="balance-box">Balance: $<span id="baccarat-balance">${window.balance}</span></div>
            <div class="game-controls">
                <input type="number" id="baccarat-bet" min="1" value="10">
                <select id="baccarat-bet-type">
                    <option value="player">Player</option>
                    <option value="banker">Banker</option>
                    <option value="tie">Tie</option>
                </select>
                <button class="btn btn-primary" id="baccarat-deal">Deal</button>
                <span id="baccarat-message"></span>
            </div>
        `;
  }
  cacheElements() {
    this.playerSpan = this.container.querySelector('#baccarat-player');
    this.bankerSpan = this.container.querySelector('#baccarat-banker');
    this.balanceSpan = this.container.querySelector('#baccarat-balance');
    this.betInput = this.container.querySelector('#baccarat-bet');
    this.betTypeSelect = this.container.querySelector('#baccarat-bet-type');
    this.messageSpan = this.container.querySelector('#baccarat-message');
    this.dealBtn = this.container.querySelector('#baccarat-deal');
  }
  attachEvents() {
    this.dealBtn.addEventListener('click', () => this.deal());
  }
  deal() {
    const bet = parseInt(this.betInput.value);
    const betType = this.betTypeSelect.value;
    if (bet > window.balance) {
      alert('Insufficient balance');
      return;
    }
    window.balance -= bet;
    window.updateGlobalBalance();
    this.balanceSpan.textContent = window.balance;
    this.messageSpan.textContent = '';
    
    const suits = ['♠', '♥', '♦', '♣'];
    const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    this.deck = [];
    for (let s of suits) {
      for (let r of ranks) {
        this.deck.push(r + s);
      }
    }
    this.shuffle(this.deck);
    this.playerHand = [this.deck.pop(), this.deck.pop()];
    this.bankerHand = [this.deck.pop(), this.deck.pop()];
    this.playerSpan.textContent = this.playerHand.join(' ');
    this.bankerSpan.textContent = this.bankerHand.join(' ');
    
    const playerVal = this.handValue(this.playerHand);
    const bankerVal = this.handValue(this.bankerHand);
    let win = false;
    let message = '';
    
    if (betType === 'player' && playerVal > bankerVal) win = true;
    else if (betType === 'banker' && bankerVal > playerVal) win = true;
    else if (betType === 'tie' && playerVal === bankerVal) win = true;
    
    if (win) {
      let payout = 0;
      if (betType === 'player' || betType === 'banker') payout = bet * 2;
      else if (betType === 'tie') payout = bet * 9;
      window.balance += payout;
      window.updateGlobalBalance();
      message = `You won $${payout}!`;
    } else {
      message = 'You lost.';
    }
    this.messageSpan.textContent = message;
    this.balanceSpan.textContent = window.balance;
  }
  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
  handValue(hand) {
    let sum = 0;
    for (let card of hand) {
      let rank = card.slice(0, -1);
      if (rank === 'A') sum += 1;
      else if (['K', 'Q', 'J', '10'].includes(rank)) sum += 0;
      else sum += parseInt(rank);
    }
    return sum % 10;
  }
}