// games/RushHourGame.js
import { BaseGame } from './BaseGame.js';

export class RushHourGame extends BaseGame {
  mount(container) {
    super.mount(container);
    container.innerHTML = this.render();
    this.cacheElements();
    this.attachEvents();
    this.newGame();
  }
  render() {
    return `
            <h2>Rush Hour</h2>
            <div style="display: grid; grid-template-columns: repeat(6, 60px); gap: 2px; justify-content: center; margin:20px;" id="rush-board"></div>
            <div class="game-controls">
                <button class="btn btn-primary" id="rush-reset">New Puzzle</button>
                <span id="rush-message"></span>
            </div>
        `;
  }
  cacheElements() {
    this.boardDiv = this.container.querySelector('#rush-board');
    this.messageSpan = this.container.querySelector('#rush-message');
    this.resetBtn = this.container.querySelector('#rush-reset');
  }
  attachEvents() {
    this.resetBtn.addEventListener('click', () => this.newGame());
  }
  newGame() {
    this.board = [
      [null, null, null, 'T1', null, null],
      [null, null, null, 'T2', null, null],
      [null, null, 'R1', 'R2', null, null],
      [null, null, 'C1', 'C2', null, null],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null]
    ];
    this.selected = null;
    this.renderBoard();
    this.messageSpan.textContent = 'Move red car (R) to the exit (right edge).';
  }
  renderBoard() {
    this.boardDiv.innerHTML = '';
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 6; c++) {
        const cell = document.createElement('div');
        cell.style.width = '60px';
        cell.style.height = '60px';
        cell.style.border = '1px solid #aaa';
        cell.style.backgroundColor = '#1e293b';
        cell.style.display = 'flex';
        cell.style.alignItems = 'center';
        cell.style.justifyContent = 'center';
        cell.style.fontSize = '1.2rem';
        cell.style.color = 'white';
        cell.style.cursor = 'pointer';
        const val = this.board[r][c];
        if (val) {
          cell.textContent = val[0];
          if (val[0] === 'R') cell.style.backgroundColor = '#f44336';
          else if (val[0] === 'T') cell.style.backgroundColor = '#2196f3';
          else if (val[0] === 'C') cell.style.backgroundColor = '#4caf50';
        }
        cell.dataset.r = r;
        cell.dataset.c = c;
        cell.addEventListener('click', (e) => this.cellClick(e));
        if (this.selected && this.selected.r === r && this.selected.c === c) {
          cell.style.outline = '3px solid yellow';
        }
        this.boardDiv.appendChild(cell);
      }
    }
    if (this.board[2][5] && this.board[2][5][0] === 'R') {
      this.messageSpan.textContent = 'You solved it!';
    }
  }
  cellClick(e) {
    const r = parseInt(e.target.dataset.r);
    const c = parseInt(e.target.dataset.c);
    const piece = this.board[r][c];
    if (this.selected === null) {
      if (piece) {
        this.selected = { r, c };
        this.renderBoard();
      }
    } else {
      const sr = this.selected.r;
      const sc = this.selected.c;
      const spiece = this.board[sr][sc];
      if (!spiece) return;
      const dir = this.getDirection(spiece, sr, sc);
      if (dir === 'horizontal') {
        if (r === sr && Math.abs(c - sc) === 1) {
          if (!this.board[sr][c]) {
            this.moveVehicle(spiece, sr, sc, c - sc);
            this.selected = null;
          }
        }
      } else if (dir === 'vertical') {
        if (c === sc && Math.abs(r - sr) === 1) {
          if (!this.board[r][sc]) {
            this.moveVehicle(spiece, sr, sc, r - sr);
            this.selected = null;
          }
        }
      } else {
        this.selected = null;
      }
      this.renderBoard();
    }
  }
  getDirection(piece, r, c) {
    if (c < 5 && this.board[r][c + 1] === piece) return 'horizontal';
    if (c > 0 && this.board[r][c - 1] === piece) return 'horizontal';
    if (r < 5 && this.board[r + 1][c] === piece) return 'vertical';
    if (r > 0 && this.board[r - 1][c] === piece) return 'vertical';
    return 'unknown';
  }
  moveVehicle(piece, startR, startC, dr) {
    const cells = [];
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 6; c++) {
        if (this.board[r][c] === piece) cells.push({ r, c });
      }
    }
    if (cells.length === 0) return;
    const horizontal = cells.every(cell => cell.r === cells[0].r);
    const vertical = cells.every(cell => cell.c === cells[0].c);
    if (horizontal) {
      const newCols = cells.map(cell => cell.c + dr);
      if (newCols.some(c => c < 0 || c >= 6)) return;
      if (newCols.some((c, i) => this.board[cells[i].r][c] && this.board[cells[i].r][c] !== piece)) return;
      cells.forEach((cell, i) => {
        this.board[cell.r][cell.c] = null;
      });
      cells.forEach((cell, i) => {
        this.board[cell.r][cell.c + dr] = piece;
      });
    } else if (vertical) {
      const newRows = cells.map(cell => cell.r + dr);
      if (newRows.some(r => r < 0 || r >= 6)) return;
      if (newRows.some((r, i) => this.board[r][cells[i].c] && this.board[r][cells[i].c] !== piece)) return;
      cells.forEach((cell, i) => {
        this.board[cell.r][cell.c] = null;
      });
      cells.forEach((cell, i) => {
        this.board[cell.r + dr][cell.c] = piece;
      });
    }
  }
}