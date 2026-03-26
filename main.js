// main.js – Aduk Games Modular Platform (Full 75 Games)

// ========== GLOBAL STATE ==========
window.balance = 1000;
window.currentGame = null;
window.allGames = [];

// Update balance displays on home and dashboard
window.updateGlobalBalance = function() {
    const homeBalance = document.getElementById('global-balance');
    if (homeBalance) homeBalance.textContent = window.balance;
    const dashBalance = document.getElementById('dashboard-balance');
    if (dashBalance) dashBalance.textContent = window.balance;
};

// ========== PAGE SWITCHING ==========
window.switchPage = function(page) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const pageEl = document.getElementById(page + '-page');
    if (pageEl) pageEl.classList.add('active');

    if (page !== 'games' && window.currentGame) {
        if (window.currentGame.unmount) window.currentGame.unmount();
        window.currentGame = null;
    }

    document.querySelectorAll('.sidebar a').forEach(a => a.classList.remove('active'));
    let sidebarLinks = document.querySelectorAll('.sidebar a');
    for (let link of sidebarLinks) {
        if (link.textContent.trim().toLowerCase() === page) {
            link.classList.add('active');
            break;
        }
    }
};

// ========== GAME LIST RENDERING ==========
function renderGameList() {
    const searchInput = document.getElementById('game-search');
    const categorySelect = document.getElementById('game-category-filter');
    if (!searchInput || !categorySelect) return;

    const searchTerm = searchInput.value.toLowerCase();
    const selectedCategory = categorySelect.value;

    const filtered = window.allGames.filter(game => {
        const matchesSearch = game.name.toLowerCase().includes(searchTerm);
        const matchesCategory = selectedCategory === 'all' || game.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const gameListEl = document.getElementById('game-list');
    if (!gameListEl) return;
    gameListEl.innerHTML = '';

    filtered.forEach(game => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = '#';
        a.textContent = game.name;
        a.dataset.index = window.allGames.indexOf(game);
        a.addEventListener('click', (e) => {
            e.preventDefault();
            const idx = parseInt(e.target.dataset.index);
            loadGame(idx, window.allGames[idx].className);
        });
        li.appendChild(a);
        gameListEl.appendChild(li);
    });
}

// ========== DYNAMIC GAME LOADING ==========
async function loadGame(index, className) {
    if (window.currentGame && window.currentGame.unmount) {
        window.currentGame.unmount();
    }

    const container = document.getElementById('game-container');
    if (!container) return;

    const spinner = document.getElementById('loading-spinner');
    if (spinner) spinner.style.display = 'block';

    try {
        if (className) {
            const module = await import(`./games/${className}.js`);
            const GameClass = module[className];
            const game = new GameClass();
            game.mount(container);
            window.currentGame = game;

            const gameId = window.allGames[index].name.toLowerCase().replace(/[^a-z]/g, '');
            checkFirstTime(gameId);
        } else {
            container.innerHTML = '<p style="color: var(--text-secondary); text-align: center; margin-top: 2rem;">This game is not implemented in the demo. Check back later!</p>';
        }
    } catch (err) {
        console.error('Error loading game:', err);
        container.innerHTML = '<p style="color: var(--text-secondary); text-align: center; margin-top: 2rem;">Error loading game. Please try again.</p>';
    } finally {
        if (spinner) spinner.style.display = 'none';
    }
}

// ========== GAME LIST INITIALISATION (75 Games) ==========
function initGamesList() {
    window.allGames = [
        // ===== ORIGINAL 25 IMPLEMENTED GAMES =====
        { name: 'Slot Machine', className: 'SlotGame', category: 'slots' },
        { name: 'Crash Game', className: 'CrashGame', category: 'arcade' },
        { name: 'Dice', className: 'DiceGame', category: 'skill' },
        { name: 'Roulette', className: 'RouletteGame', category: 'arcade' },
        { name: 'Keno', className: 'KenoGame', category: 'lottery' },
        { name: 'Scratch Card', className: 'ScratchGame', category: 'slots' },
        { name: 'Wheel of Fortune', className: 'WheelGame', category: 'slots' },
        { name: 'Blackjack', className: 'BlackjackGame', category: 'card' },
        { name: 'Poker', className: 'PokerGame', category: 'card' },
        { name: 'Baccarat', className: 'BaccaratGame', category: 'card' },
        { name: 'Teen Patti', className: 'TeenPattiGame', category: 'card' },
        { name: 'Video Poker', className: 'VideoPokerGame', category: 'card' },
        { name: 'War', className: 'WarGame', category: 'card' },
        { name: 'Solitaire', className: 'SolitaireGame', category: 'card' },
        { name: 'Tic-Tac-Toe', className: 'TicTacToeGame', category: 'skill' },
        { name: 'Chess', className: 'ChessGame', category: 'skill' },
        { name: 'Checkers', className: 'CheckersGame', category: 'skill' },
        { name: 'Connect Four', className: 'Connect4Game', category: 'skill' },
        { name: 'Backgammon', className: 'BackgammonGame', category: 'skill' },
        { name: 'Memory Match', className: 'MemoryGame', category: 'skill' },
        { name: '2D Soccer', className: 'SoccerGame', category: 'arcade' },
        { name: 'Horse Racing', className: 'HorseRacingGame', category: 'arcade' },
        { name: 'Progressive Jackpot', className: 'JackpotGame', category: 'slots' },
        { name: 'Lottery', className: 'LotteryGame', category: 'lottery' },
        { name: 'Rush Hour', className: 'RushHourGame', category: 'skill' },

        // ===== 50 NEWLY IMPLEMENTED GAMES =====
        { name: 'Fruit Slots', className: 'FruitSlotsGame', category: 'slots' },
        { name: 'Diamond Slots', className: 'DiamondSlotsGame', category: 'slots' },
        { name: 'Mega Spin', className: 'MegaSpinGame', category: 'slots' },
        { name: 'Lucky 7', className: 'Lucky7Game', category: 'slots' },
        { name: 'Treasure Hunt', className: 'TreasureHuntGame', category: 'slots' },
        { name: 'Poker – 5 Card Draw', className: 'FiveCardDrawGame', category: 'card' },
        { name: 'Poker – Omaha', className: 'OmahaPokerGame', category: 'card' },
        { name: 'Red Dog', className: 'RedDogGame', category: 'card' },
        { name: 'Pai Gow', className: 'PaiGowGame', category: 'card' },
        { name: 'Gin Rummy', className: 'GinRummyGame', category: 'card' },
        { name: 'Hearts', className: 'HeartsGame', category: 'card' },
        { name: 'Spades', className: 'SpadesGame', category: 'card' },
        { name: 'Cribbage', className: 'CribbageGame', category: 'card' },
        { name: 'Sic Bo', className: 'SicBoGame', category: 'arcade' },
        { name: 'Chuck‑a‑Luck', className: 'ChuckALuckGame', category: 'arcade' },
        { name: 'Craps (Simplified)', className: 'CrapsGame', category: 'arcade' },
        { name: 'Bingo', className: 'BingoGame', category: 'lottery' },
        { name: 'Spin the Wheel', className: 'SpinTheWheelGame', category: 'slots' },
        { name: 'Minesweeper', className: 'MinesweeperGame', category: 'skill' },
        { name: 'Sudoku', className: 'SudokuGame', category: 'skill' },
        { name: '2048', className: 'Two048Game', category: 'skill' },
        { name: 'Tetris (simple)', className: 'TetrisGame', category: 'skill' },
        { name: 'Word Search', className: 'WordSearchGame', category: 'skill' },
        { name: 'Crossword', className: 'CrosswordGame', category: 'skill' },
        { name: 'Hangman', className: 'HangmanGame', category: 'skill' },
        { name: 'Air Hockey', className: 'AirHockeyGame', category: 'arcade' },
        { name: 'Basketball Shootout', className: 'BasketballShootoutGame', category: 'arcade' },
        { name: 'Table Tennis', className: 'TableTennisGame', category: 'arcade' },
        { name: 'Snake', className: 'SnakeGame', category: 'arcade' },
        { name: 'Flappy Bird Clone', className: 'FlappyBirdGame', category: 'arcade' },
        { name: 'Daily Draw', className: 'DailyDrawGame', category: 'lottery' },
        { name: 'Raffle', className: 'RaffleGame', category: 'lottery' },
        { name: 'Instant Bingo', className: 'InstantBingoGame', category: 'lottery' },
        { name: 'Pull Tabs', className: 'PullTabsGame', category: 'slots' },
        { name: 'Fortune Cookie', className: 'FortuneCookieGame', category: 'other' },
        { name: 'Othello (Reversi)', className: 'OthelloGame', category: 'skill' },
        { name: 'Go', className: 'GoGame', category: 'skill' },
        { name: 'Battleship', className: 'BattleshipGame', category: 'skill' },
        { name: 'Mastermind', className: 'MastermindGame', category: 'skill' },
        { name: 'Dominoes', className: 'DominoesGame', category: 'skill' },
        { name: 'Three Card Poker', className: 'ThreeCardPokerGame', category: 'card' },
        { name: 'Let It Ride', className: 'LetItRideGame', category: 'card' },
        { name: 'Caribbean Stud', className: 'CaribbeanStudGame', category: 'card' },
        { name: 'Pai Gow Poker', className: 'PaiGowPokerGame', category: 'card' },
        { name: 'Casino War', className: 'CasinoWarGame', category: 'card' },
        { name: 'Pong', className: 'PongGame', category: 'arcade' },
        { name: 'Breakout', className: 'BreakoutGame', category: 'arcade' },
        { name: 'Space Invaders', className: 'SpaceInvadersGame', category: 'arcade' },
        { name: 'Pac‑Man (simple)', className: 'PacManGame', category: 'arcade' },
        { name: 'Frogger', className: 'FroggerGame', category: 'arcade' }
    ];
    renderGameList();
}

// ========== FAQ TOGGLE ==========
window.toggleFaq = function(button) {
    let answer = button.nextElementSibling;
    let span = button.querySelector('span');
    if (answer.style.display === 'none' || answer.style.display === '') {
        answer.style.display = 'block';
        span.textContent = '−';
    } else {
        answer.style.display = 'none';
        span.textContent = '+';
    }
};

// ========== PAYMENT METHOD HANDLER ==========
window.selectMethod = function(method) {
    document.querySelectorAll('.method-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    let phoneField = document.getElementById('phone-field');
    let withdrawPhone = document.getElementById('withdraw-phone-field');
    if (method === 'ecocash' || method === 'onemoney') {
        if (phoneField) phoneField.style.display = 'block';
        if (withdrawPhone) withdrawPhone.style.display = 'block';
    } else {
        if (phoneField) phoneField.style.display = 'none';
        if (withdrawPhone) withdrawPhone.style.display = 'none';
    }
};

// ========== AVATAR ==========
function loadAvatar() {
    const saved = localStorage.getItem('userAvatar');
    const avatar = saved || '😎';
    const userAvatar = document.getElementById('user-avatar');
    if (userAvatar) userAvatar.textContent = avatar;
    const profilePreview = document.getElementById('profile-avatar-preview');
    if (profilePreview) profilePreview.textContent = avatar;
}
function saveAvatar(emoji) {
    localStorage.setItem('userAvatar', emoji);
    loadAvatar();
}
function initAvatarSelector() {
    document.querySelectorAll('.avatar-option').forEach(opt => {
        opt.addEventListener('click', () => saveAvatar(opt.textContent));
    });
}

// ========== FEEDBACK FORM ==========
function setupFeedbackForm() {
    const form = document.getElementById('feedback-form');
    if (!form) return;
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('fb-name').value;
        const email = document.getElementById('fb-email').value;
        const game = document.getElementById('fb-game').value;
        const msg = document.getElementById('fb-message').value;
        const subj = encodeURIComponent(`Feedback - ${game}`);
        const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nGame: ${game}\n\nFeedback:\n${msg}`);
        window.location.href = `mailto:adukstudios@gmail.com?subject=${subj}&body=${body}`;
        const statusDiv = document.getElementById('feedback-status');
        if (statusDiv) statusDiv.textContent = 'Thank you! Your feedback will be sent via your email client.';
        form.reset();
    });
}

// ========== DAILY CHALLENGE ==========
function initDailyChallenge() {
    const spinBtn = document.getElementById('daily-spin');
    if (!spinBtn) return;
    const resultDiv = document.getElementById('daily-result');
    const messageDiv = document.getElementById('daily-message');
    const statusDiv = document.getElementById('daily-status');

    function canSpin() {
        const last = localStorage.getItem('dailyLastSpin');
        if (!last) return true;
        return new Date(last).toDateString() !== new Date().toDateString();
    }
    function updateUI() {
        if (canSpin()) {
            spinBtn.disabled = false;
            if (statusDiv) statusDiv.textContent = 'You can spin today!';
        } else {
            spinBtn.disabled = true;
            if (statusDiv) statusDiv.textContent = 'You already spun today. Come back tomorrow!';
        }
    }
    spinBtn.addEventListener('click', () => {
        if (!canSpin()) return;
        const rewards = [10, 20, 50, 5, 100];
        const reward = rewards[Math.floor(Math.random() * rewards.length)];
        window.balance += reward;
        window.updateGlobalBalance();
        if (resultDiv) resultDiv.textContent = `$${reward}`;
        if (messageDiv) messageDiv.textContent = `Congratulations! You won $${reward} bonus!`;
        localStorage.setItem('dailyLastSpin', new Date().toISOString());
        updateUI();
    });
    updateUI();
}

// ========== SOCIAL SHARING ==========
window.shareOnTwitter = function() {
    const text = encodeURIComponent(`I just won $${window.balance} playing at Aduk Games! 🎉`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(window.location.href)}`, '_blank');
};
window.shareOnFacebook = function() {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
};
window.shareOnWhatsApp = function() {
    const text = encodeURIComponent(`Check out Aduk Games! I just won $${window.balance}! 🎮`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
};
window.shareGeneral = function() {
    if (navigator.share) {
        navigator.share({
            title: 'Aduk Games',
            text: `I just won $${window.balance} at Aduk Games!`,
            url: window.location.href
        }).catch(console.error);
    } else {
        alert('Your browser does not support the Web Share API. Try the other buttons!');
    }
};

// ========== SELF EXCLUSION ==========
window.selfExclusion = function() {
    const duration = document.getElementById('selfexclusion-duration').value;
    const reason = document.getElementById('selfexclusion-reason').value;
    const statusDiv = document.getElementById('selfexclusion-status');
    if (statusDiv) statusDiv.textContent = `Self‑exclusion (${duration}) applied. You will be logged out.`;
    setTimeout(() => {
        window.switchPage('home');
    }, 2000);
};

// ========== TUTORIAL ==========
const tutorials = {
    slotmachine: { title: 'Slot Machine', content: 'Spin the reels and match symbols. Three identical symbols win big!' },
    crashgame: { title: 'Crash Game', content: 'Cash out before it crashes! The longer you wait, the higher the multiplier.' },
    dice: { title: 'Dice', content: 'Bet on over/under, odd/even, or a specific number.' },
    roulette: { title: 'Roulette', content: 'Bet on a number (0‑36). If the ball lands on your number, you win 35× your bet.' },
    keno: { title: 'Keno', content: 'Pick 5 numbers. 20 are drawn. Match 3, 4, or 5 to win multipliers up to 100×.' },
    scratch: { title: 'Scratch Card', content: 'Reveal three symbols. If all match, you win 3× your bet.' },
    wheel: { title: 'Wheel of Fortune', content: 'Spin the wheel and win a multiplier. Segments: 0x, 1x, 2x, 3x, 5x, 10x.' },
    blackjack: { title: 'Blackjack', content: 'Beat the dealer without going over 21. Aces are 1 or 11, face cards are 10. Hit or stand.' },
    poker: { title: 'Poker', content: '5‑card draw. Try to make the best hand – pair, two pair, three of a kind pay multipliers.' },
    baccarat: { title: 'Baccarat', content: 'Bet on Player, Banker, or Tie. Cards are valued; face cards count as 0. The closest to 9 wins.' },
    teenpatti: { title: 'Teen Patti', content: 'Three‑card hand ranking: Trail > Pure Sequence > Sequence > Color > Pair > High. Beat the AI.' },
    videopoker: { title: 'Video Poker', content: 'Draw 5 cards, choose which to hold, and draw again. Make a poker hand to win.' },
    war: { title: 'War', content: 'You and the AI each draw a card. Higher card wins. On tie, war begins!' },
    solitaire: { title: 'Solitaire', content: 'Classic Klondike. Build foundations from Ace to King. Click stock to draw, drag cards to tableau.' },
    tictactoe: { title: 'Tic‑Tac‑Toe', content: 'Two‑player classic. Get three in a row horizontally, vertically, or diagonally.' },
    chess: { title: 'Chess', content: 'Standard chess rules (simplified). Move pieces to checkmate the opponent\'s king.' },
    checkers: { title: 'Checkers', content: 'Jump and capture opponent\'s pieces. Get to the opposite side to become a king.' },
    connect4: { title: 'Connect Four', content: 'Drop discs and try to connect four in a row – horizontally, vertically, or diagonally.' },
    backgammon: { title: 'Backgammon', content: 'Roll dice and move your checkers. Bear off all pieces to win. Simplified for demo.' },
    memory: { title: 'Memory Match', content: 'Flip cards to find matching pairs. Test your memory in this classic game.' },
    soccer: { title: '2D Soccer', content: 'Pong‑style soccer. Control your paddle with W/S (left) or ↑/↓ (right). First to 5 goals wins.' },
    horseracing: { title: 'Horse Racing', content: 'Pick a horse and watch the race. If your horse finishes first, you win 5× your bet.' },
    jackpot: { title: 'Progressive Jackpot', content: 'Slot machine where 10% of each bet adds to the jackpot. Land three 💰 symbols to win the entire pot!' },
    lottery: { title: 'Lottery', content: 'Pick 5 numbers (1‑50). If your numbers match the drawn ones, win multipliers for 3, 4, or 5 matches.' },
    rushhour: { title: 'Rush Hour', content: 'Slide the red car to the exit. Move other vehicles out of the way.' },
    fruitslots: { title: 'Fruit Slots', content: 'Classic fruit machine with juicy payouts. Match three fruits to win!' },
    diamondslots: { title: 'Diamond Slots', content: 'Sparkling diamond-themed slots with high multipliers.' },
    megaspin: { title: 'Mega Spin', content: '5‑reel slot with mega payouts for matching 4 or 5 symbols.' },
    lucky7: { title: 'Lucky 7', content: 'Land the lucky 7 for huge wins! Any 7 gives a consolation prize.' },
    treasurehunt: { title: 'Treasure Hunt', content: 'Pick a chest to find the hidden treasure. 5x payout if you find it.' },
    fivecarddraw: { title: '5-Card Draw Poker', content: 'Draw poker: hold cards and draw new ones. Pairs and up pay out.' },
    omahapoker: { title: 'Omaha Poker', content: 'Use 2 of your 4 hole cards with 3 community cards to make the best hand.' },
    reddog: { title: 'Red Dog', content: 'Spread bet between two cards. Raise if the third card falls between them.' },
    paigow: { title: 'Pai Gow', content: '7‑card hand split into 5‑card and 2‑card hands. Beat the banker.' },
    ginrummy: { title: 'Gin Rummy', content: 'Draw and discard to form melds. Score points against the AI.' },
    hearts: { title: 'Hearts', content: 'Avoid taking hearts. Player with fewest hearts wins.' },
    spades: { title: 'Spades', content: 'Spades are trump. Win tricks to score points.' },
    cribbage: { title: 'Cribbage', content: 'Score points for 15s, pairs, and runs. Beat the AI to win.' },
    sicbo: { title: 'Sic Bo', content: 'Bet on small, big, or triple. Roll three dice and win big.' },
    chuckaluck: { title: 'Chuck‑a‑Luck', content: 'Pick a number and win based on how many dice show it.' },
    craps: { title: 'Craps', content: 'Come‑out roll: win on 7/11, lose on 2/3/12. Point rolls continue.' },
    bingo: { title: 'Bingo', content: 'Mark numbers as they are drawn. Complete a line to win.' },
    spinthewheel: { title: 'Spin the Wheel', content: 'Spin for a multiplier up to 10x your bet.' },
    minesweeper: { title: 'Minesweeper', content: 'Avoid mines! Clear all safe cells to win.' },
    sudoku: { title: 'Sudoku', content: 'Fill the grid so every row, column, and 3x3 box contains 1‑9.' },
    '2048': { title: '2048', content: 'Combine tiles to reach 2048. Use arrow keys to move.' },
    tetris: { title: 'Tetris', content: 'Rotate and place falling blocks to complete lines.' },
    wordsearch: { title: 'Word Search', content: 'Find all hidden words in the grid.' },
    crossword: { title: 'Crossword', content: 'Fill in the grid using the clues.' },
    hangman: { title: 'Hangman', content: 'Guess the word before you run out of tries.' },
    airhockey: { title: 'Air Hockey', content: 'Two‑player air hockey. First to 5 wins.' },
    basketballshootout: { title: 'Basketball Shootout', content: 'Click to shoot the ball into the hoop. Score 10 to win.' },
    tabletennis: { title: 'Table Tennis', content: 'Pong‑style table tennis against AI. First to 5 wins.' },
    snake: { title: 'Snake', content: 'Eat the food to grow. Don’t hit the walls or yourself.' },
    flappybird: { title: 'Flappy Bird', content: 'Tap to keep the bird flying through pipes. Score 10 to win.' },
    dailydraw: { title: 'Daily Draw', content: 'Pick 3 numbers. Match the daily draw for prizes. Once per day.' },
    raffle: { title: 'Raffle', content: 'Buy a ticket for a chance to win $50. 10% chance.' },
    instantbingo: { title: 'Instant Bingo', content: 'Instant bingo card. Draw numbers and try to get a line.' },
    pulltabs: { title: 'Pull Tabs', content: 'Buy a tab and pull it to reveal a prize.' },
    fortunecookie: { title: 'Fortune Cookie', content: 'Open a cookie for a fortune and a chance at a small prize.' },
    othello: { title: 'Othello', content: 'Flip your opponent’s discs. Most discs wins.' },
    go: { title: 'Go', content: 'Place stones to surround territory. Simple 9x9 board.' },
    battleship: { title: 'Battleship', content: 'Click enemy grid to fire. Sink all ships to win.' },
    mastermind: { title: 'Mastermind', content: 'Guess the 4‑color code. Feedback shows exact and color matches.' },
    dominoes: { title: 'Dominoes', content: 'Match domino ends to play. First to empty hand wins.' },
    threecardpoker: { title: 'Three Card Poker', content: 'Compare 3‑card hands with dealer. Beat the dealer to win.' },
    letitride: { title: 'Let It Ride', content: 'Decide to let your bet ride after each of two cards.' },
    caribbeanstud: { title: 'Caribbean Stud', content: '5‑card stud poker. Dealer must qualify with Ace‑King or better.' },
    paigowpoker: { title: 'Pai Gow Poker', content: 'Make 5‑card and 2‑card hands. Beat both to win.' },
    casinowar: { title: 'Casino War', content: 'High card wins. Tie means war – double your bet.' },
    pong: { title: 'Pong', content: 'Classic arcade pong. First to 5 points wins.' },
    breakout: { title: 'Breakout', content: 'Bounce the ball to break all bricks.' },
    spaceinvaders: { title: 'Space Invaders', content: 'Shoot down all aliens before they reach you.' },
    pacman: { title: 'Pac‑Man', content: 'Eat all dots while avoiding ghosts. Simple grid.' },
    frogger: { title: 'Frogger', content: 'Cross the road avoiding cars to reach the top.' }
};

window.showTutorial = function(gameId) {
    const modal = document.getElementById('tutorial-modal');
    const title = document.getElementById('tutorial-title');
    const content = document.getElementById('tutorial-content');
    const tutorial = tutorials[gameId];
    if (!tutorial) return;
    title.textContent = tutorial.title;
    content.textContent = tutorial.content;
    modal.style.display = 'flex';
};
window.hideTutorial = function() {
    document.getElementById('tutorial-modal').style.display = 'none';
};
function checkFirstTime(gameId) {
    if (!localStorage.getItem('tutorial_' + gameId)) {
        window.showTutorial(gameId);
        localStorage.setItem('tutorial_' + gameId, 'seen');
    }
}

// ========== SERVICE WORKER REGISTRATION ==========
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(err => console.log('SW registration failed:', err));
}

// ========== DEPOSIT / WITHDRAW FORM HANDLERS ==========
function setupDepositForm() {
    const form = document.getElementById('deposit-form');
    if (!form) return;
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const amount = document.getElementById('deposit-amount').value;
        const statusDiv = document.getElementById('deposit-status');
        if (statusDiv) statusDiv.textContent = `Deposit of $${amount} initiated (demo).`;
        form.reset();
    });
}
function setupWithdrawForm() {
    const form = document.getElementById('withdraw-form');
    if (!form) return;
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const amount = document.getElementById('withdraw-amount').value;
        const statusDiv = document.getElementById('withdraw-status');
        if (statusDiv) statusDiv.textContent = `Withdrawal request for $${amount} submitted (demo).`;
        form.reset();
    });
}
function setupSupportForm() {
    const form = document.getElementById('support-contact-form');
    if (!form) return;
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Support message sent (demo). We will get back to you soon.');
        form.reset();
    });
}

// ========== INITIALISATION ==========
document.addEventListener('DOMContentLoaded', () => {
    initGamesList();
    window.updateGlobalBalance();
    setupFeedbackForm();
    loadAvatar();
    initAvatarSelector();
    initDailyChallenge();
    setupDepositForm();
    setupWithdrawForm();
    setupSupportForm();

    const searchInput = document.getElementById('game-search');
    if (searchInput) searchInput.addEventListener('input', renderGameList);
    const catFilter = document.getElementById('game-category-filter');
    if (catFilter) catFilter.addEventListener('change', renderGameList);

    window.switchPage('home');
});