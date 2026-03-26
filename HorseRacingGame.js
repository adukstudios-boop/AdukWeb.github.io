// games/HorseRacingGame.js
import { BaseGame } from './BaseGame.js';

export class HorseRacingGame extends BaseGame {
  mount(container) {
    super.mount(container);
    container.innerHTML = this.render();
    this.cacheElements();
    this.attachEvents();
    this.reset();
  }
  render() {
    return `
            <h2>Horse Racing</h2>
            <div style="margin: 20px 0;">
                ${[1,2,3,4,5,6,7,8].map(i => `
                    <div style="display: flex; align-items: center; margin: 5px 0;">
                        <span style="width: 50px;">Horse ${i}</span>
                        <div style="flex:1; height: 30px; background: #333; border-radius: 15px;">
                            <div id="horse-${i}" style="width:0%; height:100%; background: #fbbf24; border-radius:15px; transition: width 0.1s;"></div>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="balance-box">Balance: $<span id="horse-balance">${window.balance}</span></div>
            <div class="game-controls">
                <input type="number" id="horse-bet" min="1" value="10">
                <select id="horse-pick">
                    <option value="1">Horse 1</option>
                    <option value="2">Horse 2</option>
                    <option value="3">Horse 3</option>
                    <option value="4">Horse 4</option>
                    <option value="5">Horse 5</option>
                    <option value="6">Horse 6</option>
                    <option value="7">Horse 7</option>
                    <option value="8">Horse 8</option>
                </select>
                <button class="btn btn-primary" id="horse-start">Start Race</button>
                <span id="horse-message"></span>
            </div>
        `;
  }
  cacheElements() {
    this.horseBars = [1, 2, 3, 4, 5, 6, 7, 8].map(i => this.container.querySelector(`#horse-${i}`));
    this.balanceSpan = this.container.querySelector('#horse-balance');
    this.betInput = this.container.querySelector('#horse-bet');
    this.pickSelect = this.container.querySelector('#horse-pick');
    this.messageSpan = this.container.querySelector('#horse-message');
    this.startBtn = this.container.querySelector('#horse-start');
  }
  attachEvents() {
    this.startBtn.addEventListener('click', () => this.startRace());
  }
  reset() {
    this.positions = [0, 0, 0, 0, 0, 0, 0, 0];
    this.racing = false;
    this.updateBars();
  }
  startRace() {
    const bet = parseInt(this.betInput.value);
    const pick = parseInt(this.pickSelect.value);
    if (bet > window.balance) {
      alert('Insufficient balance');
      return;
    }
    window.balance -= bet;
    window.updateGlobalBalance();
    this.balanceSpan.textContent = window.balance;
    this.positions = [0, 0, 0, 0, 0, 0, 0, 0];
    this.racing = true;
    this.messageSpan.textContent = '';
    this.raceInterval = setInterval(() => this.updateRace(), 100);
  }
  updateRace() {
    if (!this.racing) return;
    for (let i = 0; i < 8; i++) {
      this.positions[i] += Math.random() * 2;
    }
    this.updateBars();
    let winner = -1;
    for (let i = 0; i < 8; i++) {
      if (this.positions[i] >= 100) {
        winner = i + 1;
        break;
      }
    }
    if (winner !== -1) {
      clearInterval(this.raceInterval);
      this.racing = false;
      const pick = parseInt(this.pickSelect.value);
      if (winner === pick) {
        const win = parseInt(this.betInput.value) * 5;
        window.balance += win;
        window.updateGlobalBalance();
        this.messageSpan.textContent = `Horse ${winner} wins! You won $${win}!`;
      } else {
        this.messageSpan.textContent = `Horse ${winner} wins. You lost.`;
      }
      this.balanceSpan.textContent = window.balance;
    }
  }
  updateBars() {
    for (let i = 0; i < 8; i++) {
      this.horseBars[i].style.width = Math.min(this.positions[i], 100) + '%';
    }
  }
}