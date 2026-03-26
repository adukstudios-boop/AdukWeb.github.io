// games/FroggerGame.js
import { BaseGame } from './BaseGame.js';

export class FroggerGame extends BaseGame {
  mount(container) {
    super.mount(container);
    container.innerHTML = this.render();
    this.cacheElements();
    this.attachEvents();
    this.reset();
    this.gameLoop = setInterval(() => this.update(), 100);
  }
  render() {
    return `
            <h2>Frogger</h2>
            <canvas id="frogger-canvas" width="400" height="500" style="width:100%; height:auto; background:#228B22; border-radius:8px;"></canvas>
            <div>Score: <span id="frogger-score">0</span></div>
            <div class="balance-box">Balance: $<span id="frogger-balance">${window.balance}</span></div>
            <div class="game-controls">
                <input type="number" id="frogger-bet" min="1" value="10">
                <button class="btn btn-primary" id="frogger-reset">New Game</button>
                <span id="frogger-message"></span>
            </div>
        `;
  }
  cacheElements() {
    this.canvas = this.container.querySelector('#frogger-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.scoreSpan = this.container.querySelector('#frogger-score');
    this.balanceSpan = this.container.querySelector('#frogger-balance');
    this.betInput = this.container.querySelector('#frogger-bet');
    this.messageSpan = this.container.querySelector('#frogger-message');
    this.resetBtn = this.container.querySelector('#frogger-reset');
    this.keys = {};
  }
  attachEvents() {
    this.resetBtn.addEventListener('click', () => this.reset());
    document.addEventListener('keydown', (e) => {
      this.keys[e.key] = true;
      if (e.key === 'ArrowUp') this.frog.y = Math.max(0, this.frog.y - 20);
      if (e.key === 'ArrowDown') this.frog.y = Math.min(460, this.frog.y + 20);
      if (e.key === 'ArrowLeft') this.frog.x = Math.max(0, this.frog.x - 20);
      if (e.key === 'ArrowRight') this.frog.x = Math.min(380, this.frog.x + 20);
    });
    document.addEventListener('keyup', (e) => delete this.keys[e.key]);
  }
  reset() {
    const bet = parseInt(this.betInput.value);
    if (bet > window.balance) {
      alert('Insufficient balance');
      return;
    }
    window.balance -= bet;
    window.updateGlobalBalance();
    this.balanceSpan.textContent = window.balance;
    this.bet = bet;
    this.frog = { x: 190, y: 460 };
    this.cars = [];
    for (let i = 0; i < 5; i++) {
      this.cars.push({ x: Math.random() * 400, y: 100 + i * 60, dx: (Math.random() < 0.5 ? 2 : -2) });
    }
    this.score = 0;
    this.updateScore();
    this.messageSpan.textContent = '';
  }
  update() {
    // Move cars
    for (let car of this.cars) {
      car.x += car.dx;
      if (car.x < -30) car.x = 430;
      if (car.x > 430) car.x = -30;
    }
    // Collision
    for (let car of this.cars) {
      if (Math.abs(this.frog.x - car.x) < 30 && Math.abs(this.frog.y - car.y) < 20) {
        this.messageSpan.textContent = 'Game Over!';
        clearInterval(this.gameLoop);
        return;
      }
    }
    // Check if reached top
    if (this.frog.y <= 20) {
      this.score++;
      this.updateScore();
      this.frog = { x: 190, y: 460 };
      if (this.score >= 5) {
        const winAmount = this.bet * 2;
        window.balance += winAmount;
        window.updateGlobalBalance();
        this.messageSpan.textContent = `You win! +$${winAmount}`;
        clearInterval(this.gameLoop);
        return;
      }
    }
    this.draw();
  }
  draw() {
    this.ctx.fillStyle = '#228B22';
    this.ctx.fillRect(0, 0, 400, 500);
    // Cars
    this.ctx.fillStyle = '#f00';
    for (let car of this.cars) {
      this.ctx.fillRect(car.x, car.y, 30, 20);
    }
    // Frog
    this.ctx.fillStyle = '#0f0';
    this.ctx.fillRect(this.frog.x, this.frog.y, 20, 20);
  }
  updateScore() {
    this.scoreSpan.textContent = this.score;
  }
  unmount() {
    if (this.gameLoop) clearInterval(this.gameLoop);
    super.unmount();
  }
}