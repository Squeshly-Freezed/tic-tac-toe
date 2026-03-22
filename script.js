"use strict"

function Gameboard() {
    const array = [];
    for (let i = 0; i < 9; i++) {
        array.push(Cell());
    }

    const getBoard = () => array.map(index => index.getValue());

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
        placeMarker,
        printBoard,
    };
}

function GameController() {
    const board = Gameboard();
    const player1 = Player("Rob", 1);
    const player2 = Player("AI", 2);

    let activePlayer = player1;
    let winningPlayer;

    const getActivePlayer = () => activePlayer;
    const getWinningPlayer = () => winningPlayer;

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
        if (winningPlayer) return;
        await wait(1200);
        switchPlayerTurn();
        console.log(`${getActivePlayer().name}'s Turn`);
        board.placeMarker(getActivePlayer().symbol, computerChooseSpot());
        printNewRound();
        checkForWinner(getActivePlayer());
        if (winningPlayer) return;
        switchPlayerTurn();
        await wait(1200);
    }

    return {
        getActivePlayer,
        getWinningPlayer,
        playRound,
    }
}

function Player(name, symbol) {
    const score = 0;
    const draws = 0;
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
    const game = GameController();
    while (!game.getWinningPlayer()) await game.playRound();
}

run();