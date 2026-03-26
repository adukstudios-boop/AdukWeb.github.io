// games/FortuneCookieGame.js
import { BaseGame } from './BaseGame.js';

export class FortuneCookieGame extends BaseGame {
  mount(container) {
    super.mount(container);
    container.innerHTML = this.render();
    this.cacheElements();
    this.attachEvents();
    this.fortunes = [
      "A pleasant surprise awaits you.",
      "You will soon receive good news.",
      "Your hard work will pay off.",
      "A new opportunity is on the horizon.",
      "Today is your lucky day!",
      "Fortune smiles upon you.",
      "A small gift will bring you joy.",
      "Someone is thinking of you."
    ];
  }
  render() {
    return `
            <h2>Fortune Cookie</h2>
            <div style="text-align:center; margin:20px;">
                <div id="fortune-cookie" style="font-size:5rem; cursor:pointer;">🥠</div>
                <div id="fortune-message" style="margin-top:20px; font-style:italic;"></div>
                <div id="fortune-reward" style="margin-top:10px;"></div>
            </div>
            <div class="balance-box">Balance: $<span id="fortune-balance">${window.balance}</span></div>
            <div class="game-controls">
                <button class="btn btn-primary" id="fortune-open">Open Cookie ($5)</button>
                <span id="fortune-status"></span>
            </div>
        `;
  }
  cacheElements() {
    this.cookieDiv = this.container.querySelector('#fortune-cookie');
    this.messageDiv = this.container.querySelector('#fortune-message');
    this.rewardDiv = this.container.querySelector('#fortune-reward');
    this.balanceSpan = this.container.querySelector('#fortune-balance');
    this.openBtn = this.container.querySelector('#fortune-open');
    this.statusSpan = this.container.querySelector('#fortune-status');
  }
  attachEvents() {
    this.openBtn.addEventListener('click', () => this.openCookie());
  }
  openCookie() {
    const cost = 5;
    if (cost > window.balance) {
      this.statusSpan.textContent = 'Insufficient balance';
      return;
    }
    window.balance -= cost;
    window.updateGlobalBalance();
    this.balanceSpan.textContent = window.balance;
    
    const fortune = this.fortunes[Math.floor(Math.random() * this.fortunes.length)];
    this.messageDiv.textContent = fortune;
    
    // Random chance to win a small prize
    const winChance = Math.random();
    if (winChance < 0.2) {
      const prize = Math.floor(Math.random() * 20) + 5;
      window.balance += prize;
      window.updateGlobalBalance();
      this.rewardDiv.textContent = `🍀 Lucky! You found $${prize} inside! 🍀`;
    } else {
      this.rewardDiv.textContent = 'No cash prize this time.';
    }
    this.balanceSpan.textContent = window.balance;
    this.statusSpan.textContent = '';
  }
}