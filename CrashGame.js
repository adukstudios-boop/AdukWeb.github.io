// games/CrashGame.js
import { BaseGame } from './BaseGame.js';

export class CrashGame extends BaseGame {
  mount(container) {
    super.mount(container);
    container.innerHTML = this.render();
    this.cacheElements();
    this.attachEvents();
    this.raf = null;
    this.multiplier = 1.0;
    this.crashed = false;
    this.started = false;
    this.crashPoint = 1.0;
  }
  render() {
    return `
            <h2>Crash Game</h2>
            <div style="font-size: 4rem; text-align: center; margin: 20px;" id="crash-multiplier">1.00x</div>
            <div class="balance-box">Balance: $<span id="crash-balance">${window.balance}</span></div>
            <div class="game-controls">
                <input type="number" id="crash-bet" min="1" value="10">
                <button class="btn btn-primary" id="crash-start">Start</button>
                <button class="btn btn-secondary" id="crash-cashout" disabled>Cash Out</button>
                <span id="crash-message"></span>
            </div>
        `;
  }
  cacheElements() {
    this.multiplierSpan = this.container.querySelector('#crash-multiplier');
    this.balanceSpan = this.container.querySelector('#crash-balance');
    this.betInput = this.container.querySelector('#crash-bet');
    this.startBtn = this.container.querySelector('#crash-start');
    this.cashoutBtn = this.container.querySelector('#crash-cashout');
    this.messageSpan = this.container.querySelector('#crash-message');
  }
  attachEvents() {
    this.startBtn.addEventListener('click', () => this.start());
    this.cashoutBtn.addEventListener('click', () => this.cashOut());
  }
  start() {
    const bet = parseInt(this.betInput.value);
    if (bet > window.balance) { alert('Insufficient balance'); return; }
    window.balance -= bet;
    window.updateGlobalBalance();
    this.balanceSpan.textContent = window.balance;
    
    this.started = true;
    this.crashed = false;
    this.multiplier = 1.0;
    this.crashPoint = 1 + Math.random() * 4;
    this.cashoutBtn.disabled = false;
    this.startBtn.disabled = true;
    this.messageSpan.textContent = '';
    this.lastTime = performance.now();
    this.raf = requestAnimationFrame((t) => this.update(t));
  }
  update(now) {
    if (!this.started || this.crashed) return;
    const dt = (now - this.lastTime) / 1000;
    this.lastTime = now;
    this.multiplier += 0.02 * dt * 60;
    this.multiplierSpan.textContent = this.multiplier.toFixed(2) + 'x';
    if (this.multiplier >= this.crashPoint) {
      this.crashed = true;
      this.started = false;
      cancelAnimationFrame(this.raf);
      this.cashoutBtn.disabled = true;
      this.startBtn.disabled = false;
      this.messageSpan.textContent = 'Crashed! You lost.';
    } else {
      this.raf = requestAnimationFrame((t) => this.update(t));
    }
  }
  cashOut() {
    if (!this.started || this.crashed) return;
    this.started = false;
    this.crashed = true;
    cancelAnimationFrame(this.raf);
    const bet = parseInt(this.betInput.value);
    const win = bet * this.multiplier;
    window.balance += win;
    window.updateGlobalBalance();
    this.balanceSpan.textContent = window.balance;
    this.messageSpan.textContent = `Cashed out at ${this.multiplier.toFixed(2)}x, won $${win.toFixed(2)}`;
    this.cashoutBtn.disabled = true;
    this.startBtn.disabled = false;
  }
  unmount() {
    if (this.raf) cancelAnimationFrame(this.raf);
    super.unmount();
  }
}