// games/TicTacToeGame.js
import { BaseGame } from './BaseGame.js';

export class TicTacToeGame extends BaseGame {
    mount(container) {
        super.mount(container);
        container.innerHTML = this.render();
        this.cacheElements();
        this.attachEvents();
        this.board = ['','','','','','','','',''];
        this.turn = 'X';
        this.gameOver = false;
    }
    render() {
        return `
            <h2>Tic‑Tac‑Toe</h2>
            <div style="display: grid; grid-template-columns: repeat(3,80px); gap:5px; justify-content:center; margin:20px;" id="ttt-board"></div>
            <div>Turn: <span id="ttt-turn">X</span></div>
            <div class="balance-box">Balance: $<span id="ttt-balance">${window.balance}</span></div>
            <div class="game-controls">
                <button class="btn btn-primary" id="ttt-reset">New Game</button>
                <span id="ttt-message"></span>
            </div>
        `;
    }
    cacheElements() {
        this.boardDiv = this.container.querySelector('#ttt-board');
        this.turnSpan = this.container.querySelector('#ttt-turn');
        this.balanceSpan = this.container.querySelector('#ttt-balance');
        this.messageSpan = this.container.querySelector('#ttt-message');
        this.resetBtn = this.container.querySelector('#ttt-reset');
    }
    attachEvents() {
        this.resetBtn.addEventListener('click', () => this.resetGame());
    }
    resetGame() {
        this.board = ['','','','','','','','',''];
        this.turn = 'X';
        this.gameOver = false;
        this.renderBoard();
        this.messageSpan.textContent = '';
    }
    renderBoard() {
        this.boardDiv.innerHTML = '';
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('button');
            cell.textContent = this.board[i];
            cell.style.cssText = `
                width:80px; height:80px; font-size:2rem; background:var(--bg-tertiary);
                border:1px solid var(--text-secondary); cursor:pointer; color:var(--text-primary);
            `;
            cell.addEventListener('click', () => this.makeMove(i));
            this.boardDiv.appendChild(cell);
        }
        this.turnSpan.textContent = this.turn;
    }
    makeMove(index) {
        if (this.gameOver || this.board[index] !== '') return;
        this.board[index] = this.turn;
        if (this.checkWin()) {
            this.messageSpan.textContent = `${this.turn} wins!`;
            this.gameOver = true;
        } else if (this.board.every(cell => cell !== '')) {
            this.messageSpan.textContent = 'Tie!';
            this.gameOver = true;
        } else {
            this.turn = this.turn === 'X' ? 'O' : 'X';
        }
        this.renderBoard();
    }
    checkWin() {
        const lines = [
            [0,1,2],[3,4,5],[6,7,8],
            [0,3,6],[1,4,7],[2,5,8],
            [0,4,8],[2,4,6]
        ];
        for (let line of lines) {
            if (this.board[line[0]] && this.board[line[0]] === this.board[line[1]] && this.board[line[1]] === this.board[line[2]]) {
                return true;
            }
        }
        return false;
    }
}