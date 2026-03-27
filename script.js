"use strict";

const board = (function Gameboard() {
    const array = [];
    for (let i = 0; i < 9; i++) {
        array.push(Cell());
    }

    const getBoard = () => array.map(spot => spot.getValue());

    const isBoardFull = () => array.every(spot => spot.getValue() !== 0);

    const placeMarker = (player, spot) => {
        if (isBoardFull()) {
            console.log("Board is full");
            return;
        }
        if (array[spot].getValue() === 0) {
            array[spot].addValue(player);
        } else {
            console.log("retry placement");
            placeMarker(player, spot === 0 ? 8 : --spot);
        }
    };

    const printBoard = () => console.log(`${getBoard().slice(0, 3)}\n${getBoard().slice(3, 6)}\n${getBoard().slice(6, 9)}`);

    return { 
        getBoard,
        isBoardFull,
        placeMarker,
        printBoard,
    };
})();

function ScreenController() {
    const playerTurnDiv = document.querySelector(".player-turn");
    const player1Div = document.querySelector(".player-1");
    const player1ScoreDiv = document.querySelector(".player-1-score");
    const playerDrawsDiv = document.querySelector(".player-draws");
    const player2ScoreDiv = document.querySelector(".player-2-score");
    const playerTurnsDiv = document.querySelector(".player-turns");
    const gameContainerDiv = document.querySelector(".game-container");
    const startButton = document.querySelector(".start-button");
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
    }

    function clickBoardHandler (e) {
        const spot = e.target.dataset.index;
        if (!spot) return;
        game.playRound(spot);
        updateScreen();
    }
    gameContainerDiv.addEventListener("click", clickBoardHandler);

    updateScreen();
}

const game = (function GameController() {
    const player1 = Player("Rob", 1);
    const player2 = Player("AI", 2);

    let activePlayer = player1;
    let winningPlayer;
    let isDraw = false;

    const getActivePlayer = () => activePlayer;
    const getWinningPlayer = () => winningPlayer;
    const getIsDraw = () => isDraw;

    const switchPlayerTurn = () => activePlayer = activePlayer === player1 ? player2 : player1;

    const printNewRound = () => board.printBoard();

    const checkForWinner = (player) => {
        const winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
            [0, 4, 8], [2, 4, 6]             // diagonals
        ];
        const hasWon = winningCombinations.some(combo => combo.every(index => board.getBoard()[index] === player.symbol));

        if (hasWon) {
            winningPlayer = activePlayer;
            console.log(`${player.name} is winner!`);
            return;
        }

        if (board.isBoardFull()) {
            console.log("The game is a tie.");
            player1.draws++;
            player2.draws++;
            console.log(`Player 1 has: ${player1.draws} draws.`);
            isDraw = true;
        }
    }

    const chooseSpot = () => {
        const spot = parseInt(prompt("Put marker at index: ?"));
        return spot;
    }

    const computerChooseSpot = () => {
        const spot = Math.floor(Math.random() * 9);
        return spot;
    }

    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const playRound = async (spot) => {
        console.log("Start Round");
        console.log(`${getActivePlayer().name}'s Turn`);
        board.placeMarker(getActivePlayer().symbol, chooseSpot());
        printNewRound();
        checkForWinner(getActivePlayer());
        if (winningPlayer || isDraw) return;
        await wait(1200);
        switchPlayerTurn();
        console.log(`${getActivePlayer().name}'s Turn`);
        board.placeMarker(getActivePlayer().symbol, computerChooseSpot());
        printNewRound();
        checkForWinner(getActivePlayer());
        if (winningPlayer || isDraw) return;
        switchPlayerTurn();
        await wait(1200);
    }

    return {
        getActivePlayer,
        getWinningPlayer,
        getIsDraw,
        playRound,
    }
})();

function Player(name, symbol) {
    let score = 0;
    let draws = 0;
    return {
        name,
        symbol,
        score,
        draws,
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

const run = async () => {
    // while (!game.getWinningPlayer() && !game.getIsDraw()) {
    while (!game.getWinningPlayer() && !game.getIsDraw()) {
        await game.playRound();
        // ScreenController();
    }
}

run();
// ScreenController();