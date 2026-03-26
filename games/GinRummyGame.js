// games/GinRummyGame.js
import { BaseGame } from './BaseGame.js';

export class GinRummyGame extends BaseGame {
  mount(container) {
    super.mount(container);
    container.innerHTML = this.render();
    this.cacheElements();
    this.attachEvents();
    this.deck = [];
    this.playerHand = [];
    this.aiHand = [];
    this.discardPile = [];
    this.turn = 'player';
    this.gameActive = false;
  }
  render() {
    return `
            <h2>Gin Rummy</h2>
            <div>AI hand (face down): <span id="gin-ai">??</span></div>
            <div>Your hand: <span id="gin-player">?</span></div>
            <div>Discard pile: <span id="gin-discard">-</span></div>
            <div class="balance-box">Balance: $<span id="gin-balance">${window.balance}</span></div>
            <div class="game-controls">
                <input type="number" id="gin-bet" min="1" value="10">
                <button class="btn btn-primary" id="gin-deal">Deal</button>
                <button class="btn btn-secondary" id="gin-draw">Draw</button>
                <button class="btn btn-secondary" id="gin-discard">Discard</button>
                <span id="gin-message"></span>
            </div>
        `;
  }
  cacheElements() {
    this.aiSpan = this.container.querySelector('#gin-ai');
    this.playerSpan = this.container.querySelector('#gin-player');
    this.discardSpan = this.container.querySelector('#gin-discard');
    this.balanceSpan = this.container.querySelector('#gin-balance');
    this.betInput = this.container.querySelector('#gin-bet');
    this.messageSpan = this.container.querySelector('#gin-message');
    this.dealBtn = this.container.querySelector('#gin-deal');
    this.drawBtn = this.container.querySelector('#gin-draw');
    this.discardBtn = this.container.querySelector('#gin-discard');
  }
  attachEvents() {
    this.dealBtn.addEventListener('click', () => this.deal());
    this.drawBtn.addEventListener('click', () => this.drawCard());
    this.discardBtn.addEventListener('click', () => this.discardCard());
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
    const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    this.deck = [];
    for (let s of suits) {
      for (let r of ranks) {
        this.deck.push(r + s);
      }
    }
    this.shuffle(this.deck);
    // Deal 10 cards each
    this.playerHand = [];
    this.aiHand = [];
    for (let i = 0; i < 10; i++) {
      this.playerHand.push(this.deck.pop());
      this.aiHand.push(this.deck.pop());
    }
    // Top card to discard pile
    this.discardPile = [this.deck.pop()];
    this.turn = 'player';
    this.gameActive = true;
    this.updateUI();
    this.discardBtn.disabled = false;
    this.drawBtn.disabled = false;
    this.dealBtn.disabled = true;
  }
  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
  updateUI() {
    this.playerSpan.textContent = this.playerHand.join(' ');
    this.aiSpan.textContent = '??'; // keep hidden
    this.discardSpan.textContent = this.discardPile[this.discardPile.length - 1] || '-';
  }
  drawCard() {
    if (!this.gameActive) return;
    if (this.turn !== 'player') return;
    // Draw from deck (simplified, no discard draw for now)
    if (this.deck.length === 0) {
      this.messageSpan.textContent = 'No cards left.';
      return;
    }
    const drawn = this.deck.pop();
    this.playerHand.push(drawn);
    this.updateUI();
    this.messageSpan.textContent = 'Drew a card. Now discard.';
    this.drawBtn.disabled = true;
  }
  discardCard() {
    if (!this.gameActive) return;
    if (this.turn !== 'player') return;
    if (this.playerHand.length === 0) return;
    // For simplicity, we'll just discard the last card. In real game, player selects.
    const card = this.playerHand.pop();
    this.discardPile.push(card);
    this.updateUI();
    // Check for gin
    if (this.isGin(this.playerHand)) {
      const bet = parseInt(this.betInput.value);
      const win = bet * 2;
      window.balance += win;
      window.updateGlobalBalance();
      this.messageSpan.textContent = `Gin! You win $${win}!`;
      this.gameActive = false;
      this.dealBtn.disabled = false;
      this.drawBtn.disabled = true;
      this.discardBtn.disabled = true;
      return;
    }
    // AI turn
    this.turn = 'ai';
    this.messageSpan.textContent = 'AI thinking...';
    setTimeout(() => this.aiTurn(), 500);
    this.drawBtn.disabled = true;
    this.discardBtn.disabled = true;
  }
  aiTurn() {
    if (!this.gameActive) return;
    // Simple AI: draw from deck, discard a random card
    if (this.deck.length === 0) {
      this.messageSpan.textContent = 'Game over - no cards.';
      return;
    }
    const drawn = this.deck.pop();
    this.aiHand.push(drawn);
    // Discard a random card
    const discardIdx = Math.floor(Math.random() * this.aiHand.length);
    const discard = this.aiHand.splice(discardIdx, 1)[0];
    this.discardPile.push(discard);
    this.updateUI();
    // Check AI gin (simplified)
    if (this.isGin(this.aiHand)) {
      this.messageSpan.textContent = 'AI got Gin! You lose.';
      this.gameActive = false;
      this.dealBtn.disabled = false;
      this.drawBtn.disabled = true;
      this.discardBtn.disabled = true;
      return;
    }
    this.turn = 'player';
    this.messageSpan.textContent = 'Your turn. Draw or discard.';
    this.drawBtn.disabled = false;
    this.discardBtn.disabled = false;
  }
  isGin(hand) {
    // Very basic: if all cards form runs or sets? For demo, just check if all cards are same suit or consecutive? Not needed.
    // For simplicity, treat any hand with length 0 as gin (won't happen).
    return false;
  }
}