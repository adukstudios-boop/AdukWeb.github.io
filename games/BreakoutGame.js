// games/BreakoutGame.js
import { BaseGame } from './BaseGame.js';

export class BreakoutGame extends BaseGame {
  mount(container) {
    super.mount(container);
    container.innerHTML = this.render();
    this.cacheElements();
    this.attachEvents();
    this.reset();
    this.gameLoop = requestAnimationFrame(() => this.update());
  }
  render() {
    return `
            <h2>Breakout</h2>
            <canvas id="breakout-canvas" width="600" height="400" style="width:100%; height:auto; background:#000; border-radius:8px;"></canvas>
            <div>Score: <span id="breakout-score">0</span></div>
            <div class="balance-box">Balance: $<span id="breakout-balance">${window.balance}</span></div>
            <div class="game-controls">
                <input type="number" id="breakout-bet" min="1" value="10">
                <button class="btn btn-primary" id="breakout-reset">New Game</button>
                <span id="breakout-message"></span>
            </div>
        `;
  }
  cacheElements() {
    this.canvas = this.container.querySelector('#breakout-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.scoreSpan = this.container.querySelector('#breakout-score');
    this.balanceSpan = this.container.querySelector('#breakout-balance');
    this.betInput = this.container.querySelector('#breakout-bet');
    this.messageSpan = this.container.querySelector('#breakout-message');
    this.resetBtn = this.container.querySelector('#breakout-reset');
    this.keys = {};
  }
  attachEvents() {
    this.resetBtn.addEventListener('click', () => this.reset());
    document.addEventListener('keydown', (e) => this.keys[e.key] = true);
    document.addEventListener('keyup', (e) => this.keys[e.key] = false);
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
    this.paddleX = 250;
    this.ballX = 300;
    this.ballY = 350;
    this.ballVX = 3;
    this.ballVY = -3;
    this.score = 0;
    this.updateScore();
    this.createBricks();
    this.messageSpan.textContent = '';
  }
  createBricks() {
    this.bricks = [];
    const rows = 5;
    const cols = 8;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        this.bricks.push({ x: c * 75, y: r * 20 + 30, w: 70, h: 15, active: true });
      }
    }
  }
  update() {
    if (this.keys['ArrowLeft']) this.paddleX = Math.max(0, this.paddleX - 7);
    if (this.keys['ArrowRight']) this.paddleX = Math.min(500, this.paddleX + 7);
    
    this.ballX += this.ballVX;
    this.ballY += this.ballVY;
    if (this.ballX <= 0 || this.ballX >= 590) this.ballVX *= -1;
    if (this.ballY <= 0) this.ballVY *= -1;
    if (this.ballY >= 390) {
      this.messageSpan.textContent = 'Game Over!';
      cancelAnimationFrame(this.gameLoop);
      return;
    }
    // Paddle collision
    if (this.ballY >= 370 && this.ballX >= this.paddleX && this.ballX <= this.paddleX + 100) {
      this.ballVY = -Math.abs(this.ballVY);
      let offset = (this.ballX - (this.paddleX + 50)) / 50;
      this.ballVX += offset * 2;
      this.ballVX = Math.min(Math.max(this.ballVX, -5), 5);
    }
    // Brick collision
    for (let brick of this.bricks) {
      if (brick.active && this.ballX > brick.x && this.ballX < brick.x + brick.w && this.ballY > brick.y && this.ballY < brick.y + brick.h) {
        brick.active = false;
        this.ballVY *= -1;
        this.score++;
        this.updateScore();
        break;
      }
    }
    if (this.score === this.bricks.length) {
      const winAmount = this.bet * 2;
      window.balance += winAmount;
      window.updateGlobalBalance();
      this.messageSpan.textContent = `You win! +$${winAmount}`;
      cancelAnimationFrame(this.gameLoop);
    }
    this.draw();
    requestAnimationFrame(() => this.update());
  }
  draw() {
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, 600, 400);
    this.ctx.fillStyle = '#fff';
    this.ctx.fillRect(this.paddleX, 380, 100, 10);
    this.ctx.beginPath();
    this.ctx.arc(this.ballX, this.ballY, 6, 0, 2 * Math.PI);
    this.ctx.fill();
    for (let brick of this.bricks) {
      if (brick.active) {
        this.ctx.fillStyle = '#f00';
        this.ctx.fillRect(brick.x, brick.y, brick.w, brick.h);
      }
    }
  }
  updateScore() {
    this.scoreSpan.textContent = this.score;
    if (this.score >= this.bricks.length) {
      const winAmount = this.bet * 2;
      window.balance += winAmount;
      window.updateGlobalBalance();
      this.messageSpan.textContent = `You win! +$${winAmount}`;
      this.balanceSpan.textContent = window.balance;
    }
  }
}