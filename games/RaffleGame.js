// games/RaffleGame.js
import { BaseGame } from './BaseGame.js';

export class RaffleGame extends BaseGame {
  mount(container) {
    super.mount(container);
    container.innerHTML = this.render();
    this.cacheElements();
    this.attachEvents();
  }
  render() {
    return `
            <h2>Raffle</h2>
            <div style="margin:20px; text-align:center;">
                <p>Buy a raffle ticket for $5</p>
                <button class="btn btn-primary" id="raffle-buy">Buy Ticket</button>
                <div id="raffle-result" style="margin-top:20px;"></div>
            </div>
            <div class="balance-box">Balance: $<span id="raffle-balance">${window.balance}</span></div>
            <span id="raffle-message"></span>
        `;
  }
  cacheElements() {
    this.buyBtn = this.container.querySelector('#raffle-buy');
    this.resultDiv = this.container.querySelector('#raffle-result');
    this.balanceSpan = this.container.querySelector('#raffle-balance');
    this.messageSpan = this.container.querySelector('#raffle-message');
  }
  attachEvents() {
    this.buyBtn.addEventListener('click', () => this.buy());
  }
  buy() {
    const ticketPrice = 5;
    if (ticketPrice > window.balance) {
      this.messageSpan.textContent = 'Insufficient balance';
      return;
    }
    window.balance -= ticketPrice;
    window.updateGlobalBalance();
    this.balanceSpan.textContent = window.balance;
    
    // Simulate raffle draw with 10% chance to win $50
    const win = Math.random() < 0.1;
    if (win) {
      const prize = 50;
      window.balance += prize;
      window.updateGlobalBalance();
      this.resultDiv.innerHTML = `🎉 Congratulations! You won $${prize}! 🎉`;
    } else {
      this.resultDiv.innerHTML = 'Sorry, no prize this time. Better luck next time!';
    }
    this.balanceSpan.textContent = window.balance;
  }
}