// games/TeenPattiGame.js
import { BaseGame } from './BaseGame.js';

export class TeenPattiGame extends BaseGame {
  mount(container) {
    super.mount(container);
    container.innerHTML = this.render();
    this.cacheElements();
    this.attachEvents();
    this.deck = [];
    this.playerHand = [];
    this.aiHand = [];
    this.gameActive = false;
  }
  render() {
    return `
            <h2>Teen Patti</h2>
            <div>AI: <span id="teenpatti-ai">?</span></div>
            <div>You: <span id="teenpatti-player">?</span></div>
            <div class="balance-box">Balance: $<span id="teenpatti-balance">${window.balance}</span></div>
            <div class="game-controls">
                <input type="number" id="teenpatti-bet" min="1" value="10">
                <button class="btn btn-primary" id="teenpatti-deal">Deal</button>
                <span id="teenpatti-message"></span>
            </div>
        `;
  }
  cacheElements() {
    this.aiSpan = this.container.querySelector('#teenpatti-ai');
    this.playerSpan = this.container.querySelector('#teenpatti-player');
    this.balanceSpan = this.container.querySelector('#teenpatti-balance');
    this.betInput = this.container.querySelector('#teenpatti-bet');
    this.messageSpan = this.container.querySelector('#teenpatti-message');
    this.dealBtn = this.container.querySelector('#teenpatti-deal');
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
    this.aiHand = [this.deck.pop(), this.deck.pop(), this.deck.pop()];
    this.playerSpan.textContent = this.playerHand.join(' ');
    this.aiSpan.textContent = this.aiHand.join(' ');
    
    const playerRank = this.handRank(this.playerHand);
    const aiRank = this.handRank(this.aiHand);
    let message = '';
    if (playerRank > aiRank) {
      const win = bet * 2;
      window.balance += win;
      window.updateGlobalBalance();
      message = `You win $${win}!`;
    } else if (playerRank < aiRank) {
      message = 'AI wins.';
    } else {
      window.balance += bet;
      window.updateGlobalBalance();
      message = 'Tie. Bet returned.';
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
    
    if (threeSame) return 1000 + values[0];
    if (isStraight && isFlush) return 900 + values[0];
    if (isStraight) return 800 + values[0];
    if (isFlush) return 700 + values[0];
    if (values[0] === values[1] || values[1] === values[2] || values[0] === values[2]) {
      let pair = values[0] === values[1] ? values[0] : values[2];
      return 600 + pair;
    }
    return values[0];
  }
}