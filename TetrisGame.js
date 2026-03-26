// games/TetrisGame.js
import { BaseGame } from './BaseGame.js';

export class TetrisGame extends BaseGame {
    mount(container) {
        super.mount(container);
        container.innerHTML = this.render();
        this.cacheElements();
        this.attachEvents();
        this.newGame();
        this.gameLoop = setInterval(() => this.update(), 500);
    }
    render() {
        return `
            <h2>Tetris (Simple)</h2>
            <div style="display: flex; gap: 20px; justify-content: center;">
                <div style="display: grid; grid-template-columns: repeat(10, 30px); gap: 1px; background:#111; padding:5px;" id="tetris-board"></div>
                <div>
                    <div>Next:</div>
                    <div style="display: grid; grid-template-columns: repeat(4, 30px); gap: 1px; background:#111; padding:5px;" id="tetris-next"></div>
                    <div>Score: <span id="tetris-score">0</span></div>
                </div>
            </div>
            <div class="balance-box">Balance: $<span id="tetris-balance">${window.balance}</span></div>
            <div class="game-controls">
                <input type="number" id="tetris-bet" min="1" value="10">
                <button class="btn btn-primary" id="tetris-new">New Game</button>
                <span id="tetris-message"></span>
            </div>
        `;
    }
    cacheElements() {
        this.boardDiv = this.container.querySelector('#tetris-board');
        this.nextDiv = this.container.querySelector('#tetris-next');
        this.scoreSpan = this.container.querySelector('#tetris-score');
        this.balanceSpan = this.container.querySelector('#tetris-balance');
        this.betInput = this.container.querySelector('#tetris-bet');
        this.messageSpan = this.container.querySelector('#tetris-message');
        this.newBtn = this.container.querySelector('#tetris-new');
    }
    attachEvents() {
        this.newBtn.addEventListener('click', () => this.newGame());
        window.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.move(-1, 0);
            else if (e.key === 'ArrowRight') this.move(1, 0);
            else if (e.key === 'ArrowDown') this.move(0, 1);
            else if (e.key === 'ArrowUp') this.rotate();
            e.preventDefault();
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
        this.score = 0;
        this.board = Array(20).fill().map(() => Array(10).fill(0));
        this.pieces = [
            [[1,1,1,1]],
            [[1,1],[1,1]],
            [[0,1,0],[1,1,1]],
            [[1,0,0],[1,1,1]],
            [[0,0,1],[1,1,1]],
            [[1,1,0],[0,1,1]],
            [[0,1,1],[1,1,0]]
        ];
        this.nextPiece = this.randomPiece();
        this.spawnPiece();
        this.updateScore();
        this.renderBoard();
        this.messageSpan.textContent = '';
    }
    randomPiece() {
        const idx = Math.floor(Math.random() * this.pieces.length);
        return JSON.parse(JSON.stringify(this.pieces[idx]));
    }
    spawnPiece() {
        this.currentPiece = this.nextPiece;
        this.nextPiece = this.randomPiece();
        this.pieceX = Math.floor((10 - this.currentPiece[0].length) / 2);
        this.pieceY = 0;
        if (this.collision()) {
            this.messageSpan.textContent = 'Game Over!';
            clearInterval(this.gameLoop);
        }
        this.renderNext();
    }
    collision() {
        for (let r = 0; r < this.currentPiece.length; r++) {
            for (let c = 0; c < this.currentPiece[0].length; c++) {
                if (this.currentPiece[r][c]) {
                    const boardX = this.pieceX + c;
                    const boardY = this.pieceY + r;
                    if (boardX < 0 || boardX >= 10 || boardY >= 20 || boardY < 0) return true;
                    if (boardY >= 0 && this.board[boardY][boardX]) return true;
                }
            }
        }
        return false;
    }
    merge() {
        for (let r = 0; r < this.currentPiece.length; r++) {
            for (let c = 0; c < this.currentPiece[0].length; c++) {
                if (this.currentPiece[r][c]) {
                    const boardX = this.pieceX + c;
                    const boardY = this.pieceY + r;
                    if (boardY >= 0) this.board[boardY][boardX] = 1;
                }
            }
        }
        this.clearLines();
        this.spawnPiece();
        this.renderBoard();
        if (this.collision()) {
            this.messageSpan.textContent = 'Game Over!';
        }
    }
    clearLines() {
        let linesCleared = 0;
        for (let y = 19; y >= 0; y--) {
            if (this.board[y].every(v => v !== 0)) {
                this.board.splice(y, 1);
                this.board.unshift(Array(10).fill(0));
                y++;
                linesCleared++;
            }
        }
        if (linesCleared > 0) {
            const points = [0, 100, 300, 500, 800];
            const addScore = points[linesCleared];
            this.score += addScore;
            this.updateScore();
        }
    }
    move(dx, dy) {
        this.pieceX += dx;
        this.pieceY += dy;
        if (this.collision()) {
            this.pieceX -= dx;
            this.pieceY -= dy;
            if (dy === 1) this.merge();
        }
        this.renderBoard();
    }
    rotate() {
        const rotated = this.currentPiece[0].map((_, idx) => this.currentPiece.map(row => row[idx]).reverse());
        const oldPiece = this.currentPiece;
        this.currentPiece = rotated;
        if (this.collision()) this.currentPiece = oldPiece;
        this.renderBoard();
    }
    update() {
        this.move(0, 1);
    }
    renderBoard() {
        this.boardDiv.innerHTML = '';
        for (let y = 0; y < 20; y++) {
            for (let x = 0; x < 10; x++) {
                const cell = document.createElement('div');
                cell.style.width = '30px';
                cell.style.height = '30px';
                cell.style.border = '1px solid #333';
                cell.style.backgroundColor = (this.board[y][x] ? '#00f' : '#000');
                if (this.currentPiece && y >= this.pieceY && y < this.pieceY + this.currentPiece.length &&
                    x >= this.pieceX && x < this.pieceX + this.currentPiece[0].length) {
                    const pieceRow = y - this.pieceY;
                    const pieceCol = x - this.pieceX;
                    if (this.currentPiece[pieceRow] && this.currentPiece[pieceRow][pieceCol]) {
                        cell.style.backgroundColor = '#0f0';
                    }
                }
                this.boardDiv.appendChild(cell);
            }
        }
    }
    renderNext() {
        this.nextDiv.innerHTML = '';
        for (let r = 0; r < this.nextPiece.length; r++) {
            for (let c = 0; c < this.nextPiece[0].length; c++) {
                const cell = document.createElement('div');
                cell.style.width = '30px';
                cell.style.height = '30px';
                cell.style.border = '1px solid #333';
                cell.style.backgroundColor = this.nextPiece[r][c] ? '#0f0' : '#000';
                this.nextDiv.appendChild(cell);
            }
        }
    }
    updateScore() {
        this.scoreSpan.textContent = this.score;
        if (this.score >= 1000) {
            const winAmount = this.bet * 2;
            window.balance += winAmount;
            window.updateGlobalBalance();
            this.messageSpan.textContent = `You reached 1000 points! Won $${winAmount}!`;
            clearInterval(this.gameLoop);
        }
    }
    unmount() {
        if (this.gameLoop) clearInterval(this.gameLoop);
        super.unmount();
    }
}