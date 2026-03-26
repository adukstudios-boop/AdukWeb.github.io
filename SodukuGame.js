// games/SudokuGame.js
import { BaseGame } from './BaseGame.js';

export class SudokuGame extends BaseGame {
  mount(container) {
    super.mount(container);
    container.innerHTML = this.render();
    this.cacheElements();
    this.attachEvents();
    this.newGame();
  }
  render() {
    return `
            <h2>Sudoku</h2>
            <div style="display: grid; grid-template-columns: repeat(9, 40px); gap: 1px; justify-content: center; margin:20px;" id="sudoku-board"></div>
            <div class="balance-box">Balance: $<span id="sudoku-balance">${window.balance}</span></div>
            <div class="game-controls">
                <input type="number" id="sudoku-bet" min="1" value="10">
                <button class="btn btn-primary" id="sudoku-check">Check Solution</button>
                <button class="btn btn-secondary" id="sudoku-new">New Puzzle</button>
                <span id="sudoku-message"></span>
            </div>
        `;
  }
  cacheElements() {
    this.boardDiv = this.container.querySelector('#sudoku-board');
    this.balanceSpan = this.container.querySelector('#sudoku-balance');
    this.betInput = this.container.querySelector('#sudoku-bet');
    this.messageSpan = this.container.querySelector('#sudoku-message');
    this.checkBtn = this.container.querySelector('#sudoku-check');
    this.newBtn = this.container.querySelector('#sudoku-new');
  }
  attachEvents() {
    this.checkBtn.addEventListener('click', () => this.checkSolution());
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
    
    // Generate a simple pre-filled Sudoku puzzle (easy)
    this.solution = [
      [5, 3, 4, 6, 7, 8, 9, 1, 2],
      [6, 7, 2, 1, 9, 5, 3, 4, 8],
      [1, 9, 8, 3, 4, 2, 5, 6, 7],
      [8, 5, 9, 7, 6, 1, 4, 2, 3],
      [4, 2, 6, 8, 5, 3, 7, 9, 1],
      [7, 1, 3, 9, 2, 4, 8, 5, 6],
      [9, 6, 1, 5, 3, 7, 2, 8, 4],
      [2, 8, 7, 4, 1, 9, 6, 3, 5],
      [3, 4, 5, 2, 8, 6, 1, 7, 9]
    ];
    // Remove some numbers to create puzzle
    this.puzzle = this.solution.map(row => [...row]);
    const removeCount = 40;
    for (let i = 0; i < removeCount; i++) {
      let r, c;
      do {
        r = Math.floor(Math.random() * 9);
        c = Math.floor(Math.random() * 9);
      } while (this.puzzle[r][c] === 0);
      this.puzzle[r][c] = 0;
    }
    this.userInput = this.puzzle.map(row => [...row]);
    this.renderBoard();
    this.messageSpan.textContent = '';
  }
  renderBoard() {
    this.boardDiv.innerHTML = '';
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const cell = document.createElement('input');
        cell.type = 'text';
        cell.maxLength = 1;
        cell.style.width = '40px';
        cell.style.height = '40px';
        cell.style.textAlign = 'center';
        cell.style.fontSize = '1.2rem';
        cell.style.backgroundColor = this.puzzle[r][c] !== 0 ? '#ddd' : 'white';
        cell.value = this.userInput[r][c] !== 0 ? this.userInput[r][c] : '';
        cell.disabled = this.puzzle[r][c] !== 0;
        if (!cell.disabled) {
          cell.addEventListener('input', (e) => {
            const val = e.target.value;
            if (val.match(/[1-9]/)) {
              this.userInput[r][c] = parseInt(val);
            } else {
              this.userInput[r][c] = 0;
              e.target.value = '';
            }
          });
        }
        this.boardDiv.appendChild(cell);
      }
    }
  }
  checkSolution() {
    let correct = true;
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (this.userInput[r][c] !== this.solution[r][c]) {
          correct = false;
          break;
        }
      }
    }
    if (correct) {
      const winAmount = this.bet * 2;
      window.balance += winAmount;
      window.updateGlobalBalance();
      this.messageSpan.textContent = `Perfect! You win $${winAmount}!`;
    } else {
      this.messageSpan.textContent = 'Not correct. Try again.';
    }
    this.balanceSpan.textContent = window.balance;
  }
}