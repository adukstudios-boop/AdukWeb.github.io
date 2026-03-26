// games/TableTennisGame.js
import { BaseGame } from './BaseGame.js';

export class TableTennisGame extends BaseGame {
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
            <h2>Table Tennis</h2>
            <canvas id="tabletennis-canvas" width="600" height="400" style="width:100%; height:auto; background:#0f172a; border-radius:8px;"></canvas>
            <div style="display: flex; justify-content: space-around;">
                <span>Player (W/S)</span>
                <span>AI</span>
                <span>Score: <span id="tabletennis-score">0 - 0</span></span>
            </div>
            <div class="balance-box">Balance: $<span id="tabletennis-balance">${window.balance}</span></div>
            <div class="game-controls">
                <input type="number" id="tabletennis-bet" min="1" value="10">
                <button class="btn btn-primary" id="tabletennis-reset">New Game</button>
                <span id="tabletennis-message"></span>
            </div>
        `;
  }
  cacheElements() {
    this.canvas = this.container.querySelector('#tabletennis-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.scoreSpan = this.container.querySelector('#tabletennis-score');
    this.balanceSpan = this.container.querySelector('#tabletennis-balance');
    this.betInput = this.container.querySelector('#tabletennis-bet');
    this.messageSpan = this.container.querySelector('#tabletennis-message');
    this.resetBtn = this.container.querySelector('#tabletennis-reset');
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
    this.playerY = 150;
    this.aiY = 150;
    this.ballX = 300;
    this.ballY = 200;
    this.ballVX = 3;
    this.ballVY = 2;
    this.scorePlayer = 0;
    this.scoreAI = 0;
    this.keys = {};
    this.paddleHeight = 80;
    this.updateScore();
    this.messageSpan.textContent = '';
  }
  update() {
    if (this.keys['w'] || this.keys['W']) this.playerY = Math.max(0, this.playerY - 5);
    if (this.keys['s'] || this.keys['S']) this.playerY = Math.min(320, this.playerY + 5);
    // Simple AI: follow ball
    this.aiY += (this.ballY - (this.aiY + this.paddleHeight / 2)) * 0.1;
    this.aiY = Math.min(Math.max(this.aiY, 0), 320);
    
    this.ballX += this.ballVX;
    this.ballY += this.ballVY;
    if (this.ballY <= 0 || this.ballY >= 390) this.ballVY *= -1;
    // Left paddle (player)
    if (this.ballX <= 20 && this.ballY >= this.playerY && this.ballY <= this.playerY + this.paddleHeight) {
      this.ballVX = Math.abs(this.ballVX);
      let offset = (this.ballY - (this.playerY + this.paddleHeight / 2)) / (this.paddleHeight / 2);
      this.ballVY += offset * 2;
    }
    // Right paddle (AI)
    if (this.ballX >= 570 && this.ballY >= this.aiY && this.ballY <= this.aiY + this.paddleHeight) {
      this.ballVX = -Math.abs(this.ballVX);
      let offset = (this.ballY - (this.aiY + this.paddleHeight / 2)) / (this.paddleHeight / 2);
      this.ballVY += offset * 2;
    }
    if (this.ballX <= 0) {
      this.scoreAI++;
      this.updateScore();
      this.ballX = 300;
      this.ballY = 200;
      this.ballVX = 3;
      this.ballVY = 2;
    }
    if (this.ballX >= 590) {
      this.scorePlayer++;
      this.updateScore();
      this.ballX = 300;
      this.ballY = 200;
      this.ballVX = -3;
      this.ballVY = -2;
    }
    this.draw();
    requestAnimationFrame(() => this.update());
  }
  draw() {
    this.ctx.fillStyle = '#0f172a';
    this.ctx.fillRect(0, 0, 600, 400);
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(10, this.playerY, 10, this.paddleHeight);
    this.ctx.fillRect(580, this.aiY, 10, this.paddleHeight);
    this.ctx.beginPath();
    this.ctx.arc(this.ballX, this.ballY, 6, 0, 2 * Math.PI);
    this.ctx.fillStyle = '#fbbf24';
    this.ctx.fill();
  }
  updateScore() {
    this.scoreSpan.textContent = `${this.scorePlayer} - ${this.scoreAI}`;
    if (this.scorePlayer >= 5 || this.scoreAI >= 5) {
      const winAmount = this.bet * 2;
      window.balance += winAmount;
      window.updateGlobalBalance();
      this.messageSpan.textContent = `${this.scorePlayer >= 5 ? 'You' : 'AI'} wins! +$${winAmount}`;
      this.balanceSpan.textContent = window.balance;
    }
  }
}