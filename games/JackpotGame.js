// games/JackpotGame.js
import { BaseGame } from './BaseGame.js';

export class JackpotGame extends BaseGame {
  constructor() {
    super();
    this.jackpot = 100;
  }
  mount(container) {
    super.mount(container);
    container.innerHTML = this.render();
    this.cacheElements();
    this.attachEvents();
  }
  render() {
    return `
            <h2>Progressive Jackpot</h2>
            <div style="font-size: 2rem; text-align: center; margin:20px;">Jackpot: $<span id="jackpot-amount">${this.jackpot}</span></div>
            <div style="display: flex; gap: 20px; justify-content: center; margin:20px;">
                <div class="reel" id="jackpot-reel1">🍒</div>
                <div class="reel" id="jackpot-reel2">🍒</div>
                <div class="reel" id="jackpot-reel3">🍒</div>
            </div>
            <div class="balance-box">Balance: $<span id="jackpot-balance">${window.balance}</span></div>
            <div class="game-controls">
                <input type="number" id="jackpot-bet" min="1" value="10">
                <button class="btn btn-primary" id="jackpot-spin">Spin</button>
                <span id="jackpot-message"></span>
            </div>
        `;
  }
  cacheElements() {
    this.jackpotSpan = this.container.querySelector('#jackpot-amount');
    this.reel1 = this.container.querySelector('#jackpot-reel1');
    this.reel2 = this.container.querySelector('#jackpot-reel2');
    this.reel3 = this.container.querySelector('#jackpot-reel3');
    this.balanceSpan = this.container.querySelector('#jackpot-balance');
    this.betInput = this.container.querySelector('#jackpot-bet');
    this.messageSpan = this.container.querySelector('#jackpot-message');
    this.spinBtn = this.container.querySelector('#jackpot-spin');
  }
  attachEvents() {
    this.spinBtn.addEventListener('click', () => this.spin());
  }
  spin() {
    const bet = parseInt(this.betInput.value);
    if (bet > window.balance) {
      alert('Insufficient balance');
      return;
    }
    window.balance -= bet;
    this.jackpot += Math.floor(bet * 0.1);
    this.jackpotSpan.textContent = this.jackpot;
    window.updateGlobalBalance();
    this.balanceSpan.textContent = window.balance;
    
    const symbols = ['🍒', '🍋', '🍊', '🍑', '🔔', '💵', '7️⃣', '💰'];
    const results = [
      symbols[Math.floor(Math.random() * symbols.length)],
      symbols[Math.floor(Math.random() * symbols.length)],
      symbols[Math.floor(Math.random() * symbols.length)]
    ];
    
    this.reel1.classList.add('spinning');
    this.reel2.classList.add('spinning');
    this.reel3.classList.add('spinning');
    
    setTimeout(() => {
      this.reel1.classList.remove('spinning');
      this.reel2.classList.remove('spinning');
      this.reel3.classList.remove('spinning');
      this.reel1.textContent = results[0];
      this.reel2.textContent = results[1];
      this.reel3.textContent = results[2];
      
      let win = 0;
      if (results[0] === results[1] && results[1] === results[2]) {
        if (results[0] === '💰') {
          win = this.jackpot;
          this.jackpot = 100;
        } else if (results[0] === '7️⃣') win = bet * 10;
        else if (results[0] === '💵') win = bet * 7;
        else if (results[0] === '🔔') win = bet * 5;
        else win = bet * 3;
      } else if (results[0] === results[1] || results[1] === results[2] || results[0] === results[2]) {
        win = bet * 1.5;
      }
      
      if (win > 0) {
        window.balance += win;
        window.updateGlobalBalance();
        this.messageSpan.textContent = `You won $${win}!`;
      } else {
        this.messageSpan.textContent = 'No win.';
      }
      this.balanceSpan.textContent = window.balance;
      this.jackpotSpan.textContent = this.jackpot;
    }, 400);
  }
}