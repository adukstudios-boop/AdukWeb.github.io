// games/BlackjackGame.js
import { BaseGame } from './BaseGame.js';

export class BlackjackGame extends BaseGame {
    mount(container) {
        super.mount(container);
        container.innerHTML = this.render();
        this.cacheElements();
        this.attachEvents();
        this.deck = [];
        this.playerHand = [];
        this.dealerHand = [];
        this.gameActive = false;
    }
    render() {
        return `
            <h2>Blackjack</h2>
            <div>Dealer: <span id="bj-dealer">?</span></div>
            <div>Player: <span id="bj-player">?</span></div>
            <div class="balance-box">Balance: $<span id="bj-balance">${window.balance}</span></div>
            <div class="game-controls">
                <input type="number" id="bj-bet" min="1" value="10">
                <button class="btn btn-primary" id="bj-deal">Deal</button>
                <button class="btn btn-secondary" id="bj-hit">Hit</button>
                <button class="btn btn-secondary" id="bj-stand">Stand</button>
                <span id="bj-message"></span>
            </div>
        `;
    }
    cacheElements() {
        this.dealerSpan = this.container.querySelector('#bj-dealer');
        this.playerSpan = this.container.querySelector('#bj-player');
        this.balanceSpan = this.container.querySelector('#bj-balance');
        this.betInput = this.container.querySelector('#bj-bet');
        this.messageSpan = this.container.querySelector('#bj-message');
        this.dealBtn = this.container.querySelector('#bj-deal');
        this.hitBtn = this.container.querySelector('#bj-hit');
        this.standBtn = this.container.querySelector('#bj-stand');
    }
    attachEvents() {
        this.dealBtn.addEventListener('click', () => this.deal());
        this.hitBtn.addEventListener('click', () => this.hit());
        this.standBtn.addEventListener('click', () => this.stand());
    }
    deal() {
        const bet = parseInt(this.betInput.value);
        if (bet > window.balance) {
            alert('Insufficient balance');
            return;
        }
        window.balance -= bet;
        window.updateGlobalBalance();
        this.balanceSpan.textContent = window.balance;
        this.messageSpan.textContent = '';

        const suits = ['♠','♥','♦','♣'];
        const ranks = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'];
        this.deck = [];
        for (let s of suits) {
            for (let r of ranks) {
                this.deck.push(r + s);
            }
        }
        this.shuffle(this.deck);
        this.playerHand = [this.deck.pop(), this.deck.pop()];
        this.dealerHand = [this.deck.pop(), this.deck.pop()];
        this.playerSpan.textContent = this.playerHand.join(' ');
        this.dealerSpan.textContent = this.dealerHand[0] + ' ?';
        this.gameActive = true;
        this.hitBtn.disabled = false;
        this.standBtn.disabled = false;
        this.dealBtn.disabled = true;
    }
    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    getHandValue(hand) {
        let sum = 0;
        let aces = 0;
        for (let card of hand) {
            let rank = card.slice(0, -1);
            if (rank === 'A') { aces++; sum += 11; }
            else if (rank === 'K' || rank === 'Q' || rank === 'J') sum += 10;
            else sum += parseInt(rank);
        }
        while (sum > 21 && aces > 0) {
            sum -= 10;
            aces--;
        }
        return sum;
    }
    hit() {
        if (!this.gameActive) return;
        this.playerHand.push(this.deck.pop());
        this.playerSpan.textContent = this.playerHand.join(' ');
        const playerVal = this.getHandValue(this.playerHand);
        if (playerVal > 21) {
            this.messageSpan.textContent = 'Bust! You lose.';
            this.gameActive = false;
            this.hitBtn.disabled = true;
            this.standBtn.disabled = true;
            this.dealBtn.disabled = false;
        }
    }
    stand() {
        if (!this.gameActive) return;
        this.gameActive = false;
        this.hitBtn.disabled = true;
        this.standBtn.disabled = true;
        this.dealBtn.disabled = false;

        let playerVal = this.getHandValue(this.playerHand);
        let dealerVal = this.getHandValue(this.dealerHand);
        this.dealerSpan.textContent = this.dealerHand.join(' ');

        while (dealerVal < 17) {
            this.dealerHand.push(this.deck.pop());
            dealerVal = this.getHandValue(this.dealerHand);
            this.dealerSpan.textContent = this.dealerHand.join(' ');
        }

        let message = '';
        if (dealerVal > 21 || playerVal > dealerVal) {
            const bet = parseInt(this.betInput.value);
            const win = bet * 2;
            window.balance += win;
            window.updateGlobalBalance();
            message = `You win $${win}!`;
        } else if (playerVal === dealerVal) {
            window.balance += parseInt(this.betInput.value);
            window.updateGlobalBalance();
            message = 'Push';
        } else {
            message = 'Dealer wins.';
        }
        this.messageSpan.textContent = message;
        this.balanceSpan.textContent = window.balance;
    }
}