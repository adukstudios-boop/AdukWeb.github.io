// games/GoGame.js
import { BaseGame } from './BaseGame.js';

export class GoGame extends BaseGame {
    mount(container) {
        super.mount(container);
        container.innerHTML = this.render();
        this.cacheElements();
        this.attachEvents();
        this.newGame();
    }
    render() {
        return `
            <h2>Go (Simplified)</h2>
            <div style="display: grid; grid-template-columns: repeat(9, 40px); gap: 1px; justify-content: center; margin:20px;" id="go-board"></div>
            <div>Turn: <span id="go-turn">Black</span></div>
            <div class="balance-box">Balance: $<span id="go-balance">${window.balance}</span></div>
            <div class="game-controls">
                <input type="number" id="go-bet" min="1" value="10">
                <button class="btn btn-primary" id="go-new">New Game</button>
                <span id="go-message"></span>
            </div>
        `;
    }
    cacheElements() {
        this.boardDiv = this.container.querySelector('#go-board');
        this.turnSpan = this.container.querySelector('#go-turn');
        this.balanceSpan = this.container.querySelector('#go-balance');
        this.betInput = this.container.querySelector('#go-bet');
        this.messageSpan = this.container.querySelector('#go-message');
        this.newBtn = this.container.querySelector('#go-new');
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
        this.board = Array(9).fill().map(() => Array(9).fill(null));
        this.currentPlayer = 'black';
        this.gameActive = true;
        this.renderBoard();
    }
    renderBoard() {
        this.boardDiv.innerHTML = '';
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                const cell = document.createElement('div');
                cell.style.width = '40px';
                cell.style.height = '40px';
                cell.style.backgroundColor = '#DEB887';
                cell.style.border = '1px solid #000';
                cell.style.display = 'flex';
                cell.style.alignItems = 'center';
                cell.style.justifyContent = 'center';
                cell.style.fontSize = '1.2rem';
                if (this.board[r][c] === 'black') cell.textContent = '⚫';
                else if (this.board[r][c] === 'white') cell.textContent = '⚪';
                cell.dataset.row = r;
                cell.dataset.col = c;
                cell.addEventListener('click', () => this.placeStone(r,c));
                this.boardDiv.appendChild(cell);
            }
        }
        this.turnSpan.textContent = this.currentPlayer === 'black' ? 'Black' : 'White';
    }
    placeStone(row, col) {
        if (!this.gameActive) return;
        if (this.board[row][col] !== null) return;
        this.board[row][col] = this.currentPlayer;
        // Simple capture: check adjacent groups (very simplified: just remove stones with no liberties)
        let captured = false;
        const groups = this.getGroups(row, col);
        for (let group of groups) {
            if (this.getLiberties(group).length === 0) {
                for (let [r,c] of group) this.board[r][c] = null;
                captured = true;
            }
        }
        if (captured) {
            // Switch turn after capture
        }
        // Switch player
        this.currentPlayer = this.currentPlayer === 'black' ? 'white' : 'black';
        this.renderBoard();

        // Simplified scoring: after 20 moves, count territory (demo)
        const totalStones = this.board.flat().filter(s => s !== null).length;
        if (totalStones >= 81) {
            const blackCount = this.board.flat().filter(s => s === 'black').length;
            const whiteCount = this.board.flat().filter(s => s === 'white').length;
            let win = false;
            if (blackCount > whiteCount) win = true;
            if (win) {
                const winAmount = this.bet * 2;
                window.balance += winAmount;
                window.updateGlobalBalance();
                this.messageSpan.textContent = `Game over! Black wins! +$${winAmount}`;
            } else if (blackCount < whiteCount) {
                this.messageSpan.textContent = `Game over! White wins.`;
            } else {
                window.balance += this.bet;
                window.updateGlobalBalance();
                this.messageSpan.textContent = `Game over! Tie. Bet returned.`;
            }
            this.gameActive = false;
            this.balanceSpan.textContent = window.balance;
        }
    }
    getGroups(row, col) {
        const visited = new Set();
        const stack = [[row, col]];
        const group = [];
        const color = this.board[row][col];
        while (stack.length) {
            const [r,c] = stack.pop();
            const key = `${r},${c}`;
            if (visited.has(key)) continue;
            visited.add(key);
            group.push([r,c]);
            for (let [dr,dc] of [[-1,0],[1,0],[0,-1],[0,1]]) {
                const nr = r+dr, nc = c+dc;
                if (nr>=0 && nr<9 && nc>=0 && nc<9 && this.board[nr][nc] === color && !visited.has(`${nr},${nc}`)) {
                    stack.push([nr,nc]);
                }
            }
        }
        return [group];
    }
    getLiberties(group) {
        const liberties = new Set();
        for (let [r,c] of group) {
            for (let [dr,dc] of [[-1,0],[1,0],[0,-1],[0,1]]) {
                const nr = r+dr, nc = c+dc;
                if (nr>=0 && nr<9 && nc>=0 && nc<9 && this.board[nr][nc] === null) {
                    liberties.add(`${nr},${nc}`);
                }
            }
        }
        return Array.from(liberties);
    }
}