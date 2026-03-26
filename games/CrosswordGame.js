// games/CrosswordGame.js
import { BaseGame } from './BaseGame.js';

export class CrosswordGame extends BaseGame {
  mount(container) {
    super.mount(container);
    container.innerHTML = this.render();
    this.cacheElements();
    this.attachEvents();
    this.newGame();
  }
  render() {
    return `
            <h2>Crossword</h2>
            <div style="display: grid; grid-template-columns: repeat(5, 50px); gap: 1px; justify-content: center; margin:20px;" id="crossword-grid"></div>
            <div>Clues:</div>
            <div id="crossword-clues"></div>
            <div class="balance-box">Balance: $<span id="crossword-balance">${window.balance}</span></div>
            <div class="game-controls">
                <input type="number" id="crossword-bet" min="1" value="10">
                <button class="btn btn-primary" id="crossword-check">Check</button>
                <button class="btn btn-secondary" id="crossword-new">New Puzzle</button>
                <span id="crossword-message"></span>
            </div>
        `;
  }
  cacheElements() {
    this.gridDiv = this.container.querySelector('#crossword-grid');
    this.cluesDiv = this.container.querySelector('#crossword-clues');
    this.balanceSpan = this.container.querySelector('#crossword-balance');
    this.betInput = this.container.querySelector('#crossword-bet');
    this.messageSpan = this.container.querySelector('#crossword-message');
    this.checkBtn = this.container.querySelector('#crossword-check');
    this.newBtn = this.container.querySelector('#crossword-new');
  }
  attachEvents() {
    this.checkBtn.addEventListener('click', () => this.check());
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
    
    // Very simple crossword: 5x5 with words APPLE, PEAR, etc.
    this.solution = [
      ['A', 'P', 'P', 'L', 'E'],
      ['P', 'E', 'A', 'R', 'S'],
      ['P', 'L', 'U', 'M', 'S'],
      ['L', 'E', 'M', 'O', 'N'],
      ['E', 'G', 'G', 'S', '?']
    ];
    // Create empty grid with clues
    this.grid = Array(5).fill().map(() => Array(5).fill(''));
    this.cluesDiv.innerHTML = `
            <p>Across: 1. Fruit (5) -> APPLE</p>
            <p>Down: 1. Fruit (5) -> APPLE? Not exactly. For demo, fill the grid with any letters.</p>
        `;
    this.renderGrid();
    this.messageSpan.textContent = 'Enter letters in the grid.';
  }
  renderGrid() {
    this.gridDiv.innerHTML = '';
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 5; c++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.maxLength = 1;
        input.style.width = '50px';
        input.style.height = '50px';
        input.style.textAlign = 'center';
        input.style.fontSize = '1.2rem';
        input.style.backgroundColor = '#1e293b';
        input.style.color = 'white';
        input.value = this.grid[r][c];
        input.addEventListener('input', (e) => {
          this.grid[r][c] = e.target.value.toUpperCase();
        });
        this.gridDiv.appendChild(input);
      }
    }
  }
  check() {
    let correct = true;
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 5; c++) {
        if (this.grid[r][c] !== this.solution[r][c]) correct = false;
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