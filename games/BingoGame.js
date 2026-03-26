// games/BingoGame.js
import { BaseGame } from './BaseGame.js';

export class BingoGame extends BaseGame {
    mount(container) {
        super.mount(container);
        container.innerHTML = this.render();
        this.cacheElements();
        this.attachEvents();
        this.newGame();
    }
    render() {
        return `
            <h2>Bingo</h2>
            <div style="display: grid; grid-template-columns: repeat(5, 50px); gap: 5px; justify-content: center; margin:20px;" id="bingo-card"></div>
            <div>Numbers drawn: <span id="bingo-drawn"></span></div>
            <div class="balance-box">Balance: $<span id="bingo-balance">${window.balance}</span></div>
            <div class="game-controls">
                <input type="number" id="bingo-bet" min="1" value="10">
                <button class="btn btn-primary" id="bingo-draw">Draw Number</button>
                <button class="btn btn-secondary" id="bingo-reset">New Card</button>
                <span id="bingo-message"></span>
            </div>
        `;
    }
    cacheElements() {
        this.cardDiv = this.container.querySelector('#bingo-card');
        this.drawnSpan = this.container.querySelector('#bingo-drawn');
        this.balanceSpan = this.container.querySelector('#bingo-balance');
        this.betInput = this.container.querySelector('#bingo-bet');
        this.messageSpan = this.container.querySelector('#bingo-message');
        this.drawBtn = this.container.querySelector('#bingo-draw');
        this.resetBtn = this.container.querySelector('#bingo-reset');
    }
    attachEvents() {
        this.drawBtn.addEventListener('click', () => this.drawNumber());
        this.resetBtn.addEventListener('click', () => this.newGame());
    }
    newGame() {
        // Generate a 5x5 bingo card with numbers 1-75 (B:1-15, I:16-30, N:31-45, G:46-60, O:61-75)
        this.card = [];
        for (let col = 0; col < 5; col++) {
            const min = col * 15 + 1;
            const max = min + 14;
            const numbers = [];
            while (numbers.length < 5) {
                const num = Math.floor(Math.random() * (max - min + 1)) + min;
                if (!numbers.includes(num)) numbers.push(num);
            }
            numbers.sort((a,b) => a - b);
            this.card.push(numbers);
        }
        // Free space at center (row 2, col 2) -> index (2,2)
        this.card[2][2] = 'FREE';
        this.marked = Array(5).fill().map(() => Array(5).fill(false));
        this.drawnNumbers = [];
        this.drawnSpan.textContent = '';
        this.renderCard();
        this.messageSpan.textContent = '';
    }
    renderCard() {
        this.cardDiv.innerHTML = '';
        for (let r = 0; r < 5; r++) {
            for (let c = 0; c < 5; c++) {
                const cell = document.createElement('div');
                cell.style.width = '50px';
                cell.style.height = '50px';
                cell.style.border = '1px solid #aaa';
                cell.style.backgroundColor = this.marked[r][c] ? '#4caf50' : '#1e293b';
                cell.style.display = 'flex';
                cell.style.alignItems = 'center';
                cell.style.justifyContent = 'center';
                cell.style.fontSize = '0.9rem';
                cell.style.color = 'white';
                cell.textContent = this.card[r][c];
                this.cardDiv.appendChild(cell);
            }
        }
    }
    drawNumber() {
        const bet = parseInt(this.betInput.value);
        if (bet > window.balance) {
            alert('Insufficient balance');
            return;
        }
        // Deduct bet per draw? For simplicity, we deduct once when starting the game.
        // Better: only deduct at the beginning of a card. We'll do that in newGame.
        // Actually, to keep it simple, we deduct only when a new card is started.
        // So we'll not deduct here.
        let number;
        do {
            number = Math.floor(Math.random() * 75) + 1;
        } while (this.drawnNumbers.includes(number));
        this.drawnNumbers.push(number);
        this.drawnSpan.textContent = this.drawnNumbers.join(', ');

        // Mark card
        let marked = false;
        for (let r = 0; r < 5; r++) {
            for (let c = 0; c < 5; c++) {
                if (this.card[r][c] === number) {
                    this.marked[r][c] = true;
                    marked = true;
                }
            }
        }
        this.renderCard();
        // Check for bingo
        if (this.checkBingo()) {
            const winAmount = bet * 5;
            window.balance += winAmount;
            window.updateGlobalBalance();
            this.messageSpan.textContent = `BINGO! You won $${winAmount}!`;
            this.drawBtn.disabled = true;
            this.resetBtn.disabled = false;
        } else {
            this.messageSpan.textContent = `Drawn: ${number}`;
        }
        this.balanceSpan.textContent = window.balance;
    }
    checkBingo() {
        // Check rows
        for (let r = 0; r < 5; r++) {
            if (this.marked[r].every(v => v === true)) return true;
        }
        // Check columns
        for (let c = 0; c < 5; c++) {
            let colMarked = true;
            for (let r = 0; r < 5; r++) {
                if (!this.marked[r][c]) colMarked = false;
            }
            if (colMarked) return true;
        }
        // Check diagonals
        let diag1 = true, diag2 = true;
        for (let i = 0; i < 5; i++) {
            if (!this.marked[i][i]) diag1 = false;
            if (!this.marked[i][4-i]) diag2 = false;
        }
        return diag1 || diag2;
    }
}