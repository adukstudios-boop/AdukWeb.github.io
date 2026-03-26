// games/DominoesGame.js
import { BaseGame } from './BaseGame.js';

export class DominoesGame extends BaseGame {
  mount(container) {
    super.mount(container);
    container.innerHTML = this.render();
    this.cacheElements();
    this.attachEvents();
    this.newGame();
  }
  render() {
    return `
            <h2>Dominoes</h2>
            <div style="display: flex; gap: 5px; flex-wrap: wrap; justify-content: center; margin:20px;" id="dominoes-hand"></div>
            <div>Table: <span id="dominoes-table"></span></div>
            <div class="balance-box">Balance: $<span id="dominoes-balance">${window.balance}</span></div>
            <div class="game-controls">
                <input type="number" id="dominoes-bet" min="1" value="10">
                <button class="btn btn-primary" id="dominoes-new">New Game</button>
                <span id="dominoes-message"></span>
            </div>
        `;
  }
  cacheElements() {
    this.handDiv = this.container.querySelector('#dominoes-hand');
    this.tableSpan = this.container.querySelector('#dominoes-table');
    this.balanceSpan = this.container.querySelector('#dominoes-balance');
    this.betInput = this.container.querySelector('#dominoes-bet');
    this.messageSpan = this.container.querySelector('#dominoes-message');
    this.newBtn = this.container.querySelector('#dominoes-new');
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
    // Create double-6 domino set
    this.dominoes = [];
    for (let i = 0; i <= 6; i++) {
      for (let j = i; j <= 6; j++) {
        this.dominoes.push([i, j]);
      }
    }
    this.shuffle(this.dominoes);
    // Player gets 7, AI gets 7, rest are boneyard
    this.playerHand = this.dominoes.splice(0, 7);
    this.aiHand = this.dominoes.splice(0, 7);
    this.boneyard = this.dominoes;
    // Start with the double-six if possible
    let startDomino = this.playerHand.find(d => d[0] === 6 && d[1] === 6);
    if (startDomino) {
      this.table = [startDomino];
      this.playerHand = this.playerHand.filter(d => d !== startDomino);
      this.turn = 'ai';
    } else {
      startDomino = this.aiHand.find(d => d[0] === 6 && d[1] === 6);
      if (startDomino) {
        this.table = [startDomino];
        this.aiHand = this.aiHand.filter(d => d !== startDomino);
        this.turn = 'player';
      } else {
        // No double, start with a random domino from player
        startDomino = this.playerHand[0];
        this.table = [startDomino];
        this.playerHand = this.playerHand.slice(1);
        this.turn = 'ai';
      }
    }
    this.renderHand();
    this.updateTable();
    this.messageSpan.textContent = `Turn: ${this.turn === 'player' ? 'You' : 'AI'}`;
    if (this.turn === 'ai') setTimeout(() => this.aiMove(), 500);
  }
  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
  renderHand() {
    this.handDiv.innerHTML = '';
    for (let i = 0; i < this.playerHand.length; i++) {
      const d = this.playerHand[i];
      const div = document.createElement('div');
      div.textContent = `${d[0]}-${d[1]}`;
      div.style.padding = '8px';
      div.style.margin = '4px';
      div.style.backgroundColor = '#1e293b';
      div.style.borderRadius = '6px';
      div.style.cursor = 'pointer';
      div.addEventListener('click', () => this.playerPlay(i));
      this.handDiv.appendChild(div);
    }
  }
  updateTable() {
    const ends = this.getTableEnds();
    this.tableSpan.textContent = `${ends.left} | ... | ${ends.right}`;
  }
  getTableEnds() {
    let left = this.table[0][0];
    let right = this.table[this.table.length - 1][1];
    return { left, right };
  }
  playerPlay(index) {
    if (this.turn !== 'player') return;
    const domino = this.playerHand[index];
    const ends = this.getTableEnds();
    if (domino[0] === ends.left) {
      this.table.unshift([domino[1], domino[0]]);
      this.playerHand.splice(index, 1);
      this.turn = 'ai';
      this.messageSpan.textContent = 'AI turn...';
      this.renderHand();
      this.updateTable();
      if (this.playerHand.length === 0) {
        this.winGame();
        return;
      }
      setTimeout(() => this.aiMove(), 500);
    } else if (domino[1] === ends.right) {
      this.table.push(domino);
      this.playerHand.splice(index, 1);
      this.turn = 'ai';
      this.messageSpan.textContent = 'AI turn...';
      this.renderHand();
      this.updateTable();
      if (this.playerHand.length === 0) {
        this.winGame();
        return;
      }
      setTimeout(() => this.aiMove(), 500);
    } else if (domino[0] === ends.right) {
      this.table.push([domino[1], domino[0]]);
      this.playerHand.splice(index, 1);
      this.turn = 'ai';
      this.messageSpan.textContent = 'AI turn...';
      this.renderHand();
      this.updateTable();
      if (this.playerHand.length === 0) {
        this.winGame();
        return;
      }
      setTimeout(() => this.aiMove(), 500);
    } else if (domino[1] === ends.left) {
      this.table.unshift(domino);
      this.playerHand.splice(index, 1);
      this.turn = 'ai';
      this.messageSpan.textContent = 'AI turn...';
      this.renderHand();
      this.updateTable();
      if (this.playerHand.length === 0) {
        this.winGame();
        return;
      }
      setTimeout(() => this.aiMove(), 500);
    } else {
      this.messageSpan.textContent = 'Cannot play that domino.';
    }
  }
  aiMove() {
    if (this.turn !== 'ai') return;
    const ends = this.getTableEnds();
    let playIndex = -1;
    let playReversed = false;
    for (let i = 0; i < this.aiHand.length; i++) {
      const d = this.aiHand[i];
      if (d[0] === ends.left) {
        playIndex = i;
        playReversed = true;
        break;
      } else if (d[1] === ends.right) {
        playIndex = i;
        playReversed = false;
        break;
      } else if (d[0] === ends.right) {
        playIndex = i;
        playReversed = false;
        break;
      } else if (d[1] === ends.left) {
        playIndex = i;
        playReversed = true;
        break;
      }
    }
    if (playIndex !== -1) {
      let domino = this.aiHand[playIndex];
      if (playReversed) domino = [domino[1], domino[0]];
      if (domino[0] === ends.left) {
        this.table.unshift([domino[1], domino[0]]);
      } else {
        this.table.push(domino);
      }
      this.aiHand.splice(playIndex, 1);
      this.turn = 'player';
      this.messageSpan.textContent = 'Your turn.';
      this.updateTable();
      if (this.aiHand.length === 0) {
        this.messageSpan.textContent = 'AI played all dominoes. You lose.';
        this.gameActive = false;
        return;
      }
      this.renderHand();
    } else {
      // Draw from boneyard
      if (this.boneyard.length > 0) {
        const drawn = this.boneyard.pop();
        this.aiHand.push(drawn);
        this.messageSpan.textContent = 'AI drew a domino.';
        setTimeout(() => this.aiMove(), 500);
      } else {
        this.messageSpan.textContent = 'AI cannot play and boneyard empty. Your turn.';
        this.turn = 'player';
        this.renderHand();
      }
    }
  }
  winGame() {
    const winAmount = this.bet * 2;
    window.balance += winAmount;
    window.updateGlobalBalance();
    this.messageSpan.textContent = `You played all your dominoes! You win $${winAmount}!`;
    this.balanceSpan.textContent = window.balance;
    this.gameActive = false;
  }
}