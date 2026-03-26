// games/PongGame.js
import { BaseGame } from './BaseGame.js';

export class PongGame extends BaseGame {
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
            <h2>Pong</h2>
            <canvas id="pong-canvas" width="600" height="400" style="width:100%; height:auto; background:#000; border-radius:8px;"></canvas>
            <div style="display: flex; justify-content: space-around; margin-top:10px;">
                <span>Player 1 (W/S)</span>
                <span>Player 2 (↑/↓)</span>
                <span>Score: <span id="pong-score">0 - 0</span></span>
            </div>
            <div class="balance-box">Balance: $<span id="pong-balance">${window.balance}</span></div>
            <div class="game-controls">
                <input type="number" id="pong-bet" min="1" value="10">
                <button class="btn btn-primary" id="pong-reset">New Game</button>
                <span id="pong-message"></span>
            </div>
        `;
  }
  cacheElements() {
    this.canvas = this.container.querySelector('#pong-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.scoreSpan = this.container.querySelector('#pong-score');
    this.balanceSpan = this.container.querySelector('#pong-balance');
    this.betInput = this.container.querySelector('#pong-bet');
    this.messageSpan = this.container.querySelector('#pong-message');
    this.resetBtn = this.container.querySelector('#pong-reset');
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
    this.player1Y = 150;
    this.player2Y = 150;
    this.ballX = 300;
    this.ballY = 200;
    this.ballVX = 3;
    this.ballVY = 2;
    this.score1 = 0;
    this.score2 = 0;
    this.paddleHeight = 80;
    this.paddleWidth = 10;
    this.updateScore();
    this.messageSpan.textContent = '';
  }
  update() {
    if (this.keys['w'] || this.keys['W']) this.player1Y = Math.max(0, this.player1Y - 5);
    if (this.keys['s'] || this.keys['S']) this.player1Y = Math.min(320, this.player1Y + 5);
    if (this.keys['ArrowUp']) this.player2Y = Math.max(0, this.player2Y - 5);
    if (this.keys['ArrowDown']) this.player2Y = Math.min(320, this.player2Y + 5);
    
    this.ballX += this.ballVX;
    this.ballY += this.ballVY;
    if (this.ballY <= 0 || this.ballY >= 390) this.ballVY *= -1;
    // Left paddle
    if (this.ballX <= 20 && this.ballY >= this.player1Y && this.ballY <= this.player1Y + this.paddleHeight) {
      this.ballVX = Math.abs(this.ballVX);
      let offset = (this.ballY - (this.player1Y + this.paddleHeight / 2)) / (this.paddleHeight / 2);
      this.ballVY += offset * 2;
    }
    // Right paddle
    if (this.ballX >= 570 && this.ballY >= this.player2Y && this.ballY <= this.player2Y + this.paddleHeight) {
      this.ballVX = -Math.abs(this.ballVX);
      let offset = (this.ballY - (this.player2Y + this.paddleHeight / 2)) / (this.paddleHeight / 2);
      this.ballVY += offset * 2;
    }
    if (this.ballX <= 0) {
      this.score2++;
      this.updateScore();
      this.ballX = 300;
      this.ballY = 200;
      this.ballVX = 3;
      this.ballVY = 2;
    }
    if (this.ballX >= 590) {
      this.score1++;
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
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, 600, 400);
    this.ctx.fillStyle = '#fff';
    this.ctx.fillRect(10, this.player1Y, this.paddleWidth, this.paddleHeight);
    this.ctx.fillRect(580, this.player2Y, this.paddleWidth, this.paddleHeight);
    this.ctx.beginPath();
    this.ctx.arc(this.ballX, this.ballY, 6, 0, 2 * Math.PI);
    this.ctx.fillStyle = '#fff';
    this.ctx.fill();
  }
  updateScore() {
    this.scoreSpan.textContent = `${this.score1} - ${this.score2}`;
    if (this.score1 >= 5 || this.score2 >= 5) {
      const winAmount = this.bet * 2;
      window.balance += winAmount;
      window.updateGlobalBalance();
      this.messageSpan.textContent = `Player ${this.score1 >= 5 ? '1' : '2'} wins! +$${winAmount}`;
      this.balanceSpan.textContent = window.balance;
    }
  }
}