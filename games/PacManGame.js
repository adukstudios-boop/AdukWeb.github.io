// games/PacManGame.js
import { BaseGame } from './BaseGame.js';

export class PacManGame extends BaseGame {
    mount(container) {
        super.mount(container);
        container.innerHTML = this.render();
        this.cacheElements();
        this.attachEvents();
        this.reset();
        this.gameLoop = setInterval(() => this.update(), 150);
    }
    render() {
        return `
            <h2>Pac-Man (Simple)</h2>
            <canvas id="pacman-canvas" width="400" height="400" style="width:100%; height:auto; background:#000; border-radius:8px;"></canvas>
            <div>Score: <span id="pacman-score">0</span></div>
            <div class="balance-box">Balance: $<span id="pacman-balance">${window.balance}</span></div>
            <div class="game-controls">
                <input type="number" id="pacman-bet" min="1" value="10">
                <button class="btn btn-primary" id="pacman-reset">New Game</button>
                <span id="pacman-message"></span>
            </div>
        `;
    }
    cacheElements() {
        this.canvas = this.container.querySelector('#pacman-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.scoreSpan = this.container.querySelector('#pacman-score');
        this.balanceSpan = this.container.querySelector('#pacman-balance');
        this.betInput = this.container.querySelector('#pacman-bet');
        this.messageSpan = this.container.querySelector('#pacman-message');
        this.resetBtn = this.container.querySelector('#pacman-reset');
        this.keys = {};
    }
    attachEvents() {
        this.resetBtn.addEventListener('click', () => this.reset());
        document.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
            if (e.key === 'ArrowUp') this.dir = 'up';
            if (e.key === 'ArrowDown') this.dir = 'down';
            if (e.key === 'ArrowLeft') this.dir = 'left';
            if (e.key === 'ArrowRight') this.dir = 'right';
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
        this.pacman = {x: 200, y: 200, dir: 'right'};
        this.dots = [];
        for (let i=0; i<20; i++) {
            for (let j=0; j<20; j++) {
                if ((i+j)%2===0) this.dots.push({x: i*20, y: j*20, active: true});
            }
        }
        this.score = 0;
        this.updateScore();
        this.messageSpan.textContent = '';
    }
    update() {
        let move = {x:0, y:0};
        switch(this.dir) {
            case 'up': move.y = -5; break;
            case 'down': move.y = 5; break;
            case 'left': move.x = -5; break;
            case 'right': move.x = 5; break;
        }
        let newX = this.pacman.x + move.x;
        let newY = this.pacman.y + move.y;
        if (newX >= 0 && newX <= 380 && newY >= 0 && newY <= 380) {
            this.pacman.x = newX;
            this.pacman.y = newY;
        }
        // Check dot collision
        for (let i=0; i<this.dots.length; i++) {
            let d = this.dots[i];
            if (d.active && Math.abs(this.pacman.x - d.x) < 10 && Math.abs(this.pacman.y - d.y) < 10) {
                d.active = false;
                this.score++;
                this.updateScore();
                break;
            }
        }
        if (this.score === this.dots.length) {
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
        this.ctx.fillRect(0, 0, 400, 400);
        // Dots
        this.ctx.fillStyle = '#fff';
        for (let d of this.dots) {
            if (d.active) this.ctx.fillRect(d.x+8, d.y+8, 4, 4);
        }
        // Pac-Man
        this.ctx.fillStyle = '#ff0';
        this.ctx.beginPath();
        this.ctx.arc(this.pacman.x+10, this.pacman.y+10, 10, 0.2, 5.8);
        this.ctx.fill();
    }
    updateScore() {
        this.scoreSpan.textContent = this.score;
    }
    unmount() {
        if (this.gameLoop) clearInterval(this.gameLoop);
        super.unmount();
    }
}