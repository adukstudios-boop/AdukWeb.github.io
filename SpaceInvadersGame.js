// games/SpaceInvadersGame.js
import { BaseGame } from './BaseGame.js';

export class SpaceInvadersGame extends BaseGame {
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
            <h2>Space Invaders</h2>
            <canvas id="spaceinvaders-canvas" width="400" height="500" style="width:100%; height:auto; background:#000; border-radius:8px;"></canvas>
            <div>Score: <span id="spaceinvaders-score">0</span></div>
            <div class="balance-box">Balance: $<span id="spaceinvaders-balance">${window.balance}</span></div>
            <div class="game-controls">
                <input type="number" id="spaceinvaders-bet" min="1" value="10">
                <button class="btn btn-primary" id="spaceinvaders-reset">New Game</button>
                <button class="btn btn-secondary" id="spaceinvaders-shoot">Shoot (Space)</button>
                <span id="spaceinvaders-message"></span>
            </div>
        `;
  }
  cacheElements() {
    this.canvas = this.container.querySelector('#spaceinvaders-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.scoreSpan = this.container.querySelector('#spaceinvaders-score');
    this.balanceSpan = this.container.querySelector('#spaceinvaders-balance');
    this.betInput = this.container.querySelector('#spaceinvaders-bet');
    this.messageSpan = this.container.querySelector('#spaceinvaders-message');
    this.resetBtn = this.container.querySelector('#spaceinvaders-reset');
    this.shootBtn = this.container.querySelector('#spaceinvaders-shoot');
  }
  attachEvents() {
    this.resetBtn.addEventListener('click', () => this.reset());
    this.shootBtn.addEventListener('click', () => this.shoot());
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space') this.shoot();
      if (e.code === 'ArrowLeft') this.playerX = Math.max(0, this.playerX - 15);
      if (e.code === 'ArrowRight') this.playerX = Math.min(350, this.playerX + 15);
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
    this.playerX = 175;
    this.bullets = [];
    this.enemies = [];
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 8; c++) {
        this.enemies.push({ x: c * 40 + 20, y: r * 30 + 20, active: true });
      }
    }
    this.score = 0;
    this.updateScore();
    this.messageSpan.textContent = '';
  }
  shoot() {
    this.bullets.push({ x: this.playerX + 15, y: 450 });
  }
  update() {
    // Move bullets
    for (let i = 0; i < this.bullets.length; i++) {
      this.bullets[i].y -= 5;
      if (this.bullets[i].y < 0) this.bullets.splice(i--, 1);
    }
    // Enemy movement & collision
    for (let enemy of this.enemies) {
      if (enemy.active) {
        // move enemy (simple left-right)
        // just for demo, we'll skip complex movement
      }
    }
    // Collision
    for (let i = 0; i < this.bullets.length; i++) {
      for (let j = 0; j < this.enemies.length; j++) {
        if (this.enemies[j].active && Math.abs(this.bullets[i].x - (this.enemies[j].x + 15)) < 15 && Math.abs(this.bullets[i].y - (this.enemies[j].y + 10)) < 15) {
          this.enemies[j].active = false;
          this.bullets.splice(i--, 1);
          this.score++;
          this.updateScore();
          break;
        }
      }
    }
    if (this.score === this.enemies.length) {
      const winAmount = this.bet * 2;
      window.balance += winAmount;
      window.updateGlobalBalance();
      this.messageSpan.textContent = `You win! +$${winAmount}`;
      clearInterval(this.gameLoop);
    }
    this.draw();
  }
  draw() {
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, 400, 500);
    // Player
    this.ctx.fillStyle = '#0f0';
    this.ctx.fillRect(this.playerX, 470, 30, 20);
    // Bullets
    this.ctx.fillStyle = '#ff0';
    for (let b of this.bullets) {
      this.ctx.fillRect(b.x, b.y, 3, 8);
    }
    // Enemies
    this.ctx.fillStyle = '#f00';
    for (let e of this.enemies) {
      if (e.active) this.ctx.fillRect(e.x, e.y, 30, 20);
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