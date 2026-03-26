# 🎮 Aduk Games – Modular Gaming Platform

A fully modular web platform featuring 75+ playable games including slots, card games, skill games, and arcade classics. Built with vanilla JavaScript, HTML5, and CSS3. All games are dynamically loaded from individual modules, making the codebase easy to maintain and extend.

## 🚀 Features

- **75+ games** – Slots, poker, blackjack, crash, dice, roulette, chess, memory, racing, and many more.
- **Modular architecture** – Each game is a separate ES module in the `/games` folder.
- **Dynamic game loading** – Games are imported on demand for performance.
- **Offline support** – Service worker caches assets for offline play (PWA ready).
- **Responsive design** – Works on desktop, tablet, and mobile.
- **User balance** – Play with virtual currency that persists across games.
- **Daily challenge** – Spin a wheel to win bonus balance.
- **Feedback form** – Send feedback via email.
- **Avatar system** – Choose your profile picture.
- **Self‑exclusion** – Simple tool for responsible gaming.

## 🛠️ Tech Stack

- **Frontend** – Vanilla JavaScript (ES6), HTML5, CSS3
- **Modules** – ES modules (dynamic `import()`)
- **Service Worker** – For offline caching and PWA features
- **Hosting** – GitHub Pages (or any static hosting)

## 📁 Project Structure

aduk-demo/
│
├── index.html                     # Main entry point
├── style.css                      # Global styles
├── main.js                        # Core logic: game loading, navigation, balance
├── sw.js                          # Service worker for offline support
├── manifest.json                  # PWA manifest
├── .gitignore                     # Git ignored files
├── README.md                      # Project documentation
│
├── assets/                        # Static assets (images, icons, etc.)
│   └── images/
│       ├── icon-192.png
│       └── icon-512.png
│
└── games/                         # All game modules (75 files)
    ├── BaseGame.js                # Base class for all games
    ├── SlotGame.js
    ├── CrashGame.js
    ├── DiceGame.js
    ├── RouletteGame.js
    ├── KenoGame.js
    ├── ScratchGame.js
    ├── WheelGame.js
    ├── BlackjackGame.js
    ├── PokerGame.js
    ├── BaccaratGame.js
    ├── TeenPattiGame.js
    ├── VideoPokerGame.js
    ├── WarGame.js
    ├── SolitaireGame.js
    ├── TicTacToeGame.js
    ├── Connect4Game.js
    ├── ChessGame.js
    ├── CheckersGame.js
    ├── BackgammonGame.js
    ├── MemoryGame.js
    ├── SoccerGame.js
    ├── HorseRacingGame.js
    ├── JackpotGame.js
    ├── LotteryGame.js
    ├── RushHourGame.js
    ├── FruitSlotsGame.js
    ├── DiamondSlotsGame.js
    ├── MegaSpinGame.js
    ├── Lucky7Game.js
    ├── TreasureHuntGame.js
    ├── FiveCardDrawGame.js
    ├── OmahaPokerGame.js
    ├── RedDogGame.js
    ├── PaiGowGame.js
    ├── GinRummyGame.js
    ├── HeartsGame.js
    ├── SpadesGame.js
    ├── CribbageGame.js
    ├── SicBoGame.js
    ├── ChuckALuckGame.js
    ├── CrapsGame.js
    ├── BingoGame.js
    ├── SpinTheWheelGame.js
    ├── MinesweeperGame.js
    ├── SudokuGame.js
    ├── Two048Game.js
    ├── TetrisGame.js
    ├── WordSearchGame.js
    ├── CrosswordGame.js
    ├── HangmanGame.js
    ├── AirHockeyGame.js
    ├── BasketballShootoutGame.js
    ├── TableTennisGame.js
    ├── SnakeGame.js
    ├── FlappyBirdGame.js
    ├── DailyDrawGame.js
    ├── RaffleGame.js
    ├── InstantBingoGame.js
    ├── PullTabsGame.js
    ├── FortuneCookieGame.js
    ├── OthelloGame.js
    ├── GoGame.js
    ├── BattleshipGame.js
    ├── MastermindGame.js
    ├── DominoesGame.js
    ├── ThreeCardPokerGame.js
    ├── LetItRideGame.js
    ├── CaribbeanStudGame.js
    ├── PaiGowPokerGame.js
    ├── CasinoWarGame.js
    ├── PongGame.js
    ├── BreakoutGame.js
    ├── SpaceInvadersGame.js
    ├── PacManGame.js
    └── FroggerGame.js


## 🎯 How to Play

1. **Open** `index.html` in any modern browser.
2. **Navigate** using the sidebar or top menu.
3. **Select a game** from the Games page – it will load dynamically.
4. **Place a bet** (most games have a bet input) and play.
5. **Your balance** is displayed at the top and updates automatically.
6. **Check your stats** on the Dashboard page.
7. **Complete daily challenges** to earn bonus balance.

## 🛠️ Development

### Adding a New Game

1. Create a new file in `/games` named `YourGame.js`.
2. Import `BaseGame` and extend it.
3. Implement the required methods:
   - `mount(container)`: renders the game UI and attaches events.
   - `unmount()`: cleans up (optional, but recommended).
4. Add an entry in `main.js` inside the `allGames` array:
   ```javascript
   { name: 'Your Game', className: 'YourGame', category: 'slots' }