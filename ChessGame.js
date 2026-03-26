// games/ChessGame.js
import { BaseGame } from './BaseGame.js';

export class ChessGame extends BaseGame {
    mount(container) {
        super.mount(container);
        container.innerHTML = this.render();
        this.cacheElements();
        this.attachEvents();
        this.newGame();
    }
    render() {
        return `
            <h2>Chess (Simplified)</h2>
            <div style="display: flex; justify-content: space-between;">
                <span>Turn: <span id="chess-turn">White</span></span>
                <span id="chess-message"></span>
            </div>
            <div style="display: grid; grid-template-columns: repeat(8, 50px); gap: 1px; justify-content: center; margin:20px;" id="chess-board"></div>
            <div class="game-controls">
                <button class="btn btn-primary" id="chess-reset">New Game</button>
            </div>
        `;
    }
    cacheElements() {
        this.boardDiv = this.container.querySelector('#chess-board');
        this.turnSpan = this.container.querySelector('#chess-turn');
        this.messageSpan = this.container.querySelector('#chess-message');
        this.resetBtn = this.container.querySelector('#chess-reset');
    }
    attachEvents() {
        this.resetBtn.addEventListener('click', () => this.newGame());
    }
    newGame() {
        this.board = [
            ['r','n','b','q','k','b','n','r'],
            ['p','p','p','p','p','p','p','p'],
            ['','','','','','','',''],
            ['','','','','','','',''],
            ['','','','','','','',''],
            ['','','','','','','',''],
            ['P','P','P','P','P','P','P','P'],
            ['R','N','B','Q','K','B','N','R']
        ];
        this.turn = 'white';
        this.selected = null;
        this.renderBoard();
        this.messageSpan.textContent = '';
    }
    renderBoard() {
        this.boardDiv.innerHTML = '';
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const piece = this.board[r][c];
                const cell = document.createElement('div');
                cell.style.width = '50px';
                cell.style.height = '50px';
                cell.style.backgroundColor = (r + c) % 2 === 0 ? '#f0d9b5' : '#b58863';
                cell.style.display = 'flex';
                cell.style.alignItems = 'center';
                cell.style.justifyContent = 'center';
                cell.style.fontSize = '2rem';
                cell.style.cursor = 'pointer';
                cell.textContent = this.getSymbol(piece);
                cell.dataset.row = r;
                cell.dataset.col = c;
                cell.addEventListener('click', (e) => this.cellClick(e));
                if (this.selected && this.selected.row === r && this.selected.col === c) {
                    cell.style.outline = '3px solid yellow';
                }
                this.boardDiv.appendChild(cell);
            }
        }
        this.turnSpan.textContent = this.turn === 'white' ? 'White' : 'Black';
    }
    getSymbol(piece) {
        if (!piece) return '';
        const map = {
            'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚', 'p': '♟',
            'R': '♖', 'N': '♘', 'B': '♗', 'Q': '♕', 'K': '♔', 'P': '♙'
        };
        return map[piece] || piece;
    }
    cellClick(e) {
        const row = parseInt(e.target.dataset.row);
        const col = parseInt(e.target.dataset.col);
        const piece = this.board[row][col];
        const isWhiteTurn = this.turn === 'white';
        const isWhitePiece = piece && piece === piece.toUpperCase();

        if (this.selected === null) {
            if (piece && ((isWhiteTurn && isWhitePiece) || (!isWhiteTurn && !isWhitePiece))) {
                this.selected = { row, col };
                this.renderBoard();
            }
        } else {
            const fromRow = this.selected.row;
            const fromCol = this.selected.col;
            const movingPiece = this.board[fromRow][fromCol];
            const targetPiece = this.board[row][col];
            const isTargetWhite = targetPiece && targetPiece === targetPiece.toUpperCase();
            if (targetPiece && ((isWhiteTurn && isTargetWhite) || (!isWhiteTurn && !isTargetWhite))) {
                if ((isWhiteTurn && isWhitePiece) || (!isWhiteTurn && !isWhitePiece)) {
                    this.selected = { row, col };
                } else {
                    this.selected = null;
                }
                this.renderBoard();
                return;
            }
            this.board[row][col] = movingPiece;
            this.board[fromRow][fromCol] = '';
            this.selected = null;
            if (targetPiece && (targetPiece.toLowerCase() === 'k' || targetPiece.toUpperCase() === 'K')) {
                this.messageSpan.textContent = `${this.turn} wins!`;
            }
            this.turn = this.turn === 'white' ? 'black' : 'white';
            this.renderBoard();
        }
    }
}