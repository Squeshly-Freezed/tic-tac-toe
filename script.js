"use strict";

const board = (function Gameboard() {
    const array = [];
    for (let i = 0; i < 9; i++) {
        array.push(Cell());
    }

    const getBoard = () => array.map(spot => spot.getValue());

    const isBoardFull = () => array.every(spot => spot.getValue() !== 0);

    const resetBoard = () => array.forEach(spot => spot.addValue(0));

    const placeMarker = (player, spot, isComputer) => {
        if (isBoardFull()) {
            console.log("Board is full");
            return false;
        }
        if (array[spot].getValue() === 0) {
            array[spot].addValue(player);
            return true;

        } else {
            console.log("retry placement");
            if (isComputer) return placeMarker(player, spot === 0 ? 8 : --spot, isComputer);
            return false;
        }
    };

    return { 
        getBoard,
        isBoardFull,
        resetBoard,
        placeMarker,
    };
})();

function ScreenController() {
    const player1Div = document.querySelector(".player-1");
    const player2Div = document.querySelector(".player-2");
    const player1ScoreDiv = document.querySelector(".player-1-score");
    const playerDrawsDiv = document.querySelector(".player-draws");
    const player2ScoreDiv = document.querySelector(".player-2-score");
    const gameContainerDiv = document.querySelector(".game-container");
    const resetButton = document.querySelector(".reset-button");
    const svgBorder1 = document.querySelector(".player-1-container .svg-border");
    const svgBorder2 = document.querySelector(".player-2-container .svg-border");


    const updateScreen = () => {
        gameContainerDiv.textContent = "";
        board.getBoard().forEach((spot, index) => {
            const button = document.createElement("button");
            button.classList.add("cell");
            button.dataset.index = index;
            if (spot === 1) {
                button.innerHTML = `
                    <svg viewBox="0 0 100 100" width="100%" height="100%" style="position:absolute; top:0; left:0;">
                        <text class="marker markerX" x="50" y="50" fill="red" text-anchor="middle" 
                        dominant-baseline="middle" font-size="50">X</text>
                    </svg>`;
            } else if (spot === 2) {
                button.innerHTML = `
                    <svg viewBox="0 0 100 100" width="100%" height="100%" style="position:absolute; top:0; left:0;">
                        <text class="marker markerO" x="50" y="50" fill="cyan" text-anchor="middle" 
                        dominant-baseline="middle" font-size="50">O</text>
                    </svg>`;
            }
            gameContainerDiv.appendChild(button);
        });
        player1Div.textContent = game.getPlayer1().name;
        player2Div.textContent = game.getPlayer2().name;
        player1ScoreDiv.textContent = `SCORE: ${game.getPlayer1().getScore()}`;
        player2ScoreDiv.textContent = `SCORE: ${game.getPlayer2().getScore()}`;
        playerDrawsDiv.textContent = `TIES: ${game.getPlayer1().getDraws()}`;
        const isPlayer1Turn = game.getActivePlayer() === game.getPlayer1();
        const isPlayer2Turn = game.getActivePlayer() === game.getPlayer2();
        svgBorder1.style.animationPlayState = isPlayer1Turn ? "running" : "paused";
        svgBorder2.style.animationPlayState = isPlayer2Turn ? "running" : "paused";
    }

    let isPlayerTurn = true;
    const clickBoardHandler = async (e) => {
        if (!isPlayerTurn) return;
        const spot = e.target.dataset.index;
        if (!spot) return;
        if (game.getWinningPlayer() || game.getIsDraw()) return;
        isPlayerTurn = false;
        const hasPlayed = game.playerTurn(spot);
        if (!hasPlayed) {
            isPlayerTurn = true;
            return;
        }
        updateScreen();
        if (game.getWinningPlayer() || game.getIsDraw()) {
            isPlayerTurn = true;
            return;
        }
        await game.computerTurn();
        updateScreen();
        isPlayerTurn = true;
    }
    gameContainerDiv.addEventListener("click", clickBoardHandler);

    function resetButtonHandler () {
        game.resetGame();
        isPlayerTurn = true;
        updateScreen();
        console.log("successful reset");
    }
    resetButton.addEventListener("click", resetButtonHandler);

    window.addEventListener("contextmenu", (e) => e.preventDefault());

    updateScreen();
}

const game = (function GameController() {
    const player1 = Player("Rob", 1);
    const player2 = Player("AI", 2);

    let activePlayer = player1;
    let winningPlayer = false;
    let isDraw = false;
    let turnToken = 0;

    const getActivePlayer = () => activePlayer;
    const getWinningPlayer = () => winningPlayer;
    const getIsDraw = () => isDraw;
    const getPlayer1 = () => player1;
    const getPlayer2 = () => player2;
    

    const switchPlayerTurn = () => activePlayer = activePlayer === player1 ? player2 : player1;

    const checkForWinner = (player) => {
        const winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
            [0, 4, 8], [2, 4, 6]             // diagonals
        ];
        const hasWon = winningCombinations.some(combo => combo.every(index => board.getBoard()[index] === player.symbol));

        if (hasWon) {
            winningPlayer = activePlayer;
            winningPlayer.increaseScore();
            console.log("winner");
            return;
        }

        if (board.isBoardFull()) {
            console.log("The game is a tie.");
            player1.increaseDraws();
            isDraw = true;
        }
    }

    const computerChooseSpot = () => {
        const spot = Math.floor(Math.random() * 9);
        return spot;
    }

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const playerTurn = (spot) => {
        let hasPlayed = board.placeMarker(getActivePlayer().symbol, spot, false);
        if (hasPlayed) {
            checkForWinner(getActivePlayer());
            if (!winningPlayer && !isDraw) switchPlayerTurn();
        }
        return hasPlayed;
    }

    const computerTurn = async () => {
        const myToken = ++turnToken;
        if (playerTurn) {
            await delay(1500 + Math.random() * 1000);
            if (myToken !== turnToken) return;
            board.placeMarker(getActivePlayer().symbol, computerChooseSpot(), true);
            checkForWinner(getActivePlayer());
            if (winningPlayer || isDraw) return;
            switchPlayerTurn();
        }
    }

    const resetGame = () => {
        turnToken++;
        activePlayer = player1;
        winningPlayer = false;
        isDraw = false;
        board.resetBoard();
    }

    return {
        getActivePlayer,
        getWinningPlayer,
        getIsDraw,
        playerTurn,
        computerTurn,
        resetGame,
        getPlayer1,
        getPlayer2,
    }
})();

function Player(name, symbol) {
    let score = 0;
    let draws = 0;
    const getScore = () => score;
    const getDraws = () => draws;
    const increaseScore = () => ++score;
    const increaseDraws = () => ++draws;
    return {
        name,
        symbol,
        getScore,
        getDraws,
        increaseScore,
        increaseDraws,
    };
}

function Cell() {
    let value = 0;
    const addValue = (player) => value = player;
    const getValue = () => value;
    return {
        addValue,
        getValue,
    };
}

ScreenController();