// games/HangmanGame.js
import { BaseGame } from './BaseGame.js';

export class HangmanGame extends BaseGame {
  mount(container) {
    super.mount(container);
    container.innerHTML = this.render();
    this.cacheElements();
    this.attachEvents();
    this.newGame();
  }
  render() {
    return `
            <h2>Hangman</h2>
            <div style="font-size: 2rem; text-align: center; margin:20px;" id="hangman-word">_ _ _ _ _</div>
            <div>Wrong guesses: <span id="hangman-wrong">0</span>/6</div>
            <div>Guessed letters: <span id="hangman-guessed"></span></div>
            <div class="balance-box">Balance: $<span id="hangman-balance">${window.balance}</span></div>
            <div class="game-controls">
                <input type="text" id="hangman-guess" maxlength="1" placeholder="Letter" style="width:50px;">
                <button class="btn btn-primary" id="hangman-submit">Guess</button>
                <button class="btn btn-secondary" id="hangman-new">New Word</button>
                <span id="hangman-message"></span>
            </div>
        `;
  }
  cacheElements() {
    this.wordSpan = this.container.querySelector('#hangman-word');
    this.wrongSpan = this.container.querySelector('#hangman-wrong');
    this.guessedSpan = this.container.querySelector('#hangman-guessed');
    this.balanceSpan = this.container.querySelector('#hangman-balance');
    this.betInput = this.container.querySelector('#hangman-bet');
    this.messageSpan = this.container.querySelector('#hangman-message');
    this.guessInput = this.container.querySelector('#hangman-guess');
    this.submitBtn = this.container.querySelector('#hangman-submit');
    this.newBtn = this.container.querySelector('#hangman-new');
  }
  attachEvents() {
    this.submitBtn.addEventListener('click', () => this.makeGuess());
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
    this.words = ['JAVASCRIPT', 'PYTHON', 'RUBY', 'HTML', 'CSS', 'REACT'];
    this.word = this.words[Math.floor(Math.random() * this.words.length)].toUpperCase();
    this.guessed = [];
    this.wrongCount = 0;
    this.updateDisplay();
    this.messageSpan.textContent = '';
  }
  updateDisplay() {
    let display = '';
    for (let letter of this.word) {
      if (this.guessed.includes(letter)) display += letter + ' ';
      else display += '_ ';
    }
    this.wordSpan.textContent = display.trim();
    this.wrongSpan.textContent = this.wrongCount;
    this.guessedSpan.textContent = this.guessed.join(', ');
    if (!display.includes('_')) {
      const winAmount = this.bet * 2;
      window.balance += winAmount;
      window.updateGlobalBalance();
      this.messageSpan.textContent = `You win! +$${winAmount}`;
      this.submitBtn.disabled = true;
    } else if (this.wrongCount >= 6) {
      this.messageSpan.textContent = `Game over! The word was ${this.word}.`;
      this.submitBtn.disabled = true;
    }
    this.balanceSpan.textContent = window.balance;
  }
  makeGuess() {
    const guess = this.guessInput.value.toUpperCase();
    this.guessInput.value = '';
    if (!guess || this.guessed.includes(guess)) return;
    this.guessed.push(guess);
    if (!this.word.includes(guess)) {
      this.wrongCount++;
    }
    this.updateDisplay();
  }
}