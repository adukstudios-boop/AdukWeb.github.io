// games/OthelloGame.js
import { BaseGame } from './BaseGame.js';

export class OthelloGame extends BaseGame {
    mount(container) {
        super.mount(container);
        container.innerHTML = this.render();
        this.cacheElements();
        this.attachEvents();
        this.newGame();
    }
    render() {
        return `
            <h2>Othello (Reversi)</h2>
            <div style="display: grid; grid-template-columns: repeat(8, 45px); gap: 1px; justify-content: center; margin:20px;" id="othello-board"></div>
            <div>Turn: <span id="othello-turn">Black</span></div>
            <div>Score: Black <span id="othello-black">2</span> - <span id="othello-white">2</span> White</div>
            <div class="balance-box">Balance: $<span id="othello-balance">${window.balance}</span></div>
            <div class="game-controls">
                <input type="number" id="othello-bet" min="1" value="10">
                <button class="btn btn-primary" id="othello-new">New Game</button>
                <span id="othello-message"></span>
            </div>
        `;
    }
    cacheElements() {
        this.boardDiv = this.container.querySelector('#othello-board');
        this.turnSpan = this.container.querySelector('#othello-turn');
        this.blackSpan = this.container.querySelector('#othello-black');
        this.whiteSpan = this.container.querySelector('#othello-white');
        this.balanceSpan = this.container.querySelector('#othello-balance');
        this.betInput = this.container.querySelector('#othello-bet');
        this.messageSpan = this.container.querySelector('#othello-message');
        this.newBtn = this.container.querySelector('#othello-new');
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
        this.board = Array(8).fill().map(() => Array(8).fill(null));
        this.board[3][3] = 'white';
        this.board[3][4] = 'black';
        this.board[4][3] = 'black';
        this.board[4][4] = 'white';
        this.currentPlayer = 'black';
        this.gameActive = true;
        this.renderBoard();
        this.updateScores();
    }
    renderBoard() {
        this.boardDiv.innerHTML = '';
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const cell = document.createElement('div');
                cell.style.width = '45px';
                cell.style.height = '45px';
                cell.style.backgroundColor = '#2e7d32';
                cell.style.border = '1px solid #000';
                cell.style.display = 'flex';
                cell.style.alignItems = 'center';
                cell.style.justifyContent = 'center';
                cell.style.fontSize = '1.5rem';
                if (this.board[r][c] === 'black') cell.textContent = '⚫';
                else if (this.board[r][c] === 'white') cell.textContent = '⚪';
                cell.dataset.row = r;
                cell.dataset.col = c;
                cell.addEventListener('click', () => this.makeMove(r, c));
                this.boardDiv.appendChild(cell);
            }
        }
        this.turnSpan.textContent = this.currentPlayer === 'black' ? 'Black' : 'White';
    }
    makeMove(row, col) {
        if (!this.gameActive) return;
        if (this.board[row][col] !== null) return;
        const directions = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
        let valid = false;
        let toFlip = [];
        for (let [dr, dc] of directions) {
            let r = row + dr, c = col + dc;
            let flipped = [];
            while (r >= 0 && r < 8 && c >= 0 && c < 8 && this.board[r][c] && this.board[r][c] !== this.currentPlayer) {
                flipped.push([r,c]);
                r += dr;
                c += dc;
            }
            if (r >= 0 && r < 8 && c >= 0 && c < 8 && this.board[r][c] === this.currentPlayer && flipped.length > 0) {
                valid = true;
                toFlip.push(...flipped);
            }
        }
        if (!valid) return;
        this.board[row][col] = this.currentPlayer;
        for (let [r,c] of toFlip) this.board[r][c] = this.currentPlayer;
        // Switch player
        this.currentPlayer = this.currentPlayer === 'black' ? 'white' : 'black';
        // Check if current player has any moves; if not, switch back
        if (!this.hasValidMove(this.currentPlayer)) {
            if (this.hasValidMove(this.currentPlayer === 'black' ? 'white' : 'black')) {
                this.currentPlayer = this.currentPlayer === 'black' ? 'white' : 'black';
                this.messageSpan.textContent = `${this.currentPlayer === 'black' ? 'Black' : 'White'} has no moves. Turn passed.`;
            } else {
                this.gameActive = false;
                const blackCount = this.board.flat().filter(c => c === 'black').length;
                const whiteCount = this.board.flat().filter(c => c === 'white').length;
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
                this.balanceSpan.textContent = window.balance;
            }
        }
        this.renderBoard();
        this.updateScores();
    }
    hasValidMove(player) {
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                if (this.board[r][c] !== null) continue;
                const directions = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
                for (let [dr, dc] of directions) {
                    let rr = r + dr, cc = c + dc;
                    let foundOpponent = false;
                    while (rr >= 0 && rr < 8 && cc >= 0 && cc < 8 && this.board[rr][cc] && this.board[rr][cc] !== player) {
                        foundOpponent = true;
                        rr += dr;
                        cc += dc;
                    }
                    if (foundOpponent && rr >= 0 && rr < 8 && cc >= 0 && cc < 8 && this.board[rr][cc] === player) return true;
                }
            }
        }
        return false;
    }
    updateScores() {
        const blackCount = this.board.flat().filter(c => c === 'black').length;
        const whiteCount = this.board.flat().filter(c => c === 'white').length;
        this.blackSpan.textContent = blackCount;
        this.whiteSpan.textContent = whiteCount;
    }
}