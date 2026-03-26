// games/BattleshipGame.js
import { BaseGame } from './BaseGame.js';

export class BattleshipGame extends BaseGame {
  mount(container) {
    super.mount(container);
    container.innerHTML = this.render();
    this.cacheElements();
    this.attachEvents();
    this.newGame();
  }
  render() {
    return `
            <h2>Battleship</h2>
            <div style="display: flex; gap: 20px; justify-content: center;">
                <div>
                    <div>Your Board</div>
                    <div style="display: grid; grid-template-columns: repeat(10, 30px); gap: 1px;" id="battleship-player-board"></div>
                </div>
                <div>
                    <div>Enemy Board</div>
                    <div style="display: grid; grid-template-columns: repeat(10, 30px); gap: 1px;" id="battleship-enemy-board"></div>
                </div>
            </div>
            <div class="balance-box">Balance: $<span id="battleship-balance">${window.balance}</span></div>
            <div class="game-controls">
                <input type="number" id="battleship-bet" min="1" value="10">
                <button class="btn btn-primary" id="battleship-new">New Game</button>
                <span id="battleship-message"></span>
            </div>
        `;
  }
  cacheElements() {
    this.playerBoardDiv = this.container.querySelector('#battleship-player-board');
    this.enemyBoardDiv = this.container.querySelector('#battleship-enemy-board');
    this.balanceSpan = this.container.querySelector('#battleship-balance');
    this.betInput = this.container.querySelector('#battleship-bet');
    this.messageSpan = this.container.querySelector('#battleship-message');
    this.newBtn = this.container.querySelector('#battleship-new');
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
    this.playerShips = this.placeShips();
    this.enemyShips = this.placeShips();
    this.playerShots = Array(10).fill().map(() => Array(10).fill(false));
    this.enemyShots = Array(10).fill().map(() => Array(10).fill(false));
    this.playerHits = Array(10).fill().map(() => Array(10).fill(false));
    this.enemyHits = Array(10).fill().map(() => Array(10).fill(false));
    this.gameActive = true;
    this.turn = 'player';
    this.renderBoards();
    this.messageSpan.textContent = 'Click on enemy board to fire!';
  }
  placeShips() {
    const ships = [5, 4, 3, 3, 2]; // lengths
    const board = Array(10).fill().map(() => Array(10).fill(false));
    for (let len of ships) {
      let placed = false;
      while (!placed) {
        const horizontal = Math.random() < 0.5;
        const row = Math.floor(Math.random() * 10);
        const col = Math.floor(Math.random() * 10);
        if (horizontal) {
          if (col + len <= 10) {
            let valid = true;
            for (let i = 0; i < len; i++) {
              if (board[row][col + i]) valid = false;
            }
            if (valid) {
              for (let i = 0; i < len; i++) board[row][col + i] = true;
              placed = true;
            }
          }
        } else {
          if (row + len <= 10) {
            let valid = true;
            for (let i = 0; i < len; i++) {
              if (board[row + i][col]) valid = false;
            }
            if (valid) {
              for (let i = 0; i < len; i++) board[row + i][col] = true;
              placed = true;
            }
          }
        }
      }
    }
    return board;
  }
  renderBoards() {
    this.playerBoardDiv.innerHTML = '';
    for (let r = 0; r < 10; r++) {
      for (let c = 0; c < 10; c++) {
        const cell = document.createElement('div');
        cell.style.width = '30px';
        cell.style.height = '30px';
        cell.style.border = '1px solid #aaa';
        cell.style.backgroundColor = this.playerShips[r][c] ? '#4caf50' : '#1e293b';
        this.playerBoardDiv.appendChild(cell);
      }
    }
    this.enemyBoardDiv.innerHTML = '';
    for (let r = 0; r < 10; r++) {
      for (let c = 0; c < 10; c++) {
        const cell = document.createElement('div');
        cell.style.width = '30px';
        cell.style.height = '30px';
        cell.style.border = '1px solid #aaa';
        cell.style.cursor = 'pointer';
        if (this.enemyShots[r][c]) {
          cell.style.backgroundColor = this.enemyHits[r][c] ? '#f00' : '#555';
        } else {
          cell.style.backgroundColor = '#1e293b';
        }
        cell.dataset.row = r;
        cell.dataset.col = c;
        cell.addEventListener('click', () => this.playerFire(r, c));
        this.enemyBoardDiv.appendChild(cell);
      }
    }
  }
  playerFire(row, col) {
    if (!this.gameActive || this.turn !== 'player') return;
    if (this.enemyShots[row][col]) return;
    this.enemyShots[row][col] = true;
    if (this.enemyShips[row][col]) {
      this.enemyHits[row][col] = true;
      this.messageSpan.textContent = 'Hit!';
      if (this.checkWin(this.enemyHits)) {
        const winAmount = this.bet * 2;
        window.balance += winAmount;
        window.updateGlobalBalance();
        this.messageSpan.textContent = `You sank all enemy ships! You win $${winAmount}!`;
        this.gameActive = false;
        this.balanceSpan.textContent = window.balance;
        return;
      }
    } else {
      this.messageSpan.textContent = 'Miss!';
    }
    this.renderBoards();
    this.turn = 'enemy';
    setTimeout(() => this.enemyFire(), 500);
  }
  enemyFire() {
    if (!this.gameActive) return;
    // Simple AI: random untargeted cell
    let row, col;
    do {
      row = Math.floor(Math.random() * 10);
      col = Math.floor(Math.random() * 10);
    } while (this.playerShots[row][col]);
    this.playerShots[row][col] = true;
    if (this.playerShips[row][col]) {
      this.playerHits[row][col] = true;
      this.messageSpan.textContent = 'Enemy hit your ship!';
      if (this.checkWin(this.playerHits)) {
        this.messageSpan.textContent = 'Enemy sank all your ships. You lose.';
        this.gameActive = false;
        return;
      }
    } else {
      this.messageSpan.textContent = 'Enemy missed!';
    }
    this.renderBoards();
    this.turn = 'player';
    this.messageSpan.textContent = 'Your turn. Click enemy board.';
  }
  checkWin(hits) {
    for (let r = 0; r < 10; r++) {
      for (let c = 0; c < 10; c++) {
        if (this.enemyShips[r][c] && !hits[r][c]) return false;
      }
    }
    return true;
  }
}