// games/SnakeGame.js
import { BaseGame } from './BaseGame.js';

export class SnakeGame extends BaseGame {
    mount(container) {
        super.mount(container);
        container.innerHTML = this.render();
        this.cacheElements();
        this.attachEvents();
        this.newGame();
        this.gameLoop = setInterval(() => this.update(), 150);
    }
    render() {
        return `
            <h2>Snake</h2>
            <div style="display: grid; grid-template-columns: repeat(20, 20px); gap: 1px; background:#111; justify-content:center; margin:20px;" id="snake-board"></div>
            <div>Score: <span id="snake-score">0</span></div>
            <div class="balance-box">Balance: $<span id="snake-balance">${window.balance}</span></div>
            <div class="game-controls">
                <input type="number" id="snake-bet" min="1" value="10">
                <button class="btn btn-primary" id="snake-new">New Game</button>
                <span id="snake-message"></span>
            </div>
        `;
    }
    cacheElements() {
        this.boardDiv = this.container.querySelector('#snake-board');
        this.scoreSpan = this.container.querySelector('#snake-score');
        this.balanceSpan = this.container.querySelector('#snake-balance');
        this.betInput = this.container.querySelector('#snake-bet');
        this.messageSpan = this.container.querySelector('#snake-message');
        this.newBtn = this.container.querySelector('#snake-new');
    }
    attachEvents() {
        this.newBtn.addEventListener('click', () => this.newGame());
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowUp' && this.dir !== 'down') this.dir = 'up';
            else if (e.key === 'ArrowDown' && this.dir !== 'up') this.dir = 'down';
            else if (e.key === 'ArrowLeft' && this.dir !== 'right') this.dir = 'left';
            else if (e.key === 'ArrowRight' && this.dir !== 'left') this.dir = 'right';
        });
    }
    newGame() {
        const bet = parseInt(this.betInput.value);
        if (bet > window.balance) {
            alert('Insufficient balance');
            return;
        }
        window.balance -= bet;
        window.updateGlobalBalance();
        this.balanceSpan.textContent = window.balance;
        this.bet = bet;
        this.gridSize = 20;
        this.snake = [{x:10, y:10}];
        this.dir = 'right';
        this.food = this.randomFood();
        this.score = 0;
        this.updateScore();
        this.renderBoard();
        this.messageSpan.textContent = '';
    }
    randomFood() {
        let food;
        do {
            food = {x: Math.floor(Math.random() * this.gridSize), y: Math.floor(Math.random() * this.gridSize)};
        } while (this.snake.some(segment => segment.x === food.x && segment.y === food.y));
        return food;
    }
    update() {
        let head = {...this.snake[0]};
        switch(this.dir) {
            case 'up': head.y--; break;
            case 'down': head.y++; break;
            case 'left': head.x--; break;
            case 'right': head.x++; break;
        }
        // Check collision with walls or itself
        if (head.x < 0 || head.x >= this.gridSize || head.y < 0 || head.y >= this.gridSize ||
            this.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            this.messageSpan.textContent = 'Game Over!';
            clearInterval(this.gameLoop);
            return;
        }
        this.snake.unshift(head);
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score++;
            this.updateScore();
            this.food = this.randomFood();
            if (this.score >= 10) {
                const winAmount = this.bet * 2;
                window.balance += winAmount;
                window.updateGlobalBalance();
                this.messageSpan.textContent = `You reached 10 points! Won $${winAmount}!`;
                clearInterval(this.gameLoop);
            }
        } else {
            this.snake.pop();
        }
        this.renderBoard();
    }
    renderBoard() {
        this.boardDiv.innerHTML = '';
        for (let y = 0; y < this.gridSize; y++) {
            for (let x = 0; x < this.gridSize; x++) {
                const cell = document.createElement('div');
                cell.style.width = '20px';
                cell.style.height = '20px';
                cell.style.backgroundColor = '#111';
                if (this.snake.some(segment => segment.x === x && segment.y === y)) cell.style.backgroundColor = '#0f0';
                if (this.food.x === x && this.food.y === y) cell.style.backgroundColor = '#f00';
                this.boardDiv.appendChild(cell);
            }
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