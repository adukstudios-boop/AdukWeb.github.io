// games/BackgammonGame.js
import { BaseGame } from './BaseGame.js';

export class BackgammonGame extends BaseGame {
  mount(container) {
    super.mount(container);
    container.innerHTML = this.render();
    this.cacheElements();
    this.attachEvents();
    this.newGame();
  }
  render() {
    return `
            <h2>Backgammon (Simplified)</h2>
            <div style="display: flex; justify-content: space-around; margin:10px;">
                <div>Player 1 (Red) <span id="bg-player1-points">0</span></div>
                <div>Player 2 (Black) <span id="bg-player2-points">0</span></div>
            </div>
            <div style="display: flex; flex-wrap: wrap; gap:2px; justify-content:center;" id="bg-board"></div>
            <div class="game-controls">
                <button class="btn btn-primary" id="bg-roll">Roll Dice</button>
                <span id="bg-message"></span>
            </div>
        `;
  }
  cacheElements() {
    this.boardDiv = this.container.querySelector('#bg-board');
    this.player1Span = this.container.querySelector('#bg-player1-points');
    this.player2Span = this.container.querySelector('#bg-player2-points');
    this.messageSpan = this.container.querySelector('#bg-message');
    this.rollBtn = this.container.querySelector('#bg-roll');
  }
  attachEvents() {
    this.rollBtn.addEventListener('click', () => this.roll());
  }
  newGame() {
    this.player1Score = 0;
    this.player2Score = 0;
    this.turn = 1;
    this.updateScores();
    this.messageSpan.textContent = "Player 1's turn. Roll dice.";
  }
  roll() {
    const die1 = Math.floor(Math.random() * 6) + 1;
    const die2 = Math.floor(Math.random() * 6) + 1;
    const total = die1 + die2;
    if (this.turn === 1) {
      this.player1Score += total;
      if (this.player1Score >= 100) {
        this.messageSpan.textContent = 'Player 1 wins!';
      } else {
        this.turn = 2;
        this.messageSpan.textContent = `Player 1 rolled ${total}. Player 2's turn.`;
      }
    } else {
      this.player2Score += total;
      if (this.player2Score >= 100) {
        this.messageSpan.textContent = 'Player 2 wins!';
      } else {
        this.turn = 1;
        this.messageSpan.textContent = `Player 2 rolled ${total}. Player 1's turn.`;
      }
    }
    this.updateScores();
  }
  updateScores() {
    this.player1Span.textContent = this.player1Score;
    this.player2Span.textContent = this.player2Score;
  }
}