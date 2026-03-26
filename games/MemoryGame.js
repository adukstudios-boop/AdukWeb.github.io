// games/MemoryGame.js
import { BaseGame } from './BaseGame.js';

export class MemoryGame extends BaseGame {
  constructor() {
    super();
    this.cards = [];
    this.flipped = [];
    this.matched = [];
    this.moves = 0;
    this.canFlip = true;
    this.timer = null;
    this.seconds = 0;
  }
  mount(container) {
    super.mount(container);
    container.innerHTML = this.render();
    this.cacheElements();
    this.attachEvents();
    this.newGame();
  }
  render() {
    return `
            <h2>Memory Match</h2>
            <div style="display: flex; justify-content: space-around; margin-bottom: 10px;">
                <span>Moves: <span id="memory-moves">0</span></span>
                <span>Time: <span id="memory-time">0</span>s</span>
            </div>
            <div style="display: grid; grid-template-columns: repeat(4, 80px); gap: 10px; justify-content: center;" id="memory-board"></div>
            <div class="game-controls">
                <button class="btn btn-primary" id="memory-new">New Game</button>
                <span id="memory-message"></span>
            </div>
        `;
  }
  cacheElements() {
    this.boardDiv = this.container.querySelector('#memory-board');
    this.movesSpan = this.container.querySelector('#memory-moves');
    this.timeSpan = this.container.querySelector('#memory-time');
    this.messageSpan = this.container.querySelector('#memory-message');
    this.newBtn = this.container.querySelector('#memory-new');
  }
  attachEvents() {
    this.newBtn.addEventListener('click', () => this.newGame());
  }
  newGame() {
    this.cards = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8];
    this.shuffle(this.cards);
    this.flipped = Array(16).fill(false);
    this.matched = Array(16).fill(false);
    this.moves = 0;
    this.seconds = 0;
    this.canFlip = true;
    this.updateMoves();
    this.updateTime();
    this.renderBoard();
    if (this.timer) clearInterval(this.timer);
    this.timer = setInterval(() => {
      this.seconds++;
      this.updateTime();
    }, 1000);
    this.messageSpan.textContent = '';
  }
  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
  renderBoard() {
    this.boardDiv.innerHTML = '';
    for (let i = 0; i < 16; i++) {
      const card = document.createElement('div');
      card.style.width = '80px';
      card.style.height = '80px';
      card.style.background = this.matched[i] ? '#4caf50' : (this.flipped[i] ? 'white' : '#2196f3');
      card.style.border = '2px solid var(--gold)';
      card.style.borderRadius = '8px';
      card.style.display = 'flex';
      card.style.alignItems = 'center';
      card.style.justifyContent = 'center';
      card.style.fontSize = '2rem';
      card.style.cursor = this.matched[i] ? 'default' : 'pointer';
      card.style.color = 'black';
      if (this.matched[i] || this.flipped[i]) {
        card.textContent = this.cards[i];
      } else {
        card.textContent = '?';
      }
      card.dataset.index = i;
      card.addEventListener('click', (e) => this.cardClick(e));
      this.boardDiv.appendChild(card);
    }
  }
  cardClick(e) {
    const index = parseInt(e.target.dataset.index);
    if (!this.canFlip || this.matched[index] || this.flipped[index]) return;
    this.flipped[index] = true;
    this.renderBoard();
    let flippedIndices = this.flipped.reduce((acc, val, idx) => val && !this.matched[idx] ? [...acc, idx] : acc, []);
    if (flippedIndices.length === 2) {
      this.moves++;
      this.updateMoves();
      this.canFlip = false;
      const [i, j] = flippedIndices;
      if (this.cards[i] === this.cards[j]) {
        this.matched[i] = true;
        this.matched[j] = true;
        this.flipped[i] = false;
        this.flipped[j] = false;
        this.canFlip = true;
        this.renderBoard();
        if (this.matched.every(v => v)) {
          clearInterval(this.timer);
          this.messageSpan.textContent = `You won in ${this.moves} moves!`;
        }
      } else {
        setTimeout(() => {
          this.flipped[i] = false;
          this.flipped[j] = false;
          this.canFlip = true;
          this.renderBoard();
        }, 1000);
      }
    }
  }
  updateMoves() {
    this.movesSpan.textContent = this.moves;
  }
  updateTime() {
    this.timeSpan.textContent = this.seconds;
  }
}