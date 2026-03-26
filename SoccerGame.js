// games/SoccerGame.js
import { BaseGame } from './BaseGame.js';

export class SoccerGame extends BaseGame {
  mount(container) {
    super.mount(container);
    container.innerHTML = this.render();
    this.cacheElements();
    this.attachEvents();
    this.reset();
    this.keys = {};
    document.addEventListener('keydown', (e) => this.keys[e.key] = true);
    document.addEventListener('keyup', (e) => this.keys[e.key] = false);
    this.gameLoop = requestAnimationFrame(() => this.update());
  }
  render() {
    return `
            <h2>2D Soccer</h2>
            <canvas id="soccer-canvas" width="600" height="400" style="width:100%; height:auto; background:#2e7d32; border-radius:8px;"></canvas>
            <div style="display: flex; justify-content: space-around; margin-top:10px;">
                <span>Player 1 (W/S)</span>
                <span>Player 2 (↑/↓)</span>
                <span>Score: <span id="soccer-score">0 - 0</span></span>
            </div>
            <div class="game-controls">
                <button class="btn btn-primary" id="soccer-reset">New Game</button>
                <span id="soccer-message"></span>
            </div>
        `;
  }
  cacheElements() {
    this.canvas = this.container.querySelector('#soccer-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.scoreSpan = this.container.querySelector('#soccer-score');
    this.messageSpan = this.container.querySelector('#soccer-message');
    this.resetBtn = this.container.querySelector('#soccer-reset');
  }
  attachEvents() {
    this.resetBtn.addEventListener('click', () => this.reset());
  }
  reset() {
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
    this.gameActive = true;
    this.updateScore();
    this.messageSpan.textContent = '';
  }
  update() {
    if (!this.gameActive) return;
    if (this.keys['w'] || this.keys['W']) this.player1Y = Math.max(0, this.player1Y - 5);
    if (this.keys['s'] || this.keys['S']) this.player1Y = Math.min(320, this.player1Y + 5);
    if (this.keys['ArrowUp']) this.player2Y = Math.max(0, this.player2Y - 5);
    if (this.keys['ArrowDown']) this.player2Y = Math.min(320, this.player2Y + 5);
    this.ballX += this.ballVX;
    this.ballY += this.ballVY;
    if (this.ballY <= 0 || this.ballY >= 390) this.ballVY *= -1;
    if (this.ballX <= 20 && this.ballY >= this.player1Y && this.ballY <= this.player1Y + this.paddleHeight) {
      this.ballVX = Math.abs(this.ballVX);
      let offset = (this.ballY - (this.player1Y + this.paddleHeight / 2)) / (this.paddleHeight / 2);
      this.ballVY += offset * 2;
    }
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
    this.ctx.fillStyle = '#2e7d32';
    this.ctx.fillRect(0, 0, 600, 400);
    this.ctx.strokeStyle = 'white';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(300, 0);
    this.ctx.lineTo(300, 400);
    this.ctx.stroke();
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(10, this.player1Y, this.paddleWidth, this.paddleHeight);
    this.ctx.fillRect(580, this.player2Y, this.paddleWidth, this.paddleHeight);
    this.ctx.beginPath();
    this.ctx.arc(this.ballX, this.ballY, 8, 0, 2 * Math.PI);
    this.ctx.fillStyle = 'orange';
    this.ctx.fill();
    this.ctx.strokeStyle = 'black';
    this.ctx.stroke();
  }
  updateScore() {
    this.scoreSpan.textContent = `${this.score1} - ${this.score2}`;
    if (this.score1 >= 5 || this.score2 >= 5) {
      this.gameActive = false;
      this.messageSpan.textContent = `Player ${this.score1 >= 5 ? '1' : '2'} wins!`;
    }
  }
}