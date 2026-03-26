// games/MastermindGame.js
import { BaseGame } from './BaseGame.js';

export class MastermindGame extends BaseGame {
    mount(container) {
        super.mount(container);
        container.innerHTML = this.render();
        this.cacheElements();
        this.attachEvents();
        this.newGame();
    }
    render() {
        return `
            <h2>Mastermind</h2>
            <div style="margin:20px;">
                <div>Guess the 4-color code (colors: 🔴🟠🟡🟢🔵🟣)</div>
                <div style="display: flex; gap:5px; margin:10px;">
                    ${[0,1,2,3].map(i => `<select id="guess-${i}">${this.colorOptions()}</select>`).join('')}
                    <button class="btn btn-primary" id="mastermind-guess">Guess</button>
                </div>
                <div id="mastermind-history"></div>
                <div id="mastermind-message"></div>
            </div>
            <div class="balance-box">Balance: $<span id="mastermind-balance">${window.balance}</span></div>
            <div class="game-controls">
                <input type="number" id="mastermind-bet" min="1" value="10">
                <button class="btn btn-secondary" id="mastermind-new">New Game</button>
            </div>
        `;
    }
    colorOptions() {
        const colors = ['🔴','🟠','🟡','🟢','🔵','🟣'];
        return colors.map(c => `<option value="${c}">${c}</option>`).join('');
    }
    cacheElements() {
        this.guessSelects = [0,1,2,3].map(i => this.container.querySelector(`#guess-${i}`));
        this.guessBtn = this.container.querySelector('#mastermind-guess');
        this.historyDiv = this.container.querySelector('#mastermind-history');
        this.messageDiv = this.container.querySelector('#mastermind-message');
        this.balanceSpan = this.container.querySelector('#mastermind-balance');
        this.betInput = this.container.querySelector('#mastermind-bet');
        this.newBtn = this.container.querySelector('#mastermind-new');
    }
    attachEvents() {
        this.guessBtn.addEventListener('click', () => this.makeGuess());
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
        const colors = ['🔴','🟠','🟡','🟢','🔵','🟣'];
        this.code = [];
        for (let i = 0; i < 4; i++) this.code.push(colors[Math.floor(Math.random() * colors.length)]);
        this.guesses = [];
        this.guessCount = 0;
        this.historyDiv.innerHTML = '';
        this.messageDiv.textContent = '';
        this.guessBtn.disabled = false;
    }
    makeGuess() {
        const guess = this.guessSelects.map(s => s.value);
        if (guess.includes('')) return;
        let exact = 0, color = 0;
        const codeCopy = [...this.code];
        const guessCopy = [...guess];
        // Exact matches
        for (let i = 0; i < 4; i++) {
            if (guessCopy[i] === codeCopy[i]) {
                exact++;
                guessCopy[i] = null;
                codeCopy[i] = null;
            }
        }
        // Color matches
        for (let i = 0; i < 4; i++) {
            if (guessCopy[i]) {
                const idx = codeCopy.indexOf(guessCopy[i]);
                if (idx !== -1) {
                    color++;
                    codeCopy[idx] = null;
                }
            }
        }
        this.guesses.push({guess, exact, color});
        this.renderHistory();
        if (exact === 4) {
            const winAmount = this.bet * 3;
            window.balance += winAmount;
            window.updateGlobalBalance();
            this.messageDiv.innerHTML = `🎉 You cracked the code! Won $${winAmount}! 🎉`;
            this.guessBtn.disabled = true;
            this.balanceSpan.textContent = window.balance;
        } else if (this.guesses.length >= 10) {
            this.messageDiv.innerHTML = `Game over! The code was ${this.code.join('')}.`;
            this.guessBtn.disabled = true;
        } else {
            this.messageDiv.innerHTML = '';
        }
    }
    renderHistory() {
        this.historyDiv.innerHTML = '<div style="font-weight:bold;">Guesses:</div>';
        for (let g of this.guesses) {
            const div = document.createElement('div');
            div.textContent = `${g.guess.join('')} → Exact: ${g.exact}, Color: ${g.color}`;
            this.historyDiv.appendChild(div);
        }
    }
}