// games/CheckersGame.js
import { BaseGame } from './BaseGame.js';

export class CheckersGame extends BaseGame {
  mount(container) {
    super.mount(container);
    container.innerHTML = this.render();
    this.cacheElements();
    this.attachEvents();
    this.newGame();
  }
  render() {
    return `
            <h2>Checkers (Simplified)</h2>
            <div style="display: flex; justify-content: space-between;">
                <span>Turn: <span id="checkers-turn">Red</span></span>
                <span id="checkers-message"></span>
            </div>
            <div style="display: grid; grid-template-columns: repeat(8, 50px); gap: 1px; justify-content: center; margin:20px;" id="checkers-board"></div>
            <div class="game-controls">
                <button class="btn btn-primary" id="checkers-reset">New Game</button>
            </div>
        `;
  }
  cacheElements() {
    this.boardDiv = this.container.querySelector('#checkers-board');
    this.turnSpan = this.container.querySelector('#checkers-turn');
    this.messageSpan = this.container.querySelector('#checkers-message');
    this.resetBtn = this.container.querySelector('#checkers-reset');
  }
  attachEvents() {
    this.resetBtn.addEventListener('click', () => this.newGame());
  }
  newGame() {
    this.board = Array(8).fill().map(() => Array(8).fill(''));
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 8; c++) {
        if ((r + c) % 2 === 1) this.board[r][c] = 'r';
      }
    }
    for (let r = 5; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if ((r + c) % 2 === 1) this.board[r][c] = 'b';
      }
    }
    this.turn = 'red';
    this.selected = null;
    this.renderBoard();
    this.messageSpan.textContent = '';
  }
  renderBoard() {
    this.boardDiv.innerHTML = '';
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = this.board[r][c];
        const cell = document.createElement('div');
        cell.style.width = '50px';
        cell.style.height = '50px';
        cell.style.backgroundColor = (r + c) % 2 === 0 ? '#f0d9b5' : '#b58863';
        cell.style.display = 'flex';
        cell.style.alignItems = 'center';
        cell.style.justifyContent = 'center';
        cell.style.fontSize = '2rem';
        cell.style.cursor = 'pointer';
        cell.textContent = piece === 'r' ? '●' : piece === 'b' ? '○' : '';
        cell.dataset.row = r;
        cell.dataset.col = c;
        cell.addEventListener('click', (e) => this.cellClick(e));
        if (this.selected && this.selected.row === r && this.selected.col === c) {
          cell.style.outline = '3px solid yellow';
        }
        this.boardDiv.appendChild(cell);
      }
    }
    this.turnSpan.textContent = this.turn === 'red' ? 'Red' : 'Black';
  }
  cellClick(e) {
    const row = parseInt(e.target.dataset.row);
    const col = parseInt(e.target.dataset.col);
    const piece = this.board[row][col];
    const isRedTurn = this.turn === 'red';
    const isRedPiece = piece === 'r';
    
    if (this.selected === null) {
      if (piece && ((isRedTurn && isRedPiece) || (!isRedTurn && piece === 'b'))) {
        this.selected = { row, col };
        this.renderBoard();
      }
    } else {
      const fromRow = this.selected.row;
      const fromCol = this.selected.col;
      const movingPiece = this.board[fromRow][fromCol];
      const rowDiff = row - fromRow;
      const colDiff = Math.abs(col - fromCol);
      const validDir = (isRedTurn && rowDiff === 1) || (!isRedTurn && rowDiff === -1);
      if (validDir && colDiff === 1 && this.board[row][col] === '') {
        this.board[row][col] = movingPiece;
        this.board[fromRow][fromCol] = '';
        this.selected = null;
        this.turn = this.turn === 'red' ? 'black' : 'red';
      } else {
        this.selected = null;
      }
      this.renderBoard();
    }
  }
}