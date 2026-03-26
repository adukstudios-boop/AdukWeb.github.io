// games/2048Game.js
import { BaseGame } from './BaseGame.js';

export class Two048Game extends BaseGame {
  mount(container) {
    super.mount(container);
    container.innerHTML = this.render();
    this.cacheElements();
    this.attachEvents();
    this.newGame();
  }
  render() {
    return `
            <h2>2048</h2>
            <div style="display: grid; grid-template-columns: repeat(4, 80px); gap: 5px; justify-content: center; margin:20px;" id="game-2048-board"></div>
            <div>Score: <span id="game-2048-score">0</span></div>
            <div class="balance-box">Balance: $<span id="game-2048-balance">${window.balance}</span></div>
            <div class="game-controls">
                <input type="number" id="game-2048-bet" min="1" value="10">
                <button class="btn btn-primary" id="game-2048-new">New Game</button>
                <span id="game-2048-message"></span>
            </div>
        `;
  }
  cacheElements() {
    this.boardDiv = this.container.querySelector('#game-2048-board');
    this.scoreSpan = this.container.querySelector('#game-2048-score');
    this.balanceSpan = this.container.querySelector('#game-2048-balance');
    this.betInput = this.container.querySelector('#game-2048-bet');
    this.messageSpan = this.container.querySelector('#game-2048-message');
    this.newBtn = this.container.querySelector('#game-2048-new');
  }
  attachEvents() {
    this.newBtn.addEventListener('click', () => this.newGame());
    window.addEventListener('keydown', (e) => this.handleKey(e));
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
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ];
    this.addRandomTile();
    this.addRandomTile();
    this.updateScore();
    this.renderBoard();
    this.messageSpan.textContent = '';
  }
  addRandomTile() {
    const empty = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 0) empty.push([i, j]);
      }
    }
    if (empty.length === 0) return;
    const [r, c] = empty[Math.floor(Math.random() * empty.length)];
    this.board[r][c] = Math.random() < 0.9 ? 2 : 4;
  }
  renderBoard() {
    this.boardDiv.innerHTML = '';
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const tile = document.createElement('div');
        const val = this.board[i][j];
        tile.textContent = val === 0 ? '' : val;
        tile.style.width = '80px';
        tile.style.height = '80px';
        tile.style.backgroundColor = this.getColor(val);
        tile.style.display = 'flex';
        tile.style.alignItems = 'center';
        tile.style.justifyContent = 'center';
        tile.style.fontSize = '1.5rem';
        tile.style.fontWeight = 'bold';
        tile.style.borderRadius = '8px';
        tile.style.border = '1px solid #aaa';
        this.boardDiv.appendChild(tile);
      }
    }
  }
  getColor(val) {
    const colors = {
      0: '#cdc1b4',
      2: '#eee4da',
      4: '#ede0c8',
      8: '#f2b179',
      16: '#f59563',
      32: '#f67c5f',
      64: '#f65e3b',
      128: '#edcf72',
      256: '#edcc61',
      512: '#edc850',
      1024: '#edc53f',
      2048: '#edc22e'
    };
    return colors[val] || '#edc22e';
  }
  handleKey(e) {
    if (e.key === 'ArrowUp') this.move('up');
    else if (e.key === 'ArrowDown') this.move('down');
    else if (e.key === 'ArrowLeft') this.move('left');
    else if (e.key === 'ArrowRight') this.move('right');
    else return;
    e.preventDefault();
  }
  move(direction) {
    let oldBoard = JSON.parse(JSON.stringify(this.board));
    if (direction === 'left') this.moveLeft();
    else if (direction === 'right') this.moveRight();
    else if (direction === 'up') this.moveUp();
    else if (direction === 'down') this.moveDown();
    if (JSON.stringify(oldBoard) !== JSON.stringify(this.board)) {
      this.addRandomTile();
      this.renderBoard();
      this.updateScore();
      if (this.isGameOver()) {
        this.messageSpan.textContent = 'Game Over!';
      }
      if (this.hasWon()) {
        const winAmount = this.bet * 5;
        window.balance += winAmount;
        window.updateGlobalBalance();
        this.messageSpan.textContent = `You reached 2048! Won $${winAmount}!`;
      }
    }
  }
  moveLeft() {
    for (let i = 0; i < 4; i++) {
      let row = this.board[i].filter(v => v !== 0);
      for (let j = 0; j < row.length - 1; j++) {
        if (row[j] === row[j + 1]) {
          row[j] *= 2;
          this.score += row[j];
          row.splice(j + 1, 1);
        }
      }
      while (row.length < 4) row.push(0);
      this.board[i] = row;
    }
  }
  moveRight() {
    for (let i = 0; i < 4; i++) {
      let row = this.board[i].filter(v => v !== 0);
      for (let j = row.length - 1; j > 0; j--) {
        if (row[j] === row[j - 1]) {
          row[j] *= 2;
          this.score += row[j];
          row.splice(j - 1, 1);
          j--;
        }
      }
      while (row.length < 4) row.unshift(0);
      this.board[i] = row;
    }
  }
  moveUp() {
    for (let j = 0; j < 4; j++) {
      let col = [this.board[0][j], this.board[1][j], this.board[2][j], this.board[3][j]].filter(v => v !== 0);
      for (let i = 0; i < col.length - 1; i++) {
        if (col[i] === col[i + 1]) {
          col[i] *= 2;
          this.score += col[i];
          col.splice(i + 1, 1);
        }
      }
      while (col.length < 4) col.push(0);
      for (let i = 0; i < 4; i++) this.board[i][j] = col[i];
    }
  }
  moveDown() {
    for (let j = 0; j < 4; j++) {
      let col = [this.board[0][j], this.board[1][j], this.board[2][j], this.board[3][j]].filter(v => v !== 0);
      for (let i = col.length - 1; i > 0; i--) {
        if (col[i] === col[i - 1]) {
          col[i] *= 2;
          this.score += col[i];
          col.splice(i - 1, 1);
          i--;
        }
      }
      while (col.length < 4) col.unshift(0);
      for (let i = 0; i < 4; i++) this.board[i][j] = col[i];
    }
  }
  updateScore() {
    this.scoreSpan.textContent = this.score;
  }
  isGameOver() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 0) return false;
        if (j < 3 && this.board[i][j] === this.board[i][j + 1]) return false;
        if (i < 3 && this.board[i][j] === this.board[i + 1][j]) return false;
      }
    }
    return true;
  }
  hasWon() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] >= 2048) return true;
      }
    }
    return false;
  }
}