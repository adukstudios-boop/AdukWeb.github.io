// games/FlappyBirdGame.js
import { BaseGame } from './BaseGame.js';

export class FlappyBirdGame extends BaseGame {
  mount(container) {
    super.mount(container);
    container.innerHTML = this.render();
    this.cacheElements();
    this.attachEvents();
    this.reset();
    this.gameLoop = setInterval(() => this.update(), 30);
  }
  render() {
    return `
            <h2>Flappy Bird</h2>
            <canvas id="flappy-canvas" width="400" height="500" style="width:100%; height:auto; background:#87CEEB; border-radius:8px;"></canvas>
            <div>Score: <span id="flappy-score">0</span></div>
            <div class="balance-box">Balance: $<span id="flappy-balance">${window.balance}</span></div>
            <div class="game-controls">
                <input type="number" id="flappy-bet" min="1" value="10">
                <button class="btn btn-primary" id="flappy-new">New Game</button>
                <button class="btn btn-secondary" id="flappy-jump">Jump (Space)</button>
                <span id="flappy-message"></span>
            </div>
        `;
  }
  cacheElements() {
    this.canvas = this.container.querySelector('#flappy-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.scoreSpan = this.container.querySelector('#flappy-score');
    this.balanceSpan = this.container.querySelector('#flappy-balance');
    this.betInput = this.container.querySelector('#flappy-bet');
    this.messageSpan = this.container.querySelector('#flappy-message');
    this.newBtn = this.container.querySelector('#flappy-new');
    this.jumpBtn = this.container.querySelector('#flappy-jump');
  }
  attachEvents() {
    this.newBtn.addEventListener('click', () => this.reset());
    this.jumpBtn.addEventListener('click', () => this.jump());
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space') this.jump();
    });
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
    this.birdY = 250;
    this.birdVelocity = 0;
    this.gravity = 0.5;
    this.jumpStrength = -8;
    this.pipes = [{ x: 400, gapY: 200, gapHeight: 150 }];
    this.score = 0;
    this.gameOver = false;
    this.updateScore();
    this.messageSpan.textContent = '';
  }
  jump() {
    if (this.gameOver) return;
    this.birdVelocity = this.jumpStrength;
  }
  update() {
    if (this.gameOver) return;
    this.birdVelocity += this.gravity;
    this.birdY += this.birdVelocity;
    if (this.birdY <= 0 || this.birdY >= 500) this.gameOver = true;
    
    // Move pipes
    for (let i = 0; i < this.pipes.length; i++) {
      this.pipes[i].x -= 3;
    }
    if (this.pipes[0].x < -50) {
      this.pipes.shift();
      this.score++;
      this.updateScore();
      const newGapY = 100 + Math.random() * 250;
      this.pipes.push({ x: 400, gapY: newGapY, gapHeight: 150 });
    }
    
    // Collision with pipes
    for (let pipe of this.pipes) {
      if (pipe.x < 80 && pipe.x + 50 > 50) {
        if (this.birdY < pipe.gapY || this.birdY > pipe.gapY + pipe.gapHeight) {
          this.gameOver = true;
        }
      }
    }
    
    this.draw();
    if (this.gameOver) {
      this.messageSpan.textContent = 'Game Over!';
      clearInterval(this.gameLoop);
      return;
    }
    if (this.score >= 10) {
      const winAmount = this.bet * 2;
      window.balance += winAmount;
      window.updateGlobalBalance();
      this.messageSpan.textContent = `You scored 10! Won $${winAmount}!`;
      this.gameOver = true;
      clearInterval(this.gameLoop);
    }
  }
  draw() {
    this.ctx.fillStyle = '#87CEEB';
    this.ctx.fillRect(0, 0, 400, 500);
    // Draw bird
    this.ctx.fillStyle = '#f4d03f';
    this.ctx.fillRect(50, this.birdY, 30, 30);
    // Draw pipes
    for (let pipe of this.pipes) {
      this.ctx.fillStyle = '#2ecc71';
      this.ctx.fillRect(pipe.x, 0, 50, pipe.gapY);
      this.ctx.fillRect(pipe.x, pipe.gapY + pipe.gapHeight, 50, 500 - (pipe.gapY + pipe.gapHeight));
    }
  }
  updateScore() {
    this.scoreSpan.textContent = this.score;
  }
  unmount() {
    if (this.gameLoop) clearInterval(this.gameLoop);
    super.unmount();
  }
}