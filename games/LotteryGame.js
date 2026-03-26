// games/LotteryGame.js
import { BaseGame } from './BaseGame.js';

export class LotteryGame extends BaseGame {
  mount(container) {
    super.mount(container);
    container.innerHTML = this.render();
    this.cacheElements();
    this.attachEvents();
    this.picks = [];
  }
  render() {
    let numbersHtml = '';
    for (let i = 1; i <= 50; i++) {
      numbersHtml += `<button class="lottery-number" data-num="${i}">${i}</button>`;
    }
    return `
            <h2>Lottery</h2>
            <div style="margin-bottom:10px;">Pick 5 numbers (1-50)</div>
            <div style="display: grid; grid-template-columns: repeat(10, 1fr); gap:2px; max-height:200px; overflow-y:auto;">${numbersHtml}</div>
            <div>Selected: <span id="lottery-selected">[]</span></div>
            <div class="balance-box">Balance: $<span id="lottery-balance">${window.balance}</span></div>
            <div class="game-controls">
                <input type="number" id="lottery-bet" min="1" value="10">
                <button class="btn btn-primary" id="lottery-draw">Draw</button>
                <span id="lottery-message"></span>
            </div>
        `;
  }
  cacheElements() {
    this.balanceSpan = this.container.querySelector('#lottery-balance');
    this.betInput = this.container.querySelector('#lottery-bet');
    this.messageSpan = this.container.querySelector('#lottery-message');
    this.drawBtn = this.container.querySelector('#lottery-draw');
    this.selectedSpan = this.container.querySelector('#lottery-selected');
    this.numberButtons = this.container.querySelectorAll('.lottery-number');
  }
  attachEvents() {
    this.numberButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const num = parseInt(e.target.dataset.num);
        if (this.picks.includes(num)) {
          this.picks = this.picks.filter(n => n !== num);
          e.target.style.background = '';
        } else if (this.picks.length < 5) {
          this.picks.push(num);
          e.target.style.background = 'var(--accent-primary)';
        } else {
          alert('You can only pick 5 numbers');
        }
        this.selectedSpan.textContent = JSON.stringify(this.picks);
      });
    });
    this.drawBtn.addEventListener('click', () => this.draw());
  }
  draw() {
    if (this.picks.length !== 5) {
      alert('Pick 5 numbers first');
      return;
    }
    const bet = parseInt(this.betInput.value);
    if (bet > window.balance) {
      alert('Insufficient balance');
      return;
    }
    window.balance -= bet;
    window.updateGlobalBalance();
    this.balanceSpan.textContent = window.balance;
    
    const drawn = [];
    while (drawn.length < 5) {
      const n = Math.floor(Math.random() * 50) + 1;
      if (!drawn.includes(n)) drawn.push(n);
    }
    drawn.sort((a, b) => a - b);
    const matches = this.picks.filter(n => drawn.includes(n)).length;
    let win = 0;
    if (matches === 3) win = bet * 2;
    else if (matches === 4) win = bet * 10;
    else if (matches === 5) win = bet * 100;
    
    if (win > 0) {
      window.balance += win;
      window.updateGlobalBalance();
      this.messageSpan.textContent = `Matches: ${matches}, won $${win}!`;
    } else {
      this.messageSpan.textContent = `Matches: ${matches}, no win.`;
    }
    this.balanceSpan.textContent = window.balance;
  }
}