// games/SolitaireGame.js
import { BaseGame } from './BaseGame.js';

export class SolitaireGame extends BaseGame {
    constructor() {
        super();
        this.deck = [];
        this.stock = [];
        this.waste = [];
        this.foundations = [[],[],[],[]];
        this.tableau = [[],[],[],[],[],[],[]];
        this.selected = null;
        this.gameWon = false;
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
            <h2>Solitaire</h2>
            <div style="display: flex; gap: 10px; margin-bottom: 20px; align-items: center;">
                <div class="stock" style="width:80px; height:100px; background:var(--bg-tertiary); border:2px solid var(--gold); border-radius:8px; display:flex; align-items:center; justify-content:center; cursor:pointer;">Stock</div>
                <div class="waste" style="width:80px; height:100px; background:var(--bg-tertiary); border:2px solid var(--accent-primary); border-radius:8px; display:flex; align-items:center; justify-content:center;">Waste</div>
                <div style="display: flex; gap: 5px; margin-left: auto;">
                    <div class="foundation-0" style="width:70px; height:100px; background:var(--bg-tertiary); border:2px solid #aaa; border-radius:8px;"></div>
                    <div class="foundation-1" style="width:70px; height:100px; background:var(--bg-tertiary); border:2px solid #aaa; border-radius:8px;"></div>
                    <div class="foundation-2" style="width:70px; height:100px; background:var(--bg-tertiary); border:2px solid #aaa; border-radius:8px;"></div>
                    <div class="foundation-3" style="width:70px; height:100px; background:var(--bg-tertiary); border:2px solid #aaa; border-radius:8px;"></div>
                </div>
            </div>
            <div style="display: flex; gap: 5px; justify-content: center; flex-wrap: wrap; min-height: 120px;" class="tableau"></div>
            <div class="game-controls">
                <button class="btn btn-primary" id="solitaire-new">New Game</button>
                <span id="solitaire-message"></span>
            </div>
        `;
    }
    cacheElements() {
        this.stockEl = this.container.querySelector('.stock');
        this.wasteEl = this.container.querySelector('.waste');
        this.foundationEls = [
            this.container.querySelector('.foundation-0'),
            this.container.querySelector('.foundation-1'),
            this.container.querySelector('.foundation-2'),
            this.container.querySelector('.foundation-3')
        ];
        this.tableauEl = this.container.querySelector('.tableau');
        this.messageSpan = this.container.querySelector('#solitaire-message');
        this.newBtn = this.container.querySelector('#solitaire-new');
    }
    attachEvents() {
        this.stockEl.addEventListener('click', () => this.drawFromStock());
        this.wasteEl.addEventListener('click', () => this.selectWaste());
        this.foundationEls.forEach((el, i) => {
            el.addEventListener('click', () => this.foundationClick(i));
        });
        this.newBtn.addEventListener('click', () => this.newGame());
    }
    newGame() {
        const suits = ['♣','♦','♥','♠'];
        const ranks = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
        this.deck = [];
        for (let s of suits) {
            for (let r of ranks) {
                this.deck.push(r + s);
            }
        }
        this.shuffle(this.deck);
        this.tableau = [[],[],[],[],[],[],[]];
        for (let i = 0; i < 7; i++) {
            for (let j = 0; j <= i; j++) {
                let card = this.deck.pop();
                if (j === i) {
                    card = card.toUpperCase();
                } else {
                    card = card.toLowerCase();
                }
                this.tableau[i].push(card);
            }
        }
        this.stock = this.deck.map(c => c.toLowerCase());
        this.waste = [];
        this.foundations = [[],[],[],[]];
        this.selected = null;
        this.gameWon = false;
        this.renderBoard();
        this.messageSpan.textContent = '';
    }
    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    renderBoard() {
        // Stock
        this.stockEl.textContent = this.stock.length ? 'Stock' : 'Empty';
        // Waste
        if (this.waste.length > 0) {
            let top = this.waste[this.waste.length - 1];
            this.wasteEl.textContent = this.cardSymbol(top);
            this.wasteEl.style.color = this.isRed(top) ? 'red' : 'black';
        } else {
            this.wasteEl.textContent = 'Empty';
            this.wasteEl.style.color = 'white';
        }
        // Foundations
        for (let i = 0; i < 4; i++) {
            if (this.foundations[i].length > 0) {
                let top = this.foundations[i][this.foundations[i].length - 1];
                this.foundationEls[i].textContent = this.cardSymbol(top);
                this.foundationEls[i].style.color = this.isRed(top) ? 'red' : 'black';
            } else {
                this.foundationEls[i].textContent = '';
                this.foundationEls[i].style.backgroundColor = 'var(--bg-tertiary)';
            }
        }
        // Tableau
        this.tableauEl.innerHTML = '';
        for (let pile = 0; pile < 7; pile++) {
            let pileDiv = document.createElement('div');
            pileDiv.style.display = 'inline-block';
            pileDiv.style.verticalAlign = 'top';
            pileDiv.style.margin = '0 2px';
            for (let i = 0; i < this.tableau[pile].length; i++) {
                let card = this.tableau[pile][i];
                let cardDiv = document.createElement('div');
                cardDiv.style.width = '70px';
                cardDiv.style.height = '100px';
                cardDiv.style.background = card === card.toLowerCase() ? '#aaa' : 'white';
                cardDiv.style.border = '2px solid #333';
                cardDiv.style.borderRadius = '8px';
                cardDiv.style.marginBottom = '-70px';
                cardDiv.style.position = 'relative';
                cardDiv.style.zIndex = i;
                cardDiv.style.display = 'flex';
                cardDiv.style.alignItems = 'center';
                cardDiv.style.justifyContent = 'center';
                cardDiv.style.fontSize = '1.2rem';
                if (card === card.toLowerCase()) {
                    cardDiv.textContent = '🂠';
                    cardDiv.style.color = '#fff';
                } else {
                    cardDiv.textContent = this.cardSymbol(card);
                    cardDiv.style.color = this.isRed(card) ? 'red' : 'black';
                }
                cardDiv.dataset.pile = pile;
                cardDiv.dataset.index = i;
                cardDiv.addEventListener('click', (e) => this.tableauClick(e));
                pileDiv.appendChild(cardDiv);
            }
            this.tableauEl.appendChild(pileDiv);
        }
    }
    cardSymbol(card) {
        if (typeof card !== 'string') return '';
        let rank = card[0];
        let suit = card.slice(-1);
        if (rank === '0') rank = '10';
        return rank + suit;
    }
    isRed(card) {
        if (typeof card !== 'string') return false;
        let suit = card.slice(-1);
        return suit === '♦' || suit === '♥';
    }
    cardRank(card) {
        if (typeof card !== 'string') return 0;
        let rank = card.slice(0, -1);
        if (rank === 'A') return 1;
        if (rank === 'J') return 11;
        if (rank === 'Q') return 12;
        if (rank === 'K') return 13;
        if (rank === '1') return 10;
        return parseInt(rank);
    }
    cardSuit(card) {
        return card.slice(-1);
    }
    drawFromStock() {
        if (this.stock.length === 0) {
            if (this.waste.length > 0) {
                this.stock = this.waste.reverse().map(c => c.toLowerCase());
                this.waste = [];
            }
        } else {
            let card = this.stock.pop();
            this.waste.push(card.toUpperCase());
        }
        this.selected = null;
        this.renderBoard();
    }
    selectWaste() {
        if (this.waste.length === 0) return;
        this.selected = { type: 'waste', card: this.waste[this.waste.length - 1] };
        this.messageSpan.textContent = 'Waste selected. Click destination.';
    }
    tableauClick(e) {
        let pile = parseInt(e.target.dataset.pile);
        let index = parseInt(e.target.dataset.index);
        let card = this.tableau[pile][index];
        if (card === card.toLowerCase()) return;
        if (!this.selected) {
            if (index !== this.tableau[pile].length - 1) return;
            this.selected = { type: 'tableau', pile: pile, card: card };
            this.messageSpan.textContent = 'Card selected. Click destination.';
        } else {
            if (this.selected.type === 'tableau') {
                this.moveTableauToTableau(this.selected.pile, pile);
            } else if (this.selected.type === 'waste') {
                this.moveWasteToTableau(pile);
            }
            this.selected = null;
        }
    }
    foundationClick(index) {
        if (!this.selected) return;
        if (this.selected.type === 'tableau') {
            this.moveTableauToFoundation(this.selected.pile, index);
        } else if (this.selected.type === 'waste') {
            this.moveWasteToFoundation(index);
        }
        this.selected = null;
    }
    moveTableauToTableau(fromPile, toPile) {
        let fromCards = this.tableau[fromPile];
        if (fromCards.length === 0) return;
        let movingCard = fromCards[fromCards.length - 1];
        let toCards = this.tableau[toPile];
        if (toCards.length === 0) {
            if (this.cardRank(movingCard) !== 13) return;
        } else {
            let topTo = toCards[toCards.length - 1];
            if (this.isRed(movingCard) === this.isRed(topTo)) return;
            if (this.cardRank(movingCard) !== this.cardRank(topTo) - 1) return;
        }
        fromCards.pop();
        toCards.push(movingCard);
        if (fromCards.length > 0 && fromCards[fromCards.length - 1] === fromCards[fromCards.length - 1].toLowerCase()) {
            fromCards[fromCards.length - 1] = fromCards[fromCards.length - 1].toUpperCase();
        }
        this.renderBoard();
    }
    moveWasteToTableau(toPile) {
        if (this.waste.length === 0) return;
        let movingCard = this.waste[this.waste.length - 1];
        let toCards = this.tableau[toPile];
        if (toCards.length === 0) {
            if (this.cardRank(movingCard) !== 13) return;
        } else {
            let topTo = toCards[toCards.length - 1];
            if (this.isRed(movingCard) === this.isRed(topTo)) return;
            if (this.cardRank(movingCard) !== this.cardRank(topTo) - 1) return;
        }
        this.waste.pop();
        toCards.push(movingCard);
        this.renderBoard();
    }
    moveTableauToFoundation(fromPile, foundationIndex) {
        let fromCards = this.tableau[fromPile];
        if (fromCards.length === 0) return;
        let movingCard = fromCards[fromCards.length - 1];
        let foundation = this.foundations[foundationIndex];
        if (foundation.length === 0) {
            if (this.cardRank(movingCard) !== 1) return;
        } else {
            let topF = foundation[foundation.length - 1];
            if (this.cardSuit(movingCard) !== this.cardSuit(topF)) return;
            if (this.cardRank(movingCard) !== this.cardRank(topF) + 1) return;
        }
        foundation.push(movingCard);
        fromCards.pop();
        if (fromCards.length > 0 && fromCards[fromCards.length - 1] === fromCards[fromCards.length - 1].toLowerCase()) {
            fromCards[fromCards.length - 1] = fromCards[fromCards.length - 1].toUpperCase();
        }
        this.renderBoard();
        if (this.foundations.every(f => f.length === 13)) {
            this.messageSpan.textContent = 'You won!';
        }
    }
    moveWasteToFoundation(foundationIndex) {
        if (this.waste.length === 0) return;
        let movingCard = this.waste[this.waste.length - 1];
        let foundation = this.foundations[foundationIndex];
        if (foundation.length === 0) {
            if (this.cardRank(movingCard) !== 1) return;
        } else {
            let topF = foundation[foundation.length - 1];
            if (this.cardSuit(movingCard) !== this.cardSuit(topF)) return;
            if (this.cardRank(movingCard) !== this.cardRank(topF) + 1) return;
        }
        foundation.push(movingCard);
        this.waste.pop();
        this.renderBoard();
        if (this.foundations.every(f => f.length === 13)) {
            this.messageSpan.textContent = 'You won!';
        }
    }
}