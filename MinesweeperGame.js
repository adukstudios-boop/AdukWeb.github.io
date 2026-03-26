// games/MinesweeperGame.js
import { BaseGame } from './BaseGame.js';

export class MinesweeperGame extends BaseGame {
    mount(container) {
        super.mount(container);
        container.innerHTML = this.render();
        this.cacheElements();
        this.attachEvents();
        this.newGame();
    }
    render() {
        return `
            <h2>Minesweeper</h2>
            <div style="display: grid; grid-template-columns: repeat(5, 50px); gap: 2px; justify-content: center; margin:20px;" id="minesweeper-board"></div>
            <div class="balance-box">Balance: $<span id="minesweeper-balance">${window.balance}</span></div>
            <div class="game-controls">
                <input type="number" id="minesweeper-bet" min="1" value="10">
                <button class="btn btn-primary" id="minesweeper-new">New Game</button>
                <span id="minesweeper-message"></span>
            </div>
        `;
    }
    cacheElements() {
        this.boardDiv = this.container.querySelector('#minesweeper-board');
        this.balanceSpan = this.container.querySelector('#minesweeper-balance');
        this.betInput = this.container.querySelector('#minesweeper-bet');
        this.messageSpan = this.container.querySelector('#minesweeper-message');
        this.newBtn = this.container.querySelector('#minesweeper-new');
    }
    attachEvents() {
        this.newBtn.addEventListener('click', () => this.newGame());
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

        // 5x5 board with 3 mines
        this.board = Array(5).fill().map(() => Array(5).fill(0));
        this.revealed = Array(5).fill().map(() => Array(5).fill(false));
        this.mines = 3;
        // Place mines
        let minesPlaced = 0;
        while (minesPlaced < this.mines) {
            const r = Math.floor(Math.random() * 5);
            const c = Math.floor(Math.random() * 5);
            if (this.board[r][c] !== -1) {
                this.board[r][c] = -1;
                minesPlaced++;
            }
        }
        // Calculate numbers
        for (let r = 0; r < 5; r++) {
            for (let c = 0; c < 5; c++) {
                if (this.board[r][c] === -1) continue;
                let count = 0;
                for (let dr = -1; dr <= 1; dr++) {
                    for (let dc = -1; dc <= 1; dc++) {
                        const nr = r + dr, nc = c + dc;
                        if (nr >= 0 && nr < 5 && nc >= 0 && nc < 5 && this.board[nr][nc] === -1) count++;
                    }
                }
                this.board[r][c] = count;
            }
        }
        this.renderBoard();
        this.messageSpan.textContent = '';
    }
    renderBoard() {
        this.boardDiv.innerHTML = '';
        for (let r = 0; r < 5; r++) {
            for (let c = 0; c < 5; c++) {
                const cell = document.createElement('div');
                cell.style.width = '50px';
                cell.style.height = '50px';
                cell.style.border = '1px solid #aaa';
                cell.style.backgroundColor = this.revealed[r][c] ? '#ccc' : '#1e293b';
                cell.style.display = 'flex';
                cell.style.alignItems = 'center';
                cell.style.justifyContent = 'center';
                cell.style.fontSize = '1.2rem';
                cell.style.color = 'black';
                if (this.revealed[r][c]) {
                    if (this.board[r][c] === -1) cell.textContent = '💣';
                    else cell.textContent = this.board[r][c] === 0 ? '' : this.board[r][c];
                } else {
                    cell.textContent = '?';
                }
                cell.dataset.r = r;
                cell.dataset.c = c;
                cell.addEventListener('click', () => this.revealCell(r, c));
                this.boardDiv.appendChild(cell);
            }
        }
    }
    revealCell(r, c) {
        if (this.revealed[r][c]) return;
        if (this.board[r][c] === -1) {
            // Mine hit: lose
            this.messageSpan.textContent = 'BOOM! You hit a mine. You lose.';
            this.revealed[r][c] = true;
            this.renderBoard();
            // Disable further clicks
            this.newBtn.disabled = false;
            return;
        }
        // Reveal cell
        this.reveal(r, c);
        this.renderBoard();
        // Check win: all non-mine cells revealed
        let allRevealed = true;
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                if (this.board[i][j] !== -1 && !this.revealed[i][j]) allRevealed = false;
            }
        }
        if (allRevealed) {
            const winAmount = this.bet * 3;
            window.balance += winAmount;
            window.updateGlobalBalance();
            this.messageSpan.textContent = `You cleared the board! Won $${winAmount}!`;
            this.newBtn.disabled = false;
        }
    }
    reveal(r, c) {
        if (r < 0 || r >= 5 || c < 0 || c >= 5) return;
        if (this.revealed[r][c]) return;
        if (this.board[r][c] === -1) return;
        this.revealed[r][c] = true;
        if (this.board[r][c] === 0) {
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    this.reveal(r + dr, c + dc);
                }
            }
        }
    }
}