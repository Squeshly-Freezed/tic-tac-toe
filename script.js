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
            return;
        }
        if (array[spot].getValue() === 0) {
            array[spot].addValue(player);
            return true;

        } else {
            console.log("retry placement");
            if (isComputer) placeMarker(player, spot === 0 ? 8 : --spot, isComputer);
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

    const updateScreen = () => {
        gameContainerDiv.textContent = "";
        board.getBoard().forEach((spot, index) => {
            const button = document.createElement("button");
            button.classList.add("cell");
            button.dataset.index = index;
            button.textContent = spot;
            gameContainerDiv.appendChild(button);
        });
        player1Div.textContent = game.player1.name;
        player2Div.textContent = game.player2.name;
        player1ScoreDiv.textContent = `Score: ${game.player1.getScore()}`;
        player2ScoreDiv.textContent = `Score: ${game.player2.getScore()}`;
        playerDrawsDiv.textContent = `Draws: ${game.player1.getDraws()}`;
    }

    function clickBoardHandler (e) {
        const spot = e.target.dataset.index;
        if (!spot) return;
        if (game.getWinningPlayer() || game.getIsDraw()) return;
        game.playRound(spot);
        updateScreen();
    }
    gameContainerDiv.addEventListener("click", clickBoardHandler);

    function resetButtonHandler () {
        game.resetGame();
        updateScreen();
        console.log("successful reset");
    }
    resetButton.addEventListener("click", resetButtonHandler);

    updateScreen();
}

const game = (function GameController() {
    const player1 = Player("Rob", 1);
    const player2 = Player("AI", 2);

    let activePlayer = player1;
    let winningPlayer = false;
    let isDraw = false;

    const getActivePlayer = () => activePlayer;
    const getWinningPlayer = () => winningPlayer;
    const getIsDraw = () => isDraw;

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

    const playRound = (spot) => {
        let hasPlayed = board.placeMarker(getActivePlayer().symbol, spot, false);
        checkForWinner(getActivePlayer());
        if (winningPlayer || isDraw) return;
        switchPlayerTurn();
        if (hasPlayed) board.placeMarker(getActivePlayer().symbol, computerChooseSpot(), true);
        checkForWinner(getActivePlayer());
        if (winningPlayer || isDraw) return;
        switchPlayerTurn();
    }

    const resetGame = () => {
        activePlayer = player1;
        winningPlayer = false;
        isDraw = false;
        board.resetBoard();
    }

    return {
        getActivePlayer,
        getWinningPlayer,
        getIsDraw,
        playRound,
        resetGame,
        player1,
        player2,
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