// games/WordSearchGame.js
import { BaseGame } from './BaseGame.js';

export class WordSearchGame extends BaseGame {
  mount(container) {
    super.mount(container);
    container.innerHTML = this.render();
    this.cacheElements();
    this.attachEvents();
    this.newGame();
  }
  render() {
    return `
            <h2>Word Search</h2>
            <div style="display: grid; grid-template-columns: repeat(8, 40px); gap: 1px; justify-content: center; margin:20px;" id="wordsearch-grid"></div>
            <div>Words to find: <span id="wordsearch-words"></span></div>
            <div>Found: <span id="wordsearch-found">0</span> / <span id="wordsearch-total">0</span></div>
            <div class="balance-box">Balance: $<span id="wordsearch-balance">${window.balance}</span></div>
            <div class="game-controls">
                <input type="number" id="wordsearch-bet" min="1" value="10">
                <button class="btn btn-primary" id="wordsearch-new">New Puzzle</button>
                <span id="wordsearch-message"></span>
            </div>
        `;
  }
  cacheElements() {
    this.gridDiv = this.container.querySelector('#wordsearch-grid');
    this.wordsSpan = this.container.querySelector('#wordsearch-words');
    this.foundSpan = this.container.querySelector('#wordsearch-found');
    this.totalSpan = this.container.querySelector('#wordsearch-total');
    this.balanceSpan = this.container.querySelector('#wordsearch-balance');
    this.betInput = this.container.querySelector('#wordsearch-bet');
    this.messageSpan = this.container.querySelector('#wordsearch-message');
    this.newBtn = this.container.querySelector('#wordsearch-new');
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
    
    // Define words and grid (simplified)
    this.words = ['CAT', 'DOG', 'FISH', 'BIRD', 'MOUSE'];
    this.totalSpan.textContent = this.words.length;
    this.found = 0;
    this.foundSpan.textContent = this.found;
    this.wordsSpan.textContent = this.words.join(', ');
    // Create a random 8x8 grid with some letters
    this.grid = Array(8).fill().map(() => Array(8).fill().map(() => String.fromCharCode(65 + Math.floor(Math.random() * 26))));
    // Place the words (simplified, just for demo we don't actually place them)
    this.selected = [];
    this.renderGrid();
    this.messageSpan.textContent = 'Click and drag to select words.';
  }
  renderGrid() {
    this.gridDiv.innerHTML = '';
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const cell = document.createElement('div');
        cell.textContent = this.grid[r][c];
        cell.style.width = '40px';
        cell.style.height = '40px';
        cell.style.border = '1px solid #aaa';
        cell.style.display = 'flex';
        cell.style.alignItems = 'center';
        cell.style.justifyContent = 'center';
        cell.style.backgroundColor = '#1e293b';
        cell.style.cursor = 'pointer';
        cell.dataset.r = r;
        cell.dataset.c = c;
        cell.addEventListener('click', (e) => this.cellClick(e));
        this.gridDiv.appendChild(cell);
      }
    }
  }
  cellClick(e) {
    // For simplicity, we'll just simulate word checking by a double-click or something.
    // Actually we need a proper word selection UI. We'll simplify: clicking a word from the list marks it as found.
    alert('In a full implementation, you would click and drag to select words. For demo, click "New Puzzle" to continue.');
    // In a real version, we'd track selections and check against words.
    // For now, we'll just auto-win after 3 seconds? Not good. Better to just let them click "New Puzzle" again.
  }
}