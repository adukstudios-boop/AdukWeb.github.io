// games/Connect4Game.js
import { BaseGame } from './BaseGame.js';

export class Connect4Game extends BaseGame {
  mount(container) {
    super.mount(container);
    container.innerHTML = this.render();
    this.cacheElements();
    this.attachEvents();
    this.board = Array(6).fill().map(() => Array(7).fill(''));
    this.turn = '🔴';
    this.gameOver = false;
  }
  render() {
    return `
            <h2>Connect Four</h2>
            <div style="display: flex; gap:5px; justify-content:center; margin:20px;" id="c4-controls">
                ${[0,1,2,3,4,5,6].map(col => `<button class="btn btn-secondary" data-col="${col}">↓</button>`).join('')}
            </div>
            <div style="display: grid; grid-template-columns: repeat(7,50px); gap:2px; justify-content:center;" id="c4-board"></div>
            <div>Turn: <span id="c4-turn">🔴</span></div>
            <div class="balance-box">Balance: $<span id="c4-balance">${window.balance}</span></div>
            <div class="game-controls">
                <button class="btn btn-primary" id="c4-reset">New Game</button>
                <span id="c4-message"></span>
            </div>
        `;
  }
  cacheElements() {
    this.controlsDiv = this.container.querySelector('#c4-controls');
    this.boardDiv = this.container.querySelector('#c4-board');
    this.turnSpan = this.container.querySelector('#c4-turn');
    this.balanceSpan = this.container.querySelector('#c4-balance');
    this.messageSpan = this.container.querySelector('#c4-message');
    this.resetBtn = this.container.querySelector('#c4-reset');
  }
  attachEvents() {
    this.resetBtn.addEventListener('click', () => this.resetGame());
    this.controlsDiv.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', (e) => this.dropPiece(parseInt(e.target.dataset.col)));
    });
  }
  resetGame() {
    this.board = Array(6).fill().map(() => Array(7).fill(''));
    this.turn = '🔴';
    this.gameOver = false;
    this.renderBoard();
    this.messageSpan.textContent = '';
  }
  renderBoard() {
    this.boardDiv.innerHTML = '';
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 7; c++) {
        const cell = document.createElement('div');
        cell.textContent = this.board[r][c];
        cell.style.cssText = `
                    width:50px; height:50px; background:var(--bg-tertiary);
                    border:1px solid var(--text-secondary); display:flex; align-items:center;
                    justify-content:center; font-size:1.5rem;
                `;
        this.boardDiv.appendChild(cell);
      }
    }
    this.turnSpan.textContent = this.turn;
  }
  dropPiece(col) {
    if (this.gameOver) return;
    for (let r = 5; r >= 0; r--) {
      if (this.board[r][col] === '') {
        this.board[r][col] = this.turn;
        break;
      }
    }
    if (this.checkWin()) {
      this.messageSpan.textContent = `${this.turn} wins!`;
      this.gameOver = true;
    } else if (this.board.every(row => row.every(cell => cell !== ''))) {
      this.messageSpan.textContent = 'Tie!';
      this.gameOver = true;
    } else {
      this.turn = this.turn === '🔴' ? '🟡' : '🔴';
    }
    this.renderBoard();
  }
  checkWin() {
    const board = this.board;
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 4; c++) {
        if (board[r][c] && board[r][c] === board[r][c + 1] && board[r][c] === board[r][c + 2] && board[r][c] === board[r][c + 3]) return true;
      }
    }
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 7; c++) {
        if (board[r][c] && board[r][c] === board[r + 1][c] && board[r][c] === board[r + 2][c] && board[r][c] === board[r + 3][c]) return true;
      }
    }
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 4; c++) {
        if (board[r][c] && board[r][c] === board[r + 1][c + 1] && board[r][c] === board[r + 2][c + 2] && board[r][c] === board[r + 3][c + 3]) return true;
      }
    }
    for (let r = 0; r < 3; r++) {
      for (let c = 3; c < 7; c++) {
        if (board[r][c] && board[r][c] === board[r + 1][c - 1] && board[r][c] === board[r + 2][c - 2] && board[r][c] === board[r + 3][c - 3]) return true;
      }
    }
    return false;
  }
}