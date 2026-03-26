// games/KenoGame.js
import { BaseGame } from './BaseGame.js';

export class KenoGame extends BaseGame {
  mount(container) {
    super.mount(container);
    container.innerHTML = this.render();
    this.cacheElements();
    this.attachEvents();
    this.picks = [];
  }
  render() {
    let numbersHtml = '';
    for (let i = 1; i <= 80; i++) {
      numbersHtml += `<button class="keno-number" data-num="${i}">${i}</button>`;
    }
    return `
            <h2>Keno</h2>
            <div class="balance-box">Balance: $<span id="keno-balance">${window.balance}</span></div>
            <p>Pick 5 numbers (click numbers)</p>
            <div style="display: grid; grid-template-columns: repeat(10,1fr); gap:2px; max-height:200px; overflow-y:auto;">${numbersHtml}</div>
            <div>Selected: <span id="keno-selected">[]</span></div>
            <div class="game-controls">
                <input type="number" id="keno-bet" min="1" value="10">
                <button class="btn btn-primary" id="keno-draw">Draw</button>
                <span id="keno-message"></span>
            </div>
        `;
  }
  cacheElements() {
    this.balanceSpan = this.container.querySelector('#keno-balance');
    this.betInput = this.container.querySelector('#keno-bet');
    this.messageSpan = this.container.querySelector('#keno-message');
    this.drawBtn = this.container.querySelector('#keno-draw');
    this.selectedSpan = this.container.querySelector('#keno-selected');
    this.numberButtons = this.container.querySelectorAll('.keno-number');
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
    while (drawn.length < 20) {
      const n = Math.floor(Math.random() * 80) + 1;
      if (!drawn.includes(n)) drawn.push(n);
    }
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