// games/BasketballShootoutGame.js
import { BaseGame } from './BaseGame.js';

export class BasketballShootoutGame extends BaseGame {
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
            <h2>Basketball Shootout</h2>
            <canvas id="basketball-canvas" width="600" height="400" style="width:100%; height:auto; background:#0f172a; border-radius:8px;"></canvas>
            <div>Score: <span id="basketball-score">0</span></div>
            <div class="balance-box">Balance: $<span id="basketball-balance">${window.balance}</span></div>
            <div class="game-controls">
                <input type="number" id="basketball-bet" min="1" value="10">
                <button class="btn btn-primary" id="basketball-shoot">Shoot</button>
                <button class="btn btn-secondary" id="basketball-reset">New Game</button>
                <span id="basketball-message"></span>
            </div>
        `;
    }
    cacheElements() {
        this.canvas = this.container.querySelector('#basketball-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.scoreSpan = this.container.querySelector('#basketball-score');
        this.balanceSpan = this.container.querySelector('#basketball-balance');
        this.betInput = this.container.querySelector('#basketball-bet');
        this.messageSpan = this.container.querySelector('#basketball-message');
        this.shootBtn = this.container.querySelector('#basketball-shoot');
        this.resetBtn = this.container.querySelector('#basketball-reset');
    }
    attachEvents() {
        this.shootBtn.addEventListener('click', () => this.shoot());
        this.resetBtn.addEventListener('click', () => this.reset());
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
        this.score = 0;
        this.ballX = 300;
        this.ballY = 350;
        this.ballVX = 0;
        this.ballVY = 0;
        this.shooting = false;
        this.updateScore();
        this.draw();
        this.messageSpan.textContent = '';
    }
    shoot() {
        if (this.shooting) return;
        this.shooting = true;
        this.ballX = 300;
        this.ballY = 350;
        this.ballVX = (Math.random() - 0.5) * 10;
        this.ballVY = -12;
        this.animateShot();
    }
    animateShot() {
        const animate = () => {
            this.ballX += this.ballVX;
            this.ballY += this.ballVY;
            this.ballVY += 0.5; // gravity
            if (this.ballY > 400) {
                this.shooting = false;
                this.draw();
                return;
            }
            // Check if ball goes through hoop (at 300,100 radius ~20)
            const hoopX = 300, hoopY = 100;
            const dx = this.ballX - hoopX;
            const dy = this.ballY - hoopY;
            if (Math.hypot(dx, dy) < 15 && this.ballVY > 0) {
                this.score++;
                this.updateScore();
                this.shooting = false;
                if (this.score >= 10) {
                    const winAmount = this.bet * 2;
                    window.balance += winAmount;
                    window.updateGlobalBalance();
                    this.messageSpan.textContent = `You scored 10! Won $${winAmount}!`;
                    this.balanceSpan.textContent = window.balance;
                }
                this.draw();
                return;
            }
            this.draw();
            requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }
    draw() {
        this.ctx.fillStyle = '#0f172a';
        this.ctx.fillRect(0, 0, 600, 400);
        // Draw hoop
        this.ctx.beginPath();
        this.ctx.arc(300, 100, 15, 0, 2 * Math.PI);
        this.ctx.strokeStyle = '#fbbf24';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        // Draw backboard
        this.ctx.fillStyle = '#8B4513';
        this.ctx.fillRect(285, 70, 30, 40);
        // Draw ball
        this.ctx.beginPath();
        this.ctx.arc(this.ballX, this.ballY, 10, 0, 2 * Math.PI);
        this.ctx.fillStyle = '#ff8c00';
        this.ctx.fill();
    }
    updateScore() {
        this.scoreSpan.textContent = this.score;
    }
}