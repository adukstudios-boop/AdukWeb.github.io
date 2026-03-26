// games/SpinTheWheelGame.js
import { BaseGame } from './BaseGame.js';

export class SpinTheWheelGame extends BaseGame {
  mount(container) {
    super.mount(container);
    container.innerHTML = this.render();
    this.cacheElements();
    this.attachEvents();
  }
  render() {
    return `
            <h2>Spin the Wheel</h2>
            <div style="font-size: 4rem; text-align: center; margin:20px;" id="wheel-result">🎡</div>
            <div class="balance-box">Balance: $<span id="wheel2-balance">${window.balance}</span></div>
            <div class="game-controls">
                <input type="number" id="wheel2-bet" min="1" value="10">
                <button class="btn btn-primary" id="wheel2-spin">Spin</button>
                <span id="wheel2-message"></span>
            </div>
        `;
  }
  cacheElements() {
    this.resultSpan = this.container.querySelector('#wheel-result');
    this.balanceSpan = this.container.querySelector('#wheel2-balance');
    this.betInput = this.container.querySelector('#wheel2-bet');
    this.messageSpan = this.container.querySelector('#wheel2-message');
    this.spinBtn = this.container.querySelector('#wheel2-spin');
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
    window.updateGlobalBalance();
    this.balanceSpan.textContent = window.balance;
    
    const segments = ['1x', '2x', '3x', '5x', '10x', '0x', '1x', '2x'];
    const result = segments[Math.floor(Math.random() * segments.length)];
    this.resultSpan.textContent = result;
    const multiplier = result === '0x' ? 0 : parseInt(result);
    const win = bet * multiplier;
    if (win > 0) {
      window.balance += win;
      window.updateGlobalBalance();
      this.messageSpan.textContent = `You won $${win}!`;
    } else {
      this.messageSpan.textContent = 'No win.';
    }
    this.balanceSpan.textContent = window.balance;
  }
}