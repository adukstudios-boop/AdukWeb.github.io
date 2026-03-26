// games/InstantBingoGame.js
import { BaseGame } from './BaseGame.js';

export class InstantBingoGame extends BaseGame {
    mount(container) {
        super.mount(container);
        container.innerHTML = this.render();
        this.cacheElements();
        this.attachEvents();
        this.newCard();
    }
    render() {
        return `
            <h2>Instant Bingo</h2>
            <div style="display: grid; grid-template-columns: repeat(5, 50px); gap: 5px; justify-content: center; margin:20px;" id="bingo-card"></div>
            <div class="balance-box">Balance: $<span id="bingo-balance">${window.balance}</span></div>
            <div class="game-controls">
                <input type="number" id="bingo-bet" min="1" value="10">
                <button class="btn btn-primary" id="bingo-play">Play</button>
                <button class="btn btn-secondary" id="bingo-new">New Card</button>
                <span id="bingo-message"></span>
            </div>
        `;
    }
    cacheElements() {
        this.cardDiv = this.container.querySelector('#bingo-card');
        this.balanceSpan = this.container.querySelector('#bingo-balance');
        this.betInput = this.container.querySelector('#bingo-bet');
        this.messageSpan = this.container.querySelector('#bingo-message');
        this.playBtn = this.container.querySelector('#bingo-play');
        this.newBtn = this.container.querySelector('#bingo-new');
    }
    attachEvents() {
        this.playBtn.addEventListener('click', () => this.play());
        this.newBtn.addEventListener('click', () => this.newCard());
    }
    newCard() {
        this.card = [];
        for (let i = 0; i < 5; i++) {
            const row = [];
            for (let j = 0; j < 5; j++) {
                row.push(Math.floor(Math.random() * 75) + 1);
            }
            this.card.push(row);
        }
        this.card[2][2] = 'FREE';
        this.marked = Array(5).fill().map(() => Array(5).fill(false));
        this.marked[2][2] = true;
        this.renderCard();
    }
    renderCard() {
        this.cardDiv.innerHTML = '';
        for (let r = 0; r < 5; r++) {
            for (let c = 0; c < 5; c++) {
                const cell = document.createElement('div');
                cell.textContent = this.card[r][c];
                cell.style.width = '50px';
                cell.style.height = '50px';
                cell.style.border = '1px solid #aaa';
                cell.style.backgroundColor = this.marked[r][c] ? '#4caf50' : '#1e293b';
                cell.style.display = 'flex';
                cell.style.alignItems = 'center';
                cell.style.justifyContent = 'center';
                cell.style.fontSize = '0.9rem';
                this.cardDiv.appendChild(cell);
            }
        }
    }
    play() {
        const bet = parseInt(this.betInput.value);
        if (bet > window.balance) {
            this.messageSpan.textContent = 'Insufficient balance';
            return;
        }
        window.balance -= bet;
        window.updateGlobalBalance();
        this.balanceSpan.textContent = window.balance;

        // Draw 10 random numbers
        const drawn = [];
        for (let i = 0; i < 10; i++) {
            let num;
            do { num = Math.floor(Math.random() * 75) + 1; } while (drawn.includes(num));
            drawn.push(num);
        }
        // Mark matches
        for (let r = 0; r < 5; r++) {
            for (let c = 0; c < 5; c++) {
                if (this.card[r][c] !== 'FREE' && drawn.includes(this.card[r][c])) {
                    this.marked[r][c] = true;
                }
            }
        }
        this.renderCard();

        // Check for bingo
        let bingo = false;
        // Rows
        for (let r = 0; r < 5; r++) {
            if (this.marked[r].every(v => v === true)) bingo = true;
        }
        // Columns
        for (let c = 0; c < 5; c++) {
            let colMarked = true;
            for (let r = 0; r < 5; r++) {
                if (!this.marked[r][c]) colMarked = false;
            }
            if (colMarked) bingo = true;
        }
        // Diagonals
        let diag1 = true, diag2 = true;
        for (let i = 0; i < 5; i++) {
            if (!this.marked[i][i]) diag1 = false;
            if (!this.marked[i][4-i]) diag2 = false;
        }
        if (diag1 || diag2) bingo = true;

        if (bingo) {
            const win = bet * 5;
            window.balance += win;
            window.updateGlobalBalance();
            this.messageSpan.textContent = `BINGO! You won $${win}!`;
        } else {
            this.messageSpan.textContent = `No bingo. Drawn: ${drawn.slice(0,5).join(', ')}...`;
        }
        this.balanceSpan.textContent = window.balance;
    }
}