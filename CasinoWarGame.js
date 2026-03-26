// games/CasinoWarGame.js
import { BaseGame } from './BaseGame.js';

export class CasinoWarGame extends BaseGame {
    mount(container) {
        super.mount(container);
        container.innerHTML = this.render();
        this.cacheElements();
        this.attachEvents();
        this.deck = [];
        this.playerCard = null;
        this.dealerCard = null;
    }
    render() {
        return `
            <h2>Casino War</h2>
            <div style="display: flex; justify-content: space-around; margin:20px;">
                <div>Dealer: <span id="casinowar-dealer">?</span></div>
                <div>You: <span id="casinowar-player">?</span></div>
            </div>
            <div class="balance-box">Balance: $<span id="casinowar-balance">${window.balance}</span></div>
            <div class="game-controls">
                <input type="number" id="casinowar-bet" min="1" value="10">
                <button class="btn btn-primary" id="casinowar-deal">Deal</button>
                <button class="btn btn-secondary" id="casinowar-war" disabled>Go to War</button>
                <span id="casinowar-message"></span>
            </div>
        `;
    }
    cacheElements() {
        this.dealerSpan = this.container.querySelector('#casinowar-dealer');
        this.playerSpan = this.container.querySelector('#casinowar-player');
        this.balanceSpan = this.container.querySelector('#casinowar-balance');
        this.betInput = this.container.querySelector('#casinowar-bet');
        this.messageSpan = this.container.querySelector('#casinowar-message');
        this.dealBtn = this.container.querySelector('#casinowar-deal');
        this.warBtn = this.container.querySelector('#casinowar-war');
        this.warActive = false;
        this.originalBet = 0;
    }
    attachEvents() {
        this.dealBtn.addEventListener('click', () => this.deal());
        this.warBtn.addEventListener('click', () => this.war());
    }
    deal() {
        const bet = parseInt(this.betInput.value);
        if (bet > window.balance) {
            alert('Insufficient balance');
            return;
        }
        this.originalBet = bet;
        window.balance -= bet;
        window.updateGlobalBalance();
        this.balanceSpan.textContent = window.balance;

        const suits = ['♠', '♥', '♦', '♣'];
        const ranks = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'];
        this.deck = [];
        for (let s of suits) {
            for (let r of ranks) {
                this.deck.push(r + s);
            }
        }
        this.shuffle(this.deck);
        this.playerCard = this.deck.pop();
        this.dealerCard = this.deck.pop();
        this.playerSpan.textContent = this.playerCard;
        this.dealerSpan.textContent = this.dealerCard;

        const playerVal = this.cardValue(this.playerCard);
        const dealerVal = this.cardValue(this.dealerCard);
        if (playerVal > dealerVal) {
            const winAmount = this.originalBet * 2;
            window.balance += winAmount;
            window.updateGlobalBalance();
            this.messageSpan.textContent = `You win $${winAmount}!`;
            this.warActive = false;
            this.warBtn.disabled = true;
            this.dealBtn.disabled = false;
        } else if (playerVal < dealerVal) {
            this.messageSpan.textContent = 'Dealer wins.';
            this.warActive = false;
            this.warBtn.disabled = true;
            this.dealBtn.disabled = false;
        } else {
            // Tie -> war
            this.warActive = true;
            this.warBtn.disabled = false;
            this.dealBtn.disabled = true;
            this.messageSpan.textContent = 'War! Place an additional bet equal to your original bet to continue.';
        }
        this.balanceSpan.textContent = window.balance;
    }
    war() {
        if (!this.warActive) return;
        if (window.balance < this.originalBet) {
            this.messageSpan.textContent = 'Insufficient balance to go to war.';
            return;
        }
        window.balance -= this.originalBet;
        window.updateGlobalBalance();
        this.balanceSpan.textContent = window.balance;

        // Burn three cards (simulate)
        this.deck.pop(); this.deck.pop(); this.deck.pop();
        const newPlayer = this.deck.pop();
        const newDealer = this.deck.pop();
        this.playerSpan.textContent = newPlayer;
        this.dealerSpan.textContent = newDealer;
        const playerVal = this.cardValue(newPlayer);
        const dealerVal = this.cardValue(newDealer);
        if (playerVal >= dealerVal) {
            const winAmount = this.originalBet * 2;
            window.balance += winAmount;
            window.updateGlobalBalance();
            this.messageSpan.textContent = `You win the war! +$${winAmount}`;
        } else {
            this.messageSpan.textContent = 'You lose the war.';
        }
        this.warActive = false;
        this.warBtn.disabled = true;
        this.dealBtn.disabled = false;
        this.balanceSpan.textContent = window.balance;
    }
    cardValue(card) {
        let rank = card.slice(0, -1);
        if (rank === 'A') return 14;
        if (rank === 'K') return 13;
        if (rank === 'Q') return 12;
        if (rank === 'J') return 11;
        if (rank === '10') return 10;
        return parseInt(rank);
    }
    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
}